import path from 'node:path';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const workspaceRoot = path.resolve(__dirname, '..', '..');
const groupsDir = path.join(
  workspaceRoot,
  'packages',
  'angular',
  'src',
  'lib',
  'services',
  'icon',
  'icons',
  'groups',
);
const outSvgDir = path.join(__dirname, 'src', 'outline');
const outMetaDir = path.join(__dirname, 'meta');

const KEYWORD_SEEDS = {
  bookmark: ['save', 'favorite', 'salvar', 'favorito'],
  rss: ['feed', 'news', 'blog'],
  search: ['find', 'buscar', 'procurar'],
  trash: ['delete', 'remove', 'excluir', 'lixeira'],
  edit: ['pen', 'write', 'editar'],
  send: ['paper-plane', 'enviar'],
  download: ['baixar'],
  export: ['upload', 'compartilhar'],
  lock: ['locked', 'cadeado', 'bloqueado'],
  unlock: ['unlocked', 'cadeado-aberto'],
  home: ['house', 'inicio', 'casa'],
  settings: ['cog', 'config', 'configuracoes'],
  gear: ['cog', 'config'],
  refresh: ['reload', 'recarregar', 'atualizar'],
  'rotate-ccw': ['reload', 'recarregar'],
  copy: ['duplicate', 'copiar', 'duplicar'],
  share: ['compartilhar'],
  save: ['bookmark', 'salvar'],
  star: ['favorite', 'favorito'],
  user: ['person', 'usuario', 'pessoa'],
  users: ['people', 'usuarios', 'pessoas'],
  mail: ['email', 'envelope'],
  inbox: ['email', 'caixa-de-entrada'],
  calendar: ['date', 'calendario', 'data'],
  clock: ['time', 'relogio'],
  timer: ['time', 'cronometro'],
  globe: ['world', 'mundo'],
};

const CLASS_SEEDS = {
  bookmark: 'fillable',
  rss: 'redrawable',
  'chart-spline': 'stroke-only',
};

const KEBAB = {
  fillRule: 'fill-rule',
  clipRule: 'clip-rule',
  strokeWidth: 'stroke-width',
  strokeLinecap: 'stroke-linecap',
  strokeLinejoin: 'stroke-linejoin',
};

function parseElement(src) {
  const typeMatch = src.match(/type:\s*'(\w+)'/);
  if (!typeMatch) return null;
  const type = typeMatch[1];
  const attrs = {};
  const re = /(\w+):\s*(?:'([^']*)'|"([^"]*)"|(-?[\d.]+))/g;
  let m;
  while ((m = re.exec(src)) !== null) {
    if (m[1] === 'type') continue;
    const value = m[2] ?? m[3] ?? Number(m[4]);
    attrs[m[1]] = value;
  }
  return { type, attrs };
}

function elementToSvg(el) {
  const parts = [];
  for (const [k, v] of Object.entries(el.attrs)) {
    const name = KEBAB[k] ?? k;
    parts.push(`${name}="${String(v).replace(/"/g, '&quot;')}"`);
  }
  return `<${el.type}${parts.length > 0 ? ' ' + parts.join(' ') : ''}/>`;
}

function splitElementsArray(block, startIdx) {
  const arrStart = block.indexOf('[', startIdx);
  let depth = 0;
  let i = arrStart;
  for (; i < block.length; i++) {
    if (block[i] === '[') depth++;
    if (block[i] === ']') {
      depth--;
      if (depth === 0) break;
    }
  }
  return block.slice(arrStart + 1, i);
}

function splitElementObjects(arraySrc) {
  const out = [];
  let depth = 0;
  let current = '';
  for (const ch of arraySrc) {
    if (ch === '{') {
      if (depth === 0) current = '';
      depth++;
    }
    if (depth > 0) current += ch;
    if (ch === '}') {
      depth--;
      if (depth === 0) out.push(current);
    }
  }
  return out;
}

function firstString(block, key) {
  const m = block.match(new RegExp(key + ":\\s*'([^']*)'"));
  return m ? m[1] : undefined;
}

function firstNumber(block, key) {
  const m = block.match(new RegExp(key + ':\\s*(-?[\\d.]+)'));
  return m ? Number(m[1]) : undefined;
}

const groupFiles = fs.readdirSync(groupsDir).filter((f) => f.endsWith('.ts'));
let total = 0;

function collectConstArrays(content) {
  const out = {};
  const re = /const\s+([A-Z0-9_]+)[^=]*=\s*\[/g;
  let m;
  while ((m = re.exec(content)) !== null) {
    const constName = m[1];
    let depth = 0;
    let i = m.index + m[0].length - 1;
    for (; i < content.length; i++) {
      if (content[i] === '[') depth++;
      if (content[i] === ']') {
        depth--;
        if (depth === 0) break;
      }
    }
    const arraySrc = content.slice(m.index + m[0].length, i);
    out[constName] = splitElementObjects(arraySrc)
      .map(parseElement)
      .filter(Boolean);
  }
  return out;
}

fs.mkdirSync(outSvgDir, { recursive: true });
fs.mkdirSync(outMetaDir, { recursive: true });

for (const file of groupFiles) {
  const category = path.basename(file, '.ts');
  const content = fs.readFileSync(path.join(groupsDir, file), 'utf-8');
  const constArrays = collectConstArrays(content);
  const nameRe = /name:\s*'([^']+)'/g;
  const positions = [];
  let m;
  while ((m = nameRe.exec(content)) !== null) {
    positions.push({ name: m[1], index: m.index });
  }
  for (let i = 0; i < positions.length; i++) {
    const { name, index } = positions[i];
    const end =
      i + 1 < positions.length ? positions[i + 1].index : content.length;
    const block = content.slice(index, end);
    const viewBox = firstString(block, 'viewBox') ?? '0 0 24 24';
    const fill = firstString(block, 'fill');
    const stroke = firstString(block, 'stroke');
    const strokeWidth = firstNumber(block, 'strokeWidth');
    const strokeLinecap = firstString(block, 'strokeLinecap');
    const strokeLinejoin = firstString(block, 'strokeLinejoin');
    const elIdx = block.indexOf('elements');
    const elValue = block.slice(elIdx, elIdx + 120);
    const refMatch = elValue.match(/elements:\s*([A-Z0-9_]+)/);
    let elements;
    if (refMatch && constArrays[refMatch[1]]) {
      elements = constArrays[refMatch[1]];
    } else {
      const arraySrc = splitElementsArray(block, elIdx);
      elements = splitElementObjects(arraySrc)
        .map(parseElement)
        .filter(Boolean);
    }
    const inner = elements.map(elementToSvg).join('');
    const rootAttrs = [`viewBox="${viewBox}"`];
    if (fill !== undefined) rootAttrs.push(`fill="${fill}"`);
    if (stroke !== undefined) rootAttrs.push(`stroke="${stroke}"`);
    if (strokeWidth !== undefined)
      rootAttrs.push(`stroke-width="${strokeWidth}"`);
    if (strokeLinecap !== undefined)
      rootAttrs.push(`stroke-linecap="${strokeLinecap}"`);
    if (strokeLinejoin !== undefined)
      rootAttrs.push(`stroke-linejoin="${strokeLinejoin}"`);
    const svg =
      `<svg xmlns="http://www.w3.org/2000/svg" ${rootAttrs.join(' ')}>` +
      inner +
      `</svg>\n`;
    fs.writeFileSync(path.join(outSvgDir, `${name}.svg`), svg);
    const metaPath = path.join(outMetaDir, `${name}.json`);
    if (!fs.existsSync(metaPath)) {
      const meta = {
        categories: [category],
        keywords: KEYWORD_SEEDS[name] ?? [],
        aliases: [],
        class: CLASS_SEEDS[name] ?? 'stroke-only',
        availableVariants: ['outline'],
        viewBox,
      };
      fs.writeFileSync(metaPath, JSON.stringify(meta, null, 2) + '\n');
    }
    total++;
  }
}

console.log(`Migrated ${total} icons from ${groupFiles.length} groups.`);
