import enums = require('../enums');
import markingHelper = require('../../../utility/markscheme/markinghelper');
import markingActionCreator = require('../../../actions/marking/markingactioncreator');
import Warning = require('../../response/typings/warning');
import combinedWarningMessage = require('../../response/typings/combinedwarningmessage');
import worklistStore = require('../../../stores/worklist/workliststore');
import localeStore = require('../../../stores/locale/localestore');
import markingStore = require('../../../stores/marking/markingstore');
import standardisationSetupStore = require('../../../stores/standardisationsetup/standardisationsetupstore');

/**
 * Class for combined warning message popup displaying logics
 */
class ResponseErrorDialogHelper {

    /**
     * return the warning messages with priority as an array of warnings
     */
    public static WarningMessageWithPriority(responseNavigationFailureReasons: Array<enums.ResponseNavigateFailureReason>): Array<Warning> {
        let warningMessages: Array<Warning> = new Array<Warning>();
        responseNavigationFailureReasons.forEach((navigationFailureReason: enums.ResponseNavigateFailureReason) => {
            let warningMessage: Warning = new Warning();
            warningMessage.warning = navigationFailureReason;
            warningMessage.priority = this.getWarningMessagePriority(navigationFailureReason);
            warningMessage.message = this.getWarningMessageContent(navigationFailureReason);
            warningMessage.id = this.getWarningMessageId(navigationFailureReason);
            warningMessages.push(warningMessage);
        });
        warningMessages.sort((warning1: Warning, warning2: Warning) => { return warning1.priority - warning2.priority; });
        return warningMessages;
    }

    /**
     * get the combined warning message
     * @param navigateTo
     */
    public static getCombinedWarningMessage(navigateTo: enums.SaveAndNavigate, warnings: Array<enums.ResponseNavigateFailureReason>) {
        let warningMessages: Array<Warning> = this.WarningMessageWithPriority(warnings);
        let combinedWarning: combinedWarningMessage = new combinedWarningMessage();
        let responseNavigateFailureReason: enums.ResponseNavigateFailureReason;
        // check if it has NR related warning messages as  first priority ,then perform an action if it has.
        if ((warningMessages[0].warning === enums.ResponseNavigateFailureReason.AllMarkedAsNR
            || warningMessages[0].warning === enums.ResponseNavigateFailureReason.AtleastOneNRWithoutOptionality
            || warningMessages[0].warning === enums.ResponseNavigateFailureReason.AtleastOneNRWithOptionalityNotUsedInTotal
            || (warningMessages.length > 2 && warningMessages[0].warning
                === enums.ResponseNavigateFailureReason.AtleastOneNRWithOptionalityUsedInTotal
                //chance for coming 2 NR pop up warning together,so need to do below action if it has.
                && warningMessages[1].warning !== enums.ResponseNavigateFailureReason.AtleastOneNRWithOptionalityNotUsedInTotal)
            || warningMessages[0].warning === enums.ResponseNavigateFailureReason.AtleastOneNRWithOptionalityNotUsedInTotal)
            && warningMessages.length > 1) {
            responseNavigateFailureReason = warningMessages[1].warning;
        } else if (warningMessages.length > 2 &&
            warningMessages[1].warning === enums.ResponseNavigateFailureReason.AtleastOneNRWithOptionalityNotUsedInTotal) {
            responseNavigateFailureReason = warningMessages[2].warning;
        } else {
            // if it has no NR related pop up , the take the first priority for performing action.
            responseNavigateFailureReason = warningMessages[0].warning;
        }
        combinedWarning.warningType = this.getCombinedWarningMessageWarningType(navigateTo, responseNavigateFailureReason);
        combinedWarning.header = this.combinedWarningMessageHeader(combinedWarning.warningType);
        combinedWarning.content = this.combinedWarningMessageContent(combinedWarning.warningType);
        combinedWarning.primaryButton = this.getCombinedWarningMessagePrimaryButton(responseNavigateFailureReason,
            combinedWarning.warningType);
        combinedWarning.secondaryButton = this.getCombinedWarningMessageSecondaryButton(responseNavigateFailureReason,
            combinedWarning.warningType);
        combinedWarning.responseNavigateFailureReasons = warningMessages;

        return combinedWarning;
    }

    /**
     * get the id for each warning messages
     * @param message
     */
    private static getWarningMessageId(message: enums.ResponseNavigateFailureReason) {
        let messageId: string;
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
    }

    /**
     * get the combined warning message popup header
     */
    private static combinedWarningMessageHeader(warningType: enums.WarningType) {
        let messageHeader: string;
        if (warningType === enums.WarningType.SubmitResponse &&
            standardisationSetupStore.instance.selectedStandardisationSetupWorkList === enums.StandardisationSetup.ProvisionalResponse) {
            messageHeader = localeStore.instance.TranslateText('marking.response.share-response-warning-dialog.header');
        } else if (warningType === enums.WarningType.SubmitResponse) {
            messageHeader = localeStore.instance.TranslateText('marking.response.submit-response-warning-dialog.header');
        } else {
            messageHeader = localeStore.instance.TranslateText('marking.response.leaving-response-warning-dialog.header');
        }

        return messageHeader;
    }

    /**
     * get the combined warning message popup content
     */
    private static combinedWarningMessageContent(warningType: enums.WarningType) {
        let messageContent: string;
        if (warningType === enums.WarningType.SubmitResponse &&
            standardisationSetupStore.instance.selectedStandardisationSetupWorkList === enums.StandardisationSetup.ProvisionalResponse) {
            messageContent = localeStore.instance.TranslateText('marking.response.share-response-warning-dialog.body');
        } else if (warningType === enums.WarningType.SubmitResponse) {
            messageContent = localeStore.instance.TranslateText('marking.response.submit-response-warning-dialog.body');
        } else {
            messageContent = localeStore.instance.TranslateText('marking.response.leaving-response-warning-dialog.body');
        }

        return messageContent;
    }

    /**
     * get the combined warning message popup primary button
     */
    private static getCombinedWarningMessagePrimaryButton(failureReasonToAction: enums.ResponseNavigateFailureReason,
        warningType: enums.WarningType) {
        let primaryButton: string;
        if (warningType === enums.WarningType.SubmitResponse &&
            standardisationSetupStore.instance.selectedStandardisationSetupWorkList === enums.StandardisationSetup.ProvisionalResponse) {
            primaryButton = localeStore.instance.TranslateText('marking.response.share-response-warning-dialog.share-response-button');
        } else if (warningType === enums.WarningType.SubmitResponse) {
            primaryButton = localeStore.instance.TranslateText
                ('marking.response.submit-response-warning-dialog.submit-response-button');
        } else {
            if (this.doNavigateFromResponse(failureReasonToAction)) {
                primaryButton = localeStore.instance.TranslateText
                    ('marking.response.leaving-response-warning-dialog.ok-button');
            } else {
                primaryButton = localeStore.instance.TranslateText
                    ('marking.response.leaving-response-warning-dialog.leave-response-button');
            }
        }

        return primaryButton;
    }

    /**
     * get the combined warning message popup secondary button
     */
    private static getCombinedWarningMessageSecondaryButton(failureReasonToAction: enums.ResponseNavigateFailureReason,
        warningType: enums.WarningType) {
        let secondaryButton: string;
        if (warningType === enums.WarningType.SubmitResponse) {
            secondaryButton = localeStore.instance.TranslateText
                ('marking.response.submit-response-warning-dialog.stay-in-response-button');
        } else {
            if (this.doNavigateFromResponse(failureReasonToAction)) {
                secondaryButton = '';
            } else {
                secondaryButton = localeStore.instance.TranslateText
                    ('marking.response.leaving-response-warning-dialog.stay-in-response-button');
            }
        }

        return secondaryButton;
    }

    /**
     * returns true if prevent leaving from response in grace period
     */
    private static doNavigateFromResponse(failureReasonToAction: enums.ResponseNavigateFailureReason): boolean {
        let preventLeaving: boolean = false;
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
    }

    /**
     * get the warning message type
     * @param navigateTo
     * @param failureReasonToAction
     */
    private static getCombinedWarningMessageWarningType(navigateTo: enums.SaveAndNavigate,
        failureReasonToAction: enums.ResponseNavigateFailureReason) {
        let warningType: enums.WarningType;

        if (navigateTo === enums.SaveAndNavigate.submit) {
            warningType = enums.WarningType.SubmitResponse;
        } else if (this.doNavigateFromResponse(failureReasonToAction)) {
            warningType = enums.WarningType.PreventLeaveInGraceResponse;
        } else {
            warningType = enums.WarningType.LeaveResponse;
        }

        return warningType;
    }

    /**
     * get the priority of response warning message
     * @param responseNavigationFailureReason
     */
    private static getWarningMessagePriority(responseNavigationFailureReason: enums.ResponseNavigateFailureReason):
        enums.ResponseWarningPriority {
        let warningPriority: enums.ResponseWarningPriority = undefined;

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
    }

    /**
     * get the content of warning message
     * @param responseNavigationFailureReason
     */
    private static getWarningMessageContent(responseNavigationFailureReason: enums.ResponseNavigateFailureReason):
        string {
        let warningMessage: string;

        switch (responseNavigationFailureReason) {
            case enums.ResponseNavigateFailureReason.AllPagesNotAnnotated:
                warningMessage = localeStore.instance.TranslateText
                    ('marking.response.leaving-or-submitting-response-warnings.not-all-pages-annotated');
                break;
            case enums.ResponseNavigateFailureReason.AllPagesNotAnnotatedInGrace:
                warningMessage = localeStore.instance.TranslateText
                    ('marking.response.leaving-or-submitting-response-warnings.not-all-pages-annotated-in-grace');
                break;
            case enums.ResponseNavigateFailureReason.MarkChangeReasonNeeded:
                if (worklistStore.instance.getResponseMode === enums.ResponseMode.pending) {
                    warningMessage = localeStore.instance.TranslateText
                        ('marking.response.leaving-or-submitting-response-warnings.eur-mark-change-reason-not-applied-in-grace');
                } else {
                    warningMessage = localeStore.instance.TranslateText
                        ('marking.response.leaving-or-submitting-response-warnings.eur-mark-change-reason-not-applied');
                }
                break;
            case enums.ResponseNavigateFailureReason.SuperVisorRemarkDecisionNeeded:
                if (worklistStore.instance.getResponseMode === enums.ResponseMode.pending) {
                    warningMessage = localeStore.instance.TranslateText
                        ('marking.response.leaving-or-submitting-response-warnings.supervisor-remark-decision-not-applied-in-grace');
                } else {
                    warningMessage = localeStore.instance.TranslateText
                        ('marking.response.leaving-or-submitting-response-warnings.supervisor-remark-decision-not-applied');
                }
                break;
            case enums.ResponseNavigateFailureReason.UnSentMessage:
                warningMessage = localeStore.instance.TranslateText
                    ('marking.response.leaving-or-submitting-response-warnings.message-will-be-discarded');
                break;
            case enums.ResponseNavigateFailureReason.UnSavedException:
                warningMessage = localeStore.instance.TranslateText
                    ('marking.response.leaving-or-submitting-response-warnings.exception-will-be-discarded');
                break;
            case enums.ResponseNavigateFailureReason.AllSlaosNotAnnotated:
                warningMessage = localeStore.instance.TranslateText
                    ('marking.response.leaving-or-submitting-response-warnings.not-all-slaos-annotated');
                break;
            case enums.ResponseNavigateFailureReason.AllSlaosNotAnnotatedInGrace:
                warningMessage = localeStore.instance.TranslateText
                    ('marking.response.leaving-or-submitting-response-warnings.not-all-slaos-annotated-in-grace');
                break;
            case enums.ResponseNavigateFailureReason.AllMarkedAsNR:
                warningMessage = localeStore.instance.TranslateText
                    ('marking.response.leaving-or-submitting-response-warnings.all-questions-marked-nr');
                break;
            case enums.ResponseNavigateFailureReason.AtleastOneNRWithoutOptionality:
                warningMessage = localeStore.instance.TranslateText
                    ('marking.response.leaving-or-submitting-response-warnings.questions-marked-nr');
                break;
            case enums.ResponseNavigateFailureReason.AtleastOneNRWithOptionalityUsedInTotal:
                warningMessage = localeStore.instance.TranslateText
                    ('marking.response.leaving-or-submitting-response-warnings.questions-marked-nr-used-in-total');
                break;
            case enums.ResponseNavigateFailureReason.AtleastOneNRWithOptionalityNotUsedInTotal:
                warningMessage = localeStore.instance.TranslateText
                    ('marking.response.leaving-or-submitting-response-warnings.questions-marked-not-used-in-total');
                break;
            case enums.ResponseNavigateFailureReason.UnSavedEnhancedOffPageComment:
                warningMessage = localeStore.instance.TranslateText
                ('marking.response.leaving-or-submitting-response-warnings.enhanced-off-page-comment-will-be-discarded');
                break;
            case enums.ResponseNavigateFailureReason.NotAllFilesViewed:
                warningMessage = localeStore.instance.TranslateText
                    ('marking.response.leaving-or-submitting-response-warnings.not-all-files-viewed');
                break;
            case enums.ResponseNavigateFailureReason.FileDownloadedOutside:
                warningMessage = localeStore.instance.TranslateText
                    ('marking.response.leaving-or-submitting-response-warnings.file-downloaded-outside');
                break;
        }
        return warningMessage;
    }

    /**
     * on click of combined warning message popup secondary button.
     * if the fist priority does not have any action,then execute the next priorty which has any action.
     */
    public static onCombinedWarningPopupAction(isLeaveResponse: boolean = false): enums.ResponseWarningPriority {
        let combinedWarningMessage = markingStore.instance.combinedWarningMessage;

        // If any unsent message while leaving response, set priority as message for resetting the message related values.
        if (isLeaveResponse) {
            for (var index = 0; index < combinedWarningMessage.responseNavigateFailureReasons.length; index++) {
                if (combinedWarningMessage.responseNavigateFailureReasons[index].priority === enums.ResponseWarningPriority.UnSentMessage) {
                    return enums.ResponseWarningPriority.UnSentMessage;
                }
            }
        }

        let firstPriority = combinedWarningMessage.responseNavigateFailureReasons[0].priority;
        let secondPriority;
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
            // if the first and second is related NR pop up then do the action specfiied in 3rd warning if any.
        } else if (secondPriority === enums.ResponseWarningPriority.AtleastOneNRWithOptionalityNotUsedInTotal) {
            return combinedWarningMessage.responseNavigateFailureReasons[2].priority;
        }
        // if dont have any NR warning popup ,then do the first priority action.
        return combinedWarningMessage.responseNavigateFailureReasons[0].priority;
    }
}

export = ResponseErrorDialogHelper;