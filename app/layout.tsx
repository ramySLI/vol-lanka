import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/shared/Header";
import { Footer } from "@/components/shared/Footer";
import { AuthProvider } from "@/components/providers/AuthProvider";
import { fetchSettingsREST } from "@/lib/firebase/firestore-rest";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "VolunteerLanka - Meaningful Volunteering in Sri Lanka",
  description: "A volunteering platform connecting international travelers with meaningful volunteer opportunities in Sri Lanka.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const globalData = await fetchSettingsREST("global") || {
    footerDescription: "Connecting volunteers with meaningful, life-changing projects across Sri Lanka.",
    navigationMenu: {
      discover: [
        { label: "Programs", href: "/programs" },
        { label: "Destinations", href: "/destinations" },
        { label: "How It Works", href: "/how-it-works" },
        { label: "About Us", href: "/about" }
      ],
      support: [
        { label: "FAQ", href: "/faq" },
        { label: "Contact Us", href: "/contact" },
        { label: "Safety", href: "/safety" }
      ],
      legal: [
        { label: "Terms & Conditions", href: "/legal/terms" },
        { label: "Privacy Policy", href: "/legal/privacy" },
        { label: "Cancellation Policy", href: "/legal/cancellation" }
      ]
    }
  };

  return (
    <html lang="en">
      <body
        className={`${inter.variable} antialiased`}
      >
        <AuthProvider>
          <div className="flex min-h-screen flex-col">
            <Header navigationMenu={globalData.navigationMenu} />
            <main className="flex-1">
              {children}
            </main>
            <Footer data={globalData} />
          </div>
        </AuthProvider>
      </body>
    </html>
  );
}
