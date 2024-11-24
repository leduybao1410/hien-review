import { NextResponse, NextRequest } from 'next/server';
import path from 'path';
import { promises as fs } from 'fs';
import { generateExpirationDate, generateSessionToken, hashPassword } from '@/app/utils/auth_utils';
import { UserAccount } from '@/app/schema/user.schema';
import { ErrorResponse, SuccessResponse } from '@/app/schema/api.schema';

export async function POST(request: NextRequest) {
    try {
        const { email, nickname, password } = await request.json();
        const filePath = path.join(process.cwd(), 'database/user.json');
        const fileContents = await fs.readFile(filePath, 'utf-8');
        const users = JSON.parse(fileContents);

        const emailExists = users.some((user: { email: string }) => user.email === email);
        const nicknameExists = users.some((user: { nickname: string }) => user.nickname === nickname);

        if (emailExists || nicknameExists) {
            return NextResponse.json({ error: `${emailExists ? "Email" : "Nickname"} already exists` }, { status: 409 });
        }

        const hashedPassword = await hashPassword(password);

        const newUser: UserAccount = { email, nickname, password: hashedPassword, createdAt: new Date().valueOf(), updatedAt: new Date().valueOf(), role: "user" };
        users.push(newUser);
        await fs.writeFile(filePath, JSON.stringify(users, null, 2), 'utf-8');

        // Generate a secure session token
        const sessionToken = generateSessionToken();
        const expires = generateExpirationDate();

        const successResponse: SuccessResponse = { status: 201, message: "Registration successful", payload: { sessionToken } };
        const response = NextResponse.json(successResponse);
        response.headers.set('Set-Cookie', `sessionToken=${sessionToken}; Expires=${expires}; Path=/; HttpOnly; Secure; SameSite=Lax; Secure`);
        return response;
    } catch (error) {
        console.error("Registration error:", error);
        const errorResponse: ErrorResponse = { status: 500, message: "Failed to register" };
        return NextResponse.json(errorResponse);
    }
}
