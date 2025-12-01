import { Pool } from "pg";
import * as dotenv from "dotenv";

// Load environment variables
dotenv.config();

async function diagnose() {
    console.log("🔍 Starting Database Diagnostic...");
    console.log("----------------------------------------");

    const config = {
        host: process.env.DATABASE_HOST,
        port: 5433, // Hardcoded as per your lib/db.ts
        user: process.env.DATABASE_USER,
        password: process.env.DATABASE_PASSWORD,
        database: process.env.DATABASE_NAME,
    };

    console.log("📋 Configuration:");
    console.log(`   Host: ${config.host}`);
    console.log(`   Port: ${config.port}`);
    console.log(`   User: ${config.user}`);
    console.log(`   DB:   ${config.database}`);
    console.log("----------------------------------------");

    const pool = new Pool(config);

    try {
        console.log("🔌 Attempting to connect...");
        const client = await pool.connect();
        console.log("✅ Connected successfully!");

        // Get server connection details
        const res = await client.query('SELECT inet_server_addr(), inet_server_port(), current_database(), current_user, version()');
        const info = res.rows[0];

        console.log("\n🖥️  Connected Server Details (Where the data is actually going):");
        console.log(`   IP Address:  ${info.inet_server_addr}`);
        console.log(`   Port:        ${info.inet_server_port}`);
        console.log(`   Database:    ${info.current_database}`);
        console.log(`   User:        ${info.current_user}`);
        console.log(`   Version:     ${info.version}`);

        console.log("\n----------------------------------------");

        // Check Users table count
        console.log("📊 Checking data...");
        const countRes = await client.query('SELECT count(*) FROM Users');
        console.log(`   Total Users in DB: ${countRes.rows[0].count}`);

        // Try to INSERT a test user directly
        console.log("\n🧪 Attempting to write test user...");
        const testEmail = `test_${Date.now()}@example.com`;
        try {
            // Ensure department exists
            await client.query("INSERT INTO Department (name) VALUES ('Test Dept') ON CONFLICT (name) DO NOTHING");
            const deptRes = await client.query("SELECT department_id FROM Department WHERE name = 'Test Dept'");
            const deptId = deptRes.rows[0].department_id;

            await client.query(
                "INSERT INTO Users (name, email, password, department_id, role) VALUES ($1, $2, $3, $4, $5)",
                ['Test User', testEmail, 'password123', deptId, 'staff']
            );
            console.log(`   ✅ SUCCESS: Wrote test user ${testEmail} to database!`);
        } catch (err) {
            console.error(`   ❌ FAILED to write test user:`, err);
        }

        // List recent users
        const usersRes = await client.query('SELECT user_id, email, created_at FROM Users ORDER BY created_at DESC LIMIT 5');
        if (usersRes.rows.length > 0) {
            console.log("\n   Recent Users found in this DB:");
            usersRes.rows.forEach(u => {
                console.log(`   - ID: ${u.user_id}, Email: ${u.email}, Created: ${u.created_at}`);
            });
        } else {
            console.log("\n   ⚠️ No users found in this database.");
        }

        client.release();
    } catch (error) {
        console.error("\n❌ Connection Failed!");
        console.error(error);
    } finally {
        await pool.end();
    }
}

diagnose();
