import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

import { Mic, Send, Square } from 'lucide-react';
import { Link } from 'react-router-dom';

interface Message {
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

export const Concierge = () => {
  const [messages, setMessages] = useState<Message[]>([
    { id: '1', sender: 'ai', text: 'Hello. I am your FIFA Nexus Assistant. How can I help you today?' }
  ]);
  const [input, setInput] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isThinking, setIsThinking] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    // Scroll to bottom
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isThinking]);

  useEffect(() => {
    // Setup Web Speech API
    if ('webkitSpeechRecognition' in window) {
      const SpeechRecognition = (window as any).webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;

      recognition.onstart = () => setIsListening(true);
      recognition.onend = () => setIsListening(false);
      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        handleSend(transcript);
      };
      
      recognitionRef.current = recognition;
    }
  }, []);

  const toggleListen = () => {
    if (!recognitionRef.current) return;
    if (isListening) {
      recognitionRef.current.stop();
    } else {
      recognitionRef.current.start();
    }
  };

  const handleSend = async (text: string = input) => {
    if (!text.trim()) return;
    
    // Add user message
    const userMsg: Message = { id: Date.now().toString(), sender: 'user', text };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsThinking(true);

    // Call real backend API
    try {
      const response = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text,
          context: {
            language: 'English',
            location: 'Concourse A',
          },
          history: messages.map(m => ({ role: m.sender === 'ai' ? 'assistant' : 'user', content: m.text }))
        })
      });

      const data = await response.json();
      
      if (response.ok) {
        setMessages(prev => [...prev, { id: (Date.now()+1).toString(), sender: 'ai', text: data.content || data.error }]);
      } else {
        // Handle rate limiting or server errors
        setMessages(prev => [...prev, { id: (Date.now()+1).toString(), sender: 'ai', text: data.message || data.error || "I'm having trouble connecting to my systems." }]);
      }
    } catch (error) {
      setMessages(prev => [...prev, { id: (Date.now()+1).toString(), sender: 'ai', text: "Network error connecting to AI core. Please try again." }]);
    } finally {
      setIsThinking(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background relative overflow-hidden">
      <div className="absolute top-1/4 -left-20 w-96 h-96 opacity-10 blur-[100px] rounded-full theme-gradient-bg" />
      
      <header className="p-6 flex items-center justify-between glass-panel sticky top-0 z-10 border-b-0 border-t-0 border-x-0">
        <Link to="/dashboard" className="text-muted-foreground hover:text-foreground">← Back</Link>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-[hsl(var(--theme-primary))] animate-pulse" />
          <h1 className="font-semibold text-lg">Nexus AI</h1>
        </div>
        <div className="w-10" />
      </header>

      <main className="flex-1 overflow-y-auto p-6 flex flex-col space-y-6 max-w-3xl w-full mx-auto relative z-10">
        {messages.map(msg => (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            key={msg.id}
            className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div 
              className={`max-w-[85%] p-5 rounded-3xl ${
                msg.sender === 'user' 
                  ? 'bg-primary text-primary-foreground rounded-tr-sm' 
                  : 'glass-panel rounded-tl-sm'
              }`}
            >
              {msg.sender === 'user' ? (
                <p className="leading-relaxed text-sm">{msg.text}</p>
              ) : (
                <div className="space-y-1">{renderMarkdown(msg.text)}</div>
              )}
            </div>
          </motion.div>
        ))}
        {isThinking && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start">
            <div className="glass-panel px-5 py-3 rounded-2xl rounded-tl-sm flex gap-3 items-center">
              <div className="flex gap-1.5 items-center">
                <span className="w-2.5 h-2.5 rounded-full bg-[hsl(var(--theme-primary))] animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="w-2.5 h-2.5 rounded-full bg-[hsl(var(--theme-primary))] animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="w-2.5 h-2.5 rounded-full bg-[hsl(var(--theme-primary))] animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
              <span className="text-xs font-semibold text-muted-foreground animate-pulse">Nexus AI is analyzing...</span>
            </div>
          </motion.div>
        )}
        <div ref={messagesEndRef} />
      </main>

      <footer className="p-6 max-w-3xl w-full mx-auto sticky bottom-0 z-10 bg-gradient-to-t from-background via-background to-transparent pt-12">
        <div className="flex items-center gap-2 relative">
          <button 
            onClick={toggleListen}
            className={`p-4 rounded-full transition-all ${
              isListening ? 'bg-destructive text-destructive-foreground animate-pulse shadow-[0_0_20px_rgba(255,0,0,0.5)]' : 'glass-panel hover:bg-white/10'
            }`}
          >
            {isListening ? <Square className="w-6 h-6" /> : <Mic className="w-6 h-6" />}
          </button>
          <div className="flex-1 relative">
            <input 
              type="text" 
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSend()}
              placeholder="Ask me anything..."
              className="w-full glass-panel border border-[var(--theme-glass-border)] bg-transparent rounded-full px-6 py-4 outline-none focus:border-[hsl(var(--theme-primary))]/50 transition-colors"
            />
            <button 
              onClick={() => handleSend()}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-[hsl(var(--theme-primary))] hover:scale-110 transition-transform"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
};
