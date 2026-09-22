// Drizzle schema. Mirrors ARCHITECTURE.md; card answers are keyed by the field_key
// values in public/karigar-data.js (FIELD_INDEX) — there is no parallel schema.
import { pgTable, text, integer, timestamp, jsonb, primaryKey, index, uniqueIndex } from 'drizzle-orm/pg-core';

export const organisations = pgTable('organisations', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow()
});

export const facilitators = pgTable('facilitators', {
  id: text('id').primaryKey(),
  orgId: text('org_id').notNull().references(() => organisations.id, { onDelete: 'cascade' }),
  name: text('name').notNull(),
  email: text('email').notNull(),
  passwordHash: text('password_hash').notNull(),
  // 'champion_leader' is reserved for artisans who facilitate for others; not built yet.
  role: text('role', { enum: ['staff', 'champion_leader'] }).notNull().default('staff'),
  artisanProfileId: text('artisan_profile_id'),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow()
}, t => [uniqueIndex('facilitators_email_idx').on(t.email)]);

export const artisanProfiles = pgTable('artisan_profiles', {
  id: text('id').primaryKey(),
  orgId: text('org_id').notNull().references(() => organisations.id, { onDelete: 'cascade' }),
  // name / craft / region duplicate three card answers so lists do not need a join
  name: text('name').notNull().default(''),
  craftLocal: text('craft_local').notNull().default(''),
  region: text('region').notNull().default(''),
  lang: text('lang').notNull().default('en'),
  cluster: text('cluster'),
  approvedAt: timestamp('approved_at', { withTimezone: true }),
  analysis: jsonb('analysis'),
  // facilitator-only working state: handover checklist, session note, where it came from
  checklist: jsonb('checklist').notNull().default({}),
  sessionNote: text('session_note').notNull().default(''),
  origin: text('origin'),
  createdBy: text('created_by').references(() => facilitators.id, { onDelete: 'set null' }),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow()
}, t => [index('artisan_profiles_org_idx').on(t.orgId)]);

export const cardAnswers = pgTable('card_answers', {
  profileId: text('profile_id').notNull().references(() => artisanProfiles.id, { onDelete: 'cascade' }),
  fieldKey: text('field_key').notNull(),
  value: text('value').notNull(),
  sourceQuote: text('source_quote')
}, t => [primaryKey({ columns: [t.profileId, t.fieldKey] })]);

export const handoverTokens = pgTable('handover_tokens', {
  id: text('id').primaryKey(),
  profileId: text('profile_id').notNull().references(() => artisanProfiles.id, { onDelete: 'cascade' }),
  token: text('token').notNull(),
  version: integer('version').notNull(),
  revokedAt: timestamp('revoked_at', { withTimezone: true }),
  lastOpenedAt: timestamp('last_opened_at', { withTimezone: true }),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow()
}, t => [uniqueIndex('handover_tokens_token_idx').on(t.token), index('handover_tokens_profile_idx').on(t.profileId)]);

// Counts only. There is no column for what was said, and there must never be one.
export const practiceEvents = pgTable('practice_events', {
  id: text('id').primaryKey(),
  profileId: text('profile_id').notNull().references(() => artisanProfiles.id, { onDelete: 'cascade' }),
  segmentId: text('segment_id').notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow()
}, t => [index('practice_events_profile_idx').on(t.profileId)]);
