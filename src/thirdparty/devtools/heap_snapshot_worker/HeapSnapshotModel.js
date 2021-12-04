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
export var HeapSnapshotProgressEvent = {
    Update: 'ProgressUpdate',
    BrokenSnapshot: 'BrokenSnapshot'
};
export var baseSystemDistance = 100000000;
var AllocationNodeCallers = /** @class */ (function () {
    function AllocationNodeCallers(nodesWithSingleCaller, branchingCallers) {
        this.nodesWithSingleCaller = nodesWithSingleCaller;
        this.branchingCallers = branchingCallers;
    }
    return AllocationNodeCallers;
}());
export { AllocationNodeCallers };
var SerializedAllocationNode = /** @class */ (function () {
    function SerializedAllocationNode(nodeId, functionName, scriptName, scriptId, line, column, count, size, liveCount, liveSize, hasChildren) {
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
    return SerializedAllocationNode;
}());
export { SerializedAllocationNode };
var AllocationStackFrame = /** @class */ (function () {
    function AllocationStackFrame(functionName, scriptName, scriptId, line, column) {
        this.functionName = functionName;
        this.scriptName = scriptName;
        this.scriptId = scriptId;
        this.line = line;
        this.column = column;
    }
    return AllocationStackFrame;
}());
export { AllocationStackFrame };
var Node = /** @class */ (function () {
    function Node(id, name, distance, nodeIndex, retainedSize, selfSize, type) {
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
    }
    return Node;
}());
export { Node };
var Edge = /** @class */ (function () {
    function Edge(name, node, type, edgeIndex) {
        this.name = name;
        this.node = node;
        this.type = type;
        this.edgeIndex = edgeIndex;
        this.isAddedNotRemoved = null;
    }
    return Edge;
}());
export { Edge };
var Aggregate = /** @class */ (function () {
    function Aggregate() {
    }
    return Aggregate;
}());
export { Aggregate };
var AggregateForDiff = /** @class */ (function () {
    function AggregateForDiff() {
        this.indexes = [];
        this.ids = [];
        this.selfSizes = [];
    }
    return AggregateForDiff;
}());
export { AggregateForDiff };
var Diff = /** @class */ (function () {
    function Diff() {
        this.addedCount = 0;
        this.removedCount = 0;
        this.addedSize = 0;
        this.removedSize = 0;
        this.deletedIndexes = [];
        this.addedIndexes = [];
    }
    return Diff;
}());
export { Diff };
var DiffForClass = /** @class */ (function () {
    function DiffForClass() {
    }
    return DiffForClass;
}());
export { DiffForClass };
var ComparatorConfig = /** @class */ (function () {
    function ComparatorConfig(fieldName1, ascending1, fieldName2, ascending2) {
        this.fieldName1 = fieldName1;
        this.ascending1 = ascending1;
        this.fieldName2 = fieldName2;
        this.ascending2 = ascending2;
    }
    return ComparatorConfig;
}());
export { ComparatorConfig };
var WorkerCommand = /** @class */ (function () {
    function WorkerCommand() {
    }
    return WorkerCommand;
}());
export { WorkerCommand };
var ItemsRange = /** @class */ (function () {
    function ItemsRange(startPosition, endPosition, totalLength, items) {
        this.startPosition = startPosition;
        this.endPosition = endPosition;
        this.totalLength = totalLength;
        this.items = items;
    }
    return ItemsRange;
}());
export { ItemsRange };
var StaticData = /** @class */ (function () {
    function StaticData(nodeCount, rootNodeIndex, totalSize, maxJSObjectId) {
        this.nodeCount = nodeCount;
        this.rootNodeIndex = rootNodeIndex;
        this.totalSize = totalSize;
        this.maxJSObjectId = maxJSObjectId;
    }
    return StaticData;
}());
export { StaticData };
var Statistics = /** @class */ (function () {
    function Statistics() {
    }
    return Statistics;
}());
export { Statistics };
var NodeFilter = /** @class */ (function () {
    function NodeFilter(minNodeId, maxNodeId) {
        this.minNodeId = minNodeId;
        this.maxNodeId = maxNodeId;
    }
    NodeFilter.prototype.equals = function (o) {
        return this.minNodeId === o.minNodeId && this.maxNodeId === o.maxNodeId &&
            this.allocationNodeId === o.allocationNodeId;
    };
    return NodeFilter;
}());
export { NodeFilter };
var SearchConfig = /** @class */ (function () {
    function SearchConfig(query, caseSensitive, isRegex, shouldJump, jumpBackward) {
        this.query = query;
        this.caseSensitive = caseSensitive;
        this.isRegex = isRegex;
        this.shouldJump = shouldJump;
        this.jumpBackward = jumpBackward;
    }
    SearchConfig.prototype.toSearchRegex = function (_global) {
        throw new Error('Unsupported operation on search config');
    };
    return SearchConfig;
}());
export { SearchConfig };
var Samples = /** @class */ (function () {
    function Samples(timestamps, lastAssignedIds, sizes) {
        this.timestamps = timestamps;
        this.lastAssignedIds = lastAssignedIds;
        this.sizes = sizes;
    }
    return Samples;
}());
export { Samples };
var Location = /** @class */ (function () {
    function Location(scriptId, lineNumber, columnNumber) {
        this.scriptId = scriptId;
        this.lineNumber = lineNumber;
        this.columnNumber = columnNumber;
    }
    return Location;
}());
export { Location };
