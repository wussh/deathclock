import React, { useState } from 'react';
import { UserData, Goal } from './types';
import InputForm from './components/InputForm';
import LifeClock from './components/LifeClock';
import GoalManager from './components/GoalManager';
import SwapCalculator from './components/SwapCalculator';
import ShareModal from './components/ShareModal';
import { motion, AnimatePresence } from 'motion/react';
import { Share2, Clock, Map, Activity, RefreshCw } from 'lucide-react';

export default function App() {
  const [userData, setUserData] = React.useState<UserData | null>(null);
  const [view, setView] = React.useState<'landing' | 'onboarding' | 'dashboard'>('landing');
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [goals, setGoals] = useState<Goal[]>([]);

  const freeHours = React.useMemo(() => {
    if (!userData) return 0;
    const remainingYears = userData.expectedAge - userData.age;
    const dailyCommitments = userData.sleepHours + userData.workHours + userData.socialHours;
    return remainingYears * 365.25 * (24 - dailyCommitments);
  }, [userData]);

  return (
    <div className="min-h-screen mission-control-bg flex flex-col">
      <header className="border-b border-[var(--color-ink)] p-4 flex justify-between items-center bg-[var(--color-paper)] sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-[var(--color-ink)] flex items-center justify-center">
            <span className="text-[var(--color-paper)] font-black text-xl">D</span>
          </div>
          <span className="font-black uppercase tracking-tighter text-xl">DeathClock.ai</span>
        </div>
        
        {view === 'dashboard' && (
          <div className="flex items-center gap-4">
             <button 
               onClick={() => { setUserData(null); setView('onboarding'); }}
               className="p-2 hover:bg-[var(--color-line)] transition-colors"
               title="Reset Data"
             >
               <RefreshCw size={16} />
             </button>
             <button 
                onClick={() => setIsShareModalOpen(true)}
                className="flex items-center gap-2 border border-[var(--color-ink)] px-3 py-1.5 hover:bg-[var(--color-ink)] hover:text-[var(--color-paper)] transition-all">
                <Share2 size={14} />
                <span className="font-mono text-[9px] uppercase tracking-widest font-bold">Share Identity</span>
             </button>
          </div>
        )}
      </header>

      <main className="flex-1 overflow-x-hidden">
        <AnimatePresence mode="wait">
          {view === 'landing' && (
            <motion.section
              key="landing"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], staggerChildren: 0.1 }}
              className="max-w-4xl mx-auto px-6 py-24 text-center space-y-12"
            >
              <div className="space-y-4">
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.2, duration: 0.8, ease: "easeOut" }}
                  className="font-mono text-xs uppercase tracking-[0.4em] opacity-40"
                >
                  Project Mortality. System Online.
                </motion.div>
                <motion.h1 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                  className="text-7xl md:text-9xl font-black uppercase tracking-tighter leading-none font-serif italic"
                >
                  Tempus Fugit
                </motion.h1>
                <motion.p 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                  className="text-xl md:text-2xl font-mono opacity-60 max-w-2xl mx-auto leading-tight italic"
                >
                  "You have roughly 24,000 hours before your next decade. What will you trade them for?"
                </motion.p>
              </div>

              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                className="flex flex-col items-center gap-8"
              >
                <button
                  onClick={() => setView('onboarding')}
                  className="group relative border-2 border-[var(--color-ink)] px-12 py-5 hover:bg-[var(--color-ink)] hover:text-[var(--color-paper)] transition-all duration-500 overflow-hidden"
                >
                  <span className="relative z-10 font-bold uppercase tracking-[0.3em] font-mono text-sm">Measure Your Mortality</span>
                  <div className="absolute inset-0 bg-[var(--color-accent)] translate-y-full group-hover:translate-y-0 transition-transform duration-500 opacity-20" />
                </button>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left border-t border-[var(--color-line)] pt-12 w-full">
                  <Feature title="Life Visualization" desc="A real-time inventory of your remaining conscious hours." icon={<Clock size={20} />} />
                  <Feature title="Goal Mapping" desc="AI estimates the cost of your dreams in units of life." icon={<Map size={20} />} />
                  <Feature title="Reality Engine" desc="Cold, hard data to break the cycle of later." icon={<Activity size={20} />} />
                </div>
              </motion.div>
            </motion.section>
          )}

          {view === 'onboarding' && (
            <motion.section
              key="onboarding"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ type: "spring", stiffness: 200, damping: 20 }}
            >
              <InputForm 
                onComplete={(data) => {
                  setUserData(data);
                  setView('dashboard');
                }} 
              />
            </motion.section>
          )}

          {view === 'dashboard' && userData && (
            <motion.section
              key="dashboard"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ type: "spring", stiffness: 100, damping: 20, staggerChildren: 0.1 }}
              className="max-w-7xl mx-auto px-6 py-12 space-y-24"
            >
              <LifeClock userData={userData} />
              <div className="h-px bg-[var(--color-line)]" />
              <GoalManager freeHours={freeHours} goals={goals} setGoals={setGoals} />
              <div className="h-px bg-[var(--color-line)]" />
              <SwapCalculator />
            </motion.section>
          )}
        </AnimatePresence>
      </main>

      <footer className="border-t border-[var(--color-line)] p-8 text-center bg-white/50 backdrop-blur-sm mt-auto">
        <div className="max-w-4xl mx-auto flex flex-col items-center gap-4">
          <div className="font-mono text-[9px] uppercase tracking-[0.3em] opacity-40">
            © 2026 DeathClock.ai — Every Second is an Investment.
          </div>
          <div className="flex gap-6 opacity-30">
            <span className="font-mono text-[8px] uppercase tracking-widest cursor-wait">Access Logs</span>
            <span className="font-mono text-[8px] uppercase tracking-widest cursor-wait">Global Stats</span>
            <span className="font-mono text-[8px] uppercase tracking-widest cursor-wait">Survival Protocol</span>
          </div>
        </div>
      </footer>

      <ShareModal 
        isOpen={isShareModalOpen} 
        onClose={() => setIsShareModalOpen(false)} 
        userData={userData}
        freeHours={freeHours}
        goals={goals}
      />
    </div>
  );
}

function Feature({ title, desc, icon }: any) {
  return (
    <div className="space-y-3 p-4 hover:bg-white/50 transition-colors cursor-default border-l border-transparent hover:border-[var(--color-accent)]">
      <div className="text-[var(--color-accent)]">{icon}</div>
      <h3 className="font-black uppercase tracking-tighter text-lg">{title}</h3>
      <p className="text-xs font-mono opacity-50 leading-relaxed uppercase">{desc}</p>
    </div>
  );
}
