import React = require('react');
import Promise = require('es6-promise');
let classNames = require('classnames');
import Immutable = require('immutable');
import pureRenderComponent = require('../base/purerendercomponent');
import navigationStore = require('../../stores/navigation/navigationstore');
import enums = require('../utility/enums');
import MenuLink = require('./menulink');
import navigationHelper = require('../utility/navigation/navigationhelper');
import awardingStore = require('../../stores/awarding/awardingstore');
import localeStore = require('../../stores/locale/localestore');
import userInfoActionCreator = require('../../actions/userinfo/userinfoactioncreator');
import responseStore = require('../../stores/response/responsestore');
import markingActionCreator = require('../../actions/marking/markingactioncreator');
import breadCrumbItemInfo = require('../../utility/breadcrumb/breadcrumbiteminfo');
import worklistHistoryInfo = require('../../utility/breadcrumb/worklisthistoryinfo');
import qigSelectorActionCreator = require('../../actions/qigselector/qigselectoractioncreator');
import worklistActionCreator = require('../../actions/worklist/worklistactioncreator');
import ccActionCreator = require('../../actions/configurablecharacteristics/configurablecharacteristicsactioncreator');
import userOptionsHelper = require('../../utility/useroption/useroptionshelper');
import userOptionKeys = require('../../utility/useroption/useroptionkeys');
import qigStore = require('../../stores/qigselector/qigstore');
import stringFormatHelper = require('../../utility/stringformat/stringformathelper');
import stampStore = require('../../stores/stamp/stampstore');
import stampActionCreator = require('../../actions/stamp/stampactioncreator');
import examinerStore = require('../../stores/markerinformation/examinerstore');
import dataServiceHelper = require('../../utility/generic/dataservicehelper');
import responseSearchHelper = require('../../utility/responsesearch/responsesearchhelper');
import worklistStore = require('../../stores/worklist/workliststore');
import markerOperationModeFactory = require('../utility/markeroperationmode/markeroperationmodefactory');
import loginStore = require('../../stores/login/loginstore');
import loginSession = require('../../app/loginsession');
import historyItem = require('../../utility/breadcrumb/historyItem');
import teamManagementActionCreator = require('../../actions/teammanagement/teammanagementactioncreator');
import teamManagementStore = require('../../stores/teammanagement/teammanagementstore');
import markingCheckActionCreator = require('../../actions/markingcheck/markingcheckactioncreator');
import qigActionCreator = require('../../actions/qigselector/qigselectoractioncreator');
import cchelper = require('../../utility/configurablecharacteristic/configurablecharacteristicshelper');
import ccNames = require('../../utility/configurablecharacteristic/configurablecharacteristicsnames');
import storageAdapterHelper = require('../../dataservices/storageadapters/storageadapterhelper');
import busyIndicatorActionCreator = require('../../actions/busyindicator/busyindicatoractioncreator');
import userInfoStore = require('../../stores/userinfo/userinfostore');
import keyDownHelper = require('../../utility/generic/keydownhelper');
import bookmarkActionCreator = require('../../actions/bookmarks/bookmarkactioncreator');
import markerInformationActionCreator = require('../../actions/markerinformation/markerinformationactioncreator');
import applicationStore = require('../../stores/applicationoffline/applicationstore');
import applicationActionCreator = require('../../actions/applicationoffline/applicationactioncreator');
import navigationLoggingHelper = require('../utility/navigation/examinernavigationaudithelper');
import loggerConstants = require('../utility/loggerhelperconstants');
import responseHelper = require('../utility/responsehelper/responsehelper');
import auditLoggingHelper = require('../utility/auditlogger/auditlogginghelper');
import MenuSearchPanel = require('./menusearchpanel');
import searchResponseActionCreator = require('../../actions/searchresponse/searchresponseactioncreator');
import markSchemeHelper = require('../../utility/markscheme/markschemehelper');
import eCourseworkHelper = require('../utility/ecoursework/ecourseworkhelper');
import BusyIndicator = require('../utility/busyindicator/busyindicator');
import qigSummary = require('../../stores/qigselector/typings/qigsummary');
import standardisationActionCreator = require('../../actions/standardisationsetup/standardisationactioncreator');

/**
 * Props for the Menu Wrapper
 */
interface MenuWrapperProps extends LocaleSelectionBase, PropsBase {
    handleNavigationClick?: Function;
}

/**
 * All fields optional to allow partial state updates in setState
 */
interface State {
    isOpen: boolean;
    renderedOn?: number;
    isBusy?: boolean;
}

/**
 * React component class for Showing menu Page
 */
class MenuWrapper extends pureRenderComponent<MenuWrapperProps, State> {

    private navigateToHome: Function;
    private navigateToMessage: Function;
    private navigateToAwarding: Function;
    private navigateToLogin: Function;
    private navigateToReports: Function;
    private _historyItem: historyItem;
    private _qigid: number = 0;
    private _questionPaperPartId: number = 0;
    private _examinerRoleId: number = 0;
    private _failureCode: enums.FailureCode = enums.FailureCode.None;
    private storageAdapterHelper = new storageAdapterHelper();
    private logger: navigationLoggingHelper = new navigationLoggingHelper();
    private searchText: string = '';
    private busyIndicatorInvoker: enums.BusyIndicatorInvoker = enums.BusyIndicatorInvoker.none;
    private showBackgroundScreenOnBusy: boolean = false;
    // enum to identify history navigation area
    private historyNavigationArea: enums.HistoryNavigationArea = enums.HistoryNavigationArea.None;

    /**
     * constructor
     * @param props
     * @param state
     */
    constructor(props: MenuWrapperProps, state: State) {
        super(props, state);
        this.closeMenu = this.closeMenu.bind(this);
        this.navigateToHome = this.navigateToContainer.bind(this, enums.PageContainers.QigSelector);
        this.navigateToMessage = this.navigateToContainer.bind(this, enums.PageContainers.Message);
        this.navigateToAwarding = this.navigateToContainer.bind(this, enums.PageContainers.Awarding);
        this.navigateToLogin = navigationHelper.showLogoutConfirmation.bind(this);
        this.navigateToReports = this.navigateToContainer.bind(this, enums.PageContainers.Reports);
        this.setBusyIndicatorProperties(enums.BusyIndicatorInvoker.loadingResponse, false);
        this.state = { isOpen: false, renderedOn: 0, isBusy: false };
    }

    /**
     * Render method
     */
    public render() {

        let busyIndicator: JSX.Element = (<BusyIndicator id={'response_' + this.busyIndicatorInvoker.toString()}
            isBusy={this.state.isBusy}
            key={'response_' + this.busyIndicatorInvoker.toString()}
            isMarkingBusy={true}
            busyIndicatorInvoker={this.busyIndicatorInvoker}
            doShowDialog={true}
            showBackgroundScreen={this.showBackgroundScreenOnBusy} />);

        let className = classNames('dropdown-wrap header-dropdown nav-options',
            { 'open': this.state.isOpen });

        return (
            <li role='menuitem' id='menuwrapper' className={className} aria-haspopup='true'>
                <a id='menu-button' href='javascript:void(0)'
                    title={localeStore.instance.TranslateText('generic.navigation-bar.menu-tooltip')}
                    onClick={this.state.isOpen ? null : () => { this.props.handleNavigationClick(); }} className='menu-button'>
                    <span className='relative'>
                        <span id='menu-icon' className='sprite-icon hamburger-icon'></span>
                        <span className='nav-text'>{localeStore.instance.TranslateText('generic.navigation-bar.menu')}</span>
                    </span>
                </a>
                <div className='menu' role='menu' aria-hidden='true'>
                    <div className='menu-wrapper'>
                        <div className='menu-inner'>
                            <div className='left-menu-cols'>
                                <div className= 'menu-page-block menu-page-nav'>
                                <h2 id='menu-header'>{localeStore.instance.TranslateText('generic.navigation-bar.menu')}</h2>
                                <ul className='menu-holder quick-menu'>
                                    <MenuLink id='menuLink_Home' key='menuLink_Home_key'
                                        menuLinkName={localeStore.instance.TranslateText('generic.navigation-menu.home')}
                                        onMenuLinkClick={this.navigateToHome}
                                        isVisible={true} />
                                    <MenuLink id='menuLink_Reports' key='menuLink_Reports_key'
                                        menuLinkName={localeStore.instance.TranslateText('generic.navigation-menu.reports')}
                                        onMenuLinkClick={this.navigateToReports}
                                        isVisible={this.canRenderReports} />
                                    <MenuLink id='menuLink_Inbox' key='menuLink_Inbox_key'
                                        menuLinkName={localeStore.instance.TranslateText('messaging.message-lists.top-panel.inbox-tab')}
                                        onMenuLinkClick={this.navigateToMessage}
                                        isVisible={true} />
                                    <MenuLink id='menuLink_Awarding' key='menuLink_Awarding_key'
                                        menuLinkName={localeStore.instance.TranslateText('awarding.generic.awarding')}
                                        onMenuLinkClick={this.navigateToAwarding}
                                        isVisible={awardingStore.instance.hasAwardingAccess} />
                                    <MenuLink id='menuLink_Logout' key='menuLink_Logout_key'
                                        menuLinkName={localeStore.instance.TranslateText('generic.user-menu.profile-section.logout-button')}
                                        onMenuLinkClick={this.navigateToLogin}
                                        isVisible={true} />
                                </ul>
                                </div>
                                {this.searchResponse}
                            </div>
                            {this.recentHistory}
                        </div>
                    </div>
                    <a href='javascript:void(0)' id='menu-close'
                        className='menu-close' onClick={this.closeMenu}
                        title={localeStore.instance.TranslateText('generic.navigation-menu.close')}>
                        {localeStore.instance.TranslateText('generic.navigation-menu.close')}</a>
                </div>
                {busyIndicator}
            </li>
        );
    }

    /**
     * Component will Unmount
     */
    public componentWillUnmount() {
        navigationStore.instance.removeListener(navigationStore.NavigationStore.MENU_VISIBILITY_EVENT, this.menuVisibility);
        worklistStore.instance.removeListener(worklistStore.WorkListStore.WORKLIST_HISTORY_INFO_UPDATED, this.loadRecentWorklist);
        qigStore.instance.removeListener(qigStore.QigStore.QIG_SELECTED_FROM_HISTORY_EVENT, this.onQigSelectedFromHistory);
        teamManagementStore.instance.removeListener(teamManagementStore.TeamManagementStore.TEAM_MANAGEMENT_EXAMINER_VALIDATED_EVENT,
            this.examinerValidated);
        teamManagementStore.instance.removeListener(teamManagementStore.TeamManagementStore.OPEN_TEAM_MANAGEMENT_EVENT,
            this.openTeamManagementFromPopup);
        responseStore.instance.removeListener(responseStore.ResponseStore.RESPONSE_SEARCH_DATA_RECEIVED_EVENT,
            this.initiateSearchResponse);
    }

    /**
     * Component did mount
     */
    public componentDidMount() {
        navigationStore.instance.addListener(navigationStore.NavigationStore.MENU_VISIBILITY_EVENT, this.menuVisibility);
        worklistStore.instance.addListener(worklistStore.WorkListStore.WORKLIST_HISTORY_INFO_UPDATED, this.loadRecentWorklist);
        qigStore.instance.addListener(qigStore.QigStore.QIG_SELECTED_FROM_HISTORY_EVENT, this.onQigSelectedFromHistory);
        teamManagementStore.instance.addListener(teamManagementStore.TeamManagementStore.TEAM_MANAGEMENT_EXAMINER_VALIDATED_EVENT,
            this.examinerValidated);
        teamManagementStore.instance.addListener(teamManagementStore.TeamManagementStore.OPEN_TEAM_MANAGEMENT_EVENT,
            this.openTeamManagementFromPopup);
        responseStore.instance.addListener(responseStore.ResponseStore.RESPONSE_SEARCH_DATA_RECEIVED_EVENT,
            this.initiateSearchResponse);
    }

    /**
     * used to set the visibility of menu Wrapper
     */
    private menuVisibility = (doVisible: boolean = true): void => {

        let message = doVisible ? 'Open menu event triggered' : 'Close menu event triggered.';
        message = message + ' Current container => ' +
            enums.PageContainers[navigationStore.instance.containerPage];
        // logging menu action in google analytics or application insight based on the configuration
        new auditLoggingHelper().logHelper.logEventOnMenuAction(message);

        if (markerOperationModeFactory.operationMode.isSetMarkingInProgressAndMarkEntrySelectedRequired && doVisible) {
            keyDownHelper.instance.DeActivate(enums.MarkEntryDeactivator.Menu);
        }
        this.setState({
            isOpen: doVisible
        });

        // Log opened response details to keep as audit.
        this.logger.logResponseOpenAudit(loggerConstants.NAVIGATION_REASON_MENU_SCREEN,
            loggerConstants.NAVIGATION_REASON_MENU_CLICK,
            responseStore && responseStore.instance.selectedDisplayId ? responseStore.instance.selectedDisplayId.toString() : '',
            responseStore && responseStore.instance.selectedResponseMode !== undefined ?
                enums.ResponseMode[responseStore.instance.selectedResponseMode].toString() : '');
    };

    /**
     * used to close menu Wrapper
     */
    private closeMenu = (): void => {
        if (markerOperationModeFactory.operationMode.isSetMarkingInProgressAndMarkEntrySelectedRequired) {
            markingActionCreator.setMarkEntrySelected(false);
            keyDownHelper.instance.Activate(enums.MarkEntryDeactivator.Menu);
        }

        let message = 'Close menu event triggered.';
        message = message + ' Current container => ' +
            enums.PageContainers[navigationStore.instance.containerPage];
        // logging menu action in google analytics or application insight based on the configuration
        new auditLoggingHelper().logHelper.logEventOnMenuAction(message);
        // Cleared the search text while clicking close button.
        this.searchText = '';
        this.setState({
            isOpen: false
        });


        // Log opened response details to keep as audit.
        this.logger.logResponseOpenAudit(loggerConstants.NAVIGATION_REASON_MENU_SCREEN,
            loggerConstants.NAVIGATION_REASON_MENU_CLOSE_CLICK,
            responseStore && responseStore.instance.selectedDisplayId ? responseStore.instance.selectedDisplayId.toString() : '',
            responseStore && responseStore.instance.selectedResponseMode !== undefined ?
                enums.ResponseMode[responseStore.instance.selectedResponseMode].toString() : '');
    };

    /**
     * used to navigate to particular container
     */
    private navigateToContainer(container: enums.PageContainers) {
        if (this.doNavigateContainer(container)) {
            if (container !== enums.PageContainers.Response) {
                markingActionCreator.setMarkingInProgress(false);
            }

            // resetting the marking check mode on menu item click
            markingCheckActionCreator.toggleMarkingCheckMode(false);

            // handle offline when try to navigate from menu
            if (!applicationStore.instance.isOnline) {
                applicationActionCreator.checkActionInterrupted();
            } else {
                switch (container) {
                    case enums.PageContainers.QigSelector:
                        navigationHelper.loadQigSelector();
                        break;
                    case enums.PageContainers.Message:
                        navigationHelper.loadMessagePage();
                        break;
                    case enums.PageContainers.Login:
                        navigationHelper.loadLoginPage();
                        break;
                    case enums.PageContainers.Reports:
                        navigationHelper.loadReportsPage();
                        break;
                    case enums.PageContainers.Awarding:
                        navigationHelper.loadAwardingPage(true);
                        break;
                }
            }
        } else {
            let message = 'Selected the same container ' +
                enums.PageContainers[container].toString() +
                ' from menu with Close menu event triggered.';
            message = message + ' Current container => ' +
                enums.PageContainers[navigationStore.instance.containerPage];
            // logging menu action in google analytics or application insight based on the configuration
            new auditLoggingHelper().logHelper.logEventOnMenuAction(message);

            this.setState({
                isOpen: false
            });
        }
    }

    /**
     * return false if current and navigateTo conatainer are same
     */
    private doNavigateContainer(navigateToContainer: enums.PageContainers): boolean {
        let _currentContainer: enums.PageContainers = enums.PageContainers.None;
        _currentContainer = navigationStore.instance.containerPage;
        return navigateToContainer !== _currentContainer;
    }


    private get recentHistory() {
        let _recentHistory: Immutable.List<historyItem> = Immutable.List<historyItem>();

        let historyItems: historyItem[] = [];
        navigationStore.instance.getRecentHistory.forEach(qigInHistory => {
            if (qigStore.instance.HiddenQIGs.indexOf(qigInHistory.qigId) === -1) {
                let qig = qigStore.instance.getQigSummary(qigInHistory.qigId);
                if (qigStore.instance.getOverviewData.hasAnyQigWithHideInOverviewWhenNoWorkCCOn
                    && qig.isHideInOverviewWhenNoWorkCCON) {
                    qigInHistory.myMarking = qig.isMarkingEnabled ? qigInHistory.myMarking : undefined;
                    qigInHistory.isMarkingEnabled = qig.isMarkingEnabled;
                    qigInHistory.team = qig.isTeamManagementEnabled ? qigInHistory.team : undefined;
                    qigInHistory.isTeamManagementEnabled = qig.isTeamManagementEnabled;
                    qigInHistory.isStandardisationSetupEnabled = (qig.isStandardisationSetupButtonVisible ||
                        qig.isStandardisationSetupLinkVisible);
                    qigInHistory.standardisationSetup = (qigInHistory.isStandardisationSetupEnabled ?
                        qigInHistory.standardisationSetup : undefined);
                }
                historyItems.push(qigInHistory);
            }
        });
        _recentHistory = Immutable.List(historyItems);
        let that = this;
        let recentItems = _recentHistory.map((recentItem: historyItem) => {
            return (
                <MenuLink
                    menuString={recentItem.qigName}
                    onMyMarkingClick={recentItem.myMarking ?
                        that.navigateToRecentHistoryMyMarking.bind(that, recentItem, null, null) :
                        recentItem.isMarkingEnabled ?
                            that.navigateToRecentHistoryMyMarking.bind(that,
                                null,
                                recentItem.qigId,
                                recentItem.questionPaperPartId) :
                            null}
                    onTeamManagementClick={recentItem.team ?
                        that.navigateToRecentHistoryTeamManagement.bind(that, recentItem, null, null, null) :
                        recentItem.isTeamManagementEnabled ?
                            that.navigateToRecentHistoryTeamManagement.bind(that,
                                null,
                                recentItem.qigId,
                                recentItem.questionPaperPartId,
                                recentItem.examinerRoleId) :
                            null}
                    onStandardisationSetupClick={recentItem.standardisationSetup ?
                        that.navigateToRecentHistoryStandardisationSetup.bind(that, recentItem, null) :
                        recentItem.isStandardisationSetupEnabled ?
                            that.navigateToRecentHistoryStandardisationSetup.bind(that,
                                null,
                                recentItem.qigId) :
                            null}
                    isRecentHistory={true}
                    selectedLanguage={that.props.selectedLanguage}
                    recentItem={recentItem}
                    id={'menuLink_' + recentItem.qigId}
                    key={'menuLink_key_' + recentItem.qigId}/>);
        });

        return (
            <div className='right-menu-cols'>
                <div className='menu-page-block menu-page-recent'>
                <h2 id='recent'>{localeStore.instance.TranslateText('generic.navigation-menu.recent')}</h2>
                <ul className='menu-holder recent-items' id='menuHolder'>
                    {recentItems}
                </ul>
               </div>
            </div>);
    }

    private get searchResponse() {
        let searchPanel: JSX.Element = this.isSearchPanelVisible() ?
            (  <MenuSearchPanel
                    id='search-panel'
                    key='search-panel-key'
                    onSearch={this.onSearch}
                    onSearchClick={this.onSearchClick}
                    qigName={this.getFormattedQIGName()}
                    searchText = {this.searchText}
                />) : null;

        return searchPanel;
    }

    /* Called when search text changed */
    private onSearch = (searchText: string) => {
        this.searchText = searchText;
        this.setState({renderedOn: Date.now()});
    }

    /* Called when search button clicked */
    private onSearchClick = () => {
        if (this.searchText && this.searchText !== '' && this.isValidSearchText(this.searchText)) {
            if (qigStore.instance.selectedQIGForMarkerOperation) {
                let selectedQIGForMarkerOperation = qigStore.instance.selectedQIGForMarkerOperation;
                searchResponseActionCreator.getSearchedResponse(
                    selectedQIGForMarkerOperation.markSchemeGroupId,
                    qigStore.instance.getSelectedQIGForTheLoggedInUser.examinerRoleId,
                    this.searchText);
                this.setBusyIndicatorProperties(enums.BusyIndicatorInvoker.loadingResponse, false);
                // The below condition will be removed as part of search rig from response screen
                // feature implementation.
                if (navigationStore.instance.containerPage !== enums.PageContainers.Response) {
                    this.setState({ isBusy: true });
                }
            }
        } else {
				searchResponseActionCreator.showOrHideRigNotFoundPopup(true);
		}
    }

    /**
     * Validate the entered search text.
     */
	private isValidSearchText(searchText: string): boolean {
		let displayId : number = Math.floor(Number(searchText));
		return displayId !== Infinity && String(displayId) === searchText && displayId >= 0;
	}

    /**
     * navigate to worklist based on history item
     */
    private navigateToRecentHistoryMyMarking(_historyItem?: historyItem, _qigId?: number, _questionPaperPartId?: number) {
        /*Handles the scenario where user is offline on clicking on history link in menu*/
        if (!applicationStore.instance.isOnline) {
            applicationActionCreator.checkActionInterrupted();
        } else {
            // Menu history navigation to my marking
            this.historyNavigationArea = enums.HistoryNavigationArea.Marking;

            this._failureCode = undefined;
            // response is getting closed, inform modules.
            worklistActionCreator.responseClosed(true);
            //bookmarkActionCreator.bookmarkAdded(null);
            // resetting the marking check mode on menu item click
            markingCheckActionCreator.toggleMarkingCheckMode(false);

            busyIndicatorActionCreator.setBusyIndicatorInvoker(enums.BusyIndicatorInvoker.loadingHistoryDetails);

            let message = 'Selected My Marking from menu with Close menu event triggered.';
            message = message + ' Current container => ' +
                enums.PageContainers[navigationStore.instance.containerPage];
            // logging menu action in google analytics or application insights based on the configuration
            new auditLoggingHelper().logHelper.logEventOnMenuAction(message);

            this.setState({ isOpen: false });
            let that = this;
            this._historyItem = JSON.parse(JSON.stringify(_historyItem));
            let qigId: number = _qigId > 0 ? _qigId : this._historyItem.qigId;
            // set the marker operation mode as Marking
            userInfoActionCreator.changeOperationMode(enums.MarkerOperationMode.Marking, false, true);

            // Invoke the action creator to Open the QIG
            let getQIGSelectorDataPromise = qigActionCreator.getQIGSelectorData(qigId, true, false, true, false, true);

            Promise.Promise.all(
                [
                    getQIGSelectorDataPromise
                ]).then(function (result: any) {
                    let selectedQIGForMarkerOperation = qigStore.instance.selectedQIGForMarkerOperation;
                    // The Qigstore become undefined when the marker is withrawn in background,.
                    // Need to show withdrawn poup while clicking marking link from menu.
                    if (selectedQIGForMarkerOperation === undefined) {
                        // Load the worklist while navigating to worklist from inbox through menu.
                        if (navigationStore.instance.containerPage === enums.PageContainers.Message) {
                            navigationHelper.loadWorklist(true);
                        }
                        // upadte examiner store , and withdrawn poup will be displyed from footer.
                        markerInformationActionCreator.
                            GetMarkerInformation(that._historyItem.examinerRoleId, qigId, true, false,
                            examinerStore.instance.examinerApprovalStatus(that._historyItem.examinerRoleId));
                        return;
                    }

                    responseSearchHelper.openQIGDetails(
                        selectedQIGForMarkerOperation.questionPaperPartId,
                        selectedQIGForMarkerOperation.markSchemeGroupId,
                        selectedQIGForMarkerOperation.examinerRoleId,
                        dataServiceHelper.canUseCache(),
                        examinerStore.instance.examinerApprovalStatus(selectedQIGForMarkerOperation.examinerRoleId),
                        selectedQIGForMarkerOperation.markingMethod,
                        false,
                        selectedQIGForMarkerOperation.isElectronicStandardisationTeamMember);

                    // load stamps defined for the selected mark scheme groupId
                    stampActionCreator.getStampData(qigStore.instance.selectedQIGForMarkerOperation.markSchemeGroupId,
                        stampStore.instance.stampIdsForSelectedQIG,
                        qigStore.instance.selectedQIGForMarkerOperation.markingMethod,
                        responseHelper.isEbookMarking,
                        true);

                    // Calling the helper method to format the QIG Name
                    let currQigName = stringFormatHelper.formatAwardingBodyQIG(
                        selectedQIGForMarkerOperation.markSchemeGroupName,
                        selectedQIGForMarkerOperation.assessmentCode,
                        selectedQIGForMarkerOperation.sessionName,
                        selectedQIGForMarkerOperation.componentId,
                        selectedQIGForMarkerOperation.questionPaperName,
                        selectedQIGForMarkerOperation.assessmentName,
                        selectedQIGForMarkerOperation.componentName,
                        stringFormatHelper.getOverviewQIGNameFormat());

                    // logging qig selection in google analytics or application insights based on the configuration.
                    new auditLoggingHelper().logHelper.logEventOnQigSelection(currQigName);

                    if (that._historyItem) {
                        // update the worklist store before navigation
                        if (that._historyItem.myMarking.worklistType === enums.WorklistType.simulation
                            && selectedQIGForMarkerOperation.standardisationSetupComplete) {
                            that._historyItem.myMarking.worklistType = enums.WorklistType.none;
                        }
                        worklistActionCreator.setWorklistHistoryInfo(that._historyItem, enums.MarkerOperationMode.Marking);
                    }

                    navigationHelper.loadWorklist(true);
                });
        }
    }

    /**
     * navigate to team Management based on history item
     */
    private navigateToRecentHistoryTeamManagement(_historyItem?: historyItem,
        _qigid?: number,
        _questionPaperPartId?: number,
        _examinerRoleId?: number) {
        /*Handles the scenario where user is offline on clicking on history link in menu*/
        if (!applicationStore.instance.isOnline) {
            applicationActionCreator.checkActionInterrupted();
        } else {
            busyIndicatorActionCreator.setBusyIndicatorInvoker(enums.BusyIndicatorInvoker.loadingHistoryDetails);

            // Menu history navigation to team management
            this.historyNavigationArea = enums.HistoryNavigationArea.TeamManagement;

            let message = 'Selected Team Management from menu with Close menu event triggered.';
            message = message + ' Current container => ' +
                enums.PageContainers[navigationStore.instance.containerPage];
            // logging menu action in google analytics or application insights based on the configuration
            new auditLoggingHelper().logHelper.logEventOnMenuAction(message);

            this.setState({ isOpen: false });
            // resetting the marking check mode on menu item click
            markingCheckActionCreator.toggleMarkingCheckMode(false);

            this._historyItem = _historyItem ? JSON.parse(JSON.stringify(_historyItem)) : null;
            this._qigid = _qigid ? _qigid : 0;
            this._questionPaperPartId = _questionPaperPartId ? _questionPaperPartId : 0;
            this._examinerRoleId = _examinerRoleId ? _examinerRoleId : 0;

            if (this._historyItem !== null) {

                // clear my-team data and help-examiner data from cache
                this.storageAdapterHelper.clearTeamDataCache(this._historyItem.team.supervisorExaminerRoleID,
                    this._historyItem.qigId);
                this.storageAdapterHelper.clearTeamDataCache(this._historyItem.team.supervisorExaminerRoleID,
                    this._historyItem.qigId, true);
                let examinerValidationArea: enums.ExaminerValidationArea =
                    enums.ExaminerValidationArea.MyTeam;
                if (this._historyItem.team.selectedTab === enums.TeamManagement.HelpExaminers &&
                    this._historyItem.team.currentContainer === enums.PageContainers.WorkList) {
                    examinerValidationArea = enums.ExaminerValidationArea.HelpExaminer;
                }
                // validates the examiner
                teamManagementActionCreator.teamManagementExaminerValidation(this._historyItem.qigId,
                    this._historyItem.team.supervisorExaminerRoleID,
                    this._historyItem.team.subordinateExaminerRoleID,
                    this._historyItem.team.subordinateExaminerID,
                    examinerValidationArea,
                    false);
            } else {
                teamManagementActionCreator.teamManagementExaminerValidation(this._qigid);
            }
        }
    }

    /**
     * Load worklist
     */
    private loadRecentWorklist = (_historyItem: historyItem, _markingMode: enums.MarkerOperationMode): void => {
        if (_markingMode === enums.MarkerOperationMode.Marking) {
            navigationHelper.loadWorklist(true);

            let message = 'Loading worklist from menu with Close menu event triggered.';
            message = message + ' Current container => ' +
                enums.PageContainers[navigationStore.instance.containerPage];
            // logging menu action in google analytics or application insights based on the configuration
            new auditLoggingHelper().logHelper.logEventOnMenuAction(message);

            this.setState({
                isOpen: false
            });
        }
    };

    /**
     * after examiner validation do operation based on history details
     */
    private examinerValidated = (failureCode: enums.FailureCode = enums.FailureCode.None): void => {
        this._failureCode = failureCode;
        busyIndicatorActionCreator.setBusyIndicatorInvoker(enums.BusyIndicatorInvoker.loadingHistoryDetails);
        // for these two error codes there is no need to fetch other data's we can
        // directly navigating to qig selector by clearing latest cache data
        if (this._failureCode === enums.FailureCode.Withdrawn || this._failureCode === enums.FailureCode.NotTeamLead) {
            this.storageAdapterHelper.clearCacheByKey('qigselector', 'overviewdata');
            navigationHelper.loadQigSelector();

            if (this._historyItem) {
                this._qigid = this._historyItem.qigId;
            }
            teamManagementActionCreator.removeHistoryItem(this._qigid, this._failureCode === enums.FailureCode.NotTeamLead);

            let message = 'Loading Qigselector from menu as the examiner is Withdrawn/NotTeamLead.Close menu event triggered.';
            message = message + ' Current container => ' +
                enums.PageContainers[navigationStore.instance.containerPage];
            // logging menu action in google analytics or application insights based on the configuration
            new auditLoggingHelper().logHelper.logEventOnMenuAction(message);

            this.setState({ isOpen: false });
        } else {

            // response is getting closed, inform modules.
            worklistActionCreator.responseClosed(true);

            let changeOperationModePromise;
            if (userInfoStore.instance.currentOperationMode !== enums.MarkerOperationMode.TeamManagement) {
                changeOperationModePromise = userInfoActionCreator.changeOperationMode(
                    enums.MarkerOperationMode.TeamManagement, false, true);
            }
            if (!this._historyItem && this._qigid) {

                // while team management is opened for first time through menu history link,the
                // history item value will be null, so we need to do the exact action
                // which happens while clicking teamManagement button from qigSelector

                ccActionCreator.getMarkSchemeGroupCCs(this._qigid, this._questionPaperPartId, true, true);

                // if the user has the remember-qig option then 'qigOverviewData' will be null
                // in this case while the user navigates to teammanagement using recent history option,
                // this value will be null,to avoid this we need to update this value.
                if (qigStore.instance.getOverviewData) {
                    let that = this;
                    let openQigPromise = qigSelectorActionCreator.openQIG(this._qigid, false, true);
                    Promise.Promise.all([changeOperationModePromise, openQigPromise]).then(function (item: any) {
                        teamManagementActionCreator.openTeamManagement(that._examinerRoleId, that._qigid, false, true);
                    });
                } else {
                    let that = this;
                    let getQIGSelectorDataPromise = qigActionCreator.getQIGSelectorData(this._qigid, false, false, false, true, false);
                    Promise.Promise.all([getQIGSelectorDataPromise]).then(function (item: any) {
                        teamManagementActionCreator.openTeamManagement(that._examinerRoleId, that._qigid, false, true);
                    });
                }

                let message = 'Loading TeamManagement from menu  with Close menu event triggered.';
                message = message + ' Current container => ' +
                    enums.PageContainers[navigationStore.instance.containerPage];
                // logging menu action in google analytics or application insights based on the configuration
                new auditLoggingHelper().logHelper.logEventOnMenuAction(message);

                this.setState({
                    isOpen: false
                });
            } else {
                let ccActionCreatorPromise = ccActionCreator.getMarkSchemeGroupCCs(
                    this._historyItem.qigId,
                    this._historyItem.questionPaperPartId,
                    true,
                    true);

                let that = this;
                Promise.Promise.all(
                    [changeOperationModePromise, ccActionCreatorPromise]).then(function (item: any) {
                        // Invoke the action creator to Open the QIG for the logged in user
                        let getQIGSelectorDataPromise = qigActionCreator.getQIGSelectorData
                            (that._historyItem.qigId, true, false, true, false, true);

                    });
            }
        }
    };

    /**
     * updates details to store
     */
    private onQigSelectedFromHistory = () => {
        if (this.historyNavigationArea === enums.HistoryNavigationArea.StandardisationSetup) {
            // if navigating from history item(ie, marker has navigated to ssu) then set history info in store
            if (this._historyItem && this._historyItem.standardisationSetup) {
                standardisationActionCreator.setStandardisationSetupHistoryInfo(this._historyItem);
            }
            // Get Standardisation Setup Qig Details
            responseSearchHelper.getStandardisationSetupQigDetails();
            // Navigate to Standardisation setup
            navigationHelper.loadStandardisationSetup();
        } else {

            if (!this._historyItem || this._failureCode === undefined) {
                return;
            }

            busyIndicatorActionCreator.setBusyIndicatorInvoker(enums.BusyIndicatorInvoker.loadingHistoryDetails);

            // avoid getting worklist data's for these error codes
            switch (this._failureCode) {
                case enums.FailureCode.SubordinateExaminerWithdrawn:
                case enums.FailureCode.HierarchyChanged:
                    teamManagementActionCreator.setTeamManagementHistoryInfo(this._historyItem,
                        enums.MarkerOperationMode.TeamManagement, this._failureCode);

                    let message = 'Loading Qigselector from menu as the examiner is ' +
                        'SubordinateExaminerWithdrawn / HierarchyChanged.Close menu event triggered.';
                    message = message + ' Current container => ' +
                        enums.PageContainers[navigationStore.instance.containerPage];
                    // logging menu action in google analytics or application insights based on the configuration
                    new auditLoggingHelper().logHelper.logEventOnMenuAction(message);

                    this.setState({
                        isOpen: false
                    });
                    return;
            }

            // update the history details to specific stores
            let teamManagementHistoryPromise =
                teamManagementActionCreator.setTeamManagementHistoryInfo(this._historyItem, enums.MarkerOperationMode.TeamManagement);

            let that = this;
            Promise.Promise.all([teamManagementHistoryPromise]).
                then(function (item: any) {
                    if (that._historyItem.team.currentContainer !== enums.PageContainers.TeamManagement) {
                        // team Management worklist.
                        if (that._historyItem.team.selectedTab === enums.TeamManagement.HelpExaminers && cchelper.getCharacteristicValue(
                            ccNames.SeniorExaminerPool,
                            that._historyItem.qigId ).toLowerCase() === 'true') {

                            // since it from help examiner, this db call is needed for showing change status button in worklist
                            let getHelpExaminerDataPromise =
                                teamManagementActionCreator.GetHelpExminersData(that._historyItem.team.supervisorExaminerRoleID,
                                    that._historyItem.qigId, false, true);
                        }

                        let getQIGSelectorDataPromise1 =
                            qigActionCreator.getQIGSelectorData(that._historyItem.qigId, false, false, false, true, false);
                        Promise.Promise.all([getQIGSelectorDataPromise1]).
                            then(function (item: any) {
                                that.onQigLoadedFromHistory();
                            });

                    } else {

                        let message = 'Loading the same container(Team Management) from menu. Close menu event triggered.';
                        message = message + ' Current container => ' +
                            enums.PageContainers[navigationStore.instance.containerPage];
                        // logging menu action in google analytics or application insights based on the configuration
                        new auditLoggingHelper().logHelper.logEventOnMenuAction(message);

                        // Team Management Container.
                        that.setState({ isOpen: false });
                        busyIndicatorActionCreator.setBusyIndicatorInvoker(enums.BusyIndicatorInvoker.none);
                    }
                });
        }
    };

    /**
     * load details needed for worklist and navigate
     */
    private onQigLoadedFromHistory = () => {
        busyIndicatorActionCreator.setBusyIndicatorInvoker(enums.BusyIndicatorInvoker.loadingHistoryDetails);
        responseSearchHelper.openQIGDetails(
            this._historyItem.questionPaperPartId,
            this._historyItem.qigId,
            this._historyItem.team.subordinateExaminerRoleID,
            dataServiceHelper.canUseCache(),
            examinerStore.instance.examinerApprovalStatus(this._historyItem.team.subordinateExaminerRoleID),
            this._historyItem.markingMethodId,
            false,
            this._historyItem.isElectronicStandardisationTeamMember);

        // load stamps defined for the selected mark scheme groupId
        stampActionCreator.getStampData(this._historyItem.qigId,
            stampStore.instance.stampIdsForSelectedQIG,
            this._historyItem.markingMethodId,
            responseHelper.isEbookMarking,
            true);

        let message = 'Qig selected from history. Close menu event triggered.';
        message = message + ' Current container => ' +
            enums.PageContainers[navigationStore.instance.containerPage];
        // logging menu action in google analytics or application insights based on the configuration
        new auditLoggingHelper().logHelper.logEventOnMenuAction(message);

        navigationHelper.loadWorklist(true);
        this.setState({
            isOpen: false
        });
    };

    /**
     * Gets the reports in menu according to the login.
     */
    private get canRenderReports(): boolean {
        return loginSession.IS_FAMILIARISATION_LOGIN === true ? false : loginStore.instance.isReportsVisible;
    }

    private openTeamManagementFromPopup = () => {

        let message = 'Opening team management from history. Close menu event triggered.';
        message = message + ' Current container => ' +
            enums.PageContainers[navigationStore.instance.containerPage];
        // logging menu action in google analytics or application insights based on the configuration
        new auditLoggingHelper().logHelper.logEventOnMenuAction(message);

        this.setState({
            isOpen: false
        });
    }

    /**
     * Get Formatted QIG Name
     */
    private getFormattedQIGName(): string {
        if (qigStore.instance.selectedQIGForMarkerOperation) {
            return localeStore.instance.TranslateText('search-response.search-response-content-appender') + ' ' +
			    stringFormatHelper.formatAwardingBodyQIG(
				qigStore.instance.selectedQIGForMarkerOperation.markSchemeGroupName,
                qigStore.instance.selectedQIGForMarkerOperation.assessmentCode,
                qigStore.instance.selectedQIGForMarkerOperation.sessionName,
                qigStore.instance.selectedQIGForMarkerOperation.componentId,
                qigStore.instance.selectedQIGForMarkerOperation.questionPaperName,
                qigStore.instance.selectedQIGForMarkerOperation.assessmentName,
                qigStore.instance.selectedQIGForMarkerOperation.componentName,
                stringFormatHelper.getOverviewQIGNameFormat());
        }
    }

    /**
     * Check whether the search panel is visible or not.
     */
    private isSearchPanelVisible(): boolean {
        if ((userInfoStore.instance.currentOperationMode === enums.MarkerOperationMode.Marking ||
            userInfoStore.instance.currentOperationMode === enums.MarkerOperationMode.TeamManagement) &&
            navigationStore.instance.containerPage !== enums.PageContainers.QigSelector &&
            navigationStore.instance.containerPage !== enums.PageContainers.Message &&
            navigationStore.instance.containerPage !== enums.PageContainers.Awarding &&
            navigationStore.instance.containerPage !== enums.PageContainers.StandardisationSetup &&
            navigationStore.instance.containerPage !== enums.PageContainers.Reports) {
            return true;
        }

        return false;
    }

    /**
     * Data Received For Opening the response.
     */
    private initiateSearchResponse = (searchedResponseData: SearchedResponseData) => {
        if (searchedResponseData) {
            if (userInfoStore.instance.currentOperationMode === enums.MarkerOperationMode.Marking) {
                if (navigationStore.instance.containerPage === enums.PageContainers.WorkList) {
                    if (!searchedResponseData.isTeamManagement) {
                        this.openResponseFromWorkList(searchedResponseData);
                    }
                }
            } else if (userInfoStore.instance.currentOperationMode === enums.MarkerOperationMode.TeamManagement) {
                if (searchedResponseData.isTeamManagement) {
                    if (navigationStore.instance.containerPage === enums.PageContainers.WorkList) {
                        if (qigStore.instance.selectedQIGForMarkerOperation.examinerRoleId !== searchedResponseData.examinerRoleId) {
                            /*
                               If searched response is not belongs to current marker's worklist type or response mode
                               then , we have to fetch marker information, worklist type and
                               candidate meta data to update store values before opening the searched response.
                           */
                            markerInformationActionCreator.GetMarkerInformation(
                                searchedResponseData.examinerRoleId,
                                searchedResponseData.markSchemeGroupId,
                                true,
                                true,
                                searchedResponseData.approvalStatusId
                            );

                            this.notifyWorklistTypeChange(searchedResponseData);
                        } else {
                            this.openResponseFromWorkList(searchedResponseData);
                        }
                    } else if (navigationStore.instance.containerPage === enums.PageContainers.TeamManagement) {
                        this.openResponseFromTeamManagement(searchedResponseData);
                    }
                }
            }
        } else {
            /* 
               If searched response not belongs to current marker's worklist, subordinate's worklist
               or not available for marking check then Rig not found popup should be shown
               instead of navigating response screen and hide busy indicator from then menu.
            */
            this.setState({ isBusy: false });
            searchResponseActionCreator.showOrHideRigNotFoundPopup(true);
        }
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
     * Navigate to standardisation setup from recent history
     * @param _historyItem
     * @param _qigId
     */
    private navigateToRecentHistoryStandardisationSetup(_historyItem?: historyItem, _qigId?: number) {
        /*Handles the scenario where user is offline on clicking on history link in menu*/
        if (!applicationStore.instance.isOnline) {
            applicationActionCreator.checkActionInterrupted();
        } else {
            // Menu history navigation to my standardisation setup
            this.historyNavigationArea = enums.HistoryNavigationArea.StandardisationSetup;

            this._failureCode = undefined;

            // resetting the marking check mode on menu item click
            markingCheckActionCreator.toggleMarkingCheckMode(false);

            // busy indicator will be removed
            // a. when navigator referesh while navigating between different areas 
            // b. when navigating from one SSU to another SSU , it will be reset by STANDARDISATION_RESPONSE_DATA_UPDATED_EVENT
            busyIndicatorActionCreator.setBusyIndicatorInvoker(enums.BusyIndicatorInvoker.loadingHistoryDetails);

            let message = 'Selected Standardisation setup from menu with Close menu event triggered.';
            message = message + ' Current container => ' +
                enums.PageContainers[navigationStore.instance.containerPage];
            // logging menu action in google analytics or application insights based on the configuration
            new auditLoggingHelper().logHelper.logEventOnMenuAction(message);

            this.setState({ isOpen: false });

            this._historyItem = JSON.parse(JSON.stringify(_historyItem));
            let qigId: number = _qigId > 0 ? _qigId : this._historyItem.qigId;
            // set the marker operation mode as Marking
            userInfoActionCreator.changeOperationMode(enums.MarkerOperationMode.StandardisationSetup, false, true);

            // Invoke the action creator to Open the QIG
            qigActionCreator.getQIGSelectorData(qigId, true, false, true, false, true);
        }
    }

    /**
     * Open search response from worklist
     * @param searchedResponseData
     */
    private openResponseFromWorkList(searchedResponseData: SearchedResponseData) {
        let selectedResponseWorkListType = responseSearchHelper.getWorklistTypeByMarkingMode(
            searchedResponseData.markingModeId,
            searchedResponseData.isDirectedRemark,
            searchedResponseData.isAtypical
        );
        if (searchedResponseData.responseMode === worklistStore.instance.getResponseMode
            && !worklistStore.instance.isMarkingCheckMode
            && worklistStore.instance.currentWorklistType === selectedResponseWorkListType
            && !worklistStore.instance.isMarkingCheckWorklistAccessPresent) {

            /*
               If searched response's worklist type and response mode is same as current worklist type, response mode
               and also the search response not belongs to marking check then we have to open response direclty
               without fetching worklist type and related store values.
            */
            responseHelper.openResponse(parseInt(searchedResponseData.displayId),
                enums.ResponseNavigation.specific,
                searchedResponseData.responseMode,
                searchedResponseData.markGroupId,
                enums.ResponseViewMode.zoneView);
            markSchemeHelper.getMarks(parseInt(searchedResponseData.displayId),
                searchedResponseData.markingModeId);
            eCourseworkHelper.fetchECourseWorkCandidateScriptMetadata(parseInt(searchedResponseData.displayId));
        } else {
            /*
               If searched response is not belongs to current marker's worklist type or response mode
               or it is a marking check response then , we have to fetch worklist type and
               candidate meta data to update store values before opening the searched response.
            */
            this.notifyWorklistTypeChange(searchedResponseData);
        }
    }

    /**
     * Open search response from team management
     * @param searchedResponseData
     */
    private openResponseFromTeamManagement(searchedResponseData: SearchedResponseData) {
        let canUseCache =
            searchedResponseData.examinerId === searchedResponseData.loggedInExaminerId &&
            qigStore.instance.selectedQIGForMarkerOperation !== undefined;
        /*
           If searched response available for subordinate's worklist then,
           the search will be applicable only for selected qig, hence no need to fetch qig details before
           opening subordinate response. But we have to fetch worklist type, candidate meta data and update store
           values before navigating subordinate response.
       */
        responseSearchHelper.openQIGDetails(
            searchedResponseData.questionPaperId,
            searchedResponseData.markSchemeGroupId,
            searchedResponseData.examinerRoleId,
            canUseCache,
            searchedResponseData.approvalStatusId,
            searchedResponseData.markingMethodId,
            true,
            qigStore.instance.selectedQIGForMarkerOperation.isElectronicStandardisationTeamMember,
            true
        );
    }

    /**
     * Notify worklist type change
     * @param searchedResponseData
     */
    private notifyWorklistTypeChange(searchedResponseData: SearchedResponseData) {
        let selectedResponseWorkListType = responseSearchHelper.getWorklistTypeByMarkingMode(
            searchedResponseData.markingModeId,
            searchedResponseData.isDirectedRemark,
            searchedResponseData.isAtypical
        );
        worklistActionCreator.notifyWorklistTypeChange(
            searchedResponseData.markSchemeGroupId,
            searchedResponseData.examinerRoleId,
            searchedResponseData.questionPaperId,
            selectedResponseWorkListType,
            searchedResponseData.responseMode,
            searchedResponseData.remarkRequestType,
            searchedResponseData.isDirectedRemark,
            qigStore.instance.selectedQIGForMarkerOperation.isElectronicStandardisationTeamMember
        );
    }
}

export = MenuWrapper;