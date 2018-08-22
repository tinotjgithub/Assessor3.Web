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
 * The class for validating examiner from team management.
 */
var ValidateTeamManagementExaminerAction = (function (_super) {
    __extends(ValidateTeamManagementExaminerAction, _super);
    /**
     * Constructor
     * @param success
     * @param failureCode
     * @param markSchemeGroupId
     */
    function ValidateTeamManagementExaminerAction(success, validateExaminerReturn, markSchemeGroupId, isFromRememberQig, examinerValidationArea, displayId, markingMode, examinerId, examinerRoleId, exceptionId, isTeamManagementTabSelect) {
        _super.call(this, action.Source.View, actionType.VALIDATE_TEAM_MANAGEMENT_EXAMINER_ACTION, success);
        this._failureCode = validateExaminerReturn.failureCode;
        this._markSchemeGroupId = markSchemeGroupId;
        this._isFromRememberQig = isFromRememberQig;
        this._examinerValidationArea = examinerValidationArea;
        this._displayId = displayId;
        this._markingMode = markingMode;
        this._examinerId = examinerId;
        this._examinerRoleId = examinerRoleId;
        this._exceptionId = exceptionId;
        this._isTeamManagementTabSelect = isTeamManagementTabSelect;
        this.auditLog.logContent = this.auditLog.logContent.replace(/{ success}/g, success.toString());
    }
    Object.defineProperty(ValidateTeamManagementExaminerAction.prototype, "failureCode", {
        /**
         * Returns the failure Code
         */
        get: function () {
            return this._failureCode;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ValidateTeamManagementExaminerAction.prototype, "markSchemeGroupId", {
        /**
         * Returns the mark Scheme GroupId
         */
        get: function () {
            return this._markSchemeGroupId;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ValidateTeamManagementExaminerAction.prototype, "isFromRememberQig", {
        /**
         * Returns _isFromRememberQig
         */
        get: function () {
            return this._isFromRememberQig;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ValidateTeamManagementExaminerAction.prototype, "examinerValidationArea", {
        /**
         * Returns ExaminerValidationArea
         */
        get: function () {
            return this._examinerValidationArea;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ValidateTeamManagementExaminerAction.prototype, "displayId", {
        /**
         * Returns Display Id
         */
        get: function () {
            return this._displayId;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ValidateTeamManagementExaminerAction.prototype, "markingMode", {
        /**
         * Returns Marking mode
         */
        get: function () {
            return this._markingMode;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ValidateTeamManagementExaminerAction.prototype, "examinerId", {
        /**
         * Returns ExaminerId
         */
        get: function () {
            return this._examinerId;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ValidateTeamManagementExaminerAction.prototype, "examinerRoleId", {
        /**
         * Returns ExaminerRoleId
         */
        get: function () {
            return this._examinerRoleId;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ValidateTeamManagementExaminerAction.prototype, "exceptionId", {
        /**
         * Returns exception id
         */
        get: function () {
            return this._exceptionId;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ValidateTeamManagementExaminerAction.prototype, "isTeamManagementTabSelect", {
        /**
         * Returns isTeamManagementTabSelect
         */
        get: function () {
            return this._isTeamManagementTabSelect;
        },
        enumerable: true,
        configurable: true
    });
    return ValidateTeamManagementExaminerAction;
}(dataRetrievalAction));
module.exports = ValidateTeamManagementExaminerAction;
//# sourceMappingURL=validateteammanagementexamineraction.js.map