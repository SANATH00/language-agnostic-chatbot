import { NextResponse } from 'next/server';

export async function POST(req) {
  try {
    const formData = await req.formData();
    const file = formData.get('file');

    if (!file || typeof file !== 'object' || !('name' in file)) {
      return NextResponse.json({ success: false, message: 'No file uploaded.' }, { status: 400 });
    }

    // If you need to forward file to another service, do it here.
    // Right now we keep upload status locally and allow UI feedback.

    return NextResponse.json({ success: true, message: `Uploaded ${file.name}` });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json({ success: false, message: 'Upload server error. Please try again.' }, { status: 500 });
  }
}
