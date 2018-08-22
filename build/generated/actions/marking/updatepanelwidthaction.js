"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var action = require('../base/action');
var actionType = require('../base/actiontypes');
var enums = require('../../components/utility/enums');
var UpdatePanelWidthAction = (function (_super) {
    __extends(UpdatePanelWidthAction, _super);
    /**
     * Constructor
     * @param type
     * @param width
     * @param className
     * @param previousMarkListWidth
     * @param isPreviousMarkListColumnVisible
     */
    function UpdatePanelWidthAction(markSchemePaneltype, width, className, panelType, panActionType, previousMarkListWidth, isPreviousMarkListColumnVisible) {
        if (isPreviousMarkListColumnVisible === void 0) { isPreviousMarkListColumnVisible = false; }
        if (!width) {
            width = '';
        }
        switch (markSchemePaneltype) {
            case enums.markSchemePanelType.defaultPanel:
                _super.call(this, action.Source.View, actionType.DEFAULT_PANEL_WIDTH);
                this._defaultPanelWidth = width;
                this._previousMarkListWidth = previousMarkListWidth ? previousMarkListWidth : 0;
                break;
            case enums.markSchemePanelType.resizedPanel:
                _super.call(this, action.Source.View, actionType.PANEL_WIDTH);
                this._panelWidth = width;
                this._resizeClassName = className;
                this._panActionType = panActionType;
                this._panelType = panelType;
                break;
            case enums.markSchemePanelType.minimumWidthPanel:
                _super.call(this, action.Source.View, actionType.MINIMUM_PANEL_WIDTH);
                this._minimumPanelWidth = width;
                break;
            case enums.markSchemePanelType.updateDefaultPanel:
                _super.call(this, action.Source.View, actionType.DEFAULT_PANEL_WIDTH_AFTER_COLUMN_UPDATION);
                this._newDefaultPanelWidth = width;
                this._isPreviousMarkListColumnVisible = isPreviousMarkListColumnVisible;
                break;
            default:
                _super.call(this, action.Source.View, actionType.PANEL_RESIZE_CLASSNAME);
                this._resizeClassName = className;
                break;
        }
        var errorText = this.auditLog.logContent;
    }
    Object.defineProperty(UpdatePanelWidthAction.prototype, "panelWidth", {
        /**
         * Get panel width
         */
        get: function () {
            return this._panelWidth;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(UpdatePanelWidthAction.prototype, "resizeClassName", {
        /**
         * Get resize classname
         */
        get: function () {
            return this._resizeClassName;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(UpdatePanelWidthAction.prototype, "defaultPanelWidth", {
        /**
         * Get default panel width
         */
        get: function () {
            return this._defaultPanelWidth;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(UpdatePanelWidthAction.prototype, "defaultPanelWidthAfterColumnUpdate", {
        /**
         * Get new default panel width
         */
        get: function () {
            return this._newDefaultPanelWidth;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(UpdatePanelWidthAction.prototype, "minimumPanelWidth", {
        /**
         * Get minimum panel width
         */
        get: function () {
            return this._minimumPanelWidth;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(UpdatePanelWidthAction.prototype, "previousMarkListWidth", {
        /**
         * Get previous marklist column width
         */
        get: function () {
            return this._previousMarkListWidth;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(UpdatePanelWidthAction.prototype, "previousMarkListColumnVisible", {
        /**
         * Get previous marklist column visible or not
         */
        get: function () {
            return this._isPreviousMarkListColumnVisible;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(UpdatePanelWidthAction.prototype, "panActionType", {
        /**
         * Returns pan action type
         * @readonly
         * @type {enums.PanActionType}
         * @memberof UpdatePanelWidthAction
         */
        get: function () {
            return this._panActionType;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(UpdatePanelWidthAction.prototype, "panelType", {
        /**
         * Returns panel type
         * @readonly
         * @type {enums.ResizePanelType}
         * @memberof UpdatePanelWidthAction
         */
        get: function () {
            return this._panelType;
        },
        enumerable: true,
        configurable: true
    });
    return UpdatePanelWidthAction;
}(action));
module.exports = UpdatePanelWidthAction;
//# sourceMappingURL=updatepanelwidthaction.js.map