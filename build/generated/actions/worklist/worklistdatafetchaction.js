"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var action = require('../base/action');
var dataRetrievalAction = require('../base/dataretrievalaction');
var actionType = require('../base/actiontypes');
var WorklistDataFetchAction = (function (_super) {
    __extends(WorklistDataFetchAction, _super);
    /**
     * Constructor WorklistDataFetchAction
     * @param success
     * @param json
     */
    function WorklistDataFetchAction(success, json) {
        _super.call(this, action.Source.View, actionType.WORKLIST_DATA_GET, success);
        this.auditLog.logContent = this.auditLog.logContent.replace(/{success}/g, success.toString());
        this.progressData = json;
    }
    /**
     * Returns the examiner progress data
     */
    WorklistDataFetchAction.prototype.getExaminerProgressData = function () {
        return this.progressData;
    };
    return WorklistDataFetchAction;
}(dataRetrievalAction));
module.exports = WorklistDataFetchAction;
//# sourceMappingURL=worklistdatafetchaction.js.map