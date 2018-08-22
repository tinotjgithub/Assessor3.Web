"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var action = require('../base/action');
var dataRetrievalAction = require('../base/dataretrievalaction');
var actionType = require('../base/actiontypes');
var SaveAcetatesDataAction = (function (_super) {
    __extends(SaveAcetatesDataAction, _super);
    /**
     * Constructor of SaveAcetatesDataAction
     * @param success
     * @param acetatesData
     */
    function SaveAcetatesDataAction(success, acetatesList) {
        _super.call(this, action.Source.View, actionType.SAVE_ACETATES_DATA_ACTION, success);
        this.auditLog.logContent = this.auditLog.logContent.replace(/{ success}/g, success.toString());
        this.acetatesList = acetatesList;
    }
    Object.defineProperty(SaveAcetatesDataAction.prototype, "acetatesData", {
        /**
         * Retrieves acetates data
         */
        get: function () {
            return this.acetatesList;
        },
        enumerable: true,
        configurable: true
    });
    return SaveAcetatesDataAction;
}(dataRetrievalAction));
module.exports = SaveAcetatesDataAction;
//# sourceMappingURL=saveacetatesdataaction.js.map