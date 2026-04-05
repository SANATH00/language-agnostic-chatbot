import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-ultra-secure-secret-key';

export async function POST(req) {
  try {
    const { email, password } = await req.json();

    const token = jwt.sign(
      { email: email, role: 'user' },
      JWT_SECRET,
      { expiresIn: '1d' }
    );

    return NextResponse.json({
      message: "Login successful",
      token: token,
      user: { name: "Developer", email: email }
    }, { status: 200 });

  } catch (error) {
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}