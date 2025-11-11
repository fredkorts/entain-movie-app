// Job title translations
export const jobTitleTranslations = {
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
  const lang = language.split('-')[0]; // 'en-US' -> 'en'
  const translations = jobTitleTranslations[lang as keyof typeof jobTitleTranslations];
  return translations?.[job as keyof typeof translations] || job;
}