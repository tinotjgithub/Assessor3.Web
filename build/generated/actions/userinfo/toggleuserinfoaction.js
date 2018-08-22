"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var action = require('../base/action');
/**
 * Toggle User Information panel
 */
var ToggleUserInfoAction = (function (_super) {
    __extends(ToggleUserInfoAction, _super);
    /**
     * Constructor ToggleUserInfoAction
     * @param actionType
     */
    function ToggleUserInfoAction(actionType, saveUserOptionData) {
        _super.call(this, action.Source.View, actionType);
        this._saveUserOptionData = saveUserOptionData;
    }
    Object.defineProperty(ToggleUserInfoAction.prototype, "saveUserOptionData", {
        /**
         * Returns the save useroption data
         * @readonly
         * @type {boolean}
         * @memberof ToggleUserInfoAction
         */
        get: function () {
            return this._saveUserOptionData;
        },
        enumerable: true,
        configurable: true
    });
    return ToggleUserInfoAction;
}(action));
module.exports = ToggleUserInfoAction;
//# sourceMappingURL=toggleuserinfoaction.js.map