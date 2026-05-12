import React, { useState, useEffect, useRef } from 'react';
import { UserData } from '../types';
import { ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface InputFormProps {
  onComplete: (data: UserData) => void;
}

export default function InputForm({ onComplete }: InputFormProps) {
  const [data, setData] = useState<UserData>({
    age: 28,
    expectedAge: 85,
    sleepHours: 8,
    workHours: 8,
    leisureHours: 4,
    socialHours: 2,
    hobbies: [],
  });
  const [step, setStep] = useState(0);

  const questions = [
    { 
      key: 'age', 
      text: "I have burned for", 
      suffix: "years",
      getMicroCopy: (v: number) => ""
    },
    { 
      key: 'expectedAge', 
      text: "I hope to keep the flame alive to", 
      suffix: "years",
      getMicroCopy: (v: number) => ""
    },
    { 
      key: 'sleepHours', 
      text: "I surrender", 
      suffix: "hours to the dark each night",
      getMicroCopy: (v: number) => v < 6 ? "A fragile wick burns faster." : v > 8 ? "Much of your flame is spent in the dark." : "A balanced rest to feed the fire."
    },
    { 
      key: 'workHours', 
      text: "I sacrifice", 
      suffix: "hours a day to my labor",
      getMicroCopy: (v: number) => v >= 10 ? "Are you trading your spark for ash?" : v >= 8 ? "A glowing tribute, but a massive sacrifice." : "Guarding your time deliberately."
    },
    { 
      key: 'socialHours', 
      text: "I let my attention drift to screens for", 
      suffix: "hours daily",
      getMicroCopy: (v: number) => v >= 4 ? `That's ${Math.floor((v * 365) / 24)} days each year scattered to the wind.` : v > 0 ? "Even small drafts steal the heat from your life." : "Fiercely protecting your focus."
    }
  ];

  const handleNext = () => {
    if (step < questions.length) {
      setStep(step + 1);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, idx: number) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (idx === step) {
        handleNext();
      }
    }
  };

  const handleSubmit = () => {
    onComplete(data);
  };

  // Auto-scroll to bottom of page when stepping
  useEffect(() => {
    window.scrollTo({
      top: document.documentElement.scrollHeight,
      behavior: 'smooth',
    });
  }, [step]);

  return (
    <div className="max-w-3xl mx-auto py-12 px-4 min-h-[70vh] flex flex-col justify-center">
      <div className="space-y-16 py-12">
        {questions.map((q, idx) => {
          const isActive = step === idx;
          const isPast = step > idx;
          
          if (!isActive && !isPast) return null;

          return (
            <motion.div 
              key={q.key}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: isActive ? 1 : 0.4, y: 0 }}
              className="flex flex-col items-center justify-center gap-2 group"
            >
              <div className="flex items-center flex-wrap justify-center gap-x-4 gap-y-2 text-2xl md:text-4xl text-[var(--color-muted)] transition-opacity">
                <span>{q.text}</span>
                <input 
                  type="number"
                  autoFocus={isActive}
                  value={data[q.key as keyof UserData] as number || ''}
                  onChange={(e) => setData({ ...data, [q.key]: Number(e.target.value) })}
                  onKeyDown={(e) => handleKeyDown(e, idx)}
                  onClick={() => setStep(idx)}
                  className="bg-transparent border-b-2 border-transparent focus:border-[var(--color-accent)] outline-none text-4xl md:text-5xl font-extrabold text-center w-24 md:w-32 text-[var(--color-ink)] transition-colors cursor-pointer group-hover:border-[var(--color-line)] focus:cursor-text"
                  min={0}
                />
                <span>{q.suffix}.</span>
              </div>
              
              <AnimatePresence>
                {isActive && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="flex flex-col items-center gap-2 mt-4"
                  >
                    {q.getMicroCopy(data[q.key as keyof UserData] as number) && (
                      <span className="text-sm font-mono text-[var(--color-muted)] italic">
                        "{q.getMicroCopy(data[q.key as keyof UserData] as number)}"
                      </span>
                    )}
                    <button 
                      onClick={handleNext}
                      className="mt-4 font-mono text-[10px] uppercase tracking-widest text-[var(--color-ink)] border border-[var(--color-line)] px-4 py-2 rounded-full hover:bg-[var(--color-card-hover)] transition-colors"
                    >
                      Press Enter ↵
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}

        <AnimatePresence>
          {step === questions.length && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col items-center justify-center pt-12 mt-12 border-t border-[var(--color-line)]/50"
            >
              <div className="flex flex-col gap-1 font-mono text-[10px] text-[var(--color-muted)] uppercase tracking-widest text-center mb-6">
                <span>// Data will remain local to your session</span>
              </div>
              
              <button
                onClick={handleSubmit}
                className="btn-primary group px-12 py-5 text-lg shadow-2xl shadow-[var(--color-accent)]/20"
              >
                <span className="font-mono text-sm uppercase tracking-[0.2em] font-semibold relative z-10 transition-transform group-hover:-translate-x-1">Show me the truth</span>
                <ArrowRight className="relative z-10 opacity-70 group-hover:opacity-100 group-hover:translate-x-1 transition-all" size={20} />
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
