import ApplicationForm from "@/components/forms/application/ApplicationForm";

interface PageProps {
    params: { programId: string };
    searchParams: { duration?: string; start?: string };
}

export default async function ApplicationPage({ params, searchParams }: PageProps) {
    // Await the params and searchParams locally due to Next.js strict mode rendering (15+)
    const p = await params;
    const s = await searchParams;

    const duration = parseInt(s.duration || "2", 10) as 2 | 4;
    const startDate = s.start || new Date().toISOString();

    // In a real application, we would fetch the program details here and validate availability.
    // const program = await getProgramById(p.programId);

    return (
        <div className="min-h-screen bg-muted/20">
            <div className="bg-primary text-primary-foreground py-8 mb-8">
                <div className="container mx-auto px-4">
                    <h1 className="text-3xl font-bold tracking-tight">Complete your Application</h1>
                    <p className="opacity-90 mt-2">Program: Sea Turtle Conservation ({duration} Weeks)</p>
                    <p className="opacity-90 text-sm">Target Start: {new Date(startDate).toLocaleDateString()}</p>
                </div>
            </div>

            <div className="container mx-auto px-4 pb-24">
                <ApplicationForm
                    programId={p.programId}
                    duration={duration}
                    startDate={startDate}
                />
            </div>
        </div>
    );
}
