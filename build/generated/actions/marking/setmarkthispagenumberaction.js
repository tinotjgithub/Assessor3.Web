"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var action = require('../base/action');
var actionType = require('../base/actiontypes');
/**
 * action class for storing Mark This Page number
 */
var SetMarkThisPageNumberAction = (function (_super) {
    __extends(SetMarkThisPageNumberAction, _super);
    /**
     * Initializing a new instance of Set Mark This Page Number action.
     * @param markThisPageNumber
     */
    function SetMarkThisPageNumberAction(markThisPageNumber) {
        _super.call(this, action.Source.View, actionType.MARK_THIS_PAGE_NUMBER);
        this.auditLog.logContent = this.auditLog.logContent.replace('{0}', markThisPageNumber.toString());
        this._markThisPageNumber = markThisPageNumber;
    }
    Object.defineProperty(SetMarkThisPageNumberAction.prototype, "markThisPageNumber", {
        /**
         * Get the number of Mark This Page
         */
        get: function () {
            return this._markThisPageNumber;
        },
        enumerable: true,
        configurable: true
    });
    return SetMarkThisPageNumberAction;
}(action));
module.exports = SetMarkThisPageNumberAction;
//# sourceMappingURL=setmarkthispagenumberaction.js.map