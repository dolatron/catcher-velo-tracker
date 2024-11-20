/**
 * WorkoutTracker Component
 * 
 * Main component Workout Program tracker.
 * Manages the complete workout schedule, tracks exercise completion,
 * and persists progress in local storage.
 * 
 * Features:
 * - Displays full program calendar
 * - Tracks exercise completion state
 * - Persists progress in localStorage
 * - Responsive layout for all screen sizes
 */

'use client';

import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
// Remove generateSchedule import
import { DayCard } from '@/components/day-card';
import { WorkoutDetailCard } from '@/components/workout-detail-card';
import { DatePicker } from '@/components/date-picker';
import type { DayWorkout, WorkoutProgram, Program, Exercise } from '@/common/types';
import { normalizeDate, getBaseWorkout } from '@/common/utils';
import { LayoutGrid, LayoutList } from 'lucide-react';
import { ProgramConfig, useProgram } from '@/contexts/program-context';

// Constants
const PROGRAM_START_DATE = new Date(); // Define a default start date
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
const createWorkoutId = (weekIndex: number, dayIndex: number): string => 
  `week${weekIndex}-day${dayIndex}`; // Remove date from ID, week and day indices are sufficient

const getStorageKeys = (programId: string) => ({
  SCHEDULE: `workout-tracker-state-${programId}`,
  START_DATE: `program-start-date-${programId}`,
  VIEW_MODE: `workout-view-mode-${programId}`,
});

const generateSchedule = (startDate: Date, program: Program): DayWorkout[][] => {
  const normalizedStart = normalizeDate(startDate);
  const schedule = program.schedule;
  
  if (!schedule || !schedule.weeks) {
    throw new Error('Invalid program schedule data');
  }

  return schedule.weeks.map((week, weekIndex) => 
    week.days.map((workout, dayIndex) => {
      const date = new Date(normalizedStart);
      date.setDate(normalizedStart.getDate() + (weekIndex * 7) + dayIndex);
      
      return {
        date: normalizeDate(date),
        workout,
        completed: {} as Record<string, boolean>
      };
    })
  );
};

/**
 * Custom Hook: usePersistedSchedule
 * 
 * Manages the workout schedule state and its persistence in localStorage.
 * Handles loading saved progress and saving updates.
 */
const usePersistedSchedule = (program: Program, STORAGE_KEYS: ReturnType<typeof getStorageKeys>): [Schedule, React.Dispatch<React.SetStateAction<Schedule>>] => {
  const [schedule, setSchedule] = useState<Schedule>(() => {
    if (typeof window === 'undefined') {
      return generateSchedule(PROGRAM_START_DATE, program);
    }

    try {
      const saved = localStorage.getItem(STORAGE_KEYS.SCHEDULE);
      if (!saved) {
        return generateSchedule(PROGRAM_START_DATE, program);
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
      return generateSchedule(PROGRAM_START_DATE, program);
    }
  });

  // Save schedule to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.SCHEDULE, JSON.stringify(schedule));
    } catch (error) {
      console.error(ERROR_MESSAGES.SAVE_FAILED, error);
    }
  }, [schedule, STORAGE_KEYS.SCHEDULE]);

  return [schedule, setSchedule];
};

/**
 * Custom Hook: useStartDate
 * 
 * Manages the start date state and its persistence in localStorage.
 */
const useStartDate = (STORAGE_KEYS: ReturnType<typeof getStorageKeys>): [Date, (date: Date) => void] => {
  const [startDate, setStartDate] = useState<Date>(() => {
    if (typeof window === 'undefined') return normalizeDate(PROGRAM_START_DATE);
    
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.START_DATE);
      return saved ? normalizeDate(new Date(saved)) : normalizeDate(PROGRAM_START_DATE);
    } catch {
      return normalizeDate(PROGRAM_START_DATE);
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.START_DATE, startDate.toISOString());
    } catch (error) {
      console.error('Failed to save start date:', error);
    }
  }, [startDate, STORAGE_KEYS.START_DATE]);

  return [startDate, setStartDate];
};

/**
 * Get workout program details from the program data
 */
const getWorkoutProgram = (workout: string, programConfig: ProgramConfig): WorkoutProgram | undefined => {
  const baseWorkout = getBaseWorkout(workout);
  const workoutType = programConfig.programData.workoutTypes[baseWorkout];
  
  if (!workoutType) return undefined;

  // Helper to merge exercise defaults with workout-specific values
  const mergeExerciseWithDefaults = (exercise: Exercise): Exercise => {
    const baseExercise = programConfig.exerciseData.exercises[exercise.id];
    if (!baseExercise) return exercise;

    return {
      ...baseExercise,           // Base exercise contains all default values
      ...exercise,               // Workout-specific overrides
    };
  };

  // Map sections to their proper categories and include exercise defaults
  const workoutProgram: WorkoutProgram = {
    warmup: workoutType.sections.find(s => s.name.toLowerCase() === 'warmup')
      ?.exercises.map(mergeExerciseWithDefaults) || [],
    throwing: workoutType.sections.find(s => s.name.toLowerCase() === 'throwing')
      ?.exercises.map(mergeExerciseWithDefaults) || [],
    recovery: workoutType.sections.find(s => s.name.toLowerCase() === 'recovery')
      ?.exercises.map(mergeExerciseWithDefaults) || [],
    rpeRange: workoutType.rpeRange,
    notes: workoutType.notes
  };

  return workoutProgram;
};

/**
 * Main WorkoutTracker Component
 */
export default function WorkoutTracker() {
  const programConfig = useProgram();
  const STORAGE_KEYS = getStorageKeys(programConfig.programData.id);
  const [startDate, setStartDate] = useStartDate(STORAGE_KEYS);
  const [schedule, setSchedule] = usePersistedSchedule(programConfig.programData, STORAGE_KEYS);
  const [expandedWorkoutId, setExpandedWorkoutId] = useState<string | null>(null);
  const weekRefs = useRef<(HTMLElement | null)[]>([]);
  const cardRefs = useRef<Record<string, HTMLDivElement | null>>({});
  
  // Initialize viewMode from localStorage
  const [viewMode, setViewMode] = useState<'calendar' | 'list'>(() => {
    if (typeof window === 'undefined') return 'calendar';
    return (localStorage.getItem(STORAGE_KEYS.VIEW_MODE) as 'calendar' | 'list') || 'calendar';
  });

  // Save viewMode changes to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.VIEW_MODE, viewMode);
    } catch (error) {
      console.error('Failed to save view mode:', error);
    }
  }, [viewMode, STORAGE_KEYS.VIEW_MODE]);

  // Calculate program progress
  const progressStats = useMemo(() => {
    const allDays = schedule.flat();
    const totalDays = allDays.length;
    const completedDays = allDays.filter(day => {
      const program = getWorkoutProgram(day.workout, programConfig);
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
  }, [schedule, programConfig]);

  /**
   * Get details for an expanded workout
   */
  const getWorkoutDetails = useCallback((workoutId: string): WorkoutDetails | null => {
    const [weekPart, dayPart] = workoutId.split('-');
    const weekIndex = parseInt(weekPart.replace('week', ''));
    const dayIndex = parseInt(dayPart.replace('day', ''));
    
    const day = schedule[weekIndex]?.[dayIndex];
    if (!day) return null;

    const details = getWorkoutProgram(day.workout, programConfig);
    if (!details) return null;

    return { day, details, weekIndex, dayIndex };
  }, [schedule, programConfig]);

  /**
   * Handle clicking on a workout card
   */
  const handleCardClick = useCallback((weekIndex: number, dayIndex: number, date: Date, cardEl: HTMLDivElement) => {
    const workoutId = createWorkoutId(weekIndex, dayIndex);
    
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
    setSchedule(generateSchedule(newDate, programConfig.programData));
    setExpandedWorkoutId(null);
  }, [setStartDate, setSchedule, programConfig.programData]);

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

  /**
   * Handle notes update for a specific workout
   */
  const handleNotesUpdate = useCallback((weekIndex: number, dayIndex: number, notes: string) => {
    setSchedule(prev => 
      prev.map((week, wIndex) => 
        week.map((day, dIndex) => {
          if (wIndex === weekIndex && dIndex === dayIndex) {
            return {
              ...day,
              userNotes: notes
            };
          }
          return day;
        })
      )
    );
  }, [setSchedule]);

  return (
    <div className="max-w-6xl mx-auto p-2 sm:p-6">
      <h1 className="text-lg sm:text-2xl font-bold mb-3 sm:mb-6 text-center">
        {programConfig.programData.name}
      </h1>
      
      {/* Program Header */}
      <div className="mb-6 space-y-4">
        <DatePicker 
          selectedDate={startDate}
          onDateChange={handleDateChange}
          progress={progressStats}
          programLength={programConfig.programData.schedule.length}  // Add this prop
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
        {schedule.map((week, weekIndex) => (
          <section 
            key={`week-${weekIndex}`} 
            className="week-section"
            ref={el => { weekRefs.current[weekIndex] = el; }}
          >
            <h2 className="text-base sm:text-xl font-semibold mb-2 sm:mb-4">
              Week {weekIndex + 1}
            </h2>
            {/* Rest of the section code */}
            <div className="space-y-2 sm:space-y-4">
                {/* Grid/List of Day Cards */}
                <div className={`grid gap-1 sm:gap-4 auto-rows-min ${
                  viewMode === 'calendar' 
                    ? 'grid-cols-7 md:grid-cols-7' 
                    : 'grid-cols-1'
                }`}>
                  {week.map((day, dayIndex) => {
                    const workoutId = createWorkoutId(weekIndex, dayIndex);
                    const isExpanded = expandedWorkoutId === workoutId;
                    
                    // Get workout program to check total exercises
                    const program = getWorkoutProgram(day.workout, programConfig);
                    
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
                          workoutTypes={programConfig.programData.workoutTypes}
                          userNotes={day.userNotes}
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
                            workoutTypes={programConfig.programData.workoutTypes}
                            onNotesChange={(notes) => {
                              const dayIndex = parseInt(expandedWorkoutId.split('-')[1].replace('day', ''));
                              handleNotesUpdate(weekIndex, dayIndex, notes);
                            }}
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
                        workoutTypes={programConfig.programData.workoutTypes}
                        onNotesChange={(notes) => {
                          const dayIndex = parseInt(expandedWorkoutId.split('-')[1].replace('day', ''));
                          handleNotesUpdate(weekIndex, dayIndex, notes);
                        }}
                      />
                    </div>
                  )}
                </div>
              </div>
          </section>
        ))}
      </div>

      {/* Footer Information */}
      <footer className="mt-6 sm:mt-8 text-xs sm:text-sm text-gray-600">
        <p>Click any workout card to see details. Each exercise has a video demonstration available.</p>
      </footer>    </div>
  );
}