"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var action = require('../base/action');
var dataRetrievalAction = require('../base/dataretrievalaction');
var actionType = require('../base/actiontypes');
var Immutable = require('immutable');
/**
 * Action class for retrieving Examiner Data For help Examiner
 */
var HelpExaminersDataFetchAction = (function (_super) {
    __extends(HelpExaminersDataFetchAction, _super);
    /**
     * constructor
     * @param success
     * @param myTeamData
     * @param isFromHistory
     */
    function HelpExaminersDataFetchAction(success, myTeamDataList, isFromHistory) {
        _super.call(this, action.Source.View, actionType.HELP_EXAMINERS_DATA_FETCH_ACTION, success);
        this.examinersDataForhelpExaminer = myTeamDataList;
        this._isFromHistory = isFromHistory;
        this.auditLog.logContent = this.auditLog.logContent.replace(/{ success}/g, success.toString());
    }
    Object.defineProperty(HelpExaminersDataFetchAction.prototype, "helpExaminersData", {
        /**
         * Returns help Examiners Data
         */
        get: function () {
            return Immutable.List(this.examinersDataForhelpExaminer);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(HelpExaminersDataFetchAction.prototype, "isFromHistory", {
        /**
         * Returns true if it is from recent history
         */
        get: function () {
            return this._isFromHistory;
        },
        enumerable: true,
        configurable: true
    });
    return HelpExaminersDataFetchAction;
}(dataRetrievalAction));
module.exports = HelpExaminersDataFetchAction;
//# sourceMappingURL=helpexaminersdatafetchaction.js.map