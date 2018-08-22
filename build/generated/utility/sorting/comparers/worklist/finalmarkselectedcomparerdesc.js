"use strict";
var localeStore = require('../../../../stores/locale/localestore');
/**
 * This is final mark selected comparer class and method
 */
var FinalMarkSelectedComparerDesc = (function () {
    function FinalMarkSelectedComparerDesc() {
    }
    /**
     * Get the supervisor remark decision type
     * @param response
     */
    FinalMarkSelectedComparerDesc.prototype.getSupervisorRemarkDecisionType = function (response) {
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
     * Comparer to sort the work list in descending order of final mark selected
     * @param responseBase
     * @param responseBase
     */
    FinalMarkSelectedComparerDesc.prototype.compare = function (a, b) {
        var decisionA = this.getSupervisorRemarkDecisionType(a);
        var decisionB = this.getSupervisorRemarkDecisionType(b);
        if (decisionA > decisionB) {
            return -1;
        }
        if (decisionA < decisionB) {
            return 1;
        }
        return 0;
    };
    return FinalMarkSelectedComparerDesc;
}());
module.exports = FinalMarkSelectedComparerDesc;
//# sourceMappingURL=finalmarkselectedcomparerdesc.js.map