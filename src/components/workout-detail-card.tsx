// workout-detail-card.tsx
import React from 'react';
import { Card } from '@/components/ui/card';
import { X } from 'lucide-react';
import { ExerciseRow } from '@/components/excercise-row';
import type { Exercise, WorkoutProgram } from '@/data/types';
import { workoutTypes } from '@/data/workouts';

// Constants
const DATE_FORMAT_OPTIONS: Intl.DateTimeFormatOptions = {
  weekday: 'long',
  month: 'long',
  day: 'numeric'
} as const;

// Types
interface WorkoutSectionProps {
  title: string;
  exercises?: Exercise[];
  completed: Record<string, boolean>;
  onComplete: (id: string) => void;
  workoutType: string;
  weekIndex: number;
  dayIndex: number;
}

interface WorkoutDetailCardProps {
  day: {
    workout: string;
    date: Date;
    completed: Record<string, boolean>;
  };
  details: WorkoutProgram;
  onComplete: (id: string) => void;
  onClose: () => void;
  weekIndex: number;
  dayIndex: number;
}

// Helper functions
const getSectionId = (weekIndex: number, dayIndex: number, title: string): string => 
  `week${weekIndex}-day${dayIndex}-${title.toLowerCase()}`;

const getBaseWorkout = (workout: string): string => 
  workout.split(' OR ')[0].replace('*', '');

// Components
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
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-base sm:text-lg font-semibold text-indigo-900">
          {title}
        </h3>
        <span className="text-sm text-gray-500">
          {completedCount} / {exercises.length}
        </span>
      </div>

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

export const WorkoutDetailCard: React.FC<WorkoutDetailCardProps> = ({ 
  day, 
  details, 
  onComplete, 
  onClose,
  weekIndex,
  dayIndex
}) => {
  const baseWorkout = getBaseWorkout(day.workout);
  const workoutInfo = workoutTypes[baseWorkout];

  const workoutSections = baseWorkout === 'Off' 
    ? [{ title: "Rest Day", exercises: details.recovery }]
    : [
        { title: "Warm-up", exercises: details.warmup },
        { title: "Throwing", exercises: details.throwing },
        { title: "Recovery", exercises: details.recovery }
      ];

  return (
    <Card className="w-full bg-white p-4 sm:p-8 shadow-lg mb-4 sm:mb-8">
      <header className="flex justify-between items-start pb-4 sm:pb-6 border-b border-gray-200">
        <div>
          <h2 className="text-lg sm:text-xl font-semibold text-indigo-900">
            {day.workout}
          </h2>
          <p className="text-sm sm:text-base text-gray-500 mt-1">
            {day.date.toLocaleDateString('en-US', DATE_FORMAT_OPTIONS)}
          </p>
          {workoutInfo?.rpeRange && (
            <p className="text-sm text-indigo-600 mt-1">
              Target Intensity: {workoutInfo.rpeRange}
            </p>
          )}
          {workoutInfo?.notes && (
            <p className="text-sm text-gray-600 mt-2">
              {workoutInfo.notes}
            </p>
          )}
        </div>
        <button 
          onClick={onClose}
          className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          aria-label="Close details"
        >
          <X className="w-5 h-5" />
        </button>
      </header>

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
    </Card>
  );
};