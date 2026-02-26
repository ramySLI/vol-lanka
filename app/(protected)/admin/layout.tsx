"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Users, FileText, Settings, BookOpen } from "lucide-react";
import { useAuth } from "@/components/providers/AuthProvider";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const { isAdmin, loading } = useAuth();

    if (loading || !isAdmin) return <>{children}</>;

    const navigation = [
        { name: "Applications", href: "/admin", icon: Users },
        { name: "Programs", href: "/admin/programs", icon: BookOpen },
        { name: "Site Content", href: "/admin/content", icon: FileText },
        { name: "Settings", href: "/admin/settings", icon: Settings },
    ];

    return (
        <div className="flex min-h-screen bg-muted/20">
            {/* Sidebar */}
            <aside className="hidden md:flex flex-col w-64 border-r bg-background pt-8 pb-4">
                <div className="px-6 mb-8">
                    <h2 className="text-xl font-bold text-primary">Admin Panel</h2>
                    <p className="text-xs text-muted-foreground mt-1">Manage VolunteerLanka</p>
                </div>
                <nav className="flex-1 space-y-2 px-4">
                    {navigation.map((item) => {
                        const Icon = item.icon;
                        const isActive = pathname === item.href;
                        return (
                            <Link
                                key={item.name}
                                href={item.href}
                                className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${isActive
                                        ? "bg-primary/10 text-primary"
                                        : "text-muted-foreground hover:bg-muted hover:text-foreground"
                                    }`}
                            >
                                <Icon className="w-5 h-5" />
                                {item.name}
                            </Link>
                        );
                    })}
                </nav>
            </aside>

            {/* Main Content Area */}
            <main className="flex-1">
                {children}
            </main>
        </div>
    );
}
