"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var enums = require('../../components/utility/enums');
var constants = require('../../components/utility/constants');
var Immutable = require('immutable');
var sortHelper = require('../../../src/utility/sorting/sorthelper');
var comparerList = require('../../../src/utility/sorting/sortbase/comparerlist');
var markCalculationRuleBase = require('./markcalculationrulebase');
/**
 * Default rule for mark calculation
 */
var DefaultMarkCalculationRule = (function (_super) {
    __extends(DefaultMarkCalculationRule, _super);
    function DefaultMarkCalculationRule() {
        _super.apply(this, arguments);
        /* variable to hold whether the item found during tree traversal */
        this.isItemFound = false;
    }
    /**
     * *Calculate total mark, actual mark and marking progress
     * @param treeItem
     * @param currentBIndex - the bIndex of selected node.
     * @param marksManagementHelper -
     * @param optionalItems - the dictionary with optionality applicanble items and isall optional items marked info.
     */
    DefaultMarkCalculationRule.prototype.calculateMaximumAndTotalMark = function (treeItem, currentBIndex, marksManagementHelper, optionalItems) {
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
        }
        catch (exception) {
            window.onerror(exception.message, '', null, null, exception);
        }
    };
    /**
     * calculating the total marks.
     * @param treeItem
     * @param currentBIndex
     * @param optionalItems
     */
    DefaultMarkCalculationRule.prototype.calculateMark = function (treeItem, currentBIndex, optionalItems) {
        var _this = this;
        var total = undefined;
        var maxMark = 0;
        var markedCount = 0;
        var markSchemeCount = 0;
        /**
         * traverse only if the currentBIndex is null(first time) or it is less than the item bIndex
         * (this will traverse through the lower bIndex itms only and hence avoid the unwanted traversal)
         */
        if (!currentBIndex || currentBIndex <= treeItem.bIndex) {
            treeItem.treeViewItemList.forEach(function (item) {
                var markEntered;
                if (item.bIndex === currentBIndex) {
                    _this.isItemFound = true;
                }
                /** iterating through child only if the item with currentBindex has not found */
                if (item.treeViewItemList && item.treeViewItemList.count() > 0 && _this.isItemFound === false) {
                    _this.calculateMark(item, currentBIndex, optionalItems);
                }
                /** calculating the maximum mark of the item */
                if (!currentBIndex && !isNaN(item.maximumNumericMark)) {
                    maxMark = maxMark + item.maximumNumericMark;
                }
                if (item.itemType === enums.TreeViewItemType.marksScheme) {
                    // TODO : Change as per hide total on non numeric story
                    var _enteredMark = (item.allocatedMarks.valueMark) ? item.allocatedMarks.valueMark : item.allocatedMarks.displayMark;
                    markEntered = _this.getEnteredMark(_enteredMark);
                }
                else {
                    markEntered = _this.getEnteredMark(item.totalMarks);
                }
                /** calculating the total based on entered mark */
                total = _this.getTotalMark(markEntered, total);
                _this.setMarkedMarkschemeCount(item, markEntered);
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
    };
    /**
     * set the Fully Marked Value for enabling the complete button
     * @param treeItem
     * @param currentBIndex
     * @param markedCount
     * @param markSchemeCount
     */
    DefaultMarkCalculationRule.prototype.setFullyMarked = function (treeItem, markedCount) {
        if (markedCount > 0 && (markedCount === treeItem.maximumExpectedResponses
            || (markedCount === treeItem.markSchemeCount)
            || (this.hasSimpleOptionality(treeItem)
                && treeItem.treeViewItemList.filter(function (x) { return x.isFullyMarked && x.usedInTotal; }).count() === treeItem.maximumExpectedResponses))) {
            treeItem.isFullyMarked = true;
        }
        else {
            treeItem.isFullyMarked = false;
        }
    };
    /**
     * get the mark value from entered mark
     * return undefined for not marked(-) and nulll for not attempeted(NR)
     * @param enteredMark
     */
    DefaultMarkCalculationRule.prototype.getEnteredMark = function (enteredMark) {
        if (enteredMark === undefined || enteredMark === constants.NOT_MARKED || enteredMark === '') {
            return undefined;
        }
        else if (enteredMark === constants.NOT_ATTEMPTED) {
            return null;
        }
        return parseFloat(enteredMark);
    };
    /**
     * setting the mark details in treeview item
     * @param treeItem
     * @param maxMark
     * @param total
     * @param currentBIndex
     * @param markedCount
     * @param markSchemeCount
     */
    DefaultMarkCalculationRule.prototype.setMarksInTreeItem = function (treeItem, maxMark, total, currentBIndex, markedCount, markSchemeCount) {
        if (maxMark > 0) {
            treeItem.maximumNumericMark = maxMark;
        }
        treeItem.totalMarks = this.getTotalString(total);
        treeItem.markCount = markedCount;
        treeItem.markingProgress = sortHelper.evenRound((markedCount / treeItem.markSchemeCount) * 100, 0);
        treeItem.isAllNR = treeItem.totalMarks === constants.NOT_ATTEMPTED ? true : false;
    };
    /**
     * return the total mark string (NR or - or the actual total mark)
     * @param totalMark
     */
    DefaultMarkCalculationRule.prototype.getTotalString = function (totalMark) {
        if (totalMark === undefined) {
            return constants.NOT_MARKED;
        }
        else if (totalMark === null) {
            return constants.NOT_ATTEMPTED;
        }
        return totalMark.toString();
    };
    /**
     * setting the  value of marked count for mark schemes
     * @param treeItem
     * @param markEntered
     */
    DefaultMarkCalculationRule.prototype.setMarkedMarkschemeCount = function (treeItem, markEntered) {
        if (treeItem.itemType === enums.TreeViewItemType.marksScheme) {
            if (markEntered === undefined) {
                treeItem.markCount = 0;
            }
            else {
                treeItem.markCount = 1;
            }
        }
    };
    /**
     * set used in total clusters based on the simple optionality rule.
     * @param treeItem
     */
    DefaultMarkCalculationRule.prototype.setSimpleOptionality = function (treeItem, optionalItems) {
        var _this = this;
        var counter = 0;
        var totalMark = undefined;
        var maxMark = 0;
        /* sorting the clusters in descending order of the total mark */
        var clusterList = Immutable.List(sortHelper.sort(treeItem.treeViewItemList.toArray(), comparerList.ClusterComparer));
        clusterList.forEach(function (item) {
            var currentValueOfusedInTotal;
            if (counter < treeItem.maximumExpectedResponses) {
                /* setting the used in total flag true for those come within the max expected response count range*/
                currentValueOfusedInTotal = item.usedInTotal;
                item.usedInTotal = true;
                /** calculating new total based used in total items only */
                if (item.itemType === enums.TreeViewItemType.marksScheme) {
                    // TODO : Change as per hide total on non numeric story
                    var _enteredMark = (item.allocatedMarks.valueMark) ? item.allocatedMarks.valueMark : item.allocatedMarks.displayMark;
                    totalMark = _this.getTotalMark(_this.getEnteredMark(_enteredMark), totalMark);
                }
                else {
                    totalMark = _this.getTotalMark(_this.getEnteredMark(item.totalMarks), totalMark);
                }
                /** calculating the maximum mark of the item based on optionality rule */
                maxMark = maxMark + item.maximumNumericMark;
                /** no need to set child optionality true if it already has an opationality rule */
                if (item.treeViewItemList && (!_this.hasSimpleOptionality(item))) {
                    _this.setUsedIntotalInChildren(item, true, optionalItems);
                }
                else {
                    /** if the item has an optionality that has to be applicable to its childrens */
                    if (item.itemType !== enums.TreeViewItemType.marksScheme) {
                        item.totalMarks = _this.getTotalString(_this.setSimpleOptionality(item, optionalItems));
                    }
                }
            }
            else {
                currentValueOfusedInTotal = item.usedInTotal;
                item.usedInTotal = false;
                if (item.treeViewItemList) {
                    _this.setUsedIntotalInChildren(item, false, optionalItems);
                }
            }
            /** set the fullyMarked option for enabling the complete button for Clusters/child cluster */
            _this.setFullyMarked(item, item.markCount);
            /** set the variables for holding optionality rule met or not info. */
            _this.setOptionalItemsMarkedData(treeItem, optionalItems);
            if (item.itemType === enums.TreeViewItemType.marksScheme && currentValueOfusedInTotal !== item.usedInTotal) {
                _this.triggerProcessMark(item);
            }
            counter++;
        });
        treeItem.maximumNumericMark = maxMark;
        return totalMark;
    };
    /**
     * to set the usedin total flag in child node items
     * @param treeItem
     * @param isUsedInTotal
     */
    DefaultMarkCalculationRule.prototype.setUsedIntotalInChildren = function (treeItem, isUsedInTotal, optionalItems) {
        var _this = this;
        treeItem.treeViewItemList.forEach(function (item) {
            var currentValueOfusedInTotal = item.usedInTotal;
            item.usedInTotal = isUsedInTotal;
            if (item.itemType === enums.TreeViewItemType.marksScheme && currentValueOfusedInTotal !== item.usedInTotal) {
                _this.triggerProcessMark(item);
            }
            if (item.treeViewItemList) {
                /** if the item has an optionality rule and it is not used in total we can directly set its
                 *  childrens to not used in total, otherwise check for the item optionality as well.
                 */
                if (isUsedInTotal === false) {
                    _this.setUsedIntotalInChildren(item, isUsedInTotal, optionalItems);
                }
                else {
                    if (_this.hasSimpleOptionality(item)) {
                        /** if the item has an optionality that has to be applicable to its childrens */
                        item.totalMarks = _this.getTotalString(_this.setSimpleOptionality(item, optionalItems));
                    }
                    else {
                        _this.setUsedIntotalInChildren(item, isUsedInTotal, optionalItems);
                    }
                }
            }
        });
        // set the variables foe holding optionality rule met or not info.
        this.setOptionalItemsMarkedData(treeItem, optionalItems);
    };
    /**
     * to initiate the process mark, inorder to update the dirty flag for usedintotal changes
     * @param item
     */
    DefaultMarkCalculationRule.prototype.triggerProcessMark = function (item) {
        if (this.marksManagementHelper
            && item.allocatedMarks.displayMark !== constants.NO_MARK
            && item.allocatedMarks.displayMark !== constants.NOT_MARKED) {
            /* Trigger process mark to set dierty flag base on usedin total value changes */
            this.marksManagementHelper.processMark(item.allocatedMarks, item.uniqueId, 0, // not relevant here since marking progress is not getting updated as part of usedin total changes
            item.markCount, parseFloat(item.totalMarks), (item.totalMarks === constants.NOT_MARKED), // not relevenat here
            true, false, item.usedInTotal, undefined, // not relevant here
            item.markSchemeGroupId, true, false, 0, this.logSaveMarksAction);
        }
    };
    /**
     * returns the new total mark by adding the currently enterd mark
     * @param markEntered newly entered mark
     * @param total current total
     */
    DefaultMarkCalculationRule.prototype.getTotalMark = function (markEntered, total) {
        if (markEntered !== undefined && markEntered !== null) {
            /** if total is NR (null) or not marked(undefined) assigning the entered mark as total,
             * otherwise adding the enetered mark to total
             */
            if (total === null || total === undefined) {
                total = markEntered;
            }
            else {
                total = total + markEntered;
            }
        }
        else if (markEntered === null) {
            if (total === undefined) {
                total = null;
            }
        }
        return total;
    };
    /**
     * returns whether the treeitem has simple optionality rule (maximumExpectedResponses) or not.
     * @param treeItem
     */
    DefaultMarkCalculationRule.prototype.hasSimpleOptionality = function (treeItem) {
        return (treeItem.maximumExpectedResponses && treeItem.maximumExpectedResponses > 0);
    };
    /**
     * to set the items with optionality and whether the markcount reached optional items count.
     * @param treeItem
     * @param optionalItems
     * @param currentBIndex
     */
    DefaultMarkCalculationRule.prototype.setOptionalItemsMarkedData = function (treeItem, optionalItems) {
        if (this.hasSimpleOptionality(treeItem)) {
            var _isAlreadyAdded_1 = false;
            var _optionalMarked_1 = (treeItem.treeViewItemList.
                filter(function (x) { return x.isFullyMarked && x.usedInTotal; }).count() >= treeItem.maximumExpectedResponses);
            if (optionalItems && optionalItems.length > 0) {
                optionalItems.forEach(function (item) {
                    if (item.markschemeId === treeItem.uniqueId) {
                        //updating thee optional items and its marked info if it is already added.
                        item.optionalMarked = _optionalMarked_1;
                        item.usedInTotal = treeItem.usedInTotal;
                        _isAlreadyAdded_1 = true;
                    }
                });
            }
            if (_isAlreadyAdded_1 === false) {
                // Adding the optional items and its marked info if it is not added.
                var value = void 0;
                value = {
                    markschemeId: treeItem.uniqueId,
                    optionalMarked: _optionalMarked_1,
                    usedInTotal: treeItem.usedInTotal
                };
                optionalItems.push(value);
            }
        }
    };
    return DefaultMarkCalculationRule;
}(markCalculationRuleBase));
module.exports = DefaultMarkCalculationRule;
//# sourceMappingURL=defaultmarkcalculationrule.js.map