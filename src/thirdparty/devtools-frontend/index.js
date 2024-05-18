/*
 * Copyright (C) 2014 Google Inc. All rights reserved.
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
const HeapSnapshotProgressEvent = {
    Update: 'ProgressUpdate',
    BrokenSnapshot: 'BrokenSnapshot',
};
const baseSystemDistance = 100000000;
const baseUnreachableDistance = baseSystemDistance * 2;
class AllocationNodeCallers {
    nodesWithSingleCaller;
    branchingCallers;
    constructor(nodesWithSingleCaller, branchingCallers) {
        this.nodesWithSingleCaller = nodesWithSingleCaller;
        this.branchingCallers = branchingCallers;
    }
}
class SerializedAllocationNode {
    id;
    name;
    scriptName;
    scriptId;
    line;
    column;
    count;
    size;
    liveCount;
    liveSize;
    hasChildren;
    constructor(nodeId, functionName, scriptName, scriptId, line, column, count, size, liveCount, liveSize, hasChildren) {
        this.id = nodeId;
        this.name = functionName;
        this.scriptName = scriptName;
        this.scriptId = scriptId;
        this.line = line;
        this.column = column;
        this.count = count;
        this.size = size;
        this.liveCount = liveCount;
        this.liveSize = liveSize;
        this.hasChildren = hasChildren;
    }
}
class AllocationStackFrame {
    functionName;
    scriptName;
    scriptId;
    line;
    column;
    constructor(functionName, scriptName, scriptId, line, column) {
        this.functionName = functionName;
        this.scriptName = scriptName;
        this.scriptId = scriptId;
        this.line = line;
        this.column = column;
    }
}
class Node {
    id;
    name;
    distance;
    nodeIndex;
    retainedSize;
    selfSize;
    type;
    canBeQueried;
    detachedDOMTreeNode;
    isAddedNotRemoved;
    ignored;
    constructor(id, name, distance, nodeIndex, retainedSize, selfSize, type) {
        this.id = id;
        this.name = name;
        this.distance = distance;
        this.nodeIndex = nodeIndex;
        this.retainedSize = retainedSize;
        this.selfSize = selfSize;
        this.type = type;
        this.canBeQueried = false;
        this.detachedDOMTreeNode = false;
        this.isAddedNotRemoved = null;
        this.ignored = false;
    }
}
class Edge {
    name;
    node;
    type;
    edgeIndex;
    isAddedNotRemoved;
    constructor(name, node, type, edgeIndex) {
        this.name = name;
        this.node = node;
        this.type = type;
        this.edgeIndex = edgeIndex;
        this.isAddedNotRemoved = null;
    }
}
class Aggregate {
    count;
    distance;
    self;
    maxRet;
    type;
    name;
    idxs;
    constructor() {
    }
}
class AggregateForDiff {
    indexes;
    ids;
    selfSizes;
    constructor() {
        this.indexes = [];
        this.ids = [];
        this.selfSizes = [];
    }
}
class Diff {
    addedCount;
    removedCount;
    addedSize;
    removedSize;
    deletedIndexes;
    addedIndexes;
    countDelta;
    sizeDelta;
    constructor() {
        this.addedCount = 0;
        this.removedCount = 0;
        this.addedSize = 0;
        this.removedSize = 0;
        this.deletedIndexes = [];
        this.addedIndexes = [];
    }
}
class DiffForClass {
    addedCount;
    removedCount;
    addedSize;
    removedSize;
    deletedIndexes;
    addedIndexes;
    countDelta;
    sizeDelta;
    constructor() {
    }
}
class ComparatorConfig {
    fieldName1;
    ascending1;
    fieldName2;
    ascending2;
    constructor(fieldName1, ascending1, fieldName2, ascending2) {
        this.fieldName1 = fieldName1;
        this.ascending1 = ascending1;
        this.fieldName2 = fieldName2;
        this.ascending2 = ascending2;
    }
}
class WorkerCommand {
    callId;
    disposition;
    objectId;
    newObjectId;
    methodName;
    // TODO(crbug.com/1172300) Ignored during the jsdoc to ts migration
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    methodArguments;
    source;
    constructor() {
    }
}
class ItemsRange {
    startPosition;
    endPosition;
    totalLength;
    items;
    constructor(startPosition, endPosition, totalLength, items) {
        this.startPosition = startPosition;
        this.endPosition = endPosition;
        this.totalLength = totalLength;
        this.items = items;
    }
}
class StaticData {
    nodeCount;
    rootNodeIndex;
    totalSize;
    maxJSObjectId;
    constructor(nodeCount, rootNodeIndex, totalSize, maxJSObjectId) {
        this.nodeCount = nodeCount;
        this.rootNodeIndex = rootNodeIndex;
        this.totalSize = totalSize;
        this.maxJSObjectId = maxJSObjectId;
    }
}
class Statistics {
    total;
    v8heap;
    native;
    code;
    jsArrays;
    strings;
    system;
    constructor() {
    }
}
class NodeFilter {
    minNodeId;
    maxNodeId;
    allocationNodeId;
    filterName;
    constructor(minNodeId, maxNodeId) {
        this.minNodeId = minNodeId;
        this.maxNodeId = maxNodeId;
    }
    equals(o) {
        return this.minNodeId === o.minNodeId && this.maxNodeId === o.maxNodeId &&
            this.allocationNodeId === o.allocationNodeId && this.filterName === o.filterName;
    }
}
class SearchConfig {
    query;
    caseSensitive;
    isRegex;
    shouldJump;
    jumpBackward;
    constructor(query, caseSensitive, isRegex, shouldJump, jumpBackward) {
        this.query = query;
        this.caseSensitive = caseSensitive;
        this.isRegex = isRegex;
        this.shouldJump = shouldJump;
        this.jumpBackward = jumpBackward;
    }
    toSearchRegex(_global) {
        throw new Error('Unsupported operation on search config');
    }
}
class Samples {
    timestamps;
    lastAssignedIds;
    sizes;
    constructor(timestamps, lastAssignedIds, sizes) {
        this.timestamps = timestamps;
        this.lastAssignedIds = lastAssignedIds;
        this.sizes = sizes;
    }
}
class Location {
    scriptId;
    lineNumber;
    columnNumber;
    constructor(scriptId, lineNumber, columnNumber) {
        this.scriptId = scriptId;
        this.lineNumber = lineNumber;
        this.columnNumber = columnNumber;
    }
}

var HeapSnapshotModel = /*#__PURE__*/Object.freeze({
    __proto__: null,
    Aggregate: Aggregate,
    AggregateForDiff: AggregateForDiff,
    AllocationNodeCallers: AllocationNodeCallers,
    AllocationStackFrame: AllocationStackFrame,
    ComparatorConfig: ComparatorConfig,
    Diff: Diff,
    DiffForClass: DiffForClass,
    Edge: Edge,
    HeapSnapshotProgressEvent: HeapSnapshotProgressEvent,
    ItemsRange: ItemsRange,
    Location: Location,
    Node: Node,
    NodeFilter: NodeFilter,
    Samples: Samples,
    SearchConfig: SearchConfig,
    SerializedAllocationNode: SerializedAllocationNode,
    StaticData: StaticData,
    Statistics: Statistics,
    WorkerCommand: WorkerCommand,
    baseSystemDistance: baseSystemDistance,
    baseUnreachableDistance: baseUnreachableDistance
});

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
class AllocationProfile {
    #strings;
    #nextNodeId;
    #functionInfos;
    #idToNode;
    #idToTopDownNode;
    #collapsedTopNodeIdToFunctionInfo;
    #traceTops;
    constructor(profile, liveObjectStats) {
        this.#strings = profile.strings;
        this.#nextNodeId = 1;
        this.#functionInfos = [];
        this.#idToNode = {};
        this.#idToTopDownNode = {};
        this.#collapsedTopNodeIdToFunctionInfo = {};
        this.#traceTops = null;
        this.#buildFunctionAllocationInfos(profile);
        this.#buildAllocationTree(profile, liveObjectStats);
    }
    #buildFunctionAllocationInfos(profile) {
        const strings = this.#strings;
        const functionInfoFields = profile.snapshot.meta.trace_function_info_fields;
        const functionNameOffset = functionInfoFields.indexOf('name');
        const scriptNameOffset = functionInfoFields.indexOf('script_name');
        const scriptIdOffset = functionInfoFields.indexOf('script_id');
        const lineOffset = functionInfoFields.indexOf('line');
        const columnOffset = functionInfoFields.indexOf('column');
        const functionInfoFieldCount = functionInfoFields.length;
        const rawInfos = profile.trace_function_infos;
        const infoLength = rawInfos.length;
        const functionInfos = this.#functionInfos = new Array(infoLength / functionInfoFieldCount);
        let index = 0;
        for (let i = 0; i < infoLength; i += functionInfoFieldCount) {
            functionInfos[index++] = new FunctionAllocationInfo(strings[rawInfos[i + functionNameOffset]], strings[rawInfos[i + scriptNameOffset]], rawInfos[i + scriptIdOffset], rawInfos[i + lineOffset], rawInfos[i + columnOffset]);
        }
    }
    #buildAllocationTree(profile, liveObjectStats) {
        const traceTreeRaw = profile.trace_tree;
        const functionInfos = this.#functionInfos;
        const idToTopDownNode = this.#idToTopDownNode;
        const traceNodeFields = profile.snapshot.meta.trace_node_fields;
        const nodeIdOffset = traceNodeFields.indexOf('id');
        const functionInfoIndexOffset = traceNodeFields.indexOf('function_info_index');
        const allocationCountOffset = traceNodeFields.indexOf('count');
        const allocationSizeOffset = traceNodeFields.indexOf('size');
        const childrenOffset = traceNodeFields.indexOf('children');
        const nodeFieldCount = traceNodeFields.length;
        function traverseNode(
        // TODO(crbug.com/1172300) Ignored during the jsdoc to ts migration)
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        rawNodeArray, nodeOffset, parent) {
            const functionInfo = functionInfos[rawNodeArray[nodeOffset + functionInfoIndexOffset]];
            const id = rawNodeArray[nodeOffset + nodeIdOffset];
            const stats = liveObjectStats[id];
            const liveCount = stats ? stats.count : 0;
            const liveSize = stats ? stats.size : 0;
            const result = new TopDownAllocationNode(id, functionInfo, rawNodeArray[nodeOffset + allocationCountOffset], rawNodeArray[nodeOffset + allocationSizeOffset], liveCount, liveSize, parent);
            idToTopDownNode[id] = result;
            functionInfo.addTraceTopNode(result);
            const rawChildren = rawNodeArray[nodeOffset + childrenOffset];
            for (let i = 0; i < rawChildren.length; i += nodeFieldCount) {
                result.children.push(traverseNode(rawChildren, i, result));
            }
            return result;
        }
        return traverseNode(traceTreeRaw, 0, null);
    }
    serializeTraceTops() {
        if (this.#traceTops) {
            return this.#traceTops;
        }
        const result = this.#traceTops = [];
        const functionInfos = this.#functionInfos;
        for (let i = 0; i < functionInfos.length; i++) {
            const info = functionInfos[i];
            if (info.totalCount === 0) {
                continue;
            }
            const nodeId = this.#nextNodeId++;
            const isRoot = i === 0;
            result.push(this.#serializeNode(nodeId, info, info.totalCount, info.totalSize, info.totalLiveCount, info.totalLiveSize, !isRoot));
            this.#collapsedTopNodeIdToFunctionInfo[nodeId] = info;
        }
        result.sort(function (a, b) {
            return b.size - a.size;
        });
        return result;
    }
    serializeCallers(nodeId) {
        let node = this.#ensureBottomUpNode(nodeId);
        const nodesWithSingleCaller = [];
        while (node.callers().length === 1) {
            node = node.callers()[0];
            nodesWithSingleCaller.push(this.#serializeCaller(node));
        }
        const branchingCallers = [];
        const callers = node.callers();
        for (let i = 0; i < callers.length; i++) {
            branchingCallers.push(this.#serializeCaller(callers[i]));
        }
        return new AllocationNodeCallers(nodesWithSingleCaller, branchingCallers);
    }
    serializeAllocationStack(traceNodeId) {
        let node = this.#idToTopDownNode[traceNodeId];
        const result = [];
        while (node) {
            const functionInfo = node.functionInfo;
            result.push(new AllocationStackFrame(functionInfo.functionName, functionInfo.scriptName, functionInfo.scriptId, functionInfo.line, functionInfo.column));
            node = node.parent;
        }
        return result;
    }
    traceIds(allocationNodeId) {
        return this.#ensureBottomUpNode(allocationNodeId).traceTopIds;
    }
    #ensureBottomUpNode(nodeId) {
        let node = this.#idToNode[nodeId];
        if (!node) {
            const functionInfo = this.#collapsedTopNodeIdToFunctionInfo[nodeId];
            node = functionInfo.bottomUpRoot();
            delete this.#collapsedTopNodeIdToFunctionInfo[nodeId];
            this.#idToNode[nodeId] = node;
        }
        return node;
    }
    #serializeCaller(node) {
        const callerId = this.#nextNodeId++;
        this.#idToNode[callerId] = node;
        return this.#serializeNode(callerId, node.functionInfo, node.allocationCount, node.allocationSize, node.liveCount, node.liveSize, node.hasCallers());
    }
    #serializeNode(nodeId, functionInfo, count, size, liveCount, liveSize, hasChildren) {
        return new SerializedAllocationNode(nodeId, functionInfo.functionName, functionInfo.scriptName, functionInfo.scriptId, functionInfo.line, functionInfo.column, count, size, liveCount, liveSize, hasChildren);
    }
}
class TopDownAllocationNode {
    id;
    functionInfo;
    allocationCount;
    allocationSize;
    liveCount;
    liveSize;
    parent;
    children;
    constructor(id, functionInfo, count, size, liveCount, liveSize, parent) {
        this.id = id;
        this.functionInfo = functionInfo;
        this.allocationCount = count;
        this.allocationSize = size;
        this.liveCount = liveCount;
        this.liveSize = liveSize;
        this.parent = parent;
        this.children = [];
    }
}
class BottomUpAllocationNode {
    functionInfo;
    allocationCount;
    allocationSize;
    liveCount;
    liveSize;
    traceTopIds;
    #callersInternal;
    constructor(functionInfo) {
        this.functionInfo = functionInfo;
        this.allocationCount = 0;
        this.allocationSize = 0;
        this.liveCount = 0;
        this.liveSize = 0;
        this.traceTopIds = [];
        this.#callersInternal = [];
    }
    addCaller(traceNode) {
        const functionInfo = traceNode.functionInfo;
        let result;
        for (let i = 0; i < this.#callersInternal.length; i++) {
            const caller = this.#callersInternal[i];
            if (caller.functionInfo === functionInfo) {
                result = caller;
                break;
            }
        }
        if (!result) {
            result = new BottomUpAllocationNode(functionInfo);
            this.#callersInternal.push(result);
        }
        return result;
    }
    callers() {
        return this.#callersInternal;
    }
    hasCallers() {
        return this.#callersInternal.length > 0;
    }
}
class FunctionAllocationInfo {
    functionName;
    scriptName;
    scriptId;
    line;
    column;
    totalCount;
    totalSize;
    totalLiveCount;
    totalLiveSize;
    #traceTops;
    #bottomUpTree;
    constructor(functionName, scriptName, scriptId, line, column) {
        this.functionName = functionName;
        this.scriptName = scriptName;
        this.scriptId = scriptId;
        this.line = line;
        this.column = column;
        this.totalCount = 0;
        this.totalSize = 0;
        this.totalLiveCount = 0;
        this.totalLiveSize = 0;
        this.#traceTops = [];
    }
    addTraceTopNode(node) {
        if (node.allocationCount === 0) {
            return;
        }
        this.#traceTops.push(node);
        this.totalCount += node.allocationCount;
        this.totalSize += node.allocationSize;
        this.totalLiveCount += node.liveCount;
        this.totalLiveSize += node.liveSize;
    }
    bottomUpRoot() {
        if (!this.#traceTops.length) {
            return null;
        }
        if (!this.#bottomUpTree) {
            this.#buildAllocationTraceTree();
        }
        return this.#bottomUpTree;
    }
    #buildAllocationTraceTree() {
        this.#bottomUpTree = new BottomUpAllocationNode(this);
        for (let i = 0; i < this.#traceTops.length; i++) {
            let node = this.#traceTops[i];
            let bottomUpNode = this.#bottomUpTree;
            const count = node.allocationCount;
            const size = node.allocationSize;
            const liveCount = node.liveCount;
            const liveSize = node.liveSize;
            const traceId = node.id;
            while (true) {
                bottomUpNode.allocationCount += count;
                bottomUpNode.allocationSize += size;
                bottomUpNode.liveCount += liveCount;
                bottomUpNode.liveSize += liveSize;
                bottomUpNode.traceTopIds.push(traceId);
                node = node.parent;
                if (node === null) {
                    break;
                }
                bottomUpNode = bottomUpNode.addCaller(node);
            }
        }
    }
}

// Copyright 2021 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
let devToolsLocaleInstance = null;
/**
 * Simple class that determines the DevTools locale based on:
 *   1) navigator.language, which matches the Chrome UI
 *   2) the value of the "language" Setting the user choses
 *   3) available locales in DevTools.
 *
 * The DevTools locale is only determined once during startup and
 * guaranteed to never change. Use this class when using
 * `Intl` APIs.
 */
class DevToolsLocale {
    locale;
    lookupClosestDevToolsLocale;
    constructor(data) {
        this.lookupClosestDevToolsLocale = data.lookupClosestDevToolsLocale;
        // TODO(crbug.com/1163928): Use constant once setting actually exists.
        if (data.settingLanguage === 'browserLanguage') {
            this.locale = data.navigatorLanguage || 'en-US';
        }
        else {
            this.locale = data.settingLanguage;
        }
        this.locale = this.lookupClosestDevToolsLocale(this.locale);
    }
    static instance(opts = { create: false }) {
        if (!devToolsLocaleInstance && !opts.create) {
            throw new Error('No LanguageSelector instance exists yet.');
        }
        if (opts.create) {
            devToolsLocaleInstance = new DevToolsLocale(opts.data);
        }
        return devToolsLocaleInstance;
    }
    static removeInstance() {
        devToolsLocaleInstance = null;
    }
    forceFallbackLocale() {
        // Locale is 'readonly', this is the only case where we want to forceably
        // overwrite the locale.
        this.locale = 'en-US';
    }
    /**
     * Returns true iff DevTools supports the language of the passed locale.
     * Note that it doesn't have to be a one-to-one match, e.g. if DevTools supports
     * 'de', then passing 'de-AT' will return true.
     */
    languageIsSupportedByDevTools(localeString) {
        return localeLanguagesMatch(localeString, this.lookupClosestDevToolsLocale(localeString));
    }
}
/**
 * Returns true iff the two locales have matching languages. This means the
 * passing 'de-AT' and 'de-DE' will return true, while 'de-DE' and 'en' will
 * return false.
 */
function localeLanguagesMatch(localeString1, localeString2) {
    const locale1 = new Intl.Locale(localeString1);
    const locale2 = new Intl.Locale(localeString2);
    return locale1.language === locale2.language;
}

// node_modules/tslib/tslib.es6.js
var __assign = function() {
  __assign = Object.assign || function __assign2(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
      s = arguments[i];
      for (var p in s)
        if (Object.prototype.hasOwnProperty.call(s, p))
          t[p] = s[p];
    }
    return t;
  };
  return __assign.apply(this, arguments);
};

// bazel-out/darwin-fastbuild/bin/packages/icu-messageformat-parser/lib/error.js
var ErrorKind;
(function(ErrorKind2) {
  ErrorKind2[ErrorKind2["EXPECT_ARGUMENT_CLOSING_BRACE"] = 1] = "EXPECT_ARGUMENT_CLOSING_BRACE";
  ErrorKind2[ErrorKind2["EMPTY_ARGUMENT"] = 2] = "EMPTY_ARGUMENT";
  ErrorKind2[ErrorKind2["MALFORMED_ARGUMENT"] = 3] = "MALFORMED_ARGUMENT";
  ErrorKind2[ErrorKind2["EXPECT_ARGUMENT_TYPE"] = 4] = "EXPECT_ARGUMENT_TYPE";
  ErrorKind2[ErrorKind2["INVALID_ARGUMENT_TYPE"] = 5] = "INVALID_ARGUMENT_TYPE";
  ErrorKind2[ErrorKind2["EXPECT_ARGUMENT_STYLE"] = 6] = "EXPECT_ARGUMENT_STYLE";
  ErrorKind2[ErrorKind2["INVALID_NUMBER_SKELETON"] = 7] = "INVALID_NUMBER_SKELETON";
  ErrorKind2[ErrorKind2["INVALID_DATE_TIME_SKELETON"] = 8] = "INVALID_DATE_TIME_SKELETON";
  ErrorKind2[ErrorKind2["EXPECT_NUMBER_SKELETON"] = 9] = "EXPECT_NUMBER_SKELETON";
  ErrorKind2[ErrorKind2["EXPECT_DATE_TIME_SKELETON"] = 10] = "EXPECT_DATE_TIME_SKELETON";
  ErrorKind2[ErrorKind2["UNCLOSED_QUOTE_IN_ARGUMENT_STYLE"] = 11] = "UNCLOSED_QUOTE_IN_ARGUMENT_STYLE";
  ErrorKind2[ErrorKind2["EXPECT_SELECT_ARGUMENT_OPTIONS"] = 12] = "EXPECT_SELECT_ARGUMENT_OPTIONS";
  ErrorKind2[ErrorKind2["EXPECT_PLURAL_ARGUMENT_OFFSET_VALUE"] = 13] = "EXPECT_PLURAL_ARGUMENT_OFFSET_VALUE";
  ErrorKind2[ErrorKind2["INVALID_PLURAL_ARGUMENT_OFFSET_VALUE"] = 14] = "INVALID_PLURAL_ARGUMENT_OFFSET_VALUE";
  ErrorKind2[ErrorKind2["EXPECT_SELECT_ARGUMENT_SELECTOR"] = 15] = "EXPECT_SELECT_ARGUMENT_SELECTOR";
  ErrorKind2[ErrorKind2["EXPECT_PLURAL_ARGUMENT_SELECTOR"] = 16] = "EXPECT_PLURAL_ARGUMENT_SELECTOR";
  ErrorKind2[ErrorKind2["EXPECT_SELECT_ARGUMENT_SELECTOR_FRAGMENT"] = 17] = "EXPECT_SELECT_ARGUMENT_SELECTOR_FRAGMENT";
  ErrorKind2[ErrorKind2["EXPECT_PLURAL_ARGUMENT_SELECTOR_FRAGMENT"] = 18] = "EXPECT_PLURAL_ARGUMENT_SELECTOR_FRAGMENT";
  ErrorKind2[ErrorKind2["INVALID_PLURAL_ARGUMENT_SELECTOR"] = 19] = "INVALID_PLURAL_ARGUMENT_SELECTOR";
  ErrorKind2[ErrorKind2["DUPLICATE_PLURAL_ARGUMENT_SELECTOR"] = 20] = "DUPLICATE_PLURAL_ARGUMENT_SELECTOR";
  ErrorKind2[ErrorKind2["DUPLICATE_SELECT_ARGUMENT_SELECTOR"] = 21] = "DUPLICATE_SELECT_ARGUMENT_SELECTOR";
  ErrorKind2[ErrorKind2["MISSING_OTHER_CLAUSE"] = 22] = "MISSING_OTHER_CLAUSE";
  ErrorKind2[ErrorKind2["INVALID_TAG"] = 23] = "INVALID_TAG";
  ErrorKind2[ErrorKind2["INVALID_TAG_NAME"] = 25] = "INVALID_TAG_NAME";
  ErrorKind2[ErrorKind2["UNMATCHED_CLOSING_TAG"] = 26] = "UNMATCHED_CLOSING_TAG";
  ErrorKind2[ErrorKind2["UNCLOSED_TAG"] = 27] = "UNCLOSED_TAG";
})(ErrorKind || (ErrorKind = {}));

// bazel-out/darwin-fastbuild/bin/packages/icu-messageformat-parser/lib/types.js
var TYPE;
(function(TYPE2) {
  TYPE2[TYPE2["literal"] = 0] = "literal";
  TYPE2[TYPE2["argument"] = 1] = "argument";
  TYPE2[TYPE2["number"] = 2] = "number";
  TYPE2[TYPE2["date"] = 3] = "date";
  TYPE2[TYPE2["time"] = 4] = "time";
  TYPE2[TYPE2["select"] = 5] = "select";
  TYPE2[TYPE2["plural"] = 6] = "plural";
  TYPE2[TYPE2["pound"] = 7] = "pound";
  TYPE2[TYPE2["tag"] = 8] = "tag";
})(TYPE || (TYPE = {}));
var SKELETON_TYPE;
(function(SKELETON_TYPE2) {
  SKELETON_TYPE2[SKELETON_TYPE2["number"] = 0] = "number";
  SKELETON_TYPE2[SKELETON_TYPE2["dateTime"] = 1] = "dateTime";
})(SKELETON_TYPE || (SKELETON_TYPE = {}));
function isLiteralElement(el) {
  return el.type === TYPE.literal;
}
function isArgumentElement(el) {
  return el.type === TYPE.argument;
}
function isNumberElement(el) {
  return el.type === TYPE.number;
}
function isDateElement(el) {
  return el.type === TYPE.date;
}
function isTimeElement(el) {
  return el.type === TYPE.time;
}
function isSelectElement(el) {
  return el.type === TYPE.select;
}
function isPluralElement(el) {
  return el.type === TYPE.plural;
}
function isPoundElement(el) {
  return el.type === TYPE.pound;
}
function isTagElement(el) {
  return el.type === TYPE.tag;
}
function isNumberSkeleton(el) {
  return !!(el && typeof el === "object" && el.type === SKELETON_TYPE.number);
}
function isDateTimeSkeleton(el) {
  return !!(el && typeof el === "object" && el.type === SKELETON_TYPE.dateTime);
}

// bazel-out/darwin-fastbuild/bin/packages/icu-messageformat-parser/lib/regex.generated.js
var SPACE_SEPARATOR_REGEX = /[ \xA0\u1680\u2000-\u200A\u202F\u205F\u3000]/;

// bazel-out/darwin-fastbuild/bin/packages/icu-skeleton-parser/lib/date-time.js
var DATE_TIME_REGEX = /(?:[Eec]{1,6}|G{1,5}|[Qq]{1,5}|(?:[yYur]+|U{1,5})|[ML]{1,5}|d{1,2}|D{1,3}|F{1}|[abB]{1,5}|[hkHK]{1,2}|w{1,2}|W{1}|m{1,2}|s{1,2}|[zZOvVxX]{1,4})(?=([^']*'[^']*')*[^']*$)/g;
function parseDateTimeSkeleton(skeleton) {
  var result = {};
  skeleton.replace(DATE_TIME_REGEX, function(match) {
    var len = match.length;
    switch (match[0]) {
      case "G":
        result.era = len === 4 ? "long" : len === 5 ? "narrow" : "short";
        break;
      case "y":
        result.year = len === 2 ? "2-digit" : "numeric";
        break;
      case "Y":
      case "u":
      case "U":
      case "r":
        throw new RangeError("`Y/u/U/r` (year) patterns are not supported, use `y` instead");
      case "q":
      case "Q":
        throw new RangeError("`q/Q` (quarter) patterns are not supported");
      case "M":
      case "L":
        result.month = ["numeric", "2-digit", "short", "long", "narrow"][len - 1];
        break;
      case "w":
      case "W":
        throw new RangeError("`w/W` (week) patterns are not supported");
      case "d":
        result.day = ["numeric", "2-digit"][len - 1];
        break;
      case "D":
      case "F":
      case "g":
        throw new RangeError("`D/F/g` (day) patterns are not supported, use `d` instead");
      case "E":
        result.weekday = len === 4 ? "short" : len === 5 ? "narrow" : "short";
        break;
      case "e":
        if (len < 4) {
          throw new RangeError("`e..eee` (weekday) patterns are not supported");
        }
        result.weekday = ["short", "long", "narrow", "short"][len - 4];
        break;
      case "c":
        if (len < 4) {
          throw new RangeError("`c..ccc` (weekday) patterns are not supported");
        }
        result.weekday = ["short", "long", "narrow", "short"][len - 4];
        break;
      case "a":
        result.hour12 = true;
        break;
      case "b":
      case "B":
        throw new RangeError("`b/B` (period) patterns are not supported, use `a` instead");
      case "h":
        result.hourCycle = "h12";
        result.hour = ["numeric", "2-digit"][len - 1];
        break;
      case "H":
        result.hourCycle = "h23";
        result.hour = ["numeric", "2-digit"][len - 1];
        break;
      case "K":
        result.hourCycle = "h11";
        result.hour = ["numeric", "2-digit"][len - 1];
        break;
      case "k":
        result.hourCycle = "h24";
        result.hour = ["numeric", "2-digit"][len - 1];
        break;
      case "j":
      case "J":
      case "C":
        throw new RangeError("`j/J/C` (hour) patterns are not supported, use `h/H/K/k` instead");
      case "m":
        result.minute = ["numeric", "2-digit"][len - 1];
        break;
      case "s":
        result.second = ["numeric", "2-digit"][len - 1];
        break;
      case "S":
      case "A":
        throw new RangeError("`S/A` (second) patterns are not supported, use `s` instead");
      case "z":
        result.timeZoneName = len < 4 ? "short" : "long";
        break;
      case "Z":
      case "O":
      case "v":
      case "V":
      case "X":
      case "x":
        throw new RangeError("`Z/O/v/V/X/x` (timeZone) patterns are not supported, use `z` instead");
    }
    return "";
  });
  return result;
}

// bazel-out/darwin-fastbuild/bin/packages/icu-skeleton-parser/lib/regex.generated.js
var WHITE_SPACE_REGEX = /[\t-\r \x85\u200E\u200F\u2028\u2029]/i;

// bazel-out/darwin-fastbuild/bin/packages/icu-skeleton-parser/lib/number.js
function parseNumberSkeletonFromString(skeleton) {
  if (skeleton.length === 0) {
    throw new Error("Number skeleton cannot be empty");
  }
  var stringTokens = skeleton.split(WHITE_SPACE_REGEX).filter(function(x) {
    return x.length > 0;
  });
  var tokens = [];
  for (var _i = 0, stringTokens_1 = stringTokens; _i < stringTokens_1.length; _i++) {
    var stringToken = stringTokens_1[_i];
    var stemAndOptions = stringToken.split("/");
    if (stemAndOptions.length === 0) {
      throw new Error("Invalid number skeleton");
    }
    var stem = stemAndOptions[0], options = stemAndOptions.slice(1);
    for (var _a2 = 0, options_1 = options; _a2 < options_1.length; _a2++) {
      var option = options_1[_a2];
      if (option.length === 0) {
        throw new Error("Invalid number skeleton");
      }
    }
    tokens.push({stem, options});
  }
  return tokens;
}
function icuUnitToEcma(unit) {
  return unit.replace(/^(.*?)-/, "");
}
var FRACTION_PRECISION_REGEX = /^\.(?:(0+)(\*)?|(#+)|(0+)(#+))$/g;
var SIGNIFICANT_PRECISION_REGEX = /^(@+)?(\+|#+)?$/g;
var INTEGER_WIDTH_REGEX = /(\*)(0+)|(#+)(0+)|(0+)/g;
var CONCISE_INTEGER_WIDTH_REGEX = /^(0+)$/;
function parseSignificantPrecision(str) {
  var result = {};
  str.replace(SIGNIFICANT_PRECISION_REGEX, function(_, g1, g2) {
    if (typeof g2 !== "string") {
      result.minimumSignificantDigits = g1.length;
      result.maximumSignificantDigits = g1.length;
    } else if (g2 === "+") {
      result.minimumSignificantDigits = g1.length;
    } else if (g1[0] === "#") {
      result.maximumSignificantDigits = g1.length;
    } else {
      result.minimumSignificantDigits = g1.length;
      result.maximumSignificantDigits = g1.length + (typeof g2 === "string" ? g2.length : 0);
    }
    return "";
  });
  return result;
}
function parseSign(str) {
  switch (str) {
    case "sign-auto":
      return {
        signDisplay: "auto"
      };
    case "sign-accounting":
    case "()":
      return {
        currencySign: "accounting"
      };
    case "sign-always":
    case "+!":
      return {
        signDisplay: "always"
      };
    case "sign-accounting-always":
    case "()!":
      return {
        signDisplay: "always",
        currencySign: "accounting"
      };
    case "sign-except-zero":
    case "+?":
      return {
        signDisplay: "exceptZero"
      };
    case "sign-accounting-except-zero":
    case "()?":
      return {
        signDisplay: "exceptZero",
        currencySign: "accounting"
      };
    case "sign-never":
    case "+_":
      return {
        signDisplay: "never"
      };
  }
}
function parseConciseScientificAndEngineeringStem(stem) {
  var result;
  if (stem[0] === "E" && stem[1] === "E") {
    result = {
      notation: "engineering"
    };
    stem = stem.slice(2);
  } else if (stem[0] === "E") {
    result = {
      notation: "scientific"
    };
    stem = stem.slice(1);
  }
  if (result) {
    var signDisplay = stem.slice(0, 2);
    if (signDisplay === "+!") {
      result.signDisplay = "always";
      stem = stem.slice(2);
    } else if (signDisplay === "+?") {
      result.signDisplay = "exceptZero";
      stem = stem.slice(2);
    }
    if (!CONCISE_INTEGER_WIDTH_REGEX.test(stem)) {
      throw new Error("Malformed concise eng/scientific notation");
    }
    result.minimumIntegerDigits = stem.length;
  }
  return result;
}
function parseNotationOptions(opt) {
  var result = {};
  var signOpts = parseSign(opt);
  if (signOpts) {
    return signOpts;
  }
  return result;
}
function parseNumberSkeleton(tokens) {
  var result = {};
  for (var _i = 0, tokens_1 = tokens; _i < tokens_1.length; _i++) {
    var token = tokens_1[_i];
    switch (token.stem) {
      case "percent":
      case "%":
        result.style = "percent";
        continue;
      case "%x100":
        result.style = "percent";
        result.scale = 100;
        continue;
      case "currency":
        result.style = "currency";
        result.currency = token.options[0];
        continue;
      case "group-off":
      case ",_":
        result.useGrouping = false;
        continue;
      case "precision-integer":
      case ".":
        result.maximumFractionDigits = 0;
        continue;
      case "measure-unit":
      case "unit":
        result.style = "unit";
        result.unit = icuUnitToEcma(token.options[0]);
        continue;
      case "compact-short":
      case "K":
        result.notation = "compact";
        result.compactDisplay = "short";
        continue;
      case "compact-long":
      case "KK":
        result.notation = "compact";
        result.compactDisplay = "long";
        continue;
      case "scientific":
        result = __assign(__assign(__assign({}, result), {notation: "scientific"}), token.options.reduce(function(all, opt) {
          return __assign(__assign({}, all), parseNotationOptions(opt));
        }, {}));
        continue;
      case "engineering":
        result = __assign(__assign(__assign({}, result), {notation: "engineering"}), token.options.reduce(function(all, opt) {
          return __assign(__assign({}, all), parseNotationOptions(opt));
        }, {}));
        continue;
      case "notation-simple":
        result.notation = "standard";
        continue;
      case "unit-width-narrow":
        result.currencyDisplay = "narrowSymbol";
        result.unitDisplay = "narrow";
        continue;
      case "unit-width-short":
        result.currencyDisplay = "code";
        result.unitDisplay = "short";
        continue;
      case "unit-width-full-name":
        result.currencyDisplay = "name";
        result.unitDisplay = "long";
        continue;
      case "unit-width-iso-code":
        result.currencyDisplay = "symbol";
        continue;
      case "scale":
        result.scale = parseFloat(token.options[0]);
        continue;
      case "integer-width":
        if (token.options.length > 1) {
          throw new RangeError("integer-width stems only accept a single optional option");
        }
        token.options[0].replace(INTEGER_WIDTH_REGEX, function(_, g1, g2, g3, g4, g5) {
          if (g1) {
            result.minimumIntegerDigits = g2.length;
          } else if (g3 && g4) {
            throw new Error("We currently do not support maximum integer digits");
          } else if (g5) {
            throw new Error("We currently do not support exact integer digits");
          }
          return "";
        });
        continue;
    }
    if (CONCISE_INTEGER_WIDTH_REGEX.test(token.stem)) {
      result.minimumIntegerDigits = token.stem.length;
      continue;
    }
    if (FRACTION_PRECISION_REGEX.test(token.stem)) {
      if (token.options.length > 1) {
        throw new RangeError("Fraction-precision stems only accept a single optional option");
      }
      token.stem.replace(FRACTION_PRECISION_REGEX, function(_, g1, g2, g3, g4, g5) {
        if (g2 === "*") {
          result.minimumFractionDigits = g1.length;
        } else if (g3 && g3[0] === "#") {
          result.maximumFractionDigits = g3.length;
        } else if (g4 && g5) {
          result.minimumFractionDigits = g4.length;
          result.maximumFractionDigits = g4.length + g5.length;
        } else {
          result.minimumFractionDigits = g1.length;
          result.maximumFractionDigits = g1.length;
        }
        return "";
      });
      if (token.options.length) {
        result = __assign(__assign({}, result), parseSignificantPrecision(token.options[0]));
      }
      continue;
    }
    if (SIGNIFICANT_PRECISION_REGEX.test(token.stem)) {
      result = __assign(__assign({}, result), parseSignificantPrecision(token.stem));
      continue;
    }
    var signOpts = parseSign(token.stem);
    if (signOpts) {
      result = __assign(__assign({}, result), signOpts);
    }
    var conciseScientificAndEngineeringOpts = parseConciseScientificAndEngineeringStem(token.stem);
    if (conciseScientificAndEngineeringOpts) {
      result = __assign(__assign({}, result), conciseScientificAndEngineeringOpts);
    }
  }
  return result;
}

// bazel-out/darwin-fastbuild/bin/packages/icu-messageformat-parser/lib/parser.js
var _a$1;
var SPACE_SEPARATOR_START_REGEX = new RegExp("^" + SPACE_SEPARATOR_REGEX.source + "*");
var SPACE_SEPARATOR_END_REGEX = new RegExp(SPACE_SEPARATOR_REGEX.source + "*$");
function createLocation(start, end) {
  return {start, end};
}
var hasNativeStartsWith = !!String.prototype.startsWith;
var hasNativeFromCodePoint = !!String.fromCodePoint;
var hasNativeFromEntries = !!Object.fromEntries;
var hasNativeCodePointAt = !!String.prototype.codePointAt;
var hasTrimStart = !!String.prototype.trimStart;
var hasTrimEnd = !!String.prototype.trimEnd;
var hasNativeIsSafeInteger = !!Number.isSafeInteger;
var isSafeInteger = hasNativeIsSafeInteger ? Number.isSafeInteger : function(n) {
  return typeof n === "number" && isFinite(n) && Math.floor(n) === n && Math.abs(n) <= 9007199254740991;
};
var REGEX_SUPPORTS_U_AND_Y = true;
try {
  re$1 = RE("([^\\p{White_Space}\\p{Pattern_Syntax}]*)", "yu");
  REGEX_SUPPORTS_U_AND_Y = ((_a$1 = re$1.exec("a")) === null || _a$1 === void 0 ? void 0 : _a$1[0]) === "a";
} catch (_) {
  REGEX_SUPPORTS_U_AND_Y = false;
}
var re$1;
var startsWith = hasNativeStartsWith ? function startsWith2(s, search, position) {
  return s.startsWith(search, position);
} : function startsWith3(s, search, position) {
  return s.slice(position, position + search.length) === search;
};
var fromCodePoint = hasNativeFromCodePoint ? String.fromCodePoint : function fromCodePoint2() {
  var codePoints = [];
  for (var _i = 0; _i < arguments.length; _i++) {
    codePoints[_i] = arguments[_i];
  }
  var elements = "";
  var length = codePoints.length;
  var i = 0;
  var code;
  while (length > i) {
    code = codePoints[i++];
    if (code > 1114111)
      throw RangeError(code + " is not a valid code point");
    elements += code < 65536 ? String.fromCharCode(code) : String.fromCharCode(((code -= 65536) >> 10) + 55296, code % 1024 + 56320);
  }
  return elements;
};
var fromEntries = hasNativeFromEntries ? Object.fromEntries : function fromEntries2(entries) {
  var obj = {};
  for (var _i = 0, entries_1 = entries; _i < entries_1.length; _i++) {
    var _a2 = entries_1[_i], k = _a2[0], v = _a2[1];
    obj[k] = v;
  }
  return obj;
};
var codePointAt = hasNativeCodePointAt ? function codePointAt2(s, index) {
  return s.codePointAt(index);
} : function codePointAt3(s, index) {
  var size = s.length;
  if (index < 0 || index >= size) {
    return void 0;
  }
  var first = s.charCodeAt(index);
  var second;
  return first < 55296 || first > 56319 || index + 1 === size || (second = s.charCodeAt(index + 1)) < 56320 || second > 57343 ? first : (first - 55296 << 10) + (second - 56320) + 65536;
};
var trimStart = hasTrimStart ? function trimStart2(s) {
  return s.trimStart();
} : function trimStart3(s) {
  return s.replace(SPACE_SEPARATOR_START_REGEX, "");
};
var trimEnd = hasTrimEnd ? function trimEnd2(s) {
  return s.trimEnd();
} : function trimEnd3(s) {
  return s.replace(SPACE_SEPARATOR_END_REGEX, "");
};
function RE(s, flag) {
  return new RegExp(s, flag);
}
var matchIdentifierAtIndex;
if (REGEX_SUPPORTS_U_AND_Y) {
  IDENTIFIER_PREFIX_RE_1 = RE("([^\\p{White_Space}\\p{Pattern_Syntax}]*)", "yu");
  matchIdentifierAtIndex = function matchIdentifierAtIndex2(s, index) {
    var _a2;
    IDENTIFIER_PREFIX_RE_1.lastIndex = index;
    var match = IDENTIFIER_PREFIX_RE_1.exec(s);
    return (_a2 = match[1]) !== null && _a2 !== void 0 ? _a2 : "";
  };
} else {
  matchIdentifierAtIndex = function matchIdentifierAtIndex2(s, index) {
    var match = [];
    while (true) {
      var c = codePointAt(s, index);
      if (c === void 0 || _isWhiteSpace(c) || _isPatternSyntax(c)) {
        break;
      }
      match.push(c);
      index += c >= 65536 ? 2 : 1;
    }
    return fromCodePoint.apply(void 0, match);
  };
}
var IDENTIFIER_PREFIX_RE_1;
var Parser = function() {
  function Parser2(message, options) {
    if (options === void 0) {
      options = {};
    }
    this.message = message;
    this.position = {offset: 0, line: 1, column: 1};
    this.ignoreTag = !!options.ignoreTag;
    this.requiresOtherClause = !!options.requiresOtherClause;
    this.shouldParseSkeletons = !!options.shouldParseSkeletons;
  }
  Parser2.prototype.parse = function() {
    if (this.offset() !== 0) {
      throw Error("parser can only be used once");
    }
    return this.parseMessage(0, "", false);
  };
  Parser2.prototype.parseMessage = function(nestingLevel, parentArgType, expectingCloseTag) {
    var elements = [];
    while (!this.isEOF()) {
      var char = this.char();
      if (char === 123) {
        var result = this.parseArgument(nestingLevel, expectingCloseTag);
        if (result.err) {
          return result;
        }
        elements.push(result.val);
      } else if (char === 125 && nestingLevel > 0) {
        break;
      } else if (char === 35 && (parentArgType === "plural" || parentArgType === "selectordinal")) {
        var position = this.clonePosition();
        this.bump();
        elements.push({
          type: TYPE.pound,
          location: createLocation(position, this.clonePosition())
        });
      } else if (char === 60 && !this.ignoreTag && this.peek() === 47) {
        if (expectingCloseTag) {
          break;
        } else {
          return this.error(ErrorKind.UNMATCHED_CLOSING_TAG, createLocation(this.clonePosition(), this.clonePosition()));
        }
      } else if (char === 60 && !this.ignoreTag && _isAlpha(this.peek() || 0)) {
        var result = this.parseTag(nestingLevel, parentArgType);
        if (result.err) {
          return result;
        }
        elements.push(result.val);
      } else {
        var result = this.parseLiteral(nestingLevel, parentArgType);
        if (result.err) {
          return result;
        }
        elements.push(result.val);
      }
    }
    return {val: elements, err: null};
  };
  Parser2.prototype.parseTag = function(nestingLevel, parentArgType) {
    var startPosition = this.clonePosition();
    this.bump();
    var tagName = this.parseTagName();
    this.bumpSpace();
    if (this.bumpIf("/>")) {
      return {
        val: {
          type: TYPE.literal,
          value: "<" + tagName + "/>",
          location: createLocation(startPosition, this.clonePosition())
        },
        err: null
      };
    } else if (this.bumpIf(">")) {
      var childrenResult = this.parseMessage(nestingLevel + 1, parentArgType, true);
      if (childrenResult.err) {
        return childrenResult;
      }
      var children = childrenResult.val;
      var endTagStartPosition = this.clonePosition();
      if (this.bumpIf("</")) {
        if (this.isEOF() || !_isAlpha(this.char())) {
          return this.error(ErrorKind.INVALID_TAG, createLocation(endTagStartPosition, this.clonePosition()));
        }
        var closingTagNameStartPosition = this.clonePosition();
        var closingTagName = this.parseTagName();
        if (tagName !== closingTagName) {
          return this.error(ErrorKind.UNMATCHED_CLOSING_TAG, createLocation(closingTagNameStartPosition, this.clonePosition()));
        }
        this.bumpSpace();
        if (!this.bumpIf(">")) {
          return this.error(ErrorKind.INVALID_TAG, createLocation(endTagStartPosition, this.clonePosition()));
        }
        return {
          val: {
            type: TYPE.tag,
            value: tagName,
            children,
            location: createLocation(startPosition, this.clonePosition())
          },
          err: null
        };
      } else {
        return this.error(ErrorKind.UNCLOSED_TAG, createLocation(startPosition, this.clonePosition()));
      }
    } else {
      return this.error(ErrorKind.INVALID_TAG, createLocation(startPosition, this.clonePosition()));
    }
  };
  Parser2.prototype.parseTagName = function() {
    var startOffset = this.offset();
    this.bump();
    while (!this.isEOF() && _isPotentialElementNameChar(this.char())) {
      this.bump();
    }
    return this.message.slice(startOffset, this.offset());
  };
  Parser2.prototype.parseLiteral = function(nestingLevel, parentArgType) {
    var start = this.clonePosition();
    var value = "";
    while (true) {
      var parseQuoteResult = this.tryParseQuote(parentArgType);
      if (parseQuoteResult) {
        value += parseQuoteResult;
        continue;
      }
      var parseUnquotedResult = this.tryParseUnquoted(nestingLevel, parentArgType);
      if (parseUnquotedResult) {
        value += parseUnquotedResult;
        continue;
      }
      var parseLeftAngleResult = this.tryParseLeftAngleBracket();
      if (parseLeftAngleResult) {
        value += parseLeftAngleResult;
        continue;
      }
      break;
    }
    var location = createLocation(start, this.clonePosition());
    return {
      val: {type: TYPE.literal, value, location},
      err: null
    };
  };
  Parser2.prototype.tryParseLeftAngleBracket = function() {
    if (!this.isEOF() && this.char() === 60 && (this.ignoreTag || !_isAlphaOrSlash(this.peek() || 0))) {
      this.bump();
      return "<";
    }
    return null;
  };
  Parser2.prototype.tryParseQuote = function(parentArgType) {
    if (this.isEOF() || this.char() !== 39) {
      return null;
    }
    switch (this.peek()) {
      case 39:
        this.bump();
        this.bump();
        return "'";
      case 123:
      case 60:
      case 62:
      case 125:
        break;
      case 35:
        if (parentArgType === "plural" || parentArgType === "selectordinal") {
          break;
        }
        return null;
      default:
        return null;
    }
    this.bump();
    var codePoints = [this.char()];
    this.bump();
    while (!this.isEOF()) {
      var ch = this.char();
      if (ch === 39) {
        if (this.peek() === 39) {
          codePoints.push(39);
          this.bump();
        } else {
          this.bump();
          break;
        }
      } else {
        codePoints.push(ch);
      }
      this.bump();
    }
    return fromCodePoint.apply(void 0, codePoints);
  };
  Parser2.prototype.tryParseUnquoted = function(nestingLevel, parentArgType) {
    if (this.isEOF()) {
      return null;
    }
    var ch = this.char();
    if (ch === 60 || ch === 123 || ch === 35 && (parentArgType === "plural" || parentArgType === "selectordinal") || ch === 125 && nestingLevel > 0) {
      return null;
    } else {
      this.bump();
      return fromCodePoint(ch);
    }
  };
  Parser2.prototype.parseArgument = function(nestingLevel, expectingCloseTag) {
    var openingBracePosition = this.clonePosition();
    this.bump();
    this.bumpSpace();
    if (this.isEOF()) {
      return this.error(ErrorKind.EXPECT_ARGUMENT_CLOSING_BRACE, createLocation(openingBracePosition, this.clonePosition()));
    }
    if (this.char() === 125) {
      this.bump();
      return this.error(ErrorKind.EMPTY_ARGUMENT, createLocation(openingBracePosition, this.clonePosition()));
    }
    var value = this.parseIdentifierIfPossible().value;
    if (!value) {
      return this.error(ErrorKind.MALFORMED_ARGUMENT, createLocation(openingBracePosition, this.clonePosition()));
    }
    this.bumpSpace();
    if (this.isEOF()) {
      return this.error(ErrorKind.EXPECT_ARGUMENT_CLOSING_BRACE, createLocation(openingBracePosition, this.clonePosition()));
    }
    switch (this.char()) {
      case 125: {
        this.bump();
        return {
          val: {
            type: TYPE.argument,
            value,
            location: createLocation(openingBracePosition, this.clonePosition())
          },
          err: null
        };
      }
      case 44: {
        this.bump();
        this.bumpSpace();
        if (this.isEOF()) {
          return this.error(ErrorKind.EXPECT_ARGUMENT_CLOSING_BRACE, createLocation(openingBracePosition, this.clonePosition()));
        }
        return this.parseArgumentOptions(nestingLevel, expectingCloseTag, value, openingBracePosition);
      }
      default:
        return this.error(ErrorKind.MALFORMED_ARGUMENT, createLocation(openingBracePosition, this.clonePosition()));
    }
  };
  Parser2.prototype.parseIdentifierIfPossible = function() {
    var startingPosition = this.clonePosition();
    var startOffset = this.offset();
    var value = matchIdentifierAtIndex(this.message, startOffset);
    var endOffset = startOffset + value.length;
    this.bumpTo(endOffset);
    var endPosition = this.clonePosition();
    var location = createLocation(startingPosition, endPosition);
    return {value, location};
  };
  Parser2.prototype.parseArgumentOptions = function(nestingLevel, expectingCloseTag, value, openingBracePosition) {
    var _a2;
    var typeStartPosition = this.clonePosition();
    var argType = this.parseIdentifierIfPossible().value;
    var typeEndPosition = this.clonePosition();
    switch (argType) {
      case "":
        return this.error(ErrorKind.EXPECT_ARGUMENT_TYPE, createLocation(typeStartPosition, typeEndPosition));
      case "number":
      case "date":
      case "time": {
        this.bumpSpace();
        var styleAndLocation = null;
        if (this.bumpIf(",")) {
          this.bumpSpace();
          var styleStartPosition = this.clonePosition();
          var result = this.parseSimpleArgStyleIfPossible();
          if (result.err) {
            return result;
          }
          var style = trimEnd(result.val);
          if (style.length === 0) {
            return this.error(ErrorKind.EXPECT_ARGUMENT_STYLE, createLocation(this.clonePosition(), this.clonePosition()));
          }
          var styleLocation = createLocation(styleStartPosition, this.clonePosition());
          styleAndLocation = {style, styleLocation};
        }
        var argCloseResult = this.tryParseArgumentClose(openingBracePosition);
        if (argCloseResult.err) {
          return argCloseResult;
        }
        var location_1 = createLocation(openingBracePosition, this.clonePosition());
        if (styleAndLocation && startsWith(styleAndLocation === null || styleAndLocation === void 0 ? void 0 : styleAndLocation.style, "::", 0)) {
          var skeleton = trimStart(styleAndLocation.style.slice(2));
          if (argType === "number") {
            var result = this.parseNumberSkeletonFromString(skeleton, styleAndLocation.styleLocation);
            if (result.err) {
              return result;
            }
            return {
              val: {type: TYPE.number, value, location: location_1, style: result.val},
              err: null
            };
          } else {
            if (skeleton.length === 0) {
              return this.error(ErrorKind.EXPECT_DATE_TIME_SKELETON, location_1);
            }
            var style = {
              type: SKELETON_TYPE.dateTime,
              pattern: skeleton,
              location: styleAndLocation.styleLocation,
              parsedOptions: this.shouldParseSkeletons ? parseDateTimeSkeleton(skeleton) : {}
            };
            var type = argType === "date" ? TYPE.date : TYPE.time;
            return {
              val: {type, value, location: location_1, style},
              err: null
            };
          }
        }
        return {
          val: {
            type: argType === "number" ? TYPE.number : argType === "date" ? TYPE.date : TYPE.time,
            value,
            location: location_1,
            style: (_a2 = styleAndLocation === null || styleAndLocation === void 0 ? void 0 : styleAndLocation.style) !== null && _a2 !== void 0 ? _a2 : null
          },
          err: null
        };
      }
      case "plural":
      case "selectordinal":
      case "select": {
        var typeEndPosition_1 = this.clonePosition();
        this.bumpSpace();
        if (!this.bumpIf(",")) {
          return this.error(ErrorKind.EXPECT_SELECT_ARGUMENT_OPTIONS, createLocation(typeEndPosition_1, __assign({}, typeEndPosition_1)));
        }
        this.bumpSpace();
        var identifierAndLocation = this.parseIdentifierIfPossible();
        var pluralOffset = 0;
        if (argType !== "select" && identifierAndLocation.value === "offset") {
          if (!this.bumpIf(":")) {
            return this.error(ErrorKind.EXPECT_PLURAL_ARGUMENT_OFFSET_VALUE, createLocation(this.clonePosition(), this.clonePosition()));
          }
          this.bumpSpace();
          var result = this.tryParseDecimalInteger(ErrorKind.EXPECT_PLURAL_ARGUMENT_OFFSET_VALUE, ErrorKind.INVALID_PLURAL_ARGUMENT_OFFSET_VALUE);
          if (result.err) {
            return result;
          }
          this.bumpSpace();
          identifierAndLocation = this.parseIdentifierIfPossible();
          pluralOffset = result.val;
        }
        var optionsResult = this.tryParsePluralOrSelectOptions(nestingLevel, argType, expectingCloseTag, identifierAndLocation);
        if (optionsResult.err) {
          return optionsResult;
        }
        var argCloseResult = this.tryParseArgumentClose(openingBracePosition);
        if (argCloseResult.err) {
          return argCloseResult;
        }
        var location_2 = createLocation(openingBracePosition, this.clonePosition());
        if (argType === "select") {
          return {
            val: {
              type: TYPE.select,
              value,
              options: fromEntries(optionsResult.val),
              location: location_2
            },
            err: null
          };
        } else {
          return {
            val: {
              type: TYPE.plural,
              value,
              options: fromEntries(optionsResult.val),
              offset: pluralOffset,
              pluralType: argType === "plural" ? "cardinal" : "ordinal",
              location: location_2
            },
            err: null
          };
        }
      }
      default:
        return this.error(ErrorKind.INVALID_ARGUMENT_TYPE, createLocation(typeStartPosition, typeEndPosition));
    }
  };
  Parser2.prototype.tryParseArgumentClose = function(openingBracePosition) {
    if (this.isEOF() || this.char() !== 125) {
      return this.error(ErrorKind.EXPECT_ARGUMENT_CLOSING_BRACE, createLocation(openingBracePosition, this.clonePosition()));
    }
    this.bump();
    return {val: true, err: null};
  };
  Parser2.prototype.parseSimpleArgStyleIfPossible = function() {
    var nestedBraces = 0;
    var startPosition = this.clonePosition();
    while (!this.isEOF()) {
      var ch = this.char();
      switch (ch) {
        case 39: {
          this.bump();
          var apostrophePosition = this.clonePosition();
          if (!this.bumpUntil("'")) {
            return this.error(ErrorKind.UNCLOSED_QUOTE_IN_ARGUMENT_STYLE, createLocation(apostrophePosition, this.clonePosition()));
          }
          this.bump();
          break;
        }
        case 123: {
          nestedBraces += 1;
          this.bump();
          break;
        }
        case 125: {
          if (nestedBraces > 0) {
            nestedBraces -= 1;
          } else {
            return {
              val: this.message.slice(startPosition.offset, this.offset()),
              err: null
            };
          }
          break;
        }
        default:
          this.bump();
          break;
      }
    }
    return {
      val: this.message.slice(startPosition.offset, this.offset()),
      err: null
    };
  };
  Parser2.prototype.parseNumberSkeletonFromString = function(skeleton, location) {
    var tokens = [];
    try {
      tokens = parseNumberSkeletonFromString(skeleton);
    } catch (e) {
      return this.error(ErrorKind.INVALID_NUMBER_SKELETON, location);
    }
    return {
      val: {
        type: SKELETON_TYPE.number,
        tokens,
        location,
        parsedOptions: this.shouldParseSkeletons ? parseNumberSkeleton(tokens) : {}
      },
      err: null
    };
  };
  Parser2.prototype.tryParsePluralOrSelectOptions = function(nestingLevel, parentArgType, expectCloseTag, parsedFirstIdentifier) {
    var _a2;
    var hasOtherClause = false;
    var options = [];
    var parsedSelectors = new Set();
    var selector = parsedFirstIdentifier.value, selectorLocation = parsedFirstIdentifier.location;
    while (true) {
      if (selector.length === 0) {
        var startPosition = this.clonePosition();
        if (parentArgType !== "select" && this.bumpIf("=")) {
          var result = this.tryParseDecimalInteger(ErrorKind.EXPECT_PLURAL_ARGUMENT_SELECTOR, ErrorKind.INVALID_PLURAL_ARGUMENT_SELECTOR);
          if (result.err) {
            return result;
          }
          selectorLocation = createLocation(startPosition, this.clonePosition());
          selector = this.message.slice(startPosition.offset, this.offset());
        } else {
          break;
        }
      }
      if (parsedSelectors.has(selector)) {
        return this.error(parentArgType === "select" ? ErrorKind.DUPLICATE_SELECT_ARGUMENT_SELECTOR : ErrorKind.DUPLICATE_PLURAL_ARGUMENT_SELECTOR, selectorLocation);
      }
      if (selector === "other") {
        hasOtherClause = true;
      }
      this.bumpSpace();
      var openingBracePosition = this.clonePosition();
      if (!this.bumpIf("{")) {
        return this.error(parentArgType === "select" ? ErrorKind.EXPECT_SELECT_ARGUMENT_SELECTOR_FRAGMENT : ErrorKind.EXPECT_PLURAL_ARGUMENT_SELECTOR_FRAGMENT, createLocation(this.clonePosition(), this.clonePosition()));
      }
      var fragmentResult = this.parseMessage(nestingLevel + 1, parentArgType, expectCloseTag);
      if (fragmentResult.err) {
        return fragmentResult;
      }
      var argCloseResult = this.tryParseArgumentClose(openingBracePosition);
      if (argCloseResult.err) {
        return argCloseResult;
      }
      options.push([
        selector,
        {
          value: fragmentResult.val,
          location: createLocation(openingBracePosition, this.clonePosition())
        }
      ]);
      parsedSelectors.add(selector);
      this.bumpSpace();
      _a2 = this.parseIdentifierIfPossible(), selector = _a2.value, selectorLocation = _a2.location;
    }
    if (options.length === 0) {
      return this.error(parentArgType === "select" ? ErrorKind.EXPECT_SELECT_ARGUMENT_SELECTOR : ErrorKind.EXPECT_PLURAL_ARGUMENT_SELECTOR, createLocation(this.clonePosition(), this.clonePosition()));
    }
    if (this.requiresOtherClause && !hasOtherClause) {
      return this.error(ErrorKind.MISSING_OTHER_CLAUSE, createLocation(this.clonePosition(), this.clonePosition()));
    }
    return {val: options, err: null};
  };
  Parser2.prototype.tryParseDecimalInteger = function(expectNumberError, invalidNumberError) {
    var sign = 1;
    var startingPosition = this.clonePosition();
    if (this.bumpIf("+")) ; else if (this.bumpIf("-")) {
      sign = -1;
    }
    var hasDigits = false;
    var decimal = 0;
    while (!this.isEOF()) {
      var ch = this.char();
      if (ch >= 48 && ch <= 57) {
        hasDigits = true;
        decimal = decimal * 10 + (ch - 48);
        this.bump();
      } else {
        break;
      }
    }
    var location = createLocation(startingPosition, this.clonePosition());
    if (!hasDigits) {
      return this.error(expectNumberError, location);
    }
    decimal *= sign;
    if (!isSafeInteger(decimal)) {
      return this.error(invalidNumberError, location);
    }
    return {val: decimal, err: null};
  };
  Parser2.prototype.offset = function() {
    return this.position.offset;
  };
  Parser2.prototype.isEOF = function() {
    return this.offset() === this.message.length;
  };
  Parser2.prototype.clonePosition = function() {
    return {
      offset: this.position.offset,
      line: this.position.line,
      column: this.position.column
    };
  };
  Parser2.prototype.char = function() {
    var offset = this.position.offset;
    if (offset >= this.message.length) {
      throw Error("out of bound");
    }
    var code = codePointAt(this.message, offset);
    if (code === void 0) {
      throw Error("Offset " + offset + " is at invalid UTF-16 code unit boundary");
    }
    return code;
  };
  Parser2.prototype.error = function(kind, location) {
    return {
      val: null,
      err: {
        kind,
        message: this.message,
        location
      }
    };
  };
  Parser2.prototype.bump = function() {
    if (this.isEOF()) {
      return;
    }
    var code = this.char();
    if (code === 10) {
      this.position.line += 1;
      this.position.column = 1;
      this.position.offset += 1;
    } else {
      this.position.column += 1;
      this.position.offset += code < 65536 ? 1 : 2;
    }
  };
  Parser2.prototype.bumpIf = function(prefix) {
    if (startsWith(this.message, prefix, this.offset())) {
      for (var i = 0; i < prefix.length; i++) {
        this.bump();
      }
      return true;
    }
    return false;
  };
  Parser2.prototype.bumpUntil = function(pattern) {
    var currentOffset = this.offset();
    var index = this.message.indexOf(pattern, currentOffset);
    if (index >= 0) {
      this.bumpTo(index);
      return true;
    } else {
      this.bumpTo(this.message.length);
      return false;
    }
  };
  Parser2.prototype.bumpTo = function(targetOffset) {
    if (this.offset() > targetOffset) {
      throw Error("targetOffset " + targetOffset + " must be greater than or equal to the current offset " + this.offset());
    }
    targetOffset = Math.min(targetOffset, this.message.length);
    while (true) {
      var offset = this.offset();
      if (offset === targetOffset) {
        break;
      }
      if (offset > targetOffset) {
        throw Error("targetOffset " + targetOffset + " is at invalid UTF-16 code unit boundary");
      }
      this.bump();
      if (this.isEOF()) {
        break;
      }
    }
  };
  Parser2.prototype.bumpSpace = function() {
    while (!this.isEOF() && _isWhiteSpace(this.char())) {
      this.bump();
    }
  };
  Parser2.prototype.peek = function() {
    if (this.isEOF()) {
      return null;
    }
    var code = this.char();
    var offset = this.offset();
    var nextCode = this.message.charCodeAt(offset + (code >= 65536 ? 2 : 1));
    return nextCode !== null && nextCode !== void 0 ? nextCode : null;
  };
  return Parser2;
}();
function _isAlpha(codepoint) {
  return codepoint >= 97 && codepoint <= 122 || codepoint >= 65 && codepoint <= 90;
}
function _isAlphaOrSlash(codepoint) {
  return _isAlpha(codepoint) || codepoint === 47;
}
function _isPotentialElementNameChar(c) {
  return c === 45 || c === 46 || c >= 48 && c <= 57 || c === 95 || c >= 97 && c <= 122 || c >= 65 && c <= 90 || c == 183 || c >= 192 && c <= 214 || c >= 216 && c <= 246 || c >= 248 && c <= 893 || c >= 895 && c <= 8191 || c >= 8204 && c <= 8205 || c >= 8255 && c <= 8256 || c >= 8304 && c <= 8591 || c >= 11264 && c <= 12271 || c >= 12289 && c <= 55295 || c >= 63744 && c <= 64975 || c >= 65008 && c <= 65533 || c >= 65536 && c <= 983039;
}
function _isWhiteSpace(c) {
  return c >= 9 && c <= 13 || c === 32 || c === 133 || c >= 8206 && c <= 8207 || c === 8232 || c === 8233;
}
function _isPatternSyntax(c) {
  return c >= 33 && c <= 35 || c === 36 || c >= 37 && c <= 39 || c === 40 || c === 41 || c === 42 || c === 43 || c === 44 || c === 45 || c >= 46 && c <= 47 || c >= 58 && c <= 59 || c >= 60 && c <= 62 || c >= 63 && c <= 64 || c === 91 || c === 92 || c === 93 || c === 94 || c === 96 || c === 123 || c === 124 || c === 125 || c === 126 || c === 161 || c >= 162 && c <= 165 || c === 166 || c === 167 || c === 169 || c === 171 || c === 172 || c === 174 || c === 176 || c === 177 || c === 182 || c === 187 || c === 191 || c === 215 || c === 247 || c >= 8208 && c <= 8213 || c >= 8214 && c <= 8215 || c === 8216 || c === 8217 || c === 8218 || c >= 8219 && c <= 8220 || c === 8221 || c === 8222 || c === 8223 || c >= 8224 && c <= 8231 || c >= 8240 && c <= 8248 || c === 8249 || c === 8250 || c >= 8251 && c <= 8254 || c >= 8257 && c <= 8259 || c === 8260 || c === 8261 || c === 8262 || c >= 8263 && c <= 8273 || c === 8274 || c === 8275 || c >= 8277 && c <= 8286 || c >= 8592 && c <= 8596 || c >= 8597 && c <= 8601 || c >= 8602 && c <= 8603 || c >= 8604 && c <= 8607 || c === 8608 || c >= 8609 && c <= 8610 || c === 8611 || c >= 8612 && c <= 8613 || c === 8614 || c >= 8615 && c <= 8621 || c === 8622 || c >= 8623 && c <= 8653 || c >= 8654 && c <= 8655 || c >= 8656 && c <= 8657 || c === 8658 || c === 8659 || c === 8660 || c >= 8661 && c <= 8691 || c >= 8692 && c <= 8959 || c >= 8960 && c <= 8967 || c === 8968 || c === 8969 || c === 8970 || c === 8971 || c >= 8972 && c <= 8991 || c >= 8992 && c <= 8993 || c >= 8994 && c <= 9e3 || c === 9001 || c === 9002 || c >= 9003 && c <= 9083 || c === 9084 || c >= 9085 && c <= 9114 || c >= 9115 && c <= 9139 || c >= 9140 && c <= 9179 || c >= 9180 && c <= 9185 || c >= 9186 && c <= 9254 || c >= 9255 && c <= 9279 || c >= 9280 && c <= 9290 || c >= 9291 && c <= 9311 || c >= 9472 && c <= 9654 || c === 9655 || c >= 9656 && c <= 9664 || c === 9665 || c >= 9666 && c <= 9719 || c >= 9720 && c <= 9727 || c >= 9728 && c <= 9838 || c === 9839 || c >= 9840 && c <= 10087 || c === 10088 || c === 10089 || c === 10090 || c === 10091 || c === 10092 || c === 10093 || c === 10094 || c === 10095 || c === 10096 || c === 10097 || c === 10098 || c === 10099 || c === 10100 || c === 10101 || c >= 10132 && c <= 10175 || c >= 10176 && c <= 10180 || c === 10181 || c === 10182 || c >= 10183 && c <= 10213 || c === 10214 || c === 10215 || c === 10216 || c === 10217 || c === 10218 || c === 10219 || c === 10220 || c === 10221 || c === 10222 || c === 10223 || c >= 10224 && c <= 10239 || c >= 10240 && c <= 10495 || c >= 10496 && c <= 10626 || c === 10627 || c === 10628 || c === 10629 || c === 10630 || c === 10631 || c === 10632 || c === 10633 || c === 10634 || c === 10635 || c === 10636 || c === 10637 || c === 10638 || c === 10639 || c === 10640 || c === 10641 || c === 10642 || c === 10643 || c === 10644 || c === 10645 || c === 10646 || c === 10647 || c === 10648 || c >= 10649 && c <= 10711 || c === 10712 || c === 10713 || c === 10714 || c === 10715 || c >= 10716 && c <= 10747 || c === 10748 || c === 10749 || c >= 10750 && c <= 11007 || c >= 11008 && c <= 11055 || c >= 11056 && c <= 11076 || c >= 11077 && c <= 11078 || c >= 11079 && c <= 11084 || c >= 11085 && c <= 11123 || c >= 11124 && c <= 11125 || c >= 11126 && c <= 11157 || c === 11158 || c >= 11159 && c <= 11263 || c >= 11776 && c <= 11777 || c === 11778 || c === 11779 || c === 11780 || c === 11781 || c >= 11782 && c <= 11784 || c === 11785 || c === 11786 || c === 11787 || c === 11788 || c === 11789 || c >= 11790 && c <= 11798 || c === 11799 || c >= 11800 && c <= 11801 || c === 11802 || c === 11803 || c === 11804 || c === 11805 || c >= 11806 && c <= 11807 || c === 11808 || c === 11809 || c === 11810 || c === 11811 || c === 11812 || c === 11813 || c === 11814 || c === 11815 || c === 11816 || c === 11817 || c >= 11818 && c <= 11822 || c === 11823 || c >= 11824 && c <= 11833 || c >= 11834 && c <= 11835 || c >= 11836 && c <= 11839 || c === 11840 || c === 11841 || c === 11842 || c >= 11843 && c <= 11855 || c >= 11856 && c <= 11857 || c === 11858 || c >= 11859 && c <= 11903 || c >= 12289 && c <= 12291 || c === 12296 || c === 12297 || c === 12298 || c === 12299 || c === 12300 || c === 12301 || c === 12302 || c === 12303 || c === 12304 || c === 12305 || c >= 12306 && c <= 12307 || c === 12308 || c === 12309 || c === 12310 || c === 12311 || c === 12312 || c === 12313 || c === 12314 || c === 12315 || c === 12316 || c === 12317 || c >= 12318 && c <= 12319 || c === 12320 || c === 12336 || c === 64830 || c === 64831 || c >= 65093 && c <= 65094;
}

// bazel-out/darwin-fastbuild/bin/packages/icu-messageformat-parser/lib/index.js
function pruneLocation(els) {
  els.forEach(function(el) {
    delete el.location;
    if (isSelectElement(el) || isPluralElement(el)) {
      for (var k in el.options) {
        delete el.options[k].location;
        pruneLocation(el.options[k].value);
      }
    } else if (isNumberElement(el) && isNumberSkeleton(el.style)) {
      delete el.style.location;
    } else if ((isDateElement(el) || isTimeElement(el)) && isDateTimeSkeleton(el.style)) {
      delete el.style.location;
    } else if (isTagElement(el)) {
      pruneLocation(el.children);
    }
  });
}
function parse(message, opts) {
  if (opts === void 0) {
    opts = {};
  }
  opts = __assign({shouldParseSkeletons: true, requiresOtherClause: true}, opts);
  var result = new Parser(message, opts).parse();
  if (result.err) {
    var error = SyntaxError(ErrorKind[result.err.kind]);
    error.location = result.err.location;
    error.originalMessage = result.err.message;
    throw error;
  }
  if (!(opts === null || opts === void 0 ? void 0 : opts.captureLocation)) {
    pruneLocation(result.val);
  }
  return result.val;
}

// bazel-out/darwin-fastbuild/bin/packages/fast-memoize/lib/index.js
function memoize(fn, options) {
  var cache = options && options.cache ? options.cache : cacheDefault;
  var serializer = options && options.serializer ? options.serializer : serializerDefault;
  var strategy = options && options.strategy ? options.strategy : strategyDefault;
  return strategy(fn, {
    cache,
    serializer
  });
}
function isPrimitive(value) {
  return value == null || typeof value === "number" || typeof value === "boolean";
}
function monadic(fn, cache, serializer, arg) {
  var cacheKey = isPrimitive(arg) ? arg : serializer(arg);
  var computedValue = cache.get(cacheKey);
  if (typeof computedValue === "undefined") {
    computedValue = fn.call(this, arg);
    cache.set(cacheKey, computedValue);
  }
  return computedValue;
}
function variadic(fn, cache, serializer) {
  var args = Array.prototype.slice.call(arguments, 3);
  var cacheKey = serializer(args);
  var computedValue = cache.get(cacheKey);
  if (typeof computedValue === "undefined") {
    computedValue = fn.apply(this, args);
    cache.set(cacheKey, computedValue);
  }
  return computedValue;
}
function assemble(fn, context, strategy, cache, serialize) {
  return strategy.bind(context, fn, cache, serialize);
}
function strategyDefault(fn, options) {
  var strategy = fn.length === 1 ? monadic : variadic;
  return assemble(fn, this, strategy, options.cache.create(), options.serializer);
}
function strategyVariadic(fn, options) {
  return assemble(fn, this, variadic, options.cache.create(), options.serializer);
}
function strategyMonadic(fn, options) {
  return assemble(fn, this, monadic, options.cache.create(), options.serializer);
}
var serializerDefault = function() {
  return JSON.stringify(arguments);
};
function ObjectWithoutPrototypeCache() {
  this.cache = Object.create(null);
}
ObjectWithoutPrototypeCache.prototype.has = function(key) {
  return key in this.cache;
};
ObjectWithoutPrototypeCache.prototype.get = function(key) {
  return this.cache[key];
};
ObjectWithoutPrototypeCache.prototype.set = function(key, value) {
  this.cache[key] = value;
};
var cacheDefault = {
  create: function create() {
    return new ObjectWithoutPrototypeCache();
  }
};
var strategies = {
  variadic: strategyVariadic,
  monadic: strategyMonadic
};

// bazel-out/darwin-fastbuild/bin/packages/intl-messageformat/lib_esnext/src/error.js
var ErrorCode;
(function(ErrorCode2) {
  ErrorCode2["MISSING_VALUE"] = "MISSING_VALUE";
  ErrorCode2["INVALID_VALUE"] = "INVALID_VALUE";
  ErrorCode2["MISSING_INTL_API"] = "MISSING_INTL_API";
})(ErrorCode || (ErrorCode = {}));
var FormatError = class extends Error {
  constructor(msg, code, originalMessage) {
    super(msg);
    this.code = code;
    this.originalMessage = originalMessage;
  }
  toString() {
    return `[formatjs Error: ${this.code}] ${this.message}`;
  }
};
var InvalidValueError = class extends FormatError {
  constructor(variableId, value, options, originalMessage) {
    super(`Invalid values for "${variableId}": "${value}". Options are "${Object.keys(options).join('", "')}"`, ErrorCode.INVALID_VALUE, originalMessage);
  }
};
var InvalidValueTypeError = class extends FormatError {
  constructor(value, type, originalMessage) {
    super(`Value for "${value}" must be of type ${type}`, ErrorCode.INVALID_VALUE, originalMessage);
  }
};
var MissingValueError = class extends FormatError {
  constructor(variableId, originalMessage) {
    super(`The intl string context variable "${variableId}" was not provided to the string "${originalMessage}"`, ErrorCode.MISSING_VALUE, originalMessage);
  }
};

// bazel-out/darwin-fastbuild/bin/packages/intl-messageformat/lib_esnext/src/formatters.js
var PART_TYPE;
(function(PART_TYPE2) {
  PART_TYPE2[PART_TYPE2["literal"] = 0] = "literal";
  PART_TYPE2[PART_TYPE2["object"] = 1] = "object";
})(PART_TYPE || (PART_TYPE = {}));
function mergeLiteral(parts) {
  if (parts.length < 2) {
    return parts;
  }
  return parts.reduce((all, part) => {
    const lastPart = all[all.length - 1];
    if (!lastPart || lastPart.type !== PART_TYPE.literal || part.type !== PART_TYPE.literal) {
      all.push(part);
    } else {
      lastPart.value += part.value;
    }
    return all;
  }, []);
}
function isFormatXMLElementFn(el) {
  return typeof el === "function";
}
function formatToParts(els, locales, formatters, formats, values, currentPluralValue, originalMessage) {
  if (els.length === 1 && isLiteralElement(els[0])) {
    return [
      {
        type: PART_TYPE.literal,
        value: els[0].value
      }
    ];
  }
  const result = [];
  for (const el of els) {
    if (isLiteralElement(el)) {
      result.push({
        type: PART_TYPE.literal,
        value: el.value
      });
      continue;
    }
    if (isPoundElement(el)) {
      if (typeof currentPluralValue === "number") {
        result.push({
          type: PART_TYPE.literal,
          value: formatters.getNumberFormat(locales).format(currentPluralValue)
        });
      }
      continue;
    }
    const {value: varName} = el;
    if (!(values && varName in values)) {
      throw new MissingValueError(varName, originalMessage);
    }
    let value = values[varName];
    if (isArgumentElement(el)) {
      if (!value || typeof value === "string" || typeof value === "number") {
        value = typeof value === "string" || typeof value === "number" ? String(value) : "";
      }
      result.push({
        type: typeof value === "string" ? PART_TYPE.literal : PART_TYPE.object,
        value
      });
      continue;
    }
    if (isDateElement(el)) {
      const style = typeof el.style === "string" ? formats.date[el.style] : isDateTimeSkeleton(el.style) ? el.style.parsedOptions : void 0;
      result.push({
        type: PART_TYPE.literal,
        value: formatters.getDateTimeFormat(locales, style).format(value)
      });
      continue;
    }
    if (isTimeElement(el)) {
      const style = typeof el.style === "string" ? formats.time[el.style] : isDateTimeSkeleton(el.style) ? el.style.parsedOptions : void 0;
      result.push({
        type: PART_TYPE.literal,
        value: formatters.getDateTimeFormat(locales, style).format(value)
      });
      continue;
    }
    if (isNumberElement(el)) {
      const style = typeof el.style === "string" ? formats.number[el.style] : isNumberSkeleton(el.style) ? el.style.parsedOptions : void 0;
      if (style && style.scale) {
        value = value * (style.scale || 1);
      }
      result.push({
        type: PART_TYPE.literal,
        value: formatters.getNumberFormat(locales, style).format(value)
      });
      continue;
    }
    if (isTagElement(el)) {
      const {children, value: value2} = el;
      const formatFn = values[value2];
      if (!isFormatXMLElementFn(formatFn)) {
        throw new InvalidValueTypeError(value2, "function", originalMessage);
      }
      const parts = formatToParts(children, locales, formatters, formats, values, currentPluralValue);
      let chunks = formatFn(parts.map((p) => p.value));
      if (!Array.isArray(chunks)) {
        chunks = [chunks];
      }
      result.push(...chunks.map((c) => {
        return {
          type: typeof c === "string" ? PART_TYPE.literal : PART_TYPE.object,
          value: c
        };
      }));
    }
    if (isSelectElement(el)) {
      const opt = el.options[value] || el.options.other;
      if (!opt) {
        throw new InvalidValueError(el.value, value, Object.keys(el.options), originalMessage);
      }
      result.push(...formatToParts(opt.value, locales, formatters, formats, values));
      continue;
    }
    if (isPluralElement(el)) {
      let opt = el.options[`=${value}`];
      if (!opt) {
        if (!Intl.PluralRules) {
          throw new FormatError(`Intl.PluralRules is not available in this environment.
Try polyfilling it using "@formatjs/intl-pluralrules"
`, ErrorCode.MISSING_INTL_API, originalMessage);
        }
        const rule = formatters.getPluralRules(locales, {type: el.pluralType}).select(value - (el.offset || 0));
        opt = el.options[rule] || el.options.other;
      }
      if (!opt) {
        throw new InvalidValueError(el.value, value, Object.keys(el.options), originalMessage);
      }
      result.push(...formatToParts(opt.value, locales, formatters, formats, values, value - (el.offset || 0)));
      continue;
    }
  }
  return mergeLiteral(result);
}

// bazel-out/darwin-fastbuild/bin/packages/intl-messageformat/lib_esnext/src/core.js
function mergeConfig(c1, c2) {
  if (!c2) {
    return c1;
  }
  return {
    ...c1 || {},
    ...c2 || {},
    ...Object.keys(c1).reduce((all, k) => {
      all[k] = {
        ...c1[k],
        ...c2[k] || {}
      };
      return all;
    }, {})
  };
}
function mergeConfigs(defaultConfig, configs) {
  if (!configs) {
    return defaultConfig;
  }
  return Object.keys(defaultConfig).reduce((all, k) => {
    all[k] = mergeConfig(defaultConfig[k], configs[k]);
    return all;
  }, {...defaultConfig});
}
function createFastMemoizeCache(store) {
  return {
    create() {
      return {
        has(key) {
          return key in store;
        },
        get(key) {
          return store[key];
        },
        set(key, value) {
          store[key] = value;
        }
      };
    }
  };
}
function createDefaultFormatters(cache = {
  number: {},
  dateTime: {},
  pluralRules: {}
}) {
  return {
    getNumberFormat: memoize((...args) => new Intl.NumberFormat(...args), {
      cache: createFastMemoizeCache(cache.number),
      strategy: strategies.variadic
    }),
    getDateTimeFormat: memoize((...args) => new Intl.DateTimeFormat(...args), {
      cache: createFastMemoizeCache(cache.dateTime),
      strategy: strategies.variadic
    }),
    getPluralRules: memoize((...args) => new Intl.PluralRules(...args), {
      cache: createFastMemoizeCache(cache.pluralRules),
      strategy: strategies.variadic
    })
  };
}
var IntlMessageFormat = class {
  constructor(message, locales = IntlMessageFormat.defaultLocale, overrideFormats, opts) {
    this.formatterCache = {
      number: {},
      dateTime: {},
      pluralRules: {}
    };
    this.format = (values) => {
      const parts = this.formatToParts(values);
      if (parts.length === 1) {
        return parts[0].value;
      }
      const result = parts.reduce((all, part) => {
        if (!all.length || part.type !== PART_TYPE.literal || typeof all[all.length - 1] !== "string") {
          all.push(part.value);
        } else {
          all[all.length - 1] += part.value;
        }
        return all;
      }, []);
      if (result.length <= 1) {
        return result[0] || "";
      }
      return result;
    };
    this.formatToParts = (values) => formatToParts(this.ast, this.locales, this.formatters, this.formats, values, void 0, this.message);
    this.resolvedOptions = () => ({
      locale: Intl.NumberFormat.supportedLocalesOf(this.locales)[0]
    });
    this.getAst = () => this.ast;
    if (typeof message === "string") {
      this.message = message;
      if (!IntlMessageFormat.__parse) {
        throw new TypeError("IntlMessageFormat.__parse must be set to process `message` of type `string`");
      }
      this.ast = IntlMessageFormat.__parse(message, {
        ignoreTag: opts?.ignoreTag
      });
    } else {
      this.ast = message;
    }
    if (!Array.isArray(this.ast)) {
      throw new TypeError("A message must be provided as a String or AST.");
    }
    this.formats = mergeConfigs(IntlMessageFormat.formats, overrideFormats);
    this.locales = locales;
    this.formatters = opts && opts.formatters || createDefaultFormatters(this.formatterCache);
  }
  static get defaultLocale() {
    if (!IntlMessageFormat.memoizedDefaultLocale) {
      IntlMessageFormat.memoizedDefaultLocale = new Intl.NumberFormat().resolvedOptions().locale;
    }
    return IntlMessageFormat.memoizedDefaultLocale;
  }
};
IntlMessageFormat.memoizedDefaultLocale = null;
IntlMessageFormat.__parse = parse;
IntlMessageFormat.formats = {
  number: {
    integer: {
      maximumFractionDigits: 0
    },
    currency: {
      style: "currency"
    },
    percent: {
      style: "percent"
    }
  },
  date: {
    short: {
      month: "numeric",
      day: "numeric",
      year: "2-digit"
    },
    medium: {
      month: "short",
      day: "numeric",
      year: "numeric"
    },
    long: {
      month: "long",
      day: "numeric",
      year: "numeric"
    },
    full: {
      weekday: "long",
      month: "long",
      day: "numeric",
      year: "numeric"
    }
  },
  time: {
    short: {
      hour: "numeric",
      minute: "numeric"
    },
    medium: {
      hour: "numeric",
      minute: "numeric",
      second: "numeric"
    },
    long: {
      hour: "numeric",
      minute: "numeric",
      second: "numeric",
      timeZoneName: "short"
    },
    full: {
      hour: "numeric",
      minute: "numeric",
      second: "numeric",
      timeZoneName: "short"
    }
  }
};

// bazel-out/darwin-fastbuild/bin/packages/intl-messageformat/lib_esnext/index.js
var lib_esnext_default = IntlMessageFormat;
/*! *****************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */

// Copyright 2018 The Lighthouse Authors. All Rights Reserved.
// Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0
// Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
const EMPTY_VALUES_OBJECT = {};
/**
 * This class is usually created at module instantiation time and
 * holds the filename, the UIStrings object and a reference to
 * all the localization data.
 *
 * Later, once needed, users can request a `LocalizedStringSet` that represents
 * all the translated strings, in a given locale for the specific file and
 * UIStrings object.
 *
 * Please note that this class is implemented with invariant in mind that the
 * DevTools locale never changes. Otherwise we would have to use a Map as
 * the cache. For performance reasons, we store the single possible map entry
 * as a property directly.
 *
 * The DevTools locale CANNOT be passed via the constructor. When instances
 * of `RegisteredFileStrings` are created, the DevTools locale has not yet
 * been determined.
 */
class RegisteredFileStrings {
    filename;
    stringStructure;
    localizedMessages;
    localizedStringSet;
    constructor(filename, stringStructure, localizedMessages) {
        this.filename = filename;
        this.stringStructure = stringStructure;
        this.localizedMessages = localizedMessages;
    }
    getLocalizedStringSetFor(locale) {
        if (this.localizedStringSet) {
            return this.localizedStringSet;
        }
        const localeData = this.localizedMessages.get(locale);
        if (!localeData) {
            throw new Error(`No locale data registered for '${locale}'`);
        }
        this.localizedStringSet = new LocalizedStringSet(this.filename, this.stringStructure, locale, localeData);
        return this.localizedStringSet;
    }
}
/**
 * A set of translated strings for a single file in a specific locale.
 *
 * The class is a wrapper around `IntlMessageFormat#format` plus a cache
 * to speed up consecutive lookups of the same message.
 */
class LocalizedStringSet {
    filename;
    stringStructure;
    localizedMessages;
    cachedSimpleStrings = new Map();
    cachedMessageFormatters = new Map();
    /** For pseudo locales, use 'de-DE' for number formatting */
    localeForFormatter;
    constructor(filename, stringStructure, locale, localizedMessages) {
        this.filename = filename;
        this.stringStructure = stringStructure;
        this.localizedMessages = localizedMessages;
        this.localeForFormatter = (locale === 'en-XA' || locale === 'en-XL') ? 'de-DE' : locale;
    }
    getLocalizedString(message, values = EMPTY_VALUES_OBJECT) {
        if (values === EMPTY_VALUES_OBJECT || Object.keys(values).length === 0) {
            return this.getSimpleLocalizedString(message);
        }
        return this.getFormattedLocalizedString(message, values);
    }
    getMessageFormatterFor(message) {
        const keyname = Object.keys(this.stringStructure).find(key => this.stringStructure[key] === message);
        if (!keyname) {
            throw new Error(`Unable to locate '${message}' in UIStrings object`);
        }
        const i18nId = `${this.filename} | ${keyname}`;
        const localeMessage = this.localizedMessages[i18nId];
        // The requested string might not yet have been collected into en-US.json or
        // been translated yet. Fall back to the original TypeScript UIStrings message.
        const messageToTranslate = localeMessage ? localeMessage.message : message;
        return new lib_esnext_default(messageToTranslate, this.localeForFormatter, undefined, { ignoreTag: true });
    }
    getSimpleLocalizedString(message) {
        const cachedSimpleString = this.cachedSimpleStrings.get(message);
        if (cachedSimpleString) {
            return cachedSimpleString;
        }
        const formatter = this.getMessageFormatterFor(message);
        const translatedString = formatter.format();
        this.cachedSimpleStrings.set(message, translatedString);
        return translatedString;
    }
    getFormattedLocalizedString(message, values) {
        let formatter = this.cachedMessageFormatters.get(message);
        if (!formatter) {
            formatter = this.getMessageFormatterFor(message);
            this.cachedMessageFormatters.set(message, formatter);
        }
        try {
            return formatter.format(values);
        }
        catch (e) {
            // The message could have been updated and use different placeholders then
            // the translation. This is a rare edge case so it's fine to create a temporary
            // IntlMessageFormat and fall back to the UIStrings message.
            const formatter = new lib_esnext_default(message, this.localeForFormatter, undefined, { ignoreTag: true });
            return formatter.format(values);
        }
    }
}

// Copyright 2018 The Lighthouse Authors. All Rights Reserved.
// Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0
// Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
/**
 * Encapsulates the global state of the i18n runtime.
 */
class I18n {
    supportedLocales;
    localeData = new Map();
    defaultLocale;
    constructor(supportedLocales, defaultLocale) {
        this.defaultLocale = defaultLocale;
        this.supportedLocales = new Set(supportedLocales);
    }
    registerLocaleData(locale, messages) {
        this.localeData.set(locale, messages);
    }
    registerFileStrings(filename, stringStructure) {
        return new RegisteredFileStrings(filename, stringStructure, this.localeData);
    }
    /**
     * Look up the best available locale for the requested language through these fall backs:
     * - exact match
     * - progressively shorter prefixes (`de-CH-1996` -> `de-CH` -> `de`)
     * - the default locale if no match is found
     */
    lookupClosestSupportedLocale(locale) {
        const canonicalLocale = Intl.getCanonicalLocales(locale)[0];
        const localeParts = canonicalLocale.split('-');
        while (localeParts.length) {
            const candidate = localeParts.join('-');
            if (this.supportedLocales.has(candidate)) {
                return candidate;
            }
            localeParts.pop();
        }
        return this.defaultLocale;
    }
}

// Copyright (c) 2020 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
function swap(array, i1, i2) {
    const temp = array[i1];
    array[i1] = array[i2];
    array[i2] = temp;
}
function partition(array, comparator, left, right, pivotIndex) {
    const pivotValue = array[pivotIndex];
    swap(array, right, pivotIndex);
    let storeIndex = left;
    for (let i = left; i < right; ++i) {
        if (comparator(array[i], pivotValue) < 0) {
            swap(array, storeIndex, i);
            ++storeIndex;
        }
    }
    swap(array, right, storeIndex);
    return storeIndex;
}
function quickSortRange(array, comparator, left, right, sortWindowLeft, sortWindowRight) {
    if (right <= left) {
        return;
    }
    const pivotIndex = Math.floor(Math.random() * (right - left)) + left;
    const pivotNewIndex = partition(array, comparator, left, right, pivotIndex);
    if (sortWindowLeft < pivotNewIndex) {
        quickSortRange(array, comparator, left, pivotNewIndex - 1, sortWindowLeft, sortWindowRight);
    }
    if (pivotNewIndex < sortWindowRight) {
        quickSortRange(array, comparator, pivotNewIndex + 1, right, sortWindowLeft, sortWindowRight);
    }
}
function sortRange(array, comparator, leftBound, rightBound, sortWindowLeft, sortWindowRight) {
    if (leftBound === 0 && rightBound === (array.length - 1) && sortWindowLeft === 0 && sortWindowRight >= rightBound) {
        array.sort(comparator);
    }
    else {
        quickSortRange(array, comparator, leftBound, rightBound, sortWindowLeft, sortWindowRight);
    }
    return array;
}
const DEFAULT_COMPARATOR = (a, b) => {
    return a < b ? -1 : (a > b ? 1 : 0);
};
function lowerBound(array, needle, comparator, left, right) {
    let l = 0;
    let r = right !== undefined ? right : array.length;
    while (l < r) {
        const m = (l + r) >> 1;
        if (comparator(needle, array[m]) > 0) {
            l = m + 1;
        }
        else {
            r = m;
        }
    }
    return r;
}
// Type guard for ensuring that `arr` does not contain null or undefined
function arrayDoesNotContainNullOrUndefined(arr) {
    return !arr.includes(null) && !arr.includes(undefined);
}

// Copyright 2021 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
const EmptyUrlString = '';

// Copyright (c) 2020 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
class Multimap {
    map = new Map();
    set(key, value) {
        let set = this.map.get(key);
        if (!set) {
            set = new Set();
            this.map.set(key, set);
        }
        set.add(value);
    }
    get(key) {
        return this.map.get(key) || new Set();
    }
    has(key) {
        return this.map.has(key);
    }
    hasValue(key, value) {
        const set = this.map.get(key);
        if (!set) {
            return false;
        }
        return set.has(value);
    }
    get size() {
        return this.map.size;
    }
    delete(key, value) {
        const values = this.get(key);
        if (!values) {
            return false;
        }
        const result = values.delete(value);
        if (!values.size) {
            this.map.delete(key);
        }
        return result;
    }
    deleteAll(key) {
        this.map.delete(key);
    }
    keysArray() {
        return [...this.map.keys()];
    }
    keys() {
        return this.map.keys();
    }
    valuesArray() {
        const result = [];
        for (const set of this.map.values()) {
            result.push(...set.values());
        }
        return result;
    }
    clear() {
        this.map.clear();
    }
}

// Copyright 2023 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
/**
 * Returns a new pending promise together with it's resolve and reject functions.
 *
 * Polyfill for https://github.com/tc39/proposal-promise-with-resolvers.
 */
function promiseWithResolvers() {
    let resolve;
    let reject;
    const promise = new Promise((res, rej) => {
        resolve = res;
        reject = rej;
    });
    return { promise, resolve, reject };
}

// Copyright (c) 2020 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
/**
 * This implements a subset of the sprintf() function described in the Single UNIX
 * Specification. It supports the %s, %f, %d, and %% formatting specifiers, and
 * understands the %m$d notation to select the m-th parameter for this substitution,
 * as well as the optional precision for %s, %f, and %d.
 *
 * @param fmt format string.
 * @param args parameters to the format string.
 * @returns the formatted output string.
 */
const sprintf = (fmt, ...args) => {
    let argIndex = 0;
    const RE = /%(?:(\d+)\$)?(?:\.(\d*))?([%dfs])/g;
    return fmt.replaceAll(RE, (_, index, precision, specifier) => {
        if (specifier === '%') {
            return '%';
        }
        if (index !== undefined) {
            argIndex = parseInt(index, 10) - 1;
            if (argIndex < 0) {
                throw new RangeError(`Invalid parameter index ${argIndex + 1}`);
            }
        }
        if (argIndex >= args.length) {
            throw new RangeError(`Expected at least ${argIndex + 1} format parameters, but only ${args.length} where given.`);
        }
        if (specifier === 's') {
            const argValue = String(args[argIndex++]);
            if (precision !== undefined) {
                return argValue.substring(0, Number(precision));
            }
            return argValue;
        }
        let argValue = Number(args[argIndex++]);
        if (isNaN(argValue)) {
            argValue = 0;
        }
        if (specifier === 'd') {
            return String(Math.floor(argValue)).padStart(Number(precision), '0');
        }
        if (precision !== undefined) {
            return argValue.toFixed(Number(precision));
        }
        return String(argValue);
    });
};
const SPECIAL_REGEX_CHARACTERS = '^[]{}()\\.^$*+?|-,';
const regexSpecialCharacters = function () {
    return SPECIAL_REGEX_CHARACTERS;
};
const trimEndWithMaxLength = (str, maxLength) => {
    if (str.length <= maxLength) {
        return String(str);
    }
    return str.substr(0, maxLength - 1) + '…';
};
const createPlainTextSearchRegex = function (query, flags) {
    // This should be kept the same as the one in StringUtil.cpp.
    let regex = '';
    for (let i = 0; i < query.length; ++i) {
        const c = query.charAt(i);
        if (regexSpecialCharacters().indexOf(c) !== -1) {
            regex += '\\';
        }
        regex += c;
    }
    return new RegExp(regex, flags );
};
const stringifyWithPrecision = function stringifyWithPrecision(s, precision = 2) {
    if (precision === 0) {
        return s.toFixed(0);
    }
    const string = s.toFixed(precision).replace(/\.?0*$/, '');
    return string === '-0' ? '0' : string;
};

// Copyright 2024 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
/**
 * @returns A BigUint32Array implementation which is based on Array.
 * This means that its length automatically expands to include the highest index
 * used, and asArrayOrFail will succeed.
 */
function createExpandableBigUint32Array() {
    return new ExpandableBigUint32ArrayImpl();
}
/**
 * @returns A BigUint32Array implementation which is based on Uint32Array.
 * If the length is small enough to fit in a single Uint32Array, then
 * asUint32ArrayOrFail will succeed. Otherwise, it will throw an exception.
 */
function createFixedBigUint32Array(length, maxLengthForTesting) {
    try {
        if (maxLengthForTesting !== undefined && length > maxLengthForTesting) ;
        return new BasicBigUint32ArrayImpl(length);
    }
    catch {
        // We couldn't allocate a big enough ArrayBuffer.
        return new SplitBigUint32ArrayImpl(length, maxLengthForTesting);
    }
}
class BasicBigUint32ArrayImpl extends Uint32Array {
    getValue(index) {
        return this[index];
    }
    setValue(index, value) {
        this[index] = value;
    }
    asUint32ArrayOrFail() {
        return this;
    }
    asArrayOrFail() {
        throw new Error('Not an array');
    }
}
class SplitBigUint32ArrayImpl {
    #data;
    #partLength;
    length;
    constructor(length, maxLengthForTesting) {
        this.#data = [];
        this.length = length;
        let partCount = 1;
        while (true) {
            partCount *= 2;
            this.#partLength = Math.ceil(length / partCount);
            try {
                if (maxLengthForTesting !== undefined && this.#partLength > maxLengthForTesting) {
                    // Simulate allocation failure.
                    throw new RangeError();
                }
                for (let i = 0; i < partCount; ++i) {
                    this.#data[i] = new Uint32Array(this.#partLength);
                }
                return;
            }
            catch (e) {
                if (this.#partLength < 1e6) {
                    // The length per part is already small, so continuing to subdivide it
                    // will probably not help.
                    throw e;
                }
            }
        }
    }
    getValue(index) {
        if (index >= 0 && index < this.length) {
            const partLength = this.#partLength;
            return this.#data[Math.floor(index / partLength)][index % partLength];
        }
        // On out-of-bounds accesses, match the behavior of Uint32Array: return an
        // undefined value that's incorrectly typed as number.
        return this.#data[0][-1];
    }
    setValue(index, value) {
        if (index >= 0 && index < this.length) {
            const partLength = this.#partLength;
            this.#data[Math.floor(index / partLength)][index % partLength] = value;
        }
        // Attempting to set a value out of bounds does nothing, like Uint32Array.
    }
    asUint32ArrayOrFail() {
        throw new Error('Not a Uint32Array');
    }
    asArrayOrFail() {
        throw new Error('Not an array');
    }
}
class ExpandableBigUint32ArrayImpl extends Array {
    getValue(index) {
        return this[index];
    }
    setValue(index, value) {
        this[index] = value;
    }
    asUint32ArrayOrFail() {
        throw new Error('Not a Uint32Array');
    }
    asArrayOrFail() {
        return this;
    }
}

// Copyright 2020 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
new URLSearchParams();

const LOCALES = ['en-GB'];
        const DEFAULT_LOCALE =  'en-GB';

// Copyright 2020 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
const i18nInstance = new I18n(LOCALES, DEFAULT_LOCALE);
/**
 * Returns an anonymous function that wraps a call to retrieve a localized string.
 * This is introduced so that localized strings can be declared in environments where
 * the i18n system has not been configured and so, cannot be directly invoked. Instead,
 * strings are lazily localized when they are used. This is used for instance in the
 * meta files used to register module extensions.
 */
function getLazilyComputedLocalizedString(registeredStrings, id, values = {}) {
    return () => getLocalizedString(registeredStrings, id, values);
}
/**
 * Retrieve the localized string.
 */
function getLocalizedString(registeredStrings, id, values = {}) {
    return registeredStrings.getLocalizedStringSetFor(DevToolsLocale.instance().locale).getLocalizedString(id, values);
}
/**
 * Register a file's UIStrings with i18n, return function to generate the string ids.
 */
function registerUIStrings(path, stringStructure) {
    return i18nInstance.registerFileStrings(path, stringStructure);
}
function serializeUIString(string, values = {}) {
    const serializedMessage = { string, values };
    return JSON.stringify(serializedMessage);
}
/**
 * Same as `lockedString` but for places where `i18nLazyString` would be used otherwise.
 */
function lockedLazyString(str) {
    return () => str;
}

// Copyright 2021 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
const UIStrings$3 = {
    /**
     *@description μs is the short form of micro-seconds and the placeholder is a number
     *@example {2} PH1
     */
    fmms: '{PH1} μs',
    /**
     *@description ms is the short form of milli-seconds and the placeholder is a decimal number
     *@example {2.14} PH1
     */
    fms: '{PH1} ms',
    /**
     *@description s is short for seconds and the placeholder is a decimal number
     *@example {2.14} PH1
     */
    fs: '{PH1} s',
    /**
     *@description min is short for minutes and the placeholder is a decimal number
     *@example {2.2} PH1
     */
    fmin: '{PH1} min',
    /**
     *@description hrs is short for hours and the placeholder is a decimal number
     *@example {2.2} PH1
     */
    fhrs: '{PH1} hrs',
    /**
     *@description days formatting and the placeholder is a decimal number
     *@example {2.2} PH1
     */
    fdays: '{PH1} days',
};
const str_$3 = registerUIStrings('core/i18n/time-utilities.ts', UIStrings$3);
getLocalizedString.bind(undefined, str_$3);

/*
 * Copyright (C) 2011 Google Inc. All rights reserved.
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
/* eslint-disable rulesdir/use_private_class_members */
class HeapSnapshotEdge {
    snapshot;
    edges;
    edgeIndex;
    constructor(snapshot, edgeIndex) {
        this.snapshot = snapshot;
        this.edges = snapshot.containmentEdges;
        this.edgeIndex = edgeIndex || 0;
    }
    clone() {
        return new HeapSnapshotEdge(this.snapshot, this.edgeIndex);
    }
    hasStringName() {
        throw new Error('Not implemented');
    }
    name() {
        throw new Error('Not implemented');
    }
    node() {
        return this.snapshot.createNode(this.nodeIndex());
    }
    nodeIndex() {
        if (typeof this.snapshot.edgeToNodeOffset === 'undefined') {
            throw new Error('edgeToNodeOffset is undefined');
        }
        return this.edges.getValue(this.edgeIndex + this.snapshot.edgeToNodeOffset);
    }
    toString() {
        return 'HeapSnapshotEdge: ' + this.name();
    }
    type() {
        return this.snapshot.edgeTypes[this.rawType()];
    }
    itemIndex() {
        return this.edgeIndex;
    }
    serialize() {
        return new Edge(this.name(), this.node().serialize(), this.type(), this.edgeIndex);
    }
    rawType() {
        if (typeof this.snapshot.edgeTypeOffset === 'undefined') {
            throw new Error('edgeTypeOffset is undefined');
        }
        return this.edges.getValue(this.edgeIndex + this.snapshot.edgeTypeOffset);
    }
    isInternal() {
        throw new Error('Not implemented');
    }
    isInvisible() {
        throw new Error('Not implemented');
    }
    isWeak() {
        throw new Error('Not implemented');
    }
    getValueForSorting(_fieldName) {
        throw new Error('Not implemented');
    }
}
class HeapSnapshotNodeIndexProvider {
    #node;
    constructor(snapshot) {
        this.#node = snapshot.createNode();
    }
    itemForIndex(index) {
        this.#node.nodeIndex = index;
        return this.#node;
    }
}
class HeapSnapshotEdgeIndexProvider {
    #edge;
    constructor(snapshot) {
        this.#edge = snapshot.createEdge(0);
    }
    itemForIndex(index) {
        this.#edge.edgeIndex = index;
        return this.#edge;
    }
}
class HeapSnapshotRetainerEdgeIndexProvider {
    #retainerEdge;
    constructor(snapshot) {
        this.#retainerEdge = snapshot.createRetainingEdge(0);
    }
    itemForIndex(index) {
        this.#retainerEdge.setRetainerIndex(index);
        return this.#retainerEdge;
    }
}
class HeapSnapshotEdgeIterator {
    #sourceNode;
    edge;
    constructor(node) {
        this.#sourceNode = node;
        this.edge = node.snapshot.createEdge(node.edgeIndexesStart());
    }
    hasNext() {
        return this.edge.edgeIndex < this.#sourceNode.edgeIndexesEnd();
    }
    item() {
        return this.edge;
    }
    next() {
        if (typeof this.edge.snapshot.edgeFieldsCount === 'undefined') {
            throw new Error('edgeFieldsCount is undefined');
        }
        this.edge.edgeIndex += this.edge.snapshot.edgeFieldsCount;
    }
}
class HeapSnapshotRetainerEdge {
    snapshot;
    #retainerIndexInternal;
    #globalEdgeIndex;
    #retainingNodeIndex;
    #edgeInstance;
    #nodeInstance;
    constructor(snapshot, retainerIndex) {
        this.snapshot = snapshot;
        this.setRetainerIndex(retainerIndex);
    }
    clone() {
        return new HeapSnapshotRetainerEdge(this.snapshot, this.retainerIndex());
    }
    hasStringName() {
        return this.edge().hasStringName();
    }
    name() {
        return this.edge().name();
    }
    node() {
        return this.nodeInternal();
    }
    nodeIndex() {
        if (typeof this.#retainingNodeIndex === 'undefined') {
            throw new Error('retainingNodeIndex is undefined');
        }
        return this.#retainingNodeIndex;
    }
    retainerIndex() {
        return this.#retainerIndexInternal;
    }
    setRetainerIndex(retainerIndex) {
        if (retainerIndex === this.#retainerIndexInternal) {
            return;
        }
        if (!this.snapshot.retainingEdges || !this.snapshot.retainingNodes) {
            throw new Error('Snapshot does not contain retaining edges or retaining nodes');
        }
        this.#retainerIndexInternal = retainerIndex;
        this.#globalEdgeIndex = this.snapshot.retainingEdges[retainerIndex];
        this.#retainingNodeIndex = this.snapshot.retainingNodes[retainerIndex];
        this.#edgeInstance = null;
        this.#nodeInstance = null;
    }
    set edgeIndex(edgeIndex) {
        this.setRetainerIndex(edgeIndex);
    }
    nodeInternal() {
        if (!this.#nodeInstance) {
            this.#nodeInstance = this.snapshot.createNode(this.#retainingNodeIndex);
        }
        return this.#nodeInstance;
    }
    edge() {
        if (!this.#edgeInstance) {
            this.#edgeInstance = this.snapshot.createEdge(this.#globalEdgeIndex);
        }
        return this.#edgeInstance;
    }
    toString() {
        return this.edge().toString();
    }
    itemIndex() {
        return this.#retainerIndexInternal;
    }
    serialize() {
        const node = this.node();
        const serializedNode = node.serialize();
        serializedNode.distance = this.#distance();
        serializedNode.ignored = this.snapshot.isNodeIgnoredInRetainersView(node.nodeIndex);
        return new Edge(this.name(), serializedNode, this.type(), this.#globalEdgeIndex);
    }
    type() {
        return this.edge().type();
    }
    isInternal() {
        return this.edge().isInternal();
    }
    getValueForSorting(fieldName) {
        if (fieldName === '!edgeDistance') {
            return this.#distance();
        }
        throw new Error('Invalid field name');
    }
    #distance() {
        if (this.snapshot.isEdgeIgnoredInRetainersView(this.#globalEdgeIndex)) {
            return baseUnreachableDistance;
        }
        return this.node().distanceForRetainersView();
    }
}
class HeapSnapshotRetainerEdgeIterator {
    #retainersEnd;
    retainer;
    constructor(retainedNode) {
        const snapshot = retainedNode.snapshot;
        const retainedNodeOrdinal = retainedNode.ordinal();
        if (!snapshot.firstRetainerIndex) {
            throw new Error('Snapshot does not contain firstRetainerIndex');
        }
        const retainerIndex = snapshot.firstRetainerIndex[retainedNodeOrdinal];
        this.#retainersEnd = snapshot.firstRetainerIndex[retainedNodeOrdinal + 1];
        this.retainer = snapshot.createRetainingEdge(retainerIndex);
    }
    hasNext() {
        return this.retainer.retainerIndex() < this.#retainersEnd;
    }
    item() {
        return this.retainer;
    }
    next() {
        this.retainer.setRetainerIndex(this.retainer.retainerIndex() + 1);
    }
}
class HeapSnapshotNode {
    snapshot;
    nodeIndex;
    constructor(snapshot, nodeIndex) {
        this.snapshot = snapshot;
        this.nodeIndex = nodeIndex || 0;
    }
    distance() {
        return this.snapshot.nodeDistances[this.nodeIndex / this.snapshot.nodeFieldCount];
    }
    distanceForRetainersView() {
        return this.snapshot.getDistanceForRetainersView(this.nodeIndex);
    }
    className() {
        throw new Error('Not implemented');
    }
    classIndex() {
        throw new Error('Not implemented');
    }
    dominatorIndex() {
        const nodeFieldCount = this.snapshot.nodeFieldCount;
        return this.snapshot.dominatorsTree[this.nodeIndex / this.snapshot.nodeFieldCount] * nodeFieldCount;
    }
    edges() {
        return new HeapSnapshotEdgeIterator(this);
    }
    edgesCount() {
        return (this.edgeIndexesEnd() - this.edgeIndexesStart()) / this.snapshot.edgeFieldsCount;
    }
    id() {
        throw new Error('Not implemented');
    }
    rawName() {
        throw new Error('Not implemented');
    }
    isRoot() {
        return this.nodeIndex === this.snapshot.rootNodeIndex;
    }
    isUserRoot() {
        throw new Error('Not implemented');
    }
    isHidden() {
        throw new Error('Not implemented');
    }
    isArray() {
        throw new Error('Not implemented');
    }
    isSynthetic() {
        throw new Error('Not implemented');
    }
    isDocumentDOMTreesRoot() {
        throw new Error('Not implemented');
    }
    name() {
        return this.snapshot.strings[this.nameInternal()];
    }
    retainedSize() {
        return this.snapshot.retainedSizes[this.ordinal()];
    }
    retainers() {
        return new HeapSnapshotRetainerEdgeIterator(this);
    }
    retainersCount() {
        const snapshot = this.snapshot;
        const ordinal = this.ordinal();
        return snapshot.firstRetainerIndex[ordinal + 1] - snapshot.firstRetainerIndex[ordinal];
    }
    selfSize() {
        const snapshot = this.snapshot;
        return snapshot.nodes.getValue(this.nodeIndex + snapshot.nodeSelfSizeOffset);
    }
    type() {
        return this.snapshot.nodeTypes[this.rawType()];
    }
    traceNodeId() {
        const snapshot = this.snapshot;
        return snapshot.nodes.getValue(this.nodeIndex + snapshot.nodeTraceNodeIdOffset);
    }
    itemIndex() {
        return this.nodeIndex;
    }
    serialize() {
        return new Node(this.id(), this.name(), this.distance(), this.nodeIndex, this.retainedSize(), this.selfSize(), this.type());
    }
    nameInternal() {
        const snapshot = this.snapshot;
        return snapshot.nodes.getValue(this.nodeIndex + snapshot.nodeNameOffset);
    }
    edgeIndexesStart() {
        return this.snapshot.firstEdgeIndexes[this.ordinal()];
    }
    edgeIndexesEnd() {
        return this.snapshot.firstEdgeIndexes[this.ordinal() + 1];
    }
    ordinal() {
        return this.nodeIndex / this.snapshot.nodeFieldCount;
    }
    nextNodeIndex() {
        return this.nodeIndex + this.snapshot.nodeFieldCount;
    }
    rawType() {
        const snapshot = this.snapshot;
        return snapshot.nodes.getValue(this.nodeIndex + snapshot.nodeTypeOffset);
    }
    isFlatConsString() {
        if (this.rawType() !== this.snapshot.nodeConsStringType) {
            return false;
        }
        for (let iter = this.edges(); iter.hasNext(); iter.next()) {
            const edge = iter.edge;
            if (!edge.isInternal()) {
                continue;
            }
            const edgeName = edge.name();
            if ((edgeName === 'first' || edgeName === 'second') && edge.node().name() === '') {
                return true;
            }
        }
        return false;
    }
}
class HeapSnapshotNodeIterator {
    node;
    #nodesLength;
    constructor(node) {
        this.node = node;
        this.#nodesLength = node.snapshot.nodes.length;
    }
    hasNext() {
        return this.node.nodeIndex < this.#nodesLength;
    }
    item() {
        return this.node;
    }
    next() {
        this.node.nodeIndex = this.node.nextNodeIndex();
    }
}
class HeapSnapshotIndexRangeIterator {
    #itemProvider;
    #indexes;
    #position;
    constructor(itemProvider, indexes) {
        this.#itemProvider = itemProvider;
        this.#indexes = indexes;
        this.#position = 0;
    }
    hasNext() {
        return this.#position < this.#indexes.length;
    }
    item() {
        const index = this.#indexes[this.#position];
        return this.#itemProvider.itemForIndex(index);
    }
    next() {
        ++this.#position;
    }
}
class HeapSnapshotFilteredIterator {
    #iterator;
    #filter;
    constructor(iterator, filter) {
        this.#iterator = iterator;
        this.#filter = filter;
        this.skipFilteredItems();
    }
    hasNext() {
        return this.#iterator.hasNext();
    }
    item() {
        return this.#iterator.item();
    }
    next() {
        this.#iterator.next();
        this.skipFilteredItems();
    }
    skipFilteredItems() {
        while (this.#iterator.hasNext() && this.#filter && !this.#filter(this.#iterator.item())) {
            this.#iterator.next();
        }
    }
}
class HeapSnapshotProgress {
    #dispatcher;
    constructor(dispatcher) {
        this.#dispatcher = dispatcher;
    }
    updateStatus(status) {
        this.sendUpdateEvent(serializeUIString(status));
    }
    updateProgress(title, value, total) {
        const percentValue = ((total ? (value / total) : 0) * 100).toFixed(0);
        this.sendUpdateEvent(serializeUIString(title, { PH1: percentValue }));
    }
    reportProblem(error) {
        // May be undefined in tests.
        if (this.#dispatcher) {
            this.#dispatcher.sendEvent(HeapSnapshotProgressEvent.BrokenSnapshot, error);
        }
    }
    sendUpdateEvent(serializedText) {
        // May be undefined in tests.
        if (this.#dispatcher) {
            this.#dispatcher.sendEvent(HeapSnapshotProgressEvent.Update, serializedText);
        }
    }
}
class HeapSnapshotProblemReport {
    #errors;
    constructor(title) {
        this.#errors = [title];
    }
    addError(error) {
        if (this.#errors.length > 100) {
            return;
        }
        this.#errors.push(error);
    }
    toString() {
        return this.#errors.join('\n  ');
    }
}
class HeapSnapshot {
    nodes;
    containmentEdges;
    #metaNode;
    #rawSamples;
    #samples;
    strings;
    #locations;
    #progress;
    #noDistance;
    rootNodeIndexInternal;
    #snapshotDiffs;
    #aggregatesForDiffInternal;
    #aggregates;
    #aggregatesSortedFlags;
    #profile;
    nodeTypeOffset;
    nodeNameOffset;
    nodeIdOffset;
    nodeSelfSizeOffset;
    #nodeEdgeCountOffset;
    nodeTraceNodeIdOffset;
    nodeFieldCount;
    nodeTypes;
    nodeArrayType;
    nodeHiddenType;
    nodeObjectType;
    nodeNativeType;
    nodeStringType;
    nodeConsStringType;
    nodeSlicedStringType;
    nodeCodeType;
    nodeSyntheticType;
    edgeFieldsCount;
    edgeTypeOffset;
    edgeNameOffset;
    edgeToNodeOffset;
    edgeTypes;
    edgeElementType;
    edgeHiddenType;
    edgeInternalType;
    edgeShortcutType;
    edgeWeakType;
    edgeInvisibleType;
    #locationIndexOffset;
    #locationScriptIdOffset;
    #locationLineOffset;
    #locationColumnOffset;
    #locationFieldCount;
    nodeCount;
    #edgeCount;
    retainedSizes;
    firstEdgeIndexes;
    retainingNodes;
    retainingEdges;
    firstRetainerIndex;
    nodeDistances;
    firstDominatedNodeIndex;
    dominatedNodes;
    dominatorsTree;
    #allocationProfile;
    #nodeDetachednessOffset;
    #locationMap;
    lazyStringCache;
    #ignoredNodesInRetainersView;
    #ignoredEdgesInRetainersView;
    #nodeDistancesForRetainersView;
    constructor(profile, progress) {
        this.nodes = profile.nodes;
        this.containmentEdges = profile.edges;
        this.#metaNode = profile.snapshot.meta;
        this.#rawSamples = profile.samples;
        this.#samples = null;
        this.strings = profile.strings;
        this.#locations = profile.locations;
        this.#progress = progress;
        this.#noDistance = -5;
        this.rootNodeIndexInternal = 0;
        if (profile.snapshot.root_index) {
            this.rootNodeIndexInternal = profile.snapshot.root_index;
        }
        this.#snapshotDiffs = {};
        this.#aggregates = {};
        this.#aggregatesSortedFlags = {};
        this.#profile = profile;
        this.#ignoredNodesInRetainersView = new Set();
        this.#ignoredEdgesInRetainersView = new Set();
    }
    initialize() {
        const meta = this.#metaNode;
        this.nodeTypeOffset = meta.node_fields.indexOf('type');
        this.nodeNameOffset = meta.node_fields.indexOf('name');
        this.nodeIdOffset = meta.node_fields.indexOf('id');
        this.nodeSelfSizeOffset = meta.node_fields.indexOf('self_size');
        this.#nodeEdgeCountOffset = meta.node_fields.indexOf('edge_count');
        this.nodeTraceNodeIdOffset = meta.node_fields.indexOf('trace_node_id');
        this.#nodeDetachednessOffset = meta.node_fields.indexOf('detachedness');
        this.nodeFieldCount = meta.node_fields.length;
        this.nodeTypes = meta.node_types[this.nodeTypeOffset];
        this.nodeArrayType = this.nodeTypes.indexOf('array');
        this.nodeHiddenType = this.nodeTypes.indexOf('hidden');
        this.nodeObjectType = this.nodeTypes.indexOf('object');
        this.nodeNativeType = this.nodeTypes.indexOf('native');
        this.nodeStringType = this.nodeTypes.indexOf('string');
        this.nodeConsStringType = this.nodeTypes.indexOf('concatenated string');
        this.nodeSlicedStringType = this.nodeTypes.indexOf('sliced string');
        this.nodeCodeType = this.nodeTypes.indexOf('code');
        this.nodeSyntheticType = this.nodeTypes.indexOf('synthetic');
        this.edgeFieldsCount = meta.edge_fields.length;
        this.edgeTypeOffset = meta.edge_fields.indexOf('type');
        this.edgeNameOffset = meta.edge_fields.indexOf('name_or_index');
        this.edgeToNodeOffset = meta.edge_fields.indexOf('to_node');
        this.edgeTypes = meta.edge_types[this.edgeTypeOffset];
        this.edgeTypes.push('invisible');
        this.edgeElementType = this.edgeTypes.indexOf('element');
        this.edgeHiddenType = this.edgeTypes.indexOf('hidden');
        this.edgeInternalType = this.edgeTypes.indexOf('internal');
        this.edgeShortcutType = this.edgeTypes.indexOf('shortcut');
        this.edgeWeakType = this.edgeTypes.indexOf('weak');
        this.edgeInvisibleType = this.edgeTypes.indexOf('invisible');
        const locationFields = meta.location_fields || [];
        this.#locationIndexOffset = locationFields.indexOf('object_index');
        this.#locationScriptIdOffset = locationFields.indexOf('script_id');
        this.#locationLineOffset = locationFields.indexOf('line');
        this.#locationColumnOffset = locationFields.indexOf('column');
        this.#locationFieldCount = locationFields.length;
        this.nodeCount = this.nodes.length / this.nodeFieldCount;
        this.#edgeCount = this.containmentEdges.length / this.edgeFieldsCount;
        this.retainedSizes = new Float64Array(this.nodeCount);
        this.firstEdgeIndexes = new Uint32Array(this.nodeCount + 1);
        this.retainingNodes = new Uint32Array(this.#edgeCount);
        this.retainingEdges = new Uint32Array(this.#edgeCount);
        this.firstRetainerIndex = new Uint32Array(this.nodeCount + 1);
        this.nodeDistances = new Int32Array(this.nodeCount);
        this.firstDominatedNodeIndex = new Uint32Array(this.nodeCount + 1);
        this.dominatedNodes = new Uint32Array(this.nodeCount - 1);
        this.#progress.updateStatus('Building edge indexes…');
        this.buildEdgeIndexes();
        this.#progress.updateStatus('Building retainers…');
        this.buildRetainers();
        this.#progress.updateStatus('Propagating DOM state…');
        this.propagateDOMState();
        this.#progress.updateStatus('Calculating node flags…');
        this.calculateFlags();
        this.#progress.updateStatus('Calculating distances…');
        this.calculateDistances(/* isForRetainersView=*/ false);
        this.#progress.updateStatus('Building postorder index…');
        const result = this.buildPostOrderIndex();
        // Actually it is array that maps node ordinal number to dominator node ordinal number.
        this.#progress.updateStatus('Building dominator tree…');
        this.dominatorsTree = this.buildDominatorTree(result.postOrderIndex2NodeOrdinal, result.nodeOrdinal2PostOrderIndex);
        this.#progress.updateStatus('Calculating shallow sizes…');
        this.calculateShallowSizes();
        this.#progress.updateStatus('Calculating retained sizes…');
        this.calculateRetainedSizes(result.postOrderIndex2NodeOrdinal);
        this.#progress.updateStatus('Building dominated nodes…');
        this.buildDominatedNodes();
        this.#progress.updateStatus('Calculating statistics…');
        this.calculateStatistics();
        this.#progress.updateStatus('Calculating samples…');
        this.buildSamples();
        this.#progress.updateStatus('Building locations…');
        this.buildLocationMap();
        this.#progress.updateStatus('Finished processing.');
        if (this.#profile.snapshot.trace_function_count) {
            this.#progress.updateStatus('Building allocation statistics…');
            const nodes = this.nodes;
            const nodesLength = nodes.length;
            const nodeFieldCount = this.nodeFieldCount;
            const node = this.rootNode();
            const liveObjects = {};
            for (let nodeIndex = 0; nodeIndex < nodesLength; nodeIndex += nodeFieldCount) {
                node.nodeIndex = nodeIndex;
                const traceNodeId = node.traceNodeId();
                let stats = liveObjects[traceNodeId];
                if (!stats) {
                    liveObjects[traceNodeId] = stats = { count: 0, size: 0, ids: [] };
                }
                stats.count++;
                stats.size += node.selfSize();
                stats.ids.push(node.id());
            }
            this.#allocationProfile = new AllocationProfile(this.#profile, liveObjects);
            this.#progress.updateStatus('done');
        }
    }
    buildEdgeIndexes() {
        const nodes = this.nodes;
        const nodeCount = this.nodeCount;
        const firstEdgeIndexes = this.firstEdgeIndexes;
        const nodeFieldCount = this.nodeFieldCount;
        const edgeFieldsCount = this.edgeFieldsCount;
        const nodeEdgeCountOffset = this.#nodeEdgeCountOffset;
        firstEdgeIndexes[nodeCount] = this.containmentEdges.length;
        for (let nodeOrdinal = 0, edgeIndex = 0; nodeOrdinal < nodeCount; ++nodeOrdinal) {
            firstEdgeIndexes[nodeOrdinal] = edgeIndex;
            edgeIndex += nodes.getValue(nodeOrdinal * nodeFieldCount + nodeEdgeCountOffset) * edgeFieldsCount;
        }
    }
    buildRetainers() {
        const retainingNodes = this.retainingNodes;
        const retainingEdges = this.retainingEdges;
        // Index of the first retainer in the retainingNodes and retainingEdges
        // arrays. Addressed by retained node index.
        const firstRetainerIndex = this.firstRetainerIndex;
        const containmentEdges = this.containmentEdges;
        const edgeFieldsCount = this.edgeFieldsCount;
        const nodeFieldCount = this.nodeFieldCount;
        const edgeToNodeOffset = this.edgeToNodeOffset;
        const firstEdgeIndexes = this.firstEdgeIndexes;
        const nodeCount = this.nodeCount;
        for (let toNodeFieldIndex = edgeToNodeOffset, l = containmentEdges.length; toNodeFieldIndex < l; toNodeFieldIndex += edgeFieldsCount) {
            const toNodeIndex = containmentEdges.getValue(toNodeFieldIndex);
            if (toNodeIndex % nodeFieldCount) {
                throw new Error('Invalid toNodeIndex ' + toNodeIndex);
            }
            ++firstRetainerIndex[toNodeIndex / nodeFieldCount];
        }
        for (let i = 0, firstUnusedRetainerSlot = 0; i < nodeCount; i++) {
            const retainersCount = firstRetainerIndex[i];
            firstRetainerIndex[i] = firstUnusedRetainerSlot;
            retainingNodes[firstUnusedRetainerSlot] = retainersCount;
            firstUnusedRetainerSlot += retainersCount;
        }
        firstRetainerIndex[nodeCount] = retainingNodes.length;
        let nextNodeFirstEdgeIndex = firstEdgeIndexes[0];
        for (let srcNodeOrdinal = 0; srcNodeOrdinal < nodeCount; ++srcNodeOrdinal) {
            const firstEdgeIndex = nextNodeFirstEdgeIndex;
            nextNodeFirstEdgeIndex = firstEdgeIndexes[srcNodeOrdinal + 1];
            const srcNodeIndex = srcNodeOrdinal * nodeFieldCount;
            for (let edgeIndex = firstEdgeIndex; edgeIndex < nextNodeFirstEdgeIndex; edgeIndex += edgeFieldsCount) {
                const toNodeIndex = containmentEdges.getValue(edgeIndex + edgeToNodeOffset);
                if (toNodeIndex % nodeFieldCount) {
                    throw new Error('Invalid toNodeIndex ' + toNodeIndex);
                }
                const firstRetainerSlotIndex = firstRetainerIndex[toNodeIndex / nodeFieldCount];
                const nextUnusedRetainerSlotIndex = firstRetainerSlotIndex + (--retainingNodes[firstRetainerSlotIndex]);
                retainingNodes[nextUnusedRetainerSlotIndex] = srcNodeIndex;
                retainingEdges[nextUnusedRetainerSlotIndex] = edgeIndex;
            }
        }
    }
    allNodes() {
        return new HeapSnapshotNodeIterator(this.rootNode());
    }
    rootNode() {
        return this.createNode(this.rootNodeIndexInternal);
    }
    get rootNodeIndex() {
        return this.rootNodeIndexInternal;
    }
    get totalSize() {
        return this.rootNode().retainedSize();
    }
    getDominatedIndex(nodeIndex) {
        if (nodeIndex % this.nodeFieldCount) {
            throw new Error('Invalid nodeIndex: ' + nodeIndex);
        }
        return this.firstDominatedNodeIndex[nodeIndex / this.nodeFieldCount];
    }
    createFilter(nodeFilter) {
        const { minNodeId, maxNodeId, allocationNodeId, filterName } = nodeFilter;
        let filter;
        if (typeof allocationNodeId === 'number') {
            filter = this.createAllocationStackFilter(allocationNodeId);
            if (!filter) {
                throw new Error('Unable to create filter');
            }
            // @ts-ignore key can be added as a static property
            filter.key = 'AllocationNodeId: ' + allocationNodeId;
        }
        else if (typeof minNodeId === 'number' && typeof maxNodeId === 'number') {
            filter = this.createNodeIdFilter(minNodeId, maxNodeId);
            // @ts-ignore key can be added as a static property
            filter.key = 'NodeIdRange: ' + minNodeId + '..' + maxNodeId;
        }
        else if (filterName !== undefined) {
            filter = this.createNamedFilter(filterName);
            // @ts-ignore key can be added as a static property
            filter.key = 'NamedFilter: ' + filterName;
        }
        return filter;
    }
    search(searchConfig, nodeFilter) {
        const query = searchConfig.query;
        function filterString(matchedStringIndexes, string, index) {
            if (string.indexOf(query) !== -1) {
                matchedStringIndexes.add(index);
            }
            return matchedStringIndexes;
        }
        const regexp = searchConfig.isRegex ? new RegExp(query) : createPlainTextSearchRegex(query, 'i');
        function filterRegexp(matchedStringIndexes, string, index) {
            if (regexp.test(string)) {
                matchedStringIndexes.add(index);
            }
            return matchedStringIndexes;
        }
        const stringFilter = (searchConfig.isRegex || !searchConfig.caseSensitive) ? filterRegexp : filterString;
        const stringIndexes = this.strings.reduce(stringFilter, new Set());
        if (!stringIndexes.size) {
            return [];
        }
        const filter = this.createFilter(nodeFilter);
        const nodeIds = [];
        const nodesLength = this.nodes.length;
        const nodes = this.nodes;
        const nodeNameOffset = this.nodeNameOffset;
        const nodeIdOffset = this.nodeIdOffset;
        const nodeFieldCount = this.nodeFieldCount;
        const node = this.rootNode();
        for (let nodeIndex = 0; nodeIndex < nodesLength; nodeIndex += nodeFieldCount) {
            node.nodeIndex = nodeIndex;
            if (filter && !filter(node)) {
                continue;
            }
            if (stringIndexes.has(nodes.getValue(nodeIndex + nodeNameOffset))) {
                nodeIds.push(nodes.getValue(nodeIndex + nodeIdOffset));
            }
        }
        return nodeIds;
    }
    aggregatesWithFilter(nodeFilter) {
        const filter = this.createFilter(nodeFilter);
        // @ts-ignore key is added in createFilter
        const key = filter ? filter.key : 'allObjects';
        return this.getAggregatesByClassName(false, key, filter);
    }
    createNodeIdFilter(minNodeId, maxNodeId) {
        function nodeIdFilter(node) {
            const id = node.id();
            return id > minNodeId && id <= maxNodeId;
        }
        return nodeIdFilter;
    }
    createAllocationStackFilter(bottomUpAllocationNodeId) {
        if (!this.#allocationProfile) {
            throw new Error('No Allocation Profile provided');
        }
        const traceIds = this.#allocationProfile.traceIds(bottomUpAllocationNodeId);
        if (!traceIds.length) {
            return undefined;
        }
        const set = {};
        for (let i = 0; i < traceIds.length; i++) {
            set[traceIds[i]] = true;
        }
        function traceIdFilter(node) {
            return Boolean(set[node.traceNodeId()]);
        }
        return traceIdFilter;
    }
    createNamedFilter(filterName) {
        // Allocate an array with a single bit per node, which can be used by each
        // specific filter implemented below.
        const bitmap = new Uint8Array(Math.ceil(this.nodeCount / 8));
        const getBit = (node) => {
            const ordinal = node.nodeIndex / this.nodeFieldCount;
            const value = bitmap[ordinal >> 3] & (1 << (ordinal & 7));
            return value !== 0;
        };
        const setBit = (nodeOrdinal) => {
            bitmap[nodeOrdinal >> 3] |= (1 << (nodeOrdinal & 7));
        };
        // Traverses the graph in breadth-first order with the given filter, and
        // sets the bit in `bitmap` for every visited node.
        const traverse = (filter) => {
            const distances = new Int32Array(this.nodeCount);
            for (let i = 0; i < this.nodeCount; ++i) {
                distances[i] = this.#noDistance;
            }
            const nodesToVisit = new Uint32Array(this.nodeCount);
            distances[this.rootNode().ordinal()] = 0;
            nodesToVisit[0] = this.rootNode().nodeIndex;
            const nodesToVisitLength = 1;
            this.bfs(nodesToVisit, nodesToVisitLength, distances, filter);
            for (let i = 0; i < this.nodeCount; ++i) {
                if (distances[i] !== this.#noDistance) {
                    setBit(i);
                }
            }
        };
        const markUnreachableNodes = () => {
            for (let i = 0; i < this.nodeCount; ++i) {
                if (this.nodeDistances[i] === this.#noDistance) {
                    setBit(i);
                }
            }
        };
        switch (filterName) {
            case 'objectsRetainedByDetachedDomNodes':
                // Traverse the graph, avoiding detached nodes.
                traverse((node, edge) => {
                    return this.nodes.getValue(edge.nodeIndex() + this.#nodeDetachednessOffset) !== 2 /* DOMLinkState.Detached */;
                });
                markUnreachableNodes();
                return (node) => !getBit(node);
            case 'objectsRetainedByConsole':
                // Traverse the graph, avoiding edges that represent globals owned by
                // the DevTools console.
                traverse((node, edge) => {
                    return !(node.isSynthetic() && edge.hasStringName() && edge.name().endsWith(' / DevTools console'));
                });
                markUnreachableNodes();
                return (node) => !getBit(node);
            case 'duplicatedStrings': {
                const stringToNodeIndexMap = new Map();
                const node = this.createNode(0);
                for (let i = 0; i < this.nodeCount; ++i) {
                    node.nodeIndex = i * this.nodeFieldCount;
                    const rawType = node.rawType();
                    if (rawType === this.nodeStringType || rawType === this.nodeConsStringType) {
                        // Check whether the cons string is already "flattened", meaning
                        // that one of its two parts is the empty string. If so, we should
                        // skip it. We don't help anyone by reporting a flattened cons
                        // string as a duplicate with its own content, since V8 controls
                        // that behavior internally.
                        if (node.isFlatConsString()) {
                            continue;
                        }
                        const name = node.name();
                        const alreadyVisitedNodeIndex = stringToNodeIndexMap.get(name);
                        if (alreadyVisitedNodeIndex === undefined) {
                            stringToNodeIndexMap.set(name, node.nodeIndex);
                        }
                        else {
                            setBit(alreadyVisitedNodeIndex / this.nodeFieldCount);
                            setBit(node.nodeIndex / this.nodeFieldCount);
                        }
                    }
                }
                return getBit;
            }
        }
        throw new Error('Invalid filter name');
    }
    getAggregatesByClassName(sortedIndexes, key, filter) {
        const aggregates = this.buildAggregates(filter);
        let aggregatesByClassName;
        if (key && this.#aggregates[key]) {
            aggregatesByClassName = this.#aggregates[key];
        }
        else {
            this.calculateClassesRetainedSize(aggregates.aggregatesByClassIndex, filter);
            aggregatesByClassName = aggregates.aggregatesByClassName;
            if (key) {
                this.#aggregates[key] = aggregatesByClassName;
            }
        }
        if (sortedIndexes && (!key || !this.#aggregatesSortedFlags[key])) {
            this.sortAggregateIndexes(aggregatesByClassName);
            if (key) {
                this.#aggregatesSortedFlags[key] = sortedIndexes;
            }
        }
        return aggregatesByClassName;
    }
    allocationTracesTops() {
        return this.#allocationProfile.serializeTraceTops();
    }
    allocationNodeCallers(nodeId) {
        return this.#allocationProfile.serializeCallers(nodeId);
    }
    allocationStack(nodeIndex) {
        const node = this.createNode(nodeIndex);
        const allocationNodeId = node.traceNodeId();
        if (!allocationNodeId) {
            return null;
        }
        return this.#allocationProfile.serializeAllocationStack(allocationNodeId);
    }
    aggregatesForDiff() {
        if (this.#aggregatesForDiffInternal) {
            return this.#aggregatesForDiffInternal;
        }
        const aggregatesByClassName = this.getAggregatesByClassName(true, 'allObjects');
        this.#aggregatesForDiffInternal = {};
        const node = this.createNode();
        for (const className in aggregatesByClassName) {
            const aggregate = aggregatesByClassName[className];
            const indexes = aggregate.idxs;
            const ids = new Array(indexes.length);
            const selfSizes = new Array(indexes.length);
            for (let i = 0; i < indexes.length; i++) {
                node.nodeIndex = indexes[i];
                ids[i] = node.id();
                selfSizes[i] = node.selfSize();
            }
            this.#aggregatesForDiffInternal[className] = { indexes: indexes, ids: ids, selfSizes: selfSizes };
        }
        return this.#aggregatesForDiffInternal;
    }
    isUserRoot(_node) {
        return true;
    }
    calculateShallowSizes() {
    }
    calculateDistances(isForRetainersView, filter) {
        const nodeCount = this.nodeCount;
        if (isForRetainersView) {
            const originalFilter = filter;
            filter = (node, edge) => {
                return !this.#ignoredNodesInRetainersView.has(edge.nodeIndex()) &&
                    (!originalFilter || originalFilter(node, edge));
            };
            if (this.#nodeDistancesForRetainersView === undefined) {
                this.#nodeDistancesForRetainersView = new Int32Array(nodeCount);
            }
        }
        const distances = isForRetainersView ? this.#nodeDistancesForRetainersView : this.nodeDistances;
        const noDistance = this.#noDistance;
        for (let i = 0; i < nodeCount; ++i) {
            distances[i] = noDistance;
        }
        const nodesToVisit = new Uint32Array(this.nodeCount);
        let nodesToVisitLength = 0;
        // BFS for user root objects.
        for (let iter = this.rootNode().edges(); iter.hasNext(); iter.next()) {
            const node = iter.edge.node();
            if (this.isUserRoot(node)) {
                distances[node.ordinal()] = 1;
                nodesToVisit[nodesToVisitLength++] = node.nodeIndex;
            }
        }
        this.bfs(nodesToVisit, nodesToVisitLength, distances, filter);
        // BFS for objects not reached from user roots.
        distances[this.rootNode().ordinal()] =
            nodesToVisitLength > 0 ? baseSystemDistance : 0;
        nodesToVisit[0] = this.rootNode().nodeIndex;
        nodesToVisitLength = 1;
        this.bfs(nodesToVisit, nodesToVisitLength, distances, filter);
    }
    bfs(nodesToVisit, nodesToVisitLength, distances, filter) {
        // Preload fields into local variables for better performance.
        const edgeFieldsCount = this.edgeFieldsCount;
        const nodeFieldCount = this.nodeFieldCount;
        const containmentEdges = this.containmentEdges;
        const firstEdgeIndexes = this.firstEdgeIndexes;
        const edgeToNodeOffset = this.edgeToNodeOffset;
        const edgeTypeOffset = this.edgeTypeOffset;
        const nodeCount = this.nodeCount;
        const edgeWeakType = this.edgeWeakType;
        const noDistance = this.#noDistance;
        let index = 0;
        const edge = this.createEdge(0);
        const node = this.createNode(0);
        while (index < nodesToVisitLength) {
            const nodeIndex = nodesToVisit[index++]; // shift generates too much garbage.
            const nodeOrdinal = nodeIndex / nodeFieldCount;
            const distance = distances[nodeOrdinal] + 1;
            const firstEdgeIndex = firstEdgeIndexes[nodeOrdinal];
            const edgesEnd = firstEdgeIndexes[nodeOrdinal + 1];
            node.nodeIndex = nodeIndex;
            for (let edgeIndex = firstEdgeIndex; edgeIndex < edgesEnd; edgeIndex += edgeFieldsCount) {
                const edgeType = containmentEdges.getValue(edgeIndex + edgeTypeOffset);
                if (edgeType === edgeWeakType) {
                    continue;
                }
                const childNodeIndex = containmentEdges.getValue(edgeIndex + edgeToNodeOffset);
                const childNodeOrdinal = childNodeIndex / nodeFieldCount;
                if (distances[childNodeOrdinal] !== noDistance) {
                    continue;
                }
                edge.edgeIndex = edgeIndex;
                if (filter && !filter(node, edge)) {
                    continue;
                }
                distances[childNodeOrdinal] = distance;
                nodesToVisit[nodesToVisitLength++] = childNodeIndex;
            }
        }
        if (nodesToVisitLength > nodeCount) {
            throw new Error('BFS failed. Nodes to visit (' + nodesToVisitLength + ') is more than nodes count (' + nodeCount + ')');
        }
    }
    buildAggregates(filter) {
        const aggregates = {};
        const aggregatesByClassName = {};
        const classIndexes = [];
        const nodes = this.nodes;
        const nodesLength = nodes.length;
        const nodeFieldCount = this.nodeFieldCount;
        const selfSizeOffset = this.nodeSelfSizeOffset;
        const node = this.rootNode();
        const nodeDistances = this.nodeDistances;
        for (let nodeIndex = 0; nodeIndex < nodesLength; nodeIndex += nodeFieldCount) {
            node.nodeIndex = nodeIndex;
            if (filter && !filter(node)) {
                continue;
            }
            const selfSize = nodes.getValue(nodeIndex + selfSizeOffset);
            if (!selfSize) {
                continue;
            }
            const classIndex = node.classIndex();
            const nodeOrdinal = nodeIndex / nodeFieldCount;
            const distance = nodeDistances[nodeOrdinal];
            if (!(classIndex in aggregates)) {
                const nodeType = node.type();
                const nameMatters = nodeType === 'object' || nodeType === 'native';
                const value = {
                    count: 1,
                    distance: distance,
                    self: selfSize,
                    maxRet: 0,
                    type: nodeType,
                    name: nameMatters ? node.name() : null,
                    idxs: [nodeIndex],
                };
                aggregates[classIndex] = value;
                classIndexes.push(classIndex);
                aggregatesByClassName[node.className()] = value;
            }
            else {
                const clss = aggregates[classIndex];
                if (!clss) {
                    continue;
                }
                clss.distance = Math.min(clss.distance, distance);
                ++clss.count;
                clss.self += selfSize;
                clss.idxs.push(nodeIndex);
            }
        }
        // Shave off provisionally allocated space.
        for (let i = 0, l = classIndexes.length; i < l; ++i) {
            const classIndex = classIndexes[i];
            const classIndexValues = aggregates[classIndex];
            if (!classIndexValues) {
                continue;
            }
            classIndexValues.idxs = classIndexValues.idxs.slice();
        }
        return { aggregatesByClassName: aggregatesByClassName, aggregatesByClassIndex: aggregates };
    }
    calculateClassesRetainedSize(aggregates, filter) {
        const rootNodeIndex = this.rootNodeIndexInternal;
        const node = this.createNode(rootNodeIndex);
        const list = [rootNodeIndex];
        const sizes = [-1];
        const classes = [];
        const seenClassNameIndexes = new Map();
        const nodeFieldCount = this.nodeFieldCount;
        const dominatedNodes = this.dominatedNodes;
        const firstDominatedNodeIndex = this.firstDominatedNodeIndex;
        while (list.length) {
            const nodeIndex = list.pop();
            node.nodeIndex = nodeIndex;
            let classIndex = node.classIndex();
            const seen = Boolean(seenClassNameIndexes.get(classIndex));
            const nodeOrdinal = nodeIndex / nodeFieldCount;
            const dominatedIndexFrom = firstDominatedNodeIndex[nodeOrdinal];
            const dominatedIndexTo = firstDominatedNodeIndex[nodeOrdinal + 1];
            if (!seen && (!filter || filter(node)) && node.selfSize()) {
                aggregates[classIndex].maxRet += node.retainedSize();
                if (dominatedIndexFrom !== dominatedIndexTo) {
                    seenClassNameIndexes.set(classIndex, true);
                    sizes.push(list.length);
                    classes.push(classIndex);
                }
            }
            for (let i = dominatedIndexFrom; i < dominatedIndexTo; i++) {
                list.push(dominatedNodes[i]);
            }
            const l = list.length;
            while (sizes[sizes.length - 1] === l) {
                sizes.pop();
                classIndex = classes.pop();
                seenClassNameIndexes.set(classIndex, false);
            }
        }
    }
    sortAggregateIndexes(aggregates) {
        const nodeA = this.createNode();
        const nodeB = this.createNode();
        for (const clss in aggregates) {
            aggregates[clss].idxs.sort((idxA, idxB) => {
                nodeA.nodeIndex = idxA;
                nodeB.nodeIndex = idxB;
                return nodeA.id() < nodeB.id() ? -1 : 1;
            });
        }
    }
    static tryParseWeakMapEdgeName(edgeName) {
        const ephemeronNameRegex = /^\d+(?<duplicatedPart> \/ part of key \(.*? @\d+\) -> value \(.*? @\d+\) pair in WeakMap \(table @(?<tableId>\d+)\))$/;
        const match = edgeName.match(ephemeronNameRegex);
        return match ? match.groups : undefined;
    }
    /**
     * The function checks is the edge should be considered during building
     * postorder iterator and dominator tree.
     */
    isEssentialEdge(nodeIndex, edgeIndex) {
        const edgeType = this.containmentEdges.getValue(edgeIndex + this.edgeTypeOffset);
        // Values in WeakMaps are retained by the key and table together. Removing
        // either the key or the table would be sufficient to remove the edge from
        // the other one, so we needn't use both of those edges when computing
        // dominators. We've found that the edge from the key generally produces
        // more useful results, so here we skip the edge from the table.
        if (edgeType === this.edgeInternalType) {
            const edgeName = this.strings[this.containmentEdges.getValue(edgeIndex + this.edgeNameOffset)];
            const match = HeapSnapshot.tryParseWeakMapEdgeName(edgeName);
            if (match) {
                const nodeId = this.nodes.getValue(nodeIndex + this.nodeIdOffset);
                return nodeId !== parseInt(match.tableId, 10);
            }
        }
        // Shortcuts at the root node have special meaning of marking user global objects.
        return edgeType !== this.edgeWeakType &&
            (edgeType !== this.edgeShortcutType || nodeIndex === this.rootNodeIndexInternal);
    }
    buildPostOrderIndex() {
        const nodeFieldCount = this.nodeFieldCount;
        const nodeCount = this.nodeCount;
        const rootNodeOrdinal = this.rootNodeIndexInternal / nodeFieldCount;
        const edgeFieldsCount = this.edgeFieldsCount;
        const edgeToNodeOffset = this.edgeToNodeOffset;
        const firstEdgeIndexes = this.firstEdgeIndexes;
        const containmentEdges = this.containmentEdges;
        const mapAndFlag = this.userObjectsMapAndFlag();
        const flags = mapAndFlag ? mapAndFlag.map : null;
        const flag = mapAndFlag ? mapAndFlag.flag : 0;
        const stackNodes = new Uint32Array(nodeCount);
        const stackCurrentEdge = new Uint32Array(nodeCount);
        const postOrderIndex2NodeOrdinal = new Uint32Array(nodeCount);
        const nodeOrdinal2PostOrderIndex = new Uint32Array(nodeCount);
        const visited = new Uint8Array(nodeCount);
        let postOrderIndex = 0;
        let stackTop = 0;
        stackNodes[0] = rootNodeOrdinal;
        stackCurrentEdge[0] = firstEdgeIndexes[rootNodeOrdinal];
        visited[rootNodeOrdinal] = 1;
        let iteration = 0;
        while (true) {
            ++iteration;
            while (stackTop >= 0) {
                const nodeOrdinal = stackNodes[stackTop];
                const edgeIndex = stackCurrentEdge[stackTop];
                const edgesEnd = firstEdgeIndexes[nodeOrdinal + 1];
                if (edgeIndex < edgesEnd) {
                    stackCurrentEdge[stackTop] += edgeFieldsCount;
                    if (!this.isEssentialEdge(nodeOrdinal * nodeFieldCount, edgeIndex)) {
                        continue;
                    }
                    const childNodeIndex = containmentEdges.getValue(edgeIndex + edgeToNodeOffset);
                    const childNodeOrdinal = childNodeIndex / nodeFieldCount;
                    if (visited[childNodeOrdinal]) {
                        continue;
                    }
                    const nodeFlag = !flags || (flags[nodeOrdinal] & flag);
                    const childNodeFlag = !flags || (flags[childNodeOrdinal] & flag);
                    // We are skipping the edges from non-page-owned nodes to page-owned nodes.
                    // Otherwise the dominators for the objects that also were retained by debugger would be affected.
                    if (nodeOrdinal !== rootNodeOrdinal && childNodeFlag && !nodeFlag) {
                        continue;
                    }
                    ++stackTop;
                    stackNodes[stackTop] = childNodeOrdinal;
                    stackCurrentEdge[stackTop] = firstEdgeIndexes[childNodeOrdinal];
                    visited[childNodeOrdinal] = 1;
                }
                else {
                    // Done with all the node children
                    nodeOrdinal2PostOrderIndex[nodeOrdinal] = postOrderIndex;
                    postOrderIndex2NodeOrdinal[postOrderIndex++] = nodeOrdinal;
                    --stackTop;
                }
            }
            if (postOrderIndex === nodeCount || iteration > 1) {
                break;
            }
            const errors = new HeapSnapshotProblemReport(`Heap snapshot: ${nodeCount - postOrderIndex} nodes are unreachable from the root. Following nodes have only weak retainers:`);
            const dumpNode = this.rootNode();
            // Remove root from the result (last node in the array) and put it at the bottom of the stack so that it is
            // visited after all orphan nodes and their subgraphs.
            --postOrderIndex;
            stackTop = 0;
            stackNodes[0] = rootNodeOrdinal;
            stackCurrentEdge[0] = firstEdgeIndexes[rootNodeOrdinal + 1]; // no need to reiterate its edges
            for (let i = 0; i < nodeCount; ++i) {
                if (visited[i] || !this.hasOnlyWeakRetainers(i)) {
                    continue;
                }
                // Add all nodes that have only weak retainers to traverse their subgraphs.
                stackNodes[++stackTop] = i;
                stackCurrentEdge[stackTop] = firstEdgeIndexes[i];
                visited[i] = 1;
                dumpNode.nodeIndex = i * nodeFieldCount;
                const retainers = [];
                for (let it = dumpNode.retainers(); it.hasNext(); it.next()) {
                    retainers.push(`${it.item().node().name()}@${it.item().node().id()}.${it.item().name()}`);
                }
                errors.addError(`${dumpNode.name()} @${dumpNode.id()}  weak retainers: ${retainers.join(', ')}`);
            }
        }
        // If we already processed all orphan nodes that have only weak retainers and still have some orphans...
        if (postOrderIndex !== nodeCount) {
            const errors = new HeapSnapshotProblemReport('Still found ' + (nodeCount - postOrderIndex) + ' unreachable nodes in heap snapshot:');
            const dumpNode = this.rootNode();
            // Remove root from the result (last node in the array) and put it at the bottom of the stack so that it is
            // visited after all orphan nodes and their subgraphs.
            --postOrderIndex;
            for (let i = 0; i < nodeCount; ++i) {
                if (visited[i]) {
                    continue;
                }
                dumpNode.nodeIndex = i * nodeFieldCount;
                errors.addError(dumpNode.name() + ' @' + dumpNode.id());
                // Fix it by giving the node a postorder index anyway.
                nodeOrdinal2PostOrderIndex[i] = postOrderIndex;
                postOrderIndex2NodeOrdinal[postOrderIndex++] = i;
            }
            nodeOrdinal2PostOrderIndex[rootNodeOrdinal] = postOrderIndex;
            postOrderIndex2NodeOrdinal[postOrderIndex++] = rootNodeOrdinal;
        }
        return {
            postOrderIndex2NodeOrdinal: postOrderIndex2NodeOrdinal,
            nodeOrdinal2PostOrderIndex: nodeOrdinal2PostOrderIndex,
        };
    }
    hasOnlyWeakRetainers(nodeOrdinal) {
        const edgeTypeOffset = this.edgeTypeOffset;
        const edgeWeakType = this.edgeWeakType;
        const edgeShortcutType = this.edgeShortcutType;
        const containmentEdges = this.containmentEdges;
        const retainingEdges = this.retainingEdges;
        const beginRetainerIndex = this.firstRetainerIndex[nodeOrdinal];
        const endRetainerIndex = this.firstRetainerIndex[nodeOrdinal + 1];
        for (let retainerIndex = beginRetainerIndex; retainerIndex < endRetainerIndex; ++retainerIndex) {
            const retainerEdgeIndex = retainingEdges[retainerIndex];
            const retainerEdgeType = containmentEdges.getValue(retainerEdgeIndex + edgeTypeOffset);
            if (retainerEdgeType !== edgeWeakType && retainerEdgeType !== edgeShortcutType) {
                return false;
            }
        }
        return true;
    }
    // The algorithm is based on the article:
    // K. Cooper, T. Harvey and K. Kennedy "A Simple, Fast Dominance Algorithm"
    // Softw. Pract. Exper. 4 (2001), pp. 1-10.
    buildDominatorTree(postOrderIndex2NodeOrdinal, nodeOrdinal2PostOrderIndex) {
        const nodeFieldCount = this.nodeFieldCount;
        const firstRetainerIndex = this.firstRetainerIndex;
        const retainingNodes = this.retainingNodes;
        const retainingEdges = this.retainingEdges;
        const edgeFieldsCount = this.edgeFieldsCount;
        const edgeToNodeOffset = this.edgeToNodeOffset;
        const firstEdgeIndexes = this.firstEdgeIndexes;
        const containmentEdges = this.containmentEdges;
        const rootNodeIndex = this.rootNodeIndexInternal;
        const mapAndFlag = this.userObjectsMapAndFlag();
        const flags = mapAndFlag ? mapAndFlag.map : null;
        const flag = mapAndFlag ? mapAndFlag.flag : 0;
        const nodesCount = postOrderIndex2NodeOrdinal.length;
        const rootPostOrderedIndex = nodesCount - 1;
        const noEntry = nodesCount;
        const dominators = new Uint32Array(nodesCount);
        for (let i = 0; i < rootPostOrderedIndex; ++i) {
            dominators[i] = noEntry;
        }
        dominators[rootPostOrderedIndex] = rootPostOrderedIndex;
        // The affected array is used to mark entries which dominators
        // have to be recalculated because of changes in their retainers.
        const affected = new Uint8Array(nodesCount);
        let nodeOrdinal;
        { // Mark the root direct children as affected.
            nodeOrdinal = this.rootNodeIndexInternal / nodeFieldCount;
            const endEdgeIndex = firstEdgeIndexes[nodeOrdinal + 1];
            for (let edgeIndex = firstEdgeIndexes[nodeOrdinal]; edgeIndex < endEdgeIndex; edgeIndex += edgeFieldsCount) {
                if (!this.isEssentialEdge(this.rootNodeIndexInternal, edgeIndex)) {
                    continue;
                }
                const childNodeOrdinal = containmentEdges.getValue(edgeIndex + edgeToNodeOffset) / nodeFieldCount;
                affected[nodeOrdinal2PostOrderIndex[childNodeOrdinal]] = 1;
            }
        }
        let changed = true;
        while (changed) {
            changed = false;
            for (let postOrderIndex = rootPostOrderedIndex - 1; postOrderIndex >= 0; --postOrderIndex) {
                if (affected[postOrderIndex] === 0) {
                    continue;
                }
                affected[postOrderIndex] = 0;
                // If dominator of the entry has already been set to root,
                // then it can't propagate any further.
                if (dominators[postOrderIndex] === rootPostOrderedIndex) {
                    continue;
                }
                nodeOrdinal = postOrderIndex2NodeOrdinal[postOrderIndex];
                const nodeFlag = !flags || (flags[nodeOrdinal] & flag);
                let newDominatorIndex = noEntry;
                const beginRetainerIndex = firstRetainerIndex[nodeOrdinal];
                const endRetainerIndex = firstRetainerIndex[nodeOrdinal + 1];
                let orphanNode = true;
                for (let retainerIndex = beginRetainerIndex; retainerIndex < endRetainerIndex; ++retainerIndex) {
                    const retainerEdgeIndex = retainingEdges[retainerIndex];
                    const retainerNodeIndex = retainingNodes[retainerIndex];
                    if (!this.isEssentialEdge(retainerNodeIndex, retainerEdgeIndex)) {
                        continue;
                    }
                    orphanNode = false;
                    const retainerNodeOrdinal = retainerNodeIndex / nodeFieldCount;
                    const retainerNodeFlag = !flags || (flags[retainerNodeOrdinal] & flag);
                    // We are skipping the edges from non-page-owned nodes to page-owned nodes.
                    // Otherwise the dominators for the objects that also were retained by debugger would be affected.
                    if (retainerNodeIndex !== rootNodeIndex && nodeFlag && !retainerNodeFlag) {
                        continue;
                    }
                    let retainerPostOrderIndex = nodeOrdinal2PostOrderIndex[retainerNodeOrdinal];
                    if (dominators[retainerPostOrderIndex] !== noEntry) {
                        if (newDominatorIndex === noEntry) {
                            newDominatorIndex = retainerPostOrderIndex;
                        }
                        else {
                            while (retainerPostOrderIndex !== newDominatorIndex) {
                                while (retainerPostOrderIndex < newDominatorIndex) {
                                    retainerPostOrderIndex = dominators[retainerPostOrderIndex];
                                }
                                while (newDominatorIndex < retainerPostOrderIndex) {
                                    newDominatorIndex = dominators[newDominatorIndex];
                                }
                            }
                        }
                        // If item has already reached the root, it doesn't make sense
                        // to check other retainers.
                        if (newDominatorIndex === rootPostOrderedIndex) {
                            break;
                        }
                    }
                }
                // Make root dominator of orphans.
                if (orphanNode) {
                    newDominatorIndex = rootPostOrderedIndex;
                }
                if (newDominatorIndex !== noEntry && dominators[postOrderIndex] !== newDominatorIndex) {
                    dominators[postOrderIndex] = newDominatorIndex;
                    changed = true;
                    nodeOrdinal = postOrderIndex2NodeOrdinal[postOrderIndex];
                    const beginEdgeToNodeFieldIndex = firstEdgeIndexes[nodeOrdinal] + edgeToNodeOffset;
                    const endEdgeToNodeFieldIndex = firstEdgeIndexes[nodeOrdinal + 1];
                    for (let toNodeFieldIndex = beginEdgeToNodeFieldIndex; toNodeFieldIndex < endEdgeToNodeFieldIndex; toNodeFieldIndex += edgeFieldsCount) {
                        const childNodeOrdinal = containmentEdges.getValue(toNodeFieldIndex) / nodeFieldCount;
                        affected[nodeOrdinal2PostOrderIndex[childNodeOrdinal]] = 1;
                    }
                }
            }
        }
        const dominatorsTree = new Uint32Array(nodesCount);
        for (let postOrderIndex = 0, l = dominators.length; postOrderIndex < l; ++postOrderIndex) {
            nodeOrdinal = postOrderIndex2NodeOrdinal[postOrderIndex];
            dominatorsTree[nodeOrdinal] = postOrderIndex2NodeOrdinal[dominators[postOrderIndex]];
        }
        return dominatorsTree;
    }
    calculateRetainedSizes(postOrderIndex2NodeOrdinal) {
        const nodeCount = this.nodeCount;
        const nodes = this.nodes;
        const nodeSelfSizeOffset = this.nodeSelfSizeOffset;
        const nodeFieldCount = this.nodeFieldCount;
        const dominatorsTree = this.dominatorsTree;
        const retainedSizes = this.retainedSizes;
        for (let nodeOrdinal = 0; nodeOrdinal < nodeCount; ++nodeOrdinal) {
            retainedSizes[nodeOrdinal] = nodes.getValue(nodeOrdinal * nodeFieldCount + nodeSelfSizeOffset);
        }
        // Propagate retained sizes for each node excluding root.
        for (let postOrderIndex = 0; postOrderIndex < nodeCount - 1; ++postOrderIndex) {
            const nodeOrdinal = postOrderIndex2NodeOrdinal[postOrderIndex];
            const dominatorOrdinal = dominatorsTree[nodeOrdinal];
            retainedSizes[dominatorOrdinal] += retainedSizes[nodeOrdinal];
        }
    }
    buildDominatedNodes() {
        // Builds up two arrays:
        //  - "dominatedNodes" is a continuous array, where each node owns an
        //    interval (can be empty) with corresponding dominated nodes.
        //  - "indexArray" is an array of indexes in the "dominatedNodes"
        //    with the same positions as in the _nodeIndex.
        const indexArray = this.firstDominatedNodeIndex;
        // All nodes except the root have dominators.
        const dominatedNodes = this.dominatedNodes;
        // Count the number of dominated nodes for each node. Skip the root (node at
        // index 0) as it is the only node that dominates itself.
        const nodeFieldCount = this.nodeFieldCount;
        const dominatorsTree = this.dominatorsTree;
        let fromNodeOrdinal = 0;
        let toNodeOrdinal = this.nodeCount;
        const rootNodeOrdinal = this.rootNodeIndexInternal / nodeFieldCount;
        if (rootNodeOrdinal === fromNodeOrdinal) {
            fromNodeOrdinal = 1;
        }
        else if (rootNodeOrdinal === toNodeOrdinal - 1) {
            toNodeOrdinal = toNodeOrdinal - 1;
        }
        else {
            throw new Error('Root node is expected to be either first or last');
        }
        for (let nodeOrdinal = fromNodeOrdinal; nodeOrdinal < toNodeOrdinal; ++nodeOrdinal) {
            ++indexArray[dominatorsTree[nodeOrdinal]];
        }
        // Put in the first slot of each dominatedNodes slice the count of entries
        // that will be filled.
        let firstDominatedNodeIndex = 0;
        for (let i = 0, l = this.nodeCount; i < l; ++i) {
            const dominatedCount = dominatedNodes[firstDominatedNodeIndex] = indexArray[i];
            indexArray[i] = firstDominatedNodeIndex;
            firstDominatedNodeIndex += dominatedCount;
        }
        indexArray[this.nodeCount] = dominatedNodes.length;
        // Fill up the dominatedNodes array with indexes of dominated nodes. Skip the root (node at
        // index 0) as it is the only node that dominates itself.
        for (let nodeOrdinal = fromNodeOrdinal; nodeOrdinal < toNodeOrdinal; ++nodeOrdinal) {
            const dominatorOrdinal = dominatorsTree[nodeOrdinal];
            let dominatedRefIndex = indexArray[dominatorOrdinal];
            dominatedRefIndex += (--dominatedNodes[dominatedRefIndex]);
            dominatedNodes[dominatedRefIndex] = nodeOrdinal * nodeFieldCount;
        }
    }
    /**
     * Iterates children of a node.
     */
    iterateFilteredChildren(nodeOrdinal, edgeFilterCallback, childCallback) {
        const beginEdgeIndex = this.firstEdgeIndexes[nodeOrdinal];
        const endEdgeIndex = this.firstEdgeIndexes[nodeOrdinal + 1];
        for (let edgeIndex = beginEdgeIndex; edgeIndex < endEdgeIndex; edgeIndex += this.edgeFieldsCount) {
            const childNodeIndex = this.containmentEdges.getValue(edgeIndex + this.edgeToNodeOffset);
            const childNodeOrdinal = childNodeIndex / this.nodeFieldCount;
            const type = this.containmentEdges.getValue(edgeIndex + this.edgeTypeOffset);
            if (!edgeFilterCallback(type)) {
                continue;
            }
            childCallback(childNodeOrdinal);
        }
    }
    /**
     * Adds a string to the snapshot.
     */
    addString(string) {
        this.strings.push(string);
        return this.strings.length - 1;
    }
    /**
     * The phase propagates whether a node is attached or detached through the
     * graph and adjusts the low-level representation of nodes.
     *
     * State propagation:
     * 1. Any object reachable from an attached object is itself attached.
     * 2. Any object reachable from a detached object that is not already
     *    attached is considered detached.
     *
     * Representation:
     * - Name of any detached node is changed from "<Name>"" to
     *   "Detached <Name>".
     */
    propagateDOMState() {
        if (this.#nodeDetachednessOffset === -1) {
            return;
        }
        const visited = new Uint8Array(this.nodeCount);
        const attached = [];
        const detached = [];
        const stringIndexCache = new Map();
        /**
         * Adds a 'Detached ' prefix to the name of a node.
         */
        const addDetachedPrefixToNodeName = function (snapshot, nodeIndex) {
            const oldStringIndex = snapshot.nodes.getValue(nodeIndex + snapshot.nodeNameOffset);
            let newStringIndex = stringIndexCache.get(oldStringIndex);
            if (newStringIndex === undefined) {
                newStringIndex = snapshot.addString('Detached ' + snapshot.strings[oldStringIndex]);
                stringIndexCache.set(oldStringIndex, newStringIndex);
            }
            snapshot.nodes.setValue(nodeIndex + snapshot.nodeNameOffset, newStringIndex);
        };
        /**
         * Processes a node represented by nodeOrdinal:
         * - Changes its name based on newState.
         * - Puts it onto working sets for attached or detached nodes.
         */
        const processNode = function (snapshot, nodeOrdinal, newState) {
            if (visited[nodeOrdinal]) {
                return;
            }
            const nodeIndex = nodeOrdinal * snapshot.nodeFieldCount;
            // Early bailout: Do not propagate the state (and name change) through JavaScript. Every
            // entry point into embedder code is a node that knows its own state. All embedder nodes
            // have their node type set to native.
            if (snapshot.nodes.getValue(nodeIndex + snapshot.nodeTypeOffset) !== snapshot.nodeNativeType) {
                visited[nodeOrdinal] = 1;
                return;
            }
            snapshot.nodes.setValue(nodeIndex + snapshot.#nodeDetachednessOffset, newState);
            if (newState === 1 /* DOMLinkState.Attached */) {
                attached.push(nodeOrdinal);
            }
            else if (newState === 2 /* DOMLinkState.Detached */) {
                // Detached state: Rewire node name.
                addDetachedPrefixToNodeName(snapshot, nodeIndex);
                detached.push(nodeOrdinal);
            }
            visited[nodeOrdinal] = 1;
        };
        const propagateState = function (snapshot, parentNodeOrdinal, newState) {
            snapshot.iterateFilteredChildren(parentNodeOrdinal, edgeType => ![snapshot.edgeHiddenType, snapshot.edgeInvisibleType, snapshot.edgeWeakType].includes(edgeType), nodeOrdinal => processNode(snapshot, nodeOrdinal, newState));
        };
        // 1. We re-use the deserialized field to store the propagated state. While
        //    the state for known nodes is already set, they still need to go
        //    through processing to have their name adjusted and them enqueued in
        //    the respective queues.
        for (let nodeOrdinal = 0; nodeOrdinal < this.nodeCount; ++nodeOrdinal) {
            const state = this.nodes.getValue(nodeOrdinal * this.nodeFieldCount + this.#nodeDetachednessOffset);
            // Bail out for objects that have no known state. For all other objects set that state.
            if (state === 0 /* DOMLinkState.Unknown */) {
                continue;
            }
            processNode(this, nodeOrdinal, state);
        }
        // 2. If the parent is attached, then the child is also attached.
        while (attached.length !== 0) {
            const nodeOrdinal = attached.pop();
            propagateState(this, nodeOrdinal, 1 /* DOMLinkState.Attached */);
        }
        // 3. If the parent is not attached, then the child inherits the parent's state.
        while (detached.length !== 0) {
            const nodeOrdinal = detached.pop();
            const nodeState = this.nodes.getValue(nodeOrdinal * this.nodeFieldCount + this.#nodeDetachednessOffset);
            // Ignore if the node has been found through propagating forward attached state.
            if (nodeState === 1 /* DOMLinkState.Attached */) {
                continue;
            }
            propagateState(this, nodeOrdinal, 2 /* DOMLinkState.Detached */);
        }
    }
    buildSamples() {
        const samples = this.#rawSamples;
        if (!samples || !samples.length) {
            return;
        }
        const sampleCount = samples.length / 2;
        const sizeForRange = new Array(sampleCount);
        const timestamps = new Array(sampleCount);
        const lastAssignedIds = new Array(sampleCount);
        const timestampOffset = this.#metaNode.sample_fields.indexOf('timestamp_us');
        const lastAssignedIdOffset = this.#metaNode.sample_fields.indexOf('last_assigned_id');
        for (let i = 0; i < sampleCount; i++) {
            sizeForRange[i] = 0;
            timestamps[i] = (samples[2 * i + timestampOffset]) / 1000;
            lastAssignedIds[i] = samples[2 * i + lastAssignedIdOffset];
        }
        const nodes = this.nodes;
        const nodesLength = nodes.length;
        const nodeFieldCount = this.nodeFieldCount;
        const node = this.rootNode();
        for (let nodeIndex = 0; nodeIndex < nodesLength; nodeIndex += nodeFieldCount) {
            node.nodeIndex = nodeIndex;
            const nodeId = node.id();
            // JS objects have odd ids, skip native objects.
            if (nodeId % 2 === 0) {
                continue;
            }
            const rangeIndex = lowerBound(lastAssignedIds, nodeId, DEFAULT_COMPARATOR);
            if (rangeIndex === sampleCount) {
                // TODO: make heap profiler not allocate while taking snapshot
                continue;
            }
            sizeForRange[rangeIndex] += node.selfSize();
        }
        this.#samples = new Samples(timestamps, lastAssignedIds, sizeForRange);
    }
    buildLocationMap() {
        const map = new Map();
        const locations = this.#locations;
        for (let i = 0; i < locations.length; i += this.#locationFieldCount) {
            const nodeIndex = locations[i + this.#locationIndexOffset];
            const scriptId = locations[i + this.#locationScriptIdOffset];
            const line = locations[i + this.#locationLineOffset];
            const col = locations[i + this.#locationColumnOffset];
            map.set(nodeIndex, new Location(scriptId, line, col));
        }
        this.#locationMap = map;
    }
    getLocation(nodeIndex) {
        return this.#locationMap.get(nodeIndex) || null;
    }
    getSamples() {
        return this.#samples;
    }
    calculateFlags() {
        throw new Error('Not implemented');
    }
    calculateStatistics() {
        throw new Error('Not implemented');
    }
    userObjectsMapAndFlag() {
        throw new Error('Not implemented');
    }
    calculateSnapshotDiff(baseSnapshotId, baseSnapshotAggregates) {
        let snapshotDiff = this.#snapshotDiffs[baseSnapshotId];
        if (snapshotDiff) {
            return snapshotDiff;
        }
        snapshotDiff = {};
        const aggregates = this.getAggregatesByClassName(true, 'allObjects');
        for (const className in baseSnapshotAggregates) {
            const baseAggregate = baseSnapshotAggregates[className];
            const diff = this.calculateDiffForClass(baseAggregate, aggregates[className]);
            if (diff) {
                snapshotDiff[className] = diff;
            }
        }
        const emptyBaseAggregate = new AggregateForDiff();
        for (const className in aggregates) {
            if (className in baseSnapshotAggregates) {
                continue;
            }
            const classDiff = this.calculateDiffForClass(emptyBaseAggregate, aggregates[className]);
            if (classDiff) {
                snapshotDiff[className] = classDiff;
            }
        }
        this.#snapshotDiffs[baseSnapshotId] = snapshotDiff;
        return snapshotDiff;
    }
    calculateDiffForClass(baseAggregate, aggregate) {
        const baseIds = baseAggregate.ids;
        const baseIndexes = baseAggregate.indexes;
        const baseSelfSizes = baseAggregate.selfSizes;
        const indexes = aggregate ? aggregate.idxs : [];
        let i = 0;
        let j = 0;
        const l = baseIds.length;
        const m = indexes.length;
        const diff = new Diff();
        const nodeB = this.createNode(indexes[j]);
        while (i < l && j < m) {
            const nodeAId = baseIds[i];
            if (nodeAId < nodeB.id()) {
                diff.deletedIndexes.push(baseIndexes[i]);
                diff.removedCount++;
                diff.removedSize += baseSelfSizes[i];
                ++i;
            }
            else if (nodeAId >
                nodeB.id()) { // Native nodes(e.g. dom groups) may have ids less than max JS object id in the base snapshot
                diff.addedIndexes.push(indexes[j]);
                diff.addedCount++;
                diff.addedSize += nodeB.selfSize();
                nodeB.nodeIndex = indexes[++j];
            }
            else { // nodeAId === nodeB.id()
                ++i;
                nodeB.nodeIndex = indexes[++j];
            }
        }
        while (i < l) {
            diff.deletedIndexes.push(baseIndexes[i]);
            diff.removedCount++;
            diff.removedSize += baseSelfSizes[i];
            ++i;
        }
        while (j < m) {
            diff.addedIndexes.push(indexes[j]);
            diff.addedCount++;
            diff.addedSize += nodeB.selfSize();
            nodeB.nodeIndex = indexes[++j];
        }
        diff.countDelta = diff.addedCount - diff.removedCount;
        diff.sizeDelta = diff.addedSize - diff.removedSize;
        if (!diff.addedCount && !diff.removedCount) {
            return null;
        }
        return diff;
    }
    nodeForSnapshotObjectId(snapshotObjectId) {
        for (let it = this.allNodes(); it.hasNext(); it.next()) {
            if (it.node.id() === snapshotObjectId) {
                return it.node;
            }
        }
        return null;
    }
    nodeClassName(snapshotObjectId) {
        const node = this.nodeForSnapshotObjectId(snapshotObjectId);
        if (node) {
            return node.className();
        }
        return null;
    }
    idsOfObjectsWithName(name) {
        const ids = [];
        for (let it = this.allNodes(); it.hasNext(); it.next()) {
            if (it.item().name() === name) {
                ids.push(it.item().id());
            }
        }
        return ids;
    }
    createEdgesProvider(nodeIndex) {
        const node = this.createNode(nodeIndex);
        const filter = this.containmentEdgesFilter();
        const indexProvider = new HeapSnapshotEdgeIndexProvider(this);
        return new HeapSnapshotEdgesProvider(this, filter, node.edges(), indexProvider);
    }
    createEdgesProviderForTest(nodeIndex, filter) {
        const node = this.createNode(nodeIndex);
        const indexProvider = new HeapSnapshotEdgeIndexProvider(this);
        return new HeapSnapshotEdgesProvider(this, filter, node.edges(), indexProvider);
    }
    retainingEdgesFilter() {
        return null;
    }
    containmentEdgesFilter() {
        return null;
    }
    createRetainingEdgesProvider(nodeIndex) {
        const node = this.createNode(nodeIndex);
        const filter = this.retainingEdgesFilter();
        const indexProvider = new HeapSnapshotRetainerEdgeIndexProvider(this);
        return new HeapSnapshotEdgesProvider(this, filter, node.retainers(), indexProvider);
    }
    createAddedNodesProvider(baseSnapshotId, className) {
        const snapshotDiff = this.#snapshotDiffs[baseSnapshotId];
        const diffForClass = snapshotDiff[className];
        return new HeapSnapshotNodesProvider(this, diffForClass.addedIndexes);
    }
    createDeletedNodesProvider(nodeIndexes) {
        return new HeapSnapshotNodesProvider(this, nodeIndexes);
    }
    createNodesProviderForClass(className, nodeFilter) {
        return new HeapSnapshotNodesProvider(this, this.aggregatesWithFilter(nodeFilter)[className].idxs);
    }
    maxJsNodeId() {
        const nodeFieldCount = this.nodeFieldCount;
        const nodes = this.nodes;
        const nodesLength = nodes.length;
        let id = 0;
        for (let nodeIndex = this.nodeIdOffset; nodeIndex < nodesLength; nodeIndex += nodeFieldCount) {
            const nextId = nodes.getValue(nodeIndex);
            // JS objects have odd ids, skip native objects.
            if (nextId % 2 === 0) {
                continue;
            }
            if (id < nextId) {
                id = nextId;
            }
        }
        return id;
    }
    updateStaticData() {
        return new StaticData(this.nodeCount, this.rootNodeIndexInternal, this.totalSize, this.maxJsNodeId());
    }
    ignoreNodeInRetainersView(nodeIndex) {
        this.#ignoredNodesInRetainersView.add(nodeIndex);
        this.calculateDistances(/* isForRetainersView=*/ true);
        this.#updateIgnoredEdgesInRetainersView();
    }
    unignoreNodeInRetainersView(nodeIndex) {
        this.#ignoredNodesInRetainersView.delete(nodeIndex);
        if (this.#ignoredNodesInRetainersView.size === 0) {
            this.#nodeDistancesForRetainersView = undefined;
        }
        else {
            this.calculateDistances(/* isForRetainersView=*/ true);
        }
        this.#updateIgnoredEdgesInRetainersView();
    }
    unignoreAllNodesInRetainersView() {
        this.#ignoredNodesInRetainersView.clear();
        this.#nodeDistancesForRetainersView = undefined;
        this.#updateIgnoredEdgesInRetainersView();
    }
    #updateIgnoredEdgesInRetainersView() {
        const distances = this.#nodeDistancesForRetainersView;
        this.#ignoredEdgesInRetainersView.clear();
        if (distances === undefined) {
            return;
        }
        // To retain a value in a WeakMap, both the WeakMap and the corresponding
        // key must stay alive. If one of those two retainers is unreachable due to
        // the user ignoring some nodes, then the other retainer edge should also be
        // shown as unreachable, since it would be insufficient on its own to retain
        // the value.
        const unreachableWeakMapEdges = new Multimap();
        const noDistance = this.#noDistance;
        const { nodeCount, nodeFieldCount } = this;
        const node = this.createNode(0);
        // Populate unreachableWeakMapEdges.
        for (let nodeOrdinal = 0; nodeOrdinal < nodeCount; ++nodeOrdinal) {
            if (distances[nodeOrdinal] !== noDistance) {
                continue;
            }
            node.nodeIndex = nodeOrdinal * nodeFieldCount;
            for (let iter = node.edges(); iter.hasNext(); iter.next()) {
                const edge = iter.edge;
                if (!edge.isInternal()) {
                    continue;
                }
                const edgeName = edge.name();
                const match = HeapSnapshot.tryParseWeakMapEdgeName(edgeName);
                if (match) {
                    unreachableWeakMapEdges.set(edge.nodeIndex(), match.duplicatedPart);
                }
            }
        }
        // Iterate the retaining edges for the target nodes found in the previous
        // step and mark any relevant WeakMap edges as ignored.
        for (const targetNodeIndex of unreachableWeakMapEdges.keys()) {
            node.nodeIndex = targetNodeIndex;
            for (let it = node.retainers(); it.hasNext(); it.next()) {
                const reverseEdge = it.item();
                if (!reverseEdge.isInternal()) {
                    continue;
                }
                const match = HeapSnapshot.tryParseWeakMapEdgeName(reverseEdge.name());
                if (match && unreachableWeakMapEdges.hasValue(targetNodeIndex, match.duplicatedPart)) {
                    const forwardEdgeIndex = this.retainingEdges[reverseEdge.itemIndex()];
                    this.#ignoredEdgesInRetainersView.add(forwardEdgeIndex);
                }
            }
        }
    }
    areNodesIgnoredInRetainersView() {
        return this.#ignoredNodesInRetainersView.size > 0;
    }
    getDistanceForRetainersView(nodeIndex) {
        const nodeOrdinal = nodeIndex / this.nodeFieldCount;
        const distances = this.#nodeDistancesForRetainersView ?? this.nodeDistances;
        const distance = distances[nodeOrdinal];
        if (distance === this.#noDistance) {
            // An unreachable node should be sorted to the end, not the beginning.
            // To give such nodes a reasonable sorting order, we add a very large
            // number to the original distance computed without ignoring any nodes.
            return Math.max(0, this.nodeDistances[nodeOrdinal]) + baseUnreachableDistance;
        }
        return distance;
    }
    isNodeIgnoredInRetainersView(nodeIndex) {
        return this.#ignoredNodesInRetainersView.has(nodeIndex);
    }
    isEdgeIgnoredInRetainersView(edgeIndex) {
        return this.#ignoredEdgesInRetainersView.has(edgeIndex);
    }
}
class HeapSnapshotItemProvider {
    iterator;
    #indexProvider;
    #isEmptyInternal;
    iterationOrder;
    currentComparator;
    #sortedPrefixLength;
    #sortedSuffixLength;
    constructor(iterator, indexProvider) {
        this.iterator = iterator;
        this.#indexProvider = indexProvider;
        this.#isEmptyInternal = !iterator.hasNext();
        this.iterationOrder = null;
        this.currentComparator = null;
        this.#sortedPrefixLength = 0;
        this.#sortedSuffixLength = 0;
    }
    createIterationOrder() {
        if (this.iterationOrder) {
            return;
        }
        this.iterationOrder = [];
        for (let iterator = this.iterator; iterator.hasNext(); iterator.next()) {
            this.iterationOrder.push(iterator.item().itemIndex());
        }
    }
    isEmpty() {
        return this.#isEmptyInternal;
    }
    serializeItemsRange(begin, end) {
        this.createIterationOrder();
        if (begin > end) {
            throw new Error('Start position > end position: ' + begin + ' > ' + end);
        }
        if (!this.iterationOrder) {
            throw new Error('Iteration order undefined');
        }
        if (end > this.iterationOrder.length) {
            end = this.iterationOrder.length;
        }
        if (this.#sortedPrefixLength < end && begin < this.iterationOrder.length - this.#sortedSuffixLength &&
            this.currentComparator) {
            const currentComparator = this.currentComparator;
            this.sort(currentComparator, this.#sortedPrefixLength, this.iterationOrder.length - 1 - this.#sortedSuffixLength, begin, end - 1);
            if (begin <= this.#sortedPrefixLength) {
                this.#sortedPrefixLength = end;
            }
            if (end >= this.iterationOrder.length - this.#sortedSuffixLength) {
                this.#sortedSuffixLength = this.iterationOrder.length - begin;
            }
        }
        let position = begin;
        const count = end - begin;
        const result = new Array(count);
        for (let i = 0; i < count; ++i) {
            const itemIndex = this.iterationOrder[position++];
            const item = this.#indexProvider.itemForIndex(itemIndex);
            result[i] = item.serialize();
        }
        return new ItemsRange(begin, end, this.iterationOrder.length, result);
    }
    sortAndRewind(comparator) {
        this.currentComparator = comparator;
        this.#sortedPrefixLength = 0;
        this.#sortedSuffixLength = 0;
    }
}
class HeapSnapshotEdgesProvider extends HeapSnapshotItemProvider {
    snapshot;
    constructor(snapshot, filter, edgesIter, indexProvider) {
        const iter = filter ? new HeapSnapshotFilteredIterator(edgesIter, filter) :
            edgesIter;
        super(iter, indexProvider);
        this.snapshot = snapshot;
    }
    sort(comparator, leftBound, rightBound, windowLeft, windowRight) {
        const fieldName1 = comparator.fieldName1;
        const fieldName2 = comparator.fieldName2;
        const ascending1 = comparator.ascending1;
        const ascending2 = comparator.ascending2;
        const edgeA = this.iterator.item().clone();
        const edgeB = edgeA.clone();
        const nodeA = this.snapshot.createNode();
        const nodeB = this.snapshot.createNode();
        function compareEdgeField(fieldName, ascending, indexA, indexB) {
            edgeA.edgeIndex = indexA;
            edgeB.edgeIndex = indexB;
            let result = 0;
            if (fieldName === '!edgeName') {
                if (edgeB.name() === '__proto__') {
                    return -1;
                }
                if (edgeA.name() === '__proto__') {
                    return 1;
                }
                result = edgeA.hasStringName() === edgeB.hasStringName() ?
                    (edgeA.name() < edgeB.name() ? -1 : (edgeA.name() > edgeB.name() ? 1 : 0)) :
                    (edgeA.hasStringName() ? -1 : 1);
            }
            else {
                result = edgeA.getValueForSorting(fieldName) - edgeB.getValueForSorting(fieldName);
            }
            return ascending ? result : -result;
        }
        function compareNodeField(fieldName, ascending, indexA, indexB) {
            edgeA.edgeIndex = indexA;
            nodeA.nodeIndex = edgeA.nodeIndex();
            // TODO(crbug.com/1172300) Ignored during the jsdoc to ts migration)
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const valueA = nodeA[fieldName]();
            edgeB.edgeIndex = indexB;
            nodeB.nodeIndex = edgeB.nodeIndex();
            // TODO(crbug.com/1172300) Ignored during the jsdoc to ts migration)
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const valueB = nodeB[fieldName]();
            const result = valueA < valueB ? -1 : (valueA > valueB ? 1 : 0);
            return ascending ? result : -result;
        }
        function compareEdgeAndEdge(indexA, indexB) {
            let result = compareEdgeField(fieldName1, ascending1, indexA, indexB);
            if (result === 0) {
                result = compareEdgeField(fieldName2, ascending2, indexA, indexB);
            }
            if (result === 0) {
                return indexA - indexB;
            }
            return result;
        }
        function compareEdgeAndNode(indexA, indexB) {
            let result = compareEdgeField(fieldName1, ascending1, indexA, indexB);
            if (result === 0) {
                result = compareNodeField(fieldName2, ascending2, indexA, indexB);
            }
            if (result === 0) {
                return indexA - indexB;
            }
            return result;
        }
        function compareNodeAndEdge(indexA, indexB) {
            let result = compareNodeField(fieldName1, ascending1, indexA, indexB);
            if (result === 0) {
                result = compareEdgeField(fieldName2, ascending2, indexA, indexB);
            }
            if (result === 0) {
                return indexA - indexB;
            }
            return result;
        }
        function compareNodeAndNode(indexA, indexB) {
            let result = compareNodeField(fieldName1, ascending1, indexA, indexB);
            if (result === 0) {
                result = compareNodeField(fieldName2, ascending2, indexA, indexB);
            }
            if (result === 0) {
                return indexA - indexB;
            }
            return result;
        }
        if (!this.iterationOrder) {
            throw new Error('Iteration order not defined');
        }
        function isEdgeFieldName(fieldName) {
            return fieldName.startsWith('!edge');
        }
        if (isEdgeFieldName(fieldName1)) {
            if (isEdgeFieldName(fieldName2)) {
                sortRange(this.iterationOrder, compareEdgeAndEdge, leftBound, rightBound, windowLeft, windowRight);
            }
            else {
                sortRange(this.iterationOrder, compareEdgeAndNode, leftBound, rightBound, windowLeft, windowRight);
            }
        }
        else if (isEdgeFieldName(fieldName2)) {
            sortRange(this.iterationOrder, compareNodeAndEdge, leftBound, rightBound, windowLeft, windowRight);
        }
        else {
            sortRange(this.iterationOrder, compareNodeAndNode, leftBound, rightBound, windowLeft, windowRight);
        }
    }
}
class HeapSnapshotNodesProvider extends HeapSnapshotItemProvider {
    snapshot;
    constructor(snapshot, nodeIndexes) {
        const indexProvider = new HeapSnapshotNodeIndexProvider(snapshot);
        const it = new HeapSnapshotIndexRangeIterator(indexProvider, nodeIndexes);
        super(it, indexProvider);
        this.snapshot = snapshot;
    }
    nodePosition(snapshotObjectId) {
        this.createIterationOrder();
        const node = this.snapshot.createNode();
        let i = 0;
        if (!this.iterationOrder) {
            throw new Error('Iteration order not defined');
        }
        for (; i < this.iterationOrder.length; i++) {
            node.nodeIndex = this.iterationOrder[i];
            if (node.id() === snapshotObjectId) {
                break;
            }
        }
        if (i === this.iterationOrder.length) {
            return -1;
        }
        const targetNodeIndex = this.iterationOrder[i];
        let smallerCount = 0;
        const currentComparator = this.currentComparator;
        const compare = this.buildCompareFunction(currentComparator);
        for (let i = 0; i < this.iterationOrder.length; i++) {
            if (compare(this.iterationOrder[i], targetNodeIndex) < 0) {
                ++smallerCount;
            }
        }
        return smallerCount;
    }
    buildCompareFunction(comparator) {
        const nodeA = this.snapshot.createNode();
        const nodeB = this.snapshot.createNode();
        // TODO(crbug.com/1172300) Ignored during the jsdoc to ts migration)
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const fieldAccessor1 = nodeA[comparator.fieldName1];
        // TODO(crbug.com/1172300) Ignored during the jsdoc to ts migration)
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const fieldAccessor2 = nodeA[comparator.fieldName2];
        const ascending1 = comparator.ascending1 ? 1 : -1;
        const ascending2 = comparator.ascending2 ? 1 : -1;
        function sortByNodeField(fieldAccessor, ascending) {
            const valueA = fieldAccessor.call(nodeA);
            const valueB = fieldAccessor.call(nodeB);
            return valueA < valueB ? -ascending : (valueA > valueB ? ascending : 0);
        }
        function sortByComparator(indexA, indexB) {
            nodeA.nodeIndex = indexA;
            nodeB.nodeIndex = indexB;
            let result = sortByNodeField(fieldAccessor1, ascending1);
            if (result === 0) {
                result = sortByNodeField(fieldAccessor2, ascending2);
            }
            return result || indexA - indexB;
        }
        return sortByComparator;
    }
    sort(comparator, leftBound, rightBound, windowLeft, windowRight) {
        if (!this.iterationOrder) {
            throw new Error('Iteration order not defined');
        }
        sortRange(this.iterationOrder, this.buildCompareFunction(comparator), leftBound, rightBound, windowLeft, windowRight);
    }
}
class JSHeapSnapshot extends HeapSnapshot {
    nodeFlags;
    lazyStringCache;
    flags;
    #statistics;
    #options;
    constructor(profile, progress, options) {
        super(profile, progress);
        this.nodeFlags = {
            // bit flags
            canBeQueried: 1,
            detachedDOMTreeNode: 2,
            pageObject: 4, // The idea is to track separately the objects owned by the page and the objects owned by debugger.
        };
        this.lazyStringCache = {};
        this.#options = options ?? { heapSnapshotTreatBackingStoreAsContainingObject: false };
        this.initialize();
    }
    createNode(nodeIndex) {
        return new JSHeapSnapshotNode(this, nodeIndex === undefined ? -1 : nodeIndex);
    }
    createEdge(edgeIndex) {
        return new JSHeapSnapshotEdge(this, edgeIndex);
    }
    createRetainingEdge(retainerIndex) {
        return new JSHeapSnapshotRetainerEdge(this, retainerIndex);
    }
    containmentEdgesFilter() {
        return (edge) => !edge.isInvisible();
    }
    retainingEdgesFilter() {
        const containmentEdgesFilter = this.containmentEdgesFilter();
        function filter(edge) {
            return containmentEdgesFilter(edge) && !edge.node().isRoot() && !edge.isWeak();
        }
        return filter;
    }
    calculateFlags() {
        this.flags = new Uint32Array(this.nodeCount);
        this.markDetachedDOMTreeNodes();
        this.markQueriableHeapObjects();
        this.markPageOwnedNodes();
    }
    // Updates the shallow sizes for "owned" objects of types kArray or kHidden to
    // zero, and add their sizes to the "owner" object instead.
    calculateShallowSizes() {
        if (!this.#options.heapSnapshotTreatBackingStoreAsContainingObject) {
            return;
        }
        const { nodeCount, nodes, nodeFieldCount, nodeSelfSizeOffset } = this;
        const kUnvisited = 0xffffffff;
        const kHasMultipleOwners = 0xfffffffe;
        if (nodeCount >= kHasMultipleOwners) {
            throw new Error('Too many nodes for calculateShallowSizes');
        }
        // For each node in order, `owners` will contain the index of the owning
        // node or one of the two values kUnvisited or kHasMultipleOwners. The
        // indexes in this array are NOT already multiplied by nodeFieldCount.
        const owners = new Uint32Array(nodeCount);
        // The worklist contains the indexes of nodes which should be visited during
        // the second loop below. The order of visiting doesn't matter. The indexes
        // in this array are NOT already multiplied by nodeFieldCount.
        const worklist = [];
        const node = this.createNode(0);
        for (let i = 0; i < nodeCount; ++i) {
            if (node.isHidden() || node.isArray()) {
                owners[i] = kUnvisited;
            }
            else {
                // The node owns itself.
                owners[i] = i;
                worklist.push(i);
            }
            node.nodeIndex = node.nextNodeIndex();
        }
        while (worklist.length !== 0) {
            const id = worklist.pop();
            const owner = owners[id];
            node.nodeIndex = id * nodeFieldCount;
            for (let iter = node.edges(); iter.hasNext(); iter.next()) {
                const edge = iter.edge;
                if (edge.isWeak()) {
                    continue;
                }
                const targetId = edge.nodeIndex() / nodeFieldCount;
                switch (owners[targetId]) {
                    case kUnvisited:
                        owners[targetId] = owner;
                        worklist.push(targetId);
                        break;
                    case targetId:
                    case owner:
                    case kHasMultipleOwners:
                        // There is no change necessary if the target is already marked as:
                        // * owned by itself,
                        // * owned by the owner of the current source node, or
                        // * owned by multiple nodes.
                        break;
                    default:
                        owners[targetId] = kHasMultipleOwners;
                        // It is possible that this node is already in the worklist
                        // somewhere, but visiting it an extra time is not harmful. The
                        // iteration is guaranteed to complete because each node can only be
                        // added twice to the worklist: once when changing from kUnvisited
                        // to a specific owner, and a second time when changing from that
                        // owner to kHasMultipleOwners.
                        worklist.push(targetId);
                        break;
                }
            }
        }
        for (let i = 0; i < nodeCount; ++i) {
            const ownerId = owners[i];
            switch (ownerId) {
                case kUnvisited:
                case kHasMultipleOwners:
                case i:
                    break;
                default: {
                    const ownedNodeIndex = i * nodeFieldCount;
                    const ownerNodeIndex = ownerId * nodeFieldCount;
                    node.nodeIndex = ownerNodeIndex;
                    if (node.isSynthetic()) {
                        // Adding shallow size to synthetic nodes is not useful.
                        break;
                    }
                    const sizeToTransfer = nodes.getValue(ownedNodeIndex + nodeSelfSizeOffset);
                    nodes.setValue(ownedNodeIndex + nodeSelfSizeOffset, 0);
                    nodes.setValue(ownerNodeIndex + nodeSelfSizeOffset, nodes.getValue(ownerNodeIndex + nodeSelfSizeOffset) + sizeToTransfer);
                    break;
                }
            }
        }
    }
    calculateDistances(isForRetainersView) {
        const pendingEphemeronEdges = new Set();
        function filter(node, edge) {
            if (node.isHidden() && edge.name() === 'sloppy_function_map' && node.rawName() === 'system / NativeContext') {
                return false;
            }
            if (node.isArray() && node.rawName() === '(map descriptors)') {
                // DescriptorArrays are fixed arrays used to hold instance descriptors.
                // The format of the these objects is:
                //   [0]: Number of descriptors
                //   [1]: Either Smi(0) if uninitialized, or a pointer to small fixed array:
                //          [0]: pointer to fixed array with enum cache
                //          [1]: either Smi(0) or pointer to fixed array with indices
                //   [i*3+2]: i-th key
                //   [i*3+3]: i-th type
                //   [i*3+4]: i-th descriptor
                // As long as maps may share descriptor arrays some of the descriptor
                // links may not be valid for all the maps. We just skip
                // all the descriptor links when calculating distances.
                // For more details see http://crbug.com/413608
                const index = parseInt(edge.name(), 10);
                return index < 2 || (index % 3) !== 1;
            }
            if (edge.isInternal()) {
                // Snapshots represent WeakMap values as being referenced by two edges:
                // one from the WeakMap, and a second from the corresponding key. To
                // avoid the case described in crbug.com/1290800, we should set the
                // distance of that value to the greater of (WeakMap+1, key+1). This
                // part of the filter skips the first edge in the matched pair of edges,
                // so that the distance gets set based on the second, which should be
                // greater or equal due to traversal order.
                const match = HeapSnapshot.tryParseWeakMapEdgeName(edge.name());
                if (match) {
                    if (!pendingEphemeronEdges.delete(match.duplicatedPart)) {
                        pendingEphemeronEdges.add(match.duplicatedPart);
                        return false;
                    }
                }
            }
            return true;
        }
        super.calculateDistances(isForRetainersView, filter);
    }
    isUserRoot(node) {
        return node.isUserRoot() || node.isDocumentDOMTreesRoot();
    }
    userObjectsMapAndFlag() {
        return { map: this.flags, flag: this.nodeFlags.pageObject };
    }
    flagsOfNode(node) {
        return this.flags[node.nodeIndex / this.nodeFieldCount];
    }
    markDetachedDOMTreeNodes() {
        const nodes = this.nodes;
        const nodesLength = nodes.length;
        const nodeFieldCount = this.nodeFieldCount;
        const nodeNativeType = this.nodeNativeType;
        const nodeTypeOffset = this.nodeTypeOffset;
        const flag = this.nodeFlags.detachedDOMTreeNode;
        const node = this.rootNode();
        for (let nodeIndex = 0, ordinal = 0; nodeIndex < nodesLength; nodeIndex += nodeFieldCount, ordinal++) {
            const nodeType = nodes.getValue(nodeIndex + nodeTypeOffset);
            if (nodeType !== nodeNativeType) {
                continue;
            }
            node.nodeIndex = nodeIndex;
            if (node.name().startsWith('Detached ')) {
                this.flags[ordinal] |= flag;
            }
        }
    }
    markQueriableHeapObjects() {
        // Allow runtime properties query for objects accessible from Window objects
        // via regular properties, and for DOM wrappers. Trying to access random objects
        // can cause a crash due to inconsistent state of internal properties of wrappers.
        const flag = this.nodeFlags.canBeQueried;
        const hiddenEdgeType = this.edgeHiddenType;
        const internalEdgeType = this.edgeInternalType;
        const invisibleEdgeType = this.edgeInvisibleType;
        const weakEdgeType = this.edgeWeakType;
        const edgeToNodeOffset = this.edgeToNodeOffset;
        const edgeTypeOffset = this.edgeTypeOffset;
        const edgeFieldsCount = this.edgeFieldsCount;
        const containmentEdges = this.containmentEdges;
        const nodeFieldCount = this.nodeFieldCount;
        const firstEdgeIndexes = this.firstEdgeIndexes;
        const flags = this.flags;
        const list = [];
        for (let iter = this.rootNode().edges(); iter.hasNext(); iter.next()) {
            if (iter.edge.node().isUserRoot()) {
                list.push(iter.edge.node().nodeIndex / nodeFieldCount);
            }
        }
        while (list.length) {
            const nodeOrdinal = list.pop();
            if (flags[nodeOrdinal] & flag) {
                continue;
            }
            flags[nodeOrdinal] |= flag;
            const beginEdgeIndex = firstEdgeIndexes[nodeOrdinal];
            const endEdgeIndex = firstEdgeIndexes[nodeOrdinal + 1];
            for (let edgeIndex = beginEdgeIndex; edgeIndex < endEdgeIndex; edgeIndex += edgeFieldsCount) {
                const childNodeIndex = containmentEdges.getValue(edgeIndex + edgeToNodeOffset);
                const childNodeOrdinal = childNodeIndex / nodeFieldCount;
                if (flags[childNodeOrdinal] & flag) {
                    continue;
                }
                const type = containmentEdges.getValue(edgeIndex + edgeTypeOffset);
                if (type === hiddenEdgeType || type === invisibleEdgeType || type === internalEdgeType ||
                    type === weakEdgeType) {
                    continue;
                }
                list.push(childNodeOrdinal);
            }
        }
    }
    markPageOwnedNodes() {
        const edgeShortcutType = this.edgeShortcutType;
        const edgeElementType = this.edgeElementType;
        const edgeToNodeOffset = this.edgeToNodeOffset;
        const edgeTypeOffset = this.edgeTypeOffset;
        const edgeFieldsCount = this.edgeFieldsCount;
        const edgeWeakType = this.edgeWeakType;
        const firstEdgeIndexes = this.firstEdgeIndexes;
        const containmentEdges = this.containmentEdges;
        const nodeFieldCount = this.nodeFieldCount;
        const nodesCount = this.nodeCount;
        const flags = this.flags;
        const pageObjectFlag = this.nodeFlags.pageObject;
        const nodesToVisit = new Uint32Array(nodesCount);
        let nodesToVisitLength = 0;
        const rootNodeOrdinal = this.rootNodeIndexInternal / nodeFieldCount;
        const node = this.rootNode();
        // Populate the entry points. They are Window objects and DOM Tree Roots.
        for (let edgeIndex = firstEdgeIndexes[rootNodeOrdinal], endEdgeIndex = firstEdgeIndexes[rootNodeOrdinal + 1]; edgeIndex < endEdgeIndex; edgeIndex += edgeFieldsCount) {
            const edgeType = containmentEdges.getValue(edgeIndex + edgeTypeOffset);
            const nodeIndex = containmentEdges.getValue(edgeIndex + edgeToNodeOffset);
            if (edgeType === edgeElementType) {
                node.nodeIndex = nodeIndex;
                if (!node.isDocumentDOMTreesRoot()) {
                    continue;
                }
            }
            else if (edgeType !== edgeShortcutType) {
                continue;
            }
            const nodeOrdinal = nodeIndex / nodeFieldCount;
            nodesToVisit[nodesToVisitLength++] = nodeOrdinal;
            flags[nodeOrdinal] |= pageObjectFlag;
        }
        // Mark everything reachable with the pageObject flag.
        while (nodesToVisitLength) {
            const nodeOrdinal = nodesToVisit[--nodesToVisitLength];
            const beginEdgeIndex = firstEdgeIndexes[nodeOrdinal];
            const endEdgeIndex = firstEdgeIndexes[nodeOrdinal + 1];
            for (let edgeIndex = beginEdgeIndex; edgeIndex < endEdgeIndex; edgeIndex += edgeFieldsCount) {
                const childNodeIndex = containmentEdges.getValue(edgeIndex + edgeToNodeOffset);
                const childNodeOrdinal = childNodeIndex / nodeFieldCount;
                if (flags[childNodeOrdinal] & pageObjectFlag) {
                    continue;
                }
                const type = containmentEdges.getValue(edgeIndex + edgeTypeOffset);
                if (type === edgeWeakType) {
                    continue;
                }
                nodesToVisit[nodesToVisitLength++] = childNodeOrdinal;
                flags[childNodeOrdinal] |= pageObjectFlag;
            }
        }
    }
    calculateStatistics() {
        const nodeFieldCount = this.nodeFieldCount;
        const nodes = this.nodes;
        const nodesLength = nodes.length;
        const nodeTypeOffset = this.nodeTypeOffset;
        const nodeSizeOffset = this.nodeSelfSizeOffset;
        const nodeNativeType = this.nodeNativeType;
        const nodeCodeType = this.nodeCodeType;
        const nodeConsStringType = this.nodeConsStringType;
        const nodeSlicedStringType = this.nodeSlicedStringType;
        const distances = this.nodeDistances;
        let sizeNative = 0;
        let sizeCode = 0;
        let sizeStrings = 0;
        let sizeJSArrays = 0;
        let sizeSystem = 0;
        const node = this.rootNode();
        for (let nodeIndex = 0; nodeIndex < nodesLength; nodeIndex += nodeFieldCount) {
            const nodeSize = nodes.getValue(nodeIndex + nodeSizeOffset);
            const ordinal = nodeIndex / nodeFieldCount;
            if (distances[ordinal] >= baseSystemDistance) {
                sizeSystem += nodeSize;
                continue;
            }
            const nodeType = nodes.getValue(nodeIndex + nodeTypeOffset);
            node.nodeIndex = nodeIndex;
            if (nodeType === nodeNativeType) {
                sizeNative += nodeSize;
            }
            else if (nodeType === nodeCodeType) {
                sizeCode += nodeSize;
            }
            else if (nodeType === nodeConsStringType || nodeType === nodeSlicedStringType || node.type() === 'string') {
                sizeStrings += nodeSize;
            }
            else if (node.name() === 'Array') {
                sizeJSArrays += this.calculateArraySize(node);
            }
        }
        this.#statistics = new Statistics();
        this.#statistics.total = this.totalSize;
        this.#statistics.v8heap = this.totalSize - sizeNative;
        this.#statistics.native = sizeNative;
        this.#statistics.code = sizeCode;
        this.#statistics.jsArrays = sizeJSArrays;
        this.#statistics.strings = sizeStrings;
        this.#statistics.system = sizeSystem;
    }
    calculateArraySize(node) {
        let size = node.selfSize();
        const beginEdgeIndex = node.edgeIndexesStart();
        const endEdgeIndex = node.edgeIndexesEnd();
        const containmentEdges = this.containmentEdges;
        const strings = this.strings;
        const edgeToNodeOffset = this.edgeToNodeOffset;
        const edgeTypeOffset = this.edgeTypeOffset;
        const edgeNameOffset = this.edgeNameOffset;
        const edgeFieldsCount = this.edgeFieldsCount;
        const edgeInternalType = this.edgeInternalType;
        for (let edgeIndex = beginEdgeIndex; edgeIndex < endEdgeIndex; edgeIndex += edgeFieldsCount) {
            const edgeType = containmentEdges.getValue(edgeIndex + edgeTypeOffset);
            if (edgeType !== edgeInternalType) {
                continue;
            }
            const edgeName = strings[containmentEdges.getValue(edgeIndex + edgeNameOffset)];
            if (edgeName !== 'elements') {
                continue;
            }
            const elementsNodeIndex = containmentEdges.getValue(edgeIndex + edgeToNodeOffset);
            node.nodeIndex = elementsNodeIndex;
            if (node.retainersCount() === 1) {
                size += node.selfSize();
            }
            break;
        }
        return size;
    }
    getStatistics() {
        return this.#statistics;
    }
}
class JSHeapSnapshotNode extends HeapSnapshotNode {
    constructor(snapshot, nodeIndex) {
        super(snapshot, nodeIndex);
    }
    canBeQueried() {
        const snapshot = this.snapshot;
        const flags = snapshot.flagsOfNode(this);
        return Boolean(flags & snapshot.nodeFlags.canBeQueried);
    }
    rawName() {
        return super.name();
    }
    name() {
        const snapshot = this.snapshot;
        if (this.rawType() === snapshot.nodeConsStringType) {
            let string = snapshot.lazyStringCache[this.nodeIndex];
            if (typeof string === 'undefined') {
                string = this.consStringName();
                snapshot.lazyStringCache[this.nodeIndex] = string;
            }
            return string;
        }
        return this.rawName();
    }
    consStringName() {
        const snapshot = this.snapshot;
        const consStringType = snapshot.nodeConsStringType;
        const edgeInternalType = snapshot.edgeInternalType;
        const edgeFieldsCount = snapshot.edgeFieldsCount;
        const edgeToNodeOffset = snapshot.edgeToNodeOffset;
        const edgeTypeOffset = snapshot.edgeTypeOffset;
        const edgeNameOffset = snapshot.edgeNameOffset;
        const strings = snapshot.strings;
        const edges = snapshot.containmentEdges;
        const firstEdgeIndexes = snapshot.firstEdgeIndexes;
        const nodeFieldCount = snapshot.nodeFieldCount;
        const nodeTypeOffset = snapshot.nodeTypeOffset;
        const nodeNameOffset = snapshot.nodeNameOffset;
        const nodes = snapshot.nodes;
        const nodesStack = [];
        nodesStack.push(this.nodeIndex);
        let name = '';
        while (nodesStack.length && name.length < 1024) {
            const nodeIndex = nodesStack.pop();
            if (nodes.getValue(nodeIndex + nodeTypeOffset) !== consStringType) {
                name += strings[nodes.getValue(nodeIndex + nodeNameOffset)];
                continue;
            }
            const nodeOrdinal = nodeIndex / nodeFieldCount;
            const beginEdgeIndex = firstEdgeIndexes[nodeOrdinal];
            const endEdgeIndex = firstEdgeIndexes[nodeOrdinal + 1];
            let firstNodeIndex = 0;
            let secondNodeIndex = 0;
            for (let edgeIndex = beginEdgeIndex; edgeIndex < endEdgeIndex && (!firstNodeIndex || !secondNodeIndex); edgeIndex += edgeFieldsCount) {
                const edgeType = edges.getValue(edgeIndex + edgeTypeOffset);
                if (edgeType === edgeInternalType) {
                    const edgeName = strings[edges.getValue(edgeIndex + edgeNameOffset)];
                    if (edgeName === 'first') {
                        firstNodeIndex = edges.getValue(edgeIndex + edgeToNodeOffset);
                    }
                    else if (edgeName === 'second') {
                        secondNodeIndex = edges.getValue(edgeIndex + edgeToNodeOffset);
                    }
                }
            }
            nodesStack.push(secondNodeIndex);
            nodesStack.push(firstNodeIndex);
        }
        return name;
    }
    className() {
        const type = this.type();
        switch (type) {
            case 'hidden':
                return '(system)';
            case 'object':
            case 'native':
                return this.name();
            case 'code':
                return '(compiled code)';
            case 'closure':
                return 'Function';
            case 'regexp':
                return 'RegExp';
            default:
                return '(' + type + ')';
        }
    }
    classIndex() {
        const snapshot = this.snapshot;
        const nodes = snapshot.nodes;
        const type = nodes.getValue(this.nodeIndex + snapshot.nodeTypeOffset);
        if (type === snapshot.nodeObjectType || type === snapshot.nodeNativeType) {
            return nodes.getValue(this.nodeIndex + snapshot.nodeNameOffset);
        }
        return -1 - type;
    }
    id() {
        const snapshot = this.snapshot;
        return snapshot.nodes.getValue(this.nodeIndex + snapshot.nodeIdOffset);
    }
    isHidden() {
        return this.rawType() === this.snapshot.nodeHiddenType;
    }
    isArray() {
        return this.rawType() === this.snapshot.nodeArrayType;
    }
    isSynthetic() {
        return this.rawType() === this.snapshot.nodeSyntheticType;
    }
    isUserRoot() {
        return !this.isSynthetic();
    }
    isDocumentDOMTreesRoot() {
        return this.isSynthetic() && this.name() === '(Document DOM trees)';
    }
    serialize() {
        const result = super.serialize();
        const snapshot = this.snapshot;
        const flags = snapshot.flagsOfNode(this);
        if (flags & snapshot.nodeFlags.canBeQueried) {
            result.canBeQueried = true;
        }
        if (flags & snapshot.nodeFlags.detachedDOMTreeNode) {
            result.detachedDOMTreeNode = true;
        }
        return result;
    }
}
class JSHeapSnapshotEdge extends HeapSnapshotEdge {
    constructor(snapshot, edgeIndex) {
        super(snapshot, edgeIndex);
    }
    clone() {
        const snapshot = this.snapshot;
        return new JSHeapSnapshotEdge(snapshot, this.edgeIndex);
    }
    hasStringName() {
        if (!this.isShortcut()) {
            return this.hasStringNameInternal();
        }
        // @ts-ignore parseInt is successful against numbers.
        return isNaN(parseInt(this.nameInternal(), 10));
    }
    isElement() {
        return this.rawType() === this.snapshot.edgeElementType;
    }
    isHidden() {
        return this.rawType() === this.snapshot.edgeHiddenType;
    }
    isWeak() {
        return this.rawType() === this.snapshot.edgeWeakType;
    }
    isInternal() {
        return this.rawType() === this.snapshot.edgeInternalType;
    }
    isInvisible() {
        return this.rawType() === this.snapshot.edgeInvisibleType;
    }
    isShortcut() {
        return this.rawType() === this.snapshot.edgeShortcutType;
    }
    name() {
        const name = this.nameInternal();
        if (!this.isShortcut()) {
            return String(name);
        }
        // @ts-ignore parseInt is successful against numbers.
        const numName = parseInt(name, 10);
        return String(isNaN(numName) ? name : numName);
    }
    toString() {
        const name = this.name();
        switch (this.type()) {
            case 'context':
                return '->' + name;
            case 'element':
                return '[' + name + ']';
            case 'weak':
                return '[[' + name + ']]';
            case 'property':
                return name.indexOf(' ') === -1 ? '.' + name : '["' + name + '"]';
            case 'shortcut':
                if (typeof name === 'string') {
                    return name.indexOf(' ') === -1 ? '.' + name : '["' + name + '"]';
                }
                return '[' + name + ']';
            case 'internal':
            case 'hidden':
            case 'invisible':
                return '{' + name + '}';
        }
        return '?' + name + '?';
    }
    hasStringNameInternal() {
        const type = this.rawType();
        const snapshot = this.snapshot;
        return type !== snapshot.edgeElementType && type !== snapshot.edgeHiddenType;
    }
    nameInternal() {
        return this.hasStringNameInternal() ? this.snapshot.strings[this.nameOrIndex()] : this.nameOrIndex();
    }
    nameOrIndex() {
        return this.edges.getValue(this.edgeIndex + this.snapshot.edgeNameOffset);
    }
    rawType() {
        return this.edges.getValue(this.edgeIndex + this.snapshot.edgeTypeOffset);
    }
}
class JSHeapSnapshotRetainerEdge extends HeapSnapshotRetainerEdge {
    constructor(snapshot, retainerIndex) {
        super(snapshot, retainerIndex);
    }
    clone() {
        const snapshot = this.snapshot;
        return new JSHeapSnapshotRetainerEdge(snapshot, this.retainerIndex());
    }
    isHidden() {
        return this.edge().isHidden();
    }
    isInvisible() {
        return this.edge().isInvisible();
    }
    isShortcut() {
        return this.edge().isShortcut();
    }
    isWeak() {
        return this.edge().isWeak();
    }
}

const t=1024;let e=0;class i{constructor(t,e){this.from=t,this.to=e;}}class n{constructor(t={}){this.id=e++,this.perNode=!!t.perNode,this.deserialize=t.deserialize||(()=>{throw new Error("This node type doesn't define a deserialize function")});}add(t){if(this.perNode)throw new RangeError("Can't add per-node props to node types");return "function"!=typeof t&&(t=o.match(t)),e=>{let i=t(e);return void 0===i?null:[this,i]}}}n.closedBy=new n({deserialize:t=>t.split(" ")}),n.openedBy=new n({deserialize:t=>t.split(" ")}),n.group=new n({deserialize:t=>t.split(" ")}),n.isolate=new n({deserialize:t=>{if(t&&"rtl"!=t&&"ltr"!=t&&"auto"!=t)throw new RangeError("Invalid value for isolate: "+t);return t||"auto"}}),n.contextHash=new n({perNode:!0}),n.lookAhead=new n({perNode:!0}),n.mounted=new n({perNode:!0});class s{constructor(t,e,i){this.tree=t,this.overlay=e,this.parser=i;}static get(t){return t&&t.props&&t.props[n.mounted.id]}}const r=Object.create(null);class o{constructor(t,e,i,n=0){this.name=t,this.props=e,this.id=i,this.flags=n;}static define(t){let e=t.props&&t.props.length?Object.create(null):r,i=(t.top?1:0)|(t.skipped?2:0)|(t.error?4:0)|(null==t.name?8:0),n=new o(t.name||"",e,t.id,i);if(t.props)for(let i of t.props)if(Array.isArray(i)||(i=i(n)),i){if(i[0].perNode)throw new RangeError("Can't store a per-node prop on a node type");e[i[0].id]=i[1];}return n}prop(t){return this.props[t.id]}get isTop(){return (1&this.flags)>0}get isSkipped(){return (2&this.flags)>0}get isError(){return (4&this.flags)>0}get isAnonymous(){return (8&this.flags)>0}is(t){if("string"==typeof t){if(this.name==t)return !0;let e=this.prop(n.group);return !!e&&e.indexOf(t)>-1}return this.id==t}static match(t){let e=Object.create(null);for(let i in t)for(let n of i.split(" "))e[n]=t[i];return t=>{for(let i=t.prop(n.group),s=-1;s<(i?i.length:0);s++){let n=e[s<0?t.name:i[s]];if(n)return n}}}}o.none=new o("",Object.create(null),0,8);class a{constructor(t){this.types=t;for(let e=0;e<t.length;e++)if(t[e].id!=e)throw new RangeError("Node type ids should correspond to array positions when creating a node set")}extend(...t){let e=[];for(let i of this.types){let n=null;for(let e of t){let t=e(i);t&&(n||(n=Object.assign({},i.props)),n[t[0].id]=t[1]);}e.push(n?new o(i.name,n,i.id,i.flags):i);}return new a(e)}}const l=new WeakMap,h=new WeakMap;var c;!function(t){t[t.ExcludeBuffers=1]="ExcludeBuffers",t[t.IncludeAnonymous=2]="IncludeAnonymous",t[t.IgnoreMounts=4]="IgnoreMounts",t[t.IgnoreOverlays=8]="IgnoreOverlays";}(c||(c={}));class O{constructor(t,e,i,n,s){if(this.type=t,this.children=e,this.positions=i,this.length=n,this.props=null,s&&s.length){this.props=Object.create(null);for(let[t,e]of s)this.props["number"==typeof t?t:t.id]=e;}}toString(){let t=s.get(this);if(t&&!t.overlay)return t.tree.toString();let e="";for(let t of this.children){let i=t.toString();i&&(e&&(e+=","),e+=i);}return this.type.name?(/\W/.test(this.type.name)&&!this.type.isError?JSON.stringify(this.type.name):this.type.name)+(e.length?"("+e+")":""):e}cursor(t=0){return new v(this.topNode,t)}cursorAt(t,e=0,i=0){let n=l.get(this)||this.topNode,s=new v(n);return s.moveTo(t,e),l.set(this,s._tree),s}get topNode(){return new m(this,0,0,null)}resolve(t,e=0){let i=p(l.get(this)||this.topNode,t,e,!1);return l.set(this,i),i}resolveInner(t,e=0){let i=p(h.get(this)||this.topNode,t,e,!0);return h.set(this,i),i}resolveStack(t,e=0){return function(t,e,i){let n=t.resolveInner(e,i),r=null;for(let t=n instanceof m?n:n.context.parent;t;t=t.parent)if(t.index<0){let s=t.parent;(r||(r=[n])).push(s.resolve(e,i)),t=s;}else {let o=s.get(t.tree);if(o&&o.overlay&&o.overlay[0].from<=e&&o.overlay[o.overlay.length-1].to>=e){let s=new m(o.tree,o.overlay[0].from+t.from,-1,t);(r||(r=[n])).push(p(s,e,i,!1));}}return r?x(r):n}(this,t,e)}iterate(t){let{enter:e,leave:i,from:n=0,to:s=this.length}=t,r=t.mode||0,o=(r&c.IncludeAnonymous)>0;for(let t=this.cursor(r|c.IncludeAnonymous);;){let r=!1;if(t.from<=s&&t.to>=n&&(!o&&t.type.isAnonymous||!1!==e(t))){if(t.firstChild())continue;r=!0;}for(;r&&i&&(o||!t.type.isAnonymous)&&i(t),!t.nextSibling();){if(!t.parent())return;r=!0;}}}prop(t){return t.perNode?this.props?this.props[t.id]:void 0:this.type.prop(t)}get propValues(){let t=[];if(this.props)for(let e in this.props)t.push([+e,this.props[e]]);return t}balance(t={}){return this.children.length<=8?this:Z(o.none,this.children,this.positions,0,this.children.length,0,this.length,((t,e,i)=>new O(this.type,t,e,i,this.propValues)),t.makeTree||((t,e,i)=>new O(o.none,t,e,i)))}static build(e){return function(e){var i;let{buffer:s,nodeSet:r,maxBufferLength:o=t,reused:a=[],minRepeatType:l=r.types.length}=e,h=Array.isArray(s)?new u(s,s.length):s,c=r.types,d=0,p=0;function g(t,e,i,n,s,O){let{id:u,start:y,end:v,size:P}=h,k=p;for(;P<0;){if(h.next(),-1==P){let e=a[u];return i.push(e),void n.push(y-t)}if(-3==P)return void(d=u);if(-4==P)return void(p=u);throw new RangeError(`Unrecognized record size: ${P}`)}let $,X,T=c[u],R=y-t;if(v-y<=o&&(X=Q(h.pos-e,s))){let e=new Uint16Array(X.size-X.skip),i=h.pos-X.size,n=e.length;for(;h.pos>i;)n=x(X.start,e,n);$=new f(e,v-X.start,r),R=X.start-t;}else {let t=h.pos-P;h.next();let e=[],i=[],n=u>=l?u:-1,s=0,r=v;for(;h.pos>t;)n>=0&&h.id==n&&h.size>=0?(h.end<=r-o&&(b(e,i,y,s,h.end,r,n,k),s=e.length,r=h.end),h.next()):O>2500?m(y,t,e,i):g(y,t,e,i,n,O+1);if(n>=0&&s>0&&s<e.length&&b(e,i,y,s,y,r,n,k),e.reverse(),i.reverse(),n>-1&&s>0){let t=w(T);$=Z(T,e,i,0,e.length,0,v-y,t,t);}else $=S(T,e,i,v-y,k-v);}i.push($),n.push(R);}function m(t,e,i,n){let s=[],a=0,l=-1;for(;h.pos>e;){let{id:t,start:e,end:i,size:n}=h;if(n>4)h.next();else {if(l>-1&&e<l)break;l<0&&(l=i-o),s.push(t,e,i),a++,h.next();}}if(a){let e=new Uint16Array(4*a),o=s[s.length-2];for(let t=s.length-3,i=0;t>=0;t-=3)e[i++]=s[t],e[i++]=s[t+1]-o,e[i++]=s[t+2]-o,e[i++]=i;i.push(new f(e,s[2]-o,r)),n.push(o-t);}}function w(t){return (e,i,s)=>{let r,o,a=0,l=e.length-1;if(l>=0&&(r=e[l])instanceof O){if(!l&&r.type==t&&r.length==s)return r;(o=r.prop(n.lookAhead))&&(a=i[l]+r.length+o);}return S(t,e,i,s,a)}}function b(t,e,i,n,s,o,a,l){let h=[],c=[];for(;t.length>n;)h.push(t.pop()),c.push(e.pop()+i-s);t.push(S(r.types[a],h,c,o-s,l-o)),e.push(s-i);}function S(t,e,i,s,r=0,o){if(d){let t=[n.contextHash,d];o=o?[t].concat(o):[t];}if(r>25){let t=[n.lookAhead,r];o=o?[t].concat(o):[t];}return new O(t,e,i,s,o)}function Q(t,e){let i=h.fork(),n=0,s=0,r=0,a=i.end-o,c={size:0,start:0,skip:0};t:for(let o=i.pos-t;i.pos>o;){let t=i.size;if(i.id==e&&t>=0){c.size=n,c.start=s,c.skip=r,r+=4,n+=4,i.next();continue}let h=i.pos-t;if(t<0||h<o||i.start<a)break;let O=i.id>=l?4:0,u=i.start;for(i.next();i.pos>h;){if(i.size<0){if(-3!=i.size)break t;O+=4;}else i.id>=l&&(O+=4);i.next();}s=u,n+=t,r+=O;}return (e<0||n==t)&&(c.size=n,c.start=s,c.skip=r),c.size>4?c:void 0}function x(t,e,i){let{id:n,start:s,end:r,size:o}=h;if(h.next(),o>=0&&n<l){let a=i;if(o>4){let n=h.pos-(o-4);for(;h.pos>n;)i=x(t,e,i);}e[--i]=a,e[--i]=r-t,e[--i]=s-t,e[--i]=n;}else -3==o?d=n:-4==o&&(p=n);return i}let y=[],v=[];for(;h.pos>0;)g(e.start||0,e.bufferStart||0,y,v,-1,0);let P=null!==(i=e.length)&&void 0!==i?i:y.length?v[0]+y[0].length:0;return new O(c[e.topID],y.reverse(),v.reverse(),P)}(e)}}O.empty=new O(o.none,[],[],0);class u{constructor(t,e){this.buffer=t,this.index=e;}get id(){return this.buffer[this.index-4]}get start(){return this.buffer[this.index-3]}get end(){return this.buffer[this.index-2]}get size(){return this.buffer[this.index-1]}get pos(){return this.index}next(){this.index-=4;}fork(){return new u(this.buffer,this.index)}}class f{constructor(t,e,i){this.buffer=t,this.length=e,this.set=i;}get type(){return o.none}toString(){let t=[];for(let e=0;e<this.buffer.length;)t.push(this.childString(e)),e=this.buffer[e+3];return t.join(",")}childString(t){let e=this.buffer[t],i=this.buffer[t+3],n=this.set.types[e],s=n.name;if(/\W/.test(s)&&!n.isError&&(s=JSON.stringify(s)),i==(t+=4))return s;let r=[];for(;t<i;)r.push(this.childString(t)),t=this.buffer[t+3];return s+"("+r.join(",")+")"}findChild(t,e,i,n,s){let{buffer:r}=this,o=-1;for(let a=t;a!=e&&!(d(s,n,r[a+1],r[a+2])&&(o=a,i>0));a=r[a+3]);return o}slice(t,e,i){let n=this.buffer,s=new Uint16Array(e-t),r=0;for(let o=t,a=0;o<e;){s[a++]=n[o++],s[a++]=n[o++]-i;let e=s[a++]=n[o++]-i;s[a++]=n[o++]-t,r=Math.max(r,e);}return new f(s,r,this.set)}}function d(t,e,i,n){switch(t){case-2:return i<e;case-1:return n>=e&&i<e;case 0:return i<e&&n>e;case 1:return i<=e&&n>e;case 2:return n>e;case 4:return !0}}function p(t,e,i,n){for(var s;t.from==t.to||(i<1?t.from>=e:t.from>e)||(i>-1?t.to<=e:t.to<e);){let e=!n&&t instanceof m&&t.index<0?null:t.parent;if(!e)return t;t=e;}let r=n?0:c.IgnoreOverlays;if(n)for(let n=t,o=n.parent;o;n=o,o=n.parent)n instanceof m&&n.index<0&&(null===(s=o.enter(e,i,r))||void 0===s?void 0:s.from)!=n.from&&(t=o);for(;;){let n=t.enter(e,i,r);if(!n)return t;t=n;}}class g{cursor(t=0){return new v(this,t)}getChild(t,e=null,i=null){let n=w(this,t,e,i);return n.length?n[0]:null}getChildren(t,e=null,i=null){return w(this,t,e,i)}resolve(t,e=0){return p(this,t,e,!1)}resolveInner(t,e=0){return p(this,t,e,!0)}matchContext(t){return b(this,t)}enterUnfinishedNodesBefore(t){let e=this.childBefore(t),i=this;for(;e;){let t=e.lastChild;if(!t||t.to!=e.to)break;t.type.isError&&t.from==t.to?(i=e,e=t.prevSibling):e=t;}return i}get node(){return this}get next(){return this.parent}}class m extends g{constructor(t,e,i,n){super(),this._tree=t,this.from=e,this.index=i,this._parent=n;}get type(){return this._tree.type}get name(){return this._tree.type.name}get to(){return this.from+this._tree.length}nextChild(t,e,i,n,r=0){for(let o=this;;){for(let{children:a,positions:l}=o._tree,h=e>0?a.length:-1;t!=h;t+=e){let h=a[t],O=l[t]+o.from;if(d(n,i,O,O+h.length))if(h instanceof f){if(r&c.ExcludeBuffers)continue;let s=h.findChild(0,h.buffer.length,e,i-O,n);if(s>-1)return new Q(new S(o,h,t,O),null,s)}else if(r&c.IncludeAnonymous||!h.type.isAnonymous||P(h)){let a;if(!(r&c.IgnoreMounts)&&(a=s.get(h))&&!a.overlay)return new m(a.tree,O,t,o);let l=new m(h,O,t,o);return r&c.IncludeAnonymous||!l.type.isAnonymous?l:l.nextChild(e<0?h.children.length-1:0,e,i,n)}}if(r&c.IncludeAnonymous||!o.type.isAnonymous)return null;if(t=o.index>=0?o.index+e:e<0?-1:o._parent._tree.children.length,o=o._parent,!o)return null}}get firstChild(){return this.nextChild(0,1,0,4)}get lastChild(){return this.nextChild(this._tree.children.length-1,-1,0,4)}childAfter(t){return this.nextChild(0,1,t,2)}childBefore(t){return this.nextChild(this._tree.children.length-1,-1,t,-2)}enter(t,e,i=0){let n;if(!(i&c.IgnoreOverlays)&&(n=s.get(this._tree))&&n.overlay){let i=t-this.from;for(let{from:t,to:s}of n.overlay)if((e>0?t<=i:t<i)&&(e<0?s>=i:s>i))return new m(n.tree,n.overlay[0].from+this.from,-1,this)}return this.nextChild(0,1,t,e,i)}nextSignificantParent(){let t=this;for(;t.type.isAnonymous&&t._parent;)t=t._parent;return t}get parent(){return this._parent?this._parent.nextSignificantParent():null}get nextSibling(){return this._parent&&this.index>=0?this._parent.nextChild(this.index+1,1,0,4):null}get prevSibling(){return this._parent&&this.index>=0?this._parent.nextChild(this.index-1,-1,0,4):null}get tree(){return this._tree}toTree(){return this._tree}toString(){return this._tree.toString()}}function w(t,e,i,n){let s=t.cursor(),r=[];if(!s.firstChild())return r;if(null!=i)for(let t=!1;!t;)if(t=s.type.is(i),!s.nextSibling())return r;for(;;){if(null!=n&&s.type.is(n))return r;if(s.type.is(e)&&r.push(s.node),!s.nextSibling())return null==n?r:[]}}function b(t,e,i=e.length-1){for(let n=t.parent;i>=0;n=n.parent){if(!n)return !1;if(!n.type.isAnonymous){if(e[i]&&e[i]!=n.name)return !1;i--;}}return !0}class S{constructor(t,e,i,n){this.parent=t,this.buffer=e,this.index=i,this.start=n;}}class Q extends g{get name(){return this.type.name}get from(){return this.context.start+this.context.buffer.buffer[this.index+1]}get to(){return this.context.start+this.context.buffer.buffer[this.index+2]}constructor(t,e,i){super(),this.context=t,this._parent=e,this.index=i,this.type=t.buffer.set.types[t.buffer.buffer[i]];}child(t,e,i){let{buffer:n}=this.context,s=n.findChild(this.index+4,n.buffer[this.index+3],t,e-this.context.start,i);return s<0?null:new Q(this.context,this,s)}get firstChild(){return this.child(1,0,4)}get lastChild(){return this.child(-1,0,4)}childAfter(t){return this.child(1,t,2)}childBefore(t){return this.child(-1,t,-2)}enter(t,e,i=0){if(i&c.ExcludeBuffers)return null;let{buffer:n}=this.context,s=n.findChild(this.index+4,n.buffer[this.index+3],e>0?1:-1,t-this.context.start,e);return s<0?null:new Q(this.context,this,s)}get parent(){return this._parent||this.context.parent.nextSignificantParent()}externalSibling(t){return this._parent?null:this.context.parent.nextChild(this.context.index+t,t,0,4)}get nextSibling(){let{buffer:t}=this.context,e=t.buffer[this.index+3];return e<(this._parent?t.buffer[this._parent.index+3]:t.buffer.length)?new Q(this.context,this._parent,e):this.externalSibling(1)}get prevSibling(){let{buffer:t}=this.context,e=this._parent?this._parent.index+4:0;return this.index==e?this.externalSibling(-1):new Q(this.context,this._parent,t.findChild(e,this.index,-1,0,4))}get tree(){return null}toTree(){let t=[],e=[],{buffer:i}=this.context,n=this.index+4,s=i.buffer[this.index+3];if(s>n){let r=i.buffer[this.index+1];t.push(i.slice(n,s,r)),e.push(0);}return new O(this.type,t,e,this.to-this.from)}toString(){return this.context.buffer.childString(this.index)}}function x(t){if(!t.length)return null;let e=0,i=t[0];for(let n=1;n<t.length;n++){let s=t[n];(s.from>i.from||s.to<i.to)&&(i=s,e=n);}let n=i instanceof m&&i.index<0?null:i.parent,s=t.slice();return n?s[e]=n:s.splice(e,1),new y(s,i)}class y{constructor(t,e){this.heads=t,this.node=e;}get next(){return x(this.heads)}}class v{get name(){return this.type.name}constructor(t,e=0){if(this.mode=e,this.buffer=null,this.stack=[],this.index=0,this.bufferNode=null,t instanceof m)this.yieldNode(t);else {this._tree=t.context.parent,this.buffer=t.context;for(let e=t._parent;e;e=e._parent)this.stack.unshift(e.index);this.bufferNode=t,this.yieldBuf(t.index);}}yieldNode(t){return !!t&&(this._tree=t,this.type=t.type,this.from=t.from,this.to=t.to,!0)}yieldBuf(t,e){this.index=t;let{start:i,buffer:n}=this.buffer;return this.type=e||n.set.types[n.buffer[t]],this.from=i+n.buffer[t+1],this.to=i+n.buffer[t+2],!0}yield(t){return !!t&&(t instanceof m?(this.buffer=null,this.yieldNode(t)):(this.buffer=t.context,this.yieldBuf(t.index,t.type)))}toString(){return this.buffer?this.buffer.buffer.childString(this.index):this._tree.toString()}enterChild(t,e,i){if(!this.buffer)return this.yield(this._tree.nextChild(t<0?this._tree._tree.children.length-1:0,t,e,i,this.mode));let{buffer:n}=this.buffer,s=n.findChild(this.index+4,n.buffer[this.index+3],t,e-this.buffer.start,i);return !(s<0)&&(this.stack.push(this.index),this.yieldBuf(s))}firstChild(){return this.enterChild(1,0,4)}lastChild(){return this.enterChild(-1,0,4)}childAfter(t){return this.enterChild(1,t,2)}childBefore(t){return this.enterChild(-1,t,-2)}enter(t,e,i=this.mode){return this.buffer?!(i&c.ExcludeBuffers)&&this.enterChild(1,t,e):this.yield(this._tree.enter(t,e,i))}parent(){if(!this.buffer)return this.yieldNode(this.mode&c.IncludeAnonymous?this._tree._parent:this._tree.parent);if(this.stack.length)return this.yieldBuf(this.stack.pop());let t=this.mode&c.IncludeAnonymous?this.buffer.parent:this.buffer.parent.nextSignificantParent();return this.buffer=null,this.yieldNode(t)}sibling(t){if(!this.buffer)return !!this._tree._parent&&this.yield(this._tree.index<0?null:this._tree._parent.nextChild(this._tree.index+t,t,0,4,this.mode));let{buffer:e}=this.buffer,i=this.stack.length-1;if(t<0){let t=i<0?0:this.stack[i]+4;if(this.index!=t)return this.yieldBuf(e.findChild(t,this.index,-1,0,4))}else {let t=e.buffer[this.index+3];if(t<(i<0?e.buffer.length:e.buffer[this.stack[i]+3]))return this.yieldBuf(t)}return i<0&&this.yield(this.buffer.parent.nextChild(this.buffer.index+t,t,0,4,this.mode))}nextSibling(){return this.sibling(1)}prevSibling(){return this.sibling(-1)}atLastNode(t){let e,i,{buffer:n}=this;if(n){if(t>0){if(this.index<n.buffer.buffer.length)return !1}else for(let t=0;t<this.index;t++)if(n.buffer.buffer[t+3]<this.index)return !1;({index:e,parent:i}=n);}else ({index:e,_parent:i}=this._tree);for(;i;({index:e,_parent:i}=i))if(e>-1)for(let n=e+t,s=t<0?-1:i._tree.children.length;n!=s;n+=t){let t=i._tree.children[n];if(this.mode&c.IncludeAnonymous||t instanceof f||!t.type.isAnonymous||P(t))return !1}return !0}move(t,e){if(e&&this.enterChild(t,0,4))return !0;for(;;){if(this.sibling(t))return !0;if(this.atLastNode(t)||!this.parent())return !1}}next(t=!0){return this.move(1,t)}prev(t=!0){return this.move(-1,t)}moveTo(t,e=0){for(;(this.from==this.to||(e<1?this.from>=t:this.from>t)||(e>-1?this.to<=t:this.to<t))&&this.parent(););for(;this.enterChild(1,t,e););return this}get node(){if(!this.buffer)return this._tree;let t=this.bufferNode,e=null,i=0;if(t&&t.context==this.buffer)t:for(let n=this.index,s=this.stack.length;s>=0;){for(let r=t;r;r=r._parent)if(r.index==n){if(n==this.index)return r;e=r,i=s+1;break t}n=this.stack[--s];}for(let t=i;t<this.stack.length;t++)e=new Q(this.buffer,e,this.stack[t]);return this.bufferNode=new Q(this.buffer,e,this.index)}get tree(){return this.buffer?null:this._tree._tree}iterate(t,e){for(let i=0;;){let n=!1;if(this.type.isAnonymous||!1!==t(this)){if(this.firstChild()){i++;continue}this.type.isAnonymous||(n=!0);}for(;n&&e&&e(this),n=this.type.isAnonymous,!this.nextSibling();){if(!i)return;this.parent(),i--,n=!0;}}}matchContext(t){if(!this.buffer)return b(this.node,t);let{buffer:e}=this.buffer,{types:i}=e.set;for(let n=t.length-1,s=this.stack.length-1;n>=0;s--){if(s<0)return b(this.node,t,n);let r=i[e.buffer[this.stack[s]]];if(!r.isAnonymous){if(t[n]&&t[n]!=r.name)return !1;n--;}}return !0}}function P(t){return t.children.some((t=>t instanceof f||!t.type.isAnonymous||P(t)))}const k=new WeakMap;function $(t,e){if(!t.isAnonymous||e instanceof f||e.type!=t)return 1;let i=k.get(e);if(null==i){i=1;for(let n of e.children){if(n.type!=t||!(n instanceof O)){i=1;break}i+=$(t,n);}k.set(e,i);}return i}function Z(t,e,i,n,s,r,o,a,l){let h=0;for(let i=n;i<s;i++)h+=$(t,e[i]);let c=Math.ceil(1.5*h/8),O=[],u=[];return function e(i,n,s,o,a){for(let h=s;h<o;){let s=h,f=n[h],d=$(t,i[h]);for(h++;h<o;h++){let e=$(t,i[h]);if(d+e>=c)break;d+=e;}if(h==s+1){if(d>c){let t=i[s];e(t.children,t.positions,0,t.children.length,n[s]+a);continue}O.push(i[s]);}else {let e=n[h-1]+i[h-1].length-f;O.push(Z(t,i,n,s,h,f,e,null,l));}u.push(f+a-r);}}(e,i,n,s,0),(a||l)(O,u,o)}class T{constructor(t,e,i,n,s=!1,r=!1){this.from=t,this.to=e,this.tree=i,this.offset=n,this.open=(s?1:0)|(r?2:0);}get openStart(){return (1&this.open)>0}get openEnd(){return (2&this.open)>0}static addTree(t,e=[],i=!1){let n=[new T(0,t.length,t,0,!1,i)];for(let i of e)i.to>t.length&&n.push(i);return n}static applyChanges(t,e,i=128){if(!e.length)return t;let n=[],s=1,r=t.length?t[0]:null;for(let o=0,a=0,l=0;;o++){let h=o<e.length?e[o]:null,c=h?h.fromA:1e9;if(c-a>=i)for(;r&&r.from<c;){let e=r;if(a>=e.from||c<=e.to||l){let t=Math.max(e.from,a)-l,i=Math.min(e.to,c)-l;e=t>=i?null:new T(t,i,e.tree,e.offset+l,o>0,!!h);}if(e&&n.push(e),r.to>c)break;r=s<t.length?t[s++]:null;}if(!h)break;a=h.toA,l=h.toA-h.toB;}return n}}class R{startParse(t,e,n){return "string"==typeof t&&(t=new A(t)),n=n?n.length?n.map((t=>new i(t.from,t.to))):[new i(0,0)]:[new i(0,t.length)],this.createParse(t,e||[],n)}parse(t,e,i){let n=this.startParse(t,e,i);for(;;){let t=n.advance();if(t)return t}}}class A{constructor(t){this.string=t;}get length(){return this.string.length}chunk(t){return this.string.slice(t)}get lineChunks(){return !1}read(t,e){return this.string.slice(t,e)}}function C(t){return (e,i,n,s)=>new j(e,t,i,n,s)}class q{constructor(t,e,i,n,s){this.parser=t,this.parse=e,this.overlay=i,this.target=n,this.from=s;}}function Y(t){if(!t.length||t.some((t=>t.from>=t.to)))throw new RangeError("Invalid inner parse ranges given: "+JSON.stringify(t))}class W{constructor(t,e,i,n,s,r,o){this.parser=t,this.predicate=e,this.mounts=i,this.index=n,this.start=s,this.target=r,this.prev=o,this.depth=0,this.ranges=[];}}const M=new n({perNode:!0});class j{constructor(t,e,i,n,s){this.nest=e,this.input=i,this.fragments=n,this.ranges=s,this.inner=[],this.innerDone=0,this.baseTree=null,this.stoppedAt=null,this.baseParse=t;}advance(){if(this.baseParse){let t=this.baseParse.advance();if(!t)return null;if(this.baseParse=null,this.baseTree=t,this.startInner(),null!=this.stoppedAt)for(let t of this.inner)t.parse.stopAt(this.stoppedAt);}if(this.innerDone==this.inner.length){let t=this.baseTree;return null!=this.stoppedAt&&(t=new O(t.type,t.children,t.positions,t.length,t.propValues.concat([[M,this.stoppedAt]]))),t}let t=this.inner[this.innerDone],e=t.parse.advance();if(e){this.innerDone++;let i=Object.assign(Object.create(null),t.target.props);i[n.mounted.id]=new s(e,t.overlay,t.parser),t.target.props=i;}return null}get parsedPos(){if(this.baseParse)return 0;let t=this.input.length;for(let e=this.innerDone;e<this.inner.length;e++)this.inner[e].from<t&&(t=Math.min(t,this.inner[e].parse.parsedPos));return t}stopAt(t){if(this.stoppedAt=t,this.baseParse)this.baseParse.stopAt(t);else for(let e=this.innerDone;e<this.inner.length;e++)this.inner[e].parse.stopAt(t);}startInner(){let t=new D(this.fragments),e=null,n=null,s=new v(new m(this.baseTree,this.ranges[0].from,0,null),c.IncludeAnonymous|c.IgnoreMounts);t:for(let r,o;;){let a,l=!0;if(null!=this.stoppedAt&&s.from>=this.stoppedAt)l=!1;else if(t.hasNode(s)){if(e){let t=e.mounts.find((t=>t.frag.from<=s.from&&t.frag.to>=s.to&&t.mount.overlay));if(t)for(let i of t.mount.overlay){let n=i.from+t.pos,r=i.to+t.pos;n>=s.from&&r<=s.to&&!e.ranges.some((t=>t.from<r&&t.to>n))&&e.ranges.push({from:n,to:r});}}l=!1;}else if(n&&(o=_(n.ranges,s.from,s.to)))l=2!=o;else if(!s.type.isAnonymous&&(r=this.nest(s,this.input))&&(s.from<s.to||!r.overlay)){s.tree||z(s);let o=t.findMounts(s.from,r.parser);if("function"==typeof r.overlay)e=new W(r.parser,r.overlay,o,this.inner.length,s.from,s.tree,e);else {let t=U(this.ranges,r.overlay||(s.from<s.to?[new i(s.from,s.to)]:[]));t.length&&Y(t),!t.length&&r.overlay||this.inner.push(new q(r.parser,t.length?r.parser.startParse(this.input,G(o,t),t):r.parser.startParse(""),r.overlay?r.overlay.map((t=>new i(t.from-s.from,t.to-s.from))):null,s.tree,t.length?t[0].from:s.from)),r.overlay?t.length&&(n={ranges:t,depth:0,prev:n}):l=!1;}}else e&&(a=e.predicate(s))&&(!0===a&&(a=new i(s.from,s.to)),a.from<a.to&&e.ranges.push(a));if(l&&s.firstChild())e&&e.depth++,n&&n.depth++;else for(;!s.nextSibling();){if(!s.parent())break t;if(e&&! --e.depth){let t=U(this.ranges,e.ranges);t.length&&(Y(t),this.inner.splice(e.index,0,new q(e.parser,e.parser.startParse(this.input,G(e.mounts,t),t),e.ranges.map((t=>new i(t.from-e.start,t.to-e.start))),e.target,t[0].from))),e=e.prev;}n&&! --n.depth&&(n=n.prev);}}}}function _(t,e,i){for(let n of t){if(n.from>=i)break;if(n.to>e)return n.from<=e&&n.to>=i?2:1}return 0}function E(t,e,i,n,s,r){if(e<i){let o=t.buffer[e+1];n.push(t.slice(e,i,o)),s.push(o-r);}}function z(t){let{node:e}=t,i=[],n=e.context.buffer;do{i.push(t.index),t.parent();}while(!t.tree);let s=t.tree,r=s.children.indexOf(n),a=s.children[r],l=a.buffer,h=[r];s.children[r]=function t(n,s,r,o,c,u){let f=i[u],d=[],p=[];E(a,n,f,d,p,o);let g=l[f+1],m=l[f+2];h.push(d.length);let w=u?t(f+4,l[f+3],a.set.types[l[f]],g,m-g,u-1):e.toTree();return d.push(w),p.push(g-o),E(a,l[f+3],s,d,p,o),new O(r,d,p,c)}(0,l.length,o.none,0,a.length,i.length-1);for(let e of h){let i=t.tree.children[e],n=t.tree.positions[e];t.yield(new m(i,n+t.from,e,t._tree));}}class V{constructor(t,e){this.offset=e,this.done=!1,this.cursor=t.cursor(c.IncludeAnonymous|c.IgnoreMounts);}moveTo(t){let{cursor:e}=this,i=t-this.offset;for(;!this.done&&e.from<i;)e.to>=t&&e.enter(i,1,c.IgnoreOverlays|c.ExcludeBuffers)||e.next(!1)||(this.done=!0);}hasNode(t){if(this.moveTo(t.from),!this.done&&this.cursor.from+this.offset==t.from&&this.cursor.tree)for(let e=this.cursor.tree;;){if(e==t.tree)return !0;if(!(e.children.length&&0==e.positions[0]&&e.children[0]instanceof O))break;e=e.children[0];}return !1}}class D{constructor(t){var e;if(this.fragments=t,this.curTo=0,this.fragI=0,t.length){let i=this.curFrag=t[0];this.curTo=null!==(e=i.tree.prop(M))&&void 0!==e?e:i.to,this.inner=new V(i.tree,-i.offset);}else this.curFrag=this.inner=null;}hasNode(t){for(;this.curFrag&&t.from>=this.curTo;)this.nextFrag();return this.curFrag&&this.curFrag.from<=t.from&&this.curTo>=t.to&&this.inner.hasNode(t)}nextFrag(){var t;if(this.fragI++,this.fragI==this.fragments.length)this.curFrag=this.inner=null;else {let e=this.curFrag=this.fragments[this.fragI];this.curTo=null!==(t=e.tree.prop(M))&&void 0!==t?t:e.to,this.inner=new V(e.tree,-e.offset);}}findMounts(t,e){var i;let s=[];if(this.inner){this.inner.cursor.moveTo(t,1);for(let t=this.inner.cursor.node;t;t=t.parent){let r=null===(i=t.tree)||void 0===i?void 0:i.prop(n.mounted);if(r&&r.parser==e)for(let e=this.fragI;e<this.fragments.length;e++){let i=this.fragments[e];if(i.from>=t.to)break;i.tree==this.curFrag.tree&&s.push({frag:i,pos:t.from-i.offset,mount:r});}}}return s}}function U(t,e){let n=null,s=e;for(let r=1,o=0;r<t.length;r++){let a=t[r-1].to,l=t[r].from;for(;o<s.length;o++){let t=s[o];if(t.from>=l)break;t.to<=a||(n||(s=n=e.slice()),t.from<a?(n[o]=new i(t.from,a),t.to>l&&n.splice(o+1,0,new i(l,t.to))):t.to>l?n[o--]=new i(l,t.to):n.splice(o--,1));}}return s}function N(t,e,n,s){let r=0,o=0,a=!1,l=!1,h=-1e9,c=[];for(;;){let O=r==t.length?1e9:a?t[r].to:t[r].from,u=o==e.length?1e9:l?e[o].to:e[o].from;if(a!=l){let t=Math.max(h,n),e=Math.min(O,u,s);t<e&&c.push(new i(t,e));}if(h=Math.min(O,u),1e9==h)break;O==h&&(a?(a=!1,r++):a=!0),u==h&&(l?(l=!1,o++):l=!0);}return c}function G(t,e){let n=[];for(let{pos:s,mount:r,frag:o}of t){let t=s+(r.overlay?r.overlay[0].from:0),a=t+r.tree.length,l=Math.max(o.from,t),h=Math.min(o.to,a);if(r.overlay){let a=N(e,r.overlay.map((t=>new i(t.from+s,t.to+s))),l,h);for(let e=0,i=l;;e++){let s=e==a.length,l=s?h:a[e].from;if(l>i&&n.push(new T(i,l,r.tree,-t,o.from>=i||o.openStart,o.to<=l||o.openEnd)),s)break;i=a[e].to;}}else n.push(new T(l,h,r.tree,-t,o.from>=t||o.openStart,o.to<=a||o.openEnd));}return n}class B{lineAt(t){if(t<0||t>this.length)throw new RangeError(`Invalid position ${t} in document of length ${this.length}`);return this.lineInner(t,!1,1,0)}line(t){if(t<1||t>this.lines)throw new RangeError(`Invalid line number ${t} in ${this.lines}-line document`);return this.lineInner(t,!0,1,0)}replace(t,e,i){[t,e]=it(this,t,e);let n=[];return this.decompose(0,t,n,2),i.length&&i.decompose(0,i.length,n,3),this.decompose(e,this.length,n,1),L.from(n,this.length-(e-t)+i.length)}append(t){return this.replace(this.length,this.length,t)}slice(t,e=this.length){[t,e]=it(this,t,e);let i=[];return this.decompose(t,e,i,0),L.from(i,e-t)}eq(t){if(t==this)return !0;if(t.length!=this.length||t.lines!=this.lines)return !1;let e=this.scanIdentical(t,1),i=this.length-this.scanIdentical(t,-1),n=new J(this),s=new J(t);for(let t=e,r=e;;){if(n.next(t),s.next(t),t=0,n.lineBreak!=s.lineBreak||n.done!=s.done||n.value!=s.value)return !1;if(r+=n.value.length,n.done||r>=i)return !0}}iter(t=1){return new J(this,t)}iterRange(t,e=this.length){return new K(this,t,e)}iterLines(t,e){let i;if(null==t)i=this.iter();else {null==e&&(e=this.lines+1);let n=this.line(t).from;i=this.iterRange(n,Math.max(n,e==this.lines+1?this.length:e<=1?0:this.line(e-1).to));}return new tt(i)}toString(){return this.sliceString(0)}toJSON(){let t=[];return this.flatten(t),t}constructor(){}static of(t){if(0==t.length)throw new RangeError("A document must have at least one line");return 1!=t.length||t[0]?t.length<=32?new I(t):L.from(I.split(t,[])):B.empty}}class I extends B{constructor(t,e=function(t){let e=-1;for(let i of t)e+=i.length+1;return e}(t)){super(),this.text=t,this.length=e;}get lines(){return this.text.length}get children(){return null}lineInner(t,e,i,n){for(let s=0;;s++){let r=this.text[s],o=n+r.length;if((e?i:o)>=t)return new et(n,o,i,r);n=o+1,i++;}}decompose(t,e,i,n){let s=t<=0&&e>=this.length?this:new I(H(this.text,t,e),Math.min(e,this.length)-Math.max(0,t));if(1&n){let t=i.pop(),e=F(s.text,t.text.slice(),0,s.length);if(e.length<=32)i.push(new I(e,t.length+s.length));else {let t=e.length>>1;i.push(new I(e.slice(0,t)),new I(e.slice(t)));}}else i.push(s);}replace(t,e,i){if(!(i instanceof I))return super.replace(t,e,i);[t,e]=it(this,t,e);let n=F(this.text,F(i.text,H(this.text,0,t)),e),s=this.length+i.length-(e-t);return n.length<=32?new I(n,s):L.from(I.split(n,[]),s)}sliceString(t,e=this.length,i="\n"){[t,e]=it(this,t,e);let n="";for(let s=0,r=0;s<=e&&r<this.text.length;r++){let o=this.text[r],a=s+o.length;s>t&&r&&(n+=i),t<a&&e>s&&(n+=o.slice(Math.max(0,t-s),e-s)),s=a+1;}return n}flatten(t){for(let e of this.text)t.push(e);}scanIdentical(){return 0}static split(t,e){let i=[],n=-1;for(let s of t)i.push(s),n+=s.length+1,32==i.length&&(e.push(new I(i,n)),i=[],n=-1);return n>-1&&e.push(new I(i,n)),e}}class L extends B{constructor(t,e){super(),this.children=t,this.length=e,this.lines=0;for(let e of t)this.lines+=e.lines;}lineInner(t,e,i,n){for(let s=0;;s++){let r=this.children[s],o=n+r.length,a=i+r.lines-1;if((e?a:o)>=t)return r.lineInner(t,e,i,n);n=o+1,i=a+1;}}decompose(t,e,i,n){for(let s=0,r=0;r<=e&&s<this.children.length;s++){let o=this.children[s],a=r+o.length;if(t<=a&&e>=r){let s=n&((r<=t?1:0)|(a>=e?2:0));r>=t&&a<=e&&!s?i.push(o):o.decompose(t-r,e-r,i,s);}r=a+1;}}replace(t,e,i){if([t,e]=it(this,t,e),i.lines<this.lines)for(let n=0,s=0;n<this.children.length;n++){let r=this.children[n],o=s+r.length;if(t>=s&&e<=o){let a=r.replace(t-s,e-s,i),l=this.lines-r.lines+a.lines;if(a.lines<l>>4&&a.lines>l>>6){let s=this.children.slice();return s[n]=a,new L(s,this.length-(e-t)+i.length)}return super.replace(s,o,a)}s=o+1;}return super.replace(t,e,i)}sliceString(t,e=this.length,i="\n"){[t,e]=it(this,t,e);let n="";for(let s=0,r=0;s<this.children.length&&r<=e;s++){let o=this.children[s],a=r+o.length;r>t&&s&&(n+=i),t<a&&e>r&&(n+=o.sliceString(t-r,e-r,i)),r=a+1;}return n}flatten(t){for(let e of this.children)e.flatten(t);}scanIdentical(t,e){if(!(t instanceof L))return 0;let i=0,[n,s,r,o]=e>0?[0,0,this.children.length,t.children.length]:[this.children.length-1,t.children.length-1,-1,-1];for(;;n+=e,s+=e){if(n==r||s==o)return i;let a=this.children[n],l=t.children[s];if(a!=l)return i+a.scanIdentical(l,e);i+=a.length+1;}}static from(t,e=t.reduce(((t,e)=>t+e.length+1),-1)){let i=0;for(let e of t)i+=e.lines;if(i<32){let i=[];for(let e of t)e.flatten(i);return new I(i,e)}let n=Math.max(32,i>>5),s=n<<1,r=n>>1,o=[],a=0,l=-1,h=[];function c(t){let e;if(t.lines>s&&t instanceof L)for(let e of t.children)c(e);else t.lines>r&&(a>r||!a)?(O(),o.push(t)):t instanceof I&&a&&(e=h[h.length-1])instanceof I&&t.lines+e.lines<=32?(a+=t.lines,l+=t.length+1,h[h.length-1]=new I(e.text.concat(t.text),e.length+1+t.length)):(a+t.lines>n&&O(),a+=t.lines,l+=t.length+1,h.push(t));}function O(){0!=a&&(o.push(1==h.length?h[0]:L.from(h,l)),l=-1,a=h.length=0);}for(let e of t)c(e);return O(),1==o.length?o[0]:new L(o,e)}}function F(t,e,i=0,n=1e9){for(let s=0,r=0,o=!0;r<t.length&&s<=n;r++){let a=t[r],l=s+a.length;l>=i&&(l>n&&(a=a.slice(0,n-s)),s<i&&(a=a.slice(i-s)),o?(e[e.length-1]+=a,o=!1):e.push(a)),s=l+1;}return e}function H(t,e,i){return F(t,[""],e,i)}B.empty=new I([""],0);class J{constructor(t,e=1){this.dir=e,this.done=!1,this.lineBreak=!1,this.value="",this.nodes=[t],this.offsets=[e>0?1:(t instanceof I?t.text.length:t.children.length)<<1];}nextInner(t,e){for(this.done=this.lineBreak=!1;;){let i=this.nodes.length-1,n=this.nodes[i],s=this.offsets[i],r=s>>1,o=n instanceof I?n.text.length:n.children.length;if(r==(e>0?o:0)){if(0==i)return this.done=!0,this.value="",this;e>0&&this.offsets[i-1]++,this.nodes.pop(),this.offsets.pop();}else if((1&s)==(e>0?0:1)){if(this.offsets[i]+=e,0==t)return this.lineBreak=!0,this.value="\n",this;t--;}else if(n instanceof I){let s=n.text[r+(e<0?-1:0)];if(this.offsets[i]+=e,s.length>Math.max(0,t))return this.value=0==t?s:e>0?s.slice(t):s.slice(0,s.length-t),this;t-=s.length;}else {let s=n.children[r+(e<0?-1:0)];t>s.length?(t-=s.length,this.offsets[i]+=e):(e<0&&this.offsets[i]--,this.nodes.push(s),this.offsets.push(e>0?1:(s instanceof I?s.text.length:s.children.length)<<1));}}}next(t=0){return t<0&&(this.nextInner(-t,-this.dir),t=this.value.length),this.nextInner(t,this.dir)}}class K{constructor(t,e,i){this.value="",this.done=!1,this.cursor=new J(t,e>i?-1:1),this.pos=e>i?t.length:0,this.from=Math.min(e,i),this.to=Math.max(e,i);}nextInner(t,e){if(e<0?this.pos<=this.from:this.pos>=this.to)return this.value="",this.done=!0,this;t+=Math.max(0,e<0?this.pos-this.to:this.from-this.pos);let i=e<0?this.pos-this.from:this.to-this.pos;t>i&&(t=i),i-=t;let{value:n}=this.cursor.next(t);return this.pos+=(n.length+t)*e,this.value=n.length<=i?n:e<0?n.slice(n.length-i):n.slice(0,i),this.done=!this.value,this}next(t=0){return t<0?t=Math.max(t,this.from-this.pos):t>0&&(t=Math.min(t,this.to-this.pos)),this.nextInner(t,this.cursor.dir)}get lineBreak(){return this.cursor.lineBreak&&""!=this.value}}class tt{constructor(t){this.inner=t,this.afterBreak=!0,this.value="",this.done=!1;}next(t=0){let{done:e,lineBreak:i,value:n}=this.inner.next(t);return e&&this.afterBreak?(this.value="",this.afterBreak=!1):e?(this.done=!0,this.value=""):i?this.afterBreak?this.value="":(this.afterBreak=!0,this.next()):(this.value=n,this.afterBreak=!1),this}get lineBreak(){return !1}}"undefined"!=typeof Symbol&&(B.prototype[Symbol.iterator]=function(){return this.iter()},J.prototype[Symbol.iterator]=K.prototype[Symbol.iterator]=tt.prototype[Symbol.iterator]=function(){return this});class et{constructor(t,e,i,n){this.from=t,this.to=e,this.number=i,this.text=n;}get length(){return this.to-this.from}}function it(t,e,i){return [e=Math.max(0,Math.min(t.length,e)),Math.max(e,Math.min(t.length,i))]}let nt="lc,34,7n,7,7b,19,,,,2,,2,,,20,b,1c,l,g,,2t,7,2,6,2,2,,4,z,,u,r,2j,b,1m,9,9,,o,4,,9,,3,,5,17,3,3b,f,,w,1j,,,,4,8,4,,3,7,a,2,t,,1m,,,,2,4,8,,9,,a,2,q,,2,2,1l,,4,2,4,2,2,3,3,,u,2,3,,b,2,1l,,4,5,,2,4,,k,2,m,6,,,1m,,,2,,4,8,,7,3,a,2,u,,1n,,,,c,,9,,14,,3,,1l,3,5,3,,4,7,2,b,2,t,,1m,,2,,2,,3,,5,2,7,2,b,2,s,2,1l,2,,,2,4,8,,9,,a,2,t,,20,,4,,2,3,,,8,,29,,2,7,c,8,2q,,2,9,b,6,22,2,r,,,,,,1j,e,,5,,2,5,b,,10,9,,2u,4,,6,,2,2,2,p,2,4,3,g,4,d,,2,2,6,,f,,jj,3,qa,3,t,3,t,2,u,2,1s,2,,7,8,,2,b,9,,19,3,3b,2,y,,3a,3,4,2,9,,6,3,63,2,2,,1m,,,7,,,,,2,8,6,a,2,,1c,h,1r,4,1c,7,,,5,,14,9,c,2,w,4,2,2,,3,1k,,,2,3,,,3,1m,8,2,2,48,3,,d,,7,4,,6,,3,2,5i,1m,,5,ek,,5f,x,2da,3,3x,,2o,w,fe,6,2x,2,n9w,4,,a,w,2,28,2,7k,,3,,4,,p,2,5,,47,2,q,i,d,,12,8,p,b,1a,3,1c,,2,4,2,2,13,,1v,6,2,2,2,2,c,,8,,1b,,1f,,,3,2,2,5,2,,,16,2,8,,6m,,2,,4,,fn4,,kh,g,g,g,a6,2,gt,,6a,,45,5,1ae,3,,2,5,4,14,3,4,,4l,2,fx,4,ar,2,49,b,4w,,1i,f,1k,3,1d,4,2,2,1x,3,10,5,,8,1q,,c,2,1g,9,a,4,2,,2n,3,2,,,2,6,,4g,,3,8,l,2,1l,2,,,,,m,,e,7,3,5,5f,8,2,3,,,n,,29,,2,6,,,2,,,2,,2,6j,,2,4,6,2,,2,r,2,2d,8,2,,,2,2y,,,,2,6,,,2t,3,2,4,,5,77,9,,2,6t,,a,2,,,4,,40,4,2,2,4,,w,a,14,6,2,4,8,,9,6,2,3,1a,d,,2,ba,7,,6,,,2a,m,2,7,,2,,2,3e,6,3,,,2,,7,,,20,2,3,,,,9n,2,f0b,5,1n,7,t4,,1r,4,29,,f5k,2,43q,,,3,4,5,8,8,2,7,u,4,44,3,1iz,1j,4,1e,8,,e,,m,5,,f,11s,7,,h,2,7,,2,,5,79,7,c5,4,15s,7,31,7,240,5,gx7k,2o,3k,6o".split(",").map((t=>t?parseInt(t,36):1));for(let t=1;t<nt.length;t++)nt[t]+=nt[t-1];function st(t){for(let e=1;e<nt.length;e+=2)if(nt[e]>t)return nt[e-1]<=t;return !1}function rt(t){return t>=127462&&t<=127487}const ot=8205;function at(t,e,i=!0,n=!0){return (i?lt:ht)(t,e,n)}function lt(t,e,i){if(e==t.length)return e;e&&ct(t.charCodeAt(e))&&Ot(t.charCodeAt(e-1))&&e--;let n=ut(t,e);for(e+=dt(n);e<t.length;){let s=ut(t,e);if(n==ot||s==ot||i&&st(s))e+=dt(s),n=s;else {if(!rt(s))break;{let i=0,n=e-2;for(;n>=0&&rt(ut(t,n));)i++,n-=2;if(i%2==0)break;e+=2;}}}return e}function ht(t,e,i){for(;e>0;){let n=lt(t,e-2,i);if(n<e)return n;e--;}return 0}function ct(t){return t>=56320&&t<57344}function Ot(t){return t>=55296&&t<56320}function ut(t,e){let i=t.charCodeAt(e);if(!Ot(i)||e+1==t.length)return i;let n=t.charCodeAt(e+1);return ct(n)?n-56320+(i-55296<<10)+65536:i}function ft(t){return t<=65535?String.fromCharCode(t):(t-=65536,String.fromCharCode(55296+(t>>10),56320+(1023&t)))}function dt(t){return t<65536?1:2}const pt=/\r\n?|\n/;var gt=function(t){return t[t.Simple=0]="Simple",t[t.TrackDel=1]="TrackDel",t[t.TrackBefore=2]="TrackBefore",t[t.TrackAfter=3]="TrackAfter",t}(gt||(gt={}));class mt{constructor(t){this.sections=t;}get length(){let t=0;for(let e=0;e<this.sections.length;e+=2)t+=this.sections[e];return t}get newLength(){let t=0;for(let e=0;e<this.sections.length;e+=2){let i=this.sections[e+1];t+=i<0?this.sections[e]:i;}return t}get empty(){return 0==this.sections.length||2==this.sections.length&&this.sections[1]<0}iterGaps(t){for(let e=0,i=0,n=0;e<this.sections.length;){let s=this.sections[e++],r=this.sections[e++];r<0?(t(i,n,s),n+=s):n+=r,i+=s;}}iterChangedRanges(t,e=!1){Qt(this,t,e);}get invertedDesc(){let t=[];for(let e=0;e<this.sections.length;){let i=this.sections[e++],n=this.sections[e++];n<0?t.push(i,n):t.push(n,i);}return new mt(t)}composeDesc(t){return this.empty?t:t.empty?this:yt(this,t)}mapDesc(t,e=!1){return t.empty?this:xt(this,t,e)}mapPos(t,e=-1,i=gt.Simple){let n=0,s=0;for(let r=0;r<this.sections.length;){let o=this.sections[r++],a=this.sections[r++],l=n+o;if(a<0){if(l>t)return s+(t-n);s+=o;}else {if(i!=gt.Simple&&l>=t&&(i==gt.TrackDel&&n<t&&l>t||i==gt.TrackBefore&&n<t||i==gt.TrackAfter&&l>t))return null;if(l>t||l==t&&e<0&&!o)return t==n||e<0?s:s+a;s+=a;}n=l;}if(t>n)throw new RangeError(`Position ${t} is out of range for changeset of length ${n}`);return s}touchesRange(t,e=t){for(let i=0,n=0;i<this.sections.length&&n<=e;){let s=n+this.sections[i++];if(this.sections[i++]>=0&&n<=e&&s>=t)return !(n<t&&s>e)||"cover";n=s;}return !1}toString(){let t="";for(let e=0;e<this.sections.length;){let i=this.sections[e++],n=this.sections[e++];t+=(t?" ":"")+i+(n>=0?":"+n:"");}return t}toJSON(){return this.sections}static fromJSON(t){if(!Array.isArray(t)||t.length%2||t.some((t=>"number"!=typeof t)))throw new RangeError("Invalid JSON representation of ChangeDesc");return new mt(t)}static create(t){return new mt(t)}}class wt extends mt{constructor(t,e){super(t),this.inserted=e;}apply(t){if(this.length!=t.length)throw new RangeError("Applying change set to a document with the wrong length");return Qt(this,((e,i,n,s,r)=>t=t.replace(n,n+(i-e),r)),!1),t}mapDesc(t,e=!1){return xt(this,t,e,!0)}invert(t){let e=this.sections.slice(),i=[];for(let n=0,s=0;n<e.length;n+=2){let r=e[n],o=e[n+1];if(o>=0){e[n]=o,e[n+1]=r;let a=n>>1;for(;i.length<a;)i.push(B.empty);i.push(r?t.slice(s,s+r):B.empty);}s+=r;}return new wt(e,i)}compose(t){return this.empty?t:t.empty?this:yt(this,t,!0)}map(t,e=!1){return t.empty?this:xt(this,t,e,!0)}iterChanges(t,e=!1){Qt(this,t,e);}get desc(){return mt.create(this.sections)}filter(t){let e=[],i=[],n=[],s=new vt(this);t:for(let r=0,o=0;;){let a=r==t.length?1e9:t[r++];for(;o<a||o==a&&0==s.len;){if(s.done)break t;let t=Math.min(s.len,a-o);bt(n,t,-1);let r=-1==s.ins?-1:0==s.off?s.ins:0;bt(e,t,r),r>0&&St(i,e,s.text),s.forward(t),o+=t;}let l=t[r++];for(;o<l;){if(s.done)break t;let t=Math.min(s.len,l-o);bt(e,t,-1),bt(n,t,-1==s.ins?-1:0==s.off?s.ins:0),s.forward(t),o+=t;}}return {changes:new wt(e,i),filtered:mt.create(n)}}toJSON(){let t=[];for(let e=0;e<this.sections.length;e+=2){let i=this.sections[e],n=this.sections[e+1];n<0?t.push(i):0==n?t.push([i]):t.push([i].concat(this.inserted[e>>1].toJSON()));}return t}static of(t,e,i){let n=[],s=[],r=0,o=null;function a(t=!1){if(!t&&!n.length)return;r<e&&bt(n,e-r,-1);let i=new wt(n,s);o=o?o.compose(i.map(o)):i,n=[],s=[],r=0;}return function t(l){if(Array.isArray(l))for(let e of l)t(e);else if(l instanceof wt){if(l.length!=e)throw new RangeError(`Mismatched change set length (got ${l.length}, expected ${e})`);a(),o=o?o.compose(l.map(o)):l;}else {let{from:t,to:o=t,insert:h}=l;if(t>o||t<0||o>e)throw new RangeError(`Invalid change range ${t} to ${o} (in doc of length ${e})`);let c=h?"string"==typeof h?B.of(h.split(i||pt)):h:B.empty,O=c.length;if(t==o&&0==O)return;t<r&&a(),t>r&&bt(n,t-r,-1),bt(n,o-t,O),St(s,n,c),r=o;}}(t),a(!o),o}static empty(t){return new wt(t?[t,-1]:[],[])}static fromJSON(t){if(!Array.isArray(t))throw new RangeError("Invalid JSON representation of ChangeSet");let e=[],i=[];for(let n=0;n<t.length;n++){let s=t[n];if("number"==typeof s)e.push(s,-1);else {if(!Array.isArray(s)||"number"!=typeof s[0]||s.some(((t,e)=>e&&"string"!=typeof t)))throw new RangeError("Invalid JSON representation of ChangeSet");if(1==s.length)e.push(s[0],0);else {for(;i.length<n;)i.push(B.empty);i[n]=B.of(s.slice(1)),e.push(s[0],i[n].length);}}}return new wt(e,i)}static createSet(t,e){return new wt(t,e)}}function bt(t,e,i,n=!1){if(0==e&&i<=0)return;let s=t.length-2;s>=0&&i<=0&&i==t[s+1]?t[s]+=e:0==e&&0==t[s]?t[s+1]+=i:n?(t[s]+=e,t[s+1]+=i):t.push(e,i);}function St(t,e,i){if(0==i.length)return;let n=e.length-2>>1;if(n<t.length)t[t.length-1]=t[t.length-1].append(i);else {for(;t.length<n;)t.push(B.empty);t.push(i);}}function Qt(t,e,i){let n=t.inserted;for(let s=0,r=0,o=0;o<t.sections.length;){let a=t.sections[o++],l=t.sections[o++];if(l<0)s+=a,r+=a;else {let h=s,c=r,O=B.empty;for(;h+=a,c+=l,l&&n&&(O=O.append(n[o-2>>1])),!(i||o==t.sections.length||t.sections[o+1]<0);)a=t.sections[o++],l=t.sections[o++];e(s,h,r,c,O),s=h,r=c;}}}function xt(t,e,i,n=!1){let s=[],r=n?[]:null,o=new vt(t),a=new vt(e);for(let t=-1;;)if(-1==o.ins&&-1==a.ins){let t=Math.min(o.len,a.len);bt(s,t,-1),o.forward(t),a.forward(t);}else if(a.ins>=0&&(o.ins<0||t==o.i||0==o.off&&(a.len<o.len||a.len==o.len&&!i))){let e=a.len;for(bt(s,a.ins,-1);e;){let i=Math.min(o.len,e);o.ins>=0&&t<o.i&&o.len<=i&&(bt(s,0,o.ins),r&&St(r,s,o.text),t=o.i),o.forward(i),e-=i;}a.next();}else {if(!(o.ins>=0)){if(o.done&&a.done)return r?wt.createSet(s,r):mt.create(s);throw new Error("Mismatched change set lengths")}{let e=0,i=o.len;for(;i;)if(-1==a.ins){let t=Math.min(i,a.len);e+=t,i-=t,a.forward(t);}else {if(!(0==a.ins&&a.len<i))break;i-=a.len,a.next();}bt(s,e,t<o.i?o.ins:0),r&&t<o.i&&St(r,s,o.text),t=o.i,o.forward(o.len-i);}}}function yt(t,e,i=!1){let n=[],s=i?[]:null,r=new vt(t),o=new vt(e);for(let t=!1;;){if(r.done&&o.done)return s?wt.createSet(n,s):mt.create(n);if(0==r.ins)bt(n,r.len,0,t),r.next();else if(0!=o.len||o.done){if(r.done||o.done)throw new Error("Mismatched change set lengths");{let e=Math.min(r.len2,o.len),i=n.length;if(-1==r.ins){let i=-1==o.ins?-1:o.off?0:o.ins;bt(n,e,i,t),s&&i&&St(s,n,o.text);}else -1==o.ins?(bt(n,r.off?0:r.len,e,t),s&&St(s,n,r.textBit(e))):(bt(n,r.off?0:r.len,o.off?0:o.ins,t),s&&!o.off&&St(s,n,o.text));t=(r.ins>e||o.ins>=0&&o.len>e)&&(t||n.length>i),r.forward2(e),o.forward(e);}}else bt(n,0,o.ins,t),s&&St(s,n,o.text),o.next();}}class vt{constructor(t){this.set=t,this.i=0,this.next();}next(){let{sections:t}=this.set;this.i<t.length?(this.len=t[this.i++],this.ins=t[this.i++]):(this.len=0,this.ins=-2),this.off=0;}get done(){return -2==this.ins}get len2(){return this.ins<0?this.len:this.ins}get text(){let{inserted:t}=this.set,e=this.i-2>>1;return e>=t.length?B.empty:t[e]}textBit(t){let{inserted:e}=this.set,i=this.i-2>>1;return i>=e.length&&!t?B.empty:e[i].slice(this.off,null==t?void 0:this.off+t)}forward(t){t==this.len?this.next():(this.len-=t,this.off+=t);}forward2(t){-1==this.ins?this.forward(t):t==this.ins?this.next():(this.ins-=t,this.off+=t);}}class Pt{constructor(t,e,i){this.from=t,this.to=e,this.flags=i;}get anchor(){return 32&this.flags?this.to:this.from}get head(){return 32&this.flags?this.from:this.to}get empty(){return this.from==this.to}get assoc(){return 8&this.flags?-1:16&this.flags?1:0}get bidiLevel(){let t=7&this.flags;return 7==t?null:t}get goalColumn(){let t=this.flags>>6;return 16777215==t?void 0:t}map(t,e=-1){let i,n;return this.empty?i=n=t.mapPos(this.from,e):(i=t.mapPos(this.from,1),n=t.mapPos(this.to,-1)),i==this.from&&n==this.to?this:new Pt(i,n,this.flags)}extend(t,e=t){if(t<=this.anchor&&e>=this.anchor)return kt.range(t,e);let i=Math.abs(t-this.anchor)>Math.abs(e-this.anchor)?t:e;return kt.range(this.anchor,i)}eq(t,e=!1){return !(this.anchor!=t.anchor||this.head!=t.head||e&&this.empty&&this.assoc!=t.assoc)}toJSON(){return {anchor:this.anchor,head:this.head}}static fromJSON(t){if(!t||"number"!=typeof t.anchor||"number"!=typeof t.head)throw new RangeError("Invalid JSON representation for SelectionRange");return kt.range(t.anchor,t.head)}static create(t,e,i){return new Pt(t,e,i)}}class kt{constructor(t,e){this.ranges=t,this.mainIndex=e;}map(t,e=-1){return t.empty?this:kt.create(this.ranges.map((i=>i.map(t,e))),this.mainIndex)}eq(t,e=!1){if(this.ranges.length!=t.ranges.length||this.mainIndex!=t.mainIndex)return !1;for(let i=0;i<this.ranges.length;i++)if(!this.ranges[i].eq(t.ranges[i],e))return !1;return !0}get main(){return this.ranges[this.mainIndex]}asSingle(){return 1==this.ranges.length?this:new kt([this.main],0)}addRange(t,e=!0){return kt.create([t].concat(this.ranges),e?0:this.mainIndex+1)}replaceRange(t,e=this.mainIndex){let i=this.ranges.slice();return i[e]=t,kt.create(i,this.mainIndex)}toJSON(){return {ranges:this.ranges.map((t=>t.toJSON())),main:this.mainIndex}}static fromJSON(t){if(!t||!Array.isArray(t.ranges)||"number"!=typeof t.main||t.main>=t.ranges.length)throw new RangeError("Invalid JSON representation for EditorSelection");return new kt(t.ranges.map((t=>Pt.fromJSON(t))),t.main)}static single(t,e=t){return new kt([kt.range(t,e)],0)}static create(t,e=0){if(0==t.length)throw new RangeError("A selection needs at least one range");for(let i=0,n=0;n<t.length;n++){let s=t[n];if(s.empty?s.from<=i:s.from<i)return kt.normalized(t.slice(),e);i=s.to;}return new kt(t,e)}static cursor(t,e=0,i,n){return Pt.create(t,t,(0==e?0:e<0?8:16)|(null==i?7:Math.min(6,i))|(null!=n?n:16777215)<<6)}static range(t,e,i,n){let s=(null!=i?i:16777215)<<6|(null==n?7:Math.min(6,n));return e<t?Pt.create(e,t,48|s):Pt.create(t,e,(e>t?8:0)|s)}static normalized(t,e=0){let i=t[e];t.sort(((t,e)=>t.from-e.from)),e=t.indexOf(i);for(let i=1;i<t.length;i++){let n=t[i],s=t[i-1];if(n.empty?n.from<=s.to:n.from<s.to){let r=s.from,o=Math.max(n.to,s.to);i<=e&&e--,t.splice(--i,2,n.anchor>n.head?kt.range(o,r):kt.range(r,o));}}return new kt(t,e)}}function $t(t,e){for(let i of t.ranges)if(i.to>e)throw new RangeError("Selection points outside of document")}let Zt=0;class Xt{constructor(t,e,i,n,s){this.combine=t,this.compareInput=e,this.compare=i,this.isStatic=n,this.id=Zt++,this.default=t([]),this.extensions="function"==typeof s?s(this):s;}get reader(){return this}static define(t={}){return new Xt(t.combine||(t=>t),t.compareInput||((t,e)=>t===e),t.compare||(t.combine?(t,e)=>t===e:Tt),!!t.static,t.enables)}of(t){return new Rt([],this,0,t)}compute(t,e){if(this.isStatic)throw new Error("Can't compute a static facet");return new Rt(t,this,1,e)}computeN(t,e){if(this.isStatic)throw new Error("Can't compute a static facet");return new Rt(t,this,2,e)}from(t,e){return e||(e=t=>t),this.compute([t],(i=>e(i.field(t))))}}function Tt(t,e){return t==e||t.length==e.length&&t.every(((t,i)=>t===e[i]))}class Rt{constructor(t,e,i,n){this.dependencies=t,this.facet=e,this.type=i,this.value=n,this.id=Zt++;}dynamicSlot(t){var e;let i=this.value,n=this.facet.compareInput,s=this.id,r=t[s]>>1,o=2==this.type,a=!1,l=!1,h=[];for(let i of this.dependencies)"doc"==i?a=!0:"selection"==i?l=!0:1&(null!==(e=t[i.id])&&void 0!==e?e:1)||h.push(t[i.id]);return {create:t=>(t.values[r]=i(t),1),update(t,e){if(a&&e.docChanged||l&&(e.docChanged||e.selection)||Ct(t,h)){let e=i(t);if(o?!At(e,t.values[r],n):!n(e,t.values[r]))return t.values[r]=e,1}return 0},reconfigure:(t,e)=>{let a,l=e.config.address[s];if(null!=l){let s=It(e,l);if(this.dependencies.every((i=>i instanceof Xt?e.facet(i)===t.facet(i):!(i instanceof Wt)||e.field(i,!1)==t.field(i,!1)))||(o?At(a=i(t),s,n):n(a=i(t),s)))return t.values[r]=s,0}else a=i(t);return t.values[r]=a,1}}}}function At(t,e,i){if(t.length!=e.length)return !1;for(let n=0;n<t.length;n++)if(!i(t[n],e[n]))return !1;return !0}function Ct(t,e){let i=!1;for(let n of e)1&Bt(t,n)&&(i=!0);return i}function qt(t,e,i){let n=i.map((e=>t[e.id])),s=i.map((t=>t.type)),r=n.filter((t=>!(1&t))),o=t[e.id]>>1;function a(t){let i=[];for(let e=0;e<n.length;e++){let r=It(t,n[e]);if(2==s[e])for(let t of r)i.push(t);else i.push(r);}return e.combine(i)}return {create(t){for(let e of n)Bt(t,e);return t.values[o]=a(t),1},update(t,i){if(!Ct(t,r))return 0;let n=a(t);return e.compare(n,t.values[o])?0:(t.values[o]=n,1)},reconfigure(t,s){let r=Ct(t,n),l=s.config.facets[e.id],h=s.facet(e);if(l&&!r&&Tt(i,l))return t.values[o]=h,0;let c=a(t);return e.compare(c,h)?(t.values[o]=h,0):(t.values[o]=c,1)}}}const Yt=Xt.define({static:!0});class Wt{constructor(t,e,i,n,s){this.id=t,this.createF=e,this.updateF=i,this.compareF=n,this.spec=s,this.provides=void 0;}static define(t){let e=new Wt(Zt++,t.create,t.update,t.compare||((t,e)=>t===e),t);return t.provide&&(e.provides=t.provide(e)),e}create(t){let e=t.facet(Yt).find((t=>t.field==this));return ((null==e?void 0:e.create)||this.createF)(t)}slot(t){let e=t[this.id]>>1;return {create:t=>(t.values[e]=this.create(t),1),update:(t,i)=>{let n=t.values[e],s=this.updateF(n,i);return this.compareF(n,s)?0:(t.values[e]=s,1)},reconfigure:(t,i)=>null!=i.config.address[this.id]?(t.values[e]=i.field(this),0):(t.values[e]=this.create(t),1)}}init(t){return [this,Yt.of({field:this,create:t})]}get extension(){return this}}const Mt=4,jt=3,_t=2,Et=1;function zt(t){return e=>new Dt(e,t)}const Vt={highest:zt(0),high:zt(Et),default:zt(_t),low:zt(jt),lowest:zt(Mt)};class Dt{constructor(t,e){this.inner=t,this.prec=e;}}class Ut{of(t){return new Nt(this,t)}reconfigure(t){return Ut.reconfigure.of({compartment:this,extension:t})}get(t){return t.config.compartments.get(this)}}class Nt{constructor(t,e){this.compartment=t,this.inner=e;}}class Gt{constructor(t,e,i,n,s,r){for(this.base=t,this.compartments=e,this.dynamicSlots=i,this.address=n,this.staticValues=s,this.facets=r,this.statusTemplate=[];this.statusTemplate.length<i.length;)this.statusTemplate.push(0);}staticFacet(t){let e=this.address[t.id];return null==e?t.default:this.staticValues[e>>1]}static resolve(t,e,i){let n=[],s=Object.create(null),r=new Map;for(let i of function(t,e,i){let n=[[],[],[],[],[]],s=new Map;function r(t,o){let a=s.get(t);if(null!=a){if(a<=o)return;let e=n[a].indexOf(t);e>-1&&n[a].splice(e,1),t instanceof Nt&&i.delete(t.compartment);}if(s.set(t,o),Array.isArray(t))for(let e of t)r(e,o);else if(t instanceof Nt){if(i.has(t.compartment))throw new RangeError("Duplicate use of compartment in extensions");let n=e.get(t.compartment)||t.inner;i.set(t.compartment,n),r(n,o);}else if(t instanceof Dt)r(t.inner,t.prec);else if(t instanceof Wt)n[o].push(t),t.provides&&r(t.provides,o);else if(t instanceof Rt)n[o].push(t),t.facet.extensions&&r(t.facet.extensions,_t);else {let e=t.extension;if(!e)throw new Error(`Unrecognized extension value in extension set (${t}). This sometimes happens because multiple instances of @codemirror/state are loaded, breaking instanceof checks.`);r(e,o);}}return r(t,_t),n.reduce(((t,e)=>t.concat(e)))}(t,e,r))i instanceof Wt?n.push(i):(s[i.facet.id]||(s[i.facet.id]=[])).push(i);let o=Object.create(null),a=[],l=[];for(let t of n)o[t.id]=l.length<<1,l.push((e=>t.slot(e)));let h=null==i?void 0:i.config.facets;for(let t in s){let e=s[t],n=e[0].facet,r=h&&h[t]||[];if(e.every((t=>0==t.type)))if(o[n.id]=a.length<<1|1,Tt(r,e))a.push(i.facet(n));else {let t=n.combine(e.map((t=>t.value)));a.push(i&&n.compare(t,i.facet(n))?i.facet(n):t);}else {for(let t of e)0==t.type?(o[t.id]=a.length<<1|1,a.push(t.value)):(o[t.id]=l.length<<1,l.push((e=>t.dynamicSlot(e))));o[n.id]=l.length<<1,l.push((t=>qt(t,n,e)));}}let c=l.map((t=>t(o)));return new Gt(t,r,c,o,a,s)}}function Bt(t,e){if(1&e)return 2;let i=e>>1,n=t.status[i];if(4==n)throw new Error("Cyclic dependency between fields and/or facets");if(2&n)return n;t.status[i]=4;let s=t.computeSlot(t,t.config.dynamicSlots[i]);return t.status[i]=2|s}function It(t,e){return 1&e?t.config.staticValues[e>>1]:t.values[e>>1]}const Lt=Xt.define(),Ft=Xt.define({combine:t=>t.some((t=>t)),static:!0}),Ht=Xt.define({combine:t=>t.length?t[0]:void 0,static:!0}),Jt=Xt.define(),Kt=Xt.define(),te=Xt.define(),ee=Xt.define({combine:t=>!!t.length&&t[0]});class ie{constructor(t,e){this.type=t,this.value=e;}static define(){return new ne}}class ne{of(t){return new ie(this,t)}}class se{constructor(t){this.map=t;}of(t){return new re(this,t)}}class re{constructor(t,e){this.type=t,this.value=e;}map(t){let e=this.type.map(this.value,t);return void 0===e?void 0:e==this.value?this:new re(this.type,e)}is(t){return this.type==t}static define(t={}){return new se(t.map||(t=>t))}static mapEffects(t,e){if(!t.length)return t;let i=[];for(let n of t){let t=n.map(e);t&&i.push(t);}return i}}re.reconfigure=re.define(),re.appendConfig=re.define();class oe{constructor(t,e,i,n,s,r){this.startState=t,this.changes=e,this.selection=i,this.effects=n,this.annotations=s,this.scrollIntoView=r,this._doc=null,this._state=null,i&&$t(i,e.newLength),s.some((t=>t.type==oe.time))||(this.annotations=s.concat(oe.time.of(Date.now())));}static create(t,e,i,n,s,r){return new oe(t,e,i,n,s,r)}get newDoc(){return this._doc||(this._doc=this.changes.apply(this.startState.doc))}get newSelection(){return this.selection||this.startState.selection.map(this.changes)}get state(){return this._state||this.startState.applyTransaction(this),this._state}annotation(t){for(let e of this.annotations)if(e.type==t)return e.value}get docChanged(){return !this.changes.empty}get reconfigured(){return this.startState.config!=this.state.config}isUserEvent(t){let e=this.annotation(oe.userEvent);return !(!e||!(e==t||e.length>t.length&&e.slice(0,t.length)==t&&"."==e[t.length]))}}function ae(t,e){let i=[];for(let n=0,s=0;;){let r,o;if(n<t.length&&(s==e.length||e[s]>=t[n]))r=t[n++],o=t[n++];else {if(!(s<e.length))return i;r=e[s++],o=e[s++];}!i.length||i[i.length-1]<r?i.push(r,o):i[i.length-1]<o&&(i[i.length-1]=o);}}function le(t,e,i){var n;let s,r,o;return i?(s=e.changes,r=wt.empty(e.changes.length),o=t.changes.compose(e.changes)):(s=e.changes.map(t.changes),r=t.changes.mapDesc(e.changes,!0),o=t.changes.compose(s)),{changes:o,selection:e.selection?e.selection.map(r):null===(n=t.selection)||void 0===n?void 0:n.map(s),effects:re.mapEffects(t.effects,s).concat(re.mapEffects(e.effects,r)),annotations:t.annotations.length?t.annotations.concat(e.annotations):e.annotations,scrollIntoView:t.scrollIntoView||e.scrollIntoView}}function he(t,e,i){let n=e.selection,s=ue(e.annotations);return e.userEvent&&(s=s.concat(oe.userEvent.of(e.userEvent))),{changes:e.changes instanceof wt?e.changes:wt.of(e.changes||[],i,t.facet(Ht)),selection:n&&(n instanceof kt?n:kt.single(n.anchor,n.head)),effects:ue(e.effects),annotations:s,scrollIntoView:!!e.scrollIntoView}}function ce(t,e,i){let n=he(t,e.length?e[0]:{},t.doc.length);e.length&&!1===e[0].filter&&(i=!1);for(let s=1;s<e.length;s++){!1===e[s].filter&&(i=!1);let r=!!e[s].sequential;n=le(n,he(t,e[s],r?n.changes.newLength:t.doc.length),r);}let s=oe.create(t,n.changes,n.selection,n.effects,n.annotations,n.scrollIntoView);return function(t){let e=t.startState,i=e.facet(te),n=t;for(let s=i.length-1;s>=0;s--){let r=i[s](t);r&&Object.keys(r).length&&(n=le(n,he(e,r,t.changes.newLength),!0));}return n==t?t:oe.create(e,t.changes,t.selection,n.effects,n.annotations,n.scrollIntoView)}(i?function(t){let e=t.startState,i=!0;for(let n of e.facet(Jt)){let e=n(t);if(!1===e){i=!1;break}Array.isArray(e)&&(i=!0===i?e:ae(i,e));}if(!0!==i){let n,s;if(!1===i)s=t.changes.invertedDesc,n=wt.empty(e.doc.length);else {let e=t.changes.filter(i);n=e.changes,s=e.filtered.mapDesc(e.changes).invertedDesc;}t=oe.create(e,n,t.selection&&t.selection.map(s),re.mapEffects(t.effects,s),t.annotations,t.scrollIntoView);}let n=e.facet(Kt);for(let i=n.length-1;i>=0;i--){let s=n[i](t);t=s instanceof oe?s:Array.isArray(s)&&1==s.length&&s[0]instanceof oe?s[0]:ce(e,ue(s),!1);}return t}(s):s)}oe.time=ie.define(),oe.userEvent=ie.define(),oe.addToHistory=ie.define(),oe.remote=ie.define();const Oe=[];function ue(t){return null==t?Oe:Array.isArray(t)?t:[t]}var fe=function(t){return t[t.Word=0]="Word",t[t.Space=1]="Space",t[t.Other=2]="Other",t}(fe||(fe={}));const de=/[\u00df\u0587\u0590-\u05f4\u0600-\u06ff\u3040-\u309f\u30a0-\u30ff\u3400-\u4db5\u4e00-\u9fcc\uac00-\ud7af]/;let pe;try{pe=new RegExp("[\\p{Alphabetic}\\p{Number}_]","u");}catch(t){}function ge(t){return e=>{if(!/\S/.test(e))return fe.Space;if(function(t){if(pe)return pe.test(t);for(let e=0;e<t.length;e++){let i=t[e];if(/\w/.test(i)||i>""&&(i.toUpperCase()!=i.toLowerCase()||de.test(i)))return !0}return !1}(e))return fe.Word;for(let i=0;i<t.length;i++)if(e.indexOf(t[i])>-1)return fe.Word;return fe.Other}}class me{constructor(t,e,i,n,s,r){this.config=t,this.doc=e,this.selection=i,this.values=n,this.status=t.statusTemplate.slice(),this.computeSlot=s,r&&(r._state=this);for(let t=0;t<this.config.dynamicSlots.length;t++)Bt(this,t<<1);this.computeSlot=null;}field(t,e=!0){let i=this.config.address[t.id];if(null!=i)return Bt(this,i),It(this,i);if(e)throw new RangeError("Field is not present in this state")}update(...t){return ce(this,t,!0)}applyTransaction(t){let e,i=this.config,{base:n,compartments:s}=i;for(let e of t.effects)e.is(Ut.reconfigure)?(i&&(s=new Map,i.compartments.forEach(((t,e)=>s.set(e,t))),i=null),s.set(e.value.compartment,e.value.extension)):e.is(re.reconfigure)?(i=null,n=e.value):e.is(re.appendConfig)&&(i=null,n=ue(n).concat(e.value));if(i)e=t.startState.values.slice();else {i=Gt.resolve(n,s,this),e=new me(i,this.doc,this.selection,i.dynamicSlots.map((()=>null)),((t,e)=>e.reconfigure(t,this)),null).values;}let r=t.startState.facet(Ft)?t.newSelection:t.newSelection.asSingle();new me(i,t.newDoc,r,e,((e,i)=>i.update(e,t)),t);}replaceSelection(t){return "string"==typeof t&&(t=this.toText(t)),this.changeByRange((e=>({changes:{from:e.from,to:e.to,insert:t},range:kt.cursor(e.from+t.length)})))}changeByRange(t){let e=this.selection,i=t(e.ranges[0]),n=this.changes(i.changes),s=[i.range],r=ue(i.effects);for(let i=1;i<e.ranges.length;i++){let o=t(e.ranges[i]),a=this.changes(o.changes),l=a.map(n);for(let t=0;t<i;t++)s[t]=s[t].map(l);let h=n.mapDesc(a,!0);s.push(o.range.map(h)),n=n.compose(l),r=re.mapEffects(r,l).concat(re.mapEffects(ue(o.effects),h));}return {changes:n,selection:kt.create(s,e.mainIndex),effects:r}}changes(t=[]){return t instanceof wt?t:wt.of(t,this.doc.length,this.facet(me.lineSeparator))}toText(t){return B.of(t.split(this.facet(me.lineSeparator)||pt))}sliceDoc(t=0,e=this.doc.length){return this.doc.sliceString(t,e,this.lineBreak)}facet(t){let e=this.config.address[t.id];return null==e?t.default:(Bt(this,e),It(this,e))}toJSON(t){let e={doc:this.sliceDoc(),selection:this.selection.toJSON()};if(t)for(let i in t){let n=t[i];n instanceof Wt&&null!=this.config.address[n.id]&&(e[i]=n.spec.toJSON(this.field(t[i]),this));}return e}static fromJSON(t,e={},i){if(!t||"string"!=typeof t.doc)throw new RangeError("Invalid JSON representation for EditorState");let n=[];if(i)for(let e in i)if(Object.prototype.hasOwnProperty.call(t,e)){let s=i[e],r=t[e];n.push(s.init((t=>s.spec.fromJSON(r,t))));}return me.create({doc:t.doc,selection:kt.fromJSON(t.selection),extensions:e.extensions?n.concat([e.extensions]):n})}static create(t={}){let e=Gt.resolve(t.extensions||[],new Map),i=t.doc instanceof B?t.doc:B.of((t.doc||"").split(e.staticFacet(me.lineSeparator)||pt)),n=t.selection?t.selection instanceof kt?t.selection:kt.single(t.selection.anchor,t.selection.head):kt.single(0);return $t(n,i.length),e.staticFacet(Ft)||(n=n.asSingle()),new me(e,i,n,e.dynamicSlots.map((()=>null)),((t,e)=>e.create(t)),null)}get tabSize(){return this.facet(me.tabSize)}get lineBreak(){return this.facet(me.lineSeparator)||"\n"}get readOnly(){return this.facet(ee)}phrase(t,...e){for(let e of this.facet(me.phrases))if(Object.prototype.hasOwnProperty.call(e,t)){t=e[t];break}return e.length&&(t=t.replace(/\$(\$|\d*)/g,((t,i)=>{if("$"==i)return "$";let n=+(i||1);return !n||n>e.length?t:e[n-1]}))),t}languageDataAt(t,e,i=-1){let n=[];for(let s of this.facet(Lt))for(let r of s(this,e,i))Object.prototype.hasOwnProperty.call(r,t)&&n.push(r[t]);return n}charCategorizer(t){return ge(this.languageDataAt("wordChars",t).join(""))}wordAt(t){let{text:e,from:i,length:n}=this.doc.lineAt(t),s=this.charCategorizer(t),r=t-i,o=t-i;for(;r>0;){let t=at(e,r,!1);if(s(e.slice(t,r))!=fe.Word)break;r=t;}for(;o<n;){let t=at(e,o);if(s(e.slice(o,t))!=fe.Word)break;o=t;}return r==o?null:kt.range(r+i,o+i)}}function we(t,e,i={}){let n={};for(let e of t)for(let t of Object.keys(e)){let s=e[t],r=n[t];if(void 0===r)n[t]=s;else if(r===s||void 0===s);else {if(!Object.hasOwnProperty.call(i,t))throw new Error("Config merge conflict for field "+t);n[t]=i[t](r,s);}}for(let t in e)void 0===n[t]&&(n[t]=e[t]);return n}me.allowMultipleSelections=Ft,me.tabSize=Xt.define({combine:t=>t.length?t[0]:4}),me.lineSeparator=Ht,me.readOnly=ee,me.phrases=Xt.define({compare(t,e){let i=Object.keys(t),n=Object.keys(e);return i.length==n.length&&i.every((i=>t[i]==e[i]))}}),me.languageData=Lt,me.changeFilter=Jt,me.transactionFilter=Kt,me.transactionExtender=te,Ut.reconfigure=re.define();class be{eq(t){return this==t}range(t,e=t){return Se.create(t,e,this)}}be.prototype.startSide=be.prototype.endSide=0,be.prototype.point=!1,be.prototype.mapMode=gt.TrackDel;class Se{constructor(t,e,i){this.from=t,this.to=e,this.value=i;}static create(t,e,i){return new Se(t,e,i)}}function Qe(t,e){return t.from-e.from||t.value.startSide-e.value.startSide}class xe{constructor(t,e,i,n){this.from=t,this.to=e,this.value=i,this.maxPoint=n;}get length(){return this.to[this.to.length-1]}findIndex(t,e,i,n=0){let s=i?this.to:this.from;for(let r=n,o=s.length;;){if(r==o)return r;let n=r+o>>1,a=s[n]-t||(i?this.value[n].endSide:this.value[n].startSide)-e;if(n==r)return a>=0?r:o;a>=0?o=n:r=n+1;}}between(t,e,i,n){for(let s=this.findIndex(e,-1e9,!0),r=this.findIndex(i,1e9,!1,s);s<r;s++)if(!1===n(this.from[s]+t,this.to[s]+t,this.value[s]))return !1}map(t,e){let i=[],n=[],s=[],r=-1,o=-1;for(let a=0;a<this.value.length;a++){let l,h,c=this.value[a],O=this.from[a]+t,u=this.to[a]+t;if(O==u){let t=e.mapPos(O,c.startSide,c.mapMode);if(null==t)continue;if(l=h=t,c.startSide!=c.endSide&&(h=e.mapPos(O,c.endSide),h<l))continue}else if(l=e.mapPos(O,c.startSide),h=e.mapPos(u,c.endSide),l>h||l==h&&c.startSide>0&&c.endSide<=0)continue;(h-l||c.endSide-c.startSide)<0||(r<0&&(r=l),c.point&&(o=Math.max(o,h-l)),i.push(c),n.push(l-r),s.push(h-r));}return {mapped:i.length?new xe(n,s,i,o):null,pos:r}}}class ye{constructor(t,e,i,n){this.chunkPos=t,this.chunk=e,this.nextLayer=i,this.maxPoint=n;}static create(t,e,i,n){return new ye(t,e,i,n)}get length(){let t=this.chunk.length-1;return t<0?0:Math.max(this.chunkEnd(t),this.nextLayer.length)}get size(){if(this.isEmpty)return 0;let t=this.nextLayer.size;for(let e of this.chunk)t+=e.value.length;return t}chunkEnd(t){return this.chunkPos[t]+this.chunk[t].length}update(t){let{add:e=[],sort:i=!1,filterFrom:n=0,filterTo:s=this.length}=t,r=t.filter;if(0==e.length&&!r)return this;if(i&&(e=e.slice().sort(Qe)),this.isEmpty)return e.length?ye.of(e):this;let o=new ke(this,null,-1).goto(0),a=0,l=[],h=new ve;for(;o.value||a<e.length;)if(a<e.length&&(o.from-e[a].from||o.startSide-e[a].value.startSide)>=0){let t=e[a++];h.addInner(t.from,t.to,t.value)||l.push(t);}else 1==o.rangeIndex&&o.chunkIndex<this.chunk.length&&(a==e.length||this.chunkEnd(o.chunkIndex)<e[a].from)&&(!r||n>this.chunkEnd(o.chunkIndex)||s<this.chunkPos[o.chunkIndex])&&h.addChunk(this.chunkPos[o.chunkIndex],this.chunk[o.chunkIndex])?o.nextChunk():((!r||n>o.to||s<o.from||r(o.from,o.to,o.value))&&(h.addInner(o.from,o.to,o.value)||l.push(Se.create(o.from,o.to,o.value))),o.next());return h.finishInner(this.nextLayer.isEmpty&&!l.length?ye.empty:this.nextLayer.update({add:l,filter:r,filterFrom:n,filterTo:s}))}map(t){if(t.empty||this.isEmpty)return this;let e=[],i=[],n=-1;for(let s=0;s<this.chunk.length;s++){let r=this.chunkPos[s],o=this.chunk[s],a=t.touchesRange(r,r+o.length);if(!1===a)n=Math.max(n,o.maxPoint),e.push(o),i.push(t.mapPos(r));else if(!0===a){let{mapped:s,pos:a}=o.map(r,t);s&&(n=Math.max(n,s.maxPoint),e.push(s),i.push(a));}}let s=this.nextLayer.map(t);return 0==e.length?s:new ye(i,e,s||ye.empty,n)}between(t,e,i){if(!this.isEmpty){for(let n=0;n<this.chunk.length;n++){let s=this.chunkPos[n],r=this.chunk[n];if(e>=s&&t<=s+r.length&&!1===r.between(s,t-s,e-s,i))return}this.nextLayer.between(t,e,i);}}iter(t=0){return $e.from([this]).goto(t)}get isEmpty(){return this.nextLayer==this}static iter(t,e=0){return $e.from(t).goto(e)}static compare(t,e,i,n,s=-1){let r=t.filter((t=>t.maxPoint>0||!t.isEmpty&&t.maxPoint>=s)),o=e.filter((t=>t.maxPoint>0||!t.isEmpty&&t.maxPoint>=s)),a=Pe(r,o,i),l=new Xe(r,a,s),h=new Xe(o,a,s);i.iterGaps(((t,e,i)=>Te(l,t,h,e,i,n))),i.empty&&0==i.length&&Te(l,0,h,0,0,n);}static eq(t,e,i=0,n){null==n&&(n=999999999);let s=t.filter((t=>!t.isEmpty&&e.indexOf(t)<0)),r=e.filter((e=>!e.isEmpty&&t.indexOf(e)<0));if(s.length!=r.length)return !1;if(!s.length)return !0;let o=Pe(s,r),a=new Xe(s,o,0).goto(i),l=new Xe(r,o,0).goto(i);for(;;){if(a.to!=l.to||!Re(a.active,l.active)||a.point&&(!l.point||!a.point.eq(l.point)))return !1;if(a.to>n)return !0;a.next(),l.next();}}static spans(t,e,i,n,s=-1){let r=new Xe(t,null,s).goto(e),o=e,a=r.openStart;for(;;){let t=Math.min(r.to,i);if(r.point){let i=r.activeForPoint(r.to),s=r.pointFrom<e?i.length+1:r.point.startSide<0?i.length:Math.min(i.length,a);n.point(o,t,r.point,i,s,r.pointRank),a=Math.min(r.openEnd(t),i.length);}else t>o&&(n.span(o,t,r.active,a),a=r.openEnd(t));if(r.to>i)return a+(r.point&&r.to>i?1:0);o=r.to,r.next();}}static of(t,e=!1){let i=new ve;for(let n of t instanceof Se?[t]:e?function(t){if(t.length>1)for(let e=t[0],i=1;i<t.length;i++){let n=t[i];if(Qe(e,n)>0)return t.slice().sort(Qe);e=n;}return t}(t):t)i.add(n.from,n.to,n.value);return i.finish()}static join(t){if(!t.length)return ye.empty;let e=t[t.length-1];for(let i=t.length-2;i>=0;i--)for(let n=t[i];n!=ye.empty;n=n.nextLayer)e=new ye(n.chunkPos,n.chunk,e,Math.max(n.maxPoint,e.maxPoint));return e}}ye.empty=new ye([],[],null,-1),ye.empty.nextLayer=ye.empty;class ve{finishChunk(t){this.chunks.push(new xe(this.from,this.to,this.value,this.maxPoint)),this.chunkPos.push(this.chunkStart),this.chunkStart=-1,this.setMaxPoint=Math.max(this.setMaxPoint,this.maxPoint),this.maxPoint=-1,t&&(this.from=[],this.to=[],this.value=[]);}constructor(){this.chunks=[],this.chunkPos=[],this.chunkStart=-1,this.last=null,this.lastFrom=-1e9,this.lastTo=-1e9,this.from=[],this.to=[],this.value=[],this.maxPoint=-1,this.setMaxPoint=-1,this.nextLayer=null;}add(t,e,i){this.addInner(t,e,i)||(this.nextLayer||(this.nextLayer=new ve)).add(t,e,i);}addInner(t,e,i){let n=t-this.lastTo||i.startSide-this.last.endSide;if(n<=0&&(t-this.lastFrom||i.startSide-this.last.startSide)<0)throw new Error("Ranges must be added sorted by `from` position and `startSide`");return !(n<0)&&(250==this.from.length&&this.finishChunk(!0),this.chunkStart<0&&(this.chunkStart=t),this.from.push(t-this.chunkStart),this.to.push(e-this.chunkStart),this.last=i,this.lastFrom=t,this.lastTo=e,this.value.push(i),i.point&&(this.maxPoint=Math.max(this.maxPoint,e-t)),!0)}addChunk(t,e){if((t-this.lastTo||e.value[0].startSide-this.last.endSide)<0)return !1;this.from.length&&this.finishChunk(!0),this.setMaxPoint=Math.max(this.setMaxPoint,e.maxPoint),this.chunks.push(e),this.chunkPos.push(t);let i=e.value.length-1;return this.last=e.value[i],this.lastFrom=e.from[i]+t,this.lastTo=e.to[i]+t,!0}finish(){return this.finishInner(ye.empty)}finishInner(t){if(this.from.length&&this.finishChunk(!1),0==this.chunks.length)return t;let e=ye.create(this.chunkPos,this.chunks,this.nextLayer?this.nextLayer.finishInner(t):t,this.setMaxPoint);return this.from=null,e}}function Pe(t,e,i){let n=new Map;for(let e of t)for(let t=0;t<e.chunk.length;t++)e.chunk[t].maxPoint<=0&&n.set(e.chunk[t],e.chunkPos[t]);let s=new Set;for(let t of e)for(let e=0;e<t.chunk.length;e++){let r=n.get(t.chunk[e]);null==r||(i?i.mapPos(r):r)!=t.chunkPos[e]||(null==i?void 0:i.touchesRange(r,r+t.chunk[e].length))||s.add(t.chunk[e]);}return s}class ke{constructor(t,e,i,n=0){this.layer=t,this.skip=e,this.minPoint=i,this.rank=n;}get startSide(){return this.value?this.value.startSide:0}get endSide(){return this.value?this.value.endSide:0}goto(t,e=-1e9){return this.chunkIndex=this.rangeIndex=0,this.gotoInner(t,e,!1),this}gotoInner(t,e,i){for(;this.chunkIndex<this.layer.chunk.length;){let e=this.layer.chunk[this.chunkIndex];if(!(this.skip&&this.skip.has(e)||this.layer.chunkEnd(this.chunkIndex)<t||e.maxPoint<this.minPoint))break;this.chunkIndex++,i=!1;}if(this.chunkIndex<this.layer.chunk.length){let n=this.layer.chunk[this.chunkIndex].findIndex(t-this.layer.chunkPos[this.chunkIndex],e,!0);(!i||this.rangeIndex<n)&&this.setRangeIndex(n);}this.next();}forward(t,e){(this.to-t||this.endSide-e)<0&&this.gotoInner(t,e,!0);}next(){for(;;){if(this.chunkIndex==this.layer.chunk.length){this.from=this.to=1e9,this.value=null;break}{let t=this.layer.chunkPos[this.chunkIndex],e=this.layer.chunk[this.chunkIndex],i=t+e.from[this.rangeIndex];if(this.from=i,this.to=t+e.to[this.rangeIndex],this.value=e.value[this.rangeIndex],this.setRangeIndex(this.rangeIndex+1),this.minPoint<0||this.value.point&&this.to-this.from>=this.minPoint)break}}}setRangeIndex(t){if(t==this.layer.chunk[this.chunkIndex].value.length){if(this.chunkIndex++,this.skip)for(;this.chunkIndex<this.layer.chunk.length&&this.skip.has(this.layer.chunk[this.chunkIndex]);)this.chunkIndex++;this.rangeIndex=0;}else this.rangeIndex=t;}nextChunk(){this.chunkIndex++,this.rangeIndex=0,this.next();}compare(t){return this.from-t.from||this.startSide-t.startSide||this.rank-t.rank||this.to-t.to||this.endSide-t.endSide}}class $e{constructor(t){this.heap=t;}static from(t,e=null,i=-1){let n=[];for(let s=0;s<t.length;s++)for(let r=t[s];!r.isEmpty;r=r.nextLayer)r.maxPoint>=i&&n.push(new ke(r,e,i,s));return 1==n.length?n[0]:new $e(n)}get startSide(){return this.value?this.value.startSide:0}goto(t,e=-1e9){for(let i of this.heap)i.goto(t,e);for(let t=this.heap.length>>1;t>=0;t--)Ze(this.heap,t);return this.next(),this}forward(t,e){for(let i of this.heap)i.forward(t,e);for(let t=this.heap.length>>1;t>=0;t--)Ze(this.heap,t);(this.to-t||this.value.endSide-e)<0&&this.next();}next(){if(0==this.heap.length)this.from=this.to=1e9,this.value=null,this.rank=-1;else {let t=this.heap[0];this.from=t.from,this.to=t.to,this.value=t.value,this.rank=t.rank,t.value&&t.next(),Ze(this.heap,0);}}}function Ze(t,e){for(let i=t[e];;){let n=1+(e<<1);if(n>=t.length)break;let s=t[n];if(n+1<t.length&&s.compare(t[n+1])>=0&&(s=t[n+1],n++),i.compare(s)<0)break;t[n]=i,t[e]=s,e=n;}}class Xe{constructor(t,e,i){this.minPoint=i,this.active=[],this.activeTo=[],this.activeRank=[],this.minActive=-1,this.point=null,this.pointFrom=0,this.pointRank=0,this.to=-1e9,this.endSide=0,this.openStart=-1,this.cursor=$e.from(t,e,i);}goto(t,e=-1e9){return this.cursor.goto(t,e),this.active.length=this.activeTo.length=this.activeRank.length=0,this.minActive=-1,this.to=t,this.endSide=e,this.openStart=-1,this.next(),this}forward(t,e){for(;this.minActive>-1&&(this.activeTo[this.minActive]-t||this.active[this.minActive].endSide-e)<0;)this.removeActive(this.minActive);this.cursor.forward(t,e);}removeActive(t){Ae(this.active,t),Ae(this.activeTo,t),Ae(this.activeRank,t),this.minActive=qe(this.active,this.activeTo);}addActive(t){let e=0,{value:i,to:n,rank:s}=this.cursor;for(;e<this.activeRank.length&&(s-this.activeRank[e]||n-this.activeTo[e])>0;)e++;Ce(this.active,e,i),Ce(this.activeTo,e,n),Ce(this.activeRank,e,s),t&&Ce(t,e,this.cursor.from),this.minActive=qe(this.active,this.activeTo);}next(){let t=this.to,e=this.point;this.point=null;let i=this.openStart<0?[]:null;for(;;){let n=this.minActive;if(n>-1&&(this.activeTo[n]-this.cursor.from||this.active[n].endSide-this.cursor.startSide)<0){if(this.activeTo[n]>t){this.to=this.activeTo[n],this.endSide=this.active[n].endSide;break}this.removeActive(n),i&&Ae(i,n);}else {if(!this.cursor.value){this.to=this.endSide=1e9;break}if(this.cursor.from>t){this.to=this.cursor.from,this.endSide=this.cursor.startSide;break}{let t=this.cursor.value;if(t.point){if(!(e&&this.cursor.to==this.to&&this.cursor.from<this.cursor.to)){this.point=t,this.pointFrom=this.cursor.from,this.pointRank=this.cursor.rank,this.to=this.cursor.to,this.endSide=t.endSide,this.cursor.next(),this.forward(this.to,this.endSide);break}this.cursor.next();}else this.addActive(i),this.cursor.next();}}}if(i){this.openStart=0;for(let e=i.length-1;e>=0&&i[e]<t;e--)this.openStart++;}}activeForPoint(t){if(!this.active.length)return this.active;let e=[];for(let i=this.active.length-1;i>=0&&!(this.activeRank[i]<this.pointRank);i--)(this.activeTo[i]>t||this.activeTo[i]==t&&this.active[i].endSide>=this.point.endSide)&&e.push(this.active[i]);return e.reverse()}openEnd(t){let e=0;for(let i=this.activeTo.length-1;i>=0&&this.activeTo[i]>t;i--)e++;return e}}function Te(t,e,i,n,s,r){t.goto(e),i.goto(n);let o=n+s,a=n,l=n-e;for(;;){let e=t.to+l-i.to||t.endSide-i.endSide,n=e<0?t.to+l:i.to,s=Math.min(n,o);if(t.point||i.point?t.point&&i.point&&(t.point==i.point||t.point.eq(i.point))&&Re(t.activeForPoint(t.to),i.activeForPoint(i.to))||r.comparePoint(a,s,t.point,i.point):s>a&&!Re(t.active,i.active)&&r.compareRange(a,s,t.active,i.active),n>o)break;a=n,e<=0&&t.next(),e>=0&&i.next();}}function Re(t,e){if(t.length!=e.length)return !1;for(let i=0;i<t.length;i++)if(t[i]!=e[i]&&!t[i].eq(e[i]))return !1;return !0}function Ae(t,e){for(let i=e,n=t.length-1;i<n;i++)t[i]=t[i+1];t.pop();}function Ce(t,e,i){for(let i=t.length-1;i>=e;i--)t[i+1]=t[i];t[e]=i;}function qe(t,e){let i=-1,n=1e9;for(let s=0;s<e.length;s++)(e[s]-n||t[s].endSide-t[i].endSide)<0&&(i=s,n=e[s]);return i}function Ye(t,e,i=t.length){let n=0;for(let s=0;s<i;)9==t.charCodeAt(s)?(n+=e-n%e,s++):(n++,s=at(t,s));return n}const We="undefined"==typeof Symbol?"__ͼ":Symbol.for("ͼ"),Me="undefined"==typeof Symbol?"__styleSet"+Math.floor(1e8*Math.random()):Symbol("styleSet"),je="undefined"!=typeof globalThis?globalThis:"undefined"!=typeof window?window:{};class _e{constructor(t,e){this.rules=[];let{finish:i}=e||{};function n(t){return /^@/.test(t)?[t]:t.split(/,\s*/)}function s(t,e,r,o){let a=[],l=/^@(\w+)\b/.exec(t[0]),h=l&&"keyframes"==l[1];if(l&&null==e)return r.push(t[0]+";");for(let i in e){let o=e[i];if(/&/.test(i))s(i.split(/,\s*/).map((e=>t.map((t=>e.replace(/&/,t))))).reduce(((t,e)=>t.concat(e))),o,r);else if(o&&"object"==typeof o){if(!l)throw new RangeError("The value of a property ("+i+") should be a primitive value.");s(n(i),o,a,h);}else null!=o&&a.push(i.replace(/_.*/,"").replace(/[A-Z]/g,(t=>"-"+t.toLowerCase()))+": "+o+";");}(a.length||h)&&r.push((!i||l||o?t:t.map(i)).join(", ")+" {"+a.join(" ")+"}");}for(let e in t)s(n(e),t[e],this.rules);}getRules(){return this.rules.join("\n")}static newName(){let t=je[We]||1;return je[We]=t+1,"ͼ"+t.toString(36)}static mount(t,e,i){let n=t[Me],s=i&&i.nonce;n?s&&n.setNonce(s):n=new ze(t,s),n.mount(Array.isArray(e)?e:[e]);}}let Ee=new Map;class ze{constructor(t,e){let i=t.ownerDocument||t,n=i.defaultView;if(!t.head&&t.adoptedStyleSheets&&n.CSSStyleSheet){let e=Ee.get(i);if(e)return t.adoptedStyleSheets=[e.sheet,...t.adoptedStyleSheets],t[Me]=e;this.sheet=new n.CSSStyleSheet,t.adoptedStyleSheets=[this.sheet,...t.adoptedStyleSheets],Ee.set(i,this);}else {this.styleTag=i.createElement("style"),e&&this.styleTag.setAttribute("nonce",e);let n=t.head||t;n.insertBefore(this.styleTag,n.firstChild);}this.modules=[],t[Me]=this;}mount(t){let e=this.sheet,i=0,n=0;for(let s=0;s<t.length;s++){let r=t[s],o=this.modules.indexOf(r);if(o<n&&o>-1&&(this.modules.splice(o,1),n--,o=-1),-1==o){if(this.modules.splice(n++,0,r),e)for(let t=0;t<r.rules.length;t++)e.insertRule(r.rules[t],i++);}else {for(;n<o;)i+=this.modules[n++].rules.length;i+=r.rules.length,n++;}}if(!e){let t="";for(let e=0;e<this.modules.length;e++)t+=this.modules[e].getRules()+"\n";this.styleTag.textContent=t;}}setNonce(t){this.styleTag&&this.styleTag.getAttribute("nonce")!=t&&this.styleTag.setAttribute("nonce",t);}}for(var Ve={8:"Backspace",9:"Tab",10:"Enter",12:"NumLock",13:"Enter",16:"Shift",17:"Control",18:"Alt",20:"CapsLock",27:"Escape",32:" ",33:"PageUp",34:"PageDown",35:"End",36:"Home",37:"ArrowLeft",38:"ArrowUp",39:"ArrowRight",40:"ArrowDown",44:"PrintScreen",45:"Insert",46:"Delete",59:";",61:"=",91:"Meta",92:"Meta",106:"*",107:"+",108:",",109:"-",110:".",111:"/",144:"NumLock",145:"ScrollLock",160:"Shift",161:"Shift",162:"Control",163:"Control",164:"Alt",165:"Alt",173:"-",186:";",187:"=",188:",",189:"-",190:".",191:"/",192:"`",219:"[",220:"\\",221:"]",222:"'"},De={48:")",49:"!",50:"@",51:"#",52:"$",53:"%",54:"^",55:"&",56:"*",57:"(",59:":",61:"+",173:"_",186:":",187:"+",188:"<",189:"_",190:">",191:"?",192:"~",219:"{",220:"|",221:"}",222:'"'},Ue="undefined"!=typeof navigator&&/Mac/.test(navigator.platform),Ne="undefined"!=typeof navigator&&/MSIE \d|Trident\/(?:[7-9]|\d{2,})\..*rv:(\d+)/.exec(navigator.userAgent),Ge=0;Ge<10;Ge++)Ve[48+Ge]=Ve[96+Ge]=String(Ge);for(Ge=1;Ge<=24;Ge++)Ve[Ge+111]="F"+Ge;for(Ge=65;Ge<=90;Ge++)Ve[Ge]=String.fromCharCode(Ge+32),De[Ge]=String.fromCharCode(Ge);for(var Be in Ve)De.hasOwnProperty(Be)||(De[Be]=Ve[Be]);function Ie(t){let e;return e=11==t.nodeType?t.getSelection?t:t.ownerDocument:t,e.getSelection()}function Le(t,e){return !!e&&(t==e||t.contains(1!=e.nodeType?e.parentNode:e))}function Fe(t,e){if(!e.anchorNode)return !1;try{return Le(t,e.anchorNode)}catch(t){return !1}}function He(t){return 3==t.nodeType?hi(t,0,t.nodeValue.length).getClientRects():1==t.nodeType?t.getClientRects():[]}function Je(t,e,i,n){return !!i&&(ti(t,e,i,n,-1)||ti(t,e,i,n,1))}function Ke(t){for(var e=0;;e++)if(!(t=t.previousSibling))return e}function ti(t,e,i,n,s){for(;;){if(t==i&&e==n)return !0;if(e==(s<0?0:ei(t))){if("DIV"==t.nodeName)return !1;let i=t.parentNode;if(!i||1!=i.nodeType)return !1;e=Ke(t)+(s<0?0:1),t=i;}else {if(1!=t.nodeType)return !1;if(1==(t=t.childNodes[e+(s<0?-1:0)]).nodeType&&"false"==t.contentEditable)return !1;e=s<0?ei(t):0;}}}function ei(t){return 3==t.nodeType?t.nodeValue.length:t.childNodes.length}function ii(t,e){let i=e?t.left:t.right;return {left:i,right:i,top:t.top,bottom:t.bottom}}function ni(t){return {left:0,right:t.innerWidth,top:0,bottom:t.innerHeight}}function si(t,e){let i=e.width/t.offsetWidth,n=e.height/t.offsetHeight;return (i>.995&&i<1.005||!isFinite(i)||Math.abs(e.width-t.offsetWidth)<1)&&(i=1),(n>.995&&n<1.005||!isFinite(n)||Math.abs(e.height-t.offsetHeight)<1)&&(n=1),{scaleX:i,scaleY:n}}class ri{constructor(){this.anchorNode=null,this.anchorOffset=0,this.focusNode=null,this.focusOffset=0;}eq(t){return this.anchorNode==t.anchorNode&&this.anchorOffset==t.anchorOffset&&this.focusNode==t.focusNode&&this.focusOffset==t.focusOffset}setRange(t){let{anchorNode:e,focusNode:i}=t;this.set(e,Math.min(t.anchorOffset,e?ei(e):0),i,Math.min(t.focusOffset,i?ei(i):0));}set(t,e,i,n){this.anchorNode=t,this.anchorOffset=e,this.focusNode=i,this.focusOffset=n;}}let oi,ai=null;function li(t){if(t.setActive)return t.setActive();if(ai)return t.focus(ai);let e=[];for(let i=t;i&&(e.push(i,i.scrollTop,i.scrollLeft),i!=i.ownerDocument);i=i.parentNode);if(t.focus(null==ai?{get preventScroll(){return ai={preventScroll:!0},!0}}:void 0),!ai){ai=!1;for(let t=0;t<e.length;){let i=e[t++],n=e[t++],s=e[t++];i.scrollTop!=n&&(i.scrollTop=n),i.scrollLeft!=s&&(i.scrollLeft=s);}}}function hi(t,e,i=e){let n=oi||(oi=document.createRange());return n.setEnd(t,i),n.setStart(t,e),n}function ci(t,e,i){let n={key:e,code:e,keyCode:i,which:i,cancelable:!0},s=new KeyboardEvent("keydown",n);s.synthetic=!0,t.dispatchEvent(s);let r=new KeyboardEvent("keyup",n);return r.synthetic=!0,t.dispatchEvent(r),s.defaultPrevented||r.defaultPrevented}function Oi(t){for(;t.attributes.length;)t.removeAttributeNode(t.attributes[0]);}function ui(t){return t.scrollTop>Math.max(1,t.scrollHeight-t.clientHeight-4)}class fi{constructor(t,e,i=!0){this.node=t,this.offset=e,this.precise=i;}static before(t,e){return new fi(t.parentNode,Ke(t),e)}static after(t,e){return new fi(t.parentNode,Ke(t)+1,e)}}const di=[];class pi{constructor(){this.parent=null,this.dom=null,this.flags=2;}get overrideDOMText(){return null}get posAtStart(){return this.parent?this.parent.posBefore(this):0}get posAtEnd(){return this.posAtStart+this.length}posBefore(t){let e=this.posAtStart;for(let i of this.children){if(i==t)return e;e+=i.length+i.breakAfter;}throw new RangeError("Invalid child in posBefore")}posAfter(t){return this.posBefore(t)+t.length}sync(t,e){if(2&this.flags){let i,n=this.dom,s=null;for(let r of this.children){if(7&r.flags){if(!r.dom&&(i=s?s.nextSibling:n.firstChild)){let t=pi.get(i);(!t||!t.parent&&t.canReuseDOM(r))&&r.reuseDOM(i);}r.sync(t,e),r.flags&=-8;}if(i=s?s.nextSibling:n.firstChild,e&&!e.written&&e.node==n&&i!=r.dom&&(e.written=!0),r.dom.parentNode==n)for(;i&&i!=r.dom;)i=gi(i);else n.insertBefore(r.dom,i);s=r.dom;}for(i=s?s.nextSibling:n.firstChild,i&&e&&e.node==n&&(e.written=!0);i;)i=gi(i);}else if(1&this.flags)for(let i of this.children)7&i.flags&&(i.sync(t,e),i.flags&=-8);}reuseDOM(t){}localPosFromDOM(t,e){let i;if(t==this.dom)i=this.dom.childNodes[e];else {let n=0==ei(t)?0:0==e?-1:1;for(;;){let e=t.parentNode;if(e==this.dom)break;0==n&&e.firstChild!=e.lastChild&&(n=t==e.firstChild?-1:1),t=e;}i=n<0?t:t.nextSibling;}if(i==this.dom.firstChild)return 0;for(;i&&!pi.get(i);)i=i.nextSibling;if(!i)return this.length;for(let t=0,e=0;;t++){let n=this.children[t];if(n.dom==i)return e;e+=n.length+n.breakAfter;}}domBoundsAround(t,e,i=0){let n=-1,s=-1,r=-1,o=-1;for(let a=0,l=i,h=i;a<this.children.length;a++){let i=this.children[a],c=l+i.length;if(l<t&&c>e)return i.domBoundsAround(t,e,l);if(c>=t&&-1==n&&(n=a,s=l),l>e&&i.dom.parentNode==this.dom){r=a,o=h;break}h=c,l=c+i.breakAfter;}return {from:s,to:o<0?i+this.length:o,startDOM:(n?this.children[n-1].dom.nextSibling:null)||this.dom.firstChild,endDOM:r<this.children.length&&r>=0?this.children[r].dom:null}}markDirty(t=!1){this.flags|=2,this.markParentsDirty(t);}markParentsDirty(t){for(let e=this.parent;e;e=e.parent){if(t&&(e.flags|=2),1&e.flags)return;e.flags|=1,t=!1;}}setParent(t){this.parent!=t&&(this.parent=t,7&this.flags&&this.markParentsDirty(!0));}setDOM(t){this.dom!=t&&(this.dom&&(this.dom.cmView=null),this.dom=t,t.cmView=this);}get rootView(){for(let t=this;;){let e=t.parent;if(!e)return t;t=e;}}replaceChildren(t,e,i=di){this.markDirty();for(let n=t;n<e;n++){let t=this.children[n];t.parent==this&&i.indexOf(t)<0&&t.destroy();}this.children.splice(t,e-t,...i);for(let t=0;t<i.length;t++)i[t].setParent(this);}ignoreMutation(t){return !1}ignoreEvent(t){return !1}childCursor(t=this.length){return new mi(this.children,t,this.children.length)}childPos(t,e=1){return this.childCursor().findPos(t,e)}toString(){let t=this.constructor.name.replace("View","");return t+(this.children.length?"("+this.children.join()+")":this.length?"["+("Text"==t?this.text:this.length)+"]":"")+(this.breakAfter?"#":"")}static get(t){return t.cmView}get isEditable(){return !0}get isWidget(){return !1}get isHidden(){return !1}merge(t,e,i,n,s,r){return !1}become(t){return !1}canReuseDOM(t){return t.constructor==this.constructor&&!(8&(this.flags|t.flags))}getSide(){return 0}destroy(){for(let t of this.children)t.parent==this&&t.destroy();this.parent=null;}}function gi(t){let e=t.nextSibling;return t.parentNode.removeChild(t),e}pi.prototype.breakAfter=0;class mi{constructor(t,e,i){this.children=t,this.pos=e,this.i=i,this.off=0;}findPos(t,e=1){for(;;){if(t>this.pos||t==this.pos&&(e>0||0==this.i||this.children[this.i-1].breakAfter))return this.off=t-this.pos,this;let i=this.children[--this.i];this.pos-=i.length+i.breakAfter;}}}function wi(t,e,i,n,s,r,o,a,l){let{children:h}=t,c=h.length?h[e]:null,O=r.length?r[r.length-1]:null,u=O?O.breakAfter:o;if(!(e==n&&c&&!o&&!u&&r.length<2&&c.merge(i,s,r.length?O:null,0==i,a,l))){if(n<h.length){let t=h[n];t&&(s<t.length||t.breakAfter&&(null==O?void 0:O.breakAfter))?(e==n&&(t=t.split(s),s=0),!u&&O&&t.merge(0,s,O,!0,0,l)?r[r.length-1]=t:((s||t.children.length&&!t.children[0].length)&&t.merge(0,s,null,!1,0,l),r.push(t))):(null==t?void 0:t.breakAfter)&&(O?O.breakAfter=1:o=1),n++;}for(c&&(c.breakAfter=o,i>0&&(!o&&r.length&&c.merge(i,c.length,r[0],!1,a,0)?c.breakAfter=r.shift().breakAfter:(i<c.length||c.children.length&&0==c.children[c.children.length-1].length)&&c.merge(i,c.length,null,!1,a,0),e++));e<n&&r.length;)if(h[n-1].become(r[r.length-1]))n--,r.pop(),l=r.length?0:a;else {if(!h[e].become(r[0]))break;e++,r.shift(),a=r.length?0:l;}!r.length&&e&&n<h.length&&!h[e-1].breakAfter&&h[n].merge(0,0,h[e-1],!1,a,l)&&e--,(e<n||r.length)&&t.replaceChildren(e,n,r);}}function bi(t,e,i,n,s,r){let o=t.childCursor(),{i:a,off:l}=o.findPos(i,1),{i:h,off:c}=o.findPos(e,-1),O=e-i;for(let t of n)O+=t.length;t.length+=O,wi(t,h,c,a,l,n,0,s,r);}let Si="undefined"!=typeof navigator?navigator:{userAgent:"",vendor:"",platform:""},Qi="undefined"!=typeof document?document:{documentElement:{style:{}}};const xi=/Edge\/(\d+)/.exec(Si.userAgent),yi=/MSIE \d/.test(Si.userAgent),vi=/Trident\/(?:[7-9]|\d{2,})\..*rv:(\d+)/.exec(Si.userAgent),Pi=!!(yi||vi||xi),ki=!Pi&&/gecko\/(\d+)/i.test(Si.userAgent),$i=!Pi&&/Chrome\/(\d+)/.exec(Si.userAgent),Zi="webkitFontSmoothing"in Qi.documentElement.style,Xi=!Pi&&/Apple Computer/.test(Si.vendor),Ti=Xi&&(/Mobile\/\w+/.test(Si.userAgent)||Si.maxTouchPoints>2);var Ri={mac:Ti||/Mac/.test(Si.platform),windows:/Win/.test(Si.platform),linux:/Linux|X11/.test(Si.platform),ie:Pi,ie_version:yi?Qi.documentMode||6:vi?+vi[1]:xi?+xi[1]:0,gecko:ki,gecko_version:ki?+(/Firefox\/(\d+)/.exec(Si.userAgent)||[0,0])[1]:0,chrome:!!$i,chrome_version:$i?+$i[1]:0,ios:Ti,android:/Android\b/.test(Si.userAgent),webkit:Zi,safari:Xi,webkit_version:Zi?+(/\bAppleWebKit\/(\d+)/.exec(navigator.userAgent)||[0,0])[1]:0,tabSize:null!=Qi.documentElement.style.tabSize?"tab-size":"-moz-tab-size"};class Ai extends pi{constructor(t){super(),this.text=t;}get length(){return this.text.length}createDOM(t){this.setDOM(t||document.createTextNode(this.text));}sync(t,e){this.dom||this.createDOM(),this.dom.nodeValue!=this.text&&(e&&e.node==this.dom&&(e.written=!0),this.dom.nodeValue=this.text);}reuseDOM(t){3==t.nodeType&&this.createDOM(t);}merge(t,e,i){return !(8&this.flags||i&&(!(i instanceof Ai)||this.length-(e-t)+i.length>256||8&i.flags))&&(this.text=this.text.slice(0,t)+(i?i.text:"")+this.text.slice(e),this.markDirty(),!0)}split(t){let e=new Ai(this.text.slice(t));return this.text=this.text.slice(0,t),this.markDirty(),e.flags|=8&this.flags,e}localPosFromDOM(t,e){return t==this.dom?e:e?this.text.length:0}domAtPos(t){return new fi(this.dom,t)}domBoundsAround(t,e,i){return {from:i,to:i+this.length,startDOM:this.dom,endDOM:this.dom.nextSibling}}coordsAt(t,e){return function(t,e,i){let n=t.nodeValue.length;e>n&&(e=n);let s=e,r=e,o=0;0==e&&i<0||e==n&&i>=0?Ri.chrome||Ri.gecko||(e?(s--,o=1):r<n&&(r++,o=-1)):i<0?s--:r<n&&r++;let a=hi(t,s,r).getClientRects();if(!a.length)return null;let l=a[(o?o<0:i>=0)?0:a.length-1];Ri.safari&&!o&&0==l.width&&(l=Array.prototype.find.call(a,(t=>t.width))||l);return o?ii(l,o<0):l||null}(this.dom,t,e)}}class Ci extends pi{constructor(t,e=[],i=0){super(),this.mark=t,this.children=e,this.length=i;for(let t of e)t.setParent(this);}setAttrs(t){if(Oi(t),this.mark.class&&(t.className=this.mark.class),this.mark.attrs)for(let e in this.mark.attrs)t.setAttribute(e,this.mark.attrs[e]);return t}canReuseDOM(t){return super.canReuseDOM(t)&&!(8&(this.flags|t.flags))}reuseDOM(t){t.nodeName==this.mark.tagName.toUpperCase()&&(this.setDOM(t),this.flags|=6);}sync(t,e){this.dom?4&this.flags&&this.setAttrs(this.dom):this.setDOM(this.setAttrs(document.createElement(this.mark.tagName))),super.sync(t,e);}merge(t,e,i,n,s,r){return (!i||!(!(i instanceof Ci&&i.mark.eq(this.mark))||t&&s<=0||e<this.length&&r<=0))&&(bi(this,t,e,i?i.children.slice():[],s-1,r-1),this.markDirty(),!0)}split(t){let e=[],i=0,n=-1,s=0;for(let r of this.children){let o=i+r.length;o>t&&e.push(i<t?r.split(t-i):r),n<0&&i>=t&&(n=s),i=o,s++;}let r=this.length-t;return this.length=t,n>-1&&(this.children.length=n,this.markDirty()),new Ci(this.mark,e,r)}domAtPos(t){return Wi(this,t)}coordsAt(t,e){return ji(this,t,e)}}class qi extends pi{static create(t,e,i){return new qi(t,e,i)}constructor(t,e,i){super(),this.widget=t,this.length=e,this.side=i,this.prevWidget=null;}split(t){let e=qi.create(this.widget,this.length-t,this.side);return this.length-=t,e}sync(t){this.dom&&this.widget.updateDOM(this.dom,t)||(this.dom&&this.prevWidget&&this.prevWidget.destroy(this.dom),this.prevWidget=null,this.setDOM(this.widget.toDOM(t)),this.widget.editable||(this.dom.contentEditable="false"));}getSide(){return this.side}merge(t,e,i,n,s,r){return !(i&&(!(i instanceof qi&&this.widget.compare(i.widget))||t>0&&s<=0||e<this.length&&r<=0))&&(this.length=t+(i?i.length:0)+(this.length-e),!0)}become(t){return t instanceof qi&&t.side==this.side&&this.widget.constructor==t.widget.constructor&&(this.widget.compare(t.widget)||this.markDirty(!0),this.dom&&!this.prevWidget&&(this.prevWidget=this.widget),this.widget=t.widget,this.length=t.length,!0)}ignoreMutation(){return !0}ignoreEvent(t){return this.widget.ignoreEvent(t)}get overrideDOMText(){if(0==this.length)return B.empty;let t=this;for(;t.parent;)t=t.parent;let{view:e}=t,i=e&&e.state.doc,n=this.posAtStart;return i?i.slice(n,n+this.length):B.empty}domAtPos(t){return (this.length?0==t:this.side>0)?fi.before(this.dom):fi.after(this.dom,t==this.length)}domBoundsAround(){return null}coordsAt(t,e){let i=this.widget.coordsAt(this.dom,t,e);if(i)return i;let n=this.dom.getClientRects(),s=null;if(!n.length)return null;let r=this.side?this.side<0:t>0;for(let e=r?n.length-1:0;s=n[e],!(t>0?0==e:e==n.length-1||s.top<s.bottom);e+=r?-1:1);return ii(s,!r)}get isEditable(){return !1}get isWidget(){return !0}get isHidden(){return this.widget.isHidden}destroy(){super.destroy(),this.dom&&this.widget.destroy(this.dom);}}class Yi extends pi{constructor(t){super(),this.side=t;}get length(){return 0}merge(){return !1}become(t){return t instanceof Yi&&t.side==this.side}split(){return new Yi(this.side)}sync(){if(!this.dom){let t=document.createElement("img");t.className="cm-widgetBuffer",t.setAttribute("aria-hidden","true"),this.setDOM(t);}}getSide(){return this.side}domAtPos(t){return this.side>0?fi.before(this.dom):fi.after(this.dom)}localPosFromDOM(){return 0}domBoundsAround(){return null}coordsAt(t){return this.dom.getBoundingClientRect()}get overrideDOMText(){return B.empty}get isHidden(){return !0}}function Wi(t,e){let i=t.dom,{children:n}=t,s=0;for(let t=0;s<n.length;s++){let r=n[s],o=t+r.length;if(!(o==t&&r.getSide()<=0)){if(e>t&&e<o&&r.dom.parentNode==i)return r.domAtPos(e-t);if(e<=t)break;t=o;}}for(let t=s;t>0;t--){let e=n[t-1];if(e.dom.parentNode==i)return e.domAtPos(e.length)}for(let t=s;t<n.length;t++){let e=n[t];if(e.dom.parentNode==i)return e.domAtPos(0)}return new fi(i,0)}function Mi(t,e,i){let n,{children:s}=t;i>0&&e instanceof Ci&&s.length&&(n=s[s.length-1])instanceof Ci&&n.mark.eq(e.mark)?Mi(n,e.children[0],i-1):(s.push(e),e.setParent(t)),t.length+=e.length;}function ji(t,e,i){let n=null,s=-1,r=null,o=-1;!function t(e,a){for(let l=0,h=0;l<e.children.length&&h<=a;l++){let c=e.children[l],O=h+c.length;O>=a&&(c.children.length?t(c,a-h):(!r||r.isHidden&&i>0)&&(O>a||h==O&&c.getSide()>0)?(r=c,o=a-h):(h<a||h==O&&c.getSide()<0&&!c.isHidden)&&(n=c,s=a-h)),h=O;}}(t,e);let a=(i<0?n:r)||n||r;return a?a.coordsAt(Math.max(0,a==n?s:o),i):function(t){let e=t.dom.lastChild;if(!e)return t.dom.getBoundingClientRect();let i=He(e);return i[i.length-1]||null}(t)}function _i(t,e){for(let i in t)"class"==i&&e.class?e.class+=" "+t.class:"style"==i&&e.style?e.style+=";"+t.style:e[i]=t[i];return e}Ai.prototype.children=qi.prototype.children=Yi.prototype.children=di;const Ei=Object.create(null);function zi(t,e,i){if(t==e)return !0;t||(t=Ei),e||(e=Ei);let n=Object.keys(t),s=Object.keys(e);if(n.length-(i&&n.indexOf(i)>-1?1:0)!=s.length-(i&&s.indexOf(i)>-1?1:0))return !1;for(let r of n)if(r!=i&&(-1==s.indexOf(r)||t[r]!==e[r]))return !1;return !0}function Vi(t,e,i){let n=!1;if(e)for(let s in e)i&&s in i||(n=!0,"style"==s?t.style.cssText="":t.removeAttribute(s));if(i)for(let s in i)e&&e[s]==i[s]||(n=!0,"style"==s?t.style.cssText=i[s]:t.setAttribute(s,i[s]));return n}function Di(t){let e=Object.create(null);for(let i=0;i<t.attributes.length;i++){let n=t.attributes[i];e[n.name]=n.value;}return e}class Ui extends pi{constructor(){super(...arguments),this.children=[],this.length=0,this.prevAttrs=void 0,this.attrs=null,this.breakAfter=0;}merge(t,e,i,n,s,r){if(i){if(!(i instanceof Ui))return !1;this.dom||i.transferDOM(this);}return n&&this.setDeco(i?i.attrs:null),bi(this,t,e,i?i.children.slice():[],s,r),!0}split(t){let e=new Ui;if(e.breakAfter=this.breakAfter,0==this.length)return e;let{i:i,off:n}=this.childPos(t);n&&(e.append(this.children[i].split(n),0),this.children[i].merge(n,this.children[i].length,null,!1,0,0),i++);for(let t=i;t<this.children.length;t++)e.append(this.children[t],0);for(;i>0&&0==this.children[i-1].length;)this.children[--i].destroy();return this.children.length=i,this.markDirty(),this.length=t,e}transferDOM(t){this.dom&&(this.markDirty(),t.setDOM(this.dom),t.prevAttrs=void 0===this.prevAttrs?this.attrs:this.prevAttrs,this.prevAttrs=void 0,this.dom=null);}setDeco(t){zi(this.attrs,t)||(this.dom&&(this.prevAttrs=this.attrs,this.markDirty()),this.attrs=t);}append(t,e){Mi(this,t,e);}addLineDeco(t){let e=t.spec.attributes,i=t.spec.class;e&&(this.attrs=_i(e,this.attrs||{})),i&&(this.attrs=_i({class:i},this.attrs||{}));}domAtPos(t){return Wi(this,t)}reuseDOM(t){"DIV"==t.nodeName&&(this.setDOM(t),this.flags|=6);}sync(t,e){var i;this.dom?4&this.flags&&(Oi(this.dom),this.dom.className="cm-line",this.prevAttrs=this.attrs?null:void 0):(this.setDOM(document.createElement("div")),this.dom.className="cm-line",this.prevAttrs=this.attrs?null:void 0),void 0!==this.prevAttrs&&(Vi(this.dom,this.prevAttrs,this.attrs),this.dom.classList.add("cm-line"),this.prevAttrs=void 0),super.sync(t,e);let n=this.dom.lastChild;for(;n&&pi.get(n)instanceof Ci;)n=n.lastChild;if(!(n&&this.length&&("BR"==n.nodeName||0!=(null===(i=pi.get(n))||void 0===i?void 0:i.isEditable)||Ri.ios&&this.children.some((t=>t instanceof Ai))))){let t=document.createElement("BR");t.cmIgnore=!0,this.dom.appendChild(t);}}measureTextSize(){if(0==this.children.length||this.length>20)return null;let t,e=0;for(let i of this.children){if(!(i instanceof Ai)||/[^ -~]/.test(i.text))return null;let n=He(i.dom);if(1!=n.length)return null;e+=n[0].width,t=n[0].height;}return e?{lineHeight:this.dom.getBoundingClientRect().height,charWidth:e/this.length,textHeight:t}:null}coordsAt(t,e){let i=ji(this,t,e);if(!this.children.length&&i&&this.parent){let{heightOracle:t}=this.parent.view.viewState,e=i.bottom-i.top;if(Math.abs(e-t.lineHeight)<2&&t.textHeight<e){let n=(e-t.textHeight)/2;return {top:i.top+n,bottom:i.bottom-n,left:i.left,right:i.left}}}return i}become(t){return !1}covers(){return !0}static find(t,e){for(let i=0,n=0;i<t.children.length;i++){let s=t.children[i],r=n+s.length;if(r>=e){if(s instanceof Ui)return s;if(r>e)break}n=r+s.breakAfter;}return null}}class Ni extends pi{constructor(t,e,i){super(),this.widget=t,this.length=e,this.deco=i,this.breakAfter=0,this.prevWidget=null;}merge(t,e,i,n,s,r){return !(i&&(!(i instanceof Ni&&this.widget.compare(i.widget))||t>0&&s<=0||e<this.length&&r<=0))&&(this.length=t+(i?i.length:0)+(this.length-e),!0)}domAtPos(t){return 0==t?fi.before(this.dom):fi.after(this.dom,t==this.length)}split(t){let e=this.length-t;this.length=t;let i=new Ni(this.widget,e,this.deco);return i.breakAfter=this.breakAfter,i}get children(){return di}sync(t){this.dom&&this.widget.updateDOM(this.dom,t)||(this.dom&&this.prevWidget&&this.prevWidget.destroy(this.dom),this.prevWidget=null,this.setDOM(this.widget.toDOM(t)),this.widget.editable||(this.dom.contentEditable="false"));}get overrideDOMText(){return this.parent?this.parent.view.state.doc.slice(this.posAtStart,this.posAtEnd):B.empty}domBoundsAround(){return null}become(t){return t instanceof Ni&&t.widget.constructor==this.widget.constructor&&(t.widget.compare(this.widget)||this.markDirty(!0),this.dom&&!this.prevWidget&&(this.prevWidget=this.widget),this.widget=t.widget,this.length=t.length,this.deco=t.deco,this.breakAfter=t.breakAfter,!0)}ignoreMutation(){return !0}ignoreEvent(t){return this.widget.ignoreEvent(t)}get isEditable(){return !1}get isWidget(){return !0}coordsAt(t,e){return this.widget.coordsAt(this.dom,t,e)}destroy(){super.destroy(),this.dom&&this.widget.destroy(this.dom);}covers(t){let{startSide:e,endSide:i}=this.deco;return e!=i&&(t<0?e<0:i>0)}}class Gi{eq(t){return !1}updateDOM(t,e){return !1}compare(t){return this==t||this.constructor==t.constructor&&this.eq(t)}get estimatedHeight(){return -1}get lineBreaks(){return 0}ignoreEvent(t){return !0}coordsAt(t,e,i){return null}get isHidden(){return !1}get editable(){return !1}destroy(t){}}var Bi=function(t){return t[t.Text=0]="Text",t[t.WidgetBefore=1]="WidgetBefore",t[t.WidgetAfter=2]="WidgetAfter",t[t.WidgetRange=3]="WidgetRange",t}(Bi||(Bi={}));class Ii extends be{constructor(t,e,i,n){super(),this.startSide=t,this.endSide=e,this.widget=i,this.spec=n;}get heightRelevant(){return !1}static mark(t){return new Li(t)}static widget(t){let e=Math.max(-1e4,Math.min(1e4,t.side||0)),i=!!t.block;return e+=i&&!t.inlineOrder?e>0?3e8:-4e8:e>0?1e8:-1e8,new Hi(t,e,e,i,t.widget||null,!1)}static replace(t){let e,i,n=!!t.block;if(t.isBlockGap)e=-5e8,i=4e8;else {let{start:s,end:r}=Ji(t,n);e=(s?n?-3e8:-1:5e8)-1,i=1+(r?n?2e8:1:-6e8);}return new Hi(t,e,i,n,t.widget||null,!0)}static line(t){return new Fi(t)}static set(t,e=!1){return ye.of(t,e)}hasHeight(){return !!this.widget&&this.widget.estimatedHeight>-1}}Ii.none=ye.empty;class Li extends Ii{constructor(t){let{start:e,end:i}=Ji(t);super(e?-1:5e8,i?1:-6e8,null,t),this.tagName=t.tagName||"span",this.class=t.class||"",this.attrs=t.attributes||null;}eq(t){var e,i;return this==t||t instanceof Li&&this.tagName==t.tagName&&(this.class||(null===(e=this.attrs)||void 0===e?void 0:e.class))==(t.class||(null===(i=t.attrs)||void 0===i?void 0:i.class))&&zi(this.attrs,t.attrs,"class")}range(t,e=t){if(t>=e)throw new RangeError("Mark decorations may not be empty");return super.range(t,e)}}Li.prototype.point=!1;class Fi extends Ii{constructor(t){super(-2e8,-2e8,null,t);}eq(t){return t instanceof Fi&&this.spec.class==t.spec.class&&zi(this.spec.attributes,t.spec.attributes)}range(t,e=t){if(e!=t)throw new RangeError("Line decoration ranges must be zero-length");return super.range(t,e)}}Fi.prototype.mapMode=gt.TrackBefore,Fi.prototype.point=!0;class Hi extends Ii{constructor(t,e,i,n,s,r){super(e,i,s,t),this.block=n,this.isReplace=r,this.mapMode=n?e<=0?gt.TrackBefore:gt.TrackAfter:gt.TrackDel;}get type(){return this.startSide!=this.endSide?Bi.WidgetRange:this.startSide<=0?Bi.WidgetBefore:Bi.WidgetAfter}get heightRelevant(){return this.block||!!this.widget&&(this.widget.estimatedHeight>=5||this.widget.lineBreaks>0)}eq(t){return t instanceof Hi&&(e=this.widget,i=t.widget,e==i||!!(e&&i&&e.compare(i)))&&this.block==t.block&&this.startSide==t.startSide&&this.endSide==t.endSide;var e,i;}range(t,e=t){if(this.isReplace&&(t>e||t==e&&this.startSide>0&&this.endSide<=0))throw new RangeError("Invalid range for replacement decoration");if(!this.isReplace&&e!=t)throw new RangeError("Widget decorations can only have zero-length ranges");return super.range(t,e)}}function Ji(t,e=!1){let{inclusiveStart:i,inclusiveEnd:n}=t;return null==i&&(i=t.inclusive),null==n&&(n=t.inclusive),{start:null!=i?i:e,end:null!=n?n:e}}function Ki(t,e,i,n=0){let s=i.length-1;s>=0&&i[s]+n>=t?i[s]=Math.max(i[s],e):i.push(t,e);}Hi.prototype.point=!0;class tn{constructor(t,e,i,n){this.doc=t,this.pos=e,this.end=i,this.disallowBlockEffectsFor=n,this.content=[],this.curLine=null,this.breakAtStart=0,this.pendingBuffer=0,this.bufferMarks=[],this.atCursorPos=!0,this.openStart=-1,this.openEnd=-1,this.text="",this.textOff=0,this.cursor=t.iter(),this.skip=e;}posCovered(){if(0==this.content.length)return !this.breakAtStart&&this.doc.lineAt(this.pos).from!=this.pos;let t=this.content[this.content.length-1];return !(t.breakAfter||t instanceof Ni&&t.deco.endSide<0)}getLine(){return this.curLine||(this.content.push(this.curLine=new Ui),this.atCursorPos=!0),this.curLine}flushBuffer(t=this.bufferMarks){this.pendingBuffer&&(this.curLine.append(en(new Yi(-1),t),t.length),this.pendingBuffer=0);}addBlockWidget(t){this.flushBuffer(),this.curLine=null,this.content.push(t);}finish(t){this.pendingBuffer&&t<=this.bufferMarks.length?this.flushBuffer():this.pendingBuffer=0,this.posCovered()||t&&this.content.length&&this.content[this.content.length-1]instanceof Ni||this.getLine();}buildText(t,e,i){for(;t>0;){if(this.textOff==this.text.length){let{value:e,lineBreak:i,done:n}=this.cursor.next(this.skip);if(this.skip=0,n)throw new Error("Ran out of text content when drawing inline views");if(i){this.posCovered()||this.getLine(),this.content.length?this.content[this.content.length-1].breakAfter=1:this.breakAtStart=1,this.flushBuffer(),this.curLine=null,this.atCursorPos=!0,t--;continue}this.text=e,this.textOff=0;}let n=Math.min(this.text.length-this.textOff,t,512);this.flushBuffer(e.slice(e.length-i)),this.getLine().append(en(new Ai(this.text.slice(this.textOff,this.textOff+n)),e),i),this.atCursorPos=!0,this.textOff+=n,t-=n,i=0;}}span(t,e,i,n){this.buildText(e-t,i,n),this.pos=e,this.openStart<0&&(this.openStart=n);}point(t,e,i,n,s,r){if(this.disallowBlockEffectsFor[r]&&i instanceof Hi){if(i.block)throw new RangeError("Block decorations may not be specified via plugins");if(e>this.doc.lineAt(this.pos).to)throw new RangeError("Decorations that replace line breaks may not be specified via plugins")}let o=e-t;if(i instanceof Hi)if(i.block)i.startSide>0&&!this.posCovered()&&this.getLine(),this.addBlockWidget(new Ni(i.widget||new nn("div"),o,i));else {let r=qi.create(i.widget||new nn("span"),o,o?0:i.startSide),a=this.atCursorPos&&!r.isEditable&&s<=n.length&&(t<e||i.startSide>0),l=!r.isEditable&&(t<e||s>n.length||i.startSide<=0),h=this.getLine();2!=this.pendingBuffer||a||r.isEditable||(this.pendingBuffer=0),this.flushBuffer(n),a&&(h.append(en(new Yi(1),n),s),s=n.length+Math.max(0,s-n.length)),h.append(en(r,n),s),this.atCursorPos=l,this.pendingBuffer=l?t<e||s>n.length?1:2:0,this.pendingBuffer&&(this.bufferMarks=n.slice());}else this.doc.lineAt(this.pos).from==this.pos&&this.getLine().addLineDeco(i);o&&(this.textOff+o<=this.text.length?this.textOff+=o:(this.skip+=o-(this.text.length-this.textOff),this.text="",this.textOff=0),this.pos=e),this.openStart<0&&(this.openStart=s);}static build(t,e,i,n,s){let r=new tn(t,e,i,s);return r.openEnd=ye.spans(n,e,i,r),r.openStart<0&&(r.openStart=r.openEnd),r.finish(r.openEnd),r}}function en(t,e){for(let i of e)t=new Ci(i,[t],t.length);return t}class nn extends Gi{constructor(t){super(),this.tag=t;}eq(t){return t.tag==this.tag}toDOM(){return document.createElement(this.tag)}updateDOM(t){return t.nodeName.toLowerCase()==this.tag}get isHidden(){return !0}}var sn=function(t){return t[t.LTR=0]="LTR",t[t.RTL=1]="RTL",t}(sn||(sn={}));const rn=sn.LTR,on=sn.RTL;function an(t){let e=[];for(let i=0;i<t.length;i++)e.push(1<<+t[i]);return e}const ln=an("88888888888888888888888888888888888666888888787833333333337888888000000000000000000000000008888880000000000000000000000000088888888888888888888888888888888888887866668888088888663380888308888800000000000000000000000800000000000000000000000000000008"),hn=an("4444448826627288999999999992222222222222222222222222222222222222222222222229999999999999999999994444444444644222822222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222999999949999999229989999223333333333"),cn=Object.create(null),On=[];for(let t of ["()","[]","{}"]){let e=t.charCodeAt(0),i=t.charCodeAt(1);cn[e]=i,cn[i]=-e;}function un(t){return t<=247?ln[t]:1424<=t&&t<=1524?2:1536<=t&&t<=1785?hn[t-1536]:1774<=t&&t<=2220?4:8192<=t&&t<=8204?256:64336<=t&&t<=65023?4:1}const fn=/[\u0590-\u05f4\u0600-\u06ff\u0700-\u08ac\ufb50-\ufdff]/;class dn{get dir(){return this.level%2?on:rn}constructor(t,e,i){this.from=t,this.to=e,this.level=i;}side(t,e){return this.dir==e==t?this.to:this.from}forward(t,e){return t==(this.dir==e)}static find(t,e,i,n){let s=-1;for(let r=0;r<t.length;r++){let o=t[r];if(o.from<=e&&o.to>=e){if(o.level==i)return r;(s<0||(0!=n?n<0?o.from<e:o.to>e:t[s].level>o.level))&&(s=r);}}if(s<0)throw new RangeError("Index out of range");return s}}function pn(t,e){if(t.length!=e.length)return !1;for(let i=0;i<t.length;i++){let n=t[i],s=e[i];if(n.from!=s.from||n.to!=s.to||n.direction!=s.direction||!pn(n.inner,s.inner))return !1}return !0}const gn=[];function mn(t,e,i,n,s,r,o){let a=n%2?2:1;if(n%2==s%2)for(let l=e,h=0;l<i;){let e=!0,c=!1;if(h==r.length||l<r[h].from){let t=gn[l];t!=a&&(e=!1,c=16==t);}let O=e||1!=a?null:[],u=e?n:n+1,f=l;t:for(;;)if(h<r.length&&f==r[h].from){if(c)break t;let d=r[h];if(!e)for(let t=d.to,e=h+1;;){if(t==i)break t;if(!(e<r.length&&r[e].from==t)){if(gn[t]==a)break t;break}t=r[e++].to;}if(h++,O)O.push(d);else {d.from>l&&o.push(new dn(l,d.from,u)),wn(t,d.direction==rn!=!(u%2)?n+1:n,s,d.inner,d.from,d.to,o),l=d.to;}f=d.to;}else {if(f==i||(e?gn[f]!=a:gn[f]==a))break;f++;}O?mn(t,l,f,n+1,s,O,o):l<f&&o.push(new dn(l,f,u)),l=f;}else for(let l=i,h=r.length;l>e;){let i=!0,c=!1;if(!h||l>r[h-1].to){let t=gn[l-1];t!=a&&(i=!1,c=16==t);}let O=i||1!=a?null:[],u=i?n:n+1,f=l;t:for(;;)if(h&&f==r[h-1].to){if(c)break t;let d=r[--h];if(!i)for(let t=d.from,i=h;;){if(t==e)break t;if(!i||r[i-1].to!=t){if(gn[t-1]==a)break t;break}t=r[--i].from;}if(O)O.push(d);else {d.to<l&&o.push(new dn(d.to,l,u)),wn(t,d.direction==rn!=!(u%2)?n+1:n,s,d.inner,d.from,d.to,o),l=d.from;}f=d.from;}else {if(f==e||(i?gn[f-1]!=a:gn[f-1]==a))break;f--;}O?mn(t,f,l,n+1,s,O,o):f<l&&o.push(new dn(f,l,u)),l=f;}}function wn(t,e,i,n,s,r,o){let a=e%2?2:1;!function(t,e,i,n,s){for(let r=0;r<=n.length;r++){let o=r?n[r-1].to:e,a=r<n.length?n[r].from:i,l=r?256:s;for(let e=o,i=l,n=l;e<a;e++){let s=un(t.charCodeAt(e));512==s?s=i:8==s&&4==n&&(s=16),gn[e]=4==s?2:s,7&s&&(n=s),i=s;}for(let t=o,e=l,n=l;t<a;t++){let s=gn[t];if(128==s)t<a-1&&e==gn[t+1]&&24&e?s=gn[t]=e:gn[t]=256;else if(64==s){let s=t+1;for(;s<a&&64==gn[s];)s++;let r=t&&8==e||s<i&&8==gn[s]?1==n?1:8:256;for(let e=t;e<s;e++)gn[e]=r;t=s-1;}else 8==s&&1==n&&(gn[t]=1);e=s,7&s&&(n=s);}}}(t,s,r,n,a),function(t,e,i,n,s){let r=1==s?2:1;for(let o=0,a=0,l=0;o<=n.length;o++){let h=o?n[o-1].to:e,c=o<n.length?n[o].from:i;for(let e,i,n,o=h;o<c;o++)if(i=cn[e=t.charCodeAt(o)])if(i<0){for(let t=a-3;t>=0;t-=3)if(On[t+1]==-i){let e=On[t+2],i=2&e?s:4&e?1&e?r:s:0;i&&(gn[o]=gn[On[t]]=i),a=t;break}}else {if(189==On.length)break;On[a++]=o,On[a++]=e,On[a++]=l;}else if(2==(n=gn[o])||1==n){let t=n==s;l=t?0:1;for(let e=a-3;e>=0;e-=3){let i=On[e+2];if(2&i)break;if(t)On[e+2]|=2;else {if(4&i)break;On[e+2]|=4;}}}}}(t,s,r,n,a),function(t,e,i,n){for(let s=0,r=n;s<=i.length;s++){let o=s?i[s-1].to:t,a=s<i.length?i[s].from:e;for(let l=o;l<a;){let o=gn[l];if(256==o){let o=l+1;for(;;)if(o==a){if(s==i.length)break;o=i[s++].to,a=s<i.length?i[s].from:e;}else {if(256!=gn[o])break;o++;}let h=1==r,c=h==(1==(o<e?gn[o]:n))?h?1:2:n;for(let e=o,n=s,r=n?i[n-1].to:t;e>l;)e==r&&(e=i[--n].from,r=n?i[n-1].to:t),gn[--e]=c;l=o;}else r=o,l++;}}}(s,r,n,a),mn(t,s,r,e,i,n,o);}function bn(t){return [new dn(0,t,0)]}let Sn="";function Qn(t,e,i,n,s){var r;let o=n.head-t.from,a=dn.find(e,o,null!==(r=n.bidiLevel)&&void 0!==r?r:-1,n.assoc),l=e[a],h=l.side(s,i);if(o==h){let t=a+=s?1:-1;if(t<0||t>=e.length)return null;l=e[a=t],o=l.side(!s,i),h=l.side(s,i);}let c=at(t.text,o,l.forward(s,i));(c<l.from||c>l.to)&&(c=h),Sn=t.text.slice(Math.min(o,c),Math.max(o,c));let O=a==(s?e.length-1:0)?null:e[a+(s?1:-1)];return O&&c==h&&O.level+(s?0:1)<l.level?kt.cursor(O.side(!s,i)+t.from,O.forward(s,i)?1:-1,O.level):kt.cursor(c+t.from,l.forward(s,i)?-1:1,l.level)}function xn(t,e,i){for(let n=e;n<i;n++){let e=un(t.charCodeAt(n));if(1==e)return rn;if(2==e||4==e)return on}return rn}const yn=Xt.define(),vn=Xt.define(),Pn=Xt.define(),kn=Xt.define(),$n=Xt.define(),Zn=Xt.define(),Xn=Xt.define(),Tn=Xt.define({combine:t=>t.some((t=>t))}),Rn=Xt.define({combine:t=>t.some((t=>t))});class An{constructor(t,e="nearest",i="nearest",n=5,s=5,r=!1){this.range=t,this.y=e,this.x=i,this.yMargin=n,this.xMargin=s,this.isSnapshot=r;}map(t){return t.empty?this:new An(this.range.map(t),this.y,this.x,this.yMargin,this.xMargin,this.isSnapshot)}clip(t){return this.range.to<=t.doc.length?this:new An(kt.cursor(t.doc.length),this.y,this.x,this.yMargin,this.xMargin,this.isSnapshot)}}const Cn=re.define({map:(t,e)=>t.map(e)});function qn(t,e,i){let n=t.facet(kn);n.length?n[0](e):window.onerror?window.onerror(String(e),i,void 0,void 0,e):i?(void 0):(void 0);}const Yn=Xt.define({combine:t=>!t.length||t[0]});let Wn=0;const Mn=Xt.define();class jn{constructor(t,e,i,n,s){this.id=t,this.create=e,this.domEventHandlers=i,this.domEventObservers=n,this.extension=s(this);}static define(t,e){const{eventHandlers:i,eventObservers:n,provide:s,decorations:r}=e||{};return new jn(Wn++,t,i,n,(t=>{let e=[Mn.of(t)];return r&&e.push(Vn.of((e=>{let i=e.plugin(t);return i?r(i):Ii.none}))),s&&e.push(s(t)),e}))}static fromClass(t,e){return jn.define((e=>new t(e)),e)}}class _n{constructor(t){this.spec=t,this.mustUpdate=null,this.value=null;}update(t){if(this.value){if(this.mustUpdate){let t=this.mustUpdate;if(this.mustUpdate=null,this.value.update)try{this.value.update(t);}catch(e){if(qn(t.state,e,"CodeMirror plugin crashed"),this.value.destroy)try{this.value.destroy();}catch(t){}this.deactivate();}}}else if(this.spec)try{this.value=this.spec.create(t);}catch(e){qn(t.state,e,"CodeMirror plugin crashed"),this.deactivate();}return this}destroy(t){var e;if(null===(e=this.value)||void 0===e?void 0:e.destroy)try{this.value.destroy();}catch(e){qn(t.state,e,"CodeMirror plugin crashed");}}deactivate(){this.spec=this.value=null;}}const En=Xt.define(),zn=Xt.define(),Vn=Xt.define(),Dn=Xt.define(),Un=Xt.define(),Nn=Xt.define();function Gn(t,e){let i=t.state.facet(Nn);if(!i.length)return i;let n=i.map((e=>e instanceof Function?e(t):e)),s=[];return ye.spans(n,e.from,e.to,{point(){},span(t,i,n,r){let o=t-e.from,a=i-e.from,l=s;for(let t=n.length-1;t>=0;t--,r--){let i,s=n[t].spec.bidiIsolate;if(null==s&&(s=xn(e.text,o,a)),r>0&&l.length&&(i=l[l.length-1]).to==o&&i.direction==s)i.to=a,l=i.inner;else {let t={from:o,to:a,direction:s,inner:[]};l.push(t),l=t.inner;}}}}),s}const Bn=Xt.define();function In(t){let e=0,i=0,n=0,s=0;for(let r of t.state.facet(Bn)){let o=r(t);o&&(null!=o.left&&(e=Math.max(e,o.left)),null!=o.right&&(i=Math.max(i,o.right)),null!=o.top&&(n=Math.max(n,o.top)),null!=o.bottom&&(s=Math.max(s,o.bottom)));}return {left:e,right:i,top:n,bottom:s}}const Ln=Xt.define();class Fn{constructor(t,e,i,n){this.fromA=t,this.toA=e,this.fromB=i,this.toB=n;}join(t){return new Fn(Math.min(this.fromA,t.fromA),Math.max(this.toA,t.toA),Math.min(this.fromB,t.fromB),Math.max(this.toB,t.toB))}addToSet(t){let e=t.length,i=this;for(;e>0;e--){let n=t[e-1];if(!(n.fromA>i.toA)){if(n.toA<i.fromA)break;i=i.join(n),t.splice(e-1,1);}}return t.splice(e,0,i),t}static extendWithRanges(t,e){if(0==e.length)return t;let i=[];for(let n=0,s=0,r=0,o=0;;n++){let a=n==t.length?null:t[n],l=r-o,h=a?a.fromB:1e9;for(;s<e.length&&e[s]<h;){let t=e[s],n=e[s+1],r=Math.max(o,t),a=Math.min(h,n);if(r<=a&&new Fn(r+l,a+l,r,a).addToSet(i),n>h)break;s+=2;}if(!a)return i;new Fn(a.fromA,a.toA,a.fromB,a.toB).addToSet(i),r=a.toA,o=a.toB;}}}class Hn{constructor(t,e,i){this.view=t,this.state=e,this.transactions=i,this.flags=0,this.startState=t.state,this.changes=wt.empty(this.startState.doc.length);for(let t of i)this.changes=this.changes.compose(t.changes);let n=[];this.changes.iterChangedRanges(((t,e,i,s)=>n.push(new Fn(t,e,i,s)))),this.changedRanges=n;}static create(t,e,i){return new Hn(t,e,i)}get viewportChanged(){return (4&this.flags)>0}get heightChanged(){return (2&this.flags)>0}get geometryChanged(){return this.docChanged||(10&this.flags)>0}get focusChanged(){return (1&this.flags)>0}get docChanged(){return !this.changes.empty}get selectionSet(){return this.transactions.some((t=>t.selection))}get empty(){return 0==this.flags&&0==this.transactions.length}}class Jn extends pi{get length(){return this.view.state.doc.length}constructor(t){super(),this.view=t,this.decorations=[],this.dynamicDecorationMap=[],this.domChanged=null,this.hasComposition=null,this.markedForComposition=new Set,this.minWidth=0,this.minWidthFrom=0,this.minWidthTo=0,this.impreciseAnchor=null,this.impreciseHead=null,this.forceSelection=!1,this.lastUpdate=Date.now(),this.setDOM(t.contentDOM),this.children=[new Ui],this.children[0].setParent(this),this.updateDeco(),this.updateInner([new Fn(0,0,0,t.state.doc.length)],0,null);}update(t){var e;let i=t.changedRanges;this.minWidth>0&&i.length&&(i.every((({fromA:t,toA:e})=>e<this.minWidthFrom||t>this.minWidthTo))?(this.minWidthFrom=t.changes.mapPos(this.minWidthFrom,1),this.minWidthTo=t.changes.mapPos(this.minWidthTo,1)):this.minWidth=this.minWidthFrom=this.minWidthTo=0);let n=-1;this.view.inputState.composing>=0&&((null===(e=this.domChanged)||void 0===e?void 0:e.newSel)?n=this.domChanged.newSel.head:function(t,e){let i=!1;e&&t.iterChangedRanges(((t,n)=>{t<e.to&&n>e.from&&(i=!0);}));return i}(t.changes,this.hasComposition)||t.selectionSet||(n=t.state.selection.main.head));let s=n>-1?function(t,e,i){let n=ts(t,i);if(!n)return null;let{node:s,from:r,to:o}=n,a=s.nodeValue;if(/[\n\r]/.test(a))return null;if(t.state.doc.sliceString(n.from,n.to)!=a)return null;let l=e.invertedDesc,h=new Fn(l.mapPos(r),l.mapPos(o),r,o),c=[];for(let e=s.parentNode;;e=e.parentNode){let i=pi.get(e);if(i instanceof Ci)c.push({node:e,deco:i.mark});else {if(i instanceof Ui||"DIV"==e.nodeName&&e.parentNode==t.contentDOM)return {range:h,text:s,marks:c,line:e};if(e==t.contentDOM)return null;c.push({node:e,deco:new Li({inclusive:!0,attributes:Di(e),tagName:e.tagName.toLowerCase()})});}}}(this.view,t.changes,n):null;if(this.domChanged=null,this.hasComposition){this.markedForComposition.clear();let{from:e,to:n}=this.hasComposition;i=new Fn(e,n,t.changes.mapPos(e,-1),t.changes.mapPos(n,1)).addToSet(i.slice());}this.hasComposition=s?{from:s.range.fromB,to:s.range.toB}:null,(Ri.ie||Ri.chrome)&&!s&&t&&t.state.doc.lines!=t.startState.doc.lines&&(this.forceSelection=!0);let r=function(t,e,i){let n=new is;return ye.compare(t,e,i,n),n.changes}(this.decorations,this.updateDeco(),t.changes);return i=Fn.extendWithRanges(i,r),!!(7&this.flags||0!=i.length)&&(this.updateInner(i,t.startState.doc.length,s),t.transactions.length&&(this.lastUpdate=Date.now()),!0)}updateInner(t,e,i){this.view.viewState.mustMeasureContent=!0,this.updateChildren(t,e,i);let{observer:n}=this.view;n.ignore((()=>{this.dom.style.height=this.view.viewState.contentHeight/this.view.scaleY+"px",this.dom.style.flexBasis=this.minWidth?this.minWidth+"px":"";let t=Ri.chrome||Ri.ios?{node:n.selectionRange.focusNode,written:!1}:void 0;this.sync(this.view,t),this.flags&=-8,t&&(t.written||n.selectionRange.focusNode!=t.node)&&(this.forceSelection=!0),this.dom.style.height="";})),this.markedForComposition.forEach((t=>t.flags&=-9));let s=[];if(this.view.viewport.from||this.view.viewport.to<this.view.state.doc.length)for(let t of this.children)t instanceof Ni&&t.widget instanceof Kn&&s.push(t.dom);n.updateGaps(s);}updateChildren(t,e,i){let n=i?i.range.addToSet(t.slice()):t,s=this.childCursor(e);for(let t=n.length-1;;t--){let e=t>=0?n[t]:null;if(!e)break;let r,o,a,l,{fromA:h,toA:c,fromB:O,toB:u}=e;if(i&&i.range.fromB<u&&i.range.toB>O){let t=tn.build(this.view.state.doc,O,i.range.fromB,this.decorations,this.dynamicDecorationMap),e=tn.build(this.view.state.doc,i.range.toB,u,this.decorations,this.dynamicDecorationMap);o=t.breakAtStart,a=t.openStart,l=e.openEnd;let n=this.compositionView(i);e.breakAtStart?n.breakAfter=1:e.content.length&&n.merge(n.length,n.length,e.content[0],!1,e.openStart,0)&&(n.breakAfter=e.content[0].breakAfter,e.content.shift()),t.content.length&&n.merge(0,0,t.content[t.content.length-1],!0,0,t.openEnd)&&t.content.pop(),r=t.content.concat(n).concat(e.content);}else ({content:r,breakAtStart:o,openStart:a,openEnd:l}=tn.build(this.view.state.doc,O,u,this.decorations,this.dynamicDecorationMap));let{i:f,off:d}=s.findPos(c,1),{i:p,off:g}=s.findPos(h,-1);wi(this,p,g,f,d,r,o,a,l);}i&&this.fixCompositionDOM(i);}compositionView(t){let e=new Ai(t.text.nodeValue);e.flags|=8;for(let{deco:i}of t.marks)e=new Ci(i,[e],e.length);let i=new Ui;return i.append(e,0),i}fixCompositionDOM(t){let e=(t,e)=>{e.flags|=8|(e.children.some((t=>7&t.flags))?1:0),this.markedForComposition.add(e);let i=pi.get(t);i&&i!=e&&(i.dom=null),e.setDOM(t);},i=this.childPos(t.range.fromB,1),n=this.children[i.i];e(t.line,n);for(let s=t.marks.length-1;s>=-1;s--)i=n.childPos(i.off,1),n=n.children[i.i],e(s>=0?t.marks[s].node:t.text,n);}updateSelection(t=!1,e=!1){!t&&this.view.observer.selectionRange.focusNode||this.view.observer.readSelectionRange();let i=this.view.root.activeElement,n=i==this.dom,s=!n&&Fe(this.dom,this.view.observer.selectionRange)&&!(i&&this.dom.contains(i));if(!(n||e||s))return;let r=this.forceSelection;this.forceSelection=!1;let o=this.view.state.selection.main,a=this.moveToLine(this.domAtPos(o.anchor)),l=o.empty?a:this.moveToLine(this.domAtPos(o.head));if(Ri.gecko&&o.empty&&!this.hasComposition&&(1==(h=a).node.nodeType&&h.node.firstChild&&(0==h.offset||"false"==h.node.childNodes[h.offset-1].contentEditable)&&(h.offset==h.node.childNodes.length||"false"==h.node.childNodes[h.offset].contentEditable))){let t=document.createTextNode("");this.view.observer.ignore((()=>a.node.insertBefore(t,a.node.childNodes[a.offset]||null))),a=l=new fi(t,0),r=!0;}var h;let c=this.view.observer.selectionRange;!r&&c.focusNode&&(Je(a.node,a.offset,c.anchorNode,c.anchorOffset)&&Je(l.node,l.offset,c.focusNode,c.focusOffset)||this.suppressWidgetCursorChange(c,o))||(this.view.observer.ignore((()=>{Ri.android&&Ri.chrome&&this.dom.contains(c.focusNode)&&function(t,e){for(let i=t;i&&i!=e;i=i.assignedSlot||i.parentNode)if(1==i.nodeType&&"false"==i.contentEditable)return !0;return !1}(c.focusNode,this.dom)&&(this.dom.blur(),this.dom.focus({preventScroll:!0}));let t=Ie(this.view.root);if(t)if(o.empty){if(Ri.gecko){let t=(e=a.node,n=a.offset,1!=e.nodeType?0:(n&&"false"==e.childNodes[n-1].contentEditable?1:0)|(n<e.childNodes.length&&"false"==e.childNodes[n].contentEditable?2:0));if(t&&3!=t){let e=es(a.node,a.offset,1==t?1:-1);e&&(a=new fi(e.node,e.offset));}}t.collapse(a.node,a.offset),null!=o.bidiLevel&&void 0!==t.caretBidiLevel&&(t.caretBidiLevel=o.bidiLevel);}else if(t.extend){t.collapse(a.node,a.offset);try{t.extend(l.node,l.offset);}catch(t){}}else {let e=document.createRange();o.anchor>o.head&&([a,l]=[l,a]),e.setEnd(l.node,l.offset),e.setStart(a.node,a.offset),t.removeAllRanges(),t.addRange(e);}var e,n;s&&this.view.root.activeElement==this.dom&&(this.dom.blur(),i&&i.focus());})),this.view.observer.setSelectionRange(a,l)),this.impreciseAnchor=a.precise?null:new fi(c.anchorNode,c.anchorOffset),this.impreciseHead=l.precise?null:new fi(c.focusNode,c.focusOffset);}suppressWidgetCursorChange(t,e){return this.hasComposition&&e.empty&&Je(t.focusNode,t.focusOffset,t.anchorNode,t.anchorOffset)&&this.posFromDOM(t.focusNode,t.focusOffset)==e.head}enforceCursorAssoc(){if(this.hasComposition)return;let{view:t}=this,e=t.state.selection.main,i=Ie(t.root),{anchorNode:n,anchorOffset:s}=t.observer.selectionRange;if(!(i&&e.empty&&e.assoc&&i.modify))return;let r=Ui.find(this,e.head);if(!r)return;let o=r.posAtStart;if(e.head==o||e.head==o+r.length)return;let a=this.coordsAt(e.head,-1),l=this.coordsAt(e.head,1);if(!a||!l||a.bottom>l.top)return;let h=this.domAtPos(e.head+e.assoc);i.collapse(h.node,h.offset),i.modify("move",e.assoc<0?"forward":"backward","lineboundary"),t.observer.readSelectionRange();let c=t.observer.selectionRange;t.docView.posFromDOM(c.anchorNode,c.anchorOffset)!=e.from&&i.collapse(n,s);}moveToLine(t){let e,i=this.dom;if(t.node!=i)return t;for(let n=t.offset;!e&&n<i.childNodes.length;n++){let t=pi.get(i.childNodes[n]);t instanceof Ui&&(e=t.domAtPos(0));}for(let n=t.offset-1;!e&&n>=0;n--){let t=pi.get(i.childNodes[n]);t instanceof Ui&&(e=t.domAtPos(t.length));}return e?new fi(e.node,e.offset,!0):t}nearest(t){for(let e=t;e;){let t=pi.get(e);if(t&&t.rootView==this)return t;e=e.parentNode;}return null}posFromDOM(t,e){let i=this.nearest(t);if(!i)throw new RangeError("Trying to find position for a DOM position outside of the document");return i.localPosFromDOM(t,e)+i.posAtStart}domAtPos(t){let{i:e,off:i}=this.childCursor().findPos(t,-1);for(;e<this.children.length-1;){let t=this.children[e];if(i<t.length||t instanceof Ui)break;e++,i=0;}return this.children[e].domAtPos(i)}coordsAt(t,e){let i=null,n=0;for(let s=this.length,r=this.children.length-1;r>=0;r--){let o=this.children[r],a=s-o.breakAfter,l=a-o.length;if(a<t)break;l<=t&&(l<t||o.covers(-1))&&(a>t||o.covers(1))&&(!i||o instanceof Ui&&!(i instanceof Ui&&e>=0))&&(i=o,n=l),s=l;}return i?i.coordsAt(t-n,e):null}coordsForChar(t){let{i:e,off:i}=this.childPos(t,1),n=this.children[e];if(!(n instanceof Ui))return null;for(;n.children.length;){let{i:t,off:e}=n.childPos(i,1);for(;;t++){if(t==n.children.length)return null;if((n=n.children[t]).length)break}i=e;}if(!(n instanceof Ai))return null;let s=at(n.text,i);if(s==i)return null;let r=hi(n.dom,i,s).getClientRects();for(let t=0;t<r.length;t++){let e=r[t];if(t==r.length-1||e.top<e.bottom&&e.left<e.right)return e}return null}measureVisibleLineHeights(t){let e=[],{from:i,to:n}=t,s=this.view.contentDOM.clientWidth,r=s>Math.max(this.view.scrollDOM.clientWidth,this.minWidth)+1,o=-1,a=this.view.textDirection==sn.LTR;for(let t=0,l=0;l<this.children.length;l++){let h=this.children[l],c=t+h.length;if(c>n)break;if(t>=i){let i=h.dom.getBoundingClientRect();if(e.push(i.height),r){let e=h.dom.lastChild,n=e?He(e):[];if(n.length){let e=n[n.length-1],r=a?e.right-i.left:i.right-e.left;r>o&&(o=r,this.minWidth=s,this.minWidthFrom=t,this.minWidthTo=c);}}}t=c+h.breakAfter;}return e}textDirectionAt(t){let{i:e}=this.childPos(t,1);return "rtl"==getComputedStyle(this.children[e].dom).direction?sn.RTL:sn.LTR}measureTextSize(){for(let t of this.children)if(t instanceof Ui){let e=t.measureTextSize();if(e)return e}let t,e,i,n=document.createElement("div");return n.className="cm-line",n.style.width="99999px",n.style.position="absolute",n.textContent="abc def ghi jkl mno pqr stu",this.view.observer.ignore((()=>{this.dom.appendChild(n);let s=He(n.firstChild)[0];t=n.getBoundingClientRect().height,e=s?s.width/27:7,i=s?s.height:t,n.remove();})),{lineHeight:t,charWidth:e,textHeight:i}}childCursor(t=this.length){let e=this.children.length;return e&&(t-=this.children[--e].length),new mi(this.children,t,e)}computeBlockGapDeco(){let t=[],e=this.view.viewState;for(let i=0,n=0;;n++){let s=n==e.viewports.length?null:e.viewports[n],r=s?s.from-1:this.length;if(r>i){let n=(e.lineBlockAt(r).bottom-e.lineBlockAt(i).top)/this.view.scaleY;t.push(Ii.replace({widget:new Kn(n),block:!0,inclusive:!0,isBlockGap:!0}).range(i,r));}if(!s)break;i=s.to+1;}return Ii.set(t)}updateDeco(){let t=this.view.state.facet(Vn).map(((t,e)=>(this.dynamicDecorationMap[e]="function"==typeof t)?t(this.view):t)),e=!1,i=this.view.state.facet(Dn).map(((t,i)=>{let n="function"==typeof t;return n&&(e=!0),n?t(this.view):t}));i.length&&(this.dynamicDecorationMap[t.length]=e,t.push(ye.join(i)));for(let e=t.length;e<t.length+3;e++)this.dynamicDecorationMap[e]=!1;return this.decorations=[...t,this.computeBlockGapDeco(),this.view.viewState.lineGapDeco]}scrollIntoView(t){if(t.isSnapshot){let e=this.view.viewState.lineBlockAt(t.range.head);return this.view.scrollDOM.scrollTop=e.top-t.yMargin,void(this.view.scrollDOM.scrollLeft=t.xMargin)}let e,{range:i}=t,n=this.coordsAt(i.head,i.empty?i.assoc:i.head>i.anchor?-1:1);if(!n)return;!i.empty&&(e=this.coordsAt(i.anchor,i.anchor>i.head?-1:1))&&(n={left:Math.min(n.left,e.left),top:Math.min(n.top,e.top),right:Math.max(n.right,e.right),bottom:Math.max(n.bottom,e.bottom)});let s=In(this.view),r={left:n.left-s.left,top:n.top-s.top,right:n.right+s.right,bottom:n.bottom+s.bottom},{offsetWidth:o,offsetHeight:a}=this.view.scrollDOM;!function(t,e,i,n,s,r,o,a){let l=t.ownerDocument,h=l.defaultView||window;for(let c=t,O=!1;c&&!O;)if(1==c.nodeType){let t,u=c==l.body,f=1,d=1;if(u)t=ni(h);else {if(/^(fixed|sticky)$/.test(getComputedStyle(c).position)&&(O=!0),c.scrollHeight<=c.clientHeight&&c.scrollWidth<=c.clientWidth){c=c.assignedSlot||c.parentNode;continue}let e=c.getBoundingClientRect();(({scaleX:f,scaleY:d}=si(c,e))),t={left:e.left,right:e.left+c.clientWidth*f,top:e.top,bottom:e.top+c.clientHeight*d};}let p=0,g=0;if("nearest"==s)e.top<t.top?(g=-(t.top-e.top+o),i>0&&e.bottom>t.bottom+g&&(g=e.bottom-t.bottom+g+o)):e.bottom>t.bottom&&(g=e.bottom-t.bottom+o,i<0&&e.top-g<t.top&&(g=-(t.top+g-e.top+o)));else {let n=e.bottom-e.top,r=t.bottom-t.top;g=("center"==s&&n<=r?e.top+n/2-r/2:"start"==s||"center"==s&&i<0?e.top-o:e.bottom-r+o)-t.top;}if("nearest"==n?e.left<t.left?(p=-(t.left-e.left+r),i>0&&e.right>t.right+p&&(p=e.right-t.right+p+r)):e.right>t.right&&(p=e.right-t.right+r,i<0&&e.left<t.left+p&&(p=-(t.left+p-e.left+r))):p=("center"==n?e.left+(e.right-e.left)/2-(t.right-t.left)/2:"start"==n==a?e.left-r:e.right-(t.right-t.left)+r)-t.left,p||g)if(u)h.scrollBy(p,g);else {let t=0,i=0;if(g){let t=c.scrollTop;c.scrollTop+=g/d,i=(c.scrollTop-t)*d;}if(p){let e=c.scrollLeft;c.scrollLeft+=p/f,t=(c.scrollLeft-e)*f;}e={left:e.left-t,top:e.top-i,right:e.right-t,bottom:e.bottom-i},t&&Math.abs(t-p)<1&&(n="nearest"),i&&Math.abs(i-g)<1&&(s="nearest");}if(u)break;c=c.assignedSlot||c.parentNode;}else {if(11!=c.nodeType)break;c=c.host;}}(this.view.scrollDOM,r,i.head<i.anchor?-1:1,t.x,t.y,Math.max(Math.min(t.xMargin,o),-o),Math.max(Math.min(t.yMargin,a),-a),this.view.textDirection==sn.LTR);}}class Kn extends Gi{constructor(t){super(),this.height=t;}toDOM(){let t=document.createElement("div");return t.className="cm-gap",this.updateDOM(t),t}eq(t){return t.height==this.height}updateDOM(t){return t.style.height=this.height+"px",!0}get editable(){return !0}get estimatedHeight(){return this.height}}function ts(t,e){let i=t.observer.selectionRange,n=i.focusNode&&es(i.focusNode,i.focusOffset,0);if(!n)return null;let s=e-n.offset;return {from:s,to:s+n.node.nodeValue.length,node:n.node}}function es(t,e,i){if(i<=0)for(let i=t,n=e;;){if(3==i.nodeType)return {node:i,offset:n};if(!(1==i.nodeType&&n>0))break;i=i.childNodes[n-1],n=ei(i);}if(i>=0)for(let n=t,s=e;;){if(3==n.nodeType)return {node:n,offset:s};if(!(1==n.nodeType&&s<n.childNodes.length&&i>=0))break;n=n.childNodes[s],s=0;}return null}let is=class{constructor(){this.changes=[];}compareRange(t,e){Ki(t,e,this.changes);}comparePoint(t,e){Ki(t,e,this.changes);}};function ns(t,e){return e.left>t?e.left-t:Math.max(0,t-e.right)}function ss(t,e){return e.top>t?e.top-t:Math.max(0,t-e.bottom)}function rs(t,e){return t.top<e.bottom-1&&t.bottom>e.top+1}function os(t,e){return e<t.top?{top:e,left:t.left,right:t.right,bottom:t.bottom}:t}function as(t,e){return e>t.bottom?{top:t.top,left:t.left,right:t.right,bottom:e}:t}function ls(t,e,i){let n,s,r,o,a,l,h,c,O=!1;for(let u=t.firstChild;u;u=u.nextSibling){let t=He(u);for(let f=0;f<t.length;f++){let d=t[f];s&&rs(s,d)&&(d=os(as(d,s.bottom),s.top));let p=ns(e,d),g=ss(i,d);if(0==p&&0==g)return 3==u.nodeType?hs(u,e,i):ls(u,e,i);if(!n||o>g||o==g&&r>p){n=u,s=d,r=p,o=g;let a=g?i<d.top?-1:1:p?e<d.left?-1:1:0;O=!a||(a>0?f<t.length-1:f>0);}0==p?i>d.bottom&&(!h||h.bottom<d.bottom)?(a=u,h=d):i<d.top&&(!c||c.top>d.top)&&(l=u,c=d):h&&rs(h,d)?h=as(h,d.bottom):c&&rs(c,d)&&(c=os(c,d.top));}}if(h&&h.bottom>=i?(n=a,s=h):c&&c.top<=i&&(n=l,s=c),!n)return {node:t,offset:0};let u=Math.max(s.left,Math.min(s.right,e));return 3==n.nodeType?hs(n,u,i):O&&"false"!=n.contentEditable?ls(n,u,i):{node:t,offset:Array.prototype.indexOf.call(t.childNodes,n)+(e>=(s.left+s.right)/2?1:0)}}function hs(t,e,i){let n=t.nodeValue.length,s=-1,r=1e9,o=0;for(let a=0;a<n;a++){let n=hi(t,a,a+1).getClientRects();for(let l=0;l<n.length;l++){let h=n[l];if(h.top==h.bottom)continue;o||(o=e-h.left);let c=(h.top>i?h.top-i:i-h.bottom)-1;if(h.left-1<=e&&h.right+1>=e&&c<r){let i=e>=(h.left+h.right)/2,n=i;if(Ri.chrome||Ri.gecko){hi(t,a).getBoundingClientRect().left==h.right&&(n=!i);}if(c<=0)return {node:t,offset:a+(n?1:0)};s=a+(n?1:0),r=c;}}}return {node:t,offset:s>-1?s:o>0?t.nodeValue.length:0}}function cs(t,e,i,n=-1){var s,r;let o,a=t.contentDOM.getBoundingClientRect(),l=a.top+t.viewState.paddingTop,{docHeight:h}=t.viewState,{x:c,y:O}=e,u=O-l;if(u<0)return 0;if(u>h)return t.state.doc.length;for(let e=t.viewState.heightOracle.textHeight/2,s=!1;o=t.elementAtHeight(u),o.type!=Bi.Text;)for(;u=n>0?o.bottom+e:o.top-e,!(u>=0&&u<=h);){if(s)return i?null:0;s=!0,n=-n;}O=l+u;let f=o.from;if(f<t.viewport.from)return 0==t.viewport.from?0:i?null:Os(t,a,o,c,O);if(f>t.viewport.to)return t.viewport.to==t.state.doc.length?t.state.doc.length:i?null:Os(t,a,o,c,O);let d=t.dom.ownerDocument,p=t.root.elementFromPoint?t.root:d,g=p.elementFromPoint(c,O);g&&!t.contentDOM.contains(g)&&(g=null),g||(c=Math.max(a.left+1,Math.min(a.right-1,c)),g=p.elementFromPoint(c,O),g&&!t.contentDOM.contains(g)&&(g=null));let m,w=-1;if(g&&0!=(null===(s=t.docView.nearest(g))||void 0===s?void 0:s.isEditable))if(d.caretPositionFromPoint){let t=d.caretPositionFromPoint(c,O);t&&({offsetNode:m,offset:w}=t);}else if(d.caretRangeFromPoint){let e=d.caretRangeFromPoint(c,O);e&&(({startContainer:m,startOffset:w}=e),(!t.contentDOM.contains(m)||Ri.safari&&function(t,e,i){let n;if(3!=t.nodeType||e!=(n=t.nodeValue.length))return !1;for(let e=t.nextSibling;e;e=e.nextSibling)if(1!=e.nodeType||"BR"!=e.nodeName)return !1;return hi(t,n-1,n).getBoundingClientRect().left>i}(m,w,c)||Ri.chrome&&function(t,e,i){if(0!=e)return !1;for(let e=t;;){let t=e.parentNode;if(!t||1!=t.nodeType||t.firstChild!=e)return !1;if(t.classList.contains("cm-line"))break;e=t;}let n=1==t.nodeType?t.getBoundingClientRect():hi(t,0,Math.max(t.nodeValue.length,1)).getBoundingClientRect();return i-n.left>5}(m,w,c))&&(m=void 0));}if(!m||!t.docView.dom.contains(m)){let e=Ui.find(t.docView,f);if(!e)return u>o.top+o.height/2?o.to:o.from;({node:m,offset:w}=ls(e.dom,c,O));}let b=t.docView.nearest(m);if(!b)return null;if(b.isWidget&&1==(null===(r=b.dom)||void 0===r?void 0:r.nodeType)){let t=b.dom.getBoundingClientRect();return e.y<t.top||e.y<=t.bottom&&e.x<=(t.left+t.right)/2?b.posAtStart:b.posAtEnd}return b.localPosFromDOM(m,w)+b.posAtStart}function Os(t,e,i,n,s){let r=Math.round((n-e.left)*t.defaultCharacterWidth);if(t.lineWrapping&&i.height>1.5*t.defaultLineHeight){let e=t.viewState.heightOracle.textHeight;r+=Math.floor((s-i.top-.5*(t.defaultLineHeight-e))/e)*t.viewState.heightOracle.lineLength;}let o=t.state.sliceDoc(i.from,i.to);return i.from+function(t,e,i,n){for(let n=0,s=0;;){if(s>=e)return n;if(n==t.length)break;s+=9==t.charCodeAt(n)?i-s%i:1,n=at(t,n);}return !0===n?-1:t.length}(o,r,t.state.tabSize)}function us(t,e){let i=t.lineBlockAt(e);if(Array.isArray(i.type))for(let t of i.type)if(t.to>e||t.to==e&&(t.to==i.to||t.type==Bi.Text))return t;return i}function fs(t,e,i,n){let s=t.state.doc.lineAt(e.head),r=t.bidiSpans(s),o=t.textDirectionAt(s.from);for(let a=e,l=null;;){let e=Qn(s,r,o,a,i),h=Sn;if(!e){if(s.number==(i?t.state.doc.lines:1))return a;h="\n",s=t.state.doc.line(s.number+(i?1:-1)),r=t.bidiSpans(s),e=t.visualLineSide(s,!i);}if(l){if(!l(h))return a}else {if(!n)return e;l=n(h);}a=e;}}function ds(t,e,i){for(;;){let n=0;for(let s of t)s.between(e-1,e+1,((t,s,r)=>{if(e>t&&e<s){let r=n||i||(e-t<s-e?-1:1);e=r<0?t:s,n=r;}}));if(!n)return e}}function ps(t,e,i){let n=ds(t.state.facet(Un).map((e=>e(t))),i.from,e.head>i.from?-1:1);return n==i.from?i:kt.cursor(n,n<i.from?1:-1)}class gs{setSelectionOrigin(t){this.lastSelectionOrigin=t,this.lastSelectionTime=Date.now();}constructor(t){this.view=t,this.lastKeyCode=0,this.lastKeyTime=0,this.lastTouchTime=0,this.lastFocusTime=0,this.lastScrollTop=0,this.lastScrollLeft=0,this.pendingIOSKey=void 0,this.lastSelectionOrigin=null,this.lastSelectionTime=0,this.lastEscPress=0,this.lastContextMenu=0,this.scrollHandlers=[],this.handlers=Object.create(null),this.composing=-1,this.compositionFirstChange=null,this.compositionEndedAt=0,this.compositionPendingKey=!1,this.compositionPendingChange=!1,this.mouseSelection=null,this.draggedContent=null,this.handleEvent=this.handleEvent.bind(this),this.notifiedFocused=t.hasFocus,Ri.safari&&t.contentDOM.addEventListener("input",(()=>null)),Ri.gecko&&function(t){Ds.has(t)||(Ds.add(t),t.addEventListener("copy",(()=>{})),t.addEventListener("cut",(()=>{})));}(t.contentDOM.ownerDocument);}handleEvent(t){(function(t,e){if(!e.bubbles)return !0;if(e.defaultPrevented)return !1;for(let i,n=e.target;n!=t.contentDOM;n=n.parentNode)if(!n||11==n.nodeType||(i=pi.get(n))&&i.ignoreEvent(e))return !1;return !0})(this.view,t)&&!this.ignoreDuringComposition(t)&&("keydown"==t.type&&this.keydown(t)||this.runHandlers(t.type,t));}runHandlers(t,e){let i=this.handlers[t];if(i){for(let t of i.observers)t(this.view,e);for(let t of i.handlers){if(e.defaultPrevented)break;if(t(this.view,e)){e.preventDefault();break}}}}ensureHandlers(t){let e=ws(t),i=this.handlers,n=this.view.contentDOM;for(let t in e)if("scroll"!=t){let s=!e[t].handlers.length,r=i[t];r&&s!=!r.handlers.length&&(n.removeEventListener(t,this.handleEvent),r=null),r||n.addEventListener(t,this.handleEvent,{passive:s});}for(let t in i)"scroll"==t||e[t]||n.removeEventListener(t,this.handleEvent);this.handlers=e;}keydown(t){if(this.lastKeyCode=t.keyCode,this.lastKeyTime=Date.now(),9==t.keyCode&&Date.now()<this.lastEscPress+2e3)return !0;if(27!=t.keyCode&&Qs.indexOf(t.keyCode)<0&&(this.view.inputState.lastEscPress=0),Ri.android&&Ri.chrome&&!t.synthetic&&(13==t.keyCode||8==t.keyCode))return this.view.observer.delayAndroidKey(t.key,t.keyCode),!0;let e;return !Ri.ios||t.synthetic||t.altKey||t.metaKey||!((e=bs.find((e=>e.keyCode==t.keyCode)))&&!t.ctrlKey||Ss.indexOf(t.key)>-1&&t.ctrlKey&&!t.shiftKey)?(229!=t.keyCode&&this.view.observer.forceFlush(),!1):(this.pendingIOSKey=e||t,setTimeout((()=>this.flushIOSKey()),250),!0)}flushIOSKey(){let t=this.pendingIOSKey;return !!t&&(this.pendingIOSKey=void 0,ci(this.view.contentDOM,t.key,t.keyCode))}ignoreDuringComposition(t){return !!/^key/.test(t.type)&&(this.composing>0||!!(Ri.safari&&!Ri.ios&&this.compositionPendingKey&&Date.now()-this.compositionEndedAt<100)&&(this.compositionPendingKey=!1,!0))}startMouseSelection(t){this.mouseSelection&&this.mouseSelection.destroy(),this.mouseSelection=t;}update(t){this.mouseSelection&&this.mouseSelection.update(t),this.draggedContent&&t.docChanged&&(this.draggedContent=this.draggedContent.map(t.changes)),t.transactions.length&&(this.lastKeyCode=this.lastSelectionTime=0);}destroy(){this.mouseSelection&&this.mouseSelection.destroy();}}function ms(t,e){return (i,n)=>{try{return e.call(t,n,i)}catch(t){qn(i.state,t);}}}function ws(t){let e=Object.create(null);function i(t){return e[t]||(e[t]={observers:[],handlers:[]})}for(let e of t){let t=e.spec;if(t&&t.domEventHandlers)for(let n in t.domEventHandlers){let s=t.domEventHandlers[n];s&&i(n).handlers.push(ms(e.value,s));}if(t&&t.domEventObservers)for(let n in t.domEventObservers){let s=t.domEventObservers[n];s&&i(n).observers.push(ms(e.value,s));}}for(let t in vs)i(t).handlers.push(vs[t]);for(let t in Ps)i(t).observers.push(Ps[t]);return e}const bs=[{key:"Backspace",keyCode:8,inputType:"deleteContentBackward"},{key:"Enter",keyCode:13,inputType:"insertParagraph"},{key:"Enter",keyCode:13,inputType:"insertLineBreak"},{key:"Delete",keyCode:46,inputType:"deleteContentForward"}],Ss="dthko",Qs=[16,17,18,20,91,92,224,225];function xs(t){return .7*Math.max(0,t)+8}class ys{constructor(t,e,i,n){this.view=t,this.startEvent=e,this.style=i,this.mustSelect=n,this.scrollSpeed={x:0,y:0},this.scrolling=-1,this.lastEvent=e,this.scrollParent=function(t){let e=t.ownerDocument;for(let i=t.parentNode;i&&i!=e.body;)if(1==i.nodeType){if(i.scrollHeight>i.clientHeight||i.scrollWidth>i.clientWidth)return i;i=i.assignedSlot||i.parentNode;}else {if(11!=i.nodeType)break;i=i.host;}return null}(t.contentDOM),this.atoms=t.state.facet(Un).map((e=>e(t)));let s=t.contentDOM.ownerDocument;s.addEventListener("mousemove",this.move=this.move.bind(this)),s.addEventListener("mouseup",this.up=this.up.bind(this)),this.extend=e.shiftKey,this.multiple=t.state.facet(me.allowMultipleSelections)&&function(t,e){let i=t.state.facet(yn);return i.length?i[0](e):Ri.mac?e.metaKey:e.ctrlKey}(t,e),this.dragging=!(!function(t,e){let{main:i}=t.state.selection;if(i.empty)return !1;let n=Ie(t.root);if(!n||0==n.rangeCount)return !0;let s=n.getRangeAt(0).getClientRects();for(let t=0;t<s.length;t++){let i=s[t];if(i.left<=e.clientX&&i.right>=e.clientX&&i.top<=e.clientY&&i.bottom>=e.clientY)return !0}return !1}(t,e)||1!=Ms(e))&&null;}start(t){!1===this.dragging&&this.select(t);}move(t){var e,i,n;if(0==t.buttons)return this.destroy();if(this.dragging||null==this.dragging&&(i=this.startEvent,n=t,Math.max(Math.abs(i.clientX-n.clientX),Math.abs(i.clientY-n.clientY))<10))return;this.select(this.lastEvent=t);let s=0,r=0,o=(null===(e=this.scrollParent)||void 0===e?void 0:e.getBoundingClientRect())||{left:0,top:0,right:this.view.win.innerWidth,bottom:this.view.win.innerHeight},a=In(this.view);t.clientX-a.left<=o.left+6?s=-xs(o.left-t.clientX):t.clientX+a.right>=o.right-6&&(s=xs(t.clientX-o.right)),t.clientY-a.top<=o.top+6?r=-xs(o.top-t.clientY):t.clientY+a.bottom>=o.bottom-6&&(r=xs(t.clientY-o.bottom)),this.setScrollSpeed(s,r);}up(t){null==this.dragging&&this.select(this.lastEvent),this.dragging||t.preventDefault(),this.destroy();}destroy(){this.setScrollSpeed(0,0);let t=this.view.contentDOM.ownerDocument;t.removeEventListener("mousemove",this.move),t.removeEventListener("mouseup",this.up),this.view.inputState.mouseSelection=this.view.inputState.draggedContent=null;}setScrollSpeed(t,e){this.scrollSpeed={x:t,y:e},t||e?this.scrolling<0&&(this.scrolling=setInterval((()=>this.scroll()),50)):this.scrolling>-1&&(clearInterval(this.scrolling),this.scrolling=-1);}scroll(){this.scrollParent?(this.scrollParent.scrollLeft+=this.scrollSpeed.x,this.scrollParent.scrollTop+=this.scrollSpeed.y):this.view.win.scrollBy(this.scrollSpeed.x,this.scrollSpeed.y),!1===this.dragging&&this.select(this.lastEvent);}skipAtoms(t){let e=null;for(let i=0;i<t.ranges.length;i++){let n=t.ranges[i],s=null;if(n.empty){let t=ds(this.atoms,n.from,0);t!=n.from&&(s=kt.cursor(t,-1));}else {let t=ds(this.atoms,n.from,-1),e=ds(this.atoms,n.to,1);t==n.from&&e==n.to||(s=kt.range(n.from==n.anchor?t:e,n.from==n.head?t:e));}s&&(e||(e=t.ranges.slice()),e[i]=s);}return e?kt.create(e,t.mainIndex):t}select(t){let{view:e}=this,i=this.skipAtoms(this.style.get(t,this.extend,this.multiple));!this.mustSelect&&i.eq(e.state.selection,!1===this.dragging)||this.view.dispatch({selection:i,userEvent:"select.pointer"}),this.mustSelect=!1;}update(t){this.style.update(t)&&setTimeout((()=>this.select(this.lastEvent)),20);}}const vs=Object.create(null),Ps=Object.create(null),ks=Ri.ie&&Ri.ie_version<15||Ri.ios&&Ri.webkit_version<604;function $s(t,e){let i,{state:n}=t,s=1,r=n.toText(e),o=r.lines==n.selection.ranges.length;if(null!=_s&&n.selection.ranges.every((t=>t.empty))&&_s==r.toString()){let t=-1;i=n.changeByRange((i=>{let a=n.doc.lineAt(i.from);if(a.from==t)return {range:i};t=a.from;let l=n.toText((o?r.line(s++).text:e)+n.lineBreak);return {changes:{from:a.from,insert:l},range:kt.cursor(i.from+l.length)}}));}else i=o?n.changeByRange((t=>{let e=r.line(s++);return {changes:{from:t.from,to:t.to,insert:e.text},range:kt.cursor(t.from+e.length)}})):n.replaceSelection(r);t.dispatch(i,{userEvent:"input.paste",scrollIntoView:!0});}function Zs(t,e,i,n){if(1==n)return kt.cursor(e,i);if(2==n)return function(t,e,i=1){let n=t.charCategorizer(e),s=t.doc.lineAt(e),r=e-s.from;if(0==s.length)return kt.cursor(e);0==r?i=1:r==s.length&&(i=-1);let o=r,a=r;i<0?o=at(s.text,r,!1):a=at(s.text,r);let l=n(s.text.slice(o,a));for(;o>0;){let t=at(s.text,o,!1);if(n(s.text.slice(t,o))!=l)break;o=t;}for(;a<s.length;){let t=at(s.text,a);if(n(s.text.slice(a,t))!=l)break;a=t;}return kt.range(o+s.from,a+s.from)}(t.state,e,i);{let i=Ui.find(t.docView,e),n=t.state.doc.lineAt(i?i.posAtEnd:e),s=i?i.posAtStart:n.from,r=i?i.posAtEnd:n.to;return r<t.state.doc.length&&r==n.to&&r++,kt.range(s,r)}}Ps.scroll=t=>{t.inputState.lastScrollTop=t.scrollDOM.scrollTop,t.inputState.lastScrollLeft=t.scrollDOM.scrollLeft;},vs.keydown=(t,e)=>(t.inputState.setSelectionOrigin("select"),27==e.keyCode&&(t.inputState.lastEscPress=Date.now()),!1),Ps.touchstart=(t,e)=>{t.inputState.lastTouchTime=Date.now(),t.inputState.setSelectionOrigin("select.pointer");},Ps.touchmove=t=>{t.inputState.setSelectionOrigin("select.pointer");},vs.mousedown=(t,e)=>{if(t.observer.flush(),t.inputState.lastTouchTime>Date.now()-2e3)return !1;let i=null;for(let n of t.state.facet(Pn))if(i=n(t,e),i)break;if(i||0!=e.button||(i=function(t,e){let i=As(t,e),n=Ms(e),s=t.state.selection;return {update(t){t.docChanged&&(i.pos=t.changes.mapPos(i.pos),s=s.map(t.changes));},get(e,r,o){let a,l=As(t,e),h=Zs(t,l.pos,l.bias,n);if(i.pos!=l.pos&&!r){let e=Zs(t,i.pos,i.bias,n),s=Math.min(e.from,h.from),r=Math.max(e.to,h.to);h=s<h.from?kt.range(s,r):kt.range(r,s);}return r?s.replaceRange(s.main.extend(h.from,h.to)):o&&1==n&&s.ranges.length>1&&(a=function(t,e){for(let i=0;i<t.ranges.length;i++){let{from:n,to:s}=t.ranges[i];if(n<=e&&s>=e)return kt.create(t.ranges.slice(0,i).concat(t.ranges.slice(i+1)),t.mainIndex==i?0:t.mainIndex-(t.mainIndex>i?1:0))}return null}(s,l.pos))?a:o?s.addRange(h):kt.create([h])}}}(t,e)),i){let n=!t.hasFocus;t.inputState.startMouseSelection(new ys(t,e,i,n)),n&&t.observer.ignore((()=>li(t.contentDOM)));let s=t.inputState.mouseSelection;if(s)return s.start(e),!1===s.dragging}return !1};let Xs=(t,e)=>t>=e.top&&t<=e.bottom,Ts=(t,e,i)=>Xs(e,i)&&t>=i.left&&t<=i.right;function Rs(t,e,i,n){let s=Ui.find(t.docView,e);if(!s)return 1;let r=e-s.posAtStart;if(0==r)return 1;if(r==s.length)return -1;let o=s.coordsAt(r,-1);if(o&&Ts(i,n,o))return -1;let a=s.coordsAt(r,1);return a&&Ts(i,n,a)?1:o&&Xs(n,o)?-1:1}function As(t,e){let i=t.posAtCoords({x:e.clientX,y:e.clientY},!1);return {pos:i,bias:Rs(t,i,e.clientX,e.clientY)}}const Cs=Ri.ie&&Ri.ie_version<=11;let qs=null,Ys=0,Ws=0;function Ms(t){if(!Cs)return t.detail;let e=qs,i=Ws;return qs=t,Ws=Date.now(),Ys=!e||i>Date.now()-400&&Math.abs(e.clientX-t.clientX)<2&&Math.abs(e.clientY-t.clientY)<2?(Ys+1)%3:1}function js(t,e,i,n){if(!i)return;let s=t.posAtCoords({x:e.clientX,y:e.clientY},!1),{draggedContent:r}=t.inputState,o=n&&r&&function(t,e){let i=t.state.facet(vn);return i.length?i[0](e):Ri.mac?!e.altKey:!e.ctrlKey}(t,e)?{from:r.from,to:r.to}:null,a={from:s,insert:i},l=t.state.changes(o?[o,a]:a);t.focus(),t.dispatch({changes:l,selection:{anchor:l.mapPos(s,-1),head:l.mapPos(s,1)},userEvent:o?"move.drop":"input.drop"}),t.inputState.draggedContent=null;}vs.dragstart=(t,e)=>{let{selection:{main:i}}=t.state;if(e.target.draggable){let n=t.docView.nearest(e.target);if(n&&n.isWidget){let t=n.posAtStart,e=t+n.length;(t>=i.to||e<=i.from)&&(i=kt.range(t,e));}}let{inputState:n}=t;return n.mouseSelection&&(n.mouseSelection.dragging=!0),n.draggedContent=i,e.dataTransfer&&(e.dataTransfer.setData("Text",t.state.sliceDoc(i.from,i.to)),e.dataTransfer.effectAllowed="copyMove"),!1},vs.dragend=t=>(t.inputState.draggedContent=null,!1),vs.drop=(t,e)=>{if(!e.dataTransfer)return !1;if(t.state.readOnly)return !0;let i=e.dataTransfer.files;if(i&&i.length){let n=Array(i.length),s=0,r=()=>{++s==i.length&&js(t,e,n.filter((t=>null!=t)).join(t.state.lineBreak),!1);};for(let t=0;t<i.length;t++){let e=new FileReader;e.onerror=r,e.onload=()=>{/[\x00-\x08\x0e-\x1f]{2}/.test(e.result)||(n[t]=e.result),r();},e.readAsText(i[t]);}return !0}{let i=e.dataTransfer.getData("Text");if(i)return js(t,e,i,!0),!0}return !1},vs.paste=(t,e)=>{if(t.state.readOnly)return !0;t.observer.flush();let i=ks?null:e.clipboardData;return i?($s(t,i.getData("text/plain")||i.getData("text/uri-text")),!0):(function(t){let e=t.dom.parentNode;if(!e)return;let i=e.appendChild(document.createElement("textarea"));i.style.cssText="position: fixed; left: -10000px; top: 10px",i.focus(),setTimeout((()=>{t.focus(),i.remove(),$s(t,i.value);}),50);}(t),!1)};let _s=null;vs.copy=vs.cut=(t,e)=>{let{text:i,ranges:n,linewise:s}=function(t){let e=[],i=[],n=!1;for(let n of t.selection.ranges)n.empty||(e.push(t.sliceDoc(n.from,n.to)),i.push(n));if(!e.length){let s=-1;for(let{from:n}of t.selection.ranges){let r=t.doc.lineAt(n);r.number>s&&(e.push(r.text),i.push({from:r.from,to:Math.min(t.doc.length,r.to+1)})),s=r.number;}n=!0;}return {text:e.join(t.lineBreak),ranges:i,linewise:n}}(t.state);if(!i&&!s)return !1;_s=s?i:null,"cut"!=e.type||t.state.readOnly||t.dispatch({changes:n,scrollIntoView:!0,userEvent:"delete.cut"});let r=ks?null:e.clipboardData;return r?(r.clearData(),r.setData("text/plain",i),!0):(function(t,e){let i=t.dom.parentNode;if(!i)return;let n=i.appendChild(document.createElement("textarea"));n.style.cssText="position: fixed; left: -10000px; top: 10px",n.value=e,n.focus(),n.selectionEnd=e.length,n.selectionStart=0,setTimeout((()=>{n.remove(),t.focus();}),50);}(t,i),!1)};const Es=ie.define();function zs(t,e){let i=[];for(let n of t.facet(Xn)){let s=n(t,e);s&&i.push(s);}return i?t.update({effects:i,annotations:Es.of(!0)}):null}function Vs(t){setTimeout((()=>{let e=t.hasFocus;if(e!=t.inputState.notifiedFocused){let i=zs(t.state,e);i?t.dispatch(i):t.update([]);}}),10);}Ps.focus=t=>{t.inputState.lastFocusTime=Date.now(),t.scrollDOM.scrollTop||!t.inputState.lastScrollTop&&!t.inputState.lastScrollLeft||(t.scrollDOM.scrollTop=t.inputState.lastScrollTop,t.scrollDOM.scrollLeft=t.inputState.lastScrollLeft),Vs(t);},Ps.blur=t=>{t.observer.clearSelectionRange(),Vs(t);},Ps.compositionstart=Ps.compositionupdate=t=>{null==t.inputState.compositionFirstChange&&(t.inputState.compositionFirstChange=!0),t.inputState.composing<0&&(t.inputState.composing=0);},Ps.compositionend=t=>{t.inputState.composing=-1,t.inputState.compositionEndedAt=Date.now(),t.inputState.compositionPendingKey=!0,t.inputState.compositionPendingChange=t.observer.pendingRecords().length>0,t.inputState.compositionFirstChange=null,Ri.chrome&&Ri.android?t.observer.flushSoon():t.inputState.compositionPendingChange?Promise.resolve().then((()=>t.observer.flush())):setTimeout((()=>{t.inputState.composing<0&&t.docView.hasComposition&&t.update([]);}),50);},Ps.contextmenu=t=>{t.inputState.lastContextMenu=Date.now();},vs.beforeinput=(t,e)=>{var i;let n;if(Ri.chrome&&Ri.android&&(n=bs.find((t=>t.inputType==e.inputType)))&&(t.observer.delayAndroidKey(n.key,n.keyCode),"Backspace"==n.key||"Delete"==n.key)){let e=(null===(i=window.visualViewport)||void 0===i?void 0:i.height)||0;setTimeout((()=>{var i;((null===(i=window.visualViewport)||void 0===i?void 0:i.height)||0)>e+10&&t.hasFocus&&(t.contentDOM.blur(),t.focus());}),100);}return !1};const Ds=new Set;const Us=["pre-wrap","normal","pre-line","break-spaces"];class Ns{constructor(t){this.lineWrapping=t,this.doc=B.empty,this.heightSamples={},this.lineHeight=14,this.charWidth=7,this.textHeight=14,this.lineLength=30,this.heightChanged=!1;}heightForGap(t,e){let i=this.doc.lineAt(e).number-this.doc.lineAt(t).number+1;return this.lineWrapping&&(i+=Math.max(0,Math.ceil((e-t-i*this.lineLength*.5)/this.lineLength))),this.lineHeight*i}heightForLine(t){if(!this.lineWrapping)return this.lineHeight;return (1+Math.max(0,Math.ceil((t-this.lineLength)/(this.lineLength-5))))*this.lineHeight}setDoc(t){return this.doc=t,this}mustRefreshForWrapping(t){return Us.indexOf(t)>-1!=this.lineWrapping}mustRefreshForHeights(t){let e=!1;for(let i=0;i<t.length;i++){let n=t[i];n<0?i++:this.heightSamples[Math.floor(10*n)]||(e=!0,this.heightSamples[Math.floor(10*n)]=!0);}return e}refresh(t,e,i,n,s,r){let o=Us.indexOf(t)>-1,a=Math.round(e)!=Math.round(this.lineHeight)||this.lineWrapping!=o;if(this.lineWrapping=o,this.lineHeight=e,this.charWidth=i,this.textHeight=n,this.lineLength=s,a){this.heightSamples={};for(let t=0;t<r.length;t++){let e=r[t];e<0?t++:this.heightSamples[Math.floor(10*e)]=!0;}}return a}}class Gs{constructor(t,e){this.from=t,this.heights=e,this.index=0;}get more(){return this.index<this.heights.length}}class Bs{constructor(t,e,i,n,s){this.from=t,this.length=e,this.top=i,this.height=n,this._content=s;}get type(){return "number"==typeof this._content?Bi.Text:Array.isArray(this._content)?this._content:this._content.type}get to(){return this.from+this.length}get bottom(){return this.top+this.height}get widget(){return this._content instanceof Hi?this._content.widget:null}get widgetLineBreaks(){return "number"==typeof this._content?this._content:0}join(t){let e=(Array.isArray(this._content)?this._content:[this]).concat(Array.isArray(t._content)?t._content:[t]);return new Bs(this.from,this.length+t.length,this.top,this.height+t.height,e)}}var Is=function(t){return t[t.ByPos=0]="ByPos",t[t.ByHeight=1]="ByHeight",t[t.ByPosNoHeight=2]="ByPosNoHeight",t}(Is||(Is={}));const Ls=.001;class Fs{constructor(t,e,i=2){this.length=t,this.height=e,this.flags=i;}get outdated(){return (2&this.flags)>0}set outdated(t){this.flags=(t?2:0)|-3&this.flags;}setHeight(t,e){this.height!=e&&(Math.abs(this.height-e)>Ls&&(t.heightChanged=!0),this.height=e);}replace(t,e,i){return Fs.of(i)}decomposeLeft(t,e){e.push(this);}decomposeRight(t,e){e.push(this);}applyChanges(t,e,i,n){let s=this,r=i.doc;for(let o=n.length-1;o>=0;o--){let{fromA:a,toA:l,fromB:h,toB:c}=n[o],O=s.lineAt(a,Is.ByPosNoHeight,i.setDoc(e),0,0),u=O.to>=l?O:s.lineAt(l,Is.ByPosNoHeight,i,0,0);for(c+=u.to-l,l=u.to;o>0&&O.from<=n[o-1].toA;)a=n[o-1].fromA,h=n[o-1].fromB,o--,a<O.from&&(O=s.lineAt(a,Is.ByPosNoHeight,i,0,0));h+=O.from-a,a=O.from;let f=ir.build(i.setDoc(r),t,h,c);s=s.replace(a,l,f);}return s.updateHeight(i,0)}static empty(){return new Js(0,0)}static of(t){if(1==t.length)return t[0];let e=0,i=t.length,n=0,s=0;for(;;)if(e==i)if(n>2*s){let s=t[e-1];s.break?t.splice(--e,1,s.left,null,s.right):t.splice(--e,1,s.left,s.right),i+=1+s.break,n-=s.size;}else {if(!(s>2*n))break;{let e=t[i];e.break?t.splice(i,1,e.left,null,e.right):t.splice(i,1,e.left,e.right),i+=2+e.break,s-=e.size;}}else if(n<s){let i=t[e++];i&&(n+=i.size);}else {let e=t[--i];e&&(s+=e.size);}let r=0;return null==t[e-1]?(r=1,e--):null==t[e]&&(r=1,i++),new tr(Fs.of(t.slice(0,e)),r,Fs.of(t.slice(i)))}}Fs.prototype.size=1;class Hs extends Fs{constructor(t,e,i){super(t,e),this.deco=i;}blockAt(t,e,i,n){return new Bs(n,this.length,i,this.height,this.deco||0)}lineAt(t,e,i,n,s){return this.blockAt(0,i,n,s)}forEachLine(t,e,i,n,s,r){t<=s+this.length&&e>=s&&r(this.blockAt(0,i,n,s));}updateHeight(t,e=0,i=!1,n){return n&&n.from<=e&&n.more&&this.setHeight(t,n.heights[n.index++]),this.outdated=!1,this}toString(){return `block(${this.length})`}}class Js extends Hs{constructor(t,e){super(t,e,null),this.collapsed=0,this.widgetHeight=0,this.breaks=0;}blockAt(t,e,i,n){return new Bs(n,this.length,i,this.height,this.breaks)}replace(t,e,i){let n=i[0];return 1==i.length&&(n instanceof Js||n instanceof Ks&&4&n.flags)&&Math.abs(this.length-n.length)<10?(n instanceof Ks?n=new Js(n.length,this.height):n.height=this.height,this.outdated||(n.outdated=!1),n):Fs.of(i)}updateHeight(t,e=0,i=!1,n){return n&&n.from<=e&&n.more?this.setHeight(t,n.heights[n.index++]):(i||this.outdated)&&this.setHeight(t,Math.max(this.widgetHeight,t.heightForLine(this.length-this.collapsed))+this.breaks*t.lineHeight),this.outdated=!1,this}toString(){return `line(${this.length}${this.collapsed?-this.collapsed:""}${this.widgetHeight?":"+this.widgetHeight:""})`}}class Ks extends Fs{constructor(t){super(t,0);}heightMetrics(t,e){let i,n=t.doc.lineAt(e).number,s=t.doc.lineAt(e+this.length).number,r=s-n+1,o=0;if(t.lineWrapping){let e=Math.min(this.height,t.lineHeight*r);i=e/r,this.length>r+1&&(o=(this.height-e)/(this.length-r-1));}else i=this.height/r;return {firstLine:n,lastLine:s,perLine:i,perChar:o}}blockAt(t,e,i,n){let{firstLine:s,lastLine:r,perLine:o,perChar:a}=this.heightMetrics(e,n);if(e.lineWrapping){let s=n+Math.round(Math.max(0,Math.min(1,(t-i)/this.height))*this.length),r=e.doc.lineAt(s),l=o+r.length*a,h=Math.max(i,t-l/2);return new Bs(r.from,r.length,h,l,0)}{let n=Math.max(0,Math.min(r-s,Math.floor((t-i)/o))),{from:a,length:l}=e.doc.line(s+n);return new Bs(a,l,i+o*n,o,0)}}lineAt(t,e,i,n,s){if(e==Is.ByHeight)return this.blockAt(t,i,n,s);if(e==Is.ByPosNoHeight){let{from:e,to:n}=i.doc.lineAt(t);return new Bs(e,n-e,0,0,0)}let{firstLine:r,perLine:o,perChar:a}=this.heightMetrics(i,s),l=i.doc.lineAt(t),h=o+l.length*a,c=l.number-r,O=n+o*c+a*(l.from-s-c);return new Bs(l.from,l.length,Math.max(n,Math.min(O,n+this.height-h)),h,0)}forEachLine(t,e,i,n,s,r){t=Math.max(t,s),e=Math.min(e,s+this.length);let{firstLine:o,perLine:a,perChar:l}=this.heightMetrics(i,s);for(let h=t,c=n;h<=e;){let e=i.doc.lineAt(h);if(h==t){let i=e.number-o;c+=a*i+l*(t-s-i);}let n=a+l*e.length;r(new Bs(e.from,e.length,c,n,0)),c+=n,h=e.to+1;}}replace(t,e,i){let n=this.length-e;if(n>0){let t=i[i.length-1];t instanceof Ks?i[i.length-1]=new Ks(t.length+n):i.push(null,new Ks(n-1));}if(t>0){let e=i[0];e instanceof Ks?i[0]=new Ks(t+e.length):i.unshift(new Ks(t-1),null);}return Fs.of(i)}decomposeLeft(t,e){e.push(new Ks(t-1),null);}decomposeRight(t,e){e.push(null,new Ks(this.length-t-1));}updateHeight(t,e=0,i=!1,n){let s=e+this.length;if(n&&n.from<=e+this.length&&n.more){let i=[],r=Math.max(e,n.from),o=-1;for(n.from>e&&i.push(new Ks(n.from-e-1).updateHeight(t,e));r<=s&&n.more;){let e=t.doc.lineAt(r).length;i.length&&i.push(null);let s=n.heights[n.index++];-1==o?o=s:Math.abs(s-o)>=Ls&&(o=-2);let a=new Js(e,s);a.outdated=!1,i.push(a),r+=e+1;}r<=s&&i.push(null,new Ks(s-r).updateHeight(t,r));let a=Fs.of(i);return (o<0||Math.abs(a.height-this.height)>=Ls||Math.abs(o-this.heightMetrics(t,e).perLine)>=Ls)&&(t.heightChanged=!0),a}return (i||this.outdated)&&(this.setHeight(t,t.heightForGap(e,e+this.length)),this.outdated=!1),this}toString(){return `gap(${this.length})`}}class tr extends Fs{constructor(t,e,i){super(t.length+e+i.length,t.height+i.height,e|(t.outdated||i.outdated?2:0)),this.left=t,this.right=i,this.size=t.size+i.size;}get break(){return 1&this.flags}blockAt(t,e,i,n){let s=i+this.left.height;return t<s?this.left.blockAt(t,e,i,n):this.right.blockAt(t,e,s,n+this.left.length+this.break)}lineAt(t,e,i,n,s){let r=n+this.left.height,o=s+this.left.length+this.break,a=e==Is.ByHeight?t<r:t<o,l=a?this.left.lineAt(t,e,i,n,s):this.right.lineAt(t,e,i,r,o);if(this.break||(a?l.to<o:l.from>o))return l;let h=e==Is.ByPosNoHeight?Is.ByPosNoHeight:Is.ByPos;return a?l.join(this.right.lineAt(o,h,i,r,o)):this.left.lineAt(o,h,i,n,s).join(l)}forEachLine(t,e,i,n,s,r){let o=n+this.left.height,a=s+this.left.length+this.break;if(this.break)t<a&&this.left.forEachLine(t,e,i,n,s,r),e>=a&&this.right.forEachLine(t,e,i,o,a,r);else {let l=this.lineAt(a,Is.ByPos,i,n,s);t<l.from&&this.left.forEachLine(t,l.from-1,i,n,s,r),l.to>=t&&l.from<=e&&r(l),e>l.to&&this.right.forEachLine(l.to+1,e,i,o,a,r);}}replace(t,e,i){let n=this.left.length+this.break;if(e<n)return this.balanced(this.left.replace(t,e,i),this.right);if(t>this.left.length)return this.balanced(this.left,this.right.replace(t-n,e-n,i));let s=[];t>0&&this.decomposeLeft(t,s);let r=s.length;for(let t of i)s.push(t);if(t>0&&er(s,r-1),e<this.length){let t=s.length;this.decomposeRight(e,s),er(s,t);}return Fs.of(s)}decomposeLeft(t,e){let i=this.left.length;if(t<=i)return this.left.decomposeLeft(t,e);e.push(this.left),this.break&&(i++,t>=i&&e.push(null)),t>i&&this.right.decomposeLeft(t-i,e);}decomposeRight(t,e){let i=this.left.length,n=i+this.break;if(t>=n)return this.right.decomposeRight(t-n,e);t<i&&this.left.decomposeRight(t,e),this.break&&t<n&&e.push(null),e.push(this.right);}balanced(t,e){return t.size>2*e.size||e.size>2*t.size?Fs.of(this.break?[t,null,e]:[t,e]):(this.left=t,this.right=e,this.height=t.height+e.height,this.outdated=t.outdated||e.outdated,this.size=t.size+e.size,this.length=t.length+this.break+e.length,this)}updateHeight(t,e=0,i=!1,n){let{left:s,right:r}=this,o=e+s.length+this.break,a=null;return n&&n.from<=e+s.length&&n.more?a=s=s.updateHeight(t,e,i,n):s.updateHeight(t,e,i),n&&n.from<=o+r.length&&n.more?a=r=r.updateHeight(t,o,i,n):r.updateHeight(t,o,i),a?this.balanced(s,r):(this.height=this.left.height+this.right.height,this.outdated=!1,this)}toString(){return this.left+(this.break?" ":"-")+this.right}}function er(t,e){let i,n;null==t[e]&&(i=t[e-1])instanceof Ks&&(n=t[e+1])instanceof Ks&&t.splice(e-1,3,new Ks(i.length+1+n.length));}class ir{constructor(t,e){this.pos=t,this.oracle=e,this.nodes=[],this.lineStart=-1,this.lineEnd=-1,this.covering=null,this.writtenTo=t;}get isCovered(){return this.covering&&this.nodes[this.nodes.length-1]==this.covering}span(t,e){if(this.lineStart>-1){let t=Math.min(e,this.lineEnd),i=this.nodes[this.nodes.length-1];i instanceof Js?i.length+=t-this.pos:(t>this.pos||!this.isCovered)&&this.nodes.push(new Js(t-this.pos,-1)),this.writtenTo=t,e>t&&(this.nodes.push(null),this.writtenTo++,this.lineStart=-1);}this.pos=e;}point(t,e,i){if(t<e||i.heightRelevant){let n=i.widget?i.widget.estimatedHeight:0,s=i.widget?i.widget.lineBreaks:0;n<0&&(n=this.oracle.lineHeight);let r=e-t;i.block?this.addBlock(new Hs(r,n,i)):(r||s||n>=5)&&this.addLineDeco(n,s,r);}else e>t&&this.span(t,e);this.lineEnd>-1&&this.lineEnd<this.pos&&(this.lineEnd=this.oracle.doc.lineAt(this.pos).to);}enterLine(){if(this.lineStart>-1)return;let{from:t,to:e}=this.oracle.doc.lineAt(this.pos);this.lineStart=t,this.lineEnd=e,this.writtenTo<t&&((this.writtenTo<t-1||null==this.nodes[this.nodes.length-1])&&this.nodes.push(this.blankContent(this.writtenTo,t-1)),this.nodes.push(null)),this.pos>t&&this.nodes.push(new Js(this.pos-t,-1)),this.writtenTo=this.pos;}blankContent(t,e){let i=new Ks(e-t);return this.oracle.doc.lineAt(t).to==e&&(i.flags|=4),i}ensureLine(){this.enterLine();let t=this.nodes.length?this.nodes[this.nodes.length-1]:null;if(t instanceof Js)return t;let e=new Js(0,-1);return this.nodes.push(e),e}addBlock(t){this.enterLine();let e=t.deco;e&&e.startSide>0&&!this.isCovered&&this.ensureLine(),this.nodes.push(t),this.writtenTo=this.pos=this.pos+t.length,e&&e.endSide>0&&(this.covering=t);}addLineDeco(t,e,i){let n=this.ensureLine();n.length+=i,n.collapsed+=i,n.widgetHeight=Math.max(n.widgetHeight,t),n.breaks+=e,this.writtenTo=this.pos=this.pos+i;}finish(t){let e=0==this.nodes.length?null:this.nodes[this.nodes.length-1];!(this.lineStart>-1)||e instanceof Js||this.isCovered?(this.writtenTo<this.pos||null==e)&&this.nodes.push(this.blankContent(this.writtenTo,this.pos)):this.nodes.push(new Js(0,-1));let i=t;for(let t of this.nodes)t instanceof Js&&t.updateHeight(this.oracle,i),i+=t?t.length:1;return this.nodes}static build(t,e,i,n){let s=new ir(i,t);return ye.spans(e,i,n,s,0),s.finish(i)}}class nr{constructor(){this.changes=[];}compareRange(){}comparePoint(t,e,i,n){(t<e||i&&i.heightRelevant||n&&n.heightRelevant)&&Ki(t,e,this.changes,5);}}function sr(t,e){let i=t.getBoundingClientRect(),n=t.ownerDocument,s=n.defaultView||window,r=Math.max(0,i.left),o=Math.min(s.innerWidth,i.right),a=Math.max(0,i.top),l=Math.min(s.innerHeight,i.bottom);for(let e=t.parentNode;e&&e!=n.body;)if(1==e.nodeType){let i=e,n=window.getComputedStyle(i);if((i.scrollHeight>i.clientHeight||i.scrollWidth>i.clientWidth)&&"visible"!=n.overflow){let n=i.getBoundingClientRect();r=Math.max(r,n.left),o=Math.min(o,n.right),a=Math.max(a,n.top),l=e==t.parentNode?n.bottom:Math.min(l,n.bottom);}e="absolute"==n.position||"fixed"==n.position?i.offsetParent:i.parentNode;}else {if(11!=e.nodeType)break;e=e.host;}return {left:r-i.left,right:Math.max(r,o)-i.left,top:a-(i.top+e),bottom:Math.max(a,l)-(i.top+e)}}function rr(t,e){let i=t.getBoundingClientRect();return {left:0,right:i.right-i.left,top:e,bottom:i.bottom-(i.top+e)}}class or{constructor(t,e,i){this.from=t,this.to=e,this.size=i;}static same(t,e){if(t.length!=e.length)return !1;for(let i=0;i<t.length;i++){let n=t[i],s=e[i];if(n.from!=s.from||n.to!=s.to||n.size!=s.size)return !1}return !0}draw(t,e){return Ii.replace({widget:new ar(this.size*(e?t.scaleY:t.scaleX),e)}).range(this.from,this.to)}}class ar extends Gi{constructor(t,e){super(),this.size=t,this.vertical=e;}eq(t){return t.size==this.size&&t.vertical==this.vertical}toDOM(){let t=document.createElement("div");return this.vertical?t.style.height=this.size+"px":(t.style.width=this.size+"px",t.style.height="2px",t.style.display="inline-block"),t}get estimatedHeight(){return this.vertical?this.size:-1}}class lr{constructor(t){this.state=t,this.pixelViewport={left:0,right:window.innerWidth,top:0,bottom:0},this.inView=!0,this.paddingTop=0,this.paddingBottom=0,this.contentDOMWidth=0,this.contentDOMHeight=0,this.editorHeight=0,this.editorWidth=0,this.scrollTop=0,this.scrolledToBottom=!0,this.scaleX=1,this.scaleY=1,this.scrollAnchorPos=0,this.scrollAnchorHeight=-1,this.scaler=fr,this.scrollTarget=null,this.printing=!1,this.mustMeasureContent=!0,this.defaultTextDirection=sn.LTR,this.visibleRanges=[],this.mustEnforceCursorAssoc=!1;let e=t.facet(zn).some((t=>"function"!=typeof t&&"cm-lineWrapping"==t.class));this.heightOracle=new Ns(e),this.stateDeco=t.facet(Vn).filter((t=>"function"!=typeof t)),this.heightMap=Fs.empty().applyChanges(this.stateDeco,B.empty,this.heightOracle.setDoc(t.doc),[new Fn(0,0,0,t.doc.length)]),this.viewport=this.getViewport(0,null),this.updateViewportLines(),this.updateForViewport(),this.lineGaps=this.ensureLineGaps([]),this.lineGapDeco=Ii.set(this.lineGaps.map((t=>t.draw(this,!1)))),this.computeVisibleRanges();}updateForViewport(){let t=[this.viewport],{main:e}=this.state.selection;for(let i=0;i<=1;i++){let n=i?e.head:e.anchor;if(!t.some((({from:t,to:e})=>n>=t&&n<=e))){let{from:e,to:i}=this.lineBlockAt(n);t.push(new hr(e,i));}}this.viewports=t.sort(((t,e)=>t.from-e.from)),this.scaler=this.heightMap.height<=7e6?fr:new dr(this.heightOracle,this.heightMap,this.viewports);}updateViewportLines(){this.viewportLines=[],this.heightMap.forEachLine(this.viewport.from,this.viewport.to,this.heightOracle.setDoc(this.state.doc),0,0,(t=>{this.viewportLines.push(1==this.scaler.scale?t:pr(t,this.scaler));}));}update(t,e=null){this.state=t.state;let i=this.stateDeco;this.stateDeco=this.state.facet(Vn).filter((t=>"function"!=typeof t));let n=t.changedRanges,s=Fn.extendWithRanges(n,function(t,e,i){let n=new nr;return ye.compare(t,e,i,n,0),n.changes}(i,this.stateDeco,t?t.changes:wt.empty(this.state.doc.length))),r=this.heightMap.height,o=this.scrolledToBottom?null:this.scrollAnchorAt(this.scrollTop);this.heightMap=this.heightMap.applyChanges(this.stateDeco,t.startState.doc,this.heightOracle.setDoc(this.state.doc),s),this.heightMap.height!=r&&(t.flags|=2),o?(this.scrollAnchorPos=t.changes.mapPos(o.from,-1),this.scrollAnchorHeight=o.top):(this.scrollAnchorPos=-1,this.scrollAnchorHeight=this.heightMap.height);let a=s.length?this.mapViewport(this.viewport,t.changes):this.viewport;(e&&(e.range.head<a.from||e.range.head>a.to)||!this.viewportIsAppropriate(a))&&(a=this.getViewport(0,e));let l=!t.changes.empty||2&t.flags||a.from!=this.viewport.from||a.to!=this.viewport.to;this.viewport=a,this.updateForViewport(),l&&this.updateViewportLines(),(this.lineGaps.length||this.viewport.to-this.viewport.from>4e3)&&this.updateLineGaps(this.ensureLineGaps(this.mapLineGaps(this.lineGaps,t.changes))),t.flags|=this.computeVisibleRanges(),e&&(this.scrollTarget=e),!this.mustEnforceCursorAssoc&&t.selectionSet&&t.view.lineWrapping&&t.state.selection.main.empty&&t.state.selection.main.assoc&&!t.state.facet(Rn)&&(this.mustEnforceCursorAssoc=!0);}measure(t){let e=t.contentDOM,i=window.getComputedStyle(e),n=this.heightOracle,s=i.whiteSpace;this.defaultTextDirection="rtl"==i.direction?sn.RTL:sn.LTR;let r=this.heightOracle.mustRefreshForWrapping(s),o=e.getBoundingClientRect(),a=r||this.mustMeasureContent||this.contentDOMHeight!=o.height;this.contentDOMHeight=o.height,this.mustMeasureContent=!1;let l=0,h=0;if(o.width&&o.height){let{scaleX:t,scaleY:i}=si(e,o);this.scaleX==t&&this.scaleY==i||(this.scaleX=t,this.scaleY=i,l|=8,r=a=!0);}let c=(parseInt(i.paddingTop)||0)*this.scaleY,O=(parseInt(i.paddingBottom)||0)*this.scaleY;this.paddingTop==c&&this.paddingBottom==O||(this.paddingTop=c,this.paddingBottom=O,l|=10),this.editorWidth!=t.scrollDOM.clientWidth&&(n.lineWrapping&&(a=!0),this.editorWidth=t.scrollDOM.clientWidth,l|=8);let u=t.scrollDOM.scrollTop*this.scaleY;this.scrollTop!=u&&(this.scrollAnchorHeight=-1,this.scrollTop=u),this.scrolledToBottom=ui(t.scrollDOM);let f=(this.printing?rr:sr)(e,this.paddingTop),d=f.top-this.pixelViewport.top,p=f.bottom-this.pixelViewport.bottom;this.pixelViewport=f;let g=this.pixelViewport.bottom>this.pixelViewport.top&&this.pixelViewport.right>this.pixelViewport.left;if(g!=this.inView&&(this.inView=g,g&&(a=!0)),!this.inView&&!this.scrollTarget)return 0;let m=o.width;if(this.contentDOMWidth==m&&this.editorHeight==t.scrollDOM.clientHeight||(this.contentDOMWidth=o.width,this.editorHeight=t.scrollDOM.clientHeight,l|=8),a){let e=t.docView.measureVisibleLineHeights(this.viewport);if(n.mustRefreshForHeights(e)&&(r=!0),r||n.lineWrapping&&Math.abs(m-this.contentDOMWidth)>n.charWidth){let{lineHeight:i,charWidth:o,textHeight:a}=t.docView.measureTextSize();r=i>0&&n.refresh(s,i,o,a,m/o,e),r&&(t.docView.minWidth=0,l|=8);}d>0&&p>0?h=Math.max(d,p):d<0&&p<0&&(h=Math.min(d,p)),n.heightChanged=!1;for(let i of this.viewports){let s=i.from==this.viewport.from?e:t.docView.measureVisibleLineHeights(i);this.heightMap=(r?Fs.empty().applyChanges(this.stateDeco,B.empty,this.heightOracle,[new Fn(0,0,0,t.state.doc.length)]):this.heightMap).updateHeight(n,0,r,new Gs(i.from,s));}n.heightChanged&&(l|=2);}let w=!this.viewportIsAppropriate(this.viewport,h)||this.scrollTarget&&(this.scrollTarget.range.head<this.viewport.from||this.scrollTarget.range.head>this.viewport.to);return w&&(this.viewport=this.getViewport(h,this.scrollTarget)),this.updateForViewport(),(2&l||w)&&this.updateViewportLines(),(this.lineGaps.length||this.viewport.to-this.viewport.from>4e3)&&this.updateLineGaps(this.ensureLineGaps(r?[]:this.lineGaps,t)),l|=this.computeVisibleRanges(),this.mustEnforceCursorAssoc&&(this.mustEnforceCursorAssoc=!1,t.docView.enforceCursorAssoc()),l}get visibleTop(){return this.scaler.fromDOM(this.pixelViewport.top)}get visibleBottom(){return this.scaler.fromDOM(this.pixelViewport.bottom)}getViewport(t,e){let i=.5-Math.max(-.5,Math.min(.5,t/1e3/2)),n=this.heightMap,s=this.heightOracle,{visibleTop:r,visibleBottom:o}=this,a=new hr(n.lineAt(r-1e3*i,Is.ByHeight,s,0,0).from,n.lineAt(o+1e3*(1-i),Is.ByHeight,s,0,0).to);if(e){let{head:t}=e.range;if(t<a.from||t>a.to){let i,r=Math.min(this.editorHeight,this.pixelViewport.bottom-this.pixelViewport.top),o=n.lineAt(t,Is.ByPos,s,0,0);i="center"==e.y?(o.top+o.bottom)/2-r/2:"start"==e.y||"nearest"==e.y&&t<a.from?o.top:o.bottom-r,a=new hr(n.lineAt(i-500,Is.ByHeight,s,0,0).from,n.lineAt(i+r+500,Is.ByHeight,s,0,0).to);}}return a}mapViewport(t,e){let i=e.mapPos(t.from,-1),n=e.mapPos(t.to,1);return new hr(this.heightMap.lineAt(i,Is.ByPos,this.heightOracle,0,0).from,this.heightMap.lineAt(n,Is.ByPos,this.heightOracle,0,0).to)}viewportIsAppropriate({from:t,to:e},i=0){if(!this.inView)return !0;let{top:n}=this.heightMap.lineAt(t,Is.ByPos,this.heightOracle,0,0),{bottom:s}=this.heightMap.lineAt(e,Is.ByPos,this.heightOracle,0,0),{visibleTop:r,visibleBottom:o}=this;return (0==t||n<=r-Math.max(10,Math.min(-i,250)))&&(e==this.state.doc.length||s>=o+Math.max(10,Math.min(i,250)))&&n>r-2e3&&s<o+2e3}mapLineGaps(t,e){if(!t.length||e.empty)return t;let i=[];for(let n of t)e.touchesRange(n.from,n.to)||i.push(new or(e.mapPos(n.from),e.mapPos(n.to),n.size));return i}ensureLineGaps(t,e){let i=this.heightOracle.lineWrapping,n=i?1e4:2e3,s=n>>1,r=n<<1;if(this.defaultTextDirection!=sn.LTR&&!i)return [];let o=[],a=(n,r,l,h)=>{if(r-n<s)return;let c=this.state.selection.main,O=[c.from];c.empty||O.push(c.to);for(let t of O)if(t>n&&t<r)return a(n,t-10,l,h),void a(t+10,r,l,h);let u=function(t,e){for(let i of t)if(e(i))return i;return}(t,(t=>t.from>=l.from&&t.to<=l.to&&Math.abs(t.from-n)<s&&Math.abs(t.to-r)<s&&!O.some((e=>t.from<e&&t.to>e))));if(!u){if(r<l.to&&e&&i&&e.visibleRanges.some((t=>t.from<=r&&t.to>=r))){let t=e.moveToLineBoundary(kt.cursor(r),!1,!0).head;t>n&&(r=t);}u=new or(n,r,this.gapSize(l,n,r,h));}o.push(u);};for(let t of this.viewportLines){if(t.length<r)continue;let e=cr(t.from,t.to,this.stateDeco);if(e.total<r)continue;let s,o,l=this.scrollTarget?this.scrollTarget.range.head:null;if(i){let i,r,a=n/this.heightOracle.lineLength*this.heightOracle.lineHeight;if(null!=l){let n=ur(e,l),s=((this.visibleBottom-this.visibleTop)/2+a)/t.height;i=n-s,r=n+s;}else i=(this.visibleTop-t.top-a)/t.height,r=(this.visibleBottom-t.top+a)/t.height;s=Or(e,i),o=Or(e,r);}else {let t,i,r=e.total*this.heightOracle.charWidth,a=n*this.heightOracle.charWidth;if(null!=l){let n=ur(e,l),s=((this.pixelViewport.right-this.pixelViewport.left)/2+a)/r;t=n-s,i=n+s;}else t=(this.pixelViewport.left-a)/r,i=(this.pixelViewport.right+a)/r;s=Or(e,t),o=Or(e,i);}s>t.from&&a(t.from,s,t,e),o<t.to&&a(o,t.to,t,e);}return o}gapSize(t,e,i,n){let s=ur(n,i)-ur(n,e);return this.heightOracle.lineWrapping?t.height*s:n.total*this.heightOracle.charWidth*s}updateLineGaps(t){or.same(t,this.lineGaps)||(this.lineGaps=t,this.lineGapDeco=Ii.set(t.map((t=>t.draw(this,this.heightOracle.lineWrapping)))));}computeVisibleRanges(){let t=this.stateDeco;this.lineGaps.length&&(t=t.concat(this.lineGapDeco));let e=[];ye.spans(t,this.viewport.from,this.viewport.to,{span(t,i){e.push({from:t,to:i});},point(){}},20);let i=e.length!=this.visibleRanges.length||this.visibleRanges.some(((t,i)=>t.from!=e[i].from||t.to!=e[i].to));return this.visibleRanges=e,i?4:0}lineBlockAt(t){return t>=this.viewport.from&&t<=this.viewport.to&&this.viewportLines.find((e=>e.from<=t&&e.to>=t))||pr(this.heightMap.lineAt(t,Is.ByPos,this.heightOracle,0,0),this.scaler)}lineBlockAtHeight(t){return pr(this.heightMap.lineAt(this.scaler.fromDOM(t),Is.ByHeight,this.heightOracle,0,0),this.scaler)}scrollAnchorAt(t){let e=this.lineBlockAtHeight(t+8);return e.from>=this.viewport.from||this.viewportLines[0].top-t>200?e:this.viewportLines[0]}elementAtHeight(t){return pr(this.heightMap.blockAt(this.scaler.fromDOM(t),this.heightOracle,0,0),this.scaler)}get docHeight(){return this.scaler.toDOM(this.heightMap.height)}get contentHeight(){return this.docHeight+this.paddingTop+this.paddingBottom}}class hr{constructor(t,e){this.from=t,this.to=e;}}function cr(t,e,i){let n=[],s=t,r=0;return ye.spans(i,t,e,{span(){},point(t,e){t>s&&(n.push({from:s,to:t}),r+=t-s),s=e;}},20),s<e&&(n.push({from:s,to:e}),r+=e-s),{total:r,ranges:n}}function Or({total:t,ranges:e},i){if(i<=0)return e[0].from;if(i>=1)return e[e.length-1].to;let n=Math.floor(t*i);for(let t=0;;t++){let{from:i,to:s}=e[t],r=s-i;if(n<=r)return i+n;n-=r;}}function ur(t,e){let i=0;for(let{from:n,to:s}of t.ranges){if(e<=s){i+=e-n;break}i+=s-n;}return i/t.total}const fr={toDOM:t=>t,fromDOM:t=>t,scale:1};class dr{constructor(t,e,i){let n=0,s=0,r=0;this.viewports=i.map((({from:i,to:s})=>{let r=e.lineAt(i,Is.ByPos,t,0,0).top,o=e.lineAt(s,Is.ByPos,t,0,0).bottom;return n+=o-r,{from:i,to:s,top:r,bottom:o,domTop:0,domBottom:0}})),this.scale=(7e6-n)/(e.height-n);for(let t of this.viewports)t.domTop=r+(t.top-s)*this.scale,r=t.domBottom=t.domTop+(t.bottom-t.top),s=t.bottom;}toDOM(t){for(let e=0,i=0,n=0;;e++){let s=e<this.viewports.length?this.viewports[e]:null;if(!s||t<s.top)return n+(t-i)*this.scale;if(t<=s.bottom)return s.domTop+(t-s.top);i=s.bottom,n=s.domBottom;}}fromDOM(t){for(let e=0,i=0,n=0;;e++){let s=e<this.viewports.length?this.viewports[e]:null;if(!s||t<s.domTop)return i+(t-n)/this.scale;if(t<=s.domBottom)return s.top+(t-s.domTop);i=s.bottom,n=s.domBottom;}}}function pr(t,e){if(1==e.scale)return t;let i=e.toDOM(t.top),n=e.toDOM(t.bottom);return new Bs(t.from,t.length,i,n-i,Array.isArray(t._content)?t._content.map((t=>pr(t,e))):t._content)}const gr=Xt.define({combine:t=>t.join(" ")}),mr=Xt.define({combine:t=>t.indexOf(!0)>-1}),wr=_e.newName(),br=_e.newName(),Sr=_e.newName(),Qr={"&light":"."+br,"&dark":"."+Sr};function xr(t,e,i){return new _e(e,{finish:e=>/&/.test(e)?e.replace(/&\w*/,(e=>{if("&"==e)return t;if(!i||!i[e])throw new RangeError(`Unsupported selector: ${e}`);return i[e]})):t+" "+e})}const yr=xr("."+wr,{"&":{position:"relative !important",boxSizing:"border-box","&.cm-focused":{outline:"1px dotted #212121"},display:"flex !important",flexDirection:"column"},".cm-scroller":{display:"flex !important",alignItems:"flex-start !important",fontFamily:"monospace",lineHeight:1.4,height:"100%",overflowX:"auto",position:"relative",zIndex:0},".cm-content":{margin:0,flexGrow:2,flexShrink:0,display:"block",whiteSpace:"pre",wordWrap:"normal",boxSizing:"border-box",minHeight:"100%",padding:"4px 0",outline:"none","&[contenteditable=true]":{WebkitUserModify:"read-write-plaintext-only"}},".cm-lineWrapping":{whiteSpace_fallback:"pre-wrap",whiteSpace:"break-spaces",wordBreak:"break-word",overflowWrap:"anywhere",flexShrink:1},"&light .cm-content":{caretColor:"black"},"&dark .cm-content":{caretColor:"white"},".cm-line":{display:"block",padding:"0 2px 0 6px"},".cm-layer":{position:"absolute",left:0,top:0,contain:"size style","& > *":{position:"absolute"}},"&light .cm-selectionBackground":{background:"#d9d9d9"},"&dark .cm-selectionBackground":{background:"#222"},"&light.cm-focused > .cm-scroller > .cm-selectionLayer .cm-selectionBackground":{background:"#d7d4f0"},"&dark.cm-focused > .cm-scroller > .cm-selectionLayer .cm-selectionBackground":{background:"#233"},".cm-cursorLayer":{pointerEvents:"none"},"&.cm-focused > .cm-scroller > .cm-cursorLayer":{animation:"steps(1) cm-blink 1.2s infinite"},"@keyframes cm-blink":{"0%":{},"50%":{opacity:0},"100%":{}},"@keyframes cm-blink2":{"0%":{},"50%":{opacity:0},"100%":{}},".cm-cursor, .cm-dropCursor":{borderLeft:"1.2px solid black",marginLeft:"-0.6px",pointerEvents:"none"},".cm-cursor":{display:"none"},"&dark .cm-cursor":{borderLeftColor:"#444"},".cm-dropCursor":{position:"absolute"},"&.cm-focused > .cm-scroller > .cm-cursorLayer .cm-cursor":{display:"block"},".cm-iso":{unicodeBidi:"isolate"},".cm-announced":{position:"fixed",top:"-10000px"},"@media print":{".cm-announced":{display:"none"}},"&light .cm-activeLine":{backgroundColor:"#cceeff44"},"&dark .cm-activeLine":{backgroundColor:"#99eeff33"},"&light .cm-specialChar":{color:"red"},"&dark .cm-specialChar":{color:"#f78"},".cm-gutters":{flexShrink:0,display:"flex",height:"100%",boxSizing:"border-box",insetInlineStart:0,zIndex:200},"&light .cm-gutters":{backgroundColor:"#f5f5f5",color:"#6c6c6c",borderRight:"1px solid #ddd"},"&dark .cm-gutters":{backgroundColor:"#333338",color:"#ccc"},".cm-gutter":{display:"flex !important",flexDirection:"column",flexShrink:0,boxSizing:"border-box",minHeight:"100%",overflow:"hidden"},".cm-gutterElement":{boxSizing:"border-box"},".cm-lineNumbers .cm-gutterElement":{padding:"0 3px 0 5px",minWidth:"20px",textAlign:"right",whiteSpace:"nowrap"},"&light .cm-activeLineGutter":{backgroundColor:"#e2f2ff"},"&dark .cm-activeLineGutter":{backgroundColor:"#222227"},".cm-panels":{boxSizing:"border-box",position:"sticky",left:0,right:0},"&light .cm-panels":{backgroundColor:"#f5f5f5",color:"black"},"&light .cm-panels-top":{borderBottom:"1px solid #ddd"},"&light .cm-panels-bottom":{borderTop:"1px solid #ddd"},"&dark .cm-panels":{backgroundColor:"#333338",color:"white"},".cm-tab":{display:"inline-block",overflow:"hidden",verticalAlign:"bottom"},".cm-widgetBuffer":{verticalAlign:"text-top",height:"1em",width:0,display:"inline"},".cm-placeholder":{color:"#888",display:"inline-block",verticalAlign:"top"},".cm-highlightSpace:before":{content:"attr(data-display)",position:"absolute",pointerEvents:"none",color:"#888"},".cm-highlightTab":{backgroundImage:'url(\'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="200" height="20"><path stroke="%23888" stroke-width="1" fill="none" d="M1 10H196L190 5M190 15L196 10M197 4L197 16"/></svg>\')',backgroundSize:"auto 100%",backgroundPosition:"right 90%",backgroundRepeat:"no-repeat"},".cm-trailingSpace":{backgroundColor:"#ff332255"},".cm-button":{verticalAlign:"middle",color:"inherit",fontSize:"70%",padding:".2em 1em",borderRadius:"1px"},"&light .cm-button":{backgroundImage:"linear-gradient(#eff1f5, #d9d9df)",border:"1px solid #888","&:active":{backgroundImage:"linear-gradient(#b4b4b4, #d0d3d6)"}},"&dark .cm-button":{backgroundImage:"linear-gradient(#393939, #111)",border:"1px solid #888","&:active":{backgroundImage:"linear-gradient(#111, #333)"}},".cm-textfield":{verticalAlign:"middle",color:"inherit",fontSize:"70%",border:"1px solid silver",padding:".2em .5em"},"&light .cm-textfield":{backgroundColor:"white"},"&dark .cm-textfield":{border:"1px solid #555",backgroundColor:"inherit"}},Qr),vr="￿";class Pr{constructor(t,e){this.points=t,this.text="",this.lineSeparator=e.facet(me.lineSeparator);}append(t){this.text+=t;}lineBreak(){this.text+=vr;}readRange(t,e){if(!t)return this;let i=t.parentNode;for(let n=t;;){this.findPointBefore(i,n);let t=this.text.length;this.readNode(n);let s=n.nextSibling;if(s==e)break;let r=pi.get(n),o=pi.get(s);(r&&o?r.breakAfter:(r?r.breakAfter:$r(n))||$r(s)&&("BR"!=n.nodeName||n.cmIgnore)&&this.text.length>t)&&this.lineBreak(),n=s;}return this.findPointBefore(i,e),this}readTextNode(t){let e=t.nodeValue;for(let i of this.points)i.node==t&&(i.pos=this.text.length+Math.min(i.offset,e.length));for(let i=0,n=this.lineSeparator?null:/\r\n?|\n/g;;){let s,r=-1,o=1;if(this.lineSeparator?(r=e.indexOf(this.lineSeparator,i),o=this.lineSeparator.length):(s=n.exec(e))&&(r=s.index,o=s[0].length),this.append(e.slice(i,r<0?e.length:r)),r<0)break;if(this.lineBreak(),o>1)for(let e of this.points)e.node==t&&e.pos>this.text.length&&(e.pos-=o-1);i=r+o;}}readNode(t){if(t.cmIgnore)return;let e=pi.get(t),i=e&&e.overrideDOMText;if(null!=i){this.findPointInside(t,i.length);for(let t=i.iter();!t.next().done;)t.lineBreak?this.lineBreak():this.append(t.value);}else 3==t.nodeType?this.readTextNode(t):"BR"==t.nodeName?t.nextSibling&&this.lineBreak():1==t.nodeType&&this.readRange(t.firstChild,null);}findPointBefore(t,e){for(let i of this.points)i.node==t&&t.childNodes[i.offset]==e&&(i.pos=this.text.length);}findPointInside(t,e){for(let i of this.points)(3==t.nodeType?i.node==t:t.contains(i.node))&&(i.pos=this.text.length+(kr(t,i.node,i.offset)?e:0));}}function kr(t,e,i){for(;;){if(!e||i<ei(e))return !1;if(e==t)return !0;i=Ke(e)+1,e=e.parentNode;}}function $r(t){return 1==t.nodeType&&/^(DIV|P|LI|UL|OL|BLOCKQUOTE|DD|DT|H\d|SECTION|PRE)$/.test(t.nodeName)}class Zr{constructor(t,e){this.node=t,this.offset=e,this.pos=-1;}}class Xr{constructor(t,e,i,n){this.typeOver=n,this.bounds=null,this.text="";let{impreciseHead:s,impreciseAnchor:r}=t.docView;if(t.state.readOnly&&e>-1)this.newSel=null;else if(e>-1&&(this.bounds=t.docView.domBoundsAround(e,i,0))){let e=s||r?[]:function(t){let e=[];if(t.root.activeElement!=t.contentDOM)return e;let{anchorNode:i,anchorOffset:n,focusNode:s,focusOffset:r}=t.observer.selectionRange;i&&(e.push(new Zr(i,n)),s==i&&r==n||e.push(new Zr(s,r)));return e}(t),i=new Pr(e,t.state);i.readRange(this.bounds.startDOM,this.bounds.endDOM),this.text=i.text,this.newSel=function(t,e){if(0==t.length)return null;let i=t[0].pos,n=2==t.length?t[1].pos:i;return i>-1&&n>-1?kt.single(i+e,n+e):null}(e,this.bounds.from);}else {let e=t.observer.selectionRange,i=s&&s.node==e.focusNode&&s.offset==e.focusOffset||!Le(t.contentDOM,e.focusNode)?t.state.selection.main.head:t.docView.posFromDOM(e.focusNode,e.focusOffset),n=r&&r.node==e.anchorNode&&r.offset==e.anchorOffset||!Le(t.contentDOM,e.anchorNode)?t.state.selection.main.anchor:t.docView.posFromDOM(e.anchorNode,e.anchorOffset),o=t.viewport;if(Ri.ios&&t.state.selection.main.empty&&i!=n&&(o.from>0||o.to<t.state.doc.length)){let e=o.from-Math.min(i,n),s=o.to-Math.max(i,n);0!=e&&1!=e||0!=s&&-1!=s||(i=0,n=t.state.doc.length);}this.newSel=kt.single(n,i);}}}function Tr(t,e){let i,{newSel:n}=e,s=t.state.selection.main,r=t.inputState.lastKeyTime>Date.now()-100?t.inputState.lastKeyCode:-1;if(e.bounds){let{from:n,to:o}=e.bounds,a=s.from,l=null;(8===r||Ri.android&&e.text.length<o-n)&&(a=s.to,l="end");let h=function(t,e,i,n){let s=Math.min(t.length,e.length),r=0;for(;r<s&&t.charCodeAt(r)==e.charCodeAt(r);)r++;if(r==s&&t.length==e.length)return null;let o=t.length,a=e.length;for(;o>0&&a>0&&t.charCodeAt(o-1)==e.charCodeAt(a-1);)o--,a--;if("end"==n){i-=o+Math.max(0,r-Math.min(o,a))-r;}if(o<r&&t.length<e.length){r-=i<=r&&i>=o?r-i:0,a=r+(a-o),o=r;}else if(a<r){r-=i<=r&&i>=a?r-i:0,o=r+(o-a),a=r;}return {from:r,toA:o,toB:a}}(t.state.doc.sliceString(n,o,vr),e.text,a-n,l);h&&(Ri.chrome&&13==r&&h.toB==h.from+2&&e.text.slice(h.from,h.toB)==vr+vr&&h.toB--,i={from:n+h.from,to:n+h.toA,insert:B.of(e.text.slice(h.from,h.toB).split(vr))});}else n&&(!t.hasFocus&&t.state.facet(Yn)||n.main.eq(s))&&(n=null);if(!i&&!n)return !1;if(!i&&e.typeOver&&!s.empty&&n&&n.main.empty?i={from:s.from,to:s.to,insert:t.state.doc.slice(s.from,s.to)}:i&&i.from>=s.from&&i.to<=s.to&&(i.from!=s.from||i.to!=s.to)&&s.to-s.from-(i.to-i.from)<=4?i={from:s.from,to:s.to,insert:t.state.doc.slice(s.from,i.from).append(i.insert).append(t.state.doc.slice(i.to,s.to))}:(Ri.mac||Ri.android)&&i&&i.from==i.to&&i.from==s.head-1&&/^\. ?$/.test(i.insert.toString())&&"off"==t.contentDOM.getAttribute("autocorrect")?(n&&2==i.insert.length&&(n=kt.single(n.main.anchor-1,n.main.head-1)),i={from:s.from,to:s.to,insert:B.of([" "])}):Ri.chrome&&i&&i.from==i.to&&i.from==s.head&&"\n "==i.insert.toString()&&t.lineWrapping&&(n&&(n=kt.single(n.main.anchor-1,n.main.head-1)),i={from:s.from,to:s.to,insert:B.of([" "])}),i){if(Ri.ios&&t.inputState.flushIOSKey())return !0;if(Ri.android&&(i.from==s.from&&i.to==s.to&&1==i.insert.length&&2==i.insert.lines&&ci(t.contentDOM,"Enter",13)||(i.from==s.from-1&&i.to==s.to&&0==i.insert.length||8==r&&i.insert.length<i.to-i.from&&i.to>s.head)&&ci(t.contentDOM,"Backspace",8)||i.from==s.from&&i.to==s.to+1&&0==i.insert.length&&ci(t.contentDOM,"Delete",46)))return !0;let e,o=i.insert.toString();t.inputState.composing>=0&&t.inputState.composing++;let a=()=>e||(e=function(t,e,i){let n,s=t.state,r=s.selection.main;if(e.from>=r.from&&e.to<=r.to&&e.to-e.from>=(r.to-r.from)/3&&(!i||i.main.empty&&i.main.from==e.from+e.insert.length)&&t.inputState.composing<0){let i=r.from<e.from?s.sliceDoc(r.from,e.from):"",o=r.to>e.to?s.sliceDoc(e.to,r.to):"";n=s.replaceSelection(t.state.toText(i+e.insert.sliceString(0,void 0,t.state.lineBreak)+o));}else {let o=s.changes(e),a=i&&i.main.to<=o.newLength?i.main:void 0;if(s.selection.ranges.length>1&&t.inputState.composing>=0&&e.to<=r.to&&e.to>=r.to-10){let l,h=t.state.sliceDoc(e.from,e.to),c=i&&ts(t,i.main.head);if(c){let t=e.insert.length-(e.to-e.from);l={from:c.from,to:c.to-t};}else l=t.state.doc.lineAt(r.head);let O=r.to-e.to,u=r.to-r.from;n=s.changeByRange((i=>{if(i.from==r.from&&i.to==r.to)return {changes:o,range:a||i.map(o)};let n=i.to-O,c=n-h.length;if(i.to-i.from!=u||t.state.sliceDoc(c,n)!=h||i.to>=l.from&&i.from<=l.to)return {range:i};let f=s.changes({from:c,to:n,insert:e.insert}),d=i.to-r.to;return {changes:f,range:a?kt.range(Math.max(0,a.anchor+d),Math.max(0,a.head+d)):i.map(f)}}));}else n={changes:o,selection:a&&s.selection.replaceRange(a)};}let o="input.type";(t.composing||t.inputState.compositionPendingChange&&t.inputState.compositionEndedAt>Date.now()-50)&&(t.inputState.compositionPendingChange=!1,o+=".compose",t.inputState.compositionFirstChange&&(o+=".start",t.inputState.compositionFirstChange=!1));return s.update(n,{userEvent:o,scrollIntoView:!0})}(t,i,n));return t.state.facet(Zn).some((e=>e(t,i.from,i.to,o,a)))||t.dispatch(a()),!0}if(n&&!n.main.eq(s)){let e=!1,i="select";return t.inputState.lastSelectionTime>Date.now()-50&&("select"==t.inputState.lastSelectionOrigin&&(e=!0),i=t.inputState.lastSelectionOrigin),t.dispatch({selection:n,scrollIntoView:e,userEvent:i}),!0}return !1}const Rr={childList:!0,characterData:!0,subtree:!0,attributes:!0,characterDataOldValue:!0},Ar=Ri.ie&&Ri.ie_version<=11;class Cr{constructor(t){this.view=t,this.active=!1,this.selectionRange=new ri,this.selectionChanged=!1,this.delayedFlush=-1,this.resizeTimeout=-1,this.queue=[],this.delayedAndroidKey=null,this.flushingAndroidKey=-1,this.lastChange=0,this.scrollTargets=[],this.intersection=null,this.resizeScroll=null,this.intersecting=!1,this.gapIntersection=null,this.gaps=[],this.parentCheck=-1,this.dom=t.contentDOM,this.observer=new MutationObserver((e=>{for(let t of e)this.queue.push(t);(Ri.ie&&Ri.ie_version<=11||Ri.ios&&t.composing)&&e.some((t=>"childList"==t.type&&t.removedNodes.length||"characterData"==t.type&&t.oldValue.length>t.target.nodeValue.length))?this.flushSoon():this.flush();})),Ar&&(this.onCharData=t=>{this.queue.push({target:t.target,type:"characterData",oldValue:t.prevValue}),this.flushSoon();}),this.onSelectionChange=this.onSelectionChange.bind(this),this.onResize=this.onResize.bind(this),this.onPrint=this.onPrint.bind(this),this.onScroll=this.onScroll.bind(this),"function"==typeof ResizeObserver&&(this.resizeScroll=new ResizeObserver((()=>{var t;(null===(t=this.view.docView)||void 0===t?void 0:t.lastUpdate)<Date.now()-75&&this.onResize();})),this.resizeScroll.observe(t.scrollDOM)),this.addWindowListeners(this.win=t.win),this.start(),"function"==typeof IntersectionObserver&&(this.intersection=new IntersectionObserver((t=>{this.parentCheck<0&&(this.parentCheck=setTimeout(this.listenForScroll.bind(this),1e3)),t.length>0&&t[t.length-1].intersectionRatio>0!=this.intersecting&&(this.intersecting=!this.intersecting,this.intersecting!=this.view.inView&&this.onScrollChanged(document.createEvent("Event")));}),{threshold:[0,.001]}),this.intersection.observe(this.dom),this.gapIntersection=new IntersectionObserver((t=>{t.length>0&&t[t.length-1].intersectionRatio>0&&this.onScrollChanged(document.createEvent("Event"));}),{})),this.listenForScroll(),this.readSelectionRange();}onScrollChanged(t){this.view.inputState.runHandlers("scroll",t),this.intersecting&&this.view.measure();}onScroll(t){this.intersecting&&this.flush(!1),this.onScrollChanged(t);}onResize(){this.resizeTimeout<0&&(this.resizeTimeout=setTimeout((()=>{this.resizeTimeout=-1,this.view.requestMeasure();}),50));}onPrint(){this.view.viewState.printing=!0,this.view.measure(),setTimeout((()=>{this.view.viewState.printing=!1,this.view.requestMeasure();}),500);}updateGaps(t){if(this.gapIntersection&&(t.length!=this.gaps.length||this.gaps.some(((e,i)=>e!=t[i])))){this.gapIntersection.disconnect();for(let e of t)this.gapIntersection.observe(e);this.gaps=t;}}onSelectionChange(t){let e=this.selectionChanged;if(!this.readSelectionRange()||this.delayedAndroidKey)return;let{view:i}=this,n=this.selectionRange;if(i.state.facet(Yn)?i.root.activeElement!=this.dom:!Fe(i.dom,n))return;let s=n.anchorNode&&i.docView.nearest(n.anchorNode);s&&s.ignoreEvent(t)?e||(this.selectionChanged=!1):(Ri.ie&&Ri.ie_version<=11||Ri.android&&Ri.chrome)&&!i.state.selection.main.empty&&n.focusNode&&Je(n.focusNode,n.focusOffset,n.anchorNode,n.anchorOffset)?this.flushSoon():this.flush(!1);}readSelectionRange(){let{view:t}=this,e=Ri.safari&&11==t.root.nodeType&&function(t){let e=t.activeElement;for(;e&&e.shadowRoot;)e=e.shadowRoot.activeElement;return e}(this.dom.ownerDocument)==this.dom&&function(t){let e=null;function i(t){t.preventDefault(),t.stopImmediatePropagation(),e=t.getTargetRanges()[0];}if(t.contentDOM.addEventListener("beforeinput",i,!0),t.dom.ownerDocument.execCommand("indent"),t.contentDOM.removeEventListener("beforeinput",i,!0),!e)return null;let n=e.startContainer,s=e.startOffset,r=e.endContainer,o=e.endOffset,a=t.docView.domAtPos(t.state.selection.main.anchor);Je(a.node,a.offset,r,o)&&([n,s,r,o]=[r,o,n,s]);return {anchorNode:n,anchorOffset:s,focusNode:r,focusOffset:o}}(this.view)||Ie(t.root);if(!e||this.selectionRange.eq(e))return !1;let i=Fe(this.dom,e);return i&&!this.selectionChanged&&t.inputState.lastFocusTime>Date.now()-200&&t.inputState.lastTouchTime<Date.now()-300&&function(t,e){let i=e.focusNode,n=e.focusOffset;if(!i||e.anchorNode!=i||e.anchorOffset!=n)return !1;for(n=Math.min(n,ei(i));;)if(n){if(1!=i.nodeType)return !1;let t=i.childNodes[n-1];"false"==t.contentEditable?n--:(i=t,n=ei(i));}else {if(i==t)return !0;n=Ke(i),i=i.parentNode;}}(this.dom,e)?(this.view.inputState.lastFocusTime=0,t.docView.updateSelection(),!1):(this.selectionRange.setRange(e),i&&(this.selectionChanged=!0),!0)}setSelectionRange(t,e){this.selectionRange.set(t.node,t.offset,e.node,e.offset),this.selectionChanged=!1;}clearSelectionRange(){this.selectionRange.set(null,0,null,0);}listenForScroll(){this.parentCheck=-1;let t=0,e=null;for(let i=this.dom;i;)if(1==i.nodeType)!e&&t<this.scrollTargets.length&&this.scrollTargets[t]==i?t++:e||(e=this.scrollTargets.slice(0,t)),e&&e.push(i),i=i.assignedSlot||i.parentNode;else {if(11!=i.nodeType)break;i=i.host;}if(t<this.scrollTargets.length&&!e&&(e=this.scrollTargets.slice(0,t)),e){for(let t of this.scrollTargets)t.removeEventListener("scroll",this.onScroll);for(let t of this.scrollTargets=e)t.addEventListener("scroll",this.onScroll);}}ignore(t){if(!this.active)return t();try{return this.stop(),t()}finally{this.start(),this.clear();}}start(){this.active||(this.observer.observe(this.dom,Rr),Ar&&this.dom.addEventListener("DOMCharacterDataModified",this.onCharData),this.active=!0);}stop(){this.active&&(this.active=!1,this.observer.disconnect(),Ar&&this.dom.removeEventListener("DOMCharacterDataModified",this.onCharData));}clear(){this.processRecords(),this.queue.length=0,this.selectionChanged=!1;}delayAndroidKey(t,e){var i;if(!this.delayedAndroidKey){let t=()=>{let t=this.delayedAndroidKey;if(t){this.clearDelayedAndroidKey(),this.view.inputState.lastKeyCode=t.keyCode,this.view.inputState.lastKeyTime=Date.now(),!this.flush()&&t.force&&ci(this.dom,t.key,t.keyCode);}};this.flushingAndroidKey=this.view.win.requestAnimationFrame(t);}this.delayedAndroidKey&&"Enter"!=t||(this.delayedAndroidKey={key:t,keyCode:e,force:this.lastChange<Date.now()-50||!!(null===(i=this.delayedAndroidKey)||void 0===i?void 0:i.force)});}clearDelayedAndroidKey(){this.win.cancelAnimationFrame(this.flushingAndroidKey),this.delayedAndroidKey=null,this.flushingAndroidKey=-1;}flushSoon(){this.delayedFlush<0&&(this.delayedFlush=this.view.win.requestAnimationFrame((()=>{this.delayedFlush=-1,this.flush();})));}forceFlush(){this.delayedFlush>=0&&(this.view.win.cancelAnimationFrame(this.delayedFlush),this.delayedFlush=-1),this.flush();}pendingRecords(){for(let t of this.observer.takeRecords())this.queue.push(t);return this.queue}processRecords(){let t=this.pendingRecords();t.length&&(this.queue=[]);let e=-1,i=-1,n=!1;for(let s of t){let t=this.readMutation(s);t&&(t.typeOver&&(n=!0),-1==e?({from:e,to:i}=t):(e=Math.min(t.from,e),i=Math.max(t.to,i)));}return {from:e,to:i,typeOver:n}}readChange(){let{from:t,to:e,typeOver:i}=this.processRecords(),n=this.selectionChanged&&Fe(this.dom,this.selectionRange);if(t<0&&!n)return null;t>-1&&(this.lastChange=Date.now()),this.view.inputState.lastFocusTime=0,this.selectionChanged=!1;let s=new Xr(this.view,t,e,i);return this.view.docView.domChanged={newSel:s.newSel?s.newSel.main:null},s}flush(t=!0){if(this.delayedFlush>=0||this.delayedAndroidKey)return !1;t&&this.readSelectionRange();let e=this.readChange();if(!e)return this.view.requestMeasure(),!1;let i=this.view.state,n=Tr(this.view,e);return this.view.state==i&&this.view.update([]),n}readMutation(t){let e=this.view.docView.nearest(t.target);if(!e||e.ignoreMutation(t))return null;if(e.markDirty("attributes"==t.type),"attributes"==t.type&&(e.flags|=4),"childList"==t.type){let i=qr(e,t.previousSibling||t.target.previousSibling,-1),n=qr(e,t.nextSibling||t.target.nextSibling,1);return {from:i?e.posAfter(i):e.posAtStart,to:n?e.posBefore(n):e.posAtEnd,typeOver:!1}}return "characterData"==t.type?{from:e.posAtStart,to:e.posAtEnd,typeOver:t.target.nodeValue==t.oldValue}:null}setWindow(t){t!=this.win&&(this.removeWindowListeners(this.win),this.win=t,this.addWindowListeners(this.win));}addWindowListeners(t){t.addEventListener("resize",this.onResize),t.addEventListener("beforeprint",this.onPrint),t.addEventListener("scroll",this.onScroll),t.document.addEventListener("selectionchange",this.onSelectionChange);}removeWindowListeners(t){t.removeEventListener("scroll",this.onScroll),t.removeEventListener("resize",this.onResize),t.removeEventListener("beforeprint",this.onPrint),t.document.removeEventListener("selectionchange",this.onSelectionChange);}destroy(){var t,e,i;this.stop(),null===(t=this.intersection)||void 0===t||t.disconnect(),null===(e=this.gapIntersection)||void 0===e||e.disconnect(),null===(i=this.resizeScroll)||void 0===i||i.disconnect();for(let t of this.scrollTargets)t.removeEventListener("scroll",this.onScroll);this.removeWindowListeners(this.win),clearTimeout(this.parentCheck),clearTimeout(this.resizeTimeout),this.win.cancelAnimationFrame(this.delayedFlush),this.win.cancelAnimationFrame(this.flushingAndroidKey);}}function qr(t,e,i){for(;e;){let n=pi.get(e);if(n&&n.parent==t)return n;let s=e.parentNode;e=s!=t.dom?s:i>0?e.nextSibling:e.previousSibling;}return null}class Yr{get state(){return this.viewState.state}get viewport(){return this.viewState.viewport}get visibleRanges(){return this.viewState.visibleRanges}get inView(){return this.viewState.inView}get composing(){return this.inputState.composing>0}get compositionStarted(){return this.inputState.composing>=0}get root(){return this._root}get win(){return this.dom.ownerDocument.defaultView||window}constructor(t={}){this.plugins=[],this.pluginMap=new Map,this.editorAttrs={},this.contentAttrs={},this.bidiCache=[],this.destroyed=!1,this.updateState=2,this.measureScheduled=-1,this.measureRequests=[],this.contentDOM=document.createElement("div"),this.scrollDOM=document.createElement("div"),this.scrollDOM.tabIndex=-1,this.scrollDOM.className="cm-scroller",this.scrollDOM.appendChild(this.contentDOM),this.announceDOM=document.createElement("div"),this.announceDOM.className="cm-announced",this.announceDOM.setAttribute("aria-live","polite"),this.dom=document.createElement("div"),this.dom.appendChild(this.announceDOM),this.dom.appendChild(this.scrollDOM),t.parent&&t.parent.appendChild(this.dom);let{dispatch:e}=t;this.dispatchTransactions=t.dispatchTransactions||e&&(t=>t.forEach((t=>e(t,this))))||(t=>this.update(t)),this.dispatch=this.dispatch.bind(this),this._root=t.root||function(t){for(;t;){if(t&&(9==t.nodeType||11==t.nodeType&&t.host))return t;t=t.assignedSlot||t.parentNode;}return null}(t.parent)||document,this.viewState=new lr(t.state||me.create(t)),t.scrollTo&&t.scrollTo.is(Cn)&&(this.viewState.scrollTarget=t.scrollTo.value.clip(this.viewState.state)),this.plugins=this.state.facet(Mn).map((t=>new _n(t)));for(let t of this.plugins)t.update(this);this.observer=new Cr(this),this.inputState=new gs(this),this.inputState.ensureHandlers(this.plugins),this.docView=new Jn(this),this.mountStyles(),this.updateAttrs(),this.updateState=0,this.requestMeasure();}dispatch(...t){let e=1==t.length&&t[0]instanceof oe?t:1==t.length&&Array.isArray(t[0])?t[0]:[this.state.update(...t)];this.dispatchTransactions(e,this);}update(t){if(0!=this.updateState)throw new Error("Calls to EditorView.update are not allowed while an update is in progress");let e,i=!1,n=!1,s=this.state;for(let e of t){if(e.startState!=s)throw new RangeError("Trying to update state with a transaction that doesn't start from the previous state.");s=e.state;}if(this.destroyed)return void(this.viewState.state=s);let r=this.hasFocus,o=0,a=null;t.some((t=>t.annotation(Es)))?(this.inputState.notifiedFocused=r,o=1):r!=this.inputState.notifiedFocused&&(this.inputState.notifiedFocused=r,a=zs(s,r),a||(o=1));let l=this.observer.delayedAndroidKey,h=null;if(l?(this.observer.clearDelayedAndroidKey(),h=this.observer.readChange(),(h&&!this.state.doc.eq(s.doc)||!this.state.selection.eq(s.selection))&&(h=null)):this.observer.clear(),s.facet(me.phrases)!=this.state.facet(me.phrases))return this.setState(s);e=Hn.create(this,s,t),e.flags|=o;let c=this.viewState.scrollTarget;try{this.updateState=2;for(let e of t){if(c&&(c=c.map(e.changes)),e.scrollIntoView){let{main:t}=e.state.selection;c=new An(t.empty?t:kt.cursor(t.head,t.head>t.anchor?-1:1));}for(let t of e.effects)t.is(Cn)&&(c=t.value.clip(this.state));}this.viewState.update(e,c),this.bidiCache=jr.update(this.bidiCache,e.changes),e.empty||(this.updatePlugins(e),this.inputState.update(e)),i=this.docView.update(e),this.state.facet(Ln)!=this.styleModules&&this.mountStyles(),n=this.updateAttrs(),this.showAnnouncements(t),this.docView.updateSelection(i,t.some((t=>t.isUserEvent("select.pointer"))));}finally{this.updateState=0;}if(e.startState.facet(gr)!=e.state.facet(gr)&&(this.viewState.mustMeasureContent=!0),(i||n||c||this.viewState.mustEnforceCursorAssoc||this.viewState.mustMeasureContent)&&this.requestMeasure(),!e.empty)for(let t of this.state.facet($n))try{t(e);}catch(t){qn(this.state,t,"update listener");}(a||h)&&Promise.resolve().then((()=>{a&&this.state==a.startState&&this.dispatch(a),h&&!Tr(this,h)&&l.force&&ci(this.contentDOM,l.key,l.keyCode);}));}setState(t){if(0!=this.updateState)throw new Error("Calls to EditorView.setState are not allowed while an update is in progress");if(this.destroyed)return void(this.viewState.state=t);this.updateState=2;let e=this.hasFocus;try{for(let t of this.plugins)t.destroy(this);this.viewState=new lr(t),this.plugins=t.facet(Mn).map((t=>new _n(t))),this.pluginMap.clear();for(let t of this.plugins)t.update(this);this.docView.destroy(),this.docView=new Jn(this),this.inputState.ensureHandlers(this.plugins),this.mountStyles(),this.updateAttrs(),this.bidiCache=[];}finally{this.updateState=0;}e&&this.focus(),this.requestMeasure();}updatePlugins(t){let e=t.startState.facet(Mn),i=t.state.facet(Mn);if(e!=i){let n=[];for(let s of i){let i=e.indexOf(s);if(i<0)n.push(new _n(s));else {let e=this.plugins[i];e.mustUpdate=t,n.push(e);}}for(let e of this.plugins)e.mustUpdate!=t&&e.destroy(this);this.plugins=n,this.pluginMap.clear();}else for(let e of this.plugins)e.mustUpdate=t;for(let t=0;t<this.plugins.length;t++)this.plugins[t].update(this);e!=i&&this.inputState.ensureHandlers(this.plugins);}measure(t=!0){if(this.destroyed)return;if(this.measureScheduled>-1&&this.win.cancelAnimationFrame(this.measureScheduled),this.observer.delayedAndroidKey)return this.measureScheduled=-1,void this.requestMeasure();this.measureScheduled=0,t&&this.observer.forceFlush();let e=null,i=this.scrollDOM,n=i.scrollTop*this.scaleY,{scrollAnchorPos:s,scrollAnchorHeight:r}=this.viewState;Math.abs(n-this.viewState.scrollTop)>1&&(r=-1),this.viewState.scrollAnchorHeight=-1;try{for(let t=0;;t++){if(r<0)if(ui(i))s=-1,r=this.viewState.heightMap.height;else {let t=this.viewState.scrollAnchorAt(n);s=t.from,r=t.top;}this.updateState=1;let o=this.viewState.measure(this);if(!o&&!this.measureRequests.length&&null==this.viewState.scrollTarget)break;if(t>5){break}let a=[];4&o||([this.measureRequests,a]=[a,this.measureRequests]);let l=a.map((t=>{try{return t.read(this)}catch(t){return qn(this.state,t),Mr}})),h=Hn.create(this,this.state,[]),c=!1;h.flags|=o,e?e.flags|=o:e=h,this.updateState=2,h.empty||(this.updatePlugins(h),this.inputState.update(h),this.updateAttrs(),c=this.docView.update(h));for(let t=0;t<a.length;t++)if(l[t]!=Mr)try{let e=a[t];e.write&&e.write(l[t],this);}catch(t){qn(this.state,t);}if(c&&this.docView.updateSelection(!0),!h.viewportChanged&&0==this.measureRequests.length){if(this.viewState.editorHeight){if(this.viewState.scrollTarget){this.docView.scrollIntoView(this.viewState.scrollTarget),this.viewState.scrollTarget=null,r=-1;continue}{let t=(s<0?this.viewState.heightMap.height:this.viewState.lineBlockAt(s).top)-r;if(t>1||t<-1){n+=t,i.scrollTop=n/this.scaleY,r=-1;continue}}}break}}}finally{this.updateState=0,this.measureScheduled=-1;}if(e&&!e.empty)for(let t of this.state.facet($n))t(e);}get themeClasses(){return wr+" "+(this.state.facet(mr)?Sr:br)+" "+this.state.facet(gr)}updateAttrs(){let t=_r(this,En,{class:"cm-editor"+(this.hasFocus?" cm-focused ":" ")+this.themeClasses}),e={spellcheck:"false",autocorrect:"off",autocapitalize:"off",translate:"no",contenteditable:this.state.facet(Yn)?"true":"false",class:"cm-content",style:`${Ri.tabSize}: ${this.state.tabSize}`,role:"textbox","aria-multiline":"true"};this.state.readOnly&&(e["aria-readonly"]="true"),_r(this,zn,e);let i=this.observer.ignore((()=>{let i=Vi(this.contentDOM,this.contentAttrs,e),n=Vi(this.dom,this.editorAttrs,t);return i||n}));return this.editorAttrs=t,this.contentAttrs=e,i}showAnnouncements(t){let e=!0;for(let i of t)for(let t of i.effects)if(t.is(Yr.announce)){e&&(this.announceDOM.textContent=""),e=!1,this.announceDOM.appendChild(document.createElement("div")).textContent=t.value;}}mountStyles(){this.styleModules=this.state.facet(Ln);let t=this.state.facet(Yr.cspNonce);_e.mount(this.root,this.styleModules.concat(yr).reverse(),t?{nonce:t}:void 0);}readMeasured(){if(2==this.updateState)throw new Error("Reading the editor layout isn't allowed during an update");0==this.updateState&&this.measureScheduled>-1&&this.measure(!1);}requestMeasure(t){if(this.measureScheduled<0&&(this.measureScheduled=this.win.requestAnimationFrame((()=>this.measure()))),t){if(this.measureRequests.indexOf(t)>-1)return;if(null!=t.key)for(let e=0;e<this.measureRequests.length;e++)if(this.measureRequests[e].key===t.key)return void(this.measureRequests[e]=t);this.measureRequests.push(t);}}plugin(t){let e=this.pluginMap.get(t);return (void 0===e||e&&e.spec!=t)&&this.pluginMap.set(t,e=this.plugins.find((e=>e.spec==t))||null),e&&e.update(this).value}get documentTop(){return this.contentDOM.getBoundingClientRect().top+this.viewState.paddingTop}get documentPadding(){return {top:this.viewState.paddingTop,bottom:this.viewState.paddingBottom}}get scaleX(){return this.viewState.scaleX}get scaleY(){return this.viewState.scaleY}elementAtHeight(t){return this.readMeasured(),this.viewState.elementAtHeight(t)}lineBlockAtHeight(t){return this.readMeasured(),this.viewState.lineBlockAtHeight(t)}get viewportLineBlocks(){return this.viewState.viewportLines}lineBlockAt(t){return this.viewState.lineBlockAt(t)}get contentHeight(){return this.viewState.contentHeight}moveByChar(t,e,i){return ps(this,t,fs(this,t,e,i))}moveByGroup(t,e){return ps(this,t,fs(this,t,e,(e=>function(t,e,i){let n=t.state.charCategorizer(e),s=n(i);return t=>{let e=n(t);return s==fe.Space&&(s=e),s==e}}(this,t.head,e))))}visualLineSide(t,e){let i=this.bidiSpans(t),n=this.textDirectionAt(t.from),s=i[e?i.length-1:0];return kt.cursor(s.side(e,n)+t.from,s.forward(!e,n)?1:-1)}moveToLineBoundary(t,e,i=!0){return function(t,e,i,n){let s=us(t,e.head),r=n&&s.type==Bi.Text&&(t.lineWrapping||s.widgetLineBreaks)?t.coordsAtPos(e.assoc<0&&e.head>s.from?e.head-1:e.head):null;if(r){let e=t.dom.getBoundingClientRect(),n=t.textDirectionAt(s.from),o=t.posAtCoords({x:i==(n==sn.LTR)?e.right-1:e.left+1,y:(r.top+r.bottom)/2});if(null!=o)return kt.cursor(o,i?-1:1)}return kt.cursor(i?s.to:s.from,i?-1:1)}(this,t,e,i)}moveVertically(t,e,i){return ps(this,t,function(t,e,i,n){let s=e.head,r=i?1:-1;if(s==(i?t.state.doc.length:0))return kt.cursor(s,e.assoc);let o,a=e.goalColumn,l=t.contentDOM.getBoundingClientRect(),h=t.coordsAtPos(s,e.assoc||-1),c=t.documentTop;if(h)null==a&&(a=h.left-l.left),o=r<0?h.top:h.bottom;else {let e=t.viewState.lineBlockAt(s);null==a&&(a=Math.min(l.right-l.left,t.defaultCharacterWidth*(s-e.from))),o=(r<0?e.top:e.bottom)+c;}let O=l.left+a,u=null!=n?n:t.viewState.heightOracle.textHeight>>1;for(let e=0;;e+=10){let i=o+(u+e)*r,n=cs(t,{x:O,y:i},!1,r);if(i<l.top||i>l.bottom||(r<0?n<s:n>s)){let e=t.docView.coordsForChar(n),s=!e||i<e.top?-1:1;return kt.cursor(n,s,void 0,a)}}}(this,t,e,i))}domAtPos(t){return this.docView.domAtPos(t)}posAtDOM(t,e=0){return this.docView.posFromDOM(t,e)}posAtCoords(t,e=!0){return this.readMeasured(),cs(this,t,e)}coordsAtPos(t,e=1){this.readMeasured();let i=this.docView.coordsAt(t,e);if(!i||i.left==i.right)return i;let n=this.state.doc.lineAt(t),s=this.bidiSpans(n);return ii(i,s[dn.find(s,t-n.from,-1,e)].dir==sn.LTR==e>0)}coordsForChar(t){return this.readMeasured(),this.docView.coordsForChar(t)}get defaultCharacterWidth(){return this.viewState.heightOracle.charWidth}get defaultLineHeight(){return this.viewState.heightOracle.lineHeight}get textDirection(){return this.viewState.defaultTextDirection}textDirectionAt(t){return !this.state.facet(Tn)||t<this.viewport.from||t>this.viewport.to?this.textDirection:(this.readMeasured(),this.docView.textDirectionAt(t))}get lineWrapping(){return this.viewState.heightOracle.lineWrapping}bidiSpans(t){if(t.length>Wr)return bn(t.length);let e,i=this.textDirectionAt(t.from);for(let n of this.bidiCache)if(n.from==t.from&&n.dir==i&&(n.fresh||pn(n.isolates,e=Gn(this,t))))return n.order;e||(e=Gn(this,t));let n=function(t,e,i){if(!t)return [new dn(0,0,e==on?1:0)];if(e==rn&&!i.length&&!fn.test(t))return bn(t.length);if(i.length)for(;t.length>gn.length;)gn[gn.length]=256;let n=[],s=e==rn?0:1;return wn(t,s,s,i,0,t.length,n),n}(t.text,i,e);return this.bidiCache.push(new jr(t.from,t.to,i,e,!0,n)),n}get hasFocus(){var t;return (this.dom.ownerDocument.hasFocus()||Ri.safari&&(null===(t=this.inputState)||void 0===t?void 0:t.lastContextMenu)>Date.now()-3e4)&&this.root.activeElement==this.contentDOM}focus(){this.observer.ignore((()=>{li(this.contentDOM),this.docView.updateSelection();}));}setRoot(t){this._root!=t&&(this._root=t,this.observer.setWindow((9==t.nodeType?t:t.ownerDocument).defaultView||window),this.mountStyles());}destroy(){for(let t of this.plugins)t.destroy(this);this.plugins=[],this.inputState.destroy(),this.docView.destroy(),this.dom.remove(),this.observer.destroy(),this.measureScheduled>-1&&this.win.cancelAnimationFrame(this.measureScheduled),this.destroyed=!0;}static scrollIntoView(t,e={}){return Cn.of(new An("number"==typeof t?kt.cursor(t):t,e.y,e.x,e.yMargin,e.xMargin))}scrollSnapshot(){let{scrollTop:t,scrollLeft:e}=this.scrollDOM,i=this.viewState.scrollAnchorAt(t);return Cn.of(new An(kt.cursor(i.from),"start","start",i.top-t,e,!0))}static domEventHandlers(t){return jn.define((()=>({})),{eventHandlers:t})}static domEventObservers(t){return jn.define((()=>({})),{eventObservers:t})}static theme(t,e){let i=_e.newName(),n=[gr.of(i),Ln.of(xr(`.${i}`,t))];return e&&e.dark&&n.push(mr.of(!0)),n}static baseTheme(t){return Vt.lowest(Ln.of(xr("."+wr,t,Qr)))}static findFromDOM(t){var e;let i=t.querySelector(".cm-content"),n=i&&pi.get(i)||pi.get(t);return (null===(e=null==n?void 0:n.rootView)||void 0===e?void 0:e.view)||null}}Yr.styleModule=Ln,Yr.inputHandler=Zn,Yr.focusChangeEffect=Xn,Yr.perLineTextDirection=Tn,Yr.exceptionSink=kn,Yr.updateListener=$n,Yr.editable=Yn,Yr.mouseSelectionStyle=Pn,Yr.dragMovesSelection=vn,Yr.clickAddsSelectionRange=yn,Yr.decorations=Vn,Yr.outerDecorations=Dn,Yr.atomicRanges=Un,Yr.bidiIsolatedRanges=Nn,Yr.scrollMargins=Bn,Yr.darkTheme=mr,Yr.cspNonce=Xt.define({combine:t=>t.length?t[0]:""}),Yr.contentAttributes=zn,Yr.editorAttributes=En,Yr.lineWrapping=Yr.contentAttributes.of({class:"cm-lineWrapping"}),Yr.announce=re.define();const Wr=4096,Mr={};class jr{constructor(t,e,i,n,s,r){this.from=t,this.to=e,this.dir=i,this.isolates=n,this.fresh=s,this.order=r;}static update(t,e){if(e.empty&&!t.some((t=>t.fresh)))return t;let i=[],n=t.length?t[t.length-1].dir:sn.LTR;for(let s=Math.max(0,t.length-10);s<t.length;s++){let r=t[s];r.dir!=n||e.touchesRange(r.from,r.to)||i.push(new jr(e.mapPos(r.from,1),e.mapPos(r.to,-1),r.dir,r.isolates,!1,r.order));}return i}}function _r(t,e,i){for(let n=t.state.facet(e),s=n.length-1;s>=0;s--){let e=n[s],r="function"==typeof e?e(t):e;r&&_i(r,i);}return i}const Er=Ri.mac?"mac":Ri.windows?"win":Ri.linux?"linux":"key";function zr(t,e,i){return e.altKey&&(t="Alt-"+t),e.ctrlKey&&(t="Ctrl-"+t),e.metaKey&&(t="Meta-"+t),!1!==i&&e.shiftKey&&(t="Shift-"+t),t}const Vr=Vt.default(Yr.domEventHandlers({keydown:(t,e)=>function(t,e,i,n){let s=function(t){var e=!(Ue&&t.metaKey&&t.shiftKey&&!t.ctrlKey&&!t.altKey||Ne&&t.shiftKey&&t.key&&1==t.key.length||"Unidentified"==t.key)&&t.key||(t.shiftKey?De:Ve)[t.keyCode]||t.key||"Unidentified";return "Esc"==e&&(e="Escape"),"Del"==e&&(e="Delete"),"Left"==e&&(e="ArrowLeft"),"Up"==e&&(e="ArrowUp"),"Right"==e&&(e="ArrowRight"),"Down"==e&&(e="ArrowDown"),e}(e),r=ut(s,0),o=dt(r)==s.length&&" "!=s,a="",l=!1,h=!1,c=!1;Nr&&Nr.view==i&&Nr.scope==n&&(a=Nr.prefix+" ",Qs.indexOf(e.keyCode)<0&&(h=!0,Nr=null));let O,u,f=new Set,d=t=>{if(t){for(let n of t.run)if(!f.has(n)&&(f.add(n),n(i,e)))return t.stopPropagation&&(c=!0),!0;t.preventDefault&&(t.stopPropagation&&(c=!0),h=!0);}return !1},p=t[n];p&&(d(p[a+zr(s,e,!o)])?l=!0:o&&(e.altKey||e.metaKey||e.ctrlKey)&&!(Ri.windows&&e.ctrlKey&&e.altKey)&&(O=Ve[e.keyCode])&&O!=s?(d(p[a+zr(O,e,!0)])||e.shiftKey&&(u=De[e.keyCode])!=s&&u!=O&&d(p[a+zr(u,e,!1)]))&&(l=!0):o&&e.shiftKey&&d(p[a+zr(s,e,!0)])&&(l=!0),!l&&d(p._any)&&(l=!0));h&&(l=!0);l&&c&&e.stopPropagation();return l}(function(t){let e=t.facet(Dr),i=Ur.get(e);i||Ur.set(e,i=function(t,e=Er){let i=Object.create(null),n=Object.create(null),s=(t,e)=>{let i=n[t];if(null==i)n[t]=e;else if(i!=e)throw new Error("Key binding "+t+" is used both as a regular binding and as a multi-stroke prefix")},r=(t,n,r,o,a)=>{var l,h;let c=i[t]||(i[t]=Object.create(null)),O=n.split(/ (?!$)/).map((t=>function(t,e){const i=t.split(/-(?!$)/);let n,s,r,o,a=i[i.length-1];"Space"==a&&(a=" ");for(let t=0;t<i.length-1;++t){const a=i[t];if(/^(cmd|meta|m)$/i.test(a))o=!0;else if(/^a(lt)?$/i.test(a))n=!0;else if(/^(c|ctrl|control)$/i.test(a))s=!0;else if(/^s(hift)?$/i.test(a))r=!0;else {if(!/^mod$/i.test(a))throw new Error("Unrecognized modifier name: "+a);"mac"==e?o=!0:s=!0;}}return n&&(a="Alt-"+a),s&&(a="Ctrl-"+a),o&&(a="Meta-"+a),r&&(a="Shift-"+a),a}(t,e)));for(let e=1;e<O.length;e++){let i=O.slice(0,e).join(" ");s(i,!0),c[i]||(c[i]={preventDefault:!0,stopPropagation:!1,run:[e=>{let n=Nr={view:e,prefix:i,scope:t};return setTimeout((()=>{Nr==n&&(Nr=null);}),Gr),!0}]});}let u=O.join(" ");s(u,!1);let f=c[u]||(c[u]={preventDefault:!1,stopPropagation:!1,run:(null===(h=null===(l=c._any)||void 0===l?void 0:l.run)||void 0===h?void 0:h.slice())||[]});r&&f.run.push(r),o&&(f.preventDefault=!0),a&&(f.stopPropagation=!0);};for(let n of t){let t=n.scope?n.scope.split(" "):["editor"];if(n.any)for(let e of t){let t=i[e]||(i[e]=Object.create(null));t._any||(t._any={preventDefault:!1,stopPropagation:!1,run:[]});for(let e in t)t[e].run.push(n.any);}let s=n[e]||n.key;if(s)for(let e of t)r(e,s,n.run,n.preventDefault,n.stopPropagation),n.shift&&r(e,"Shift-"+s,n.shift,n.preventDefault,n.stopPropagation);}return i}(e.reduce(((t,e)=>t.concat(e)),[])));return i}(e.state),t,e,"editor")})),Dr=Xt.define({enables:Vr}),Ur=new WeakMap;let Nr=null;const Gr=4e3;class Br{constructor(t,e,i,n,s){this.className=t,this.left=e,this.top=i,this.width=n,this.height=s;}draw(){let t=document.createElement("div");return t.className=this.className,this.adjust(t),t}update(t,e){return e.className==this.className&&(this.adjust(t),!0)}adjust(t){t.style.left=this.left+"px",t.style.top=this.top+"px",null!=this.width&&(t.style.width=this.width+"px"),t.style.height=this.height+"px";}eq(t){return this.left==t.left&&this.top==t.top&&this.width==t.width&&this.height==t.height&&this.className==t.className}static forRange(t,e,i){if(i.empty){let n=t.coordsAtPos(i.head,i.assoc||1);if(!n)return [];let s=Ir(t);return [new Br(e,n.left-s.left,n.top-s.top,null,n.bottom-n.top)]}return function(t,e,i){if(i.to<=t.viewport.from||i.from>=t.viewport.to)return [];let n=Math.max(i.from,t.viewport.from),s=Math.min(i.to,t.viewport.to),r=t.textDirection==sn.LTR,o=t.contentDOM,a=o.getBoundingClientRect(),l=Ir(t),h=o.querySelector(".cm-line"),c=h&&window.getComputedStyle(h),O=a.left+(c?parseInt(c.paddingLeft)+Math.min(0,parseInt(c.textIndent)):0),u=a.right-(c?parseInt(c.paddingRight):0),f=us(t,n),d=us(t,s),p=f.type==Bi.Text?f:null,g=d.type==Bi.Text?d:null;p&&(t.lineWrapping||f.widgetLineBreaks)&&(p=Lr(t,n,p));g&&(t.lineWrapping||d.widgetLineBreaks)&&(g=Lr(t,s,g));if(p&&g&&p.from==g.from)return w(b(i.from,i.to,p));{let e=p?b(i.from,null,p):S(f,!1),n=g?b(null,i.to,g):S(d,!0),s=[];return (p||f).to<(g||d).from-(p&&g?1:0)||f.widgetLineBreaks>1&&e.bottom+t.defaultLineHeight/2<n.top?s.push(m(O,e.bottom,u,n.top)):e.bottom<n.top&&t.elementAtHeight((e.bottom+n.top)/2).type==Bi.Text&&(e.bottom=n.top=(e.bottom+n.top)/2),w(e).concat(s).concat(w(n))}function m(t,i,n,s){return new Br(e,t-l.left,i-l.top-.01,n-t,s-i+.01)}function w({top:t,bottom:e,horizontal:i}){let n=[];for(let s=0;s<i.length;s+=2)n.push(m(i[s],t,i[s+1],e));return n}function b(e,i,n){let s=1e9,o=-1e9,a=[];function l(e,i,l,h,c){let f=t.coordsAtPos(e,e==n.to?-2:2),d=t.coordsAtPos(l,l==n.from?2:-2);f&&d&&(s=Math.min(f.top,d.top,s),o=Math.max(f.bottom,d.bottom,o),c==sn.LTR?a.push(r&&i?O:f.left,r&&h?u:d.right):a.push(!r&&h?O:d.left,!r&&i?u:f.right));}let h=null!=e?e:n.from,c=null!=i?i:n.to;for(let n of t.visibleRanges)if(n.to>h&&n.from<c)for(let s=Math.max(n.from,h),r=Math.min(n.to,c);;){let n=t.state.doc.lineAt(s);for(let o of t.bidiSpans(n)){let t=o.from+n.from,a=o.to+n.from;if(t>=r)break;a>s&&l(Math.max(t,s),null==e&&t<=h,Math.min(a,r),null==i&&a>=c,o.dir);}if(s=n.to+1,s>=r)break}return 0==a.length&&l(h,null==e,c,null==i,t.textDirection),{top:s,bottom:o,horizontal:a}}function S(t,e){let i=a.top+(e?t.top:t.bottom);return {top:i,bottom:i,horizontal:[]}}}(t,e,i)}}function Ir(t){let e=t.scrollDOM.getBoundingClientRect();return {left:(t.textDirection==sn.LTR?e.left:e.right-t.scrollDOM.clientWidth*t.scaleX)-t.scrollDOM.scrollLeft*t.scaleX,top:e.top-t.scrollDOM.scrollTop*t.scaleY}}function Lr(t,e,i){let n=kt.cursor(e);return {from:Math.max(i.from,t.moveToLineBoundary(n,!1,!0).from),to:Math.min(i.to,t.moveToLineBoundary(n,!0,!0).from),type:Bi.Text}}class Fr{constructor(t,e){this.view=t,this.layer=e,this.drawn=[],this.scaleX=1,this.scaleY=1,this.measureReq={read:this.measure.bind(this),write:this.draw.bind(this)},this.dom=t.scrollDOM.appendChild(document.createElement("div")),this.dom.classList.add("cm-layer"),e.above&&this.dom.classList.add("cm-layer-above"),e.class&&this.dom.classList.add(e.class),this.scale(),this.dom.setAttribute("aria-hidden","true"),this.setOrder(t.state),t.requestMeasure(this.measureReq),e.mount&&e.mount(this.dom,t);}update(t){t.startState.facet(Hr)!=t.state.facet(Hr)&&this.setOrder(t.state),(this.layer.update(t,this.dom)||t.geometryChanged)&&(this.scale(),t.view.requestMeasure(this.measureReq));}setOrder(t){let e=0,i=t.facet(Hr);for(;e<i.length&&i[e]!=this.layer;)e++;this.dom.style.zIndex=String((this.layer.above?150:-1)-e);}measure(){return this.layer.markers(this.view)}scale(){let{scaleX:t,scaleY:e}=this.view;t==this.scaleX&&e==this.scaleY||(this.scaleX=t,this.scaleY=e,this.dom.style.transform=`scale(${1/t}, ${1/e})`);}draw(t){if(t.length!=this.drawn.length||t.some(((t,e)=>{return i=t,n=this.drawn[e],!(i.constructor==n.constructor&&i.eq(n));var i,n;}))){let e=this.dom.firstChild,i=0;for(let n of t)n.update&&e&&n.constructor&&this.drawn[i].constructor&&n.update(e,this.drawn[i])?(e=e.nextSibling,i++):this.dom.insertBefore(n.draw(),e);for(;e;){let t=e.nextSibling;e.remove(),e=t;}this.drawn=t;}}destroy(){this.layer.destroy&&this.layer.destroy(this.dom,this.view),this.dom.remove();}}const Hr=Xt.define();function Jr(t){return [jn.define((e=>new Fr(e,t))),Hr.of(t)]}const Kr=!Ri.ios,to=Xt.define({combine:t=>we(t,{cursorBlinkRate:1200,drawRangeCursor:!0},{cursorBlinkRate:(t,e)=>Math.min(t,e),drawRangeCursor:(t,e)=>t||e})});function io(t){return t.startState.facet(to)!=t.state.facet(to)}Jr({above:!0,markers(t){let{state:e}=t,i=e.facet(to),n=[];for(let s of e.selection.ranges){let r=s==e.selection.main;if(s.empty?!r||Kr:i.drawRangeCursor){let e=r?"cm-cursor cm-cursor-primary":"cm-cursor cm-cursor-secondary",i=s.empty?s:kt.cursor(s.head,s.head>s.anchor?-1:1);for(let s of Br.forRange(t,e,i))n.push(s);}}return n},update(t,e){t.transactions.some((t=>t.selection))&&(e.style.animationName="cm-blink"==e.style.animationName?"cm-blink2":"cm-blink");let i=io(t);return i&&so(t.state,e),t.docChanged||t.selectionSet||i},mount(t,e){so(e.state,t);},class:"cm-cursorLayer"});function so(t,e){e.style.animationDuration=t.facet(to).cursorBlinkRate+"ms";}Jr({above:!1,markers:t=>t.state.selection.ranges.map((e=>e.empty?[]:Br.forRange(t,"cm-selectionBackground",e))).reduce(((t,e)=>t.concat(e))),update:(t,e)=>t.docChanged||t.selectionSet||t.viewportChanged||io(t),class:"cm-selectionLayer"});const oo={".cm-line":{"& ::selection":{backgroundColor:"transparent !important"},"&::selection":{backgroundColor:"transparent !important"}}};Kr&&(oo[".cm-line"].caretColor="transparent !important",oo[".cm-content"]={caretColor:"transparent !important"});Vt.highest(Yr.theme(oo));const co=null!=/x/.unicode?"gu":"g",Oo=new RegExp("[\0-\b\n--­؜​‎‏\u2028\u2029‭‮⁦⁧⁩\ufeff￹-￼]",co);let fo=null;Xt.define({combine(t){let e=we(t,{render:null,specialChars:Oo,addSpecialChars:null});return (e.replaceTabs=!function(){var t;if(null==fo&&"undefined"!=typeof document&&document.body){let e=document.body.style;fo=null!=(null!==(t=e.tabSize)&&void 0!==t?t:e.MozTabSize);}return fo||!1}())&&(e.specialChars=new RegExp("\t|"+e.specialChars.source,co)),e.addSpecialChars&&(e.specialChars=new RegExp(e.specialChars.source+"|"+e.addSpecialChars.source,co)),e}});jn.fromClass(class{constructor(){this.height=1e3,this.attrs={style:"padding-bottom: 1000px"};}update(t){let{view:e}=t,i=e.viewState.editorHeight*e.scaleY-e.defaultLineHeight-e.documentPadding.top-.5;i>=0&&i!=this.height&&(this.height=i,this.attrs={style:`padding-bottom: ${i}px`});}});const vo="-10000px";class Po{constructor(t,e,i){this.facet=e,this.createTooltipView=i,this.input=t.state.facet(e),this.tooltips=this.input.filter((t=>t)),this.tooltipViews=this.tooltips.map(i);}update(t,e){var i;let n=t.state.facet(this.facet),s=n.filter((t=>t));if(n===this.input){for(let e of this.tooltipViews)e.update&&e.update(t);return !1}let r=[],o=e?[]:null;for(let i=0;i<s.length;i++){let n=s[i],a=-1;if(n){for(let t=0;t<this.tooltips.length;t++){let e=this.tooltips[t];e&&e.create==n.create&&(a=t);}if(a<0)r[i]=this.createTooltipView(n),o&&(o[i]=!!n.above);else {let n=r[i]=this.tooltipViews[a];o&&(o[i]=e[a]),n.update&&n.update(t);}}}for(let t of this.tooltipViews)r.indexOf(t)<0&&(t.dom.remove(),null===(i=t.destroy)||void 0===i||i.call(t));return e&&(o.forEach(((t,i)=>e[i]=t)),e.length=o.length),this.input=n,this.tooltips=s,this.tooltipViews=r,!0}}function $o(t){let{win:e}=t;return {top:0,left:0,bottom:e.innerHeight,right:e.innerWidth}}const Zo=Xt.define({combine:t=>{var e,i,n;return {position:Ri.ios?"absolute":(null===(e=t.find((t=>t.position)))||void 0===e?void 0:e.position)||"fixed",parent:(null===(i=t.find((t=>t.parent)))||void 0===i?void 0:i.parent)||null,tooltipSpace:(null===(n=t.find((t=>t.tooltipSpace)))||void 0===n?void 0:n.tooltipSpace)||$o}}}),Xo=new WeakMap,To=jn.fromClass(class{constructor(t){this.view=t,this.above=[],this.inView=!0,this.madeAbsolute=!1,this.lastTransaction=0,this.measureTimeout=-1;let e=t.state.facet(Zo);this.position=e.position,this.parent=e.parent,this.classes=t.themeClasses,this.createContainer(),this.measureReq={read:this.readMeasure.bind(this),write:this.writeMeasure.bind(this),key:this},this.manager=new Po(t,Co,(t=>this.createTooltip(t))),this.intersectionObserver="function"==typeof IntersectionObserver?new IntersectionObserver((t=>{Date.now()>this.lastTransaction-50&&t.length>0&&t[t.length-1].intersectionRatio<1&&this.measureSoon();}),{threshold:[1]}):null,this.observeIntersection(),t.win.addEventListener("resize",this.measureSoon=this.measureSoon.bind(this)),this.maybeMeasure();}createContainer(){this.parent?(this.container=document.createElement("div"),this.container.style.position="relative",this.container.className=this.view.themeClasses,this.parent.appendChild(this.container)):this.container=this.view.dom;}observeIntersection(){if(this.intersectionObserver){this.intersectionObserver.disconnect();for(let t of this.manager.tooltipViews)this.intersectionObserver.observe(t.dom);}}measureSoon(){this.measureTimeout<0&&(this.measureTimeout=setTimeout((()=>{this.measureTimeout=-1,this.maybeMeasure();}),50));}update(t){t.transactions.length&&(this.lastTransaction=Date.now());let e=this.manager.update(t,this.above);e&&this.observeIntersection();let i=e||t.geometryChanged,n=t.state.facet(Zo);if(n.position!=this.position&&!this.madeAbsolute){this.position=n.position;for(let t of this.manager.tooltipViews)t.dom.style.position=this.position;i=!0;}if(n.parent!=this.parent){this.parent&&this.container.remove(),this.parent=n.parent,this.createContainer();for(let t of this.manager.tooltipViews)this.container.appendChild(t.dom);i=!0;}else this.parent&&this.view.themeClasses!=this.classes&&(this.classes=this.container.className=this.view.themeClasses);i&&this.maybeMeasure();}createTooltip(t){let e=t.create(this.view);if(e.dom.classList.add("cm-tooltip"),t.arrow&&!e.dom.querySelector(".cm-tooltip > .cm-tooltip-arrow")){let t=document.createElement("div");t.className="cm-tooltip-arrow",e.dom.appendChild(t);}return e.dom.style.position=this.position,e.dom.style.top=vo,e.dom.style.left="0px",this.container.appendChild(e.dom),e.mount&&e.mount(this.view),e}destroy(){var t,e;this.view.win.removeEventListener("resize",this.measureSoon);for(let e of this.manager.tooltipViews)e.dom.remove(),null===(t=e.destroy)||void 0===t||t.call(e);this.parent&&this.container.remove(),null===(e=this.intersectionObserver)||void 0===e||e.disconnect(),clearTimeout(this.measureTimeout);}readMeasure(){let t=this.view.dom.getBoundingClientRect(),e=1,i=1,n=!1;if("fixed"==this.position&&this.manager.tooltipViews.length){let{dom:t}=this.manager.tooltipViews[0];if(Ri.gecko)n=t.offsetParent!=this.container.ownerDocument.body;else if(t.style.top==vo&&"0px"==t.style.left){let e=t.getBoundingClientRect();n=Math.abs(e.top+1e4)>1||Math.abs(e.left)>1;}}if(n||"absolute"==this.position)if(this.parent){let t=this.parent.getBoundingClientRect();t.width&&t.height&&(e=t.width/this.parent.offsetWidth,i=t.height/this.parent.offsetHeight);}else ({scaleX:e,scaleY:i}=this.view.viewState);return {editor:t,parent:this.parent?this.container.getBoundingClientRect():t,pos:this.manager.tooltips.map(((t,e)=>{let i=this.manager.tooltipViews[e];return i.getCoords?i.getCoords(t.pos):this.view.coordsAtPos(t.pos)})),size:this.manager.tooltipViews.map((({dom:t})=>t.getBoundingClientRect())),space:this.view.state.facet(Zo).tooltipSpace(this.view),scaleX:e,scaleY:i,makeAbsolute:n}}writeMeasure(t){var e;if(t.makeAbsolute){this.madeAbsolute=!0,this.position="absolute";for(let t of this.manager.tooltipViews)t.dom.style.position="absolute";}let{editor:i,space:n,scaleX:s,scaleY:r}=t,o=[];for(let a=0;a<this.manager.tooltips.length;a++){let l=this.manager.tooltips[a],h=this.manager.tooltipViews[a],{dom:c}=h,O=t.pos[a],u=t.size[a];if(!O||O.bottom<=Math.max(i.top,n.top)||O.top>=Math.min(i.bottom,n.bottom)||O.right<Math.max(i.left,n.left)-.1||O.left>Math.min(i.right,n.right)+.1){c.style.top=vo;continue}let f=l.arrow?h.dom.querySelector(".cm-tooltip-arrow"):null,d=f?7:0,p=u.right-u.left,g=null!==(e=Xo.get(h))&&void 0!==e?e:u.bottom-u.top,m=h.offset||Ao,w=this.view.textDirection==sn.LTR,b=u.width>n.right-n.left?w?n.left:n.right-u.width:w?Math.min(O.left-(f?14:0)+m.x,n.right-p):Math.max(n.left,O.left-p+(f?14:0)-m.x),S=this.above[a];!l.strictSide&&(S?O.top-(u.bottom-u.top)-m.y<n.top:O.bottom+(u.bottom-u.top)+m.y>n.bottom)&&S==n.bottom-O.bottom>O.top-n.top&&(S=this.above[a]=!S);let Q=(S?O.top-n.top:n.bottom-O.bottom)-d;if(Q<g&&!1!==h.resize){if(Q<this.view.defaultLineHeight){c.style.top=vo;continue}Xo.set(h,g),c.style.height=(g=Q)/r+"px";}else c.style.height&&(c.style.height="");let x=S?O.top-g-d-m.y:O.bottom+d+m.y,y=b+p;if(!0!==h.overlap)for(let t of o)t.left<y&&t.right>b&&t.top<x+g&&t.bottom>x&&(x=S?t.top-g-2-d:t.bottom+d+2);if("absolute"==this.position?(c.style.top=(x-t.parent.top)/r+"px",c.style.left=(b-t.parent.left)/s+"px"):(c.style.top=x/r+"px",c.style.left=b/s+"px"),f){let t=O.left+(w?m.x:-m.x)-(b+14-7);f.style.left=t/s+"px";}!0!==h.overlap&&o.push({left:b,top:x,right:y,bottom:x+g}),c.classList.toggle("cm-tooltip-above",S),c.classList.toggle("cm-tooltip-below",!S),h.positioned&&h.positioned(t.space);}}maybeMeasure(){if(this.manager.tooltips.length&&(this.view.inView&&this.view.requestMeasure(this.measureReq),this.inView!=this.view.inView&&(this.inView=this.view.inView,!this.inView)))for(let t of this.manager.tooltipViews)t.dom.style.top=vo;}},{eventObservers:{scroll(){this.maybeMeasure();}}}),Ro=Yr.baseTheme({".cm-tooltip":{zIndex:100,boxSizing:"border-box"},"&light .cm-tooltip":{border:"1px solid #bbb",backgroundColor:"#f5f5f5"},"&light .cm-tooltip-section:not(:first-child)":{borderTop:"1px solid #bbb"},"&dark .cm-tooltip":{backgroundColor:"#333338",color:"white"},".cm-tooltip-arrow":{height:"7px",width:"14px",position:"absolute",zIndex:-1,overflow:"hidden","&:before, &:after":{content:"''",position:"absolute",width:0,height:0,borderLeft:"7px solid transparent",borderRight:"7px solid transparent"},".cm-tooltip-above &":{bottom:"-7px","&:before":{borderTop:"7px solid #bbb"},"&:after":{borderTop:"7px solid #f5f5f5",bottom:"1px"}},".cm-tooltip-below &":{top:"-7px","&:before":{borderBottom:"7px solid #bbb"},"&:after":{borderBottom:"7px solid #f5f5f5",top:"1px"}}},"&dark .cm-tooltip .cm-tooltip-arrow":{"&:before":{borderTopColor:"#333338",borderBottomColor:"#333338"},"&:after":{borderTopColor:"transparent",borderBottomColor:"transparent"}}}),Ao={x:0,y:0},Co=Xt.define({enables:[To,Ro]});function qo(t,e){let i=t.plugin(To);if(!i)return null;let n=i.manager.tooltips.indexOf(e);return n<0?null:i.manager.tooltipViews[n]}const Wo=Xt.define({combine(t){let e,i;for(let n of t)e=e||n.topContainer,i=i||n.bottomContainer;return {topContainer:e,bottomContainer:i}}}),Mo=jn.fromClass(class{constructor(t){this.input=t.state.facet(Eo),this.specs=this.input.filter((t=>t)),this.panels=this.specs.map((e=>e(t)));let e=t.state.facet(Wo);this.top=new jo(t,!0,e.topContainer),this.bottom=new jo(t,!1,e.bottomContainer),this.top.sync(this.panels.filter((t=>t.top))),this.bottom.sync(this.panels.filter((t=>!t.top)));for(let t of this.panels)t.dom.classList.add("cm-panel"),t.mount&&t.mount();}update(t){let e=t.state.facet(Wo);this.top.container!=e.topContainer&&(this.top.sync([]),this.top=new jo(t.view,!0,e.topContainer)),this.bottom.container!=e.bottomContainer&&(this.bottom.sync([]),this.bottom=new jo(t.view,!1,e.bottomContainer)),this.top.syncClasses(),this.bottom.syncClasses();let i=t.state.facet(Eo);if(i!=this.input){let e=i.filter((t=>t)),n=[],s=[],r=[],o=[];for(let i of e){let e,a=this.specs.indexOf(i);a<0?(e=i(t.view),o.push(e)):(e=this.panels[a],e.update&&e.update(t)),n.push(e),(e.top?s:r).push(e);}this.specs=e,this.panels=n,this.top.sync(s),this.bottom.sync(r);for(let t of o)t.dom.classList.add("cm-panel"),t.mount&&t.mount();}else for(let e of this.panels)e.update&&e.update(t);}destroy(){this.top.sync([]),this.bottom.sync([]);}},{provide:t=>Yr.scrollMargins.of((e=>{let i=e.plugin(t);return i&&{top:i.top.scrollMargin(),bottom:i.bottom.scrollMargin()}}))});class jo{constructor(t,e,i){this.view=t,this.top=e,this.container=i,this.dom=void 0,this.classes="",this.panels=[],this.syncClasses();}sync(t){for(let e of this.panels)e.destroy&&t.indexOf(e)<0&&e.destroy();this.panels=t,this.syncDOM();}syncDOM(){if(0==this.panels.length)return void(this.dom&&(this.dom.remove(),this.dom=void 0));if(!this.dom){this.dom=document.createElement("div"),this.dom.className=this.top?"cm-panels cm-panels-top":"cm-panels cm-panels-bottom",this.dom.style[this.top?"top":"bottom"]="0";let t=this.container||this.view.dom;t.insertBefore(this.dom,this.top?t.firstChild:null);}let t=this.dom.firstChild;for(let e of this.panels)if(e.dom.parentNode==this.dom){for(;t!=e.dom;)t=_o(t);t=t.nextSibling;}else this.dom.insertBefore(e.dom,t);for(;t;)t=_o(t);}scrollMargin(){return !this.dom||this.container?0:Math.max(0,this.top?this.dom.getBoundingClientRect().bottom-Math.max(0,this.view.scrollDOM.getBoundingClientRect().top):Math.min(innerHeight,this.view.scrollDOM.getBoundingClientRect().bottom)-this.dom.getBoundingClientRect().top)}syncClasses(){if(this.container&&this.classes!=this.view.themeClasses){for(let t of this.classes.split(" "))t&&this.container.classList.remove(t);for(let t of (this.classes=this.view.themeClasses).split(" "))t&&this.container.classList.add(t);}}}function _o(t){let e=t.nextSibling;return t.remove(),e}const Eo=Xt.define({enables:Mo});class zo extends be{compare(t){return this==t||this.constructor==t.constructor&&this.eq(t)}eq(t){return !1}destroy(t){}}zo.prototype.elementClass="",zo.prototype.toDOM=void 0,zo.prototype.mapMode=gt.TrackBefore,zo.prototype.startSide=zo.prototype.endSide=-1,zo.prototype.point=!0;const Vo=Xt.define(),Uo=Xt.define();const Go=Xt.define({combine:t=>t.some((t=>t))});jn.fromClass(class{constructor(t){this.view=t,this.prevViewport=t.viewport,this.dom=document.createElement("div"),this.dom.className="cm-gutters",this.dom.setAttribute("aria-hidden","true"),this.dom.style.minHeight=this.view.contentHeight/this.view.scaleY+"px",this.gutters=t.state.facet(Uo).map((e=>new Jo(t,e)));for(let t of this.gutters)this.dom.appendChild(t.dom);this.fixed=!t.state.facet(Go),this.fixed&&(this.dom.style.position="sticky"),this.syncGutters(!1),t.scrollDOM.insertBefore(this.dom,t.contentDOM);}update(t){if(this.updateGutters(t)){let e=this.prevViewport,i=t.view.viewport,n=Math.min(e.to,i.to)-Math.max(e.from,i.from);this.syncGutters(n<.8*(i.to-i.from));}t.geometryChanged&&(this.dom.style.minHeight=this.view.contentHeight+"px"),this.view.state.facet(Go)!=!this.fixed&&(this.fixed=!this.fixed,this.dom.style.position=this.fixed?"sticky":""),this.prevViewport=t.view.viewport;}syncGutters(t){let e=this.dom.nextSibling;t&&this.dom.remove();let i=ye.iter(this.view.state.facet(Vo),this.view.viewport.from),n=[],s=this.gutters.map((t=>new Ho(t,this.view.viewport,-this.view.documentPadding.top)));for(let t of this.view.viewportLineBlocks)if(n.length&&(n=[]),Array.isArray(t.type)){let e=!0;for(let r of t.type)if(r.type==Bi.Text&&e){Fo(i,n,r.from);for(let t of s)t.line(this.view,r,n);e=!1;}else if(r.widget)for(let t of s)t.widget(this.view,r);}else if(t.type==Bi.Text){Fo(i,n,t.from);for(let e of s)e.line(this.view,t,n);}else if(t.widget)for(let e of s)e.widget(this.view,t);for(let t of s)t.finish();t&&this.view.scrollDOM.insertBefore(this.dom,e);}updateGutters(t){let e=t.startState.facet(Uo),i=t.state.facet(Uo),n=t.docChanged||t.heightChanged||t.viewportChanged||!ye.eq(t.startState.facet(Vo),t.state.facet(Vo),t.view.viewport.from,t.view.viewport.to);if(e==i)for(let e of this.gutters)e.update(t)&&(n=!0);else {n=!0;let s=[];for(let n of i){let i=e.indexOf(n);i<0?s.push(new Jo(this.view,n)):(this.gutters[i].update(t),s.push(this.gutters[i]));}for(let t of this.gutters)t.dom.remove(),s.indexOf(t)<0&&t.destroy();for(let t of s)this.dom.appendChild(t.dom);this.gutters=s;}return n}destroy(){for(let t of this.gutters)t.destroy();this.dom.remove();}},{provide:t=>Yr.scrollMargins.of((e=>{let i=e.plugin(t);return i&&0!=i.gutters.length&&i.fixed?e.textDirection==sn.LTR?{left:i.dom.offsetWidth*e.scaleX}:{right:i.dom.offsetWidth*e.scaleX}:null}))});function Lo(t){return Array.isArray(t)?t:[t]}function Fo(t,e,i){for(;t.value&&t.from<=i;)t.from==i&&e.push(t.value),t.next();}class Ho{constructor(t,e,i){this.gutter=t,this.height=i,this.i=0,this.cursor=ye.iter(t.markers,e.from);}addElement(t,e,i){let{gutter:n}=this,s=(e.top-this.height)/t.scaleY,r=e.height/t.scaleY;if(this.i==n.elements.length){let e=new Ko(t,r,s,i);n.elements.push(e),n.dom.appendChild(e.dom);}else n.elements[this.i].update(t,r,s,i);this.height=e.bottom,this.i++;}line(t,e,i){let n=[];Fo(this.cursor,n,e.from),i.length&&(n=n.concat(i));let s=this.gutter.config.lineMarker(t,e,n);s&&n.unshift(s);let r=this.gutter;(0!=n.length||r.config.renderEmptyElements)&&this.addElement(t,e,n);}widget(t,e){let i=this.gutter.config.widgetMarker(t,e.widget,e);i&&this.addElement(t,e,[i]);}finish(){let t=this.gutter;for(;t.elements.length>this.i;){let e=t.elements.pop();t.dom.removeChild(e.dom),e.destroy();}}}class Jo{constructor(t,e){this.view=t,this.config=e,this.elements=[],this.spacer=null,this.dom=document.createElement("div"),this.dom.className="cm-gutter"+(this.config.class?" "+this.config.class:"");for(let i in e.domEventHandlers)this.dom.addEventListener(i,(n=>{let s,r=n.target;if(r!=this.dom&&this.dom.contains(r)){for(;r.parentNode!=this.dom;)r=r.parentNode;let t=r.getBoundingClientRect();s=(t.top+t.bottom)/2;}else s=n.clientY;let o=t.lineBlockAtHeight(s-t.documentTop);e.domEventHandlers[i](t,o,n)&&n.preventDefault();}));this.markers=Lo(e.markers(t)),e.initialSpacer&&(this.spacer=new Ko(t,0,0,[e.initialSpacer(t)]),this.dom.appendChild(this.spacer.dom),this.spacer.dom.style.cssText+="visibility: hidden; pointer-events: none");}update(t){let e=this.markers;if(this.markers=Lo(this.config.markers(t.view)),this.spacer&&this.config.updateSpacer){let e=this.config.updateSpacer(this.spacer.markers[0],t);e!=this.spacer.markers[0]&&this.spacer.update(t.view,0,0,[e]);}let i=t.view.viewport;return !ye.eq(this.markers,e,i.from,i.to)||!!this.config.lineMarkerChange&&this.config.lineMarkerChange(t)}destroy(){for(let t of this.elements)t.destroy();}}class Ko{constructor(t,e,i,n){this.height=-1,this.above=0,this.markers=[],this.dom=document.createElement("div"),this.dom.className="cm-gutterElement",this.update(t,e,i,n);}update(t,e,i,n){this.height!=e&&(this.height=e,this.dom.style.height=e+"px"),this.above!=i&&(this.dom.style.marginTop=(this.above=i)?i+"px":""),function(t,e){if(t.length!=e.length)return !1;for(let i=0;i<t.length;i++)if(!t[i].compare(e[i]))return !1;return !0}(this.markers,n)||this.setMarkers(t,n);}setMarkers(t,e){let i="cm-gutterElement",n=this.dom.firstChild;for(let s=0,r=0;;){let o=r,a=s<e.length?e[s++]:null,l=!1;if(a){let t=a.elementClass;t&&(i+=" "+t);for(let t=r;t<this.markers.length;t++)if(this.markers[t].compare(a)){o=t,l=!0;break}}else o=this.markers.length;for(;r<o;){let t=this.markers[r++];if(t.toDOM){t.destroy(n);let e=n.nextSibling;n.remove(),n=e;}}if(!a)break;a.toDOM&&(l?n=n.nextSibling:this.dom.insertBefore(a.toDOM(t),n)),l&&r++;}this.dom.className=i,this.markers=e;}destroy(){this.setMarkers(null,[]);}}const ta=Xt.define(),ea=Xt.define({combine:t=>we(t,{formatNumber:String,domEventHandlers:{}},{domEventHandlers(t,e){let i=Object.assign({},t);for(let t in e){let n=i[t],s=e[t];i[t]=n?(t,e,i)=>n(t,e,i)||s(t,e,i):s;}return i}})});class ia extends zo{constructor(t){super(),this.number=t;}eq(t){return this.number==t.number}toDOM(){return document.createTextNode(this.number)}}function na(t,e){return t.state.facet(ea).formatNumber(e,t.state)}Uo.compute([ea],(t=>({class:"cm-lineNumbers",renderEmptyElements:!1,markers:t=>t.state.facet(ta),lineMarker:(t,e,i)=>i.some((t=>t.toDOM))?null:new ia(na(t,t.state.doc.lineAt(e.from).number)),widgetMarker:()=>null,lineMarkerChange:t=>t.startState.facet(ea)!=t.state.facet(ea),initialSpacer:t=>new ia(na(t,oa(t.state.doc.lines))),updateSpacer(t,e){let i=na(e.view,oa(e.view.state.doc.lines));return i==t.number?t:new ia(i)},domEventHandlers:t.facet(ea).domEventHandlers})));function oa(t){let e=9;for(;e<t;)e=10*e+9;return e}let aa=0;class la{constructor(t,e,i){this.set=t,this.base=e,this.modified=i,this.id=aa++;}static define(t){if(null==t?void 0:t.base)throw new Error("Can not derive from a modified tag");let e=new la([],null,[]);if(e.set.push(e),t)for(let i of t.set)e.set.push(i);return e}static defineModifier(){let t=new ca;return e=>e.modified.indexOf(t)>-1?e:ca.get(e.base||e,e.modified.concat(t).sort(((t,e)=>t.id-e.id)))}}let ha=0;class ca{constructor(){this.instances=[],this.id=ha++;}static get(t,e){if(!e.length)return t;let i=e[0].instances.find((i=>{return i.base==t&&(n=e,s=i.modified,n.length==s.length&&n.every(((t,e)=>t==s[e])));var n,s;}));if(i)return i;let n=[],s=new la(n,t,e);for(let t of e)t.instances.push(s);let r=function(t){let e=[[]];for(let i=0;i<t.length;i++)for(let n=0,s=e.length;n<s;n++)e.push(e[n].concat(t[i]));return e.sort(((t,e)=>e.length-t.length))}(e);for(let e of t.set)if(!e.modified.length)for(let t of r)n.push(ca.get(e,t));return s}}function Oa(t){let e=Object.create(null);for(let i in t){let n=t[i];Array.isArray(n)||(n=[n]);for(let t of i.split(" "))if(t){let i=[],s=2,r=t;for(let e=0;;){if("..."==r&&e>0&&e+3==t.length){s=1;break}let n=/^"(?:[^"\\]|\\.)*?"|[^\/!]+/.exec(r);if(!n)throw new RangeError("Invalid path: "+t);if(i.push("*"==n[0]?"":'"'==n[0][0]?JSON.parse(n[0]):n[0]),e+=n[0].length,e==t.length)break;let o=t[e++];if(e==t.length&&"!"==o){s=0;break}if("/"!=o)throw new RangeError("Invalid path: "+t);r=t.slice(e);}let o=i.length-1,a=i[o];if(!a)throw new RangeError("Invalid path: "+t);let l=new fa(n,s,o>0?i.slice(0,o):null);e[a]=l.sort(e[a]);}}return ua.add(e)}const ua=new n;class fa{constructor(t,e,i,n){this.tags=t,this.mode=e,this.context=i,this.next=n;}get opaque(){return 0==this.mode}get inherit(){return 1==this.mode}sort(t){return !t||t.depth<this.depth?(this.next=t,this):(t.next=this.sort(t.next),t)}get depth(){return this.context?this.context.length:0}}function da(t,e){let i=Object.create(null);for(let e of t)if(Array.isArray(e.tag))for(let t of e.tag)i[t.id]=e.class;else i[e.tag.id]=e.class;let{scope:n,all:s=null}={};return {style:t=>{let e=s;for(let n of t)for(let t of n.set){let n=i[t.id];if(n){e=e?e+" "+n:n;break}}return e},scope:n}}function pa(t,e,i,n=0,s=t.length){let r=new ga(n,Array.isArray(e)?e:[e],i);r.highlightRange(t.cursor(),n,s,"",r.highlighters),r.flush(s);}fa.empty=new fa([],2,null);class ga{constructor(t,e,i){this.at=t,this.highlighters=e,this.span=i,this.class="";}startSpan(t,e){e!=this.class&&(this.flush(t),t>this.at&&(this.at=t),this.class=e);}flush(t){t>this.at&&this.class&&this.span(this.at,t,this.class);}highlightRange(t,e,i,s,r){let{type:o,from:a,to:l}=t;if(a>=i||l<=e)return;o.isTop&&(r=this.highlighters.filter((t=>!t.scope||t.scope(o))));let h=s,c=function(t){let e=t.type.prop(ua);for(;e&&e.context&&!t.matchContext(e.context);)e=e.next;return e||null}(t)||fa.empty,O=function(t,e){let i=null;for(let n of t){let t=n.style(e);t&&(i=i?i+" "+t:t);}return i}(r,c.tags);if(O&&(h&&(h+=" "),h+=O,1==c.mode&&(s+=(s?" ":"")+O)),this.startSpan(Math.max(e,a),h),c.opaque)return;let u=t.tree&&t.tree.prop(n.mounted);if(u&&u.overlay){let n=t.node.enter(u.overlay[0].from+a,1),o=this.highlighters.filter((t=>!t.scope||t.scope(u.tree.type))),c=t.firstChild();for(let O=0,f=a;;O++){let d=O<u.overlay.length?u.overlay[O]:null,p=d?d.from+a:l,g=Math.max(e,f),m=Math.min(i,p);if(g<m&&c)for(;t.from<m&&(this.highlightRange(t,g,m,s,r),this.startSpan(Math.min(m,t.to),h),!(t.to>=p)&&t.nextSibling()););if(!d||p>i)break;f=d.to+a,f>e&&(this.highlightRange(n.cursor(),Math.max(e,d.from+a),Math.min(i,f),"",o),this.startSpan(Math.min(i,f),h));}c&&t.parent();}else if(t.firstChild()){u&&(s="");do{if(!(t.to<=e)){if(t.from>=i)break;this.highlightRange(t,e,i,s,r),this.startSpan(Math.min(i,t.to),h);}}while(t.nextSibling());t.parent();}}}const ma=la.define,wa=ma(),ba=ma(),Sa=ma(ba),Qa=ma(ba),xa=ma(),ya=ma(xa),va=ma(xa),Pa=ma(),ka=ma(Pa),$a=ma(),Za=ma(),Xa=ma(),Ta=ma(Xa),Ra=ma(),Aa={comment:wa,lineComment:ma(wa),blockComment:ma(wa),docComment:ma(wa),name:ba,variableName:ma(ba),typeName:Sa,tagName:ma(Sa),propertyName:Qa,attributeName:ma(Qa),className:ma(ba),labelName:ma(ba),namespace:ma(ba),macroName:ma(ba),literal:xa,string:ya,docString:ma(ya),character:ma(ya),attributeValue:ma(ya),number:va,integer:ma(va),float:ma(va),bool:ma(xa),regexp:ma(xa),escape:ma(xa),color:ma(xa),url:ma(xa),keyword:$a,self:ma($a),null:ma($a),atom:ma($a),unit:ma($a),modifier:ma($a),operatorKeyword:ma($a),controlKeyword:ma($a),definitionKeyword:ma($a),moduleKeyword:ma($a),operator:Za,derefOperator:ma(Za),arithmeticOperator:ma(Za),logicOperator:ma(Za),bitwiseOperator:ma(Za),compareOperator:ma(Za),updateOperator:ma(Za),definitionOperator:ma(Za),typeOperator:ma(Za),controlOperator:ma(Za),punctuation:Xa,separator:ma(Xa),bracket:Ta,angleBracket:ma(Ta),squareBracket:ma(Ta),paren:ma(Ta),brace:ma(Ta),content:Pa,heading:ka,heading1:ma(ka),heading2:ma(ka),heading3:ma(ka),heading4:ma(ka),heading5:ma(ka),heading6:ma(ka),contentSeparator:ma(Pa),list:ma(Pa),quote:ma(Pa),emphasis:ma(Pa),strong:ma(Pa),link:ma(Pa),monospace:ma(Pa),strikethrough:ma(Pa),inserted:ma(),deleted:ma(),changed:ma(),invalid:ma(),meta:Ra,documentMeta:ma(Ra),annotation:ma(Ra),processingInstruction:ma(Ra),definition:la.defineModifier(),constant:la.defineModifier(),function:la.defineModifier(),standard:la.defineModifier(),local:la.defineModifier(),special:la.defineModifier()};var Ca;da([{tag:Aa.link,class:"tok-link"},{tag:Aa.heading,class:"tok-heading"},{tag:Aa.emphasis,class:"tok-emphasis"},{tag:Aa.strong,class:"tok-strong"},{tag:Aa.keyword,class:"tok-keyword"},{tag:Aa.atom,class:"tok-atom"},{tag:Aa.bool,class:"tok-bool"},{tag:Aa.url,class:"tok-url"},{tag:Aa.labelName,class:"tok-labelName"},{tag:Aa.inserted,class:"tok-inserted"},{tag:Aa.deleted,class:"tok-deleted"},{tag:Aa.literal,class:"tok-literal"},{tag:Aa.string,class:"tok-string"},{tag:Aa.number,class:"tok-number"},{tag:[Aa.regexp,Aa.escape,Aa.special(Aa.string)],class:"tok-string2"},{tag:Aa.variableName,class:"tok-variableName"},{tag:Aa.local(Aa.variableName),class:"tok-variableName tok-local"},{tag:Aa.definition(Aa.variableName),class:"tok-variableName tok-definition"},{tag:Aa.special(Aa.variableName),class:"tok-variableName2"},{tag:Aa.definition(Aa.propertyName),class:"tok-propertyName tok-definition"},{tag:Aa.typeName,class:"tok-typeName"},{tag:Aa.namespace,class:"tok-namespace"},{tag:Aa.className,class:"tok-className"},{tag:Aa.macroName,class:"tok-macroName"},{tag:Aa.propertyName,class:"tok-propertyName"},{tag:Aa.operator,class:"tok-operator"},{tag:Aa.comment,class:"tok-comment"},{tag:Aa.meta,class:"tok-meta"},{tag:Aa.invalid,class:"tok-invalid"},{tag:Aa.punctuation,class:"tok-punctuation"}]);const qa=new n;function Ya(t){return Xt.define({combine:t?e=>e.concat(t):void 0})}const Wa=new n;class Ma{constructor(t,e,i=[],n=""){this.data=t,this.name=n,me.prototype.hasOwnProperty("tree")||Object.defineProperty(me.prototype,"tree",{get(){return Ea(this)}}),this.parser=e,this.extension=[Ja.of(this),me.languageData.of(((t,e,i)=>{let n=ja(t,e,i),s=n.type.prop(qa);if(!s)return [];let r=t.facet(s),o=n.type.prop(Wa);if(o){let s=n.resolve(e-n.from,i);for(let e of o)if(e.test(s,t)){let i=t.facet(e.facet);return "replace"==e.type?i:i.concat(r)}}return r}))].concat(i);}isActiveAt(t,e,i=-1){return ja(t,e,i).type.prop(qa)==this.data}findRegions(t){let e=t.facet(Ja);if((null==e?void 0:e.data)==this.data)return [{from:0,to:t.doc.length}];if(!e||!e.allowsNesting)return [];let i=[],s=(t,e)=>{if(t.prop(qa)==this.data)return void i.push({from:e,to:e+t.length});let r=t.prop(n.mounted);if(r){if(r.tree.prop(qa)==this.data){if(r.overlay)for(let t of r.overlay)i.push({from:t.from+e,to:t.to+e});else i.push({from:e,to:e+t.length});return}if(r.overlay){let t=i.length;if(s(r.tree,r.overlay[0].from+e),i.length>t)return}}for(let i=0;i<t.children.length;i++){let n=t.children[i];n instanceof O&&s(n,t.positions[i]+e);}};return s(Ea(t),0),i}get allowsNesting(){return !0}}function ja(t,e,i){let n=t.facet(Ja),s=Ea(t).topNode;if(!n||n.allowsNesting)for(let t=s;t;t=t.enter(e,i,c.ExcludeBuffers))t.type.isTop&&(s=t);return s}Ma.setState=re.define();class _a extends Ma{constructor(t,e,i){super(t,e,[],i),this.parser=e;}static define(t){let e=Ya(t.languageData);return new _a(e,t.parser.configure({props:[qa.add((t=>t.isTop?e:void 0))]}),t.name)}configure(t,e){return new _a(this.data,this.parser.configure(t),e||this.name)}get allowsNesting(){return this.parser.hasWrappers()}}function Ea(t){let e=t.field(Ma.state,!1);return e?e.tree:O.empty}class Ua{constructor(t){this.doc=t,this.cursorPos=0,this.string="",this.cursor=t.iter();}get length(){return this.doc.length}syncTo(t){return this.string=this.cursor.next(t-this.cursorPos).value,this.cursorPos=t+this.string.length,this.cursorPos-this.string.length}chunk(t){return this.syncTo(t),this.string}get lineChunks(){return !0}read(t,e){let i=this.cursorPos-this.string.length;return t<i||e>=this.cursorPos?this.doc.sliceString(t,e):this.string.slice(t-i,e-i)}}let Na=null;class Ga{constructor(t,e,i=[],n,s,r,o,a){this.parser=t,this.state=e,this.fragments=i,this.tree=n,this.treeLen=s,this.viewport=r,this.skipped=o,this.scheduleOn=a,this.parse=null,this.tempSkipped=[];}static create(t,e,i){return new Ga(t,e,[],O.empty,0,i,[],null)}startParse(){return this.parser.startParse(new Ua(this.state.doc),this.fragments)}work(t,e){return null!=e&&e>=this.state.doc.length&&(e=void 0),this.tree!=O.empty&&this.isDone(null!=e?e:this.state.doc.length)?(this.takeTree(),!0):this.withContext((()=>{var i;if("number"==typeof t){let e=Date.now()+t;t=()=>Date.now()>e;}for(this.parse||(this.parse=this.startParse()),null!=e&&(null==this.parse.stoppedAt||this.parse.stoppedAt>e)&&e<this.state.doc.length&&this.parse.stopAt(e);;){let n=this.parse.advance();if(n){if(this.fragments=this.withoutTempSkipped(T.addTree(n,this.fragments,null!=this.parse.stoppedAt)),this.treeLen=null!==(i=this.parse.stoppedAt)&&void 0!==i?i:this.state.doc.length,this.tree=n,this.parse=null,!(this.treeLen<(null!=e?e:this.state.doc.length)))return !0;this.parse=this.startParse();}if(t())return !1}}))}takeTree(){let t,e;this.parse&&(t=this.parse.parsedPos)>=this.treeLen&&((null==this.parse.stoppedAt||this.parse.stoppedAt>t)&&this.parse.stopAt(t),this.withContext((()=>{for(;!(e=this.parse.advance()););})),this.treeLen=t,this.tree=e,this.fragments=this.withoutTempSkipped(T.addTree(this.tree,this.fragments,!0)),this.parse=null);}withContext(t){let e=Na;Na=this;try{return t()}finally{Na=e;}}withoutTempSkipped(t){for(let e;e=this.tempSkipped.pop();)t=Ba(t,e.from,e.to);return t}changes(t,e){let{fragments:i,tree:n,treeLen:s,viewport:r,skipped:o}=this;if(this.takeTree(),!t.empty){let e=[];if(t.iterChangedRanges(((t,i,n,s)=>e.push({fromA:t,toA:i,fromB:n,toB:s}))),i=T.applyChanges(i,e),n=O.empty,s=0,r={from:t.mapPos(r.from,-1),to:t.mapPos(r.to,1)},this.skipped.length){o=[];for(let e of this.skipped){let i=t.mapPos(e.from,1),n=t.mapPos(e.to,-1);i<n&&o.push({from:i,to:n});}}}return new Ga(this.parser,e,i,n,s,r,o,this.scheduleOn)}updateViewport(t){if(this.viewport.from==t.from&&this.viewport.to==t.to)return !1;this.viewport=t;let e=this.skipped.length;for(let e=0;e<this.skipped.length;e++){let{from:i,to:n}=this.skipped[e];i<t.to&&n>t.from&&(this.fragments=Ba(this.fragments,i,n),this.skipped.splice(e--,1));}return !(this.skipped.length>=e)&&(this.reset(),!0)}reset(){this.parse&&(this.takeTree(),this.parse=null);}skipUntilInView(t,e){this.skipped.push({from:t,to:e});}static getSkippingParser(t){return new class extends R{createParse(e,i,n){let s=n[0].from,r=n[n.length-1].to;return {parsedPos:s,advance(){let e=Na;if(e){for(let t of n)e.tempSkipped.push(t);t&&(e.scheduleOn=e.scheduleOn?Promise.all([e.scheduleOn,t]):t);}return this.parsedPos=r,new O(o.none,[],[],r-s)},stoppedAt:null,stopAt(){}}}}}isDone(t){t=Math.min(t,this.state.doc.length);let e=this.fragments;return this.treeLen>=t&&e.length&&0==e[0].from&&e[0].to>=t}static get(){return Na}}function Ba(t,e,i){return T.applyChanges(t,[{fromA:e,toA:i,fromB:e,toB:i}])}class Ia{constructor(t){this.context=t,this.tree=t.tree;}apply(t){if(!t.docChanged&&this.tree==this.context.tree)return this;let e=this.context.changes(t.changes,t.state),i=this.context.treeLen==t.startState.doc.length?void 0:Math.max(t.changes.mapPos(this.context.treeLen),e.viewport.to);return e.work(20,i)||e.takeTree(),new Ia(e)}static init(t){let e=Math.min(3e3,t.doc.length),i=Ga.create(t.facet(Ja).parser,t,{from:0,to:e});return i.work(20,e)||i.takeTree(),new Ia(i)}}Ma.state=Wt.define({create:Ia.init,update(t,e){for(let t of e.effects)if(t.is(Ma.setState))return t.value;return e.startState.facet(Ja)!=e.state.facet(Ja)?Ia.init(e.state):t.apply(e)}});let La=t=>{let e=setTimeout((()=>t()),500);return ()=>clearTimeout(e)};"undefined"!=typeof requestIdleCallback&&(La=t=>{let e=-1,i=setTimeout((()=>{e=requestIdleCallback(t,{timeout:400});}),100);return ()=>e<0?clearTimeout(i):cancelIdleCallback(e)});const Fa="undefined"!=typeof navigator&&(null===(Ca=navigator.scheduling)||void 0===Ca?void 0:Ca.isInputPending)?()=>navigator.scheduling.isInputPending():null,Ha=jn.fromClass(class{constructor(t){this.view=t,this.working=null,this.workScheduled=0,this.chunkEnd=-1,this.chunkBudget=-1,this.work=this.work.bind(this),this.scheduleWork();}update(t){let e=this.view.state.field(Ma.state).context;(e.updateViewport(t.view.viewport)||this.view.viewport.to>e.treeLen)&&this.scheduleWork(),(t.docChanged||t.selectionSet)&&(this.view.hasFocus&&(this.chunkBudget+=50),this.scheduleWork()),this.checkAsyncSchedule(e);}scheduleWork(){if(this.working)return;let{state:t}=this.view,e=t.field(Ma.state);e.tree==e.context.tree&&e.context.isDone(t.doc.length)||(this.working=La(this.work));}work(t){this.working=null;let e=Date.now();if(this.chunkEnd<e&&(this.chunkEnd<0||this.view.hasFocus)&&(this.chunkEnd=e+3e4,this.chunkBudget=3e3),this.chunkBudget<=0)return;let{state:i,viewport:{to:n}}=this.view,s=i.field(Ma.state);if(s.tree==s.context.tree&&s.context.isDone(n+1e5))return;let r=Date.now()+Math.min(this.chunkBudget,100,t&&!Fa?Math.max(25,t.timeRemaining()-5):1e9),o=s.context.treeLen<n&&i.doc.length>n+1e3,a=s.context.work((()=>Fa&&Fa()||Date.now()>r),n+(o?0:1e5));this.chunkBudget-=Date.now()-e,(a||this.chunkBudget<=0)&&(s.context.takeTree(),this.view.dispatch({effects:Ma.setState.of(new Ia(s.context))})),this.chunkBudget>0&&(!a||o)&&this.scheduleWork(),this.checkAsyncSchedule(s.context);}checkAsyncSchedule(t){t.scheduleOn&&(this.workScheduled++,t.scheduleOn.then((()=>this.scheduleWork())).catch((t=>qn(this.view.state,t))).then((()=>this.workScheduled--)),t.scheduleOn=null);}destroy(){this.working&&this.working();}isWorking(){return !!(this.working||this.workScheduled>0)}},{eventHandlers:{focus(){this.scheduleWork();}}}),Ja=Xt.define({combine:t=>t.length?t[0]:null,enables:t=>[Ma.state,Ha,Yr.contentAttributes.compute([t],(e=>{let i=e.facet(t);return i&&i.name?{"data-language":i.name}:{}}))]});const el=Xt.define(),il=Xt.define({combine:t=>{if(!t.length)return "  ";let e=t[0];if(!e||/\S/.test(e)||Array.from(e).some((t=>t!=e[0])))throw new Error("Invalid indent unit: "+JSON.stringify(t[0]));return e}});function nl(t){let e=t.facet(il);return 9==e.charCodeAt(0)?t.tabSize*e.length:e.length}function sl(t,e){let i="",n=t.tabSize,s=t.facet(il)[0];if("\t"==s){for(;e>=n;)i+="\t",e-=n;s=" ";}for(let t=0;t<e;t++)i+=s;return i}function rl(t,e){t instanceof me&&(t=new ol(t));for(let i of t.state.facet(el)){let n=i(t,e);if(void 0!==n)return n}let i=Ea(t.state);return i.length>=e?function(t,e,i){let n=e.resolveStack(i),s=n.node.enterUnfinishedNodesBefore(i);if(s!=n.node){let t=[];for(let e=s;e!=n.node;e=e.parent)t.push(e);for(let e=t.length-1;e>=0;e--)n={node:t[e],next:n};}return ll(n,t,i)}(t,i,e):null}class ol{constructor(t,e={}){this.state=t,this.options=e,this.unit=nl(t);}lineAt(t,e=1){let i=this.state.doc.lineAt(t),{simulateBreak:n,simulateDoubleBreak:s}=this.options;return null!=n&&n>=i.from&&n<=i.to?s&&n==t?{text:"",from:t}:(e<0?n<t:n<=t)?{text:i.text.slice(n-i.from),from:n}:{text:i.text.slice(0,n-i.from),from:i.from}:i}textAfterPos(t,e=1){if(this.options.simulateDoubleBreak&&t==this.options.simulateBreak)return "";let{text:i,from:n}=this.lineAt(t,e);return i.slice(t-n,Math.min(i.length,t+100-n))}column(t,e=1){let{text:i,from:n}=this.lineAt(t,e),s=this.countColumn(i,t-n),r=this.options.overrideIndentation?this.options.overrideIndentation(n):-1;return r>-1&&(s+=r-this.countColumn(i,i.search(/\S|$/))),s}countColumn(t,e=t.length){return Ye(t,this.state.tabSize,e)}lineIndent(t,e=1){let{text:i,from:n}=this.lineAt(t,e),s=this.options.overrideIndentation;if(s){let t=s(n);if(t>-1)return t}return this.countColumn(i,i.search(/\S|$/))}get simulatedBreak(){return this.options.simulateBreak||null}}const al=new n;function ll(t,e,i){for(let n=t;n;n=n.next){let t=hl(n.node);if(t)return t(Ol.create(e,i,n))}return 0}function hl(t){let e=t.type.prop(al);if(e)return e;let i,s=t.firstChild;if(s&&(i=s.type.prop(n.closedBy))){let e=t.lastChild,n=e&&i.indexOf(e.name)>-1;return t=>dl(t,!0,1,void 0,n&&!function(t){return t.pos==t.options.simulateBreak&&t.options.simulateDoubleBreak}(t)?e.from:void 0)}return null==t.parent?cl:null}function cl(){return 0}class Ol extends ol{constructor(t,e,i){super(t.state,t.options),this.base=t,this.pos=e,this.context=i;}get node(){return this.context.node}static create(t,e,i){return new Ol(t,e,i)}get textAfter(){return this.textAfterPos(this.pos)}get baseIndent(){return this.baseIndentFor(this.node)}baseIndentFor(t){let e=this.state.doc.lineAt(t.from);for(;;){let i=t.resolve(e.from);for(;i.parent&&i.parent.from==i.from;)i=i.parent;if(ul(i,t))break;e=this.state.doc.lineAt(i.from);}return this.lineIndent(e.from)}continue(){return ll(this.context.next,this.base,this.pos)}}function ul(t,e){for(let i=e;i;i=i.parent)if(t==i)return !0;return !1}function fl({closing:t,align:e=!0,units:i=1}){return n=>dl(n,e,i,t)}function dl(t,e,i,n,s){let r=t.textAfter,o=r.match(/^\s*/)[0].length,a=n&&r.slice(o,o+n.length)==n||s==t.pos+o,l=e?function(t){let e=t.node,i=e.childAfter(e.from),n=e.lastChild;if(!i)return null;let s=t.options.simulateBreak,r=t.state.doc.lineAt(i.from),o=null==s||s<=r.from?r.to:Math.min(r.to,s);for(let t=i.to;;){let s=e.childAfter(t);if(!s||s==n)return null;if(!s.type.isSkipped)return s.from<o?i:null;t=s.to;}}(t):null;return l?a?t.column(l.from):t.column(l.to):t.baseIndent+(a?0:t.unit*i)}const pl=t=>t.baseIndent;function gl({except:t,units:e=1}={}){return i=>{let n=t&&t.test(i.textAfter);return i.baseIndent+(n?0:e*i.unit)}}Xt.define();const bl=new n;function Sl(t){let e=t.firstChild,i=t.lastChild;return e&&e.to<i.from?{from:e.to,to:i.type.isError?t.to:i.from}:null}function yl(t,e){let i=e.mapPos(t.from,1),n=e.mapPos(t.to,-1);return i>=n?void 0:{from:i,to:n}}const vl=re.define({map:yl}),Pl=re.define({map:yl});const $l=Wt.define({create:()=>Ii.none,update(t,e){t=t.map(e.changes);for(let i of e.effects)if(i.is(vl)&&!Xl(t,i.value.from,i.value.to)){let{preparePlaceholder:n}=e.state.facet(ql),s=n?Ii.replace({widget:new jl(n(e.state,i.value))}):Ml;t=t.update({add:[s.range(i.value.from,i.value.to)]});}else i.is(Pl)&&(t=t.update({filter:(t,e)=>i.value.from!=t||i.value.to!=e,filterFrom:i.value.from,filterTo:i.value.to}));if(e.selection){let i=!1,{head:n}=e.selection.main;t.between(n,n,((t,e)=>{t<n&&e>n&&(i=!0);})),i&&(t=t.update({filterFrom:n,filterTo:n,filter:(t,e)=>e<=n||t>=n}));}return t},provide:t=>Yr.decorations.from(t),toJSON(t,e){let i=[];return t.between(0,e.doc.length,((t,e)=>{i.push(t,e);})),i},fromJSON(t){if(!Array.isArray(t)||t.length%2)throw new RangeError("Invalid JSON for fold state");let e=[];for(let i=0;i<t.length;){let n=t[i++],s=t[i++];if("number"!=typeof n||"number"!=typeof s)throw new RangeError("Invalid JSON for fold state");e.push(Ml.range(n,s));}return Ii.set(e,!0)}});function Zl(t,e,i){var n;let s=null;return null===(n=t.field($l,!1))||void 0===n||n.between(e,i,((t,e)=>{(!s||s.from>t)&&(s={from:t,to:e});})),s}function Xl(t,e,i){let n=!1;return t.between(e,e,((t,s)=>{t==e&&s==i&&(n=!0);})),n}const Cl={placeholderDOM:null,preparePlaceholder:null,placeholderText:"…"},ql=Xt.define({combine:t=>we(t,Cl)});function Wl(t,e){let{state:i}=t,n=i.facet(ql),s=e=>{let i=t.lineBlockAt(t.posAtDOM(e.target)),n=Zl(t.state,i.from,i.to);n&&t.dispatch({effects:Pl.of(n)}),e.preventDefault();};if(n.placeholderDOM)return n.placeholderDOM(t,s,e);let r=document.createElement("span");return r.textContent=n.placeholderText,r.setAttribute("aria-label",i.phrase("folded code")),r.title=i.phrase("unfold"),r.className="cm-foldPlaceholder",r.onclick=s,r}const Ml=Ii.replace({widget:new class extends Gi{toDOM(t){return Wl(t,null)}}});class jl extends Gi{constructor(t){super(),this.value=t;}eq(t){return this.value==t.value}toDOM(t){return Wl(t,this.value)}}Yr.baseTheme({".cm-foldPlaceholder":{backgroundColor:"#eee",border:"1px solid #ddd",color:"#888",borderRadius:".2em",margin:"0 1px",padding:"0 1px",cursor:"pointer"},".cm-foldGutter span":{padding:"0 1px",cursor:"pointer"}});const Ul=Xt.define(),Nl=Xt.define({combine:t=>t.length?[t[0]]:null});function Gl(t){let e=t.facet(Ul);return e.length?e:t.facet(Nl)}class Il{constructor(t){this.markCache=Object.create(null),this.tree=Ea(t.state),this.decorations=this.buildDeco(t,Gl(t.state));}update(t){let e=Ea(t.state),i=Gl(t.state),n=i!=Gl(t.startState);e.length<t.view.viewport.to&&!n&&e.type==this.tree.type?this.decorations=this.decorations.map(t.changes):(e!=this.tree||t.viewportChanged||n)&&(this.tree=e,this.decorations=this.buildDeco(t.view,i));}buildDeco(t,e){if(!e||!this.tree.length)return Ii.none;let i=new ve;for(let{from:n,to:s}of t.visibleRanges)pa(this.tree,e,((t,e,n)=>{i.add(t,e,this.markCache[n]||(this.markCache[n]=Ii.mark({class:n})));}),n,s);return i.finish()}}Vt.high(jn.fromClass(Il,{decorations:t=>t.decorations}));Yr.baseTheme({"&.cm-focused .cm-matchingBracket":{backgroundColor:"#328c8252"},"&.cm-focused .cm-nonmatchingBracket":{backgroundColor:"#bb555544"}});const Hl=1e4,Jl="()[]{}",Kl=Xt.define({combine:t=>we(t,{afterCursor:!0,brackets:Jl,maxScanDistance:Hl,renderMatch:ih})}),th=Ii.mark({class:"cm-matchingBracket"}),eh=Ii.mark({class:"cm-nonmatchingBracket"});function ih(t){let e=[],i=t.matched?th:eh;return e.push(i.range(t.start.from,t.start.to)),t.end&&e.push(i.range(t.end.from,t.end.to)),e}Wt.define({create:()=>Ii.none,update(t,e){if(!e.docChanged&&!e.selection)return t;let i=[],n=e.state.facet(Kl);for(let t of e.state.selection.ranges){if(!t.empty)continue;let s=hh(e.state,t.head,-1,n)||t.head>0&&hh(e.state,t.head-1,1,n)||n.afterCursor&&(hh(e.state,t.head,1,n)||t.head<e.state.doc.length&&hh(e.state,t.head+1,-1,n));s&&(i=i.concat(n.renderMatch(s,e.state)));}return Ii.set(i,!0)},provide:t=>Yr.decorations.from(t)});const oh=new n;function ah(t,e,i){let s=t.prop(e<0?n.openedBy:n.closedBy);if(s)return s;if(1==t.name.length){let n=i.indexOf(t.name);if(n>-1&&n%2==(e<0?1:0))return [i[n+e]]}return null}function lh(t){let e=t.type.prop(oh);return e?e(t.node):t}function hh(t,e,i,n={}){let s=n.maxScanDistance||Hl,r=n.brackets||Jl,o=Ea(t),a=o.resolveInner(e,i);for(let n=a;n;n=n.parent){let s=ah(n.type,i,r);if(s&&n.from<n.to){let o=lh(n);if(o&&(i>0?e>=o.from&&e<o.to:e>o.from&&e<=o.to))return ch(t,e,i,n,o,s,r)}}return function(t,e,i,n,s,r,o){let a=i<0?t.sliceDoc(e-1,e):t.sliceDoc(e,e+1),l=o.indexOf(a);if(l<0||l%2==0!=i>0)return null;let h={from:i<0?e-1:e,to:i>0?e+1:e},c=t.doc.iterRange(e,i>0?t.doc.length:0),O=0;for(let t=0;!c.next().done&&t<=r;){let r=c.value;i<0&&(t+=r.length);let a=e+t*i;for(let t=i>0?0:r.length-1,e=i>0?r.length:-1;t!=e;t+=i){let e=o.indexOf(r[t]);if(!(e<0||n.resolveInner(a+t,1).type!=s))if(e%2==0==i>0)O++;else {if(1==O)return {start:h,end:{from:a+t,to:a+t+1},matched:e>>1==l>>1};O--;}}i>0&&(t+=r.length);}return c.done?{start:h,matched:!1}:null}(t,e,i,o,a.type,s,r)}function ch(t,e,i,n,s,r,o){let a=n.parent,l={from:s.from,to:s.to},h=0,c=null==a?void 0:a.cursor();if(c&&(i<0?c.childBefore(n.from):c.childAfter(n.to)))do{if(i<0?c.to<=n.from:c.from>=n.to){if(0==h&&r.indexOf(c.type.name)>-1&&c.from<c.to){let t=lh(c);return {start:l,end:t?{from:t.from,to:t.to}:void 0,matched:!0}}if(ah(c.type,i,o))h++;else if(ah(c.type,-i,o)){if(0==h){let t=lh(c);return {start:l,end:t&&t.from<t.to?{from:t.from,to:t.to}:void 0,matched:!1}}h--;}}}while(i<0?c.prevSibling():c.nextSibling());return {start:l,matched:!1}}const Sh=Object.create(null),Qh=[o.none];new a(Qh);const vh=Object.create(null),Ph=Object.create(null);for(let[t,e]of [["variable","variableName"],["variable-2","variableName.special"],["string-2","string.special"],["def","variableName.definition"],["tag","tagName"],["attribute","attributeName"],["type","typeName"],["builtin","variableName.standard"],["qualifier","modifier"],["error","invalid"],["header","heading"],["property","propertyName"]])Ph[t]=Xh(Sh,e);class kh{constructor(t){this.extra=t,this.table=Object.assign(Object.create(null),Ph);}resolve(t){return t?this.table[t]||(this.table[t]=Xh(this.extra,t)):0}}new kh(Sh);function Zh(t,e){}function Xh(t,e){let i=[];for(let n of e.split(" ")){let e=[];for(let i of n.split(".")){let n=t[i]||Aa[i];n?"function"==typeof n?e.length?e=e.map(n):Zh():e.length?Zh():e=Array.isArray(n)?n:[n]:Zh();}for(let t of e)i.push(t);}if(!i.length)return 0;let n=e.replace(/ /g,"_"),s=n+" "+i.map((t=>t.id)),r=vh[s];if(r)return r.id;let a=vh[s]=o.define({id:Qh.length,name:n,props:[Oa({[n]:i})]});return Qh.push(a),a.id}function Th(t){return t.length<=4096&&/[\u0590-\u05f4\u0600-\u06ff\u0700-\u08ac\ufb50-\ufdff]/.test(t)}function Rh(t){for(let e=t.iter();!e.next().done;)if(Th(e.value))return !0;return !1}const Ah=Xt.define({combine:t=>t.some((t=>t))});jn.fromClass(class{constructor(t){this.always=t.state.facet(Ah)||t.textDirection!=sn.LTR||t.state.facet(Yr.perLineTextDirection),this.hasRTL=!this.always&&Rh(t.state.doc),this.tree=Ea(t.state),this.decorations=Yh(t,this.tree,this.always);}update(t){let e=t.state.facet(Ah)||t.view.textDirection!=sn.LTR||t.state.facet(Yr.perLineTextDirection);if(e||this.hasRTL||!function(t){let e=!1;return t.iterChanges(((t,i,n,s,r)=>{!e&&Rh(r)&&(e=!0);})),e}(t.changes)||(this.hasRTL=!0),!e&&!this.hasRTL)return;let i=Ea(t.state);(e!=this.always||i!=this.tree||t.docChanged||t.viewportChanged)&&(this.tree=i,this.always=e,this.decorations=Yh(t.view,i,e));}},{provide:t=>{function e(e){var i,n;return null!==(n=null===(i=e.plugin(t))||void 0===i?void 0:i.decorations)&&void 0!==n?n:Ii.none}return [Yr.outerDecorations.of(e),Vt.lowest(Yr.bidiIsolatedRanges.of(e))]}});function Yh(t,e,i){let s=new ve,r=t.visibleRanges;i||(r=function(t,e){let i=e.iter(),n=0,s=[],r=null;for(let{from:e,to:o}of t)for(e!=n&&(n<e&&i.next(e-n),n=e);;){let t=n,e=n+i.value.length;if(!i.lineBreak&&Th(i.value)&&(r&&r.to>t-10?r.to=Math.min(o,e):s.push(r={from:t,to:Math.min(o,e)})),n>=o)break;n=e,i.next();}return s}(r,t.state.doc));for(let{from:t,to:i}of r)e.iterate({enter:t=>{let e=t.type.prop(n.isolate);e&&s.add(t.from,t.to,Wh[e]);},from:t,to:i});return s.finish()}const Wh={rtl:Ii.mark({class:"cm-iso",inclusive:!0,attributes:{dir:"rtl"},bidiIsolate:sn.RTL}),ltr:Ii.mark({class:"cm-iso",inclusive:!0,attributes:{dir:"ltr"},bidiIsolate:sn.LTR}),auto:Ii.mark({class:"cm-iso",inclusive:!0,attributes:{dir:"auto"},bidiIsolate:null})};class Mh{constructor(t,e,i,n,s,r,o,a,l,h=0,c){this.p=t,this.stack=e,this.state=i,this.reducePos=n,this.pos=s,this.score=r,this.buffer=o,this.bufferBase=a,this.curContext=l,this.lookAhead=h,this.parent=c;}toString(){return `[${this.stack.filter(((t,e)=>e%3==0)).concat(this.state)}]@${this.pos}${this.score?"!"+this.score:""}`}static start(t,e,i=0){let n=t.parser.context;return new Mh(t,[],e,i,i,0,[],0,n?new jh(n,n.start):null,0,null)}get context(){return this.curContext?this.curContext.context:null}pushState(t,e){this.stack.push(this.state,e,this.bufferBase+this.buffer.length),this.state=t;}reduce(t){var e;let i=t>>19,n=65535&t,{parser:s}=this.p,r=s.dynamicPrecedence(n);if(r&&(this.score+=r),0==i)return this.pushState(s.getGoto(this.state,n,!0),this.reducePos),n<s.minRepeatTerm&&this.storeNode(n,this.reducePos,this.reducePos,4,!0),void this.reduceContext(n,this.reducePos);let o=this.stack.length-3*(i-1)-(262144&t?6:0),a=o?this.stack[o-2]:this.p.ranges[0].from,l=this.reducePos-a;l>=2e3&&!(null===(e=this.p.parser.nodeSet.types[n])||void 0===e?void 0:e.isAnonymous)&&(a==this.p.lastBigReductionStart?(this.p.bigReductionCount++,this.p.lastBigReductionSize=l):this.p.lastBigReductionSize<l&&(this.p.bigReductionCount=1,this.p.lastBigReductionStart=a,this.p.lastBigReductionSize=l));let h=o?this.stack[o-1]:0,c=this.bufferBase+this.buffer.length-h;if(n<s.minRepeatTerm||131072&t){let t=s.stateFlag(this.state,1)?this.pos:this.reducePos;this.storeNode(n,a,t,c+4,!0);}if(262144&t)this.state=this.stack[o];else {let t=this.stack[o-3];this.state=s.getGoto(t,n,!0);}for(;this.stack.length>o;)this.stack.pop();this.reduceContext(n,a);}storeNode(t,e,i,n=4,s=!1){if(0==t&&(!this.stack.length||this.stack[this.stack.length-1]<this.buffer.length+this.bufferBase)){let t=this,n=this.buffer.length;if(0==n&&t.parent&&(n=t.bufferBase-t.parent.bufferBase,t=t.parent),n>0&&0==t.buffer[n-4]&&t.buffer[n-1]>-1){if(e==i)return;if(t.buffer[n-2]>=e)return void(t.buffer[n-2]=i)}}if(s&&this.pos!=i){let s=this.buffer.length;if(s>0&&0!=this.buffer[s-4])for(;s>0&&this.buffer[s-2]>i;)this.buffer[s]=this.buffer[s-4],this.buffer[s+1]=this.buffer[s-3],this.buffer[s+2]=this.buffer[s-2],this.buffer[s+3]=this.buffer[s-1],s-=4,n>4&&(n-=4);this.buffer[s]=t,this.buffer[s+1]=e,this.buffer[s+2]=i,this.buffer[s+3]=n;}else this.buffer.push(t,e,i,n);}shift(t,e,i,n){if(131072&t)this.pushState(65535&t,this.pos);else if(262144&t)this.pos=n,this.shiftContext(e,i),e<=this.p.parser.maxNode&&this.buffer.push(e,i,n,4);else {let s=t,{parser:r}=this.p;(n>this.pos||e<=r.maxNode)&&(this.pos=n,r.stateFlag(s,1)||(this.reducePos=n)),this.pushState(s,i),this.shiftContext(e,i),e<=r.maxNode&&this.buffer.push(e,i,n,4);}}apply(t,e,i,n){65536&t?this.reduce(t):this.shift(t,e,i,n);}useNode(t,e){let i=this.p.reused.length-1;(i<0||this.p.reused[i]!=t)&&(this.p.reused.push(t),i++);let n=this.pos;this.reducePos=this.pos=n+t.length,this.pushState(e,n),this.buffer.push(i,n,this.reducePos,-1),this.curContext&&this.updateContext(this.curContext.tracker.reuse(this.curContext.context,t,this,this.p.stream.reset(this.pos-t.length)));}split(){let t=this,e=t.buffer.length;for(;e>0&&t.buffer[e-2]>t.reducePos;)e-=4;let i=t.buffer.slice(e),n=t.bufferBase+e;for(;t&&n==t.bufferBase;)t=t.parent;return new Mh(this.p,this.stack.slice(),this.state,this.reducePos,this.pos,this.score,i,n,this.curContext,this.lookAhead,t)}recoverByDelete(t,e){let i=t<=this.p.parser.maxNode;i&&this.storeNode(t,this.pos,e,4),this.storeNode(0,this.pos,e,i?8:4),this.pos=this.reducePos=e,this.score-=190;}canShift(t){for(let e=new _h(this);;){let i=this.p.parser.stateSlot(e.state,4)||this.p.parser.hasAction(e.state,t);if(0==i)return !1;if(!(65536&i))return !0;e.reduce(i);}}recoverByInsert(t){if(this.stack.length>=300)return [];let e=this.p.parser.nextStates(this.state);if(e.length>8||this.stack.length>=120){let i=[];for(let n,s=0;s<e.length;s+=2)(n=e[s+1])!=this.state&&this.p.parser.hasAction(n,t)&&i.push(e[s],n);if(this.stack.length<120)for(let t=0;i.length<8&&t<e.length;t+=2){let n=e[t+1];i.some(((t,e)=>1&e&&t==n))||i.push(e[t],n);}e=i;}let i=[];for(let t=0;t<e.length&&i.length<4;t+=2){let n=e[t+1];if(n==this.state)continue;let s=this.split();s.pushState(n,this.pos),s.storeNode(0,s.pos,s.pos,4,!0),s.shiftContext(e[t],this.pos),s.reducePos=this.pos,s.score-=200,i.push(s);}return i}forceReduce(){let{parser:t}=this.p,e=t.stateSlot(this.state,5);if(!(65536&e))return !1;if(!t.validAction(this.state,e)){let i=e>>19,n=65535&e,s=this.stack.length-3*i;if(s<0||t.getGoto(this.stack[s],n,!1)<0){let t=this.findForcedReduction();if(null==t)return !1;e=t;}this.storeNode(0,this.pos,this.pos,4,!0),this.score-=100;}return this.reducePos=this.pos,this.reduce(e),!0}findForcedReduction(){let{parser:t}=this.p,e=[],i=(n,s)=>{if(!e.includes(n))return e.push(n),t.allActions(n,(e=>{if(393216&e);else if(65536&e){let i=(e>>19)-s;if(i>1){let n=65535&e,s=this.stack.length-3*i;if(s>=0&&t.getGoto(this.stack[s],n,!1)>=0)return i<<19|65536|n}}else {let t=i(e,s+1);if(null!=t)return t}}))};return i(this.state,0)}forceAll(){for(;!this.p.parser.stateFlag(this.state,2);)if(!this.forceReduce()){this.storeNode(0,this.pos,this.pos,4,!0);break}return this}get deadEnd(){if(3!=this.stack.length)return !1;let{parser:t}=this.p;return 65535==t.data[t.stateSlot(this.state,1)]&&!t.stateSlot(this.state,4)}restart(){this.storeNode(0,this.pos,this.pos,4,!0),this.state=this.stack[0],this.stack.length=0;}sameState(t){if(this.state!=t.state||this.stack.length!=t.stack.length)return !1;for(let e=0;e<this.stack.length;e+=3)if(this.stack[e]!=t.stack[e])return !1;return !0}get parser(){return this.p.parser}dialectEnabled(t){return this.p.parser.dialect.flags[t]}shiftContext(t,e){this.curContext&&this.updateContext(this.curContext.tracker.shift(this.curContext.context,t,this,this.p.stream.reset(e)));}reduceContext(t,e){this.curContext&&this.updateContext(this.curContext.tracker.reduce(this.curContext.context,t,this,this.p.stream.reset(e)));}emitContext(){let t=this.buffer.length-1;(t<0||-3!=this.buffer[t])&&this.buffer.push(this.curContext.hash,this.pos,this.pos,-3);}emitLookAhead(){let t=this.buffer.length-1;(t<0||-4!=this.buffer[t])&&this.buffer.push(this.lookAhead,this.pos,this.pos,-4);}updateContext(t){if(t!=this.curContext.context){let e=new jh(this.curContext.tracker,t);e.hash!=this.curContext.hash&&this.emitContext(),this.curContext=e;}}setLookAhead(t){t>this.lookAhead&&(this.emitLookAhead(),this.lookAhead=t);}close(){this.curContext&&this.curContext.tracker.strict&&this.emitContext(),this.lookAhead>0&&this.emitLookAhead();}}class jh{constructor(t,e){this.tracker=t,this.context=e,this.hash=t.strict?t.hash(e):0;}}class _h{constructor(t){this.start=t,this.state=t.state,this.stack=t.stack,this.base=this.stack.length;}reduce(t){let e=65535&t,i=t>>19;0==i?(this.stack==this.start.stack&&(this.stack=this.stack.slice()),this.stack.push(this.state,0,0),this.base+=3):this.base-=3*(i-1);let n=this.start.p.parser.getGoto(this.stack[this.base-3],e,!0);this.state=n;}}class Eh{constructor(t,e,i){this.stack=t,this.pos=e,this.index=i,this.buffer=t.buffer,0==this.index&&this.maybeNext();}static create(t,e=t.bufferBase+t.buffer.length){return new Eh(t,e,e-t.bufferBase)}maybeNext(){let t=this.stack.parent;null!=t&&(this.index=this.stack.bufferBase-t.bufferBase,this.stack=t,this.buffer=t.buffer);}get id(){return this.buffer[this.index-4]}get start(){return this.buffer[this.index-3]}get end(){return this.buffer[this.index-2]}get size(){return this.buffer[this.index-1]}next(){this.index-=4,this.pos-=4,0==this.index&&this.maybeNext();}fork(){return new Eh(this.stack,this.pos,this.index)}}function zh(t,e=Uint16Array){if("string"!=typeof t)return t;let i=null;for(let n=0,s=0;n<t.length;){let r=0;for(;;){let e=t.charCodeAt(n++),i=!1;if(126==e){r=65535;break}e>=92&&e--,e>=34&&e--;let s=e-32;if(s>=46&&(s-=46,i=!0),r+=s,i)break;r*=46;}i?i[s++]=r:i=new e(r);}return i}class Vh{constructor(){this.start=-1,this.value=-1,this.end=-1,this.extended=-1,this.lookAhead=0,this.mask=0,this.context=0;}}const Dh=new Vh;class Uh{constructor(t,e){this.input=t,this.ranges=e,this.chunk="",this.chunkOff=0,this.chunk2="",this.chunk2Pos=0,this.next=-1,this.token=Dh,this.rangeIndex=0,this.pos=this.chunkPos=e[0].from,this.range=e[0],this.end=e[e.length-1].to,this.readNext();}resolveOffset(t,e){let i=this.range,n=this.rangeIndex,s=this.pos+t;for(;s<i.from;){if(!n)return null;let t=this.ranges[--n];s-=i.from-t.to,i=t;}for(;e<0?s>i.to:s>=i.to;){if(n==this.ranges.length-1)return null;let t=this.ranges[++n];s+=t.from-i.to,i=t;}return s}clipPos(t){if(t>=this.range.from&&t<this.range.to)return t;for(let e of this.ranges)if(e.to>t)return Math.max(t,e.from);return this.end}peek(t){let e,i,n=this.chunkOff+t;if(n>=0&&n<this.chunk.length)e=this.pos+t,i=this.chunk.charCodeAt(n);else {let n=this.resolveOffset(t,1);if(null==n)return -1;if(e=n,e>=this.chunk2Pos&&e<this.chunk2Pos+this.chunk2.length)i=this.chunk2.charCodeAt(e-this.chunk2Pos);else {let t=this.rangeIndex,n=this.range;for(;n.to<=e;)n=this.ranges[++t];this.chunk2=this.input.chunk(this.chunk2Pos=e),e+this.chunk2.length>n.to&&(this.chunk2=this.chunk2.slice(0,n.to-e)),i=this.chunk2.charCodeAt(0);}}return e>=this.token.lookAhead&&(this.token.lookAhead=e+1),i}acceptToken(t,e=0){let i=e?this.resolveOffset(e,-1):this.pos;if(null==i||i<this.token.start)throw new RangeError("Token end out of bounds");this.token.value=t,this.token.end=i;}getChunk(){if(this.pos>=this.chunk2Pos&&this.pos<this.chunk2Pos+this.chunk2.length){let{chunk:t,chunkPos:e}=this;this.chunk=this.chunk2,this.chunkPos=this.chunk2Pos,this.chunk2=t,this.chunk2Pos=e,this.chunkOff=this.pos-this.chunkPos;}else {this.chunk2=this.chunk,this.chunk2Pos=this.chunkPos;let t=this.input.chunk(this.pos),e=this.pos+t.length;this.chunk=e>this.range.to?t.slice(0,this.range.to-this.pos):t,this.chunkPos=this.pos,this.chunkOff=0;}}readNext(){return this.chunkOff>=this.chunk.length&&(this.getChunk(),this.chunkOff==this.chunk.length)?this.next=-1:this.next=this.chunk.charCodeAt(this.chunkOff)}advance(t=1){for(this.chunkOff+=t;this.pos+t>=this.range.to;){if(this.rangeIndex==this.ranges.length-1)return this.setDone();t-=this.range.to-this.pos,this.range=this.ranges[++this.rangeIndex],this.pos=this.range.from;}return this.pos+=t,this.pos>=this.token.lookAhead&&(this.token.lookAhead=this.pos+1),this.readNext()}setDone(){return this.pos=this.chunkPos=this.end,this.range=this.ranges[this.rangeIndex=this.ranges.length-1],this.chunk="",this.next=-1}reset(t,e){if(e?(this.token=e,e.start=t,e.lookAhead=t+1,e.value=e.extended=-1):this.token=Dh,this.pos!=t){if(this.pos=t,t==this.end)return this.setDone(),this;for(;t<this.range.from;)this.range=this.ranges[--this.rangeIndex];for(;t>=this.range.to;)this.range=this.ranges[++this.rangeIndex];t>=this.chunkPos&&t<this.chunkPos+this.chunk.length?this.chunkOff=t-this.chunkPos:(this.chunk="",this.chunkOff=0),this.readNext();}return this}read(t,e){if(t>=this.chunkPos&&e<=this.chunkPos+this.chunk.length)return this.chunk.slice(t-this.chunkPos,e-this.chunkPos);if(t>=this.chunk2Pos&&e<=this.chunk2Pos+this.chunk2.length)return this.chunk2.slice(t-this.chunk2Pos,e-this.chunk2Pos);if(t>=this.range.from&&e<=this.range.to)return this.input.read(t,e);let i="";for(let n of this.ranges){if(n.from>=e)break;n.to>t&&(i+=this.input.read(Math.max(n.from,t),Math.min(n.to,e)));}return i}}class Nh{constructor(t,e){this.data=t,this.id=e;}token(t,e){let{parser:i}=e.p;Ih(this.data,t,e,this.id,i.data,i.tokenPrecTable);}}Nh.prototype.contextual=Nh.prototype.fallback=Nh.prototype.extend=!1;class Gh{constructor(t,e,i){this.precTable=e,this.elseToken=i,this.data="string"==typeof t?zh(t):t;}token(t,e){let i=t.pos,n=0;for(;;){let i=t.next<0,s=t.resolveOffset(1,1);if(Ih(this.data,t,e,0,this.data,this.precTable),t.token.value>-1)break;if(null==this.elseToken)return;if(i||n++,null==s)break;t.reset(s,t.token);}n&&(t.reset(i,t.token),t.acceptToken(this.elseToken,n));}}Gh.prototype.contextual=Nh.prototype.fallback=Nh.prototype.extend=!1;class Bh{constructor(t,e={}){this.token=t,this.contextual=!!e.contextual,this.fallback=!!e.fallback,this.extend=!!e.extend;}}function Ih(t,e,i,n,s,r){let o=0,a=1<<n,{dialect:l}=i.p.parser;t:for(;a&t[o];){let i=t[o+1];for(let n=o+3;n<i;n+=2)if((t[n+1]&a)>0){let i=t[n];if(l.allows(i)&&(-1==e.token.value||e.token.value==i||Fh(i,e.token.value,s,r))){e.acceptToken(i);break}}let n=e.next,h=0,c=t[o+2];if(!(e.next<0&&c>h&&65535==t[i+3*c-3]&&65535==t[i+3*c-3])){for(;h<c;){let s=h+c>>1,r=i+s+(s<<1),a=t[r],l=t[r+1]||65536;if(n<a)c=s;else {if(!(n>=l)){o=t[r+2],e.advance();continue t}h=s+1;}}break}o=t[i+3*c-1];}}function Lh(t,e,i){for(let n,s=e;65535!=(n=t[s]);s++)if(n==i)return s-e;return -1}function Fh(t,e,i,n){let s=Lh(i,n,e);return s<0||Lh(i,n,t)<s}const Hh="undefined"!=typeof process&&process.env&&/\bparse\b/.test(process.env.LOG);let Jh=null;function Kh(t,e,i){let n=t.cursor(c.IncludeAnonymous);for(n.moveTo(e);;)if(!(i<0?n.childBefore(e):n.childAfter(e)))for(;;){if((i<0?n.to<e:n.from>e)&&!n.type.isError)return i<0?Math.max(0,Math.min(n.to-1,e-25)):Math.min(t.length,Math.max(n.from+1,e+25));if(i<0?n.prevSibling():n.nextSibling())break;if(!n.parent())return i<0?0:t.length}}class tc{constructor(t,e){this.fragments=t,this.nodeSet=e,this.i=0,this.fragment=null,this.safeFrom=-1,this.safeTo=-1,this.trees=[],this.start=[],this.index=[],this.nextFragment();}nextFragment(){let t=this.fragment=this.i==this.fragments.length?null:this.fragments[this.i++];if(t){for(this.safeFrom=t.openStart?Kh(t.tree,t.from+t.offset,1)-t.offset:t.from,this.safeTo=t.openEnd?Kh(t.tree,t.to+t.offset,-1)-t.offset:t.to;this.trees.length;)this.trees.pop(),this.start.pop(),this.index.pop();this.trees.push(t.tree),this.start.push(-t.offset),this.index.push(0),this.nextStart=this.safeFrom;}else this.nextStart=1e9;}nodeAt(t){if(t<this.nextStart)return null;for(;this.fragment&&this.safeTo<=t;)this.nextFragment();if(!this.fragment)return null;for(;;){let e=this.trees.length-1;if(e<0)return this.nextFragment(),null;let i=this.trees[e],s=this.index[e];if(s==i.children.length){this.trees.pop(),this.start.pop(),this.index.pop();continue}let r=i.children[s],o=this.start[e]+i.positions[s];if(o>t)return this.nextStart=o,null;if(r instanceof O){if(o==t){if(o<this.safeFrom)return null;let t=o+r.length;if(t<=this.safeTo){let e=r.prop(n.lookAhead);if(!e||t+e<this.fragment.to)return r}}this.index[e]++,o+r.length>=Math.max(this.safeFrom,t)&&(this.trees.push(r),this.start.push(o),this.index.push(0));}else this.index[e]++,this.nextStart=o+r.length;}}}class ec{constructor(t,e){this.stream=e,this.tokens=[],this.mainToken=null,this.actions=[],this.tokens=t.tokenizers.map((t=>new Vh));}getActions(t){let e=0,i=null,{parser:n}=t.p,{tokenizers:s}=n,r=n.stateSlot(t.state,3),o=t.curContext?t.curContext.hash:0,a=0;for(let n=0;n<s.length;n++){if(!(1<<n&r))continue;let l=s[n],h=this.tokens[n];if((!i||l.fallback)&&((l.contextual||h.start!=t.pos||h.mask!=r||h.context!=o)&&(this.updateCachedToken(h,l,t),h.mask=r,h.context=o),h.lookAhead>h.end+25&&(a=Math.max(h.lookAhead,a)),0!=h.value)){let n=e;if(h.extended>-1&&(e=this.addActions(t,h.extended,h.end,e)),e=this.addActions(t,h.value,h.end,e),!l.extend&&(i=h,e>n))break}}for(;this.actions.length>e;)this.actions.pop();return a&&t.setLookAhead(a),i||t.pos!=this.stream.end||(i=new Vh,i.value=t.p.parser.eofTerm,i.start=i.end=t.pos,e=this.addActions(t,i.value,i.end,e)),this.mainToken=i,this.actions}getMainToken(t){if(this.mainToken)return this.mainToken;let e=new Vh,{pos:i,p:n}=t;return e.start=i,e.end=Math.min(i+1,n.stream.end),e.value=i==n.stream.end?n.parser.eofTerm:0,e}updateCachedToken(t,e,i){let n=this.stream.clipPos(i.pos);if(e.token(this.stream.reset(n,t),i),t.value>-1){let{parser:e}=i.p;for(let n=0;n<e.specialized.length;n++)if(e.specialized[n]==t.value){let s=e.specializers[n](this.stream.read(t.start,t.end),i);if(s>=0&&i.p.parser.dialect.allows(s>>1)){1&s?t.extended=s>>1:t.value=s>>1;break}}}else t.value=0,t.end=this.stream.clipPos(n+1);}putAction(t,e,i,n){for(let e=0;e<n;e+=3)if(this.actions[e]==t)return n;return this.actions[n++]=t,this.actions[n++]=e,this.actions[n++]=i,n}addActions(t,e,i,n){let{state:s}=t,{parser:r}=t.p,{data:o}=r;for(let t=0;t<2;t++)for(let a=r.stateSlot(s,t?2:1);;a+=3){if(65535==o[a]){if(1!=o[a+1]){0==n&&2==o[a+1]&&(n=this.putAction(lc(o,a+2),e,i,n));break}a=lc(o,a+2);}o[a]==e&&(n=this.putAction(lc(o,a+1),e,i,n));}return n}}class ic{constructor(t,e,i,n){this.parser=t,this.input=e,this.ranges=n,this.recovering=0,this.nextStackID=9812,this.minStackPos=0,this.reused=[],this.stoppedAt=null,this.lastBigReductionStart=-1,this.lastBigReductionSize=0,this.bigReductionCount=0,this.stream=new Uh(e,n),this.tokens=new ec(t,this.stream),this.topTerm=t.top[1];let{from:s}=n[0];this.stacks=[Mh.start(this,t.top[0],s)],this.fragments=i.length&&this.stream.end-s>4*t.bufferLength?new tc(i,t.nodeSet):null;}get parsedPos(){return this.minStackPos}advance(){let t,e,i=this.stacks,n=this.minStackPos,s=this.stacks=[];if(this.bigReductionCount>300&&1==i.length){let[t]=i;for(;t.forceReduce()&&t.stack.length&&t.stack[t.stack.length-2]>=this.lastBigReductionStart;);this.bigReductionCount=this.lastBigReductionSize=0;}for(let r=0;r<i.length;r++){let o=i[r];for(;;){if(this.tokens.mainToken=null,o.pos>n)s.push(o);else {if(this.advanceStack(o,s,i))continue;{t||(t=[],e=[]),t.push(o);let i=this.tokens.getMainToken(o);e.push(i.value,i.end);}}break}}if(!s.length){let e=t&&function(t){let e=null;for(let i of t){let t=i.p.stoppedAt;(i.pos==i.p.stream.end||null!=t&&i.pos>t)&&i.p.parser.stateFlag(i.state,2)&&(!e||e.score<i.score)&&(e=i);}return e}(t);if(e)return this.stackToTree(e);if(this.parser.strict)throw new SyntaxError("No parse at "+n);this.recovering||(this.recovering=5);}if(this.recovering&&t){let i=null!=this.stoppedAt&&t[0].pos>this.stoppedAt?t[0]:this.runRecovery(t,e,s);if(i)return this.stackToTree(i.forceAll())}if(this.recovering){let t=1==this.recovering?1:3*this.recovering;if(s.length>t)for(s.sort(((t,e)=>e.score-t.score));s.length>t;)s.pop();s.some((t=>t.reducePos>n))&&this.recovering--;}else if(s.length>1){t:for(let t=0;t<s.length-1;t++){let e=s[t];for(let i=t+1;i<s.length;i++){let n=s[i];if(e.sameState(n)||e.buffer.length>500&&n.buffer.length>500){if(!((e.score-n.score||e.buffer.length-n.buffer.length)>0)){s.splice(t--,1);continue t}s.splice(i--,1);}}}s.length>12&&s.splice(12,s.length-12);}this.minStackPos=s[0].pos;for(let t=1;t<s.length;t++)s[t].pos<this.minStackPos&&(this.minStackPos=s[t].pos);return null}stopAt(t){if(null!=this.stoppedAt&&this.stoppedAt<t)throw new RangeError("Can't move stoppedAt forward");this.stoppedAt=t;}advanceStack(t,e,i){let s=t.pos,{parser:r}=this;Hh?this.stackID(t)+" -> ":"";if(null!=this.stoppedAt&&s>this.stoppedAt)return t.forceReduce()?t:null;if(this.fragments){let e=t.curContext&&t.curContext.tracker.strict,i=e?t.curContext.hash:0;for(let a=this.fragments.nodeAt(s);a;){let s=this.parser.nodeSet.types[a.type.id]==a.type?r.getGoto(t.state,a.type.id):-1;if(s>-1&&a.length&&(!e||(a.prop(n.contextHash)||0)==i))return t.useNode(a,s),!0;if(!(a instanceof O)||0==a.children.length||a.positions[0]>0)break;let l=a.children[0];if(!(l instanceof O&&0==a.positions[0]))break;a=l;}}let a=r.stateSlot(t.state,4);if(a>0)return t.reduce(a),!0;if(t.stack.length>=9e3)for(;t.stack.length>6e3&&t.forceReduce(););let l=this.tokens.getActions(t);for(let n=0;n<l.length;){let a=l[n++],h=l[n++],c=l[n++],O=n==l.length||!i,u=O?t:t.split(),f=this.tokens.mainToken;if(u.apply(a,h,f?f.start:u.pos,c),O)return !0;u.pos>s?e.push(u):i.push(u);}return !1}advanceFully(t,e){let i=t.pos;for(;;){if(!this.advanceStack(t,null,null))return !1;if(t.pos>i)return nc(t,e),!0}}runRecovery(t,e,i){let n=null,s=!1;for(let r=0;r<t.length;r++){let o=t[r],a=e[r<<1],l=e[1+(r<<1)];Hh?this.stackID(o)+" -> ":"";if(o.deadEnd){if(s)continue;if(s=!0,o.restart(),this.advanceFully(o,i))continue}let c=o.split();for(let t=0;c.forceReduce()&&t<10;t++){if(this.advanceFully(c,i))break;Hh&&(this.stackID(c)+" -> ");}for(let t of o.recoverByInsert(a))this.advanceFully(t,i);this.stream.end>o.pos?(l==o.pos&&(l++,a=0),o.recoverByDelete(a,l),nc(o,i)):(!n||n.score<o.score)&&(n=o);}return n}stackToTree(t){return t.close(),O.build({buffer:Eh.create(t),nodeSet:this.parser.nodeSet,topID:this.topTerm,maxBufferLength:this.parser.bufferLength,reused:this.reused,start:this.ranges[0].from,length:t.pos-this.ranges[0].from,minRepeatType:this.parser.minRepeatTerm})}stackID(t){let e=(Jh||(Jh=new WeakMap)).get(t);return e||Jh.set(t,e=String.fromCodePoint(this.nextStackID++)),e+t}}function nc(t,e){for(let i=0;i<e.length;i++){let n=e[i];if(n.pos==t.pos&&n.sameState(t))return void(e[i].score<t.score&&(e[i]=t))}e.push(t);}class sc{constructor(t,e,i){this.source=t,this.flags=e,this.disabled=i;}allows(t){return !this.disabled||0==this.disabled[t]}}const rc=t=>t;class oc{constructor(t){this.start=t.start,this.shift=t.shift||rc,this.reduce=t.reduce||rc,this.reuse=t.reuse||rc,this.hash=t.hash||(()=>0),this.strict=!1!==t.strict;}}class ac extends R{constructor(e){if(super(),this.wrappers=[],14!=e.version)throw new RangeError(`Parser version (${e.version}) doesn't match runtime version (14)`);let i=e.nodeNames.split(" ");this.minRepeatTerm=i.length;for(let t=0;t<e.repeatNodeCount;t++)i.push("");let s=Object.keys(e.topRules).map((t=>e.topRules[t][1])),r=[];for(let t=0;t<i.length;t++)r.push([]);function l(t,e,i){r[t].push([e,e.deserialize(String(i))]);}if(e.nodeProps)for(let t of e.nodeProps){let e=t[0];"string"==typeof e&&(e=n[e]);for(let i=1;i<t.length;){let n=t[i++];if(n>=0)l(n,e,t[i++]);else {let s=t[i+-n];for(let r=-n;r>0;r--)l(t[i++],e,s);i++;}}}this.nodeSet=new a(i.map(((t,i)=>o.define({name:i>=this.minRepeatTerm?void 0:t,id:i,props:r[i],top:s.indexOf(i)>-1,error:0==i,skipped:e.skippedNodes&&e.skippedNodes.indexOf(i)>-1})))),e.propSources&&(this.nodeSet=this.nodeSet.extend(...e.propSources)),this.strict=!1,this.bufferLength=t;let h=zh(e.tokenData);this.context=e.context,this.specializerSpecs=e.specialized||[],this.specialized=new Uint16Array(this.specializerSpecs.length);for(let t=0;t<this.specializerSpecs.length;t++)this.specialized[t]=this.specializerSpecs[t].term;this.specializers=this.specializerSpecs.map(hc),this.states=zh(e.states,Uint32Array),this.data=zh(e.stateData),this.goto=zh(e.goto),this.maxTerm=e.maxTerm,this.tokenizers=e.tokenizers.map((t=>"number"==typeof t?new Nh(h,t):t)),this.topRules=e.topRules,this.dialects=e.dialects||{},this.dynamicPrecedences=e.dynamicPrecedences||null,this.tokenPrecTable=e.tokenPrec,this.termNames=e.termNames||null,this.maxNode=this.nodeSet.types.length-1,this.dialect=this.parseDialect(),this.top=this.topRules[Object.keys(this.topRules)[0]];}createParse(t,e,i){let n=new ic(this,t,e,i);for(let s of this.wrappers)n=s(n,t,e,i);return n}getGoto(t,e,i=!1){let n=this.goto;if(e>=n[0])return -1;for(let s=n[e+1];;){let e=n[s++],r=1&e,o=n[s++];if(r&&i)return o;for(let i=s+(e>>1);s<i;s++)if(n[s]==t)return o;if(r)return -1}}hasAction(t,e){let i=this.data;for(let n=0;n<2;n++)for(let s,r=this.stateSlot(t,n?2:1);;r+=3){if(65535==(s=i[r])){if(1!=i[r+1]){if(2==i[r+1])return lc(i,r+2);break}s=i[r=lc(i,r+2)];}if(s==e||0==s)return lc(i,r+1)}return 0}stateSlot(t,e){return this.states[6*t+e]}stateFlag(t,e){return (this.stateSlot(t,0)&e)>0}validAction(t,e){return !!this.allActions(t,(t=>t==e||null))}allActions(t,e){let i=this.stateSlot(t,4),n=i?e(i):void 0;for(let i=this.stateSlot(t,1);null==n;i+=3){if(65535==this.data[i]){if(1!=this.data[i+1])break;i=lc(this.data,i+2);}n=e(lc(this.data,i+1));}return n}nextStates(t){let e=[];for(let i=this.stateSlot(t,1);;i+=3){if(65535==this.data[i]){if(1!=this.data[i+1])break;i=lc(this.data,i+2);}if(!(1&this.data[i+2])){let t=this.data[i+1];e.some(((e,i)=>1&i&&e==t))||e.push(this.data[i],t);}}return e}configure(t){let e=Object.assign(Object.create(ac.prototype),this);if(t.props&&(e.nodeSet=this.nodeSet.extend(...t.props)),t.top){let i=this.topRules[t.top];if(!i)throw new RangeError(`Invalid top rule name ${t.top}`);e.top=i;}return t.tokenizers&&(e.tokenizers=this.tokenizers.map((e=>{let i=t.tokenizers.find((t=>t.from==e));return i?i.to:e}))),t.specializers&&(e.specializers=this.specializers.slice(),e.specializerSpecs=this.specializerSpecs.map(((i,n)=>{let s=t.specializers.find((t=>t.from==i.external));if(!s)return i;let r=Object.assign(Object.assign({},i),{external:s.to});return e.specializers[n]=hc(r),r}))),t.contextTracker&&(e.context=t.contextTracker),t.dialect&&(e.dialect=this.parseDialect(t.dialect)),null!=t.strict&&(e.strict=t.strict),t.wrap&&(e.wrappers=e.wrappers.concat(t.wrap)),null!=t.bufferLength&&(e.bufferLength=t.bufferLength),e}hasWrappers(){return this.wrappers.length>0}getName(t){return this.termNames?this.termNames[t]:String(t<=this.maxNode&&this.nodeSet.types[t].name||t)}get eofTerm(){return this.maxNode+1}get topNode(){return this.nodeSet.types[this.top[1]]}dynamicPrecedence(t){let e=this.dynamicPrecedences;return null==e?0:e[t]||0}parseDialect(t){let e=Object.keys(this.dialects),i=e.map((()=>!1));if(t)for(let n of t.split(" ")){let t=e.indexOf(n);t>=0&&(i[t]=!0);}let n=null;for(let t=0;t<e.length;t++)if(!i[t])for(let i,s=this.dialects[e[t]];65535!=(i=this.data[s++]);)(n||(n=new Uint8Array(this.maxTerm+1)))[i]=1;return new sc(t,i,n)}static deserialize(t){return new ac(t)}}function lc(t,e){return t[e]|t[e+1]<<16}function hc(t){if(t.external){let e=t.extend?1:0;return (i,n)=>t.external(i,n)<<1|e}return t.get}const cc=[9,10,11,12,13,32,133,160,5760,8192,8193,8194,8195,8196,8197,8198,8199,8200,8201,8202,8232,8233,8239,8287,12288];function Oc(t){return t>=65&&t<=90||t>=97&&t<=122||t>=161}function uc(t){return t>=48&&t<=57}const fc=new Bh(((t,e)=>{for(let i=!1,n=0,s=0;;s++){let{next:r}=t;if(Oc(r)||45==r||95==r||i&&uc(r))!i&&(45!=r||s>0)&&(i=!0),n===s&&45==r&&n++,t.advance();else {if(92!=r||10==t.peek(1)){i&&t.acceptToken(40==r?100:2==n&&e.canShift(2)?2:101);break}t.advance(),t.next>-1&&t.advance(),i=!0;}}})),dc=new Bh((t=>{if(cc.includes(t.peek(-1))){let{next:e}=t;(Oc(e)||95==e||35==e||46==e||91==e||58==e&&Oc(t.peek(1))||45==e||38==e)&&t.acceptToken(99);}})),pc=new Bh((t=>{if(!cc.includes(t.peek(-1))){let{next:e}=t;if(37==e&&(t.advance(),t.acceptToken(1)),Oc(e)){do{t.advance();}while(Oc(t.next)||uc(t.next));t.acceptToken(1);}}})),gc=Oa({"AtKeyword import charset namespace keyframes media supports":Aa.definitionKeyword,"from to selector":Aa.keyword,NamespaceName:Aa.namespace,KeyframeName:Aa.labelName,KeyframeRangeName:Aa.operatorKeyword,TagName:Aa.tagName,ClassName:Aa.className,PseudoClassName:Aa.constant(Aa.className),IdName:Aa.labelName,"FeatureName PropertyName":Aa.propertyName,AttributeName:Aa.attributeName,NumberLiteral:Aa.number,KeywordQuery:Aa.keyword,UnaryQueryOp:Aa.operatorKeyword,"CallTag ValueName":Aa.atom,VariableName:Aa.variableName,Callee:Aa.operatorKeyword,Unit:Aa.unit,"UniversalSelector NestingSelector":Aa.definitionOperator,MatchOp:Aa.compareOperator,"ChildOp SiblingOp, LogicOp":Aa.logicOperator,BinOp:Aa.arithmeticOperator,Important:Aa.modifier,Comment:Aa.blockComment,ColorLiteral:Aa.color,"ParenthesizedContent StringLiteral":Aa.string,":":Aa.punctuation,"PseudoOp #":Aa.derefOperator,"; ,":Aa.separator,"( )":Aa.paren,"[ ]":Aa.squareBracket,"{ }":Aa.brace}),mc={__proto__:null,lang:32,"nth-child":32,"nth-last-child":32,"nth-of-type":32,"nth-last-of-type":32,dir:32,"host-context":32,url:60,"url-prefix":60,domain:60,regexp:60,selector:138},wc={__proto__:null,"@import":118,"@media":142,"@charset":146,"@namespace":150,"@keyframes":156,"@supports":168},bc={__proto__:null,not:132,only:132},Sc=ac.deserialize({version:14,states:":^QYQ[OOO#_Q[OOP#fOWOOOOQP'#Cd'#CdOOQP'#Cc'#CcO#kQ[O'#CfO$_QXO'#CaO$fQ[O'#ChO$qQ[O'#DTO$vQ[O'#DWOOQP'#Em'#EmO${QdO'#DgO%jQ[O'#DtO${QdO'#DvO%{Q[O'#DxO&WQ[O'#D{O&`Q[O'#ERO&nQ[O'#ETOOQS'#El'#ElOOQS'#EW'#EWQYQ[OOO&uQXO'#CdO'jQWO'#DcO'oQWO'#EsO'zQ[O'#EsQOQWOOP(UO#tO'#C_POOO)C@[)C@[OOQP'#Cg'#CgOOQP,59Q,59QO#kQ[O,59QO(aQ[O'#E[O({QWO,58{O)TQ[O,59SO$qQ[O,59oO$vQ[O,59rO(aQ[O,59uO(aQ[O,59wO(aQ[O,59xO)`Q[O'#DbOOQS,58{,58{OOQP'#Ck'#CkOOQO'#DR'#DROOQP,59S,59SO)gQWO,59SO)lQWO,59SOOQP'#DV'#DVOOQP,59o,59oOOQO'#DX'#DXO)qQ`O,59rOOQS'#Cp'#CpO${QdO'#CqO)yQvO'#CsO+ZQtO,5:ROOQO'#Cx'#CxO)lQWO'#CwO+oQWO'#CyO+tQ[O'#DOOOQS'#Ep'#EpOOQO'#Dj'#DjO+|Q[O'#DqO,[QWO'#EtO&`Q[O'#DoO,jQWO'#DrOOQO'#Eu'#EuO)OQWO,5:`O,oQpO,5:bOOQS'#Dz'#DzO,wQWO,5:dO,|Q[O,5:dOOQO'#D}'#D}O-UQWO,5:gO-ZQWO,5:mO-cQWO,5:oOOQS-E8U-E8UO${QdO,59}O-kQ[O'#E^O-xQWO,5;_O-xQWO,5;_POOO'#EV'#EVP.TO#tO,58yPOOO,58y,58yOOQP1G.l1G.lO.zQXO,5:vOOQO-E8Y-E8YOOQS1G.g1G.gOOQP1G.n1G.nO)gQWO1G.nO)lQWO1G.nOOQP1G/Z1G/ZO/XQ`O1G/^O/rQXO1G/aO0YQXO1G/cO0pQXO1G/dO1WQWO,59|O1]Q[O'#DSO1dQdO'#CoOOQP1G/^1G/^O${QdO1G/^O1kQpO,59]OOQS,59_,59_O${QdO,59aO1sQWO1G/mOOQS,59c,59cO1xQ!bO,59eOOQS'#DP'#DPOOQS'#EY'#EYO2QQ[O,59jOOQS,59j,59jO2YQWO'#DjO2eQWO,5:VO2jQWO,5:]O&`Q[O,5:XO&`Q[O'#E_O2rQWO,5;`O2}QWO,5:ZO(aQ[O,5:^OOQS1G/z1G/zOOQS1G/|1G/|OOQS1G0O1G0OO3`QWO1G0OO3eQdO'#EOOOQS1G0R1G0ROOQS1G0X1G0XOOQS1G0Z1G0ZO3pQtO1G/iOOQO,5:x,5:xO4WQ[O,5:xOOQO-E8[-E8[O4eQWO1G0yPOOO-E8T-E8TPOOO1G.e1G.eOOQP7+$Y7+$YOOQP7+$x7+$xO${QdO7+$xOOQS1G/h1G/hO4pQXO'#ErO4wQWO,59nO4|QtO'#EXO5tQdO'#EoO6OQWO,59ZO6TQpO7+$xOOQS1G.w1G.wOOQS1G.{1G.{OOQS7+%X7+%XO6]QWO1G/POOQS-E8W-E8WOOQS1G/U1G/UO${QdO1G/qOOQO1G/w1G/wOOQO1G/s1G/sO6bQWO,5:yOOQO-E8]-E8]O6pQXO1G/xOOQS7+%j7+%jO6wQYO'#CsOOQO'#EQ'#EQO7SQ`O'#EPOOQO'#EP'#EPO7_QWO'#E`O7gQdO,5:jOOQS,5:j,5:jO7rQtO'#E]O${QdO'#E]O8sQdO7+%TOOQO7+%T7+%TOOQO1G0d1G0dO9WQpO<<HdO9`QWO,5;^OOQP1G/Y1G/YOOQS-E8V-E8VO${QdO'#EZO9hQWO,5;ZOOQT1G.u1G.uOOQP<<Hd<<HdOOQS7+$k7+$kO9pQdO7+%]OOQO7+%d7+%dOOQO,5:k,5:kO3hQdO'#EaO7_QWO,5:zOOQS,5:z,5:zOOQS-E8^-E8^OOQS1G0U1G0UO9wQtO,5:wOOQS-E8Z-E8ZOOQO<<Ho<<HoOOQPAN>OAN>OO:xQdO,5:uOOQO-E8X-E8XOOQO<<Hw<<HwOOQO,5:{,5:{OOQO-E8_-E8_OOQS1G0f1G0f",stateData:";[~O#ZOS#[QQ~OUYOXYO]VO^VOqXOxWO![aO!]ZO!i[O!k]O!m^O!p_O!v`O#XRO#bTO~OQfOUYOXYO]VO^VOqXOxWO![aO!]ZO!i[O!k]O!m^O!p_O!v`O#XeO#bTO~O#U#gP~P!ZO#[jO~O#XlO~O]qO^qOqsOtoOxrO!OtO!RvO#VuO#bnO~O!TwO~P#pO`}O#WzO#XyO~O#X!OO~O#X!QO~OQ![Ob!TOf![Oh![On!YOq!ZO#W!WO#X!SO#e!UO~Ob!^O!d!`O!g!aO#X!]O!T#hP~Oh!fOn!YO#X!eO~Oh!hO#X!hO~Ob!^O!d!`O!g!aO#X!]O~O!Y#hP~P%jO]WX]!WX^WXqWXtWXxWX!OWX!RWX!TWX#VWX#bWX~O]!mO~O!Y!nO#U#gX!S#gX~O#U#gX!S#gX~P!ZO#]!qO#^!qO#_!sO~OUYOXYO]VO^VOqXOxWO#XRO#bTO~OtoO!TwO~O`!zO#WzO#XyO~O!S#gP~P!ZOb#RO~Ob#SO~Op#TO|#UO~OP#WObgXjgX!YgX!dgX!ggX#XgXagXQgXfgXhgXngXqgXtgX!XgX#UgX#WgX#egXpgX!SgX~Ob!^Oj#XO!d!`O!g!aO#X!]O!Y#hP~Ob#[O~Op#`O#X#]O~Ob!^O!d!`O!g!aO#X#aO~Ot#eO!b#dO!T#hX!Y#hX~Ob#hO~Oj#XO!Y#jO~O!Y#kO~Oh#lOn!YO~O!T#mO~O!TwO!b#dO~O!TwO!Y#pO~O!Y#QX#U#QX!S#QX~P!ZO!Y!nO#U#ga!S#ga~O#]!qO#^!qO#_#wO~O]qO^qOqsOxrO!OtO!RvO#VuO#bnO~Ot#Oa!T#Oaa#Oa~P.`Op#yO|#zO~O]qO^qOqsOxrO#bnO~Ot}i!O}i!R}i!T}i#V}ia}i~P/aOt!Pi!O!Pi!R!Pi!T!Pi#V!Pia!Pi~P/aOt!Qi!O!Qi!R!Qi!T!Qi#V!Qia!Qi~P/aO!S#{O~Oa#fP~P(aOa#cP~P${Oa$SOj#XO~O!Y$UO~Oh$VOo$VO~Op$XO#X#]O~O]!`Xa!^X!b!^X~O]$YO~Oa$ZO!b#dO~Ot#eO!T#ha!Y#ha~O!b#dOt!ca!T!ca!Y!caa!ca~O!Y$`O~O!S$gO#X$bO#e$aO~Oj#XOt$iO!X$kO!Y!Vi#U!Vi!S!Vi~P${O!Y#Qa#U#Qa!S#Qa~P!ZO!Y!nO#U#gi!S#gi~Oa#fX~P#pOa$oO~Oj#XOQ!{Xa!{Xb!{Xf!{Xh!{Xn!{Xq!{Xt!{X#W!{X#X!{X#e!{X~Ot$qOa#cX~P${Oa$sO~Oj#XOp$tO~Oa$uO~O!b#dOt#Ra!T#Ra!Y#Ra~Oa$wO~P.`OP#WOtgX!TgX~O#e$aOt!sX!T!sX~Ot$yO!TwO~O!S$}O#X$bO#e$aO~Oj#XOQ#PXb#PXf#PXh#PXn#PXq#PXt#PX!X#PX!Y#PX#U#PX#W#PX#X#PX#e#PX!S#PX~Ot$iO!X%QO!Y!Vq#U!Vq!S!Vq~P${Oj#XOp%RO~OtoOa#fa~Ot$qOa#ca~Oa%UO~P${Oj#XOQ#Pab#Paf#Pah#Pan#Paq#Pat#Pa!X#Pa!Y#Pa#U#Pa#W#Pa#X#Pa#e#Pa!S#Pa~Oa!}at!}a~P${O#Zo#[#ej!R#e~",goto:"-g#jPPP#kP#nP#w$WP#w$g#wPP$mPPP$s$|$|P%`P$|P$|%z&^PPPP$|&vP&z'Q#wP'W#w'^P#wP#w#wPPP'd'y(WPP#nPP(_(_(i(_P(_P(_(_P#nP#nP#nP(l#nP(o(r(u(|#nP#nP)R)X)h)v)|*S*^*d*n*t*zPPPPPPPPPP+Q+ZP+v+yP,o,r,x-RRkQ_bOPdhw!n#skYOPdhotuvw!n#R#h#skSOPdhotuvw!n#R#h#sQmTR!tnQ{VR!xqQ!x}Q#Z!XR#x!zq![Z]!T!m#S#U#X#q#z$P$Y$i$j$q$v%Sp![Z]!T!m#S#U#X#q#z$P$Y$i$j$q$v%SU$d#m$f$yR$x$cq!XZ]!T!m#S#U#X#q#z$P$Y$i$j$q$v%Sp![Z]!T!m#S#U#X#q#z$P$Y$i$j$q$v%SQ!f^R#l!gT#^!Z#_Q|VR!yqQ!x|R#x!yQ!PWR!{rQ!RXR!|sQxUQ!wpQ#i!cQ#o!jQ#p!kQ${$eR%X$zSgPwQ!phQ#r!nR$l#sZfPhw!n#sa!b[`a!V!^!`#d#eR#b!^R!g^R!i_R#n!iS$e#m$fR%V$yV$c#m$f$yQ!rjR#v!rQdOShPwU!ldh#sR#s!nQ$P#SU$p$P$v%SQ$v$YR%S$qQ#_!ZR$W#_Q$r$PR%T$rQpUS!vp$nR$n#|Q$j#qR%P$jQ!ogS#t!o#uR#u!pQ#f!_R$^#fQ$f#mR$|$fQ$z$eR%W$z_cOPdhw!n#s^UOPdhw!n#sQ!uoQ!}tQ#OuQ#PvQ#|#RR$_#hR$Q#SQ!VZQ!d]Q#V!TQ#q!m[$O#S$P$Y$q$v%SQ$R#UQ$T#XS$h#q$jQ$m#zR%O$iR#}#RQiPR#QwQ!c[Q!kaR#Y!VU!_[a!VQ!j`Q#c!^Q#g!`Q$[#dR$]#e",nodeNames:"⚠ Unit VariableName Comment StyleSheet RuleSet UniversalSelector TagSelector TagName NestingSelector ClassSelector ClassName PseudoClassSelector : :: PseudoClassName PseudoClassName ) ( ArgList ValueName ParenthesizedValue ColorLiteral NumberLiteral StringLiteral BinaryExpression BinOp CallExpression Callee CallLiteral CallTag ParenthesizedContent ] [ LineNames LineName , PseudoClassName ArgList IdSelector # IdName AttributeSelector AttributeName MatchOp ChildSelector ChildOp DescendantSelector SiblingSelector SiblingOp } { Block Declaration PropertyName Important ; ImportStatement AtKeyword import KeywordQuery FeatureQuery FeatureName BinaryQuery LogicOp UnaryQuery UnaryQueryOp ParenthesizedQuery SelectorQuery selector MediaStatement media CharsetStatement charset NamespaceStatement namespace NamespaceName KeyframesStatement keyframes KeyframeName KeyframeList KeyframeSelector KeyframeRangeName SupportsStatement supports AtRule Styles",maxTerm:117,nodeProps:[["isolate",-2,3,24,""],["openedBy",17,"(",32,"[",50,"{"],["closedBy",18,")",33,"]",51,"}"]],propSources:[gc],skippedNodes:[0,3,87],repeatNodeCount:11,tokenData:"J^~R!^OX$}X^%u^p$}pq%uqr)Xrs.Rst/utu6duv$}vw7^wx7oxy9^yz9oz{9t{|:_|}?Q}!O?c!O!P@Q!P!Q@i!Q![Ab![!]B]!]!^CX!^!_$}!_!`Cj!`!aC{!a!b$}!b!cDw!c!}$}!}#OFa#O#P$}#P#QFr#Q#R6d#R#T$}#T#UGT#U#c$}#c#dHf#d#o$}#o#pH{#p#q6d#q#rI^#r#sIo#s#y$}#y#z%u#z$f$}$f$g%u$g#BY$}#BY#BZ%u#BZ$IS$}$IS$I_%u$I_$I|$}$I|$JO%u$JO$JT$}$JT$JU%u$JU$KV$}$KV$KW%u$KW&FU$}&FU&FV%u&FV;'S$};'S;=`JW<%lO$}`%QSOy%^z;'S%^;'S;=`%o<%lO%^`%cSo`Oy%^z;'S%^;'S;=`%o<%lO%^`%rP;=`<%l%^~%zh#Z~OX%^X^'f^p%^pq'fqy%^z#y%^#y#z'f#z$f%^$f$g'f$g#BY%^#BY#BZ'f#BZ$IS%^$IS$I_'f$I_$I|%^$I|$JO'f$JO$JT%^$JT$JU'f$JU$KV%^$KV$KW'f$KW&FU%^&FU&FV'f&FV;'S%^;'S;=`%o<%lO%^~'mh#Z~o`OX%^X^'f^p%^pq'fqy%^z#y%^#y#z'f#z$f%^$f$g'f$g#BY%^#BY#BZ'f#BZ$IS%^$IS$I_'f$I_$I|%^$I|$JO'f$JO$JT%^$JT$JU'f$JU$KV%^$KV$KW'f$KW&FU%^&FU&FV'f&FV;'S%^;'S;=`%o<%lO%^l)[UOy%^z#]%^#]#^)n#^;'S%^;'S;=`%o<%lO%^l)sUo`Oy%^z#a%^#a#b*V#b;'S%^;'S;=`%o<%lO%^l*[Uo`Oy%^z#d%^#d#e*n#e;'S%^;'S;=`%o<%lO%^l*sUo`Oy%^z#c%^#c#d+V#d;'S%^;'S;=`%o<%lO%^l+[Uo`Oy%^z#f%^#f#g+n#g;'S%^;'S;=`%o<%lO%^l+sUo`Oy%^z#h%^#h#i,V#i;'S%^;'S;=`%o<%lO%^l,[Uo`Oy%^z#T%^#T#U,n#U;'S%^;'S;=`%o<%lO%^l,sUo`Oy%^z#b%^#b#c-V#c;'S%^;'S;=`%o<%lO%^l-[Uo`Oy%^z#h%^#h#i-n#i;'S%^;'S;=`%o<%lO%^l-uS!X[o`Oy%^z;'S%^;'S;=`%o<%lO%^~.UWOY.RZr.Rrs.ns#O.R#O#P.s#P;'S.R;'S;=`/o<%lO.R~.sOh~~.vRO;'S.R;'S;=`/P;=`O.R~/SXOY.RZr.Rrs.ns#O.R#O#P.s#P;'S.R;'S;=`/o;=`<%l.R<%lO.R~/rP;=`<%l.Rn/zYxQOy%^z!Q%^!Q![0j![!c%^!c!i0j!i#T%^#T#Z0j#Z;'S%^;'S;=`%o<%lO%^l0oYo`Oy%^z!Q%^!Q![1_![!c%^!c!i1_!i#T%^#T#Z1_#Z;'S%^;'S;=`%o<%lO%^l1dYo`Oy%^z!Q%^!Q![2S![!c%^!c!i2S!i#T%^#T#Z2S#Z;'S%^;'S;=`%o<%lO%^l2ZYf[o`Oy%^z!Q%^!Q![2y![!c%^!c!i2y!i#T%^#T#Z2y#Z;'S%^;'S;=`%o<%lO%^l3QYf[o`Oy%^z!Q%^!Q![3p![!c%^!c!i3p!i#T%^#T#Z3p#Z;'S%^;'S;=`%o<%lO%^l3uYo`Oy%^z!Q%^!Q![4e![!c%^!c!i4e!i#T%^#T#Z4e#Z;'S%^;'S;=`%o<%lO%^l4lYf[o`Oy%^z!Q%^!Q![5[![!c%^!c!i5[!i#T%^#T#Z5[#Z;'S%^;'S;=`%o<%lO%^l5aYo`Oy%^z!Q%^!Q![6P![!c%^!c!i6P!i#T%^#T#Z6P#Z;'S%^;'S;=`%o<%lO%^l6WSf[o`Oy%^z;'S%^;'S;=`%o<%lO%^d6gUOy%^z!_%^!_!`6y!`;'S%^;'S;=`%o<%lO%^d7QS|So`Oy%^z;'S%^;'S;=`%o<%lO%^b7cSXQOy%^z;'S%^;'S;=`%o<%lO%^~7rWOY7oZw7owx.nx#O7o#O#P8[#P;'S7o;'S;=`9W<%lO7o~8_RO;'S7o;'S;=`8h;=`O7o~8kXOY7oZw7owx.nx#O7o#O#P8[#P;'S7o;'S;=`9W;=`<%l7o<%lO7o~9ZP;=`<%l7on9cSb^Oy%^z;'S%^;'S;=`%o<%lO%^~9tOa~n9{UUQjWOy%^z!_%^!_!`6y!`;'S%^;'S;=`%o<%lO%^n:fWjW!RQOy%^z!O%^!O!P;O!P!Q%^!Q![>T![;'S%^;'S;=`%o<%lO%^l;TUo`Oy%^z!Q%^!Q![;g![;'S%^;'S;=`%o<%lO%^l;nYo`#e[Oy%^z!Q%^!Q![;g![!g%^!g!h<^!h#X%^#X#Y<^#Y;'S%^;'S;=`%o<%lO%^l<cYo`Oy%^z{%^{|=R|}%^}!O=R!O!Q%^!Q![=j![;'S%^;'S;=`%o<%lO%^l=WUo`Oy%^z!Q%^!Q![=j![;'S%^;'S;=`%o<%lO%^l=qUo`#e[Oy%^z!Q%^!Q![=j![;'S%^;'S;=`%o<%lO%^l>[[o`#e[Oy%^z!O%^!O!P;g!P!Q%^!Q![>T![!g%^!g!h<^!h#X%^#X#Y<^#Y;'S%^;'S;=`%o<%lO%^n?VSt^Oy%^z;'S%^;'S;=`%o<%lO%^l?hWjWOy%^z!O%^!O!P;O!P!Q%^!Q![>T![;'S%^;'S;=`%o<%lO%^n@VU#bQOy%^z!Q%^!Q![;g![;'S%^;'S;=`%o<%lO%^~@nTjWOy%^z{@}{;'S%^;'S;=`%o<%lO%^~AUSo`#[~Oy%^z;'S%^;'S;=`%o<%lO%^lAg[#e[Oy%^z!O%^!O!P;g!P!Q%^!Q![>T![!g%^!g!h<^!h#X%^#X#Y<^#Y;'S%^;'S;=`%o<%lO%^bBbU]QOy%^z![%^![!]Bt!];'S%^;'S;=`%o<%lO%^bB{S^Qo`Oy%^z;'S%^;'S;=`%o<%lO%^nC^S!Y^Oy%^z;'S%^;'S;=`%o<%lO%^dCoS|SOy%^z;'S%^;'S;=`%o<%lO%^bDQU!OQOy%^z!`%^!`!aDd!a;'S%^;'S;=`%o<%lO%^bDkS!OQo`Oy%^z;'S%^;'S;=`%o<%lO%^bDzWOy%^z!c%^!c!}Ed!}#T%^#T#oEd#o;'S%^;'S;=`%o<%lO%^bEk[![Qo`Oy%^z}%^}!OEd!O!Q%^!Q![Ed![!c%^!c!}Ed!}#T%^#T#oEd#o;'S%^;'S;=`%o<%lO%^nFfSq^Oy%^z;'S%^;'S;=`%o<%lO%^nFwSp^Oy%^z;'S%^;'S;=`%o<%lO%^bGWUOy%^z#b%^#b#cGj#c;'S%^;'S;=`%o<%lO%^bGoUo`Oy%^z#W%^#W#XHR#X;'S%^;'S;=`%o<%lO%^bHYS!bQo`Oy%^z;'S%^;'S;=`%o<%lO%^bHiUOy%^z#f%^#f#gHR#g;'S%^;'S;=`%o<%lO%^fIQS!TUOy%^z;'S%^;'S;=`%o<%lO%^nIcS!S^Oy%^z;'S%^;'S;=`%o<%lO%^fItU!RQOy%^z!_%^!_!`6y!`;'S%^;'S;=`%o<%lO%^`JZP;=`<%l$}",tokenizers:[dc,pc,fc,1,2,3,4,new Gh("m~RRYZ[z{a~~g~aO#^~~dP!P!Qg~lO#_~~",28,105)],topRules:{StyleSheet:[0,4],Styles:[1,86]},specialized:[{term:100,get:t=>mc[t]||-1},{term:58,get:t=>wc[t]||-1},{term:101,get:t=>bc[t]||-1}],tokenPrec:1200});const qc=_a.define({name:"css",parser:Sc.configure({props:[al.add({Declaration:gl()}),bl.add({"Block KeyframeList":Sl})]}),languageData:{commentTokens:{block:{open:"/*",close:"*/"}},indentOnInput:/^\s*\}$/,wordChars:"-"}});class Wc{constructor(t,e,i){this.state=t,this.pos=e,this.explicit=i,this.abortListeners=[];}tokenBefore(t){let e=Ea(this.state).resolveInner(this.pos,-1);for(;e&&t.indexOf(e.name)<0;)e=e.parent;return e?{from:e.from,to:this.pos,text:this.state.sliceDoc(e.from,this.pos),type:e.type}:null}matchBefore(t){let e=this.state.doc.lineAt(this.pos),i=Math.max(e.from,this.pos-250),n=e.text.slice(i-e.from,this.pos-e.from),s=n.search(Vc(t,!1));return s<0?null:{from:i+s,to:this.pos,text:n.slice(s)}}get aborted(){return null==this.abortListeners}addEventListener(t,e){"abort"==t&&this.abortListeners&&this.abortListeners.push(e);}}function Mc(t){let e=Object.keys(t).join(""),i=/\w/.test(e);return i&&(e=e.replace(/\w/g,"")),`[${i?"\\w":""}${e.replace(/[^\w\s]/g,"\\$&")}]`}function jc(t){let e=t.map((t=>"string"==typeof t?{label:t}:t)),[i,n]=e.every((t=>/^\w+$/.test(t.label)))?[/\w*$/,/\w+$/]:function(t){let e=Object.create(null),i=Object.create(null);for(let{label:n}of t){e[n[0]]=!0;for(let t=1;t<n.length;t++)i[n[t]]=!0;}let n=Mc(e)+Mc(i)+"*$";return [new RegExp("^"+n),new RegExp(n)]}(e);return t=>{let s=t.matchBefore(n);return s||t.explicit?{from:s?s.from:t.pos,options:e,validFor:i}:null}}class Ec{constructor(t,e,i,n){this.completion=t,this.source=e,this.match=i,this.score=n;}}function zc(t){return t.selection.main.from}function Vc(t,e){var i;let{source:n}=t,s=e&&"^"!=n[0],r="$"!=n[n.length-1];return s||r?new RegExp(`${s?"^":""}(?:${n})${r?"$":""}`,null!==(i=t.flags)&&void 0!==i?i:t.ignoreCase?"i":""):t}const Dc=ie.define();const Uc=new WeakMap;function Nc(t){if(!Array.isArray(t))return t;let e=Uc.get(t);return e||Uc.set(t,e=jc(t)),e}const Gc=re.define(),Bc=re.define();class Ic{constructor(t){this.pattern=t,this.chars=[],this.folded=[],this.any=[],this.precise=[],this.byWord=[],this.score=0,this.matched=[];for(let e=0;e<t.length;){let i=ut(t,e),n=dt(i);this.chars.push(i);let s=t.slice(e,e+n),r=s.toUpperCase();this.folded.push(ut(r==s?s.toLowerCase():r,0)),e+=n;}this.astral=t.length!=this.chars.length;}ret(t,e){return this.score=t,this.matched=e,!0}match(t){if(0==this.pattern.length)return this.ret(-100,[]);if(t.length<this.pattern.length)return !1;let{chars:e,folded:i,any:n,precise:s,byWord:r}=this;if(1==e.length){let n=ut(t,0),s=dt(n),r=s==t.length?0:-100;if(n==e[0]);else {if(n!=i[0])return !1;r+=-200;}return this.ret(r,[0,s])}let o=t.indexOf(this.pattern);if(0==o)return this.ret(t.length==this.pattern.length?0:-100,[0,this.pattern.length]);let a=e.length,l=0;if(o<0){for(let s=0,r=Math.min(t.length,200);s<r&&l<a;){let r=ut(t,s);r!=e[l]&&r!=i[l]||(n[l++]=s),s+=dt(r);}if(l<a)return !1}let h=0,c=0,O=!1,u=0,f=-1,d=-1,p=/[a-z]/.test(t),g=!0;for(let n=0,l=Math.min(t.length,200),m=0;n<l&&c<a;){let l=ut(t,n);o<0&&(h<a&&l==e[h]&&(s[h++]=n),u<a&&(l==e[u]||l==i[u]?(0==u&&(f=n),d=n+1,u++):u=0));let w,b=l<255?l>=48&&l<=57||l>=97&&l<=122?2:l>=65&&l<=90?1:0:(w=ft(l))!=w.toLowerCase()?1:w!=w.toUpperCase()?2:0;(!n||1==b&&p||0==m&&0!=b)&&(e[c]==l||i[c]==l&&(O=!0)?r[c++]=n:r.length&&(g=!1)),m=b,n+=dt(l);}return c==a&&0==r[0]&&g?this.result((O?-200:0)-100,r,t):u==a&&0==f?this.ret(-200-t.length+(d==t.length?0:-100),[0,d]):o>-1?this.ret(-700-t.length,[o,o+this.pattern.length]):u==a?this.ret(-900-t.length,[f,d]):c==a?this.result((O?-200:0)-100-700+(g?0:-1100),r,t):2!=e.length&&this.result((n[0]?-700:0)-200-1100,n,t)}result(t,e,i){let n=[],s=0;for(let t of e){let e=t+(this.astral?dt(ut(i,t)):1);s&&n[s-1]==t?n[s-1]=e:(n[s++]=t,n[s++]=e);}return this.ret(t-i.length,n)}}const Lc=Xt.define({combine:t=>we(t,{activateOnTyping:!0,selectOnOpen:!0,override:null,closeOnBlur:!0,maxRenderedOptions:100,defaultKeymap:!0,tooltipClass:()=>"",optionClass:()=>"",aboveCursor:!1,icons:!0,addToOptions:[],positionInfo:Hc,compareCompletions:(t,e)=>t.label.localeCompare(e.label),interactionDelay:75,updateSyncTime:100},{defaultKeymap:(t,e)=>t&&e,closeOnBlur:(t,e)=>t&&e,icons:(t,e)=>t&&e,tooltipClass:(t,e)=>i=>Fc(t(i),e(i)),optionClass:(t,e)=>i=>Fc(t(i),e(i)),addToOptions:(t,e)=>t.concat(e)})});function Fc(t,e){return t?e?t+" "+e:t:e}function Hc(t,e,i,n,s,r){let o,a,l=t.textDirection==sn.RTL,h=l,c=!1,O="top",u=e.left-s.left,f=s.right-e.right,d=n.right-n.left,p=n.bottom-n.top;if(h&&u<Math.min(d,f)?h=!1:!h&&f<Math.min(d,u)&&(h=!0),d<=(h?u:f))o=Math.max(s.top,Math.min(i.top,s.bottom-p))-e.top,a=Math.min(400,h?u:f);else {c=!0,a=Math.min(400,(l?e.right:s.right-e.left)-30);let t=s.bottom-e.bottom;t>=p||t>e.top?o=i.bottom-e.top:(O="bottom",o=e.bottom-i.top);}return {style:`${O}: ${o/((e.bottom-e.top)/r.offsetHeight)}px; max-width: ${a/((e.right-e.left)/r.offsetWidth)}px`,class:"cm-completionInfo-"+(c?l?"left-narrow":"right-narrow":h?"left":"right")}}function Jc(t,e,i){if(t<=i)return {from:0,to:t};if(e<0&&(e=0),e<=t>>1){let t=Math.floor(e/i);return {from:t*i,to:(t+1)*i}}let n=Math.floor((t-e)/i);return {from:t-(n+1)*i,to:t-n*i}}class Kc{constructor(t,e,i){this.view=t,this.stateField=e,this.applyCompletion=i,this.info=null,this.infoDestroy=null,this.placeInfoReq={read:()=>this.measureInfo(),write:t=>this.placeInfo(t),key:this},this.space=null,this.currentClass="";let n=t.state.field(e),{options:s,selected:r}=n.open,o=t.state.facet(Lc);this.optionContent=function(t){let e=t.addToOptions.slice();return t.icons&&e.push({render(t){let e=document.createElement("div");return e.classList.add("cm-completionIcon"),t.type&&e.classList.add(...t.type.split(/\s+/g).map((t=>"cm-completionIcon-"+t))),e.setAttribute("aria-hidden","true"),e},position:20}),e.push({render(t,e,i){let n=document.createElement("span");n.className="cm-completionLabel";let s=t.displayLabel||t.label,r=0;for(let t=0;t<i.length;){let e=i[t++],o=i[t++];e>r&&n.appendChild(document.createTextNode(s.slice(r,e)));let a=n.appendChild(document.createElement("span"));a.appendChild(document.createTextNode(s.slice(e,o))),a.className="cm-completionMatchedText",r=o;}return r<s.length&&n.appendChild(document.createTextNode(s.slice(r))),n},position:50},{render(t){if(!t.detail)return null;let e=document.createElement("span");return e.className="cm-completionDetail",e.textContent=t.detail,e},position:80}),e.sort(((t,e)=>t.position-e.position)).map((t=>t.render))}(o),this.optionClass=o.optionClass,this.tooltipClass=o.tooltipClass,this.range=Jc(s.length,r,o.maxRenderedOptions),this.dom=document.createElement("div"),this.dom.className="cm-tooltip-autocomplete",this.updateTooltipClass(t.state),this.dom.addEventListener("mousedown",(i=>{let{options:n}=t.state.field(e).open;for(let e,s=i.target;s&&s!=this.dom;s=s.parentNode)if("LI"==s.nodeName&&(e=/-(\d+)$/.exec(s.id))&&+e[1]<n.length)return this.applyCompletion(t,n[+e[1]]),void i.preventDefault()})),this.dom.addEventListener("focusout",(e=>{let i=t.state.field(this.stateField,!1);i&&i.tooltip&&t.state.facet(Lc).closeOnBlur&&e.relatedTarget!=t.contentDOM&&t.dispatch({effects:Bc.of(null)});})),this.showOptions(s,n.id);}mount(){this.updateSel();}showOptions(t,e){this.list&&this.list.remove(),this.list=this.dom.appendChild(this.createListBox(t,e,this.range)),this.list.addEventListener("scroll",(()=>{this.info&&this.view.requestMeasure(this.placeInfoReq);}));}update(t){var e;let i=t.state.field(this.stateField),n=t.startState.field(this.stateField);if(this.updateTooltipClass(t.state),i!=n){let{options:s,selected:r,disabled:o}=i.open;n.open&&n.open.options==s||(this.range=Jc(s.length,r,t.state.facet(Lc).maxRenderedOptions),this.showOptions(s,i.id)),this.updateSel(),o!=(null===(e=n.open)||void 0===e?void 0:e.disabled)&&this.dom.classList.toggle("cm-tooltip-autocomplete-disabled",!!o);}}updateTooltipClass(t){let e=this.tooltipClass(t);if(e!=this.currentClass){for(let t of this.currentClass.split(" "))t&&this.dom.classList.remove(t);for(let t of e.split(" "))t&&this.dom.classList.add(t);this.currentClass=e;}}positioned(t){this.space=t,this.info&&this.view.requestMeasure(this.placeInfoReq);}updateSel(){let t=this.view.state.field(this.stateField),e=t.open;if((e.selected>-1&&e.selected<this.range.from||e.selected>=this.range.to)&&(this.range=Jc(e.options.length,e.selected,this.view.state.facet(Lc).maxRenderedOptions),this.showOptions(e.options,t.id)),this.updateSelectedOption(e.selected)){this.destroyInfo();let{completion:i}=e.options[e.selected],{info:n}=i;if(!n)return;let s="string"==typeof n?document.createTextNode(n):n(i);if(!s)return;"then"in s?s.then((e=>{e&&this.view.state.field(this.stateField,!1)==t&&this.addInfoPane(e,i);})).catch((t=>qn(this.view.state,t,"completion info"))):this.addInfoPane(s,i);}}addInfoPane(t,e){this.destroyInfo();let i=this.info=document.createElement("div");if(i.className="cm-tooltip cm-completionInfo",null!=t.nodeType)i.appendChild(t),this.infoDestroy=null;else {let{dom:e,destroy:n}=t;i.appendChild(e),this.infoDestroy=n||null;}this.dom.appendChild(i),this.view.requestMeasure(this.placeInfoReq);}updateSelectedOption(t){let e=null;for(let i=this.list.firstChild,n=this.range.from;i;i=i.nextSibling,n++)"LI"==i.nodeName&&i.id?n==t?i.hasAttribute("aria-selected")||(i.setAttribute("aria-selected","true"),e=i):i.hasAttribute("aria-selected")&&i.removeAttribute("aria-selected"):n--;return e&&function(t,e){let i=t.getBoundingClientRect(),n=e.getBoundingClientRect(),s=i.height/t.offsetHeight;n.top<i.top?t.scrollTop-=(i.top-n.top)/s:n.bottom>i.bottom&&(t.scrollTop+=(n.bottom-i.bottom)/s);}(this.list,e),e}measureInfo(){let t=this.dom.querySelector("[aria-selected]");if(!t||!this.info)return null;let e=this.dom.getBoundingClientRect(),i=this.info.getBoundingClientRect(),n=t.getBoundingClientRect(),s=this.space;if(!s){let t=this.dom.ownerDocument.defaultView||window;s={left:0,top:0,right:t.innerWidth,bottom:t.innerHeight};}return n.top>Math.min(s.bottom,e.bottom)-10||n.bottom<Math.max(s.top,e.top)+10?null:this.view.state.facet(Lc).positionInfo(this.view,e,n,i,s,this.dom)}placeInfo(t){this.info&&(t?(t.style&&(this.info.style.cssText=t.style),this.info.className="cm-tooltip cm-completionInfo "+(t.class||"")):this.info.style.cssText="top: -1e6px");}createListBox(t,e,i){const n=document.createElement("ul");n.id=e,n.setAttribute("role","listbox"),n.setAttribute("aria-expanded","true"),n.setAttribute("aria-label",this.view.state.phrase("Completions"));let s=null;for(let r=i.from;r<i.to;r++){let{completion:o,match:a}=t[r],{section:l}=o;if(l){let t="string"==typeof l?l:l.name;if(t!=s&&(r>i.from||0==i.from))if(s=t,"string"!=typeof l&&l.header)n.appendChild(l.header(l));else {n.appendChild(document.createElement("completion-section")).textContent=t;}}const h=n.appendChild(document.createElement("li"));h.id=e+"-"+r,h.setAttribute("role","option");let c=this.optionClass(o);c&&(h.className=c);for(let t of this.optionContent){let e=t(o,this.view.state,a);e&&h.appendChild(e);}}return i.from&&n.classList.add("cm-completionListIncompleteTop"),i.to<t.length&&n.classList.add("cm-completionListIncompleteBottom"),n}destroyInfo(){this.info&&(this.infoDestroy&&this.infoDestroy(),this.info.remove(),this.info=null);}destroy(){this.destroyInfo();}}function tO(t,e){return i=>new Kc(i,t,e)}function eO(t){return 100*(t.boost||0)+(t.apply?10:0)+(t.info?5:0)+(t.type?1:0)}class iO{constructor(t,e,i,n,s,r){this.options=t,this.attrs=e,this.tooltip=i,this.timestamp=n,this.selected=s,this.disabled=r;}setSelected(t,e){return t==this.selected||t>=this.options.length?this:new iO(this.options,rO(e,t),this.tooltip,this.timestamp,t,this.disabled)}static build(t,e,i,n,s){let r=function(t,e){let i=[],n=null,s=t=>{i.push(t);let{section:e}=t.completion;if(e){n||(n=[]);let t="string"==typeof e?e:e.name;n.some((e=>e.name==t))||n.push("string"==typeof e?{name:t}:e);}};for(let n of t)if(n.hasResult()){let t=n.result.getMatch;if(!1===n.result.filter)for(let e of n.result.options)s(new Ec(e,n.source,t?t(e):[],1e9-i.length));else {let i=new Ic(e.sliceDoc(n.from,n.to));for(let e of n.result.options)if(i.match(e.label)){let r=e.displayLabel?t?t(e,i.matched):[]:i.matched;s(new Ec(e,n.source,r,i.score+(e.boost||0)));}}}if(n){let t=Object.create(null),e=0,s=(t,e)=>{var i,n;return (null!==(i=t.rank)&&void 0!==i?i:1e9)-(null!==(n=e.rank)&&void 0!==n?n:1e9)||(t.name<e.name?-1:1)};for(let i of n.sort(s))e-=1e5,t[i.name]=e;for(let e of i){let{section:i}=e.completion;i&&(e.score+=t["string"==typeof i?i:i.name]);}}let r=[],o=null,a=e.facet(Lc).compareCompletions;for(let t of i.sort(((t,e)=>e.score-t.score||a(t.completion,e.completion)))){let e=t.completion;!o||o.label!=e.label||o.detail!=e.detail||null!=o.type&&null!=e.type&&o.type!=e.type||o.apply!=e.apply||o.boost!=e.boost?r.push(t):eO(t.completion)>eO(o)&&(r[r.length-1]=t),o=t.completion;}return r}(t,e);if(!r.length)return n&&t.some((t=>1==t.state))?new iO(n.options,n.attrs,n.tooltip,n.timestamp,n.selected,!0):null;let o=e.facet(Lc).selectOnOpen?0:-1;if(n&&n.selected!=o&&-1!=n.selected){let t=n.options[n.selected].completion;for(let e=0;e<r.length;e++)if(r[e].completion==t){o=e;break}}return new iO(r,rO(i,o),{pos:t.reduce(((t,e)=>e.hasResult()?Math.min(t,e.from):t),1e8),create:dO,above:s.aboveCursor},n?n.timestamp:Date.now(),o,!1)}map(t){return new iO(this.options,this.attrs,Object.assign(Object.assign({},this.tooltip),{pos:t.mapPos(this.tooltip.pos)}),this.timestamp,this.selected,this.disabled)}}class nO{constructor(t,e,i){this.active=t,this.id=e,this.open=i;}static start(){return new nO(oO,"cm-ac-"+Math.floor(2e6*Math.random()).toString(36),null)}update(t){let{state:e}=t,i=e.facet(Lc),n=(i.override||e.languageDataAt("autocomplete",zc(e)).map(Nc)).map((e=>(this.active.find((t=>t.source==e))||new lO(e,this.active.some((t=>0!=t.state))?1:0)).update(t,i)));n.length==this.active.length&&n.every(((t,e)=>t==this.active[e]))&&(n=this.active);let s=this.open;s&&t.docChanged&&(s=s.map(t.changes)),t.selection||n.some((e=>e.hasResult()&&t.changes.touchesRange(e.from,e.to)))||!function(t,e){if(t==e)return !0;for(let i=0,n=0;;){for(;i<t.length&&!t[i].hasResult;)i++;for(;n<e.length&&!e[n].hasResult;)n++;let s=i==t.length,r=n==e.length;if(s||r)return s==r;if(t[i++].result!=e[n++].result)return !1}}(n,this.active)?s=iO.build(n,e,this.id,s,i):s&&s.disabled&&!n.some((t=>1==t.state))&&(s=null),!s&&n.every((t=>1!=t.state))&&n.some((t=>t.hasResult()))&&(n=n.map((t=>t.hasResult()?new lO(t.source,0):t)));for(let e of t.effects)e.is(OO)&&(s=s&&s.setSelected(e.value,this.id));return n==this.active&&s==this.open?this:new nO(n,this.id,s)}get tooltip(){return this.open?this.open.tooltip:null}get attrs(){return this.open?this.open.attrs:sO}}const sO={"aria-autocomplete":"list"};function rO(t,e){let i={"aria-autocomplete":"list","aria-haspopup":"listbox","aria-controls":t};return e>-1&&(i["aria-activedescendant"]=t+"-"+e),i}const oO=[];function aO(t){return t.isUserEvent("input.type")?"input":t.isUserEvent("delete.backward")?"delete":null}class lO{constructor(t,e,i=-1){this.source=t,this.state=e,this.explicitPos=i;}hasResult(){return !1}update(t,e){let i=aO(t),n=this;i?n=n.handleUserEvent(t,i,e):t.docChanged?n=n.handleChange(t):t.selection&&0!=n.state&&(n=new lO(n.source,0));for(let e of t.effects)if(e.is(Gc))n=new lO(n.source,1,e.value?zc(t.state):-1);else if(e.is(Bc))n=new lO(n.source,0);else if(e.is(cO))for(let t of e.value)t.source==n.source&&(n=t);return n}handleUserEvent(t,e,i){return "delete"!=e&&i.activateOnTyping?new lO(this.source,1):this.map(t.changes)}handleChange(t){return t.changes.touchesRange(zc(t.startState))?new lO(this.source,0):this.map(t.changes)}map(t){return t.empty||this.explicitPos<0?this:new lO(this.source,this.state,t.mapPos(this.explicitPos))}}class hO extends lO{constructor(t,e,i,n,s){super(t,2,e),this.result=i,this.from=n,this.to=s;}hasResult(){return !0}handleUserEvent(t,e,i){var n;let s=t.changes.mapPos(this.from),r=t.changes.mapPos(this.to,1),o=zc(t.state);if((this.explicitPos<0?o<=s:o<this.from)||o>r||"delete"==e&&zc(t.startState)==this.from)return new lO(this.source,"input"==e&&i.activateOnTyping?1:0);let a,l=this.explicitPos<0?-1:t.changes.mapPos(this.explicitPos);return function(t,e,i,n){if(!t)return !1;let s=e.sliceDoc(i,n);return "function"==typeof t?t(s,i,n,e):Vc(t,!0).test(s)}(this.result.validFor,t.state,s,r)?new hO(this.source,l,this.result,s,r):this.result.update&&(a=this.result.update(this.result,s,r,new Wc(t.state,o,l>=0)))?new hO(this.source,l,a,a.from,null!==(n=a.to)&&void 0!==n?n:zc(t.state)):new lO(this.source,1,l)}handleChange(t){return t.changes.touchesRange(this.from,this.to)?new lO(this.source,0):this.map(t.changes)}map(t){return t.empty?this:new hO(this.source,this.explicitPos<0?-1:t.mapPos(this.explicitPos),this.result,t.mapPos(this.from),t.mapPos(this.to,1))}}const cO=re.define({map:(t,e)=>t.map((t=>t.map(e)))}),OO=re.define(),uO=Wt.define({create:()=>nO.start(),update:(t,e)=>t.update(e),provide:t=>[Co.from(t,(t=>t.tooltip)),Yr.contentAttributes.from(t,(t=>t.attrs))]});function fO(t,e){const i=e.completion.apply||e.completion.label;let n=t.state.field(uO).active.find((t=>t.source==e.source));return n instanceof hO&&("string"==typeof i?t.dispatch(Object.assign(Object.assign({},function(t,e,i,n){let{main:s}=t.selection,r=i-s.from,o=n-s.from;return Object.assign(Object.assign({},t.changeByRange((a=>a!=s&&i!=n&&t.sliceDoc(a.from+r,a.from+o)!=t.sliceDoc(i,n)?{range:a}:{changes:{from:a.from+r,to:n==s.from?a.to:a.from+o,insert:e},range:kt.cursor(a.from+r+e.length)}))),{scrollIntoView:!0,userEvent:"input.complete"})}(t.state,i,n.from,n.to)),{annotations:Dc.of(e.completion)})):i(t,e.completion,n.from,n.to),!0)}const dO=tO(uO,fO);function pO(t,e="option"){return i=>{let n=i.state.field(uO,!1);if(!n||!n.open||n.open.disabled||Date.now()-n.open.timestamp<i.state.facet(Lc).interactionDelay)return !1;let s,r=1;"page"==e&&(s=qo(i,n.open.tooltip))&&(r=Math.max(2,Math.floor(s.dom.offsetHeight/s.dom.querySelector("li").offsetHeight)-1));let{length:o}=n.open.options,a=n.open.selected>-1?n.open.selected+r*(t?1:-1):t?0:o-1;return a<0?a="page"==e?0:o-1:a>=o&&(a="page"==e?o-1:0),i.dispatch({effects:OO.of(a)}),!0}}const gO=t=>{let e=t.state.field(uO,!1);return !(t.state.readOnly||!e||!e.open||e.open.selected<0||e.open.disabled||Date.now()-e.open.timestamp<t.state.facet(Lc).interactionDelay)&&fO(t,e.open.options[e.open.selected])},mO=t=>!!t.state.field(uO,!1)&&(t.dispatch({effects:Gc.of(!0)}),!0),wO=t=>{let e=t.state.field(uO,!1);return !(!e||!e.active.some((t=>0!=t.state)))&&(t.dispatch({effects:Bc.of(null)}),!0)};class bO{constructor(t,e){this.active=t,this.context=e,this.time=Date.now(),this.updates=[],this.done=void 0;}}jn.fromClass(class{constructor(t){this.view=t,this.debounceUpdate=-1,this.running=[],this.debounceAccept=-1,this.composing=0;for(let e of t.state.field(uO).active)1==e.state&&this.startQuery(e);}update(t){let e=t.state.field(uO);if(!t.selectionSet&&!t.docChanged&&t.startState.field(uO)==e)return;let i=t.transactions.some((t=>(t.selection||t.docChanged)&&!aO(t)));for(let e=0;e<this.running.length;e++){let n=this.running[e];if(i||n.updates.length+t.transactions.length>50&&Date.now()-n.time>1e3){for(let t of n.context.abortListeners)try{t();}catch(t){qn(this.view.state,t);}n.context.abortListeners=null,this.running.splice(e--,1);}else n.updates.push(...t.transactions);}if(this.debounceUpdate>-1&&clearTimeout(this.debounceUpdate),this.debounceUpdate=e.active.some((t=>1==t.state&&!this.running.some((e=>e.active.source==t.source))))?setTimeout((()=>this.startUpdate()),50):-1,0!=this.composing)for(let e of t.transactions)"input"==aO(e)?this.composing=2:2==this.composing&&e.selection&&(this.composing=3);}startUpdate(){this.debounceUpdate=-1;let{state:t}=this.view,e=t.field(uO);for(let t of e.active)1!=t.state||this.running.some((e=>e.active.source==t.source))||this.startQuery(t);}startQuery(t){let{state:e}=this.view,i=zc(e),n=new Wc(e,i,t.explicitPos==i),s=new bO(t,n);this.running.push(s),Promise.resolve(t.source(n)).then((t=>{s.context.aborted||(s.done=t||null,this.scheduleAccept());}),(t=>{this.view.dispatch({effects:Bc.of(null)}),qn(this.view.state,t);}));}scheduleAccept(){this.running.every((t=>void 0!==t.done))?this.accept():this.debounceAccept<0&&(this.debounceAccept=setTimeout((()=>this.accept()),this.view.state.facet(Lc).updateSyncTime));}accept(){var t;this.debounceAccept>-1&&clearTimeout(this.debounceAccept),this.debounceAccept=-1;let e=[],i=this.view.state.facet(Lc);for(let n=0;n<this.running.length;n++){let s=this.running[n];if(void 0===s.done)continue;if(this.running.splice(n--,1),s.done){let n=new hO(s.active.source,s.active.explicitPos,s.done,s.done.from,null!==(t=s.done.to)&&void 0!==t?t:zc(s.updates.length?s.updates[0].startState:this.view.state));for(let t of s.updates)n=n.update(t,i);if(n.hasResult()){e.push(n);continue}}let r=this.view.state.field(uO).active.find((t=>t.source==s.active.source));if(r&&1==r.state)if(null==s.done){let t=new lO(s.active.source,0);for(let e of s.updates)t=t.update(e,i);1!=t.state&&e.push(t);}else this.startQuery(r);}e.length&&this.view.dispatch({effects:cO.of(e)});}},{eventHandlers:{blur(t){let e=this.view.state.field(uO,!1);if(e&&e.tooltip&&this.view.state.facet(Lc).closeOnBlur){let i=e.open&&qo(this.view,e.open.tooltip);i&&i.dom.contains(t.relatedTarget)||this.view.dispatch({effects:Bc.of(null)});}},compositionstart(){this.composing=1;},compositionend(){3==this.composing&&setTimeout((()=>this.view.dispatch({effects:Gc.of(!1)})),20),this.composing=0;}}});const QO=Yr.baseTheme({".cm-tooltip.cm-tooltip-autocomplete":{"& > ul":{fontFamily:"monospace",whiteSpace:"nowrap",overflow:"hidden auto",maxWidth_fallback:"700px",maxWidth:"min(700px, 95vw)",minWidth:"250px",maxHeight:"10em",height:"100%",listStyle:"none",margin:0,padding:0,"& > li, & > completion-section":{padding:"1px 3px",lineHeight:1.2},"& > li":{overflowX:"hidden",textOverflow:"ellipsis",cursor:"pointer"},"& > completion-section":{display:"list-item",borderBottom:"1px solid silver",paddingLeft:"0.5em",opacity:.7}}},"&light .cm-tooltip-autocomplete ul li[aria-selected]":{background:"#17c",color:"white"},"&light .cm-tooltip-autocomplete-disabled ul li[aria-selected]":{background:"#777"},"&dark .cm-tooltip-autocomplete ul li[aria-selected]":{background:"#347",color:"white"},"&dark .cm-tooltip-autocomplete-disabled ul li[aria-selected]":{background:"#444"},".cm-completionListIncompleteTop:before, .cm-completionListIncompleteBottom:after":{content:'"···"',opacity:.5,display:"block",textAlign:"center"},".cm-tooltip.cm-completionInfo":{position:"absolute",padding:"3px 9px",width:"max-content",maxWidth:"400px",boxSizing:"border-box"},".cm-completionInfo.cm-completionInfo-left":{right:"100%"},".cm-completionInfo.cm-completionInfo-right":{left:"100%"},".cm-completionInfo.cm-completionInfo-left-narrow":{right:"30px"},".cm-completionInfo.cm-completionInfo-right-narrow":{left:"30px"},"&light .cm-snippetField":{backgroundColor:"#00000022"},"&dark .cm-snippetField":{backgroundColor:"#ffffff22"},".cm-snippetFieldPosition":{verticalAlign:"text-top",width:0,height:"1.15em",display:"inline-block",margin:"0 -0.7px -.7em",borderLeft:"1.4px dotted #888"},".cm-completionMatchedText":{textDecoration:"underline"},".cm-completionDetail":{marginLeft:"0.5em",fontStyle:"italic"},".cm-completionIcon":{fontSize:"90%",width:".8em",display:"inline-block",textAlign:"center",paddingRight:".6em",opacity:"0.6",boxSizing:"content-box"},".cm-completionIcon-function, .cm-completionIcon-method":{"&:after":{content:"'ƒ'"}},".cm-completionIcon-class":{"&:after":{content:"'○'"}},".cm-completionIcon-interface":{"&:after":{content:"'◌'"}},".cm-completionIcon-variable":{"&:after":{content:"'𝑥'"}},".cm-completionIcon-constant":{"&:after":{content:"'𝐶'"}},".cm-completionIcon-type":{"&:after":{content:"'𝑡'"}},".cm-completionIcon-enum":{"&:after":{content:"'∪'"}},".cm-completionIcon-property":{"&:after":{content:"'□'"}},".cm-completionIcon-keyword":{"&:after":{content:"'🔑︎'"}},".cm-completionIcon-namespace":{"&:after":{content:"'▢'"}},".cm-completionIcon-text":{"&:after":{content:"'abc'",fontSize:"50%",verticalAlign:"middle"}}});class xO{constructor(t,e,i,n){this.field=t,this.line=e,this.from=i,this.to=n;}}class yO{constructor(t,e,i){this.field=t,this.from=e,this.to=i;}map(t){let e=t.mapPos(this.from,-1,gt.TrackDel),i=t.mapPos(this.to,1,gt.TrackDel);return null==e||null==i?null:new yO(this.field,e,i)}}class vO{constructor(t,e){this.lines=t,this.fieldPositions=e;}instantiate(t,e){let i=[],n=[e],s=t.doc.lineAt(e),r=/^\s*/.exec(s.text)[0];for(let s of this.lines){if(i.length){let i=r,o=/^\t*/.exec(s)[0].length;for(let e=0;e<o;e++)i+=t.facet(il);n.push(e+i.length-o),s=i+s.slice(o);}i.push(s),e+=s.length+1;}let o=this.fieldPositions.map((t=>new yO(t.field,n[t.line]+t.from,n[t.line]+t.to)));return {text:i,ranges:o}}static parse(t){let e,i=[],n=[],s=[];for(let r of t.split(/\r\n?|\n/)){for(;e=/[#$]\{(?:(\d+)(?::([^}]*))?|([^}]*))\}/.exec(r);){let t=e[1]?+e[1]:null,o=e[2]||e[3]||"",a=-1;for(let e=0;e<i.length;e++)(null!=t?i[e].seq==t:o&&i[e].name==o)&&(a=e);if(a<0){let e=0;for(;e<i.length&&(null==t||null!=i[e].seq&&i[e].seq<t);)e++;i.splice(e,0,{seq:t,name:o}),a=e;for(let t of s)t.field>=a&&t.field++;}s.push(new xO(a,n.length,e.index,e.index+o.length)),r=r.slice(0,e.index)+o+r.slice(e.index+e[0].length);}for(let t;t=/\\([{}])/.exec(r);){r=r.slice(0,t.index)+t[1]+r.slice(t.index+t[0].length);for(let e of s)e.line==n.length&&e.from>t.index&&(e.from--,e.to--);}n.push(r);}return new vO(n,s)}}let PO=Ii.widget({widget:new class extends Gi{toDOM(){let t=document.createElement("span");return t.className="cm-snippetFieldPosition",t}ignoreEvent(){return !1}}}),kO=Ii.mark({class:"cm-snippetField"});class $O{constructor(t,e){this.ranges=t,this.active=e,this.deco=Ii.set(t.map((t=>(t.from==t.to?PO:kO).range(t.from,t.to))));}map(t){let e=[];for(let i of this.ranges){let n=i.map(t);if(!n)return null;e.push(n);}return new $O(e,this.active)}selectionInsideField(t){return t.ranges.every((t=>this.ranges.some((e=>e.field==this.active&&e.from<=t.from&&e.to>=t.to))))}}const ZO=re.define({map:(t,e)=>t&&t.map(e)}),XO=re.define(),TO=Wt.define({create:()=>null,update(t,e){for(let i of e.effects){if(i.is(ZO))return i.value;if(i.is(XO)&&t)return new $O(t.ranges,i.value)}return t&&e.docChanged&&(t=t.map(e.changes)),t&&e.selection&&!t.selectionInsideField(e.selection)&&(t=null),t},provide:t=>Yr.decorations.from(t,(t=>t?t.deco:Ii.none))});function RO(t,e){return kt.create(t.filter((t=>t.field==e)).map((t=>kt.range(t.from,t.to))))}function AO(t){let e=vO.parse(t);return (t,i,n,s)=>{let{text:r,ranges:o}=e.instantiate(t.state,n),a={changes:{from:n,to:s,insert:B.of(r)},scrollIntoView:!0,annotations:i?Dc.of(i):void 0};if(o.length&&(a.selection=RO(o,0)),o.length>1){let e=new $O(o,0),i=a.effects=[ZO.of(e)];void 0===t.state.field(TO,!1)&&i.push(re.appendConfig.of([TO,WO,jO,QO]));}t.dispatch(t.state.update(a));}}function CO(t){return ({state:e,dispatch:i})=>{let n=e.field(TO,!1);if(!n||t<0&&0==n.active)return !1;let s=n.active+t,r=t>0&&!n.ranges.some((e=>e.field==s+t));return i(e.update({selection:RO(n.ranges,s),effects:ZO.of(r?null:new $O(n.ranges,s)),scrollIntoView:!0})),!0}}const qO=[{key:"Tab",run:CO(1),shift:CO(-1)},{key:"Escape",run:({state:t,dispatch:e})=>!!t.field(TO,!1)&&(e(t.update({effects:ZO.of(null)})),!0)}],YO=Xt.define({combine:t=>t.length?t[0]:qO}),WO=Vt.highest(Dr.compute([YO],(t=>t.facet(YO))));function MO(t,e){return Object.assign(Object.assign({},e),{apply:AO(t)})}const jO=Yr.domEventHandlers({mousedown(t,e){let i,n=e.state.field(TO,!1);if(!n||null==(i=e.posAtCoords({x:t.clientX,y:t.clientY})))return !1;let s=n.ranges.find((t=>t.from<=i&&t.to>=i));return !(!s||s.field==n.active)&&(e.dispatch({selection:RO(n.ranges,s.field),effects:ZO.of(n.ranges.some((t=>t.field>s.field))?new $O(n.ranges,s.field):null),scrollIntoView:!0}),!0)}});const UO={brackets:["(","[","{","'",'"'],before:")]}:;>",stringPrefixes:[]},NO=re.define({map(t,e){let i=e.mapPos(t,-1,gt.TrackAfter);return null==i?void 0:i}}),GO=new class extends be{};GO.startSide=1,GO.endSide=-1;const BO=Wt.define({create:()=>ye.empty,update(t,e){if(e.selection){let i=e.state.doc.lineAt(e.selection.main.head).from,n=e.startState.doc.lineAt(e.startState.selection.main.head).from;i!=e.changes.mapPos(n,-1)&&(t=ye.empty);}t=t.map(e.changes);for(let i of e.effects)i.is(NO)&&(t=t.update({add:[GO.range(i.value,i.value+1)]}));return t}});const LO="()[]{}<>";function FO(t){for(let e=0;e<LO.length;e+=2)if(LO.charCodeAt(e)==t)return LO.charAt(e+1);return ft(t<128?t:t+1)}function HO(t,e){return t.languageDataAt("closeBrackets",e)[0]||UO}const JO="object"==typeof navigator&&/Android\b/.test(navigator.userAgent);Yr.inputHandler.of(((t,e,i,n)=>{if((JO?t.composing:t.compositionStarted)||t.state.readOnly)return !1;let s=t.state.selection.main;if(n.length>2||2==n.length&&1==dt(ut(n,0))||e!=s.from||i!=s.to)return !1;let r=function(t,e){let i=HO(t,t.selection.main.head),n=i.brackets||UO.brackets;for(let s of n){let r=FO(ut(s,0));if(e==s)return r==s?ru(t,s,n.indexOf(s+s+s)>-1,i):nu(t,s,r,i.before||UO.before);if(e==r&&eu(t,t.selection.main.from))return su(t,s,r)}return null}(t.state,n);return !!r&&(t.dispatch(r),!0)}));function eu(t,e){let i=!1;return t.field(BO).between(0,t.doc.length,(t=>{t==e&&(i=!0);})),i}function iu(t,e){let i=t.sliceString(e,e+2);return i.slice(0,dt(ut(i,0)))}function nu(t,e,i,n){let s=null,r=t.changeByRange((r=>{if(!r.empty)return {changes:[{insert:e,from:r.from},{insert:i,from:r.to}],effects:NO.of(r.to+e.length),range:kt.range(r.anchor+e.length,r.head+e.length)};let o=iu(t.doc,r.head);return !o||/\s/.test(o)||n.indexOf(o)>-1?{changes:{insert:e+i,from:r.head},effects:NO.of(r.head+e.length),range:kt.cursor(r.head+e.length)}:{range:s=r}}));return s?null:t.update(r,{scrollIntoView:!0,userEvent:"input.type"})}function su(t,e,i){let n=null,s=t.changeByRange((e=>e.empty&&iu(t.doc,e.head)==i?{changes:{from:e.head,to:e.head+i.length,insert:i},range:kt.cursor(e.head+i.length)}:n={range:e}));return n?null:t.update(s,{scrollIntoView:!0,userEvent:"input.type"})}function ru(t,e,i,n){let s=n.stringPrefixes||UO.stringPrefixes,r=null,o=t.changeByRange((n=>{if(!n.empty)return {changes:[{insert:e,from:n.from},{insert:e,from:n.to}],effects:NO.of(n.to+e.length),range:kt.range(n.anchor+e.length,n.head+e.length)};let o,a=n.head,l=iu(t.doc,a);if(l==e){if(ou(t,a))return {changes:{insert:e+e,from:a},effects:NO.of(a+e.length),range:kt.cursor(a+e.length)};if(eu(t,a)){let n=i&&t.sliceDoc(a,a+3*e.length)==e+e+e?e+e+e:e;return {changes:{from:a,to:a+n.length,insert:n},range:kt.cursor(a+n.length)}}}else {if(i&&t.sliceDoc(a-2*e.length,a)==e+e&&(o=au(t,a-2*e.length,s))>-1&&ou(t,o))return {changes:{insert:e+e+e+e,from:a},effects:NO.of(a+e.length),range:kt.cursor(a+e.length)};if(t.charCategorizer(a)(l)!=fe.Word&&au(t,a,s)>-1&&!function(t,e,i,n){let s=Ea(t).resolveInner(e,-1),r=n.reduce(((t,e)=>Math.max(t,e.length)),0);for(let o=0;o<5;o++){let o=t.sliceDoc(s.from,Math.min(s.to,s.from+i.length+r)),a=o.indexOf(i);if(!a||a>-1&&n.indexOf(o.slice(0,a))>-1){let e=s.firstChild;for(;e&&e.from==s.from&&e.to-e.from>i.length+a;){if(t.sliceDoc(e.to-i.length,e.to)==i)return !1;e=e.firstChild;}return !0}let l=s.to==e&&s.parent;if(!l)break;s=l;}return !1}(t,a,e,s))return {changes:{insert:e+e,from:a},effects:NO.of(a+e.length),range:kt.cursor(a+e.length)}}return {range:r=n}}));return r?null:t.update(o,{scrollIntoView:!0,userEvent:"input.type"})}function ou(t,e){let i=Ea(t).resolveInner(e+1);return i.parent&&i.from==e}function au(t,e,i){let n=t.charCategorizer(e);if(n(t.sliceDoc(e-1,e))!=fe.Word)return e;for(let s of i){let i=e-s.length;if(t.sliceDoc(i,e)==s&&n(t.sliceDoc(i-1,i))!=fe.Word)return i}return -1}const hu=[{key:"Ctrl-Space",run:mO},{key:"Escape",run:wO},{key:"ArrowDown",run:pO(!0)},{key:"ArrowUp",run:pO(!1)},{key:"PageDown",run:pO(!0,"page")},{key:"PageUp",run:pO(!1,"page")},{key:"Enter",run:gO}];Vt.highest(Dr.computeN([Lc],(t=>t.facet(Lc).defaultKeymap?[hu]:[])));const yu=ie.define(),vu=ie.define(),Pu=Xt.define(),ku=Xt.define({combine:t=>we(t,{minDepth:100,newGroupDelay:500,joinToEvent:(t,e)=>e},{minDepth:Math.max,newGroupDelay:Math.min,joinToEvent:(t,e)=>(i,n)=>t(i,n)||e(i,n)})});Wt.define({create:()=>Uu.empty,update(t,e){let i=e.state.facet(ku),n=e.annotation(yu);if(n){let s=e.docChanged?kt.single(function(t){let e=0;return t.iterChangedRanges(((t,i)=>e=i)),e}(e.changes)):void 0,r=qu.fromTransaction(e,s),o=n.side,a=0==o?t.undone:t.done;return a=r?Yu(a,a.length,i.minDepth,r):_u(a,e.startState.selection),new Uu(0==o?n.rest:a,0==o?a:n.rest)}let s=e.annotation(vu);if("full"!=s&&"before"!=s||(t=t.isolate()),!1===e.annotation(oe.addToHistory))return e.changes.empty?t:t.addMapping(e.changes.desc);let r=qu.fromTransaction(e),o=e.annotation(oe.time),a=e.annotation(oe.userEvent);return r?t=t.addChanges(r,o,a,i,e):e.selection&&(t=t.addSelection(e.startState.selection,o,a,i.newGroupDelay)),"full"!=s&&"after"!=s||(t=t.isolate()),t},toJSON:t=>({done:t.done.map((t=>t.toJSON())),undone:t.undone.map((t=>t.toJSON()))}),fromJSON:t=>new Uu(t.done.map(qu.fromJSON),t.undone.map(qu.fromJSON))});class qu{constructor(t,e,i,n,s){this.changes=t,this.effects=e,this.mapped=i,this.startSelection=n,this.selectionsAfter=s;}setSelAfter(t){return new qu(this.changes,this.effects,this.mapped,this.startSelection,t)}toJSON(){var t,e,i;return {changes:null===(t=this.changes)||void 0===t?void 0:t.toJSON(),mapped:null===(e=this.mapped)||void 0===e?void 0:e.toJSON(),startSelection:null===(i=this.startSelection)||void 0===i?void 0:i.toJSON(),selectionsAfter:this.selectionsAfter.map((t=>t.toJSON()))}}static fromJSON(t){return new qu(t.changes&&wt.fromJSON(t.changes),[],t.mapped&&mt.fromJSON(t.mapped),t.startSelection&&kt.fromJSON(t.startSelection),t.selectionsAfter.map(kt.fromJSON))}static fromTransaction(t,e){let i=Mu;for(let e of t.startState.facet(Pu)){let n=e(t);n.length&&(i=i.concat(n));}return !i.length&&t.changes.empty?null:new qu(t.changes.invert(t.startState.doc),i,void 0,e||t.startState.selection,Mu)}static selection(t){return new qu(void 0,Mu,void 0,void 0,t)}}function Yu(t,e,i,n){let s=e+1>i+20?e-i-1:0,r=t.slice(s,e);return r.push(n),r}function Wu(t,e){return t.length?e.length?t.concat(e):t:e}const Mu=[],ju=200;function _u(t,e){if(t.length){let i=t[t.length-1],n=i.selectionsAfter.slice(Math.max(0,i.selectionsAfter.length-ju));return n.length&&n[n.length-1].eq(e)?t:(n.push(e),Yu(t,t.length-1,1e9,i.setSelAfter(n)))}return [qu.selection([e])]}function Eu(t){let e=t[t.length-1],i=t.slice();return i[t.length-1]=e.setSelAfter(e.selectionsAfter.slice(0,e.selectionsAfter.length-1)),i}function zu(t,e){if(!t.length)return t;let i=t.length,n=Mu;for(;i;){let s=Vu(t[i-1],e,n);if(s.changes&&!s.changes.empty||s.effects.length){let e=t.slice(0,i);return e[i-1]=s,e}e=s.mapped,i--,n=s.selectionsAfter;}return n.length?[qu.selection(n)]:Mu}function Vu(t,e,i){let n=Wu(t.selectionsAfter.length?t.selectionsAfter.map((t=>t.map(e))):Mu,i);if(!t.changes)return qu.selection(n);let s=t.changes.map(e),r=e.mapDesc(t.changes,!0),o=t.mapped?t.mapped.composeDesc(r):r;return new qu(s,re.mapEffects(t.effects,e),o,t.startSelection.map(r),n)}const Du=/^(input\.type|delete)($|\.)/;class Uu{constructor(t,e,i=0,n=void 0){this.done=t,this.undone=e,this.prevTime=i,this.prevUserEvent=n;}isolate(){return this.prevTime?new Uu(this.done,this.undone):this}addChanges(t,e,i,n,s){let r=this.done,o=r[r.length-1];return r=o&&o.changes&&!o.changes.empty&&t.changes&&(!i||Du.test(i))&&(!o.selectionsAfter.length&&e-this.prevTime<n.newGroupDelay&&n.joinToEvent(s,function(t,e){let i=[],n=!1;return t.iterChangedRanges(((t,e)=>i.push(t,e))),e.iterChangedRanges(((t,e,s,r)=>{for(let t=0;t<i.length;){let e=i[t++],o=i[t++];r>=e&&s<=o&&(n=!0);}})),n}(o.changes,t.changes))||"input.type.compose"==i)?Yu(r,r.length-1,n.minDepth,new qu(t.changes.compose(o.changes),Wu(t.effects,o.effects),o.mapped,o.startSelection,Mu)):Yu(r,r.length,n.minDepth,t),new Uu(r,Mu,e,i)}addSelection(t,e,i,n){let s=this.done.length?this.done[this.done.length-1].selectionsAfter:Mu;return s.length>0&&e-this.prevTime<n&&i==this.prevUserEvent&&i&&/^select($|\.)/.test(i)&&(r=s[s.length-1],o=t,r.ranges.length==o.ranges.length&&0===r.ranges.filter(((t,e)=>t.empty!=o.ranges[e].empty)).length)?this:new Uu(_u(this.done,t),this.undone,e,i);var r,o;}addMapping(t){return new Uu(zu(this.done,t),zu(this.undone,t),this.prevTime,this.prevUserEvent)}pop(t,e,i){let n=0==t?this.done:this.undone;if(0==n.length)return null;let s=n[n.length-1];if(i&&s.selectionsAfter.length)return e.update({selection:s.selectionsAfter[s.selectionsAfter.length-1],annotations:yu.of({side:t,rest:Eu(n)}),userEvent:0==t?"select.undo":"select.redo",scrollIntoView:!0});if(s.changes){let i=1==n.length?Mu:n.slice(0,n.length-1);return s.mapped&&(i=zu(i,s.mapped)),e.update({changes:s.changes,selection:s.startSelection,effects:s.effects,annotations:yu.of({side:t,rest:i}),filter:!1,userEvent:0==t?"undo":"redo",scrollIntoView:!0})}return null}}Uu.empty=new Uu(Mu,Mu);function Gu(t,e){return kt.create(t.ranges.map(e),t.mainIndex)}function Bu(t,e){return t.update({selection:e,scrollIntoView:!0,userEvent:"select"})}function Iu({state:t,dispatch:e},i){let n=Gu(t.selection,i);return !n.eq(t.selection)&&(e(Bu(t,n)),!0)}function Lu(t,e){return kt.cursor(e?t.to:t.from)}function Fu(t,e){return Iu(t,(i=>i.empty?t.moveByChar(i,e):Lu(i,e)))}function Hu(t){return t.textDirectionAt(t.state.selection.main.head)==sn.LTR}const Ju=t=>Fu(t,!Hu(t)),Ku=t=>Fu(t,Hu(t));function tf(t,e){return Iu(t,(i=>i.empty?t.moveByGroup(i,e):Lu(i,e)))}const ef=t=>tf(t,!Hu(t)),nf=t=>tf(t,Hu(t));function lf(t,e){return Iu(t,(i=>{if(!i.empty)return Lu(i,e);let n=t.moveVertically(i,e);return n.head!=i.head?n:t.moveToLineBoundary(i,e)}))}const hf=t=>lf(t,!1),cf=t=>lf(t,!0);function Of(t){let e,i=t.scrollDOM.clientHeight<t.scrollDOM.scrollHeight-2,n=0,s=0;if(i){for(let e of t.state.facet(Yr.scrollMargins)){let i=e(t);(null==i?void 0:i.top)&&(n=Math.max(null==i?void 0:i.top,n)),(null==i?void 0:i.bottom)&&(s=Math.max(null==i?void 0:i.bottom,s));}e=t.scrollDOM.clientHeight-n-s;}else e=(t.dom.ownerDocument.defaultView||window).innerHeight;return {marginTop:n,marginBottom:s,selfScroll:i,height:Math.max(t.defaultLineHeight,e-5)}}function uf(t,e){let i,n=Of(t),{state:s}=t,r=Gu(s.selection,(i=>i.empty?t.moveVertically(i,e,n.height):Lu(i,e)));if(r.eq(s.selection))return !1;if(n.selfScroll){let e=t.coordsAtPos(s.selection.main.head),o=t.scrollDOM.getBoundingClientRect(),a=o.top+n.marginTop,l=o.bottom-n.marginBottom;e&&e.top>a&&e.bottom<l&&(i=Yr.scrollIntoView(r.main.head,{y:"start",yMargin:e.top-a}));}return t.dispatch(Bu(s,r),{effects:i}),!0}const ff=t=>uf(t,!1),df=t=>uf(t,!0);function pf(t,e,i){let n=t.lineBlockAt(e.head),s=t.moveToLineBoundary(e,i);if(s.head==e.head&&s.head!=(i?n.to:n.from)&&(s=t.moveToLineBoundary(e,i,!1)),!i&&s.head==n.from&&n.length){let i=/^\s*/.exec(t.state.sliceDoc(n.from,Math.min(n.from+100,n.to)))[0].length;i&&e.head!=n.from+i&&(s=kt.cursor(n.from+i));}return s}function bf(t,e){let i=Gu(t.state.selection,(t=>{let i=e(t);return kt.range(t.anchor,i.head,i.goalColumn,i.bidiLevel||void 0)}));return !i.eq(t.state.selection)&&(t.dispatch(Bu(t.state,i)),!0)}function Sf(t,e){return bf(t,(i=>t.moveByChar(i,e)))}const Qf=t=>Sf(t,!Hu(t)),xf=t=>Sf(t,Hu(t));function yf(t,e){return bf(t,(i=>t.moveByGroup(i,e)))}const vf=t=>yf(t,!Hu(t)),Pf=t=>yf(t,Hu(t));function Zf(t,e){return bf(t,(i=>t.moveVertically(i,e)))}const Xf=t=>Zf(t,!1),Tf=t=>Zf(t,!0);function Rf(t,e){return bf(t,(i=>t.moveVertically(i,e,Of(t).height)))}const Af=t=>Rf(t,!1),Cf=t=>Rf(t,!0),qf=({state:t,dispatch:e})=>(e(Bu(t,{anchor:0})),!0),Yf=({state:t,dispatch:e})=>(e(Bu(t,{anchor:t.doc.length})),!0),Wf=({state:t,dispatch:e})=>(e(Bu(t,{anchor:t.selection.main.anchor,head:0})),!0),Mf=({state:t,dispatch:e})=>(e(Bu(t,{anchor:t.selection.main.anchor,head:t.doc.length})),!0);function jf(t,e){if(t.state.readOnly)return !1;let i="delete.selection",{state:n}=t,s=n.changeByRange((n=>{let{from:s,to:r}=n;if(s==r){let o=e(n);o<s?(i="delete.backward",o=_f(t,o,!1)):o>s&&(i="delete.forward",o=_f(t,o,!0)),s=Math.min(s,o),r=Math.max(r,o);}else s=_f(t,s,!1),r=_f(t,r,!0);return s==r?{range:n}:{changes:{from:s,to:r},range:kt.cursor(s,s<n.head?-1:1)}}));return !s.changes.empty&&(t.dispatch(n.update(s,{scrollIntoView:!0,userEvent:i,effects:"delete.selection"==i?Yr.announce.of(n.phrase("Selection deleted")):void 0})),!0)}function _f(t,e,i){if(t instanceof Yr)for(let n of t.state.facet(Yr.atomicRanges).map((e=>e(t))))n.between(e,e,((t,n)=>{t<e&&n>e&&(e=i?n:t);}));return e}const Ef=(t,e)=>jf(t,(i=>{let n,s,r=i.from,{state:o}=t,a=o.doc.lineAt(r);if(!e&&r>a.from&&r<a.from+200&&!/[^ \t]/.test(n=a.text.slice(0,r-a.from))){if("\t"==n[n.length-1])return r-1;let t=Ye(n,o.tabSize)%nl(o)||nl(o);for(let e=0;e<t&&" "==n[n.length-1-e];e++)r--;s=r;}else s=at(a.text,r-a.from,e,e)+a.from,s==r&&a.number!=(e?o.doc.lines:1)&&(s+=e?1:-1);return s})),zf=t=>Ef(t,!1),Vf=t=>Ef(t,!0),Df=(t,e)=>jf(t,(i=>{let n=i.head,{state:s}=t,r=s.doc.lineAt(n),o=s.charCategorizer(n);for(let t=null;;){if(n==(e?r.to:r.from)){n==i.head&&r.number!=(e?s.doc.lines:1)&&(n+=e?1:-1);break}let a=at(r.text,n-r.from,e)+r.from,l=r.text.slice(Math.min(n,a)-r.from,Math.max(n,a)-r.from),h=o(l);if(null!=t&&h!=t)break;" "==l&&n==i.head||(t=h),n=a;}return n})),Uf=t=>Df(t,!1);const Nf=Gf();function Gf(t){return ({state:e,dispatch:i})=>{if(e.readOnly)return !1;let s=e.changeByRange((i=>{let{from:s,to:r}=i,o=e.doc.lineAt(s),a=s==r&&function(t,e){if(/\(\)|\[\]|\{\}/.test(t.sliceDoc(e-1,e+1)))return {from:e,to:e};let i,s=Ea(t).resolveInner(e),r=s.childBefore(e),o=s.childAfter(e);return r&&o&&r.to<=e&&o.from>=e&&(i=r.type.prop(n.closedBy))&&i.indexOf(o.name)>-1&&t.doc.lineAt(r.to).from==t.doc.lineAt(o.from).from&&!/\S/.test(t.sliceDoc(r.to,o.from))?{from:r.to,to:o.from}:null}(e,s);let l=new ol(e,{simulateBreak:s,simulateDoubleBreak:!!a}),h=rl(l,s);for(null==h&&(h=Ye(/^\s*/.exec(e.doc.lineAt(s).text)[0],e.tabSize));r<o.to&&/\s/.test(o.text[r-o.from]);)r++;a?({from:s,to:r}=a):s>o.from&&s<o.from+100&&!/\S/.test(o.text.slice(0,s))&&(s=o.from);let c=["",sl(e,h)];return a&&c.push(sl(e,l.lineIndent(o.from,-1))),{changes:{from:s,to:r,insert:B.of(c)},range:kt.cursor(s+1+c[1].length)}}));return i(e.update(s,{scrollIntoView:!0,userEvent:"input"})),!0}}[{key:"ArrowLeft",run:Ju,shift:Qf,preventDefault:!0},{key:"Mod-ArrowLeft",mac:"Alt-ArrowLeft",run:ef,shift:vf,preventDefault:!0},{mac:"Cmd-ArrowLeft",run:t=>Iu(t,(e=>pf(t,e,!Hu(t)))),shift:t=>bf(t,(e=>pf(t,e,!Hu(t)))),preventDefault:!0},{key:"ArrowRight",run:Ku,shift:xf,preventDefault:!0},{key:"Mod-ArrowRight",mac:"Alt-ArrowRight",run:nf,shift:Pf,preventDefault:!0},{mac:"Cmd-ArrowRight",run:t=>Iu(t,(e=>pf(t,e,Hu(t)))),shift:t=>bf(t,(e=>pf(t,e,Hu(t)))),preventDefault:!0},{key:"ArrowUp",run:hf,shift:Xf,preventDefault:!0},{mac:"Cmd-ArrowUp",run:qf,shift:Wf},{mac:"Ctrl-ArrowUp",run:ff,shift:Af},{key:"ArrowDown",run:cf,shift:Tf,preventDefault:!0},{mac:"Cmd-ArrowDown",run:Yf,shift:Mf},{mac:"Ctrl-ArrowDown",run:df,shift:Cf},{key:"PageUp",run:ff,shift:Af},{key:"PageDown",run:df,shift:Cf},{key:"Home",run:t=>Iu(t,(e=>pf(t,e,!1))),shift:t=>bf(t,(e=>pf(t,e,!1))),preventDefault:!0},{key:"Mod-Home",run:qf,shift:Wf},{key:"End",run:t=>Iu(t,(e=>pf(t,e,!0))),shift:t=>bf(t,(e=>pf(t,e,!0))),preventDefault:!0},{key:"Mod-End",run:Yf,shift:Mf},{key:"Enter",run:Nf},{key:"Mod-a",run:({state:t,dispatch:e})=>(e(t.update({selection:{anchor:0,head:t.doc.length},userEvent:"select"})),!0)},{key:"Backspace",run:zf,shift:zf},{key:"Delete",run:Vf},{key:"Mod-Backspace",mac:"Alt-Backspace",run:Uf},{key:"Mod-Delete",mac:"Alt-Delete",run:t=>Df(t,!0)},{mac:"Mod-Backspace",run:t=>jf(t,(e=>{let i=t.moveToLineBoundary(e,!1).head;return e.head>i?i:Math.max(0,e.head-1)}))},{mac:"Mod-Delete",run:t=>jf(t,(e=>{let i=t.moveToLineBoundary(e,!0).head;return e.head<i?i:Math.min(t.state.doc.length,e.head+1)}))}].concat([{key:"Ctrl-b",run:Ju,shift:Qf,preventDefault:!0},{key:"Ctrl-f",run:Ku,shift:xf},{key:"Ctrl-p",run:hf,shift:Xf},{key:"Ctrl-n",run:cf,shift:Tf},{key:"Ctrl-a",run:t=>Iu(t,(e=>kt.cursor(t.lineBlockAt(e.head).from,1))),shift:t=>bf(t,(e=>kt.cursor(t.lineBlockAt(e.head).from)))},{key:"Ctrl-e",run:t=>Iu(t,(e=>kt.cursor(t.lineBlockAt(e.head).to,-1))),shift:t=>bf(t,(e=>kt.cursor(t.lineBlockAt(e.head).to)))},{key:"Ctrl-d",run:Vf},{key:"Ctrl-h",run:zf},{key:"Ctrl-k",run:t=>jf(t,(e=>{let i=t.lineBlockAt(e.head).to;return e.head<i?i:Math.min(t.state.doc.length,e.head+1)}))},{key:"Ctrl-Alt-h",run:Uf},{key:"Ctrl-o",run:({state:t,dispatch:e})=>{if(t.readOnly)return !1;let i=t.changeByRange((t=>({changes:{from:t.from,to:t.to,insert:B.of(["",""])},range:kt.cursor(t.from)})));return e(t.update(i,{scrollIntoView:!0,userEvent:"input"})),!0}},{key:"Ctrl-t",run:({state:t,dispatch:e})=>{if(t.readOnly)return !1;let i=t.changeByRange((e=>{if(!e.empty||0==e.from||e.from==t.doc.length)return {range:e};let i=e.from,n=t.doc.lineAt(i),s=i==n.from?i-1:at(n.text,i-n.from,!1)+n.from,r=i==n.to?i+1:at(n.text,i-n.from,!0)+n.from;return {changes:{from:s,to:r,insert:t.doc.slice(i,r).append(t.doc.slice(s,i))},range:kt.cursor(r)}}));return !i.changes.empty&&(e(t.update(i,{scrollIntoView:!0,userEvent:"move.character"})),!0)}},{key:"Ctrl-v",run:df}].map((t=>({mac:t.key,run:t.run,shift:t.shift}))));const Hf=20,Jf=22,Kf=23,td=24,ed=26,id=27,nd=28,sd=31,rd=34,od=37,ad={area:!0,base:!0,br:!0,col:!0,command:!0,embed:!0,frame:!0,hr:!0,img:!0,input:!0,keygen:!0,link:!0,meta:!0,param:!0,source:!0,track:!0,wbr:!0,menuitem:!0},ld={dd:!0,li:!0,optgroup:!0,option:!0,p:!0,rp:!0,rt:!0,tbody:!0,td:!0,tfoot:!0,th:!0,tr:!0},hd={dd:{dd:!0,dt:!0},dt:{dd:!0,dt:!0},li:{li:!0},option:{option:!0,optgroup:!0},optgroup:{optgroup:!0},p:{address:!0,article:!0,aside:!0,blockquote:!0,dir:!0,div:!0,dl:!0,fieldset:!0,footer:!0,form:!0,h1:!0,h2:!0,h3:!0,h4:!0,h5:!0,h6:!0,header:!0,hgroup:!0,hr:!0,menu:!0,nav:!0,ol:!0,p:!0,pre:!0,section:!0,table:!0,ul:!0},rp:{rp:!0,rt:!0},rt:{rp:!0,rt:!0},tbody:{tbody:!0,tfoot:!0},td:{td:!0,th:!0},tfoot:{tbody:!0},th:{td:!0,th:!0},thead:{tbody:!0,tfoot:!0},tr:{tr:!0}};function cd(t){return 9==t||10==t||13==t||32==t}let Od=null,ud=null,fd=0;function dd(t,e){let i=t.pos+e;if(fd==i&&ud==t)return Od;let n=t.peek(e);for(;cd(n);)n=t.peek(++e);let s="";for(;45==(r=n)||46==r||58==r||r>=65&&r<=90||95==r||r>=97&&r<=122||r>=161;)s+=String.fromCharCode(n),n=t.peek(++e);var r;return ud=t,fd=i,Od=s?s.toLowerCase():n==pd||n==gd?void 0:null}const pd=63,gd=33;function md(t,e){this.name=t,this.parent=e,this.hash=e?e.hash:0;for(let e=0;e<t.length;e++)this.hash+=(this.hash<<4)+t.charCodeAt(e)+(t.charCodeAt(e)<<8);}const wd=[6,10,7,8,9],bd=new oc({start:null,shift:(t,e,i,n)=>wd.indexOf(e)>-1?new md(dd(n,1)||"",t):t,reduce:(t,e)=>e==Hf&&t?t.parent:t,reuse(t,e,i,n){let s=e.type.id;return 6==s||36==s?new md(dd(n,1)||"",t):t},hash:t=>t?t.hash:0,strict:!1}),Sd=new Bh(((t,e)=>{if(60!=t.next)return void(t.next<0&&e.context&&t.acceptToken(57));t.advance();let i=47==t.next;i&&t.advance();let n=dd(t,0);if(void 0===n)return;if(!n)return t.acceptToken(i?14:6);let s=e.context?e.context.name:null;if(i){if(n==s)return t.acceptToken(11);if(s&&ld[s])return t.acceptToken(57,-2);if(e.dialectEnabled(0))return t.acceptToken(12);for(let t=e.context;t;t=t.parent)if(t.name==n)return;t.acceptToken(13);}else {if("script"==n)return t.acceptToken(7);if("style"==n)return t.acceptToken(8);if("textarea"==n)return t.acceptToken(9);if(ad.hasOwnProperty(n))return t.acceptToken(10);s&&hd[s]&&hd[s][n]?t.acceptToken(57,-1):t.acceptToken(6);}}),{contextual:!0}),Qd=new Bh((t=>{for(let e=0,i=0;;i++){if(t.next<0){i&&t.acceptToken(58);break}if(45==t.next)e++;else {if(62==t.next&&e>=2){i>=3&&t.acceptToken(58,-2);break}e=0;}t.advance();}}));const xd=new Bh(((t,e)=>{if(47==t.next&&62==t.peek(1)){let i=e.dialectEnabled(1)||function(t){for(;t;t=t.parent)if("svg"==t.name||"math"==t.name)return !0;return !1}(e.context);t.acceptToken(i?5:4,2);}else 62==t.next&&t.acceptToken(4,1);}));function yd(t,e,i){let n=2+t.length;return new Bh((s=>{for(let r=0,o=0,a=0;;a++){if(s.next<0){a&&s.acceptToken(e);break}if(0==r&&60==s.next||1==r&&47==s.next||r>=2&&r<n&&s.next==t.charCodeAt(r-2))r++,o++;else if(2!=r&&r!=n||!cd(s.next)){if(r==n&&62==s.next){a>o?s.acceptToken(e,-o):s.acceptToken(i,-(o-2));break}if((10==s.next||13==s.next)&&a){s.acceptToken(e,1);break}r=o=0;}else o++;s.advance();}}))}const vd=yd("script",54,1),Pd=yd("style",55,2),kd=yd("textarea",56,3),$d=Oa({"Text RawText":Aa.content,"StartTag StartCloseTag SelfClosingEndTag EndTag":Aa.angleBracket,TagName:Aa.tagName,"MismatchedCloseTag/TagName":[Aa.tagName,Aa.invalid],AttributeName:Aa.attributeName,"AttributeValue UnquotedAttributeValue":Aa.attributeValue,Is:Aa.definitionOperator,"EntityReference CharacterReference":Aa.character,Comment:Aa.blockComment,ProcessingInst:Aa.processingInstruction,DoctypeDecl:Aa.documentMeta}),Zd=ac.deserialize({version:14,states:",xOVO!rOOO!WQ#tO'#CqO!]Q#tO'#CzO!bQ#tO'#C}O!gQ#tO'#DQO!lQ#tO'#DSO!qOaO'#CpO!|ObO'#CpO#XOdO'#CpO$eO!rO'#CpOOO`'#Cp'#CpO$lO$fO'#DTO$tQ#tO'#DVO$yQ#tO'#DWOOO`'#Dk'#DkOOO`'#DY'#DYQVO!rOOO%OQ&rO,59]O%WQ&rO,59fO%`Q&rO,59iO%hQ&rO,59lO%sQ&rO,59nOOOa'#D^'#D^O%{OaO'#CxO&WOaO,59[OOOb'#D_'#D_O&`ObO'#C{O&kObO,59[OOOd'#D`'#D`O&sOdO'#DOO'OOdO,59[OOO`'#Da'#DaO'WO!rO,59[O'_Q#tO'#DROOO`,59[,59[OOOp'#Db'#DbO'dO$fO,59oOOO`,59o,59oO'lQ#|O,59qO'qQ#|O,59rOOO`-E7W-E7WO'vQ&rO'#CsOOQW'#DZ'#DZO(UQ&rO1G.wOOOa1G.w1G.wO(^Q&rO1G/QOOOb1G/Q1G/QO(fQ&rO1G/TOOOd1G/T1G/TO(nQ&rO1G/WOOO`1G/W1G/WOOO`1G/Y1G/YO(yQ&rO1G/YOOOa-E7[-E7[O)RQ#tO'#CyOOO`1G.v1G.vOOOb-E7]-E7]O)WQ#tO'#C|OOOd-E7^-E7^O)]Q#tO'#DPOOO`-E7_-E7_O)bQ#|O,59mOOOp-E7`-E7`OOO`1G/Z1G/ZOOO`1G/]1G/]OOO`1G/^1G/^O)gQ,UO,59_OOQW-E7X-E7XOOOa7+$c7+$cOOOb7+$l7+$lOOOd7+$o7+$oOOO`7+$r7+$rOOO`7+$t7+$tO)rQ#|O,59eO)wQ#|O,59hO)|Q#|O,59kOOO`1G/X1G/XO*RO7[O'#CvO*dOMhO'#CvOOQW1G.y1G.yOOO`1G/P1G/POOO`1G/S1G/SOOO`1G/V1G/VOOOO'#D['#D[O*uO7[O,59bOOQW,59b,59bOOOO'#D]'#D]O+WOMhO,59bOOOO-E7Y-E7YOOQW1G.|1G.|OOOO-E7Z-E7Z",stateData:"+s~O!^OS~OUSOVPOWQOXROYTO[]O][O^^O`^Oa^Ob^Oc^Ox^O{_O!dZO~OfaO~OfbO~OfcO~OfdO~OfeO~O!WfOPlP!ZlP~O!XiOQoP!ZoP~O!YlORrP!ZrP~OUSOVPOWQOXROYTOZqO[]O][O^^O`^Oa^Ob^Oc^Ox^O!dZO~O!ZrO~P#dO![sO!euO~OfvO~OfwO~OS|OhyO~OS!OOhyO~OS!QOhyO~OS!SOT!TOhyO~OS!TOhyO~O!WfOPlX!ZlX~OP!WO!Z!XO~O!XiOQoX!ZoX~OQ!ZO!Z!XO~O!YlORrX!ZrX~OR!]O!Z!XO~O!Z!XO~P#dOf!_O~O![sO!e!aO~OS!bO~OS!cO~Oi!dOSgXhgXTgX~OS!fOhyO~OS!gOhyO~OS!hOhyO~OS!iOT!jOhyO~OS!jOhyO~Of!kO~Of!lO~Of!mO~OS!nO~Ok!qO!`!oO!b!pO~OS!rO~OS!sO~OS!tO~Oa!uOb!uOc!uO!`!wO!a!uO~Oa!xOb!xOc!xO!b!wO!c!xO~Oa!uOb!uOc!uO!`!{O!a!uO~Oa!xOb!xOc!xO!b!{O!c!xO~OT~bac!dx{!d~",goto:"%p!`PPPPPPPPPPPPPPPPPPPP!a!gP!mPP!yP!|#P#S#Y#]#`#f#i#l#r#x!aP!a!aP$O$U$l$r$x%O%U%[%bPPPPPPPP%hX^OX`pXUOX`pezabcde{}!P!R!UR!q!dRhUR!XhXVOX`pRkVR!XkXWOX`pRnWR!XnXXOX`pQrXR!XpXYOX`pQ`ORx`Q{aQ}bQ!PcQ!RdQ!UeZ!e{}!P!R!UQ!v!oR!z!vQ!y!pR!|!yQgUR!VgQjVR!YjQmWR![mQpXR!^pQtZR!`tS_O`ToXp",nodeNames:"⚠ StartCloseTag StartCloseTag StartCloseTag EndTag SelfClosingEndTag StartTag StartTag StartTag StartTag StartTag StartCloseTag StartCloseTag StartCloseTag IncompleteCloseTag Document Text EntityReference CharacterReference InvalidEntity Element OpenTag TagName Attribute AttributeName Is AttributeValue UnquotedAttributeValue ScriptText CloseTag OpenTag StyleText CloseTag OpenTag TextareaText CloseTag OpenTag CloseTag SelfClosingTag Comment ProcessingInst MismatchedCloseTag CloseTag DoctypeDecl",maxTerm:67,context:bd,nodeProps:[["closedBy",-10,1,2,3,7,8,9,10,11,12,13,"EndTag",6,"EndTag SelfClosingEndTag",-4,21,30,33,36,"CloseTag"],["openedBy",4,"StartTag StartCloseTag",5,"StartTag",-4,29,32,35,37,"OpenTag"],["group",-9,14,17,18,19,20,39,40,41,42,"Entity",16,"Entity TextContent",-3,28,31,34,"TextContent Entity"],["isolate",-11,21,29,30,32,33,35,36,37,38,41,42,"ltr",-3,26,27,39,""]],propSources:[$d],skippedNodes:[0],repeatNodeCount:9,tokenData:"!<p!aR!YOX$qXY,QYZ,QZ[$q[]&X]^,Q^p$qpq,Qqr-_rs3_sv-_vw3}wxHYx}-_}!OH{!O!P-_!P!Q$q!Q![-_![!]Mz!]!^-_!^!_!$S!_!`!;x!`!a&X!a!c-_!c!}Mz!}#R-_#R#SMz#S#T1k#T#oMz#o#s-_#s$f$q$f%W-_%W%oMz%o%p-_%p&aMz&a&b-_&b1pMz1p4U-_4U4dMz4d4e-_4e$ISMz$IS$I`-_$I`$IbMz$Ib$Kh-_$Kh%#tMz%#t&/x-_&/x&EtMz&Et&FV-_&FV;'SMz;'S;:j!#|;:j;=`3X<%l?&r-_?&r?AhMz?Ah?BY$q?BY?MnMz?MnO$q!Z$|c`PkW!a`!cpOX$qXZ&XZ[$q[^&X^p$qpq&Xqr$qrs&}sv$qvw+Pwx(tx!^$q!^!_*V!_!a&X!a#S$q#S#T&X#T;'S$q;'S;=`+z<%lO$q!R&bX`P!a`!cpOr&Xrs&}sv&Xwx(tx!^&X!^!_*V!_;'S&X;'S;=`*y<%lO&Xq'UV`P!cpOv&}wx'kx!^&}!^!_(V!_;'S&};'S;=`(n<%lO&}P'pT`POv'kw!^'k!_;'S'k;'S;=`(P<%lO'kP(SP;=`<%l'kp([S!cpOv(Vx;'S(V;'S;=`(h<%lO(Vp(kP;=`<%l(Vq(qP;=`<%l&}a({W`P!a`Or(trs'ksv(tw!^(t!^!_)e!_;'S(t;'S;=`*P<%lO(t`)jT!a`Or)esv)ew;'S)e;'S;=`)y<%lO)e`)|P;=`<%l)ea*SP;=`<%l(t!Q*^V!a`!cpOr*Vrs(Vsv*Vwx)ex;'S*V;'S;=`*s<%lO*V!Q*vP;=`<%l*V!R*|P;=`<%l&XW+UYkWOX+PZ[+P^p+Pqr+Psw+Px!^+P!a#S+P#T;'S+P;'S;=`+t<%lO+PW+wP;=`<%l+P!Z+}P;=`<%l$q!a,]``P!a`!cp!^^OX&XXY,QYZ,QZ]&X]^,Q^p&Xpq,Qqr&Xrs&}sv&Xwx(tx!^&X!^!_*V!_;'S&X;'S;=`*y<%lO&X!_-ljhS`PkW!a`!cpOX$qXZ&XZ[$q[^&X^p$qpq&Xqr-_rs&}sv-_vw/^wx(tx!P-_!P!Q$q!Q!^-_!^!_*V!_!a&X!a#S-_#S#T1k#T#s-_#s$f$q$f;'S-_;'S;=`3X<%l?Ah-_?Ah?BY$q?BY?Mn-_?MnO$q[/ebhSkWOX+PZ[+P^p+Pqr/^sw/^x!P/^!P!Q+P!Q!^/^!a#S/^#S#T0m#T#s/^#s$f+P$f;'S/^;'S;=`1e<%l?Ah/^?Ah?BY+P?BY?Mn/^?MnO+PS0rXhSqr0msw0mx!P0m!Q!^0m!a#s0m$f;'S0m;'S;=`1_<%l?Ah0m?BY?Mn0mS1bP;=`<%l0m[1hP;=`<%l/^!V1vchS`P!a`!cpOq&Xqr1krs&}sv1kvw0mwx(tx!P1k!P!Q&X!Q!^1k!^!_*V!_!a&X!a#s1k#s$f&X$f;'S1k;'S;=`3R<%l?Ah1k?Ah?BY&X?BY?Mn1k?MnO&X!V3UP;=`<%l1k!_3[P;=`<%l-_!Z3hV!`h`P!cpOv&}wx'kx!^&}!^!_(V!_;'S&};'S;=`(n<%lO&}!_4WihSkWc!ROX5uXZ7SZ[5u[^7S^p5uqr8trs7Sst>]tw8twx7Sx!P8t!P!Q5u!Q!]8t!]!^/^!^!a7S!a#S8t#S#T;{#T#s8t#s$f5u$f;'S8t;'S;=`>V<%l?Ah8t?Ah?BY5u?BY?Mn8t?MnO5u!Z5zbkWOX5uXZ7SZ[5u[^7S^p5uqr5urs7Sst+Ptw5uwx7Sx!]5u!]!^7w!^!a7S!a#S5u#S#T7S#T;'S5u;'S;=`8n<%lO5u!R7VVOp7Sqs7St!]7S!]!^7l!^;'S7S;'S;=`7q<%lO7S!R7qOa!R!R7tP;=`<%l7S!Z8OYkWa!ROX+PZ[+P^p+Pqr+Psw+Px!^+P!a#S+P#T;'S+P;'S;=`+t<%lO+P!Z8qP;=`<%l5u!_8{ihSkWOX5uXZ7SZ[5u[^7S^p5uqr8trs7Sst/^tw8twx7Sx!P8t!P!Q5u!Q!]8t!]!^:j!^!a7S!a#S8t#S#T;{#T#s8t#s$f5u$f;'S8t;'S;=`>V<%l?Ah8t?Ah?BY5u?BY?Mn8t?MnO5u!_:sbhSkWa!ROX+PZ[+P^p+Pqr/^sw/^x!P/^!P!Q+P!Q!^/^!a#S/^#S#T0m#T#s/^#s$f+P$f;'S/^;'S;=`1e<%l?Ah/^?Ah?BY+P?BY?Mn/^?MnO+P!V<QchSOp7Sqr;{rs7Sst0mtw;{wx7Sx!P;{!P!Q7S!Q!];{!]!^=]!^!a7S!a#s;{#s$f7S$f;'S;{;'S;=`>P<%l?Ah;{?Ah?BY7S?BY?Mn;{?MnO7S!V=dXhSa!Rqr0msw0mx!P0m!Q!^0m!a#s0m$f;'S0m;'S;=`1_<%l?Ah0m?BY?Mn0m!V>SP;=`<%l;{!_>YP;=`<%l8t!_>dhhSkWOX@OXZAYZ[@O[^AY^p@OqrBwrsAYswBwwxAYx!PBw!P!Q@O!Q!]Bw!]!^/^!^!aAY!a#SBw#S#TE{#T#sBw#s$f@O$f;'SBw;'S;=`HS<%l?AhBw?Ah?BY@O?BY?MnBw?MnO@O!Z@TakWOX@OXZAYZ[@O[^AY^p@Oqr@OrsAYsw@OwxAYx!]@O!]!^Az!^!aAY!a#S@O#S#TAY#T;'S@O;'S;=`Bq<%lO@O!RA]UOpAYq!]AY!]!^Ao!^;'SAY;'S;=`At<%lOAY!RAtOb!R!RAwP;=`<%lAY!ZBRYkWb!ROX+PZ[+P^p+Pqr+Psw+Px!^+P!a#S+P#T;'S+P;'S;=`+t<%lO+P!ZBtP;=`<%l@O!_COhhSkWOX@OXZAYZ[@O[^AY^p@OqrBwrsAYswBwwxAYx!PBw!P!Q@O!Q!]Bw!]!^Dj!^!aAY!a#SBw#S#TE{#T#sBw#s$f@O$f;'SBw;'S;=`HS<%l?AhBw?Ah?BY@O?BY?MnBw?MnO@O!_DsbhSkWb!ROX+PZ[+P^p+Pqr/^sw/^x!P/^!P!Q+P!Q!^/^!a#S/^#S#T0m#T#s/^#s$f+P$f;'S/^;'S;=`1e<%l?Ah/^?Ah?BY+P?BY?Mn/^?MnO+P!VFQbhSOpAYqrE{rsAYswE{wxAYx!PE{!P!QAY!Q!]E{!]!^GY!^!aAY!a#sE{#s$fAY$f;'SE{;'S;=`G|<%l?AhE{?Ah?BYAY?BY?MnE{?MnOAY!VGaXhSb!Rqr0msw0mx!P0m!Q!^0m!a#s0m$f;'S0m;'S;=`1_<%l?Ah0m?BY?Mn0m!VHPP;=`<%lE{!_HVP;=`<%lBw!ZHcW!bx`P!a`Or(trs'ksv(tw!^(t!^!_)e!_;'S(t;'S;=`*P<%lO(t!aIYlhS`PkW!a`!cpOX$qXZ&XZ[$q[^&X^p$qpq&Xqr-_rs&}sv-_vw/^wx(tx}-_}!OKQ!O!P-_!P!Q$q!Q!^-_!^!_*V!_!a&X!a#S-_#S#T1k#T#s-_#s$f$q$f;'S-_;'S;=`3X<%l?Ah-_?Ah?BY$q?BY?Mn-_?MnO$q!aK_khS`PkW!a`!cpOX$qXZ&XZ[$q[^&X^p$qpq&Xqr-_rs&}sv-_vw/^wx(tx!P-_!P!Q$q!Q!^-_!^!_*V!_!`&X!`!aMS!a#S-_#S#T1k#T#s-_#s$f$q$f;'S-_;'S;=`3X<%l?Ah-_?Ah?BY$q?BY?Mn-_?MnO$q!TM_X`P!a`!cp!eQOr&Xrs&}sv&Xwx(tx!^&X!^!_*V!_;'S&X;'S;=`*y<%lO&X!aNZ!ZhSfQ`PkW!a`!cpOX$qXZ&XZ[$q[^&X^p$qpq&Xqr-_rs&}sv-_vw/^wx(tx}-_}!OMz!O!PMz!P!Q$q!Q![Mz![!]Mz!]!^-_!^!_*V!_!a&X!a!c-_!c!}Mz!}#R-_#R#SMz#S#T1k#T#oMz#o#s-_#s$f$q$f$}-_$}%OMz%O%W-_%W%oMz%o%p-_%p&aMz&a&b-_&b1pMz1p4UMz4U4dMz4d4e-_4e$ISMz$IS$I`-_$I`$IbMz$Ib$Je-_$Je$JgMz$Jg$Kh-_$Kh%#tMz%#t&/x-_&/x&EtMz&Et&FV-_&FV;'SMz;'S;:j!#|;:j;=`3X<%l?&r-_?&r?AhMz?Ah?BY$q?BY?MnMz?MnO$q!a!$PP;=`<%lMz!R!$ZY!a`!cpOq*Vqr!$yrs(Vsv*Vwx)ex!a*V!a!b!4t!b;'S*V;'S;=`*s<%lO*V!R!%Q]!a`!cpOr*Vrs(Vsv*Vwx)ex}*V}!O!%y!O!f*V!f!g!']!g#W*V#W#X!0`#X;'S*V;'S;=`*s<%lO*V!R!&QX!a`!cpOr*Vrs(Vsv*Vwx)ex}*V}!O!&m!O;'S*V;'S;=`*s<%lO*V!R!&vV!a`!cp!dPOr*Vrs(Vsv*Vwx)ex;'S*V;'S;=`*s<%lO*V!R!'dX!a`!cpOr*Vrs(Vsv*Vwx)ex!q*V!q!r!(P!r;'S*V;'S;=`*s<%lO*V!R!(WX!a`!cpOr*Vrs(Vsv*Vwx)ex!e*V!e!f!(s!f;'S*V;'S;=`*s<%lO*V!R!(zX!a`!cpOr*Vrs(Vsv*Vwx)ex!v*V!v!w!)g!w;'S*V;'S;=`*s<%lO*V!R!)nX!a`!cpOr*Vrs(Vsv*Vwx)ex!{*V!{!|!*Z!|;'S*V;'S;=`*s<%lO*V!R!*bX!a`!cpOr*Vrs(Vsv*Vwx)ex!r*V!r!s!*}!s;'S*V;'S;=`*s<%lO*V!R!+UX!a`!cpOr*Vrs(Vsv*Vwx)ex!g*V!g!h!+q!h;'S*V;'S;=`*s<%lO*V!R!+xY!a`!cpOr!+qrs!,hsv!+qvw!-Swx!.[x!`!+q!`!a!/j!a;'S!+q;'S;=`!0Y<%lO!+qq!,mV!cpOv!,hvx!-Sx!`!,h!`!a!-q!a;'S!,h;'S;=`!.U<%lO!,hP!-VTO!`!-S!`!a!-f!a;'S!-S;'S;=`!-k<%lO!-SP!-kO{PP!-nP;=`<%l!-Sq!-xS!cp{POv(Vx;'S(V;'S;=`(h<%lO(Vq!.XP;=`<%l!,ha!.aX!a`Or!.[rs!-Ssv!.[vw!-Sw!`!.[!`!a!.|!a;'S!.[;'S;=`!/d<%lO!.[a!/TT!a`{POr)esv)ew;'S)e;'S;=`)y<%lO)ea!/gP;=`<%l!.[!R!/sV!a`!cp{POr*Vrs(Vsv*Vwx)ex;'S*V;'S;=`*s<%lO*V!R!0]P;=`<%l!+q!R!0gX!a`!cpOr*Vrs(Vsv*Vwx)ex#c*V#c#d!1S#d;'S*V;'S;=`*s<%lO*V!R!1ZX!a`!cpOr*Vrs(Vsv*Vwx)ex#V*V#V#W!1v#W;'S*V;'S;=`*s<%lO*V!R!1}X!a`!cpOr*Vrs(Vsv*Vwx)ex#h*V#h#i!2j#i;'S*V;'S;=`*s<%lO*V!R!2qX!a`!cpOr*Vrs(Vsv*Vwx)ex#m*V#m#n!3^#n;'S*V;'S;=`*s<%lO*V!R!3eX!a`!cpOr*Vrs(Vsv*Vwx)ex#d*V#d#e!4Q#e;'S*V;'S;=`*s<%lO*V!R!4XX!a`!cpOr*Vrs(Vsv*Vwx)ex#X*V#X#Y!+q#Y;'S*V;'S;=`*s<%lO*V!R!4{Y!a`!cpOr!4trs!5ksv!4tvw!6Vwx!8]x!a!4t!a!b!:]!b;'S!4t;'S;=`!;r<%lO!4tq!5pV!cpOv!5kvx!6Vx!a!5k!a!b!7W!b;'S!5k;'S;=`!8V<%lO!5kP!6YTO!a!6V!a!b!6i!b;'S!6V;'S;=`!7Q<%lO!6VP!6lTO!`!6V!`!a!6{!a;'S!6V;'S;=`!7Q<%lO!6VP!7QOxPP!7TP;=`<%l!6Vq!7]V!cpOv!5kvx!6Vx!`!5k!`!a!7r!a;'S!5k;'S;=`!8V<%lO!5kq!7yS!cpxPOv(Vx;'S(V;'S;=`(h<%lO(Vq!8YP;=`<%l!5ka!8bX!a`Or!8]rs!6Vsv!8]vw!6Vw!a!8]!a!b!8}!b;'S!8];'S;=`!:V<%lO!8]a!9SX!a`Or!8]rs!6Vsv!8]vw!6Vw!`!8]!`!a!9o!a;'S!8];'S;=`!:V<%lO!8]a!9vT!a`xPOr)esv)ew;'S)e;'S;=`)y<%lO)ea!:YP;=`<%l!8]!R!:dY!a`!cpOr!4trs!5ksv!4tvw!6Vwx!8]x!`!4t!`!a!;S!a;'S!4t;'S;=`!;r<%lO!4t!R!;]V!a`!cpxPOr*Vrs(Vsv*Vwx)ex;'S*V;'S;=`*s<%lO*V!R!;uP;=`<%l!4t!V!<TXiS`P!a`!cpOr&Xrs&}sv&Xwx(tx!^&X!^!_*V!_;'S&X;'S;=`*y<%lO&X",tokenizers:[vd,Pd,kd,xd,Sd,Qd,0,1,2,3,4,5],topRules:{Document:[0,15]},dialects:{noMatch:0,selfClosing:485},tokenPrec:487});function Xd(t,e){let i=Object.create(null);for(let n of t.getChildren(Kf)){let t=n.getChild(td),s=n.getChild(ed)||n.getChild(id);t&&(i[e.read(t.from,t.to)]=s?s.type.id==ed?e.read(s.from+1,s.to-1):e.read(s.from,s.to):"");}return i}function Td(t,e){let i=t.getChild(Jf);return i?e.read(i.from,i.to):" "}function Rd(t,e,i){let n;for(let s of i)if(!s.attrs||s.attrs(n||(n=Xd(t.node.parent.firstChild,e))))return {parser:s.parser};return null}function Ad(t=[],e=[]){let i=[],n=[],s=[],r=[];for(let e of t){("script"==e.tag?i:"style"==e.tag?n:"textarea"==e.tag?s:r).push(e);}let o=e.length?Object.create(null):null;for(let t of e)(o[t.name]||(o[t.name]=[])).push(t);return C(((t,e)=>{let a=t.type.id;if(a==nd)return Rd(t,e,i);if(a==sd)return Rd(t,e,n);if(a==rd)return Rd(t,e,s);if(a==Hf&&r.length){let i,n=t.node,s=n.firstChild,o=s&&Td(s,e);if(o)for(let t of r)if(t.tag==o&&(!t.attrs||t.attrs(i||(i=Xd(n,e))))){let e=n.lastChild,i=e.type.id==od?e.from:n.to;if(i>s.to)return {parser:t.parser,overlay:[{from:s.to,to:i}]}}}if(o&&a==Kf){let i,n=t.node;if(i=n.firstChild){let t=o[e.read(i.from,i.to)];if(t)for(let i of t){if(i.tagName&&i.tagName!=Td(n.parent,e))continue;let t=n.lastChild;if(t.type.id==ed){let e=t.from+1,n=t.lastChild,s=t.to-(n&&n.isError?0:1);if(s>e)return {parser:i.parser,overlay:[{from:e,to:s}]}}else if(t.type.id==id)return {parser:i.parser,overlay:[{from:t.from,to:t.to}]}}}}return null}))}const Cd=[9,10,11,12,13,32,133,160,5760,8192,8193,8194,8195,8196,8197,8198,8199,8200,8201,8202,8232,8233,8239,8287,12288],qd=new oc({start:!1,shift:(t,e)=>5==e||6==e||313==e?t:314==e,strict:!1}),Yd=new Bh(((t,e)=>{let{next:i}=t;(125==i||-1==i||e.context)&&t.acceptToken(311);}),{contextual:!0,fallback:!0}),Wd=new Bh(((t,e)=>{let i,{next:n}=t;Cd.indexOf(n)>-1||(47!=n||47!=(i=t.peek(1))&&42!=i)&&(125==n||59==n||-1==n||e.context||t.acceptToken(310));}),{contextual:!0}),Md=new Bh(((t,e)=>{let{next:i}=t;if(43==i||45==i){if(t.advance(),i==t.next){t.advance();let i=!e.context&&e.canShift(1);t.acceptToken(i?1:2);}}else 63==i&&46==t.peek(1)&&(t.advance(),t.advance(),(t.next<48||t.next>57)&&t.acceptToken(3));}),{contextual:!0});function jd(t,e){return t>=65&&t<=90||t>=97&&t<=122||95==t||t>=192||!e&&t>=48&&t<=57}const _d=new Bh(((t,e)=>{if(60!=t.next||!e.dialectEnabled(0))return;if(t.advance(),47==t.next)return;let i=0;for(;Cd.indexOf(t.next)>-1;)t.advance(),i++;if(jd(t.next,!0)){for(t.advance(),i++;jd(t.next,!1);)t.advance(),i++;for(;Cd.indexOf(t.next)>-1;)t.advance(),i++;if(44==t.next)return;for(let e=0;;e++){if(7==e){if(!jd(t.next,!0))return;break}if(t.next!="extends".charCodeAt(e))break;t.advance(),i++;}}t.acceptToken(4,-i);})),Ed=Oa({"get set async static":Aa.modifier,"for while do if else switch try catch finally return throw break continue default case":Aa.controlKeyword,"in of await yield void typeof delete instanceof":Aa.operatorKeyword,"let var const using function class extends":Aa.definitionKeyword,"import export from":Aa.moduleKeyword,"with debugger as new":Aa.keyword,TemplateString:Aa.special(Aa.string),super:Aa.atom,BooleanLiteral:Aa.bool,this:Aa.self,null:Aa.null,Star:Aa.modifier,VariableName:Aa.variableName,"CallExpression/VariableName TaggedTemplateExpression/VariableName":Aa.function(Aa.variableName),VariableDefinition:Aa.definition(Aa.variableName),Label:Aa.labelName,PropertyName:Aa.propertyName,PrivatePropertyName:Aa.special(Aa.propertyName),"CallExpression/MemberExpression/PropertyName":Aa.function(Aa.propertyName),"FunctionDeclaration/VariableDefinition":Aa.function(Aa.definition(Aa.variableName)),"ClassDeclaration/VariableDefinition":Aa.definition(Aa.className),PropertyDefinition:Aa.definition(Aa.propertyName),PrivatePropertyDefinition:Aa.definition(Aa.special(Aa.propertyName)),UpdateOp:Aa.updateOperator,"LineComment Hashbang":Aa.lineComment,BlockComment:Aa.blockComment,Number:Aa.number,String:Aa.string,Escape:Aa.escape,ArithOp:Aa.arithmeticOperator,LogicOp:Aa.logicOperator,BitOp:Aa.bitwiseOperator,CompareOp:Aa.compareOperator,RegExp:Aa.regexp,Equals:Aa.definitionOperator,Arrow:Aa.function(Aa.punctuation),": Spread":Aa.punctuation,"( )":Aa.paren,"[ ]":Aa.squareBracket,"{ }":Aa.brace,"InterpolationStart InterpolationEnd":Aa.special(Aa.brace),".":Aa.derefOperator,", ;":Aa.separator,"@":Aa.meta,TypeName:Aa.typeName,TypeDefinition:Aa.definition(Aa.typeName),"type enum interface implements namespace module declare":Aa.definitionKeyword,"abstract global Privacy readonly override":Aa.modifier,"is keyof unique infer":Aa.operatorKeyword,JSXAttributeValue:Aa.attributeValue,JSXText:Aa.content,"JSXStartTag JSXStartCloseTag JSXSelfCloseEndTag JSXEndTag":Aa.angleBracket,"JSXIdentifier JSXNameSpacedName":Aa.tagName,"JSXAttribute/JSXIdentifier JSXAttribute/JSXNameSpacedName":Aa.attributeName,"JSXBuiltin/JSXIdentifier":Aa.standard(Aa.tagName)}),zd={__proto__:null,export:20,as:25,from:33,default:36,async:41,function:42,extends:54,this:58,true:66,false:66,null:78,void:82,typeof:86,super:102,new:136,delete:154,yield:163,await:167,class:172,public:229,private:229,protected:229,readonly:231,instanceof:250,satisfies:253,in:254,const:256,import:288,keyof:341,unique:345,infer:351,is:387,abstract:407,implements:409,type:411,let:414,var:416,using:419,interface:425,enum:429,namespace:435,module:437,declare:441,global:445,for:464,of:473,while:476,with:480,do:484,if:488,else:490,switch:494,case:500,try:506,catch:510,finally:514,return:518,throw:522,break:526,continue:530,debugger:534},Vd={__proto__:null,async:123,get:125,set:127,declare:189,public:191,private:191,protected:191,static:193,abstract:195,override:197,readonly:203,accessor:205,new:391},Dd={__proto__:null,"<":145},Ud=ac.deserialize({version:14,states:"$=dO%TQ^OOO%[Q^OOO'_Q`OOP(lOWOOO*zQ?NdO'#CiO+RO!bO'#CjO+aO#tO'#CjO+oO!0LbO'#D^O.QQ^O'#DdO.bQ^O'#DoO%[Q^O'#DzO0fQ^O'#ESOOQ?Mr'#E['#E[O1PQWO'#EXOOQO'#Em'#EmOOQO'#If'#IfO1XQWO'#GnO1dQWO'#ElO1iQWO'#ElO3kQ?NdO'#JjO6[Q?NdO'#JkO6xQWO'#F[O6}Q&jO'#FrOOQ?Mr'#Fd'#FdO7YO,YO'#FdO7hQ7[O'#FyO9UQWO'#FxOOQ?Mr'#Jk'#JkOOQ?Mp'#Jj'#JjO9ZQWO'#GrOOQU'#KW'#KWO9fQWO'#ISO9kQ?MxO'#ITOOQU'#JX'#JXOOQU'#IX'#IXQ`Q^OOO`Q^OOO9sQMnO'#DsO9zQ^O'#EOO:RQ^O'#EQO9aQWO'#GnO:YQ7[O'#CoO:hQWO'#EkO:sQWO'#EvO:xQ7[O'#FcO;gQWO'#GnOOQO'#KX'#KXO;lQWO'#KXO;zQWO'#GvO;zQWO'#GwO;zQWO'#GyO9aQWO'#G|O<qQWO'#HPO>YQWO'#CeO>jQWO'#H]O>rQWO'#HcO>rQWO'#HeO`Q^O'#HgO>rQWO'#HiO>rQWO'#HlO>wQWO'#HrO>|Q?MyO'#HxO%[Q^O'#HzO?XQ?MyO'#H|O?dQ?MyO'#IOO9kQ?MxO'#IQO?oQ?NdO'#CiO@qQ`O'#DiQOQWOOO%[Q^O'#EQOAXQWO'#ETO:YQ7[O'#EkOAdQWO'#EkOAoQpO'#FcOOQU'#Cg'#CgOOQ?Mp'#Dn'#DnOOQ?Mp'#Jn'#JnO%[Q^O'#JnOOQO'#Jr'#JrOOQO'#Ic'#IcOBoQ`O'#EdOOQ?Mp'#Ec'#EcOOQ?Mp'#Ju'#JuOCkQ?NQO'#EdOCuQ`O'#EWOOQO'#Jq'#JqODZQ`O'#JrOEhQ`O'#EWOCuQ`O'#EdPEuO#@ItO'#CbPOOO)CDv)CDvOOOO'#IY'#IYOFQO!bO,59UOOQ?Mr,59U,59UOOOO'#IZ'#IZOF`O#tO,59UO%[Q^O'#D`OOOO'#I]'#I]OFnO!0LbO,59xOOQ?Mr,59x,59xOF|Q^O'#I^OGaQWO'#JlOIcQrO'#JlO+}Q^O'#JlOIjQWO,5:OOJQQWO'#EmOJ_QWO'#J{OJjQWO'#JzOJjQWO'#JzOJrQWO,5;ZOJwQWO'#JyOOQ?Mv,5:Z,5:ZOKOQ^O,5:ZOMPQ?NdO,5:fOMpQWO,5:nONZQ?MxO'#JxONbQWO'#JwO9ZQWO'#JwONvQWO'#JwO! OQWO,5;YO! TQWO'#JwO!#]QrO'#JkOOQ?Mr'#Ci'#CiO%[Q^O'#ESO!#{QrO,5:sOOQQ'#Js'#JsOOQO-E<d-E<dO9aQWO,5=YO!$cQWO,5=YO!$hQ^O,5;WO!&kQ7[O'#EhO!(UQWO,5;WO!)tQ7[O'#DtO!){Q^O'#DyO!*VQ`O,5;aO!*_Q`O,5;aO%[Q^O,5;aOOQU'#FS'#FSOOQU'#FU'#FUO%[Q^O,5;bO%[Q^O,5;bO%[Q^O,5;bO%[Q^O,5;bO%[Q^O,5;bO%[Q^O,5;bO%[Q^O,5;bO%[Q^O,5;bO%[Q^O,5;bO%[Q^O,5;bO%[Q^O,5;bOOQU'#FY'#FYO!*mQ^O,5;sOOQ?Mr,5;x,5;xOOQ?Mr,5;y,5;yO!,pQYO,5;yOOQ?Mr,5;z,5;zO%[Q^O'#IjO!,xQ?MxO,5<fO!&kQ7[O,5;bO!-gQ7[O,5;bO%[Q^O,5;vO!-nQ&jO'#FhO!.kQ&jO'#KPO!.VQ&jO'#KPO!.rQ&jO'#KPOOQO'#KP'#KPO!/WQ&jO,5<QOOOS,5<^,5<^O!/iQ^O'#FtOOOS'#Ii'#IiO7YO,YO,5<OO!/pQ&jO'#FvOOQ?Mr,5<O,5<OO!0aQ!LQO'#CvOOQ?Mr'#Cz'#CzO!0tQWO'#CzO!0yO!0LbO'#DOO!1gQ7[O,5<cO!1nQWO,5<eO!3ZQ$ISO'#GTO!3hQWO'#GUO!3mQWO'#GUO!5]Q$ISO'#GYO!6XQ`O'#G^OOQO'#Gi'#GiO!(ZQ7[O'#GhOOQO'#Gk'#GkO!(ZQ7[O'#GjO!6zQ!LQO'#JeOOQ?Mr'#Je'#JeO!7UQWO'#JdO!7dQWO'#JcO!7lQWO'#CuOOQ?Mr'#Cx'#CxOOQ?Mr'#DS'#DSOOQ?Mr'#DU'#DUO1SQWO'#DWO!(ZQ7[O'#F{O!(ZQ7[O'#F}O!7tQWO'#GPO!7yQWO'#GQO!3mQWO'#GWO!(ZQ7[O'#G]O!8OQWO'#EnO!8mQWO,5<dOOQ?Mp'#Cr'#CrO!8uQWO'#EoO!9oQ`O'#EpOOQ?Mp'#Jy'#JyO!9vQ?MxO'#KYO9kQ?MxO,5=^O`Q^O,5>nOOQU'#Ja'#JaOOQU,5>o,5>oOOQU-E<V-E<VO!;xQ?NdO,5:_O!9jQ`O,5:]O!>fQ?NdO,5:jO%[Q^O,5:jO!APQ?NdO,5:lOOQO,5@s,5@sO!ApQ7[O,5=YO!BOQ?MxO'#JbO9UQWO'#JbO!BaQ?MxO,59ZO!BlQ`O,59ZO!BtQ7[O,59ZO:YQ7[O,59ZO!CPQWO,5;WO!CXQWO'#H[O!CmQWO'#K]O%[Q^O,5;{O!9jQ`O,5;}O!CuQWO,5=uO!CzQWO,5=uO!DPQWO,5=uO9kQ?MxO,5=uO;zQWO,5=eOOQO'#Cv'#CvO!D_Q`O,5=bO!DgQ7[O,5=cO!DrQWO,5=eO!DwQpO,5=hO!EPQWO'#KXO>wQWO'#HRO9aQWO'#HTO!EUQWO'#HTO:YQ7[O'#HVO!EZQWO'#HVOOQU,5=k,5=kO!E`QWO'#HWO!EqQWO'#CoO!EvQWO,59PO!FQQWO,59PO!HVQ^O,59POOQU,59P,59PO!HgQ?MxO,59PO%[Q^O,59PO!JrQ^O'#H_OOQU'#H`'#H`OOQU'#Ha'#HaO`Q^O,5=wO!KYQWO,5=wO`Q^O,5=}O`Q^O,5>PO!K_QWO,5>RO`Q^O,5>TO!KdQWO,5>WO!KiQ^O,5>^OOQU,5>d,5>dO%[Q^O,5>dO9kQ?MxO,5>fOOQU,5>h,5>hO# sQWO,5>hOOQU,5>j,5>jO# sQWO,5>jOOQU,5>l,5>lO#!aQ`O'#D[O%[Q^O'#JnO#!kQ`O'#JnO##YQ`O'#DjO##kQ`O'#DjO#%|Q^O'#DjO#&TQWO'#JmO#&]QWO,5:TO#&bQWO'#EqO#&pQWO'#J|O#&xQWO,5;[O#&}Q`O'#DjO#'[Q`O'#EVOOQ?Mr,5:o,5:oO%[Q^O,5:oO#'cQWO,5:oO>wQWO,5;VO!BlQ`O,5;VO!BtQ7[O,5;VO:YQ7[O,5;VO#'kQWO,5@YO#'pQ(CYO,5:sOOQO-E<a-E<aO#(vQ?NQO,5;OOCuQ`O,5:rO#)QQ`O,5:rOCuQ`O,5;OO!BaQ?MxO,5:rOOQ?Mp'#Eg'#EgOOQO,5;O,5;OO%[Q^O,5;OO#)_Q?MxO,5;OO#)jQ?MxO,5;OO!BlQ`O,5:rOOQO,5;U,5;UO#)xQ?MxO,5;OPOOO'#IW'#IWP#*^O#@ItO,58|POOO,58|,58|OOOO-E<W-E<WOOQ?Mr1G.p1G.pOOOO-E<X-E<XO#*iQpO,59zOOOO-E<Z-E<ZOOQ?Mr1G/d1G/dO#*nQrO,5>xO+}Q^O,5>xOOQO,5?O,5?OO#*xQ^O'#I^OOQO-E<[-E<[O#+VQWO,5@WO#+_QrO,5@WO#+fQWO,5@fOOQ?Mr1G/j1G/jO%[Q^O,5@gO#+nQWO'#IdOOQO-E<b-E<bO#+fQWO,5@fOOQ?Mp1G0u1G0uOOQ?Mv1G/u1G/uOOQ?Mv1G0Y1G0YO%[Q^O,5@dO#,SQ?MxO,5@dO#,eQ?MxO,5@dO#,lQWO,5@cO9ZQWO,5@cO#,tQWO,5@cO#-SQWO'#IgO#,lQWO,5@cOOQ?Mp1G0t1G0tO!*VQ`O,5:uO!*bQ`O,5:uOOQQ,5:w,5:wO#-tQYO,5:wO#-|Q7[O1G2tO9aQWO1G2tOOQ?Mr1G0r1G0rO#.[Q?NdO1G0rO#/aQ?NbO,5;SOOQ?Mr'#GS'#GSO#/}Q?NdO'#JeO!$hQ^O1G0rO#2VQ7[O'#JoO#2aQWO,5:`O#2fQrO'#JpO%[Q^O'#JpO#2pQWO,5:eOOQ?Mr'#D['#D[OOQ?Mr1G0{1G0{O%[Q^O1G0{OOQ?Mr1G1e1G1eO#2uQWO1G0{O#5^Q?NdO1G0|O#5eQ?NdO1G0|O#8OQ?NdO1G0|O#8VQ?NdO1G0|O#:aQ?NdO1G0|O#:wQ?NdO1G0|O#=qQ?NdO1G0|O#=xQ?NdO1G0|O#@]Q?NdO1G0|O#@jQ?NdO1G0|O#BhQ?NdO1G0|O#EhQ07bO'#CiO#GfQ07bO1G1_O#GmQ07bO'#JkO!,sQWO1G1eO#G}Q?NdO,5?UOOQ?Mp-E<h-E<hO#HqQ?NdO1G0|OOQ?Mr1G0|1G0|O#J|Q?NdO1G1bO#KpQ&jO,5<UO#KxQ&jO,5<VO#LQQ&jO'#FmO#LiQWO'#FlOOQO'#KQ'#KQOOQO'#Ih'#IhO#LnQ&jO1G1lOOQ?Mr1G1l1G1lOOOS1G1w1G1wO#MPQ07bO'#JjO#MZQWO,5<`O!*mQ^O,5<`OOOS-E<g-E<gOOQ?Mr1G1j1G1jO#M`Q`O'#KPOOQ?Mr,5<b,5<bO#MhQ`O,5<bOOQ?Mr,59f,59fO!&kQ7[O'#DQOOOO'#I['#I[O#MmO!0LbO,59jOOQ?Mr,59j,59jO%[Q^O1G1}O!7yQWO'#IlO#MxQ7[O,5<vOOQ?Mr,5<s,5<sO!(ZQ7[O'#IoO#NhQ7[O,5=SO!(ZQ7[O'#IqO$ ZQ7[O,5=UO!&kQ7[O,5=WOOQO1G2P1G2PO$ eQpO'#CrO$ xQ$ISO'#EoO$!wQ`O'#G^O$#eQpO,5<oO$#lQWO'#KTO9ZQWO'#KTO$#zQWO,5<qO!(ZQ7[O,5<pO$$PQWO'#GVO$$bQWO,5<pO$$gQpO'#GSO$$tQpO'#KUO$%OQWO'#KUO!&kQ7[O'#KUO$%TQWO,5<tO$%YQ`O'#G_O!6SQ`O'#G_O$%kQWO'#GaO$%pQWO'#GcO!3mQWO'#GfO$%uQ?MxO'#InO$&QQ`O,5<xOOQ?Mv,5<x,5<xO$&XQ`O'#G_O$&gQ`O'#G`O$&oQ`O'#G`O$&tQ7[O,5=SO$'UQ7[O,5=UOOQ?Mr,5=X,5=XO!(ZQ7[O,5@OO!(ZQ7[O,5@OO$'fQWO'#IsO$'qQWO,5?}O$'yQWO,59aO$(jQ7^O,59rOOQ?Mr,59r,59rO$)]Q7[O,5<gO$*OQ7[O,5<iO@iQWO,5<kOOQ?Mr,5<l,5<lO$*YQWO,5<rO$*_Q7[O,5<wO$*oQWO'#JwO!$hQ^O1G2OO$*tQWO1G2OO9ZQWO'#JzO9ZQWO'#EqO%[Q^O'#EqO9ZQWO'#IuO$*yQ?MxO,5@tOOQU1G2x1G2xOOQU1G4Y1G4YOOQ?Mr1G/y1G/yO!,pQYO1G/yOOQ?Mr1G/w1G/wO$-OQ?NdO1G0UOOQU1G2t1G2tO!&kQ7[O1G2tO%[Q^O1G2tO#.PQWO1G2tO$/SQ7[O'#EhOOQ?Mp,5?|,5?|O$/^Q?MxO,5?|OOQU1G.u1G.uO!BaQ?MxO1G.uO!BlQ`O1G.uO!BtQ7[O1G.uO$/oQWO1G0rO$/tQWO'#CiO$0PQWO'#K^O$0XQWO,5=vO$0^QWO'#K^O$0cQWO'#K^O$0qQWO'#I{O$1PQWO,5@wO$1XQrO1G1gOOQ?Mr1G1i1G1iO9aQWO1G3aO@iQWO1G3aO$1`QWO1G3aO$1eQWO1G3aOOQU1G3a1G3aO!DrQWO1G3PO!&kQ7[O1G2|O$1jQWO1G2|OOQU1G2}1G2}O!&kQ7[O1G2}O$1oQWO1G2}O$1wQ`O'#G{OOQU1G3P1G3PO!6SQ`O'#IwO!DwQpO1G3SOOQU1G3S1G3SOOQU,5=m,5=mO$2PQ7[O,5=oO9aQWO,5=oO$%pQWO,5=qO9UQWO,5=qO!BlQ`O,5=qO!BtQ7[O,5=qO:YQ7[O,5=qO$2_QWO'#K[O$2jQWO,5=rOOQU1G.k1G.kO$2oQ?MxO1G.kO@iQWO1G.kO$2zQWO1G.kO9kQ?MxO1G.kO$5PQrO,5@yO$5aQWO,5@yO9ZQWO,5@yO$5lQ^O,5=yO$5sQWO,5=yOOQU1G3c1G3cO`Q^O1G3cOOQU1G3i1G3iOOQU1G3k1G3kO>rQWO1G3mO$5xQ^O1G3oO$9|Q^O'#HnOOQU1G3r1G3rO$:ZQWO'#HtO>wQWO'#HvOOQU1G3x1G3xO$:cQ^O1G3xO9kQ?MxO1G4OOOQU1G4Q1G4QOOQ?Mp'#GZ'#GZO9kQ?MxO1G4SO9kQ?MxO1G4UO$>jQWO,5@YO!*mQ^O,5;]O9ZQWO,5;]O>wQWO,5:UO!*mQ^O,5:UO!BlQ`O,5:UO$>oQ07bO,5:UOOQO,5;],5;]O$>yQ`O'#I_O$?aQWO,5@XOOQ?Mr1G/o1G/oO$?iQ`O'#IeO$?sQWO,5@hOOQ?Mp1G0v1G0vO##kQ`O,5:UOOQO'#Ib'#IbO$?{Q`O,5:qOOQ?Mv,5:q,5:qO#'fQWO1G0ZOOQ?Mr1G0Z1G0ZO%[Q^O1G0ZOOQ?Mr1G0q1G0qO>wQWO1G0qO!BlQ`O1G0qO!BtQ7[O1G0qOOQ?Mp1G5t1G5tO!BaQ?MxO1G0^OOQO1G0j1G0jO%[Q^O1G0jO$@SQ?MxO1G0jO$@_Q?MxO1G0jO!BlQ`O1G0^OCuQ`O1G0^O$@mQ?MxO1G0jOOQO1G0^1G0^O$ARQ?NdO1G0jPOOO-E<U-E<UPOOO1G.h1G.hOOOO1G/f1G/fO$A]QpO,5<fO$AeQrO1G4dOOQO1G4j1G4jO%[Q^O,5>xO$AoQWO1G5rO$AwQWO1G6QO$BPQrO1G6RO9ZQWO,5?OO$BZQ?NdO1G6OO%[Q^O1G6OO$BkQ?MxO1G6OO$B|QWO1G5}O$B|QWO1G5}O9ZQWO1G5}O$CUQWO,5?RO9ZQWO,5?ROOQO,5?R,5?RO$CjQWO,5?RO$*oQWO,5?ROOQO-E<e-E<eOOQQ1G0a1G0aOOQQ1G0c1G0cO!,sQWO1G0cOOQU7+(`7+(`O!&kQ7[O7+(`O%[Q^O7+(`O$CxQWO7+(`O$DTQ7[O7+(`O$DcQ?NdO,5=SO$FnQ?NdO,5=UO$HyQ?NdO,5=SO$K[Q?NdO,5=UO$MmQ?NdO,59rO% uQ?NdO,5<gO%$QQ?NdO,5<iO%&]Q?NdO,5<wOOQ?Mr7+&^7+&^O%(nQ?NdO7+&^O%)bQ7[O'#I`O%)lQWO,5@ZOOQ?Mr1G/z1G/zO%)tQ^O'#IaO%*RQWO,5@[O%*ZQrO,5@[OOQ?Mr1G0P1G0PO%*eQWO7+&gOOQ?Mr7+&g7+&gO%*jQ07bO,5:fO%[Q^O7+&yO%*tQ07bO,5:_O%+RQ07bO,5:jO%+]Q07bO,5:lOOQ?Mr7+'P7+'POOQO1G1p1G1pOOQO1G1q1G1qO%+gQtO,5<XO!*mQ^O,5<WOOQO-E<f-E<fOOQ?Mr7+'W7+'WOOOS7+'c7+'cOOOS1G1z1G1zO%+rQWO1G1zOOQ?Mr1G1|1G1|O%+wQpO,59lOOOO-E<Y-E<YOOQ?Mr1G/U1G/UO%,OQ?NdO7+'iOOQ?Mr,5?W,5?WO%,rQpO,5?WOOQ?Mr1G2b1G2bP!&kQ7[O'#IlPOQ?Mr-E<j-E<jO%-bQ7[O,5?ZOOQ?Mr-E<m-E<mO%.TQ7[O,5?]OOQ?Mr-E<o-E<oO%._QpO1G2rO%.fQpO'#CrO%.|Q7[O'#JzO%/TQ^O'#EqOOQ?Mr1G2Z1G2ZO%/_QWO'#IkO%/sQWO,5@oO%/sQWO,5@oO%/{QWO,5@oO%0WQWO,5@oOOQO1G2]1G2]O%0fQ7[O1G2[O!(ZQ7[O1G2[O%0vQ$ISO'#ImO%1TQWO,5@pO!&kQ7[O,5@pO%1]QpO,5@pOOQ?Mr1G2`1G2`OOQ?Mp,5<y,5<yOOQ?Mp,5<z,5<zO$*oQWO,5<zOCfQWO,5<zO!BlQ`O,5<yOOQO'#Gb'#GbO%1gQWO,5<{OOQ?Mp,5<},5<}O$*oQWO,5=QOOQO,5?Y,5?YOOQO-E<l-E<lOOQ?Mv1G2d1G2dO!6SQ`O,5<yO%1oQWO,5<zO$%kQWO,5<{O!6SQ`O,5<zO!(ZQ7[O'#IoO%2cQ7[O1G2nO!(ZQ7[O'#IqO%3UQ7[O1G2pO%3`Q7[O1G5jO%3jQ7[O1G5jOOQO,5?_,5?_OOQO-E<q-E<qOOQO1G.{1G.{O!9jQ`O,59tO%[Q^O,59tO%3wQWO1G2VO!(ZQ7[O1G2^O%3|Q?NdO7+'jOOQ?Mr7+'j7+'jO!$hQ^O7+'jO%4pQWO,5;]OOQ?Mp,5?a,5?aOOQ?Mp-E<s-E<sOOQ?Mr7+%e7+%eO%4uQpO'#KVO#'fQWO7+(`O%5PQrO7+(`O$C{QWO7+(`O%5WQ?NbO'#CiO%5kQ?NbO,5=OO%6]QWO,5=OOOQ?Mp1G5h1G5hOOQU7+$a7+$aO!BaQ?MxO7+$aO!BlQ`O7+$aO!$hQ^O7+&^O%6bQWO'#IzO%6yQWO,5@xOOQO1G3b1G3bO9aQWO,5@xO%6yQWO,5@xO%7RQWO,5@xOOQO,5?g,5?gOOQO-E<y-E<yOOQ?Mr7+'R7+'RO%7WQWO7+({O9kQ?MxO7+({O9aQWO7+({O@iQWO7+({OOQU7+(k7+(kO%7]Q?NbO7+(hO!&kQ7[O7+(hO%7gQpO7+(iOOQU7+(i7+(iO!&kQ7[O7+(iO%7nQWO'#KZO%7yQWO,5=gOOQO,5?c,5?cOOQO-E<u-E<uOOQU7+(n7+(nO%9YQ`O'#HUOOQU1G3Z1G3ZO!&kQ7[O1G3ZO%[Q^O1G3ZO%9aQWO1G3ZO%9lQ7[O1G3ZO9kQ?MxO1G3]O$%pQWO1G3]O9UQWO1G3]O!BlQ`O1G3]O!BtQ7[O1G3]O%9zQWO'#IyO%:`QWO,5@vO%:hQ`O,5@vOOQ?Mp1G3^1G3^OOQU7+$V7+$VO@iQWO7+$VO9kQ?MxO7+$VO%:sQWO7+$VO%[Q^O1G6eO%[Q^O1G6fO%:xQ?MxO1G6eO%;SQ^O1G3eO%;ZQWO1G3eO%;`Q^O1G3eOOQU7+(}7+(}O9kQ?MxO7+)XO`Q^O7+)ZOOQU'#Ka'#KaOOQU'#I|'#I|O%;gQ^O,5>YOOQU,5>Y,5>YO%[Q^O'#HoO%;tQWO'#HqOOQU,5>`,5>`O9ZQWO,5>`OOQU,5>b,5>bOOQU7+)d7+)dOOQU7+)j7+)jOOQU7+)n7+)nOOQU7+)p7+)pO%;yQ`O1G5tO%<_Q07bO1G0wO%<iQWO1G0wOOQO1G/p1G/pO%<tQ07bO1G/pO>wQWO1G/pO!*mQ^O'#DjOOQO,5>y,5>yOOQO-E<]-E<]OOQO,5?P,5?POOQO-E<c-E<cO!BlQ`O1G/pOOQO-E<`-E<`OOQ?Mv1G0]1G0]OOQ?Mr7+%u7+%uO#'fQWO7+%uOOQ?Mr7+&]7+&]O>wQWO7+&]O!BlQ`O7+&]OOQO7+%x7+%xO$ARQ?NdO7+&UOOQO7+&U7+&UO%[Q^O7+&UO%=OQ?MxO7+&UO!BaQ?MxO7+%xO!BlQ`O7+%xO%=ZQ?MxO7+&UO%=iQ?NdO7++jO%[Q^O7++jO%=yQWO7++iO%=yQWO7++iOOQO1G4m1G4mO9ZQWO1G4mO%>RQWO1G4mOOQQ7+%}7+%}O#'fQWO<<KzO%5PQrO<<KzO%>aQWO<<KzOOQU<<Kz<<KzO!&kQ7[O<<KzO%[Q^O<<KzO%>iQWO<<KzO%>tQ?NdO,5?ZO%APQ?NdO,5?]O%C[Q?NdO1G2[O%EmQ?NdO1G2nO%GxQ?NdO1G2pO%JTQ7[O,5>zOOQO-E<^-E<^O%J_QrO,5>{O%[Q^O,5>{OOQO-E<_-E<_O%JiQWO1G5vOOQ?Mr<<JR<<JRO%JqQ07bO1G0rO%L{Q07bO1G0|O%MSQ07bO1G0|O& WQ07bO1G0|O& _Q07bO1G0|O&#SQ07bO1G0|O&#jQ07bO1G0|O&%}Q07bO1G0|O&&UQ07bO1G0|O&(SQ07bO1G0|O&(aQ07bO1G0|O&*_Q07bO1G0|O&*rQ?NdO<<JeO&+wQ07bO1G0|O&-mQ07bO'#JeO&/pQ07bO1G1bO&/}Q07bO1G0UO!*mQ^O'#FoOOQO'#KR'#KROOQO1G1s1G1sO&0XQWO1G1rO&0^Q07bO,5?UOOOS7+'f7+'fOOOO1G/W1G/WOOQ?Mr1G4r1G4rO!(ZQ7[O7+(^O&2nQrO'#CiO&2xQWO,5?VO9ZQWO,5?VOOQO-E<i-E<iO&3WQWO1G6ZO&3WQWO1G6ZO&3`QWO1G6ZO&3kQ7[O7+'vO&3{QpO,5?XO&4VQWO,5?XO!&kQ7[O,5?XOOQO-E<k-E<kO&4[QpO1G6[O&4fQWO1G6[OOQ?Mp1G2f1G2fO$*oQWO1G2fOOQ?Mp1G2e1G2eO&4nQWO1G2gO!&kQ7[O1G2gOOQ?Mp1G2l1G2lO!BlQ`O1G2eOCfQWO1G2fO&4sQWO1G2gO&4{QWO1G2fO&5oQ7[O,5?ZOOQ?Mr-E<n-E<nO&6bQ7[O,5?]OOQ?Mr-E<p-E<pO!(ZQ7[O7++UOOQ?Mr1G/`1G/`O&6lQWO1G/`OOQ?Mr7+'q7+'qO&6qQ7[O7+'xO&7RQ?NdO<<KUOOQ?Mr<<KU<<KUO&7uQWO1G0wO!&kQ7[O'#ItO&7zQWO,5@qO!&kQ7[O1G2jOOQU<<G{<<G{O!BaQ?MxO<<G{O&8SQ?NdO<<IxOOQ?Mr<<Ix<<IxOOQO,5?f,5?fO&8vQWO,5?fO&8{QWO,5?fOOQO-E<x-E<xO&9ZQWO1G6dO&9ZQWO1G6dO9aQWO1G6dO@iQWO<<LgOOQU<<Lg<<LgO&9cQWO<<LgO9kQ?MxO<<LgOOQU<<LS<<LSO%7]Q?NbO<<LSOOQU<<LT<<LTO%7gQpO<<LTO&9hQ`O'#IvO&9sQWO,5@uO!*mQ^O,5@uOOQU1G3R1G3RO%/TQ^O'#JnOOQO'#Ix'#IxO9kQ?MxO'#IxO&9{Q`O,5=pOOQU,5=p,5=pO&:SQ`O'#EdO&:hQWO7+(uO&:mQWO7+(uOOQU7+(u7+(uO!&kQ7[O7+(uO%[Q^O7+(uO&:uQWO7+(uOOQU7+(w7+(wO9kQ?MxO7+(wO$%pQWO7+(wO9UQWO7+(wO!BlQ`O7+(wO&;QQWO,5?eOOQO-E<w-E<wOOQO'#HX'#HXO&;]QWO1G6bO9kQ?MxO<<GqOOQU<<Gq<<GqO@iQWO<<GqO&;eQWO7+,PO&;jQWO7+,QO%[Q^O7+,PO%[Q^O7+,QOOQU7+)P7+)PO&;oQWO7+)PO&;tQ^O7+)PO&;{QWO7+)POOQU<<Ls<<LsOOQU<<Lu<<LuOOQU-E<z-E<zOOQU1G3t1G3tO&<QQWO,5>ZOOQU,5>],5>]O&<VQWO1G3zO9ZQWO7+&cO!*mQ^O7+&cOOQO7+%[7+%[O&<[Q07bO1G6RO>wQWO7+%[OOQ?Mr<<Ia<<IaOOQ?Mr<<Iw<<IwO>wQWO<<IwOOQO<<Ip<<IpO$ARQ?NdO<<IpO%[Q^O<<IpOOQO<<Id<<IdO!BaQ?MxO<<IdO&<fQ?MxO<<IpO&<qQ?NdO<= UO&=RQWO<= TOOQO7+*X7+*XO9ZQWO7+*XOOQUANAfANAfO&=ZQWOANAfO!&kQ7[OANAfO#'fQWOANAfO%5PQrOANAfO%[Q^OANAfO&=cQ?NdO7+'vO&?tQ?NdO,5?ZO&BPQ?NdO,5?]O&D[Q?NdO7+'xO&FmQrO1G4gO&FwQ07bO7+&^O&H{Q07bO,5=SO&KSQ07bO,5=UO&KdQ07bO,5=SO&KtQ07bO,5=UO&LUQ07bO,59rO&NXQ07bO,5<gO'![Q07bO,5<iO'$_Q07bO,5<wO'&TQ07bO7+'iO'&bQ07bO7+'jO'&oQWO,5<ZOOQO7+'^7+'^O'&tQ7[O<<KxOOQO1G4q1G4qO'&{QWO1G4qO''WQWO1G4qO''fQWO7++uO''fQWO7++uO!&kQ7[O1G4sO''nQpO1G4sO''xQWO7++vOOQ?Mp7+(Q7+(QO$*oQWO7+(RO'(QQpO7+(ROOQ?Mp7+(P7+(PO$*oQWO7+(QO'(XQWO7+(RO!&kQ7[O7+(ROCfQWO7+(QO'(^Q7[O<<NpOOQ?Mr7+$z7+$zO'(hQpO,5?`OOQO-E<r-E<rO'(rQ?NbO7+(UOOQUAN=gAN=gO9aQWO1G5QOOQO1G5Q1G5QO')SQWO1G5QO')XQWO7+,OO')XQWO7+,OO9kQ?MxOANBRO@iQWOANBROOQUANBRANBROOQUANAnANAnOOQUANAoANAoO')aQWO,5?bOOQO-E<t-E<tO')lQ07bO1G6aOOQO,5?d,5?dOOQO-E<v-E<vOOQU1G3[1G3[O%/TQ^O,5<{OOQU<<La<<LaO!&kQ7[O<<LaO&:hQWO<<LaO')vQWO<<LaO%[Q^O<<LaOOQU<<Lc<<LcO9kQ?MxO<<LcO$%pQWO<<LcO9UQWO<<LcO'*OQ`O1G5PO'*ZQWO7++|OOQUAN=]AN=]O9kQ?MxOAN=]OOQU<= k<= kOOQU<= l<= lO'*cQWO<= kO'*hQWO<= lOOQU<<Lk<<LkO'*mQWO<<LkO'*rQ^O<<LkOOQU1G3u1G3uO>wQWO7+)fO'*yQWO<<I}O'+UQ07bO<<I}OOQO<<Hv<<HvOOQ?MrAN?cAN?cOOQOAN?[AN?[O$ARQ?NdOAN?[OOQOAN?OAN?OO%[Q^OAN?[OOQO<<Ms<<MsOOQUG27QG27QO!&kQ7[OG27QO#'fQWOG27QO'+`QWOG27QO%5PQrOG27QO'+hQ07bO<<JeO'+uQ07bO1G2[O'-kQ07bO,5?ZO'/nQ07bO,5?]O'1qQ07bO1G2nO'3tQ07bO1G2pO'5wQ07bO<<KUO'6UQ07bO<<IxOOQO1G1u1G1uO!(ZQ7[OANAdOOQO7+*]7+*]O'6cQWO7+*]O'6nQWO<= aO'6vQpO7+*_OOQ?Mp<<Km<<KmO$*oQWO<<KmOOQ?Mp<<Kl<<KlO'7QQpO<<KmO$*oQWO<<KlOOQO7+*l7+*lO9aQWO7+*lO'7XQWO<= jOOQUG27mG27mO9kQ?MxOG27mO!*mQ^O1G4|O'7aQWO7++{O&:hQWOANA{OOQUANA{ANA{O!&kQ7[OANA{O'7iQWOANA{OOQUANA}ANA}O9kQ?MxOANA}O$%pQWOANA}OOQO'#HY'#HYOOQO7+*k7+*kOOQUG22wG22wOOQUANEVANEVOOQUANEWANEWOOQUANBVANBVO'7qQWOANBVOOQU<<MQ<<MQO!*mQ^OAN?iOOQOG24vG24vO$ARQ?NdOG24vO#'fQWOLD,lOOQULD,lLD,lO!&kQ7[OLD,lO'7vQWOLD,lO'8OQ07bO7+'vO'9tQ07bO,5?ZO';wQ07bO,5?]O'=zQ07bO7+'xO'?pQ7[OG27OOOQO<<Mw<<MwOOQ?MpANAXANAXO$*oQWOANAXOOQ?MpANAWANAWOOQO<<NW<<NWOOQULD-XLD-XO'@QQ07bO7+*hOOQUG27gG27gO&:hQWOG27gO!&kQ7[OG27gOOQUG27iG27iO9kQ?MxOG27iOOQUG27qG27qO'@[Q07bOG25TOOQOLD*bLD*bOOQU!$(!W!$(!WO#'fQWO!$(!WO!&kQ7[O!$(!WO'@fQ?NdOG27OOOQ?MpG26sG26sOOQULD-RLD-RO&:hQWOLD-ROOQULD-TLD-TOOQU!)9Er!)9ErO#'fQWO!)9ErOOQU!$(!m!$(!mOOQU!.K;^!.K;^O'BwQ07bOG27OO!*mQ^O'#DzO1PQWO'#EXO'DmQrO'#JjO'DtQMnO'#DsO'D{Q^O'#EOO'ESQrO'#CiO'GjQrO'#CiO!*mQ^O'#EQO'GzQ^O,5;WO!*mQ^O,5;bO!*mQ^O,5;bO!*mQ^O,5;bO!*mQ^O,5;bO!*mQ^O,5;bO!*mQ^O,5;bO!*mQ^O,5;bO!*mQ^O,5;bO!*mQ^O,5;bO!*mQ^O,5;bO!*mQ^O,5;bO!*mQ^O'#IjO'I}QWO,5<fO'JVQ7[O,5;bO'KpQ7[O,5;bO!*mQ^O,5;vO!&kQ7[O'#GhO'JVQ7[O'#GhO!&kQ7[O'#GjO'JVQ7[O'#GjO1SQWO'#DWO1SQWO'#DWO!&kQ7[O'#F{O'JVQ7[O'#F{O!&kQ7[O'#F}O'JVQ7[O'#F}O!&kQ7[O'#G]O'JVQ7[O'#G]O!*mQ^O,5:jO'KwQ`O'#D[O!*mQ^O,5@gO'GzQ^O1G0rO'LRQ07bO'#CiO!*mQ^O1G1}O!&kQ7[O'#IoO'JVQ7[O'#IoO!&kQ7[O'#IqO'JVQ7[O'#IqO'L]QpO'#CrO!&kQ7[O,5<pO'JVQ7[O,5<pO'GzQ^O1G2OO!*mQ^O7+&yO!&kQ7[O1G2[O'JVQ7[O1G2[O!&kQ7[O'#IoO'JVQ7[O'#IoO!&kQ7[O'#IqO'JVQ7[O'#IqO!&kQ7[O1G2^O'JVQ7[O1G2^O'GzQ^O7+'jO'GzQ^O7+&^O!&kQ7[OANAdO'JVQ7[OANAdO'LpQWO'#ElO'LuQWO'#ElO'L}QWO'#F[O'MSQWO'#EvO'MXQWO'#J{O'MdQWO'#JyO'MoQWO,5;WO'MtQ7[O,5<cO'M{QWO'#GUO'NQQWO'#GUO'NVQWO,5<dO'N_QWO,5;WO'NgQ07bO1G1_O'NnQWO,5<pO'NsQWO,5<pO'NxQWO,5<rO'N}QWO,5<rO( SQWO1G2OO( XQWO1G0rO( ^Q7[O<<KxO( eQ7[O<<KxO7hQ7[O'#FyO9UQWO'#FxOAdQWO'#EkO!*mQ^O,5;sO!3mQWO'#GUO!3mQWO'#GUO!3mQWO'#GWO!3mQWO'#GWO!(ZQ7[O7+(^O!(ZQ7[O7+(^O%._QpO1G2rO%._QpO1G2rO!&kQ7[O,5=WO!&kQ7[O,5=W",stateData:"(!i~O'uOS'vOSTOS'wRQ~OPYOQYOSfOY!VOaqOdzOeyOmkOoYOpkOqkOwkOyYO{YO!PWO!TkO!UkO![XO!fuO!lZO!oYO!pYO!qYO!svO!uwO!xxO!|]O#t!PO$U|O%c}O%e!QO%g!OO%h!OO%i!OO%l!RO%n!SO%q!TO%r!TO%t!UO&Q!WO&W!XO&Y!YO&[!ZO&^![O&a!]O&g!^O&m!_O&o!`O&q!aO&s!bO&u!cO'|SO(OTO(RUO(YVO(h[O(viO~OWtO~P`OPYOQYOSfOd!jOe!iOmkOoYOpkOqkOwkOyYO{YO!PWO!TkO!UkO![!eO!fuO!lZO!oYO!pYO!qYO!svO!u!gO!x!hO$U!kO'|!dO(OTO(RUO(YVO(h[O(viO~Oa!wOp!nO!P!oO!_!yO!`!vO!a!vO!|:lO#Q!pO#R!pO#S!xO#T!pO#U!pO#X!zO#Y!zO'}!lO(OTO(RUO(]!mO(h!sO~O'w!{O~OP]XR]X[]Xa]Xo]X}]X!P]X!Y]X!i]X!j]X!l]X!p]X#]]X#hfX#k]X#l]X#m]X#n]X#o]X#p]X#q]X#r]X#s]X#u]X#w]X#y]X#z]X$P]X's]X(Y]X(j]X(q]X(r]X~O!d$}X~P(qO_!}O(O#PO(P!}O(Q#PO~O_#QO(Q#PO(R#PO(S#QO~Ou#SO!R#TO(Z#TO([#VO~OPYOQYOSfOd!jOe!iOmkOoYOpkOqkOwkOyYO{YO!PWO!TkO!UkO![!eO!fuO!lZO!oYO!pYO!qYO!svO!u!gO!x!hO$U!kO'|:pO(OTO(RUO(YVO(h[O(viO~O!X#ZO!Y#WO!V(`P!V(nP~P+}O!Z#cO~P`OPYOQYOSfOd!jOe!iOoYOpkOqkOwkOyYO{YO!PWO!TkO!UkO![!eO!fuO!lZO!oYO!pYO!qYO!svO!u!gO!x!hO$U!kO(OTO(RUO(YVO(h[O(viO~Om#mO!X#iO!|]O#f#lO#g#iO'|:qO!k(kP~P.iO!l#oO'|#nO~O!x#sO!|]O%c#tO~O#h#uO~O!d#vO#h#uO~OP$^OR#{O[$eOo$RO}#zO!P#|O!Y$bO!i$TO!j#xO!l#yO!p$^O#k$PO#l$QO#m$QO#n$QO#o$SO#p$TO#q$TO#r$dO#s$TO#u$UO#w$WO#y$YO#z$ZO(YVO(j$[O(q#}O(r$OO~Oa(^X's(^X'q(^X!k(^X!V(^X![(^X%d(^X!d(^X~P1qO#]$fO$P$fOP(_XR(_X[(_Xo(_X}(_X!P(_X!Y(_X!i(_X!l(_X!p(_X#k(_X#l(_X#m(_X#n(_X#o(_X#p(_X#q(_X#r(_X#s(_X#u(_X#w(_X#y(_X#z(_X(Y(_X(j(_X(q(_X(r(_X![(_X%d(_X~Oa(_X!j(_X's(_X'q(_X!V(_X!k(_Xs(_X!d(_X~P4XO#]$fO~O$Z$hO$]$gO$d$mO~OSfO![$nO$g$oO$i$qO~Oh%WOm%XOo$uOp$tOq$tOw%YOy%ZO{%[O!P$|O![$}O!f%aO!l$yO#g%bO$U%_O$p%]O$r%^O$u%`O'|$sO(OTO(RUO(Y$vO(q%OO(r%QOg(VP~O!l%cO~O!P%fO![%gO'|%eO~O!d%kO~Oa%lO's%lO~O}%pO~P%[O'}!lO~P%[O%i%tO~P%[Oh%WO!l%cO'|%eO'}!lO~Oe%{O!l%cO'|%eO~O#s$TO~O}&QO![%}O!l&PO%e&TO'|%eO'}!lO(OTO(RUO`)PP~O!x#sO~O%n&VO!P({X![({X'|({X~O'|&WO~O!u&]O#t!PO%e!QO%g!OO%h!OO%i!OO%l!RO%n!SO%q!TO%r!TO~Od&bOe&aO!x&_O%c&`O%v&^O~P<POd&eOeyO![&dO!u&]O!xxO!|]O#t!PO%c}O%g!OO%h!OO%i!OO%l!RO%n!SO%q!TO%r!TO%t!UO~Ob&hO#]&kO%e&fO'}!lO~P=UO!l&lO!u&pO~O!l#oO~O![XO~Oa%lO'r&xO's%lO~Oa%lO'r&{O's%lO~Oa%lO'r&}O's%lO~O'q]X!V]Xs]X!k]X&U]X![]X%d]X!d]X~P(qO!_'[O!`'TO!a'TO'}!lO(OTO(RUO~Op'RO!P'QO!X'UO(]'PO!Z(aP!Z(pP~P@]Ok'_O![']O'|%eO~Oe'dO!l%cO'|%eO~O}&QO!l&PO~Op!nO!P!oO!|:lO#Q!pO#R!pO#T!pO#U!pO'}!lO(OTO(RUO(]!mO(h!sO~O!_'jO!`'iO!a'iO#S!pO#X'kO#Y'kO~PAwOa%lOh%WO!d#vO!l%cO's%lO(j'mO~O!p'qO#]'oO~PCVOp!nO!P!oO(OTO(RUO(]!mO(h!sO~O![XOp(fX!P(fX!_(fX!`(fX!a(fX!|(fX#Q(fX#R(fX#S(fX#T(fX#U(fX#X(fX#Y(fX'}(fX(O(fX(R(fX(](fX(h(fX~O!`'iO!a'iO'}!lO~PCuO'x'uO'y'uO'z'wO~O_!}O(O'yO(P!}O(Q'yO~O_#QO(Q'yO(R'yO(S#QO~Ou#SO!R#TO(Z#TO(['}O~O!X(PO!V'QX!V'WX!Y'QX!Y'WX~P+}O!Y(RO!V(`X~OP$^OR#{O[$eOo$RO}#zO!P#|O!Y(RO!i$TO!j#xO!l#yO!p$^O#k$PO#l$QO#m$QO#n$QO#o$SO#p$TO#q$TO#r$dO#s$TO#u$UO#w$WO#y$YO#z$ZO(YVO(j$[O(q#}O(r$OO~O!V(`X~PGiO!V(WO~O!V(mX!Y(mX!d(mX!k(mX(j(mX~O#](mX#h#aX!Z(mX~PIoO#](XO!V(oX!Y(oX~O!Y(YO!V(nX~O!V(]O~O#]$fO~PIoO!Z(^O~P`OR#{O}#zO!P#|O!j#xO!l#yO(YVOP!na[!nao!na!Y!na!i!na!p!na#k!na#l!na#m!na#n!na#o!na#p!na#q!na#r!na#s!na#u!na#w!na#y!na#z!na(j!na(q!na(r!na~Oa!na's!na'q!na!V!na!k!nas!na![!na%d!na!d!na~PKVO!k(_O~O!d#vO#](`O(j'mO!Y(lXa(lX's(lX~O!k(lX~PMuO!P%fO![%gO!|]O#f(eO#g(dO'|%eO~O!Y(fO!k(kX~O!k(hO~O!P%fO![%gO#g(dO'|%eO~OP(_XR(_X[(_Xo(_X}(_X!P(_X!Y(_X!i(_X!j(_X!l(_X!p(_X#k(_X#l(_X#m(_X#n(_X#o(_X#p(_X#q(_X#r(_X#s(_X#u(_X#w(_X#y(_X#z(_X(Y(_X(j(_X(q(_X(r(_X~O!d#vO!k(_X~P! cOR(jO}(iO!j#xO!l#yO!|!{a!P!{a~O!x!{a%c!{a![!{a#f!{a#g!{a'|!{a~P!#gO!x(nO~OPYOQYOSfOd!jOe!iOmkOoYOpkOqkOwkOyYO{YO!PWO!TkO!UkO![XO!fuO!lZO!oYO!pYO!qYO!svO!u!gO!x!hO$U!kO'|!dO(OTO(RUO(YVO(h[O(viO~Oh%WOm%XOo$uOp$tOq$tOw%YOy%ZO{;YO!P$|O![$}O!f<jO!l$yO#g;`O$U%_O$p;[O$r;^O$u%`O'|(rO(OTO(RUO(Y$vO(q%OO(r%QO~O#h(tO~Oh%WOm%XOo$uOp$tOq$tOw%YOy%ZO{%[O!P$|O![$}O!f%aO!l$yO#g%bO$U%_O$p%]O$r%^O$u%`O'|(rO(OTO(RUO(Y$vO(q%OO(r%QO~Og(cP~P!(ZO!X(xO!k(dP~P%[O(](zO(h[O~O!P(|O!l#yO(](zO(h[O~OP:kOQ:kOSfOd<fOe!iOmkOo:kOpkOqkOwkOy:kO{:kO!PWO!TkO!UkO![!eO!f:nO!lZO!o:kO!p:kO!q:kO!s:oO!u:rO!x!hO$U!kO'|)[O(OTO(RUO(YVO(h[O(v<dO~OR)_O!l#yO~O!Y$bOa$na's$na'q$na!k$na!V$na![$na%d$na!d$na~O#t)cO~P!&kO})fO!d)eO![$[X$X$[X$Z$[X$]$[X$d$[X~O!d)eO![(sX$X(sX$Z(sX$](sX$d(sX~O})fO~P!.VO})fO![(sX$X(sX$Z(sX$](sX$d(sX~O![)hO$X)lO$Z)gO$])gO$d)mO~O!X)pO~P!*mO$Z$hO$]$gO$d)tO~Ok$vX}$vX!P$vX!j$vX(q$vX(r$vX~OgjXg$vXkjX!YjX#]jX~P!/{Op)vO~Ou)wO(Z)xO([)zO~Ok*TO})|O!P)}O(q%OO(r%QO~Og){O~P!1UOg*UO~Oh%WOm%XOo$uOp$tOq$tOw%YOy%ZO{;YO!P*WO![*XO!f<jO!l$yO#g;`O$U%_O$p;[O$r;^O$u%`O(OTO(RUO(Y$vO(q%OO(r%QO~O!X*[O'|*VO!k(wP~P!1sO#h*^O~O!l*_O~Oh%WOm%XOo$uOp$tOq$tOw%YOy%ZO{;YO!P$|O![$}O!f<jO!l$yO#g;`O$U%_O$p;[O$r;^O$u%`O'|*aO(OTO(RUO(Y$vO(q%OO(r%QO~O!X*dO!V(xP~P!3rOo*pO!P*hO!_*nO!`*gO!a*gO!l*_O#X*oO%Z*jO'}!lO(]!mO~O!Z*mO~P!5gO!j#xOk(XX}(XX!P(XX(q(XX(r(XX!Y(XX#](XX~Og(XX#}(XX~P!6`Ok*uO#]*tOg(WX!Y(WX~O!Y*vOg(VX~O'|&WOg(VP~O!l*}O~O'|(rO~Om+RO!P%fO!X#iO![%gO!|]O#f#lO#g#iO'|%eO!k(kP~O!d#vO#h+SO~O!P%fO!X+UO!Y(YO![%gO'|%eO!V(nP~Op'XO!P+WO!X+VO(OTO(RUO(](zO~O!Z(pP~P!9ZO!Y+XOa(|X's(|X~OP$^OR#{O[$eOo$RO}#zO!P#|O!i$TO!j#xO!l#yO!p$^O#k$PO#l$QO#m$QO#n$QO#o$SO#p$TO#q$TO#r$dO#s$TO#u$UO#w$WO#y$YO#z$ZO(YVO(j$[O(q#}O(r$OO~Oa!ga!Y!ga's!ga'q!ga!V!ga!k!gas!ga![!ga%d!ga!d!ga~P!:ROR#{O}#zO!P#|O!j#xO!l#yO(YVOP!ra[!rao!ra!Y!ra!i!ra!p!ra#k!ra#l!ra#m!ra#n!ra#o!ra#p!ra#q!ra#r!ra#s!ra#u!ra#w!ra#y!ra#z!ra(j!ra(q!ra(r!ra~Oa!ra's!ra'q!ra!V!ra!k!ras!ra![!ra%d!ra!d!ra~P!<lOR#{O}#zO!P#|O!j#xO!l#yO(YVOP!ta[!tao!ta!Y!ta!i!ta!p!ta#k!ta#l!ta#m!ta#n!ta#o!ta#p!ta#q!ta#r!ta#s!ta#u!ta#w!ta#y!ta#z!ta(j!ta(q!ta(r!ta~Oa!ta's!ta'q!ta!V!ta!k!tas!ta![!ta%d!ta!d!ta~P!?VOh%WOk+cO![']O%d+bO~O!d+eOa(UX![(UX's(UX!Y(UX~Oa%lO![XO's%lO~Oh%WO!l%cO~Oh%WO!l%cO'|%eO~O!d#vO#h(tO~Ob+pO%e+qO'|+mO(OTO(RUO!Z)QP~O!Y+rO`)PX~O[+vO~O`+wO~O![%}O'|%eO'}!lO`)PP~Oh%WO#]+|O~Oh%WOk,PO![$}O~O![,RO~O},TO![XO~O%i%tO~O!x,YO~Oe,_O~Ob,`O'|#nO(OTO(RUO!Z)OP~Oe%{O~O%e!QO'|&WO~P=UO[,eO`,dO~OPYOQYOSfOdzOeyOmkOoYOpkOqkOwkOyYO{YO!PWO!TkO!UkO!fuO!lZO!oYO!pYO!qYO!svO!xxO!|]O%c}O(OTO(RUO(YVO(h[O(viO~O![!eO!u!gO$U!kO'|!dO~P!FYO`,dOa%lO's%lO~OPYOQYOSfOd!jOe!iOmkOoYOpkOqkOwkOyYO{YO!PWO!TkO!UkO![!eO!fuO!lZO!oYO!pYO!qYO!svO!x!hO$U!kO'|!dO(OTO(RUO(YVO(h[O(viO~Oa,jO!uwO#t!OO%g!OO%h!OO%i!OO~P!HrO!l&lO~O&W,pO~O![,rO~O&i,tO&k,uOP&faQ&faS&faY&faa&fad&fae&fam&fao&fap&faq&faw&fay&fa{&fa!P&fa!T&fa!U&fa![&fa!f&fa!l&fa!o&fa!p&fa!q&fa!s&fa!u&fa!x&fa!|&fa#t&fa$U&fa%c&fa%e&fa%g&fa%h&fa%i&fa%l&fa%n&fa%q&fa%r&fa%t&fa&Q&fa&W&fa&Y&fa&[&fa&^&fa&a&fa&g&fa&m&fa&o&fa&q&fa&s&fa&u&fa'q&fa'|&fa(O&fa(R&fa(Y&fa(h&fa(v&fa!Z&fa&_&fab&fa&d&fa~O'|,zO~Oh!bX!Y!OX!Z!OX!d!OX!d!bX!l!bX#]!OX~O!Y!bX!Z!bX~P# xO!d-PO#]-OOh(bX!Y#eX!Y(bX!Z#eX!Z(bX!d(bX!l(bX~Oh%WO!d-RO!l%cO!Y!^X!Z!^X~Op!nO!P!oO(OTO(RUO(]!mO~OP:kOQ:kOSfOd<fOe!iOmkOo:kOpkOqkOwkOy:kO{:kO!PWO!TkO!UkO![!eO!f:nO!lZO!o:kO!p:kO!q:kO!s:oO!u:rO!x!hO$U!kO(OTO(RUO(YVO(h[O(v<dO~O'|;fO~P##|O!Y-VO!Z(aX~O!Z-XO~O!d-PO#]-OO!Y#eX!Z#eX~O!Y-YO!Z(pX~O!Z-[O~O!`-]O!a-]O'}!lO~P##kO!Z-`O~P'_Ok-cO![']O~O!V-hO~Op!{a!_!{a!`!{a!a!{a#Q!{a#R!{a#S!{a#T!{a#U!{a#X!{a#Y!{a'}!{a(O!{a(R!{a(]!{a(h!{a~P!#gO!p-mO#]-kO~PCVO!`-oO!a-oO'}!lO~PCuOa%lO#]-kO's%lO~Oa%lO!d#vO#]-kO's%lO~Oa%lO!d#vO!p-mO#]-kO's%lO(j'mO~O'x'uO'y'uO'z-tO~Os-uO~O!V'Qa!Y'Qa~P!:RO!X-yO!V'QX!Y'QX~P%[O!Y(RO!V(`a~O!V(`a~PGiO!Y(YO!V(na~O!P%fO!X-}O![%gO'|%eO!V'WX!Y'WX~O#].PO!Y(la!k(laa(la's(la~O!d#vO~P#,SO!Y(fO!k(ka~O!P%fO![%gO#g.TO'|%eO~Om.YO!P%fO!X.VO![%gO!|]O#f.XO#g.VO'|%eO!Y'ZX!k'ZX~OR.^O!l#yO~Oh%WOk.aO![']O%d.`O~Oa#`i!Y#`i's#`i'q#`i!V#`i!k#`is#`i![#`i%d#`i!d#`i~P!:ROk<pO})|O!P)}O(q%OO(r%QO~O#h#[aa#[a#]#[a's#[a!Y#[a!k#[a![#[a!V#[a~P#/OO#h(XXP(XXR(XX[(XXa(XXo(XX!i(XX!l(XX!p(XX#k(XX#l(XX#m(XX#n(XX#o(XX#p(XX#q(XX#r(XX#s(XX#u(XX#w(XX#y(XX#z(XX's(XX(Y(XX(j(XX!k(XX!V(XX'q(XXs(XX![(XX%d(XX!d(XX~P!6`O!Y.nOg(cX~P!1UOg.pO~O!Y.qO!k(dX~P!:RO!k.tO~O!V.vO~OP$^OR#{O}#zO!P#|O!j#xO!l#yO!p$^O(YVO[#jia#jio#ji!Y#ji!i#ji#l#ji#m#ji#n#ji#o#ji#p#ji#q#ji#r#ji#s#ji#u#ji#w#ji#y#ji#z#ji's#ji(j#ji(q#ji(r#ji'q#ji!V#ji!k#jis#ji![#ji%d#ji!d#ji~O#k#ji~P#2zO#k$PO~P#2zOP$^OR#{O}#zO!P#|O!j#xO!l#yO!p$^O#k$PO#l$QO#m$QO#n$QO(YVO[#jia#ji!Y#ji!i#ji#o#ji#p#ji#q#ji#r#ji#s#ji#u#ji#w#ji#y#ji#z#ji's#ji(j#ji(q#ji(r#ji'q#ji!V#ji!k#jis#ji![#ji%d#ji!d#ji~Oo#ji~P#5lOo$RO~P#5lOP$^OR#{Oo$RO}#zO!P#|O!j#xO!l#yO!p$^O#k$PO#l$QO#m$QO#n$QO#o$SO(YVOa#ji!Y#ji#u#ji#w#ji#y#ji#z#ji's#ji(j#ji(q#ji(r#ji'q#ji!V#ji!k#jis#ji![#ji%d#ji!d#ji~O[#ji!i#ji#p#ji#q#ji#r#ji#s#ji~P#8^O[$eO!i$TO#p$TO#q$TO#r$dO#s$TO~P#8^OP$^OR#{O[$eOo$RO}#zO!P#|O!i$TO!j#xO!l#yO!p$^O#k$PO#l$QO#m$QO#n$QO#o$SO#p$TO#q$TO#r$dO#s$TO#u$UO(YVO(r$OOa#ji!Y#ji#y#ji#z#ji's#ji(j#ji(q#ji'q#ji!V#ji!k#jis#ji![#ji%d#ji!d#ji~O#w$WO~P#;_O#w#ji~P#;_OP$^OR#{O[$eOo$RO}#zO!P#|O!i$TO!j#xO!l#yO!p$^O#k$PO#l$QO#m$QO#n$QO#o$SO#p$TO#q$TO#r$dO#s$TO#u$UO(YVOa#ji!Y#ji#y#ji#z#ji's#ji(j#ji'q#ji!V#ji!k#jis#ji![#ji%d#ji!d#ji~O#w#ji(q#ji(r#ji~P#>PO#w$WO(q#}O(r$OO~P#>POP$^OR#{O[$eOo$RO}#zO!P#|O!i$TO!j#xO!l#yO!p$^O#k$PO#l$QO#m$QO#n$QO#o$SO#p$TO#q$TO#r$dO#s$TO#u$UO#w$WO#y$YO(YVO(q#}O(r$OO~Oa#ji!Y#ji#z#ji's#ji(j#ji'q#ji!V#ji!k#jis#ji![#ji%d#ji!d#ji~P#@wOP]XR]X[]Xo]X}]X!P]X!i]X!j]X!l]X!p]X#]]X#hfX#k]X#l]X#m]X#n]X#o]X#p]X#q]X#r]X#s]X#u]X#w]X#y]X#z]X$P]X(Y]X(j]X(q]X(r]X!Y]X!Z]X~O#}]X~P#CbOP$^OR#{O[;SOo:vO}#zO!P#|O!i:xO!j#xO!l#yO!p$^O#k:tO#l:uO#m:uO#n:uO#o:wO#p:xO#q:xO#r;RO#s:xO#u:yO#w:{O#y:}O#z;OO(YVO(j$[O(q#}O(r$OO~O#}.xO~P#EoO#];TO$P;TO#}(_X!Z(_X~P! cOa'^a!Y'^a's'^a'q'^a!k'^a!V'^as'^a!['^a%d'^a!d'^a~P!:ROP#jiR#ji[#jia#jio#ji!Y#ji!i#ji!j#ji!l#ji!p#ji#k#ji#l#ji#m#ji#n#ji#o#ji#p#ji#q#ji#r#ji#s#ji#u#ji#w#ji#y#ji#z#ji's#ji(Y#ji(j#ji'q#ji!V#ji!k#jis#ji![#ji%d#ji!d#ji~P#/OOa$Oi!Y$Oi's$Oi'q$Oi!V$Oi!k$Ois$Oi![$Oi%d$Oi!d$Oi~P!:RO$Z.}O$].}O~O$Z/OO$]/OO~O!d)eO#]/PO![$aX$X$aX$Z$aX$]$aX$d$aX~O!X/QO~O![)hO$X/SO$Z)gO$])gO$d/TO~O!Y;PO!Z(^X~P#EoO!Z/UO~O!d)eO$d(sX~O$d/WO~Ou)wO(Z)xO([/ZO~O!V/_O~P!&kO(q%OOk%[a}%[a!P%[a(r%[a!Y%[a#]%[a~Og%[a#}%[a~P#NPO(r%QOk%^a}%^a!P%^a(q%^a!Y%^a#]%^a~Og%^a#}%^a~P#NrO!YfX!dfX!kfX!k$vX(jfX~P!/{O!X/hO!Y(YO'|/gO!V(nP!V(xP~P!1sOo*pO!_*nO!`*gO!a*gO!l*_O#X*oO%Z*jO'}!lO~Op'XO!P/iO!X+VO!Z*mO(OTO(RUO(];cO!Z(pP~P$!]O!k/jO~P#/OO!Y/kO!d#vO(j'mO!k(wX~O!k/pO~O!P%fO!X*[O![%gO'|%eO!k(wP~O#h/rO~O!V$vX!Y$vX!d$}X~P!/{O!Y/sO!V(xX~P#/OO!d/uO~O!V/wO~Oh%WOo/{O!d#vO!l%cO(j'mO~O'|/}O~O!d+eO~Oa%lO!Y0RO's%lO~O!Z0TO~P!5gO!`0UO!a0UO'}!lO(]!mO~O!P0WO(]!mO~O#X0XO~Og%[a!Y%[a#]%[a#}%[a~P!1UOg%^a!Y%^a#]%^a#}%^a~P!1UO'|&WOg'gX!Y'gX~O!Y*vOg(Va~Og0bO~OR0cO}0cO!P0dOkza(qza(rza!Yza#]za~Ogza#}za~P$(OO})|O!P)}Ok$oa(q$oa(r$oa!Y$oa#]$oa~Og$oa#}$oa~P$(tO})|O!P)}Ok$qa(q$qa(r$qa!Y$qa#]$qa~Og$qa#}$qa~P$)gO#h0fO~Og%Pa!Y%Pa#]%Pa#}%Pa~P!1UO!d#vO~O#h0iO~O!Y+XOa(|a's(|a~OR#{O}#zO!P#|O!j#xO!l#yO(YVOP!ri[!rio!ri!Y!ri!i!ri!p!ri#k!ri#l!ri#m!ri#n!ri#o!ri#p!ri#q!ri#r!ri#s!ri#u!ri#w!ri#y!ri#z!ri(j!ri(q!ri(r!ri~Oa!ri's!ri'q!ri!V!ri!k!ris!ri![!ri%d!ri!d!ri~P$+UOh%WOo$uOp$tOq$tOw%YOy%ZO{;YO!P$|O![$}O!f<jO!l$yO#g;`O$U%_O$p;[O$r;^O$u%`O(OTO(RUO(Y$vO(q%OO(r%QO~Om0sO'|0rO~P$-oO!d+eOa(Ua![(Ua's(Ua!Y(Ua~O#h0yO~O[]X!YfX!ZfX~O!Y0zO!Z)QX~O!Z0|O~O[0}O~Ob1PO'|+mO(OTO(RUO~O![%}O'|%eO`'oX!Y'oX~O!Y+rO`)Pa~O!k1SO~P!:RO[1VO~O`1WO~O#]1ZO~Ok1^O![$}O~O(](zO!Z(}P~Oh%WOk1gO![1dO%d1fO~O[1qO!Y1oO!Z)OX~O!Z1rO~O`1tOa%lO's%lO~O'|#nO(OTO(RUO~O#]$fO$P$fOP(_XR(_X[(_Xo(_X}(_X!P(_X!Y(_X!i(_X!l(_X!p(_X#k(_X#l(_X#m(_X#n(_X#o(_X#p(_X#q(_X#r(_X#u(_X#w(_X#y(_X#z(_X(Y(_X(j(_X(q(_X(r(_X~O#s1wO&U1xOa(_X!j(_X~P$3VO#]$fO#s1wO&U1xO~Oa1zO~P%[Oa1|O~O&_2POP&]iQ&]iS&]iY&]ia&]id&]ie&]im&]io&]ip&]iq&]iw&]iy&]i{&]i!P&]i!T&]i!U&]i![&]i!f&]i!l&]i!o&]i!p&]i!q&]i!s&]i!u&]i!x&]i!|&]i#t&]i$U&]i%c&]i%e&]i%g&]i%h&]i%i&]i%l&]i%n&]i%q&]i%r&]i%t&]i&Q&]i&W&]i&Y&]i&[&]i&^&]i&a&]i&g&]i&m&]i&o&]i&q&]i&s&]i&u&]i'q&]i'|&]i(O&]i(R&]i(Y&]i(h&]i(v&]i!Z&]ib&]i&d&]i~Ob2VO!Z2TO&d2UO~P`O![XO!l2XO~O&k,uOP&fiQ&fiS&fiY&fia&fid&fie&fim&fio&fip&fiq&fiw&fiy&fi{&fi!P&fi!T&fi!U&fi![&fi!f&fi!l&fi!o&fi!p&fi!q&fi!s&fi!u&fi!x&fi!|&fi#t&fi$U&fi%c&fi%e&fi%g&fi%h&fi%i&fi%l&fi%n&fi%q&fi%r&fi%t&fi&Q&fi&W&fi&Y&fi&[&fi&^&fi&a&fi&g&fi&m&fi&o&fi&q&fi&s&fi&u&fi'q&fi'|&fi(O&fi(R&fi(Y&fi(h&fi(v&fi!Z&fi&_&fib&fi&d&fi~O!V2_O~O!Y!^a!Z!^a~P#EoOp!nO!P!oO!X2eO(]!mO!Y'RX!Z'RX~P@]O!Y-VO!Z(aa~O!Y'XX!Z'XX~P!9ZO!Y-YO!Z(pa~O!Z2lO~P'_Oa%lO#]2uO's%lO~Oa%lO!d#vO#]2uO's%lO~Oa%lO!d#vO!p2yO#]2uO's%lO(j'mO~Oa%lO's%lO~P!:RO!Y$bOs$na~O!V'Qi!Y'Qi~P!:RO!Y(RO!V(`i~O!Y(YO!V(ni~O!V(oi!Y(oi~P!:RO!Y(li!k(lia(li's(li~P!:RO#]2{O!Y(li!k(lia(li's(li~O!Y(fO!k(ki~O!P%fO![%gO!|]O#f3QO#g3PO'|%eO~O!P%fO![%gO#g3PO'|%eO~Ok3XO![']O%d3WO~Oh%WOk3XO![']O%d3WO~O#h%[aP%[aR%[a[%[aa%[ao%[a!i%[a!j%[a!l%[a!p%[a#k%[a#l%[a#m%[a#n%[a#o%[a#p%[a#q%[a#r%[a#s%[a#u%[a#w%[a#y%[a#z%[a's%[a(Y%[a(j%[a!k%[a!V%[a'q%[as%[a![%[a%d%[a!d%[a~P#NPO#h%^aP%^aR%^a[%^aa%^ao%^a!i%^a!j%^a!l%^a!p%^a#k%^a#l%^a#m%^a#n%^a#o%^a#p%^a#q%^a#r%^a#s%^a#u%^a#w%^a#y%^a#z%^a's%^a(Y%^a(j%^a!k%^a!V%^a'q%^as%^a![%^a%d%^a!d%^a~P#NrO#h%[aP%[aR%[a[%[aa%[ao%[a!Y%[a!i%[a!j%[a!l%[a!p%[a#k%[a#l%[a#m%[a#n%[a#o%[a#p%[a#q%[a#r%[a#s%[a#u%[a#w%[a#y%[a#z%[a's%[a(Y%[a(j%[a!k%[a!V%[a'q%[a#]%[as%[a![%[a%d%[a!d%[a~P#/OO#h%^aP%^aR%^a[%^aa%^ao%^a!Y%^a!i%^a!j%^a!l%^a!p%^a#k%^a#l%^a#m%^a#n%^a#o%^a#p%^a#q%^a#r%^a#s%^a#u%^a#w%^a#y%^a#z%^a's%^a(Y%^a(j%^a!k%^a!V%^a'q%^a#]%^as%^a![%^a%d%^a!d%^a~P#/OO#hzaPza[zaazaoza!iza!jza!lza!pza#kza#lza#mza#nza#oza#pza#qza#rza#sza#uza#wza#yza#zza'sza(Yza(jza!kza!Vza'qzasza![za%dza!dza~P$(OO#h$oaP$oaR$oa[$oaa$oao$oa!i$oa!j$oa!l$oa!p$oa#k$oa#l$oa#m$oa#n$oa#o$oa#p$oa#q$oa#r$oa#s$oa#u$oa#w$oa#y$oa#z$oa's$oa(Y$oa(j$oa!k$oa!V$oa'q$oas$oa![$oa%d$oa!d$oa~P$(tO#h$qaP$qaR$qa[$qaa$qao$qa!i$qa!j$qa!l$qa!p$qa#k$qa#l$qa#m$qa#n$qa#o$qa#p$qa#q$qa#r$qa#s$qa#u$qa#w$qa#y$qa#z$qa's$qa(Y$qa(j$qa!k$qa!V$qa'q$qas$qa![$qa%d$qa!d$qa~P$)gO#h%PaP%PaR%Pa[%Paa%Pao%Pa!Y%Pa!i%Pa!j%Pa!l%Pa!p%Pa#k%Pa#l%Pa#m%Pa#n%Pa#o%Pa#p%Pa#q%Pa#r%Pa#s%Pa#u%Pa#w%Pa#y%Pa#z%Pa's%Pa(Y%Pa(j%Pa!k%Pa!V%Pa'q%Pa#]%Pas%Pa![%Pa%d%Pa!d%Pa~P#/OOa#`q!Y#`q's#`q'q#`q!V#`q!k#`qs#`q![#`q%d#`q!d#`q~P!:ROg'SX!Y'SX~P!(ZO!Y.nOg(ca~O!X3cO!Y'TX!k'TX~P%[O!Y.qO!k(da~O!Y.qO!k(da~P!:RO!V3fO~O#}!na!Z!na~PKVO#}!ga!Y!ga!Z!ga~P#EoO#}!ra!Z!ra~P!<lO#}!ta!Z!ta~P!?VOSfO![3xO$b3yO~O!Z3}O~Os4OO~P#/OOa$kq!Y$kq's$kq'q$kq!V$kq!k$kqs$kq![$kq%d$kq!d$kq~P!:RO!V4PO~P#/OO})|O!P)}O(r%QOk'ca(q'ca!Y'ca#]'ca~Og'ca#}'ca~P%,yO})|O!P)}Ok'ea(q'ea(r'ea!Y'ea#]'ea~Og'ea#}'ea~P%-lO(j$[O~P#/OO!VfX!V$vX!YfX!Y$vX!d$}X#]fX~P!/{O'|;lO~P!1sOmkO'|4RO~P.iO!P%fO!X4TO![%gO'|%eO!Y'_X!k'_X~O!Y/kO!k(wa~O!Y/kO!d#vO!k(wa~O!Y/kO!d#vO(j'mO!k(wa~Og$xi!Y$xi#]$xi#}$xi~P!1UO!X4]O!V'aX!Y'aX~P!3rO!Y/sO!V(xa~O!Y/sO!V(xa~P#/OO!d#vO#s4eO~Oo4hO!d#vO(j'mO~O(q%OOk%[i}%[i!P%[i(r%[i!Y%[i#]%[i~Og%[i#}%[i~P%1zO(r%QOk%^i}%^i!P%^i(q%^i!Y%^i#]%^i~Og%^i#}%^i~P%2mOg(Wi!Y(Wi~P!1UO#]4oOg(Wi!Y(Wi~P!1UO!k4rO~Oa$lq!Y$lq's$lq'q$lq!V$lq!k$lqs$lq![$lq%d$lq!d$lq~P!:RO!V4vO~O!Y4wO![(yX~P#/OO!j#xO~P4XOa$vX![$vX%X]X's$vX!Y$vX~P!/{O%X4yOalXklX}lX!PlX![lX'slX(qlX(rlX!YlX~O%X4yO~Ob5PO%e5QO'|+mO(OTO(RUO!Y'nX!Z'nX~O!Y0zO!Z)Qa~O[5UO~O`5VO~Oa%lO's%lO~P#/OO![$}O~P#/OO!Y5_O#]5aO!Z(}X~O!Z5bO~Op!nO!P5cO!_!yO!`!vO!a!vO!|:lO#Q!pO#R!pO#S!pO#T!pO#U!pO#X5hO#Y!zO'}!lO(OTO(RUO(]!mO(h!sO~O!Z5gO~P%8OOk5mO![1dO%d5lO~Oh%WOk5mO![1dO%d5lO~Ob5tO'|#nO(OTO(RUO!Y'mX!Z'mX~O!Y1oO!Z)Oa~O(OTO(RUO(]5vO~O`5zO~O#s5}O&U6OO~PMuO!k6PO~P%[Oa6RO~Oa6RO~P%[Ob2VO!Z6WO&d2UO~P`O!d6YO~O!d6[Oh(bi!Y(bi!Z(bi!d(bi!l(bi~O!Y#ei!Z#ei~P#EoO#]6]O!Y#ei!Z#ei~O!Y!^i!Z!^i~P#EoOa%lO#]6fO's%lO~Oa%lO!d#vO#]6fO's%lO~O!Y(lq!k(lqa(lq's(lq~P!:RO!Y(fO!k(kq~O!P%fO![%gO#g6mO'|%eO~O![']O%d6pO~Ok6sO![']O%d6pO~O#h'caP'caR'ca['caa'cao'ca!i'ca!j'ca!l'ca!p'ca#k'ca#l'ca#m'ca#n'ca#o'ca#p'ca#q'ca#r'ca#s'ca#u'ca#w'ca#y'ca#z'ca's'ca(Y'ca(j'ca!k'ca!V'ca'q'cas'ca!['ca%d'ca!d'ca~P%,yO#h'eaP'eaR'ea['eaa'eao'ea!i'ea!j'ea!l'ea!p'ea#k'ea#l'ea#m'ea#n'ea#o'ea#p'ea#q'ea#r'ea#s'ea#u'ea#w'ea#y'ea#z'ea's'ea(Y'ea(j'ea!k'ea!V'ea'q'eas'ea!['ea%d'ea!d'ea~P%-lO#h$xiP$xiR$xi[$xia$xio$xi!Y$xi!i$xi!j$xi!l$xi!p$xi#k$xi#l$xi#m$xi#n$xi#o$xi#p$xi#q$xi#r$xi#s$xi#u$xi#w$xi#y$xi#z$xi's$xi(Y$xi(j$xi!k$xi!V$xi'q$xi#]$xis$xi![$xi%d$xi!d$xi~P#/OO#h%[iP%[iR%[i[%[ia%[io%[i!i%[i!j%[i!l%[i!p%[i#k%[i#l%[i#m%[i#n%[i#o%[i#p%[i#q%[i#r%[i#s%[i#u%[i#w%[i#y%[i#z%[i's%[i(Y%[i(j%[i!k%[i!V%[i'q%[is%[i![%[i%d%[i!d%[i~P%1zO#h%^iP%^iR%^i[%^ia%^io%^i!i%^i!j%^i!l%^i!p%^i#k%^i#l%^i#m%^i#n%^i#o%^i#p%^i#q%^i#r%^i#s%^i#u%^i#w%^i#y%^i#z%^i's%^i(Y%^i(j%^i!k%^i!V%^i'q%^is%^i![%^i%d%^i!d%^i~P%2mOg'Sa!Y'Sa~P!1UO!Y'Ta!k'Ta~P!:RO!Y.qO!k(di~O#}#`i!Y#`i!Z#`i~P#EoOP$^OR#{O}#zO!P#|O!j#xO!l#yO!p$^O(YVO[#jio#ji!i#ji#l#ji#m#ji#n#ji#o#ji#p#ji#q#ji#r#ji#s#ji#u#ji#w#ji#y#ji#z#ji#}#ji(j#ji(q#ji(r#ji!Y#ji!Z#ji~O#k#ji~P%KOO#k:tO~P%KOOP$^OR#{O}#zO!P#|O!j#xO!l#yO!p$^O#k:tO#l:uO#m:uO#n:uO(YVO[#ji!i#ji#o#ji#p#ji#q#ji#r#ji#s#ji#u#ji#w#ji#y#ji#z#ji#}#ji(j#ji(q#ji(r#ji!Y#ji!Z#ji~Oo#ji~P%MZOo:vO~P%MZOP$^OR#{Oo:vO}#zO!P#|O!j#xO!l#yO!p$^O#k:tO#l:uO#m:uO#n:uO#o:wO(YVO#u#ji#w#ji#y#ji#z#ji#}#ji(j#ji(q#ji(r#ji!Y#ji!Z#ji~O[#ji!i#ji#p#ji#q#ji#r#ji#s#ji~P& fO[;SO!i:xO#p:xO#q:xO#r;RO#s:xO~P& fOP$^OR#{O[;SOo:vO}#zO!P#|O!i:xO!j#xO!l#yO!p$^O#k:tO#l:uO#m:uO#n:uO#o:wO#p:xO#q:xO#r;RO#s:xO#u:yO(YVO(r$OO#y#ji#z#ji#}#ji(j#ji(q#ji!Y#ji!Z#ji~O#w:{O~P&$QO#w#ji~P&$QOP$^OR#{O[;SOo:vO}#zO!P#|O!i:xO!j#xO!l#yO!p$^O#k:tO#l:uO#m:uO#n:uO#o:wO#p:xO#q:xO#r;RO#s:xO#u:yO(YVO#y#ji#z#ji#}#ji(j#ji!Y#ji!Z#ji~O#w#ji(q#ji(r#ji~P&&]O#w:{O(q#}O(r$OO~P&&]OP$^OR#{O[;SOo:vO}#zO!P#|O!i:xO!j#xO!l#yO!p$^O#k:tO#l:uO#m:uO#n:uO#o:wO#p:xO#q:xO#r;RO#s:xO#u:yO#w:{O#y:}O(YVO(q#}O(r$OO~O#z#ji#}#ji(j#ji!Y#ji!Z#ji~P&(nOa#{y!Y#{y's#{y'q#{y!V#{y!k#{ys#{y![#{y%d#{y!d#{y~P!:ROk<qO})|O!P)}O(q%OO(r%QO~OP#jiR#ji[#jio#ji!i#ji!j#ji!l#ji!p#ji#k#ji#l#ji#m#ji#n#ji#o#ji#p#ji#q#ji#r#ji#s#ji#u#ji#w#ji#y#ji#z#ji#}#ji(Y#ji(j#ji!Y#ji!Z#ji~P&+fO!j#xOP(XXR(XX[(XXk(XXo(XX}(XX!P(XX!i(XX!l(XX!p(XX#k(XX#l(XX#m(XX#n(XX#o(XX#p(XX#q(XX#r(XX#s(XX#u(XX#w(XX#y(XX#z(XX#}(XX(Y(XX(j(XX(q(XX(r(XX!Y(XX!Z(XX~O#}$Oi!Y$Oi!Z$Oi~P#EoO#}!ri!Z!ri~P$+UO!Z7VO~O!Y'^a!Z'^a~P#EoOP]XR]X[]Xo]X}]X!P]X!V]X!Y]X!i]X!j]X!l]X!p]X#]]X#hfX#k]X#l]X#m]X#n]X#o]X#p]X#q]X#r]X#s]X#u]X#w]X#y]X#z]X$P]X(Y]X(j]X(q]X(r]X~O!d%UX#s%UX~P&0hO!d#vO(j'mO!Y'_a!k'_a~O!Y/kO!k(wi~O!Y/kO!d#vO!k(wi~Og$xq!Y$xq#]$xq#}$xq~P!1UO!V'aa!Y'aa~P#/OO!d7^O~O!Y/sO!V(xi~P#/OO!Y/sO!V(xi~O!V7bO~O!d#vO#s7gO~Oo7hO!d#vO(j'mO~O})|O!P)}O(r%QOk'da(q'da!Y'da#]'da~Og'da#}'da~P&5WO})|O!P)}Ok'fa(q'fa(r'fa!Y'fa#]'fa~Og'fa#}'fa~P&5yO!V7jO~Og$zq!Y$zq#]$zq#}$zq~P!1UOa$ly!Y$ly's$ly'q$ly!V$ly!k$lys$ly![$ly%d$ly!d$ly~P!:RO!d6[O~O!Y4wO![(ya~Oa#`y!Y#`y's#`y'q#`y!V#`y!k#`ys#`y![#`y%d#`y!d#`y~P!:RO[7oO~Ob7qO'|+mO(OTO(RUO~O!Y0zO!Z)Qi~O`7uO~O(](zO!Y'jX!Z'jX~O!Y5_O!Z(}a~O!Z8OO~P%8OOp!nO!P8PO(OTO(RUO(]!mO(h!sO~O![1dO~O![1dO%d8RO~Ok8UO![1dO%d8RO~O[8ZO!Y'ma!Z'ma~O!Y1oO!Z)Oi~O!k8_O~O!k8`O~O!k8cO~O!k8cO~P%[Oa8eO~O!d8fO~O!k8gO~O!Y(oi!Z(oi~P#EoOa%lO#]8oO's%lO~O!Y(ly!k(lya(ly's(ly~P!:RO!Y(fO!k(ky~O![']O%d8rO~O#h$xqP$xqR$xq[$xqa$xqo$xq!Y$xq!i$xq!j$xq!l$xq!p$xq#k$xq#l$xq#m$xq#n$xq#o$xq#p$xq#q$xq#r$xq#s$xq#u$xq#w$xq#y$xq#z$xq's$xq(Y$xq(j$xq!k$xq!V$xq'q$xq#]$xqs$xq![$xq%d$xq!d$xq~P#/OO#h'daP'daR'da['daa'dao'da!i'da!j'da!l'da!p'da#k'da#l'da#m'da#n'da#o'da#p'da#q'da#r'da#s'da#u'da#w'da#y'da#z'da's'da(Y'da(j'da!k'da!V'da'q'das'da!['da%d'da!d'da~P&5WO#h'faP'faR'fa['faa'fao'fa!i'fa!j'fa!l'fa!p'fa#k'fa#l'fa#m'fa#n'fa#o'fa#p'fa#q'fa#r'fa#s'fa#u'fa#w'fa#y'fa#z'fa's'fa(Y'fa(j'fa!k'fa!V'fa'q'fas'fa!['fa%d'fa!d'fa~P&5yO#h$zqP$zqR$zq[$zqa$zqo$zq!Y$zq!i$zq!j$zq!l$zq!p$zq#k$zq#l$zq#m$zq#n$zq#o$zq#p$zq#q$zq#r$zq#s$zq#u$zq#w$zq#y$zq#z$zq's$zq(Y$zq(j$zq!k$zq!V$zq'q$zq#]$zqs$zq![$zq%d$zq!d$zq~P#/OO!Y'Ti!k'Ti~P!:RO#}#`q!Y#`q!Z#`q~P#EoO(q%OOP%[aR%[a[%[ao%[a!i%[a!j%[a!l%[a!p%[a#k%[a#l%[a#m%[a#n%[a#o%[a#p%[a#q%[a#r%[a#s%[a#u%[a#w%[a#y%[a#z%[a#}%[a(Y%[a(j%[a!Y%[a!Z%[a~Ok%[a}%[a!P%[a(r%[a~P&GUO(r%QOP%^aR%^a[%^ao%^a!i%^a!j%^a!l%^a!p%^a#k%^a#l%^a#m%^a#n%^a#o%^a#p%^a#q%^a#r%^a#s%^a#u%^a#w%^a#y%^a#z%^a#}%^a(Y%^a(j%^a!Y%^a!Z%^a~Ok%^a}%^a!P%^a(q%^a~P&I]Ok<qO})|O!P)}O(r%QO~P&GUOk<qO})|O!P)}O(q%OO~P&I]OR0cO}0cO!P0dOPza[zakzaoza!iza!jza!lza!pza#kza#lza#mza#nza#oza#pza#qza#rza#sza#uza#wza#yza#zza#}za(Yza(jza(qza(rza!Yza!Zza~O})|O!P)}OP$oaR$oa[$oak$oao$oa!i$oa!j$oa!l$oa!p$oa#k$oa#l$oa#m$oa#n$oa#o$oa#p$oa#q$oa#r$oa#s$oa#u$oa#w$oa#y$oa#z$oa#}$oa(Y$oa(j$oa(q$oa(r$oa!Y$oa!Z$oa~O})|O!P)}OP$qaR$qa[$qak$qao$qa!i$qa!j$qa!l$qa!p$qa#k$qa#l$qa#m$qa#n$qa#o$qa#p$qa#q$qa#r$qa#s$qa#u$qa#w$qa#y$qa#z$qa#}$qa(Y$qa(j$qa(q$qa(r$qa!Y$qa!Z$qa~OP%PaR%Pa[%Pao%Pa!i%Pa!j%Pa!l%Pa!p%Pa#k%Pa#l%Pa#m%Pa#n%Pa#o%Pa#p%Pa#q%Pa#r%Pa#s%Pa#u%Pa#w%Pa#y%Pa#z%Pa#}%Pa(Y%Pa(j%Pa!Y%Pa!Z%Pa~P&+fO#}$kq!Y$kq!Z$kq~P#EoO#}$lq!Y$lq!Z$lq~P#EoO!Z9OO~O#}9PO~P!1UO!d#vO!Y'_i!k'_i~O!d#vO(j'mO!Y'_i!k'_i~O!Y/kO!k(wq~O!V'ai!Y'ai~P#/OO!Y/sO!V(xq~O!V9VO~P#/OO!V9VO~Og(Wy!Y(Wy~P!1UO!Y'ha!['ha~P#/OOa%Wq![%Wq's%Wq!Y%Wq~P#/OO[9[O~O!Y0zO!Z)Qq~O#]9`O!Y'ja!Z'ja~O!Y5_O!Z(}i~P#EoO![1dO%d9dO~O(OTO(RUO(]9iO~O!Y1oO!Z)Oq~O!k9lO~O!k9mO~O!k9nO~O!k9nO~P%[O#]9qO!Y#ey!Z#ey~O!Y#ey!Z#ey~P#EoO![']O%d9vO~O#}#{y!Y#{y!Z#{y~P#EoOP$xiR$xi[$xio$xi!i$xi!j$xi!l$xi!p$xi#k$xi#l$xi#m$xi#n$xi#o$xi#p$xi#q$xi#r$xi#s$xi#u$xi#w$xi#y$xi#z$xi#}$xi(Y$xi(j$xi!Y$xi!Z$xi~P&+fO})|O!P)}O(r%QOP'caR'ca['cak'cao'ca!i'ca!j'ca!l'ca!p'ca#k'ca#l'ca#m'ca#n'ca#o'ca#p'ca#q'ca#r'ca#s'ca#u'ca#w'ca#y'ca#z'ca#}'ca(Y'ca(j'ca(q'ca!Y'ca!Z'ca~O})|O!P)}OP'eaR'ea['eak'eao'ea!i'ea!j'ea!l'ea!p'ea#k'ea#l'ea#m'ea#n'ea#o'ea#p'ea#q'ea#r'ea#s'ea#u'ea#w'ea#y'ea#z'ea#}'ea(Y'ea(j'ea(q'ea(r'ea!Y'ea!Z'ea~O(q%OOP%[iR%[i[%[ik%[io%[i}%[i!P%[i!i%[i!j%[i!l%[i!p%[i#k%[i#l%[i#m%[i#n%[i#o%[i#p%[i#q%[i#r%[i#s%[i#u%[i#w%[i#y%[i#z%[i#}%[i(Y%[i(j%[i(r%[i!Y%[i!Z%[i~O(r%QOP%^iR%^i[%^ik%^io%^i}%^i!P%^i!i%^i!j%^i!l%^i!p%^i#k%^i#l%^i#m%^i#n%^i#o%^i#p%^i#q%^i#r%^i#s%^i#u%^i#w%^i#y%^i#z%^i#}%^i(Y%^i(j%^i(q%^i!Y%^i!Z%^i~O#}$ly!Y$ly!Z$ly~P#EoO#}#`y!Y#`y!Z#`y~P#EoO!d#vO!Y'_q!k'_q~O!Y/kO!k(wy~O!V'aq!Y'aq~P#/OO!V:PO~P#/OO!Y0zO!Z)Qy~O!Y5_O!Z(}q~O![1dO%d:WO~O!k:ZO~O![']O%d:`O~OP$xqR$xq[$xqo$xq!i$xq!j$xq!l$xq!p$xq#k$xq#l$xq#m$xq#n$xq#o$xq#p$xq#q$xq#r$xq#s$xq#u$xq#w$xq#y$xq#z$xq#}$xq(Y$xq(j$xq!Y$xq!Z$xq~P&+fO})|O!P)}O(r%QOP'daR'da['dak'dao'da!i'da!j'da!l'da!p'da#k'da#l'da#m'da#n'da#o'da#p'da#q'da#r'da#s'da#u'da#w'da#y'da#z'da#}'da(Y'da(j'da(q'da!Y'da!Z'da~O})|O!P)}OP'faR'fa['fak'fao'fa!i'fa!j'fa!l'fa!p'fa#k'fa#l'fa#m'fa#n'fa#o'fa#p'fa#q'fa#r'fa#s'fa#u'fa#w'fa#y'fa#z'fa#}'fa(Y'fa(j'fa(q'fa(r'fa!Y'fa!Z'fa~OP$zqR$zq[$zqo$zq!i$zq!j$zq!l$zq!p$zq#k$zq#l$zq#m$zq#n$zq#o$zq#p$zq#q$zq#r$zq#s$zq#u$zq#w$zq#y$zq#z$zq#}$zq(Y$zq(j$zq!Y$zq!Z$zq~P&+fOg%`!Z!Y%`!Z#]%`!Z#}%`!Z~P!1UO!Y'jq!Z'jq~P#EoO!Y#e!Z!Z#e!Z~P#EoO#h%`!ZP%`!ZR%`!Z[%`!Za%`!Zo%`!Z!Y%`!Z!i%`!Z!j%`!Z!l%`!Z!p%`!Z#k%`!Z#l%`!Z#m%`!Z#n%`!Z#o%`!Z#p%`!Z#q%`!Z#r%`!Z#s%`!Z#u%`!Z#w%`!Z#y%`!Z#z%`!Z's%`!Z(Y%`!Z(j%`!Z!k%`!Z!V%`!Z'q%`!Z#]%`!Zs%`!Z![%`!Z%d%`!Z!d%`!Z~P#/OOP%`!ZR%`!Z[%`!Zo%`!Z!i%`!Z!j%`!Z!l%`!Z!p%`!Z#k%`!Z#l%`!Z#m%`!Z#n%`!Z#o%`!Z#p%`!Z#q%`!Z#r%`!Z#s%`!Z#u%`!Z#w%`!Z#y%`!Z#z%`!Z#}%`!Z(Y%`!Z(j%`!Z!Y%`!Z!Z%`!Z~P&+fOs(^X~P1qO}%pO~P!*mO'}!lO~P!*mO!VfX!YfX#]fX~P&0hOP]XR]X[]Xo]X}]X!P]X!Y]X!YfX!i]X!j]X!l]X!p]X#]]X#]fX#hfX#k]X#l]X#m]X#n]X#o]X#p]X#q]X#r]X#s]X#u]X#w]X#y]X#z]X$P]X(Y]X(j]X(q]X(r]X~O!dfX!k]X!kfX(jfX~P'EaOP:kOQ:kOSfOd<fOe!iOmkOo:kOpkOqkOwkOy:kO{:kO!PWO!TkO!UkO![XO!f:nO!lZO!o:kO!p:kO!q:kO!s:oO!u:rO!x!hO$U!kO'|)[O(OTO(RUO(YVO(h[O(v<dO~O!Y;PO!Z$na~Oh%WOm%XOo$uOp$tOq$tOw%YOy%ZO{;ZO!P$|O![$}O!f<kO!l$yO#g;aO$U%_O$p;]O$r;_O$u%`O'|(rO(OTO(RUO(Y$vO(q%OO(r%QO~O#t)cO~P'JVOo!bX(j!bX~P# xO!Z]X!ZfX~P'EaO!VfX!V$vX!YfX!Y$vX#]fX~P!/{O#h:sO~O!d#vO#h:sO~O#];TO~O#s:xO~O#];dO!Y(oX!Z(oX~O#];TO!Y(mX!Z(mX~O#h;eO~Og;gO~P!1UO#h;mO~O#h;nO~O!d#vO#h;oO~O!d#vO#h;eO~O#};pO~P#EoO#h;qO~O#h;rO~O#h;wO~O#h;xO~O#h;yO~O#h;zO~O#};{O~P!1UO#};|O~P!1UO!j#Q#R#T#U#X#f#g#r(v$p$r$u%X%c%d%e%l%n%q%r%t%v~'wT#l!U'u'}#mp#k#no}'v$Z'v'|$](]~",goto:"$4d)UPPPPPP)VPP)YP)kP*{/QPPPP5xPP6`PP<V?lP@PP@PPPP@PPBPP@PP@PP@PPBTPBYPBwPGpPPPGtPPPPGtJvPPPJ|KxPGtPGtNWPPPP!!fGtPPPGtPGtP!$tGtP!(Z!)]!)fP!*Y!*^!*YPPPPP!-j!)]PP!-z!.tP!1hGtGt!1m!4x!9`!9`!=^PPP!=fGtPPPPPPPPPPP!@tP!BRPPGt!CdPGtPGtGtGtGtPGt!DvP!HPP!KUP!KY!Kd!Kh!KhP!G|P!Kl!KlP!NqP!NuGtGt!N{#$P@PP@PP@P@PP#%]@P@P#'g@P#*V@P#,Z@P@P#,y#/V#/V#/[#/e#/V#/nP#/VP@P#0W@P#3w@P@P5xPPP#7nPPP#8X#8XP#8XP#8o#8XPP#8uP#8lP#8l#9Y#8l#9t#9z5u)Y#9})YP#:U#:U#:UP)YP)YP)YP)YPP)YP#:[#:_P#:_)YP#:cP#:fP)YP)YP)YP)YP)YP)Y)YPP#:l#:r#:}#;T#;Z#;a#;g#;u#;{#<R#<]#<c#<m#<}#=T#=u#>X#>_#>e#>s#?Y#@w#AV#A^#Br#CQ#Dl#Dz#EQ#EW#E^#Eh#En#Et#FO#Fb#FhPPPPPPPPPP#FnPPPPPPP#Gc#Jj#Ky#LQ#LYPPPP$#`$&W$,p$,s$,v$-c$-f$-i$-p$-xP$.OP$.l$.p$/h$0v$0{$1cPP$1h$1n$1rP$1u$1y$1}$2s$3[$3s$3w$3z$3}$4T$4W$4[$4`R!|RoqOXst!Z#d%k&o&q&r&t,m,r2P2SY!vQ']-_1d5fQ%rvQ%zyQ&R|Q&g!VS'T!e-VQ'c!iS'i!r!yU*g$}*X*lQ+k%{Q+x&TQ,^&aQ-]'[Q-g'dQ-o'jQ0U*nQ1n,_R;b:o%QdOPWXYZstuvw!Z!`!g!o#S#W#Z#d#o#u#y#|$P$Q$R$S$T$U$V$W$X$Y$Z$b$f%k%r&P&h&k&o&q&r&t&x'Q'_'o(P(R(X(`(t(x(|){+S+W,j,m,r-c-k-y.P.q.x/i0d0i0y1g1w1x1z1|2P2S2U2u2{3c5c5m5}6O6R6f8P8U8e8oS#q]:l!r)^$]$n'U)p-O-R/Q2e3x5a6]9`9q:k:n:o:r:s:t:u:v:w:x:y:z:{:|:};O;P;T;b;d;e;g;o;p;y;z<gQ*y%[Q+p%}Q,`&dQ,g&lQ.h;YQ0p+cQ0t+eQ1P+qQ1v,eQ3T.aQ5P0zQ5t1oQ6r3XQ7O;ZQ7q5QR8u6s'OkOPWXYZstuvw!Z!`!g!o#S#W#Z#d#o#u#y#|$P$Q$R$S$T$U$V$W$X$Y$Z$]$b$f$n%k%r&P&h&k&l&o&q&r&t&x'Q'U'_'o(P(R(X(`(t(x(|)p){+S+W+c,j,m,r-O-R-c-k-y.P.a.q.x/Q/i0d0i0y1g1w1x1z1|2P2S2U2e2u2{3X3c3x5a5c5m5}6O6R6]6f6s8P8U8e8o9`9q:k:n:o:r:s:t:u:v:w:x:y:z:{:|:};O;P;T;b;d;e;g;o;p;y;z<gt!nQ!r!v!y!z'T'[']'i'j'k-V-]-_-o1d5f5h$z$ti#v#x$d$e$y$|%P%R%]%^%b)w)}*P*R*T*W*^*d*t*u+b+e+|,P.`.n/`/h/r/s/u0Y0[0f1Z1^1f3W4Q4]4e4o4w4y5l6p7^7g8R8r9P9d9v:W:`;R;S;U;V;W;X;[;];^;_;`;a;h;i;j;k;m;n;q;r;s;t;u;v;w;x;{;|<d<l<m<p<qQ&U|Q'R!eU'X%g*X-YQ+p%}Q,`&dQ0e*}Q1P+qQ1U+wQ1u,dQ1v,eQ5P0zQ5Y1WQ5t1oQ5w1qQ5x1tQ7q5QQ7t5VQ8^5zQ9_7uR9j8ZrnOXst!V!Z#d%k&f&o&q&r&t,m,r2P2SR,b&h&x^OPXYstuvwz!Z!`!g!j!o#S#d#o#u#y#|$P$Q$R$S$T$U$V$W$X$Y$Z$]$b$f$n%k%r&P&h&k&l&o&q&r&t&x'Q'_'o(R(X(`(t(x(|)p){+S+W+c,j,m,r-O-R-c-k-y.P.a.q.x/Q/i0d0i0y1g1w1x1z1|2P2S2U2e2u2{3X3c3x5a5c5m5}6O6R6]6f6s8P8U8e8o9`9q:k:n:o:r:s:t:u:v:w:x:y:z:{:|:};O;P;T;b;d;e;g;o;p;y;z<f<g[#]WZ#W#Z'U(P!b%hm#h#i#l$y%c%f(Y(d(e(f*W*[*_+U+V+X,i-P-}.T.U.V.X/h/k2X3P3Q4T6[6mQ%uxQ%yyS&O|&TQ&[!TQ'`!hQ'b!iQ(m#sS+j%z%{Q+n%}Q,X&_Q,]&aS-f'c'dQ.c(nQ0x+kQ1O+qQ1Q+rQ1T+vQ1i,YS1m,^,_Q2q-gQ5O0zQ5S0}Q5X1VQ5s1nQ7p5QQ7s5UQ9Z7oR:R9[!O${i#x%P%R%]%^%b*P*R*^*t*u.n/r0Y0[0f4Q4o9P<d<l<m!S%wy!i!u%y%z%{'S'b'c'd'h'r*f+j+k-S-f-g-n/|0x2j2q2x4gQ+d%uQ+}&XQ,Q&YQ,[&aQ.b(mQ1h,XU1l,],^,_Q3Y.cQ5n1iS5r1m1nQ8Y5s#[<h#v$d$e$y$|)w)}*T*W*d+b+e+|,P.`/`/h/s/u1Z1^1f3W4]4e4w4y5l6p7^7g8R8r9d9v:W:`;U;W;[;^;`;h;j;m;q;s;u;w;{<p<qo<i;R;S;V;X;];_;a;i;k;n;r;t;v;x;|W%Ui%W*v<dS&X!Q&fQ&Y!RQ&Z!SR+{&V${%Ti#v#x$d$e$y$|%P%R%]%^%b)w)}*P*R*T*W*^*d*t*u+b+e+|,P.`.n/`/h/r/s/u0Y0[0f1Z1^1f3W4Q4]4e4o4w4y5l6p7^7g8R8r9P9d9v:W:`;R;S;U;V;W;X;[;];^;_;`;a;h;i;j;k;m;n;q;r;s;t;u;v;w;x;{;|<d<l<m<p<qT)x$v)yV*z%[;Y;ZW'X!e%g*X-YS({#z#{Q+_%pQ+u&QS.[(i(jQ1_,RQ4p0cR7y5_'OkOPWXYZstuvw!Z!`!g!o#S#W#Z#d#o#u#y#|$P$Q$R$S$T$U$V$W$X$Y$Z$]$b$f$n%k%r&P&h&k&l&o&q&r&t&x'Q'U'_'o(P(R(X(`(t(x(|)p){+S+W+c,j,m,r-O-R-c-k-y.P.a.q.x/Q/i0d0i0y1g1w1x1z1|2P2S2U2e2u2{3X3c3x5a5c5m5}6O6R6]6f6s8P8U8e8o9`9q:k:n:o:r:s:t:u:v:w:x:y:z:{:|:};O;P;T;b;d;e;g;o;p;y;z<g$i$ac#Y#e%o%q%s(O(U(p(w)P)Q)R)S)T)U)V)W)X)Y)Z)])`)d)n+`+t-T-r-w-|.O.m.s.w.y.z.{/[0g2`2c2s2z3b3g3h3i3j3k3l3m3n3o3p3q3r3s3v3w3|4t4|6_6e6j6x6y7S7T7{8i8m8v8|8}9s:T:[:m<ZT#TV#U'PkOPWXYZstuvw!Z!`!g!o#S#W#Z#d#o#u#y#|$P$Q$R$S$T$U$V$W$X$Y$Z$]$b$f$n%k%r&P&h&k&l&o&q&r&t&x'Q'U'_'o(P(R(X(`(t(x(|)p){+S+W+c,j,m,r-O-R-c-k-y.P.a.q.x/Q/i0d0i0y1g1w1x1z1|2P2S2U2e2u2{3X3c3x5a5c5m5}6O6R6]6f6s8P8U8e8o9`9q:k:n:o:r:s:t:u:v:w:x:y:z:{:|:};O;P;T;b;d;e;g;o;p;y;z<gQ'V!eR2f-Vv!nQ!e!r!v!y!z'T'[']'i'j'k-V-]-_-o1d5f5hU*f$}*X*lS/|*g*nQ0V*oQ1a,TQ4g0UR4j0XnqOXst!Z#d%k&o&q&r&t,m,r2P2SQ&v!^Q's!xS(o#u:sQ+h%xQ,V&[Q,W&^Q-d'aQ-q'lS.l(t;eS0h+S;oQ0v+iQ1c,UQ2W,tQ2Y,uQ2b-QQ2o-eQ2r-iS4u0i;yQ4z0wS4}0y;zQ6^2dQ6b2pQ6g2wQ7n4{Q8j6`Q8k6cQ8n6hR9p8g$d$`c#Y#e%q%s(O(U(p(w)P)Q)R)S)T)U)V)W)X)Y)Z)])`)d)n+`+t-T-r-w-|.O.m.s.w.z.{/[0g2`2c2s2z3b3g3h3i3j3k3l3m3n3o3p3q3r3s3v3w3|4t4|6_6e6j6x6y7S7T7{8i8m8v8|8}9s:T:[:m<ZS(l#p'fU*s%S(s3uS+^%o.yQ3U0pQ6o3TQ8t6rR9w8u$d$_c#Y#e%q%s(O(U(p(w)P)Q)R)S)T)U)V)W)X)Y)Z)])`)d)n+`+t-T-r-w-|.O.m.s.w.z.{/[0g2`2c2s2z3b3g3h3i3j3k3l3m3n3o3p3q3r3s3v3w3|4t4|6_6e6j6x6y7S7T7{8i8m8v8|8}9s:T:[:m<ZS(k#p'fS(}#{$`S+]%o.yS.](j(lQ.|)_Q0m+^R3R.^'OkOPWXYZstuvw!Z!`!g!o#S#W#Z#d#o#u#y#|$P$Q$R$S$T$U$V$W$X$Y$Z$]$b$f$n%k%r&P&h&k&l&o&q&r&t&x'Q'U'_'o(P(R(X(`(t(x(|)p){+S+W+c,j,m,r-O-R-c-k-y.P.a.q.x/Q/i0d0i0y1g1w1x1z1|2P2S2U2e2u2{3X3c3x5a5c5m5}6O6R6]6f6s8P8U8e8o9`9q:k:n:o:r:s:t:u:v:w:x:y:z:{:|:};O;P;T;b;d;e;g;o;p;y;z<gS#q]:lQ&q!XQ&r!YQ&t![Q&u!]R2O,pQ'^!hQ+a%uQ-b'`S._(m+dQ2m-aW3V.b.c0o0qQ6a2nU6n3S3U3YS8q6o6qS9u8s8tS:^9t9wQ:f:_R:i:gU!wQ']-_T5d1d5f!Q_OXZ`st!V!Z#d#h%c%k&f&h&o&q&r&t(f,m,r.U2P2S]!pQ!r']-_1d5fT#q]:l%[{OPWXYZstuvw!Z!`!g!o#S#W#Z#d#o#u#y#|$P$Q$R$S$T$U$V$W$X$Y$Z$b$f%k%r&P&h&k&l&o&q&r&t&x'Q'_'o(P(R(X(`(t(x(|){+S+W+c,j,m,r-c-k-y.P.a.q.x/i0d0i0y1g1w1x1z1|2P2S2U2u2{3X3c5c5m5}6O6R6f6s8P8U8e8oS({#z#{S.[(i(j!s<Q$]$n'U)p-O-R/Q2e3x5a6]9`9q:k:n:o:r:s:t:u:v:w:x:y:z:{:|:};O;P;T;b;d;e;g;o;p;y;z<gm!tQ!r!v!y!z']'i'j'k-_-o1d5f5hQ'q!uS(b#g1yS-m'h'tQ/n*ZQ/z*fQ2y-pQ4X/oS4b/{0VQ7Y4SS7e4h4jQ9R7ZR9Y7hQ#wbQ'p!uS(a#g1yS(c#m+RQ+T%dQ+f%vQ+l%|U-l'h'q'tQ.Q(bQ/m*ZQ/y*fQ0P*iQ0u+gQ1j,ZS2v-m-pQ3O.YS4W/n/oS4a/z0VQ4d0OQ4f0QQ5p1kQ6i2yQ7X4SQ7]4XS7a4b4jQ7f4iQ8W5qS9Q7Y7ZQ9U7bQ9W7eQ9g8XQ9}9RQ:O9VQ:Q9YQ:Y9hQ:b:PQ<T<OQ<`<XR<a<YV!wQ']-_%[aOPWXYZstuvw!Z!`!g!o#S#W#Z#d#o#u#y#|$P$Q$R$S$T$U$V$W$X$Y$Z$b$f%k%r&P&h&k&l&o&q&r&t&x'Q'_'o(P(R(X(`(t(x(|){+S+W+c,j,m,r-c-k-y.P.a.q.x/i0d0i0y1g1w1x1z1|2P2S2U2u2{3X3c5c5m5}6O6R6f6s8P8U8e8oS#wz!j!r;}$]$n'U)p-O-R/Q2e3x5a6]9`9q:k:n:o:r:s:t:u:v:w:x:y:z:{:|:};O;P;T;b;d;e;g;o;p;y;z<gR<T<f%[bOPWXYZstuvw!Z!`!g!o#S#W#Z#d#o#u#y#|$P$Q$R$S$T$U$V$W$X$Y$Z$b$f%k%r&P&h&k&l&o&q&r&t&x'Q'_'o(P(R(X(`(t(x(|){+S+W+c,j,m,r-c-k-y.P.a.q.x/i0d0i0y1g1w1x1z1|2P2S2U2u2{3X3c5c5m5}6O6R6f6s8P8U8e8oQ%dj!S%vy!i!u%y%z%{'S'b'c'd'h'r*f+j+k-S-f-g-n/|0x2j2q2x4gS%|z!jQ+g%wQ,Z&aW1k,[,],^,_U5q1l1m1nS8X5r5sQ9h8Y!r<O$]$n'U)p-O-R/Q2e3x5a6]9`9q:k:n:o:r:s:t:u:v:w:x:y:z:{:|:};O;P;T;b;d;e;g;o;p;y;z<gQ<X<eR<Y<f%OeOPXYstuvw!Z!`!g!o#S#d#o#u#y#|$P$Q$R$S$T$U$V$W$X$Y$Z$b$f%k%r&P&h&k&o&q&r&t&x'Q'_'o(R(X(`(t(x(|){+S+W+c,j,m,r-c-k-y.P.a.q.x/i0d0i0y1g1w1x1z1|2P2S2U2u2{3X3c5c5m5}6O6R6f6s8P8U8e8oY#bWZ#W#Z(P!b%hm#h#i#l$y%c%f(Y(d(e(f*W*[*_+U+V+X,i-P-}.T.U.V.X/h/k2X3P3Q4T6[6mQ,h&l!p<P$]$n)p-O-R/Q2e3x5a6]9`9q:k:n:o:r:s:t:u:v:w:x:y:z:{:|:};O;P;T;b;d;e;g;o;p;y;z<gR<S'UU'Y!e%g*XR2h-Y%QdOPWXYZstuvw!Z!`!g!o#S#W#Z#d#o#u#y#|$P$Q$R$S$T$U$V$W$X$Y$Z$b$f%k%r&P&h&k&o&q&r&t&x'Q'_'o(P(R(X(`(t(x(|){+S+W,j,m,r-c-k-y.P.q.x/i0d0i0y1g1w1x1z1|2P2S2U2u2{3c5c5m5}6O6R6f8P8U8e8o!r)^$]$n'U)p-O-R/Q2e3x5a6]9`9q:k:n:o:r:s:t:u:v:w:x:y:z:{:|:};O;P;T;b;d;e;g;o;p;y;z<gQ,g&lQ0p+cQ3T.aQ6r3XR8u6s!b$Vc#Y%o(O(U(p(w)Y)Z)`)d+t-r-w-|.O.m.s/[0g2s2z3b3s4t4|6e6j6x8m9s:m!P:z)])n-T.y2`2c3g3q3r3v3|6_6y7S7T7{8i8v8|8}:T:[<Z!f$Xc#Y%o(O(U(p(w)V)W)Y)Z)`)d+t-r-w-|.O.m.s/[0g2s2z3b3s4t4|6e6j6x8m9s:m!T:|)])n-T.y2`2c3g3n3o3q3r3v3|6_6y7S7T7{8i8v8|8}:T:[<Z!^$]c#Y%o(O(U(p(w)`)d+t-r-w-|.O.m.s/[0g2s2z3b3s4t4|6e6j6x8m9s:mQ4Q/fz<g)])n-T.y2`2c3g3v3|6_6y7S7T7{8i8v8|8}:T:[<ZQ<l<nR<m<o'OkOPWXYZstuvw!Z!`!g!o#S#W#Z#d#o#u#y#|$P$Q$R$S$T$U$V$W$X$Y$Z$]$b$f$n%k%r&P&h&k&l&o&q&r&t&x'Q'U'_'o(P(R(X(`(t(x(|)p){+S+W+c,j,m,r-O-R-c-k-y.P.a.q.x/Q/i0d0i0y1g1w1x1z1|2P2S2U2e2u2{3X3c3x5a5c5m5}6O6R6]6f6s8P8U8e8o9`9q:k:n:o:r:s:t:u:v:w:x:y:z:{:|:};O;P;T;b;d;e;g;o;p;y;z<gS$oh$pR3y/P'VgOPWXYZhstuvw!Z!`!g!o#S#W#Z#d#o#u#y#|$P$Q$R$S$T$U$V$W$X$Y$Z$]$b$f$n$p%k%r&P&h&k&l&o&q&r&t&x'Q'U'_'o(P(R(X(`(t(x(|)p){+S+W+c,j,m,r-O-R-c-k-y.P.a.q.x/P/Q/i0d0i0y1g1w1x1z1|2P2S2U2e2u2{3X3c3x5a5c5m5}6O6R6]6f6s8P8U8e8o9`9q:k:n:o:r:s:t:u:v:w:x:y:z:{:|:};O;P;T;b;d;e;g;o;p;y;z<gT$kf$qQ$ifS)g$l)kR)s$qT$jf$qT)i$l)k'VhOPWXYZhstuvw!Z!`!g!o#S#W#Z#d#o#u#y#|$P$Q$R$S$T$U$V$W$X$Y$Z$]$b$f$n$p%k%r&P&h&k&l&o&q&r&t&x'Q'U'_'o(P(R(X(`(t(x(|)p){+S+W+c,j,m,r-O-R-c-k-y.P.a.q.x/P/Q/i0d0i0y1g1w1x1z1|2P2S2U2e2u2{3X3c3x5a5c5m5}6O6R6]6f6s8P8U8e8o9`9q:k:n:o:r:s:t:u:v:w:x:y:z:{:|:};O;P;T;b;d;e;g;o;p;y;z<gT$oh$pQ$rhR)r$p%[jOPWXYZstuvw!Z!`!g!o#S#W#Z#d#o#u#y#|$P$Q$R$S$T$U$V$W$X$Y$Z$b$f%k%r&P&h&k&l&o&q&r&t&x'Q'_'o(P(R(X(`(t(x(|){+S+W+c,j,m,r-c-k-y.P.a.q.x/i0d0i0y1g1w1x1z1|2P2S2U2u2{3X3c5c5m5}6O6R6f6s8P8U8e8o!s<e$]$n'U)p-O-R/Q2e3x5a6]9`9q:k:n:o:r:s:t:u:v:w:x:y:z:{:|:};O;P;T;b;d;e;g;o;p;y;z<g#elOPXZst!Z!`!o#S#d#o#|$n%k&h&k&l&o&q&r&t&x'Q'_(|)p+W+c,j,m,r-c.a/Q/i0d1g1w1x1z1|2P2S2U3X3x5c5m5}6O6R6s8P8U8e!O%Si#x%P%R%]%^%b*P*R*^*t*u.n/r0Y0[0f4Q4o9P<d<l<m#[(s#v$d$e$y$|)w)}*T*W*d+b+e+|,P.`/`/h/s/u1Z1^1f3W4]4e4w4y5l6p7^7g8R8r9d9v:W:`;U;W;[;^;`;h;j;m;q;s;u;w;{<p<qQ+O%`Q/])|o3u;R;S;V;X;];_;a;i;k;n;r;t;v;x;|!O$zi#x%P%R%]%^%b*P*R*^*t*u.n/r0Y0[0f4Q4o9P<d<l<mQ*`${U*i$}*X*lQ+P%aQ0Q*j#[<V#v$d$e$y$|)w)}*T*W*d+b+e+|,P.`/`/h/s/u1Z1^1f3W4]4e4w4y5l6p7^7g8R8r9d9v:W:`;U;W;[;^;`;h;j;m;q;s;u;w;{<p<qn<W;R;S;V;X;];_;a;i;k;n;r;t;v;x;|Q<[<hQ<]<iQ<^<jR<_<k!O%Si#x%P%R%]%^%b*P*R*^*t*u.n/r0Y0[0f4Q4o9P<d<l<m#[(s#v$d$e$y$|)w)}*T*W*d+b+e+|,P.`/`/h/s/u1Z1^1f3W4]4e4w4y5l6p7^7g8R8r9d9v:W:`;U;W;[;^;`;h;j;m;q;s;u;w;{<p<qo3u;R;S;V;X;];_;a;i;k;n;r;t;v;x;|noOXst!Z#d%k&o&q&r&t,m,r2P2SS*c$|*WQ,{&{Q,|&}R4[/s$z%Ti#v#x$d$e$y$|%P%R%]%^%b)w)}*P*R*T*W*^*d*t*u+b+e+|,P.`.n/`/h/r/s/u0Y0[0f1Z1^1f3W4Q4]4e4o4w4y5l6p7^7g8R8r9P9d9v:W:`;R;S;U;V;W;X;[;];^;_;`;a;h;i;j;k;m;n;q;r;s;t;u;v;w;x;{;|<d<l<m<p<qQ,O&YQ1],QQ5]1[R7x5^V*k$}*X*lU*k$}*X*lT5e1d5fU0O*h/i5cT4i0W8PQ+f%vQ0P*iQ0u+gQ1j,ZQ5p1kQ8W5qQ9g8XR:Y9h!O%Pi#x%P%R%]%^%b*P*R*^*t*u.n/r0Y0[0f4Q4o9P<d<l<mr*P$w(u*Q*r+Q/q0^0_3`4Y4s7W7i9|<U<b<cS0Y*q0Z#[;U#v$d$e$y$|)w)}*T*W*d+b+e+|,P.`/`/h/s/u1Z1^1f3W4]4e4w4y5l6p7^7g8R8r9d9v:W:`;U;W;[;^;`;h;j;m;q;s;u;w;{<p<qn;V;R;S;V;X;];_;a;i;k;n;r;t;v;x;|!^;h(q)b*Y*b.d.g.k/X/^/f/v0n1Y1[3]4Z4_5[5^6t6w7_7c7k7m9T9X:a<n<o`;i3t6z6}7R8w9x9{:jS;s.f3^T;t6|8z!O%Ri#x%P%R%]%^%b*P*R*^*t*u.n/r0Y0[0f4Q4o9P<d<l<mv*R$w(u*S*q+Q/b/q0^0_3`4Y4k4s7W7i9|<U<b<cS0[*r0]#[;W#v$d$e$y$|)w)}*T*W*d+b+e+|,P.`/`/h/s/u1Z1^1f3W4]4e4w4y5l6p7^7g8R8r9d9v:W:`;U;W;[;^;`;h;j;m;q;s;u;w;{<p<qn;X;R;S;V;X;];_;a;i;k;n;r;t;v;x;|!b;j(q)b*Y*b.e.f.k/X/^/f/v0n1Y1[3Z3]4Z4_5[5^6t6u6w7_7c7k7m9T9X:a<n<od;k3t6{6|7R8w8x9x9y9{:jS;u.g3_T;v6}8{rnOXst!V!Z#d%k&f&o&q&r&t,m,r2P2SQ&c!UR,j&lrnOXst!V!Z#d%k&f&o&q&r&t,m,r2P2SR&c!UQ,S&ZR1X+{snOXst!V!Z#d%k&f&o&q&r&t,m,r2P2SQ1e,XS5k1h1iU8Q5i5j5nS9c8S8TS:U9b9eQ:c:VR:h:dQ&j!VR,c&fR5w1qS&O|&TR1Q+rQ&o!WR,m&pR,s&uT2Q,r2SR,w&vQ,v&vR2Z,wQ'v!{R-s'vSsOtQ#dXT%ns#dQ#OTR'x#OQ#RUR'z#RQ)y$vR/Y)yQ#UVR'|#UQ#XWU(S#X(T-zQ(T#YR-z(UQ-W'VR2g-WQ.o(uR3a.oQ.r(wS3d.r3eR3e.sQ-_']R2k-_Y!rQ']-_1d5fR'g!rU#_W%f*WU(Z#_([-{Q([#`R-{(VQ-Z'YR2i-Zt`OXst!V!Z#d%k&f&h&o&q&r&t,m,r2P2SS#hZ%cU#r`#h.UR.U(fQ(g#jQ.R(cW.Z(g.R2|6kQ2|.SR6k2}Q)k$lR/R)kQ$phR)q$pQ$ccU)a$c-v;QQ-v:mR;Q)nQ/l*ZW4U/l4V7[9SU4V/m/n/oS7[4W4XR9S7]$X*O$w(q(u)b*Y*b*q*r*{*|+Q.f.g.i.j.k/X/^/b/d/f/q/v0^0_0n1Y1[3Z3[3]3`3t4Y4Z4_4k4m4s5[5^6t6u6v6w6|6}7P7Q7R7W7_7c7i7k7m8w8x8y9T9X9x9y9z9{9|:a:j<U<b<c<n<oQ/t*bU4^/t4`7`Q4`/vR7`4_S*l$}*XR0S*lr*Q$w(u*q*r+Q/q0^0_3`4Y4s7W7i9|<U<b<c!^.d(q)b*Y*b.f.g.k/X/^/f/v0n1Y1[3]4Z4_5[5^6t6w7_7c7k7m9T9X:a<n<oU/c*Q.d6za6z3t6|6}7R8w9x9{:jQ0Z*qQ3^.fU4l0Z3^8zR8z6|v*S$w(u*q*r+Q/b/q0^0_3`4Y4k4s7W7i9|<U<b<c!b.e(q)b*Y*b.f.g.k/X/^/f/v0n1Y1[3Z3]4Z4_5[5^6t6u6w7_7c7k7m9T9X:a<n<oU/e*S.e6{e6{3t6|6}7R8w8x9x9y9{:jQ0]*rQ3_.gU4n0]3_8{R8{6}Q*w%VR0a*wQ4x0nR7l4xQ+Y%iR0l+YQ5`1_S7z5`9aR9a7{Q,U&[R1b,UQ5f1dR7}5fQ1p,`S5u1p8[R8[5wQ0{+nW5R0{5T7r9]Q5T1OQ7r5SR9]7sQ+s&OR1R+sQ2S,rR6V2SYrOXst#dQ&s!ZQ+[%kQ,l&oQ,n&qQ,o&rQ,q&tQ1},mS2Q,r2SR6U2PQ%mpQ&w!_Q&z!aQ&|!bQ'O!cQ'n!uQ+Z%jQ+h%xQ+z&UQ,b&jQ,y&yW-j'h'p'q'tQ-q'lQ0R*kQ0v+iS1s,c,fQ2[,xQ2],{Q2^,|Q2r-iW2t-l-m-p-rQ4z0wQ5W1UQ5Z1YQ5o1jQ5y1uQ6T2OU6d2s2v2yQ6g2wQ7n4{Q7v5YQ7w5[Q7|5eQ8V5pQ8]5xS8l6e6iQ8n6hQ9^7tQ9f8WQ9k8^Q9r8mQ:S9_Q:X9gQ:]9sR:e:YQ%xyQ'a!iQ'l!uU+i%y%z%{Q-Q'SU-e'b'c'dS-i'h'rQ/x*fS0w+j+kQ2d-SS2p-f-gQ2w-nQ4c/|Q4{0xQ6`2jQ6c2qQ6h2xR7d4gS$xi<dR*x%WU%Vi%W<dR0`*vQ$wiS(q#v+eQ(u#xS)b$d$eQ*Y$yS*b$|*WQ*q%PQ*r%RQ*{%]Q*|%^Q+Q%bQ.f;UQ.g;WQ.i;[Q.j;^Q.k;`Q/X)wS/^)}/`Q/b*PQ/d*RQ/f*TQ/q*^S/v*d/hQ0^*tQ0_*uh0n+b.`1f3W5l6p8R8r9d9v:W:`Q1Y+|Q1[,PQ3Z;hQ3[;jQ3];mQ3`.nS3t;R;SQ4Y/rQ4Z/sQ4_/uQ4k0YQ4m0[Q4s0fQ5[1ZQ5^1^Q6t;qQ6u;sQ6v;uQ6w;wQ6|;VQ6};XQ7P;]Q7Q;_Q7R;aQ7W4QQ7_4]Q7c4eQ7i4oQ7k4wQ7m4yQ8w;nQ8x;iQ8y;kQ9T7^Q9X7gQ9x;rQ9y;tQ9z;vQ9{;xQ9|9PQ:a;{Q:j;|Q<U<dQ<b<lQ<c<mQ<n<pR<o<qnpOXst!Z#d%k&o&q&r&t,m,r2P2SQ!fPS#fZ#oQ&y!`U'e!o5c8PQ'{#SQ)O#|Q)o$nS,f&h&kQ,k&lQ,x&xQ,}'QQ-a'_Q.u(|Q/V)pS0j+W/iQ0q+cQ1{,jQ2n-cQ3U.aQ3{/QQ4q0dQ5j1gQ5{1wQ5|1xQ6Q1zQ6S1|Q6X2UQ6o3XQ7U3xQ8T5mQ8a5}Q8b6OQ8d6RQ8t6sQ9e8UR9o8e#YcOPXZst!Z!`!o#d#o#|%k&h&k&l&o&q&r&t&x'Q'_(|+W+c,j,m,r-c.a/i0d1g1w1x1z1|2P2S2U3X5c5m5}6O6R6s8P8U8eQ#YWQ#eYQ%ouQ%qvS%sw!gS(O#W(RQ(U#ZQ(p#uQ(w#yQ)P$PQ)Q$QQ)R$RQ)S$SQ)T$TQ)U$UQ)V$VQ)W$WQ)X$XQ)Y$YQ)Z$ZQ)]$]Q)`$bQ)d$fW)n$n)p/Q3xQ+`%rQ+t&PS-T'U2eQ-r'oS-w(P-yQ-|(XQ.O(`Q.m(tQ.s(xQ.w:kQ.y:nQ.z:oQ.{:rQ/[){Q0g+SQ2`-OQ2c-RQ2s-kQ2z.PQ3b.qQ3g:sQ3h:tQ3i:uQ3j:vQ3k:wQ3l:xQ3m:yQ3n:zQ3o:{Q3p:|Q3q:}Q3r;OQ3s.xQ3v;TQ3w;bQ3|;PQ4t0iQ4|0yQ6_;dQ6e2uQ6j2{Q6x3cQ6y;eQ7S;gQ7T;oQ7{5aQ8i6]Q8m6fQ8v;pQ8|;yQ8};zQ9s8oQ:T9`Q:[9qQ:m#SR<Z<gR#[WR'W!el!tQ!r!v!y!z']'i'j'k-_-o1d5f5hS'S!e-VS-S'T'[R2j-]R(v#xR(y#yQ!fQT-^']-_]!qQ!r']-_1d5fQ#p]R'f:lY!uQ']-_1d5fQ'h!rS'r!v!yS't!z5hS-n'i'jQ-p'kR2x-oT#kZ%cS#jZ%cS%im,iU(c#h#i#lS.S(d(eQ.W(fQ0k+XQ2}.TU3O.U.V.XS6l3P3QR8p6md#^W#W#Z%f(P(Y*W+U-}/hr#gZm#h#i#l%c(d(e(f+X.T.U.V.X3P3Q6mS*Z$y*_Q/o*[Q1y,iQ2a-PQ4S/kQ6Z2XQ7Z4TQ8h6[T<R'U+VV#aW%f*WU#`W%f*WS(Q#W(YU(V#Z+U/hS-U'U+VT-x(P-}V'Z!e%g*XQ$lfR)u$qT)j$l)kR3z/PT*]$y*_T*e$|*WQ0o+bQ3S.`Q5i1fQ6q3WQ8S5lQ8s6pQ9b8RQ9t8rQ:V9dQ:_9vQ:d:WR:g:`nqOXst!Z#d%k&o&q&r&t,m,r2P2SQ&i!VR,b&ftmOXst!U!V!Z#d%k&f&o&q&r&t,m,r2P2SR,i&lT%jm,iR1`,RR,a&dQ&S|R+y&TR+o%}T&m!W&pT&n!W&pT2R,r2S",nodeNames:"⚠ ArithOp ArithOp ?. JSXStartTag LineComment BlockComment Script Hashbang ExportDeclaration export Star as VariableName String Escape from ; default FunctionDeclaration async function VariableDefinition > < TypeParamList TypeDefinition extends ThisType this LiteralType ArithOp Number BooleanLiteral TemplateType InterpolationEnd Interpolation InterpolationStart NullType null VoidType void TypeofType typeof MemberExpression . PropertyName [ TemplateString Escape Interpolation super RegExp ] ArrayExpression Spread , } { ObjectExpression Property async get set PropertyDefinition Block : NewTarget new NewExpression TypeArgList CompareOp < ) ( ArgList UnaryExpression delete LogicOp BitOp YieldExpression yield AwaitExpression await ParenthesizedExpression ClassExpression class ClassBody MethodDeclaration Decorator @ MemberExpression PrivatePropertyName CallExpression declare Privacy static abstract override PrivatePropertyDefinition PropertyDeclaration readonly accessor Optional TypeAnnotation Equals StaticBlock FunctionExpression ArrowFunction ParamList ParamList ArrayPattern ObjectPattern PatternProperty Privacy readonly Arrow MemberExpression BinaryExpression ArithOp ArithOp ArithOp ArithOp BitOp CompareOp instanceof satisfies in const CompareOp BitOp BitOp BitOp LogicOp LogicOp ConditionalExpression LogicOp LogicOp AssignmentExpression UpdateOp PostfixExpression CallExpression TaggedTemplateExpression DynamicImport import ImportMeta JSXElement JSXSelfCloseEndTag JSXSelfClosingTag JSXIdentifier JSXBuiltin JSXIdentifier JSXNamespacedName JSXMemberExpression JSXSpreadAttribute JSXAttribute JSXAttributeValue JSXEscape JSXEndTag JSXOpenTag JSXFragmentTag JSXText JSXEscape JSXStartCloseTag JSXCloseTag PrefixCast ArrowFunction TypeParamList SequenceExpression KeyofType keyof UniqueType unique ImportType InferredType infer TypeName ParenthesizedType FunctionSignature ParamList NewSignature IndexedType TupleType Label ArrayType ReadonlyType ObjectType MethodType PropertyType IndexSignature PropertyDefinition CallSignature TypePredicate is NewSignature new UnionType LogicOp IntersectionType LogicOp ConditionalType ParameterizedType ClassDeclaration abstract implements type VariableDeclaration let var using TypeAliasDeclaration InterfaceDeclaration interface EnumDeclaration enum EnumBody NamespaceDeclaration namespace module AmbientDeclaration declare GlobalDeclaration global ClassDeclaration ClassBody AmbientFunctionDeclaration ExportGroup VariableName VariableName ImportDeclaration ImportGroup ForStatement for ForSpec ForInSpec ForOfSpec of WhileStatement while WithStatement with DoStatement do IfStatement if else SwitchStatement switch SwitchBody CaseLabel case DefaultLabel TryStatement try CatchClause catch FinallyClause finally ReturnStatement return ThrowStatement throw BreakStatement break ContinueStatement continue DebuggerStatement debugger LabeledStatement ExpressionStatement SingleExpression SingleClassItem",maxTerm:373,context:qd,nodeProps:[["isolate",-8,5,6,14,34,36,48,50,52,""],["group",-26,9,17,19,65,202,206,210,211,213,216,219,229,231,237,239,241,243,246,252,258,260,262,264,266,268,269,"Statement",-33,13,14,29,32,33,39,48,51,52,54,59,67,69,76,80,82,84,85,107,108,117,118,135,138,140,141,142,143,145,146,165,166,168,"Expression",-23,28,30,34,38,40,42,169,171,173,174,176,177,178,180,181,182,184,185,186,196,198,200,201,"Type",-3,88,100,106,"ClassItem"],["openedBy",23,"<",35,"InterpolationStart",53,"[",57,"{",73,"(",158,"JSXStartCloseTag"],["closedBy",24,">",37,"InterpolationEnd",47,"]",58,"}",74,")",163,"JSXEndTag"]],propSources:[Ed],skippedNodes:[0,5,6,272],repeatNodeCount:37,tokenData:"$Fq07[R!bOX%ZXY+gYZ-yZ[+g[]%Z]^.c^p%Zpq+gqr/mrs3cst:_tuEruvJSvwLkwx! Yxy!'iyz!(sz{!)}{|!,q|}!.O}!O!,q!O!P!/Y!P!Q!9j!Q!R#:O!R![#<_![!]#I_!]!^#Jk!^!_#Ku!_!`$![!`!a$$v!a!b$*T!b!c$,r!c!}Er!}#O$-|#O#P$/W#P#Q$4o#Q#R$5y#R#SEr#S#T$7W#T#o$8b#o#p$<r#p#q$=h#q#r$>x#r#s$@U#s$f%Z$f$g+g$g#BYEr#BY#BZ$A`#BZ$ISEr$IS$I_$A`$I_$I|Er$I|$I}$Dk$I}$JO$Dk$JO$JTEr$JT$JU$A`$JU$KVEr$KV$KW$A`$KW&FUEr&FU&FV$A`&FV;'SEr;'S;=`I|<%l?HTEr?HT?HU$A`?HUOEr(n%d_$g&j(Pp(S!bOY%ZYZ&cZr%Zrs&}sw%Zwx(rx!^%Z!^!_*g!_#O%Z#O#P&c#P#o%Z#o#p*g#p;'S%Z;'S;=`+a<%lO%Z&j&hT$g&jO!^&c!_#o&c#p;'S&c;'S;=`&w<%lO&c&j&zP;=`<%l&c'|'U]$g&j(S!bOY&}YZ&cZw&}wx&cx!^&}!^!_'}!_#O&}#O#P&c#P#o&}#o#p'}#p;'S&};'S;=`(l<%lO&}!b(SU(S!bOY'}Zw'}x#O'}#P;'S'};'S;=`(f<%lO'}!b(iP;=`<%l'}'|(oP;=`<%l&}'[(y]$g&j(PpOY(rYZ&cZr(rrs&cs!^(r!^!_)r!_#O(r#O#P&c#P#o(r#o#p)r#p;'S(r;'S;=`*a<%lO(rp)wU(PpOY)rZr)rs#O)r#P;'S)r;'S;=`*Z<%lO)rp*^P;=`<%l)r'[*dP;=`<%l(r#S*nX(Pp(S!bOY*gZr*grs'}sw*gwx)rx#O*g#P;'S*g;'S;=`+Z<%lO*g#S+^P;=`<%l*g(n+dP;=`<%l%Z07[+rq$g&j(Pp(S!b'u0/lOX%ZXY+gYZ&cZ[+g[p%Zpq+gqr%Zrs&}sw%Zwx(rx!^%Z!^!_*g!_#O%Z#O#P&c#P#o%Z#o#p*g#p$f%Z$f$g+g$g#BY%Z#BY#BZ+g#BZ$IS%Z$IS$I_+g$I_$JT%Z$JT$JU+g$JU$KV%Z$KV$KW+g$KW&FU%Z&FU&FV+g&FV;'S%Z;'S;=`+a<%l?HT%Z?HT?HU+g?HUO%Z07[.ST(Q#S$g&j'v0/lO!^&c!_#o&c#p;'S&c;'S;=`&w<%lO&c07[.n_$g&j(Pp(S!b'v0/lOY%ZYZ&cZr%Zrs&}sw%Zwx(rx!^%Z!^!_*g!_#O%Z#O#P&c#P#o%Z#o#p*g#p;'S%Z;'S;=`+a<%lO%Z)3p/x`$g&j!p),Q(Pp(S!bOY%ZYZ&cZr%Zrs&}sw%Zwx(rx!^%Z!^!_*g!_!`0z!`#O%Z#O#P&c#P#o%Z#o#p*g#p;'S%Z;'S;=`+a<%lO%Z(KW1V`#u(Ch$g&j(Pp(S!bOY%ZYZ&cZr%Zrs&}sw%Zwx(rx!^%Z!^!_*g!_!`2X!`#O%Z#O#P&c#P#o%Z#o#p*g#p;'S%Z;'S;=`+a<%lO%Z(KW2d_#u(Ch$g&j(Pp(S!bOY%ZYZ&cZr%Zrs&}sw%Zwx(rx!^%Z!^!_*g!_#O%Z#O#P&c#P#o%Z#o#p*g#p;'S%Z;'S;=`+a<%lO%Z'At3l_(O':f$g&j(S!bOY4kYZ5qZr4krs7nsw4kwx5qx!^4k!^!_8p!_#O4k#O#P5q#P#o4k#o#p8p#p;'S4k;'S;=`:X<%lO4k(^4r_$g&j(S!bOY4kYZ5qZr4krs7nsw4kwx5qx!^4k!^!_8p!_#O4k#O#P5q#P#o4k#o#p8p#p;'S4k;'S;=`:X<%lO4k&z5vX$g&jOr5qrs6cs!^5q!^!_6y!_#o5q#o#p6y#p;'S5q;'S;=`7h<%lO5q&z6jT$b`$g&jO!^&c!_#o&c#p;'S&c;'S;=`&w<%lO&c`6|TOr6yrs7]s;'S6y;'S;=`7b<%lO6y`7bO$b``7eP;=`<%l6y&z7kP;=`<%l5q(^7w]$b`$g&j(S!bOY&}YZ&cZw&}wx&cx!^&}!^!_'}!_#O&}#O#P&c#P#o&}#o#p'}#p;'S&};'S;=`(l<%lO&}!r8uZ(S!bOY8pYZ6yZr8prs9hsw8pwx6yx#O8p#O#P6y#P;'S8p;'S;=`:R<%lO8p!r9oU$b`(S!bOY'}Zw'}x#O'}#P;'S'};'S;=`(f<%lO'}!r:UP;=`<%l8p(^:[P;=`<%l4k%9[:hh$g&j(Pp(S!bOY%ZYZ&cZq%Zqr<Srs&}st%ZtuCruw%Zwx(rx!^%Z!^!_*g!_!c%Z!c!}Cr!}#O%Z#O#P&c#P#R%Z#R#SCr#S#T%Z#T#oCr#o#p*g#p$g%Z$g;'SCr;'S;=`El<%lOCr(r<__WS$g&j(Pp(S!bOY<SYZ&cZr<Srs=^sw<Swx@nx!^<S!^!_Bm!_#O<S#O#P>`#P#o<S#o#pBm#p;'S<S;'S;=`Cl<%lO<S(Q=g]WS$g&j(S!bOY=^YZ&cZw=^wx>`x!^=^!^!_?q!_#O=^#O#P>`#P#o=^#o#p?q#p;'S=^;'S;=`@h<%lO=^&n>gXWS$g&jOY>`YZ&cZ!^>`!^!_?S!_#o>`#o#p?S#p;'S>`;'S;=`?k<%lO>`S?XSWSOY?SZ;'S?S;'S;=`?e<%lO?SS?hP;=`<%l?S&n?nP;=`<%l>`!f?xWWS(S!bOY?qZw?qwx?Sx#O?q#O#P?S#P;'S?q;'S;=`@b<%lO?q!f@eP;=`<%l?q(Q@kP;=`<%l=^'`@w]WS$g&j(PpOY@nYZ&cZr@nrs>`s!^@n!^!_Ap!_#O@n#O#P>`#P#o@n#o#pAp#p;'S@n;'S;=`Bg<%lO@ntAwWWS(PpOYApZrAprs?Ss#OAp#O#P?S#P;'SAp;'S;=`Ba<%lOAptBdP;=`<%lAp'`BjP;=`<%l@n#WBvYWS(Pp(S!bOYBmZrBmrs?qswBmwxApx#OBm#O#P?S#P;'SBm;'S;=`Cf<%lOBm#WCiP;=`<%lBm(rCoP;=`<%l<S%9[C}i$g&j(h%1l(Pp(S!bOY%ZYZ&cZr%Zrs&}st%ZtuCruw%Zwx(rx!Q%Z!Q![Cr![!^%Z!^!_*g!_!c%Z!c!}Cr!}#O%Z#O#P&c#P#R%Z#R#SCr#S#T%Z#T#oCr#o#p*g#p$g%Z$g;'SCr;'S;=`El<%lOCr%9[EoP;=`<%lCr07[FRk$g&j(Pp(S!b$Z#t'|,2j(]$I[OY%ZYZ&cZr%Zrs&}st%ZtuEruw%Zwx(rx}%Z}!OGv!O!Q%Z!Q![Er![!^%Z!^!_*g!_!c%Z!c!}Er!}#O%Z#O#P&c#P#R%Z#R#SEr#S#T%Z#T#oEr#o#p*g#p$g%Z$g;'SEr;'S;=`I|<%lOEr+dHRk$g&j(Pp(S!b$Z#tOY%ZYZ&cZr%Zrs&}st%ZtuGvuw%Zwx(rx}%Z}!OGv!O!Q%Z!Q![Gv![!^%Z!^!_*g!_!c%Z!c!}Gv!}#O%Z#O#P&c#P#R%Z#R#SGv#S#T%Z#T#oGv#o#p*g#p$g%Z$g;'SGv;'S;=`Iv<%lOGv+dIyP;=`<%lGv07[JPP;=`<%lEr(KWJ_`$g&j(Pp(S!b#m(ChOY%ZYZ&cZr%Zrs&}sw%Zwx(rx!^%Z!^!_*g!_!`Ka!`#O%Z#O#P&c#P#o%Z#o#p*g#p;'S%Z;'S;=`+a<%lO%Z(KWKl_$g&j$P(Ch(Pp(S!bOY%ZYZ&cZr%Zrs&}sw%Zwx(rx!^%Z!^!_*g!_#O%Z#O#P&c#P#o%Z#o#p*g#p;'S%Z;'S;=`+a<%lO%Z,#xLva(r+JY$g&j(Pp(S!bOY%ZYZ&cZr%Zrs&}sv%ZvwM{wx(rx!^%Z!^!_*g!_!`Ka!`#O%Z#O#P&c#P#o%Z#o#p*g#p;'S%Z;'S;=`+a<%lO%Z(KWNW`$g&j#y(Ch(Pp(S!bOY%ZYZ&cZr%Zrs&}sw%Zwx(rx!^%Z!^!_*g!_!`Ka!`#O%Z#O#P&c#P#o%Z#o#p*g#p;'S%Z;'S;=`+a<%lO%Z'At! c_(R';W$g&j(PpOY!!bYZ!#hZr!!brs!#hsw!!bwx!$xx!^!!b!^!_!%z!_#O!!b#O#P!#h#P#o!!b#o#p!%z#p;'S!!b;'S;=`!'c<%lO!!b'l!!i_$g&j(PpOY!!bYZ!#hZr!!brs!#hsw!!bwx!$xx!^!!b!^!_!%z!_#O!!b#O#P!#h#P#o!!b#o#p!%z#p;'S!!b;'S;=`!'c<%lO!!b&z!#mX$g&jOw!#hwx6cx!^!#h!^!_!$Y!_#o!#h#o#p!$Y#p;'S!#h;'S;=`!$r<%lO!#h`!$]TOw!$Ywx7]x;'S!$Y;'S;=`!$l<%lO!$Y`!$oP;=`<%l!$Y&z!$uP;=`<%l!#h'l!%R]$b`$g&j(PpOY(rYZ&cZr(rrs&cs!^(r!^!_)r!_#O(r#O#P&c#P#o(r#o#p)r#p;'S(r;'S;=`*a<%lO(r!Q!&PZ(PpOY!%zYZ!$YZr!%zrs!$Ysw!%zwx!&rx#O!%z#O#P!$Y#P;'S!%z;'S;=`!']<%lO!%z!Q!&yU$b`(PpOY)rZr)rs#O)r#P;'S)r;'S;=`*Z<%lO)r!Q!'`P;=`<%l!%z'l!'fP;=`<%l!!b/5|!'t_!l/.^$g&j(Pp(S!bOY%ZYZ&cZr%Zrs&}sw%Zwx(rx!^%Z!^!_*g!_#O%Z#O#P&c#P#o%Z#o#p*g#p;'S%Z;'S;=`+a<%lO%Z#&U!)O_!k!Lf$g&j(Pp(S!bOY%ZYZ&cZr%Zrs&}sw%Zwx(rx!^%Z!^!_*g!_#O%Z#O#P&c#P#o%Z#o#p*g#p;'S%Z;'S;=`+a<%lO%Z-!n!*[b$g&j(Pp(S!b'}%&f#n(ChOY%ZYZ&cZr%Zrs&}sw%Zwx(rxz%Zz{!+d{!^%Z!^!_*g!_!`Ka!`#O%Z#O#P&c#P#o%Z#o#p*g#p;'S%Z;'S;=`+a<%lO%Z(KW!+o`$g&j(Pp(S!b#k(ChOY%ZYZ&cZr%Zrs&}sw%Zwx(rx!^%Z!^!_*g!_!`Ka!`#O%Z#O#P&c#P#o%Z#o#p*g#p;'S%Z;'S;=`+a<%lO%Z+;x!,|`$g&j(Pp(S!bo+4YOY%ZYZ&cZr%Zrs&}sw%Zwx(rx!^%Z!^!_*g!_!`Ka!`#O%Z#O#P&c#P#o%Z#o#p*g#p;'S%Z;'S;=`+a<%lO%Z,$U!.Z_!Y+Jf$g&j(Pp(S!bOY%ZYZ&cZr%Zrs&}sw%Zwx(rx!^%Z!^!_*g!_#O%Z#O#P&c#P#o%Z#o#p*g#p;'S%Z;'S;=`+a<%lO%Z07[!/ec$g&j(Pp(S!b}.2^OY%ZYZ&cZr%Zrs&}sw%Zwx(rx!O%Z!O!P!0p!P!Q%Z!Q![!3Y![!^%Z!^!_*g!_#O%Z#O#P&c#P#o%Z#o#p*g#p;'S%Z;'S;=`+a<%lO%Z#%|!0ya$g&j(Pp(S!bOY%ZYZ&cZr%Zrs&}sw%Zwx(rx!O%Z!O!P!2O!P!^%Z!^!_*g!_#O%Z#O#P&c#P#o%Z#o#p*g#p;'S%Z;'S;=`+a<%lO%Z#%|!2Z_!X!L^$g&j(Pp(S!bOY%ZYZ&cZr%Zrs&}sw%Zwx(rx!^%Z!^!_*g!_#O%Z#O#P&c#P#o%Z#o#p*g#p;'S%Z;'S;=`+a<%lO%Z'Ad!3eg$g&j(Pp(S!bp'9tOY%ZYZ&cZr%Zrs&}sw%Zwx(rx!Q%Z!Q![!3Y![!^%Z!^!_*g!_!g%Z!g!h!4|!h#O%Z#O#P&c#P#R%Z#R#S!3Y#S#X%Z#X#Y!4|#Y#o%Z#o#p*g#p;'S%Z;'S;=`+a<%lO%Z'Ad!5Vg$g&j(Pp(S!bOY%ZYZ&cZr%Zrs&}sw%Zwx(rx{%Z{|!6n|}%Z}!O!6n!O!Q%Z!Q![!8S![!^%Z!^!_*g!_#O%Z#O#P&c#P#R%Z#R#S!8S#S#o%Z#o#p*g#p;'S%Z;'S;=`+a<%lO%Z'Ad!6wc$g&j(Pp(S!bOY%ZYZ&cZr%Zrs&}sw%Zwx(rx!Q%Z!Q![!8S![!^%Z!^!_*g!_#O%Z#O#P&c#P#R%Z#R#S!8S#S#o%Z#o#p*g#p;'S%Z;'S;=`+a<%lO%Z'Ad!8_c$g&j(Pp(S!bp'9tOY%ZYZ&cZr%Zrs&}sw%Zwx(rx!Q%Z!Q![!8S![!^%Z!^!_*g!_#O%Z#O#P&c#P#R%Z#R#S!8S#S#o%Z#o#p*g#p;'S%Z;'S;=`+a<%lO%Z07[!9uf$g&j(Pp(S!b#l(ChOY!;ZYZ&cZr!;Zrs!<nsw!;Zwx!Lcxz!;Zz{#-}{!P!;Z!P!Q#/d!Q!^!;Z!^!_#(i!_!`#7S!`!a#8i!a!}!;Z!}#O#,f#O#P!Dy#P#o!;Z#o#p#(i#p;'S!;Z;'S;=`#-w<%lO!;Z?O!;fb$g&j(Pp(S!b!U7`OY!;ZYZ&cZr!;Zrs!<nsw!;Zwx!Lcx!P!;Z!P!Q#&`!Q!^!;Z!^!_#(i!_!}!;Z!}#O#,f#O#P!Dy#P#o!;Z#o#p#(i#p;'S!;Z;'S;=`#-w<%lO!;Z>^!<w`$g&j(S!b!U7`OY!<nYZ&cZw!<nwx!=yx!P!<n!P!Q!Eq!Q!^!<n!^!_!Gr!_!}!<n!}#O!KS#O#P!Dy#P#o!<n#o#p!Gr#p;'S!<n;'S;=`!L]<%lO!<n<z!>Q^$g&j!U7`OY!=yYZ&cZ!P!=y!P!Q!>|!Q!^!=y!^!_!@c!_!}!=y!}#O!CW#O#P!Dy#P#o!=y#o#p!@c#p;'S!=y;'S;=`!Ek<%lO!=y<z!?Td$g&j!U7`O!^&c!_#W&c#W#X!>|#X#Z&c#Z#[!>|#[#]&c#]#^!>|#^#a&c#a#b!>|#b#g&c#g#h!>|#h#i&c#i#j!>|#j#k!>|#k#m&c#m#n!>|#n#o&c#p;'S&c;'S;=`&w<%lO&c7`!@hX!U7`OY!@cZ!P!@c!P!Q!AT!Q!}!@c!}#O!Ar#O#P!Bq#P;'S!@c;'S;=`!CQ<%lO!@c7`!AYW!U7`#W#X!AT#Z#[!AT#]#^!AT#a#b!AT#g#h!AT#i#j!AT#j#k!AT#m#n!AT7`!AuVOY!ArZ#O!Ar#O#P!B[#P#Q!@c#Q;'S!Ar;'S;=`!Bk<%lO!Ar7`!B_SOY!ArZ;'S!Ar;'S;=`!Bk<%lO!Ar7`!BnP;=`<%l!Ar7`!BtSOY!@cZ;'S!@c;'S;=`!CQ<%lO!@c7`!CTP;=`<%l!@c<z!C][$g&jOY!CWYZ&cZ!^!CW!^!_!Ar!_#O!CW#O#P!DR#P#Q!=y#Q#o!CW#o#p!Ar#p;'S!CW;'S;=`!Ds<%lO!CW<z!DWX$g&jOY!CWYZ&cZ!^!CW!^!_!Ar!_#o!CW#o#p!Ar#p;'S!CW;'S;=`!Ds<%lO!CW<z!DvP;=`<%l!CW<z!EOX$g&jOY!=yYZ&cZ!^!=y!^!_!@c!_#o!=y#o#p!@c#p;'S!=y;'S;=`!Ek<%lO!=y<z!EnP;=`<%l!=y>^!Ezl$g&j(S!b!U7`OY&}YZ&cZw&}wx&cx!^&}!^!_'}!_#O&}#O#P&c#P#W&}#W#X!Eq#X#Z&}#Z#[!Eq#[#]&}#]#^!Eq#^#a&}#a#b!Eq#b#g&}#g#h!Eq#h#i&}#i#j!Eq#j#k!Eq#k#m&}#m#n!Eq#n#o&}#o#p'}#p;'S&};'S;=`(l<%lO&}8r!GyZ(S!b!U7`OY!GrZw!Grwx!@cx!P!Gr!P!Q!Hl!Q!}!Gr!}#O!JU#O#P!Bq#P;'S!Gr;'S;=`!J|<%lO!Gr8r!Hse(S!b!U7`OY'}Zw'}x#O'}#P#W'}#W#X!Hl#X#Z'}#Z#[!Hl#[#]'}#]#^!Hl#^#a'}#a#b!Hl#b#g'}#g#h!Hl#h#i'}#i#j!Hl#j#k!Hl#k#m'}#m#n!Hl#n;'S'};'S;=`(f<%lO'}8r!JZX(S!bOY!JUZw!JUwx!Arx#O!JU#O#P!B[#P#Q!Gr#Q;'S!JU;'S;=`!Jv<%lO!JU8r!JyP;=`<%l!JU8r!KPP;=`<%l!Gr>^!KZ^$g&j(S!bOY!KSYZ&cZw!KSwx!CWx!^!KS!^!_!JU!_#O!KS#O#P!DR#P#Q!<n#Q#o!KS#o#p!JU#p;'S!KS;'S;=`!LV<%lO!KS>^!LYP;=`<%l!KS>^!L`P;=`<%l!<n=l!Ll`$g&j(Pp!U7`OY!LcYZ&cZr!Lcrs!=ys!P!Lc!P!Q!Mn!Q!^!Lc!^!_# o!_!}!Lc!}#O#%P#O#P!Dy#P#o!Lc#o#p# o#p;'S!Lc;'S;=`#&Y<%lO!Lc=l!Mwl$g&j(Pp!U7`OY(rYZ&cZr(rrs&cs!^(r!^!_)r!_#O(r#O#P&c#P#W(r#W#X!Mn#X#Z(r#Z#[!Mn#[#](r#]#^!Mn#^#a(r#a#b!Mn#b#g(r#g#h!Mn#h#i(r#i#j!Mn#j#k!Mn#k#m(r#m#n!Mn#n#o(r#o#p)r#p;'S(r;'S;=`*a<%lO(r8Q# vZ(Pp!U7`OY# oZr# ors!@cs!P# o!P!Q#!i!Q!}# o!}#O#$R#O#P!Bq#P;'S# o;'S;=`#$y<%lO# o8Q#!pe(Pp!U7`OY)rZr)rs#O)r#P#W)r#W#X#!i#X#Z)r#Z#[#!i#[#])r#]#^#!i#^#a)r#a#b#!i#b#g)r#g#h#!i#h#i)r#i#j#!i#j#k#!i#k#m)r#m#n#!i#n;'S)r;'S;=`*Z<%lO)r8Q#$WX(PpOY#$RZr#$Rrs!Ars#O#$R#O#P!B[#P#Q# o#Q;'S#$R;'S;=`#$s<%lO#$R8Q#$vP;=`<%l#$R8Q#$|P;=`<%l# o=l#%W^$g&j(PpOY#%PYZ&cZr#%Prs!CWs!^#%P!^!_#$R!_#O#%P#O#P!DR#P#Q!Lc#Q#o#%P#o#p#$R#p;'S#%P;'S;=`#&S<%lO#%P=l#&VP;=`<%l#%P=l#&]P;=`<%l!Lc?O#&kn$g&j(Pp(S!b!U7`OY%ZYZ&cZr%Zrs&}sw%Zwx(rx!^%Z!^!_*g!_#O%Z#O#P&c#P#W%Z#W#X#&`#X#Z%Z#Z#[#&`#[#]%Z#]#^#&`#^#a%Z#a#b#&`#b#g%Z#g#h#&`#h#i%Z#i#j#&`#j#k#&`#k#m%Z#m#n#&`#n#o%Z#o#p*g#p;'S%Z;'S;=`+a<%lO%Z9d#(r](Pp(S!b!U7`OY#(iZr#(irs!Grsw#(iwx# ox!P#(i!P!Q#)k!Q!}#(i!}#O#+`#O#P!Bq#P;'S#(i;'S;=`#,`<%lO#(i9d#)th(Pp(S!b!U7`OY*gZr*grs'}sw*gwx)rx#O*g#P#W*g#W#X#)k#X#Z*g#Z#[#)k#[#]*g#]#^#)k#^#a*g#a#b#)k#b#g*g#g#h#)k#h#i*g#i#j#)k#j#k#)k#k#m*g#m#n#)k#n;'S*g;'S;=`+Z<%lO*g9d#+gZ(Pp(S!bOY#+`Zr#+`rs!JUsw#+`wx#$Rx#O#+`#O#P!B[#P#Q#(i#Q;'S#+`;'S;=`#,Y<%lO#+`9d#,]P;=`<%l#+`9d#,cP;=`<%l#(i?O#,o`$g&j(Pp(S!bOY#,fYZ&cZr#,frs!KSsw#,fwx#%Px!^#,f!^!_#+`!_#O#,f#O#P!DR#P#Q!;Z#Q#o#,f#o#p#+`#p;'S#,f;'S;=`#-q<%lO#,f?O#-tP;=`<%l#,f?O#-zP;=`<%l!;Z07[#.[b$g&j(Pp(S!b'w0/l!U7`OY!;ZYZ&cZr!;Zrs!<nsw!;Zwx!Lcx!P!;Z!P!Q#&`!Q!^!;Z!^!_#(i!_!}!;Z!}#O#,f#O#P!Dy#P#o!;Z#o#p#(i#p;'S!;Z;'S;=`#-w<%lO!;Z07[#/o_$g&j(Pp(S!bT0/lOY#/dYZ&cZr#/drs#0nsw#/dwx#4Ox!^#/d!^!_#5}!_#O#/d#O#P#1p#P#o#/d#o#p#5}#p;'S#/d;'S;=`#6|<%lO#/d06j#0w]$g&j(S!bT0/lOY#0nYZ&cZw#0nwx#1px!^#0n!^!_#3R!_#O#0n#O#P#1p#P#o#0n#o#p#3R#p;'S#0n;'S;=`#3x<%lO#0n05W#1wX$g&jT0/lOY#1pYZ&cZ!^#1p!^!_#2d!_#o#1p#o#p#2d#p;'S#1p;'S;=`#2{<%lO#1p0/l#2iST0/lOY#2dZ;'S#2d;'S;=`#2u<%lO#2d0/l#2xP;=`<%l#2d05W#3OP;=`<%l#1p01O#3YW(S!bT0/lOY#3RZw#3Rwx#2dx#O#3R#O#P#2d#P;'S#3R;'S;=`#3r<%lO#3R01O#3uP;=`<%l#3R06j#3{P;=`<%l#0n05x#4X]$g&j(PpT0/lOY#4OYZ&cZr#4Ors#1ps!^#4O!^!_#5Q!_#O#4O#O#P#1p#P#o#4O#o#p#5Q#p;'S#4O;'S;=`#5w<%lO#4O00^#5XW(PpT0/lOY#5QZr#5Qrs#2ds#O#5Q#O#P#2d#P;'S#5Q;'S;=`#5q<%lO#5Q00^#5tP;=`<%l#5Q05x#5zP;=`<%l#4O01p#6WY(Pp(S!bT0/lOY#5}Zr#5}rs#3Rsw#5}wx#5Qx#O#5}#O#P#2d#P;'S#5};'S;=`#6v<%lO#5}01p#6yP;=`<%l#5}07[#7PP;=`<%l#/d)3h#7ab$g&j$P(Ch(Pp(S!b!U7`OY!;ZYZ&cZr!;Zrs!<nsw!;Zwx!Lcx!P!;Z!P!Q#&`!Q!^!;Z!^!_#(i!_!}!;Z!}#O#,f#O#P!Dy#P#o!;Z#o#p#(i#p;'S!;Z;'S;=`#-w<%lO!;ZAt#8vb$X#t$g&j(Pp(S!b!U7`OY!;ZYZ&cZr!;Zrs!<nsw!;Zwx!Lcx!P!;Z!P!Q#&`!Q!^!;Z!^!_#(i!_!}!;Z!}#O#,f#O#P!Dy#P#o!;Z#o#p#(i#p;'S!;Z;'S;=`#-w<%lO!;Z'Ad#:Zp$g&j(Pp(S!bp'9tOY%ZYZ&cZr%Zrs&}sw%Zwx(rx!O%Z!O!P!3Y!P!Q%Z!Q![#<_![!^%Z!^!_*g!_!g%Z!g!h!4|!h#O%Z#O#P&c#P#R%Z#R#S#<_#S#U%Z#U#V#?i#V#X%Z#X#Y!4|#Y#b%Z#b#c#>_#c#d#Bq#d#l%Z#l#m#Es#m#o%Z#o#p*g#p;'S%Z;'S;=`+a<%lO%Z'Ad#<jk$g&j(Pp(S!bp'9tOY%ZYZ&cZr%Zrs&}sw%Zwx(rx!O%Z!O!P!3Y!P!Q%Z!Q![#<_![!^%Z!^!_*g!_!g%Z!g!h!4|!h#O%Z#O#P&c#P#R%Z#R#S#<_#S#X%Z#X#Y!4|#Y#b%Z#b#c#>_#c#o%Z#o#p*g#p;'S%Z;'S;=`+a<%lO%Z'Ad#>j_$g&j(Pp(S!bp'9tOY%ZYZ&cZr%Zrs&}sw%Zwx(rx!^%Z!^!_*g!_#O%Z#O#P&c#P#o%Z#o#p*g#p;'S%Z;'S;=`+a<%lO%Z'Ad#?rd$g&j(Pp(S!bOY%ZYZ&cZr%Zrs&}sw%Zwx(rx!Q%Z!Q!R#AQ!R!S#AQ!S!^%Z!^!_*g!_#O%Z#O#P&c#P#R%Z#R#S#AQ#S#o%Z#o#p*g#p;'S%Z;'S;=`+a<%lO%Z'Ad#A]f$g&j(Pp(S!bp'9tOY%ZYZ&cZr%Zrs&}sw%Zwx(rx!Q%Z!Q!R#AQ!R!S#AQ!S!^%Z!^!_*g!_#O%Z#O#P&c#P#R%Z#R#S#AQ#S#b%Z#b#c#>_#c#o%Z#o#p*g#p;'S%Z;'S;=`+a<%lO%Z'Ad#Bzc$g&j(Pp(S!bOY%ZYZ&cZr%Zrs&}sw%Zwx(rx!Q%Z!Q!Y#DV!Y!^%Z!^!_*g!_#O%Z#O#P&c#P#R%Z#R#S#DV#S#o%Z#o#p*g#p;'S%Z;'S;=`+a<%lO%Z'Ad#Dbe$g&j(Pp(S!bp'9tOY%ZYZ&cZr%Zrs&}sw%Zwx(rx!Q%Z!Q!Y#DV!Y!^%Z!^!_*g!_#O%Z#O#P&c#P#R%Z#R#S#DV#S#b%Z#b#c#>_#c#o%Z#o#p*g#p;'S%Z;'S;=`+a<%lO%Z'Ad#E|g$g&j(Pp(S!bOY%ZYZ&cZr%Zrs&}sw%Zwx(rx!Q%Z!Q![#Ge![!^%Z!^!_*g!_!c%Z!c!i#Ge!i#O%Z#O#P&c#P#R%Z#R#S#Ge#S#T%Z#T#Z#Ge#Z#o%Z#o#p*g#p;'S%Z;'S;=`+a<%lO%Z'Ad#Gpi$g&j(Pp(S!bp'9tOY%ZYZ&cZr%Zrs&}sw%Zwx(rx!Q%Z!Q![#Ge![!^%Z!^!_*g!_!c%Z!c!i#Ge!i#O%Z#O#P&c#P#R%Z#R#S#Ge#S#T%Z#T#Z#Ge#Z#b%Z#b#c#>_#c#o%Z#o#p*g#p;'S%Z;'S;=`+a<%lO%Z*)x#Il_!d$b$g&j#})Lv(Pp(S!bOY%ZYZ&cZr%Zrs&}sw%Zwx(rx!^%Z!^!_*g!_#O%Z#O#P&c#P#o%Z#o#p*g#p;'S%Z;'S;=`+a<%lO%Z)[#Jv_al$g&j(Pp(S!bOY%ZYZ&cZr%Zrs&}sw%Zwx(rx!^%Z!^!_*g!_#O%Z#O#P&c#P#o%Z#o#p*g#p;'S%Z;'S;=`+a<%lO%Z04f#LS^h#)`!i-<U(Pp(S!b(v7`OY*gZr*grs'}sw*gwx)rx!P*g!P!Q#MO!Q!^*g!^!_#Mt!_!`$ f!`#O*g#P;'S*g;'S;=`+Z<%lO*g(n#MXX$i&j(Pp(S!bOY*gZr*grs'}sw*gwx)rx#O*g#P;'S*g;'S;=`+Z<%lO*g(El#M}Z#o(Ch(Pp(S!bOY*gZr*grs'}sw*gwx)rx!_*g!_!`#Np!`#O*g#P;'S*g;'S;=`+Z<%lO*g(El#NyX$P(Ch(Pp(S!bOY*gZr*grs'}sw*gwx)rx#O*g#P;'S*g;'S;=`+Z<%lO*g(El$ oX#p(Ch(Pp(S!bOY*gZr*grs'}sw*gwx)rx#O*g#P;'S*g;'S;=`+Z<%lO*g*)x$!ga#]*!Y$g&j(Pp(S!bOY%ZYZ&cZr%Zrs&}sw%Zwx(rx!^%Z!^!_*g!_!`0z!`!a$#l!a#O%Z#O#P&c#P#o%Z#o#p*g#p;'S%Z;'S;=`+a<%lO%Z(K[$#w_#h(Cl$g&j(Pp(S!bOY%ZYZ&cZr%Zrs&}sw%Zwx(rx!^%Z!^!_*g!_#O%Z#O#P&c#P#o%Z#o#p*g#p;'S%Z;'S;=`+a<%lO%Z*)x$%Vag!*r#p(Ch$d#|$g&j(Pp(S!bOY%ZYZ&cZr%Zrs&}sw%Zwx(rx!^%Z!^!_*g!_!`$&[!`!a$'f!a#O%Z#O#P&c#P#o%Z#o#p*g#p;'S%Z;'S;=`+a<%lO%Z(KW$&g_#p(Ch$g&j(Pp(S!bOY%ZYZ&cZr%Zrs&}sw%Zwx(rx!^%Z!^!_*g!_#O%Z#O#P&c#P#o%Z#o#p*g#p;'S%Z;'S;=`+a<%lO%Z(KW$'qa#o(Ch$g&j(Pp(S!bOY%ZYZ&cZr%Zrs&}sw%Zwx(rx!^%Z!^!_*g!_!`Ka!`!a$(v!a#O%Z#O#P&c#P#o%Z#o#p*g#p;'S%Z;'S;=`+a<%lO%Z(KW$)R`#o(Ch$g&j(Pp(S!bOY%ZYZ&cZr%Zrs&}sw%Zwx(rx!^%Z!^!_*g!_!`Ka!`#O%Z#O#P&c#P#o%Z#o#p*g#p;'S%Z;'S;=`+a<%lO%Z(Kd$*`a(j(Ct$g&j(Pp(S!bOY%ZYZ&cZr%Zrs&}sw%Zwx(rx!^%Z!^!_*g!_!a%Z!a!b$+e!b#O%Z#O#P&c#P#o%Z#o#p*g#p;'S%Z;'S;=`+a<%lO%Z(KW$+p`$g&j#z(Ch(Pp(S!bOY%ZYZ&cZr%Zrs&}sw%Zwx(rx!^%Z!^!_*g!_!`Ka!`#O%Z#O#P&c#P#o%Z#o#p*g#p;'S%Z;'S;=`+a<%lO%Z%#`$,}_!|$Ip$g&j(Pp(S!bOY%ZYZ&cZr%Zrs&}sw%Zwx(rx!^%Z!^!_*g!_#O%Z#O#P&c#P#o%Z#o#p*g#p;'S%Z;'S;=`+a<%lO%Z04f$.X_!P0,v$g&j(Pp(S!bOY%ZYZ&cZr%Zrs&}sw%Zwx(rx!^%Z!^!_*g!_#O%Z#O#P&c#P#o%Z#o#p*g#p;'S%Z;'S;=`+a<%lO%Z(n$/]Z$g&jO!^$0O!^!_$0f!_#i$0O#i#j$0k#j#l$0O#l#m$2^#m#o$0O#o#p$0f#p;'S$0O;'S;=`$4i<%lO$0O(n$0VT_#S$g&jO!^&c!_#o&c#p;'S&c;'S;=`&w<%lO&c#S$0kO_#S(n$0p[$g&jO!Q&c!Q![$1f![!^&c!_!c&c!c!i$1f!i#T&c#T#Z$1f#Z#o&c#o#p$3|#p;'S&c;'S;=`&w<%lO&c(n$1kZ$g&jO!Q&c!Q![$2^![!^&c!_!c&c!c!i$2^!i#T&c#T#Z$2^#Z#o&c#p;'S&c;'S;=`&w<%lO&c(n$2cZ$g&jO!Q&c!Q![$3U![!^&c!_!c&c!c!i$3U!i#T&c#T#Z$3U#Z#o&c#p;'S&c;'S;=`&w<%lO&c(n$3ZZ$g&jO!Q&c!Q![$0O![!^&c!_!c&c!c!i$0O!i#T&c#T#Z$0O#Z#o&c#p;'S&c;'S;=`&w<%lO&c#S$4PR!Q![$4Y!c!i$4Y#T#Z$4Y#S$4]S!Q![$4Y!c!i$4Y#T#Z$4Y#q#r$0f(n$4lP;=`<%l$0O#1[$4z_!V#)l$g&j(Pp(S!bOY%ZYZ&cZr%Zrs&}sw%Zwx(rx!^%Z!^!_*g!_#O%Z#O#P&c#P#o%Z#o#p*g#p;'S%Z;'S;=`+a<%lO%Z(KW$6U`#w(Ch$g&j(Pp(S!bOY%ZYZ&cZr%Zrs&}sw%Zwx(rx!^%Z!^!_*g!_!`Ka!`#O%Z#O#P&c#P#o%Z#o#p*g#p;'S%Z;'S;=`+a<%lO%Z+;p$7c_$g&j(Pp(S!b(Y+4QOY%ZYZ&cZr%Zrs&}sw%Zwx(rx!^%Z!^!_*g!_#O%Z#O#P&c#P#o%Z#o#p*g#p;'S%Z;'S;=`+a<%lO%Z07[$8qk$g&j(Pp(S!b'|,2j$]#t(]$I[OY%ZYZ&cZr%Zrs&}st%Ztu$8buw%Zwx(rx}%Z}!O$:f!O!Q%Z!Q![$8b![!^%Z!^!_*g!_!c%Z!c!}$8b!}#O%Z#O#P&c#P#R%Z#R#S$8b#S#T%Z#T#o$8b#o#p*g#p$g%Z$g;'S$8b;'S;=`$<l<%lO$8b+d$:qk$g&j(Pp(S!b$]#tOY%ZYZ&cZr%Zrs&}st%Ztu$:fuw%Zwx(rx}%Z}!O$:f!O!Q%Z!Q![$:f![!^%Z!^!_*g!_!c%Z!c!}$:f!}#O%Z#O#P&c#P#R%Z#R#S$:f#S#T%Z#T#o$:f#o#p*g#p$g%Z$g;'S$:f;'S;=`$<f<%lO$:f+d$<iP;=`<%l$:f07[$<oP;=`<%l$8b#Jf$<{X![#Hb(Pp(S!bOY*gZr*grs'}sw*gwx)rx#O*g#P;'S*g;'S;=`+Z<%lO*g,#x$=sa(q+JY$g&j(Pp(S!bOY%ZYZ&cZr%Zrs&}sw%Zwx(rx!^%Z!^!_*g!_!`Ka!`#O%Z#O#P&c#P#o%Z#o#p*g#p#q$+e#q;'S%Z;'S;=`+a<%lO%Z(Kd$?V_!Z(Cds`$g&j(Pp(S!bOY%ZYZ&cZr%Zrs&}sw%Zwx(rx!^%Z!^!_*g!_#O%Z#O#P&c#P#o%Z#o#p*g#p;'S%Z;'S;=`+a<%lO%Z?O$@a_!q7`$g&j(Pp(S!bOY%ZYZ&cZr%Zrs&}sw%Zwx(rx!^%Z!^!_*g!_#O%Z#O#P&c#P#o%Z#o#p*g#p;'S%Z;'S;=`+a<%lO%Z07[$Aq|$g&j(Pp(S!b'u0/l$Z#t'|,2j(]$I[OX%ZXY+gYZ&cZ[+g[p%Zpq+gqr%Zrs&}st%ZtuEruw%Zwx(rx}%Z}!OGv!O!Q%Z!Q![Er![!^%Z!^!_*g!_!c%Z!c!}Er!}#O%Z#O#P&c#P#R%Z#R#SEr#S#T%Z#T#oEr#o#p*g#p$f%Z$f$g+g$g#BYEr#BY#BZ$A`#BZ$ISEr$IS$I_$A`$I_$JTEr$JT$JU$A`$JU$KVEr$KV$KW$A`$KW&FUEr&FU&FV$A`&FV;'SEr;'S;=`I|<%l?HTEr?HT?HU$A`?HUOEr07[$D|k$g&j(Pp(S!b'v0/l$Z#t'|,2j(]$I[OY%ZYZ&cZr%Zrs&}st%ZtuEruw%Zwx(rx}%Z}!OGv!O!Q%Z!Q![Er![!^%Z!^!_*g!_!c%Z!c!}Er!}#O%Z#O#P&c#P#R%Z#R#SEr#S#T%Z#T#oEr#o#p*g#p$g%Z$g;'SEr;'S;=`I|<%lOEr",tokenizers:[Wd,Md,_d,2,3,4,5,6,7,8,9,10,11,12,13,14,Yd,new Gh("$S~RRtu[#O#Pg#S#T#|~_P#o#pb~gOu~~jVO#i!P#i#j!U#j#l!P#l#m!q#m;'S!P;'S;=`#v<%lO!P~!UO!R~~!XS!Q![!e!c!i!e#T#Z!e#o#p#Z~!hR!Q![!q!c!i!q#T#Z!q~!tR!Q![!}!c!i!}#T#Z!}~#QR!Q![!P!c!i!P#T#Z!P~#^R!Q![#g!c!i#g#T#Z#g~#jS!Q![#g!c!i#g#T#Z#g#q#r!P~#yP;=`<%l!P~$RO([~~",141,333),new Gh("j~RQYZXz{^~^O'y~~aP!P!Qd~iO'z~~",25,316)],topRules:{Script:[0,7],SingleExpression:[1,270],SingleClassItem:[2,271]},dialects:{jsx:0,ts:14840},dynamicPrecedences:{70:1,80:1,82:1,166:1,194:1},specialized:[{term:320,get:t=>zd[t]||-1},{term:335,get:t=>Vd[t]||-1},{term:71,get:t=>Dd[t]||-1}],tokenPrec:14864}),Nd=[MO("function ${name}(${params}) {\n\t${}\n}",{label:"function",detail:"definition",type:"keyword"}),MO("for (let ${index} = 0; ${index} < ${bound}; ${index}++) {\n\t${}\n}",{label:"for",detail:"loop",type:"keyword"}),MO("for (let ${name} of ${collection}) {\n\t${}\n}",{label:"for",detail:"of loop",type:"keyword"}),MO("do {\n\t${}\n} while (${})",{label:"do",detail:"loop",type:"keyword"}),MO("while (${}) {\n\t${}\n}",{label:"while",detail:"loop",type:"keyword"}),MO("try {\n\t${}\n} catch (${error}) {\n\t${}\n}",{label:"try",detail:"/ catch block",type:"keyword"}),MO("if (${}) {\n\t${}\n}",{label:"if",detail:"block",type:"keyword"}),MO("if (${}) {\n\t${}\n} else {\n\t${}\n}",{label:"if",detail:"/ else block",type:"keyword"}),MO("class ${name} {\n\tconstructor(${params}) {\n\t\t${}\n\t}\n}",{label:"class",detail:"definition",type:"keyword"}),MO('import {${names}} from "${module}"\n${}',{label:"import",detail:"named",type:"keyword"}),MO('import ${name} from "${module}"\n${}',{label:"import",detail:"default",type:"keyword"})];Nd.concat([MO("interface ${name} {\n\t${}\n}",{label:"interface",detail:"definition",type:"keyword"}),MO("type ${name} = ${type}",{label:"type",detail:"definition",type:"keyword"}),MO("enum ${name} {\n\t${}\n}",{label:"enum",detail:"definition",type:"keyword"})]);const sp=_a.define({name:"javascript",parser:Ud.configure({props:[al.add({IfStatement:gl({except:/^\s*({|else\b)/}),TryStatement:gl({except:/^\s*({|catch\b|finally\b)/}),LabeledStatement:pl,SwitchBody:t=>{let e=t.textAfter,i=/^\s*\}/.test(e),n=/^\s*(case|default)\b/.test(e);return t.baseIndent+(i?0:n?1:2)*t.unit},Block:fl({closing:"}"}),ArrowFunction:t=>t.baseIndent+t.unit,"TemplateString BlockComment":()=>null,"Statement Property":gl({except:/^{/}),JSXElement(t){let e=/^\s*<\//.test(t.textAfter);return t.lineIndent(t.node.from)+(e?0:t.unit)},JSXEscape(t){let e=/\s*\}/.test(t.textAfter);return t.lineIndent(t.node.from)+(e?0:t.unit)},"JSXOpenTag JSXSelfClosingTag":t=>t.column(t.node.from)+t.unit}),bl.add({"Block ClassBody SwitchBody EnumBody ObjectExpression ArrayExpression ObjectType":Sl,BlockComment:t=>({from:t.from+2,to:t.to-2})})]}),languageData:{closeBrackets:{brackets:["(","[","{","'",'"',"`"]},commentTokens:{line:"//",block:{open:"/*",close:"*/"}},indentOnInput:/^\s*(?:case |default:|\{|\}|<\/)$/,wordChars:"$"}}),rp={test:t=>/^JSX/.test(t.name),facet:Ya({commentTokens:{block:{open:"{/*",close:"*/}"}}})},op=sp.configure({dialect:"ts"},"typescript"),ap=sp.configure({dialect:"jsx",props:[Wa.add((t=>t.isTop?[rp]:void 0))]}),lp=sp.configure({dialect:"jsx ts",props:[Wa.add((t=>t.isTop?[rp]:void 0))]},"typescript");let hp=t=>({label:t,type:"keyword"});const cp="break case const continue default delete export extends false finally in instanceof let new return static super switch this throw true typeof var yield".split(" ").map(hp);cp.concat(["declare","implements","private","protected","public"].map(hp));function fp(t,e,i=t.length){for(let n=null==e?void 0:e.firstChild;n;n=n.nextSibling)if("JSXIdentifier"==n.name||"JSXBuiltin"==n.name||"JSXNamespacedName"==n.name||"JSXMemberExpression"==n.name)return t.sliceString(n.from,Math.min(n.to,i));return ""}const dp="object"==typeof navigator&&/Android\b/.test(navigator.userAgent);Yr.inputHandler.of(((t,e,i,n,s)=>{if((dp?t.composing:t.compositionStarted)||t.state.readOnly||e!=i||">"!=n&&"/"!=n||!sp.isActiveAt(t.state,e,-1))return !1;let r=s(),{state:o}=r,a=o.changeByRange((t=>{var e;let i,{head:s}=t,r=Ea(o).resolveInner(s-1,-1);if("JSXStartTag"==r.name&&(r=r.parent),o.doc.sliceString(s-1,s)!=n||"JSXAttributeValue"==r.name&&r.to>s);else {if(">"==n&&"JSXFragmentTag"==r.name)return {range:t,changes:{from:s,insert:"</>"}};if("/"==n&&"JSXStartCloseTag"==r.name){let t=r.parent,n=t.parent;if(n&&t.from==s-2&&((i=fp(o.doc,n.firstChild,s))||"JSXFragmentTag"==(null===(e=n.firstChild)||void 0===e?void 0:e.name))){let t=`${i}>`;return {range:kt.cursor(s+t.length,-1),changes:{from:s,insert:t}}}}else if(">"==n){let e=function(t){for(;;){if("JSXOpenTag"==t.name||"JSXSelfClosingTag"==t.name||"JSXFragmentTag"==t.name)return t;if("JSXEscape"==t.name||!t.parent)return null;t=t.parent;}}(r);if(e&&!/^\/?>|^<\//.test(o.doc.sliceString(s,s+2))&&(i=fp(o.doc,e,s)))return {range:t,changes:{from:s,insert:`</${i}>`}}}}return {range:t}}));return !a.changes.empty&&(t.dispatch([r,o.update(a,{userEvent:"input.complete",scrollIntoView:!0})]),!0)}));const bp=["_blank","_self","_top","_parent"],Sp=["ascii","utf-8","utf-16","latin1","latin1"],Qp=["get","post","put","delete"],xp=["application/x-www-form-urlencoded","multipart/form-data","text/plain"],yp=["true","false"],vp={},Pp={a:{attrs:{href:null,ping:null,type:null,media:null,target:bp,hreflang:null}},abbr:vp,address:vp,area:{attrs:{alt:null,coords:null,href:null,target:null,ping:null,media:null,hreflang:null,type:null,shape:["default","rect","circle","poly"]}},article:vp,aside:vp,audio:{attrs:{src:null,mediagroup:null,crossorigin:["anonymous","use-credentials"],preload:["none","metadata","auto"],autoplay:["autoplay"],loop:["loop"],controls:["controls"]}},b:vp,base:{attrs:{href:null,target:bp}},bdi:vp,bdo:vp,blockquote:{attrs:{cite:null}},body:vp,br:vp,button:{attrs:{form:null,formaction:null,name:null,value:null,autofocus:["autofocus"],disabled:["autofocus"],formenctype:xp,formmethod:Qp,formnovalidate:["novalidate"],formtarget:bp,type:["submit","reset","button"]}},canvas:{attrs:{width:null,height:null}},caption:vp,center:vp,cite:vp,code:vp,col:{attrs:{span:null}},colgroup:{attrs:{span:null}},command:{attrs:{type:["command","checkbox","radio"],label:null,icon:null,radiogroup:null,command:null,title:null,disabled:["disabled"],checked:["checked"]}},data:{attrs:{value:null}},datagrid:{attrs:{disabled:["disabled"],multiple:["multiple"]}},datalist:{attrs:{data:null}},dd:vp,del:{attrs:{cite:null,datetime:null}},details:{attrs:{open:["open"]}},dfn:vp,div:vp,dl:vp,dt:vp,em:vp,embed:{attrs:{src:null,type:null,width:null,height:null}},eventsource:{attrs:{src:null}},fieldset:{attrs:{disabled:["disabled"],form:null,name:null}},figcaption:vp,figure:vp,footer:vp,form:{attrs:{action:null,name:null,"accept-charset":Sp,autocomplete:["on","off"],enctype:xp,method:Qp,novalidate:["novalidate"],target:bp}},h1:vp,h2:vp,h3:vp,h4:vp,h5:vp,h6:vp,head:{children:["title","base","link","style","meta","script","noscript","command"]},header:vp,hgroup:vp,hr:vp,html:{attrs:{manifest:null}},i:vp,iframe:{attrs:{src:null,srcdoc:null,name:null,width:null,height:null,sandbox:["allow-top-navigation","allow-same-origin","allow-forms","allow-scripts"],seamless:["seamless"]}},img:{attrs:{alt:null,src:null,ismap:null,usemap:null,width:null,height:null,crossorigin:["anonymous","use-credentials"]}},input:{attrs:{alt:null,dirname:null,form:null,formaction:null,height:null,list:null,max:null,maxlength:null,min:null,name:null,pattern:null,placeholder:null,size:null,src:null,step:null,value:null,width:null,accept:["audio/*","video/*","image/*"],autocomplete:["on","off"],autofocus:["autofocus"],checked:["checked"],disabled:["disabled"],formenctype:xp,formmethod:Qp,formnovalidate:["novalidate"],formtarget:bp,multiple:["multiple"],readonly:["readonly"],required:["required"],type:["hidden","text","search","tel","url","email","password","datetime","date","month","week","time","datetime-local","number","range","color","checkbox","radio","file","submit","image","reset","button"]}},ins:{attrs:{cite:null,datetime:null}},kbd:vp,keygen:{attrs:{challenge:null,form:null,name:null,autofocus:["autofocus"],disabled:["disabled"],keytype:["RSA"]}},label:{attrs:{for:null,form:null}},legend:vp,li:{attrs:{value:null}},link:{attrs:{href:null,type:null,hreflang:null,media:null,sizes:["all","16x16","16x16 32x32","16x16 32x32 64x64"]}},map:{attrs:{name:null}},mark:vp,menu:{attrs:{label:null,type:["list","context","toolbar"]}},meta:{attrs:{content:null,charset:Sp,name:["viewport","application-name","author","description","generator","keywords"],"http-equiv":["content-language","content-type","default-style","refresh"]}},meter:{attrs:{value:null,min:null,low:null,high:null,max:null,optimum:null}},nav:vp,noscript:vp,object:{attrs:{data:null,type:null,name:null,usemap:null,form:null,width:null,height:null,typemustmatch:["typemustmatch"]}},ol:{attrs:{reversed:["reversed"],start:null,type:["1","a","A","i","I"]},children:["li","script","template","ul","ol"]},optgroup:{attrs:{disabled:["disabled"],label:null}},option:{attrs:{disabled:["disabled"],label:null,selected:["selected"],value:null}},output:{attrs:{for:null,form:null,name:null}},p:vp,param:{attrs:{name:null,value:null}},pre:vp,progress:{attrs:{value:null,max:null}},q:{attrs:{cite:null}},rp:vp,rt:vp,ruby:vp,samp:vp,script:{attrs:{type:["text/javascript"],src:null,async:["async"],defer:["defer"],charset:Sp}},section:vp,select:{attrs:{form:null,name:null,size:null,autofocus:["autofocus"],disabled:["disabled"],multiple:["multiple"]}},slot:{attrs:{name:null}},small:vp,source:{attrs:{src:null,type:null,media:null}},span:vp,strong:vp,style:{attrs:{type:["text/css"],media:null,scoped:null}},sub:vp,summary:vp,sup:vp,table:vp,tbody:vp,td:{attrs:{colspan:null,rowspan:null,headers:null}},template:vp,textarea:{attrs:{dirname:null,form:null,maxlength:null,name:null,placeholder:null,rows:null,cols:null,autofocus:["autofocus"],disabled:["disabled"],readonly:["readonly"],required:["required"],wrap:["soft","hard"]}},tfoot:vp,th:{attrs:{colspan:null,rowspan:null,headers:null,scope:["row","col","rowgroup","colgroup"]}},thead:vp,time:{attrs:{datetime:null}},title:vp,tr:vp,track:{attrs:{src:null,label:null,default:null,kind:["subtitles","captions","descriptions","chapters","metadata"],srclang:null}},ul:{children:["li","script","template","ul","ol"]},var:vp,video:{attrs:{src:null,poster:null,width:null,height:null,crossorigin:["anonymous","use-credentials"],preload:["auto","metadata","none"],autoplay:["autoplay"],mediagroup:["movie"],muted:["muted"],controls:["controls"]}},wbr:vp},kp={accesskey:null,class:null,contenteditable:yp,contextmenu:null,dir:["ltr","rtl","auto"],draggable:["true","false","auto"],dropzone:["copy","move","link","string:","file:"],hidden:["hidden"],id:null,inert:["inert"],itemid:null,itemprop:null,itemref:null,itemscope:["itemscope"],itemtype:null,lang:["ar","bn","de","en-GB","en-US","es","fr","hi","id","ja","pa","pt","ru","tr","zh"],spellcheck:yp,autocorrect:yp,autocapitalize:yp,style:null,tabindex:null,title:null,translate:["yes","no"],rel:["stylesheet","alternate","author","bookmark","help","license","next","nofollow","noreferrer","prefetch","prev","search","tag"],role:"alert application article banner button cell checkbox complementary contentinfo dialog document feed figure form grid gridcell heading img list listbox listitem main navigation region row rowgroup search switch tab table tabpanel textbox timer".split(" "),"aria-activedescendant":null,"aria-atomic":yp,"aria-autocomplete":["inline","list","both","none"],"aria-busy":yp,"aria-checked":["true","false","mixed","undefined"],"aria-controls":null,"aria-describedby":null,"aria-disabled":yp,"aria-dropeffect":null,"aria-expanded":["true","false","undefined"],"aria-flowto":null,"aria-grabbed":["true","false","undefined"],"aria-haspopup":yp,"aria-hidden":yp,"aria-invalid":["true","false","grammar","spelling"],"aria-label":null,"aria-labelledby":null,"aria-level":null,"aria-live":["off","polite","assertive"],"aria-multiline":yp,"aria-multiselectable":yp,"aria-owns":null,"aria-posinset":null,"aria-pressed":["true","false","mixed","undefined"],"aria-readonly":yp,"aria-relevant":null,"aria-required":yp,"aria-selected":["true","false","undefined"],"aria-setsize":null,"aria-sort":["ascending","descending","none","other"],"aria-valuemax":null,"aria-valuemin":null,"aria-valuenow":null,"aria-valuetext":null},$p="beforeunload copy cut dragstart dragover dragleave dragenter dragend drag paste focus blur change click load mousedown mouseenter mouseleave mouseup keydown keyup resize scroll unload".split(" ").map((t=>"on"+t));for(let t of $p)kp[t]=null;class Zp{constructor(t,e){this.tags=Object.assign(Object.assign({},Pp),t),this.globalAttrs=Object.assign(Object.assign({},kp),e),this.allTags=Object.keys(this.tags),this.globalAttrNames=Object.keys(this.globalAttrs);}}function Xp(t,e,i=t.length){if(!e)return "";let n=e.firstChild,s=n&&n.getChild("TagName");return s?t.sliceString(s.from,Math.min(s.to,i)):""}Zp.default=new Zp;const _p=sp.parser.configure({top:"SingleExpression"}),Ep=[{tag:"script",attrs:t=>"text/typescript"==t.type||"ts"==t.lang,parser:op.parser},{tag:"script",attrs:t=>"text/babel"==t.type||"text/jsx"==t.type,parser:ap.parser},{tag:"script",attrs:t=>"text/typescript-jsx"==t.type,parser:lp.parser},{tag:"script",attrs:t=>/^(importmap|speculationrules|application\/(.+\+)?json)$/i.test(t.type),parser:_p},{tag:"script",attrs:t=>!t.type||/^(?:text|application)\/(?:x-)?(?:java|ecma)script$|^module$|^$/i.test(t.type),parser:sp.parser},{tag:"style",attrs:t=>(!t.lang||"css"==t.lang)&&(!t.type||/^(text\/)?(x-)?(stylesheet|css)$/i.test(t.type)),parser:qc.parser}],zp=[{name:"style",parser:qc.parser.configure({top:"Styles"})}].concat($p.map((t=>({name:t,parser:sp.parser})))),Vp=_a.define({name:"html",parser:Zd.configure({props:[al.add({Element(t){let e=/^(\s*)(<\/)?/.exec(t.textAfter);return t.node.to<=t.pos+e[0].length?t.continue():t.lineIndent(t.node.from)+(e[2]?0:t.unit)},"OpenTag CloseTag SelfClosingTag":t=>t.column(t.node.from)+t.unit,Document(t){if(t.pos+/\s*/.exec(t.textAfter)[0].length<t.node.to)return t.continue();let e,i=null;for(let e=t.node;;){let t=e.lastChild;if(!t||"Element"!=t.name||t.to!=e.to)break;i=e=t;}return i&&(!(e=i.lastChild)||"CloseTag"!=e.name&&"SelfClosingTag"!=e.name)?t.lineIndent(i.from)+t.unit:null}}),bl.add({Element(t){let e=t.firstChild,i=t.lastChild;return e&&"OpenTag"==e.name?{from:e.to,to:"CloseTag"==i.name?i.from:t.to}:null}}),oh.add({"OpenTag CloseTag":t=>t.getChild("TagName")})]}),languageData:{commentTokens:{block:{open:"\x3c!--",close:"--\x3e"}},indentOnInput:/^\s*<\/\w+\W$/,wordChars:"-._"}}),Dp=Vp.configure({wrap:Ad(Ep,zp)});const Np=new Set("area base br col command embed frame hr img input keygen link meta param source track wbr menuitem".split(" "));Yr.inputHandler.of(((t,e,i,n,s)=>{if(t.composing||t.state.readOnly||e!=i||">"!=n&&"/"!=n||!Dp.isActiveAt(t.state,e,-1))return !1;let r=s(),{state:o}=r,a=o.changeByRange((t=>{var e,i,s;let r,a=o.doc.sliceString(t.from-1,t.to)==n,{head:l}=t,h=Ea(o).resolveInner(l-1,-1);if("TagName"!=h.name&&"StartTag"!=h.name||(h=h.parent),a&&">"==n&&"OpenTag"==h.name){if("CloseTag"!=(null===(i=null===(e=h.parent)||void 0===e?void 0:e.lastChild)||void 0===i?void 0:i.name)&&(r=Xp(o.doc,h.parent,l))&&!Np.has(r)){return {range:t,changes:{from:l,to:l+(">"===o.doc.sliceString(l,l+1)?1:0),insert:`</${r}>`}}}}else if(a&&"/"==n&&"IncompleteCloseTag"==h.name){let t=h.parent;if(h.from==l-2&&"CloseTag"!=(null===(s=t.lastChild)||void 0===s?void 0:s.name)&&(r=Xp(o.doc,t,l))&&!Np.has(r)){let t=l+(">"===o.doc.sliceString(l,l+1)?1:0),e=`${r}>`;return {range:kt.cursor(l+e.length,-1),changes:{from:l,to:t,insert:e}}}}return {range:t}}));return !a.changes.empty&&(t.dispatch([r,o.update(a,{userEvent:"input.complete",scrollIntoView:!0})]),!0)}));const Ip="function"==typeof String.prototype.normalize?t=>t.normalize("NFKD"):t=>t;class Lp{constructor(t,e,i=0,n=t.length,s,r){this.test=r,this.value={from:0,to:0},this.done=!1,this.matches=[],this.buffer="",this.bufferPos=0,this.iter=t.iterRange(i,n),this.bufferStart=i,this.normalize=s?t=>s(Ip(t)):Ip,this.query=this.normalize(e);}peek(){if(this.bufferPos==this.buffer.length){if(this.bufferStart+=this.buffer.length,this.iter.next(),this.iter.done)return -1;this.bufferPos=0,this.buffer=this.iter.value;}return ut(this.buffer,this.bufferPos)}next(){for(;this.matches.length;)this.matches.pop();return this.nextOverlapping()}nextOverlapping(){for(;;){let t=this.peek();if(t<0)return this.done=!0,this;let e=ft(t),i=this.bufferStart+this.bufferPos;this.bufferPos+=dt(t);let n=this.normalize(e);for(let t=0,s=i;;t++){let r=n.charCodeAt(t),o=this.match(r,s);if(t==n.length-1){if(o)return this.value=o,this;break}s==i&&t<e.length&&e.charCodeAt(t)==r&&s++;}}}match(t,e){let i=null;for(let n=0;n<this.matches.length;n+=2){let s=this.matches[n],r=!1;this.query.charCodeAt(s)==t&&(s==this.query.length-1?i={from:this.matches[n+1],to:e+1}:(this.matches[n]++,r=!0)),r||(this.matches.splice(n,2),n-=2);}return this.query.charCodeAt(0)==t&&(1==this.query.length?i={from:e,to:e+1}:this.matches.push(1,e)),i&&this.test&&!this.test(i.from,i.to,this.buffer,this.bufferStart)&&(i=null),i}}"undefined"!=typeof Symbol&&(Lp.prototype[Symbol.iterator]=function(){return this});const ng={highlightWordAroundCursor:!1,minSelectionLength:1,maxMatches:100,wholeWords:!1},sg=Xt.define({combine:t=>we(t,ng,{highlightWordAroundCursor:(t,e)=>t||e,minSelectionLength:Math.min,maxMatches:Math.min})});const og=Ii.mark({class:"cm-selectionMatch"}),ag=Ii.mark({class:"cm-selectionMatch cm-selectionMatch-main"});function lg(t,e,i,n){return !(0!=i&&t(e.sliceDoc(i-1,i))==fe.Word||n!=e.doc.length&&t(e.sliceDoc(n,n+1))==fe.Word)}jn.fromClass(class{constructor(t){this.decorations=this.getDeco(t);}update(t){(t.selectionSet||t.docChanged||t.viewportChanged)&&(this.decorations=this.getDeco(t.view));}getDeco(t){let e=t.state.facet(sg),{state:i}=t,n=i.selection;if(n.ranges.length>1)return Ii.none;let s,r=n.main,o=null;if(r.empty){if(!e.highlightWordAroundCursor)return Ii.none;let t=i.wordAt(r.head);if(!t)return Ii.none;o=i.charCategorizer(r.head),s=i.sliceDoc(t.from,t.to);}else {let t=r.to-r.from;if(t<e.minSelectionLength||t>200)return Ii.none;if(e.wholeWords){if(s=i.sliceDoc(r.from,r.to),o=i.charCategorizer(r.head),!lg(o,i,r.from,r.to)||!function(t,e,i,n){return t(e.sliceDoc(i,i+1))==fe.Word&&t(e.sliceDoc(n-1,n))==fe.Word}(o,i,r.from,r.to))return Ii.none}else if(s=i.sliceDoc(r.from,r.to).trim(),!s)return Ii.none}let a=[];for(let n of t.visibleRanges){let t=new Lp(i.doc,s,n.from,n.to);for(;!t.next().done;){let{from:n,to:s}=t.value;if((!o||lg(o,i,n,s))&&(r.empty&&n<=r.from&&s>=r.to?a.push(ag.range(n,s)):(n>=r.to||s<=r.from)&&a.push(og.range(n,s)),a.length>e.maxMatches))return Ii.none}}return Ii.set(a)}},{decorations:t=>t.decorations});Yr.baseTheme({".cm-selectionMatch":{backgroundColor:"#99ff7780"},".cm-searchMatch .cm-selectionMatch":{backgroundColor:"transparent"}});Xt.define({combine:t=>we(t,{highlightActiveBlock:!0,hideFirstIndent:!1,markerType:"fullScope",thickness:1})});_a.define({name:qc.name,parser:qc.parser,languageData:{commentTokens:{block:{open:"/*",close:"*/"}},indentOnInput:/^\s*\}$/,wordChars:""}});

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
class BalancedJSONTokenizer {
    callback;
    index;
    balance;
    buffer;
    findMultiple;
    closingDoubleQuoteRegex;
    lastBalancedIndex;
    constructor(callback, findMultiple) {
        this.callback = callback;
        this.index = 0;
        this.balance = 0;
        this.buffer = '';
        this.findMultiple = findMultiple || false;
        this.closingDoubleQuoteRegex = /[^\\](?:\\\\)*"/g;
    }
    write(chunk) {
        this.buffer += chunk;
        const lastIndex = this.buffer.length;
        const buffer = this.buffer;
        let index;
        for (index = this.index; index < lastIndex; ++index) {
            const character = buffer[index];
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
    }
    reportBalanced() {
        if (!this.lastBalancedIndex) {
            return;
        }
        this.callback(this.buffer.slice(0, this.lastBalancedIndex));
        this.buffer = this.buffer.slice(this.lastBalancedIndex);
        this.index -= this.lastBalancedIndex;
        this.lastBalancedIndex = 0;
    }
    remainder() {
        return this.buffer;
    }
}

// Copyright 2020 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
const BASE64_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
const BASE64_CODES = new Uint8Array(123);
for (let index = 0; index < BASE64_CHARS.length; ++index) {
    BASE64_CODES[BASE64_CHARS.charCodeAt(index)] = index;
}

// Copyright 2022 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
/**
 * Implementation of this module and all the tests are heavily influenced by
 * https://source.chromium.org/chromium/chromium/src/+/main:ui/gfx/color_conversions.cc
 */
// https://en.wikipedia.org/wiki/CIELAB_color_space#Converting_between_CIELAB_and_CIEXYZ_coordinates
const D50_X = 0.9642;
const D50_Y = 1.0;
const D50_Z = 0.8251;
class Vector3 {
    values = [0, 0, 0];
    constructor(values) {
        if (values) {
            this.values = values;
        }
    }
}
class Matrix3x3 {
    values = [
        [0, 0, 0],
        [0, 0, 0],
        [0, 0, 0],
    ];
    constructor(values) {
        if (values) {
            this.values = values;
        }
    }
    multiply(other) {
        const dst = new Vector3();
        for (let row = 0; row < 3; ++row) {
            dst.values[row] = this.values[row][0] * other.values[0] + this.values[row][1] * other.values[1] +
                this.values[row][2] * other.values[2];
        }
        return dst;
    }
}
// A transfer function mapping encoded values to linear values,
// represented by this 7-parameter piecewise function:
//
//   linear = sign(encoded) *  (c*|encoded| + f)       , 0 <= |encoded| < d
//          = sign(encoded) * ((a*|encoded| + b)^g + e), d <= |encoded|
//
// (A simple gamma transfer function sets g to gamma and a to 1.)
class TransferFunction {
    g;
    a;
    b;
    c;
    d;
    e;
    f;
    constructor(g, a, b = 0, c = 0, d = 0, e = 0, f = 0) {
        this.g = g;
        this.a = a;
        this.b = b;
        this.c = c;
        this.d = d;
        this.e = e;
        this.f = f;
    }
    eval(val) {
        const sign = val < 0 ? -1.0 : 1.0;
        const abs = val * sign;
        // 0 <= |encoded| < d path
        if (abs < this.d) {
            return sign * (this.c * abs + this.f);
        }
        // d <= |encoded| path
        return sign * (Math.pow(this.a * abs + this.b, this.g) + this.e);
    }
}
const NAMED_TRANSFER_FN = {
    sRGB: new TransferFunction(2.4, (1 / 1.055), (0.055 / 1.055), (1 / 12.92), 0.04045, 0.0, 0.0),
    sRGB_INVERSE: new TransferFunction(0.416667, 1.13728, -0, 12.92, 0.0031308, -0.0549698, -0),
    proPhotoRGB: new TransferFunction(1.8, 1),
    proPhotoRGB_INVERSE: new TransferFunction(0.555556, 1, -0, 0, 0, 0, 0),
    k2Dot2: new TransferFunction(2.2, 1.0),
    k2Dot2_INVERSE: new TransferFunction(0.454545, 1),
    rec2020: new TransferFunction(2.22222, 0.909672, 0.0903276, 0.222222, 0.0812429, 0, 0),
    rec2020_INVERSE: new TransferFunction(0.45, 1.23439, -0, 4.5, 0.018054, -0.0993195, -0),
};
const NAMED_GAMUTS = {
    sRGB: new Matrix3x3([
        [0.436065674, 0.385147095, 0.143066406],
        [0.222488403, 0.716873169, 0.060607910],
        [0.013916016, 0.097076416, 0.714096069],
    ]),
    sRGB_INVERSE: new Matrix3x3([
        [3.134112151374599, -1.6173924597114966, -0.4906334036481285],
        [-0.9787872938826594, 1.9162795854799963, 0.0334547139520088],
        [0.07198304248352326, -0.2289858493321844, 1.4053851325241447],
    ]),
    displayP3: new Matrix3x3([
        [0.515102, 0.291965, 0.157153],
        [0.241182, 0.692236, 0.0665819],
        [-0.00104941, 0.0418818, 0.784378],
    ]),
    displayP3_INVERSE: new Matrix3x3([
        [2.404045155982687, -0.9898986932663839, -0.3976317191366333],
        [-0.8422283799266768, 1.7988505115115485, 0.016048170293157416],
        [0.04818705979712955, -0.09737385156228891, 1.2735066448052303],
    ]),
    adobeRGB: new Matrix3x3([
        [0.60974, 0.20528, 0.14919],
        [0.31111, 0.62567, 0.06322],
        [0.01947, 0.06087, 0.74457],
    ]),
    adobeRGB_INVERSE: new Matrix3x3([
        [1.9625385510109137, -0.6106892546501431, -0.3413827467482388],
        [-0.9787580455521, 1.9161624707082339, 0.03341676594241408],
        [0.028696263137883395, -0.1406807819331586, 1.349252109991369],
    ]),
    rec2020: new Matrix3x3([
        [0.673459, 0.165661, 0.125100],
        [0.279033, 0.675338, 0.0456288],
        [-0.00193139, 0.0299794, 0.797162],
    ]),
    rec2020_INVERSE: new Matrix3x3([
        [1.647275201661012, -0.3936024771460771, -0.23598028884792507],
        [-0.6826176165196962, 1.647617775014935, 0.01281626807852422],
        [0.029662725298529837, -0.06291668721366285, 1.2533964313435522],
    ]),
    xyz: new Matrix3x3([
        [1.0, 0.0, 0.0],
        [0.0, 1.0, 0.0],
        [0.0, 0.0, 1.0],
    ]),
};
function degToRad(deg) {
    return deg * (Math.PI / 180);
}
function radToDeg(rad) {
    return rad * (180 / Math.PI);
}
function applyTransferFns(fn, r, g, b) {
    return [fn.eval(r), fn.eval(g), fn.eval(b)];
}
const OKLAB_TO_LMS_MATRIX = new Matrix3x3([
    [0.99999999845051981432, 0.39633779217376785678, 0.21580375806075880339],
    [1.0000000088817607767, -0.1055613423236563494, -0.063854174771705903402],
    [1.0000000546724109177, -0.089484182094965759684, -1.2914855378640917399],
]);
// Inverse of the OKLAB_TO_LMS_MATRIX
const LMS_TO_OKLAB_MATRIX = new Matrix3x3([
    [0.2104542553, 0.7936177849999999, -0.0040720468],
    [1.9779984951000003, -2.4285922049999997, 0.4505937099000001],
    [0.025904037099999982, 0.7827717662, -0.8086757660000001],
]);
const XYZ_TO_LMS_MATRIX = new Matrix3x3([
    [0.8190224432164319, 0.3619062562801221, -0.12887378261216414],
    [0.0329836671980271, 0.9292868468965546, 0.03614466816999844],
    [0.048177199566046255, 0.26423952494422764, 0.6335478258136937],
]);
// Inverse of XYZ_TO_LMS_MATRIX
const LMS_TO_XYZ_MATRIX = new Matrix3x3([
    [1.226879873374156, -0.5578149965554814, 0.2813910501772159],
    [-0.040575762624313734, 1.1122868293970596, -0.07171106666151703],
    [-0.07637294974672144, -0.4214933239627915, 1.586924024427242],
]);
const PRO_PHOTO_TO_XYZD50_MATRIX = new Matrix3x3([
    [0.7976700747153241, 0.13519395152800417, 0.03135596341127167],
    [0.28803902352472205, 0.7118744007923554, 0.00008661179538844252],
    [2.739876695467402e-7, -0.0000014405226518969991, 0.825211112593861],
]);
// Inverse of PRO_PHOTO_TO_XYZD50_MATRIX
const XYZD50_TO_PRO_PHOTO_MATRIX = new Matrix3x3([
    [1.3459533710138858, -0.25561367037652133, -0.051116041522131374],
    [-0.544600415668951, 1.5081687311475767, 0.020535163968720935],
    [-0.0000013975622054109725, 0.000002717590904589903, 1.2118111696814942],
]);
const XYZD65_TO_XYZD50_MATRIX = new Matrix3x3([
    [1.0478573189120088, 0.022907374491829943, -0.050162247377152525],
    [0.029570500050499514, 0.9904755577034089, -0.017061518194840468],
    [-0.00924047197558879, 0.015052921526981566, 0.7519708530777581],
]);
// Inverse of XYZD65_TO_XYZD50_MATRIX
const XYZD50_TO_XYZD65_MATRIX = new Matrix3x3([
    [0.9555366447632887, -0.02306009252137888, 0.06321844147263304],
    [-0.028315378228764922, 1.009951351591575, 0.021026001591792402],
    [0.012308773293784308, -0.02050053471777469, 1.3301947294775631],
]);
const XYZD65_TO_SRGB_MATRIX = new Matrix3x3([
    [3.2408089365140573, -1.5375788839307314, -0.4985609572551541],
    [-0.9692732213205414, 1.876110235238969, 0.041560501141251774],
    [0.05567030990267439, -0.2040007921971802, 1.0571046720577026],
]);
class ColorConverter {
    static labToXyzd50(l, a, b) {
        let y = (l + 16.0) / 116.0;
        let x = y + a / 500.0;
        let z = y - b / 200.0;
        function labInverseTransferFunction(t) {
            const delta = (24.0 / 116.0);
            if (t <= delta) {
                return (108.0 / 841.0) * (t - (16.0 / 116.0));
            }
            return t * t * t;
        }
        x = labInverseTransferFunction(x) * D50_X;
        y = labInverseTransferFunction(y) * D50_Y;
        z = labInverseTransferFunction(z) * D50_Z;
        return [x, y, z];
    }
    static xyzd50ToLab(x, y, z) {
        function labTransferFunction(t) {
            const deltaLimit = (24.0 / 116.0) * (24.0 / 116.0) * (24.0 / 116.0);
            if (t <= deltaLimit) {
                return (841.0 / 108.0) * t + (16.0 / 116.0);
            }
            return Math.pow(t, 1.0 / 3.0);
        }
        x = labTransferFunction(x / D50_X);
        y = labTransferFunction(y / D50_Y);
        z = labTransferFunction(z / D50_Z);
        const l = 116.0 * y - 16.0;
        const a = 500.0 * (x - y);
        const b = 200.0 * (y - z);
        return [l, a, b];
    }
    static oklabToXyzd65(l, a, b) {
        const labInput = new Vector3([l, a, b]);
        const lmsIntermediate = OKLAB_TO_LMS_MATRIX.multiply(labInput);
        lmsIntermediate.values[0] = lmsIntermediate.values[0] * lmsIntermediate.values[0] * lmsIntermediate.values[0];
        lmsIntermediate.values[1] = lmsIntermediate.values[1] * lmsIntermediate.values[1] * lmsIntermediate.values[1];
        lmsIntermediate.values[2] = lmsIntermediate.values[2] * lmsIntermediate.values[2] * lmsIntermediate.values[2];
        const xyzOutput = LMS_TO_XYZ_MATRIX.multiply(lmsIntermediate);
        return xyzOutput.values;
    }
    static xyzd65ToOklab(x, y, z) {
        const xyzInput = new Vector3([x, y, z]);
        const lmsIntermediate = XYZ_TO_LMS_MATRIX.multiply(xyzInput);
        lmsIntermediate.values[0] = Math.pow(lmsIntermediate.values[0], 1.0 / 3.0);
        lmsIntermediate.values[1] = Math.pow(lmsIntermediate.values[1], 1.0 / 3.0);
        lmsIntermediate.values[2] = Math.pow(lmsIntermediate.values[2], 1.0 / 3.0);
        const labOutput = LMS_TO_OKLAB_MATRIX.multiply(lmsIntermediate);
        return [labOutput.values[0], labOutput.values[1], labOutput.values[2]];
    }
    static lchToLab(l, c, h) {
        if (h === undefined) {
            return [l, 0, 0];
        }
        return [l, c * Math.cos(degToRad(h)), c * Math.sin(degToRad(h))];
    }
    static labToLch(l, a, b) {
        return [l, Math.sqrt(a * a + b * b), radToDeg(Math.atan2(b, a))];
    }
    static displayP3ToXyzd50(r, g, b) {
        const [mappedR, mappedG, mappedB] = applyTransferFns(NAMED_TRANSFER_FN.sRGB, r, g, b);
        const rgbInput = new Vector3([mappedR, mappedG, mappedB]);
        const xyzOutput = NAMED_GAMUTS.displayP3.multiply(rgbInput);
        return xyzOutput.values;
    }
    static xyzd50ToDisplayP3(x, y, z) {
        const xyzInput = new Vector3([x, y, z]);
        const rgbOutput = NAMED_GAMUTS.displayP3_INVERSE.multiply(xyzInput);
        return applyTransferFns(NAMED_TRANSFER_FN.sRGB_INVERSE, rgbOutput.values[0], rgbOutput.values[1], rgbOutput.values[2]);
    }
    static proPhotoToXyzd50(r, g, b) {
        const [mappedR, mappedG, mappedB] = applyTransferFns(NAMED_TRANSFER_FN.proPhotoRGB, r, g, b);
        const rgbInput = new Vector3([mappedR, mappedG, mappedB]);
        const xyzOutput = PRO_PHOTO_TO_XYZD50_MATRIX.multiply(rgbInput);
        return xyzOutput.values;
    }
    static xyzd50ToProPhoto(x, y, z) {
        const xyzInput = new Vector3([x, y, z]);
        const rgbOutput = XYZD50_TO_PRO_PHOTO_MATRIX.multiply(xyzInput);
        return applyTransferFns(NAMED_TRANSFER_FN.proPhotoRGB_INVERSE, rgbOutput.values[0], rgbOutput.values[1], rgbOutput.values[2]);
    }
    static adobeRGBToXyzd50(r, g, b) {
        const [mappedR, mappedG, mappedB] = applyTransferFns(NAMED_TRANSFER_FN.k2Dot2, r, g, b);
        const rgbInput = new Vector3([mappedR, mappedG, mappedB]);
        const xyzOutput = NAMED_GAMUTS.adobeRGB.multiply(rgbInput);
        return xyzOutput.values;
    }
    static xyzd50ToAdobeRGB(x, y, z) {
        const xyzInput = new Vector3([x, y, z]);
        const rgbOutput = NAMED_GAMUTS.adobeRGB_INVERSE.multiply(xyzInput);
        return applyTransferFns(NAMED_TRANSFER_FN.k2Dot2_INVERSE, rgbOutput.values[0], rgbOutput.values[1], rgbOutput.values[2]);
    }
    static rec2020ToXyzd50(r, g, b) {
        const [mappedR, mappedG, mappedB] = applyTransferFns(NAMED_TRANSFER_FN.rec2020, r, g, b);
        const rgbInput = new Vector3([mappedR, mappedG, mappedB]);
        const xyzOutput = NAMED_GAMUTS.rec2020.multiply(rgbInput);
        return xyzOutput.values;
    }
    static xyzd50ToRec2020(x, y, z) {
        const xyzInput = new Vector3([x, y, z]);
        const rgbOutput = NAMED_GAMUTS.rec2020_INVERSE.multiply(xyzInput);
        return applyTransferFns(NAMED_TRANSFER_FN.rec2020_INVERSE, rgbOutput.values[0], rgbOutput.values[1], rgbOutput.values[2]);
    }
    static xyzd50ToD65(x, y, z) {
        const xyzInput = new Vector3([x, y, z]);
        const xyzOutput = XYZD50_TO_XYZD65_MATRIX.multiply(xyzInput);
        return xyzOutput.values;
    }
    static xyzd65ToD50(x, y, z) {
        const xyzInput = new Vector3([x, y, z]);
        const xyzOutput = XYZD65_TO_XYZD50_MATRIX.multiply(xyzInput);
        return xyzOutput.values;
    }
    static xyzd65TosRGBLinear(x, y, z) {
        const xyzInput = new Vector3([x, y, z]);
        const rgbResult = XYZD65_TO_SRGB_MATRIX.multiply(xyzInput);
        return rgbResult.values;
    }
    static xyzd50TosRGBLinear(x, y, z) {
        const xyzInput = new Vector3([x, y, z]);
        const rgbResult = NAMED_GAMUTS.sRGB_INVERSE.multiply(xyzInput);
        return rgbResult.values;
    }
    static srgbLinearToXyzd50(r, g, b) {
        const rgbInput = new Vector3([r, g, b]);
        const xyzOutput = NAMED_GAMUTS.sRGB.multiply(rgbInput);
        return xyzOutput.values;
    }
    static srgbToXyzd50(r, g, b) {
        const [mappedR, mappedG, mappedB] = applyTransferFns(NAMED_TRANSFER_FN.sRGB, r, g, b);
        const rgbInput = new Vector3([mappedR, mappedG, mappedB]);
        const xyzOutput = NAMED_GAMUTS.sRGB.multiply(rgbInput);
        return xyzOutput.values;
    }
    static xyzd50ToSrgb(x, y, z) {
        const xyzInput = new Vector3([x, y, z]);
        const rgbOutput = NAMED_GAMUTS.sRGB_INVERSE.multiply(xyzInput);
        return applyTransferFns(NAMED_TRANSFER_FN.sRGB_INVERSE, rgbOutput.values[0], rgbOutput.values[1], rgbOutput.values[2]);
    }
    static oklchToXyzd50(lInput, c, h) {
        const [l, a, b] = ColorConverter.lchToLab(lInput, c, h);
        const [x65, y65, z65] = ColorConverter.oklabToXyzd65(l, a, b);
        return ColorConverter.xyzd65ToD50(x65, y65, z65);
    }
    static xyzd50ToOklch(x, y, z) {
        const [x65, y65, z65] = ColorConverter.xyzd50ToD65(x, y, z);
        const [l, a, b] = ColorConverter.xyzd65ToOklab(x65, y65, z65);
        return ColorConverter.labToLch(l, a, b);
    }
}

// Copyright 2020 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
function blendColors(fgRGBA, bgRGBA) {
    const alpha = fgRGBA[3];
    return [
        ((1 - alpha) * bgRGBA[0]) + (alpha * fgRGBA[0]),
        ((1 - alpha) * bgRGBA[1]) + (alpha * fgRGBA[1]),
        ((1 - alpha) * bgRGBA[2]) + (alpha * fgRGBA[2]),
        alpha + (bgRGBA[3] * (1 - alpha)),
    ];
}
function rgbToHue([r, g, b]) {
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    const diff = max - min;
    let h;
    if (min === max) {
        h = 0;
    }
    else if (r === max) {
        h = ((1 / 6 * (g - b) / diff) + 1) % 1;
    }
    else if (g === max) {
        h = (1 / 6 * (b - r) / diff) + 1 / 3;
    }
    else {
        h = (1 / 6 * (r - g) / diff) + 2 / 3;
    }
    return h;
}
function rgbToHsl(rgb) {
    const [h, s, l] = rgbaToHsla([...rgb, undefined]);
    return [h, s, l];
}
function rgbaToHsla([r, g, b, a]) {
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    const diff = max - min;
    const sum = max + min;
    const h = rgbToHue([r, g, b]);
    const l = 0.5 * sum;
    let s;
    if (l === 0) {
        s = 0;
    }
    else if (l === 1) {
        s = 0;
    }
    else if (l <= 0.5) {
        s = diff / sum;
    }
    else {
        s = diff / (2 - sum);
    }
    return [h, s, l, a];
}
function rgbToHwb(rgb) {
    const [h, w, b] = rgbaToHwba([...rgb, undefined]);
    return [h, w, b];
}
function rgbaToHwba([r, g, b, a]) {
    const h = rgbToHue([r, g, b]);
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    return [h, min, 1 - max, a];
}

// Copyright 2021 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
/*
 * Copyright (C) 2009 Apple Inc.  All rights reserved.
 * Copyright (C) 2009 Joseph Pecoraro
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions
 * are met:
 *
 * 1.  Redistributions of source code must retain the above copyright
 *     notice, this list of conditions and the following disclaimer.
 * 2.  Redistributions in binary form must reproduce the above copyright
 *     notice, this list of conditions and the following disclaimer in the
 *     documentation and/or other materials provided with the distribution.
 * 3.  Neither the name of Apple Computer, Inc. ("Apple") nor the names of
 *     its contributors may be used to endorse or promote products derived
 *     from this software without specific prior written permission.
 *
 * THIS SOFTWARE IS PROVIDED BY APPLE AND ITS CONTRIBUTORS "AS IS" AND ANY
 * EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
 * WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
 * DISCLAIMED. IN NO EVENT SHALL APPLE OR ITS CONTRIBUTORS BE LIABLE FOR ANY
 * DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
 * (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
 * LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
 * ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
 * (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF
 * THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */
// <hue> is defined as a <number> or <angle>
// and we hold this in degrees. However, after
// the conversions, these degrees can result in
// negative values. That's why we normalize the hue to be
// between [0 - 360].
function normalizeHue(hue) {
    // Even though it is highly unlikely, hue can be
    // very negative like -400. The initial modulo
    // operation makes sure that the if the number is
    // negative, it is between [-360, 0].
    return ((hue % 360) + 360) % 360;
}
// Parses angle in the form of
// `<angle>deg`, `<angle>turn`, `<angle>grad and `<angle>rad`
// and returns the canonicalized `degree`.
function parseAngle(angleText) {
    const angle = angleText.replace(/(deg|g?rad|turn)$/, '');
    // @ts-ignore: isNaN can accept strings
    if (isNaN(angle) || angleText.match(/\s+(deg|g?rad|turn)/)) {
        return null;
    }
    const number = parseFloat(angle);
    if (angleText.includes('turn')) {
        // 1turn === 360deg
        return number * 360;
    }
    if (angleText.includes('grad')) {
        // 1grad === 0.9deg
        return number * 9 / 10;
    }
    if (angleText.includes('rad')) {
        // πrad === 180deg
        return number * 180 / Math.PI;
    }
    // 1deg === 1deg ^_^
    return number;
}
function getColorSpace(colorSpaceText) {
    switch (colorSpaceText) {
        case "srgb" /* Format.SRGB */:
            return "srgb" /* Format.SRGB */;
        case "srgb-linear" /* Format.SRGB_LINEAR */:
            return "srgb-linear" /* Format.SRGB_LINEAR */;
        case "display-p3" /* Format.DISPLAY_P3 */:
            return "display-p3" /* Format.DISPLAY_P3 */;
        case "a98-rgb" /* Format.A98_RGB */:
            return "a98-rgb" /* Format.A98_RGB */;
        case "prophoto-rgb" /* Format.PROPHOTO_RGB */:
            return "prophoto-rgb" /* Format.PROPHOTO_RGB */;
        case "rec2020" /* Format.REC_2020 */:
            return "rec2020" /* Format.REC_2020 */;
        case "xyz" /* Format.XYZ */:
            return "xyz" /* Format.XYZ */;
        case "xyz-d50" /* Format.XYZ_D50 */:
            return "xyz-d50" /* Format.XYZ_D50 */;
        case "xyz-d65" /* Format.XYZ_D65 */:
            return "xyz-d65" /* Format.XYZ_D65 */;
    }
    return null;
}
/**
 * Percents in color spaces are mapped to ranges.
 * These ranges change based on the syntax.
 * For example, for 'C' in lch() c: 0% = 0, 100% = 150.
 * See: https://www.w3.org/TR/css-color-4/#funcdef-lch
 * Some percentage values can be negative
 * though their ranges don't change depending on the sign
 * (for now, according to spec).
 * @param percent % value of the number. 42 for 42%.
 * @param range Range of [min, max]. Including `min` and `max`.
 */
function mapPercentToRange(percent, range) {
    const sign = Math.sign(percent);
    const absPercent = Math.abs(percent);
    const [outMin, outMax] = range;
    return sign * (absPercent * (outMax - outMin) / 100 + outMin);
}
function clamp(value, { min, max }) {
    if (value === null) {
        return value;
    }
    if (min !== undefined) {
        value = Math.max(value, min);
    }
    if (max !== undefined) {
        value = Math.min(value, max);
    }
    return value;
}
function parsePercentage(value, range) {
    if (!value.endsWith('%')) {
        return null;
    }
    const percentage = parseFloat(value.substr(0, value.length - 1));
    return isNaN(percentage) ? null : mapPercentToRange(percentage, range);
}
function parseNumber(value) {
    const number = parseFloat(value);
    return isNaN(number) ? null : number;
}
function parseAlpha(value) {
    if (value === undefined) {
        return null;
    }
    return clamp(parsePercentage(value, [0, 1]) ?? parseNumber(value), { min: 0, max: 1 });
}
/**
 *
 * @param value Text value to be parsed in the form of 'number|percentage'.
 * @param range Range to map the percentage.
 * @returns If it is not percentage, returns number directly; otherwise,
 * maps the percentage to the range. For example:
 * - 30% in range [0, 100] is 30
 * - 20% in range [0, 1] is 0.5
 */
function parsePercentOrNumber(value, range = [0, 1]) {
    // @ts-ignore: isNaN can accept strings
    if (isNaN(value.replace('%', ''))) {
        return null;
    }
    const parsed = parseFloat(value);
    if (value.indexOf('%') !== -1) {
        if (value.indexOf('%') !== value.length - 1) {
            return null;
        }
        return mapPercentToRange(parsed, range);
    }
    return parsed;
}
function parseRgbNumeric(value) {
    const parsed = parsePercentOrNumber(value);
    if (parsed === null) {
        return null;
    }
    if (value.indexOf('%') !== -1) {
        return parsed;
    }
    return parsed / 255;
}
function parseHueNumeric(value) {
    const angle = value.replace(/(deg|g?rad|turn)$/, '');
    // @ts-ignore: isNaN can accept strings
    if (isNaN(angle) || value.match(/\s+(deg|g?rad|turn)/)) {
        return null;
    }
    const number = parseFloat(angle);
    if (value.indexOf('turn') !== -1) {
        return number % 1;
    }
    if (value.indexOf('grad') !== -1) {
        return (number / 400) % 1;
    }
    if (value.indexOf('rad') !== -1) {
        return (number / (2 * Math.PI)) % 1;
    }
    return (number / 360) % 1;
}
function parseSatLightNumeric(value) {
    // @ts-ignore: isNaN can accept strings
    if (value.indexOf('%') !== value.length - 1 || isNaN(value.replace('%', ''))) {
        return null;
    }
    const parsed = parseFloat(value);
    return parsed / 100;
}
function parseAlphaNumeric(value) {
    return parsePercentOrNumber(value);
}
function hsva2hsla(hsva) {
    const h = hsva[0];
    let s = hsva[1];
    const v = hsva[2];
    const t = (2 - s) * v;
    if (v === 0 || s === 0) {
        s = 0;
    }
    else {
        s *= v / (t < 1 ? t : 2 - t);
    }
    return [h, s, t / 2, hsva[3]];
}
function hsl2rgb(hsl) {
    const h = hsl[0];
    let s = hsl[1];
    const l = hsl[2];
    function hue2rgb(p, q, h) {
        if (h < 0) {
            h += 1;
        }
        else if (h > 1) {
            h -= 1;
        }
        if ((h * 6) < 1) {
            return p + (q - p) * h * 6;
        }
        if ((h * 2) < 1) {
            return q;
        }
        if ((h * 3) < 2) {
            return p + (q - p) * ((2 / 3) - h) * 6;
        }
        return p;
    }
    if (s < 0) {
        s = 0;
    }
    let q;
    if (l <= 0.5) {
        q = l * (1 + s);
    }
    else {
        q = l + s - (l * s);
    }
    const p = 2 * l - q;
    const tr = h + (1 / 3);
    const tg = h;
    const tb = h - (1 / 3);
    return [hue2rgb(p, q, tr), hue2rgb(p, q, tg), hue2rgb(p, q, tb), hsl[3]];
}
function hwb2rgb(hwb) {
    const h = hwb[0];
    const w = hwb[1];
    const b = hwb[2];
    const whiteRatio = w / (w + b);
    let result = [whiteRatio, whiteRatio, whiteRatio, hwb[3]];
    if (w + b < 1) {
        result = hsl2rgb([h, 1, 0.5, hwb[3]]);
        for (let i = 0; i < 3; ++i) {
            result[i] += w - (w + b) * result[i];
        }
    }
    return result;
}
function hsva2rgba(hsva) {
    return hsl2rgb(hsva2hsla(hsva));
}
const EPSILON = 0.01;
const WIDE_RANGE_EPSILON = 1; // For comparisons on channels with a wider range than [0,1]
function equals(a, b, accuracy = EPSILON) {
    if (Array.isArray(a) && Array.isArray(b)) {
        if (a.length !== b.length) {
            return false;
        }
        for (const i in a) {
            if (!equals(a[i], b[i])) {
                return false;
            }
        }
        return true;
    }
    if (Array.isArray(a) || Array.isArray(b)) {
        return false;
    }
    if (a === null || b === null) {
        return a === b;
    }
    return Math.abs(a - b) < accuracy;
}
function lessOrEquals(a, b, accuracy = EPSILON) {
    return a - b <= accuracy;
}
class Lab {
    l;
    a;
    b;
    alpha;
    #authoredText;
    #rawParams;
    static #conversions = {
        ["nickname" /* Format.Nickname */]: (self) => new Legacy(self.#getRGBArray(/* withAlpha= */ false), "nickname" /* Format.Nickname */),
        ["hex" /* Format.HEX */]: (self) => new Legacy(self.#getRGBArray(/* withAlpha= */ false), "hex" /* Format.HEX */),
        ["shorthex" /* Format.ShortHEX */]: (self) => new Legacy(self.#getRGBArray(/* withAlpha= */ false), "shorthex" /* Format.ShortHEX */),
        ["hexa" /* Format.HEXA */]: (self) => new Legacy(self.#getRGBArray(/* withAlpha= */ true), "hexa" /* Format.HEXA */),
        ["shorthexa" /* Format.ShortHEXA */]: (self) => new Legacy(self.#getRGBArray(/* withAlpha= */ true), "shorthexa" /* Format.ShortHEXA */),
        ["rgb" /* Format.RGB */]: (self) => new Legacy(self.#getRGBArray(/* withAlpha= */ false), "rgb" /* Format.RGB */),
        ["rgba" /* Format.RGBA */]: (self) => new Legacy(self.#getRGBArray(/* withAlpha= */ true), "rgba" /* Format.RGBA */),
        ["hsl" /* Format.HSL */]: (self) => new HSL(...rgbToHsl(self.#getRGBArray(/* withAlpha= */ false)), self.alpha),
        ["hsla" /* Format.HSLA */]: (self) => new HSL(...rgbToHsl(self.#getRGBArray(/* withAlpha= */ false)), self.alpha),
        ["hwb" /* Format.HWB */]: (self) => new HWB(...rgbToHwb(self.#getRGBArray(/* withAlpha= */ false)), self.alpha),
        ["hwba" /* Format.HWBA */]: (self) => new HWB(...rgbToHwb(self.#getRGBArray(/* withAlpha= */ false)), self.alpha),
        ["lch" /* Format.LCH */]: (self) => new LCH(...ColorConverter.labToLch(self.l, self.a, self.b), self.alpha),
        ["oklch" /* Format.OKLCH */]: (self) => new Oklch(...ColorConverter.xyzd50ToOklch(...self.#toXyzd50()), self.alpha),
        ["lab" /* Format.LAB */]: (self) => self,
        ["oklab" /* Format.OKLAB */]: (self) => new Oklab(...ColorConverter.xyzd65ToOklab(...ColorConverter.xyzd50ToD65(...self.#toXyzd50())), self.alpha),
        ["srgb" /* Format.SRGB */]: (self) => new ColorFunction("srgb" /* Format.SRGB */, ...ColorConverter.xyzd50ToSrgb(...self.#toXyzd50()), self.alpha),
        ["srgb-linear" /* Format.SRGB_LINEAR */]: (self) => new ColorFunction("srgb-linear" /* Format.SRGB_LINEAR */, ...ColorConverter.xyzd50TosRGBLinear(...self.#toXyzd50()), self.alpha),
        ["display-p3" /* Format.DISPLAY_P3 */]: (self) => new ColorFunction("display-p3" /* Format.DISPLAY_P3 */, ...ColorConverter.xyzd50ToDisplayP3(...self.#toXyzd50()), self.alpha),
        ["a98-rgb" /* Format.A98_RGB */]: (self) => new ColorFunction("a98-rgb" /* Format.A98_RGB */, ...ColorConverter.xyzd50ToAdobeRGB(...self.#toXyzd50()), self.alpha),
        ["prophoto-rgb" /* Format.PROPHOTO_RGB */]: (self) => new ColorFunction("prophoto-rgb" /* Format.PROPHOTO_RGB */, ...ColorConverter.xyzd50ToProPhoto(...self.#toXyzd50()), self.alpha),
        ["rec2020" /* Format.REC_2020 */]: (self) => new ColorFunction("rec2020" /* Format.REC_2020 */, ...ColorConverter.xyzd50ToRec2020(...self.#toXyzd50()), self.alpha),
        ["xyz" /* Format.XYZ */]: (self) => new ColorFunction("xyz" /* Format.XYZ */, ...ColorConverter.xyzd50ToD65(...self.#toXyzd50()), self.alpha),
        ["xyz-d50" /* Format.XYZ_D50 */]: (self) => new ColorFunction("xyz-d50" /* Format.XYZ_D50 */, ...self.#toXyzd50(), self.alpha),
        ["xyz-d65" /* Format.XYZ_D65 */]: (self) => new ColorFunction("xyz-d65" /* Format.XYZ_D65 */, ...ColorConverter.xyzd50ToD65(...self.#toXyzd50()), self.alpha),
    };
    #toXyzd50() {
        return ColorConverter.labToXyzd50(this.l, this.a, this.b);
    }
    #getRGBArray(withAlpha = true) {
        const params = ColorConverter.xyzd50ToSrgb(...this.#toXyzd50());
        if (withAlpha) {
            return [...params, this.alpha ?? undefined];
        }
        return params;
    }
    constructor(l, a, b, alpha, authoredText) {
        this.#rawParams = [l, a, b];
        this.l = clamp(l, { min: 0, max: 100 });
        if (equals(this.l, 0, WIDE_RANGE_EPSILON) || equals(this.l, 100, WIDE_RANGE_EPSILON)) {
            a = b = 0;
        }
        this.a = a;
        this.b = b;
        this.alpha = clamp(alpha, { min: 0, max: 1 });
        this.#authoredText = authoredText;
    }
    is(format) {
        return format === this.format();
    }
    as(format) {
        return Lab.#conversions[format](this);
    }
    asLegacyColor() {
        return this.as("rgba" /* Format.RGBA */);
    }
    equal(color) {
        const lab = color.as("lab" /* Format.LAB */);
        return equals(lab.l, this.l, WIDE_RANGE_EPSILON) && equals(lab.a, this.a) && equals(lab.b, this.b) &&
            equals(lab.alpha, this.alpha);
    }
    format() {
        return "lab" /* Format.LAB */;
    }
    setAlpha(alpha) {
        return new Lab(this.l, this.a, this.b, alpha, undefined);
    }
    asString(format) {
        if (format) {
            return this.as(format).asString();
        }
        return this.#stringify(this.l, this.a, this.b);
    }
    #stringify(l, a, b) {
        const alpha = this.alpha === null || equals(this.alpha, 1) ?
            '' :
            ` / ${stringifyWithPrecision(this.alpha)}`;
        return `lab(${stringifyWithPrecision(l, 0)} ${stringifyWithPrecision(a)} ${stringifyWithPrecision(b)}${alpha})`;
    }
    getAuthoredText() {
        return this.#authoredText ?? null;
    }
    getRawParameters() {
        return [...this.#rawParams];
    }
    getAsRawString(format) {
        if (format) {
            return this.as(format).getAsRawString();
        }
        return this.#stringify(...this.#rawParams);
    }
    isGamutClipped() {
        return false;
    }
    static fromSpec(spec, text) {
        const L = parsePercentage(spec[0], [0, 100]) ?? parseNumber(spec[0]);
        if (L === null) {
            return null;
        }
        const a = parsePercentage(spec[1], [0, 125]) ?? parseNumber(spec[1]);
        if (a === null) {
            return null;
        }
        const b = parsePercentage(spec[2], [0, 125]) ?? parseNumber(spec[2]);
        if (b === null) {
            return null;
        }
        const alpha = parseAlpha(spec[3]);
        return new Lab(L, a, b, alpha, text);
    }
}
class LCH {
    #rawParams;
    l;
    c;
    h;
    alpha;
    #authoredText;
    static #conversions = {
        ["nickname" /* Format.Nickname */]: (self) => new Legacy(self.#getRGBArray(/* withAlpha= */ false), "nickname" /* Format.Nickname */),
        ["hex" /* Format.HEX */]: (self) => new Legacy(self.#getRGBArray(/* withAlpha= */ false), "hex" /* Format.HEX */),
        ["shorthex" /* Format.ShortHEX */]: (self) => new Legacy(self.#getRGBArray(/* withAlpha= */ false), "shorthex" /* Format.ShortHEX */),
        ["hexa" /* Format.HEXA */]: (self) => new Legacy(self.#getRGBArray(/* withAlpha= */ true), "hexa" /* Format.HEXA */),
        ["shorthexa" /* Format.ShortHEXA */]: (self) => new Legacy(self.#getRGBArray(/* withAlpha= */ true), "shorthexa" /* Format.ShortHEXA */),
        ["rgb" /* Format.RGB */]: (self) => new Legacy(self.#getRGBArray(/* withAlpha= */ false), "rgb" /* Format.RGB */),
        ["rgba" /* Format.RGBA */]: (self) => new Legacy(self.#getRGBArray(/* withAlpha= */ true), "rgba" /* Format.RGBA */),
        ["hsl" /* Format.HSL */]: (self) => new HSL(...rgbToHsl(self.#getRGBArray(/* withAlpha= */ false)), self.alpha),
        ["hsla" /* Format.HSLA */]: (self) => new HSL(...rgbToHsl(self.#getRGBArray(/* withAlpha= */ false)), self.alpha),
        ["hwb" /* Format.HWB */]: (self) => new HWB(...rgbToHwb(self.#getRGBArray(/* withAlpha= */ false)), self.alpha),
        ["hwba" /* Format.HWBA */]: (self) => new HWB(...rgbToHwb(self.#getRGBArray(/* withAlpha= */ false)), self.alpha),
        ["lch" /* Format.LCH */]: (self) => self,
        ["oklch" /* Format.OKLCH */]: (self) => new Oklch(...ColorConverter.xyzd50ToOklch(...self.#toXyzd50()), self.alpha),
        ["lab" /* Format.LAB */]: (self) => new Lab(...ColorConverter.lchToLab(self.l, self.c, self.h), self.alpha),
        ["oklab" /* Format.OKLAB */]: (self) => new Oklab(...ColorConverter.xyzd65ToOklab(...ColorConverter.xyzd50ToD65(...self.#toXyzd50())), self.alpha),
        ["srgb" /* Format.SRGB */]: (self) => new ColorFunction("srgb" /* Format.SRGB */, ...ColorConverter.xyzd50ToSrgb(...self.#toXyzd50()), self.alpha),
        ["srgb-linear" /* Format.SRGB_LINEAR */]: (self) => new ColorFunction("srgb-linear" /* Format.SRGB_LINEAR */, ...ColorConverter.xyzd50TosRGBLinear(...self.#toXyzd50()), self.alpha),
        ["display-p3" /* Format.DISPLAY_P3 */]: (self) => new ColorFunction("display-p3" /* Format.DISPLAY_P3 */, ...ColorConverter.xyzd50ToDisplayP3(...self.#toXyzd50()), self.alpha),
        ["a98-rgb" /* Format.A98_RGB */]: (self) => new ColorFunction("a98-rgb" /* Format.A98_RGB */, ...ColorConverter.xyzd50ToAdobeRGB(...self.#toXyzd50()), self.alpha),
        ["prophoto-rgb" /* Format.PROPHOTO_RGB */]: (self) => new ColorFunction("prophoto-rgb" /* Format.PROPHOTO_RGB */, ...ColorConverter.xyzd50ToProPhoto(...self.#toXyzd50()), self.alpha),
        ["rec2020" /* Format.REC_2020 */]: (self) => new ColorFunction("rec2020" /* Format.REC_2020 */, ...ColorConverter.xyzd50ToRec2020(...self.#toXyzd50()), self.alpha),
        ["xyz" /* Format.XYZ */]: (self) => new ColorFunction("xyz" /* Format.XYZ */, ...ColorConverter.xyzd50ToD65(...self.#toXyzd50()), self.alpha),
        ["xyz-d50" /* Format.XYZ_D50 */]: (self) => new ColorFunction("xyz-d50" /* Format.XYZ_D50 */, ...self.#toXyzd50(), self.alpha),
        ["xyz-d65" /* Format.XYZ_D65 */]: (self) => new ColorFunction("xyz-d65" /* Format.XYZ_D65 */, ...ColorConverter.xyzd50ToD65(...self.#toXyzd50()), self.alpha),
    };
    #toXyzd50() {
        return ColorConverter.labToXyzd50(...ColorConverter.lchToLab(this.l, this.c, this.h));
    }
    #getRGBArray(withAlpha = true) {
        const params = ColorConverter.xyzd50ToSrgb(...this.#toXyzd50());
        if (withAlpha) {
            return [...params, this.alpha ?? undefined];
        }
        return params;
    }
    constructor(l, c, h, alpha, authoredText) {
        this.#rawParams = [l, c, h];
        this.l = clamp(l, { min: 0, max: 100 });
        c = equals(this.l, 0, WIDE_RANGE_EPSILON) || equals(this.l, 100, WIDE_RANGE_EPSILON) ? 0 : c;
        this.c = clamp(c, { min: 0 });
        h = equals(c, 0) ? 0 : h;
        this.h = normalizeHue(h);
        this.alpha = clamp(alpha, { min: 0, max: 1 });
        this.#authoredText = authoredText;
    }
    asLegacyColor() {
        return this.as("rgba" /* Format.RGBA */);
    }
    is(format) {
        return format === this.format();
    }
    as(format) {
        return LCH.#conversions[format](this);
    }
    equal(color) {
        const lch = color.as("lch" /* Format.LCH */);
        return equals(lch.l, this.l, WIDE_RANGE_EPSILON) && equals(lch.c, this.c) && equals(lch.h, this.h) &&
            equals(lch.alpha, this.alpha);
    }
    format() {
        return "lch" /* Format.LCH */;
    }
    setAlpha(alpha) {
        return new LCH(this.l, this.c, this.h, alpha);
    }
    asString(format) {
        if (format) {
            return this.as(format).asString();
        }
        return this.#stringify(this.l, this.c, this.h);
    }
    #stringify(l, c, h) {
        const alpha = this.alpha === null || equals(this.alpha, 1) ?
            '' :
            ` / ${stringifyWithPrecision(this.alpha)}`;
        return `lch(${stringifyWithPrecision(l, 0)} ${stringifyWithPrecision(c)} ${stringifyWithPrecision(h)}${alpha})`;
    }
    getAuthoredText() {
        return this.#authoredText ?? null;
    }
    getRawParameters() {
        return [...this.#rawParams];
    }
    getAsRawString(format) {
        if (format) {
            return this.as(format).getAsRawString();
        }
        return this.#stringify(...this.#rawParams);
    }
    isGamutClipped() {
        return false;
    }
    // See "powerless" component definitions in
    // https://www.w3.org/TR/css-color-4/#specifying-lab-lch
    isHuePowerless() {
        return equals(this.c, 0);
    }
    static fromSpec(spec, text) {
        const L = parsePercentage(spec[0], [0, 100]) ?? parseNumber(spec[0]);
        if (L === null) {
            return null;
        }
        const c = parsePercentage(spec[1], [0, 150]) ?? parseNumber(spec[1]);
        if (c === null) {
            return null;
        }
        const h = parseAngle(spec[2]);
        if (h === null) {
            return null;
        }
        const alpha = parseAlpha(spec[3]);
        return new LCH(L, c, h, alpha, text);
    }
}
class Oklab {
    #rawParams;
    l;
    a;
    b;
    alpha;
    #authoredText;
    static #conversions = {
        ["nickname" /* Format.Nickname */]: (self) => new Legacy(self.#getRGBArray(/* withAlpha= */ false), "nickname" /* Format.Nickname */),
        ["hex" /* Format.HEX */]: (self) => new Legacy(self.#getRGBArray(/* withAlpha= */ false), "hex" /* Format.HEX */),
        ["shorthex" /* Format.ShortHEX */]: (self) => new Legacy(self.#getRGBArray(/* withAlpha= */ false), "shorthex" /* Format.ShortHEX */),
        ["hexa" /* Format.HEXA */]: (self) => new Legacy(self.#getRGBArray(/* withAlpha= */ true), "hexa" /* Format.HEXA */),
        ["shorthexa" /* Format.ShortHEXA */]: (self) => new Legacy(self.#getRGBArray(/* withAlpha= */ true), "shorthexa" /* Format.ShortHEXA */),
        ["rgb" /* Format.RGB */]: (self) => new Legacy(self.#getRGBArray(/* withAlpha= */ false), "rgb" /* Format.RGB */),
        ["rgba" /* Format.RGBA */]: (self) => new Legacy(self.#getRGBArray(/* withAlpha= */ true), "rgba" /* Format.RGBA */),
        ["hsl" /* Format.HSL */]: (self) => new HSL(...rgbToHsl(self.#getRGBArray(/* withAlpha= */ false)), self.alpha),
        ["hsla" /* Format.HSLA */]: (self) => new HSL(...rgbToHsl(self.#getRGBArray(/* withAlpha= */ false)), self.alpha),
        ["hwb" /* Format.HWB */]: (self) => new HWB(...rgbToHwb(self.#getRGBArray(/* withAlpha= */ false)), self.alpha),
        ["hwba" /* Format.HWBA */]: (self) => new HWB(...rgbToHwb(self.#getRGBArray(/* withAlpha= */ false)), self.alpha),
        ["lch" /* Format.LCH */]: (self) => new LCH(...ColorConverter.labToLch(...ColorConverter.xyzd50ToLab(...self.#toXyzd50())), self.alpha),
        ["oklch" /* Format.OKLCH */]: (self) => new Oklch(...ColorConverter.xyzd50ToOklch(...self.#toXyzd50()), self.alpha),
        ["lab" /* Format.LAB */]: (self) => new Lab(...ColorConverter.xyzd50ToLab(...self.#toXyzd50()), self.alpha),
        ["oklab" /* Format.OKLAB */]: (self) => self,
        ["srgb" /* Format.SRGB */]: (self) => new ColorFunction("srgb" /* Format.SRGB */, ...ColorConverter.xyzd50ToSrgb(...self.#toXyzd50()), self.alpha),
        ["srgb-linear" /* Format.SRGB_LINEAR */]: (self) => new ColorFunction("srgb-linear" /* Format.SRGB_LINEAR */, ...ColorConverter.xyzd50TosRGBLinear(...self.#toXyzd50()), self.alpha),
        ["display-p3" /* Format.DISPLAY_P3 */]: (self) => new ColorFunction("display-p3" /* Format.DISPLAY_P3 */, ...ColorConverter.xyzd50ToDisplayP3(...self.#toXyzd50()), self.alpha),
        ["a98-rgb" /* Format.A98_RGB */]: (self) => new ColorFunction("a98-rgb" /* Format.A98_RGB */, ...ColorConverter.xyzd50ToAdobeRGB(...self.#toXyzd50()), self.alpha),
        ["prophoto-rgb" /* Format.PROPHOTO_RGB */]: (self) => new ColorFunction("prophoto-rgb" /* Format.PROPHOTO_RGB */, ...ColorConverter.xyzd50ToProPhoto(...self.#toXyzd50()), self.alpha),
        ["rec2020" /* Format.REC_2020 */]: (self) => new ColorFunction("rec2020" /* Format.REC_2020 */, ...ColorConverter.xyzd50ToRec2020(...self.#toXyzd50()), self.alpha),
        ["xyz" /* Format.XYZ */]: (self) => new ColorFunction("xyz" /* Format.XYZ */, ...ColorConverter.xyzd50ToD65(...self.#toXyzd50()), self.alpha),
        ["xyz-d50" /* Format.XYZ_D50 */]: (self) => new ColorFunction("xyz-d50" /* Format.XYZ_D50 */, ...self.#toXyzd50(), self.alpha),
        ["xyz-d65" /* Format.XYZ_D65 */]: (self) => new ColorFunction("xyz-d65" /* Format.XYZ_D65 */, ...ColorConverter.xyzd50ToD65(...self.#toXyzd50()), self.alpha),
    };
    #toXyzd50() {
        return ColorConverter.xyzd65ToD50(...ColorConverter.oklabToXyzd65(this.l, this.a, this.b));
    }
    #getRGBArray(withAlpha = true) {
        const params = ColorConverter.xyzd50ToSrgb(...this.#toXyzd50());
        if (withAlpha) {
            return [...params, this.alpha ?? undefined];
        }
        return params;
    }
    constructor(l, a, b, alpha, authoredText) {
        this.#rawParams = [l, a, b];
        this.l = clamp(l, { min: 0, max: 1 });
        if (equals(this.l, 0) || equals(this.l, 1)) {
            a = b = 0;
        }
        this.a = a;
        this.b = b;
        this.alpha = clamp(alpha, { min: 0, max: 1 });
        this.#authoredText = authoredText;
    }
    asLegacyColor() {
        return this.as("rgba" /* Format.RGBA */);
    }
    is(format) {
        return format === this.format();
    }
    as(format) {
        return Oklab.#conversions[format](this);
    }
    equal(color) {
        const oklab = color.as("oklab" /* Format.OKLAB */);
        return equals(oklab.l, this.l) && equals(oklab.a, this.a) && equals(oklab.b, this.b) &&
            equals(oklab.alpha, this.alpha);
    }
    format() {
        return "oklab" /* Format.OKLAB */;
    }
    setAlpha(alpha) {
        return new Oklab(this.l, this.a, this.b, alpha);
    }
    asString(format) {
        if (format) {
            return this.as(format).asString();
        }
        return this.#stringify(this.l, this.a, this.b);
    }
    #stringify(l, a, b) {
        const alpha = this.alpha === null || equals(this.alpha, 1) ?
            '' :
            ` / ${stringifyWithPrecision(this.alpha)}`;
        return `oklab(${stringifyWithPrecision(l)} ${stringifyWithPrecision(a)} ${stringifyWithPrecision(b)}${alpha})`;
    }
    getAuthoredText() {
        return this.#authoredText ?? null;
    }
    getRawParameters() {
        return [...this.#rawParams];
    }
    getAsRawString(format) {
        if (format) {
            return this.as(format).getAsRawString();
        }
        return this.#stringify(...this.#rawParams);
    }
    isGamutClipped() {
        return false;
    }
    static fromSpec(spec, text) {
        const L = parsePercentage(spec[0], [0, 1]) ?? parseNumber(spec[0]);
        if (L === null) {
            return null;
        }
        const a = parsePercentage(spec[1], [0, 0.4]) ?? parseNumber(spec[1]);
        if (a === null) {
            return null;
        }
        const b = parsePercentage(spec[2], [0, 0.4]) ?? parseNumber(spec[2]);
        if (b === null) {
            return null;
        }
        const alpha = parseAlpha(spec[3]);
        return new Oklab(L, a, b, alpha, text);
    }
}
class Oklch {
    #rawParams;
    l;
    c;
    h;
    alpha;
    #authoredText;
    static #conversions = {
        ["nickname" /* Format.Nickname */]: (self) => new Legacy(self.#getRGBArray(/* withAlpha= */ false), "nickname" /* Format.Nickname */),
        ["hex" /* Format.HEX */]: (self) => new Legacy(self.#getRGBArray(/* withAlpha= */ false), "hex" /* Format.HEX */),
        ["shorthex" /* Format.ShortHEX */]: (self) => new Legacy(self.#getRGBArray(/* withAlpha= */ false), "shorthex" /* Format.ShortHEX */),
        ["hexa" /* Format.HEXA */]: (self) => new Legacy(self.#getRGBArray(/* withAlpha= */ true), "hexa" /* Format.HEXA */),
        ["shorthexa" /* Format.ShortHEXA */]: (self) => new Legacy(self.#getRGBArray(/* withAlpha= */ true), "shorthexa" /* Format.ShortHEXA */),
        ["rgb" /* Format.RGB */]: (self) => new Legacy(self.#getRGBArray(/* withAlpha= */ false), "rgb" /* Format.RGB */),
        ["rgba" /* Format.RGBA */]: (self) => new Legacy(self.#getRGBArray(/* withAlpha= */ true), "rgba" /* Format.RGBA */),
        ["hsl" /* Format.HSL */]: (self) => new HSL(...rgbToHsl(self.#getRGBArray(/* withAlpha= */ false)), self.alpha),
        ["hsla" /* Format.HSLA */]: (self) => new HSL(...rgbToHsl(self.#getRGBArray(/* withAlpha= */ false)), self.alpha),
        ["hwb" /* Format.HWB */]: (self) => new HWB(...rgbToHwb(self.#getRGBArray(/* withAlpha= */ false)), self.alpha),
        ["hwba" /* Format.HWBA */]: (self) => new HWB(...rgbToHwb(self.#getRGBArray(/* withAlpha= */ false)), self.alpha),
        ["lch" /* Format.LCH */]: (self) => new LCH(...ColorConverter.labToLch(...ColorConverter.xyzd50ToLab(...self.#toXyzd50())), self.alpha),
        ["oklch" /* Format.OKLCH */]: (self) => self,
        ["lab" /* Format.LAB */]: (self) => new Lab(...ColorConverter.xyzd50ToLab(...self.#toXyzd50()), self.alpha),
        ["oklab" /* Format.OKLAB */]: (self) => new Oklab(...ColorConverter.xyzd65ToOklab(...ColorConverter.xyzd50ToD65(...self.#toXyzd50())), self.alpha),
        ["srgb" /* Format.SRGB */]: (self) => new ColorFunction("srgb" /* Format.SRGB */, ...ColorConverter.xyzd50ToSrgb(...self.#toXyzd50()), self.alpha),
        ["srgb-linear" /* Format.SRGB_LINEAR */]: (self) => new ColorFunction("srgb-linear" /* Format.SRGB_LINEAR */, ...ColorConverter.xyzd50TosRGBLinear(...self.#toXyzd50()), self.alpha),
        ["display-p3" /* Format.DISPLAY_P3 */]: (self) => new ColorFunction("display-p3" /* Format.DISPLAY_P3 */, ...ColorConverter.xyzd50ToDisplayP3(...self.#toXyzd50()), self.alpha),
        ["a98-rgb" /* Format.A98_RGB */]: (self) => new ColorFunction("a98-rgb" /* Format.A98_RGB */, ...ColorConverter.xyzd50ToAdobeRGB(...self.#toXyzd50()), self.alpha),
        ["prophoto-rgb" /* Format.PROPHOTO_RGB */]: (self) => new ColorFunction("prophoto-rgb" /* Format.PROPHOTO_RGB */, ...ColorConverter.xyzd50ToProPhoto(...self.#toXyzd50()), self.alpha),
        ["rec2020" /* Format.REC_2020 */]: (self) => new ColorFunction("rec2020" /* Format.REC_2020 */, ...ColorConverter.xyzd50ToRec2020(...self.#toXyzd50()), self.alpha),
        ["xyz" /* Format.XYZ */]: (self) => new ColorFunction("xyz" /* Format.XYZ */, ...ColorConverter.xyzd50ToD65(...self.#toXyzd50()), self.alpha),
        ["xyz-d50" /* Format.XYZ_D50 */]: (self) => new ColorFunction("xyz-d50" /* Format.XYZ_D50 */, ...self.#toXyzd50(), self.alpha),
        ["xyz-d65" /* Format.XYZ_D65 */]: (self) => new ColorFunction("xyz-d65" /* Format.XYZ_D65 */, ...ColorConverter.xyzd50ToD65(...self.#toXyzd50()), self.alpha),
    };
    #toXyzd50() {
        return ColorConverter.oklchToXyzd50(this.l, this.c, this.h);
    }
    #getRGBArray(withAlpha = true) {
        const params = ColorConverter.xyzd50ToSrgb(...this.#toXyzd50());
        if (withAlpha) {
            return [...params, this.alpha ?? undefined];
        }
        return params;
    }
    constructor(l, c, h, alpha, authoredText) {
        this.#rawParams = [l, c, h];
        this.l = clamp(l, { min: 0, max: 1 });
        c = equals(this.l, 0) || equals(this.l, 1) ? 0 : c;
        this.c = clamp(c, { min: 0 });
        h = equals(c, 0) ? 0 : h;
        this.h = normalizeHue(h);
        this.alpha = clamp(alpha, { min: 0, max: 1 });
        this.#authoredText = authoredText;
    }
    asLegacyColor() {
        return this.as("rgba" /* Format.RGBA */);
    }
    is(format) {
        return format === this.format();
    }
    as(format) {
        return Oklch.#conversions[format](this);
    }
    equal(color) {
        const oklch = color.as("oklch" /* Format.OKLCH */);
        return equals(oklch.l, this.l) && equals(oklch.c, this.c) && equals(oklch.h, this.h) &&
            equals(oklch.alpha, this.alpha);
    }
    format() {
        return "oklch" /* Format.OKLCH */;
    }
    setAlpha(alpha) {
        return new Oklch(this.l, this.c, this.h, alpha);
    }
    asString(format) {
        if (format) {
            return this.as(format).asString();
        }
        return this.#stringify(this.l, this.c, this.h);
    }
    #stringify(l, c, h) {
        const alpha = this.alpha === null || equals(this.alpha, 1) ?
            '' :
            ` / ${stringifyWithPrecision(this.alpha)}`;
        return `oklch(${stringifyWithPrecision(l)} ${stringifyWithPrecision(c)} ${stringifyWithPrecision(h)}${alpha})`;
    }
    getAuthoredText() {
        return this.#authoredText ?? null;
    }
    getRawParameters() {
        return [...this.#rawParams];
    }
    getAsRawString(format) {
        if (format) {
            return this.as(format).getAsRawString();
        }
        return this.#stringify(...this.#rawParams);
    }
    isGamutClipped() {
        return false;
    }
    static fromSpec(spec, text) {
        const L = parsePercentage(spec[0], [0, 1]) ?? parseNumber(spec[0]);
        if (L === null) {
            return null;
        }
        const c = parsePercentage(spec[1], [0, 0.4]) ?? parseNumber(spec[1]);
        if (c === null) {
            return null;
        }
        const h = parseAngle(spec[2]);
        if (h === null) {
            return null;
        }
        const alpha = parseAlpha(spec[3]);
        return new Oklch(L, c, h, alpha, text);
    }
}
class ColorFunction {
    #rawParams;
    p0;
    p1;
    p2;
    alpha;
    colorSpace;
    #authoredText;
    static #conversions = {
        ["nickname" /* Format.Nickname */]: (self) => new Legacy(self.#getRGBArray(/* withAlpha= */ false), "nickname" /* Format.Nickname */),
        ["hex" /* Format.HEX */]: (self) => new Legacy(self.#getRGBArray(/* withAlpha= */ false), "hex" /* Format.HEX */),
        ["shorthex" /* Format.ShortHEX */]: (self) => new Legacy(self.#getRGBArray(/* withAlpha= */ false), "shorthex" /* Format.ShortHEX */),
        ["hexa" /* Format.HEXA */]: (self) => new Legacy(self.#getRGBArray(/* withAlpha= */ true), "hexa" /* Format.HEXA */),
        ["shorthexa" /* Format.ShortHEXA */]: (self) => new Legacy(self.#getRGBArray(/* withAlpha= */ true), "shorthexa" /* Format.ShortHEXA */),
        ["rgb" /* Format.RGB */]: (self) => new Legacy(self.#getRGBArray(/* withAlpha= */ false), "rgb" /* Format.RGB */),
        ["rgba" /* Format.RGBA */]: (self) => new Legacy(self.#getRGBArray(/* withAlpha= */ true), "rgba" /* Format.RGBA */),
        ["hsl" /* Format.HSL */]: (self) => new HSL(...rgbToHsl(self.#getRGBArray(/* withAlpha= */ false)), self.alpha),
        ["hsla" /* Format.HSLA */]: (self) => new HSL(...rgbToHsl(self.#getRGBArray(/* withAlpha= */ false)), self.alpha),
        ["hwb" /* Format.HWB */]: (self) => new HWB(...rgbToHwb(self.#getRGBArray(/* withAlpha= */ false)), self.alpha),
        ["hwba" /* Format.HWBA */]: (self) => new HWB(...rgbToHwb(self.#getRGBArray(/* withAlpha= */ false)), self.alpha),
        ["lch" /* Format.LCH */]: (self) => new LCH(...ColorConverter.labToLch(...ColorConverter.xyzd50ToLab(...self.#toXyzd50())), self.alpha),
        ["oklch" /* Format.OKLCH */]: (self) => new Oklch(...ColorConverter.xyzd50ToOklch(...self.#toXyzd50()), self.alpha),
        ["lab" /* Format.LAB */]: (self) => new Lab(...ColorConverter.xyzd50ToLab(...self.#toXyzd50()), self.alpha),
        ["oklab" /* Format.OKLAB */]: (self) => new Oklab(...ColorConverter.xyzd65ToOklab(...ColorConverter.xyzd50ToD65(...self.#toXyzd50())), self.alpha),
        ["srgb" /* Format.SRGB */]: (self) => new ColorFunction("srgb" /* Format.SRGB */, ...ColorConverter.xyzd50ToSrgb(...self.#toXyzd50()), self.alpha),
        ["srgb-linear" /* Format.SRGB_LINEAR */]: (self) => new ColorFunction("srgb-linear" /* Format.SRGB_LINEAR */, ...ColorConverter.xyzd50TosRGBLinear(...self.#toXyzd50()), self.alpha),
        ["display-p3" /* Format.DISPLAY_P3 */]: (self) => new ColorFunction("display-p3" /* Format.DISPLAY_P3 */, ...ColorConverter.xyzd50ToDisplayP3(...self.#toXyzd50()), self.alpha),
        ["a98-rgb" /* Format.A98_RGB */]: (self) => new ColorFunction("a98-rgb" /* Format.A98_RGB */, ...ColorConverter.xyzd50ToAdobeRGB(...self.#toXyzd50()), self.alpha),
        ["prophoto-rgb" /* Format.PROPHOTO_RGB */]: (self) => new ColorFunction("prophoto-rgb" /* Format.PROPHOTO_RGB */, ...ColorConverter.xyzd50ToProPhoto(...self.#toXyzd50()), self.alpha),
        ["rec2020" /* Format.REC_2020 */]: (self) => new ColorFunction("rec2020" /* Format.REC_2020 */, ...ColorConverter.xyzd50ToRec2020(...self.#toXyzd50()), self.alpha),
        ["xyz" /* Format.XYZ */]: (self) => new ColorFunction("xyz" /* Format.XYZ */, ...ColorConverter.xyzd50ToD65(...self.#toXyzd50()), self.alpha),
        ["xyz-d50" /* Format.XYZ_D50 */]: (self) => new ColorFunction("xyz-d50" /* Format.XYZ_D50 */, ...self.#toXyzd50(), self.alpha),
        ["xyz-d65" /* Format.XYZ_D65 */]: (self) => new ColorFunction("xyz-d65" /* Format.XYZ_D65 */, ...ColorConverter.xyzd50ToD65(...self.#toXyzd50()), self.alpha),
    };
    #toXyzd50() {
        // With color(), out-of-gamut inputs are to be used for intermediate computations
        const [p0, p1, p2] = this.#rawParams;
        switch (this.colorSpace) {
            case "srgb" /* Format.SRGB */:
                return ColorConverter.srgbToXyzd50(p0, p1, p2);
            case "srgb-linear" /* Format.SRGB_LINEAR */:
                return ColorConverter.srgbLinearToXyzd50(p0, p1, p2);
            case "display-p3" /* Format.DISPLAY_P3 */:
                return ColorConverter.displayP3ToXyzd50(p0, p1, p2);
            case "a98-rgb" /* Format.A98_RGB */:
                return ColorConverter.adobeRGBToXyzd50(p0, p1, p2);
            case "prophoto-rgb" /* Format.PROPHOTO_RGB */:
                return ColorConverter.proPhotoToXyzd50(p0, p1, p2);
            case "rec2020" /* Format.REC_2020 */:
                return ColorConverter.rec2020ToXyzd50(p0, p1, p2);
            case "xyz-d50" /* Format.XYZ_D50 */:
                return [p0, p1, p2];
            case "xyz" /* Format.XYZ */:
            case "xyz-d65" /* Format.XYZ_D65 */:
                return ColorConverter.xyzd65ToD50(p0, p1, p2);
        }
        throw new Error('Invalid color space');
    }
    #getRGBArray(withAlpha = true) {
        // With color(), out-of-gamut inputs are to be used for intermediate computations
        const [p0, p1, p2] = this.#rawParams;
        const params = this.colorSpace === "srgb" /* Format.SRGB */ ? [p0, p1, p2] : [...ColorConverter.xyzd50ToSrgb(...this.#toXyzd50())];
        if (withAlpha) {
            return [...params, this.alpha ?? undefined];
        }
        return params;
    }
    constructor(colorSpace, p0, p1, p2, alpha, authoredText) {
        this.#rawParams = [p0, p1, p2];
        this.colorSpace = colorSpace;
        this.#authoredText = authoredText;
        if (this.colorSpace !== "xyz-d50" /* Format.XYZ_D50 */ && this.colorSpace !== "xyz-d65" /* Format.XYZ_D65 */ && this.colorSpace !== "xyz" /* Format.XYZ */) {
            p0 = clamp(p0, { min: 0, max: 1 });
            p1 = clamp(p1, { min: 0, max: 1 });
            p2 = clamp(p2, { min: 0, max: 1 });
        }
        this.p0 = p0;
        this.p1 = p1;
        this.p2 = p2;
        this.alpha = clamp(alpha, { min: 0, max: 1 });
    }
    asLegacyColor() {
        return this.as("rgba" /* Format.RGBA */);
    }
    is(format) {
        return format === this.format();
    }
    as(format) {
        if (this.colorSpace === format) {
            return this;
        }
        return ColorFunction.#conversions[format](this);
    }
    equal(color) {
        const space = color.as(this.colorSpace);
        return equals(this.p0, space.p0) && equals(this.p1, space.p1) && equals(this.p2, space.p2) &&
            equals(this.alpha, space.alpha);
    }
    format() {
        return this.colorSpace;
    }
    setAlpha(alpha) {
        return new ColorFunction(this.colorSpace, this.p0, this.p1, this.p2, alpha);
    }
    asString(format) {
        if (format) {
            return this.as(format).asString();
        }
        return this.#stringify(this.p0, this.p1, this.p2);
    }
    #stringify(p0, p1, p2) {
        const alpha = this.alpha === null || equals(this.alpha, 1) ?
            '' :
            ` / ${stringifyWithPrecision(this.alpha)}`;
        return `color(${this.colorSpace} ${stringifyWithPrecision(p0)} ${stringifyWithPrecision(p1)} ${stringifyWithPrecision(p2)}${alpha})`;
    }
    getAuthoredText() {
        return this.#authoredText ?? null;
    }
    getRawParameters() {
        return [...this.#rawParams];
    }
    getAsRawString(format) {
        if (format) {
            return this.as(format).getAsRawString();
        }
        return this.#stringify(...this.#rawParams);
    }
    isGamutClipped() {
        if (this.colorSpace !== "xyz-d50" /* Format.XYZ_D50 */ && this.colorSpace !== "xyz-d65" /* Format.XYZ_D65 */ && this.colorSpace !== "xyz" /* Format.XYZ */) {
            return !equals(this.#rawParams, [this.p0, this.p1, this.p2]);
        }
        return false;
    }
    /**
     * Parses given `color()` function definition and returns the `Color` object.
     * We want to special case its parsing here because it's a bit different
     * than other color functions: rgb, lch etc. accepts 3 arguments with
     * optional alpha. This accepts 4 arguments with optional alpha.
     *
     * Instead of making `splitColorFunctionParameters` work for this case too
     * I've decided to implement it specifically.
     * @param authoredText Original definition of the color with `color`
     * @param parametersText Inside of the `color()` function. ex, `display-p3 0.1 0.2 0.3 / 0%`
     * @returns `Color` object
     */
    static fromSpec(authoredText, parametersWithAlphaText) {
        const [parametersText, alphaText] = parametersWithAlphaText.split('/', 2);
        const parameters = parametersText.trim().split(/\s+/);
        const [colorSpaceText, ...remainingParams] = parameters;
        const colorSpace = getColorSpace(colorSpaceText);
        // Color space is not known to us, do not parse the Color.
        if (!colorSpace) {
            return null;
        }
        // `color(<color-space>)` is a valid syntax
        if (remainingParams.length === 0 && alphaText === undefined) {
            return new ColorFunction(colorSpace, 0, 0, 0, null, authoredText);
        }
        // Check if it contains `/ <alpha>` part, if so, it should be at the end
        if (remainingParams.length === 0 && alphaText !== undefined && alphaText.trim().split(/\s+/).length > 1) {
            // Invalid syntax: like `color(<space> / <alpha> <number>)`
            return null;
        }
        // `color` cannot contain more than 3 parameters without alpha
        if (remainingParams.length > 3) {
            return null;
        }
        // Replace `none`s with 0s
        const nonesReplacedParams = remainingParams.map(param => param === 'none' ? '0' : param);
        // At this point, we know that all the values are there so we can
        // safely try to parse all the values as number or percentage
        const values = nonesReplacedParams.map(param => parsePercentOrNumber(param, [0, 1]));
        const containsNull = values.includes(null);
        // At least one value is malformatted (not a number or percentage)
        if (containsNull) {
            return null;
        }
        const alphaValue = alphaText ? parsePercentOrNumber(alphaText, [0, 1]) ?? 1 : 1;
        // Depending on the color space
        // this either reflects `rgb` parameters in that color space
        // or `xyz` parameters in the given `xyz` space.
        const rgbOrXyza = [
            values[0] ?? 0,
            values[1] ?? 0,
            values[2] ?? 0,
            alphaValue,
        ];
        return new ColorFunction(colorSpace, ...rgbOrXyza, authoredText);
    }
}
class HSL {
    h;
    s;
    l;
    alpha;
    #rawParams;
    #authoredText;
    static #conversions = {
        ["nickname" /* Format.Nickname */]: (self) => new Legacy(self.#getRGBArray(/* withAlpha= */ false), "nickname" /* Format.Nickname */),
        ["hex" /* Format.HEX */]: (self) => new Legacy(self.#getRGBArray(/* withAlpha= */ false), "hex" /* Format.HEX */),
        ["shorthex" /* Format.ShortHEX */]: (self) => new Legacy(self.#getRGBArray(/* withAlpha= */ false), "shorthex" /* Format.ShortHEX */),
        ["hexa" /* Format.HEXA */]: (self) => new Legacy(self.#getRGBArray(/* withAlpha= */ true), "hexa" /* Format.HEXA */),
        ["shorthexa" /* Format.ShortHEXA */]: (self) => new Legacy(self.#getRGBArray(/* withAlpha= */ true), "shorthexa" /* Format.ShortHEXA */),
        ["rgb" /* Format.RGB */]: (self) => new Legacy(self.#getRGBArray(/* withAlpha= */ false), "rgb" /* Format.RGB */),
        ["rgba" /* Format.RGBA */]: (self) => new Legacy(self.#getRGBArray(/* withAlpha= */ true), "rgba" /* Format.RGBA */),
        ["hsl" /* Format.HSL */]: (self) => self,
        ["hsla" /* Format.HSLA */]: (self) => self,
        ["hwb" /* Format.HWB */]: (self) => new HWB(...rgbToHwb(self.#getRGBArray(/* withAlpha= */ false)), self.alpha),
        ["hwba" /* Format.HWBA */]: (self) => new HWB(...rgbToHwb(self.#getRGBArray(/* withAlpha= */ false)), self.alpha),
        ["lch" /* Format.LCH */]: (self) => new LCH(...ColorConverter.labToLch(...ColorConverter.xyzd50ToLab(...self.#toXyzd50())), self.alpha),
        ["oklch" /* Format.OKLCH */]: (self) => new Oklch(...ColorConverter.xyzd50ToOklch(...self.#toXyzd50()), self.alpha),
        ["lab" /* Format.LAB */]: (self) => new Lab(...ColorConverter.xyzd50ToLab(...self.#toXyzd50()), self.alpha),
        ["oklab" /* Format.OKLAB */]: (self) => new Oklab(...ColorConverter.xyzd65ToOklab(...ColorConverter.xyzd50ToD65(...self.#toXyzd50())), self.alpha),
        ["srgb" /* Format.SRGB */]: (self) => new ColorFunction("srgb" /* Format.SRGB */, ...ColorConverter.xyzd50ToSrgb(...self.#toXyzd50()), self.alpha),
        ["srgb-linear" /* Format.SRGB_LINEAR */]: (self) => new ColorFunction("srgb-linear" /* Format.SRGB_LINEAR */, ...ColorConverter.xyzd50TosRGBLinear(...self.#toXyzd50()), self.alpha),
        ["display-p3" /* Format.DISPLAY_P3 */]: (self) => new ColorFunction("display-p3" /* Format.DISPLAY_P3 */, ...ColorConverter.xyzd50ToDisplayP3(...self.#toXyzd50()), self.alpha),
        ["a98-rgb" /* Format.A98_RGB */]: (self) => new ColorFunction("a98-rgb" /* Format.A98_RGB */, ...ColorConverter.xyzd50ToAdobeRGB(...self.#toXyzd50()), self.alpha),
        ["prophoto-rgb" /* Format.PROPHOTO_RGB */]: (self) => new ColorFunction("prophoto-rgb" /* Format.PROPHOTO_RGB */, ...ColorConverter.xyzd50ToProPhoto(...self.#toXyzd50()), self.alpha),
        ["rec2020" /* Format.REC_2020 */]: (self) => new ColorFunction("rec2020" /* Format.REC_2020 */, ...ColorConverter.xyzd50ToRec2020(...self.#toXyzd50()), self.alpha),
        ["xyz" /* Format.XYZ */]: (self) => new ColorFunction("xyz" /* Format.XYZ */, ...ColorConverter.xyzd50ToD65(...self.#toXyzd50()), self.alpha),
        ["xyz-d50" /* Format.XYZ_D50 */]: (self) => new ColorFunction("xyz-d50" /* Format.XYZ_D50 */, ...self.#toXyzd50(), self.alpha),
        ["xyz-d65" /* Format.XYZ_D65 */]: (self) => new ColorFunction("xyz-d65" /* Format.XYZ_D65 */, ...ColorConverter.xyzd50ToD65(...self.#toXyzd50()), self.alpha),
    };
    #getRGBArray(withAlpha = true) {
        const rgb = hsl2rgb([this.h, this.s, this.l, 0]);
        if (withAlpha) {
            return [rgb[0], rgb[1], rgb[2], this.alpha ?? undefined];
        }
        return [rgb[0], rgb[1], rgb[2]];
    }
    #toXyzd50() {
        const rgb = this.#getRGBArray(false);
        return ColorConverter.srgbToXyzd50(rgb[0], rgb[1], rgb[2]);
    }
    constructor(h, s, l, alpha, authoredText) {
        this.#rawParams = [h, s, l];
        this.l = clamp(l, { min: 0, max: 1 });
        s = equals(this.l, 0) || equals(this.l, 1) ? 0 : s;
        this.s = clamp(s, { min: 0, max: 1 });
        h = equals(this.s, 0) ? 0 : h;
        this.h = normalizeHue(h * 360) / 360;
        this.alpha = clamp(alpha ?? null, { min: 0, max: 1 });
        this.#authoredText = authoredText;
    }
    equal(color) {
        const hsl = color.as("hsl" /* Format.HSL */);
        return equals(this.h, hsl.h) && equals(this.s, hsl.s) && equals(this.l, hsl.l) && equals(this.alpha, hsl.alpha);
    }
    asString(format) {
        if (format) {
            return this.as(format).asString();
        }
        return this.#stringify(this.h, this.s, this.l);
    }
    #stringify(h, s, l) {
        const start = sprintf('hsl(%sdeg %s% %s%', stringifyWithPrecision(h * 360), stringifyWithPrecision(s * 100), stringifyWithPrecision(l * 100));
        if (this.alpha !== null && this.alpha !== 1) {
            return start +
                sprintf(' / %s%)', stringifyWithPrecision(this.alpha * 100));
        }
        return start + ')';
    }
    setAlpha(alpha) {
        return new HSL(this.h, this.s, this.l, alpha);
    }
    format() {
        return this.alpha === null || this.alpha === 1 ? "hsl" /* Format.HSL */ : "hsla" /* Format.HSLA */;
    }
    is(format) {
        return format === this.format();
    }
    as(format) {
        if (format === this.format()) {
            return this;
        }
        return HSL.#conversions[format](this);
    }
    asLegacyColor() {
        return this.as("rgba" /* Format.RGBA */);
    }
    getAuthoredText() {
        return this.#authoredText ?? null;
    }
    getRawParameters() {
        return [...this.#rawParams];
    }
    getAsRawString(format) {
        if (format) {
            return this.as(format).getAsRawString();
        }
        return this.#stringify(...this.#rawParams);
    }
    isGamutClipped() {
        return !lessOrEquals(this.#rawParams[1], 1) || !lessOrEquals(0, this.#rawParams[1]);
    }
    static fromSpec(spec, text) {
        const h = parseHueNumeric(spec[0]);
        if (h === null) {
            return null;
        }
        const s = parseSatLightNumeric(spec[1]);
        if (s === null) {
            return null;
        }
        const l = parseSatLightNumeric(spec[2]);
        if (l === null) {
            return null;
        }
        const alpha = parseAlpha(spec[3]);
        return new HSL(h, s, l, alpha, text);
    }
    hsva() {
        const s = this.s * (this.l < 0.5 ? this.l : 1 - this.l);
        return [this.h, s !== 0 ? 2 * s / (this.l + s) : 0, (this.l + s), this.alpha ?? 1];
    }
    canonicalHSLA() {
        return [Math.round(this.h * 360), Math.round(this.s * 100), Math.round(this.l * 100), this.alpha ?? 1];
    }
}
class HWB {
    h;
    w;
    b;
    alpha;
    #rawParams;
    #authoredText;
    static #conversions = {
        ["nickname" /* Format.Nickname */]: (self) => new Legacy(self.#getRGBArray(/* withAlpha= */ false), "nickname" /* Format.Nickname */),
        ["hex" /* Format.HEX */]: (self) => new Legacy(self.#getRGBArray(/* withAlpha= */ false), "hex" /* Format.HEX */),
        ["shorthex" /* Format.ShortHEX */]: (self) => new Legacy(self.#getRGBArray(/* withAlpha= */ false), "shorthex" /* Format.ShortHEX */),
        ["hexa" /* Format.HEXA */]: (self) => new Legacy(self.#getRGBArray(/* withAlpha= */ true), "hexa" /* Format.HEXA */),
        ["shorthexa" /* Format.ShortHEXA */]: (self) => new Legacy(self.#getRGBArray(/* withAlpha= */ true), "shorthexa" /* Format.ShortHEXA */),
        ["rgb" /* Format.RGB */]: (self) => new Legacy(self.#getRGBArray(/* withAlpha= */ false), "rgb" /* Format.RGB */),
        ["rgba" /* Format.RGBA */]: (self) => new Legacy(self.#getRGBArray(/* withAlpha= */ true), "rgba" /* Format.RGBA */),
        ["hsl" /* Format.HSL */]: (self) => new HSL(...rgbToHsl(self.#getRGBArray(/* withAlpha= */ false)), self.alpha),
        ["hsla" /* Format.HSLA */]: (self) => new HSL(...rgbToHsl(self.#getRGBArray(/* withAlpha= */ false)), self.alpha),
        ["hwb" /* Format.HWB */]: (self) => self,
        ["hwba" /* Format.HWBA */]: (self) => self,
        ["lch" /* Format.LCH */]: (self) => new LCH(...ColorConverter.labToLch(...ColorConverter.xyzd50ToLab(...self.#toXyzd50())), self.alpha),
        ["oklch" /* Format.OKLCH */]: (self) => new Oklch(...ColorConverter.xyzd50ToOklch(...self.#toXyzd50()), self.alpha),
        ["lab" /* Format.LAB */]: (self) => new Lab(...ColorConverter.xyzd50ToLab(...self.#toXyzd50()), self.alpha),
        ["oklab" /* Format.OKLAB */]: (self) => new Oklab(...ColorConverter.xyzd65ToOklab(...ColorConverter.xyzd50ToD65(...self.#toXyzd50())), self.alpha),
        ["srgb" /* Format.SRGB */]: (self) => new ColorFunction("srgb" /* Format.SRGB */, ...ColorConverter.xyzd50ToSrgb(...self.#toXyzd50()), self.alpha),
        ["srgb-linear" /* Format.SRGB_LINEAR */]: (self) => new ColorFunction("srgb-linear" /* Format.SRGB_LINEAR */, ...ColorConverter.xyzd50TosRGBLinear(...self.#toXyzd50()), self.alpha),
        ["display-p3" /* Format.DISPLAY_P3 */]: (self) => new ColorFunction("display-p3" /* Format.DISPLAY_P3 */, ...ColorConverter.xyzd50ToDisplayP3(...self.#toXyzd50()), self.alpha),
        ["a98-rgb" /* Format.A98_RGB */]: (self) => new ColorFunction("a98-rgb" /* Format.A98_RGB */, ...ColorConverter.xyzd50ToAdobeRGB(...self.#toXyzd50()), self.alpha),
        ["prophoto-rgb" /* Format.PROPHOTO_RGB */]: (self) => new ColorFunction("prophoto-rgb" /* Format.PROPHOTO_RGB */, ...ColorConverter.xyzd50ToProPhoto(...self.#toXyzd50()), self.alpha),
        ["rec2020" /* Format.REC_2020 */]: (self) => new ColorFunction("rec2020" /* Format.REC_2020 */, ...ColorConverter.xyzd50ToRec2020(...self.#toXyzd50()), self.alpha),
        ["xyz" /* Format.XYZ */]: (self) => new ColorFunction("xyz" /* Format.XYZ */, ...ColorConverter.xyzd50ToD65(...self.#toXyzd50()), self.alpha),
        ["xyz-d50" /* Format.XYZ_D50 */]: (self) => new ColorFunction("xyz-d50" /* Format.XYZ_D50 */, ...self.#toXyzd50(), self.alpha),
        ["xyz-d65" /* Format.XYZ_D65 */]: (self) => new ColorFunction("xyz-d65" /* Format.XYZ_D65 */, ...ColorConverter.xyzd50ToD65(...self.#toXyzd50()), self.alpha),
    };
    #getRGBArray(withAlpha = true) {
        const rgb = hwb2rgb([this.h, this.w, this.b, 0]);
        if (withAlpha) {
            return [rgb[0], rgb[1], rgb[2], this.alpha ?? undefined];
        }
        return [rgb[0], rgb[1], rgb[2]];
    }
    #toXyzd50() {
        const rgb = this.#getRGBArray(false);
        return ColorConverter.srgbToXyzd50(rgb[0], rgb[1], rgb[2]);
    }
    constructor(h, w, b, alpha, authoredText) {
        this.#rawParams = [h, w, b];
        this.w = clamp(w, { min: 0, max: 1 });
        this.b = clamp(b, { min: 0, max: 1 });
        h = lessOrEquals(1, this.w + this.b) ? 0 : h;
        this.h = normalizeHue(h * 360) / 360;
        this.alpha = clamp(alpha, { min: 0, max: 1 });
        if (lessOrEquals(1, this.w + this.b)) {
            // normalize to a sum of 100% respecting the ratio, see https://www.w3.org/TR/css-color-4/#the-hwb-notation
            const ratio = this.w / this.b;
            this.b = 1 / (1 + ratio);
            this.w = 1 - this.b;
        }
        this.#authoredText = authoredText;
    }
    equal(color) {
        const hwb = color.as("hwb" /* Format.HWB */);
        return equals(this.h, hwb.h) && equals(this.w, hwb.w) && equals(this.b, hwb.b) && equals(this.alpha, hwb.alpha);
    }
    asString(format) {
        if (format) {
            return this.as(format).asString();
        }
        return this.#stringify(this.h, this.w, this.b);
    }
    #stringify(h, w, b) {
        const start = sprintf('hwb(%sdeg %s% %s%', stringifyWithPrecision(h * 360), stringifyWithPrecision(w * 100), stringifyWithPrecision(b * 100));
        if (this.alpha !== null && this.alpha !== 1) {
            return start +
                sprintf(' / %s%)', stringifyWithPrecision(this.alpha * 100));
        }
        return start + ')';
    }
    setAlpha(alpha) {
        return new HWB(this.h, this.w, this.b, alpha, this.#authoredText);
    }
    format() {
        return this.alpha !== null && !equals(this.alpha, 1) ? "hwba" /* Format.HWBA */ : "hwb" /* Format.HWB */;
    }
    is(format) {
        return format === this.format();
    }
    as(format) {
        if (format === this.format()) {
            return this;
        }
        return HWB.#conversions[format](this);
    }
    asLegacyColor() {
        return this.as("rgba" /* Format.RGBA */);
    }
    getAuthoredText() {
        return this.#authoredText ?? null;
    }
    canonicalHWBA() {
        return [
            Math.round(this.h * 360),
            Math.round(this.w * 100),
            Math.round(this.b * 100),
            this.alpha ?? 1,
        ];
    }
    getRawParameters() {
        return [...this.#rawParams];
    }
    getAsRawString(format) {
        if (format) {
            return this.as(format).getAsRawString();
        }
        return this.#stringify(...this.#rawParams);
    }
    isGamutClipped() {
        return !lessOrEquals(this.#rawParams[1], 1) || !lessOrEquals(0, this.#rawParams[1]) ||
            !lessOrEquals(this.#rawParams[2], 1) || !lessOrEquals(0, this.#rawParams[2]);
    }
    static fromSpec(spec, text) {
        const h = parseHueNumeric(spec[0]);
        if (h === null) {
            return null;
        }
        const w = parseSatLightNumeric(spec[1]);
        if (w === null) {
            return null;
        }
        const b = parseSatLightNumeric(spec[2]);
        if (b === null) {
            return null;
        }
        const alpha = parseAlpha(spec[3]);
        return new HWB(h, w, b, alpha, text);
    }
}
function toRgbValue(value) {
    return Math.round(value * 255);
}
class Legacy {
    #rawParams;
    #rgbaInternal;
    #authoredText;
    #formatInternal;
    static #conversions = {
        ["nickname" /* Format.Nickname */]: (self) => new Legacy(self.#rgbaInternal, "nickname" /* Format.Nickname */),
        ["hex" /* Format.HEX */]: (self) => new Legacy(self.#rgbaInternal, "hex" /* Format.HEX */),
        ["shorthex" /* Format.ShortHEX */]: (self) => new Legacy(self.#rgbaInternal, "shorthex" /* Format.ShortHEX */),
        ["hexa" /* Format.HEXA */]: (self) => new Legacy(self.#rgbaInternal, "hexa" /* Format.HEXA */),
        ["shorthexa" /* Format.ShortHEXA */]: (self) => new Legacy(self.#rgbaInternal, "shorthexa" /* Format.ShortHEXA */),
        ["rgb" /* Format.RGB */]: (self) => new Legacy(self.#rgbaInternal, "rgb" /* Format.RGB */),
        ["rgba" /* Format.RGBA */]: (self) => new Legacy(self.#rgbaInternal, "rgba" /* Format.RGBA */),
        ["hsl" /* Format.HSL */]: (self) => new HSL(...rgbToHsl([self.#rgbaInternal[0], self.#rgbaInternal[1], self.#rgbaInternal[2]]), self.alpha),
        ["hsla" /* Format.HSLA */]: (self) => new HSL(...rgbToHsl([self.#rgbaInternal[0], self.#rgbaInternal[1], self.#rgbaInternal[2]]), self.alpha),
        ["hwb" /* Format.HWB */]: (self) => new HWB(...rgbToHwb([self.#rgbaInternal[0], self.#rgbaInternal[1], self.#rgbaInternal[2]]), self.alpha),
        ["hwba" /* Format.HWBA */]: (self) => new HWB(...rgbToHwb([self.#rgbaInternal[0], self.#rgbaInternal[1], self.#rgbaInternal[2]]), self.alpha),
        ["lch" /* Format.LCH */]: (self) => new LCH(...ColorConverter.labToLch(...ColorConverter.xyzd50ToLab(...self.#toXyzd50())), self.alpha),
        ["oklch" /* Format.OKLCH */]: (self) => new Oklch(...ColorConverter.xyzd50ToOklch(...self.#toXyzd50()), self.alpha),
        ["lab" /* Format.LAB */]: (self) => new Lab(...ColorConverter.xyzd50ToLab(...self.#toXyzd50()), self.alpha),
        ["oklab" /* Format.OKLAB */]: (self) => new Oklab(...ColorConverter.xyzd65ToOklab(...ColorConverter.xyzd50ToD65(...self.#toXyzd50())), self.alpha),
        ["srgb" /* Format.SRGB */]: (self) => new ColorFunction("srgb" /* Format.SRGB */, ...ColorConverter.xyzd50ToSrgb(...self.#toXyzd50()), self.alpha),
        ["srgb-linear" /* Format.SRGB_LINEAR */]: (self) => new ColorFunction("srgb-linear" /* Format.SRGB_LINEAR */, ...ColorConverter.xyzd50TosRGBLinear(...self.#toXyzd50()), self.alpha),
        ["display-p3" /* Format.DISPLAY_P3 */]: (self) => new ColorFunction("display-p3" /* Format.DISPLAY_P3 */, ...ColorConverter.xyzd50ToDisplayP3(...self.#toXyzd50()), self.alpha),
        ["a98-rgb" /* Format.A98_RGB */]: (self) => new ColorFunction("a98-rgb" /* Format.A98_RGB */, ...ColorConverter.xyzd50ToAdobeRGB(...self.#toXyzd50()), self.alpha),
        ["prophoto-rgb" /* Format.PROPHOTO_RGB */]: (self) => new ColorFunction("prophoto-rgb" /* Format.PROPHOTO_RGB */, ...ColorConverter.xyzd50ToProPhoto(...self.#toXyzd50()), self.alpha),
        ["rec2020" /* Format.REC_2020 */]: (self) => new ColorFunction("rec2020" /* Format.REC_2020 */, ...ColorConverter.xyzd50ToRec2020(...self.#toXyzd50()), self.alpha),
        ["xyz" /* Format.XYZ */]: (self) => new ColorFunction("xyz" /* Format.XYZ */, ...ColorConverter.xyzd50ToD65(...self.#toXyzd50()), self.alpha),
        ["xyz-d50" /* Format.XYZ_D50 */]: (self) => new ColorFunction("xyz-d50" /* Format.XYZ_D50 */, ...self.#toXyzd50(), self.alpha),
        ["xyz-d65" /* Format.XYZ_D65 */]: (self) => new ColorFunction("xyz-d65" /* Format.XYZ_D65 */, ...ColorConverter.xyzd50ToD65(...self.#toXyzd50()), self.alpha),
    };
    #toXyzd50() {
        const [r, g, b] = this.#rgbaInternal;
        return ColorConverter.srgbToXyzd50(r, g, b);
    }
    get alpha() {
        switch (this.format()) {
            case "hexa" /* Format.HEXA */:
            case "shorthexa" /* Format.ShortHEXA */:
            case "rgba" /* Format.RGBA */:
                return this.#rgbaInternal[3];
            default:
                return null;
        }
    }
    asLegacyColor() {
        return this;
    }
    constructor(rgba, format, authoredText) {
        this.#authoredText = authoredText || null;
        this.#formatInternal = format;
        this.#rawParams = [rgba[0], rgba[1], rgba[2]];
        this.#rgbaInternal = [
            clamp(rgba[0], { min: 0, max: 1 }),
            clamp(rgba[1], { min: 0, max: 1 }),
            clamp(rgba[2], { min: 0, max: 1 }),
            clamp(rgba[3] ?? 1, { min: 0, max: 1 }),
        ];
    }
    static fromHex(hex, text) {
        hex = hex.toLowerCase();
        let format;
        if (hex.length === 3) {
            format = "shorthex" /* Format.ShortHEX */;
            hex = hex.charAt(0) + hex.charAt(0) + hex.charAt(1) + hex.charAt(1) + hex.charAt(2) + hex.charAt(2);
        }
        else if (hex.length === 4) {
            format = "shorthexa" /* Format.ShortHEXA */;
            hex = hex.charAt(0) + hex.charAt(0) + hex.charAt(1) + hex.charAt(1) + hex.charAt(2) + hex.charAt(2) +
                hex.charAt(3) + hex.charAt(3);
        }
        else if (hex.length === 6) {
            format = "hex" /* Format.HEX */;
        }
        else {
            format = "hexa" /* Format.HEXA */;
        }
        const r = parseInt(hex.substring(0, 2), 16);
        const g = parseInt(hex.substring(2, 4), 16);
        const b = parseInt(hex.substring(4, 6), 16);
        let a = 1;
        if (hex.length === 8) {
            a = parseInt(hex.substring(6, 8), 16) / 255;
        }
        return new Legacy([r / 255, g / 255, b / 255, a], format, text);
    }
    static fromName(name, text) {
        const nickname = name.toLowerCase();
        const rgba = Nicknames.get(nickname);
        if (rgba !== undefined) {
            const color = Legacy.fromRGBA(rgba, text);
            color.#formatInternal = "nickname" /* Format.Nickname */;
            return color;
        }
        return null;
    }
    static fromRGBAFunction(r, g, b, alpha, text) {
        const rgba = [
            parseRgbNumeric(r),
            parseRgbNumeric(g),
            parseRgbNumeric(b),
            alpha ? parseAlphaNumeric(alpha) : 1,
        ];
        if (!arrayDoesNotContainNullOrUndefined(rgba)) {
            return null;
        }
        return new Legacy(rgba, alpha ? "rgba" /* Format.RGBA */ : "rgb" /* Format.RGB */, text);
    }
    static fromRGBA(rgba, authoredText) {
        return new Legacy([rgba[0] / 255, rgba[1] / 255, rgba[2] / 255, rgba[3]], "rgba" /* Format.RGBA */, authoredText);
    }
    static fromHSVA(hsva) {
        const rgba = hsva2rgba(hsva);
        return new Legacy(rgba, "rgba" /* Format.RGBA */);
    }
    is(format) {
        return format === this.format();
    }
    as(format) {
        if (format === this.format()) {
            return this;
        }
        return Legacy.#conversions[format](this);
    }
    format() {
        return this.#formatInternal;
    }
    hasAlpha() {
        return this.#rgbaInternal[3] !== 1;
    }
    detectHEXFormat() {
        let canBeShort = true;
        for (let i = 0; i < 4; ++i) {
            const c = Math.round(this.#rgbaInternal[i] * 255);
            if (c % 17) {
                canBeShort = false;
                break;
            }
        }
        const hasAlpha = this.hasAlpha();
        if (canBeShort) {
            return hasAlpha ? "shorthexa" /* Format.ShortHEXA */ : "shorthex" /* Format.ShortHEX */;
        }
        return hasAlpha ? "hexa" /* Format.HEXA */ : "hex" /* Format.HEX */;
    }
    asString(format) {
        if (format) {
            return this.as(format).asString();
        }
        return this.#stringify(format, this.#rgbaInternal[0], this.#rgbaInternal[1], this.#rgbaInternal[2]);
    }
    #stringify(format, r, g, b) {
        if (!format) {
            format = this.#formatInternal;
        }
        function toHexValue(value) {
            const hex = Math.round(value * 255).toString(16);
            return hex.length === 1 ? '0' + hex : hex;
        }
        function toShortHexValue(value) {
            return (Math.round(value * 255) / 17).toString(16);
        }
        switch (format) {
            case "rgb" /* Format.RGB */:
            case "rgba" /* Format.RGBA */: {
                const start = sprintf('rgb(%d %d %d', toRgbValue(r), toRgbValue(g), toRgbValue(b));
                if (this.hasAlpha()) {
                    return start + sprintf(' / %d%)', Math.round(this.#rgbaInternal[3] * 100));
                }
                return start + ')';
            }
            case "hexa" /* Format.HEXA */: {
                return sprintf('#%s%s%s%s', toHexValue(r), toHexValue(g), toHexValue(b), toHexValue(this.#rgbaInternal[3]))
                    .toLowerCase();
            }
            case "hex" /* Format.HEX */: {
                if (this.hasAlpha()) {
                    return null;
                }
                return sprintf('#%s%s%s', toHexValue(r), toHexValue(g), toHexValue(b)).toLowerCase();
            }
            case "shorthexa" /* Format.ShortHEXA */: {
                const hexFormat = this.detectHEXFormat();
                if (hexFormat !== "shorthexa" /* Format.ShortHEXA */ && hexFormat !== "shorthex" /* Format.ShortHEX */) {
                    return null;
                }
                return sprintf('#%s%s%s%s', toShortHexValue(r), toShortHexValue(g), toShortHexValue(b), toShortHexValue(this.#rgbaInternal[3]))
                    .toLowerCase();
            }
            case "shorthex" /* Format.ShortHEX */: {
                if (this.hasAlpha()) {
                    return null;
                }
                if (this.detectHEXFormat() !== "shorthex" /* Format.ShortHEX */) {
                    return null;
                }
                return sprintf('#%s%s%s', toShortHexValue(r), toShortHexValue(g), toShortHexValue(b))
                    .toLowerCase();
            }
            case "nickname" /* Format.Nickname */: {
                return this.nickname();
            }
        }
        return null; // Shouldn't get here.
    }
    getAuthoredText() {
        return this.#authoredText ?? null;
    }
    getRawParameters() {
        return [...this.#rawParams];
    }
    getAsRawString(format) {
        if (format) {
            return this.as(format).getAsRawString();
        }
        return this.#stringify(format, ...this.#rawParams);
    }
    isGamutClipped() {
        return !equals(this.#rawParams.map(toRgbValue), [this.#rgbaInternal[0], this.#rgbaInternal[1], this.#rgbaInternal[2]].map(toRgbValue), WIDE_RANGE_EPSILON);
    }
    rgba() {
        return [...this.#rgbaInternal];
    }
    canonicalRGBA() {
        const rgba = new Array(4);
        for (let i = 0; i < 3; ++i) {
            rgba[i] = Math.round(this.#rgbaInternal[i] * 255);
        }
        rgba[3] = this.#rgbaInternal[3];
        return rgba;
    }
    /** nickname
     */
    nickname() {
        return RGBAToNickname.get(String(this.canonicalRGBA())) || null;
    }
    toProtocolRGBA() {
        const rgba = this.canonicalRGBA();
        const result = { r: rgba[0], g: rgba[1], b: rgba[2], a: undefined };
        if (rgba[3] !== 1) {
            result.a = rgba[3];
        }
        return result;
    }
    invert() {
        const rgba = [0, 0, 0, 0];
        rgba[0] = 1 - this.#rgbaInternal[0];
        rgba[1] = 1 - this.#rgbaInternal[1];
        rgba[2] = 1 - this.#rgbaInternal[2];
        rgba[3] = this.#rgbaInternal[3];
        return new Legacy(rgba, "rgba" /* Format.RGBA */);
    }
    setAlpha(alpha) {
        const rgba = [...this.#rgbaInternal];
        rgba[3] = alpha;
        return new Legacy(rgba, "rgba" /* Format.RGBA */);
    }
    blendWith(fgColor) {
        const rgba = blendColors(fgColor.#rgbaInternal, this.#rgbaInternal);
        return new Legacy(rgba, "rgba" /* Format.RGBA */);
    }
    blendWithAlpha(alpha) {
        const rgba = [...this.#rgbaInternal];
        rgba[3] *= alpha;
        return new Legacy(rgba, "rgba" /* Format.RGBA */);
    }
    setFormat(format) {
        this.#formatInternal = format;
    }
    equal(other) {
        const legacy = other.as(this.#formatInternal);
        return equals(toRgbValue(this.#rgbaInternal[0]), toRgbValue(legacy.#rgbaInternal[0]), WIDE_RANGE_EPSILON) &&
            equals(toRgbValue(this.#rgbaInternal[1]), toRgbValue(legacy.#rgbaInternal[1]), WIDE_RANGE_EPSILON) &&
            equals(toRgbValue(this.#rgbaInternal[2]), toRgbValue(legacy.#rgbaInternal[2]), WIDE_RANGE_EPSILON) &&
            equals(this.#rgbaInternal[3], legacy.#rgbaInternal[3]);
    }
}
const COLOR_TO_RGBA_ENTRIES = [
    ['aliceblue', [240, 248, 255]],
    ['antiquewhite', [250, 235, 215]],
    ['aqua', [0, 255, 255]],
    ['aquamarine', [127, 255, 212]],
    ['azure', [240, 255, 255]],
    ['beige', [245, 245, 220]],
    ['bisque', [255, 228, 196]],
    ['black', [0, 0, 0]],
    ['blanchedalmond', [255, 235, 205]],
    ['blue', [0, 0, 255]],
    ['blueviolet', [138, 43, 226]],
    ['brown', [165, 42, 42]],
    ['burlywood', [222, 184, 135]],
    ['cadetblue', [95, 158, 160]],
    ['chartreuse', [127, 255, 0]],
    ['chocolate', [210, 105, 30]],
    ['coral', [255, 127, 80]],
    ['cornflowerblue', [100, 149, 237]],
    ['cornsilk', [255, 248, 220]],
    ['crimson', [237, 20, 61]],
    ['cyan', [0, 255, 255]],
    ['darkblue', [0, 0, 139]],
    ['darkcyan', [0, 139, 139]],
    ['darkgoldenrod', [184, 134, 11]],
    ['darkgray', [169, 169, 169]],
    ['darkgrey', [169, 169, 169]],
    ['darkgreen', [0, 100, 0]],
    ['darkkhaki', [189, 183, 107]],
    ['darkmagenta', [139, 0, 139]],
    ['darkolivegreen', [85, 107, 47]],
    ['darkorange', [255, 140, 0]],
    ['darkorchid', [153, 50, 204]],
    ['darkred', [139, 0, 0]],
    ['darksalmon', [233, 150, 122]],
    ['darkseagreen', [143, 188, 143]],
    ['darkslateblue', [72, 61, 139]],
    ['darkslategray', [47, 79, 79]],
    ['darkslategrey', [47, 79, 79]],
    ['darkturquoise', [0, 206, 209]],
    ['darkviolet', [148, 0, 211]],
    ['deeppink', [255, 20, 147]],
    ['deepskyblue', [0, 191, 255]],
    ['dimgray', [105, 105, 105]],
    ['dimgrey', [105, 105, 105]],
    ['dodgerblue', [30, 144, 255]],
    ['firebrick', [178, 34, 34]],
    ['floralwhite', [255, 250, 240]],
    ['forestgreen', [34, 139, 34]],
    ['fuchsia', [255, 0, 255]],
    ['gainsboro', [220, 220, 220]],
    ['ghostwhite', [248, 248, 255]],
    ['gold', [255, 215, 0]],
    ['goldenrod', [218, 165, 32]],
    ['gray', [128, 128, 128]],
    ['grey', [128, 128, 128]],
    ['green', [0, 128, 0]],
    ['greenyellow', [173, 255, 47]],
    ['honeydew', [240, 255, 240]],
    ['hotpink', [255, 105, 180]],
    ['indianred', [205, 92, 92]],
    ['indigo', [75, 0, 130]],
    ['ivory', [255, 255, 240]],
    ['khaki', [240, 230, 140]],
    ['lavender', [230, 230, 250]],
    ['lavenderblush', [255, 240, 245]],
    ['lawngreen', [124, 252, 0]],
    ['lemonchiffon', [255, 250, 205]],
    ['lightblue', [173, 216, 230]],
    ['lightcoral', [240, 128, 128]],
    ['lightcyan', [224, 255, 255]],
    ['lightgoldenrodyellow', [250, 250, 210]],
    ['lightgreen', [144, 238, 144]],
    ['lightgray', [211, 211, 211]],
    ['lightgrey', [211, 211, 211]],
    ['lightpink', [255, 182, 193]],
    ['lightsalmon', [255, 160, 122]],
    ['lightseagreen', [32, 178, 170]],
    ['lightskyblue', [135, 206, 250]],
    ['lightslategray', [119, 136, 153]],
    ['lightslategrey', [119, 136, 153]],
    ['lightsteelblue', [176, 196, 222]],
    ['lightyellow', [255, 255, 224]],
    ['lime', [0, 255, 0]],
    ['limegreen', [50, 205, 50]],
    ['linen', [250, 240, 230]],
    ['magenta', [255, 0, 255]],
    ['maroon', [128, 0, 0]],
    ['mediumaquamarine', [102, 205, 170]],
    ['mediumblue', [0, 0, 205]],
    ['mediumorchid', [186, 85, 211]],
    ['mediumpurple', [147, 112, 219]],
    ['mediumseagreen', [60, 179, 113]],
    ['mediumslateblue', [123, 104, 238]],
    ['mediumspringgreen', [0, 250, 154]],
    ['mediumturquoise', [72, 209, 204]],
    ['mediumvioletred', [199, 21, 133]],
    ['midnightblue', [25, 25, 112]],
    ['mintcream', [245, 255, 250]],
    ['mistyrose', [255, 228, 225]],
    ['moccasin', [255, 228, 181]],
    ['navajowhite', [255, 222, 173]],
    ['navy', [0, 0, 128]],
    ['oldlace', [253, 245, 230]],
    ['olive', [128, 128, 0]],
    ['olivedrab', [107, 142, 35]],
    ['orange', [255, 165, 0]],
    ['orangered', [255, 69, 0]],
    ['orchid', [218, 112, 214]],
    ['palegoldenrod', [238, 232, 170]],
    ['palegreen', [152, 251, 152]],
    ['paleturquoise', [175, 238, 238]],
    ['palevioletred', [219, 112, 147]],
    ['papayawhip', [255, 239, 213]],
    ['peachpuff', [255, 218, 185]],
    ['peru', [205, 133, 63]],
    ['pink', [255, 192, 203]],
    ['plum', [221, 160, 221]],
    ['powderblue', [176, 224, 230]],
    ['purple', [128, 0, 128]],
    ['rebeccapurple', [102, 51, 153]],
    ['red', [255, 0, 0]],
    ['rosybrown', [188, 143, 143]],
    ['royalblue', [65, 105, 225]],
    ['saddlebrown', [139, 69, 19]],
    ['salmon', [250, 128, 114]],
    ['sandybrown', [244, 164, 96]],
    ['seagreen', [46, 139, 87]],
    ['seashell', [255, 245, 238]],
    ['sienna', [160, 82, 45]],
    ['silver', [192, 192, 192]],
    ['skyblue', [135, 206, 235]],
    ['slateblue', [106, 90, 205]],
    ['slategray', [112, 128, 144]],
    ['slategrey', [112, 128, 144]],
    ['snow', [255, 250, 250]],
    ['springgreen', [0, 255, 127]],
    ['steelblue', [70, 130, 180]],
    ['tan', [210, 180, 140]],
    ['teal', [0, 128, 128]],
    ['thistle', [216, 191, 216]],
    ['tomato', [255, 99, 71]],
    ['turquoise', [64, 224, 208]],
    ['violet', [238, 130, 238]],
    ['wheat', [245, 222, 179]],
    ['white', [255, 255, 255]],
    ['whitesmoke', [245, 245, 245]],
    ['yellow', [255, 255, 0]],
    ['yellowgreen', [154, 205, 50]],
    ['transparent', [0, 0, 0, 0]],
];
const Nicknames = new Map(COLOR_TO_RGBA_ENTRIES);
const RGBAToNickname = new Map(
// Default opacity to 1 if the color only specified 3 channels
COLOR_TO_RGBA_ENTRIES.map(([nickname, [r, g, b, a = 1]]) => {
    return [String([r, g, b, a]), nickname];
}));
const LAYOUT_LINES_HIGHLIGHT_COLOR = [127, 32, 210];
({
    Content: Legacy.fromRGBA([111, 168, 220, .66]),
    ContentLight: Legacy.fromRGBA([111, 168, 220, .5]),
    ContentOutline: Legacy.fromRGBA([9, 83, 148]),
    Padding: Legacy.fromRGBA([147, 196, 125, .55]),
    PaddingLight: Legacy.fromRGBA([147, 196, 125, .4]),
    Border: Legacy.fromRGBA([255, 229, 153, .66]),
    BorderLight: Legacy.fromRGBA([255, 229, 153, .5]),
    Margin: Legacy.fromRGBA([246, 178, 107, .66]),
    MarginLight: Legacy.fromRGBA([246, 178, 107, .5]),
    EventTarget: Legacy.fromRGBA([255, 196, 196, .66]),
    Shape: Legacy.fromRGBA([96, 82, 177, 0.8]),
    ShapeMargin: Legacy.fromRGBA([96, 82, 127, .6]),
    CssGrid: Legacy.fromRGBA([0x4b, 0, 0x82, 1]),
    LayoutLine: Legacy.fromRGBA([...LAYOUT_LINES_HIGHLIGHT_COLOR, 1]),
    GridBorder: Legacy.fromRGBA([...LAYOUT_LINES_HIGHLIGHT_COLOR, 1]),
    GapBackground: Legacy.fromRGBA([...LAYOUT_LINES_HIGHLIGHT_COLOR, .3]),
    GapHatch: Legacy.fromRGBA([...LAYOUT_LINES_HIGHLIGHT_COLOR, .8]),
    GridAreaBorder: Legacy.fromRGBA([26, 115, 232, 1]),
});
({
    ParentOutline: Legacy.fromRGBA([224, 90, 183, 1]),
    ChildOutline: Legacy.fromRGBA([0, 120, 212, 1]),
});
({
    Resizer: Legacy.fromRGBA([222, 225, 230, 1]), // --color-background-elevation-2
    ResizerHandle: Legacy.fromRGBA([166, 166, 166, 1]),
    Mask: Legacy.fromRGBA([248, 249, 249, 1]),
});

// Copyright 2014 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
const UIStrings$2 = {
    /**
     *@description The UI destination when right clicking an item that can be revealed
     */
    elementsPanel: 'Elements panel',
    /**
     *@description The UI destination when right clicking an item that can be revealed
     */
    stylesSidebar: 'styles sidebar',
    /**
     *@description The UI destination when right clicking an item that can be revealed
     */
    changesDrawer: 'Changes drawer',
    /**
     *@description The UI destination when right clicking an item that can be revealed
     */
    issuesView: 'Issues view',
    /**
     *@description The UI destination when right clicking an item that can be revealed
     */
    networkPanel: 'Network panel',
    /**
     *@description The UI destination when right clicking an item that can be revealed
     */
    applicationPanel: 'Application panel',
    /**
     *@description The UI destination when right clicking an item that can be revealed
     */
    sourcesPanel: 'Sources panel',
    /**
     *@description The UI destination when right clicking an item that can be revealed
     */
    memoryInspectorPanel: 'Memory inspector panel',
    /**
     * @description The UI destination when revealing loaded resources through the Developer Resources Panel
     */
    developerResourcesPanel: 'Developer Resources panel',
};
const str_$2 = registerUIStrings('core/common/Revealer.ts', UIStrings$2);
const i18nLazyString$1 = getLazilyComputedLocalizedString.bind(undefined, str_$2);
({
    DEVELOPER_RESOURCES_PANEL: i18nLazyString$1(UIStrings$2.developerResourcesPanel),
    ELEMENTS_PANEL: i18nLazyString$1(UIStrings$2.elementsPanel),
    STYLES_SIDEBAR: i18nLazyString$1(UIStrings$2.stylesSidebar),
    CHANGES_DRAWER: i18nLazyString$1(UIStrings$2.changesDrawer),
    ISSUES_VIEW: i18nLazyString$1(UIStrings$2.issuesView),
    NETWORK_PANEL: i18nLazyString$1(UIStrings$2.networkPanel),
    APPLICATION_PANEL: i18nLazyString$1(UIStrings$2.applicationPanel),
    SOURCES_PANEL: i18nLazyString$1(UIStrings$2.sourcesPanel),
    MEMORY_INSPECTOR_PANEL: i18nLazyString$1(UIStrings$2.memoryInspectorPanel),
});

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
/**
 * http://tools.ietf.org/html/rfc3986#section-5.2.4
 */
function normalizePath(path) {
    if (path.indexOf('..') === -1 && path.indexOf('.') === -1) {
        return path;
    }
    // Remove leading slash (will be added back below) so we
    // can handle all (including empty) segments consistently.
    const segments = (path[0] === '/' ? path.substring(1) : path).split('/');
    const normalizedSegments = [];
    for (const segment of segments) {
        if (segment === '.') {
            continue;
        }
        else if (segment === '..') {
            normalizedSegments.pop();
        }
        else {
            normalizedSegments.push(segment);
        }
    }
    let normalizedPath = normalizedSegments.join('/');
    if (path[0] === '/' && normalizedPath) {
        normalizedPath = '/' + normalizedPath;
    }
    if (normalizedPath[normalizedPath.length - 1] !== '/' &&
        ((path[path.length - 1] === '/') || (segments[segments.length - 1] === '.') ||
            (segments[segments.length - 1] === '..'))) {
        normalizedPath = normalizedPath + '/';
    }
    return normalizedPath;
}
class ParsedURL {
    isValid;
    url;
    scheme;
    user;
    host;
    port;
    path;
    queryParams;
    fragment;
    folderPathComponents;
    lastPathComponent;
    blobInnerScheme;
    #displayNameInternal;
    #dataURLDisplayNameInternal;
    constructor(url) {
        this.isValid = false;
        this.url = url;
        this.scheme = '';
        this.user = '';
        this.host = '';
        this.port = '';
        this.path = '';
        this.queryParams = '';
        this.fragment = '';
        this.folderPathComponents = '';
        this.lastPathComponent = '';
        const isBlobUrl = this.url.startsWith('blob:');
        const urlToMatch = isBlobUrl ? url.substring(5) : url;
        const match = urlToMatch.match(ParsedURL.urlRegex());
        if (match) {
            this.isValid = true;
            if (isBlobUrl) {
                this.blobInnerScheme = match[2].toLowerCase();
                this.scheme = 'blob';
            }
            else {
                this.scheme = match[2].toLowerCase();
            }
            this.user = match[3] ?? '';
            this.host = match[4] ?? '';
            this.port = match[5] ?? '';
            this.path = match[6] ?? '/';
            this.queryParams = match[7] ?? '';
            this.fragment = match[8] ?? '';
        }
        else {
            if (this.url.startsWith('data:')) {
                this.scheme = 'data';
                return;
            }
            if (this.url.startsWith('blob:')) {
                this.scheme = 'blob';
                return;
            }
            if (this.url === 'about:blank') {
                this.scheme = 'about';
                return;
            }
            this.path = this.url;
        }
        const lastSlashExceptTrailingIndex = this.path.lastIndexOf('/', this.path.length - 2);
        if (lastSlashExceptTrailingIndex !== -1) {
            this.lastPathComponent = this.path.substring(lastSlashExceptTrailingIndex + 1);
        }
        else {
            this.lastPathComponent = this.path;
        }
        const lastSlashIndex = this.path.lastIndexOf('/');
        if (lastSlashIndex !== -1) {
            this.folderPathComponents = this.path.substring(0, lastSlashIndex);
        }
    }
    static fromString(string) {
        const parsedURL = new ParsedURL(string.toString());
        if (parsedURL.isValid) {
            return parsedURL;
        }
        return null;
    }
    static preEncodeSpecialCharactersInPath(path) {
        // Based on net::FilePathToFileURL. Ideally we would handle
        // '\\' as well on non-Windows file systems.
        for (const specialChar of ['%', ';', '#', '?', ' ']) {
            path = path.replaceAll(specialChar, encodeURIComponent(specialChar));
        }
        return path;
    }
    static rawPathToEncodedPathString(path) {
        const partiallyEncoded = ParsedURL.preEncodeSpecialCharactersInPath(path);
        if (path.startsWith('/')) {
            return new URL(partiallyEncoded, 'file:///').pathname;
        }
        // URL prepends a '/'
        return new URL('/' + partiallyEncoded, 'file:///').pathname.substr(1);
    }
    /**
     * @param name Must not be encoded
     */
    static encodedFromParentPathAndName(parentPath, name) {
        return ParsedURL.concatenate(parentPath, '/', ParsedURL.preEncodeSpecialCharactersInPath(name));
    }
    /**
     * @param name Must not be encoded
     */
    static urlFromParentUrlAndName(parentUrl, name) {
        return ParsedURL.concatenate(parentUrl, '/', ParsedURL.preEncodeSpecialCharactersInPath(name));
    }
    static encodedPathToRawPathString(encPath) {
        return decodeURIComponent(encPath);
    }
    static rawPathToUrlString(fileSystemPath) {
        let preEncodedPath = ParsedURL.preEncodeSpecialCharactersInPath(fileSystemPath.replace(/\\/g, '/'));
        preEncodedPath = preEncodedPath.replace(/\\/g, '/');
        if (!preEncodedPath.startsWith('file://')) {
            if (preEncodedPath.startsWith('/')) {
                preEncodedPath = 'file://' + preEncodedPath;
            }
            else {
                preEncodedPath = 'file:///' + preEncodedPath;
            }
        }
        return new URL(preEncodedPath).toString();
    }
    static relativePathToUrlString(relativePath, baseURL) {
        const preEncodedPath = ParsedURL.preEncodeSpecialCharactersInPath(relativePath.replace(/\\/g, '/'));
        return new URL(preEncodedPath, baseURL).toString();
    }
    static urlToRawPathString(fileURL, isWindows) {
        const decodedFileURL = decodeURIComponent(fileURL);
        if (isWindows) {
            return decodedFileURL.substr('file:///'.length).replace(/\//g, '\\');
        }
        return decodedFileURL.substr('file://'.length);
    }
    static sliceUrlToEncodedPathString(url, start) {
        return url.substring(start);
    }
    static substr(devToolsPath, from, length) {
        return devToolsPath.substr(from, length);
    }
    static substring(devToolsPath, start, end) {
        return devToolsPath.substring(start, end);
    }
    static prepend(prefix, devToolsPath) {
        return prefix + devToolsPath;
    }
    static concatenate(devToolsPath, ...appendage) {
        return devToolsPath.concat(...appendage);
    }
    static trim(devToolsPath) {
        return devToolsPath.trim();
    }
    static slice(devToolsPath, start, end) {
        return devToolsPath.slice(start, end);
    }
    static join(devToolsPaths, separator) {
        return devToolsPaths.join(separator);
    }
    static split(devToolsPath, separator, limit) {
        return devToolsPath.split(separator, limit);
    }
    static toLowerCase(devToolsPath) {
        return devToolsPath.toLowerCase();
    }
    static isValidUrlString(str) {
        return new ParsedURL(str).isValid;
    }
    static urlWithoutHash(url) {
        const hashIndex = url.indexOf('#');
        if (hashIndex !== -1) {
            return url.substr(0, hashIndex);
        }
        return url;
    }
    static urlRegex() {
        if (ParsedURL.urlRegexInstance) {
            return ParsedURL.urlRegexInstance;
        }
        // RegExp groups:
        // 1 - scheme, hostname, ?port
        // 2 - scheme (using the RFC3986 grammar)
        // 3 - ?user:password
        // 4 - hostname
        // 5 - ?port
        // 6 - ?path
        // 7 - ?query
        // 8 - ?fragment
        const schemeRegex = /([A-Za-z][A-Za-z0-9+.-]*):\/\//;
        const userRegex = /(?:([A-Za-z0-9\-._~%!$&'()*+,;=:]*)@)?/;
        const hostRegex = /((?:\[::\d?\])|(?:[^\s\/:]*))/;
        const portRegex = /(?::([\d]+))?/;
        const pathRegex = /(\/[^#?]*)?/;
        const queryRegex = /(?:\?([^#]*))?/;
        const fragmentRegex = /(?:#(.*))?/;
        ParsedURL.urlRegexInstance = new RegExp('^(' + schemeRegex.source + userRegex.source + hostRegex.source + portRegex.source + ')' + pathRegex.source +
            queryRegex.source + fragmentRegex.source + '$');
        return ParsedURL.urlRegexInstance;
    }
    static extractPath(url) {
        const parsedURL = this.fromString(url);
        return (parsedURL ? parsedURL.path : '');
    }
    static extractOrigin(url) {
        const parsedURL = this.fromString(url);
        return parsedURL ? parsedURL.securityOrigin() : EmptyUrlString;
    }
    static extractExtension(url) {
        url = ParsedURL.urlWithoutHash(url);
        const indexOfQuestionMark = url.indexOf('?');
        if (indexOfQuestionMark !== -1) {
            url = url.substr(0, indexOfQuestionMark);
        }
        const lastIndexOfSlash = url.lastIndexOf('/');
        if (lastIndexOfSlash !== -1) {
            url = url.substr(lastIndexOfSlash + 1);
        }
        const lastIndexOfDot = url.lastIndexOf('.');
        if (lastIndexOfDot !== -1) {
            url = url.substr(lastIndexOfDot + 1);
            const lastIndexOfPercent = url.indexOf('%');
            if (lastIndexOfPercent !== -1) {
                return url.substr(0, lastIndexOfPercent);
            }
            return url;
        }
        return '';
    }
    static extractName(url) {
        let index = url.lastIndexOf('/');
        const pathAndQuery = index !== -1 ? url.substr(index + 1) : url;
        index = pathAndQuery.indexOf('?');
        return index < 0 ? pathAndQuery : pathAndQuery.substr(0, index);
    }
    static completeURL(baseURL, href) {
        // Return special URLs as-is.
        const trimmedHref = href.trim();
        if (trimmedHref.startsWith('data:') || trimmedHref.startsWith('blob:') || trimmedHref.startsWith('javascript:') ||
            trimmedHref.startsWith('mailto:')) {
            return href;
        }
        // Return absolute URLs with normalized path and other components as-is.
        const parsedHref = this.fromString(trimmedHref);
        if (parsedHref && parsedHref.scheme) {
            const securityOrigin = parsedHref.securityOrigin();
            const pathText = normalizePath(parsedHref.path);
            const queryText = parsedHref.queryParams && `?${parsedHref.queryParams}`;
            const fragmentText = parsedHref.fragment && `#${parsedHref.fragment}`;
            return securityOrigin + pathText + queryText + fragmentText;
        }
        const parsedURL = this.fromString(baseURL);
        if (!parsedURL) {
            return null;
        }
        if (parsedURL.isDataURL()) {
            return href;
        }
        if (href.length > 1 && href.charAt(0) === '/' && href.charAt(1) === '/') {
            // href starts with "//" which is a full URL with the protocol dropped (use the baseURL protocol).
            return parsedURL.scheme + ':' + href;
        }
        const securityOrigin = parsedURL.securityOrigin();
        const pathText = parsedURL.path;
        const queryText = parsedURL.queryParams ? '?' + parsedURL.queryParams : '';
        // Empty href resolves to a URL without fragment.
        if (!href.length) {
            return securityOrigin + pathText + queryText;
        }
        if (href.charAt(0) === '#') {
            return securityOrigin + pathText + queryText + href;
        }
        if (href.charAt(0) === '?') {
            return securityOrigin + pathText + href;
        }
        const hrefMatches = href.match(/^[^#?]*/);
        if (!hrefMatches || !href.length) {
            throw new Error('Invalid href');
        }
        let hrefPath = hrefMatches[0];
        const hrefSuffix = href.substring(hrefPath.length);
        if (hrefPath.charAt(0) !== '/') {
            hrefPath = parsedURL.folderPathComponents + '/' + hrefPath;
        }
        return securityOrigin + normalizePath(hrefPath) + hrefSuffix;
    }
    static splitLineAndColumn(string) {
        // Only look for line and column numbers in the path to avoid matching port numbers.
        const beforePathMatch = string.match(ParsedURL.urlRegex());
        let beforePath = '';
        let pathAndAfter = string;
        if (beforePathMatch) {
            beforePath = beforePathMatch[1];
            pathAndAfter = string.substring(beforePathMatch[1].length);
        }
        const lineColumnRegEx = /(?::(\d+))?(?::(\d+))?$/;
        const lineColumnMatch = lineColumnRegEx.exec(pathAndAfter);
        let lineNumber;
        let columnNumber;
        if (!lineColumnMatch) {
            return { url: string, lineNumber: 0, columnNumber: 0 };
        }
        if (typeof (lineColumnMatch[1]) === 'string') {
            lineNumber = parseInt(lineColumnMatch[1], 10);
            // Immediately convert line and column to 0-based numbers.
            lineNumber = isNaN(lineNumber) ? undefined : lineNumber - 1;
        }
        if (typeof (lineColumnMatch[2]) === 'string') {
            columnNumber = parseInt(lineColumnMatch[2], 10);
            columnNumber = isNaN(columnNumber) ? undefined : columnNumber - 1;
        }
        let url = beforePath + pathAndAfter.substring(0, pathAndAfter.length - lineColumnMatch[0].length);
        if (lineColumnMatch[1] === undefined && lineColumnMatch[2] === undefined) {
            const wasmCodeOffsetRegex = /wasm-function\[\d+\]:0x([a-z0-9]+)$/g;
            const wasmCodeOffsetMatch = wasmCodeOffsetRegex.exec(pathAndAfter);
            if (wasmCodeOffsetMatch && typeof (wasmCodeOffsetMatch[1]) === 'string') {
                url = ParsedURL.removeWasmFunctionInfoFromURL(url);
                columnNumber = parseInt(wasmCodeOffsetMatch[1], 16);
                columnNumber = isNaN(columnNumber) ? undefined : columnNumber;
            }
        }
        return { url, lineNumber, columnNumber };
    }
    static removeWasmFunctionInfoFromURL(url) {
        const wasmFunctionRegEx = /:wasm-function\[\d+\]/;
        const wasmFunctionIndex = url.search(wasmFunctionRegEx);
        if (wasmFunctionIndex === -1) {
            return url;
        }
        return ParsedURL.substring(url, 0, wasmFunctionIndex);
    }
    static beginsWithWindowsDriveLetter(url) {
        return /^[A-Za-z]:/.test(url);
    }
    static beginsWithScheme(url) {
        return /^[A-Za-z][A-Za-z0-9+.-]*:/.test(url);
    }
    static isRelativeURL(url) {
        return !this.beginsWithScheme(url) || this.beginsWithWindowsDriveLetter(url);
    }
    get displayName() {
        if (this.#displayNameInternal) {
            return this.#displayNameInternal;
        }
        if (this.isDataURL()) {
            return this.dataURLDisplayName();
        }
        if (this.isBlobURL()) {
            return this.url;
        }
        if (this.isAboutBlank()) {
            return this.url;
        }
        this.#displayNameInternal = this.lastPathComponent;
        if (!this.#displayNameInternal) {
            this.#displayNameInternal = (this.host || '') + '/';
        }
        if (this.#displayNameInternal === '/') {
            this.#displayNameInternal = this.url;
        }
        return this.#displayNameInternal;
    }
    dataURLDisplayName() {
        if (this.#dataURLDisplayNameInternal) {
            return this.#dataURLDisplayNameInternal;
        }
        if (!this.isDataURL()) {
            return '';
        }
        this.#dataURLDisplayNameInternal = trimEndWithMaxLength(this.url, 20);
        return this.#dataURLDisplayNameInternal;
    }
    isAboutBlank() {
        return this.url === 'about:blank';
    }
    isDataURL() {
        return this.scheme === 'data';
    }
    isHttpOrHttps() {
        return this.scheme === 'http' || this.scheme === 'https';
    }
    isBlobURL() {
        return this.url.startsWith('blob:');
    }
    lastPathComponentWithFragment() {
        return this.lastPathComponent + (this.fragment ? '#' + this.fragment : '');
    }
    domain() {
        if (this.isDataURL()) {
            return 'data:';
        }
        return this.host + (this.port ? ':' + this.port : '');
    }
    securityOrigin() {
        if (this.isDataURL()) {
            return 'data:';
        }
        const scheme = this.isBlobURL() ? this.blobInnerScheme : this.scheme;
        return scheme + '://' + this.domain();
    }
    urlWithoutScheme() {
        if (this.scheme && this.url.startsWith(this.scheme + '://')) {
            return this.url.substring(this.scheme.length + 3);
        }
        return this.url;
    }
    static urlRegexInstance = null;
}

// Copyright 2021 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
/*
 * Copyright (C) 2012 Google Inc.  All rights reserved.
 * Copyright (C) 2007, 2008 Apple Inc.  All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions
 * are met:
 *
 * 1.  Redistributions of source code must retain the above copyright
 *     notice, this list of conditions and the following disclaimer.
 * 2.  Redistributions in binary form must reproduce the above copyright
 *     notice, this list of conditions and the following disclaimer in the
 *     documentation and/or other materials provided with the distribution.
 * 3.  Neither the name of Apple Computer, Inc. ("Apple") nor the names of
 *     its contributors may be used to endorse or promote products derived
 *     from this software without specific prior written permission.
 *
 * THIS SOFTWARE IS PROVIDED BY APPLE AND ITS CONTRIBUTORS "AS IS" AND ANY
 * EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
 * WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
 * DISCLAIMED. IN NO EVENT SHALL APPLE OR ITS CONTRIBUTORS BE LIABLE FOR ANY
 * DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
 * (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
 * LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
 * ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
 * (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF
 * THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */
const UIStrings$1 = {
    /**
     *@description Text that appears in a tooltip the fetch and xhr resource types filter.
     */
    fetchAndXHR: '`Fetch` and `XHR`',
    /**
     *@description Text that appears in a tooltip for the JavaScript types filter.
     */
    javascript: 'JavaScript',
    /**
     *@description Text that appears on a button for the JavaScript resource type filter.
     */
    js: 'JS',
    /**
     *@description Text that appears on a button for the css resource type filter.
     */
    css: 'CSS',
    /**
     *@description Text that appears on a button for the image resource type filter.
     */
    img: 'Img',
    /**
     *@description Text that appears on a button for the media resource type filter.
     */
    media: 'Media',
    /**
     *@description Text that appears on a button for the font resource type filter.
     */
    font: 'Font',
    /**
     *@description Text that appears on a button for the document resource type filter.
     */
    doc: 'Doc',
    /**
     *@description Text that appears on a button for the websocket resource type filter.
     */
    ws: 'WS',
    /**
     *@description Text that appears in a tooltip for the WebAssembly types filter.
     */
    webassembly: 'WebAssembly',
    /**
     *@description Text that appears on a button for the WebAssembly resource type filter.
     */
    wasm: 'Wasm',
    /**
     *@description Text that appears on a button for the manifest resource type filter.
     */
    manifest: 'Manifest',
    /**
     *@description Text for other types of items
     */
    other: 'Other',
    /**
     *@description Name of a network resource type
     */
    document: 'Document',
    /**
     *@description Name of a network resource type
     */
    stylesheet: 'Stylesheet',
    /**
     *@description Text in Image View of the Sources panel
     */
    image: 'Image',
    /**
     *@description Label for a group of JavaScript files
     */
    script: 'Script',
    /**
     *@description Name of a network resource type
     */
    texttrack: 'TextTrack',
    /**
     *@description Name of a network resource type
     */
    fetch: 'Fetch',
    /**
     *@description Name of a network resource type
     */
    eventsource: 'EventSource',
    /**
     *@description Name of a network resource type
     */
    websocket: 'WebSocket',
    /**
     *@description Name of a network resource type
     */
    webtransport: 'WebTransport',
    /**
     *@description Name of a network resource type
     */
    signedexchange: 'SignedExchange',
    /**
     *@description Name of a network resource type
     */
    ping: 'Ping',
    /**
     *@description Name of a network resource type
     */
    cspviolationreport: 'CSPViolationReport',
    /**
     *@description Name of a network initiator type
     */
    preflight: 'Preflight',
    /**
     *@description Name of a network initiator type
     */
    webbundle: 'WebBundle',
};
const str_$1 = registerUIStrings('core/common/ResourceType.ts', UIStrings$1);
const i18nLazyString = getLazilyComputedLocalizedString.bind(undefined, str_$1);
class ResourceType {
    #nameInternal;
    #titleInternal;
    #categoryInternal;
    #isTextTypeInternal;
    constructor(name, title, category, isTextType) {
        this.#nameInternal = name;
        this.#titleInternal = title;
        this.#categoryInternal = category;
        this.#isTextTypeInternal = isTextType;
    }
    static fromMimeType(mimeType) {
        if (!mimeType) {
            return resourceTypes.Other;
        }
        if (mimeType.startsWith('text/html')) {
            return resourceTypes.Document;
        }
        if (mimeType.startsWith('text/css')) {
            return resourceTypes.Stylesheet;
        }
        if (mimeType.startsWith('image/')) {
            return resourceTypes.Image;
        }
        if (mimeType.startsWith('text/')) {
            return resourceTypes.Script;
        }
        if (mimeType.includes('font')) {
            return resourceTypes.Font;
        }
        if (mimeType.includes('script')) {
            return resourceTypes.Script;
        }
        if (mimeType.includes('octet')) {
            return resourceTypes.Other;
        }
        if (mimeType.includes('application')) {
            return resourceTypes.Script;
        }
        return resourceTypes.Other;
    }
    static fromMimeTypeOverride(mimeType) {
        if (mimeType === 'application/manifest+json') {
            return resourceTypes.Manifest;
        }
        if (mimeType === 'application/wasm') {
            return resourceTypes.Wasm;
        }
        if (mimeType === 'application/webbundle') {
            return resourceTypes.WebBundle;
        }
        return null;
    }
    static fromURL(url) {
        return resourceTypeByExtension.get(ParsedURL.extractExtension(url)) || null;
    }
    static fromName(name) {
        for (const resourceTypeId in resourceTypes) {
            const resourceType = resourceTypes[resourceTypeId];
            if (resourceType.name() === name) {
                return resourceType;
            }
        }
        return null;
    }
    static mimeFromURL(url) {
        const name = ParsedURL.extractName(url);
        if (mimeTypeByName.has(name)) {
            return mimeTypeByName.get(name);
        }
        let ext = ParsedURL.extractExtension(url).toLowerCase();
        if (ext === 'html' && name.endsWith('.component.html')) {
            ext = 'component.html';
        }
        return mimeTypeByExtension.get(ext);
    }
    static mimeFromExtension(ext) {
        return mimeTypeByExtension.get(ext);
    }
    static simplifyContentType(contentType) {
        const regex = new RegExp('^application(.*json$|\/json\+.*)');
        return regex.test(contentType) ? 'application/json' : contentType;
    }
    /**
     * Adds suffixes iff the mimeType is 'text/javascript' to denote whether the JS is minified or from
     * a source map.
     */
    static mediaTypeForMetrics(mimeType, isFromSourceMap, isMinified) {
        if (mimeType !== 'text/javascript') {
            return mimeType;
        }
        if (isFromSourceMap) {
            // SourceMap has precedence as that is a known fact, whereas minification is a heuristic we
            // apply to the JS content.
            return 'text/javascript+sourcemapped';
        }
        if (isMinified) {
            return 'text/javascript+minified';
        }
        return 'text/javascript+plain';
    }
    name() {
        return this.#nameInternal;
    }
    title() {
        return this.#titleInternal();
    }
    category() {
        return this.#categoryInternal;
    }
    isTextType() {
        return this.#isTextTypeInternal;
    }
    isScript() {
        return this.#nameInternal === 'script' || this.#nameInternal === 'sm-script';
    }
    hasScripts() {
        return this.isScript() || this.isDocument();
    }
    isStyleSheet() {
        return this.#nameInternal === 'stylesheet' || this.#nameInternal === 'sm-stylesheet';
    }
    hasStyleSheets() {
        return this.isStyleSheet() || this.isDocument();
    }
    isDocument() {
        return this.#nameInternal === 'document';
    }
    isDocumentOrScriptOrStyleSheet() {
        return this.isDocument() || this.isScript() || this.isStyleSheet();
    }
    isFont() {
        return this.#nameInternal === 'font';
    }
    isImage() {
        return this.#nameInternal === 'image';
    }
    isFromSourceMap() {
        return this.#nameInternal.startsWith('sm-');
    }
    isWebbundle() {
        return this.#nameInternal === 'webbundle';
    }
    toString() {
        return this.#nameInternal;
    }
    canonicalMimeType() {
        if (this.isDocument()) {
            return 'text/html';
        }
        if (this.isScript()) {
            return 'text/javascript';
        }
        if (this.isStyleSheet()) {
            return 'text/css';
        }
        return '';
    }
}
class ResourceCategory {
    title;
    shortTitle;
    constructor(title, shortTitle) {
        this.title = title;
        this.shortTitle = shortTitle;
    }
    static categoryByTitle(title) {
        const allCategories = Object.values(resourceCategories);
        return allCategories.find(category => category.title() === title) || null;
    }
}
const resourceCategories = {
    XHR: new ResourceCategory(i18nLazyString(UIStrings$1.fetchAndXHR), lockedLazyString('Fetch/XHR')),
    Document: new ResourceCategory(i18nLazyString(UIStrings$1.document), i18nLazyString(UIStrings$1.doc)),
    Stylesheet: new ResourceCategory(i18nLazyString(UIStrings$1.css), i18nLazyString(UIStrings$1.css)),
    Script: new ResourceCategory(i18nLazyString(UIStrings$1.javascript), i18nLazyString(UIStrings$1.js)),
    Font: new ResourceCategory(i18nLazyString(UIStrings$1.font), i18nLazyString(UIStrings$1.font)),
    Image: new ResourceCategory(i18nLazyString(UIStrings$1.image), i18nLazyString(UIStrings$1.img)),
    Media: new ResourceCategory(i18nLazyString(UIStrings$1.media), i18nLazyString(UIStrings$1.media)),
    Manifest: new ResourceCategory(i18nLazyString(UIStrings$1.manifest), i18nLazyString(UIStrings$1.manifest)),
    WebSocket: new ResourceCategory(i18nLazyString(UIStrings$1.websocket), i18nLazyString(UIStrings$1.ws)),
    Wasm: new ResourceCategory(i18nLazyString(UIStrings$1.webassembly), i18nLazyString(UIStrings$1.wasm)),
    Other: new ResourceCategory(i18nLazyString(UIStrings$1.other), i18nLazyString(UIStrings$1.other)),
};
/**
 * This enum is a superset of all types defined in WebCore::InspectorPageAgent::resourceTypeJson
 * For DevTools-only types that are based on MIME-types that are backed by other request types
 * (for example Wasm that is based on Fetch), additional types are added here.
 * For these types, make sure to update `fromMimeTypeOverride` to implement the custom logic.
 */
const resourceTypes = {
    Document: new ResourceType('document', i18nLazyString(UIStrings$1.document), resourceCategories.Document, true),
    Stylesheet: new ResourceType('stylesheet', i18nLazyString(UIStrings$1.stylesheet), resourceCategories.Stylesheet, true),
    Image: new ResourceType('image', i18nLazyString(UIStrings$1.image), resourceCategories.Image, false),
    Media: new ResourceType('media', i18nLazyString(UIStrings$1.media), resourceCategories.Media, false),
    Font: new ResourceType('font', i18nLazyString(UIStrings$1.font), resourceCategories.Font, false),
    Script: new ResourceType('script', i18nLazyString(UIStrings$1.script), resourceCategories.Script, true),
    TextTrack: new ResourceType('texttrack', i18nLazyString(UIStrings$1.texttrack), resourceCategories.Other, true),
    XHR: new ResourceType('xhr', lockedLazyString('XHR'), resourceCategories.XHR, true),
    Fetch: new ResourceType('fetch', i18nLazyString(UIStrings$1.fetch), resourceCategories.XHR, true),
    Prefetch: new ResourceType('prefetch', lockedLazyString('Prefetch'), resourceCategories.Document, true),
    EventSource: new ResourceType('eventsource', i18nLazyString(UIStrings$1.eventsource), resourceCategories.XHR, true),
    WebSocket: new ResourceType('websocket', i18nLazyString(UIStrings$1.websocket), resourceCategories.WebSocket, false),
    // TODO(yoichio): Consider creating new category WT or WS/WT with WebSocket.
    WebTransport: new ResourceType('webtransport', i18nLazyString(UIStrings$1.webtransport), resourceCategories.WebSocket, false),
    Wasm: new ResourceType('wasm', i18nLazyString(UIStrings$1.wasm), resourceCategories.Wasm, false),
    Manifest: new ResourceType('manifest', i18nLazyString(UIStrings$1.manifest), resourceCategories.Manifest, true),
    SignedExchange: new ResourceType('signed-exchange', i18nLazyString(UIStrings$1.signedexchange), resourceCategories.Other, false),
    Ping: new ResourceType('ping', i18nLazyString(UIStrings$1.ping), resourceCategories.Other, false),
    CSPViolationReport: new ResourceType('csp-violation-report', i18nLazyString(UIStrings$1.cspviolationreport), resourceCategories.Other, false),
    Other: new ResourceType('other', i18nLazyString(UIStrings$1.other), resourceCategories.Other, false),
    Preflight: new ResourceType('preflight', i18nLazyString(UIStrings$1.preflight), resourceCategories.Other, true),
    SourceMapScript: new ResourceType('sm-script', i18nLazyString(UIStrings$1.script), resourceCategories.Script, true),
    SourceMapStyleSheet: new ResourceType('sm-stylesheet', i18nLazyString(UIStrings$1.stylesheet), resourceCategories.Stylesheet, true),
    WebBundle: new ResourceType('webbundle', i18nLazyString(UIStrings$1.webbundle), resourceCategories.Other, false),
};
const mimeTypeByName = new Map([
    // CoffeeScript
    ['Cakefile', 'text/x-coffeescript'],
]);
// clang-format off
const resourceTypeByExtension = new Map([
    ['js', resourceTypes.Script],
    ['mjs', resourceTypes.Script],
    ['css', resourceTypes.Stylesheet],
    ['xsl', resourceTypes.Stylesheet],
    ['avif', resourceTypes.Image],
    ['bmp', resourceTypes.Image],
    ['gif', resourceTypes.Image],
    ['ico', resourceTypes.Image],
    ['jpeg', resourceTypes.Image],
    ['jpg', resourceTypes.Image],
    ['jxl', resourceTypes.Image],
    ['png', resourceTypes.Image],
    ['svg', resourceTypes.Image],
    ['tif', resourceTypes.Image],
    ['tiff', resourceTypes.Image],
    ['vue', resourceTypes.Document],
    ['webmanifest', resourceTypes.Manifest],
    ['webp', resourceTypes.Media],
    ['otf', resourceTypes.Font],
    ['ttc', resourceTypes.Font],
    ['ttf', resourceTypes.Font],
    ['woff', resourceTypes.Font],
    ['woff2', resourceTypes.Font],
    ['wasm', resourceTypes.Wasm],
]);
// clang-format on
const mimeTypeByExtension = new Map([
    // Web extensions
    ['js', 'text/javascript'],
    ['mjs', 'text/javascript'],
    ['css', 'text/css'],
    ['html', 'text/html'],
    ['htm', 'text/html'],
    ['xml', 'application/xml'],
    ['xsl', 'application/xml'],
    ['wasm', 'application/wasm'],
    ['webmanifest', 'application/manifest+json'],
    // HTML Embedded Scripts, ASP], JSP
    ['asp', 'application/x-aspx'],
    ['aspx', 'application/x-aspx'],
    ['jsp', 'application/x-jsp'],
    // C/C++
    ['c', 'text/x-c++src'],
    ['cc', 'text/x-c++src'],
    ['cpp', 'text/x-c++src'],
    ['h', 'text/x-c++src'],
    ['m', 'text/x-c++src'],
    ['mm', 'text/x-c++src'],
    // CoffeeScript
    ['coffee', 'text/x-coffeescript'],
    // Dart
    ['dart', 'application/vnd.dart'],
    // TypeScript
    ['ts', 'text/typescript'],
    ['tsx', 'text/typescript-jsx'],
    // JSON
    ['json', 'application/json'],
    ['gyp', 'application/json'],
    ['gypi', 'application/json'],
    ['map', 'application/json'],
    // C#
    ['cs', 'text/x-csharp'],
    // Go
    ['go', 'text/x-go'],
    // Java
    ['java', 'text/x-java'],
    // Kotlin
    ['kt', 'text/x-kotlin'],
    // Scala
    ['scala', 'text/x-scala'],
    // Less
    ['less', 'text/x-less'],
    // PHP
    ['php', 'application/x-httpd-php'],
    ['phtml', 'application/x-httpd-php'],
    // Python
    ['py', 'text/x-python'],
    // Shell
    ['sh', 'text/x-sh'],
    // Google Stylesheets (GSS)
    ['gss', 'text/x-gss'],
    // SASS (.sass & .scss)
    ['sass', 'text/x-sass'],
    ['scss', 'text/x-scss'],
    // Video Text Tracks.
    ['vtt', 'text/vtt'],
    // LiveScript
    ['ls', 'text/x-livescript'],
    // Markdown
    ['md', 'text/markdown'],
    // ClojureScript
    ['cljs', 'text/x-clojure'],
    ['cljc', 'text/x-clojure'],
    ['cljx', 'text/x-clojure'],
    // Stylus
    ['styl', 'text/x-styl'],
    // JSX
    ['jsx', 'text/jsx'],
    // Image
    ['avif', 'image/avif'],
    ['bmp', 'image/bmp'],
    ['gif', 'image/gif'],
    ['ico', 'image/ico'],
    ['jpeg', 'image/jpeg'],
    ['jpg', 'image/jpeg'],
    ['jxl', 'image/jxl'],
    ['png', 'image/png'],
    ['svg', 'image/svg+xml'],
    ['tif', 'image/tif'],
    ['tiff', 'image/tiff'],
    ['webp', 'image/webp'],
    // Font
    ['otf', 'font/otf'],
    ['ttc', 'font/collection'],
    ['ttf', 'font/ttf'],
    ['woff', 'font/woff'],
    ['woff2', 'font/woff2'],
    // Angular
    ['component.html', 'text/x.angular'],
    // Svelte
    ['svelte', 'text/x.svelte'],
    // Vue
    ['vue', 'text/x.vue'],
]);

// Copyright 2020 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
const UIStrings = {
    /**
     *@description Title of the Elements Panel
     */
    elements: 'Elements',
    /**
     *@description Text for DevTools appearance
     */
    appearance: 'Appearance',
    /**
     *@description Name of the Sources panel
     */
    sources: 'Sources',
    /**
     *@description Title of the Network tool
     */
    network: 'Network',
    /**
     *@description Text for the performance of something
     */
    performance: 'Performance',
    /**
     *@description Title of the Console tool
     */
    console: 'Console',
    /**
     *@description A title of the 'Persistence' setting category
     */
    persistence: 'Persistence',
    /**
     *@description Text that refers to the debugger
     */
    debugger: 'Debugger',
    /**
     *@description Text describing global shortcuts and settings that are available throughout the DevTools
     */
    global: 'Global',
    /**
     *@description Title of the Rendering tool
     */
    rendering: 'Rendering',
    /**
     *@description Title of a section on CSS Grid tooling
     */
    grid: 'Grid',
    /**
     *@description Text for the mobile platform, as opposed to desktop
     */
    mobile: 'Mobile',
    /**
     *@description Text for the memory of the page
     */
    memory: 'Memory',
    /**
     *@description Text for the extension of the page
     */
    extension: 'Extension',
    /**
     *@description Text for the adorner of the page
     */
    adorner: 'Adorner',
    /**
     * @description Header for the "Sync" section in the settings UI. The "Sync"
     * section allows users to configure which DevTools data is synced via Chrome Sync.
     */
    sync: 'Sync',
};
const str_ = registerUIStrings('core/common/SettingRegistration.ts', UIStrings);
getLocalizedString.bind(undefined, str_);

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
class HeapSnapshotLoader {
    #progress;
    #buffer;
    #dataCallback;
    #done;
    // TODO(crbug.com/1172300) Ignored during the jsdoc to ts migration)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    #snapshot;
    #array;
    #arrayIndex;
    #json = '';
    constructor(dispatcher) {
        this.#reset();
        this.#progress = new HeapSnapshotProgress(dispatcher);
        this.#buffer = [];
        this.#dataCallback = null;
        this.#done = false;
        void this.#parseInput();
    }
    dispose() {
        this.#reset();
    }
    #reset() {
        this.#json = '';
        this.#snapshot = undefined;
    }
    close() {
        this.#done = true;
        if (this.#dataCallback) {
            this.#dataCallback('');
        }
    }
    buildSnapshot(options) {
        this.#snapshot = this.#snapshot || {};
        this.#progress.updateStatus('Processing snapshot…');
        const result = new JSHeapSnapshot(this.#snapshot, this.#progress, options);
        this.#reset();
        return result;
    }
    #parseUintArray() {
        let index = 0;
        const char0 = '0'.charCodeAt(0);
        const char9 = '9'.charCodeAt(0);
        const closingBracket = ']'.charCodeAt(0);
        const length = this.#json.length;
        while (true) {
            while (index < length) {
                const code = this.#json.charCodeAt(index);
                if (char0 <= code && code <= char9) {
                    break;
                }
                else if (code === closingBracket) {
                    this.#json = this.#json.slice(index + 1);
                    return false;
                }
                ++index;
            }
            if (index === length) {
                this.#json = '';
                return true;
            }
            let nextNumber = 0;
            const startIndex = index;
            while (index < length) {
                const code = this.#json.charCodeAt(index);
                if (char0 > code || code > char9) {
                    break;
                }
                nextNumber *= 10;
                nextNumber += (code - char0);
                ++index;
            }
            if (index === length) {
                this.#json = this.#json.slice(startIndex);
                return true;
            }
            if (!this.#array) {
                throw new Error('Array not instantiated');
            }
            this.#array.setValue(this.#arrayIndex++, nextNumber);
        }
    }
    #parseStringsArray() {
        this.#progress.updateStatus('Parsing strings…');
        const closingBracketIndex = this.#json.lastIndexOf(']');
        if (closingBracketIndex === -1) {
            throw new Error('Incomplete JSON');
        }
        this.#json = this.#json.slice(0, closingBracketIndex + 1);
        if (!this.#snapshot) {
            throw new Error('No snapshot in parseStringsArray');
        }
        this.#snapshot.strings = JSON.parse(this.#json);
    }
    write(chunk) {
        this.#buffer.push(chunk);
        if (!this.#dataCallback) {
            return;
        }
        this.#dataCallback(this.#buffer.shift());
        this.#dataCallback = null;
    }
    #fetchChunk() {
        // This method shoudln't be entered more than once since parsing happens
        // sequentially. This means it's fine to stash away a single #dataCallback
        // instead of an array of them.
        if (this.#buffer.length > 0) {
            return Promise.resolve(this.#buffer.shift());
        }
        const { promise, resolve } = promiseWithResolvers();
        this.#dataCallback = resolve;
        return promise;
    }
    async #findToken(token, startIndex) {
        while (true) {
            const pos = this.#json.indexOf(token, startIndex || 0);
            if (pos !== -1) {
                return pos;
            }
            startIndex = this.#json.length - token.length + 1;
            this.#json += await this.#fetchChunk();
        }
    }
    async #parseArray(name, title, length) {
        const nameIndex = await this.#findToken(name);
        const bracketIndex = await this.#findToken('[', nameIndex);
        this.#json = this.#json.slice(bracketIndex + 1);
        this.#array = length === undefined ? createExpandableBigUint32Array() :
            createFixedBigUint32Array(length);
        this.#arrayIndex = 0;
        while (this.#parseUintArray()) {
            if (length) {
                this.#progress.updateProgress(title, this.#arrayIndex, this.#array.length);
            }
            else {
                this.#progress.updateStatus(title);
            }
            this.#json += await this.#fetchChunk();
        }
        const result = this.#array;
        this.#array = null;
        return result;
    }
    async #parseInput() {
        const snapshotToken = '"snapshot"';
        const snapshotTokenIndex = await this.#findToken(snapshotToken);
        if (snapshotTokenIndex === -1) {
            throw new Error('Snapshot token not found');
        }
        this.#progress.updateStatus('Loading snapshot info…');
        const json = this.#json.slice(snapshotTokenIndex + snapshotToken.length + 1);
        let jsonTokenizerDone = false;
        const jsonTokenizer = new BalancedJSONTokenizer(metaJSON => {
            this.#json = jsonTokenizer.remainder();
            jsonTokenizerDone = true;
            this.#snapshot = this.#snapshot || {};
            this.#snapshot.snapshot = JSON.parse(metaJSON);
        });
        jsonTokenizer.write(json);
        while (!jsonTokenizerDone) {
            jsonTokenizer.write(await this.#fetchChunk());
        }
        this.#snapshot = this.#snapshot || {};
        const nodes = await this.#parseArray('"nodes"', 'Loading nodes… {PH1}%', this.#snapshot.snapshot.meta.node_fields.length * this.#snapshot.snapshot.node_count);
        this.#snapshot.nodes = nodes;
        const edges = await this.#parseArray('"edges"', 'Loading edges… {PH1}%', this.#snapshot.snapshot.meta.edge_fields.length * this.#snapshot.snapshot.edge_count);
        this.#snapshot.edges = edges;
        if (this.#snapshot.snapshot.trace_function_count) {
            const traceFunctionInfos = await this.#parseArray('"trace_function_infos"', 'Loading allocation traces… {PH1}%', this.#snapshot.snapshot.meta.trace_function_info_fields.length *
                this.#snapshot.snapshot.trace_function_count);
            this.#snapshot.trace_function_infos = traceFunctionInfos.asUint32ArrayOrFail();
            const thisTokenEndIndex = await this.#findToken(':');
            const nextTokenIndex = await this.#findToken('"', thisTokenEndIndex);
            const openBracketIndex = this.#json.indexOf('[');
            const closeBracketIndex = this.#json.lastIndexOf(']', nextTokenIndex);
            this.#snapshot.trace_tree = JSON.parse(this.#json.substring(openBracketIndex, closeBracketIndex + 1));
            this.#json = this.#json.slice(closeBracketIndex + 1);
        }
        if (this.#snapshot.snapshot.meta.sample_fields) {
            const samples = await this.#parseArray('"samples"', 'Loading samples…');
            this.#snapshot.samples = samples.asArrayOrFail();
        }
        if (this.#snapshot.snapshot.meta['location_fields']) {
            const locations = await this.#parseArray('"locations"', 'Loading locations…');
            this.#snapshot.locations = locations.asArrayOrFail();
        }
        else {
            this.#snapshot.locations = [];
        }
        this.#progress.updateStatus('Loading strings…');
        const stringsTokenIndex = await this.#findToken('"strings"');
        const bracketIndex = await this.#findToken('[', stringsTokenIndex);
        this.#json = this.#json.slice(bracketIndex);
        while (!this.#done) {
            this.#json += await this.#fetchChunk();
        }
        this.#parseStringsArray();
    }
}

var HeapSnapshotLoader$1 = /*#__PURE__*/Object.freeze({
    __proto__: null,
    HeapSnapshotLoader: HeapSnapshotLoader
});

export { HeapSnapshotLoader$1 as HeapSnapshotLoader, HeapSnapshotModel };
//# sourceMappingURL=index.js.map
