import { ErrorResponse, SuccessResponse } from "@/app/schema/api.schema";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
    const { force } = await request.json();
    if (force) {
        const successResponse: SuccessResponse = { status: 200, message: "Force logout successful", payload: {} };
        const response = NextResponse.json(successResponse);
        response.headers.set('Set-Cookie', `sessionToken=; Path=/; HttpOnly; Secure; Max-Age=0`);
        return response;
    }
    const cookiesStore = await cookies()
    const sessionToken = cookiesStore.get("sessionToken");
    if (!sessionToken) {
        const errorResponse: ErrorResponse = { status: 401, message: "No session token" };
        return NextResponse.json(errorResponse);
    }
}