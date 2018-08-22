"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var action = require('../base/action');
var actionType = require('../base/actiontypes');
var ExceptionTypeScrollResetAction = (function (_super) {
    __extends(ExceptionTypeScrollResetAction, _super);
    /**
     * Constructor
     */
    function ExceptionTypeScrollResetAction() {
        _super.call(this, action.Source.View, actionType.EXCEPTION_TYPE_SCROLL_RESET_ACTION);
    }
    return ExceptionTypeScrollResetAction;
}(action));
module.exports = ExceptionTypeScrollResetAction;
//# sourceMappingURL=exceptiontypescrollresetaction.js.map