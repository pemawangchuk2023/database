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
