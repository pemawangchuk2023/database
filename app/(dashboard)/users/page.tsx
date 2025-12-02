import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, UserPlus, Shield, UserCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { getAllUsers, getUserStats } from "@/actions/user.action";
import { formatDistanceToNow } from "date-fns";

export default async function UsersPage() {
    // Fetch real data from database
    const usersResult = await getAllUsers();
    const statsResult = await getUserStats();

    const users = usersResult.success ? usersResult.data : [];
    const stats = statsResult.success ? statsResult.data : {
        totalUsers: 0,
        totalAdmins: 0,
        totalManagers: 0,
        totalStaff: 0,
    };

    const getRoleBadge = (role: string) => {
        switch (role) {
            case "admin":
                return <Badge className="bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20">Admin</Badge>;
            case "manager":
                return <Badge className="bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20">Manager</Badge>;
            default:
                return <Badge className="bg-gray-500/10 text-gray-600 dark:text-gray-400 border-gray-500/20">Staff</Badge>;
        }
    };

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            {/* Page Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
                        User Management
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400 mt-1">
                        Manage system users and their permissions
                    </p>
                </div>
                <Button className="gap-2 shadow-lg bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 hover:shadow-xl hover:scale-105">
                    <UserPlus className="h-4 w-4" />
                    Add User
                </Button>
            </div>

            {/* Stats */}
            <div className="grid gap-4 md:grid-cols-4">
                <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 border-2 border-blue-200/50 dark:border-blue-800/50 shadow-lg hover:shadow-xl transition-all hover:-translate-y-1">
                    <CardContent className="p-6">
                        <div className="flex items-center gap-4">
                            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-500/10">
                                <Users className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                            </div>
                            <div>
                                <p className="text-sm text-gray-600 dark:text-gray-400">Total Users</p>
                                <p className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                                    {stats.totalUsers}
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-red-50 to-orange-50 dark:from-red-950/20 dark:to-orange-950/20 border-2 border-red-200/50 dark:border-red-800/50 shadow-lg hover:shadow-xl transition-all hover:-translate-y-1">
                    <CardContent className="p-6">
                        <div className="flex items-center gap-4">
                            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-red-500/10">
                                <Shield className="h-6 w-6 text-red-600 dark:text-red-400" />
                            </div>
                            <div>
                                <p className="text-sm text-gray-600 dark:text-gray-400">Administrators</p>
                                <p className="text-3xl font-bold bg-gradient-to-r from-red-600 to-orange-600 bg-clip-text text-transparent">
                                    {stats.totalAdmins}
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950/20 dark:to-pink-950/20 border-2 border-purple-200/50 dark:border-purple-800/50 shadow-lg hover:shadow-xl transition-all hover:-translate-y-1">
                    <CardContent className="p-6">
                        <div className="flex items-center gap-4">
                            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-purple-500/10">
                                <UserCheck className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                            </div>
                            <div>
                                <p className="text-sm text-gray-600 dark:text-gray-400">Managers</p>
                                <p className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                                    {stats.totalManagers}
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 border-2 border-green-200/50 dark:border-green-800/50 shadow-lg hover:shadow-xl transition-all hover:-translate-y-1">
                    <CardContent className="p-6">
                        <div className="flex items-center gap-4">
                            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-green-500/10">
                                <Users className="h-6 w-6 text-green-600 dark:text-green-400" />
                            </div>
                            <div>
                                <p className="text-sm text-gray-600 dark:text-gray-400">Staff Members</p>
                                <p className="text-3xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                                    {stats.totalStaff}
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Users List */}
            <Card className="bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm border-2 shadow-lg">
                <CardHeader>
                    <CardTitle>All Users</CardTitle>
                    <CardDescription>Manage user accounts and permissions</CardDescription>
                </CardHeader>
                <CardContent>
                    {users.length > 0 ? (
                        <div className="space-y-2">
                            {users.map((user: any, index: number) => (
                                <div
                                    key={user.user_id}
                                    className="flex items-center gap-4 p-4 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-900 transition-all duration-300 border border-transparent hover:border-gray-200 dark:hover:border-gray-800"
                                    style={{ animationDelay: `${index * 50}ms` }}
                                >
                                    <Avatar className="h-12 w-12">
                                        <AvatarFallback className="bg-gradient-to-br from-blue-600 to-indigo-600 text-white font-semibold">
                                            {user.name.split(' ').map((n: string) => n[0]).join('')}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div className="flex-1">
                                        <p className="font-medium text-gray-900 dark:text-white">{user.name}</p>
                                        <p className="text-sm text-gray-600 dark:text-gray-400">{user.email}</p>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        {user.department_name && (
                                            <div className="text-right hidden sm:block">
                                                <p className="text-sm font-medium text-gray-900 dark:text-white">{user.department_name}</p>
                                                <p className="text-xs text-gray-500 dark:text-gray-500">Department</p>
                                            </div>
                                        )}
                                        {getRoleBadge(user.role)}
                                        <div className="text-right hidden md:block">
                                            <p className="text-xs text-gray-500 dark:text-gray-500">
                                                Joined {formatDistanceToNow(new Date(user.created_at), { addSuffix: true })}
                                            </p>
                                        </div>
                                        <Button size="sm" variant="outline" className="border-2">
                                            Manage
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-12 text-gray-500">
                            <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
                            <p>No users found</p>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
