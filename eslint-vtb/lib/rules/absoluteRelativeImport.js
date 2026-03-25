// eslint-disable-next-line import/no-unused-modules
const pathNormalize = require('../utils/pathNormalize');

const EXPORT_TYPES = {
  relative: 'relative',
  absolute: 'absolute',
};

const getSourceRelativeFileName = (srcDir = '', absoluteFileName = '') => {
  const srcDirLength = pathNormalize(srcDir).split('/').length;

  return pathNormalize(absoluteFileName).split('/').slice(srcDirLength).join('/');
};

const getModuleNameFromRelativePath = (sourceRelativeFilename) => sourceRelativeFilename
  .split('/')
  .slice(2, 3)
  .join('/');

const checkIsModule = (sourceRelativeFileName) => sourceRelativeFileName.includes('src/modules');

const getExportType = (importedModulePath) => {
  const START_EXPORT_TYPES_MAP = {
    '../': EXPORT_TYPES.relative,
    './': EXPORT_TYPES.relative,
    '@module': EXPORT_TYPES.absolute,
  };

  const exportStart = new RegExp('(^@module)|(^\\.*\\/)').exec(importedModulePath);
  const key = exportStart ? (exportStart[1] || exportStart[2]) : null;

  return key ? START_EXPORT_TYPES_MAP[key] : null;
};

const countImportedDepthFromModule = (importedModulePath) => importedModulePath
  .split('/')
  .reduce((acc, current) => current === '..' ? acc + 1 : acc, 0);

const countCurrentModuleDepthFromModule = (sourceRelativeFilename) => sourceRelativeFilename.split('/').length - 3;

module.exports = {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'Rule prohibiting absolute import from current module and relative import from others',
      category: 'import rules',
      url: '',
    },
  },

  create: ({ report, getCwd, getFilename }) => {
    const sourceRelativeFilename = getSourceRelativeFileName(getCwd(), getFilename());
    const isModule = checkIsModule(sourceRelativeFilename);

    const handleImport = (node) => {
      let message = null;

      if (!isModule) {
        return;
      }

      const currentModuleName = getModuleNameFromRelativePath(sourceRelativeFilename);
      const importedModulePath = node.source.value;

      if(getExportType(importedModulePath) === EXPORT_TYPES.absolute) {
        const importedModuleName = importedModulePath.split('/')[1];

        if(importedModuleName === currentModuleName){
          message = 'Для импорта сущностей модуля внутри самого модуля следует использовать относительный импорт';
        }
      }

      if(getExportType(importedModulePath) === EXPORT_TYPES.relative) {
        if(countImportedDepthFromModule(importedModulePath) >= countCurrentModuleDepthFromModule(sourceRelativeFilename)) {
          message = 'Для импорта сущностей из другого модуля следует использовать абсолютный импорт';
        }
      }

      if(!message) return;

      report({
        node,
        message,
      });
    };

    return {
      'ImportDeclaration': handleImport,
    };
  },
};
