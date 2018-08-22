"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var action = require('../base/action');
var dataRetrievalAction = require('../base/dataretrievalaction');
var actionType = require('../base/actiontypes');
var enums = require('../../components/utility/enums');
var ResponseOpenAction = (function (_super) {
    __extends(ResponseOpenAction, _super);
    /**
     * Constructor ResponseOpenAction
     * @param success
     * @param displayId
     * @param responseNaviagation
     * @param responseMode
     * @param markGroupId
     * @param responseViewMode
     * @param triggerPoint
     * @param json
     * @param sampleReviewCommentId
     * @param sampleReviewCommentCreatedBy
     * @param isWholeResponse
     */
    function ResponseOpenAction(success, displayId, responseNaviagation, responseMode, markGroupId, responseViewMode, triggerPoint, json, sampleReviewCommentId, sampleReviewCommentCreatedBy, isWholeResponse) {
        if (sampleReviewCommentId === void 0) { sampleReviewCommentId = enums.SampleReviewComment.None; }
        if (sampleReviewCommentCreatedBy === void 0) { sampleReviewCommentCreatedBy = 0; }
        if (isWholeResponse === void 0) { isWholeResponse = false; }
        _super.call(this, action.Source.View, actionType.OPEN_RESPONSE, success);
        this._triggerPoint = enums.TriggerPoint.None;
        this._sampleReviewCommentId = enums.SampleReviewComment.None;
        this.auditLog.logContent = this.auditLog.logContent.replace(/{success}/g, success.toString());
        this._selectedDisplayId = displayId;
        this._selectedResponseMode = responseMode;
        this._responseNavigation = responseNaviagation;
        this._selectedMarkGroupId = markGroupId;
        this._responseViewMode = responseViewMode;
        this._triggerPoint = triggerPoint;
        this._sampleReviewCommentId = sampleReviewCommentId;
        this._sampleReviewCommentCreatedBy = sampleReviewCommentCreatedBy;
        this._isWholeResponse = isWholeResponse;
    }
    Object.defineProperty(ResponseOpenAction.prototype, "selectedDisplayId", {
        /**
         * This method will returns the selected responseId
         */
        get: function () {
            return this._selectedDisplayId;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ResponseOpenAction.prototype, "selectedResponseMode", {
        /**
         * This method will returns the selected response mode
         */
        get: function () {
            return this._selectedResponseMode;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ResponseOpenAction.prototype, "responseNavigation", {
        /*
         * This will returns the current response navigation type
         */
        get: function () {
            return this._responseNavigation;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ResponseOpenAction.prototype, "selectedMarkGroupId", {
        /**
         * This method will returns the selected markGroupId
         */
        get: function () {
            return this._selectedMarkGroupId;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ResponseOpenAction.prototype, "responseViewMode", {
        /**
         * This method will return the current responseViewMode
         */
        get: function () {
            return this._responseViewMode;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ResponseOpenAction.prototype, "triggerPoint", {
        /**
         * Returns the triggering point
         */
        get: function () {
            return this._triggerPoint;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ResponseOpenAction.prototype, "sampleReviewCommentId", {
        /**
         * Returns the sample Review Comment Id
         */
        get: function () {
            return this._sampleReviewCommentId;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ResponseOpenAction.prototype, "sampleReviewCommentCreatedBy", {
        /**
         * Returns the sample Review Comment CreatedBy
         */
        get: function () {
            return this._sampleReviewCommentCreatedBy;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ResponseOpenAction.prototype, "isWholeResponse", {
        /**
         * Returns true if whole response
         */
        get: function () {
            return this._isWholeResponse;
        },
        enumerable: true,
        configurable: true
    });
    return ResponseOpenAction;
}(dataRetrievalAction));
module.exports = ResponseOpenAction;
//# sourceMappingURL=responseopenaction.js.map