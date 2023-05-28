import { Provider } from './provider';
import { IServer } from './server';
import { Symbols } from './types';

const services = new Provider().register();
const server = services.get<IServer>(Symbols.server);
const PORT = 3333;
server.api().then(api => {
  api.listen(PORT, () => {
    console.log(`Auto-complete api listening on port ${PORT}`);
  });
});
