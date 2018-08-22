"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var action = require('../base/action');
var actionType = require('../base/actiontypes');
var dataRetrievalAction = require('../base/dataretrievalaction');
/**
 * Action when live worklist is selected
 */
var ResponseCloseAction = (function (_super) {
    __extends(ResponseCloseAction, _super);
    /**
     * worklist type constructor
     * @param markingmode
     * @param responseMode
     * @param success
     * @param isCached
     * @param responseData
     * @param json
     */
    function ResponseCloseAction(isResponseClose) {
        _super.call(this, action.Source.View, actionType.RESPONSE_CLOSE, true);
        this.isResponseClose = isResponseClose;
        this.auditLog.logContent = this.auditLog.logContent.replace(/{isResponseClose}/g, isResponseClose.toString());
    }
    Object.defineProperty(ResponseCloseAction.prototype, "getIsResponseClose", {
        /**
         * Gets the response mode
         */
        get: function () {
            return this.isResponseClose;
        },
        enumerable: true,
        configurable: true
    });
    return ResponseCloseAction;
}(dataRetrievalAction));
module.exports = ResponseCloseAction;
//# sourceMappingURL=responsecloseaction.js.map