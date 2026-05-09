import mongoose from 'mongoose';

const RatingSchema = new mongoose.Schema({
  photoId: { type: mongoose.Schema.Types.ObjectId, ref: 'Photo', required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  score: { type: Number, required: true, min: 1, max: 5 }
});

RatingSchema.index({ photoId: 1, userId: 1 }, { unique: true });

export default mongoose.model('Rating', RatingSchema);
