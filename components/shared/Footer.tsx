import Link from "next/link";

export function Footer() {
    return (
        <footer className="border-t bg-muted/50 pt-16 pb-8">
            <div className="container mx-auto px-4 md:px-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
                    <div className="space-y-4">
                        <h3 className="text-lg font-bold text-primary">VolunteerLanka</h3>
                        <p className="text-sm text-muted-foreground w-full md:w-3/4">
                            Connecting volunteers with meaningful, life-changing projects across Sri Lanka.
                        </p>
                    </div>
                    <div>
                        <h4 className="font-semibold mb-4">Discover</h4>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                            <li><Link href="/programs" className="hover:text-primary transition-colors">Programs</Link></li>
                            <li><Link href="/destinations" className="hover:text-primary transition-colors">Destinations</Link></li>
                            <li><Link href="/how-it-works" className="hover:text-primary transition-colors">How It Works</Link></li>
                            <li><Link href="/reviews" className="hover:text-primary transition-colors">Reviews</Link></li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="font-semibold mb-4">Support</h4>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                            <li><Link href="/faq" className="hover:text-primary transition-colors">FAQ</Link></li>
                            <li><Link href="/contact" className="hover:text-primary transition-colors">Contact Us</Link></li>
                            <li><Link href="/safety" className="hover:text-primary transition-colors">Safety</Link></li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="font-semibold mb-4">Legal</h4>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                            <li><Link href="/legal/terms" className="hover:text-primary transition-colors">Terms & Conditions</Link></li>
                            <li><Link href="/legal/privacy" className="hover:text-primary transition-colors">Privacy Policy</Link></li>
                            <li><Link href="/legal/cancellation" className="hover:text-primary transition-colors">Cancellation Policy</Link></li>
                        </ul>
                    </div>
                </div>
                <div className="pt-8 border-t text-center text-sm text-muted-foreground">
                    &copy; {new Date().getFullYear()} VolunteerLanka. All rights reserved.
                </div>
            </div>
        </footer>
    );
}
