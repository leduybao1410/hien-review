import { NextResponse } from 'next/server';
import { addPost } from '@/app/utils/db_utils';
import { ErrorResponse, SuccessResponse } from '@/app/schema/api.schema';
import { addPostView, View } from '@/app/utils/stat_tracking_utils';

export async function POST(request: Request) {
    try {
        const postData = await request.json();
        const newPost: SuccessResponse | ErrorResponse = await addPost(postData);
        if (newPost.status === 200) {
            const view: View | undefined = await addPostView((newPost as SuccessResponse).payload.id);
            if (view) {
                const successResponse: SuccessResponse = { status: 200, message: 'Post added successfully', payload: { newPost: (newPost as SuccessResponse).payload, view } };
                return NextResponse.json(successResponse);
            } else {
                const errorResponse: ErrorResponse = { status: 500, message: 'Failed to add post view' };
                return NextResponse.json(errorResponse);
            }
        } else {
            const errorResponse: ErrorResponse = { status: 500, message: 'Failed to add post' };
            return NextResponse.json(errorResponse);
        }
    } catch (error) {
        console.error("Error adding new post:", error);
        return NextResponse.json({ error: "Failed to add new post" }, { status: 500 });
    }
}