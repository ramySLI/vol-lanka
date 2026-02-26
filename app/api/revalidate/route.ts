import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";

export async function POST(request: NextRequest) {
    // Check if the secret matches to prevent unauthorized cache purging
    const secret = request.nextUrl.searchParams.get('secret');
    if (secret !== process.env.REVALIDATE_SECRET) {
        return NextResponse.json({ message: "Invalid secret token" }, { status: 401 });
    }

    try {
        const body = await request.json();

        // Nuke the entire global site cache cleanly since admin updates are rare
        revalidatePath('/', 'layout');

        return NextResponse.json({ revalidated: true, now: Date.now(), requestedPathOrTag: body.tag || 'all' });
    } catch (err: any) {
        return NextResponse.json({ message: "Error revalidating", error: err.message }, { status: 500 });
    }
}
