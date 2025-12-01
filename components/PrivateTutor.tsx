
import React, { useState, useRef, useEffect } from 'react';
import { ChatMessage, Subject } from '../types';
import { sendMessageToGemini } from '../services/geminiService';
import { Send, Image as ImageIcon, Mic, StopCircle, User, Bot, Loader2 } from 'lucide-react';

const PrivateTutor: React.FC = () => {
  const [subject, setSubject] = useState<Subject>(Subject.MATH);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Initialize Tutor Message when subject changes
  useEffect(() => {
    setMessages([{
      id: 'init',
      role: 'model',
      text: `سلام! من معلم خصوصی درس ${subject} هستم. هر سوالی داری بپرس یا عکس سوالت رو بفرست تا برات کامل توضیح بدم.`,
      timestamp: Date.now()
    }]);
  }, [subject]);

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
    setSelectedImage(null);

    // Contextualize prompt for tutor
    const contextPrompt = `
      [نقش: معلم خصوصی درس ${subject}]
      [وظیفه: آموزش گام‌به‌گام، حل تمرین و توضیح مفاهیم]
      [کاربر سوال می‌کند: ${userMsg.text}]
      اگر کاربر صفحه خاصی خواست، سعی کن محتوای استاندارد آن صفحه را توضیح دهی.
    `;

    const responseText = await sendMessageToGemini(messages, contextPrompt, imageToSend || undefined);

    const aiMsg: ChatMessage = {
      id: (Date.now() + 1).toString(),
      role: 'model',
      text: responseText,
      timestamp: Date.now()
    };

    setMessages(prev => [...prev, aiMsg]);
    setIsLoading(false);
  };

  const startListening = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      alert("مرورگر شما از تبدیل گفتار به نوشتار پشتیبانی نمی‌کند.");
      return;
    }

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.lang = 'fa-IR';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);
    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setInput(prev => prev + ' ' + transcript);
    };

    recognition.start();
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
    <div className="flex flex-col h-[calc(100vh-140px)] bg-white dark:bg-slate-800 rounded-2xl shadow-lg border border-gray-200 dark:border-slate-700 overflow-hidden">
      
      {/* Tutor Header & Subject Selection */}
      <div className="bg-amber-500 p-4 text-white flex flex-col md:flex-row justify-between items-center gap-4 shadow-md z-10">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-white/20 rounded-full">
            <User size={24} />
          </div>
          <div>
            <h3 className="font-bold text-lg">معلم خصوصی هوشمند</h3>
            <p className="text-amber-100 text-xs">آموزش تخصصی و رفع اشکال</p>
          </div>
        </div>
        <select 
          value={subject}
          onChange={(e) => setSubject(e.target.value as Subject)}
          className="bg-white/20 border border-white/40 text-white placeholder-white rounded-xl px-4 py-2 outline-none focus:bg-white/30 [&>option]:text-black"
        >
          {Object.values(Subject).map(s => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>

      {/* Chat Area */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50 dark:bg-slate-900/50">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
            <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 border-2 ${msg.role === 'user' ? 'bg-amber-500 border-amber-600 text-white' : 'bg-white border-amber-500 text-amber-600'}`}>
              {msg.role === 'user' ? <User size={20} /> : <Bot size={20} />}
            </div>
            
            <div className={`max-w-[85%] rounded-2xl p-4 text-sm leading-relaxed shadow-sm ${
              msg.role === 'user' 
                ? 'bg-amber-500 text-white rounded-tr-none' 
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
             <div className="w-10 h-10 rounded-full bg-white border-2 border-amber-500 flex items-center justify-center shrink-0 text-amber-600">
               <Bot size={20} />
             </div>
             <div className="bg-white dark:bg-slate-800 p-4 rounded-2xl rounded-tl-none shadow-sm flex items-center gap-2">
               <Loader2 className="animate-spin text-amber-500" size={16} />
               <span className="text-xs text-gray-500">درحال نوشتن پاسخ...</span>
             </div>
           </div>
        )}
      </div>

      {/* Input Area */}
      <div className="p-4 bg-white dark:bg-slate-800 border-t border-gray-200 dark:border-slate-700">
        {selectedImage && (
          <div className="mb-2 flex items-center gap-2 bg-amber-50 dark:bg-amber-900/30 p-2 rounded-lg border border-amber-100 dark:border-amber-800">
            <img src={selectedImage} alt="Preview" className="h-10 w-10 object-cover rounded" />
            <button onClick={() => setSelectedImage(null)} className="text-red-500 text-xs hover:underline">حذف</button>
          </div>
        )}
        <div className="flex gap-2 items-end">
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleImageSelect} 
            accept="image/*" 
            className="hidden" 
          />
          <button 
            onClick={() => fileInputRef.current?.click()}
            className="p-3 mb-1 text-gray-500 dark:text-gray-400 hover:text-amber-600 dark:hover:text-amber-400 hover:bg-amber-50 dark:hover:bg-slate-700 rounded-xl transition-colors"
          >
            <ImageIcon size={24} />
          </button>
          
          <button 
            onClick={startListening}
            className={`p-3 mb-1 rounded-xl transition-colors ${isListening ? 'bg-red-500 text-white animate-pulse' : 'text-gray-500 dark:text-gray-400 hover:text-amber-600 hover:bg-amber-50 dark:hover:bg-slate-700'}`}
          >
             {isListening ? <StopCircle size={24} /> : <Mic size={24} />}
          </button>

          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => { if(e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
            placeholder="سوالت رو بنویس یا بگو..."
            className="flex-1 bg-gray-100 dark:bg-slate-700 text-gray-800 dark:text-white rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-amber-500 border-transparent border-2 focus:bg-white dark:focus:bg-slate-900 transition-all resize-none h-14 max-h-32"
          />
          
          <button 
            onClick={handleSend}
            disabled={(!input && !selectedImage) || isLoading}
            className={`p-3 mb-1 rounded-xl flex items-center justify-center transition-all ${(!input && !selectedImage) || isLoading ? 'bg-gray-200 dark:bg-slate-700 text-gray-400' : 'bg-amber-500 text-white hover:bg-amber-600 shadow-md'}`}
          >
            {isLoading ? <Loader2 size={24} className="animate-spin" /> : <Send size={24} className="rtl:-rotate-180" />}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PrivateTutor;
