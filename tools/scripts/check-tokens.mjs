import path from 'node:path';
import fs from 'node:fs';
import {
  workspaceRoot,
  fileExists,
  readdirSafe,
  readFileSafe,
  printSummary,
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

if (!fileExists(libScssDir)) {
  warnings.push(
    `${libScssDir} does not exist yet — token validation partially skipped (expected during early setup).`,
  );
  const result = printSummary('Tokens Check', errors, warnings);
  process.exitCode = result.errorCount > 0 ? 1 : 0;
} else {
  const scssFiles = [];
  function walk(dir) {
    const resolved = path.join(workspaceRoot, dir);
    let entries;
    try {
      entries = fs.readdirSync(resolved, { withFileTypes: true });
    } catch {
      return;
    }
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        walk(fullPath);
      } else if (entry.name.endsWith('.scss')) {
        scssFiles.push(fullPath);
      }
    }
  }
  walk(libScssDir);

  if (scssFiles.length === 0) {
    warnings.push(
      'No SCSS files found in packages/angular/src/lib — token validation skipped',
    );
  } else {
    for (const file of scssFiles) {
      if (file.includes('/token/') || file.includes('\\token\\')) continue;
      const content = readFileSafe(file);
      const lines = content.split('\n');

      for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        const lineNum = i + 1;
        const trimmed = line.trim();

        const hasException = lines
          .slice(Math.max(0, i - 10), i + 1)
          .some((l) => l.includes(rules.patterns[0].exceptionComment));

        for (const rule of rules.patterns) {
          const regex = new RegExp(rule.pattern, 'i');
          if (regex.test(trimmed)) {
            if (hasException) continue;
            errors.push(
              `${file}:${lineNum}: ${trimmed.substring(0, 80)} — ${rule.reason}. Add a "${rule.exceptionComment}: <reason>" on a comment line right above if this is justified.`,
            );
          }
        }
      }
    }
  }

  const result = printSummary('Tokens Check', errors, warnings);
  process.exitCode = result.errorCount > 0 ? 1 : 0;
}
