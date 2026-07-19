import dotenv from 'dotenv';
dotenv.config();

import { processAiRequest } from './server/ai/ai.service';

async function runTest() {
  console.log('--- NVIDIA NIM API TEST ---');
  console.log('User Prompt: "Hello FIFA NEXUS AI"');
  
  try {
    const response: any = await processAiRequest("Who's matches today on 19th of July 2026?", { name: 'Test User' });
    console.log('\n--- SUCCESSFUL RESPONSE ---');
    console.log(response.content);
  } catch (error) {
    console.error('\n--- TEST FAILED ---');
    console.error(error);
  }
}

runTest();
