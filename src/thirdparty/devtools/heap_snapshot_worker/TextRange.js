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
var TextRange = /** @class */ (function () {
    function TextRange(startLine, startColumn, endLine, endColumn) {
        this.startLine = startLine;
        this.startColumn = startColumn;
        this.endLine = endLine;
        this.endColumn = endColumn;
    }
    TextRange.createFromLocation = function (line, column) {
        return new TextRange(line, column, line, column);
    };
    TextRange.fromObject = function (serializedTextRange) {
        return new TextRange(serializedTextRange.startLine, serializedTextRange.startColumn, serializedTextRange.endLine, serializedTextRange.endColumn);
    };
    TextRange.comparator = function (range1, range2) {
        return range1.compareTo(range2);
    };
    TextRange.fromEdit = function (oldRange, newText) {
        var endLine = oldRange.startLine;
        var endColumn = oldRange.startColumn + newText.length;
        var lineEndings = Platform.StringUtilities.findLineEndingIndexes(newText);
        if (lineEndings.length > 1) {
            endLine = oldRange.startLine + lineEndings.length - 1;
            var len = lineEndings.length;
            endColumn = lineEndings[len - 1] - lineEndings[len - 2] - 1;
        }
        return new TextRange(oldRange.startLine, oldRange.startColumn, endLine, endColumn);
    };
    TextRange.prototype.isEmpty = function () {
        return this.startLine === this.endLine && this.startColumn === this.endColumn;
    };
    TextRange.prototype.immediatelyPrecedes = function (range) {
        if (!range) {
            return false;
        }
        return this.endLine === range.startLine && this.endColumn === range.startColumn;
    };
    TextRange.prototype.immediatelyFollows = function (range) {
        if (!range) {
            return false;
        }
        return range.immediatelyPrecedes(this);
    };
    TextRange.prototype.follows = function (range) {
        return (range.endLine === this.startLine && range.endColumn <= this.startColumn) || range.endLine < this.startLine;
    };
    Object.defineProperty(TextRange.prototype, "linesCount", {
        get: function () {
            return this.endLine - this.startLine;
        },
        enumerable: false,
        configurable: true
    });
    TextRange.prototype.collapseToEnd = function () {
        return new TextRange(this.endLine, this.endColumn, this.endLine, this.endColumn);
    };
    TextRange.prototype.collapseToStart = function () {
        return new TextRange(this.startLine, this.startColumn, this.startLine, this.startColumn);
    };
    TextRange.prototype.normalize = function () {
        if (this.startLine > this.endLine || (this.startLine === this.endLine && this.startColumn > this.endColumn)) {
            return new TextRange(this.endLine, this.endColumn, this.startLine, this.startColumn);
        }
        return this.clone();
    };
    TextRange.prototype.clone = function () {
        return new TextRange(this.startLine, this.startColumn, this.endLine, this.endColumn);
    };
    TextRange.prototype.serializeToObject = function () {
        return {
            startLine: this.startLine,
            startColumn: this.startColumn,
            endLine: this.endLine,
            endColumn: this.endColumn
        };
    };
    TextRange.prototype.compareTo = function (other) {
        if (this.startLine > other.startLine) {
            return 1;
        }
        if (this.startLine < other.startLine) {
            return -1;
        }
        if (this.startColumn > other.startColumn) {
            return 1;
        }
        if (this.startColumn < other.startColumn) {
            return -1;
        }
        return 0;
    };
    TextRange.prototype.compareToPosition = function (lineNumber, columnNumber) {
        if (lineNumber < this.startLine || (lineNumber === this.startLine && columnNumber < this.startColumn)) {
            return -1;
        }
        if (lineNumber > this.endLine || (lineNumber === this.endLine && columnNumber > this.endColumn)) {
            return 1;
        }
        return 0;
    };
    TextRange.prototype.equal = function (other) {
        return this.startLine === other.startLine && this.endLine === other.endLine &&
            this.startColumn === other.startColumn && this.endColumn === other.endColumn;
    };
    TextRange.prototype.relativeTo = function (line, column) {
        var relative = this.clone();
        if (this.startLine === line) {
            relative.startColumn -= column;
        }
        if (this.endLine === line) {
            relative.endColumn -= column;
        }
        relative.startLine -= line;
        relative.endLine -= line;
        return relative;
    };
    TextRange.prototype.relativeFrom = function (line, column) {
        var relative = this.clone();
        if (this.startLine === 0) {
            relative.startColumn += column;
        }
        if (this.endLine === 0) {
            relative.endColumn += column;
        }
        relative.startLine += line;
        relative.endLine += line;
        return relative;
    };
    TextRange.prototype.rebaseAfterTextEdit = function (originalRange, editedRange) {
        console.assert(originalRange.startLine === editedRange.startLine);
        console.assert(originalRange.startColumn === editedRange.startColumn);
        var rebase = this.clone();
        if (!this.follows(originalRange)) {
            return rebase;
        }
        var lineDelta = editedRange.endLine - originalRange.endLine;
        var columnDelta = editedRange.endColumn - originalRange.endColumn;
        rebase.startLine += lineDelta;
        rebase.endLine += lineDelta;
        if (rebase.startLine === editedRange.endLine) {
            rebase.startColumn += columnDelta;
        }
        if (rebase.endLine === editedRange.endLine) {
            rebase.endColumn += columnDelta;
        }
        return rebase;
    };
    TextRange.prototype.toString = function () {
        return JSON.stringify(this);
    };
    TextRange.prototype.containsLocation = function (lineNumber, columnNumber) {
        if (this.startLine === this.endLine) {
            return this.startLine === lineNumber && this.startColumn <= columnNumber && columnNumber <= this.endColumn;
        }
        if (this.startLine === lineNumber) {
            return this.startColumn <= columnNumber;
        }
        if (this.endLine === lineNumber) {
            return columnNumber <= this.endColumn;
        }
        return this.startLine < lineNumber && lineNumber < this.endLine;
    };
    return TextRange;
}());
export { TextRange };
var SourceRange = /** @class */ (function () {
    function SourceRange(offset, length) {
        this.offset = offset;
        this.length = length;
    }
    return SourceRange;
}());
export { SourceRange };
