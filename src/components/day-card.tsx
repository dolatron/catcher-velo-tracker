// day-card.tsx
/**
 * DayCard Component
 * Displays a single day's workout information in a card format.
 * Used in the weekly schedule grid to show workout type and date.
 */

import React, { useMemo, forwardRef } from 'react';
import { Card } from '@/components/ui/card';
import { workoutTypes } from '@/data/workouts';

// Type Definitions
interface DayCardProps {
  workout: string;         // Name of the workout (e.g., "Hybrid B", "Recovery")
  date: Date;             // Date of the workout
  isExpanded: boolean;    // Whether this card is currently selected/expanded
  onClick: () => void;    // Handler for when card is clicked
  ref?: React.RefObject<HTMLDivElement>; // Add ref to props
  completed: boolean;    // Whether all exercises are completed
  inProgress?: boolean;  // Add new prop
  completionPercentage?: number;  // Add new prop
}

// Date formatting options for different parts of the date display
const DATE_FORMAT_OPTIONS = {
  WEEKDAY: { weekday: 'short' } as const,    // e.g., "Mon"
  DAY: { day: 'numeric' } as const,          // e.g., "15"
  MONTH: { month: 'short' } as const         // e.g., "Jan"
} as const;

// Base style definitions for consistent styling across the component
const BASE_STYLES = {
  card: {
    default: "cursor-pointer transition-colors duration-200 h-[110px] sm:h-[150px] w-full", // Increased height
    expanded: "ring-2 ring-indigo-500",
    completed: "opacity-60", // Remove border styling
    inProgress: "bg-yellow-200 text-gray-900" // Change from ring to background color
  },
  date: {
    container: "text-xs",
    weekday: "font-medium", // Remove sm:inline hidden
    datePart: "font-normal"
  },
  workout: {
    name: "font-medium text-sm sm:text-base mt-1 sm:mt-2",
    description: "text-xs mt-1.5 opacity-90 font-normal line-clamp-4",
    rpe: "text-xs mt-1 opacity-90 font-medium italic" // Remove hidden sm:block
  },
  percentage: "absolute top-2 right-2 text-xs font-medium rounded-full bg-black/10 px-1.5 py-0.5"
} as const;

/**
 * Helper Functions
 */

// Extracts base workout name by removing variations and asterisks
// e.g., "Hybrid B* OR Recovery" -> "Hybrid B"
const getBaseWorkout = (workout: string): string => 
  workout.split(' OR ')[0].replace('*', '');

// Formats a date part using specified options
const formatDate = (date: Date, options: Intl.DateTimeFormatOptions): string => 
  date.toLocaleDateString('en-US', options);

// Gets workout information from the workoutTypes mapping
// Returns default values if workout type not found
const getWorkoutInfo = (workout: string) => {
  const baseWorkout = getBaseWorkout(workout);
  return workoutTypes[baseWorkout] || {
    name: workout,
    colorClass: 'bg-gray-100 hover:bg-gray-200 text-gray-900',
    description: 'Custom workout'
  };
};

/**
 * DayCard Component
 * Displays a card showing a single day's workout information
 */
export const DayCard = forwardRef<HTMLDivElement, DayCardProps>(({
  workout,
  date,
  isExpanded,
  onClick,
  completed,
  inProgress,
  completionPercentage
}, ref) => {
  // Memoized values to prevent unnecessary recalculations
  const workoutInfo = useMemo(() => getWorkoutInfo(workout), [workout]);
  
  // Format date parts once and reuse
  const formattedDate = useMemo(() => ({
    weekday: formatDate(date, DATE_FORMAT_OPTIONS.WEEKDAY),
    day: formatDate(date, DATE_FORMAT_OPTIONS.DAY),
    month: formatDate(date, DATE_FORMAT_OPTIONS.MONTH)
  }), [date]);

  // Compute classes for card styling, including conditional expanded state
  const cardClasses = useMemo(() => {
    const baseClasses = [
      BASE_STYLES.card.default,
      // Only use the workout color if not in progress
      inProgress ? '' : workoutInfo.colorClass
    ];

    if (isExpanded) {
      baseClasses.push(BASE_STYLES.card.expanded);
    }
    if (inProgress) {
      baseClasses.push(BASE_STYLES.card.inProgress);
    }
    if (completed) {
      baseClasses.push(BASE_STYLES.card.completed);
    }

    return baseClasses.join(' ');
  }, [workoutInfo.colorClass, isExpanded, completed, inProgress]);

  return (
    <Card 
      ref={ref}
      className={`${cardClasses} group relative`} // Add relative positioning
      onClick={onClick}
      role="button"
      tabIndex={0}
      aria-expanded={isExpanded}
      onKeyPress={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick();
        }
      }}
    >
      {completionPercentage !== undefined && completionPercentage > 0 && (
        <div className={BASE_STYLES.percentage}>
          {Math.round(completionPercentage)}%
        </div>
      )}
      <div className="p-3 space-y-1">
        {/* Date Display Section */}
        <div className={BASE_STYLES.date.container}>
          <span className={BASE_STYLES.date.weekday}>
            {formattedDate.weekday}
          </span>
          {' '}
          <span className={BASE_STYLES.date.datePart}>
            {formattedDate.month} {formattedDate.day}
          </span>
        </div>

        {/* Workout Name */}
        <div className={BASE_STYLES.workout.name}>
          {workoutInfo.name}
        </div>

        {/* Workout Description - Only shown on larger screens */}
        {workoutInfo.description && (
          <div className={BASE_STYLES.workout.description}>
            {workoutInfo.description}
          </div>
        )}

        {/* RPE Range - Only shown on larger screens */}
        {workoutInfo.rpeRange && (
          <div className={BASE_STYLES.workout.rpe}>
            {workoutInfo.rpeRange}
          </div>
        )}
      </div>
    </Card>
  );
});

// Memoize the entire component to prevent unnecessary rerenders
// Only rerender if workout, date, or expanded state changes
export default React.memo(DayCard, (prevProps, nextProps) => {
  return prevProps.workout === nextProps.workout &&
    prevProps.date.getTime() === nextProps.date.getTime() &&
    prevProps.isExpanded === nextProps.isExpanded;
});