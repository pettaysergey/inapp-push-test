const path = require('path');

const testFilePath = relativePath => path.join(process.cwd(), relativePath);

const test = ({ testFileRelativePath, ...rest }) => ({
  filename: testFilePath(testFileRelativePath),
  ...rest,
  parserOptions: {
    sourceType: 'module',
    ecmaVersion: 6,
    ...rest.parserOptions,
  },
});

module.exports = test;
