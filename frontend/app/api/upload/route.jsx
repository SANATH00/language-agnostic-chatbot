import { NextResponse } from 'next/server';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export async function POST(req) {
  try {
    const formData = await req.formData();
    const file = formData.get('file');

    if (!file || typeof file !== 'object' || !('name' in file)) {
      return NextResponse.json({ success: false, message: 'No file uploaded.' }, { status: 400 });
    }

    // ✅ Read token from form data (sent from frontend)
    const token = formData.get('token');

    if (!token) {
      return NextResponse.json({ success: false, message: 'Not logged in.' }, { status: 401 });
    }

    const backendForm = new FormData();
    backendForm.append('file', file);

    const backendRes = await fetch(`${API_URL}/upload-pdf`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,   // ✅ explicitly set Bearer
      },
      body: backendForm,
    });

    if (backendRes.ok) {
      const data = await backendRes.json();
      return NextResponse.json({ success: true, message: data.message || 'Uploaded successfully' });
    } else {
      const err = await backendRes.json();
      return NextResponse.json({ success: false, message: err.detail || 'Upload failed.' }, { status: 400 });
    }

  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json({ success: false, message: 'Upload server error.' }, { status: 500 });
  }
}