// Copyright (c) 2020 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
export var escapeCharacters = function (inputString, charsToEscape) {
    var foundChar = false;
    for (var i = 0; i < charsToEscape.length; ++i) {
        if (inputString.indexOf(charsToEscape.charAt(i)) !== -1) {
            foundChar = true;
            break;
        }
    }
    if (!foundChar) {
        return String(inputString);
    }
    var result = '';
    for (var i = 0; i < inputString.length; ++i) {
        if (charsToEscape.indexOf(inputString.charAt(i)) !== -1) {
            result += '\\';
        }
        result += inputString.charAt(i);
    }
    return result;
};
export var tokenizeFormatString = function (formatString, formatters) {
    var tokens = [];
    function addStringToken(str) {
        if (!str) {
            return;
        }
        if (tokens.length && tokens[tokens.length - 1].type === "string" /* STRING */) {
            tokens[tokens.length - 1].value += str;
        }
        else {
            tokens.push({
                type: "string" /* STRING */,
                value: str
            });
        }
    }
    function addSpecifierToken(specifier, precision, substitutionIndex) {
        tokens.push({ type: "specifier" /* SPECIFIER */, specifier: specifier, precision: precision, substitutionIndex: substitutionIndex, value: undefined });
    }
    function addAnsiColor(code) {
        var types = { 3: 'color', 9: 'colorLight', 4: 'bgColor', 10: 'bgColorLight' };
        var colorCodes = ['black', 'red', 'green', 'yellow', 'blue', 'magenta', 'cyan', 'lightGray', '', 'default'];
        var colorCodesLight = ['darkGray', 'lightRed', 'lightGreen', 'lightYellow', 'lightBlue', 'lightMagenta', 'lightCyan', 'white', ''];
        var colors = { color: colorCodes, colorLight: colorCodesLight, bgColor: colorCodes, bgColorLight: colorCodesLight };
        var type = types[Math.floor(code / 10)];
        if (!type) {
            return;
        }
        var color = colors[type][code % 10];
        if (!color) {
            return;
        }
        tokens.push({
            type: "specifier" /* SPECIFIER */,
            specifier: 'c',
            value: { description: (type.startsWith('bg') ? 'background : ' : 'color: ') + color },
            precision: undefined,
            substitutionIndex: undefined
        });
    }
    var textStart = 0;
    var substitutionIndex = 0;
    var re = new RegExp("%%|%(?:(\\d+)\\$)?(?:\\.(\\d*))?([" + Object.keys(formatters).join('') + "])|\\u001b\\[(\\d+)m", 'g');
    for (var match = re.exec(formatString); match !== null; match = re.exec(formatString)) {
        var matchStart = match.index;
        if (matchStart > textStart) {
            addStringToken(formatString.substring(textStart, matchStart));
        }
        if (match[0] === '%%') {
            addStringToken('%');
        }
        else if (match[0].startsWith('%')) {
            var substitionString = match[1], precisionString = match[2], specifierString = match[3];
            if (substitionString && Number(substitionString) > 0) {
                substitutionIndex = Number(substitionString) - 1;
            }
            var precision = precisionString ? Number(precisionString) : -1;
            addSpecifierToken(specifierString, precision, substitutionIndex);
            ++substitutionIndex;
        }
        else {
            var code = Number(match[4]);
            addAnsiColor(code);
        }
        textStart = matchStart + match[0].length;
    }
    addStringToken(formatString.substring(textStart));
    return tokens;
};
export var format = function (formatString, substitutions, formatters, initialValue, append, tokenizedFormat) {
    if (!formatString || ((!substitutions || !substitutions.length) && formatString.search(/\u001b\[(\d+)m/) === -1)) {
        return { formattedResult: append(initialValue, formatString), unusedSubstitutions: substitutions };
    }
    function prettyFunctionName() {
        return 'String.format("' + formatString + '", "' + Array.prototype.join.call(substitutions, '", "') + '")';
    }
    function warn(msg) {
        console.warn(prettyFunctionName() + ': ' + msg);
    }
    function error(msg) {
        console.error(prettyFunctionName() + ': ' + msg);
    }
    var result = initialValue;
    var tokens = tokenizedFormat || tokenizeFormatString(formatString, formatters);
    var usedSubstitutionIndexes = {};
    var actualSubstitutions = substitutions || [];
    for (var _i = 0, tokens_1 = tokens; _i < tokens_1.length; _i++) {
        var token = tokens_1[_i];
        if (token.type === "string" /* STRING */) {
            result = append(result, token.value);
            continue;
        }
        if (token.type !== "specifier" /* SPECIFIER */) {
            error('Unknown token type "' + token.type + '" found.');
            continue;
        }
        if (!token.value && token.substitutionIndex !== undefined &&
            token.substitutionIndex >= actualSubstitutions.length) {
            // If there are not enough substitutions for the current substitutionIndex
            // just output the format specifier literally and move on.
            error('not enough substitution arguments. Had ' + actualSubstitutions.length + ' but needed ' +
                (token.substitutionIndex + 1) + ', so substitution was skipped.');
            result = append(result, '%' + ((token.precision !== undefined && token.precision > -1) ? token.precision : '') + token.specifier);
            continue;
        }
        if (!token.value && token.substitutionIndex !== undefined) {
            usedSubstitutionIndexes[token.substitutionIndex] = true;
        }
        if (token.specifier === undefined || !(token.specifier in formatters)) {
            // Encountered an unsupported format character, treat as a string.
            warn('unsupported format character \u201C' + token.specifier + '\u201D. Treating as a string.');
            var stringToAppend_1 = (token.value || token.substitutionIndex === undefined) ?
                '' :
                String(actualSubstitutions[token.substitutionIndex]);
            result = append(result, stringToAppend_1);
            continue;
        }
        var formatter = formatters[token.specifier];
        var valueToFormat = token.value ||
            (token.substitutionIndex !== undefined ? actualSubstitutions[token.substitutionIndex] : undefined);
        var stringToAppend = formatter(valueToFormat, token);
        result = append(result, stringToAppend);
    }
    var unusedSubstitutions = [];
    for (var i = 0; i < actualSubstitutions.length; ++i) {
        if (i in usedSubstitutionIndexes) {
            continue;
        }
        unusedSubstitutions.push(actualSubstitutions[i]);
    }
    return { formattedResult: result, unusedSubstitutions: unusedSubstitutions };
};
export var standardFormatters = {
    d: function (substitution) {
        return (!isNaN(substitution) ? substitution : 0);
    },
    f: function (substitution, token) {
        if (substitution && typeof substitution === 'number' && token.precision !== undefined && token.precision > -1) {
            substitution = substitution.toFixed(token.precision);
        }
        var precision = (token.precision !== undefined && token.precision > -1) ? Number(0).toFixed(token.precision) : '0';
        return !isNaN(substitution) ? substitution : precision;
    },
    s: function (substitution) {
        return substitution;
    }
};
var toHexadecimal = function (charCode, padToLength) {
    return charCode.toString(16).toUpperCase().padStart(padToLength, '0');
};
// Remember to update the third group in the regexps patternsToEscape and
// patternsToEscapePlusSingleQuote when adding new entries in this map.
var escapedReplacements = new Map([
    ['\b', '\\b'],
    ['\f', '\\f'],
    ['\n', '\\n'],
    ['\r', '\\r'],
    ['\t', '\\t'],
    ['\v', '\\v'],
    ['\'', '\\\''],
    ['\\', '\\\\'],
    ['<!--', '\\x3C!--'],
    ['<script', '\\x3Cscript'],
    ['</script', '\\x3C/script'],
]);
export var formatAsJSLiteral = function (content) {
    var patternsToEscape = /(\\|<(?:!--|\/?script))|(\p{Control})|(\p{Surrogate})/gu;
    var patternsToEscapePlusSingleQuote = /(\\|'|<(?:!--|\/?script))|(\p{Control})|(\p{Surrogate})/gu;
    var escapePattern = function (match, pattern, controlChar, loneSurrogate) {
        if (controlChar) {
            if (escapedReplacements.has(controlChar)) {
                // @ts-ignore https://github.com/microsoft/TypeScript/issues/13086
                return escapedReplacements.get(controlChar);
            }
            var twoDigitHex = toHexadecimal(controlChar.charCodeAt(0), 2);
            return '\\x' + twoDigitHex;
        }
        if (loneSurrogate) {
            var fourDigitHex = toHexadecimal(loneSurrogate.charCodeAt(0), 4);
            return '\\u' + fourDigitHex;
        }
        if (pattern) {
            return escapedReplacements.get(pattern) || '';
        }
        return match;
    };
    var escapedContent = '';
    var quote = '';
    if (!content.includes('\'')) {
        quote = '\'';
        escapedContent = content.replaceAll(patternsToEscape, escapePattern);
    }
    else if (!content.includes('"')) {
        quote = '"';
        escapedContent = content.replaceAll(patternsToEscape, escapePattern);
    }
    else if (!content.includes('`') && !content.includes('${')) {
        quote = '`';
        escapedContent = content.replaceAll(patternsToEscape, escapePattern);
    }
    else {
        quote = '\'';
        escapedContent = content.replaceAll(patternsToEscapePlusSingleQuote, escapePattern);
    }
    return "" + quote + escapedContent + quote;
};
export var vsprintf = function (formatString, substitutions) {
    return format(formatString, substitutions, standardFormatters, '', function (a, b) { return a + b; }).formattedResult;
};
export var sprintf = function (format) {
    var varArg = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        varArg[_i - 1] = arguments[_i];
    }
    return vsprintf(format, varArg);
};
export var toBase64 = function (inputString) {
    /* note to the reader: we can't use btoa here because we need to
     * support Unicode correctly. See the test cases for this function and
     * also
     * https://developer.mozilla.org/en-US/docs/Web/API/WindowBase64/Base64_encoding_and_decoding#The_Unicode_Problem
     */
    function encodeBits(b) {
        return b < 26 ? b + 65 : b < 52 ? b + 71 : b < 62 ? b - 4 : b === 62 ? 43 : b === 63 ? 47 : 65;
    }
    var encoder = new TextEncoder();
    var data = encoder.encode(inputString.toString());
    var n = data.length;
    var encoded = '';
    if (n === 0) {
        return encoded;
    }
    var shift;
    var v = 0;
    for (var i = 0; i < n; i++) {
        shift = i % 3;
        v |= data[i] << (16 >>> shift & 24);
        if (shift === 2) {
            encoded += String.fromCharCode(encodeBits(v >>> 18 & 63), encodeBits(v >>> 12 & 63), encodeBits(v >>> 6 & 63), encodeBits(v & 63));
            v = 0;
        }
    }
    if (shift === 0) {
        encoded += String.fromCharCode(encodeBits(v >>> 18 & 63), encodeBits(v >>> 12 & 63), 61, 61);
    }
    else if (shift === 1) {
        encoded += String.fromCharCode(encodeBits(v >>> 18 & 63), encodeBits(v >>> 12 & 63), encodeBits(v >>> 6 & 63), 61);
    }
    return encoded;
};
export var findIndexesOfSubString = function (inputString, searchString) {
    var matches = [];
    var i = inputString.indexOf(searchString);
    while (i !== -1) {
        matches.push(i);
        i = inputString.indexOf(searchString, i + searchString.length);
    }
    return matches;
};
export var findLineEndingIndexes = function (inputString) {
    var endings = findIndexesOfSubString(inputString, '\n');
    endings.push(inputString.length);
    return endings;
};
export var isWhitespace = function (inputString) {
    return /^\s*$/.test(inputString);
};
export var trimURL = function (url, baseURLDomain) {
    var result = url.replace(/^(https|http|file):\/\//i, '');
    if (baseURLDomain) {
        if (result.toLowerCase().startsWith(baseURLDomain.toLowerCase())) {
            result = result.substr(baseURLDomain.length);
        }
    }
    return result;
};
export var collapseWhitespace = function (inputString) {
    return inputString.replace(/[\s\xA0]+/g, ' ');
};
export var reverse = function (inputString) {
    return inputString.split('').reverse().join('');
};
export var replaceControlCharacters = function (inputString) {
    // Replace C0 and C1 control character sets with replacement character.
    // Do not replace '\t', \n' and '\r'.
    return inputString.replace(/[\0-\x08\x0B\f\x0E-\x1F\x80-\x9F]/g, '\uFFFD');
};
export var countWtf8Bytes = function (inputString) {
    var count = 0;
    for (var i = 0; i < inputString.length; i++) {
        var c = inputString.charCodeAt(i);
        if (c <= 0x7F) {
            count++;
        }
        else if (c <= 0x07FF) {
            count += 2;
        }
        else if (c < 0xD800 || 0xDFFF < c) {
            count += 3;
        }
        else {
            if (c <= 0xDBFF && i + 1 < inputString.length) {
                // The current character is a leading surrogate, and there is a
                // next character.
                var next = inputString.charCodeAt(i + 1);
                if (0xDC00 <= next && next <= 0xDFFF) {
                    // The next character is a trailing surrogate, meaning this
                    // is a surrogate pair.
                    count += 4;
                    i++;
                    continue;
                }
            }
            count += 3;
        }
    }
    return count;
};
export var stripLineBreaks = function (inputStr) {
    return inputStr.replace(/(\r)?\n/g, '');
};
export var toTitleCase = function (inputStr) {
    return inputStr.substring(0, 1).toUpperCase() + inputStr.substring(1);
};
export var removeURLFragment = function (inputStr) {
    var url = new URL(inputStr);
    url.hash = '';
    return url.toString();
};
var SPECIAL_REGEX_CHARACTERS = '^[]{}()\\.^$*+?|-,';
export var regexSpecialCharacters = function () {
    return SPECIAL_REGEX_CHARACTERS;
};
export var filterRegex = function (query) {
    var regexString = '';
    for (var i = 0; i < query.length; ++i) {
        var c = query.charAt(i);
        if (SPECIAL_REGEX_CHARACTERS.indexOf(c) !== -1) {
            c = '\\' + c;
        }
        if (i) {
            regexString += '[^\\0' + c + ']*';
        }
        regexString += c;
    }
    return new RegExp(regexString, 'i');
};
export var createSearchRegex = function (query, caseSensitive, isRegex) {
    var regexFlags = caseSensitive ? 'g' : 'gi';
    var regexObject;
    if (isRegex) {
        try {
            regexObject = new RegExp(query, regexFlags);
        }
        catch (e) {
            // Silent catch.
        }
    }
    if (!regexObject) {
        regexObject = createPlainTextSearchRegex(query, regexFlags);
    }
    return regexObject;
};
export var caseInsensetiveComparator = function (a, b) {
    a = a.toUpperCase();
    b = b.toUpperCase();
    if (a === b) {
        return 0;
    }
    return a > b ? 1 : -1;
};
export var hashCode = function (string) {
    if (!string) {
        return 0;
    }
    // Hash algorithm for substrings is described in "Über die Komplexität der Multiplikation in
    // eingeschränkten Branchingprogrammmodellen" by Woelfe.
    // http://opendatastructures.org/versions/edition-0.1d/ods-java/node33.html#SECTION00832000000000000000
    var p = ((1 << 30) * 4 - 5); // prime: 2^32 - 5
    var z = 0x5033d967; // 32 bits from random.org
    var z2 = 0x59d2f15d; // random odd 32 bit number
    var s = 0;
    var zi = 1;
    for (var i = 0; i < string.length; i++) {
        var xi = string.charCodeAt(i) * z2;
        s = (s + zi * xi) % p;
        zi = (zi * z) % p;
    }
    s = (s + zi * (p - 1)) % p;
    return Math.abs(s | 0);
};
export var compare = function (a, b) {
    if (a > b) {
        return 1;
    }
    if (a < b) {
        return -1;
    }
    return 0;
};
export var trimMiddle = function (str, maxLength) {
    if (str.length <= maxLength) {
        return String(str);
    }
    var leftHalf = maxLength >> 1;
    var rightHalf = maxLength - leftHalf - 1;
    if (str.codePointAt(str.length - rightHalf - 1) >= 0x10000) {
        --rightHalf;
        ++leftHalf;
    }
    if (leftHalf > 0 && str.codePointAt(leftHalf - 1) >= 0x10000) {
        --leftHalf;
    }
    return str.substr(0, leftHalf) + '…' + str.substr(str.length - rightHalf, rightHalf);
};
export var trimEndWithMaxLength = function (str, maxLength) {
    if (str.length <= maxLength) {
        return String(str);
    }
    return str.substr(0, maxLength - 1) + '…';
};
export var escapeForRegExp = function (str) {
    return escapeCharacters(str, SPECIAL_REGEX_CHARACTERS);
};
export var naturalOrderComparator = function (a, b) {
    var chunk = /^\d+|^\D+/;
    var chunka, chunkb, anum, bnum;
    while (true) {
        if (a) {
            if (!b) {
                return 1;
            }
        }
        else {
            if (b) {
                return -1;
            }
            return 0;
        }
        chunka = a.match(chunk)[0];
        chunkb = b.match(chunk)[0];
        anum = !Number.isNaN(Number(chunka));
        bnum = !Number.isNaN(Number(chunkb));
        if (anum && !bnum) {
            return -1;
        }
        if (bnum && !anum) {
            return 1;
        }
        if (anum && bnum) {
            var diff = Number(chunka) - Number(chunkb);
            if (diff) {
                return diff;
            }
            if (chunka.length !== chunkb.length) {
                if (!Number(chunka) && !Number(chunkb)) { // chunks are strings of all 0s (special case)
                    return chunka.length - chunkb.length;
                }
                return chunkb.length - chunka.length;
            }
        }
        else if (chunka !== chunkb) {
            return (chunka < chunkb) ? -1 : 1;
        }
        a = a.substring(chunka.length);
        b = b.substring(chunkb.length);
    }
};
export var base64ToSize = function (content) {
    if (!content) {
        return 0;
    }
    var size = content.length * 3 / 4;
    if (content[content.length - 1] === '=') {
        size--;
    }
    if (content.length > 1 && content[content.length - 2] === '=') {
        size--;
    }
    return size;
};
export var SINGLE_QUOTE = '\'';
export var DOUBLE_QUOTE = '"';
var BACKSLASH = '\\';
export var findUnclosedCssQuote = function (str) {
    var unmatchedQuote = '';
    for (var i = 0; i < str.length; ++i) {
        var char = str[i];
        if (char === BACKSLASH) {
            i++;
            continue;
        }
        if (char === SINGLE_QUOTE || char === DOUBLE_QUOTE) {
            if (unmatchedQuote === char) {
                unmatchedQuote = '';
            }
            else if (unmatchedQuote === '') {
                unmatchedQuote = char;
            }
        }
    }
    return unmatchedQuote;
};
export var createPlainTextSearchRegex = function (query, flags) {
    // This should be kept the same as the one in StringUtil.cpp.
    var regex = '';
    for (var i = 0; i < query.length; ++i) {
        var c = query.charAt(i);
        if (regexSpecialCharacters().indexOf(c) !== -1) {
            regex += '\\';
        }
        regex += c;
    }
    return new RegExp(regex, flags || '');
};
