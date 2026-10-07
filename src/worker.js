import { JOBS, AS_OF } from './jobs.js';

const COOKIE = 'jc_auth';
const ADMIN_COOKIE = 'jc_admin';
const MAX_FAILS = 10; // wrong PIN attempts allowed per IP per hour

const OPTIONS = {
  standard: ['Done', 'Not done – rebook', 'Not needed', 'Not sure'],
  quote: ['Quote sent', 'Need site visit', 'Waiting on PM', 'Decline'],
};
const optionsFor = (section) => (section === 'quote' ? OPTIONS.quote : OPTIONS.standard);
const JOB_BY_ID = new Map(JOBS.map((j) => [j.id, j]));

const json = (data, status = 200, headers = {}) =>
  new Response(JSON.stringify(data), {
    status,
    headers: { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store', ...headers },
  });

async function token(secret, label) {
  const key = await crypto.subtle.importKey('raw', new TextEncoder().encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
  const sig = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(label));
  return [...new Uint8Array(sig)].map((b) => b.toString(16).padStart(2, '0')).join('');
}

function getCookie(req, name) {
  const m = (req.headers.get('cookie') || '').match(new RegExp('(?:^|; )' + name + '=([^;]+)'));
  return m ? m[1] : null;
}

function safeEqual(a, b) {
  if (!a || !b || a.length !== b.length) return false;
  let r = 0;
  for (let i = 0; i < a.length; i++) r |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return r === 0;
}

async function isAuthed(req, env, admin = false) {
  const secret = admin ? env.ADMIN_PIN : env.APP_PIN;
  if (!secret) return false;
  return safeEqual(getCookie(req, admin ? ADMIN_COOKIE : COOKIE), await token(secret, admin ? 'jobcheck-admin-v1' : 'jobcheck-v1'));
}

async function tooManyFails(env, ip) {
  const row = await env.DB.prepare("SELECT COUNT(*) AS n FROM login_fails WHERE ip = ? AND at > datetime('now','-1 hour')").bind(ip).first();
  return (row?.n || 0) >= MAX_FAILS;
}

async function login(req, env, admin) {
  const ip = req.headers.get('cf-connecting-ip') || 'local';
  if (await tooManyFails(env, ip)) return json({ error: 'Too many wrong PINs. Try again in an hour.' }, 429);
  const { pin } = await req.json().catch(() => ({}));
  const secret = admin ? env.ADMIN_PIN : env.APP_PIN;
  if (!secret) return json({ error: 'PIN not set up yet.' }, 500);
  if (!safeEqual(String(pin || '').trim(), secret)) {
    await env.DB.prepare('INSERT INTO login_fails (ip) VALUES (?)').bind(ip).run();
    return json({ error: 'Wrong PIN' }, 401);
  }
  const t = await token(secret, admin ? 'jobcheck-admin-v1' : 'jobcheck-v1');
  const name = admin ? ADMIN_COOKIE : COOKIE;
  return json({ ok: true }, 200, {
    'set-cookie': `${name}=${t}; Path=/; Max-Age=${60 * 60 * 24 * 120}; HttpOnly; Secure; SameSite=Lax`,
  });
}

async function latestUpdates(env) {
  const { results } = await env.DB.prepare(
    `SELECT u.job_id, u.outcome, u.note, u.name, u.at, u.in_tapi
       FROM updates u
       JOIN (SELECT job_id, MAX(id) AS id FROM updates GROUP BY job_id) m ON m.id = u.id`
  ).all();
  return Object.fromEntries(results.map((r) => [r.job_id, r]));
}

async function listJobs(env) {
  const latest = await latestUpdates(env);
  return json({ asOf: AS_OF, options: OPTIONS, jobs: JOBS.map((j) => ({ ...j, update: latest[j.id] || null })) });
}

async function saveUpdate(req, env) {
  const body = await req.json().catch(() => ({}));
  const job = JOB_BY_ID.get(body.jobId);
  if (!job) return json({ error: 'Unknown job' }, 400);
  const outcome = String(body.outcome || '');
  if (!optionsFor(job.section).includes(outcome)) return json({ error: 'Pick one of the buttons' }, 400);
  const name = String(body.name || '').trim().slice(0, 60);
  if (!name) return json({ error: 'Please enter your name first' }, 400);
  const note = String(body.note || '').trim().slice(0, 1000);
  await env.DB.prepare('INSERT INTO updates (job_id, outcome, note, name) VALUES (?, ?, ?, ?)').bind(job.id, outcome, note, name).run();
  const latest = await latestUpdates(env);
  return json({ ok: true, update: latest[job.id] });
}

async function markInTapi(req, env) {
  const { jobId, inTapi } = await req.json().catch(() => ({}));
  if (!JOB_BY_ID.has(jobId)) return json({ error: 'Unknown job' }, 400);
  await env.DB.prepare('UPDATE updates SET in_tapi = ? WHERE id = (SELECT MAX(id) FROM updates WHERE job_id = ?)').bind(inTapi ? 1 : 0, jobId).run();
  return json({ ok: true });
}

const csvCell = (v) => {
  const s = v === null || v === undefined ? '' : String(v);
  return /[",\n]/.test(s) ? '"' + s.replace(/"/g, '""') + '"' : s;
};

async function exportCsv(env) {
  const latest = await latestUpdates(env);
  const head = ['Job #', 'Section', 'Title', 'Address', 'State', 'PM', 'Tapi status', 'Outcome', 'Note', 'Updated by', 'Updated at (UTC)', 'Entered in Tapi', 'Tapi link'];
  const lines = [head.join(',')];
  for (const j of JOBS) {
    const u = latest[j.id] || {};
    lines.push([j.id, j.section, j.title, j.address, j.state, j.pm, j.tapiStatus, u.outcome, u.note, u.name, u.at, u.in_tapi ? 'Yes' : '', j.url].map(csvCell).join(','));
  }
  return new Response('﻿' + lines.join('\r\n'), {
    headers: {
      'content-type': 'text/csv; charset=utf-8',
      'content-disposition': `attachment; filename="job-check-${new Date().toISOString().slice(0, 10)}.csv"`,
      'cache-control': 'no-store',
    },
  });
}

export default {
  async fetch(req, env) {
    const url = new URL(req.url);
    const p = url.pathname;
    try {
      if (p === '/api/login' && req.method === 'POST') return login(req, env, false);
      if (p === '/api/admin/login' && req.method === 'POST') return login(req, env, true);
      if (p === '/api/logout') return json({ ok: true }, 200, { 'set-cookie': `${COOKIE}=; Path=/; Max-Age=0` });

      if (p.startsWith('/api/admin/')) {
        if (!(await isAuthed(req, env, true))) return json({ error: 'Admin PIN needed' }, 401);
        if (p === '/api/admin/jobs') return listJobs(env);
        if (p === '/api/admin/in-tapi' && req.method === 'POST') return markInTapi(req, env);
        if (p === '/api/admin/export.csv') return exportCsv(env);
        return json({ error: 'Not found' }, 404);
      }
      if (p.startsWith('/api/')) {
        if (!(await isAuthed(req, env))) return json({ error: 'PIN needed' }, 401);
        if (p === '/api/jobs') return listJobs(env);
        if (p === '/api/update' && req.method === 'POST') return saveUpdate(req, env);
        return json({ error: 'Not found' }, 404);
      }
      return env.ASSETS.fetch(req);
    } catch (e) {
      return json({ error: 'Something went wrong. Please try again.' }, 500);
    }
  },
};
