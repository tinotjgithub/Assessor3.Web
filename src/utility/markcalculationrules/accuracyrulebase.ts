import enums = require('../../components/utility/enums');
import constants = require('../../components/utility/constants');
import Immutable = require('immutable');
import markingStore = require('../../stores/marking/markingstore');
import examinerMarksAndAnnotation = require('../../stores/response/typings/examinermarksandannotation');

/**
 * Base class of accuracy rules
 */
class AccuracyRuleBase {

    protected responseMode: enums.MarkingMode;
    protected examinerMarksAndAnnotation: examinerMarksAndAnnotation;

    /**
     * Constructor
     * @param responseMode
     * @param markGroupId
     */
    constructor(responseMode: enums.MarkingMode, markGroupId: number) {
        this.responseMode = responseMode;
        this.examinerMarksAndAnnotation = markingStore.instance.currentExaminerMarksAgainstResponse(markGroupId);
    }

    /**
     * returns the NR discrepancy
     * @param accuracyIndicator
     */
    protected DetectNRDiscrepancy(accuracyIndicator: enums.AccuracyIndicatorType): boolean {

        return (accuracyIndicator === enums.AccuracyIndicatorType.AccurateNR
            || accuracyIndicator === enums.AccuracyIndicatorType.OutsideToleranceNR
            || accuracyIndicator === enums.AccuracyIndicatorType.WithinToleranceNR);
    }

    /**
     * get the mark number from the mark string
     * @param mark
     */
    protected getActualMark(mark: string): number {
        if (!mark || mark === constants.NOT_MARKED || mark === constants.NOT_ATTEMPTED) {
            return 0;
        } else {
            return parseFloat(mark);
        }
    }

    /**
     * function to get the definitive mark form previous mark
     * @param previousMarks
     */
    protected getDefinitiveMark(previousMarks: Array<PreviousMark>): PreviousMark {
        let definitiveMark: PreviousMark = null;
        previousMarks.forEach((prevMark: PreviousMark) => {
            if (prevMark.isDefinitive === true) {
                definitiveMark = prevMark;
            }
        });

        return definitiveMark;
    }

    /**
     * function to get the original marker mark form previous mark
     * @param previousMarks
     */
    protected getOriginalMark(previousMarks: Array<PreviousMark>): PreviousMark {
        let originalMark: PreviousMark = null;
        previousMarks.forEach((prevMark: PreviousMark) => {
            if (prevMark.isOriginalMark === true) {
                originalMark = prevMark;
            }
        });

        return originalMark;
    }
}
export = AccuracyRuleBase;
