// workouts.ts
import type { WorkoutType } from '@/data/types';

export const workoutTypes: Record<string, WorkoutType> = {
'Hybrid B': {
    name: 'Hybrid B',
    colorClass: 'bg-indigo-900 text-white hover:bg-indigo-950',
    description: 'Light intent day, focus on mechanics and arm path',
    rpeRange: '60-70% RPE',
    notes: 'All PlyoCare reps done @ 60-70% RPE. Use this day to work on things like your arm path, at a lower intent level.'
  },
  'Hybrid C': {
    name: 'Hybrid C',
    colorClass: 'bg-violet-900 text-white hover:bg-violet-950',
    description: 'Light intent day with weighted ball work',
    rpeRange: '60-70% RPE',
    notes: 'Includes weighted ball throws at beginning of catch play. Extension Phase - Max distance without going over 70% RPE.'
  },
  'Hybrid A': {
    name: 'Hybrid A',
    colorClass: 'bg-green-600 text-white hover:bg-green-700',
    description: 'Higher intent throwing with extension and compression',
    rpeRange: '80-90% RPE',
    notes: 'All PlyoCare reps done 80-90%. Higher intent day with catch play involving both Extension and Compression throws.'
  },
  'Plyo Velo': {
    name: 'Plyo Velo',
    colorClass: 'bg-pink-600 text-white hover:bg-pink-700',
    description: 'Velocity development with radar tracking',
    notes: 'Use first two PlyoCare drills to warm up. Radar Blue Roll-ins, Stepbacks, Drop-Steps, and Half Stance.'
  },
  'Recovery': {
    name: 'Recovery',
    colorClass: 'bg-sky-100 text-gray-900 hover:bg-sky-200',
    description: 'Light recovery throwing and mobility work',
    rpeRange: '≤60% RPE',
    notes: 'All PlyoCare and light catch throws done at NO MORE THAN 60% RPE'
  },
  'Velocity': {
    name: 'Velocity',
    colorClass: 'bg-pink-800 text-white hover:bg-pink-900',
    description: 'High intent throwing with base throwdowns',
    notes: 'High intent throwing day with progressive throwdowns based on week: Weeks 3/4 use short spread (5oz, 6oz, 4oz), Weeks 5/6 advance to long spread (5oz, 6oz, 7oz, 5oz, 4oz, 3oz). Use radar gun to track velocities. Take at least 1 minute rest between weights.'
  },
  'Off': {
    name: 'Rest',
    colorClass: 'bg-slate-50 text-gray-900 hover:bg-slate-100 border border-slate-200',
    description: 'Recovery and preparation focus',
    rpeRange: 'Recovery',
    notes: 'Take recovery days as exactly that, recovery. Focus on quality sleep (7-9 hours), hydration, and proper nutrition.'
  }
};