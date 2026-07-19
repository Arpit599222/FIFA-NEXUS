import { useState, useEffect, useRef } from 'react';
import { Bot, AlertTriangle, Send, Activity, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
}

const renderInlineMarkdown = (text: string) => {
  const parts: any[] = [];
  let remaining = text;
  let keyIdx = 0;

  while (remaining.length > 0) {
    const boldIndex = remaining.indexOf('**');
    if (boldIndex !== -1) {
      if (boldIndex > 0) {
        parts.push(remaining.slice(0, boldIndex));
      }
      remaining = remaining.slice(boldIndex + 2);
      const closeBoldIndex = remaining.indexOf('**');
      if (closeBoldIndex !== -1) {
        parts.push(
          <strong key={keyIdx++} className="font-bold text-foreground">
            {remaining.slice(0, closeBoldIndex)}
          </strong>
        );
        remaining = remaining.slice(closeBoldIndex + 2);
      } else {
        parts.push('**' + remaining);
        break;
      }
    } else {
      parts.push(remaining);
      break;
    }
  }

  return parts;
};

const renderMarkdown = (text: string) => {
  const lines = text.split('\n');
  return lines.map((line, index) => {
    // 1. Check for headers
    if (line.startsWith('### ')) {
      return <h3 key={index} className="text-base font-bold mt-3 mb-1 text-foreground">{renderInlineMarkdown(line.slice(4))}</h3>;
    }
    if (line.startsWith('## ')) {
      return <h2 key={index} className="text-lg font-bold mt-4 mb-2 text-foreground">{renderInlineMarkdown(line.slice(3))}</h2>;
    }
    if (line.startsWith('# ')) {
      return <h1 key={index} className="text-xl font-bold mt-5 mb-2 text-foreground">{renderInlineMarkdown(line.slice(2))}</h1>;
    }

    // 2. Check for bullet points
    if (line.startsWith('* ') || line.startsWith('- ')) {
      return (
        <li key={index} className="ml-4 list-disc text-sm text-muted-foreground my-1">
          {renderInlineMarkdown(line.slice(2))}
        </li>
      );
    }

    // 3. Check for table rows
    if (line.startsWith('|') && line.endsWith('|')) {
      const cells = line.split('|').map(c => c.trim()).filter(c => c !== '');
      if (line.includes('---')) return null; // skip divider line
      return (
        <div key={index} className="flex border-b border-white/5 py-2 text-xs">
          {cells.map((cell, idx) => (
            <div key={idx} className="flex-1 font-medium">{renderInlineMarkdown(cell)}</div>
          ))}
        </div>
      );
    }

    // 4. Default paragraph line
    if (line.trim() === '') return <div key={index} className="h-2" />;
    return <p key={index} className="text-sm leading-relaxed text-muted-foreground my-1">{renderInlineMarkdown(line)}</p>;
  });
};

export function AiPlayground() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { id: 'welcome', sender: 'ai', text: 'Hello! I am connected to the NVIDIA NIM API. Ask me anything to test the connection latency, status code, and token usage metrics.' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  // Metrics & State
  const [status, setStatus] = useState<number | null>(null);
  const [timeMs, setTimeMs] = useState<number | null>(null);
  const [tokens, setTokens] = useState<number | null>(null);
  const [attempts, setAttempts] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [backendHealth, setBackendHealth] = useState<'checking' | 'connected' | 'error'>('checking');
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    checkHealth();
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const checkHealth = async () => {
    try {
      const res = await fetch('/api/health');
      if (res.ok) {
        setBackendHealth('connected');
      } else {
        setBackendHealth('error');
      }
    } catch {
      setBackendHealth('error');
    }
  };

  const handleSend = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessageText = input;
    const userMsg: ChatMessage = { id: Date.now().toString(), sender: 'user', text: userMessageText };
    
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);
    setError(null);
    setStatus(null);
    setTimeMs(null);
    setTokens(null);
    
    try {
      const startTime = Date.now();
      
      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userMessageText,
          context: { name: 'Playground Tester' },
          history: messages
            .filter(m => m.id !== 'welcome')
            .map(m => ({
              role: m.sender === 'ai' ? 'assistant' : 'user',
              content: m.text
            }))
        })
      });
      
      const data = await res.json();
      setStatus(res.status);
      
      if (!res.ok) {
        const errorMsg = data.message || data.error || 'Unknown Error';
        setError(errorMsg);
        setMessages(prev => [...prev, { id: (Date.now() + 1).toString(), sender: 'ai', text: `⚠️ Request Failed: ${errorMsg}` }]);
      } else {
        setMessages(prev => [...prev, { id: (Date.now() + 1).toString(), sender: 'ai', text: data.content }]);
        setTimeMs(data.timeMs || (Date.now() - startTime));
        setTokens(data.usage?.total_tokens || null);
        setAttempts(data.attempts || 1);
      }
    } catch (err: any) {
      setStatus(504);
      const errorMsg = err.message || 'Network Error / Gateway Timeout';
      setError(errorMsg);
      setMessages(prev => [...prev, { id: (Date.now() + 1).toString(), sender: 'ai', text: `⚠️ Network Error: ${errorMsg}` }]);
    } finally {
      setIsLoading(false);
    }
  };

  const clearChat = () => {
    setMessages([{ id: 'welcome', sender: 'ai', text: 'Chat cleared. Ask me anything to test the API.' }]);
    setStatus(null);
    setTimeMs(null);
    setTokens(null);
    setError(null);
  };

  return (
    <div className="pt-24 pb-32 px-6 max-w-6xl mx-auto space-y-6 flex flex-col h-[90vh]">
      {/* Header */}
      <div className="flex items-center justify-between shrink-0">
        <div className="flex items-center space-x-4">
          <div className="p-3 bg-[#43A1D5]/10 rounded-2xl border border-[#43A1D5]/20">
            <Bot className="w-8 h-8 text-[#43A1D5]" />
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">API Playground</h1>
            <p className="text-muted-foreground text-sm mt-0.5">Test & analyze responses from NVIDIA NIM</p>
          </div>
        </div>
        
        {/* Actions & Health */}
        <div className="flex items-center space-x-4">
          <button
            onClick={clearChat}
            className="p-2 rounded-xl glass-panel hover:bg-white/10 text-muted-foreground hover:text-foreground transition cursor-pointer"
            title="Clear Chat"
          >
            <Trash2 className="w-5 h-5" />
          </button>
          
          <div className={`px-4 py-2 rounded-full border flex items-center space-x-2 text-xs font-medium
            ${backendHealth === 'connected' ? 'bg-green-500/10 border-green-500/20 text-green-500' : 
              backendHealth === 'error' ? 'bg-red-500/10 border-red-500/20 text-red-500' : 
              'bg-yellow-500/10 border-yellow-500/20 text-yellow-500'}`}>
            <Activity className="w-3.5 h-3.5" />
            <span>{backendHealth === 'connected' ? 'Connected' : backendHealth === 'error' ? 'Offline' : 'Checking...'}</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 flex-1 min-h-0">
        {/* Left Column: Diagnostics & Metrics Panel */}
        <div className="lg:col-span-1 space-y-4 flex flex-col shrink-0">
          <div className="p-6 bg-black/40 backdrop-blur-xl border border-white/10 rounded-3xl space-y-4">
            <h3 className="font-bold text-sm text-foreground border-b border-white/5 pb-2">Telemetry</h3>
            
            <div className="space-y-4">
              {/* Status Code */}
              <div className="flex justify-between items-center">
                <span className="text-xs text-muted-foreground">HTTP Status</span>
                <span className={`text-sm font-bold ${status === 200 ? 'text-green-500' : status ? 'text-red-500' : 'text-white/60'}`}>
                  {status || 'N/A'}
                </span>
              </div>
              
              {/* Latency */}
              <div className="flex justify-between items-center">
                <span className="text-xs text-muted-foreground">Latency</span>
                <span className="text-sm font-bold text-white/80">
                  {timeMs ? `${(timeMs / 1000).toFixed(2)}s` : 'N/A'}
                </span>
              </div>
              
              {/* Token Count */}
              <div className="flex justify-between items-center">
                <span className="text-xs text-muted-foreground">Tokens</span>
                <span className="text-sm font-bold text-white/80">
                  {tokens || 'N/A'}
                </span>
              </div>

              {/* Attempts */}
              <div className="flex justify-between items-center">
                <span className="text-xs text-muted-foreground">Retries</span>
                <span className="text-sm font-bold text-white/80">
                  {attempts || '0'}
                </span>
              </div>
            </div>
            
            <div className="pt-4 border-t border-white/10 text-[10px] text-white/40 space-y-1.5">
              <p>• Model: nemotron-3-ultra-550b</p>
              <p>• reasoning_budget: 16384</p>
              <p>• temperature: 1.0</p>
            </div>
          </div>

          {error && (
            <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-start space-x-2 text-xs text-red-400">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}
        </div>

        {/* Right Column: Chat layout */}
        <div className="lg:col-span-3 glass-panel rounded-3xl flex flex-col min-h-0 relative overflow-hidden">
          <div className="absolute inset-0 opacity-5 theme-gradient-bg -z-10" />

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            <AnimatePresence initial={false}>
              {messages.map((msg) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-[85%] p-5 rounded-2xl text-sm leading-relaxed ${
                    msg.sender === 'user'
                      ? 'bg-[#43A1D5] text-white rounded-tr-none'
                      : 'bg-white/5 border border-white/10 text-foreground rounded-tl-none'
                  }`}>
                    {msg.sender === 'user' ? (
                      <p>{msg.text}</p>
                    ) : (
                      <div className="space-y-1">{renderMarkdown(msg.text)}</div>
                    )}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
            
            {isLoading && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start">
                <div className="bg-white/5 border border-white/10 rounded-2xl rounded-tl-none p-4 flex items-center space-x-2">
                  <span className="w-2 h-2 bg-foreground rounded-full animate-bounce" />
                  <span className="w-2 h-2 bg-foreground rounded-full animate-bounce delay-75" />
                  <span className="w-2 h-2 bg-foreground rounded-full animate-bounce delay-150" />
                </div>
              </motion.div>
            )}
            
            <div ref={messagesEndRef} />
          </div>

          {/* Message Input Box */}
          <form onSubmit={handleSend} className="p-4 border-t border-white/10 flex gap-2 shrink-0 bg-black/40">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask anything to test..."
              disabled={isLoading || backendHealth !== 'connected'}
              className="flex-1 px-4 py-3 rounded-xl border border-white/10 bg-white/5 text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-1 focus:ring-[#43A1D5] disabled:opacity-50"
            />
            <button
              type="submit"
              disabled={isLoading || !input.trim() || backendHealth !== 'connected'}
              className="px-6 py-3 rounded-xl bg-[#43A1D5] hover:bg-[#43A1D5]/90 text-white font-medium transition disabled:opacity-50 cursor-pointer flex items-center justify-center"
            >
              <Send className="w-5 h-5" />
            </button>
          </form>

          {/* Watermark */}
          <div className="absolute bottom-1 right-3 text-[9px] font-medium text-muted-foreground/30 pointer-events-none">
            Powered by NVIDIA NIM API
          </div>
        </div>
      </div>
    </div>
  );
}
