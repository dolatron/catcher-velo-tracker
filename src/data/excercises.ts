// src/app/workout/exercises.ts
import type { Exercise } from './types';

export const warmupExercises: Record<string, Exercise> = {
  foamRoll: {
    id: 'foam-roll',
    name: 'Foam Roll',
    sets: 1,
    reps: '10s per pass, full body',
    notes: 'Focus on major muscle groups, especially throwing arm chain'
  },
  lacrosseBall: {
    id: 'lax-roll',
    name: 'Lacrosse Ball Rollout',
    sets: 1,
    reps: 'Roughly 20s per body part or to tolerance',
    notes: 'Target specific areas of tension, focus on shoulder and arm'
  },
  jaegerBands: {
    id: 'jaeger-bands',
    name: 'Jaeger Band Series',
    sets: 1,
    reps: '10 reps per exercise',
    notes: 'Complete full series of band exercises with proper form',
    videoUrl: 'https://vimeo.com/649123462/4c81d13d87'
  },
  wristWeights: {
    id: 'wrist-weights',
    name: 'Wrist Weight Series',
    sets: 1,
    reps: '10 reps per exercise',
    notes: 'Complete all wrist weight exercises with control',
    videoUrl: 'https://vimeo.com/649123462/4c81d13d87'
  },
};

export const recoveryExercises: Record<string, Exercise> = {
  hipFlexor: {
    id: 'hip-flexor',
    name: 'Multi-Planar Hip Flexor Stretch w/Overhead Reach',
    reps: '30-60 Secs',
    notes: 'Focus on full range of motion in all planes',
    videoUrl: 'https://vimeo.com/649123425/60d11c6e03'
  },
  bandHalos: {
    id: 'band-halos',
    name: 'Pull-Apart Band Halos',
    reps: '30-60 Secs',
    notes: 'Maintain consistent tension throughout movement',
    videoUrl: 'https://vimeo.com/649123401/3ce1022665'
  },
  isometricExtensionFlexion: {
    id: 'isometrics-extension-flexion',
    name: 'Isometric Extension/Flexion',
    reps: '2x5 Sec Holds at each position',
    notes: 'Maintain steady tension throughout the holds',
    videoUrl: 'https://vimeo.com/649123658/99df52c57f',
    variations: {
      'Recovery': {
        reps: '5x5 Sec Holds at each position'
      }
    }
  },
  isometricAbductionAdduction: {
    id: 'isometrics-abduction-adduction',
    name: 'Isometric Abduction/Adduction',
    reps: '2x5 Sec Holds at each position',
    notes: 'Maintain steady tension throughout the holds',
    videoUrl: 'https://vimeo.com/649123619/23bb2d1a8d',
    variations: {
      'Recovery': {
        reps: '5x5 Sec Holds at each position'
      }
    }
  },
  isometricRotation: {
    id: 'isometrics-rotation',
    name: 'Isometric External Rotation/Internal Rotation',
    reps: '2x5 Sec Holds at each position',
    notes: 'Maintain steady tension throughout the holds',
    videoUrl: 'https://vimeo.com/649123649/c2b63340c3',
    variations: {
      'Recovery': {
        reps: '5x5 Sec Holds at each position'
      }
    }
  },
  plyoCareRebounders: {
    id: 'plyo-rebounders',
    name: 'PlyoCare Rebounders',
    sets: 3,
    reps: '10 reps with 1kg AND 2kg balls',
    notes: 'Circuit work - maintain consistent rhythm',
    videoUrl: 'https://vimeo.com/649123772/9acd2778dd'
  },
  bandPullaparts: {
    id: 'band-pullaparts',
    name: 'Band Pullaparts',
    sets: 3,
    reps: '20s per bodypart',
    notes: 'Part of recovery circuit - focus on scapular control',
    videoUrl: 'https://vimeo.com/649123467/4c7685341a'
  },
  waiterWalks: {
    id: 'waiter-walks',
    name: 'Waiter Walks',
    sets: 3,
    reps: 'approx 20 yards',
    notes: 'Circuit exercise - maintain shoulder stability',
    videoUrl: 'https://vimeo.com/649123526/80de208fca'
  },
  upwardTosses: {
    id: 'upward-tosses',
    name: 'Upward Tosses',
    sets: 2,
    reps: '15 reps with 2kg ball',
    notes: 'Focus on shoulder control and catch position',
    videoUrl: 'https://vimeo.com/649123526/80de208fca'
  }
};

export const throwingExercises: Record<string, Exercise> = {
  plyoCareReverse: {
    id: 'plyo-reverse',
    name: 'PlyoCare Reverse Throws',
    sets: 1,
    reps: '10 reps with 1kg AND 2kg balls',
    notes: 'Focus on deceleration and arm path',
    videoUrl: 'https://vimeo.com/648901279/071a72a256',
    variations: {
      'Recovery': {
        sets: 2,
        rpe: '60%',
        notes: 'Lower intent focusing on recovery'
      },
      'Hybrid A': {
        rpe: '80-90%',
        notes: 'Higher intent with proper mechanics'
      },
      'Hybrid B': {
        rpe: '60-70%',
        notes: 'Focus on arm path mechanics'
      }
    }
  },
  plyoCarePivot: {
    id: 'plyo-pivot',
    name: 'PlyoCare Pivot Pickoffs',
    sets: 1,
    reps: '10 reps with 1kg AND 2kg balls',
    notes: 'Focus on footwork and quick exchange',
    videoUrl: 'https://vimeo.com/648901160/cef5a4ed20',
    variations: {
      'Recovery': {
        sets: 1,
        rpe: '60%',
        notes: 'Lower intent focusing on mechanics'
      },
      'Hybrid A': {
        rpe: '80-90%',
        notes: 'Higher intent maintaining mechanics'
      },
      'Hybrid B': {
        rpe: '60-70%',
        notes: 'Focus on clean mechanics'
      }
    }
  },
  plyoCareRollIn: {
    id: 'plyo-rollin',
    name: 'PlyoCare Roll-In Throws',
    sets: 1,
    reps: '5 reps with 1kg AND 450g balls',
    notes: 'Practice quick exchange and footwork',
    videoUrl: 'https://vimeo.com/648901319/1758c5223e',
    variations: {
      'Plyo Velo': {
        reps: '3 reps with 1kg ball, 5 reps with 450g ball',
        notes: 'Begin radar tracking with Blue Roll-ins'
      },
      'Hybrid B': {
        reps: '10 reps with 1kg AND 450g balls',
        rpe: '60-70%',
        notes: 'Focus on clean mechanics'
      }
    }
  },
  plyoCareStepBacks: {
    id: 'plyo-stepbacks',
    name: 'PlyoCare Catcher Step Backs',
    sets: 2,
    reps: '1 throw each with blue, red, yellow, gray',
    notes: 'Practice footwork and throwing mechanics',
    videoUrl: 'https://vimeo.com/648901044/e4c3647969',
    variations: {
      'Plyo Velo': {
        notes: 'Track velocity with radar, focus on max intent throws'
      },
      'Velocity': {
        sets: 1,
        notes: 'Prepare for throwdown work'
      }
    }
  },
  plyoCareDropSteps: {
    id: 'plyo-dropsteps',
    name: 'PlyoCare Drop Steps',
    sets: 2,
    reps: '1 throw each with blue, red, yellow, gray',
    notes: 'Focus on quick footwork and exchange',
    videoUrl: 'https://vimeo.com/648901078/58e0fad05a',
    variations: {
      'Plyo Velo': {
        notes: 'Track velocity with radar, focus on max intent throws'
      }
    }
  },
  plyoCareHalfStance: {
    id: 'plyo-halfstance',
    name: 'PlyoCare Half Stance',
    sets: 2,
    reps: '1 throw each with blue, red, yellow, gray',
    notes: 'Focus on balance and throw accuracy',
    videoUrl: 'https://vimeo.com/648901110/ec8f1390aa',
    variations: {
      'Plyo Velo': {
        notes: 'Track velocity with radar, focus on max intent throws'
      },
      'Hybrid B': {
        sets: 1,
        rpe: '60-70%',
        notes: 'Focus on clean mechanics'
      }
    }
  },
  longToss: {
    id: 'long-toss',
    name: 'Long Toss',
    sets: 1,
    reps: 'Extension Phase in Preparation for Throwdowns',
    notes: 'Build up distance gradually',
    videoUrl: 'https://vimeo.com/648905370/80ef2db89b',
    variations: {
      'Hybrid A': {
        reps: '5 throws each to start - 11oz, 9oz, 7oz 5oz throws to tolerance (Extension Phase) + 8-12 Compression throws',
        notes: 'Focus on both extension and compression phases'
      },
      'Hybrid B': {
        reps: 'Extension Phase - Max distance without going over 70% RPE',
        notes: 'Only on Hybrid B days - focus on extension phase only'
      }
    }
  },
  throwdownsShort: {
    id: 'throwdowns-short',
    name: 'Throwdowns Short Spread (Weeks 3/4)',
    sets: 1,
    reps: '3-4 throws each (5oz, 6oz, 4oz)',
    notes: 'Take at least 1 minute rest between ball weights. First throw at 80% intent, then build up. For 2B practice.'
  },
  throwdownsLong: {
    id: 'throwdowns-long',
    name: 'Throwdowns Long Spread (Weeks 5/6)',
    sets: 1,
    reps: '2-3 throws each (5oz, 6oz, 7oz, 5oz, 4oz, 3oz)',
    notes: 'One minute minimum rest between weight changes. First throw at 80% intent, then build up. For 2B/3B practice.'
  },
  weightedBallCatch: {
    id: 'weighted-ball-catch',
    name: 'Weighted Ball Catch Play',
    sets: 1,
    reps: '5 throws each - 11oz, 9oz, 7oz, 5oz throws to tolerance (~70% RPE)',
    notes: 'Only on Hybrid B* days. Finish with 5 throws with 4oz. Rest between weight changes.',
    variations: {
      'Hybrid B*': {
        rpe: '70%',
        notes: 'Focus on clean mechanics with each weight'
      }
    }
  },
  lightCatch: {
    id: 'light-catch',
    name: 'Light Catch',
    sets: 1,
    reps: 'Throws to tolerance',
    rpe: '60%',
    notes: 'STRICT 60% RPE MAX - Focus on recovery and arm maintenance'
  }
};