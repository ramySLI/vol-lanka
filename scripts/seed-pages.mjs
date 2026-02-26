import { initializeApp } from "firebase/app";
import { getFirestore, doc, setDoc, getDoc } from "firebase/firestore";
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

const seedData = {
    destinations: {
        title: "Explore Sri Lanka",
        subtitle: "Discover the diverse environments where our meaningful volunteer projects take place.",
        locations: [
            {
                name: "Colombo",
                description: "Experience the vibrant heart of Sri Lanka. Volunteer in leading local schools and community centers while enjoying the bustling city life.",
                image: "/images/hero.png"
            },
            {
                name: "Kandy",
                description: "Immerse yourself in history and culture. Support local initiatives nestled among the hills and tea plantations of the cultural capital.",
                image: "/images/hero.png"
            },
            {
                name: "Galle",
                description: "Work near beautiful coastlines and historic forts. Help coastal communities and participate in marine conservation projects.",
                image: "/images/hero.png"
            }
        ]
    },
    contact: {
        title: "Contact Us",
        subtitle: "Have questions about volunteering in Sri Lanka? We'd love to hear from you.",
        email: "hello@volunteerlanka.org",
        phone: "+94 11 234 5678",
        address: "123 Galle Road, Colombo 03, Sri Lanka"
    },
    safety: {
        title: "Your Safety is Our Priority",
        subtitle: "We take comprehensive measures to ensure a secure, healthy, and supportive environment for all volunteers in Sri Lanka.",
        measures: [
            {
                title: "24/7 In-Country Support",
                description: "Our local team is available around the clock to assist you with any emergencies or concerns you might have during your placement."
            },
            {
                title: "Vetted Placements",
                description: "All our partner organizations and host families undergo strict vetting procedures and regular safety audits."
            },
            {
                title: "Comprehensive Orientations",
                description: "Upon arrival, all volunteers receive a detailed safety, cultural, and project orientation to prepare them for their stay."
            },
            {
                title: "Emergency Protocols",
                description: "We have established emergency response protocols with local authorities and medical facilities across all our program locations."
            }
        ]
    },
    terms: {
        title: "Terms and Conditions",
        lastUpdated: "January 1, 2024",
        content: "Welcome to VolunteerLanka. By exploring our website and booking programs, you agree to these fundamental terms.\n\n1. AGREEMENT TO TERMS\nThese Terms constitute a legally binding agreement made between you, whether personally or on behalf of an entity (\"you\") and VolunteerLanka.\n\n2. VOLUNTEER REQUIREMENTS\nAll volunteers must be at least 18 years old unless accompanied by a responsible adult, and must maintain valid travel insurance for the duration of their placement.\n\n3. BOOKINGS AND PAYMENTS\nYour placement is only confirmed after receiving the initial program deposit. Full payments must be completed 30 days before arrival.\n\n4. HEALTH AND SAFETY\nVolunteers are personally responsible for their own health and must consult a doctor regarding any necessary vaccinations before traveling.\n\nPlease read these terms carefully before applying. We reserve the right to refuse service to anyone for any reason at any time."
    },
    privacy: {
        title: "Privacy Policy",
        lastUpdated: "January 1, 2024",
        content: "At VolunteerLanka, we take your privacy extremely seriously.\n\n1. INFORMATION WE COLLECT\nWe only collect personal information such as your name, email, and travel documents when you explicitly provide them through our application forms.\n\n2. HOW WE USE IT\nYour data is strictly used for booking your flights, coordinating with local host families, and ensuring a safe volunteer environment for you in Sri Lanka.\n\n3. DATA PROTECTION\nWe use industry-standard encryption protocols (SSL/TLS) to secure your data and do not sell your personal information to any third parties.\n\nFor questions about this policy, please reach out to our privacy officer via the contact page."
    },
    cancellation: {
        title: "Cancellation Policy",
        lastUpdated: "January 1, 2024",
        content: "We understand that plans can change. Here is our straightforward cancellation and refund protocol.\n\n1. REGISTRATION FEE\nThe initial $250 registration fee is 100% strictly non-refundable under any circumstance as it covers our immediate administration costs.\n\n2. PROGRAM FEE REFUNDS\n- Cancelled 60+ days before your start date: 100% refund of program fees\n- Cancelled 30-59 days before your start date: 50% refund of program fees\n- Cancelled less than 30 days before your start date: 0% refund of program fees\n\n3. PROGRAM DATE CHANGES\nYou can change your start date entirely for free if you notify us at least 30 days before your original program start date."
    }
};

async function seedPages() {
    console.log("Seeding base page content into Firestore...");
    try {
        for (const [key, value] of Object.entries(seedData)) {
            const docRef = doc(db, "pages", key);
            const snapshot = await getDoc(docRef);
            if (!snapshot.exists() || Object.keys(snapshot.data()).length === 0) {
                await setDoc(docRef, value);
                console.log(`Seeded 'pages/${key}' successfully.`);
            } else {
                console.log(`Skipped 'pages/${key}' because document already exists.`);
            }
        }
        console.log("Database successfully seeded!");
    } catch (e) {
        console.error("Error seeding new data:", e);
    }
    process.exit(0);
}

seedPages();
