import { fetchPageContentREST } from "@/lib/firebase/firestore-rest";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Mail, Phone, MapPin, Send } from "lucide-react";

export default async function ContactPage() {
    const data = await fetchPageContentREST("contact") || {
        title: "Contact Us",
        subtitle: "Have questions about volunteering in Sri Lanka? We'd love to hear from you.",
        email: "hello@volunteerlanka.org",
        phone: "+94 11 234 5678",
        address: "123 Galle Road, Colombo 03, Sri Lanka"
    };

    return (
        <div className="bg-slate-50 min-h-screen pb-24">
            <div className="bg-primary/5 border-b border-primary/10">
                <div className="container mx-auto px-4 py-20 text-center max-w-4xl">
                    <h1 className="text-4xl md:text-5xl lg:text-7xl font-extrabold tracking-tight mb-6 text-slate-900">
                        {data.title}
                    </h1>
                    <p className="text-xl text-slate-600 leading-relaxed font-medium max-w-2xl mx-auto">
                        {data.subtitle}
                    </p>
                </div>
            </div>

            <div className="container mx-auto px-4 py-16 max-w-6xl">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
                    {/* Contact Info */}
                    <div className="space-y-12">
                        <div>
                            <h2 className="text-3xl font-bold mb-8 text-slate-900">Get in Touch</h2>
                            <p className="text-lg text-slate-600 mb-8 max-w-md leading-relaxed">
                                Whether you're ready to apply, have questions about a specific program, or want to partner with us, our team is ready to answer all your questions.
                            </p>
                        </div>

                        <div className="space-y-6">
                            <div className="flex items-center gap-6 bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                                <div className="w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center shrink-0">
                                    <Mail className="w-6 h-6 text-primary" />
                                </div>
                                <div>
                                    <p className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-1">Email Us</p>
                                    <a href={`mailto:${data.email}`} className="text-xl font-bold text-slate-900 hover:text-primary transition-colors">{data.email}</a>
                                </div>
                            </div>
                            <div className="flex items-center gap-6 bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                                <div className="w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center shrink-0">
                                    <Phone className="w-6 h-6 text-primary" />
                                </div>
                                <div>
                                    <p className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-1">Call Us</p>
                                    <a href={`tel:${data.phone}`} className="text-xl font-bold text-slate-900 hover:text-primary transition-colors">{data.phone}</a>
                                </div>
                            </div>
                            <div className="flex items-center gap-6 bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                                <div className="w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center shrink-0">
                                    <MapPin className="w-6 h-6 text-primary" />
                                </div>
                                <div>
                                    <p className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-1">Main Office</p>
                                    <p className="text-xl font-bold text-slate-900 leading-snug">{data.address}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Contact Form Placeholder */}
                    <div className="bg-white p-10 md:p-12 rounded-[40px] shadow-lg border border-slate-100">
                        <h3 className="text-2xl font-bold mb-8 text-slate-900">Send a Message</h3>
                        <form className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <Label className="text-slate-600">First Name</Label>
                                    <Input className="bg-slate-50 border-slate-200 h-12" placeholder="Jane" />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-slate-600">Last Name</Label>
                                    <Input className="bg-slate-50 border-slate-200 h-12" placeholder="Doe" />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label className="text-slate-600">Email Address</Label>
                                <Input type="email" className="bg-slate-50 border-slate-200 h-12" placeholder="jane@example.com" />
                            </div>
                            <div className="space-y-2">
                                <Label className="text-slate-600">Message</Label>
                                <Textarea className="bg-slate-50 border-slate-200 min-h-[160px] resize-none" placeholder="How can we help you?" />
                            </div>
                            <Button type="button" size="lg" className="w-full h-14 text-lg rounded-full mt-4">
                                <Send className="w-5 h-5 mr-3" />
                                Send Message
                            </Button>
                            <p className="text-xs text-center text-slate-400 mt-4">We typical reply within 24-48 business hours.</p>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}
