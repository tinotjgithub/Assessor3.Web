"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var action = require('../base/action');
var actionType = require('../base/actiontypes');
/**
 * Class for Stamp Select Action
 */
var StampSelectAction = (function (_super) {
    __extends(StampSelectAction, _super);
    /**
     * Constructor StampSelectAction
     * @param selectedStampId
     * @param isSelected
     */
    function StampSelectAction(selectedStampId, isSelected) {
        _super.call(this, action.Source.View, actionType.STAMP_SELECTED);
        this.auditLog.logContent = this.auditLog.logContent.replace('{0}', isSelected ? 'Selected stamp' : 'Deselected stamp' + selectedStampId.toString());
        this._selectedStampId = selectedStampId;
        this._isStampSelected = isSelected;
    }
    Object.defineProperty(StampSelectAction.prototype, "selectedStampId", {
        /**
         * This method will return the selected Stamp ID
         */
        get: function () {
            return this._selectedStampId;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(StampSelectAction.prototype, "isStampSelected", {
        /**
         * This method will return if a stamp is selected or not
         */
        get: function () {
            return this._isStampSelected;
        },
        enumerable: true,
        configurable: true
    });
    return StampSelectAction;
}(action));
module.exports = StampSelectAction;
//# sourceMappingURL=stampselectaction.js.map