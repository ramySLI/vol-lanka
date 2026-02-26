import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

async function seedHome() {
    const { adminDb } = await import('../lib/firebase/admin');
    console.log("Seeding home page content...");

    const homeData = {
        heroTitle: "Volunteer in Sri Lanka",
        heroSubtitle: "Connect with meaningful volunteer opportunities. Experience the culture, make an impact, and create lifelong memories.",
        heroImage: "/images/hero.png",
        featuredTitle: "Featured Programs",
        featuredSubtitle: "Top-rated opportunities carefully vetted for maximum positive impact."
    };
    try {
        await adminDb.collection("pages").doc("home").set(homeData);
        console.log("Seeded pages/home successfully.");

        console.log("Seeding admin list...");
        await adminDb.collection("admins").doc("VgDjrSqImwQcX4TBKUtH1gu8vbQ2").set({
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
            await adminDb.collection("programs").doc(prog.id).set({ images: prog.images }, { merge: true });
        }
        console.log("Updated programs with images successfully.");

    } catch (e) {
        console.error("Error seeding new data:", e);
    }
    process.exit(0);
}

seedHome();
