"use strict";
var enums = require('../enums');
var messagingActionCreator = require('../../../actions/messaging/messagingactioncreator');
var markingActionCreator = require('../../../actions/marking/markingactioncreator');
var popUpDisplayActionCreator = require('../../../actions/popupdisplay/popupdisplayactioncreator');
var localeStore = require('../../../stores/locale/localestore');
var exceptionActionCreator = require('../../../actions/exception/exceptionactioncreator');
var combinedWarningPopupHelper = require('./responseerrordialoghelper');
var navigationStore = require('../../../stores/navigation/navigationstore');
var eCourseworkHelper = require('../ecoursework/ecourseworkhelper');
var eCourseworkActionCreator = require('../../../actions/ecoursework/ecourseworkresponseactioncreator');
/**
 * Class for letious popup displaying logics
 */
var PopUpHelper = (function () {
    function PopUpHelper() {
    }
    /**
     * Navigate away from response while clicking on popup action.
     * @param navigateTo
     */
    PopUpHelper.navigateAway = function (navigateTo) {
        switch (navigateTo) {
            case enums.SaveAndNavigate.toLogout:
                // we have to display the logout confirmation while navigating to logout
                // logout.tsx will listen this event and handle the logout functionality
                popUpDisplayActionCreator.popUpDisplay(enums.PopUpType.DiscardMessageNavigateAway, enums.PopUpActionType.Close, navigateTo, {});
                break;
            case enums.SaveAndNavigate.toResponse:
                markingActionCreator.saveAndNavigate(navigateTo);
                break;
            default:
                markingActionCreator.saveAndNavigate(navigateTo);
                break;
        }
    };
    /**
     * Get the Content of the popup
     * @param popupType
     * @param navigationReason
     */
    PopUpHelper.getPopUpText = function (popupType, navigationReason) {
        if (popupType === enums.PopUpType.DiscardMessageNavigateAway && navigationReason === enums.SaveAndNavigate.messageWithInResponse) {
            return localeStore.instance.TranslateText('marking.response.discard-message-or-exception-dialog.body');
        }
        if (popupType === enums.PopUpType.DiscardExceptionNavigateAway &&
            navigationReason === enums.SaveAndNavigate.exceptionWithInResponse) {
            return localeStore.instance.TranslateText('marking.response.discard-exception-dialog.body-open-another');
        }
        return undefined;
    };
    /**
     * Methods to handle letious popup events
     * arg1 : popUpType - letious popup types
     * arg2 : popupActionType - actiontypes like show, Yes clicked, No Clicked etc
     */
    PopUpHelper.handlePopUpEvents = function (popUpType, popUpActionType, callback, actionFromCombinedPopup, navigateTo) {
        if (actionFromCombinedPopup === void 0) { actionFromCombinedPopup = false; }
        if (navigateTo === void 0) { navigateTo = enums.SaveAndNavigate.none; }
        switch (popUpType) {
            case enums.PopUpType.DiscardMessage:
            case enums.PopUpType.DiscardMessageNavigateAway:
            case enums.PopUpType.DiscardOnNewMessageButtonClick:
            case enums.PopUpType.DiscardException:
            case enums.PopUpType.DiscardExceptionNavigateAway:
            case enums.PopUpType.DiscardOnNewExceptionButtonClick:
                switch (popUpActionType) {
                    case enums.PopUpActionType.Yes:
                    case enums.PopUpActionType.No:
                    case enums.PopUpActionType.Ok:
                        callback(actionFromCombinedPopup, navigateTo);
                        break;
                }
        }
    };
    /**
     * This method will handle display logic for letious popups while navigating away from Response.
     * @param responseNavigationFailureReasons - An Array of failure reasons.
     * @param navigateTo destination
     */
    PopUpHelper.navigateAwayFromResponse = function (responseNavigationFailureReasons, navigateTo, navigateFrom, isLastResponseLastQuestion) {
        if (isLastResponseLastQuestion === void 0) { isLastResponseLastQuestion = false; }
        // If it is an ecoursework component and there is an audio / video file in the selected list
        // Pause the media player on navigation before proceeding
        if (responseNavigationFailureReasons.length > 0 && eCourseworkHelper &&
            eCourseworkHelper.isECourseworkComponent &&
            (eCourseworkHelper.getSelectedECourseworkMediaFile(enums.MediaType.Audio) ||
                eCourseworkHelper.getSelectedECourseworkMediaFile(enums.MediaType.Video))) {
            eCourseworkActionCreator.pauseMediaPlayer();
        }
        // if the navigation is from response or not
        var isNavigateFromResponse = navigationStore.instance.containerPage === enums.PageContainers.Response;
        // if marks deleted in grace period then show the ordinary MarksMissingInGracePeriodResponse popup
        var index = 0;
        var canNavigateAway = null;
        while (index <= (responseNavigationFailureReasons.length - 1)) {
            canNavigateAway = responseNavigationFailureReasons[index];
            if (canNavigateAway === enums.ResponseNavigateFailureReason.MarksMissingInGracePeriodResponse) {
                markingActionCreator.showGracePeriodNotFullyMarkedMessage(enums.ResponseNavigateFailureReason.MarksMissingInGracePeriodResponse);
                return;
            }
            index++;
        }
        // if trying to navigate away from response, show combined warning popup
        if (!isLastResponseLastQuestion &&
            isNavigateFromResponse &&
            navigateTo !== enums.SaveAndNavigate.toNewResponseMessageCompose &&
            navigateTo !== enums.SaveAndNavigate.messageWithInResponse &&
            responseNavigationFailureReasons.length > 0) {
            var combinedWarningMessages = combinedWarningPopupHelper.getCombinedWarningMessage(navigateTo, responseNavigationFailureReasons);
            markingActionCreator.showResponseNavigationFailureReasons(navigateTo, combinedWarningMessages, navigateFrom);
        }
        else if (isLastResponseLastQuestion) {
            // if navigate from last response last question, then show retun to worklist popup
            var index_1 = 0;
            var canNavigateAway_1 = null;
            while (index_1 <= (responseNavigationFailureReasons.length - 1)) {
                canNavigateAway_1 = responseNavigationFailureReasons[index_1];
                if (canNavigateAway_1 === enums.ResponseNavigateFailureReason.LastResponseLastQuestion) {
                    markingActionCreator.showReturnToWorklistConfirmation();
                    break;
                }
                index_1++;
            }
        }
        else {
            // show normal popup
            var index_2 = 0;
            var canNavigateAway_2 = null;
            while (index_2 <= (responseNavigationFailureReasons.length - 1)) {
                canNavigateAway_2 = responseNavigationFailureReasons[index_2];
                if (navigateTo !== enums.SaveAndNavigate.toNewResponseMessageCompose &&
                    navigateTo !== enums.SaveAndNavigate.messageWithInResponse) {
                    if (canNavigateAway_2 === enums.ResponseNavigateFailureReason.MarksMissingInGracePeriodResponse) {
                        markingActionCreator.showGracePeriodNotFullyMarkedMessage(enums.ResponseNavigateFailureReason.MarksMissingInGracePeriodResponse);
                        break;
                    }
                    else if (canNavigateAway_2 === enums.ResponseNavigateFailureReason.AllPagesNotAnnotatedInGrace) {
                        markingActionCreator.showGracePeriodNotFullyMarkedMessage(enums.ResponseNavigateFailureReason.AllPagesNotAnnotatedInGrace);
                        break;
                    }
                    else if (canNavigateAway_2 === enums.ResponseNavigateFailureReason.AllPagesNotAnnotated) {
                        markingActionCreator.showAllPageNotAnnotatedMessage(navigateTo);
                        break;
                    }
                    else if (canNavigateAway_2 === enums.ResponseNavigateFailureReason.MarkChangeReasonNeeded) {
                        markingActionCreator.showMarkeChangeReasonNeededMessage(enums.ResponseNavigateFailureReason.MarkChangeReasonNeeded, navigateTo);
                        break;
                    }
                    else if (canNavigateAway_2 === enums.ResponseNavigateFailureReason.LastResponseLastQuestion) {
                        markingActionCreator.showReturnToWorklistConfirmation();
                        break;
                    }
                }
                if (canNavigateAway_2 === enums.ResponseNavigateFailureReason.UnSentMessage) {
                    if (responseNavigationFailureReasons.length === 1 || navigateTo === enums.SaveAndNavigate.toNewResponseMessageCompose
                        || navigateTo === enums.SaveAndNavigate.messageWithInResponse) {
                        // we have to display discard message warning if failure condition is unsendmessage only.
                        // if multiple failure reasons are there then we will handle on that messages
                        messagingActionCreator.messageAction(enums.MessageViewAction.NavigateAway, enums.MessageType.None, navigateTo);
                        break;
                    }
                }
                else if (canNavigateAway_2 === enums.ResponseNavigateFailureReason.UnSavedException &&
                    responseNavigationFailureReasons.length === 1) {
                    // we have to display discard exception warning if failure condition is unsaved only.
                    // if multiple failure reasons are there then we will handle on that exceptions
                    exceptionActionCreator.exceptionWindowAction(enums.ExceptionViewAction.NavigateAway, null, navigateTo, undefined, navigateFrom);
                    break;
                }
                index_2++;
            }
        }
    };
    return PopUpHelper;
}());
module.exports = PopUpHelper;
//# sourceMappingURL=popuphelper.js.map