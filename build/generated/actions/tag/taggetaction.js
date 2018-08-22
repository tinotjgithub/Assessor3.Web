"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var action = require('../base/action');
var dataRetrievalAction = require('../base/dataretrievalaction');
var actionType = require('../base/actiontypes');
var TagGetAction = (function (_super) {
    __extends(TagGetAction, _super);
    /**
     * Constructor of tag get action
     * @param success
     * @param json
     */
    function TagGetAction(success, json) {
        _super.call(this, action.Source.View, actionType.TAG_GET, success);
        this.auditLog.logContent = this.auditLog.logContent.replace(/{ success}/g, success.toString());
        this._tagData = json;
    }
    Object.defineProperty(TagGetAction.prototype, "tagData", {
        /**
         * returns the list of tags
         */
        get: function () {
            return this._tagData.tagList;
        },
        enumerable: true,
        configurable: true
    });
    return TagGetAction;
}(dataRetrievalAction));
module.exports = TagGetAction;
//# sourceMappingURL=taggetaction.js.map