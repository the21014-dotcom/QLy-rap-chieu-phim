// src/components/AIChatBot.tsx

import React, { useState, useRef, useEffect } from 'react';
import { 
  MessageCircle, 
  X, 
  Send, 
  Bot, 
  Sparkles,
  Ticket,
  Play,
  Loader2,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import axiosClient from '../api/axiosClient';

// ============== TYPES ==============

interface IMessage {
  id: string;
  text: string;
  isBot: boolean;
  type?: 'TEXT' | 'MOVIE_LIST' | 'SHOWTIME_LIST' | 'BOOKING_INFO';
  data?: unknown;
  suggestions?: string[];
  timestamp: Date;
}

interface IMovie {
  id: number;
  title: string;
  poster_url?: string;
  duration: number;
  rating: string;
  genres?: { genre: { name: string } }[];
}

interface IQuickAction {
  label: string;
  intent: string;
}

// ============== MAIN COMPONENT ==============

const AIChatBot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<IMessage[]>([
    {
      id: 'welcome',
      text: 'Xin chào! 👋\n\nTôi là trợ lý ảo CGV. Bạn cần hỗ trợ gì về phim hay lịch chiếu hôm nay?',
      isBot: true,
      type: 'TEXT',
      suggestions: ['🎬 Phim đang chiếu', '📅 Lịch chiếu hôm nay', '🍿 Đặt vé ngay'],
      timestamp: new Date()
    }
  ]);
  const [quickActions, setQuickActions] = useState<IQuickAction[]>([]);
  
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Load quick actions khi mở chat
  useEffect(() => {
    if (isOpen && quickActions.length === 0) {
      fetchQuickActions();
    }
  }, [isOpen]);

  // Scroll to bottom khi có tin nhắn mới
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }
  }, [messages, isOpen]);

  // Auto focus input khi mở chat
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [isOpen]);

  // ============== API CALLS ==============

  const fetchQuickActions = async () => {
    try {
      const response = await axiosClient.get('/chat/quick-actions');
      if (response.data?.data?.actions) {
        setQuickActions(response.data.data.actions);
      }
    } catch (error) {
      console.error('Failed to load quick actions:', error);
      // Quick actions mặc định
      setQuickActions([
        { label: '🎬 Phim đang chiếu', intent: 'now_showing' },
        { label: '📅 Lịch chiếu hôm nay', intent: 'today_showtime' },
        { label: '🍿 Mua vé ngay', intent: 'book_ticket' },
        { label: '❓ Liên hệ hỗ trợ', intent: 'support' },
      ]);
    }
  };

  const sendMessage = async (text: string) => {
    if (!text.trim()) return;

    const userMsg: IMessage = {
      id: `user-${Date.now()}`,
      text: text.trim(),
      isBot: false,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await axiosClient.post('/chat', {
        message: text.trim()
      });

      const botMsg: IMessage = {
        id: `bot-${Date.now()}`,
        text: response.data?.reply || 'Xin lỗi, có lỗi xảy ra.',
        isBot: true,
        type: response.data?.type || 'TEXT',
        data: response.data?.data,
        suggestions: response.data?.suggestions,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, botMsg]);
    } catch (error: unknown) {
      console.error('Chat error:', error);
      const errorMsg: IMessage = {
        id: `error-${Date.now()}`,
        text: 'Kết nối bị gián đoạn rồi! 😢\n\nBạn vui lòng thử lại sau nhé.',
        isBot: true,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSend = () => sendMessage(input);

  const handleQuickAction = (action: IQuickAction) => {
    const intentText: Record<string, string> = {
      now_showing: 'Cho mình xem phim đang chiếu',
      today_showtime: 'Lịch chiếu hôm nay',
      book_ticket: 'Mua vé xem phim',
      support: 'Liên hệ hỗ trợ',
      favorites: 'Phim yêu thích',
      my_reviews: 'Xem đánh giá của tôi',
    };
    sendMessage(intentText[action.intent] || action.label);
  };

  const handleSuggestionClick = (suggestion: string) => {
    sendMessage(suggestion);
  };

  // ============== RENDER HELPERS ==============

  const renderMovieCard = (movie: IMovie) => (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex gap-3 p-2 bg-slate-50 rounded-lg border border-slate-100"
    >
      <div className="w-16 h-24 rounded-md overflow-hidden bg-slate-200 flex-shrink-0">
        {movie.poster_url ? (
          <img 
            src={movie.poster_url} 
            alt={movie.title} 
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-slate-400">
            <Play size={20} />
          </div>
        )}
      </div>
      <div className="flex-1 min-w-0">
        <h4 className="font-semibold text-slate-800 text-sm truncate">{movie.title}</h4>
        <p className="text-xs text-slate-500 mt-0.5">
          {movie.duration}p • {movie.rating}
        </p>
        {movie.genres && (
          <p className="text-xs text-amber-600 mt-1 truncate">
            {movie.genres.map(g => g.genre.name).join(', ')}
          </p>
        )}
        <button className="mt-2 text-xs text-red-600 font-medium flex items-center gap-1 hover:text-red-700">
          <Ticket size={12} /> Đặt vé ngay
        </button>
      </div>
    </motion.div>
  );

  const renderMessageContent = (msg: IMessage) => {
    // Render movie list
    if (msg.type === 'MOVIE_LIST' && msg.data) {
      const movies = msg.data as IMovie[];
      return (
        <div className="space-y-2">
          <p className="text-sm">{msg.text}</p>
          <div className="grid gap-2">
            {movies.map(movie => (
              <div key={movie.id}>{renderMovieCard(movie)}</div>
            ))}
          </div>
        </div>
      );
    }

    // Render showtime list
    if (msg.type === 'SHOWTIME_LIST' && msg.data) {
      const showtimes = msg.data as { time: string; movie: string }[];
      return (
        <div className="space-y-2">
          <p className="text-sm">{msg.text}</p>
          <div className="space-y-1">
            {showtimes.map((st, idx) => (
              <div key={idx} className="flex justify-between items-center p-2 bg-amber-50 rounded text-sm">
                <span className="font-medium text-slate-800">{st.movie}</span>
                <span className="text-amber-600 font-semibold">{st.time}</span>
              </div>
            ))}
          </div>
        </div>
      );
    }

    // Default text
    return <p className="text-sm whitespace-pre-line">{msg.text}</p>;
  };

  // ============== RENDER ==============

  return (
    <div className="fixed bottom-6 right-6 z-[9999] font-sans antialiased flex flex-col items-end">
      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 20 }}
            transition={{ type: 'spring', damping: 20, stiffness: 260 }}
            className="absolute bottom-20 right-0 w-[380px] h-[600px] bg-white rounded-[24px] shadow-[0_12px_40px_rgba(0,0,0,0.15)] flex flex-col overflow-hidden border border-slate-100"
          >
            {/* Header */}
            <div className="px-5 py-4 bg-white flex items-center justify-between border-b border-slate-50 shrink-0">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-10 h-10 bg-red-50 rounded-xl flex items-center justify-center text-[#E71A0F]">
                    <Bot size={22} />
                  </div>
                  <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 border-2 border-white rounded-full"></div>
                </div>
                <div>
                  <h3 className="font-bold text-slate-800 text-[14px]">CGV Assistant</h3>
                  <p className="text-[11px] font-medium text-slate-400 flex items-center gap-1">
                    <Sparkles size={11} className="text-amber-500" /> AI-powered support
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-lg transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            {/* Quick Actions (Collapsible) */}
            <div className="px-4 py-2 bg-slate-50 border-b border-slate-100 overflow-x-auto flex gap-2 shrink-0 scrollbar-hide">
              {quickActions.map((action, idx) => (
                <button
                  key={idx}
                  onClick={() => handleQuickAction(action)}
                  className="whitespace-nowrap px-3 py-1.5 text-xs font-medium text-slate-600 bg-white border border-slate-200 rounded-full hover:bg-red-50 hover:border-red-200 hover:text-red-600 transition-all"
                >
                  {action.label}
                </button>
              ))}
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-50/50">
              {messages.map((msg) => (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  key={msg.id}
                  className={`flex ${msg.isBot ? 'justify-start' : 'justify-end'}`}
                >
                  <div
                    className={`max-w-[85%] px-4 py-3 rounded-[18px] text-[13px] leading-[1.6] shadow-sm ${
                      msg.isBot
                        ? 'bg-white text-slate-700 rounded-tl-none border border-slate-100'
                        : 'bg-[#E71A0F] text-white rounded-tr-none font-medium'
                    }`}
                  >
                    {renderMessageContent(msg)}
                  </div>
                </motion.div>
              ))}

              {/* Loading */}
              {isLoading && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex items-center gap-1.5 px-3 py-2 bg-white border border-slate-100 rounded-[18px] rounded-tl-none w-16 shadow-sm"
                >
                  <Loader2 size={14} className="text-slate-400 animate-spin" />
                </motion.div>
              )}

              {/* Suggestions */}
              <AnimatePresence>
                {messages.length > 0 && !isLoading && messages[messages.length - 1]?.isBot && messages[messages.length - 1]?.suggestions && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="flex flex-wrap gap-2"
                  >
                    {messages[messages.length - 1].suggestions?.map((suggestion, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleSuggestionClick(suggestion)}
                        className="px-3 py-1.5 text-xs font-medium text-slate-600 bg-white border border-slate-200 rounded-full hover:bg-red-50 hover:border-red-200 hover:text-red-600 transition-all"
                      >
                        {suggestion}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>

              <div ref={scrollRef} />
            </div>

            {/* Input */}
            <div className="p-3.5 bg-white border-t border-slate-50 shrink-0">
              <div className="flex items-center bg-slate-50 rounded-xl px-2.5 py-0.5 border border-slate-100 transition-all focus-within:border-red-200 focus-within:bg-white focus-within:shadow-sm">
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleSend()}
                  placeholder="Hỏi về lịch chiếu, giá vé..."
                  className="flex-1 bg-transparent border-none py-2.5 px-2 text-[13px] outline-none text-slate-700 placeholder:text-slate-400"
                  disabled={isLoading}
                />
                <button
                  onClick={handleSend}
                  disabled={!input.trim() || isLoading}
                  className={`p-2 rounded-lg transition-all ${
                    input.trim() && !isLoading
                      ? 'text-[#E71A0F] hover:bg-red-50'
                      : 'text-slate-300 cursor-not-allowed'
                  }`}
                >
                  {isLoading ? (
                    <Loader2 size={18} className="animate-spin" />
                  ) : (
                    <Send size={18} fill={input.trim() ? 'currentColor' : 'none'} />
                  )}
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Toggle Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="bg-[#E71A0F] text-white p-4 rounded-full shadow-[0_4px_20px_rgba(231,26,15,0.3)] flex items-center justify-center border border-white/10 relative"
      >
        {isOpen ? <X size={22} /> : <MessageCircle size={22} />}
        
        {/* Notification dot */}
        {!isOpen && messages.length === 1 && (
          <span className="absolute top-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-white rounded-full"></span>
        )}
      </motion.button>
    </div>
  );
  };

  export default AIChatBot;