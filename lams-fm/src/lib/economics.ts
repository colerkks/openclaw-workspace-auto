/**
 * Life Force Economics Engine
 * Calculates ROHI (Return on Health Investment) and Hashrate
 */

/**
 * Daily task with metadata
 */
export interface DailyTask {
  id: string;
  category: 'remove' | 'replace' | 'reinoculate' | 'repair' | 'rebalance';
  title: string;
  description?: string;
  difficulty: number; // 1-10, where 10 is hardest
  healthImpact: number; // 1-10, where 10 has highest impact
  completed: boolean;
  completedAt?: Date;
}

/**
 * Biometrics from daily tracking
 */
export interface Biometrics {
  glucose?: number;
  sleepHours?: number;
  stressLevel?: number; // 1-10
  energyLevel?: number; // 1-10
  mood?: number; // 1-10
}

/**
 * Hashrate calculation result
 */
export interface HashrateResult {
  dailyHashrate: number;
  totalEBIO: number;
  breakdown: {
    taskCompletion: number;
    biofeedback: number;
    streakBonus: number;
  };
}

/**
 * Task difficulty multipliers
 * Harder tasks give higher rewards
 */
const DIFFICULTY_MULTIPLIERS: Record<number, number> = {
  1: 1.0,   // Very easy
  2: 1.1,
  3: 1.2,
  4: 1.3,
  5: 1.5,
  6: 1.7,   // Medium
  7: 2.0,
  8: 2.3,
  9: 2.6,
  10: 3.0,  // Very hard
};

/**
 * Health impact multipliers
 * Tasks with higher health impact get higher rewards
 */
const HEALTH_IMPACT_MULTIPLIERS: Record<number, number> = {
  1: 1.0,
  2: 1.1,
  3: 1.2,
  4: 1.3,
  5: 1.5,
  6: 1.7,
  7: 2.0,
  8: 2.3,
  9: 2.6,
  10: 3.0,
};

/**
 * Calculate daily life force Hashrate
 * 
 * Formula:
 * Base Score = Sum(completed tasks × difficulty × health impact × 10)
 * Biofeedback Bonus = Multiplier based on biometrics
 * Streak Bonus = Multiplier for consecutive days
 * Final Hashrate = Base Score × Biofeedback Bonus × Streak Bonus
 */
export function calculateDailyHashrate(
  tasks: DailyTask[],
  biometrics: Biometrics,
  consecutiveDays: number = 0
): HashrateResult {
  // 1. Base task completion score
  const completedTasks = tasks.filter(t => t.completed);
  let taskCompletionScore = 0;

  completedTasks.forEach(task => {
    const difficultyMultiplier = DIFFICULTY_MULTIPLIERS[task.difficulty] || 1.0;
    const impactMultiplier = HEALTH_IMPACT_MULTIPLIERS[task.healthImpact] || 1.0;
    
    // Base score: 10 points per task, adjusted by difficulty and impact
    taskCompletionScore += 10 * difficultyMultiplier * impactMultiplier;
  });

  // 2. Biofeedback bonus
  let biofeedbackMultiplier = 1.0;

  // Glucose in healthy range (70-99 mg/dL)
  if (biometrics.glucose && biometrics.glucose >= 70 && biometrics.glucose <= 99) {
    biofeedbackMultiplier *= 1.1; // +10% bonus
  }

  // Good sleep (7-9 hours)
  if (biometrics.sleepHours && biometrics.sleepHours >= 7 && biometrics.sleepHours <= 9) {
    biofeedbackMultiplier *= 1.15; // +15% bonus
  }

  // Low stress (1-3 on 1-10 scale)
  if (biometrics.stressLevel && biometrics.stressLevel <= 3) {
    biofeedbackMultiplier *= 1.1; // +10% bonus
  }

  // High energy (7-10 on 1-10 scale)
  if (biometrics.energyLevel && biometrics.energyLevel >= 7) {
    biofeedbackMultiplier *= 1.1; // +10% bonus
  }

  // Good mood (7-10 on 1-10 scale)
  if (biometrics.mood && biometrics.mood >= 7) {
    biofeedbackMultiplier *= 1.05; // +5% bonus
  }

  // 3. Streak bonus
  // Consecutive days: 0-3 (1x), 4-7 (1.2x), 8-14 (1.5x), 15+ (2x)
  let streakMultiplier = 1.0;
  if (consecutiveDays >= 4 && consecutiveDays < 8) {
    streakMultiplier = 1.2;
  } else if (consecutiveDays >= 8 && consecutiveDays < 15) {
    streakMultiplier = 1.5;
  } else if (consecutiveDays >= 15) {
    streakMultiplier = 2.0;
  }

  // 4. Calculate final Hashrate
  const dailyHashrate = Math.round(
    taskCompletionScore * biofeedbackMultiplier * streakMultiplier
  );

  // 5. Calculate total EBIO (Earned Biological Investment Opportunity)
  // EBIO accumulates over time (simplified: 1 EBIO = 100 Hashrate)
  const totalEBIO = Math.round(dailyHashrate / 100);

  return {
    dailyHashrate,
    totalEBIO,
    breakdown: {
      taskCompletion: Math.round(taskCompletionScore),
      biofeedback: Math.round((biofeedbackMultiplier - 1) * 100),
      streakBonus: Math.round((streakMultiplier - 1) * 100),
    },
  };
}

/**
 * Generate daily tasks based on active interventions
 */
export function generateDailyTasks(
  activeInterventions: Array<{
    id: string;
    category: string;
    title: string;
    instructions?: any;
  }>
): DailyTask[] {
  return activeInterventions.map(intervention => ({
    id: `task-${intervention.id}-${Date.now()}`,
    category: intervention.category as any,
    title: intervention.title,
    description: intervention.instructions?.timing 
      ? `${intervention.instructions.timing}` 
      : undefined,
    difficulty: Math.floor(Math.random() * 5) + 3, // Random difficulty 3-8
    healthImpact: Math.floor(Math.random() * 5) + 5, // Random impact 5-10
    completed: false,
  }));
}

/**
 * Calculate ROHI (Return on Health Investment)
 * ROHI = (Current Health Score - Initial Health Score) / Total EBIO Invested
 */
export function calculateROHI(
  currentHealthScore: number,
  initialHealthScore: number,
  totalEBIO: number
): number {
  if (totalEBIO === 0) return 0;
  
  const healthImprovement = currentHealthScore - initialHealthScore;
  return (healthImprovement / totalEBIO) * 100;
}

/**
 * Get Hashrate (EBIO) tier
 */
export function getHashrateTier(hashrate: number): string {
  if (hashrate < 50) return 'Beginner';
  if (hashrate < 100) return 'Intermediate';
  if (hashrate < 200) return 'Advanced';
  if (hashrate < 500) return 'Expert';
  return 'Master';
}

/**
 * Format Hashrate for display
 */
export function formatHashrate(hashrate: number): string {
  return `${hashrate.toLocaleString()} Hashrate`;
}

/**
 * Format EBIO for display
 */
export function formatEBIO(ebio: number): string {
  return `${ebio.toFixed(2)} EBIO`;
}
