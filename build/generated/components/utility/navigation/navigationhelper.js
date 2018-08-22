"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator.throw(value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments)).next());
    });
};
var _this = this;
var enums = require('../enums');
var navigationWarningInfo = require('./typings/navigationwarninginfo');
var storageAdapterHelper = require('../../../dataservices/storageadapters/storageadapterhelper');
var loginSession;
var navigationStore;
var userOptionActionCreator;
var userOptionsHelper;
var worklistActionCreator;
var responseStore;
var marksAndAnnotationsSaveHelper;
var markingActionCreator;
var markingHelper;
var worklistStore;
var messageStore;
var markingStore;
var messagingActionCreator;
var localeStore;
var exceptionActionCreator;
var applicationStore;
var loadContainerActionCreator;
var markSchemeHelper;
var responseActionCreator;
var qualityfeedbackHelper;
var popupHelper;
var userInfoStore;
var constants;
var applicationActionCreator;
var popupDisplayActionCreator;
var markerOperationModeFactory;
var userInfoActionCreator;
var qigStore;
var responseHelper;
var teamManagementStore;
var teamManagementActionCreator;
var qigSelectorActionCreator;
var responseSearchHelper;
var dataServiceHelper;
var examinerStore;
var stampActionCreator;
var markingCheckActionCreator;
var eCourseworkActionCreator;
var stampStore;
var combinedWarningPopupHelper;
var eCourseworkHelper;
var simulationModeHelper;
var keyDownHelper;
var standardisationSetupStore;
var standardisationActionCreator;
var promise;
var backgroundPulseHelper;
var awardingActionCreator;
var tagActionCreator;
var htmlviewerhelper;
var tagStore; // to create an instance of tagStore even though its not used in navigation helper.
var storageAdapterFactory;
var awardingStore;
/**
 * Navigation helper class
 */
var NavigationHelper = (function () {
    /**
     * Constructor
     */
    function NavigationHelper() {
        //Default constructor
    }
    /**
     * Static constructor
     */
    NavigationHelper.staticConstructor = function () {
        NavigationHelper.loadDependencies();
    };
    /**
     *  This will load the dependencies dynamically during component mount.
     */
    NavigationHelper.loadDependencies = function () {
        return __awaiter(this, void 0, void 0, function* () {
            // here await is used to handle the asynchronus imports.
            yield ();
        });
    };
    NavigationHelper.prototype.import = ;
    NavigationHelper.prototype.then = ;
    NavigationHelper.prototype.import = ;
    NavigationHelper.prototype.then = ;
    NavigationHelper.prototype.import = ;
    NavigationHelper.prototype.then = ;
    NavigationHelper.prototype.import = ;
    NavigationHelper.prototype.then = ;
    NavigationHelper.prototype.import = ;
    NavigationHelper.prototype.then = ;
    NavigationHelper.prototype.import = ;
    NavigationHelper.prototype.then = ;
    NavigationHelper.prototype.import = ;
    NavigationHelper.prototype.then = ;
    NavigationHelper.prototype.import = ;
    NavigationHelper.prototype.then = ;
    NavigationHelper.prototype.import = ;
    NavigationHelper.prototype.then = ;
    NavigationHelper.prototype.import = ;
    NavigationHelper.prototype.then = ;
    NavigationHelper.prototype.import = ;
    NavigationHelper.prototype.then = ;
    NavigationHelper.prototype.import = ;
    NavigationHelper.prototype.then = ;
    NavigationHelper.prototype.import = ;
    NavigationHelper.prototype.then = ;
    NavigationHelper.prototype.import = ;
    NavigationHelper.prototype.then = ;
    NavigationHelper.prototype.import = ;
    NavigationHelper.prototype.then = ;
    NavigationHelper.prototype.import = ;
    NavigationHelper.prototype.then = ;
    NavigationHelper.prototype.import = ;
    NavigationHelper.prototype.then = ;
    NavigationHelper.prototype.import = ;
    NavigationHelper.prototype.then = ;
    NavigationHelper.prototype.import = ;
    NavigationHelper.prototype.then = ;
    NavigationHelper.prototype.import = ;
    NavigationHelper.prototype.then = ;
    NavigationHelper.prototype.import = ;
    NavigationHelper.prototype.then = ;
    NavigationHelper.prototype.import = ;
    NavigationHelper.prototype.then = ;
    NavigationHelper.prototype.import = ;
    NavigationHelper.prototype.then = ;
    NavigationHelper.prototype.import = ;
    NavigationHelper.prototype.then = ;
    NavigationHelper.prototype.import = ;
    NavigationHelper.prototype.then = ;
    NavigationHelper.prototype.import = ;
    NavigationHelper.prototype.then = ;
    NavigationHelper.prototype.import = ;
    NavigationHelper.prototype.then = ;
    NavigationHelper.prototype.import = ;
    NavigationHelper.prototype.then = ;
    NavigationHelper.prototype.import = ;
    NavigationHelper.prototype.then = ;
    NavigationHelper.prototype.import = ;
    NavigationHelper.prototype.then = ;
    NavigationHelper.prototype.import = ;
    NavigationHelper.prototype.then = ;
    NavigationHelper.prototype.import = ;
    NavigationHelper.prototype.then = ;
    NavigationHelper.prototype.import = ;
    NavigationHelper.prototype.then = ;
    NavigationHelper.prototype.import = ;
    NavigationHelper.prototype.then = ;
    NavigationHelper.prototype.import = ;
    NavigationHelper.prototype.then = ;
    NavigationHelper.prototype.import = ;
    NavigationHelper.prototype.then = ;
    NavigationHelper.prototype.import = ;
    NavigationHelper.prototype.then = ;
    NavigationHelper.prototype.import = ;
    NavigationHelper.prototype.then = ;
    NavigationHelper.prototype.import = ;
    NavigationHelper.prototype.then = ;
    NavigationHelper.prototype.import = ;
    NavigationHelper.prototype.then = ;
    NavigationHelper.prototype.import = ;
    NavigationHelper.prototype.then = ;
    NavigationHelper.prototype.import = ;
    NavigationHelper.prototype.then = ;
    NavigationHelper.prototype.import = ;
    NavigationHelper.prototype.then = ;
    NavigationHelper.prototype.import = ;
    NavigationHelper.prototype.then = ;
    NavigationHelper.prototype.import = ;
    NavigationHelper.prototype.then = ;
    NavigationHelper.prototype.import = ;
    NavigationHelper.prototype.then = ;
    NavigationHelper.prototype.import = ;
    NavigationHelper.prototype.then = ;
    NavigationHelper.prototype.import = ;
    NavigationHelper.prototype.then = ;
    NavigationHelper.prototype.import = ;
    NavigationHelper.prototype.then = ;
    NavigationHelper.prototype.import = ;
    NavigationHelper.prototype.then = ;
    NavigationHelper.prototype.import = ;
    NavigationHelper.prototype.then = ;
    NavigationHelper.prototype.import = ;
    NavigationHelper.prototype.then = ;
    NavigationHelper.prototype.import = ;
    ;
    NavigationHelper._navigationCollection = Array();
    NavigationHelper._navigationWarningInfo = new navigationWarningInfo();
    return NavigationHelper;
}());
get;
navigationWarningInfo();
{
    return NavigationHelper._navigationWarningInfo;
}
get;
storeInstance();
{
    return navigationStore.instance;
}
get;
store();
{
    return navigationStore.NavigationStore;
}
setNavigationWarningInfo();
void {
    NavigationHelper: ._navigationWarningInfo.warningMessageHeader = 'assessor3.warning.logout.confirmationdialog-header',
    NavigationHelper: ._navigationWarningInfo.warningMessageContent = 'assessor3.warning.logout.confirmationdialog-content',
    NavigationHelper: ._navigationWarningInfo.warningMessageYesButtonText =
        'assessor3.warning.logout.confirmationdialog-yes-button-text',
    NavigationHelper: ._navigationWarningInfo.warningMessageNoButtonText =
        'assessor3.warning.logout.confirmationdialog-no-button-text'
};
loadContainerIfNeeded(containerPage, enums.PageContainers, saveMarksAndAnnotationsProcessingTriggerPoint, enums.SaveMarksAndAnnotationsProcessingTriggerPoint, context, any = undefined);
{
    // if message url and handle it seperatly
    if (containerPage !== enums.PageContainers.Message) {
        marksAndAnnotationsSaveHelper.triggerMarksAndAnnotationsQueueProcessing(saveMarksAndAnnotationsProcessingTriggerPoint, function () {
            if (saveMarksAndAnnotationsProcessingTriggerPoint === enums.SaveMarksAndAnnotationsProcessingTriggerPoint.Inbox) {
                NavigationHelper.clearWorkListCache();
                if (simulationModeHelper.shouldCheckForStandardisationSetupCompletion()) {
                    simulationModeHelper.checkStandardisationSetupCompletion(enums.PageContainers.Response, enums.PageContainers.Message);
                }
                else {
                    NavigationHelper.loadMessagePage();
                }
            }
            else if (saveMarksAndAnnotationsProcessingTriggerPoint
                === enums.SaveMarksAndAnnotationsProcessingTriggerPoint.CloseResponse
                || containerPage === enums.PageContainers.Response) {
                // block navigation if save is inProgress
                if (!marksAndAnnotationsSaveHelper.isSaveInProgress) {
                    if (markingStore && markingStore.instance.navigateTo === enums.SaveAndNavigate.toQigSelector) {
                        NavigationHelper.loadQigSelector();
                    }
                    else if (markingStore && markingStore.instance.navigateTo === enums.SaveAndNavigate.toMenu) {
                        userInfoActionCreator.changeMenuVisibility();
                    }
                    else if (markingStore && markingStore.instance.navigateTo === enums.SaveAndNavigate.toTeam) {
                        NavigationHelper.loadTeamManagement();
                    }
                    else if (markingStore && (markingStore.instance.navigateTo === enums.SaveAndNavigate.toProvisional
                        || markingStore.instance.navigateTo === enums.SaveAndNavigate.toUnclassified
                        || markingStore.instance.navigateTo === enums.SaveAndNavigate.toClassified
                        || markingStore.instance.navigateTo === enums.SaveAndNavigate.toSelectResponses)) {
                        NavigationHelper.loadStandardisationSetup();
                    }
                    else {
                        NavigationHelper.loadWorklist();
                    }
                }
            }
        });
    }
    else if (saveMarksAndAnnotationsProcessingTriggerPoint !== enums.SaveMarksAndAnnotationsProcessingTriggerPoint.Inbox) {
        NavigationHelper.loadWorklist();
    }
}
loadContainer();
void {
    loadContainerActionCreator: .loadContainer(navigationStore.instance.previousPage)
};
clearSession();
void {
    userOptionsHelper: .InitiateSaveUserOption(true),
    userOptionsHelper: .resetTokensAndRedirect(),
    // Reset to home page url once logout
    // This will disable forward button on logout
    loadContainerActionCreator: .loadContainer(enums.PageContainers.Login)
};
loadMessagePage();
void {
    if: function (worklistStore, instance, isMarkingCheckMode) {
        // reseting the marking check mode while navigating to inbox
        markingCheckActionCreator.toggleMarkingCheckMode(false);
    },
    loadContainerActionCreator: .loadContainer(enums.PageContainers.Message)
};
loadResponsePage();
void {
    let: containerPageType, enums: .PageContainersType = enums.PageContainersType.None,
    // check for ecoursework component to load ecoursework container
    if: function (eCourseworkHelper, isECourseworkComponent) {
        containerPageType = enums.PageContainersType.ECourseWork;
    }, else: , if: function (htmlviewerhelper, isHtmlComponent) {
        containerPageType = enums.PageContainersType.HtmlView;
    },
    loadContainerActionCreator: .loadContainer(enums.PageContainers.Response, false, containerPageType)
};
loadWorklist(isFromMenu, boolean = false);
void {
    loadContainerActionCreator: .loadContainer(enums.PageContainers.WorkList, isFromMenu)
};
onBeforeWindowUnload(e, any);
{
    var confirmationMessage = localeStore.instance.TranslateText('generic.browser-warnings.close-browser-warning');
    (e || window.event).returnValue = confirmationMessage; //Gecko + IE
    return confirmationMessage;
}
loadTeamManagement(isFromMenu, boolean = false);
void {
    loadContainerActionCreator: .loadContainer(enums.PageContainers.TeamManagement, isFromMenu)
};
loadStandardisationSetup();
{
    loadContainerActionCreator.loadContainer(enums.PageContainers.StandardisationSetup, false);
}
loadQigSelector();
void {
    loadContainerActionCreator: .loadContainer(enums.PageContainers.QigSelector)
};
loadLoginPage();
void {
    loadContainerActionCreator: .loadContainer(enums.PageContainers.Login)
};
loadAwardingPage();
void {
    loadContainerActionCreator: .loadContainer(enums.PageContainers.Awarding)
};
loadReportsPage();
void {
    loadContainerActionCreator: .loadContainer(enums.PageContainers.Reports)
};
loadSupportLogin(isFromSwitchUser, boolean = false);
void {
    // If loading support admin page then clear the in memory cache.
    if: function (isFromSwitchUser) {
        storageAdapterFactory.resetInMemmoryInstance();
    },
    loadContainerActionCreator: .loadContainer(enums.PageContainers.AdminSupport, false, enums.PageContainersType.None, isFromSwitchUser)
};
responseNavigation(direction, enums.ResponseNavigation, isAfterResponseSubmit, boolean = false);
void {
    // To show the simulation popup before response navigation
    if: function () { } };
!qigStore.instance.getSelectedQIGForTheLoggedInUser.standardisationSetupComplete &&
    !markerOperationModeFactory.operationMode.isStandardisationSetupMode;
{
    var standardisationCompletepromise = qigSelectorActionCreator.checkStandardisationSetupCompleted(qigStore.instance.getSelectedQIGForTheLoggedInUser.markSchemeGroupId, enums.PageContainers.Response, enums.PageContainers.WorkList);
    promise.Promise.all([standardisationCompletepromise]).then(function (data) {
        if (data[0] === false) {
            NavigationHelper.continueResponseNavigation(direction, isAfterResponseSubmit);
        }
    });
}
{
    NavigationHelper.continueResponseNavigation(direction, isAfterResponseSubmit);
}
continueResponseNavigation(direction, enums.ResponseNavigation, isAfterResponseSubmit, boolean);
void {
    let: responseId, number: ,
    let: isSelectResponsesTabInStdSetup, boolean: boolean,
    if: function (direction) {
        if (direction === void 0) { direction =  === enums.ResponseNavigation.next; }
        if (isAfterResponseSubmit) {
            responseId = responseStore.instance.nextResponseIdAfterSubmit;
        }
        else {
            responseId = isSelectResponsesTabInStdSetup ?
                standardisationSetupStore.instance.nextCandidateScript :
                parseInt(markerOperationModeFactory.operationMode.nextResponseId(responseStore.instance.selectedDisplayId.toString()));
        }
    }, else: , if: function (direction) {
        if (direction === void 0) { direction =  === enums.ResponseNavigation.previous; }
        responseId = isSelectResponsesTabInStdSetup ?
            standardisationSetupStore.instance.previousCandidateScript :
            parseInt(markerOperationModeFactory.operationMode.previousResponseId(responseStore.instance.selectedDisplayId.toString()));
    }, else: , if: function (direction) {
        if (direction === void 0) { direction =  === enums.ResponseNavigation.first; }
        responseId = isSelectResponsesTabInStdSetup ?
            standardisationSetupStore.instance.firstCandidateScript :
            parseInt(worklistStore.instance.getIfOfFirstResponse);
    },
    if: function (isSelectResponsesTabInStdSetup) {
        eCourseworkHelper.fetchECourseWorkCandidateScriptMetadata(responseId, false, true);
        responseHelper.openResponse(responseId, direction, enums.ResponseMode.closed, 0, responseStore.instance.selectedResponseViewMode);
    }, else: {
        let: openedResponseDetails = markerOperationModeFactory.operationMode.openedResponseDetails(responseId.toString()),
        let: isStandardisationSetupMode = markerOperationModeFactory.operationMode.isStandardisationSetupMode,
        responseHelper: .openResponse(responseId, direction, isStandardisationSetupMode ? enums.ResponseMode.open : worklistStore.instance.getResponseMode, isStandardisationSetupMode ? openedResponseDetails.esMarkGroupId : openedResponseDetails.markGroupId, responseStore.instance.selectedResponseViewMode, null, openedResponseDetails.sampleReviewCommentId, openedResponseDetails.sampleReviewCommentCreatedBy),
        let: markingMode = worklistStore.instance.getMarkingModeByWorkListType(worklistStore.instance.currentWorklistType),
        /* get the marks for the selected response */
        markSchemeHelper: .getMarks(responseId, markingMode),
        eCourseworkHelper: .fetchECourseWorkCandidateScriptMetadata(responseId)
    }
};
navigationAllowed(direction, enums.ResponseNavigation, isNextResponseAvailable, boolean, isPreviousResponseAvailable, boolean);
{
    if (qualityfeedbackHelper.isResponseNavigationBlocked()) {
        return false;
    }
    else if ((direction === enums.ResponseNavigation.next && isNextResponseAvailable) ||
        (direction === enums.ResponseNavigation.previous && isPreviousResponseAvailable)) {
        return true;
    }
    else {
        return false;
    }
}
handleNavigation = function (navigateTo) {
    //If the worklist button is clicked within worklist with edited message panel discard popup should be shown
    if (messageStore.instance.isMessagePanelActive &&
        navigationStore.instance.containerPage === enums.PageContainers.WorkList &&
        navigateTo !== enums.SaveAndNavigate.toQigSelector &&
        navigateTo !== enums.SaveAndNavigate.toTeam) {
        var messageNavigationArguments = {
            responseId: null,
            canNavigate: false,
            navigateTo: navigateTo,
            navigationConfirmed: false,
            hasMessageContainsDirtyValue: undefined,
            triggerPoint: enums.TriggerPoint.None
        };
        messagingActionCreator.canMessageNavigate(messageNavigationArguments);
    }
    if (!applicationActionCreator.checkActionInterrupted()) {
        return;
    }
    if (navigationStore.instance.containerPage === enums.PageContainers.QigSelector) {
        if (navigateTo === enums.SaveAndNavigate.toMenu) {
            userInfoActionCreator.changeMenuVisibility();
        }
    }
    else if (navigationStore.instance.containerPage === enums.PageContainers.Message) {
        // display mandatory message popup
        if (messageStore.instance.hasUnReadMandatoryMessages) {
            popupDisplayActionCreator.popUpDisplay(enums.PopUpType.MandatoryMessage, enums.PopUpActionType.Show, null, null);
        }
        else {
            if (messageStore.instance.isMessagePanelActive) {
                // we have to display discard message warning
                messagingActionCreator.messageAction(enums.MessageViewAction.NavigateAway, enums.MessageType.None, navigateTo);
            }
            else {
                // The below code needs to be refrcatored and removed
                if (markerOperationModeFactory.operationMode.isTeamManagementMode) {
                    // set the marker operation mode as Marking
                    userInfoActionCreator.changeOperationMode(enums.MarkerOperationMode.Marking);
                }
                switch (navigateTo) {
                    case enums.SaveAndNavigate.toWorklist:
                        NavigationHelper.loadWorklist();
                        break;
                    case enums.SaveAndNavigate.toQigSelector:
                        // Only clear the cache if a qig is selected
                        if (qigStore.instance.selectedQIGForMarkerOperation !== undefined
                            && qigStore.instance.selectedQIGForMarkerOperation != null) {
                            // Clear worklist cache and do content refresh
                            NavigationHelper.clearWorkListCache();
                        }
                        NavigationHelper.loadQigSelector();
                        break;
                    case enums.SaveAndNavigate.toMenu:
                        userInfoActionCreator.changeMenuVisibility();
                        break;
                }
                responseStore.instance.resetSelectedResponseDetails();
            }
        }
    }
    else if (navigationStore.instance.containerPage === enums.PageContainers.WorkList) {
        if (markerOperationModeFactory.operationMode.isTeamManagementMode) {
            NavigationHelper.loadContainerInTeammanagementMode(navigateTo);
        }
        if (worklistStore.instance.isMarkingCheckMode &&
            navigateTo !== enums.SaveAndNavigate.toMenu) {
            // reseting the marking check mode
            markingCheckActionCreator.toggleMarkingCheckMode(false);
        }
        if (navigateTo === enums.SaveAndNavigate.toQigSelector && !messageStore.instance.isMessagePanelActive) {
            NavigationHelper.loadQigSelector();
        }
        else if (navigateTo === enums.SaveAndNavigate.toMenu && !messageStore.instance.isMessagePanelActive) {
            userInfoActionCreator.changeMenuVisibility();
        }
        else if (navigateTo === enums.SaveAndNavigate.toQigSelector && messageStore.instance.isMessagePanelActive) {
            var responseNavigationFailureReasons = markingHelper.canNavigateAwayFromCurrentResponse();
            if (responseNavigationFailureReasons.length > 0) {
                popupHelper.navigateAwayFromResponse(responseNavigationFailureReasons, navigateTo);
            }
        }
        else if (navigateTo === enums.SaveAndNavigate.toWorklist) {
            // Invoke the action creator to Open the QIG
            qigSelectorActionCreator.openQIG(qigStore.instance.selectedQIGForMarkerOperation.markSchemeGroupId);
            if (!navigationStore.instance.getRecentHistory.filter(function (_historyInfo) { return _historyInfo.qigId ===
                qigStore.instance.selectedQIGForMarkerOperation.markSchemeGroupId; }).first().myMarking.responseMode) {
                //Reset the response mode to Open.to show the Open tab selected
                worklistActionCreator.responseModeChanged(enums.ResponseMode.open);
                qigSelectorActionCreator.navigateToWorklistFromQigSelector();
            }
            var historyInfo_1 = navigationStore.instance.getRecentHistory.filter(function (_historyInfo) { return _historyInfo.qigId ===
                qigStore.instance.selectedQIGForMarkerOperation.markSchemeGroupId; }).first();
            historyInfo_1.timeStamp = Date.now();
            worklistActionCreator.setWorklistHistoryInfo(historyInfo_1, userInfoStore.instance.currentOperationMode);
            responseSearchHelper.openQIGDetails(qigStore.instance.selectedQIGForMarkerOperation.questionPaperPartId, qigStore.instance.selectedQIGForMarkerOperation.markSchemeGroupId, qigStore.instance.selectedQIGForMarkerOperation.examinerRoleId, dataServiceHelper.canUseCache(), examinerStore.instance.examinerApprovalStatus(qigStore.instance.selectedQIGForMarkerOperation.examinerRoleId), qigStore.instance.selectedQIGForMarkerOperation.markingMethod, false, qigStore.instance.selectedQIGForMarkerOperation.isElectronicStandardisationTeamMember);
            // load stamps defined for the selected mark scheme groupId
            stampActionCreator.getStampData(qigStore.instance.selectedQIGForMarkerOperation.markSchemeGroupId, stampStore.instance.stampIdsForSelectedQIG, qigStore.instance.selectedQIGForMarkerOperation.markingMethod, responseHelper.isEbookMarking, true);
        }
    }
    else if (navigationStore.instance.containerPage === enums.PageContainers.StandardisationSetup) {
        // set the marker operation mode as Marking
        userInfoActionCreator.changeOperationMode(enums.MarkerOperationMode.Marking);
        if (navigateTo === enums.SaveAndNavigate.toMenu) {
            userInfoActionCreator.changeMenuVisibility();
        }
        else {
            NavigationHelper.loadQigSelector();
        }
    }
    else {
        // If it is an ecoursework component and there is an audio / video file in the selected list
        // Pause the media player on navigation before proceeding
        if (eCourseworkHelper &&
            eCourseworkHelper.isECourseworkComponent &&
            (eCourseworkHelper.getSelectedECourseworkMediaFile(enums.MediaType.Audio) ||
                eCourseworkHelper.getSelectedECourseworkMediaFile(enums.MediaType.Video))) {
            eCourseworkActionCreator.pauseMediaPlayer();
        }
        if (markerOperationModeFactory.operationMode.isStandardisationSetupMode
            && (navigateTo === enums.SaveAndNavigate.toSelectResponses
                || navigateTo === enums.SaveAndNavigate.toUnclassified
                || navigateTo === enums.SaveAndNavigate.toClassified
                || navigateTo === enums.SaveAndNavigate.toProvisional)) {
            var responseNavigationFailureReasons = markingHelper.canNavigateAwayFromCurrentResponse();
            if (responseNavigationFailureReasons.length > 0) {
                popupHelper.navigateAwayFromResponse(responseNavigationFailureReasons, navigateTo);
            }
            else {
                if (markingStore.instance.isMarkingInProgress) {
                    /* Save the selected mark scheme mark to the mark collection on response move */
                    markingActionCreator.saveAndNavigate(navigateTo);
                }
                else {
                    markingActionCreator.updateNavigation(navigateTo);
                }
            }
        }
        else if (markerOperationModeFactory.operationMode.isTeamManagementMode) {
            NavigationHelper.loadContainerInTeammanagementMode(navigateTo);
        }
        else {
            var responseNavigationFailureReasons = markingHelper.canNavigateAwayFromCurrentResponse();
            if (responseNavigationFailureReasons.length > 0) {
                popupHelper.navigateAwayFromResponse(responseNavigationFailureReasons, navigateTo);
            }
            else {
                if (worklistStore.instance.isMarkingCheckMode) {
                    if (navigateTo !== enums.SaveAndNavigate.toMarkingCheckWorklist &&
                        navigateTo !== enums.SaveAndNavigate.toMenu) {
                        markingCheckActionCreator.toggleMarkingCheckMode(false);
                    }
                    markingActionCreator.updateNavigation(navigateTo);
                }
                else if (markingStore.instance.isMarkingInProgress) {
                    /* Save the selected mark scheme mark to the mark collection on response move */
                    markingActionCreator.saveAndNavigate(navigateTo);
                }
                else {
                    markingActionCreator.updateNavigation(navigateTo);
                }
                // Logic to clear the default mark scheme panel width, once we navigate from response screen.
                // Moved this logic here in order to retain default mark scheme panel width if user click "Stay In Response"
                // Also the deafult mark-scheme-panel width needs to be reatined while navigating from menu
                if (navigateTo !== enums.SaveAndNavigate.toMenu) {
                    markingActionCreator.setDefaultPanelWidth();
                    markingActionCreator.updateDefaultPanelWidth();
                }
            }
        }
    }
};
loadContainerInTeammanagementMode(navigateTo, enums.SaveAndNavigate);
{
    var responseNavigationFailureReasons = markingHelper.canNavigateAwayFromCurrentResponse();
    if (responseNavigationFailureReasons.length > 0) {
        var _responseNavigationFailureReasons_1 = new Array();
        responseNavigationFailureReasons.forEach(function (failure) {
            switch (failure) {
                case enums.ResponseNavigateFailureReason.UnSentMessage:
                    _responseNavigationFailureReasons_1.push(enums.ResponseNavigateFailureReason.UnSentMessage);
                    break;
                case enums.ResponseNavigateFailureReason.FileDownloadedOutside:
                    _responseNavigationFailureReasons_1.push(enums.ResponseNavigateFailureReason.FileDownloadedOutside);
                    break;
            }
        });
        popupHelper.navigateAwayFromResponse(_responseNavigationFailureReasons_1, navigateTo);
    }
    else {
        // fix for defect 37718- Customize toolbar message is displaying while open a response;
        // Response close is not fired while navigating away
        // which causes the toolbar message to be displayed.
        switch (navigateTo) {
            case enums.SaveAndNavigate.toWorklist:
            case enums.SaveAndNavigate.toTeam:
                worklistActionCreator.responseClosed(true);
                /** navigating from a examiner response doesn't require to call save marks */
                NavigationHelper.clearWorkListCache();
                if (navigateTo === enums.SaveAndNavigate.toWorklist) {
                    // validate the current examiner.
                    var examinerValidationArea = teamManagementStore.instance.selectedTeamManagementTab ===
                        enums.TeamManagement.HelpExaminers ? enums.ExaminerValidationArea.HelpExaminer :
                        enums.ExaminerValidationArea.TeamWorklist;
                    // validates the examiner status - Defect fix # 49590
                    teamManagementActionCreator.teamManagementExaminerValidation(qigStore.instance.getSelectedQIGForTheLoggedInUser.markSchemeGroupId, qigStore.instance.getSelectedQIGForTheLoggedInUser.examinerRoleId, qigStore.instance.selectedQIGForMarkerOperation.examinerRoleId, teamManagementStore.instance.examinerDrillDownData.examinerId, examinerValidationArea, false, null, enums.MarkingMode.None, 0, true);
                }
                else {
                    worklistActionCreator.responseModeChanged(undefined);
                    if (teamManagementStore && teamManagementStore.instance.isRedirectFromException) {
                        teamManagementActionCreator.
                            getUnactionedExceptions(qigStore.instance.selectedQIGForMarkerOperation.markSchemeGroupId);
                    }
                    NavigationHelper.loadTeamManagement();
                }
                break;
            case enums.SaveAndNavigate.toQigSelector:
                worklistActionCreator.responseClosed(true);
                NavigationHelper.loadQigSelector();
                break;
            case enums.SaveAndNavigate.toMenu:
                userInfoActionCreator.changeMenuVisibility();
                break;
        }
    }
}
showLogoutConfirmation();
{
    // If it is an ecoursework component and there is an audio / video file in the selected list
    // Pause the media player on navigation before proceeding
    if (eCourseworkHelper &&
        eCourseworkHelper.isECourseworkComponent &&
        (eCourseworkHelper.getSelectedECourseworkMediaFile(enums.MediaType.Audio) ||
            eCourseworkHelper.getSelectedECourseworkMediaFile(enums.MediaType.Video))) {
        eCourseworkActionCreator.pauseMediaPlayer();
    }
    if (messageStore.instance.hasUnReadMandatoryMessages) {
        userInfoActionCreator.ToggleUserInfoPanel(false);
        popupDisplayActionCreator.popUpDisplay(enums.PopUpType.MandatoryMessage, enums.PopUpActionType.Show, null, null);
    }
    else {
        var canLogout_1 = true;
        var responseNavigationFailureReasons_1 = markingHelper.canNavigateAwayFromCurrentResponse();
        if (responseNavigationFailureReasons_1.length > 0) {
            //MarksMissingInGracePeriodResponse failure is not handled as part of combined response messages story, implemented old
            // message showing logic as implemented in popuphelper as part of combined response message story - Defect #49525
            if (responseNavigationFailureReasons_1.indexOf(enums.ResponseNavigateFailureReason.MarksMissingInGracePeriodResponse)
                !== -1) {
                canLogout_1 = false;
                markingActionCreator.showGracePeriodNotFullyMarkedMessage(enums.ResponseNavigateFailureReason.MarksMissingInGracePeriodResponse);
            }
            else if (responseStore.instance.selectedMarkGroupId) {
                canLogout_1 = false;
                var combinedWarningMessages = combinedWarningPopupHelper.getCombinedWarningMessage(enums.SaveAndNavigate.toLogout, responseNavigationFailureReasons_1);
                markingActionCreator.showResponseNavigationFailureReasons(enums.SaveAndNavigate.toLogout, combinedWarningMessages);
                userInfoActionCreator.ToggleUserInfoPanel(false);
            }
            else {
                responseNavigationFailureReasons_1.map(function (canNavigateAway) {
                    // The unsent message popup warning needs to be shown if any draft messages exist
                    if (canNavigateAway === enums.ResponseNavigateFailureReason.UnSentMessage &&
                        responseNavigationFailureReasons_1.length === 1) {
                        messagingActionCreator.messageAction(enums.MessageViewAction.NavigateAway, enums.MessageType.None, enums.SaveAndNavigate.toLogout);
                        userInfoActionCreator.ToggleUserInfoPanel(false);
                    }
                    // The unsaved exception popup warning needs to be shown if any unsaved exceptions exist
                    if (canNavigateAway === enums.ResponseNavigateFailureReason.UnSavedException &&
                        responseNavigationFailureReasons_1.length === 1) {
                        exceptionActionCreator.exceptionWindowAction(enums.ExceptionViewAction.NavigateAway, null, enums.SaveAndNavigate.toLogout);
                        userInfoActionCreator.ToggleUserInfoPanel(false);
                    }
                    canLogout_1 = false;
                });
            }
        }
        if (canLogout_1) {
            userInfoActionCreator.ToggleUserInfoPanel(false);
            // For a qig in simulation, check for SSU completion and show popup
            if (navigationStore.instance.containerPage !== enums.PageContainers.QigSelector &&
                navigationStore.instance.containerPage !== enums.PageContainers.Message &&
                simulationModeHelper.shouldCheckForStandardisationSetupCompletion()) {
                simulationModeHelper.checkStandardisationSetupCompletion(enums.PageContainers.Login, enums.PageContainers.Login);
            }
            else {
                // Checking whether there are any locked examiners currently.
                qigSelectorActionCreator.getLocksInQigs(true);
            }
        }
    }
}
handleResponseNavigation(markingProgress ?  : number, navigateTo, enums.SaveAndNavigate = enums.SaveAndNavigate.toResponse);
{
    if (NavigationHelper.navigationAllowed(enums.ResponseNavigation.next, true, false)) {
        NavigationHelper.markHelper = new markSchemeHelper();
        var isLastResponseLastQuestionItem = NavigationHelper.markHelper.isLastResponseLastQuestion;
        var responseNavigationFailureReasons = new Array();
        responseNavigationFailureReasons = markingHelper.canNavigateAwayFromCurrentResponse(markingProgress);
        if (isLastResponseLastQuestionItem) {
            responseNavigationFailureReasons.push(enums.ResponseNavigateFailureReason.LastResponseLastQuestion);
        }
        if (responseNavigationFailureReasons.indexOf(enums.ResponseNavigateFailureReason.MarksMissingInGracePeriodResponse) === -1) {
            // if marking progressing and responseNavigationFailureReason contain none only
            markingActionCreator.saveAndNavigate(navigateTo, enums.ResponseNavigation.markScheme, responseNavigationFailureReasons.length > 0);
        }
        else {
            popupHelper.navigateAwayFromResponse(responseNavigationFailureReasons, enums.SaveAndNavigate.toResponse, enums.ResponseNavigation.markScheme, isLastResponseLastQuestionItem);
        }
    }
}
checkForMbqConfirmationPopup = function (navigation) {
    // checking whether we need to show return to worklist popup in mbq mode.
    if (markingStore.instance.showNavigationOnMbqPopup) {
        NavigationHelper.markHelper = new markSchemeHelper();
        var isLastResponseLastQuestionItem = NavigationHelper.markHelper.isLastResponseLastQuestion;
        var responseNavigationFailureReasons = new Array();
        // If there is any navigation failure reason available then we will show respective popups.
        responseNavigationFailureReasons = markingHelper.canNavigateAwayFromCurrentResponse(markingStore.instance.currentResponseMarkingProgress);
        // if it is last question item of the last response ,then push that failure reason for showing popup
        if (isLastResponseLastQuestionItem) {
            responseNavigationFailureReasons.push(enums.ResponseNavigateFailureReason.LastResponseLastQuestion);
        }
        if (responseNavigationFailureReasons.length > 0) {
            popupHelper.navigateAwayFromResponse(responseNavigationFailureReasons, enums.SaveAndNavigate.toResponse, enums.ResponseNavigation.markScheme, isLastResponseLastQuestionItem);
            // activate keydown since it deactivated from triggersave after return to worklist popup
            keyDownHelper.instance.Activate(enums.MarkEntryDeactivator.TriggerSave);
            return;
        }
    }
    markingActionCreator.navigationAfterMarkConfirmation(navigation);
};
getFirstUnmarkedItem(nodes, treeViewItem, clear, boolean = false);
{
    if (clear) {
        this.nodetoReturn = null;
    }
    var firstUnmarkedItem = void 0;
    var nodeDetails = nodes.treeViewItemList;
    nodeDetails.some(function (node) {
        // Iterate the treeViewItem ,exit the loop once it found the first unmarked item.
        if (node.itemType === enums.TreeViewItemType.marksScheme &&
            (node.allocatedMarks.displayMark === constants.NOT_MARKED || node.allocatedMarks.displayMark === constants.NO_MARK)
            && (_this.nodetoReturn === undefined || _this.nodetoReturn == null)) {
            _this.nodetoReturn = node;
            return true;
        }
        if (node.treeViewItemList && node.treeViewItemList.count() > 0
            && (_this.nodetoReturn === undefined || _this.nodetoReturn == null)) {
            _this.getFirstUnmarkedItem(node, false);
        }
    });
    return this.nodetoReturn;
}
clearWorkListCache();
{
    var markingMode = worklistStore.instance.getMarkingModeByWorkListType(worklistStore.instance.currentWorklistType);
    var _storageAdapterHelper = new storageAdapterHelper();
    _storageAdapterHelper.clearCache(qigStore.instance.selectedQIGForMarkerOperation.markSchemeGroupId, markingMode, worklistStore.instance.getRemarkRequestType, qigStore.instance.selectedQIGForMarkerOperation.examinerRoleId, worklistStore.instance.currentWorklistType);
}
navigateToQigSelector = function (isPassResetSuccess) {
    if (isPassResetSuccess === 'true') {
        // to remove the qury string from the url
        history.pushState({}, null, config.general.SERVICE_BASE_URL);
    }
    if (loginSession.IS_SUPPORT_ADMIN_LOGIN) {
        // Getting the user options for the selected examiner from support login.
        userOptionActionCreator.getUserOptions(false);
    }
    // To fetch the tags in parallel to the fecth worklist data call.
    tagActionCreator.getTags();
    /* Call to fetch awarding access details. Calling hereto handle admin support login as well. */
    awardingActionCreator.getAwardingAccessDetails();
    // Call background pulse action creator
    backgroundPulseHelper.handleBackgroundPulse();
    // Set interval for background pulse
    backgroundPulseHelper.setInterval(config.general.NOTIFICATION_TIMER_INTERVAL, backgroundPulseHelper.handleBackgroundPulse, backgroundPulseHelper.getBackgroundPulseArgument);
    // Call to get simulation exited qigs
    simulationModeHelper.handleSimulationExitedQigsAndLocksInQig(false);
    NavigationHelper.loadQigSelector();
};
NavigationHelper.staticConstructor();
module.exports = NavigationHelper;
//# sourceMappingURL=navigationhelper.js.map