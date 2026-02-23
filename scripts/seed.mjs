import { initializeApp } from "firebase/app";
import { getFirestore, collection, doc, setDoc } from "firebase/firestore";
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

const programs = [
    {
        slug: "sea-turtle-conservation",
        title: "Sea Turtle Conservation Program",
        category: "conservation",
        destinationId: "galle",
        pricing: {
            twoWeeks: 950,
            fourWeeks: 1650,
        },
        durationOptions: [2, 4],
        shortDescription: "Protect endangered sea turtles and assist with hatching and coastal conservation.",
        fullDescription: "Join our critical conservation efforts along the southern coast of Sri Lanka. You will work hands-on with local marine biologists to protect nesting sites, care for injured turtles in our rehabilitation center, and help guide newly hatched turtles to the ocean safely.",
        schedule: [
            { day: 1, activity: "Arrival in Colombo, transfer to Galle, orientation and beach safety walk." },
            { day: 2, activity: "Introduction to the hatchery, cleaning tanks, and feeding injured turtles." },
            { day: 3, activity: "Morning beach patrol for nesting sites. Afternoon community beach cleanup." },
            { day: 4, activity: "Data collection on turtle populations and nest monitoring." },
            { day: 5, activity: "Night patrol for nesting mothers (weather permitting)." },
            { day: 6, activity: "Free day to explore Galle Fort or relax on Unawatuna beach." },
            { day: 7, activity: "Free day for independent travel or local excursions." }
        ],
        included: [
            "Airport Pick-up & Drop-off",
            "Shared Accommodation (Volunteer House)",
            "3 Meals a Day (Local Cuisine)",
            "24/7 In-Country Support",
            "Orientation & Training",
            "Project Equipment"
        ],
        notIncluded: [
            "Flights & Visas",
            "Travel Insurance",
            "Personal Spending Money",
            "Weekend Excursions"
        ],
        requirements: {
            ageRange: "18+",
            skills: ["Basic swimming ability", "Passion for marine life", "Ability to work outdoors in tropical climate"]
        },
        accommodation: {
            type: "Volunteer House",
            description: "Shared dormitory-style rooms (4-6 people) with fans and basic amenities, located 5 minutes from the beach."
        },
        images: ["/placeholder.jpg"], // We can replace these with actual image URLs later
        rating: 4.8,
        reviewCount: 124,
        maxParticipants: 15,
        status: "active",
        featured: true,
        createdAt: new Date(),
        updatedAt: new Date()
    },
    {
        slug: "english-teaching",
        title: "Rural English Teaching",
        category: "education",
        destinationId: "kandy",
        pricing: {
            twoWeeks: 850,
            fourWeeks: 1450,
        },
        durationOptions: [2, 4],
        shortDescription: "Empower local children in rural schools by teaching English and basic IT skills.",
        fullDescription: "Education is a powerful tool for upward mobility in Sri Lanka. As a volunteer teacher, you will assist local staff in rural schools around the cultural capital of Kandy. You'll lead conversational English classes, help with basic computer literacy, and organize after-school sports or arts activities.",
        schedule: [
            { day: 1, activity: "Arrival, transfer to Kandy, welcome dinner with local host family." },
            { day: 2, activity: "School orientation, meeting the principal, and observing classes." },
            { day: 3, activity: "Assisting teachers and leading conversational English groups." },
            { day: 4, activity: "Lesson planning and teaching primary classes." },
            { day: 5, activity: "Organizing Friday afternoon sports/arts activities for the students." },
            { day: 6, activity: "Free day - Recommended visit to the Temple of the Tooth." },
            { day: 7, activity: "Free day - Hike in the Knuckles Mountain Range." }
        ],
        included: [
            "Airport Pick-up & Drop-off",
            "Homestay Accommodation",
            "3 Meals a Day (Homecooked)",
            "24/7 In-Country Support",
            "Teaching Materials",
            "Transport to School"
        ],
        notIncluded: [
            "Flights & Visas",
            "Travel Insurance",
            "Personal Spending Money",
            "Weekend Excursions"
        ],
        requirements: {
            ageRange: "18+",
            skills: ["Fluent English", "Patience and enthusiasm", "Respect for local culture"]
        },
        accommodation: {
            type: "Homestay",
            description: "Live with a welcoming local family in Kandy. Private or shared twin room with authentic local meals provided."
        },
        images: ["/placeholder.jpg"],
        rating: 4.9,
        reviewCount: 89,
        maxParticipants: 10,
        status: "active",
        featured: true,
        createdAt: new Date(),
        updatedAt: new Date()
    },
    {
        slug: "elephant-conservation",
        title: "Wild Elephant Conservation",
        category: "conservation",
        destinationId: "minneriya",
        pricing: {
            twoWeeks: 1100,
            fourWeeks: 1850,
        },
        durationOptions: [2, 4],
        shortDescription: "Help mitigate human-elephant conflict and monitor wild herds in central Sri Lanka.",
        fullDescription: "Work alongside local conservationists to protect Sri Lanka's iconic wild elephants. Your tasks will include observing elephant behavior, tracking herd movements, maintaining protective fencing, and engaging with local farmers to implement peaceful coexistence strategies.",
        schedule: [
            { day: 1, activity: "Arrival, transfer to the research camp, health and safety briefing." },
            { day: 2, activity: "Introduction to tracking techniques and human-elephant conflict." },
            { day: 3, activity: "Field observation from tree huts and data logging." },
            { day: 4, activity: "Assisting local farmers with cultivating elephant-deterrent crops (e.g., citrus)." },
            { day: 5, activity: "Community education outreach at the local village center." },
            { day: 6, activity: "Free day - Safari in Minneriya National Park." },
            { day: 7, activity: "Free day - Visit the ancient ruins of Polonnaruwa." }
        ],
        included: [
            "Airport Pick-up & Drop-off",
            "Jungle Camp Accommodation",
            "3 Meals a Day",
            "24/7 In-Country Support",
            "Field Training",
            "Transport during project activities"
        ],
        notIncluded: [
            "Flights & Visas",
            "Travel Insurance",
            "Personal Spending Money",
            "National Park entrance fees for free time"
        ],
        requirements: {
            ageRange: "18+",
            skills: ["Good physical fitness", "Ability to live in basic conditions", "Interest in wildlife tracking"]
        },
        accommodation: {
            type: "Eco-Camp",
            description: "Basic but comfortable eco-lodges near the national park. Communal dining area and shared bathroom facilities."
        },
        images: ["/placeholder.jpg"],
        rating: 4.7,
        reviewCount: 215,
        maxParticipants: 8,
        status: "active",
        featured: true,
        createdAt: new Date(),
        updatedAt: new Date()
    }
];

async function seed() {
    console.log("Seeding programs...");
    for (const program of programs) {
        try {
            await setDoc(doc(collection(db, "programs"), program.slug), program);
            console.log(`Seeded program: ${program.title}`);
        } catch (e) {
            console.error("Error seeding program", program.title, e);
        }
    }
    console.log("Done!");
    process.exit(0);
}

seed();
