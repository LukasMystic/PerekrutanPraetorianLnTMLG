import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import RecruitmentStatus from '@/models/RecruitmentStatus';

// This is a public endpoint to get the current recruitment status from MongoDB.
export async function GET() {
  try {
    await dbConnect();

    // Find one document. Since we'll only ever have one, this is fine.
    let status = await RecruitmentStatus.findOne({});

    // If no status document exists in the database yet, create one.
    if (!status) {
      status = await RecruitmentStatus.create({ isRecruitmentOpen: true });
    }

    return NextResponse.json({ isRecruitmentOpen: status.isRecruitmentOpen });

  } catch (error) {
    console.error('Failed to get recruitment status:', error);
    return NextResponse.json(
      { error: 'An internal server error occurred.' },
      { status: 500 }
    );
  }
}