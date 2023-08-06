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

	const items = await db
		.selectDistinctOn([itemsTable.item],{
			item: itemsTable.item,
			baseUom: itemsTable.baseUom,
			category: itemsTable.category,
			purchaseUom: sq.uom,
			rateExclusive: sq.rateExclusive,
			rateInclusive: sq.rateInclusive,
            date: sq.date,
			vendor: sq.vendor
		})
		.from(itemsTable)
        .orderBy(asc(itemsTable.item), asc(itemsTable.id))
		.leftJoin(sq, eq(itemsTable.item, sq.item))

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

	const itemsDefault = await db
		.selectDistinctOn([itemsTable.item],{
			item: itemsTable.item,
			baseUom: itemsTable.baseUom,
			category: itemsTable.category,
			purchaseUom: sqDefault.uom,
			rateExclusive: sqDefault.rateExclusive,
			rateInclusive: sqDefault.rateInclusive,
            date: sqDefault.date,
			vendor: sqDefault.vendor
		})
		.from(itemsTable)
        .orderBy(asc(itemsTable.item), asc(itemsTable.id))
		.leftJoin(sqDefault, eq(itemsTable.item, sqDefault.item))

	const conversions = await db
		.select({
			item: conversionsTable.item,
			uom: conversionsTable.uom,
			conversion: conversionsTable.conversion
		})
		.from(conversionsTable)

	return { items: items, conversions: conversions, itemsDefault }
}
