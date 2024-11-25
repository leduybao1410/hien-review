import { NextResponse } from 'next/server';
import { updatePost } from '@/app/utils/db_utils';
import { ErrorResponse, SuccessResponse } from '@/app/schema/api.schema';

type Params = Promise<{ id: string }>;
export async function PUT(request: Request, { params }: { params: Params }) {
    try {
        const { id } = await params;
        const postData = await request.json();
        const updatedPost: SuccessResponse | ErrorResponse = await updatePost(id, postData);

        if (updatedPost.status === 200) {
            const successResponse: SuccessResponse = { status: 200, message: 'Post updated successfully', payload: updatedPost as SuccessResponse };
            return NextResponse.json(successResponse);
        } else {
            const errorResponse: ErrorResponse = { status: 500, message: 'Failed to update post' };
            return NextResponse.json(errorResponse);
        }
    } catch (error) {
        console.error("Error updating post:", error);
        return NextResponse.json({ error: "Failed to update post" }, { status: 500 });
    }
}