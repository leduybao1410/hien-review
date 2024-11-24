import { Subscriber, SubscriberDB } from "../schema/subcriber.schema";
import path from "path";
import fs from "fs/promises";

export const getSingleSubscriber = async (email: string) => {
    const filePath = path.join(process.cwd(), 'database/subscriber.json');
    const fileContents = await fs.readFile(filePath, 'utf-8');
    const subscribers: SubscriberDB[] = JSON.parse(fileContents);
    return subscribers.find(s => s.email === email);
}

export const writeToSubscribersFile = async (subscriber: Subscriber) => {
    try {
        const filePath = path.join(process.cwd(), 'database/subscriber.json');

        // Check if the file exists, if not, create it with an empty array
        try {
            await fs.access(filePath);
        } catch {
            await fs.writeFile(filePath, JSON.stringify([], null, 2));
        }

        const fileContents = await fs.readFile(filePath, 'utf-8');
        const subscribers: SubscriberDB[] = JSON.parse(fileContents);

        const newId = Math.max(...subscribers.map(s => s.id), 0) + 1;
        const newSubscriber: SubscriberDB = { ...subscriber, id: newId };

        subscribers.push(newSubscriber);
        await fs.writeFile(filePath, JSON.stringify(subscribers, null, 2));
        return newSubscriber.id;
    } catch (error) {
        console.error('Error writing to subscribers file:', error);
        return false;
    }
}   
