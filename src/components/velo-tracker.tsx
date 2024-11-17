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

import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { workoutPrograms, generateSchedule } from '@/data/programs';
import { DayCard } from '@/components/day-card';
import { WorkoutDetailCard } from '@/components/workout-detail-card';
import { DatePicker } from '@/components/date-picker';
import type { DayWorkout, WorkoutProgram } from '@/data/types';
import { normalizeDate } from '@/utils/common';
import { LayoutGrid, LayoutList } from 'lucide-react';

// Constants
const STORAGE_KEY = 'workout-tracker-state';
const START_DATE_KEY = 'program-start-date';
// Change this line to use today's date as default
const PROGRAM_START_DATE = new Date();
const ERROR_MESSAGES = {
  SAVE_FAILED: 'Failed to save schedule:',
  LOAD_FAILED: 'Failed to load saved schedule:',
} as const;

// Add new constant at the top with other constants
const VIEW_MODE_KEY = 'workout-view-mode';

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
  `week${weekIndex}-day${dayIndex}`; // Remove date from ID, week and day indices are sufficient

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
          date: new Date(day.date),
          completed: day.completed || {}
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
 * Custom Hook: useStartDate
 * 
 * Manages the start date state and its persistence in localStorage.
 */
const useStartDate = (): [Date, (date: Date) => void] => {
  const [startDate, setStartDate] = useState<Date>(() => {
    if (typeof window === 'undefined') return normalizeDate(PROGRAM_START_DATE);
    
    try {
      const saved = localStorage.getItem(START_DATE_KEY);
      return saved ? normalizeDate(new Date(saved)) : normalizeDate(PROGRAM_START_DATE);
    } catch {
      return normalizeDate(PROGRAM_START_DATE);
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(START_DATE_KEY, startDate.toISOString());
    } catch (error) {
      console.error('Failed to save start date:', error);
    }
  }, [startDate]);

  return [startDate, setStartDate];
};

/**
 * Main WorkoutTracker Component
 */
export default function WorkoutTracker() {
  const [startDate, setStartDate] = useStartDate();
  const [schedule, setSchedule] = usePersistedSchedule();
  const [expandedWorkoutId, setExpandedWorkoutId] = useState<string | null>(null);
  const weekRefs = useRef<(HTMLElement | null)[]>([]);
  const cardRefs = useRef<Record<string, HTMLDivElement | null>>({});
  
  // Initialize viewMode from localStorage
  const [viewMode, setViewMode] = useState<'calendar' | 'list'>(() => {
    if (typeof window === 'undefined') return 'calendar';
    return (localStorage.getItem(VIEW_MODE_KEY) as 'calendar' | 'list') || 'calendar';
  });

  // Save viewMode changes to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(VIEW_MODE_KEY, viewMode);
    } catch (error) {
      console.error('Failed to save view mode:', error);
    }
  }, [viewMode]);

  // Calculate program progress
  const progressStats = useMemo(() => {
    const allDays = schedule.flat();
    const totalDays = allDays.length;
    const completedDays = allDays.filter(day => {
      const baseWorkout = day.workout.split(' OR ')[0].trim();
      const program = workoutPrograms[baseWorkout];
      if (!program) return false;

      const totalExercises = [
        ...(program.warmup || []),
        ...(program.throwing || []),
        ...(program.recovery || [])
      ].length;
      
      const completedCount = Object.values(day.completed).filter(Boolean).length;
      return totalExercises > 0 && completedCount >= totalExercises;
    }).length;

    return {
      percentage: Math.round((completedDays / totalDays) * 100),
      completed: completedDays,
      total: totalDays
    };
  }, [schedule]);

  /**
   * Get details for an expanded workout
   */
  const getWorkoutDetails = useCallback((workoutId: string): WorkoutDetails | null => {
    const [weekPart, dayPart] = workoutId.split('-');
    const weekIndex = parseInt(weekPart.replace('week', ''));
    const dayIndex = parseInt(dayPart.replace('day', ''));
    
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
  const handleCardClick = useCallback((weekIndex: number, dayIndex: number, date: Date, cardEl: HTMLDivElement) => {
    const workoutId = createWorkoutId(weekIndex, dayIndex, date);
    
    // If clicking the same workout, close it
    if (expandedWorkoutId === workoutId) {
      setExpandedWorkoutId(null);
      return;
    }
    
    // Always close previous workout before opening new one
    setExpandedWorkoutId(workoutId);
    
    // Scroll after state update
    setTimeout(() => {
      if (viewMode === 'list' || window.innerWidth < 640) {
        cardEl?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      } else {
        const weekEl = weekRefs.current[weekIndex];
        if (weekEl) {
          const yOffset = -20;
          const y = weekEl.getBoundingClientRect().top + window.pageYOffset + yOffset;
          window.scrollTo({ top: y, behavior: 'smooth' });
        }
      }
    }, 100);
  }, [expandedWorkoutId, viewMode]);

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

  /**
   * Handle batch exercise completion
   */
  const handleBatchComplete = useCallback((weekIndex: number, dayIndex: number, exerciseIds: string[], completed: boolean) => {
    setSchedule(prev => 
      prev.map((week, wIndex) => 
        week.map((day, dIndex) => {
          if (wIndex === weekIndex && dIndex === dayIndex) {
            const newCompleted = { ...day.completed };
            exerciseIds.forEach(id => {
              newCompleted[id] = completed;
            });
            return {
              ...day,
              completed: newCompleted
            };
          }
          return day;
        })
      )
    );
  }, [setSchedule]);

  /**
   * Handle start date change
   */
  const handleDateChange = useCallback((newDate: Date) => {
    setStartDate(newDate);
    setSchedule(generateSchedule(newDate));
    setExpandedWorkoutId(null);
  }, [setStartDate, setSchedule]);  // Add setSchedule to dependencies

  /**
   * Handle scrolling when closing a workout
   */
  const handleWorkoutClose = useCallback((weekIndex: number, dayIndex: number) => {
    setExpandedWorkoutId(null); // Always close when requested
    
    const cardEl = cardRefs.current[`${weekIndex}-${dayIndex}`];
    setTimeout(() => {
      if (viewMode === 'list' || window.innerWidth < 640) {
        cardEl?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      } else {
        const weekEl = weekRefs.current[weekIndex];
        if (weekEl) {
          const yOffset = -20;
          const y = weekEl.getBoundingClientRect().top + window.pageYOffset + yOffset;
          window.scrollTo({ top: y, behavior: 'smooth' });
        }
      }
    }, 100);
  }, [viewMode]); // Add viewMode to dependencies

  /**
   * Handle scrolling without closing the workout
   */
  const handleWorkoutScroll = useCallback((weekIndex: number, dayIndex: number) => {
    const cardEl = cardRefs.current[`${weekIndex}-${dayIndex}`];
    
    setTimeout(() => {
      if (window.innerWidth < 640) { // Mobile viewport
        cardEl?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      } else { // Desktop viewport
        const weekEl = weekRefs.current[weekIndex];
        if (weekEl) {
          const yOffset = -20;
          const y = weekEl.getBoundingClientRect().top + window.pageYOffset + yOffset;
          window.scrollTo({ top: y, behavior: 'smooth' });
        }
      }
    }, 100);
  }, []);

  return (
    <div className="max-w-6xl mx-auto p-2 sm:p-6">
      <h1 className="text-lg sm:text-2xl font-bold mb-3 sm:mb-6 text-center">
        8-Week Catcher Velocity Program
      </h1>
      
      {/* Program Header */}
      <div className="mb-6 space-y-4">
        <DatePicker 
          selectedDate={startDate}
          onDateChange={handleDateChange}
          progress={progressStats}
        />
        <div className="flex justify-end">
          <button
            onClick={() => setViewMode(v => v === 'calendar' ? 'list' : 'calendar')}
            className="text-sm font-medium text-gray-600 hover:text-gray-800 flex items-center gap-2 px-3 py-1.5 rounded-md hover:bg-gray-100"
          >
            {viewMode === 'calendar' ? (
              <>
                <LayoutList className="w-4 h-4" />
                Switch to List View
              </>
            ) : (
              <>
                <LayoutGrid className="w-4 h-4" />
                Switch to Calendar View
              </>
            )}
          </button>
        </div>
      </div>

      {/* Weekly Schedule Display */}
      <div className="space-y-6 sm:space-y-12">
        {schedule.map((week, weekIndex) => {
          const expandedInThisWeek = expandedWorkoutId?.startsWith(`week${weekIndex}`);
          
          return (
            <section 
              key={`week-${weekIndex}`} 
              className="week-section"
              ref={el => { weekRefs.current[weekIndex] = el; }}
            >
              <h2 className="text-base sm:text-xl font-semibold mb-2 sm:mb-4">
                Week {weekIndex + 1}
              </h2>
              <div className="space-y-2 sm:space-y-4">
                {/* Grid/List of Day Cards */}
                <div className={`grid gap-1 sm:gap-4 auto-rows-min ${
                  viewMode === 'calendar' 
                    ? 'grid-cols-7 md:grid-cols-7' 
                    : 'grid-cols-1'
                }`}>
                  {week.map((day, dayIndex) => {
                    const workoutId = createWorkoutId(weekIndex, dayIndex, day.date);
                    const isExpanded = expandedWorkoutId === workoutId;
                    
                    // Get workout program to check total exercises
                    const baseWorkout = day.workout.split(' OR ')[0].trim();
                    const program = workoutPrograms[baseWorkout];
                    
                    // Calculate if all exercises are completed
                    const isCompleted = program ? (() => {
                      const totalExercises = [
                        ...(program.warmup || []),
                        ...(program.throwing || []),
                        ...(program.recovery || [])
                      ].length;
                      const completedCount = Object.values(day.completed).filter(Boolean).length;
                      return totalExercises > 0 && completedCount >= totalExercises;
                    })() : false;

                    const inProgress = program ? (() => {
                      const completedCount = Object.values(day.completed).filter(Boolean).length;
                      return completedCount > 0 && !isCompleted;
                    })() : false;

                    const totalExercises = program ? [
                      ...(program.warmup || []),
                      ...(program.throwing || []),
                      ...(program.recovery || [])
                    ].length : 0;

                    const completedCount = Object.values(day.completed).filter(Boolean).length;
                    const completionPercentage = totalExercises > 0 
                      ? (completedCount / totalExercises) * 100 
                      : undefined;

                    return (
                      <div key={workoutId} className={viewMode === 'list' ? 'space-y-2' : ''}>
                        <DayCard
                          ref={(el) => { cardRefs.current[`${weekIndex}-${dayIndex}`] = el; }}
                          workout={day.workout}
                          date={day.date}
                          isExpanded={isExpanded}
                          completed={isCompleted}
                          inProgress={inProgress}
                          completionPercentage={completionPercentage}
                          onClick={() => {
                            const cardEl = cardRefs.current[`${weekIndex}-${dayIndex}`];
                            if (cardEl) {
                              handleCardClick(weekIndex, dayIndex, day.date, cardEl);
                            }
                          }}
                          viewMode={viewMode}
                        />
                        {/* Render detail card immediately after day card in list view */}
                        {isExpanded && viewMode === 'list' && (
                          <WorkoutDetailCard
                            day={day}
                            details={getWorkoutDetails(workoutId)?.details ?? {} as WorkoutProgram}
                            onComplete={(exerciseId) => {
                              handleExerciseComplete(weekIndex, dayIndex, exerciseId);
                            }}
                            onClose={() => handleWorkoutClose(weekIndex, dayIndex)}
                            weekIndex={weekIndex}
                            dayIndex={dayIndex}
                            onBatchComplete={(exerciseIds, completed) => 
                              handleBatchComplete(weekIndex, dayIndex, exerciseIds, completed)
                            }
                            onScroll={() => handleWorkoutScroll(weekIndex, dayIndex)}
                            viewMode={viewMode}
                          />
                        )}
                      </div>
                    );
                  })}
                  
                  {/* Only render detail card here for calendar view */}
                  {viewMode === 'calendar' && expandedWorkoutId?.startsWith(`week${weekIndex}`) && (
                    <div className="col-span-7 mt-2">
                      <WorkoutDetailCard
                        day={week[parseInt(expandedWorkoutId.split('-')[1].replace('day', ''))]}
                        details={getWorkoutDetails(expandedWorkoutId)?.details ?? {} as WorkoutProgram}
                        onComplete={(exerciseId) => {
                          const dayIndex = parseInt(expandedWorkoutId.split('-')[1].replace('day', ''));
                          handleExerciseComplete(weekIndex, dayIndex, exerciseId);
                        }}
                        onClose={() => {
                          const dayIndex = parseInt(expandedWorkoutId.split('-')[1].replace('day', ''));
                          handleWorkoutClose(weekIndex, dayIndex);
                        }}
                        weekIndex={weekIndex}
                        dayIndex={parseInt(expandedWorkoutId.split('-')[1].replace('day', ''))}
                        onBatchComplete={(exerciseIds, completed) => {
                          const dayIndex = parseInt(expandedWorkoutId.split('-')[1].replace('day', ''));
                          handleBatchComplete(weekIndex, dayIndex, exerciseIds, completed);
                        }}
                        onScroll={() => {
                          const dayIndex = parseInt(expandedWorkoutId.split('-')[1].replace('day', ''));
                          handleWorkoutScroll(weekIndex, dayIndex);
                        }}
                        viewMode={viewMode}
                      />
                    </div>
                  )}
                </div>
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