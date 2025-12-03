import { Pool } from "pg";
import * as dotenv from "dotenv";

// Load environment variables
dotenv.config();

async function addDocumentApprovalStatus() {
	const pool = new Pool({
		host: process.env.DATABASE_HOST,
		port: parseInt(process.env.DATABASE_PORT || "5433"),
		user: process.env.DATABASE_USER,
		password: process.env.DATABASE_PASSWORD,
		database: process.env.DATABASE_NAME,
	});

	try {
		console.log("🔄 Adding document approval status column...");

		// Check if column already exists
		const checkColumn = await pool.query(`
			SELECT column_name 
			FROM information_schema.columns 
			WHERE table_name = 'documents' AND column_name = 'status'
		`);

		if (checkColumn.rows.length > 0) {
			console.log("✅ Status column already exists");
			await pool.end();
			return;
		}

		// Add status column with default value 'pending'
		await pool.query(`
			ALTER TABLE Documents 
			ADD COLUMN status VARCHAR(50) DEFAULT 'pending' 
			CHECK (status IN ('pending', 'approved', 'rejected'))
		`);

		// Add approved_by column to track which admin approved
		await pool.query(`
			ALTER TABLE Documents 
			ADD COLUMN approved_by INT REFERENCES Users(user_id) ON DELETE SET NULL
		`);

		// Add approval date
		await pool.query(`
			ALTER TABLE Documents 
			ADD COLUMN approval_date TIMESTAMP
		`);

		// Create index for faster queries
		await pool.query(`
			CREATE INDEX IF NOT EXISTS idx_documents_status ON Documents(status)
		`);

		console.log("✅ Document approval workflow columns added successfully!");
		console.log("   - status: pending/approved/rejected");
		console.log("   - approved_by: which admin approved");
		console.log("   - approval_date: when it was approved");

		await pool.end();
	} catch (error) {
		console.error("❌ Migration failed:", error);
		await pool.end();
		process.exit(1);
	}
}

addDocumentApprovalStatus();
