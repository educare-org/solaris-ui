const TEXT_KEYS = new Set(['label', 'title', 'placeholder', 'ariaLabel']);

function keyName(node) {
  if (node.type === 'Identifier') return node.name;
  if (node.type === 'Literal' && typeof node.value === 'string')
    return node.value;
  return null;
}

export default {
  meta: {
    type: 'problem',
    docs: {
      description:
        'Forbid hardcoded user-facing text in label/title/placeholder/ariaLabel without a sibling translation key',
    },
    schema: [],
    messages: {
      hardcoded:
        'Hardcoded user-facing text "{{text}}" in "{{prop}}". Use the key/dual pattern ({{prop}} + {{prop}}Key).',
    },
  },
  create(context) {
    return {
      Property(node) {
        const prop = keyName(node.key);
        if (!prop || !TEXT_KEYS.has(prop)) return;
        const value = node.value;
        if (value.type !== 'Literal' || typeof value.value !== 'string') return;
        const text = value.value.trim();
        if (
          text.length <= 5 ||
          text.startsWith('@') ||
          text.startsWith('solaris-') ||
          text.startsWith('cdk-')
        )
          return;
        const parent = node.parent;
        const hasKey =
          parent &&
          parent.type === 'ObjectExpression' &&
          parent.properties.some((sibling) => {
            const name =
              sibling.type === 'Property' ? keyName(sibling.key) : null;
            return typeof name === 'string' && name.includes('Key');
          });
        if (hasKey) return;
        context.report({
          node: value,
          messageId: 'hardcoded',
          data: {
            text: text.substring(0, 40),
            prop,
          },
        });
      },
    };
  },
};
