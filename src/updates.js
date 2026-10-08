// Changes since jobs.js was built: refreshed Tapi export (8 Oct 2026) and Xero invoice matching.
// When jobs.js is rebuilt from a new Tapi CSV, reset this to { asOf: null, remove: {}, add: [], patch: {}, notes: {} }.
export const UPDATE = {
 "asOf": "2026-10-08",
 "remove": {
  "TAPI-02225": "",
  "TAPI-02770": "Invoiced and paid in Xero (INV-0139, 31 Aug)",
  "TAPI-03083": "",
  "TAPI-03013": "",
  "TAPI-02492": "",
  "TAPI-03060": "",
  "TAPI-01663": "",
  "TAPI-01734": "",
  "TAPI-01554": "",
  "TAPI-01791": "",
  "TAPI-01395": "",
  "TAPI-01874": "",
  "TAPI-01682": "",
  "TAPI-02204": "",
  "TAPI-02377": "",
  "TAPI-02433": "",
  "TAPI-02509": "",
  "TAPI-02501": "",
  "TAPI-02511": "",
  "TAPI-02379": ""
 },
 "add": [
  {
   "id": "TAPI-03146",
   "section": "book",
   "title": "Mowing of the nature strip",
   "address": "28 Vivid Street Winter Valley VIC",
   "state": "VIC",
   "pm": "Darren Passande",
   "days": 0,
   "tapiStatus": "Scheduling job",
   "desc": "Can you please attend and mow the nature strip",
   "url": "https://tapi.app/issue/02795974-4feb-4897-b14d-9b698fa650af"
  }
 ],
 "patch": {
  "TAPI-03042": {
   "section": "invoice",
   "tapiStatus": "Awaiting invoice",
   "days": 0
  }
 },
 "notes": {
  "TAPI-02109": "Xero: mowing last invoiced at this address 10 Aug (INV-0123, paid).",
  "TAPI-02108": "Xero: mowing last invoiced at this address 10 Aug (INV-0120, unpaid).",
  "TAPI-01940": "Xero: mowing last invoiced at this address 10 Aug (INV-0120, unpaid).",
  "TAPI-02114": "Xero: mowing last invoiced at this address 31 Aug (INV-0138, paid).",
  "TAPI-02482": "Xero: mowing last invoiced at this address 20 Apr (INV-0049, paid).",
  "TAPI-02494": "Xero: mowing last invoiced at this address 31 Aug (INV-0138, paid).",
  "TAPI-02617": "Xero: mowing last invoiced at this address 31 Aug (INV-0138, paid).",
  "TAPI-02661": "Xero: lawn last invoiced at this address 10 Aug (INV-0122, paid).",
  "TAPI-02508": "Xero: mowing last invoiced at this address 13 Jul (INV-0102, paid).",
  "TAPI-02932": "Xero: mowing last invoiced at this address 31 Aug (INV-0138, paid).",
  "TAPI-02768": "Xero: mowing last invoiced at this address 3 Aug (INV-0118, paid).",
  "TAPI-02766": "Xero: mowing last invoiced at this address 7 Sep (INV-0142, paid).",
  "TAPI-02933": "Xero: mowing last invoiced at this address 3 Aug (INV-0118, paid).",
  "TAPI-02931": "Xero: mowing last invoiced at this address 31 Aug (INV-0139, paid).",
  "TAPI-02953": "Xero: lawn last invoiced at this address 13 Jul (INV-0107, paid).",
  "TAPI-03078": "Xero: mowing last invoiced at this address 3 Aug (INV-0118, paid).",
  "TAPI-03093": "Xero: lawn last invoiced at this address 11 May (INV-0062, paid).",
  "TAPI-01866": "Xero: mowing last invoiced at this address 31 Aug (INV-0138, paid).",
  "TAPI-02115": "Xero: mowing last invoiced at this address 31 Aug (INV-0139, paid).",
  "TAPI-01911": "Xero: lawn last invoiced at this address 11 May (INV-0062, paid).",
  "TAPI-01933": "Xero: mowing last invoiced at this address 31 Aug (INV-0139, paid).",
  "TAPI-02299": "Xero: mowing last invoiced at this address 10 Aug (INV-0123, paid).",
  "TAPI-01934": "Xero: mowing last invoiced at this address 31 Aug (INV-0138, paid).",
  "TAPI-02937": "Xero: mowing last invoiced at this address 10 Aug (INV-0120, unpaid).",
  "TAPI-02926": "Xero: garden last invoiced at this address 4 May (INV-0054, unpaid).",
  "TAPI-03079": "Xero: mowing last invoiced at this address 31 Aug (INV-0138, paid).",
  "TAPI-03080": "Xero: mowing last invoiced at this address 31 Aug (INV-0139, paid).",
  "TAPI-02619": "Xero: routine clean last invoiced at this address 7 Sep (INV-0143, paid).",
  "TAPI-03077": "Xero: routine clean last invoiced at this address 7 Sep (INV-0143, paid).",
  "TAPI-03074": "Xero: mowing last invoiced at this address 10 Aug (INV-0120, unpaid).",
  "TAPI-03076": "Xero: mowing last invoiced at this address 7 Sep (INV-0142, paid).",
  "TAPI-02491": "Xero: mowing last invoiced at this address 7 Sep (INV-0142, paid).",
  "TAPI-03042": "Xero: lawn last invoiced at this address 7 Sep (INV-0144, unpaid)."
 }
};
