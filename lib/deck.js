// The card deck, as the server sees it. Everything comes from public/karigar-data.js (the design's
// SCHEMA), so a deck change never needs a parallel list of field keys here.
import { SCHEMA, FIELD_INDEX, MIGRATE } from '../public/karigar-data.js';

// Questions on the board: theme, reflection and story cards. The header (name, years in practice)
// is not a card and never counts.
export const BOARD_KEYS = SCHEMA.filter(g => g.deck !== 'header').flatMap(g => g.fields.map(f => f.key));
export const BOARD_TOTAL = BOARD_KEYS.length;
const BOARD = new Set(BOARD_KEYS);

export const isKnownKey = k => !!FIELD_INDEX[k];

// MIGRATE maps answers stored under retired keys onto the current deck, joining answers where two
// boxes became one. It writes each merged box from the retired boxes only, so when a record somehow
// holds both an old and a new answer for the same box, the new answer is kept in front.
// Idempotent: a record with no retired keys comes back unchanged.
export function migrateRecord(rec) {
  if (!rec || typeof rec !== 'object' || Array.isArray(rec)) return rec;
  const out = MIGRATE(rec);
  if (out === rec) return rec;
  Object.keys(out).forEach(k => {
    const before = String(rec[k] || '').trim();
    if (before && !String(out[k] || '').includes(before)) out[k] = `${before}\n\n${out[k]}`;
  });
  return out;
}

export function migrateTranslations(tr) {
  if (!tr || typeof tr !== 'object') return tr;
  const out = {};
  Object.keys(tr).forEach(l => { const v = tr[l]; out[l] = v && v.record ? { ...v, record: migrateRecord(v.record) } : v; });
  return out;
}

// answered / 63
export function progress(record) {
  const answered = Object.keys(record || {}).filter(k => BOARD.has(k) && String(record[k] || '').trim()).length;
  return { answered, total: BOARD_TOTAL };
}
