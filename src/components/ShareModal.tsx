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

              <div id="share-card" className="p-8 pb-12 relative bg-[var(--color-paper)]">
                <div className="absolute top-0 right-0 w-32 h-32 bg-[var(--color-accent)] opacity-5 rounded-bl-full pointer-events-none" />
                
                <div className="space-y-6 relative z-10">
                  <div className="flex items-center gap-2 mb-8">
                    <div className="w-6 h-6 bg-[var(--color-ink)] flex items-center justify-center">
                      <span className="text-[var(--color-paper)] font-black text-xs">D</span>
                    </div>
                    <span className="font-black uppercase tracking-tighter text-sm">DeathClock.ai</span>
                  </div>

                  <div className="space-y-2">
                    <div className="font-mono text-[10px] uppercase tracking-widest opacity-50">Audited Life Balance</div>
                    <div className="text-5xl font-black tracking-tighter leading-none">
                      {formatNumber(freeHours)} <span className="text-2xl">hrs</span>
                    </div>
                  </div>

                  <div className="h-px w-full bg-[var(--color-ink)] opacity-10 my-6" />

                  <div className="space-y-1">
                    <div className="font-mono text-[10px] uppercase tracking-widest opacity-50">Primary Allocation</div>
                    <div className="text-2xl font-bold italic font-serif leading-tight">
                      "{topGoal}"
                    </div>
                  </div>
                  
                  <div className="pt-6 mt-6 border-t border-[var(--color-ink)] border-dashed opacity-50 flex justify-between items-end">
                    <div className="font-mono text-[8px] uppercase tracking-widest">
                      Age: {userData.age} / {userData.expectedAge}
                    </div>
                    <div className="font-mono text-[8px] uppercase tracking-widest text-[var(--color-accent)]">
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
