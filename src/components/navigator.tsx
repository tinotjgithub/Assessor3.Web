import React = require('react');
/* tslint:disable:no-unused-variable */
import reactDom = require('react-dom');
import pureRenderComponent = require('../components/base/purerendercomponent');
import enums = require('./utility/enums');
import timerHelper = require('../utility/generic/timerhelper');
import stringHelper = require('../utility/generic/stringhelper');
import auditLoggingHelper = require('./utility/auditlogger/auditlogginghelper');
import LoginForm = require('../components/login/loginform');
import historyItem = require('../utility/breadcrumb/historyitem');
import teamManagementHistoryInfo = require('../utility/breadcrumb/teammanagementhistoryinfo');
import worklistHistoryInfo = require('../utility/breadcrumb/worklisthistoryinfo');
import navigationStore = require('../stores/navigation/navigationstore');
import applicationStore = require('../stores/applicationoffline/applicationstore');
/* tslint:disable:variable-name */
declare let config: any;

/* tslint:disable:variable-name */
let localeStore;
let qigStore;
let worklistStore;
let loadContainerActionCreator;
let GenericDialog;
let operationModeHelper;
let markerOperationModeFactory;
let teamManagementStore;
let applicationActionCreator;
let AdminSupportContainer;
let WorklistBaseContainer;
let QigSelectorBaseContainer;
let ResponseBaseContainer;
let MessageBaseContainer;
let TeamManagementBaseContainer;
let StandardisationSetupBaseContainer;
let AwardingBaseContainer;
let ReportsBaseContainer;
/* tslint:enable:variable-name */

/**
 * All fields optional to allow partial state updates in setState
 */
interface State extends LocaleSelectionBase {
    containerPage?: enums.PageContainers;
    renderedOn?: number;
}

class Navigator extends pureRenderComponent<any, State> {

    private isFromMenu: boolean = false;
    private isNavigatedAfterFromLogin: boolean = false;
    private hasNetworkInterrupted: boolean = false;
    private timer: timerHelper;
    private isOnline: boolean = true;
    private moduleLoaded: boolean;
    private containerPageType: enums.PageContainersType = enums.PageContainersType.None;
    private reportsMounted: boolean = false;

    /**
     * Constructor
     * @param {Props} props
     * @param {State} state
     */
    constructor(props: any, state: State) {
        super(props, state);
        this.moduleLoaded = false;

        this.state = { containerPage: enums.PageContainers.Login, renderedOn: Date.now() };
        this.networkStatusChanged = this.networkStatusChanged.bind(this);
        this.ping = this.ping.bind(this);
        this.timer = new timerHelper();
        this.setOfflineContainer = this.setOfflineContainer.bind(this);
        this.onApplicationBackOnline = this.onApplicationBackOnline.bind(this);
        this.reportsDidMount = this.reportsDidMount.bind(this);
    }

    /**
     * Render component
     * @returns
     */
    public render() {
        let offlineContainer = null;
        let renderContainer = null;
        this.logEventOnContainerChange(this.state.containerPage);
        if (this.hasNetworkInterrupted) {

            let offlineMessage = stringHelper.format(
                localeStore.instance.TranslateText('generic.offline-dialog.body-application-files-not-downloaded'),
                [String(String.fromCharCode(179))]);
            offlineContainer = (<GenericDialog content={offlineMessage}
                header={localeStore.instance.TranslateText('generic.offline-dialog.header')}
                displayPopup={true}
                okButtonText={localeStore.instance.TranslateText('generic.error-dialog.ok-button')}
                onOkClick={this.onApplicationBackOnline}
                id='offlineErrorMessge'
                key='offlineErrorMessge'
                popupDialogType={enums.PopupDialogType.OffLineWarningOnContainerFailure} />);
        } else {
            switch (this.state.containerPage) {
                case enums.PageContainers.Login:
                    renderContainer = (<LoginForm />);
                    break;
                case enums.PageContainers.WorkList:
                    renderContainer = (<WorklistBaseContainer
                        id='worklist_base_container'
                        key='worklist_base_container_key'
                        selectedLanguage={localeStore.instance.Locale}
                        isOnline={this.isOnline}
                        setOfflineContainer={this.setOfflineContainer}
                        isFromMenu={this.isFromMenu} />);
                    break;
                case enums.PageContainers.QigSelector:
                    renderContainer = (<QigSelectorBaseContainer
                        id='qigselector_base_container'
                        key='qigselector_base_container_key'
                        selectedLanguage={localeStore.instance.Locale}
                        isOnline={this.isOnline}
                        setOfflineContainer={this.setOfflineContainer}
                        isNavigatedAfterFromLogin={this.isNavigatedAfterFromLogin} />);

                    if (this.isNavigatedAfterFromLogin) {
                        this.isNavigatedAfterFromLogin = false;
                    }
                    break;
                case enums.PageContainers.Response:
                    renderContainer = (
                        <ResponseBaseContainer
                            id={'response_base_container'}
                            key={'response_base_container_key'}
                            selectedLanguage={localeStore.instance.Locale}
                            isOnline={this.isOnline}
                            setOfflineContainer={this.setOfflineContainer}
                            containerPageType={this.containerPageType} />);
                    break;
                case enums.PageContainers.Message:
                    renderContainer = (
                        <MessageBaseContainer
                            id={'message_base_container'}
                            key={'message_base_container_key'}
                            selectedLanguage={localeStore.instance.Locale}
                            isOnline={this.isOnline}
                            setOfflineContainer={this.setOfflineContainer} />);
                    break;
                case enums.PageContainers.TeamManagement:
                    renderContainer = (
                        <TeamManagementBaseContainer
                            id={'teammanagement_base_container'}
                            key={'teammanagement_base_container_key'}
                            selectedLanguage={localeStore.instance.Locale}
                            isOnline={this.isOnline}
                            setOfflineContainer={this.setOfflineContainer}
                            isFromMenu={this.isFromMenu} />);
                    break;
                case enums.PageContainers.StandardisationSetup:
                    renderContainer = (<StandardisationSetupBaseContainer
                        id='standardisationsetup_base_container'
                        key='standardisationsetup_base_container_key'
                        renderedOn={this.state.renderedOn}
                        selectedLanguage={localeStore.instance.Locale}
                        isOnline={this.isOnline} />);
                    break;
                case enums.PageContainers.Awarding:
                    renderContainer = (<AwardingBaseContainer
                        id='awarding_base_container'
                        key='awarding_base_container_key'
                        selectedLanguage={localeStore.instance.Locale}
                        isOnline={this.isOnline}
                        setOfflineContainer={this.setOfflineContainer} />);
                    break;
                case enums.PageContainers.Reports:
                    renderContainer = (<ReportsBaseContainer
                        id='reports_base_container'
                        key='reports_base_container_key'
                        selectedLanguage={localeStore.instance.Locale}
                        isOnline={this.isOnline}
                        setOfflineContainer={this.setOfflineContainer}
                        reportsDidMount={this.reportsDidMount} />);
                    break;
                case enums.PageContainers.AdminSupport:
                    renderContainer = (<AdminSupportContainer
                        id='admin_support_container'
                        key='admin_support_container_key'
                        selectedLanguage={localeStore.instance.Locale}
                        isOnline={this.isOnline} />);
                    break;
            }
        }
        let style: React.CSSProperties = { height: '100%' };
        return (
            <div style={style}>
                {offlineContainer}
                {renderContainer}
            </div>
        );
    }

    /**
     * componentDidMount
     */
    public componentDidMount() {
        this.loadDependencies();
        this.networkStatusChanged(true);
        navigationStore.instance.addListener(navigationStore.NavigationStore.CONTAINER_CHANGE__EVENT, this.refreshState);
        applicationStore.instance.addListener(applicationStore.ApplicationStore.ONLINE_STATUS_UPDATED_EVENT, this.networkStatusChanged);
    }

    /**
     * componentWillUnmount
     */
    public componentWillUnmount() {
        navigationStore.instance.removeListener(navigationStore.NavigationStore.CONTAINER_CHANGE__EVENT, this.refreshState);
        if (localeStore) {
            localeStore.instance.removeListener(localeStore.LocaleStore.LOCALE_CHANGE_EVENT, this.languageChanged);
        }
        applicationStore.instance.removeListener(applicationStore.ApplicationStore.ONLINE_STATUS_UPDATED_EVENT, this.networkStatusChanged);
        this.timer.clear();
    }

    /**
     * add event listers
     */
    private addLocaleStoreListeners() {
        localeStore.instance.addListener(localeStore.LocaleStore.LOCALE_CHANGE_EVENT, this.languageChanged);
    }

    /**
     *  This will load the dependencies dynamically during component mount.
     */
    private async loadDependencies() {
        // here await is used to handle the asynchronus imports.
        await (
            import('../stores/locale/localestore').then(_localeStore => { localeStore = _localeStore; }),
            import('../stores/qigselector/qigstore').then(_qigStore => { qigStore = _qigStore; }),
            import('../stores/worklist/workliststore').then(_worklistStore => { worklistStore = _worklistStore; }),
            import('../actions/navigation/loadcontaineractioncreator').then(
                _loadContainerActionCreator => { loadContainerActionCreator = _loadContainerActionCreator; }),
            import('./utility/genericdialog').then(_GenericDialog => { GenericDialog = _GenericDialog; }),
            import('./utility/userdetails/userinfo/operationmodehelper').then(
                _operationModeHelper => { operationModeHelper = _operationModeHelper; }),
            import('./utility/markeroperationmode/markeroperationmodefactory').then(
                _markerOperationModeFactory => { markerOperationModeFactory = _markerOperationModeFactory; }),
            import('../stores/teammanagement/teammanagementstore').then(
                _teamManagementStore => { teamManagementStore = _teamManagementStore; }),
            import('../actions/applicationoffline/applicationactioncreator').then(
                _applicationActionCreator => { applicationActionCreator = _applicationActionCreator; }),
            import('./adminsupport/adminsupportcontainer').then(
                _AdminSupportContainer => { AdminSupportContainer = _AdminSupportContainer; }),
            import('./worklist/worklistbasecontainer').then(
                _WorklistBaseContainer => { WorklistBaseContainer = _WorklistBaseContainer; }),
            import('./qigselector/qigselectorbasecontainer').then(
                _QigSelectorBaseContainer => { QigSelectorBaseContainer = _QigSelectorBaseContainer; }),
            import('./response/responsebasecontainer').then(
                _ResponseBaseContainer  => { ResponseBaseContainer = _ResponseBaseContainer; }),
            import('./message/messagebasecontainer').then(
                _MessageBaseContainer  => { MessageBaseContainer = _MessageBaseContainer; }),
            import('./teammanagement/teammanagementbasecontainer').then(
                _TeamManagementBaseContainer  => { TeamManagementBaseContainer = _TeamManagementBaseContainer; }),
            import('./standardisationsetup/standardisationsetupbasecontainer').then(
                _StandardisationSetupBaseContainer  => { StandardisationSetupBaseContainer = _StandardisationSetupBaseContainer; }),
            import('./awarding/awardingbasecontainer').then(_AwardingBaseContainer  => { AwardingBaseContainer = _AwardingBaseContainer; }),
            import('./reports/reportsbasecontainer').then(_ReportsBaseContainer  => { ReportsBaseContainer = _ReportsBaseContainer; })
        );

        this.moduleLoaded = true;
        this.setState({ renderedOn: Date.now() });
        this.networkStatusChanged(true);
        navigationStore.instance.addListener(navigationStore.NavigationStore.CONTAINER_CHANGE__EVENT, this.refreshState);
        applicationStore.instance.addListener
        (applicationStore.ApplicationStore.ONLINE_STATUS_UPDATED_EVENT, this.networkStatusChanged);
    }

    /**
     *  refresh on container change.
     */
    private refreshState = (): void => {
        if (this.state.containerPage === enums.PageContainers.Login) {
            this.addLocaleStoreListeners();
            this.isNavigatedAfterFromLogin = true;
        }
        this.isFromMenu = navigationStore.instance.isFromMenu;
        this.containerPageType = navigationStore.instance.containerPageType;
        if (navigationStore.instance.containerPage !== enums.PageContainers.QigSelector) {
            this.updateHistory();
        }
        if (navigationStore.instance.containerPage === enums.PageContainers.Reports) {
            // Initiate a ping call and set the online status before rendering reports wrapper. 
            // Cannot rely on normal ping call interval because if the net connection is off while requesting the reports from menu,
            // then the application store will not get updated correctly since there is no data service call failure.
            // So there is no way to identify the network connection status change.
            // Update the network status and render the reportswrapper only if the system is in online mode
            applicationActionCreator.validateNetWorkStatus(true);
        } else {
            this.reportsMounted = false;
            this.setState({
                containerPage: navigationStore.instance.containerPage,
                renderedOn: Date.now()
            });
        }
    };

    /**
     *  log event on container change.
     */
    private logEventOnContainerChange(containerPage: enums.PageContainers) {
        /** logging event in google analytics or application insights based on the configuration */
        new auditLoggingHelper().logHelper.logEventOnContainerChange(enums.PageContainers[containerPage]);
    }

    /**
     * Set the selected language sate upon successfull confirmation from locale store.
     */
    private languageChanged = (): void => {
        this.setState({
            selectedLanguage: localeStore.instance.Locale,
            renderedOn: Date.now()
        });
    };

    /**
     * updating the history details
     */
    private updateHistory() {
        if (!qigStore.instance.selectedQIGForMarkerOperation) {
            return;
        }

        // Update the history while opening response from message also
        if ((navigationStore.instance.previousPage === enums.PageContainers.Message ||
            navigationStore.instance.previousPage === enums.PageContainers.WorkList) &&
            navigationStore.instance.containerPage !== enums.PageContainers.WorkList) {

            // adding to history item based on Marker Operation Mode
            let _historyItem: historyItem = new historyItem();
            if (markerOperationModeFactory.operationMode.isTeamManagementMode) {
                let _teamManagementHistoryInfo: teamManagementHistoryInfo = new teamManagementHistoryInfo();
                _teamManagementHistoryInfo.worklistType = worklistStore.instance.currentWorklistType;
                _teamManagementHistoryInfo.responseMode = worklistStore.instance.getResponseMode;
                _historyItem.qigId = operationModeHelper.markSchemeGroupId;
                _historyItem.qigName = qigStore.instance.selectedQIGForMarkerOperation.markSchemeGroupName + '-' +
                    qigStore.instance.selectedQIGForMarkerOperation.assessmentCode;
                _historyItem.timeStamp = Date.now();
                _teamManagementHistoryInfo.remarkRequestType = worklistStore.instance.getRemarkRequestType;
                _teamManagementHistoryInfo.subordinateExaminerRoleID = teamManagementStore.instance.examinerDrillDownData ?
                    teamManagementStore.instance.examinerDrillDownData.examinerRoleId : 0;
                _teamManagementHistoryInfo.subordinateExaminerID = teamManagementStore.instance.examinerDrillDownData ?
                    teamManagementStore.instance.examinerDrillDownData.examinerId : 0;
                _teamManagementHistoryInfo.supervisorExaminerRoleID = teamManagementStore.instance.selectedExaminerRoleId ?
                    teamManagementStore.instance.selectedExaminerRoleId : operationModeHelper.examinerRoleId;
                _teamManagementHistoryInfo.selectedTab = teamManagementStore.instance.selectedTeamManagementTab ?
                    teamManagementStore.instance.selectedTeamManagementTab : enums.TeamManagement.MyTeam;
                _teamManagementHistoryInfo.currentContainer = teamManagementStore.instance.examinerDrillDownData ?
                    enums.PageContainers.WorkList : enums.PageContainers.TeamManagement;
                _historyItem.team = _teamManagementHistoryInfo;
            } else {
                let _worklistHistoryInfo: worklistHistoryInfo = new worklistHistoryInfo();
                _worklistHistoryInfo.worklistType = worklistStore.instance.currentWorklistType;
                _worklistHistoryInfo.responseMode = worklistStore.instance.getResponseMode;
                _historyItem.qigId = operationModeHelper.markSchemeGroupId;
                _historyItem.qigName = qigStore.instance.selectedQIGForMarkerOperation.markSchemeGroupName + '-' +
                    qigStore.instance.selectedQIGForMarkerOperation.assessmentCode;
                _historyItem.timeStamp = Date.now();
                _worklistHistoryInfo.remarkRequestType = worklistStore.instance.getRemarkRequestType;
                _historyItem.myMarking = _worklistHistoryInfo;
            }
            let _isMarkingEnabled: boolean = qigStore.instance.selectedQIGForMarkerOperation &&
                qigStore.instance.selectedQIGForMarkerOperation.isMarkingEnabled;

            _historyItem.markingMethodId = qigStore.instance.selectedQIGForMarkerOperation.markingMethod;
            _historyItem.isElectronicStandardisationTeamMember =
                qigStore.instance.selectedQIGForMarkerOperation.isElectronicStandardisationTeamMember;

            // used for showing/hiding marking link in menu's histroy list under menu tab
            _historyItem.isMarkingEnabled = (_isMarkingEnabled
                && qigStore.instance.selectedQIGForMarkerOperation.examinerQigStatus !== enums.ExaminerQIGStatus.WaitingStandardisation
                && qigStore.instance.selectedQIGForMarkerOperation.currentMarkingTarget != null);

            // used for showing/hiding teammanagement link in menu's histroy list under menu tab
            _historyItem.isTeamManagementEnabled = qigStore.instance.selectedQIGForMarkerOperation &&
                qigStore.instance.selectedQIGForMarkerOperation.isTeamManagementEnabled;

            // used for showing/hiding standardisation setup link in menu's history list under menu tab.
            _historyItem.isStandardisationSetupEnabled =
                (qigStore.instance.isStandardisationSetupButtonVisible(qigStore.instance.selectedQIGForMarkerOperation) ||
                    qigStore.instance.isStandardisationSetupLinkVisible(qigStore.instance.selectedQIGForMarkerOperation));

            _historyItem.examinerRoleId = operationModeHelper.examinerRoleId;
            _historyItem.questionPaperPartId = qigStore.instance.selectedQIGForMarkerOperation.questionPaperPartId;

            loadContainerActionCreator.addToRecentHistory(_historyItem);
        }
    }

	/**
	 * Indicating network connection has resetted
	 */
    private networkStatusChanged(forceStartPoll: boolean = false): void {
        this.triggerApplicationOnlinePoll(forceStartPoll);
        this.isOnline = applicationStore.instance.isOnline;
        if (navigationStore.instance.containerPage === enums.PageContainers.Reports && !this.reportsMounted) {
            // if the reports is not already loaded then show offline popup when the system is in offline mode
            this.setOfflineContainer(true);
        }

        if (applicationStore.instance.isOnline && this.hasNetworkInterrupted) {
            this.hasNetworkInterrupted = false;
        }

        // set the container page as reports only if navigating to reports in online mode
        let containerPage = this.isOnline && navigationStore.instance.containerPage === enums.PageContainers.Reports ?
            navigationStore.instance.containerPage : this.state.containerPage;
        var that = this;
        setTimeout(() => {
            that.setState({
                containerPage: containerPage,
                renderedOn: Date.now()
            });
        });
    }

	/**
	 * Checking application is online.
	 */
    private ping(): void {
        applicationActionCreator.updateOnlineStatus();
    }

	/**
	 * Trigger ping
	 * @param forceStartPoll
	 */
    private triggerApplicationOnlinePoll(forceStartPoll: boolean = false): void {
        let interval: number;

        // If the application status has been changed update the call
        if (forceStartPoll ||
            this.isOnline !== applicationStore.instance.isOnline) {
            interval = applicationStore.instance.isOnline ? config.general.APPLICATION_ONLINE_CHECK_INTERVAL
                : config.general.APPLICATION_OFFLINE_CHECK_INTERVAL;

            // ensuring online & offline poll interval time is configured
            // ToDo check application status is online to select the interval.
            //timerHelper.setInterval(interval, this.ping) ;
            this.timer.clear();
            this.timer.set(interval, this.ping);
        }
    }

	/**
	 * Indicating whether we need to show the container is offline
	 * @param show
	 * @param systemError Force system to show offline for weback require error
	 */
    private setOfflineContainer(show: boolean, systemError: boolean = false): void {

        if (!this.isOnline || systemError) {

            if (systemError) {

                // If webpack failed intiate a ping call and set the online status.
                applicationActionCreator.validateNetWorkStatus();
            }

            this.hasNetworkInterrupted = true;
            this.setState({ renderedOn: Date.now() });
        }
    }

	/**
	 * Continue when the application is back online
	 */
    private onApplicationBackOnline(): void {
        this.hasNetworkInterrupted = false;
        this.setState({ renderedOn: Date.now() });
    }

    /**
     * Calls when reports wrapper is mounted.
     */
    private reportsDidMount = (): void => {
        this.reportsMounted = true;
    };
}
export = Navigator;