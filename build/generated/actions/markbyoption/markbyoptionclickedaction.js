"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var action = require('../base/action');
var actionType = require('../base/actiontypes');
var MarkByOptionClickedAction = (function (_super) {
    __extends(MarkByOptionClickedAction, _super);
    /**
     * Constructor MarkByOptionClickedAction
     * @param isMarkByOptionOpen
     */
    function MarkByOptionClickedAction(isMarkByOptionOpen) {
        _super.call(this, action.Source.View, actionType.MARK_BY_OPTION_CLICKED_ACTION);
        this.auditLog.logContent = this.auditLog.logContent.replace('{0}', isMarkByOptionOpen.toString());
        this._isMarkByOptionOpen = isMarkByOptionOpen;
    }
    Object.defineProperty(MarkByOptionClickedAction.prototype, "isMarkByOptionOpen", {
        /**
         * Get wether the mark by panel is open or closed.
         * @returns isMarkByOptionOpen
         */
        get: function () {
            return this._isMarkByOptionOpen;
        },
        enumerable: true,
        configurable: true
    });
    return MarkByOptionClickedAction;
}(action));
module.exports = MarkByOptionClickedAction;
//# sourceMappingURL=markbyoptionclickedaction.js.map