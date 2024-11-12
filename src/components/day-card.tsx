// day-card.tsx
import React, { useMemo } from 'react';
import { Card } from '@/components/ui/card';
import { workoutTypes } from '@/data/workouts';

// Types
interface DayCardProps {
  workout: string;
  date: Date;
  isExpanded: boolean;
  onClick: () => void;
}

// Constants
const DATE_FORMAT_OPTIONS = {
  WEEKDAY: { weekday: 'short' } as const,
  DAY: { day: 'numeric' } as const,
  MONTH: { month: 'short' } as const
} as const;

const BASE_STYLES = {
  card: {
    default: "cursor-pointer transition-colors duration-200",
    expanded: "ring-2 ring-indigo-500",
  },
  date: {
    container: "text-xs",
    weekday: "font-medium",
    datePart: "font-normal"
  },
  workout: {
    name: "font-bold text-base mt-2",  // Increased size and weight
    description: "text-xs mt-1.5 hidden sm:block opacity-90 font-normal",
    rpe: "text-xs mt-1 hidden sm:block opacity-90 font-medium italic"  // Added italic
  }
} as const;

// Helper functions
const getBaseWorkout = (workout: string): string => 
  workout.split(' OR ')[0].replace('*', '');

const formatDate = (date: Date, options: Intl.DateTimeFormatOptions): string => 
  date.toLocaleDateString('en-US', options);

const getWorkoutInfo = (workout: string) => {
  const baseWorkout = getBaseWorkout(workout);
  return workoutTypes[baseWorkout] || {
    name: workout,
    colorClass: 'bg-gray-100 hover:bg-gray-200 text-gray-900',
    description: 'Custom workout'
  };
};

// Component
export const DayCard: React.FC<DayCardProps> = ({
  workout,
  date,
  isExpanded,
  onClick
}) => {
  // Memoized values
  const workoutInfo = useMemo(() => getWorkoutInfo(workout), [workout]);
  
  const formattedDate = useMemo(() => ({
    weekday: formatDate(date, DATE_FORMAT_OPTIONS.WEEKDAY),
    day: formatDate(date, DATE_FORMAT_OPTIONS.DAY),
    month: formatDate(date, DATE_FORMAT_OPTIONS.MONTH)
  }), [date]);

  // Computed classes
  const cardClasses = useMemo(() => {
    const baseClasses = [
      BASE_STYLES.card.default,
      workoutInfo.colorClass
    ];

    if (isExpanded) {
      baseClasses.push(BASE_STYLES.card.expanded);
    }

    return baseClasses.join(' ');
  }, [workoutInfo.colorClass, isExpanded]);

  return (
    <Card 
      className={cardClasses}
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
      <div className="p-3 space-y-1">
        {/* Date Section */}
        <div className={BASE_STYLES.date.container}>
          <span className={BASE_STYLES.date.weekday}>
            {formattedDate.weekday}
          </span>
          {' '}
          <span className={BASE_STYLES.date.datePart}>
            {formattedDate.month} {formattedDate.day}
          </span>
        </div>

        {/* Workout Title */}
        <div className={BASE_STYLES.workout.name}>
          {workoutInfo.name}
        </div>

        {/* Workout Description */}
        {workoutInfo.description && (
          <div className={BASE_STYLES.workout.description}>
            {workoutInfo.description}
          </div>
        )}

        {/* RPE Range */}
        {workoutInfo.rpeRange && (
          <div className={BASE_STYLES.workout.rpe}>
            {workoutInfo.rpeRange}
          </div>
        )}
      </div>
    </Card>
  );
};

// Memoize the component to prevent unnecessary rerenders
export default React.memo(DayCard, (prevProps, nextProps) => {
  return prevProps.workout === nextProps.workout &&
    prevProps.date.getTime() === nextProps.date.getTime() &&
    prevProps.isExpanded === nextProps.isExpanded;
});