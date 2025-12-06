import { betterAuth } from "better-auth";
import { Pool } from "pg";

// Create PostgreSQL pool for Better Auth
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
});

export const auth = betterAuth({
    database: pool,
    baseURL: process.env.BETTER_AUTH_URL || "http://localhost:3000",
    secret: process.env.BETTER_AUTH_SECRET!,
    trustedOrigins: ["http://localhost:3000"],
    emailAndPassword: {
        enabled: true,
        requireEmailVerification: false,
        sendResetPassword: async ({ user, url }) => {
            // In production, you would send an email here
            // For this implementation, we'll store the URL for display
            console.log(`Password reset for ${user.email}: ${url}`);
            // The URL will be returned to the client via the API response
        },
    },
    user: {
        additionalFields: {
            role: {
                type: "string",
                defaultValue: "staff",
            },
            department: {
                type: "string",
                required: false,
            },
        },
    },
});
