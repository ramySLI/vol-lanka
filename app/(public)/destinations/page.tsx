import { fetchPageContentREST } from "@/lib/firebase/firestore-rest";
import { notFound } from "next/navigation";
import Image from "next/image";
import { MapPin } from "lucide-react";

export default async function DestinationsPage() {
    const data = await fetchPageContentREST("destinations") || {
        title: "Explore Sri Lanka",
        subtitle: "Discover the diverse environments where our meaningful volunteer projects take place.",
        locations: [
            {
                name: "Colombo",
                description: "Experience the vibrant heart of Sri Lanka. Volunteer in leading local schools and community centers while enjoying the bustling city life.",
                image: "/images/hero.png"
            },
            {
                name: "Kandy",
                description: "Immerse yourself in history and culture. Support local initiatives nestled among the hills and tea plantations of the cultural capital.",
                image: "/images/hero.png"
            },
            {
                name: "Galle",
                description: "Work near beautiful coastlines and historic forts. Help coastal communities and participate in marine conservation projects.",
                image: "/images/hero.png"
            }
        ]
    };

    return (
        <div className="bg-slate-50 min-h-screen pb-24">
            <div className="bg-primary/5 border-b border-primary/10">
                <div className="container mx-auto px-4 py-20 text-center max-w-4xl">
                    <h1 className="text-4xl md:text-5xl lg:text-7xl font-extrabold tracking-tight mb-6 text-slate-900">
                        {data.title || "Explore Sri Lanka"}
                    </h1>
                    <p className="text-xl text-slate-600 leading-relaxed font-medium max-w-2xl mx-auto">
                        {data.subtitle || "Discover the diverse environments where our meaningful volunteer projects take place."}
                    </p>
                </div>
            </div>

            <div className="container mx-auto px-4 py-16 max-w-7xl">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {(data.locations || []).map((loc: { name: string; description: string; image: string }, index: number) => (
                        <div key={index} className="group rounded-3xl overflow-hidden bg-white shadow-sm border border-slate-100 hover:shadow-xl transition-all duration-500 hover:-translate-y-1">
                            <div className="relative h-64 w-full overflow-hidden">
                                <Image
                                    src={loc.image || "/images/hero.png"}
                                    alt={loc.name}
                                    fill
                                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 to-transparent"></div>
                                <div className="absolute bottom-6 left-6 flex items-center gap-2 text-white">
                                    <MapPin className="w-5 h-5 text-primary" />
                                    <h3 className="text-2xl font-bold">{loc.name}</h3>
                                </div>
                            </div>
                            <div className="p-8">
                                <p className="text-slate-600 leading-relaxed">
                                    {loc.description}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
