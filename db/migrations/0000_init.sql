CREATE TABLE "artisan_profiles" (
	"id" text PRIMARY KEY NOT NULL,
	"org_id" text NOT NULL,
	"name" text DEFAULT '' NOT NULL,
	"craft_local" text DEFAULT '' NOT NULL,
	"region" text DEFAULT '' NOT NULL,
	"lang" text DEFAULT 'en' NOT NULL,
	"cluster" text,
	"approved_at" timestamp with time zone,
	"analysis" jsonb,
	"checklist" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"session_note" text DEFAULT '' NOT NULL,
	"origin" text,
	"created_by" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "card_answers" (
	"profile_id" text NOT NULL,
	"field_key" text NOT NULL,
	"value" text NOT NULL,
	"source_quote" text,
	CONSTRAINT "card_answers_profile_id_field_key_pk" PRIMARY KEY("profile_id","field_key")
);
--> statement-breakpoint
CREATE TABLE "facilitators" (
	"id" text PRIMARY KEY NOT NULL,
	"org_id" text NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"password_hash" text NOT NULL,
	"role" text DEFAULT 'staff' NOT NULL,
	"artisan_profile_id" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "handover_tokens" (
	"id" text PRIMARY KEY NOT NULL,
	"profile_id" text NOT NULL,
	"token" text NOT NULL,
	"version" integer NOT NULL,
	"revoked_at" timestamp with time zone,
	"last_opened_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "organisations" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "practice_events" (
	"id" text PRIMARY KEY NOT NULL,
	"profile_id" text NOT NULL,
	"segment_id" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "artisan_profiles" ADD CONSTRAINT "artisan_profiles_org_id_organisations_id_fk" FOREIGN KEY ("org_id") REFERENCES "public"."organisations"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "artisan_profiles" ADD CONSTRAINT "artisan_profiles_created_by_facilitators_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."facilitators"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "card_answers" ADD CONSTRAINT "card_answers_profile_id_artisan_profiles_id_fk" FOREIGN KEY ("profile_id") REFERENCES "public"."artisan_profiles"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "facilitators" ADD CONSTRAINT "facilitators_org_id_organisations_id_fk" FOREIGN KEY ("org_id") REFERENCES "public"."organisations"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "handover_tokens" ADD CONSTRAINT "handover_tokens_profile_id_artisan_profiles_id_fk" FOREIGN KEY ("profile_id") REFERENCES "public"."artisan_profiles"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "practice_events" ADD CONSTRAINT "practice_events_profile_id_artisan_profiles_id_fk" FOREIGN KEY ("profile_id") REFERENCES "public"."artisan_profiles"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "artisan_profiles_org_idx" ON "artisan_profiles" USING btree ("org_id");--> statement-breakpoint
CREATE UNIQUE INDEX "facilitators_email_idx" ON "facilitators" USING btree ("email");--> statement-breakpoint
CREATE UNIQUE INDEX "handover_tokens_token_idx" ON "handover_tokens" USING btree ("token");--> statement-breakpoint
CREATE INDEX "handover_tokens_profile_idx" ON "handover_tokens" USING btree ("profile_id");--> statement-breakpoint
CREATE INDEX "practice_events_profile_idx" ON "practice_events" USING btree ("profile_id");