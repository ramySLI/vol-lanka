import { fetchPageContentREST } from "@/lib/firebase/firestore-rest";
import { notFound } from "next/navigation";

export default async function TermsPage() {
    const data = await fetchPageContentREST("terms") || {
        title: "Terms and Conditions",
        lastUpdated: "January 1, 2024",
        content: `
Welcome to VolunteerLanka. By exploring our website and booking programs, you agree to these fundamental terms.

1. AGREEMENT TO TERMS
These Terms constitute a legally binding agreement made between you, whether personally or on behalf of an entity ("you") and VolunteerLanka.

2. VOLUNTEER REQUIREMENTS
All volunteers must be at least 18 years old unless accompanied by a responsible adult, and must maintain valid travel insurance for the duration of their placement.

3. BOOKINGS AND PAYMENTS
Your placement is only confirmed after receiving the initial program deposit. Full payments must be completed 30 days before arrival.

4. HEALTH AND SAFETY
Volunteers are personally responsible for their own health and must consult a doctor regarding any necessary vaccinations before traveling.

Please read these terms carefully before applying. We reserve the right to refuse service to anyone for any reason at any time.
        `
    };

    return (
        <div className="bg-slate-50 min-h-screen pb-24">
            <div className="bg-primary/5 border-b border-primary/10">
                <div className="container mx-auto px-4 py-20 text-center max-w-4xl">
                    <h1 className="text-4xl md:text-5xl lg:text-7xl font-extrabold tracking-tight mb-6 text-slate-900">
                        {data.title}
                    </h1>
                    <p className="text-lg text-slate-500 font-medium">Last Updated: {data.lastUpdated}</p>
                </div>
            </div>

            <div className="container mx-auto px-4 py-16 max-w-4xl">
                <div className="bg-white p-10 md:p-16 rounded-[40px] shadow-sm border border-slate-100 prose prose-slate prose-lg max-w-none">
                    <div dangerouslySetInnerHTML={{ __html: data.content.replace(/\n\n/g, '<br/><br/>').replace(/\n/g, '<br/>') }} />
                </div>
            </div>
        </div>
    );
}
