"use strict";
var loginStore = require('../../stores/login/loginstore');
var enums = require('../../components/utility/enums');
var logCategory = require('../../components/utility/auditlogger/auditloggingcategory');
var applicationStore = require('../../stores/applicationoffline/applicationstore');
var ai = require('applicationinsights-js');
var AiHelper = (function () {
    function AiHelper() {
    }
    /**
     * Initializing application insight analytics.
     */
    AiHelper.initializeAnalytics = function () {
        if (!config.logger.LOGGING_ENABLED) {
            return;
        }
        var userName = (loginStore.instance.loggedInUserName !== undefined) ? loginStore.instance.loggedInUserName : '';
        ai.AppInsights.downloadAndSetup({ instrumentationKey: config.applicationinsightconfig.INSTRUMENTATION_KEY });
        ai.AppInsights.queue.push(function () {
            ai.AppInsights.context.addTelemetryInitializer(function (envelope) {
                envelope.tags['ai.user.id'] = userName;
                envelope.tags['ai.application.ver'] = config.applicationinsightconfig.APPLICATION_VERSION;
                if (config.applicationinsightconfig.ROLE_NAME && config.applicationinsightconfig.ROLE_NAME !== '') {
                    envelope.tags['ai.device.roleName'] = config.applicationinsightconfig.ROLE_NAME;
                }
            });
        });
    };
    /**
     * Logging event on Url Change.
     * @param {string} pageView
     * @param {boolean = true} isModelView
     */
    AiHelper.logEventOnUrlChange = function (pageView) {
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
        AiHelper.logEventToAI(logCategory.SCREEN_NAVIGATION, action, true, pageView);
    };
    /**
     * Logging event on Url Change.
     * @param {string} pageView
     * @param {boolean = true} isModelView
     */
    AiHelper.logEventOnContainerChange = function (containerPage) {
        if (!config.logger.LOGGING_ENABLED) {
            return;
        }
        var action = 'Examiner ' + ((loginStore.instance.loggedInUserName !== undefined) ?
            loginStore.instance.loggedInUserName : '') +
            ' navigated to ' + containerPage + ' screen ';
        AiHelper.logEventToAI(logCategory.SCREEN_NAVIGATION, action, true, containerPage);
    };
    /**
     * Logging event on Tab switch
     * @param {string} pageView
     * @param {enums.WorklistType} workListType
     * @param {enums.ResponseMode} currentResponseMode
     */
    AiHelper.logEventOnTabSwitch = function (workListType, currentResponseMode, qigName, isTeamManagementView, selectedExaminerId) {
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
        AiHelper.logEventToAI(logCategory.TAB_SWITCH, action, false, 'Tab Switch');
    };
    /**
     * Logging event on Tab switch
     * @param {string} pageView
     */
    AiHelper.logEventOnTeamManagementTabSwitch = function (selectedTab) {
        if (!config.logger.LOGGING_ENABLED) {
            return;
        }
        var action = 'Examiner ' + loginStore.instance.loggedInUserName + ' switched tab in TeamManagement to  '
            + enums.TeamManagement[selectedTab];
        AiHelper.logEventToAI(logCategory.TEAM_MANAGEMENT_TAB_SWITCH, action, false, 'Tab Switch');
    };
    /**
     * Logging event on Qig selection
     * @param {string} qigName
     */
    AiHelper.logEventOnQigSelection = function (qigName) {
        if (!config.logger.LOGGING_ENABLED) {
            return;
        }
        var action = 'Examiner ' + loginStore.instance.loggedInUserName + ' selected Qig- ' + qigName;
        AiHelper.logEventToAI(logCategory.QIG_SELECTION, action, false, 'Qig Selection');
    };
    /**
     * Logging event on Response allocation.
     * @param {boolean} hasAllocationError
     * @param {number} resonseCount
     */
    AiHelper.logEventOnResponseAllocation = function (hasAllocationError, resonseCount) {
        if (resonseCount === void 0) { resonseCount = 0; }
        if (!config.logger.LOGGING_ENABLED) {
            return;
        }
        var action;
        action = hasAllocationError ? 'Response Allocation Error' : 'Examiner ' + loginStore.instance.loggedInUserName +
            ' allocated ' + resonseCount + ' response(s).';
        AiHelper.logEventToAI(logCategory.RESPONSE_ALLOCATION, action, false, 'Response Allocation');
    };
    /**
     * log Event On SubmitResponse
     * @param submittedCosubmittedMarkGroupIdsunt
     * @param submittedCosubmittedMarkGroupIdsunt
     */
    AiHelper.logEventOnSubmitResponse = function (submittedCount, submittedMarkGroupIds) {
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
        AiHelper.logEventToAI(logCategory.SUBMIT_RESPONSE, action, false, 'Submit Response');
    };
    /**
     * Logging marking style in application insight
     * @param {type} keyUsage
     * @param {type} markButtonUsage
     * @param {type} responseId
     */
    AiHelper.logEventOnMarking = function (keyUsage, markButtonUsage, responseId) {
        if (!config.logger.LOGGING_ENABLED) {
            return;
        }
        var action = this.formatOutPut(logCategory.MARKING_STYLE);
        action += 'Examiner ' + loginStore.instance.loggedInUserName + ' marked response - ' + responseId +
            ' Key entries - ' + keyUsage + ' Mark button Entries - ' + markButtonUsage;
        AiHelper.logEventToAI(logCategory.MARKING_STYLE, action, false, 'Marking style');
        // Clear the collection once send to the server.
        AiHelper.logAuditData[logCategory.MARKING_STYLE] = [];
    };
    /**
     * Logging event to application insights.
     * @param {string} category
     * @param {string} action
     * @param {boolean} isPageView
     * @param {string} pageHash
     */
    AiHelper.logEventToAI = function (category, action, isPageView, pageHash) {
        // If application is offline store all the logs and when we have
        // active connection send to google and clear the log.
        if (!applicationStore.instance.isOnline) {
            var log = {
                category: category,
                action: action,
                isPageView: isPageView,
                pageHash: pageHash
            };
            AiHelper.pendingAnalyticLog.push(log);
            return;
        }
        ai.AppInsights.trackPageView(pageHash);
        ai.AppInsights.trackEvent(category, { Action: action });
        // remove all unsaved logs when we have open connection.
        for (var i = 0; i < this.pendingAnalyticLog.length; i++) {
            var log = this.pendingAnalyticLog.pop();
            AiHelper.logEventToAI(log.category, log.action, log.isPageView, log.pageHash);
        }
    };
    /**
     * Send actions logs to analytics.
     * @param actionType
     * @param actions
     */
    AiHelper.sendLogToServer = function (actionType, action, saveAction) {
        if (!config.logger.LOGGING_ENABLED) {
            return;
        }
        // If it is new entry initialize before it use
        if (!this.logAuditData[actionType]) {
            this.logAuditData[actionType] = new Array();
        }
        // Add the log data into the list
        AiHelper.logAuditData[actionType].push(action);
        // Get the logs from the list.
        var logs = AiHelper.logAuditData[actionType].map(function (action) {
            return action;
        });
        // Save the logs into server. If save option is true or log has more records.
        if (saveAction || logs.length >= config.logger.MAXIMUM_LOGS_FOR_BATCHSAVE) {
            var result = this.formatOutPut(actionType);
            AiHelper.logEventToAI(actionType, result, false, actionType);
            AiHelper.logAuditData[actionType] = [];
        }
    };
    /**
     * format the output log.
     * @param actionType
     * @param actions
     */
    AiHelper.formatOutPut = function (actionType) {
        var log = AiHelper.logAuditData[actionType];
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
    AiHelper.logEventOnApplicationError = function (errorData) {
        if (!config.logger.LOGGING_ENABLED) {
            return;
        }
        var action = 'Examiner ' + loginStore.instance.loggedInUserName + ' - Error Details - ' + errorData;
        AiHelper.logEventToAI(logCategory.APPLICATION_ERROR, action, false, 'Application Error');
    };
    /**
     * Logging menu action in application insights
     * @param {string} message
     */
    AiHelper.logEventOnMenuAction = function (message) {
        if (!config.logger.LOGGING_ENABLED) {
            return;
        }
        var action = this.formatOutPut(logCategory.MENU_ACTION);
        action += 'Examiner ' + loginStore.instance.loggedInUserName + ' - ' + message;
        AiHelper.logEventToAI(logCategory.MENU_ACTION, action, false, 'Menu actions');
        // Clear the collection once send to the server.
        AiHelper.logAuditData[logCategory.MENU_ACTION] = [];
    };
    /**
     * Logging application status in application insights
     * @param {string} message
     */
    AiHelper.logEventOnApplicationStatusChange = function (message) {
        if (!config.logger.LOGGING_ENABLED) {
            return;
        }
        var action = this.formatOutPut(logCategory.APPLICATION_OFFLINE);
        action += 'Examiner ' + loginStore.instance.loggedInUserName + ' - ' + message;
        AiHelper.logEventToAI(logCategory.APPLICATION_OFFLINE, action, false, 'Application Status');
    };
    /**
     * Logging event on response view mode change
     * @param {string} message
     */
    AiHelper.logEventOnResponseViewModeChange = function (message) {
        if (!config.logger.LOGGING_ENABLED) {
            return;
        }
        var action = 'Examiner ' + loginStore.instance.loggedInUserName + ' - Response view mode changed to ' + message;
        AiHelper.logEventToAI(logCategory.CHANGE_RESPONSE_VIEW_MODE, action, false, 'Response view mode change');
        // Clear the collection once send to the server.
        AiHelper.logAuditData[logCategory.CHANGE_RESPONSE_VIEW_MODE] = [];
    };
    AiHelper.logAuditData = {};
    // Hold a value indicating analytic logs those are failed when connection lost.
    AiHelper.pendingAnalyticLog = new Array();
    return AiHelper;
}());
module.exports = AiHelper;
//# sourceMappingURL=aihelper.js.map