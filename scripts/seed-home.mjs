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

const homeData = {
    heroTitle: "Volunteer in Sri Lanka",
    heroSubtitle: "Connect with meaningful volunteer opportunities. Experience the culture, make an impact, and create lifelong memories.",
    heroImage: "/images/hero.png",
    featuredTitle: "Featured Programs",
    featuredSubtitle: "Top-rated opportunities carefully vetted for maximum positive impact."
};

async function seedHome() {
    console.log("Seeding home page content...");
    try {
        await setDoc(doc(db, "pages", "home"), homeData);
        console.log("Seeded pages/home successfully.");

        console.log("Seeding admin list...");
        await setDoc(doc(db, "admins", "VgDjrSqImwQcX4TBKUtH1gu8vbQ2"), {
            role: "admin",
            createdAt: new Date().toISOString()
        });
        console.log("Seeded admins/VgDjrSqImwQcX4TBKUtH1gu8vbQ2 successfully.");

        // Also update the programs to have image fields corresponding to their slugs
        const programs = [
            { id: "sea-turtle-conservation", images: ["/images/programs/sea-turtle.png"] },
            { id: "english-teaching", images: ["/images/programs/rural-english.png"] },
            { id: "elephant-conservation", images: ["/images/programs/elephant.png"] }
        ];

        for (const prog of programs) {
            await setDoc(doc(db, "programs", prog.id), { images: prog.images }, { merge: true });
        }
        console.log("Updated programs with images successfully.");

    } catch (e) {
        console.error("Error seeding new data:", e);
    }
    process.exit(0);
}

seedHome();
