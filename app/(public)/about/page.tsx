import { Button } from "@/components/ui/button";
import { fetchPageContentREST } from "@/lib/firebase/firestore-rest";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowRight, Leaf, HeartHandshake, HelpingHand, Globe } from "lucide-react";

export default async function AboutPage() {
    const data = await fetchPageContentREST("about");

    if (!data) {
        notFound();
    }

    const icons = [Leaf, HeartHandshake, HelpingHand, Globe];

    return (
        <div className="bg-white min-h-screen">
            {/* Hero Section */}
            <div className="bg-slate-50 py-24 md:py-32 border-b border-slate-100">
                <div className="container mx-auto px-4 text-center max-w-4xl">
                    <h1 className="text-4xl md:text-5xl lg:text-7xl font-extrabold tracking-tight mb-8 text-slate-900">
                        {data.title}
                    </h1>
                    <p className="text-xl md:text-2xl text-slate-600 leading-relaxed max-w-3xl mx-auto">
                        {data.description}
                    </p>
                </div>
            </div>

            {/* Mission Section */}
            <div className="container mx-auto px-4 py-20">
                <div className="bg-primary/5 rounded-3xl p-10 md:p-16 max-w-5xl mx-auto shadow-sm border border-primary/10 text-center">
                    <h2 className="text-3xl font-bold mb-6 text-primary">{data.mission?.title}</h2>
                    <p className="text-lg md:text-xl text-slate-700 leading-relaxed max-w-3xl mx-auto font-medium">
                        "{data.mission?.content}"
                    </p>
                </div>
            </div>

            {/* Reasons Grid */}
            <div className="container mx-auto px-4 py-16 max-w-6xl">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold text-slate-900">{data.reasons?.title}</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
                    {data.reasons?.items?.map((item: any, i: number) => {
                        const Icon = icons[i % icons.length];
                        return (
                            <div key={i} className="flex gap-6 items-start">
                                <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center shrink-0">
                                    <Icon className="w-7 h-7 text-primary" />
                                </div>
                                <div>
                                    <h3 className="text-2xl font-bold text-slate-900 mb-3">{item.title}</h3>
                                    <p className="text-slate-600 text-lg leading-relaxed">{item.description}</p>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* CTA Section */}
            <div className="container mx-auto px-4 py-20">
                <div className="max-w-4xl mx-auto text-center bg-slate-50 p-12 md:p-16 rounded-[40px] shadow-sm border border-slate-100">
                    <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6">Join Us in Making a Difference</h2>
                    <p className="text-xl text-slate-600 mb-10 max-w-2xl mx-auto">Discover how your skills and passion can contribute to meaningful ethical projects.</p>
                    <Button asChild size="lg" className="px-10 py-6 text-lg rounded-full shadow-lg group">
                        <Link href={data.ctaLink || "/programs"} className="flex items-center gap-2">
                            {data.ctaText || "View Our Programs"}
                            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </Link>
                    </Button>
                </div>
            </div>
        </div>
    );
}
