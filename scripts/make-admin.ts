import { Pool } from "pg";
import * as dotenv from "dotenv";

// Load environment variables
dotenv.config();

/**
 * Bootstrap Admin User Script
 *
 * This script is used to promote a user to admin role.
 * It should only be used during initial setup or by database administrators.
 * In production, admin role assignment should only be done through the UI by existing admins.
 *
 * Usage: tsx scripts/make-admin.ts <email>
 * Example: tsx scripts/make-admin.ts pemawangchug1986@gmail.com
 */
async function makeAdmin(email: string) {
	const pool = new Pool({
		host: process.env.DATABASE_HOST,
		port: parseInt(process.env.DATABASE_PORT || "5433"),
		user: process.env.DATABASE_USER,
		password: process.env.DATABASE_PASSWORD,
		database: process.env.DATABASE_NAME,
	});

	try {
		// Find user by email
		const userResult = await pool.query(
			"SELECT user_id, name, role FROM Users WHERE email = $1",
			[email]
		);

		if (userResult.rows.length === 0) {
			console.log(`❌ User with email ${email} not found`);
			process.exit(1);
		}

		const user = userResult.rows[0];
		console.log(
			`Found user: ${user.name} (${email}), current role: ${user.role}`
		);

		if (user.role === "admin") {
			console.log(`✅ User ${user.name} is already an admin`);
			await pool.end();
			process.exit(0);
		}

		// Update user role to admin
		await pool.query(
			"UPDATE Users SET role = 'admin', updated_at = CURRENT_TIMESTAMP WHERE email = $1",
			[email]
		);

		console.log(`✅ User ${user.name} (${email}) has been promoted to admin`);
		await pool.end();
		process.exit(0);
	} catch (error) {
		console.error("Error:", error);
		await pool.end();
		process.exit(1);
	}
}

// Get email from command line arguments
const email = process.argv[2];
if (!email) {
	console.log("Usage: npm run db:make-admin <email>");
	console.log("Example: npm run db:make-admin pemawangchug1986@gmail.com");
	process.exit(1);
}

makeAdmin(email);
