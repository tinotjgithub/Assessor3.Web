/* tslint:disable:no-unused-variable */
import React = require('react');
/* tslint:enable:no-unused-variable */
import pureRenderComponent = require('../base/purerendercomponent');
import Immutable = require('immutable');
import markingTarget = require('../../stores/qigselector/typings/markingtarget');
import qigInfo = require('../../stores/qigselector/typings/qigsummary');
import qigActionCreator = require('../../actions/qigselector/qigselectoractioncreator');
import qigStore = require('../../stores/qigselector/qigstore');
import localeStore = require('../../stores/locale/localestore');
import useroptionStore = require('../../stores/useroption/useroptionstore');
import stringFormatHelper = require('../../utility/stringformat/stringformathelper');
import worklistActionCreator = require('../../actions/worklist/worklistactioncreator');
import enums = require('../utility/enums');
import VisualQigGroup = require('./visualqiggroup');
import ccStore = require('../../stores/configurablecharacteristics/configurablecharacteristicsstore');
import markSchemeStructureStore = require('../../stores/markschemestructure/markschemestructurestore');
import workListStore = require('../../stores/worklist/workliststore');
import keyCodes = require('../../utility/keyboardacess/keycodes');
import allocateResponseHelper = require('../utility/responseallocation/allocateresponseshelper');
import targetSummaryStore = require('../../stores/worklist/targetsummarystore');
import targetHelper = require('../../utility/target/targethelper');
import stampActionCreator = require('../../actions/stamp/stampactioncreator');
import stampStore = require('../../stores/stamp/stampstore');
import dataServiceHelper = require('../../utility/generic/dataservicehelper');
import markingStore = require('../../stores/marking/markingstore');
import messageStore = require('../../stores/message/messagestore');
import messagingActionCreator = require('../../actions/messaging/messagingactioncreator');
import markingTargetSummary = require('../../stores/worklist/typings/markingtargetsummary');
import responseSearchHelper = require('../../utility/responsesearch/responsesearchhelper');
import LoadingIndicator = require('../utility/loadingindicator/loadingindicator');
import teamManagementStore = require('../../stores/teammanagement/teammanagementstore');
import navigationHelper = require('../utility/navigation/navigationhelper');
import examinerStore = require('../../stores/markerinformation/examinerstore');
import markerOperationModeFactory = require('../utility/markeroperationmode/markeroperationmodefactory');
import loginStore = require('../../stores/login/loginstore');
import qigInformation = require('../../stores/qigselector/typings/qigsummary');
import workListDataHelper = require('../../utility/worklist/worklistdatahelper');
import configurableCharacteristicsActionCreator =
require('../../actions/configurablecharacteristics/configurablecharacteristicsactioncreator');
import navigationStore = require('../../stores/navigation/navigationstore');
import userinfoStore = require('../../stores/userinfo/userinfostore');
import storageAdapterHelper = require('../../dataservices/storageadapters/storageadapterhelper');
import ccActionCreator = require('../../actions/configurablecharacteristics/configurablecharacteristicsactioncreator');
import userInfoActionCreator = require('../../actions/userinfo/userinfoactioncreator');
import teamManagementActionCreator = require('../../actions/teammanagement/teammanagementactioncreator');
import userOptionActionCreator = require('../../actions/useroption/useroptionactioncreator');
import Promise = require('es6-promise');
import historyItem = require('../../utility/breadcrumb/historyItem');
import rememberQig = require('../../stores/useroption/typings/rememberqig');
import simulationModeHelper = require('../../utility/simulation/simulationmodehelper');
import locksInQigDetailsList = require('../../stores/qigselector/typings/locksinqigdetailslist');
import storageAdapterFactory = require('../../dataservices/storageadapters/storageadapterfactory');
import qigDetails = require('../../dataservices/teammanagement/typings/qigdetails');
import responseHelper = require('../utility/responsehelper/responsehelper');
import auditLoggingHelper = require('../utility/auditlogger/auditlogginghelper');
import qigSelectorActionCreator = require('../../actions/qigselector/qigselectoractioncreator');
import standardisationSetupCCData = require('../../stores/standardisationsetup/typings/standardisationsetupccdata');
let classNames = require('classnames');

/* tslint:disable:no-empty-interfaces */
/**
 * Properties of a component
 */
interface Props extends LocaleSelectionBase {
    isInTeamManagement?: boolean;
    containerPage?: enums.PageContainers;
    isNavigatedAfterFromLogin?: boolean;
}
/* tslint:disable:no-empty-interfaces */

/**
 * State of a component
 */
interface State {
    isOpen?: boolean;
    isLoadingIndicatorShown?: boolean;
    renderedOn?: number;
    shouldRender?: boolean;
    doNeedAnimationOnExpandOrCollapse?: boolean;
}

/* tslint:disable:variable-name */
const NoQIGsAvailableMessage = (props: Props) => {

    return (
        <div className='no-qig-holder'>
            <div className='sprite-icon qig-icon-big'>icon</div>
            <div className='no-qig-message'><h4>
                {localeStore.instance.TranslateText('home.home-page.no-qigs-available-to-mark-placeholder')}
            </h4></div>
        </div>
    );
};

class QigSelector extends pureRenderComponent<Props, State> {
    /** variable to identify whether the mark scheme structure is loaded or not */
    private isMarkSchemeStructureLoaded: boolean = false;
    /** variable to identify whether the mark scheme CC is loaded or not */
    private isMarkSchemeCCLoaded: boolean = false;
    /** variable to store the navigation arguments needed from message panel */
    private messageNavigationArguments: MessageNavigationArguments;
    /** variable to store the marker target details */
    private markingTargetsSummary: Immutable.List<markingTargetSummary>;
    /** variable to know whether worklist icons are displayed */
    private worklistHeaderIconsDisplayed: boolean = false;
    /** variable to identify whether the QIG is selected or not */
    private isQIGSelected: boolean = false;

    private storageAdapterHelper = new storageAdapterHelper();

    private isQIGSelectedFromUserOption: boolean = false;
    private isExaminerHasStuckData: boolean = false;

    private _rememberQigInfo: rememberQig;

    private isQIGSelectedFromLockedList: boolean = false;

    /**
     * @constructor
     */
    constructor(props: Props, state: State) {
        super(props, state);

        let _isOpen: boolean = true;
        if (this.props.isInTeamManagement) {
            _isOpen = false;
        }

        // Setting the initial state
        this.state = {
            isOpen: _isOpen,
            isLoadingIndicatorShown: true,
            renderedOn: null,
            shouldRender: true,
            doNeedAnimationOnExpandOrCollapse: false
        };

        this.onQIGSelectorClick = this.onQIGSelectorClick.bind(this);
        this.setAnimationOnQigGroupExpandOrCollapse = this.setAnimationOnQigGroupExpandOrCollapse.bind(this);

        if (!this.props.isNavigatedAfterFromLogin && qigStore.instance.hasAnySimulationQigs) {
            qigActionCreator.getSimulationModeExitedQigs(true);
        }
    }

    /**
     * What happens when the component mounts
     */
    public componentDidMount() {
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
        ccStore.instance.addListener(ccStore.ConfigurableCharacteristicsStore.MARKSCHEME_GROUP_CC_GET,
            this.fetchRelatedDataForTheQIGAfterCC);
        markSchemeStructureStore.instance.addListener
            (markSchemeStructureStore.MarkSchemeStructureStore.MARK_SCHEME_STRUCTURE_LOADED_EVENT,
            this.fetchRelatedDataForTheQIGAfterMarkSchemeStructure);
        targetSummaryStore.instance.addListener
            (targetSummaryStore.TargetSummaryStore.WORKLIST_INITIALISATION_COMPLETED,
            this.worklistInitialisationCompleted);
        messageStore.instance.addListener(messageStore.MessageStore.MESSAGE_NAVIGATION_EVENT, this.onMessageNavigation);
        teamManagementStore.instance.addListener(teamManagementStore.TeamManagementStore.EXAMINER_VALIDATED_EVENT, this.onExaminerValidate);
        teamManagementStore.instance.addListener(teamManagementStore.TeamManagementStore.TEAM_OVERVIEW_DATA_RECEIVED_REMEMBER_QIG_EVENT,
            this.onTeamOverViewDataReceived);
        teamManagementStore.instance.addListener(
            teamManagementStore.TeamManagementStore.
                FAILURE_WHILE_FETCHING_TEAM_DATA_ON_REMEMBER_QIG_EVENT,
            this.onGettingErrorCodeRetrived);
        qigStore.instance.addListener(qigStore.QigStore.SIMULATION_EXITED_QIGS_RETRIEVED, this.onSimulationExitedQigsRecieved);
        qigStore.instance.addListener(qigStore.QigStore.SIMULATION_EXITED_QIGS_AND_LOCKS_IN_QIGS_RETRIEVED,
            this.onSimulationExitedQigsAndLocksInQigsRecieved);
        qigStore.instance.addListener(qigStore.QigStore.SIMULATION_TARGET_COMPLETED, this.onSimulationTargetCompletion);
    }

    /**
     * What happens when the component unmounts
     */
    public componentWillUnmount() {
        qigStore.instance.removeListener(qigStore.QigStore.QIG_LIST_LOADED_EVENT, this.onQIGSelectorDataLoaded);
        qigStore.instance.removeListener(qigStore.QigStore.QIG_SELECTED_EVENT, this.onQIGSelected);
        qigStore.instance.removeListener(qigStore.QigStore.NAVIGATE_TO_WORKLIST_FROM_QIG_SELECTOR_EVENT, this.navigateToWorklist);
        useroptionStore.instance.removeListener(useroptionStore.UseroptionStore.USER_OPTION_GET_EVENT, this.onUserOptionsLoaded);
        ccStore.instance.removeListener(ccStore.ConfigurableCharacteristicsStore.MARKSCHEME_GROUP_CC_GET,
            this.fetchRelatedDataForTheQIGAfterCC);
        markSchemeStructureStore.instance.removeListener
            (markSchemeStructureStore.MarkSchemeStructureStore.MARK_SCHEME_STRUCTURE_LOADED_EVENT,
            this.fetchRelatedDataForTheQIGAfterMarkSchemeStructure);
        targetSummaryStore.instance.removeListener
            (targetSummaryStore.TargetSummaryStore.WORKLIST_INITIALISATION_COMPLETED,
            this.worklistInitialisationCompleted);
        ccStore.instance.removeListener(ccStore.ConfigurableCharacteristicsStore.EXAM_BODY_CC_GET,
            this.onExamBodyCCLoaded);
        messageStore.instance.removeListener(messageStore.MessageStore.MESSAGE_NAVIGATION_EVENT, this.onMessageNavigation);
        teamManagementStore.instance.removeListener(
            teamManagementStore.TeamManagementStore.EXAMINER_VALIDATED_EVENT,
            this.onExaminerValidate);
        teamManagementStore.instance.removeListener(teamManagementStore.TeamManagementStore.TEAM_OVERVIEW_DATA_RECEIVED_REMEMBER_QIG_EVENT,
            this.onTeamOverViewDataReceived);
        teamManagementStore.instance.removeListener(
            teamManagementStore.TeamManagementStore.
                FAILURE_WHILE_FETCHING_TEAM_DATA_ON_REMEMBER_QIG_EVENT,
            this.onGettingErrorCodeRetrived);
        qigStore.instance.removeListener(qigStore.QigStore.SIMULATION_EXITED_QIGS_RETRIEVED, this.onSimulationExitedQigsRecieved);
        qigStore.instance.removeListener(qigStore.QigStore.SIMULATION_EXITED_QIGS_AND_LOCKS_IN_QIGS_RETRIEVED,
            this.onSimulationExitedQigsAndLocksInQigsRecieved);
        qigStore.instance.removeListener(qigStore.QigStore.SIMULATION_TARGET_COMPLETED, this.onSimulationTargetCompletion);
    }

    /**
     * Error code retrieved on qig data fetch
     */
    private onGettingErrorCodeRetrived = (failureCode: enums.FailureCode,
        markSchemeGroupId: number = 0) => {
        if (markerOperationModeFactory.operationMode.selectedQIGFromUserOption &&
            markerOperationModeFactory.operationMode.selectedQIGFromUserOption.area === enums.QigArea.TeamManagement) {
            switch (failureCode) {
                case enums.FailureCode.SubordinateExaminerWithdrawn:
                case enums.FailureCode.HierarchyChanged:
                    let changeOperationModePromise = userInfoActionCreator.changeOperationMode(
                        enums.MarkerOperationMode.TeamManagement);
                    this._rememberQigInfo.subordinateExaminerID = undefined;
                    this._rememberQigInfo.subordinateExaminerRoleID = undefined;

                    let that = this;
                    Promise.Promise.all(
                        [
                            changeOperationModePromise
                        ]).
                        then(function (result: any) {
                            that.getQigData(markerOperationModeFactory.operationMode.selectedQIGFromUserOption.qigId, true);
                        });
                    break;
                case enums.FailureCode.NotPEOrAPE:
                case enums.FailureCode.NotTeamLead:
                case enums.FailureCode.Withdrawn:
                    this._rememberQigInfo.subordinateExaminerID = undefined;
                    this._rememberQigInfo.subordinateExaminerRoleID = undefined;
                    this.isQIGSelectedFromUserOption = false;
                    this.getQigData(0);
                    break;
            }
        }
    }

    /**
     * Render method for Qig selector component.
     */
    public render() {
        let hasQIGsAvailable: boolean = this.hasQIGsAvailable();

        let renderQigs: JSX.Element = null;
        if (this.state.isOpen) {
            let qigList: JSX.Element;

            if (hasQIGsAvailable === false) {
                qigList = <NoQIGsAvailableMessage />;
            } else {
                qigList = (<div className='menu-wrapper padding-bottom-30'>
                    <div className='menu-header padding-top-10 padding-bottom-10 clearfix'></div>
                    {this.renderComponentGroups()}
                </div>
                );
            }

            renderQigs = (
                <div className='menu qig-menu' id='qig-list' aria-hidden='true'>
                    {qigList}
                </div>
            );
        }

        return (
            <div className='content-wrapper'>
                <div className=
                    {classNames('qig-content-holder', { 'no-panel-animation': !this.state.doNeedAnimationOnExpandOrCollapse })}>
                    {renderQigs}
                </div>
            </div>
        );

    }

    /**
     * Render the Component Groups
     */
    private renderComponentGroups() {
        if (this.state.isLoadingIndicatorShown || !this.state.shouldRender) {
            return (
                <LoadingIndicator id='loading' key='loading' cssClass='qig-loader loading' />
            );
        } else if (this.state.isOpen) {

            let groupedQigs = qigStore.instance.getQigsGroupedBy(enums.GroupByField.questionPaper,
                markerOperationModeFactory.operationMode.isSelectedExaminerSTM);

            let groupedKeys = groupedQigs.keySeq();

            // index variable for id
            let groupIndex = 0;

            let qigs: qigInformation[];

            // Loop through the keys and find the list of QIGS for the group.
            let toRender = groupedKeys.map((key: string) => {
                groupIndex++;

                // Get the QIgs for the group.
                let currentQigGroup = groupedQigs.get(key);

                // Clear the collection, In each group.
                qigs = [];

                // Get the each QIG for the group.
                currentQigGroup.map((qigItem: qigInformation) => {
                    qigs.push(qigItem);
                });
                // Get the visible Grouped Section with QIGs
                return (<VisualQigGroup selectedLanguage={this.props.selectedLanguage}
                    qigs={qigs}
                    containerPage={this.props.containerPage}
                    key={'key_VisualQigGroup_' + groupIndex.toString()}
                    setAnimationOnQigGroupExpandOrCollapse={this.setAnimationOnQigGroupExpandOrCollapse}>
                </VisualQigGroup>);
            });

            // Render the Grouped items.
            return (
                <div key='selected_qig-item' className='header-menu-item qig-item-holder' id='selected_qig-item'>
                    {toRender}
                </div>);
        }
    }

    /**
     * Checks whether the marker has QIGs available in list
     * @returns whether there are QIGs available to the marker
     */
    private hasQIGsAvailable(): boolean {
        return qigStore.instance.getOverviewData ?
            qigStore.instance.getOverviewData.qigSummary.
                filter(q => !qigStore.instance.isQIGHidden(q.markSchemeGroupId)).count() > 0 : undefined;
    }

    /**
     * Method which fetches the QIG data
     * @param qigId
     */
    private getQigData(qigId: number = 0, isForLoggedInExaminer: boolean = false) {
        if (loginStore.instance.isAdminRemarker) {
            // Invoking the action creator to retrieve the Admin remarkers QIG details.
            qigActionCreator.getAdminRemarkerQIGSelectorData();
        } else {
            // Invoking the action creator to retrieve the QIG list for the QIG Selector
            qigActionCreator.getQIGSelectorData(qigId, isForLoggedInExaminer);
        }
    }

    /**
     * User option get event listener
     */
    private onUserOptionsLoaded = (): void => {
        if (this.props.containerPage === enums.PageContainers.QigSelector) {
            if (navigationStore.instance.previousPage) {
                this.getQigData(0, true);
            } else if (!simulationModeHelper.isSimulationExitedQigDataAvailable &&
                !simulationModeHelper.isLockInQigsDataAvailable){
                this.navigateWithRememberQigData();
            }
        }
    };

    /**
     * Navigate to corresponding page with respect to the remember qig data
     */
    private navigateWithRememberQigData() {
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
            } else {
                /* Load the unread mandatory message status for displaying mandatory messages if no remember qig*/
                messagingActionCreator.getUnreadMandatoryMessageStatus(enums.TriggerPoint.QigSelector);
                this.getQigData(0, true);
            }
        }
    }
    /**
     * Get the Overview Count
     */
    private getTeamManagementOverviewCounts() {
        teamManagementActionCreator.getTeamManagementOverviewCounts(this._rememberQigInfo.examinerRoleId,
            this._rememberQigInfo.qigId, false, true);
    }

    /**
     * on Team OverView Data Received
     */
    private onTeamOverViewDataReceived = (): void => {

        let qigDetails = teamManagementStore.instance.getSelectedQig;
        if (qigDetails && qigDetails.examinerStuckCount === 0) {
            this.isExaminerHasStuckData = false;

            // validates the examiner
            teamManagementActionCreator.teamManagementExaminerValidation(
                this._rememberQigInfo.qigId,
                this._rememberQigInfo.examinerRoleId,
                this._rememberQigInfo.subordinateExaminerRoleID,
                this._rememberQigInfo.subordinateExaminerID,
                enums.ExaminerValidationArea.MyTeam,
                true);
        } else {
            this.isExaminerHasStuckData = true;
            let that = this;
            let changeOperationModePromise = userInfoActionCreator.changeOperationMode(
                enums.MarkerOperationMode.TeamManagement);
            Promise.Promise.all(
                [
                    changeOperationModePromise
                ]).
                then(function (result: any) {
                    that.getQigData(that._rememberQigInfo.qigId, true);
                });
        }
        this.isQIGSelectedFromUserOption = true;
    };
    /**
     * On examiner validated
     */
    private onExaminerValidate = (): void => {
        if (this._rememberQigInfo) {
            let changeOperationModePromise = userInfoActionCreator.changeOperationMode(
                enums.MarkerOperationMode.TeamManagement);

            if (this._rememberQigInfo.subordinateExaminerRoleID > 0) {

                let examinerDrillDownData: ExaminerDrillDownData = {
                    examinerId: this._rememberQigInfo.subordinateExaminerID,
                    examinerRoleId: this._rememberQigInfo.subordinateExaminerRoleID
                };
                let updateExaminerDrillDownDataPromise = teamManagementActionCreator.updateExaminerDrillDownData(
                    examinerDrillDownData,
                    true);

                let that = this;

                Promise.Promise.all(
                    [
                        changeOperationModePromise,
                        updateExaminerDrillDownDataPromise
                    ]).
                    then(function (result: any) {
                        that.getQigData(that._rememberQigInfo.qigId, true);
                    });
            } else {
                let that = this;

                Promise.Promise.all(
                    [
                        changeOperationModePromise
                    ]).
                    then(function (result: any) {
                        that.getQigData(that._rememberQigInfo.qigId, true);
                    });
            }
            this.isQIGSelectedFromUserOption = true;
        }
    }

    /**
     * Method which handles the click event on the QIG Selector drop down
     */
    private onQIGSelectorClick(keyEvent: any) {
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
            } else {
                // If the QIG selector drop down is already open, then refresh the QIG Selector to just close it on clicking the drop down
                this.refreshQIGSelectorDropdown(Date.now(), false, false);
            }
            // if message panel is active call the action to navigate from message panel
        } else {
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
    }

    /**
     * Updates the data once the event is fired.
     */
    private onQIGSelectorDataLoaded = (): void => {
        // If the QIG Selector data is loaded, refresh the QIG Selector drop down to open the list
        if (qigStore.instance.isQIGCollectionLoaded) {
            this.refreshQIGSelectorDropdown(Date.now(), true, false, this.state.shouldRender);
            // If QIGs are not available we don't need to show the header icons
            if (this.worklistHeaderIconsDisplayed === false && this.hasQIGsAvailable() === true) {
                qigActionCreator.showHeaderIconsOnQIGsAvailable(true);
                this.worklistHeaderIconsDisplayed = true;
            }
        }
    };

    /**
     * Method to be invoked when a QIG is selected/opened from the QIG Selector list
     */
    private onQIGSelected = (isDataFromSearch: boolean = false,
        isDataFromHistory: boolean = false,
        isFromLocksInPopUp: boolean = false): void => {
        if (isDataFromHistory) {
            return;
        }

        // If QIG Collection is not loaded and any QIG is having Hide In Overvie wWhen No Work CC On, Load the dat to calculate hidden QIgs
        if (qigStore.instance.getOverviewData.hasAnyQigWithHideInOverviewWhenNoWorkCCOn && !qigStore.instance.isQIGCollectionLoaded) {
            qigActionCreator.getQIGSelectorData(0, false, false, false, false, false);
        }

        if (!isFromLocksInPopUp) {
            // if the qig in user option is withdrawn then select the entire qig data.
            if (qigStore.instance.selectedQIGForMarkerOperation) {
                this.isQIGSelected = true;
                this.selectedQIG();
            } else {
                this.getQigData(0);
            }
        }
    };

    /**
     * Method to be invoked when a ExamBody CC is loaded.
     */
    private onExamBodyCCLoaded = (): void => {
        this.selectedQIG();
    };

    /**
     * This method will call if a QIG is selected/opened from the QIG Selector list or ExamBody cc is loaded.
     */
    private selectedQIG = (): void => {
        // If Awarding Body CC is not loaded yet, no need to fetch worklist related data
        if (!ccStore.instance.isExamBodyCCLoaded || !this.isQIGSelected) {
            return;
        } else if (!qigStore.instance.isQIGCollectionLoaded && !qigStore.instance.selectedQIGForMarkerOperation) {
            // Fix for the defect. Remembered QIG is not present, Get the entire collection
            if (userinfoStore.instance.currentOperationMode !== enums.MarkerOperationMode.TeamManagement) {
                this.getQigData(0);
            } else {
                this.storageAdapterHelper.clearTeamDataCache(teamManagementStore.instance.selectedExaminerRoleId,
                    teamManagementStore.instance.selectedMarkSchemeGroupId);
                navigationHelper.loadQigSelector();
            }
            return;
        }

        // If QIGs are not available we don't need to show the header icons
        if (this.worklistHeaderIconsDisplayed === false) {
            qigActionCreator.showHeaderIconsOnQIGsAvailable(true);
            this.worklistHeaderIconsDisplayed = true;
        }

        if (qigStore.instance.selectedQIGForMarkerOperation) {
            if (this.isQIGSelectedFromUserOption) {
                this.isQIGSelectedFromUserOption = false;
                if (!this._rememberQigInfo) {
                    this._rememberQigInfo = markerOperationModeFactory.operationMode.selectedQIGFromUserOption;
                }
                switch (this._rememberQigInfo.area) {
                    case enums.QigArea.QigSelector:
                        break;
                    case enums.QigArea.Marking:
                        let _updateSelectedQigDetailsPromise = userOptionActionCreator.updateSelectedQigDetails(
                            this._rememberQigInfo);
                        Promise.Promise.all(
                            [
                                _updateSelectedQigDetailsPromise
                            ]).
                            then(function (result: any) {
                                navigationHelper.loadWorklist();
                            });
                        break;
                    case enums.QigArea.TeamManagement:
                        let markSchemeGroupCCPromise = ccActionCreator.getMarkSchemeGroupCCs(
                            this._rememberQigInfo.qigId,
                            this._rememberQigInfo.questionPaperPartId);

                        let updateSelectedQigDetailsPromise = userOptionActionCreator.updateSelectedQigDetails(
                            this._rememberQigInfo);

                        let openQIGPromise = qigActionCreator.getQIGSelectorData(
                            this._rememberQigInfo.qigId, false, false, false, false, false);

                        let that = this;

                        if (this._rememberQigInfo.subordinateExaminerRoleID > 0 && !this.isExaminerHasStuckData) {

                            let openQIGDetailsPromise = Promise.Promise.all(
                                [
                                    markSchemeGroupCCPromise,
                                    updateSelectedQigDetailsPromise,
                                    openQIGPromise
                                ]).
                                then(function (result: any) {
                                    responseSearchHelper.openQIGDetails(
                                        that._rememberQigInfo.questionPaperPartId,
                                        that._rememberQigInfo.qigId,
                                        that._rememberQigInfo.subordinateExaminerRoleID,
                                        dataServiceHelper.canUseCache(),
                                        examinerStore.instance.examinerApprovalStatus(that._rememberQigInfo.subordinateExaminerRoleID),
                                        qigStore.instance.selectedQIGForMarkerOperation.markingMethod,
                                        false, qigStore.instance.selectedQIGForMarkerOperation.isElectronicStandardisationTeamMember);
                                });

                            // load stamps defined for the selected mark scheme groupId
                            stampActionCreator.getStampData(
                                this._rememberQigInfo.qigId,
                                stampStore.instance.stampIdsForSelectedQIG,
                                qigStore.instance.selectedQIGForMarkerOperation.markingMethod,
                                responseHelper.isEbookMarking,
                                true);

                            Promise.Promise.all(
                                [
                                    openQIGDetailsPromise
                                ]).
                                then(function (result: any) {
                                    teamManagementActionCreator.getMyTeamData(
                                        teamManagementStore.instance.selectedExaminerRoleId,
                                        teamManagementStore.instance.selectedMarkSchemeGroupId, false, true);

                                    navigationHelper.loadWorklist();
                                });
                        } else {
                            let that = this;
                            Promise.Promise.all(
                                [
                                    markSchemeGroupCCPromise,
                                    updateSelectedQigDetailsPromise,
                                    openQIGPromise
                                ]).
                                then(function (result: any) {
                                    teamManagementActionCreator.openTeamManagement(
                                        that._rememberQigInfo.examinerRoleId,
                                        that._rememberQigInfo.qigId,
                                        true,
                                        true);
                                });
                        }

                        let currQigName;
                        // Calling the helper method to format the QIG Name
                        if (qigStore.instance.selectedQIGForMarkerOperation !== undefined) {
                            let selectedQig = qigStore.instance.selectedQIGForMarkerOperation;
                            currQigName = stringFormatHelper.formatAwardingBodyQIG(
                                selectedQig.markSchemeGroupName,
                                selectedQig.assessmentCode,
                                selectedQig.sessionName,
                                selectedQig.componentId,
                                selectedQig.questionPaperName,
                                selectedQig.assessmentName,
                                selectedQig.componentName,
                                stringFormatHelper.getOverviewQIGNameFormat());
                        }

                        // logging qig selection in google analytics or application insights based on the configuration.
                        new auditLoggingHelper().logHelper.logEventOnQigSelection(currQigName);
                        break;
                    case enums.QigArea.Inbox:
                        break;
                    case enums.QigArea.StandardisationSetup:
                    let standardisationCCValue: standardisationSetupCCData
                            = qigStore.instance.getSSUPermissionsData(this._rememberQigInfo.qigId);
                    if (this.isStdWorklistVisible(standardisationCCValue, this._rememberQigInfo.standardisationSetupWorklistType)) {
                        // set the marker operation mode as StandardisationSetup
                        userInfoActionCreator.changeOperationMode(enums.MarkerOperationMode.StandardisationSetup);

                        // set remember qig std worklist in std store 
                        userOptionActionCreator.updateSelectedQigDetails(this._rememberQigInfo);

                        // Invoke the action creator to Open the QIG
                        qigSelectorActionCreator.openQIG(this._rememberQigInfo.qigId);

                        // Navigate to SSU 
                        navigationHelper.loadStandardisationSetup();
                    } else {
                        this.getQigData(0);
                        return;
                    }
                        break;
                }
            } else {
                if (userinfoStore.instance.currentOperationMode === enums.MarkerOperationMode.Marking &&
                    (navigationStore.instance.containerPage === enums.PageContainers.WorkList ||
                        navigationStore.instance.containerPage === enums.PageContainers.QigSelector)) {
                    navigationHelper.loadWorklist();
                } else if (userinfoStore.instance.currentOperationMode === enums.MarkerOperationMode.TeamManagement &&
                    navigationStore.instance.containerPage === enums.PageContainers.TeamManagement) {
                    navigationHelper.loadTeamManagement();
                }
            }

            // Refresh the QIG Selector Drop down to close the loading indicator
            this.refreshQIGSelectorDropdown(Date.now(), false, false);

            // logging qig selection in google analytics or application insights based on the configuration
            new auditLoggingHelper().logHelper.logEventOnQigSelection(this.getCurrentQIGName());
        }
    };

    /**
     * this will set the mark scheme structure loaded flag to true
     * if the mark scheme CC is already loaded call the method to invoke the calls to fetch the related data for the  QIG
     */
    private fetchRelatedDataForTheQIGAfterMarkSchemeStructure = (): void => {
        this.isMarkSchemeStructureLoaded = true;
        if (this.isMarkSchemeCCLoaded) {
            workListDataHelper.fetchRelatedDataForQIGAfterMarkSchemeStructureAndCC(this.props.isInTeamManagement);
        }
    };

    /**
     * Prepare work list after initialising worklist data
     */
    private worklistInitialisationCompleted = (): void => {

        workListDataHelper.fetchRelatedDataForQIGAfterMarkSchemeStructureAndCC(this.props.isInTeamManagement);
    };

    /**
     * this will set the mark scheme CC loaded falg to true
     * if the mark schems structure is already loaded call the method to invoke the calls to fetch the related data for the QIG
     */
    private fetchRelatedDataForTheQIGAfterCC = (): void => {

        this.isMarkSchemeCCLoaded = true;
        if (this.isMarkSchemeStructureLoaded) {
            workListDataHelper.fetchRelatedDataForQIGAfterMarkSchemeStructureAndCC(this.props.isInTeamManagement);
        }
    };

    /**
     * Method which refreshes the QIG Selector drop down
     */
    private refreshQIGSelectorDropdown(renderedOn: number, doOpenQIGSelectorDropdown: boolean, doShowLoadingIndicator: boolean,
        isSimulationTargetCompleted: boolean = false) {
        // Setting the state for re-rendering the QIG Selector
        this.setState({
            renderedOn: renderedOn,
            isLoadingIndicatorShown: doShowLoadingIndicator,
            isOpen: this.props.isInTeamManagement ? false : doOpenQIGSelectorDropdown,
            shouldRender: isSimulationTargetCompleted
        });
    }

    /**
     * Method which gets the selected QIG's name based on the Awarding Body specific QIG Naming format
     */
    private getCurrentQIGName() {
        // Calling the helper method to format the QIG Name
        if (qigStore.instance.selectedQIGForMarkerOperation !== undefined) {
            let selectedQig = qigStore.instance.selectedQIGForMarkerOperation;
            return stringFormatHelper.formatAwardingBodyQIG(
                selectedQig.markSchemeGroupName,
                selectedQig.assessmentCode,
                selectedQig.sessionName,
                selectedQig.componentId,
                selectedQig.questionPaperName,
                selectedQig.assessmentName,
                selectedQig.componentName,
                stringFormatHelper.getOverviewQIGNameFormat());
        }
        // If a QIG is not selected, return the default text to be shown on the drop down
        return localeStore.instance.TranslateText('messaging.compose-message.please-select-qig-placeholder');
    }

    /**
     * Method called when the message navigation is confirmed by the user
     * @param messageNavigationArguments
     */
    private onMessageNavigation = (messageNavigationArguments: MessageNavigationArguments) => {
        if (messageNavigationArguments.canNavigate && messageNavigationArguments.navigateTo === enums.MessageNavigation.toQigSelector) {
            // On clicking the QIG Selector drop down, it should expand to show the Loading Indicator
            // until the QIG List is retrieved from the server
            this.refreshQIGSelectorDropdown(Date.now(), true, true);
            // Invoke the method to fetch the QIG Data
            this.getQigData();
        }
    };

    /**
     * Navigate to worklist
     */
    private navigateToWorklist = () => {
        navigationHelper.loadWorklist();
    };

    /**
     * On getting the simulation exited qigs data
     */
    private onSimulationExitedQigsRecieved = () => {
        if (simulationModeHelper.isSimulationExitedQigDataAvailable) {
            this.setState({
                shouldRender: false
            });
        }
    }

    /**
     * On getting the simulation exited qigs and locks in qigs data
     */
    private onSimulationExitedQigsAndLocksInQigsRecieved = () => {
        if (!simulationModeHelper.isSimulationExitedQigDataAvailable &&
            !simulationModeHelper.isLockInQigsDataAvailable) {
            this.navigateWithRememberQigData();
        }
    }

    /**
     * On simulation target completion.
     */
    private onSimulationTargetCompletion = (_isTargetComepleted: any) => {
        if (_isTargetComepleted) {
            // If there is remember qig data then reset it to qigselector.
            if (this._rememberQigInfo) {
                this._rememberQigInfo.area = enums.QigArea.QigSelector;
                this._rememberQigInfo.worklistType = enums.WorklistType.none;
            }

            // Now show the popup
            let lockInQigs: locksInQigDetailsList;
            lockInQigs = qigStore.instance.getLocksInQigList === undefined ?
                undefined :
                qigStore.instance.getLocksInQigList;
            if (lockInQigs.locksInQigDetailsList.count() > 0) {
                qigActionCreator.showLocksInQigPopup(true, false);
            } else {
                this.refreshQIGSelectorDropdown(Date.now(), true, true, true);
                // Clearing cache
                storageAdapterFactory.getInstance().deleteData('qigselector', 'overviewdata');
                // Invoke the method to fetch the QIG Data
                this.getQigData();
            }
        }
    }

    /**
     * On getting the simulation exited qigs and locks in qigs data
     */
    private setAnimationOnQigGroupExpandOrCollapse(): void {
        this.setState({
            doNeedAnimationOnExpandOrCollapse : true
        });
    }

    /**
     * Returns visiblity of std worklist's depends on stdSetupPermissionCC value.
     */
    private isStdWorklistVisible = (stdSetupPermissionCCvalue: standardisationSetupCCData,
                                                 worklistType: enums.StandardisationSetup): boolean => {
        let isVisible: boolean = false;
        if (stdSetupPermissionCCvalue) {
            switch (worklistType) {
                case enums.StandardisationSetup.UnClassifiedResponse:
                    isVisible = stdSetupPermissionCCvalue.role.viewByClassification.views.unclassified ? true : false;
                    break;
                case enums.StandardisationSetup.ClassifiedResponse:
                    isVisible = stdSetupPermissionCCvalue.role.viewByClassification.views.classified ? true : false;
                    break;
                default:
                isVisible = true;
                break;
            }
        }
        return isVisible;
    }
}

export = QigSelector;