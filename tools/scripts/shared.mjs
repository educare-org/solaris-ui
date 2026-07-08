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

export function mkdirSafe(dirPath) {
  const resolved = path.isAbsolute(dirPath)
    ? dirPath
    : path.join(workspaceRoot, dirPath);
  try {
    fs.mkdirSync(resolved, { recursive: true });
  } catch {}
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
