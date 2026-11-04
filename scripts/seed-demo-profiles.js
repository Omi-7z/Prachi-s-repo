// Adds the invented demo artisans in scripts/demo-data/ to one organisation account, through the
// same API the console uses. Safe to run again: profiles keep their ids and their links.
//
//   KARIGAR_EMAIL=you@example.org KARIGAR_PASSWORD=... node scripts/seed-demo-profiles.js
//   ... node scripts/seed-demo-profiles.js --remove     deletes these demo profiles again
//
// KARIGAR_URL picks the site (default: the live one). The password only ever comes from the
// environment, so it is never written to this repo.
//
// These people, their answers and the cultural details in them are invented. Every profile says so
// in its facilitator session note. Replace them with real sessions before anyone relies on them.
import { readdir, readFile } from 'node:fs/promises';
import { ALL_KEYS } from '../public/karigar-data.js';

const BASE = (process.env.KARIGAR_URL || 'https://karigar-toolkit.vercel.app').replace(/\/+$/, '');
const { KARIGAR_EMAIL: email, KARIGAR_PASSWORD: password } = process.env;
if (!email || !password) { console.error('Set KARIGAR_EMAIL and KARIGAR_PASSWORD.'); process.exit(1); }

const dir = new URL('./demo-data/', import.meta.url);
const files = (await readdir(dir)).filter(f => f.endsWith('.json')).sort();
const demos = await Promise.all(files.map(async f => ({ ...JSON.parse(await readFile(new URL(f, dir), 'utf8')), file: f })));

const signIn = await fetch(`${BASE}/api/session`, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ email, password }) });
if (!signIn.ok) { console.error(`Sign-in failed (${signIn.status}).`); process.exit(1); }
const cookie = signIn.headers.get('set-cookie').split(';')[0];

async function call(id, method, body) {
  const res = await fetch(`${BASE}/api/profiles/${id}`, { method, headers: { 'content-type': 'application/json', cookie }, body: JSON.stringify(body) });
  const data = await res.json().catch(() => ({}));
  if (!res.ok && !(method === 'DELETE' && res.status === 404)) throw new Error(`${id}: ${res.status} ${data.error || ''}`);
  return data;
}

if (process.argv.includes('--remove')) {
  for (const d of demos) { await call(d.id, 'DELETE', {}); console.log(`removed ${d.id}`); }
  process.exit(0);
}

for (const d of demos) {
  const unknown = Object.keys(d.record).filter(k => !ALL_KEYS.includes(k));
  if (unknown.length) throw new Error(`${d.id}: unknown card keys ${unknown}`);
  const r = d.record;
  // The English of every answer is stored with the profile, so the console needs no model call to show it.
  const en = JSON.parse(await readFile(new URL(`en/${d.file}`, dir), 'utf8'));
  const untranslated = Object.keys(r).filter(k => !String(en[k] || '').trim());
  const stray = Object.keys(en).filter(k => !(k in r));
  if (untranslated.length || stray.length) throw new Error(`${d.id}: English does not match: missing ${untranslated}, extra ${stray}`);
  const complete = d.status === 'complete';
  if (complete) {
    const missing = ALL_KEYS.filter(k => !String(r[k] || '').trim());
    if (missing.length) throw new Error(`${d.id}: missing answers ${missing}`);
  }
  const { profile } = await call(d.id, 'PUT', {
    record: r, sources: {}, lang: d.lang, recordLang: d.lang, cluster: d.cluster,
    names: { sig: [r.artisan_name, r.craft_name_local, r.craft_region].join('|'), ...d.names },
    analysis: d.analysis,
    translations: { en: { record: en, custom: {}, summary: (d.analysis && d.analysis.artisan_summary_en) || '', vocabulary: (d.analysis && d.analysis.vocabulary) || [], partial: false } },
    approved: complete,
    checked: complete ? { 0: true, 1: true, 2: true, 3: true, 4: true } : {},
    origin: 'demo data',
    sessionNote: ['Demo data: an invented artisan, not a real session.', d.sessionNoteExtra].filter(Boolean).join(' ')
  });
  console.log(`${d.id} ${d.status} ${Object.keys(profile.record).length} answers  ${BASE}/k/${profile.token}`);
}
