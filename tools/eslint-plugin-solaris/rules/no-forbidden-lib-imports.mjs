import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const pluginDir = path.dirname(fileURLToPath(import.meta.url));
const rulesPath = path.join(
  pluginDir,
  '..',
  '..',
  'config',
  'architecture-rules.json',
);
const architectureRules = JSON.parse(fs.readFileSync(rulesPath, 'utf-8'));

function normalize(filePath) {
  return filePath.split(path.sep).join('/');
}

function importSourceName(node) {
  if (node.source && typeof node.source.value === 'string')
    return node.source.value;
  if (
    node.type === 'CallExpression' &&
    node.arguments.length > 0 &&
    typeof node.arguments[0].value === 'string'
  )
    return node.arguments[0].value;
  return null;
}

export default {
  meta: {
    type: 'problem',
    docs: {
      description:
        'Forbid architectural boundary violations between lib layers and from showcase to lib internals',
    },
    schema: [],
    messages: {
      forbidden: 'Forbidden import of "{{source}}" — {{reason}}',
    },
  },
  create(context) {
    const filename = normalize(
      context.filename ?? context.getPhysicalFilename(),
    );
    function checkSource(node) {
      const source = importSourceName(node);
      if (!source) return;
      for (const rule of architectureRules.forbiddenImports) {
        if (!filename.includes(normalize(rule.from))) continue;
        for (const forbiddenImport of rule.mustNotImport) {
          const pattern = forbiddenImport.replace(
            'packages/angular/src/lib/',
            '',
          );
          if (
            source.includes(pattern) ||
            source.includes(`@solaris-ui/angular/${pattern}`)
          ) {
            context.report({
              node,
              messageId: 'forbidden',
              data: { source, reason: rule.reason },
            });
            return;
          }
        }
      }
      const showcaseRule = architectureRules.forbiddenLibImportFromShowcase;
      if (showcaseRule && filename.includes(normalize(showcaseRule.from))) {
        if (showcaseRule.mustNotImport.some((p) => source.includes(p))) {
          context.report({
            node,
            messageId: 'forbidden',
            data: { source, reason: showcaseRule.reason },
          });
        }
      }
    }
    return {
      ImportDeclaration: checkSource,
      ExportNamedDeclaration: checkSource,
      ExportAllDeclaration: checkSource,
    };
  },
};
