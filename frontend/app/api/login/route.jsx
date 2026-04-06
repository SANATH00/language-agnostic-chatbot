// Import NextResponse to send API responses in Next.js
import { NextResponse } from 'next/server';

// Import jsonwebtoken library to create JWT tokens
import jwt from 'jsonwebtoken';

// Secret key used to sign the JWT (stored in .env for security)
// If not found, fallback to default string
const JWT_SECRET = process.env.JWT_SECRET || 'your-ultra-secure-secret-key';

// API POST handler (used for login)
export async function POST(req) {
  try {
    // Extract email and password from request body
    const { email, password } = await req.json();

    // Create JWT token with user data
    const token = jwt.sign(
      { 
        email: email,  // Store user email in token
        role: 'user'   // Assign default role
      },
      JWT_SECRET,      // Secret key for signing token
      { expiresIn: '1d' } // Token validity (1 day)
    );

    // Send success response with token and user info
    return NextResponse.json({
      message: "Login successful",
      token: token, // JWT token returned to frontend
      user: { 
        name: "Developer", // Static name (can be dynamic later)
        email: email       // User email
      }
    }, { status: 200 });

  } catch (error) {

    // Handle any server errors
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}