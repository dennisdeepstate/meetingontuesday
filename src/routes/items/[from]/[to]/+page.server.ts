import { db } from '$lib/server/db'
import { conversionsTable, itemsTable, purchaseTransactionsTable } from '$lib/server/schema'
import { and, asc, eq, desc, lte, gte } from 'drizzle-orm'

export async function load({ params }) {
	const toDate = params.to
	const fromDate = params.from
	const sq = db
		.selectDistinctOn([purchaseTransactionsTable.item], {
			item: purchaseTransactionsTable.item,
			uom: purchaseTransactionsTable.uom,
			date: purchaseTransactionsTable.date,
			vendor: purchaseTransactionsTable.vendor,
			rateExclusive: purchaseTransactionsTable.rateExclusive,
			rateInclusive: purchaseTransactionsTable.rateInclusive
		})
		.from(purchaseTransactionsTable)
		.where(
			and(
				lte(purchaseTransactionsTable.date, toDate),
				gte(purchaseTransactionsTable.date, fromDate)
			)
		)
		.orderBy(asc(purchaseTransactionsTable.item), desc(purchaseTransactionsTable.date))
		.as('sq')

	const sqDefault = db
		.selectDistinctOn([purchaseTransactionsTable.item], {
			item: purchaseTransactionsTable.item,
			uom: purchaseTransactionsTable.uom,
			date: purchaseTransactionsTable.date,
			vendor: purchaseTransactionsTable.vendor,
			rateExclusive: purchaseTransactionsTable.rateExclusive,
			rateInclusive: purchaseTransactionsTable.rateInclusive
		})
		.from(purchaseTransactionsTable)
		.orderBy(asc(purchaseTransactionsTable.item), desc(purchaseTransactionsTable.date))
		.as('sqDefault')

	const items = await db
		.selectDistinctOn([itemsTable.item], {
			item: itemsTable.item,
			baseUom: itemsTable.baseUom,
			category: itemsTable.category,
			purchaseUom: sq.uom,
			rateExclusive: sq.rateExclusive,
			rateInclusive: sq.rateInclusive,
			date: sq.date,
			vendor: sq.vendor,
			purchaseUomDefault: sqDefault.uom,
			rateExclusiveDefault: sqDefault.rateExclusive,
			rateInclusiveDefault: sqDefault.rateInclusive,
			dateDefault: sqDefault.date,
			vendorDefault: sqDefault.vendor
		})
		.from(itemsTable)
		.orderBy(asc(itemsTable.item), asc(itemsTable.id))
		.leftJoin(sq, eq(itemsTable.item, sq.item))
		.leftJoin(sqDefault, eq(itemsTable.item, sqDefault.item))

	const conversions = await db
		.select({
			item: conversionsTable.item,
			uom: conversionsTable.uom,
			conversion: conversionsTable.conversion
		})
		.from(conversionsTable)

	const itemPurchases = await db
		.select({
			item: purchaseTransactionsTable.item,
			uom: purchaseTransactionsTable.uom,
			date: purchaseTransactionsTable.date,
			vendor: purchaseTransactionsTable.vendor,
			rateExclusive: purchaseTransactionsTable.rateExclusive,
			rateInclusive: purchaseTransactionsTable.rateInclusive,
			qty: purchaseTransactionsTable.qty
		})
		.from(purchaseTransactionsTable)
		.where(
			and(
				lte(purchaseTransactionsTable.date, toDate),
				gte(purchaseTransactionsTable.date, fromDate)
			)
		)
		.orderBy(desc(purchaseTransactionsTable.date))

	return { items: items, conversions: conversions, itemPurchases: itemPurchases }
}
