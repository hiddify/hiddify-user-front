/** The user page's languages, as the panel has them (Lang in hiddifypanel): native name and flag (the country the
 * language was added for). */
export const LANGUAGES: { code: string; flag: string; name: string }[] = [
  { code: 'en', flag: '🇬🇧', name: 'English' },
  { code: 'fa', flag: '🇮🇷', name: 'فارسی' },
  { code: 'zh', flag: '🇨🇳', name: '中文' },
  { code: 'ru', flag: '🇷🇺', name: 'Русский' },
  { code: 'pt', flag: '🇵🇹', name: 'Português' },
  { code: 'ko', flag: '🇰🇵', name: '한국어' },
  { code: 'tk', flag: '🇹🇲', name: 'Türkmençe' },
  { code: 'be', flag: '🇧🇾', name: 'Беларуская' },
  { code: 'es', flag: '🇨🇺', name: 'Español' },
  { code: 'am', flag: '🇪🇹', name: 'አማርኛ' },
  { code: 'ar', flag: '🇸🇦', name: 'العربية' },
  { code: 'ur', flag: '🇵🇰', name: 'اردو' },
  { code: 'ps', flag: '🇦🇫', name: 'پښتو' },
  { code: 'bn', flag: '🇧🇩', name: 'বাংলা' },
  { code: 'tr', flag: '🇹🇷', name: 'Türkçe' },
  { code: 'uz', flag: '🇺🇿', name: 'Oʻzbekcha' },
  { code: 'az', flag: '🇦🇿', name: 'Azərbaycanca' },
  { code: 'kk', flag: '🇰🇿', name: 'Қазақша' },
  { code: 'ky', flag: '🇰🇬', name: 'Кыргызча' },
  { code: 'tg', flag: '🇹🇯', name: 'Тоҷикӣ' },
  { code: 'hy', flag: '🇦🇲', name: 'Հայերեն' },
  { code: 'uk', flag: '🇺🇦', name: 'Українська' },
  { code: 'hi', flag: '🇮🇳', name: 'हिन्दी' },
]

const RTL = new Set(['fa', 'ar', 'ur', 'ps'])

/** Written right to left (as RTL_LANGS in the panel). */
export function isRtl(language: string | undefined): boolean {
  return RTL.has(language ?? '')
}
