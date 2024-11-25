import fs from 'fs/promises';
import path from 'path';

export interface View {
    id: number;
    postId: number;
    viewCount: number;
    updatedAt: number;
}

export const formatViewCount = (viewCount: number): string => {
    if (viewCount >= 1000000) {
        return (viewCount / 1000000).toFixed(1) + 'M';
    } else if (viewCount >= 1000) {
        return (viewCount / 1000).toFixed(1) + 'K';
    }
    return viewCount.toString();
}

const getViewLength = async (): Promise<number> => {
    const filePath = path.join(process.cwd(), 'database', 'view.json');
    const data = await fs.readFile(filePath, 'utf-8');
    const views: View[] = JSON.parse(data);
    return views.length;
}

export const getPopularPosts = async (length: number): Promise<View[]> => {
    try {
        const filePath = path.join(process.cwd(), 'database', 'view.json');
        const data = await fs.readFile(filePath, 'utf-8');
        const views: View[] = JSON.parse(data);
        // Sort the views by viewCount in descending order
        const sortedViews = views.sort((a: View, b: View) => b.viewCount - a.viewCount);
        // Return the top length posts
        return sortedViews.slice(0, length);
    } catch (error) {
        console.error('Error fetching popular posts:', error);
        return [];
    }
}

export const getPostViewCount = async (id: string, update: boolean = false): Promise<number> => {
    const filePath = path.join(process.cwd(), 'database', 'view.json');
    const data = await fs.readFile(filePath, 'utf-8');

    if (!data) {
        throw new Error('No data found');
    }

    const views = await JSON.parse(data);

    const postView = views.find((view: View) => view.postId === parseInt(id));
    if (!postView) {
        throw new Error('Post not found');
    }
    if (update) {
        await updateViewCount(id);
    }
    return postView.viewCount;
}

export const updateViewCount = async (postId: string) => {
    const filePath = path.join(process.cwd(), 'database', 'view.json');
    const data = await fs.readFile(filePath, 'utf-8');

    if (!data) {
        return;
    }

    const views = JSON.parse(data);

    const postView = views.find((view: { postId: number }) => view.postId === parseInt(postId));
    if (postView) {
        postView.viewCount += 1;
        postView.updatedAt = Date.now();
    } else {
        views.push({
            id: views.length + 1,
            postId: parseInt(postId),
            viewCount: 1,
            updatedAt: Date.now()
        });
    }

    await fs.writeFile(filePath, JSON.stringify(views, null, 2), 'utf-8');
};

export const addPostView = async (postId: number): Promise<View | undefined> => {
    try {
        const filePath = path.join(process.cwd(), 'database/view.json');
        const data = await fs.readFile(filePath, 'utf-8');
        const views: View[] = JSON.parse(data);
        const viewLength: number = await getViewLength();
        const newId = viewLength + 1;
        const newPostView: View = {
            id: newId,
            postId,
            viewCount: 1,
            updatedAt: Date.now()
        };
        try {
            await fs.writeFile(filePath, JSON.stringify([...views, newPostView], null, 2), 'utf-8');
            return newPostView;
        } catch (error) {
            console.error('Error writing to file:', error);
            return undefined;
        }

    } catch (error) {
        console.error('Error adding post view:', error);
        return undefined;
    }
}

