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
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
import * as i18n from './i18n.js';
import * as Platform from './platform.js';
import * as HeapSnapshotModel from './heap_snapshot_model.js';
import { AllocationProfile } from './AllocationProfile.js';
var HeapSnapshotEdge = /** @class */ (function () {
    function HeapSnapshotEdge(snapshot, edgeIndex) {
        this.snapshot = snapshot;
        this.edges = snapshot.containmentEdges;
        this.edgeIndex = edgeIndex || 0;
    }
    HeapSnapshotEdge.prototype.clone = function () {
        return new HeapSnapshotEdge(this.snapshot, this.edgeIndex);
    };
    HeapSnapshotEdge.prototype.hasStringName = function () {
        throw new Error('Not implemented');
    };
    HeapSnapshotEdge.prototype.name = function () {
        throw new Error('Not implemented');
    };
    HeapSnapshotEdge.prototype.node = function () {
        return this.snapshot.createNode(this.nodeIndex());
    };
    HeapSnapshotEdge.prototype.nodeIndex = function () {
        if (typeof this.snapshot.edgeToNodeOffset === 'undefined') {
            throw new Error('edgeToNodeOffset is undefined');
        }
        return this.edges[this.edgeIndex + this.snapshot.edgeToNodeOffset];
    };
    HeapSnapshotEdge.prototype.toString = function () {
        return 'HeapSnapshotEdge: ' + this.name();
    };
    HeapSnapshotEdge.prototype.type = function () {
        return this.snapshot.edgeTypes[this.rawType()];
    };
    HeapSnapshotEdge.prototype.itemIndex = function () {
        return this.edgeIndex;
    };
    HeapSnapshotEdge.prototype.serialize = function () {
        return new HeapSnapshotModel.HeapSnapshotModel.Edge(this.name(), this.node().serialize(), this.type(), this.edgeIndex);
    };
    HeapSnapshotEdge.prototype.rawType = function () {
        if (typeof this.snapshot.edgeTypeOffset === 'undefined') {
            throw new Error('edgeTypeOffset is undefined');
        }
        return this.edges[this.edgeIndex + this.snapshot.edgeTypeOffset];
    };
    HeapSnapshotEdge.prototype.isInvisible = function () {
        throw new Error('Not implemented');
    };
    HeapSnapshotEdge.prototype.isWeak = function () {
        throw new Error('Not implemented');
    };
    return HeapSnapshotEdge;
}());
export { HeapSnapshotEdge };
var HeapSnapshotNodeIndexProvider = /** @class */ (function () {
    function HeapSnapshotNodeIndexProvider(snapshot) {
        this.node = snapshot.createNode();
    }
    HeapSnapshotNodeIndexProvider.prototype.itemForIndex = function (index) {
        this.node.nodeIndex = index;
        return this.node;
    };
    return HeapSnapshotNodeIndexProvider;
}());
export { HeapSnapshotNodeIndexProvider };
var HeapSnapshotEdgeIndexProvider = /** @class */ (function () {
    function HeapSnapshotEdgeIndexProvider(snapshot) {
        this.edge = snapshot.createEdge(0);
    }
    HeapSnapshotEdgeIndexProvider.prototype.itemForIndex = function (index) {
        this.edge.edgeIndex = index;
        return this.edge;
    };
    return HeapSnapshotEdgeIndexProvider;
}());
export { HeapSnapshotEdgeIndexProvider };
var HeapSnapshotRetainerEdgeIndexProvider = /** @class */ (function () {
    function HeapSnapshotRetainerEdgeIndexProvider(snapshot) {
        this.retainerEdge = snapshot.createRetainingEdge(0);
    }
    HeapSnapshotRetainerEdgeIndexProvider.prototype.itemForIndex = function (index) {
        this.retainerEdge.setRetainerIndex(index);
        return this.retainerEdge;
    };
    return HeapSnapshotRetainerEdgeIndexProvider;
}());
export { HeapSnapshotRetainerEdgeIndexProvider };
var HeapSnapshotEdgeIterator = /** @class */ (function () {
    function HeapSnapshotEdgeIterator(node) {
        this.sourceNode = node;
        this.edge = node.snapshot.createEdge(node.edgeIndexesStart());
    }
    HeapSnapshotEdgeIterator.prototype.hasNext = function () {
        return this.edge.edgeIndex < this.sourceNode.edgeIndexesEnd();
    };
    HeapSnapshotEdgeIterator.prototype.item = function () {
        return this.edge;
    };
    HeapSnapshotEdgeIterator.prototype.next = function () {
        if (typeof this.edge.snapshot.edgeFieldsCount === 'undefined') {
            throw new Error('edgeFieldsCount is undefined');
        }
        this.edge.edgeIndex += this.edge.snapshot.edgeFieldsCount;
    };
    return HeapSnapshotEdgeIterator;
}());
export { HeapSnapshotEdgeIterator };
var HeapSnapshotRetainerEdge = /** @class */ (function () {
    function HeapSnapshotRetainerEdge(snapshot, retainerIndex) {
        this.snapshot = snapshot;
        this.setRetainerIndex(retainerIndex);
    }
    HeapSnapshotRetainerEdge.prototype.clone = function () {
        return new HeapSnapshotRetainerEdge(this.snapshot, this.retainerIndex());
    };
    HeapSnapshotRetainerEdge.prototype.hasStringName = function () {
        return this.edge().hasStringName();
    };
    HeapSnapshotRetainerEdge.prototype.name = function () {
        return this.edge().name();
    };
    HeapSnapshotRetainerEdge.prototype.node = function () {
        return this.nodeInternal();
    };
    HeapSnapshotRetainerEdge.prototype.nodeIndex = function () {
        if (typeof this.retainingNodeIndex === 'undefined') {
            throw new Error('retainingNodeIndex is undefined');
        }
        return this.retainingNodeIndex;
    };
    HeapSnapshotRetainerEdge.prototype.retainerIndex = function () {
        return this.retainerIndexInternal;
    };
    HeapSnapshotRetainerEdge.prototype.setRetainerIndex = function (retainerIndex) {
        if (retainerIndex === this.retainerIndexInternal) {
            return;
        }
        if (!this.snapshot.retainingEdges || !this.snapshot.retainingNodes) {
            throw new Error('Snapshot does not contain retaining edges or retaining nodes');
        }
        this.retainerIndexInternal = retainerIndex;
        this.globalEdgeIndex = this.snapshot.retainingEdges[retainerIndex];
        this.retainingNodeIndex = this.snapshot.retainingNodes[retainerIndex];
        this.edgeInstance = null;
        this.nodeInstance = null;
    };
    Object.defineProperty(HeapSnapshotRetainerEdge.prototype, "edgeIndex", {
        set: function (edgeIndex) {
            this.setRetainerIndex(edgeIndex);
        },
        enumerable: false,
        configurable: true
    });
    HeapSnapshotRetainerEdge.prototype.nodeInternal = function () {
        if (!this.nodeInstance) {
            this.nodeInstance = this.snapshot.createNode(this.retainingNodeIndex);
        }
        return this.nodeInstance;
    };
    HeapSnapshotRetainerEdge.prototype.edge = function () {
        if (!this.edgeInstance) {
            this.edgeInstance = this.snapshot.createEdge(this.globalEdgeIndex);
        }
        return this.edgeInstance;
    };
    HeapSnapshotRetainerEdge.prototype.toString = function () {
        return this.edge().toString();
    };
    HeapSnapshotRetainerEdge.prototype.itemIndex = function () {
        return this.retainerIndexInternal;
    };
    HeapSnapshotRetainerEdge.prototype.serialize = function () {
        return new HeapSnapshotModel.HeapSnapshotModel.Edge(this.name(), this.node().serialize(), this.type(), this.globalEdgeIndex);
    };
    HeapSnapshotRetainerEdge.prototype.type = function () {
        return this.edge().type();
    };
    return HeapSnapshotRetainerEdge;
}());
export { HeapSnapshotRetainerEdge };
var HeapSnapshotRetainerEdgeIterator = /** @class */ (function () {
    function HeapSnapshotRetainerEdgeIterator(retainedNode) {
        var snapshot = retainedNode.snapshot;
        var retainedNodeOrdinal = retainedNode.ordinal();
        if (!snapshot.firstRetainerIndex) {
            throw new Error('Snapshot does not contain firstRetainerIndex');
        }
        var retainerIndex = snapshot.firstRetainerIndex[retainedNodeOrdinal];
        this.retainersEnd = snapshot.firstRetainerIndex[retainedNodeOrdinal + 1];
        this.retainer = snapshot.createRetainingEdge(retainerIndex);
    }
    HeapSnapshotRetainerEdgeIterator.prototype.hasNext = function () {
        return this.retainer.retainerIndex() < this.retainersEnd;
    };
    HeapSnapshotRetainerEdgeIterator.prototype.item = function () {
        return this.retainer;
    };
    HeapSnapshotRetainerEdgeIterator.prototype.next = function () {
        this.retainer.setRetainerIndex(this.retainer.retainerIndex() + 1);
    };
    return HeapSnapshotRetainerEdgeIterator;
}());
export { HeapSnapshotRetainerEdgeIterator };
var HeapSnapshotNode = /** @class */ (function () {
    function HeapSnapshotNode(snapshot, nodeIndex) {
        this.snapshot = snapshot;
        this.nodeIndex = nodeIndex || 0;
    }
    HeapSnapshotNode.prototype.distance = function () {
        return this.snapshot.nodeDistances[this.nodeIndex / this.snapshot.nodeFieldCount];
    };
    HeapSnapshotNode.prototype.className = function () {
        throw new Error('Not implemented');
    };
    HeapSnapshotNode.prototype.classIndex = function () {
        throw new Error('Not implemented');
    };
    HeapSnapshotNode.prototype.dominatorIndex = function () {
        var nodeFieldCount = this.snapshot.nodeFieldCount;
        return this.snapshot.dominatorsTree[this.nodeIndex / this.snapshot.nodeFieldCount] * nodeFieldCount;
    };
    HeapSnapshotNode.prototype.edges = function () {
        return new HeapSnapshotEdgeIterator(this);
    };
    HeapSnapshotNode.prototype.edgesCount = function () {
        return (this.edgeIndexesEnd() - this.edgeIndexesStart()) / this.snapshot.edgeFieldsCount;
    };
    HeapSnapshotNode.prototype.id = function () {
        throw new Error('Not implemented');
    };
    HeapSnapshotNode.prototype.rawName = function () {
        throw new Error('Not implemented');
    };
    HeapSnapshotNode.prototype.isRoot = function () {
        return this.nodeIndex === this.snapshot.rootNodeIndex;
    };
    HeapSnapshotNode.prototype.isUserRoot = function () {
        throw new Error('Not implemented');
    };
    HeapSnapshotNode.prototype.isHidden = function () {
        throw new Error('Not implemented');
    };
    HeapSnapshotNode.prototype.isArray = function () {
        throw new Error('Not implemented');
    };
    HeapSnapshotNode.prototype.isDocumentDOMTreesRoot = function () {
        throw new Error('Not implemented');
    };
    HeapSnapshotNode.prototype.name = function () {
        return this.snapshot.strings[this.nameInternal()];
    };
    HeapSnapshotNode.prototype.retainedSize = function () {
        return this.snapshot.retainedSizes[this.ordinal()];
    };
    HeapSnapshotNode.prototype.retainers = function () {
        return new HeapSnapshotRetainerEdgeIterator(this);
    };
    HeapSnapshotNode.prototype.retainersCount = function () {
        var snapshot = this.snapshot;
        var ordinal = this.ordinal();
        return snapshot.firstRetainerIndex[ordinal + 1] - snapshot.firstRetainerIndex[ordinal];
    };
    HeapSnapshotNode.prototype.selfSize = function () {
        var snapshot = this.snapshot;
        return snapshot.nodes[this.nodeIndex + snapshot.nodeSelfSizeOffset];
    };
    HeapSnapshotNode.prototype.type = function () {
        return this.snapshot.nodeTypes[this.rawType()];
    };
    HeapSnapshotNode.prototype.traceNodeId = function () {
        var snapshot = this.snapshot;
        return snapshot.nodes[this.nodeIndex + snapshot.nodeTraceNodeIdOffset];
    };
    HeapSnapshotNode.prototype.itemIndex = function () {
        return this.nodeIndex;
    };
    HeapSnapshotNode.prototype.serialize = function () {
        return new HeapSnapshotModel.HeapSnapshotModel.Node(this.id(), this.name(), this.distance(), this.nodeIndex, this.retainedSize(), this.selfSize(), this.type());
    };
    HeapSnapshotNode.prototype.nameInternal = function () {
        var snapshot = this.snapshot;
        return snapshot.nodes[this.nodeIndex + snapshot.nodeNameOffset];
    };
    HeapSnapshotNode.prototype.edgeIndexesStart = function () {
        return this.snapshot.firstEdgeIndexes[this.ordinal()];
    };
    HeapSnapshotNode.prototype.edgeIndexesEnd = function () {
        return this.snapshot.firstEdgeIndexes[this.ordinal() + 1];
    };
    HeapSnapshotNode.prototype.ordinal = function () {
        return this.nodeIndex / this.snapshot.nodeFieldCount;
    };
    HeapSnapshotNode.prototype.nextNodeIndex = function () {
        return this.nodeIndex + this.snapshot.nodeFieldCount;
    };
    HeapSnapshotNode.prototype.rawType = function () {
        var snapshot = this.snapshot;
        return snapshot.nodes[this.nodeIndex + snapshot.nodeTypeOffset];
    };
    return HeapSnapshotNode;
}());
export { HeapSnapshotNode };
var HeapSnapshotNodeIterator = /** @class */ (function () {
    function HeapSnapshotNodeIterator(node) {
        this.node = node;
        this.nodesLength = node.snapshot.nodes.length;
    }
    HeapSnapshotNodeIterator.prototype.hasNext = function () {
        return this.node.nodeIndex < this.nodesLength;
    };
    HeapSnapshotNodeIterator.prototype.item = function () {
        return this.node;
    };
    HeapSnapshotNodeIterator.prototype.next = function () {
        this.node.nodeIndex = this.node.nextNodeIndex();
    };
    return HeapSnapshotNodeIterator;
}());
export { HeapSnapshotNodeIterator };
var HeapSnapshotIndexRangeIterator = /** @class */ (function () {
    function HeapSnapshotIndexRangeIterator(itemProvider, indexes) {
        this.itemProvider = itemProvider;
        this.indexes = indexes;
        this.position = 0;
    }
    HeapSnapshotIndexRangeIterator.prototype.hasNext = function () {
        return this.position < this.indexes.length;
    };
    HeapSnapshotIndexRangeIterator.prototype.item = function () {
        var index = this.indexes[this.position];
        return this.itemProvider.itemForIndex(index);
    };
    HeapSnapshotIndexRangeIterator.prototype.next = function () {
        ++this.position;
    };
    return HeapSnapshotIndexRangeIterator;
}());
export { HeapSnapshotIndexRangeIterator };
var HeapSnapshotFilteredIterator = /** @class */ (function () {
    function HeapSnapshotFilteredIterator(iterator, filter) {
        this.iterator = iterator;
        this.filter = filter;
        this.skipFilteredItems();
    }
    HeapSnapshotFilteredIterator.prototype.hasNext = function () {
        return this.iterator.hasNext();
    };
    HeapSnapshotFilteredIterator.prototype.item = function () {
        return this.iterator.item();
    };
    HeapSnapshotFilteredIterator.prototype.next = function () {
        this.iterator.next();
        this.skipFilteredItems();
    };
    HeapSnapshotFilteredIterator.prototype.skipFilteredItems = function () {
        while (this.iterator.hasNext() && this.filter && !this.filter(this.iterator.item())) {
            this.iterator.next();
        }
    };
    return HeapSnapshotFilteredIterator;
}());
export { HeapSnapshotFilteredIterator };
var HeapSnapshotProgress = /** @class */ (function () {
    function HeapSnapshotProgress(dispatcher) {
        this.dispatcher = dispatcher;
    }
    HeapSnapshotProgress.prototype.updateStatus = function (status) {
        this.sendUpdateEvent(i18n.i18n.serializeUIString(status));
    };
    HeapSnapshotProgress.prototype.updateProgress = function (title, value, total) {
        var percentValue = ((total ? (value / total) : 0) * 100).toFixed(0);
        this.sendUpdateEvent(i18n.i18n.serializeUIString(title, { PH1: percentValue }));
    };
    HeapSnapshotProgress.prototype.reportProblem = function (error) {
        // May be undefined in tests.
        if (this.dispatcher) {
            this.dispatcher.sendEvent(HeapSnapshotModel.HeapSnapshotModel.HeapSnapshotProgressEvent.BrokenSnapshot, error);
        }
    };
    HeapSnapshotProgress.prototype.sendUpdateEvent = function (serializedText) {
        // May be undefined in tests.
        if (this.dispatcher) {
            this.dispatcher.sendEvent(HeapSnapshotModel.HeapSnapshotModel.HeapSnapshotProgressEvent.Update, serializedText);
        }
    };
    return HeapSnapshotProgress;
}());
export { HeapSnapshotProgress };
var HeapSnapshotProblemReport = /** @class */ (function () {
    function HeapSnapshotProblemReport(title) {
        this.errors = [title];
    }
    HeapSnapshotProblemReport.prototype.addError = function (error) {
        if (this.errors.length > 100) {
            return;
        }
        this.errors.push(error);
    };
    HeapSnapshotProblemReport.prototype.toString = function () {
        return this.errors.join('\n  ');
    };
    return HeapSnapshotProblemReport;
}());
export { HeapSnapshotProblemReport };
var HeapSnapshot = /** @class */ (function () {
    function HeapSnapshot(profile, progress) {
        this.nodes = profile.nodes;
        this.containmentEdges = profile.edges;
        this.metaNode = profile.snapshot.meta;
        this.rawSamples = profile.samples;
        this.samples = null;
        this.strings = profile.strings;
        this.locations = profile.locations;
        this.progress = progress;
        this.noDistance = -5;
        this.rootNodeIndexInternal = 0;
        if (profile.snapshot.root_index) {
            this.rootNodeIndexInternal = profile.snapshot.root_index;
        }
        this.snapshotDiffs = {};
        this.aggregates = {};
        this.aggregatesSortedFlags = {};
        this.profile = profile;
    }
    HeapSnapshot.prototype.initialize = function () {
        var meta = this.metaNode;
        this.nodeTypeOffset = meta.node_fields.indexOf('type');
        this.nodeNameOffset = meta.node_fields.indexOf('name');
        this.nodeIdOffset = meta.node_fields.indexOf('id');
        this.nodeSelfSizeOffset = meta.node_fields.indexOf('self_size');
        this.nodeEdgeCountOffset = meta.node_fields.indexOf('edge_count');
        this.nodeTraceNodeIdOffset = meta.node_fields.indexOf('trace_node_id');
        this.nodeDetachednessOffset = meta.node_fields.indexOf('detachedness');
        this.nodeFieldCount = meta.node_fields.length;
        this.nodeTypes = meta.node_types[this.nodeTypeOffset];
        this.nodeArrayType = this.nodeTypes.indexOf('array');
        this.nodeHiddenType = this.nodeTypes.indexOf('hidden');
        this.nodeObjectType = this.nodeTypes.indexOf('object');
        this.nodeNativeType = this.nodeTypes.indexOf('native');
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
        var locationFields = meta.location_fields || [];
        this.locationIndexOffset = locationFields.indexOf('object_index');
        this.locationScriptIdOffset = locationFields.indexOf('script_id');
        this.locationLineOffset = locationFields.indexOf('line');
        this.locationColumnOffset = locationFields.indexOf('column');
        this.locationFieldCount = locationFields.length;
        this.nodeCount = this.nodes.length / this.nodeFieldCount;
        this.edgeCount = this.containmentEdges.length / this.edgeFieldsCount;
        this.retainedSizes = new Float64Array(this.nodeCount);
        this.firstEdgeIndexes = new Uint32Array(this.nodeCount + 1);
        this.retainingNodes = new Uint32Array(this.edgeCount);
        this.retainingEdges = new Uint32Array(this.edgeCount);
        this.firstRetainerIndex = new Uint32Array(this.nodeCount + 1);
        this.nodeDistances = new Int32Array(this.nodeCount);
        this.firstDominatedNodeIndex = new Uint32Array(this.nodeCount + 1);
        this.dominatedNodes = new Uint32Array(this.nodeCount - 1);
        this.progress.updateStatus('Building edge indexes…');
        this.buildEdgeIndexes();
        this.progress.updateStatus('Building retainers…');
        this.buildRetainers();
        this.progress.updateStatus('Propagating DOM state…');
        this.propagateDOMState();
        this.progress.updateStatus('Calculating node flags…');
        this.calculateFlags();
        this.progress.updateStatus('Calculating distances…');
        this.calculateDistances();
        this.progress.updateStatus('Building postorder index…');
        var result = this.buildPostOrderIndex();
        // Actually it is array that maps node ordinal number to dominator node ordinal number.
        this.progress.updateStatus('Building dominator tree…');
        this.dominatorsTree = this.buildDominatorTree(result.postOrderIndex2NodeOrdinal, result.nodeOrdinal2PostOrderIndex);
        this.progress.updateStatus('Calculating retained sizes…');
        this.calculateRetainedSizes(result.postOrderIndex2NodeOrdinal);
        this.progress.updateStatus('Building dominated nodes…');
        this.buildDominatedNodes();
        this.progress.updateStatus('Calculating statistics…');
        this.calculateStatistics();
        this.progress.updateStatus('Calculating samples…');
        this.buildSamples();
        this.progress.updateStatus('Building locations…');
        this.buildLocationMap();
        this.progress.updateStatus('Finished processing.');
        if (this.profile.snapshot.trace_function_count) {
            this.progress.updateStatus('Building allocation statistics…');
            var nodes = this.nodes;
            var nodesLength = nodes.length;
            var nodeFieldCount = this.nodeFieldCount;
            var node = this.rootNode();
            var liveObjects = {};
            for (var nodeIndex = 0; nodeIndex < nodesLength; nodeIndex += nodeFieldCount) {
                node.nodeIndex = nodeIndex;
                var traceNodeId = node.traceNodeId();
                var stats = liveObjects[traceNodeId];
                if (!stats) {
                    liveObjects[traceNodeId] = stats = { count: 0, size: 0, ids: [] };
                }
                stats.count++;
                stats.size += node.selfSize();
                stats.ids.push(node.id());
            }
            this.allocationProfile = new AllocationProfile(this.profile, liveObjects);
            this.progress.updateStatus('done');
        }
    };
    HeapSnapshot.prototype.buildEdgeIndexes = function () {
        var nodes = this.nodes;
        var nodeCount = this.nodeCount;
        var firstEdgeIndexes = this.firstEdgeIndexes;
        var nodeFieldCount = this.nodeFieldCount;
        var edgeFieldsCount = this.edgeFieldsCount;
        var nodeEdgeCountOffset = this.nodeEdgeCountOffset;
        firstEdgeIndexes[nodeCount] = this.containmentEdges.length;
        for (var nodeOrdinal = 0, edgeIndex = 0; nodeOrdinal < nodeCount; ++nodeOrdinal) {
            firstEdgeIndexes[nodeOrdinal] = edgeIndex;
            edgeIndex += nodes[nodeOrdinal * nodeFieldCount + nodeEdgeCountOffset] * edgeFieldsCount;
        }
    };
    HeapSnapshot.prototype.buildRetainers = function () {
        var retainingNodes = this.retainingNodes;
        var retainingEdges = this.retainingEdges;
        // Index of the first retainer in the retainingNodes and retainingEdges
        // arrays. Addressed by retained node index.
        var firstRetainerIndex = this.firstRetainerIndex;
        var containmentEdges = this.containmentEdges;
        var edgeFieldsCount = this.edgeFieldsCount;
        var nodeFieldCount = this.nodeFieldCount;
        var edgeToNodeOffset = this.edgeToNodeOffset;
        var firstEdgeIndexes = this.firstEdgeIndexes;
        var nodeCount = this.nodeCount;
        for (var toNodeFieldIndex = edgeToNodeOffset, l = containmentEdges.length; toNodeFieldIndex < l; toNodeFieldIndex += edgeFieldsCount) {
            var toNodeIndex = containmentEdges[toNodeFieldIndex];
            if (toNodeIndex % nodeFieldCount) {
                throw new Error('Invalid toNodeIndex ' + toNodeIndex);
            }
            ++firstRetainerIndex[toNodeIndex / nodeFieldCount];
        }
        for (var i = 0, firstUnusedRetainerSlot = 0; i < nodeCount; i++) {
            var retainersCount = firstRetainerIndex[i];
            firstRetainerIndex[i] = firstUnusedRetainerSlot;
            retainingNodes[firstUnusedRetainerSlot] = retainersCount;
            firstUnusedRetainerSlot += retainersCount;
        }
        firstRetainerIndex[nodeCount] = retainingNodes.length;
        var nextNodeFirstEdgeIndex = firstEdgeIndexes[0];
        for (var srcNodeOrdinal = 0; srcNodeOrdinal < nodeCount; ++srcNodeOrdinal) {
            var firstEdgeIndex = nextNodeFirstEdgeIndex;
            nextNodeFirstEdgeIndex = firstEdgeIndexes[srcNodeOrdinal + 1];
            var srcNodeIndex = srcNodeOrdinal * nodeFieldCount;
            for (var edgeIndex = firstEdgeIndex; edgeIndex < nextNodeFirstEdgeIndex; edgeIndex += edgeFieldsCount) {
                var toNodeIndex = containmentEdges[edgeIndex + edgeToNodeOffset];
                if (toNodeIndex % nodeFieldCount) {
                    throw new Error('Invalid toNodeIndex ' + toNodeIndex);
                }
                var firstRetainerSlotIndex = firstRetainerIndex[toNodeIndex / nodeFieldCount];
                var nextUnusedRetainerSlotIndex = firstRetainerSlotIndex + (--retainingNodes[firstRetainerSlotIndex]);
                retainingNodes[nextUnusedRetainerSlotIndex] = srcNodeIndex;
                retainingEdges[nextUnusedRetainerSlotIndex] = edgeIndex;
            }
        }
    };
    HeapSnapshot.prototype.allNodes = function () {
        return new HeapSnapshotNodeIterator(this.rootNode());
    };
    HeapSnapshot.prototype.rootNode = function () {
        return this.createNode(this.rootNodeIndexInternal);
    };
    Object.defineProperty(HeapSnapshot.prototype, "rootNodeIndex", {
        get: function () {
            return this.rootNodeIndexInternal;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(HeapSnapshot.prototype, "totalSize", {
        get: function () {
            return this.rootNode().retainedSize();
        },
        enumerable: false,
        configurable: true
    });
    HeapSnapshot.prototype.getDominatedIndex = function (nodeIndex) {
        if (nodeIndex % this.nodeFieldCount) {
            throw new Error('Invalid nodeIndex: ' + nodeIndex);
        }
        return this.firstDominatedNodeIndex[nodeIndex / this.nodeFieldCount];
    };
    HeapSnapshot.prototype.createFilter = function (nodeFilter) {
        var minNodeId = nodeFilter.minNodeId;
        var maxNodeId = nodeFilter.maxNodeId;
        var allocationNodeId = nodeFilter.allocationNodeId;
        var filter;
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
        return filter;
    };
    HeapSnapshot.prototype.search = function (searchConfig, nodeFilter) {
        var query = searchConfig.query;
        function filterString(matchedStringIndexes, string, index) {
            if (string.indexOf(query) !== -1) {
                matchedStringIndexes.add(index);
            }
            return matchedStringIndexes;
        }
        var regexp = searchConfig.isRegex ? new RegExp(query) : Platform.StringUtilities.createPlainTextSearchRegex(query, 'i');
        function filterRegexp(matchedStringIndexes, string, index) {
            if (regexp.test(string)) {
                matchedStringIndexes.add(index);
            }
            return matchedStringIndexes;
        }
        var stringFilter = (searchConfig.isRegex || !searchConfig.caseSensitive) ? filterRegexp : filterString;
        var stringIndexes = this.strings.reduce(stringFilter, new Set());
        if (!stringIndexes.size) {
            return [];
        }
        var filter = this.createFilter(nodeFilter);
        var nodeIds = [];
        var nodesLength = this.nodes.length;
        var nodes = this.nodes;
        var nodeNameOffset = this.nodeNameOffset;
        var nodeIdOffset = this.nodeIdOffset;
        var nodeFieldCount = this.nodeFieldCount;
        var node = this.rootNode();
        for (var nodeIndex = 0; nodeIndex < nodesLength; nodeIndex += nodeFieldCount) {
            node.nodeIndex = nodeIndex;
            if (filter && !filter(node)) {
                continue;
            }
            if (stringIndexes.has(nodes[nodeIndex + nodeNameOffset])) {
                nodeIds.push(nodes[nodeIndex + nodeIdOffset]);
            }
        }
        return nodeIds;
    };
    HeapSnapshot.prototype.aggregatesWithFilter = function (nodeFilter) {
        var filter = this.createFilter(nodeFilter);
        // @ts-ignore key is added in createFilter
        var key = filter ? filter.key : 'allObjects';
        return this.getAggregatesByClassName(false, key, filter);
    };
    HeapSnapshot.prototype.createNodeIdFilter = function (minNodeId, maxNodeId) {
        function nodeIdFilter(node) {
            var id = node.id();
            return id > minNodeId && id <= maxNodeId;
        }
        return nodeIdFilter;
    };
    HeapSnapshot.prototype.createAllocationStackFilter = function (bottomUpAllocationNodeId) {
        if (!this.allocationProfile) {
            throw new Error('No Allocation Profile provided');
        }
        var traceIds = this.allocationProfile.traceIds(bottomUpAllocationNodeId);
        if (!traceIds.length) {
            return undefined;
        }
        var set = {};
        for (var i = 0; i < traceIds.length; i++) {
            set[traceIds[i]] = true;
        }
        function traceIdFilter(node) {
            return Boolean(set[node.traceNodeId()]);
        }
        return traceIdFilter;
    };
    HeapSnapshot.prototype.getAggregatesByClassName = function (sortedIndexes, key, filter) {
        var aggregates = this.buildAggregates(filter);
        var aggregatesByClassName;
        if (key && this.aggregates[key]) {
            aggregatesByClassName = this.aggregates[key];
        }
        else {
            this.calculateClassesRetainedSize(aggregates.aggregatesByClassIndex, filter);
            aggregatesByClassName = aggregates.aggregatesByClassName;
            if (key) {
                this.aggregates[key] = aggregatesByClassName;
            }
        }
        if (sortedIndexes && (!key || !this.aggregatesSortedFlags[key])) {
            this.sortAggregateIndexes(aggregates.aggregatesByClassName);
            if (key) {
                this.aggregatesSortedFlags[key] = sortedIndexes;
            }
        }
        return aggregatesByClassName;
    };
    HeapSnapshot.prototype.allocationTracesTops = function () {
        return this.allocationProfile.serializeTraceTops();
    };
    HeapSnapshot.prototype.allocationNodeCallers = function (nodeId) {
        return this.allocationProfile.serializeCallers(nodeId);
    };
    HeapSnapshot.prototype.allocationStack = function (nodeIndex) {
        var node = this.createNode(nodeIndex);
        var allocationNodeId = node.traceNodeId();
        if (!allocationNodeId) {
            return null;
        }
        return this.allocationProfile.serializeAllocationStack(allocationNodeId);
    };
    HeapSnapshot.prototype.aggregatesForDiff = function () {
        if (this.aggregatesForDiffInternal) {
            return this.aggregatesForDiffInternal;
        }
        var aggregatesByClassName = this.getAggregatesByClassName(true, 'allObjects');
        this.aggregatesForDiffInternal = {};
        var node = this.createNode();
        for (var className in aggregatesByClassName) {
            var aggregate = aggregatesByClassName[className];
            var indexes = aggregate.idxs;
            var ids = new Array(indexes.length);
            var selfSizes = new Array(indexes.length);
            for (var i = 0; i < indexes.length; i++) {
                node.nodeIndex = indexes[i];
                ids[i] = node.id();
                selfSizes[i] = node.selfSize();
            }
            this.aggregatesForDiffInternal[className] = { indexes: indexes, ids: ids, selfSizes: selfSizes };
        }
        return this.aggregatesForDiffInternal;
    };
    HeapSnapshot.prototype.isUserRoot = function (_node) {
        return true;
    };
    HeapSnapshot.prototype.calculateDistances = function (filter) {
        var nodeCount = this.nodeCount;
        var distances = this.nodeDistances;
        var noDistance = this.noDistance;
        for (var i = 0; i < nodeCount; ++i) {
            distances[i] = noDistance;
        }
        var nodesToVisit = new Uint32Array(this.nodeCount);
        var nodesToVisitLength = 0;
        // BFS for user root objects.
        for (var iter = this.rootNode().edges(); iter.hasNext(); iter.next()) {
            var node = iter.edge.node();
            if (this.isUserRoot(node)) {
                distances[node.ordinal()] = 1;
                nodesToVisit[nodesToVisitLength++] = node.nodeIndex;
            }
        }
        this.bfs(nodesToVisit, nodesToVisitLength, distances, filter);
        // BFS for objects not reached from user roots.
        distances[this.rootNode().ordinal()] =
            nodesToVisitLength > 0 ? HeapSnapshotModel.HeapSnapshotModel.baseSystemDistance : 0;
        nodesToVisit[0] = this.rootNode().nodeIndex;
        nodesToVisitLength = 1;
        this.bfs(nodesToVisit, nodesToVisitLength, distances, filter);
    };
    HeapSnapshot.prototype.bfs = function (nodesToVisit, nodesToVisitLength, distances, filter) {
        // Preload fields into local variables for better performance.
        var edgeFieldsCount = this.edgeFieldsCount;
        var nodeFieldCount = this.nodeFieldCount;
        var containmentEdges = this.containmentEdges;
        var firstEdgeIndexes = this.firstEdgeIndexes;
        var edgeToNodeOffset = this.edgeToNodeOffset;
        var edgeTypeOffset = this.edgeTypeOffset;
        var nodeCount = this.nodeCount;
        var edgeWeakType = this.edgeWeakType;
        var noDistance = this.noDistance;
        var index = 0;
        var edge = this.createEdge(0);
        var node = this.createNode(0);
        while (index < nodesToVisitLength) {
            var nodeIndex = nodesToVisit[index++]; // shift generates too much garbage.
            var nodeOrdinal = nodeIndex / nodeFieldCount;
            var distance = distances[nodeOrdinal] + 1;
            var firstEdgeIndex = firstEdgeIndexes[nodeOrdinal];
            var edgesEnd = firstEdgeIndexes[nodeOrdinal + 1];
            node.nodeIndex = nodeIndex;
            for (var edgeIndex = firstEdgeIndex; edgeIndex < edgesEnd; edgeIndex += edgeFieldsCount) {
                var edgeType = containmentEdges[edgeIndex + edgeTypeOffset];
                if (edgeType === edgeWeakType) {
                    continue;
                }
                var childNodeIndex = containmentEdges[edgeIndex + edgeToNodeOffset];
                var childNodeOrdinal = childNodeIndex / nodeFieldCount;
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
    };
    HeapSnapshot.prototype.buildAggregates = function (filter) {
        var aggregates = {};
        var aggregatesByClassName = {};
        var classIndexes = [];
        var nodes = this.nodes;
        var nodesLength = nodes.length;
        var nodeNativeType = this.nodeNativeType;
        var nodeFieldCount = this.nodeFieldCount;
        var selfSizeOffset = this.nodeSelfSizeOffset;
        var nodeTypeOffset = this.nodeTypeOffset;
        var node = this.rootNode();
        var nodeDistances = this.nodeDistances;
        for (var nodeIndex = 0; nodeIndex < nodesLength; nodeIndex += nodeFieldCount) {
            node.nodeIndex = nodeIndex;
            if (filter && !filter(node)) {
                continue;
            }
            var selfSize = nodes[nodeIndex + selfSizeOffset];
            if (!selfSize && nodes[nodeIndex + nodeTypeOffset] !== nodeNativeType) {
                continue;
            }
            var classIndex = node.classIndex();
            var nodeOrdinal = nodeIndex / nodeFieldCount;
            var distance = nodeDistances[nodeOrdinal];
            if (!(classIndex in aggregates)) {
                var nodeType = node.type();
                var nameMatters = nodeType === 'object' || nodeType === 'native';
                var value = {
                    count: 1,
                    distance: distance,
                    self: selfSize,
                    maxRet: 0,
                    type: nodeType,
                    name: nameMatters ? node.name() : null,
                    idxs: [nodeIndex]
                };
                aggregates[classIndex] = value;
                classIndexes.push(classIndex);
                aggregatesByClassName[node.className()] = value;
            }
            else {
                var clss = aggregates[classIndex];
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
        for (var i = 0, l = classIndexes.length; i < l; ++i) {
            var classIndex = classIndexes[i];
            var classIndexValues = aggregates[classIndex];
            if (!classIndexValues) {
                continue;
            }
            classIndexValues.idxs = classIndexValues.idxs.slice();
        }
        return { aggregatesByClassName: aggregatesByClassName, aggregatesByClassIndex: aggregates };
    };
    HeapSnapshot.prototype.calculateClassesRetainedSize = function (aggregates, filter) {
        var rootNodeIndex = this.rootNodeIndexInternal;
        var node = this.createNode(rootNodeIndex);
        var list = [rootNodeIndex];
        var sizes = [-1];
        var classes = [];
        var seenClassNameIndexes = new Map();
        var nodeFieldCount = this.nodeFieldCount;
        var nodeTypeOffset = this.nodeTypeOffset;
        var nodeNativeType = this.nodeNativeType;
        var dominatedNodes = this.dominatedNodes;
        var nodes = this.nodes;
        var firstDominatedNodeIndex = this.firstDominatedNodeIndex;
        while (list.length) {
            var nodeIndex = list.pop();
            node.nodeIndex = nodeIndex;
            var classIndex = node.classIndex();
            var seen = Boolean(seenClassNameIndexes.get(classIndex));
            var nodeOrdinal = nodeIndex / nodeFieldCount;
            var dominatedIndexFrom = firstDominatedNodeIndex[nodeOrdinal];
            var dominatedIndexTo = firstDominatedNodeIndex[nodeOrdinal + 1];
            if (!seen && (!filter || filter(node)) &&
                (node.selfSize() || nodes[nodeIndex + nodeTypeOffset] === nodeNativeType)) {
                aggregates[classIndex].maxRet += node.retainedSize();
                if (dominatedIndexFrom !== dominatedIndexTo) {
                    seenClassNameIndexes.set(classIndex, true);
                    sizes.push(list.length);
                    classes.push(classIndex);
                }
            }
            for (var i = dominatedIndexFrom; i < dominatedIndexTo; i++) {
                list.push(dominatedNodes[i]);
            }
            var l = list.length;
            while (sizes[sizes.length - 1] === l) {
                sizes.pop();
                classIndex = classes.pop();
                seenClassNameIndexes.set(classIndex, false);
            }
        }
    };
    HeapSnapshot.prototype.sortAggregateIndexes = function (aggregates) {
        var nodeA = this.createNode();
        var nodeB = this.createNode();
        for (var clss in aggregates) {
            aggregates[clss].idxs.sort(function (idxA, idxB) {
                nodeA.nodeIndex = idxA;
                nodeB.nodeIndex = idxB;
                return nodeA.id() < nodeB.id() ? -1 : 1;
            });
        }
    };
    /**
     * The function checks is the edge should be considered during building
     * postorder iterator and dominator tree.
     */
    HeapSnapshot.prototype.isEssentialEdge = function (nodeIndex, edgeType) {
        // Shortcuts at the root node have special meaning of marking user global objects.
        return edgeType !== this.edgeWeakType &&
            (edgeType !== this.edgeShortcutType || nodeIndex === this.rootNodeIndexInternal);
    };
    HeapSnapshot.prototype.buildPostOrderIndex = function () {
        var nodeFieldCount = this.nodeFieldCount;
        var nodeCount = this.nodeCount;
        var rootNodeOrdinal = this.rootNodeIndexInternal / nodeFieldCount;
        var edgeFieldsCount = this.edgeFieldsCount;
        var edgeTypeOffset = this.edgeTypeOffset;
        var edgeToNodeOffset = this.edgeToNodeOffset;
        var firstEdgeIndexes = this.firstEdgeIndexes;
        var containmentEdges = this.containmentEdges;
        var mapAndFlag = this.userObjectsMapAndFlag();
        var flags = mapAndFlag ? mapAndFlag.map : null;
        var flag = mapAndFlag ? mapAndFlag.flag : 0;
        var stackNodes = new Uint32Array(nodeCount);
        var stackCurrentEdge = new Uint32Array(nodeCount);
        var postOrderIndex2NodeOrdinal = new Uint32Array(nodeCount);
        var nodeOrdinal2PostOrderIndex = new Uint32Array(nodeCount);
        var visited = new Uint8Array(nodeCount);
        var postOrderIndex = 0;
        var stackTop = 0;
        stackNodes[0] = rootNodeOrdinal;
        stackCurrentEdge[0] = firstEdgeIndexes[rootNodeOrdinal];
        visited[rootNodeOrdinal] = 1;
        var iteration = 0;
        while (true) {
            ++iteration;
            while (stackTop >= 0) {
                var nodeOrdinal = stackNodes[stackTop];
                var edgeIndex = stackCurrentEdge[stackTop];
                var edgesEnd = firstEdgeIndexes[nodeOrdinal + 1];
                if (edgeIndex < edgesEnd) {
                    stackCurrentEdge[stackTop] += edgeFieldsCount;
                    var edgeType = containmentEdges[edgeIndex + edgeTypeOffset];
                    if (!this.isEssentialEdge(nodeOrdinal * nodeFieldCount, edgeType)) {
                        continue;
                    }
                    var childNodeIndex = containmentEdges[edgeIndex + edgeToNodeOffset];
                    var childNodeOrdinal = childNodeIndex / nodeFieldCount;
                    if (visited[childNodeOrdinal]) {
                        continue;
                    }
                    var nodeFlag = !flags || (flags[nodeOrdinal] & flag);
                    var childNodeFlag = !flags || (flags[childNodeOrdinal] & flag);
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
            var errors = new HeapSnapshotProblemReport("Heap snapshot: " + (nodeCount - postOrderIndex) + " nodes are unreachable from the root. Following nodes have only weak retainers:");
            var dumpNode = this.rootNode();
            // Remove root from the result (last node in the array) and put it at the bottom of the stack so that it is
            // visited after all orphan nodes and their subgraphs.
            --postOrderIndex;
            stackTop = 0;
            stackNodes[0] = rootNodeOrdinal;
            stackCurrentEdge[0] = firstEdgeIndexes[rootNodeOrdinal + 1]; // no need to reiterate its edges
            for (var i = 0; i < nodeCount; ++i) {
                if (visited[i] || !this.hasOnlyWeakRetainers(i)) {
                    continue;
                }
                // Add all nodes that have only weak retainers to traverse their subgraphs.
                stackNodes[++stackTop] = i;
                stackCurrentEdge[stackTop] = firstEdgeIndexes[i];
                visited[i] = 1;
                dumpNode.nodeIndex = i * nodeFieldCount;
                var retainers = [];
                for (var it = dumpNode.retainers(); it.hasNext(); it.next()) {
                    retainers.push(it.item().node().name() + "@" + it.item().node().id() + "." + it.item().name());
                }
                errors.addError(dumpNode.name() + " @" + dumpNode.id() + "  weak retainers: " + retainers.join(', '));
            }
            // console.warn(errors.toString());
        }
        // If we already processed all orphan nodes that have only weak retainers and still have some orphans...
        if (postOrderIndex !== nodeCount) {
            var errors = new HeapSnapshotProblemReport('Still found ' + (nodeCount - postOrderIndex) + ' unreachable nodes in heap snapshot:');
            var dumpNode = this.rootNode();
            // Remove root from the result (last node in the array) and put it at the bottom of the stack so that it is
            // visited after all orphan nodes and their subgraphs.
            --postOrderIndex;
            for (var i = 0; i < nodeCount; ++i) {
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
            // console.warn(errors.toString());
        }
        return {
            postOrderIndex2NodeOrdinal: postOrderIndex2NodeOrdinal,
            nodeOrdinal2PostOrderIndex: nodeOrdinal2PostOrderIndex
        };
    };
    HeapSnapshot.prototype.hasOnlyWeakRetainers = function (nodeOrdinal) {
        var edgeTypeOffset = this.edgeTypeOffset;
        var edgeWeakType = this.edgeWeakType;
        var edgeShortcutType = this.edgeShortcutType;
        var containmentEdges = this.containmentEdges;
        var retainingEdges = this.retainingEdges;
        var beginRetainerIndex = this.firstRetainerIndex[nodeOrdinal];
        var endRetainerIndex = this.firstRetainerIndex[nodeOrdinal + 1];
        for (var retainerIndex = beginRetainerIndex; retainerIndex < endRetainerIndex; ++retainerIndex) {
            var retainerEdgeIndex = retainingEdges[retainerIndex];
            var retainerEdgeType = containmentEdges[retainerEdgeIndex + edgeTypeOffset];
            if (retainerEdgeType !== edgeWeakType && retainerEdgeType !== edgeShortcutType) {
                return false;
            }
        }
        return true;
    };
    // The algorithm is based on the article:
    // K. Cooper, T. Harvey and K. Kennedy "A Simple, Fast Dominance Algorithm"
    // Softw. Pract. Exper. 4 (2001), pp. 1-10.
    HeapSnapshot.prototype.buildDominatorTree = function (postOrderIndex2NodeOrdinal, nodeOrdinal2PostOrderIndex) {
        var nodeFieldCount = this.nodeFieldCount;
        var firstRetainerIndex = this.firstRetainerIndex;
        var retainingNodes = this.retainingNodes;
        var retainingEdges = this.retainingEdges;
        var edgeFieldsCount = this.edgeFieldsCount;
        var edgeTypeOffset = this.edgeTypeOffset;
        var edgeToNodeOffset = this.edgeToNodeOffset;
        var firstEdgeIndexes = this.firstEdgeIndexes;
        var containmentEdges = this.containmentEdges;
        var rootNodeIndex = this.rootNodeIndexInternal;
        var mapAndFlag = this.userObjectsMapAndFlag();
        var flags = mapAndFlag ? mapAndFlag.map : null;
        var flag = mapAndFlag ? mapAndFlag.flag : 0;
        var nodesCount = postOrderIndex2NodeOrdinal.length;
        var rootPostOrderedIndex = nodesCount - 1;
        var noEntry = nodesCount;
        var dominators = new Uint32Array(nodesCount);
        for (var i = 0; i < rootPostOrderedIndex; ++i) {
            dominators[i] = noEntry;
        }
        dominators[rootPostOrderedIndex] = rootPostOrderedIndex;
        // The affected array is used to mark entries which dominators
        // have to be racalculated because of changes in their retainers.
        var affected = new Uint8Array(nodesCount);
        var nodeOrdinal;
        { // Mark the root direct children as affected.
            nodeOrdinal = this.rootNodeIndexInternal / nodeFieldCount;
            var endEdgeIndex = firstEdgeIndexes[nodeOrdinal + 1];
            for (var edgeIndex = firstEdgeIndexes[nodeOrdinal]; edgeIndex < endEdgeIndex; edgeIndex += edgeFieldsCount) {
                var edgeType = containmentEdges[edgeIndex + edgeTypeOffset];
                if (!this.isEssentialEdge(this.rootNodeIndexInternal, edgeType)) {
                    continue;
                }
                var childNodeOrdinal = containmentEdges[edgeIndex + edgeToNodeOffset] / nodeFieldCount;
                affected[nodeOrdinal2PostOrderIndex[childNodeOrdinal]] = 1;
            }
        }
        var changed = true;
        while (changed) {
            changed = false;
            for (var postOrderIndex = rootPostOrderedIndex - 1; postOrderIndex >= 0; --postOrderIndex) {
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
                var nodeFlag = !flags || (flags[nodeOrdinal] & flag);
                var newDominatorIndex = noEntry;
                var beginRetainerIndex = firstRetainerIndex[nodeOrdinal];
                var endRetainerIndex = firstRetainerIndex[nodeOrdinal + 1];
                var orphanNode = true;
                for (var retainerIndex = beginRetainerIndex; retainerIndex < endRetainerIndex; ++retainerIndex) {
                    var retainerEdgeIndex = retainingEdges[retainerIndex];
                    var retainerEdgeType = containmentEdges[retainerEdgeIndex + edgeTypeOffset];
                    var retainerNodeIndex = retainingNodes[retainerIndex];
                    if (!this.isEssentialEdge(retainerNodeIndex, retainerEdgeType)) {
                        continue;
                    }
                    orphanNode = false;
                    var retainerNodeOrdinal = retainerNodeIndex / nodeFieldCount;
                    var retainerNodeFlag = !flags || (flags[retainerNodeOrdinal] & flag);
                    // We are skipping the edges from non-page-owned nodes to page-owned nodes.
                    // Otherwise the dominators for the objects that also were retained by debugger would be affected.
                    if (retainerNodeIndex !== rootNodeIndex && nodeFlag && !retainerNodeFlag) {
                        continue;
                    }
                    var retanerPostOrderIndex = nodeOrdinal2PostOrderIndex[retainerNodeOrdinal];
                    if (dominators[retanerPostOrderIndex] !== noEntry) {
                        if (newDominatorIndex === noEntry) {
                            newDominatorIndex = retanerPostOrderIndex;
                        }
                        else {
                            while (retanerPostOrderIndex !== newDominatorIndex) {
                                while (retanerPostOrderIndex < newDominatorIndex) {
                                    retanerPostOrderIndex = dominators[retanerPostOrderIndex];
                                }
                                while (newDominatorIndex < retanerPostOrderIndex) {
                                    newDominatorIndex = dominators[newDominatorIndex];
                                }
                            }
                        }
                        // If idom has already reached the root, it doesn't make sense
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
                    var beginEdgeToNodeFieldIndex = firstEdgeIndexes[nodeOrdinal] + edgeToNodeOffset;
                    var endEdgeToNodeFieldIndex = firstEdgeIndexes[nodeOrdinal + 1];
                    for (var toNodeFieldIndex = beginEdgeToNodeFieldIndex; toNodeFieldIndex < endEdgeToNodeFieldIndex; toNodeFieldIndex += edgeFieldsCount) {
                        var childNodeOrdinal = containmentEdges[toNodeFieldIndex] / nodeFieldCount;
                        affected[nodeOrdinal2PostOrderIndex[childNodeOrdinal]] = 1;
                    }
                }
            }
        }
        var dominatorsTree = new Uint32Array(nodesCount);
        for (var postOrderIndex = 0, l = dominators.length; postOrderIndex < l; ++postOrderIndex) {
            nodeOrdinal = postOrderIndex2NodeOrdinal[postOrderIndex];
            dominatorsTree[nodeOrdinal] = postOrderIndex2NodeOrdinal[dominators[postOrderIndex]];
        }
        return dominatorsTree;
    };
    HeapSnapshot.prototype.calculateRetainedSizes = function (postOrderIndex2NodeOrdinal) {
        var nodeCount = this.nodeCount;
        var nodes = this.nodes;
        var nodeSelfSizeOffset = this.nodeSelfSizeOffset;
        var nodeFieldCount = this.nodeFieldCount;
        var dominatorsTree = this.dominatorsTree;
        var retainedSizes = this.retainedSizes;
        for (var nodeOrdinal = 0; nodeOrdinal < nodeCount; ++nodeOrdinal) {
            retainedSizes[nodeOrdinal] = nodes[nodeOrdinal * nodeFieldCount + nodeSelfSizeOffset];
        }
        // Propagate retained sizes for each node excluding root.
        for (var postOrderIndex = 0; postOrderIndex < nodeCount - 1; ++postOrderIndex) {
            var nodeOrdinal = postOrderIndex2NodeOrdinal[postOrderIndex];
            var dominatorOrdinal = dominatorsTree[nodeOrdinal];
            retainedSizes[dominatorOrdinal] += retainedSizes[nodeOrdinal];
        }
    };
    HeapSnapshot.prototype.buildDominatedNodes = function () {
        // Builds up two arrays:
        //  - "dominatedNodes" is a continuous array, where each node owns an
        //    interval (can be empty) with corresponding dominated nodes.
        //  - "indexArray" is an array of indexes in the "dominatedNodes"
        //    with the same positions as in the _nodeIndex.
        var indexArray = this.firstDominatedNodeIndex;
        // All nodes except the root have dominators.
        var dominatedNodes = this.dominatedNodes;
        // Count the number of dominated nodes for each node. Skip the root (node at
        // index 0) as it is the only node that dominates itself.
        var nodeFieldCount = this.nodeFieldCount;
        var dominatorsTree = this.dominatorsTree;
        var fromNodeOrdinal = 0;
        var toNodeOrdinal = this.nodeCount;
        var rootNodeOrdinal = this.rootNodeIndexInternal / nodeFieldCount;
        if (rootNodeOrdinal === fromNodeOrdinal) {
            fromNodeOrdinal = 1;
        }
        else if (rootNodeOrdinal === toNodeOrdinal - 1) {
            toNodeOrdinal = toNodeOrdinal - 1;
        }
        else {
            throw new Error('Root node is expected to be either first or last');
        }
        for (var nodeOrdinal = fromNodeOrdinal; nodeOrdinal < toNodeOrdinal; ++nodeOrdinal) {
            ++indexArray[dominatorsTree[nodeOrdinal]];
        }
        // Put in the first slot of each dominatedNodes slice the count of entries
        // that will be filled.
        var firstDominatedNodeIndex = 0;
        for (var i = 0, l = this.nodeCount; i < l; ++i) {
            var dominatedCount = dominatedNodes[firstDominatedNodeIndex] = indexArray[i];
            indexArray[i] = firstDominatedNodeIndex;
            firstDominatedNodeIndex += dominatedCount;
        }
        indexArray[this.nodeCount] = dominatedNodes.length;
        // Fill up the dominatedNodes array with indexes of dominated nodes. Skip the root (node at
        // index 0) as it is the only node that dominates itself.
        for (var nodeOrdinal = fromNodeOrdinal; nodeOrdinal < toNodeOrdinal; ++nodeOrdinal) {
            var dominatorOrdinal = dominatorsTree[nodeOrdinal];
            var dominatedRefIndex = indexArray[dominatorOrdinal];
            dominatedRefIndex += (--dominatedNodes[dominatedRefIndex]);
            dominatedNodes[dominatedRefIndex] = nodeOrdinal * nodeFieldCount;
        }
    };
    /**
     * Iterates children of a node.
     */
    HeapSnapshot.prototype.iterateFilteredChildren = function (nodeOrdinal, edgeFilterCallback, childCallback) {
        var beginEdgeIndex = this.firstEdgeIndexes[nodeOrdinal];
        var endEdgeIndex = this.firstEdgeIndexes[nodeOrdinal + 1];
        for (var edgeIndex = beginEdgeIndex; edgeIndex < endEdgeIndex; edgeIndex += this.edgeFieldsCount) {
            var childNodeIndex = this.containmentEdges[edgeIndex + this.edgeToNodeOffset];
            var childNodeOrdinal = childNodeIndex / this.nodeFieldCount;
            var type = this.containmentEdges[edgeIndex + this.edgeTypeOffset];
            if (!edgeFilterCallback(type)) {
                continue;
            }
            childCallback(childNodeOrdinal);
        }
    };
    /**
     * Adds a string to the snapshot.
     */
    HeapSnapshot.prototype.addString = function (string) {
        this.strings.push(string);
        return this.strings.length - 1;
    };
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
    HeapSnapshot.prototype.propagateDOMState = function () {
        if (this.nodeDetachednessOffset === -1) {
            return;
        }
        // console.time('propagateDOMState');
        var visited = new Uint8Array(this.nodeCount);
        var attached = [];
        var detached = [];
        var stringIndexCache = new Map();
        /**
         * Adds a 'Detached ' prefix to the name of a node.
         */
        var addDetachedPrefixToNodeName = function (snapshot, nodeIndex) {
            var oldStringIndex = snapshot.nodes[nodeIndex + snapshot.nodeNameOffset];
            var newStringIndex = stringIndexCache.get(oldStringIndex);
            if (newStringIndex === undefined) {
                newStringIndex = snapshot.addString('Detached ' + snapshot.strings[oldStringIndex]);
                stringIndexCache.set(oldStringIndex, newStringIndex);
            }
            snapshot.nodes[nodeIndex + snapshot.nodeNameOffset] = newStringIndex;
        };
        /**
         * Processes a node represented by nodeOrdinal:
         * - Changes its name based on newState.
         * - Puts it onto working sets for attached or detached nodes.
         */
        var processNode = function (snapshot, nodeOrdinal, newState) {
            if (visited[nodeOrdinal]) {
                return;
            }
            var nodeIndex = nodeOrdinal * snapshot.nodeFieldCount;
            // Early bailout: Do not propagate the state (and name change) through JavaScript. Every
            // entry point into embedder code is a node that knows its own state. All embedder nodes
            // have their node type set to native.
            if (snapshot.nodes[nodeIndex + snapshot.nodeTypeOffset] !== snapshot.nodeNativeType) {
                visited[nodeOrdinal] = 1;
                return;
            }
            snapshot.nodes[nodeIndex + snapshot.nodeDetachednessOffset] = newState;
            if (newState === 1 /* Attached */) {
                attached.push(nodeOrdinal);
            }
            else if (newState === 2 /* Detached */) {
                // Detached state: Rewire node name.
                addDetachedPrefixToNodeName(snapshot, nodeIndex);
                detached.push(nodeOrdinal);
            }
            visited[nodeOrdinal] = 1;
        };
        var propagateState = function (snapshot, parentNodeOrdinal, newState) {
            snapshot.iterateFilteredChildren(parentNodeOrdinal, function (edgeType) { return ![snapshot.edgeHiddenType, snapshot.edgeInvisibleType, snapshot.edgeWeakType].includes(edgeType); }, function (nodeOrdinal) { return processNode(snapshot, nodeOrdinal, newState); });
        };
        // 1. We re-use the deserialized field to store the propagated state. While
        //    the state for known nodes is already set, they still need to go
        //    through processing to have their name adjusted and them enqueued in
        //    the respective queues.
        for (var nodeOrdinal = 0; nodeOrdinal < this.nodeCount; ++nodeOrdinal) {
            var state = this.nodes[nodeOrdinal * this.nodeFieldCount + this.nodeDetachednessOffset];
            // Bail out for objects that have no known state. For all other objects set that state.
            if (state === 0 /* Unknown */) {
                continue;
            }
            processNode(this, nodeOrdinal, state);
        }
        // 2. If the parent is attached, then the child is also attached.
        while (attached.length !== 0) {
            var nodeOrdinal = attached.pop();
            propagateState(this, nodeOrdinal, 1 /* Attached */);
        }
        // 3. If the parent is not attached, then the child inherits the parent's state.
        while (detached.length !== 0) {
            var nodeOrdinal = detached.pop();
            var nodeState = this.nodes[nodeOrdinal * this.nodeFieldCount + this.nodeDetachednessOffset];
            // Ignore if the node has been found through propagating forward attached state.
            if (nodeState === 1 /* Attached */) {
                continue;
            }
            propagateState(this, nodeOrdinal, 2 /* Detached */);
        }
        // console.timeEnd('propagateDOMState');
    };
    HeapSnapshot.prototype.buildSamples = function () {
        var samples = this.rawSamples;
        if (!samples || !samples.length) {
            return;
        }
        var sampleCount = samples.length / 2;
        var sizeForRange = new Array(sampleCount);
        var timestamps = new Array(sampleCount);
        var lastAssignedIds = new Array(sampleCount);
        var timestampOffset = this.metaNode.sample_fields.indexOf('timestamp_us');
        var lastAssignedIdOffset = this.metaNode.sample_fields.indexOf('last_assigned_id');
        for (var i = 0; i < sampleCount; i++) {
            sizeForRange[i] = 0;
            timestamps[i] = (samples[2 * i + timestampOffset]) / 1000;
            lastAssignedIds[i] = samples[2 * i + lastAssignedIdOffset];
        }
        var nodes = this.nodes;
        var nodesLength = nodes.length;
        var nodeFieldCount = this.nodeFieldCount;
        var node = this.rootNode();
        for (var nodeIndex = 0; nodeIndex < nodesLength; nodeIndex += nodeFieldCount) {
            node.nodeIndex = nodeIndex;
            var nodeId = node.id();
            // JS objects have odd ids, skip native objects.
            if (nodeId % 2 === 0) {
                continue;
            }
            var rangeIndex = Platform.ArrayUtilities.lowerBound(lastAssignedIds, nodeId, Platform.ArrayUtilities.DEFAULT_COMPARATOR);
            if (rangeIndex === sampleCount) {
                // TODO: make heap profiler not allocate while taking snapshot
                continue;
            }
            sizeForRange[rangeIndex] += node.selfSize();
        }
        this.samples = new HeapSnapshotModel.HeapSnapshotModel.Samples(timestamps, lastAssignedIds, sizeForRange);
    };
    HeapSnapshot.prototype.buildLocationMap = function () {
        var map = new Map();
        var locations = this.locations;
        for (var i = 0; i < locations.length; i += this.locationFieldCount) {
            var nodeIndex = locations[i + this.locationIndexOffset];
            var scriptId = locations[i + this.locationScriptIdOffset];
            var line = locations[i + this.locationLineOffset];
            var col = locations[i + this.locationColumnOffset];
            map.set(nodeIndex, new HeapSnapshotModel.HeapSnapshotModel.Location(scriptId, line, col));
        }
        this.locationMap = map;
    };
    HeapSnapshot.prototype.getLocation = function (nodeIndex) {
        return this.locationMap.get(nodeIndex) || null;
    };
    HeapSnapshot.prototype.getSamples = function () {
        return this.samples;
    };
    HeapSnapshot.prototype.calculateFlags = function () {
        throw new Error('Not implemented');
    };
    HeapSnapshot.prototype.calculateStatistics = function () {
        throw new Error('Not implemented');
    };
    HeapSnapshot.prototype.userObjectsMapAndFlag = function () {
        throw new Error('Not implemented');
    };
    HeapSnapshot.prototype.calculateSnapshotDiff = function (baseSnapshotId, baseSnapshotAggregates) {
        var snapshotDiff = this.snapshotDiffs[baseSnapshotId];
        if (snapshotDiff) {
            return snapshotDiff;
        }
        snapshotDiff = {};
        var aggregates = this.getAggregatesByClassName(true, 'allObjects');
        for (var className in baseSnapshotAggregates) {
            var baseAggregate = baseSnapshotAggregates[className];
            var diff = this.calculateDiffForClass(baseAggregate, aggregates[className]);
            if (diff) {
                snapshotDiff[className] = diff;
            }
        }
        var emptyBaseAggregate = new HeapSnapshotModel.HeapSnapshotModel.AggregateForDiff();
        for (var className in aggregates) {
            if (className in baseSnapshotAggregates) {
                continue;
            }
            var classDiff = this.calculateDiffForClass(emptyBaseAggregate, aggregates[className]);
            if (classDiff) {
                snapshotDiff[className] = classDiff;
            }
        }
        this.snapshotDiffs[baseSnapshotId] = snapshotDiff;
        return snapshotDiff;
    };
    HeapSnapshot.prototype.calculateDiffForClass = function (baseAggregate, aggregate) {
        var baseIds = baseAggregate.ids;
        var baseIndexes = baseAggregate.indexes;
        var baseSelfSizes = baseAggregate.selfSizes;
        var indexes = aggregate ? aggregate.idxs : [];
        var i = 0;
        var j = 0;
        var l = baseIds.length;
        var m = indexes.length;
        var diff = new HeapSnapshotModel.HeapSnapshotModel.Diff();
        var nodeB = this.createNode(indexes[j]);
        while (i < l && j < m) {
            var nodeAId = baseIds[i];
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
    };
    HeapSnapshot.prototype.nodeForSnapshotObjectId = function (snapshotObjectId) {
        for (var it = this.allNodes(); it.hasNext(); it.next()) {
            if (it.node.id() === snapshotObjectId) {
                return it.node;
            }
        }
        return null;
    };
    HeapSnapshot.prototype.nodeClassName = function (snapshotObjectId) {
        var node = this.nodeForSnapshotObjectId(snapshotObjectId);
        if (node) {
            return node.className();
        }
        return null;
    };
    HeapSnapshot.prototype.idsOfObjectsWithName = function (name) {
        var ids = [];
        for (var it = this.allNodes(); it.hasNext(); it.next()) {
            if (it.item().name() === name) {
                ids.push(it.item().id());
            }
        }
        return ids;
    };
    HeapSnapshot.prototype.createEdgesProvider = function (nodeIndex) {
        var node = this.createNode(nodeIndex);
        var filter = this.containmentEdgesFilter();
        var indexProvider = new HeapSnapshotEdgeIndexProvider(this);
        return new HeapSnapshotEdgesProvider(this, filter, node.edges(), indexProvider);
    };
    HeapSnapshot.prototype.createEdgesProviderForTest = function (nodeIndex, filter) {
        var node = this.createNode(nodeIndex);
        var indexProvider = new HeapSnapshotEdgeIndexProvider(this);
        return new HeapSnapshotEdgesProvider(this, filter, node.edges(), indexProvider);
    };
    HeapSnapshot.prototype.retainingEdgesFilter = function () {
        return null;
    };
    HeapSnapshot.prototype.containmentEdgesFilter = function () {
        return null;
    };
    HeapSnapshot.prototype.createRetainingEdgesProvider = function (nodeIndex) {
        var node = this.createNode(nodeIndex);
        var filter = this.retainingEdgesFilter();
        var indexProvider = new HeapSnapshotRetainerEdgeIndexProvider(this);
        return new HeapSnapshotEdgesProvider(this, filter, node.retainers(), indexProvider);
    };
    HeapSnapshot.prototype.createAddedNodesProvider = function (baseSnapshotId, className) {
        var snapshotDiff = this.snapshotDiffs[baseSnapshotId];
        var diffForClass = snapshotDiff[className];
        return new HeapSnapshotNodesProvider(this, diffForClass.addedIndexes);
    };
    HeapSnapshot.prototype.createDeletedNodesProvider = function (nodeIndexes) {
        return new HeapSnapshotNodesProvider(this, nodeIndexes);
    };
    HeapSnapshot.prototype.createNodesProviderForClass = function (className, nodeFilter) {
        return new HeapSnapshotNodesProvider(this, this.aggregatesWithFilter(nodeFilter)[className].idxs);
    };
    HeapSnapshot.prototype.maxJsNodeId = function () {
        var nodeFieldCount = this.nodeFieldCount;
        var nodes = this.nodes;
        var nodesLength = nodes.length;
        var id = 0;
        for (var nodeIndex = this.nodeIdOffset; nodeIndex < nodesLength; nodeIndex += nodeFieldCount) {
            var nextId = nodes[nodeIndex];
            // JS objects have odd ids, skip native objects.
            if (nextId % 2 === 0) {
                continue;
            }
            if (id < nextId) {
                id = nextId;
            }
        }
        return id;
    };
    HeapSnapshot.prototype.updateStaticData = function () {
        return new HeapSnapshotModel.HeapSnapshotModel.StaticData(this.nodeCount, this.rootNodeIndexInternal, this.totalSize, this.maxJsNodeId());
    };
    return HeapSnapshot;
}());
export { HeapSnapshot };
var HeapSnapshotMetainfo = /** @class */ (function () {
    function HeapSnapshotMetainfo() {
        this.location_fields = []; // eslint-disable-line @typescript-eslint/naming-convention
        this.node_fields = []; // eslint-disable-line @typescript-eslint/naming-convention
        this.node_types = []; // eslint-disable-line @typescript-eslint/naming-convention
        this.edge_fields = []; // eslint-disable-line @typescript-eslint/naming-convention
        this.edge_types = []; // eslint-disable-line @typescript-eslint/naming-convention
        this.trace_function_info_fields = []; // eslint-disable-line @typescript-eslint/naming-convention
        this.trace_node_fields = []; // eslint-disable-line @typescript-eslint/naming-convention
        this.sample_fields = []; // eslint-disable-line @typescript-eslint/naming-convention
        this.type_strings = {}; // eslint-disable-line @typescript-eslint/naming-convention
    }
    return HeapSnapshotMetainfo;
}());
var HeapSnapshotHeader = /** @class */ (function () {
    function HeapSnapshotHeader() {
        // New format.
        this.title = '';
        this.meta = new HeapSnapshotMetainfo();
        this.node_count = 0;
        this.edge_count = 0;
        this.trace_function_count = 0;
        this.root_index = 0;
    }
    return HeapSnapshotHeader;
}());
export { HeapSnapshotHeader };
var HeapSnapshotItemProvider = /** @class */ (function () {
    function HeapSnapshotItemProvider(iterator, indexProvider) {
        this.iterator = iterator;
        this.indexProvider = indexProvider;
        this.isEmptyInternal = !iterator.hasNext();
        this.iterationOrder = null;
        this.currentComparator = null;
        this.sortedPrefixLength = 0;
        this.sortedSuffixLength = 0;
    }
    HeapSnapshotItemProvider.prototype.createIterationOrder = function () {
        if (this.iterationOrder) {
            return;
        }
        this.iterationOrder = [];
        for (var iterator = this.iterator; iterator.hasNext(); iterator.next()) {
            this.iterationOrder.push(iterator.item().itemIndex());
        }
    };
    HeapSnapshotItemProvider.prototype.isEmpty = function () {
        return this.isEmptyInternal;
    };
    HeapSnapshotItemProvider.prototype.serializeItemsRange = function (begin, end) {
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
        if (this.sortedPrefixLength < end && begin < this.iterationOrder.length - this.sortedSuffixLength &&
            this.currentComparator) {
            var currentComparator = this.currentComparator;
            this.sort(currentComparator, this.sortedPrefixLength, this.iterationOrder.length - 1 - this.sortedSuffixLength, begin, end - 1);
            if (begin <= this.sortedPrefixLength) {
                this.sortedPrefixLength = end;
            }
            if (end >= this.iterationOrder.length - this.sortedSuffixLength) {
                this.sortedSuffixLength = this.iterationOrder.length - begin;
            }
        }
        var position = begin;
        var count = end - begin;
        var result = new Array(count);
        for (var i = 0; i < count; ++i) {
            var itemIndex = this.iterationOrder[position++];
            var item = this.indexProvider.itemForIndex(itemIndex);
            result[i] = item.serialize();
        }
        return new HeapSnapshotModel.HeapSnapshotModel.ItemsRange(begin, end, this.iterationOrder.length, result);
    };
    HeapSnapshotItemProvider.prototype.sortAndRewind = function (comparator) {
        this.currentComparator = comparator;
        this.sortedPrefixLength = 0;
        this.sortedSuffixLength = 0;
    };
    return HeapSnapshotItemProvider;
}());
export { HeapSnapshotItemProvider };
var HeapSnapshotEdgesProvider = /** @class */ (function (_super) {
    __extends(HeapSnapshotEdgesProvider, _super);
    function HeapSnapshotEdgesProvider(snapshot, filter, edgesIter, indexProvider) {
        var _this = this;
        var iter = filter ? new HeapSnapshotFilteredIterator(edgesIter, filter) :
            edgesIter;
        _this = _super.call(this, iter, indexProvider) || this;
        _this.snapshot = snapshot;
        return _this;
    }
    HeapSnapshotEdgesProvider.prototype.sort = function (comparator, leftBound, rightBound, windowLeft, windowRight) {
        var fieldName1 = comparator.fieldName1;
        var fieldName2 = comparator.fieldName2;
        var ascending1 = comparator.ascending1;
        var ascending2 = comparator.ascending2;
        var edgeA = this.iterator.item().clone();
        var edgeB = edgeA.clone();
        var nodeA = this.snapshot.createNode();
        var nodeB = this.snapshot.createNode();
        function compareEdgeFieldName(ascending, indexA, indexB) {
            edgeA.edgeIndex = indexA;
            edgeB.edgeIndex = indexB;
            if (edgeB.name() === '__proto__') {
                return -1;
            }
            if (edgeA.name() === '__proto__') {
                return 1;
            }
            var result = edgeA.hasStringName() === edgeB.hasStringName() ?
                (edgeA.name() < edgeB.name() ? -1 : (edgeA.name() > edgeB.name() ? 1 : 0)) :
                (edgeA.hasStringName() ? -1 : 1);
            return ascending ? result : -result;
        }
        function compareNodeField(fieldName, ascending, indexA, indexB) {
            edgeA.edgeIndex = indexA;
            nodeA.nodeIndex = edgeA.nodeIndex();
            // TODO(crbug.com/1172300) Ignored during the jsdoc to ts migration)
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            var valueA = nodeA[fieldName]();
            edgeB.edgeIndex = indexB;
            nodeB.nodeIndex = edgeB.nodeIndex();
            // TODO(crbug.com/1172300) Ignored during the jsdoc to ts migration)
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            var valueB = nodeB[fieldName]();
            var result = valueA < valueB ? -1 : (valueA > valueB ? 1 : 0);
            return ascending ? result : -result;
        }
        function compareEdgeAndNode(indexA, indexB) {
            var result = compareEdgeFieldName(ascending1, indexA, indexB);
            if (result === 0) {
                result = compareNodeField(fieldName2, ascending2, indexA, indexB);
            }
            if (result === 0) {
                return indexA - indexB;
            }
            return result;
        }
        function compareNodeAndEdge(indexA, indexB) {
            var result = compareNodeField(fieldName1, ascending1, indexA, indexB);
            if (result === 0) {
                result = compareEdgeFieldName(ascending2, indexA, indexB);
            }
            if (result === 0) {
                return indexA - indexB;
            }
            return result;
        }
        function compareNodeAndNode(indexA, indexB) {
            var result = compareNodeField(fieldName1, ascending1, indexA, indexB);
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
        if (fieldName1 === '!edgeName') {
            Platform.ArrayUtilities.sortRange(this.iterationOrder, compareEdgeAndNode, leftBound, rightBound, windowLeft, windowRight);
        }
        else if (fieldName2 === '!edgeName') {
            Platform.ArrayUtilities.sortRange(this.iterationOrder, compareNodeAndEdge, leftBound, rightBound, windowLeft, windowRight);
        }
        else {
            Platform.ArrayUtilities.sortRange(this.iterationOrder, compareNodeAndNode, leftBound, rightBound, windowLeft, windowRight);
        }
    };
    return HeapSnapshotEdgesProvider;
}(HeapSnapshotItemProvider));
export { HeapSnapshotEdgesProvider };
var HeapSnapshotNodesProvider = /** @class */ (function (_super) {
    __extends(HeapSnapshotNodesProvider, _super);
    function HeapSnapshotNodesProvider(snapshot, nodeIndexes) {
        var _this = this;
        var indexProvider = new HeapSnapshotNodeIndexProvider(snapshot);
        var it = new HeapSnapshotIndexRangeIterator(indexProvider, nodeIndexes);
        _this = _super.call(this, it, indexProvider) || this;
        _this.snapshot = snapshot;
        return _this;
    }
    HeapSnapshotNodesProvider.prototype.nodePosition = function (snapshotObjectId) {
        this.createIterationOrder();
        var node = this.snapshot.createNode();
        var i = 0;
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
        var targetNodeIndex = this.iterationOrder[i];
        var smallerCount = 0;
        var currentComparator = this.currentComparator;
        var compare = this.buildCompareFunction(currentComparator);
        for (var i_1 = 0; i_1 < this.iterationOrder.length; i_1++) {
            if (compare(this.iterationOrder[i_1], targetNodeIndex) < 0) {
                ++smallerCount;
            }
        }
        return smallerCount;
    };
    HeapSnapshotNodesProvider.prototype.buildCompareFunction = function (comparator) {
        var nodeA = this.snapshot.createNode();
        var nodeB = this.snapshot.createNode();
        // TODO(crbug.com/1172300) Ignored during the jsdoc to ts migration)
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        var fieldAccessor1 = nodeA[comparator.fieldName1];
        // TODO(crbug.com/1172300) Ignored during the jsdoc to ts migration)
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        var fieldAccessor2 = nodeA[comparator.fieldName2];
        var ascending1 = comparator.ascending1 ? 1 : -1;
        var ascending2 = comparator.ascending2 ? 1 : -1;
        // TODO(crbug.com/1172300) Ignored during the jsdoc to ts migration)
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        function sortByNodeField(fieldAccessor, ascending) {
            var valueA = fieldAccessor.call(nodeA);
            var valueB = fieldAccessor.call(nodeB);
            return valueA < valueB ? -ascending : (valueA > valueB ? ascending : 0);
        }
        function sortByComparator(indexA, indexB) {
            nodeA.nodeIndex = indexA;
            nodeB.nodeIndex = indexB;
            var result = sortByNodeField(fieldAccessor1, ascending1);
            if (result === 0) {
                result = sortByNodeField(fieldAccessor2, ascending2);
            }
            return result || indexA - indexB;
        }
        return sortByComparator;
    };
    HeapSnapshotNodesProvider.prototype.sort = function (comparator, leftBound, rightBound, windowLeft, windowRight) {
        if (!this.iterationOrder) {
            throw new Error('Iteration order not defined');
        }
        Platform.ArrayUtilities.sortRange(this.iterationOrder, this.buildCompareFunction(comparator), leftBound, rightBound, windowLeft, windowRight);
    };
    return HeapSnapshotNodesProvider;
}(HeapSnapshotItemProvider));
export { HeapSnapshotNodesProvider };
var JSHeapSnapshot = /** @class */ (function (_super) {
    __extends(JSHeapSnapshot, _super);
    function JSHeapSnapshot(profile, progress) {
        var _this = _super.call(this, profile, progress) || this;
        _this.nodeFlags = {
            // bit flags
            canBeQueried: 1,
            detachedDOMTreeNode: 2,
            pageObject: 4
        };
        _this.lazyStringCache = {};
        _this.initialize();
        return _this;
    }
    JSHeapSnapshot.prototype.createNode = function (nodeIndex) {
        return new JSHeapSnapshotNode(this, nodeIndex === undefined ? -1 : nodeIndex);
    };
    JSHeapSnapshot.prototype.createEdge = function (edgeIndex) {
        return new JSHeapSnapshotEdge(this, edgeIndex);
    };
    JSHeapSnapshot.prototype.createRetainingEdge = function (retainerIndex) {
        return new JSHeapSnapshotRetainerEdge(this, retainerIndex);
    };
    JSHeapSnapshot.prototype.containmentEdgesFilter = function () {
        return function (edge) { return !edge.isInvisible(); };
    };
    JSHeapSnapshot.prototype.retainingEdgesFilter = function () {
        var containmentEdgesFilter = this.containmentEdgesFilter();
        function filter(edge) {
            return containmentEdgesFilter(edge) && !edge.node().isRoot() && !edge.isWeak();
        }
        return filter;
    };
    JSHeapSnapshot.prototype.calculateFlags = function () {
        this.flags = new Uint32Array(this.nodeCount);
        this.markDetachedDOMTreeNodes();
        this.markQueriableHeapObjects();
        this.markPageOwnedNodes();
    };
    JSHeapSnapshot.prototype.calculateDistances = function () {
        function filter(node, edge) {
            if (node.isHidden()) {
                return edge.name() !== 'sloppy_function_map' || node.rawName() !== 'system / NativeContext';
            }
            if (node.isArray()) {
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
                if (node.rawName() !== '(map descriptors)') {
                    return true;
                }
                var index = parseInt(edge.name(), 10);
                return index < 2 || (index % 3) !== 1;
            }
            return true;
        }
        _super.prototype.calculateDistances.call(this, filter);
    };
    JSHeapSnapshot.prototype.isUserRoot = function (node) {
        return node.isUserRoot() || node.isDocumentDOMTreesRoot();
    };
    JSHeapSnapshot.prototype.userObjectsMapAndFlag = function () {
        return { map: this.flags, flag: this.nodeFlags.pageObject };
    };
    JSHeapSnapshot.prototype.flagsOfNode = function (node) {
        return this.flags[node.nodeIndex / this.nodeFieldCount];
    };
    JSHeapSnapshot.prototype.markDetachedDOMTreeNodes = function () {
        var nodes = this.nodes;
        var nodesLength = nodes.length;
        var nodeFieldCount = this.nodeFieldCount;
        var nodeNativeType = this.nodeNativeType;
        var nodeTypeOffset = this.nodeTypeOffset;
        var flag = this.nodeFlags.detachedDOMTreeNode;
        var node = this.rootNode();
        for (var nodeIndex = 0, ordinal = 0; nodeIndex < nodesLength; nodeIndex += nodeFieldCount, ordinal++) {
            var nodeType = nodes[nodeIndex + nodeTypeOffset];
            if (nodeType !== nodeNativeType) {
                continue;
            }
            node.nodeIndex = nodeIndex;
            if (node.name().startsWith('Detached ')) {
                this.flags[ordinal] |= flag;
            }
        }
    };
    JSHeapSnapshot.prototype.markQueriableHeapObjects = function () {
        // Allow runtime properties query for objects accessible from Window objects
        // via regular properties, and for DOM wrappers. Trying to access random objects
        // can cause a crash due to insonsistent state of internal properties of wrappers.
        var flag = this.nodeFlags.canBeQueried;
        var hiddenEdgeType = this.edgeHiddenType;
        var internalEdgeType = this.edgeInternalType;
        var invisibleEdgeType = this.edgeInvisibleType;
        var weakEdgeType = this.edgeWeakType;
        var edgeToNodeOffset = this.edgeToNodeOffset;
        var edgeTypeOffset = this.edgeTypeOffset;
        var edgeFieldsCount = this.edgeFieldsCount;
        var containmentEdges = this.containmentEdges;
        var nodeFieldCount = this.nodeFieldCount;
        var firstEdgeIndexes = this.firstEdgeIndexes;
        var flags = this.flags;
        var list = [];
        for (var iter = this.rootNode().edges(); iter.hasNext(); iter.next()) {
            if (iter.edge.node().isUserRoot()) {
                list.push(iter.edge.node().nodeIndex / nodeFieldCount);
            }
        }
        while (list.length) {
            var nodeOrdinal = list.pop();
            if (flags[nodeOrdinal] & flag) {
                continue;
            }
            flags[nodeOrdinal] |= flag;
            var beginEdgeIndex = firstEdgeIndexes[nodeOrdinal];
            var endEdgeIndex = firstEdgeIndexes[nodeOrdinal + 1];
            for (var edgeIndex = beginEdgeIndex; edgeIndex < endEdgeIndex; edgeIndex += edgeFieldsCount) {
                var childNodeIndex = containmentEdges[edgeIndex + edgeToNodeOffset];
                var childNodeOrdinal = childNodeIndex / nodeFieldCount;
                if (flags[childNodeOrdinal] & flag) {
                    continue;
                }
                var type = containmentEdges[edgeIndex + edgeTypeOffset];
                if (type === hiddenEdgeType || type === invisibleEdgeType || type === internalEdgeType ||
                    type === weakEdgeType) {
                    continue;
                }
                list.push(childNodeOrdinal);
            }
        }
    };
    JSHeapSnapshot.prototype.markPageOwnedNodes = function () {
        var edgeShortcutType = this.edgeShortcutType;
        var edgeElementType = this.edgeElementType;
        var edgeToNodeOffset = this.edgeToNodeOffset;
        var edgeTypeOffset = this.edgeTypeOffset;
        var edgeFieldsCount = this.edgeFieldsCount;
        var edgeWeakType = this.edgeWeakType;
        var firstEdgeIndexes = this.firstEdgeIndexes;
        var containmentEdges = this.containmentEdges;
        var nodeFieldCount = this.nodeFieldCount;
        var nodesCount = this.nodeCount;
        var flags = this.flags;
        var pageObjectFlag = this.nodeFlags.pageObject;
        var nodesToVisit = new Uint32Array(nodesCount);
        var nodesToVisitLength = 0;
        var rootNodeOrdinal = this.rootNodeIndexInternal / nodeFieldCount;
        var node = this.rootNode();
        // Populate the entry points. They are Window objects and DOM Tree Roots.
        for (var edgeIndex = firstEdgeIndexes[rootNodeOrdinal], endEdgeIndex = firstEdgeIndexes[rootNodeOrdinal + 1]; edgeIndex < endEdgeIndex; edgeIndex += edgeFieldsCount) {
            var edgeType = containmentEdges[edgeIndex + edgeTypeOffset];
            var nodeIndex = containmentEdges[edgeIndex + edgeToNodeOffset];
            if (edgeType === edgeElementType) {
                node.nodeIndex = nodeIndex;
                if (!node.isDocumentDOMTreesRoot()) {
                    continue;
                }
            }
            else if (edgeType !== edgeShortcutType) {
                continue;
            }
            var nodeOrdinal = nodeIndex / nodeFieldCount;
            nodesToVisit[nodesToVisitLength++] = nodeOrdinal;
            flags[nodeOrdinal] |= pageObjectFlag;
        }
        // Mark everything reachable with the pageObject flag.
        while (nodesToVisitLength) {
            var nodeOrdinal = nodesToVisit[--nodesToVisitLength];
            var beginEdgeIndex = firstEdgeIndexes[nodeOrdinal];
            var endEdgeIndex = firstEdgeIndexes[nodeOrdinal + 1];
            for (var edgeIndex = beginEdgeIndex; edgeIndex < endEdgeIndex; edgeIndex += edgeFieldsCount) {
                var childNodeIndex = containmentEdges[edgeIndex + edgeToNodeOffset];
                var childNodeOrdinal = childNodeIndex / nodeFieldCount;
                if (flags[childNodeOrdinal] & pageObjectFlag) {
                    continue;
                }
                var type = containmentEdges[edgeIndex + edgeTypeOffset];
                if (type === edgeWeakType) {
                    continue;
                }
                nodesToVisit[nodesToVisitLength++] = childNodeOrdinal;
                flags[childNodeOrdinal] |= pageObjectFlag;
            }
        }
    };
    JSHeapSnapshot.prototype.calculateStatistics = function () {
        var nodeFieldCount = this.nodeFieldCount;
        var nodes = this.nodes;
        var nodesLength = nodes.length;
        var nodeTypeOffset = this.nodeTypeOffset;
        var nodeSizeOffset = this.nodeSelfSizeOffset;
        var nodeNativeType = this.nodeNativeType;
        var nodeCodeType = this.nodeCodeType;
        var nodeConsStringType = this.nodeConsStringType;
        var nodeSlicedStringType = this.nodeSlicedStringType;
        var distances = this.nodeDistances;
        var sizeNative = 0;
        var sizeCode = 0;
        var sizeStrings = 0;
        var sizeJSArrays = 0;
        var sizeSystem = 0;
        var node = this.rootNode();
        for (var nodeIndex = 0; nodeIndex < nodesLength; nodeIndex += nodeFieldCount) {
            var nodeSize = nodes[nodeIndex + nodeSizeOffset];
            var ordinal = nodeIndex / nodeFieldCount;
            if (distances[ordinal] >= HeapSnapshotModel.HeapSnapshotModel.baseSystemDistance) {
                sizeSystem += nodeSize;
                continue;
            }
            var nodeType = nodes[nodeIndex + nodeTypeOffset];
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
        this.statistics = new HeapSnapshotModel.HeapSnapshotModel.Statistics();
        this.statistics.total = this.totalSize;
        this.statistics.v8heap = this.totalSize - sizeNative;
        this.statistics.native = sizeNative;
        this.statistics.code = sizeCode;
        this.statistics.jsArrays = sizeJSArrays;
        this.statistics.strings = sizeStrings;
        this.statistics.system = sizeSystem;
    };
    JSHeapSnapshot.prototype.calculateArraySize = function (node) {
        var size = node.selfSize();
        var beginEdgeIndex = node.edgeIndexesStart();
        var endEdgeIndex = node.edgeIndexesEnd();
        var containmentEdges = this.containmentEdges;
        var strings = this.strings;
        var edgeToNodeOffset = this.edgeToNodeOffset;
        var edgeTypeOffset = this.edgeTypeOffset;
        var edgeNameOffset = this.edgeNameOffset;
        var edgeFieldsCount = this.edgeFieldsCount;
        var edgeInternalType = this.edgeInternalType;
        for (var edgeIndex = beginEdgeIndex; edgeIndex < endEdgeIndex; edgeIndex += edgeFieldsCount) {
            var edgeType = containmentEdges[edgeIndex + edgeTypeOffset];
            if (edgeType !== edgeInternalType) {
                continue;
            }
            var edgeName = strings[containmentEdges[edgeIndex + edgeNameOffset]];
            if (edgeName !== 'elements') {
                continue;
            }
            var elementsNodeIndex = containmentEdges[edgeIndex + edgeToNodeOffset];
            node.nodeIndex = elementsNodeIndex;
            if (node.retainersCount() === 1) {
                size += node.selfSize();
            }
            break;
        }
        return size;
    };
    JSHeapSnapshot.prototype.getStatistics = function () {
        return /** @type {!HeapSnapshotModel.HeapSnapshotModel.Statistics} */ this.statistics;
    };
    return JSHeapSnapshot;
}(HeapSnapshot));
export { JSHeapSnapshot };
var JSHeapSnapshotNode = /** @class */ (function (_super) {
    __extends(JSHeapSnapshotNode, _super);
    function JSHeapSnapshotNode(snapshot, nodeIndex) {
        return _super.call(this, snapshot, nodeIndex) || this;
    }
    JSHeapSnapshotNode.prototype.canBeQueried = function () {
        var snapshot = this.snapshot;
        var flags = snapshot.flagsOfNode(this);
        return Boolean(flags & snapshot.nodeFlags.canBeQueried);
    };
    JSHeapSnapshotNode.prototype.rawName = function () {
        return _super.prototype.name.call(this);
    };
    JSHeapSnapshotNode.prototype.name = function () {
        var snapshot = this.snapshot;
        if (this.rawType() === snapshot.nodeConsStringType) {
            var string = snapshot.lazyStringCache[this.nodeIndex];
            if (typeof string === 'undefined') {
                string = this.consStringName();
                snapshot.lazyStringCache[this.nodeIndex] = string;
            }
            return string;
        }
        return this.rawName();
    };
    JSHeapSnapshotNode.prototype.consStringName = function () {
        var snapshot = this.snapshot;
        var consStringType = snapshot.nodeConsStringType;
        var edgeInternalType = snapshot.edgeInternalType;
        var edgeFieldsCount = snapshot.edgeFieldsCount;
        var edgeToNodeOffset = snapshot.edgeToNodeOffset;
        var edgeTypeOffset = snapshot.edgeTypeOffset;
        var edgeNameOffset = snapshot.edgeNameOffset;
        var strings = snapshot.strings;
        var edges = snapshot.containmentEdges;
        var firstEdgeIndexes = snapshot.firstEdgeIndexes;
        var nodeFieldCount = snapshot.nodeFieldCount;
        var nodeTypeOffset = snapshot.nodeTypeOffset;
        var nodeNameOffset = snapshot.nodeNameOffset;
        var nodes = snapshot.nodes;
        var nodesStack = [];
        nodesStack.push(this.nodeIndex);
        var name = '';
        while (nodesStack.length && name.length < 1024) {
            var nodeIndex = nodesStack.pop();
            if (nodes[nodeIndex + nodeTypeOffset] !== consStringType) {
                name += strings[nodes[nodeIndex + nodeNameOffset]];
                continue;
            }
            var nodeOrdinal = nodeIndex / nodeFieldCount;
            var beginEdgeIndex = firstEdgeIndexes[nodeOrdinal];
            var endEdgeIndex = firstEdgeIndexes[nodeOrdinal + 1];
            var firstNodeIndex = 0;
            var secondNodeIndex = 0;
            for (var edgeIndex = beginEdgeIndex; edgeIndex < endEdgeIndex && (!firstNodeIndex || !secondNodeIndex); edgeIndex += edgeFieldsCount) {
                var edgeType = edges[edgeIndex + edgeTypeOffset];
                if (edgeType === edgeInternalType) {
                    var edgeName = strings[edges[edgeIndex + edgeNameOffset]];
                    if (edgeName === 'first') {
                        firstNodeIndex = edges[edgeIndex + edgeToNodeOffset];
                    }
                    else if (edgeName === 'second') {
                        secondNodeIndex = edges[edgeIndex + edgeToNodeOffset];
                    }
                }
            }
            nodesStack.push(secondNodeIndex);
            nodesStack.push(firstNodeIndex);
        }
        return name;
    };
    JSHeapSnapshotNode.prototype.className = function () {
        var type = this.type();
        switch (type) {
            case 'hidden':
                return '(system)';
            case 'object':
            case 'native':
                return this.name();
            case 'code':
                return '(compiled code)';
            default:
                return '(' + type + ')';
        }
    };
    JSHeapSnapshotNode.prototype.classIndex = function () {
        var snapshot = this.snapshot;
        var nodes = snapshot.nodes;
        var type = nodes[this.nodeIndex + snapshot.nodeTypeOffset];
        if (type === snapshot.nodeObjectType || type === snapshot.nodeNativeType) {
            return nodes[this.nodeIndex + snapshot.nodeNameOffset];
        }
        return -1 - type;
    };
    JSHeapSnapshotNode.prototype.id = function () {
        var snapshot = this.snapshot;
        return snapshot.nodes[this.nodeIndex + snapshot.nodeIdOffset];
    };
    JSHeapSnapshotNode.prototype.isHidden = function () {
        return this.rawType() === this.snapshot.nodeHiddenType;
    };
    JSHeapSnapshotNode.prototype.isArray = function () {
        return this.rawType() === this.snapshot.nodeArrayType;
    };
    JSHeapSnapshotNode.prototype.isSynthetic = function () {
        return this.rawType() === this.snapshot.nodeSyntheticType;
    };
    JSHeapSnapshotNode.prototype.isUserRoot = function () {
        return !this.isSynthetic();
    };
    JSHeapSnapshotNode.prototype.isDocumentDOMTreesRoot = function () {
        return this.isSynthetic() && this.name() === '(Document DOM trees)';
    };
    JSHeapSnapshotNode.prototype.serialize = function () {
        var result = _super.prototype.serialize.call(this);
        var snapshot = this.snapshot;
        var flags = snapshot.flagsOfNode(this);
        if (flags & snapshot.nodeFlags.canBeQueried) {
            result.canBeQueried = true;
        }
        if (flags & snapshot.nodeFlags.detachedDOMTreeNode) {
            result.detachedDOMTreeNode = true;
        }
        return result;
    };
    return JSHeapSnapshotNode;
}(HeapSnapshotNode));
export { JSHeapSnapshotNode };
var JSHeapSnapshotEdge = /** @class */ (function (_super) {
    __extends(JSHeapSnapshotEdge, _super);
    function JSHeapSnapshotEdge(snapshot, edgeIndex) {
        return _super.call(this, snapshot, edgeIndex) || this;
    }
    JSHeapSnapshotEdge.prototype.clone = function () {
        var snapshot = this.snapshot;
        return new JSHeapSnapshotEdge(snapshot, this.edgeIndex);
    };
    JSHeapSnapshotEdge.prototype.hasStringName = function () {
        if (!this.isShortcut()) {
            return this.hasStringNameInternal();
        }
        // @ts-ignore parseInt is successful against numbers.
        return isNaN(parseInt(this.nameInternal(), 10));
    };
    JSHeapSnapshotEdge.prototype.isElement = function () {
        return this.rawType() === this.snapshot.edgeElementType;
    };
    JSHeapSnapshotEdge.prototype.isHidden = function () {
        return this.rawType() === this.snapshot.edgeHiddenType;
    };
    JSHeapSnapshotEdge.prototype.isWeak = function () {
        return this.rawType() === this.snapshot.edgeWeakType;
    };
    JSHeapSnapshotEdge.prototype.isInternal = function () {
        return this.rawType() === this.snapshot.edgeInternalType;
    };
    JSHeapSnapshotEdge.prototype.isInvisible = function () {
        return this.rawType() === this.snapshot.edgeInvisibleType;
    };
    JSHeapSnapshotEdge.prototype.isShortcut = function () {
        return this.rawType() === this.snapshot.edgeShortcutType;
    };
    JSHeapSnapshotEdge.prototype.name = function () {
        var name = this.nameInternal();
        if (!this.isShortcut()) {
            return String(name);
        }
        // @ts-ignore parseInt is successful against numbers.
        var numName = parseInt(name, 10);
        return String(isNaN(numName) ? name : numName);
    };
    JSHeapSnapshotEdge.prototype.toString = function () {
        var name = this.name();
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
    };
    JSHeapSnapshotEdge.prototype.hasStringNameInternal = function () {
        var type = this.rawType();
        var snapshot = this.snapshot;
        return type !== snapshot.edgeElementType && type !== snapshot.edgeHiddenType;
    };
    JSHeapSnapshotEdge.prototype.nameInternal = function () {
        return this.hasStringNameInternal() ? this.snapshot.strings[this.nameOrIndex()] : this.nameOrIndex();
    };
    JSHeapSnapshotEdge.prototype.nameOrIndex = function () {
        return this.edges[this.edgeIndex + this.snapshot.edgeNameOffset];
    };
    JSHeapSnapshotEdge.prototype.rawType = function () {
        return this.edges[this.edgeIndex + this.snapshot.edgeTypeOffset];
    };
    return JSHeapSnapshotEdge;
}(HeapSnapshotEdge));
export { JSHeapSnapshotEdge };
var JSHeapSnapshotRetainerEdge = /** @class */ (function (_super) {
    __extends(JSHeapSnapshotRetainerEdge, _super);
    function JSHeapSnapshotRetainerEdge(snapshot, retainerIndex) {
        return _super.call(this, snapshot, retainerIndex) || this;
    }
    JSHeapSnapshotRetainerEdge.prototype.clone = function () {
        var snapshot = this.snapshot;
        return new JSHeapSnapshotRetainerEdge(snapshot, this.retainerIndex());
    };
    JSHeapSnapshotRetainerEdge.prototype.isHidden = function () {
        return this.edge().isHidden();
    };
    JSHeapSnapshotRetainerEdge.prototype.isInternal = function () {
        return this.edge().isInternal();
    };
    JSHeapSnapshotRetainerEdge.prototype.isInvisible = function () {
        return this.edge().isInvisible();
    };
    JSHeapSnapshotRetainerEdge.prototype.isShortcut = function () {
        return this.edge().isShortcut();
    };
    JSHeapSnapshotRetainerEdge.prototype.isWeak = function () {
        return this.edge().isWeak();
    };
    return JSHeapSnapshotRetainerEdge;
}(HeapSnapshotRetainerEdge));
export { JSHeapSnapshotRetainerEdge };
