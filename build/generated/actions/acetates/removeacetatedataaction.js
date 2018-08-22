"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var action = require('../base/action');
var actionType = require('../base/actiontypes');
var RemoveAcetateDataAction = (function (_super) {
    __extends(RemoveAcetateDataAction, _super);
    /**
     * Constructor
     * @param removeAnnotationList
     * @param isPanAvoidImageContainerRender
     */
    function RemoveAcetateDataAction(clientToken, contextMenuType, multilineItem, acetateContextMenuData) {
        _super.call(this, action.Source.View, actionType.REMOVE_ACETATE_DATA_ACTION);
        this.auditLog.logContent = this.auditLog.logContent.replace(/{action}/g, clientToken.toString());
        this._clientToken = clientToken;
        this._toolType = contextMenuType;
        this._acetateContextMenuData = acetateContextMenuData;
        this._multilineItem = multilineItem;
    }
    Object.defineProperty(RemoveAcetateDataAction.prototype, "clienToken", {
        /**
         * Get clientToken of selected acetate
         */
        get: function () {
            return this._clientToken;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(RemoveAcetateDataAction.prototype, "contextMenuType", {
        /**
         * Get selected acetate Type
         */
        get: function () {
            return this._toolType;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(RemoveAcetateDataAction.prototype, "acetateContextMenuData", {
        /**
         * Get selected acetate context menu data
         */
        get: function () {
            return this._acetateContextMenuData;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(RemoveAcetateDataAction.prototype, "multilineItem", {
        /**
         * Get selected acetate Type
         */
        get: function () {
            return this._multilineItem;
        },
        enumerable: true,
        configurable: true
    });
    return RemoveAcetateDataAction;
}(action));
module.exports = RemoveAcetateDataAction;
//# sourceMappingURL=removeacetatedataaction.js.map