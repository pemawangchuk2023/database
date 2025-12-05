"use client";

import { useEffect, useState } from "react";
import { CheckCircle, XCircle, Clock, Loader2, User, Mail, Building } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getPendingUsers, approveUser, rejectUser } from "@/actions/auth";

type PendingUser = {
    id: string;
    name: string;
    email: string;
    role: string;
    department: string;
    createdAt: string;
};

export default function PendingUsersPage() {
    const [pendingUsers, setPendingUsers] = useState<PendingUser[]>([]);
    const [loading, setLoading] = useState(true);
    const [processingId, setProcessingId] = useState<string | null>(null);

    useEffect(() => {
        loadPendingUsers();
    }, []);

    async function loadPendingUsers() {
        setLoading(true);
        const result = await getPendingUsers();
        if (result.success && result.data) {
            setPendingUsers(result.data);
        } else if (result.error) {
            toast.error(result.error);
        }
        setLoading(false);
    }

    async function handleApprove(userId: string, userName: string) {
        setProcessingId(userId);
        const result = await approveUser(userId);

        if (result.success) {
            toast.success(`${userName} has been approved`, {
                description: "The user can now log in to the system.",
            });
            // Remove from list
            setPendingUsers(prev => prev.filter(u => u.id !== userId));
        } else {
            toast.error(result.error || "Failed to approve user");
        }
        setProcessingId(null);
    }

    async function handleReject(userId: string, userName: string) {
        setProcessingId(userId);
        const result = await rejectUser(userId);

        if (result.success) {
            toast.success(`${userName} has been rejected`, {
                description: "The user will not be able to access the system.",
            });
            // Remove from list
            setPendingUsers(prev => prev.filter(u => u.id !== userId));
        } else {
            toast.error(result.error || "Failed to reject user");
        }
        setProcessingId(null);
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
        );
    }

    return (
        <div className="container mx-auto py-8 px-4 max-w-6xl">
            <div className="mb-8">
                <h1 className="text-3xl font-bold mb-2">Pending User Approvals</h1>
                <p className="text-muted-foreground">
                    Review and approve user registration requests
                </p>
            </div>

            {pendingUsers.length === 0 ? (
                <Card>
                    <CardContent className="flex flex-col items-center justify-center py-12">
                        <CheckCircle className="h-16 w-16 text-muted-foreground mb-4" />
                        <h3 className="text-xl font-semibold mb-2">All caught up!</h3>
                        <p className="text-muted-foreground text-center">
                            There are no pending user approvals at this time.
                        </p>
                    </CardContent>
                </Card>
            ) : (
                <div className="grid gap-4">
                    {pendingUsers.map((user) => (
                        <Card key={user.id} className="hover:shadow-md transition-shadow">
                            <CardHeader>
                                <div className="flex items-start justify-between">
                                    <div className="space-y-1">
                                        <CardTitle className="flex items-center gap-2">
                                            <User className="h-5 w-5 text-muted-foreground" />
                                            {user.name}
                                        </CardTitle>
                                        <CardDescription className="flex items-center gap-4 flex-wrap">
                                            <span className="flex items-center gap-1">
                                                <Mail className="h-4 w-4" />
                                                {user.email}
                                            </span>
                                            <span className="flex items-center gap-1">
                                                <Building className="h-4 w-4" />
                                                {user.department || "No department"}
                                            </span>
                                            <span className="flex items-center gap-1">
                                                <Clock className="h-4 w-4" />
                                                {new Date(user.createdAt).toLocaleDateString()}
                                            </span>
                                        </CardDescription>
                                    </div>
                                    <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
                                        Pending
                                    </Badge>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="flex gap-3">
                                    <Button
                                        onClick={() => handleApprove(user.id, user.name)}
                                        disabled={processingId === user.id}
                                        className="flex-1 bg-green-600 hover:bg-green-700"
                                    >
                                        {processingId === user.id ? (
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        ) : (
                                            <CheckCircle className="mr-2 h-4 w-4" />
                                        )}
                                        Approve
                                    </Button>
                                    <Button
                                        onClick={() => handleReject(user.id, user.name)}
                                        disabled={processingId === user.id}
                                        variant="destructive"
                                        className="flex-1"
                                    >
                                        {processingId === user.id ? (
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        ) : (
                                            <XCircle className="mr-2 h-4 w-4" />
                                        )}
                                        Reject
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
}
