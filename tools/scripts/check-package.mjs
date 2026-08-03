import { readFileSync, existsSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, '..', '..');

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

if (!existsSync(distDir)) {
  error(`Dist directory not found: ${distDir}`);
  process.exit(1);
}

info(`Dist directory: ${distDir}`);

if (!existsSync(pkgPath)) {
  error(`package.json not found at ${pkgPath}`);
  process.exit(1);
}

let pkg;
try {
  pkg = JSON.parse(readFileSync(pkgPath, 'utf-8'));
} catch {
  error('Failed to parse package.json');
  process.exit(1);
}

info(`Package name: ${pkg.name}`);
info(`Package version: ${pkg.version}`);

if (!pkg.name) error('Missing "name" in package.json');
if (!pkg.version) error('Missing "version" in package.json');

const entryPoints = [
  { field: 'main', path: pkg.main },
  { field: 'module', path: pkg.module },
  {
    field: 'typings || types || exports[types]',
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

if (pkg.main) {
  const mainPath = resolve(distDir, pkg.main);
  if (!existsSync(mainPath)) error(`Main entry not found: ${pkg.main}`);
  else info(`Main entry: ${pkg.main} ✓`);
}

if (pkg.module) {
  const modulePath = resolve(distDir, pkg.module);
  if (!existsSync(modulePath)) error(`Module entry not found: ${pkg.module}`);
  else info(`Module entry: ${pkg.module} ✓`);
}

const typesFile = pkg.typings || pkg.types;
if (typesFile) {
  const typesPath = resolve(distDir, typesFile);
  if (!existsSync(typesPath)) error(`Types entry not found: ${typesFile}`);
  else info(`Types entry: ${typesFile} ✓`);
} else {
  info('No "typings" or "types" field (may be defined in exports.map)');
}

const peerDeps = pkg.peerDependencies;
if (!peerDeps || Object.keys(peerDeps).length === 0) {
  error('No peerDependencies declared');
} else {
  info(`Peer dependencies: ${Object.keys(peerDeps).join(', ')}`);
}

if (pkg.schematics) {
  const schematicsPath = resolve(distDir, pkg.schematics);
  if (!existsSync(schematicsPath)) {
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
