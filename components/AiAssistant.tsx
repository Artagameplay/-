import React, { useState, useRef, useEffect } from 'react';
import { ChatMessage } from '../types';
import { sendMessageToGemini } from '../services/geminiService';
import { Send, Image as ImageIcon, Sparkles, Loader2, Bot, User } from 'lucide-react';

const AiAssistant: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'model',
      text: 'سلام آرتا جان! 👋 من درس‌یار هستم. می‌تونی هر سوالی درباره درس‌هات داری ازم بپرسی. حتی می‌تونی عکس تمرینت رو بفرستی تا کمکت کنم!',
      timestamp: Date.now()
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  const handleSend = async () => {
    if ((!input.trim() && !selectedImage) || isLoading) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      text: input,
      timestamp: Date.now(),
      attachments: selectedImage ? [{ name: 'Image', type: 'image' }] : undefined
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    const imageToSend = selectedImage;
    setSelectedImage(null); // Clear after sending

    const responseText = await sendMessageToGemini(messages, userMsg.text, imageToSend || undefined);

    const aiMsg: ChatMessage = {
      id: (Date.now() + 1).toString(),
      role: 'model',
      text: responseText,
      timestamp: Date.now()
    };

    setMessages(prev => [...prev, aiMsg]);
    setIsLoading(false);
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="flex flex-col h-[600px] bg-white dark:bg-slate-800 rounded-2xl shadow-lg border border-gray-200 dark:border-slate-700 overflow-hidden transition-colors">
      {/* Header */}
      <div className="bg-indigo-600 dark:bg-indigo-700 p-4 text-white flex items-center gap-3 shadow-md">
        <div className="p-2 bg-white/20 rounded-full animate-pulse">
          <Sparkles size={24} />
        </div>
        <div>
          <h3 className="font-bold text-lg">دستیار هوشمند</h3>
          <p className="text-indigo-100 text-xs">پاسخگویی به سوالات درسی با Gemini</p>
        </div>
      </div>

      {/* Chat Area */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50 dark:bg-slate-900/50">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'} animate-in slide-in-from-bottom-2 fade-in duration-300`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${msg.role === 'user' ? 'bg-indigo-500 text-white' : 'bg-emerald-500 text-white'}`}>
              {msg.role === 'user' ? <User size={16} /> : <Bot size={16} />}
            </div>
            
            <div className={`max-w-[80%] rounded-2xl p-4 text-sm leading-relaxed shadow-sm ${
              msg.role === 'user' 
                ? 'bg-indigo-500 text-white rounded-tr-none' 
                : 'bg-white dark:bg-slate-800 dark:text-gray-200 border border-gray-200 dark:border-slate-700 rounded-tl-none'
            }`}>
              {msg.attachments && (
                 <div className="mb-2 p-1 bg-white/20 rounded text-xs flex items-center gap-1">
                   <ImageIcon size={12} />
                   <span>تصویر پیوست شده</span>
                 </div>
              )}
              <div className="whitespace-pre-wrap">{msg.text}</div>
            </div>
          </div>
        ))}
        
        {isLoading && (
          <div className="flex gap-3 animate-pulse">
             <div className="w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center shrink-0 text-white">
               <Bot size={16} />
             </div>
             <div className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 p-4 rounded-2xl rounded-tl-none shadow-sm flex items-center gap-2 text-gray-500 dark:text-gray-400">
               <Loader2 className="animate-spin" size={16} />
               <span className="text-xs">درحال فکر کردن...</span>
             </div>
          </div>
        )}
      </div>

      {/* Input Area */}
      <div className="p-4 bg-white dark:bg-slate-800 border-t border-gray-200 dark:border-slate-700">
        {selectedImage && (
          <div className="mb-2 flex items-center gap-2 bg-indigo-50 dark:bg-indigo-900/30 p-2 rounded-lg border border-indigo-100 dark:border-indigo-800">
            <img src={selectedImage} alt="Preview" className="h-10 w-10 object-cover rounded" />
            <span className="text-xs text-indigo-700 dark:text-indigo-300 truncate flex-1">تصویر انتخاب شد</span>
            <button onClick={() => setSelectedImage(null)} className="text-red-500 text-xs hover:underline">حذف</button>
          </div>
        )}
        <div className="flex gap-2">
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleImageSelect} 
            accept="image/*" 
            className="hidden" 
          />
          <button 
            onClick={() => fileInputRef.current?.click()}
            className="p-3 text-gray-500 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-slate-700 rounded-xl transition-colors"
            title="ارسال تصویر"
          >
            <ImageIcon size={20} />
          </button>
          
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="سوالت رو بپرس..."
            className="flex-1 bg-gray-100 dark:bg-slate-700 text-gray-800 dark:text-white rounded-xl px-4 focus:outline-none focus:ring-2 focus:ring-indigo-500 border-transparent border-2 focus:bg-white dark:focus:bg-slate-900 transition-all"
          />
          
          <button 
            onClick={handleSend}
            disabled={(!input && !selectedImage) || isLoading}
            className={`p-3 rounded-xl flex items-center justify-center transition-all ${(!input && !selectedImage) || isLoading ? 'bg-gray-200 dark:bg-slate-700 text-gray-400' : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-md'}`}
          >
            {isLoading ? <Loader2 size={20} className="animate-spin" /> : <Send size={20} className="rtl:-rotate-180" />}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AiAssistant;