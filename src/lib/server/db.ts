import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'
import { DB } from '$env/static/private'

const client = postgres(DB)
export const db = drizzle(client)
