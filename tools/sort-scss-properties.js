#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const DECL_START = /^\s*(?:--)?[\w-]+\s*:/;

function isDeclStart(line) {
  return DECL_START.test(line) && !line.includes('{');
}

function processFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  if (!content.includes('{') && !content.includes('}')) return false;

  const originalLines = content.split('\n');
  const blocksByDepth = {};
  let depth = 0;
  let inDecl = false;
  let declText = '';
  const output = [];

  function block(d) {
    if (!blocksByDepth[d]) blocksByDepth[d] = { nonDecls: [], decls: [] };
    return blocksByDepth[d];
  }

  function flushDecl() {
    if (inDecl) {
      block(depth).decls.push(declText);
      inDecl = false;
      declText = '';
    }
  }

  function isCustomDecl(text) {
    return text.trimStart().startsWith('--');
  }

  function closeBlock() {
    flushDecl();
    const b = blocksByDepth[depth];
    if (b) {
      const custom = [];
      const regular = [];
      for (const d of b.decls) {
        if (isCustomDecl(d)) {
          custom.push(d);
        } else {
          regular.push(d);
        }
      }
      custom.sort((a, bb) => a.trim().length - bb.trim().length);
      regular.sort((a, bb) => a.trim().length - bb.trim().length);
      const sorted = [...custom, ...regular];
      const pd = depth - 1;
      if (pd > 0) {
        block(pd).nonDecls.push(...b.nonDecls, ...sorted);
      } else {
        output.push(...b.nonDecls, ...sorted);
      }
      delete blocksByDepth[depth];
    }
    depth--;
  }

  for (const line of originalLines) {
    const openCount = (line.match(/{/g) || []).length;
    const closeCount = (line.match(/}/g) || []).length;

    if (openCount === 0 && closeCount === 0 && depth === 0) {
      output.push(line);
      continue;
    }

    if (closeCount > 0) {
      if (inDecl) {
        declText += '\n' + line;
        if (line.includes(';')) flushDecl();
      }
      for (let c = 0; c < closeCount; c++) closeBlock();
      if (depth > 0) {
        block(depth).nonDecls.push(line);
      } else {
        output.push(line);
      }
    }

    if (openCount > 0) {
      if (depth > 0) {
        block(depth).nonDecls.push(line);
      } else {
        output.push(line);
      }
      for (let o = 0; o < openCount; o++) {
        depth++;
        block(depth);
      }
    }

    if (openCount === 0 && closeCount === 0 && depth > 0) {
      if (inDecl) {
        declText += '\n' + line;
        if (line.includes(';')) {
          block(depth).decls.push(declText);
          inDecl = false;
          declText = '';
        }
      } else if (isDeclStart(line)) {
        const trimmed = line.trim();
        if (trimmed.endsWith(';')) {
          block(depth).decls.push(line);
        } else {
          inDecl = true;
          declText = line;
        }
      } else {
        block(depth).nonDecls.push(line);
      }
    }
  }

  flushDecl();

  for (let d = depth; d >= 1; d--) {
    if (blocksByDepth[d]) {
      const b = blocksByDepth[d];
      if (d - 1 > 0) {
        block(d - 1).nonDecls.push(...b.nonDecls, ...b.decls);
      } else {
        output.push(...b.nonDecls, ...b.decls);
      }
    }
  }

  const result = output.join('\n');
  if (result !== content) {
    fs.writeFileSync(filePath, result, 'utf8');
    console.error(`  Sorted: ${path.relative(process.cwd(), filePath)}`);
    return true;
  }
  return false;
}

const args = process.argv.slice(2);

function findScssFiles(dir, result = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory() && !entry.name.startsWith('.') && entry.name !== 'node_modules') {
      findScssFiles(full, result);
    } else if (entry.isFile() && entry.name.endsWith('.scss')) {
      result.push(full);
    }
  }
  return result;
}

if (args.includes('--all')) {
  const files = findScssFiles('.');
  let changed = 0;
  for (const file of files) changed += processFile(file) ? 1 : 0;
  console.log(`\n${changed} of ${files.length} file(s) modified.`);
} else if (args.length > 0) {
  let changed = 0;
  let total = 0;
  for (const arg of args) {
    const resolved = path.resolve(arg);
    if (fs.statSync(resolved).isFile() && resolved.endsWith('.scss')) {
      total++;
      changed += processFile(resolved) ? 1 : 0;
    }
  }
  console.log(`\n${changed} of ${total} file(s) modified.`);
} else {
  console.error('Usage: node tools\\sort-scss-properties.js <file1.scss> [file2.scss ...]');
  console.error('       node tools\\sort-scss-properties.js --all');
  process.exit(1);
}
