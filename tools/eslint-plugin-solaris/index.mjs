import noHardcodedI18nText from './rules/no-hardcoded-i18n-text.mjs';
import noDangerousSecurityPatterns from './rules/no-dangerous-security-patterns.mjs';
import noForbiddenLibImports from './rules/no-forbidden-lib-imports.mjs';

export default {
  rules: {
    'no-hardcoded-i18n-text': noHardcodedI18nText,
    'no-dangerous-security-patterns': noDangerousSecurityPatterns,
    'no-forbidden-lib-imports': noForbiddenLibImports,
  },
};
