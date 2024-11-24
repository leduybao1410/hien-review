import { NextResponse, NextRequest } from 'next/server';
import { getRecentPosts } from '@/app/utils/db_utils';

type Params = Promise<{ length: string }>;

export async function GET(request: NextRequest, { params }: { params: Params }) {
    console.log("Fetching posts...");
    const length = (await params).length;
    try {
        const posts = await getRecentPosts(length ? Number(length) : 0);
        return NextResponse.json(posts);
    } catch (error) {
        console.error("Fetch error:", error);
        // Handle the error appropriately
    }
}
