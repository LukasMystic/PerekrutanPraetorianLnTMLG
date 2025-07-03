import { NextResponse, type NextRequest } from 'next/server';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';


async function connectToDb() {
  if (mongoose.connection.readyState >= 1) {
    return;
  }
  if (!process.env.MONGO_URI) {
    throw new Error('MONGO_URI environment variable is not defined.');
  }
  return mongoose.connect(process.env.MONGO_URI);
}

const ApplicationSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  nim: { type: String, required: true },
  major: { type: String, required: true },
  lntClass: { type: String, required: true },
  position: { type: String, required: true },
  binusianEmail: { type: String, required: true },
  privateEmail: { type: String, required: true },
  resumeUrl: { type: String, required: true },
  submissionDate: { type: Date, default: Date.now },
});

const Application = mongoose.models.Application || mongoose.model('Application', ApplicationSchema, 'Praetorian');

export async function GET(request: NextRequest) { 
  try {
    const token = request.cookies.get('admin-auth-token')?.value;

    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (!process.env.JWT_SECRET) {
      throw new Error('JWT_SECRET is not configured on the server.');
    }
    jwt.verify(token, process.env.JWT_SECRET);


    await connectToDb();
    const applications = await Application.find({}).sort({ submissionDate: -1 });

    return NextResponse.json({ applications });

  } catch (error: any) {
    if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
      return NextResponse.json({ error: 'Unauthorized: Invalid token' }, { status: 401 });
    }
    console.error("Failed to fetch applications:", error);
    return NextResponse.json({ error: 'An internal server error occurred.' }, { status: 500 });
  }
}
