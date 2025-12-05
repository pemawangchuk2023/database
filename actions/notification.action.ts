"use server";

import pool from "@/lib/db";
import { getSession } from "@/actions/auth";
import { revalidatePath } from "next/cache";

export type ActionResponse = {
    success?: boolean;
    error?: string;
    data?: any;
};

/**
 * Get user notifications
 */
export async function getNotifications(limit: number = 10): Promise<ActionResponse> {
    try {
        const session = await getSession();
        if (!session) {
            return { error: "Unauthorized" };
        }

        const result = await pool.query(
            `SELECT 
        notification_id,
        title,
        message,
        type,
        read,
        link,
        created_at
      FROM Notifications
      WHERE user_id = $1
      ORDER BY created_at DESC
      LIMIT $2`,
            [session.userId, limit]
        );

        return {
            success: true,
            data: result.rows,
        };
    } catch (error) {
        console.error("Get notifications error:", error);
        return { error: "Failed to fetch notifications" };
    }
}

/**
 * Get unread notification count
 */
export async function getUnreadCount(): Promise<ActionResponse> {
    try {
        const session = await getSession();
        if (!session) {
            return { error: "Unauthorized" };
        }

        const result = await pool.query(
            "SELECT COUNT(*) as count FROM Notifications WHERE user_id = $1 AND read = FALSE",
            [session.userId]
        );

        return {
            success: true,
            data: { count: parseInt(result.rows[0].count) },
        };
    } catch (error) {
        console.error("Get unread count error:", error);
        return { error: "Failed to fetch unread count" };
    }
}

/**
 * Mark notification as read
 */
export async function markAsRead(notificationId: string): Promise<ActionResponse> {
    try {
        const session = await getSession();
        if (!session) {
            return { error: "Unauthorized" };
        }

        await pool.query(
            "UPDATE Notifications SET read = TRUE WHERE notification_id = $1 AND user_id = $2",
            [notificationId, session.userId]
        );

        revalidatePath("/");

        return { success: true };
    } catch (error) {
        console.error("Mark as read error:", error);
        return { error: "Failed to mark notification as read" };
    }
}

/**
 * Mark all notifications as read
 */
export async function markAllAsRead(): Promise<ActionResponse> {
    try {
        const session = await getSession();
        if (!session) {
            return { error: "Unauthorized" };
        }

        await pool.query(
            "UPDATE Notifications SET read = TRUE WHERE user_id = $1 AND read = FALSE",
            [session.userId]
        );

        revalidatePath("/");

        return { success: true };
    } catch (error) {
        console.error("Mark all as read error:", error);
        return { error: "Failed to mark all notifications as read" };
    }
}

/**
 * Create a notification
 */
export async function createNotification(
    userId: string,
    title: string,
    message: string,
    type: string = "system",
    link?: string
): Promise<ActionResponse> {
    try {
        await pool.query(
            `INSERT INTO Notifications (user_id, title, message, type, link) 
       VALUES ($1, $2, $3, $4, $5)`,
            [userId, title, message, type, link || null]
        );

        return { success: true };
    } catch (error) {
        console.error("Create notification error:", error);
        return { error: "Failed to create notification" };
    }
}

/**
 * Delete a notification
 */
export async function deleteNotification(notificationId: string): Promise<ActionResponse> {
    try {
        const session = await getSession();
        if (!session) {
            return { error: "Unauthorized" };
        }

        await pool.query(
            "DELETE FROM Notifications WHERE notification_id = $1 AND user_id = $2",
            [notificationId, session.userId]
        );

        revalidatePath("/");

        return { success: true };
    } catch (error) {
        console.error("Delete notification error:", error);
        return { error: "Failed to delete notification" };
    }
}
