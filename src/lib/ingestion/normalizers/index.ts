/**
 * Data normalizers for text, full names, phone numbers, and slugs.
 */

// Cyrillic to Latin transliteration map for SEO-friendly slugs
const TRANSLIT_MAP: Record<string, string> = {
  'а': 'a', 'б': 'b', 'в': 'v', 'г': 'g', 'д': 'd', 'е': 'e', 'ё': 'e', 'ж': 'zh',
  'з': 'z', 'и': 'i', 'й': 'y', 'к': 'k', 'л': 'l', 'м': 'm', 'н': 'n', 'о': 'o',
  'п': 'p', 'р': 'r', 'с': 's', 'т': 't', 'у': 'u', 'ф': 'f', 'х': 'kh', 'ц': 'ts',
  'ч': 'ch', 'ш': 'sh', 'щ': 'shch', 'ъ': '', 'ы': 'y', 'ь': '', 'э': 'e', 'ю': 'yu',
  'я': 'ya', 'і': 'i', 'ў': 'u'
};

export function slugify(text: string): string {
  if (!text) return '';
  const clean = text.toLowerCase().trim();
  let result = '';
  for (const char of clean) {
    if (TRANSLIT_MAP[char] !== undefined) {
      result += TRANSLIT_MAP[char];
    } else if (/[a-z0-9]/.test(char)) {
      result += char;
    } else if (char === ' ' || char === '-' || char === '_' || char === '/') {
      result += '-';
    }
  }
  return result.replace(/-+/g, '-').replace(/^-|-$/g, '');
}

/**
 * Normalizes Full Name (ФИО) into proper Title Case and extracts components.
 */
export function normalizeFullName(fullName: string): {
  fullName: string;
  lastName: string;
  firstName: string;
  middleName: string | null;
} {
  if (!fullName) {
    return { fullName: '', lastName: '', firstName: '', middleName: null };
  }

  // Remove redundant whitespace and non-breaking spaces
  const cleaned = fullName.replace(/[\s\u00A0\u200B]+/g, ' ').trim();
  const parts = cleaned.split(' ').filter(Boolean);

  const titleCase = (s: string) => {
    if (!s) return '';
    return s.charAt(0).toUpperCase() + s.slice(1).toLowerCase();
  };

  const lastName = parts[0] ? titleCase(parts[0]) : '';
  const firstName = parts[1] ? titleCase(parts[1]) : '';
  const middleName = parts.slice(2).length > 0 ? parts.slice(2).map(titleCase).join(' ') : null;

  const normalizedFullName = [lastName, firstName, middleName].filter(Boolean).join(' ');

  return {
    fullName: normalizedFullName,
    lastName,
    firstName,
    middleName,
  };
}

/**
 * Normalizes Belarusian phone numbers into a standard readable format:
 * +375 (152) 62-60-50 or +375 29 123-45-67
 */
export function normalizePhoneNumber(phone: string | null | undefined): string | null {
  if (!phone) return null;

  const digits = phone.replace(/\D/g, '');
  if (!digits || digits.length < 7) return null;

  // Belarusian landline or mobile
  if (digits.startsWith('80152') && digits.length === 11) {
    return `+375 (152) ${digits.slice(5, 7)}-${digits.slice(7, 9)}-${digits.slice(9, 11)}`;
  }
  if (digits.startsWith('375152') && digits.length === 12) {
    return `+375 (152) ${digits.slice(6, 8)}-${digits.slice(8, 10)}-${digits.slice(10, 12)}`;
  }

  const cleaned = phone.replace(/[\u00A0\u200B]/g, ' ').trim();
  return cleaned;
}

/**
 * Cleans arbitrary text fields, preserving essential punctuation while stripping junk.
 */
export function cleanText(text: string | null | undefined): string | null {
  if (!text) return null;
  const cleaned = text
    .replace(/[\u00A0\u200B\u200E\u200F]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  return cleaned.length > 0 ? cleaned : null;
}
