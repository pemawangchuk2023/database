import { Pool } from "pg";
import * as dotenv from "dotenv";

// Load environment variables
dotenv.config();

async function resetDatabase() {
    const pool = new Pool({
        host: process.env.DATABASE_HOST,
        port: 5433,
        user: process.env.DATABASE_USER,
        password: process.env.DATABASE_PASSWORD,
        database: process.env.DATABASE_NAME,
    });

    try {
        console.log("🔄 Connecting to PostgreSQL...");

        console.log("🗑️  Deleting all data...");

        // Delete in correct order due to foreign keys
        await pool.query("DELETE FROM Sessions");
        await pool.query("DELETE FROM Documents");
        await pool.query("DELETE FROM Categories");
        await pool.query("DELETE FROM Users");
        await pool.query("DELETE FROM Department");

        console.log("🔄 Resetting sequences...");

        // Reset sequences
        await pool.query("ALTER SEQUENCE department_department_id_seq RESTART WITH 1");
        await pool.query("ALTER SEQUENCE users_user_id_seq RESTART WITH 1");
        await pool.query("ALTER SEQUENCE categories_category_id_seq RESTART WITH 1");
        await pool.query("ALTER SEQUENCE documents_document_id_seq RESTART WITH 1");

        console.log("✅ Database reset successfully!");
        console.log("📊 All tables are now empty and ready for fresh data.");

        // Verify
        const result = await pool.query(`
            SELECT 'Department' as table_name, COUNT(*) as row_count FROM Department
            UNION ALL
            SELECT 'Users', COUNT(*) FROM Users
            UNION ALL
            SELECT 'Categories', COUNT(*) FROM Categories
            UNION ALL
            SELECT 'Documents', COUNT(*) FROM Documents
            UNION ALL
            SELECT 'Sessions', COUNT(*) FROM Sessions
        `);

        console.log("\n📋 Table counts:");
        result.rows.forEach(row => {
            console.log(`  ${row.table_name}: ${row.row_count} rows`);
        });

    } catch (error) {
        console.error("❌ Database reset failed:", error);
        throw error;
    } finally {
        await pool.end();
    }
}

resetDatabase();
