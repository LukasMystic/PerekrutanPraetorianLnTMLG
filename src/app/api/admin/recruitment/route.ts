import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import RecruitmentStatus from '@/models/RecruitmentStatus';

// This is a protected endpoint for admins to toggle the recruitment status.
export async function POST() {
  try {
    await dbConnect();

    // Find the single status document
    let status = await RecruitmentStatus.findOne({});

    // If for some reason it doesn't exist, create it
    if (!status) {
      status = await RecruitmentStatus.create({ isRecruitmentOpen: false });
    } else {
      // If it exists, flip the boolean value and save
      status.isRecruitmentOpen = !status.isRecruitmentOpen;
      await status.save();
    }

    return NextResponse.json({ 
      success: true, 
      isRecruitmentOpen: status.isRecruitmentOpen 
    });

  } catch (error) {
    console.error('Failed to update recruitment status:', error);
    return NextResponse.json(
      { error: 'An internal server error occurred.' },
      { status: 500 }
    );
  }
}