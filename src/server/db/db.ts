import { drizzle } from 'drizzle-orm/postgres-js';
import { migrate } from 'drizzle-orm/postgres-js/migrator';
import postgres from 'postgres'
import * as schema  from './schema';

const connectionString = process.env.DATABASE_URL!


export const client = postgres(connectionString, { prepare: false })
export const db = drizzle(client, {schema});
