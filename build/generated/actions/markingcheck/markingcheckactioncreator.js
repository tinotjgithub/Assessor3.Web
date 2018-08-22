"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var base = require('../base/actioncreatorbase');
var promise = require('es6-promise');
var markingCheckDataService = require('../../dataservices/markingcheck/markingcheckdataservice');
var dispatcher = require('../../app/dispatcher');
var markingCheckInfoFetchAction = require('./markingcheckinformationfetchaction');
var markingCheckRecipientsFetchAction = require('./markingcheckrecipientsfetchaction');
var getMarkCheckExaminersAction = require('./getmarkcheckexaminersaction');
var toggleRequestMarkingCheckButtonAction = require('./togglerequestmarkingcheckbuttonaction');
var toggleMarkingCheckModeAction = require('./togglemarkingcheckmodeaction');
/**
 * Marking Check Action Creator for all marking check actions
 */
var MarkingCheckActionCreator = (function (_super) {
    __extends(MarkingCheckActionCreator, _super);
    function MarkingCheckActionCreator() {
        _super.apply(this, arguments);
    }
    /**
     * Gets marking check data for the marker
     * @param doRequireMarkingCheckInfo
     * @param examiner_role_id
     */
    MarkingCheckActionCreator.prototype.getMarkingCheckInfo = function (doRequireMarkingCheckInfo, examinerRoleId) {
        var that = this;
        if (doRequireMarkingCheckInfo) {
            markingCheckDataService.getMarkingCheckDetails(examinerRoleId, function (success, resultData) {
                if (that.validateCall(resultData)) {
                    dispatcher.dispatch(new markingCheckInfoFetchAction(resultData, success));
                }
            });
        }
    };
    /**
     * Gets the list of eligible markers and details to whom marking check can be requested
     */
    MarkingCheckActionCreator.prototype.getMarkingCheckRecipients = function (examinerRoleId) {
        var that = this;
        markingCheckDataService.getMarkingCheckRecipients(examinerRoleId, function (result, success) {
            if (that.validateCall(result, false, true)) {
                if (!success) {
                    result = undefined;
                }
            }
            else {
                result = undefined;
            }
            dispatcher.dispatch(new markingCheckRecipientsFetchAction(result, success));
        });
    };
    /**
     * Gets mark check examiners data
     * @param msgId
     */
    MarkingCheckActionCreator.prototype.getMarkCheckExaminers = function (msgId) {
        var that = this;
        markingCheckDataService.getMarkCheckExaminers(msgId, function (success, markCheckExaminersData) {
            if (that.validateCall(markCheckExaminersData)) {
                dispatcher.dispatch(new getMarkCheckExaminersAction(success, markCheckExaminersData));
            }
        });
    };
    /**
     * toggling request marking check button
     */
    MarkingCheckActionCreator.prototype.toggleRequestMarkingCheckButton = function (doDisable) {
        if (doDisable === void 0) { doDisable = false; }
        new promise.Promise(function (resolve, reject) {
            resolve();
        }).then(function () {
            dispatcher.dispatch(new toggleRequestMarkingCheckButtonAction(doDisable));
        }).catch();
    };
    /**
     * toggling marking check mode
     */
    MarkingCheckActionCreator.prototype.toggleMarkingCheckMode = function (markingCheckModeValue) {
        new promise.Promise(function (resolve, reject) {
            resolve();
        }).then(function () {
            dispatcher.dispatch(new toggleMarkingCheckModeAction(markingCheckModeValue));
        }).catch();
    };
    return MarkingCheckActionCreator;
}(base));
var markingCheckActionCreator = new MarkingCheckActionCreator();
module.exports = markingCheckActionCreator;
//# sourceMappingURL=markingcheckactioncreator.js.map