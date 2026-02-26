"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/components/providers/AuthProvider";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "@/lib/firebase/config";
import { ImageUploader } from "@/components/shared/ImageUploader";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2, Plus, Trash2 } from "lucide-react";

export default function ContentAdminPage() {
    const { user, isAdmin, loading } = useAuth();
    const router = useRouter();
    const [isSaving, setIsSaving] = useState(false);

    // Document States
    const [homeData, setHomeData] = useState<any>({});
    const [aboutData, setAboutData] = useState<any>({ paragraphs: [""] });
    const [destinationsData, setDestinationsData] = useState<any>({ locations: [] });
    const [faqData, setFaqData] = useState<any>({ faqs: [] });
    const [howItWorksData, setHowItWorksData] = useState<any>({ steps: [] });
    const [contactData, setContactData] = useState<any>({});
    const [safetyData, setSafetyData] = useState<any>({ measures: [] });
    const [termsData, setTermsData] = useState<any>({});
    const [privacyData, setPrivacyData] = useState<any>({});
    const [cancellationData, setCancellationData] = useState<any>({});

    useEffect(() => {
        if (!loading && (!user || !isAdmin)) {
            router.push("/dashboard");
        }
    }, [user, loading, isAdmin, router]);

    useEffect(() => {
        async function fetchAllContent() {
            try {
                const pages = ["home", "about", "destinations", "faq", "how-it-works", "contact", "safety", "terms", "privacy", "cancellation"];
                for (const page of pages) {
                    const docSnap = await getDoc(doc(db, "pages", page));
                    if (docSnap.exists()) {
                        const data = docSnap.data();
                        if (page === "home") setHomeData(data);
                        if (page === "about") setAboutData(data);
                        if (page === "destinations") setDestinationsData(data);
                        if (page === "faq") setFaqData(data);
                        if (page === "how-it-works") setHowItWorksData(data);
                        if (page === "contact") setContactData(data);
                        if (page === "safety") setSafetyData(data);
                        if (page === "terms") setTermsData(data);
                        if (page === "privacy") setPrivacyData(data);
                        if (page === "cancellation") setCancellationData(data);
                    }
                }
            } catch (error) {
                console.error("Error fetching content:", error);
            }
        }
        if (isAdmin) {
            fetchAllContent();
        }
    }, [isAdmin]);

    const handleSave = async (slug: string, data: any) => {
        if (!isAdmin) return;
        setIsSaving(true);
        try {
            await setDoc(doc(db, "pages", slug), data, { merge: true });
            await fetch("/api/revalidate?secret=super_secret_revalidate_token_123", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ tag: `page-${slug}` })
            });
            alert(`${slug.toUpperCase()} page content updated and cache cleared!`);
        } catch (error) {
            console.error(`Save failed for ${slug}:`, error);
            alert("Error saving data.");
        } finally {
            setIsSaving(false);
        }
    };

    if (loading || !isAdmin) return <div className="p-12 text-center text-muted-foreground">Loading...</div>;

    return (
        <div className="p-8 w-full max-w-5xl">
            <div className="mb-8 flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Site Content</h1>
                    <p className="text-muted-foreground mt-1">Manage text and images for all static pages on the site.</p>
                </div>
            </div>

            <Tabs defaultValue="home" className="w-full">
                <TabsList className="mb-8 flex flex-wrap h-auto bg-muted">
                    <TabsTrigger value="home">Home</TabsTrigger>
                    <TabsTrigger value="about">About Us</TabsTrigger>
                    <TabsTrigger value="destinations">Destinations</TabsTrigger>
                    <TabsTrigger value="faq">FAQ</TabsTrigger>
                    <TabsTrigger value="how-it-works">How It Works</TabsTrigger>
                    <TabsTrigger value="contact">Contact</TabsTrigger>
                    <TabsTrigger value="safety">Safety</TabsTrigger>
                    <TabsTrigger value="legal">Legal Docs</TabsTrigger>
                </TabsList>

                {/* HOME TAB */}
                <TabsContent value="home">
                    <Card>
                        <CardHeader>
                            <CardTitle>Homepage Hero Section</CardTitle>
                            <CardDescription>Primary greeting and hero image.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={(e) => { e.preventDefault(); handleSave("home", homeData); }} className="space-y-4">
                                <div className="space-y-2">
                                    <Label>Main Headline</Label>
                                    <Input value={homeData?.heroTitle || ""} onChange={e => setHomeData((p: any) => ({ ...p, heroTitle: e.target.value }))} required />
                                </div>
                                <div className="space-y-2">
                                    <Label>Subtitle Text</Label>
                                    <Input value={homeData?.heroSubtitle || ""} onChange={e => setHomeData((p: any) => ({ ...p, heroSubtitle: e.target.value }))} required />
                                </div>
                                <div className="space-y-4">
                                    <ImageUploader label="Hero Image Background" value={homeData?.heroImage || ""} onChange={(url) => setHomeData((p: any) => ({ ...p, heroImage: url }))} folder="images/hero" />
                                </div>
                                <div className="grid grid-cols-2 gap-4 border-t pt-4">
                                    <div className="space-y-2">
                                        <Label>Primary CTA Text</Label>
                                        <Input value={homeData?.primaryCtaText || ""} onChange={e => setHomeData((p: any) => ({ ...p, primaryCtaText: e.target.value }))} placeholder="Find a Program!" />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Primary CTA Link</Label>
                                        <Input value={homeData?.primaryCtaLink || ""} onChange={e => setHomeData((p: any) => ({ ...p, primaryCtaLink: e.target.value }))} placeholder="/programs" />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Secondary CTA Text</Label>
                                        <Input value={homeData?.secondaryCtaText || ""} onChange={e => setHomeData((p: any) => ({ ...p, secondaryCtaText: e.target.value }))} placeholder="How it Works" />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Secondary CTA Link</Label>
                                        <Input value={homeData?.secondaryCtaLink || ""} onChange={e => setHomeData((p: any) => ({ ...p, secondaryCtaLink: e.target.value }))} placeholder="/how-it-works" />
                                    </div>
                                </div>
                                <Button type="submit" disabled={isSaving}>
                                    {isSaving ? "Saving..." : "Save Homepage"}
                                </Button>
                            </form>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* ABOUT US TAB */}
                <TabsContent value="about">
                    <Card>
                        <CardHeader><CardTitle>About Us Page</CardTitle></CardHeader>
                        <CardContent>
                            <form onSubmit={(e) => { e.preventDefault(); handleSave("about", aboutData); }} className="space-y-4">
                                <div className="space-y-2">
                                    <Label>Page Title</Label>
                                    <Input value={aboutData?.title || ""} onChange={e => setAboutData((p: any) => ({ ...p, title: e.target.value }))} />
                                </div>
                                <div className="space-y-4">
                                    <ImageUploader label="Main Image" value={aboutData?.image || ""} onChange={(url) => setAboutData((p: any) => ({ ...p, image: url }))} folder="images/pages" />
                                </div>
                                <div className="space-y-2">
                                    <Label>Page Description</Label>
                                    <Textarea value={aboutData?.description || ""} onChange={e => setAboutData((p: any) => ({ ...p, description: e.target.value }))} />
                                </div>
                                <div className="space-y-4 pt-4 border-t">
                                    <h3 className="font-bold">Mission Section</h3>
                                    <div className="space-y-2">
                                        <Label>Mission Title</Label>
                                        <Input value={aboutData?.mission?.title || ""} onChange={e => setAboutData((p: any) => ({ ...p, mission: { ...p.mission, title: e.target.value } }))} />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Mission Content</Label>
                                        <Textarea value={aboutData?.mission?.content || ""} onChange={e => setAboutData((p: any) => ({ ...p, mission: { ...p.mission, content: e.target.value } }))} />
                                    </div>
                                </div>
                                <div className="space-y-4 pt-4 border-t">
                                    <h3 className="font-bold">Reasons Grid</h3>
                                    <div className="space-y-2">
                                        <Label>Reasons Title</Label>
                                        <Input value={aboutData?.reasons?.title || ""} onChange={e => setAboutData((p: any) => ({ ...p, reasons: { ...p.reasons, title: e.target.value } }))} />
                                    </div>
                                    <div className="space-y-4 pt-2">
                                        <Label>Reason Items</Label>
                                        {(Array.isArray(aboutData?.reasons?.items) ? aboutData.reasons.items : []).map((item: any, i: number) => (
                                            <div key={i} className="border p-4 rounded-md space-y-2 relative bg-muted/20">
                                                <Button type="button" variant="ghost" size="icon" className="absolute top-2 right-2" onClick={() => {
                                                    const newArr = [...(aboutData.reasons?.items || [])];
                                                    newArr.splice(i, 1);
                                                    setAboutData((p: any) => ({ ...p, reasons: { ...p.reasons, items: newArr } }));
                                                }}><Trash2 className="w-4 h-4 text-destructive" /></Button>

                                                <Label>Item Title</Label>
                                                <Input value={item?.title || ""} onChange={e => {
                                                    const newArr = [...(aboutData.reasons?.items || [])];
                                                    newArr[i] = { ...newArr[i], title: e.target.value };
                                                    setAboutData((p: any) => ({ ...p, reasons: { ...p.reasons, items: newArr } }));
                                                }} />
                                                <Label>Item Description</Label>
                                                <Textarea value={item?.description || ""} onChange={e => {
                                                    const newArr = [...(aboutData.reasons?.items || [])];
                                                    newArr[i] = { ...newArr[i], description: e.target.value };
                                                    setAboutData((p: any) => ({ ...p, reasons: { ...p.reasons, items: newArr } }));
                                                }} />
                                            </div>
                                        ))}
                                        <Button type="button" variant="outline" size="sm" onClick={() => {
                                            const newArr = [...(aboutData.reasons?.items || []), { title: "", description: "" }];
                                            setAboutData((p: any) => ({ ...p, reasons: { ...p.reasons, items: newArr } }));
                                        }}>
                                            <Plus className="w-4 h-4 mr-2" /> Add Reason Feature
                                        </Button>
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4 border-t pt-4">
                                    <div className="space-y-2">
                                        <Label>CTA Text</Label>
                                        <Input value={aboutData?.ctaText || ""} onChange={e => setAboutData((p: any) => ({ ...p, ctaText: e.target.value }))} placeholder="View Our Programs" />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>CTA Link</Label>
                                        <Input value={aboutData?.ctaLink || ""} onChange={e => setAboutData((p: any) => ({ ...p, ctaLink: e.target.value }))} placeholder="/programs" />
                                    </div>
                                </div>
                                <Button type="submit" disabled={isSaving}>Save About Us</Button>
                            </form>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* FAQ TAB */}
                <TabsContent value="faq">
                    <Card>
                        <CardHeader><CardTitle>FAQ Page</CardTitle></CardHeader>
                        <CardContent>
                            <form onSubmit={(e) => { e.preventDefault(); handleSave("faq", faqData); }} className="space-y-4">
                                <div className="space-y-2">
                                    <Label>Page Title</Label>
                                    <Input value={faqData?.title || ""} onChange={e => setFaqData((p: any) => ({ ...p, title: e.target.value }))} />
                                </div>
                                <div className="space-y-2">
                                    <Label>Page Subtitle</Label>
                                    <Input value={faqData?.subtitle || ""} onChange={e => setFaqData((p: any) => ({ ...p, subtitle: e.target.value }))} />
                                </div>
                                <div className="space-y-4 pt-4">
                                    <Label>Questions & Answers</Label>
                                    {(Array.isArray(faqData?.faqs) ? faqData.faqs : []).map((faq: any, i: number) => (
                                        <div key={i} className="border p-4 rounded-md space-y-2 relative bg-muted/20">
                                            <Button type="button" variant="ghost" size="icon" className="absolute top-2 right-2" onClick={() => {
                                                const newArr = [...faqData.faqs];
                                                newArr.splice(i, 1);
                                                setFaqData((p: any) => ({ ...p, faqs: newArr }));
                                            }}><Trash2 className="w-4 h-4 text-destructive" /></Button>

                                            <Label>Question</Label>
                                            <Input value={faq?.question || ""} onChange={e => {
                                                const newArr = [...faqData.faqs];
                                                newArr[i] = { ...newArr[i], question: e.target.value };
                                                setFaqData((p: any) => ({ ...p, faqs: newArr }));
                                            }} />
                                            <Label>Answer</Label>
                                            <Textarea value={faq?.answer || ""} onChange={e => {
                                                const newArr = [...faqData.faqs];
                                                newArr[i] = { ...newArr[i], answer: e.target.value };
                                                setFaqData((p: any) => ({ ...p, faqs: newArr }));
                                            }} />
                                        </div>
                                    ))}
                                    <Button type="button" variant="outline" size="sm" onClick={() => setFaqData((p: any) => ({ ...p, faqs: [...(p.faqs || []), { question: "", answer: "" }] }))}>
                                        <Plus className="w-4 h-4 mr-2" /> Add FAQ
                                    </Button>
                                </div>
                                <div className="grid grid-cols-2 gap-4 border-t pt-4">
                                    <div className="space-y-2">
                                        <Label>CTA Text</Label>
                                        <Input value={faqData?.ctaText || ""} onChange={e => setFaqData((p: any) => ({ ...p, ctaText: e.target.value }))} placeholder="Explore Programs" />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>CTA Link</Label>
                                        <Input value={faqData?.ctaLink || ""} onChange={e => setFaqData((p: any) => ({ ...p, ctaLink: e.target.value }))} placeholder="/programs" />
                                    </div>
                                </div>
                                <Button type="submit" disabled={isSaving}>Save FAQ</Button>
                            </form>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* DESTINATIONS TAB */}
                <TabsContent value="destinations">
                    <Card>
                        <CardHeader><CardTitle>Destinations Overview</CardTitle></CardHeader>
                        <CardContent>
                            <form onSubmit={(e) => { e.preventDefault(); handleSave("destinations", destinationsData); }} className="space-y-4">
                                <div className="space-y-2">
                                    <Label>Page Title</Label>
                                    <Input value={destinationsData?.title || ""} onChange={e => setDestinationsData((p: any) => ({ ...p, title: e.target.value }))} />
                                </div>
                                <div className="space-y-4 pt-4">
                                    <Label>Locations</Label>
                                    {(Array.isArray(destinationsData?.locations) ? destinationsData.locations : []).map((loc: any, i: number) => (
                                        <div key={i} className="border p-4 rounded-md space-y-2 relative bg-muted/20">
                                            <Button type="button" variant="ghost" size="icon" className="absolute top-2 right-2" onClick={() => {
                                                const newArr = [...destinationsData.locations];
                                                newArr.splice(i, 1);
                                                setDestinationsData((p: any) => ({ ...p, locations: newArr }));
                                            }}><Trash2 className="w-4 h-4 text-destructive" /></Button>

                                            <Label>Location Name</Label>
                                            <Input value={loc?.name || ""} onChange={e => {
                                                const newArr = [...destinationsData.locations];
                                                newArr[i] = { ...newArr[i], name: e.target.value };
                                                setDestinationsData((p: any) => ({ ...p, locations: newArr }));
                                            }} />
                                            <Label>Description</Label>
                                            <Textarea value={loc?.description || ""} onChange={e => {
                                                const newArr = [...destinationsData.locations];
                                                newArr[i] = { ...newArr[i], description: e.target.value };
                                                setDestinationsData((p: any) => ({ ...p, locations: newArr }));
                                            }} />
                                            <div className="pt-2">
                                                <ImageUploader label="Location Image" value={loc?.image || ""} onChange={(url) => {
                                                    const newArr = [...destinationsData.locations];
                                                    newArr[i] = { ...newArr[i], image: url };
                                                    setDestinationsData((p: any) => ({ ...p, locations: newArr }));
                                                }} folder="images/pages" />
                                            </div>
                                        </div>
                                    ))}
                                    <Button type="button" variant="outline" size="sm" onClick={() => setDestinationsData((p: any) => ({ ...p, locations: [...(p.locations || []), { name: "", description: "", image: "" }] }))}>
                                        <Plus className="w-4 h-4 mr-2" /> Add Location
                                    </Button>
                                </div>
                                <Button type="submit" disabled={isSaving}>Save Destinations</Button>
                            </form>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* HOW IT WORKS TAB */}
                <TabsContent value="how-it-works">
                    <Card>
                        <CardHeader><CardTitle>How It Works</CardTitle></CardHeader>
                        <CardContent>
                            <form onSubmit={(e) => { e.preventDefault(); handleSave("how-it-works", howItWorksData); }} className="space-y-4">
                                <div className="space-y-2">
                                    <Label>Page Title</Label>
                                    <Input value={howItWorksData?.title || ""} onChange={e => setHowItWorksData((p: any) => ({ ...p, title: e.target.value }))} />
                                </div>
                                <div className="space-y-2">
                                    <Label>Page Subtitle</Label>
                                    <Input value={howItWorksData?.subtitle || ""} onChange={e => setHowItWorksData((p: any) => ({ ...p, subtitle: e.target.value }))} />
                                </div>
                                <div className="space-y-4 pt-4">
                                    <Label>Steps</Label>
                                    {(Array.isArray(howItWorksData?.steps) ? howItWorksData.steps : []).map((step: any, i: number) => (
                                        <div key={i} className="border p-4 rounded-md space-y-2 relative bg-muted/20">
                                            <Button type="button" variant="ghost" size="icon" className="absolute top-2 right-2" onClick={() => {
                                                const newArr = [...howItWorksData.steps];
                                                newArr.splice(i, 1);
                                                setHowItWorksData((p: any) => ({ ...p, steps: newArr }));
                                            }}><Trash2 className="w-4 h-4 text-destructive" /></Button>

                                            <div className="grid grid-cols-2 gap-4">
                                                <div className="space-y-2">
                                                    <Label>Step Number (e.g., 01)</Label>
                                                    <Input value={step?.number || ""} onChange={e => {
                                                        const newArr = [...howItWorksData.steps];
                                                        newArr[i] = { ...newArr[i], number: e.target.value };
                                                        setHowItWorksData((p: any) => ({ ...p, steps: newArr }));
                                                    }} />
                                                </div>
                                                <div className="space-y-2">
                                                    <Label>Small Tag (e.g., Apply)</Label>
                                                    <Input value={step?.tag || ""} onChange={e => {
                                                        const newArr = [...howItWorksData.steps];
                                                        newArr[i] = { ...newArr[i], tag: e.target.value };
                                                        setHowItWorksData((p: any) => ({ ...p, steps: newArr }));
                                                    }} />
                                                </div>
                                            </div>

                                            <Label>Step Title (e.g., Fill Form)</Label>
                                            <Input value={step?.title || ""} onChange={e => {
                                                const newArr = [...howItWorksData.steps];
                                                newArr[i] = { ...newArr[i], title: e.target.value };
                                                setHowItWorksData((p: any) => ({ ...p, steps: newArr }));
                                            }} />
                                            <Label>Description</Label>
                                            <Textarea value={step?.description || ""} onChange={e => {
                                                const newArr = [...howItWorksData.steps];
                                                newArr[i] = { ...newArr[i], description: e.target.value };
                                                setHowItWorksData((p: any) => ({ ...p, steps: newArr }));
                                            }} />
                                        </div>
                                    ))}
                                    <Button type="button" variant="outline" size="sm" onClick={() => setHowItWorksData((p: any) => ({ ...p, steps: [...(p.steps || []), { number: "", tag: "", title: "", description: "" }] }))}>
                                        <Plus className="w-4 h-4 mr-2" /> Add Step
                                    </Button>
                                </div>
                                <div className="grid grid-cols-2 gap-4 border-t pt-4">
                                    <div className="space-y-2">
                                        <Label>CTA Text</Label>
                                        <Input value={howItWorksData?.ctaText || ""} onChange={e => setHowItWorksData((p: any) => ({ ...p, ctaText: e.target.value }))} placeholder="Start Exploring" />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>CTA Link</Label>
                                        <Input value={howItWorksData?.ctaLink || ""} onChange={e => setHowItWorksData((p: any) => ({ ...p, ctaLink: e.target.value }))} placeholder="/programs" />
                                    </div>
                                </div>
                                <Button type="submit" disabled={isSaving}>Save How it Works</Button>
                            </form>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* CONTACT TAB */}
                <TabsContent value="contact">
                    <Card>
                        <CardHeader><CardTitle>Contact Page</CardTitle></CardHeader>
                        <CardContent>
                            <form onSubmit={(e) => { e.preventDefault(); handleSave("contact", contactData); }} className="space-y-4">
                                <div className="space-y-2">
                                    <Label>Page Title</Label>
                                    <Input value={contactData?.title || ""} onChange={e => setContactData((p: any) => ({ ...p, title: e.target.value }))} />
                                </div>
                                <div className="space-y-2">
                                    <Label>Page Subtitle</Label>
                                    <Input value={contactData?.subtitle || ""} onChange={e => setContactData((p: any) => ({ ...p, subtitle: e.target.value }))} />
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t">
                                    <div className="space-y-2">
                                        <Label>Email</Label>
                                        <Input value={contactData?.email || ""} onChange={e => setContactData((p: any) => ({ ...p, email: e.target.value }))} />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Phone</Label>
                                        <Input value={contactData?.phone || ""} onChange={e => setContactData((p: any) => ({ ...p, phone: e.target.value }))} />
                                    </div>
                                    <div className="space-y-2 md:col-span-2">
                                        <Label>Address</Label>
                                        <Input value={contactData?.address || ""} onChange={e => setContactData((p: any) => ({ ...p, address: e.target.value }))} />
                                    </div>
                                </div>
                                <Button type="submit" disabled={isSaving}>Save Contact Info</Button>
                            </form>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* SAFETY TAB */}
                <TabsContent value="safety">
                    <Card>
                        <CardHeader><CardTitle>Safety Page</CardTitle></CardHeader>
                        <CardContent>
                            <form onSubmit={(e) => { e.preventDefault(); handleSave("safety", safetyData); }} className="space-y-4">
                                <div className="space-y-2">
                                    <Label>Page Title</Label>
                                    <Input value={safetyData?.title || ""} onChange={e => setSafetyData((p: any) => ({ ...p, title: e.target.value }))} />
                                </div>
                                <div className="space-y-2">
                                    <Label>Page Subtitle</Label>
                                    <Textarea value={safetyData?.subtitle || ""} onChange={e => setSafetyData((p: any) => ({ ...p, subtitle: e.target.value }))} />
                                </div>
                                <div className="space-y-4 pt-4">
                                    <Label>Safety Measures</Label>
                                    {(Array.isArray(safetyData?.measures) ? safetyData.measures : []).map((measure: any, i: number) => (
                                        <div key={i} className="border p-4 rounded-md space-y-2 relative bg-muted/20">
                                            <Button type="button" variant="ghost" size="icon" className="absolute top-2 right-2" onClick={() => {
                                                const newArr = [...safetyData.measures];
                                                newArr.splice(i, 1);
                                                setSafetyData((p: any) => ({ ...p, measures: newArr }));
                                            }}><Trash2 className="w-4 h-4 text-destructive" /></Button>

                                            <Label>Measure Title</Label>
                                            <Input value={measure?.title || ""} onChange={e => {
                                                const newArr = [...safetyData.measures];
                                                newArr[i] = { ...newArr[i], title: e.target.value };
                                                setSafetyData((p: any) => ({ ...p, measures: newArr }));
                                            }} />
                                            <Label>Description</Label>
                                            <Textarea value={measure?.description || ""} onChange={e => {
                                                const newArr = [...safetyData.measures];
                                                newArr[i] = { ...newArr[i], description: e.target.value };
                                                setSafetyData((p: any) => ({ ...p, measures: newArr }));
                                            }} />
                                        </div>
                                    ))}
                                    <Button type="button" variant="outline" size="sm" onClick={() => setSafetyData((p: any) => ({ ...p, measures: [...(p.measures || []), { title: "", description: "" }] }))}>
                                        <Plus className="w-4 h-4 mr-2" /> Add Measure
                                    </Button>
                                </div>
                                <Button type="submit" disabled={isSaving}>Save Safety Page</Button>
                            </form>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* LEGAL DOCS TAB */}
                <TabsContent value="legal">
                    <div className="space-y-8">
                        {/* Terms */}
                        <Card>
                            <CardHeader><CardTitle>Terms & Conditions</CardTitle></CardHeader>
                            <CardContent>
                                <form onSubmit={(e) => { e.preventDefault(); handleSave("terms", termsData); }} className="space-y-4">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label>Page Title</Label>
                                            <Input value={termsData?.title || ""} onChange={e => setTermsData((p: any) => ({ ...p, title: e.target.value }))} />
                                        </div>
                                        <div className="space-y-2">
                                            <Label>Last Updated Date</Label>
                                            <Input value={termsData?.lastUpdated || ""} onChange={e => setTermsData((p: any) => ({ ...p, lastUpdated: e.target.value }))} />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Document Content (Text/Markdown-like)</Label>
                                        <Textarea className="min-h-[200px]" value={termsData?.content || ""} onChange={e => setTermsData((p: any) => ({ ...p, content: e.target.value }))} />
                                    </div>
                                    <Button type="submit" disabled={isSaving}>Save Terms</Button>
                                </form>
                            </CardContent>
                        </Card>

                        {/* Privacy */}
                        <Card>
                            <CardHeader><CardTitle>Privacy Policy</CardTitle></CardHeader>
                            <CardContent>
                                <form onSubmit={(e) => { e.preventDefault(); handleSave("privacy", privacyData); }} className="space-y-4">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label>Page Title</Label>
                                            <Input value={privacyData?.title || ""} onChange={e => setPrivacyData((p: any) => ({ ...p, title: e.target.value }))} />
                                        </div>
                                        <div className="space-y-2">
                                            <Label>Last Updated Date</Label>
                                            <Input value={privacyData?.lastUpdated || ""} onChange={e => setPrivacyData((p: any) => ({ ...p, lastUpdated: e.target.value }))} />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Document Content (Text/Markdown-like)</Label>
                                        <Textarea className="min-h-[200px]" value={privacyData?.content || ""} onChange={e => setPrivacyData((p: any) => ({ ...p, content: e.target.value }))} />
                                    </div>
                                    <Button type="submit" disabled={isSaving}>Save Privacy Policy</Button>
                                </form>
                            </CardContent>
                        </Card>

                        {/* Cancellation */}
                        <Card>
                            <CardHeader><CardTitle>Cancellation Policy</CardTitle></CardHeader>
                            <CardContent>
                                <form onSubmit={(e) => { e.preventDefault(); handleSave("cancellation", cancellationData); }} className="space-y-4">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label>Page Title</Label>
                                            <Input value={cancellationData?.title || ""} onChange={e => setCancellationData((p: any) => ({ ...p, title: e.target.value }))} />
                                        </div>
                                        <div className="space-y-2">
                                            <Label>Last Updated Date</Label>
                                            <Input value={cancellationData?.lastUpdated || ""} onChange={e => setCancellationData((p: any) => ({ ...p, lastUpdated: e.target.value }))} />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Document Content (Text/Markdown-like)</Label>
                                        <Textarea className="min-h-[200px]" value={cancellationData?.content || ""} onChange={e => setCancellationData((p: any) => ({ ...p, content: e.target.value }))} />
                                    </div>
                                    <Button type="submit" disabled={isSaving}>Save Cancellation Policy</Button>
                                </form>
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>

            </Tabs>
        </div>
    );
}
