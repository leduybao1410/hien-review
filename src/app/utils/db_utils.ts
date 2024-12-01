import path from 'path';
import { promises as fs } from 'fs';
import { PostType, PostView } from '../schema/post.schema';
import { ErrorResponse, SuccessResponse } from '../schema/api.schema';


export const getLatestPost = async (): Promise<PostType | undefined> => {
    const posts = await getRecentPosts();
    if (posts.length === 0) return undefined;
    return posts[0];
}

const maxLength = 10;

const getRecentPosts = async (length?: number): Promise<PostType[]> => {
    try {
        const filePath = path.join(process.cwd(), 'database/db.json');
        const fileContents = await fs.readFile(filePath, 'utf-8');
        const data: PostType[] = JSON.parse(fileContents);

        data.sort((a, b) => b.createdAt - a.createdAt);

        return length ? data.slice(0, length > maxLength ? maxLength : length) : data;
    } catch (error) {
        console.error('Error fetching related posts:', error);
        return [];
    }
}

const getSinglePost = async (id: string | number): Promise<PostType | undefined> => {
    try {
        const filePath = path.join(process.cwd(), 'database/db.json');
        const fileContents = await fs.readFile(filePath, 'utf-8');
        const data: PostType[] = JSON.parse(fileContents);
        if (data.length === 0) return undefined;
        return data.find(post => post.id === Number(id));
    } catch (error) {
        console.error('Error fetching related posts:', error);
        return undefined;
    }
}

const addPost = async (post: Omit<PostType, 'id' | 'createdAt' | 'updatedAt'>): Promise<SuccessResponse | ErrorResponse> => {
    try {
        const filePath = path.join(process.cwd(), 'database/db.json');
        const fileContents: PostType[] = await getRecentPosts();

        const newId = Math.max(...fileContents.map(p => p.id), 0) + 1;
        const newPost: PostType = {
            id: newId,
            ...post,
            createdAt: Date.now().valueOf(),
            updatedAt: Date.now().valueOf()
        };

        try {
            fileContents.push(newPost);
            await fs.writeFile(filePath, JSON.stringify(fileContents, null, 2));
            const successResponse: SuccessResponse = { status: 200, message: 'Post added successfully', payload: newPost };
            return successResponse;
        } catch (error) {
            console.error('Error writing to file:', error);
            const errorResponse: ErrorResponse = { status: 500, message: 'Failed to write post to file' };
            return errorResponse;
        }
    } catch (error) {
        console.error('Error adding post:', error);
        const errorResponse: ErrorResponse = { status: 500, message: 'Failed to add post' };
        return errorResponse;
    }
}

const updatePost = async (id: string | number, post: Omit<PostType, 'id' | 'createdAt' | 'updatedAt'>): Promise<SuccessResponse | ErrorResponse> => {
    try {
        const filePath = path.join(process.cwd(), 'database/db.json');
        const fileContents = await fs.readFile(filePath, 'utf-8');
        const data: PostType[] = JSON.parse(fileContents);

        const postIndex = data.findIndex(p => p.id === Number(id));
        if (postIndex === -1) {
            const errorResponse: ErrorResponse = { status: 404, message: 'Post not found' };
            return errorResponse;
        }

        if (data[postIndex].image && post.image !== data[postIndex].image) {
            await deleteOldImage(data[postIndex].image);
        }

        const updatedPost: PostType = {
            ...data[postIndex],
            ...post,
            updatedAt: Date.now().valueOf()
        };

        data[postIndex] = updatedPost;

        await fs.writeFile(filePath, JSON.stringify(data, null, 2));
        const successResponse: SuccessResponse = { status: 200, message: 'Post updated successfully', payload: updatedPost };
        return successResponse;
    } catch (error) {
        console.error('Error updating post:', error);
        const errorResponse: ErrorResponse = { status: 500, message: 'Failed to update post' };
        return errorResponse;
    }
}

const deleteOldImage = async (image: string): Promise<void> => {
    const filePath = path.join(process.cwd(), 'public/', image);
    await fs.unlink(filePath);
}

const deletePost = async (id: string | number): Promise<SuccessResponse | ErrorResponse> => {
    try {
        const filePath = path.join(process.cwd(), 'database/db.json');
        const fileContents = await fs.readFile(filePath, 'utf-8');
        const data: PostType[] = JSON.parse(fileContents);

        const postIndex = data.findIndex(p => p.id === Number(id));
        if (postIndex === -1) {
            const errorResponse: ErrorResponse = { status: 404, message: 'Post not found' };
            return errorResponse;
        }

        if (data[postIndex].image) {
            await deleteOldImage(data[postIndex].image);
        }

        data.splice(postIndex, 1);

        await fs.writeFile(filePath, JSON.stringify(data, null, 2));
        const successResponse: SuccessResponse = { status: 200, message: 'Post deleted successfully', payload: data };
        return successResponse;
    } catch (error) {
        console.error('Error deleting post:', error);
        const errorResponse: ErrorResponse = { status: 500, message: 'Failed to delete post' };
        return errorResponse;
    }
}

const deletePostView = async (id: string | number): Promise<SuccessResponse | ErrorResponse> => {
    try {
        const filePath = path.join(process.cwd(), 'database/view.json');
        const fileContents = await fs.readFile(filePath, 'utf-8');
        const data: PostView[] = JSON.parse(fileContents);

        const postIndex = data.findIndex(p => p.postId === Number(id));
        if (postIndex === -1) {
            const errorResponse: ErrorResponse = { status: 404, message: 'Post not found' };
            return errorResponse;
        }

        data.splice(postIndex, 1);

        await fs.writeFile(filePath, JSON.stringify(data, null, 2));
        const successResponse: SuccessResponse = { status: 200, message: 'Post deleted successfully', payload: data };
        return successResponse;
    } catch (error) {
        console.error('Error deleting post:', error);
        const errorResponse: ErrorResponse = { status: 500, message: 'Failed to delete post' };
        return errorResponse;
    }
}

export { getRecentPosts, addPost, getSinglePost, updatePost, deleteOldImage, deletePost, deletePostView };
