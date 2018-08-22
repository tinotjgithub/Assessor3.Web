"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var action = require('../base/action');
var actionType = require('../base/actiontypes');
var NotifyMarkChangedAction = (function (_super) {
    __extends(NotifyMarkChangedAction, _super);
    /**
     * Constructor
     * @param markingProgress
     */
    function NotifyMarkChangedAction(markingProgress, warningNR) {
        _super.call(this, action.Source.View, actionType.NOTIFY_MARK_CHANGE);
        this._markingProgress = markingProgress;
        this._warningNR = warningNR;
    }
    Object.defineProperty(NotifyMarkChangedAction.prototype, "markingProgress", {
        get: function () {
            return this._markingProgress;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(NotifyMarkChangedAction.prototype, "warningNR", {
        /**
         * return collection of NR warning messageS based on NR cc  flag values and optionality .
         */
        get: function () {
            return this._warningNR;
        },
        enumerable: true,
        configurable: true
    });
    return NotifyMarkChangedAction;
}(action));
module.exports = NotifyMarkChangedAction;
//# sourceMappingURL=notifymarkchangedaction.js.map