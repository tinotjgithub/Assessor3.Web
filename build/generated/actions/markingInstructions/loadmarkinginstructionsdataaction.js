"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var dataRetrievalAction = require('../base/dataretrievalaction');
var action = require('../base/action');
var actionType = require('../base/actiontypes');
var LoadMarkingInstructionsDataAction = (function (_super) {
    __extends(LoadMarkingInstructionsDataAction, _super);
    /**
     * Constructor of LoadMarkingInstructionsDataAction
     * @param success
     * @param markinginstructionsData
     */
    function LoadMarkingInstructionsDataAction(success, markingInstructionsList) {
        _super.call(this, action.Source.View, actionType.LOAD_MARKINGINSTRUCTIONS_DATA_ACTION, success);
        this.auditLog.logContent = this.auditLog.logContent.replace(/{ success}/g, success.toString());
        this.markingInstructionsList = markingInstructionsList;
    }
    Object.defineProperty(LoadMarkingInstructionsDataAction.prototype, "markingInstructionsData", {
        /**
         * Retrieves markinginstructions data
         */
        get: function () {
            return this.markingInstructionsList;
        },
        enumerable: true,
        configurable: true
    });
    return LoadMarkingInstructionsDataAction;
}(dataRetrievalAction));
module.exports = LoadMarkingInstructionsDataAction;
//# sourceMappingURL=loadmarkinginstructionsdataaction.js.map