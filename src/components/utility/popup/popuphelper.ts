import enums = require('../enums');
import messageStore = require('../../../stores/message/messagestore');
import messagingActionCreator = require('../../../actions/messaging/messagingactioncreator');
import markingActionCreator = require('../../../actions/marking/markingactioncreator');
import worklistActionCreator = require('../../../actions/worklist/worklistactioncreator');
import navigationHelper = require('../../utility/navigation/navigationhelper');
import popUpDisplayActionCreator = require('../../../actions/popupdisplay/popupdisplayactioncreator');
import localeStore = require('../../../stores/locale/localestore');
import exceptionActionCreator = require('../../../actions/exception/exceptionactioncreator');
import combinedWarningPopupHelper = require('./responseerrordialoghelper');
import markSchemeHelper = require('../../../utility/markscheme/markschemehelper');
import navigationStore = require('../../../stores/navigation/navigationstore');
import eCourseworkHelper = require('../ecoursework/ecourseworkhelper');
import eCourseworkActionCreator = require('../../../actions/ecoursework/ecourseworkresponseactioncreator');

/**
 * Class for letious popup displaying logics
 */
class PopUpHelper {

    /**
     * Methods to handle letious popup events
     * arg1 : popUpType - letious popup types
     * arg2 : popupActionType - actiontypes like show, Yes clicked, No Clicked etc
     */
    public static handlePopUpEvents = (popUpType: enums.PopUpType, popUpActionType: enums.PopUpActionType,
        callback: Function,
        actionFromCombinedPopup: boolean = false,
        navigateTo: enums.SaveAndNavigate = enums.SaveAndNavigate.none): void => {
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
    public static navigateAwayFromResponse = (responseNavigationFailureReasons: Array<enums.ResponseNavigateFailureReason>,
        navigateTo: enums.SaveAndNavigate, navigateFrom?: enums.ResponseNavigation, isLastResponseLastQuestion: boolean = false): void => {

        // If it is an ecoursework component and there is an audio / video file in the selected list
        // Pause the media player on navigation before proceeding
        if (responseNavigationFailureReasons.length > 0 && eCourseworkHelper &&
            eCourseworkHelper.isECourseworkComponent &&
            (eCourseworkHelper.getSelectedECourseworkMediaFile(enums.MediaType.Audio) ||
                eCourseworkHelper.getSelectedECourseworkMediaFile(enums.MediaType.Video))) {

            eCourseworkActionCreator.pauseMediaPlayer();
        }

        // if the navigation is from response or not
        let isNavigateFromResponse: boolean = navigationStore.instance.containerPage === enums.PageContainers.Response;

        // if marks deleted in grace period then show the ordinary MarksMissingInGracePeriodResponse popup
        let index = 0;
        let canNavigateAway = null;
        while (index <= (responseNavigationFailureReasons.length - 1)) {
            canNavigateAway = responseNavigationFailureReasons[index];
            if (canNavigateAway === enums.ResponseNavigateFailureReason.MarksMissingInGracePeriodResponse) {
                markingActionCreator.showGracePeriodNotFullyMarkedMessage
                    (enums.ResponseNavigateFailureReason.MarksMissingInGracePeriodResponse);
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
            let combinedWarningMessages = combinedWarningPopupHelper.getCombinedWarningMessage(navigateTo,
                responseNavigationFailureReasons);
            markingActionCreator.showResponseNavigationFailureReasons(navigateTo, combinedWarningMessages, navigateFrom);

        } else if (isLastResponseLastQuestion) {
        // if navigate from last response last question, then show retun to worklist popup
            let index = 0;
            let canNavigateAway = null;
            while (index <= (responseNavigationFailureReasons.length - 1)) {
                canNavigateAway = responseNavigationFailureReasons[index];
                if (canNavigateAway === enums.ResponseNavigateFailureReason.LastResponseLastQuestion) {
                    markingActionCreator.showReturnToWorklistConfirmation();
                    break;
                }
                index++;
            }
        } else {
        // show normal popup
            let index = 0;
            let canNavigateAway = null;
            while (index <= (responseNavigationFailureReasons.length - 1)) {
                canNavigateAway = responseNavigationFailureReasons[index];
                if (navigateTo !== enums.SaveAndNavigate.toNewResponseMessageCompose &&
                    navigateTo !== enums.SaveAndNavigate.messageWithInResponse) {
                    if (canNavigateAway === enums.ResponseNavigateFailureReason.MarksMissingInGracePeriodResponse) {
                        markingActionCreator.showGracePeriodNotFullyMarkedMessage
                            (enums.ResponseNavigateFailureReason.MarksMissingInGracePeriodResponse);
                        break;
                    } else if (canNavigateAway === enums.ResponseNavigateFailureReason.AllPagesNotAnnotatedInGrace) {
                        markingActionCreator.showGracePeriodNotFullyMarkedMessage
                            (enums.ResponseNavigateFailureReason.AllPagesNotAnnotatedInGrace);
                        break;
                    } else if (canNavigateAway === enums.ResponseNavigateFailureReason.AllPagesNotAnnotated) {
                        markingActionCreator.showAllPageNotAnnotatedMessage(navigateTo);
                        break;
                    } else if (canNavigateAway === enums.ResponseNavigateFailureReason.MarkChangeReasonNeeded) {
                        markingActionCreator.showMarkeChangeReasonNeededMessage(
                            enums.ResponseNavigateFailureReason.MarkChangeReasonNeeded,
                            navigateTo);
                        break;
                    } else if (canNavigateAway === enums.ResponseNavigateFailureReason.LastResponseLastQuestion) {
                        markingActionCreator.showReturnToWorklistConfirmation();
                        break;
                    }
                }

                if (canNavigateAway === enums.ResponseNavigateFailureReason.UnSentMessage) {
                    if (responseNavigationFailureReasons.length === 1 || navigateTo === enums.SaveAndNavigate.toNewResponseMessageCompose
                        || navigateTo === enums.SaveAndNavigate.messageWithInResponse) {
                        // we have to display discard message warning if failure condition is unsendmessage only.
                        // if multiple failure reasons are there then we will handle on that messages
                        messagingActionCreator.messageAction(enums.MessageViewAction.NavigateAway, enums.MessageType.None, navigateTo);
                        break;
                    }
                } else if (canNavigateAway === enums.ResponseNavigateFailureReason.UnSavedException &&
                    responseNavigationFailureReasons.length === 1) {
                    // we have to display discard exception warning if failure condition is unsaved only.
                    // if multiple failure reasons are there then we will handle on that exceptions
                    exceptionActionCreator.exceptionWindowAction(enums.ExceptionViewAction.NavigateAway,
                        null, navigateTo, undefined, navigateFrom);
                    break;
                }
                index++;
            }
        }
    };

    /**
     * Navigate away from response while clicking on popup action.
     * @param navigateTo
     */
    public static navigateAway(navigateTo: enums.SaveAndNavigate) {
        switch (navigateTo) {
            case enums.SaveAndNavigate.toLogout:
                // we have to display the logout confirmation while navigating to logout
                // logout.tsx will listen this event and handle the logout functionality
                popUpDisplayActionCreator.popUpDisplay(enums.PopUpType.DiscardMessageNavigateAway, enums.PopUpActionType.Close,
                    navigateTo, {});
                break;
            case enums.SaveAndNavigate.toResponse:
                markingActionCreator.saveAndNavigate(navigateTo);
                break;
            default:
                markingActionCreator.saveAndNavigate(navigateTo);
                break;
        }
    }

    /**
     * Get the Content of the popup
     * @param popupType
     * @param navigationReason
     */
    public static getPopUpText(popupType: enums.PopUpType, navigationReason: enums.SaveAndNavigate): string {
        if (popupType === enums.PopUpType.DiscardMessageNavigateAway && navigationReason === enums.SaveAndNavigate.messageWithInResponse) {
            return localeStore.instance.TranslateText('marking.response.discard-message-or-exception-dialog.body');
        }

        if (popupType === enums.PopUpType.DiscardExceptionNavigateAway &&
            navigationReason === enums.SaveAndNavigate.exceptionWithInResponse) {
            return localeStore.instance.TranslateText('marking.response.discard-exception-dialog.body-open-another');
        }

        return undefined;
    }

}

export = PopUpHelper;