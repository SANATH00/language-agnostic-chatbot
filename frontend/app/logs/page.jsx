"use client";
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { History, ArrowLeft, Trash2, FileText, MessageSquare, Bot, Sparkles } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function LogsPage() {
  const [logs, setLogs] = useState([]);
  const router = useRouter();

  useEffect(() => {
    const savedLogs = JSON.parse(localStorage.getItem('chatLogs') || '[]');
    setLogs(savedLogs);
  }, []);

  const clearLogs = () => {
    localStorage.removeItem('chatLogs');
    setLogs([]);
  };

  const handleContinueChat = (log) => {
    // In a real app, you'd load the full message array here.
    // For now, we simulate "continuing" by telling the chat page which log is active.
    localStorage.setItem('activeChatSession', JSON.stringify(log));
    router.push('/chat');
  };

  return (
    <div className="relative min-h-screen bg-[#030712] text-slate-200 overflow-hidden font-sans">
      
      {/* BACKGROUND AURA (Matches Chat Page) */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div 
          animate={{ scale: [1, 1.2, 1], opacity: [0.1, 0.2, 0.1] }}
          transition={{ duration: 15, repeat: Infinity }}
          className="absolute -top-[10%] -right-[5%] w-[50%] h-[50%] bg-indigo-600/10 rounded-full blur-[120px]"
        />
        <motion.div 
          animate={{ scale: [1, 1.3, 1], opacity: [0.05, 0.15, 0.05] }}
          transition={{ duration: 20, repeat: Infinity, delay: 2 }}
          className="absolute -bottom-[10%] -left-[10%] w-[60%] h-[60%] bg-cyan-600/10 rounded-full blur-[120px]"
        />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto p-6 md:p-12">
        
        {/* HEADER NAVIGATION */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex justify-between items-center mb-12"
        >
          <Link href="/chat" className="group flex items-center gap-2 text-slate-400 hover:text-indigo-400 transition-all font-bold">
            <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform"/> 
            Back to Chat
          </Link>
          
          {logs.length > 0 && (
            <button 
              onClick={clearLogs} 
              className="flex items-center gap-2 px-4 py-2 bg-red-500/10 text-red-400 rounded-xl border border-red-500/20 hover:bg-red-500 hover:text-white transition-all text-xs font-bold uppercase tracking-wider"
            >
              <Trash2 size={14}/> Clear All
            </button>
          )}
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10"
        >
          <div className="flex items-center gap-4 mb-2">
            <div className="p-3 bg-indigo-600 rounded-2xl shadow-lg shadow-indigo-500/20">
              <History size={24} className="text-white"/>
            </div>
            <h1 className="text-4xl font-black tracking-tighter text-white">Activity History</h1>
          </div>
          <p className="text-slate-500 font-medium">Review and continue your previous AI sessions.</p>
        </motion.div>

        {/* LOGS LIST */}
        <div className="space-y-4">
          <AnimatePresence>
            {logs.length === 0 ? (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="p-20 text-center border-2 border-dashed border-slate-800 rounded-[3rem] text-slate-500 bg-slate-900/20"
              >
                <div className="inline-flex p-4 bg-slate-800/50 rounded-full mb-4">
                  <Sparkles size={32} className="text-slate-600" />
                </div>
                <p className="font-medium">No history yet. Start a conversation to see it here.</p>
              </motion.div>
            ) : (
              logs.map((log, index) => (
                <motion.div 
                  key={log.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  whileHover={{ scale: 1.02, x: 5 }}
                  onClick={() => handleContinueChat(log)}
                  className="group cursor-pointer p-6 bg-slate-900/40 border border-slate-800/60 backdrop-blur-xl rounded-[2rem] flex justify-between items-center shadow-xl hover:border-indigo-500/50 transition-all relative overflow-hidden"
                >
                  {/* Hover Glow Effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  
                  <div className="flex items-center gap-5 relative z-10">
                    <div className={`p-4 rounded-2xl transition-colors ${
                      log.type === "File" 
                      ? "bg-cyan-500/10 text-cyan-400 group-hover:bg-cyan-500 group-hover:text-white" 
                      : "bg-indigo-500/10 text-indigo-400 group-hover:bg-indigo-500 group-hover:text-white"
                    }`}>
                      {log.type === "File" ? <FileText size={24}/> : <MessageSquare size={24}/>}
                    </div>
                    <div>
                      <h3 className="font-bold text-lg text-white group-hover:text-indigo-400 transition-colors line-clamp-1">
                        {log.title}
                      </h3>
                      <div className="flex items-center gap-3 mt-1 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                        <span className={log.type === "File" ? "text-cyan-500" : "text-indigo-500"}>{log.type}</span>
                        <span>•</span>
                        <span>{log.date}</span>
                        <span>•</span>
                        <span>{log.timestamp}</span>
                      </div>
                    </div>
                  </div>

                  <div className="opacity-0 group-hover:opacity-100 transition-all transform translate-x-4 group-hover:translate-x-0 relative z-10">
                     <div className="flex items-center gap-2 text-indigo-400 font-bold text-sm">
                        Continue <Bot size={16} />
                     </div>
                  </div>
                </motion.div>
              ))
            )}
          </AnimatePresence>
        </div>
        
        {/* FOOTER INFO */}
        <p className="text-center text-[10px] text-slate-700 mt-12 tracking-widest uppercase">
          Logs are stored locally on your device for privacy.
        </p>
      </div>
    </div>
  );
}