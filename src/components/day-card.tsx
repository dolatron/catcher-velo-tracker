/**
 * DayCard Component
 * 
 * Displays a single day's workout information in a clickable card format.
 * Features:
 * - Responsive layout for calendar and list views
 * - Visual indicators for completion status
 * - Progress percentage display
 * - Interactive state handling
 * - Accessibility support
 */

import React, { useMemo, forwardRef } from 'react';
import { Card } from '@/components/ui/card';
import { StickyNote } from 'lucide-react'; // Add this import
import type { WorkoutType } from '@/common/types';
import { getBaseWorkout, formatDate } from '@/common/utils';

/**
 * Props for the DayCard component
 */
interface DayCardProps {
  workout: string;              // Workout identifier
  date: Date;                   // Scheduled date
  isExpanded: boolean;          // Current expansion state
  onClick: () => void;          // Click handler
  ref?: React.RefObject<HTMLDivElement>;
  completed: boolean;           // Full completion status
  inProgress?: boolean;         // Partial completion status
  completionPercentage?: number;// Progress indicator
  viewMode?: 'calendar' | 'list';
  workoutTypes: Record<string, WorkoutType>;
  userNotes?: string;  // Add this prop
}

/**
 * Date formatting options for different display contexts
 */
const DATE_FORMAT_OPTIONS = {
  WEEKDAY: { weekday: 'short' } as const,    // e.g., "Mon"
  DAY: { day: 'numeric' } as const,          // e.g., "15"
  MONTH: { month: 'short' } as const         // e.g., "Jan"
} as const;

/**
 * Style configurations for component appearance
 */
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
    : "absolute top-2 right-2 text-xs font-medium rounded-full bg-black/10 px-1.5 py-0.5",
  notes: {
    icon: "absolute bottom-1 right-1 sm:bottom-2 sm:right-2 text-gray-400 w-3 h-3 sm:w-4 sm:h-4"
  }
} as const;

/**
 * Gets workout information from available workout types
 * Provides fallback for unknown workout types
 * 
 * @param workout - Workout identifier
 * @param workoutTypes - Available workout configurations
 */
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
 * Displays workout information in an interactive card format
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
  viewMode = 'calendar',
  userNotes,
}, ref) => {
  // Memoized computations
  const workoutInfo = useMemo(() => getWorkoutInfo(workout, workoutTypes), [workout, workoutTypes]);
  
  // Format date parts once and reuse
  const formattedDate = useMemo(() => ({
    weekday: formatDate(date, DATE_FORMAT_OPTIONS.WEEKDAY),
    day: formatDate(date, DATE_FORMAT_OPTIONS.DAY),
    month: formatDate(date, DATE_FORMAT_OPTIONS.MONTH)
  }), [date]);

  // Dynamic class computation
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
      {/* Add Note Indicator */}
      {userNotes && (
        <StickyNote className={BASE_STYLES.notes.icon} />
      )}
    </Card>
  );
});

DayCard.displayName = 'DayCard';

/**
 * Memoized export to prevent unnecessary rerenders
 * Only updates on workout, date, or expansion state changes
 */
export default React.memo(DayCard, (prevProps, nextProps) => {
  return prevProps.workout === nextProps.workout &&
    prevProps.date.getTime() === nextProps.date.getTime() &&
    prevProps.isExpanded === nextProps.isExpanded;
});