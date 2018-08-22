import treeViewItem = require('../../stores/markschemestructure/typings/treeviewitem');
import enums = require('../../components/utility/enums');
import constants = require('../../components/utility/constants');
import Immutable = require('immutable');
import accuracyRuleSchema = require('./accuracyruleschema');
import accuracyRuleBase = require('./accuracyrulebase');

/**
 * Default rule for mark calculation
 */
class DefaultAccuracyRule extends accuracyRuleBase implements accuracyRuleSchema {


    // flag for non-numeric accurate.
    private nonNumericAccurate: boolean = null;
    // flag for NR Discrepancy indication.
    private notAttemptedDiscrepancy: boolean = false;
    // variable to hold the absolute Marks Difference
    private absoluteMarksDifference: number = 0;
    // Accuracy Indicator variable for getting the accuracy indicator.
    private accuracyIndicator: enums.AccuracyIndicatorType = enums.AccuracyIndicatorType.Unknown;

    /**
     * Constructor
     * @param responseMode
     * @param markGroupId
     */
    constructor(responseMode: enums.MarkingMode, markGroupId: number) {
        super(responseMode, markGroupId);
    }

    /**
     * Calculate mark scheme accuray tupe.
     * @param examinerMark
     * @param comparingMark
     */
    public calculateMarkAccuracy(examinerMark: treeViewItem, comparingMark: PreviousMark)
        : enums.AccuracyIndicatorType {

        let accuracyIndicator: enums.AccuracyIndicatorType = enums.AccuracyIndicatorType.Unknown;

        if (examinerMark !== null) {
            // If definitive marks available, then check the accuracy else return unKnown
            if (comparingMark !== null) {
                // get NR descrepancy : If one (but not both) marks are "NR", there is an NR discrepancy
                let nrDescrepancy: boolean = ((examinerMark.allocatedMarks.displayMark === constants.NOT_ATTEMPTED)
                    !== (comparingMark.mark.displayMark === constants.NOT_ATTEMPTED));

                /* When numeric marks, check the allowable difference and set accordingly, in case of non-numeric
                   just compare the nonnumeric values. */
                if (!examinerMark.allocatedMarks.valueMark) {
                    // If accurate, return the accuracy indicator based on the nr descrepancy.
                    if (examinerMark.allocatedMarks.displayMark === comparingMark.mark.displayMark) {
                        accuracyIndicator = nrDescrepancy ? enums.AccuracyIndicatorType.AccurateNR :
                            enums.AccuracyIndicatorType.Accurate;
                        examinerMark.accuracyIndicator = accuracyIndicator;
                        return accuracyIndicator;
                    } else {

                        // If not accurate, check the absolute difference to allowable difference and return the result.
                        let absoluteDifference: number = Math.abs(this.getActualMark(examinerMark.allocatedMarks.displayMark) -
                            this.getActualMark(comparingMark.mark.displayMark));

                        if (examinerMark.allowableDifference && absoluteDifference <= examinerMark.allowableDifference) {
                            accuracyIndicator = nrDescrepancy ? enums.AccuracyIndicatorType.WithinToleranceNR :
                                enums.AccuracyIndicatorType.WithinTolerance;
                            examinerMark.accuracyIndicator = accuracyIndicator;
                            return accuracyIndicator;
                        } else {
                            accuracyIndicator = nrDescrepancy ? enums.AccuracyIndicatorType.OutsideToleranceNR :
                                enums.AccuracyIndicatorType.OutsideTolerance;
                            examinerMark.accuracyIndicator = accuracyIndicator;
                            return accuracyIndicator;
                        }
                    }
                } else {
                    // For non numeric marks just need to check the non numeric marks, if not equal return outside tolerance.
                    if (examinerMark.allocatedMarks.displayMark === comparingMark.mark.displayMark) {
                        accuracyIndicator = nrDescrepancy ? enums.AccuracyIndicatorType.AccurateNR :
                            enums.AccuracyIndicatorType.Accurate;
                        examinerMark.accuracyIndicator = accuracyIndicator;
                        return accuracyIndicator;
                    } else {
                        accuracyIndicator = nrDescrepancy ? enums.AccuracyIndicatorType.OutsideToleranceNR :
                            enums.AccuracyIndicatorType.OutsideTolerance;
                        examinerMark.accuracyIndicator = accuracyIndicator;
                        return accuracyIndicator;
                    }
                }
            }

            examinerMark.accuracyIndicator = accuracyIndicator;
        }

        return accuracyIndicator;
    }

    /**
     * Calculate overal response accuracy
     * @param workItem
     * @param comparingWorkItem
     */
    public CalculateRigTotalAndAccuracy(workItem: treeViewItem, comparingDetails?: AccuracyCalcCharacteristics)
        : any {

        // For live marking, return UnKnown;
        if (comparingDetails === null) {
            return [enums.AccuracyIndicatorType.Unknown, 0, 0];
        }

        if (workItem !== null) {
            // Compare the marks and return result.
            workItem.treeViewItemList.forEach((item: treeViewItem) => {

                //let comparingMark: treeViewItem = comparingWorkItem.treeViewItemList.filter((x: treeViewItem) =>
                //    x.uniqueId === item.uniqueId).first();

                if (item.treeViewItemList && item.treeViewItemList.count() > 0) {
                    this.CalculateRigTotalAndAccuracy(item, comparingDetails);
                }

                if (item.itemType === enums.TreeViewItemType.marksScheme) {

                    let comparingMark: PreviousMark;
                    if (comparingDetails.isDefinitive) {
                        comparingMark = this.getDefinitiveMark(item.previousMarks);
                    }

                    if (comparingDetails.isRemark) {
                        comparingMark = this.getOriginalMark(item.previousMarks);
                    }

                    // Ensure non numeric papers are marked as such even if not marked
                    if (this.nonNumericAccurate === null && item.allocatedMarks.valueMark) {
                        this.nonNumericAccurate = true;
                    }

                    if (item.allocatedMarks.displayMark) {

                        // If numeric marks
                        if (!item.allocatedMarks.valueMark) {
                            if (comparingMark !== null && comparingMark.mark.displayMark) {

                                let comparingValue: number = this.getActualMark(comparingMark.mark.displayMark);
                                let actualValue: number = this.getActualMark(item.allocatedMarks.displayMark);

                                // Get the absolute difference and update the variable.
                                let absoluteDifference: number = Math.abs(actualValue - comparingValue);
                                this.absoluteMarksDifference = this.absoluteMarksDifference + absoluteDifference;

                                // Update notAttempted discrepancy.
                                this.notAttemptedDiscrepancy = this.notAttemptedDiscrepancy
                                    || ((comparingMark.mark.displayMark === constants.NOT_ATTEMPTED)
                                    !== (item.allocatedMarks.displayMark === constants.NOT_ATTEMPTED));
                            }
                        } else {
                            // Non numeric marks: No total, only compare the non-numeric marks
                            if (comparingMark !== null && comparingMark.mark.displayMark) {
                                if (item.allocatedMarks.displayMark !== comparingMark.mark.displayMark) {
                                    this.nonNumericAccurate = false;
                                }

                                // If NR discrepancy, update the notAttemptedDiscrepancy flag.
                                if ((item.allocatedMarks.displayMark === constants.NOT_ATTEMPTED) !==
                                    (comparingMark.mark.displayMark === constants.NOT_ATTEMPTED)) {
                                    this.nonNumericAccurate = false;
                                    this.notAttemptedDiscrepancy = true;
                                }
                            }
                        }

                        // Get the accuracy for the marks.
                        this.calculateMarkAccuracy(item, comparingMark);
                    }
                }
            });

            let totalMarksDifference = 0;

            if (workItem.itemType === enums.TreeViewItemType.QIG) {

                let prevTotal = (comparingDetails.isDefinitive) ? this.getDefinitiveMark(workItem.previousMarks) :
                    this.getOriginalMark(workItem.previousMarks);
                if (prevTotal) {
                    totalMarksDifference = Math.abs(this.getActualMark(workItem.totalMarks) -
                        this.getActualMark(prevTotal.mark.displayMark));

                    // STA 37 & 52 Tolerances. Apply a seperate AMD Tolerance (seeding) for seeding responses
                    let accuracyTolerance = (this.responseMode === enums.MarkingMode.Seeding
                        && this.examinerMarksAndAnnotation.seedingAMDTolerance)
                        ? this.examinerMarksAndAnnotation.seedingAMDTolerance : this.examinerMarksAndAnnotation.accuracyTolerance;

                /* If TMD and AMD both are set, cacluate accuracy based on both.
                   STA 37 & 52 this block will also execute even if Only TMD value and Seeding AMD value specified and
                   the response type is seeding */
                if (this.examinerMarksAndAnnotation.totalTolerance && accuracyTolerance && !comparingDetails.isSupervisorRemark) {
                    // set accuracy indicator
                    if (this.absoluteMarksDifference === 0 && this.nonNumericAccurate !== false) {
                        this.accuracyIndicator = this.notAttemptedDiscrepancy ? enums.AccuracyIndicatorType.AccurateNR :
                            enums.AccuracyIndicatorType.Accurate;
                    } else if (this.nonNumericAccurate === null && this.absoluteMarksDifference <= accuracyTolerance
                        && totalMarksDifference <= this.examinerMarksAndAnnotation.totalTolerance) {
                        // If nonNumericAccurate flag is True, don't allow Within Tolerance
                        this.accuracyIndicator = this.notAttemptedDiscrepancy ? enums.AccuracyIndicatorType.WithinToleranceNR :
                            enums.AccuracyIndicatorType.WithinTolerance;
                    } else {
                        this.accuracyIndicator = this.notAttemptedDiscrepancy ? enums.AccuracyIndicatorType.OutsideToleranceNR :
                            enums.AccuracyIndicatorType.OutsideTolerance;
                    }
                } else {
                    // Only TMD
                    if (this.examinerMarksAndAnnotation.totalTolerance || comparingDetails.isSupervisorRemark) {
                        // set accuracy indicator
                        if (totalMarksDifference === 0 && this.nonNumericAccurate !== false) {
                            this.accuracyIndicator = this.notAttemptedDiscrepancy ? enums.AccuracyIndicatorType.AccurateNR :
                                enums.AccuracyIndicatorType.Accurate;
                        } else if (this.nonNumericAccurate === null
                            && totalMarksDifference <= ((comparingDetails.isSupervisorRemark) ?
                            this.examinerMarksAndAnnotation.totalToleranceRemark : this.examinerMarksAndAnnotation.totalTolerance)) {
                            // If nonNumericAccurate flag is True, don't allow Within Tolerance
                            this.accuracyIndicator = this.notAttemptedDiscrepancy ? enums.AccuracyIndicatorType.WithinToleranceNR :
                                enums.AccuracyIndicatorType.WithinTolerance;
                        } else {
                            this.accuracyIndicator = this.notAttemptedDiscrepancy ? enums.AccuracyIndicatorType.OutsideToleranceNR :
                                enums.AccuracyIndicatorType.OutsideTolerance;
                        }
                    } else {
                        // Default AMD tolerance
                        // set accuracy indicator
                        if (this.absoluteMarksDifference === 0 && this.nonNumericAccurate !== false) {
                            this.accuracyIndicator = this.notAttemptedDiscrepancy ? enums.AccuracyIndicatorType.AccurateNR :
                                enums.AccuracyIndicatorType.Accurate;
                        } else if (this.nonNumericAccurate === null && this.absoluteMarksDifference <= accuracyTolerance) {
                            // If nonNumericAccurate flag is True, don't allow Within Tolerance
                            this.accuracyIndicator = this.notAttemptedDiscrepancy ? enums.AccuracyIndicatorType.WithinToleranceNR :
                                enums.AccuracyIndicatorType.WithinTolerance;
                        } else {
                            this.accuracyIndicator = this.notAttemptedDiscrepancy ? enums.AccuracyIndicatorType.OutsideToleranceNR :
                                enums.AccuracyIndicatorType.OutsideTolerance;
                        }
                    }
                }

                    // Set absolute marks difference to -1 for non numeric marks.
                    if (this.nonNumericAccurate) {
                        this.absoluteMarksDifference = -1;
                    }

                    // Update the work item values.
                    workItem.absoluteMarksDifference = this.absoluteMarksDifference;
                    workItem.totalMarksDifference = totalMarksDifference;
                    workItem.accuracyIndicator = this.accuracyIndicator;

                }
            }
            return [this.accuracyIndicator, this.absoluteMarksDifference, totalMarksDifference];
        }
    }
}
export = DefaultAccuracyRule;
