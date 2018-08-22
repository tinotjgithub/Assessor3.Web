"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
/* tslint:disable:no-unused-variable */
/** Add new dependencies in loadDependencies() method unless your dependencies are not using in constructor */
var React = require('react');
/* tslint:enable:no-unused-variable */
var pureRenderComponent = require('../base/purerendercomponent');
var configurableCharacteristicsNames = require('../../utility/configurablecharacteristic/configurablecharacteristicsnames');
var configurableCharacteristicsHelper = require('../../utility/configurablecharacteristic/configurablecharacteristicshelper');
var enums = require('../utility/enums');
var Header = require('../header');
var allocateResponseHelper = require('../utility/responseallocation/allocateresponseshelper');
var markerInformationActionCreator = require('../../actions/markerinformation/markerinformationactioncreator');
var responseActionCreator = require('../../actions/response/responseactioncreator');
var BusyIndicator = require('../utility/busyindicator/busyindicator');
var navigationHelper = require('../utility/navigation/navigationhelper');
var Promise = require('es6-promise');
var userOptionsHelper = require('../../utility/useroption/useroptionshelper');
var useroptionKeys = require('../../utility/useroption/useroptionkeys');
var userOptionsStore = require('../../stores/useroption/useroptionstore');
var stringHelper = require('../../utility/generic/stringhelper');
var ccStore = require('../../stores/configurablecharacteristics/configurablecharacteristicsstore');
var MarkingInstructionPanel = require('./markerinformation/markinginstructionpanel');
var urls = require('../../dataservices/base/urls');
var MultiOptionConfirmationDialog = require('../utility/multioptionconfirmationdialog');
var storageAdapterHelper = require('../../dataservices/storageadapters/storageadapterhelper');
var responseHelper = require('../utility/responsehelper/responsehelper');
var markSchemeHelper = require('../../utility/markscheme/markschemehelper');
var dataServiceHelper = require('../../utility/generic/dataservicehelper');
var workListDataHelper = require('../../utility/worklist/worklistdatahelper');
var markerOperationModeFactory = require('../utility/markeroperationmode/markeroperationmodefactory');
var teamManagementAuditHelper = require('../utility/teammanagement/teammanagementlogginghelper');
var loggerConstants = require('../utility/loggerhelperconstants');
var eCourseworkHelper = require('../utility/ecoursework/ecourseworkhelper');
var qigSelectorActionCreator = require('../../actions/qigselector/qigselectoractioncreator');
var simulationModeHelper = require('../../utility/simulation/simulationmodehelper');
var applicationStore = require('../../stores/applicationoffline/applicationstore');
var applicationActionCreator = require('../../actions/applicationoffline/applicationactioncreator');
var teamManagementStore = require('../../stores/teammanagement/teammanagementstore');
var htmlviewerhelper = require('../utility/responsehelper/htmlviewerhelper');
var markingInstructionStore = require('../../stores/markinginstruction/markinginstructionstore');
var MarkingInstructionFilePanel = require('./markerinformation/markinginstructionfilepanel');
var domManager = require('../../utility/generic/domhelper');
var markingInstructioActionCreator = require('../../actions/markinginstructions/markinginstructionactioncreator');
/** Add new dependencies in loadDependencies() method unless your dependencies are not using in constructor */
/* tslint:disable:variable-name */
var MarkerInformationPanel;
var localeStore;
var userOptionActionCreator;
var qigStore;
var examinerstore;
var WorkListMessage;
var ConfirmationDialog;
var MarkingProgress;
var stampStore;
var responseSearchHelper;
var Targets;
var overviewData;
var qigInfo;
var markingTarget;
var targetSummaryStore;
var markingTargetSummary;
var userOptionStore;
var WorkListContainer;
var worklistStore;
var markSchemeStructureStore;
var responseStore;
var worklistActionCreator;
var GenericDialog;
var responseAllocationValidationHelper;
var responseAllocationValidationParameter;
var classNames;
var busyIndicatorStore;
var submitStore;
var worklistComponentHelper;
var submitActionCreator;
var busyIndicatorActionCreator;
var scriptImageDownloadHelper;
var scriptActionCreator;
var scriptStore;
var scriptImageDownloader;
var targetHelper;
var userInfoStore;
var backgroundPulseHelper;
var Footer;
var gaHelper;
var stampActionCreator;
var configurableCharacteristicsStore;
var configurableCharacteristicsActionCreator;
var qigActionCreator;
var exceptionActionCreator;
var exceptionStore;
var MessagePopup;
var messageHelper;
var messagingActionCreator;
var messageStore;
var MarkingCheckPopup;
var stringFormatHelper;
var htmlUtilities;
var loadContainerActionCreator;
var operationModeHelper;
var teamManagementActionCreator;
var MarkCheckExaminers;
var markingCheckActionCreator;
var userInfoActionCreator;
var ExaminerStateChangePopup;
var helpExaminersDataHelper;
var warningMessageStore;
var warningMessageNavigationHelper;
var markingInstructionActionCreator;
/**
 * React component for Worklist/Landing
 */
var WorkList = (function (_super) {
    __extends(WorkList, _super);
    /**
     * @constructor
     */
    function WorkList(props, state) {
        var _this = this;
        _super.call(this, props, state);
        /** flag to show busy indicator in worklist tabs */
        this.isRefreshing = false;
        /* has all the data refresh call succeeded set true initially it need only for standardization*/
        this.isContentRefreshSucceeded = {
            isMarkingProgressCompleted: false,
            isWorklistRefreshCompleted: false
        };
        /* variable to identify whether the exam body CC is loaded or not */
        this.isExamBodyCCLoaded = false;
        // this variable will hold the message panel visiblity status.
        this.isMessagePopupVisible = false;
        this.subject = '';
        this.priorityDropdownSelectedItem = enums.MessagePriority.Standard;
        this.qigListItems = new Array();
        this.isTouchStarted = false;
        this.isMouseHovered = false;
        this.storageAdapterHelper = new storageAdapterHelper();
        this.failureCode = enums.FailureCode.None;
        this.warningMessageAction = enums.WarningMessageAction.None;
        this.isSelectedMenuTargetCompleted = false;
        this.hasTargetFound = true;
        this.columnLeftScrollWidth = 0;
        this._boundHandleOnClick = null;
        /**
         * Prepare work list after initialising worklist data
         */
        this.worklistInitialisationCompleted = function () {
            // load stamps defined for the selected mark scheme groupId
            stampActionCreator.getStampData(qigStore.instance.selectedQIGForMarkerOperation.markSchemeGroupId, stampStore.instance.stampIdsForSelectedQIG, qigStore.instance.selectedQIGForMarkerOperation.markingMethod, responseHelper.isEbookMarking, true);
            if (worklistStore.instance.isMarkingCheckMode) {
                _this.worklistInitialisationCompletedForMarkingCheck();
            }
            else {
                workListDataHelper.fetchRelatedDataForQIGAfterMarkSchemeStructureAndCC(markerOperationModeFactory.operationMode.isTeamManagementMode);
            }
        };
        /**
         * Handles the action when making check worklist is first loaded on 'here' link click
         */
        this.markCheckExaminersDataRetrived = function () {
            if (!worklistStore.instance.markingCheckExaminersList ||
                worklistStore.instance.markingCheckExaminersList.count() === 0) {
                navigationHelper.handleNavigation(enums.SaveAndNavigate.toWorklist);
            }
            else {
                _this.isRefreshing = true;
                responseSearchHelper.openQIGDetails(qigStore.instance.selectedQIGForMarkerOperation.questionPaperPartId, qigStore.instance.selectedQIGForMarkerOperation.markSchemeGroupId, worklistStore.instance.selectedMarkingCheckExaminer.examinerRoleID, false, examinerstore.instance.examinerApprovalStatus(qigStore.instance.selectedQIGForMarkerOperation.examinerRoleId), qigStore.instance.selectedQIGForMarkerOperation.markingMethod, false, qigStore.instance.selectedQIGForMarkerOperation.isElectronicStandardisationTeamMember);
            }
        };
        /**
         * Sets the corresponding marking check requester as selected in worklist store
         * calls getMarkingCheckWorklistForSelectedExaminer after updating selected examiner
         */
        this.onMarkingCheckRequesterExaminerClick = function (examinerId) {
            worklistActionCreator.onMarkingCheckRequesterExaminerSelected(examinerId);
        };
        /**
         * Selects the corresponding worklist for selected marking check requester examiner
         * when selected examiner in the store is updated
         */
        this.getMarkingCheckWorklistForSelectedExaminer = function () {
            _this.markCheckExaminersDataRetrived();
        };
        /**
         * Prepare work list after initialising worklist data
         */
        this.worklistInitialisationCompletedForMarkingCheck = function () {
            var selectedTab = (worklistStore.instance.selectedMarkingCheckExaminer.selectedTab !== null &&
                worklistStore.instance.selectedMarkingCheckExaminer.selectedTab !== undefined &&
                worklistStore.instance.selectedMarkingCheckExaminer.selectedTab !== enums.ResponseMode.none) ?
                worklistStore.instance.selectedMarkingCheckExaminer.selectedTab :
                targetSummaryStore.instance.currentResponseModeForMarkingCheck;
            worklistActionCreator.notifyWorklistTypeChange(qigStore.instance.selectedQIGForMarkerOperation.markSchemeGroupId, worklistStore.instance.selectedMarkingCheckExaminer.examinerRoleID, qigStore.instance.selectedQIGForMarkerOperation.questionPaperPartId, enums.WorklistType.live, selectedTab, enums.RemarkRequestType.Unknown, worklistStore.instance.isDirectedRemark, qigStore.instance.selectedQIGForMarkerOperation.isElectronicStandardisationTeamMember, false, worklistStore.instance.isMarkingCheckMode);
        };
        /**
         * Method to be invoked when a ExamBody CC is loaded.
         */
        this.onExamBodyCCLoaded = function () {
            _this.isExamBodyCCLoaded = true;
        };
        /**
         * Called after saving the user options
         */
        this.onUserOptionsLoaded = function () {
            var isMarkerInfoPanelExpanded;
            isMarkerInfoPanelExpanded = userOptionsHelper.getUserOptionByName(useroptionKeys.MARKER_INFO_PANEL_EXPANDED) === 'false' ? false : true;
            if (worklistStore.instance.isMarkingCheckMode) {
                _this.markCheckExaminersDataRetrived();
            }
            else {
                simulationModeHelper.checkStandardisationSetupCompletion(enums.PageContainers.WorkList, enums.PageContainers.WorkList);
                var isMultiQig = markerOperationModeFactory.operationMode.isTeamManagementMode ?
                    teamManagementStore.instance.multiQigSelectedDetail &&
                        teamManagementStore.instance.multiQigSelectedDetail.qigId ? true : false : false;
                qigActionCreator.getQIGSelectorData(markerOperationModeFactory.operationMode.getQigId, false, false, false, false, true, isMultiQig);
            }
            _this.setState({ enableNavigationPanelVisibility: isMarkerInfoPanelExpanded });
        };
        /**
         * refresh target progress for Examiner
         */
        this.refreshTargetProgress = function () {
            _this.worklistTabDetails = [];
            /** Getting  markingTargetsSummary from worklist store,
             * it will be updated if the worklist response collection changes
             */
            _this.markingTargetsSummary = targetHelper.getExaminerMarkingTargetProgress;
            var currentTarget = targetSummaryStore.instance.getCurrentTarget();
            // If the current target is simulation for the marker  then clear the simulation exited qigs cache
            // Since, on each home click while in simulation the simulation target completed qig list needs to be shown,
            // whenever the current target is simulation the cache is cleared.
            if (currentTarget.markingModeID === enums.MarkingMode.Simulation) {
                _this.storageAdapterHelper.clearCacheByKey('simulationexitedqigs', 'qigdata');
            }
            _this.worklistTabDetails = worklistComponentHelper.getWorklistTabDetails(worklistStore.instance.getMarkingModeByWorkListType(worklistStore.instance.currentWorklistType), true);
            if (_this.isContentRefreshStarted) {
                _this.isContentRefreshSucceeded.isMarkingProgressCompleted = true;
            }
            _this.checkIfContentRefreshCompleted();
            // Checks whether the current worklist type is disabled.
            var isTargetDisabled = _this.isSelectedWorklistTypeDisabled();
            if (isTargetDisabled) {
                _this.notifyWorklistTypeChange(allocateResponseHelper.getWorkListTypeByMarkingMode(targetHelper.getSelectedQigMarkingMode()), enums.ResponseMode.open);
            }
            var _worklistType = worklistStore.instance.currentWorklistType && !isTargetDisabled ?
                worklistStore.instance.currentWorklistType :
                allocateResponseHelper.getWorkListTypeByMarkingMode(targetHelper.getSelectedQigMarkingMode());
            var isWorklistTypeChanged = false;
            var remarkRequestType = worklistComponentHelper.getRemarkRequestType(_worklistType);
            // While submiting practice response allocate next target automatically.
            if (_this.isSubmitCompleted && allocateResponseHelper.isAllocationNeeded()) {
                /* Allocate the practise/standardisation responses */
                allocateResponseHelper.allocateQualificationResponses();
                _worklistType = allocateResponseHelper.getWorkListTypeByMarkingMode(targetHelper.getSelectedQigMarkingMode());
            }
            else if (_this.isSubmitCompleted || _this.isAllocationCompleted || _this.isSecondStandardisationTargetReceived) {
                /** Call to get response details to show in worklist */
                _worklistType = allocateResponseHelper.getWorkListTypeByMarkingMode(targetHelper.getSelectedQigMarkingMode());
                isWorklistTypeChanged = true;
            }
            var responseMode = targetSummaryStore.instance.getCurrentResponseMode(targetHelper.getMarkingModeByWorklistType(_worklistType), _worklistType, currentTarget.markingModeID);
            _this.isSelectedMenuTargetCompleted = targetHelper.isSelectedMenuCompleted((worklistStore.instance.getMarkingModeByWorkListType(worklistStore.instance.currentWorklistType)));
            // Reset responseMode only if current responsemode is not none and submitted response is not in QualityFeedbackOutstanding
            if (responseMode === enums.ResponseMode.none || qigStore.instance.selectedQIGForMarkerOperation.hasQualityFeedbackOutstanding) {
                _this.responseMode = _this.responseMode === undefined ? enums.ResponseMode.open : _this.responseMode;
            }
            else {
                _this.responseMode = responseMode;
            }
            /*
             * Sets the response mode based on quality feedback.
             */
            _this.responseMode = markerOperationModeFactory.operationMode.responseModeBasedOnQualityFeedbackForWorklist(_this.responseMode, targetHelper.getMarkingModeByWorklistType(_worklistType), remarkRequestType);
            if (_this.props.isFromMenu) {
                if ((_worklistType === enums.WorklistType.practice || _worklistType === enums.WorklistType.standardisation ||
                    _worklistType === enums.WorklistType.secondstandardisation) &&
                    _this.isSelectedMenuTargetCompleted) {
                    if (targetHelper.getExaminerQigStatus() === enums.ExaminerQIGStatus.LiveMarking) {
                        isWorklistTypeChanged = true;
                        _this.responseMode = enums.ResponseMode.closed;
                    }
                }
                if (_worklistType === enums.WorklistType.simulation) {
                    simulationModeHelper.checkStandardisationSetupCompletion(enums.PageContainers.WorkList, enums.PageContainers.WorkList, true);
                }
            }
            /**
             * isWorklistTypeChanged is set on scenarios after Submit and Allocation when Worklist needs refresh.
             * worklist call NOT needed in QIG selection where isWorklistTypeChanged will be False.
             */
            if (isWorklistTypeChanged === true) {
                _this.notifyWorklistTypeChange(_worklistType, _this.responseMode);
            }
            /** resetting the allocation,submit completed flag after loading the worklist */
            _this.isAllocationCompleted = false;
            _this.isSubmitCompleted = false;
            // If the marker is in live marking and does not have the limit specified, no need to set the worklist. Avoid busy indicator.
            if (_worklistType === undefined &&
                currentTarget.markingModeID === enums.MarkingMode.LiveMarking &&
                currentTarget.maximumMarkingLimit === 0) {
                _this.hasTargetFound = false;
            }
            _this.setState({
                targetRenderedOn: Date.now(),
                renderedOn: Date.now()
            });
        };
        /**
         * this will shows the confirmation popup on logout based on the ask on logout value.
         */
        this.showLogoutConfirmation = function () {
            _this.setState({ isLogoutConfirmationPopupDisplaying: true });
        };
        /**
         * Handles the action event while atypical search is triggered.
         */
        this.atypicalSearchClick = function (result) {
            var messageKey = '';
            var messageHeaderKey = '';
            _this.atypicalPopupContent = localeStore.instance.
                TranslateText('marking.worklist.atypical-search-error-dialog.atypical-search-error-' + result.searchResultCode);
            if (result.searchResultCode === enums.SearchResultCode.AllocatedToAnotherMarker) {
                _this.atypicalPopupContent = stringHelper.format(localeStore.instance.
                    TranslateText('marking.worklist.atypical-search-error-dialog.atypical-search-error-' +
                    enums.SearchResultCode.AllocationPossible), [String(result.centreNumber),
                    String(result.candidateNumber),
                    String(result.candidateName).toUpperCase()]);
                _this.setState({ isAtypicalSearchResultPopupDisplaying: true });
            }
            else if (result.searchResultCode === enums.SearchResultCode.AllocationPossible) {
                _this.atypicalPopupContent = stringHelper.format(localeStore.instance.
                    TranslateText('marking.worklist.atypical-search-error-dialog.atypical-search-error-' + result.searchResultCode), [String(result.centreNumber),
                    String(result.candidateNumber),
                    String(result.candidateName).toUpperCase()]);
                _this.setState({ isAtypicalSearchResultPopupDisplaying: true });
            }
            else if (result.searchResultCode === enums.SearchResultCode.MarkerNotApproved ||
                result.searchResultCode === enums.SearchResultCode.MarkerSuspended) {
                markerInformationActionCreator.
                    GetMarkerInformation(qigStore.instance.selectedQIGForMarkerOperation.examinerRoleId, qigStore.instance.selectedQIGForMarkerOperation.markSchemeGroupId, true, false, examinerstore.instance.getMarkerInformation.approvalStatus);
                _this.setState({
                    isResponseAllocationErrorDialogDisplaying: true,
                    renderedOn: Date.now(),
                    errorDialogHeaderText: localeStore.instance.
                        TranslateText('marking.worklist.response-allocation-error-dialog.response-allocation-error-header'),
                    errorDialogContentText: localeStore.instance.TranslateText('marking.worklist.approval-status-changed-dialog.body'),
                    isBusy: false
                });
            }
            else if (result.searchResultCode === enums.SearchResultCode.MarkerWithdrawn) {
                _this.storageAdapterHelper.clearCacheByKey('qigselector', 'overviewdata');
                markerInformationActionCreator.
                    GetMarkerInformation(qigStore.instance.selectedQIGForMarkerOperation.examinerRoleId, qigStore.instance.selectedQIGForMarkerOperation.markSchemeGroupId, true, false, examinerstore.instance.getMarkerInformation.approvalStatus);
            }
            else {
                _this.setState({ isAtypicalSearchFailurePopupDisplaying: true });
            }
        };
        /**
         * This function is called on 'Cancel' click of atypical response search dialog.
         * This will close the popup.
         */
        this.atypicalSearchCancelClick = function () {
            _this.setState({ isAtypicalSearchResultPopupDisplaying: false });
        };
        /**
         * This function is called on 'Ok' click of atypical response search failure dialog.
         * This will close the popup.
         */
        this.atypicalSearchfailureClick = function () {
            _this.setState({ isAtypicalSearchFailurePopupDisplaying: false });
        };
        /**
         * This function is called on 'MoveToWorklist' click of atypical response search dialog.
         */
        this.atypicalSearchMoveToClick = function () {
            _this.setState({ isAtypicalSearchResultPopupDisplaying: false });
            if (responseStore.instance._atypicalSearchResult.searchResultCode !== enums.SearchResultCode.AllocatedToAnotherMarker) {
                var isCandidatePrioritisationCCON = configurableCharacteristicsHelper.getCharacteristicValue(configurableCharacteristicsNames.CandidatePrioritisation).toLowerCase() === 'true' ? true : false;
                responseActionCreator.moveAtypicalResponseToWorklist(responseStore.instance._atypicalSearchResult.examinerRoleId, responseStore.instance._atypicalSearchResult.markSchemeGroupId, enums.WorklistType.atypical, false, qigStore.instance.selectedQIGForMarkerOperation.examSessionId, qigStore.instance.selectedQIGForMarkerOperation.role === enums.ExaminerRole.principalExaminer, qigStore.instance.selectedQIGForMarkerOperation.isElectronicStandardisationTeamMember, examinerstore.instance.getMarkerInformation.examinerId, isCandidatePrioritisationCCON, worklistStore.instance.getRemarkRequestType, true, responseStore.instance._atypicalSearchResult.candidateScriptId);
                // Invoking onBusy method
                busyIndicatorActionCreator.setBusyIndicatorInvoker(enums.BusyIndicatorInvoker.responseAllocation);
            }
            else {
                _this.atypicalPopupContent = localeStore.instance.
                    TranslateText('marking.worklist.atypical-search-error-dialog.atypical-search-error-' +
                    enums.SearchResultCode.AllocatedToAnotherMarker);
                _this.setState({ isAtypicalSearchFailurePopupDisplaying: true });
            }
        };
        /**
         * This function is called on 'MarkNow' click of atypical response search dialog.
         */
        this.atypicalSearchMarkNowClick = function () {
            _this.setState({ isAtypicalSearchResultPopupDisplaying: false });
            if (responseStore.instance._atypicalSearchResult.searchResultCode !== enums.SearchResultCode.AllocatedToAnotherMarker) {
                var isCandidatePrioritisationCCON = configurableCharacteristicsHelper.getCharacteristicValue(configurableCharacteristicsNames.CandidatePrioritisation).toLowerCase() === 'true' ? true : false;
                responseActionCreator.markNowAtypicalResponse(responseStore.instance._atypicalSearchResult.examinerRoleId, responseStore.instance._atypicalSearchResult.markSchemeGroupId, enums.WorklistType.atypical, false, qigStore.instance.selectedQIGForMarkerOperation.examSessionId, qigStore.instance.selectedQIGForMarkerOperation.role === enums.ExaminerRole.principalExaminer, qigStore.instance.selectedQIGForMarkerOperation.isElectronicStandardisationTeamMember, examinerstore.instance.getMarkerInformation.examinerId, isCandidatePrioritisationCCON, worklistStore.instance.getRemarkRequestType, true, responseStore.instance._atypicalSearchResult.candidateScriptId);
                // Invoking onBusy method
                busyIndicatorActionCreator.setBusyIndicatorInvoker(enums.BusyIndicatorInvoker.responseAllocation);
            }
            else {
                _this.atypicalPopupContent = localeStore.instance.
                    TranslateText('marking.worklist.atypical-search-error-dialog.atypical-search-error-' +
                    enums.SearchResultCode.AllocatedToAnotherMarker);
                _this.setState({ isAtypicalSearchFailurePopupDisplaying: true });
            }
        };
        /**
         * Updates the Marker information panel.
         */
        this.updateMarkerInformationPanel = function () {
            // if marker information is updated through background pulse
            _this.markerInformation = examinerstore.instance.getMarkerInformation;
            if (_this.doRenderMarkerInformationPanel()) {
                _this.setState({ renderedOn: Date.now(), isBusy: false });
            }
            // Update the Marking Check Access status
            if (qigStore.instance.selectedQIGForMarkerOperation &&
                !markerOperationModeFactory.operationMode.isTeamManagementMode &&
                configurableCharacteristicsHelper.getCharacteristicValue(configurableCharacteristicsNames.RequestMarkingCheck, qigStore.instance.selectedQIGForMarkerOperation.markSchemeGroupId).toLowerCase() === 'true') {
                worklistActionCreator.getMarkingCheckWorklistAccessStatus(qigStore.instance.selectedQIGForMarkerOperation.markSchemeGroupId);
            }
            _this.checkIfContentRefreshCompleted();
        };
        /**
         * When live/atypical/supervisor remark selected
         * If we open a response and close that then we need to take the response mode from response store( selected response mode)
         * otherwise It will take the response mode from worklist store.
         */
        this.markingModeChanged = function () {
            if (worklistStore.instance.getSuccess) {
                _this.worklistType = worklistStore.instance.currentWorklistType;
                _this.responseMode = responseStore.instance.selectedResponseMode !== undefined
                    ? responseStore.instance.selectedResponseMode
                    : worklistStore.instance.getResponseMode;
                // load inbox messages to sync with worklist data
                _this.forceLoadInboxMessages();
                if (markerOperationModeFactory.operationMode.isTeamManagementMode) {
                    // resetting responsemode while target has been dynamically changed through backend (AI)
                    // case : standardisation target has been completed by examiner(subordinate) and waiting for review
                    // and then supervisor logged in and navigates through Myteam -> subordinate's worklist (closed worklist)
                    // which is yet to be reviewed now target has been changed through AI and the supervisor opens the response and
                    // clicking set as reviewed and then it autonavigates
                    // to worklist.In this scenario response mode need to be resetted to closed.
                    _this.responseMode = targetHelper.doResetResponseMode((worklistStore.instance.getMarkingModeByWorkListType(worklistStore.instance.currentWorklistType)), _this.responseMode);
                }
                _this.remarkRequestType = worklistStore.instance.getRemarkRequestType;
                _this.isDirectedRemark = worklistStore.instance.isDirectedRemark;
                // set candidate script info collection.
                worklistStore.instance.setCandidateScriptInfoCollection = scriptImageDownloadHelper.constructCandidateScriptInfo(worklistStore.instance.getCurrentWorklistResponseBaseDetails().toArray());
                var isMarkByQuestionModeSet = userOptionsHelper.getUserOptionByName(useroptionKeys.IS_MBQ_SELECTED, qigStore.instance.getSelectedQIGForTheLoggedInUser.examinerRoleId) === 'true';
                var isEbookMarking = (configurableCharacteristicsHelper.getExamSessionCCValue(configurableCharacteristicsNames.eBookmarking, qigStore.instance.selectedQIGForMarkerOperation.examSessionId)
                    .toLowerCase() === 'true');
                // initial call for fetching candidate script meta data.
                var candidateScriptMetadataPromise = scriptActionCreator.fetchCandidateScriptMetadata(worklistStore.instance.getCandidateScriptInfoCollection, qigStore.instance.selectedQIGForMarkerOperation.questionPaperPartId, qigStore.instance.selectedQIGForMarkerOperation.markSchemeGroupId, !isMarkByQuestionModeSet, false, // TODO: pass includeRelatedQigs value as true, if anyone of the candidate script is whole response.
                false, eCourseworkHelper ? eCourseworkHelper.isECourseworkComponent : false, isEbookMarking, enums.StandardisationSetup.None, false, false, qigStore.instance.selectedQIGForMarkerOperation.markingMethod === enums.MarkingMethod.MarkFromObject);
                var that_1 = _this;
                Promise.Promise.all([candidateScriptMetadataPromise]).
                    then(function (resultList) {
                    that_1.unloadWorklistRefreshIndicatorToShowWorklist();
                });
                // Set interval for background pulse
                backgroundPulseHelper.setInterval(config.general.SCRIPT_METADATA_LOAD_TIMER_INTERVAL, backgroundPulseHelper.handleCandidateScriptMetaDataLoad, null);
                //set background call for processing save marks and annotations queue.
                backgroundPulseHelper.setInterval(config.marksandannotationsconfig.MARKS_AND_ANNOTATIONS_SAVE_TIMER_INTERVAL, backgroundPulseHelper.processMarksAndAnnotationsQueue, null);
                if (eCourseworkHelper.isECourseworkComponent) {
                    backgroundPulseHelper.handleECourseWorkFileMetaDataLoad();
                    backgroundPulseHelper.setInterval(config.general.ECOURSEFILE_METADATA_LOAD_TIMER_INTERVAL, backgroundPulseHelper.handleECourseWorkFileMetaDataLoad, null);
                }
                if (markerOperationModeFactory.operationMode.canInitiateMarkAndAnnotationsBackgroundDownload(_this.responseMode)) {
                    backgroundPulseHelper.handleCandidateMarksAndAnnotationsDataLoad();
                    // Set interval for background pulse
                    backgroundPulseHelper.setInterval(config.marksandannotationsconfig.MARKS_AND_ANNOTATIONS_LOAD_TIMER_INTERVAL, backgroundPulseHelper.handleCandidateMarksAndAnnotationsDataLoad, null);
                }
                // Logic to load image zones if ebookmarking component.
                // This will happen after Marks and Annoattion Load
                if (isEbookMarking) {
                    backgroundPulseHelper.handleEbookMarkingImageZoneLoad();
                    backgroundPulseHelper.setInterval(config.general.SCRIPT_METADATA_LOAD_TIMER_INTERVAL, backgroundPulseHelper.handleEbookMarkingImageZoneLoad, null);
                }
                // This will load the favorite stamps against selected Qig.
                responseSearchHelper.loadFavoriteStampForSelectedQig();
                /* Logging tab swith in google analytics */
                gaHelper.logEventOnTabSwitch(_this.worklistType, worklistStore.instance.getResponseMode, qigStore.instance.qigName, qigStore.instance.isTeamManagemement, qigStore.instance.selectedQIGForMarkerOperation.examinerRoleId);
            }
            else {
                _this.unloadWorklistRefreshIndicatorToShowWorklist();
            }
            /** set this to true to show loadinng indicator */
            _this.isRefreshing = true;
            if (_this.doRenderMarkerInformationPanel()) {
                _this.setState({
                    targetRenderedOn: Date.now(),
                    renderedOn: Date.now()
                });
            }
        };
        /**
         * This will open the response item
         */
        this.openResponse = function () {
            // Check for standardisation setup completion.
            simulationModeHelper.checkStandardisationSetupCompletion(enums.PageContainers.WorkList, enums.PageContainers.WorkList);
            navigationHelper.loadResponsePage();
        };
        /**
         * Gets called once the response allocation request is completed
         */
        this.onResponseAllocated = function (responseAllocationErrorCode, allocatedResponseCount, success, approvalStatus, openAtypicalResponse, responseData) {
            // Check the Marker approval status is with drawn, If so display the withdrawn message
            if (approvalStatus === enums.ExaminerApproval.Withdrawn) {
                _this.handleWithDrawnError();
                return;
            }
            if (success) {
                _this.initiateContentRefresh();
                _this.isAllocationCompleted = true;
            }
            if (responseAllocationErrorCode !== enums.ResponseAllocationErrorCode.none) {
                var responseAllocationValidationParameter_1;
                responseAllocationValidationParameter_1 = responseAllocationValidationHelper.Validate(responseAllocationErrorCode, allocatedResponseCount, approvalStatus);
                gaHelper.logEventOnResponseAllocation(true);
                _this.setState({
                    isResponseAllocationErrorDialogDisplaying: true,
                    renderedOn: Date.now(),
                    errorDialogHeaderText: responseAllocationValidationParameter_1.ErrorDialogHeaderText,
                    errorDialogContentText: responseAllocationValidationParameter_1.ErrorDialogContentText,
                    isBusy: false
                });
            }
            else {
                gaHelper.logEventOnResponseAllocation(false, allocatedResponseCount);
                _this.setState({ isBusy: false, renderedOn: Date.now() });
            }
        };
        /**
         * Show busy indicator when submit is clicked in live open worklist
         */
        this.setBusyIndicator = function () {
            /* if any error occurs set the variable to false and content refresh has started */
            if (busyIndicatorStore.instance.getBusyIndicatorInvoker === enums.BusyIndicatorInvoker.none &&
                _this.isContentRefreshStarted) {
                _this.resetContentRefreshStatuses();
            }
            _this.setState({
                isBusy: busyIndicatorStore.instance.getBusyIndicatorInvoker === enums.BusyIndicatorInvoker.none ? false : true
            });
        };
        /**
         * On response submission completed
         */
        this.onSubmitResponseCompleted = function (fromMarkScheme, submittedMarkGroupIds) {
            _this.isSubmitCompleted = true;
            /* start the data refresh */
            _this.isContentRefreshStarted = true;
            _this.setState({ isBusy: false });
        };
        /**
         * Gets called on retrieval of candidate response metadata which aids for the Script background download
         * No need to fetch the Suppressed pages
         */
        this.onCandidateResponseMetadataRetrieved = function (isAutoRefresh) {
            // TO DO: We have to remove the isTeamManagementMode check while doing the responses opening from team management story.
            if (((isAutoRefresh && scriptStore.instance.filteredCandidateResponseMetadata.scriptImageList.size > 0) || (!isAutoRefresh)) &&
                !markerOperationModeFactory.operationMode.isTeamManagementMode) {
                // Checks if the background download of images can be initiated based on the current selected worklist type and response mode
                if (scriptImageDownloadHelper.canInitiateScriptImageBackgroundDownload(_this.worklistType, _this.responseMode)) {
                    // Populating the request objects for performing background download of script images
                    var scriptImageDownloadRequests = scriptImageDownloadHelper.populateBackgroundScriptImageDownloadRequests(isAutoRefresh ? scriptStore.instance.filteredCandidateResponseMetadata :
                        scriptStore.instance.getCandidateResponseMetadata);
                    // Initiating the background download of images based on the config
                    if (config.backgroundworkerrefreshconfig.BACKGROUND_IMAGES_DOWNLOAD_ENABLED === true
                        && !htmlviewerhelper.isHtmlComponent) {
                        new scriptImageDownloader().initiateBackgroundImageDownload(scriptImageDownloadRequests);
                    }
                }
            }
        };
        /**
         * Fires after email save
         */
        this.userInfoSaved = function () {
            _this.setState({
                isSaveEmailMessageDisplaying: true
            });
        };
        /**
         * This method will be called if count of responses in the
         * Worklist is not equal to the count showing in Tab header and Live Progress status
         */
        this.updateResponseCount = function () {
            _this.markingTargetsSummary =
                worklistStore.instance.getExaminerMarkingTargetProgress(markerOperationModeFactory.operationMode.isSelectedExaminerPEOrAPE);
            _this.setState({ targetRenderedOn: Date.now() });
        };
        /**
         * Set busy indicator when a QIG is selected
         */
        this.onQigSelection = function (isDataFromSearch, isDataFromHistory) {
            if (isDataFromSearch === void 0) { isDataFromSearch = false; }
            if (isDataFromHistory === void 0) { isDataFromHistory = false; }
            _this.isRefreshing = true;
            if (isDataFromHistory) {
                return;
            }
            responseSearchHelper.openQIGDetails(qigStore.instance.selectedQIGForMarkerOperation.questionPaperPartId, qigStore.instance.selectedQIGForMarkerOperation.markSchemeGroupId, qigStore.instance.selectedQIGForMarkerOperation.examinerRoleId, dataServiceHelper.canUseCache(), examinerstore.instance.examinerApprovalStatus(qigStore.instance.selectedQIGForMarkerOperation.examinerRoleId), qigStore.instance.selectedQIGForMarkerOperation.markingMethod, false, qigStore.instance.selectedQIGForMarkerOperation.isElectronicStandardisationTeamMember);
            _this.setState({ renderedOn: Date.now() });
        };
        /**
         * Callback function for message panel close
         */
        this.onCloseMessagePopup = function (navigateTo) {
            _this.isMessagePopupVisible = false;
            _this.resetvariables();
            /* Defect:24608 - seting focus back to subject on message close for fixing cursor and onscreen keyboard displaying issue in ipad */
            if (htmlUtilities.isIPadDevice) {
                htmlUtilities.setFocusToElement('message-subject');
                htmlUtilities.blurElement('message-subject');
            }
            //We need to call the close action when navigating to inbox and when the close button is clicked
            // in other scenarios the close action is called from messagebase
            if (!navigateTo || navigateTo === enums.SaveAndNavigate.toInboxMessagePage) {
                messagingActionCreator.messageAction(enums.MessageViewAction.Close);
            }
            _this.setState({ renderedOn: Date.now() });
        };
        /**
         * Event fired on clicking send message.
         */
        this.onSendMessageClicked = function () {
            // On clicking Send message button from  information MarkerInformationPanel
            // Please check whether application is online.
            // If yes, proceed with composing Message otherwise interrupt action.
            if (applicationStore.instance.isOnline) {
                if (!markerOperationModeFactory.operationMode.isTeamManagementMode) {
                    _this.isMessagePopupVisible = true;
                    _this.setState({ renderedOn: Date.now() });
                    messagingActionCreator.messageAction(enums.MessageViewAction.Open, enums.MessageType.WorklistCompose);
                }
                else {
                    messagingActionCreator.messageAction(enums.MessageViewAction.Open, enums.MessageType.TeamCompose);
                }
            }
            else {
                applicationActionCreator.checkActionInterrupted();
            }
        };
        /**
         * Reset private variables
         */
        this.resetvariables = function () {
            _this.subject = '';
            _this.priorityDropdownSelectedItem = enums.MessagePriority.Standard;
            _this.selectedQigItemId = undefined;
            _this.messageBody = '';
        };
        /**
         * Method to show examiner state change popup.
         */
        this.showExaminerStateChangePopup = function () {
            // Check message is active, If so check for dirty content else proceed
            if (!messageStore.instance.isMessagePanelActive) {
                teamManagementActionCreator.doVisibleChangeStatusPopup(true);
            }
            else {
                var messageNavigationArguments = {
                    responseId: undefined,
                    canNavigate: false,
                    navigateTo: enums.MessageNavigation.ChangeStatus,
                    navigationConfirmed: false,
                    hasMessageContainsDirtyValue: undefined,
                    triggerPoint: enums.TriggerPoint.None
                };
                messagingActionCreator.canMessageNavigate(messageNavigationArguments);
            }
        };
        /**
         * Handles the action event on examiner change status received.
         */
        this.examinerChangeStatusReceived = function () {
            var examinerChangeStatus = teamManagementStore.instance.examinerStatusDetails;
            if (examinerChangeStatus) {
                if (examinerChangeStatus.approvalOutcome === enums.ApprovalOutcome.Success) {
                    _this.setState({ renderedOn: Date.now() });
                }
            }
            // Log examiner status change data.
            new teamManagementAuditHelper().logSubordinateStatusChange(loggerConstants.TEAMMANAGEMENT_REASON_SUPERVISOR_ACTION, loggerConstants.TEAMMANAGEMENT_TYPE_SUBOORDINATES_STATUS_CHANGED_ACTION, examinerChangeStatus);
        };
        /**
         * This method will call on mouse hover and leave for setting hovered class.
         */
        this.onMouseHoverOrMouseLeave = function (isMouseHover) {
            // condition to re-render only if change present. avoid renders on every mouse move.
            if (_this.isMouseHovered !== isMouseHover) {
                _this.isMouseHovered = isMouseHover;
                _this.setState({ renderedOn: Date.now() });
            }
        };
        /**
         * Handles the action event on second standardisation received.
         */
        this.secondStandardisationReceived = function () {
            var secondStandardisationReturn = teamManagementStore.instance.secondStandardisationReturn;
            if (secondStandardisationReturn) {
                qigActionCreator.getQIGSelectorData(operationModeHelper.markSchemeGroupId);
                _this.isSecondStandardisationTargetReceived = true;
                worklistActionCreator.getWorklistMarkerProgressData(qigStore.instance.selectedQIGForMarkerOperation.examinerRoleId, qigStore.instance.selectedQIGForMarkerOperation.markSchemeGroupId, qigStore.instance.selectedQIGForMarkerOperation.isElectronicStandardisationTeamMember);
                // Log examiner status change data.
                new teamManagementAuditHelper().logSubordinateStatusChange(loggerConstants.TEAMMANAGEMENT_REASON_SUPERVISOR_ACTION, loggerConstants.TEAMMANAGEMENT_TYPE_SECONDSTANDARDISATION, secondStandardisationReturn);
            }
        };
        /**
         * SEP Action return callback.
         */
        this.onApprovalManagementActionExecuted = function (actionIdentifier, sepApprovalManagementActionResults) {
            var sepApprovalManagementActionResult;
            sepApprovalManagementActionResult = sepApprovalManagementActionResults.first();
            if (actionIdentifier !== enums.SEPAction.ViewResponse &&
                actionIdentifier !== enums.SEPAction.SendMessage) {
                navigationHelper.loadTeamManagement();
                // Log examiner set sep.
                new teamManagementAuditHelper().logSubordinateStatusChange(loggerConstants.TEAMMANAGEMENT_REASON_SUPERVISOR_ACTION, loggerConstants.TEAMMANAGEMENT_TYPE_SEP_MANAGEMENT, sepApprovalManagementActionResult);
            }
        };
        /**
         * Method called when the message navigation is confirmed by the user
         * @param messageNavigationArguments
         */
        this.onMessageNavigation = function (messageNavigationArguments) {
            if (messageNavigationArguments.canNavigate && messageNavigationArguments.navigateTo === enums.MessageNavigation.ChangeStatus) {
                teamManagementActionCreator.doVisibleChangeStatusPopup(true);
            }
        };
        /**
         * rendering worklist
         */
        this.onSimulationTargetCompletion = function () {
            // Invoke the action creator to Open the QIG
            qigSelectorActionCreator.openQIG(qigStore.instance.selectedQIGForMarkerOperation.markSchemeGroupId);
        };
        /**
         * Get selected worklist type disabled.
         */
        this.isSelectedWorklistTypeDisabled = function () {
            var isTargetDisabled = false;
            var markingModeByWorklistType = targetHelper.getMarkingModeByWorklistType(worklistStore.instance.currentWorklistType);
            if (markingModeByWorklistType) {
                var targetByWorklistType = _this.markingTargetsSummary.filter(function (target) { return target.markingModeID === markingModeByWorklistType; }).first();
                isTargetDisabled = markerOperationModeFactory.operationMode.isTargetDisabled(targetByWorklistType, undefined);
            }
            return isTargetDisabled;
        };
        /**
         * on click or touch evnet
         */
        this.onMarkingInstructonClickHandler = function (e) {
            /** check if the clicked element is a child of the user details list item. if not close the open window */
            if (e.target !== undefined &&
                domManager.searchParentNode(e.target, function (el) {
                    return el.id === 'markinginstructionlink' || el.id === 'markingInstructionMenu';
                }) == null) {
                if (_this.state.isMarkingInstructionPanelOpen !== undefined && _this.state.isMarkingInstructionPanelOpen) {
                    _this.setState({ isMarkingInstructionPanelOpen: false });
                    markingInstructioActionCreator.markingInstructionPanelOpenActionCreator(false);
                }
            }
        };
        /**
         * rendering worklist
         */
        this.onMarkingInstructionsLoaded = function () {
            _this.setState({
                renderedOn: Date.now()
            });
        };
        /**
         * refresh on closing marking instruction panel by clicking on worklist type
         */
        this.onMarkingInstrucionPanleClosed = function () {
            if (_this.state.isMarkingInstructionPanelOpen) {
                _this.setState({
                    isMarkingInstructionPanelOpen: false
                });
            }
        };
        this.worklistType = enums.WorklistType.none;
        /* binding the parent(current) context to showLogoutConfirmation which is passed as prop to child and executing inside child */
        /* On navigating to worklist from response screen, prevent animation of the expand/collapse if we have user options loaded */
        var isMarkerInfoPanelExpanded = true;
        if (userOptionsStore.instance.isLoaded) {
            isMarkerInfoPanelExpanded = userOptionsHelper.getUserOptionByName(useroptionKeys.MARKER_INFO_PANEL_EXPANDED) === 'false' ? false : true;
        }
        this.state = {
            isLogoutConfirmationPopupDisplaying: false,
            isWorkListUpdated: false,
            renderedOn: this.props.renderedOn,
            enableNavigationPanelVisibility: isMarkerInfoPanelExpanded,
            isResponseAllocationErrorDialogDisplaying: false,
            errorDialogHeaderText: '',
            errorDialogContentText: '',
            isBusy: false,
            modulesLoaded: false,
            isSaveEmailMessageDisplaying: false,
            isAtypicalSearchResultPopupDisplaying: false,
            isAtypicalSearchFailurePopupDisplaying: false,
            isMarkingInstructionPanelOpen: false,
            isMarkingInstructionPanelClicked: false
        };
        this.onOkClickOfResponseAllocationErrorDialog = this.onOkClickOfResponseAllocationErrorDialog.bind(this);
        this.onOkClickOfEmailSucessMessage = this.onOkClickOfEmailSucessMessage.bind(this);
        this.showLogoutConfirmation = this.showLogoutConfirmation.bind(this);
        this.resetLogoutConfirmationSatus = this.resetLogoutConfirmationSatus.bind(this);
        this.toggleLeftPanel = this.toggleLeftPanel.bind(this);
        this.switchTab = this.switchTab.bind(this);
        this.showExaminerStateChangePopup = this.showExaminerStateChangePopup.bind(this);
        this.examinerChangeStatusReceived = this.examinerChangeStatusReceived.bind(this);
        this.secondStandardisationReceived = this.secondStandardisationReceived.bind(this);
        this.refreshTargetProgress = this.refreshTargetProgress.bind(this);
        this.onMarkInstructionFileClick = this.onMarkInstructionFileClick.bind(this);
        this.onMarkInstructionPanelClick = this.onMarkInstructionPanelClick.bind(this);
        this.isSecondStandardisationTargetReceived = false;
        this._boundHandleOnClick = this.onMarkingInstructonClickHandler.bind(this);
    }
    /**
     * Render method
     */
    WorkList.prototype.render = function () {
        if (this.state.modulesLoaded) {
            var responseAllocationErrorDialog = (React.createElement(GenericDialog, {content: this.state.errorDialogContentText, header: this.state.errorDialogHeaderText, displayPopup: this.state.isResponseAllocationErrorDialogDisplaying, okButtonText: localeStore.instance.TranslateText('marking.worklist.response-allocation-error-dialog.ok-button'), onOkClick: this.onOkClickOfResponseAllocationErrorDialog, id: 'responseallocationerrordialog', key: 'responseallocationerrordialog', popupDialogType: enums.PopupDialogType.ResponseAllocationError}));
            var popUpContent = [];
            popUpContent.push(React.createElement("p", null, this.atypicalPopupContent));
            var atypicalSearchDialog = (this.state.isAtypicalSearchFailurePopupDisplaying) ?
                (React.createElement(GenericDialog, {content: this.atypicalPopupContent, header: localeStore.instance.TranslateText('marking.worklist.worklist-headers.atypical'), displayPopup: this.state.isAtypicalSearchFailurePopupDisplaying, okButtonText: localeStore.instance.TranslateText('marking.worklist.response-allocation-error-dialog.ok-button'), onOkClick: this.atypicalSearchfailureClick, id: 'atypicalresponseallocationerrordialog', key: 'atypicalresponseallocationerrordialog', popupDialogType: enums.PopupDialogType.ResponseAllocationError}))
                : (React.createElement(MultiOptionConfirmationDialog, {content: popUpContent, header: localeStore.instance.TranslateText('marking.worklist.atypical-allocation-dialog.header'), displayPopup: this.state.isAtypicalSearchResultPopupDisplaying, onCancelClick: this.atypicalSearchCancelClick, onYesClick: this.atypicalSearchMarkNowClick, onNoClick: this.atypicalSearchMoveToClick, isKeyBoardSupportEnabled: true, selectedLanguage: this.props.selectedLanguage, popupSize: enums.PopupSize.Medium, popupType: enums.PopUpType.AtypicalSearch, buttonCancelText: localeStore.instance.TranslateText('marking.worklist.atypical-allocation-dialog.cancel'), buttonYesText: localeStore.instance.TranslateText('marking.worklist.atypical-allocation-dialog.mark-now'), buttonNoText: localeStore.instance.TranslateText('marking.worklist.atypical-allocation-dialog.move-to-worklist'), displayNoButton: true}));
            var saveEmailMessage = stringHelper.format(localeStore.instance.TranslateText('generic.user-menu.email-address-saved-dialog.body'), [String(String.fromCharCode(179))]);
            var emailSaveMessage = (React.createElement(GenericDialog, {content: saveEmailMessage, header: localeStore.instance.TranslateText('generic.user-menu.email-address-saved-dialog.header'), displayPopup: this.state.isSaveEmailMessageDisplaying, okButtonText: localeStore.instance.TranslateText('marking.worklist.response-allocation-error-dialog.ok-button'), onOkClick: this.onOkClickOfEmailSucessMessage, id: 'emailSaveMessage', key: 'emailSaveMessage', popupDialogType: enums.PopupDialogType.ResponseAllocationError}));
            var busyIndicator = (React.createElement(BusyIndicator, {id: 'busyIndicator', key: 'busyIndicator', isBusy: this.state.isBusy, busyIndicatorInvoker: busyIndicatorStore.instance.getBusyIndicatorInvoker}));
            var header = (React.createElement(Header, {selectedLanguage: this.props.selectedLanguage, containerPage: enums.PageContainers.WorkList, isInTeamManagement: markerOperationModeFactory.operationMode.isTeamManagementMode, examinerName: this.markerInformation ? this.markerInformation.formattedExaminerName : ''}));
            var footer = (React.createElement(Footer, {selectedLanguage: this.props.selectedLanguage, footerType: enums.FooterType.Worklist, isLogoutConfirmationPopupDisplaying: this.state.isLogoutConfirmationPopupDisplaying, resetLogoutConfirmationSatus: this.resetLogoutConfirmationSatus}));
            var examinerStateChangePopup = void 0;
            if (ExaminerStateChangePopup) {
                examinerStateChangePopup = ((markerOperationModeFactory.operationMode.isTeamManagementMode &&
                    qigStore.instance.selectedQIGForMarkerOperation && this.markerInformation) ?
                    React.createElement(ExaminerStateChangePopup, {id: 'change_examiner_status_popup', key: 'change_examiner_status_popup', selectedLanguage: this.props.selectedLanguage, currentState: this.markerInformation.approvalStatus, markerInformation: this.markerInformation}) : null);
            }
            var markingCheckPopup = (React.createElement(MarkingCheckPopup, null));
            return (React.createElement("div", {className: classNames('worklist-wrapper', { 'loading': this.state.renderedOn !== 0 && this.state.isBusy }, { 'hide-left': !this.state.enableNavigationPanelVisibility })}, examinerStateChangePopup, markingCheckPopup, busyIndicator, responseAllocationErrorDialog, atypicalSearchDialog, emailSaveMessage, header, footer, this.renderDetails()));
        }
        else {
            return (React.createElement(BusyIndicator, {id: 'modulesLoadingBusyIndicator', key: 'modulesLoadingBusyIndicator', isBusy: true, busyIndicatorInvoker: enums.BusyIndicatorInvoker.loadingModules}));
        }
    };
    /**
     * Render the details for the worklist.
     */
    WorkList.prototype.renderDetails = function () {
        var _this = this;
        var _isMarkingCheckMode = worklistStore.instance.isMarkingCheckMode;
        // Message popup
        var messagePopup;
        if (qigStore.instance.selectedQIGForMarkerOperation &&
            !markerOperationModeFactory.operationMode.isTeamManagementMode && this.isExamBodyCCLoaded) {
            messagePopup = (React.createElement(MessagePopup, {isOpen: this.isMessagePopupVisible, closeMessagePanel: this.onCloseMessagePopup, messageType: enums.MessageType.WorklistCompose, selectedLanguage: this.props.selectedLanguage, selectedQigItemId: qigStore.instance.selectedQIGForMarkerOperation.markSchemeGroupId, selectedQigItem: messageHelper.getCurrentQIGName(), qigItemsList: this.qigListItems, supervisorId: this.markerInformation ? this.markerInformation.supervisorExaminerId : 0, qigName: messageHelper.getCurrentQIGName(), supervisorName: this.markerInformation ? this.markerInformation.formattedSupervisorName : '', subject: this.subject, priorityDropDownSelectedItem: this.priorityDropdownSelectedItem, onQigItemSelected: qigStore.instance.selectedQIGForMarkerOperation.questionPaperPartId, messageBody: this.messageBody, questionPaperPartId: qigStore.instance.selectedQIGForMarkerOperation.questionPaperPartId}));
        }
        var leftPanel;
        if (_isMarkingCheckMode) {
            if (worklistStore.instance.markingCheckExaminersList && worklistStore.instance.markingCheckExaminersList.first().toExaminer) {
                leftPanel = (React.createElement(MarkCheckExaminers, {selectedLanguage: this.props.selectedLanguage, markCheckExaminers: worklistStore.instance.markingCheckExaminersList, id: 'markCheckExaminers', key: 'key_markCheckExaminers', onExaminerClick: this.onMarkingCheckRequesterExaminerClick}));
            }
        }
        else {
            leftPanel = (React.createElement("div", {className: 'column-left-inner'}, React.createElement(MarkerInformationPanel, {renderedOn: this.state.renderedOn, markerInformation: this.markerInformation, selectedLanguage: this.props.selectedLanguage, showMessagePopup: this.onSendMessageClicked, isTeamManagementMode: markerOperationModeFactory.operationMode.isTeamManagementMode, showExaminerStateChangePopup: this.showExaminerStateChangePopup, showMessageLink: this.isSendMessageLinkVisible()}), this.getMarkingInstructionLinkVisible(), React.createElement(Targets, {renderedOn: this.state.renderedOn, markingTargetsSummary: this.markingTargetsSummary, selectedLanguage: this.props.selectedLanguage, liveTargetRenderedOn: this.state.targetRenderedOn, isTeamManagementMode: markerOperationModeFactory.operationMode.isTeamManagementMode})));
        }
        // Render all components for the worklist
        return (React.createElement("div", {className: classNames('content-wrapper', { 'relative': !_isMarkingCheckMode }, { 'check-marking': _isMarkingCheckMode })}, this.markingInstructionFileListPanle, React.createElement("div", {id: 'column-left', onMouseOver: function () { _this.onMouseHoverOrMouseLeave(true); }, onMouseLeave: function () { _this.onMouseHoverOrMouseLeave(false); }, className: classNames('column-left', { 'hovered': this.isMouseHovered }, { 'check-examiner-info': _isMarkingCheckMode })}, leftPanel), React.createElement(WorkListContainer, {id: 'worklistcontainer_' + this.props.id, key: 'worklistcontainer_key_' + this.props.id, selectedLanguage: this.props.selectedLanguage, worklistType: this.worklistType, responseMode: this.responseMode, remarkRequestType: this.remarkRequestType, isDirectedRemark: this.isDirectedRemark, worklistTabDetails: this.worklistTabDetails, toggleLeftPanel: this.toggleLeftPanel, switchTab: this.switchTab, isRefreshing: this.isRefreshing, selectedTab: this.responseMode, isMarkingCheckWorklistAccessPresent: worklistStore.instance.isMarkingCheckWorklistAccessPresent, isTeamManagementMode: markerOperationModeFactory.operationMode.isTeamManagementMode, isMarkingCheckMode: _isMarkingCheckMode, hasTargetFound: this.hasTargetFound}), messagePopup));
    };
    /**
     * Show the markinginstruction panel only when pdf uploaded against that QIG.
     */
    WorkList.prototype.getMarkingInstructionLinkVisible = function () {
        if ((markerOperationModeFactory.operationMode.isMarkingInstructionLinkVisible) && !(this.markerInformation == null) &&
            markingInstructionStore.instance.markingInstructionList &&
            markingInstructionStore.instance.markingInstructionList.size > 0) {
            return (React.createElement(MarkingInstructionPanel, {id: 'marking-instruction-holder', key: 'marking-instruction-holder', onMarkInstructionFileClick: this.onMarkInstructionFileClick, onMarkInstructionPanelClick: this.onMarkInstructionPanelClick, onMarkingInstructonClickHandler: this.onMarkingInstructonClickHandler}));
        }
    };
    /**
     * Switch tab before data service call to get the data
     * @param responseMode
     */
    WorkList.prototype.switchTab = function (responseMode) {
        worklistActionCreator.responseModeChanged(responseMode, worklistStore.instance.isMarkingCheckMode);
        if (responseMode !== this.responseMode && applicationStore.instance.isOnline) {
            this.responseMode = responseMode;
            /** set this to true to show loadinng indicator */
            this.isRefreshing = true;
            this.setState({ renderedOn: Date.now() });
        }
    };
    /**
     * Subscribe to language change event
     */
    WorkList.prototype.componentDidMount = function () {
        this.loadDependencies();
        window.addEventListener('touchend', this._boundHandleOnClick);
        window.addEventListener('click', this._boundHandleOnClick);
    };
    /**
     * Subscribing component updated event.
     */
    WorkList.prototype.componentDidUpdate = function () {
        if (!this.state.modulesLoaded || this.state.isBusy || this.worklistType === enums.WorklistType.none) {
            this.props.setOfflineContainer(true);
        }
    };
    /**
     * Hook all event listeners here, It will be called after loading depencies
     * We required this type of implementation for the initial routing page like worklist, responsecontainer etc.
     */
    WorkList.prototype.addEventListeners = function () {
        configurableCharacteristicsActionCreator.getExamBodyCCs(configurableCharacteristicsStore.instance.isExamBodyCCLoaded);
        examinerstore.instance.addListener(examinerstore.ExaminerStore.MARKER_INFO_UPDATED_EVENT, this.updateMarkerInformationPanel);
        targetSummaryStore.instance.addListener(targetSummaryStore.TargetSummaryStore.MARKING_PROGRESS_EVENT, this.refreshTargetProgress);
        /* subscribing to worklist marking mode change event */
        worklistStore.instance.addListener(worklistStore.WorkListStore.WORKLIST_MARKING_MODE_CHANGE, this.markingModeChanged);
        responseStore.instance.addListener(responseStore.ResponseStore.RESPONSE_OPENED, this.openResponse);
        responseStore.instance.addListener(responseStore.ResponseStore.RESPONSE_ALLOCATED_EVENT, this.onResponseAllocated);
        // TODO need to remove. This is added to test the store as part of user story.
        busyIndicatorStore.instance.addListener(busyIndicatorStore.BusyIndicatorStore.BUSY_INDICATOR, this.setBusyIndicator);
        submitStore.instance.addListener(submitStore.SubmitStore.SUBMIT_RESPONSE_COMPLETED, this.onSubmitResponseCompleted);
        userInfoStore.instance.addListener(userInfoStore.UserInfoStore.USERINFO_SAVE, this.userInfoSaved);
        userInfoStore.instance.addListener(userInfoStore.UserInfoStore.SHOW_LOGOUT_POPUP_EVENT, this.showLogoutConfirmation);
        scriptStore.instance.addListener(scriptStore.ScriptStore.CANDIDATE_RESPONSE_METADATA_RETRIEVAL_EVENT, this.onCandidateResponseMetadataRetrieved);
        worklistStore.instance.addListener(worklistStore.WorkListStore.WORKLIST_COUNT_CHANGE, this.updateResponseCount);
        userOptionsStore.instance.addListener(userOptionsStore.UseroptionStore.USER_OPTION_GET_EVENT, this.onUserOptionsLoaded);
        qigStore.instance.addListener(qigStore.QigStore.QIG_SELECTED_EVENT, this.onQigSelection);
        messageStore.instance.addListener(messageStore.MessageStore.MESSAGE_CLOSE_EVENT, this.onCloseMessagePopup);
        messageStore.instance.addListener(messageStore.MessageStore.MESSAGE_NAVIGATION_EVENT, this.onMessageNavigation);
        stampStore.instance.addListener(stampStore.StampStore.STAMPS_LOADED_EVENT, responseSearchHelper.loadFavoriteStampForSelectedQig);
        ccStore.instance.addListener(ccStore.ConfigurableCharacteristicsStore.EXAM_BODY_CC_GET, this.onExamBodyCCLoaded);
        responseStore.instance.addListener(responseStore.ResponseStore.ATYPICAL_SEARCH_RESULT_EVENT, this.atypicalSearchClick);
        worklistStore.instance.addListener(worklistStore.WorkListStore.MARKING_CHECK_EXAMINER_SELECTION_UPDATED, this.getMarkingCheckWorklistForSelectedExaminer);
        worklistStore.instance.addListener(worklistStore.WorkListStore.MARK_CHECK_EXAMINERS_DATA_RETRIVED, this.markCheckExaminersDataRetrived);
        targetSummaryStore.instance.addListener(targetSummaryStore.TargetSummaryStore.WORKLIST_INITIALISATION_COMPLETED, this.worklistInitialisationCompleted);
        warningMessageStore.instance.addListener(warningMessageStore.WarningMessageStore.WARNING_MESSAGE_NAVIGATION_EVENT, warningMessageNavigationHelper.handleWarningMessageNavigation);
        worklistStore.instance.addListener(worklistStore.WorkListStore.SIMULATION_TARGET_COMPLETED_EVENT, this.onSimulationTargetCompletion);
        markingInstructionStore.instance.addListener(markingInstructionStore.MarkingInstructionStore.MARKINGINSTRUCTIONS_DATA_LOADED_EVENT, this.onMarkingInstructionsLoaded);
        markingInstructionStore.instance.addListener(markingInstructionStore.MarkingInstructionStore.MARKINGINSTRUCTION_PANEL_CLOSED_EVENT, this.onMarkingInstrucionPanleClosed);
    };
    /**
     * Hook all event listeners for team management here, It will be called after loading depencies
     * We required this type of implementation for the initial routing page like worklist, responsecontainer etc.
     */
    WorkList.prototype.addEventListenersForTeamManagement = function () {
        if (markerOperationModeFactory && markerOperationModeFactory.operationMode.isTeamManagementMode) {
            teamManagementStore.instance.addListener(teamManagementStore.TeamManagementStore.CHANGE_EXAMINER_STATUS_UPDATED, this.examinerChangeStatusReceived);
            teamManagementStore.instance.addListener(teamManagementStore.TeamManagementStore.PROVIDE_SECOND_STANDARDISATION_UPDATED, this.secondStandardisationReceived);
            teamManagementStore.instance.addListener(teamManagementStore.TeamManagementStore.APPROVAL_MANAGEMENT_ACTION_EXECUTED, this.onApprovalManagementActionExecuted);
        }
    };
    /**
     * Remove all event listeners for team management here.
     */
    WorkList.prototype.removeEventListenersForTeamManagement = function () {
        if (markerOperationModeFactory && markerOperationModeFactory.operationMode.isTeamManagementMode && teamManagementStore) {
            teamManagementStore.instance.removeListener(teamManagementStore.TeamManagementStore.CHANGE_EXAMINER_STATUS_UPDATED, this.examinerChangeStatusReceived);
            teamManagementStore.instance.removeListener(teamManagementStore.TeamManagementStore.PROVIDE_SECOND_STANDARDISATION_UPDATED, this.secondStandardisationReceived);
            teamManagementStore.instance.removeListener(teamManagementStore.TeamManagementStore.APPROVAL_MANAGEMENT_ACTION_EXECUTED, this.onApprovalManagementActionExecuted);
        }
    };
    /**
     * Unsubscribe language change event
     */
    WorkList.prototype.componentWillUnmount = function () {
        examinerstore.instance.removeListener(examinerstore.ExaminerStore.MARKER_INFO_UPDATED_EVENT, this.updateMarkerInformationPanel);
        targetSummaryStore.instance.removeListener(targetSummaryStore.TargetSummaryStore.MARKING_PROGRESS_EVENT, this.refreshTargetProgress);
        /* unsubscribing to worklist marking mode change event */
        worklistStore.instance.removeListener(worklistStore.WorkListStore.WORKLIST_MARKING_MODE_CHANGE, this.markingModeChanged);
        responseStore.instance.removeListener(responseStore.ResponseStore.RESPONSE_OPENED, this.openResponse);
        responseStore.instance.removeListener(responseStore.ResponseStore.RESPONSE_ALLOCATED_EVENT, this.onResponseAllocated);
        submitStore.instance.removeListener(submitStore.SubmitStore.SUBMIT_RESPONSE_COMPLETED, this.onSubmitResponseCompleted);
        busyIndicatorStore.instance.removeListener(busyIndicatorStore.BusyIndicatorStore.BUSY_INDICATOR, this.setBusyIndicator);
        userInfoStore.instance.removeListener(userInfoStore.UserInfoStore.USERINFO_SAVE, this.userInfoSaved);
        userInfoStore.instance.removeListener(userInfoStore.UserInfoStore.SHOW_LOGOUT_POPUP_EVENT, this.showLogoutConfirmation);
        scriptStore.instance.removeListener(scriptStore.ScriptStore.CANDIDATE_RESPONSE_METADATA_RETRIEVAL_EVENT, this.onCandidateResponseMetadataRetrieved);
        worklistStore.instance.removeListener(worklistStore.WorkListStore.WORKLIST_COUNT_CHANGE, this.updateResponseCount);
        userOptionsStore.instance.removeListener(userOptionsStore.UseroptionStore.USER_OPTION_GET_EVENT, this.onUserOptionsLoaded);
        qigStore.instance.removeListener(qigStore.QigStore.QIG_SELECTED_EVENT, this.onQigSelection);
        messageStore.instance.removeListener(messageStore.MessageStore.MESSAGE_CLOSE_EVENT, this.onCloseMessagePopup);
        messageStore.instance.removeListener(messageStore.MessageStore.MESSAGE_NAVIGATION_EVENT, this.onMessageNavigation);
        stampStore.instance.removeListener(stampStore.StampStore.STAMPS_LOADED_EVENT, responseSearchHelper.loadFavoriteStampForSelectedQig);
        ccStore.instance.removeListener(ccStore.ConfigurableCharacteristicsStore.EXAM_BODY_CC_GET, this.onExamBodyCCLoaded);
        this.removeEventListenersForTeamManagement();
        responseStore.instance.removeListener(responseStore.ResponseStore.ATYPICAL_SEARCH_RESULT_EVENT, this.atypicalSearchClick);
        worklistStore.instance.removeListener(worklistStore.WorkListStore.MARKING_CHECK_EXAMINER_SELECTION_UPDATED, this.getMarkingCheckWorklistForSelectedExaminer);
        worklistStore.instance.removeListener(worklistStore.WorkListStore.MARK_CHECK_EXAMINERS_DATA_RETRIVED, this.markCheckExaminersDataRetrived);
        targetSummaryStore.instance.removeListener(targetSummaryStore.TargetSummaryStore.WORKLIST_INITIALISATION_COMPLETED, this.worklistInitialisationCompleted);
        warningMessageStore.instance.removeListener(warningMessageStore.WarningMessageStore.WARNING_MESSAGE_NAVIGATION_EVENT, warningMessageNavigationHelper.handleWarningMessageNavigation);
        worklistStore.instance.removeListener(worklistStore.WorkListStore.SIMULATION_TARGET_COMPLETED_EVENT, this.onSimulationTargetCompletion);
        markingInstructionStore.instance.removeListener(markingInstructionStore.MarkingInstructionStore.MARKINGINSTRUCTIONS_DATA_LOADED_EVENT, this.onMarkingInstructionsLoaded);
        markingInstructionStore.instance.removeListener(markingInstructionStore.MarkingInstructionStore.
            MARKINGINSTRUCTION_PANEL_CLOSED_EVENT, this.onMarkingInstrucionPanleClosed);
        window.removeEventListener('click', this._boundHandleOnClick);
        window.removeEventListener('touchend', this._boundHandleOnClick);
    };
    /**
     * component will receive props
     */
    WorkList.prototype.componentWillReceiveProps = function (nextProps) {
        if (this.props !== nextProps) {
            this.setState({
                renderedOn: nextProps.renderedOn
            });
        }
    };
    /**
     * Reseting the confirmation dialog's state to make it invisible.
     */
    WorkList.prototype.resetLogoutConfirmationSatus = function () {
        this.setState({ isLogoutConfirmationPopupDisplaying: false });
    };
    /**
     * This method will toggle side panel for devices.
     */
    WorkList.prototype.toggleLeftPanel = function () {
        var panelToggleState = !this.state.enableNavigationPanelVisibility;
        this.setState({ enableNavigationPanelVisibility: panelToggleState });
        userOptionsHelper.save(useroptionKeys.MARKER_INFO_PANEL_EXPANDED, String(panelToggleState));
    };
    /**
     * Load all messages to sync with worklist
     */
    WorkList.prototype.forceLoadInboxMessages = function () {
        var args = {
            recentMessageTime: null,
            messageFolderType: enums.MessageFolderType.Inbox,
            forceLoadMessages: true,
            candidateResponseId: null,
            isTeamManagementView: markerOperationModeFactory.operationMode.isTeamManagementMode
        };
        messagingActionCreator.getMessages(args, false);
    };
    /**
     * return true if we need to render the personal information panel
     */
    WorkList.prototype.doRenderMarkerInformationPanel = function () {
        if (this.markerInformation === undefined) {
            return false;
        }
        return this.markerInformation.approvalStatus !== enums.ExaminerApproval.None
            && this.markerInformation.markerRoleID !== enums.ExaminerRole.none;
    };
    /**
     * Method to unload the refresh indicator inorder to show the worklist
     */
    WorkList.prototype.unloadWorklistRefreshIndicatorToShowWorklist = function () {
        /** Resetting the refresh variable to show actual data instead of loading indicator */
        this.isRefreshing = false;
        if (this.isContentRefreshStarted) {
            this.isContentRefreshSucceeded.isWorklistRefreshCompleted = true;
        }
        this.checkIfContentRefreshCompleted();
        this.worklistTabDetails = worklistComponentHelper.getWorklistTabDetails(worklistStore.instance.getMarkingModeByWorkListType(worklistStore.instance.currentWorklistType));
        this.setState({ renderedOn: Date.now() });
        if (responseStore.instance._openAtypicalResponse) {
            var allocatedResponseItems = responseStore.instance.responseData.allocatedResponseItems;
            var responseData_1 = undefined;
            if (allocatedResponseItems) {
                // identify the markgroup for which display id can be found
                // this is required for whole response atypical mark now, which creates multiple markgroupids
                // among which only one can find the display id from the worklist data.
                allocatedResponseItems.forEach(function (item) {
                    if (responseData_1 === undefined &&
                        worklistStore.instance.getResponseDetailsByMarkGroupId(item.markGroupId) &&
                        worklistStore.instance.getResponseDetailsByMarkGroupId(item.markGroupId).displayId) {
                        responseData_1 = item;
                    }
                });
            }
            if (responseData_1) {
                responseHelper.openResponse(parseInt('6' + responseData_1.displayID.toString()), enums.ResponseNavigation.specific, worklistStore.instance.getResponseMode, responseData_1.markGroupId, enums.ResponseViewMode.zoneView);
                markSchemeHelper.getMarks(parseInt('6' + responseData_1.displayID.toString()), enums.MarkingMode.LiveMarking);
                responseStore.instance.resetOpenAtypicalFlag();
                eCourseworkHelper.fetchECourseWorkCandidateScriptMetadata(responseData_1.displayID);
            }
        }
    };
    /**
     * This function is called on 'OK' click of response allocation error dialog.
     * This will close the popup.
     */
    WorkList.prototype.onOkClickOfResponseAllocationErrorDialog = function () {
        if (examinerstore.instance.getMarkerInformation.approvalStatus === enums.ExaminerApproval.Withdrawn) {
            qigActionCreator.getQIGSelectorData(0);
            loadContainerActionCreator.loadContainer(enums.PageContainers.QigSelector);
        }
        this.setState({
            isResponseAllocationErrorDialogDisplaying: false,
            renderedOn: Date.now()
        });
    };
    /**
     * if data refresh is completed, hide busy indicator
     */
    WorkList.prototype.checkIfContentRefreshCompleted = function () {
        if (this.isContentRefreshSucceeded &&
            this.isContentRefreshSucceeded.isMarkingProgressCompleted &&
            this.isContentRefreshSucceeded.isWorklistRefreshCompleted) {
            this.resetContentRefreshStatuses();
            /* Reset the busy indicator */
            busyIndicatorActionCreator.setBusyIndicatorInvoker(enums.BusyIndicatorInvoker.none);
        }
    };
    /**
     * Reset content refresh statuses
     */
    WorkList.prototype.resetContentRefreshStatuses = function () {
        this.isContentRefreshSucceeded.isMarkingProgressCompleted = false;
        this.isContentRefreshSucceeded.isWorklistRefreshCompleted = false;
        this.isContentRefreshStarted = false;
    };
    /**
     * Handle the Withdrwan popup
     */
    WorkList.prototype.handleWithDrawnError = function () {
        this.setState({
            isResponseAllocationErrorDialogDisplaying: true,
            renderedOn: Date.now(),
            errorDialogHeaderText: localeStore.instance.TranslateText('marking.worklist.response-allocation-error-dialog.response-allocation-error-header-withdrawnMarker'),
            errorDialogContentText: localeStore.instance.TranslateText('marking.worklist.response-allocation-error-dialog.response-allocation-error-withdrawnMarker'),
            isBusy: false
        });
    };
    /**
     * Start the content refresh
     */
    WorkList.prototype.initiateContentRefresh = function () {
        var _worklistType = allocateResponseHelper.getWorkListTypeByMarkingMode(targetHelper.getSelectedQigMarkingMode());
        // Load the marking progress
        worklistActionCreator.getWorklistMarkerProgressData(qigStore.instance.selectedQIGForMarkerOperation.examinerRoleId, qigStore.instance.selectedQIGForMarkerOperation.markSchemeGroupId, qigStore.instance.selectedQIGForMarkerOperation.isElectronicStandardisationTeamMember);
        // Load marking instructions 
        if (markerOperationModeFactory.operationMode.isMarkingInstructionLinkVisible) {
            markingInstructionActionCreator.getMarkingInstructionsActionCreator(qigStore.instance.selectedQIGForMarkerOperation.markSchemeGroupId, responseSearchHelper.markingInstructionCCValue, false);
        }
    };
    /**
     *  This will load the dependencies dynamically during component mount.
     */
    WorkList.prototype.loadDependencies = function () {
        require.ensure(['./markerinformation/markerinformationpanel', '../../stores/locale/localestore',
            '../../stores/qigselector/qigstore', '../../stores/markerinformation/examinerstore', './shared/worklistmessage',
            '../utility/confirmationdialog',
            './shared/markingprogress',
            './targetsummary/targets', '../../stores/qigselector/typings/overviewdata', '../../stores/qigselector/typings/qigsummary',
            '../../stores/qigselector/typings/markingtarget', '../../stores/worklist/targetsummarystore',
            '../../stores/worklist/typings/markingtargetsummary',
            './worklistcontainer', '../../stores/worklist/workliststore',
            '../../stores/response/responsestore',
            '../../actions/worklist/worklistactioncreator', '../utility/genericdialog',
            '../utility/responseallocation/responseallocationvalidationhelper',
            '../utility/responseallocation/responseallocationvalidationparameter', 'classnames',
            '../../stores/busyindicator/busyindicatorstore', '../../stores/submit/submitstore',
            './worklistcomponenthelper', '../../actions/submit/submitactioncreator',
            '../../actions/busyindicator/busyindicatoractioncreator', '../utility/backgroundworker/scriptimagedownloadhelper',
            '../../actions/script/scriptactioncreator', '../../stores/script/scriptstore',
            '../../utility/backgroundworkers/scriptimagedownloader/scriptimagedownloader',
            '../../utility/backgroundpulse/backgroundpulsehelper', '../footer', '../../utility/googleanalytics/gahelper',
            '../../actions/stamp/stampactioncreator', '../../stores/configurablecharacteristics/configurablecharacteristicsstore',
            '../../actions/configurablecharacteristics/configurablecharacteristicsactioncreator',
            '../../actions/qigselector/qigselectoractioncreator', '../../stores/stamp/stampstore',
            '../../actions/exception/exceptionactioncreator',
            '../../stores/exception/exceptionstore',
            '../message/messagepopup', '../utility/message/messagehelper', '../../actions/messaging/messagingactioncreator',
            '../../stores/message/messagestore', '../../utility/stringformat/stringformathelper',
            './markerinformation/markingcheckpopup',
            '../../utility/responsesearch/responsesearchhelper',
            '../utility/exception/exceptionhelper', '../../utility/generic/htmlutilities',
            '../../actions/navigation/loadcontaineractioncreator',
            '../utility/userdetails/userinfo/operationmodehelper',
            './markcheck/markcheckexaminers',
            '../../actions/markingcheck/markingcheckactioncreator',
            '../../actions/userinfo/userinfoactioncreator',
            '../../utility/teammanagement/helpers/helpexaminersdatahelper',
            '../../stores/teammanagement/warningmessagestore',
            '../../utility/teammanagement/helpers/warningmessagenavigationhelper',
            '../../actions/markinginstructions/markinginstructionactioncreator'], function () {
            MarkerInformationPanel = require('./markerinformation/markerinformationpanel');
            localeStore = require('../../stores/locale/localestore');
            qigStore = require('../../stores/qigselector/qigstore');
            examinerstore = require('../../stores/markerinformation/examinerstore');
            WorkListMessage = require('./shared/worklistmessage');
            ConfirmationDialog = require('../utility/confirmationdialog');
            Targets = require('./targetsummary/targets');
            overviewData = require('../../stores/qigselector/typings/overviewdata');
            qigInfo = require('../../stores/qigselector/typings/qigsummary');
            markingTarget = require('../../stores/qigselector/typings/markingtarget');
            targetSummaryStore = require('../../stores/worklist/targetsummarystore');
            markingTargetSummary = require('../../stores/worklist/typings/markingtargetsummary');
            WorkListContainer = require('./worklistcontainer');
            worklistStore = require('../../stores/worklist/workliststore');
            markSchemeStructureStore = require('../../stores/markschemestructure/markschemestructurestore');
            responseStore = require('../../stores/response/responsestore');
            worklistActionCreator = require('../../actions/worklist/worklistactioncreator');
            GenericDialog = require('../utility/genericdialog');
            responseAllocationValidationHelper = require('../utility/responseallocation/responseallocationvalidationhelper');
            responseAllocationValidationParameter = require('../utility/responseallocation/responseallocationvalidationparameter');
            classNames = require('classnames');
            busyIndicatorStore = require('../../stores/busyindicator/busyindicatorstore');
            submitStore = require('../../stores/submit/submitstore');
            worklistComponentHelper = require('./worklistcomponenthelper');
            submitActionCreator = require('../../actions/submit/submitactioncreator');
            busyIndicatorActionCreator = require('../../actions/busyindicator/busyindicatoractioncreator');
            scriptImageDownloadHelper = require('../utility/backgroundworker/scriptimagedownloadhelper');
            scriptActionCreator = require('../../actions/script/scriptactioncreator');
            scriptStore = require('../../stores/script/scriptstore');
            scriptImageDownloader = require('../../utility/backgroundworkers/scriptimagedownloader/scriptimagedownloader');
            targetHelper = require('../../utility/target/targethelper');
            userInfoStore = require('../../stores/userinfo/userinfostore');
            backgroundPulseHelper = require('../../utility/backgroundpulse/backgroundpulsehelper');
            Footer = require('../footer');
            gaHelper = require('../../utility/googleanalytics/gahelper');
            stampActionCreator = require('../../actions/stamp/stampactioncreator');
            configurableCharacteristicsStore = require('../../stores/configurablecharacteristics/configurablecharacteristicsstore');
            configurableCharacteristicsActionCreator =
                require('../../actions/configurablecharacteristics/configurablecharacteristicsactioncreator');
            qigActionCreator = require('../../actions/qigselector/qigselectoractioncreator');
            stampStore = require('../../stores/stamp/stampstore');
            exceptionActionCreator = require('../../actions/exception/exceptionactioncreator');
            exceptionStore = require('../../stores/exception/exceptionstore');
            MessagePopup = require('../message/messagepopup');
            messageHelper = require('../utility/message/messagehelper');
            messagingActionCreator = require('../../actions/messaging/messagingactioncreator');
            messageStore = require('../../stores/message/messagestore');
            MarkingCheckPopup = require('./markerinformation/markingcheckpopup');
            stringFormatHelper = require('../../utility/stringformat/stringformathelper');
            responseSearchHelper = require('../../utility/responsesearch/responsesearchhelper');
            htmlUtilities = require('../../utility/generic/htmlutilities');
            loadContainerActionCreator = require('../../actions/navigation/loadcontaineractioncreator');
            operationModeHelper = require('../utility/userdetails/userinfo/operationmodehelper');
            MarkCheckExaminers = require('./markcheck/markcheckexaminers');
            markingCheckActionCreator = require('../../actions/markingcheck/markingcheckactioncreator');
            userInfoActionCreator = require('../../actions/userinfo/userinfoactioncreator');
            helpExaminersDataHelper = require('../../utility/teammanagement/helpers/helpexaminersdatahelper');
            warningMessageStore = require('../../stores/teammanagement/warningmessagestore');
            warningMessageNavigationHelper = require('../../utility/teammanagement/helpers/warningmessagenavigationhelper');
            markingInstructionActionCreator = require('../../actions/markinginstructions/markinginstructionactioncreator');
            this._warningMessageNavigationHelper = new warningMessageNavigationHelper();
            // ensuring that all the dependencies are loaded at the begining
            this.loadDependenciesForTeamManagement();
            this.addEventListeners();
            /* Load the unread mandatory message status for displaying mandatory messages */
            messagingActionCreator.getUnreadMandatoryMessageStatus(enums.TriggerPoint.Worklist);
            this.setState({ modulesLoaded: true, selectedLanguage: localeStore.instance ? localeStore.instance.Locale : '' });
        }.bind(this));
    };
    /**
     *  This will load the dependencies for team management dynamically during component mount.
     */
    WorkList.prototype.loadDependenciesForTeamManagement = function () {
        require.ensure([
            '../../actions/teammanagement/teammanagementactioncreator',
            './markerinformation/examinerstatechangepopup'], function () {
            teamManagementActionCreator = require('../../actions/teammanagement/teammanagementactioncreator');
            ExaminerStateChangePopup = require('./markerinformation/examinerstatechangepopup');
            this.addEventListenersForTeamManagement();
        }.bind(this));
    };
    /**
     * Email save success message ok click
     */
    WorkList.prototype.onOkClickOfEmailSucessMessage = function () {
        this.setState({
            isSaveEmailMessageDisplaying: false
        });
    };
    /**
     * In help examiners view the message link has to be shown based on the SEP action items
     */
    WorkList.prototype.isSendMessageLinkVisible = function () {
        if (markerOperationModeFactory.operationMode.isHelpExaminersView && qigStore.instance.selectedQIGForMarkerOperation) {
            var sepActions = new helpExaminersDataHelper().getSEPActions(qigStore.instance.selectedQIGForMarkerOperation.examinerRoleId);
            if (sepActions && (sepActions.indexOf(enums.SEPAction.SendMessage) > -1)) {
                return true;
            }
            return false;
        }
        return true;
    };
    /**
     * notify worklist type change.
     */
    WorkList.prototype.notifyWorklistTypeChange = function (worklistType, responseMode) {
        worklistActionCreator.notifyWorklistTypeChange(qigStore.instance.selectedQIGForMarkerOperation.markSchemeGroupId, qigStore.instance.selectedQIGForMarkerOperation.examinerRoleId, qigStore.instance.selectedQIGForMarkerOperation.questionPaperPartId, worklistType, responseMode, worklistComponentHelper.getRemarkRequestType(worklistType), worklistComponentHelper.getIsDirectedRemark(worklistType), qigStore.instance.selectedQIGForMarkerOperation.isElectronicStandardisationTeamMember, false);
    };
    /**
     * On MarkInstruction File
     * @param {any} source - The source element
     */
    WorkList.prototype.onMarkInstructionFileClick = function (documentId) {
        window.open(urls.MARKING_INSTRUCTION_GET_URL + '/' + documentId);
    };
    /**
     * On Mark InstructionPanel Click
     * @param {any} source - The source element
     */
    WorkList.prototype.onMarkInstructionPanelClick = function () {
        if (markingInstructionStore.instance.markingInstructionList &&
            markingInstructionStore.instance.markingInstructionList.count() === 1) {
            this.onMarkInstructionFileClick(markingInstructionStore.instance.markingInstructionList.first().documentId);
        }
        else {
            if (!this.state.isMarkingInstructionPanelOpen) {
                // calculate scroll width of column-let while opening the marking instruction popup, to set the margin-left
                this.columnLeftScrollWidth = htmlUtilities.getElementById('column-left') ?
                    htmlUtilities.getElementById('column-left').offsetWidth - htmlUtilities.getElementById('column-left').clientWidth
                    : 0;
            }
            markingInstructioActionCreator.markingInstructionPanelOpenActionCreator(!this.state.isMarkingInstructionPanelOpen);
            if (!this.state.isMarkingInstructionPanelOpen) {
                var markinInstructionMenu = document.getElementById('marking-instruction-menu');
                if (markinInstructionMenu) {
                    // reset the scroll position when popup is opened
                    markinInstructionMenu.scrollTop = 0;
                }
            }
            this.setState({
                renderedOn: Date.now(),
                isMarkingInstructionPanelOpen: !this.state.isMarkingInstructionPanelOpen,
                isMarkingInstructionPanelClicked: true
            });
        }
    };
    Object.defineProperty(WorkList.prototype, "markingInstructionFileListPanle", {
        /**
         * Gets the marking instruction file list panel,
         * render in worklist instead of marking instruction component to handle jerking/hovering issues in worklist
         */
        get: function () {
            var _this = this;
            // list of marking instruction files element
            var fileList = (markingInstructionStore.instance.markingInstructionList ?
                markingInstructionStore.instance.markingInstructionList.map(function (markingInstruction, index) {
                    return (React.createElement("li", {id: 'marking-instruction-item_' + markingInstruction.documentName, className: 'marking-instruction-item'}, React.createElement(MarkingInstructionFilePanel, {id: 'id_markinginstructionlink_' + markingInstruction.documentId, key: 'key_markinginstructionlink_' + markingInstruction.documentId, documentId: markingInstruction.documentId, documentName: markingInstruction.documentName, onMarkInstructionFileClick: _this.onMarkInstructionFileClick.bind(_this)})));
                }) : null);
            // gets the top of marking instruction holder
            var markingInstructionHolder = htmlUtilities.getElementById('markinginstructionlink');
            var markingInstructionHolderTop = markingInstructionHolder ? markingInstructionHolder.getBoundingClientRect().top : 0;
            // css style for marking instruction file menu and set top with top of marking instruction holder
            // consider scroll width  of column left while setting margin left 
            var markingInstructionFileListStyle = {
                top: markingInstructionHolderTop + 'px',
                marginLeft: (-1 * this.columnLeftScrollWidth) + 'px'
            };
            var markingInstructionMenuStyle = {
                maxHeight: 'calc(100vh - ' + markingInstructionHolderTop + 'px)'
            };
            // marking instruction files list panel
            var markingInstructionFileList = (React.createElement("div", {className: classNames('dropdown-wrap  marking-instruction-menu', {
                'open': this.state.isMarkingInstructionPanelOpen && this.state.isMarkingInstructionPanelClicked,
                'close': !this.state.isMarkingInstructionPanelOpen && this.state.isMarkingInstructionPanelClicked,
                '': !this.state.isMarkingInstructionPanelClicked
            }), style: markingInstructionFileListStyle, id: 'markingInstructionMenu'}, React.createElement("ul", {id: 'marking-instruction-menu', className: 'menu', style: markingInstructionMenuStyle}, fileList)));
            return markingInstructionFileList;
        },
        enumerable: true,
        configurable: true
    });
    return WorkList;
}(pureRenderComponent));
module.exports = WorkList;
//# sourceMappingURL=worklist.js.map