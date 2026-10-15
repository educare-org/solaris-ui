import path from 'node:path';
import fs from 'node:fs';
import {
  workspaceRoot,
  fileExists,
  readFileSafe,
  printSummary,
} from './shared.mjs';

const errors = [];
const warnings = [];

const libDir = 'packages/angular/src/lib';

if (!fileExists(libDir)) {
  warnings.push(
    `${libDir} does not exist yet — i18n validation skipped (expected during early setup).`,
  );
  const result = printSummary('I18n Check', errors, warnings);
  process.exitCode = result.errorCount > 0 ? 1 : 0;
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
        if (
          !entry.name.endsWith('.spec') &&
          !entry.name.endsWith('.test') &&
          entry.name !== 'testing'
        ) {
          walk(fullPath);
        }
      } else if (/\.(ts|html)$/.test(entry.name)) {
        if (
          entry.name.endsWith('.spec.ts') ||
          entry.name.endsWith('.test.ts') ||
          entry.name.endsWith('.stories.ts') ||
          entry.name === 'solaris-translate-defaults.ts'
        ) {
          continue;
        }
        files.push(fullPath);
      }
    }
  }
  walk(libDir);

  for (const file of files) {
    const content = readFileSafe(file);
    const lines = content.split('\n');
    const isTemplate = file.endsWith('.html');

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

      if (isTemplate) {
        const textMatch = trimmed.match(
          />([A-Za-z\u00C0-\u024F]{3,40})<\/[a-z]/,
        );
        if (
          textMatch &&
          !trimmed.includes('{{') &&
          !trimmed.includes('| translate') &&
          !trimmed.includes('[innerText]') &&
          !trimmed.includes('[innerHTML]')
        ) {
          const text = textMatch[1].trim();
          if (
            text.length > 3 &&
            /[A-Za-z]{3,}/.test(text) &&
            ![
              'div',
              'span',
              'class',
              'style',
              'true',
              'false',
              'null',
              'undefined',
              'this',
              'that',
            ].includes(text.toLowerCase())
          ) {
            warnings.push(
              `${file}:${lineNum}: Possible hardcoded text "${text.substring(0, 40)}" in template. Use i18n pipes/directives or translation keys instead.`,
            );
          }
        }
      } else if (
        trimmed.includes('label:') ||
        trimmed.includes("label '") ||
        trimmed.includes('label "') ||
        trimmed.includes('title:') ||
        trimmed.includes("title '") ||
        trimmed.includes('title "') ||
        trimmed.includes('placeholder:') ||
        trimmed.includes("placeholder '") ||
        trimmed.includes('placeholder "') ||
        trimmed.includes('ariaLabel:') ||
        trimmed.includes("ariaLabel '") ||
        trimmed.includes('ariaLabel "') ||
        trimmed.includes('aria-label') ||
        trimmed.includes('ariaLabel')
      ) {
        const window = lines.slice(Math.max(0, i - 2), i + 3).join('\n');
        if (
          window.includes('labelKey') ||
          window.includes('titleKey') ||
          window.includes('placeholderKey') ||
          window.includes('ariaLabelKey') ||
          window.includes('LabelKey') ||
          window.includes('TitleKey')
        ) {
          continue;
        }
        if (
          !trimmed.includes('Key') &&
          !trimmed.includes('translate') &&
          !trimmed.includes('LabelKey') &&
          !trimmed.includes('TitleKey')
        ) {
          const stringMatch = trimmed.match(
            /['"]([A-Za-z\u00C0-\u024F ]{5,})['"]/,
          );
          if (stringMatch) {
            const text = stringMatch[1];
            if (
              text.length > 5 &&
              !text.startsWith('@') &&
              !text.startsWith('solaris-') &&
              !text.startsWith('cdk-')
            ) {
              warnings.push(
                `${file}:${lineNum}: Possible hardcoded user-facing text "${text.substring(0, 40)}". Use translation keys and the key/dual pattern (e.g., label + labelKey).`,
              );
            }
          }
        }
      }
    }
  }

  const result = printSummary('I18n Check', errors, warnings);
  process.exitCode = result.errorCount > 0 ? 1 : 0;
}
