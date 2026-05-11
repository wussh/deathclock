import React, { useState } from 'react';
import { UserData, Goal } from './types';
import InputForm from './components/InputForm';
import LifeClock from './components/LifeClock';
import GoalManager from './components/GoalManager';
import SwapCalculator from './components/SwapCalculator';
import ShareModal from './components/ShareModal';
import { motion, AnimatePresence } from 'motion/react';
import { Share2, Clock, Map, Activity, RefreshCw, ArrowRight } from 'lucide-react';

export default function App() {
  const [userData, setUserData] = React.useState<UserData | null>(null);
  const [view, setView] = React.useState<'landing' | 'onboarding' | 'dashboard'>('landing');
  const [dashboardStep, setDashboardStep] = React.useState<1 | 2 | 3>(1);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [goals, setGoals] = useState<Goal[]>([]);

  const freeHours = React.useMemo(() => {
    if (!userData) return 0;
    const remainingYears = userData.expectedAge - userData.age;
    const dailyCommitments = userData.sleepHours + userData.workHours + userData.socialHours;
    return remainingYears * 365.25 * (24 - dailyCommitments);
  }, [userData]);

  React.useEffect(() => {
    if (view === 'dashboard') {
      setDashboardStep(1);
    }
  }, [view]);

  return (
    <div className="min-h-screen mission-control-bg flex flex-col font-sans">
      <header className="border-b border-[var(--color-line)] p-4 flex justify-between items-center bg-[var(--color-paper)]/80 backdrop-blur-md sticky top-0 z-50 transition-all">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-[var(--color-accent)] flex items-center justify-center shadow-lg shadow-[var(--color-accent)]/20">
            <span className="text-white font-black text-xl">D</span>
          </div>
          <span className="font-bold tracking-tight text-xl">DeathClock<span className="text-[var(--color-muted)]">.ai</span></span>
        </div>
        
        {view === 'dashboard' && (
          <div className="flex items-center gap-4">
             <button 
               onClick={() => { setUserData(null); setView('onboarding'); }}
               className="p-2 text-[var(--color-muted)] hover:text-[var(--color-ink)] transition-colors rounded-full hover:bg-[var(--color-card)]"
               title="Restart"
             >
               <RefreshCw size={18} />
             </button>
             <button 
                onClick={() => setIsShareModalOpen(true)}
                className="btn-secondary py-2 px-4 text-sm scale-90 sm:scale-100 origin-right">
                <Share2 size={16} />
                <span className="font-medium hidden sm:inline-block">Share Identity</span>
             </button>
          </div>
        )}
      </header>

      <main className="flex-1 overflow-x-hidden relative">
        <AnimatePresence mode="wait">
          {view === 'landing' && (
            <motion.section
              key="landing"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], staggerChildren: 0.1 }}
              className="max-w-5xl mx-auto px-6 py-24 md:py-32 text-center space-y-16"
            >
              <div className="space-y-6">
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.2, duration: 0.8, ease: "easeOut" }}
                  className="inline-block border border-[var(--color-accent)]/30 bg-[var(--color-accent)]/10 text-[var(--color-accent)] px-4 py-1.5 rounded-full font-mono text-xs font-semibold uppercase tracking-widest backdrop-blur-sm"
                >
                  Project Mortality. System Online.
                </motion.div>
                <motion.h1 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                  className="text-5xl sm:text-7xl md:text-8xl font-extrabold tracking-tight leading-tight"
                >
                  Time is your only <br/><span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--color-accent)] to-orange-400">true currency.</span>
                </motion.h1>
                <motion.p 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                  className="text-lg md:text-xl text-[var(--color-muted)] max-w-2xl mx-auto leading-relaxed"
                >
                  You have roughly <span className="font-mono text-[var(--color-ink)]">24,000</span> hours before your next decade. What will you trade them for?
                </motion.p>
              </div>

              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                className="flex flex-col items-center gap-12"
              >
                <button
                  onClick={() => setView('onboarding')}
                  className="btn-primary text-lg px-8 py-4 sm:px-12 sm:py-5 font-semibold group"
                >
                  <span className="relative z-10 transition-transform group-hover:-translate-x-1">Measure Your Mortality</span>
                  <Activity size={20} className="relative z-10 opacity-70 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                </button>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left w-full max-w-4xl mx-auto pt-8">
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
              initial={{ opacity: 0, filter: "blur(10px)", scale: 0.95 }}
              animate={{ opacity: 1, filter: "blur(0px)", scale: 1 }}
              exit={{ opacity: 0, filter: "blur(10px)", scale: 0.95 }}
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
              transition={{ type: "spring", stiffness: 100, damping: 20 }}
              className="max-w-6xl mx-auto px-6 py-12 space-y-32"
            >
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="space-y-12"
              >
                <LifeClock userData={userData} />
                
                {dashboardStep === 1 && (
                  <motion.div 
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.5 }}
                    className="flex justify-center mt-12"
                  >
                    <button 
                      onClick={() => {
                        setDashboardStep(2);
                        setTimeout(() => {
                           const el = document.getElementById('phase-02');
                           el?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                        }, 100);
                      }}
                      className="btn-secondary group animate-pulse hover:animate-none"
                    >
                      <span className="font-mono text-xs uppercase tracking-widest font-bold">Proceed to Phase 02: Allocation</span>
                      <ArrowRight size={16} className="group-hover:translate-y-1 rotate-90 transition-transform" />
                    </button>
                  </motion.div>
                )}
              </motion.div>
              
              {dashboardStep >= 2 && (
                <motion.div
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8 }}
                  className="space-y-12"
                >
                  <div className="h-px bg-[var(--color-line)] w-full max-w-md mx-auto opacity-50" />
                  <GoalManager freeHours={freeHours} goals={goals} setGoals={setGoals} />

                  {dashboardStep === 2 && (
                    <motion.div 
                      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
                      className="flex justify-center pt-12"
                    >
                      <button 
                        onClick={() => {
                          setDashboardStep(3);
                          setTimeout(() => {
                            const el = document.getElementById('phase-03');
                            el?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                          }, 100);
                        }}
                        className="btn-secondary group animate-pulse hover:animate-none"
                      >
                        <span className="font-mono text-xs uppercase tracking-widest font-bold">Proceed to Phase 03: Reallocation</span>
                        <ArrowRight size={16} className="group-hover:translate-y-1 rotate-90 transition-transform" />
                      </button>
                    </motion.div>
                  )}
                </motion.div>
              )}

              {dashboardStep >= 3 && (
                <motion.div
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8 }}
                  className="space-y-12 pb-24"
                >
                  <div className="h-px bg-[var(--color-line)] w-full max-w-md mx-auto opacity-50" />
                  <SwapCalculator />
                </motion.div>
              )}
            </motion.section>
          )}
        </AnimatePresence>
      </main>

      <footer className="border-t border-[var(--color-line)] p-8 text-center bg-[var(--color-paper)]/50 backdrop-blur-md mt-auto relative z-10">
        <div className="max-w-4xl mx-auto flex flex-col items-center gap-4">
          <div className="text-xs text-[var(--color-muted)]">
            © 2026 DeathClock.ai — Every Second is an Investment.
          </div>
          <div className="flex gap-6 text-xs text-[var(--color-muted)]/50">
            <span className="hover:text-[var(--color-ink)] transition-colors cursor-pointer">Access Logs</span>
            <span className="hover:text-[var(--color-ink)] transition-colors cursor-pointer">Global Stats</span>
            <span className="hover:text-[var(--color-ink)] transition-colors cursor-pointer">Survival Protocol</span>
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
    <div className="glass-card p-6 flex flex-col gap-3 hover:border-[var(--color-accent)]/50 transition-colors group">
      <div className="w-10 h-10 rounded-lg bg-[var(--color-card-hover)] flex items-center justify-center text-[var(--color-accent)] group-hover:scale-110 transition-transform">
        {icon}
      </div>
      <h3 className="font-semibold text-lg">{title}</h3>
      <p className="text-sm text-[var(--color-muted)] leading-relaxed">{desc}</p>
    </div>
  );
}
