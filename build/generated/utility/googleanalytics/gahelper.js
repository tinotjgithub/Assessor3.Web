"use strict";
var reactGa = require('react-ga');
var loginSession = require('../../app/loginsession');
var loginStore = require('../../stores/login/loginstore');
var enums = require('../../components/utility/enums');
var logCategory = require('../../components/utility/auditlogger/auditloggingcategory');
var applicationStore = require('../../stores/applicationoffline/applicationstore');
var GaHelper = (function () {
    function GaHelper() {
    }
    /**
     * Initializing google analytics
     */
    GaHelper.initializeAnalytics = function () {
        if (!config.logger.LOGGING_ENABLED) {
            return;
        }
        var userName = (loginStore.instance.loggedInUserName !== undefined) ? loginStore.instance.loggedInUserName : '';
        /** Initializing gaOptions with debug = false, if debug is true it will show log in the console */
        var gaOptions = {
            debug: false,
            gaOptions: {
                clientId: userName,
                userId: userName,
                userName: userName,
                markingSessionTrackingId: loginSession.MARKING_SESSION_TRACKING_ID,
                // If cookieExpires time to 0 (zero) seconds, the cookie turns into a 
                // session based cookie and expires once the current browser session ends.
                // https://developers.google.com/analytics/devguides/collection/analyticsjs/cookies-user-id
                cookieExpires: 0
            },
            titleCase: false // Added for avoiding loops in the library
        };
        reactGa.initialize(config.googleanalyticsconfig.GOOGLE_ANALYTICS_TRACKING_ID, gaOptions);
    };
    /**
     * Logging event on Url Change.
     * @param {string} pageView
     * @param {boolean = true} isModelView
     */
    GaHelper.logEventOnUrlChange = function (pageView) {
        if (!config.logger.LOGGING_ENABLED) {
            return;
        }
        switch (pageView) {
            case '/':
                pageView = 'Login';
                break;
            default: pageView = pageView.replace('/', '');
        }
        var previousHash = '';
        var action = 'Examiner ' + ((loginStore.instance.loggedInUserName !== undefined) ?
            loginStore.instance.loggedInUserName : '') +
            ' navigated to ' + pageView + ' screen ';
        GaHelper.logEventToGA(logCategory.SCREEN_NAVIGATION, action, true, pageView);
    };
    /**
     * Logging event on Url Change.
     * @param {string} pageView
     * @param {boolean = true} isModelView
     */
    GaHelper.logEventOnContainerChange = function (containerPage) {
        if (!config.logger.LOGGING_ENABLED) {
            return;
        }
        var action = 'Examiner ' + ((loginStore.instance.loggedInUserName !== undefined) ?
            loginStore.instance.loggedInUserName : '') +
            ' navigated to ' + containerPage + ' screen ';
        GaHelper.logEventToGA(logCategory.SCREEN_NAVIGATION, action, true, containerPage);
    };
    /**
     * Logging event on Tab switch
     * @param {string} pageView
     * @param {enums.WorklistType} workListType
     * @param {enums.ResponseMode} currentResponseMode
     */
    GaHelper.logEventOnTabSwitch = function (workListType, currentResponseMode, qigName, isTeamManagementView, selectedExaminerId) {
        if (!config.logger.LOGGING_ENABLED) {
            return;
        }
        // If the supervisor is in teammanagement view and navigating to the subordinates worklist
        // log those details.
        var teamDetails = '';
        if (isTeamManagementView) {
            teamDetails += ' in subordinate (examiner id-' + selectedExaminerId + ')';
        }
        var action = 'Examiner ' + loginStore.instance.loggedInUserName +
            ' in qig ' + qigName + ' switched tab in ' + enums.WorklistType[workListType] +
            ' worklist to ' + enums.ResponseMode[currentResponseMode] + teamDetails;
        GaHelper.logEventToGA(logCategory.TAB_SWITCH, action, false, 'Tab Switch');
    };
    /**
     * Logging event on Tab switch
     * @param {string} pageView
     */
    GaHelper.logEventOnTeamManagementTabSwitch = function (selectedTab) {
        if (!config.logger.LOGGING_ENABLED) {
            return;
        }
        var action = 'Examiner ' + loginStore.instance.loggedInUserName + ' switched tab in TeamManagement to  '
            + enums.TeamManagement[selectedTab];
        GaHelper.logEventToGA(logCategory.TEAM_MANAGEMENT_TAB_SWITCH, action, false, 'Tab Switch');
    };
    /**
     * Logging event on Qig selection
     * @param {string} qigName
     */
    GaHelper.logEventOnQigSelection = function (qigName) {
        if (!config.logger.LOGGING_ENABLED) {
            return;
        }
        var action = 'Examiner ' + loginStore.instance.loggedInUserName + ' selected Qig- ' + qigName;
        GaHelper.logEventToGA(logCategory.QIG_SELECTION, action, false, 'Qig Selection');
    };
    /**
     * Logging event on Response allocation.
     * @param {boolean} hasAllocationError
     * @param {number} resonseCount
     */
    GaHelper.logEventOnResponseAllocation = function (hasAllocationError, resonseCount) {
        if (resonseCount === void 0) { resonseCount = 0; }
        if (!config.logger.LOGGING_ENABLED) {
            return;
        }
        var action;
        action = hasAllocationError ? 'Response Allocation Error' : 'Examiner ' + loginStore.instance.loggedInUserName +
            ' allocated ' + resonseCount + ' response(s).';
        GaHelper.logEventToGA(logCategory.RESPONSE_ALLOCATION, action, false, 'Response Allocation');
    };
    /**
     * log Event On SubmitResponse
     * @param submittedCosubmittedMarkGroupIdsunt
     * @param submittedCosubmittedMarkGroupIdsunt
     */
    GaHelper.logEventOnSubmitResponse = function (submittedCount, submittedMarkGroupIds) {
        if (!config.logger.LOGGING_ENABLED) {
            return;
        }
        var submittedResponse = '';
        submittedMarkGroupIds.map(function (mgid) {
            submittedResponse += mgid + ' ,';
        });
        var action;
        action = (submittedCount === 1) ? 'Examiner ' + loginStore.instance.loggedInUserName +
            ' submitted single response.' + submittedResponse : 'Examiner ' + loginStore.instance.loggedInUserName +
            ' submitted multiple response(s) - ' + submittedResponse +
            'count of ' + submittedCount + ' responses submitted';
        GaHelper.logEventToGA(logCategory.SUBMIT_RESPONSE, action, false, 'Submit Response');
    };
    /**
     * Logging marking style in google analytics
     * @param {type} keyUsage
     * @param {type} markButtonUsage
     * @param {type} responseId
     */
    GaHelper.logEventOnMarking = function (keyUsage, markButtonUsage, responseId) {
        if (!config.logger.LOGGING_ENABLED) {
            return;
        }
        var action = this.formatOutPut(logCategory.MARKING_STYLE);
        action += 'Examiner ' + loginStore.instance.loggedInUserName + ' marked response - ' + responseId +
            ' Key entries - ' + keyUsage + ' Mark button Entries - ' + markButtonUsage;
        GaHelper.logEventToGA(logCategory.MARKING_STYLE, action, false, 'Marking style');
        // Clear the collection once send to the server.
        GaHelper.logAuditData[logCategory.MARKING_STYLE] = [];
    };
    /**
     * Logging event to google Analytics.
     * @param {string} category
     * @param {string} action
     * @param {boolean} isPageView
     * @param {string} pageHash
     */
    GaHelper.logEventToGA = function (category, action, isPageView, pageHash) {
        // If application is offline store all the logs and when we have
        // active connection send to google and clear the log.
        if (!applicationStore.instance.isOnline) {
            var log = {
                category: category,
                action: action,
                isPageView: isPageView,
                pageHash: pageHash
            };
            GaHelper.pendingAnalyticLog.push(log);
            return;
        }
        if (isPageView) {
            reactGa.pageview(pageHash);
        }
        else {
            reactGa.modalview(pageHash);
        }
        reactGa.event({
            category: category,
            action: action
        });
        // remove all unsaved logs when we have open connection.
        for (var i = 0; i < this.pendingAnalyticLog.length; i++) {
            var log = this.pendingAnalyticLog.pop();
            GaHelper.logEventToGA(log.category, log.action, log.isPageView, log.pageHash);
        }
    };
    /**
     * Send actions logs to analytics.
     * @param actionType
     * @param actions
     */
    GaHelper.sendLogToServer = function (actionType, action, saveAction) {
        if (!config.logger.LOGGING_ENABLED) {
            return;
        }
        // If it is new entry initialize before it use
        if (!this.logAuditData[actionType]) {
            this.logAuditData[actionType] = new Array();
        }
        // Add the log data into the list
        GaHelper.logAuditData[actionType].push(action);
        // Get the logs from the list.
        var logs = GaHelper.logAuditData[actionType].map(function (action) {
            return action;
        });
        // Save the logs into server. If save option is true or log has more records.
        if (saveAction || logs.length >= config.logger.MAXIMUM_LOGS_FOR_BATCHSAVE) {
            var result = this.formatOutPut(actionType);
            GaHelper.logEventToGA(actionType, result, false, actionType);
            GaHelper.logAuditData[actionType] = [];
        }
    };
    /**
     * format the output log.
     * @param actionType
     * @param actions
     */
    GaHelper.formatOutPut = function (actionType) {
        var log = GaHelper.logAuditData[actionType];
        var actions = '';
        if (log) {
            log.map(function (action) {
                actions += action + '\n';
            });
        }
        return actions;
    };
    /**
     * Logging event on application exception
     * @param {string} pageView
     */
    GaHelper.logEventOnApplicationError = function (errorData) {
        if (!config.logger.LOGGING_ENABLED) {
            return;
        }
        var action = 'Examiner ' + loginStore.instance.loggedInUserName + ' - Error Details - ' + errorData;
        GaHelper.logEventToGA(logCategory.APPLICATION_ERROR, action, false, 'Application Error');
    };
    /**
     * Logging menu action in google analytics
     * @param {string} message
     */
    GaHelper.logEventOnMenuAction = function (message) {
        if (!config.logger.LOGGING_ENABLED) {
            return;
        }
        var action = this.formatOutPut(logCategory.MENU_ACTION);
        action += 'Examiner ' + loginStore.instance.loggedInUserName + ' - ' + message;
        GaHelper.logEventToGA(logCategory.MENU_ACTION, action, false, 'Menu actions');
        // Clear the collection once send to the server.
        GaHelper.logAuditData[logCategory.MENU_ACTION] = [];
    };
    /**
     * Logging application status in google analytics
     * @param {string} message
     */
    GaHelper.logEventOnApplicationStatusChange = function (message) {
        if (!config.logger.LOGGING_ENABLED) {
            return;
        }
        var action = this.formatOutPut(logCategory.APPLICATION_OFFLINE);
        action += 'Examiner ' + loginStore.instance.loggedInUserName + ' - ' + message;
        GaHelper.logEventToGA(logCategory.APPLICATION_OFFLINE, action, false, 'Application Status');
    };
    /**
     * Logging event on response view mode change
     * @param {string} message
     */
    GaHelper.logEventOnResponseViewModeChange = function (message) {
        if (!config.logger.LOGGING_ENABLED) {
            return;
        }
        var action = 'Examiner ' + loginStore.instance.loggedInUserName + ' - Response view mode changed to ' + message;
        GaHelper.logEventToGA(logCategory.CHANGE_RESPONSE_VIEW_MODE, action, false, 'Response view mode change');
        // Clear the collection once send to the server.
        GaHelper.logAuditData[logCategory.CHANGE_RESPONSE_VIEW_MODE] = [];
    };
    GaHelper.logAuditData = {};
    // Hold a value indicating analytic logs those are failed when connection lost.
    GaHelper.pendingAnalyticLog = new Array();
    return GaHelper;
}());
module.exports = GaHelper;
//# sourceMappingURL=gahelper.js.map