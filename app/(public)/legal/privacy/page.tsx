import { fetchPageContentREST } from "@/lib/firebase/firestore-rest";
import { notFound } from "next/navigation";

export default async function PrivacyPage() {
    const data = await fetchPageContentREST("privacy") || {
        title: "Privacy Policy",
        lastUpdated: "January 1, 2024",
        content: `
At VolunteerLanka, we take your privacy extremely seriously.

1. INFORMATION WE COLLECT
We only collect personal information such as your name, email, and travel documents when you explicitly provide them through our application forms.

2. HOW WE USE IT
Your data is strictly used for booking your flights, coordinating with local host families, and ensuring a safe volunteer environment for you in Sri Lanka.

3. DATA PROTECTION
We use industry-standard encryption protocols (SSL/TLS) to secure your data and do not sell your personal information to any third parties.

For questions about this policy, please reach out to our privacy officer via the contact page.
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
