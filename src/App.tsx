import React, { useState } from 'react';
import { UserData, Goal } from './types';
import InputForm from './components/InputForm';
import LifeClock from './components/LifeClock';
import GoalManager from './components/GoalManager';
import SwapCalculator from './components/SwapCalculator';
import ShareModal from './components/ShareModal';
import HowItWorks from './components/HowItWorks';
import Privacy from './components/Privacy';
import { motion, AnimatePresence } from 'motion/react';
import { Share2, Clock, Map, Activity, RefreshCw, ArrowRight, Moon, Sun } from 'lucide-react';

export default function App() {
  const [userData, setUserData] = React.useState<UserData | null>(null);
  const [view, setView] = React.useState<'landing' | 'onboarding' | 'dashboard' | 'how-it-works' | 'privacy'>('landing');
  const [dashboardStep, setDashboardStep] = React.useState<1 | 2 | 3>(1);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [goals, setGoals] = useState<Goal[]>([]);
  const [previewAge, setPreviewAge] = useState<number | string>(28);
  const previewHours = Math.max(0, Math.floor((40 - (Number(previewAge) || 0)) * 365.25 * 5.4));
  const [isDark, setIsDark] = useState(() => {
    if (typeof window !== 'undefined') {
      return document.documentElement.classList.contains('dark');
    }
    return false;
  });

  const toggleDarkMode = () => {
    setIsDark(prev => {
      const next = !prev;
      if (next) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
      return next;
    });
  };

  const freeHours = React.useMemo(() => {
    if (!userData) return 0;
    const remainingYears = userData.expectedAge - userData.age;
    const dailyCommitments = userData.sleepHours + userData.workHours + userData.socialHours;
    return remainingYears * 365.25 * (24 - dailyCommitments);
  }, [userData]);

  React.useEffect(() => {
    // Add dark mode checker
    const isDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
    if (isDarkMode && !document.documentElement.classList.contains('dark')) {
      document.documentElement.classList.add('dark');
      setIsDark(true);
    }
    if (view === 'dashboard') {
      setDashboardStep(1);
    }
  }, [view]);

  return (
    <div className="min-h-screen mission-control-bg flex flex-col font-sans">
      <header className="border-b border-[var(--color-line)] p-4 flex justify-between items-center bg-[var(--color-paper)]/80 backdrop-blur-md sticky top-0 z-50 transition-all">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-[8px] bg-[var(--color-accent)] flex items-center justify-center shadow-lg shadow-[var(--color-accent)]/20">
            <span className="text-white font-black text-xl">D</span>
          </div>
          <span className="font-bold tracking-tight text-xl">DeathClock</span>
        </div>
        
        <div className="flex items-center gap-4">
          <button
            onClick={toggleDarkMode}
            className="p-2 text-[var(--color-muted)] hover:text-[var(--color-ink)] transition-colors rounded-full hover:bg-[var(--color-card)]"
            title="Toggle Dark Mode"
          >
            {isDark ? <Sun size={18} /> : <Moon size={18} />}
          </button>
          {view === 'dashboard' && (
            <>
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
            </>
          )}
        </div>
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
              <div className="space-y-8 relative">
                <motion.div 
                  animate={{ scale: [1, 1.05, 1], opacity: [0.3, 0.5, 0.3] }}
                  transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 md:w-96 md:h-96 rounded-full border border-[var(--color-accent)]/20 blur-[2px] pointer-events-none" 
                />
                <motion.div 
                  animate={{ scale: [1, 1.1, 1], opacity: [0.1, 0.3, 0.1] }}
                  transition={{ duration: 12, repeat: Infinity, ease: "easeInOut", delay: 2 }}
                  className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 md:w-72 md:h-72 rounded-full border border-[var(--color-accent)]/40 shadow-[0_0_80px_rgba(186,117,23,0.15)] pointer-events-none" 
                />
                
                <motion.h1 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                  className="text-5xl sm:text-7xl md:text-8xl font-extrabold tracking-tight leading-tight relative z-10"
                >
                  You keep saying 'someday.'<br/><span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--color-accent)] to-[#f97316]">Someday is already half over.</span>
                </motion.h1>
                <motion.p 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                  className="text-lg md:text-xl text-[var(--color-muted)] max-w-2xl mx-auto leading-relaxed relative z-10"
                >
                  DeathClock calculates exactly how much free time you have left in your life — and shows you what you're actually doing with it.
                </motion.p>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2, duration: 0.8 }}
                  className="bg-[var(--color-card)]/80 border border-[var(--color-line)] p-6 md:p-8 rounded-2xl max-w-2xl mx-auto backdrop-blur-sm relative z-10 group"
                >
                  <div className="text-xl md:text-2xl text-[var(--color-ink)] leading-relaxed flex flex-wrap justify-center items-center gap-x-2 gap-y-2">
                    <span>If you're</span>
                    <input 
                      type="number" 
                      value={previewAge} 
                      onChange={(e) => setPreviewAge(e.target.value)} 
                      onClick={(e) => (e.target as HTMLInputElement).select()}
                      className="w-16 md:w-20 bg-transparent border-b-2 border-[var(--color-line)] group-hover:border-[var(--color-accent)] focus:border-[var(--color-accent)] text-center font-extrabold outline-none transition-all focus:bg-[var(--color-card-hover)] rounded-t-sm" 
                    />
                    <span>, you have roughly</span>
                    <div className="inline-grid [grid-template-areas:'content'] items-center justify-center mx-1">
                      <AnimatePresence mode="popLayout">
                          <motion.span 
                              key={previewHours}
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: -20 }}
                              transition={{ type: "spring", stiffness: 300, damping: 25 }}
                              className="font-mono font-bold text-[var(--color-accent)] [grid-area:content] whitespace-nowrap"
                          >
                              {previewHours.toLocaleString()} hours
                          </motion.span>
                      </AnimatePresence>
                    </div>
                    <span>before you turn 40.</span>
                    <span className="w-full mt-4 font-bold md:text-xl tracking-tight opacity-80">What are you doing with them?</span>
                  </div>
                </motion.div>
              </div>

              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                className="flex flex-col items-center gap-12"
              >
                <div className="flex flex-col items-center gap-3">
                  <button
                    onClick={() => setView('onboarding')}
                    className="btn-primary text-lg px-8 py-4 sm:px-12 sm:py-5 font-semibold group"
                  >
                    <span className="relative z-10 transition-transform group-hover:-translate-x-1">Calculate my time</span>
                    <ArrowRight size={20} className="relative z-10 opacity-70 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                  </button>
                </div>
                
                <div className="w-full max-w-4xl pt-24 mt-4 relative">
                   <div className="text-center mb-10 text-[var(--color-muted)] italic">
                     "Still not sure? Here's what the data says."
                   </div>
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left border-t border-[var(--color-line)]/50 pt-12">
                     <div className="md:col-span-2 glass-card p-8 border-l-4 border-l-[var(--color-accent)]">
                        <div className="text-6xl font-mono font-medium tracking-tight text-[var(--color-ink)] mb-4">7 years</div>
                        <h3 className="text-xl font-bold mb-2">The average person spends 7 years of their life on social media.</h3>
                        <p className="text-[var(--color-muted)] text-lg">That's not a metaphor. That's 61,320 hours you could have spent on anything else.</p>
                     </div>
                     <div className="glass-card p-8">
                        <div className="text-4xl font-mono font-medium tracking-tight text-[var(--color-ink)] mb-4">43%</div>
                        <p className="text-[var(--color-muted)] text-lg">of people feel they don't have time for things that matter to them.</p>
                     </div>
                     <div className="glass-card p-8 border-l-4 border-l-[#f97316]/50">
                        <div className="text-4xl font-mono font-medium tracking-tight text-[var(--color-ink)] mb-4">90%</div>
                        <p className="text-[var(--color-muted)] text-lg">of people aged 18–35 say they have goals they haven't started yet.</p>
                     </div>
                   </div>
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
          {view === 'how-it-works' && (
            <motion.section key="how-it-works" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <HowItWorks onBack={() => setView('landing')} />
            </motion.section>
          )}

          {view === 'privacy' && (
            <motion.section key="privacy" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <Privacy onBack={() => setView('landing')} />
            </motion.section>
          )}
        </AnimatePresence>
      </main>

      <footer className="border-t border-[var(--color-line)] p-8 text-center bg-[var(--color-paper)]/50 backdrop-blur-md mt-auto relative z-10">
        <div className="max-w-4xl mx-auto flex flex-col items-center gap-4">
          <div className="text-xs text-[var(--color-muted)]">
            © 2026 DeathClock — Every Second is an Investment.
          </div>
          <div className="flex gap-6 text-xs text-[var(--color-muted)]/50">
            <button onClick={() => setView('how-it-works')} className="hover:text-[var(--color-ink)] transition-colors cursor-pointer text-[var(--color-muted)]/70">How it works</button>
            <button onClick={() => setView('privacy')} className="hover:text-[var(--color-ink)] transition-colors cursor-pointer text-[var(--color-muted)]/70">Privacy</button>
            <span className="cursor-default text-[var(--color-muted)]/70">Made with <span className="text-[var(--color-accent)]">✦</span></span>
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
      <div className="w-10 h-10 rounded-[8px] bg-[var(--color-card-hover)] flex items-center justify-center text-[var(--color-accent)] group-hover:scale-110 transition-transform">
        {icon}
      </div>
      <h3 className="font-semibold text-lg">{title}</h3>
      <p className="text-sm text-[var(--color-muted)] leading-relaxed">{desc}</p>
    </div>
  );
}
