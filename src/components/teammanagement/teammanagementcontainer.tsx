/* tslint:disable:no-unused-variable */
import React = require('react');
/* tslint:enable:no-unused-variable */
import pureRenderComponent = require('../base/purerendercomponent');
import GridControl = require('../utility/grid/gridcontrol');
import enums = require('../utility/enums');
let classNames = require('classnames');
import localeStore = require('../../stores/locale/localestore');
import teamManagementFactory = require('../../utility/teammanagement/teammanagementfactory');
import teamManagementHelper = require('../../utility/teammanagement/teammanagementhelper');
import LoadingIndicator = require('../utility/loadingindicator/loadingindicator');
import applicationStore = require('../../stores/applicationoffline/applicationstore');
import sortHelper = require('../../utility/sorting/sorthelper');
import comparerList = require('../../utility/sorting/sortbase/comparerlist');
import Immutable = require('immutable');
import responsesortdetails = require('../utility/grid/responsesortdetails');
import examinerViewDataHelper = require('../../utility/teammanagement/helpers/examinerviewdatahelper');
import TeamManagementTableWrapper = require('./teammanagementtablewrapper');
import teamManagementStore = require('../../stores/teammanagement/teammanagementstore');
import navigationHelper = require('../utility/navigation/navigationhelper');
import qigSelectorActionCreator = require('../../actions/qigselector/qigselectoractioncreator');
import worklistActioncreator = require('../../actions/worklist/worklistactioncreator');
import qigStore = require('../../stores/qigselector/qigstore');
import worklistStore = require('../../stores/worklist/workliststore');
import scriptImageDownloadHelper = require('../../components/utility/backgroundworker/scriptimagedownloadhelper');
import scriptActionCreator = require('../../actions/script/scriptactioncreator');
import scriptStore = require('../../stores/script/scriptstore');
import responseActionCreator = require('../../actions/response/responseactioncreator');
import markSchemeHelper = require('../../utility/markscheme/markschemehelper');
import responseStore = require('../../stores/response/responsestore');
import markingStore = require('../../stores/marking/markingstore');
import BusyIndicator = require('../utility/busyindicator/busyindicator');
import teamManagementActionCreator = require('../../actions/teammanagement/teammanagementactioncreator');
import responseSearchHelper = require('../../utility/responsesearch/responsesearchhelper');
import examinerstore = require('../../stores/markerinformation/examinerstore');
import stampActionCreator = require('../../actions/stamp/stampactioncreator');
import stampStore = require('../../stores/stamp/stampstore');
import userOptionsHelper = require('../../utility/useroption/useroptionshelper');
import useroptionKeys = require('../../utility/useroption/useroptionkeys');
import eCourseworkHelper = require('../utility/ecoursework/ecourseworkhelper');
import qigDetails = require('../../dataservices/teammanagement/typings/qigdetails');
import MultiQigDropDown = require('./multiqigdropdown');
import ccValues = require('../../utility/configurablecharacteristic/configurablecharacteristicsvalues');
import MultiQigLockPopup = require('./multiqiglockpopup');
import busyIndicatorActionCreator = require('../../actions/busyindicator/busyindicatoractioncreator');
import configurableCharacteristicsHelper = require('../../utility/configurablecharacteristic/configurablecharacteristicshelper');
import configurableCharacteristicsNames = require('../../utility/configurablecharacteristic/configurablecharacteristicsnames');
import MultiQigLockResultPopup = require('./multiqiglockresultpopup');
import responseHelper = require('../utility/responsehelper/responsehelper');
import operationModeHelper = require('../utility/userdetails/userinfo/operationmodehelper');

/**
 * State of Team Management component
 */
interface State {
    renderedOn?: number;
    isBusy?: boolean;
}

/**
 * Properties of a component
 */
interface Props extends LocaleSelectionBase, PropsBase {
    toggleLeftPanel: Function;
    teamManagementTab: enums.TeamManagement;
    renderedOn?: number;
    isFromMenu?: boolean;
}

/**
 * React component for Team management container
 */
class TeamManagementContainer extends pureRenderComponent<Props, State> {
    private _gridRows: Immutable.List<Row>;
    private _gridColumnHeaderRows: Immutable.List<Row>;
    private _gridFrozenBodyRows: Immutable.List<Row>;
    private _gridFrozenHeaderRows: Immutable.List<Row>;


    private gridStyle: string = '';
    private teamManagementHelper: teamManagementHelper;
    private examinerViewDataHelper: examinerViewDataHelper;
    private exceptionData: Immutable.List<UnActionedExceptionDetails>;
    private loading: JSX.Element;
    private comparerName: string;
    private sortDirection: enums.SortDirection;
    private helpExaminerData: Immutable.List<ExaminerDataForHelpExaminer>;
    private busyIndicatorInvoker: enums.BusyIndicatorInvoker = enums.BusyIndicatorInvoker.none;
    private showBackgroundScreenOnBusy: boolean = false;

    /**
     * @constructor
     */
    constructor(props: Props, state: State) {
        super(props, state);
        // initialising examiner view data helper
        this.examinerViewDataHelper = new examinerViewDataHelper();
        /* getting user preference for the grid view */
        this.state = {
            isBusy: false,
            renderedOn: this.props.renderedOn
        };
        this.toggleLeftPanel = this.toggleLeftPanel.bind(this);
        this.setBusyIndicatorProperties(enums.BusyIndicatorInvoker.loadingResponse, false);
        this.exceptionData = Immutable.List<UnActionedExceptionDetails>(teamManagementStore.instance.exceptionList);
    }

    /**
     * Render method
     */
    public render() {
        this.setLoadingindicator();
        /* if there are no match and the data has not been loaded, show busy indicator */
        let busyIndicator: JSX.Element = (<BusyIndicator id={'response_' + this.busyIndicatorInvoker.toString() }
            isBusy={this.state.isBusy}
            key={'response_' + this.busyIndicatorInvoker.toString() }
            isMarkingBusy={true}
            busyIndicatorInvoker={this.busyIndicatorInvoker}
            doShowDialog={true}
            showBackgroundScreen={this.showBackgroundScreenOnBusy} />);
        return (
            <div className='column-right'>
                <a href='javascript:void(0);' className='toggle-left-panel' id='side-panel-toggle-button'
                    title={localeStore.instance.TranslateText('team-management.left-panel.show-hide-panel-tooltip') }
                    onClick={this.toggleLeftPanel}>
                    <span className='sprite-icon panel-toggle-icon'>panel toggle</span>
                </a>

                {this.loadTeamManagementRightPanel() }
                {busyIndicator}
            </div>);
    }

    /**
     * componentDidMount React lifecycle event
     */
    public componentDidMount() {
        teamManagementStore.instance.addListener(teamManagementStore.TeamManagementStore.EXPAND_OR_COLLAPSE_NODE_EVENT,
            this.onCollapseOrExpandExaminerNode);
        teamManagementStore.instance.addListener(teamManagementStore.TeamManagementStore.MY_TEAM_DATA_LOADED_EVENT,
            this.onMyTeamDataLoad);
        teamManagementStore.instance.addListener(teamManagementStore.TeamManagementStore.TEAM_EXCEPTIONS_DATA_LOADED_EVENT,
            this.onExceptionDataLoad);
        teamManagementStore.instance.addListener(teamManagementStore.TeamManagementStore.EXAMINER_DRILL_DOWN_DATA_UPDATED,
            this.onExaminerDrillDown);
        teamManagementStore.instance.addListener(teamManagementStore.TeamManagementStore.HELP_EXAMINERS_DATA_RECEIVED,
            this.onHelpExaminersDataLoad);
        teamManagementStore.instance.addListener(teamManagementStore.TeamManagementStore.APPROVAL_MANAGEMENT_ACTION_EXECUTED,
            this.onApprovalManagementActionExecuted);
        teamManagementStore.instance.addListener(teamManagementStore.TeamManagementStore.SELECTED_EXCEPTION_ACTION_RECEIVED,
            this.getSelectedException);
        worklistStore.instance.addListener(worklistStore.WorkListStore.WORKLIST_MARKING_MODE_CHANGE, this.markingModeChanged);
        scriptStore.instance.addListener(
            scriptStore.ScriptStore.CANDIDATE_RESPONSE_METADATA_RETRIEVAL_EVENT,
            this.onCandidateResponseMetadataRetrieved);
        responseStore.instance.addListener(responseStore.ResponseStore.RESPONSE_OPENED, this.openResponse);
        markingStore.instance.addListener(markingStore.MarkingStore.RETRIEVE_MARKS_EVENT, this.marksRetrieved);
        examinerstore.instance.addListener(examinerstore.ExaminerStore.MARKER_INFO_UPDATED_EVENT,
            this.markerInformationReceived);
        stampStore.instance.addListener
            (stampStore.StampStore.STAMPS_LOADED_EVENT, this.onStampDataRetrieved);
        teamManagementStore.instance.addListener(teamManagementStore.TeamManagementStore.EXAMINER_VALIDATED_OPEN_EXCEPTION_EVENT,
            this.validateExaminerStatus);
        teamManagementStore.instance.addListener(teamManagementStore.TeamManagementStore.MULTI_QIG_LOCK_DATA_RECEIVED,
            this.onMultiLockDataLoad);
        teamManagementStore.instance.addListener(teamManagementStore.TeamManagementStore.MULTI_QIG_LOCK_RESULT_RECEIVED,
            this.onMultiLockResultReceived);
    }

    /**
     * componentWillUnmount React lifecycle event
     */
    public componentWillUnmount() {
        teamManagementStore.instance.removeListener(teamManagementStore.TeamManagementStore.EXPAND_OR_COLLAPSE_NODE_EVENT,
            this.onCollapseOrExpandExaminerNode);
        teamManagementStore.instance.removeListener(teamManagementStore.TeamManagementStore.EXAMINER_DRILL_DOWN_DATA_UPDATED,
            this.onExaminerDrillDown);
        teamManagementStore.instance.removeListener(teamManagementStore.TeamManagementStore.MY_TEAM_DATA_LOADED_EVENT,
            this.onMyTeamDataLoad);
        teamManagementStore.instance.removeListener(teamManagementStore.TeamManagementStore.TEAM_EXCEPTIONS_DATA_LOADED_EVENT,
            this.onExceptionDataLoad);
        teamManagementStore.instance.removeListener(teamManagementStore.TeamManagementStore.HELP_EXAMINERS_DATA_RECEIVED,
            this.onHelpExaminersDataLoad);
        teamManagementStore.instance.removeListener(teamManagementStore.TeamManagementStore.APPROVAL_MANAGEMENT_ACTION_EXECUTED,
            this.onApprovalManagementActionExecuted);
        teamManagementStore.instance.removeListener(teamManagementStore.TeamManagementStore.SELECTED_EXCEPTION_ACTION_RECEIVED,
            this.getSelectedException);
        worklistStore.instance.removeListener(worklistStore.WorkListStore.WORKLIST_MARKING_MODE_CHANGE, this.markingModeChanged);
        scriptStore.instance.removeListener(
            scriptStore.ScriptStore.CANDIDATE_RESPONSE_METADATA_RETRIEVAL_EVENT,
            this.onCandidateResponseMetadataRetrieved);
        responseStore.instance.removeListener(responseStore.ResponseStore.RESPONSE_OPENED, this.openResponse);
        markingStore.instance.removeListener(markingStore.MarkingStore.RETRIEVE_MARKS_EVENT, this.marksRetrieved);
        examinerstore.instance.removeListener(examinerstore.ExaminerStore.MARKER_INFO_UPDATED_EVENT,
            this.markerInformationReceived);
        stampStore.instance.removeListener
            (stampStore.StampStore.STAMPS_LOADED_EVENT, this.onStampDataRetrieved);
        teamManagementStore.instance.removeListener(teamManagementStore.TeamManagementStore.EXAMINER_VALIDATED_OPEN_EXCEPTION_EVENT,
            this.validateExaminerStatus);
        teamManagementStore.instance.removeListener(teamManagementStore.TeamManagementStore.MULTI_QIG_LOCK_DATA_RECEIVED,
            this.onMultiLockDataLoad);
        teamManagementStore.instance.removeListener(teamManagementStore.TeamManagementStore.MULTI_QIG_LOCK_RESULT_RECEIVED,
            this.onMultiLockResultReceived);
    }

    /**
     * Comparing the props to check the resetSortInfo if teamManagementTab selection has changed
     * @param nextProps
     */
    public componentWillReceiveProps(nextProps: Props) {
        if (this.props.teamManagementTab !== nextProps.teamManagementTab) {
            this.resetSortInfo();
        }
    }

    /**
     * Get the grid control id
     */
    private getGridControlId = (): string => {
        let gridId: string = enums.TeamManagement[this.props.teamManagementTab] + '_grid_' + this.props.id;
        return gridId;
    };

    /**
     * This method will call parent component function to toggle left panel
     */
    private toggleLeftPanel() {
        this.props.toggleLeftPanel();
    }

    /**
     * Generating Grid Rows
     * @param tabData
     * @param teamManagementTab
     * @param comparerName
     * @param sortDirection
     */
    private getGridRows(tabData: Immutable.List<GridData>,
        teamManagementTab: enums.TeamManagement,
        comparerName?: string,
        sortDirection?: enums.SortDirection): Immutable.List<Row> {
        return this.teamManagementHelper.generateRowDefinion(tabData, teamManagementTab);
    }

    /**
     * get column header rows for grid
     * @param teamManagementTab
     * @param comparerName
     * @param sortDirection
     */
    private getGridColumnHeaderRows(teamManagementTab: enums.TeamManagement,
        comparerName: string,
        sortDirection: enums.SortDirection, tabData?: any): Immutable.List<Row> {
        return this.teamManagementHelper.generateTableHeader(teamManagementTab, comparerName, sortDirection, tabData);
    }

    /**
     * Generating Frozen Grid Rows
     * @param tabData
     * @param teamManagementTab
     * @param comparerName
     * @param sortDirection
     */
    private getFrozenTableBodyRows(tabData: Immutable.List<ExaminerViewDataItem>,
        teamManagementTab: enums.TeamManagement,
        comparerName?: string,
        sortDirection?: enums.SortDirection): Immutable.List<Row> {

        return this.teamManagementHelper.generateFrozenRowBody(tabData, teamManagementTab);
    }

    /**
     * This method will call on my team data load
     */
    private onMyTeamDataLoad = (isFromHistory: boolean) => {
        if (isFromHistory) {
            return;
        }
        this.setState({
            renderedOn: Date.now()
        });
    };

    /**
     * This method will call on exception data load
     */
    private onExceptionDataLoad = () => {
        // Check if exception count in store variables- teamOverviewCountData.exceptionCount and that in exceptionList
        // are same; if not, load the latest data from server else consider the ones in exceptionList
        let _selectedQig: qigDetails = teamManagementStore.instance.getSelectedQig;
        if (_selectedQig &&
            teamManagementStore.instance.exceptionList.count() === _selectedQig.exceptionCount) {
            this.exceptionData = Immutable.List<UnActionedExceptionDetails>(teamManagementStore.instance.exceptionList);
        } else {
            teamManagementActionCreator.getUnactionedExceptions(teamManagementStore.instance.selectedMarkSchemeGroupId, false);
        }
        this.setState({
            renderedOn: Date.now()
        });
    };

    /**
     * This method will call on help examiners data load
     */
    private onHelpExaminersDataLoad = (isFromHistory: boolean) => {
        if (isFromHistory) {
            return;
        }

        this.helpExaminerData = teamManagementStore.instance.examinersForHelpExaminers;
        this.setState({
            renderedOn: Date.now()
        });
    };

    /**
     * Returning frozen table header rows
     * @param teamManagementTab
     * @param comparerName
     * @param sortDirection
     */
    private getFrozenTableHeaderRow(teamManagementTab: enums.TeamManagement,
        comparerName: string,
        sortDirection: enums.SortDirection): Immutable.List<Row> {
        return this.teamManagementHelper.generateFrozenRowHeader(teamManagementTab, comparerName, sortDirection);
    }

    /**
     * Load the Team Management Right panel
     */
    private loadTeamManagementRightPanel = (): JSX.Element => {
        let teamManagementRightPanel: JSX.Element;
        if (this.props.teamManagementTab === undefined || this.props.teamManagementTab === enums.TeamManagement.None
            || (this.props.teamManagementTab === enums.TeamManagement.MyTeam &&
                teamManagementStore.instance.myTeamData.size === 0) ||
            (this.props.teamManagementTab === enums.TeamManagement.Exceptions && this.exceptionData === undefined)) {
            teamManagementRightPanel = this.loading;
        } else {
            teamManagementRightPanel = (
                <div className='wrapper'>
                    <div className='clearfix wl-page-header col-wrap'>
                        <div className='col-6-of-12' id='team-management-header-text'>
                            {this.getTeamManagementTabHeader() }
                        </div>

                        <div className='col-6-of-12'>
                            {/* for future developement */}
                            {/*<div className='shift-right'>
                                    <ul className='filter-menu team-filter'>
                                        <li className='small-text dim-text filter-label'>Filter by: </li>
                                        <li className='drop-menu'>
                                            <div className='dropdown-wrap form-component'>
                                                <a href='#' id='filterMenu' className='menu-button'>
                                                    <span>All</span>
                                                    <span className='sprite-icon menu-arrow-icon'></span>
                                                </a>
                                                <ul className='menu' role='menu' title='Languages' aria-hidden='true'>
                                                    <li role='menuitem'><a href='#'>Open</a></li>
                                                    <li role='menuitem'><a href='#'>In Progress</a></li>
                                                    <li role='menuitem'><a href='#'>Menu Item</a></li>
                                                </ul>
                                            </div>
                                        </li>
                                        <li className='small-text dim-text filter-label'>
                                            <div className='search-box'>
                                                <input type='text' className='search' tabindex='1' id='searchTeam' required=''></input>
                                                <label>Search</label>
                                                <button className='sprite-icon search-icon-small-black search-btn'></button>
                                            </div>
                                        </li>
                                    </ul>
                                </div> */}
                        </div>
                    </div>
                    {this.loadTeamManagementScreen() }
                </div>);
        }
        return teamManagementRightPanel;
    };

    /**
     * returns the team management grid
     * @param teamManagementTab
     */
    private getTeamManagementTabComponent = (teamManagementTab: enums.TeamManagement): JSX.Element => {

        let grid: JSX.Element;
        grid = (<div className='grid-wrapper'>
            <TeamManagementTableWrapper
                columnHeaderRows={this._gridColumnHeaderRows}
                frozenHeaderRows={this._gridFrozenHeaderRows}
                frozenBodyRows={this._gridFrozenBodyRows}
                gridRows={this._gridRows}
                getGridControlId={this.getGridControlId}
                id={this.props.id}
                key={'teammanagementcontainer_key_' + this.props.id}
                selectedLanguage={this.props.selectedLanguage}
                teamManagementTab={this.props.teamManagementTab}
                onSortClick={this.onSortClick}
                renderedOn={this.state.renderedOn}
            />
        </div>);

        return grid;
    };

    /**
     *  Get grid rows and associated table rows ans ets associated local variables
     */
    private setRowDefinitionCollections(teamManagementTab: enums.TeamManagement) {
        if (!this.comparerName) {
            this.setDefaultComparer(teamManagementTab);
        }

        // if the direction is descending the text 'Desc' is appending to the comparer name since all
        // descending comparere has the same name followed by text 'Desc'
        let comparerName: string = (this.sortDirection === enums.SortDirection.Ascending) ? this.comparerName : this.comparerName + 'Desc';

        let tabData: any;
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
                let sortedHelpExaminersData = this.helpExaminerData;
                if (this.helpExaminerData && this.helpExaminerData.size > 0) {
                    sortedHelpExaminersData = Immutable.List<ExaminerDataForHelpExaminer>(sortHelper.sort(this.helpExaminerData.toArray(),
                        comparerList[comparerName]));
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
    }

    /**
     * returns the header element of Team Management tab.
     */
    private getTeamManagementTabHeader = (): JSX.Element => {
        let headingText: string;
        switch (this.props.teamManagementTab) {
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

        let element: JSX.Element = (<h3 className='shift-left page-title'>{headingText}</h3>);
        return element;
    };

    /**
     * Decide which screen to load based on the left side selected link
     */
    private loadTeamManagementScreen = (): JSX.Element => {
        //Sets the local variables with row data collection
        this.setRowDefinitionCollections(this.props.teamManagementTab);

        let result: JSX.Element;
        let grid = this.getTeamManagementTabComponent(this.props.teamManagementTab);

        /* Multi QIG Dropdown is visible only if the selected tab is help examiner and
           SEPQuestionPaperManagement CC is enabled for the QP and
           the selected QP is a Multi QIG*/
        let multiQigDropDown: JSX.Element = null;
        let multiQigLockPopup: JSX.Element = null;
        let multiQigLockResultPopup: JSX.Element = null;
        let multiQigData: any = teamManagementStore.instance.teamOverviewCountData ?
            teamManagementStore.instance.teamOverviewCountData.qigDetails : undefined;

        if (multiQigData && multiQigData.length > 0) {
            // Filter multiQigData based on the senior examiner approval status is Approved.
            multiQigData = multiQigData.filter((x: qigDetails) =>
                x.approvalStatusId === enums.ExaminerApproval.Approved);
        }

        if (this.props.teamManagementTab === enums.TeamManagement.HelpExaminers
            && ccValues.sepQuestionPaperManagement && (multiQigData && multiQigData.length > 1)) {
            multiQigData = Immutable.List<qigDetails>(
                sortHelper.sort(multiQigData, comparerList.MultiQigListComparer));
            multiQigDropDown = (<MultiQigDropDown
                selectedLanguage={localeStore.instance.Locale}
                id='multiQigDropDown'
                key='multiQigDropDown_key'
                multiQigItemList = {multiQigData}
            />);

            multiQigLockPopup = (<MultiQigLockPopup
                id='multiQigLockPopup'
                key='multiQigLockPopup_key'
                selectedLanguage={localeStore.instance.Locale}
            />);

            multiQigLockResultPopup = (<MultiQigLockResultPopup
                id='multiQigLockResultPopup'
                key='multiQigLockResultPopup_key'
                selectedLanguage={localeStore.instance.Locale}/>);
        }

        result = (
            <div className='grid-holder grid-view'>
                {multiQigDropDown}
                {multiQigLockPopup}
                {multiQigLockResultPopup}
                {grid}
            </div>
        );

        return result;
    };

    /**
     * Set the loading indicator
     */
    private setLoadingindicator() {
        this.loading = <LoadingIndicator id='loading' key='loading'
            selectedLanguage={localeStore.instance.Locale}
            isOnline={applicationStore.instance.isOnline}
            cssClass='section-loader loading' />;
    }

    /**
     * Rerender the grid while expand or collapse a particular node
     */
    private onCollapseOrExpandExaminerNode = () => {
        this.setState({ renderedOn: Date.now() });
    };

    /**
     * Drill-Down examiner worklist details
     */
    private onExaminerDrillDown = (markSchemeGroupId: number, isFromHistory: boolean) => {
        if (isFromHistory) {
            return;
        }
        navigationHelper.loadWorklist();
    };

    /**
     * SEP Action return callback.
     */
    private onApprovalManagementActionExecuted = (actionIdentifier: number,
        sepApprovalManagementActionResults: Immutable.List<DoSEPApprovalManagementActionResult>) => {
        // if examiner got UnLocked without error, Refresh UI without changing the sort order. Actions, lock columns should update
        let sepApprovalManagementActionResult: DoSEPApprovalManagementActionResult;
        sepApprovalManagementActionResult = sepApprovalManagementActionResults.first();
        if (sepApprovalManagementActionResult.success &&
            sepApprovalManagementActionResult.failureCode === enums.SEPActionFailureCode.None &&
            actionIdentifier === enums.SEPAction.Unlock) {
            this.helpExaminerData.forEach((x) => {
                if (x.examinerId === sepApprovalManagementActionResult.examiner.examinerId) {
                    x.locked = false;
                    x.lockedByExaminerId = 0;
                    x.actions = sepApprovalManagementActionResult.examiner.actions;
                    this.setState({ renderedOn: Date.now() });
                    return;
                }
            });
        }
    };

    /**
     * Get selected exception.
     */
    private getSelectedException = () => {
        if (teamManagementStore.instance.selectedException &&
            qigStore.instance.selectedQIGForMarkerOperation) {

            this.setBusyIndicatorProperties(enums.BusyIndicatorInvoker.loadingResponse, false);
            this.setState({ isBusy: true });

            let selectedException: UnActionedExceptionDetails = teamManagementStore.instance.selectedException;
            let markSchemeGroupId = qigStore.instance.selectedQIGForMarkerOperation.markSchemeGroupId;
            let questionPaperPartId = qigStore.instance.selectedQIGForMarkerOperation.questionPaperPartId;
            let isElectronicStandardisationTeamMember =
                qigStore.instance.selectedQIGForMarkerOperation.isElectronicStandardisationTeamMember;

            let remarkRequestTypeID: enums.RemarkRequestType;
            let isDirectRemark: boolean;

            isDirectRemark = selectedException.directed;
            remarkRequestTypeID = selectedException.remarkRequestTypeId;
            let responseMode = this.getResponseMode();
            let workListType = this.getWorklistType();

            // load worklist.
            worklistActioncreator.notifyWorklistTypeChange
                (markSchemeGroupId,
                selectedException.originatorExaminerRoleId,
                questionPaperPartId,
                workListType,
                responseMode,
                remarkRequestTypeID,
                isDirectRemark,
                isElectronicStandardisationTeamMember,
                false);
        }
    };

    /**
     * Worklist data callback event.
     */
    private markingModeChanged = (markSchemeGroupId: number, questionPaperPartId: number): void => {
        if (!responseStore.instance.isSearchResponse) {
            if (teamManagementStore && !teamManagementStore.instance.isRedirectFromException) {
                return;
            }

            responseSearchHelper.openQIGDetails(
                qigStore.instance.selectedQIGForMarkerOperation.questionPaperPartId,
                qigStore.instance.selectedQIGForMarkerOperation.markSchemeGroupId,
                qigStore.instance.selectedQIGForMarkerOperation.examinerRoleId,
                false,
                qigStore.instance.selectedQIGForMarkerOperation.examinerApprovalStatus,
                qigStore.instance.selectedQIGForMarkerOperation.markingMethod,
                false,
                qigStore.instance.selectedQIGForMarkerOperation.isElectronicStandardisationTeamMember);
        } else {
            responseSearchHelper.onWorkListSelected(markSchemeGroupId, questionPaperPartId);
        }
    };

    /**
     * Marker information received call back.
     */
    private markerInformationReceived = (): void => {
        if (teamManagementStore && !teamManagementStore.instance.isRedirectFromException) {
            return;
        }

        worklistStore.instance.setCandidateScriptInfoCollection = scriptImageDownloadHelper.constructCandidateScriptInfo(
            worklistStore.instance.getCurrentWorklistResponseBaseDetails().toArray()
        );

        // initial call for fetching candidate script meta data.
        let markSchemeGroupId = qigStore.instance.selectedQIGForMarkerOperation.markSchemeGroupId;
        let questionPaperPartId = qigStore.instance.selectedQIGForMarkerOperation.questionPaperPartId;

        let isMarkByQuestionModeSet: boolean = userOptionsHelper.getUserOptionByName(useroptionKeys.IS_MBQ_SELECTED,
            qigStore.instance.getSelectedQIGForTheLoggedInUser.examinerRoleId) === 'true';

        let eBookMarkingCCValue = configurableCharacteristicsHelper.getCharacteristicValue(
            configurableCharacteristicsNames.eBookmarking).toLowerCase() ? true : false;

        let candidateScriptMetadataPromise = scriptActionCreator.fetchCandidateScriptMetadata(
            worklistStore.instance.getCandidateScriptInfoCollection,
            questionPaperPartId,
            markSchemeGroupId,
            !isMarkByQuestionModeSet,
            false, // TODO: pass includeRelatedQigs value as true, if anyone of the candidate script is whole response.
            false,
            eCourseworkHelper ? eCourseworkHelper.isECourseworkComponent : false,
            eBookMarkingCCValue,
            enums.StandardisationSetup.None,
            false,
            false,
            qigStore.instance.selectedQIGForMarkerOperation.markingMethod === enums.MarkingMethod.MarkFromObject
        );
    };

    /**
     * Candidate response meta data received callback event.
     */
    private onCandidateResponseMetadataRetrieved = (isAutoRefresh: boolean): void => {
        if (!responseStore.instance.isSearchResponse) {
            if (teamManagementStore && !teamManagementStore.instance.isRedirectFromException) {
                return;
            }

            if (scriptStore.instance.getCandidateResponseMetadata !== undefined) {
                //load stamps defined for the selected mark scheme groupId
                stampActionCreator.getStampData(qigStore.instance.selectedQIGForMarkerOperation.markSchemeGroupId,
                    stampStore.instance.stampIdsForSelectedQIG,
                    qigStore.instance.selectedQIGForMarkerOperation.markingMethod,
                    responseHelper.isEbookMarking,
                    true);
            }
        } else {
            responseSearchHelper.openResponse();
        }
    };

    /**
     * Stamp data received callback event.
     */
    private onStampDataRetrieved = (): void => {
        if (teamManagementStore && !teamManagementStore.instance.isRedirectFromException) {
            return;
        }

        let selectedException: UnActionedExceptionDetails = teamManagementStore.instance.selectedException;
        let displayId = '6' + selectedException.displayId;
		let responseMode = this.getResponseMode();
        let isWholeResponse: boolean = this.isWholeResponse(parseInt(displayId));
        let responseDetails: ResponseBase = worklistStore.instance.getResponseDetails(displayId.toString());
            responseActionCreator.openResponse(parseInt(displayId),
                enums.ResponseNavigation.specific,
                responseMode,
                selectedException.markGroupId,
                enums.ResponseViewMode.zoneView,
                enums.TriggerPoint.WorkListResponseExceptionIcon,
                enums.SampleReviewComment.None,
                0,
				isWholeResponse,
                false,
                responseDetails.candidateScriptId,
                false,
                operationModeHelper.examinerRoleId,
                false);
    };

	/**
	 * returns true if selected response is Whole Response
	 */
	private isWholeResponse(displayId: number): boolean {
		// get the response data
		let responseData = undefined;
		if (displayId) {
			responseData = worklistStore.instance.getResponseDetails(displayId.toString());
			return responseData.isWholeResponse;
		}
		return false;
	}

    /**
     * Open response call back event.
     */
    private openResponse = (): void => {
        if (!responseStore.instance.isSearchResponse) {
            if (teamManagementStore && !teamManagementStore.instance.isRedirectFromException) {
                return;
            }

            let selectedException: UnActionedExceptionDetails = teamManagementStore.instance.selectedException;
            let displayId = '6' + selectedException.displayId;
            let markingMode = worklistStore.instance.getMarkingModeByWorkListType
                (worklistStore.instance.currentWorklistType);
            eCourseworkHelper.fetchECourseWorkCandidateScriptMetadata(parseInt(displayId));
            markSchemeHelper.getMarks(parseInt(displayId), markingMode);
        } else {
            navigationHelper.loadResponsePage();
        }
    };

    /**
     * Marks retrieval event.
     */
    private marksRetrieved = (): void => {
        if (teamManagementStore && !teamManagementStore.instance.isRedirectFromException) {
            return;
        }

        navigationHelper.loadResponsePage();
    };

    /**
     * Method which sets the busy indicator properties
     * @param busyIndicatorInvoker
     * @param showBackgroundScreenOnBusy
     */
    private setBusyIndicatorProperties(busyIndicatorInvoker: enums.BusyIndicatorInvoker,
        showBackgroundScreenOnBusy: boolean) {
        this.busyIndicatorInvoker = busyIndicatorInvoker;
        this.showBackgroundScreenOnBusy = showBackgroundScreenOnBusy;
    }

    /**
     * Method to get the response mode.
     */
    private getResponseMode() {
        let selectedException: UnActionedExceptionDetails = teamManagementStore.instance.selectedException;
        if (selectedException) {
            let responseMode: enums.ResponseMode;
            if (selectedException.markGroupStatusId === 91) {
                responseMode = enums.ResponseMode.pending;
            } else if (selectedException.markGroupStatusId < 91) {
                responseMode = enums.ResponseMode.open;
            } else if (selectedException.markGroupStatusId > 91) {
                responseMode = enums.ResponseMode.closed;
            }

            return responseMode;
        }
    }

    /**
     * Method to get the response mode.
     */
    private getWorklistType() {
        let selectedException: UnActionedExceptionDetails = teamManagementStore.instance.selectedException;
        if (selectedException) {
            let workListType: enums.WorklistType;
            if (selectedException.remarkRequestTypeId !== enums.RemarkRequestType.Unknown &&
                selectedException.pooled && !selectedException.directed) {
                workListType = enums.WorklistType.pooledRemark;
            } else if (selectedException.remarkRequestTypeId !== enums.RemarkRequestType.Unknown &&
                !selectedException.pooled && selectedException.directed) {
                workListType = enums.WorklistType.directedRemark;
            } else if (selectedException.atypicalStatusId !== 0) {
                workListType = enums.WorklistType.atypical;
            } else if (!selectedException.directed && !selectedException.pooled) {
                workListType = enums.WorklistType.live;
            }
            return workListType;
        }
    }

    /**
     * Set the comparer for the current worklist based on the worklisttype,qigId and responseMode
     */
    private setDefaultComparer(teamManagementTab: enums.TeamManagement) {

        if (this.comparerName === undefined && this.sortDirection === undefined) {
            let defaultSortDetails: Array<TeamManagementSortDetails> = teamManagementStore.instance.sortDetails;
            let entry: Array<TeamManagementSortDetails> = defaultSortDetails.filter((x: TeamManagementSortDetails) =>
                x.qig === teamManagementStore.instance.selectedMarkSchemeGroupId && x.tab === teamManagementTab);

            if (entry.length > 0) {
                this.comparerName = comparerList[entry[0].comparerName];
                this.sortDirection = entry[0].sortDirection;
            } else {
                this.setDefaultSortDetails();
                // update the default sort order in store
                this.updateSortDetails();
            }
        }
    }

    /**
     * Call back function from table wrapper on sorting
     */
    private onSortClick = (comparerName: string, sortDirection: enums.SortDirection) => {
        this.sortDirection = sortDirection;
        this.comparerName = comparerName;
        // update sort details in store
        this.updateSortDetails();
        this.setState({
            renderedOn: Date.now()
        });
    }

    /**
     * This method will set the default sort details
     */
    private setDefaultSortDetails = () => {
        let defaultSortDetails =
            teamManagementStore.instance.getDefaultSortDetails(teamManagementStore.instance.selectedTeamManagementTab);
        this.comparerName = comparerList[defaultSortDetails.compareName];
        this.sortDirection = defaultSortDetails.sortDirection;
    }

    /**
     * Update sort details in store
     */
    private updateSortDetails = () => {
        let sortDetails: TeamManagementSortDetails = {
            qig: teamManagementStore.instance.selectedMarkSchemeGroupId,
            tab: this.props.teamManagementTab,
            comparerName: comparerList[this.comparerName],
            sortDirection: this.sortDirection
        };

        teamManagementActionCreator.onSortClick(sortDetails);
    }

    /**
     * This method will reset sort informations
     */
    private resetSortInfo = () => {
        this.comparerName = undefined;
        this.sortDirection = undefined;
    }

    /**
     * Method to open exception if the examiner is valid.
     */
    private validateExaminerStatus = (exceptionId: number) => {
        teamManagementActionCreator.selectedException(exceptionId);
    };

    /**
     * This method will call on multi lock data load
     */
    private onMultiLockDataLoad = (selectedExaminerId: number, selectedQigId: number, selectedExaminerRoleId: number) => {
        if (!teamManagementStore.instance.multiLockDataList ||
            teamManagementStore.instance.multiLockDataList.count() === 0) {
            this.refreshHelpExaminerData(selectedExaminerId, selectedExaminerRoleId);
        }
        busyIndicatorActionCreator.setBusyIndicatorInvoker(enums.BusyIndicatorInvoker.none);
        this.setState({
            isBusy: false
        });
    };

    /**
     * This method is used to refresh the help examiner data after lock action completed and navigate to help examiner work list
     */
    private refreshHelpExaminerData(selectedExaminerId: number, selectedExaminerRoleId: number) {
        // Invoke help examiner data retrieve action for getting refreshed data and update the store.
        teamManagementActionCreator.GetHelpExminersData(teamManagementStore.instance.selectedExaminerRoleId,
            teamManagementStore.instance.selectedMarkSchemeGroupId, !teamManagementStore.instance.isHelpExaminersDataChanged);

        let examinerDrillDownData: ExaminerDrillDownData = {
            examinerId: selectedExaminerId,
            examinerRoleId: selectedExaminerRoleId
        };

        // Update examiner data and navigate to help examiner's worklist for further processing.
        teamManagementActionCreator.updateExaminerDrillDownData(examinerDrillDownData);
    }

    /**
     * This method will call on multi lock result received
     */
    private onMultiLockResultReceived = () => {
        busyIndicatorActionCreator.setBusyIndicatorInvoker(enums.BusyIndicatorInvoker.none);
    };
}

export = TeamManagementContainer;