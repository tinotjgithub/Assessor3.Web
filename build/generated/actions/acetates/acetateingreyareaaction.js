"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var action = require('../base/action');
var actionType = require('../base/actiontypes');
/**
 * The Action class to update the acetate moving element properties
 */
var AcetateInGreyAreaAction = (function (_super) {
    __extends(AcetateInGreyAreaAction, _super);
    /**
     * Initializing a new instance.
     */
    function AcetateInGreyAreaAction(isInGreyArea, clientToken) {
        _super.call(this, action.Source.View, actionType.ACETATE_IN_GREY_AREA_ACTION);
        this._isInGreyArea = isInGreyArea;
        this.auditLog.logContent = this.auditLog.logContent.replace('{0}', clientToken)
            .replace('{1}', isInGreyArea.toString());
    }
    Object.defineProperty(AcetateInGreyAreaAction.prototype, "isInGreyArea", {
        /**
         * get acetate property
         */
        get: function () {
            return this._isInGreyArea;
        },
        enumerable: true,
        configurable: true
    });
    return AcetateInGreyAreaAction;
}(action));
module.exports = AcetateInGreyAreaAction;
//# sourceMappingURL=acetateingreyareaaction.js.map