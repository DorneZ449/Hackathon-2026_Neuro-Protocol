import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import { apiLimiter } from './middleware/rateLimiter';
import authRoutes from './routes/auth';
import clientRoutes from './routes/clients';
import orderRoutes from './routes/orders';
import interactionRoutes from './routes/interactions';
import commentRoutes from './routes/comments';
import dashboardRoutes from './routes/dashboard';
import adminRoutes from './routes/admin';
import profileRoutes from './routes/profile';

dotenv.config();

// Validate required environment variables
if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL environment variable is required');
}
if (!process.env.JWT_SECRET) {
  throw new Error('JWT_SECRET environment variable is required');
}

const app = express();

// Security headers
app.use(helmet());

// CORS настройка - поддержка локальной разработки и продакшена
const allowedOrigins = (
  process.env.ALLOWED_ORIGINS ??
  'http://localhost:3000,http://localhost:5173'
)
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error('Not allowed by CORS'));
    },
    credentials: true,
  })
);

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// Rate limiting для всех API запросов
app.use('/api', apiLimiter);

app.use('/api/auth', authRoutes);
app.use('/api/clients', clientRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/interactions', interactionRoutes);
app.use('/api/comments', commentRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/profile', profileRoutes);

app.get('/', (req, res) => {
  res.json({ message: 'ClientHub API работает' });
});

export default app;
