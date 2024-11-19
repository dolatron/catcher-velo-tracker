/**
 * Core type definitions for the Catcher Velocity Tracker application.
 * This module contains all shared type definitions used across the application
 * for workout tracking, program management, and UI components.
 * 
 * @module types
 */

/**
 * Represents an exercise category for organization and filtering.
 * @interface Category
 */
export interface Category {
  id: string;
  name: string;
}

/**
 * Defines an exercise with both default configuration and workout-specific overrides.
 * Exercises can be customized per workout while maintaining base configuration.
 * 
 * @interface Exercise
 * @property {string} id - Unique identifier for the exercise
 * @property {string} name - Display name of the exercise
 * @property {string} category - Category identifier this exercise belongs to
 * @property {string} [videoUrl] - Optional URL to demonstration video
 * @property {number} [defaultSets] - Default number of sets from base configuration
 * @property {string} [defaultReps] - Default repetition scheme from base configuration
 * @property {string} [defaultRpe] - Default RPE target from base configuration
 * @property {string} [defaultNotes] - Default instructions or notes
 * @property {number} [sets] - Workout-specific override for number of sets
 * @property {string} [reps] - Workout-specific override for repetition scheme
 * @property {string} [rpe] - Workout-specific override for RPE target
 * @property {string} [notes] - Workout-specific override for notes
 */
export interface Exercise {
  // Core properties required for all exercises
  id: string;         // Unique identifier
  name: string;       // Display name
  category: string;   // Category identifier
  videoUrl?: string;  // Optional demo video URL

  // Base configuration from exercises.json
  defaultSets?: number;
  defaultReps?: string;
  defaultRpe?: string;
  defaultNotes?: string;

  // Workout-specific overrides from program.json
  sets?: number;      // Overrides defaultSets
  reps?: string;      // Overrides defaultReps
  rpe?: string;       // Overrides defaultRpe
  notes?: string;     // Overrides defaultNotes
}

/**
 * Represents a grouped section of exercises within a workout.
 * @interface WorkoutSection
 */
export interface WorkoutSection {
  name: string;
  exercises: Exercise[];
}

/**
 * Defines a specific type of workout with its structure and configuration.
 * 
 * @interface WorkoutType
 * @property {string} id - Unique identifier for the workout type
 * @property {string} name - Display name
 * @property {string} colorClass - CSS class for styling
 * @property {string} [description] - Optional detailed description
 * @property {string} [rpeRange] - Target RPE range for this workout type
 * @property {WorkoutSection[]} sections - Organized exercise sections
 */
export interface WorkoutType {
  id: string;
  name: string;
  colorClass: string;
  description?: string;
  rpeRange?: string;
  notes?: string;
  sections: WorkoutSection[];
}

/**
 * Defines the structure of a workout program including warmup, primary work, and recovery.
 * 
 * @interface WorkoutProgram
 * @property {Exercise[]} warmup - Warmup exercise sequence
 * @property {Exercise[]} throwing - Primary throwing exercises
 * @property {Exercise[]} recovery - Recovery and cooldown exercises
 */
export interface WorkoutProgram {
  warmup: Exercise[];
  throwing: Exercise[];
  recovery: Exercise[];
  rpeRange?: string;
  notes?: string;
}

/**
 * Comprehensive program definition including scheduling and workout types.
 * 
 * @interface Program
 * @property {string} id - Unique program identifier
 * @property {string} name - Program name
 * @property {string} version - Version identifier
 * @property {string} description - Program description
 * @property {Record<string, WorkoutType>} workoutTypes - Available workout configurations
 * @property {Object} schedule - Program schedule configuration
 */
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

/**
 * Tracks the status and progress of a single day's workout.
 * 
 * @interface DayWorkout
 * @property {Date} date - Workout date
 * @property {string} workout - Workout type identifier
 * @property {Record<string, boolean>} completed - Exercise completion status
 * @property {string} [userNotes] - User-provided workout notes
 */
export type DayWorkout = {
  date: Date;
  workout: string;
  completed: Record<string, boolean>;  // Maps exercise IDs to completion status
  userNotes?: string;                  // Optional user-provided workout notes
};

/**
 * Tracks overall workout completion progress.
 * 
 * @interface WorkoutProgress
 * @property {number} totalExercises - Total number of exercises in workout
 * @property {number} completedExercises - Number of completed exercises
 * @property {number} percentage - Completion percentage
 */
export type WorkoutProgress = {
  totalExercises: number;
  completedExercises: number;
  percentage: number;
};

/**
 * Props for the WorkoutSection component.
 * 
 * @interface WorkoutSectionProps
 * @property {string} title - Section title
 * @property {Exercise[]} [exercises] - Exercises in this section
 * @property {Record<string, boolean>} completed - Completion status
 * @property {(id: string) => void} onComplete - Exercise completion handler
 * @property {number} weekIndex - Current week index
 * @property {number} dayIndex - Current day index
 */
export interface WorkoutSectionProps {
  title: string;
  exercises?: Exercise[];
  completed: Record<string, boolean>;
  onComplete: (id: string) => void;
  weekIndex: number;
  dayIndex: number;
}

/**
 * Props for the WorkoutDetailCard component.
 * 
 * @interface WorkoutDetailCardProps
 * @property {DayWorkout} day - Current day's workout data
 * @property {WorkoutProgram} details - Workout program details
 * @property {(id: string) => void} onComplete - Single exercise completion handler
 * @property {() => void} onClose - Close detail view handler
 * @property {(exerciseIds: string[], completed: boolean) => void} onBatchComplete - Batch completion handler
 * @property {() => void} [onScroll] - Optional scroll handler
 * @property {'calendar' | 'list'} [viewMode] - Display mode
 * @property {Record<string, WorkoutType>} workoutTypes - Available workout configurations
 * @property {(notes: string) => void} onNotesChange - Notes update handler
 */
export interface WorkoutDetailCardProps {
  day: DayWorkout;                     // Current day's workout data
  details: WorkoutProgram;             // Exercise definitions and structure
  onComplete: (id: string) => void;    // Exercise completion handler
  onClose: () => void;                 // Close detail view handler
  weekIndex: number;                   // Current week (0-7)
  dayIndex: number;                    // Current day (0-6)
  onBatchComplete: (exerciseIds: string[], completed: boolean) => void;
  onScroll?: () => void;              // Optional scroll handler
  viewMode?: 'calendar' | 'list';      // Display mode
  workoutTypes: Record<string, WorkoutType>;  // Available workout configurations
  onNotesChange: (notes: string) => void;     // Notes update handler
}