"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var action = require('../base/action');
var actionType = require('../base/actiontypes');
/**
 * action class for removing a response from store worklist collection
 * @class RemoveResponseAction
 * @extends {action}
 */
var RemoveResponseAction = (function (_super) {
    __extends(RemoveResponseAction, _super);
    /**
     * Creates an instance of RemoveResponseAction.
     * @param {enums.WorklistType} worklistType
     * @param {enums.ResponseMode} responseMode
     * @param {string} displayId
     *
     * @memberof RemoveResponseAction
     */
    function RemoveResponseAction(worklistType, responseMode, displayId) {
        _super.call(this, action.Source.View, actionType.REMOVE_RESPONSE);
        this._worklistType = worklistType;
        this._responseMode = responseMode;
        this._displayId = displayId;
    }
    Object.defineProperty(RemoveResponseAction.prototype, "worklistType", {
        /**
         * Returns worklist type
         * @readonly
         * @type {enums.WorklistType}
         * @memberof RemoveResponseAction
         */
        get: function () {
            return this._worklistType;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(RemoveResponseAction.prototype, "responseMode", {
        /**
         * Returns response mode
         * @readonly
         * @type {enums.ResponseMode}
         * @memberof RemoveResponseAction
         */
        get: function () {
            return this._responseMode;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(RemoveResponseAction.prototype, "displayId", {
        /**
         * Returns displayId
         * @readonly
         * @type {string}
         * @memberof RemoveResponseAction
         */
        get: function () {
            return this._displayId;
        },
        enumerable: true,
        configurable: true
    });
    return RemoveResponseAction;
}(action));
module.exports = RemoveResponseAction;
//# sourceMappingURL=removeresponseaction.js.map