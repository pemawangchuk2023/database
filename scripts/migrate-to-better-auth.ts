import { Pool } from "pg";
import dotenv from "dotenv";

dotenv.config();

const pool = new Pool({
    host: process.env.DATABASE_HOST,
    port: 5433,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_NAME,
});

async function migrateToBetterAuth() {
    const client = await pool.connect();

    try {
        console.log("🚀 Starting Better Auth migration...\n");

        // Start transaction
        await client.query("BEGIN");

        // 1. Create Better Auth tables
        console.log("📋 Creating Better Auth tables...");

        // User table
        await client.query(`
            CREATE TABLE IF NOT EXISTS "user" (
                "id" TEXT PRIMARY KEY,
                "email" TEXT NOT NULL UNIQUE,
                "emailVerified" BOOLEAN NOT NULL DEFAULT false,
                "name" TEXT NOT NULL,
                "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
                "updatedAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
                "image" TEXT,
                "role" TEXT NOT NULL DEFAULT 'staff',
                "department" TEXT
            )
        `);

        // Session table
        await client.query(`
            CREATE TABLE IF NOT EXISTS "session" (
                "id" TEXT PRIMARY KEY,
                "expiresAt" TIMESTAMP NOT NULL,
                "ipAddress" TEXT,
                "userAgent" TEXT,
                "userId" TEXT NOT NULL REFERENCES "user"(id) ON DELETE CASCADE,
                "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
                "updatedAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
            )
        `);

        // Account table (for OAuth, etc.)
        await client.query(`
            CREATE TABLE IF NOT EXISTS "account" (
                "id" TEXT PRIMARY KEY,
                "accountId" TEXT NOT NULL,
                "providerId" TEXT NOT NULL,
                "userId" TEXT NOT NULL REFERENCES "user"(id) ON DELETE CASCADE,
                "accessToken" TEXT,
                "refreshToken" TEXT,
                "idToken" TEXT,
                "expiresAt" TIMESTAMP,
                "password" TEXT,
                "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
                "updatedAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
            )
        `);

        // Verification table
        await client.query(`
            CREATE TABLE IF NOT EXISTS "verification" (
                "id" TEXT PRIMARY KEY,
                "identifier" TEXT NOT NULL,
                "value" TEXT NOT NULL,
                "expiresAt" TIMESTAMP NOT NULL,
                "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
                "updatedAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
            )
        `);

        console.log("✅ Better Auth tables created\n");

        // 2. Migrate existing users
        console.log("👥 Migrating existing users...");

        const existingUsers = await client.query(`
            SELECT user_id, name, email, password, role, department_id, image, created_at, updated_at
            FROM users
            ORDER BY user_id
        `);

        console.log(`Found ${existingUsers.rows.length} users to migrate`);

        for (const user of existingUsers.rows) {
            // Get department name if department_id exists
            let departmentName = null;
            if (user.department_id) {
                const deptResult = await client.query(
                    `SELECT name FROM department WHERE department_id = $1`,
                    [user.department_id]
                );
                if (deptResult.rows.length > 0) {
                    departmentName = deptResult.rows[0].name;
                }
            }

            // Insert into Better Auth user table
            await client.query(`
                INSERT INTO "user" (id, email, "emailVerified", name, "createdAt", "updatedAt", image, role, department)
                VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
                ON CONFLICT (email) DO NOTHING
            `, [
                user.user_id.toString(),
                user.email,
                true, // Mark as verified since they're existing users
                user.name,
                user.created_at,
                user.updated_at,
                user.image,
                user.role,
                departmentName
            ]);

            // Insert into account table with password
            await client.query(`
                INSERT INTO "account" (id, "accountId", "providerId", "userId", password, "createdAt", "updatedAt")
                VALUES ($1, $2, $3, $4, $5, $6, $7)
                ON CONFLICT (id) DO NOTHING
            `, [
                `account_${user.user_id}`,
                user.email,
                "credential",
                user.user_id.toString(),
                user.password, // Better Auth uses bcrypt, same as current system
                user.created_at,
                user.updated_at
            ]);

            console.log(`  ✓ Migrated user: ${user.email} (ID: ${user.user_id})`);
        }

        console.log(`✅ Migrated ${existingUsers.rows.length} users\n`);

        // 3. Clean up old Sessions table
        console.log("🧹 Cleaning up old sessions...");
        await client.query(`DELETE FROM sessions`);
        console.log("✅ Old sessions cleared\n");

        // 4. Create indexes for Better Auth tables
        console.log("📊 Creating indexes...");
        await client.query(`CREATE INDEX IF NOT EXISTS "idx_session_userId" ON "session"("userId")`);
        await client.query(`CREATE INDEX IF NOT EXISTS "idx_account_userId" ON "account"("userId")`);
        await client.query(`CREATE INDEX IF NOT EXISTS "idx_user_email" ON "user"("email")`);
        console.log("✅ Indexes created\n");

        // Commit transaction
        await client.query("COMMIT");

        console.log("🎉 Migration completed successfully!");
        console.log("\n📊 Summary:");
        console.log(`   - Better Auth tables created: user, session, account, verification`);
        console.log(`   - Users migrated: ${existingUsers.rows.length}`);
        console.log(`   - Old sessions cleared`);
        console.log("\n⚠️  Note: All users will need to log in again with their existing credentials.");

    } catch (error) {
        await client.query("ROLLBACK");
        console.error("❌ Migration failed:", error);
        throw error;
    } finally {
        client.release();
        await pool.end();
    }
}

// Run migration
migrateToBetterAuth()
    .then(() => {
        console.log("\n✅ Migration script completed");
        process.exit(0);
    })
    .catch((error) => {
        console.error("\n❌ Migration script failed:", error);
        process.exit(1);
    });
