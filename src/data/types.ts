// types.ts
export interface Category {
  id: string;
  name: string;
}

export interface Exercise {
  // Core properties
  id: string;
  name: string;  // Required in base definition
  category: string;  // Required in base definition
  videoUrl?: string;

  // Default values (from exercises.json)
  defaultSets?: number;
  defaultReps?: string;
  defaultRpe?: string;
  defaultNotes?: string;

  // Workout-specific overrides (from program.json)
  sets?: number;
  reps?: string;
  rpe?: string;
  notes?: string;
}

export interface WorkoutSection {
  name: string;
  exercises: Exercise[];
}

export interface WorkoutType {
  id: string;
  name: string;
  colorClass: string;  // Make sure this exists and is required
  description?: string;
  rpeRange?: string;
  notes?: string;
  sections: WorkoutSection[];
}

export interface WorkoutProgram {
  warmup: Exercise[];
  throwing: Exercise[];
  recovery: Exercise[];
  rpeRange?: string;
  notes?: string;
}

export interface Program {
  id: string;
  name: string;
  version: string;
  description: string;
  workoutTypes: Record<string, WorkoutType>;
  schedule: {
    length: number;
    unit: string;
    weeks: {
      id: string;
      days: string[];
    }[];
  };
}

export type DayWorkout = {
  date: Date;
  workout: string;
  completed: Record<string, boolean>;
};

export type WorkoutProgress = {
  totalExercises: number;
  completedExercises: number;
  percentage: number;
};