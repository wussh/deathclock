import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Copy, Check, Download } from 'lucide-react';
import { UserData, Goal } from '../types';
import { formatNumber } from '../lib/utils';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  userData: UserData | null;
  freeHours: number;
  goals: Goal[];
}

export default function ShareModal({ isOpen, onClose, userData, freeHours, goals }: ShareModalProps) {
  const [copied, setCopied] = useState(false);

  if (!userData) return null;

  const topGoal = goals[0]?.title || "doomscrolling";
  const shareText = `I have exactly ${formatNumber(freeHours)} free hours left in my life.\nI'm spending them on ${topGoal}.\n\nCalculate your mortality at DeathClock.ai`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(shareText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-[var(--color-ink)]/40 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-[var(--color-paper)] border border-[var(--color-ink)] w-full max-w-md shadow-2xl relative overflow-hidden"
            >
              <button 
                onClick={onClose}
                className="absolute top-4 right-4 text-[var(--color-ink)] hover:text-[var(--color-accent)] transition-colors z-10"
              >
                <X size={20} />
              </button>

              <div id="share-card" className="p-8 pb-12 relative bg-zinc-900 text-zinc-50 border border-zinc-800 rounded-t-xl overflow-hidden shadow-2xl">
                <div className="absolute top-0 right-0 w-48 h-48 bg-[var(--color-accent)] opacity-10 rounded-bl-full pointer-events-none" />
                <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-[var(--color-accent)] opacity-5 rounded-tr-full pointer-events-none" />
                
                <div className="space-y-6 relative z-10">
                  <div className="flex items-center gap-2 mb-8">
                    <div className="w-6 h-6 bg-[var(--color-accent)] text-zinc-900 flex items-center justify-center rounded-sm">
                      <span className="font-black text-xs">D</span>
                    </div>
                    <span className="font-black uppercase tracking-widest text-[10px] text-zinc-400">DeathClock.ai</span>
                  </div>

                  <div className="space-y-2 pt-4">
                    <div className="font-mono text-[10px] uppercase tracking-widest text-[var(--color-accent)]">Official Audit</div>
                    <div className="text-3xl font-extrabold tracking-tight leading-snug">
                      I have exactly <span className="text-[var(--color-accent)]"><span className="font-mono font-medium">{formatNumber(freeHours)}</span> free hours</span> left in my life.
                    </div>
                  </div>

                  <div className="h-px w-full bg-zinc-800 my-8" />

                  <div className="space-y-4">
                    <div className="font-mono text-[10px] uppercase tracking-widest text-zinc-500">And I'm spending them on:</div>
                    <div className="text-4xl font-black tracking-tight text-white block break-words border-l-4 border-[var(--color-accent)] pl-5 py-2 leading-none">
                      {topGoal}
                    </div>
                  </div>
                  
                  <div className="pt-8 mt-4 flex justify-between items-end text-zinc-600">
                    <div className="font-mono text-[9px] uppercase tracking-widest">
                      Age {userData.age} / Expectancy {userData.expectedAge}
                    </div>
                    <div className="font-mono text-[9px] uppercase tracking-widest text-[var(--color-accent)]/80 border border-[var(--color-accent)]/20 px-2 py-1 rounded">
                      Reality Check: Active
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-[var(--color-ink)] p-4 flex gap-4">
                <button
                  onClick={copyToClipboard}
                  className="flex-1 bg-[var(--color-paper)] text-[var(--color-ink)] p-3 flex items-center justify-center gap-2 hover:bg-[var(--color-accent)] hover:text-white transition-colors"
                >
                  {copied ? <Check size={16} /> : <Copy size={16} />}
                  <span className="font-mono text-[10px] uppercase tracking-widest font-bold">
                    {copied ? 'Copied!' : 'Copy Text'}
                  </span>
                </button>
              </div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
