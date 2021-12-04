/*
 * Copyright (C) 2013 Google Inc. All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are
 * met:
 *
 *     * Redistributions of source code must retain the above copyright
 * notice, this list of conditions and the following disclaimer.
 *     * Redistributions in binary form must reproduce the above
 * copyright notice, this list of conditions and the following disclaimer
 * in the documentation and/or other materials provided with the
 * distribution.
 *     * Neither the name of Google Inc. nor the names of its
 * contributors may be used to endorse or promote products derived from
 * this software without specific prior written permission.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS
 * "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT
 * LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR
 * A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT
 * OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL,
 * SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
 * LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE,
 * DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY
 * THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
 * (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
 * OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */
import * as Platform from './platform.js';
import { SearchMatch } from './ContentProvider.js';
import { Text } from './Text.js';
export var Utils = {
    // TODO(crbug.com/1172300) Ignored during the jsdoc to ts migration
    // eslint-disable-next-line @typescript-eslint/naming-convention
    get _keyValueFilterRegex() {
        return /(?:^|\s)(\-)?([\w\-]+):([^\s]+)/;
    },
    // TODO(crbug.com/1172300) Ignored during the jsdoc to ts migration
    // eslint-disable-next-line @typescript-eslint/naming-convention
    get _regexFilterRegex() {
        return /(?:^|\s)(\-)?\/([^\s]+)\//;
    },
    // TODO(crbug.com/1172300) Ignored during the jsdoc to ts migration
    // eslint-disable-next-line @typescript-eslint/naming-convention
    get _textFilterRegex() {
        return /(?:^|\s)(\-)?([^\s]+)/;
    },
    // TODO(crbug.com/1172300) Ignored during the jsdoc to ts migration
    // eslint-disable-next-line @typescript-eslint/naming-convention
    get _SpaceCharRegex() {
        return /\s/;
    },
    /**
     * @enum {string}
     */
    // TODO(crbug.com/1172300) Ignored during the jsdoc to ts migration
    // eslint-disable-next-line @typescript-eslint/naming-convention
    get Indent() {
        return { TwoSpaces: '  ', FourSpaces: '    ', EightSpaces: '        ', TabCharacter: '\t' };
    },
    isStopChar: function (char) {
        return (char > ' ' && char < '0') || (char > '9' && char < 'A') || (char > 'Z' && char < '_') ||
            (char > '_' && char < 'a') || (char > 'z' && char <= '~');
    },
    isWordChar: function (char) {
        return !Utils.isStopChar(char) && !Utils.isSpaceChar(char);
    },
    isSpaceChar: function (char) {
        return Utils._SpaceCharRegex.test(char);
    },
    isWord: function (word) {
        for (var i = 0; i < word.length; ++i) {
            if (!Utils.isWordChar(word.charAt(i))) {
                return false;
            }
        }
        return true;
    },
    isOpeningBraceChar: function (char) {
        return char === '(' || char === '{';
    },
    isClosingBraceChar: function (char) {
        return char === ')' || char === '}';
    },
    isBraceChar: function (char) {
        return Utils.isOpeningBraceChar(char) || Utils.isClosingBraceChar(char);
    },
    textToWords: function (text, isWordChar, wordCallback) {
        var startWord = -1;
        for (var i = 0; i < text.length; ++i) {
            if (!isWordChar(text.charAt(i))) {
                if (startWord !== -1) {
                    wordCallback(text.substring(startWord, i));
                }
                startWord = -1;
            }
            else if (startWord === -1) {
                startWord = i;
            }
        }
        if (startWord !== -1) {
            wordCallback(text.substring(startWord));
        }
    },
    lineIndent: function (line) {
        var indentation = 0;
        while (indentation < line.length && Utils.isSpaceChar(line.charAt(indentation))) {
            ++indentation;
        }
        return line.substr(0, indentation);
    },
    isUpperCase: function (text) {
        return text === text.toUpperCase();
    },
    isLowerCase: function (text) {
        return text === text.toLowerCase();
    },
    splitStringByRegexes: function (text, regexes) {
        var matches = [];
        var globalRegexes = [];
        for (var i = 0; i < regexes.length; i++) {
            var regex = regexes[i];
            if (!regex.global) {
                globalRegexes.push(new RegExp(regex.source, regex.flags ? regex.flags + 'g' : 'g'));
            }
            else {
                globalRegexes.push(regex);
            }
        }
        doSplit(text, 0, 0);
        return matches;
        function doSplit(text, regexIndex, startIndex) {
            if (regexIndex >= globalRegexes.length) {
                // Set regexIndex as -1 if text did not match with any regular expression
                matches.push({ value: text, position: startIndex, regexIndex: -1, captureGroups: [] });
                return;
            }
            var regex = globalRegexes[regexIndex];
            var currentIndex = 0;
            var result;
            regex.lastIndex = 0;
            while ((result = regex.exec(text)) !== null) {
                var stringBeforeMatch = text.substring(currentIndex, result.index);
                if (stringBeforeMatch) {
                    doSplit(stringBeforeMatch, regexIndex + 1, startIndex + currentIndex);
                }
                var match = result[0];
                matches.push({
                    value: match,
                    position: startIndex + result.index,
                    regexIndex: regexIndex,
                    captureGroups: result.slice(1)
                });
                currentIndex = result.index + match.length;
            }
            var stringAfterMatches = text.substring(currentIndex);
            if (stringAfterMatches) {
                doSplit(stringAfterMatches, regexIndex + 1, startIndex + currentIndex);
            }
        }
    }
};
var FilterParser = /** @class */ (function () {
    function FilterParser(keys) {
        this.keys = keys;
    }
    FilterParser.cloneFilter = function (filter) {
        return { key: filter.key, text: filter.text, regex: filter.regex, negative: filter.negative };
    };
    FilterParser.prototype.parse = function (query) {
        var splitFilters = Utils.splitStringByRegexes(query, [Utils._keyValueFilterRegex, Utils._regexFilterRegex, Utils._textFilterRegex]);
        var parsedFilters = [];
        for (var _i = 0, splitFilters_1 = splitFilters; _i < splitFilters_1.length; _i++) {
            var _a = splitFilters_1[_i], regexIndex = _a.regexIndex, captureGroups = _a.captureGroups;
            if (regexIndex === -1) {
                continue;
            }
            if (regexIndex === 0) {
                var startsWithMinus = captureGroups[0];
                var parsedKey = captureGroups[1];
                var parsedValue = captureGroups[2];
                if (this.keys.indexOf(parsedKey) !== -1) {
                    parsedFilters.push({
                        key: parsedKey,
                        regex: undefined,
                        text: parsedValue,
                        negative: Boolean(startsWithMinus)
                    });
                }
                else {
                    parsedFilters.push({
                        key: undefined,
                        regex: undefined,
                        text: parsedKey + ":" + parsedValue,
                        negative: Boolean(startsWithMinus)
                    });
                }
            }
            else if (regexIndex === 1) {
                var startsWithMinus = captureGroups[0];
                var parsedRegex = captureGroups[1];
                try {
                    parsedFilters.push({
                        key: undefined,
                        regex: new RegExp(parsedRegex, 'i'),
                        text: undefined,
                        negative: Boolean(startsWithMinus)
                    });
                }
                catch (e) {
                    parsedFilters.push({
                        key: undefined,
                        regex: undefined,
                        text: "/" + parsedRegex + "/",
                        negative: Boolean(startsWithMinus)
                    });
                }
            }
            else if (regexIndex === 2) {
                var startsWithMinus = captureGroups[0];
                var parsedText = captureGroups[1];
                parsedFilters.push({
                    key: undefined,
                    regex: undefined,
                    text: parsedText,
                    negative: Boolean(startsWithMinus)
                });
            }
        }
        return parsedFilters;
    };
    return FilterParser;
}());
export { FilterParser };
var BalancedJSONTokenizer = /** @class */ (function () {
    function BalancedJSONTokenizer(callback, findMultiple) {
        this.callback = callback;
        this.index = 0;
        this.balance = 0;
        this.buffer = '';
        this.findMultiple = findMultiple || false;
        this.closingDoubleQuoteRegex = /[^\\](?:\\\\)*"/g;
    }
    BalancedJSONTokenizer.prototype.write = function (chunk) {
        this.buffer += chunk;
        var lastIndex = this.buffer.length;
        var buffer = this.buffer;
        var index;
        for (index = this.index; index < lastIndex; ++index) {
            var character = buffer[index];
            if (character === '"') {
                this.closingDoubleQuoteRegex.lastIndex = index;
                if (!this.closingDoubleQuoteRegex.test(buffer)) {
                    break;
                }
                index = this.closingDoubleQuoteRegex.lastIndex - 1;
            }
            else if (character === '{') {
                ++this.balance;
            }
            else if (character === '}') {
                --this.balance;
                if (this.balance < 0) {
                    this.reportBalanced();
                    return false;
                }
                if (!this.balance) {
                    this.lastBalancedIndex = index + 1;
                    if (!this.findMultiple) {
                        break;
                    }
                }
            }
            else if (character === ']' && !this.balance) {
                this.reportBalanced();
                return false;
            }
        }
        this.index = index;
        this.reportBalanced();
        return true;
    };
    BalancedJSONTokenizer.prototype.reportBalanced = function () {
        if (!this.lastBalancedIndex) {
            return;
        }
        this.callback(this.buffer.slice(0, this.lastBalancedIndex));
        this.buffer = this.buffer.slice(this.lastBalancedIndex);
        this.index -= this.lastBalancedIndex;
        this.lastBalancedIndex = 0;
    };
    BalancedJSONTokenizer.prototype.remainder = function () {
        return this.buffer;
    };
    return BalancedJSONTokenizer;
}());
export { BalancedJSONTokenizer };
export function isMinified(text) {
    var kMaxNonMinifiedLength = 500;
    var linesToCheck = 10;
    var lastPosition = 0;
    do {
        var eolIndex = text.indexOf('\n', lastPosition);
        if (eolIndex < 0) {
            eolIndex = text.length;
        }
        if (eolIndex - lastPosition > kMaxNonMinifiedLength && text.substr(lastPosition, 3) !== '//#') {
            return true;
        }
        lastPosition = eolIndex + 1;
    } while (--linesToCheck >= 0 && lastPosition < text.length);
    // Check the end of the text as well
    linesToCheck = 10;
    lastPosition = text.length;
    do {
        var eolIndex = text.lastIndexOf('\n', lastPosition);
        if (eolIndex < 0) {
            eolIndex = 0;
        }
        if (lastPosition - eolIndex > kMaxNonMinifiedLength && text.substr(lastPosition, 3) !== '//#') {
            return true;
        }
        lastPosition = eolIndex - 1;
    } while (--linesToCheck >= 0 && lastPosition > 0);
    return false;
}
export var performSearchInContent = function (content, query, caseSensitive, isRegex) {
    var regex = Platform.StringUtilities.createSearchRegex(query, caseSensitive, isRegex);
    var text = new Text(content);
    var result = [];
    for (var i = 0; i < text.lineCount(); ++i) {
        var lineContent = text.lineAt(i);
        regex.lastIndex = 0;
        var match = regex.exec(lineContent);
        if (match) {
            result.push(new SearchMatch(i, lineContent, match.index));
        }
    }
    return result;
};
