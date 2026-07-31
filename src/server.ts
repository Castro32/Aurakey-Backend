import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import { connectDB } from './config/db';
import { errorHandler } from './middleware/errorHandler';
import { apiLimiter } from './middleware/rateLimiter';

import authRoutes from './routes/auth';
import testimonialsRoutes from './routes/testimonials';
import faqsRoutes from './routes/faqs';
import propertiesRoutes from './routes/properties';
import blogRoutes from './routes/blog';
import contactRoutes from './routes/contact';
import listingsRoutes from './routes/listings';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Connect DB
connectDB();

// Security
app.use(helmet());
const allowedOrigins = [
  "http://localhost:5173",
  "https://aurakey.vercel.app",
];

app.use(
    cors({
      origin: (origin, callback) => {
    console.log("Incoming Origin:", origin);

    if (!origin) return callback(null, true);

    if (allowedOrigins.includes(origin)) {
      console.log("CORS allowed:", origin);
      return callback(null, true);
    }

    console.log("CORS blocked:", origin);
    return callback(new Error(`CORS blocked for origin: ${origin}`));
  },
    credentials: true,
  })
);
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use('/api', apiLimiter);

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/testimonials', testimonialsRoutes);
app.use('/api/faqs', faqsRoutes);
app.use('/api/properties', propertiesRoutes);
app.use('/api/blog', blogRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/listings', listingsRoutes);

// Health check
app.get('/health', (_req, res) => res.json({ status: 'ok', timestamp: new Date() }));

// Error handler (must be last)
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Aura Key API running on port ${PORT}`);
});

export default app;