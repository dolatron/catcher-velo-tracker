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
import type { Exercise } from '@/common/types';

// Type Definitions
interface ExerciseRowProps {
  exercise: Exercise;
  completed: boolean;
  onComplete: () => void;
  id: string;
}

// Base styles for consistent component styling
const BASE_STYLES = {
  container: "flex items-start gap-2 sm:gap-3 p-2 rounded-lg hover:bg-gray-50/50 transition-colors",
  label: "flex-grow cursor-pointer select-none",
  exerciseName: {
    base: "font-medium text-base",
    completed: "text-gray-400 line-through",
    active: "text-gray-900"
  },
  metaContainer: "flex flex-wrap gap-2 text-sm",
  metaText: {
    completed: "text-gray-400",
    active: "text-gray-600"
  },
  rpeText: {
    completed: "text-gray-400",
    active: "text-indigo-600 font-medium"
  },
  notes: {
    completed: "text-gray-400",
    active: "text-gray-500"
  },
  checkbox: `h-5 w-5 mt-0.5 
    rounded
    border border-gray-900 
    transition-colors 
    focus-visible:outline-none 
    focus-visible:ring-0`,
  videoLink: "text-blue-500 hover:text-blue-700 p-1 hover:bg-blue-50 rounded-full transition-colors shrink-0"
} as const;

/**
 * Helper Functions
 */

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
  id 
}) => {
  // Get actual values, preferring specific over defaults
  const sets = exercise.sets || exercise.defaultSets;
  const reps = exercise.reps || exercise.defaultReps;
  const rpe = exercise.rpe || exercise.defaultRpe;
  const notes = exercise.notes || exercise.defaultNotes;
  const name = exercise.name || exercise.id; // Fallback to id if no name

  /**
   * Renders the sets and reps information
   */
  const renderSetsAndReps = () => {
    if (!reps) return null;

    const text = sets !== undefined
      ? `${sets}x${reps}`
      : reps;

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
    if (!rpe) return null;

    return (
      <span className={getTextStyles('', completed, BASE_STYLES.rpeText)}>
        @{rpe}
      </span>
    );
  };

  /**
   * Renders additional notes or instructions for the exercise
   */
  const renderNotes = () => {
    if (!notes) return null;

    return (
      <div className={getTextStyles('text-xs', completed, BASE_STYLES.notes)}>
        {notes}
      </div>
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
          className={BASE_STYLES.checkbox}
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
              {name}
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
      {exercise.videoUrl && (
        <a
          href={exercise.videoUrl}
          target="_blank"
          rel="noopener noreferrer"
          className={BASE_STYLES.videoLink}
          onClick={(e) => e.stopPropagation()}
          aria-label={`Watch video demonstration for ${exercise.name}`}
        >
          <ExternalLink className="w-4 h-4" />
        </a>
      )}
    </div>
  );
};