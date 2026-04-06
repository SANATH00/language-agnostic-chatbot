// Enable client-side rendering (Next.js App Router)
"use client";

// Import React hook
import { useState } from 'react';

// Import animation tools from Framer Motion
import { motion, AnimatePresence } from 'framer-motion';

// Import icons
import { LogIn, ArrowRight, Sparkles, Loader2 } from 'lucide-react';

// Import Link for navigation
import Link from 'next/link';

// Import router for navigation after login
import { useRouter } from 'next/navigation';

// Placeholder for Social Authentication component (Google, GitHub, etc.)
const SocialAuth = () => <div className="flex gap-4 justify-center py-2"></div>;

// Main Login Page Component
export default function LoginPage() {

  // Router for redirecting after login
  const router = useRouter();

  // ================= STATE MANAGEMENT =================

  // Store email input
  const [email, setEmail] = useState("");

  // Store password input
  const [password, setPassword] = useState("");

  // Track loading state (button spinner)
  const [isLoading, setIsLoading] = useState(false);

  // Store error messages
  const [error, setError] = useState("");

  // ================= ANIMATION VARIANTS =================

  // Container animation (fade + scale)
  const containerVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: { duration: 0.5, staggerChildren: 0.1 } // animate children one by one
    }
  };

  // Individual item animation (fade + slide up)
  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 }
  };

  // ================= LOGIN HANDLER =================

  const handleLogin = async (e) => {

    // Prevent default form submission
    e.preventDefault();

    // Show loading state
    setIsLoading(true);

    // Clear previous errors
    setError("");

    try {
      // Send login request to backend API
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },

        // Send email and password
        body: JSON.stringify({ email, password }),
      });

      // Parse response data
      const data = await response.json();

      if (response.ok) {

        // Store JWT token in localStorage
        localStorage.setItem('token', data.token);

        // Store user name
        localStorage.setItem('userName', data.user?.name || "Developer");

        // Redirect to chat page
        router.push('/chat');

      } else {

        // Show error message from backend
        setError(data.message || "Invalid credentials. Please try again.");
      }

    } catch (err) {

      // Handle network/server errors
      setError("Server connection failed. Please check your backend.");

    } finally {

      // Stop loading spinner
      setIsLoading(false);
    }
  };

  // ================= UI RENDER =================

  return (
    <div className="relative min-h-screen flex items-center justify-center p-6 overflow-hidden bg-[#030712]">

      {/* Animated Background Glow Effects */}
      <div className="absolute inset-0 overflow-hidden">

        {/* Top glow animation */}
        <motion.div 
          animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 8, repeat: Infinity }}
          className="absolute -top-[10%] -left-[10%] w-[50%] h-[50%] rounded-full bg-cyan-500/20 blur-[120px]" 
        />

        {/* Bottom glow animation */}
        <motion.div 
          animate={{ scale: [1, 1.3, 1], opacity: [0.2, 0.4, 0.2] }}
          transition={{ duration: 10, repeat: Infinity, delay: 1 }}
          className="absolute -bottom-[10%] -right-[10%] w-[50%] h-[50%] rounded-full bg-blue-600/20 blur-[120px]" 
        />
      </div>

      {/* Login Card Container */}
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative w-full max-w-md bg-slate-900/40 border border-slate-800 backdrop-blur-3xl p-8 rounded-[2.5rem] shadow-[0_0_50px_-12px_rgba(59,130,246,0.2)]"
      >

        {/* Header Section */}
        <motion.div variants={itemVariants} className="text-center mb-8">

          {/* Icon */}
          <div className="inline-flex p-4 bg-gradient-to-br from-cyan-400 via-blue-500 to-purple-600 rounded-3xl mb-4 shadow-lg shadow-blue-500/20">
            <Sparkles className="text-white" size={32} />
          </div>

          {/* Title */}
          <h1 className="text-3xl font-extrabold tracking-tight text-white bg-clip-text">
            Welcome Back
          </h1>

          {/* Subtitle */}
          <p className="text-slate-400 text-sm mt-2 font-medium">
            Continue your journey with AgnosticChat
          </p>
        </motion.div>

        {/* Login Form */}
        <form onSubmit={handleLogin} className="space-y-4">

          {/* Input Fields */}
          <motion.div variants={itemVariants} className="space-y-3">

            {/* Email Input */}
            <input 
              type="email" 
              required
              placeholder="Email address" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-4 bg-slate-800/50 border border-slate-700/50 rounded-2xl focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500 outline-none transition-all text-white placeholder:text-slate-500" 
            />

            {/* Password Input */}
            <input 
              type="password" 
              required
              placeholder="Password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-4 bg-slate-800/50 border border-slate-700/50 rounded-2xl focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500 outline-none transition-all text-white placeholder:text-slate-500" 
            />
          </motion.div>

          {/* Error Message */}
          {error && (
            <motion.p 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              className="text-red-400 text-xs px-2 font-medium"
            >
              {error}
            </motion.p>
          )}

          {/* Submit Button */}
          <motion.button 
            variants={itemVariants}
            whileHover={{ scale: 1.02 }} // hover animation
            whileTap={{ scale: 0.98 }}   // click animation
            disabled={isLoading}
            className="group w-full py-4 bg-gradient-to-r from-blue-600 via-cyan-600 to-blue-600 bg-[length:200%_auto] hover:bg-right transition-all duration-500 text-white rounded-2xl font-bold shadow-xl flex items-center justify-center gap-2 disabled:opacity-50"
          >

            {/* Show loader when loading */}
            {isLoading ? (
              <Loader2 className="animate-spin" size={18} />
            ) : (
              <>
                Sign In 
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </motion.button>
        </form>

        {/* Divider */}
        <motion.div 
          variants={itemVariants} 
          className="relative my-8 flex justify-center text-xs uppercase tracking-widest text-slate-500"
        >
          <span className="bg-[#0f172a] px-3 z-10 relative">
            Or connect via
          </span>
          <div className="absolute inset-0 top-1/2 border-t border-slate-800"></div>
        </motion.div>

        {/* Social Login Section */}
        <motion.div variants={itemVariants}>
          <SocialAuth />
        </motion.div>

        {/* Register Link */}
        <motion.p 
          variants={itemVariants} 
          className="text-center mt-8 text-sm text-slate-400"
        >
          New here? 
          <Link 
            href="/register" 
            className="text-cyan-400 font-bold hover:text-cyan-300 transition-colors"
          >
            {" "}Create an account
          </Link>
        </motion.p>

      </motion.div>
    </div>
  );
}