"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var loggerBase = require('../../base/loggerbase');
var logCategory = require('../auditlogger/auditloggingcategory');
var MarkingAuditLoggingHelper = (function (_super) {
    __extends(MarkingAuditLoggingHelper, _super);
    /**
     * Constructor
     */
    function MarkingAuditLoggingHelper() {
        _super.call(this, logCategory.MARKING_STYLE);
    }
    /**
     * Log marking activity
     * @param keyUsage
     * @param markButtonUsage
     * @param responseId
     */
    MarkingAuditLoggingHelper.prototype.logActiveMarkingActionCount = function (keyUsage, markButtonUsage, responseId) {
        this.logHelper.logEventOnMarking(keyUsage, markButtonUsage, responseId);
    };
    /**
     * Log all mark entry actions.
     * @param reason
     * @param activity
     * @param markGroupId
     * @param oldMark
     * @param newMark
     * @param markSchemeId
     * @param isNonNumeric
     * @param isMBQ
     */
    MarkingAuditLoggingHelper.prototype.logMarkEntryAction = function (reason, activity, markGroupId, oldMark, newMark, markSchemeId, isNonNumeric, isMBQ) {
        var logActionObj = {
            'Reason': reason,
            'Activity': activity,
            'MarkGroupId': markGroupId,
            'OldMark': oldMark,
            'NewMark': newMark,
            'MarkSchemeId': markSchemeId,
            'IsNonNumeric': isNonNumeric,
            'IsMBQ': isMBQ
        };
        var result = this.formatInputAction(logActionObj);
        this.saveAuditLog(result, false);
    };
    /**
     * Log annotation update actions based on the reset and assigining mark using MBA.
     * @param reason
     * @param activity
     * @param markGroupId
     * @param markSchemeId
     * @param isNonNumeric
     * @param isMBQ
     * @param annotationCount
     */
    MarkingAuditLoggingHelper.prototype.logMarkEntryAnnotationUpateAction = function (reason, activity, markGroupId, markSchemeId, isNonNumeric, isMBQ, annotationCount) {
        var logActionObj = {
            'Reason': reason,
            'Activity': activity,
            'MarkGroupId': markGroupId,
            'MarkSchemeId': markSchemeId,
            'IsNonNumeric': isNonNumeric,
            'IsMBQ': isMBQ,
            'annotationCount': annotationCount
        };
        var result = this.formatInputAction(logActionObj);
        this.saveAuditLog(result, false);
    };
    /**
     * Log mark saving actions.
     * @param isMarkUpdatedWithoutNavigation
     * @param isNextResponse
     * @param isUpdateUsedInTotalOnly
     * @param isUpdateMarkingProgress
     * @param markDetails
     */
    MarkingAuditLoggingHelper.prototype.logMarkSaveAction = function (reason, activity, isMarkUpdatedWithoutNavigation, isNextResponse, isUpdateUsedInTotalOnly, isUpdateMarkingProgress, markDetails) {
        var result = this.formatInputAction(reason, activity, isMarkUpdatedWithoutNavigation, isNextResponse, isUpdateUsedInTotalOnly, isUpdateMarkingProgress, markDetails);
        this.saveAuditLog(result, false);
    };
    /**
     * Log annotation modified action details.
     * @param reason
     * @param activity
     * @param annotation
     * @param markGroupId
     * @param markSchemeId
     */
    MarkingAuditLoggingHelper.prototype.logAnnotationModifiedAction = function (reason, activity, annotation, markGroupId, markSchemeId) {
        var result = this.formatInputAction(reason, activity, annotation, markGroupId, markSchemeId);
        this.saveAuditLog(result, false);
    };
    /**
     * Log users current log status is mbq or mbc
     * @param reason
     * @param activity
     * @param isMBQSelected
     */
    MarkingAuditLoggingHelper.prototype.logMBQChangeAction = function (reason, activity, isMBQSelected) {
        var logActionObj = {
            'Reason': reason,
            'Activity': activity,
            'IsMBQSelected': isMBQSelected
        };
        var result = this.formatInputAction(logActionObj);
        this.saveAuditLog(result, false);
    };
    /**
     * Log comment side view state changes made by marker
     * @param reason
     * @param activity
     * @param commentsideviewEnabled
     */
    MarkingAuditLoggingHelper.prototype.logCommentSideViewStateChanges = function (reason, activity, commentsideviewEnabled, markGroupId) {
        var logActionObj = {
            'Reason': reason,
            'Activity': activity,
            'CommentSideViewEnabled': commentsideviewEnabled,
            'MarkGroupId': markGroupId
        };
        var result = this.formatInputAction(logActionObj);
        this.saveAuditLog(result, false);
    };
    /**
     * Log save marks and annoataion actions.
     * @param reason
     * @param activity
     * @param isBackGround
     * @param isApplicationOnline
     * @param priority
     * @param saveTriggerPoint
     * @param saveMarkArg
     */
    MarkingAuditLoggingHelper.prototype.logSaveMarksAndAnnoatation = function (reason, activity, isBackGround, isApplicationOnline, priority, saveTriggerPoint, saveMarkArg) {
        var logActionObj = {
            'Reason': reason,
            'Activity': activity,
            'isBackGround': isBackGround,
            'isApplicationOnline': isApplicationOnline,
            'priority': priority,
            'saveTriggerPoint': saveTriggerPoint,
            'saveMarkArg': saveMarkArg
        };
        var result = this.formatInputAction(logActionObj);
        this.saveAuditLog(result, false);
    };
    return MarkingAuditLoggingHelper;
}(loggerBase));
module.exports = MarkingAuditLoggingHelper;
//# sourceMappingURL=markingauditlogginghelper.js.map