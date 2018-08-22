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
var WorkListMessage = require('./shared/worklistmessage');
var AllocateResponseButton = require('./shared/allocateresponsebutton');
var GridControl = require('../utility/grid/gridcontrol');
//import liveWorkListHelper = require('../../utility/grid/worklisthelpers/liveworklisthelper');
var enums = require('../utility/enums');
var GridToggleButton = require('./shared/gridtogglebutton');
var TabControl = require('../utility/tab/tabcontrol');
var TabContentContainer = require('../utility/tab/tabcontentcontainer');
var classNames = require('classnames');
var userOptionsHelper = require('../../utility/useroption/useroptionshelper');
var userOptionKeys = require('../../utility/useroption/useroptionkeys');
var targetSummaryStore = require('../../stores/worklist/targetsummarystore');
var localeStore = require('../../stores/locale/localestore');
var qigStore = require('../../stores/qigselector/qigstore');
var worklistStore = require('../../stores/worklist/workliststore');
var responseStore = require('../../stores/response/responsestore');
var responseAllocationButtonValidationHelper = require('../utility/responseallocation/responseallocationbuttonvalidationhelper');
var worklistActionCreator = require('../../actions/worklist/worklistactioncreator');
var SubmitResponse = require('./shared/submitresponse');
var tabHelper = require('../utility/tab/tabhelper');
var targetHelper = require('../../utility/target/targethelper');
var markSchemeHelper = require('../../utility/markscheme/markschemehelper');
var examinerStore = require('../../stores/markerinformation/examinerstore');
var qualityFeedbackHelper = require('../../utility/qualityfeedback/qualityfeedbackhelper');
var worklistFactory = require('../../utility/worklist/worklistfactory');
var StandardisationWorklistMessage = require('./shared/standardisationworklistmessage');
var WorklistTableWrapper = require('./worklisttablewrapper');
var LoadingIndicator = require('../utility/loadingindicator/loadingindicator');
var messageStore = require('../../stores/message/messagestore');
var messagingActionCreator = require('../../actions/messaging/messagingactioncreator');
var applicationStore = require('../../stores/applicationoffline/applicationstore');
var sortHelper = require('../../utility/sorting/sorthelper');
var comparerList = require('../../utility/sorting/sortbase/comparerlist');
var Immutable = require('immutable');
var AtypicalSearchBar = require('./atypicalsearchbar');
var userInfoActionCreator = require('../../actions/userinfo/userinfoactioncreator');
var responseHelper = require('../utility/responsehelper/responsehelper');
var markerOperationModeFactory = require('../utility/markeroperationmode/markeroperationmodefactory');
var MarkingCheckIndicator = require('./markingcheckindicator');
var WorklistFilter = require('./worklistfilter');
var stringFormatHelper = require('../../utility/stringformat/stringformathelper');
var teamManagementStore = require('../../stores/teammanagement/teammanagementstore');
var htmlUtilities = require('../../utility/generic/htmlutilities');
var markingCheckActionCreator = require('../../actions/markingcheck/markingcheckactioncreator');
var eCourseworkHelper = require('../utility/ecoursework/ecourseworkhelper');
var PendingWorklistBanner = require('./shared/pendingworklistbanner');
var constants = require('../utility/constants');
var stringHelper = require('../../utility/generic/stringhelper');
var applicationActionCreator = require('../../actions/applicationoffline/applicationactioncreator');
/**
 * React component for live worklist
 */
var WorkListContainer = (function (_super) {
    __extends(WorkListContainer, _super);
    /**
     * @constructor
     */
    function WorkListContainer(props, state) {
        var _this = this;
        _super.call(this, props, state);
        this.isGraceTabVisible = true;
        this.gridStyle = '';
        this.isAtypicalCenterNumber = false;
        this.isAtypicalCandidateNumber = false;
        this.isSubmitDisabled = false;
        this.isErrorOccuredInWholeResponseAllocation = false;
        this.doSetMinWidth = true;
        /*
        * This function will pass to grid control as a callback function
        */
        this.handleTileClick = function (responseId) {
            if (!applicationStore.instance.isOnline) {
                applicationActionCreator.checkActionInterrupted();
            }
            else {
                var isTileView = userOptionsHelper.getUserOptionByName(userOptionKeys.SELECTED_GRID_TYPE) === 'true' ? true : false;
                _this.messageNavigationArguments = {
                    responseId: responseId,
                    canNavigate: true,
                    navigateTo: enums.MessageNavigation.toResponse,
                    navigationConfirmed: false,
                    hasMessageContainsDirtyValue: undefined,
                    triggerPoint: enums.TriggerPoint.None
                };
                if (isTileView) {
                    if (!messageStore.instance.isMessagePanelActive) {
                        _this.onNavigatetoResponse(_this.messageNavigationArguments);
                    }
                    else {
                        //if message panel is active call the navigation actions
                        _this.messageNavigationArguments.canNavigate = false;
                        _this.messageNavigationArguments.navigationConfirmed = false;
                        messagingActionCreator.canMessageNavigate(_this.messageNavigationArguments);
                    }
                }
            }
        };
        /**
         * Get the grid control id
         */
        this.getGridControlId = function () {
            var gridId = enums.WorklistType[_this.props.worklistType] + '_'
                + enums.ResponseMode[_this.props.responseMode] + '_grid_' + _this.props.id;
            return gridId;
        };
        // update worklist on changing marking check worklist
        this.reRender = function () {
            var rightSpacer = htmlUtilities.getElementsByClassName('right-spacer');
            if (rightSpacer.length > 0) {
                rightSpacer.style.paddingLeft = '';
            }
            _this.setState({
                renderedOn: Date.now(),
                isTileView: false
            });
        };
        /**
         *
         */
        this.updateMarkCheckWorklistAccessMessage = function () {
            _this.setState({
                isMarkingCheckWorklistAccessPresent: _this.props.isTeamManagementMode ? false : worklistStore.instance.isMarkingCheckWorklistAccessPresent
            });
        };
        this.updateMarkerInformationPanel = function () {
            _this.setState({ renderedOn: Date.now() });
        };
        /**
         * returns the worklist component based on the view (tile/list)
         * @param worklistType
         */
        this.getWorklistComponent = function (worklistType) {
            var isQualityFeedbackMessageToBeDisplayed = qualityFeedbackHelper.isQualtiyHelperMessageNeededToBeDisplayed(_this.props.worklistType);
            var grid;
            if (_this.state.isTileView) {
                grid = (React.createElement(GridControl, {gridRows: _this._gridRows, gridStyle: _this.gridStyle, onClickCallBack: _this.handleTileClick, id: _this.getGridControlId(), key: 'key_' + _this.props.id, worklistType: worklistType, selectedLanguage: _this.props.selectedLanguage}));
            }
            else {
                grid = (React.createElement("div", {className: classNames('grid-wrapper', { 'show-seed-message': isQualityFeedbackMessageToBeDisplayed })}, React.createElement(WorklistTableWrapper, {columnHeaderRows: _this._gridColumnHeaderRows, frozenHeaderRows: _this._gridFrozenHeaderRows, frozenBodyRows: _this._gridFrozenBodyRows, gridRows: _this._gridRows, getGridControlId: _this.getGridControlId, id: _this.props.id, key: 'worklistcontainer_key_' + _this.props.id, selectedLanguage: _this.props.selectedLanguage, worklistType: _this.props.worklistType, onSortClick: _this.onSortClick, doSetMinWidth: _this.doSetMinWidth, renderedOn: _this.state.renderedOn})));
            }
            return grid;
        };
        /**
         * Invoked while clicking the filter
         */
        this.onWorklistFilterSelected = function (selectedFilter) {
            // FIre action for filter the data
            worklistActionCreator.setFilteredWorklistData(qigStore.instance.selectedQIGForMarkerOperation.examinerRoleId, selectedFilter);
        };
        /**
         * Invoked while filtered data in the store
         */
        this.onWorklistFilterChanged = function (selectedFilter) {
            if (_this.state.selectedFilterType !== selectedFilter) {
                var examinerRoleID = qigStore.instance.selectedQIGForMarkerOperation.examinerRoleId;
                var worklistType = _this.props.worklistType;
                var remarkRequestType = _this.props.remarkRequestType;
                var isDirectedRemark = _this.props.isDirectedRemark;
                if (_this.props.isMarkingCheckMode) {
                    examinerRoleID = worklistStore.instance.selectedMarkingCheckExaminer.examinerRoleID;
                    worklistType = enums.WorklistType.live;
                    remarkRequestType = enums.RemarkRequestType.Unknown;
                    isDirectedRemark = false;
                }
                // Get script images from cache once the filter change.
                worklistActionCreator.notifyWorklistTypeChange(qigStore.instance.selectedQIGForMarkerOperation.markSchemeGroupId, examinerRoleID, qigStore.instance.selectedQIGForMarkerOperation.questionPaperPartId, worklistType, enums.ResponseMode.closed, remarkRequestType, isDirectedRemark, qigStore.instance.selectedQIGForMarkerOperation.isElectronicStandardisationTeamMember, true, _this.props.isMarkingCheckMode);
                _this.setState({
                    selectedFilterType: selectedFilter,
                    renderedOn: Date.now()
                });
            }
        };
        /**
         * returns the header element of worklist.
         */
        this.getWorklistHeader = function () {
            var headingText;
            if (_this.props.isMarkingCheckMode) {
                var formattedString = stringFormatHelper.getUserNameFormat().toLowerCase();
                formattedString = formattedString.replace('{initials}', worklistStore.instance.selectedMarkingCheckExaminer.toExaminer.initials);
                formattedString = formattedString.replace('{surname}', worklistStore.instance.selectedMarkingCheckExaminer.toExaminer.surname);
                headingText = localeStore.instance.TranslateText('marking.worklist.worklist-headers.live')
                    + ' ' + localeStore.instance.TranslateText('marking.worklist.perform-marking-check.worklist-of-examiner')
                    + ' ' + formattedString;
            }
            else {
                switch (_this.props.worklistType) {
                    case enums.WorklistType.live:
                        headingText = localeStore.instance.TranslateText('marking.worklist.worklist-headers.live');
                        break;
                    case enums.WorklistType.atypical:
                        headingText = localeStore.instance.TranslateText('marking.worklist.worklist-headers.atypical');
                        break;
                    case enums.WorklistType.practice:
                        headingText = localeStore.instance.TranslateText('marking.worklist.worklist-headers.practice');
                        break;
                    case enums.WorklistType.standardisation:
                        headingText = localeStore.instance.TranslateText('marking.worklist.worklist-headers.standardisation');
                        break;
                    case enums.WorklistType.secondstandardisation:
                        headingText = (qigStore.instance.selectedQIGForMarkerOperation.isElectronicStandardisationTeamMember === false ?
                            localeStore.instance.TranslateText('marking.worklist.worklist-headers.secondstandardisation')
                            : localeStore.instance.TranslateText('marking.worklist.worklist-headers.stm-standardisation'));
                        break;
                    case enums.WorklistType.directedRemark:
                        headingText = stringHelper.format(localeStore.instance.TranslateText('generic.remark-types.long-names.' +
                            enums.RemarkRequestType[_this.props.remarkRequestType]), [constants.NONBREAKING_HYPHEN_UNICODE]);
                        break;
                    case enums.WorklistType.pooledRemark:
                        headingText = stringHelper.format(localeStore.instance.TranslateText('generic.remark-types.long-names.' +
                            enums.RemarkRequestType[_this.props.remarkRequestType]), [constants.NONBREAKING_HYPHEN_UNICODE]);
                        break;
                    case enums.WorklistType.simulation:
                        headingText = localeStore.instance.TranslateText('marking.worklist.worklist-headers.simulation');
                        break;
                }
            }
            var element = (React.createElement("h3", {className: 'shift-left page-title', id: 'worklistTitle'}, React.createElement("span", {className: 'page-title-text'}, headingText), React.createElement("span", {className: 'right-spacer'})));
            return element;
        };
        /**
         * returns the Atypical search bar for atypical worklist
         */
        this.getAtypicalSearchBar = function () {
            var atypicalSearchBarElement = null;
            if (_this.props.selectedTab === enums.ResponseMode.open) {
                atypicalSearchBarElement = React.createElement(AtypicalSearchBar, {id: 'atypicalSearchBar', key: 'atypicalSearchBar', disableControls: !qigStore.instance.isAtypicalAvailable, selectedLanguage: _this.props.selectedLanguage});
            }
            else {
                atypicalSearchBarElement = (React.createElement("div", {className: 'atypical-search-wrap middle-content'}));
            }
            return atypicalSearchBarElement;
        };
        /**
         * Method called when response allocated
         * @param responseAllocationErrorCode
         */
        this.onResponseAllocated = function (responseAllocationErrorCode) {
            if (responseStore.instance.isWholeResponseAllocation &&
                (responseAllocationErrorCode === enums.ResponseAllocationErrorCode.suspendedMarker ||
                    responseAllocationErrorCode === enums.ResponseAllocationErrorCode.unApprovedMarker)) {
                // Visibility of whole response button handled for this particular error code
                _this.isErrorOccuredInWholeResponseAllocation = true;
            }
        };
        /**
         * Function to bypass sorting for a specific requirment.
         */
        this.isSortRequired = function () {
            var isSortRequired = true;
            // To bypass sorting in closed response, if any quality feedback is pending
            if (_this.props.responseMode === enums.ResponseMode.closed
                && qualityFeedbackHelper.isQualtiyHelperMessageNeededToBeDisplayed(_this.props.worklistType) === true) {
                isSortRequired = false;
                // setting the default sort order for closed response, if any quality feedback is pending.
                _this.comparerName = comparerList[comparerList.submittedDateComparer];
                _this.sortDirection = enums.SortDirection.Descending;
            }
            return isSortRequired;
        };
        this.setLoadingindicator();
        /* getting user preference for the grid view */
        this.state = {
            isTileView: this.props.isTeamManagementMode || this.props.isMarkingCheckMode ? false :
                userOptionsHelper.getUserOptionByName(userOptionKeys.SELECTED_GRID_TYPE) === 'true' ? true : false,
            isGridviewChanged: false,
            isMarkingCheckWorklistAccessPresent: false,
            selectedFilterType: worklistStore.instance.getSelectedFilterDetails.get(teamManagementStore.instance.examinerDrillDownData ?
                teamManagementStore.instance.examinerDrillDownData.examinerRoleId : 0, enums.WorklistSeedFilter.All)
        };
        // resetting the comparer at start
        this.resetSortAttributes();
        this.toggleLeftPanel = this.toggleLeftPanel.bind(this);
        this.selectTab = this.selectTab.bind(this);
        this.toggleGridView = this.toggleGridView.bind(this);
        this.onSortClick = this.onSortClick.bind(this);
        this.resetSortAttributes = this.resetSortAttributes.bind(this);
        this.onResponseAllocated = this.onResponseAllocated.bind(this);
    }
    /**
     * Render method
     */
    WorkListContainer.prototype.render = function () {
        this.setLoadingindicator();
        /* if there are no match and the data has not been loaded, show busy indicator */
        if (this.props.worklistType === undefined || this.props.worklistType === enums.WorklistType.none) {
            return this.loading;
        }
        else {
            this.worklistHelper = worklistFactory.getWorklistHelper(this.props.worklistType);
            this.setWorklistData();
            var validationResponseAllocationButtonValidationParam = responseAllocationButtonValidationHelper.validate(this.openWorklist, targetHelper.getExaminerQigStatus(), targetHelper.getExaminerApproval(), this.props.worklistType, this.props.remarkRequestType, this.props.isTeamManagementMode || this.props.isMarkingCheckMode);
            this.showHideAllocateNewResponseButton(validationResponseAllocationButtonValidationParam);
            this.isSubmitDisabled = markerOperationModeFactory.operationMode.isSubmitDisabled(this.props.worklistType);
            var currentTarget = targetSummaryStore.instance.getCurrentTarget();
            var atypicalSearchVisible = this.props.worklistType === enums.WorklistType.atypical
                && !this.props.isTeamManagementMode;
            var responseDownloadButton = atypicalSearchVisible ?
                this.getAtypicalSearchBar() :
                (React.createElement("div", {className: 'get-response-wrapper'}, this.getNewResponseButton, this.markingCheckCompleteButton()));
            var stylePanel = {
                minWidth: 0
            };
            var element = htmlUtilities.getElementsByClassName('get-response-wrapper');
            // Added for styling the worklist when there is no get new response button.
            if (this.getNewResponseButton === undefined) {
                stylePanel = { minWidth: 0 };
            }
            else if (element.length > 0 && this.props.responseMode === enums.ResponseMode.open) {
                var minwidth = element[0].clientWidth;
                stylePanel = { minWidth: minwidth };
            }
            return (React.createElement("div", {className: 'column-right tab-holder horizontal response-tabs'}, React.createElement("a", {href: 'javascript:void(0);', className: 'toggle-left-panel', id: 'togglePanel', title: this.props.isMarkingCheckMode ?
                localeStore.instance.TranslateText('marking.worklist.perform-marking-check.show-hide-left-panel-tooltip') :
                localeStore.instance.TranslateText('marking.worklist.left-panel.show-hide-panel-tooltip'), onClick: this.toggleLeftPanel}, React.createElement("span", {className: 'sprite-icon panel-toggle-icon'}, "panel toggle")), React.createElement("div", {className: 'wrapper'}, React.createElement(MarkingCheckIndicator, {id: 'marking_Check_Worklist_Access_Indicator', key: 'marking_Check_Worklist_Access_Indicator', isMarkingCheckAvailable: worklistStore.instance.isMarkingCheckWorklistAccessPresent, isMarkCheckWorklist: this.props.isMarkingCheckMode}), React.createElement("div", {className: classNames('clearfix wl-page-header', {
                'header-search ': atypicalSearchVisible,
                'tabs-2': (qigStore.instance.selectedQIGForMarkerOperation &&
                    !qigStore.instance.selectedQIGForMarkerOperation.hasGracePeriod &&
                    !(currentTarget.examinerProgress.atypicalPendingResponsesCount > 0) &&
                    atypicalSearchVisible) ? true : false
            })}, this.getWorklistHeader(), React.createElement("div", {className: 'tab-nav-holder'}, React.createElement(TabControl, {tabHeaders: tabHelper.getTabHeaderData(this.props.worklistTabDetails, this.props.selectedTab), selectTab: this.selectTab})), React.createElement("div", {className: classNames('response-button-holder arrow-tab ', {
                'atypical-search ': atypicalSearchVisible
            }), style: stylePanel}, React.createElement("div", {className: classNames('arrow-link', {
                'vertical-middle': atypicalSearchVisible
            })}, responseDownloadButton, " ")), React.createElement("div", {className: 'tab-right-end arrow-tab'}, React.createElement("div", {className: 'arrow-link'}, " "))), React.createElement(TabContentContainer, {renderedOn: this.state.renderedOn, tabContents: this.getTabData(validationResponseAllocationButtonValidationParam)}))));
        }
    };
    /**
     * Unsubscribe events
     */
    WorkListContainer.prototype.componentWillUnmount = function () {
        worklistStore.instance.removeListener(worklistStore.WorkListStore.MARKING_CHECK_WORKLIST_ACCESS_STATUS_UPDATED, this.updateMarkCheckWorklistAccessMessage);
        examinerStore.instance.removeListener(examinerStore.ExaminerStore.MARKER_INFO_UPDATED_EVENT, this.updateMarkerInformationPanel);
        messageStore.instance.removeListener(messageStore.MessageStore.MESSAGE_NAVIGATION_EVENT, this.onNavigatetoResponse);
        qigStore.instance.removeListener(qigStore.QigStore.QIG_SELECTED_EVENT, this.resetSortAttributes);
        worklistStore.instance.removeListener(worklistStore.WorkListStore.WORKLIST_FILTER_CHANGED, this.onWorklistFilterChanged);
        worklistStore.instance.removeListener(worklistStore.WorkListStore.MARK_CHECK_EXAMINERS_DATA_RETRIVED, this.reRender);
        responseStore.instance.removeListener(responseStore.ResponseStore.RESPONSE_ALLOCATED_EVENT, this.onResponseAllocated);
    };
    /**
     * Comparing the props to check the updats are made by self
     * @param {Props} nextProps
     */
    WorkListContainer.prototype.componentWillReceiveProps = function (nextProps) {
        if (this.props.worklistType !== nextProps.worklistType || this.props.responseMode !== nextProps.responseMode
            || this.props.remarkRequestType !== nextProps.remarkRequestType) {
            this.resetSortAttributes();
        }
        if (markerOperationModeFactory.operationMode.isTeamManagementMode ||
            this.props.isMarkingCheckMode) {
            this.setState({
                isTileView: false
            });
        }
        else {
            this.setState({
                isTileView: userOptionsHelper.getUserOptionByName(userOptionKeys.SELECTED_GRID_TYPE) === 'true' ? true : false
            });
        }
    };
    /**
     * Marking check Complete button details
     */
    WorkListContainer.prototype.markingCheckCompleteButton = function () {
        if (!this.props.isRefreshing && this.props.isMarkingCheckMode) {
            return (React.createElement("button", {className: 'primary rounded large download-rsp-btn split-btn popup-nav', id: 'marking_check_Complete_button_id', key: 'marking_check_Complete_button_key', onClick: this.OnMarkCheckCompleteCLick, disabled: false}, localeStore.instance.TranslateText('marking.worklist.perform-marking-check.set-marking-as-checked-button')));
        }
        else {
            return null;
        }
    };
    /**
     * Show/Hide allocate new response button
     * @param validationResponseAllocationButtonParam
     */
    WorkListContainer.prototype.showHideAllocateNewResponseButton = function (validationResponseAllocationButtonParam) {
        if ((this.props.worklistType === enums.WorklistType.live || this.props.worklistType === enums.WorklistType.pooledRemark
            || this.props.worklistType === enums.WorklistType.simulation)
            && this.props.selectedTab === enums.ResponseMode.open
            && this.props.responseMode === enums.ResponseMode.open
            && !this.props.isRefreshing
            && !this.props.isMarkingCheckMode) {
            this.getNewResponseButton = validationResponseAllocationButtonParam.IsResponseAllocateButtonVisible ?
                (React.createElement(AllocateResponseButton, {id: 'getNewResponseButton', key: 'getNewResponseButton', selectedLanguage: this.props.selectedLanguage, title: validationResponseAllocationButtonParam.ResponseAllocationButtonTitle, isEnabled: validationResponseAllocationButtonParam.IsResponseAllocateButtonEnabled, worklistType: this.props.worklistType, buttonMainText: validationResponseAllocationButtonParam.ResponseAllocationButtonMainText, buttonSubText: validationResponseAllocationButtonParam.ResponseAllocationButtonSubText, buttonSingleResponseText: validationResponseAllocationButtonParam.
                    ResponseAllocationButtonSingleResponseText, buttonUpToOpenResponseLimitText: validationResponseAllocationButtonParam.
                    ResponseAllocationButtonUpToOpenResponseText, isWholeResponseButtonAvailable: validationResponseAllocationButtonParam.
                    IsWholeResponseResponseAllocationButtonAvailable && !this.isErrorOccuredInWholeResponseAllocation})) : null;
        }
        else {
            this.getNewResponseButton = undefined;
        }
    };
    /**
     * When the markcheck Complete button is clicked
     */
    WorkListContainer.prototype.OnMarkCheckCompleteCLick = function () {
        worklistActionCreator.markingCheckComplete();
    };
    /**
     * This will returns the tab contents
     * @param validationResponseAllocationButtonValidationParam
     */
    WorkListContainer.prototype.getTabData = function (validationResponseAllocationButtonValidationParam) {
        var tabContents = [];
        var tabToBeSelected = markerOperationModeFactory.operationMode.tabToBeSelected(this.props.selectedTab);
        tabContents.push({
            index: enums.ResponseMode.open,
            class: 'tab-content resp-open',
            isSelected: tabToBeSelected === enums.ResponseMode.open,
            id: 'responseTab_Open',
            content: this.showOpenGridContent(validationResponseAllocationButtonValidationParam)
        });
        if (this.isGraceTabVisible) {
            tabContents.push({
                index: enums.ResponseMode.pending,
                class: 'wrapper tab-content resp-grace',
                isSelected: tabToBeSelected === enums.ResponseMode.pending,
                id: 'responseTab_Pending',
                content: this.showPendingGridContent()
            });
        }
        tabContents.push({
            index: enums.ResponseMode.closed,
            class: 'wrapper tab-content resp-closed',
            isSelected: tabToBeSelected === enums.ResponseMode.closed,
            id: 'responseTab_Closed',
            content: this.showClosedGridContent()
        });
        return tabContents;
    };
    /**
     * Resets the comparer and sort order
     */
    WorkListContainer.prototype.resetSortAttributes = function () {
        this.comparerName = undefined;
        this.sortDirection = undefined;
    };
    /**
     * This method will update the selected tab.
     * @param selectedTabIndex
     */
    WorkListContainer.prototype.selectTab = function (selectedTabIndex) {
        if (!applicationStore.instance.isOnline) {
            applicationActionCreator.checkActionInterrupted();
        }
        else {
            if (selectedTabIndex !== this.props.selectedTab) {
                this.props.switchTab(selectedTabIndex);
                this.setState({
                    isTileView: this.state.isTileView
                });
                this.getWorklistDataOnTabSwitch(selectedTabIndex);
            }
        }
    };
    /**
     * Get worklist data on tab switch
     * @param selectedTabIndex
     */
    WorkListContainer.prototype.getWorklistDataOnTabSwitch = function (selectedTabIndex) {
        var examinerRoleID = qigStore.instance.selectedQIGForMarkerOperation.examinerRoleId;
        var worklistType = this.props.worklistType;
        var remarkRequestType = this.props.remarkRequestType;
        var isDirectedRemark = this.props.isDirectedRemark;
        if (this.props.isMarkingCheckMode) {
            examinerRoleID = worklistStore.instance.selectedMarkingCheckExaminer.examinerRoleID;
            worklistType = enums.WorklistType.live;
            remarkRequestType = enums.RemarkRequestType.Unknown;
            isDirectedRemark = false;
        }
        worklistActionCreator.notifyWorklistTypeChange(qigStore.instance.selectedQIGForMarkerOperation.markSchemeGroupId, examinerRoleID, qigStore.instance.selectedQIGForMarkerOperation.questionPaperPartId, worklistType, selectedTabIndex, remarkRequestType, isDirectedRemark, qigStore.instance.selectedQIGForMarkerOperation.isElectronicStandardisationTeamMember, false, this.props.isMarkingCheckMode);
    };
    /**
     * Set the corresponding worklist data
     */
    WorkListContainer.prototype.setWorklistData = function () {
        var worklistDetails = this.props.isRefreshing ? undefined :
            worklistStore.instance.getWorklistDetails(this.props.worklistType, this.props.responseMode);
        switch (this.props.responseMode) {
            case enums.ResponseMode.open:
                this.gridStyle = 'data-grid work-list-grid padding-top-15';
                /** if the view is being refreshed on tab switch, clear the collection so that the view shows a loading indicator */
                this.openWorklist = worklistDetails;
                break;
            case enums.ResponseMode.closed:
                this.gridStyle = 'data-grid work-list-grid padding-top-15';
                this.closedWorklist = worklistDetails;
                break;
            case enums.ResponseMode.pending:
                this.gridStyle = 'data-grid work-list-grid';
                this.pendingWorklist = worklistDetails;
                break;
            default:
                break;
        }
    };
    /**
     * switch content in grid container according to response mode.
     * @param responseMode
     */
    WorkListContainer.prototype.switchWorklistResponseMode = function (worklist) {
        var gridTypeSelected;
        gridTypeSelected = enums.GridType.tiled;
        /* On switching grid view the style is updating twice for the animation to work.
         * This checking will avoid duplicate calls on switching the grid view.  */
        if (!this.state.isGridviewChanged) {
            /* this will check which view(tiled/detailed) should be rendered */
            if (this.state.isTileView) {
                gridTypeSelected = enums.GridType.tiled;
            }
            else {
                gridTypeSelected = enums.GridType.detailed;
            }
        }
        //Sets the local variables with row data collection
        this.setRowDefinitionCollections(gridTypeSelected, worklist);
        var result;
        var grid;
        var gridTopArea;
        var hasResponsesInWorklist = worklist.responses.count() > 0;
        if (hasResponsesInWorklist || this.state.isGridviewChanged) {
            grid = this.getWorklistComponent(this.props.worklistType);
        }
        // This section is not requred if filter is displayed
        if (hasResponsesInWorklist && !markerOperationModeFactory.operationMode.isWorklistFilterShouldbeVisible
            && !markerOperationModeFactory.operationMode.isTeamManagementMode) {
            gridTopArea = this.gridTopArea;
        }
        result = (React.createElement("div", {className: classNames({
            'grid-holder tile-view': this.state.isGridviewChanged ? false : this.state.isTileView ? true : false,
            'grid-holder grid-view': this.state.isGridviewChanged ? false : !this.state.isTileView ? true : false,
            'grid-holder': this.state.isGridviewChanged
        })}, React.createElement(PendingWorklistBanner, {id: 'pendingworklistbannermessage', key: 'pendingworklistbanner', selectedLanguage: this.props.selectedLanguage, isVisible: markerOperationModeFactory.operationMode.shouldDisplayPendingWorklistBanner}), React.createElement(WorklistFilter, {id: 'worklistFilter', key: 'worklistFilter', isVisible: markerOperationModeFactory.operationMode.isWorklistFilterShouldbeVisible, selectedFilter: this.state.selectedFilterType, onFilterChanged: this.onWorklistFilterSelected, markSchemeGroupId: qigStore.instance.selectedQIGForMarkerOperation.markSchemeGroupId}), gridTopArea, grid));
        return result;
    };
    Object.defineProperty(WorkListContainer.prototype, "gridTopArea", {
        /**
         * Get the top Area in the worklist
         */
        get: function () {
            return (React.createElement("div", {className: 'col-wrap grid-nav padding-bottom-15'}, React.createElement("div", {className: 'col-3-of-12'}, (this.isSubmittButtonVisible()) ?
                (React.createElement(SubmitResponse, {id: this.props.id, key: 'key_' + this.props.id, isDisabled: this.isSubmitDisabled, selectedLanguage: this.props.selectedLanguage, isSubmitAll: true})) :
                '\u00a0'), React.createElement("div", {className: 'col-9-of-12'}, this.getGridToggleButtons())));
        },
        enumerable: true,
        configurable: true
    });
    /**
     *  This method will returns the grid toggle buttons if the current marker operation mode is marking.
     */
    WorkListContainer.prototype.getGridToggleButtons = function () {
        if (!(this.props.isTeamManagementMode || this.props.isMarkingCheckMode)) {
            return (React.createElement("div", {className: 'shift-right'}, React.createElement("ul", {className: 'filter-menu'}, React.createElement("li", {className: 'switch-view-btn'}, React.createElement(GridToggleButton, {key: 'gridtogglebuttonTile_key_' + this.props.id, id: 'gridtogglebuttonTile_' + this.props.id, toggleGridView: this.toggleGridView, isSelected: this.state.isTileView, buttonType: enums.GridType.tiled, selectedLanguage: this.props.selectedLanguage}), React.createElement(GridToggleButton, {key: 'gridtogglebuttonDetail_key_' + this.props.id, id: 'gridtogglebuttonDetail_' + this.props.id, toggleGridView: this.toggleGridView, isSelected: !this.state.isTileView, buttonType: enums.GridType.detailed, selectedLanguage: this.props.selectedLanguage})))));
        }
    };
    /**
     * Show live closed response list grid
     */
    WorkListContainer.prototype.showClosedGridContent = function () {
        var result;
        if (this.props.responseMode === enums.ResponseMode.closed) {
            /** if live closed response list is filled show grid content */
            if (this.closedWorklist) {
                result = this.switchWorklistResponseMode(this.closedWorklist);
            }
            else {
                result = this.props.isRefreshing ? this.loading : undefined;
            }
            return result;
        }
    };
    /**
     * Show live closed response list grid
     */
    WorkListContainer.prototype.showPendingGridContent = function () {
        var result;
        if (this.props.responseMode === enums.ResponseMode.pending) {
            /** if live pending response list is filled show grid content */
            if (this.pendingWorklist && this.pendingWorklist.responses.count() > 0) {
                result = this.switchWorklistResponseMode(this.pendingWorklist);
            }
            else {
                result = this.props.isRefreshing ? this.loading : undefined;
            }
            return result;
        }
    };
    /**
     * Show live open response list grid
     */
    WorkListContainer.prototype.showOpenGridContent = function (validationResponseAllocationButtonParam) {
        var result;
        var examinerQigStatus = targetHelper.getExaminerQigStatus();
        var currentTarget = targetSummaryStore.instance.getCurrentTarget();
        if (this.openWorklist && this.props.responseMode === enums.ResponseMode.open) {
            /** if live open response is filled show grid content */
            if (this.props.worklistType === enums.WorklistType.live ?
                (this.openWorklist.concurrentLimit <= currentTarget.examinerProgress.atypicalOpenResponsesCount
                    || this.openWorklist.responses.count() > 0)
                : this.openWorklist.responses.count() > 0) {
                result = this.switchWorklistResponseMode(this.openWorklist);
            }
            else if (markerOperationModeFactory.operationMode.shouldDisplayHelperMessage) {
                if ((this.props.worklistType === enums.WorklistType.live) &&
                    (examinerQigStatus === enums.ExaminerQIGStatus.LiveComplete
                        || examinerQigStatus === enums.ExaminerQIGStatus.OverAllTargetCompleted)) {
                    // Target reached worklist messages
                    result = React.createElement(WorkListMessage, {id: 'workListMessage', key: 'workListMessage', selectedLanguage: this.props.selectedLanguage, hasTargetCompleted: true, hasResponsesAvailableInPool: false});
                }
                else if ((this.props.worklistType === enums.WorklistType.live) && this.openWorklist.unallocatedResponsesCount > 0
                    && validationResponseAllocationButtonParam.IsWorklistInformationBannerVisible) {
                    // live worklist messages
                    result = React.createElement(WorkListMessage, {id: 'workListMessage', key: 'workListMessage', selectedLanguage: this.props.selectedLanguage, hasResponsesAvailableInPool: true, responseConcurrentLimit: this.openWorklist.concurrentLimit
                        - currentTarget.examinerProgress.atypicalOpenResponsesCount});
                }
                else if ((this.props.worklistType === enums.WorklistType.live) &&
                    validationResponseAllocationButtonParam.IsWorklistInformationBannerVisible) {
                    // live worklist messages
                    result = React.createElement(WorkListMessage, {id: 'workListMessage', key: 'workListMessage', selectedLanguage: this.props.selectedLanguage, hasResponsesAvailableInPool: false});
                }
                else if (this.props.worklistType === enums.WorklistType.standardisation ||
                    this.props.worklistType === enums.WorklistType.secondstandardisation) {
                    // standardisation worklist awaiting approval message
                    result = React.createElement(StandardisationWorklistMessage, {id: this.props.id, key: 'key_' + this.props.id, selectedLanguage: this.props.selectedLanguage});
                }
                else if (this.props.worklistType === enums.WorklistType.simulation &&
                    validationResponseAllocationButtonParam.IsWorklistInformationBannerVisible) {
                    var showResponseAvailableHelperMessage = (this.openWorklist.unallocatedResponsesCount > 0 && this.openWorklist.responses.count() === 0);
                    result = React.createElement(WorkListMessage, {id: 'workListMessage', key: 'workListMessage', selectedLanguage: this.props.selectedLanguage, hasResponsesAvailableInPool: showResponseAvailableHelperMessage, isSimulation: true});
                }
                else {
                    result = null;
                }
            }
        }
        else {
            result = this.props.isRefreshing ? this.loading : undefined;
        }
        return result;
    };
    /**
     * This method will call parent component function to toggle left panel
     */
    WorkListContainer.prototype.toggleLeftPanel = function () {
        this.props.toggleLeftPanel();
    };
    /**
     * Generating Grid Rows
     */
    WorkListContainer.prototype.getGridRows = function (liveOpenResponseList, worklistType, responseType, gridType, comparerName, sortDirection) {
        return this.worklistHelper.generateRowDefinion(liveOpenResponseList, responseType, gridType);
    };
    /**
     * Generating Grid Rows
     */
    WorkListContainer.prototype.getGridColumnHeaderRows = function (worklistType, responseType, comparerName, sortDirection) {
        return this.worklistHelper.generateTableHeader(responseType, worklistType, comparerName, sortDirection);
    };
    /**
     * Generating Grid Rows
     */
    WorkListContainer.prototype.getFrozenTableBodyRows = function (responseList, worklistType, responseType, comparerName, sortDirection) {
        return this.worklistHelper.generateFrozenRowBody(responseList, responseType, worklistType);
    };
    /**
     * Generating Grid Rows
     */
    WorkListContainer.prototype.getFrozenTableHeaderRow = function (responseList, worklistType, responseType, comparerName, sortDirection) {
        return this.worklistHelper.generateFrozenRowHeader(responseList, responseType, worklistType, comparerName, sortDirection);
    };
    /**
     * Handle animation of grid view toggle on componentDidUpdate
     */
    WorkListContainer.prototype.componentDidUpdate = function () {
        this.triggerAnimation();
        var buttonHolder = htmlUtilities.getElementsByClassName('response-button-holder');
        var rightSpacer = htmlUtilities.getElementsByClassName('right-spacer');
        if (buttonHolder.length > 0 && rightSpacer.length > 0) {
            if (buttonHolder.length > 0) {
                rightSpacer[0].style.paddingLeft = buttonHolder[0].clientWidth + 'px';
            }
            else {
                rightSpacer[0].style.paddingLeft = '';
            }
        }
    };
    /**
     * Handle animation of grid view toggle on componentDidMount
     */
    WorkListContainer.prototype.componentDidMount = function () {
        examinerStore.instance.addListener(examinerStore.ExaminerStore.MARKER_INFO_UPDATED_EVENT, this.updateMarkerInformationPanel);
        messageStore.instance.addListener(messageStore.MessageStore.MESSAGE_NAVIGATION_EVENT, this.onNavigatetoResponse);
        qigStore.instance.addListener(qigStore.QigStore.QIG_SELECTED_EVENT, this.resetSortAttributes);
        this.triggerAnimation();
        worklistStore.instance.addListener(worklistStore.WorkListStore.MARKING_CHECK_WORKLIST_ACCESS_STATUS_UPDATED, this.updateMarkCheckWorklistAccessMessage);
        worklistStore.instance.addListener(worklistStore.WorkListStore.WORKLIST_FILTER_CHANGED, this.onWorklistFilterChanged);
        worklistStore.instance.addListener(worklistStore.WorkListStore.MARK_CHECK_EXAMINERS_DATA_RETRIVED, this.reRender);
        responseStore.instance.addListener(responseStore.ResponseStore.RESPONSE_ALLOCATED_EVENT, this.onResponseAllocated);
    };
    /**
     * this will trigger the animation on grid view toggle.
     */
    WorkListContainer.prototype.triggerAnimation = function () {
        if (this.state.isGridviewChanged) {
            var that_1 = this;
            /* setTimeout is used with delay 0 to work animation in Firefox and Chrome */
            setTimeout(function () {
                that_1.setState({
                    isTileView: that_1.state.isTileView,
                    isGridviewChanged: false
                });
                worklistActionCreator.setScrollWorklistColumns();
            }, 0);
        }
    };
    /**
     * this will change the grid view (tile/detail).
     */
    WorkListContainer.prototype.toggleGridView = function () {
        var isTileViewSelected = !this.state.isTileView;
        /* Saving the selected grid view in user options */
        userOptionsHelper.save(userOptionKeys.SELECTED_GRID_TYPE, String(isTileViewSelected), true);
        this.setState({
            isTileView: isTileViewSelected,
            isGridviewChanged: true
        });
    };
    /**
     * returns whether the submitt all response button is visible or not.
     */
    WorkListContainer.prototype.isSubmittButtonVisible = function () {
        // we don't need to display the submit button when the marker operation mode is TeamManagement or marking check
        if (this.props.isTeamManagementMode || this.props.isMarkingCheckMode) {
            return false;
        }
        else {
            /* For an ecoursework component we have consider both allfilesviewed and submitenabled statuses
               for showing submit button in open response */
            var isSubmitEnabled = false;
            if (this.props.responseMode === enums.ResponseMode.open) {
                if (eCourseworkHelper.isECourseworkComponent) {
                    isSubmitEnabled = this.openWorklist.responses.
                        filter(function (x) { return x.isSubmitEnabled === true
                        && x.allFilesViewed === true; }).count() > 0;
                }
                else {
                    isSubmitEnabled = this.openWorklist.responses.
                        filter(function (x) { return x.isSubmitEnabled === true; }).count() > 0;
                }
            }
            if (!qigStore.instance.isAtypicalAvailable && this.props.responseMode === enums.ResponseMode.open
                && this.props.worklistType === enums.WorklistType.atypical) {
                isSubmitEnabled = false;
            }
            return isSubmitEnabled;
        }
    };
    /**
     *  Get grid rows and associated table rows ans ets associated local variables
     */
    WorkListContainer.prototype.setRowDefinitionCollections = function (gridTypeSelected, worklist) {
        this.worklistHelper = worklistFactory.getWorklistHelper(this.props.worklistType);
        if (!this.comparerName) {
            this.setDefaultComparer();
        }
        if (this.isSortRequired() === true) {
            // if the direction is descending the text 'Desc' is appending to the comparer name since all
            // descending comparere has the same name followed by text 'Desc'
            var _comparerName = (this.sortDirection === enums.SortDirection.Ascending) ? this.comparerName : this.comparerName + 'Desc';
            worklist.responses = Immutable.List(sortHelper.sort(worklist.responses.toArray(), comparerList[_comparerName]));
        }
        // the below order of fecthing the grid data should be maintained.
        this._gridRows = this.getGridRows(worklist, this.props.worklistType, this.props.responseMode, gridTypeSelected, this.comparerName, this.sortDirection);
        this._gridColumnHeaderRows = this.getGridColumnHeaderRows(this.props.worklistType, this.props.responseMode, this.comparerName, this.sortDirection);
        this._gridFrozenBodyRows = this.getFrozenTableBodyRows(worklist, this.props.worklistType, this.props.responseMode, this.comparerName, this.sortDirection);
        this._gridFrozenHeaderRows = this.getFrozenTableHeaderRow(worklist, this.props.worklistType, this.props.responseMode, this.comparerName, this.sortDirection);
    };
    /**
     * Set the comparer for the current worklist based on the worklisttype,qigId and responseMode
     */
    WorkListContainer.prototype.setDefaultComparer = function () {
        var _this = this;
        var defaultComparers = worklistStore.instance.responseSortDetails;
        var qigId = qigStore.instance.selectedQIGForMarkerOperation.markSchemeGroupId;
        var worklistType = this.props.worklistType;
        var responseMode = this.props.responseMode;
        var entry = defaultComparers.filter(function (x) {
            return x.worklistType === worklistType && x.responseMode === responseMode
                && x.qig === qigId && x.remarkRequestType === _this.props.remarkRequestType;
        });
        if (entry.length > 0) {
            this.comparerName = comparerList[entry[0].comparerName];
            this.sortDirection = entry[0].sortDirection;
        }
    };
    /**
     * Set the loading indicator
     */
    WorkListContainer.prototype.setLoadingindicator = function () {
        if (this.props.hasTargetFound) {
            this.loading = React.createElement(LoadingIndicator, {id: 'loading', key: 'loading', selectedLanguage: localeStore.instance.Locale, isOnline: applicationStore.instance.isOnline, cssClass: 'section-loader loading'});
        }
        else {
            this.loading = null;
        }
    };
    /**
     * Method called when the user confirms navigation from message panel
     */
    WorkListContainer.prototype.onNavigatetoResponse = function (messageNavigationArguments) {
        if (messageNavigationArguments.canNavigate && messageNavigationArguments.navigateTo === enums.MessageNavigation.toResponse) {
            var openedResponseDetails = worklistStore.instance.getResponseDetails(messageNavigationArguments.responseId.toString());
            responseHelper.openResponse(messageNavigationArguments.responseId, enums.ResponseNavigation.specific, worklistStore.instance.getResponseMode, openedResponseDetails.markGroupId, enums.ResponseViewMode.zoneView, messageNavigationArguments.triggerPoint);
            // Ideally marking mode should be read from the opened response,
            // since multiple marking modes won't come in the same worklist now this will work.
            var selectedMarkingMode = worklistStore.instance.getMarkingModeByWorkListType(worklistStore.instance.currentWorklistType);
            markSchemeHelper.getMarks(messageNavigationArguments.responseId, selectedMarkingMode);
            eCourseworkHelper.fetchECourseWorkCandidateScriptMetadata(messageNavigationArguments.responseId);
        }
        else if (messageNavigationArguments.canNavigate && messageNavigationArguments.navigateTo === enums.SaveAndNavigate.toMenu) {
            userInfoActionCreator.changeMenuVisibility();
        }
        else if (messageNavigationArguments.canNavigate &&
            messageNavigationArguments.navigateTo === enums.SaveAndNavigate.toMarkingCheckWorklist) {
            markingCheckActionCreator.getMarkCheckExaminers(qigStore.instance.selectedQIGForMarkerOperation.markSchemeGroupId);
        }
    };
    /**
     * Call back function from table wrapper on sorting
     */
    WorkListContainer.prototype.onSortClick = function (comparerName, sortDirection) {
        if (this.isSortRequired() === true) {
            this.comparerName = comparerName;
            this.sortDirection = sortDirection;
            var sortDetails = {
                worklistType: this.props.worklistType,
                responseMode: this.props.responseMode,
                qig: qigStore.instance.selectedQIGForMarkerOperation.markSchemeGroupId,
                comparerName: comparerList[this.comparerName],
                sortDirection: this.sortDirection,
                remarkRequestType: this.props.remarkRequestType
            };
            /* update the current sort order */
            worklistActionCreator.onSortedClick(sortDetails);
            // value is to prevent to set the min width of the grid columns
            this.doSetMinWidth = false;
            this.setState({ renderedOn: Date.now() });
        }
    };
    return WorkListContainer;
}(pureRenderComponent));
module.exports = WorkListContainer;
//# sourceMappingURL=worklistcontainer.js.map