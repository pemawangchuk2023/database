"use server";

import pool from "@/lib/db";
import { getSession } from "@/actions/auth";

export async function getDocumentActivityStats() {
    const session = await getSession();
    if (!session) return null;

    try {
        // Total documents
        const totalDocsResult = await pool.query("SELECT COUNT(*) FROM Documents");
        const totalDocs = parseInt(totalDocsResult.rows[0].count);

        // Total downloads
        const totalDownloadsResult = await pool.query("SELECT SUM(downloads) FROM Documents");
        const totalDownloads = parseInt(totalDownloadsResult.rows[0].sum || "0");

        // Total views
        const totalViewsResult = await pool.query("SELECT SUM(views) FROM Documents");
        const totalViews = parseInt(totalViewsResult.rows[0].sum || "0");

        // Recent uploads (last 5)
        const recentUploadsResult = await pool.query(`
            SELECT title, created_at 
            FROM Documents 
            ORDER BY created_at DESC 
            LIMIT 5
        `);

        return {
            totalDocs,
            totalDownloads,
            totalViews,
            recentUploads: recentUploadsResult.rows,
        };
    } catch (error) {
        console.error("Error fetching document activity stats:", error);
        return null;
    }
}

export async function getUsageStats() {
    const session = await getSession();
    if (!session) return null;

    try {
        // Total users
        const totalUsersResult = await pool.query("SELECT COUNT(*) FROM Users");
        const totalUsers = parseInt(totalUsersResult.rows[0].count);

        // Active users (unique users in ActivityLogs in last 30 days)
        const activeUsersResult = await pool.query(`
            SELECT COUNT(DISTINCT user_id) 
            FROM ActivityLogs 
            WHERE created_at > NOW() - INTERVAL '30 days'
        `);
        const activeUsers = parseInt(activeUsersResult.rows[0].count);

        // Total actions
        const totalActionsResult = await pool.query("SELECT COUNT(*) FROM ActivityLogs");
        const totalActions = parseInt(totalActionsResult.rows[0].count);

        // Recent actions
        const recentActionsResult = await pool.query(`
            SELECT a.action, a.details, a.created_at, u.name as user_name
            FROM ActivityLogs a
            JOIN Users u ON a.user_id = u.user_id
            ORDER BY a.created_at DESC
            LIMIT 5
        `);

        return {
            totalUsers,
            activeUsers,
            totalActions,
            recentActions: recentActionsResult.rows,
        };
    } catch (error) {
        console.error("Error fetching usage stats:", error);
        return null;
    }
}

export async function getMonthlySummary() {
    const session = await getSession();
    if (!session) return null;

    try {
        // Current month stats
        const currentMonth = new Date();
        const startOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1).toISOString();

        // New documents this month
        const newDocsResult = await pool.query(`
            SELECT COUNT(*) FROM Documents 
            WHERE created_at >= $1
        `, [startOfMonth]);
        const newDocs = parseInt(newDocsResult.rows[0].count);

        // New users this month
        const newUsersResult = await pool.query(`
            SELECT COUNT(*) FROM Users 
            WHERE created_at >= $1
        `, [startOfMonth]);
        const newUsers = parseInt(newUsersResult.rows[0].count);

        // Activity count this month
        const activityCountResult = await pool.query(`
            SELECT COUNT(*) FROM ActivityLogs 
            WHERE created_at >= $1
        `, [startOfMonth]);
        const activityCount = parseInt(activityCountResult.rows[0].count);

        return {
            month: currentMonth.toLocaleString('default', { month: 'long', year: 'numeric' }),
            newDocs,
            newUsers,
            activityCount,
        };
    } catch (error) {
        console.error("Error fetching monthly summary:", error);
        return null;
    }
}
