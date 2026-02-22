"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

// Define form steps
const STEPS = [
    "Account",
    "Personal Info",
    "Experience",
    "Travel Details",
    "Payment"
];

export default function ApplicationForm({ programId, duration, startDate }: { programId: string, duration: 2 | 4, startDate: string }) {
    const [currentStep, setCurrentStep] = useState(0);

    // Form State Placeholders
    const [formData, setFormData] = useState({});

    const nextStep = () => setCurrentStep(prev => Math.min(prev + 1, STEPS.length - 1));
    const prevStep = () => setCurrentStep(prev => Math.max(prev - 1, 0));

    return (
        <div className="max-w-3xl mx-auto py-12">
            {/* Progress Bar */}
            <div className="mb-8">
                <div className="flex justify-between mb-2 text-center sm:text-left">
                    {STEPS.map((step, idx) => (
                        <div key={idx} className={`text-xs md:text-sm font-medium ${idx === currentStep ? 'text-primary block' : 'text-muted-foreground hidden sm:block'
                            } ${idx <= currentStep ? 'sm:text-primary' : ''}`}>
                            <span className="sm:hidden">Step {idx + 1}: </span>{step}
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

            <Card>
                <CardHeader>
                    <CardTitle className="text-2xl">{STEPS[currentStep]}</CardTitle>
                </CardHeader>
                <CardContent>

                    {/* Step 0: Account / Auth Gateway (Simplified for UI layout) */}
                    {currentStep === 0 && (
                        <div className="space-y-4">
                            <p className="text-muted-foreground">To save your application progress, please create an account or log in.</p>
                            <div className="grid gap-4">
                                <div className="space-y-2">
                                    <Label>Email</Label>
                                    <Input type="email" placeholder="m@example.com" />
                                </div>
                                <div className="space-y-2">
                                    <Label>Password</Label>
                                    <Input type="password" />
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Step 1: Personal Info */}
                    {currentStep === 1 && (
                        <div className="space-y-4">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>First Name</Label>
                                    <Input placeholder="Jane" />
                                </div>
                                <div className="space-y-2">
                                    <Label>Last Name</Label>
                                    <Input placeholder="Doe" />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label>Phone Number</Label>
                                <Input type="tel" placeholder="+1 (555) 000-0000" />
                            </div>
                        </div>
                    )}

                    {/* Step 2: Experience */}
                    {currentStep === 2 && (
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label>Why do you want to volunteer?</Label>
                                <textarea className="w-full min-h-[100px] border border-input rounded-md px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring" placeholder="Tell us briefly about your motivation..." />
                            </div>
                            <div className="space-y-2">
                                <Label>Any relevant skills? (Optional)</Label>
                                <Input placeholder="E.g., Teaching certification, First Aid, etc." />
                            </div>
                        </div>
                    )}

                    {/* Step 3: Travel */}
                    {currentStep === 3 && (
                        <div className="space-y-4">
                            <p className="text-sm text-muted-foreground">You can provide these details later from your dashboard if you haven't booked flights yet.</p>
                            <div className="space-y-2">
                                <Label>Expected Arrival Date in Colombo (CMB)</Label>
                                <Input type="date" />
                            </div>
                            <div className="space-y-2">
                                <div className="flex items-center gap-2 mt-4">
                                    <input type="checkbox" id="insurance" className="rounded" />
                                    <Label htmlFor="insurance">I understand Travel Insurance is mandatory</Label>
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
                            <div className="bg-muted/50 p-4 rounded-lg">
                                <p className="text-sm text-center text-muted-foreground mb-4">Secure Stripe Payment Component Placeholder</p>
                                <div className="h-32 border-2 border-dashed border-muted-foreground/30 flex items-center justify-center rounded">
                                    <span>Stripe Elements UI</span>
                                </div>
                            </div>
                        </div>
                    )}

                    <div className="flex justify-between pt-8 border-t mt-8">
                        <Button variant="outline" onClick={prevStep} disabled={currentStep === 0}>
                            Back
                        </Button>
                        {currentStep < STEPS.length - 1 ? (
                            <Button onClick={nextStep}>Continue Application</Button>
                        ) : (
                            <Button className="bg-green-600 hover:bg-green-700">Submit & Pay</Button>
                        )}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
