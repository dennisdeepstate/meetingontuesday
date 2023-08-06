ALTER TABLE "purchase_transactions" ALTER COLUMN "voucher" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "purchase_transactions" ADD COLUMN "qty" numeric NOT NULL;