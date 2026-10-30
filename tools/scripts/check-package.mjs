import { workspaceRoot, fileExists, readJson } from './shared.mjs';
import { resolve } from 'node:path';

const root = workspaceRoot;

let exitCode = 0;

function error(msg) {
  console.error(`  [ERROR] ${msg}`);
  exitCode = 1;
}

function info(msg) {
  console.log(`  [INFO] ${msg}`);
}

const distDir = resolve(root, 'dist', 'packages', 'angular');
const pkgPath = resolve(distDir, 'package.json');

console.log('');
console.log('=== Package Check ===');
console.log('');

if (!fileExists(distDir)) {
  error(`Dist directory not found: ${distDir}`);
  process.exit(1);
}

info(`Dist directory: ${distDir}`);

let pkg;
if (!fileExists(pkgPath)) {
  error(`package.json not found at ${pkgPath}`);
  process.exit(1);
}
try {
  pkg = readJson(pkgPath);
} catch {
  error('Failed to parse package.json');
  process.exit(1);
}

info(`Package name: ${pkg.name}`);
info(`Package version: ${pkg.version}`);

if (!pkg.name) error('Missing "name" in package.json');
if (!pkg.version) error('Missing "version" in package.json');

const entryPoints = [
  { label: 'Main', field: 'main', path: pkg.main },
  { label: 'Module', field: 'module', path: pkg.module },
  {
    label: 'Types',
    field: 'typings || types',
    path: pkg.typings || pkg.types,
  },
];

if (!pkg.main && !pkg.module) {
  if (pkg.exports) {
    info(`Exports field found (${Object.keys(pkg.exports).length} entries)`);
  } else {
    error(
      'Missing both "main" and "module" entry points, and no "exports" field',
    );
  }
}

for (const entry of entryPoints) {
  if (!entry.path) {
    if (entry.label === 'Types') {
      info('No "typings" or "types" field (may be defined in exports.map)');
    }
    continue;
  }
  const entryPath = resolve(distDir, entry.path);
  if (!fileExists(entryPath))
    error(`${entry.label} entry not found: ${entry.path}`);
  else info(`${entry.label} entry: ${entry.path} ✓`);
}

const peerDeps = pkg.peerDependencies;
if (!peerDeps || Object.keys(peerDeps).length === 0) {
  error('No peerDependencies declared');
} else {
  info(`Peer dependencies: ${Object.keys(peerDeps).join(', ')}`);
}

if (pkg.schematics) {
  const schematicsPath = resolve(distDir, pkg.schematics);
  if (!fileExists(schematicsPath)) {
    error(`Schematics entry not found: ${pkg.schematics}`);
  } else {
    info(`Schematics entry: ${pkg.schematics} ✓`);
  }
}

const files = pkg.files;
if (!files || files.length === 0) {
  info('No "files" field (all files will be published; consider adding one)');
} else {
  info(`Files filter: ${files.join(', ')}`);
}

if (pkg.private === true) {
  error('Package is marked as private');
}

console.log('');
if (exitCode === 0) {
  console.log('  ✓ Package check passed');
} else {
  console.log(`  ✗ Package check failed with ${exitCode} error(s)`);
}
console.log('');

process.exit(exitCode);
