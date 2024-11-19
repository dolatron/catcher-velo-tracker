/**
 * WorkoutDetailCard Component
 * 
 * Displays detailed workout information when a day is selected.
 * Features:
 * - Exercise sections with completion tracking
 * - User notes input
 * - Batch completion controls
 * - Workout metadata display (RPE, notes)
 * - Responsive layout for calendar and list views
 */

import React from 'react';
import { Card } from '@/components/ui/card';
import { X } from 'lucide-react';
import { ExerciseRow } from '@/components/exercise-row';
import type { 
  WorkoutSectionProps, 
  WorkoutDetailCardProps 
} from '@/common/types';
import { getBaseWorkout } from '@/common/utils';

/**
 * Format configuration for workout date display
 */
const DATE_FORMAT_OPTIONS: Intl.DateTimeFormatOptions = {
  weekday: 'long',
  month: 'long',
  day: 'numeric'
} as const;

/**
 * Generates unique identifier for exercise sections
 * Used to track completion state
 */
const getSectionId = (weekIndex: number, dayIndex: number, title: string): string => 
  `week${weekIndex}-day${dayIndex}-${title.toLowerCase()}`;

/**
 * WorkoutSection Component
 * Renders a group of exercises with completion tracking
 */
const WorkoutSection: React.FC<WorkoutSectionProps> = ({ 
  title, 
  exercises = [], 
  completed = {}, 
  onComplete,
  weekIndex,
  dayIndex
}) => {
  const sectionId = `week${weekIndex}-day${dayIndex}-${title.toLowerCase()}`;
  const completedCount = exercises.filter(ex => completed[`${sectionId}-${ex.id}`]).length;
  
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
            />
          );
        })}
      </div>
    </div>
  );
};

/**
 * WorkoutDetailCard Component
 * Main container for workout details and exercise tracking
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
  viewMode = 'calendar',
  workoutTypes,
  onNotesChange
}) => {
  // Get workout configuration
  const baseWorkout = getBaseWorkout(day.workout);
  const workoutInfo = workoutTypes[baseWorkout];

  // Configure sections based on workout type
  const workoutSections = baseWorkout === 'Off' 
    ? [{ title: "Recovery", exercises: details.recovery }]
    : [
        { title: "Warm-up", exercises: details.warmup },
        { title: "Throwing", exercises: details.throwing },
        { title: "Recovery", exercises: details.recovery }
      ].filter(section => section.exercises?.length > 0);

  // Prepare exercise IDs for batch operations
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
    <Card className={`w-full bg-white p-3 sm:p-6 shadow-lg ${
      viewMode === 'list' ? 'mt-2' : viewMode === 'calendar' ? 'mt-4' : ''
    }`}>
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
              weekIndex={weekIndex}
              dayIndex={dayIndex}
            />
          ))}
          
          {/* Notes Section - Added to the same divided container */}
          <div className="rounded-lg p-3 sm:p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base sm:text-lg font-semibold text-indigo-900">
                Notes
              </h3>
            </div>

            <textarea
              id="workout-notes"
              rows={3}
              className="block w-full rounded-md border border-gray-300 p-2 text-sm 
                         focus:border-indigo-500 focus:ring-indigo-500"
              placeholder="Add any notes about this workout..."
              value={day.userNotes ?? ''}
              onChange={(e) => onNotesChange?.(e.target.value)}
            />
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-gray-200">
        <button
          onClick={() => {
            onNotesChange(''); // Clear notes
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