/**
 * Exercise Row Component
 * 
 * Renders an individual exercise item within a workout section.
 * Handles displaying exercise details, completion state, and video links.
 * Features:
 * - Interactive checkbox for completion tracking
 * - Dynamic styling based on completion state
 * - Optional video demonstration links
 * - Responsive layout for mobile and desktop
 */

import React from 'react';
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { ExternalLink } from 'lucide-react';
import type { Exercise } from '@/common/types';

// Type Definitions
/**
 * Props for the ExerciseRow component
 */
interface ExerciseRowProps {
  exercise: Exercise;
  completed: boolean;
  onComplete: () => void;
  id: string;
}

// Base styles for consistent component styling
/**
 * Style configurations for consistent component appearance
 * Separated by functional area for better organization
 */
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
 * Combines style classes based on completion state
 * 
 * @param baseStyle - Base CSS classes
 * @param completed - Current completion state
 * @param styles - Style variants for completed/active states
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
 * Displays a single exercise with its details and completion state
 */
export const ExerciseRow: React.FC<ExerciseRowProps> = ({ 
  exercise,
  completed,
  onComplete,
  id 
}) => {
  // Extract exercise properties with fallbacks
  const sets = exercise.sets || exercise.defaultSets;
  const reps = exercise.reps || exercise.defaultReps;
  const rpe = exercise.rpe || exercise.defaultRpe;
  const notes = exercise.notes || exercise.defaultNotes;
  const name = exercise.name || exercise.id;

  /**
   * Render functions for exercise details
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

  const renderRPE = () => {
    if (!rpe) return null;

    return (
      <span className={getTextStyles('', completed, BASE_STYLES.rpeText)}>
        @{rpe}
      </span>
    );
  };

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