// exercise-row.tsx
import React from 'react';
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { ExternalLink } from 'lucide-react';
import type { Exercise } from '@/data/types';

// Types
interface ExerciseRowProps {
  exercise: Exercise;
  completed: boolean;
  onComplete: () => void;
  id: string;
  workoutType?: string;
}

interface DisplayExercise extends Exercise {
  sets?: number;
  reps: string;
  rpe?: string;
  notes?: string;
}

// Constants
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

// Helper functions
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

const getTextStyles = (
  baseStyle: string,
  completed: boolean,
  styles: { completed: string; active: string }
): string => {
  return `${baseStyle} ${completed ? styles.completed : styles.active}`;
};

// Component
export const ExerciseRow: React.FC<ExerciseRowProps> = ({ 
  exercise, 
  completed, 
  onComplete, 
  id,
  workoutType 
}) => {
  const displayExercise = getExerciseDetails(exercise, workoutType);

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

  const renderRPE = () => {
    if (!displayExercise.rpe) return null;

    return (
      <span className={getTextStyles('', completed, BASE_STYLES.rpeText)}>
        @{displayExercise.rpe}
      </span>
    );
  };

  const renderNotes = () => {
    if (!displayExercise.notes) return null;

    return (
      <div className={getTextStyles('text-xs', completed, BASE_STYLES.notes)}>
        {displayExercise.notes}
      </div>
    );
  };

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
    <div 
      className={BASE_STYLES.container}
      onClick={onComplete}
    >
      <Checkbox
        id={id}
        checked={completed}
        onCheckedChange={onComplete}
        className="mt-1"
      />

      <Label 
        htmlFor={id} 
        className={BASE_STYLES.label}
      >
        <div className="space-y-1">
          <div className={getTextStyles(BASE_STYLES.exerciseName.base, completed, BASE_STYLES.exerciseName)}>
            {displayExercise.name}
          </div>

          <div className={BASE_STYLES.metaContainer}>
            {renderSetsAndReps()}
            {renderRPE()}
          </div>

          {renderNotes()}
        </div>
      </Label>

      {renderVideoLink()}
    </div>
  );
};