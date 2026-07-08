import path from 'node:path';
import fs from 'node:fs';
import { workspaceRoot, readJson, printSummary } from './shared.mjs';

const configPath = path.join(
  workspaceRoot,
  'tools',
  'config',
  'forbidden-scripts.json',
);
const config = JSON.parse(fs.readFileSync(configPath, 'utf-8'));

const errors = [];
const warnings = [];

const pkg = readJson('package.json');
const scripts = pkg.scripts || {};

for (const [scriptName, scriptCommand] of Object.entries(scripts)) {
  for (const rule of config.forbiddenPatterns) {
    const regex = new RegExp(rule.pattern, 'i');
    if (regex.test(scriptCommand)) {
      const match = scriptCommand.match(regex);
      errors.push(
        `Script "${scriptName}": Found "${match ? match[0] : rule.pattern}"\n` +
          `  Reason: ${rule.reason}\n` +
          `  Alternative: ${rule.alternative}`,
      );
    }
  }
}

const result = printSummary('Scripts Check', errors, warnings);
process.exitCode = result.errorCount > 0 ? 1 : 0;
