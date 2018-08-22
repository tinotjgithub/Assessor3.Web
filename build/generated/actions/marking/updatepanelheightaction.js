"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var action = require('../base/action');
var actionType = require('../base/actiontypes');
var enums = require('../../components/utility/enums');
var UpdatePanelHeightAction = (function (_super) {
    __extends(UpdatePanelHeightAction, _super);
    /**
     * Constructor
     * @param type
     * @param width
     * @param className
     * @param previousMarkListWidth
     * @param isPreviousMarkListColumnVisible
     */
    function UpdatePanelHeightAction(panelActionType, panActionType, height, className, resizePanelType, offsetOverlapped) {
        if (!height) {
            height = '';
        }
        switch (panelActionType) {
            case enums.PanelActionType.ResizedPanel:
                _super.call(this, action.Source.View, actionType.PANEL_HEIGHT);
                this._panelHeight = height;
                this._resizeClassName = className;
                this._isOverlapped = offsetOverlapped;
                this._resizePanelType = resizePanelType;
                this._panActionType = panActionType;
                break;
            case enums.PanelActionType.Visiblity:
                _super.call(this, action.Source.View, actionType.PANEL_VISIBLITY_ACTION);
                break;
            default:
                _super.call(this, action.Source.View, actionType.SET_RESIZE_CLASSNAME);
                this._resizeClassName = className;
                this._resizePanelType = resizePanelType;
                break;
        }
        var errorText = this.auditLog.logContent;
    }
    Object.defineProperty(UpdatePanelHeightAction.prototype, "panelHeight", {
        /**
         * Get panel height.
         */
        get: function () {
            return this._panelHeight;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(UpdatePanelHeightAction.prototype, "resizeClassName", {
        /**
         * Get resize classname
         */
        get: function () {
            return this._resizeClassName;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(UpdatePanelHeightAction.prototype, "resizePanelType", {
        /**
         * Get Resizing panel type.
         */
        get: function () {
            return this._resizePanelType;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(UpdatePanelHeightAction.prototype, "elementOverlapped", {
        /**
         * Get element offset overlapped.
         */
        get: function () {
            return this._isOverlapped;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(UpdatePanelHeightAction.prototype, "panActionType", {
        /**
         * Get pan action type
         */
        get: function () {
            return this._panActionType;
        },
        enumerable: true,
        configurable: true
    });
    return UpdatePanelHeightAction;
}(action));
module.exports = UpdatePanelHeightAction;
//# sourceMappingURL=updatepanelheightaction.js.map