"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Search } from "lucide-react";
import { Program } from "@/types/program";

const getProgramImage = (slug: string) => {
    if (slug.includes('turtle')) return '/images/programs/sea-turtle.png';
    if (slug.includes('elephant')) return '/images/programs/elephant.png';
    if (slug.includes('english')) return '/images/programs/rural-english.png';
    return '/images/programs/sea-turtle.png'; // fallback
};

export function ProgramsClientList({ initialPrograms }: { initialPrograms: Program[] }) {
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

    // In our mock data and schema, duration options are numbers (weeks)
    // Here we're using some UI bins: '1-2 Weeks' -> [1,2], '3-4 Weeks' -> [3,4], '1+ Months' -> [5, 6, 8, etc]
    const [selectedDurations, setSelectedDurations] = useState<string[]>([]);

    const toggleCategory = (cat: string) => {
        const value = cat.toLowerCase();
        if (value === 'all') {
            setSelectedCategories([]);
            return;
        }

        setSelectedCategories(prev =>
            prev.includes(value) ? prev.filter(c => c !== value) : [...prev, value]
        );
    };

    const toggleDuration = (dur: string) => {
        setSelectedDurations(prev =>
            prev.includes(dur) ? prev.filter(d => d !== dur) : [...prev, dur]
        );
    };

    const filteredPrograms = useMemo(() => {
        return initialPrograms.filter(prog => {
            // Search Match
            if (searchQuery) {
                const searchLower = searchQuery.toLowerCase();
                const matchesTitle = prog.title.toLowerCase().includes(searchLower);
                const matchesDesc = prog.shortDescription?.toLowerCase().includes(searchLower) || false;
                const matchesDest = prog.destinationId.toLowerCase().includes(searchLower);
                if (!matchesTitle && !matchesDesc && !matchesDest) return false;
            }

            // Category Match
            if (selectedCategories.length > 0) {
                if (!selectedCategories.includes(prog.category.toLowerCase())) return false;
            }

            // Duration Match
            if (selectedDurations.length > 0) {
                const progDurs = prog.durationOptions || [];
                const matchesBin = progDurs.some(dur => {
                    if (selectedDurations.includes('1-2 Weeks') && dur <= 2) return true;
                    if (selectedDurations.includes('3-4 Weeks') && dur >= 3 && dur <= 4) return true;
                    if (selectedDurations.includes('1+ Months') && dur >= 5) return true;
                    return false;
                });
                if (!matchesBin) return false;
            }

            return true;
        });
    }, [initialPrograms, searchQuery, selectedCategories, selectedDurations]);

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
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
            </div>

            <div className="flex flex-col md:flex-row gap-8">
                {/* Filters Sidebar */}
                <aside className="w-full md:w-64 shrink-0 space-y-6">
                    <div className="space-y-3">
                        <h3 className="font-semibold text-lg">Category</h3>
                        <div className="space-y-2">
                            {['All', 'Conservation', 'Education', 'Community', 'Medical'].map((cat) => {
                                const val = cat.toLowerCase();
                                const isChecked = val === 'all' ? selectedCategories.length === 0 : selectedCategories.includes(val);
                                return (
                                    <div key={cat} className="flex items-center gap-2">
                                        <input
                                            type="checkbox"
                                            id={`cat-${cat}`}
                                            className="rounded text-primary focus:ring-primary w-4 h-4 cursor-pointer"
                                            checked={isChecked}
                                            onChange={() => toggleCategory(cat)}
                                        />
                                        <label htmlFor={`cat-${cat}`} className="text-sm cursor-pointer select-none">{cat}</label>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    <div className="space-y-3">
                        <h3 className="font-semibold text-lg">Duration</h3>
                        <div className="flex flex-wrap gap-2">
                            {['1-2 Weeks', '3-4 Weeks', '1+ Months'].map((dur) => {
                                const isSelected = selectedDurations.includes(dur);
                                return (
                                    <span
                                        key={dur}
                                        onClick={() => toggleDuration(dur)}
                                        className={`px-3 py-1 border rounded-full text-sm cursor-pointer transition-colors select-none ${isSelected ? 'bg-primary text-primary-foreground border-primary' : 'hover:bg-muted'
                                            }`}
                                    >
                                        {dur}
                                    </span>
                                )
                            })}
                        </div>
                    </div>
                </aside>

                {/* Program Grid */}
                <div className="flex-1">
                    {filteredPrograms.length === 0 ? (
                        <div className="text-center py-12 border rounded-xl bg-muted/20">
                            <p className="text-muted-foreground text-lg">No programs found matching your filters.</p>
                            <Button
                                variant="link"
                                onClick={() => {
                                    setSearchQuery("");
                                    setSelectedCategories([]);
                                    setSelectedDurations([]);
                                }}
                            >
                                Clear all filters
                            </Button>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                            {filteredPrograms.map((program) => (
                                <Card key={program.id} className="group flex flex-col overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                                    <div className="h-48 bg-muted relative overflow-hidden">
                                        <Image
                                            src={getProgramImage(program.slug)}
                                            alt={program.title}
                                            fill
                                            className="object-cover transition-transform duration-500 group-hover:scale-105"
                                            quality={100}
                                        />
                                        <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-sm px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider shadow-sm text-slate-800">
                                            {program.category.replace(/-/g, ' ')}
                                        </div>
                                    </div>
                                    <CardHeader className="p-5 pb-2">
                                        <CardTitle className="text-xl line-clamp-2">{program.title}</CardTitle>
                                        <div className="flex items-center gap-2 text-sm text-muted-foreground mt-2">
                                            <span>★ {program.rating} ({program.reviewCount} reviews)</span>
                                            <span>•</span>
                                            <span className="capitalize">{program.destinationId.replace(/-/g, ' ')}</span>
                                        </div>
                                    </CardHeader>
                                    <CardContent className="p-5 pt-2 flex-grow">
                                        <p className="text-sm text-muted-foreground line-clamp-3">
                                            {program.shortDescription}
                                        </p>
                                        <div className="mt-4 flex flex-wrap gap-2">
                                            {(program.durationOptions || []).map(dur => (
                                                <span key={dur} className="text-xs bg-muted px-2 py-1 rounded">
                                                    {dur} weeks
                                                </span>
                                            ))}
                                        </div>
                                    </CardContent>
                                    <CardFooter className="p-5 pt-0 flex justify-between items-center bg-gray-50 mt-auto border-t">
                                        <div className="flex flex-col">
                                            <span className="text-xs text-muted-foreground uppercase">From</span>
                                            <span className="font-bold text-lg">${program.pricing?.twoWeeks || 'N/A'}</span>
                                        </div>
                                        <Button asChild>
                                            <Link href={`/programs/${program.slug}`}>View Details</Link>
                                        </Button>
                                    </CardFooter>
                                </Card>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
