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
var AtypicalResponseSearchAction = (function (_super) {
    __extends(AtypicalResponseSearchAction, _super);
    /**
     * Initializing a new instance of allocate action.
     * @param {boolean} success
     */
    function AtypicalResponseSearchAction(data, success) {
        _super.call(this, action.Source.View, actionType.ATYPICAL_RESPONSE_SEARCH, success);
        this.auditLog.logContent = this.auditLog.logContent.replace(/{success}/g, success.toString());
        this._atypicalSearchResultData = data;
    }
    Object.defineProperty(AtypicalResponseSearchAction.prototype, "atypicalSearchResultData", {
        get: function () {
            return this._atypicalSearchResultData;
        },
        enumerable: true,
        configurable: true
    });
    return AtypicalResponseSearchAction;
}(dataRetrievalAction));
module.exports = AtypicalResponseSearchAction;
//# sourceMappingURL=atypicalresponsesearchaction.js.map