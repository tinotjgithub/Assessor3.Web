"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var action = require('../base/action');
var actionType = require('../base/actiontypes');
/**
 *  The add or update acetate action.
 */
var AddOrUpdateAcetateAction = (function (_super) {
    __extends(AddOrUpdateAcetateAction, _super);
    /**
     * Constructor for adding or updating acetate.
     * @param acetateData
     * @param markingOperation
     * @param clientToken
     * @param acetateContextMenuData
     */
    function AddOrUpdateAcetateAction(acetate, markingOperation, clientToken, acetateContextMenuData) {
        _super.call(this, action.Source.View, actionType.ADD_OR_UPDATE_ACETATE_ACTION);
        this.auditLog.logContent = this.auditLog.logContent.replace(/{action}/g, markingOperation.toString());
        this._acetate = acetate;
        this._markingOperation = markingOperation;
        this._clientToken = clientToken;
        this._acetateContextMenuData = acetateContextMenuData;
    }
    Object.defineProperty(AddOrUpdateAcetateAction.prototype, "acetate", {
        /**
         * This will return the added or updated acetate data.
         */
        get: function () {
            return this._acetate;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AddOrUpdateAcetateAction.prototype, "markingOperation", {
        /**
         * This will return whether the acetate was added, updated or deleted.
         */
        get: function () {
            return this._markingOperation;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AddOrUpdateAcetateAction.prototype, "clientToken", {
        /**
         * This will return client token of particular accetate.
         */
        get: function () {
            return this._clientToken;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AddOrUpdateAcetateAction.prototype, "acetateContextMenuData", {
        /**
         * This will return acetate Context Menu Data.
         */
        get: function () {
            return this._acetateContextMenuData;
        },
        enumerable: true,
        configurable: true
    });
    return AddOrUpdateAcetateAction;
}(action));
module.exports = AddOrUpdateAcetateAction;
//# sourceMappingURL=addorupdateacetateaction.js.map