export type Node = {
  prefix: string;
  children?: Node[];
  isWord?: boolean;
};

export const Symbols = {
  prefixTree: Symbol.for('PrefixTree'),
  utils: Symbol.for('Utils'),
  server: Symbol.for('Server'),
};
