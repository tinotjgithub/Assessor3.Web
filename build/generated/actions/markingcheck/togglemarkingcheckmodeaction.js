"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var action = require('../base/action');
var actionType = require('../base/actiontypes');
var ToggleMarkingCheckModeAction = (function (_super) {
    __extends(ToggleMarkingCheckModeAction, _super);
    /**
     * Constructor for toggling the marking check mode action
     */
    function ToggleMarkingCheckModeAction(markingCheckModeValue) {
        _super.call(this, action.Source.View, actionType.TOGGLE_MARKING_CHECK_MODE);
        this._markingCheckModeValue = markingCheckModeValue;
    }
    Object.defineProperty(ToggleMarkingCheckModeAction.prototype, "MarkingCheckModeValue", {
        /**
         * Gets a value to set the marking check mode
         */
        get: function () {
            return this._markingCheckModeValue;
        },
        enumerable: true,
        configurable: true
    });
    return ToggleMarkingCheckModeAction;
}(action));
module.exports = ToggleMarkingCheckModeAction;
//# sourceMappingURL=togglemarkingcheckmodeaction.js.map