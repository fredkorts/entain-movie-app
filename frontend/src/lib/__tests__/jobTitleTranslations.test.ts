import { describe, it, expect } from 'vitest';
import { translateJobTitle, jobTitleTranslations } from '../jobTitleTranslations';

describe('jobTitleTranslations', () => {
  describe('Core translations', () => {
    it('returns original job title for English (identity)', () => {
      expect(translateJobTitle('Director', 'en')).toBe('Director');
      expect(translateJobTitle('Director', 'en-US')).toBe('Director');
    });

    it('translates job titles to Russian', () => {
      expect(translateJobTitle('Director', 'ru')).toBe('Режиссёр');
      expect(translateJobTitle('Executive Producer', 'ru')).toBe('Исполнительный продюсер');
      expect(translateJobTitle('Director of Photography', 'ru')).toBe('Оператор-постановщик');
    });

    it('translates job titles to Estonian', () => {
      expect(translateJobTitle('Director', 'et')).toBe('Lavastaja');
      expect(translateJobTitle('Executive Producer', 'et')).toBe('Täitevprodutsent');
      expect(translateJobTitle('Director of Photography', 'et')).toBe('Operaator');
    });

    it('translates all Russian job titles correctly', () => {
      const jobs = Object.keys(jobTitleTranslations.ru);
      jobs.forEach(job => {
        const translation = translateJobTitle(job, 'ru');
        expect(translation).toBe(jobTitleTranslations.ru[job as keyof typeof jobTitleTranslations.ru]);
      });
    });

    it('translates all Estonian job titles correctly', () => {
      const jobs = Object.keys(jobTitleTranslations.et);
      jobs.forEach(job => {
        const translation = translateJobTitle(job, 'et');
        expect(translation).toBe(jobTitleTranslations.et[job as keyof typeof jobTitleTranslations.et]);
      });
    });
  });

  describe('Fallback behavior', () => {
    it('returns original job title for unsupported language', () => {
      expect(translateJobTitle('Director', 'fr')).toBe('Director');
    });

    it('returns original job title for unknown job name', () => {
      expect(translateJobTitle('Stunt Coordinator', 'ru')).toBe('Stunt Coordinator');
    });
  });

  describe('Language code normalization', () => {
    it('handles language codes with region variants', () => {
      expect(translateJobTitle('Director', 'ru-RU')).toBe('Режиссёр');
      expect(translateJobTitle('Director', 'et-EE')).toBe('Lavastaja');
    });

    it('normalizes uppercase language codes', () => {
      expect(translateJobTitle('Director', 'EN')).toBe('Director');
      expect(translateJobTitle('Director', 'RU')).toBe('Режиссёр');
    });
  });
});
