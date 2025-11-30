import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, UserPlus, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

const mockUsers = [
    { id: "1", name: "Admin User", email: "admin@finance.gov", role: "admin", department: "Administration" },
    { id: "2", name: "John Doe", email: "john.doe@finance.gov", role: "manager", department: "Budget" },
    { id: "3", name: "Jane Smith", email: "jane.smith@finance.gov", role: "manager", department: "Audit" },
    { id: "4", name: "Bob Wilson", email: "bob.wilson@finance.gov", role: "staff", department: "Records" },
    { id: "5", name: "Alice Brown", email: "alice.brown@finance.gov", role: "staff", department: "Compliance" },
];

export default function UsersPage() {
    const getRoleBadge = (role: string) => {
        switch (role) {
            case "admin":
                return <Badge className="bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20">Admin</Badge>;
            case "manager":
                return <Badge className="bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20">Manager</Badge>;
            default:
                return <Badge variant="secondary">Staff</Badge>;
        }
    };

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            {/* Page Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">User Management</h1>
                    <p className="text-muted-foreground mt-1">
                        Manage system users and their permissions
                    </p>
                </div>
                <Button className="gap-2 shadow-lg transition-all duration-300 ease-in-out hover:-translate-y-1 hover:shadow-xl">
                    <UserPlus className="h-4 w-4" />
                    Add User
                </Button>
            </div>

            {/* Stats */}
            <div className="grid gap-4 md:grid-cols-3">
                <Card className="bg-card/95 backdrop-blur-sm border shadow-lg">
                    <CardContent className="p-6">
                        <div className="flex items-center gap-4">
                            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
                                <Users className="h-6 w-6" />
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">Total Users</p>
                                <p className="text-2xl font-bold">{mockUsers.length}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-card/95 backdrop-blur-sm border shadow-lg">
                    <CardContent className="p-6">
                        <div className="flex items-center gap-4">
                            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-500/10 text-blue-600">
                                <Shield className="h-6 w-6" />
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">Administrators</p>
                                <p className="text-2xl font-bold">
                                    {mockUsers.filter(u => u.role === "admin").length}
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-card/95 backdrop-blur-sm border shadow-lg">
                    <CardContent className="p-6">
                        <div className="flex items-center gap-4">
                            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-green-500/10 text-green-600">
                                <Users className="h-6 w-6" />
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">Active Users</p>
                                <p className="text-2xl font-bold">{mockUsers.length}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Users List */}
            <Card className="bg-card/95 backdrop-blur-sm border shadow-lg">
                <CardHeader>
                    <CardTitle>All Users</CardTitle>
                    <CardDescription>Manage user accounts and permissions</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-3">
                        {mockUsers.map((user, index) => (
                            <div
                                key={user.id}
                                className="flex items-center gap-4 p-4 rounded-lg hover:bg-accent/50 transition-all duration-300 ease-in-out"
                                style={{ animationDelay: `${index * 50}ms` }}
                            >
                                <Avatar className="h-12 w-12">
                                    <AvatarFallback className="bg-primary text-primary-foreground">
                                        {user.name.split(' ').map(n => n[0]).join('')}
                                    </AvatarFallback>
                                </Avatar>
                                <div className="flex-1">
                                    <p className="font-medium">{user.name}</p>
                                    <p className="text-sm text-muted-foreground">{user.email}</p>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="text-right">
                                        <p className="text-sm font-medium">{user.department}</p>
                                        <p className="text-xs text-muted-foreground">Department</p>
                                    </div>
                                    {getRoleBadge(user.role)}
                                    <Button size="sm" variant="outline">
                                        Manage
                                    </Button>
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
