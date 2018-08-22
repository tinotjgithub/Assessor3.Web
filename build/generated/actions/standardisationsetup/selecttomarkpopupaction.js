"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var action = require('../base/action');
var actionType = require('../base/actiontypes');
/**
 * Select to mark button click launches a popup to 'Mark now' and 'Mark later'
 */
var SelecttomarkpopupAction = (function (_super) {
    __extends(SelecttomarkpopupAction, _super);
    function SelecttomarkpopupAction(popupType) {
        _super.call(this, action.Source.View, actionType.STANDARDISATION_SELECTTOMARK_POPUP);
        this._popupType = popupType;
    }
    Object.defineProperty(SelecttomarkpopupAction.prototype, "popupType", {
        /**
         * popup type
         */
        get: function () {
            return this._popupType;
        },
        enumerable: true,
        configurable: true
    });
    return SelecttomarkpopupAction;
}(action));
module.exports = SelecttomarkpopupAction;
//# sourceMappingURL=selecttomarkpopupaction.js.map