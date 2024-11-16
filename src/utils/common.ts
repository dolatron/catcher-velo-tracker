/**
 * Common utility functions used across the application
 */

/**
 * Normalizes a date to start of day in local timezone
 * This ensures consistent date handling across the app
 */
export const normalizeDate = (date: Date): Date => {
  const normalized = new Date(date);
  normalized.setHours(0, 0, 0, 0);
  return normalized;
};

/**
 * Extracts base workout name by removing variations and asterisks
 */
export const getBaseWorkout = (workout: string): string => 
  workout.split(' OR ')[0].replace('*', '');

/**
 * Formats a date using specified options
 */
export const formatDate = (date: Date, options: Intl.DateTimeFormatOptions): string => 
  date.toLocaleDateString('en-US', options);

/**
 * Formats a date for display in MM/DD/YYYY format
 */
export const formatDateForDisplay = (date: Date): string => {
  return date.toLocaleDateString('en-US', {
    month: '2-digit',
    day: '2-digit',
    year: 'numeric'
  });
};

/**
 * Formats a date for input field in YYYY-MM-DD format
 */
export const formatDateForInput = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

/**
 * Calculates the estimated completion date (8 weeks from start)
 */
export const calculateEndDate = (startDate: Date): Date => {
  const endDate = new Date(startDate);
  endDate.setDate(startDate.getDate() + (8 * 7) - 1); // 8 weeks minus 1 day
  return endDate;
};
