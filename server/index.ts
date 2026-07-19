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

// Start server
app.listen(port, () => {
  console.log(`[server]: FIFA NEXUS AI backend is running at port ${port}`);
});

// Export for serverless deployment
export default app;
