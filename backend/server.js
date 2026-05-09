import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import connectDB from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import photoRoutes from './routes/photoRoutes.js';

const app = express();

app.use(express.json());
app.use(
  cors({
    origin: ['http://localhost:5173', 'https://task-theta-drab-11.vercel.app'],
    credentials: true
  })
);
app.use('/api/auth', authRoutes);
app.use('/api/photos', photoRoutes);

app.get('/api/health', (_req, res) => {
  res.json({ ok: true });
});

app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(err.status || 500).json({
    error: err.message || 'Internal server error'
  });
});

const start = async () => {
  await connectDB();
  const port = Number(process.env.PORT || 8080);
  app.listen(port, () => {
    console.log(`API listening on http://localhost:${port}`);
  });
};

start();
