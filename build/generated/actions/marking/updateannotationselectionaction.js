"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var action = require('../base/action');
var actionType = require('../base/actiontypes');
var UpdateAnnotationSelectionAction = (function (_super) {
    __extends(UpdateAnnotationSelectionAction, _super);
    /**
     * Creates an instance of UpdateAnnotationSelectionAction.
     * @param {boolean} isSelected
     * @memberof UpdateAnnotationSelectionAction
     */
    function UpdateAnnotationSelectionAction(isSelected) {
        _super.call(this, action.Source.View, actionType.UPDATE_ANNOTATION_SELECTION);
        this._isSelected = isSelected;
        this.auditLog.logContent = this.auditLog.logContent.replace(/{isSelected}/g, isSelected.toString());
    }
    Object.defineProperty(UpdateAnnotationSelectionAction.prototype, "isSelected", {
        /**
         * Returns annotation needs to be selected or not
         *
         * @readonly
         * @type {boolean}
         * @memberof UpdateAnnotationSelectionAction
         */
        get: function () {
            return this._isSelected;
        },
        enumerable: true,
        configurable: true
    });
    return UpdateAnnotationSelectionAction;
}(action));
module.exports = UpdateAnnotationSelectionAction;
//# sourceMappingURL=updateannotationselectionaction.js.map