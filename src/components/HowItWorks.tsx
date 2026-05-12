import React from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, Clock, Activity, ShieldCheck } from 'lucide-react';

export default function HowItWorks({ onBack }: { onBack: () => void }) {
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
        <div>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4">How it works</h1>
          <p className="text-xl text-[var(--color-muted)] max-w-2xl leading-relaxed">
            The math is uncompromising, because reality is uncompromising. Here's exactly how we calculate your remaining freedom.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="glass-card p-8 border-t-2 border-[var(--color-accent)]">
            <div className="flex items-center gap-3 mb-6">
              <Clock className="text-[var(--color-accent)]" size={24} />
              <h3 className="text-xl font-bold">1. The Baseline</h3>
            </div>
            <p className="text-[var(--color-muted)] leading-relaxed">
              We start with your expected lifespan. From there, we subtract the years you've already lived. The remainder is your total remaining time on Earth. But that number is a lie—because your time isn't entirely yours.
            </p>
          </div>

          <div className="glass-card p-8 border-t-2 border-[#f97316]">
            <div className="flex items-center gap-3 mb-6">
              <Activity className="text-[#f97316]" size={24} />
              <h3 className="text-xl font-bold">2. The Deductions</h3>
            </div>
            <p className="text-[var(--color-muted)] leading-relaxed">
              We deduct your "maintenance" hours—sleep and work. If you sleep 8 hours a day, a third of your life is gone in bed. If you work 8 hours, another huge chunk vanishes into obligation.
            </p>
          </div>

          <div className="glass-card p-8 border-t-2 border-emerald-500 md:col-span-2">
            <div className="flex items-center gap-3 mb-6">
              <ShieldCheck className="text-emerald-500" size={24} />
              <h3 className="text-xl font-bold">3. The Reality Check</h3>
            </div>
            <p className="text-[var(--color-muted)] leading-relaxed max-w-3xl">
              What remains after sleep and work is your "True Freedom"—the hours you actually get to choose how to spend. Your screen time (social media, doomscrolling) directly eats into this pool. If you have 4 hours of freedom a day, and you spend 3 on your phone, you are trading your life for a feed.
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
