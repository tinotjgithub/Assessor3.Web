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
 * Action for getting mark check requested examiners
 */
var GetMarkCheckExaminersAction = (function (_super) {
    __extends(GetMarkCheckExaminersAction, _super);
    /**
     * Constructor for Getting mark check requested examiners
     */
    function GetMarkCheckExaminersAction(success, markCheckExaminersData) {
        _super.call(this, action.Source.View, actionType.GET_MARK_CHECK_EXAMINERS, success);
        this.auditLog.logContent = this.auditLog.logContent.replace(/{ success}/g, success.toString());
        this._markCheckExaminersData = markCheckExaminersData;
    }
    Object.defineProperty(GetMarkCheckExaminersAction.prototype, "markCheckExaminersData", {
        /**
         * Gets mark check requested examiners
         */
        get: function () {
            return this._markCheckExaminersData;
        },
        enumerable: true,
        configurable: true
    });
    return GetMarkCheckExaminersAction;
}(dataRetrievalAction));
module.exports = GetMarkCheckExaminersAction;
//# sourceMappingURL=getmarkcheckexaminersaction.js.map