import { fetchPageContentREST } from "@/lib/firebase/firestore-rest";
import { notFound } from "next/navigation";

export default async function CancellationPage() {
    const data = await fetchPageContentREST("cancellation") || {
        title: "Cancellation Policy",
        lastUpdated: "January 1, 2024",
        content: `
We understand that plans can change. Here is our straightforward cancellation and refund protocol.

1. REGISTRATION FEE
The initial $250 registration fee is 100% strictly non-refundable under any circumstance as it covers our immediate administration costs.

2. PROGRAM FEE REFUNDS
- Cancelled 60+ days before your start date: 100% refund of program fees
- Cancelled 30-59 days before your start date: 50% refund of program fees
- Cancelled less than 30 days before your start date: 0% refund of program fees

3. PROGRAM DATE CHANGES
You can change your start date entirely for free if you notify us at least 30 days before your original program start date.
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
