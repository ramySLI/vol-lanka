"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/components/providers/AuthProvider";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";
import { db } from "@/lib/firebase/config";
import Link from "next/link";
import { Edit, Plus, Trash2 } from "lucide-react";

export default function ProgramsAdminPage() {
    const { user, isAdmin, loading } = useAuth();
    const router = useRouter();
    const [programs, setPrograms] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (!loading && (!user || !isAdmin)) {
            router.push("/dashboard");
        }
    }, [user, loading, isAdmin, router]);

    useEffect(() => {
        async function fetchPrograms() {
            try {
                const querySnapshot = await getDocs(collection(db, "programs"));
                const progs = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                setPrograms(progs);
            } catch (err) {
                console.error("Failed to fetch programs:", err);
            } finally {
                setIsLoading(false);
            }
        }
        if (isAdmin) {
            fetchPrograms();
        }
    }, [isAdmin]);

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this program?")) return;

        try {
            await deleteDoc(doc(db, "programs", id));
            setPrograms(prev => prev.filter(p => p.id !== id));

            // Revalidate public cache
            await fetch("/api/revalidate?secret=super_secret_revalidate_token_123", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ tag: "programs" })
            });
        } catch (error) {
            console.error("Error deleting program:", error);
            alert("Failed to delete program.");
        }
    };

    if (loading || isLoading || !isAdmin) return <div className="p-12 text-center text-muted-foreground">Loading...</div>;

    return (
        <div className="p-8 w-full max-w-5xl">
            <div className="mb-8 flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Programs</h1>
                    <p className="text-muted-foreground mt-1">Manage your volunteering opportunities.</p>
                </div>
                <Button asChild>
                    <Link href="/admin/programs/new">
                        <Plus className="w-4 h-4 mr-2" />
                        Create Program
                    </Link>
                </Button>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>All Programs</CardTitle>
                    <CardDescription>A list of all active and inactive programs visible on the site.</CardDescription>
                </CardHeader>
                <CardContent>
                    {programs.length === 0 ? (
                        <div className="p-8 text-center text-muted-foreground">No programs found.</div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm text-left border-collapse">
                                <thead className="text-xs text-muted-foreground uppercase bg-muted/50 border-b">
                                    <tr>
                                        <th className="px-4 py-3 font-medium">Program Title</th>
                                        <th className="px-4 py-3 font-medium">Category</th>
                                        <th className="px-4 py-3 font-medium">Status</th>
                                        <th className="px-4 py-3 font-medium text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {programs.map((prog) => (
                                        <tr key={prog.id} className="border-b hover:bg-muted/20 transition-colors">
                                            <td className="px-4 py-3 font-medium">
                                                {prog.title}
                                                {prog.featured && <span className="ml-2 px-2 py-0.5 text-[10px] bg-primary/10 text-primary rounded-full uppercase font-bold text-center">Featured</span>}
                                            </td>
                                            <td className="px-4 py-3 capitalize">{prog.category}</td>
                                            <td className="px-4 py-3">
                                                <span className={`px-2 py-1 rounded-full text-xs font-semibold capitalize ${prog.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                                                    {prog.status}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3 text-right space-x-2">
                                                <Button variant="ghost" size="icon" asChild>
                                                    <Link href={`/admin/programs/${prog.id}`}>
                                                        <Edit className="w-4 h-4 text-primary" />
                                                    </Link>
                                                </Button>
                                                <Button variant="ghost" size="icon" onClick={() => handleDelete(prog.id)}>
                                                    <Trash2 className="w-4 h-4 text-destructive" />
                                                </Button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
