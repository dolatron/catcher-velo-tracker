// velo-tracker.tsx
'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { workoutPrograms, generateSchedule } from '@/data/programs';
import { DayCard } from '@/components/day-card';
import { WorkoutDetailCard } from '@/components/workout-detail-card';
import type { DayWorkout, WorkoutProgram } from '@/data/types';

// Constants
const STORAGE_KEY = 'workout-tracker-state';
const PROGRAM_START_DATE = new Date(2024, 10, 17); // November 17, 2024 (month is 0-based)
const ERROR_MESSAGES = {
  SAVE_FAILED: 'Failed to save schedule:',
  LOAD_FAILED: 'Failed to load saved schedule:',
} as const;

// Types
interface SerializedDayWorkout {
  date: string;
  workout: string;
  completed: Record<string, boolean>;
}

interface WorkoutDetails {
  day: DayWorkout;
  details: WorkoutProgram;
  weekIndex: number;
  dayIndex: number;
}

interface ParsedWorkoutId {
  weekIndex: number;
  dayIndex: number;
}

type Schedule = DayWorkout[][];

// Utility functions
const createWorkoutId = (weekIndex: number, dayIndex: number, date: Date): string => 
  `week${weekIndex}-day${dayIndex}-${date.toISOString()}`;

const parseWorkoutId = (workoutId: string): ParsedWorkoutId | null => {
  try {
    const [weekPart, dayPart] = workoutId.split('-');
    const weekIndex = parseInt(weekPart.replace('week', ''));
    const dayIndex = parseInt(dayPart.replace('day', ''));
    
    if (isNaN(weekIndex) || isNaN(dayIndex)) {
      return null;
    }

    return { weekIndex, dayIndex };
  } catch {
    return null;
  }
};

// Custom hooks
const usePersistedSchedule = (): [Schedule, React.Dispatch<React.SetStateAction<Schedule>>] => {
  const [schedule, setSchedule] = useState<Schedule>(() => {
    if (typeof window === 'undefined') {
      return generateSchedule(PROGRAM_START_DATE);
    }

    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (!saved) {
        return generateSchedule(PROGRAM_START_DATE);
      }
      
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

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(schedule));
    } catch (error) {
      console.error(ERROR_MESSAGES.SAVE_FAILED, error);
    }
  }, [schedule]);

  return [schedule, setSchedule];
};

// Main component
export default function WorkoutTracker() {
  const [schedule, setSchedule] = usePersistedSchedule();
  const [expandedWorkoutId, setExpandedWorkoutId] = useState<string | null>(null);
  
  const handleCardClick = useCallback((weekIndex: number, dayIndex: number, date: Date) => {
    const workoutId = createWorkoutId(weekIndex, dayIndex, date);
    setExpandedWorkoutId(current => current === workoutId ? null : workoutId);
  }, []);

  const getWorkoutDetails = useCallback((workoutId: string): WorkoutDetails | null => {
    const parsed = parseWorkoutId(workoutId);
    if (!parsed) {
      return null;
    }

    const { weekIndex, dayIndex } = parsed;
    const day = schedule[weekIndex]?.[dayIndex];
    if (!day) {
      return null;
    }

    const baseWorkout = day.workout.split(' OR ')[0].replace('*', '');
    const details = workoutPrograms[baseWorkout];
    if (!details) {
      return null;
    }

    return {
      day,
      details,
      weekIndex,
      dayIndex
    };
  }, [schedule]);

  const handleExerciseComplete = useCallback((weekIndex: number, dayIndex: number, exerciseId: string) => {
    setSchedule(prevSchedule => 
      prevSchedule.map((week, wIndex) => 
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
    <div className="max-w-6xl mx-auto p-3 sm:p-6">
      <h1 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 text-center">
        8-Week Catcher Velocity Program
      </h1>
      
      <div className="space-y-8 sm:space-y-12">
        {schedule.map((week, weekIndex) => {
          const expandedDetails = expandedWorkoutId?.startsWith(`week${weekIndex}`) 
            ? getWorkoutDetails(expandedWorkoutId)
            : null;

          return (
            <section key={`week-${weekIndex}`} className="week-section">
              <h2 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4">
                Week {weekIndex + 1}
              </h2>

              <div className="space-y-3 sm:space-y-4">
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

      <footer className="mt-6 sm:mt-8 text-xs sm:text-sm text-gray-600">
        <p>Click any workout card to see details. Each exercise has a video demonstration available.</p>
      </footer>
    </div>
  );
}