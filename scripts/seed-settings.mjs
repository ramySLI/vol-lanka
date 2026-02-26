import { initializeApp } from "firebase/app";
import { getFirestore, doc, setDoc } from "firebase/firestore";
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const globalSettings = {
    contactEmail: "hello@volunteerlanka.org",
    contactPhone: "+94 11 234 5678",
    footerDescription: "Connecting volunteers with meaningful, life-changing projects across Sri Lanka.",
    navigationMenu: {
        discover: [
            { label: "Programs", href: "/programs" },
            { label: "Destinations", href: "/destinations" },
            { label: "How It Works", href: "/how-it-works" },
            { label: "Reviews", href: "/reviews" }
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

async function seedSettings() {
    console.log("Seeding global settings...");
    try {
        await setDoc(doc(db, "settings", "global"), globalSettings);
        console.log("Seeded settings/global successfully.");
    } catch (e) {
        console.error("Error seeding new data:", e);
    }
    process.exit(0);
}

seedSettings();
