"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var action = require('../base/action');
var actionType = require('../base/actiontypes');
var QigSelectedFromMultiQigDropDownAction = (function (_super) {
    __extends(QigSelectedFromMultiQigDropDownAction, _super);
    function QigSelectedFromMultiQigDropDownAction(qigDetail) {
        _super.call(this, action.Source.View, actionType.QIG_SELECTED_FROM_MULI_QIG_DROP_DOWN);
        this.selectedQigDetails = qigDetail;
        this.auditLog.logContent = this.auditLog.logContent;
    }
    Object.defineProperty(QigSelectedFromMultiQigDropDownAction.prototype, "selectedQigDetail", {
        get: function () {
            return this.selectedQigDetails;
        },
        enumerable: true,
        configurable: true
    });
    return QigSelectedFromMultiQigDropDownAction;
}(action));
module.exports = QigSelectedFromMultiQigDropDownAction;
//# sourceMappingURL=qigselectedfrommultiqigdropdownaction.js.map