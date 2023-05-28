const res = require('esbuild').buildSync({
  entryPoints: ['src/client/main.tsx'],
  bundle: true,
  minify: true,
  format: 'cjs',
  sourcemap: false,
  outfile: 'dist/main.js'
});
