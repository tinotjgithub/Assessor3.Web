"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator.throw(value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments)).next());
    });
};
var _this = this;
var React = require('react');
var pureRenderComponent = require('../components/base/purerendercomponent');
var enums = require('./utility/enums');
var timerHelper = require('../utility/generic/timerhelper');
var stringHelper = require('../utility/generic/stringhelper');
var auditLoggingHelper = require('./utility/auditlogger/auditlogginghelper');
var LoginForm = require('../components/login/loginform');
var historyItem = require('../utility/breadcrumb/historyitem');
var teamManagementHistoryInfo = require('../utility/breadcrumb/teammanagementhistoryinfo');
var worklistHistoryInfo = require('../utility/breadcrumb/worklisthistoryinfo');
var navigationStore = require('../stores/navigation/navigationstore');
var applicationStore = require('../stores/applicationoffline/applicationstore');
/* tslint:disable:variable-name */
var localeStore;
var qigStore;
var worklistStore;
var loadContainerActionCreator;
var GenericDialog;
var operationModeHelper;
var markerOperationModeFactory;
var teamManagementStore;
var applicationActionCreator;
var AdminSupportContainer;
var WorklistBaseContainer;
var QigSelectorBaseContainer;
var ResponseBaseContainer;
var MessageBaseContainer;
var TeamManagementBaseContainer;
var StandardisationSetupBaseContainer;
var AwardingBaseContainer;
var ReportsBaseContainer;
var Navigator = (function (_super) {
    __extends(Navigator, _super);
    /**
     * Constructor
     * @param {Props} props
     * @param {State} state
     */
    function Navigator(props, state) {
        _super.call(this, props, state);
        this.isFromMenu = false;
        this.isNavigatedAfterFromLogin = false;
        this.hasNetworkInterrupted = false;
        this.isOnline = true;
        this.containerPageType = enums.PageContainersType.None;
        this.reportsMounted = false;
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
    Navigator.prototype.render = function () {
        var offlineContainer = null;
        var renderContainer = null;
        this.logEventOnContainerChange(this.state.containerPage);
        if (this.hasNetworkInterrupted) {
            var offlineMessage = stringHelper.format(localeStore.instance.TranslateText('generic.offline-dialog.body-application-files-not-downloaded'), [String(String.fromCharCode(179))]);
            offlineContainer = (React.createElement(GenericDialog, {content: offlineMessage, header: localeStore.instance.TranslateText('generic.offline-dialog.header'), displayPopup: true, okButtonText: localeStore.instance.TranslateText('generic.error-dialog.ok-button'), onOkClick: this.onApplicationBackOnline, id: 'offlineErrorMessge', key: 'offlineErrorMessge', popupDialogType: enums.PopupDialogType.OffLineWarningOnContainerFailure}));
        }
        else {
            switch (this.state.containerPage) {
                case enums.PageContainers.Login:
                    renderContainer = (React.createElement(LoginForm, null));
                    break;
                case enums.PageContainers.WorkList:
                    renderContainer = (React.createElement(WorklistBaseContainer, {id: 'worklist_base_container', key: 'worklist_base_container_key', selectedLanguage: localeStore.instance.Locale, isOnline: this.isOnline, setOfflineContainer: this.setOfflineContainer, isFromMenu: this.isFromMenu}));
                    break;
                case enums.PageContainers.QigSelector:
                    renderContainer = (React.createElement(QigSelectorBaseContainer, {id: 'qigselector_base_container', key: 'qigselector_base_container_key', selectedLanguage: localeStore.instance.Locale, isOnline: this.isOnline, setOfflineContainer: this.setOfflineContainer, isNavigatedAfterFromLogin: this.isNavigatedAfterFromLogin}));
                    if (this.isNavigatedAfterFromLogin) {
                        this.isNavigatedAfterFromLogin = false;
                    }
                    break;
                case enums.PageContainers.Response:
                    renderContainer = (React.createElement(ResponseBaseContainer, {id: 'response_base_container', key: 'response_base_container_key', selectedLanguage: localeStore.instance.Locale, isOnline: this.isOnline, setOfflineContainer: this.setOfflineContainer, containerPageType: this.containerPageType}));
                    break;
                case enums.PageContainers.Message:
                    renderContainer = (React.createElement(MessageBaseContainer, {id: 'message_base_container', key: 'message_base_container_key', selectedLanguage: localeStore.instance.Locale, isOnline: this.isOnline, setOfflineContainer: this.setOfflineContainer}));
                    break;
                case enums.PageContainers.TeamManagement:
                    renderContainer = (React.createElement(TeamManagementBaseContainer, {id: 'teammanagement_base_container', key: 'teammanagement_base_container_key', selectedLanguage: localeStore.instance.Locale, isOnline: this.isOnline, setOfflineContainer: this.setOfflineContainer, isFromMenu: this.isFromMenu}));
                    break;
                case enums.PageContainers.StandardisationSetup:
                    renderContainer = (React.createElement(StandardisationSetupBaseContainer, {id: 'standardisationsetup_base_container', key: 'standardisationsetup_base_container_key', renderedOn: this.state.renderedOn, selectedLanguage: localeStore.instance.Locale, isOnline: this.isOnline}));
                    break;
                case enums.PageContainers.Awarding:
                    renderContainer = (React.createElement(AwardingBaseContainer, {id: 'awarding_base_container', key: 'awarding_base_container_key', selectedLanguage: localeStore.instance.Locale, isOnline: this.isOnline, setOfflineContainer: this.setOfflineContainer}));
                    break;
                case enums.PageContainers.Reports:
                    renderContainer = (React.createElement(ReportsBaseContainer, {id: 'reports_base_container', key: 'reports_base_container_key', selectedLanguage: localeStore.instance.Locale, isOnline: this.isOnline, setOfflineContainer: this.setOfflineContainer, reportsDidMount: this.reportsDidMount}));
                    break;
                case enums.PageContainers.AdminSupport:
                    renderContainer = (React.createElement(AdminSupportContainer, {id: 'admin_support_container', key: 'admin_support_container_key', selectedLanguage: localeStore.instance.Locale, isOnline: this.isOnline}));
                    break;
            }
        }
        var style = { height: '100%' };
        return (React.createElement("div", {style: style}, offlineContainer, renderContainer));
    };
    /**
     * componentDidMount
     */
    Navigator.prototype.componentDidMount = function () {
        this.loadDependencies();
        this.networkStatusChanged(true);
        navigationStore.instance.addListener(navigationStore.NavigationStore.CONTAINER_CHANGE__EVENT, this.refreshState);
        applicationStore.instance.addListener(applicationStore.ApplicationStore.ONLINE_STATUS_UPDATED_EVENT, this.networkStatusChanged);
    };
    /**
     * componentWillUnmount
     */
    Navigator.prototype.componentWillUnmount = function () {
        navigationStore.instance.removeListener(navigationStore.NavigationStore.CONTAINER_CHANGE__EVENT, this.refreshState);
        if (localeStore) {
            localeStore.instance.removeListener(localeStore.LocaleStore.LOCALE_CHANGE_EVENT, this.languageChanged);
        }
        applicationStore.instance.removeListener(applicationStore.ApplicationStore.ONLINE_STATUS_UPDATED_EVENT, this.networkStatusChanged);
        this.timer.clear();
    };
    /**
     * add event listers
     */
    Navigator.prototype.addLocaleStoreListeners = function () {
        localeStore.instance.addListener(localeStore.LocaleStore.LOCALE_CHANGE_EVENT, this.languageChanged);
    };
    /**
     *  This will load the dependencies dynamically during component mount.
     */
    Navigator.prototype.loadDependencies = function () {
        return __awaiter(this, void 0, void 0, function* () {
            // here await is used to handle the asynchronus imports.
            yield ();
        });
    };
    Navigator.prototype.import = ;
    Navigator.prototype.then = ;
    Navigator.prototype.import = ;
    Navigator.prototype.then = ;
    Navigator.prototype.import = ;
    Navigator.prototype.then = ;
    Navigator.prototype.import = ;
    Navigator.prototype.then = ;
    Navigator.prototype.import = ;
    Navigator.prototype.then = ;
    Navigator.prototype.import = ;
    Navigator.prototype.then = ;
    Navigator.prototype.import = ;
    Navigator.prototype.then = ;
    Navigator.prototype.import = ;
    Navigator.prototype.then = ;
    Navigator.prototype.import = ;
    Navigator.prototype.then = ;
    Navigator.prototype.import = ;
    Navigator.prototype.then = ;
    Navigator.prototype.import = ;
    Navigator.prototype.then = ;
    Navigator.prototype.import = ;
    Navigator.prototype.then = ;
    Navigator.prototype.import = ;
    Navigator.prototype.then = ;
    Navigator.prototype.import = ;
    Navigator.prototype.then = ;
    Navigator.prototype.import = ;
    Navigator.prototype.then = ;
    Navigator.prototype.import = ;
    Navigator.prototype.then = ;
    Navigator.prototype.import = ;
    Navigator.prototype.then = ;
    Navigator.prototype.import = ;
    ;
    return Navigator;
}(pureRenderComponent));
this.moduleLoaded = true;
this.setState({ renderedOn: Date.now() });
this.networkStatusChanged(true);
navigationStore.instance.addListener(navigationStore.NavigationStore.CONTAINER_CHANGE__EVENT, this.refreshState);
applicationStore.instance.addListener(applicationStore.ApplicationStore.ONLINE_STATUS_UPDATED_EVENT, this.networkStatusChanged);
refreshState = function () {
    if (_this.state.containerPage === enums.PageContainers.Login) {
        _this.addLocaleStoreListeners();
        _this.isNavigatedAfterFromLogin = true;
    }
    _this.isFromMenu = navigationStore.instance.isFromMenu;
    _this.containerPageType = navigationStore.instance.containerPageType;
    if (navigationStore.instance.containerPage !== enums.PageContainers.QigSelector) {
        _this.updateHistory();
    }
    if (navigationStore.instance.containerPage === enums.PageContainers.Reports) {
        // Initiate a ping call and set the online status before rendering reports wrapper. 
        // Cannot rely on normal ping call interval because if the net connection is off while requesting the reports from menu,
        // then the application store will not get updated correctly since there is no data service call failure.
        // So there is no way to identify the network connection status change.
        // Update the network status and render the reportswrapper only if the system is in online mode
        applicationActionCreator.validateNetWorkStatus(true);
    }
    else {
        _this.reportsMounted = false;
        _this.setState({
            containerPage: navigationStore.instance.containerPage,
            renderedOn: Date.now()
        });
    }
};
logEventOnContainerChange(containerPage, enums.PageContainers);
{
    /** logging event in google analytics or application insights based on the configuration */
    new auditLoggingHelper().logHelper.logEventOnContainerChange(enums.PageContainers[containerPage]);
}
languageChanged = function () {
    _this.setState({
        selectedLanguage: localeStore.instance.Locale,
        renderedOn: Date.now()
    });
};
updateHistory();
{
    if (!qigStore.instance.selectedQIGForMarkerOperation) {
        return;
    }
    // Update the history while opening response from message also
    if ((navigationStore.instance.previousPage === enums.PageContainers.Message ||
        navigationStore.instance.previousPage === enums.PageContainers.WorkList) &&
        navigationStore.instance.containerPage !== enums.PageContainers.WorkList) {
        // adding to history item based on Marker Operation Mode
        var _historyItem = new historyItem();
        if (markerOperationModeFactory.operationMode.isTeamManagementMode) {
            var _teamManagementHistoryInfo = new teamManagementHistoryInfo();
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
        }
        else {
            var _worklistHistoryInfo = new worklistHistoryInfo();
            _worklistHistoryInfo.worklistType = worklistStore.instance.currentWorklistType;
            _worklistHistoryInfo.responseMode = worklistStore.instance.getResponseMode;
            _historyItem.qigId = operationModeHelper.markSchemeGroupId;
            _historyItem.qigName = qigStore.instance.selectedQIGForMarkerOperation.markSchemeGroupName + '-' +
                qigStore.instance.selectedQIGForMarkerOperation.assessmentCode;
            _historyItem.timeStamp = Date.now();
            _worklistHistoryInfo.remarkRequestType = worklistStore.instance.getRemarkRequestType;
            _historyItem.myMarking = _worklistHistoryInfo;
        }
        var _isMarkingEnabled = qigStore.instance.selectedQIGForMarkerOperation &&
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
        _historyItem.examinerRoleId = operationModeHelper.examinerRoleId;
        _historyItem.questionPaperPartId = qigStore.instance.selectedQIGForMarkerOperation.questionPaperPartId;
        loadContainerActionCreator.addToRecentHistory(_historyItem);
    }
}
networkStatusChanged(forceStartPoll, boolean = false);
void {
    this: .triggerApplicationOnlinePoll(forceStartPoll),
    this: .isOnline = applicationStore.instance.isOnline,
    if: function (navigationStore, instance, containerPage) {
        if (containerPage === void 0) { containerPage =  === enums.PageContainers.Reports && !this.reportsMounted; }
        // if the reports is not already loaded then show offline popup when the system is in offline mode
        this.setOfflineContainer(true);
    },
    if: function (applicationStore, instance, isOnline) {
        if (isOnline === void 0) { isOnline =  && this.hasNetworkInterrupted; }
        this.hasNetworkInterrupted = false;
    },
    // set the container page as reports only if navigating to reports in online mode
    let: containerPage = this.isOnline && navigationStore.instance.containerPage === enums.PageContainers.Reports ?
        navigationStore.instance.containerPage : this.state.containerPage,
    var: that = this,
    setTimeout: function () { } }();
{
    that.setState({
        containerPage: containerPage,
        renderedOn: Date.now()
    });
}
;
ping();
void {
    applicationActionCreator: .updateOnlineStatus()
};
triggerApplicationOnlinePoll(forceStartPoll, boolean = false);
void {
    let: interval, number: ,
    // If the application status has been changed update the call
    if: function (forceStartPoll) {
        if (forceStartPoll === void 0) { forceStartPoll =  ||
            this.isOnline !== applicationStore.instance.isOnline; }
        interval = applicationStore.instance.isOnline ? config.general.APPLICATION_ONLINE_CHECK_INTERVAL
            : config.general.APPLICATION_OFFLINE_CHECK_INTERVAL;
        // ensuring online & offline poll interval time is configured
        // ToDo check application status is online to select the interval.
        //timerHelper.setInterval(interval, this.ping) ;
        this.timer.clear();
        this.timer.set(interval, this.ping);
    }
};
setOfflineContainer(show, boolean, systemError, boolean = false);
void {
    if: function () { } };
!this.isOnline || systemError;
{
    if (systemError) {
        // If webpack failed intiate a ping call and set the online status.
        applicationActionCreator.validateNetWorkStatus();
    }
    this.hasNetworkInterrupted = true;
    this.setState({ renderedOn: Date.now() });
}
onApplicationBackOnline();
void {
    this: .hasNetworkInterrupted = false,
    this: .setState({ renderedOn: Date.now() })
};
reportsDidMount = function () {
    _this.reportsMounted = true;
};
module.exports = Navigator;
//# sourceMappingURL=navigator.js.map