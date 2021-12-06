# fuite
A tool for finding memory leaks in web apps.


# Limitations

`fuite` focuses on the main frame of a page. If you have memory leaks in cross-origin iframes or web workers, then the tool will not find those.

Similarly, `fuite` measures the JavaScript heap size of the page, corresponding to what you see in the Chrome DevTool's Memory tab. It ignores the size of native browser objects.