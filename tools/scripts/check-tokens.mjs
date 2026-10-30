import path from 'node:path';
import fs from 'node:fs';
import {
  workspaceRoot,
  fileExists,
  readFileSafe,
  printSummary,
  collectFiles,
  hasExceptionNearby,
} from './shared.mjs';

const configPath = path.join(
  workspaceRoot,
  'tools',
  'config',
  'token-rules.json',
);
const rules = JSON.parse(fs.readFileSync(configPath, 'utf-8'));

const errors = [];
const warnings = [];

const libScssDir = 'packages/angular/src/lib';
const stylesScssDir = 'packages/angular/src/styles';
const scanDirs = [libScssDir, stylesScssDir].filter((dir) => fileExists(dir));

if (scanDirs.length === 0) {
  warnings.push(
    'packages/angular/src/lib and packages/angular/src/styles do not exist yet — token validation partially skipped (expected during early setup).',
  );
  const result = printSummary('Tokens Check', errors, warnings);
  process.exitCode = result.errorCount > 0 ? 1 : 0;
} else {
  const scssFiles = scanDirs.flatMap((dir) => collectFiles(dir, /\.scss$/));

  if (scssFiles.length === 0) {
    warnings.push(
      'No SCSS files found in packages/angular/src/lib or packages/angular/src/styles — token validation skipped',
    );
  } else {
    for (const file of scssFiles) {
      if (file.includes('/token/')) continue;
      const content = readFileSafe(file);
      const lines = content.split('\n');

      for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        const lineNum = i + 1;
        const trimmed = line.trim();

        for (const rule of rules.patterns) {
          const regex = new RegExp(rule.pattern, 'i');
          if (regex.test(trimmed)) {
            if (hasExceptionNearby(lines, i, rule.exceptionComment, 10))
              continue;
            errors.push(
              `${file}:${lineNum}: ${trimmed.substring(0, 80)} — ${rule.reason}. Add a "${rule.exceptionComment}: <reason>" On a comment line right above if this is justified.`,
            );
          }
        }
      }
    }
  }

  const result = printSummary('Tokens Check', errors, warnings);
  process.exitCode = result.errorCount > 0 ? 1 : 0;
}
