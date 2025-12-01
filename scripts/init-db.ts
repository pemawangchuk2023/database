import { Pool } from "pg";
import * as fs from "fs";
import * as path from "path";
import * as dotenv from "dotenv";

// Load environment variables
dotenv.config();

async function initDatabase() {
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
        const sqlPath = path.join(process.cwd(), "dms.sql");
        const sql = fs.readFileSync(sqlPath, "utf-8");

        console.log("🔄 Executing database schema...");
        await pool.query(sql);

        console.log("✅ Database initialized successfully!");
        console.log("📊 Tables created:");
        console.log("  - users");
        console.log("  - categories");
        console.log("  - documents");
        console.log("  - user_auth (for better-auth)");
        console.log("  - session (for better-auth)");
        console.log("  - account (for better-auth)");
        console.log("  - verification (for better-auth)");
    } catch (error) {
        console.error("❌ Database initialization failed:", error);
        throw error;
    } finally {
        await pool.end();
    }
}

initDatabase();
