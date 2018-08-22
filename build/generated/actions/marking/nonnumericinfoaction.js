"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var action = require('../base/action');
var actionType = require('../base/actiontypes');
/**
 * Action class for closing exceptions
 */
var NonNumericInfoAction = (function (_super) {
    __extends(NonNumericInfoAction, _super);
    /**
     * constructor
     * @param isNonNumeric
     */
    function NonNumericInfoAction() {
        _super.call(this, action.Source.View, actionType.NON_NUMERIC_INFO_ACTION);
        this.auditLog.logContent = this.auditLog.logContent;
    }
    return NonNumericInfoAction;
}(action));
module.exports = NonNumericInfoAction;
//# sourceMappingURL=nonnumericinfoaction.js.map