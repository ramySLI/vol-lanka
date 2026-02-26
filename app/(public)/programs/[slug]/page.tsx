import Image from "next/image";
import InteractiveBookingWidget from "@/components/shared/InteractiveBookingWidget";
import { fetchProgramBySlugREST } from "@/lib/firebase/firestore-rest";
import { notFound } from "next/navigation";

interface PageProps {
    params: Promise<{ slug: string }>;
}


export default async function ProgramDetailPage({ params }: PageProps) {
    const { slug } = await params;
    const program = await fetchProgramBySlugREST(slug);

    if (!program) {
        notFound();
    }

    return (
        <div>
            {/* Hero Image Area */}
            <div className="w-full h-[40vh] md:h-[50vh] relative flex flex-col justify-end pb-8 overflow-hidden">
                <Image
                    src={program.images?.[0] || '/images/programs/sea-turtle.png'}
                    alt={program.title}
                    fill
                    className="object-cover object-center absolute inset-0 z-0 brightness-75"
                    quality={100}
                    priority
                />
                <div className="container mx-auto px-4 z-10 relative mt-auto">
                    <div className="bg-white/95 backdrop-blur shadow-xl p-6 md:p-8 rounded-2xl inline-block max-w-2xl transform translate-y-4">
                        <div className="flex items-center gap-2 text-sm font-bold text-primary mb-3 uppercase tracking-wider">
                            <span>{program.category.replace(/-/g, ' ')}</span>
                            <span>•</span>
                            <span className="capitalize">{program.destinationId.replace(/-/g, ' ')}</span>
                        </div>
                        <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight mb-3 text-slate-900">{program.title}</h1>
                        <div className="flex items-center gap-2 text-sm font-medium text-slate-600">
                            <span className="flex items-center gap-1 text-amber-500">
                                ★ {program.rating}
                            </span>
                            <span className="text-slate-400">•</span>
                            <span className="hover:text-primary transition-colors cursor-pointer">{program.reviewCount} verified reviews</span>
                        </div>
                    </div>
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
                                {program.shortDescription}
                            </p>
                            <p className="text-muted-foreground leading-relaxed">
                                {program.fullDescription}
                            </p>
                        </section>

                        {/* Schedule */}
                        {program.schedule && program.schedule.length > 0 && (
                            <section className="space-y-4">
                                <h2 className="text-2xl font-bold">Sample Schedule</h2>
                                <div className="space-y-4">
                                    {program.schedule.map((item, index) => (
                                        <div key={index} className="flex gap-4 p-4 rounded-lg bg-muted/30 border">
                                            <div className="font-bold text-primary shrink-0 w-16">Day {item.day}</div>
                                            <div className="text-muted-foreground">{item.activity}</div>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}

                        {/* Included / Not Included Grids */}
                        <section className="grid grid-cols-1 md:grid-cols-2 gap-8 bg-muted/30 p-8 rounded-xl border">
                            <div>
                                <h3 className="font-bold text-lg mb-4 text-green-700">What&apos;s Included</h3>
                                <ul className="space-y-2">
                                    {(program.included || []).map((item, i) => (
                                        <li key={i} className="flex items-start gap-2">
                                            <span className="text-green-600 mt-0.5">✓</span>
                                            <span>{item}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            <div>
                                <h3 className="font-bold text-lg mb-4 text-red-700">What&apos;s Not Included</h3>
                                <ul className="space-y-2 text-muted-foreground">
                                    {(program.notIncluded || []).map((item, i) => (
                                        <li key={i} className="flex items-start gap-2">
                                            <span className="text-red-500 mt-0.5">✗</span>
                                            <span>{item}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </section>
                    </div>

                    {/* Sticky Sidebar Booking Widget */}
                    <div className="w-full lg:w-[380px] shrink-0">
                        <InteractiveBookingWidget
                            programId={program.slug}
                            priceTwoWeeks={program.pricing?.twoWeeks || 0}
                            priceFourWeeks={program.pricing?.fourWeeks || 0}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
