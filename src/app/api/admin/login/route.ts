import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { serialize } from 'cookie';

// --- list of authorized administrators ---
const authorizedUsers = {
  'stanley.teguh@binus.ac.id': 'DTgKPUeoNX4kACm',
  'nico.hariyanto@binus.ac.id': 'qasMaAqyU0lRPP6',
  'sandy.alamsyah@binus.ac.id': 'SU4WIgp3Bl3NOlk',
  'arian.febrian@binus.ac.id': 'SelmHyv4u2YsSsy',
  'brhanselino.edipurtta@binus.ac.id': 'h6gWwT6IBqADL35',
  'kevin.handoyo001@binus.ac.id': 'ENmFIyJA2krgiVy',
  'reynard.wijaya005@binus.ac.id': 'ksaHmslX3VD497G',
  'alexander.budianto@binus.ac.id': 'glsT8TW9IGMqjWz',
};

// --- The Main API Handler for Login ---
export async function POST(request: Request) {
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
      process.env.JWT_SECRET || 'your-default-secret-key-for-development',
      { expiresIn: '1d' } // Token expires in 1 day
    );

    const cookie = serialize('admin-auth-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV !== 'development', 
      maxAge: 60 * 60 * 24, // 1 day in seconds
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
