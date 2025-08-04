import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { serialize } from 'cookie';

type AuthorizedUsers = {
  [key: string]: string;
};

let authorizedUsers: AuthorizedUsers = {};

if (process.env.AUTHORIZED_USERS_JSON) {
  try {
    authorizedUsers = JSON.parse(process.env.AUTHORIZED_USERS_JSON);
  } catch (error) {
    console.error("Failed to parse AUTHORIZED_USERS_JSON:", error);
  }
}

export async function POST(request: Request) {
  const jwtSecret = process.env.JWT_SECRET;

  if (!jwtSecret) {
    console.error("JWT_SECRET environment variable is not set.");
    return NextResponse.json({ error: 'Server configuration error.' }, { status: 500 });
  }

  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required.' }, { status: 400 });
    }

    const expectedPassword = authorizedUsers[email as keyof typeof authorizedUsers];
    if (!expectedPassword || password !== expectedPassword) {
      return NextResponse.json({ error: 'Invalid email or password.' }, { status: 401 });
    }

    const token = jwt.sign(
      { email: email },
      jwtSecret,
      { expiresIn: '1d' }
    );

    const cookie = serialize('admin-auth-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV !== 'development',
      maxAge: 60 * 60 * 24, // 1 day
      path: '/',
    });

    return new NextResponse(JSON.stringify({ success: true }), {
      status: 200,
      headers: { 'Set-Cookie': cookie },
    });

  } catch (error) {
    console.error('Login API Error:', error);
    return NextResponse.json({ error: 'An internal server error occurred.' }, { status: 500 });
  }
}