import { Provider } from './provider';
import { IPrefixTree } from './prefix-tree';
import { Node, Symbols } from './types';

describe('prefix-tree', () => {
  const container = new Provider().register();
  let _tree = container.get<IPrefixTree>(Symbols.prefixTree);
  describe('build()', () => {
    it('creates root with an empty prefix and a subtree for all differing initial letters', () => {
      const root = _tree.build(['aa', 'ab', 'ba', 'bb', 'c', 'ca', 'ddd']);
      expect(root.prefix).toStrictEqual('');
      expect(prefixes(root)).toStrictEqual(['a', 'b', 'c', 'd']);
    });

    it('recursively builds prefix subtrees', () => {
      const root = _tree.build(['a', 'aa', 'aaa', 'aaab', 'aab', 'ab', 'ac']);
      expect(prefixes(root)).toStrictEqual(['a']);
      const a = root.children![0];
      expect(prefixes(a)).toStrictEqual(['aa', 'ab', 'ac']);
      const aa = a.children![0];
      const ab = a.children![1];
      expect(prefixes(ab)).toStrictEqual([]);
      expect(prefixes(aa)).toStrictEqual(['aaa', 'aab']);
      const aaa = aa.children![0];
      expect(prefixes(aaa)).toStrictEqual(['aaab']);
    });

    it('properly denotes roots as words if the prefix is a valid word', () => {
      const root = _tree.build(['aa', 'aaaa']);
      expect(root.isWord).toBeFalsy();
      const a = root.children![0];
      expect(a.prefix).toEqual('a');
      expect(a.isWord).toBeFalsy();
      const aa = a.children![0];
      expect(aa.prefix).toEqual('aa');
      expect(aa.isWord).toEqual(true);
      const aaa = aa.children![0];
      expect(aaa.prefix).toEqual('aaa');
      expect(aaa.isWord).toBeFalsy();
      const aaaa = aaa.children![0];
      expect(aaaa.prefix).toEqual('aaaa');
      expect(aaaa.isWord).toEqual(true);
    });
  });

  describe('words()', () => {
    it('aggregates all words belonging to the given subtree', () => {
      const root = <Node>{
        prefix: 'i',
        children: [
          {
            prefix: 'ill',
            isWord: true,
            children: [
              { prefix: 'illuminate', isWord: true, children: [{ prefix: 'illuminates', isWord: true }] },
              { prefix: 'illumination', isWord: true }
            ]
          },
          { prefix: 'im', children: [{ prefix: 'imp', isWord: true }] }
        ]
      };
      expect(_tree.words(root)).toEqual(['ill', 'illuminate', 'illuminates', 'illumination', 'imp']);
    });
  });

  describe('search()', () => {
    it('returns empty list if prefix is null or an empty string', () => {
      const root = <Node>{ prefix: '', children: [{ prefix: 'test', isWord: true }] };
      expect(_tree.search(root, '')).toEqual([]);
      expect(_tree.search(root, null as any)).toEqual([]);
    });

    it('aggregates all words matching given prefix', () => {
      const root = <Node>{
        prefix: 'i',
        children: [
          {
            prefix: 'ill',
            isWord: true,
            children: [
              { prefix: 'illuminate', isWord: true, children: [{ prefix: 'illuminates', isWord: true }] },
              { prefix: 'illumination', isWord: true }
            ]
          },
          { prefix: 'im', children: [{ prefix: 'imp', isWord: true }] }
        ]
      };
      expect(_tree.search(root, 'ill')).toEqual(['ill', 'illuminate', 'illuminates', 'illumination']);
      expect(_tree.search(root, 'im')).toEqual(['imp']);
      expect(_tree.search(root, 'illuminate')).toEqual(['illuminate', 'illuminates']);
      expect(_tree.search(root, 'x')).toEqual([]);
    });
  });
});

const prefixes = (node: Node) => node.children?.map(x => x.prefix) ?? [];
