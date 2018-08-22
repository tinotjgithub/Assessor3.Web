"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var enums = require('../../components/utility/enums');
var constants = require('../../components/utility/constants');
var accuracyRuleBase = require('./accuracyrulebase');
/**
 * Default rule for mark calculation
 */
var MarkSchemeToleranceAccuracyRule = (function (_super) {
    __extends(MarkSchemeToleranceAccuracyRule, _super);
    /**
     *  Constructor of MarkSchemeToleranceAccuracyRule
     * @param responseMode
     * @param markGroupId
     */
    function MarkSchemeToleranceAccuracyRule(responseMode, markGroupId) {
        _super.call(this, responseMode, markGroupId);
    }
    /**
     * Calculate the accuracy of amr scheme
     * @param examinerMark
     * @param comparingMark
     */
    MarkSchemeToleranceAccuracyRule.prototype.calculateMarkAccuracy = function (examinerMark, comparingMark) {
        var accuracyIndicator = enums.AccuracyIndicatorType.Unknown;
        if (examinerMark !== null) {
            // If definitive marks available, then check the accuracy else return unKnown
            if (comparingMark !== null) {
                // get NR descrepancy : If one (but not both) marks are "NR", there is an NR discrepancy
                var nrDescrepancy = ((examinerMark.allocatedMarks.displayMark = constants.NOT_ATTEMPTED)
                    !== (comparingMark.mark.displayMark = constants.NOT_ATTEMPTED));
                // When numeric marks, check the allowable difference and set accordingly,
                // in case of non- numeric just compare the nonnumeric values.
                if (!(examinerMark.allocatedMarks.valueMark)) {
                    // If accurate, return the accuracy indicator based on the nr descrepancy.
                    if (examinerMark.allocatedMarks.displayMark === comparingMark.mark.displayMark) {
                        accuracyIndicator = nrDescrepancy ? enums.AccuracyIndicatorType.AccurateNR :
                            enums.AccuracyIndicatorType.Accurate;
                        examinerMark.accuracyIndicator = accuracyIndicator;
                        return accuracyIndicator;
                    }
                    else {
                        // If not accurate, check the absolute difference to allowable difference and return the result.
                        var absoluteDifference = Math.abs(parseFloat(examinerMark.allocatedMarks.displayMark)
                            - parseFloat(comparingMark.mark.displayMark));
                        if (examinerMark.allowableDifference && absoluteDifference <= examinerMark.allowableDifference) {
                            accuracyIndicator = nrDescrepancy ? enums.AccuracyIndicatorType.WithinToleranceNR :
                                enums.AccuracyIndicatorType.WithinTolerance;
                            examinerMark.accuracyIndicator = accuracyIndicator;
                            return accuracyIndicator;
                        }
                        else {
                            accuracyIndicator = nrDescrepancy ? enums.AccuracyIndicatorType.OutsideToleranceNR :
                                enums.AccuracyIndicatorType.OutsideTolerance;
                            examinerMark.accuracyIndicator = accuracyIndicator;
                            return accuracyIndicator;
                        }
                    }
                }
                else {
                    // For non numeric marks just need to check the non numeric marks, if not equal return outside tolerance.
                    if (examinerMark.allocatedMarks.displayMark === comparingMark.mark.displayMark) {
                        accuracyIndicator = nrDescrepancy ? enums.AccuracyIndicatorType.AccurateNR :
                            enums.AccuracyIndicatorType.Accurate;
                        examinerMark.accuracyIndicator = accuracyIndicator;
                        return accuracyIndicator;
                    }
                    else {
                        accuracyIndicator = nrDescrepancy ? enums.AccuracyIndicatorType.OutsideToleranceNR :
                            enums.AccuracyIndicatorType.OutsideTolerance;
                        examinerMark.accuracyIndicator = accuracyIndicator;
                        return accuracyIndicator;
                    }
                }
            }
            // No definitive marks (either provisional or live marks) return UnKnown.
            accuracyIndicator = enums.AccuracyIndicatorType.Unknown;
            examinerMark.accuracyIndicator = accuracyIndicator;
        }
        return accuracyIndicator;
    };
    /**
     * Calculate the accuracy of response
     * @param workItem
     * @param comparingWorkItem
     */
    MarkSchemeToleranceAccuracyRule.prototype.CalculateRigTotalAndAccuracy = function (workItem, comparingDetails) {
        var _this = this;
        // if comparing work item is null (Live Marking), return unknown.
        if (comparingDetails === null) {
            return enums.AccuracyIndicatorType.Unknown;
        }
        // variables for holding absolute marks difference, NR Discrepancy, total outside tolerance mark schemes and accuracy indicator
        var absoluteMarksDifference = 0;
        var markSchemesOutsideTolerance = 0;
        var nrDiscrepancy = false;
        var accuracyIndicator = enums.AccuracyIndicatorType.Unknown;
        if (workItem !== null) {
            var i = 0;
            // Loop through each mark and update mark accuracy. foreach(let mark in
            workItem.treeViewItemList.forEach(function (item) {
                // Fetch the comparing marks
                //let comparingMark: treeViewItem = comparingWorkItem.treeViewItemList.filter((x: treeViewItem) =>
                //    x.uniqueId === item.uniqueId).first();
                var comparingMark;
                if (comparingDetails.isDefinitive) {
                    comparingMark = _this.getDefinitiveMark(workItem.previousMarks);
                }
                if (comparingDetails.isRemark) {
                    comparingMark = _this.getOriginalMark(workItem.previousMarks);
                }
                if (item.treeViewItemList && item.treeViewItemList.count() > 0) {
                    _this.CalculateRigTotalAndAccuracy(item, comparingMark);
                }
                if (item.itemType === enums.TreeViewItemType.marksScheme) {
                    // Call CalculateMarkAccuracy to calculate the marks accuracy.
                    accuracyIndicator = _this.calculateMarkAccuracy(item, comparingMark);
                    // if accuracy indicator is unknown, the RIG accuracy will be unknown.
                    if (accuracyIndicator === enums.AccuracyIndicatorType.Unknown) {
                        return enums.AccuracyIndicatorType.Unknown;
                    }
                    // If mark is outside tolerance, increment the count of markSchemesOutsideTolerance
                    markSchemesOutsideTolerance += (accuracyIndicator === enums.AccuracyIndicatorType.OutsideTolerance
                        || accuracyIndicator === enums.AccuracyIndicatorType.OutsideToleranceNR) ? 1 : 0;
                    // Update NR Discrepancy flag
                    nrDiscrepancy = nrDiscrepancy || _this.DetectNRDiscrepancy(accuracyIndicator);
                    // Caclucate AMD value and update RIG AMD.
                    if (item.allocatedMarks.displayMark && comparingMark !== null && comparingMark.mark.displayMark) {
                        absoluteMarksDifference += Math.abs(parseFloat(item.allocatedMarks.displayMark) -
                            parseFloat(comparingMark.mark.displayMark));
                    }
                }
            });
            // Calculate RIG Accuracy based on mark scheme tolerance
            // If absolute mark difference is 0, RIG is accurate.
            if (absoluteMarksDifference === 0) {
                // Accurate with NR discrepancy if any.
                accuracyIndicator = nrDiscrepancy ? enums.AccuracyIndicatorType.AccurateNR : enums.AccuracyIndicatorType.Accurate;
            }
            else if (markSchemesOutsideTolerance <= this.examinerMarksAndAnnotation.accuracyTolerance) {
                // Mark schemes outside tolerance are less than/equal to gold tolerance (Accuracy Tolerance), then its within tolerance
                accuracyIndicator = nrDiscrepancy ? enums.AccuracyIndicatorType.WithinToleranceNR :
                    enums.AccuracyIndicatorType.WithinTolerance;
            }
            else {
                // Outside tolerance with NR discrepancy if any.
                accuracyIndicator = nrDiscrepancy ? enums.AccuracyIndicatorType.OutsideToleranceNR :
                    enums.AccuracyIndicatorType.OutsideTolerance;
            }
            var prevTotal = (comparingDetails.isDefinitive) ? this.getDefinitiveMark(workItem.previousMarks) :
                this.getOriginalMark(workItem.previousMarks);
            // Update work item details.
            workItem.absoluteMarksDifference = absoluteMarksDifference;
            workItem.totalMarksDifference = Math.abs(this.getActualMark(workItem.totalMarks) -
                this.getActualMark(prevTotal.mark.displayMark));
            workItem.accuracyIndicator = accuracyIndicator;
            return accuracyIndicator;
        }
    };
    return MarkSchemeToleranceAccuracyRule;
}(accuracyRuleBase));
module.exports = MarkSchemeToleranceAccuracyRule;
//# sourceMappingURL=markschemetoleranceaccuracyrule.js.map