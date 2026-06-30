import React, { useState, useEffect, useRef } from 'react';
import { apiFetch } from '../utils/api.js';
import { useToast } from '../context/ToastContext.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles,
  Send,
  Loader2,
  User as UserIcon,
  Bot,
} from 'lucide-react';

const SUGGESTED_PROMPTS = [
  'Where did I spend the most?',
  'How much did I save this month?',
  'Suggest ways to reduce spending.',
  'Predict next month\'s spending.',
];

const AIChat = () => {
  const { user } = useAuth();
  const { showToast } = useToast();
  const chatEndRef = useRef(null);

  const [message, setMessage] = useState('');
  const [history, setHistory] = useState([
    {
      role: 'assistant',
      content: `Hello ${user?.name || 'there'}! I'm **Credo AI**, your virtual financial advisor. I have analyzed your income registries, active category budgets, and savings goals.

Ask me anything about your finances! For example:
- *Where did I spend the most?*
- *How much did I save?*
- *How can I optimize my budgets?*`,
    },
  ]);
  const [loading, setLoading] = useState(false);

  // Auto-scroll to bottom of chat
  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [history, loading]);

  const handleSendMessage = async (textToSend) => {
    const text = textToSend || message;
    if (!text.trim()) return;

    // Append user message
    const updatedHistory = [...history, { role: 'user', content: text }];
    setHistory(updatedHistory);
    setMessage('');
    setLoading(true);

    try {
      // API call to ai chat controller
      const res = await apiFetch('/ai/chat', {
        method: 'POST',
        body: JSON.stringify({
          message: text,
          history: updatedHistory.slice(1), // omit the initial welcome message from Gemini API
        }),
      });

      setHistory((prev) => [...prev, { role: 'assistant', content: res.data.reply }]);
    } catch (err) {
      showToast(err.message || 'Failed to generate AI response', 'error');
      setHistory((prev) => [
        ...prev,
        { role: 'assistant', content: '⚠️ **System Error:** Sorry, I encountered an issue generating a response. Please check your network connection.' },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    handleSendMessage();
  };

  // Convert markdown-like syntax to HTML for bubbles
  const renderMessageContent = (content) => {
    // Simple regex replacements for bold and lists in chat
    let html = content
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/^- (.*?)$/gm, '• $1')
      .replace(/\n/g, '<br />');
    
    return <span dangerouslySetInnerHTML={{ __html: html }} />;
  };

  return (
    <div className="h-[calc(100vh-140px)] flex flex-col justify-between bg-slate-900/40 border border-slate-800/80 backdrop-blur-md rounded-2xl overflow-hidden shadow-inner text-left font-sans">
      
      {/* Header bar */}
      <div className="p-4 bg-slate-900/60 border-b border-slate-800 flex items-center gap-3">
        <div className="p-2 bg-emerald-500/10 text-emerald-400 rounded-xl border border-emerald-500/10">
          <Sparkles className="w-4 h-4" />
        </div>
        <div>
          <h3 className="text-sm font-bold text-white leading-none">Credo Financial Assistant</h3>
          <span className="text-[10px] text-emerald-400 font-semibold flex items-center gap-1 mt-1">
            <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
            Gemini Active Advisor
          </span>
        </div>
      </div>

      {/* Messages Scroll thread */}
      <div className="flex-1 p-4 overflow-y-auto space-y-4">
        {history.map((msg, idx) => {
          const isUser = msg.role === 'user';
          return (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex gap-3 max-w-[80%] ${isUser ? 'self-end ml-auto flex-row-reverse' : 'self-start mr-auto'}`}
            >
              {/* Avatar */}
              <div className={`w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center border ${
                isUser ? 'bg-slate-800 border-slate-700' : 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
              }`}>
                {isUser ? <UserIcon className="w-4 h-4 text-slate-300" /> : <Bot className="w-4 h-4" />}
              </div>

              {/* Bubble */}
              <div className={`p-4 rounded-2xl text-xs leading-relaxed ${
                isUser
                  ? 'bg-emerald-600 text-white rounded-tr-none shadow-md shadow-emerald-950/20'
                  : 'bg-slate-950 border border-slate-850 text-slate-200 rounded-tl-none'
              }`}>
                {renderMessageContent(msg.content)}
              </div>
            </motion.div>
          );
        })}

        {/* Loading Indicator */}
        <AnimatePresence>
          {loading && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="flex gap-3 max-w-[80%] self-start mr-auto"
            >
              <div className="w-8 h-8 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center">
                <Bot className="w-4 h-4" />
              </div>
              <div className="p-4 bg-slate-950 border border-slate-850 rounded-2xl rounded-tl-none flex items-center gap-2 text-slate-400 text-xs font-semibold">
                <Loader2 className="w-3.5 h-3.5 animate-spin text-emerald-400" />
                Formulating advice...
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div ref={chatEndRef} />
      </div>

      {/* Input container */}
      <div className="p-4 bg-slate-900/60 border-t border-slate-800 space-y-4">
        
        {/* Suggestion Chips */}
        {history.length <= 1 && !loading && (
          <div className="flex gap-2 overflow-x-auto pb-1">
            {SUGGESTED_PROMPTS.map((prompt) => (
              <button
                key={prompt}
                onClick={() => handleSendMessage(prompt)}
                className="px-3 py-1.5 bg-slate-950 border border-slate-850 hover:border-slate-800 rounded-xl text-[10px] font-bold text-slate-400 hover:text-white cursor-pointer transition-all shrink-0 shadow-inner"
              >
                {prompt}
              </button>
            ))}
          </div>
        )}

        <form onSubmit={handleFormSubmit} className="flex gap-2">
          <input
            type="text"
            placeholder="Type a message (e.g. Where did I spend the most?)..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            disabled={loading}
            className="flex-1 px-4 py-3 bg-slate-950 border border-slate-850 focus:border-emerald-500 rounded-xl text-xs outline-none text-white placeholder-slate-600 disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={loading || !message.trim()}
            className="p-3 bg-emerald-600 hover:bg-emerald-500 disabled:bg-slate-800 disabled:text-slate-600 rounded-xl text-white transition-colors cursor-pointer flex items-center justify-center shadow-lg shadow-emerald-950/20"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>

      </div>

    </div>
  );
};

export default AIChat;
