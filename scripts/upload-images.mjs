import { initializeApp } from "firebase/app";
import { getFirestore, doc, setDoc } from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import * as fs from 'fs';
import * as path from 'path';
import * as dotenv from 'dotenv';
import { fileURLToPath } from 'url';

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
const storage = getStorage(app);

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function uploadImages() {
    const uploads = [
        {
            localPath: path.resolve(__dirname, '../public/images/hero.png'),
            destPath: 'images/hero.png',
            collection: 'pages',
            docId: 'home',
            updateField: 'heroImage',
            isArray: false,
            mimeType: 'image/png'
        },
        {
            localPath: path.resolve(__dirname, '../public/images/programs/sea-turtle.png'),
            destPath: 'images/programs/sea-turtle.png',
            collection: 'programs',
            docId: 'sea-turtle-conservation',
            updateField: 'images',
            isArray: true,
            mimeType: 'image/png'
        },
        {
            localPath: path.resolve(__dirname, '../public/images/programs/rural-english.png'),
            destPath: 'images/programs/rural-english.png',
            collection: 'programs',
            docId: 'english-teaching',
            updateField: 'images',
            isArray: true,
            mimeType: 'image/png'
        },
        {
            localPath: path.resolve(__dirname, '../public/images/programs/elephant.png'),
            destPath: 'images/programs/elephant.png',
            collection: 'programs',
            docId: 'elephant-conservation',
            updateField: 'images',
            isArray: true,
            mimeType: 'image/png'
        }
    ];

    console.log("Starting image upload to Firebase Storage...");

    for (const item of uploads) {
        if (!fs.existsSync(item.localPath)) {
            console.warn(`File not found: ${item.localPath}. Skipping...`);
            continue;
        }

        const buffer = fs.readFileSync(item.localPath);
        const uint8Array = new Uint8Array(buffer);
        const storageRef = ref(storage, item.destPath);

        console.log(`Uploading ${item.localPath} to ${item.destPath}...`);

        try {
            await uploadBytes(storageRef, uint8Array, { contentType: item.mimeType });
            const downloadUrl = await getDownloadURL(storageRef);

            console.log(`Uploaded! URL: ${downloadUrl}`);

            // Update Firestore Document
            const docRef = doc(db, item.collection, item.docId);
            if (item.isArray) {
                await setDoc(docRef, { [item.updateField]: [downloadUrl] }, { merge: true });
            } else {
                await setDoc(docRef, { [item.updateField]: downloadUrl }, { merge: true });
            }
            console.log(`Updated Firestore document: ${item.collection}/${item.docId}`);

        } catch (error) {
            console.error(`Error uploading ${item.localPath}:`, error);
        }
    }

    console.log("All uploads complete!");
    process.exit(0);
}

uploadImages().catch(console.error);
