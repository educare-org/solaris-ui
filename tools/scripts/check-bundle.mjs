import path from 'node:path';
import fs from 'node:fs';
import {
  workspaceRoot,
  fileExists,
  readJson,
  printSummary,
} from './shared.mjs';

const errors = [];
const warnings = [];

const distDir = path.join(workspaceRoot, 'dist/packages/angular');
const baselineFile = path.join(
  workspaceRoot,
  'tools/config/bundle-baseline.json',
);

function getDirSize(dir) {
  let total = 0;
  try {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        total += getDirSize(fullPath);
      } else if (entry.isFile()) {
        total += fs.statSync(fullPath).size;
      }
    }
  } catch {
    return null;
  }
  return total;
}

if (!fileExists(distDir)) {
  warnings.push('dist/packages/angular not found. Run "pnpm build:lib" first.');
  const result = printSummary('Bundle Size Check', errors, warnings);
  process.exitCode = result.errorCount > 0 ? 1 : 0;
} else {
  const currentSize = getDirSize(distDir);

  if (fileExists(baselineFile)) {
    const baseline = readJson(baselineFile);
    const baselineSize = baseline.size;

    if (currentSize === null) {
      errors.push('Could not calculate bundle size.');
    } else {
      const diff = currentSize - baselineSize;
      const percentChange = (diff / baselineSize) * 100;
      const fmt = (bytes) => {
        if (bytes > 1048576) return `${(bytes / 1048576).toFixed(2)} MB`;
        if (bytes > 1024) return `${(bytes / 1024).toFixed(2)} KB`;
        return `${bytes} B`;
      };

      console.log(`  Current: ${fmt(currentSize)}`);
      console.log(`  Baseline: ${fmt(baselineSize)}`);
      console.log(
        `  Change: ${diff > 0 ? '+' : ''}${fmt(diff)} (${percentChange.toFixed(2)}%)`,
      );

      if (percentChange > 25) {
        errors.push(
          `Bundle size increased by ${percentChange.toFixed(2)}% (exceeds 25% threshold).`,
        );
        errors.push('  → Review what was added and consider tree-shaking.');
      } else if (percentChange > 10) {
        warnings.push(
          `Bundle size increased by ${percentChange.toFixed(2)}% (exceeds 10% warning threshold).`,
        );
      }
    }
  } else if (currentSize !== null) {
    fs.mkdirSync(path.dirname(baselineFile), { recursive: true });
    fs.writeFileSync(
      baselineFile,
      JSON.stringify({ size: currentSize }, null, 2),
    );
    const fmt = (bytes) => {
      if (bytes > 1048576) return `${(bytes / 1048576).toFixed(2)} MB`;
      if (bytes > 1024) return `${(bytes / 1024).toFixed(2)} KB`;
      return `${bytes} B`;
    };
    console.log(`  Baseline created: ${fmt(currentSize)}`);
    warnings.push(
      'Baseline created. Commit the baseline file to track future changes.',
    );
  }
}

const result = printSummary('Bundle Size Check', errors, warnings);
process.exitCode = result.errorCount > 0 ? 1 : 0;
