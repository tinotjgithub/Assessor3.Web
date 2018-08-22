"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var React = require('react');
var pureRenderComponent = require('../base/purerendercomponent');
var enums = require('../utility/enums');
var Header = require('../header');
var BusyIndicator = require('../utility/busyindicator/busyindicator');
var localeStore = require('../../stores/locale/localestore');
var busyIndicatorStore = require('../../stores/busyindicator/busyindicatorstore');
var classNames = require('classnames');
var GenericDialog = require('../utility/genericdialog');
var Footer = require('../footer');
var userInfoStore = require('../../stores/userinfo/userinfostore');
var teamManagementActionCreator = require('../../actions/teammanagement/teammanagementactioncreator');
var teamManagementStore = require('../../stores/teammanagement/teammanagementstore');
var TeamManagementContainer = require('./teammanagementcontainer');
var TeamManagementCollapsiblePanel = require('./TeamManagementCollapsiblePanel');
var cchelper = require('../../utility/configurablecharacteristic/configurablecharacteristicshelper');
var ccNames = require('../../utility/configurablecharacteristic/configurablecharacteristicsnames');
var ccStore = require('../../stores/configurablecharacteristics/configurablecharacteristicsstore');
var qigStore = require('../../stores/qigselector/qigstore');
var ConfirmationDialog = require('../utility/confirmationdialog');
var stringFormatHelper = require('../../utility/stringformat/stringformathelper');
var messagingActionCreator = require('../../actions/messaging/messagingactioncreator');
var warningMessageStore = require('../../stores/teammanagement/warningmessagestore');
var warningMessageNavigationHelper = require('../../utility/teammanagement/helpers/warningmessagenavigationhelper');
var Promise = require('es6-promise');
var storageAdapterHelper = require('../../dataservices/storageadapters/storageadapterhelper');
var simulationModeHelper = require('../../utility/simulation/simulationmodehelper');
var stringHelper = require('../../utility/generic/stringhelper');
var applicationstore = require('../../stores/applicationoffline/applicationstore');
var applicationactioncreator = require('../../actions/applicationoffline/applicationactioncreator');
var ccValues = require('../../utility/configurablecharacteristic/configurablecharacteristicsvalues');
var Immutable = require('immutable');
var auditLoggingHelper = require('../utility/auditlogger/auditlogginghelper');
/**
 * React component for team management
 */
var TeamManagement = (function (_super) {
    __extends(TeamManagement, _super);
    /**
     * @constructor
     */
    function TeamManagement(props, state) {
        var _this = this;
        _super.call(this, props, state);
        this.storageAdapterHelper = new storageAdapterHelper();
        /**
         * Click event of the link
         * @param teamLinkType
         */
        this.onLinkClick = function (teamLinkType) {
            // If selected tab is helpExaminers, Validate the examiner
            if (!applicationstore.instance.isOnline) {
                applicationactioncreator.checkActionInterrupted();
            }
            else if (teamLinkType === enums.TeamManagement.HelpExaminers) {
                _this.executeSEPAction(enums.SEPAction.SendMessage, 0);
                teamManagementActionCreator.teammanagementTabSelect(teamLinkType);
            }
            else if (teamLinkType === enums.TeamManagement.MyTeam) {
                // If selected tab is helpExaminers, Validate the examiner
                _this.validateExaminerOnClick(teamManagementStore.instance.selectedExaminerRoleId, qigStore.instance.getSelectedQIGForTheLoggedInUser.markSchemeGroupId);
            }
            else {
                teamManagementActionCreator.teammanagementTabSelect(teamLinkType);
            }
        };
        /**
         * Show busy indicator when submit is clicked in live open worklist
         */
        this.setBusyIndicator = function () {
            /* if any error occurs set the variable to false and content refresh has started */
            if (busyIndicatorStore.instance.getBusyIndicatorInvoker === enums.BusyIndicatorInvoker.none &&
                _this.isContentRefreshStarted) {
                _this.resetContentRefreshStatuses();
            }
            _this.setState({
                isBusy: busyIndicatorStore.instance.getBusyIndicatorInvoker === enums.BusyIndicatorInvoker.none ? false : true
            });
        };
        /**
         * Fires after email save
         */
        this.userInfoSaved = function () {
            _this.setState({
                isSaveEmailMessageDisplaying: true
            });
        };
        /**
         * Get overview received event
         */
        this.teamOverviewDataReceived = function (isHelpExaminersDataRefreshRequired) {
            var _selectedQig = teamManagementStore.instance.getSelectedQig;
            var doLoadHelpExaminerData = _selectedQig ? ((teamManagementStore.instance.selectedTeamManagementTab === undefined) &&
                (_selectedQig.examinerLockCount > 0 ||
                    (teamManagementStore.instance.isFirstTimeTeamManagementAccessed &&
                        _selectedQig.examinerStuckCount > 0)) ||
                teamManagementStore.instance.selectedTeamManagementTab === enums.TeamManagement.HelpExaminers) : false;
            // Load data if the selected tab is help examiner
            if (doLoadHelpExaminerData) {
                if (isHelpExaminersDataRefreshRequired) {
                    // load Help Examiners Data
                    _this.loadHelpExaminersData();
                }
            }
            else if (teamManagementStore.instance.selectedTeamManagementTab === enums.TeamManagement.Exceptions) {
                teamManagementActionCreator.getUnactionedExceptions(teamManagementStore.instance.selectedMarkSchemeGroupId);
            }
            else {
                _this.loadMyTeamData();
            }
            _this.setState({ isBusy: false });
        };
        /**
         * this will shows the confirmation popup on logout based on the ask on logout value.
         */
        this.showLogoutConfirmation = function () {
            _this.setState({ isLogoutConfirmationPopupDisplaying: true });
        };
        /**
         * Handle toggle event of recipient list.
         *
         */
        this.onLeftPanelCollapseOrExpand = function () {
            teamManagementActionCreator.leftPanelToggleSave(!_this.state.isLeftPanelCollapsed);
        };
        /**
         * Sets the team management left panel toggle state based on the store value
         */
        this.setLeftPanelState = function () {
            _this.setState({
                isLeftPanelCollapsed: teamManagementStore.instance.isLeftPanelCollapsed
            });
        };
        /**
         * Set the link state logic for the left Panel
         */
        this.setLinkSelection = function () {
            if (teamManagementStore.instance.selectedTeamManagementTab === enums.TeamManagement.MyTeam) {
                _this.loadMyTeamData();
            }
            else if (teamManagementStore.instance.selectedTeamManagementTab === enums.TeamManagement.HelpExaminers) {
                _this.loadHelpExaminersData();
            }
            else if (teamManagementStore.instance.selectedTeamManagementTab === enums.TeamManagement.Exceptions) {
                teamManagementActionCreator.getUnactionedExceptions(teamManagementStore.instance.selectedMarkSchemeGroupId);
            }
            /* Logging tab swith in google analytics or application insights based on the configuration */
            new auditLoggingHelper().logHelper.
                logEventOnTeamManagementTabSwitch(teamManagementStore.instance.selectedTeamManagementTab);
            _this.setState({
                selectedTab: teamManagementStore.instance.selectedTeamManagementTab
            });
        };
        /**
         * Get the Overview Count
         */
        this.getTeamManagementOverviewCounts = function () {
            teamManagementActionCreator.getTeamManagementOverviewCounts(teamManagementStore.instance.selectedExaminerRoleId, teamManagementStore.instance.selectedMarkSchemeGroupId);
        };
        /*
         * Load the data for My Team List
         */
        this.loadMyTeamData = function () {
            teamManagementActionCreator.getMyTeamData(teamManagementStore.instance.selectedExaminerRoleId, teamManagementStore.instance.selectedMarkSchemeGroupId, false);
        };
        /*
         * This method will call on my team data load
         */
        this.onMyTeamDataLoad = function (isFromHistory) {
            if (isFromHistory) {
                return;
            }
            _this.resetContentRefreshStatuses();
            // If the selected qigs is in simulation then clear the cahce of simulation exited qigs to
            // show popup on clicking home from team-management.
            var currentTarget = qigStore.instance.getSelectedQIGForTheLoggedInUser.currentMarkingTarget;
            if (currentTarget.markingMode === enums.MarkingMode.Simulation) {
                _this.storageAdapterHelper.clearCacheByKey('simulationexitedqigs', 'qigdata');
            }
            _this.setState({
                renderedOn: Date.now(),
                selectedTab: teamManagementStore.instance.selectedTeamManagementTab
            });
        };
        /*
         * Generates the value for the team links
         */
        this.getTeamLinks = function () {
            var teamLinks = null;
            var _selectedQig = teamManagementStore.instance.getSelectedQig;
            if (_selectedQig) {
                teamLinks = [
                    {
                        linkName: enums.TeamManagement.MyTeam,
                        isVisible: true,
                        isSelected: enums.TeamManagement.MyTeam === _this.state.selectedTab,
                        subLinks: []
                    },
                    {
                        linkName: enums.TeamManagement.HelpExaminers,
                        isVisible: false,
                        isSelected: enums.TeamManagement.HelpExaminers === _this.state.selectedTab,
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
                        isSelected: enums.TeamManagement.Exceptions === _this.state.selectedTab,
                        subLinks: [
                            {
                                Count: _selectedQig.exceptionCount,
                                linkName: enums.TeamSubLink.Exceptions
                            }]
                    }];
                if (_this.isMarkSchemeGroupCCLoaded && qigStore.instance.getSelectedQIGForTheLoggedInUser &&
                    qigStore.instance.getSelectedQIGForTheLoggedInUser.examinerApprovalStatus !== enums.ExaminerApproval.NotApproved &&
                    qigStore.instance.getSelectedQIGForTheLoggedInUser.examinerApprovalStatus !== enums.ExaminerApproval.Suspended &&
                    cchelper.getCharacteristicValue(ccNames.SeniorExaminerPool, _selectedQig.qigId).toLowerCase() === 'true') {
                    teamLinks.filter(function (x) { return x.linkName === enums.TeamManagement.HelpExaminers; })[0].isVisible = true;
                }
            }
            else {
                teamLinks = null;
            }
            return teamLinks;
        };
        /*
         * Invoked when the data received for Help Examiners tab.
         */
        this.onHelpExaminersDataReceived = function (isFromHistory) {
            if (isFromHistory === void 0) { isFromHistory = false; }
            if (isFromHistory) {
                return;
            }
            _this.resetContentRefreshStatuses();
            _this.setState({
                renderedOn: Date.now(),
                selectedTab: teamManagementStore.instance.selectedTeamManagementTab
            });
        };
        /*
         * Gets the data Help examiners
         */
        this.loadHelpExaminersData = function () {
            // Load the Help examiners data, if Senior Examiner Pool CC is On, Else load My team data.
            if (_this.isMarkSchemeGroupCCLoaded) {
                if (qigStore.instance.getSelectedQIGForTheLoggedInUser &&
                    qigStore.instance.getSelectedQIGForTheLoggedInUser.examinerApprovalStatus !== enums.ExaminerApproval.NotApproved &&
                    qigStore.instance.getSelectedQIGForTheLoggedInUser.examinerApprovalStatus !== enums.ExaminerApproval.Suspended &&
                    cchelper.getCharacteristicValue(ccNames.SeniorExaminerPool, qigStore.instance.selectedQIGForMarkerOperation.markSchemeGroupId).toLowerCase() === 'true') {
                    if (teamManagementStore.instance.isHelpExaminersDataChanged) {
                        // Fix for defect 49603. Load the help examiners data after loading the count in order to make it sync.
                        var getTeamOverviewDataPromise = teamManagementActionCreator.getTeamManagementOverviewCounts(teamManagementStore.instance.selectedExaminerRoleId, teamManagementStore.instance.selectedMarkSchemeGroupId, false, false, false);
                        Promise.Promise.all([getTeamOverviewDataPromise]).
                            then(function (item) {
                            teamManagementActionCreator.GetHelpExminersData(teamManagementStore.instance.selectedExaminerRoleId, teamManagementStore.instance.selectedMarkSchemeGroupId, !teamManagementStore.instance.isHelpExaminersDataChanged);
                        });
                    }
                    else {
                        teamManagementActionCreator.GetHelpExminersData(teamManagementStore.instance.selectedExaminerRoleId, teamManagementStore.instance.selectedMarkSchemeGroupId, !teamManagementStore.instance.isHelpExaminersDataChanged);
                    }
                }
                else {
                    _this.loadMyTeamData();
                }
            }
        };
        /**
         * On Mark Scheme group cc loaded
         */
        this.onMarkSchemeGroupCCLoaded = function () {
            _this.isMarkSchemeGroupCCLoaded = true;
            _this.getTeamManagementOverviewCounts();
        };
        /**
         * SEP Action return callback.
         */
        this.onApprovalManagementActionExecuted = function (actionIdentifier, sepApprovalManagementActionResults, isMultiLock) {
            if (!isMultiLock) {
                // if examiner got Locked without error, navigate to his worklist else refresh to show the updated list
                var sepApprovalManagementActionResult = void 0;
                sepApprovalManagementActionResult = sepApprovalManagementActionResults.first();
                if (sepApprovalManagementActionResult.success &&
                    sepApprovalManagementActionResult.failureCode === enums.SEPActionFailureCode.None) {
                    if (actionIdentifier === enums.SEPAction.Lock) {
                        var multiQigData = teamManagementStore.instance.teamOverviewCountData ?
                            teamManagementStore.instance.teamOverviewCountData.qigDetails : undefined;
                        if (ccValues.sepQuestionPaperManagement && (multiQigData && multiQigData.length > 1)) {
                            /* If ccValue true and it is a multi qig then invoke multi qig lock examiner data,
                               otherwise will navigate to help examiner work list.*/
                            teamManagementActionCreator.
                                GetMultiQigLockExaminersData(teamManagementStore.instance.selectedExaminerRoleId, teamManagementStore.instance.selectedMarkSchemeGroupId, sepApprovalManagementActionResult.examiner.examinerId, sepApprovalManagementActionResult.examiner.examinerRoleId);
                        }
                        else {
                            // Invoke help examiner data retrieve action for getting refreshed data and update the store.
                            teamManagementActionCreator.GetHelpExminersData(teamManagementStore.instance.selectedExaminerRoleId, teamManagementStore.instance.selectedMarkSchemeGroupId, !teamManagementStore.instance.isHelpExaminersDataChanged);
                            var examinerDrillDownData = {
                                examinerId: sepApprovalManagementActionResult.examiner.examinerId,
                                examinerRoleId: sepApprovalManagementActionResult.examiner.examinerRoleId
                            };
                            // Navigate to help examiner worklist after completed the lock operation.
                            teamManagementActionCreator.updateExaminerDrillDownData(examinerDrillDownData);
                            _this.setState({
                                isBusy: false
                            });
                        }
                    }
                    else if (actionIdentifier === enums.SEPAction.Unlock) {
                        // to get the updated lock and stuck count
                        _this.getTeamManagementOverviewCounts();
                        _this.setState({
                            isBusy: false
                        });
                    }
                }
            }
            else {
                if (sepApprovalManagementActionResults) {
                    // Invoke multiple lock execution.
                    var dataCollection_1 = new Array();
                    // Include the currently locked QIG under the successfully locked qig list.
                    if (teamManagementStore.instance.multiLockSelectedExaminerQigId !== 0) {
                        var multiLockResult_1 = {
                            failureCode: enums.FailureCode.None,
                            markSchemeGroupId: teamManagementStore.instance.multiLockSelectedExaminerQigId
                        };
                        dataCollection_1.push(multiLockResult_1);
                    }
                    // Add qigs coming from the database which contain successfully locked or lock failed qigs.
                    sepApprovalManagementActionResults.map(function (item) {
                        var multiLockResult = {
                            failureCode: item.failureCode,
                            markSchemeGroupId: item.markSchemeGroupId
                        };
                        dataCollection_1.push(multiLockResult);
                    });
                    var multiLockResult = Immutable.List(dataCollection_1);
                    teamManagementActionCreator.getMultiQigLockResult(multiLockResult);
                }
            }
            _this.setState({
                renderedOn: Date.now()
            });
        };
        /**
         * If Action is Unlock, display confirmation dialoge else lock the examiner.
         */
        this.onLockOrUnlockClicked = function (doSEPApprovalManagementActionArgument) {
            if (doSEPApprovalManagementActionArgument.actionIdentifier === enums.SEPAction.Unlock) {
                var examiner = teamManagementStore.instance.examinersForHelpExaminers.filter(function (x) {
                    return x.examinerRoleId === doSEPApprovalManagementActionArgument.examiners.first().examinerRoleId;
                }).first();
                _this.unlockExaminerName = stringFormatHelper.getFormattedExaminerName(examiner.initials, examiner.surname);
                _this.setState({ unlockExaminerRoleId: examiner.examinerRoleId });
            }
            else if (doSEPApprovalManagementActionArgument.actionIdentifier === enums.SEPAction.Lock) {
                _this.setState({
                    isBusy: true
                });
                _this.executeSEPAction(enums.SEPAction.Lock, doSEPApprovalManagementActionArgument.examiners.first().examinerRoleId);
            }
        };
        /**
         * This method will call on exception data load
         */
        this.onExceptionDataLoad = function () {
            _this.setState({
                renderedOn: Date.now()
            });
        };
        /**
         * Method to handle the SEP failure action
         */
        this.sepActionFailureReceived = function (failureCode, warningMessageAction) {
            //If SEP action failed event received then hide the busy indicator.
            if (failureCode !== enums.FailureCode.None &&
                warningMessageAction === enums.WarningMessageAction.SEPAction) {
                _this.setState({ isBusy: false });
            }
        };
        /**
         * handle Warning Message Navigation
         */
        this.handleWarningMessageNavigation = function (failureCode, warningMessageAction) {
            if (failureCode === enums.FailureCode.SubordinateExaminerWithdrawn) {
                _this.loadMyTeamData();
            }
            warningMessageNavigationHelper.handleWarningMessageNavigation(failureCode, warningMessageAction);
        };
        // While Navigating to Team management, Navigate to the selected tab.
        this.state = {
            isLeftPanelCollapsed: teamManagementStore.instance.isLeftPanelCollapsed,
            selectedTab: teamManagementStore.instance.selectedTeamManagementTab,
            renderedOn: this.props.renderedOn
        };
        this.onLeftPanelCollapseOrExpand = this.onLeftPanelCollapseOrExpand.bind(this);
        this.onOkClickOfEmailSucessMessage = this.onOkClickOfEmailSucessMessage.bind(this);
        this.showLogoutConfirmation = this.showLogoutConfirmation.bind(this);
        this.resetLogoutConfirmationSatus = this.resetLogoutConfirmationSatus.bind(this);
        if (qigStore.instance.selectedQIGForMarkerOperation &&
            qigStore.instance.selectedQIGForMarkerOperation.markSchemeGroupId === ccStore.instance.ccLoadedForMarkSchemeGroupId) {
            this.isMarkSchemeGroupCCLoaded = true;
            // Get the team overview counts
            this.getTeamManagementOverviewCounts();
        }
        simulationModeHelper.checkStandardisationSetupCompletion(enums.PageContainers.QigSelector, enums.PageContainers.TeamManagement);
    }
    /**
     * Subscribe to language change event
     */
    TeamManagement.prototype.componentDidMount = function () {
        busyIndicatorStore.instance.addListener(busyIndicatorStore.BusyIndicatorStore.BUSY_INDICATOR, this.setBusyIndicator);
        userInfoStore.instance.addListener(userInfoStore.UserInfoStore.USERINFO_SAVE, this.userInfoSaved);
        userInfoStore.instance.addListener(userInfoStore.UserInfoStore.SHOW_LOGOUT_POPUP_EVENT, this.showLogoutConfirmation);
        teamManagementStore.instance.addListener(teamManagementStore.TeamManagementStore.SET_PANEL_STATE, this.setLeftPanelState);
        teamManagementStore.instance.addListener(teamManagementStore.TeamManagementStore.TEAM_MANAGEMENT_SELECTED_TAB, this.setLinkSelection);
        teamManagementStore.instance.addListener(teamManagementStore.TeamManagementStore.HELP_EXAMINERS_DATA_RECEIVED, this.onHelpExaminersDataReceived);
        ccStore.instance.addListener(ccStore.ConfigurableCharacteristicsStore.MARKSCHEME_GROUP_CC_GET, this.onMarkSchemeGroupCCLoaded);
        teamManagementStore.instance.addListener(teamManagementStore.TeamManagementStore.CAN_EXECUTE_APPROVAL_MANAGEMENT_ACTION, this.onLockOrUnlockClicked);
        teamManagementStore.instance.addListener(teamManagementStore.TeamManagementStore.APPROVAL_MANAGEMENT_ACTION_EXECUTED, this.onApprovalManagementActionExecuted);
        teamManagementStore.instance.addListener(teamManagementStore.TeamManagementStore.MY_TEAM_DATA_LOADED_EVENT, this.onMyTeamDataLoad);
        teamManagementStore.instance.addListener(teamManagementStore.TeamManagementStore.TEAM_OVERVIEW_DATA_RECEIVED, this.teamOverviewDataReceived);
        teamManagementStore.instance.addListener(teamManagementStore.TeamManagementStore.TEAM_EXCEPTIONS_DATA_LOADED_EVENT, this.onExceptionDataLoad);
        /* Load the unread mandatory message status for displaying mandatory messages */
        messagingActionCreator.getUnreadMandatoryMessageStatus(enums.TriggerPoint.QigSelector);
        warningMessageStore.instance.addListener(warningMessageStore.WarningMessageStore.WARNING_MESSAGE_NAVIGATION_EVENT, this.handleWarningMessageNavigation);
        teamManagementStore.instance.addListener(teamManagementStore.TeamManagementStore.MY_TEAM_MANAGEMENT_EXAMINER_VALIDATED_EVENT, this.examinerValidated);
        warningMessageStore.instance.addListener(warningMessageStore.WarningMessageStore.WARNING_MESSAGE_EVENT, this.sepActionFailureReceived);
    };
    /**
     * Unsubscribe language change event
     */
    TeamManagement.prototype.componentWillUnmount = function () {
        busyIndicatorStore.instance.removeListener(busyIndicatorStore.BusyIndicatorStore.BUSY_INDICATOR, this.setBusyIndicator);
        userInfoStore.instance.removeListener(userInfoStore.UserInfoStore.USERINFO_SAVE, this.userInfoSaved);
        userInfoStore.instance.removeListener(userInfoStore.UserInfoStore.SHOW_LOGOUT_POPUP_EVENT, this.showLogoutConfirmation);
        teamManagementStore.instance.removeListener(teamManagementStore.TeamManagementStore.SET_PANEL_STATE, this.setLeftPanelState);
        teamManagementStore.instance.removeListener(teamManagementStore.TeamManagementStore.TEAM_MANAGEMENT_SELECTED_TAB, this.setLinkSelection);
        teamManagementStore.instance.removeListener(teamManagementStore.TeamManagementStore.HELP_EXAMINERS_DATA_RECEIVED, this.onHelpExaminersDataReceived);
        ccStore.instance.removeListener(ccStore.ConfigurableCharacteristicsStore.MARKSCHEME_GROUP_CC_GET, this.onMarkSchemeGroupCCLoaded);
        teamManagementStore.instance.removeListener(teamManagementStore.TeamManagementStore.CAN_EXECUTE_APPROVAL_MANAGEMENT_ACTION, this.onLockOrUnlockClicked);
        teamManagementStore.instance.removeListener(teamManagementStore.TeamManagementStore.MY_TEAM_DATA_LOADED_EVENT, this.onMyTeamDataLoad);
        teamManagementStore.instance.removeListener(teamManagementStore.TeamManagementStore.APPROVAL_MANAGEMENT_ACTION_EXECUTED, this.onApprovalManagementActionExecuted);
        teamManagementStore.instance.removeListener(teamManagementStore.TeamManagementStore.TEAM_OVERVIEW_DATA_RECEIVED, this.teamOverviewDataReceived);
        warningMessageStore.instance.removeListener(warningMessageStore.WarningMessageStore.WARNING_MESSAGE_NAVIGATION_EVENT, this.handleWarningMessageNavigation);
        teamManagementStore.instance.removeListener(teamManagementStore.TeamManagementStore.MY_TEAM_MANAGEMENT_EXAMINER_VALIDATED_EVENT, this.examinerValidated);
        teamManagementStore.instance.removeListener(teamManagementStore.TeamManagementStore.TEAM_EXCEPTIONS_DATA_LOADED_EVENT, this.onExceptionDataLoad);
        warningMessageStore.instance.removeListener(warningMessageStore.WarningMessageStore.WARNING_MESSAGE_EVENT, this.sepActionFailureReceived);
    };
    /**
     * component will receive props
     */
    TeamManagement.prototype.componentWillReceiveProps = function (nextProps) {
        if (this.props !== nextProps) {
            // Get the team overview counts
            this.getTeamManagementOverviewCounts();
            this.setState({
                selectedTab: teamManagementStore.instance.selectedTeamManagementTab,
                renderedOn: nextProps.renderedOn
            });
        }
    };
    /**
     * Render method
     */
    TeamManagement.prototype.render = function () {
        var _this = this;
        var unlockExaminerConfirmationDialog;
        if (this.state.unlockExaminerRoleId > 0) {
            unlockExaminerConfirmationDialog = (React.createElement(ConfirmationDialog, {content: localeStore.instance.TranslateText('team-management.help-examiners.unlock-confirmation-dialog.body')
                .replace('{examinername}', this.unlockExaminerName), header: localeStore.instance.TranslateText('team-management.help-examiners.unlock-confirmation-dialog.header'), yesButtonText: localeStore.instance.
                TranslateText('team-management.help-examiners.unlock-confirmation-dialog.yes-button'), noButtonText: localeStore.instance.
                TranslateText('team-management.help-examiners.unlock-confirmation-dialog.no-button'), dialogType: enums.PopupDialogType.UnlockExaminerConfirmation, displayPopup: true, isCheckBoxVisible: false, key: 'UnlockExaminerConfirmation', onNoClick: function () { _this.setState({ unlockExaminerRoleId: 0 }); }, onYesClick: function () { _this.executeSEPAction(enums.SEPAction.Unlock, _this.state.unlockExaminerRoleId); }}));
        }
        var saveEmailMessage = stringHelper.format(localeStore.instance.TranslateText('generic.user-menu.email-address-saved-dialog.body'), [String(String.fromCharCode(179))]);
        var emailSaveMessage = (React.createElement(GenericDialog, {content: saveEmailMessage, header: localeStore.instance.TranslateText('generic.user-menu.email-address-saved-dialog.header'), displayPopup: this.state.isSaveEmailMessageDisplaying, okButtonText: localeStore.instance.TranslateText('marking.worklist.response-allocation-error-dialog.ok-button'), onOkClick: this.onOkClickOfEmailSucessMessage, id: 'emailSaveMessage', key: 'emailSaveMessage', popupDialogType: enums.PopupDialogType.ResponseAllocationError}));
        var busyIndicator = (React.createElement(BusyIndicator, {id: 'busyIndicator', key: 'busyIndicator', isBusy: this.state.isBusy, busyIndicatorInvoker: enums.BusyIndicatorInvoker.none}));
        var header = (React.createElement(Header, {selectedLanguage: this.props.selectedLanguage, isInTeamManagement: true, renderedOn: this.state.renderedOn, containerPage: enums.PageContainers.TeamManagement}));
        var footer = (React.createElement(Footer, {selectedLanguage: this.props.selectedLanguage, id: 'footer_team_mgmt', key: 'footer_team_mgmt', footerType: enums.FooterType.TeamManagement, isLogoutConfirmationPopupDisplaying: this.state.isLogoutConfirmationPopupDisplaying, resetLogoutConfirmationSatus: this.resetLogoutConfirmationSatus}));
        return (React.createElement("div", {className: classNames('team-wrapper', this.state.isLeftPanelCollapsed ? 'hide-left' : '')}, header, footer, emailSaveMessage, unlockExaminerConfirmationDialog, this.renderDetails(), busyIndicator));
    };
    /**
     * Render the details for the team management.
     */
    TeamManagement.prototype.renderDetails = function () {
        // Render all components for the team management.
        return (React.createElement("div", {className: 'content-wrapper'}, React.createElement(TeamManagementCollapsiblePanel, {id: 'TeamManagementCollapsiblePanel', key: 'TeamManagementCollapsiblePanel-Key', availableTeamLinks: this.getTeamLinks(), renderedOn: this.state.renderedOn, onLinkClick: this.onLinkClick}), React.createElement(TeamManagementContainer, {id: 'TeamMangementContainer', key: 'TeamManagementContainer-Key', teamManagementTab: this.state.selectedTab, selectedLanguage: this.props.selectedLanguage, toggleLeftPanel: this.onLeftPanelCollapseOrExpand, renderedOn: this.state.renderedOn, isFromMenu: this.props.isFromMenu})));
    };
    /**
     * Reset content refresh statuses
     */
    TeamManagement.prototype.resetContentRefreshStatuses = function () {
        this.isContentRefreshStarted = false;
    };
    /**
     * Reseting the confirmation dialog's state to make it invisible.
     */
    TeamManagement.prototype.resetLogoutConfirmationSatus = function () {
        this.setState({ isLogoutConfirmationPopupDisplaying: false });
    };
    /**
     * Email save success message ok click
     */
    TeamManagement.prototype.onOkClickOfEmailSucessMessage = function () {
        this.setState({
            isSaveEmailMessageDisplaying: false
        });
    };
    /**
     * Execute SEP Action method
     * @param actionIdentifier
     * @param examinerRoleId
     * @param markSchemeGroupId
     * @param requestedByExaminerRoleId
     */
    TeamManagement.prototype.executeSEPAction = function (actionIdentifier, examinerRoleId) {
        if (!applicationactioncreator.checkActionInterrupted()) {
            return;
        }
        var dataCollection = new Array();
        var examinerSEPAction = {
            examinerRoleId: examinerRoleId,
            markSchemeGroupId: qigStore.instance.getSelectedQIGForTheLoggedInUser.markSchemeGroupId,
            requestedByExaminerRoleId: qigStore.instance.getSelectedQIGForTheLoggedInUser.examinerRoleId
        };
        dataCollection.push(examinerSEPAction);
        var examinerSEPActions = Immutable.List(dataCollection);
        var doSEPApprovalManagementActionArgument = {
            actionIdentifier: actionIdentifier,
            examiners: examinerSEPActions
        };
        teamManagementActionCreator.ExecuteApprovalManagementAction(doSEPApprovalManagementActionArgument);
        // If unlock, close the confirmation
        if (this.state.unlockExaminerRoleId > 0) {
            this.setState({ unlockExaminerRoleId: 0 });
        }
    };
    /**
     * Validate logged in examiner on clicking My Team Tab
     * @param examinerRoleId
     * @param requestedByExaminerRoleId
     */
    TeamManagement.prototype.validateExaminerOnClick = function (examinerRoleId, markSchemeGroupId) {
        var examinerValidationArea = enums.ExaminerValidationArea.MyTeam;
        // validates the examiner
        teamManagementActionCreator.teamManagementExaminerValidation(markSchemeGroupId, examinerRoleId, 0, 0, examinerValidationArea, false, null, enums.MarkingMode.None, 0, true);
    };
    /**
     * after examiner validation drill down to examiner worklist
     */
    TeamManagement.prototype.examinerValidated = function (failureCode, examinerDrillDownData, examinerValidationArea) {
        if (failureCode === void 0) { failureCode = enums.FailureCode.None; }
        if (failureCode === enums.FailureCode.None && examinerDrillDownData.examinerId > 0
            && examinerDrillDownData.examinerRoleId > 0) {
            teamManagementActionCreator.updateExaminerDrillDownData(examinerDrillDownData);
        }
        else if (failureCode === enums.FailureCode.None) {
            teamManagementActionCreator.teammanagementTabSelect(enums.TeamManagement.MyTeam);
        }
    };
    return TeamManagement;
}(pureRenderComponent));
module.exports = TeamManagement;
//# sourceMappingURL=teammanagement.js.map