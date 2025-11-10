/**
 * Format a date string according to the user's locale
 * @param dateString - ISO date string (e.g., "2023-12-25")
 * @param locale - Optional locale string (e.g., "en", "et", "ru"). Defaults to browser locale.
 * @param options - Optional Intl.DateTimeFormat options
 * @returns Formatted date string or "—" if invalid date
 */
export function formatDate(
  dateString: string | null | undefined,
  locale?: string,
  options: Intl.DateTimeFormatOptions = { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  }
): string {
  if (!dateString || !dateString.trim()) {
    return "—";
  }

  try {
    const date = new Date(dateString);
    
    // Check if date is valid
    if (isNaN(date.getTime())) {
      return "—";
    }

    return new Intl.DateTimeFormat(locale, options).format(date);
  } catch (error) {
    console.warn('Failed to format date:', dateString, error);
    return "—";
  }
}

/**
 * Format a date string to show just the year
 * @param dateString - ISO date string (e.g., "2023-12-25") 
 * @param locale - Optional locale string
 * @returns Formatted year or "—" if invalid
 */
export function formatYear(
  dateString: string | null | undefined,
  locale?: string
): string {
  return formatDate(dateString, locale, { year: 'numeric' });
}

/**
 * Format a date string to show short format (e.g., "Dec 25, 2023" or "25.12.2023")
 * @param dateString - ISO date string
 * @param locale - Optional locale string
 * @returns Formatted short date or "—" if invalid
 */
export function formatDateShort(
  dateString: string | null | undefined,
  locale?: string
): string {
  return formatDate(dateString, locale, { 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric' 
  });
}