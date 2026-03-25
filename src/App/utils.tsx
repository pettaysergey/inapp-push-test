import type { TextData, TransformedHcmsTexts } from './types';

export const transformHcmsFormatToObject = (data: TextData): TransformedHcmsTexts => {
  const result: TransformedHcmsTexts = {};
  data?.groups?.forEach((group) => {
    if (typeof group.id === 'string') {
      result[group?.id] = group?.texts?.reduce((acc, text) => {
        // @ts-ignore
        acc[text?.id] = text?.val;
        return acc;
      }, {});
    }
  });

  return result;
};

export const mergeJSON = (json1: any, hcmsData: any, jsonPath?: any) => {
  const mergedJSON: any = {};

  const extractValue = (obj: any, path: string) => {
    return path.split('.').reduce((acc, key) => acc && acc[key], obj);
  };

  for (const key in json1) {
    if (typeof json1[key] === 'string' && json1[key].includes('.')) {
      const [objectKey, property] = json1[key].split('.');
      const extractedValue = extractValue(hcmsData[objectKey], property);
      mergedJSON[key] = extractedValue !== undefined ? extractedValue : json1[key];
    } else {
      mergedJSON[key] = hcmsData[jsonPath][json1[key]];
    }
  }

  return mergedJSON;
};
