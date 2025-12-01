import { getUserProfile, getActivityLogs } from "@/actions/user";

import { redirect } from "next/navigation";
import SettingsClient from "./client";


export default async function SettingsPage() {
    const user = await getUserProfile();

    if (!user) {
        redirect("/auth/login");
    }

    const logs = await getActivityLogs();

    return <SettingsClient user={user} logs={logs} />;
}
