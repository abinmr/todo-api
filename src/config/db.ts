import { PrismaClient } from '../generated/prisma/client.js';
import { PrismaPg } from '@prisma/adapter-pg';
import pg from 'pg';

if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL environment variable is missing.");
}

// Setup connection pool
export const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);

// Pass the adapter directly into PrismaClient
export const prisma = new PrismaClient({ adapter });
