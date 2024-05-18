import typescript from '@rollup/plugin-typescript'
import virtual from '@rollup/plugin-virtual'
import replace from '@rollup/plugin-replace'
import strip from '@rollup/plugin-strip'

export default {
  input: '__entry__',
  output: {
    format: 'esm',
    file: '../fuite/src/thirdparty/devtools-frontend/index.js',
    sourcemap: true
  },
  plugins: [
    virtual({
      '../../third_party/codemirror.next/codemirror.next.ts': `
        export default function noop() {}
      `,
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
        lib: ['es2022', 'dom'],
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
