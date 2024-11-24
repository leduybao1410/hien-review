import { NextResponse } from 'next/server';
import { getRecentPosts } from '@/app/utils/db_utils';

export async function GET() {
    console.log("Fetching posts...");
    try {
        const posts = await getRecentPosts();
        return NextResponse.json(posts);
    } catch (error) {
        console.error("Fetch error:", error);
        // Handle the error appropriately
    }
}
