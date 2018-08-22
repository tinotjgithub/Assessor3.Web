"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var action = require('../base/action');
var dataRetrievalAction = require('../base/dataretrievalaction');
var actionType = require('../base/actiontypes');
var ErrorAction = (function (_super) {
    __extends(ErrorAction, _super);
    /**
     * @constructor
     */
    function ErrorAction(success, username) {
        _super.call(this, action.Source.View, actionType.ERROR, success);
        this.username = username;
        this.auditLog.logContent = this.auditLog.logContent.replace(/{success}/g, success.toString());
    }
    Object.defineProperty(ErrorAction.prototype, "userName", {
        /**
         * Get the User Name
         * @returns User Name.
         */
        get: function () {
            return this.username;
        },
        enumerable: true,
        configurable: true
    });
    return ErrorAction;
}(dataRetrievalAction));
module.exports = ErrorAction;
//# sourceMappingURL=erroraction.js.map