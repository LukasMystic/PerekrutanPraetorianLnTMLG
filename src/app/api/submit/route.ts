import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import { v2 as cloudinary } from 'cloudinary';
import path from 'path';

// --- Cloudinary Configuration ---
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

async function connectToDb() {
  if (!process.env.MONGO_URI) {
    console.error("🔴 MONGO_URI environment variable is not defined.");
    throw new Error('MONGO_URI environment variable is not defined.');
  }

  if (mongoose.connection.readyState >= 1) {
    console.log("✅ Using existing database connection.");
    return;
  }

  console.log("⚪️ Connecting to MongoDB...");
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ Successfully connected to MongoDB.");
  } catch (error) {
    console.error("🔴 MongoDB connection error:", error);
    throw new Error('Failed to connect to MongoDB.');
  }
}

// --- Mongoose Schema ---
const ApplicationSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  nim: { type: String, required: true },
  major: { type: String, required: true },
  lntClass: { type: String, required: true },
  position: { type: String, required: true },
  binusianEmail: { type: String, required: true, match: /@binus\.ac\.id$/ },
  privateEmail: { type: String, required: true },
  resumeUrl: { type: String, required: true },
  submissionDate: { type: Date, default: Date.now },
});
const Application = mongoose.models.Application || mongoose.model('Application', ApplicationSchema, 'Praetorian');

// --- Upload to Cloudinary ---
async function uploadToCloudinary(file: File): Promise<string> {
  console.log("Uploading file to Cloudinary...");
  const fileBuffer = await file.arrayBuffer();
  const mimeType = file.type;
  const encoding = 'base64';
  const base64Data = Buffer.from(fileBuffer).toString('base64');
  const fileUri = `data:${mimeType};${encoding},${base64Data}`;
  const extension = file.name.split('.').pop() || 'bin';

  console.log("File type:", mimeType);
  console.log("File extension:", extension);

  const result = await cloudinary.uploader.upload(fileUri, {
    folder: 'recruitment_cvs',
    resource_type: 'raw', 
    use_filename: true,
    unique_filename: true,
    overwrite: true,
    format: extension,
  });

  console.log("Upload successful:", result);
  console.log("Final secure URL:", result.secure_url);

  return result.secure_url;
}

// --- POST Handler ---
export async function POST(request: Request) {
  console.log("\n\n--- New Application Submission Received ---");
  try {
    await connectToDb();

    console.log("Parsing form data...");
    const formData = await request.formData();
    const resumeFile = formData.get('resume') as File | null;
    console.log("Form data parsed.");

    console.log("Validating form fields...");
    const requiredFields = ['fullName', 'nim', 'major', 'lntClass', 'position', 'binusianEmail', 'privateEmail'];
    for (const field of requiredFields) {
      if (!formData.get(field)) {
        console.error(`Missing required field: ${field}`);
        return NextResponse.json({ error: `Missing required field: ${field}` }, { status: 400 });
      }
    }

    console.log("⚪️ Validating file...");
    if (!resumeFile) {
      console.error("🔴 Resume file is required.");
      return NextResponse.json({ error: 'Resume file is required.' }, { status: 400 });
    }

    if (resumeFile.size > 5 * 1024 * 1024) {
      console.error("🔴 File size exceeds 5MB.");
      return NextResponse.json({ error: 'File size cannot exceed 5MB.' }, { status: 400 });
    }

    const allowedFileTypes = [
      'application/pdf',
      'application/msword', // .doc
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document', // .docx
      'application/zip',
      'application/x-zip-compressed',
      'application/x-7z-compressed',
      'application/x-rar-compressed',
      'image/jpeg',
      'image/png',
    ];

    if (!allowedFileTypes.includes(resumeFile.type)) {
      console.error(`🔴 Invalid file type: ${resumeFile.type}`);
      return NextResponse.json({ error: 'Invalid file type. Please upload a supported format.' }, { status: 400 });
    }
    console.log("✅ File validation passed.");

    const resumeUrl = await uploadToCloudinary(resumeFile);
    if (!resumeUrl) throw new Error("❌ File upload to Cloudinary failed.");

    console.log("⚪️ Creating application document...");
    const newApplication = new Application({
      fullName: formData.get('fullName'),
      nim: formData.get('nim'),
      major: formData.get('major'),
      lntClass: formData.get('lntClass'),
      position: formData.get('position'),
      binusianEmail: formData.get('binusianEmail'),
      privateEmail: formData.get('privateEmail'),
      resumeUrl: resumeUrl,
    });

    console.log("Saving application...");
    await newApplication.save();
    console.log("Application saved successfully!");

    return NextResponse.json({ message: 'Application submitted successfully!', data: newApplication }, { status: 201 });

  } catch (error: any) {
    console.error("API Error:", error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
