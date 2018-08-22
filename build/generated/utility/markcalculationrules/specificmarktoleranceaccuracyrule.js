"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var enums = require('../../components/utility/enums');
var constants = require('../../components/utility/constants');
var accuracyRuleBase = require('./accuracyrulebase');
var worklistStore = require('../../stores/worklist/workliststore');
/**
 * Class for calculating the Rig accuracy based on the Specific Mark Tolerance Method.
 */
var SpecificMarkToleranceAccuracyRule = (function (_super) {
    __extends(SpecificMarkToleranceAccuracyRule, _super);
    /**
     *  Constructor of MarkSchemeToleranceAccuracyRule
     * @param responseMode
     * @param markGroupId
     */
    function SpecificMarkToleranceAccuracyRule(responseMode, markGroupId) {
        _super.call(this, responseMode, markGroupId);
    }
    /**
     * Calculate the accuracy of amr scheme
     * @param examinerMark
     * @param comparingMark
     */
    SpecificMarkToleranceAccuracyRule.prototype.calculateMarkAccuracy = function (examinerMark, comparingMark) {
        var accuracyIndicator = enums.AccuracyIndicatorType.Unknown;
        // if the mark to compare is null, not need to proceed, return Unknown.
        if (comparingMark === null) {
            return enums.AccuracyIndicatorType.Unknown;
        }
        var _isSeedingResponse = (this.responseMode === enums.MarkingMode.Seeding);
        //// get the maximum range of the marks that should be awarded for the response from the definitive marks.
        var definitiveMarkMaximumRange = _isSeedingResponse ?
            (this.getActualMark(comparingMark.mark.displayMark) + examinerMark.positiveTolerance) :
            comparingMark.upperTolerance;
        //// get the minimum range of the marks that should be awarded for the response from the definitive marks.
        var definitiveMarkMinimumRange = _isSeedingResponse ? (this.getActualMark(comparingMark.mark.displayMark) -
            Math.abs(examinerMark.negativeTolerance)) : comparingMark.lowerTolerance;
        if (examinerMark !== null) {
            var nrDescrepancy = ((examinerMark.allocatedMarks.displayMark = constants.NOT_ATTEMPTED)
                !== (comparingMark.mark.displayMark = constants.NOT_ATTEMPTED));
            if (!examinerMark.allocatedMarks.valueMark) {
                // check whether the examiner marks and comparing marks are equal
                if (examinerMark.allocatedMarks.displayMark === comparingMark.mark.displayMark) {
                    /* Both definitive marks and examiner marks are same and there is no NR discrepancy, record the item as accurate.
                       If there is an NR discrepancy, record the item as 'Within Tolerance'. */
                    examinerMark.accuracyIndicator = nrDescrepancy ? enums.AccuracyIndicatorType.WithinToleranceNR :
                        enums.AccuracyIndicatorType.Accurate;
                }
                else if (this.responseMode !== enums.MarkingMode.PreStandardisation &&
                    worklistStore.instance.currentWorklistType !== enums.WorklistType.classification &&
                    definitiveMarkMinimumRange <= this.getActualMark(examinerMark.allocatedMarks.displayMark) &&
                    this.getActualMark(examinerMark.allocatedMarks.displayMark) <= definitiveMarkMaximumRange) {
                    // tolerances should not be checked during standardisation setup
                    /* examiner marks falls within the range of maximum Definitivemark rage and minimun Definitive mark range.
                       record the accuracy as 'Within Tolerance' . Defect # 16382 - NR discrepancy also considered */
                    examinerMark.accuracyIndicator = nrDescrepancy ? enums.AccuracyIndicatorType.WithinToleranceNR :
                        enums.AccuracyIndicatorType.WithinTolerance;
                }
                else {
                    /* examiner marks falls outside the range of maximum Definitivemark rage or minimun Definitive mark range.
                       record the accuracy as 'Within Tolerance'
                       Defect # 16382 - NR discrepancy also considered */
                    examinerMark.accuracyIndicator = nrDescrepancy ? enums.AccuracyIndicatorType.OutsideToleranceNR :
                        enums.AccuracyIndicatorType.OutsideTolerance;
                }
                return examinerMark.accuracyIndicator;
            }
            else {
                // not considering non numeric marks for the time being.
                return enums.AccuracyIndicatorType.Unknown;
            }
        }
        else {
            return enums.AccuracyIndicatorType.Unknown;
        }
    };
    /**
     * Calculate the accuracy of response
     * @param workItem
     * @param comparingWorkItem
     */
    SpecificMarkToleranceAccuracyRule.prototype.CalculateRigTotalAndAccuracy = function (workItem, comparingDetails) {
        var _this = this;
        // check whehter the definitive marks is null, for live items comparingWorkItem would be null.
        if (comparingDetails === null) {
            // since the response is a Live response return accuracy as Unknown.
            return enums.AccuracyIndicatorType.Unknown;
        }
        /* running total of the -ve tolerance values of a question item that indicates
           how many marks falls in the 'OutsideTolerance' accuracy. */
        var totalNegativeOutsideToleranceValue = 0;
        // running total of the +ve tolerance values of a question item that falls in the 'OutsideTolerance' accuracy.
        var totalPositiveOutsideToleranceValue = 0;
        var isAllMarksAccurate = true;
        // check whether response is seeding or not.
        var _isSeedingResponse = (this.responseMode === enums.MarkingMode.Seeding);
        // Defect # 16382 flag for NR Descrepancy indication.
        var notAttemptedDescrepancy = false;
        if (workItem != null) {
            // itreates through all the examiner marks in the work item.
            if (workItem != null) {
                // Loop through each mark and update mark accuracy. foreach(let mark in
                workItem.treeViewItemList.forEach(function (item) {
                    // Fetch the comparing marks
                    //let definitiveMark: treeViewItem = comparingWorkItem.treeViewItemList.filter((x: treeViewItem) =>
                    //    x.uniqueId === item.uniqueId).first();
                    var comparingMark;
                    if (comparingDetails.isDefinitive) {
                        comparingMark = _this.getDefinitiveMark(workItem.previousMarks);
                    }
                    if (comparingDetails.isRemark) {
                        comparingMark = _this.getOriginalMark(workItem.previousMarks);
                    }
                    notAttemptedDescrepancy = notAttemptedDescrepancy ||
                        ((comparingMark.mark.displayMark === constants.NOT_ATTEMPTED) !==
                            (item.allocatedMarks.displayMark === constants.NOT_ATTEMPTED));
                    // calculate the accuracy of the examiner mark.
                    var accuracyIndicator = _this.calculateMarkAccuracy(item, comparingMark);
                    item.accuracyIndicator = accuracyIndicator;
                    // check whether the accuracy of the examiner marks is Accurate or not.Also consider the optionality of the mark.
                    if (accuracyIndicator !== enums.AccuracyIndicatorType.Accurate && item.usedInTotal) {
                        // set the flag indicating all the marks are not accurate.
                        isAllMarksAccurate = false;
                        /* check whether the accuracy od the current examiner mark falls Outside tolerance.
                           Defect # 16382 NR descrepancy also considered */
                        if (accuracyIndicator === enums.AccuracyIndicatorType.OutsideTolerance
                            || accuracyIndicator === enums.AccuracyIndicatorType.OutsideToleranceNR) {
                            /* mark falls in the outside tolerance, find the maximum and minimun range of the total marks from
                               definitive total mark. if the response is a seeding response tolerance value is added/subtracted from the
                               definitive mark and for  standardisation responses lower mark range and upper mark range is taken */
                            var definitiveMaximumMarkRange = _isSeedingResponse ?
                                (_this.getActualMark(comparingMark.mark.displayMark)
                                    + item.positiveTolerance) : comparingMark.upperTolerance;
                            var definitiveMinimumMarkRange = _isSeedingResponse ?
                                (_this.getActualMark(comparingMark.mark.displayMark)
                                    - Math.abs(item.negativeTolerance)) : comparingMark.lowerTolerance;
                            // check whethethe examiner's mark is greater than the definitive mark
                            if (_this.getActualMark(item.allocatedMarks.displayMark) >
                                _this.getActualMark(comparingMark.mark.displayMark)) {
                                /* exminer's mark is greater, find how many marks above is Examiner's mark wrt to the maximum range of
                                   definitive mark and add it to the pervious value. */
                                totalPositiveOutsideToleranceValue += _this.getActualMark(item.allocatedMarks.displayMark)
                                    - definitiveMaximumMarkRange;
                            }
                            else {
                                // definitive mark is greater, find how many marks below is Examiner's mark wrt to the minimum range of
                                //  definitive mark and add it to the pervious value.
                                totalNegativeOutsideToleranceValue = totalNegativeOutsideToleranceValue +
                                    (_this.getActualMark(item.allocatedMarks.displayMark) - definitiveMinimumMarkRange);
                            }
                        }
                    }
                });
                var prevTotal = (comparingDetails.isDefinitive) ? this.getDefinitiveMark(workItem.previousMarks) :
                    this.getOriginalMark(workItem.previousMarks);
                // find the maximum and minimum  range of the definitive Total mark.
                // if the response is a seeding response tolerance value is added/subtracted from the definitive total mark and for
                // standardisation responses lower total mark range and upper total mark range is taken.
                var totalMarkMaximumRange = _isSeedingResponse ? (this.getActualMark(prevTotal.mark.displayMark) +
                    this.examinerMarksAndAnnotation.totalUpperTolerance) : this.examinerMarksAndAnnotation.totalUpperTolerance;
                var totalMarkMinimumRange = _isSeedingResponse ? (this.getActualMark(prevTotal.mark.displayMark) -
                    Math.abs(this.examinerMarksAndAnnotation.totalLowerTolerance)) : this.examinerMarksAndAnnotation.totalLowerTolerance;
                // check the accuracy of Total Marks to see whether it falls within the maximum and minimum range.
                if (totalMarkMinimumRange <= this.getActualMark(workItem.totalMarks) && this.getActualMark(workItem.totalMarks)
                    <= totalMarkMaximumRange) {
                    // check whether all the marks by the examiner are accurate or not.
                    if (isAllMarksAccurate) {
                        // set the Accuracy of the WorkItem as 'Accurate' and return the accuracy status.
                        // Defect # 16382 - NR descrepancy also considered
                        workItem.accuracyIndicator = notAttemptedDescrepancy ? enums.AccuracyIndicatorType.WithinToleranceNR
                            : enums.AccuracyIndicatorType.Accurate;
                    }
                    else {
                        // examiner's total does not falls in the maximum and minimun range.
                        // get the allowable total tolerance values.
                        var allowablePositiveTotalTolerance = _isSeedingResponse ? this.examinerMarksAndAnnotation.totalUpperTolerance :
                            (this.examinerMarksAndAnnotation.totalUpperTolerance - this.getActualMark(prevTotal.mark.displayMark));
                        var allowableNegativeTotalTolerance = _isSeedingResponse ? this.examinerMarksAndAnnotation.totalLowerTolerance :
                            Math.abs(this.getActualMark(prevTotal.mark.displayMark) -
                                this.examinerMarksAndAnnotation.totalLowerTolerance);
                        // check whether the sum of +ve outside tolerance values is less than the +ve total tolerance of definitive
                        // total mark and sum absolute value of -ve tolerance values is less than the -ve total tolerance of the
                        // definitive total mark.
                        if (totalPositiveOutsideToleranceValue <= allowablePositiveTotalTolerance
                            && Math.abs(totalNegativeOutsideToleranceValue) <= allowableNegativeTotalTolerance) {
                            // sum of both +ve and -ve outside tolerance values falls with the range, so set the status as
                            //'Withintolerance' and return the status.
                            workItem.accuracyIndicator = notAttemptedDescrepancy ? enums.AccuracyIndicatorType.WithinToleranceNR :
                                enums.AccuracyIndicatorType.WithinTolerance;
                        }
                        else {
                            // sum of both +ve and -ve outside tolerance values falls outside tolerance,set the accuracy to
                            // OutSideTolerance and return the accuracy.
                            workItem.accuracyIndicator = notAttemptedDescrepancy ? enums.AccuracyIndicatorType.OutsideToleranceNR :
                                enums.AccuracyIndicatorType.OutsideTolerance;
                        }
                    }
                }
                else {
                    // the examiners marks falls out side the range, the accuracy of the workitem to 'OutsideTolerance'
                    // and return the accuracy.
                    workItem.accuracyIndicator = notAttemptedDescrepancy ? enums.AccuracyIndicatorType.OutsideToleranceNR :
                        enums.AccuracyIndicatorType.OutsideTolerance;
                }
                // Set the total mark difference
                workItem.totalMarksDifference = this.getActualMark(workItem.totalMarks) -
                    (prevTotal.mark != null ? this.getActualMark(prevTotal.mark.displayMark) : 0);
                // return the accuracy indicator for RIG.
                return workItem.accuracyIndicator;
            }
            else {
                return enums.AccuracyIndicatorType.Unknown;
            }
        }
    };
    return SpecificMarkToleranceAccuracyRule;
}(accuracyRuleBase));
module.exports = SpecificMarkToleranceAccuracyRule;
//# sourceMappingURL=specificmarktoleranceaccuracyrule.js.map