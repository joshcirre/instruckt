import { defineConfig } from 'tsup'

export default defineConfig([
  // CDN-ready IIFE (single file, no deps, browser global)
  {
    entry: { instruckt: 'src/index.ts' },
    format: ['iife'],
    globalName: 'Instruckt',
    outDir: 'dist',
    outExtension: () => ({ js: '.iife.js' }),
    noExternal: ['html-to-image'],
    minify: true,
    sourcemap: true,
    dts: false,
    platform: 'browser',
    target: 'es2017',
    banner: {
      js: `/* instruckt v${process.env.npm_package_version} | MIT */`,
    },
  },
  // ESM + CJS for npm consumers
  {
    entry: { instruckt: 'src/index.ts' },
    format: ['esm', 'cjs'],
    outDir: 'dist',
    outExtension: ({ format }) => ({
      js: format === 'esm' ? '.esm.js' : '.cjs.js',
    }),
    noExternal: ['html-to-image'],
    sourcemap: true,
    dts: true,
    platform: 'browser',
    target: 'es2017',
  },
])
