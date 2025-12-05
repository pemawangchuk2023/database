"use client";

import { useEffect, useState } from "react";
import { CheckCircle, XCircle, Clock, Loader2, User, Mail, Building } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { getPendingUsers, approveUser, rejectUser } from "@/actions/auth";

type PendingUser = {
    id: string;
    name: string;
    email: string;
    role: string;
    department: string;
    createdAt: string;
};

interface PendingUsersDialogProps {
    pendingCount?: number;
}

export function PendingUsersDialog({ pendingCount = 0 }: PendingUsersDialogProps) {
    const [open, setOpen] = useState(false);
    const [pendingUsers, setPendingUsers] = useState<PendingUser[]>([]);
    const [loading, setLoading] = useState(false);
    const [processingId, setProcessingId] = useState<string | null>(null);

    useEffect(() => {
        if (open) {
            loadPendingUsers();
        }
    }, [open]);

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
            toast.success(`${userName} has been rejected`);
            setPendingUsers(prev => prev.filter(u => u.id !== userId));
        } else {
            toast.error(result.error || "Failed to reject user");
        }
        setProcessingId(null);
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="outline" className="gap-2 relative">
                    <Clock className="h-4 w-4" />
                    Pending Approvals
                    {pendingCount > 0 && (
                        <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-red-500 text-white text-xs flex items-center justify-center">
                            {pendingCount}
                        </span>
                    )}
                </Button>
            </DialogTrigger>
            <DialogContent className="max-w-3xl max-h-[80vh]">
                <DialogHeader>
                    <DialogTitle>Pending User Approvals</DialogTitle>
                    <DialogDescription>
                        Review and approve user registration requests
                    </DialogDescription>
                </DialogHeader>

                {loading ? (
                    <div className="flex items-center justify-center py-12">
                        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                    </div>
                ) : pendingUsers.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-12">
                        <CheckCircle className="h-16 w-16 text-muted-foreground mb-4" />
                        <h3 className="text-lg font-semibold mb-2">All caught up!</h3>
                        <p className="text-muted-foreground text-center text-sm">
                            There are no pending user approvals at this time.
                        </p>
                    </div>
                ) : (
                    <ScrollArea className="max-h-[500px] pr-4">
                        <div className="space-y-4">
                            {pendingUsers.map((user) => (
                                <div
                                    key={user.id}
                                    className="border rounded-lg p-4 space-y-3 hover:bg-muted/50 transition-colors"
                                >
                                    <div className="flex items-start justify-between">
                                        <div className="space-y-1 flex-1">
                                            <div className="flex items-center gap-2">
                                                <User className="h-4 w-4 text-muted-foreground" />
                                                <span className="font-semibold">{user.name}</span>
                                            </div>
                                            <div className="flex items-center gap-4 text-sm text-muted-foreground flex-wrap">
                                                <span className="flex items-center gap-1">
                                                    <Mail className="h-3 w-3" />
                                                    {user.email}
                                                </span>
                                                {user.department && (
                                                    <span className="flex items-center gap-1">
                                                        <Building className="h-3 w-3" />
                                                        {user.department}
                                                    </span>
                                                )}
                                                <span className="flex items-center gap-1">
                                                    <Clock className="h-3 w-3" />
                                                    {new Date(user.createdAt).toLocaleDateString()}
                                                </span>
                                            </div>
                                        </div>
                                        <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
                                            Pending
                                        </Badge>
                                    </div>
                                    <div className="flex gap-2">
                                        <Button
                                            onClick={() => handleApprove(user.id, user.name)}
                                            disabled={processingId === user.id}
                                            size="sm"
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
                                            size="sm"
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
                                </div>
                            ))}
                        </div>
                    </ScrollArea>
                )}
            </DialogContent>
        </Dialog>
    );
}
