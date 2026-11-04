function calleeName(callee) {
  if (callee.type === 'Identifier') return callee.name;
  if (
    callee.type === 'MemberExpression' &&
    !callee.computed &&
    callee.property.type === 'Identifier'
  )
    return callee.property.name;
  return null;
}

export default {
  meta: {
    type: 'problem',
    docs: {
      description:
        'Forbid eval, innerHTML and Angular sanitization bypasses without a SECURITY_EXCEPTION justification',
    },
    schema: [],
    messages: {
      dangerous:
        'Dangerous pattern "{{pattern}}" — {{reason}}. If justified, add a "SECURITY_EXCEPTION:" comment above with reason.',
    },
  },
  create(context) {
    const sourceCode = context.sourceCode ?? context.getSourceCode();
    let exceptionLines = null;
    function isExcepted(node) {
      if (!exceptionLines) {
        exceptionLines = sourceCode
          .getAllComments()
          .filter((comment) => comment.value.includes('SECURITY_EXCEPTION'))
          .map((comment) => comment.loc.end.line);
      }
      const line = node.loc.start.line;
      return exceptionLines.some(
        (commentLine) => commentLine <= line && line - commentLine <= 5,
      );
    }
    function report(node, pattern, reason) {
      if (isExcepted(node)) return;
      context.report({
        node,
        messageId: 'dangerous',
        data: { pattern, reason },
      });
    }
    return {
      CallExpression(node) {
        const name = calleeName(node.callee);
        if (name === 'eval') {
          report(
            node,
            'eval(',
            'eval executes arbitrary code and is a security risk',
          );
        } else if (name && name.startsWith('bypassSecurityTrust')) {
          report(
            node,
            name,
            'Bypassing Angular sanitization is dangerous and can expose XSS',
          );
        }
      },
      MemberExpression(node) {
        if (
          !node.computed &&
          node.property.type === 'Identifier' &&
          node.property.name === 'innerHTML'
        ) {
          report(
            node.property,
            'innerHTML',
            'innerHTML can lead to XSS attacks',
          );
        }
      },
    };
  },
};
