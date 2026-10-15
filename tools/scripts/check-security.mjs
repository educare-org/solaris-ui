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
const fileLevelExceptionComment = config.fileLevelExceptionComment;
const INLINE_EXCEPTION_COMMENT = 'SECURITY_EXCEPTION';

const ledgerPath = path.join(
  workspaceRoot,
  'tools',
  'config',
  'security-allowlist.json',
);
let ledger = {};
if (fileExists(ledgerPath)) {
  try {
    ledger = JSON.parse(fs.readFileSync(ledgerPath, 'utf-8'));
  } catch {
    ledger = {};
  }
}

const errors = [];
const warnings = [];

const libDir = 'packages/angular/src/lib';

function toPosix(p) {
  return p.replaceAll('\\', '/');
}

function countFlaggedLines(lines) {
  let count = 0;
  for (const element of lines) {
    const trimmed = element.trim();
    if (
      trimmed.startsWith('//') ||
      trimmed.startsWith('/*') ||
      trimmed.startsWith('*')
    ) {
      continue;
    }
    for (const rule of rules) {
      if (new RegExp(rule.pattern).test(trimmed)) {
        count += 1;
        break;
      }
    }
  }
  return count;
}

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
    const key = toPosix(file);

    if (content.includes(fileLevelExceptionComment)) {
      const flagged = countFlaggedLines(lines);
      const entry = ledger[key];
      if (!entry) {
        errors.push(
          `${file}: uses "${fileLevelExceptionComment}" but has no entry in ` +
            `tools/config/security-allowlist.json — review the header comment ` +
            `(justification, safer alternatives, tests) and add the ledger entry.`,
        );
      } else if (flagged > entry.patterns) {
        errors.push(
          `${file}: dangerous-pattern count rose ${entry.patterns} → ${flagged} ` +
            `since ledger review (${entry.reviewed}). Justify the new usage or ` +
            `remove it; then update the ledger.`,
        );
      } else if (flagged < entry.patterns) {
        warnings.push(
          `${file}: dangerous-pattern count dropped ${entry.patterns} → ${flagged} ` +
            `— update the ledger entry to the new count.`,
        );
      }
      continue;
    }

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      const lineNum = i + 1;
      const trimmed = line.trim();

      if (
        trimmed.startsWith('//') ||
        trimmed.startsWith('/*') ||
        trimmed.startsWith('*')
      ) {
        continue;
      }

      const hasException = lines
        .slice(Math.max(0, i - 2), i + 1)
        .some((l) => l.includes(INLINE_EXCEPTION_COMMENT));

      if (hasException) continue;

      for (const rule of rules) {
        const regex = new RegExp(rule.pattern);
        if (regex.test(trimmed)) {
          errors.push(
            `${file}:${lineNum}: Found dangerous pattern "${rule.pattern}" — ${rule.reason}.\n` +
              `  If this is justified, add a comment with "${rule.allowedExceptionComment}:" above with reason, safer alternative considered, and tests.`,
          );
        }
      }
    }
  }

  for (const key of Object.keys(ledger)) {
    if (!fileExists(key)) {
      warnings.push(
        `${key}: ledger entry is orphaned (file no longer exists) — remove it.`,
      );
    }
  }
}

const result = printSummary('Security Check', errors, warnings);
process.exitCode = result.errorCount > 0 ? 1 : 0;
