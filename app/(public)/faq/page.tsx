import { fetchPageContentREST } from "@/lib/firebase/firestore-rest";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, HelpCircle } from "lucide-react";

export default async function FAQPage() {
    const data = await fetchPageContentREST("faq");

    if (!data) {
        notFound();
    }

    return (
        <div className="bg-slate-50 min-h-screen pb-24">
            <div className="bg-primary/5 border-b border-primary/10">
                <div className="container mx-auto px-4 py-20 text-center max-w-3xl">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary font-medium text-sm mb-6">
                        <HelpCircle className="w-4 h-4" />
                        <span>Support</span>
                    </div>
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight mb-6 text-slate-900">
                        {data.title}
                    </h1>
                    <p className="text-xl text-slate-600 leading-relaxed font-medium">
                        {data.subtitle}
                    </p>
                </div>
            </div>

            <div className="container mx-auto px-4 py-16 max-w-4xl">
                <div className="space-y-6">
                    {data.faqs?.map((faq: any, index: number) => (
                        <div key={index} className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
                            <h3 className="text-2xl font-bold text-slate-900 mb-4 flex items-start gap-4">
                                <span className="text-primary font-black opacity-30 mt-1">Q.</span>
                                {faq.question}
                            </h3>
                            <p className="text-lg text-slate-600 leading-relaxed pl-10 md:pl-12">
                                {faq.answer}
                            </p>
                        </div>
                    ))}
                </div>

                <div className="mt-20 text-center bg-white p-12 rounded-3xl shadow-sm border border-slate-100">
                    <h2 className="text-3xl font-bold text-slate-900 mb-6">Still have questions?</h2>
                    <p className="text-slate-600 mb-8 max-w-xl mx-auto text-lg">We're always here to help. Explore our programs or reach out to our team directly.</p>
                    <Button asChild size="lg" className="px-8 py-6 text-lg rounded-full shadow-lg group">
                        <Link href={data.ctaLink || "/programs"} className="flex items-center gap-2">
                            {data.ctaText || "Explore Programs"}
                            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </Link>
                    </Button>
                </div>
            </div>
        </div>
    );
}
