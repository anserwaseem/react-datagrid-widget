type DataType =
  | string
  | number
  | boolean
  | object
  | array
  | null
  | undefined
  | symbol
  | bigint
  | date;

type Column = {
  label: string;
  key: string;
  dataType: DataType;
  jsonPath: string;
};

type Config = {
  apiEndpoint: string;
  columns: Column[];
  titleKey: string;
  subtitleKey: string;
};
