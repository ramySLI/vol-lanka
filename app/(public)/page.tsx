import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { fetchProgramsREST } from "@/lib/firebase/firestore-rest";

const getProgramImage = (slug: string) => {
  if (slug.includes('turtle')) return '/images/programs/sea-turtle.png';
  if (slug.includes('elephant')) return '/images/programs/elephant.png';
  if (slug.includes('english')) return '/images/programs/rural-english.png';
  return '/images/programs/sea-turtle.png'; // fallback
};

export default async function Home() {
  const allPrograms = await fetchProgramsREST();
  const featuredPrograms = allPrograms.filter(p => p.featured).slice(0, 3);

  return (
    <>
      {/* Hero Section */}
      <section className="relative w-full py-20 md:py-32 lg:py-48 flex items-center justify-center overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/hero.png"
            alt="Beautiful Sri Lanka tea plantation at sunset with a train"
            fill
            className="object-cover object-center brightness-75"
            quality={100}
            priority
          />
        </div>

        {/* Hero Content */}
        <div className="container relative z-10 px-4 md:px-6">
          <div className="flex flex-col items-center space-y-6 text-center text-white">
            <div className="space-y-4 max-w-4xl drop-shadow-lg">
              <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
                Volunteer in Sri Lanka
              </h1>
              <p className="mx-auto max-w-[800px] text-lg sm:text-xl md:text-2xl font-medium text-white/90">
                Connect with meaningful volunteer opportunities. Experience the culture, make an impact, and create lifelong memories.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Button asChild size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90 text-lg px-8 py-6 rounded-full shadow-xl">
                <Link href="/programs">Find a Program!</Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="bg-white/10 text-white border-white/30 hover:bg-white/20 backdrop-blur-sm text-lg px-8 py-6 rounded-full shadow-xl">
                <Link href="/how-it-works">How it Works</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Programs Section */}
      <section className="w-full py-16 md:py-24 bg-slate-50">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl text-slate-900">Featured Programs</h2>
            <p className="mt-4 text-muted-foreground w-full max-w-2xl text-lg">Top-rated opportunities carefully vetted for maximum positive impact.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredPrograms.map((program) => (
              <div key={program.id} className="group flex flex-col rounded-2xl border bg-card text-card-foreground shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden transform hover:-translate-y-1">
                <div className="relative h-60 w-full overflow-hidden">
                  <Image
                    src={getProgramImage(program.slug)}
                    alt={program.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    quality={100}
                  />
                  <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-sm px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider text-slate-800 shadow-sm">
                    {program.category}
                  </div>
                </div>
                <div className="p-6 flex-1 flex flex-col">
                  <h3 className="text-xl font-bold leading-snug tracking-tight mb-3 line-clamp-2 text-slate-900 group-hover:text-primary transition-colors">{program.title}</h3>
                  <p className="text-sm text-muted-foreground mb-6 line-clamp-3 leading-relaxed flex-1">
                    {program.shortDescription}
                  </p>
                  <div className="flex items-center justify-between mt-auto pt-5 border-t border-slate-100">
                    <div className="flex flex-col">
                      <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1">Starts At</span>
                      <span className="font-bold text-xl text-slate-900">${program.pricing?.twoWeeks || 'N/A'}</span>
                    </div>
                    <Button asChild className="rounded-full px-6">
                      <Link href={`/programs/${program.slug}`}>View Details</Link>
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
