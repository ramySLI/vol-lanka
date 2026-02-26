// @ts-nocheck
"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/components/providers/AuthProvider";
import { useRouter, useParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "@/lib/firebase/config";
import { Loader2, ArrowLeft, Plus, Trash2 } from "lucide-react";
import Link from "next/link";
import { ImageUploader } from "@/components/shared/ImageUploader";

export default function ProgramEditorPage() {
    const { user, isAdmin, loading } = useAuth();
    const router = useRouter();
    const params = useParams();
    const isNew = params.id === "new";
    const [isSaving, setIsSaving] = useState(false);
    const [isLoading, setIsLoading] = useState(!isNew);

    const [prog, setProg] = useState<any>({
        id: "",
        slug: "",
        title: "",
        category: "conservation",
        pricing: { amount: 200, currency: "USD" },
        durationOptions: [1, 2, 3, 4],
        descriptions: { short: "", full: [""] },
        schedule: { workingDays: "Mon-Fri", workingHours: "9am - 3pm", freeTime: "Weekends" },
        included: [""],
        notIncluded: [""],
        requirements: [""],
        accommodation: { type: "Volunteer House", meals: "3 meals/day", descriptions: [""] },
        images: [""],
        rating: 5,
        reviewCount: 0,
        maxParticipants: 10,
        status: "active",
        featured: false,
    });

    useEffect(() => {
        if (!loading && (!user || !isAdmin)) {
            router.push("/dashboard");
        }
    }, [user, loading, isAdmin, router]);

    useEffect(() => {
        if (isNew || !isAdmin) return;

        async function fetchProgram() {
            try {
                const docRef = doc(db, "programs", params.id as string);
                const docSnap = await getDoc(docRef);
                if (docSnap.exists()) {
                    setProg({ id: docSnap.id, ...docSnap.data() });
                } else {
                    alert("Program not found!");
                    router.push("/admin/programs");
                }
            } catch (error) {
                console.error("Failed to load program", error);
            } finally {
                setIsLoading(false);
            }
        }
        fetchProgram();
    }, [isNew, isAdmin, params.id, router]);

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!isAdmin) return;
        setIsSaving(true);

        const docId = isNew ? prog.slug || prog.title.toLowerCase().replace(/[^a-z0-9]+/g, '-') : prog.id;

        const payload = { ...prog, id: docId, updatedAt: new Date().toISOString() };
        if (isNew) {
            payload.createdAt = new Date().toISOString();
        }

        try {
            await setDoc(doc(db, "programs", docId), payload);

            // Revalidate public cache
            await fetch("/api/revalidate?secret=super_secret_revalidate_token_123", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ tag: "programs" })
            });

            alert("Saved and revalidated successfully!");
            router.push("/admin/programs");
        } catch (error) {
            console.error("Error saving program:", error);
            alert("Failed to save program.");
        } finally {
            setIsSaving(false);
        }
    };

    // Arrays Helper Functions
    const handleArrayChange = (fieldAccess: (d: any) => any[], value: string, index: number, pathParts: string[]) => {
        setProg((p: any) => {
            const clone = JSON.parse(JSON.stringify(p));
            let curr = clone;
            for (let i = 0; i < pathParts.length - 1; i++) {
                if (!curr[pathParts[i]]) curr[pathParts[i]] = {};
                curr = curr[pathParts[i]];
            }
            const arrName = pathParts[pathParts.length - 1];
            if (!Array.isArray(curr[arrName])) curr[arrName] = [];
            curr[arrName][index] = value;
            return clone;
        });
    };

    const handleArrayOperate = (pathParts: string[], action: "add" | "remove", index?: number) => {
        setProg((p: any) => {
            const clone = JSON.parse(JSON.stringify(p));
            let curr = clone;
            for (let i = 0; i < pathParts.length - 1; i++) {
                if (!curr[pathParts[i]]) curr[pathParts[i]] = {};
                curr = curr[pathParts[i]];
            }
            const arrName = pathParts[pathParts.length - 1];
            if (!Array.isArray(curr[arrName])) curr[arrName] = [];

            if (action === "add") {
                curr[arrName].push("");
            } else if (action === "remove" && index !== undefined) {
                curr[arrName].splice(index, 1);
            }
            return clone;
        });
    };

    if (loading || isLoading || !isAdmin) return <div className="p-12 text-center text-muted-foreground">Loading Editor...</div>;

    return (
        <div className="p-8 w-full max-w-5xl">
            <div className="mb-8 flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">{isNew ? "Create Program" : "Edit Program"}</h1>
                    <p className="text-muted-foreground mt-1">{prog.title || 'New Program'}</p>
                </div>
                <Button variant="outline" asChild>
                    <Link href="/admin/programs"><ArrowLeft className="w-4 h-4 mr-2" /> Back</Link>
                </Button>
            </div>

            <form onSubmit={handleSave} className="space-y-8">
                {/* Core Details */}
                <Card>
                    <CardHeader><CardTitle>Core Details</CardTitle></CardHeader>
                    <CardContent className="grid grid-cols-2 gap-4">
                        <div className="space-y-2 col-span-2 md:col-span-1">
                            <Label>Title</Label>
                            <Input value={prog.title} onChange={e => setProg({ ...prog, title: e.target.value })} required />
                        </div>
                        <div className="space-y-2 col-span-2 md:col-span-1">
                            <Label>Slug (URL) - E.g. sea-turtle-conservation</Label>
                            <Input value={prog.slug} onChange={e => setProg({ ...prog, slug: e.target.value })} required disabled={!isNew} />
                        </div>
                        <div className="space-y-2 col-span-2 md:col-span-1">
                            <Label>Category</Label>
                            <Select value={prog.category} onValueChange={v => setProg({ ...prog, category: v })}>
                                <SelectTrigger><SelectValue /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="conservation">Conservation</SelectItem>
                                    <SelectItem value="teaching">Teaching</SelectItem>
                                    <SelectItem value="community">Community</SelectItem>
                                    <SelectItem value="medical">Medical</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2 col-span-2 md:col-span-1">
                            <Label>Status</Label>
                            <Select value={prog.status} onValueChange={v => setProg({ ...prog, status: v })}>
                                <SelectTrigger><SelectValue /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="active">Active</SelectItem>
                                    <SelectItem value="inactive">Inactive</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="flex items-center space-x-2 pt-4 col-span-2">
                            <Checkbox id="featured" checked={prog.featured} onCheckedChange={(checked) => setProg({ ...prog, featured: !!checked })} />
                            <Label htmlFor="featured" className="font-medium cursor-pointer">Feature this program on the homepage?</Label>
                        </div>
                    </CardContent>
                </Card>

                {/* Primary Image */}
                <Card>
                    <CardHeader><CardTitle>Primary Hero Image</CardTitle></CardHeader>
                    <CardContent>
                        <ImageUploader
                            label="Program Image (This appears on grid and hero)"
                            value={prog.images?.[0] || ""}
                            onChange={(url) => setProg({ ...prog, images: [url] })}
                            folder={`images/programs/${prog.slug || 'temp'}`}
                        />
                    </CardContent>
                </Card>

                {/* Descriptions */}
                <Card>
                    <CardHeader><CardTitle>Descriptions</CardTitle></CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label>Short Description (Grid View)</Label>
                            <Textarea value={prog?.descriptions?.short || ""} onChange={e => setProg({ ...prog, descriptions: { ...(prog?.descriptions || {}), short: e.target.value } })} required />
                        </div>
                        <div className="space-y-2">
                            <Label>Long Description Paragraphs</Label>
                            {(Array.isArray(prog?.descriptions?.full) ? prog.descriptions.full : [""]).map((p: string, i: number) => (
                                <div key={i} className="flex gap-2">
                                    <Textarea value={p} onChange={e => handleArrayChange(d => d.descriptions.full, e.target.value, i, ['descriptions', 'full'])} />
                                    <Button type="button" variant="ghost" size="icon" onClick={() => handleArrayOperate(['descriptions', 'full'], 'remove', i)}>
                                        <Trash2 className="w-4 h-4 text-destructive" />
                                    </Button>
                                </div>
                            ))}
                            <Button type="button" variant="outline" size="sm" onClick={() => handleArrayOperate(['descriptions', 'full'], 'add')}>
                                <Plus className="w-4 h-4 mr-2" /> Add Paragraph
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                {/* Bullet Points */}
                <Card>
                    <CardHeader><CardTitle>Bullet Points</CardTitle></CardHeader>
                    <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {['included', 'notIncluded', 'requirements'].map((key) => (
                            <div key={key} className="space-y-2">
                                <Label className="capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</Label>
                                {(Array.isArray(prog[key]) ? prog[key] : []).map((item: string, i: number) => (
                                    <div key={i} className="flex items-center gap-2">
                                        <Input value={item} onChange={e => handleArrayChange(d => d[key], e.target.value, i, [key])} />
                                        <Button type="button" variant="ghost" size="icon" onClick={() => handleArrayOperate([key], 'remove', i)}>
                                            <Trash2 className="w-4 h-4 text-destructive" />
                                        </Button>
                                    </div>
                                ))}
                                <Button type="button" variant="outline" size="sm" onClick={() => handleArrayOperate([key], 'add')}>
                                    <Plus className="w-4 h-4 mr-2" /> Add {key.replace(/([A-Z])/g, ' $1').trim()}
                                </Button>
                            </div>
                        ))}
                    </CardContent>
                </Card>

                <div className="flex justify-end gap-4 pb-12">
                    <Button type="button" variant="outline" onClick={() => router.push("/admin/programs")}>Cancel</Button>
                    <Button type="submit" disabled={isSaving}>
                        {isSaving ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Saving...</> : "Save Program"}
                    </Button>
                </div>
            </form>
        </div>
    );
}
