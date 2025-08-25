import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';
import incomeRoutes from './routes/income.route.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8080;

app.use(cors());
app.use(express.json());

//temporary middleware for testing
app.use((req, res, next) => {
  req.user = { user_id: 4 }; // fake user, but you have to create a fake user with id 4 as well in your local database
  next();
});

//Routes
app.use('/api/incomes', incomeRoutes);

// Initialize a single Prisma client instance
const prisma = new PrismaClient();

app.get('/', (req, res) => {
  res.json({ message: 'Expense Tracker API', status: 'running' });
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'OK' });
});

// DB health check using Prisma raw query; does not require any models
app.get('/api/db-check', async (_req, res) => {
  try {
    const result = await prisma.$queryRaw`SELECT NOW() as now`;
    // Result shape differs by driver; normalize to { now }
    const now = Array.isArray(result) ? result[0]?.now ?? result[0]?.NOW ?? result[0] : result?.now ?? result;
    res.json({ ok: true, now });
  } catch (err) {
    console.error('DB check failed:', err);
    res.status(500).json({ ok: false, error: 'DB connection failed' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

export default app;
