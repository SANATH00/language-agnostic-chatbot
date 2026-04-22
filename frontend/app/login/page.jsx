"use client";
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LogIn, ArrowRight, Sparkles, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

// If you have a SocialAuth component, keep this import. 
// If not, I've added a placeholder below so the code doesn't crash.
const SocialAuth = () => <div className="flex gap-4 justify-center py-2"></div>;

export default function LoginPage() {
  const router = useRouter();

  // 1. STATE MANAGEMENT
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  // 2. ANIMATION VARIANTS (The Fix for your error)
  const containerVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: { duration: 0.5, staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 }
  };

  // 3. LOGIN HANDLER
  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        // Store JWT and Name
        localStorage.setItem('token', data.token);
        localStorage.setItem('userName', data.user?.name || "Developer");
        router.push('/chat');
      } else {
        setError(data.message || "Invalid credentials. Please try again.");
      }
    } catch (err) {
      setError("Server connection failed. Please check your backend.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center p-6 overflow-hidden bg-[#030712]">
      {/* Animated Background Glows */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div 
          animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 8, repeat: Infinity }}
          className="absolute -top-[10%] -left-[10%] w-[50%] h-[50%] rounded-full bg-cyan-500/20 blur-[120px]" 
        />
        <motion.div 
          animate={{ scale: [1, 1.3, 1], opacity: [0.2, 0.4, 0.2] }}
          transition={{ duration: 10, repeat: Infinity, delay: 1 }}
          className="absolute -bottom-[10%] -right-[10%] w-[50%] h-[50%] rounded-full bg-blue-600/20 blur-[120px]" 
        />
      </div>

      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative w-full max-w-md bg-slate-900/40 border border-slate-800 backdrop-blur-3xl p-8 rounded-[2.5rem] shadow-[0_0_50px_-12px_rgba(59,130,246,0.2)]"
      >
        <motion.div variants={itemVariants} className="text-center mb-8">
          <div className="inline-flex p-4 bg-gradient-to-br from-cyan-400 via-blue-500 to-purple-600 rounded-3xl mb-4 shadow-lg shadow-blue-500/20">
            <Sparkles className="text-white" size={32} />
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-white bg-clip-text">
            Welcome Back
          </h1>
          <p className="text-slate-400 text-sm mt-2 font-medium">Continue your journey with AgnosticChat</p>
        </motion.div>

        <form onSubmit={handleLogin} className="space-y-4">
          <motion.div variants={itemVariants} className="space-y-3">
            <input 
              type="email" 
              required
              placeholder="Email address" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-4 bg-slate-800/50 border border-slate-700/50 rounded-2xl focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500 outline-none transition-all text-white placeholder:text-slate-500" 
            />
            <input 
              type="password" 
              required
              placeholder="Password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-4 bg-slate-800/50 border border-slate-700/50 rounded-2xl focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500 outline-none transition-all text-white placeholder:text-slate-500" 
            />
          </motion.div>

          {error && (
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-red-400 text-xs px-2 font-medium">
              {error}
            </motion.p>
          )}

          <motion.button 
            variants={itemVariants}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            disabled={isLoading}
            className="group w-full py-4 bg-gradient-to-r from-blue-600 via-cyan-600 to-blue-600 bg-[length:200%_auto] hover:bg-right transition-all duration-500 text-white rounded-2xl font-bold shadow-xl flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {isLoading ? <Loader2 className="animate-spin" size={18} /> : (
              <>Sign In <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" /></>
            )}
          </motion.button>
        </form>

        <motion.div variants={itemVariants} className="relative my-8 flex justify-center text-xs uppercase tracking-widest text-slate-500">
          <span className="bg-[#0f172a] px-3 z-10 relative">Or connect via</span>
          <div className="absolute inset-0 top-1/2 border-t border-slate-800"></div>
        </motion.div>

        <motion.div variants={itemVariants}>
          <SocialAuth />
        </motion.div>

        <motion.p variants={itemVariants} className="text-center mt-8 text-sm text-slate-400">
          New here? <Link href="/register" className="text-cyan-400 font-bold hover:text-cyan-300 transition-colors">Create an account</Link>
        </motion.p>
      </motion.div>
    </div>
  );
}