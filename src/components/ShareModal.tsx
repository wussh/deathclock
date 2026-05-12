import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Copy, Check, Download, Camera } from 'lucide-react';
import { UserData, Goal } from '../types';
import { formatNumber } from '../lib/utils';
import html2canvas from 'html2canvas';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  userData: UserData | null;
  freeHours: number;
  goals: Goal[];
}

export default function ShareModal({ isOpen, onClose, userData, freeHours, goals }: ShareModalProps) {
  const [copied, setCopied] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  if (!userData) return null;

  const topGoal = goals[0]?.title || "doomscrolling";
  const shareText = `I have exactly ${formatNumber(freeHours)} free hours left in my life.\nI'm spending them on ${topGoal}.\n\nCalculate your mortality at DeathClock`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(shareText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadImage = async () => {
    if (!cardRef.current) return;
    setDownloading(true);
    try {
      const canvas = await html2canvas(cardRef.current, {
        scale: 2,
        backgroundColor: document.documentElement.classList.contains('dark') ? '#09090b' : '#ffffff',
        useCORS: true,
      });
      const url = canvas.toDataURL('image/png');
      const a = document.createElement('a');
      a.href = url;
      a.download = `deathclock-${userData.age}.png`;
      a.click();
    } catch (error) {
      console.error('Failed to generate image', error);
    } finally {
      setDownloading(false);
    }
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

              <div ref={cardRef} id="share-card" className="p-8 relative bg-[var(--color-paper)] text-[var(--color-ink)] overflow-hidden flex flex-col justify-between min-h-[500px] border-b border-[var(--color-line)]">
                {/* Decorative background grid */}
                <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(var(--color-ink) 1px, transparent 1px)', backgroundSize: '16px 16px' }} />
                
                <div className="relative z-10 w-full rounded-2xl border border-[var(--color-accent)]/20 bg-[var(--color-card)]/90 backdrop-blur p-8 shadow-2xl mb-8 flex flex-col items-center flex-grow justify-center">
                  <div className="w-14 h-14 rounded-xl bg-[var(--color-accent)] flex items-center justify-center mb-6 shadow-lg shadow-[var(--color-accent)]/20">
                     <span className="text-[var(--color-paper)] font-black text-3xl">D</span>
                  </div>
                  
                  <h3 className="text-[10px] font-mono text-[var(--color-muted)] uppercase tracking-[0.2em] mb-4 text-center">Notice of Mortality</h3>
                  <div className="text-6xl sm:text-7xl font-extrabold tracking-tighter mb-2 text-center text-[var(--color-ink)]">
                    {formatNumber(freeHours)}
                  </div>
                  <div className="text-xs font-bold text-[var(--color-accent)] mb-8 tracking-[0.2em] uppercase">
                    Free Hours Left
                  </div>

                  <div className="w-full bg-[var(--color-paper)] rounded-xl p-5 border border-[var(--color-line)] text-center relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-1 h-full bg-[var(--color-accent)]" />
                    <p className="text-[var(--color-muted)] text-[9px] uppercase font-mono mb-2 tracking-widest text-left">Current allocation:</p>
                    <p className="text-xl sm:text-2xl font-black text-[var(--color-ink)] break-words leading-tight text-left">"{topGoal}"</p>
                  </div>
                </div>

                <div className="relative z-10 flex justify-between items-end px-2 w-full mt-auto">
                   <div className="space-y-1">
                      <div className="text-[9px] text-[var(--color-muted)] font-mono uppercase tracking-widest">Subject Profile</div>
                      <div className="text-xs font-mono font-bold text-[var(--color-ink)]">
                        AGE {userData.age} <span className="opacity-40">/</span> {userData.expectedAge}
                      </div>
                   </div>
                   <div className="text-right space-y-1">
                      <div className="text-[9px] text-[var(--color-muted)] font-mono uppercase tracking-widest">Generated by</div>
                      <div className="text-xs font-mono font-bold text-[var(--color-accent)] uppercase tracking-widest">DeathClock</div>
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
                <button
                  onClick={downloadImage}
                  disabled={downloading}
                  className="flex-1 bg-[var(--color-paper)] text-[var(--color-ink)] p-3 flex items-center justify-center gap-2 hover:bg-[var(--color-accent)] hover:text-white transition-colors disabled:opacity-50"
                >
                  <Camera size={16} />
                  <span className="font-mono text-[10px] uppercase tracking-widest font-bold">
                    {downloading ? 'Saving...' : 'Save Image'}
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
