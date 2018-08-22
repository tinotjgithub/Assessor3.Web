"use strict";
var enums = require('../enums');
var Warning = require('../../response/typings/warning');
var combinedWarningMessage = require('../../response/typings/combinedwarningmessage');
var worklistStore = require('../../../stores/worklist/workliststore');
var localeStore = require('../../../stores/locale/localestore');
var markingStore = require('../../../stores/marking/markingstore');
/**
 * Class for combined warning message popup displaying logics
 */
var ResponseErrorDialogHelper = (function () {
    function ResponseErrorDialogHelper() {
    }
    /**
     * return the warning messages with priority as an array of warnings
     */
    ResponseErrorDialogHelper.WarningMessageWithPriority = function (responseNavigationFailureReasons) {
        var _this = this;
        var warningMessages = new Array();
        responseNavigationFailureReasons.forEach(function (navigationFailureReason) {
            var warningMessage = new Warning();
            warningMessage.warning = navigationFailureReason;
            warningMessage.priority = _this.getWarningMessagePriority(navigationFailureReason);
            warningMessage.message = _this.getWarningMessageContent(navigationFailureReason);
            warningMessage.id = _this.getWarningMessageId(navigationFailureReason);
            warningMessages.push(warningMessage);
        });
        warningMessages.sort(function (warning1, warning2) { return warning1.priority - warning2.priority; });
        return warningMessages;
    };
    /**
     * get the combined warning message
     * @param navigateTo
     */
    ResponseErrorDialogHelper.getCombinedWarningMessage = function (navigateTo, warnings) {
        var warningMessages = this.WarningMessageWithPriority(warnings);
        var combinedWarning = new combinedWarningMessage();
        var responseNavigateFailureReason;
        // check if it has NR related warning messages as  first priority ,then perform an action if it has.
        if ((warningMessages[0].warning === enums.ResponseNavigateFailureReason.AllMarkedAsNR
            || warningMessages[0].warning === enums.ResponseNavigateFailureReason.AtleastOneNRWithoutOptionality
            || warningMessages[0].warning === enums.ResponseNavigateFailureReason.AtleastOneNRWithOptionalityNotUsedInTotal
            || (warningMessages.length > 2 && warningMessages[0].warning
                === enums.ResponseNavigateFailureReason.AtleastOneNRWithOptionalityUsedInTotal
                && warningMessages[1].warning !== enums.ResponseNavigateFailureReason.AtleastOneNRWithOptionalityNotUsedInTotal)
            || warningMessages[0].warning === enums.ResponseNavigateFailureReason.AtleastOneNRWithOptionalityNotUsedInTotal)
            && warningMessages.length > 1) {
            responseNavigateFailureReason = warningMessages[1].warning;
        }
        else if (warningMessages.length > 2 &&
            warningMessages[1].warning === enums.ResponseNavigateFailureReason.AtleastOneNRWithOptionalityNotUsedInTotal) {
            responseNavigateFailureReason = warningMessages[2].warning;
        }
        else {
            // if it has no NR related pop up , the take the first priority for performing action.
            responseNavigateFailureReason = warningMessages[0].warning;
        }
        combinedWarning.warningType = this.getCombinedWarningMessageWarningType(navigateTo, responseNavigateFailureReason);
        combinedWarning.header = this.combinedWarningMessageHeader(combinedWarning.warningType);
        combinedWarning.content = this.combinedWarningMessageContent(combinedWarning.warningType);
        combinedWarning.primaryButton = this.getCombinedWarningMessagePrimaryButton(responseNavigateFailureReason, combinedWarning.warningType);
        combinedWarning.secondaryButton = this.getCombinedWarningMessageSecondaryButton(responseNavigateFailureReason, combinedWarning.warningType);
        combinedWarning.responseNavigateFailureReasons = warningMessages;
        return combinedWarning;
    };
    /**
     * get the id for each warning messages
     * @param message
     */
    ResponseErrorDialogHelper.getWarningMessageId = function (message) {
        var messageId;
        switch (message) {
            case enums.ResponseNavigateFailureReason.AllPagesNotAnnotated:
            case enums.ResponseNavigateFailureReason.AllPagesNotAnnotatedInGrace:
                messageId = 'allPageNotAnnotated';
                break;
            case enums.ResponseNavigateFailureReason.MarkChangeReasonNeeded:
                messageId = 'markChangeReason';
                break;
            case enums.ResponseNavigateFailureReason.SuperVisorRemarkDecisionNeeded:
                messageId = 'superVisorRemarkDecision';
                break;
            case enums.ResponseNavigateFailureReason.UnSavedException:
                messageId = 'discardException';
                break;
            case enums.ResponseNavigateFailureReason.UnSentMessage:
                messageId = 'discardMessage';
                break;
            case enums.ResponseNavigateFailureReason.AllMarkedAsNR:
                messageId = 'allMarkedAsNR';
                break;
            case enums.ResponseNavigateFailureReason.AllSlaosNotAnnotated:
            case enums.ResponseNavigateFailureReason.AllSlaosNotAnnotatedInGrace:
                messageId = 'allSlaosNotAnnotated';
                break;
            case enums.ResponseNavigateFailureReason.AtleastOneNRWithoutOptionality:
                messageId = 'atleastOneNRWithoutOptionality';
                break;
            case enums.ResponseNavigateFailureReason.AtleastOneNRWithOptionalityUsedInTotal:
                messageId = 'atleastOneNRWithOptionalityUsedInTotal';
                break;
            case enums.ResponseNavigateFailureReason.AtleastOneNRWithOptionalityNotUsedInTotal:
                messageId = 'atleastOneNRWithOptionalityNotUsedInTotal';
                break;
            case enums.ResponseNavigateFailureReason.UnSavedEnhancedOffPageComment:
                messageId = 'unSavedEnhancedOffPageComment';
                break;
            case enums.ResponseNavigateFailureReason.NotAllFilesViewed:
                messageId = 'notAllFilesViewed';
                break;
            case enums.ResponseNavigateFailureReason.FileDownloadedOutside:
                messageId = 'fileDownloadedOutside';
                break;
        }
        return messageId;
    };
    /**
     * get the combined warning message popup header
     */
    ResponseErrorDialogHelper.combinedWarningMessageHeader = function (warningType) {
        var messageHeader;
        if (warningType === enums.WarningType.SubmitResponse) {
            messageHeader = localeStore.instance.TranslateText('marking.response.submit-response-warning-dialog.header');
        }
        else {
            messageHeader = localeStore.instance.TranslateText('marking.response.leaving-response-warning-dialog.header');
        }
        return messageHeader;
    };
    /**
     * get the combined warning message popup content
     */
    ResponseErrorDialogHelper.combinedWarningMessageContent = function (warningType) {
        var messageContent;
        if (warningType === enums.WarningType.SubmitResponse) {
            messageContent = localeStore.instance.TranslateText('marking.response.submit-response-warning-dialog.body');
        }
        else {
            messageContent = localeStore.instance.TranslateText('marking.response.leaving-response-warning-dialog.body');
        }
        return messageContent;
    };
    /**
     * get the combined warning message popup primary button
     */
    ResponseErrorDialogHelper.getCombinedWarningMessagePrimaryButton = function (failureReasonToAction, warningType) {
        var primaryButton;
        if (warningType === enums.WarningType.SubmitResponse) {
            primaryButton = localeStore.instance.TranslateText('marking.response.submit-response-warning-dialog.submit-response-button');
        }
        else {
            if (this.doNavigateFromResponse(failureReasonToAction)) {
                primaryButton = localeStore.instance.TranslateText('marking.response.leaving-response-warning-dialog.ok-button');
            }
            else {
                primaryButton = localeStore.instance.TranslateText('marking.response.leaving-response-warning-dialog.leave-response-button');
            }
        }
        return primaryButton;
    };
    /**
     * get the combined warning message popup secondary button
     */
    ResponseErrorDialogHelper.getCombinedWarningMessageSecondaryButton = function (failureReasonToAction, warningType) {
        var secondaryButton;
        if (warningType === enums.WarningType.SubmitResponse) {
            secondaryButton = localeStore.instance.TranslateText('marking.response.submit-response-warning-dialog.stay-in-response-button');
        }
        else {
            if (this.doNavigateFromResponse(failureReasonToAction)) {
                secondaryButton = '';
            }
            else {
                secondaryButton = localeStore.instance.TranslateText('marking.response.leaving-response-warning-dialog.stay-in-response-button');
            }
        }
        return secondaryButton;
    };
    /**
     * returns true if prevent leaving from response in grace period
     */
    ResponseErrorDialogHelper.doNavigateFromResponse = function (failureReasonToAction) {
        var preventLeaving = false;
        if (worklistStore.instance.getResponseMode === enums.ResponseMode.pending) {
            switch (failureReasonToAction) {
                case enums.ResponseNavigateFailureReason.AllPagesNotAnnotatedInGrace:
                case enums.ResponseNavigateFailureReason.AllSlaosNotAnnotatedInGrace:
                case enums.ResponseNavigateFailureReason.MarkChangeReasonNeeded:
                case enums.ResponseNavigateFailureReason.SuperVisorRemarkDecisionNeeded:
                    preventLeaving = true;
                    break;
            }
        }
        return preventLeaving;
    };
    /**
     * get the warning message type
     * @param navigateTo
     * @param failureReasonToAction
     */
    ResponseErrorDialogHelper.getCombinedWarningMessageWarningType = function (navigateTo, failureReasonToAction) {
        var warningType;
        if (navigateTo === enums.SaveAndNavigate.submit) {
            warningType = enums.WarningType.SubmitResponse;
        }
        else if (this.doNavigateFromResponse(failureReasonToAction)) {
            warningType = enums.WarningType.PreventLeaveInGraceResponse;
        }
        else {
            warningType = enums.WarningType.LeaveResponse;
        }
        return warningType;
    };
    /**
     * get the priority of response warning message
     * @param responseNavigationFailureReason
     */
    ResponseErrorDialogHelper.getWarningMessagePriority = function (responseNavigationFailureReason) {
        var warningPriority = undefined;
        switch (responseNavigationFailureReason) {
            case enums.ResponseNavigateFailureReason.AllPagesNotAnnotated:
            case enums.ResponseNavigateFailureReason.AllPagesNotAnnotatedInGrace:
                warningPriority = enums.ResponseWarningPriority.AllPagesNotAnnotated;
                break;
            case enums.ResponseNavigateFailureReason.AllSlaosNotAnnotated:
            case enums.ResponseNavigateFailureReason.AllSlaosNotAnnotatedInGrace:
                warningPriority = enums.ResponseWarningPriority.NotAllSLAOsAnnotated;
                break;
            case enums.ResponseNavigateFailureReason.SuperVisorRemarkDecisionNeeded:
                warningPriority = enums.ResponseWarningPriority.SuperVisorRemarkDecisionNeeded;
                break;
            case enums.ResponseNavigateFailureReason.MarkChangeReasonNeeded:
                warningPriority = enums.ResponseWarningPriority.MarkChangeReasonNeeded;
                break;
            case enums.ResponseNavigateFailureReason.UnSentMessage:
                warningPriority = enums.ResponseWarningPriority.UnSentMessage;
                break;
            case enums.ResponseNavigateFailureReason.UnSavedException:
                warningPriority = enums.ResponseWarningPriority.UnSavedException;
                break;
            case enums.ResponseNavigateFailureReason.AllMarkedAsNR:
                warningPriority = enums.ResponseWarningPriority.AllMarkedAsNR;
                break;
            case enums.ResponseNavigateFailureReason.AtleastOneNRWithoutOptionality:
                warningPriority = enums.ResponseWarningPriority.AtleastOneNRWithoutOptionality;
                break;
            case enums.ResponseNavigateFailureReason.AtleastOneNRWithOptionalityUsedInTotal:
                warningPriority = enums.ResponseWarningPriority.AtleastOneNRWithOptionalityUsedInTotal;
                break;
            case enums.ResponseNavigateFailureReason.AtleastOneNRWithOptionalityNotUsedInTotal:
                warningPriority = enums.ResponseWarningPriority.AtleastOneNRWithOptionalityNotUsedInTotal;
                break;
            case enums.ResponseNavigateFailureReason.UnSavedEnhancedOffPageComment:
                warningPriority = enums.ResponseWarningPriority.UnSavedEnhancedOffPageComment;
                break;
            case enums.ResponseNavigateFailureReason.NotAllFilesViewed:
                warningPriority = enums.ResponseWarningPriority.NotAllFilesViewed;
                break;
            case enums.ResponseNavigateFailureReason.FileDownloadedOutside:
                warningPriority = enums.ResponseWarningPriority.FileDownloadedOutside;
                break;
        }
        return warningPriority;
    };
    /**
     * get the content of warning message
     * @param responseNavigationFailureReason
     */
    ResponseErrorDialogHelper.getWarningMessageContent = function (responseNavigationFailureReason) {
        var warningMessage;
        switch (responseNavigationFailureReason) {
            case enums.ResponseNavigateFailureReason.AllPagesNotAnnotated:
                warningMessage = localeStore.instance.TranslateText('marking.response.leaving-or-submitting-response-warnings.not-all-pages-annotated');
                break;
            case enums.ResponseNavigateFailureReason.AllPagesNotAnnotatedInGrace:
                warningMessage = localeStore.instance.TranslateText('marking.response.leaving-or-submitting-response-warnings.not-all-pages-annotated-in-grace');
                break;
            case enums.ResponseNavigateFailureReason.MarkChangeReasonNeeded:
                if (worklistStore.instance.getResponseMode === enums.ResponseMode.pending) {
                    warningMessage = localeStore.instance.TranslateText('marking.response.leaving-or-submitting-response-warnings.eur-mark-change-reason-not-applied-in-grace');
                }
                else {
                    warningMessage = localeStore.instance.TranslateText('marking.response.leaving-or-submitting-response-warnings.eur-mark-change-reason-not-applied');
                }
                break;
            case enums.ResponseNavigateFailureReason.SuperVisorRemarkDecisionNeeded:
                if (worklistStore.instance.getResponseMode === enums.ResponseMode.pending) {
                    warningMessage = localeStore.instance.TranslateText('marking.response.leaving-or-submitting-response-warnings.supervisor-remark-decision-not-applied-in-grace');
                }
                else {
                    warningMessage = localeStore.instance.TranslateText('marking.response.leaving-or-submitting-response-warnings.supervisor-remark-decision-not-applied');
                }
                break;
            case enums.ResponseNavigateFailureReason.UnSentMessage:
                warningMessage = localeStore.instance.TranslateText('marking.response.leaving-or-submitting-response-warnings.message-will-be-discarded');
                break;
            case enums.ResponseNavigateFailureReason.UnSavedException:
                warningMessage = localeStore.instance.TranslateText('marking.response.leaving-or-submitting-response-warnings.exception-will-be-discarded');
                break;
            case enums.ResponseNavigateFailureReason.AllSlaosNotAnnotated:
                warningMessage = localeStore.instance.TranslateText('marking.response.leaving-or-submitting-response-warnings.not-all-slaos-annotated');
                break;
            case enums.ResponseNavigateFailureReason.AllSlaosNotAnnotatedInGrace:
                warningMessage = localeStore.instance.TranslateText('marking.response.leaving-or-submitting-response-warnings.not-all-slaos-annotated-in-grace');
                break;
            case enums.ResponseNavigateFailureReason.AllMarkedAsNR:
                warningMessage = localeStore.instance.TranslateText('marking.response.leaving-or-submitting-response-warnings.all-questions-marked-nr');
                break;
            case enums.ResponseNavigateFailureReason.AtleastOneNRWithoutOptionality:
                warningMessage = localeStore.instance.TranslateText('marking.response.leaving-or-submitting-response-warnings.questions-marked-nr');
                break;
            case enums.ResponseNavigateFailureReason.AtleastOneNRWithOptionalityUsedInTotal:
                warningMessage = localeStore.instance.TranslateText('marking.response.leaving-or-submitting-response-warnings.questions-marked-nr-used-in-total');
                break;
            case enums.ResponseNavigateFailureReason.AtleastOneNRWithOptionalityNotUsedInTotal:
                warningMessage = localeStore.instance.TranslateText('marking.response.leaving-or-submitting-response-warnings.questions-marked-not-used-in-total');
                break;
            case enums.ResponseNavigateFailureReason.UnSavedEnhancedOffPageComment:
                warningMessage = localeStore.instance.TranslateText('marking.response.leaving-or-submitting-response-warnings.enhanced-off-page-comment-will-be-discarded');
                break;
            case enums.ResponseNavigateFailureReason.NotAllFilesViewed:
                warningMessage = localeStore.instance.TranslateText('marking.response.leaving-or-submitting-response-warnings.not-all-files-viewed');
                break;
            case enums.ResponseNavigateFailureReason.FileDownloadedOutside:
                warningMessage = localeStore.instance.TranslateText('marking.response.leaving-or-submitting-response-warnings.file-downloaded-outside');
                break;
        }
        return warningMessage;
    };
    /**
     * on click of combined warning message popup secondary button.
     * if the fist priority does not have any action,then execute the next priorty which has any action.
     */
    ResponseErrorDialogHelper.onCombinedWarningPopupAction = function (isLeaveResponse) {
        if (isLeaveResponse === void 0) { isLeaveResponse = false; }
        var combinedWarningMessage = markingStore.instance.combinedWarningMessage;
        // If any unsent message while leaving response, set priority as message for resetting the message related values.
        if (isLeaveResponse) {
            for (var index = 0; index < combinedWarningMessage.responseNavigateFailureReasons.length; index++) {
                if (combinedWarningMessage.responseNavigateFailureReasons[index].priority === enums.ResponseWarningPriority.UnSentMessage) {
                    return enums.ResponseWarningPriority.UnSentMessage;
                }
            }
        }
        var firstPriority = combinedWarningMessage.responseNavigateFailureReasons[0].priority;
        var secondPriority;
        if (combinedWarningMessage.responseNavigateFailureReasons.length > 2) {
            secondPriority = combinedWarningMessage.responseNavigateFailureReasons[1].priority;
        }
        // if the first pripority and second priority are related NR pop up and we have any warning related to perform any action
        //  then perform that action according to the popup message.
        if ((firstPriority === enums.ResponseWarningPriority.AllMarkedAsNR
            || firstPriority === enums.ResponseWarningPriority.AtleastOneNRWithoutOptionality
            || (firstPriority === enums.ResponseWarningPriority.AtleastOneNRWithOptionalityUsedInTotal
                && secondPriority !== enums.ResponseWarningPriority.AtleastOneNRWithOptionalityNotUsedInTotal)
            || firstPriority === enums.ResponseWarningPriority.AtleastOneNRWithOptionalityNotUsedInTotal)
            && combinedWarningMessage.responseNavigateFailureReasons.length > 1) {
            return combinedWarningMessage.responseNavigateFailureReasons[1].priority;
        }
        else if (secondPriority === enums.ResponseWarningPriority.AtleastOneNRWithOptionalityNotUsedInTotal) {
            return combinedWarningMessage.responseNavigateFailureReasons[2].priority;
        }
        // if dont have any NR warning popup ,then do the first priority action.
        return combinedWarningMessage.responseNavigateFailureReasons[0].priority;
    };
    return ResponseErrorDialogHelper;
}());
module.exports = ResponseErrorDialogHelper;
//# sourceMappingURL=responseerrordialoghelper.js.map