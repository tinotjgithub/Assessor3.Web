"use strict";
var enums = require('../../components/utility/enums');
/**
 * DEPRECATED from version NLP1 - PLEASE USE MARKSCHEMEHELPER
 * Helper class for navigation of mark scheme tree view.
 */
var MarkSchemeNavigationHelper = (function () {
    function MarkSchemeNavigationHelper() {
    }
    /**
     * returns the next markable node of tree view.
     * @param treeNodes - the tree node collection.
     * @param currentIndex - index of the current selected node (0 in case of nothing selected).
     * @param isDirBackward - is the direction is backward (for finding previous markable node).
     * @returns previous marakable node.
     */
    MarkSchemeNavigationHelper.getNextMarkableNode = function (treeNodes, currentIndex, isDirectionBackward) {
        if (treeNodes) {
            if (isDirectionBackward) {
                return this.getPrevMarkableItem(treeNodes, currentIndex);
            }
            return this.getNextMarkableItem(treeNodes, currentIndex);
        }
        else {
            return null;
        }
    };
    /**
     * returns the next markable item of tree view.
     * @param treeNodes - the tree node collection.
     * @param currentIndex - index of the current selected node (0 in case of nothing selected).
     * @param isDirBackward - is the direction is backward (for finding previous markable node).
     * @returns previous marakable node.
     */
    MarkSchemeNavigationHelper.getNextMarkableItem = function (treeNodes, currentIndex) {
        var that = this;
        var dataFound = false;
        var markableNode = null;
        treeNodes.map(function (node) {
            if (dataFound === false) {
                if (that.isMarkableItem(node) === true && node.index > currentIndex) {
                    markableNode = node;
                    if (markableNode) {
                        dataFound = true;
                    }
                }
                else if (node.treeViewItemList) {
                    markableNode = that.getNextMarkableItem(node.treeViewItemList, currentIndex);
                    if (markableNode) {
                        dataFound = true;
                    }
                }
            }
        });
        return markableNode;
    };
    /**
     * returns the previous markable item of tree view based on the current index.
     * @param treeNodes - the tree node collection.
     * @param currentIndex - index of the current selected node (0 in case of nothing selected).
     * @returns previous marakable node.
     */
    MarkSchemeNavigationHelper.getPrevMarkableItem = function (treeNodes, currentIndex) {
        var that = this;
        var markableNode = null;
        /** looping throug tree nodes and setting the markable node with just prev indexed node of the current index */
        treeNodes.map(function (node) {
            if (node.index < currentIndex) {
                if (that.isMarkableItem(node) === true) {
                    markableNode = node;
                }
                if (node.treeViewItemList) {
                    var _node = that.getPrevMarkableItem(node.treeViewItemList, currentIndex);
                    if (_node) {
                        markableNode = _node;
                    }
                }
            }
        });
        return markableNode;
    };
    /**
     * Checks whether thew item type is markable or not
     * @param  node - tree view item
     */
    MarkSchemeNavigationHelper.isMarkableItem = function (node) {
        if (node.itemType === enums.TreeViewItemType.marksScheme) {
            return true;
        }
        return false;
    };
    /**
     * returns the next markable item of tree view.
     * @param treeNodes - the tree node collection.
     * @param currentIndex - index of the current selected node (0 in case of nothing selected).
     * @returns marakable node corresponding to the currentIndex.
     */
    MarkSchemeNavigationHelper.getMarkableItemByIndex = function (treeNodes, currentIndex) {
        var that = this;
        var dataFound = false;
        var markableNode = null;
        treeNodes.map(function (node) {
            if (dataFound === false) {
                if (that.isMarkableItem(node) === true && node.index === currentIndex) {
                    markableNode = node;
                    if (markableNode) {
                        dataFound = true;
                    }
                }
                else if (node.treeViewItemList) {
                    markableNode = that.getMarkableItemByIndex(node.treeViewItemList, currentIndex);
                    if (markableNode) {
                        dataFound = true;
                    }
                }
            }
        });
        return markableNode;
    };
    return MarkSchemeNavigationHelper;
}());
//# sourceMappingURL=markschemenavigationhelper.js.map