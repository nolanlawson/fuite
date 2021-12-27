import StackTracey from 'stacktracey'

export function prettifyStacktrace (stacktrace) {
  // TODO: it'd be great to have sourcemaps, but I can't get remote sourcemaps to work
  // https://github.com/xpl/get-source/issues/8
  const pretty = new StackTracey(stacktrace).asTable({
    maxColumnWidths: 80
  })
  return pretty
}
