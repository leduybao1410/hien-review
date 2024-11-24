import { ErrorResponse, SuccessResponse } from "@/app/schema/api.schema";
import { Subscriber } from "@/app/schema/subcriber.schema";
import { getSingleSubscriber, writeToSubscribersFile } from "@/app/utils/subcriber_utils";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
    const body = await request.json();
    console.log('Body:', body);
    const subscriber: Subscriber = body;
    const existingSubscriber = await getSingleSubscriber(subscriber.email);
    if (existingSubscriber) {
        const errorResponse: ErrorResponse = { status: 400, message: "Email already exists" };
        return NextResponse.json(errorResponse);
    }
    const id = await writeToSubscribersFile(subscriber);
    if (!id) {
        const errorResponse: ErrorResponse = { status: 500, message: "Failed to subscribe" };
        return NextResponse.json(errorResponse);
    }
    const successResponse: SuccessResponse = { status: 200, message: "Subscribed", payload: { id } };
    return NextResponse.json(successResponse);
}
