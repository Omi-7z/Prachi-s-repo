CREATE TABLE "deck_migration_backup" (
	"profile_id" text PRIMARY KEY NOT NULL,
	"answers" jsonb NOT NULL,
	"translations" jsonb,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
