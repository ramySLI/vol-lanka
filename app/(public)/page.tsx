import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <>
      {/* Hero Section */}
      <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48 bg-muted/30">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center space-y-4 text-center">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">
                Volunteer in Sri Lanka
              </h1>
              <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
                Connect with meaningful volunteer opportunities. Experience the culture, make an impact, and create lifelong memories.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button asChild size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90">
                <Link href="/programs">Find a Program</Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link href="/how-it-works">How it Works</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Programs Section */}
      <section className="w-full py-12 md:py-24 lg:py-32">
        <div className="container px-4 md:px-6">
          <h2 className="text-3xl font-bold tracking-tighter text-center mb-12">Featured Programs</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Program Card Placeholders */}
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex flex-col rounded-xl border bg-card text-card-foreground shadow">
                <div className="h-48 bg-muted rounded-t-xl w-full flex items-center justify-center">
                  <span className="text-muted-foreground">Image Placeholder</span>
                </div>
                <div className="p-6">
                  <h3 className="text-2xl font-semibold leading-none tracking-tight mb-2">Program Title {i}</h3>
                  <p className="text-sm text-muted-foreground mb-4">Brief description of the volunteer program and its impact on the local community.</p>
                  <div className="flex items-center justify-between">
                    <span className="font-bold">From $950</span>
                    <Button variant="outline" asChild>
                      <Link href={`/programs/sample-${i}`}>View Details</Link>
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
