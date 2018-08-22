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
 * Action class for retrieving Multi Qig Lock Data.
 */
var MultiQigLockDataFetchAction = (function (_super) {
    __extends(MultiQigLockDataFetchAction, _super);
    function MultiQigLockDataFetchAction(success, helpExaminerDataList, selectedExaminerId, selectedQigId, selectedExaminerRoleId) {
        _super.call(this, action.Source.View, actionType.MULTI_QIG_LOCK_DATA_FETCH_ACTION, success);
        this._examinersDataForhelpExaminer = helpExaminerDataList;
        this._selectedExaminerId = selectedExaminerId;
        this._selectedQigId = selectedQigId;
        this._selectedExaminerRoleId = selectedExaminerRoleId;
        this.auditLog.logContent = this.auditLog.logContent.replace(/{ success}/g, success.toString());
    }
    Object.defineProperty(MultiQigLockDataFetchAction.prototype, "MultiQigLockData", {
        /**
         * Returns Multi qig lock data
         */
        get: function () {
            return Immutable.List(this._examinersDataForhelpExaminer);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MultiQigLockDataFetchAction.prototype, "selectedExaminerId", {
        /**
         * Return selected examiner id
         */
        get: function () {
            return this._selectedExaminerId;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MultiQigLockDataFetchAction.prototype, "selectedQigId", {
        /**
         * Return selected qig id
         */
        get: function () {
            return this._selectedQigId;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MultiQigLockDataFetchAction.prototype, "selectedExaminerRoleId", {
        /**
         * Return selected examiner role id
         */
        get: function () {
            return this._selectedExaminerRoleId;
        },
        enumerable: true,
        configurable: true
    });
    return MultiQigLockDataFetchAction;
}(dataRetrievalAction));
module.exports = MultiQigLockDataFetchAction;
//# sourceMappingURL=multiQigLockDataFetchAction.js.map