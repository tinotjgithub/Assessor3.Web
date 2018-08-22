"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var action = require('../base/action');
var actionType = require('../base/actiontypes');
/**
 * Class for setting marking overlay visiblity.
 */
var MarkingOverlayVisiblityAction = (function (_super) {
    __extends(MarkingOverlayVisiblityAction, _super);
    /**
     * Constructor MarkingOverlayVisiblityAction
     * @param isVisible
     */
    function MarkingOverlayVisiblityAction(isVisible) {
        _super.call(this, action.Source.View, actionType.MARKING_OVERLAY_VISIBLITY_ACTION);
        this.auditLog.logContent = this.auditLog.logContent.replace('{0}', isVisible.toString());
        this._isMarkingOverlayVisible = isVisible;
    }
    Object.defineProperty(MarkingOverlayVisiblityAction.prototype, "isMarkingOverlayVisible", {
        /**
         * This method will return the overlay visiblity status.
         */
        get: function () {
            return this._isMarkingOverlayVisible;
        },
        enumerable: true,
        configurable: true
    });
    return MarkingOverlayVisiblityAction;
}(action));
module.exports = MarkingOverlayVisiblityAction;
//# sourceMappingURL=markingoverlayvisiblityaction.js.map