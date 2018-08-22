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
var enums = require('../utility/enums');
var classNames = require('classnames');
var localeStore = require('../../stores/locale/localestore');
var teamManagementFactory = require('../../utility/teammanagement/teammanagementfactory');
var LoadingIndicator = require('../utility/loadingindicator/loadingindicator');
var applicationStore = require('../../stores/applicationoffline/applicationstore');
var sortHelper = require('../../utility/sorting/sorthelper');
var comparerList = require('../../utility/sorting/sortbase/comparerlist');
var Immutable = require('immutable');
var examinerViewDataHelper = require('../../utility/teammanagement/helpers/examinerviewdatahelper');
var TeamManagementTableWrapper = require('./teammanagementtablewrapper');
var teamManagementStore = require('../../stores/teammanagement/teammanagementstore');
var navigationHelper = require('../utility/navigation/navigationhelper');
var worklistActioncreator = require('../../actions/worklist/worklistactioncreator');
var qigStore = require('../../stores/qigselector/qigstore');
var worklistStore = require('../../stores/worklist/workliststore');
var scriptImageDownloadHelper = require('../../components/utility/backgroundworker/scriptimagedownloadhelper');
var scriptActionCreator = require('../../actions/script/scriptactioncreator');
var scriptStore = require('../../stores/script/scriptstore');
var responseActionCreator = require('../../actions/response/responseactioncreator');
var markSchemeHelper = require('../../utility/markscheme/markschemehelper');
var responseStore = require('../../stores/response/responsestore');
var markingStore = require('../../stores/marking/markingstore');
var BusyIndicator = require('../utility/busyindicator/busyindicator');
var teamManagementActionCreator = require('../../actions/teammanagement/teammanagementactioncreator');
var responseSearchHelper = require('../../utility/responsesearch/responsesearchhelper');
var examinerstore = require('../../stores/markerinformation/examinerstore');
var stampActionCreator = require('../../actions/stamp/stampactioncreator');
var stampStore = require('../../stores/stamp/stampstore');
var userOptionsHelper = require('../../utility/useroption/useroptionshelper');
var useroptionKeys = require('../../utility/useroption/useroptionkeys');
var eCourseworkHelper = require('../utility/ecoursework/ecourseworkhelper');
var MultiQigDropDown = require('./multiqigdropdown');
var ccValues = require('../../utility/configurablecharacteristic/configurablecharacteristicsvalues');
var MultiQigLockPopup = require('./multiqiglockpopup');
var busyIndicatorActionCreator = require('../../actions/busyindicator/busyindicatoractioncreator');
var configurableCharacteristicsHelper = require('../../utility/configurablecharacteristic/configurablecharacteristicshelper');
var configurableCharacteristicsNames = require('../../utility/configurablecharacteristic/configurablecharacteristicsnames');
var MultiQigLockResultPopup = require('./multiqiglockresultpopup');
var responseHelper = require('../utility/responsehelper/responsehelper');
/**
 * React component for Team management container
 */
var TeamManagementContainer = (function (_super) {
    __extends(TeamManagementContainer, _super);
    /**
     * @constructor
     */
    function TeamManagementContainer(props, state) {
        var _this = this;
        _super.call(this, props, state);
        this.gridStyle = '';
        this.busyIndicatorInvoker = enums.BusyIndicatorInvoker.none;
        this.showBackgroundScreenOnBusy = false;
        /**
         * Get the grid control id
         */
        this.getGridControlId = function () {
            var gridId = enums.TeamManagement[_this.props.teamManagementTab] + '_grid_' + _this.props.id;
            return gridId;
        };
        /**
         * This method will call on my team data load
         */
        this.onMyTeamDataLoad = function (isFromHistory) {
            if (isFromHistory) {
                return;
            }
            _this.setState({
                renderedOn: Date.now()
            });
        };
        /**
         * This method will call on exception data load
         */
        this.onExceptionDataLoad = function () {
            // Check if exception count in store variables- teamOverviewCountData.exceptionCount and that in exceptionList
            // are same; if not, load the latest data from server else consider the ones in exceptionList
            var _selectedQig = teamManagementStore.instance.getSelectedQig;
            if (_selectedQig &&
                teamManagementStore.instance.exceptionList.count() === _selectedQig.exceptionCount) {
                _this.exceptionData = Immutable.List(teamManagementStore.instance.exceptionList);
            }
            else {
                teamManagementActionCreator.getUnactionedExceptions(teamManagementStore.instance.selectedMarkSchemeGroupId, false);
            }
            _this.setState({
                renderedOn: Date.now()
            });
        };
        /**
         * This method will call on help examiners data load
         */
        this.onHelpExaminersDataLoad = function (isFromHistory) {
            if (isFromHistory) {
                return;
            }
            _this.helpExaminerData = teamManagementStore.instance.examinersForHelpExaminers;
            _this.setState({
                renderedOn: Date.now()
            });
        };
        /**
         * Load the Team Management Right panel
         */
        this.loadTeamManagementRightPanel = function () {
            var teamManagementRightPanel;
            if (_this.props.teamManagementTab === undefined || _this.props.teamManagementTab === enums.TeamManagement.None
                || (_this.props.teamManagementTab === enums.TeamManagement.MyTeam &&
                    teamManagementStore.instance.myTeamData.size === 0) ||
                (_this.props.teamManagementTab === enums.TeamManagement.Exceptions && _this.exceptionData === undefined)) {
                teamManagementRightPanel = _this.loading;
            }
            else {
                teamManagementRightPanel = (React.createElement("div", {className: 'wrapper'}, React.createElement("div", {className: 'clearfix wl-page-header col-wrap'}, React.createElement("div", {className: 'col-6-of-12', id: 'team-management-header-text'}, _this.getTeamManagementTabHeader()), React.createElement("div", {className: 'col-6-of-12'})), _this.loadTeamManagementScreen()));
            }
            return teamManagementRightPanel;
        };
        /**
         * returns the team management grid
         * @param teamManagementTab
         */
        this.getTeamManagementTabComponent = function (teamManagementTab) {
            var grid;
            grid = (React.createElement("div", {className: 'grid-wrapper'}, React.createElement(TeamManagementTableWrapper, {columnHeaderRows: _this._gridColumnHeaderRows, frozenHeaderRows: _this._gridFrozenHeaderRows, frozenBodyRows: _this._gridFrozenBodyRows, gridRows: _this._gridRows, getGridControlId: _this.getGridControlId, id: _this.props.id, key: 'teammanagementcontainer_key_' + _this.props.id, selectedLanguage: _this.props.selectedLanguage, teamManagementTab: _this.props.teamManagementTab, onSortClick: _this.onSortClick, renderedOn: _this.state.renderedOn})));
            return grid;
        };
        /**
         * returns the header element of Team Management tab.
         */
        this.getTeamManagementTabHeader = function () {
            var headingText;
            switch (_this.props.teamManagementTab) {
                case enums.TeamManagement.MyTeam:
                    headingText = localeStore.instance.TranslateText('team-management.left-panel.my-team');
                    break;
                case enums.TeamManagement.HelpExaminers:
                    headingText = localeStore.instance.TranslateText('team-management.left-panel.help-examiners');
                    break;
                case enums.TeamManagement.Exceptions:
                    headingText = localeStore.instance.TranslateText('team-management.left-panel.exceptions');
                    break;
            }
            var element = (React.createElement("h3", {className: 'shift-left page-title'}, headingText));
            return element;
        };
        /**
         * Decide which screen to load based on the left side selected link
         */
        this.loadTeamManagementScreen = function () {
            //Sets the local variables with row data collection
            _this.setRowDefinitionCollections(_this.props.teamManagementTab);
            var result;
            var grid = _this.getTeamManagementTabComponent(_this.props.teamManagementTab);
            /* Multi QIG Dropdown is visible only if the selected tab is help examiner and
               SEPQuestionPaperManagement CC is enabled for the QP and
               the selected QP is a Multi QIG*/
            var multiQigDropDown = null;
            var multiQigLockPopup = null;
            var multiQigLockResultPopup = null;
            var multiQigData = teamManagementStore.instance.teamOverviewCountData ?
                teamManagementStore.instance.teamOverviewCountData.qigDetails : undefined;
            if (multiQigData && multiQigData.length > 0) {
                // Filter multiQigData based on the senior examiner approval status is Approved.
                multiQigData = multiQigData.filter(function (x) {
                    return x.approvalStatusId === enums.ExaminerApproval.Approved;
                });
            }
            if (_this.props.teamManagementTab === enums.TeamManagement.HelpExaminers
                && ccValues.sepQuestionPaperManagement && (multiQigData && multiQigData.length > 1)) {
                multiQigData = Immutable.List(sortHelper.sort(multiQigData, comparerList.MultiQigListComparer));
                multiQigDropDown = (React.createElement(MultiQigDropDown, {selectedLanguage: localeStore.instance.Locale, id: 'multiQigDropDown', key: 'multiQigDropDown_key', multiQigItemList: multiQigData}));
                multiQigLockPopup = (React.createElement(MultiQigLockPopup, {id: 'multiQigLockPopup', key: 'multiQigLockPopup_key', selectedLanguage: localeStore.instance.Locale}));
                multiQigLockResultPopup = (React.createElement(MultiQigLockResultPopup, {id: 'multiQigLockResultPopup', key: 'multiQigLockResultPopup_key', selectedLanguage: localeStore.instance.Locale}));
            }
            result = (React.createElement("div", {className: 'grid-holder grid-view'}, multiQigDropDown, multiQigLockPopup, multiQigLockResultPopup, grid));
            return result;
        };
        /**
         * Rerender the grid while expand or collapse a particular node
         */
        this.onCollapseOrExpandExaminerNode = function () {
            _this.setState({ renderedOn: Date.now() });
        };
        /**
         * Drill-Down examiner worklist details
         */
        this.onExaminerDrillDown = function (markSchemeGroupId, isFromHistory) {
            if (isFromHistory) {
                return;
            }
            navigationHelper.loadWorklist();
        };
        /**
         * SEP Action return callback.
         */
        this.onApprovalManagementActionExecuted = function (actionIdentifier, sepApprovalManagementActionResults) {
            // if examiner got UnLocked without error, Refresh UI without changing the sort order. Actions, lock columns should update
            var sepApprovalManagementActionResult;
            sepApprovalManagementActionResult = sepApprovalManagementActionResults.first();
            if (sepApprovalManagementActionResult.success &&
                sepApprovalManagementActionResult.failureCode === enums.SEPActionFailureCode.None &&
                actionIdentifier === enums.SEPAction.Unlock) {
                _this.helpExaminerData.forEach(function (x) {
                    if (x.examinerId === sepApprovalManagementActionResult.examiner.examinerId) {
                        x.locked = false;
                        x.lockedByExaminerId = 0;
                        x.actions = sepApprovalManagementActionResult.examiner.actions;
                        _this.setState({ renderedOn: Date.now() });
                        return;
                    }
                });
            }
        };
        /**
         * Get selected exception.
         */
        this.getSelectedException = function () {
            if (teamManagementStore.instance.selectedException &&
                qigStore.instance.selectedQIGForMarkerOperation) {
                _this.setBusyIndicatorProperties(enums.BusyIndicatorInvoker.loadingResponse, false);
                _this.setState({ isBusy: true });
                var selectedException = teamManagementStore.instance.selectedException;
                var markSchemeGroupId = qigStore.instance.selectedQIGForMarkerOperation.markSchemeGroupId;
                var questionPaperPartId = qigStore.instance.selectedQIGForMarkerOperation.questionPaperPartId;
                var isElectronicStandardisationTeamMember = qigStore.instance.selectedQIGForMarkerOperation.isElectronicStandardisationTeamMember;
                var remarkRequestTypeID = void 0;
                var isDirectRemark = void 0;
                isDirectRemark = selectedException.directed;
                remarkRequestTypeID = selectedException.remarkRequestTypeId;
                var responseMode = _this.getResponseMode();
                var workListType = _this.getWorklistType();
                // load worklist.
                worklistActioncreator.notifyWorklistTypeChange(markSchemeGroupId, selectedException.originatorExaminerRoleId, questionPaperPartId, workListType, responseMode, remarkRequestTypeID, isDirectRemark, isElectronicStandardisationTeamMember, false);
            }
        };
        /**
         * Worklist data callback event.
         */
        this.markingModeChanged = function () {
            if (teamManagementStore && !teamManagementStore.instance.isRedirectFromException) {
                return;
            }
            responseSearchHelper.openQIGDetails(qigStore.instance.selectedQIGForMarkerOperation.questionPaperPartId, qigStore.instance.selectedQIGForMarkerOperation.markSchemeGroupId, qigStore.instance.selectedQIGForMarkerOperation.examinerRoleId, false, qigStore.instance.selectedQIGForMarkerOperation.examinerApprovalStatus, qigStore.instance.selectedQIGForMarkerOperation.markingMethod, false, qigStore.instance.selectedQIGForMarkerOperation.isElectronicStandardisationTeamMember);
        };
        /**
         * Marker information received call back.
         */
        this.markerInformationReceived = function () {
            if (teamManagementStore && !teamManagementStore.instance.isRedirectFromException) {
                return;
            }
            worklistStore.instance.setCandidateScriptInfoCollection = scriptImageDownloadHelper.constructCandidateScriptInfo(worklistStore.instance.getCurrentWorklistResponseBaseDetails().toArray());
            // initial call for fetching candidate script meta data.
            var markSchemeGroupId = qigStore.instance.selectedQIGForMarkerOperation.markSchemeGroupId;
            var questionPaperPartId = qigStore.instance.selectedQIGForMarkerOperation.questionPaperPartId;
            var isMarkByQuestionModeSet = userOptionsHelper.getUserOptionByName(useroptionKeys.IS_MBQ_SELECTED, qigStore.instance.getSelectedQIGForTheLoggedInUser.examinerRoleId) === 'true';
            var eBookMarkingCCValue = configurableCharacteristicsHelper.getCharacteristicValue(configurableCharacteristicsNames.eBookmarking).toLowerCase() ? true : false;
            var candidateScriptMetadataPromise = scriptActionCreator.fetchCandidateScriptMetadata(worklistStore.instance.getCandidateScriptInfoCollection, questionPaperPartId, markSchemeGroupId, !isMarkByQuestionModeSet, false, // TODO: pass includeRelatedQigs value as true, if anyone of the candidate script is whole response.
            false, eCourseworkHelper ? eCourseworkHelper.isECourseworkComponent : false, eBookMarkingCCValue, enums.StandardisationSetup.None, false, false, qigStore.instance.selectedQIGForMarkerOperation.markingMethod === enums.MarkingMethod.MarkFromObject);
        };
        /**
         * Candidate response meta data received callback event.
         */
        this.onCandidateResponseMetadataRetrieved = function (isAutoRefresh) {
            if (teamManagementStore && !teamManagementStore.instance.isRedirectFromException) {
                return;
            }
            if (scriptStore.instance.getCandidateResponseMetadata !== undefined) {
                //load stamps defined for the selected mark scheme groupId
                stampActionCreator.getStampData(qigStore.instance.selectedQIGForMarkerOperation.markSchemeGroupId, stampStore.instance.stampIdsForSelectedQIG, qigStore.instance.selectedQIGForMarkerOperation.markingMethod, responseHelper.isEbookMarking, true);
            }
        };
        /**
         * Stamp data received callback event.
         */
        this.onStampDataRetrieved = function () {
            if (teamManagementStore && !teamManagementStore.instance.isRedirectFromException) {
                return;
            }
            var selectedException = teamManagementStore.instance.selectedException;
            var displayId = '6' + selectedException.displayId;
            var responseMode = _this.getResponseMode();
            responseActionCreator.openResponse(parseInt(displayId), enums.ResponseNavigation.specific, responseMode, selectedException.markGroupId, enums.ResponseViewMode.zoneView, enums.TriggerPoint.WorkListResponseExceptionIcon);
        };
        /**
         * Open response call back event.
         */
        this.openResponse = function () {
            if (teamManagementStore && !teamManagementStore.instance.isRedirectFromException) {
                return;
            }
            var selectedException = teamManagementStore.instance.selectedException;
            var displayId = '6' + selectedException.displayId;
            var markingMode = worklistStore.instance.getMarkingModeByWorkListType(worklistStore.instance.currentWorklistType);
            eCourseworkHelper.fetchECourseWorkCandidateScriptMetadata(parseInt(displayId));
            markSchemeHelper.getMarks(parseInt(displayId), markingMode);
        };
        /**
         * Marks retrieval event.
         */
        this.marksRetrieved = function () {
            if (teamManagementStore && !teamManagementStore.instance.isRedirectFromException) {
                return;
            }
            navigationHelper.loadResponsePage();
        };
        /**
         * Call back function from table wrapper on sorting
         */
        this.onSortClick = function (comparerName, sortDirection) {
            _this.sortDirection = sortDirection;
            _this.comparerName = comparerName;
            // update sort details in store
            _this.updateSortDetails();
            _this.setState({
                renderedOn: Date.now()
            });
        };
        /**
         * This method will set the default sort details
         */
        this.setDefaultSortDetails = function () {
            var defaultSortDetails = teamManagementStore.instance.getDefaultSortDetails(teamManagementStore.instance.selectedTeamManagementTab);
            _this.comparerName = comparerList[defaultSortDetails.compareName];
            _this.sortDirection = defaultSortDetails.sortDirection;
        };
        /**
         * Update sort details in store
         */
        this.updateSortDetails = function () {
            var sortDetails = {
                qig: teamManagementStore.instance.selectedMarkSchemeGroupId,
                tab: _this.props.teamManagementTab,
                comparerName: comparerList[_this.comparerName],
                sortDirection: _this.sortDirection
            };
            teamManagementActionCreator.onSortClick(sortDetails);
        };
        /**
         * This method will reset sort informations
         */
        this.resetSortInfo = function () {
            _this.comparerName = undefined;
            _this.sortDirection = undefined;
        };
        /**
         * Method to open exception if the examiner is valid.
         */
        this.validateExaminerStatus = function (exceptionId) {
            teamManagementActionCreator.selectedException(exceptionId);
        };
        /**
         * This method will call on multi lock data load
         */
        this.onMultiLockDataLoad = function (selectedExaminerId, selectedQigId, selectedExaminerRoleId) {
            if (!teamManagementStore.instance.multiLockDataList ||
                teamManagementStore.instance.multiLockDataList.count() === 0) {
                _this.refreshHelpExaminerData(selectedExaminerId, selectedExaminerRoleId);
            }
            busyIndicatorActionCreator.setBusyIndicatorInvoker(enums.BusyIndicatorInvoker.none);
            _this.setState({
                isBusy: false
            });
        };
        /**
         * This method will call on multi lock result received
         */
        this.onMultiLockResultReceived = function () {
            busyIndicatorActionCreator.setBusyIndicatorInvoker(enums.BusyIndicatorInvoker.none);
        };
        // initialising examiner view data helper
        this.examinerViewDataHelper = new examinerViewDataHelper();
        /* getting user preference for the grid view */
        this.state = {
            isBusy: false,
            renderedOn: this.props.renderedOn
        };
        this.toggleLeftPanel = this.toggleLeftPanel.bind(this);
        this.setBusyIndicatorProperties(enums.BusyIndicatorInvoker.loadingResponse, false);
        this.exceptionData = Immutable.List(teamManagementStore.instance.exceptionList);
    }
    /**
     * Render method
     */
    TeamManagementContainer.prototype.render = function () {
        this.setLoadingindicator();
        /* if there are no match and the data has not been loaded, show busy indicator */
        var busyIndicator = (React.createElement(BusyIndicator, {id: 'response_' + this.busyIndicatorInvoker.toString(), isBusy: this.state.isBusy, key: 'response_' + this.busyIndicatorInvoker.toString(), isMarkingBusy: true, busyIndicatorInvoker: this.busyIndicatorInvoker, doShowDialog: true, showBackgroundScreen: this.showBackgroundScreenOnBusy}));
        return (React.createElement("div", {className: 'column-right'}, React.createElement("a", {href: 'javascript:void(0);', className: 'toggle-left-panel', id: 'side-panel-toggle-button', title: localeStore.instance.TranslateText('team-management.left-panel.show-hide-panel-tooltip'), onClick: this.toggleLeftPanel}, React.createElement("span", {className: 'sprite-icon panel-toggle-icon'}, "panel toggle")), this.loadTeamManagementRightPanel(), busyIndicator));
    };
    /**
     * componentDidMount React lifecycle event
     */
    TeamManagementContainer.prototype.componentDidMount = function () {
        teamManagementStore.instance.addListener(teamManagementStore.TeamManagementStore.EXPAND_OR_COLLAPSE_NODE_EVENT, this.onCollapseOrExpandExaminerNode);
        teamManagementStore.instance.addListener(teamManagementStore.TeamManagementStore.MY_TEAM_DATA_LOADED_EVENT, this.onMyTeamDataLoad);
        teamManagementStore.instance.addListener(teamManagementStore.TeamManagementStore.TEAM_EXCEPTIONS_DATA_LOADED_EVENT, this.onExceptionDataLoad);
        teamManagementStore.instance.addListener(teamManagementStore.TeamManagementStore.EXAMINER_DRILL_DOWN_DATA_UPDATED, this.onExaminerDrillDown);
        teamManagementStore.instance.addListener(teamManagementStore.TeamManagementStore.HELP_EXAMINERS_DATA_RECEIVED, this.onHelpExaminersDataLoad);
        teamManagementStore.instance.addListener(teamManagementStore.TeamManagementStore.APPROVAL_MANAGEMENT_ACTION_EXECUTED, this.onApprovalManagementActionExecuted);
        teamManagementStore.instance.addListener(teamManagementStore.TeamManagementStore.SELECTED_EXCEPTION_ACTION_RECEIVED, this.getSelectedException);
        worklistStore.instance.addListener(worklistStore.WorkListStore.WORKLIST_MARKING_MODE_CHANGE, this.markingModeChanged);
        scriptStore.instance.addListener(scriptStore.ScriptStore.CANDIDATE_RESPONSE_METADATA_RETRIEVAL_EVENT, this.onCandidateResponseMetadataRetrieved);
        responseStore.instance.addListener(responseStore.ResponseStore.RESPONSE_OPENED, this.openResponse);
        markingStore.instance.addListener(markingStore.MarkingStore.RETRIEVE_MARKS_EVENT, this.marksRetrieved);
        examinerstore.instance.addListener(examinerstore.ExaminerStore.MARKER_INFO_UPDATED_EVENT, this.markerInformationReceived);
        stampStore.instance.addListener(stampStore.StampStore.STAMPS_LOADED_EVENT, this.onStampDataRetrieved);
        teamManagementStore.instance.addListener(teamManagementStore.TeamManagementStore.TEAM_MANAGEMENT_SELECTED_TAB, this.resetSortInfo);
        teamManagementStore.instance.addListener(teamManagementStore.TeamManagementStore.EXAMINER_VALIDATED_OPEN_EXCEPTION_EVENT, this.validateExaminerStatus);
        teamManagementStore.instance.addListener(teamManagementStore.TeamManagementStore.MULTI_QIG_LOCK_DATA_RECEIVED, this.onMultiLockDataLoad);
        teamManagementStore.instance.addListener(teamManagementStore.TeamManagementStore.MULTI_QIG_LOCK_RESULT_RECEIVED, this.onMultiLockResultReceived);
    };
    /**
     * componentWillUnmount React lifecycle event
     */
    TeamManagementContainer.prototype.componentWillUnmount = function () {
        teamManagementStore.instance.removeListener(teamManagementStore.TeamManagementStore.EXPAND_OR_COLLAPSE_NODE_EVENT, this.onCollapseOrExpandExaminerNode);
        teamManagementStore.instance.removeListener(teamManagementStore.TeamManagementStore.EXAMINER_DRILL_DOWN_DATA_UPDATED, this.onExaminerDrillDown);
        teamManagementStore.instance.removeListener(teamManagementStore.TeamManagementStore.MY_TEAM_DATA_LOADED_EVENT, this.onMyTeamDataLoad);
        teamManagementStore.instance.removeListener(teamManagementStore.TeamManagementStore.TEAM_EXCEPTIONS_DATA_LOADED_EVENT, this.onExceptionDataLoad);
        teamManagementStore.instance.removeListener(teamManagementStore.TeamManagementStore.HELP_EXAMINERS_DATA_RECEIVED, this.onHelpExaminersDataLoad);
        teamManagementStore.instance.removeListener(teamManagementStore.TeamManagementStore.APPROVAL_MANAGEMENT_ACTION_EXECUTED, this.onApprovalManagementActionExecuted);
        teamManagementStore.instance.removeListener(teamManagementStore.TeamManagementStore.SELECTED_EXCEPTION_ACTION_RECEIVED, this.getSelectedException);
        worklistStore.instance.removeListener(worklistStore.WorkListStore.WORKLIST_MARKING_MODE_CHANGE, this.markingModeChanged);
        scriptStore.instance.removeListener(scriptStore.ScriptStore.CANDIDATE_RESPONSE_METADATA_RETRIEVAL_EVENT, this.onCandidateResponseMetadataRetrieved);
        responseStore.instance.removeListener(responseStore.ResponseStore.RESPONSE_OPENED, this.openResponse);
        markingStore.instance.removeListener(markingStore.MarkingStore.RETRIEVE_MARKS_EVENT, this.marksRetrieved);
        examinerstore.instance.removeListener(examinerstore.ExaminerStore.MARKER_INFO_UPDATED_EVENT, this.markerInformationReceived);
        stampStore.instance.removeListener(stampStore.StampStore.STAMPS_LOADED_EVENT, this.onStampDataRetrieved);
        teamManagementStore.instance.removeListener(teamManagementStore.TeamManagementStore.TEAM_MANAGEMENT_SELECTED_TAB, this.resetSortInfo);
        teamManagementStore.instance.removeListener(teamManagementStore.TeamManagementStore.EXAMINER_VALIDATED_OPEN_EXCEPTION_EVENT, this.validateExaminerStatus);
        teamManagementStore.instance.removeListener(teamManagementStore.TeamManagementStore.MULTI_QIG_LOCK_DATA_RECEIVED, this.onMultiLockDataLoad);
        teamManagementStore.instance.removeListener(teamManagementStore.TeamManagementStore.MULTI_QIG_LOCK_RESULT_RECEIVED, this.onMultiLockResultReceived);
    };
    /**
     * This method will call parent component function to toggle left panel
     */
    TeamManagementContainer.prototype.toggleLeftPanel = function () {
        this.props.toggleLeftPanel();
    };
    /**
     * Generating Grid Rows
     * @param tabData
     * @param teamManagementTab
     * @param comparerName
     * @param sortDirection
     */
    TeamManagementContainer.prototype.getGridRows = function (tabData, teamManagementTab, comparerName, sortDirection) {
        return this.teamManagementHelper.generateRowDefinion(tabData, teamManagementTab);
    };
    /**
     * get column header rows for grid
     * @param teamManagementTab
     * @param comparerName
     * @param sortDirection
     */
    TeamManagementContainer.prototype.getGridColumnHeaderRows = function (teamManagementTab, comparerName, sortDirection, tabData) {
        return this.teamManagementHelper.generateTableHeader(teamManagementTab, comparerName, sortDirection, tabData);
    };
    /**
     * Generating Frozen Grid Rows
     * @param tabData
     * @param teamManagementTab
     * @param comparerName
     * @param sortDirection
     */
    TeamManagementContainer.prototype.getFrozenTableBodyRows = function (tabData, teamManagementTab, comparerName, sortDirection) {
        return this.teamManagementHelper.generateFrozenRowBody(tabData, teamManagementTab);
    };
    /**
     * Returning frozen table header rows
     * @param teamManagementTab
     * @param comparerName
     * @param sortDirection
     */
    TeamManagementContainer.prototype.getFrozenTableHeaderRow = function (teamManagementTab, comparerName, sortDirection) {
        return this.teamManagementHelper.generateFrozenRowHeader(teamManagementTab, comparerName, sortDirection);
    };
    /**
     *  Get grid rows and associated table rows ans ets associated local variables
     */
    TeamManagementContainer.prototype.setRowDefinitionCollections = function (teamManagementTab) {
        if (!this.comparerName) {
            this.setDefaultComparer(teamManagementTab);
        }
        // if the direction is descending the text 'Desc' is appending to the comparer name since all
        // descending comparere has the same name followed by text 'Desc'
        var comparerName = (this.sortDirection === enums.SortDirection.Ascending) ? this.comparerName : this.comparerName + 'Desc';
        var tabData;
        switch (teamManagementTab) {
            case enums.TeamManagement.MyTeam:
                tabData = this.examinerViewDataHelper.getExaminerViewDataItems(comparerName, this.sortDirection);
                break;
            case enums.TeamManagement.Exceptions:
                tabData = this.exceptionData;
                break;
            case enums.TeamManagement.HelpExaminers:
                // sort the help examiners list in the ascending order of locked duration (oldest first), if the examiners are locked by the
                // logined examiner, all other examiners will be sorted based on time in current state.
                var sortedHelpExaminersData = this.helpExaminerData;
                if (this.helpExaminerData && this.helpExaminerData.size > 0) {
                    sortedHelpExaminersData = Immutable.List(sortHelper.sort(this.helpExaminerData.toArray(), comparerList[comparerName]));
                }
                tabData = sortedHelpExaminersData;
                break;
        }
        this.teamManagementHelper = teamManagementFactory.getTeamManagementlistHelper(this.props.teamManagementTab);
        // the below order of fecthing the grid data should be maintained.
        this._gridRows = this.getGridRows(tabData, teamManagementTab, this.comparerName, this.sortDirection);
        this._gridColumnHeaderRows = this.getGridColumnHeaderRows(teamManagementTab, this.comparerName, this.sortDirection, tabData);
        this._gridFrozenBodyRows = this.getFrozenTableBodyRows(tabData, teamManagementTab, this.comparerName, this.sortDirection);
        this._gridFrozenHeaderRows = this.getFrozenTableHeaderRow(teamManagementTab, this.comparerName, this.sortDirection);
    };
    /**
     * Set the loading indicator
     */
    TeamManagementContainer.prototype.setLoadingindicator = function () {
        this.loading = React.createElement(LoadingIndicator, {id: 'loading', key: 'loading', selectedLanguage: localeStore.instance.Locale, isOnline: applicationStore.instance.isOnline, cssClass: 'section-loader loading'});
    };
    /**
     * Method which sets the busy indicator properties
     * @param busyIndicatorInvoker
     * @param showBackgroundScreenOnBusy
     */
    TeamManagementContainer.prototype.setBusyIndicatorProperties = function (busyIndicatorInvoker, showBackgroundScreenOnBusy) {
        this.busyIndicatorInvoker = busyIndicatorInvoker;
        this.showBackgroundScreenOnBusy = showBackgroundScreenOnBusy;
    };
    /**
     * Method to get the response mode.
     */
    TeamManagementContainer.prototype.getResponseMode = function () {
        var selectedException = teamManagementStore.instance.selectedException;
        if (selectedException) {
            var responseMode = void 0;
            if (selectedException.markGroupStatusId === 91) {
                responseMode = enums.ResponseMode.pending;
            }
            else if (selectedException.markGroupStatusId < 91) {
                responseMode = enums.ResponseMode.open;
            }
            else if (selectedException.markGroupStatusId > 91) {
                responseMode = enums.ResponseMode.closed;
            }
            return responseMode;
        }
    };
    /**
     * Method to get the response mode.
     */
    TeamManagementContainer.prototype.getWorklistType = function () {
        var selectedException = teamManagementStore.instance.selectedException;
        if (selectedException) {
            var workListType = void 0;
            if (selectedException.remarkRequestTypeId !== enums.RemarkRequestType.Unknown &&
                selectedException.pooled && !selectedException.directed) {
                workListType = enums.WorklistType.pooledRemark;
            }
            else if (selectedException.remarkRequestTypeId !== enums.RemarkRequestType.Unknown &&
                !selectedException.pooled && selectedException.directed) {
                workListType = enums.WorklistType.directedRemark;
            }
            else if (selectedException.atypicalStatusId !== 0) {
                workListType = enums.WorklistType.atypical;
            }
            else if (!selectedException.directed && !selectedException.pooled) {
                workListType = enums.WorklistType.live;
            }
            return workListType;
        }
    };
    /**
     * Set the comparer for the current worklist based on the worklisttype,qigId and responseMode
     */
    TeamManagementContainer.prototype.setDefaultComparer = function (teamManagementTab) {
        if (this.comparerName === undefined && this.sortDirection === undefined) {
            var defaultSortDetails = teamManagementStore.instance.sortDetails;
            var entry = defaultSortDetails.filter(function (x) {
                return x.qig === teamManagementStore.instance.selectedMarkSchemeGroupId && x.tab === teamManagementTab;
            });
            if (entry.length > 0) {
                this.comparerName = comparerList[entry[0].comparerName];
                this.sortDirection = entry[0].sortDirection;
            }
            else {
                this.setDefaultSortDetails();
                // update the default sort order in store
                this.updateSortDetails();
            }
        }
    };
    /**
     * This method is used to refresh the help examiner data after lock action completed and navigate to help examiner work list
     */
    TeamManagementContainer.prototype.refreshHelpExaminerData = function (selectedExaminerId, selectedExaminerRoleId) {
        // Invoke help examiner data retrieve action for getting refreshed data and update the store.
        teamManagementActionCreator.GetHelpExminersData(teamManagementStore.instance.selectedExaminerRoleId, teamManagementStore.instance.selectedMarkSchemeGroupId, !teamManagementStore.instance.isHelpExaminersDataChanged);
        var examinerDrillDownData = {
            examinerId: selectedExaminerId,
            examinerRoleId: selectedExaminerRoleId
        };
        // Update examiner data and navigate to help examiner's worklist for further processing.
        teamManagementActionCreator.updateExaminerDrillDownData(examinerDrillDownData);
    };
    return TeamManagementContainer;
}(pureRenderComponent));
module.exports = TeamManagementContainer;
//# sourceMappingURL=teammanagementcontainer.js.map