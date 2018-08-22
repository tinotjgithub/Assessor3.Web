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
 * The Action class for notifying mark updated event.
 */
var UpdateMarkAction = (function (_super) {
    __extends(UpdateMarkAction, _super);
    /**
     * Initializing a new instance of mark updated action.
     * @param {string} mark
     * @param {boolean} success
     */
    function UpdateMarkAction(allocatedMark, success) {
        _super.call(this, action.Source.View, actionType.MARK_UPDATED, success);
        this.allocatedMark = allocatedMark;
        this.auditLog.logContent = this.auditLog.logContent.replace(/{success}/g, success.toString());
        this.auditLog.logContent = this.auditLog.logContent.replace(/{mark}/g, this.allocatedMark.displayMark.toString());
    }
    Object.defineProperty(UpdateMarkAction.prototype, "currentMark", {
        /**
         * getting current mark of the selected item
         * @param {number} mark
         */
        get: function () {
            return this.allocatedMark;
        },
        enumerable: true,
        configurable: true
    });
    return UpdateMarkAction;
}(dataRetrievalAction));
module.exports = UpdateMarkAction;
//# sourceMappingURL=updatemarkaction.js.map