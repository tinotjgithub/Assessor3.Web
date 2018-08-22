"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var action = require('../base/action');
var actionType = require('../base/actiontypes');
var ToggleRequestMarkingCheckButtonAction = (function (_super) {
    __extends(ToggleRequestMarkingCheckButtonAction, _super);
    /**
     * Constructor for toggle request mark check button
     */
    function ToggleRequestMarkingCheckButtonAction(doDisable) {
        _super.call(this, action.Source.View, actionType.TOGGLE_REQUEST_MARKING_CHECK_BUTTON_ACTION);
        this._doDisable = doDisable;
    }
    Object.defineProperty(ToggleRequestMarkingCheckButtonAction.prototype, "doDisable", {
        /**
         * Gets the disable status
         */
        get: function () {
            return this._doDisable;
        },
        enumerable: true,
        configurable: true
    });
    return ToggleRequestMarkingCheckButtonAction;
}(action));
module.exports = ToggleRequestMarkingCheckButtonAction;
//# sourceMappingURL=togglerequestmarkingcheckbuttonaction.js.map