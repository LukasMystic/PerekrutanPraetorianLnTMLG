import mongoose, { Schema, Document } from 'mongoose';

export interface IRecruitmentStatus extends Document {
  isRecruitmentOpen: boolean;
}

const RecruitmentStatusSchema: Schema = new Schema({
  isRecruitmentOpen: {
    type: Boolean,
    required: true,
    default: true,
  },
});

// Prevent model overwrite in development hot-reloading
export default mongoose.models.RecruitmentStatus || mongoose.model<IRecruitmentStatus>('RecruitmentStatus', RecruitmentStatusSchema);