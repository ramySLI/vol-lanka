import * as dotenv from 'dotenv';
import * as fs from 'fs';
import * as path from 'path';
import * as crypto from 'crypto';

dotenv.config({ path: '.env.local' });

const TOKENS: Record<string, string> = {};

function getDownloadUrl(bucketName: string, destPath: string, token: string) {
    return `https://firebasestorage.googleapis.com/v0/b/${bucketName}/o/${encodeURIComponent(destPath)}?alt=media&token=${token}`;
}

async function uploadImages() {
    const { adminDb, adminStorage } = await import('../lib/firebase/admin');

    // Ensure bucket name is set
    const bucketName = process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET;
    if (!bucketName) {
        throw new Error("NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET is not set in .env.local");
    }

    const bucket = adminStorage.bucket(bucketName);

    const uploads = [
        {
            localPath: './public/images/hero.png',
            destPath: 'images/hero.png',
            docRef: adminDb.collection('pages').doc('home'),
            updateField: 'heroImage',
            isArray: false
        },
        {
            localPath: './public/images/programs/sea-turtle.png',
            destPath: 'images/programs/sea-turtle.png',
            docRef: adminDb.collection('programs').doc('sea-turtle-conservation'),
            updateField: 'images',
            isArray: true
        },
        {
            localPath: './public/images/programs/rural-english.png',
            destPath: 'images/programs/rural-english.png',
            docRef: adminDb.collection('programs').doc('english-teaching'),
            updateField: 'images',
            isArray: true
        },
        {
            localPath: './public/images/programs/elephant.png',
            destPath: 'images/programs/elephant.png',
            docRef: adminDb.collection('programs').doc('elephant-conservation'),
            updateField: 'images',
            isArray: true
        }
    ];

    console.log("Starting image upload to Firebase Storage...");

    for (const item of uploads) {
        const fullLocalPath = path.resolve(item.localPath);
        if (!fs.existsSync(fullLocalPath)) {
            console.warn(`File not found: ${item.localPath}. Skipping...`);
            continue;
        }

        const token = crypto.randomUUID();
        console.log(`Uploading ${item.localPath} to gs://${bucketName}/${item.destPath}...`);

        try {
            await bucket.upload(fullLocalPath, {
                destination: item.destPath,
                metadata: {
                    metadata: {
                        firebaseStorageDownloadTokens: token,
                    }
                }
            });

            const downloadUrl = getDownloadUrl(bucketName, item.destPath, token);
            console.log(`Uploaded! URL: ${downloadUrl}`);

            // Update Firestore Document
            if (item.isArray) {
                await item.docRef.set({
                    [item.updateField]: [downloadUrl]
                }, { merge: true });
            } else {
                await item.docRef.set({
                    [item.updateField]: downloadUrl
                }, { merge: true });
            }
            console.log(`Updated Firestore document: ${item.docRef.path}`);

        } catch (error) {
            console.error(`Error uploading ${item.localPath}:`, error);
        }
    }

    console.log("All uploads complete!");
    process.exit(0);
}

uploadImages().catch(console.error);
