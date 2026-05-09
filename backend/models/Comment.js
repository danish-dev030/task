import mongoose from 'mongoose';

const CommentSchema = new mongoose.Schema(
  {
    photoId: { type: mongoose.Schema.Types.ObjectId, ref: 'Photo', required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    body: { type: String, required: true, trim: true }
  },
  { timestamps: true }
);

export default mongoose.model('Comment', CommentSchema);
