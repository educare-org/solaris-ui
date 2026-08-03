import { cpSync, readdirSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';

const source = 'packages/angular/schematics';
const dest = 'dist/packages/angular/schematics';

function copyJson(dir) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) {
      copyJson(full);
    } else if (entry.name.endsWith('.json')) {
      const rel = relative(source, full);
      cpSync(full, join(dest, rel));
    }
  }
}

copyJson(source);
console.log('Copied schematics JSON files to dist.');
