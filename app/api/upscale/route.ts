import { NextResponse } from 'next/server';
import Replicate from 'replicate';

export async function POST(request: Request) {
    const token = process.env.REPLICATE_API_TOKEN;

    if (!token) {
        return NextResponse.json(
            { error: 'REPLICATE_API_TOKEN is not set' },
            { status: 500 }
        );
    }

    const replicate = new Replicate({
        auth: token,
    });

    try {
        const formData = await request.formData();
        const file = formData.get('image') as File;
        const scale = formData.get('scale') as string; // '2x' or '4x'

        if (!file) {
            return NextResponse.json(
                { error: 'No image provided' },
                { status: 400 }
            );
        }

        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        // Convert buffer to base64 data URI for Replicate
        const mimeType = file.type || 'image/png';
        const base64Image = `data:${mimeType};base64,${buffer.toString('base64')}`;

        const scaleNumber = scale === '4x' ? 4 : 2;

        const output = await replicate.run(
            "nightmareai/real-esrgan:42fed1c4974146d4d2414e2be2c5277c7fcf05fcc3a73ab2a43dc3125f1ddbf0",
            {
                input: {
                    image: base64Image,
                    scale: scaleNumber,
                    face_enhance: true,
                }
            }
        );

        return NextResponse.json({ result: output });

    } catch (error) {
        console.error('Upscale error:', error);
        return NextResponse.json(
            { error: 'Failed to process image' },
            { status: 500 }
        );
    }
}
