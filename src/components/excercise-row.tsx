// exercise-row.tsx
/**
 * ExerciseRow Component
 * Renders a single exercise within a workout, displaying exercise details,
 * completion status, and optional video demonstration link.
 * Each row is interactive, allowing users to mark exercises as complete.
 */

import React from 'react';
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { ExternalLink } from 'lucide-react';
import type { Exercise } from '@/data/types';

// Type Definitions
interface ExerciseRowProps {
  exercise: Exercise;         // The exercise data to display
  completed: boolean;         // Whether the exercise has been completed
  onComplete: () => void;     // Callback when exercise is marked complete/incomplete
  id: string;                 // Unique identifier for the exercise
  workoutType?: string;       // Optional type of workout (affects exercise variations)
}

// Extended exercise type that includes computed display properties
interface DisplayExercise extends Exercise {
  sets?: number;              // Number of sets to perform
  reps: string;              // Repetition scheme (e.g., "3x10" or "30 seconds")
  rpe?: string;              // Rate of Perceived Exertion target
  notes?: string;            // Additional instructions or tips
}

// Base styles for consistent component styling
const BASE_STYLES = {
  container: "flex items-start gap-2 sm:gap-3 p-2 rounded-lg hover:bg-gray-50 group",
  label: "flex-grow cursor-pointer select-none text-base",
  exerciseName: {
    base: "font-medium",
    completed: "line-through text-gray-500",
    active: "text-gray-900"
  },
  metaContainer: "flex flex-wrap gap-2 text-sm text-muted-foreground",
  metaText: {
    completed: "text-gray-400",
    active: ""
  },
  rpeText: {
    completed: "text-gray-400",
    active: "text-indigo-600"
  },
  notes: {
    completed: "text-gray-400",
    active: "text-gray-500"
  },
  videoLink: "text-blue-500 hover:text-blue-700 p-1 hover:bg-blue-50 rounded-full transition-colors shrink-0"
} as const;

/**
 * Helper Functions
 */

/**
 * Gets exercise details including any workout-specific variations
 * @param exercise Base exercise data
 * @param workoutType Optional workout type to get variations for
 * @returns Combined exercise data with any variation-specific overrides
 */
const getExerciseDetails = (
  exercise: Exercise, 
  workoutType?: string
): DisplayExercise => {
  const variation = workoutType && exercise.variations?.[workoutType];
  return {
    ...exercise,
    ...(variation || {})
  };
};

/**
 * Combines base style with completion-dependent styles
 * @param baseStyle Base style class
 * @param completed Whether the exercise is completed
 * @param styles Object containing completed and active style variants
 * @returns Combined style classes
 */
const getTextStyles = (
  baseStyle: string,
  completed: boolean,
  styles: { completed: string; active: string }
): string => {
  return `${baseStyle} ${completed ? styles.completed : styles.active}`;
};

/**
 * ExerciseRow Component
 */
export const ExerciseRow: React.FC<ExerciseRowProps> = ({ 
  exercise, 
  completed, 
  onComplete, 
  id,
  workoutType 
}) => {
  // Get exercise details including any workout-specific variations
  const displayExercise = getExerciseDetails(exercise, workoutType);

  /**
   * Renders the sets and reps information
   * Format examples: "3x10" or "30-60 seconds"
   */
  const renderSetsAndReps = () => {
    if (!displayExercise.reps) return null;

    const text = displayExercise.sets !== undefined
      ? `${displayExercise.sets}x${displayExercise.reps}`
      : displayExercise.reps;

    return (
      <span className={getTextStyles('', completed, BASE_STYLES.metaText)}>
        {text}
      </span>
    );
  };

  /**
   * Renders the RPE (Rate of Perceived Exertion) target if specified
   */
  const renderRPE = () => {
    if (!displayExercise.rpe) return null;

    return (
      <span className={getTextStyles('', completed, BASE_STYLES.rpeText)}>
        @{displayExercise.rpe}
      </span>
    );
  };

  /**
   * Renders additional notes or instructions for the exercise
   */
  const renderNotes = () => {
    if (!displayExercise.notes) return null;

    return (
      <div className={getTextStyles('text-xs', completed, BASE_STYLES.notes)}>
        {displayExercise.notes}
      </div>
    );
  };

  /**
   * Renders the video demonstration link if available
   */
  const renderVideoLink = () => {
    if (!displayExercise.videoUrl) return null;

    return (
      <a
        href={displayExercise.videoUrl}
        target="_blank"
        rel="noopener noreferrer"
        className={BASE_STYLES.videoLink}
        onClick={(e) => e.stopPropagation()}
        aria-label={`Watch video demonstration for ${displayExercise.name}`}
      >
        <ExternalLink className="w-4 h-4" />
      </a>
    );
  };

  return (
    /* Main container - entire row is clickable for exercise completion toggle */
    <div 
      className={BASE_STYLES.container}
      onClick={onComplete}
    >
      {/* Left section: Checkbox and exercise details
          Flex container ensures proper alignment of checkbox with content */}
      <div className="flex items-start gap-2 flex-grow" onClick={onComplete}>
        {/* Interactive checkbox component
            'mt-1' aligns checkbox with first line of text */}
        <Checkbox
          id={id}
          checked={completed}
          onCheckedChange={onComplete}
          className="mt-1"
        />
  
        {/* Exercise details section
            htmlFor matches checkbox id for accessibility */}
        <Label 
          htmlFor={id} 
          className={BASE_STYLES.label}
        >
          {/* Content wrapper with consistent spacing */}
          <div className="space-y-1">
            {/* Exercise name with conditional styling based on completion status */}
            <div className={getTextStyles(BASE_STYLES.exerciseName.base, completed, BASE_STYLES.exerciseName)}>
              {displayExercise.name}
            </div>
  
            {/* Exercise metadata (sets, reps, RPE) container */}
            <div className={BASE_STYLES.metaContainer}>
              {renderSetsAndReps()}
              {renderRPE()}
            </div>
  
            {/* Optional exercise notes/instructions */}
            {renderNotes()}
          </div>
        </Label>
      </div>
  
      {/* Optional video demonstration link
          Rendered only when videoUrl is available
          stopPropagation prevents row click when clicking link */}
      {displayExercise.videoUrl && (
        <a
          href={displayExercise.videoUrl}
          target="_blank"
          rel="noopener noreferrer"
          className={BASE_STYLES.videoLink}
          onClick={(e) => e.stopPropagation()}
          aria-label={`Watch video demonstration for ${displayExercise.name}`}
        >
          <ExternalLink className="w-4 h-4" />
        </a>
      )}
    </div>
  );
};