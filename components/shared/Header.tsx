"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { useAuth } from "@/components/providers/AuthProvider";

export function Header() {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const { user, signOut } = useAuth();

    return (
        <header className="border-b bg-background sticky top-0 z-50 p-4">
            <div className="container mx-auto flex items-center justify-between">
                <Link href="/" className="text-xl font-bold text-primary">
                    VolunteerLanka
                </Link>

                {/* Desktop Nav */}
                <nav className="hidden md:flex items-center space-x-6">
                    <Link href="/programs" className="text-sm font-medium hover:text-primary transition-colors">
                        Our Programs
                    </Link>
                    <Link href="/how-it-works" className="text-sm font-medium hover:text-primary transition-colors">
                        How It Works
                    </Link>
                    <Link href="/about" className="text-sm font-medium hover:text-primary transition-colors">
                        About Us
                    </Link>
                    <Link href="/faq" className="text-sm font-medium hover:text-primary transition-colors">
                        FAQ
                    </Link>
                </nav>

                {/* Desktop Actions */}
                <div className="hidden md:flex items-center space-x-4">
                    {user ? (
                        <>
                            {user.uid === 'VgDjrSqImwQcX4TBKUtH1gu8vbQ2' && (
                                <Button variant="ghost" className="text-primary font-bold" asChild>
                                    <Link href="/admin">Admin Panel</Link>
                                </Button>
                            )}
                            <Button variant="ghost" asChild>
                                <Link href="/dashboard">Dashboard</Link>
                            </Button>
                            <Button variant="outline" onClick={() => signOut()}>
                                Logout
                            </Button>
                        </>
                    ) : (
                        <>
                            <Button variant="ghost" asChild>
                                <Link href="/login">Log in</Link>
                            </Button>
                            <Button asChild>
                                <Link href="/programs">Apply Now</Link>
                            </Button>
                        </>
                    )}
                </div>

                {/* Mobile Menu Toggle */}
                <button
                    className="md:hidden p-2 text-foreground"
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    aria-label="Toggle Menu"
                >
                    {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                </button>
            </div>

            {/* Mobile Nav Dropdown */}
            {isMobileMenuOpen && (
                <div className="md:hidden absolute top-full left-0 w-full bg-background border-b shadow-lg py-4 px-4 flex flex-col space-y-4 z-40">
                    <Link href="/programs" className="text-sm font-medium hover:text-primary transition-colors" onClick={() => setIsMobileMenuOpen(false)}>
                        Our Programs
                    </Link>
                    <Link href="/how-it-works" className="text-sm font-medium hover:text-primary transition-colors" onClick={() => setIsMobileMenuOpen(false)}>
                        How It Works
                    </Link>
                    <Link href="/about" className="text-sm font-medium hover:text-primary transition-colors" onClick={() => setIsMobileMenuOpen(false)}>
                        About Us
                    </Link>
                    <Link href="/faq" className="text-sm font-medium hover:text-primary transition-colors" onClick={() => setIsMobileMenuOpen(false)}>
                        FAQ
                    </Link>
                    <div className="h-px bg-muted my-2 w-full" />
                    {user ? (
                        <>
                            {user.uid === 'VgDjrSqImwQcX4TBKUtH1gu8vbQ2' && (
                                <Button variant="ghost" className="justify-start w-full text-primary font-bold" asChild>
                                    <Link href="/admin" onClick={() => setIsMobileMenuOpen(false)}>Admin Panel</Link>
                                </Button>
                            )}
                            <Button variant="ghost" asChild className="justify-start w-full">
                                <Link href="/dashboard" onClick={() => setIsMobileMenuOpen(false)}>Dashboard</Link>
                            </Button>
                            <Button variant="outline" className="w-full" onClick={() => { signOut(); setIsMobileMenuOpen(false); }}>
                                Logout
                            </Button>
                        </>
                    ) : (
                        <>
                            <Button variant="ghost" asChild className="justify-start w-full">
                                <Link href="/login" onClick={() => setIsMobileMenuOpen(false)}>Log in</Link>
                            </Button>
                            <Button asChild className="w-full">
                                <Link href="/programs" onClick={() => setIsMobileMenuOpen(false)}>Apply Now</Link>
                            </Button>
                        </>
                    )}
                </div>
            )}
        </header>
    );
}
