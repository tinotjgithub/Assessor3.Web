"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
/* tslint:disable:no-unused-variable */
var React = require('react');
/* tslint:enable:no-unused-variable */
var pureRenderComponent = require('../base/purerendercomponent');
var qigActionCreator = require('../../actions/qigselector/qigselectoractioncreator');
var qigStore = require('../../stores/qigselector/qigstore');
var localeStore = require('../../stores/locale/localestore');
var useroptionStore = require('../../stores/useroption/useroptionstore');
var stringFormatHelper = require('../../utility/stringformat/stringformathelper');
var enums = require('../utility/enums');
var VisualQigGroup = require('./visualqiggroup');
var ccStore = require('../../stores/configurablecharacteristics/configurablecharacteristicsstore');
var markSchemeStructureStore = require('../../stores/markschemestructure/markschemestructurestore');
var keyCodes = require('../../utility/keyboardacess/keycodes');
var targetSummaryStore = require('../../stores/worklist/targetsummarystore');
var stampActionCreator = require('../../actions/stamp/stampactioncreator');
var stampStore = require('../../stores/stamp/stampstore');
var dataServiceHelper = require('../../utility/generic/dataservicehelper');
var messageStore = require('../../stores/message/messagestore');
var messagingActionCreator = require('../../actions/messaging/messagingactioncreator');
var responseSearchHelper = require('../../utility/responsesearch/responsesearchhelper');
var LoadingIndicator = require('../utility/loadingindicator/loadingindicator');
var teamManagementStore = require('../../stores/teammanagement/teammanagementstore');
var navigationHelper = require('../utility/navigation/navigationhelper');
var examinerStore = require('../../stores/markerinformation/examinerstore');
var markerOperationModeFactory = require('../utility/markeroperationmode/markeroperationmodefactory');
var loginStore = require('../../stores/login/loginstore');
var workListDataHelper = require('../../utility/worklist/worklistdatahelper');
var configurableCharacteristicsActionCreator = require('../../actions/configurablecharacteristics/configurablecharacteristicsactioncreator');
var navigationStore = require('../../stores/navigation/navigationstore');
var userinfoStore = require('../../stores/userinfo/userinfostore');
var storageAdapterHelper = require('../../dataservices/storageadapters/storageadapterhelper');
var ccActionCreator = require('../../actions/configurablecharacteristics/configurablecharacteristicsactioncreator');
var userInfoActionCreator = require('../../actions/userinfo/userinfoactioncreator');
var teamManagementActionCreator = require('../../actions/teammanagement/teammanagementactioncreator');
var userOptionActionCreator = require('../../actions/useroption/useroptionactioncreator');
var Promise = require('es6-promise');
var simulationModeHelper = require('../../utility/simulation/simulationmodehelper');
var storageAdapterFactory = require('../../dataservices/storageadapters/storageadapterfactory');
var responseHelper = require('../utility/responsehelper/responsehelper');
var auditLoggingHelper = require('../utility/auditlogger/auditlogginghelper');
var qigSelectorActionCreator = require('../../actions/qigselector/qigselectoractioncreator');
/* tslint:disable:variable-name */
var NoQIGsAvailableMessage = function (props) {
    return (React.createElement("div", {className: 'no-qig-holder'}, React.createElement("div", {className: 'sprite-icon qig-icon-big'}, "icon"), React.createElement("div", {className: 'no-qig-message'}, React.createElement("h4", null, localeStore.instance.TranslateText('home.home-page.no-qigs-available-to-mark-placeholder')))));
};
var QigSelector = (function (_super) {
    __extends(QigSelector, _super);
    /**
     * @constructor
     */
    function QigSelector(props, state) {
        var _this = this;
        _super.call(this, props, state);
        /** variable to identify whether the mark scheme structure is loaded or not */
        this.isMarkSchemeStructureLoaded = false;
        /** variable to identify whether the mark scheme CC is loaded or not */
        this.isMarkSchemeCCLoaded = false;
        /** variable to know whether worklist icons are displayed */
        this.worklistHeaderIconsDisplayed = false;
        /** variable to identify whether the QIG is selected or not */
        this.isQIGSelected = false;
        this.storageAdapterHelper = new storageAdapterHelper();
        this.isQIGSelectedFromUserOption = false;
        this.isExaminerHasStuckData = false;
        this.isQIGSelectedFromLockedList = false;
        /**
         * Error code retrieved on qig data fetch
         */
        this.onGettingErrorCodeRetrived = function (failureCode, markSchemeGroupId) {
            if (markSchemeGroupId === void 0) { markSchemeGroupId = 0; }
            if (markerOperationModeFactory.operationMode.selectedQIGFromUserOption &&
                markerOperationModeFactory.operationMode.selectedQIGFromUserOption.area === enums.QigArea.TeamManagement) {
                switch (failureCode) {
                    case enums.FailureCode.SubordinateExaminerWithdrawn:
                    case enums.FailureCode.HierarchyChanged:
                        var changeOperationModePromise = userInfoActionCreator.changeOperationMode(enums.MarkerOperationMode.TeamManagement);
                        _this._rememberQigInfo.subordinateExaminerID = undefined;
                        _this._rememberQigInfo.subordinateExaminerRoleID = undefined;
                        var that_1 = _this;
                        Promise.Promise.all([
                            changeOperationModePromise
                        ]).
                            then(function (result) {
                            that_1.getQigData(markerOperationModeFactory.operationMode.selectedQIGFromUserOption.qigId, true);
                        });
                        break;
                    case enums.FailureCode.NotPEOrAPE:
                    case enums.FailureCode.NotTeamLead:
                    case enums.FailureCode.Withdrawn:
                        _this._rememberQigInfo.subordinateExaminerID = undefined;
                        _this._rememberQigInfo.subordinateExaminerRoleID = undefined;
                        _this.isQIGSelectedFromUserOption = false;
                        _this.getQigData(0);
                        break;
                }
            }
        };
        /**
         * User option get event listener
         */
        this.onUserOptionsLoaded = function () {
            if (_this.props.containerPage === enums.PageContainers.QigSelector) {
                if (navigationStore.instance.previousPage) {
                    _this.getQigData(0, true);
                }
                else if (!simulationModeHelper.isSimulationExitedQigDataAvailable &&
                    !simulationModeHelper.isLockInQigsDataAvailable) {
                    _this.navigateWithRememberQigData();
                }
            }
        };
        /**
         * on Team OverView Data Received
         */
        this.onTeamOverViewDataReceived = function () {
            var qigDetails = teamManagementStore.instance.getSelectedQig;
            if (qigDetails && qigDetails.examinerStuckCount === 0) {
                _this.isExaminerHasStuckData = false;
                // validates the examiner
                teamManagementActionCreator.teamManagementExaminerValidation(_this._rememberQigInfo.qigId, _this._rememberQigInfo.examinerRoleId, _this._rememberQigInfo.subordinateExaminerRoleID, _this._rememberQigInfo.subordinateExaminerID, enums.ExaminerValidationArea.MyTeam, true);
            }
            else {
                _this.isExaminerHasStuckData = true;
                var that_2 = _this;
                var changeOperationModePromise = userInfoActionCreator.changeOperationMode(enums.MarkerOperationMode.TeamManagement);
                Promise.Promise.all([
                    changeOperationModePromise
                ]).
                    then(function (result) {
                    that_2.getQigData(that_2._rememberQigInfo.qigId, true);
                });
            }
            _this.isQIGSelectedFromUserOption = true;
        };
        /**
         * On examiner validated
         */
        this.onExaminerValidate = function () {
            if (_this._rememberQigInfo) {
                var changeOperationModePromise = userInfoActionCreator.changeOperationMode(enums.MarkerOperationMode.TeamManagement);
                if (_this._rememberQigInfo.subordinateExaminerRoleID > 0) {
                    var examinerDrillDownData = {
                        examinerId: _this._rememberQigInfo.subordinateExaminerID,
                        examinerRoleId: _this._rememberQigInfo.subordinateExaminerRoleID
                    };
                    var updateExaminerDrillDownDataPromise = teamManagementActionCreator.updateExaminerDrillDownData(examinerDrillDownData, true);
                    var that_3 = _this;
                    Promise.Promise.all([
                        changeOperationModePromise,
                        updateExaminerDrillDownDataPromise
                    ]).
                        then(function (result) {
                        that_3.getQigData(that_3._rememberQigInfo.qigId, true);
                    });
                }
                else {
                    var that_4 = _this;
                    Promise.Promise.all([
                        changeOperationModePromise
                    ]).
                        then(function (result) {
                        that_4.getQigData(that_4._rememberQigInfo.qigId, true);
                    });
                }
                _this.isQIGSelectedFromUserOption = true;
            }
        };
        /**
         * Updates the data once the event is fired.
         */
        this.onQIGSelectorDataLoaded = function () {
            // If the QIG Selector data is loaded, refresh the QIG Selector drop down to open the list
            if (qigStore.instance.isQIGCollectionLoaded) {
                _this.refreshQIGSelectorDropdown(Date.now(), true, false, _this.state.shouldRender);
                // If QIGs are not available we don't need to show the header icons
                if (_this.worklistHeaderIconsDisplayed === false && _this.hasQIGsAvailable() === true) {
                    qigActionCreator.showHeaderIconsOnQIGsAvailable(true);
                    _this.worklistHeaderIconsDisplayed = true;
                }
            }
        };
        /**
         * Method to be invoked when a QIG is selected/opened from the QIG Selector list
         */
        this.onQIGSelected = function (isDataFromSearch, isDataFromHistory, isFromLocksInPopUp) {
            if (isDataFromSearch === void 0) { isDataFromSearch = false; }
            if (isDataFromHistory === void 0) { isDataFromHistory = false; }
            if (isFromLocksInPopUp === void 0) { isFromLocksInPopUp = false; }
            if (isDataFromHistory) {
                return;
            }
            if (!isFromLocksInPopUp) {
                // if the qig in user option is withdrawn then select the entire qig data.
                if (qigStore.instance.selectedQIGForMarkerOperation) {
                    _this.isQIGSelected = true;
                    _this.selectedQIG();
                }
                else {
                    _this.getQigData(0);
                }
            }
        };
        /**
         * Method to be invoked when a ExamBody CC is loaded.
         */
        this.onExamBodyCCLoaded = function () {
            _this.selectedQIG();
        };
        /**
         * This method will call if a QIG is selected/opened from the QIG Selector list or ExamBody cc is loaded.
         */
        this.selectedQIG = function () {
            // If Awarding Body CC is not loaded yet, no need to fetch worklist related data
            if (!ccStore.instance.isExamBodyCCLoaded || !_this.isQIGSelected) {
                return;
            }
            else if (!qigStore.instance.isQIGCollectionLoaded && !qigStore.instance.selectedQIGForMarkerOperation) {
                // Fix for the defect. Remembered QIG is not present, Get the entire collection
                if (userinfoStore.instance.currentOperationMode !== enums.MarkerOperationMode.TeamManagement) {
                    _this.getQigData(0);
                }
                else {
                    _this.storageAdapterHelper.clearTeamDataCache(teamManagementStore.instance.selectedExaminerRoleId, teamManagementStore.instance.selectedMarkSchemeGroupId);
                    navigationHelper.loadQigSelector();
                }
                return;
            }
            // If QIGs are not available we don't need to show the header icons
            if (_this.worklistHeaderIconsDisplayed === false) {
                qigActionCreator.showHeaderIconsOnQIGsAvailable(true);
                _this.worklistHeaderIconsDisplayed = true;
            }
            if (qigStore.instance.selectedQIGForMarkerOperation) {
                if (_this.isQIGSelectedFromUserOption) {
                    _this.isQIGSelectedFromUserOption = false;
                    if (!_this._rememberQigInfo) {
                        _this._rememberQigInfo = markerOperationModeFactory.operationMode.selectedQIGFromUserOption;
                    }
                    switch (_this._rememberQigInfo.area) {
                        case enums.QigArea.QigSelector:
                            break;
                        case enums.QigArea.Marking:
                            var _updateSelectedQigDetailsPromise = userOptionActionCreator.updateSelectedQigDetails(_this._rememberQigInfo);
                            Promise.Promise.all([
                                _updateSelectedQigDetailsPromise
                            ]).
                                then(function (result) {
                                navigationHelper.loadWorklist();
                            });
                            break;
                        case enums.QigArea.TeamManagement:
                            var markSchemeGroupCCPromise = ccActionCreator.getMarkSchemeGroupCCs(_this._rememberQigInfo.qigId, _this._rememberQigInfo.questionPaperPartId);
                            var updateSelectedQigDetailsPromise = userOptionActionCreator.updateSelectedQigDetails(_this._rememberQigInfo);
                            var openQIGPromise = qigActionCreator.getQIGSelectorData(_this._rememberQigInfo.qigId, false, false, false, false, false);
                            var that_5 = _this;
                            if (_this._rememberQigInfo.subordinateExaminerRoleID > 0 && !_this.isExaminerHasStuckData) {
                                var openQIGDetailsPromise = Promise.Promise.all([
                                    markSchemeGroupCCPromise,
                                    updateSelectedQigDetailsPromise,
                                    openQIGPromise
                                ]).
                                    then(function (result) {
                                    responseSearchHelper.openQIGDetails(that_5._rememberQigInfo.questionPaperPartId, that_5._rememberQigInfo.qigId, that_5._rememberQigInfo.subordinateExaminerRoleID, dataServiceHelper.canUseCache(), examinerStore.instance.examinerApprovalStatus(that_5._rememberQigInfo.subordinateExaminerRoleID), qigStore.instance.selectedQIGForMarkerOperation.markingMethod, false, qigStore.instance.selectedQIGForMarkerOperation.isElectronicStandardisationTeamMember);
                                });
                                // load stamps defined for the selected mark scheme groupId
                                stampActionCreator.getStampData(_this._rememberQigInfo.qigId, stampStore.instance.stampIdsForSelectedQIG, qigStore.instance.selectedQIGForMarkerOperation.markingMethod, responseHelper.isEbookMarking, true);
                                Promise.Promise.all([
                                    openQIGDetailsPromise
                                ]).
                                    then(function (result) {
                                    teamManagementActionCreator.getMyTeamData(teamManagementStore.instance.selectedExaminerRoleId, teamManagementStore.instance.selectedMarkSchemeGroupId, false, true);
                                    navigationHelper.loadWorklist();
                                });
                            }
                            else {
                                var that_6 = _this;
                                Promise.Promise.all([
                                    markSchemeGroupCCPromise,
                                    updateSelectedQigDetailsPromise,
                                    openQIGPromise
                                ]).
                                    then(function (result) {
                                    teamManagementActionCreator.openTeamManagement(that_6._rememberQigInfo.examinerRoleId, that_6._rememberQigInfo.qigId, true, true);
                                });
                            }
                            var currQigName = void 0;
                            // Calling the helper method to format the QIG Name
                            if (qigStore.instance.selectedQIGForMarkerOperation !== undefined) {
                                var selectedQig = qigStore.instance.selectedQIGForMarkerOperation;
                                currQigName = stringFormatHelper.formatAwardingBodyQIG(selectedQig.markSchemeGroupName, selectedQig.assessmentCode, selectedQig.sessionName, selectedQig.componentId, selectedQig.questionPaperName, selectedQig.assessmentName, selectedQig.componentName, stringFormatHelper.getOverviewQIGNameFormat());
                            }
                            // logging qig selection in google analytics or application insights based on the configuration.
                            new auditLoggingHelper().logHelper.logEventOnQigSelection(currQigName);
                            break;
                        case enums.QigArea.Inbox:
                            break;
                        case enums.QigArea.StandardisationSetup:
                            // set the marker operation mode as StandardisationSetup
                            userInfoActionCreator.changeOperationMode(enums.MarkerOperationMode.StandardisationSetup);
                            // set remember qig std worklist in std store 
                            userOptionActionCreator.updateSelectedQigDetails(_this._rememberQigInfo);
                            // Invoke the action creator to Open the QIG
                            qigSelectorActionCreator.openQIG(_this._rememberQigInfo.qigId);
                            // Navigate to SSU 
                            navigationHelper.loadStandardisationSetup();
                            break;
                    }
                }
                else {
                    if (userinfoStore.instance.currentOperationMode === enums.MarkerOperationMode.Marking &&
                        (navigationStore.instance.containerPage === enums.PageContainers.WorkList ||
                            navigationStore.instance.containerPage === enums.PageContainers.QigSelector)) {
                        navigationHelper.loadWorklist();
                    }
                    else if (userinfoStore.instance.currentOperationMode === enums.MarkerOperationMode.TeamManagement &&
                        navigationStore.instance.containerPage === enums.PageContainers.TeamManagement) {
                        navigationHelper.loadTeamManagement();
                    }
                }
                // Refresh the QIG Selector Drop down to close the loading indicator
                _this.refreshQIGSelectorDropdown(Date.now(), false, false);
                // logging qig selection in google analytics or application insights based on the configuration
                new auditLoggingHelper().logHelper.logEventOnQigSelection(_this.getCurrentQIGName());
            }
        };
        /**
         * this will set the mark scheme structure loaded flag to true
         * if the mark scheme CC is already loaded call the method to invoke the calls to fetch the related data for the  QIG
         */
        this.fetchRelatedDataForTheQIGAfterMarkSchemeStructure = function () {
            _this.isMarkSchemeStructureLoaded = true;
            if (_this.isMarkSchemeCCLoaded) {
                workListDataHelper.fetchRelatedDataForQIGAfterMarkSchemeStructureAndCC(_this.props.isInTeamManagement);
            }
        };
        /**
         * Prepare work list after initialising worklist data
         */
        this.worklistInitialisationCompleted = function () {
            workListDataHelper.fetchRelatedDataForQIGAfterMarkSchemeStructureAndCC(_this.props.isInTeamManagement);
        };
        /**
         * this will set the mark scheme CC loaded falg to true
         * if the mark schems structure is already loaded call the method to invoke the calls to fetch the related data for the QIG
         */
        this.fetchRelatedDataForTheQIGAfterCC = function () {
            _this.isMarkSchemeCCLoaded = true;
            if (_this.isMarkSchemeStructureLoaded) {
                workListDataHelper.fetchRelatedDataForQIGAfterMarkSchemeStructureAndCC(_this.props.isInTeamManagement);
            }
        };
        /**
         * Method called when the message navigation is confirmed by the user
         * @param messageNavigationArguments
         */
        this.onMessageNavigation = function (messageNavigationArguments) {
            if (messageNavigationArguments.canNavigate && messageNavigationArguments.navigateTo === enums.MessageNavigation.toQigSelector) {
                // On clicking the QIG Selector drop down, it should expand to show the Loading Indicator
                // until the QIG List is retrieved from the server
                _this.refreshQIGSelectorDropdown(Date.now(), true, true);
                // Invoke the method to fetch the QIG Data
                _this.getQigData();
            }
        };
        /**
         * Navigate to worklist
         */
        this.navigateToWorklist = function () {
            navigationHelper.loadWorklist();
        };
        /**
         * On getting the simulation exited qigs data
         */
        this.onSimulationExitedQigsRecieved = function () {
            if (simulationModeHelper.isSimulationExitedQigDataAvailable) {
                _this.setState({
                    shouldRender: false
                });
            }
        };
        /**
         * On getting the simulation exited qigs and locks in qigs data
         */
        this.onSimulationExitedQigsAndLocksInQigsRecieved = function () {
            if (!simulationModeHelper.isSimulationExitedQigDataAvailable &&
                !simulationModeHelper.isLockInQigsDataAvailable) {
                _this.navigateWithRememberQigData();
            }
        };
        /**
         * On simulation target completion.
         */
        this.onSimulationTargetCompletion = function (_isTargetComepleted) {
            if (_isTargetComepleted) {
                // If there is remember qig data then reset it to qigselector.
                if (_this._rememberQigInfo) {
                    _this._rememberQigInfo.area = enums.QigArea.QigSelector;
                    _this._rememberQigInfo.worklistType = enums.WorklistType.none;
                }
                // Now show the popup
                var lockInQigs = void 0;
                lockInQigs = qigStore.instance.getLocksInQigList === undefined ?
                    undefined :
                    qigStore.instance.getLocksInQigList;
                if (lockInQigs.locksInQigDetailsList.count() > 0) {
                    qigActionCreator.showLocksInQigPopup(true, false);
                }
                else {
                    _this.refreshQIGSelectorDropdown(Date.now(), true, true, true);
                    // Clearing cache
                    storageAdapterFactory.getInstance().deleteData('qigselector', 'overviewdata');
                    // Invoke the method to fetch the QIG Data
                    _this.getQigData();
                }
            }
        };
        var _isOpen = true;
        if (this.props.isInTeamManagement) {
            _isOpen = false;
        }
        // Setting the initial state
        this.state = {
            isOpen: _isOpen,
            isLoadingIndicatorShown: true,
            renderedOn: null,
            shouldRender: true
        };
        this.onQIGSelectorClick = this.onQIGSelectorClick.bind(this);
        if (!this.props.isNavigatedAfterFromLogin && qigStore.instance.hasAnySimulationQigs) {
            qigActionCreator.getSimulationModeExitedQigs(true);
        }
    }
    /**
     * What happens when the component mounts
     */
    QigSelector.prototype.componentDidMount = function () {
        if (!this.props.isInTeamManagement) {
            // Hide the header icons temperorily and show if QIGs available
            qigActionCreator.showHeaderIconsOnQIGsAvailable(false);
        }
        // If Exam body CC's not loaded yet, add the event Else skip for avoid multiple calls
        if (!ccStore.instance.isExamBodyCCLoaded) {
            ccStore.instance.addListener(ccStore.ConfigurableCharacteristicsStore.EXAM_BODY_CC_GET, this.onExamBodyCCLoaded);
            configurableCharacteristicsActionCreator.getExamBodyCCs(ccStore.instance.isExamBodyCCLoaded);
        }
        qigStore.instance.addListener(qigStore.QigStore.QIG_LIST_LOADED_EVENT, this.onQIGSelectorDataLoaded);
        qigStore.instance.addListener(qigStore.QigStore.QIG_SELECTED_EVENT, this.onQIGSelected);
        qigStore.instance.addListener(qigStore.QigStore.NAVIGATE_TO_WORKLIST_FROM_QIG_SELECTOR_EVENT, this.navigateToWorklist);
        useroptionStore.instance.addListener(useroptionStore.UseroptionStore.USER_OPTION_GET_EVENT, this.onUserOptionsLoaded);
        ccStore.instance.addListener(ccStore.ConfigurableCharacteristicsStore.MARKSCHEME_GROUP_CC_GET, this.fetchRelatedDataForTheQIGAfterCC);
        markSchemeStructureStore.instance.addListener(markSchemeStructureStore.MarkSchemeStructureStore.MARK_SCHEME_STRUCTURE_LOADED_EVENT, this.fetchRelatedDataForTheQIGAfterMarkSchemeStructure);
        targetSummaryStore.instance.addListener(targetSummaryStore.TargetSummaryStore.WORKLIST_INITIALISATION_COMPLETED, this.worklistInitialisationCompleted);
        messageStore.instance.addListener(messageStore.MessageStore.MESSAGE_NAVIGATION_EVENT, this.onMessageNavigation);
        teamManagementStore.instance.addListener(teamManagementStore.TeamManagementStore.EXAMINER_VALIDATED_EVENT, this.onExaminerValidate);
        teamManagementStore.instance.addListener(teamManagementStore.TeamManagementStore.TEAM_OVERVIEW_DATA_RECEIVED_REMEMBER_QIG_EVENT, this.onTeamOverViewDataReceived);
        teamManagementStore.instance.addListener(teamManagementStore.TeamManagementStore.
            FAILURE_WHILE_FETCHING_TEAM_DATA_ON_REMEMBER_QIG_EVENT, this.onGettingErrorCodeRetrived);
        qigStore.instance.addListener(qigStore.QigStore.SIMULATION_EXITED_QIGS_RETRIEVED, this.onSimulationExitedQigsRecieved);
        qigStore.instance.addListener(qigStore.QigStore.SIMULATION_EXITED_QIGS_AND_LOCKS_IN_QIGS_RETRIEVED, this.onSimulationExitedQigsAndLocksInQigsRecieved);
        qigStore.instance.addListener(qigStore.QigStore.SIMULATION_TARGET_COMPLETED, this.onSimulationTargetCompletion);
    };
    /**
     * What happens when the component unmounts
     */
    QigSelector.prototype.componentWillUnmount = function () {
        qigStore.instance.removeListener(qigStore.QigStore.QIG_LIST_LOADED_EVENT, this.onQIGSelectorDataLoaded);
        qigStore.instance.removeListener(qigStore.QigStore.QIG_SELECTED_EVENT, this.onQIGSelected);
        qigStore.instance.removeListener(qigStore.QigStore.NAVIGATE_TO_WORKLIST_FROM_QIG_SELECTOR_EVENT, this.navigateToWorklist);
        useroptionStore.instance.removeListener(useroptionStore.UseroptionStore.USER_OPTION_GET_EVENT, this.onUserOptionsLoaded);
        ccStore.instance.removeListener(ccStore.ConfigurableCharacteristicsStore.MARKSCHEME_GROUP_CC_GET, this.fetchRelatedDataForTheQIGAfterCC);
        markSchemeStructureStore.instance.removeListener(markSchemeStructureStore.MarkSchemeStructureStore.MARK_SCHEME_STRUCTURE_LOADED_EVENT, this.fetchRelatedDataForTheQIGAfterMarkSchemeStructure);
        targetSummaryStore.instance.removeListener(targetSummaryStore.TargetSummaryStore.WORKLIST_INITIALISATION_COMPLETED, this.worklistInitialisationCompleted);
        ccStore.instance.removeListener(ccStore.ConfigurableCharacteristicsStore.EXAM_BODY_CC_GET, this.onExamBodyCCLoaded);
        messageStore.instance.removeListener(messageStore.MessageStore.MESSAGE_NAVIGATION_EVENT, this.onMessageNavigation);
        teamManagementStore.instance.removeListener(teamManagementStore.TeamManagementStore.EXAMINER_VALIDATED_EVENT, this.onExaminerValidate);
        teamManagementStore.instance.removeListener(teamManagementStore.TeamManagementStore.TEAM_OVERVIEW_DATA_RECEIVED_REMEMBER_QIG_EVENT, this.onTeamOverViewDataReceived);
        teamManagementStore.instance.removeListener(teamManagementStore.TeamManagementStore.
            FAILURE_WHILE_FETCHING_TEAM_DATA_ON_REMEMBER_QIG_EVENT, this.onGettingErrorCodeRetrived);
        qigStore.instance.removeListener(qigStore.QigStore.SIMULATION_EXITED_QIGS_RETRIEVED, this.onSimulationExitedQigsRecieved);
        qigStore.instance.removeListener(qigStore.QigStore.SIMULATION_EXITED_QIGS_AND_LOCKS_IN_QIGS_RETRIEVED, this.onSimulationExitedQigsAndLocksInQigsRecieved);
        qigStore.instance.removeListener(qigStore.QigStore.SIMULATION_TARGET_COMPLETED, this.onSimulationTargetCompletion);
    };
    /**
     * Render method for Qig selector component.
     */
    QigSelector.prototype.render = function () {
        var hasQIGsAvailable = this.hasQIGsAvailable();
        var renderQigs = null;
        if (this.state.isOpen) {
            var qigList = void 0;
            if (hasQIGsAvailable === false) {
                qigList = React.createElement(NoQIGsAvailableMessage, null);
            }
            else {
                qigList = (React.createElement("div", {className: 'menu-wrapper padding-bottom-30'}, React.createElement("div", {className: 'menu-header padding-top-10 padding-bottom-10 clearfix'}), this.renderComponentGroups()));
            }
            renderQigs = (React.createElement("div", {className: 'menu qig-menu', id: 'qig-list', "aria-hidden": 'true'}, qigList));
        }
        return (React.createElement("div", {className: 'content-wrapper'}, React.createElement("div", {className: 'qig-content-holder'}, renderQigs)));
    };
    /**
     * Render the Component Groups
     */
    QigSelector.prototype.renderComponentGroups = function () {
        var _this = this;
        if (this.state.isLoadingIndicatorShown || !this.state.shouldRender) {
            return (React.createElement(LoadingIndicator, {id: 'loading', key: 'loading', cssClass: 'qig-loader loading'}));
        }
        else if (this.state.isOpen) {
            var groupedQigs_1 = qigStore.instance.getQigsGroupedBy(enums.GroupByField.questionPaper, markerOperationModeFactory.operationMode.isSelectedExaminerSTM);
            var groupedKeys = groupedQigs_1.keySeq();
            // index variable for id
            var groupIndex_1 = 0;
            var qigs_1;
            // Loop through the keys and find the list of QIGS for the group.
            var toRender = groupedKeys.map(function (key) {
                groupIndex_1++;
                // Get the QIgs for the group.
                var currentQigGroup = groupedQigs_1.get(key);
                // Clear the collection, In each group.
                qigs_1 = [];
                // Get the each QIG for the group.
                currentQigGroup.map(function (qigItem) {
                    qigs_1.push(qigItem);
                });
                // Get the Grouped Section with QIGs
                return (React.createElement(VisualQigGroup, {selectedLanguage: _this.props.selectedLanguage, qigs: qigs_1, containerPage: _this.props.containerPage, key: 'key_VisualQigGroup_' + groupIndex_1.toString()}));
            });
            // Render the Grouped items.
            return (React.createElement("div", {key: 'selected_qig-item', className: 'header-menu-item qig-item-holder', id: 'selected_qig-item'}, toRender));
        }
    };
    /**
     * Checks whether the marker has QIGs available in list
     * @returns whether there are QIGs available to the marker
     */
    QigSelector.prototype.hasQIGsAvailable = function () {
        return qigStore.instance.getOverviewData ?
            qigStore.instance.getOverviewData.qigSummary.count() > 0 : undefined;
    };
    /**
     * Method which fetches the QIG data
     * @param qigId
     */
    QigSelector.prototype.getQigData = function (qigId, isForLoggedInExaminer) {
        if (qigId === void 0) { qigId = 0; }
        if (isForLoggedInExaminer === void 0) { isForLoggedInExaminer = false; }
        if (loginStore.instance.isAdminRemarker) {
            // Invoking the action creator to retrieve the Admin remarkers QIG details.
            qigActionCreator.getAdminRemarkerQIGSelectorData();
        }
        else {
            // Invoking the action creator to retrieve the QIG list for the QIG Selector
            qigActionCreator.getQIGSelectorData(qigId, isForLoggedInExaminer);
        }
    };
    /**
     * Navigate to corresponding page with respect to the remember qig data
     */
    QigSelector.prototype.navigateWithRememberQigData = function () {
        if (useroptionStore.instance.isLoaded && qigStore.instance.getSimulationModeExitedQigList) {
            if (!this._rememberQigInfo) {
                this._rememberQigInfo = markerOperationModeFactory.operationMode.selectedQIGFromUserOption;
            }
            if (this._rememberQigInfo.qigId) {
                switch (this._rememberQigInfo.area) {
                    case enums.QigArea.QigSelector:
                        this.getQigData(0);
                        /* Load the unread mandatory message status for displaying mandatory messages */
                        messagingActionCreator.getUnreadMandatoryMessageStatus(enums.TriggerPoint.QigSelector);
                        break;
                    case enums.QigArea.Marking:
                        this.getQigData(this._rememberQigInfo.qigId);
                        this.isQIGSelectedFromUserOption = true;
                        /* Loading unread mandatory message for worklist is done inside worklist component */
                        break;
                    case enums.QigArea.TeamManagement:
                        this.isQIGSelectedFromUserOption = true;
                        this.getTeamManagementOverviewCounts();
                        break;
                    case enums.QigArea.StandardisationSetup:
                        this.getQigData(this._rememberQigInfo.qigId);
                        this.isQIGSelectedFromUserOption = true;
                        break;
                }
            }
            else {
                /* Load the unread mandatory message status for displaying mandatory messages if no remember qig*/
                messagingActionCreator.getUnreadMandatoryMessageStatus(enums.TriggerPoint.QigSelector);
                this.getQigData(0, true);
            }
        }
    };
    /**
     * Get the Overview Count
     */
    QigSelector.prototype.getTeamManagementOverviewCounts = function () {
        teamManagementActionCreator.getTeamManagementOverviewCounts(this._rememberQigInfo.examinerRoleId, this._rememberQigInfo.qigId, false, true);
    };
    /**
     * Method which handles the click event on the QIG Selector drop down
     */
    QigSelector.prototype.onQIGSelectorClick = function (keyEvent) {
        if (!messageStore.instance.isMessagePanelActive) {
            /* If pressed key is not Enter it will skip */
            if (keyEvent.charCode !== undefined && keyEvent.charCode !== keyCodes.ENTER_KEY) {
                return;
            }
            this.setState({
                isOpen: !this.state.isOpen
            });
            // If the QIG Selector is not yet open
            if (!this.state.isOpen) {
                // On clicking the QIG Selector drop down, it should expand to show the Loading Indicator
                // until the QIG List is retrieved from the server
                this.refreshQIGSelectorDropdown(Date.now(), true, true);
                // Invoke the method to fetch the QIG Data
                this.getQigData();
            }
            else {
                // If the QIG selector drop down is already open, then refresh the QIG Selector to just close it on clicking the drop down
                this.refreshQIGSelectorDropdown(Date.now(), false, false);
            }
        }
        else {
            this.messageNavigationArguments = {
                responseId: null,
                canNavigate: false,
                navigateTo: enums.MessageNavigation.toQigSelector,
                navigationConfirmed: false,
                hasMessageContainsDirtyValue: undefined,
                triggerPoint: enums.TriggerPoint.None
            };
            messagingActionCreator.canMessageNavigate(this.messageNavigationArguments);
        }
    };
    /**
     * Method which refreshes the QIG Selector drop down
     */
    QigSelector.prototype.refreshQIGSelectorDropdown = function (renderedOn, doOpenQIGSelectorDropdown, doShowLoadingIndicator, isSimulationTargetCompleted) {
        if (isSimulationTargetCompleted === void 0) { isSimulationTargetCompleted = false; }
        // Setting the state for re-rendering the QIG Selector
        this.setState({
            renderedOn: renderedOn,
            isLoadingIndicatorShown: doShowLoadingIndicator,
            isOpen: this.props.isInTeamManagement ? false : doOpenQIGSelectorDropdown,
            shouldRender: isSimulationTargetCompleted
        });
    };
    /**
     * Method which gets the selected QIG's name based on the Awarding Body specific QIG Naming format
     */
    QigSelector.prototype.getCurrentQIGName = function () {
        // Calling the helper method to format the QIG Name
        if (qigStore.instance.selectedQIGForMarkerOperation !== undefined) {
            var selectedQig = qigStore.instance.selectedQIGForMarkerOperation;
            return stringFormatHelper.formatAwardingBodyQIG(selectedQig.markSchemeGroupName, selectedQig.assessmentCode, selectedQig.sessionName, selectedQig.componentId, selectedQig.questionPaperName, selectedQig.assessmentName, selectedQig.componentName, stringFormatHelper.getOverviewQIGNameFormat());
        }
        // If a QIG is not selected, return the default text to be shown on the drop down
        return localeStore.instance.TranslateText('messaging.compose-message.please-select-qig-placeholder');
    };
    return QigSelector;
}(pureRenderComponent));
module.exports = QigSelector;
//# sourceMappingURL=qigselector.js.map