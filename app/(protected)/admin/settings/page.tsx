"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/components/providers/AuthProvider";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "@/lib/firebase/config";
import { Loader2, Plus, Trash2 } from "lucide-react";

export default function SettingsAdminPage() {
    const { user, isAdmin, loading } = useAuth();
    const router = useRouter();
    const [isSaving, setIsSaving] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    const [settings, setSettings] = useState<any>({
        footerDescription: "",
        contactEmail: "",
        contactPhone: "",
        socialLinks: {
            facebook: "",
            instagram: ""
        },
        navigationMenu: {
            discover: [],
            support: [],
            legal: []
        }
    });

    useEffect(() => {
        if (!loading && (!user || !isAdmin)) {
            router.push("/dashboard");
        }
    }, [user, loading, isAdmin, router]);

    useEffect(() => {
        async function fetchSettings() {
            try {
                const docRef = doc(db, "settings", "global");
                const docSnap = await getDoc(docRef);
                if (docSnap.exists()) {
                    setSettings((p: any) => ({ ...p, ...docSnap.data() }));
                }
            } catch (error) {
                console.error("Error fetching settings:", error);
            } finally {
                setIsLoading(false);
            }
        }
        if (isAdmin) {
            fetchSettings();
        }
    }, [isAdmin]);

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!isAdmin) return;
        setIsSaving(true);

        try {
            await setDoc(doc(db, "settings", "global"), settings, { merge: true });

            await fetch("/api/revalidate?secret=super_secret_revalidate_token_123", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ tag: "settings" })
            });

            alert("Settings updated and cache cleared successfully!");
        } catch (error) {
            console.error("Save failed:", error);
            alert("Error saving data. See console.");
        } finally {
            setIsSaving(false);
        }
    };

    if (loading || isLoading || !isAdmin) return <div className="p-12 text-center text-muted-foreground">Loading...</div>;

    return (
        <div className="container mx-auto px-4 py-8 max-w-4xl">
            <div className="mb-8">
                <h1 className="text-3xl font-bold tracking-tight">Global Settings</h1>
                <p className="text-muted-foreground mt-1">Manage global platform configurations and contact info.</p>
            </div>

            <Card className="mb-8">
                <CardHeader>
                    <CardTitle>Site Information</CardTitle>
                    <CardDescription>Details that appear in the footer and contact sections.</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSave} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="footerDescription">Footer Description</Label>
                            <Input
                                id="footerDescription"
                                value={settings?.footerDescription || ""}
                                onChange={e => setSettings((p: any) => ({ ...p, footerDescription: e.target.value }))}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Contact Email</Label>
                            <Input
                                type="email"
                                value={settings?.contactEmail || ""}
                                onChange={e => setSettings((p: any) => ({ ...p, contactEmail: e.target.value }))}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Contact Phone</Label>
                            <Input
                                value={settings?.contactPhone || ""}
                                onChange={e => setSettings((p: any) => ({ ...p, contactPhone: e.target.value }))}
                            />
                        </div>

                        <div className="pt-4 border-t mt-6">
                            <h3 className="font-medium mb-4">Social Links</h3>
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <Label>Facebook URL</Label>
                                    <Input
                                        value={settings?.socialLinks?.facebook || ""}
                                        onChange={e => setSettings((p: any) => ({ ...p, socialLinks: { ...p.socialLinks, facebook: e.target.value } }))}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>Instagram URL</Label>
                                    <Input
                                        value={settings?.socialLinks?.instagram || ""}
                                        onChange={e => setSettings((p: any) => ({ ...p, socialLinks: { ...p.socialLinks, instagram: e.target.value } }))}
                                    />
                                </div>
                            </div>
                        </div>

                        <Button type="submit" disabled={isSaving} className="mt-6">
                            {isSaving ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Saving...</> : "Save Settings"}
                        </Button>
                    </form>
                </CardContent>
            </Card>

            <Card className="mb-8">
                <CardHeader>
                    <CardTitle>Navigation Menus</CardTitle>
                    <CardDescription>Manage the links that appear in the header and footer.</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSave} className="space-y-8">
                        {['discover', 'support', 'legal'].map((menuKey) => (
                            <div key={menuKey} className="space-y-4">
                                <h3 className="text-lg font-bold capitalize">{menuKey} Links</h3>
                                {(Array.isArray(settings?.navigationMenu?.[menuKey]) ? settings.navigationMenu[menuKey] : []).map((link: any, i: number) => (
                                    <div key={i} className="flex items-center gap-2">
                                        <div className="flex-1 grid grid-cols-2 gap-4">
                                            <Input
                                                placeholder="Label (e.g. Programs)"
                                                value={link?.label || ""}
                                                onChange={e => {
                                                    const newArr = [...(settings.navigationMenu?.[menuKey] || [])];
                                                    newArr[i] = { ...newArr[i], label: e.target.value };
                                                    setSettings((p: any) => ({ ...p, navigationMenu: { ...(p.navigationMenu || {}), [menuKey]: newArr } }));
                                                }}
                                            />
                                            <Input
                                                placeholder="URL (e.g. /programs)"
                                                value={link?.href || ""}
                                                onChange={e => {
                                                    const newArr = [...(settings.navigationMenu?.[menuKey] || [])];
                                                    newArr[i] = { ...newArr[i], href: e.target.value };
                                                    setSettings((p: any) => ({ ...p, navigationMenu: { ...(p.navigationMenu || {}), [menuKey]: newArr } }));
                                                }}
                                            />
                                        </div>
                                        <Button type="button" variant="ghost" size="icon" onClick={() => {
                                            const newArr = [...(settings.navigationMenu?.[menuKey] || [])];
                                            newArr.splice(i, 1);
                                            setSettings((p: any) => ({ ...p, navigationMenu: { ...(p.navigationMenu || {}), [menuKey]: newArr } }));
                                        }}>
                                            <Trash2 className="w-4 h-4 text-destructive" />
                                        </Button>
                                    </div>
                                ))}
                                <Button type="button" variant="outline" size="sm" onClick={() => {
                                    const newArr = [...(settings.navigationMenu?.[menuKey] || []), { label: "", href: "" }];
                                    setSettings((p: any) => ({ ...p, navigationMenu: { ...(p.navigationMenu || {}), [menuKey]: newArr } }));
                                }}>
                                    <Plus className="w-4 h-4 mr-2" /> Add Link
                                </Button>
                            </div>
                        ))}
                        <Button type="submit" disabled={isSaving} className="mt-6">
                            {isSaving ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Saving...</> : "Save Settings"}
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
