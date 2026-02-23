"use client";

import { useEffect, useState, Suspense } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { CheckCircle2, Circle, Plane, FileText, HeartPulse, Loader2 } from "lucide-react";
import { useAuth } from "@/components/providers/AuthProvider";
import { collection, query, where, getDocs, updateDoc, doc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { db, storage } from "@/lib/firebase/config";
import { useSearchParams, useRouter } from "next/navigation";

function DashboardContent() {
    const { user, loading } = useAuth();
    const searchParams = useSearchParams();
    const [applications, setApplications] = useState<any[]>([]);
    const [isLoadingApps, setIsLoadingApps] = useState(true);
    const [uploadingTask, setUploadingTask] = useState<number | null>(null);

    const isSuccess = searchParams.get("application") === "success";

    useEffect(() => {
        async function fetchApplications() {
            if (!user) {
                setIsLoadingApps(false);
                return;
            }

            try {
                const q = query(collection(db, "applications"), where("userId", "==", user.uid));
                const querySnapshot = await getDocs(q);
                let apps = querySnapshot.docs.map(d => ({ id: d.id, ...d.data() }));
                // Sort to get the most recent active application
                apps.sort((a: any, b: any) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());
                setApplications(apps);
            } catch (err) {
                console.error("Failed to fetch applications:", err);
            } finally {
                setIsLoadingApps(false);
            }
        }

        if (!loading) {
            fetchApplications();
        }
    }, [user, loading]);

    const activeApp = applications.length > 0 ? applications[0] : null;

    const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>, taskId: number, taskKey: string) => {
        const file = event.target.files?.[0];
        if (!file || !activeApp || !user) return;

        setUploadingTask(taskId);
        try {
            const fileRef = ref(storage, `applications/${activeApp.id}/${taskKey}_${file.name}`);
            await uploadBytes(fileRef, file);
            const url = await getDownloadURL(fileRef);

            const updatedDocs = { ...(activeApp.documents || {}), [taskKey]: url };
            await updateDoc(doc(db, "applications", activeApp.id), { documents: updatedDocs });

            // Optimistic update
            setApplications(prev => prev.map(app =>
                app.id === activeApp.id ? { ...app, documents: updatedDocs } : app
            ));
        } catch (error) {
            console.error("Upload failed", error);
            alert("File upload failed. Please try again.");
        } finally {
            setUploadingTask(null);
        }
    };

    const documents = activeApp?.documents || {};

    const tasks = [
        { id: 1, key: "payment", title: "Pay Remaining Balance", status: activeApp?.paymentStatus === 'paid' ? "completed" : "pending", action: 'link', icon: <FileText className="w-4 h-4" /> },
        { id: 2, key: "passport", title: "Upload Passport Copy", status: documents.passport ? "completed" : "pending", action: 'upload', icon: <FileText className="w-4 h-4" /> },
        { id: 3, key: "flight", title: "Submit Arrival Flight Details", status: documents.flight ? "completed" : "pending", action: 'upload', icon: <Plane className="w-4 h-4" /> },
        { id: 4, key: "insurance", title: "Provide Travel Insurance Policy", status: documents.insurance ? "completed" : "pending", action: 'upload', icon: <HeartPulse className="w-4 h-4" /> },
    ];

    const router = useRouter();

    useEffect(() => {
        if (!loading && !user) {
            router.push("/login");
        }
    }, [user, loading, router]);

    if (loading || isLoadingApps) {
        return <div className="p-12 text-center text-muted-foreground">Loading dashboard...</div>;
    }

    if (!user) {
        return null; // Will redirect in useEffect
    }

    return (
        <div className="container mx-auto px-4 py-8 max-w-5xl">
            {isSuccess && (
                <div className="mb-8 p-4 bg-green-50 border border-green-200 text-green-800 rounded-lg flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5" />
                    <span className="font-medium">Application submitted successfully! Our team will review it shortly.</span>
                </div>
            )}

            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Welcome back, {user.displayName || user.email?.split('@')[0]}</h1>
                    <p className="text-muted-foreground mt-1">Here's the status of your volunteer journey.</p>
                </div>
                <Button variant="outline" asChild>
                    <Link href="/programs">Find Another Program</Link>
                </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                {/* Main Status Column */}
                <div className="md:col-span-2 space-y-6">
                    {activeApp ? (
                        <Card className="bg-primary/5 border-primary/20">
                            <CardHeader className="pb-4">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <CardDescription className="font-semibold text-primary uppercase tracking-wider mb-1">Active Application</CardDescription>
                                        <CardTitle className="text-2xl capitalize">{activeApp.programId.replace(/-/g, ' ')}</CardTitle>
                                    </div>
                                    <div className="bg-primary text-primary-foreground px-3 py-1 rounded-full text-sm font-semibold capitalize">
                                        {activeApp.status.replace(/_/g, ' ')}
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="grid sm:grid-cols-2 gap-4 text-sm mt-2">
                                    <div>
                                        <span className="text-muted-foreground block mb-1">Target Start Date</span>
                                        <span className="font-medium">{activeApp.targetStartDate || "TBD"}</span>
                                    </div>
                                    <div>
                                        <span className="text-muted-foreground block mb-1">Duration</span>
                                        <span className="font-medium">{activeApp.durationWeeks} Weeks</span>
                                    </div>
                                    <div>
                                        <span className="text-muted-foreground block mb-1">Payment Status</span>
                                        <span className="font-medium capitalize text-orange-600">● {activeApp.paymentStatus.replace(/_/g, ' ')}</span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ) : (
                        <Card>
                            <CardContent className="flex flex-col items-center justify-center p-12 text-center">
                                <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
                                    <Plane className="w-8 h-8 text-muted-foreground opacity-50" />
                                </div>
                                <h3 className="text-xl font-bold mb-2">No active applications</h3>
                                <p className="text-muted-foreground mb-6">You haven't applied to any programs yet. Find your perfect volunteer opportunity today!</p>
                                <Button asChild size="lg">
                                    <Link href="/programs">Browse Programs</Link>
                                </Button>
                            </CardContent>
                        </Card>
                    )}

                    {activeApp && (
                        <Card>
                            <CardHeader>
                                <CardTitle>Preparation Checklist</CardTitle>
                                <CardDescription>Complete these mandatory steps before your arrival.</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    {tasks.map(task => (
                                        <div key={task.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors gap-3">
                                            <div className="flex items-start sm:items-center gap-3 break-words">
                                                <div className="mt-1 sm:mt-0 shrink-0">
                                                    {task.status === 'completed' ? (
                                                        <CheckCircle2 className="w-5 h-5 text-green-500" />
                                                    ) : (
                                                        <Circle className="w-5 h-5 text-muted-foreground" />
                                                    )}
                                                </div>
                                                <div className="flex items-center gap-2 flex-wrap">
                                                    <span className="text-muted-foreground p-1 bg-muted rounded shrink-0">{task.icon}</span>
                                                    <span className={task.status === 'completed' ? 'line-through text-muted-foreground' : 'font-medium'}>
                                                        {task.title}
                                                    </span>
                                                </div>
                                            </div>

                                            {task.status === 'completed' ? (
                                                <Button variant="ghost" size="sm" className="hidden sm:invisible">Update</Button>
                                            ) : task.action === 'upload' ? (
                                                <div className="self-end sm:self-auto relative">
                                                    <Input
                                                        type="file"
                                                        className="absolute inset-0 opacity-0 cursor-pointer w-full h-full z-10"
                                                        disabled={uploadingTask === task.id}
                                                        onChange={(e) => handleFileUpload(e, task.id, task.key)}
                                                    />
                                                    <Button variant="outline" size="sm" disabled={uploadingTask === task.id}>
                                                        {uploadingTask === task.id ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Uploading</> : "Upload File"}
                                                    </Button>
                                                </div>
                                            ) : (
                                                <Button variant="outline" size="sm" className="self-end sm:self-auto">
                                                    Complete Task
                                                </Button>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    )}
                </div>

                {/* Sidebar Actions */}
                <div className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Quick Actions</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <Button variant="outline" className="w-full justify-start">Edit Profile</Button>
                            <Button variant="outline" className="w-full justify-start">Payment History</Button>
                            <Button variant="outline" className="w-full justify-start">Emergency Contacts</Button>
                            <Button variant="outline" className="w-full justify-start">Contact Support</Button>
                        </CardContent>
                    </Card>

                    <Card className="bg-slate-50 border-slate-200">
                        <CardHeader>
                            <CardTitle className="text-lg">Need Help?</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-muted-foreground mb-4">
                                Our local support team is here to assist you with your preparations.
                            </p>
                            <Button className="w-full">Message Coordinator</Button>
                        </CardContent>
                    </Card>
                </div>

            </div>
        </div>
    );
}

export default function DashboardPage() {
    return (
        <Suspense fallback={<div className="p-12 text-center text-muted-foreground">Loading dashboard...</div>}>
            <DashboardContent />
        </Suspense>
    );
}
