import { inject, injectable } from 'inversify';
import { Node, Symbols } from './types';
import { IUtils } from './utils';

export interface IPrefixTree {
  buildFromFile(file: string): Promise<Node>;
  build(words: string[], index?: number, prefix?: string): Node;
  search(tree: Node, prefix: string, acc?: string[]): string[];
  words(node: Node, acc?: string[]): string[];
}

@injectable()
export class PrefixTree implements IPrefixTree {
  constructor(@inject(Symbols.utils) private _utils: IUtils) {}

  async buildFromFile(wordsFile: string): Promise<Node> {
    const lines = await this._utils.parse(wordsFile);
    return this.build(lines);
  }

  build(words: string[], index: number = 0, prefix: string = ''): Node {
    let letter: string | null = null;
    const node = <Node>{ prefix: prefix };
    for (let i = index; i < words.length && words[i].startsWith(prefix); ++i) {
      const word = words[i];
      if (word === prefix) {
        node.isWord = true;
        continue;
      }
      if (letter !== word[prefix.length]) {
        letter = word[prefix.length];
        (node.children ??= []).push(this.build(words, i, prefix + letter));
      }
    }
    return node;
  }

  search(tree: Node, prefix: string, acc: string[] = []): string[] {
    // Optimization via tail recursion by leveraging accumulator to avoid repeated expensive array concatenation operations.
    // (Compiler optimizes tail recursion by reducing to an iterative function)
    if (!prefix?.length || !tree || !prefix.startsWith(tree.prefix)) return acc;
    if (tree.prefix === prefix) {
      this.words(tree, acc);
    } else (tree.children || []).forEach(child => this.search(child, prefix, acc));
    return acc;
  }

  words(node: Node, acc: string[] = []): string[] {
    if (node.isWord) acc.push(node.prefix);
    (node.children || []).forEach(child => this.words(child, acc));
    return acc;
  }
}
