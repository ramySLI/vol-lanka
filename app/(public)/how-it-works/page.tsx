import { Button } from "@/components/ui/button";
import { fetchPageContentREST } from "@/lib/firebase/firestore-rest";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowRight, Sparkles, CheckCircle2 } from "lucide-react";

export default async function HowItWorksPage() {
    const data = await fetchPageContentREST("how-it-works");

    if (!data) {
        notFound();
    }

    return (
        <div className="bg-slate-50 min-h-screen pb-24">
            <div className="bg-primary/5 border-b border-primary/10">
                <div className="container mx-auto px-4 py-20 text-center max-w-3xl">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary font-medium text-sm mb-6">
                        <Sparkles className="w-4 h-4" />
                        <span>Simple Process</span>
                    </div>
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight mb-6 text-slate-900">
                        {data.title}
                    </h1>
                    <p className="text-xl text-slate-600 leading-relaxed font-medium">
                        {data.subtitle}
                    </p>
                </div>
            </div>

            <div className="container mx-auto px-4 py-16 max-w-5xl">
                <div className="space-y-12">
                    {data.steps?.map((step: { number: string; tag: string; title: string; description: string }, index: number) => (
                        <div key={index} className="group flex flex-col md:flex-row gap-8 md:gap-12 items-start relative bg-white p-8 md:p-10 rounded-3xl shadow-sm border border-slate-100 hover:shadow-xl transition-all duration-500 hover:-translate-y-1">
                            <div className="md:w-1/3 flex flex-col relative z-10">
                                <span className="text-6xl font-black text-slate-100 group-hover:text-primary/10 transition-colors absolute -top-8 -left-4 md:-top-10 md:-left-6 z-0 pointer-events-none select-none">
                                    {step.number}
                                </span>
                                <div className="text-sm font-bold text-primary tracking-widest uppercase mb-3 relative z-10 flex items-center gap-2">
                                    <div className="w-8 h-1 bg-primary rounded-full"></div>
                                    {step.tag}
                                </div>
                                <h3 className="text-2xl font-bold text-slate-900 relative z-10 leading-snug">
                                    {step.title}
                                </h3>
                            </div>
                            <div className="md:w-2/3 relative z-10">
                                <p className="text-lg text-slate-600 leading-relaxed">
                                    {step.description}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="mt-20 text-center bg-white p-12 rounded-3xl shadow-sm border border-slate-100 flex flex-col items-center">
                    <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-6">
                        <CheckCircle2 className="w-8 h-8 text-primary" />
                    </div>
                    <h2 className="text-3xl font-bold text-slate-900 mb-4">Ready to Begin?</h2>
                    <p className="text-slate-600 mb-8 max-w-xl text-lg">We are here to support you at every stage, offering authentic and ethical experiences in Sri Lanka.</p>
                    <Button asChild size="lg" className="px-8 py-6 text-lg rounded-full shadow-lg group">
                        <Link href={data.ctaLink || "/programs"} className="flex items-center gap-2">
                            {data.ctaText || "Start Exploring"}
                            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </Link>
                    </Button>
                </div>
            </div>
        </div>
    );
}
