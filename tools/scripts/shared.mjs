import path from 'node:path';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
export const workspaceRoot = path.resolve(__dirname, '..', '..');

export function readJson(filePath) {
  const resolved = path.isAbsolute(filePath)
    ? filePath
    : path.join(workspaceRoot, filePath);
  return JSON.parse(fs.readFileSync(resolved, 'utf-8'));
}

export function fileExists(filePath) {
  const resolved = path.isAbsolute(filePath)
    ? filePath
    : path.join(workspaceRoot, filePath);
  try {
    fs.accessSync(resolved, fs.constants.F_OK);
    return true;
  } catch {
    return false;
  }
}

export function readdirSafe(dirPath) {
  const resolved = path.isAbsolute(dirPath)
    ? dirPath
    : path.join(workspaceRoot, dirPath);
  try {
    return fs.readdirSync(resolved, { withFileTypes: true });
  } catch {
    return [];
  }
}

export function walkFilesByExtension(dir, ext, out = []) {
  if (!fs.existsSync(dir)) return out;
  for (const entry of fs.readdirSync(dir)) {
    const full = path.join(dir, entry);
    if (fs.statSync(full).isDirectory()) {
      walkFilesByExtension(full, ext, out);
    } else if (entry.endsWith(ext)) {
      out.push(full);
    }
  }
  return out;
}

export function readFileSafe(filePath) {
  const resolved = path.isAbsolute(filePath)
    ? filePath
    : path.join(workspaceRoot, filePath);
  try {
    return fs.readFileSync(resolved, 'utf-8');
  } catch {
    return '';
  }
}

export function findFilesRecursive(dirPath, pattern, maxDepth = 5) {
  const resolved = path.isAbsolute(dirPath)
    ? dirPath
    : path.join(workspaceRoot, dirPath);
  const results = [];
  function walk(dir, depth) {
    if (depth > maxDepth) return;
    const entries = readdirSafe(dir);
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        walk(fullPath, depth + 1);
      } else if (pattern.test(entry.name)) {
        results.push(fullPath);
      }
    }
  }
  walk(resolved, 0);
  return results;
}

export function printSummary(label, errors, warnings) {
  console.log(`\n=== ${label} ===`);
  if (errors.length === 0 && warnings.length === 0) {
    console.log('  No issues found.');
    return { errorCount: 0, warningCount: 0 };
  }
  if (errors.length > 0) {
    console.log(`  Errors (${errors.length}):`);
    for (const e of errors) {
      console.log(`    [ERROR] ${e}`);
    }
  }
  if (warnings.length > 0) {
    console.log(`  Warnings (${warnings.length}):`);
    for (const w of warnings) {
      console.log(`    [WARN] ${w}`);
    }
  }
  return { errorCount: errors.length, warningCount: warnings.length };
}

export const FORBIDDEN_LOCKFILES = [
  { file: 'package-lock.json', name: 'npm' },
  { file: 'yarn.lock', name: 'Yarn' },
  { file: 'bun.lockb', name: 'Bun' },
];

export function findForbiddenLockfiles() {
  return FORBIDDEN_LOCKFILES.filter(({ file }) => fileExists(file));
}

export function lockfileErrorMessage({ file, name }) {
  return `Found ${file} — ${name} lock file detected. Solaris requires pnpm. Delete ${file} and use pnpm install.`;
}

export function packageManagerFieldErrors(pkg) {
  if (!pkg?.packageManager) {
    return [
      'Missing "packageManager" field in package.json. Add: "packageManager": "pnpm@9.x.x" (use the installed pnpm version)',
    ];
  }
  if (!pkg.packageManager.startsWith('pnpm')) {
    return [
      `"packageManager" in package.json is "${pkg.packageManager}" — must be "pnpm@<version>"`,
    ];
  }
  return [];
}

export function hasExceptionNearby(lines, index, token, window = 5) {
  return lines
    .slice(Math.max(0, index - window), index + 1)
    .some((l) => l.includes(token));
}

export function collectFiles(rootRel, pattern, options = {}) {
  const { excludeDirs = ['node_modules'], excludeFiles = [] } = options;
  const resolved = path.isAbsolute(rootRel)
    ? rootRel
    : path.join(workspaceRoot, rootRel);
  const results = [];
  function walk(dir) {
    let entries;
    try {
      entries = fs.readdirSync(dir, { withFileTypes: true });
    } catch {
      return;
    }
    for (const entry of entries) {
      if (entry.name.startsWith('.')) continue;
      if (entry.isDirectory()) {
        if (excludeDirs.includes(entry.name)) continue;
        walk(path.join(dir, entry.name));
      } else if (pattern.test(entry.name)) {
        const fullPath = path.join(dir, entry.name);
        if (excludeFiles.some((re) => re.test(entry.name))) continue;
        results.push(
          path.relative(workspaceRoot, fullPath).split(path.sep).join('/'),
        );
      }
    }
  }
  walk(resolved);
  return results;
}
