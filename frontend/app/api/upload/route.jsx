// Import NextResponse to send API responses in Next.js
import { NextResponse } from 'next/server';

// API POST handler (used for file upload)
export async function POST(req) {
  try {
    // Extract form data from the incoming request
    const formData = await req.formData();

    // Get the uploaded file using key 'file'
    const file = formData.get('file');

    // Validate if file exists and is a proper object with a name property
    if (!file || typeof file !== 'object' || !('name' in file)) {

      // Return error if no valid file is uploaded
      return NextResponse.json(
        { success: false, message: 'No file uploaded.' },
        { status: 400 }
      );
    }

    // If needed, you can forward the file to another service (e.g., cloud storage, backend API)
    // Currently, this just confirms upload for UI feedback

    // Return success response with file name
    return NextResponse.json({
      success: true,
      message: `Uploaded ${file.name}` // Display uploaded file name
    });

  } catch (error) {

    // Log error for debugging in server console
    console.error('Upload error:', error);

    // Return server error response
    return NextResponse.json(
      { success: false, message: 'Upload server error. Please try again.' },
      { status: 500 }
    );
  }
}