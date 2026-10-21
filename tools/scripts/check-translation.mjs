import path from 'node:path';
import fs from 'node:fs';
import {
  fileExists,
  printSummary,
  readdirSafe,
  readFileSafe,
  workspaceRoot,
} from './shared.mjs';

const errors = [];
const warnings = [];

const REQUIRED_LOCALES = ['en-US', 'pt-BR', 'es-419'];
const LEGACY_LOCALE_KEYS = [`'es'`, `"es"`, `'es':`, `"es":`];
const FORBIDDEN_CONSTS = [
  'SOLARIS_TRANSLATE_EN_US',
  'SOLARIS_TRANSLATE_PT_BR',
  'SOLARIS_TRANSLATE_ES',
];

function findTranslationDirs() {
  const roots = ['packages/angular/src/lib', 'apps/showcase/src/app'];
  // Fase 3: o agregador central (lib/i18n) não carrega dicionários próprios —
  // ele importa os pacotes de components/**/translation e faz merge profundo.
  // Não validar a pasta do serviço como pacote de dicionário.
  const skipped = new Set([
    path.normalize('packages/angular/src/lib/services/translation'),
  ]);
  const found = [];
  function walk(dir) {
    for (const entry of readdirSafe(dir)) {
      const fullPath = path.join(dir, entry.name);
      if (!entry.isDirectory()) continue;
      if (entry.name === 'node_modules' || entry.name.startsWith('.')) continue;
      if (entry.name === 'translation') {
        if (skipped.has(path.normalize(fullPath))) {
          walk(fullPath);
          continue;
        }
        found.push(fullPath);
        continue;
      }
      walk(fullPath);
    }
  }
  for (const root of roots) {
    if (fileExists(root)) walk(root);
  }
  return found;
}

function findAllowlist(dir) {
  let current = path.join(workspaceRoot, dir);

  while (current.startsWith(workspaceRoot)) {
    const candidate = path.join(current, 'translation-terms.allowlist.json');
    if (fs.existsSync(candidate)) return candidate;
    const parent = path.dirname(current);
    if (parent === current) break;
    current = parent;
  }
  return null;
}

function flattenTranslations(tree, prefix = '', out = {}) {
  if (typeof tree === 'string') {
    out[prefix] = tree;
    return out;
  }
  for (const [key, value] of Object.entries(tree)) {
    flattenTranslations(value, prefix ? `${prefix}.${key}` : key, out);
  }
  return out;
}

const translationDirs = findTranslationDirs();

if (translationDirs.length === 0) {
  warnings.push(
    'No translation/ folders found yet — skipping dictionary checks.',
  );
} else {
  for (const dir of translationDirs) {
    const maps = {};
    for (const locale of REQUIRED_LOCALES) {
      const file = path.join(dir, `${locale}.json`);
      if (!fileExists(file)) {
        errors.push(
          `Missing dictionary: ${file} (each translation/ folder must ship en-US, pt-BR and es-419).`,
        );
        continue;
      }
      try {
        maps[locale] = flattenTranslations(JSON.parse(readFileSafe(file)));
      } catch {
        errors.push(`Invalid JSON: ${file}.`);
      }
    }

    const locales = Object.keys(maps);
    if (locales.length === REQUIRED_LOCALES.length) {
      for (const locale of REQUIRED_LOCALES) {
        for (const [key, value] of Object.entries(maps[locale])) {
          if (typeof value === 'string' && value.startsWith('@:')) {
            errors.push(
              `${dir}/${locale}.json key '${key}' uses a link ('${value}'). Dictionaries carry literal values only — repeat the text instead of linking.`,
            );
          }
        }
      }
      const base = new Set(Object.keys(maps['en-US']));
      for (const locale of ['pt-BR', 'es-419']) {
        const keys = new Set(Object.keys(maps[locale]));
        for (const key of base) {
          if (!keys.has(key)) {
            errors.push(
              `${dir}/${locale}.json is missing key '${key}' present in en-US.json.`,
            );
          }
        }
        for (const key of keys) {
          if (!base.has(key)) {
            errors.push(
              `${dir}/${locale}.json has extra key '${key}' not present in en-US.json.`,
            );
          }
        }
      }

      // Allowlist: values identical to en-US must be declared.
      const allowlistFile = findAllowlist(dir);
      let allowlist = [];
      if (allowlistFile) {
        try {
          allowlist = JSON.parse(fs.readFileSync(allowlistFile, 'utf-8'));
        } catch {
          errors.push(`Invalid allowlist JSON: ${allowlistFile}.`);
        }
      }
      const allowed = new Set(allowlist);
      for (const locale of ['pt-BR', 'es-419']) {
        for (const key of base) {
          if (
            maps[locale][key] === maps['en-US'][key] &&
            !allowed.has(maps['en-US'][key])
          ) {
            errors.push(
              `${dir}/${locale}.json key '${key}' repeats the en-US value without allowlist entry (${JSON.stringify(maps['en-US'][key])}). Add it to translation-terms.allowlist.json or translate it.`,
            );
          }
        }
      }
    }
  }
}

function walkTs(dir, callback) {
  for (const entry of readdirSafe(dir)) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name === 'node_modules' || entry.name.startsWith('.')) continue;
      walkTs(fullPath, callback);
    } else if (entry.name.endsWith('.ts') && !entry.name.endsWith('.spec.ts')) {
      callback(fullPath);
    }
  }
}

for (const root of ['packages/angular/src/lib/services/translation']) {
  if (!fileExists(root)) continue;
  walkTs(root, (file) => {
    const content = readFileSafe(file);
    for (const name of FORBIDDEN_CONSTS) {
      if (content.includes(name)) {
        errors.push(
          `${file} references forbidden dictionary const ${name}. Dictionaries live in translation/*.json now.`,
        );
      }
    }
  });
}

const serviceFiles = [
  'packages/angular/src/lib/services/translation/model/solaris-locale.types.ts',
  'packages/angular/src/lib/services/translation/model/solaris-translate-defaults.ts',
];
for (const file of serviceFiles) {
  if (!fileExists(file)) continue;
  const lines = readFileSafe(file).split('\n');
  lines.forEach((line, i) => {
    const trimmed = line.trim();
    if (trimmed.startsWith('//') || trimmed.startsWith('*')) return;
    for (const legacy of LEGACY_LOCALE_KEYS) {
      if (line.includes(legacy) && !line.includes('es-419')) {
        errors.push(
          `${file}:${i + 1} uses legacy 'es' locale key. Canonical Spanish locale is 'es-419'.`,
        );
      }
    }
  });
}

const result = printSummary('Translation Check', errors, warnings);
process.exitCode = result.errorCount > 0 ? 1 : 0;
