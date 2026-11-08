// Rewrites stored answers onto the 63-question deck (public/karigar-data.js MIGRATE): every
// profile's answers, their transcript source lines, and every saved translation. Idempotent: a
// profile with nothing under a retired key is left alone. Before a profile is first rewritten, its
// rows are copied, as they were, to deck_migration_backup.
//
// Runs from scripts/migrate.js after the schema migrations, on production deploys and locally,
// never on preview builds: previews of some projects share the production database, and the live
// code must not see rewritten answers before this code is live.
import { eq, inArray } from 'drizzle-orm';
import { schema } from '../lib/db.js';
import { migrateRecord, migrateTranslations } from '../lib/deck.js';

const { artisanProfiles: P, cardAnswers: A, deckMigrationBackup: Bk } = schema;
const changed = (a, b) => JSON.stringify(a) !== JSON.stringify(b);

export async function migrateDeck(db) {
  const profiles = await db.select({ id: P.id, translations: P.translations }).from(P);
  const answers = profiles.length ? await db.select().from(A).where(inArray(A.profileId, profiles.map(p => p.id))) : [];
  let rewritten = 0, checked = 0;
  for (const p of profiles) {
    checked++;
    const rows = answers.filter(a => a.profileId === p.id);
    const record = {}, sources = {};
    rows.forEach(a => { record[a.fieldKey] = a.value; if (a.sourceQuote) sources[a.fieldKey] = a.sourceQuote; });
    const nextRecord = migrateRecord(record), nextSources = migrateRecord(sources);
    const nextTr = p.translations ? migrateTranslations(p.translations) : p.translations;
    if (!changed(record, nextRecord) && !changed(sources, nextSources) && !changed(p.translations, nextTr)) continue;
    await db.transaction(async tx => {
      await tx.insert(Bk).values({ profileId: p.id, answers: rows.map(a => ({ fieldKey: a.fieldKey, value: a.value, sourceQuote: a.sourceQuote })), translations: p.translations || null })
        .onConflictDoNothing();
      await tx.delete(A).where(eq(A.profileId, p.id));
      const fresh = Object.keys(nextRecord).filter(k => String(nextRecord[k] || '').trim())
        .map(k => ({ profileId: p.id, fieldKey: k, value: String(nextRecord[k]), sourceQuote: nextSources[k] ? String(nextSources[k]) : null }));
      if (fresh.length) await tx.insert(A).values(fresh);
      if (changed(p.translations, nextTr)) await tx.update(P).set({ translations: nextTr }).where(eq(P.id, p.id));
    });
    rewritten++;
  }
  return { checked, rewritten };
}
