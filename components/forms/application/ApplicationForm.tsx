"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/components/providers/AuthProvider";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase/config";

const STEPS = [
    "Account",
    "Personal Info",
    "Experience",
    "Travel Details",
    "Payment"
];

export default function ApplicationForm({ programId, duration, startDate }: { programId: string, duration: 2 | 4, startDate: string }) {
    const { user, loading } = useAuth();
    const router = useRouter();

    // Skip account step if already logged in
    const [currentStep, setCurrentStep] = useState(0);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState("");

    // Form State
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        phone: "",
        motivation: "",
        skills: "",
        arrivalDate: "",
        insuranceAssent: false
    });

    useEffect(() => {
        if (!loading && user && currentStep === 0) {
            setTimeout(() => setCurrentStep(1), 0); // Auto-advance to Personal Info if authenticated
        }
    }, [user, loading, currentStep]);

    const handleNext = () => {
        setError("");
        if (currentStep === 1) {
            if (!formData.firstName.trim() || !formData.lastName.trim() || !formData.phone.trim()) {
                setError("Please fill out your full name and phone number to continue.");
                return;
            }
        }
        if (currentStep === 2) {
            if (!formData.motivation.trim()) {
                setError("Please briefly describe your motivation for volunteering.");
                return;
            }
        }
        if (currentStep === 3) {
            if (!formData.insuranceAssent) {
                setError("You must agree to the travel insurance terms to proceed.");
                return;
            }
        }
        setCurrentStep(prev => Math.min(prev + 1, STEPS.length - 1));
    };

    const prevStep = () => {
        setError("");
        setCurrentStep(prev => Math.max(prev - 1, 0));
    };

    const handleUpdate = (field: string, value: string | boolean) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleSubmit = async () => {
        if (!user) {
            setError("You must be logged in to submit an application.");
            return;
        }

        setIsSubmitting(true);
        setError("");

        try {
            // Save to Firestore 'applications' collection
            await addDoc(collection(db, "applications"), {
                userId: user.uid,
                programId,
                durationWeeks: duration,
                targetStartDate: startDate,
                paymentStatus: "pending_setup_fee",
                status: "submitted",
                personalInfo: {
                    firstName: formData.firstName,
                    lastName: formData.lastName,
                    phone: formData.phone,
                    email: user.email
                },
                experience: {
                    motivation: formData.motivation,
                    skills: formData.skills
                },
                travel: {
                    arrivalDate: formData.arrivalDate,
                    insuranceAssent: formData.insuranceAssent
                },
                createdAt: serverTimestamp(),
                updatedAt: serverTimestamp()
            });

            // Redirect to success/dashboard
            router.push("/dashboard?application=success");
        } catch (err: unknown) {
            console.error("Error submitting application:", err);
            setError("Failed to submit application. Please try again.");
            setIsSubmitting(false);
        }
    };

    if (loading) return <div className="p-12 text-center text-muted-foreground">Loading form...</div>;

    return (
        <div className="max-w-3xl mx-auto py-12">
            {/* Progress Bar */}
            <div className="mb-8 hidden sm:block">
                <div className="flex justify-between mb-2 text-center sm:text-left">
                    {STEPS.map((step, idx) => (
                        <div key={idx} className={`text-xs md:text-sm font-medium ${idx === currentStep ? 'text-primary' : 'text-muted-foreground'
                            } ${idx <= currentStep ? 'sm:text-primary' : ''}`}>
                            {step}
                        </div>
                    ))}
                </div>
                <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                    <div
                        className="h-full bg-primary transition-all duration-300"
                        style={{ width: `${((currentStep) / (STEPS.length - 1)) * 100}%` }}
                    />
                </div>
            </div>

            <Card className="shadow-sm">
                <CardHeader>
                    <CardTitle className="text-2xl">{STEPS[currentStep]}</CardTitle>
                </CardHeader>
                <CardContent>
                    {error && (
                        <div className="mb-6 p-3 bg-red-50 text-red-600 rounded-md text-sm border border-red-200">
                            {error}
                        </div>
                    )}

                    {/* Step 0: Account / Auth Gateway */}
                    {currentStep === 0 && (
                        <div className="space-y-4">
                            {!user ? (
                                <div className="text-center py-6">
                                    <p className="text-muted-foreground mb-4 text-lg">
                                        Please create an account or log in to secure your placement.
                                    </p>
                                    <Button onClick={() => router.push(`/login?redirect=/apply/${programId}`)}>
                                        Go to Login / Sign Up
                                    </Button>
                                </div>
                            ) : (
                                <div className="text-center py-6">
                                    <p className="text-green-600 font-medium text-lg">You are securely authenticated as {user.email}.</p>
                                    <Button className="mt-4" onClick={handleNext}>Continue Application</Button>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Step 1: Personal Info */}
                    {currentStep === 1 && (
                        <div className="space-y-4">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>First Name</Label>
                                    <Input
                                        placeholder="Jane"
                                        value={formData.firstName}
                                        onChange={(e) => handleUpdate('firstName', e.target.value)}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>Last Name</Label>
                                    <Input
                                        placeholder="Doe"
                                        value={formData.lastName}
                                        onChange={(e) => handleUpdate('lastName', e.target.value)}
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label>Phone Number</Label>
                                <Input
                                    type="tel"
                                    placeholder="+1 (555) 000-0000"
                                    value={formData.phone}
                                    onChange={(e) => handleUpdate('phone', e.target.value)}
                                />
                            </div>
                        </div>
                    )}

                    {/* Step 2: Experience */}
                    {currentStep === 2 && (
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label>Why do you want to volunteer?</Label>
                                <textarea
                                    className="w-full min-h-[100px] border border-input rounded-md px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                                    placeholder="Tell us briefly about your motivation..."
                                    value={formData.motivation}
                                    onChange={(e) => handleUpdate('motivation', e.target.value)}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Any relevant skills? (Optional)</Label>
                                <Input
                                    placeholder="E.g., Teaching certification, First Aid, etc."
                                    value={formData.skills}
                                    onChange={(e) => handleUpdate('skills', e.target.value)}
                                />
                            </div>
                        </div>
                    )}

                    {/* Step 3: Travel */}
                    {currentStep === 3 && (
                        <div className="space-y-4">
                            <p className="text-sm text-muted-foreground">You can provide these details later from your dashboard if you haven&apos;t booked flights yet.</p>
                            <div className="space-y-2">
                                <Label>Expected Arrival Date in Colombo (CMB)</Label>
                                <Input
                                    type="date"
                                    value={formData.arrivalDate}
                                    onChange={(e) => handleUpdate('arrivalDate', e.target.value)}
                                />
                            </div>
                            <div className="space-y-2">
                                <div className="flex items-center gap-2 mt-4">
                                    <input
                                        type="checkbox"
                                        id="insurance"
                                        className="rounded w-4 h-4"
                                        checked={formData.insuranceAssent}
                                        onChange={(e) => handleUpdate('insuranceAssent', e.target.checked)}
                                    />
                                    <Label htmlFor="insurance" className="cursor-pointer">I understand Travel Insurance is mandatory for participation</Label>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Step 4: Payment */}
                    {currentStep === 4 && (
                        <div className="space-y-6">
                            <div className="bg-muted p-4 rounded-lg flex justify-between items-center text-lg">
                                <span>Program Setup Fee</span>
                                <span className="font-bold">$299.00</span>
                            </div>
                            <div className="bg-green-50 border border-green-200 text-green-800 p-4 rounded-lg">
                                <p className="text-sm text-center mb-1 font-medium">Payment Gateway Pending</p>
                                <p className="text-sm text-center opacity-80">Clicking submit will finalize your application without charging a card during this test phase.</p>
                            </div>
                        </div>
                    )}

                    <div className="flex justify-between pt-8 border-t mt-8">
                        {currentStep > 0 && user && ( // Don't show back button on account screen if logged in
                            <Button variant="outline" onClick={prevStep}>
                                Back
                            </Button>
                        )}
                        {!user && currentStep === 0 && <div /> /* Empty div for layout spacing when not logged in */}

                        {currentStep < STEPS.length - 1 && currentStep !== 0 && (
                            <Button onClick={handleNext} className="ml-auto">Continue Application</Button>
                        )}

                        {currentStep === STEPS.length - 1 && (
                            <Button
                                className="bg-green-600 hover:bg-green-700 ml-auto"
                                onClick={handleSubmit}
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? "Submitting..." : "Submit Application"}
                            </Button>
                        )}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
