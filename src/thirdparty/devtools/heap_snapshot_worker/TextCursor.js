// Copyright 2020 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
import * as Platform from './platform.js';
var TextCursor = /** @class */ (function () {
    function TextCursor(lineEndings) {
        this.lineEndings = lineEndings;
        this.offsetInternal = 0;
        this.lineNumberInternal = 0;
        this.columnNumberInternal = 0;
    }
    TextCursor.prototype.advance = function (offset) {
        this.offsetInternal = offset;
        while (this.lineNumberInternal < this.lineEndings.length &&
            this.lineEndings[this.lineNumberInternal] < this.offsetInternal) {
            ++this.lineNumberInternal;
        }
        this.columnNumberInternal = this.lineNumberInternal ?
            this.offsetInternal - this.lineEndings[this.lineNumberInternal - 1] - 1 :
            this.offsetInternal;
    };
    TextCursor.prototype.offset = function () {
        return this.offsetInternal;
    };
    TextCursor.prototype.resetTo = function (offset) {
        this.offsetInternal = offset;
        this.lineNumberInternal =
            Platform.ArrayUtilities.lowerBound(this.lineEndings, offset, Platform.ArrayUtilities.DEFAULT_COMPARATOR);
        this.columnNumberInternal = this.lineNumberInternal ?
            this.offsetInternal - this.lineEndings[this.lineNumberInternal - 1] - 1 :
            this.offsetInternal;
    };
    TextCursor.prototype.lineNumber = function () {
        return this.lineNumberInternal;
    };
    TextCursor.prototype.columnNumber = function () {
        return this.columnNumberInternal;
    };
    return TextCursor;
}());
export { TextCursor };
