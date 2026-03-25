// eslint-disable-next-line import/no-unused-modules
const getMessage = (path, name) => `Запрещен импорт из глубины модуля. Экспортируйте ${name} из ${path.split('/').slice(0,2).join('/')}`;
const getEntityName = (node) => {
  if (
    node.specifiers
    && node.specifiers.length === 1
  ) {
    return node.specifiers[0].local.name;
  }

  return node.source.value;
};

const REGEXP_PATTERN = '(^@modules\\/[A-Z, a-z]+)(\\/?$)|(^(?!@modules).*)';
module.exports = {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'Rule prohibiting imports from module depth',
      category: 'import rules',
      url: '',
    },
  },

  create: ({ report }) => {
    const handleImport = (node) => {
      const importedModulePath = node.source.value;
      const importedModuleEntity = getEntityName(node);

      const pathValid = new RegExp(REGEXP_PATTERN).test(importedModulePath);

      if (pathValid) {
        return;
      }

      report({
        node,
        message: getMessage(importedModulePath, importedModuleEntity),
      });
    };

    return {
      'ImportDeclaration': handleImport,
    };
  },
};
