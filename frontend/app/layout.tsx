"use client";
import "./globals.css";
import { ThemeProvider, useTheme } from "next-themes";
import { motion } from "framer-motion";
import { Sun, Moon, Bot } from "lucide-react";
import { useEffect, useState } from "react";

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider attribute="class" defaultTheme="dark">
          <ThemeWrapper>{children}</ThemeWrapper>
        </ThemeProvider>
      </body>
    </html>
  );
}

function ThemeWrapper({ children }) {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  return (
    <div className="relative min-h-screen bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-500 overflow-x-hidden">
      {/* Shared Background Animation */}
      <div className="fixed inset-0 -z-10 pointer-events-none">
        <motion.div 
          animate={{ scale: [1, 1.2, 1], x: [0, 40, 0] }}
          transition={{ duration: 15, repeat: Infinity }}
          className="absolute -top-[10%] -left-[10%] w-[50%] h-[50%] bg-indigo-500/10 dark:bg-indigo-600/20 rounded-full blur-[100px]"
        />
        <div className="absolute bottom-[10%] -right-[10%] w-[40%] h-[40%] bg-purple-500/10 dark:bg-purple-600/20 rounded-full blur-[100px]" />
      </div>

      {/* Floating Theme Toggle */}
      <button 
        onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
        className="fixed top-6 right-6 z-50 p-3 rounded-2xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl hover:scale-110 transition-all"
      >
        {theme === 'dark' ? <Sun className="text-yellow-400" /> : <Moon className="text-indigo-500" />}
      </button>

      {children}
    </div>
  );
}