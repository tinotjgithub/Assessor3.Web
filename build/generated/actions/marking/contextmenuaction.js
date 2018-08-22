"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var action = require('../base/action');
var actionType = require('../base/actiontypes');
var ContextMenuAction = (function (_super) {
    __extends(ContextMenuAction, _super);
    /**
     * Constructor
     * @param isVisible
     * @param xPos
     * @param yPos
     * @param contextMenuData
     */
    function ContextMenuAction(isVisible, xPos, yPos, contextMenuData) {
        _super.call(this, action.Source.View, actionType.CONTEXT_MENU_ACTION);
        this._isVisible = isVisible;
        this._xPos = xPos !== undefined ? xPos : 0;
        this._yPos = yPos !== undefined ? yPos : 0;
        this._contextMenuData = contextMenuData;
        this.auditLog.logContent = this.auditLog.logContent.replace('{0}', this._xPos.toString())
            .replace('{1}', this._yPos.toString());
    }
    Object.defineProperty(ContextMenuAction.prototype, "isVisible", {
        /**
         * Is context menu visible
         */
        get: function () {
            return this._isVisible;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ContextMenuAction.prototype, "xPos", {
        /**
         * Get x position
         */
        get: function () {
            return this._xPos;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ContextMenuAction.prototype, "yPos", {
        /**
         * Get y position
         */
        get: function () {
            return this._yPos;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ContextMenuAction.prototype, "contextMenuData", {
        /**
         * Get ContextMenuData
         */
        get: function () {
            return this._contextMenuData;
        },
        enumerable: true,
        configurable: true
    });
    return ContextMenuAction;
}(action));
module.exports = ContextMenuAction;
//# sourceMappingURL=contextmenuaction.js.map