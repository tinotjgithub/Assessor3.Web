"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var action = require('../base/action');
var dataRetrievalAction = require('../base/dataretrievalaction');
var actionType = require('../base/actiontypes');
var StampAction = (function (_super) {
    __extends(StampAction, _super);
    /**
     * Constructor StampAction
     * @param success
     * @param stampList
     */
    function StampAction(success, stampList) {
        _super.call(this, action.Source.View, actionType.STAMPS_FETCH, success);
        this.auditLog.logContent = this.auditLog.logContent.replace(/{success}/g, success.toString());
        // Map the collection
        this._stampList = stampList;
    }
    Object.defineProperty(StampAction.prototype, "stampList", {
        /*
        * returns the stamp list
        */
        get: function () {
            return this._stampList;
        },
        enumerable: true,
        configurable: true
    });
    return StampAction;
}(dataRetrievalAction));
module.exports = StampAction;
//# sourceMappingURL=stampaction.js.map