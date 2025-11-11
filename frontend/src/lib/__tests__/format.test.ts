import { describe, it, expect } from 'vitest';
import { formatDate, formatYear, formatDateShort } from '../format';

describe('formatDate', () => {
  it('formats valid date string with default options', () => {
    const result = formatDate('2024-01-15', 'en');
    expect(result).toBe('January 15, 2024');
  });

  it('returns em dash for null', () => {
    expect(formatDate(null)).toBe('—');
  });

  it('returns em dash for undefined', () => {
    expect(formatDate(undefined)).toBe('—');
  });

  it('returns em dash for empty string', () => {
    expect(formatDate('')).toBe('—');
  });

  it('returns em dash for invalid date string', () => {
    expect(formatDate('invalid-date')).toBe('—');
  });

  it('handles different locales', () => {
    const date = '2024-01-15';
    
    // English
    expect(formatDate(date, 'en')).toContain('January');
    
    // Estonian (should contain month name in Estonian)
    const etResult = formatDate(date, 'et');
    expect(etResult).toBeTruthy();
    expect(etResult).not.toBe('—');
    
    // Russian (should contain month name in Russian)
    const ruResult = formatDate(date, 'ru');
    expect(ruResult).toBeTruthy();
    expect(ruResult).not.toBe('—');
  });

  it('handles custom date format options', () => {
    const result = formatDate('2024-12-25', 'en', { 
      year: 'numeric', 
      month: 'short' 
    });
    expect(result).toBe('Dec 2024');
  });
});

describe('formatYear', () => {
  it('extracts and formats year from valid date', () => {
    expect(formatYear('2024-06-15', 'en')).toBe('2024');
  });

  it('returns em dash for null', () => {
    expect(formatYear(null)).toBe('—');
  });

  it('returns em dash for undefined', () => {
    expect(formatYear(undefined)).toBe('—');
  });

  it('returns em dash for invalid date', () => {
    expect(formatYear('not-a-date')).toBe('—');
  });
});

describe('formatDateShort', () => {
  it('formats date in short format', () => {
    const result = formatDateShort('2024-03-20', 'en');
    expect(result).toContain('Mar');
    expect(result).toContain('20');
    expect(result).toContain('2024');
  });

  it('returns em dash for null', () => {
    expect(formatDateShort(null)).toBe('—');
  });

  it('returns em dash for undefined', () => {
    expect(formatDateShort(undefined)).toBe('—');
  });

  it('handles different locales', () => {
    const date = '2024-03-20';
    
    const enResult = formatDateShort(date, 'en');
    expect(enResult).toBeTruthy();
    expect(enResult).not.toBe('—');
    
    const etResult = formatDateShort(date, 'et');
    expect(etResult).toBeTruthy();
    expect(etResult).not.toBe('—');
  });
});
