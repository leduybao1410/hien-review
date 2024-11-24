import dotenv from 'dotenv';
dotenv.config();
import { google } from 'googleapis';
import fs from 'fs';

export const fetchLatestVideo = async () => {
    const API_KEY = process.env.YOUTUBE_API_KEY;
    const CHANNEL_ID = process.env.YOUTUBE_CHANNEL_ID;

    const youtube = google.youtube({
        version: 'v3',
        auth: API_KEY
    });

    try {
        const response = await youtube.search.list({
            channelId: CHANNEL_ID,
            part: ['snippet', 'id'],
            order: 'date',
            maxResults: 1
        });

        const data = response.data;

        if (data.items && data.items.length > 0) {
            const jsonData = {
                updateAt: Date.now(),
                youtubeId: data.items[0].id?.videoId,
                youtubeTitle: data.items[0].snippet?.title,
                youtubeLink: `https://www.youtube.com/watch?v=${data.items[0].id?.videoId}`
            }
            await writeYoutubeData(jsonData);
            return data.items[0].id?.videoId;
        } else {
            console.log('No videos found');
        }
    } catch (error) {
        console.error('Error fetching video:', error);
    }
};

export const createIframeLink = (videoId: string) => {
    return `https://www.youtube.com/embed/${videoId}`;
}

const youtubeDataPath = 'database/youtube.json';

export const readYoutubeData = async () => {
    const data = fs.readFileSync(youtubeDataPath, 'utf8');
    return JSON.parse(data);
}

export const writeYoutubeData = async (data: any) => {
    fs.writeFileSync(youtubeDataPath, JSON.stringify(data, null, 2));
}

export const checkIsUpdatedToday = async () => {
    const data = await readYoutubeData();
    const lastUpdate = new Date(data.updateAt);
    const today = new Date();
    return lastUpdate.toDateString() === today.toDateString();
}
