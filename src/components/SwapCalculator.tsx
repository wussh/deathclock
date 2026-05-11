import React, { useState } from 'react';
import { Replace, Loader2, ArrowRight } from 'lucide-react';
import { SwapInsight } from '../types';
import { analyzeSwap } from '../services/gemini';
import { motion, AnimatePresence } from 'motion/react';
import { formatNumber } from '../lib/utils';

export default function SwapCalculator() {
  const [activity, setActivity] = useState('');
  const [minutesSavedDaily, setMinutesSavedDaily] = useState<number>(30);
  const [insight, setInsight] = useState<SwapInsight | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const hoursPerYear = (minutesSavedDaily / 60) * 365.25;

  const handleCalculate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activity.trim()) return;

    setIsLoading(true);
    try {
      const result = await analyzeSwap(hoursPerYear, activity);
      setInsight(result);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h3 className="text-2xl font-black uppercase tracking-tighter italic font-serif flex items-center gap-2">
          <Replace size={24} className="text-[var(--color-accent)]" /> Time Swap
        </h3>
        <p className="font-mono text-[10px] opacity-50 uppercase tracking-widest">Phase 03: Reallocation</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <form onSubmit={handleCalculate} className="space-y-6 p-6 border border-[var(--color-ink)] bg-white shadow-[8px_8px_0_0_rgba(10,10,10,0.1)]">
          <div className="space-y-2">
            <label className="font-mono text-[9px] uppercase tracking-[0.2em] opacity-50">Low-Priority Activity</label>
            <input
              type="text"
              placeholder="e.g. Scrolling TikTok, Netflix"
              value={activity}
              onChange={e => setActivity(e.target.value)}
              className="w-full bg-transparent border-b border-[var(--color-line)] py-2 font-mono text-sm focus:border-[var(--color-accent)] outline-none"
            />
          </div>

          <div className="space-y-4 pt-4">
            <label className="font-mono text-[9px] uppercase tracking-[0.2em] opacity-50 flex justify-between">
              <span>Reduce by</span>
              <span className="font-bold text-[var(--color-accent)] text-xs">{minutesSavedDaily} mins / day</span>
            </label>
            <input
              type="range"
              min="5"
              max="240"
              step="5"
              value={minutesSavedDaily}
              onChange={e => setMinutesSavedDaily(Number(e.target.value))}
              className="w-full accent-[var(--color-accent)]"
            />
            <div className="flex justify-between font-mono text-[8px] opacity-40 uppercase">
              <span>5 mins</span>
              <span>4 hours</span>
            </div>
          </div>

          <button
            disabled={isLoading || !activity.trim()}
            className="w-full bg-[var(--color-ink)] text-[var(--color-paper)] p-4 pt-5 flex items-center justify-center gap-2 hover:bg-[var(--color-accent)] transition-all disabled:opacity-50 mt-4"
          >
            {isLoading ? <Loader2 className="animate-spin" size={16} /> : <ArrowRight size={16} />}
            <span className="font-mono text-[10px] uppercase tracking-widest font-bold">Calculate Compound Interest</span>
          </button>
        </form>

        <div className="relative">
          <AnimatePresence mode="wait">
            {!insight ? (
              <motion.div
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="h-full min-h-[200px] flex flex-col items-center justify-center border border-dashed border-[var(--color-line)] p-8 text-center opacity-30 italic font-mono text-sm"
              >
                <Replace size={40} className="mb-4 opacity-50" />
                Select an activity and reduction to see the compound value of your time.
              </motion.div>
            ) : (
              <motion.div
                key="result"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-[var(--color-ink)] text-[var(--color-paper)] p-8 h-full flex flex-col justify-center border-l-4 border-[var(--color-accent)] shadow-[8px_8px_0_0_rgba(10,10,10,0.1)]"
              >
                <div className="space-y-6">
                  <div className="space-y-2">
                    <div className="font-mono text-[10px] uppercase tracking-widest opacity-50">Annual Recovery</div>
                    <div className="text-5xl font-black tracking-tighter">
                      +{formatNumber(hoursPerYear)} <span className="text-xl">hours</span>
                    </div>
                  </div>
                  
                  <div className="h-px w-full bg-[var(--color-paper)] opacity-20" />
                  
                  <div className="space-y-4">
                    <div className="font-mono text-[10px] uppercase tracking-widest opacity-50">Potential Achievement</div>
                    <div className="text-2xl font-bold italic font-serif leading-tight text-[var(--color-accent)]">
                      {insight.achievableGoal}
                    </div>
                    <p className="font-mono text-xs opacity-70 leading-relaxed border-l border-[var(--color-paper)] opacity-40 pl-3">
                      "{insight.commentary}"
                    </p>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
