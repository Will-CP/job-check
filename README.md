# Job Check

A simple phone-friendly page where the Core Property Care team marks what has actually happened with each outstanding Tapi job. The office then uses the admin page to tidy up Tapi.

- Team page: `/` - enter the team PIN once, type your name once, then tap an answer on each job.
- Admin page: `/admin.html` - admin PIN. Shows what's been answered, lets you tick each job off once it's fixed in Tapi, and downloads everything as a spreadsheet.

## How it runs
- Cloudflare Worker (free plan) with a small Cloudflare D1 database for the answers.
- Every push to `main` deploys automatically (`.github/workflows/deploy.yml`). The first run creates the database.

## GitHub repository secrets needed
| Secret | What |
| --- | --- |
| `CLOUDFLARE_API_TOKEN` | Cloudflare API token with **Workers Scripts: Edit** and **D1: Edit** (account level) |
| `CLOUDFLARE_ACCOUNT_ID` | Your Cloudflare account ID |
| `APP_PIN` | The team PIN (6 digits recommended) |
| `ADMIN_PIN` | The office/admin PIN - make it different from the team PIN |

Wrong PINs are limited to 10 tries per hour per device.

## Refreshing the job list
Download a fresh CSV from Tapi ("Download jobs"), then run:

```
python3 scripts/build_jobs.py path/to/jobs.csv
```

Commit and push. Answers already given are kept (they are stored by job number).

## Local testing
Create `.dev.vars` with `APP_PIN=111111` and `ADMIN_PIN=999999`, then:
```
npm install
npx wrangler d1 migrations apply job-check --local
npx wrangler dev
```
