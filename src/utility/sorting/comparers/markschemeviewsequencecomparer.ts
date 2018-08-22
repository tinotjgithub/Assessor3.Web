import comparerInterface = require('../sortbase/comparerinterface');
import treeViewItem = require('../../../stores/markschemestructure/typings/treeviewitem');
import enums = require('../../../components/utility/enums');

/**
 * This is a mark scheme view sequence comparer class and method
 */
class MarkSchemeViewSequenceComparer implements comparerInterface {
    /** Comparer to sort the mark scheme view sequence
     * in ascending order of sequence number
     */
    public compare(a: treeViewItem, b: treeViewItem) {

            // If both the items are mark schemes then the smallest sequence should come first
        if (a.itemType === enums.TreeViewItemType.marksScheme &&
            b.itemType === enums.TreeViewItemType.marksScheme) {
                return a.sequenceNo - b.sequenceNo;
        } else if (a.itemType === enums.TreeViewItemType.marksScheme) {
                // Always display cluster level Markschemes at the last level
            return 1;
        } else if (b.itemType === enums.TreeViewItemType.marksScheme) {
                // Always display cluster level Markschemes at the last level
            return -1;
            }
            return this.getSequence(a) - this.getSequence(b);
        }

   /**
    * Gets the sequence.
    * @param {treeViewItem} treeItem
    * @returns{number} sequnce number
    */
    private getSequence = (treeItem: treeViewItem): number => {
        if (treeItem.treeViewItemList) {
            let sequence: number = Number.MAX_VALUE;
            treeItem.treeViewItemList.map((item: treeViewItem) => {
                // Need not calculate the sequence of the MarkScheme as the sequence will be different for that than of an item
                // Only calculate if the child has children or if the child is not a markscheme
                if (item.itemType !== enums.TreeViewItemType.marksScheme || item.treeViewItemList) {
                    let temp: number = this.getSequence(item);
                    if (temp < sequence) {
                        sequence = temp;
                    }
                } else {
                    sequence = treeItem.sequenceNo;
                }
            });
            return sequence;
        } else {
            return treeItem.sequenceNo;
        }
    };
}

export = MarkSchemeViewSequenceComparer;