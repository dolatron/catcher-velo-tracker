// types.ts

export interface Exercise {
  id: string;
  name: string;
  sets?: number;
  reps: string;
  rpe?: string;
  notes?: string;
  videoUrl?: string;
  variations?: Record<string, {
    sets?: number;
    reps?: string;
    rpe?: string;
    notes?: string;
  }>;
}

export interface WorkoutType {
  name: string;
  colorClass: string;
  description?: string;
  rpeRange?: string;
  notes?: string;
}

export interface WorkoutProgram {
  warmup: Exercise[];
  throwing: Exercise[];
  recovery: Exercise[];
  rpeRange?: string;
  notes?: string;
}

export type DayWorkout = {
  date: Date;
  workout: string;
  completed: Record<string, boolean>;
};