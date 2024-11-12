// programs.ts
import { throwingExercises as t } from '@/data/excercises';
import { warmupExercises as w } from '@/data/excercises';
import { recoveryExercises as r } from '@/data/excercises';
import type { WorkoutProgram } from '@/data/types';

export const workoutPrograms: Record<string, WorkoutProgram> = {
  'Hybrid B': {
    warmup: [
      { ...w.foamRoll, notes: '10s per pass, full body' },
      { ...w.lacrosseBall, notes: 'Target specific areas of tension' },
      { ...w.jaegerBands, notes: 'Complete full series' },
      { ...w.wristWeights, notes: 'Complete full series' }
    ],
    throwing: [
      { ...t.plyoCareReverse, rpe: '60-70%', notes: 'Focus on arm path mechanics' },
      { ...t.plyoCarePivot, rpe: '60-70%', notes: 'Focus on arm path mechanics' },
      { ...t.plyoCareRollIn, rpe: '60-70%', reps: '10 reps with 1kg AND 450g balls', notes: 'Focus on arm path mechanics' },
      { ...t.plyoCareStepBacks, rpe: '60-70%', sets: 2, notes: 'Lower intent focus on mechanics' },
      { ...t.plyoCareDropSteps, rpe: '60-70%', sets: 2, notes: 'Lower intent focus on mechanics' },
      { ...t.plyoCareHalfStance, rpe: '60-70%', sets: 1, notes: 'Lower intent focus on mechanics' },
      { 
        ...t.longToss, 
        rpe: '70%', 
        notes: 'Extension Phase only - Max distance without going over 70% RPE.' 
      }
    ],
    recovery: [
      { ...r.hipFlexor },
      { ...r.bandHalos },
      { ...r.isometricExtensionFlexion },
      { ...r.isometricAbductionAdduction },
      { ...r.isometricRotation }
    ],
    rpeRange: '60-70%',
    notes: 'All PlyoCare reps done @ 60-70% RPE. Use this day to work on things like your arm path, at a lower intent level.'
  },

  'Hybrid C': {
    warmup: [
      { ...w.foamRoll, notes: '10s per pass, full body' },
      { ...w.lacrosseBall, notes: 'Target specific areas of tension' },
      { ...w.jaegerBands, notes: 'Complete full series' },
      { ...w.wristWeights, notes: 'Complete full series' }
    ],
    throwing: [
      { ...t.plyoCareReverse, rpe: '60-70%', notes: 'Focus on arm path mechanics' },
      { ...t.plyoCarePivot, rpe: '60-70%', notes: 'Focus on arm path mechanics' },
      { ...t.plyoCareRollIn, rpe: '60-70%', reps: '10 reps with 1kg AND 450g balls', notes: 'Focus on arm path mechanics' },
      { ...t.plyoCareStepBacks, rpe: '60-70%', sets: 2, notes: 'Lower intent focus on mechanics' },
      { ...t.plyoCareDropSteps, rpe: '60-70%', sets: 2, notes: 'Lower intent focus on mechanics' },
      { ...t.plyoCareHalfStance, rpe: '60-70%', sets: 1, notes: 'Lower intent focus on mechanics' },
      { 
        ...t.weightedBallCatch, 
        notes: '5 throws each: 11oz, 9oz, 7oz, 5oz (~70% RPE), finish with 5 throws 4oz',
        rpe: '70%'
      },
    ],
    recovery: [
      { ...r.hipFlexor },
      { ...r.bandHalos },
      { ...r.isometricExtensionFlexion },
      { ...r.isometricAbductionAdduction },
      { ...r.isometricRotation }
    ],
    rpeRange: '60-70%',
    notes: 'All PlyoCare reps done @ 60-70% RPE. Use this day to work on things like your arm path, at a lower intent level.'
  },

  'Hybrid A': {
    warmup: [
      { ...w.foamRoll, notes: 'Thorough warm-up for higher intent day' },
      { ...w.lacrosseBall, notes: 'Focus on arm care preparation' },
      { ...w.jaegerBands, notes: 'Complete full series with good activation' },
      { ...w.wristWeights, notes: 'Prepare for higher intent throws' }
    ],
    throwing: [
      { ...t.plyoCareReverse, rpe: '80-90%', notes: 'Higher intent maintaining mechanics' },
      { ...t.plyoCarePivot, rpe: '80-90%', notes: 'Higher intent maintaining mechanics' },
      { ...t.plyoCareRollIn, rpe: '80-90%', reps: '5 reps with 1kg AND 450g balls', notes: 'Build intent while maintaining mechanics' },
      { ...t.plyoCareStepBacks, rpe: '80-90%', sets: 2, notes: 'Focus on explosive movements' },
      { ...t.plyoCareDropSteps, rpe: '80-90%', sets: 2, notes: 'Quick footwork with power' },
      { ...t.plyoCareHalfStance, rpe: '80-90%', sets: 2, notes: 'Maintain mechanics at higher intent' },
      { 
        ...t.longToss, 
        reps: '5 throws each to start - 11oz, 9oz, 7oz 5oz throws to tolerance (Extension Phase) + 8-12 Compression throws',
        notes: 'Complete both extension and compression phases'
      }
    ],
    recovery: [
      { ...r.hipFlexor },
      { ...r.bandHalos },
      { ...r.isometricExtensionFlexion },
      { ...r.isometricAbductionAdduction },
      { ...r.isometricRotation }
    ],
    rpeRange: '80-90%',
    notes: 'Higher intent day with both extension and compression throws. Focus on maintaining mechanics at increased intent.'
  },

  'Recovery': {
    warmup: [
      { ...w.foamRoll, notes: '10s per pass, focus on recovery' },
      { ...w.lacrosseBall, notes: 'Roughly 20s per body part or to tolerance' },
      { ...w.jaegerBands, notes: 'Complete full series at low intensity' },
      { ...w.wristWeights, notes: 'Light activation work' }
    ],
    throwing: [
      { ...t.plyoCareReverse, sets: 2, reps: '10 reps with 1kg AND 2kg balls', rpe: '60%', notes: 'Focus on recovery and proper mechanics' },
      { ...t.plyoCarePivot, sets: 1, reps: '10 reps with 1kg AND 2kg balls', rpe: '60%', notes: 'Focus on recovery and proper mechanics' },
      { 
        id: 'light-catch',
        name: 'Light Catch',
        sets: 1,
        reps: 'Throws to tolerance',
        rpe: '60%',
        notes: 'STRICT 60% RPE MAX - Focus on recovery and arm maintenance',
        videoUrl: 'https://vimeo.com/648901293/071a72a270'
      }
    ],
    recovery: [
      { ...r.plyoCareRebounders, sets: 3, reps: '10 reps with 1 kg AND 2 kg balls' },
      { ...r.bandPullaparts, sets: 3 },
      { ...r.waiterWalks, sets: 3, reps: 'approx 20 yards' },
      { ...r.upwardTosses, sets: 2, reps: '15 reps with 2 kg ball' }
    ],
    rpeRange: '≤60%',
    notes: 'All PlyoCare and light catch throws done at NO MORE THAN 60% RPE. Focus on quality of movement and recovery.'
  },

  'Plyo Velo': {
    warmup: [
      { ...w.foamRoll, notes: '10s per pass, prepare for velocity work' },
      { ...w.lacrosseBall, notes: 'Target throwing arm and shoulder areas' },
      { ...w.jaegerBands, notes: 'Complete full series with focus on activation' },
      { ...w.wristWeights, notes: 'Complete full series, prepare for high intent throws' }
    ],
    throwing: [
      { 
        ...t.plyoCareReverse, 
        notes: 'Use first two PlyoCare drills as warm-up'
      },
      { ...t.plyoCarePivot },
      { 
        ...t.plyoCareRollIn, 
        reps: '3 reps with 1kg ball, 5 reps with 450g ball',
        notes: 'Begin radar tracking with Blue Roll-ins'
      },
      { 
        ...t.plyoCareStepBacks, 
        sets: 2, 
        notes: 'Track velocity with radar, focus on max intent throws' 
      },
      { 
        ...t.plyoCareDropSteps, 
        sets: 2, 
        notes: 'Track velocity with radar, focus on max intent throws' 
      },
      { 
        ...t.plyoCareHalfStance, 
        sets: 2, 
        notes: 'Track velocity with radar, focus on max intent throws' 
      }
    ],
    recovery: [
      { ...r.hipFlexor },
      { ...r.bandHalos },
      { ...r.isometricExtensionFlexion },
      { ...r.isometricAbductionAdduction },
      { ...r.isometricRotation }
    ],
    notes: 'Use first two PlyoCare drills to warm up. Track velocity with radar for Blue Roll-ins, Stepbacks, Drop-Steps, and Half Stance.'
  },

'Velocity': {
    warmup: [
      { ...w.foamRoll, notes: '10s per pass, thorough warm-up for high intent throws' },
      { ...w.lacrosseBall, notes: 'Focus on throwing arm preparation' },
      { ...w.jaegerBands, notes: 'Complete full series with good activation' },
      { ...w.wristWeights, notes: 'Prepare for max intent throws' }
    ],
    throwing: [
      { ...t.plyoCareReverse, notes: 'Warm-up and prepare for high intent throws' },
      { ...t.plyoCarePivot, notes: 'Continue building throwing preparation' },
      { ...t.plyoCareRollIn, notes: 'Final preparation before max intent work' },
      { ...t.plyoCareStepBacks, sets: 1, notes: 'Begin building intent' },
      { ...t.plyoCareHalfStance, sets: 1, notes: 'Continue progression to full intent' },
      { ...t.longToss, notes: 'Extension Phase in Preparation for Throwdowns' },
      { 
        ...t.throwdownsShort, 
        notes: 'Weeks 3/4: 3-4 throws each (5oz, 6oz, 4oz). First throw at 80%, then build. Rest 1+ min between weights. Track with radar.' 
      },
      { 
        ...t.throwdownsLong, 
        notes: 'Weeks 5/6: 2-3 throws each (5oz, 6oz, 7oz, 5oz, 4oz, 3oz). First throw 80%, then build. Rest 1+ min between weights. Track with radar.' 
      }
    ],
    recovery: [
      { ...r.hipFlexor },
      { ...r.bandHalos },
      { ...r.isometricExtensionFlexion },
      { ...r.isometricAbductionAdduction },
      { ...r.isometricRotation }
    ],
    notes: `High intent throwing day with progressive throwdowns based on training week:
    - Weeks 3/4: Short spread throwdowns (5oz, 6oz, 4oz)
    - Weeks 5/6: Long spread throwdowns (5oz, 6oz, 7oz, 5oz, 4oz, 3oz)
    Always use radar gun to track velocities. Take at least 1 minute rest between weight changes.
    First throw at 80% intent, then build up with each throw.`
  },

  'Off': {
    warmup: [],
    throwing: [],
    recovery: [
      {
        id: 'rest-recommendations',
        name: 'Rest Day Recommendations',
        reps: 'As needed',
        notes: 'Focus on quality sleep (7-9 hours), staying hydrated, and proper nutrition'
      },
      {
        id: 'light-stretching',
        name: 'Light Stretching (Optional)',
        reps: '5-10 mins if needed',
        notes: 'Only if feeling particularly tight or sore'
      },
      {
        id: 'recovery-activities',
        name: 'Recovery Activities (Optional)',
        reps: 'As desired',
        notes: 'Light walking, swimming, or other low-intensity activities if desired'
      }
    ],
    rpeRange: '0%',
    notes: 'Take recovery days as exactly that, recovery. Focus on sleep, nutrition, and mental preparation for upcoming workouts.'
  }
};

export const weeklySchedule = [
  ['Off', 'Recovery', 'Hybrid B', 'Recovery', 'Hybrid C', 'Recovery', 'Hybrid C'],
  ['Off', 'Recovery', 'Hybrid B', 'Recovery', 'Hybrid A', 'Recovery', 'Hybrid C'],
  ['Off', 'Recovery', 'Hybrid A', 'Recovery', 'Hybrid C', 'Recovery', 'Hybrid A'],
  ['Off', 'Recovery', 'Hybrid A', 'Recovery', 'Hybrid C', 'Recovery', 'Hybrid A'],
  ['Off', 'Recovery', 'Plyo Velo', 'Recovery', 'Hybrid B', 'Recovery', 'Hybrid A'],
  ['Off', 'Recovery', 'Plyo Velo', 'Recovery', 'Recovery', 'Recovery', 'Velocity'],
  ['Off', 'Recovery', 'Plyo Velo', 'Recovery', 'Recovery OR Hybrid B', 'Recovery', 'Velocity'],
  ['Off', 'Recovery', 'Plyo Velo', 'Recovery', 'Hybrid C', 'Recovery', 'Velocity']
];

export const generateSchedule = (startDate: Date) => {
  return weeklySchedule.map((week, weekIndex) => 
    week.map((workout, dayIndex) => {
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + (weekIndex * 7) + dayIndex);
      return {
        date,
        workout,
        completed: {}
      };
    })
  );
};