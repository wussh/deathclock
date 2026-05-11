import React from 'react';
import { Goal, GoalInsight } from '../types';
import { analyzeGoal } from '../services/gemini';
import { GOAL_CATEGORIES } from '../constants';
import { cn, formatNumber } from '../lib/utils';
import { Plus, Loader2, Target, Calendar, Ghost, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface GoalManagerProps {
  freeHours: number;
}

export default function GoalManager({ freeHours }: GoalManagerProps) {
  const [goals, setGoals] = React.useState<Goal[]>([]);
  const [insights, setInsights] = React.useState<Record<string, GoalInsight>>({});
  const [isLoading, setIsLoading] = React.useState(false);
  const [newGoal, setNewGoal] = React.useState({ title: '', category: GOAL_CATEGORIES[0] });

  const handleAddGoal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGoal.title.trim()) return;

    setIsLoading(true);
    const goalId = Math.random().toString(36).substring(7);
    
    try {
      const insight = await analyzeGoal(newGoal.title, newGoal.category);
      
      const goal: Goal = {
        id: goalId,
        title: newGoal.title,
        category: newGoal.category,
        hoursNeeded: insight.estimatedHours,
        priority: 'medium',
        createdAt: Date.now(),
      };

      setGoals(prev => [goal, ...prev]);
      setInsights(prev => ({ ...prev, [goalId]: insight }));
      setNewGoal({ title: '', category: GOAL_CATEGORIES[0] });
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const removeGoal = (id: string) => {
    setGoals(prev => prev.filter(g => g.id !== id));
  };

  const totalGoalHours = goals.reduce((acc, curr) => acc + curr.hoursNeeded, 0);
  const percentageOfLife = (totalGoalHours / freeHours) * 100;

  return (
    <div className="space-y-12">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 space-y-6">
          <div className="space-y-1">
            <h3 className="text-2xl font-black uppercase tracking-tighter italic font-serif">Aspiration Mapping</h3>
            <p className="font-mono text-[10px] opacity-50 uppercase tracking-widest">Phase 02: Allocation</p>
          </div>

          <form onSubmit={handleAddGoal} className="space-y-4 p-6 border border-[var(--color-ink)] bg-white">
            <div className="space-y-2">
              <label className="font-mono text-[9px] uppercase tracking-[0.2em] opacity-50">Intention</label>
              <input
                type="text"
                placeholder="e.g. Master piano"
                value={newGoal.title}
                onChange={e => setNewGoal({ ...newGoal, title: e.target.value })}
                className="w-full bg-transparent border-b border-[var(--color-line)] py-2 font-mono text-sm focus:border-[var(--color-accent)] outline-none"
              />
            </div>
            
            <div className="space-y-2">
              <label className="font-mono text-[9px] uppercase tracking-[0.2em] opacity-50">Category</label>
              <select
                value={newGoal.category}
                onChange={e => setNewGoal({ ...newGoal, category: e.target.value })}
                className="w-full bg-transparent border-b border-[var(--color-line)] py-2 font-mono text-sm focus:border-[var(--color-accent)] outline-none"
              >
                {GOAL_CATEGORIES.map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            <button
              disabled={isLoading}
              className="w-full bg-[var(--color-ink)] text-[var(--color-paper)] p-3 flex items-center justify-center gap-2 hover:bg-[var(--color-accent)] transition-all disabled:opacity-50"
            >
              {isLoading ? <Loader2 className="animate-spin" size={16} /> : <Plus size={16} />}
              <span className="font-mono text-[10px] uppercase tracking-widest font-bold">Register Goal</span>
            </button>
          </form>

          <div className="p-4 border border-[var(--color-line)] space-y-4">
            <div className="flex justify-between items-end">
              <span className="font-mono text-[9px] uppercase tracking-widest opacity-50">Committed Capacity</span>
              <span className="text-xl font-bold">{percentageOfLife.toFixed(2)}%</span>
            </div>
            <div className="h-1 bg-[var(--color-line)] w-full overflow-hidden">
               <motion.div 
                 initial={{ width: 0 }}
                 animate={{ width: `${Math.min(100, percentageOfLife)}%` }}
                 className="h-full bg-[var(--color-accent)]"
               />
            </div>
            <p className="text-[10px] font-mono opacity-50 uppercase leading-tight italic">
              Percentage of your remaining free time allocated to these goals.
            </p>
          </div>
        </div>

        <div className="lg:col-span-2 space-y-4">
          <AnimatePresence mode="popLayout">
            {goals.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center border border-dashed border-[var(--color-line)] p-12 text-center opacity-30 italic font-mono text-sm">
                <Target size={40} className="mb-4 opacity-50" />
                No active goals registered in the system.
              </div>
            ) : (
              <div className="space-y-4">
                {goals.map((goal) => (
                  <GoalCard 
                    key={goal.id} 
                    goal={goal} 
                    insight={insights[goal.id]} 
                    freeHours={freeHours}
                    onRemove={() => removeGoal(goal.id)}
                  />
                ))}
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

interface GoalCardProps {
  key?: React.Key;
  goal: Goal;
  insight?: GoalInsight;
  freeHours: number;
  onRemove: () => void;
}

function GoalCard({ goal, insight, freeHours, onRemove }: GoalCardProps) {
  const [isExpanded, setIsExpanded] = React.useState(false);
  const costPercentage = (goal.hoursNeeded / freeHours) * 100;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="bg-white border-l-4 border-l-[var(--color-ink)] hover:border-l-[var(--color-accent)] transition-all group overflow-hidden"
    >
      <div className="p-6 cursor-pointer" onClick={() => setIsExpanded(!isExpanded)}>
        <div className="flex justify-between items-start mb-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
               <span className="font-mono text-[8px] bg-[var(--color-paper)] px-2 py-0.5 uppercase tracking-widest">{goal.category}</span>
               <span className="font-mono text-[8px] opacity-40 uppercase tracking-widest">{formatNumber(goal.hoursNeeded)} Hours Required</span>
            </div>
            <h4 className="text-2xl font-bold tracking-tighter uppercase">{goal.title}</h4>
          </div>
          <div className="text-right">
             <div className="text-xl font-bold text-[var(--color-accent)]">{costPercentage.toFixed(3)}%</div>
             <div className="font-mono text-[8px] opacity-40 uppercase tracking-widest">Life Cost</div>
          </div>
        </div>

        {insight && (
          <div className="space-y-4">
            <div className="flex items-start gap-2 text-[var(--color-accent)] opacity-80 italic text-xs font-mono">
              <Ghost size={14} className="shrink-0 mt-0.5" />
              <p>"{insight.guiltTrip}"</p>
            </div>
            
            <AnimatePresence>
              {isExpanded && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="pt-4 border-t border-[var(--color-line)] space-y-4 overflow-hidden"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                       <h5 className="font-mono text-[9px] uppercase tracking-widest font-bold flex items-center gap-2">
                         <Calendar size={12} /> Strategic Roadmap
                       </h5>
                       <ul className="space-y-1">
                         {insight.milestones.map((m, i) => (
                           <li key={i} className="text-[10px] font-mono opacity-60 border-l border-[var(--color-line)] pl-3 ml-1">
                             {m}
                           </li>
                         ))}
                       </ul>
                    </div>
                    <div className="space-y-2">
                       <h5 className="font-mono text-[9px] uppercase tracking-widest font-bold">The Rationale</h5>
                       <p className="text-[10px] font-mono opacity-60 italic leading-relaxed">
                         {insight.rationale}
                       </p>
                    </div>
                  </div>
                  
                  <div className="flex justify-end pt-2">
                    <button 
                      onClick={(e) => { e.stopPropagation(); onRemove(); }}
                      className="p-2 hover:bg-[var(--color-accent)] hover:text-white transition-colors opacity-20 group-hover:opacity-100"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}
      </div>
    </motion.div>
  );
}
