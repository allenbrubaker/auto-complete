import 'reflect-metadata';

import { BindingScopeEnum, Container } from 'inversify';
import { IPrefixTree, PrefixTree } from './prefix-tree';
import { Symbols } from './types';
import { IUtils, Utils } from './utils';
import { IServer, Server } from './server';

export class Provider {
  register(): Container {
    const container = new Container({ defaultScope: BindingScopeEnum.Singleton });
    container.bind<IPrefixTree>(Symbols.prefixTree).to(PrefixTree);
    container.bind<IUtils>(Symbols.utils).to(Utils);
    container.bind<IServer>(Symbols.server).to(Server);
    return container;
  }
}
