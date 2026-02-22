import { Button } from "@/components/ui/button";

export default function AboutPage() {
    return (
        <div className="container mx-auto px-4 py-16">
            <div className="max-w-3xl mx-auto space-y-8">
                <h1 className="text-3xl md:text-4xl font-bold tracking-tight">About VolunteerLanka</h1>

                <p className="text-xl text-muted-foreground leading-relaxed">
                    We believe in the power of meaningful cultural exchange and sustainable impact. Since our founding, we've connected thousands of passionate individuals with local initiatives across Sri Lanka.
                </p>

                <section className="space-y-4">
                    <h2 className="text-2xl font-semibold">Our Mission</h2>
                    <p className="leading-relaxed">
                        To provide safe, affordable, and deeply impactful volunteering experiences that benefit both the traveler and the local communities in Sri Lanka. We focus on long-term sustainability and ethical engagement over short-term "voluntourism."
                    </p>
                </section>

                <section className="space-y-4">
                    <h2 className="text-2xl font-semibold">Why Choose Us?</h2>
                    <ul className="list-inside list-disc space-y-2 leading-relaxed">
                        <li><strong>Local Expertise:</strong> Our entire team is based in Sri Lanka, meaning we provide unparalleled local support and knowledge.</li>
                        <li><strong>Ethical Programs:</strong> All our partner organizations are vetted rigorously to ensure volunteer efforts create genuine positive change.</li>
                        <li><strong>Full Support:</strong> From pre-departure prep to 24/7 on-ground assistance, including meals and accommodation handlers.</li>
                        <li><strong>Cultural Immersion:</strong> Live and work alongside locals, taking part in authentic Sri Lankan life.</li>
                    </ul>
                </section>

                <div className="pt-8">
                    <Button size="lg" className="w-full sm:w-auto">View Our Programs</Button>
                </div>
            </div>
        </div>
    );
}
