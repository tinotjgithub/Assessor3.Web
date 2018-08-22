"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var action = require('../base/action');
var dataRetrievalAction = require('../base/dataretrievalaction');
var actionType = require('../base/actiontypes');
/**
 * Action class for retrieving MyTeam data
 */
var MyTeamDataFetchAction = (function (_super) {
    __extends(MyTeamDataFetchAction, _super);
    /**
     * constructor
     * @param success
     * @param myTeamDataList
     * @param isFromHistory
     * @param failureCode
     */
    function MyTeamDataFetchAction(success, myTeamDataList, isFromHistory) {
        _super.call(this, action.Source.View, actionType.MY_TEAM_DATA_FETCH, success);
        this._myTeamDataList = myTeamDataList;
        this._isFromHistory = isFromHistory;
        this.auditLog.logContent = this.auditLog.logContent.replace(/{ success}/g, success.toString());
    }
    Object.defineProperty(MyTeamDataFetchAction.prototype, "myTeamData", {
        /**
         * Returns my team data
         */
        get: function () {
            return this._myTeamDataList;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MyTeamDataFetchAction.prototype, "isFromHistory", {
        /**
         * Returns true if it is from history
         */
        get: function () {
            return this._isFromHistory;
        },
        enumerable: true,
        configurable: true
    });
    return MyTeamDataFetchAction;
}(dataRetrievalAction));
module.exports = MyTeamDataFetchAction;
//# sourceMappingURL=myteamdatafetchaction.js.map