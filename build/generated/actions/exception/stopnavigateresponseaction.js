"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var action = require('../base/action');
var actionType = require('../base/actiontypes');
/**
 * Action class for exception panel actions
 */
var StopNavigateResponseAction = (function (_super) {
    __extends(StopNavigateResponseAction, _super);
    /**
     * initialize instance for the donavigateresponseaction
     */
    function StopNavigateResponseAction() {
        _super.call(this, action.Source.View, actionType.EXCEPTION_STOP_NAVIGATE_RESPONSE);
    }
    return StopNavigateResponseAction;
}(action));
module.exports = StopNavigateResponseAction;
//# sourceMappingURL=stopnavigateresponseaction.js.map