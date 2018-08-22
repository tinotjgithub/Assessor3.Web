"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var action = require('../base/action');
var actionType = require('../base/actiontypes');
/**
 * The Action class for Atypical search mark now click
 */
var AtypicalSearchMarkNowAction = (function (_super) {
    __extends(AtypicalSearchMarkNowAction, _super);
    /**
     * Initializing a new instance of mark now action.
     * @param {boolean} success
     */
    function AtypicalSearchMarkNowAction(data, success) {
        _super.call(this, action.Source.View, actionType.ATYPICAL_SEARCH_MARK_NOW_ACTION);
        this.auditLog.logContent = this.auditLog.logContent.replace(/{success}/g, success.toString());
        this._allocatedResponseData = data;
    }
    Object.defineProperty(AtypicalSearchMarkNowAction.prototype, "allocatedResponseData", {
        get: function () {
            return this._allocatedResponseData;
        },
        enumerable: true,
        configurable: true
    });
    return AtypicalSearchMarkNowAction;
}(action));
module.exports = AtypicalSearchMarkNowAction;
//# sourceMappingURL=atypicalsearchmarknowaction.js.map