# Auto Complete

Auto-completion algorithm leveraging prefix tree for quick traversal and retrieval of matching words. Presented with a bespoke react frontend.

https://github.com/allenbrubaker/auto-complete/assets/7928072/23efb62e-7513-4885-990f-f00ff6d1533c


## Setup

- `npm i -g yarn`
- `nvm use`
- `yarn install`
- `yarn test`
- `yarn build`
- `yarn start`
- Navigate to `localhost:3333`

## Implementation

On startup the server builds a prefix tree from a flat file of all known English words. This allows for very quick traversal of all words matching a provided prefix. The prefix tree contains nodes corresponding to prefixes of length tree depth.

When a user enters a prefix on the frontend react application, the server is queried for the prefix. This performs a depth-first search on the prefix tree until a node is found that has a value matching the supplied prefix. Then the subtree induced by this node is filtered for all nodes that correspond to valid words and then mapped to an array of values. This array of words matching the prefix is returned to the client.

## Tech stack
- Typescript
- Express
- React
- ESBuild
- Inversify
