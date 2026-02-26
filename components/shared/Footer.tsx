/* eslint-disable @typescript-eslint/no-explicit-any */
import Link from "next/link";
import { Facebook, Instagram } from "lucide-react";

interface FooterProps {
    data?: any;
}

export function Footer({ data }: FooterProps) {
    const discoverLinks = data?.navigationMenu?.discover || [];
    const supportLinks = data?.navigationMenu?.support || [];
    const legalLinks = data?.navigationMenu?.legal || [];

    return (
        <footer className="border-t bg-muted/50 pt-16 pb-8">
            <div className="container mx-auto px-4 md:px-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
                    <div className="space-y-4">
                        <h3 className="text-lg font-bold text-primary">VolunteerLanka</h3>
                        <p className="text-sm text-muted-foreground w-full md:w-3/4">
                            {data?.footerDescription || "Connecting volunteers with meaningful, life-changing projects across Sri Lanka."}
                        </p>
                        <div className="pt-2 space-y-1">
                            {data?.contactEmail && (
                                <p className="text-sm text-foreground font-medium flex items-center gap-2">
                                    <span className="text-muted-foreground">Email:</span>
                                    <a href={`mailto:${data.contactEmail}`} className="hover:text-primary transition-colors">{data.contactEmail}</a>
                                </p>
                            )}
                            {data?.contactPhone && (
                                <p className="text-sm text-foreground font-medium flex items-center gap-2">
                                    <span className="text-muted-foreground">Phone:</span>
                                    <a href={`tel:${data.contactPhone}`} className="hover:text-primary transition-colors">{data.contactPhone}</a>
                                </p>
                            )}
                        </div>
                    </div>
                    <div>
                        <h4 className="font-semibold mb-4">Discover</h4>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                            {discoverLinks.map((link: any) => (
                                <li key={link.href}><Link href={link.href} className="hover:text-primary transition-colors">{link.label}</Link></li>
                            ))}
                        </ul>
                    </div>
                    <div>
                        <h4 className="font-semibold mb-4">Support</h4>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                            {supportLinks.map((link: any) => (
                                <li key={link.href}><Link href={link.href} className="hover:text-primary transition-colors">{link.label}</Link></li>
                            ))}
                        </ul>
                    </div>
                    <div>
                        <h4 className="font-semibold mb-4">Legal</h4>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                            {legalLinks.map((link: any) => (
                                <li key={link.href}><Link href={link.href} className="hover:text-primary transition-colors">{link.label}</Link></li>
                            ))}
                        </ul>
                    </div>
                </div>
                <div className="pt-8 border-t flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
                    <div>
                        &copy; {new Date().getFullYear()} VolunteerLanka. All rights reserved.
                    </div>
                    <div className="flex items-center gap-4">
                        {data?.socialLinks?.facebook && (
                            <a href={data.socialLinks.facebook} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors">
                                <span className="sr-only">Facebook</span>
                                <Facebook className="w-5 h-5" />
                            </a>
                        )}
                        {data?.socialLinks?.instagram && (
                            <a href={data.socialLinks.instagram} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors">
                                <span className="sr-only">Instagram</span>
                                <Instagram className="w-5 h-5" />
                            </a>
                        )}
                    </div>
                </div>
            </div>
        </footer>
    );
}
