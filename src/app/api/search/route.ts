import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';
import { PostType } from '@/app/schema/post.schema';

export async function GET(req: NextRequest) {
    try {
        const url = new URL(req.url);
        const query = url.searchParams.get('query');

        if (!query || typeof query !== 'string') {
            return NextResponse.json({ error: 'Query parameter is required and should be a string' }, { status: 400 });
        }

        const dbPath = path.join(process.cwd(), 'database', 'db.json');
        const dbData = JSON.parse(await fs.readFile(dbPath, 'utf8'));

        const results = dbData.filter((post: PostType) =>
            post.title.toLowerCase().includes(query.toLowerCase()) ||
            post.content.toLowerCase().includes(query.toLowerCase()) ||
            post.excerpt.toLowerCase().includes(query.toLowerCase())
        );

        const topResults = results.slice(0, 5);

        return NextResponse.json(topResults);
    } catch (error) {
        console.error('Error in search route:', error);
        return NextResponse.json({ error: 'Internal Server Error from search route' }, { status: 500 });
    }
}
