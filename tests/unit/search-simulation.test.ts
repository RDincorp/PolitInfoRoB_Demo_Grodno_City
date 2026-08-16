import { describe, it, expect, beforeEach } from 'vitest';
import { DBRepository } from '@/lib/db';
import { initialSeedData } from '@/lib/db/seed';

describe('Search Engine Simulation & Edge Cases Audit', () => {
  beforeEach(() => {
    DBRepository.seed(initialSeedData);
  });

  const scenarios = [
    // 1. Person Search Scenarios
    { query: 'Фёдоров', expectedType: 'person', desc: 'Exact Cyrillic with Ё', expectedSnippet: 'Фёдоров' },
    { query: 'Федоров', expectedType: 'person', desc: 'Cyrillic with Е instead of Ё', expectedSnippet: 'Фёдоров' },
    { query: 'Олег Федоров', expectedType: 'person', desc: 'First name + Last name reverse order', expectedSnippet: 'Фёдоров' },
    { query: 'Белявский', expectedType: 'person', desc: 'Deputy surname', expectedSnippet: 'Белявский' },
    { query: 'Хмель Андрей', expectedType: 'person', desc: 'Mayor name', expectedSnippet: 'Хмель' },

    // 2. Institution & Department Search Scenarios
    { query: 'горисполком', expectedType: 'institution', desc: 'Short name lowercase', expectedSnippet: 'исполнительный комитет' },
    { query: 'Гродненский городской совет', expectedType: 'institution', desc: 'Full official name snippet', expectedSnippet: 'Совет депутатов' },
    { query: 'Ленинский район', expectedType: 'territory', desc: 'District territory/administration', expectedSnippet: 'Ленинский' },
    { query: 'загс', expectedType: 'competence', desc: 'Short service keyword', expectedSnippet: 'актов гражданского состояния' },

    // 3. District & Address Search Scenarios
    { query: 'Советская', expectedType: 'district', desc: 'Street in district boundaries', expectedSnippet: 'Советская' },
    { query: 'ул. Советская', expectedType: 'district', desc: 'Street with prefix abbreviation', expectedSnippet: 'Советская' },
    { query: 'Округ 1', expectedType: 'district', desc: 'District by number query', expectedSnippet: 'Округ №1' },
    { query: 'Округ №2', expectedType: 'district', desc: 'District with № symbol', expectedSnippet: 'Округ №2' },

    // 4. Competence / Life Situation Scenarios
    { query: 'ЖКХ', expectedType: 'competence', desc: 'Abbreviation uppercase', expectedSnippet: 'Жилищно-коммунальные' },
    { query: 'капитальный ремонт', expectedType: 'competence', desc: 'Life situation in description', expectedSnippet: 'Жилищно-коммунальные' },
    { query: 'детский сад', expectedType: 'competence', desc: 'Service inquiry', expectedSnippet: 'Дошкольное' },
    { query: 'перепланировка', expectedType: 'competence', desc: 'Construction & planning keyword', expectedSnippet: 'Архитектура' },

    // 5. Glossary & Legal Scenarios
    { query: 'ВНС', expectedType: 'glossary', desc: 'Acronym glossary search', expectedSnippet: 'Всебелорусское народное собрание' },
    { query: 'созыв', expectedType: 'glossary', desc: 'State term search', expectedSnippet: 'Созыв' },
    { query: 'депутатский запрос', expectedType: 'glossary', desc: 'Legal procedure term', expectedSnippet: 'Депутатский запрос' },
    { query: 'самоуправление', expectedType: 'glossary', desc: 'System governance term', expectedSnippet: 'Местное самоуправление' },
  ];

  for (const s of scenarios) {
    it(`Simulation: "${s.query}" [${s.desc}]`, () => {
      const results = DBRepository.search(s.query);
      expect(results.length).toBeGreaterThan(0);
      const topMatch = results[0];
      const hasExpectedInTop = results.slice(0, 3).some((r) => 
        (r.title.includes(s.expectedSnippet) || (r.description && r.description.includes(s.expectedSnippet)))
      );
      expect(hasExpectedInTop).toBe(true);
    });
  }

  // 6. Filter Specificity Tests
  it('filters results strictly by entity type', () => {
    const personOnly = DBRepository.search('Гродно', 'person');
    expect(personOnly.every((r) => r.type === 'person')).toBe(true);

    const instOnly = DBRepository.search('Гродно', 'institution');
    expect(instOnly.every((r) => r.type === 'institution')).toBe(true);

    const distOnly = DBRepository.search('Советская', 'district');
    expect(distOnly.every((r) => r.type === 'district')).toBe(true);

    const compOnly = DBRepository.search('ремонт', 'competence');
    expect(compOnly.every((r) => r.type === 'competence')).toBe(true);

    const glossOnly = DBRepository.search('совет', 'glossary');
    expect(glossOnly.every((r) => r.type === 'glossary')).toBe(true);
  });

  // 7. Edge Cases (empty query, punctuation only, whitespace)
  it('safely handles edge cases like empty queries and special characters', () => {
    expect(DBRepository.search('')).toEqual([]);
    expect(DBRepository.search('   ')).toEqual([]);
    expect(DBRepository.search('!@#$%^&*()_+')).toEqual([]);
    expect(DBRepository.search('///...')).toEqual([]);
  });
});
