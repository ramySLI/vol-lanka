import { Button } from "@/components/ui/button";

export default function HowItWorksPage() {
    return (
        <div className="container mx-auto px-4 py-16">
            <div className="text-center max-w-2xl mx-auto mb-16">
                <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">How It Works</h1>
                <p className="text-xl text-muted-foreground">
                    Your journey to making an impact in Sri Lanka is just a few steps away. We've made the application process as simple and supportive as possible.
                </p>
            </div>

            <div className="max-w-4xl mx-auto space-y-12">
                {/* Step 1 */}
                <div className="flex flex-col md:flex-row gap-6 md:gap-12 items-start relative border-l-2 md:border-none pl-6 md:pl-0 border-primary ml-4 md:ml-0">
                    <div className="md:w-1/3 text-left md:text-right pt-2">
                        <h3 className="text-xl font-bold text-primary">01. Discover</h3>
                    </div>
                    <div className="md:w-2/3 bg-card rounded-lg p-6 shadow-sm border">
                        <h4 className="font-semibold text-lg mb-2">Find Your Perfect Program</h4>
                        <p className="text-muted-foreground">Browse our range of ethical volunteer programs happening across Sri Lanka. Whether your passion is wildlife conservation, teaching, or medical care, find the initiative that speaks to you.</p>
                    </div>
                </div>

                {/* Step 2 */}
                <div className="flex flex-col md:flex-row gap-6 md:gap-12 items-start relative border-l-2 md:border-none pl-6 md:pl-0 border-primary ml-4 md:ml-0">
                    <div className="md:w-1/3 text-left md:text-right pt-2">
                        <h3 className="text-xl font-bold text-primary">02. Apply</h3>
                    </div>
                    <div className="md:w-2/3 bg-card rounded-lg p-6 shadow-sm border">
                        <h4 className="font-semibold text-lg mb-2">Complete the 5-Step Form</h4>
                        <p className="text-muted-foreground">Select your ideal dates and duration. Our streamlined application process collects your personal details, experience, and travel info. Reserve your spot by paying a 50% deposit via our secure Stripe integration.</p>
                    </div>
                </div>

                {/* Step 3 */}
                <div className="flex flex-col md:flex-row gap-6 md:gap-12 items-start relative border-l-2 md:border-none pl-6 md:pl-0 border-primary ml-4 md:ml-0">
                    <div className="md:w-1/3 text-left md:text-right pt-2">
                        <h3 className="text-xl font-bold text-primary">03. Prepare</h3>
                    </div>
                    <div className="md:w-2/3 bg-card rounded-lg p-6 shadow-sm border">
                        <h4 className="font-semibold text-lg mb-2">Pre-Departure Dashboard</h4>
                        <p className="text-muted-foreground">Log in to your Volunteer Dashboard to access your interactive checklist. From booking your flight to securing visas and packing, we guide you through every necessary step before departure.</p>
                    </div>
                </div>

                {/* Step 4 */}
                <div className="flex flex-col md:flex-row gap-6 md:gap-12 items-start relative pl-6 md:pl-0 ml-4 md:ml-0">
                    <div className="md:w-1/3 text-left md:text-right pt-2">
                        <h3 className="text-xl font-bold text-primary">04. Experience</h3>
                    </div>
                    <div className="md:w-2/3 bg-card rounded-lg p-6 shadow-sm border">
                        <h4 className="font-semibold text-lg mb-2">Arrive & Volunteer</h4>
                        <p className="text-muted-foreground">We handle your airport pickup, accommodation, and orientation. Dive directly into your project with the backing of our 24/7 dedicated support team on the ground.</p>
                    </div>
                </div>
            </div>

            <div className="text-center mt-16">
                <Button size="lg" className="px-8 py-6 text-lg">Start Exploring Programs</Button>
            </div>
        </div>
    );
}
