import { Pool } from "pg";
import * as fs from "fs";
import * as path from "path";
import * as dotenv from "dotenv";

// Load environment variables
dotenv.config();

async function initNotifications() {
    const pool = new Pool({
        host: process.env.DATABASE_HOST,
        port: 5433,
        user: process.env.DATABASE_USER,
        password: process.env.DATABASE_PASSWORD,
        database: process.env.DATABASE_NAME,
    });

    try {
        console.log("🔄 Connecting to PostgreSQL...");

        // Read the SQL file
        const sqlPath = path.join(process.cwd(), "scripts", "create-notifications.sql");
        const sql = fs.readFileSync(sqlPath, "utf-8");

        console.log("🔄 Executing notifications schema...");
        await pool.query(sql);

        console.log("✅ Notifications table initialized successfully!");
    } catch (error) {
        console.error("❌ Notifications initialization failed:", error);
        throw error;
    } finally {
        await pool.end();
    }
}

initNotifications();
