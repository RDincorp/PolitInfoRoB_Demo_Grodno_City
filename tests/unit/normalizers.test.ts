import { describe, it, expect } from 'vitest';
import { normalizeFullName, normalizePhoneNumber, slugify, cleanText } from '@/lib/ingestion/normalizers';

describe('Normalizers Module', () => {
  it('correctly normalizes standard Belarusian Cyrillic full names (FIO)', () => {
    const res1 = normalizeFullName('Фёдоров Олег Геннадьевич');
    expect(res1.lastName).toBe('Фёдоров');
    expect(res1.firstName).toBe('Олег');
    expect(res1.middleName).toBe('Геннадьевич');
    expect(res1.fullName).toBe('Фёдоров Олег Геннадьевич');

    const res2 = normalizeFullName('Хмель Андрей Валерьевич');
    expect(res2.lastName).toBe('Хмель');
    expect(res2.firstName).toBe('Андрей');
    expect(res2.middleName).toBe('Валерьевич');
  });

  it('normalizes single or double token names without breaking', () => {
    const res = normalizeFullName('Иванов Иван');
    expect(res.lastName).toBe('Иванов');
    expect(res.firstName).toBe('Иван');
    expect(res.middleName).toBeNull();
  });

  it('normalizes Belarusian phone numbers into standard E.164-like format', () => {
    expect(normalizePhoneNumber('+375 (152) 62-60-50')).toBe('+375 (152) 62-60-50');
    expect(normalizePhoneNumber('80152626050')).toBe('+375 (152) 62-60-50');
    expect(normalizePhoneNumber('invalid-text')).toBeNull();
  });

  it('generates transliterated url-safe slugs from Cyrillic text', () => {
    expect(slugify('Фёдоров Олег Геннадьевич')).toBe('fedorov-oleg-gennadevich');
    expect(slugify('Гродненский городской Совет депутатов')).toBe('grodnenskiy-gorodskoy-sovet-deputatov');
  });

  it('cleans irregular whitespace and non-breaking spaces', () => {
    expect(cleanText('  Гродненский   горисполком  \n\t')).toBe('Гродненский горисполком');
  });
});
