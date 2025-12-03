"use client";

import { useActionState, useEffect, useState } from "react";
import { resetPassword, validateResetToken } from "@/actions/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Lock, CheckCircle2, AlertCircle } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function ResetPasswordPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const token = searchParams.get("token");

    const [state, formAction, isPending] = useActionState(resetPassword, {});
    const [tokenValidation, setTokenValidation] = useState<{ valid: boolean; error?: string } | null>(null);
    const [isValidating, setIsValidating] = useState(true);

    useEffect(() => {
        async function checkToken() {
            if (!token) {
                setTokenValidation({ valid: false, error: "No reset token provided" });
                setIsValidating(false);
                return;
            }

            const result = await validateResetToken(token);
            setTokenValidation(result);
            setIsValidating(false);
        }

        checkToken();
    }, [token]);

    useEffect(() => {
        if (state.success) {
            setTimeout(() => {
                router.push("/auth/login");
            }, 2000);
        }
    }, [state.success, router]);

    if (isValidating) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 p-4">
                <Card className="w-full max-w-md shadow-2xl border-2">
                    <CardContent className="p-12 text-center">
                        <div className="h-12 w-12 mx-auto mb-4 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
                        <p className="text-muted-foreground">Validating reset link...</p>
                    </CardContent>
                </Card>
            </div>
        );
    }

    if (!tokenValidation?.valid) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 p-4">
                <Card className="w-full max-w-md shadow-2xl border-2">
                    <CardHeader className="space-y-1">
                        <div className="flex items-center gap-2 mb-2">
                            <div className="p-2 bg-red-500/10 rounded-lg">
                                <AlertCircle className="h-6 w-6 text-red-600 dark:text-red-400" />
                            </div>
                            <CardTitle className="text-2xl font-bold">Invalid Reset Link</CardTitle>
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <Alert variant="destructive">
                            <AlertDescription>
                                {tokenValidation?.error || "This password reset link is invalid or has expired."}
                            </AlertDescription>
                        </Alert>
                        <Link href="/auth/forgot-password" className="block">
                            <Button className="w-full">Request New Reset Link</Button>
                        </Link>
                        <Link href="/auth/login" className="block">
                            <Button variant="outline" className="w-full">Back to Login</Button>
                        </Link>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 p-4">
            <Card className="w-full max-w-md shadow-2xl border-2">
                <CardHeader className="space-y-1">
                    <div className="flex items-center gap-2 mb-2">
                        <div className="p-2 bg-blue-500/10 rounded-lg">
                            <Lock className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                        </div>
                        <CardTitle className="text-2xl font-bold">Reset Password</CardTitle>
                    </div>
                    <CardDescription>
                        Enter your new password below. Make sure it's at least 8 characters long.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {state.success ? (
                        <div className="space-y-4">
                            <Alert className="bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-800">
                                <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-400" />
                                <AlertDescription className="text-green-800 dark:text-green-200">
                                    Password reset successful! Redirecting to login...
                                </AlertDescription>
                            </Alert>
                        </div>
                    ) : (
                        <form action={formAction} className="space-y-4">
                            {state.error && (
                                <Alert variant="destructive">
                                    <AlertDescription>{state.error}</AlertDescription>
                                </Alert>
                            )}

                            <input type="hidden" name="token" value={token || ""} />

                            <div className="space-y-2">
                                <Label htmlFor="password">New Password</Label>
                                <Input
                                    id="password"
                                    name="password"
                                    type="password"
                                    placeholder="Enter new password"
                                    required
                                    minLength={8}
                                    disabled={isPending}
                                    className="bg-background"
                                />
                                <p className="text-xs text-muted-foreground">
                                    Must be at least 8 characters long
                                </p>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="confirmPassword">Confirm Password</Label>
                                <Input
                                    id="confirmPassword"
                                    name="confirmPassword"
                                    type="password"
                                    placeholder="Confirm new password"
                                    required
                                    minLength={8}
                                    disabled={isPending}
                                    className="bg-background"
                                />
                            </div>

                            <Button
                                type="submit"
                                className="w-full gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                                disabled={isPending}
                            >
                                {isPending ? (
                                    <>
                                        <div className="h-4 w-4 animate-spin rounded-full border-2 border-background border-t-transparent" />
                                        Resetting Password...
                                    </>
                                ) : (
                                    <>
                                        <Lock className="h-4 w-4" />
                                        Reset Password
                                    </>
                                )}
                            </Button>

                            <div className="text-center">
                                <Link
                                    href="/auth/login"
                                    className="text-sm text-muted-foreground hover:text-primary"
                                >
                                    Back to Login
                                </Link>
                            </div>
                        </form>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
