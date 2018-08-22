import treeViewItem = require('../../stores/markschemestructure/typings/treeviewitem');
import markCalculationRuleSchema = require('./markcalculationruleschema');
import enums = require('../../components/utility/enums');
import constants = require('../../components/utility/constants');
import Immutable = require('immutable');
import sortHelper = require('../../../src/utility/sorting/sorthelper');
import comparerList = require('../../../src/utility/sorting/sortbase/comparerlist');
import markCalculationRuleBase = require('./markcalculationrulebase');

/**
 * Default rule for mark calculation
 */
class DefaultMarkCalculationRule extends markCalculationRuleBase {

    /* variable to hold whether the item found during tree traversal */
    private isItemFound: boolean = false;
    private marksManagementHelper: MarksAndAnnotationsManagementBase;

    // variable to hold the mark scheme has optionality in any of its child
    private hasOptionality: boolean;

    /**
     * *Calculate total mark, actual mark and marking progress
     * @param treeItem
     * @param currentBIndex - the bIndex of selected node.
     * @param marksManagementHelper -
     * @param optionalItems - the dictionary with optionality applicanble items and isall optional items marked info.
     */
    public calculateMaximumAndTotalMark(treeItem: treeViewItem, currentBIndex?: number,
        marksManagementHelper?: MarksAndAnnotationsManagementBase, optionalItems?: Array<OptionalityDictionary>): void {

        try {
            this.isItemFound = false;
            this.marksManagementHelper = marksManagementHelper;

            this.calculateMark(treeItem, currentBIndex, optionalItems);

            treeItem.hasSimpleOptionality = this.hasOptionality;

            /* to set the total mark to 0 if all markschemes are NR or - */
            if (treeItem.totalMarks === constants.NOT_ATTEMPTED
                || treeItem.totalMarks === constants.NOT_MARKED) {
                treeItem.totalMarks = '0';
            }
        } catch (exception) {
            window.onerror(exception.message, '', null, null, exception);
        }
    }

    /**
     * calculating the total marks.
     * @param treeItem
     * @param currentBIndex
     * @param optionalItems
     */
    private calculateMark(treeItem: treeViewItem, currentBIndex?: number, optionalItems?: Array<OptionalityDictionary>): void {
        let total: number = undefined;
        let maxMark: number = 0;
        let markedCount: number = 0;
        let markSchemeCount: number = 0;

        /**
         * traverse only if the currentBIndex is null(first time) or it is less than the item bIndex
         * (this will traverse through the lower bIndex itms only and hence avoid the unwanted traversal)
         */
        if (!currentBIndex || currentBIndex <= treeItem.bIndex) {
            treeItem.treeViewItemList.forEach((item: treeViewItem) => {

                let markEntered: number;

                if (item.bIndex === currentBIndex) {
                    this.isItemFound = true;
                }

                /** iterating through child only if the item with currentBindex has not found */
                if (item.treeViewItemList && item.treeViewItemList.count() > 0 && this.isItemFound === false) {
                    this.calculateMark(item, currentBIndex, optionalItems);
                }

                /** calculating the maximum mark of the item */
                if (!currentBIndex && !isNaN(item.maximumNumericMark)) {
                    maxMark = maxMark + item.maximumNumericMark;
                }

                if (item.itemType === enums.TreeViewItemType.marksScheme) {
                    // TODO : Change as per hide total on non numeric story
                    let _enteredMark = (item.allocatedMarks.valueMark) ? item.allocatedMarks.valueMark : item.allocatedMarks.displayMark;
                    markEntered = this.getEnteredMark(_enteredMark);
                } else {
                    markEntered = this.getEnteredMark(item.totalMarks);
                }

                /** calculating the total based on entered mark */
                total = this.getTotalMark(markEntered, total);

                this.setMarkedMarkschemeCount(item, markEntered);
                markedCount = markedCount + ((item.markCount) ? item.markCount : 0);
                markSchemeCount = markSchemeCount + item.markSchemeCount;
            });

            if (!currentBIndex) {
                treeItem.markSchemeCount = markSchemeCount;
            }

            if (this.hasSimpleOptionality(treeItem)) {
                this.hasOptionality = true;
                treeItem.markCount = markedCount;
                total = this.setSimpleOptionality(treeItem, optionalItems);
                maxMark = treeItem.maximumNumericMark;
            }
            if (treeItem.itemType === enums.TreeViewItemType.QIG) {
                /** set the fullyMarked option for enabling the complete button for QIG */
                this.setFullyMarked(treeItem, markedCount);
            }

            /** set the mark detials in tree item */
            this.setMarksInTreeItem(treeItem, maxMark, total, currentBIndex, markedCount, markSchemeCount);
        }
    }

    /**
     * set the Fully Marked Value for enabling the complete button
     * @param treeItem
     * @param currentBIndex
     * @param markedCount
     * @param markSchemeCount
     */
    private setFullyMarked(treeItem: treeViewItem, markedCount?: number): void {
        if (markedCount > 0 && (markedCount === treeItem.maximumExpectedResponses
            || (markedCount === treeItem.markSchemeCount)
            || (this.hasSimpleOptionality(treeItem)
                && treeItem.treeViewItemList.filter(x => x.isFullyMarked && x.usedInTotal).count() === treeItem.maximumExpectedResponses)
        )) {
            treeItem.isFullyMarked = true;
        } else {
            treeItem.isFullyMarked = false;
        }
    }

    /**
     * get the mark value from entered mark
     * return undefined for not marked(-) and nulll for not attempeted(NR)
     * @param enteredMark
     */
    private getEnteredMark(enteredMark: string): any {
        if (enteredMark === undefined || enteredMark === constants.NOT_MARKED || enteredMark === '') {
            return undefined;
        } else if (enteredMark === constants.NOT_ATTEMPTED) {
            return null;
        }

        return parseFloat(enteredMark);
    }

    /**
     * setting the mark details in treeview item
     * @param treeItem
     * @param maxMark
     * @param total
     * @param currentBIndex
     * @param markedCount
     * @param markSchemeCount
     */
    private setMarksInTreeItem(treeItem: treeViewItem, maxMark?: number, total?: number,
        currentBIndex?: number, markedCount?: number, markSchemeCount?: number): void {

        if (maxMark > 0) {
            treeItem.maximumNumericMark = maxMark;
        }

        treeItem.totalMarks = this.getTotalString(total);
        treeItem.markCount = markedCount;

        treeItem.markingProgress = sortHelper.evenRound((markedCount / treeItem.markSchemeCount) * 100, 0);
        treeItem.isAllNR = treeItem.totalMarks === constants.NOT_ATTEMPTED ? true : false;

    }

    /**
     * return the total mark string (NR or - or the actual total mark)
     * @param totalMark
     */
    private getTotalString(totalMark?: number): string {
        if (totalMark === undefined) {
            return constants.NOT_MARKED;
        } else if (totalMark === null) {
            return constants.NOT_ATTEMPTED;
        }

        return totalMark.toString();
    }

    /**
     * setting the  value of marked count for mark schemes
     * @param treeItem
     * @param markEntered
     */
    private setMarkedMarkschemeCount(treeItem: treeViewItem, markEntered?: number) {

        if (treeItem.itemType === enums.TreeViewItemType.marksScheme) {
            if (markEntered === undefined) {
                treeItem.markCount = 0;
            } else {
                treeItem.markCount = 1;
            }
        }
    }

    /**
     * set used in total clusters based on the simple optionality rule.
     * @param treeItem
     */
    private setSimpleOptionality(treeItem: treeViewItem, optionalItems?: Array<OptionalityDictionary>): number {
        let counter: number = 0;
        let totalMark: number = undefined;
        let maxMark: number = 0;

        /* sorting the clusters in descending order of the total mark */
        let clusterList = Immutable.List<treeViewItem>(sortHelper.sort(treeItem.treeViewItemList.toArray(), comparerList.ClusterComparer));

        clusterList.forEach((item: treeViewItem) => {
            let currentValueOfusedInTotal: boolean;

            if (counter < treeItem.maximumExpectedResponses) {

                /* setting the used in total flag true for those come within the max expected response count range*/
                currentValueOfusedInTotal = item.usedInTotal;
                item.usedInTotal = true;

                /** calculating new total based used in total items only */
                if (item.itemType === enums.TreeViewItemType.marksScheme) {
                    // TODO : Change as per hide total on non numeric story
                    let _enteredMark = (item.allocatedMarks.valueMark) ? item.allocatedMarks.valueMark : item.allocatedMarks.displayMark;
                    totalMark = this.getTotalMark(this.getEnteredMark(_enteredMark), totalMark);
                } else {
                    totalMark = this.getTotalMark(this.getEnteredMark(item.totalMarks), totalMark);
                }
                /** calculating the maximum mark of the item based on optionality rule */
                maxMark = maxMark + item.maximumNumericMark;

                /** no need to set child optionality true if it already has an opationality rule */
                if (item.treeViewItemList && (!this.hasSimpleOptionality(item))) {
                    this.setUsedIntotalInChildren(item, true, optionalItems);
                } else {
                    /** if the item has an optionality that has to be applicable to its childrens */
                    if (item.itemType !== enums.TreeViewItemType.marksScheme) {
                        item.totalMarks = this.getTotalString(this.setSimpleOptionality(item, optionalItems));
                    }
                }
            } else {
                currentValueOfusedInTotal = item.usedInTotal;
                item.usedInTotal = false;

                if (item.treeViewItemList) {
                    this.setUsedIntotalInChildren(item, false, optionalItems);
                }
            }

            /** set the fullyMarked option for enabling the complete button for Clusters/child cluster */
            this.setFullyMarked(item, item.markCount);

            /** set the variables for holding optionality rule met or not info. */
            this.setOptionalItemsMarkedData(treeItem, optionalItems);

            if (item.itemType === enums.TreeViewItemType.marksScheme && currentValueOfusedInTotal !== item.usedInTotal) {

                this.triggerProcessMark(item);
            }
            counter++;
        });
        treeItem.maximumNumericMark = maxMark;

        return totalMark;
    }

    /**
     * to set the usedin total flag in child node items
     * @param treeItem
     * @param isUsedInTotal
     */
    private setUsedIntotalInChildren(treeItem: treeViewItem, isUsedInTotal: boolean, optionalItems?: Array<OptionalityDictionary>) {

        treeItem.treeViewItemList.forEach((item: treeViewItem) => {
            let currentValueOfusedInTotal = item.usedInTotal;
            item.usedInTotal = isUsedInTotal;
            if (item.itemType === enums.TreeViewItemType.marksScheme && currentValueOfusedInTotal !== item.usedInTotal) {
                this.triggerProcessMark(item);
            }
            if (item.treeViewItemList) {
                /** if the item has an optionality rule and it is not used in total we can directly set its
                 *  childrens to not used in total, otherwise check for the item optionality as well.
                 */
                if (isUsedInTotal === false) {
                    this.setUsedIntotalInChildren(item, isUsedInTotal, optionalItems);
                } else {
                    if (this.hasSimpleOptionality(item)) {
                        /** if the item has an optionality that has to be applicable to its childrens */
                        item.totalMarks = this.getTotalString(this.setSimpleOptionality(item, optionalItems));
                    } else {
                        this.setUsedIntotalInChildren(item, isUsedInTotal, optionalItems);
                    }
                }
            }
        });
        // set the variables foe holding optionality rule met or not info.
        this.setOptionalItemsMarkedData(treeItem, optionalItems);
    }

    /**
     * to initiate the process mark, inorder to update the dirty flag for usedintotal changes
     * @param item
     */
    private triggerProcessMark(item: treeViewItem) {
        if (this.marksManagementHelper
            && item.allocatedMarks.displayMark !== constants.NO_MARK
            && item.allocatedMarks.displayMark !== constants.NOT_MARKED) {

            /* Trigger process mark to set dierty flag base on usedin total value changes */
            this.marksManagementHelper.processMark(item.allocatedMarks,
                item.uniqueId,
                0, // not relevant here since marking progress is not getting updated as part of usedin total changes
                item.markCount,
                parseFloat(item.totalMarks),
                (item.totalMarks === constants.NOT_MARKED), // not relevenat here
                true,
                false,
                item.usedInTotal,
                undefined, // not relevant here
                item.markSchemeGroupId,
                true,
                false,
				0,
				item.markSchemeCount,
				this.logSaveMarksAction);
        }
    }

    /**
     * returns the new total mark by adding the currently enterd mark
     * @param markEntered newly entered mark
     * @param total current total
     */
    private getTotalMark(markEntered?: number, total?: number): number {

        if (markEntered !== undefined && markEntered !== null) {
            /** if total is NR (null) or not marked(undefined) assigning the entered mark as total,
             * otherwise adding the enetered mark to total
             */
            if (total === null || total === undefined) {
                total = markEntered;
            } else {
                total = total + markEntered;
            }
        } else if (markEntered === null) {

            if (total === undefined) {
                total = null;
            }
        }
        return total;
    }

    /**
     * returns whether the treeitem has simple optionality rule (maximumExpectedResponses) or not.
     * @param treeItem
     */
    private hasSimpleOptionality(treeItem: treeViewItem) {
        return (treeItem.maximumExpectedResponses && treeItem.maximumExpectedResponses > 0);
    }

    /**
     * to set the items with optionality and whether the markcount reached optional items count.
     * @param treeItem
     * @param optionalItems
     * @param currentBIndex
     */
    private setOptionalItemsMarkedData(treeItem: treeViewItem, optionalItems?: Array<OptionalityDictionary>) {

        if (this.hasSimpleOptionality(treeItem)) {

            let _isAlreadyAdded: boolean = false;

            let _optionalMarked = (treeItem.treeViewItemList.
                filter(x => x.isFullyMarked && x.usedInTotal).count() >= treeItem.maximumExpectedResponses);

            if (optionalItems && optionalItems.length > 0) {
                optionalItems.forEach((item: OptionalityDictionary) => {
                    if (item.markschemeId === treeItem.uniqueId) {

                        //updating thee optional items and its marked info if it is already added.
                        item.optionalMarked = _optionalMarked;
                        item.usedInTotal = treeItem.usedInTotal;

                        _isAlreadyAdded = true;
                    }
                });
            }
            if (_isAlreadyAdded === false) {

                // Adding the optional items and its marked info if it is not added.
                let value: OptionalityDictionary;

                value = {
                    markschemeId: treeItem.uniqueId,
                    optionalMarked: _optionalMarked,
                    usedInTotal: treeItem.usedInTotal
                };

                optionalItems.push(value);
            }
        }
    }
}
export = DefaultMarkCalculationRule;
