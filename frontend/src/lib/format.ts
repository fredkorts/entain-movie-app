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

export function formatYear(
  dateString: string | null | undefined,
  locale?: string
): string {
  return formatDate(dateString, locale, { year: 'numeric' });
}

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