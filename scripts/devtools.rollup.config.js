import typescript from '@rollup/plugin-typescript'
import virtual from '@rollup/plugin-virtual'
import replace from '@rollup/plugin-replace'
import strip from '@rollup/plugin-strip'

// Stub out some modules to reduce bundle size
const makeStub = (...names) => names
  .map(_ => `export function ${_} () { throw new Error("not implemented"); }`)
  .join('\n')

const noop = 'export default function noop() {}'

export default {
  input: '__entry__',
  output: {
    format: 'esm',
    file: '../fuite/src/thirdparty/devtools-frontend/index.js',
    banner: '/* Generated from devtools-frontend via build-devtools-frontend.sh */',
    sourcemap: false
  },
  plugins: [
    virtual({
      './Color.js': noop,
      './ResourceType.js': noop,
      './ColorConverter.js': makeStub('ColorConverter'),
      '../intl-messageformat/intl-messageformat.js': makeStub('IntlMessageFormat'),
      '../../third_party/codemirror.next/codemirror.next.js': makeStub('cssStreamParser', 'StringStream'),
      './locales.js': `
        export const LOCALES = ['en-GB']
        export const BUNDLED_LOCALES = ['en-GB']
        export const DEFAULT_LOCALE =  'en-GB'
        export const REMOTE_FETCH_PATTERN = ''
        export const LOCAL_FETCH_PATTERN = ''
      `,
      __entry__: `
        export { HeapSnapshotLoader } from './front_end/entrypoints/heap_snapshot_worker/heap_snapshot_worker.ts'
        export { HeapSnapshotModel } from './front_end/models/heap_snapshot_model/heap_snapshot_model.ts'
      `
    }),
    typescript({
      compilerOptions: {
        lib: ['esnext', 'dom', 'dom.iterable', 'webworker', 'webworker.iterable'],
        target: 'esnext'
      },
      noEmitOnError: false
    }),
    replace({
      values: {
        'location.search': ''
      },
      preventAssignment: true
    }),
    strip({
      include: ['**/*.js', '**/*.ts'],
      // remove console.* calls
      functions: ['console.*']
    })
  ]
}
