import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
    try {
        const { email } = await request.json();

        if (!email) {
            return NextResponse.json({ error: "Email is required" }, { status: 400 });
        }

        // Check user status
        const pool = (await import("@/lib/db")).default;
        const userCheck = await pool.query(
            `SELECT id, email, status FROM "user" WHERE email = $1`,
            [email]
        );

        if (userCheck.rows.length === 0) {
            return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });
        }

        const user = userCheck.rows[0];

        if (user.status === "pending") {
            return NextResponse.json({
                error: "Your account is pending admin approval. Please wait for an administrator to approve your registration."
            }, { status: 403 });
        }

        if (user.status === "rejected") {
            return NextResponse.json({
                error: "Your account has been rejected. Please contact an administrator for more information."
            }, { status: 403 });
        }

        if (user.status !== "active") {
            return NextResponse.json({
                error: "Your account is not active. Please contact an administrator."
            }, { status: 403 });
        }

        return NextResponse.json({ success: true });
    } catch (error: any) {
        console.error("Check user status error:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
