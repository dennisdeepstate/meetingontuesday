import { pgTable, serial, text } from "drizzle-orm/pg-core"

export const users = pgTable('items', {
    id: serial('id').primaryKey(),
    item: text('item'),
    baseUom: text('base_uom'),
    category: text('category')
})

