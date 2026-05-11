export interface UserData {
  age: number;
  expectedAge: number;
  sleepHours: number;
  workHours: number;
  leisureHours: number;
  socialHours: number;
  hobbies: string[];
}

export interface Goal {
  id: string;
  title: string;
  category: string;
  hoursNeeded: number;
  priority: 'low' | 'medium' | 'high';
  createdAt: number;
}

export interface LifeStats {
  totalRemainingHours: number;
  awakeRemainingHours: number;
  freeRemainingHours: number;
  yearsRemaining: number;
  daysRemaining: number;
}

export interface SwapInsight {
  achievableGoal: string;
  commentary: string;
}

export interface GoalInsight {
  estimatedHours: number;
  rationale: string;
  milestones: string[];
  guiltTrip: string;
  costOfDelay: string;
}
