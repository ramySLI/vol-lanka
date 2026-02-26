/* eslint-disable @typescript-eslint/no-explicit-any */
import { Program } from "@/types/program";

/**
 * Utility to fetch from Firestore via its REST API.
 * This is safe to use in Next.js Server Components since it relies on standard fetch
 * and doesn't require initializing a heavy Node.js Firebase instance.
 * Note: Our security rules currently allow public reads.
 */
export async function fetchProgramsREST(): Promise<Program[]> {
    const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
    const res = await fetch(
        `https://firestore.googleapis.com/v1/projects/${projectId}/databases/(default)/documents/programs`,
        { next: { tags: ['programs'] } } // Cache indefinitely, clear via webhook
    );

    if (!res.ok) {
        throw new Error("Failed to fetch programs");
    }

    const data = await res.json();
    if (!data.documents) return [];

    return data.documents.map((doc: any) => parseFirestoreDocument(doc));
}

export async function fetchProgramBySlugREST(slug: string): Promise<Program | null> {
    const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
    const res = await fetch(
        `https://firestore.googleapis.com/v1/projects/${projectId}/databases/(default)/documents/programs/${slug}`,
        { next: { tags: ['programs', `program-${slug}`] } }
    );

    if (!res.ok) {
        if (res.status === 404) return null;
        throw new Error("Failed to fetch program");
    }

    const data = await res.json();
    return parseFirestoreDocument(data);
}

// Simple parser to convert Firestore REST API response to a standard JS object
// The REST API wraps values in type objects, e.g., { stringValue: "foo" }

export async function fetchPageContentREST(slug: string): Promise<any | null> {
    const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
    const res = await fetch(
        `https://firestore.googleapis.com/v1/projects/${projectId}/databases/(default)/documents/pages/${slug}`,
        { next: { tags: ['pages', `page-${slug}`] } }
    );

    if (!res.ok) {
        if (res.status === 404) return null;
        throw new Error("Failed to fetch page data");
    }

    const data = await res.json();
    return parseFirestoreDocument(data);
}

export async function fetchSettingsREST(slug: string): Promise<any | null> {
    const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
    const res = await fetch(
        `https://firestore.googleapis.com/v1/projects/${projectId}/databases/(default)/documents/settings/${slug}`,
        { next: { tags: ['settings', `setting-${slug}`] } }
    );

    if (!res.ok) {
        if (res.status === 404) return null;
        throw new Error("Failed to fetch settings data");
    }

    const data = await res.json();
    return parseFirestoreDocument(data);
}

function parseFirestoreDocument(doc: any) {
    const data = doc.fields;
    const id = doc.name.split("/").pop(); // Extract ID from the document path
    return {
        id,
        ...parseFields(data),
    } as Program;
}

function parseFields(fields: any): any {
    const parsed: any = {};
    for (const [key, val] of Object.entries(fields)) {
        parsed[key] = parseValue(val);
    }
    return parsed;
}

function parseValue(val: any): any {
    if (val.stringValue !== undefined) return val.stringValue;
    if (val.integerValue !== undefined) return parseInt(val.integerValue, 10);
    if (val.doubleValue !== undefined) return parseFloat(val.doubleValue);
    if (val.booleanValue !== undefined) return val.booleanValue;
    if (val.nullValue !== undefined) return null;
    if (val.mapValue !== undefined) return parseFields(val.mapValue.fields);
    if (val.arrayValue !== undefined) {
        return (val.arrayValue.values || []).map((v: any) => parseValue(v));
    }
    if (val.timestampValue !== undefined) return new Date(val.timestampValue);
    return val;
}
