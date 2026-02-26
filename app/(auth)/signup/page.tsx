/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/components/providers/AuthProvider";
import { updateProfile } from "firebase/auth";
import { auth } from "@/lib/firebase/config";

export default function SignupPage() {
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const router = useRouter();
    const { signUpWithEmail, signInWithGoogle } = useAuth();

    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        if (password.length < 8) {
            setError("Password must be at least 8 characters long.");
            return;
        }

        setIsLoading(true);
        try {
            await signUpWithEmail(email, password);
            if (auth.currentUser) {
                await updateProfile(auth.currentUser, {
                    displayName: `${firstName} ${lastName}`.trim()
                });
            }
            router.push("/dashboard");
        } catch (err: any) {
            // Give user friendly error mapping
            if (err.code === 'auth/email-already-in-use') {
                setError("Email is already registered. Please log in.");
            } else {
                setError(err.message || "Failed to create account.");
            }
        } finally {
            setIsLoading(false);
        }
    };

    const handleGoogleSignup = async () => {
        setError("");
        try {
            await signInWithGoogle();
            router.push("/dashboard");
        } catch (err: any) {
            setError(err.message || "Failed to sign up with Google.");
        }
    };

    return (
        <div className="flex min-h-screen w-full items-center justify-center bg-muted/40 py-12 p-4">
            <Card className="w-full max-w-md mx-auto">
                <CardHeader className="space-y-1 text-center">
                    <CardTitle className="text-2xl font-bold">Create an account</CardTitle>
                    <CardDescription>
                        Join VolunteerLanka to start your impact journey
                    </CardDescription>
                </CardHeader>
                <form onSubmit={handleSignup}>
                    <CardContent className="space-y-4">
                        {error && (
                            <div className="p-3 bg-destructive/10 border border-destructive/20 text-destructive rounded-md text-sm">
                                {error}
                            </div>
                        )}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="first-name">First name</Label>
                                <Input
                                    id="first-name"
                                    placeholder="John"
                                    value={firstName}
                                    onChange={(e) => setFirstName(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="last-name">Last name</Label>
                                <Input
                                    id="last-name"
                                    placeholder="Doe"
                                    value={lastName}
                                    onChange={(e) => setLastName(e.target.value)}
                                    required
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="m@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="password">Password</Label>
                            <Input
                                id="password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                            <p className="text-xs text-muted-foreground">Must be at least 8 characters long.</p>
                        </div>

                        <Button className="w-full mt-2" type="submit" disabled={isLoading}>
                            {isLoading ? "Creating account..." : "Create account"}
                        </Button>

                        <div className="relative my-4">
                            <div className="absolute inset-0 flex items-center">
                                <span className="w-full border-t" />
                            </div>
                            <div className="relative flex justify-center text-xs uppercase">
                                <span className="bg-card px-2 text-muted-foreground">
                                    Or sign up with
                                </span>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <Button variant="outline" type="button" onClick={handleGoogleSignup}>
                                Google
                            </Button>
                            <Button variant="outline" type="button" disabled>
                                Facebook
                            </Button>
                        </div>
                    </CardContent>
                </form>
                <CardFooter>
                    <div className="text-center text-sm text-muted-foreground w-full">
                        Already have an account?{" "}
                        <Link href="/login" className="underline font-semibold text-primary hover:text-primary/90">
                            Log in
                        </Link>
                    </div>
                </CardFooter>
            </Card>
        </div>
    );
}
