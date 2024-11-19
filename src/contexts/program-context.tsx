'use client';

import React, { createContext, useContext } from 'react';
import type { Program, Exercise, Category } from '@/common/types';
import programData from '@/programs/driveline-catcher-velo/program.json';
import exerciseData from '@/programs/driveline-catcher-velo/exercises.json';

export interface ProgramConfig {
  programData: Program;
  exerciseData: {
    categories: Record<string, Category>;
    exercises: Record<string, Exercise>;
  };
}

const DEFAULT_PROGRAM: ProgramConfig = {
  programData: programData as unknown as Program,
  exerciseData: exerciseData as {
    categories: Record<string, Category>;
    exercises: Record<string, Exercise>;
  }
};

const ProgramContext = createContext<ProgramConfig>(DEFAULT_PROGRAM);

export const ProgramProvider: React.FC<{
  children: React.ReactNode;
  program?: ProgramConfig;
}> = ({ children, program = DEFAULT_PROGRAM }) => {
  return (
    <ProgramContext.Provider value={program}>
      {children}
    </ProgramContext.Provider>
  );
};

export const useProgram = () => useContext(ProgramContext);