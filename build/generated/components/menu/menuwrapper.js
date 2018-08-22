"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var React = require('react');
var Promise = require('es6-promise');
var classNames = require('classnames');
var Immutable = require('immutable');
var pureRenderComponent = require('../base/purerendercomponent');
var navigationStore = require('../../stores/navigation/navigationstore');
var enums = require('../utility/enums');
var MenuLink = require('./menulink');
var navigationHelper = require('../utility/navigation/navigationhelper');
var awardingStore = require('../../stores/awarding/awardingstore');
var localeStore = require('../../stores/locale/localestore');
var userInfoActionCreator = require('../../actions/userinfo/userinfoactioncreator');
var responseStore = require('../../stores/response/responsestore');
var markingActionCreator = require('../../actions/marking/markingactioncreator');
var qigSelectorActionCreator = require('../../actions/qigselector/qigselectoractioncreator');
var worklistActionCreator = require('../../actions/worklist/worklistactioncreator');
var ccActionCreator = require('../../actions/configurablecharacteristics/configurablecharacteristicsactioncreator');
var qigStore = require('../../stores/qigselector/qigstore');
var stringFormatHelper = require('../../utility/stringformat/stringformathelper');
var stampStore = require('../../stores/stamp/stampstore');
var stampActionCreator = require('../../actions/stamp/stampactioncreator');
var examinerStore = require('../../stores/markerinformation/examinerstore');
var dataServiceHelper = require('../../utility/generic/dataservicehelper');
var responseSearchHelper = require('../../utility/responsesearch/responsesearchhelper');
var worklistStore = require('../../stores/worklist/workliststore');
var markerOperationModeFactory = require('../utility/markeroperationmode/markeroperationmodefactory');
var loginStore = require('../../stores/login/loginstore');
var loginSession = require('../../app/loginsession');
var teamManagementActionCreator = require('../../actions/teammanagement/teammanagementactioncreator');
var teamManagementStore = require('../../stores/teammanagement/teammanagementstore');
var markingCheckActionCreator = require('../../actions/markingcheck/markingcheckactioncreator');
var qigActionCreator = require('../../actions/qigselector/qigselectoractioncreator');
var cchelper = require('../../utility/configurablecharacteristic/configurablecharacteristicshelper');
var ccNames = require('../../utility/configurablecharacteristic/configurablecharacteristicsnames');
var storageAdapterHelper = require('../../dataservices/storageadapters/storageadapterhelper');
var busyIndicatorActionCreator = require('../../actions/busyindicator/busyindicatoractioncreator');
var userInfoStore = require('../../stores/userinfo/userinfostore');
var keyDownHelper = require('../../utility/generic/keydownhelper');
var markerInformationActionCreator = require('../../actions/markerinformation/markerinformationactioncreator');
var applicationStore = require('../../stores/applicationoffline/applicationstore');
var applicationActionCreator = require('../../actions/applicationoffline/applicationactioncreator');
var navigationLoggingHelper = require('../utility/navigation/examinernavigationaudithelper');
var loggerConstants = require('../utility/loggerhelperconstants');
var responseHelper = require('../utility/responsehelper/responsehelper');
var auditLoggingHelper = require('../utility/auditlogger/auditlogginghelper');
/**
 * React component class for Showing menu Page
 */
var MenuWrapper = (function (_super) {
    __extends(MenuWrapper, _super);
    /**
     * constructor
     * @param props
     * @param state
     */
    function MenuWrapper(props, state) {
        var _this = this;
        _super.call(this, props, state);
        this._qigid = 0;
        this._questionPaperPartId = 0;
        this._examinerRoleId = 0;
        this._failureCode = enums.FailureCode.None;
        this.storageAdapterHelper = new storageAdapterHelper();
        this.logger = new navigationLoggingHelper();
        /**
         * used to set the visibility of menu Wrapper
         */
        this.menuVisibility = function (doVisible) {
            if (doVisible === void 0) { doVisible = true; }
            var message = doVisible ? 'Open menu event triggered' : 'Close menu event triggered.';
            message = message + ' Current container => ' +
                enums.PageContainers[navigationStore.instance.containerPage];
            // logging menu action in google analytics or application insight based on the configuration
            new auditLoggingHelper().logHelper.logEventOnMenuAction(message);
            if (markerOperationModeFactory.operationMode.isSetMarkingInProgressAndMarkEntrySelectedRequired && doVisible) {
                keyDownHelper.instance.DeActivate(enums.MarkEntryDeactivator.Menu);
            }
            _this.setState({
                isOpen: doVisible
            });
            // Log opened response details to keep as audit.
            _this.logger.logResponseOpenAudit(loggerConstants.NAVIGATION_REASON_MENU_SCREEN, loggerConstants.NAVIGATION_REASON_MENU_CLICK, responseStore && responseStore.instance.selectedDisplayId ? responseStore.instance.selectedDisplayId.toString() : '', responseStore && responseStore.instance.selectedResponseMode !== undefined ?
                enums.ResponseMode[responseStore.instance.selectedResponseMode].toString() : '');
        };
        /**
         * used to close menu Wrapper
         */
        this.closeMenu = function () {
            if (markerOperationModeFactory.operationMode.isSetMarkingInProgressAndMarkEntrySelectedRequired) {
                markingActionCreator.setMarkEntrySelected(false);
                keyDownHelper.instance.Activate(enums.MarkEntryDeactivator.Menu);
            }
            var message = 'Close menu event triggered.';
            message = message + ' Current container => ' +
                enums.PageContainers[navigationStore.instance.containerPage];
            // logging menu action in google analytics or application insight based on the configuration
            new auditLoggingHelper().logHelper.logEventOnMenuAction(message);
            _this.setState({
                isOpen: false
            });
            // Log opened response details to keep as audit.
            _this.logger.logResponseOpenAudit(loggerConstants.NAVIGATION_REASON_MENU_SCREEN, loggerConstants.NAVIGATION_REASON_MENU_CLOSE_CLICK, responseStore && responseStore.instance.selectedDisplayId ? responseStore.instance.selectedDisplayId.toString() : '', responseStore && responseStore.instance.selectedResponseMode !== undefined ?
                enums.ResponseMode[responseStore.instance.selectedResponseMode].toString() : '');
        };
        /**
         * Load worklist
         */
        this.loadRecentWorklist = function (_historyItem, _markingMode) {
            if (_markingMode === enums.MarkerOperationMode.Marking) {
                navigationHelper.loadWorklist(true);
                var message = 'Loading worklist from menu with Close menu event triggered.';
                message = message + ' Current container => ' +
                    enums.PageContainers[navigationStore.instance.containerPage];
                // logging menu action in google analytics or application insights based on the configuration
                new auditLoggingHelper().logHelper.logEventOnMenuAction(message);
                _this.setState({
                    isOpen: false
                });
            }
        };
        /**
         * after examiner validation do operation based on history details
         */
        this.examinerValidated = function (failureCode) {
            if (failureCode === void 0) { failureCode = enums.FailureCode.None; }
            _this._failureCode = failureCode;
            busyIndicatorActionCreator.setBusyIndicatorInvoker(enums.BusyIndicatorInvoker.loadingHistoryDetails);
            // for these two error codes there is no need to fetch other data's we can
            // directly navigating to qig selector by clearing latest cache data
            if (_this._failureCode === enums.FailureCode.Withdrawn || _this._failureCode === enums.FailureCode.NotTeamLead) {
                _this.storageAdapterHelper.clearCacheByKey('qigselector', 'overviewdata');
                navigationHelper.loadQigSelector();
                if (_this._historyItem) {
                    _this._qigid = _this._historyItem.qigId;
                }
                teamManagementActionCreator.removeHistoryItem(_this._qigid, _this._failureCode === enums.FailureCode.NotTeamLead);
                var message = 'Loading Qigselector from menu as the examiner is Withdrawn/NotTeamLead.Close menu event triggered.';
                message = message + ' Current container => ' +
                    enums.PageContainers[navigationStore.instance.containerPage];
                // logging menu action in google analytics or application insights based on the configuration
                new auditLoggingHelper().logHelper.logEventOnMenuAction(message);
                _this.setState({ isOpen: false });
            }
            else {
                // response is getting closed, inform modules.
                worklistActionCreator.responseClosed(true);
                var changeOperationModePromise = void 0;
                if (userInfoStore.instance.currentOperationMode !== enums.MarkerOperationMode.TeamManagement) {
                    changeOperationModePromise = userInfoActionCreator.changeOperationMode(enums.MarkerOperationMode.TeamManagement, false, true);
                }
                if (!_this._historyItem && _this._qigid) {
                    // while team management is opened for first time through menu history link,the
                    // history item value will be null, so we need to do the exact action
                    // which happens while clicking teamManagement button from qigSelector
                    ccActionCreator.getMarkSchemeGroupCCs(_this._qigid, _this._questionPaperPartId, true, true);
                    // if the user has the remember-qig option then 'qigOverviewData' will be null
                    // in this case while the user navigates to teammanagement using recent history option,
                    // this value will be null,to avoid this we need to update this value.
                    if (qigStore.instance.getOverviewData) {
                        var that_1 = _this;
                        var openQigPromise = qigSelectorActionCreator.openQIG(_this._qigid, false, true);
                        Promise.Promise.all([changeOperationModePromise, openQigPromise]).then(function (item) {
                            teamManagementActionCreator.openTeamManagement(that_1._examinerRoleId, that_1._qigid, false, true);
                        });
                    }
                    else {
                        var that_2 = _this;
                        var getQIGSelectorDataPromise = qigActionCreator.getQIGSelectorData(_this._qigid, false, false, false, true, false);
                        Promise.Promise.all([getQIGSelectorDataPromise]).then(function (item) {
                            teamManagementActionCreator.openTeamManagement(that_2._examinerRoleId, that_2._qigid, false, true);
                        });
                    }
                    var message = 'Loading TeamManagement from menu  with Close menu event triggered.';
                    message = message + ' Current container => ' +
                        enums.PageContainers[navigationStore.instance.containerPage];
                    // logging menu action in google analytics or application insights based on the configuration
                    new auditLoggingHelper().logHelper.logEventOnMenuAction(message);
                    _this.setState({
                        isOpen: false
                    });
                }
                else {
                    var ccActionCreatorPromise = ccActionCreator.getMarkSchemeGroupCCs(_this._historyItem.qigId, _this._historyItem.questionPaperPartId, true, true);
                    var that_3 = _this;
                    Promise.Promise.all([changeOperationModePromise, ccActionCreatorPromise]).then(function (item) {
                        // Invoke the action creator to Open the QIG for the logged in user
                        var getQIGSelectorDataPromise = qigActionCreator.getQIGSelectorData(that_3._historyItem.qigId, true, false, true, false, true);
                    });
                }
            }
        };
        /**
         * updates details to store
         */
        this.onQigSelectedFromHistory = function () {
            if (!_this._historyItem || _this._failureCode === undefined) {
                return;
            }
            busyIndicatorActionCreator.setBusyIndicatorInvoker(enums.BusyIndicatorInvoker.loadingHistoryDetails);
            // avoid getting worklist data's for these error codes
            switch (_this._failureCode) {
                case enums.FailureCode.SubordinateExaminerWithdrawn:
                case enums.FailureCode.HierarchyChanged:
                    teamManagementActionCreator.setTeamManagementHistoryInfo(_this._historyItem, enums.MarkerOperationMode.TeamManagement, _this._failureCode);
                    var message = 'Loading Qigselector from menu as the examiner is ' +
                        'SubordinateExaminerWithdrawn / HierarchyChanged.Close menu event triggered.';
                    message = message + ' Current container => ' +
                        enums.PageContainers[navigationStore.instance.containerPage];
                    // logging menu action in google analytics or application insights based on the configuration
                    new auditLoggingHelper().logHelper.logEventOnMenuAction(message);
                    _this.setState({
                        isOpen: false
                    });
                    return;
            }
            // update the history details to specific stores
            var teamManagementHistoryPromise = teamManagementActionCreator.setTeamManagementHistoryInfo(_this._historyItem, enums.MarkerOperationMode.TeamManagement);
            var that = _this;
            Promise.Promise.all([teamManagementHistoryPromise]).
                then(function (item) {
                if (that._historyItem.team.currentContainer !== enums.PageContainers.TeamManagement) {
                    // team Management worklist.
                    if (that._historyItem.team.selectedTab === enums.TeamManagement.HelpExaminers && cchelper.getCharacteristicValue(ccNames.SeniorExaminerPool, that._historyItem.qigId).toLowerCase() === 'true') {
                        // since it from help examiner, this db call is needed for showing change status button in worklist
                        var getHelpExaminerDataPromise = teamManagementActionCreator.GetHelpExminersData(that._historyItem.team.supervisorExaminerRoleID, that._historyItem.qigId, false, true);
                    }
                    var getQIGSelectorDataPromise1 = qigActionCreator.getQIGSelectorData(that._historyItem.qigId, false, false, false, true, false);
                    Promise.Promise.all([getQIGSelectorDataPromise1]).
                        then(function (item) {
                        that.onQigLoadedFromHistory();
                    });
                }
                else {
                    var message = 'Loading the same container(Team Management) from menu. Close menu event triggered.';
                    message = message + ' Current container => ' +
                        enums.PageContainers[navigationStore.instance.containerPage];
                    // logging menu action in google analytics or application insights based on the configuration
                    new auditLoggingHelper().logHelper.logEventOnMenuAction(message);
                    // Team Management Container.
                    that.setState({ isOpen: false });
                    busyIndicatorActionCreator.setBusyIndicatorInvoker(enums.BusyIndicatorInvoker.none);
                }
            });
        };
        /**
         * load details needed for worklist and navigate
         */
        this.onQigLoadedFromHistory = function () {
            busyIndicatorActionCreator.setBusyIndicatorInvoker(enums.BusyIndicatorInvoker.loadingHistoryDetails);
            responseSearchHelper.openQIGDetails(_this._historyItem.questionPaperPartId, _this._historyItem.qigId, _this._historyItem.team.subordinateExaminerRoleID, dataServiceHelper.canUseCache(), examinerStore.instance.examinerApprovalStatus(_this._historyItem.team.subordinateExaminerRoleID), _this._historyItem.markingMethodId, false, _this._historyItem.isElectronicStandardisationTeamMember);
            // load stamps defined for the selected mark scheme groupId
            stampActionCreator.getStampData(_this._historyItem.qigId, stampStore.instance.stampIdsForSelectedQIG, _this._historyItem.markingMethodId, responseHelper.isEbookMarking, true);
            var message = 'Qig selected from history. Close menu event triggered.';
            message = message + ' Current container => ' +
                enums.PageContainers[navigationStore.instance.containerPage];
            // logging menu action in google analytics or application insights based on the configuration
            new auditLoggingHelper().logHelper.logEventOnMenuAction(message);
            navigationHelper.loadWorklist(true);
            _this.setState({
                isOpen: false
            });
        };
        this.openTeamManagementFromPopup = function () {
            var message = 'Opening team management from history. Close menu event triggered.';
            message = message + ' Current container => ' +
                enums.PageContainers[navigationStore.instance.containerPage];
            // logging menu action in google analytics or application insights based on the configuration
            new auditLoggingHelper().logHelper.logEventOnMenuAction(message);
            _this.setState({
                isOpen: false
            });
        };
        this.closeMenu = this.closeMenu.bind(this);
        this.navigateToHome = this.navigateToContainer.bind(this, enums.PageContainers.QigSelector);
        this.navigateToMessage = this.navigateToContainer.bind(this, enums.PageContainers.Message);
        this.navigateToAwarding = this.navigateToContainer.bind(this, enums.PageContainers.Awarding);
        this.navigateToLogin = navigationHelper.showLogoutConfirmation.bind(this);
        this.navigateToReports = this.navigateToContainer.bind(this, enums.PageContainers.Reports);
        this.state = { isOpen: false };
    }
    /**
     * Render method
     */
    MenuWrapper.prototype.render = function () {
        var _this = this;
        var className = classNames('dropdown-wrap header-dropdown nav-options', { 'open': this.state.isOpen });
        return (React.createElement("li", {role: 'menuitem', id: 'menuwrapper', className: className, "aria-haspopup": 'true'}, React.createElement("a", {id: 'menu-button', href: 'javascript:void(0)', title: localeStore.instance.TranslateText('generic.navigation-bar.menu-tooltip'), onClick: this.state.isOpen ? null : function () { _this.props.handleNavigationClick(); }, className: 'menu-button'}, React.createElement("span", {className: 'relative'}, React.createElement("span", {id: 'menu-icon', className: 'sprite-icon hamburger-icon'}), React.createElement("span", {className: 'nav-text'}, localeStore.instance.TranslateText('generic.navigation-bar.menu')))), React.createElement("div", {className: 'menu', role: 'menu', "aria-hidden": 'true'}, React.createElement("div", {className: 'menu-wrapper'}, React.createElement("div", {className: 'menu-inner'}, React.createElement("div", {className: 'menu-cols left'}, React.createElement("h2", {id: 'menu-header'}, localeStore.instance.TranslateText('generic.navigation-bar.menu')), React.createElement("ul", {className: 'menu-holder quick-menu'}, React.createElement(MenuLink, {id: 'menuLink_Home', key: 'menuLink_Home_key', menuLinkName: localeStore.instance.TranslateText('generic.navigation-menu.home'), onMenuLinkClick: this.navigateToHome, isVisible: true}), React.createElement(MenuLink, {id: 'menuLink_Reports', key: 'menuLink_Reports_key', menuLinkName: localeStore.instance.TranslateText('generic.navigation-menu.reports'), onMenuLinkClick: this.navigateToReports, isVisible: this.canRenderReports}), React.createElement(MenuLink, {id: 'menuLink_Inbox', key: 'menuLink_Inbox_key', menuLinkName: localeStore.instance.TranslateText('messaging.message-lists.top-panel.inbox-tab'), onMenuLinkClick: this.navigateToMessage, isVisible: true}), React.createElement(MenuLink, {id: 'menuLink_Awarding', key: 'menuLink_Awarding_key', menuLinkName: localeStore.instance.TranslateText('awarding.generic.awarding'), onMenuLinkClick: this.navigateToAwarding, isVisible: awardingStore.instance.hasAwardingAccess}), React.createElement(MenuLink, {id: 'menuLink_Logout', key: 'menuLink_Logout_key', menuLinkName: localeStore.instance.TranslateText('generic.user-menu.profile-section.logout-button'), onMenuLinkClick: this.navigateToLogin, isVisible: true}))), this.recentHistory)), React.createElement("a", {href: 'javascript:void(0)', id: 'menu-close', className: 'menu-close', onClick: this.closeMenu, title: localeStore.instance.TranslateText('generic.navigation-menu.close')}, localeStore.instance.TranslateText('generic.navigation-menu.close')))));
    };
    /**
     * Component will Unmount
     */
    MenuWrapper.prototype.componentWillUnmount = function () {
        navigationStore.instance.removeListener(navigationStore.NavigationStore.MENU_VISIBILITY_EVENT, this.menuVisibility);
        worklistStore.instance.removeListener(worklistStore.WorkListStore.WORKLIST_HISTORY_INFO_UPDATED, this.loadRecentWorklist);
        qigStore.instance.removeListener(qigStore.QigStore.QIG_SELECTED_FROM_HISTORY_EVENT, this.onQigSelectedFromHistory);
        teamManagementStore.instance.removeListener(teamManagementStore.TeamManagementStore.TEAM_MANAGEMENT_EXAMINER_VALIDATED_EVENT, this.examinerValidated);
        teamManagementStore.instance.removeListener(teamManagementStore.TeamManagementStore.OPEN_TEAM_MANAGEMENT_EVENT, this.openTeamManagementFromPopup);
    };
    /**
     * Component did mount
     */
    MenuWrapper.prototype.componentDidMount = function () {
        navigationStore.instance.addListener(navigationStore.NavigationStore.MENU_VISIBILITY_EVENT, this.menuVisibility);
        worklistStore.instance.addListener(worklistStore.WorkListStore.WORKLIST_HISTORY_INFO_UPDATED, this.loadRecentWorklist);
        qigStore.instance.addListener(qigStore.QigStore.QIG_SELECTED_FROM_HISTORY_EVENT, this.onQigSelectedFromHistory);
        teamManagementStore.instance.addListener(teamManagementStore.TeamManagementStore.TEAM_MANAGEMENT_EXAMINER_VALIDATED_EVENT, this.examinerValidated);
        teamManagementStore.instance.addListener(teamManagementStore.TeamManagementStore.OPEN_TEAM_MANAGEMENT_EVENT, this.openTeamManagementFromPopup);
    };
    /**
     * used to navigate to particular container
     */
    MenuWrapper.prototype.navigateToContainer = function (container) {
        if (this.doNavigateContainer(container)) {
            if (container !== enums.PageContainers.Response) {
                markingActionCreator.setMarkingInProgress(false);
            }
            // resetting the marking check mode on menu item click
            markingCheckActionCreator.toggleMarkingCheckMode(false);
            // handle offline when try to navigate from menu
            if (!applicationStore.instance.isOnline) {
                applicationActionCreator.checkActionInterrupted();
            }
            else {
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
                        navigationHelper.loadAwardingPage();
                        break;
                }
            }
        }
        else {
            var message = 'Selected the same container ' +
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
    };
    /**
     * return false if current and navigateTo conatainer are same
     */
    MenuWrapper.prototype.doNavigateContainer = function (navigateToContainer) {
        var _currentContainer = enums.PageContainers.None;
        _currentContainer = navigationStore.instance.containerPage;
        return navigateToContainer !== _currentContainer;
    };
    Object.defineProperty(MenuWrapper.prototype, "recentHistory", {
        get: function () {
            var _recentHistory = Immutable.List();
            _recentHistory = navigationStore.instance.getRecentHistory;
            var that = this;
            var recentItems = _recentHistory.map(function (recentItem) {
                return (React.createElement(MenuLink, {menuString: recentItem.qigName, onMyMarkingClick: recentItem.myMarking ?
                    that.navigateToRecentHistoryMyMarking.bind(that, recentItem, null, null) :
                    recentItem.isMarkingEnabled ?
                        that.navigateToRecentHistoryMyMarking.bind(that, null, recentItem.qigId, recentItem.questionPaperPartId) :
                        null, onTeamManagementClick: recentItem.team ?
                    that.navigateToRecentHistoryTeamManagement.bind(that, recentItem, null, null, null) :
                    recentItem.isTeamManagementEnabled ?
                        that.navigateToRecentHistoryTeamManagement.bind(that, null, recentItem.qigId, recentItem.questionPaperPartId, recentItem.examinerRoleId) :
                        null, isRecentHistory: true, selectedLanguage: that.props.selectedLanguage, recentItem: recentItem, id: 'menuLink_' + recentItem.qigId, key: 'menuLink_key_' + recentItem.qigId}));
            });
            return (React.createElement("div", {className: 'menu-cols right'}, React.createElement("h2", {id: 'recent'}, localeStore.instance.TranslateText('generic.navigation-menu.recent')), React.createElement("ul", {className: 'menu-holder recent-items', id: 'menuHolder'}, recentItems)));
        },
        enumerable: true,
        configurable: true
    });
    /**
     * navigate to worklist based on history item
     */
    MenuWrapper.prototype.navigateToRecentHistoryMyMarking = function (_historyItem, _qigId, _questionPaperPartId) {
        /*Handles the scenario where user is offline on clicking on history link in menu*/
        if (!applicationStore.instance.isOnline) {
            applicationActionCreator.checkActionInterrupted();
        }
        else {
            this._failureCode = undefined;
            // response is getting closed, inform modules.
            worklistActionCreator.responseClosed(true);
            //bookmarkActionCreator.bookmarkAdded(null);
            // resetting the marking check mode on menu item click
            markingCheckActionCreator.toggleMarkingCheckMode(false);
            busyIndicatorActionCreator.setBusyIndicatorInvoker(enums.BusyIndicatorInvoker.loadingHistoryDetails);
            var message = 'Selected My Marking from menu with Close menu event triggered.';
            message = message + ' Current container => ' +
                enums.PageContainers[navigationStore.instance.containerPage];
            // logging menu action in google analytics or application insights based on the configuration
            new auditLoggingHelper().logHelper.logEventOnMenuAction(message);
            this.setState({ isOpen: false });
            var that_4 = this;
            this._historyItem = JSON.parse(JSON.stringify(_historyItem));
            var qigId_1 = _qigId > 0 ? _qigId : this._historyItem.qigId;
            // set the marker operation mode as Marking
            userInfoActionCreator.changeOperationMode(enums.MarkerOperationMode.Marking, false, true);
            // Invoke the action creator to Open the QIG
            var getQIGSelectorDataPromise = qigActionCreator.getQIGSelectorData(qigId_1, true, false, true, false, true);
            Promise.Promise.all([
                getQIGSelectorDataPromise
            ]).then(function (result) {
                var selectedQIGForMarkerOperation = qigStore.instance.selectedQIGForMarkerOperation;
                // The Qigstore become undefined when the marker is withrawn in background,.
                // Need to show withdrawn poup while clicking marking link from menu.
                if (selectedQIGForMarkerOperation === undefined) {
                    // Load the worklist while navigating to worklist from inbox through menu.
                    if (navigationStore.instance.containerPage === enums.PageContainers.Message) {
                        navigationHelper.loadWorklist(true);
                    }
                    // upadte examiner store , and withdrawn poup will be displyed from footer.
                    markerInformationActionCreator.
                        GetMarkerInformation(that_4._historyItem.examinerRoleId, qigId_1, true, false, examinerStore.instance.examinerApprovalStatus(that_4._historyItem.examinerRoleId));
                    return;
                }
                responseSearchHelper.openQIGDetails(selectedQIGForMarkerOperation.questionPaperPartId, selectedQIGForMarkerOperation.markSchemeGroupId, selectedQIGForMarkerOperation.examinerRoleId, dataServiceHelper.canUseCache(), examinerStore.instance.examinerApprovalStatus(selectedQIGForMarkerOperation.examinerRoleId), selectedQIGForMarkerOperation.markingMethod, false, selectedQIGForMarkerOperation.isElectronicStandardisationTeamMember);
                // load stamps defined for the selected mark scheme groupId
                stampActionCreator.getStampData(qigStore.instance.selectedQIGForMarkerOperation.markSchemeGroupId, stampStore.instance.stampIdsForSelectedQIG, qigStore.instance.selectedQIGForMarkerOperation.markingMethod, responseHelper.isEbookMarking, true);
                // Calling the helper method to format the QIG Name
                var currQigName = stringFormatHelper.formatAwardingBodyQIG(selectedQIGForMarkerOperation.markSchemeGroupName, selectedQIGForMarkerOperation.assessmentCode, selectedQIGForMarkerOperation.sessionName, selectedQIGForMarkerOperation.componentId, selectedQIGForMarkerOperation.questionPaperName, selectedQIGForMarkerOperation.assessmentName, selectedQIGForMarkerOperation.componentName, stringFormatHelper.getOverviewQIGNameFormat());
                // logging qig selection in google analytics or application insights based on the configuration.
                new auditLoggingHelper().logHelper.logEventOnQigSelection(currQigName);
                if (that_4._historyItem) {
                    // update the worklist store before navigation
                    if (that_4._historyItem.myMarking.worklistType === enums.WorklistType.simulation
                        && selectedQIGForMarkerOperation.standardisationSetupComplete) {
                        that_4._historyItem.myMarking.worklistType = enums.WorklistType.none;
                    }
                    worklistActionCreator.setWorklistHistoryInfo(that_4._historyItem, enums.MarkerOperationMode.Marking);
                }
                navigationHelper.loadWorklist(true);
            });
        }
    };
    /**
     * navigate to team Management based on history item
     */
    MenuWrapper.prototype.navigateToRecentHistoryTeamManagement = function (_historyItem, _qigid, _questionPaperPartId, _examinerRoleId) {
        /*Handles the scenario where user is offline on clicking on history link in menu*/
        if (!applicationStore.instance.isOnline) {
            applicationActionCreator.checkActionInterrupted();
        }
        else {
            busyIndicatorActionCreator.setBusyIndicatorInvoker(enums.BusyIndicatorInvoker.loadingHistoryDetails);
            var message = 'Selected Team Management from menu with Close menu event triggered.';
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
                this.storageAdapterHelper.clearTeamDataCache(this._historyItem.team.supervisorExaminerRoleID, this._historyItem.qigId);
                this.storageAdapterHelper.clearTeamDataCache(this._historyItem.team.supervisorExaminerRoleID, this._historyItem.qigId, true);
                var examinerValidationArea = enums.ExaminerValidationArea.MyTeam;
                if (this._historyItem.team.selectedTab === enums.TeamManagement.HelpExaminers &&
                    this._historyItem.team.currentContainer === enums.PageContainers.WorkList) {
                    examinerValidationArea = enums.ExaminerValidationArea.HelpExaminer;
                }
                // validates the examiner
                teamManagementActionCreator.teamManagementExaminerValidation(this._historyItem.qigId, this._historyItem.team.supervisorExaminerRoleID, this._historyItem.team.subordinateExaminerRoleID, this._historyItem.team.subordinateExaminerID, examinerValidationArea, false);
            }
            else {
                teamManagementActionCreator.teamManagementExaminerValidation(this._qigid);
            }
        }
    };
    Object.defineProperty(MenuWrapper.prototype, "canRenderReports", {
        /**
         * Gets the reports in menu according to the login.
         */
        get: function () {
            return loginSession.IS_FAMILIARISATION_LOGIN === true ? false : loginStore.instance.isReportsVisible;
        },
        enumerable: true,
        configurable: true
    });
    return MenuWrapper;
}(pureRenderComponent));
module.exports = MenuWrapper;
//# sourceMappingURL=menuwrapper.js.map