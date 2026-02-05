import { drizzle } from 'drizzle-orm/planetscale-serverless';
import { connect } from '@planetscale/database';
import * as schema from './schema';

/**
 * Database Connection
 * 
 * Environment variables required:
 * - DATABASE_URL: PlanetScale connection string or MySQL URL
 */
const getDatabaseUrl = () => {
  const url = process.env.DATABASE_URL;
  if (!url) {
    throw new Error('DATABASE_URL environment variable is not set');
  }
  return url;
};

// Create connection (compatible with both PlanetScale and MySQL)
export const db = drizzle(
  connect({ url: getDatabaseUrl() }),
  { schema }
);

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
