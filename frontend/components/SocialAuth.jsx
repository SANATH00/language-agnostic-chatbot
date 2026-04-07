"use client";
import { signIn } from "next-auth/react";
import { Github, Facebook, Instagram, Chrome } from 'lucide-react';
import { motion } from 'framer-motion';

export default function SocialAuth() {
  const providers = [
    { id: 'google', icon: <Chrome size={18} />, name: 'Google', color: 'hover:text-red-500' },
    { id: 'github', icon: <Github size={18} />, name: 'GitHub', color: 'hover:text-slate-400' },
    { id: 'facebook', icon: <Facebook size={18} />, name: 'Facebook', color: 'hover:text-blue-500' },
    { id: 'instagram', icon: <Instagram size={18} />, name: 'Instagram', color: 'hover:text-pink-500' },
  ];

  return (
    <div className="grid grid-cols-2 gap-3 mt-6">
      {providers.map((p) => (
        <motion.button
          key={p.id}
          whileHover={{ scale: 1.02, y: -2 }}
          onClick={() => signIn(p.id, { callbackUrl: '/chat' })}
          className="flex items-center justify-center gap-2 p-3 border border-slate-200 dark:border-slate-800 rounded-xl bg-slate-50 dark:bg-slate-900/50 transition-all text-xs font-bold"
        >
          {p.icon} {p.name}
        </motion.button>
      ))}
    </div>
  );
}