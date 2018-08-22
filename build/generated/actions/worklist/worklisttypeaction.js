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
 * Action when live worklist is selected
 */
var WorklistTypeAction = (function (_super) {
    __extends(WorklistTypeAction, _super);
    /**
     * worklist type constructor
     * @param markingmode
     * @param responseMode
     * @param success
     * @param isCached
     * @param responseData
     * @param json
     */
    function WorklistTypeAction(worklistType, responseMode, remarkRequestType, isDirectedRemark, success, isCached, responseData, markSchemeGroupId, questionPaperId, selectedExaminerRoleId) {
        _super.call(this, action.Source.View, actionType.WORKLIST_MARKING_MODE_CHANGE, success);
        this.worklistType = worklistType;
        this.responseMode = responseMode;
        this.remarkRequestType = remarkRequestType;
        this.worklistDetails = responseData;
        this.isDirectedRemark = isDirectedRemark;
        this.markSchemeGroupId = markSchemeGroupId;
        this.questionPaperId = questionPaperId;
        this.selectedExaminerRoleId = selectedExaminerRoleId;
        this.auditLog.logContent = this.auditLog.logContent.replace(/{worklisttype}/g, worklistType.toString());
    }
    Object.defineProperty(WorklistTypeAction.prototype, "getWorklistType", {
        /**
         * Gets the marking mode
         */
        get: function () {
            return this.worklistType;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(WorklistTypeAction.prototype, "getResponseMode", {
        /**
         * Gets the response mode
         */
        get: function () {
            return this.responseMode;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(WorklistTypeAction.prototype, "getRemarkRequestType", {
        /**
         * Gets the remark request type
         */
        get: function () {
            return this.remarkRequestType;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(WorklistTypeAction.prototype, "getWorklistData", {
        /**
         * Gets the worklist details
         */
        get: function () {
            return this.worklistDetails;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(WorklistTypeAction.prototype, "getIsDirectedRemark", {
        /**
         * Gets is directed remark
         */
        get: function () {
            return this.isDirectedRemark;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(WorklistTypeAction.prototype, "getMarkSchemeGroupId", {
        /**
         * Gets the mark scheme group Id
         */
        get: function () {
            return this.markSchemeGroupId;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(WorklistTypeAction.prototype, "getQuestionPaperId", {
        /**
         * Gets the question paper id
         */
        get: function () {
            return this.questionPaperId;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(WorklistTypeAction.prototype, "getselectedExaminerRoleId", {
        /**
         * Gets the selected examiner role id
         */
        get: function () {
            return this.selectedExaminerRoleId;
        },
        enumerable: true,
        configurable: true
    });
    return WorklistTypeAction;
}(dataRetrievalAction));
module.exports = WorklistTypeAction;
//# sourceMappingURL=worklisttypeaction.js.map