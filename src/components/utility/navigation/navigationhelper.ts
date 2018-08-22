import enums = require('../enums');
import treeViewItem = require('../../../stores/markschemestructure/typings/treeviewitem');
import treeViewDataHelper = require('../../../utility/treeviewhelpers/treeviewdatahelper');
import historyInfo = require('../../../utility/breadcrumb/historyitem');
declare let config: any;
import navigationWarningInfo = require('./typings/navigationwarninginfo');
import storageAdapterHelper = require('../../../dataservices/storageadapters/storageadapterhelper');

let loginSession;
let navigationStore;
let userOptionActionCreator;
let userOptionsHelper;
let worklistActionCreator;
let responseStore;
let marksAndAnnotationsSaveHelper;
let markingActionCreator;
let markingHelper;
let worklistStore;
let messageStore;
let markingStore;
let messagingActionCreator;
let localeStore;
let exceptionActionCreator;
let applicationStore;
let loadContainerActionCreator;
let markSchemeHelper;
let responseActionCreator;
let qualityfeedbackHelper;
let popupHelper;
let userInfoStore;
let constants;
let applicationActionCreator;
let popupDisplayActionCreator;
let markerOperationModeFactory;
let userInfoActionCreator;
let qigStore;
let responseHelper;
let teamManagementStore;
let teamManagementActionCreator;
let qigSelectorActionCreator;
let responseSearchHelper;
let dataServiceHelper;
let examinerStore;
let stampActionCreator;
let markingCheckActionCreator;
let eCourseworkActionCreator;
let stampStore;
let combinedWarningPopupHelper;
let eCourseworkHelper;
let simulationModeHelper;
let keyDownHelper;
let standardisationSetupStore;
let standardisationActionCreator;
let promise;
let backgroundPulseHelper;
let awardingActionCreator;
let tagActionCreator;
let htmlviewerhelper;
let tagStore; // to create an instance of tagStore even though its not used in navigation helper.
let storageAdapterFactory;
let awardingStore;

/**
 * Navigation helper class
 */
class NavigationHelper {
    private static _navigationCollection = Array<string>();
    private static _navigationWarningInfo = new navigationWarningInfo();
    private static markHelper;
    private static nodetoReturn: treeViewItem;
    private static treeViewHelper: treeViewDataHelper;
    private static storageAdapterHelper: storageAdapterHelper;

    /**
     * Constructor
     */
    public constructor() {
        //Default constructor
    }

    /**
     * Static constructor
     */
    public static staticConstructor() {
        NavigationHelper.loadDependencies();
    }

    /**
     *  This will load the dependencies dynamically during component mount.
     */
    private static async loadDependencies() {
        // here await is used to handle the asynchronus imports.
        await (
                import('../../../app/loginsession')
                .then(_loginSession => { loginSession = _loginSession; }),
                import('../../../stores/navigation/navigationstore')
                            .then(_navigationStore => { navigationStore = _navigationStore; }),
                import('../../../actions/useroption/useroptionactioncreator').then(
                    _userOptionActionCreator => { userOptionActionCreator = _userOptionActionCreator; }),
                import('../../../utility/useroption/useroptionshelper').then(
                    _userOptionsHelper => { userOptionsHelper = _userOptionsHelper; }),
                import('../../../actions/worklist/worklistactioncreator').then(
                    _worklistActionCreator => { worklistActionCreator = _worklistActionCreator; }),
                import('../../../stores/response/responsestore').then(_responseStore => { responseStore = _responseStore; }),
                import('../../../utility/marking/marksandannotationssavehelper').then(
                    _marksAndAnnotationsSaveHelper => { marksAndAnnotationsSaveHelper = _marksAndAnnotationsSaveHelper; }),
                import('../../../actions/marking/markingactioncreator')
                            .then(_markingActionCreator => { markingActionCreator = _markingActionCreator; }),
                import('../../../utility/markscheme/markinghelper').then(_markingHelper => { markingHelper = _markingHelper; }),
                import('../../../stores/worklist/workliststore').then(_worklistStore => { worklistStore = _worklistStore; }),
                import('../../../stores/message/messagestore').then(_messageStore => { messageStore = _messageStore; }),
                import('../../../stores/marking/markingstore').then(_markingStore => { markingStore = _markingStore; }),
                import('../../../actions/messaging/messagingactioncreator').then(
                    _messagingActionCreator => { messagingActionCreator = _messagingActionCreator; }),
                import('../../../stores/locale/localestore').then(_localeStore => { localeStore = _localeStore; }),
                import('../../../actions/exception/exceptionactioncreator')
                            .then(_exceptionActionCreator => { exceptionActionCreator = _exceptionActionCreator; }),
                import('../../../stores/applicationoffline/applicationstore').then(
                    _applicationStore => { applicationStore = _applicationStore; }),
                import('../../../actions/navigation/loadcontaineractioncreator')
                            .then(_loadContainerActionCreator => { loadContainerActionCreator = _loadContainerActionCreator; }),
                import('../../../utility/markscheme/markschemehelper').then(
                    _markSchemeHelper => { markSchemeHelper = _markSchemeHelper; }),
                import('../../../actions/response/responseactioncreator').then(
                    _responseActionCreator => { responseActionCreator = _responseActionCreator; }),
                import('../../../utility/qualityfeedback/qualityfeedbackhelper').then(
                    _qualityfeedbackHelper => { qualityfeedbackHelper = _qualityfeedbackHelper; }),
                import('../popup/popuphelper').then(_popupHelper => { popupHelper = _popupHelper; }),
                import('../../../stores/userinfo/userinfostore').then(_userInfoStore => { userInfoStore = _userInfoStore; }),
                import('../constants').then(_constants => { constants = _constants; }),
                import('../../../actions/applicationoffline/applicationactioncreator').then(
                    _applicationActionCreator => { applicationActionCreator = _applicationActionCreator; }),
                import('../../../actions/popupdisplay/popupdisplayactioncreator').then(
                    _popupDisplayActionCreator => { popupDisplayActionCreator = _popupDisplayActionCreator; }),
                import('../markeroperationmode/markeroperationmodefactory').then(
                    _markerOperationModeFactory => { markerOperationModeFactory = _markerOperationModeFactory; }),
                import('../../../actions/userinfo/userinfoactioncreator').then(
                    _userInfoActionCreator => { userInfoActionCreator = _userInfoActionCreator; }),
                import('../../../stores/qigselector/qigstore').then(_qigStore => { qigStore = _qigStore; }),
                import('../responsehelper/responsehelper').then(_responseHelper => { responseHelper = _responseHelper; }),
                import('../../../stores/teammanagement/teammanagementstore').then(
                    _teamManagementStore => { teamManagementStore = _teamManagementStore; }),
                import('../../../actions/teammanagement/teammanagementactioncreator').then(
                    _teamManagementActionCreator => { teamManagementActionCreator = _teamManagementActionCreator; }),
                import('../../../actions/qigselector/qigselectoractioncreator').then(
                    _qigSelectorActionCreator => { qigSelectorActionCreator = _qigSelectorActionCreator; }),
                import('../../../utility/responsesearch/responsesearchhelper').then(
                    _responseSearchHelper => { responseSearchHelper = _responseSearchHelper; }),
                import('../../../utility/generic/dataservicehelper').then(
                    _dataServiceHelper => { dataServiceHelper = _dataServiceHelper; }),
                import('../../../stores/markerinformation/examinerstore').then(_examinerStore => { examinerStore = _examinerStore; }),
                import('../../../actions/stamp/stampactioncreator').then(
                    _stampActionCreator => { stampActionCreator = _stampActionCreator; }),
                import('../../../actions/markingcheck/markingcheckactioncreator').then(
                    _markingCheckActionCreator => { markingCheckActionCreator = _markingCheckActionCreator; }),
                import('../../../actions/ecoursework/ecourseworkresponseactioncreator').then(
                    _eCourseworkActionCreator => { eCourseworkActionCreator = _eCourseworkActionCreator; }),
                import('../../../stores/stamp/stampstore').then(_stampStore => { stampStore = _stampStore; }),
                import('../popup/responseerrordialoghelper').then(
                    _combinedWarningPopupHelper => { combinedWarningPopupHelper = _combinedWarningPopupHelper; }),
                import('../ecoursework/ecourseworkhelper').then(_eCourseworkHelper => { eCourseworkHelper = _eCourseworkHelper; }),
                import('../../../utility/simulation/simulationmodehelper').then(
                    _simulationModeHelper => { simulationModeHelper = _simulationModeHelper; }),
                import('../../../utility/generic/keydownhelper').then(_keyDownHelper => { keyDownHelper = _keyDownHelper; }),
                import('../../../stores/standardisationsetup/standardisationsetupstore').then(
                    _standardisationSetupStore => { standardisationSetupStore = _standardisationSetupStore; }),
                import('../../../actions/standardisationsetup/standardisationactioncreator').then(
                    _standardisationActionCreator => { standardisationActionCreator = _standardisationActionCreator; }),
                import('es6-promise').then(_promise => { promise = _promise; }),
                import('../../../utility/backgroundpulse/backgroundpulsehelper').then(
                    _backgroundPulseHelper => { backgroundPulseHelper = _backgroundPulseHelper; }),
                import('../../../actions/awarding/awardingactioncreator').then(
                    _awardingActionCreator => { awardingActionCreator = _awardingActionCreator; }),
                import('../../../actions/tag/tagactioncreator').then(_tagActionCreator => { tagActionCreator = _tagActionCreator; }),
                import('../responsehelper/htmlviewerhelper').then(_htmlviewerhelper => { htmlviewerhelper = _htmlviewerhelper; }),
                import('../../../stores/tags/tagstore').then(_tagStore => { tagStore = _tagStore; }),
				import('../../../dataservices/storageadapters/storageadapterfactory').then(
                    _storageAdapterFactory => { storageAdapterFactory = _storageAdapterFactory; }),
                import('../../../stores/awarding/awardingstore').then(
                    _awardingStore => { awardingStore = _awardingStore; })
            );
    }

    /**
     * Get navigation warning information
     */
    public static get navigationWarningInfo() {
        return NavigationHelper._navigationWarningInfo;
    }

    /*
     * Get navigation store instance
     */
    public static get storeInstance() {
        return navigationStore.instance;
    }

    /**
     * Get navigation store
     */
    public static get store() {
        return navigationStore.NavigationStore;
    }

    /**
     * Set navigation warning information
     */
    public static setNavigationWarningInfo(): void {
        NavigationHelper._navigationWarningInfo.warningMessageHeader = 'assessor3.warning.logout.confirmationdialog-header';
        NavigationHelper._navigationWarningInfo.warningMessageContent = 'assessor3.warning.logout.confirmationdialog-content';
        NavigationHelper._navigationWarningInfo.warningMessageYesButtonText =
            'assessor3.warning.logout.confirmationdialog-yes-button-text';
        NavigationHelper._navigationWarningInfo.warningMessageNoButtonText =
            'assessor3.warning.logout.confirmationdialog-no-button-text';
    }

    /**
     * Navigate to backward only if needed
     * @param containerPage
     * @param saveMarksAndAnnotationsProcessingTriggerPoint
     * @param context
     */
    public static loadContainerIfNeeded(containerPage: enums.PageContainers,
        saveMarksAndAnnotationsProcessingTriggerPoint: enums.SaveMarksAndAnnotationsProcessingTriggerPoint,
        context: any = undefined) {
        // if message url and handle it seperatly
        if (containerPage !== enums.PageContainers.Message) {
            marksAndAnnotationsSaveHelper.triggerMarksAndAnnotationsQueueProcessing(saveMarksAndAnnotationsProcessingTriggerPoint,
                () => {
                    if (saveMarksAndAnnotationsProcessingTriggerPoint === enums.SaveMarksAndAnnotationsProcessingTriggerPoint.Inbox) {
                        NavigationHelper.clearWorkListCache();

                        if (simulationModeHelper.shouldCheckForStandardisationSetupCompletion()) {
                            simulationModeHelper.checkStandardisationSetupCompletion(
                                enums.PageContainers.Response, enums.PageContainers.Message);
                        } else {
                            NavigationHelper.loadMessagePage();
                        }
                    } else if (saveMarksAndAnnotationsProcessingTriggerPoint
                        === enums.SaveMarksAndAnnotationsProcessingTriggerPoint.CloseResponse
                        || containerPage === enums.PageContainers.Response) {

                        // block navigation if save is inProgress
                        if (!marksAndAnnotationsSaveHelper.isSaveInProgress) {
                            if (markingStore && markingStore.instance.navigateTo === enums.SaveAndNavigate.toQigSelector) {
                                NavigationHelper.loadQigSelector();
                            } else if (markingStore && markingStore.instance.navigateTo === enums.SaveAndNavigate.toMenu) {
                                userInfoActionCreator.changeMenuVisibility();
                            } else if (markingStore && markingStore.instance.navigateTo === enums.SaveAndNavigate.toTeam) {
                                NavigationHelper.loadTeamManagement();
                            } else if (markingStore && (markingStore.instance.navigateTo === enums.SaveAndNavigate.toProvisional
                                || markingStore.instance.navigateTo === enums.SaveAndNavigate.toUnclassified
                                || markingStore.instance.navigateTo === enums.SaveAndNavigate.toClassified
                                || markingStore.instance.navigateTo === enums.SaveAndNavigate.toSelectResponses)) {
                                NavigationHelper.loadStandardisationSetup();
                            } else if (markingStore && (markingStore.instance.navigateTo === enums.SaveAndNavigate.toAwarding)) {
                                NavigationHelper.loadAwardingPage();
                            } else {
                                NavigationHelper.loadWorklist();
                            }
                        }
                    }
                });
        } else if (saveMarksAndAnnotationsProcessingTriggerPoint !== enums.SaveMarksAndAnnotationsProcessingTriggerPoint.Inbox) {
            NavigationHelper.loadWorklist();
        }
    }

    /**
     * load particular container
     */
    public static loadContainer(): void {
        loadContainerActionCreator.loadContainer(navigationStore.instance.previousPage);
    }

    /**
     * Save user option, clear session and logout
     */
    public static clearSession(): void {
        userOptionsHelper.InitiateSaveUserOption(true);
        userOptionsHelper.resetTokensAndRedirect();
        // Reset to home page url once logout
        // This will disable forward button on logout
        loadContainerActionCreator.loadContainer(enums.PageContainers.Login);
    }

    /**
     * load inbox page
     */
    public static loadMessagePage(): void {

        if (worklistStore.instance.isMarkingCheckMode) {
            // reseting the marking check mode while navigating to inbox
            markingCheckActionCreator.toggleMarkingCheckMode(false);
        }

        loadContainerActionCreator.loadContainer(enums.PageContainers.Message);
    }

    /**
     * load response page
     */
    public static loadResponsePage(): void {
        let containerPageType: enums.PageContainersType = enums.PageContainersType.None;

        // Reset search response flag after opening response
        responseActionCreator.resetSearchResponse();
        // check for ecoursework component to load ecoursework container
        if (eCourseworkHelper.isECourseworkComponent) {
            containerPageType = enums.PageContainersType.ECourseWork;
        } else if (htmlviewerhelper.isHtmlComponent) {
            containerPageType = enums.PageContainersType.HtmlView;
        }
        loadContainerActionCreator.loadContainer(enums.PageContainers.Response, false, containerPageType);
    }

    /**
     * This is required while navigating to worklist from any page else there are chances of causing
     * errors while clicking browser back button
     */
    public static loadWorklist(isFromMenu: boolean = false): void {

        loadContainerActionCreator.loadContainer(enums.PageContainers.WorkList, isFromMenu);
    }

    /**
     * called when the user tries to navigate away from the page/ close the browser
     * @param {any} e event
     * @returns
     */
    public static onBeforeWindowUnload(e: any) {
        let confirmationMessage = localeStore.instance.TranslateText('generic.browser-warnings.close-browser-warning');
        (e || window.event).returnValue = confirmationMessage;     //Gecko + IE
        return confirmationMessage;
    }

    /**
     * load team management page
     */
    public static loadTeamManagement(isFromMenu: boolean = false): void {
        loadContainerActionCreator.loadContainer(enums.PageContainers.TeamManagement, isFromMenu);
    }

    /**
     * load standardisation page
     */
    public static loadStandardisationSetup() {
        loadContainerActionCreator.loadContainer(enums.PageContainers.StandardisationSetup, false);
    }

    /**
     * load team qigSelector
     */
    public static loadQigSelector(): void {
        userInfoActionCreator.changeOperationMode(enums.MarkerOperationMode.Marking);
        loadContainerActionCreator.loadContainer(enums.PageContainers.QigSelector);
    }

    /**
     * load login page
     */
    public static loadLoginPage(): void {
        loadContainerActionCreator.loadContainer(enums.PageContainers.Login);
    }

    /**
     * load Awarding page
     */
    public static loadAwardingPage(isFromMenu: boolean = false): void {
        userInfoActionCreator.changeOperationMode(enums.MarkerOperationMode.Awarding, false, isFromMenu);
        loadContainerActionCreator.loadContainer(enums.PageContainers.Awarding);
    }

    /**
     * load reports page
     */
    public static loadReportsPage(): void {
        loadContainerActionCreator.loadContainer(enums.PageContainers.Reports);
    }

    /**
     * load team SupportLogin
     */
	public static loadSupportLogin(isFromSwitchUser: boolean = false): void {
		// If loading support admin page then clear the in memory cache.
		if (isFromSwitchUser) {
			storageAdapterFactory.resetInMemmoryInstance();
		}
		loadContainerActionCreator.loadContainer(enums.PageContainers.AdminSupport, false, enums.PageContainersType.None, isFromSwitchUser);
	}

    /**
     * Call back function for response navigation
     * @param direction - response direction
     */
    public static responseNavigation(direction: enums.ResponseNavigation, isAfterResponseSubmit: boolean = false,
        nextresponseId?: number): void {
        // To show the simulation popup before response navigation
        if (!qigStore.instance.getSelectedQIGForTheLoggedInUser.standardisationSetupComplete &&
            !markerOperationModeFactory.operationMode.isStandardisationSetupMode) {
            let standardisationCompletepromise = qigSelectorActionCreator.checkStandardisationSetupCompleted(
                qigStore.instance.getSelectedQIGForTheLoggedInUser.markSchemeGroupId,
                enums.PageContainers.Response,
                enums.PageContainers.WorkList);
            promise.Promise.all([standardisationCompletepromise]).then(function (data: any) {
                if (data[0] === false) {
                    NavigationHelper.continueResponseNavigation(direction, isAfterResponseSubmit, nextresponseId);
                }
            });
        } else {
            NavigationHelper.continueResponseNavigation(direction, isAfterResponseSubmit, nextresponseId);
        }
    }

    /**
     * Call back function for response navigation
     * @param direction - response direction
     */
    public static continueResponseNavigation(direction: enums.ResponseNavigation, isAfterResponseSubmit: boolean,
        nextresponseId?: number): void {
        let responseId: number;
        let isSelectResponsesTabInStdSetup: boolean = standardisationSetupStore.instance.isSelectResponsesWorklist;
        if (direction === enums.ResponseNavigation.next) {
            if (isAfterResponseSubmit) {
                responseId = responseStore.instance.nextResponseIdAfterSubmit;
            } else {
                responseId = isSelectResponsesTabInStdSetup ?
                    (standardisationSetupStore.instance.isNextScriptAvailableForNavigation ?
                        standardisationSetupStore.instance.nextCandidateScript : null) :
                    nextresponseId ? nextresponseId :
                    parseInt(markerOperationModeFactory.operationMode.nextResponseId(responseStore.instance.selectedDisplayId.toString()));
            }
        } else if (direction === enums.ResponseNavigation.previous) {
            responseId = isSelectResponsesTabInStdSetup ?
                (standardisationSetupStore.instance.isPreviousScriptAvailableForNavigation ?
                    standardisationSetupStore.instance.previousCandidateScript : null) :
                parseInt(markerOperationModeFactory.operationMode.previousResponseId(responseStore.instance.selectedDisplayId.toString()));
        } else if (direction === enums.ResponseNavigation.first) {
            responseId = isSelectResponsesTabInStdSetup ?
                standardisationSetupStore.instance.firstCandidateScript :
                parseInt(markerOperationModeFactory.operationMode.getIfOfFirstResponse);
        } else if (direction === enums.ResponseNavigation.last) {
            /* last response of the selected centre id */
            responseId = standardisationSetupStore.instance.lastCandidateScript;
        }

        /* responseId will be null, only if the response belongs to the next/previous centre*/
        if (responseId === null) {
            let centreDetails: StandardisationCentreDetails =
                standardisationSetupStore.instance.centreDetailsByItsPosition(direction);

            standardisationActionCreator.getScriptsOfSelectedCentre
                (standardisationSetupStore.instance.markSchemeGroupId,
                qigStore.instance.selectedQIGForMarkerOperation.questionPaperPartId, centreDetails.centrePartId, false,
                standardisationSetupStore.instance.examinerRoleId, centreDetails.uniqueId, true,
                (direction === enums.ResponseNavigation.next) ? enums.ResponseNavigation.first : enums.ResponseNavigation.last);
        } else {

            if (isSelectResponsesTabInStdSetup) {
                eCourseworkHelper.fetchECourseWorkCandidateScriptMetadata(responseId, false, true);
                responseHelper.openResponse(
                    responseId,
                    direction,
                    enums.ResponseMode.closed,
                    0,
                    responseStore.instance.selectedResponseViewMode);
            } else {
                let openedResponseDetails = markerOperationModeFactory.operationMode.openedResponseDetails(responseId.toString());
                let isStandardisationSetupMode = markerOperationModeFactory.operationMode.isStandardisationSetupMode;

                responseHelper.openResponse(
                    responseId,
                    direction,
                    isStandardisationSetupMode ?
                        standardisationSetupStore.instance.selectedStandardisationSetupWorkList
                            === enums.StandardisationSetup.SelectResponse ? enums.ResponseMode.closed :
                            enums.ResponseMode.open : worklistStore.instance.getResponseMode,
                    isStandardisationSetupMode ? openedResponseDetails.esMarkGroupId : openedResponseDetails.markGroupId,
                    responseStore.instance.selectedResponseViewMode,
                    null,
                    openedResponseDetails.sampleReviewCommentId,
                    openedResponseDetails.sampleReviewCommentCreatedBy);

                let markingMode = worklistStore.instance.getMarkingModeByWorkListType(worklistStore.instance.currentWorklistType);

                /* get the marks for the selected response */
                markSchemeHelper.getMarks(responseId, markingMode);
                eCourseworkHelper.fetchECourseWorkCandidateScriptMetadata(responseId);
            }
        }
    }

    /**
     * This method will returns true if response navigation is allowed hence it will returns false.
     */
    public static navigationAllowed(direction: enums.ResponseNavigation, isNextResponseAvailable: boolean,
        isPreviousResponseAvailable: boolean) {
        if (qualityfeedbackHelper.isResponseNavigationBlocked()) {
            return false;
        } else if ((direction === enums.ResponseNavigation.next && isNextResponseAvailable) ||
            (direction === enums.ResponseNavigation.previous && isPreviousResponseAvailable)) {
            return true;
        } else {
            return false;
        }
    }

    /**
     * Handles the click
     * @param {any} source
     * @returns
     */
    public static handleNavigation = (navigateTo: enums.SaveAndNavigate): any => {
        //If the worklist button is clicked within worklist with edited message panel discard popup should be shown
        if (messageStore.instance.isMessagePanelActive &&
            navigationStore.instance.containerPage === enums.PageContainers.WorkList &&
            navigateTo !== enums.SaveAndNavigate.toQigSelector &&
            navigateTo !== enums.SaveAndNavigate.toTeam) {
            let messageNavigationArguments: MessageNavigationArguments = {
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

        } else if (navigationStore.instance.containerPage === enums.PageContainers.Message) {
            // display mandatory message popup
            if (messageStore.instance.hasUnReadMandatoryMessages) {
                popupDisplayActionCreator.popUpDisplay(enums.PopUpType.MandatoryMessage, enums.PopUpActionType.Show, null, null);

            } else {
                if (messageStore.instance.isMessagePanelActive) {
                    // we have to display discard message warning
                    messagingActionCreator.messageAction(enums.MessageViewAction.NavigateAway, enums.MessageType.None,
                        navigateTo);
                } else {

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
        } else if (navigationStore.instance.containerPage === enums.PageContainers.WorkList) {
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
            } else if (navigateTo === enums.SaveAndNavigate.toMenu && !messageStore.instance.isMessagePanelActive) {
                userInfoActionCreator.changeMenuVisibility();
            } else if (navigateTo === enums.SaveAndNavigate.toQigSelector && messageStore.instance.isMessagePanelActive) {
                let responseNavigationFailureReasons: Array<enums.ResponseNavigateFailureReason> =
                    markingHelper.canNavigateAwayFromCurrentResponse();
                if (responseNavigationFailureReasons.length > 0) {
                    popupHelper.navigateAwayFromResponse(responseNavigationFailureReasons, navigateTo);
                }
            } else if (navigateTo === enums.SaveAndNavigate.toWorklist) {
                // Invoke the action creator to Open the QIG
                qigSelectorActionCreator.openQIG(qigStore.instance.selectedQIGForMarkerOperation.markSchemeGroupId);

                if (!navigationStore.instance.getRecentHistory.filter(
                    (_historyInfo: historyInfo) => _historyInfo.qigId ===
                        qigStore.instance.selectedQIGForMarkerOperation.markSchemeGroupId).first().myMarking.responseMode) {
                    //Reset the response mode to Open.to show the Open tab selected
                    worklistActionCreator.responseModeChanged(enums.ResponseMode.open);
                    qigSelectorActionCreator.navigateToWorklistFromQigSelector();
                }

                let historyInfo: historyInfo = navigationStore.instance.getRecentHistory.filter(
                    (_historyInfo: historyInfo) => _historyInfo.qigId ===
                        qigStore.instance.selectedQIGForMarkerOperation.markSchemeGroupId).first();
                historyInfo.timeStamp = Date.now();
                worklistActionCreator.setWorklistHistoryInfo(historyInfo, userInfoStore.instance.currentOperationMode);

                responseSearchHelper.openQIGDetails(
                    qigStore.instance.selectedQIGForMarkerOperation.questionPaperPartId,
                    qigStore.instance.selectedQIGForMarkerOperation.markSchemeGroupId,
                    qigStore.instance.selectedQIGForMarkerOperation.examinerRoleId,
                    dataServiceHelper.canUseCache(),
                    examinerStore.instance.examinerApprovalStatus(qigStore.instance.selectedQIGForMarkerOperation.examinerRoleId),
                    qigStore.instance.selectedQIGForMarkerOperation.markingMethod,
                    false,
                    qigStore.instance.selectedQIGForMarkerOperation.isElectronicStandardisationTeamMember);

                // load stamps defined for the selected mark scheme groupId
                stampActionCreator.getStampData(qigStore.instance.selectedQIGForMarkerOperation.markSchemeGroupId,
                    stampStore.instance.stampIdsForSelectedQIG,
                    qigStore.instance.selectedQIGForMarkerOperation.markingMethod,
                    responseHelper.isEbookMarking,
                    true);
            }

        } else if (navigationStore.instance.containerPage === enums.PageContainers.StandardisationSetup) {
            if (navigateTo === enums.SaveAndNavigate.toMenu) {
                userInfoActionCreator.changeMenuVisibility();
            } else {
                // set the marker operation mode as Marking
                userInfoActionCreator.changeOperationMode(enums.MarkerOperationMode.Marking);
                NavigationHelper.loadQigSelector();
            }
        } else {
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
                    || navigateTo === enums.SaveAndNavigate.toProvisional
                    || navigateTo === enums.SaveAndNavigate.toInboxMessagePage)) {
                let responseNavigationFailureReasons: Array<enums.ResponseNavigateFailureReason> =
                    markingHelper.canNavigateAwayFromCurrentResponse();
                if (responseNavigationFailureReasons.length > 0) {
                    popupHelper.navigateAwayFromResponse(responseNavigationFailureReasons, navigateTo);
                } else {
                    if (markingStore.instance.isMarkingInProgress) {
                        /* Save the selected mark scheme mark to the mark collection on response move */
                        markingActionCreator.saveAndNavigate(navigateTo);
                    } else {
                        markingActionCreator.updateNavigation(navigateTo);
                    }
                }
            } else if (markerOperationModeFactory.operationMode.isTeamManagementMode) {
                NavigationHelper.loadContainerInTeammanagementMode(navigateTo);
            } else {
                let responseNavigationFailureReasons: Array<enums.ResponseNavigateFailureReason> =
                    markingHelper.canNavigateAwayFromCurrentResponse();
                if (responseNavigationFailureReasons.length > 0) {
                    popupHelper.navigateAwayFromResponse(responseNavigationFailureReasons, navigateTo);
                } else {
                    if (worklistStore.instance.isMarkingCheckMode) {
                        if (navigateTo !== enums.SaveAndNavigate.toMarkingCheckWorklist &&
                            navigateTo !== enums.SaveAndNavigate.toMenu) {
                            markingCheckActionCreator.toggleMarkingCheckMode(false);
                        }
                        markingActionCreator.updateNavigation(navigateTo);
                    } else if (markingStore.instance.isMarkingInProgress) {
                        /* Save the selected mark scheme mark to the mark collection on response move */
                        markingActionCreator.saveAndNavigate(navigateTo);
                    } else {
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

    /**
     * this will shows the confirmation popup on logout based on the ask on logout value.
     */
    private static loadContainerInTeammanagementMode(navigateTo: enums.SaveAndNavigate) {
        let responseNavigationFailureReasons: Array<enums.ResponseNavigateFailureReason> =
            markingHelper.canNavigateAwayFromCurrentResponse();
        if (responseNavigationFailureReasons.length > 0) {
            let _responseNavigationFailureReasons: Array<enums.ResponseNavigateFailureReason> =
                new Array<enums.ResponseNavigateFailureReason>();
            responseNavigationFailureReasons.forEach((failure: enums.ResponseNavigateFailureReason) => {
                switch (failure) {
                    case enums.ResponseNavigateFailureReason.UnSentMessage:
                        _responseNavigationFailureReasons.push(enums.ResponseNavigateFailureReason.UnSentMessage);
                        break;
                    case enums.ResponseNavigateFailureReason.FileDownloadedOutside:
                        _responseNavigationFailureReasons.push(enums.ResponseNavigateFailureReason.FileDownloadedOutside);
                        break;
                }
            });

            popupHelper.navigateAwayFromResponse(_responseNavigationFailureReasons, navigateTo);
        } else {
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
                        let examinerValidationArea: enums.ExaminerValidationArea =
                            teamManagementStore.instance.selectedTeamManagementTab ===
                                enums.TeamManagement.HelpExaminers ? enums.ExaminerValidationArea.HelpExaminer :
                                enums.ExaminerValidationArea.TeamWorklist;
                        // validates the examiner status - Defect fix # 49590
                        teamManagementActionCreator.teamManagementExaminerValidation(
                            qigStore.instance.getSelectedQIGForTheLoggedInUser.markSchemeGroupId,
                            qigStore.instance.getSelectedQIGForTheLoggedInUser.examinerRoleId,
                            qigStore.instance.selectedQIGForMarkerOperation.examinerRoleId,
                            teamManagementStore.instance.examinerDrillDownData.examinerId,
                            examinerValidationArea,
                            false, null, enums.MarkingMode.None, 0, true);
                    } else {
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

    /**
     * this will shows the confirmation popup on logout based on the User Option value.
     */
    public static showLogoutConfirmation() {

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

        } else {
            let canLogout: boolean = true;
            let responseNavigationFailureReasons: Array<enums.ResponseNavigateFailureReason> =
                markingHelper.canNavigateAwayFromCurrentResponse();
            if (responseNavigationFailureReasons.length > 0) {
                //MarksMissingInGracePeriodResponse failure is not handled as part of combined response messages story, implemented old
                // message showing logic as implemented in popuphelper as part of combined response message story - Defect #49525
                if (responseNavigationFailureReasons.indexOf(enums.ResponseNavigateFailureReason.MarksMissingInGracePeriodResponse)
                    !== -1) {
                    canLogout = false;
                    markingActionCreator.showGracePeriodNotFullyMarkedMessage
                        (enums.ResponseNavigateFailureReason.MarksMissingInGracePeriodResponse);
                } else if (responseStore.instance.selectedMarkGroupId) {
                    canLogout = false;
                    let combinedWarningMessages = combinedWarningPopupHelper.getCombinedWarningMessage(enums.SaveAndNavigate.toLogout,
                        responseNavigationFailureReasons);
                    markingActionCreator.showResponseNavigationFailureReasons(enums.SaveAndNavigate.toLogout, combinedWarningMessages);
                    userInfoActionCreator.ToggleUserInfoPanel(false);
                } else {
                    responseNavigationFailureReasons.map((canNavigateAway: enums.ResponseNavigateFailureReason) => {

                        // The unsent message popup warning needs to be shown if any draft messages exist
                        if (canNavigateAway === enums.ResponseNavigateFailureReason.UnSentMessage &&
                            responseNavigationFailureReasons.length === 1) {
                            messagingActionCreator.messageAction(enums.MessageViewAction.NavigateAway, enums.MessageType.None,
                                enums.SaveAndNavigate.toLogout);
                            userInfoActionCreator.ToggleUserInfoPanel(false);
                        }

                        // The unsaved exception popup warning needs to be shown if any unsaved exceptions exist
                        if (canNavigateAway === enums.ResponseNavigateFailureReason.UnSavedException &&
                            responseNavigationFailureReasons.length === 1) {
                            exceptionActionCreator.exceptionWindowAction(enums.ExceptionViewAction.NavigateAway, null,
                                enums.SaveAndNavigate.toLogout);
                            userInfoActionCreator.ToggleUserInfoPanel(false);
                        }

                        canLogout = false;
                    });
                }
            }

            if (canLogout) {
                userInfoActionCreator.ToggleUserInfoPanel(false);
                // For a qig in simulation, check for SSU completion and show popup
                if (navigationStore.instance.containerPage !== enums.PageContainers.QigSelector &&
                    navigationStore.instance.containerPage !== enums.PageContainers.Message &&
                    simulationModeHelper.shouldCheckForStandardisationSetupCompletion()) {
                    simulationModeHelper.checkStandardisationSetupCompletion(enums.PageContainers.Login, enums.PageContainers.Login);
                } else {
                    // Checking whether there are any locked examiners currently.
                    qigSelectorActionCreator.getLocksInQigs(true);
                }
            }
        }
    }

    /**
     * This method will handle the response navigation
     */
    public static handleResponseNavigation(markingProgress?: number,
        navigateTo: enums.SaveAndNavigate = enums.SaveAndNavigate.toResponse) {
        if (NavigationHelper.navigationAllowed(enums.ResponseNavigation.next, true, false)) {
            NavigationHelper.markHelper = new markSchemeHelper();
            let isLastResponseLastQuestionItem = NavigationHelper.markHelper.isLastResponseLastQuestion;
            let responseNavigationFailureReasons: Array<enums.ResponseNavigateFailureReason> =
                new Array<enums.ResponseNavigateFailureReason>();
            responseNavigationFailureReasons = markingHelper.canNavigateAwayFromCurrentResponse(markingProgress);
            if (isLastResponseLastQuestionItem) {
                responseNavigationFailureReasons.push(enums.ResponseNavigateFailureReason.LastResponseLastQuestion);
            }

            if (responseNavigationFailureReasons.indexOf(enums.ResponseNavigateFailureReason.MarksMissingInGracePeriodResponse) === -1) {
                // if marking progressing and responseNavigationFailureReason contain none only
                markingActionCreator.saveAndNavigate(navigateTo, enums.ResponseNavigation.markScheme,
                    responseNavigationFailureReasons.length > 0);
            } else {
                popupHelper.navigateAwayFromResponse(responseNavigationFailureReasons, enums.SaveAndNavigate.toResponse,
                    enums.ResponseNavigation.markScheme, isLastResponseLastQuestionItem);
            }
        }
    }

    /**
     * This method will check whether we need to show return to worklist confirmation poup.
     */
    public static checkForMbqConfirmationPopup = (navigation: enums.ResponseNavigation) => {
        // checking whether we need to show return to worklist popup in mbq mode.
        if (markingStore.instance.showNavigationOnMbqPopup) {
            NavigationHelper.markHelper = new markSchemeHelper();
            let isLastResponseLastQuestionItem = NavigationHelper.markHelper.isLastResponseLastQuestion;
            let responseNavigationFailureReasons: Array<enums.ResponseNavigateFailureReason> =
                new Array<enums.ResponseNavigateFailureReason>();
            // If there is any navigation failure reason available then we will show respective popups.
            responseNavigationFailureReasons = markingHelper.canNavigateAwayFromCurrentResponse
                (markingStore.instance.currentResponseMarkingProgress);
            // if it is last question item of the last response ,then push that failure reason for showing popup
            if (isLastResponseLastQuestionItem) {
                responseNavigationFailureReasons.push(enums.ResponseNavigateFailureReason.LastResponseLastQuestion);
            }
            if (responseNavigationFailureReasons.length > 0) {
                popupHelper.navigateAwayFromResponse(responseNavigationFailureReasons, enums.SaveAndNavigate.toResponse,
                    enums.ResponseNavigation.markScheme, isLastResponseLastQuestionItem);
                // activate keydown since it deactivated from triggersave after return to worklist popup
                keyDownHelper.instance.Activate(enums.MarkEntryDeactivator.TriggerSave);
                return;
            }
        }
        markingActionCreator.navigationAfterMarkConfirmation(navigation);
    }

    /**
     * This method will return first unmarked question item of the response.
     */

    public static getFirstUnmarkedItem(nodes: treeViewItem, clear: boolean = false) {
        if (clear) {
            this.nodetoReturn = null;
        }
        let firstUnmarkedItem: number;
        let nodeDetails = nodes.treeViewItemList;
        nodeDetails.some((node: treeViewItem) => {
            // Iterate the treeViewItem ,exit the loop once it found the first unmarked item.
            if (node.itemType === enums.TreeViewItemType.marksScheme &&
                (node.allocatedMarks.displayMark === constants.NOT_MARKED || node.allocatedMarks.displayMark === constants.NO_MARK)
                && (this.nodetoReturn === undefined || this.nodetoReturn == null)) {
                this.nodetoReturn = node;
                return true;
            }
            if (node.treeViewItemList && node.treeViewItemList.count() > 0
                && (this.nodetoReturn === undefined || this.nodetoReturn == null)) {
                this.getFirstUnmarkedItem(node, false);
            }
        });
        return this.nodetoReturn;
    }

    /**
     * This method will Clear worklist cache and do content refresh.
     */
    private static clearWorkListCache() {
        let markingMode =
            worklistStore.instance.getMarkingModeByWorkListType(worklistStore.instance.currentWorklistType);
        let _storageAdapterHelper = new storageAdapterHelper();
        _storageAdapterHelper.clearCache(qigStore.instance.selectedQIGForMarkerOperation.markSchemeGroupId,
            markingMode,
            worklistStore.instance.getRemarkRequestType,
            qigStore.instance.selectedQIGForMarkerOperation.examinerRoleId,
            worklistStore.instance.currentWorklistType);
    }

    /**
     * Navigate to QIG Selector component
     */
    public static navigateToQigSelector = (isPassResetSuccess: string): void => {
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

        /* Call to fetch awarding access details. Calling here to handle admin support login as well. */
        awardingActionCreator.getAwardingAccessDetails();
        // Call background pulse action creator
        backgroundPulseHelper.handleBackgroundPulse();
        // Set interval for background pulse
        backgroundPulseHelper.setInterval(
            config.general.NOTIFICATION_TIMER_INTERVAL,
            backgroundPulseHelper.handleBackgroundPulse,
            backgroundPulseHelper.getBackgroundPulseArgument
        );

        // Call to get simulation exited qigs
        simulationModeHelper.handleSimulationExitedQigsAndLocksInQig(false);

        NavigationHelper.loadQigSelector();
    }

}

NavigationHelper.staticConstructor();
export = NavigationHelper;