"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var action = require('../base/action');
var dataRetrievalAction = require('../base/dataretrievalaction');
var actionType = require('../base/actiontypes');
var ComponentAndSessionGetAction = (function (_super) {
    __extends(ComponentAndSessionGetAction, _super);
    function ComponentAndSessionGetAction(success, componentAndSessionList) {
        _super.call(this, action.Source.View, actionType.COMPONENT_AND_SESSION_GET, success);
        this._componentAndSessionList = componentAndSessionList;
        this.auditLog.logContent = this.auditLog.logContent.replace(/{ success}/g, success.toString());
    }
    Object.defineProperty(ComponentAndSessionGetAction.prototype, "isSuccess", {
        get: function () {
            return this._componentAndSessionList.success;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ComponentAndSessionGetAction.prototype, "componentAndSessionList", {
        get: function () {
            return this._componentAndSessionList;
        },
        enumerable: true,
        configurable: true
    });
    return ComponentAndSessionGetAction;
}(dataRetrievalAction));
module.exports = ComponentAndSessionGetAction;
//# sourceMappingURL=componentandsessiongetaction.js.map