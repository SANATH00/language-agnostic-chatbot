"use client";
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Bot, Sparkles, Languages, ShieldCheck, ArrowRight } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-slate-950 text-white">
      
      {/* 1. ANIMATED BACKGROUND GRADIENT BLOBS */}
      <div className="absolute top-0 left-0 w-full h-full -z-10 overflow-hidden">
        <motion.div 
          animate={{ 
            scale: [1, 1.2, 1],
            rotate: [0, 90, 0],
            x: [0, 100, 0] 
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute -top-[10%] -left-[10%] w-[50%] h-[50%] bg-indigo-600/20 rounded-full blur-[120px]"
        />
        <motion.div 
          animate={{ 
            scale: [1, 1.3, 1],
            x: [0, -100, 0],
            y: [0, 50, 0]
          }}
          transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
          className="absolute top-[20%] -right-[10%] w-[40%] h-[40%] bg-purple-600/20 rounded-full blur-[120px]"
        />
      </div>

      {/* 2. NAVIGATION BAR */}
      <nav className="flex justify-between items-center p-6 max-w-7xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center gap-2 font-bold text-2xl tracking-tighter"
        >
          <Bot className="text-indigo-400" /> AgnosticChat
        </motion.div>
        <div className="space-x-6 flex items-center">
          <Link href="/login" className="text-slate-300 hover:text-white transition">Sign In</Link>
          <Link href="/register" className="bg-white text-black px-5 py-2 rounded-full font-bold hover:bg-indigo-100 transition shadow-lg">
            Join Now
          </Link>
        </div>
      </nav>

      {/* 3. HERO SECTION */}
      <main className="max-w-7xl mx-auto px-6 pt-20 pb-32 text-center relative z-10">
        
        {/* Animated Badge */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-900/50 border border-slate-800 text-indigo-400 text-sm mb-8"
        >
          <Sparkles size={16} className="animate-pulse" />
          Powered by Next.js & FastAPI
        </motion.div>

        {/* Main Title with Staggered Letters */}
        <motion.h1 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-6xl md:text-8xl font-extrabold mb-8 tracking-tight"
        >
          Language Agnostic <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400">
            ChatBot
          </span>
        </motion.h1>

        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-slate-400 text-xl max-w-2xl mx-auto mb-12"
        >
          The first language-agnostic AI that understands intent, translates instantly, 
          and analyzes your PDFs—all in one beautiful interface.
        </motion.p>

        {/* Action Buttons */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.6 }}
          className="flex flex-col sm:flex-row justify-center gap-4"
        >
          <Link href="/register" className="group flex items-center gap-2 px-8 py-4 bg-indigo-600 rounded-2xl font-bold hover:bg-indigo-500 transition-all shadow-xl shadow-indigo-500/20">
            Get Started Free <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
          </Link>
          <Link href="/demo" className="px-8 py-4 bg-slate-900 border border-slate-800 rounded-2xl font-bold hover:bg-slate-800 transition">
            View Demo
          
        </Link>
        </motion.div>

        {/* 4. FEATURE GRID */}
        <div className="mt-32 grid grid-cols-1 md:grid-cols-3 gap-8">
          <FeatureCard delay={0.8} icon={<Languages />} title="Multilingual" desc="Real-time translation across 100+ languages." />
          <FeatureCard delay={1.0} icon={<ShieldCheck />} title="Safe & Secure" desc="End-to-end encrypted chats with JWT." />
          <FeatureCard delay={1.2} icon={<Bot />} title="Smart PDF" desc="Ask questions directly to your documents." />
        </div>
      </main>
    </div>
  );
}

function FeatureCard({ icon, title, desc, delay }) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay }}
      whileHover={{ y: -10, scale: 1.02 }}
      className="p-8 rounded-3xl bg-slate-900/40 border border-slate-800 backdrop-blur-xl text-left"
    >
      <div className="w-12 h-12 bg-indigo-500/10 text-indigo-400 rounded-xl flex items-center justify-center mb-6">
        {icon}
      </div>
      <h3 className="text-xl font-bold mb-3">{title}</h3>
      <p className="text-slate-500 leading-relaxed">{desc}</p>
    </motion.div>
  );
}