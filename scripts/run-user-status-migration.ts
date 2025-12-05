// Migration script to add user status and approval tracking
import 'dotenv/config';
import pool from '../lib/db.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function runMigration() {
    try {
        const sql = fs.readFileSync(
            path.join(__dirname, 'add_user_status.sql'),
            'utf8'
        );

        await pool.query(sql);
        console.log('✅ Migration completed successfully');
        console.log('   - Added status column to user table');
        console.log('   - Added approved_by column to user table');
        console.log('   - Created index on status column');
        console.log('   - Set existing users to active status');

        process.exit(0);
    } catch (error) {
        console.error('❌ Migration failed:', error);
        process.exit(1);
    }
}

runMigration();
