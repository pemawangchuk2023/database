"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { User, Lock, Activity, Save, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { updateUserProfile, changePassword } from "@/actions/user";
import { useRouter, useSearchParams } from "next/navigation";
import { ProfilePhotoUpload } from "@/components/profile-photo-upload";

interface SettingsClientProps {
    user: any;
    logs: any[];
}

const SettingsClient = ({ user, logs }: SettingsClientProps) => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const defaultTab = searchParams.get("tab") || "profile";
    const [isLoading, setIsLoading] = useState(false);

    async function handleProfileUpdate(formData: FormData) {
        setIsLoading(true);
        const result = await updateUserProfile(formData);
        setIsLoading(false);

        if (result.success) {
            toast.success("Profile updated successfully");
            router.refresh();
        } else {
            toast.error(result.error || "Failed to update profile");
        }
    }

    async function handlePasswordChange(formData: FormData) {
        setIsLoading(true);
        const result = await changePassword(formData);
        setIsLoading(false);

        if (result.success) {
            toast.success("Password changed successfully");
        } else {
            toast.error(result.error || "Failed to change password");
        }
    }

    return (
        <div className="max-w-4xl space-y-6 animate-in fade-in duration-500">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
                <p className="text-muted-foreground mt-1">
                    Manage your account settings and preferences
                </p>
            </div>

            <Tabs defaultValue={defaultTab} className="space-y-6">
                <TabsList className="grid w-full rounded-none grid-cols-3 lg:w-[400px]">
                    <TabsTrigger value="profile" className="gap-2">
                        <User className="h-4 w-4" /> Profile
                    </TabsTrigger>
                    <TabsTrigger value="security" className="gap-2">
                        <Lock className="h-4 w-4" /> Security
                    </TabsTrigger>
                    <TabsTrigger value="activity" className="gap-2">
                        <Activity className="h-4 w-4" /> Activity
                    </TabsTrigger>
                </TabsList>

                {/* Profile Tab */}
                <TabsContent value="profile">
                    <Card className="rounded-none border-2">
                        <CardHeader>
                            <CardTitle>Profile Information</CardTitle>
                            <CardDescription>Update your personal details</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form action={handleProfileUpdate} className="space-y-6">
                                {/* Profile Photo Upload */}
                                <ProfilePhotoUpload
                                    currentPhoto={user?.image}
                                    userName={user?.name || "User"}
                                />

                                <Separator />
                                <div className="grid gap-4 md:grid-cols-2">
                                    <div className="space-y-2">
                                        <Label htmlFor="name">Full Name</Label>
                                        <Input id="name" name="name" defaultValue={user?.name} required />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="email">Email Address</Label>
                                        <Input id="email" name="email" defaultValue={user?.email} required />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Department</Label>
                                        <Input value={user?.department_name || "N/A"} disabled className="bg-muted" />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Role</Label>
                                        <Input value={user?.role || "Staff"} disabled className="bg-muted capitalize" />
                                    </div>
                                </div>
                                <div className="flex justify-end">
                                    <Button type="submit" disabled={isLoading}>
                                        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                        Save Changes
                                    </Button>
                                </div>
                            </form>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Security Tab */}
                <TabsContent value="security">
                    <Card className="rounded-none border-2">
                        <CardHeader>
                            <CardTitle>Security Settings</CardTitle>
                            <CardDescription>Manage your password and account security</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form action={handlePasswordChange} className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="currentPassword">Current Password</Label>
                                    <Input id="currentPassword" name="currentPassword" type="password" required />
                                </div>
                                <Separator />
                                <div className="grid gap-4 md:grid-cols-2">
                                    <div className="space-y-2">
                                        <Label htmlFor="newPassword">New Password</Label>
                                        <Input id="newPassword" name="newPassword" type="password" required minLength={8} />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="confirmPassword">Confirm New Password</Label>
                                        <Input id="confirmPassword" name="confirmPassword" type="password" required minLength={8} />
                                    </div>
                                </div>
                                <div className="flex justify-end">
                                    <Button type="submit" disabled={isLoading} className='rounded-none cursor-pointer'>
                                        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                        Update Password
                                    </Button>
                                </div>
                            </form>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Activity Tab */}
                <TabsContent value="activity">
                    <Card className="rounded-none border-2">
                        <CardHeader>
                            <CardTitle>Activity Log</CardTitle>
                            <CardDescription>Recent activity on your account</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-8">
                                {logs.length === 0 ? (
                                    <p className="text-center text-muted-foreground py-8">No recent activity found.</p>
                                ) : (
                                    logs.map((log: any) => (
                                        <div key={log.log_id} className="flex items-center">
                                            <div className="space-y-1">
                                                <p className="text-sm font-medium leading-none">{log.action}</p>
                                                <p className="text-sm text-muted-foreground">
                                                    {log.details}
                                                </p>
                                            </div>
                                            <div className="ml-auto font-medium text-xs text-muted-foreground">
                                                {new Date(log.created_at).toLocaleDateString()} {new Date(log.created_at).toLocaleTimeString()}
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}


export default SettingsClient