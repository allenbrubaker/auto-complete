import express, { Express } from 'express';
import { Provider } from './provider';
import { IPrefixTree, PrefixTree } from './prefix-tree';
import { Symbols } from './types';
import { inject, injectable } from 'inversify';
import path from 'path';

export interface IServer {
  api(): Promise<Express>;
}

@injectable()
export class Server implements IServer {
  constructor(@inject(Symbols.prefixTree) private _tree: IPrefixTree) {}
  private _api?: Express;
  async api() {
    if (this._api) return this._api;
    this._api = await this.getApi();
    return this._api;
  }

  private async getApi() {
    const api = express();
    const root = await this._tree.buildFromFile('./src/words.txt');
    api.use(express.static('src/client'));
    api.use(express.static('dist'));
    api.get('/', (req, res) => {
      res.sendFile(path.join(__dirname, 'client/index.html'));
    });

    api.get('/:prefix', (req, res) => {
      const { prefix } = req.params;
      const words = this._tree.search(root, prefix);
      res.send(words);
    });
    return api;
  }
}
