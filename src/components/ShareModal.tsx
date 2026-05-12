import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Copy, Check, Download, Camera, Skull } from 'lucide-react';
import { UserData, Goal } from '../types';
import { formatNumber } from '../lib/utils';
import { toPng } from 'html-to-image';

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
  const [cardTitle, setCardTitle] = useState("The Fading Light");
  const cardRef = useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (isOpen) {
      const titles = [
        "The Fading Light",
        "Notice of Mortality",
        "The Extinguishing Flame",
        "A Final Reckoning"
      ];
      setCardTitle(titles[Math.floor(Math.random() * titles.length)]);
    }
  }, [isOpen]);

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
      const dataUrl = await toPng(cardRef.current, {
        pixelRatio: 2,
        backgroundColor: '#0b0704',
      });
      const a = document.createElement('a');
      a.href = dataUrl;
      a.download = `deathclock-${userData.age}.png`;
      document.body.appendChild(a); // Append to body to ensure click works in some environments
      a.click();
      document.body.removeChild(a);
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
            className="fixed inset-0 bg-[#0b0704]/80 backdrop-blur-md z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-[#0b0704] border border-[#e56a17]/30 w-full max-w-md shadow-[0_0_50px_rgba(229,106,23,0.2)] relative overflow-hidden rounded-xl"
            >
              <button 
                onClick={onClose}
                className="absolute top-4 right-4 text-[var(--color-ink)] hover:text-[var(--color-accent)] transition-colors z-10"
              >
                <X size={20} />
              </button>

              <div ref={cardRef} id="share-card" className="p-8 relative bg-[#0b0704] text-[#fcf6e8] overflow-hidden flex flex-col justify-between min-h-[500px] border border-[#e56a17]/20 rounded-xl">
                {/* Decorative background grid */}
                <div className="absolute inset-0 opacity-[0.05] pointer-events-none" style={{ backgroundImage: 'radial-gradient(#e56a17 1px, transparent 1px)', backgroundSize: '16px 16px' }} />
                
                <div className="relative z-10 w-full rounded-2xl border border-[#e56a17]/20 bg-[#150e09]/90 backdrop-blur p-8 shadow-[0_0_30px_rgba(229,106,23,0.15)] mb-8 flex flex-col items-center flex-grow justify-center">
                  <div className="w-14 h-14 rounded-xl bg-gradient-to-t from-[#913d0a] to-[#d65f11] border border-[#f08535]/30 flex items-center justify-center mb-6 shadow-lg shadow-[#e56a17]/20">
                     <Skull size={28} className="text-[#fcf6e8]" />
                  </div>
                  
                  <h3 className="text-[10px] font-mono text-[#a38a75] uppercase tracking-[0.2em] mb-4 text-center">{cardTitle}</h3>
                  <div className="text-6xl sm:text-7xl font-sans font-extrabold tracking-tighter mb-2 text-center text-[#fcf6e8]">
                    {formatNumber(freeHours)}
                  </div>
                  <div className="text-xs font-bold text-[#ffb04f] mb-8 tracking-[0.2em] uppercase">
                    Hours Before Ash
                  </div>

                  <div className="w-full bg-[#1a110a] rounded-xl p-5 border border-[#e56a17]/20 text-center relative overflow-hidden shadow-inner">
                    <div className="absolute top-0 left-0 w-1 h-full bg-[#e56a17]" />
                    <p className="text-[#a38a75] text-[9px] uppercase font-mono mb-2 tracking-widest text-left">Burning for:</p>
                    <p className="text-xl sm:text-2xl font-serif font-black text-[#fcf6e8] break-words leading-tight text-left">"{topGoal}"</p>
                  </div>
                </div>

                <div className="relative z-10 flex justify-between items-end px-2 w-full mt-auto">
                   <div className="space-y-1">
                      <div className="text-[9px] text-[#a38a75] font-mono uppercase tracking-widest">Subject Profile</div>
                      <div className="text-xs font-mono font-bold text-[#fcf6e8]">
                        AGE {userData.age} <span className="opacity-40">/</span> {userData.expectedAge}
                      </div>
                   </div>
                   <div className="text-right space-y-1">
                      <div className="text-[9px] text-[#a38a75] font-mono uppercase tracking-widest">Generated by</div>
                      <div className="text-xs font-mono font-bold text-[#e56a17] uppercase tracking-widest">DeathClock</div>
                   </div>
                </div>
              </div>

              <div className="bg-[#150e09] border-t border-[#e56a17]/20 p-4 flex gap-4">
                <button
                  onClick={copyToClipboard}
                  className="flex-1 bg-transparent border border-[#e56a17]/30 text-[#ffb04f] p-3 flex items-center justify-center gap-2 hover:bg-[#e56a17]/10 transition-colors rounded-lg shadow-[0_0_15px_rgba(229,106,23,0.1)]"
                >
                  {copied ? <Check size={16} /> : <Copy size={16} />}
                  <span className="font-mono text-[10px] uppercase tracking-widest font-bold">
                    {copied ? 'Copied!' : 'Copy Text'}
                  </span>
                </button>
                <button
                  onClick={downloadImage}
                  disabled={downloading}
                  className="flex-1 bg-gradient-to-t from-[#913d0a] to-[#d65f11] text-[#fcf6e8] p-3 flex items-center justify-center gap-2 hover:brightness-110 transition-colors disabled:opacity-50 rounded-lg shadow-[0_0_20px_rgba(229,106,23,0.4)] border border-[#f08535]/30"
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
