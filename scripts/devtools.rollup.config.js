import typescript from '@rollup/plugin-typescript'
import virtual from '@rollup/plugin-virtual'
import replace from '@rollup/plugin-replace'
import strip from '@rollup/plugin-strip'
import inject from '@rollup/plugin-inject'

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
      `,
      // Promise.withResolvers minimal shim
      // TODO: remove when we set our minimum Node to v22+
      __promise_with_resolvers__: `
        export const withResolvers = () => {
          let resolve
          let reject
          const promise = new Promise((_resolve, _reject) => {
            resolve = _resolve
            reject = _reject
          })
          return { resolve, reject, promise }
        }
      `,
      // Array.prototype.toSorted minimal shim
      // TODO: remove when we set our minimum Node to v22+
      __to_sorted__: `
        export const toSorted = (arr) => {
          const res = [...arr]
          res.sort()
          return res
        }
      `
    }),
    typescript({
      compilerOptions: {
        lib: ['esnext', 'dom', 'dom.iterable', 'webworker', 'webworker.iterable'],
        target: 'esnext',
        outDir: '../fuite/src/thirdparty/devtools-frontend'
      },
      noEmitOnError: false
    }),
    replace({
      values: {
        'location.search': '',
        // TODO: remove when we set our minimum Node to v22+
        'Promise.withResolvers': 'PromiseWithResolversPolyfill'
      },
      preventAssignment: true
    }),

    // TODO: remove when we set our minimum Node to v22+
    replace({
      values: {
        'definition.properties.toSorted()': 'toSortedPolyfill(definition.properties)'
      },
      delimiters: ['', '']
    }),
    // TODO: remove when we set our minimum Node to v22+
    inject({
      PromiseWithResolversPolyfill: [
        '__promise_with_resolvers__',
        'withResolvers'
      ],
      toSortedPolyfill: [
        '__to_sorted__',
        'toSorted'
      ]
    }),
    strip({
      include: ['**/*.js', '**/*.ts'],
      // remove console.* calls
      functions: ['console.*']
    })
  ]
}
