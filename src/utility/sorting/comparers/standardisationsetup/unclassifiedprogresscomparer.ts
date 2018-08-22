import comparerInterface = require('../../sortbase/comparerinterface');
import configurablecharacteristicshelper = require('../../../configurablecharacteristic/configurablecharacteristicshelper');
import configurablecharacteristicsnames = require('../../../configurablecharacteristic/configurablecharacteristicsnames');
import enums = require('../../../../components/utility/enums');

/**
 * This is a Marking progress comparer class and method
 */
class UnclassifiedProgressComparer implements comparerInterface {
    /** Comparer to sort the work list in ascending order based on marking progress */

    public compare(a: StandardisationScriptDetails, b: StandardisationScriptDetails) {

        if (this.getMarkingProgressDetail(a) > this.getMarkingProgressDetail(b)) {
            return 1;
        }

        if (this.getMarkingProgressDetail(a) < this.getMarkingProgressDetail(b)) {
            return -1;
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
    private getMarkingProgressDetail(response: StandardisationScriptDetails) {

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
			} else if (response.hasDefinitiveMark === false) {
				return -1;
			} else {
                return 200;
            }
        } else {
            return response.markingProgress;
        }
    }
}

export = UnclassifiedProgressComparer;