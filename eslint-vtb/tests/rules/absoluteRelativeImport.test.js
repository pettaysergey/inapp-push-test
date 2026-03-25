const { RuleTester } = require('eslint');

const rule = require('../../lib/rules/absoluteRelativeImport');
const test = require('../../lib/utils/createTestConfig');

const ruleTester = new RuleTester();

ruleTester.run('absolute-relative-import', rule, {
  valid: [
    test({
      testFileRelativePath: 'src/modules/ProductInfo/components/ProductInfo.tsx',
      code: `
        import React from 'react';
        import { validCommon } from '@common/validCommon';
        import { ProductDetails } from '@modules/ProductDetails'
        import { VALID_CONSTANTS } from '../constants/validators';
      `,
    }),
  ],
  invalid: [
    test({
      testFileRelativePath: 'src/modules/ProductInfo/components/ProductInfo.tsx',
      code: `
        import { ValidModule } from '@modules/ProductInfo';
        import { validCommon } from '@common/validCommon';
        import { VALID_CONSTANTS } from '../constants/validators'
      `,
      errors: [{
        message: 'Для импорта сущностей модуля внутри самого модуля следует использовать относительный импорт',
      }],
    }),
    test({
      testFileRelativePath: 'src/modules/ProductInfo/components/ProductInfo.tsx',
      code: `
        import { VALID_CONSTANTS } from '../../ProductDetails/components/Details.tsx'
      `,
      errors: [{
        message: 'Для импорта сущностей из другого модуля следует использовать абсолютный импорт',
      }],
    }),
    test({
      testFileRelativePath: 'src/modules/ProductInfo/components/ProductInfo.tsx',
      code: `
        import { VALID_CONSTANTS } from '../../../modules/ProductDetails/components/Details.tsx'
      `,
      errors: [{
        message: 'Для импорта сущностей из другого модуля следует использовать абсолютный импорт',
      }],
    })
  ].filter(Boolean),
});
