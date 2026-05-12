import React from 'react';
import { UserData } from '../types';
import { cn } from '../lib/utils';
import { ArrowRight, User, Bed, Briefcase, Heart, Users } from 'lucide-react';
import { motion } from 'motion/react';

interface InputFormProps {
  onComplete: (data: UserData) => void;
}

const InputField = ({ 
  label, 
  value, 
  onChange, 
  icon: Icon, 
  min = 0, 
  max = 120,
  itemVariants 
}: { 
  label: string, 
  value: number, 
  onChange: (v: number) => void, 
  icon: any,
  min?: number,
  max?: number,
  itemVariants?: any
}) => (
  <motion.div variants={itemVariants} className="space-y-2 group">
    <div className="flex items-center gap-2 text-[var(--color-muted)] font-mono text-[10px] uppercase tracking-widest transition-colors group-focus-within:text-[var(--color-accent)]">
      <Icon size={14} />
      <span>{label}</span>
    </div>
    <input
      type="number"
      value={value}
      onChange={(e) => onChange(Number(e.target.value))}
      min={min}
      max={max}
      className="input-field"
    />
  </motion.div>
);

export default function InputForm({ onComplete }: InputFormProps) {
  const [data, setData] = React.useState<UserData>({
    age: 28,
    expectedAge: 85,
    sleepHours: 8,
    workHours: 8,
    leisureHours: 4,
    socialHours: 2,
    hobbies: [],
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onComplete(data);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 200, damping: 20 } }
  };

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="max-w-2xl mx-auto py-12 px-4"
    >
      <motion.div variants={itemVariants} className="mb-12 space-y-4 text-center">
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">Let's make it personal.</h1>
        <p className="text-sm text-[var(--color-muted)] font-mono">
          These numbers only mean something if they're honest. No one's watching.
        </p>
      </motion.div>

      <form onSubmit={handleSubmit} className="space-y-10 glass-card p-6 md:p-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <InputField 
            label="I am (years old)" 
            value={data.age} 
            onChange={(age) => setData({ ...data, age })} 
            icon={User}
            itemVariants={itemVariants}
          />
          <InputField 
            label="I expect to live (years)" 
            value={data.expectedAge} 
            onChange={(expectedAge) => setData({ ...data, expectedAge })} 
            icon={Heart}
            itemVariants={itemVariants}
          />
          <InputField 
            label="I sleep about (hours a night)" 
            value={data.sleepHours} 
            onChange={(sleepHours) => setData({ ...data, sleepHours })} 
            icon={Bed} 
            max={24}
            itemVariants={itemVariants}
          />
          <InputField 
            label="I work around (hours a day)" 
            value={data.workHours} 
            onChange={(workHours) => setData({ ...data, workHours })} 
            icon={Briefcase} 
            max={24}
            itemVariants={itemVariants}
          />
          <div className="md:col-span-2">
            <InputField 
              label="I spend about (hours on my phone daily)" 
              value={data.socialHours} 
              onChange={(socialHours) => setData({ ...data, socialHours })} 
              icon={Users} 
              max={24}
              itemVariants={itemVariants}
            />
            <p className="text-[10px] text-[var(--color-muted)] font-mono uppercase tracking-widest mt-2 ml-1 opacity-70">(be honest with this one)</p>
          </div>
        </div>

        <motion.div variants={itemVariants} className="pt-4">
          <button
            type="submit"
            className="btn-primary w-full group"
          >
            <span className="font-mono text-xs uppercase tracking-[0.2em] font-semibold">Show me the truth</span>
            <ArrowRight className="group-hover:translate-x-1 transition-transform" size={18} />
          </button>
        </motion.div>
      </form>
      
      <motion.div variants={itemVariants} className="mt-8 flex justify-center">
        <div className="flex flex-col gap-1 font-mono text-[10px] text-[var(--color-muted)] uppercase tracking-widest text-center">
          <span>// System Ready</span>
          <span>// Data will remain local to your session</span>
        </div>
      </motion.div>
    </motion.div>
  );
}
