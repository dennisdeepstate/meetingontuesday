import { relations } from 'drizzle-orm'
import { date, numeric, pgTable, serial, text } from 'drizzle-orm/pg-core'

export const itemsTable = pgTable('items', {
	id: serial('id').primaryKey(),
	item: text('item').notNull(),
	baseUom: text('base_uom').notNull(),
	category: text('category')
})
export const itemsRelations = relations(itemsTable, ({ many }) => ({
	conversions: many(conversionsTable),
	purchases: many(purchaseTransactionsTable)
}))
export const conversionsTable = pgTable('conversions', {
	id: serial('id').primaryKey(),
	item: text('item').notNull(),
	uom: text('uom').notNull(),
	conversion: numeric('conversion').notNull()
})
export const conversionsRelations = relations(conversionsTable, ({ one }) => ({
	item: one(itemsTable, {
		fields: [conversionsTable.item],
		references: [itemsTable.item]
	})
}))
export const purchaseTransactionsTable = pgTable('purchase_transactions', {
	id: serial('id').primaryKey(),
	item: text('item').notNull(),
	uom: text('uom').notNull(),
	vendor: text('vendor').notNull(),
	voucher: text('voucher'),
	grn: text('grn').notNull(),
	date: date('date').notNull(),
	rateExclusive: numeric('rate_exclusive').notNull(),
	rateInclusive: numeric('rate_inclusive').notNull(),
	qty: numeric('qty').notNull()
})
export const purchaseTransactionsRelations = relations(purchaseTransactionsTable, ({ one }) => ({
	item: one(itemsTable, {
		fields: [purchaseTransactionsTable.item],
		references: [itemsTable.item]
	})
}))
