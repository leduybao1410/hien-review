import { ErrorResponse, SuccessResponse } from '@/app/schema/api.schema';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';


export async function GET() {

    try {
        const cookieStore = await cookies()
        const sessionToken = cookieStore.get('sessionToken')?.value;

        if (!sessionToken) {
            console.log("No session token found");
            return NextResponse.json({ error: "No session token found" }, { status: 401 });
        }

        const successResponse: SuccessResponse = { status: 200, message: "Authentication successful", payload: {} };
        return NextResponse.json(successResponse);
    } catch (error) {
        console.error("Authentication error:", error);
        const errorResponse: ErrorResponse = { status: 500, message: "Failed to authenticate" };
        return NextResponse.json(errorResponse);
    }
}
