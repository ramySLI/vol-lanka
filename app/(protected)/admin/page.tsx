/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { collection, getDocs, updateDoc, doc } from "firebase/firestore";
import { db } from "@/lib/firebase/config";
import { useAuth } from "@/components/providers/AuthProvider";

import { useRouter } from "next/navigation";

export default function AdminDashboardPage() {
    const { user, isAdmin, loading } = useAuth();
    const router = useRouter();
    const [applications, setApplications] = useState<any[]>([]);
    const [isLoadingApps, setIsLoadingApps] = useState(true);

    useEffect(() => {
        if (!loading && (!user || !isAdmin)) {
            router.push("/dashboard");
        }
    }, [user, loading, isAdmin, router]);

    useEffect(() => {
        async function fetchApplications() {
            if (!user || !isAdmin) {
                setIsLoadingApps(false);
                return;
            }

            try {
                const querySnapshot = await getDocs(collection(db, "applications"));
                const apps = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as any[];
                apps.sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());
                setApplications(apps);
            } catch (err) {
                console.error("Failed to fetch applications:", err);
            } finally {
                setIsLoadingApps(false);
            }
        }

        if (!loading && isAdmin) {
            fetchApplications();
        }
    }, [user, loading, isAdmin]);

    const updateStatus = async (id: string, newStatus: string) => {
        try {
            const appRef = doc(db, "applications", id);
            await updateDoc(appRef, { status: newStatus });
            setApplications(prev => prev.map(app => app.id === id ? { ...app, status: newStatus } : app));
        } catch (error) {
            console.error("Error updating application status:", error);
            alert("Failed to update status.");
        }
    };

    if (loading || isLoadingApps) {
        return <div className="p-12 text-center text-muted-foreground">Loading admin dashboard...</div>;
    }

    if (!user || !isAdmin) {
        return null;
    }

    return (
        <div className="p-8 w-full max-w-5xl">
            <div className="mb-8">
                <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
                <p className="text-muted-foreground mt-1">Manage volunteer applications and platform data.</p>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Recent Applications</CardTitle>
                    <CardDescription>Review and approve new volunteer applications.</CardDescription>
                </CardHeader>
                <CardContent>
                    {applications.length === 0 ? (
                        <div className="p-8 text-center text-muted-foreground">
                            No applications found in the database.
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm text-left border-collapse">
                                <thead className="text-xs text-muted-foreground uppercase bg-muted/50 border-b">
                                    <tr>
                                        <th className="px-4 py-3 font-medium">Applicant</th>
                                        <th className="px-4 py-3 font-medium">Program</th>
                                        <th className="px-4 py-3 font-medium">Target Date</th>
                                        <th className="px-4 py-3 font-medium">Duration</th>
                                        <th className="px-4 py-3 font-medium">Payment</th>
                                        <th className="px-4 py-3 font-medium">Status</th>
                                        <th className="px-4 py-3 font-medium text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {applications.map((app) => (
                                        <tr key={app.id} className="border-b hover:bg-muted/20 transition-colors">
                                            <td className="px-4 py-3">
                                                <div className="font-medium">{app.personalInfo?.firstName} {app.personalInfo?.lastName}</div>
                                                <div className="text-xs text-muted-foreground">{app.personalInfo?.email}</div>
                                            </td>
                                            <td className="px-4 py-3 capitalize font-medium text-primary">
                                                {app.programId.replace(/-/g, ' ')}
                                            </td>
                                            <td className="px-4 py-3">{app.targetStartDate || 'TBD'}</td>
                                            <td className="px-4 py-3">{app.durationWeeks} Weeks</td>
                                            <td className="px-4 py-3">
                                                <span className={`px-2 py-1 rounded-full text-xs font-semibold uppercase ${app.paymentStatus === 'paid' ? 'bg-green-100 text-green-800' : 'bg-orange-100 text-orange-800'
                                                    }`}>
                                                    {app.paymentStatus.replace(/_/g, ' ')}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3">
                                                <span className={`px-2 py-1 rounded-full text-xs font-semibold uppercase ${app.status === 'approved' ? 'bg-green-100 text-green-800' :
                                                    app.status === 'rejected' ? 'bg-red-100 text-red-800' :
                                                        'bg-blue-100 text-blue-800'
                                                    }`}>
                                                    {app.status.replace(/_/g, ' ')}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3 text-right space-x-2">
                                                {app.status === 'pending_review' && (
                                                    <>
                                                        <Button variant="outline" size="sm" className="text-green-600 border-green-200 hover:bg-green-50" onClick={() => updateStatus(app.id, 'approved')}>
                                                            Approve
                                                        </Button>
                                                        <Button variant="outline" size="sm" className="text-red-600 border-red-200 hover:bg-red-50" onClick={() => updateStatus(app.id, 'rejected')}>
                                                            Reject
                                                        </Button>
                                                    </>
                                                )}
                                                <Button variant="ghost" size="sm">Details</Button>
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
