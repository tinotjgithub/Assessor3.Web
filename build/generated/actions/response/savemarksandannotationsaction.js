"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var action = require('../base/action');
var dataRetrievalAction = require('../base/dataretrievalaction');
var actionType = require('../base/actiontypes');
/**
 * Class for save marks and Annotations action.
 */
var SaveMarksAndAnnotationsAction = (function (_super) {
    __extends(SaveMarksAndAnnotationsAction, _super);
    /**
     * Constructor SaveMarksAndAnnotationsAction
     * @param data
     * @param markGroupId
     * @param saveMarksAndAnnotationTriggeringPoint
     * @param success
     * @param dataServiceRequestErrorType
     */
    function SaveMarksAndAnnotationsAction(data, markGroupId, saveMarksAndAnnotationTriggeringPoint, success, dataServiceRequestErrorType, isWholeResponse) {
        var _this = this;
        _super.call(this, action.Source.View, actionType.SAVE_MARKS_AND_ANNOTATIONS, success);
        this._markGroupId = 0;
        this._saveMarksAndAnnotationTriggeringPoint = saveMarksAndAnnotationTriggeringPoint;
        this._dataServiceRequestErrorType = dataServiceRequestErrorType;
        this._markGroupId = markGroupId;
        this._isWholeResponse = isWholeResponse;
        if (data && success) {
            this._saveMarksAndAnnotationsData = data;
            if (this._saveMarksAndAnnotationsData.updatedMarkAnnotationDetails) {
                this._markSchemeGroupIdKeys = Object.keys(data.updatedMarkAnnotationDetails);
                // for multi qig functionality we should multiple data structures against same key we have to change the
                // current data structure at that time.
                this._markSchemeGroupIdKeys.map(function (markSchemeGroupId) {
                    _this._marksAndAnnotations = data.updatedMarkAnnotationDetails[parseInt(markSchemeGroupId)];
                });
            }
        }
        this.auditLog.logContent = this.auditLog.logContent.replace(/{markGroupId}/g, this.markGroupId.toString()).
            replace(/{success}/g, success.toString());
    }
    Object.defineProperty(SaveMarksAndAnnotationsAction.prototype, "saveMarksAndAnnotationsData", {
        /**
         *  returns the return data loaded from server.
         */
        get: function () {
            return this._saveMarksAndAnnotationsData;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SaveMarksAndAnnotationsAction.prototype, "marksAndAnnotations", {
        /**
         * marks and annotations list from the return data.
         */
        get: function () {
            return this._marksAndAnnotations;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SaveMarksAndAnnotationsAction.prototype, "markGroupId", {
        /**
         * returns the markGroupId
         */
        get: function () {
            return this._markGroupId;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SaveMarksAndAnnotationsAction.prototype, "saveMarksAndAnnotationTriggeringPoint", {
        /**
         * returns the saveMarksAndAnnotationTriggeringPoint
         */
        get: function () {
            return this._saveMarksAndAnnotationTriggeringPoint;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SaveMarksAndAnnotationsAction.prototype, "dataServiceRequestErrorType", {
        /**
         * returns the dataServiceRequestErrorType
         */
        get: function () {
            return this._dataServiceRequestErrorType;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SaveMarksAndAnnotationsAction.prototype, "isWholeResponse", {
        /**
         * returns the whole response flag
         */
        get: function () {
            return this._isWholeResponse;
        },
        enumerable: true,
        configurable: true
    });
    return SaveMarksAndAnnotationsAction;
}(dataRetrievalAction));
module.exports = SaveMarksAndAnnotationsAction;
//# sourceMappingURL=savemarksandannotationsaction.js.map