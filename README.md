# fuite

> **fuite** _/fɥit/_ French for "leak" 

`fuite` is a CLI tool for finding memory leaks in web apps.

[Introductory blog post](https://nolanlawson.com/2021/12/17/introducing-fuite-a-tool-for-finding-memory-leaks-in-web-apps/)

[Tutorial video](https://youtu.be/H0BHL2lo89M)

# Usage

```shell
npx fuite https://example.com
```

This will check for leaks and print output to stdout.

By default, `fuite` will assume that the site is a client-rendered webapp, and it will search for internal links on the given page. Then for each link, it will:

1. Click the link
2. Press the browser back button
3. Repeat to see if the scenario is leaking

For other scenarios, see [scenarios](#scenario).

# How it works

`fuite` launches Chrome using Puppeteer, loads a web page, and runs a scenario against it. It runs the scenario some number of iterations (7 by default) and looks for objects that leaked 7 times (or 14 times, or 28 times). This might sound like a strange approach, but it's useful for [cutting through the noise](https://nolanlawson.com/2020/02/19/fixing-memory-leaks-in-web-applications/) in memory analysis.

`fuite` looks for the following leaks:

- Objects (captured with Chrome [heap snapshots](https://developer.chrome.com/docs/devtools/memory-problems/heap-snapshots/))
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
  -S, --setup <setup>        Setup function to run
  -H, --heapsnapshot         Save heapsnapshot files
  -d, --debug                Run in debug mode
  -p, --progress             Show progress spinner (use --no-progress to disable)
  -b, --browser-arg <arg>    Arg(s) to pass when launching the browser
  -V, --version              output the version number
  -h, --help                 display help for command
```

## URL

    fuite <url>

The URL to load. This should be whatever landing page you want to start at. Note that you can use [`--setup`](#setup) for a custom setup function (e.g. to log in with a username/password).

## Output

    -o, --output <file>

`fuite` generates a lot of data, but not all of it is shown in the CLI output. To dig deeper, use the `--output` option to create a JSON file containing `fuite`'s analysis. This contains additional information such as the line of code that an event listener was declared on.

Anything that you see in the CLI, you can also find in the output JSON file.

## Iterations

    -i, --iterations <number>

By default, `fuite` runs 7 iterations. But you can change this number.

Why 7? Well, it's a nice, small, prime number. If you repeat an action 7 times and some object is leaking exactly 7 times, it's pretty unlikely to be unrelated. That said, on a very complex page, there may be enough noise that 7 is too small to cut through the noise – so you might try 13, 17, or 19 instead. Or 1 if you like to live dangerously.

## Scenario

    --scenario <scenario>

The default scenario is to find all internal links on the page, click them, and press the back button. You can also define a scenario file that does whatever you want:

```bash
fuite --scenario ./myScenario.mjs https://example.com
```

Your `myScenario.mjs` can export several `async function`s, most of which are optional.

Here is a template:

```js
// myScenario.mjs

/**
 * OPTIONAL: Setup code to run before each test
 * @param { import("puppeteer").Page } page
*/
export async function setup(page) {
}

/**
 * OPTIONAL: Code to run once on the page to determine which tests to run
 * @param { import("puppeteer").Page } page
 */
export async function createTests(page) {
}

/**
 * REQUIRED: Run a single iteration against a page – e.g., click a link and then go back
 * @param { import("puppeteer").Page } page
 * @param { any } data
 */
export async function iteration(page, data) {
}

/**
 * OPTIONAL: Teardown code to run after each test
 * @param { import("puppeteer").Page } page
 */
export async function teardown(page) {
}

/**
 * OPTIONAL: Code to wait asynchronously for the page to become idle
 * @param { import("puppeteer").Page } page
 */
export async function waitForIdle(page) {
}
```

You can delete any optional functions you don't need.

Note that your scenario file can also [extend the default scenario](#extending-the-default-scenario).

### `setup` function (optional)

The async `setup` function takes a Puppeteer [Page][] as input and returns undefined. It runs before each `iteration`, or before `createTests`. This is a good place to log in, if your webapp requires a login.

If this function is not defined, then no setup code will be run.

Note that there is also a [`--setup` flag](#setup). If defined, it will override the `setup` function defined in a scenario.

### `createTests` function (optional)

The async `createTests` function takes a Puppeteer [Page][] as input and returns an array of _test data objects_ representing the tests to run, and the data to pass for each one. This is useful if you want to dynamically determine what tests to run against a page (for instance, which links to click).

If `createTests` is not defined, then the default tests are `[{}]` (a single test with empty data).

The basic shape for a test data object is like so:

```json
{
  "description": "Some human-readable description",
  "data": {
    "some data": "which is passed to the test"
  }
}
```

For instance, your `createTests` might return:

```json
[
  {
    "description": "My test 1",
    "data": { "foo": "foo" }
  },
  {
    "description": "My test 2",
    "data": { "foo": "bar" }
  }
]
```

### `iteration` function (required)

The async `iteration` function takes a Puppeteer [Page][] and _iteration data_ as input and returns undefined. It runs for each iteration of the memory leak test. The _iteration data_ is a plain object and comes from the `createTests` function, so by default it is just an empty object: `{}`.

Inside of an `iteration`, you want to run the core test logic that you want to test for leaks. The idea is that, at the beginning of the iteration and at the end, the memory _should_ be the same.  So an iteration might do things like:

- Click a link, then go back
- Click to launch a modal dialog, then press the <kbd>Esc</kbd> key
- Hover to show a tooltip, then hover away to dismiss the tooltip
- Etc.

The iteration assumes that whatever page it starts at, it ends up at that same page. If you test a multi-page app in this way, then it's extremely unlikely you'll detect any leaks, since multi-page apps don't leak memory in the same way that SPAs do when navigating between routes.

### `teardown` function (optional)

The async `teardown` function takes a Puppeteer [Page][] as input and returns undefined. It runs after each `iteration`, or after `createTests`.

If this function is not defined, then no teardown code will be run.

### `waitForIdle` function (optional)

The async `waitForIdle` function takes a Puppeteer [Page][] and should resolve when the page is considered "idle."

Here is an example idle check:

```js
export async function waitForIdle(page) {
  await new Promise(resolve => setTimeout(resolve, 2000)) // wait 2 seconds
  await page.waitForSelector('#my-element') // wait for element
}
```

If this function is not defined, then the default idle check is used. The default is based on heuristics, using the network idle and main thread idle.

## Setup

    --setup <setup>

The `--setup` option can define a custom `setup` function, which runs immediately after the page is loaded, but before any other scenario code.

For instance, you can use `--setup` to log in with a username/password. To do so, first create a file called `mySetup.mjs`:

```js
export async function setup (page) {
  await page.type('#username', 'myusername');
  await page.type('#password', 'mypassword');
  await page.click('#submit');
}
```

Then pass it in:

```shell
npx fuite https://example.com --setup ./mySetup.mjs
```

The [`setup` function](#setup-function-optional) defined here is the same one that you can define in a custom scenario using [`--scenario`](#scenario) (i.e. it takes a Puppeteer [Page][] as input).

If both `--scenario` and `--setup` are defined, then `--setup` will override the `setup` function in the scenario.

## Heap snapshot

      -H, --heapsnapshot         Save heapsnapshot files

By default, `fuite` doesn't save any heap snapshot files that it captures (to avoid filling up your disk with large files). If you use the `--heapsnapshot` flag, though, then the files will be saved in the `/tmp` directory, and the CLI will output their location. That way, you can inspect them and load them into the [Chrome DevTools memory tool](https://developer.chrome.com/docs/devtools/memory-problems/#discover_detached_dom_tree_memory_leaks_with_heap_snapshots) yourself.

## Debug

      -d, --debug                Run in debug mode

Debug mode lets you drill in to a complex scenario and debug it yourself using the Chrome DevTools. The best way to run it is:

```shell
NODE_OPTIONS=--inspect-brk fuite --debug <url>
```

(Note that `NODE_OPTIONS` will _not_ work if you run `npx fuite`. So you have to install `fuite` locally or globally, e.g. using `npm i -g fuite`.)

Then navigate to `chrome:inspect` in Chrome, click "Open dedicated DevTools for Node," and now you are debugging `fuite` itself.

This will launch Chrome in non-headless mode, and it will also automatically pause before running iterations and afterwards. That way, you can open up the Chrome DevTools and analyze the scenario yourself, take your own heap snapshots, etc.

## Progress

    -p, --progress             Show progress spinner (use --no-progress to disable)

Enable or disable the progress spinner while the test runs. It's true by default, so you should use `--no-progress` to disable.

## Browser args

    -b, --browser-arg <arg>   Arg(s) to pass when launching the browser

This allows you to pass args (aka flags) into Puppeteer when launching the browser. You can define multiple args,
and they are passed ver batim to [Puppeteer's launch `args` option](https://pptr.dev/#?product=Puppeteer&version=v13.0.1&show=api-puppeteerlaunchoptions).

For example:

```shell
fuite <url> -b --use-fake-device-for-media-stream -b --enable-experimental-web-platform-features
```

# JavaScript API

`fuite` can also be used via a JavaScript API, which works similarly to the CLI:

```js
import { findLeaks } from 'fuite';

const results = findLeaks('https://example.com', {
  scenario: scenarioObject,
  iterations: 7,
  heapsnapshot: false,
  debug: false,
  progress: true,
  browserArgs: ['--use-fake-device-for-media-stream']
});
for await (const result of results) {
  console.log(result);
}
```

Note that `findLeaks` returns an [async iterable](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/for-await...of).

This returns the same output you would get using `--output <filename>` in the CLI – a plain object describing the leak. The format of the object is not fully specified yet, but a basic shape can be found in [the TypeScript types](https://github.com/nolanlawson/fuite/blob/master/types/index.d.ts).

## Options

The options for `findLeaks` are basically the same as for the CLI. The only differences between the JavaScript API and the CLI are:

- `scenario` takes an object with keys `setup`, `createTests`, and `iteration` rather than a filename (see [Scenario object](#scenario-object) and [Extending the default scenario](#extending-the-default-scenario) below).
- `setup` is not supported – use `scenario` instead.
- `signal` can be used to cancel the test (see [Cancel the test](#cancel-the-test) below).

### Cancel the test

You can pass in an [`AbortSignal`](https://developer.mozilla.org/en-US/docs/Web/API/AbortSignal) as the `signal` option to cancel the test on-demand:

```js
const controller = new AbortController();
const { signal } = controller;
findLeaks('https://example.com', { signal });

// Later
controller.abort();
```

## Scenario object

For the JavaScript API, you can pass in a custom scenario as a plain object. First, define it:

```js
const myScenario = {
  async setup(page) { /* ... */ },
  async createTests(page) { /* ... */ },
  async iteration(page, data) { /* ... */ },
  async teardown(page) { /* ... */ }
};
```

Then pass it in:

```js
import { findLeaks } from 'fuite';

for await (const result of findLeaks('https://example.com', {
  scenario: myScenario
})) {
  console.log(result);
}
```

If `scenario` is undefined, then the default scenario will be used.

### Extending the default scenario

If you're writing your own custom scenario, you can also extend the default scenario. For instance, if you want the default scenario, but to be able to log in with a username and password first:

```js
import { defaultScenario, findLeaks } from 'fuite';

const myScenario = {
  ...defaultScenario,
  async setup(page) {
    await page.type('#username', 'myusername')
    await page.type('#password', 'mypassword')
    await page.click('#submit')
  }
};

for await (const result of findLeaks('https://example.com', {
  scenario: myScenario
})) {
  console.log(result);
}
```

Note that the above works if you're using the JavaScript API. For the CLI, you probably want to use [the `--setup` flag](#setup).

# Limitations

`fuite` focuses on the main frame of a page. If you have memory leaks in cross-origin iframes or web workers, then the tool will not find those.

Similarly, `fuite` measures the JavaScript heap size of the page, corresponding to what you see in the Chrome DevTool's Memory tab. It ignores the size of native browser objects.

`fuite` works best when your source code is unminified. Otherwise, the class names will show as the minified versions, which can be hard to debug.

`fuite` may use a lot of memory itself to analyze large heap snapshot files. If you find that Node.js is running out of memory, you can run something like:

    NODE_OPTIONS=--max-old-space-size=8000 fuite <url>

The above command will provide 8GB of memory to `fuite`. (Note that `NODE_OPTIONS` will not work if you run `npx fuite`; you have to run `fuite` directly, e.g. by running `npm i -g fuite` first.)

# FAQs

**The results seem wrong or inconsistent.**

Try running with `--iterations 13` or `--iterations 17`.  The default of 7 iterations is decent, but it might report some false positives.

**It says I'm leaking 1kB. Do I really need to fix this?**

Not every memory leak is a serious problem. If you're only leaking a few kBs on every interaction, then the user will probably never notice, and you'll certainly never hit an Out Of Memory error in the browser. Your ceiling for "acceptable leaks" will differ, though, depending on your use case. E.g., if you're building for embedded devices, then you probably want to keep your memory usage much lower.

**It says my page's memory grew, but it also said it didn't detect any leaks. Why?**

Web pages can grow memory for lots of reasons. For instance, the browser's JavaScript engine may JIT certain functions, taking up additional memory. Or the browser may decide to use certain internal data structures to prioritize CPU over memory usage.

The web developer generally doesn't have control over such things, so `fuite` tries to distinguish between browser-internal memory and JavaScript objects that the page owns. `fuite` will only say "leak detected" if it can actually give some actionable advice to the web developer.

**How do I debug leaking event listeners?**

Use the `--output` command to output a JSON file, which will contain a list of event listeners and the line of code they were declared on. Otherwise, you can use the Chrome DevTools to analyze event listeners:

- Open the DevTools
- Open the Elements panel
- Open Event Listeners
- Alternatively, run `getEventListeners(node)` in the DevTools console

**How do I debug leaking collections?**

`fuite` will analyze your leaking collections and print out a stacktrace of which code caused the increase –
for instance, `push`ing to an Array, or `set`ing a Map. So this is the first place to look.

If you have sourcemaps, it will show the original source. Otherwise, it'll show the raw stacktrace.

Sometimes more than one thing is increasing the size, and not every increase is at fault (e.g. it deletes right after).
In those cases, you should use `--output` and look at the JSON output to see the full list of stacktraces.

In some other cases, `fuite` is not able to track increases in collections. (E.g. the object disallows modifications, or the code uses `Array.prototype.push.call()` instead of `.push()`ing directly.)

In those cases, you may have to do a manual analysis. Below is how you can do that.

First, run `fuite` in debug mode:

    NODE_OPTIONS=--inspect-brk fuite https://example.com --debug

Then open `chrome:inspect` in Chrome and click "Open dedicated DevTools for Node." Then, when the breakpoint is hit, open the DevTools in Chromium (the one running your website) and click the "Play" button to let the scenario keep running.

Eventually `fuite` will give you a breakpoint in the Chrome DevTools itself, where you have access to the leaking collection (Array, Map, etc.) and can inspect it.

It will also give you `debugger` breakpoints on when the collection is increasing (e.g. `push`, `set`, etc.). For plain objects, it tries to override the prototype and spy on setters to accomplish this.

Note that not every leaking collection is a serious memory leak: for instance, your router may keep some metadata about past routes in an ever-growing stack. Or your analytics library may store some timings in an array that continually grows. These are generally not a concern unless the objects are huge, or contain closures that reference lots of memory.

**Why not support multiple browsers?**

Currently `fuite` requires Chromium-specific tools such as heap snapshots, `getEventListeners`, `queryObjects`, and other things that are only available with Chromium and the Chrome DevTools Protocol (CDP). Potentially, such things could be accessible in a cross-browser way, but today it just isn't possible.

That said, if something is leaking in Chrome, it's likely leaking in Safari and Firefox too.

[Page]: https://pptr.dev/#?product=Puppeteer&version=v12.0.1&show=api-class-page
