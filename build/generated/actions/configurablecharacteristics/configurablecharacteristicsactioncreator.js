"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var dispatcher = require('../../app/dispatcher');
var ccAction = require('./configurablecharacteristicsaction');
var ccDataServices = require('../../dataservices/configurablecharacteristics/configurablecharacteristicsdataservice');
var enums = require('../../components/utility/enums');
var Promise = require('es6-promise');
var base = require('../base/actioncreatorbase');
/**
 * Configurable Charcteristics Action Creator helper class
 */
var ConfigurableCharacteristicsActionCreator = (function (_super) {
    __extends(ConfigurableCharacteristicsActionCreator, _super);
    function ConfigurableCharacteristicsActionCreator() {
        _super.apply(this, arguments);
    }
    /**
     * Method which retrieves the ExamBody level CCs
     */
    ConfigurableCharacteristicsActionCreator.prototype.getExamBodyCCs = function (useCache) {
        if (useCache === void 0) { useCache = false; }
        var that = this;
        ccDataServices.getExamBodyCCs(function (success, ccData) {
            // This will validate the call to find any network failure
            // and is mandatory to add this.
            if (that.validateCall(ccData)) {
                dispatcher.dispatch(new ccAction(success, enums.ConfigurableCharacteristicLevel.ExamBody, 0, ccData));
            }
        }, useCache);
    };
    /**
     * Method which retrieves the MarkSchemeGroup level CCs for the current QIG
     * @param {number} markSchemeGroupId
     * @param {number} questionPaperId
     * @param {boolean = true} initiateDispatch
     */
    ConfigurableCharacteristicsActionCreator.prototype.getMarkSchemeGroupCCs = function (markSchemeGroupId, questionPaperId, initiateDispatch, isFromHistory) {
        if (initiateDispatch === void 0) { initiateDispatch = true; }
        if (isFromHistory === void 0) { isFromHistory = false; }
        var that = this;
        return new Promise.Promise(function (resolve, reject) {
            ccDataServices.getMarkSchemeGroupCCs(markSchemeGroupId, questionPaperId, function (success, ccData) {
                // This will validate the call to find any network failure
                // and is mandatory to add this.
                if (that.validateCall(ccData)) {
                    // Dispatch only if the indicator is on and the indicator will set only if its an individual call
                    // and if promise is using we have to wait for other service call as well.
                    if (initiateDispatch) {
                        dispatcher.dispatch(new ccAction(success, enums.ConfigurableCharacteristicLevel.MarkSchemeGroup, markSchemeGroupId, ccData));
                    }
                    resolve(ccData);
                }
                else {
                    // This will stop promise.all from exec
                    reject(null);
                }
            });
        });
    };
    return ConfigurableCharacteristicsActionCreator;
}(base));
var configurableCharacteristicsActionCreator = new ConfigurableCharacteristicsActionCreator();
module.exports = configurableCharacteristicsActionCreator;
//# sourceMappingURL=configurablecharacteristicsactioncreator.js.map