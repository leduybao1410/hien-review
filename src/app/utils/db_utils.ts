import path from 'path';
import { promises as fs } from 'fs';
import { PostType } from '../schema/post.schema';
import { ErrorResponse, SuccessResponse } from '../schema/api.schema';


export const getLatestPost = async (): Promise<PostType | undefined> => {
    const posts = await getRecentPosts();
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




export { getRecentPosts, addPost, getSinglePost };
