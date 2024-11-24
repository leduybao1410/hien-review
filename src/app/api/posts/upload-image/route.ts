// pages/api/upload-image.ts
import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export const POST = async (request: NextRequest) => {
    const uploadDir = path.join(process.cwd(), 'public/images');

    // Ensure the upload directory exists
    if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
    }

    try {
        // Read the incoming data from formData
        const formData = await request.formData();
        const file = formData.get('file');
        if (!file || !(file instanceof Blob)) {
            throw new Error('Invalid file upload');
        }
        const buffer = Buffer.from(await file.arrayBuffer());

        // Define a unique filename and path
        const fileName = `upload_${Date.now()}.jpg`; // Adjust extension as needed
        const filePath = path.join(uploadDir, fileName);

        // Write the buffer to the specified path
        fs.writeFileSync(filePath, buffer, { encoding: 'base64' });

        // Confirm the file exists after writing
        if (!fs.existsSync(filePath)) {
            throw new Error('File write failed. File does not exist at path.');
        }

        return NextResponse.json({
            status: 200,
            payload: { url: `/images/${fileName}` },
            message: 'File uploaded successfully',
        });
    } catch (error) {
        console.error('Error saving file:', error);
        return NextResponse.json({
            status: 500,
            message: 'Error saving file',
        });
    }
};
