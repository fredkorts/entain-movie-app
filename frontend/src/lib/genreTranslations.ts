// TypeScript types for genre translations
export type Genre = 
  | "Action"
  | "Adventure"
  | "Animation"
  | "Comedy"
  | "Crime"
  | "Documentary"
  | "Drama"
  | "Family"
  | "Fantasy"
  | "History"
  | "Horror"
  | "Music"
  | "Mystery"
  | "Romance"
  | "Science Fiction"
  | "TV Movie"
  | "Thriller"
  | "War"
  | "Western";

export type SupportedLanguage = 'ru' | 'et';

export type TranslationMap = Record<Genre, string>;

// Genre translations (English is treated as identity - no translation needed)
export const genreTranslations: Record<SupportedLanguage, TranslationMap> = {
  ru: {
    "Action": "Боевик",
    "Adventure": "Приключения",
    "Animation": "Мультфильм",
    "Comedy": "Комедия",
    "Crime": "Криминал",
    "Documentary": "Документальный",
    "Drama": "Драма",
    "Family": "Семейный",
    "Fantasy": "Фэнтези",
    "History": "Исторический",
    "Horror": "Ужасы",
    "Music": "Музыкальный",
    "Mystery": "Мистика",
    "Romance": "Романтика",
    "Science Fiction": "Научная фантастика",
    "TV Movie": "Телефильм",
    "Thriller": "Триллер",
    "War": "Военный",
    "Western": "Вестерн"
  },
  et: {
    "Action": "Märul",
    "Adventure": "Seiklus",
    "Animation": "Animatsioon",
    "Comedy": "Komöödia",
    "Crime": "Kriminal",
    "Documentary": "Dokumentaal",
    "Drama": "Draama",
    "Family": "Perekond",
    "Fantasy": "Fantaasia",
    "History": "Ajaloo",
    "Horror": "Õudus",
    "Music": "Muusika",
    "Mystery": "Müsteerium",
    "Romance": "Romaan",
    "Science Fiction": "Ulme",
    "TV Movie": "Telefilm",
    "Thriller": "Põnevik",
    "War": "Sõja",
    "Western": "Lääne"
  }
};

export function translateGenre(genre: string, language: string): string {
  // Extract base language code and normalize case
  const baseLang = language.split('-')[0].toLowerCase();
  
  // Early return for English (identity case) or unsupported languages
  if (baseLang === 'en' || !(baseLang in genreTranslations)) {
    return genre; // Return original for English or unsupported languages
  }
  
  const lang = baseLang as SupportedLanguage;
  const translations = genreTranslations[lang];
  
  if (!(genre in translations)) {
    return genre; // Return original if genre not found
  }
  
  // Type-safe access now that we've verified both language and genre exist
  return translations[genre as Genre];
}