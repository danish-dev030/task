import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const router = express.Router();

const signToken = (user) =>
  jwt.sign(
    {
      userId: user._id,
      email: user.email,
      role: user.role,
      name: user.name
    },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );

const authResponse = (user) => ({
  id: user._id,
  name: user.name,
  email: user.email,
  role: user.role,
  avatarUrl: user.avatarUrl
});

const validateBasicFields = ({ name, email, password }) => {
  if (!name || !email || !password) return 'name, email and password are required';
  if (password.length < 6) return 'password must be at least 6 characters';
  return null;
};

const createUserWithRole = async ({ name, email, password, role }) => {
  const exists = await User.findOne({ email: email.toLowerCase() });
  if (exists) return { error: 'Email already exists', status: 409 };
  const passwordHash = await bcrypt.hash(password, 10);
  const user = await User.create({ name, email, passwordHash, role });
  const token = signToken(user);
  return { token, user: authResponse(user) };
};

router.post('/signup', async (req, res, next) => {
  try {
    const { name, email, password, role = 'consumer' } = req.body;
    const validationError = validateBasicFields({ name, email, password });
    if (validationError) return res.status(400).json({ error: validationError });
    if (!['consumer', 'creator'].includes(role)) {
      return res.status(400).json({ error: 'Invalid role' });
    }
    const result = await createUserWithRole({ name, email, password, role });
    if (result.error) return res.status(result.status).json({ error: result.error });
    return res.status(201).json(result);
  } catch (err) {
    return next(err);
  }
});

router.post('/login', async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email: String(email || '').toLowerCase() });
    if (!user) return res.status(401).json({ error: 'Invalid credentials' });
    const ok = await bcrypt.compare(password || '', user.passwordHash);
    if (!ok) return res.status(401).json({ error: 'Invalid credentials' });
    return res.json({ token: signToken(user), user: authResponse(user) });
  } catch (err) {
    return next(err);
  }
});

export default router;
