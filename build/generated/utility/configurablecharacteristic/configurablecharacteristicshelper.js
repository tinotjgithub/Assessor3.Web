"use strict";
var configurableCharacteristicsStore = require('../../stores/configurablecharacteristics/configurablecharacteristicsstore');
var configurableCharacteristicsNames = require('./configurablecharacteristicsnames');
var enums = require('../../components/utility/enums');
/**
 * CC Utility class
 */
var ConfigurableCharacteristicsHelper = (function () {
    function ConfigurableCharacteristicsHelper() {
    }
    /**
     * Get's the configurable characteristic value
     * @param ccName
     */
    ConfigurableCharacteristicsHelper.getCharacteristicValue = function (ccName, markschemeGroupId) {
        if (markschemeGroupId === void 0) { markschemeGroupId = 0; }
        var ccCollection;
        var ccValueFound = '';
        // Get value from Exam Body
        ccCollection = configurableCharacteristicsStore.instance.getExamBodyConfigurableCharacteristicsData;
        // In Team management mode we dont need to consider the value of these CC's
        // configurableCharacteristicsStore is used to avoid cyclic dependency
        if (configurableCharacteristicsStore.instance.currentOperationMode === enums.MarkerOperationMode.TeamManagement
            && (ccName === configurableCharacteristicsNames.ShowStandardisationDefinitiveMarks ||
                ccName === configurableCharacteristicsNames.AutomaticQualityFeedback)) {
            ccValueFound = 'true';
            return ccValueFound;
        }
        if (ccCollection !== undefined && ccCollection != null && ccCollection.configurableCharacteristics != null) {
            ccCollection.configurableCharacteristics.map(function (cc) {
                if (cc.ccName.toLowerCase() === ccName.toLowerCase()
                    && (markschemeGroupId === 0 ? true : cc.markSchemeGroupID === markschemeGroupId)) {
                    ccValueFound = cc.ccValue;
                }
            });
        }
        // If value not available from Exam Body get the list from Mark Scheme Group
        ccCollection = configurableCharacteristicsStore.instance.getMarkSchemeGroupConfigurableCharacteristicsData;
        if (ccCollection !== undefined && ccCollection != null && ccCollection.configurableCharacteristics != null) {
            ccCollection.configurableCharacteristics.map(function (cc) {
                if (cc.ccName.toLowerCase() === ccName.toLowerCase()
                    && (markschemeGroupId === 0 ? true : cc.markSchemeGroupID === markschemeGroupId)) {
                    ccValueFound = cc.ccValue;
                }
            });
        }
        return ccValueFound;
    };
    /**
     * Get's the configurable characteristic value specific to the exam session.
     * @param ccName
     * @param examSessionId
     */
    ConfigurableCharacteristicsHelper.getExamSessionCCValue = function (ccName, examSessionId) {
        var ccCollection;
        var ccValueFound = '';
        ccCollection = configurableCharacteristicsStore.instance.getMarkSchemeGroupConfigurableCharacteristicsData;
        if (ccCollection && ccCollection.configurableCharacteristics) {
            ccCollection.configurableCharacteristics.map(function (cc) {
                if (cc.ccName.toLowerCase() === ccName.toLowerCase() && cc.examSessionID === examSessionId) {
                    ccValueFound = cc.ccValue;
                }
            });
        }
        return ccValueFound;
    };
    /**
     * Checking whether the response marking is enabled my mark by annotation.
     * @param {boolean} isAtypical
     * @returns
     */
    ConfigurableCharacteristicsHelper.isMarkByAnnotation = function (atypicalStatus, markschemeGroupId) {
        if (markschemeGroupId === void 0) { markschemeGroupId = 0; }
        var markByAnnotationCCOn = this.getCharacteristicValue(configurableCharacteristicsNames.MarkbyAnnotation, markschemeGroupId) === 'true';
        if (atypicalStatus === enums.AtypicalStatus.AtypicalUnscannable) {
            return false;
        }
        return markByAnnotationCCOn;
    };
    return ConfigurableCharacteristicsHelper;
}());
module.exports = ConfigurableCharacteristicsHelper;
//# sourceMappingURL=configurablecharacteristicshelper.js.map