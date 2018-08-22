/* tslint:disable:no-unused-variable */
import React = require('react');
/* tslint:enable:no-unused-variable */
import pureRenderComponent = require('../base/purerendercomponent');
import WorkListMessage = require('./shared/worklistmessage');
import AllocateResponseButton = require('./shared/allocateresponsebutton');
import GridControl = require('../utility/grid/gridcontrol');
import workListHelperBase = require('../utility/grid/worklisthelpers/worklisthelperbase');
//import liveWorkListHelper = require('../../utility/grid/worklisthelpers/liveworklisthelper');
import enums = require('../utility/enums');
import GridToggleButton = require('./shared/gridtogglebutton');
import TabControl = require('../utility/tab/tabcontrol');
import TabContentContainer = require('../utility/tab/tabcontentcontainer');
let classNames = require('classnames');
import userOptionsHelper = require('../../utility/useroption/useroptionshelper');
import userOptionKeys = require('../../utility/useroption/useroptionkeys');
import targetSummaryStore = require('../../stores/worklist/targetsummarystore');
import markingTargetSummary = require('../../stores/worklist/typings/markingtargetsummary');
import localeStore = require('../../stores/locale/localestore');
import qigStore = require('../../stores/qigselector/qigstore');
import worklistStore = require('../../stores/worklist/workliststore');
import responseStore = require('../../stores/response/responsestore');
import responseAllocationButtonValidationHelper = require('../utility/responseallocation/responseallocationbuttonvalidationhelper');
import responseAllocationButtonValidationParameter =
require('../utility/responseallocation/responseallocationbuttonvalidationparameter');
import worklistActionCreator = require('../../actions/worklist/worklistactioncreator');
import openResponseActionCreator = require('../../actions/response/responseactioncreator');
import SubmitResponse = require('./shared/submitresponse');
import userOptionsActionCreator = require('../../actions/useroption/useroptionactioncreator');
import tabHelper = require('../utility/tab/tabhelper');
import targetHelper = require('../../utility/target/targethelper');
import markingStore = require('../../stores/marking/markingstore');
import markSchemeHelper = require('../../utility/markscheme/markschemehelper');
import examinerStore = require('../../stores/markerinformation/examinerstore');
import qualityFeedbackHelper = require('../../utility/qualityfeedback/qualityfeedbackhelper');
import worklistFactory = require('../../utility/worklist/worklistfactory');
import StandardisationWorklistMessage = require('./shared/standardisationworklistmessage');
import WorklistTableWrapper = require('./worklisttablewrapper');
import worklistHelper = require('../../utility/worklist/worklisthelper');
import LoadingIndicator = require('../utility/loadingindicator/loadingindicator');
import messageStore = require('../../stores/message/messagestore');
import messagingActionCreator = require('../../actions/messaging/messagingactioncreator');
import applicationStore = require('../../stores/applicationoffline/applicationstore');
import sortHelper = require('../../utility/sorting/sorthelper');
import comparerList = require('../../utility/sorting/sortbase/comparerlist');
import Immutable = require('immutable');
import AtypicalSearchBar = require('./atypicalsearchbar');
import responsesortdetails = require('../utility/grid/responsesortdetails');
import userInfoActionCreator = require('../../actions/userinfo/userinfoactioncreator');
import responseHelper = require('../utility/responsehelper/responsehelper');
import markerOperationModeFactory = require('../utility/markeroperationmode/markeroperationmodefactory');
import MarkingCheckIndicator = require('./markingcheckindicator');
import WorklistFilter = require('./worklistfilter');
import stringFormatHelper = require('../../utility/stringformat/stringformathelper');
import teamManagementStore = require('../../stores/teammanagement/teammanagementstore');
import htmlUtilities = require('../../utility/generic/htmlutilities');
import markingCheckActionCreator = require('../../actions/markingcheck/markingcheckactioncreator');
import eCourseworkHelper = require('../utility/ecoursework/ecourseworkhelper');
import PendingWorklistBanner = require('./shared/pendingworklistbanner');
import constants = require('../utility/constants');
import stringHelper = require('../../utility/generic/stringhelper');
import applicationActionCreator = require('../../actions/applicationoffline/applicationactioncreator');
import configurableCharacteristicsNames = require('../../utility/configurablecharacteristic/configurablecharacteristicsnames');
import configurableCharacteristicsHelper = require('../../utility/configurablecharacteristic/configurablecharacteristicshelper');
/**
 * State of LiveWorkList component
 */
interface State {
    renderedOn?: number;
    /* Currently selected view of grid */
    isTileView?: boolean;
    /* This flag is used indicate that the view is changed, to support animation */
    isGridviewChanged?: boolean;

    isMarkingCheckWorklistAccessPresent?: boolean;
    selectedFilterType?: enums.WorklistSeedFilter;
}

/**
 * Properties of a component
 */
interface Props extends LocaleSelectionBase, PropsBase {
    /** which response mode the worklist is opened */
    responseMode: enums.ResponseMode;
    toggleLeftPanel: Function;
    switchTab: Function;
    /** The current worklist type */
    worklistType: enums.WorklistType;
    worklistTabDetails: Array<WorklistTabDetails>;
    selectedTab?: number;
    remarkRequestType: enums.RemarkRequestType;
    isDirectedRemark: boolean;
    /** flag to show busy indicator in worklist tabs */
    isRefreshing: boolean;
    isTeamManagementMode: boolean;
    isMarkingCheckMode: boolean;
    hasTargetFound: boolean;
}

/**
 * React component for live worklist
 */
class WorkListContainer extends pureRenderComponent<Props, State> {
    private _gridRows: Immutable.List<Row>;
    private _gridColumnHeaderRows: Immutable.List<Row>;
    private _gridFrozenBodyRows: Immutable.List<Row>;
    private _gridFrozenHeaderRows: Immutable.List<Row>;
    private markingTargetsSummary: Immutable.List<markingTargetSummary>;
    private isGraceTabVisible: boolean = true;
    private openWorklist: any;
    private closedWorklist: any;
    private pendingWorklist: any;
    private gridStyle: string = '';
    private isAtypicalCenterNumber: boolean = false;
    private isAtypicalCandidateNumber: boolean = false;
    private getNewResponseButton: JSX.Element;
    private isSubmitDisabled: boolean = false;
    private worklistHelper: worklistHelper;
    private loading: JSX.Element;
    private messageNavigationArguments: MessageNavigationArguments;

    private comparerName: string;
    private sortDirection: enums.SortDirection;

    private isErrorOccuredInWholeResponseAllocation: boolean = false;
    private doSetMinWidth: boolean = true;

    /**
     * @constructor
     */
    constructor(props: Props, state: State) {
        super(props, state);
        this.setLoadingindicator();

        /* getting user preference for the grid view */
        this.state = {
            isTileView: this.props.isTeamManagementMode || this.props.isMarkingCheckMode ? false :
                userOptionsHelper.getUserOptionByName(userOptionKeys.SELECTED_GRID_TYPE) === 'true' ? true : false,
            isGridviewChanged: false,
            isMarkingCheckWorklistAccessPresent: false,
            selectedFilterType: worklistStore.instance.getSelectedFilterDetails.get(
                teamManagementStore.instance.examinerDrillDownData ?
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
    public render() {
        this.setLoadingindicator();
        /* if there are no match and the data has not been loaded, show busy indicator */
        if (this.props.worklistType === undefined || this.props.worklistType === enums.WorklistType.none) {
            return this.loading;
        } else {
            this.worklistHelper = worklistFactory.getWorklistHelper(this.props.worklistType);
            this.setWorklistData();
            let validationResponseAllocationButtonValidationParam: responseAllocationButtonValidationParameter =
                responseAllocationButtonValidationHelper.validate(this.openWorklist, targetHelper.getExaminerQigStatus(),
                    targetHelper.getExaminerApproval(), this.props.worklistType,
                    this.props.remarkRequestType,
                    this.props.isTeamManagementMode || this.props.isMarkingCheckMode);

            this.showHideAllocateNewResponseButton(validationResponseAllocationButtonValidationParam);
            this.isSubmitDisabled = markerOperationModeFactory.operationMode.isSubmitDisabled(this.props.worklistType);
            let currentTarget = targetSummaryStore.instance.getCurrentTarget();
            let atypicalSearchVisible: boolean = this.props.worklistType === enums.WorklistType.atypical
                && !this.props.isTeamManagementMode;

            let responseDownloadButton: JSX.Element = atypicalSearchVisible ?
                this.getAtypicalSearchBar() :
                (<div className='get-response-wrapper'>
                    {this.getNewResponseButton}
                    {this.markingCheckCompleteButton()}
                </div>);
            let stylePanel: React.CSSProperties = {
                minWidth: 0
            };
            let element = htmlUtilities.getElementsByClassName('get-response-wrapper');

            // Added for styling the worklist when there is no get new response button.
            if (this.getNewResponseButton === undefined) {
                stylePanel = { minWidth: 0 };
            } else if (element.length > 0 && this.props.responseMode === enums.ResponseMode.open) {
                let minwidth = element[0].clientWidth;
                stylePanel = { minWidth: minwidth };
            }

            return (
                <div className='column-right tab-holder horizontal response-tabs'>
                    <a href='javascript:void(0);'
                        className='toggle-left-panel' id={'togglePanel'}
                        title={this.props.isMarkingCheckMode ?
                            localeStore.instance.TranslateText('marking.worklist.perform-marking-check.show-hide-left-panel-tooltip') :
                            localeStore.instance.TranslateText('marking.worklist.left-panel.show-hide-panel-tooltip')}
                        onClick={this.toggleLeftPanel}>
                        <span className='sprite-icon panel-toggle-icon'>panel toggle</span>
                    </a>
                    <div className='wrapper'>
                        <MarkingCheckIndicator
                            id='marking_Check_Worklist_Access_Indicator'
                            key='marking_Check_Worklist_Access_Indicator'
                            isMarkingCheckAvailable={worklistStore.instance.isMarkingCheckWorklistAccessPresent}
                            isMarkCheckWorklist={this.props.isMarkingCheckMode} />
                        <div className=
                            {classNames('clearfix wl-page-header',
                                {
                                    'header-search ': atypicalSearchVisible,
                                    'tabs-2': (qigStore.instance.selectedQIGForMarkerOperation &&
                                        !qigStore.instance.selectedQIGForMarkerOperation.hasGracePeriod &&
                                        !(currentTarget.examinerProgress.atypicalPendingResponsesCount > 0) &&
                                        atypicalSearchVisible) ? true : false
                                })} >
                            {this.getWorklistHeader()}
                            <div className='tab-nav-holder'>
                                <TabControl
                                    tabHeaders={tabHelper.getTabHeaderData(this.props.worklistTabDetails, this.props.selectedTab)}
                                    selectTab={this.selectTab} />
                            </div>
                            <div className={classNames('response-button-holder arrow-tab ',
                                {
                                    'atypical-search ': atypicalSearchVisible
                                })} style={stylePanel} >
                                <div className={classNames('arrow-link',
                                    {
                                        'vertical-middle': atypicalSearchVisible
                                    })}>
                                    {responseDownloadButton} </div>
                            </div>
                            <div className='tab-right-end arrow-tab'>
                                <div className='arrow-link'> </div>
                            </div>
                        </div>
                        <TabContentContainer
                            renderedOn={this.state.renderedOn}
                            tabContents={this.getTabData(validationResponseAllocationButtonValidationParam)} />
                    </div>
                </div>
            );
        }
    }

    /**
     * Unsubscribe events
     */
    public componentWillUnmount() {
        worklistStore.instance.removeListener(worklistStore.WorkListStore.MARKING_CHECK_WORKLIST_ACCESS_STATUS_UPDATED,
            this.updateMarkCheckWorklistAccessMessage);
        examinerStore.instance.removeListener(examinerStore.ExaminerStore.MARKER_INFO_UPDATED_EVENT, this.updateMarkerInformationPanel);
        messageStore.instance.removeListener(messageStore.MessageStore.MESSAGE_NAVIGATION_EVENT, this.onNavigatetoResponse);
        qigStore.instance.removeListener(qigStore.QigStore.QIG_SELECTED_EVENT, this.resetSortAttributes);
        worklistStore.instance.removeListener(worklistStore.WorkListStore.WORKLIST_FILTER_CHANGED, this.onWorklistFilterChanged);
        worklistStore.instance.removeListener(worklistStore.WorkListStore.MARK_CHECK_EXAMINERS_DATA_RETRIVED, this.reRender);
        responseStore.instance.removeListener(responseStore.ResponseStore.RESPONSE_ALLOCATED_EVENT, this.onResponseAllocated);
    }

    /**
     * Comparing the props to check the updats are made by self
     * @param {Props} nextProps
     */
    public componentWillReceiveProps(nextProps: Props) {
        if (this.props.worklistType !== nextProps.worklistType || this.props.responseMode !== nextProps.responseMode
            || this.props.remarkRequestType !== nextProps.remarkRequestType) {
            this.resetSortAttributes();
        }
        if (markerOperationModeFactory.operationMode.isTeamManagementMode ||
            this.props.isMarkingCheckMode) {
            this.setState({
                isTileView: false
            });
        } else {
            this.setState({
                isTileView: userOptionsHelper.getUserOptionByName(userOptionKeys.SELECTED_GRID_TYPE) === 'true' ? true : false
            });
        }
    }

    /*
    * This function will pass to grid control as a callback function
    */
    private handleTileClick = (responseId: number) => {
        if (!applicationStore.instance.isOnline) {
            applicationActionCreator.checkActionInterrupted();
        } else {
            let isTileView: boolean = userOptionsHelper.getUserOptionByName(
                userOptionKeys.SELECTED_GRID_TYPE) === 'true' ? true : false;
            this.messageNavigationArguments = {
                responseId: responseId,
                canNavigate: true,
                navigateTo: enums.MessageNavigation.toResponse,
                navigationConfirmed: false,
                hasMessageContainsDirtyValue: undefined,
                triggerPoint: enums.TriggerPoint.None
            };
            if (isTileView) {
                if (!messageStore.instance.isMessagePanelActive) {
                    this.onNavigatetoResponse(this.messageNavigationArguments);
                } else {
                    //if message panel is active call the navigation actions
                    this.messageNavigationArguments.canNavigate = false;
                    this.messageNavigationArguments.navigationConfirmed = false;
                    messagingActionCreator.canMessageNavigate(this.messageNavigationArguments);
                }
            }
        }
    };

    /**
     * Marking check Complete button details
     */
    private markingCheckCompleteButton(): JSX.Element {
        if (!this.props.isRefreshing && this.props.isMarkingCheckMode) {
            return (<button className='primary rounded large download-rsp-btn split-btn popup-nav'
                id={'marking_check_Complete_button_id'}
                key={'marking_check_Complete_button_key'}
                onClick={this.OnMarkCheckCompleteCLick}
                disabled={false}>
                {localeStore.instance.TranslateText('marking.worklist.perform-marking-check.set-marking-as-checked-button')}
            </button>);
        } else {
            return null;
        }
    }

    /**
     * Show/Hide allocate new response button
     * @param validationResponseAllocationButtonParam
     */
    private showHideAllocateNewResponseButton(validationResponseAllocationButtonParam: responseAllocationButtonValidationParameter): void {
        if ((this.props.worklistType === enums.WorklistType.live || this.props.worklistType === enums.WorklistType.pooledRemark
            || this.props.worklistType === enums.WorklistType.simulation)
            && this.props.selectedTab === enums.ResponseMode.open
            && this.props.responseMode === enums.ResponseMode.open
            && !this.props.isRefreshing
            && !this.props.isMarkingCheckMode) {
            this.getNewResponseButton = validationResponseAllocationButtonParam.IsResponseAllocateButtonVisible ?
                (
                    <AllocateResponseButton id='getNewResponseButton'
                        key='getNewResponseButton'
                        selectedLanguage={this.props.selectedLanguage}
                        title={validationResponseAllocationButtonParam.ResponseAllocationButtonTitle}
                        isEnabled={validationResponseAllocationButtonParam.IsResponseAllocateButtonEnabled}
                        worklistType={this.props.worklistType}
                        buttonMainText={validationResponseAllocationButtonParam.ResponseAllocationButtonMainText}
                        buttonSubText={validationResponseAllocationButtonParam.ResponseAllocationButtonSubText}
                        buttonSingleResponseText={validationResponseAllocationButtonParam.
                            ResponseAllocationButtonSingleResponseText}
                        buttonUpToOpenResponseLimitText={validationResponseAllocationButtonParam.
                            ResponseAllocationButtonUpToOpenResponseText}
                        isWholeResponseButtonAvailable={validationResponseAllocationButtonParam.
                            IsWholeResponseResponseAllocationButtonAvailable && !this.isErrorOccuredInWholeResponseAllocation} />) : null;

        } else {
            this.getNewResponseButton = undefined;
        }
    }

    /**
     * When the markcheck Complete button is clicked
     */
    private OnMarkCheckCompleteCLick(): void {
        worklistActionCreator.markingCheckComplete();
    }

    /**
     * This will returns the tab contents
     * @param validationResponseAllocationButtonValidationParam
     */
    private getTabData(validationResponseAllocationButtonValidationParam: responseAllocationButtonValidationParameter): Array<any> {

        let tabContents: Array<any> = [];
        let tabToBeSelected: enums.ResponseMode = markerOperationModeFactory.operationMode.tabToBeSelected(this.props.selectedTab);

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
    }

    /**
     * Resets the comparer and sort order
     */
    private resetSortAttributes(): void {
        this.comparerName = undefined;
        this.sortDirection = undefined;
    }

    /**
     * This method will update the selected tab.
     * @param selectedTabIndex
     */
    private selectTab(selectedTabIndex: any) {
        if (!applicationStore.instance.isOnline) {
            applicationActionCreator.checkActionInterrupted();
        } else {
            if (selectedTabIndex !== this.props.selectedTab) {
                this.props.switchTab(selectedTabIndex);
                this.setState({
                    isTileView: this.state.isTileView
                });
                this.getWorklistDataOnTabSwitch(selectedTabIndex);
            }
        }
    }

    /**
     * Get worklist data on tab switch
     * @param selectedTabIndex
     */
    private getWorklistDataOnTabSwitch(selectedTabIndex: number) {
        let examinerRoleID: number = qigStore.instance.selectedQIGForMarkerOperation.examinerRoleId;
        let worklistType: number = this.props.worklistType;
        let remarkRequestType: enums.RemarkRequestType = this.props.remarkRequestType;
        let isDirectedRemark: boolean = this.props.isDirectedRemark;

        if (this.props.isMarkingCheckMode) {
            examinerRoleID = worklistStore.instance.selectedMarkingCheckExaminer.examinerRoleID;
            worklistType = enums.WorklistType.live;
            remarkRequestType = enums.RemarkRequestType.Unknown;
            isDirectedRemark = false;
        }

        let hasComplexOptionality = configurableCharacteristicsHelper.getCharacteristicValue(
            configurableCharacteristicsNames.ComplexOptionality,
            markingStore.instance.selectedQIGMarkSchemeGroupId).toLowerCase() === 'true' ? true : false;
        worklistActionCreator.notifyWorklistTypeChange(qigStore.instance.selectedQIGForMarkerOperation.markSchemeGroupId,
            examinerRoleID,
            qigStore.instance.selectedQIGForMarkerOperation.questionPaperPartId,
            worklistType,
            selectedTabIndex,
            remarkRequestType,
            isDirectedRemark,
            qigStore.instance.selectedQIGForMarkerOperation.isElectronicStandardisationTeamMember,
            false,
            this.props.isMarkingCheckMode,
            hasComplexOptionality);
    }

    /**
     * Set the corresponding worklist data
     */
    private setWorklistData() {
        let worklistDetails: WorklistBase = this.props.isRefreshing ? undefined :
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
    }

    /**
     * Get the grid control id
     */
    private getGridControlId = (): string => {

        let gridId: string = enums.WorklistType[this.props.worklistType] + '_'
            + enums.ResponseMode[this.props.responseMode] + '_grid_' + this.props.id;

        return gridId;
    };

    /**
     * switch content in grid container according to response mode.
     * @param responseMode
     */
    private switchWorklistResponseMode(worklist: WorklistBase): JSX.Element {
        let gridTypeSelected: enums.GridType;
        gridTypeSelected = enums.GridType.tiled;

        /* On switching grid view the style is updating twice for the animation to work.
         * This checking will avoid duplicate calls on switching the grid view.  */
        if (!this.state.isGridviewChanged) {
            /* this will check which view(tiled/detailed) should be rendered */
            if (this.state.isTileView) {
                gridTypeSelected = enums.GridType.tiled;
            } else {
                gridTypeSelected = enums.GridType.detailed;
            }
        }

        //Sets the local variables with row data collection
        this.setRowDefinitionCollections(gridTypeSelected, worklist);

        let result: JSX.Element;
        let grid: JSX.Element;
        let gridTopArea: JSX.Element;
        let hasResponsesInWorklist: boolean = worklist.responses.count() > 0;
        if (hasResponsesInWorklist || this.state.isGridviewChanged) {
            grid = this.getWorklistComponent(this.props.worklistType);
        }

        // This section is not requred if filter is displayed
        if (hasResponsesInWorklist && !markerOperationModeFactory.operationMode.isWorklistFilterShouldbeVisible
            && !markerOperationModeFactory.operationMode.isTeamManagementMode) {
            gridTopArea = this.gridTopArea;
        }

        result = (
            <div className={classNames(
                {
                    'grid-holder tile-view': this.state.isGridviewChanged ? false : this.state.isTileView ? true : false,
                    'grid-holder grid-view': this.state.isGridviewChanged ? false : !this.state.isTileView ? true : false,
                    'grid-holder': this.state.isGridviewChanged
                }
            )}
            >
                <PendingWorklistBanner
                    id='pendingworklistbannermessage'
                    key='pendingworklistbanner'
                    selectedLanguage={this.props.selectedLanguage}
                    isVisible={markerOperationModeFactory.operationMode.shouldDisplayPendingWorklistBanner} />
                <WorklistFilter
                    id='worklistFilter'
                    key='worklistFilter'
                    isVisible={markerOperationModeFactory.operationMode.isWorklistFilterShouldbeVisible}
                    selectedFilter={this.state.selectedFilterType}
                    onFilterChanged={this.onWorklistFilterSelected}
                    markSchemeGroupId={qigStore.instance.selectedQIGForMarkerOperation.markSchemeGroupId} />
                {gridTopArea}
                {grid}
            </div>
        );

        return result;
    }

    /**
     * Get the top Area in the worklist
     */
    private get gridTopArea() {
        return (
            <div className='col-wrap grid-nav padding-bottom-15'>
                <div className='col-3-of-12'>
                    {
                        /** \u00a0 is the unicode for &nbsp */
                        /* if response mode is open and if there are any responses to submit, the show submit all button */
                    }
                    {(this.isSubmittButtonVisible()) ?
                        (<SubmitResponse
                            id={this.props.id}
                            key={'key_' + this.props.id}
                            isDisabled={this.isSubmitDisabled}
                            selectedLanguage={this.props.selectedLanguage}
                            isSubmitAll={true} />) :
                        '\u00a0'}
                </div>
                <div className='col-9-of-12'>
                    {this.getGridToggleButtons()}
                </div>
            </div>
        );
    }

    /**
     *  This method will returns the grid toggle buttons if the current marker operation mode is marking.
     */
    private getGridToggleButtons(): JSX.Element {
        if (!(this.props.isTeamManagementMode || this.props.isMarkingCheckMode)) {
            return (
                <div className='shift-right'>
                    <ul className='filter-menu'>
                        <li className='switch-view-btn'>
                            <GridToggleButton key={'gridtogglebuttonTile_key_' + this.props.id}
                                id={'gridtogglebuttonTile_' + this.props.id}
                                toggleGridView={this.toggleGridView}
                                isSelected={this.state.isTileView}
                                buttonType={enums.GridType.tiled}
                                selectedLanguage={this.props.selectedLanguage} />

                            <GridToggleButton key={'gridtogglebuttonDetail_key_' + this.props.id}
                                id={'gridtogglebuttonDetail_' + this.props.id}
                                toggleGridView={this.toggleGridView}
                                isSelected={!this.state.isTileView}
                                buttonType={enums.GridType.detailed}
                                selectedLanguage={this.props.selectedLanguage} />
                        </li>
                    </ul>
                </div>);
        }
    }

    /**
     * Show live closed response list grid
     */
    private showClosedGridContent(): JSX.Element {
        let result: JSX.Element;
        if (this.props.responseMode === enums.ResponseMode.closed) {
            /** if live closed response list is filled show grid content */
            if (this.closedWorklist) {
                result = this.switchWorklistResponseMode(this.closedWorklist);
            } else {
                result = this.props.isRefreshing ? this.loading : undefined;
            }

            return result;
        }
    }

    /**
     * Show live closed response list grid
     */
    private showPendingGridContent(): JSX.Element {
        let result: JSX.Element;
        if (this.props.responseMode === enums.ResponseMode.pending) {
            /** if live pending response list is filled show grid content */
            if (this.pendingWorklist && this.pendingWorklist.responses.count() > 0) {
                result = this.switchWorklistResponseMode(this.pendingWorklist);
            } else {
                result = this.props.isRefreshing ? this.loading : undefined;
            }

            return result;
        }
    }

    /**
     * Show live open response list grid
     */
    private showOpenGridContent(validationResponseAllocationButtonParam: responseAllocationButtonValidationParameter): JSX.Element {
        let result: JSX.Element;
        let examinerQigStatus: enums.ExaminerQIGStatus = targetHelper.getExaminerQigStatus();
        let currentTarget = targetSummaryStore.instance.getCurrentTarget();
        let isAggregateQIGTargetsON = qigStore.instance.isAggregatedQigCCEnabledForCurrentQig;
        if (this.openWorklist && this.props.responseMode === enums.ResponseMode.open) {
            /** if live open response is filled show grid content */
            if (this.props.worklistType === enums.WorklistType.live ?
                (this.openWorklist.concurrentLimit <= currentTarget.examinerProgress.atypicalOpenResponsesCount
                    || this.openWorklist.responses.count() > 0)
                : this.openWorklist.responses.count() > 0) {
                result = this.switchWorklistResponseMode(this.openWorklist);
            } else if (markerOperationModeFactory.operationMode.shouldDisplayHelperMessage) {
                if ((this.props.worklistType === enums.WorklistType.live) &&
                    (examinerQigStatus === enums.ExaminerQIGStatus.LiveComplete
                        || examinerQigStatus === enums.ExaminerQIGStatus.OverAllTargetCompleted)) {
                    // Target reached worklist messages
                    result = <WorkListMessage id='workListMessage'
                        key='workListMessage'
                        selectedLanguage={this.props.selectedLanguage}
                        hasTargetCompleted={true}
                        hasResponsesAvailableInPool={false}
                        isAggregateQIGTargetsON={isAggregateQIGTargetsON}
                    />;
                } else if ((this.props.worklistType === enums.WorklistType.live) && this.openWorklist.unallocatedResponsesCount > 0
                    && validationResponseAllocationButtonParam.IsWorklistInformationBannerVisible && !this.doShowBannerForOnDemand) {
                    let concurrentLimit: number = isAggregateQIGTargetsON ?
                        currentTarget.aggregatedMaximumConcurrentLimit - currentTarget.examinerProgress.atypicalOpenResponsesCount :
                        currentTarget.maximumConcurrentLimit - currentTarget.examinerProgress.atypicalOpenResponsesCount;
                    // live worklist messages
                    result = <WorkListMessage id='workListMessage'
                        key='workListMessage'
                        selectedLanguage={this.props.selectedLanguage}
                        hasResponsesAvailableInPool={true}
                        responseConcurrentLimit={concurrentLimit}
                        isAggregateQIGTargetsON={isAggregateQIGTargetsON}
                    />;
                } else if ((this.props.worklistType === enums.WorklistType.live) &&
                    validationResponseAllocationButtonParam.IsWorklistInformationBannerVisible && !this.doShowBannerForOnDemand) {

                    // live worklist messages
                    result = <WorkListMessage id='workListMessage'
                        key='workListMessage'
                        selectedLanguage={this.props.selectedLanguage}
                        hasResponsesAvailableInPool={false}
                    />;
                } else if (this.props.worklistType === enums.WorklistType.standardisation ||
                    this.props.worklistType === enums.WorklistType.secondstandardisation) {
                    // standardisation worklist awaiting approval message
                    result = <StandardisationWorklistMessage
                        id={this.props.id}
                        key={'key_' + this.props.id}
                        selectedLanguage={this.props.selectedLanguage} />;
                } else if (this.props.worklistType === enums.WorklistType.simulation &&
                    validationResponseAllocationButtonParam.IsWorklistInformationBannerVisible) {

                    let showResponseAvailableHelperMessage: boolean =
                        (this.openWorklist.unallocatedResponsesCount > 0 && this.openWorklist.responses.count() === 0);

                    result = <WorkListMessage id='workListMessage'
                        key='workListMessage'
                        selectedLanguage={this.props.selectedLanguage}
                        hasResponsesAvailableInPool={showResponseAvailableHelperMessage}
                        isSimulation={true} />;
                } else {
                    result = null;
                }
            }
        } else {
            result = this.props.isRefreshing ? this.loading : undefined;
        }
        return result;
    }

    /**
     * This method will call parent component function to toggle left panel
     */
    private toggleLeftPanel() {
        this.props.toggleLeftPanel();
    }

    /**
     * Generating Grid Rows
     */
    private getGridRows(liveOpenResponseList: WorklistBase,
        worklistType: enums.WorklistType,
        responseType: enums.ResponseMode,
        gridType: enums.GridType,
        comparerName?: string,
        sortDirection?: enums.SortDirection): Immutable.List<Row> {

        return this.worklistHelper.generateRowDefinion(liveOpenResponseList, responseType, gridType);
    }

    /**
     * Generating Grid Rows
     */
    private getGridColumnHeaderRows(worklistType: enums.WorklistType,
        responseType: enums.ResponseMode,
        comparerName: string,
        sortDirection: enums.SortDirection): Immutable.List<Row> {

        return this.worklistHelper.generateTableHeader(responseType, worklistType, comparerName, sortDirection);
    }

    /**
     * Generating Grid Rows
     */
    private getFrozenTableBodyRows(responseList: WorklistBase,
        worklistType: enums.WorklistType,
        responseType: enums.ResponseMode,
        comparerName?: string,
        sortDirection?: enums.SortDirection): Immutable.List<Row> {

        return this.worklistHelper.generateFrozenRowBody(responseList, responseType, worklistType);
    }

    /**
     * Generating Grid Rows
     */
    private getFrozenTableHeaderRow(responseList: WorklistBase,
        worklistType: enums.WorklistType,
        responseType: enums.ResponseMode,
        comparerName: string,
        sortDirection: enums.SortDirection): Immutable.List<Row> {

        return this.worklistHelper.generateFrozenRowHeader(responseList, responseType, worklistType, comparerName, sortDirection);
    }

    /**
     * Handle animation of grid view toggle on componentDidUpdate
     */
    public componentDidUpdate() {
        this.triggerAnimation();
        let buttonHolder = htmlUtilities.getElementsByClassName('response-button-holder');
        let rightSpacer: any = htmlUtilities.getElementsByClassName('right-spacer');
        if (buttonHolder.length > 0 && rightSpacer.length > 0) {
            if (buttonHolder.length > 0) {
                rightSpacer[0].style.paddingLeft = buttonHolder[0].clientWidth + 'px';
            } else {
                rightSpacer[0].style.paddingLeft = '';
            }
        }
    }

    /**
     * Handle animation of grid view toggle on componentDidMount
     */
    public componentDidMount() {
        examinerStore.instance.addListener(examinerStore.ExaminerStore.MARKER_INFO_UPDATED_EVENT, this.updateMarkerInformationPanel);
        messageStore.instance.addListener(messageStore.MessageStore.MESSAGE_NAVIGATION_EVENT, this.onNavigatetoResponse);
        qigStore.instance.addListener(qigStore.QigStore.QIG_SELECTED_EVENT, this.resetSortAttributes);
        this.triggerAnimation();
        worklistStore.instance.addListener(worklistStore.WorkListStore.MARKING_CHECK_WORKLIST_ACCESS_STATUS_UPDATED,
            this.updateMarkCheckWorklistAccessMessage);
        worklistStore.instance.addListener(worklistStore.WorkListStore.WORKLIST_FILTER_CHANGED, this.onWorklistFilterChanged);
        worklistStore.instance.addListener(worklistStore.WorkListStore.MARK_CHECK_EXAMINERS_DATA_RETRIVED, this.reRender);
        responseStore.instance.addListener(responseStore.ResponseStore.RESPONSE_ALLOCATED_EVENT, this.onResponseAllocated);
    }

    // update worklist on changing marking check worklist
    private reRender = (): void => {
        let rightSpacer: any = htmlUtilities.getElementsByClassName('right-spacer');
        if (rightSpacer.length > 0) {
            rightSpacer.style.paddingLeft = '';
        }
        this.setState({
            renderedOn: Date.now(),
            isTileView: false
        });
    };

    /**
     *
     */
    private updateMarkCheckWorklistAccessMessage = (): void => {
        this.setState({
            isMarkingCheckWorklistAccessPresent:
                this.props.isTeamManagementMode ? false : worklistStore.instance.isMarkingCheckWorklistAccessPresent
        });
    }

    private updateMarkerInformationPanel = (): void => {
        this.setState({ renderedOn: Date.now() });
    };

    /**
     * this will trigger the animation on grid view toggle.
     */
    private triggerAnimation() {
        if (this.state.isGridviewChanged) {
            let that = this;
            /* setTimeout is used with delay 0 to work animation in Firefox and Chrome */
            setTimeout(function () {
                that.setState({
                    isTileView: that.state.isTileView,
                    isGridviewChanged: false
                });
                worklistActionCreator.setScrollWorklistColumns();
            }, 0);
        }
    }

    /**
     * this will change the grid view (tile/detail).
     */
    private toggleGridView() {

        let isTileViewSelected = !this.state.isTileView;
        /* Saving the selected grid view in user options */
        userOptionsHelper.save(userOptionKeys.SELECTED_GRID_TYPE, String(isTileViewSelected), true);

        this.setState({
            isTileView: isTileViewSelected,
            isGridviewChanged: true
        });
    }

    /**
     * returns the worklist component based on the view (tile/list)
     * @param worklistType
     */
    private getWorklistComponent = (worklistType: enums.WorklistType): JSX.Element => {
        let isQualityFeedbackMessageToBeDisplayed: boolean =
            qualityFeedbackHelper.isQualtiyHelperMessageNeededToBeDisplayed(this.props.worklistType);

        let grid: JSX.Element;

        if (this.state.isTileView) {

            grid = (<GridControl gridRows={this._gridRows}
                gridStyle={this.gridStyle}
                onClickCallBack={this.handleTileClick}
                id={this.getGridControlId()}
                key={'key_' + this.props.id}
                worklistType={worklistType}
                selectedLanguage={this.props.selectedLanguage} />);
        } else {

            grid = (<div className={classNames('grid-wrapper', { 'show-seed-message': isQualityFeedbackMessageToBeDisplayed })} >
                <WorklistTableWrapper
                    columnHeaderRows={this._gridColumnHeaderRows}
                    frozenHeaderRows={this._gridFrozenHeaderRows}
                    frozenBodyRows={this._gridFrozenBodyRows}
                    gridRows={this._gridRows}
                    getGridControlId={this.getGridControlId}
                    id={this.props.id}
                    key={'worklistcontainer_key_' + this.props.id}
                    selectedLanguage={this.props.selectedLanguage}
                    worklistType={this.props.worklistType}
                    onSortClick={this.onSortClick}
                    doSetMinWidth={this.doSetMinWidth}
                    renderedOn={this.state.renderedOn}
                />
            </div>);
        }

        return grid;
    };

    /**
     * Invoked while clicking the filter
     */
    private onWorklistFilterSelected = (selectedFilter: enums.WorklistSeedFilter) => {
        // FIre action for filter the data
        worklistActionCreator.setFilteredWorklistData(qigStore.instance.selectedQIGForMarkerOperation.examinerRoleId, selectedFilter);
    }

    /**
     * Invoked while filtered data in the store
     */
    private onWorklistFilterChanged = (selectedFilter: enums.WorklistSeedFilter) => {
        if (this.state.selectedFilterType !== selectedFilter) {
            let examinerRoleID: number = qigStore.instance.selectedQIGForMarkerOperation.examinerRoleId;
            let worklistType: number = this.props.worklistType;
            let remarkRequestType: enums.RemarkRequestType = this.props.remarkRequestType;
            let isDirectedRemark: boolean = this.props.isDirectedRemark;

            if (this.props.isMarkingCheckMode) {
                examinerRoleID = worklistStore.instance.selectedMarkingCheckExaminer.examinerRoleID;
                worklistType = enums.WorklistType.live;
                remarkRequestType = enums.RemarkRequestType.Unknown;
                isDirectedRemark = false;
            }

            // Get script images from cache once the filter change.
            worklistActionCreator.notifyWorklistTypeChange(qigStore.instance.selectedQIGForMarkerOperation.markSchemeGroupId,
                examinerRoleID,
                qigStore.instance.selectedQIGForMarkerOperation.questionPaperPartId,
                worklistType,
                enums.ResponseMode.closed,
                remarkRequestType,
                isDirectedRemark,
                qigStore.instance.selectedQIGForMarkerOperation.isElectronicStandardisationTeamMember,
                true,
                this.props.isMarkingCheckMode);

            this.setState({
                selectedFilterType: selectedFilter,
                renderedOn: Date.now()
            });
        }
    }

    /**
     * returns whether the submitt all response button is visible or not.
     */
    private isSubmittButtonVisible() {
        // we don't need to display the submit button when the marker operation mode is TeamManagement or marking check
        if (this.props.isTeamManagementMode || this.props.isMarkingCheckMode) {
            return false;
        } else {
            /* For an ecoursework component we have consider both allfilesviewed and submitenabled statuses
               for showing submit button in open response */
            let isSubmitEnabled: boolean = false;
            if (this.props.responseMode === enums.ResponseMode.open) {
                if (eCourseworkHelper.isECourseworkComponent) {
                    isSubmitEnabled = this.openWorklist.responses.
                        filter((x: LiveOpenResponse) => x.isSubmitEnabled === true
                            && x.allFilesViewed === true).count() > 0;
                } else {
                    isSubmitEnabled = this.openWorklist.responses.
                        filter((x: LiveOpenResponse) => x.isSubmitEnabled === true).count() > 0;
                }
            }
            if (!qigStore.instance.isAtypicalAvailable && this.props.responseMode === enums.ResponseMode.open
                && this.props.worklistType === enums.WorklistType.atypical) {
                isSubmitEnabled = false;
            }

            return isSubmitEnabled;
        }
    }

    /**
     *  Get grid rows and associated table rows ans ets associated local variables
     */
    private setRowDefinitionCollections(gridTypeSelected: enums.GridType, worklist: WorklistBase) {

        this.worklistHelper = worklistFactory.getWorklistHelper(this.props.worklistType);

        if (!this.comparerName) {
            this.setDefaultComparer();
        }

        if (this.isSortRequired() === true) {
            // if the direction is descending the text 'Desc' is appending to the comparer name since all
            // descending comparere has the same name followed by text 'Desc'
            let _comparerName = (this.sortDirection === enums.SortDirection.Ascending) ? this.comparerName : this.comparerName + 'Desc';
            worklist.responses = Immutable.List<any>(sortHelper.sort(worklist.responses.toArray(), comparerList[_comparerName]));
        }

        // the below order of fecthing the grid data should be maintained.
        this._gridRows = this.getGridRows(worklist, this.props.worklistType,
            this.props.responseMode, gridTypeSelected, this.comparerName, this.sortDirection);
        this._gridColumnHeaderRows = this.getGridColumnHeaderRows(this.props.worklistType,
            this.props.responseMode, this.comparerName, this.sortDirection);
        this._gridFrozenBodyRows = this.getFrozenTableBodyRows(worklist,
            this.props.worklistType, this.props.responseMode, this.comparerName, this.sortDirection);
        this._gridFrozenHeaderRows = this.getFrozenTableHeaderRow(worklist,
            this.props.worklistType, this.props.responseMode, this.comparerName, this.sortDirection);
    }

    /**
     * Set the comparer for the current worklist based on the worklisttype,qigId and responseMode
     */
    private setDefaultComparer() {
        let defaultComparers = worklistStore.instance.responseSortDetails;
        let qigId: number = qigStore.instance.selectedQIGForMarkerOperation.markSchemeGroupId;
        let worklistType: enums.WorklistType = this.props.worklistType;
        let responseMode: enums.ResponseMode = this.props.responseMode;

        let entry: responsesortdetails[] = defaultComparers.filter((x: responsesortdetails) =>
            x.worklistType === worklistType && x.responseMode === responseMode
            && x.qig === qigId && x.remarkRequestType === this.props.remarkRequestType);

        if (entry.length > 0) {
            this.comparerName = comparerList[entry[0].comparerName];
            this.sortDirection = entry[0].sortDirection;
        }

    }

    /**
     * returns the header element of worklist.
     */
    private getWorklistHeader = (): JSX.Element => {
        let headingText: string;

        if (this.props.isMarkingCheckMode) {
            let formattedString: string = stringFormatHelper.getUserNameFormat().toLowerCase();
            formattedString = formattedString.replace('{initials}',
                worklistStore.instance.selectedMarkingCheckExaminer.toExaminer.initials);
            formattedString = formattedString.replace('{surname}',
                worklistStore.instance.selectedMarkingCheckExaminer.toExaminer.surname);
            headingText = localeStore.instance.TranslateText('marking.worklist.worklist-headers.live')
                + ' ' + localeStore.instance.TranslateText('marking.worklist.perform-marking-check.worklist-of-examiner')
                + ' ' + formattedString;
        } else {

            switch (this.props.worklistType) {
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
                        enums.RemarkRequestType[this.props.remarkRequestType]), [constants.NONBREAKING_HYPHEN_UNICODE]);
                    break;
                case enums.WorklistType.pooledRemark:
                    headingText = stringHelper.format(localeStore.instance.TranslateText('generic.remark-types.long-names.' +
                        enums.RemarkRequestType[this.props.remarkRequestType]), [constants.NONBREAKING_HYPHEN_UNICODE]);
                    break;
                case enums.WorklistType.simulation:
                    headingText = localeStore.instance.TranslateText('marking.worklist.worklist-headers.simulation');
                    break;
            }
        }

        let element: JSX.Element = (<h3 className='shift-left page-title' id={'worklistTitle'}>
            <span className='page-title-text'>
                {headingText}
            </span>
            <span className='right-spacer'></span>
        </h3>);
        return element;
    };

    /**
     * returns the Atypical search bar for atypical worklist
     */
    private getAtypicalSearchBar = (): JSX.Element => {
        let atypicalSearchBarElement: JSX.Element = null;
        if (this.props.selectedTab === enums.ResponseMode.open) {
            atypicalSearchBarElement = <AtypicalSearchBar
                id='atypicalSearchBar'
                key='atypicalSearchBar'
                disableControls={!qigStore.instance.isAtypicalAvailable}
                selectedLanguage={this.props.selectedLanguage} />;
        } else {
            atypicalSearchBarElement = (<div className='atypical-search-wrap middle-content'></div>);
        }
        return atypicalSearchBarElement;
    };

    /**
     * Set the loading indicator
     */
    private setLoadingindicator() {
        if (this.props.hasTargetFound) {
            this.loading = <LoadingIndicator id='loading' key='loading'
                selectedLanguage={localeStore.instance.Locale}
                isOnline={applicationStore.instance.isOnline}
                cssClass='section-loader loading' />;
        } else {
            this.loading = null;
        }
    }

    /**
     * Method called when the user confirms navigation from message panel
     */
    private onNavigatetoResponse(messageNavigationArguments: MessageNavigationArguments) {
        if (messageNavigationArguments.canNavigate && messageNavigationArguments.navigateTo === enums.MessageNavigation.toResponse) {
            let openedResponseDetails = worklistStore.instance.getResponseDetails(messageNavigationArguments.responseId.toString());
            responseHelper.openResponse(messageNavigationArguments.responseId,
                enums.ResponseNavigation.specific,
                worklistStore.instance.getResponseMode,
                openedResponseDetails.markGroupId,
                enums.ResponseViewMode.zoneView,
                messageNavigationArguments.triggerPoint);

            // Ideally marking mode should be read from the opened response,
            // since multiple marking modes won't come in the same worklist now this will work.
            let selectedMarkingMode = worklistStore.instance.getMarkingModeByWorkListType(worklistStore.instance.currentWorklistType);

            markSchemeHelper.getMarks(messageNavigationArguments.responseId, selectedMarkingMode);
            eCourseworkHelper.fetchECourseWorkCandidateScriptMetadata(messageNavigationArguments.responseId);
        } else if (messageNavigationArguments.canNavigate && messageNavigationArguments.navigateTo === enums.SaveAndNavigate.toMenu) {
            userInfoActionCreator.changeMenuVisibility();
        } else if (messageNavigationArguments.canNavigate &&
            messageNavigationArguments.navigateTo === enums.SaveAndNavigate.toMarkingCheckWorklist) {
            markingCheckActionCreator.getMarkCheckExaminers(
                qigStore.instance.selectedQIGForMarkerOperation.markSchemeGroupId);
        }
    }

    /**
     * Method called when response allocated
     * @param responseAllocationErrorCode
     */
    private onResponseAllocated = (responseAllocationErrorCode: enums.ResponseAllocationErrorCode) => {
        if (responseStore.instance.isWholeResponseAllocation &&
            (responseAllocationErrorCode === enums.ResponseAllocationErrorCode.suspendedMarker ||
                responseAllocationErrorCode === enums.ResponseAllocationErrorCode.unApprovedMarker)) {

            // Visibility of whole response button handled for this particular error code
            this.isErrorOccuredInWholeResponseAllocation = true;
        }
    }

    /**
     * Call back function from table wrapper on sorting
     */
    private onSortClick(comparerName: string, sortDirection: enums.SortDirection) {
        if (this.isSortRequired() === true) {
            this.comparerName = comparerName;
            this.sortDirection = sortDirection;

            let sortDetails: responsesortdetails = {
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
    }

    /**
     * Function to bypass sorting for a specific requirment.
     */
    private isSortRequired = (): boolean => {

        let isSortRequired = true;

        // To bypass sorting in closed response, if any quality feedback is pending
        if (this.props.responseMode === enums.ResponseMode.closed
            && qualityFeedbackHelper.isQualtiyHelperMessageNeededToBeDisplayed(this.props.worklistType) === true) {
            isSortRequired = false;
            // setting the default sort order for closed response, if any quality feedback is pending.
            this.comparerName = comparerList[comparerList.submittedDateComparer];
            this.sortDirection = enums.SortDirection.Descending;
        }

        return isSortRequired;
    };

    /**
     * return boolean value  which showing the worklist message banner for on demand component.
     */
    private get doShowBannerForOnDemand(): boolean {
        let isAggregateQIGTargetsON = qigStore.instance.isAggregatedQigCCEnabledForCurrentQig;
        let currentTarget = targetSummaryStore.instance.getCurrentTarget();
        return isAggregateQIGTargetsON
            && currentTarget.aggregatedOpenResponsesCount > 0;
    }
}

export = WorkListContainer;