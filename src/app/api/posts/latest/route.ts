import { NextResponse } from 'next/server';
import { getLatestPost } from '@/app/utils/db_utils';
import { PostType } from '@/app/schema/post.schema';
export async function GET() {
    console.log("Fetching latest post...");
    try {
        const post: PostType | undefined = await getLatestPost();
        if (!post) {
            const errorResponse = {
                message: "No post found",
                statusCode: 404
            }
            return NextResponse.json(errorResponse);
        }
        const successResponse = {
            message: "Post fetched successfully",
            statusCode: 200,
            payload: post
        }
        return NextResponse.json(successResponse);
    } catch (error) {
        console.error("Fetch error:", error);
        const errorResponse = {
            message: "Internal server error",
            statusCode: 500
        }
        return NextResponse.json(errorResponse);
    }
}
