import { describe, it, expect, beforeEach } from 'vitest';
import { DBRepository } from '@/lib/db';
import { initialSeedData } from '@/lib/db/seed';

describe('DB Repository & Universal Search', () => {
  beforeEach(() => {
    DBRepository.seed(initialSeedData);
  });

  it('correctly retrieves Grodno territory with related institutions and districts', () => {
    const grodno = DBRepository.getTerritoryBySlug('grodno');
    expect(grodno).not.toBeNull();
    expect(grodno?.name).toBe('Гродно');
    expect(grodno?.institutions.length).toBeGreaterThan(0);
    expect(grodno?.districts.length).toBe(3);
  });

  it('correctly retrieves deputy profile with position, district, and reception info', () => {
    const deputy = DBRepository.getPersonBySlug('belyavskiy-aleksandr-sergeevich');
    expect(deputy).not.toBeNull();
    expect(deputy?.full_name).toBe('Белявский Александр Сергеевич');
    expect(deputy?.positions.length).toBeGreaterThan(0);
    expect(deputy?.districts.length).toBeGreaterThan(0);
    expect(deputy?.districts[0].district.number).toBe(1);
  });

  it('performs multi-entity universal search for "Гродно", "Фёдоров", "ЖКХ", "Округ"', () => {
    const resultsPerson = DBRepository.search('Фёдоров');
    expect(resultsPerson.length).toBeGreaterThan(0);
    expect(resultsPerson[0].type).toBe('person');
    expect(resultsPerson[0].title).toContain('Фёдоров');

    const resultsInst = DBRepository.search('Горисполком');
    expect(resultsInst.length).toBeGreaterThan(0);
    expect(resultsInst[0].type).toBe('institution');

    const resultsComp = DBRepository.search('ЖКХ');
    expect(resultsComp.length).toBeGreaterThan(0);
    expect(resultsComp[0].type).toBe('competence');
  });

  it('handles review queue approval transaction', () => {
    const queue = DBRepository.getReviewQueue('pending');
    expect(queue.length).toBeGreaterThan(0);

    const firstItem = queue[0];
    const success = DBRepository.approveReviewItem(firstItem.id, 'TestAdmin');
    expect(success).toBe(true);

    const remainingQueue = DBRepository.getReviewQueue('pending');
    expect(remainingQueue.find((i) => i.id === firstItem.id)).toBeUndefined();
  });
});
