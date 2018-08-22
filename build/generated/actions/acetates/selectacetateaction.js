"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var action = require('../base/action');
var actionType = require('../base/actiontypes');
/**
 *  The select acetates action
 */
var SelectAcetateAction = (function (_super) {
    __extends(SelectAcetateAction, _super);
    /**
     * Constructor for SelectAcetate action
     * @param acetateType
     */
    function SelectAcetateAction(acetateType) {
        _super.call(this, action.Source.View, actionType.SELECT_ACETATE_ACTION);
        this.auditLog.logContent = this.auditLog.logContent.replace(/{acetate}/g, acetateType.toString());
        this._acetateType = acetateType;
    }
    Object.defineProperty(SelectAcetateAction.prototype, "acetateType", {
        /**
         * This will return the added acetate type.
         */
        get: function () {
            return this._acetateType;
        },
        enumerable: true,
        configurable: true
    });
    return SelectAcetateAction;
}(action));
module.exports = SelectAcetateAction;
//# sourceMappingURL=selectacetateaction.js.map