"use client";

import { useActionState } from "react";
import { requestPasswordReset } from "@/actions/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ArrowLeft, Mail, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

export default function ForgotPasswordPage() {
    const [state, formAction, isPending] = useActionState(requestPasswordReset, {});

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 p-4">
            <Card className="w-full max-w-md shadow-2xl border-2">
                <CardHeader className="space-y-1">
                    <div className="flex items-center gap-2 mb-2">
                        <div className="p-2 bg-blue-500/10 rounded-lg">
                            <Mail className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                        </div>
                        <CardTitle className="text-2xl font-bold">Forgot Password</CardTitle>
                    </div>
                    <CardDescription>
                        Enter your email address and we'll send you a link to reset your password.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {state.success ? (
                        <div className="space-y-4">
                            <Alert className="bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-800">
                                <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-400" />
                                <AlertDescription className="text-green-800 dark:text-green-200">
                                    Password reset link generated successfully!
                                </AlertDescription>
                            </Alert>

                            {state.data?.resetLink && (
                                <div className="space-y-2">
                                    <Label>Reset Link</Label>
                                    <div className="flex gap-2">
                                        <Input
                                            value={state.data.resetLink}
                                            readOnly
                                            className="bg-muted font-mono text-xs"
                                        />
                                        <Button
                                            type="button"
                                            variant="outline"
                                            onClick={() => {
                                                navigator.clipboard.writeText(state.data.resetLink);
                                                toast.success("Link copied to clipboard!");
                                            }}
                                        >
                                            Copy
                                        </Button>
                                    </div>
                                    <p className="text-xs text-muted-foreground">
                                        Share this link with the user to reset their password. Link expires in 1 hour.
                                    </p>
                                </div>
                            )}

                            <Link href="/auth/login" className="block">
                                <Button variant="outline" className="w-full gap-2">
                                    <ArrowLeft className="h-4 w-4" />
                                    Back to Login
                                </Button>
                            </Link>
                        </div>
                    ) : (
                        <form action={formAction} className="space-y-4">
                            {state.error && (
                                <Alert variant="destructive">
                                    <AlertDescription>{state.error}</AlertDescription>
                                </Alert>
                            )}

                            <div className="space-y-2">
                                <Label htmlFor="email">Email Address</Label>
                                <Input
                                    id="email"
                                    name="email"
                                    type="email"
                                    placeholder="your.email@example.com"
                                    required
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
                                        Sending...
                                    </>
                                ) : (
                                    <>
                                        <Mail className="h-4 w-4" />
                                        Send Reset Link
                                    </>
                                )}
                            </Button>

                            <div className="text-center">
                                <Link
                                    href="/auth/login"
                                    className="text-sm text-muted-foreground hover:text-primary inline-flex items-center gap-1"
                                >
                                    <ArrowLeft className="h-3 w-3" />
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
