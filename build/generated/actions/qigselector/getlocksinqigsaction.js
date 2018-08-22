"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var action = require('../base/action');
var dataRetrievalAction = require('../base/dataretrievalaction');
var actionType = require('../base/actiontypes');
var GetLocksInQigsAction = (function (_super) {
    __extends(GetLocksInQigsAction, _super);
    /**
     * Constructor for ShowHeaderIconsAction
     * @param showIcons
     */
    function GetLocksInQigsAction(success, locksInQigDetailList, isFromLogout) {
        _super.call(this, action.Source.View, actionType.GET_LOCKS_IN_QIGS, success);
        this.auditLog.logContent = this.auditLog.logContent.replace(/{ success}/g, success.toString());
        this._locksInQigDetailsList = locksInQigDetailList;
        this._isFromLogout = isFromLogout;
    }
    Object.defineProperty(GetLocksInQigsAction.prototype, "locksInQigDetailsList", {
        /**
         * Retrieves no of locks againts QIGs
         */
        get: function () {
            return this._locksInQigDetailsList;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(GetLocksInQigsAction.prototype, "isFromLogout", {
        /**
         * Checking whether the call is from logout or not
         */
        get: function () {
            return this._isFromLogout;
        },
        enumerable: true,
        configurable: true
    });
    return GetLocksInQigsAction;
}(dataRetrievalAction));
module.exports = GetLocksInQigsAction;
//# sourceMappingURL=getlocksinqigsaction.js.map