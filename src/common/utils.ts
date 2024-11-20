/**
 * Utility functions for date manipulation and workout data processing.
 * 
 * This module provides core functionality for:
 * - Date normalization and formatting
 * - Workout name processing
 * - Program schedule calculations
 * 
 * @module utils
 */

/**
 * Normalizes a date by setting the time to midnight (00:00:00.000).
 * Used for consistent date comparisons throughout the application.
 * 
 * @param {Date} date - The date to normalize
 * @returns {Date} A new Date object set to midnight local time
 * 
 * @example
 * const date = new Date('2023-12-25T14:30:00');
 * const normalized = normalizeDate(date);
 * // normalized = 2023-12-25T00:00:00.000
 */
export const normalizeDate = (date: Date): Date => {
  const normalized = new Date(date);
  normalized.setHours(0, 0, 0, 0);
  return normalized;
};

/**
 * Extracts the base workout name from a potentially complex workout string.
 * Handles workout variations marked with "OR" and special markers (*).
 * 
 * @param {string} workout - Raw workout name (e.g., "Workout A OR Workout B*")
 * @returns {string} Simplified base workout name
 * 
 * @example
 * const name = getBaseWorkout("Speed A OR Recovery A*");
 * // name = "Speed A"
 */
export const getBaseWorkout = (workout: string): string => {
  const base = workout.split(' OR ')[0].trim().replace('*', '');
  console.log('getBaseWorkout:', { input: workout, output: base });
  return base;
};

/**
 * Formats a date using the specified Intl.DateTimeFormat options.
 * Provides localized date formatting with configurable output format.
 * 
 * @param {Date} date - The date to format
 * @param {Intl.DateTimeFormatOptions} options - Formatting options
 * @returns {string} Formatted date string according to locale and options
 * 
 * @example
 * const date = new Date('2023-12-25');
 * const formatted = formatDate(date, { weekday: 'long', month: 'short' });
 * // formatted = "Monday, Dec"
 */
export const formatDate = (date: Date, options: Intl.DateTimeFormatOptions): string => 
  date.toLocaleDateString('en-US', options);

/**
 * Formats a date in MM/DD/YYYY format for display in the UI.
 * 
 * @param {Date} date - The date to format
 * @returns {string} Date formatted as MM/DD/YYYY
 * 
 * @example
 * const date = new Date('2023-12-25');
 * const display = formatDateForDisplay(date);
 * // display = "12/25/2023"
 */
export const formatDateForDisplay = (date: Date): string => {
  return date.toLocaleDateString('en-US', {
    month: '2-digit',
    day: '2-digit',
    year: 'numeric'
  });
};

/**
 * Formats a date in YYYY-MM-DD format for HTML date input fields.
 * 
 * @param {Date} date - The date to format
 * @returns {string} Date formatted as YYYY-MM-DD
 * 
 * @example
 * const date = new Date('2023-12-25');
 * const input = formatDateForInput(date);
 * // input = "2023-12-25"
 */
export const formatDateForInput = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

/**
 * Calculates the program end date based on a start date and program length.
 * 
 * @param {Date} startDate - Program start date
 * @param {number} programLength - Program length in weeks
 * @returns {Date} Calculated program end date
 * 
 * @example
 * const start = new Date('2023-12-25');
 * const end = calculateEndDate(start, 8);
 * // end = 2024-02-18 (55 days after start)
 */
export const calculateEndDate = (startDate: Date, programLength: number): Date => {
  const endDate = new Date(startDate);
  endDate.setDate(startDate.getDate() + (programLength * 7) - 1); // -1 because we start counting from 0
  return endDate;
};
