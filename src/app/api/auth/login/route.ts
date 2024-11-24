import { NextResponse, NextRequest } from 'next/server';
import path from 'path';
import { promises as fs } from 'fs';
import { generateSessionToken, verifyPassword } from '@/app/utils/auth_utils';
import { ErrorResponse, SuccessResponse } from '@/app/schema/api.schema';

export async function POST(request: NextRequest) {
    try {
        const { email, password } = await request.json();
        const filePath = path.join(process.cwd(), 'database/user.json');
        const fileContents = await fs.readFile(filePath, 'utf-8');
        const users = JSON.parse(fileContents);

        const user = users.find((user: { email: string }) => user.email === email);

        if (!user) {
            return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });
        }

        const verified = await verifyPassword(password, user.password);
        if (!verified) {
            return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });
        }

        // Generate a secure session token
        const sessionToken = generateSessionToken();
        const expires = new Date(Date.now() + 1000 * 60 * 15).toUTCString();

        const successResponse: SuccessResponse = { status: 200, message: "Login successful", payload: { sessionToken } };
        const response = NextResponse.json(successResponse);
        response.headers.set('Set-Cookie', `sessionToken=${sessionToken}; Expires=${expires}; Path=/; HttpOnly; Secure; SameSite=Lax; Secure`);
        return response;
    } catch (error) {
        console.error("Authentication error:", error);
        const errorResponse: ErrorResponse = { status: 500, message: "Failed to authenticate" };
        return NextResponse.json(errorResponse);
    }
}
