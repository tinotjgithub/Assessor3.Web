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
 * The Action class for Retrieving examiner marks.
 */
var RetrieveMarksAction = (function (_super) {
    __extends(RetrieveMarksAction, _super);
    /**
     * Initializing a new instance of Retrieve marks action.
     * @param {boolean} success
     */
    function RetrieveMarksAction(data, success, markGroupId) {
        _super.call(this, action.Source.View, actionType.RETRIEVE_MARKS, success);
        this._examinerMarkDetails = data;
        this._isSuccess = success;
        this._markGroupId = markGroupId;
        this.auditLog.logContent = this.auditLog.logContent.replace(/{success}/g, success.toString());
    }
    Object.defineProperty(RetrieveMarksAction.prototype, "examinerMarkDetails", {
        get: function () {
            return this._examinerMarkDetails;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(RetrieveMarksAction.prototype, "isSuccess", {
        /**
         * returns if the action is success or not
         */
        get: function () {
            return this._isSuccess;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(RetrieveMarksAction.prototype, "markGroupId", {
        /**
         * selected mark group id
         */
        get: function () {
            return this._markGroupId;
        },
        enumerable: true,
        configurable: true
    });
    return RetrieveMarksAction;
}(dataRetrievalAction));
module.exports = RetrieveMarksAction;
//# sourceMappingURL=retrievemarksaction.js.map