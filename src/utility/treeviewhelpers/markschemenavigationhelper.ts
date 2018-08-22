import React = require('react');
import treeViewItem = require('../../stores/markschemestructure/typings/treeviewitem');
import enums = require('../../components/utility/enums');
import localeStore = require('../../stores/locale/localestore');

/**
 * DEPRECATED from version NLP1 - PLEASE USE MARKSCHEMEHELPER
 * Helper class for navigation of mark scheme tree view.
 */
class MarkSchemeNavigationHelper {

   /**
    * returns the next markable node of tree view.
    * @param treeNodes - the tree node collection.
    * @param currentIndex - index of the current selected node (0 in case of nothing selected).
    * @param isDirBackward - is the direction is backward (for finding previous markable node).
    * @returns previous marakable node.
    */
    public static getNextMarkableNode(treeNodes: Immutable.List<treeViewItem>, currentIndex: number, isDirectionBackward: boolean)
        : treeViewItem {
        if (treeNodes) {
            if (isDirectionBackward) {
                return this.getPrevMarkableItem(treeNodes, currentIndex);
            }
            return this.getNextMarkableItem(treeNodes, currentIndex);
        } else {
            return null;
        }
    }

   /**
    * returns the next markable item of tree view.
    * @param treeNodes - the tree node collection.
    * @param currentIndex - index of the current selected node (0 in case of nothing selected).
    * @param isDirBackward - is the direction is backward (for finding previous markable node).
    * @returns previous marakable node.
    */
    private static getNextMarkableItem(treeNodes: Immutable.List<treeViewItem>, currentIndex: number)
        : treeViewItem {
        let that = this;
        let dataFound = false;
        let markableNode: treeViewItem = null;
        treeNodes.map((node: treeViewItem) => {
            if (dataFound === false) {
                if (that.isMarkableItem(node) === true && node.index > currentIndex) {
                    markableNode = node;
                    if (markableNode) {
                        dataFound = true;
                    }
                } else if (node.treeViewItemList) {
                    markableNode = that.getNextMarkableItem(node.treeViewItemList, currentIndex);
                    if (markableNode) {
                        dataFound = true;
                    }
                }
            }
        });
        return markableNode;
    }

   /**
    * returns the previous markable item of tree view based on the current index.
    * @param treeNodes - the tree node collection.
    * @param currentIndex - index of the current selected node (0 in case of nothing selected).
    * @returns previous marakable node.
    */
    private static getPrevMarkableItem(treeNodes: Immutable.List<treeViewItem>, currentIndex: number)
        : treeViewItem {
        let that = this;
        let markableNode: treeViewItem = null;
        /** looping throug tree nodes and setting the markable node with just prev indexed node of the current index */
        treeNodes.map((node: treeViewItem) => {
            if (node.index < currentIndex) {
                if (that.isMarkableItem(node) === true) {
                    markableNode = node;
                }
                if (node.treeViewItemList) {
                    let _node = that.getPrevMarkableItem(node.treeViewItemList, currentIndex);
                    if (_node) {
                        markableNode = _node;
                    }
                }
            }
        });
        return markableNode;
    }

    /**
     * Checks whether thew item type is markable or not
     * @param  node - tree view item
     */
    private static isMarkableItem(node: treeViewItem): boolean {
        if (node.itemType === enums.TreeViewItemType.marksScheme) {
            return true;
        }
        return false;
    }

    /**
     * returns the next markable item of tree view.
     * @param treeNodes - the tree node collection.
     * @param currentIndex - index of the current selected node (0 in case of nothing selected).
     * @returns marakable node corresponding to the currentIndex.
     */
    public static getMarkableItemByIndex(treeNodes: Immutable.List<treeViewItem>, currentIndex: number)
        : treeViewItem {
        let that = this;
        let dataFound = false;
        let markableNode: treeViewItem = null;
        treeNodes.map((node: treeViewItem) => {
            if (dataFound === false) {
                if (that.isMarkableItem(node) === true && node.index === currentIndex) {
                    markableNode = node;
                    if (markableNode) {
                        dataFound = true;
                    }
                } else if (node.treeViewItemList) {
                    markableNode = that.getMarkableItemByIndex(node.treeViewItemList, currentIndex);
                    if (markableNode) {
                        dataFound = true;
                    }
                }
            }
        });
        return markableNode;
    }
}
