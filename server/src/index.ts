import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { initDb } from './db.js';
import { seedDb } from './seed.js';
import apiRouter from './routes.js';

dotenv.config();

// Initialize Database Schema & Seed Data
initDb();
seedDb();

const app = express();
const port = process.env.PORT || 5050;

app.use(cors({
  origin: '*', // Allow all origins for dev/local context
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

// Mount API router under /api
app.use('/api', apiRouter);

// Basic health check route
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.listen(port, () => {
  console.log(`[Server] School Management System API running at http://localhost:${port}`);
});
