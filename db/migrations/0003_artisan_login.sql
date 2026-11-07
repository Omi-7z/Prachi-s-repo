CREATE TABLE "login_attempts" (
	"id" text PRIMARY KEY NOT NULL,
	"key" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "artisan_profiles" ADD COLUMN "username" text;--> statement-breakpoint
ALTER TABLE "artisan_profiles" ADD COLUMN "password_hash" text;--> statement-breakpoint
ALTER TABLE "artisan_profiles" ADD COLUMN "login_version" integer DEFAULT 0 NOT NULL;--> statement-breakpoint
CREATE INDEX "login_attempts_key_idx" ON "login_attempts" USING btree ("key","created_at");--> statement-breakpoint
CREATE UNIQUE INDEX "artisan_profiles_username_idx" ON "artisan_profiles" USING btree ("username");