import Link from "next/link";
import { Button } from "@/components/ui/button";
import { CheckCircle2 } from "lucide-react";

export default function BookingSuccessPage() {
    return (
        <div className="min-h-screen bg-muted/20 flex items-center justify-center p-4">
            <div className="bg-card max-w-lg w-full rounded-xl border p-8 shadow-sm text-center">
                <div className="flex justify-center mb-6">
                    <CheckCircle2 className="w-20 h-20 text-green-500" />
                </div>

                <h1 className="text-3xl font-bold tracking-tight mb-4">Application Secured!</h1>
                <p className="text-muted-foreground text-lg mb-8">
                    Thank you for choosing to volunteer with us. Your payment has been processed successfully and your spot is reserved.
                </p>

                <div className="bg-muted p-4 rounded-lg text-left mb-8">
                    <p className="text-sm font-semibold mb-2 text-primary uppercase">Next Steps</p>
                    <ul className="text-sm text-muted-foreground space-y-2 list-disc list-inside">
                        <li>Check your email for the payment receipt and confirmation.</li>
                        <li>Our team will review your application and contact you within 24 hours.</li>
                        <li>Log in to your Dashboard to begin your pre-departure checklist.</li>
                    </ul>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Button asChild size="lg">
                        <Link href="/dashboard">Go to Dashboard</Link>
                    </Button>
                    <Button asChild variant="outline" size="lg">
                        <Link href="/">Return Home</Link>
                    </Button>
                </div>
            </div>
        </div>
    );
}
