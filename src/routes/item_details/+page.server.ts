import { db } from '$lib/server/db'
import { purchaseTransactionsTable } from '$lib/server/schema'
import { and, asc, eq, gte, lte } from 'drizzle-orm'

export const actions = {
	default: async ({ request }) => {
		const data = await request.formData()
		const item = String(data.get('item'))
		const fromDate = String(data.get('fromDate'))
		const toDate = String(data.get('toDate'))

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
					eq(purchaseTransactionsTable.item, item),
					lte(purchaseTransactionsTable.date, toDate),
					gte(purchaseTransactionsTable.date, fromDate)
				)
			)
			.orderBy(asc(purchaseTransactionsTable.date))
		return { purchases: itemPurchases }
	}
}
