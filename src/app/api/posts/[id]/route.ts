import { NextResponse, NextRequest } from 'next/server';
import { getSinglePost } from '@/app/utils/db_utils';

type Params = Promise<{ id: string }>;

export async function GET(request: NextRequest, { params }: { params: Params }) {
    const { id } = await params;
    console.log('Received param:', id);
    async function getPost() {
        try {
            const post = await getSinglePost(id ?? '');

            if (!post) {
                return NextResponse.json({ error: "Post not found" }, { status: 404 });
            }

            return NextResponse.json(post);
        } catch (error) {
            console.error("Fetch error:", error);
            return NextResponse.json({ error: "Failed to fetch post" }, { status: 500 });
        }
    }
    return getPost();


}
