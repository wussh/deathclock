import React from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, Lock, Trash2, EyeOff } from 'lucide-react';

export default function Privacy({ onBack }: { onBack: () => void }) {
  return (
    <div className="max-w-4xl mx-auto py-12 px-4 w-full">
      <button 
        onClick={onBack}
        className="flex items-center gap-2 text-[var(--color-muted)] hover:text-[var(--color-ink)] transition-colors mb-8 font-mono text-sm uppercase tracking-widest"
      >
        <ArrowLeft size={16} /> Return to base
      </button>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-12"
      >
        <div className="flex items-center gap-4 mb-4">
          <Lock className="text-emerald-500" size={40} />
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">Privacy Policy</h1>
        </div>
        <p className="text-xl text-[var(--color-muted)] max-w-2xl leading-relaxed border-l-4 border-[var(--color-accent)] pl-6">
          Your life is none of our business.
        </p>

        <div className="space-y-8 glass-card p-8 md:p-12">
          <div className="space-y-4">
            <div className="flex items-center gap-3 text-[var(--color-ink)]">
              <Trash2 size={20} className="text-[#f97316]" />
              <h3 className="text-xl font-bold">No Data is Saved</h3>
            </div>
            <p className="text-[var(--color-muted)] leading-relaxed pl-8">
              All calculations happen locally in your browser. We do not store, track, or harvest any of the numbers you enter. Your age, your habits, your goals—they disappear the moment you close the tab.
            </p>
          </div>

          <div className="w-full h-px bg-[var(--color-line)]" />

          <div className="space-y-4">
            <div className="flex items-center gap-3 text-[var(--color-ink)]">
              <EyeOff size={20} className="text-[var(--color-accent)]" />
              <h3 className="text-xl font-bold">No Accounts, No Tracking</h3>
            </div>
            <p className="text-[var(--color-muted)] leading-relaxed pl-8">
              We don't ask for your email. We don't make you sign up. We don't use creepy trackers to follow you around the internet. This tool exists solely for your own personal realization.
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
