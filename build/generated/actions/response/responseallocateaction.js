"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var action = require('../base/action');
var dataRetrievalAction = require('../base/dataretrievalaction');
var actionType = require('../base/actiontypes');
/**
 * The Action class for Response Allocation
 */
var ResponseAllocateAction = (function (_super) {
    __extends(ResponseAllocateAction, _super);
    /**
     * Initializing a new instance of allocate action.
     * @param {boolean} success
     */
    function ResponseAllocateAction(data, success, _isWholeResponseAllocation) {
        if (_isWholeResponseAllocation === void 0) { _isWholeResponseAllocation = false; }
        _super.call(this, action.Source.View, actionType.RESPONSE_ALLOCATED, success);
        this.auditLog.logContent = this.auditLog.logContent.replace(/{success}/g, success.toString());
        this._allocatedResponseData = data;
        this._isWholeResponseAllocation = _isWholeResponseAllocation;
    }
    Object.defineProperty(ResponseAllocateAction.prototype, "allocatedResponseData", {
        get: function () {
            return this._allocatedResponseData;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ResponseAllocateAction.prototype, "isWholeResponseAllocation", {
        get: function () {
            return this._isWholeResponseAllocation;
        },
        enumerable: true,
        configurable: true
    });
    return ResponseAllocateAction;
}(dataRetrievalAction));
module.exports = ResponseAllocateAction;
//# sourceMappingURL=responseallocateaction.js.map