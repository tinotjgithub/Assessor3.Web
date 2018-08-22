import React = require('react');
import pureRenderComponent = require('../base/purerendercomponent');
import enums = require('../utility/enums');
import Header = require('../header');
import BusyIndicator = require('../utility/busyindicator/busyindicator');
import localeStore = require('../../stores/locale/localestore');
import busyIndicatorStore = require('../../stores/busyindicator/busyindicatorstore');
import classNames = require('classnames');
import GenericDialog = require('../utility/genericdialog');
import Footer = require('../footer');
import userInfoStore = require('../../stores/userinfo/userinfostore');
import teamManagementActionCreator = require('../../actions/teammanagement/teammanagementactioncreator');
import examinerViewDataHelper = require('../../utility/teammanagement/helpers/examinerviewdatahelper');
import teamManagementStore = require('../../stores/teammanagement/teammanagementstore');
import TeamManagementContainer = require('./teammanagementcontainer');
import TeamManagementCollapsiblePanel = require('./TeamManagementCollapsiblePanel');
import TeamLink = require('./typings/teamlink');
import cchelper = require('../../utility/configurablecharacteristic/configurablecharacteristicshelper');
import ccNames = require('../../utility/configurablecharacteristic/configurablecharacteristicsnames');
import ccStore = require('../../stores/configurablecharacteristics/configurablecharacteristicsstore');
import qigStore = require('../../stores/qigselector/qigstore');
import loginSession = require('../../app/loginsession');
import ConfirmationDialog = require('../utility/confirmationdialog');
import stringFormatHelper = require('../../utility/stringformat/stringformathelper');
import messagingActionCreator = require('../../actions/messaging/messagingactioncreator');
import busyIndicatorActionCreator = require('../../actions/busyindicator/busyindicatoractioncreator');
import warningMessageStore = require('../../stores/teammanagement/warningmessagestore');
import warningMessageNavigationHelper = require('../../utility/teammanagement/helpers/warningmessagenavigationhelper');
import Promise = require('es6-promise');
import storageAdapterHelper = require('../../dataservices/storageadapters/storageadapterhelper');
import simulationModeHelper = require('../../utility/simulation/simulationmodehelper');
import stringHelper = require('../../utility/generic/stringhelper');
import qigDetails = require('../../dataservices/teammanagement/typings/qigdetails');
import applicationstore = require('../../stores/applicationoffline/applicationstore');
import applicationactioncreator = require('../../actions/applicationoffline/applicationactioncreator');
import ccValues = require('../../utility/configurablecharacteristic/configurablecharacteristicsvalues');
import Immutable = require('immutable');
import auditLoggingHelper = require('../utility/auditlogger/auditlogginghelper');

/* tslint:disable:no-empty-interfaces */
/**
 * Properties of TeamManagement component.
 */
interface Props extends LocaleSelectionBase, PropsBase {
    renderedOn?: number;
    isFromMenu?: boolean;
}
/* tslint:disable:no-empty-interfaces */

/**
 * State of a component
 */
interface State {
    isLeftPanelCollapsed?: boolean;
    isLogoutConfirmationPopupDisplaying?: boolean;
    isBusy?: boolean;
    modulesLoaded?: boolean;
    unlockExaminerRoleId?: number;
    renderedOn?: number;
    selectedTab?: number;
}

/**
 * React component for team management
 */
class TeamManagement extends pureRenderComponent<Props, State> {

    /* has data refresh started */
    private isContentRefreshStarted: boolean;
    private isMarkSchemeGroupCCLoaded: boolean;
    private unlockExaminerName: string;
    private storageAdapterHelper = new storageAdapterHelper();

    /**
     * @constructor
     */
    constructor(props: Props, state: State) {
        super(props, state);
        // While Navigating to Team management, Navigate to the selected tab.
        this.state = {
            isLeftPanelCollapsed: teamManagementStore.instance.isLeftPanelCollapsed,
            selectedTab: teamManagementStore.instance.selectedTeamManagementTab,
            renderedOn: this.props.renderedOn
        };
        this.onLeftPanelCollapseOrExpand = this.onLeftPanelCollapseOrExpand.bind(this);
        this.showLogoutConfirmation = this.showLogoutConfirmation.bind(this);
        this.resetLogoutConfirmationSatus = this.resetLogoutConfirmationSatus.bind(this);
        if (qigStore.instance.selectedQIGForMarkerOperation &&
            qigStore.instance.selectedQIGForMarkerOperation.markSchemeGroupId === ccStore.instance.ccLoadedForMarkSchemeGroupId) {
            this.isMarkSchemeGroupCCLoaded = true;

            // Get the team overview counts
            this.getTeamManagementOverviewCounts();
        }
        simulationModeHelper.checkStandardisationSetupCompletion(enums.PageContainers.QigSelector,
            enums.PageContainers.TeamManagement);
    }

    /**
     * Subscribe to language change event
     */
    public componentDidMount() {
        busyIndicatorStore.instance.addListener(busyIndicatorStore.BusyIndicatorStore.BUSY_INDICATOR, this.setBusyIndicator);
        userInfoStore.instance.addListener(userInfoStore.UserInfoStore.SHOW_LOGOUT_POPUP_EVENT, this.showLogoutConfirmation);
        teamManagementStore.instance.addListener(teamManagementStore.TeamManagementStore.SET_PANEL_STATE, this.setLeftPanelState);
        teamManagementStore.instance.addListener(teamManagementStore.TeamManagementStore.TEAM_MANAGEMENT_SELECTED_TAB,
            this.setLinkSelection);
        teamManagementStore.instance.addListener(teamManagementStore.TeamManagementStore.HELP_EXAMINERS_DATA_RECEIVED,
            this.onHelpExaminersDataReceived);
        ccStore.instance.addListener
            (ccStore.ConfigurableCharacteristicsStore.MARKSCHEME_GROUP_CC_GET, this.onMarkSchemeGroupCCLoaded);
        teamManagementStore.instance.addListener(teamManagementStore.TeamManagementStore.CAN_EXECUTE_APPROVAL_MANAGEMENT_ACTION,
            this.onLockOrUnlockClicked);
        teamManagementStore.instance.addListener(teamManagementStore.TeamManagementStore.APPROVAL_MANAGEMENT_ACTION_EXECUTED,
            this.onApprovalManagementActionExecuted);
        teamManagementStore.instance.addListener(teamManagementStore.TeamManagementStore.MY_TEAM_DATA_LOADED_EVENT,
            this.onMyTeamDataLoad);
        teamManagementStore.instance.addListener(teamManagementStore.TeamManagementStore.TEAM_OVERVIEW_DATA_RECEIVED,
            this.teamOverviewDataReceived);
        teamManagementStore.instance.addListener(teamManagementStore.TeamManagementStore.TEAM_EXCEPTIONS_DATA_LOADED_EVENT,
            this.onExceptionDataLoad);

        /* Load the unread mandatory message status for displaying mandatory messages */
        messagingActionCreator.getUnreadMandatoryMessageStatus(enums.TriggerPoint.QigSelector);
        warningMessageStore.instance.addListener(
            warningMessageStore.WarningMessageStore.WARNING_MESSAGE_NAVIGATION_EVENT, this.handleWarningMessageNavigation);
        teamManagementStore.instance.addListener(teamManagementStore.TeamManagementStore.MY_TEAM_MANAGEMENT_EXAMINER_VALIDATED_EVENT,
            this.examinerValidated);
        warningMessageStore.instance.addListener(warningMessageStore.WarningMessageStore.WARNING_MESSAGE_EVENT,
            this.sepActionFailureReceived);
    }

    /**
     * Unsubscribe language change event
     */
    public componentWillUnmount() {
        busyIndicatorStore.instance.removeListener(busyIndicatorStore.BusyIndicatorStore.BUSY_INDICATOR, this.setBusyIndicator);
        userInfoStore.instance.removeListener(userInfoStore.UserInfoStore.SHOW_LOGOUT_POPUP_EVENT, this.showLogoutConfirmation);
        teamManagementStore.instance.removeListener(teamManagementStore.TeamManagementStore.SET_PANEL_STATE, this.setLeftPanelState);
        teamManagementStore.instance.removeListener(teamManagementStore.TeamManagementStore.TEAM_MANAGEMENT_SELECTED_TAB,
            this.setLinkSelection);
        teamManagementStore.instance.removeListener(teamManagementStore.TeamManagementStore.HELP_EXAMINERS_DATA_RECEIVED,
            this.onHelpExaminersDataReceived);
        ccStore.instance.removeListener
            (ccStore.ConfigurableCharacteristicsStore.MARKSCHEME_GROUP_CC_GET, this.onMarkSchemeGroupCCLoaded);
        teamManagementStore.instance.removeListener(teamManagementStore.TeamManagementStore.CAN_EXECUTE_APPROVAL_MANAGEMENT_ACTION,
            this.onLockOrUnlockClicked);
        teamManagementStore.instance.removeListener(teamManagementStore.TeamManagementStore.MY_TEAM_DATA_LOADED_EVENT,
            this.onMyTeamDataLoad);
        teamManagementStore.instance.removeListener(teamManagementStore.TeamManagementStore.APPROVAL_MANAGEMENT_ACTION_EXECUTED,
            this.onApprovalManagementActionExecuted);
        teamManagementStore.instance.removeListener(teamManagementStore.TeamManagementStore.TEAM_OVERVIEW_DATA_RECEIVED,
            this.teamOverviewDataReceived);
        warningMessageStore.instance.removeListener(
            warningMessageStore.WarningMessageStore.WARNING_MESSAGE_NAVIGATION_EVENT, this.handleWarningMessageNavigation);
        teamManagementStore.instance.removeListener(teamManagementStore.TeamManagementStore.MY_TEAM_MANAGEMENT_EXAMINER_VALIDATED_EVENT,
            this.examinerValidated);
        teamManagementStore.instance.removeListener(teamManagementStore.TeamManagementStore.TEAM_EXCEPTIONS_DATA_LOADED_EVENT,
            this.onExceptionDataLoad);
        warningMessageStore.instance.removeListener(warningMessageStore.WarningMessageStore.WARNING_MESSAGE_EVENT,
            this.sepActionFailureReceived);
    }

    /**
     * component will receive props
     */
    public componentWillReceiveProps(nextProps: Props) {
        if (this.props !== nextProps) {
            // Get the team overview counts
            this.getTeamManagementOverviewCounts();
            this.setState({
                selectedTab: teamManagementStore.instance.selectedTeamManagementTab,
                renderedOn: nextProps.renderedOn
            });
        }
    }

    /**
     * Render method
     */
    public render(): JSX.Element {
        let unlockExaminerConfirmationDialog: JSX.Element;

        if (this.state.unlockExaminerRoleId > 0) {
            unlockExaminerConfirmationDialog = (
                <ConfirmationDialog
                    content={localeStore.instance.TranslateText('team-management.help-examiners.unlock-confirmation-dialog.body')
                        .replace('{examinername}', this.unlockExaminerName)}
                    header={localeStore.instance.TranslateText('team-management.help-examiners.unlock-confirmation-dialog.header')}
                    yesButtonText={localeStore.instance.
                                    TranslateText('team-management.help-examiners.unlock-confirmation-dialog.yes-button')}
                    noButtonText={localeStore.instance.
                                    TranslateText('team-management.help-examiners.unlock-confirmation-dialog.no-button')}
                    dialogType={enums.PopupDialogType.UnlockExaminerConfirmation}
                    displayPopup={true}
                    isCheckBoxVisible={false}
                    key={'UnlockExaminerConfirmation'}
                    onNoClick={() => { this.setState({ unlockExaminerRoleId: 0 }); }}
                    onYesClick={() => { this.executeSEPAction(enums.SEPAction.Unlock, this.state.unlockExaminerRoleId); }} />);
        }
        let busyIndicator = (
            <BusyIndicator
                id='busyIndicator'
                key='busyIndicator'
                isBusy={this.state.isBusy}
                busyIndicatorInvoker={enums.BusyIndicatorInvoker.none}
            />);

        let header = (
            <Header selectedLanguage={this.props.selectedLanguage}
                isInTeamManagement={true}
                renderedOn={this.state.renderedOn}
                containerPage={enums.PageContainers.TeamManagement} />
        );

        let footer = (<Footer selectedLanguage={this.props.selectedLanguage}
            id={'footer_team_mgmt'} key={'footer_team_mgmt'}
            footerType={enums.FooterType.TeamManagement}
            isLogoutConfirmationPopupDisplaying={this.state.isLogoutConfirmationPopupDisplaying}
            resetLogoutConfirmationSatus={this.resetLogoutConfirmationSatus} />);

        return (
            <div className={classNames('team-wrapper', this.state.isLeftPanelCollapsed ? 'hide-left' : '')}>
                {header}
                {footer}
                {unlockExaminerConfirmationDialog}
                {this.renderDetails()}
                {busyIndicator}
            </div>

        );
    }

    /**
     * Render the details for the team management.
     */
    private renderDetails() {
        // Render all components for the team management.
        return (
            <div className='content-wrapper'>
                <TeamManagementCollapsiblePanel id={'TeamManagementCollapsiblePanel'}
                    key={'TeamManagementCollapsiblePanel-Key'}
                    availableTeamLinks={this.getTeamLinks()}
                    renderedOn={this.state.renderedOn}
                    onLinkClick={this.onLinkClick} />
                <TeamManagementContainer id={'TeamMangementContainer'}
                    key={'TeamManagementContainer-Key'}
                    teamManagementTab={this.state.selectedTab}
                    selectedLanguage={this.props.selectedLanguage}
                    toggleLeftPanel={this.onLeftPanelCollapseOrExpand}
                    renderedOn={this.state.renderedOn}
                    isFromMenu={this.props.isFromMenu} />
            </div>
        );
    }

    /**
     * Click event of the link
     * @param teamLinkType
     */
    private onLinkClick = (teamLinkType: enums.TeamManagement): void => {
        // If selected tab is helpExaminers, Validate the examiner
        if (!applicationstore.instance.isOnline) {
            applicationactioncreator.checkActionInterrupted();
        } else if (teamLinkType === enums.TeamManagement.HelpExaminers) {
            this.executeSEPAction(enums.SEPAction.SendMessage, 0);
            teamManagementActionCreator.teammanagementTabSelect(teamLinkType);
        } else if (teamLinkType === enums.TeamManagement.MyTeam) {
            // If selected tab is helpExaminers, Validate the examiner
            this.validateExaminerOnClick(teamManagementStore.instance.selectedExaminerRoleId,
                qigStore.instance.getSelectedQIGForTheLoggedInUser.markSchemeGroupId);
        } else {
            teamManagementActionCreator.teammanagementTabSelect(teamLinkType);
        }
    }

    /**
     * Show busy indicator when submit is clicked in live open worklist
     */
    private setBusyIndicator = (): void => {
        /* if any error occurs set the variable to false and content refresh has started */
        if (busyIndicatorStore.instance.getBusyIndicatorInvoker === enums.BusyIndicatorInvoker.none &&
            this.isContentRefreshStarted) {
            this.resetContentRefreshStatuses();
        }
        this.setState({
            isBusy: busyIndicatorStore.instance.getBusyIndicatorInvoker === enums.BusyIndicatorInvoker.none ? false : true
        });
    };

    /**
     * Get overview received event
     */
    private teamOverviewDataReceived = (isHelpExaminersDataRefreshRequired: boolean): void => {

        let _selectedQig: qigDetails = teamManagementStore.instance.getSelectedQig;
        let doLoadHelpExaminerData: boolean = _selectedQig ? ((teamManagementStore.instance.selectedTeamManagementTab === undefined) &&
            (_selectedQig.examinerLockCount > 0 ||
                (teamManagementStore.instance.isFirstTimeTeamManagementAccessed &&
                    _selectedQig.examinerStuckCount > 0)) ||
            teamManagementStore.instance.selectedTeamManagementTab === enums.TeamManagement.HelpExaminers) : false;

        // Load data if the selected tab is help examiner
        if (doLoadHelpExaminerData) {
            if (isHelpExaminersDataRefreshRequired) {
                // load Help Examiners Data
                this.loadHelpExaminersData();
            }
        } else if (teamManagementStore.instance.selectedTeamManagementTab === enums.TeamManagement.Exceptions) {
            teamManagementActionCreator.getUnactionedExceptions(teamManagementStore.instance.selectedMarkSchemeGroupId);
        } else {
            this.loadMyTeamData();
        }
        this.setState({ isBusy: false });
    };

    /**
     * Reset content refresh statuses
     */
    private resetContentRefreshStatuses() {
        this.isContentRefreshStarted = false;
    }

    /**
     * Reseting the confirmation dialog's state to make it invisible.
     */
    private resetLogoutConfirmationSatus(): void {
        this.setState({ isLogoutConfirmationPopupDisplaying: false });
    }

    /**
     * this will shows the confirmation popup on logout based on the ask on logout value.
     */
    private showLogoutConfirmation = (): void => {
        this.setState({ isLogoutConfirmationPopupDisplaying: true });
    };

    /**
     * Handle toggle event of recipient list.
     *
     */
    private onLeftPanelCollapseOrExpand = () => {
        teamManagementActionCreator.leftPanelToggleSave(!this.state.isLeftPanelCollapsed);
    };

    /**
     * Sets the team management left panel toggle state based on the store value
     */
    private setLeftPanelState = (): void => {
        this.setState({
            isLeftPanelCollapsed: teamManagementStore.instance.isLeftPanelCollapsed
        });
    };

    /**
     * Set the link state logic for the left Panel
     */
    private setLinkSelection = (): void => {
        if (teamManagementStore.instance.selectedTeamManagementTab === enums.TeamManagement.MyTeam) {
            this.loadMyTeamData();
        } else if (teamManagementStore.instance.selectedTeamManagementTab === enums.TeamManagement.HelpExaminers) {
            this.loadHelpExaminersData();
        } else if (teamManagementStore.instance.selectedTeamManagementTab === enums.TeamManagement.Exceptions) {
            teamManagementActionCreator.getUnactionedExceptions(teamManagementStore.instance.selectedMarkSchemeGroupId);
        }

        /* Logging tab swith in google analytics or application insights based on the configuration */
        new auditLoggingHelper().logHelper.
            logEventOnTeamManagementTabSwitch(teamManagementStore.instance.selectedTeamManagementTab);
        this.setState({
            selectedTab: teamManagementStore.instance.selectedTeamManagementTab
        });
    };

    /**
     * Get the Overview Count
     */
    private getTeamManagementOverviewCounts = () => {
        teamManagementActionCreator.getTeamManagementOverviewCounts(teamManagementStore.instance.selectedExaminerRoleId,
            teamManagementStore.instance.selectedMarkSchemeGroupId);
    };
    /*
     * Load the data for My Team List
     */
    private loadMyTeamData = () => {
        teamManagementActionCreator.getMyTeamData(teamManagementStore.instance.selectedExaminerRoleId,
            teamManagementStore.instance.selectedMarkSchemeGroupId, false);
    };

    /*
     * This method will call on my team data load
     */
    private onMyTeamDataLoad = (isFromHistory: boolean) => {
        if (isFromHistory) {
            return;
        }
        this.resetContentRefreshStatuses();

        // If the selected qigs is in simulation then clear the cahce of simulation exited qigs to
        // show popup on clicking home from team-management.
        let currentTarget: any = qigStore.instance.getSelectedQIGForTheLoggedInUser.currentMarkingTarget;
        if (currentTarget.markingMode === enums.MarkingMode.Simulation) {
            this.storageAdapterHelper.clearCacheByKey('simulationexitedqigs', 'qigdata');
        }

        this.setState({
            renderedOn: Date.now(),
            selectedTab: teamManagementStore.instance.selectedTeamManagementTab
        });
    };

    /*
     * Generates the value for the team links
     */
    private getTeamLinks = (): Array<TeamLink> => {
        let teamLinks: Array<TeamLink> = null;
        let _selectedQig: qigDetails = teamManagementStore.instance.getSelectedQig;
        if (_selectedQig) {
            teamLinks = [
                {
                    linkName: enums.TeamManagement.MyTeam,
                    isVisible: true,
                    isSelected: enums.TeamManagement.MyTeam === this.state.selectedTab,
                    subLinks: []
                },
                {
                    linkName: enums.TeamManagement.HelpExaminers,
                    isVisible: false,
                    isSelected: enums.TeamManagement.HelpExaminers === this.state.selectedTab,
                    subLinks: [
                        {
                            Count: _selectedQig.examinerLockCount,
                            linkName: enums.TeamSubLink.HelpExaminersLocked
                        },
                        {
                            Count: _selectedQig.examinerStuckCount,
                            linkName: enums.TeamSubLink.Stuck
                        }]

                },
                {
                    linkName: enums.TeamManagement.Exceptions,
                    isVisible: true,
                    isSelected: enums.TeamManagement.Exceptions === this.state.selectedTab,
                    subLinks: [
                        {
                            Count: _selectedQig.exceptionCount,
                            linkName: enums.TeamSubLink.Exceptions
                        }]
                }];

            if (this.isMarkSchemeGroupCCLoaded && qigStore.instance.getSelectedQIGForTheLoggedInUser &&
                qigStore.instance.getSelectedQIGForTheLoggedInUser.examinerApprovalStatus !== enums.ExaminerApproval.NotApproved &&
                qigStore.instance.getSelectedQIGForTheLoggedInUser.examinerApprovalStatus !== enums.ExaminerApproval.Suspended &&
                cchelper.getCharacteristicValue(ccNames.SeniorExaminerPool, _selectedQig.qigId).toLowerCase() === 'true') {
                teamLinks.filter((x) => x.linkName === enums.TeamManagement.HelpExaminers)[0].isVisible = true;
            }
        } else {
            teamLinks = null;
        }
        return teamLinks;
    };

    /*
     * Invoked when the data received for Help Examiners tab.
     */
    private onHelpExaminersDataReceived = (isFromHistory: boolean = false) => {
        if (isFromHistory) {
            return;
        }
        this.resetContentRefreshStatuses();
        this.setState({
            renderedOn: Date.now(),
            selectedTab: teamManagementStore.instance.selectedTeamManagementTab
        });
    };

    /*
     * Gets the data Help examiners
     */
    private loadHelpExaminersData = () => {
        // Load the Help examiners data, if Senior Examiner Pool CC is On, Else load My team data.
        if (this.isMarkSchemeGroupCCLoaded) {
            if (qigStore.instance.getSelectedQIGForTheLoggedInUser &&
                qigStore.instance.getSelectedQIGForTheLoggedInUser.examinerApprovalStatus !== enums.ExaminerApproval.NotApproved &&
                qigStore.instance.getSelectedQIGForTheLoggedInUser.examinerApprovalStatus !== enums.ExaminerApproval.Suspended &&
                cchelper.getCharacteristicValue(ccNames.SeniorExaminerPool,
                    qigStore.instance.selectedQIGForMarkerOperation.markSchemeGroupId).toLowerCase() === 'true') {
                if (teamManagementStore.instance.isHelpExaminersDataChanged) {
                    // Fix for defect 49603. Load the help examiners data after loading the count in order to make it sync.
                    let getTeamOverviewDataPromise = teamManagementActionCreator.getTeamManagementOverviewCounts
                                          (teamManagementStore.instance.selectedExaminerRoleId,
                        teamManagementStore.instance.selectedMarkSchemeGroupId, false, false, false);
                    Promise.Promise.all([getTeamOverviewDataPromise]).
                        then(function (item: any) {
                            teamManagementActionCreator.GetHelpExminersData(teamManagementStore.instance.selectedExaminerRoleId,
                                teamManagementStore.instance.selectedMarkSchemeGroupId,
                                !teamManagementStore.instance.isHelpExaminersDataChanged);
                        });
                } else {
                teamManagementActionCreator.GetHelpExminersData(teamManagementStore.instance.selectedExaminerRoleId,
                        teamManagementStore.instance.selectedMarkSchemeGroupId, !teamManagementStore.instance.isHelpExaminersDataChanged);
                    }
            } else {
                this.loadMyTeamData();
            }
        }
    };

    /**
     * On Mark Scheme group cc loaded
     */
    private onMarkSchemeGroupCCLoaded = () => {
        this.isMarkSchemeGroupCCLoaded = true;
        this.getTeamManagementOverviewCounts();
    };

    /**
     * SEP Action return callback.
     */
    private onApprovalManagementActionExecuted = (actionIdentifier: number,
        sepApprovalManagementActionResults: Immutable.List<DoSEPApprovalManagementActionResult>,
        isMultiLock: boolean) => {
        if (!isMultiLock) {
            // if examiner got Locked without error, navigate to his worklist else refresh to show the updated list
            let sepApprovalManagementActionResult: DoSEPApprovalManagementActionResult;
            sepApprovalManagementActionResult = sepApprovalManagementActionResults.first();
            if (sepApprovalManagementActionResult.success &&
                sepApprovalManagementActionResult.failureCode === enums.SEPActionFailureCode.None) {
                if (actionIdentifier === enums.SEPAction.Lock) {

                    let multiQigData: any = teamManagementStore.instance.teamOverviewCountData ?
                        teamManagementStore.instance.teamOverviewCountData.qigDetails : undefined;
                    if (ccValues.sepQuestionPaperManagement && (multiQigData && multiQigData.length > 1)) {
                        /* If ccValue true and it is a multi qig then invoke multi qig lock examiner data,
                           otherwise will navigate to help examiner work list.*/
                        teamManagementActionCreator.
                            GetMultiQigLockExaminersData(teamManagementStore.instance.selectedExaminerRoleId,
                            teamManagementStore.instance.selectedMarkSchemeGroupId,
                            sepApprovalManagementActionResult.examiner.examinerId,
                            sepApprovalManagementActionResult.examiner.examinerRoleId);
                    } else {
                        // Invoke help examiner data retrieve action for getting refreshed data and update the store.
                        teamManagementActionCreator.GetHelpExminersData(teamManagementStore.instance.selectedExaminerRoleId,
                            teamManagementStore.instance.selectedMarkSchemeGroupId,
                            !teamManagementStore.instance.isHelpExaminersDataChanged);

                        let examinerDrillDownData: ExaminerDrillDownData = {
                            examinerId: sepApprovalManagementActionResult.examiner.examinerId,
                            examinerRoleId: sepApprovalManagementActionResult.examiner.examinerRoleId
                        };
                        // Navigate to help examiner worklist after completed the lock operation.
                        teamManagementActionCreator.updateExaminerDrillDownData(examinerDrillDownData);
                        this.setState({
                            isBusy: false
                        });
                    }
                } else if (actionIdentifier === enums.SEPAction.Unlock) {

                    // to get the updated lock and stuck count
                    this.getTeamManagementOverviewCounts();
                    this.setState({
                        isBusy: false
                    });
                }
            }
        } else {
            if (sepApprovalManagementActionResults) {
                // Invoke multiple lock execution.
                let dataCollection: Array<MultiLockResult> = new Array<MultiLockResult>();
                // Include the currently locked QIG under the successfully locked qig list.
                if (teamManagementStore.instance.multiLockSelectedExaminerQigId !== 0) {
                    let multiLockResult: MultiLockResult = {
                        failureCode: enums.FailureCode.None,
                        markSchemeGroupId: teamManagementStore.instance.multiLockSelectedExaminerQigId
                    };
                    dataCollection.push(multiLockResult);
                }
                // Add qigs coming from the database which contain successfully locked or lock failed qigs.
                sepApprovalManagementActionResults.map(function (item: DoSEPApprovalManagementActionResult) {
                    let multiLockResult: MultiLockResult = {
                        failureCode: item.failureCode,
                        markSchemeGroupId: item.markSchemeGroupId
                    };
                    dataCollection.push(multiLockResult);
                });
                let multiLockResult = Immutable.List<MultiLockResult>(dataCollection);
                teamManagementActionCreator.getMultiQigLockResult(multiLockResult);
            }
        }

        this.setState({
            renderedOn: Date.now()
        });
    };

    /**
     * If Action is Unlock, display confirmation dialoge else lock the examiner.
     */
    private onLockOrUnlockClicked = (doSEPApprovalManagementActionArgument: DoSEPApprovalManagementActionArgument) => {
        if (doSEPApprovalManagementActionArgument.actionIdentifier === enums.SEPAction.Unlock) {
            let examiner = teamManagementStore.instance.examinersForHelpExaminers.filter((x) =>
                x.examinerRoleId === doSEPApprovalManagementActionArgument.examiners.first().examinerRoleId).first();
            this.unlockExaminerName = stringFormatHelper.getFormattedExaminerName(examiner.initials, examiner.surname);
            this.setState({ unlockExaminerRoleId: examiner.examinerRoleId });
        } else if (doSEPApprovalManagementActionArgument.actionIdentifier === enums.SEPAction.Lock) {
            this.setState({
                isBusy: true
            });
            this.executeSEPAction(enums.SEPAction.Lock, doSEPApprovalManagementActionArgument.examiners.first().examinerRoleId);
        }
    }

    /**
     * Execute SEP Action method
     * @param actionIdentifier
     * @param examinerRoleId
     * @param markSchemeGroupId
     * @param requestedByExaminerRoleId
     */
    private executeSEPAction(actionIdentifier: enums.SEPAction, examinerRoleId: number) {

        if (!applicationactioncreator.checkActionInterrupted()) {
            return;
        }
        let dataCollection: Array<ExaminerForSEPAction> = new Array<ExaminerForSEPAction>();
        let examinerSEPAction: ExaminerForSEPAction = {
            examinerRoleId: examinerRoleId,
            markSchemeGroupId : qigStore.instance.getSelectedQIGForTheLoggedInUser.markSchemeGroupId,
            requestedByExaminerRoleId : qigStore.instance.getSelectedQIGForTheLoggedInUser.examinerRoleId
        };
        dataCollection.push(examinerSEPAction);
        let examinerSEPActions =  Immutable.List<ExaminerForSEPAction>(dataCollection);
        let doSEPApprovalManagementActionArgument: DoSEPApprovalManagementActionArgument = {
            actionIdentifier: actionIdentifier,
            examiners: examinerSEPActions
        };

        teamManagementActionCreator.ExecuteApprovalManagementAction(doSEPApprovalManagementActionArgument);

        // If unlock, close the confirmation
        if (this.state.unlockExaminerRoleId > 0) {
            this.setState({ unlockExaminerRoleId: 0 });
        }
    }

    /**
     * Validate logged in examiner on clicking My Team Tab
     * @param examinerRoleId
     * @param requestedByExaminerRoleId
     */
    private validateExaminerOnClick(examinerRoleId: number, markSchemeGroupId: number) {
        let examinerValidationArea: enums.ExaminerValidationArea =
            enums.ExaminerValidationArea.MyTeam;
        // validates the examiner
        teamManagementActionCreator.teamManagementExaminerValidation(
            markSchemeGroupId,
            examinerRoleId,
            0,
            0,
            examinerValidationArea,
            false, null, enums.MarkingMode.None, 0, true);
    }

    /**
     * after examiner validation drill down to examiner worklist
     */
    private examinerValidated(failureCode: enums.FailureCode = enums.FailureCode.None,
        examinerDrillDownData: ExaminerDrillDownData, examinerValidationArea: enums.ExaminerValidationArea) {
        if (failureCode === enums.FailureCode.None && examinerDrillDownData.examinerId > 0
            && examinerDrillDownData.examinerRoleId > 0) {
            teamManagementActionCreator.updateExaminerDrillDownData(examinerDrillDownData);
        } else if (failureCode === enums.FailureCode.None) {
            teamManagementActionCreator.teammanagementTabSelect(enums.TeamManagement.MyTeam);
        }
    }

    /**
     * This method will call on exception data load
     */
    private onExceptionDataLoad = () => {
        this.setState({
            renderedOn: Date.now()
        });
    };

    /**
     * Method to handle the SEP failure action
     */
    private sepActionFailureReceived = (failureCode: enums.FailureCode,
        warningMessageAction: enums.WarningMessageAction): void => {
        //If SEP action failed event received then hide the busy indicator.
        if (failureCode !== enums.FailureCode.None &&
            warningMessageAction === enums.WarningMessageAction.SEPAction) {
            this.setState({ isBusy: false });
        }
    };

    /**
     * handle Warning Message Navigation
     */
    private handleWarningMessageNavigation = (failureCode: enums.FailureCode, warningMessageAction: enums.WarningMessageAction) => {
        if (failureCode === enums.FailureCode.SubordinateExaminerWithdrawn) {
        this.loadMyTeamData();
        }
        warningMessageNavigationHelper.handleWarningMessageNavigation(failureCode, warningMessageAction);
    }
}

export = TeamManagement;
