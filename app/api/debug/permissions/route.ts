import { getSession } from "@/lib/auth";
import { isAdmin } from "@/lib/permissions";

export async function GET() {
	try {
		const session = await getSession();

		if (!session) {
			return Response.json({ error: "No session" }, { status: 401 });
		}

		const userIsAdmin = await isAdmin(session.userId);

		return Response.json({
			sessionUserId: session.userId,
			sessionRole: session.role,
			isAdminCheck: userIsAdmin,
			timestamp: new Date().toISOString(),
		});
	} catch (error) {
		return Response.json({ error: String(error) }, { status: 500 });
	}
}
