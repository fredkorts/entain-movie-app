// TypeScript types for job title translations
export type JobTitle = 
  | "Director"
  | "Producer"
  | "Executive Producer"
  | "Screenplay"
  | "Story"
  | "Writer"
  | "Original Music Composer"
  | "Director of Photography"
  | "Editor"
  | "Production Designer"
  | "Costume Design"
  | "Makeup Artist"
  | "Sound Designer"
  | "Visual Effects Supervisor";

export type SupportedLanguage = 'en' | 'ru' | 'et';

export type TranslationMap = Record<JobTitle, string>;

// Job title translations
export const jobTitleTranslations: Record<SupportedLanguage, TranslationMap> = {
  en: {
    "Director": "Director",
    "Producer": "Producer",
    "Executive Producer": "Executive Producer",
    "Screenplay": "Screenplay",
    "Story": "Story", 
    "Writer": "Writer",
    "Original Music Composer": "Original Music Composer",
    "Director of Photography": "Director of Photography",
    "Editor": "Editor",
    "Production Designer": "Production Designer",
    "Costume Design": "Costume Design",
    "Makeup Artist": "Makeup Artist",
    "Sound Designer": "Sound Designer",
    "Visual Effects Supervisor": "Visual Effects Supervisor"
  },
  ru: {
    "Director": "Режиссёр",
    "Producer": "Продюсер", 
    "Executive Producer": "Исполнительный продюсер",
    "Screenplay": "Сценарий",
    "Story": "Сюжет",
    "Writer": "Сценарист",
    "Original Music Composer": "Композитор",
    "Director of Photography": "Оператор-постановщик",
    "Editor": "Монтажёр",
    "Production Designer": "Художник-постановщик",
    "Costume Design": "Художник по костюмам",
    "Makeup Artist": "Гримёр",
    "Sound Designer": "Звукорежиссёр",
    "Visual Effects Supervisor": "Супервайзер спецэффектов"
  },
  et: {
    "Director": "Lavastaja",
    "Producer": "Produtsent",
    "Executive Producer": "Täitevprodutsent", 
    "Screenplay": "Stsenaarium",
    "Story": "Lugu",
    "Writer": "Stsenarist",
    "Original Music Composer": "Helilooja",
    "Director of Photography": "Operaator",
    "Editor": "Monteerija",
    "Production Designer": "Kunstnik-lavastaja",
    "Costume Design": "Kostüümikunstnik",
    "Makeup Artist": "Grimeerija",
    "Sound Designer": "Helirežissöör",
    "Visual Effects Supervisor": "Eriefektide superviisor"
  }
};

export function translateJobTitle(job: string, language: string): string {
  // Extract base language code and normalize case
  const baseLang = language.split('-')[0].toLowerCase();
  
  // Defensive check: verify language exists in our translations
  if (!(baseLang in jobTitleTranslations)) {
    return job; // Return original if language not supported
  }
  
  // Type-safe access now that we've verified the language exists
  const lang = baseLang as SupportedLanguage;
  const translations = jobTitleTranslations[lang];
  
  // Defensive check: verify job title exists in the translations
  if (!(job in translations)) {
    return job; // Return original if job title not found
  }
  
  // Type-safe access now that we've verified both language and job exist
  return translations[job as JobTitle];
}