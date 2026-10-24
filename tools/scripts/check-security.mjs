import path from 'node:path';
import fs from 'node:fs';
import {
  workspaceRoot,
  fileExists,
  readFileSafe,
  printSummary,
} from './shared.mjs';

const configPath = path.join(
  workspaceRoot,
  'tools',
  'config',
  'security-rules.json',
);
const config = JSON.parse(fs.readFileSync(configPath, 'utf-8'));
const rules = config.dangerousPatterns;
const INLINE_EXCEPTION_COMMENT = 'SECURITY_EXCEPTION';

const errors = [];
const warnings = [];

const libDir = 'packages/angular/src/lib';

if (!fileExists(libDir)) {
  warnings.push(
    `${libDir} does not exist yet — security validation partially skipped (expected during early setup).`,
  );
} else {
  const files = [];
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
      } else if (
        /\.(ts|html)$/.test(entry.name) &&
        !entry.name.endsWith('.spec.ts') &&
        !entry.name.endsWith('.test.ts')
      ) {
        files.push(fullPath);
      }
    }
  }
  walk(libDir);

  for (const file of files) {
    const content = readFileSafe(file);
    const lines = content.split('\n');

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      const lineNum = i + 1;
      const trimmed = line.trim();

      if (
        trimmed.startsWith('//') ||
        trimmed.startsWith('/*') ||
        trimmed.startsWith('*') ||
        trimmed.startsWith('<!--')
      ) {
        continue;
      }

      const hasException = lines
        .slice(Math.max(0, i - 5), i + 1)
        .some((l) => l.includes(INLINE_EXCEPTION_COMMENT));

      if (hasException) continue;

      for (const rule of rules) {
        const regex = new RegExp(rule.pattern);
        if (regex.test(trimmed)) {
          errors.push(
            `${file}:${lineNum}: Found dangerous pattern "${rule.pattern}" — ${rule.reason}.\n` +
              `  If this is justified, add a comment with "${rule.allowedExceptionComment}:" above with reason.`,
          );
        }
      }
    }
  }
}

const result = printSummary('Security Check', errors, warnings);
process.exitCode = result.errorCount > 0 ? 1 : 0;
