// Copyright 2016 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
import * as Platform from './platform.js';
import { TextCursor } from './TextCursor.js';
import { SourceRange, TextRange } from './TextRange.js';
var Text = /** @class */ (function () {
    function Text(value) {
        this.valueInternal = value;
    }
    Text.prototype.lineEndings = function () {
        if (!this.lineEndingsInternal) {
            this.lineEndingsInternal = Platform.StringUtilities.findLineEndingIndexes(this.valueInternal);
        }
        return this.lineEndingsInternal;
    };
    Text.prototype.value = function () {
        return this.valueInternal;
    };
    Text.prototype.lineCount = function () {
        var lineEndings = this.lineEndings();
        return lineEndings.length;
    };
    Text.prototype.offsetFromPosition = function (lineNumber, columnNumber) {
        return (lineNumber ? this.lineEndings()[lineNumber - 1] + 1 : 0) + columnNumber;
    };
    Text.prototype.positionFromOffset = function (offset) {
        var lineEndings = this.lineEndings();
        var lineNumber = Platform.ArrayUtilities.lowerBound(lineEndings, offset, Platform.ArrayUtilities.DEFAULT_COMPARATOR);
        return { lineNumber: lineNumber, columnNumber: offset - (lineNumber && (lineEndings[lineNumber - 1] + 1)) };
    };
    Text.prototype.lineAt = function (lineNumber) {
        var lineEndings = this.lineEndings();
        var lineStart = lineNumber > 0 ? lineEndings[lineNumber - 1] + 1 : 0;
        var lineEnd = lineEndings[lineNumber];
        var lineContent = this.valueInternal.substring(lineStart, lineEnd);
        if (lineContent.length > 0 && lineContent.charAt(lineContent.length - 1) === '\r') {
            lineContent = lineContent.substring(0, lineContent.length - 1);
        }
        return lineContent;
    };
    Text.prototype.toSourceRange = function (range) {
        var start = this.offsetFromPosition(range.startLine, range.startColumn);
        var end = this.offsetFromPosition(range.endLine, range.endColumn);
        return new SourceRange(start, end - start);
    };
    Text.prototype.toTextRange = function (sourceRange) {
        var cursor = new TextCursor(this.lineEndings());
        var result = TextRange.createFromLocation(0, 0);
        cursor.resetTo(sourceRange.offset);
        result.startLine = cursor.lineNumber();
        result.startColumn = cursor.columnNumber();
        cursor.advance(sourceRange.offset + sourceRange.length);
        result.endLine = cursor.lineNumber();
        result.endColumn = cursor.columnNumber();
        return result;
    };
    Text.prototype.replaceRange = function (range, replacement) {
        var sourceRange = this.toSourceRange(range);
        return this.valueInternal.substring(0, sourceRange.offset) + replacement +
            this.valueInternal.substring(sourceRange.offset + sourceRange.length);
    };
    Text.prototype.extract = function (range) {
        var sourceRange = this.toSourceRange(range);
        return this.valueInternal.substr(sourceRange.offset, sourceRange.length);
    };
    return Text;
}());
export { Text };
