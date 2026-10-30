import path from 'node:path';
import {
  workspaceRoot,
  findFilesRecursive,
  readFileSafe,
  printSummary,
} from './shared.mjs';

const errors = [];
const warnings = [];

const tokenFiles = findFilesRecursive(
  path.join(workspaceRoot, 'packages/angular/src/styles/token'),
  /\.scss$/,
);
const styleFiles = findFilesRecursive(
  path.join(workspaceRoot, 'packages/angular/src/styles'),
  /\.scss$/,
);
const componentFiles = findFilesRecursive(
  path.join(workspaceRoot, 'packages/angular/src/lib/components'),
  /\.scss$/,
);

const globalTokens = new Set();
const componentTokens = new Set();
const referencedTokens = new Map();

function stripScssComments(content) {
  return content
    .replace(/\/\*[\s\S]*?\*\//g, '')
    .replace(/(^|[^:"'(-])\/\/[^\n]*/g, '$1');
}

function extractTokenDefs(content) {
  const defs = [];
  const clean = stripScssComments(content);
  for (const line of clean.split('\n')) {
    const trimmed = line.trim();
    if (!trimmed.startsWith('--solaris-')) continue;
    const end = trimmed.indexOf(':');
    if (end === -1) continue;
    const name = trimmed.slice(0, end).trim();
    if (/^--solaris-[\w-]+$/.test(name)) defs.push(name);
  }
  return defs;
}

function extractTokenRefs(content) {
  const refs = [];
  const clean = stripScssComments(content);
  const varRegex = /var\((--solaris-[\w-]+)/g;
  let match;
  while ((match = varRegex.exec(clean)) !== null) {
    const token = match[1];
    if (
      token.endsWith('-') &&
      clean.slice(match.index + match[0].length).startsWith('#')
    ) {
      continue;
    }
    refs.push(token);
  }
  return refs;
}

for (const file of tokenFiles) {
  const content = readFileSafe(file);
  const defs = extractTokenDefs(content);
  for (const def of defs) globalTokens.add(def);
}

for (const file of styleFiles) {
  const content = readFileSafe(file);
  const defs = extractTokenDefs(content);
  for (const def of defs) globalTokens.add(def);
  const refs = extractTokenRefs(content);
  for (const ref of refs) {
    if (!referencedTokens.has(ref)) referencedTokens.set(ref, new Set());
    referencedTokens.get(ref).add(file);
  }
}

for (const file of componentFiles) {
  const content = readFileSafe(file);
  const defs = extractTokenDefs(content);
  for (const def of defs) componentTokens.add(def);
  const refs = extractTokenRefs(content);
  for (const ref of refs) {
    if (!referencedTokens.has(ref)) referencedTokens.set(ref, new Set());
    referencedTokens.get(ref).add(file);
  }
}

const allDefined = new Set([...globalTokens, ...componentTokens]);

for (const [token, files] of referencedTokens) {
  if (!allDefined.has(token)) {
    const fileList = [...files];
    const extra = fileList.length > 1 ? ` (+${fileList.length - 1} more)` : '';
    errors.push(
      `Token "${token}" is used but never defined anywhere. Found in: ${path.relative(workspaceRoot, fileList[0])}${extra}`,
    );
  }
}

const result = printSummary('Token References Check', errors, warnings);
process.exitCode = result.errorCount > 0 ? 1 : 0;
