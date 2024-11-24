interface Subscriber {
    email: string;
    subscribedAt: number;
}

interface SubscriberDB extends Subscriber {
    id: number;
}


export type { Subscriber, SubscriberDB };
