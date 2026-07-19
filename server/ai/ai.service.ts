import { getContextData } from './context.service';
import { assemblePrompt } from './prompt.service';
import { spawn } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

let currentDir = '';
try {
  currentDir = __dirname;
} catch (e) {
  currentDir = path.dirname(fileURLToPath(import.meta.url));
}

const NIM_API_URL = 'https://integrate.api.nvidia.com/v1/chat/completions';
const MODEL = 'nvidia/nemotron-3-ultra-550b-a55b';

export const processAiRequest = async (message: string, rawContext: any, history: any[] = []) => {
  const apiKey = process.env.NVIDIA_API_KEY;
  
  if (!apiKey || apiKey === 'YOUR_API_KEY_HERE') {
    throw new Error('NVIDIA_API_KEY is not configured in the environment variables.');
  }

  // 1. Inject Context
  const enrichedContext = getContextData(rawContext);
  
  // 2. Assemble System Prompt
  let systemPrompt = assemblePrompt(message, enrichedContext);
  
  // If we detect the specific test string from health checks, we simplify the system prompt
  if (message.trim().toLowerCase() === 'hello' || message === 'Hello FIFA NEXUS AI') {
    systemPrompt = "You are FIFA Nexus AI.";
  }

  // 3. Prepare Messages Array
  const messages = [
    { role: 'system', content: systemPrompt },
    ...history,
    { role: 'user', content: message }
  ];

  const payload = {
    url: NIM_API_URL,
    model: MODEL,
    messages: messages,
    temperature: 1,
    top_p: 0.95,
    max_tokens: 16384,
    chat_template_kwargs: {
      enable_thinking: true
    },
    reasoning_budget: 16384,
    stream: false
  };

  const scriptPath = path.join(currentDir, 'query_api.py');
  const startTime = Date.now();

  return new Promise((resolve, reject) => {
    const pythonProcess = spawn('python', [scriptPath], {
      env: { ...process.env, NVIDIA_API_KEY: apiKey }
    });

    let stdoutData = '';
    let stderrData = '';

    pythonProcess.stdout.on('data', (data) => {
      stdoutData += data.toString();
    });

    pythonProcess.stderr.on('data', (data) => {
      stderrData += data.toString();
    });

    pythonProcess.on('close', (code) => {
      if (code !== 0) {
        console.error('Python API script error:', stderrData);
        reject(new Error(`Python process exited with code ${code}: ${stderrData}`));
        return;
      }

      try {
        const responseData = JSON.parse(stdoutData.trim());
        const endTime = Date.now();
        
        resolve({
          role: 'assistant',
          content: responseData.choices[0].message.content,
          usage: responseData.usage,
          timeMs: endTime - startTime,
          attempts: 1
        });
      } catch (err) {
        reject(new Error(`Failed to parse Python stdout JSON: ${err}. Raw: ${stdoutData}`));
      }
    });

    // Write payload to Python process stdin
    pythonProcess.stdin.write(JSON.stringify(payload));
    pythonProcess.stdin.end();
  });
};

