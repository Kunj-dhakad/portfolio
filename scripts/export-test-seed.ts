import { mkdirSync, writeFileSync } from 'node:fs';
import { sampleEntries, defaults } from '../src/data/content';
mkdirSync('.local-test', { recursive: true });
writeFileSync(
  '.local-test/seed-export.mjs',
  `export const sampleEntries = ${JSON.stringify(sampleEntries)};\nexport const defaults = ${JSON.stringify(defaults)};\n`,
);
