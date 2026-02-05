import { drizzle } from 'drizzle-orm/planetscale-serverless';
import { Client } from '@planetscale/database';
import * as schema from './schema';
import { mockDb } from './mock-db';

/**
 * Database Connection
 * 
 * Environment variables required:
 * - DATABASE_URL: PlanetScale connection string or MySQL URL
 */
const getDatabaseUrl = () => {
  const url = process.env.DATABASE_URL;
  // Fallback to mock DB if no URL provided (for demo/preview)
  return url || 'mysql://mock:mock@localhost:3306/mock';
};

// Create connection (compatible with both PlanetScale and MySQL)
export const db = process.env.DATABASE_URL && !process.env.DATABASE_URL.includes('mysql://root:password') 
  ? drizzle(new Client({ url: getDatabaseUrl() }), { schema })
  : mockDb;


/**
 * For development/testing with local MySQL, use this instead:
 * 
 * import mysql from 'mysql2/promise';
 * import { drizzle } from 'drizzle-orm/mysql2';
 * 
 * const connection = await mysql.createConnection({
 *   host: process.env.DB_HOST,
 *   user: process.env.DB_USER,
 *   password: process.env.DB_PASSWORD,
 *   database: process.env.DB_NAME,
 * });
 * 
 * export const db = drizzle(connection, { schema });
 */
