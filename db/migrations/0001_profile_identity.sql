ALTER TABLE "artisan_profiles" ADD COLUMN "record_lang" text;--> statement-breakpoint
ALTER TABLE "artisan_profiles" ADD COLUMN "names" jsonb;--> statement-breakpoint
ALTER TABLE "artisan_profiles" ADD COLUMN "custom" jsonb DEFAULT '[]'::jsonb NOT NULL;--> statement-breakpoint
ALTER TABLE "artisan_profiles" ADD COLUMN "links" jsonb DEFAULT '{}'::jsonb NOT NULL;