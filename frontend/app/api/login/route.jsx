import { NextResponse } from 'next/server';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export async function POST(req) {
  try {
    const { email, password } = await req.json();

    // Call FastAPI login instead of generating our own token
    const formData = new URLSearchParams();
    formData.append('username', email);
    formData.append('password', password);

    const res = await fetch(`${API_URL}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: formData.toString(),
    });

    const data = await res.json();

    if (!res.ok) {
      return NextResponse.json({ message: data.detail || 'Login failed' }, { status: 401 });
    }

    return NextResponse.json({
      message: 'Login successful',
      token: data.access_token,  // this is the real FastAPI token
      user: { email: email }
    });

  } catch (error) {
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}