// ...existing code...

/**
 * Normalizes a date to start of day in local timezone
 * This ensures consistent date handling across the app
 */
export const normalizeDate = (date: Date): Date => {
  const normalized = new Date(date);
  normalized.setHours(0, 0, 0, 0);
  return normalized;
};

// ...existing code...
