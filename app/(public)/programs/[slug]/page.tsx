import InteractiveBookingWidget from "@/components/shared/InteractiveBookingWidget";

export default function ProgramDetailPage() {
    // Hardcoded for 'Sea Turtle Conservation' placeholder layout
    const program = {
        id: "1",
        slug: "turtle-conservation-galle",
        title: "Sea Turtle Conservation",
        destinationId: "Galle, Sri Lanka",
        pricing: { twoWeeks: 950, fourWeeks: 1450 },
        rating: 4.8,
        reviewCount: 124,
    };

    return (
        <div>
            {/* Hero Image Area */}
            <div className="w-full h-[40vh] md:h-[50vh] bg-slate-200 relative flex flex-col justify-end pb-8">
                <div className="container mx-auto px-4 z-10 relative">
                    <div className="bg-white/90 p-4 md:p-6 rounded-xl inline-block shadow-sm max-w-2xl">
                        <div className="flex items-center gap-2 text-sm font-semibold text-primary mb-2 uppercase tracking-wide">
                            <span>Conservation</span>
                            <span>•</span>
                            <span>{program.destinationId}</span>
                        </div>
                        <h1 className="text-3xl md:text-5xl font-bold tracking-tight mb-2">{program.title}</h1>
                        <div className="flex items-center gap-2 text-sm text-gray-700">
                            <span className="font-medium">★ {program.rating}</span>
                            <span className="underline cursor-pointer">({program.reviewCount} reviews)</span>
                        </div>
                    </div>
                </div>
                <div className="absolute inset-0 flex items-center justify-center text-muted-foreground bg-muted/50">
                    Main Hero Image Placeholder
                </div>
            </div>

            <div className="container mx-auto px-4 py-12">
                <div className="flex flex-col lg:flex-row gap-12">
                    {/* Main Content Area */}
                    <div className="flex-1 space-y-12">

                        {/* Nav Tabs (Static visual representation for now) */}
                        <div className="flex overflow-x-auto border-b pb-2 gap-6 font-medium text-sm sticky top-16 bg-background z-40">
                            <span className="text-primary border-b-2 border-primary pb-2 whitespace-nowrap cursor-pointer">Overview</span>
                            <span className="text-muted-foreground hover:text-foreground pb-2 whitespace-nowrap cursor-pointer">Schedule</span>
                            <span className="text-muted-foreground hover:text-foreground pb-2 whitespace-nowrap cursor-pointer">Requirements</span>
                            <span className="text-muted-foreground hover:text-foreground pb-2 whitespace-nowrap cursor-pointer">Reviews</span>
                        </div>

                        {/* Overview */}
                        <section className="space-y-4">
                            <h2 className="text-2xl font-bold">Program Overview</h2>
                            <p className="text-muted-foreground leading-relaxed text-lg">
                                Join our dedicated team on the southern coast of Sri Lanka to protect endangered sea turtles.
                                As a volunteer, you will participate in crucial conservation efforts, including beach patrols, nest protection,
                                and the rehabilitation of injured turtles recovered from the ocean.
                            </p>
                            <p className="text-muted-foreground leading-relaxed">
                                This hands-on program allows you to work closely with local experts and marine biologists to understand maritime
                                ecosystems. When not on the beach, you'll engage with the local community, organizing beach cleanups and
                                educational workshops for young students to raise awareness about local environmental challenges.
                            </p>
                        </section>

                        {/* Included / Not Included Grids */}
                        <section className="grid grid-cols-1 md:grid-cols-2 gap-8 bg-muted/30 p-8 rounded-xl border">
                            <div>
                                <h3 className="font-bold text-lg mb-4 text-green-700">What's Included</h3>
                                <ul className="space-y-2">
                                    <li className="flex items-center gap-2">✓ Airport pickup (Colombo)</li>
                                    <li className="flex items-center gap-2">✓ Shared volunteer accommodation</li>
                                    <li className="flex items-center gap-2">✓ 3 local meals per day</li>
                                    <li className="flex items-center gap-2">✓ 24/7 in-country support</li>
                                    <li className="flex items-center gap-2">✓ Program orientation & training</li>
                                </ul>
                            </div>
                            <div>
                                <h3 className="font-bold text-lg mb-4 text-red-700">What's Not Included</h3>
                                <ul className="space-y-2 text-muted-foreground">
                                    <li className="flex items-center gap-2">✗ Flights</li>
                                    <li className="flex items-center gap-2">✗ Travel Insurance (Mandatory)</li>
                                    <li className="flex items-center gap-2">✗ Visas</li>
                                    <li className="flex items-center gap-2">✗ Weekend excursions</li>
                                </ul>
                            </div>
                        </section>
                    </div>

                    {/* Sticky Sidebar Booking Widget */}
                    <div className="w-full lg:w-[380px] shrink-0">
                        <InteractiveBookingWidget
                            programId={program.slug}
                            priceTwoWeeks={program.pricing.twoWeeks}
                            priceFourWeeks={program.pricing.fourWeeks}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
