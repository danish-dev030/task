import 'dotenv/config';
import bcrypt from 'bcryptjs';
import connectDB from './config/db.js';
import User from './models/User.js';
import Photo from './models/Photo.js';
import Comment from './models/Comment.js';
import Rating from './models/Rating.js';

const imageUrls = [
  'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800',
  'https://images.unsplash.com/photo-1501854140801-50d01698950b?w=800',
  'https://images.unsplash.com/photo-1518098268026-4e89f1a2cd8e?w=800',
  'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=800',
  'https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?w=800',
  'https://images.unsplash.com/photo-1433086966358-54859d0ed716?w=800'
];

const titles = ['Sunset Peak', 'Quiet Forest', 'City Reflections', 'Alpine Trail', 'Deep Woods', 'River Falls'];
const captions = [
  'Golden light over the mountains.',
  'A calm morning walk through pines.',
  'Skyline mirrored in evening rain.',
  'Fresh air and endless views.',
  'Nature textures and soft light.',
  'Water rushing through ancient rock.'
];
const locations = ['Hunza', 'Naran', 'Lahore', 'Skardu', 'Murree', 'Swat'];
const tags = [
  ['Ava', 'Noah'],
  ['Liam', 'Mia', 'Zoe'],
  ['Ethan', 'Luna'],
  ['Emma', 'Aiden', 'Leo'],
  ['Ivy', 'Owen'],
  ['Nora', 'Aria', 'Kai']
];

const run = async () => {
  await connectDB();
  await Promise.all([User.deleteMany({}), Photo.deleteMany({}), Comment.deleteMany({}), Rating.deleteMany({})]);

  const creatorHash = await bcrypt.hash('Creator123!', 10);
  const consumerHash = await bcrypt.hash('Consumer123!', 10);

  const creator = await User.create({
    name: 'Alex Creator',
    email: 'creator@pixora.com',
    passwordHash: creatorHash,
    role: 'creator'
  });
  const consumer = await User.create({
    name: 'Jordan Consumer',
    email: 'consumer@pixora.com',
    passwordHash: consumerHash,
    role: 'consumer'
  });

  const photos = await Photo.insertMany(
    imageUrls.map((imageUrl, i) => ({
      creatorId: creator._id,
      title: titles[i],
      caption: captions[i],
      location: locations[i],
      peopleTagged: tags[i],
      imageUrl
    }))
  );

  await Comment.insertMany([
    { photoId: photos[0]._id, userId: consumer._id, body: 'Amazing composition and colors!' },
    { photoId: photos[0]._id, userId: consumer._id, body: 'I want to visit this place soon.' },
    { photoId: photos[0]._id, userId: consumer._id, body: 'Beautiful shot, great work.' }
  ]);

  await Rating.insertMany(
    photos.map((photo, i) => ({
      photoId: photo._id,
      userId: consumer._id,
      score: 3 + (i % 3)
    }))
  );

  console.log('Seeding complete');
  process.exit(0);
};

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
