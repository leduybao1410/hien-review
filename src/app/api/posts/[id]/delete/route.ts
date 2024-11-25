import { NextResponse } from 'next/server';
import { deletePost, deletePostView } from '@/app/utils/db_utils';
import { ErrorResponse, SuccessResponse } from '@/app/schema/api.schema';

type Params = Promise<{ id: string }>;
export async function DELETE(request: Request, { params }: { params: Params }) {
    try {
        const { id } = await params;
        const deletedPost: SuccessResponse | ErrorResponse = await deletePost(id);
        const deletedPostView: SuccessResponse | ErrorResponse = await deletePostView(id);
        if (deletedPost.status === 200 && deletedPostView.status === 200) {
            const successResponse: SuccessResponse = { status: 200, message: 'Post deleted successfully', payload: deletedPost as SuccessResponse };
            return NextResponse.json(successResponse);
        } else {
            const errorResponse: ErrorResponse = { status: 500, message: 'Failed to delete post' };
            return NextResponse.json(errorResponse);
        }
    } catch (error) {
        console.error("Error deleting post:", error);
        return NextResponse.json({ error: "Failed to delete post" }, { status: 500 });
    }
}
