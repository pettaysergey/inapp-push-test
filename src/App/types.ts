export type TransformedHcmsTexts = {
  [key: string]: {
    [key: string]: string;
  };
};

export type TextData = {
  groups: {
    id: string;
    texts: {
      id: string;
      val: string;
      desc: string;
    }[];
  }[];
};
