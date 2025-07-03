import { NextResponse, type NextRequest } from 'next/server';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';

// --- Re-using the same DB connection and Mongoose model ---

async function connectToDb() {
  if (mongoose.connection.readyState >= 1) {
    console.log("✅ Using existing database connection.");
    return;
  }
  if (!process.env.MONGO_URI) {
    console.error("🔴 MONGO_URI environment variable is not defined on the server.");
    throw new Error('MONGO_URI environment variable is not defined.');
  }
  
  console.log("⚪️ Connecting to MongoDB...");
  await mongoose.connect(process.env.MONGO_URI);
  console.log("✅ Successfully connected to MongoDB.");
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


// --- The Main API Handler to GET Applications ---
export async function GET(request: NextRequest) {
  console.log("--- API call received: GET /api/admin/applications ---");
  try {
    // 1. Verify Authentication
    const token = request.cookies.get('admin-auth-token')?.value;
    if (!token) {
      console.error("🔴 UNAUTHORIZED: No auth token found.");
      return NextResponse.json({ error: 'Unauthorized: Missing authentication token.' }, { status: 401 });
    }
    
    if (!process.env.JWT_SECRET) {
        console.error("🔴 SERVER ERROR: JWT_SECRET is not configured.");
        throw new Error('JWT_SECRET is not configured on the server.');
    }
    
    jwt.verify(token, process.env.JWT_SECRET);
    console.log("✅ JWT verification successful.");

    // 2. Connect to the database
    await connectToDb();

    // 3. Fetch the data from the "Praetorian" collection
    console.log("⚪️ Fetching documents from 'Praetorian' collection...");
    const applications = await Application.find({}).sort({ submissionDate: -1 }).lean();
    console.log(`✅ Found ${applications.length} documents.`);

    // 4. Return the data successfully
    return NextResponse.json({ applications });

  } catch (error) {
    // Catch specific error types for better client-side feedback
    if (error instanceof Error) {
        if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
            console.error("🔴 UNAUTHORIZED: Invalid or expired token.", error.message);
            return NextResponse.json({ error: 'Unauthorized: Invalid token.' }, { status: 401 });
        }
        // Catch database connection or query errors
        console.error("🔴 DATABASE/SERVER ERROR:", error.message);
        return NextResponse.json({ error: 'An internal server error occurred while fetching data.' }, { status: 500 });
    }
    
    // Fallback for unknown errors
    console.error("🔴 UNKNOWN ERROR:", error);
    return NextResponse.json({ error: 'An unknown internal server error occurred.' }, { status: 500 });
  }
}
