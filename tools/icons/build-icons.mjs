import path from 'node:path';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const workspaceRoot = path.resolve(__dirname, '..', '..');
const outlineDir = path.join(__dirname, 'src', 'outline');
const solidDir = path.join(__dirname, 'src', 'solid');
const duotoneDir = path.join(__dirname, 'src', 'duotone');
const metaDir = path.join(__dirname, 'meta');
const outDir = path.join(
  workspaceRoot,
  'packages',
  'angular',
  'src',
  'lib',
  'services',
  'icon',
  'icons',
  'generated',
);

const NAME_RE = /^[a-z0-9-]+$/;
const CLASSES = new Set(['fillable', 'redrawable', 'stroke-only']);
const ALLOWED_TAGS = new Set([
  'g',
  'mask',
  'path',
  'circle',
  'rect',
  'line',
  'polyline',
  'polygon',
  'ellipse',
]);
const ALLOWED_ATTRS = new Set([
  'id',
  'mask',
  'd',
  'points',
  'cx',
  'cy',
  'r',
  'rx',
  'ry',
  'x',
  'y',
  'x1',
  'y1',
  'x2',
  'y2',
  'width',
  'height',
  'fill',
  'fill-rule',
  'fill-opacity',
  'clip-rule',
  'stroke',
  'stroke-width',
  'stroke-linecap',
  'stroke-linejoin',
  'stroke-opacity',
  'opacity',
  'transform',
  'viewBox',
]);
const UNSAFE_RE =
  /<\s*script|foreignObject|<use[\s>]|javascript:|data:text\/html|expression\s*\(|\son\w+\s*=/i;

const errors = [];

function fail(msg) {
  errors.push(msg);
}

function readInner(label, filePath) {
  const raw = fs.readFileSync(filePath, 'utf-8');
  if (UNSAFE_RE.test(raw)) {
    fail(`${label}: unsafe SVG content detected`);
    return null;
  }
  const svgMatch = raw.match(/<svg([^<>]*)>([\s\S]*)<\/\s*svg\s*>/i);
  if (!svgMatch) {
    fail(`${label}: root <svg> element not found`);
    return null;
  }
  const inner = svgMatch[2].trim();
  const tagRe = /<\s*\/?\s*([a-zA-Z][a-zA-Z0-9-]*)([^<>]*)/g;
  let tm;
  while ((tm = tagRe.exec(inner)) !== null) {
    if (!ALLOWED_TAGS.has(tm[1].toLowerCase())) {
      fail(`${label}: disallowed tag <${tm[1]}>`);
      return null;
    }
    const attrRe =
      /([a-zA-Z_:][a-zA-Z0-9_.:-]*)(?:\s*=\s*(?:"[^"]*"|'[^']*'|[^\s"'=<>`]+))?/g;
    let am;
    while ((am = attrRe.exec(tm[2])) !== null) {
      const attrName = am[1].toLowerCase();
      if (
        attrName.startsWith('on') ||
        attrName === 'href' ||
        attrName === 'xlink:href' ||
        attrName === 'style'
      ) {
        fail(`${label}: disallowed attribute ${am[1]}`);
        return null;
      }
      if (!ALLOWED_ATTRS.has(attrName)) {
        fail(`${label}: disallowed attribute ${am[1]}`);
        return null;
      }
    }
  }
  return inner;
}

function nameTokens(name) {
  return name.split('-').filter((t) => t.length > 0 && !/^\d+$/.test(t));
}

const svgFiles = fs.readdirSync(outlineDir).filter((f) => f.endsWith('.svg'));
const metadata = {};
const outlines = {};
const solids = {};
const duotones = {};

for (const file of svgFiles) {
  const name = path.basename(file, '.svg');
  if (!NAME_RE.test(name)) {
    fail(`${file}: invalid icon name (must match ^[a-z0-9-]+$)`);
    continue;
  }
  const metaPath = path.join(metaDir, `${name}.json`);
  if (!fs.existsSync(metaPath)) {
    fail(`${file}: missing meta/${name}.json`);
    continue;
  }
  let meta;
  try {
    meta = JSON.parse(fs.readFileSync(metaPath, 'utf-8'));
  } catch {
    fail(`${file}: meta JSON is invalid`);
    continue;
  }
  if (!Array.isArray(meta.categories) || meta.categories.length === 0) {
    fail(`${file}: meta.categories must be a non-empty array`);
    continue;
  }
  if (!CLASSES.has(meta.class)) {
    fail(`${file}: meta.class must be fillable|redrawable|stroke-only`);
    continue;
  }
  const inner = readInner(`outline/${file}`, path.join(outlineDir, file));
  if (inner === null) continue;
  if (meta.viewBox) {
    const raw = fs.readFileSync(path.join(outlineDir, file), 'utf-8');
    const vb = raw.match(/viewBox="([^"]+)"/);
    if (vb && vb[1] !== meta.viewBox) {
      fail(`${file}: viewBox mismatch (svg=${vb[1]} meta=${meta.viewBox})`);
      continue;
    }
  }

  const availableVariants = ['outline'];
  const solidPath = path.join(solidDir, `${name}.svg`);
  const duotonePath = path.join(duotoneDir, `${name}.svg`);
  if (fs.existsSync(solidPath)) {
    const solidInner = readInner(`solid/${name}.svg`, solidPath);
    if (solidInner === null) continue;
    solids[name] = solidInner;
    availableVariants.push('solid');
  } else if (meta.class === 'fillable') {
    solids[name] = inner;
    availableVariants.push('solid');
  }
  if (fs.existsSync(duotonePath)) {
    const duotoneInner = readInner(`duotone/${name}.svg`, duotonePath);
    if (duotoneInner === null) continue;
    duotones[name] = duotoneInner;
    availableVariants.push('duotone');
  } else if (meta.class === 'fillable') {
    duotones[name] = inner;
    availableVariants.push('duotone');
  }

  const keywords = [
    ...new Set([...(meta.keywords ?? []), ...nameTokens(name)]),
  ];
  metadata[name] = {
    categories: meta.categories,
    keywords,
    aliases: meta.aliases ?? [],
    class: meta.class,
    availableVariants,
  };
  outlines[name] = inner;
}

if (errors.length > 0) {
  console.error('\n=== icons:build ===');
  for (const e of errors) console.error(`  [ERROR] ${e}`);
  process.exit(1);
}

fs.mkdirSync(outDir, { recursive: true });
const header =
  '// Generated by tools/icons/build-icons.mjs. Do not edit manually.\n';
function writeMap(fileName, exportName, map, typeImport) {
  fs.writeFileSync(
    path.join(outDir, fileName),
    header +
      (typeImport ? `${typeImport}\n\n` : '') +
      `export const ${exportName}: Record<string, string> = ` +
      JSON.stringify(map, null, 2) +
      ';\n',
  );
}
fs.writeFileSync(
  path.join(outDir, 'solaris-icons-metadata.ts'),
  header +
    "import type { SolarisIconMetadata } from '../../model/solaris-icon-variant.types';\n\n" +
    'export const SOLARIS_ICONS_METADATA: Record<string, SolarisIconMetadata> = ' +
    JSON.stringify(metadata, null, 2) +
    ';\n',
);
writeMap('solaris-icons-outline-svg.ts', 'SOLARIS_OUTLINE_SVG', outlines);
writeMap('solaris-icons-solid-svg.ts', 'SOLARIS_SOLID_SVG', solids);
writeMap('solaris-icons-duotone-svg.ts', 'SOLARIS_DUOTONE_SVG', duotones);
const withSolid = Object.keys(solids).length;
const withDuotone = Object.keys(duotones).length;
console.log(
  `icons:build ok — ${Object.keys(metadata).length} icons validated (${withSolid} solid, ${withDuotone} duotone).`,
);
