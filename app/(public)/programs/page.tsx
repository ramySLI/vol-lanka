import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Search } from "lucide-react";

// Mock data based on types/program.ts
const MOCK_PROGRAMS = [
    {
        id: "1",
        slug: "turtle-conservation-galle",
        title: "Sea Turtle Conservation",
        category: "conservation",
        destinationId: "galle",
        pricing: { twoWeeks: 950, fourWeeks: 1450 },
        durationOptions: [2, 4],
        shortDescription: "Help protect endangered sea turtles on the southern coast of Sri Lanka by monitoring beaches and rehabilitating injured turtles.",
        rating: 4.8,
        reviewCount: 124,
    },
    {
        id: "2",
        slug: "teaching-monks-kandy",
        title: "English Teaching for Monks",
        category: "education",
        destinationId: "kandy",
        pricing: { twoWeeks: 850, fourWeeks: 1250 },
        durationOptions: [2, 4, 8],
        shortDescription: "Teach conversational English to young monks in ancient monasteries around the cultural capital of Kandy.",
        rating: 4.9,
        reviewCount: 89,
    },
    {
        id: "3",
        slug: "medical-internship-colombo",
        title: "Medical & Healthcare Internship",
        category: "medical",
        destinationId: "colombo",
        pricing: { twoWeeks: 1150, fourWeeks: 1850 },
        durationOptions: [2, 4],
        shortDescription: "Gain hands-on clinical experience shadowing local doctors in busy urban hospitals and rural clinics.",
        rating: 4.7,
        reviewCount: 215,
    }
];

export default function ProgramsListingPage() {
    return (
        <div className="container mx-auto px-4 py-12 md:py-16">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
                <div>
                    <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-2">Volunteer Programs</h1>
                    <p className="text-muted-foreground text-lg">
                        Discover meaningful opportunities across Sri Lanka.
                    </p>
                </div>

                <div className="relative w-full md:w-72">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Search programs..."
                        className="pl-10 h-11"
                    />
                </div>
            </div>

            <div className="flex flex-col md:flex-row gap-8">
                {/* Filters Sidebar */}
                <aside className="w-full md:w-64 shrink-0 space-y-6">
                    <div className="space-y-3">
                        <h3 className="font-semibold text-lg">Category</h3>
                        <div className="space-y-2">
                            {['All', 'Conservation', 'Education', 'Community', 'Medical'].map((cat) => (
                                <div key={cat} className="flex items-center gap-2">
                                    <input type="checkbox" id={`cat-${cat}`} className="rounded text-primary focus:ring-primary w-4 h-4" />
                                    <label htmlFor={`cat-${cat}`} className="text-sm cursor-pointer">{cat}</label>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="space-y-3">
                        <h3 className="font-semibold text-lg">Duration</h3>
                        <div className="flex flex-wrap gap-2">
                            {['1-2 Weeks', '3-4 Weeks', '1+ Months'].map((dur) => (
                                <span key={dur} className="px-3 py-1 border rounded-full text-sm hover:bg-muted cursor-pointer transition-colors">
                                    {dur}
                                </span>
                            ))}
                        </div>
                    </div>
                </aside>

                {/* Program Grid */}
                <div className="flex-1 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                    {MOCK_PROGRAMS.map((program) => (
                        <Card key={program.id} className="flex flex-col overflow-hidden hover:shadow-md transition-shadow">
                            <div className="h-48 bg-muted relative">
                                {/* Placeholder for Image component */}
                                <div className="absolute inset-0 flex items-center justify-center text-muted-foreground bg-slate-200">
                                    Image: {program.title}
                                </div>
                                <div className="absolute top-3 left-3 bg-white/90 px-2 py-1 rounded text-xs font-semibold capitalize">
                                    {program.category}
                                </div>
                            </div>
                            <CardHeader className="p-5 pb-2">
                                <CardTitle className="text-xl line-clamp-2">{program.title}</CardTitle>
                                <div className="flex items-center gap-2 text-sm text-muted-foreground mt-2">
                                    <span>★ {program.rating} ({program.reviewCount} reviews)</span>
                                    <span>•</span>
                                    <span className="capitalize">{program.destinationId}</span>
                                </div>
                            </CardHeader>
                            <CardContent className="p-5 pt-2 flex-grow">
                                <p className="text-sm text-muted-foreground line-clamp-3">
                                    {program.shortDescription}
                                </p>
                                <div className="mt-4 flex flex-wrap gap-2">
                                    {program.durationOptions.map(dur => (
                                        <span key={dur} className="text-xs bg-muted px-2 py-1 rounded">
                                            {dur} weeks
                                        </span>
                                    ))}
                                </div>
                            </CardContent>
                            <CardFooter className="p-5 pt-0 flex justify-between items-center bg-gray-50 mt-auto border-t">
                                <div className="flex flex-col">
                                    <span className="text-xs text-muted-foreground uppercase">From</span>
                                    <span className="font-bold text-lg">${program.pricing.twoWeeks}</span>
                                </div>
                                <Button asChild>
                                    <Link href={`/programs/${program.slug}`}>View Details</Link>
                                </Button>
                            </CardFooter>
                        </Card>
                    ))}
                </div>
            </div>
        </div>
    );
}
