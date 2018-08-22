"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var action = require('../base/action');
var actionType = require('../base/actiontypes');
var AtypicalSearchMoveToWorklistAction = (function (_super) {
    __extends(AtypicalSearchMoveToWorklistAction, _super);
    /**
     * Initializing a new instance of atypical response allocate action.
     * @param {boolean} success
     */
    function AtypicalSearchMoveToWorklistAction(data, success) {
        _super.call(this, action.Source.View, actionType.ATYPICAL_SEARCH_MOVETOWORKLIST_ACTION);
        this.auditLog.logContent = this.auditLog.logContent.replace(/{success}/g, success.toString());
        this._allocatedResponseData = data;
    }
    Object.defineProperty(AtypicalSearchMoveToWorklistAction.prototype, "allocatedResponseData", {
        get: function () {
            return this._allocatedResponseData;
        },
        enumerable: true,
        configurable: true
    });
    return AtypicalSearchMoveToWorklistAction;
}(action));
module.exports = AtypicalSearchMoveToWorklistAction;
//# sourceMappingURL=atypicalsearchmovetoworklistaction.js.map