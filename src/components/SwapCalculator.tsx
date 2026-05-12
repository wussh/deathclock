import React, { useState } from 'react';
import { Replace, Loader2, ArrowRight, Sparkles } from 'lucide-react';
import { SwapInsight } from '../types';
import { analyzeSwap, generateActionPlan } from '../services/gemini';
import { motion, AnimatePresence } from 'motion/react';
import { formatNumber } from '../lib/utils';

export default function SwapCalculator() {
  const [activity, setActivity] = useState('');
  const [minutesSavedDaily, setMinutesSavedDaily] = useState<number>(30);
  const [activeResult, setActiveResult] = useState<{
    activity: string;
    minutes: number;
    hoursYear: number;
    insight: SwapInsight;
  } | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [actionPlan, setActionPlan] = useState<string[] | null>(null);
  const [isPlanLoading, setIsPlanLoading] = useState(false);
  const [savedSwaps, setSavedSwaps] = useState<{
    id: string;
    activity: string;
    minutes: number;
    hoursYear: number;
    insight: SwapInsight;
  }[]>([]);

  const hoursPerYear = (minutesSavedDaily / 60) * 365.25;

  const handleCalculate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activity.trim()) return;

    setIsLoading(true);
    setActionPlan(null); // Reset when calculating new
    try {
      const result = await analyzeSwap(hoursPerYear, activity);
      const newResult = {
        activity,
        minutes: minutesSavedDaily,
        hoursYear: hoursPerYear,
        insight: result
      };
      setActiveResult(newResult);
      setSavedSwaps(prev => [
        {
          id: Math.random().toString(36).substring(7),
          ...newResult
        },
        ...prev
      ]);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGetPlan = async () => {
    if (!activeResult) return;
    setIsPlanLoading(true);
    try {
      const plan = await generateActionPlan(activeResult.insight.achievableGoal, activeResult.hoursYear);
      setActionPlan(plan);
    } catch (error) {
      console.error(error);
    } finally {
      setIsPlanLoading(false);
    }
  };

  return (
    <div id="phase-03" className="space-y-6">
      <div className="space-y-2">
        <div className="inline-block border border-[var(--color-line)] bg-[var(--color-card)] px-3 py-1 rounded-full font-mono text-xs text-[var(--color-muted)] tracking-wider">
          Phase 03: Reallocation
        </div>
        <h3 className="text-3xl font-bold tracking-tight flex items-center gap-2">
          <Replace size={24} className="text-[var(--color-accent)]" /> Time Swap
        </h3>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <form onSubmit={handleCalculate} className="space-y-6 glass-card p-6 md:p-8">
          <div className="space-y-2">
            <label className="font-mono text-[10px] uppercase tracking-[0.2em] opacity-50">Low-Priority Activity</label>
            <input
              type="text"
              placeholder="e.g. Scrolling TikTok, Netflix"
              value={activity}
              onChange={e => setActivity(e.target.value)}
              className="input-field"
            />
          </div>

          <div className="space-y-4 pt-4">
            <label className="font-mono text-[10px] uppercase tracking-[0.2em] flex justify-between">
              <span className="opacity-50">Reduce by</span>
              <span className="font-bold text-[var(--color-accent)]">{minutesSavedDaily} mins / day</span>
            </label>
            <input
              type="range"
              min="5"
              max="240"
              step="5"
              value={minutesSavedDaily}
              onChange={e => setMinutesSavedDaily(Number(e.target.value))}
              className="w-full h-2 bg-[var(--color-line)] rounded-[8px] appearance-none cursor-pointer accent-[var(--color-accent)]"
            />
            <div className="flex justify-between font-mono text-[10px] opacity-40 uppercase">
              <span>5 mins</span>
              <span>4 hours</span>
            </div>
          </div>

          <button
            disabled={isLoading || !activity.trim()}
            className="btn-primary w-full disabled:opacity-50 group mt-4"
          >
            {isLoading ? <Loader2 className="animate-spin" size={18} /> : <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />}
            <span className="font-mono text-xs uppercase tracking-widest font-bold">Calculate Compound Interest</span>
          </button>
        </form>

        <div className="relative">
          <AnimatePresence mode="wait">
            {!activeResult ? (
              <motion.div
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="h-full min-h-[300px] flex flex-col items-center justify-center glass-card border-dashed p-8 text-center text-[var(--color-muted)] italic font-mono text-sm"
              >
                <Replace size={48} className="mb-4 opacity-50 text-[var(--color-accent)]" />
                Select an activity and reduction to see the compound value of your time.
              </motion.div>
            ) : (
              <motion.div
                key="result"
                initial={{ opacity: 0, scale: 0.95, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ type: "spring", stiffness: 200, damping: 20 }}
                className="glass-card p-8 h-full flex flex-col justify-center border-l-4 border-l-[var(--color-accent)] relative overflow-hidden"
              >
                 <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none">
                  <Replace size={120} />
                </div>
                <div className="space-y-6 relative z-10">
                  <div className="space-y-2">
                    <div className="font-mono text-[10px] uppercase tracking-widest text-[var(--color-muted)]">Annual Recovery</div>
                    <div className="text-5xl font-mono font-medium tracking-tighter text-[var(--color-ink)]">
                      +{formatNumber(activeResult.hoursYear)} <span className="text-xl text-[var(--color-muted)] font-bold">hours</span>
                    </div>
                  </div>
                  
                  <div className="h-px w-full bg-[var(--color-line)]" />
                  
                  <div className="space-y-4">
                    <div className="font-mono text-[10px] uppercase tracking-widest text-[var(--color-muted)]">Potential Achievement</div>
                    <div className="text-2xl font-bold leading-tight text-[var(--color-accent)]">
                      {activeResult.insight.achievableGoal}
                    </div>
                    <div className="text-sm text-[var(--color-muted)] leading-relaxed italic border-l-2 border-[var(--color-line)] pl-4">
                      "{activeResult.insight.commentary}"
                    </div>
                  </div>

                  {!actionPlan ? (
                    <button
                      onClick={handleGetPlan}
                      disabled={isPlanLoading}
                      className="w-full bg-[var(--color-accent)] text-amber-950 p-4 flex items-center justify-center gap-2 hover:bg-[var(--color-accent)]/80 transition-all font-sans text-sm font-semibold disabled:opacity-50 !mt-8 shadow-[0_0_20px_rgba(186,117,23,0.3)] animate-pulse hover:animate-none rounded-[8px]"
                    >
                      {isPlanLoading ? <Loader2 className="animate-spin" size={16} /> : <Sparkles size={16} />}
                      Get my 30-day action plan ✦
                    </button>
                  ) : (
                    <motion.div 
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="space-y-4 pt-4 border-t border-[var(--color-line)] mt-4"
                    >
                      <div className="font-mono text-[10px] uppercase tracking-widest text-[var(--color-muted)] flex items-center gap-2">
                        <Sparkles size={12} className="text-[var(--color-accent)]" /> 30-Day Protocol
                      </div>
                      <div className="space-y-3">
                        {actionPlan.map((step, idx) => (
                          <div key={idx} className="flex gap-3 text-sm text-[var(--color-ink)]/90 bg-[var(--color-card)] p-3 rounded-[12px] border border-[var(--color-line)]">
                            <span className="text-[var(--color-accent)] font-mono text-xs opacity-70 mt-0.5">W{idx + 1}</span>
                            <p>{step}</p>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* History section */}
      {savedSwaps.length > 0 && (
        <div className="mt-12 space-y-4">
          <div className="flex items-center gap-2 text-[var(--color-muted)]">
            <Sparkles size={16} />
            <h4 className="font-mono text-sm uppercase tracking-widest font-bold">Swap History</h4>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {savedSwaps.map((swap) => (
              <div key={swap.id} className="glass-card p-5 space-y-4 border-l-2 border-l-[var(--color-accent)] opacity-80 hover:opacity-100 transition-opacity">
                 <div className="flex justify-between items-start">
                   <div>
                     <div className="font-mono text-[10px] uppercase tracking-widest text-[var(--color-muted)]">Reduced Activity</div>
                     <div className="font-medium">{swap.activity}</div>
                   </div>
                   <div className="text-right">
                     <div className="font-mono text-[10px] uppercase tracking-widest text-[var(--color-muted)]">Saved/Day</div>
                     <div className="font-bold text-[var(--color-accent)]">{swap.minutes}m</div>
                   </div>
                 </div>
                 <div className="h-px w-full bg-[var(--color-line)]" />
                 <div>
                    <div className="font-mono text-[10px] uppercase tracking-widest text-[var(--color-muted)]">Potential</div>
                    <div className="font-medium text-sm text-[var(--color-ink)] mt-1">{swap.insight.achievableGoal}</div>
                 </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
