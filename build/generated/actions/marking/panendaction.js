"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var action = require('../base/action');
var actionType = require('../base/actiontypes');
var PanEndAction = (function (_super) {
    __extends(PanEndAction, _super);
    /**
     * Constructor
     * @param xPos
     * @param yPos
     * @param elementId
     * @param panSource
     * @param isAnnotationOverlapped
     * @param isAnnotationPlacedInGreyArea
     */
    function PanEndAction(stampId, xPos, yPos, elementId, panSource, isAnnotationOverlapped, isAnnotationPlacedInGreyArea) {
        _super.call(this, action.Source.View, actionType.PAN_END);
        this._elementId = elementId;
        this._xPos = xPos;
        this._yPos = yPos;
        this._panSource = panSource;
        this._stampId = stampId;
        this._isAnnotationOverlapped = isAnnotationOverlapped;
        this._isAnnotationPlacedInGreyArea = isAnnotationPlacedInGreyArea;
        this.auditLog.logContent = this.auditLog.logContent
            .replace('{0}', elementId);
    }
    Object.defineProperty(PanEndAction.prototype, "elementId", {
        /**
         * Get element Id over touch end happened.
         */
        get: function () {
            return this._elementId;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PanEndAction.prototype, "xPos", {
        get: function () {
            return this._xPos;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PanEndAction.prototype, "yPos", {
        get: function () {
            return this._yPos;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PanEndAction.prototype, "panSource", {
        get: function () {
            return this._panSource;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PanEndAction.prototype, "stampId", {
        get: function () {
            return this._stampId;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PanEndAction.prototype, "isAnnotationOverlapped", {
        get: function () {
            return this._isAnnotationOverlapped;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PanEndAction.prototype, "isAnnotationPlacedInGreyArea", {
        get: function () {
            return this._isAnnotationPlacedInGreyArea;
        },
        enumerable: true,
        configurable: true
    });
    return PanEndAction;
}(action));
module.exports = PanEndAction;
//# sourceMappingURL=panendaction.js.map