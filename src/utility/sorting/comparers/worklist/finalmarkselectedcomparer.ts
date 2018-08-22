import comparerInterface = require('../../sortbase/comparerinterface');
import stringFormatHelper = require('../../../stringformat/stringformathelper');
import localeStore = require('../../../../stores/locale/localestore');

/**
 * This is final mark selected comparer class and method
 */
class FinalMarkSelectedComparer implements comparerInterface {
    /**
     * Get the supervisor remark decision type
     * @param response
     */
    private getSupervisorRemarkDecisionType(response: ResponseBase): string {
        if (response != null) {
            let supervisorRemarkFinalMarkSetID: number = response.supervisorRemarkFinalMarkSetID;
            let supervisorRemarkMarkChangeReasonID: number = response.supervisorRemarkMarkChangeReasonID;

            if (supervisorRemarkFinalMarkSetID === 2) {
                return localeStore.instance.TranslateText('marking.worklist.supervisor-remark-decision.original-marks-chosen');
            } else if (supervisorRemarkFinalMarkSetID === 1) {
                return localeStore.instance.TranslateText('marking.worklist.supervisor-remark-decision.remark-chosen');
            } else {
                return '';
            }
        }
    }

    /**
     * Comparer to sort the work list in ascending order of final mark selected
     * @param responseBase
     * @param responseBase
     */
    public compare(a: ResponseBase, b: ResponseBase) {

        let decisionA: string = this.getSupervisorRemarkDecisionType(a);
        let decisionB: string = this.getSupervisorRemarkDecisionType(b);

        if (decisionA > decisionB ) {
            return 1;
        }
        if (decisionA < decisionB ) {
            return -1;
        }
        return 0;
    }
}

export = FinalMarkSelectedComparer;