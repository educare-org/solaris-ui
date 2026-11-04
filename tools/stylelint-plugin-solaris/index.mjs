import stylelint from 'stylelint';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const RULE_NAME = 'solaris/no-raw-design-values';

const pluginDir = path.dirname(fileURLToPath(import.meta.url));
const rulesPath = path.join(pluginDir, '..', 'config', 'token-rules.json');
const tokenRules = JSON.parse(fs.readFileSync(rulesPath, 'utf-8'));

const ruleFunction = (primary) => {
  return (root, result) => {
    if (primary !== true) return;
    const file = root.source?.input.file || '';
    if (file.includes('/token/') || file.includes('\\token\\')) return;

    const comments = [];
    root.walkComments((comment) => {
      comments.push({
        line: comment.source?.start?.line ?? 0,
        text: comment.text ?? '',
      });
    });

    root.walkDecls((decl) => {
      const line = decl.source?.start?.line ?? 0;
      const text = `${decl.prop}: ${decl.value}`;
      for (const rule of tokenRules.patterns) {
        if (!new RegExp(rule.pattern, 'i').test(text)) continue;
        const excepted = comments.some(
          (comment) =>
            comment.text.includes(rule.exceptionComment) &&
            comment.line <= line &&
            line - comment.line <= 10,
        );
        if (excepted) continue;
        stylelint.utils.report({
          ruleName: RULE_NAME,
          result,
          node: decl,
          message: `Unexpected ${rule.property} — ${rule.reason}. Add a "${rule.exceptionComment}: <reason>" on a comment line right above if this is justified.`,
        });
        break;
      }
    });
  };
};

ruleFunction.ruleName = RULE_NAME;
ruleFunction.messages = {
  rejected: 'Unexpected raw design value (use a Solaris token instead).',
};

export default stylelint.createPlugin(RULE_NAME, ruleFunction);
