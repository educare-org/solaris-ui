import path from 'node:path';
import fs from 'node:fs';
import { workspaceRoot, fileExists, printSummary } from './shared.mjs';

const configPath = path.join(
  workspaceRoot,
  'tools',
  'config',
  'required-docs.json',
);
const config = JSON.parse(fs.readFileSync(configPath, 'utf-8'));

const errors = [];
const warnings = [];

for (const doc of config.requiredDocs) {
  const exists = fileExists(doc.path);
  if (!exists) {
    errors.push(`Missing required document: ${doc.path} — ${doc.description}`);
  }
}

const result = printSummary('Docs Check', errors, warnings);
process.exitCode = result.errorCount > 0 ? 1 : 0;
