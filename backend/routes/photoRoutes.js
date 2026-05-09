import express from 'express';
import mongoose from 'mongoose';
import Photo from '../models/Photo.js';
import Comment from '../models/Comment.js';
import Rating from '../models/Rating.js';
import { optionalAuth, requireRole, verifyToken } from '../middleware/auth.js';
import { upload } from '../middleware/upload.js';
import { uploadImageToS3 } from '../config/s3.js';

const router = express.Router();

const getRatingSummary = async (photoId) => {
  const agg = await Rating.aggregate([
    { $match: { photoId: new mongoose.Types.ObjectId(photoId) } },
    { $group: { _id: null, avg: { $avg: '$score' }, count: { $sum: 1 } } }
  ]);
  return { avg: agg[0]?.avg || 0, count: agg[0]?.count || 0 };
};

router.post('/', verifyToken, requireRole('creator'), upload.single('image'), async (req, res, next) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'Image is required' });
    const { title = '', caption = '', location = '', peopleTagged = '[]' } = req.body;
    if (!title.trim()) return res.status(400).json({ error: 'Title is required' });
    let tags = [];
    try {
      const parsed = JSON.parse(peopleTagged);
      tags = Array.isArray(parsed) ? parsed : [];
    } catch (_err) {
      tags = [];
    }
    const uploaded = await uploadImageToS3(req.file);
    const imageUrl = uploaded.url;
    const photo = await Photo.create({
      creatorId: req.user.userId,
      title,
      caption,
      location,
      peopleTagged: tags,
      imageUrl
    });
    const populated = await Photo.findById(photo._id).populate('creatorId', 'name avatarUrl');
    return res.status(201).json(populated);
  } catch (err) {
    return next(err);
  }
});

router.get('/', async (req, res, next) => {
  try {
    const search = String(req.query.search || '').trim();
    const page = Math.max(1, Number(req.query.page || 1));
    const limit = Math.max(1, Number(req.query.limit || 12));
    const query = search ? { $text: { $search: search } } : {};
    const total = await Photo.countDocuments(query);
    const projection = search ? { score: { $meta: 'textScore' } } : {};
    const photos = await Photo.find(query, projection)
      .populate('creatorId', 'name avatarUrl')
      .sort(search ? { score: { $meta: 'textScore' }, createdAt: -1 } : { createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);
    return res.json({
      photos,
      totalPages: Math.max(1, Math.ceil(total / limit)),
      currentPage: page,
      total
    });
  } catch (err) {
    return next(err);
  }
});

router.get('/mine/list', verifyToken, requireRole('creator'), async (req, res, next) => {
  try {
    const photos = await Photo.find({ creatorId: req.user.userId })
      .populate('creatorId', 'name avatarUrl')
      .sort({ createdAt: -1 });
    const photoIds = photos.map((p) => p._id);
    const commentsAgg = await Comment.aggregate([
      { $match: { photoId: { $in: photoIds } } },
      { $group: { _id: '$photoId', count: { $sum: 1 } } }
    ]);
    const ratingsAgg = await Rating.aggregate([
      { $match: { photoId: { $in: photoIds } } },
      { $group: { _id: '$photoId', avg: { $avg: '$score' }, count: { $sum: 1 } } }
    ]);
    const commentsMap = new Map(commentsAgg.map((r) => [String(r._id), r.count]));
    const ratingsMap = new Map(ratingsAgg.map((r) => [String(r._id), { avg: r.avg, count: r.count }]));
    const withMeta = photos.map((p) => ({
      ...p.toObject(),
      commentsCount: commentsMap.get(String(p._id)) || 0,
      rating: ratingsMap.get(String(p._id)) || { avg: 0, count: 0 }
    }));
    return res.json(withMeta);
  } catch (err) {
    return next(err);
  }
});

router.get('/:id', async (req, res, next) => {
  try {
    const photo = await Photo.findById(req.params.id).populate('creatorId', 'name avatarUrl');
    if (!photo) return res.status(404).json({ error: 'Photo not found' });
    const comments = await Comment.find({ photoId: photo._id })
      .populate('userId', 'name avatarUrl')
      .sort({ createdAt: -1 });
    const rating = await getRatingSummary(photo._id);
    return res.json({ photo, comments, rating });
  } catch (err) {
    return next(err);
  }
});

router.delete('/:id', verifyToken, requireRole('creator'), async (req, res, next) => {
  try {
    const photo = await Photo.findById(req.params.id);
    if (!photo) return res.status(404).json({ error: 'Photo not found' });
    if (String(photo.creatorId) !== req.user.userId) {
      return res.status(403).json({ error: 'Forbidden' });
    }
    await Photo.deleteOne({ _id: photo._id });
    await Comment.deleteMany({ photoId: photo._id });
    await Rating.deleteMany({ photoId: photo._id });
    return res.json({ message: 'Photo deleted' });
  } catch (err) {
    return next(err);
  }
});

router.post('/:id/comments', verifyToken, requireRole('consumer'), async (req, res, next) => {
  try {
    const body = String(req.body.body || '').trim();
    if (!body) return res.status(400).json({ error: 'Comment body is required' });
    const comment = await Comment.create({
      photoId: req.params.id,
      userId: req.user.userId,
      body
    });
    const populated = await Comment.findById(comment._id).populate('userId', 'name avatarUrl');
    return res.status(201).json(populated);
  } catch (err) {
    return next(err);
  }
});

router.get('/:id/comments', async (req, res, next) => {
  try {
    const comments = await Comment.find({ photoId: req.params.id })
      .populate('userId', 'name avatarUrl')
      .sort({ createdAt: -1 });
    return res.json(comments);
  } catch (err) {
    return next(err);
  }
});

router.post('/:id/rate', verifyToken, requireRole('consumer'), async (req, res, next) => {
  try {
    const score = Number(req.body.score);
    if (!Number.isInteger(score) || score < 1 || score > 5) {
      return res.status(400).json({ error: 'Score must be between 1 and 5' });
    }
    await Rating.findOneAndUpdate(
      { photoId: req.params.id, userId: req.user.userId },
      { score },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );
    const summary = await getRatingSummary(req.params.id);
    return res.json(summary);
  } catch (err) {
    return next(err);
  }
});

router.get('/:id/rate', optionalAuth, async (req, res, next) => {
  try {
    const summary = await getRatingSummary(req.params.id);
    let userScore = null;
    if (req.user?.userId) {
      const rating = await Rating.findOne({ photoId: req.params.id, userId: req.user.userId });
      userScore = rating?.score ?? null;
    }
    return res.json({ ...summary, userScore });
  } catch (err) {
    return next(err);
  }
});

export default router;
