"use strict";
var enums = require('../../../components/utility/enums');
/**
 * This is a mark scheme view sequence comparer class and method
 */
var MarkSchemeViewSequenceComparer = (function () {
    function MarkSchemeViewSequenceComparer() {
        var _this = this;
        /**
         * Gets the sequence.
         * @param {treeViewItem} treeItem
         * @returns{number} sequnce number
         */
        this.getSequence = function (treeItem) {
            if (treeItem.treeViewItemList) {
                var sequence_1 = Number.MAX_VALUE;
                treeItem.treeViewItemList.map(function (item) {
                    // Need not calculate the sequence of the MarkScheme as the sequence will be different for that than of an item
                    // Only calculate if the child has children or if the child is not a markscheme
                    if (item.itemType !== enums.TreeViewItemType.marksScheme || item.treeViewItemList) {
                        var temp = _this.getSequence(item);
                        if (temp < sequence_1) {
                            sequence_1 = temp;
                        }
                    }
                    else {
                        sequence_1 = treeItem.sequenceNo;
                    }
                });
                return sequence_1;
            }
            else {
                return treeItem.sequenceNo;
            }
        };
    }
    /** Comparer to sort the mark scheme view sequence
     * in ascending order of sequence number
     */
    MarkSchemeViewSequenceComparer.prototype.compare = function (a, b) {
        // If both the items are mark schemes then the smallest sequence should come first
        if (a.itemType === enums.TreeViewItemType.marksScheme &&
            b.itemType === enums.TreeViewItemType.marksScheme) {
            return a.sequenceNo - b.sequenceNo;
        }
        else if (a.itemType === enums.TreeViewItemType.marksScheme) {
            // Always display cluster level Markschemes at the last level
            return 1;
        }
        else if (b.itemType === enums.TreeViewItemType.marksScheme) {
            // Always display cluster level Markschemes at the last level
            return -1;
        }
        return this.getSequence(a) - this.getSequence(b);
    };
    return MarkSchemeViewSequenceComparer;
}());
module.exports = MarkSchemeViewSequenceComparer;
//# sourceMappingURL=markschemeviewsequencecomparer.js.map