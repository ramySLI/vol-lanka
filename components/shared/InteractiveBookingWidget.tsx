"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { X } from "lucide-react";

export default function InteractiveBookingWidget({
    programId,
    priceTwoWeeks,
    priceFourWeeks,
}: {
    programId: string;
    priceTwoWeeks: number;
    priceFourWeeks: number;
}) {
    const [duration, setDuration] = useState<2 | 4>(2);
    const [startDate, setStartDate] = useState<Date | undefined>(undefined);
    const [isMobileOpen, setIsMobileOpen] = useState(false);

    const currentPrice = duration === 2 ? priceTwoWeeks : priceFourWeeks;

    const WidgetContent = (
        <>
            <h3 className="text-2xl font-bold mb-6">${currentPrice} <span className="text-sm font-normal text-muted-foreground">/ person</span></h3>

            <div className="space-y-6">
                <div>
                    <label className="text-sm font-medium mb-2 block">1. Select Duration</label>
                    <div className="grid grid-cols-2 gap-3">
                        <button
                            onClick={() => setDuration(2)}
                            className={`py-2 px-4 rounded-md border text-sm font-medium transition-colors ${duration === 2 ? 'bg-primary/10 border-primary text-primary' : 'bg-transparent text-foreground hover:bg-muted'
                                }`}
                        >
                            2 Weeks
                        </button>
                        <button
                            onClick={() => setDuration(4)}
                            className={`py-2 px-4 rounded-md border text-sm font-medium transition-colors ${duration === 4 ? 'bg-primary/10 border-primary text-primary' : 'bg-transparent text-foreground hover:bg-muted'
                                }`}
                        >
                            4 Weeks
                        </button>
                    </div>
                </div>

                <div>
                    <label className="text-sm font-medium mb-2 block">2. Select Start Date (Mondays)</label>
                    <div className="border rounded-md p-2 bg-background w-full overflow-hidden flex justify-center">
                        <Calendar
                            mode="single"
                            selected={startDate}
                            onSelect={setStartDate}
                            disabled={(date) => {
                                // Only allow Mondays in the future
                                return date.getDay() !== 1 || date < new Date();
                            }}
                            className="w-full"
                        />
                    </div>
                    {startDate && (
                        <p className="text-xs text-muted-foreground mt-2 text-center">
                            Starting on {startDate.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}
                        </p>
                    )}
                </div>

                <div className="pt-4 border-t">
                    <div className="flex justify-between mb-4 text-sm">
                        <span>{duration} Weeks Volunteer Program</span>
                        <span className="font-semibold">${currentPrice}</span>
                    </div>
                    <div className="flex justify-between mb-4 text-sm font-bold">
                        <span>Total</span>
                        <span>${currentPrice}</span>
                    </div>

                    <Button
                        asChild
                        className="w-full text-lg py-6"
                        disabled={!startDate}
                    >
                        <Link
                            href={`/apply/${programId}?duration=${duration}${startDate ? `&start=${startDate.toISOString()}` : ''}`}
                        >
                            Reserve Now
                        </Link>
                    </Button>
                    {!startDate && (
                        <p className="text-xs text-destructive text-center mt-2">Please select a start date to continue</p>
                    )}
                </div>

                <div className="text-center text-xs text-muted-foreground pt-2">
                    Secure checkout via Stripe. Book with confidence.
                </div>
            </div>
        </>
    );

    return (
        <>
            {/* Desktop Widget */}
            <div className="hidden lg:block bg-card rounded-xl border p-6 shadow-sm sticky top-24">
                {WidgetContent}
            </div>

            {/* Mobile Bottom Bar */}
            <div className="lg:hidden fixed bottom-0 left-0 right-0 p-4 bg-background border-t shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)] z-40">
                <div className="flex items-center justify-between gap-4">
                    <div className="flex flex-col">
                        <span className="text-xs text-muted-foreground font-semibold uppercase tracking-wider">Starting at</span>
                        <div className="flex items-baseline gap-1">
                            <span className="text-xl font-bold">${currentPrice}</span>
                        </div>
                    </div>
                    <Button size="lg" className="flex-1" onClick={() => setIsMobileOpen(true)}>
                        Check Availability
                    </Button>
                </div>
            </div>

            {/* Mobile Modal (Simulated Sheet) */}
            {isMobileOpen && (
                <div className="lg:hidden fixed inset-0 z-50 bg-background overflow-y-auto px-4 py-6 flex flex-col">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-xl font-bold">Book Your Trip</h2>
                        <button
                            onClick={() => setIsMobileOpen(false)}
                            className="p-2 bg-muted rounded-full text-muted-foreground hover:text-foreground hover:bg-muted/80"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>
                    <div className="bg-card rounded-xl border p-6 shadow-sm mb-24">
                        {WidgetContent}
                    </div>
                </div>
            )}
        </>
    );
}
