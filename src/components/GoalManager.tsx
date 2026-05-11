import React from 'react';
import { Goal, GoalInsight } from '../types';
import { analyzeGoal } from '../services/gemini';
import { GOAL_CATEGORIES } from '../constants';
import { cn, formatNumber } from '../lib/utils';
import { Plus, Loader2, Target, Calendar, Ghost, Trash2, ArrowUpCircle, ArrowRightCircle, ArrowDownCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface GoalManagerProps {
  freeHours: number;
  goals: Goal[];
  setGoals: React.Dispatch<React.SetStateAction<Goal[]>>;
}

export default function GoalManager({ freeHours, goals, setGoals }: GoalManagerProps) {
  const [insights, setInsights] = React.useState<Record<string, GoalInsight>>({});
  const [isLoading, setIsLoading] = React.useState(false);
  const [newGoal, setNewGoal] = React.useState({ title: '', category: GOAL_CATEGORIES[0], priority: 'medium' as Goal['priority'] });

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
        priority: newGoal.priority,
        createdAt: Date.now(),
      };

      setGoals(prev => [...prev, goal]);
      setInsights(prev => ({ ...prev, [goalId]: insight }));
      setNewGoal({ title: '', category: GOAL_CATEGORIES[0], priority: 'medium' });
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

  const priorityWeight = { high: 3, medium: 2, low: 1 };
  const sortedGoals = [...goals].sort((a, b) => priorityWeight[b.priority] - priorityWeight[a.priority]);

  return (
    <div id="phase-02" className="space-y-12">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 space-y-6">
          <div className="space-y-2">
            <div className="inline-block border border-[var(--color-line)] bg-[var(--color-card)] px-3 py-1 rounded-full font-mono text-xs text-[var(--color-muted)] tracking-wider">
              Phase 02: Allocation
            </div>
            <h3 className="text-3xl font-bold tracking-tight">Aspiration Mapping</h3>
          </div>

          <form onSubmit={handleAddGoal} className="space-y-6 glass-card p-6">
            <div className="space-y-2">
              <label className="font-mono text-[10px] uppercase tracking-[0.2em] opacity-50">Intention</label>
              <input
                type="text"
                placeholder="e.g. Master piano"
                value={newGoal.title}
                onChange={e => setNewGoal({ ...newGoal, title: e.target.value })}
                className="input-field"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="font-mono text-[10px] uppercase tracking-[0.2em] opacity-50">Category</label>
                <select
                  value={newGoal.category}
                  onChange={e => setNewGoal({ ...newGoal, category: e.target.value })}
                  className="input-field text-sm"
                >
                  {GOAL_CATEGORIES.map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label className="font-mono text-[10px] uppercase tracking-[0.2em] opacity-50">Priority</label>
                <select
                  value={newGoal.priority}
                  onChange={e => setNewGoal({ ...newGoal, priority: e.target.value as Goal['priority'] })}
                  className="input-field text-sm"
                >
                  <option value="high">High</option>
                  <option value="medium">Medium</option>
                  <option value="low">Low</option>
                </select>
              </div>
            </div>

            <button
              disabled={isLoading}
              className="btn-primary w-full disabled:opacity-50"
            >
              {isLoading ? <Loader2 className="animate-spin" size={18} /> : <Plus size={18} />}
              <span className="font-mono text-xs uppercase tracking-widest font-bold">Register Goal</span>
            </button>
          </form>

          <div className="glass-card p-5 space-y-4 bg-gradient-to-br from-[var(--color-card)] to-transparent">
            <div className="flex justify-between items-end">
              <span className="font-mono text-[10px] uppercase tracking-widest text-[var(--color-muted)]">Committed Capacity</span>
              <span className="text-2xl font-mono font-extrabold text-[var(--color-ink)]">{percentageOfLife.toFixed(2)}%</span>
            </div>
            <div className="h-2 bg-[var(--color-line)] w-full overflow-hidden rounded-full">
               <motion.div 
                 initial={{ width: 0 }}
                 animate={{ width: `${Math.min(100, percentageOfLife)}%` }}
                 className="h-full bg-[var(--color-accent)] rounded-full transition-all duration-1000"
               />
            </div>
            <p className="text-[11px] text-[var(--color-muted)] leading-tight italic">
              Percentage of your remaining free time allocated to these goals.
            </p>
          </div>
        </div>

        <div className="lg:col-span-2 space-y-4">
          <AnimatePresence mode="popLayout">
            {sortedGoals.length === 0 ? (
              <motion.div 
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }} 
                exit={{ opacity: 0 }}
                className="h-full flex flex-col items-center justify-center glass-card border-dashed p-12 text-center text-[var(--color-muted)] italic text-sm"
              >
                <Target size={48} className="mb-4 opacity-50 text-[var(--color-accent)]" />
                No active goals registered in the system.
              </motion.div>
            ) : (
              <div className="space-y-4">
                {sortedGoals.map((goal) => (
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

  const PriorityIcon = goal.priority === 'high' ? ArrowUpCircle : goal.priority === 'medium' ? ArrowRightCircle : ArrowDownCircle;
  const priorityColor = goal.priority === 'high' ? 'text-[var(--color-accent)]' : goal.priority === 'medium' ? 'text-orange-500' : 'text-[var(--color-muted)]';

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95, y: 10 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95, y: -10 }}
      transition={{ type: "spring", stiffness: 250, damping: 25 }}
      className="glass-card transition-all group overflow-hidden border-l-4 hover:border-l-[var(--color-accent)]"
      style={{ borderLeftColor: goal.priority === 'high' ? 'var(--color-accent)' : goal.priority === 'medium' ? '#f97316' : '#78716c' }}
    >
      <div className="p-6 cursor-pointer" onClick={() => setIsExpanded(!isExpanded)}>
        <div className="flex justify-between items-start mb-4">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
               <span className="font-mono text-[10px] bg-[var(--color-card-hover)] px-2.5 py-1 rounded-full uppercase tracking-widest text-[var(--color-ink)]/70">{goal.category}</span>
               <span className={cn("flex items-center gap-1 font-mono text-[10px] uppercase tracking-widest font-semibold", priorityColor)}>
                 <PriorityIcon size={14} /> {goal.priority} priority
               </span>
               <span className="font-mono text-[10px] text-[var(--color-muted)] uppercase tracking-widest">{formatNumber(goal.hoursNeeded)} Hours Required</span>
            </div>
            <h4 className="text-2xl font-bold tracking-tight">{goal.title}</h4>
          </div>
          <div className="text-right flex flex-col items-end gap-1">
             <div className="text-2xl font-mono font-extrabold text-[var(--color-accent)]">{costPercentage.toFixed(2)}%</div>
             <div className="font-mono text-[10px] text-[var(--color-muted)] uppercase tracking-widest">Life Cost</div>
          </div>
        </div>

        {insight && (
          <div className="space-y-4">
            <div className="flex flex-col gap-2">
              <div className="flex items-start gap-2 text-[var(--color-accent)]/80 italic text-sm">
                <Ghost size={16} className="shrink-0 mt-0.5" />
                <p>"{insight.guiltTrip}"</p>
              </div>
              {insight.costOfDelay && (
                <div className="flex items-start gap-2 text-orange-500/80 italic text-sm bg-orange-500/5 p-3 border border-orange-500/10 rounded-md">
                  <span className="font-mono text-xs uppercase tracking-widest opacity-50 shrink-0 mt-0.5 whitespace-nowrap">Cost of Delay:</span>
                  <p>{insight.costOfDelay}</p>
                </div>
              )}
            </div>
            
            <AnimatePresence initial={false}>
              {isExpanded && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ type: "spring", stiffness: 200, damping: 20 }}
                  className="pt-6 mt-4 border-t border-[var(--color-line)] space-y-6 overflow-hidden"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                       <h5 className="font-mono text-[10px] uppercase tracking-widest font-bold flex items-center gap-2 text-[var(--color-muted)]">
                         <Calendar size={14} className="text-[var(--color-accent)]" /> Strategic Roadmap
                       </h5>
                       <ul className="space-y-2">
                         {insight.milestones.map((m, i) => (
                           <li key={i} className="text-sm text-[var(--color-ink)]/90 border-l-2 border-[var(--color-line)] pl-3">
                             <span className="text-[var(--color-accent)]/50 font-mono text-xs mr-2">[{i+1}]</span>
                             {m}
                           </li>
                         ))}
                       </ul>
                    </div>
                    <div className="space-y-3">
                       <h5 className="font-mono text-[10px] uppercase tracking-widest font-bold text-[var(--color-muted)]">The Rationale</h5>
                       <p className="text-sm text-[var(--color-ink)]/80 italic leading-relaxed bg-[var(--color-card)] p-4 rounded-lg border border-[var(--color-line)]">
                         {insight.rationale}
                       </p>
                    </div>
                  </div>
                  
                  <div className="flex justify-end pt-4 border-t border-[var(--color-line)]/50 mt-4">
                    <button 
                      onClick={(e) => { e.stopPropagation(); onRemove(); }}
                      className="flex items-center gap-2 text-sm text-[var(--color-muted)] hover:text-red-500 transition-colors hover:bg-red-500/10 px-4 py-2 rounded-lg"
                    >
                      <Trash2 size={16} /> Remove Goal
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
