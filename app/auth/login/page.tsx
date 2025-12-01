"use client";
import {
    Field,
    FieldGroup,
    FieldLabel,
    FieldDescription,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { authClient } from "@/lib/auth-client";
import { login as loginAction } from "@/actions/auth";
import z from "zod"
import { useRouter } from "next/navigation";
import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { FileText, Loader2, Lock, Mail } from "lucide-react";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

const formSchema = z.object({
    email: z.string().email({
        message: "Please enter a valid email address.",
    }),
    password: z.string().min(1, {
        message: "Password is required.",
    }),
});

export default function LoginPage() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    });

    async function onSubmit(values: z.infer<typeof formSchema>) {
        setIsLoading(true);

        const formData = new FormData();
        formData.append("email", values.email);
        formData.append("password", values.password);

        const result = await loginAction({} as any, formData);

        if (result.success) {
            toast.success("Logged in successfully");
            router.push("/dashboard");
            router.refresh();
        } else {
            toast.error(result.error || "Invalid email or password");
            setIsLoading(false);
        }
    }

    return (
        <div className="flex min-h-screen items-center justify-center bg-muted/30 px-4 py-12 sm:px-6 lg:px-8">
            <Card className="w-full max-w-md shadow-lg">
                <CardHeader className="space-y-1 text-center">
                    <div className="flex justify-center mb-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                            <FileText className="h-6 w-6 text-primary" />
                        </div>
                    </div>
                    <CardTitle className="text-2xl font-bold">Welcome back</CardTitle>
                    <CardDescription>
                        Sign in to your account to access documents
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <FieldGroup>
                            <Field>
                                <FieldLabel htmlFor="email">Email</FieldLabel>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        id="email"
                                        placeholder="name@finance.gov.bt"
                                        className="pl-9"
                                        {...register("email")}
                                        disabled={isLoading}
                                    />
                                </div>
                                {errors.email && (
                                    <p className="text-sm font-medium text-destructive">{errors.email.message}</p>
                                )}
                            </Field>

                            <Field>
                                <FieldLabel htmlFor="password">Password</FieldLabel>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        id="password"
                                        type="password"
                                        placeholder="••••••••"
                                        className="pl-9"
                                        {...register("password")}
                                        disabled={isLoading}
                                    />
                                </div>
                                {errors.password && (
                                    <p className="text-sm font-medium text-destructive">{errors.password.message}</p>
                                )}
                            </Field>

                            <div className="flex items-center justify-end">
                                <Link
                                    href="/auth/forgot-password"
                                    className="text-sm font-medium text-primary hover:underline"
                                >
                                    Forgot password?
                                </Link>
                            </div>

                            <Button type="submit" className="w-full" disabled={isLoading}>
                                {isLoading ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Signing in...
                                    </>
                                ) : (
                                    "Sign In"
                                )}
                            </Button>
                        </FieldGroup>
                    </form>
                </CardContent>
                <CardFooter className="flex flex-col space-y-4 text-center text-sm text-muted-foreground">
                    <div className="text-center">
                        Don&apos;t have an account?{" "}
                        <Link href="/auth/register" className="font-medium text-primary hover:underline">
                            Request access
                        </Link>
                    </div>
                </CardFooter>
            </Card>
        </div>
    );
}
