"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var action = require('../base/action');
var dataRetrievalAction = require('../base/dataretrievalaction');
var actionType = require('../base/actiontypes');
var TagUpdateAction = (function (_super) {
    __extends(TagUpdateAction, _super);
    /**
     * Constructor of tag update action
     * @param success
     * @param json
     */
    function TagUpdateAction(success, tagId, markGroupList, tagOrder, markGroupId, markingMode, json) {
        _super.call(this, action.Source.View, actionType.TAG_UPDATE, success);
        this.auditLog.logContent = this.auditLog.logContent.replace(/{ success}/g, success.toString());
        this._tagId = tagId;
        this._markGroupList = markGroupList;
        this._tagOrder = tagOrder;
        this._tagUpdate = json;
        this._markGroupId = markGroupId;
        this._markingMode = markingMode;
    }
    Object.defineProperty(TagUpdateAction.prototype, "tagId", {
        /**
         * returns the updated tag id.
         */
        get: function () {
            return this._tagId;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TagUpdateAction.prototype, "markGroupList", {
        /**
         * returns the all mark group ids of which the tag id has been updated.
         */
        get: function () {
            return this._markGroupList;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TagUpdateAction.prototype, "markGroupId", {
        /**
         * returns the current mark group id of which the tag id has been updated.
         */
        get: function () {
            return this._markGroupId;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TagUpdateAction.prototype, "tagOrder", {
        /**
         * returns the updated tag order.
         */
        get: function () {
            return this._tagOrder;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TagUpdateAction.prototype, "markingMode", {
        /**
         * returns the current marking mode id of which the response has been updated.
         */
        get: function () {
            return this._markingMode;
        },
        enumerable: true,
        configurable: true
    });
    return TagUpdateAction;
}(dataRetrievalAction));
module.exports = TagUpdateAction;
//# sourceMappingURL=tagupdateaction.js.map