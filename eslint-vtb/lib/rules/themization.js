// eslint-disable-next-line import/no-unused-modules
const WHITE_LIST = ['extendLightColors', 'createColorsFromThemeGetter'];
const colorPathFromUiKit = ['@vtb/ui-kit/adaptive/tokens/color', '@vtb/ui-kit/tokens/color'];
module.exports = {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'Theming components - improper use of colors of ui-kit',
      category: 'css rules',
      url: '',
    },
  },

  create: (context) => ({
    VariableDeclaration: (node) => {
      const source = context.getSourceCode();
      // ищем какие же цвета у нас в файлике в импортах светятся
      const ast = source.ast.body;
      const colorNames = [];
      ast
        .filter(({ type }) => type === 'ImportDeclaration')
        .map(
          ({ source: { value = '' }, specifiers }) =>
            colorPathFromUiKit.includes(value) && specifiers.forEach(({ local: { name } }) => colorNames.push(name)),
        );
      // нашли все имена цветов.

      // разбитие по словам
      const tokens = context.getSourceCode().getTokens(node);

      // совпадение использования цветов из импортов
      const res = tokens.filter(({ value }) => colorNames.includes(value));

      if (res.length > 0) {
        const isValid = tokens.find(({ value }) => WHITE_LIST.includes(value));

        if (isValid) {
          return;
        }
        // имя переменной
        const { name } = node.declarations[0].id;
        // значение, строка
        const {
          value,
          loc: {
            start: { line },
          },
        } = res[0];

        context.report({
          node,
          message: `Примените темизацию: переменная ${name}, значение ${value} в строке ${line}`,
        });
      }
    },
  }),
};
