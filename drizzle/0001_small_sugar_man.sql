CREATE TABLE IF NOT EXISTS "conversions" (
	"id" serial PRIMARY KEY NOT NULL,
	"item" text NOT NULL,
	"conversion" integer NOT NULL
);
--> statement-breakpoint
ALTER TABLE "items" ALTER COLUMN "item" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "items" ALTER COLUMN "base_uom" SET NOT NULL;