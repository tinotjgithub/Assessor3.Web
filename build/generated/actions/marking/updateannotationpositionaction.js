"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var action = require('../base/action');
var actionType = require('../base/actiontypes');
/**
 * Update annotation action
 */
var UpdateAnnotationPositionAction = (function (_super) {
    __extends(UpdateAnnotationPositionAction, _super);
    /**
     * Constructor
     * @param leftEdge
     * @param topEdge
     * @param topEdge
     * @param topEdge
     * @param topEdge
     * @param draggedAnnotationClientToken
     * @param width
     * @param height
     * @param comment
     * @param isPositionUpdated
     * @param isDrawEndOfStampFromStampPanel
     * @param stampId
     */
    function UpdateAnnotationPositionAction(leftEdge, topEdge, imageClusterId, outputPageNo, pageNo, draggedAnnotationClientToken, width, height, comment, isPositionUpdated, isDrawEndOfStampFromStampPanel, avoidEventEmit, stampId) {
        if (isPositionUpdated === void 0) { isPositionUpdated = true; }
        if (isDrawEndOfStampFromStampPanel === void 0) { isDrawEndOfStampFromStampPanel = false; }
        if (avoidEventEmit === void 0) { avoidEventEmit = false; }
        _super.call(this, action.Source.View, actionType.UPDATE_ANNOTATION);
        this._leftEdge = leftEdge;
        this._topEdge = topEdge;
        this._imageClusterId = imageClusterId !== undefined ? imageClusterId : 0;
        this._outputPageNo = outputPageNo !== undefined ? outputPageNo : 0;
        this._pageNo = pageNo !== undefined ? pageNo : 0;
        this._draggedAnnotationClientToken = draggedAnnotationClientToken;
        this._width = width;
        this._height = height;
        this._comment = (comment !== undefined) ? comment : '';
        this._isPositionUpdated = isPositionUpdated;
        this._isDrawEndOfStampFromStampPanel = isDrawEndOfStampFromStampPanel;
        this._avoidEventEmit = avoidEventEmit;
        this._stampId = stampId !== undefined ? stampId : 0;
        this.auditLog.logContent = this.auditLog.logContent.replace('{0}', this._draggedAnnotationClientToken)
            .replace('{1}', this._pageNo.toString())
            .replace('{2}', this._imageClusterId.toString())
            .replace('{3}', this._outputPageNo.toString())
            .replace('{4}', this._leftEdge.toString())
            .replace('{5}', this._topEdge.toString())
            .replace('{6}', this._width.toString())
            .replace('{7}', this._height.toString())
            .replace('{8}', this._comment.toString())
            .replace('{9}', this._isPositionUpdated.toString())
            .replace('{10}', this._isDrawEndOfStampFromStampPanel.toString())
            .replace('{11}', this._stampId.toString())
            .replace('{12}', this._avoidEventEmit.toString());
    }
    Object.defineProperty(UpdateAnnotationPositionAction.prototype, "stampId", {
        /**
         * Returns stamp id of draw ended annottaion
         */
        get: function () {
            return this._stampId;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(UpdateAnnotationPositionAction.prototype, "isDrawEndOfStampFromStampPanel", {
        /**
         * Returns true if annotaion draw end
         */
        get: function () {
            return this._isDrawEndOfStampFromStampPanel;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(UpdateAnnotationPositionAction.prototype, "isPositionUpdated", {
        /**
         * Return true if position of the annotation changed
         */
        get: function () {
            return this._isPositionUpdated;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(UpdateAnnotationPositionAction.prototype, "avoidEventEmition", {
        /**
         * Return true for avoiding event emition
         */
        get: function () {
            return this._avoidEventEmit;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(UpdateAnnotationPositionAction.prototype, "leftEdge", {
        /**
         * Left edge property
         */
        get: function () {
            return this._leftEdge;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(UpdateAnnotationPositionAction.prototype, "topEdge", {
        /**
         * Top edge property
         */
        get: function () {
            return this._topEdge;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(UpdateAnnotationPositionAction.prototype, "draggedAnnotationClientToken", {
        /**
         * Currently dragged client token property
         */
        get: function () {
            return this._draggedAnnotationClientToken;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(UpdateAnnotationPositionAction.prototype, "imageClusterId", {
        /**
         * Currently dragged image cluster id
         */
        get: function () {
            return this._imageClusterId;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(UpdateAnnotationPositionAction.prototype, "outputPageNo", {
        /**
         * Currently dragged output page no
         */
        get: function () {
            return this._outputPageNo;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(UpdateAnnotationPositionAction.prototype, "pageNo", {
        /**
         * Currently dragged page no
         */
        get: function () {
            return this._pageNo;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(UpdateAnnotationPositionAction.prototype, "width", {
        /**
         * Returns width of the annotation
         */
        get: function () {
            return this._width;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(UpdateAnnotationPositionAction.prototype, "height", {
        /**
         * Returns height of the annotation
         */
        get: function () {
            return this._height;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(UpdateAnnotationPositionAction.prototype, "comment", {
        /**
         * Returns comment text
         */
        get: function () {
            return this._comment;
        },
        enumerable: true,
        configurable: true
    });
    return UpdateAnnotationPositionAction;
}(action));
module.exports = UpdateAnnotationPositionAction;
//# sourceMappingURL=updateannotationpositionaction.js.map