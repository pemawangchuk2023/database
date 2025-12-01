import { Pool } from "pg";

if (!process.env.DATABASE_HOST || !process.env.DATABASE_NAME || !process.env.DATABASE_USER || !process.env.DATABASE_PASSWORD || !process.env.DATABASE_URL) {
    throw new Error(
        "Please define DATABASE_HOST, DATABASE_NAME, DATABASE_USER, and DATABASE_PASSWORD environment variables"
    );
}

// Create a PostgreSQL connection pool
console.log(`🔌 Initializing DB Pool: Host=${process.env.DATABASE_HOST} Port=5433 DB=${process.env.DATABASE_NAME} User=${process.env.DATABASE_USER}`);

const pool = new Pool({
    host: process.env.DATABASE_HOST,
    port: 5433,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_NAME,
    max: 20,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000,
});


export default pool;
