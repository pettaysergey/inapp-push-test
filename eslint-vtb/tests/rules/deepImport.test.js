const { RuleTester } = require('eslint');

const rule = require('../../lib/rules/deepImport');

const ruleTester = new RuleTester({
  parserOptions: {
    sourceType: 'module',
    ecmaVersion: 6,
  }
});

ruleTester.run('deep-import', rule, {
  valid: [
    {
      code: `
        import { ValidModule } from '@modules/ValidModule';
        import { validCommon } from '@common/validCommon';
        import { VALID_CONSTANTS } from '../../module/ValidModule/constants/valid.ts'
      `,
    },
  ],
  invalid: [
    {
      code: `
        import { InvalidModule } from '@modules/InvalidModule/InvalidModule';
      `,
      errors: [{
        message: 'Запрещен импорт из глубины модуля. Экспортируйте InvalidModule из @modules/InvalidModule',
      }],
    },
  ].filter(Boolean),
});
