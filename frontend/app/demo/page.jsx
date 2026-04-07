// Enable client-side rendering (Next.js App Router)
"use client";

// Import React hook
import { useState } from 'react';

// Import animation utilities from Framer Motion
import { motion, AnimatePresence } from 'framer-motion';

// Import icons from lucide-react
import { Send, Bot, Sparkles, ArrowRight, Lock } from 'lucide-react';

// Import Link for navigation
import Link from 'next/link';

// Main Demo Page Component
export default function DemoPage() {

  // Store chat messages (bot + user)
  const [messages, setMessages] = useState([
    { role: 'bot', text: 'Welcome to the Demo! Ask me anything to see how I work.' }
  ]);

  // Store user input text
  const [input, setInput] = useState("");

  // Control modal visibility (demo limit popup)
  const [showModal, setShowModal] = useState(false);

  // Function to handle sending messages
  const handleSend = () => {

    // Prevent sending empty messages
    if (!input.trim()) return;

    // Check demo limit (only allow 2 user messages)
    if (messages.filter(m => m.role === 'user').length >= 2) {
      setShowModal(true); // Show upgrade modal
      return;
    }

    // Add user message to chat
    const newMessages = [...messages, { role: 'user', text: input }];
    setMessages(newMessages);

    // Clear input field
    setInput("");

    // Simulate bot response (fake delay)
    setTimeout(() => {
      setMessages([
        ...newMessages,
        {
          role: 'bot',
          text: 'This is a demo response. To unlock full features like PDF analysis and history, please create an account!'
        }
      ]);
    }, 1000); // 1 second delay
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col items-center p-4">

      {/* Demo Header */}
      <div className="w-full max-w-4xl flex justify-between items-center py-6">

        {/* Logo + Title */}
        <div className="flex items-center gap-2 font-bold text-xl text-indigo-400">
          <Bot /> 
          AgnosticChat 
          <span className="text-xs bg-indigo-500/20 px-2 py-1 rounded text-indigo-300">
            DEMO
          </span>
        </div>

        {/* Exit demo link */}
        <Link 
          href="/" 
          className="text-sm text-slate-400 hover:text-white transition"
        >
          Exit Demo
        </Link>
      </div>

      {/* Chat Window */}
      <div className="w-full max-w-2xl flex-1 flex flex-col bg-slate-900/50 border border-slate-800 rounded-3xl overflow-hidden backdrop-blur-xl shadow-2xl relative">

        {/* Messages area */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">

          {/* Loop through messages */}
          {messages.map((msg, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 10 }} // animation start
              animate={{ opacity: 1, y: 0 }} // animation end
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {/* Message bubble */}
              <div className={`p-4 rounded-2xl max-w-[80%] ${
                msg.role === 'user'
                  ? 'bg-indigo-600' // user message style
                  : 'bg-slate-800 border border-slate-700 text-slate-200' // bot message style
              }`}>
                {msg.text}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Input Area */}
        <div className="p-4 bg-slate-900/80 border-t border-slate-800 flex gap-2">

          {/* Text input */}
          <input 
            value={input}
            onChange={(e) => setInput(e.target.value)} // update input state
            placeholder="Type a demo message..."
            className="flex-1 bg-transparent border border-slate-700 rounded-xl px-4 py-2 outline-none focus:border-indigo-500 transition"
          />

          {/* Send button */}
          <button 
            onClick={handleSend}
            className="p-3 bg-indigo-600 rounded-xl hover:bg-indigo-500 transition"
          >
            <Send size={20} />
          </button>
        </div>
      </div>

      {/* Modal (shown after demo limit reached) */}
      <AnimatePresence>
        {showModal && (

          // Background overlay
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
          >

            {/* Modal content */}
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              className="bg-slate-900 border border-indigo-500/50 p-8 rounded-3xl max-w-md w-full text-center shadow-[0_0_50px_rgba(79,70,229,0.3)]"
            >

              {/* Lock icon */}
              <div className="w-16 h-16 bg-indigo-500/20 text-indigo-400 rounded-full flex items-center justify-center mx-auto mb-6">
                <Lock size={32} />
              </div>

              {/* Title */}
              <h2 className="text-2xl font-bold mb-2">
                Demo Limit Reached
              </h2>

              {/* Description */}
              <p className="text-slate-400 mb-8">
                You've experienced the power of AgnosticChat. Sign up now to unlock unlimited chats, PDF uploads, and multi-language history.
              </p>

              {/* Action buttons */}
              <div className="flex flex-col gap-3">

                {/* Register button */}
                <Link 
                  href="/register"
                  className="flex items-center justify-center gap-2 w-full py-4 bg-indigo-600 rounded-xl font-bold hover:bg-indigo-500 transition"
                >
                  Create Free Account <ArrowRight size={18} />
                </Link>

                {/* Login button */}
                <Link 
                  href="/login"
                  className="w-full py-4 bg-slate-800 text-slate-300 rounded-xl font-bold hover:bg-slate-700 transition"
                >
                  Login to Existing
                </Link>

              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}