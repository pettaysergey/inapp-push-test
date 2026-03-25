// Forced to make an internal dependency due to eslint plugin location constraints.
// Plugins must be imported from absolute paths (node_modules).
const absoluteRelativeImport = require('./lib/rules/absoluteRelativeImport');
const deepImport = require('./lib/rules/deepImport');
const themization = require('./lib/rules/themization');

module.exports = {
  rules: {
    'absolute-relative-import': absoluteRelativeImport,
    'deep-import': deepImport,
    'themization':themization
  },
  configs: {
    recommended: {
      plugins: ['vtb'],
      rules: {
        'vtb/deep-import': 'error',
        'vtb/absolute-relative-import': 'error',
        'vtb/themization': 'error',
      },
    },
  },
};
