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
var ResponseModeChangeAction = (function (_super) {
    __extends(ResponseModeChangeAction, _super);
    /**
     * ResponseModeChangeAction type constructor
     * @param responseMode
     */
    function ResponseModeChangeAction(responseMode, isMarkingCheckMode) {
        if (isMarkingCheckMode === void 0) { isMarkingCheckMode = false; }
        _super.call(this, action.Source.View, actionType.RESPONSE_MODE_CHANGED, true);
        this.responseMode = responseMode;
        this._markingCheckMode = isMarkingCheckMode;
        this.auditLog.logContent = this.auditLog.logContent.replace(/{responseMode}/g, responseMode ? responseMode.toString() : 'undefined');
    }
    Object.defineProperty(ResponseModeChangeAction.prototype, "getResponseMode", {
        /**
         * Gets the response mode
         */
        get: function () {
            return this.responseMode;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ResponseModeChangeAction.prototype, "isMarkingCheckMode", {
        /**
         * Gets a value indicating whether current mode is marking check mode
         */
        get: function () {
            return this._markingCheckMode;
        },
        enumerable: true,
        configurable: true
    });
    return ResponseModeChangeAction;
}(dataRetrievalAction));
module.exports = ResponseModeChangeAction;
//# sourceMappingURL=responsemodechangeaction.js.map