// velo-tracker.tsx
/**
 * WorkoutTracker Component
 * 
 * Main component for the 8-Week Catcher Velocity Program tracker.
 * Manages the complete workout schedule, tracks exercise completion,
 * and persists progress in local storage.
 * 
 * Features:
 * - Displays full 8-week program calendar
 * - Tracks exercise completion state
 * - Persists progress in localStorage
 * - Responsive layout for all screen sizes
 */

'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { workoutPrograms, generateSchedule } from '@/data/programs';
import { DayCard } from '@/components/day-card';
import { WorkoutDetailCard } from '@/components/workout-detail-card';
import type { DayWorkout, WorkoutProgram } from '@/data/types';

// Constants
const STORAGE_KEY = 'workout-tracker-state';
// Start date is set to November 17, 2024 (month is 0-based)
const PROGRAM_START_DATE = new Date(2024, 10, 17);
const ERROR_MESSAGES = {
  SAVE_FAILED: 'Failed to save schedule:',
  LOAD_FAILED: 'Failed to load saved schedule:',
} as const;

// Type Definitions
/**
 * Represents a day's workout data in a format suitable for storage
 */
interface SerializedDayWorkout {
  date: string;              // ISO string date
  workout: string;           // Workout type name
  completed: Record<string, boolean>;  // Exercise completion status
}

/**
 * Extended workout details including metadata
 */
interface WorkoutDetails {
  day: DayWorkout;
  details: WorkoutProgram;
  weekIndex: number;
  dayIndex: number;
}

type Schedule = DayWorkout[][];

/**
 * Creates a unique identifier for a workout
 */
const createWorkoutId = (weekIndex: number, dayIndex: number, date: Date): string => 
  `week${weekIndex}-day${dayIndex}-${date.toISOString()}`;

/**
 * Custom Hook: usePersistedSchedule
 * 
 * Manages the workout schedule state and its persistence in localStorage.
 * Handles loading saved progress and saving updates.
 */
const usePersistedSchedule = (): [Schedule, React.Dispatch<React.SetStateAction<Schedule>>] => {
  const [schedule, setSchedule] = useState<Schedule>(() => {
    // Don't try to access localStorage during SSR
    if (typeof window === 'undefined') {
      return generateSchedule(PROGRAM_START_DATE);
    }

    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (!saved) {
        return generateSchedule(PROGRAM_START_DATE);
      }
      
      // Parse saved schedule and convert date strings back to Date objects
      const parsed = JSON.parse(saved) as SerializedDayWorkout[][];
      return parsed.map(week =>
        week.map(day => ({
          ...day,
          date: new Date(day.date)
        }))
      );
    } catch (error) {
      console.error(ERROR_MESSAGES.LOAD_FAILED, error);
      return generateSchedule(PROGRAM_START_DATE);
    }
  });

  // Save schedule to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(schedule));
    } catch (error) {
      console.error(ERROR_MESSAGES.SAVE_FAILED, error);
    }
  }, [schedule]);

  return [schedule, setSchedule];
};

/**
 * Main WorkoutTracker Component
 */
export default function WorkoutTracker() {
  // State management
  const [schedule, setSchedule] = usePersistedSchedule();
  const [expandedWorkoutId, setExpandedWorkoutId] = useState<string | null>(null);
  const weekRefs = useRef<(HTMLElement | null)[]>([]);

  /**
   * Get details for an expanded workout
   */
  const getWorkoutDetails = useCallback((workoutId: string): WorkoutDetails | null => {
    const parts = workoutId.split('-');
    const weekIndex = parseInt(parts[0].replace('week', ''));
    const dayIndex = parseInt(parts[1].replace('day', ''));
    
    const day = schedule[weekIndex]?.[dayIndex];
    if (!day) return null;

    const baseWorkout = day.workout.split(' OR ')[0].trim();
    const details = workoutPrograms[baseWorkout];
    if (!details) return null;

    return { day, details, weekIndex, dayIndex };
  }, [schedule]);

  /**
   * Handle clicking on a workout card
   */
  const handleCardClick = useCallback((weekIndex: number, dayIndex: number, date: Date) => {
    const workoutId = createWorkoutId(weekIndex, dayIndex, date);
    
    setExpandedWorkoutId(current => {
      const newId = current === workoutId ? null : workoutId;
      
      if (newId) {
        // Adding small delay to ensure DOM has updated
        setTimeout(() => {
          const weekEl = weekRefs.current[weekIndex];
          if (weekEl) {
            const yOffset = -20; // 20px padding from top
            const y = weekEl.getBoundingClientRect().top + window.pageYOffset + yOffset;
            window.scrollTo({ top: y, behavior: 'smooth' });
          }
        }, 100);
      }
      
      return newId;
    });
  }, []);

  /**
   * Handle exercise completion toggle
   */
  const handleExerciseComplete = useCallback((weekIndex: number, dayIndex: number, exerciseId: string) => {
    setSchedule(prev => 
      prev.map((week, wIndex) => 
        week.map((day, dIndex) => {
          if (wIndex === weekIndex && dIndex === dayIndex) {
            return {
              ...day,
              completed: {
                ...day.completed,
                [exerciseId]: !day.completed[exerciseId]
              }
            };
          }
          return day;
        })
      )
    );
  }, [setSchedule]);

  return (
    <div className="max-w-6xl mx-auto p-2 sm:p-6">
      {/* Program Title */}
      <h1 className="text-lg sm:text-2xl font-bold mb-3 sm:mb-6 text-center">
        8-Week Catcher Velocity Program
      </h1>
      
      {/* Weekly Schedule Display */}
      <div className="space-y-6 sm:space-y-12">
        {schedule.map((week, weekIndex) => {
          // Get details for expanded workout in this week, if any
          const expandedDetails = expandedWorkoutId?.startsWith(`week${weekIndex}`) 
            ? getWorkoutDetails(expandedWorkoutId)
            : null;

          return (
            <section 
              key={`week-${weekIndex}`} 
              className="week-section"
              ref={el => { weekRefs.current[weekIndex] = el; }}
            >
              {/* Week Header */}
              <h2 className="text-base sm:text-xl font-semibold mb-2 sm:mb-4">
                Week {weekIndex + 1}
              </h2>

              <div className="space-y-2 sm:space-y-4">
                {/* Grid of Day Cards */}
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-7 gap-2 sm:gap-4">
                  {week.map((day, dayIndex) => {
                    const workoutId = createWorkoutId(weekIndex, dayIndex, day.date);
                    return (
                      <DayCard
                        key={workoutId}
                        workout={day.workout}
                        date={day.date}
                        isExpanded={expandedWorkoutId === workoutId}
                        onClick={() => handleCardClick(weekIndex, dayIndex, day.date)}
                      />
                    );
                  })}
                </div>

                {/* Expanded Workout Details */}
                {expandedDetails && (
                  <WorkoutDetailCard
                    day={expandedDetails.day}
                    details={expandedDetails.details}
                    onComplete={(exerciseId) => {
                      handleExerciseComplete(expandedDetails.weekIndex, expandedDetails.dayIndex, exerciseId);
                    }}
                    onClose={() => setExpandedWorkoutId(null)}
                    weekIndex={expandedDetails.weekIndex}
                    dayIndex={expandedDetails.dayIndex}
                  />
                )}
              </div>
            </section>
          );
        })}
      </div>

      {/* Footer Information */}
      <footer className="mt-6 sm:mt-8 text-xs sm:text-sm text-gray-600">
        <p>Click any workout card to see details. Each exercise has a video demonstration available.</p>
      </footer>
    </div>
  );
}