"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var action = require('../base/action');
var actionType = require('../base/actiontypes');
/**
 * Action class for setting marking in progress.
 */
var SetMarkingInProgressAction = (function (_super) {
    __extends(SetMarkingInProgressAction, _super);
    /**
     * constructor
     * @param isMarkingInProgress
     */
    function SetMarkingInProgressAction(isMarkingInProgress) {
        _super.call(this, action.Source.View, actionType.SET_MARKING_IN_PROGRESS_ACTION);
        this._isMarkingInProgress = isMarkingInProgress;
    }
    Object.defineProperty(SetMarkingInProgressAction.prototype, "isMarkingInProgress", {
        /**
         * Get marking in progress
         */
        get: function () {
            return this._isMarkingInProgress;
        },
        enumerable: true,
        configurable: true
    });
    return SetMarkingInProgressAction;
}(action));
module.exports = SetMarkingInProgressAction;
//# sourceMappingURL=setmarkinginprogressaction.js.map