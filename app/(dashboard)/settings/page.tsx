import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Settings as SettingsIcon, Bell, Lock, Database, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";

export default function SettingsPage() {
    return (
        <div className="max-w-4xl space-y-6 animate-in fade-in duration-500">
            {/* Page Header */}
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
                <p className="text-muted-foreground mt-1">
                    Manage your application settings and preferences
                </p>
            </div>

            {/* General Settings */}
            <Card className="bg-card/95 backdrop-blur-sm border shadow-lg">
                <CardHeader>
                    <div className="flex items-center gap-2">
                        <SettingsIcon className="h-5 w-5" />
                        <CardTitle>General Settings</CardTitle>
                    </div>
                    <CardDescription>Configure general application settings</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="orgName">Organization Name</Label>
                        <Input id="orgName" defaultValue="Ministry of Finance" />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="timezone">Timezone</Label>
                        <Input id="timezone" defaultValue="Asia/Dhaka (GMT+6)" />
                    </div>
                </CardContent>
            </Card>

            {/* Notifications */}
            <Card className="bg-card/95 backdrop-blur-sm border shadow-lg">
                <CardHeader>
                    <div className="flex items-center gap-2">
                        <Bell className="h-5 w-5" />
                        <CardTitle>Notifications</CardTitle>
                    </div>
                    <CardDescription>Manage notification preferences</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                            <Label>Email Notifications</Label>
                            <p className="text-sm text-muted-foreground">Receive email updates for new documents</p>
                        </div>
                        <Switch defaultChecked />
                    </div>
                    <Separator />
                    <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                            <Label>Document Upload Alerts</Label>
                            <p className="text-sm text-muted-foreground">Get notified when documents are uploaded</p>
                        </div>
                        <Switch defaultChecked />
                    </div>
                    <Separator />
                    <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                            <Label>Weekly Reports</Label>
                            <p className="text-sm text-muted-foreground">Receive weekly activity summaries</p>
                        </div>
                        <Switch />
                    </div>
                </CardContent>
            </Card>

            {/* Security */}
            <Card className="bg-card/95 backdrop-blur-sm border shadow-lg">
                <CardHeader>
                    <div className="flex items-center gap-2">
                        <Lock className="h-5 w-5" />
                        <CardTitle>Security</CardTitle>
                    </div>
                    <CardDescription>Manage security and access settings</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                            <Label>Two-Factor Authentication</Label>
                            <p className="text-sm text-muted-foreground">Add an extra layer of security</p>
                        </div>
                        <Button variant="outline" size="sm">Enable</Button>
                    </div>
                    <Separator />
                    <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                            <Label>Session Timeout</Label>
                            <p className="text-sm text-muted-foreground">Auto logout after inactivity</p>
                        </div>
                        <Input className="w-32" defaultValue="30 minutes" />
                    </div>
                </CardContent>
            </Card>

            {/* Storage */}
            <Card className="bg-card/95 backdrop-blur-sm border shadow-lg">
                <CardHeader>
                    <div className="flex items-center gap-2">
                        <Database className="h-5 w-5" />
                        <CardTitle>Storage</CardTitle>
                    </div>
                    <CardDescription>Manage storage and file settings</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                            <span>Storage Used</span>
                            <span className="font-medium">2.4 GB / 4 GB</span>
                        </div>
                        <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                            <div className="h-full w-[60%] rounded-full bg-gradient-to-br from-primary to-primary/80" />
                        </div>
                    </div>
                    <Separator />
                    <div className="space-y-2">
                        <Label htmlFor="maxFileSize">Maximum File Size (MB)</Label>
                        <Input id="maxFileSize" type="number" defaultValue="50" />
                    </div>
                </CardContent>
            </Card>

            {/* Save Button */}
            <div className="flex gap-4">
                <Button className="flex-1 shadow-lg">Save Changes</Button>
                <Button variant="outline">Cancel</Button>
            </div>
        </div>
    );
}
