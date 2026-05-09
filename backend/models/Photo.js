import mongoose from 'mongoose';

const PhotoSchema = new mongoose.Schema(
  {
    creatorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true, trim: true },
    caption: { type: String, default: '' },
    location: { type: String, default: '' },
    peopleTagged: { type: [String], default: [] },
    imageUrl: { type: String, required: true }
  },
  { timestamps: true }
);

PhotoSchema.index({ title: 'text', caption: 'text', location: 'text' });

export default mongoose.model('Photo', PhotoSchema);
