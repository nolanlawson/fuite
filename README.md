# fuite

> **fuite** \fɥit\ French for "leak" 

`fuite` is a tool for finding memory leaks in web apps.

# Usage

**Install:**

```shell
npm install -g fuite
```

**Run:**

```shell
fuite https://my-website.com
```

This will check for leaks and print output to stdout.

By default, `fuite` will assume that your site is a client-rendered webapp, and it will click on links to internal URLs and press the back button to see if it's leaking. For other scenarios, see [scenarios](#scenarios).

# How it works

`fuite` launches Chrome using Puppeteer, loads a web page, and runs a scenario against it. It runs the scenario some number of iterations (7 by default) and looks for objects that leaked 7 times (or 14 times, or 28 times). This might sound like a strange approach, but it's useful for [cutting through the noise](https://nolanlawson.com/2020/02/19/fixing-memory-leaks-in-web-applications/) in memory analysis.

`fuite` looks for the following leaks:

- Objects (captured with Chrome [heapsnapshots](https://developer.chrome.com/docs/devtools/memory-problems/heap-snapshots/))
- Event listeners
- DOM nodes (attached to the DOM – detached nodes will show under "Objects")
- Collections such as Arrays, Maps, Sets, and plain Objects

The default scenario clicks internal links because it's the most generic scenario that can be run against a wide variety of SPAs, and it will often catch leaks if client-side routing is used.

# Options

```
Usage: fuite [options] <url>

Arguments:
  url                        URL to load in the browser and analyze

Options:
  -o, --output <file>        Write JSON output to a file
  -i, --iterations <number>  Number of iterations (default: 7)
  -s, --scenario <scenario>  Scenario file to run
  -H, --heapsnapshot         Save heapsnapshot files
  -d, --debug                Run in debug mode  
  -V, --version              output the version number
  -h, --help                 display help for command
```

### url

    fuite <url>

The URL to load. This should be whatever landing page you want to start at – you can use the `setup` option in a custom [scenario](#scenario) if you need to log in.

### output

    -o, --output <file>        Write JSON output to a file

`fuite` generates a lot of data, but not all of it is shown in the CLI output. To dig deeper, use the `--output` option to create a JSON file containing `fuite`'s anlaysis. This contains additional information such as the line of code that an event listener was declared on.

### iterations

    -i, --iterations <number>

By default, `fuite` runs 7 iterations. But you can change this number.

Why 7? Well, it's a nice, small, prime number. If you repeat an action 7 times and some object is leaking exactly 7 times, it's pretty unlikely to be unrelated. That said, on a very complex page, there may be enough noise that 7 is too small to cut through the noise – so you might try 13, 17, or 19 instead. Or 1 if you like to live dangerously.

### Scenarios

    --scenario <scenario>

The default scenario is to find all internal links on the page, click them, and press the back button. You can also define a scenario file that does whatever you want:

```bash
fuite --scenario ./myScenario.js https://my-website.com
```

```js
// myScenario.js
export async function setup(page) {
  // Setup code to run before each test
}

export async function createTests(page) {
  // Code to run once on the page to determine which tests to run
}

export async function iteration(page, data) {
  // Run a single iteration against a page – e.g., click a link and then go back
}
```

Your `myScenario.js` can export several `async functions`. Here's what they do:

#### setup

The `setup` function takes a Puppeteer [page][] as input and returns undefined. It runs before each `iteration`, or before `createTests`. This is a good place to log in, if your webapp requires a login.

If this function is not defined, then no setup code will be run.

#### createTests

The `createTests` function takes a Puppeteer [page][] as input and returns an array of plain objects representing the tests to run, and the data to pass for each one. This is useful if you want to dynamically determine what tests to run against a page (for instance, which links to click).

If this function is not defined, then the default tests are `[{}]` (a single test with empty data).

#### iteration

The `iteration` function takes a Puppeteer [page][] and _iteration data_ as input and returns undefined. It runs for each iteration of the memory leak test. The _iteration data_ is a plain object and comes from the `createTests` function, so by default it is just an empty object: `{}`.

Inside of an `iteration`, you want to run the core test logic that you want to test for leaks. The idea is that, at the beginning of the iteration and at the end, the memory _should_ be the same.  So an iteration might do things like:

- Click a link, then go back
- Click to launch a modal dialog, then press the <kbd>Esc</kbd> key
- Hover to show a tooltip, then hover away to dismiss the tooltip
- Etc.

The iteration assumes that whatever page it starts at, it ends up at that same page. If you test a multi-page app in this way, then it's extremely unlikely you'll detect any leaks, since multi-page apps don't leak memory in the same way that SPAs do when navigating between routes.

### heapsnapshot

      -H, --heapsnapshot         Save heapsnapshot files

By default, `fuite` doesn't save any heap snapshot files that it captures (to avoid filling up your disk with large files). If you use the `--heapsnapshot` flag, though, then the files will be saved in the `/tmp` directory, and the CLI will output their location. That way, you can inspect them and load them into the [Chrome DevTools memory tool](https://developer.chrome.com/docs/devtools/memory-problems/#discover_detached_dom_tree_memory_leaks_with_heap_snapshots) yourself.

### debug

      -d, --debug                Run in debug mode

Debug mode lets you drill in to a complex scenario and debug it yourself using the Chrome DevTools. The best way to run it is:

```shell
NODE_OPTIONS=--inspect-brk fuite --debug <url>
```

Then navigate to `chrome:inspect` in Chrome, click "Open dedicated DevTools for Node," and now you are debugging `fuite` itself.

This will launch Chrome in non-headless mode, and it will also automatically pause before running iterations and afterwards. That way, you can open up the Chrome DevTools and analyze the scenario yourself, take your own heapsnapshots, etc.

# JavaScript API

`fuite` can also be used via a JavaScript API, which works similarly to the CLI:

```js
import { findLeaks } from 'fuite'

await findLeaks('https://my-website.com', {
  scenario: scenarioObject,
  heapsnapshot: false,
  debug: false
})
```

This returns the same output you would get using `--output <filename>` in the CLI – a plain object describing the leak. The format of the object is currently not specified and may change in the future. (Although `fuite` will do a major release if that's the case.)

# Limitations

`fuite` focuses on the main frame of a page. If you have memory leaks in cross-origin iframes or web workers, then the tool will not find those.

Similarly, `fuite` measures the JavaScript heap size of the page, corresponding to what you see in the Chrome DevTool's Memory tab. It ignores the size of native browser objects.

`fuite` works best when your source code is unminified. Otherwise the class names will show as the minified versions, which can be hard to debug.

`fuite` may use a lot of memory itself to analyze large heapsnapshot files. If you find that Node.js is running out of memory, you can run something like:

    NODE_OPTIONS=--max-old-space-size=8000 fuite <arguments>

The above command will provide 8GB of memory to `fuite`.

# FAQs

**It says my page's memory grew, but it also said it didn't detect any leaks. Why?**

Web pages can grow memory for lots of reasons. For instance, the browser's JavaScript engine may JIT certain functions, taking up additional memory. Or the browser might change its internal representation of strings or regexes.

The web developer generally doesn't have control over such things, so `fuite` tries to distinguish between browser-internal memory and JavaScript objects that the page owns. `fuite` will only say "leak detected" if it can actually give some actionable advice to the web developer.

**How do I debug leaking event listeners?**

Use the `--output` command to output a JSON file, which will contain a list of event listeners and the line of code they were declared on. Otherwise, you can use the Chrome DevTools to analyze event listeners:

- Elements panel -> Event Listeners
- `getEventListeners(node)` (works in the DevTools console)

**How do I debug leaking collections?**

Run `fuite` in debug mode:

    NODE_OPTIONS=--inspect-brk fuite https://my-website.com --debug

Then open `chrome:inspect` in Chrome and click "Open dedicated DevTools for Node." Then, when the breakpoint is hit, open the DevTools in Chrome and click the "Play" button to let the scenario keep running.

Eventually `fuite` will give you a breakpoint in the Chrome DevTools itself, where you have access to the leaking collection (Array, Map, etc.) and can inspect it.

Note that not every instance of a leaking collection is a serious memory leak: for instance, your router may keep some metadata about past routes in an ever-growing stack. Or your analytics library may store some timings in an array that continually grows. These are generally not a concern unless the objects are huge, or contain closures that reference lots of memory.

[page]: https://pptr.dev/#?product=Puppeteer&version=v12.0.1&show=api-class-page