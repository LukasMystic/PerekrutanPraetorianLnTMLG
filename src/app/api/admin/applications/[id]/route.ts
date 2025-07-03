import { NextResponse, type NextRequest } from 'next/server';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';

// --- Re-using the same DB connection and Mongoose model ---
async function connectToDb() {
  if (mongoose.connection.readyState >= 1) return;
  if (!process.env.MONGO_URI) throw new Error('MONGO_URI not defined');
  await mongoose.connect(process.env.MONGO_URI);
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

// --- Helper to verify JWT ---
function verifyAuth(request: NextRequest) {
    const token = request.cookies.get('admin-auth-token')?.value;
    if (!token) throw new Error('Unauthorized');
    if (!process.env.JWT_SECRET) throw new Error('JWT_SECRET not configured');
    jwt.verify(token, process.env.JWT_SECRET);
}

// --- API Handler to UPDATE a specific application ---
export async function PUT(request: NextRequest) {
    try {
        verifyAuth(request); // Protect the route

        // --- BYPASS FIX for Vercel Deployment Error ---
        // Instead of using the context/params object, we manually parse the ID from the URL.
        const url = new URL(request.url);
        const id = url.pathname.split('/').pop();

        if (!id) {
            return NextResponse.json({ error: 'Application ID is missing from the URL.' }, { status: 400 });
        }
        
        const body = await request.json();

        await connectToDb();
        
        const updatedApplication = await Application.findByIdAndUpdate(id, body, { new: true });

        if (!updatedApplication) {
            return NextResponse.json({ error: 'Application not found' }, { status: 404 });
        }

        return NextResponse.json({ message: 'Application updated successfully', application: updatedApplication });

    } catch (error) {
        if (error instanceof Error && error.message === 'Unauthorized') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }
        console.error("Update Application Error:", error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}


// --- API Handler to DELETE a specific application ---
export async function DELETE(request: NextRequest) {
    try {
        verifyAuth(request); // Protect the route
        
        // --- BYPASS FIX for Vercel Deployment Error ---
        // Manually parsing the ID from the URL here as well.
        const url = new URL(request.url);
        const id = url.pathname.split('/').pop();

        if (!id) {
            return NextResponse.json({ error: 'Application ID is missing from the URL.' }, { status: 400 });
        }

        await connectToDb();
        
        const deletedApplication = await Application.findByIdAndDelete(id);

        if (!deletedApplication) {
            return NextResponse.json({ error: 'Application not found' }, { status: 404 });
        }

        return NextResponse.json({ message: 'Application deleted successfully' });

    } catch (error) {
        if (error instanceof Error && error.message === 'Unauthorized') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }
        console.error("Delete Application Error:", error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
