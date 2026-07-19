import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import aiRoutes from './routes/ai.route';
import healthRoutes from './routes/health.route';

dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/ai', aiRoutes);
app.use('/api/health', healthRoutes);

// Start server (only if not running in a serverless environment)
if (process.env.NODE_ENV !== 'production') {
  app.listen(port, () => {
    console.log(`[server]: FIFA NEXUS AI backend is running at http://localhost:${port}`);
  });
}

// Export for serverless deployment
export default app;
