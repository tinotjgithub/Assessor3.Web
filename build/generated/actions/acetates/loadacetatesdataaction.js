"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var action = require('../base/action');
var dataRetrievalAction = require('../base/dataretrievalaction');
var actionType = require('../base/actiontypes');
var LoadAcetatesDataAction = (function (_super) {
    __extends(LoadAcetatesDataAction, _super);
    /**
     * Constructor of LoadAcetatesDataAction
     * @param success
     * @param acetatesData
     */
    function LoadAcetatesDataAction(success, acetatesList) {
        _super.call(this, action.Source.View, actionType.LOAD_ACETATES_DATA_ACTION, success);
        this.auditLog.logContent = this.auditLog.logContent.replace(/{ success}/g, success.toString());
        this.acetatesList = acetatesList;
    }
    Object.defineProperty(LoadAcetatesDataAction.prototype, "acetatesData", {
        /**
         * Retrieves acetates data
         */
        get: function () {
            return this.acetatesList;
        },
        enumerable: true,
        configurable: true
    });
    return LoadAcetatesDataAction;
}(dataRetrievalAction));
module.exports = LoadAcetatesDataAction;
//# sourceMappingURL=loadacetatesdataaction.js.map