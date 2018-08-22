"use strict";
var ccHelper = require('./configurablecharacteristicshelper');
var ccNames = require('./configurablecharacteristicsnames');
/**
 *  Class for specifying CC values
 */
var ConfigurableCharacteristicsValues = (function () {
    function ConfigurableCharacteristicsValues() {
    }
    Object.defineProperty(ConfigurableCharacteristicsValues, "examinerCentreExclusivity", {
        /**
         * Return true if ExaminerCenterExclusivity CC is on else return false.
         */
        get: function () {
            return ccHelper.getCharacteristicValue(ccNames.ExaminerCentreExclusivity).toLowerCase() === 'true';
        },
        enumerable: true,
        configurable: true
    });
    /**
     * get the value of senior examiner pool cc.
     */
    ConfigurableCharacteristicsValues.seniorExaminerPool = function (markSchemeGroupId) {
        return ccHelper.getCharacteristicValue(ccNames.SeniorExaminerPool, markSchemeGroupId).toLowerCase() === 'true';
    };
    /**
     * Get the value of the request marking check
     * @type {boolean}
     */
    ConfigurableCharacteristicsValues.requestMarkingCheck = function (markSchemeGroupdId) {
        return ccHelper.getCharacteristicValue(ccNames.RequestMarkingCheck, markSchemeGroupdId).toLowerCase() === 'true';
    };
    Object.defineProperty(ConfigurableCharacteristicsValues, "isECourseworkComponent", {
        /* return true if the component is e-course work */
        get: function () {
            return ccHelper.getCharacteristicValue(ccNames.ECoursework).toLowerCase() === 'true';
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ConfigurableCharacteristicsValues, "supervisorReviewComments", {
        /**
         * Returns supervisor review comments cc value
         * @readonly
         * @static
         * @type {boolean}
         * @memberof ConfigurableCharacteristicsValues
         */
        get: function () {
            return ccHelper.getCharacteristicValue(ccNames.SupervisorReviewComments).toLowerCase() === 'true';
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ConfigurableCharacteristicsValues, "sepQuestionPaperManagement", {
        /**
         * get the value of SEPQuestionPaperManagement cc.
         */
        get: function () {
            return ccHelper.getCharacteristicValue(ccNames.SEPQuestionPaperManagement).toLowerCase() === 'true';
        },
        enumerable: true,
        configurable: true
    });
    return ConfigurableCharacteristicsValues;
}());
module.exports = ConfigurableCharacteristicsValues;
//# sourceMappingURL=configurablecharacteristicsvalues.js.map