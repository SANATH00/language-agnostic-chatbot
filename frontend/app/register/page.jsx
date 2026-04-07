"use client";
import { useState } from 'react';
import { motion } from 'framer-motion';
import { UserPlus, ArrowRight, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function RegisterPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleRegister = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setSuccess("");

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, email, password }),
      });

      const data = await res.json();

      if (res.ok) {
        setSuccess("Account created! Redirecting to login...");
        setTimeout(() => router.push('/login'), 1500);
      } else {
        setError(data.detail || "Registration failed. Please try again.");
      }
    } catch (err) {
      setError("Server connection failed. Make sure backend is running.");
    } finally {
      setIsLoading(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.5, staggerChildren: 0.1 } }
  };
  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center p-6 overflow-hidden bg-[#030712]">
      <div className="absolute inset-0 overflow-hidden">
        <motion.div animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0.4, 0.2] }}
          transition={{ duration: 10, repeat: Infinity }}
          className="absolute -top-[15%] -right-[10%] w-[60%] h-[60%] rounded-full bg-purple-600/20 blur-[120px]" />
        <motion.div animate={{ scale: [1, 1.3, 1], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 12, repeat: Infinity, delay: 2 }}
          className="absolute -bottom-[10%] -left-[10%] w-[50%] h-[50%] rounded-full bg-cyan-500/20 blur-[120px]" />
      </div>

      <motion.div variants={containerVariants} initial="hidden" animate="visible"
        className="relative w-full max-w-md bg-slate-900/40 border border-slate-800 backdrop-blur-3xl p-8 rounded-[2.5rem] shadow-[0_0_50px_-12px_rgba(34,211,238,0.15)]">

        <motion.div variants={itemVariants} className="text-center mb-8">
          <div className="inline-flex p-4 bg-gradient-to-br from-purple-500 via-indigo-500 to-cyan-500 rounded-3xl mb-4">
            <UserPlus className="text-white" size={32} />
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-white">Create Account</h1>
          <p className="text-slate-400 text-sm mt-2">Start your multilingual campus assistant journey.</p>
        </motion.div>

        <form onSubmit={handleRegister} className="space-y-4">
          <motion.div variants={itemVariants} className="space-y-3">
            <input type="text" required placeholder="Full Name"
              value={username} onChange={(e) => setUsername(e.target.value)}
              className="w-full p-4 bg-slate-800/50 border border-slate-700/50 rounded-2xl focus:ring-2 focus:ring-purple-500/50 outline-none transition-all text-white placeholder:text-slate-500" />
            <input type="email" required placeholder="Email address"
              value={email} onChange={(e) => setEmail(e.target.value)}
              className="w-full p-4 bg-slate-800/50 border border-slate-700/50 rounded-2xl focus:ring-2 focus:ring-purple-500/50 outline-none transition-all text-white placeholder:text-slate-500" />
            <input type="password" required placeholder="Create Password"
              value={password} onChange={(e) => setPassword(e.target.value)}
              className="w-full p-4 bg-slate-800/50 border border-slate-700/50 rounded-2xl focus:ring-2 focus:ring-purple-500/50 outline-none transition-all text-white placeholder:text-slate-500" />
          </motion.div>

          {error && <p className="text-red-400 text-xs px-2">{error}</p>}
          {success && <p className="text-green-400 text-xs px-2">{success}</p>}

          <motion.button variants={itemVariants} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
            disabled={isLoading} type="submit"
            className="group w-full py-4 bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-600 text-white rounded-2xl font-bold shadow-xl flex items-center justify-center gap-2 disabled:opacity-50">
            {isLoading ? <Loader2 className="animate-spin" size={18} /> : (
              <>Register <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" /></>
            )}
          </motion.button>
        </form>

        <motion.p variants={itemVariants} className="text-center mt-8 text-sm text-slate-400">
          Already a member? <Link href="/login" className="text-cyan-400 font-bold hover:text-cyan-300">Login</Link>
        </motion.p>
      </motion.div>
    </div>
  );
}