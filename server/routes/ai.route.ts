import { Router } from 'express';
import { aiGuardrails } from '../middleware/guardrails';
import { rateLimiter } from '../middleware/rateLimiter';
import { processAiRequest } from '../ai/ai.service';

const router = Router();

// Endpoint for the concierge AI
router.post('/chat', rateLimiter, aiGuardrails, async (req, res) => {
  try {
    const { message, context, history } = req.body;
    const response = await processAiRequest(message, context, history);
    res.json(response);
  } catch (error: any) {
    console.error('AI Route Error:', error);
    res.status(504).json({ 
      error: 'Gateway Timeout or AI Service Unavailable',
      message: 'The AI service is temporarily unavailable. Please try again.',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Test endpoint to verify NVIDIA NIM connectivity
router.get('/test', async (req, res) => {
  try {
    await processAiRequest('Hello', { name: 'Health Check' });
    res.json({ status: 'connected' });
  } catch (error: any) {
    res.status(504).json({ 
      status: 'error',
      message: 'Failed to connect to NVIDIA NIM API'
    });
  }
});

export default router;
