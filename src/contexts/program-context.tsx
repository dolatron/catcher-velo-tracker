/**
 * Program Context Provider
 * 
 * Manages the global program configuration state and provides access to:
 * - Program data (workout types, schedule, metadata)
 * - Exercise data (definitions, categories, default values)
 * 
 * This context enables components to access program configuration
 * without prop drilling through the component tree.
 */

'use client';

import React, { createContext, useContext } from 'react';
import type { Program, Exercise, Category } from '@/common/types';
import programData from '@/programs/driveline-catcher-velo/program.json';
import exerciseData from '@/programs/driveline-catcher-velo/exercises.json';

/**
 * Represents the complete program configuration including
 * both program structure and exercise definitions
 */
export interface ProgramConfig {
  programData: Program;
  exerciseData: {
    categories: Record<string, Category>;
    exercises: Record<string, Exercise>;
  };
}

/**
 * Default program configuration loaded from JSON files
 * Type assertions are necessary due to JSON import limitations
 */
const DEFAULT_PROGRAM: ProgramConfig = {
  programData: programData as unknown as Program,
  exerciseData: exerciseData as {
    categories: Record<string, Category>;
    exercises: Record<string, Exercise>;
  }
};

/**
 * Context instance for program configuration
 * Initialized with default program data
 */
const ProgramContext = createContext<ProgramConfig>(DEFAULT_PROGRAM);

/**
 * Program Provider Component
 * Wraps the application to provide program configuration to all child components
 * 
 * @param children - Child components that will have access to program context
 * @param program - Optional program configuration override
 */
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

/**
 * Custom hook to access program configuration
 * Throws error if used outside ProgramProvider
 * 
 * @returns The current program configuration
 * @throws Error if used outside ProgramProvider context
 */
export const useProgram = () => useContext(ProgramContext);