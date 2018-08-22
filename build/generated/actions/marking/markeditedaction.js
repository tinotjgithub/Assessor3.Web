"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var action = require('../base/action');
var actionType = require('../base/actiontypes');
/**
 * The Action class for notifying mark updated event.
 */
var MarkEditedAction = (function (_super) {
    __extends(MarkEditedAction, _super);
    /**
     * Constructor
     */
    function MarkEditedAction(isEdited) {
        _super.call(this, action.Source.View, actionType.MARK_EDITED);
        this._isEdited = isEdited;
        this.auditLog.logContent = this.auditLog.logContent;
    }
    Object.defineProperty(MarkEditedAction.prototype, "isEdited", {
        /**
         * returns true if mark updated
         * @returns
         */
        get: function () {
            return this._isEdited;
        },
        enumerable: true,
        configurable: true
    });
    return MarkEditedAction;
}(action));
module.exports = MarkEditedAction;
//# sourceMappingURL=markeditedaction.js.map