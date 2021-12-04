/*
 * Copyright (C) 2012 Google Inc. All rights reserved.
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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
import * as TextUtils from './text_utils.js';
import { HeapSnapshotProgress, JSHeapSnapshot } from './HeapSnapshot.js';
var HeapSnapshotLoader = /** @class */ (function () {
    function HeapSnapshotLoader(dispatcher) {
        this.reset();
        this.progress = new HeapSnapshotProgress(dispatcher);
        this.buffer = '';
        this.dataCallback = null;
        this.done = false;
        this.parseInput();
    }
    HeapSnapshotLoader.prototype.dispose = function () {
        this.reset();
    };
    HeapSnapshotLoader.prototype.reset = function () {
        this.json = '';
        this.snapshot = undefined;
    };
    HeapSnapshotLoader.prototype.close = function () {
        this.done = true;
        if (this.dataCallback) {
            this.dataCallback('');
        }
    };
    HeapSnapshotLoader.prototype.buildSnapshot = function () {
        this.snapshot = this.snapshot || {};
        this.progress.updateStatus('Processing snapshot…');
        var result = new JSHeapSnapshot(this.snapshot, this.progress);
        this.reset();
        return result;
    };
    HeapSnapshotLoader.prototype.parseUintArray = function () {
        var index = 0;
        var char0 = '0'.charCodeAt(0);
        var char9 = '9'.charCodeAt(0);
        var closingBracket = ']'.charCodeAt(0);
        var length = this.json.length;
        while (true) {
            while (index < length) {
                var code = this.json.charCodeAt(index);
                if (char0 <= code && code <= char9) {
                    break;
                }
                else if (code === closingBracket) {
                    this.json = this.json.slice(index + 1);
                    return false;
                }
                ++index;
            }
            if (index === length) {
                this.json = '';
                return true;
            }
            var nextNumber = 0;
            var startIndex = index;
            while (index < length) {
                var code = this.json.charCodeAt(index);
                if (char0 > code || code > char9) {
                    break;
                }
                nextNumber *= 10;
                nextNumber += (code - char0);
                ++index;
            }
            if (index === length) {
                this.json = this.json.slice(startIndex);
                return true;
            }
            if (!this.array) {
                throw new Error('Array not instantiated');
            }
            this.array[this.arrayIndex++] = nextNumber;
        }
    };
    HeapSnapshotLoader.prototype.parseStringsArray = function () {
        this.progress.updateStatus('Parsing strings…');
        var closingBracketIndex = this.json.lastIndexOf(']');
        if (closingBracketIndex === -1) {
            throw new Error('Incomplete JSON');
        }
        this.json = this.json.slice(0, closingBracketIndex + 1);
        if (!this.snapshot) {
            throw new Error('No snapshot in parseStringsArray');
        }
        this.snapshot.strings = JSON.parse(this.json);
    };
    HeapSnapshotLoader.prototype.write = function (chunk) {
        this.buffer += chunk;
        if (!this.dataCallback) {
            return;
        }
        this.dataCallback(this.buffer);
        this.dataCallback = null;
        this.buffer = '';
    };
    HeapSnapshotLoader.prototype.fetchChunk = function () {
        var _this = this;
        return this.done ? Promise.resolve(this.buffer) : new Promise(function (r) {
            _this.dataCallback = r;
        });
    };
    HeapSnapshotLoader.prototype.findToken = function (token, startIndex) {
        return __awaiter(this, void 0, void 0, function () {
            var pos, _a, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        if (!true) return [3 /*break*/, 2];
                        pos = this.json.indexOf(token, startIndex || 0);
                        if (pos !== -1) {
                            return [2 /*return*/, pos];
                        }
                        startIndex = this.json.length - token.length + 1;
                        _a = this;
                        _b = _a.json;
                        return [4 /*yield*/, this.fetchChunk()];
                    case 1:
                        _a.json = _b + _c.sent();
                        return [3 /*break*/, 0];
                    case 2: return [2 /*return*/];
                }
            });
        });
    };
    HeapSnapshotLoader.prototype.parseArray = function (name, title, length) {
        return __awaiter(this, void 0, void 0, function () {
            var nameIndex, bracketIndex, _a, _b, result;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0: return [4 /*yield*/, this.findToken(name)];
                    case 1:
                        nameIndex = _c.sent();
                        return [4 /*yield*/, this.findToken('[', nameIndex)];
                    case 2:
                        bracketIndex = _c.sent();
                        this.json = this.json.slice(bracketIndex + 1);
                        this.array = length ? new Uint32Array(length) : [];
                        this.arrayIndex = 0;
                        _c.label = 3;
                    case 3:
                        if (!this.parseUintArray()) return [3 /*break*/, 5];
                        if (length) {
                            this.progress.updateProgress(title, this.arrayIndex, this.array.length);
                        }
                        else {
                            this.progress.updateStatus(title);
                        }
                        _a = this;
                        _b = _a.json;
                        return [4 /*yield*/, this.fetchChunk()];
                    case 4:
                        _a.json = _b + _c.sent();
                        return [3 /*break*/, 3];
                    case 5:
                        result = this.array;
                        this.array = null;
                        return [2 /*return*/, result];
                }
            });
        });
    };
    HeapSnapshotLoader.prototype.parseInput = function () {
        return __awaiter(this, void 0, void 0, function () {
            var snapshotToken, snapshotTokenIndex, json, _a, _b, nodes, edges, traceFunctionInfos, thisTokenEndIndex, nextTokenIndex, openBracketIndex, closeBracketIndex, samples, locations, stringsTokenIndex, bracketIndex, _c, _d;
            var _this = this;
            return __generator(this, function (_e) {
                switch (_e.label) {
                    case 0:
                        snapshotToken = '"snapshot"';
                        return [4 /*yield*/, this.findToken(snapshotToken)];
                    case 1:
                        snapshotTokenIndex = _e.sent();
                        if (snapshotTokenIndex === -1) {
                            throw new Error('Snapshot token not found');
                        }
                        this.progress.updateStatus('Loading snapshot info…');
                        json = this.json.slice(snapshotTokenIndex + snapshotToken.length + 1);
                        this.jsonTokenizer = new TextUtils.TextUtils.BalancedJSONTokenizer(function (metaJSON) {
                            _this.json = _this.jsonTokenizer.remainder();
                            _this.jsonTokenizer = null;
                            _this.snapshot = _this.snapshot || {};
                            _this.snapshot.snapshot = JSON.parse(metaJSON);
                        });
                        this.jsonTokenizer.write(json);
                        _e.label = 2;
                    case 2:
                        if (!this.jsonTokenizer) return [3 /*break*/, 4];
                        _b = (_a = this.jsonTokenizer).write;
                        return [4 /*yield*/, this.fetchChunk()];
                    case 3:
                        _b.apply(_a, [_e.sent()]);
                        return [3 /*break*/, 2];
                    case 4:
                        this.snapshot = this.snapshot || {};
                        return [4 /*yield*/, this.parseArray('"nodes"', 'Loading nodes… {PH1}%', this.snapshot.snapshot.meta.node_fields.length * this.snapshot.snapshot.node_count)];
                    case 5:
                        nodes = _e.sent();
                        this.snapshot.nodes = nodes;
                        return [4 /*yield*/, this.parseArray('"edges"', 'Loading edges… {PH1}%', this.snapshot.snapshot.meta.edge_fields.length * this.snapshot.snapshot.edge_count)];
                    case 6:
                        edges = _e.sent();
                        this.snapshot.edges = edges;
                        if (!this.snapshot.snapshot.trace_function_count) return [3 /*break*/, 10];
                        return [4 /*yield*/, this.parseArray('"trace_function_infos"', 'Loading allocation traces… {PH1}%', this.snapshot.snapshot.meta.trace_function_info_fields.length * this.snapshot.snapshot.trace_function_count)];
                    case 7:
                        traceFunctionInfos = _e.sent();
                        this.snapshot.trace_function_infos = traceFunctionInfos;
                        return [4 /*yield*/, this.findToken(':')];
                    case 8:
                        thisTokenEndIndex = _e.sent();
                        return [4 /*yield*/, this.findToken('"', thisTokenEndIndex)];
                    case 9:
                        nextTokenIndex = _e.sent();
                        openBracketIndex = this.json.indexOf('[');
                        closeBracketIndex = this.json.lastIndexOf(']', nextTokenIndex);
                        this.snapshot.trace_tree = JSON.parse(this.json.substring(openBracketIndex, closeBracketIndex + 1));
                        this.json = this.json.slice(closeBracketIndex + 1);
                        _e.label = 10;
                    case 10:
                        if (!this.snapshot.snapshot.meta.sample_fields) return [3 /*break*/, 12];
                        return [4 /*yield*/, this.parseArray('"samples"', 'Loading samples…')];
                    case 11:
                        samples = _e.sent();
                        this.snapshot.samples = samples;
                        _e.label = 12;
                    case 12:
                        if (!this.snapshot.snapshot.meta['location_fields']) return [3 /*break*/, 14];
                        return [4 /*yield*/, this.parseArray('"locations"', 'Loading locations…')];
                    case 13:
                        locations = _e.sent();
                        this.snapshot.locations = locations;
                        return [3 /*break*/, 15];
                    case 14:
                        this.snapshot.locations = [];
                        _e.label = 15;
                    case 15:
                        this.progress.updateStatus('Loading strings…');
                        return [4 /*yield*/, this.findToken('"strings"')];
                    case 16:
                        stringsTokenIndex = _e.sent();
                        return [4 /*yield*/, this.findToken('[', stringsTokenIndex)];
                    case 17:
                        bracketIndex = _e.sent();
                        this.json = this.json.slice(bracketIndex);
                        _e.label = 18;
                    case 18:
                        if (!!this.done) return [3 /*break*/, 20];
                        _c = this;
                        _d = _c.json;
                        return [4 /*yield*/, this.fetchChunk()];
                    case 19:
                        _c.json = _d + _e.sent();
                        return [3 /*break*/, 18];
                    case 20:
                        this.parseStringsArray();
                        return [2 /*return*/];
                }
            });
        });
    };
    return HeapSnapshotLoader;
}());
export { HeapSnapshotLoader };
