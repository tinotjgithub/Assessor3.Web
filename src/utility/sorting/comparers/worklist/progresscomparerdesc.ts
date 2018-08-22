import comparerInterface = require('../../sortbase/comparerinterface');
import enums = require('../../../../components/utility/enums');
import configurablecharacteristicshelper = require('../../../configurablecharacteristic/configurablecharacteristicshelper');
import configurablecharacteristicsnames = require('../../../configurablecharacteristic/configurablecharacteristicsnames');

/**
 * This is a Marking progress comparer class and method
 */
class ProgressComparerDesc implements comparerInterface {
    /** Comparer to sort the work list in descending order based on marking progress */
    public compare(a: any, b: any) {

        if (this.getMarkingProgressDetail(a) > this.getMarkingProgressDetail(b)) {
            return -1;
        }

        if (this.getMarkingProgressDetail(a) < this.getMarkingProgressDetail(b)) {
            return 1;
        }
        if (+a.displayId > +b.displayId) {
            return 1;
        }
        if (+a.displayId < +b.displayId) {
            return -1;
        }
        return 0;
    }

    /**
     * Returns 200 as marking progress, if submit button is enabled else corresponding marking progress will be returned.
     * @param response
     */
    private getMarkingProgressDetail(response: any) {

        /** taking the cc from cc helper */
        let isAllPagesAnnotatedCC = configurablecharacteristicshelper.getCharacteristicValue(
            configurablecharacteristicsnames.ForceAnnotationOnEachPage, response.markSchemeGroupId).toLowerCase() === 'true' ? true : false;
        let isAllSLAOAnnotatedCC = configurablecharacteristicshelper.getCharacteristicValue(
            configurablecharacteristicsnames.SLAOForcedAnnotations, response.markSchemeGroupId).toLowerCase() === 'true' ? true : false;

        if (response.markingProgress === 100) {
            if (!isAllPagesAnnotatedCC && isAllSLAOAnnotatedCC && response.hasAllPagesAnnotated === false ||
                isAllPagesAnnotatedCC && response.hasAllPagesAnnotated === false ||
                response.hasBlockingExceptions ||
                (response.markChangeReasonVisible && response.accuracyIndicatorTypeID !== enums.AccuracyIndicatorType.Accurate
                    && !response.markChangeReason)) {
                return response.markingProgress;
			} else {
                return 200;
            }
        } else {
            return response.markingProgress;
        }
    }
}

export = ProgressComparerDesc;

