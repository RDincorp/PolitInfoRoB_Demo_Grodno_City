import { describe, it, expect } from 'vitest';
import { DiffEngine } from '@/lib/ingestion/diff/diff-engine';

describe('Diff Engine Module', () => {
  it('detects no changes when objects are identical', () => {
    const existing = { full_name: 'Фёдоров Олег Геннадьевич', phone: '+375 (152) 62-60-50' };
    const incoming = { full_name: 'Фёдоров Олег Геннадьевич', phone: '+375 (152) 62-60-50' };

    const diff = DiffEngine.compareEntities(existing, incoming);
    expect(diff.hasChanges).toBe(false);
    expect(diff.changeType).toBe('none');
  });

  it('detects field-level updates and returns diff summary', () => {
    const existing = { full_name: 'Белявский Александр Сергеевич', reception_schedule: 'Второй вторник 16:00-18:00' };
    const incoming = { full_name: 'Белявский Александр Сергеевич', reception_schedule: 'Второй и четвертый вторник 16:00-19:00' };

    const diff = DiffEngine.compareEntities(existing, incoming);
    expect(diff.hasChanges).toBe(true);
    expect(diff.changeType).toBe('update');
    expect(diff.diffSummary.reception_schedule).toBeDefined();
    expect(diff.diffSummary.reception_schedule.old).toBe('Второй вторник 16:00-18:00');
    expect(diff.diffSummary.reception_schedule.new).toBe('Второй и четвертый вторник 16:00-19:00');
  });

  it('identifies duplicate candidates via Levenshtein string similarity', () => {
    expect(DiffEngine.isDuplicateCandidate('Фёдоров Олег Геннадьевич', 'Федоров Олег Геннадьевич', 0.85)).toBe(true);
    expect(DiffEngine.isDuplicateCandidate('Иванов Иван Иванович', 'Петров Петр Петрович', 0.85)).toBe(false);
  });
});
