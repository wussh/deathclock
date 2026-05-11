import React from 'react';
import { UserData } from '../types';
import { cn } from '../lib/utils';
import { ArrowRight, User, Bed, Briefcase, Heart, Users } from 'lucide-react';

interface InputFormProps {
  onComplete: (data: UserData) => void;
}

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

  const InputField = ({ 
    label, 
    value, 
    onChange, 
    icon: Icon, 
    min = 0, 
    max = 120 
  }: { 
    label: string, 
    value: number, 
    onChange: (v: number) => void, 
    icon: any,
    min?: number,
    max?: number
  }) => (
    <div className="space-y-2 group">
      <div className="flex items-center gap-2 text-[var(--color-ink)] opacity-50 font-mono text-[10px] uppercase tracking-widest group-focus-within:opacity-100 transition-opacity">
        <Icon size={12} />
        <span>{label}</span>
      </div>
      <input
        type="number"
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        min={min}
        max={max}
        className="w-full bg-transparent border-b border-[var(--color-line)] py-2 font-mono text-xl focus:border-[var(--color-accent)] outline-none transition-colors"
      />
    </div>
  );

  return (
    <div className="max-w-xl mx-auto py-12 px-6">
      <div className="mb-12 space-y-4">
        <h1 className="text-5xl font-extrabold tracking-tighter uppercase">Calculation of Persistence</h1>
        <p className="text-sm text-[var(--color-ink)] opacity-60 font-mono italic">
          "The first step to immortality is accurately measuring your mortality."
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          <InputField 
            label="Current Age" 
            value={data.age} 
            onChange={(age) => setData({ ...data, age })} 
            icon={User} 
          />
          <InputField 
            label="Expected Lifespan" 
            value={data.expectedAge} 
            onChange={(expectedAge) => setData({ ...data, expectedAge })} 
            icon={Heart} 
          />
          <InputField 
            label="Sleep (Hours/Day)" 
            value={data.sleepHours} 
            onChange={(sleepHours) => setData({ ...data, sleepHours })} 
            icon={Bed} 
            max={24}
          />
          <InputField 
            label="Work (Hours/Day)" 
            value={data.workHours} 
            onChange={(workHours) => setData({ ...data, workHours })} 
            icon={Briefcase} 
            max={24}
          />
          <InputField 
            label="Social (Hours/Day)" 
            value={data.socialHours} 
            onChange={(socialHours) => setData({ ...data, socialHours })} 
            icon={Users} 
            max={24}
          />
          <InputField 
            label="Leisure (Hours/Day)" 
            value={data.leisureHours} 
            onChange={(leisureHours) => setData({ ...data, leisureHours })} 
            icon={Heart} 
            max={24}
          />
        </div>

        <div className="pt-6">
          <button
            type="submit"
            className="group flex items-center justify-between w-full border border-[var(--color-ink)] p-4 hover:bg-[var(--color-ink)] hover:text-[var(--color-paper)] transition-all duration-300"
          >
            <span className="font-mono text-xs uppercase tracking-[0.2em] font-semibold">Generate Life Dashboard</span>
            <ArrowRight className="group-hover:translate-x-2 transition-transform" size={18} />
          </button>
        </div>
      </form>
      
      <div className="mt-12 pt-8 border-t border-[var(--color-line)] opacity-30">
        <div className="flex flex-col gap-1 font-mono text-[8px] uppercase tracking-widest">
          <span>// System Ready</span>
          <span>// Awaiting Physiological Inputs</span>
          <span>// Data will remain local to your session</span>
        </div>
      </div>
    </div>
  );
}
