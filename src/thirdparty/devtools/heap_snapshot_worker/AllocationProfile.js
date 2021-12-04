// @ts-nocheck
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
import * as HeapSnapshotModel from './heap_snapshot_model.js';
var AllocationProfile = /** @class */ (function () {
    // TODO(crbug.com/1172300) Ignored during the jsdoc to ts migration)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    function AllocationProfile(profile, liveObjectStats) {
        this.strings = profile.strings;
        this.liveObjectStats = liveObjectStats;
        this.nextNodeId = 1;
        this.functionInfos = [];
        this.idToNode = {};
        this.idToTopDownNode = {};
        this.collapsedTopNodeIdToFunctionInfo = {};
        this.traceTops = null;
        this.buildFunctionAllocationInfos(profile);
        this.traceTree = this.buildAllocationTree(profile, liveObjectStats);
    }
    // TODO(crbug.com/1172300) Ignored during the jsdoc to ts migration)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    AllocationProfile.prototype.buildFunctionAllocationInfos = function (profile) {
        var strings = this.strings;
        var functionInfoFields = profile.snapshot.meta.trace_function_info_fields;
        var functionNameOffset = functionInfoFields.indexOf('name');
        var scriptNameOffset = functionInfoFields.indexOf('script_name');
        var scriptIdOffset = functionInfoFields.indexOf('script_id');
        var lineOffset = functionInfoFields.indexOf('line');
        var columnOffset = functionInfoFields.indexOf('column');
        var functionInfoFieldCount = functionInfoFields.length;
        var rawInfos = profile.trace_function_infos;
        var infoLength = rawInfos.length;
        var functionInfos = this.functionInfos = new Array(infoLength / functionInfoFieldCount);
        var index = 0;
        for (var i = 0; i < infoLength; i += functionInfoFieldCount) {
            functionInfos[index++] = new FunctionAllocationInfo(strings[rawInfos[i + functionNameOffset]], strings[rawInfos[i + scriptNameOffset]], rawInfos[i + scriptIdOffset], rawInfos[i + lineOffset], rawInfos[i + columnOffset]);
        }
    };
    // TODO(crbug.com/1172300) Ignored during the jsdoc to ts migration)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    AllocationProfile.prototype.buildAllocationTree = function (profile, liveObjectStats) {
        var traceTreeRaw = profile.trace_tree;
        var functionInfos = this.functionInfos;
        var idToTopDownNode = this.idToTopDownNode;
        var traceNodeFields = profile.snapshot.meta.trace_node_fields;
        var nodeIdOffset = traceNodeFields.indexOf('id');
        var functionInfoIndexOffset = traceNodeFields.indexOf('function_info_index');
        var allocationCountOffset = traceNodeFields.indexOf('count');
        var allocationSizeOffset = traceNodeFields.indexOf('size');
        var childrenOffset = traceNodeFields.indexOf('children');
        var nodeFieldCount = traceNodeFields.length;
        function traverseNode(
        // TODO(crbug.com/1172300) Ignored during the jsdoc to ts migration)
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        rawNodeArray, nodeOffset, parent) {
            var functionInfo = functionInfos[rawNodeArray[nodeOffset + functionInfoIndexOffset]];
            var id = rawNodeArray[nodeOffset + nodeIdOffset];
            var stats = liveObjectStats[id];
            var liveCount = stats ? stats.count : 0;
            var liveSize = stats ? stats.size : 0;
            var result = new TopDownAllocationNode(id, functionInfo, rawNodeArray[nodeOffset + allocationCountOffset], rawNodeArray[nodeOffset + allocationSizeOffset], liveCount, liveSize, parent);
            idToTopDownNode[id] = result;
            functionInfo.addTraceTopNode(result);
            var rawChildren = rawNodeArray[nodeOffset + childrenOffset];
            for (var i = 0; i < rawChildren.length; i += nodeFieldCount) {
                result.children.push(traverseNode(rawChildren, i, result));
            }
            return result;
        }
        return traverseNode(traceTreeRaw, 0, null);
    };
    AllocationProfile.prototype.serializeTraceTops = function () {
        if (this.traceTops) {
            return this.traceTops;
        }
        var result = this.traceTops = [];
        var functionInfos = this.functionInfos;
        for (var i = 0; i < functionInfos.length; i++) {
            var info = functionInfos[i];
            if (info.totalCount === 0) {
                continue;
            }
            var nodeId = this.nextNodeId++;
            var isRoot = i === 0;
            result.push(this.serializeNode(nodeId, info, info.totalCount, info.totalSize, info.totalLiveCount, info.totalLiveSize, !isRoot));
            this.collapsedTopNodeIdToFunctionInfo[nodeId] = info;
        }
        result.sort(function (a, b) {
            return b.size - a.size;
        });
        return result;
    };
    AllocationProfile.prototype.serializeCallers = function (nodeId) {
        var node = this.ensureBottomUpNode(nodeId);
        var nodesWithSingleCaller = [];
        while (node.callers().length === 1) {
            node = node.callers()[0];
            nodesWithSingleCaller.push(this.serializeCaller(node));
        }
        var branchingCallers = [];
        var callers = node.callers();
        for (var i = 0; i < callers.length; i++) {
            branchingCallers.push(this.serializeCaller(callers[i]));
        }
        return new HeapSnapshotModel.HeapSnapshotModel.AllocationNodeCallers(nodesWithSingleCaller, branchingCallers);
    };
    AllocationProfile.prototype.serializeAllocationStack = function (traceNodeId) {
        var node = this.idToTopDownNode[traceNodeId];
        var result = [];
        while (node) {
            var functionInfo = node.functionInfo;
            result.push(new HeapSnapshotModel.HeapSnapshotModel.AllocationStackFrame(functionInfo.functionName, functionInfo.scriptName, functionInfo.scriptId, functionInfo.line, functionInfo.column));
            node = node.parent;
        }
        return result;
    };
    AllocationProfile.prototype.traceIds = function (allocationNodeId) {
        return this.ensureBottomUpNode(allocationNodeId).traceTopIds;
    };
    AllocationProfile.prototype.ensureBottomUpNode = function (nodeId) {
        var node = this.idToNode[nodeId];
        if (!node) {
            var functionInfo = this.collapsedTopNodeIdToFunctionInfo[nodeId];
            node = functionInfo.bottomUpRoot();
            delete this.collapsedTopNodeIdToFunctionInfo[nodeId];
            this.idToNode[nodeId] = node;
        }
        return /** @type {!BottomUpAllocationNode} */ node;
    };
    AllocationProfile.prototype.serializeCaller = function (node) {
        var callerId = this.nextNodeId++;
        this.idToNode[callerId] = node;
        return this.serializeNode(callerId, node.functionInfo, node.allocationCount, node.allocationSize, node.liveCount, node.liveSize, node.hasCallers());
    };
    AllocationProfile.prototype.serializeNode = function (nodeId, functionInfo, count, size, liveCount, liveSize, hasChildren) {
        return new HeapSnapshotModel.HeapSnapshotModel.SerializedAllocationNode(nodeId, functionInfo.functionName, functionInfo.scriptName, functionInfo.scriptId, functionInfo.line, functionInfo.column, count, size, liveCount, liveSize, hasChildren);
    };
    return AllocationProfile;
}());
export { AllocationProfile };
var TopDownAllocationNode = /** @class */ (function () {
    function TopDownAllocationNode(id, functionInfo, count, size, liveCount, liveSize, parent) {
        this.id = id;
        this.functionInfo = functionInfo;
        this.allocationCount = count;
        this.allocationSize = size;
        this.liveCount = liveCount;
        this.liveSize = liveSize;
        this.parent = parent;
        this.children = [];
    }
    return TopDownAllocationNode;
}());
export { TopDownAllocationNode };
var BottomUpAllocationNode = /** @class */ (function () {
    function BottomUpAllocationNode(functionInfo) {
        this.functionInfo = functionInfo;
        this.allocationCount = 0;
        this.allocationSize = 0;
        this.liveCount = 0;
        this.liveSize = 0;
        this.traceTopIds = [];
        this.callersInternal = [];
    }
    BottomUpAllocationNode.prototype.addCaller = function (traceNode) {
        var functionInfo = traceNode.functionInfo;
        var result;
        for (var i = 0; i < this.callersInternal.length; i++) {
            var caller = this.callersInternal[i];
            if (caller.functionInfo === functionInfo) {
                result = caller;
                break;
            }
        }
        if (!result) {
            result = new BottomUpAllocationNode(functionInfo);
            this.callersInternal.push(result);
        }
        return result;
    };
    BottomUpAllocationNode.prototype.callers = function () {
        return this.callersInternal;
    };
    BottomUpAllocationNode.prototype.hasCallers = function () {
        return this.callersInternal.length > 0;
    };
    return BottomUpAllocationNode;
}());
export { BottomUpAllocationNode };
var FunctionAllocationInfo = /** @class */ (function () {
    function FunctionAllocationInfo(functionName, scriptName, scriptId, line, column) {
        this.functionName = functionName;
        this.scriptName = scriptName;
        this.scriptId = scriptId;
        this.line = line;
        this.column = column;
        this.totalCount = 0;
        this.totalSize = 0;
        this.totalLiveCount = 0;
        this.totalLiveSize = 0;
        this.traceTops = [];
    }
    FunctionAllocationInfo.prototype.addTraceTopNode = function (node) {
        if (node.allocationCount === 0) {
            return;
        }
        this.traceTops.push(node);
        this.totalCount += node.allocationCount;
        this.totalSize += node.allocationSize;
        this.totalLiveCount += node.liveCount;
        this.totalLiveSize += node.liveSize;
    };
    FunctionAllocationInfo.prototype.bottomUpRoot = function () {
        if (!this.traceTops.length) {
            return null;
        }
        if (!this.bottomUpTree) {
            this.buildAllocationTraceTree();
        }
        return /** @type {!BottomUpAllocationNode} */ this.bottomUpTree;
    };
    FunctionAllocationInfo.prototype.buildAllocationTraceTree = function () {
        this.bottomUpTree = new BottomUpAllocationNode(this);
        for (var i = 0; i < this.traceTops.length; i++) {
            var node = this.traceTops[i];
            var bottomUpNode = this.bottomUpTree;
            var count = node.allocationCount;
            var size = node.allocationSize;
            var liveCount = node.liveCount;
            var liveSize = node.liveSize;
            var traceId = node.id;
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
    };
    return FunctionAllocationInfo;
}());
export { FunctionAllocationInfo };
