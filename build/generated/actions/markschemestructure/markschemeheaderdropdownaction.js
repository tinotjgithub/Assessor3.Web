"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var action = require('../base/action');
var actionType = require('../base/actiontypes');
var MarkSchemeHeaderDropDownAction = (function (_super) {
    __extends(MarkSchemeHeaderDropDownAction, _super);
    /**
     * Constructor
     * @param headerDropDownOpen
     */
    function MarkSchemeHeaderDropDownAction(headerDropDownOpen) {
        _super.call(this, action.Source.View, actionType.MARK_SCHEME_HEADER_DROP_DOWN_ACTION);
        this.auditLog.logContent = this.auditLog.logContent.replace('{0}', headerDropDownOpen ?
            headerDropDownOpen.toString() : 'undefined');
        this._headerDropDownOpen = headerDropDownOpen;
    }
    Object.defineProperty(MarkSchemeHeaderDropDownAction.prototype, "isheaderDropDownOpen", {
        get: function () {
            return this._headerDropDownOpen;
        },
        enumerable: true,
        configurable: true
    });
    return MarkSchemeHeaderDropDownAction;
}(action));
module.exports = MarkSchemeHeaderDropDownAction;
//# sourceMappingURL=markschemeheaderdropdownaction.js.map