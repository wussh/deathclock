import React from 'react';
import { UserData } from './types';
import InputForm from './components/InputForm';
import LifeClock from './components/LifeClock';
import GoalManager from './components/GoalManager';
import SwapCalculator from './components/SwapCalculator';
import { motion, AnimatePresence } from 'motion/react';
import { Share2, Clock, Map, Activity, RefreshCw } from 'lucide-react';

export default function App() {
  const [userData, setUserData] = React.useState<UserData | null>(null);
  const [view, setView] = React.useState<'landing' | 'onboarding' | 'dashboard'>('landing');

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
             <button className="flex items-center gap-2 border border-[var(--color-ink)] px-3 py-1.5 hover:bg-[var(--color-ink)] hover:text-[var(--color-paper)] transition-all">
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
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="max-w-4xl mx-auto px-6 py-24 text-center space-y-12"
            >
              <div className="space-y-4">
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="font-mono text-xs uppercase tracking-[0.4em] opacity-40"
                >
                  Project Mortality. System Online.
                </motion.div>
                <h1 className="text-7xl md:text-9xl font-black uppercase tracking-tighter leading-none font-serif italic">
                  Tempus Fugit
                </h1>
                <p className="text-xl md:text-2xl font-mono opacity-60 max-w-2xl mx-auto leading-tight italic">
                  "You have roughly 24,000 hours before your next decade. What will you trade them for?"
                </p>
              </div>

              <div className="flex flex-col items-center gap-8">
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
              </div>
            </motion.section>
          )}

          {view === 'onboarding' && (
            <motion.section
              key="onboarding"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
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
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="max-w-7xl mx-auto px-6 py-12 space-y-24"
            >
              <LifeClock userData={userData} />
              <div className="h-px bg-[var(--color-line)]" />
              <GoalManager freeHours={freeHours} />
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
