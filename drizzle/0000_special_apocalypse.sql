CREATE TABLE IF NOT EXISTS "items" (
	"id" serial PRIMARY KEY NOT NULL,
	"item" text,
	"base_uom" text,
	"category" text
);
