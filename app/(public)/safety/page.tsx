import { fetchPageContentREST } from "@/lib/firebase/firestore-rest";
import { notFound } from "next/navigation";
import { ShieldCheck, HeartPulse, ShieldAlert, PhoneCall } from "lucide-react";

export default async function SafetyPage() {
    const data = await fetchPageContentREST("safety") || {
        title: "Your Safety is Our Priority",
        subtitle: "We take comprehensive measures to ensure a secure, healthy, and supportive environment for all volunteers in Sri Lanka.",
        measures: [
            {
                title: "24/7 In-Country Support",
                description: "Our local team is available around the clock to assist you with any emergencies or concerns you might have during your placement."
            },
            {
                title: "Vetted Placements",
                description: "All our partner organizations and host families undergo strict vetting procedures and regular safety audits."
            },
            {
                title: "Comprehensive Orientations",
                description: "Upon arrival, all volunteers receive a detailed safety, cultural, and project orientation to prepare them for their stay."
            },
            {
                title: "Emergency Protocols",
                description: "We have established emergency response protocols with local authorities and medical facilities across all our program locations."
            }
        ]
    };

    return (
        <div className="bg-slate-50 min-h-screen pb-24">
            <div className="bg-primary/5 border-b border-primary/10">
                <div className="container mx-auto px-4 py-20 text-center max-w-4xl">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-8 border-4 border-white shadow-sm">
                        <ShieldCheck className="w-8 h-8 text-primary" />
                    </div>
                    <h1 className="text-4xl md:text-5xl lg:text-7xl font-extrabold tracking-tight mb-6 text-slate-900">
                        {data.title}
                    </h1>
                    <p className="text-xl text-slate-600 leading-relaxed font-medium max-w-2xl mx-auto">
                        {data.subtitle}
                    </p>
                </div>
            </div>

            <div className="container mx-auto px-4 py-16 max-w-5xl">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
                    {(data.measures || []).map((measure: { title: string, description: string }, i: number) => {
                        const Icon = i % 4 === 0 ? HeartPulse : i % 4 === 1 ? ShieldCheck : i % 4 === 2 ? ShieldAlert : PhoneCall;
                        return (
                            <div key={i} className="bg-white p-10 rounded-3xl shadow-sm border border-slate-100 flex flex-col items-center text-center group hover:shadow-lg transition-all duration-300">
                                <div className="w-20 h-20 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-300 group-hover:bg-primary/5 group-hover:border-primary/20">
                                    <Icon className="w-10 h-10 text-slate-900 group-hover:text-primary transition-colors duration-300" />
                                </div>
                                <h3 className="text-2xl font-bold text-slate-900 mb-4">{measure.title}</h3>
                                <p className="text-lg text-slate-600 leading-relaxed max-w-sm">
                                    {measure.description}
                                </p>
                            </div>
                        );
                    })}
                </div>

                <div className="mt-20 bg-primary text-primary-foreground p-12 rounded-[40px] text-center shadow-xl">
                    <h2 className="text-3xl font-bold mb-6">Need Immediate Assistance?</h2>
                    <p className="text-primary-foreground/80 mb-8 max-w-xl mx-auto text-lg">If you are currently in Sri Lanka and need urgent support, please contact our 24/7 emergency hotline immediately.</p>
                    <a href="tel:+94112345678" className="inline-flex items-center gap-3 bg-white text-primary font-bold px-10 py-5 rounded-full text-xl shadow-lg hover:bg-slate-50 transition-colors">
                        <PhoneCall className="w-6 h-6" />
                        +94 11 234 5678
                    </a>
                </div>
            </div>
        </div>
    );
}
