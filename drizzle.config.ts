import type { Config } from 'drizzle-kit'

export default {
	schema: './src/lib/server/schema.ts',
	driver: 'pg',
	dbCredentials: {
		connectionString: process.env.DB
	},
	out: './drizzle'
} satisfies Config
