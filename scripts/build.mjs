import { build } from 'esbuild'

await build({
  entryPoints: ['web/panel.jsx'],
  outfile: 'client.js',
  bundle: true, format: 'cjs', platform: 'browser', target: 'es2022',
  external: ['react'], loader: { '.css': 'text' }, legalComments: 'none',
  banner: { js: "window.__ModuleLoader__.load({id:'@omeyang/dsh-ilabrat',factory(require){const module={exports:{}};" },
  footer: { js: 'return module.exports;}});' },
})
