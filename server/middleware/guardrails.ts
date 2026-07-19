import { Request, Response, NextFunction } from 'express';

// Define allowed topics based on requirements
const allowedTopics = [
  'fifa world cup 2026', 'football', 'soccer', 'stadium operations',
  'match day experience', 'navigation', 'crowd management', 'transportation',
  'accessibility', 'sustainability', 'emergency support', 'volunteers',
  'fan experience', 'merchandise', 'food', 'match information',
  'team information', 'fifa', 'tickets', 'parking'
];

// Keywords that indicate an off-topic question
const bannedKeywords = [
  'python', 'javascript', 'c++', 'code', 'script', 'programming', 
  'elon musk', 'politics', 'president', 'government', 'finance', 
  'stocks', 'crypto', 'bitcoin', 'quantum physics', 'tell me a joke',
  'chatgpt', 'openai', 'gemini', 'claude', 'medical', 'doctor'
];

export const aiGuardrails = (req: Request, res: Response, next: NextFunction) => {
  const { message } = req.body;
  
  if (!message || typeof message !== 'string') {
    return res.status(400).json({ error: 'Message is required and must be a string' });
  }

  const lowercaseMessage = message.toLowerCase();

  // Check if message contains banned topics
  const hasBannedTopic = bannedKeywords.some(keyword => lowercaseMessage.includes(keyword));
  
  if (hasBannedTopic) {
    return res.json({
      role: 'assistant',
      content: "I am FIFA NEXUS AI and I am designed exclusively to assist fans and stadium operations during the FIFA World Cup experience. Please ask me anything related to football, FIFA, matches, navigation, or stadium services."
    });
  }
  
  // If it passed basic checks, let the LLM handle the nuanced filtering via system prompt
  next();
};
