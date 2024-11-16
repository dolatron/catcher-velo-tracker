// workout-detail-card.tsx
/**
 * WorkoutDetailCard Component
 * Displays the detailed view of a workout when selected from the calendar.
 * Shows all exercises grouped by section (warm-up, throwing, recovery)
 * and allows tracking completion of individual exercises.
 */

import React from 'react';
import { Card } from '@/components/ui/card';
import { X } from 'lucide-react';
import { ExerciseRow } from '@/components/excercise-row';
import type { Exercise, WorkoutProgram } from '@/data/types';
import { workoutTypes } from '@/data/workouts';

// Constants
const DATE_FORMAT_OPTIONS: Intl.DateTimeFormatOptions = {
  weekday: 'long',    // e.g., "Monday"
  month: 'long',      // e.g., "January"
  day: 'numeric'      // e.g., "15"
} as const;

// Type Definitions
interface WorkoutSectionProps {
  title: string;                          // Section title (e.g., "Warm-up", "Throwing", "Recovery")
  exercises?: Exercise[];                 // List of exercises in this section
  completed: Record<string, boolean>;     // Completion status for each exercise
  onComplete: (id: string) => void;       // Callback when exercise completion status changes
  workoutType: string;                    // Type of workout (affects exercise variations)
  weekIndex: number;                      // Week number (1-8)
  dayIndex: number;                       // Day number (1-7)
}

interface WorkoutDetailCardProps {
  day: {
    workout: string;                      // Workout name (e.g., "Hybrid B")
    date: Date;                           // Date of the workout
    completed: Record<string, boolean>;   // Completion status of exercises
  };
  details: WorkoutProgram;                // Full workout program details
  onComplete: (id: string) => void;       // Exercise completion callback
  onClose: () => void;                    // Close detail view callback
  weekIndex: number;                      // Week number (1-8)
  dayIndex: number;                       // Day number (1-7)
  onBatchComplete: (exerciseIds: string[], completed: boolean) => void;  // Add new prop
  onScroll?: () => void;  // Add new prop for scroll handling
}

/**
 * Helper Functions
 */

/**
 * Generates a unique section identifier
 * @param weekIndex Week number
 * @param dayIndex Day number
 * @param title Section title
 * @returns Unique section identifier
 */
const getSectionId = (weekIndex: number, dayIndex: number, title: string): string => 
  `week${weekIndex}-day${dayIndex}-${title.toLowerCase()}`;

/**
 * Extracts base workout name by removing variations and asterisks
 * @param workout Workout name with possible variations
 * @returns Base workout name
 */
const getBaseWorkout = (workout: string): string => 
  workout.split(' OR ')[0].replace('*', '');

/**
 * WorkoutSection Component
 * Renders a section of exercises (e.g., Warm-up, Throwing, Recovery)
 */
const WorkoutSection: React.FC<WorkoutSectionProps> = ({ 
  title, 
  exercises = [], 
  completed = {}, 
  onComplete,
  workoutType,
  weekIndex,
  dayIndex
}) => {
  const sectionId = getSectionId(weekIndex, dayIndex, title);
  const completedCount = Object.values(completed).filter(Boolean).length;
  
  return (
    <div className="rounded-lg p-3 sm:p-6">
      {/* Section Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-base sm:text-lg font-semibold text-indigo-900">
          {title}
        </h3>
        {/* Progress Counter */}
        <span className="text-sm text-gray-500">
          {completedCount} / {exercises.length}
        </span>
      </div>

      {/* Exercise List */}
      <div className="space-y-1">
        {exercises.map((exercise) => {
          const exerciseId = `${sectionId}-${exercise.id}`;
          return (
            <ExerciseRow
              key={exerciseId}
              exercise={exercise}
              completed={!!completed[exerciseId]}
              onComplete={() => onComplete(exerciseId)}
              id={exerciseId}
              workoutType={workoutType}
            />
          );
        })}
      </div>
    </div>
  );
};

/**
 * WorkoutDetailCard Component
 * Main component for displaying detailed workout information
 */
export const WorkoutDetailCard: React.FC<WorkoutDetailCardProps> = ({ 
  day, 
  details, 
  onComplete, 
  onBatchComplete,
  onClose,
  weekIndex,
  dayIndex,
  onScroll,
}) => {
  // Get workout type information
  const baseWorkout = getBaseWorkout(day.workout);
  const workoutInfo = workoutTypes[baseWorkout];

  // Define sections based on workout type
  const workoutSections = baseWorkout === 'Off' 
    ? [{ title: "Rest Day", exercises: details.recovery }]  // Rest days only show recovery
    : [
        { title: "Warm-up", exercises: details.warmup },    // Normal days show all sections
        { title: "Throwing", exercises: details.throwing },
        { title: "Recovery", exercises: details.recovery }
      ];

  // Get all exercise IDs for batch operations
  const allExerciseIds = workoutSections.flatMap(section => 
    (section.exercises || []).map(exercise => 
      `${getSectionId(weekIndex, dayIndex, section.title)}-${exercise.id}`
    )
  );

  const handleMarkComplete = () => {
    onBatchComplete(allExerciseIds, true);
    onClose();
  };

  return (
    <Card className="w-full bg-white p-3 sm:p-6 shadow-lg">
      {/* Header Section */}
      <header className="flex justify-between items-start pb-3 sm:pb-6 border-b border-gray-200">
        <div>
          {/* Workout Title */}
          <h2 className="text-lg sm:text-xl font-semibold text-indigo-900">
            {day.workout}
          </h2>
          {/* Workout Date */}
          <p className="text-sm sm:text-base text-gray-500 mt-1">
            {day.date.toLocaleDateString('en-US', DATE_FORMAT_OPTIONS)}
          </p>
          {/* RPE Range (if specified) */}
          {workoutInfo?.rpeRange && (
            <p className="text-sm text-indigo-600 mt-1">
              Target Intensity: {workoutInfo.rpeRange}
            </p>
          )}
          {/* Additional Notes */}
          {workoutInfo?.notes && (
            <p className="text-sm text-gray-600 mt-2">
              {workoutInfo.notes}
            </p>
          )}
        </div>
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          aria-label="Close details"
        >
          <X className="w-5 h-5" />
        </button>
      </header>

      {/* Workout Sections */}
      {details && (
        <div className="divide-y divide-gray-200">
          {workoutSections.map((section) => (
            <WorkoutSection
              key={getSectionId(weekIndex, dayIndex, section.title)}
              title={section.title}
              exercises={section.exercises}
              completed={day.completed}
              onComplete={onComplete}
              workoutType={baseWorkout}
              weekIndex={weekIndex}
              dayIndex={dayIndex}
            />
          ))}
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-gray-200">
        <button
          onClick={() => {
            onBatchComplete(allExerciseIds, false);
            onScroll?.(); // Scroll but don't close
          }}
          className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-md transition-colors"
        >
          Clear Progress
        </button>
        <button
          onClick={handleMarkComplete}  // This still closes via onClose()
          className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-md transition-colors"
        >
          Complete
        </button>
      </div>
    </Card>
  );
};