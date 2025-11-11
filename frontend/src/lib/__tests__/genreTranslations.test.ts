import { describe, it, expect } from 'vitest';
import { translateGenre, genreTranslations } from '../genreTranslations';

describe('genreTranslations', () => {
  describe('Core translations', () => {
    it('returns original genre for English language', () => {
      expect(translateGenre('Action', 'en')).toBe('Action');
      expect(translateGenre('Action', 'en-US')).toBe('Action');
    });

    it('translates genres to Russian', () => {
      expect(translateGenre('Action', 'ru')).toBe('Боевик');
      expect(translateGenre('Science Fiction', 'ru')).toBe('Научная фантастика');
    });

    it('translates genres to Estonian', () => {
      expect(translateGenre('Action', 'et')).toBe('Märul');
      expect(translateGenre('Science Fiction', 'et')).toBe('Ulme');
    });

    it('translates all Russian genres correctly', () => {
      const genres = Object.keys(genreTranslations.ru);
      genres.forEach(genre => {
        const translation = translateGenre(genre, 'ru');
        expect(translation).toBe(genreTranslations.ru[genre as keyof typeof genreTranslations.ru]);
      });
    });

    it('translates all Estonian genres correctly', () => {
      const genres = Object.keys(genreTranslations.et);
      genres.forEach(genre => {
        const translation = translateGenre(genre, 'et');
        expect(translation).toBe(genreTranslations.et[genre as keyof typeof genreTranslations.et]);
      });
    });
  });

  describe('Fallback behavior', () => {
    it('returns original genre for unsupported language', () => {
      expect(translateGenre('Action', 'fr')).toBe('Action');
    });

    it('returns original genre for unknown genre name', () => {
      expect(translateGenre('UnknownGenre', 'ru')).toBe('UnknownGenre');
    });
  });

  describe('Language code normalization', () => {
    it('handles language codes with region variants', () => {
      expect(translateGenre('Action', 'ru-RU')).toBe('Боевик');
      expect(translateGenre('Action', 'et-EE')).toBe('Märul');
    });

    it('normalizes uppercase language codes', () => {
      expect(translateGenre('Action', 'EN')).toBe('Action');
      expect(translateGenre('Action', 'RU')).toBe('Боевик');
    });
  });
});
