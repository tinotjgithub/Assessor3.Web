"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var action = require('../base/action');
var actionType = require('../base/actiontypes');
/**
 * The Action class for Response Data Get
 */
var ResponseDataGetAction = (function (_super) {
    __extends(ResponseDataGetAction, _super);
    /**
     * Initializing a new instance of response search action.
     */
    function ResponseDataGetAction(searchedResponseData, success) {
        _super.call(this, action.Source.View, actionType.RESPONSE_DATA_GET_SEARCH);
        this._success = false;
        this.auditLog.logContent = this.auditLog.logContent.replace(/{displayId}/g, searchedResponseData.displayId);
        this._searchedResponseData = searchedResponseData;
        this._success = success;
    }
    Object.defineProperty(ResponseDataGetAction.prototype, "searchedResponseData", {
        /**
         * Get the Searched Response Data
         */
        get: function () {
            return this._searchedResponseData;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ResponseDataGetAction.prototype, "success", {
        get: function () {
            return this._success;
        },
        enumerable: true,
        configurable: true
    });
    return ResponseDataGetAction;
}(action));
module.exports = ResponseDataGetAction;
//# sourceMappingURL=responsedatagetaction.js.map