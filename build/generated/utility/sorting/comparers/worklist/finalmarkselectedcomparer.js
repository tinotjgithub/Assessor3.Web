"use strict";
var localeStore = require('../../../../stores/locale/localestore');
/**
 * This is final mark selected comparer class and method
 */
var FinalMarkSelectedComparer = (function () {
    function FinalMarkSelectedComparer() {
    }
    /**
     * Get the supervisor remark decision type
     * @param response
     */
    FinalMarkSelectedComparer.prototype.getSupervisorRemarkDecisionType = function (response) {
        if (response != null) {
            var supervisorRemarkFinalMarkSetID = response.supervisorRemarkFinalMarkSetID;
            var supervisorRemarkMarkChangeReasonID = response.supervisorRemarkMarkChangeReasonID;
            if (supervisorRemarkFinalMarkSetID === 2) {
                return localeStore.instance.TranslateText('marking.worklist.supervisor-remark-decision.original-marks-chosen');
            }
            else if (supervisorRemarkFinalMarkSetID === 1) {
                return localeStore.instance.TranslateText('marking.worklist.supervisor-remark-decision.remark-chosen');
            }
            else {
                return '';
            }
        }
    };
    /**
     * Comparer to sort the work list in ascending order of final mark selected
     * @param responseBase
     * @param responseBase
     */
    FinalMarkSelectedComparer.prototype.compare = function (a, b) {
        var decisionA = this.getSupervisorRemarkDecisionType(a);
        var decisionB = this.getSupervisorRemarkDecisionType(b);
        if (decisionA > decisionB) {
            return 1;
        }
        if (decisionA < decisionB) {
            return -1;
        }
        return 0;
    };
    return FinalMarkSelectedComparer;
}());
module.exports = FinalMarkSelectedComparer;
//# sourceMappingURL=finalmarkselectedcomparer.js.map