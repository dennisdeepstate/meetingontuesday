CREATE TABLE IF NOT EXISTS "purchase_transactions" (
	"id" serial PRIMARY KEY NOT NULL,
	"item" text NOT NULL,
	"uom" text NOT NULL,
	"vendor" text NOT NULL,
	"grn" text NOT NULL,
	"date" date NOT NULL,
	"rate_exclusive" numeric NOT NULL,
	"rate_inclusive" numeric NOT NULL
);
