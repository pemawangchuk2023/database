import { Pool } from "pg";
import dotenv from "dotenv";

dotenv.config();

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    // Fallback if DATABASE_URL is not set
    host: process.env.DATABASE_URL ? undefined : process.env.DATABASE_HOST,
    port: process.env.DATABASE_URL ? undefined : 5433,
    user: process.env.DATABASE_URL ? undefined : process.env.DATABASE_USER,
    password: process.env.DATABASE_URL ? undefined : process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_URL ? undefined : process.env.DATABASE_NAME,
});

async function migrate() {
    const client = await pool.connect();
    try {
        console.log("🔌 Connected to database...");

        console.log("🛠️ Creating ActivityLogs table...");
        await client.query(`
            CREATE TABLE IF NOT EXISTS ActivityLogs (
                log_id SERIAL PRIMARY KEY,
                user_id INT REFERENCES Users(user_id) ON DELETE CASCADE,
                action VARCHAR(255) NOT NULL,
                details TEXT,
                ip_address VARCHAR(45),
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `);

        console.log("🛠️ Creating indexes...");
        await client.query(`
            CREATE INDEX IF NOT EXISTS idx_activity_logs_user_id ON ActivityLogs(user_id);
            CREATE INDEX IF NOT EXISTS idx_activity_logs_created_at ON ActivityLogs(created_at DESC);
        `);

        console.log("✅ Migration completed successfully!");
    } catch (error) {
        console.error("❌ Migration failed:", error);
    } finally {
        client.release();
        await pool.end();
    }
}

migrate();
