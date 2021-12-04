// Copyright (c) 2020 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
export var removeElement = function (array, element, firstOnly) {
    var index = array.indexOf(element);
    if (index === -1) {
        return false;
    }
    if (firstOnly) {
        array.splice(index, 1);
        return true;
    }
    for (var i = index + 1, n = array.length; i < n; ++i) {
        if (array[i] !== element) {
            array[index++] = array[i];
        }
    }
    array.length = index;
    return true;
};
function swap(array, i1, i2) {
    var temp = array[i1];
    array[i1] = array[i2];
    array[i2] = temp;
}
function partition(array, comparator, left, right, pivotIndex) {
    var pivotValue = array[pivotIndex];
    swap(array, right, pivotIndex);
    var storeIndex = left;
    for (var i = left; i < right; ++i) {
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
    var pivotIndex = Math.floor(Math.random() * (right - left)) + left;
    var pivotNewIndex = partition(array, comparator, left, right, pivotIndex);
    if (sortWindowLeft < pivotNewIndex) {
        quickSortRange(array, comparator, left, pivotNewIndex - 1, sortWindowLeft, sortWindowRight);
    }
    if (pivotNewIndex < sortWindowRight) {
        quickSortRange(array, comparator, pivotNewIndex + 1, right, sortWindowLeft, sortWindowRight);
    }
}
export function sortRange(array, comparator, leftBound, rightBound, sortWindowLeft, sortWindowRight) {
    if (leftBound === 0 && rightBound === (array.length - 1) && sortWindowLeft === 0 && sortWindowRight >= rightBound) {
        array.sort(comparator);
    }
    else {
        quickSortRange(array, comparator, leftBound, rightBound, sortWindowLeft, sortWindowRight);
    }
    return array;
}
export var binaryIndexOf = function (array, value, comparator) {
    var index = lowerBound(array, value, comparator);
    return index < array.length && comparator(value, array[index]) === 0 ? index : -1;
};
function mergeOrIntersect(array1, array2, comparator, mergeNotIntersect) {
    var result = [];
    var i = 0;
    var j = 0;
    while (i < array1.length && j < array2.length) {
        var compareValue = comparator(array1[i], array2[j]);
        if (mergeNotIntersect || !compareValue) {
            result.push(compareValue <= 0 ? array1[i] : array2[j]);
        }
        if (compareValue <= 0) {
            i++;
        }
        if (compareValue >= 0) {
            j++;
        }
    }
    if (mergeNotIntersect) {
        while (i < array1.length) {
            result.push(array1[i++]);
        }
        while (j < array2.length) {
            result.push(array2[j++]);
        }
    }
    return result;
}
export var intersectOrdered = function (array1, array2, comparator) {
    return mergeOrIntersect(array1, array2, comparator, false);
};
export var mergeOrdered = function (array1, array2, comparator) {
    return mergeOrIntersect(array1, array2, comparator, true);
};
export var DEFAULT_COMPARATOR = function (a, b) {
    return a < b ? -1 : (a > b ? 1 : 0);
};
export function lowerBound(array, needle, comparator, left, right) {
    var l = left || 0;
    var r = right !== undefined ? right : array.length;
    while (l < r) {
        var m = (l + r) >> 1;
        if (comparator(needle, array[m]) > 0) {
            l = m + 1;
        }
        else {
            r = m;
        }
    }
    return r;
}
export function upperBound(array, needle, comparator, left, right) {
    var l = left || 0;
    var r = right !== undefined ? right : array.length;
    while (l < r) {
        var m = (l + r) >> 1;
        if (comparator(needle, array[m]) >= 0) {
            l = m + 1;
        }
        else {
            r = m;
        }
    }
    return r;
}
