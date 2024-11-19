// day-card.tsx
/**
 * DayCard Component
 * Displays a single day's workout information in a card format.
 * Used in the weekly schedule grid to show workout type and date.
 */

import React, { useMemo, forwardRef } from 'react';
import { Card } from '@/components/ui/card';
import type { WorkoutType } from '@/common/types';
import { getBaseWorkout, formatDate } from '@/common/utils';

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
  viewMode?: 'calendar' | 'list';
  workoutTypes: Record<string, WorkoutType>;  // Add this prop
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
    default: "cursor-pointer transition-colors duration-200 w-full", // Remove fixed height
    calendar: "h-[80px] sm:h-[150px]", // Reduced mobile height
    list: "min-h-[80px]",
    expanded: "ring-2 ring-indigo-500",
    completed: "opacity-60 before:absolute before:inset-0 before:bg-[linear-gradient(135deg,transparent_45%,#666_45%,#666_55%,transparent_55%)] before:bg-[length:10px_10px]", // Changed 45deg to 135deg
    inProgress: "bg-yellow-200 text-gray-900" // Change from ring to background color
  },
  date: {
    container: (viewMode: string) => viewMode === 'calendar' ? "text-[9px] sm:text-xs" : "text-xs sm:text-xs",
    weekday: "font-medium",
    datePart: "font-normal"
  },
  workout: {
    name: (viewMode: 'calendar' | 'list') => viewMode === 'calendar' 
      ? "font-medium text-[9px] sm:text-base mt-0.5 sm:mt-2 line-clamp-2 sm:line-clamp-none"
      : "font-medium text-sm sm:text-base mt-1 sm:mt-2",
    description: (viewMode: 'calendar' | 'list') => viewMode === 'calendar'
      ? "hidden sm:block text-xs mt-1.5 opacity-90 font-normal line-clamp-4"
      : "block text-xs mt-1.5 opacity-90 font-normal line-clamp-4",
    rpe: (viewMode: 'calendar' | 'list') => viewMode === 'calendar'
      ? "hidden sm:block text-xs mt-1 opacity-90 font-medium italic"
      : "block text-xs mt-1 opacity-90 font-medium italic"
  },
  percentage: (viewMode: 'calendar' | 'list') => viewMode === 'calendar'
    ? "absolute top-1 right-1 sm:top-2 sm:right-2 text-[9px] sm:text-xs font-medium rounded-full bg-black/10 px-1 sm:px-1.5 py-0.5"
    : "absolute top-2 right-2 text-xs font-medium rounded-full bg-black/10 px-1.5 py-0.5"
} as const;

/**
 * Helper Functions
 */

// Gets workout information from the workoutTypes mapping
// Returns default values if workout type not found
const getWorkoutInfo = (workout: string, workoutTypes: Record<string, WorkoutType>): WorkoutType => {
  const baseWorkout = getBaseWorkout(workout);
  const workoutType = workoutTypes[baseWorkout];

  if (!workoutType) {
    return {
      id: 'custom',
      name: workout,
      colorClass: 'bg-gray-100 hover:bg-gray-200 text-gray-900',
      description: 'Custom workout',
      sections: []
    };
  }

  return workoutType;
};

/**
 * DayCard Component
 * Displays a card showing a single day's workout information
 */
export const DayCard = forwardRef<HTMLDivElement, DayCardProps>(({
  workout,
  workoutTypes,  // Add this prop
  date,
  isExpanded,
  onClick,
  completed,
  inProgress,
  completionPercentage,
  viewMode = 'calendar'
}, ref) => {
  // Memoized values to prevent unnecessary recalculations
  const workoutInfo = useMemo(() => getWorkoutInfo(workout, workoutTypes), [workout, workoutTypes]);
  
  // Format date parts once and reuse
  const formattedDate = useMemo(() => ({
    weekday: formatDate(date, DATE_FORMAT_OPTIONS.WEEKDAY),
    day: formatDate(date, DATE_FORMAT_OPTIONS.DAY),
    month: formatDate(date, DATE_FORMAT_OPTIONS.MONTH)
  }), [date]);

  // Compute classes for card styling, including conditional expanded state
  const cardClasses = useMemo(() => {
    const classes = [];
    
    // Add base classes
    classes.push('rounded-xl', 'border', 'shadow-sm');
    classes.push(BASE_STYLES.card.default);
    classes.push(BASE_STYLES.card[viewMode]);
    
    // Add color class (if not in progress)
    if (!inProgress) {
      classes.push(workoutInfo.colorClass);
    }
    
    // Add state classes
    if (isExpanded) classes.push(BASE_STYLES.card.expanded);
    if (inProgress) classes.push(BASE_STYLES.card.inProgress);
    if (completed) classes.push(BASE_STYLES.card.completed);

    return classes.join(' ');
  }, [workoutInfo.colorClass, isExpanded, completed, inProgress, viewMode]);

  return (
    <Card 
      ref={ref}
      className={`${cardClasses} group relative overflow-hidden`} // Add overflow-hidden to contain diagonal lines
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
        <div className={BASE_STYLES.percentage(viewMode)}>
          {Math.round(completionPercentage)}%
        </div>
      )}
      <div className="p-2 sm:p-3 space-y-0.5 sm:space-y-1">
        {/* Date Display Section */}
        <div className={BASE_STYLES.date.container(viewMode)}>
          <span className={BASE_STYLES.date.weekday}>
            {formattedDate.weekday}
          </span>
          {' '}
          <span className={BASE_STYLES.date.datePart}>
            {formattedDate.month} {formattedDate.day}
          </span>
        </div>

        {/* Workout Name */}
        <div className={BASE_STYLES.workout.name(viewMode)}>
          {workoutInfo.name}
        </div>

        {/* Workout Description - Only shown on larger screens */}
        {workoutInfo.description && (
          <div className={BASE_STYLES.workout.description(viewMode)}>
            {workoutInfo.description}
          </div>
        )}

        {/* RPE Range - Only shown on larger screens */}
        {workoutInfo.rpeRange && (
          <div className={BASE_STYLES.workout.rpe(viewMode)}>
            {workoutInfo.rpeRange}
          </div>
        )}
      </div>
    </Card>
  );
});

DayCard.displayName = 'DayCard';

// Memoize the entire component to prevent unnecessary rerenders
// Only rerender if workout, date, or expanded state changes
export default React.memo(DayCard, (prevProps, nextProps) => {
  return prevProps.workout === nextProps.workout &&
    prevProps.date.getTime() === nextProps.date.getTime() &&
    prevProps.isExpanded === nextProps.isExpanded;
});