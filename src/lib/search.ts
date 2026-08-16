import { DatabaseState } from '@/lib/db';
import { SearchResultItem } from '@/types';

/**
 * Normalizes text for resilient Russian/Belarusian search.
 * - Converts to lowercase.
 * - Normalizes 'ё' -> 'е', 'і' -> 'и', 'ў' -> 'у'.
 * - Replaces punctuation, symbols and quotes with spaces.
 * - Trims and collapses multiple spaces.
 */
export function normalizeSearchText(text: string | null | undefined): string {
  if (!text) return '';
  return text
    .toLowerCase()
    .replace(/ё/g, 'е')
    .replace(/і/g, 'и')
    .replace(/ў/g, 'у')
    .replace(/№/g, ' ')
    .replace(/[«»""''.,/\\()\-:;!?_—–[\]{}]/g, ' ')
    .replace(/[\s\u00A0\u200B]+/g, ' ')
    .trim();
}

/**
 * Common Russian stop-words to skip when query has multiple tokens.
 */
const STOP_WORDS = new Set(['в', 'и', 'на', 'по', 'г', 'ул', 'д', 'дом', 'номер', 'от', 'за', 'для', 'о', 'об']);

/**
 * Splits query into significant search tokens.
 */
export function extractSearchTokens(query: string): string[] {
  const norm = normalizeSearchText(query);
  if (!norm) return [];
  const rawTokens = norm.split(' ').filter((t) => t.length > 0);
  if (rawTokens.length <= 1) return rawTokens;

  const filtered = rawTokens.filter((t) => !STOP_WORDS.has(t));
  return filtered.length > 0 ? filtered : rawTokens;
}

/**
 * Checks if a token matches any word in the target text (exact or prefix stem match).
 */
function tokenMatchesWords(token: string, targetWords: string[]): boolean {
  if (token.length === 1) {
    return targetWords.some((w) => w === token || (/^\d+$/.test(token) && w === token) || w.startsWith(token));
  }

  // Match exact word or word-level prefix (e.g. 'фе' -> 'федоров', 'со' -> 'советская')
  if (targetWords.some((w) => w === token || w.startsWith(token))) {
    return true;
  }

  // Check prefix stem for words >= 4 chars (handles Russian grammar endings)
  const stemLen = token.length >= 7 ? token.length - 2 : token.length >= 5 ? token.length - 1 : token.length;
  const stem = token.substring(0, stemLen);

  return targetWords.some((w) => {
    if (stem.length >= 3 && w.startsWith(stem)) return true;
    return false;
  });
}

/**
 * Calculates match score between target text and search query.
 */
export function calculateMatchScore(
  targetText: string | null | undefined,
  query: string,
  queryTokens: string[]
): number {
  if (!targetText || !query) return 0;

  const normTarget = normalizeSearchText(targetText);
  const normQuery = normalizeSearchText(query);

  if (!normTarget || !normQuery) return 0;

  // 1. Exact match
  if (normTarget === normQuery) return 100;

  // 2. Starts with full query
  if (normTarget.startsWith(normQuery)) return 80;

  // 3. Exact substring of full query
  if (normTarget.includes(normQuery)) return 65;

  // 4. Token-level matching
  if (queryTokens.length === 0) return 0;

  const targetWords = normTarget.split(' ').filter((w) => w.length > 0);
  let matchedCount = 0;

  for (const token of queryTokens) {
    if (tokenMatchesWords(token, targetWords)) {
      matchedCount++;
    }
  }

  if (matchedCount === queryTokens.length) {
    return 50; // All tokens matched
  }

  if (matchedCount > 0) {
    return Math.round((matchedCount / queryTokens.length) * 30);
  }

  return 0;
}

/**
 * Thematic aliases for citizen life situations and institutions
 */
const DOMAIN_ALIASES: Record<string, string[]> = {
  'comp-edu': [
    'детский сад', 'садик', 'ясли', 'школа', 'гимназия', 'учеба', 'дети', 'дошкольное', 'первоклассник', 'кружки'
  ],
  'comp-zags': [
    'загс', 'брак', 'свадьба', 'развод', 'расторжение брака', 'рождение', 'свидетельство', 'усыновление', 'отцовство', 'смерть', 'похороны'
  ],
  'comp-zhkh': [
    'жкх', 'капремонт', 'капитальный ремонт', 'текущий ремонт', 'ремонт домов', 'двор', 'отопление', 'водоснабжение', 'мусор', 'тко', 'освещение', 'уборка снега', 'коммуналка', 'жилье', 'подъезд'
  ],
  'comp-arch': [
    'стройка', 'перепланировка', 'разрешение на строительство', 'архитектура', 'реконструкция', 'проект дома', 'градостроительство', 'самострой'
  ],
  'inst-grodno-soviet': [
    'горсовет', 'совет депутатов', 'городской совет', 'депутаты', 'сессия горсовета'
  ],
  'inst-grodno-ispolkom': [
    'горисполком', 'исполком', 'городской исполнительный комитет', 'мэр', 'мэрия', 'руководство города'
  ],
  'term-vns': [
    'внс', 'всебелорусское народное собрание'
  ]
};

export interface ScoredSearchResultItem extends SearchResultItem {
  score: number;
}

/**
 * Universal search executor across all entities in the database state.
 */
export function executeUniversalSearch(
  state: DatabaseState,
  query: string,
  typeFilter?: string
): SearchResultItem[] {
  const normQuery = normalizeSearchText(query);
  if (!normQuery) return [];

  const queryTokens = extractSearchTokens(query);
  const scoredResults: ScoredSearchResultItem[] = [];

  // 1. Search People
  if (!typeFilter || typeFilter === 'person') {
    const people = state.people || [];
    for (const p of people) {
      if (p.status !== 'published') continue;

      const nameScore = calculateMatchScore(p.full_name, query, queryTokens);
      const bioScore = calculateMatchScore(p.biography, query, queryTokens);
      const slugScore = calculateMatchScore(p.slug, query, queryTokens);

      const pPos = state.person_positions?.find((pp) => pp.person_id === p.id && pp.status === 'published');
      const pos = pPos ? state.positions?.find((pos) => pos.id === pPos.position_id) : null;
      const inst = pos?.institution_id ? state.institutions?.find((i) => i.id === pos.institution_id) : null;
      const posScore = pos ? calculateMatchScore(pos.name, query, queryTokens) : 0;

      const pDist = state.person_districts?.find((pd) => pd.person_id === p.id && pd.status === 'published');
      const dist = pDist ? state.electoral_districts?.find((d) => d.id === pDist.district_id) : null;
      const distScore = dist ? calculateMatchScore(dist.name, query, queryTokens) : 0;

      const bestScore = Math.max(nameScore * 1.2, bioScore * 0.7, slugScore * 0.8, posScore * 0.9, distScore * 0.8);

      if (bestScore >= 20) {
        scoredResults.push({
          id: p.id,
          type: 'person',
          title: p.full_name,
          subtitle: pos ? `${pos.name} (${inst?.name || ''})` : (dist ? `Депутат (Округ №${dist.number})` : 'Персона / Депутат'),
          description: p.biography || (pPos?.reception_schedule ? `Приём: ${pPos.reception_schedule}` : undefined),
          url: `/people/${p.slug}`,
          badge: pos?.is_leadership ? 'Руководитель' : 'Депутат',
          score: bestScore,
        });
      }
    }
  }

  // 2. Search Institutions
  if (!typeFilter || typeFilter === 'institution') {
    const institutions = state.institutions || [];
    for (const inst of institutions) {
      if (inst.status !== 'published') continue;

      const nameScore = calculateMatchScore(inst.name, query, queryTokens);
      const officialScore = calculateMatchScore(inst.official_name, query, queryTokens);
      const shortScore = calculateMatchScore(inst.short_name, query, queryTokens);
      const descScore = calculateMatchScore(inst.description, query, queryTokens);
      const addressScore = calculateMatchScore(inst.address, query, queryTokens);

      // Check aliases
      const aliases = DOMAIN_ALIASES[inst.id] || [];
      const aliasScore = aliases.some((a) => calculateMatchScore(a, query, queryTokens) >= 40) ? 75 : 0;

      // Check child departments
      const depts = state.departments?.filter((d) => d.institution_id === inst.id) || [];
      let maxDeptScore = 0;
      for (const d of depts) {
        const dScore = Math.max(
          calculateMatchScore(d.name, query, queryTokens),
          calculateMatchScore(d.description, query, queryTokens)
        );
        if (dScore > maxDeptScore) maxDeptScore = dScore;
      }

      const bestScore = Math.max(
        nameScore * 1.2,
        officialScore * 1.1,
        shortScore * 1.2,
        aliasScore,
        maxDeptScore * 0.9,
        descScore * 0.6,
        addressScore * 0.6
      );

      if (bestScore >= 20) {
        scoredResults.push({
          id: inst.id,
          type: 'institution',
          title: inst.name,
          subtitle: inst.official_name || inst.type,
          description: inst.address ? `${inst.address} ${inst.phone ? '• Тел: ' + inst.phone : ''}` : inst.description,
          url: `/institutions/${inst.slug}`,
          badge: 'Орган власти',
          score: bestScore,
        });
      }
    }
  }

  // 3. Search Electoral Districts & Street Addresses
  if (!typeFilter || typeFilter === 'district') {
    const districts = state.electoral_districts || [];
    for (const d of districts) {
      if (d.status !== 'published') continue;

      const nameScore = calculateMatchScore(d.name, query, queryTokens);
      const numScore = queryTokens.some((t) => t === String(d.number)) ? 70 : 0;
      const descScore = calculateMatchScore(d.boundaries_description, query, queryTokens);

      const pDist = state.person_districts?.find((pd) => pd.district_id === d.id && pd.status === 'published');
      const person = pDist ? state.people?.find((p) => p.id === pDist.person_id) : null;
      const personScore = person ? calculateMatchScore(person.full_name, query, queryTokens) : 0;

      const bestScore = Math.max(nameScore * 1.1, numScore, descScore * 0.9, personScore * 0.8);

      if (bestScore >= 20) {
        let streetSnippet = d.boundaries_description;
        if (queryTokens.length > 0 && d.boundaries_description) {
          const lowerDesc = normalizeSearchText(d.boundaries_description);
          const firstToken = queryTokens[0];
          const matchIdx = lowerDesc.indexOf(firstToken);
          if (matchIdx !== -1) {
            const start = Math.max(0, matchIdx - 30);
            const end = Math.min(d.boundaries_description.length, matchIdx + firstToken.length + 50);
            streetSnippet = (start > 0 ? '...' : '') + d.boundaries_description.substring(start, end) + (end < d.boundaries_description.length ? '...' : '');
          }
        }

        scoredResults.push({
          id: d.id,
          type: 'district',
          title: `Округ №${d.number}: ${d.name}`,
          subtitle: person ? `Депутат: ${person.full_name}` : `Избирательный округ (${d.level})`,
          description: streetSnippet,
          url: `/districts/${d.slug}`,
          badge: 'Округ',
          score: bestScore,
        });
      }
    }
  }

  // 4. Search Competences & Life Situations
  if (!typeFilter || typeFilter === 'competence') {
    const competences = state.competences || [];
    for (const c of competences) {
      if (c.status !== 'published') continue;

      const nameScore = calculateMatchScore(c.name, query, queryTokens);
      const descScore = calculateMatchScore(c.description, query, queryTokens);
      const catScore = calculateMatchScore(c.category, query, queryTokens);
      const legalScore = calculateMatchScore(c.legal_basis, query, queryTokens);

      const aliases = DOMAIN_ALIASES[c.id] || [];
      const aliasScore = aliases.some((a) => calculateMatchScore(a, query, queryTokens) >= 40) ? 80 : 0;

      const dept = c.department_id ? state.departments?.find((d) => d.id === c.department_id) : null;
      const deptScore = dept ? calculateMatchScore(dept.name, query, queryTokens) : 0;

      const inst = c.institution_id ? state.institutions?.find((i) => i.id === c.institution_id) : null;

      const bestScore = Math.max(nameScore * 1.2, aliasScore, descScore * 0.8, catScore * 0.9, deptScore * 0.9, legalScore * 0.5);

      if (bestScore >= 20) {
        scoredResults.push({
          id: c.id,
          type: 'competence',
          title: c.name,
          subtitle: inst ? `Орган: ${inst.name}` : c.category,
          description: c.description,
          url: `/competences/${c.slug}`,
          badge: 'Вопрос / Компетенция',
          score: bestScore,
        });
      }
    }
  }

  // 5. Search Glossary
  if (!typeFilter || typeFilter === 'glossary') {
    const glossaryTerms = state.glossary_terms || [];
    for (const g of glossaryTerms) {
      const termScore = calculateMatchScore(g.term, query, queryTokens);
      const shortScore = calculateMatchScore(g.short_definition, query, queryTokens);
      const fullScore = calculateMatchScore(g.full_explanation, query, queryTokens);
      const catScore = calculateMatchScore(g.category_label, query, queryTokens);
      const exScore = calculateMatchScore(g.examples, query, queryTokens);

      const aliases = DOMAIN_ALIASES[g.id] || [];
      const aliasScore = aliases.some((a) => calculateMatchScore(a, query, queryTokens) >= 40) ? 85 : 0;

      const relatedScore = (g.related_terms || []).some((r) => calculateMatchScore(r, query, queryTokens) >= 40) ? 60 : 0;

      const bestScore = Math.max(termScore * 1.3, aliasScore, shortScore * 0.9, catScore * 0.8, relatedScore, fullScore * 0.6, exScore * 0.6);

      if (bestScore >= 20) {
        scoredResults.push({
          id: g.id,
          type: 'glossary' as any,
          title: g.term,
          subtitle: g.category_label,
          description: g.short_definition,
          url: `/glossary#${g.slug}`,
          badge: 'Термин / Глоссарий',
          score: bestScore,
        });
      }
    }
  }

  // 6. Search Territories
  if (!typeFilter || typeFilter === 'territory') {
    const territories = state.territories || [];
    for (const t of territories) {
      if (t.status !== 'published') continue;

      const nameScore = calculateMatchScore(t.name, query, queryTokens);
      const officialScore = calculateMatchScore(t.official_name, query, queryTokens);
      const descScore = calculateMatchScore(t.description, query, queryTokens);

      const bestScore = Math.max(nameScore * 1.2, officialScore * 1.1, descScore * 0.6);

      if (bestScore >= 20) {
        scoredResults.push({
          id: t.id,
          type: 'territory',
          title: t.name,
          subtitle: `Территория (${t.type})`,
          description: t.description,
          url: `/territories/${t.slug}`,
          badge: 'Территория',
          score: bestScore,
        });
      }
    }
  }

  // Sort by score descending and return stripped items
  scoredResults.sort((a, b) => b.score - a.score);

  return scoredResults.map(({ score, ...item }) => item);
}
