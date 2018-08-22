import React = require('react');
import enums = require('../enums');
import ConfirmationDialog = require('../confirmationdialog');
import GenericDialog = require('../genericdialog');
import MultiOptionConfirmationDialog = require('../multioptionconfirmationdialog');
import localeStore = require('../../../stores/locale/localestore');
import combinedWarningMessage = require('../../response/typings/combinedwarningmessage');
import CombinedWarningPopup = require('../../utility/responseerrordialog');
import responseContainerPropertyBase = require('./responsecontainerpropertybase');
import MarkConfirmationPopup = require('../../markschemestructure/markconfirmationpopup');
import LinkToPagePopup = require('../../response/responsescreen/linktopage/linktopagepopup');
import ActionException = require('../../exception/actionexception');
import markerOperationModeFactory = require('../../utility/markeroperationmode/markeroperationmodefactory');
import qigStore = require('../../../stores/qigselector/qigstore');
import targetSummaryStore = require('../../../stores/worklist/targetsummarystore');
import stringHelper = require('../../../utility/generic/stringhelper');
import standardisationSetupStore = require('../../../stores/standardisationsetup/standardisationsetupstore');

/**
 * helper class for response container
 */
class ResponseContainerPopupHelper {
    protected responseContainerProperty: any;
    protected renderedOn: number;
    protected selectedLanguage: string;
    protected responseViewMode: enums.ResponseViewMode;
    protected isExceptionPanelVisible: boolean;

    /**
     * constructor
     * @param _responseContainerPropertyBase
     * @param renderedOn
     * @param selectedLanguage
     * @param _responseViewMode
     */
    constructor(_responseContainerPropertyBase: responseContainerPropertyBase, renderedOn: number, selectedLanguage: string,
        _responseViewMode: enums.ResponseViewMode) {

        this.responseContainerProperty = _responseContainerPropertyBase;
        this.renderedOn = renderedOn;
        this.selectedLanguage = selectedLanguage;
        this.responseViewMode = _responseViewMode;
    }

    /**
     * this is to set the protected variables used by the helpers
     */
    public setHelperVariables(_responseContainerPropertyBase: responseContainerPropertyBase, renderedOn: number,
        selectedLanguage: string, _responseViewMode: enums.ResponseViewMode) {
        this.responseContainerProperty = _responseContainerPropertyBase;
        this.renderedOn = renderedOn;
        this.selectedLanguage = selectedLanguage;
        this.responseViewMode = _responseViewMode;
    }

    /**
     * mark Confirmation
     */
    public markConfirmation(): JSX.Element {
        let componentProps = {
            id: 'mark_confirmation_popup',
            key: 'mark_confirmation_popup'
        };

        return React.createElement(MarkConfirmationPopup, componentProps);
    }

    /**
     * Delete message confirmation popup
     * @param isDeleteMessagePopupVisible
     * @param onYesButtonDeleteMessageClick
     * @param onNoButtonDeleteMessageClick
     */
    public deleteMessage(isDeleteMessagePopupVisible: boolean,
        onYesButtonDeleteMessageClick: Function,
        onNoButtonDeleteMessageClick: Function) {
        let componentProps = {
            id: 'deleteMessage',
            key: 'deleteMessage',
            content: localeStore.instance.TranslateText('messaging.message-lists.delete-message-dialog.body'),
            header: localeStore.instance.TranslateText('messaging.message-lists.delete-message-dialog.header'),
            displayPopup: isDeleteMessagePopupVisible,
            isCheckBoxVisible: false,
            noButtonText: localeStore.instance.TranslateText('messaging.message-lists.delete-message-dialog.no-button'),
            yesButtonText: localeStore.instance.TranslateText('messaging.message-lists.delete-message-dialog.yes-button'),
            onYesClick: onYesButtonDeleteMessageClick,
            onNoClick: onNoButtonDeleteMessageClick,
            dialogType: enums.PopupDialogType.MbCReturnToWorklistConfirmation,
            isKeyBoardSupportEnabled: true
        };
        return React.createElement(ConfirmationDialog, componentProps);
    }

    /**
     * Zoning Exception Warning popup
     * @param isZoningExceptionWarningFlagSet
     * @param displayZoningExceptionWarningPopup
     * @param closeZoningExceptionWarningPopup
     */
    public zoningExceptionWarning(isZoningExceptionWarningPopupVisible: boolean,
        closeZoningExceptionWarningPopup: Function) {
        let componentProps = {
            content: localeStore.instance.TranslateText('marking.response.zoning-warning-dialog.body'),
            header: localeStore.instance.TranslateText('marking.response.zoning-warning-dialog.header'),
            displayPopup: isZoningExceptionWarningPopupVisible,
            okButtonText: localeStore.instance.TranslateText('marking.response.zoning-warning-dialog.ok-button'),
            onOkClick: closeZoningExceptionWarningPopup,
            id: 'zoningExceptionWarning',
            key: 'zoningExceptionWarning',
            popupDialogType: enums.PopupDialogType.GenericMessage
        };
        return React.createElement(GenericDialog, componentProps);
    }

    /**
     * actionExceptionPopup element
     */
    public actionExceptionPopup(): JSX.Element {
        let componentProps = {
            id: 'actionexception',
            key: 'actionexception',
            exceptionDetails: this.responseContainerProperty.exceptionDetails
        };

        return React.createElement(ActionException, componentProps);
    }

    /**
     * remark Success Message
     * @param onOkClickRemarkCreationSuccessPopup
     */
    public remarkSuccessMessage(onOkClickRemarkCreationSuccessPopup: Function) {
        let componentProps = {
            content: localeStore.instance.TranslateText('team-management.response.supervisor-remark-mark-later-confirmation-dialog.body'),
            header: localeStore.instance.TranslateText('team-management.response.supervisor-remark-mark-later-confirmation-dialog.header'),
            displayPopup: this.responseContainerProperty.isRemarkCreatedPopUpVisible,
            okButtonText: localeStore.instance.TranslateText('marking.response.invalid-mark-dialog.ok-button'),
            onOkClick: onOkClickRemarkCreationSuccessPopup,
            id: 'remarkCreatedMessage',
            key: 'remarkCreated',
            popupDialogType: enums.PopupDialogType.RemarkCreated
        };
        return React.createElement(GenericDialog, componentProps);
    }

    /**
     * remark Success Message
     * @param onOkClick 
     * @param isVisible 
     */
    public standardisationAdditionalPageMessage(onOkClick: Function, isVisible: boolean) {
        let componentProps = {
            content: localeStore.instance.TranslateText('standardisation-setup.standardisation-setup-additional-page-popup.content'),
            header: localeStore.instance.TranslateText('standardisation-setup.standardisation-setup-additional-page-popup..header'),
            displayPopup: isVisible,
            okButtonText: localeStore.instance.
                TranslateText('standardisation-setup.standardisation-setup-additional-page-popup..ok-button'),
            onOkClick: onOkClick,
            id: 'additionalPageMessage',
            key: 'additionalPage',
            popupDialogType: enums.PopupDialogType.RemarkCreated
        };
        return React.createElement(GenericDialog, componentProps);
    }

    /**
     * Candidate script unavailable popup.
     * @param onOkClick
     * @param isVisible
     * @param candidateScript
     */
    public scriptUnavaliablePopUp(onOkClick: Function, isVisible: boolean, candidateScript: string) {
        let componentProps = {
			content: stringHelper.format(localeStore.instance.TranslateText
				('standardisation-setup.standardisation-script-unavailable-popup.content'),
				[standardisationSetupStore.instance.failedMarkSchemeGroupNames]),
            header: localeStore.instance.TranslateText('standardisation-setup.standardisation-script-unavailable-popup.header'),
            displayPopup: isVisible,
            okButtonText: localeStore.instance.
                TranslateText('standardisation-setup.standardisation-script-unavailable-popup.ok-button'),
            onOkClick: onOkClick,
            id: 'scriptUnavailableMessage',
            key: 'scriptUnavailableMessage',
            popupDialogType: enums.PopupDialogType.RemarkCreated
        };
        return React.createElement(GenericDialog, componentProps);
    }

    /**
     * Whole Response Remark Confirmation Message
     * @param onWholeResponseRemarkConfirmation on WholeResponse Remark Confirmation Yes Click
     * @param onWholeResponseRemarkRejection on WholeResponse Remark Confirmation No Click
     */
    public wholeResponseRemarkConfirmationPopup(onWholeResponseRemarkConfirmation: Function,
        onWholeResponseRemarkRejection: Function, isVisible: boolean) {

        let componentProps = {
            id: 'wholeResponseRemarkConfirmationPopup',
            key: 'wholeResponseRemarkConfirmationPopup',
            content: localeStore.instance.TranslateText('team-management.response.wholeresponse-remark-confirmation-popup.content'),
            header: localeStore.instance.TranslateText('team-management.response.wholeresponse-remark-confirmation-popup.header'),
            displayPopup: isVisible,
            isCheckBoxVisible: false,
            noButtonText: localeStore.instance.
                TranslateText('team-management.response.wholeresponse-remark-confirmation-popup.no-button'),
            yesButtonText: localeStore.instance.
                TranslateText('team-management.response.wholeresponse-remark-confirmation-popup.yes-button'),
            onYesClick: onWholeResponseRemarkConfirmation,
            onNoClick: onWholeResponseRemarkRejection,
            isKeyBoardSupportEnabled: true,
            dialogType: enums.PopupDialogType.WholeResponseRemarkConfirmation
        };

        return React.createElement(ConfirmationDialog, componentProps);
    }

    /**
     * Discard Standardisation response popup
     */
    public discardStandardisationResponsePopup(onDiscardResponsePopupYesConfirmed: Function,
        onDiscardResponsePopupNoConfirmed: Function, isVisible: boolean,
    content: JSX.Element[]) {
        let componentProps = {
            content: content,
            header: localeStore.instance.TranslateText
                ('standardisation-setup.standardisation-setup-worklist.discard-response-popup.header'),
            displayPopup: isVisible,
            buttonCancelText: localeStore.instance.
                TranslateText('standardisation-setup.standardisation-setup-worklist.discard-response-popup.no-button'),
                buttonYesText: localeStore.instance.
                TranslateText('standardisation-setup.standardisation-setup-worklist.discard-response-popup.yes-button'),
                onYesClick: onDiscardResponsePopupYesConfirmed,
            onCancelClick: onDiscardResponsePopupNoConfirmed,
            buttonNoText: null,
            popupSize: enums.PopupSize.Medium,
            popupType: enums.PopUpType.Declassify,
            displayNoButton: false,
            isKeyBoardSupportEnabled: true
        };
        return React.createElement(MultiOptionConfirmationDialog, componentProps);
    }

    /**
     * Reset mark message dialog
     * @param onResetMarkYesButtonClick
     * @param onResetMarkNoButtonClick
     */
    public resetMarkMessage(onResetMarkYesButtonClick: Function, onResetMarkNoButtonClick: Function): JSX.Element {

        let componentProps = {
            id: 'resetMarkMessage',
            key: 'resetMarkMessage',
            content: this.responseContainerProperty.confirmationDialogueContent,
            header: this.responseContainerProperty.confirmationDialogueHeader,
            displayPopup: this.responseContainerProperty.isResetMarkPopupShown,
            isCheckBoxVisible: false,
            noButtonText: localeStore.instance.TranslateText('generic.logout-dialog.no-button'),
            yesButtonText: localeStore.instance.TranslateText('generic.logout-dialog.yes-button'),
            onYesClick: onResetMarkYesButtonClick,
            onNoClick: onResetMarkNoButtonClick,
            isKeyBoardSupportEnabled: true,
            dialogType: enums.PopupDialogType.LogoutConfirmation
        };
        return React.createElement(ConfirmationDialog, componentProps);
    }

    /**
     * MBC confirmation dialog
     * @param isMbQConfirmationDialogDispalying
     * @param onYesButtonClick
     * @param onNoButtonClick
     */
    public mbCConfirmationDialog(isMbQConfirmationDialogDispalying: boolean,
        onYesButtonClick: Function, onNoButtonClick: Function): JSX.Element {

        let componentProps = {
            id: 'mbCConfirmationDialog',
            key: 'mbCConfirmationDialog',
            content: localeStore.instance.TranslateText('marking.response.end-of-list-dialog.body'),
            header: localeStore.instance.TranslateText('marking.response.end-of-list-dialog.header'),
            displayPopup: isMbQConfirmationDialogDispalying,
            isCheckBoxVisible: false,
            noButtonText: localeStore.instance.TranslateText('marking.response.end-of-list-dialog.no-button'),
            yesButtonText: localeStore.instance.TranslateText('marking.response.end-of-list-dialog.yes-button'),
            onYesClick: onYesButtonClick,
            onNoClick: onNoButtonClick,
            dialogType: enums.PopupDialogType.MbCReturnToWorklistConfirmation,
            isKeyBoardSupportEnabled: true,
            renderedOn: this.renderedOn
        };
        return React.createElement(ConfirmationDialog, componentProps);
    }

    /**
     * Combined warning popup message
     * @param isCombinedWarningMessagePopupVisible
     * @param onCombinedWarningPopupPrimaryButtonClick
     * @param onCombinedWarningPopupSecondaryButtonClick
     */
    public combinedWarningPopupMessage(isCombinedWarningMessagePopupVisible: boolean,
        onCombinedWarningPopupPrimaryButtonClick: Function,
        onCombinedWarningPopupSecondaryButtonClick: Function) {
        let componentProps = {
            id: 'combinedWarningPopup',
            key: 'combinedWarningPopup',
            content: this.responseContainerProperty.combinedWarningMessages.content,
            header: this.responseContainerProperty.combinedWarningMessages.header,
            displayPopup: isCombinedWarningMessagePopupVisible,
            secondaryButtonText: this.responseContainerProperty.combinedWarningMessages.secondaryButton,
            primaryButtonText: this.responseContainerProperty.combinedWarningMessages.primaryButton,
            onPrimaryButtonClick: onCombinedWarningPopupPrimaryButtonClick,
            onSecondaryButtonClick: onCombinedWarningPopupSecondaryButtonClick,
            responseNavigateFailureReasons: this.responseContainerProperty.combinedWarningMessages.responseNavigateFailureReasons,
            warningType: this.responseContainerProperty.combinedWarningMessages.warningType
        };
        return React.createElement(CombinedWarningPopup, componentProps);
    }

    /**
     * Delete comment message
     * @param isDeleteCommentPopupVisible
     * @param onYesButtonDeleteCommentClick
     * @param onNoButtonDeleteCommentClick
     */
    public deleteCommentMessage(isDeleteCommentPopupVisible: boolean, onYesButtonDeleteCommentClick: Function,
        onNoButtonDeleteCommentClick: Function): JSX.Element {

        let componentProps = {
            id: 'deleteCommentMessage',
            key: 'deleteCommentMessage',
            content: localeStore.instance.TranslateText('marking.response.delete-comment-dialog.body'),
            header: localeStore.instance.TranslateText('marking.response.delete-comment-dialog.header'),
            displayPopup: isDeleteCommentPopupVisible,
            isCheckBoxVisible: false,
            noButtonText: localeStore.instance.TranslateText('marking.response.delete-comment-dialog.no-button'),
            yesButtonText: localeStore.instance.TranslateText('marking.response.delete-comment-dialog.yes-button'),
            onYesClick: onYesButtonDeleteCommentClick,
            onNoClick: onNoButtonDeleteCommentClick,
            dialogType: enums.PopupDialogType.MbCReturnToWorklistConfirmation,
            isKeyBoardSupportEnabled: true
        };
        return React.createElement(ConfirmationDialog, componentProps);
    }

    /**
     * Complete button dialog
     * @param isCompleteButtonDialogVisible
     * @param onYesClickOnCompleteDialog
     * @param onNoClickOnCompleteDialog
     */
    public completeButtonDialog(isCompleteButtonDialogVisible: boolean,
        onYesClickOnCompleteDialog: Function, onNoClickOnCompleteDialog: Function) {

        let componentProps = {
            id: 'completeButtonDialog',
            key: 'completeButtonDialog',
            content: localeStore.instance.TranslateText('marking.response.complete-button-dialog.body'),
            header: '',
            displayPopup: isCompleteButtonDialogVisible,
            noButtonText: localeStore.instance.TranslateText('marking.response.complete-button-dialog.no-button'),
            yesButtonText: localeStore.instance.TranslateText('marking.response.complete-button-dialog.yes-button'),
            onYesClick: onYesClickOnCompleteDialog,
            onNoClick: onNoClickOnCompleteDialog,
            isKeyBoardSupportEnabled: true,
            dialogType: enums.PopupDialogType.AllPageNotAnnotated,
            isCheckBoxVisible: undefined
        };
        return React.createElement(ConfirmationDialog, componentProps);
    }

    /**
     * Non recoverable error message dialog
     * @param onOkClickOfNonRecoverableErrorMessage
     */
    public nonRecoverableErrorMessage(onOkClickOfNonRecoverableErrorMessage: Function, isNonRecoverableErrorPopupVisible: boolean) {

        let componentProps = {
            content: this.responseContainerProperty.saveMarksAndAnnotationsErrorDialogContents.content,
            header: this.responseContainerProperty.saveMarksAndAnnotationsErrorDialogContents.header,
            multiLineContent: this.responseContainerProperty.saveMarksAndAnnotationsErrorDialogContents.tableContent,
            displayPopup: isNonRecoverableErrorPopupVisible,
            okButtonText: localeStore.instance.TranslateText('generic.error-dialog.ok-button'),
            onOkClick: onOkClickOfNonRecoverableErrorMessage,
            id: 'nonRecoverableErrorMessge',
            key: 'marksAndAnnotationsErrorMessge',
            popupDialogType: enums.PopupDialogType.NonRecoverableDetailedError
        };
        return React.createElement(GenericDialog, componentProps);
    }

    /**
     * getting mark change reason missing dialog
     * @param isDisplayingMarkChangeReasonNeededError
     * @param currentResponseMode
     * @param onStayInResponseClick
     * @param onLeaveResponseClick
     */
    public getMarkChangeReasonWarning(isDisplayingMarkChangeReasonNeededError: boolean,
        currentResponseMode: enums.ResponseMode, onStayInResponseClick: Function, onLeaveResponseClick: Function): JSX.Element {

        if (isDisplayingMarkChangeReasonNeededError && markerOperationModeFactory.operationMode.showMarkChangeReason) {
            if (currentResponseMode === enums.ResponseMode.open) {
                //return (
                //    <ConfirmationDialog
                let componentProps = {
                    id: 'markChangeReason',
                    key: 'markChangeReason',
                    isCheckBoxVisible: false,
                    content: localeStore.instance.TranslateText('assessor3.markChangeReason.dialogContentOpen'),
                    header: localeStore.instance.TranslateText('assessor3.markChangeReason.dialogTitle'),
                    displayPopup: isDisplayingMarkChangeReasonNeededError,
                    noButtonText: localeStore.instance.TranslateText('assessor3.notallpageannotated.secondary-button-contetent'),
                    yesButtonText: localeStore.instance.TranslateText('assessor3.notallpageannotated.primary-button-content'),
                    onYesClick: onStayInResponseClick,
                    onNoClick: onLeaveResponseClick,
                    isKeyBoardSupportEnabled: true,
                    dialogType: enums.PopupDialogType.MarkChangeReasonError
                };

                return React.createElement(ConfirmationDialog, componentProps);
            } else if (currentResponseMode !== enums.ResponseMode.closed) {
                let componentProps = {
                    content: localeStore.instance.TranslateText('assessor3.markChangeReason.dialogContentPending'),
                    header: localeStore.instance.TranslateText('assessor3.markChangeReason.dialogTitle'),
                    displayPopup: isDisplayingMarkChangeReasonNeededError,
                    okButtonText: localeStore.instance.TranslateText('generic.error-dialog.ok-button'),
                    onOkClick: onStayInResponseClick,
                    id: 'markChangeReason',
                    key: 'markChangeReason',
                    popupDialogType: enums.PopupDialogType.none
                };

                return React.createElement(GenericDialog, componentProps);
            }
        } else {
            return null;
        }
    }

    /**
     * flagAsSeenPopUp element
     * @param unManagedSLAOFlagAsSeenPopUpOKButtonClick
     * @param unManagedSLAOFlagAsSeenPopUpCancelButtonClick
     * @param showUnmanagedSLAOFlagAsSeenPopUp
     */
    public flagAsSeenPopUp(unManagedSLAOFlagAsSeenPopUpOKButtonClick: Function, unManagedSLAOFlagAsSeenPopUpCancelButtonClick: Function,
        showUnmanagedSLAOFlagAsSeenPopUp: boolean): JSX.Element {
        let componentProps = {
            id: 'flagAsSeenPopUp',
            key: 'flagAsSeenPopUp',
            content: localeStore.instance.TranslateText('marking.full-response-view.flag-as-seen-dialog.body'),
            header: localeStore.instance.TranslateText('marking.full-response-view.flag-as-seen-dialog.header'),
            displayPopup: showUnmanagedSLAOFlagAsSeenPopUp,
            isCheckBoxVisible: false,
            noButtonText: localeStore.instance.TranslateText('marking.full-response-view.flag-as-seen-dialog.cancel-button'),
            yesButtonText: localeStore.instance.TranslateText('marking.full-response-view.flag-as-seen-dialog.ok-button'),
            onYesClick: unManagedSLAOFlagAsSeenPopUpOKButtonClick,
            onNoClick: unManagedSLAOFlagAsSeenPopUpCancelButtonClick,
            dialogType: enums.PopupDialogType.UnmanagedSLAOFlagAsSeen,
            isKeyBoardSupportEnabled: true,
        };

        return React.createElement(ConfirmationDialog, componentProps);
    }

    /**
     * flagAsSeenPopUp element for ebookmarking
     * @param unKnownContentFlagAsSeenPopUpOKButtonClick
     * @param unKnownContentFlagAsSeenPopUpCancelButtonClick
     * @param showUnknownContentFlagAsSeenPopUp
     */
    public flagAsSeenForEBookmarkingPopUp(unKnownContentFlagAsSeenPopUpOKButtonClick: Function,
        unKnownContentFlagAsSeenPopUpCancelButtonClick: Function,
        showUnknownContentFlagAsSeenPopUp: boolean): JSX.Element {
        let componentProps = {
            id: 'flagAsSeenForEBookmarkingPopUp',
            key: 'flagAsSeenForEBookmarkingPopUp',
            content: localeStore.instance.TranslateText('marking.full-response-view.ebookmarking-flag-as-seen-dialog.body'),
            header: localeStore.instance.TranslateText('marking.full-response-view.ebookmarking-flag-as-seen-dialog.header'),
            displayPopup: showUnknownContentFlagAsSeenPopUp,
            isCheckBoxVisible: false,
            noButtonText: localeStore.instance.TranslateText('marking.full-response-view.ebookmarking-flag-as-seen-dialog.cancel-button'),
            yesButtonText: localeStore.instance.TranslateText('marking.full-response-view.ebookmarking-flag-as-seen-dialog.ok-button'),
            onYesClick: unKnownContentFlagAsSeenPopUpOKButtonClick,
            onNoClick: unKnownContentFlagAsSeenPopUpCancelButtonClick,
            dialogType: enums.PopupDialogType.UnknownContentFlagAsSeen
        };

        return React.createElement(ConfirmationDialog, componentProps);
    }

    /**
     * Promote to seed confirmation popup dialog
     * @param onOkClickPromoteToSeedConfirmationPopup
     * @param onNoClickPromoteToSeedConfirmationPopup
     */
    public promoteToSeedConfirmationMessage(onOkClickPromoteToSeedConfirmationPopup: Function,
        onNoClickPromoteToSeedConfirmationPopup: Function) {
        let componentProps = {
            id: 'promoteToSeedConfirmationMessage',
            key: 'promoteToSeedConfirmationMessage',
            content: markerOperationModeFactory.operationMode.promoteToSeedPopupContentText,
            header: markerOperationModeFactory.operationMode.promoteToSeedPopupHeaderText,
            displayPopup: this.responseContainerProperty.isPromoteToSeedConfirmationDialogVisible,
            isCheckBoxVisible: false,
            noButtonText: localeStore.instance.TranslateText('team-management.response.promote-to-seed-dialog.cancel-button'),
            yesButtonText: localeStore.instance.TranslateText('team-management.response.promote-to-seed-dialog.ok-button'),
            onYesClick: onOkClickPromoteToSeedConfirmationPopup,
            onNoClick: onNoClickPromoteToSeedConfirmationPopup,
            dialogType: this.responseContainerProperty.promoteToSeedDialogType,
            isKeyBoardSupportEnabled: true
        };
        return React.createElement(ConfirmationDialog, componentProps);
    }

    /**
     * Promote to seed error popup
     * @param onOkClickPromoteToSeedErrorPopup
     */
    public promoteToSeedErrorMessage(onOkClickPromoteToSeedErrorPopup: Function) {
        let componentProps = {
            id: this.responseContainerProperty.promoteToSeedErrorPopupData.id,
            key: this.responseContainerProperty.promoteToSeedErrorPopupData.key,
            content: this.responseContainerProperty.promoteToSeedErrorPopupData.popupContent,
            header: this.responseContainerProperty.promoteToSeedErrorPopupData.header,
            displayPopup: this.responseContainerProperty.isPromoteToSeedErrorDialogVisible,
            okButtonText: localeStore.instance.TranslateText('team-management.response.promote-to-seed-dialog.ok-button'),
            onOkClick: onOkClickPromoteToSeedErrorPopup,
            popupDialogType: enums.PopupDialogType.PromoteToSeedDeclined
        };
        return React.createElement(GenericDialog, componentProps);
    }

    /**
     * Response review failed message dialog
     * @param isResponseReviewFailedPopupVisible
     * @param onOkClickOfResponseReviewFailedMessage
     */
    public responseRevieweFailedMessage(isResponseReviewFailedPopupVisible: boolean,
        onOkClickOfResponseReviewFailedMessage: Function) {
        let componentProps = {
            id: 'responseAlreadyReviewedId',
            key: 'responseAlreadyReviewedKey',
            header: this.responseContainerProperty.reviewPopupTitle,
            content: this.responseContainerProperty.reviewPopupContent,
            displayPopup: isResponseReviewFailedPopupVisible,
            okButtonText: localeStore.instance.TranslateText('marking.response.invalid-mark-dialog.ok-button'),
            onOkClick: onOkClickOfResponseReviewFailedMessage,
            popupDialogType: this.responseContainerProperty.reviewPopupDialogType
        };
        return React.createElement(GenericDialog, componentProps);
    }

    /**
     * rejectRigPopUp element
     * @param onRejectRigOkButtonClick
     * @param onRejectRigCancelButtonClick
     * @param isRejectRigPopUpVisible
     */
    public rejectRigPopUp(onRejectRigOkButtonClick: Function, onRejectRigCancelButtonClick: Function,
        isRejectRigPopUpVisible: boolean): JSX.Element {
        let componentProps = {
            id: 'rejectRigPopUp',
            key: 'rejectRigPopUp',
            content: localeStore.instance.TranslateText('marking.response.reject-rig-confirmation-dialog.body'),
            header: localeStore.instance.TranslateText('marking.response.reject-rig-confirmation-dialog.header'),
            displayPopup: isRejectRigPopUpVisible,
            isCheckBoxVisible: false,
            noButtonText: localeStore.instance.TranslateText('marking.response.reject-rig-confirmation-dialog.cancel-button'),
            yesButtonText: localeStore.instance.TranslateText('marking.response.reject-rig-confirmation-dialog.ok-button'),
            onYesClick: onRejectRigOkButtonClick,
            onNoClick: onRejectRigCancelButtonClick,
            dialogType: enums.PopupDialogType.RejectRigConfirmation
        };

        return React.createElement(ConfirmationDialog, componentProps);
    }

    /**
     * isConfirmReviewOfSLAOPopup
     * @param onConfirmReviewOfSLAOPopupOkButtonClick
     * @param onConfirmReviewOfSLAOPopupCancelButtonClick
     * @param isConfirmReviewOfSLAOPopupShowing
     */
    public isConfirmReviewOfSLAOPopup(onConfirmReviewOfSLAOPopupOkButtonClick: Function,
        onConfirmReviewOfSLAOPopupCancelButtonClick: Function,
        isConfirmReviewOfSLAOPopupShowing: boolean): JSX.Element {
        let componentProps = {
            id: 'isConfirmReviewOfSLAOPopup',
            key: 'isConfirmReviewOfSLAOPopup',
            content: localeStore.instance.TranslateText('marking.full-response-view.slao-link-removal-dialog.body'),
            header: localeStore.instance.TranslateText('marking.full-response-view.slao-link-removal-dialog.header'),
            displayPopup: isConfirmReviewOfSLAOPopupShowing,
            isCheckBoxVisible: false,
            noButtonText: localeStore.instance.TranslateText('marking.full-response-view.slao-link-removal-dialog.cancel-button'),
            yesButtonText: localeStore.instance.TranslateText('marking.full-response-view.slao-link-removal-dialog.ok-button'),
            onYesClick: onConfirmReviewOfSLAOPopupOkButtonClick,
            onNoClick: onConfirmReviewOfSLAOPopupCancelButtonClick,
            dialogType: enums.PopupDialogType.ReviewOfSLAOConfirmation
        };

        return React.createElement(ConfirmationDialog, componentProps);
    }

    /**
     * isConfirmReviewOfUnknownContentPopup
     * @param onConfirmReviewOfUnknownContentPopupOkButtonClick
     * @param onConfirmReviewOfUnknownContentPopupCancelButtonClick
     * @param isConfirmReviewOfUnknownContentPopupShowing
     */
    public isConfirmReviewOfUnknownContentPopup(onConfirmReviewOfUnknownContentPopupOkButtonClick: Function,
        onConfirmReviewOfUnknownContentPopupCancelButtonClick: Function,
        isConfirmReviewOfUnknownContentPopupShowing: boolean): JSX.Element {
        let componentProps = {
            id: 'isConfirmReviewOfUnknownContentPopup',
            key: 'isConfirmReviewOfUnknownContentPopup',
            content: localeStore.instance.TranslateText('marking.full-response-view.unknown-content-link-removal-dialog.body'),
            header: localeStore.instance.TranslateText('marking.full-response-view.unknown-content-link-removal-dialog.header'),
            displayPopup: isConfirmReviewOfUnknownContentPopupShowing,
            isCheckBoxVisible: false,
            noButtonText: localeStore.instance.TranslateText
                ('marking.full-response-view.unknown-content-link-removal-dialog.cancel-button'),
            yesButtonText: localeStore.instance.TranslateText('marking.full-response-view.unknown-content-link-removal-dialog.ok-button'),
            onYesClick: onConfirmReviewOfUnknownContentPopupOkButtonClick,
            onNoClick: onConfirmReviewOfUnknownContentPopupCancelButtonClick,
            dialogType: enums.PopupDialogType.ReviewOfUnknownContentConfirmation
        };

        return React.createElement(ConfirmationDialog, componentProps);
    }

    /**
     * linkToPageErrorDialog element
     * @param doShowLinkToQuestion
     * @param onLinkToPageErrorDialogOkClick
     * @param isLinkToPageErrorShowing
     */
    public linkToPageErrorDialog(doShowLinkToQuestion: Function, onLinkToPageErrorDialogOkClick: Function,
        isLinkToPageErrorShowing: boolean): JSX.Element {
        if (doShowLinkToQuestion) {
            let componentProps = {
                id: 'linkToPageErrorDialog',
                key: 'linkToPageErrorDialog',
                content: localeStore.instance.TranslateText('marking.full-response-view.unlink-annotations-exist-dialog.body'),
                header: localeStore.instance.TranslateText('marking.full-response-view.unlink-annotations-exist-dialog.header'),
                okButtonText: localeStore.instance.TranslateText('marking.full-response-view.page-linking-popup.cancel-button'),
                onOkClick: onLinkToPageErrorDialogOkClick,
                displayPopup: isLinkToPageErrorShowing,
                popupDialogType: enums.PopupDialogType.RemoveLinkError,
                listOfContents: this.responseContainerProperty.itemsWhichCantUnlink
            };

            return React.createElement(GenericDialog, componentProps);
        }

        return null;
    }

    /**
     * linkToPagePopup element
     * @param doShowLinkToQuestion
     * @param onLinkToPageCancelClick
     * @param onLinkToPageOkClick
     * @param isLinkToPagePopupShowing
     * @param linkToPageButtonLeft
     * @param addLinkAnnotation
     * @param removeLinkAnnotation
     */
    public linkToPagePopup(doShowLinkToQuestion: Function, onLinkToPageCancelClick: Function,
        onLinkToPageOkClick: Function, isLinkToPagePopupShowing: boolean, linkToPageButtonLeft: number,
        addLinkAnnotation: Function, removeLinkAnnotation: Function): JSX.Element {
        if (doShowLinkToQuestion) {
            let componentProps = {
                id: 'linkToPagePopUp',
                key: 'linkToPagePopUp',
                onLinkToPageCancelClick: onLinkToPageCancelClick,
                onLinkToPageOkClick: onLinkToPageOkClick,
                doOpen: isLinkToPagePopupShowing,
                linkToPageButtonLeft: linkToPageButtonLeft,
                currentPageNumber: this.responseContainerProperty.currentPageNumber,
                addLinkAnnotation: addLinkAnnotation,
                isKeyBoardSupportEnabled: isLinkToPagePopupShowing,
                removeLinkAnnotation: removeLinkAnnotation
            };

            return React.createElement(LinkToPagePopup, componentProps);
        }

        return null;
    }

    /**
     * Accept quality confirmation popup
     * @param isAcceptQualityConfirmationPopupDisplaying
     * @param onAcceptQualityYesButtonClick
     * @param onAcceptQualityNoButtonClick
     */
    public acceptQualityConfirmation(
        isAcceptQualityConfirmationPopupDisplaying: boolean,
        onAcceptQualityYesButtonClick: Function,
        onAcceptQualityNoButtonClick: Function) {
        let componentProps = {
            id: 'acceptQualityConfirmation',
            key: 'acceptQualityConfirmation',
            content: localeStore.instance.TranslateText('marking.response.accept-quality-feedback-dialog.body'),
            header: localeStore.instance.TranslateText('marking.response.accept-quality-feedback-dialog.header'),
            displayPopup: isAcceptQualityConfirmationPopupDisplaying,
            isCheckBoxVisible: false,
            noButtonText: localeStore.instance.TranslateText('generic.logout-dialog.no-button'),
            yesButtonText: localeStore.instance.TranslateText('generic.logout-dialog.yes-button'),
            onYesClick: onAcceptQualityYesButtonClick,
            onNoClick: onAcceptQualityNoButtonClick,
            dialogType: enums.PopupDialogType.AcceptQualityFeedback
        };
        return React.createElement(ConfirmationDialog, componentProps);
    }

    /**
     * Promote to reuse bucket confirmation dialog
     * @param onYesClickPromoteToReuseBucketConfirmationPopup
     * @param onNoClickPromoteToReuseBucketConfirmationPopup
     */
    public promoteToReuseBucketConfirmationMessage(onYesClickPromoteToReuseBucketConfirmationPopup: Function,
        onNoClickPromoteToReuseBucketConfirmationPopup: Function) {
        let componentProps = {
            id: 'promoteToReuseBucketConfirmationMessage',
            key: 'promoteToReuseBucketConfirmationMessage',
            content: markerOperationModeFactory.operationMode.promoteToReuseBucketPopupContentText,
            header: markerOperationModeFactory.operationMode.promoteToReusePopupHeaderText,
            displayPopup: this.responseContainerProperty.ispromoteToReuseConfirmationDialogVisible,
            isCheckBoxVisible: false,
            noButtonText: localeStore.instance.TranslateText('team-management.response.promote-to-reuse-bucket-dialog.no-button'),
            yesButtonText: localeStore.instance.TranslateText('team-management.response.promote-to-reuse-bucket-dialog.yes-button'),
            onYesClick: onYesClickPromoteToReuseBucketConfirmationPopup,
            onNoClick: onNoClickPromoteToReuseBucketConfirmationPopup,
            dialogType: enums.PopupDialogType.none,
            isKeyBoardSupportEnabled: true
        };
        return React.createElement(ConfirmationDialog, componentProps);
    }

    /**
     * CRM feed confirmation popup
     * @param onConfirmCRMFeedPopupOkButtonClick
     */
    public crmFeedConfirmationMessage(onConfirmCRMFeedPopupOkButtonClick: Function) {
        let componentProps = {
            id: 'crmFeedConfirmationId',
            key: 'crmFeedConfirmationKey',
            header: localeStore.instance.TranslateText('team-management.response.promote-to-reuse-bucket-not-latest-marks-dialog.header'),
            content: localeStore.instance.TranslateText('team-management.response.promote-to-reuse-bucket-not-latest-marks-dialog.body'),
            displayPopup: this.responseContainerProperty.crmFeedConfirmationPopupVisible,
            okButtonText:
                localeStore.instance.TranslateText('team-management.response.promote-to-reuse-bucket-not-latest-marks-dialog.ok-button'),
            onOkClick: onConfirmCRMFeedPopupOkButtonClick,
            popupDialogType: enums.PopupDialogType.none
        };
        return React.createElement(GenericDialog, componentProps);
    }

    /**
     * Manage SLAO message dialog
     * @param onOkClickOfManageSLAOMessage
     */
    public manageSLAOMessage(onOkClickOfManageSLAOMessage: Function, isUnManagedSLAOPopupVisible: boolean) {
        let componentProps = {
            id: 'manageSLAOdId',
            key: 'manageSLAOKey',
            header: localeStore.instance.TranslateText('marking.full-response-view.manage-slaos-dialog.header'),
            content: localeStore.instance.TranslateText('marking.full-response-view.manage-slaos-dialog.body'),
            displayPopup: (qigStore.instance.isStandardisationsetupCompletedForTheQig &&
                targetSummaryStore.instance.getCurrentTarget().markingModeID === enums.MarkingMode.Simulation ? false :
                isUnManagedSLAOPopupVisible),
            okButtonText: localeStore.instance.TranslateText('marking.full-response-view.manage-slaos-dialog.ok-button'),
            onOkClick: onOkClickOfManageSLAOMessage,
            popupDialogType: enums.PopupDialogType.ManageSLAO,
            isKeyBoardSupportEnabled: true
        };

        return React.createElement(GenericDialog, componentProps);
    }

    /**
     * ALl SLAOs managed message dialog
     * @param onYesClickAllSLAOsManagedConfirmationPopup
     * @param onNoClickAllSLAOsManagedConfirmationPopup
     */
    public allSLAOsManagedMessage(onYesClickAllSLAOsManagedConfirmationPopup: Function,
        onNoClickAllSLAOsManagedConfirmationPopup: Function, isAllSLAOManagedConfirmationPopupVisible: boolean) {
        let componentProps = {
            id: 'allSLAOsManagedMessage',
            key: 'allSLAOsManagedMessage',
            header: localeStore.instance.TranslateText('marking.full-response-view.slaos-managed-dialog.header'),
            content: localeStore.instance.TranslateText('marking.full-response-view.slaos-managed-dialog.body'),
            displayPopup: isAllSLAOManagedConfirmationPopupVisible,
            isCheckBoxVisible: false,
            yesButtonText: localeStore.instance.TranslateText('marking.full-response-view.slaos-managed-dialog.yes-button'),
            noButtonText: localeStore.instance.TranslateText('marking.full-response-view.slaos-managed-dialog.no-button'),
            onYesClick: onYesClickAllSLAOsManagedConfirmationPopup,
            onNoClick: onNoClickAllSLAOsManagedConfirmationPopup,
            dialogType: enums.PopupDialogType.AllSLAOsManaged,
            isKeyBoardSupportEnabled: true
        };
        return React.createElement(ConfirmationDialog, componentProps);
    }

    /**
     * Review managed SLAO message dialog
     * @param isConfirmReviewOfMangedSLAOPopupShowing
     * @param onConfirmReviewOfMangedSLAOPopupOkButtonClick
     */
    public reviewOfMangedSLAOMessage(
        isConfirmReviewOfMangedSLAOPopupShowing: boolean,
        onConfirmReviewOfMangedSLAOPopupOkButtonClick: Function) {
        let componentProps = {
            id: 'mangedSLAOReviewId',
            key: 'mangedSLAORevieKey',
            header: localeStore.instance.TranslateText('marking.full-response-view.manage-slaos-remark-dialog.header'),
            content: localeStore.instance.TranslateText('marking.full-response-view.manage-slaos-remark-dialog.body'),
            displayPopup: isConfirmReviewOfMangedSLAOPopupShowing,
            okButtonText: localeStore.instance.TranslateText('marking.full-response-view.manage-slaos-remark-dialog.ok-button'),
            onOkClick: onConfirmReviewOfMangedSLAOPopupOkButtonClick,
            popupDialogType: enums.PopupDialogType.none
        };
        return React.createElement(GenericDialog, componentProps);
    }

    /**
     * Delete enhanced off page comment message popup
     * @param isEnhancedOffPageDeletePopUpVisible
     * @param onCommentConfirmationYesButtonClicked
     * @param onCommentConfirmationNoButtonClicked
     */
    public deleteEnhancedOffPageCommentMessage(isEnhancedOffPageDeletePopUpVisible: boolean,
        onCommentConfirmationYesButtonClicked: Function,
        onCommentConfirmationNoButtonClicked: Function) {
        let componentProps = {
            id: 'deleteEnhancedOffPageCommentMessage',
            key: 'deleteEnhancedOffPageCommentMessage',
            content: this.responseContainerProperty.confirmationDialogueContent,
            header: this.responseContainerProperty.confirmationDialogueHeader,
            displayPopup: isEnhancedOffPageDeletePopUpVisible,
            isCheckBoxVisible: false,
            noButtonText: localeStore.instance.TranslateText('generic.logout-dialog.no-button'),
            yesButtonText: localeStore.instance.TranslateText('generic.logout-dialog.yes-button'),
            onYesClick: onCommentConfirmationYesButtonClicked,
            onNoClick: onCommentConfirmationNoButtonClicked,
            isKeyBoardSupportEnabled: true,
            dialogType: enums.PopupDialogType.LogoutConfirmation
        };
        return React.createElement(ConfirmationDialog, componentProps);
    }

    /**
     * Withdrwn response error Popup when submitting an exception.
     * @param onConfirmationWithdrwnResponsePopupClick
     */
    public creatExceptionReturnWithdrwnResponseErrorPopup(onConfirmationWithdrwnResponsePopupClick: Function) {
        let componentProps = {
            id: 'createExceptionwithdrwnResponseId',
            key: 'createExceptionwithdrwnResponseKey',
            header: localeStore.instance.TranslateText('team-management.response.create-exception-withdrawn-response-dialog.header'),
            content: localeStore.instance.TranslateText('team-management.response.create-exception-withdrawn-response-dialog.body'),
            displayPopup: this.responseContainerProperty.creatExceptionReturnWithdrwnResponseErrorPopupVisible,
            okButtonText:
                localeStore.instance.TranslateText('team-management.response.create-exception-withdrawn-response-dialog.ok-button'),
            onOkClick: onConfirmationWithdrwnResponsePopupClick,
            popupDialogType: enums.PopupDialogType.none
        };
        return React.createElement(GenericDialog, componentProps);
    }
    /**
     * Withdrwn response error Popup
     * @param OnWithdrwnResponseErrorPopup
     */
    public withdrwnResponseErrorPopup(onWithdrwnResponseErrorPopup: Function) {
        let componentProps = {
            id: 'withdrwnResponseId',
            key: 'withdrwnResponseKey',
            header: localeStore.instance.TranslateText('team-management.response.withdrawn-response-dialog.header'),
            content: localeStore.instance.TranslateText('team-management.response.withdrawn-response-dialog.body'),
            displayPopup: this.responseContainerProperty.withdrwnResponseErrorPopupVisible,
            okButtonText:
                localeStore.instance.TranslateText('team-management.response.withdrawn-response-dialog.ok-button'),
            onOkClick: onWithdrwnResponseErrorPopup,
            popupDialogType: enums.PopupDialogType.none
        };
        return React.createElement(GenericDialog, componentProps);
    }

    /**
     * Withdrwn script in standardisation setup, error Popup
     * @param withdrawScriptInStmErrorPopUpVisible
     */
    public withdrawScriptInStmErrorPopup(withdrawScriptInStmErrorPopUpVisible: Function) {
        let componentProps = {
            id: 'withdrwnScriptId',
            key: 'withdrwnScriptKey',
            header: localeStore.instance.TranslateText('standardisation-setup.withdrawn-script-dialog.header'),
            content: localeStore.instance.TranslateText('standardisation-setup.withdrawn-script-dialog.body'),
            displayPopup: this.responseContainerProperty.withdrawScriptInStmErrorPopUpVisible,
            okButtonText:
                localeStore.instance.TranslateText('standardisation-setup.withdrawn-script-dialog.ok-button'),
            onOkClick: withdrawScriptInStmErrorPopUpVisible,
            popupDialogType: enums.PopupDialogType.none
        };
        return React.createElement(GenericDialog, componentProps);
    }

    /**
     * Session closed response error Popup
     * @param OnSessionClosedErrorPopup
     */
    public sessionClosedErrorPopup(isVisible: boolean, onSessionClosedErrorPopup: Function) {
        let componentProps = {
            id: 'sessionClosedResponseId',
            key: 'sessionClosedResponseKey',
            header: localeStore.instance.TranslateText('marking.worklist.request-marking-check-error-dialog.header-session-closed'),
            content: localeStore.instance.TranslateText('marking.worklist.request-marking-check-error-dialog.body-session-closed'),
            displayPopup: isVisible,
            okButtonText: localeStore.instance.TranslateText('team-management.response.withdrawn-response-dialog.ok-button'),
            onOkClick: onSessionClosedErrorPopup,
            popupDialogType: enums.PopupDialogType.none
        };
        return React.createElement(GenericDialog, componentProps);
    }

    /**
     * Manage un known content message dialog
     */
    public unKnownContentDialog(onOkClick: Function, isVisible: boolean) {
        let componentProps = {
            id: 'manageUnKnownId',
            key: 'manageUnKnownKey',
            header: localeStore.instance.TranslateText('marking.full-response-view.unknown-content-dialog.header'),
            content: localeStore.instance.TranslateText('marking.full-response-view.unknown-content-dialog.body'),
            displayPopup: (qigStore.instance.isStandardisationsetupCompletedForTheQig &&
                targetSummaryStore.instance.getCurrentTarget().markingModeID === enums.MarkingMode.Simulation ? false :
                isVisible),
            okButtonText: localeStore.instance.TranslateText('marking.full-response-view.unknown-content-dialog.ok-button'),
            onOkClick: onOkClick,
            popupDialogType: enums.PopupDialogType.ManageSLAO
        };

        return React.createElement(GenericDialog, componentProps);
    }

    /**
     * Manage un known content in remark message dialog
     */
    public unKnownContentPopupInRemark(onOkClick: Function, isVisible: boolean) {
        let componentProps = {
            id: 'manageUnKnownInRemarkId',
            key: 'manageUnKnownInRemarkKey',
            header: localeStore.instance.TranslateText('marking.full-response-view.unknown-content-dialog-in-remark.header'),
            content: localeStore.instance.TranslateText('marking.full-response-view.unknown-content-dialog-in-remark.body'),
            displayPopup: isVisible,
            okButtonText: localeStore.instance.TranslateText('marking.full-response-view.unknown-content-dialog-in-remark.ok-button'),
            onOkClick: onOkClick,
            popupDialogType: enums.PopupDialogType.ManageSLAO
        };

        return React.createElement(GenericDialog, componentProps);
    }

    /**
     * All unknown/unmanged zones managed message dialog - for ebookmarking
     */
    public allUnmanagedContentManagedMessage(onYesClick: Function, onNoClick: Function, isVisible: boolean) {
        let componentProps = {
            id: 'allUnmanagedContentManagedMessage',
            key: 'allUnmanagedContentManagedMessage',
            header: localeStore.instance.TranslateText('marking.full-response-view.unknown-content-managed-dialog.header'),
            content: localeStore.instance.TranslateText('marking.full-response-view.unknown-content-managed-dialog.body'),
            displayPopup: isVisible,
            isCheckBoxVisible: false,
            yesButtonText: localeStore.instance.TranslateText('marking.full-response-view.unknown-content-managed-dialog.yes-button'),
            noButtonText: localeStore.instance.TranslateText('marking.full-response-view.unknown-content-managed-dialog.no-button'),
            onYesClick: onYesClick,
            onNoClick: onNoClick,
            dialogType: enums.PopupDialogType.AllSLAOsManaged,
            isKeyBoardSupportEnabled: true
        };
        return React.createElement(ConfirmationDialog, componentProps);
    }

    /**
     * Popup element for handled erros on sending message
     */
    public messageSendErrorPopup(isVisible: boolean, onOkClick: Function) {
        let componentProps = {
            id: 'messageSendErrorPopup',
            key: 'messageSendErrorPopup',
            header: localeStore.instance.TranslateText('generic.response-datachange-error-dialog.header'),
            content: localeStore.instance.TranslateText('generic.response-datachange-error-dialog.body'),
            displayPopup: isVisible,
            okButtonText: localeStore.instance.TranslateText('generic.response-datachange-error-dialog.ok-button'),
            onOkClick: onOkClick,
            popupDialogType: enums.PopupDialogType.GenericMessage
        };

        return React.createElement(GenericDialog, componentProps);
    }

    /**
     * return response to marker worklist confirmation message dialog
     */
    public returnResponseConfirmationPopUp(onYesClick: Function, onNoClick: Function, isVisible: boolean, displayID: string) {
        let componentProps = {
            id: 'returnResponseConfirmationPopUp',
            key: 'returnResponseConfirmationPopUpMessage',
            header: localeStore.instance.TranslateText('team-management.response.return-response-to-marker.confirmation-dialog.header'),
            content: stringHelper.format(
                localeStore.instance.TranslateText('team-management.response.return-response-to-marker.confirmation-dialog.body'),
                [displayID]),
            displayPopup: isVisible,
            isCheckBoxVisible: false,
            yesButtonText: localeStore.instance.TranslateText(
                'team-management.response.return-response-to-marker.confirmation-dialog.yes-button'),
            noButtonText: localeStore.instance.TranslateText(
                'team-management.response.return-response-to-marker.confirmation-dialog.no-button'),
            onYesClick: onYesClick,
            onNoClick: onNoClick,
            dialogType: enums.PopupDialogType.ReturnResponseToMarker,
            isKeyBoardSupportEnabled: true
        };
        return React.createElement(ConfirmationDialog, componentProps);
    }

    /**
     * Generate the error message popup corresponds to response return failure
     */
    public returnResponseFailurePopUp(isVisible: boolean, returnResponseResult: enums.ReturnToMarkerResult, onOkClick: Function) {

        let popUpHeader: string = 'team-management.response.return-response-to-marker.';
        let popUpBody: string = 'team-management.response.return-response-to-marker.';
        let popUpOK: string = 'team-management.response.return-response-to-marker.';

        switch (returnResponseResult) {
            case enums.ReturnToMarkerResult.SupervisorApprovalStatusChanged:
                popUpHeader += 'approval-status-changed-dialog.header';
                popUpBody += 'approval-status-changed-dialog.body';
                popUpOK += 'approval-status-changed-dialog.ok-button';
                break;
            case enums.ReturnToMarkerResult.SupervisorHierarchyChanged:
                popUpHeader += 'hierarchy-changed-dialog.header';
                popUpBody += 'hierarchy-changed-dialog.body';
                popUpOK += 'hierarchy-changed-dialog.ok-button';
                break;
        }

        let componentProps = {
            id: 'returnResponseFailurePopUp',
            key: 'returnResponseFailurePopUp',
            header: localeStore.instance.TranslateText(popUpHeader),
            content: localeStore.instance.TranslateText(popUpBody),
            displayPopup: isVisible,
            okButtonText: localeStore.instance.TranslateText(popUpOK),
            onOkClick: onOkClick,
            popupDialogType: enums.PopupDialogType.GenericMessage
        };

        return React.createElement(GenericDialog, componentProps);
    }
}

export = ResponseContainerPopupHelper;