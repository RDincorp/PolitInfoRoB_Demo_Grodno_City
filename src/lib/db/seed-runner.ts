import { DBRepository } from './index';
import { initialSeedData } from './seed';

export function runSeed() {
  console.log('Seeding initial data...');
  DBRepository.seed(initialSeedData);
  console.log('Database initialized successfully with Republic of Belarus and Grodno pilot data.');
}

runSeed();
