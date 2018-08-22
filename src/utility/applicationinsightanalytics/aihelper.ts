import loginSession = require('../../app/loginsession');
import loginStore = require('../../stores/login/loginstore');
import navigationHelper = require('../../components/utility/navigation/navigationhelper');
import enums = require('../../components/utility/enums');
import submitStore = require('../../stores/submit/submitstore');
import logCategory = require('../../components/utility/auditlogger/auditloggingcategory');
import applicationStore = require('../../stores/applicationoffline/applicationstore');
import ai = require('applicationinsights-js');
declare let config: any;

class AiHelper {

    public static logAuditData: AuditDataMap = {};

    // Hold a value indicating analytic logs those are failed when connection lost.
    public static pendingAnalyticLog: Array<AnalyticLog> = new Array<AnalyticLog>();


    /**
     * Initializing application insight analytics.
     */
    public static initializeAnalytics() {

        if (!config.logger.LOGGING_ENABLED) {
            return;
        }

        let userName = (loginStore.instance.loggedInUserName !== undefined) ? loginStore.instance.loggedInUserName : '';

        ai.AppInsights.downloadAndSetup({ instrumentationKey: config.applicationinsightconfig.INSTRUMENTATION_KEY });
        ai.AppInsights.queue.push(function() {
            ai.AppInsights.context.addTelemetryInitializer(function(envelope) {
                envelope.tags['ai.user.id'] = userName;
                envelope.tags['ai.application.ver'] = config.applicationinsightconfig.APPLICATION_VERSION;
                if (config.applicationinsightconfig.ROLE_NAME && config.applicationinsightconfig.ROLE_NAME !== '') {
                    envelope.tags['ai.device.roleName'] = config.applicationinsightconfig.ROLE_NAME;
                }
            });
        });
    }

    /**
     * Logging event on Url Change.
     * @param {string} pageView
     * @param {boolean = true} isModelView
     */
    public static logEventOnUrlChange(pageView: string) {

        if (!config.logger.LOGGING_ENABLED) {
            return;
        }

        switch (pageView) {
            case '/': pageView = 'Login';
                break;
            default: pageView = pageView.replace('/', '');
        }

        let previousHash: string = '';
        let action: string = 'Examiner ' + ((loginStore.instance.loggedInUserName !== undefined) ?
            loginStore.instance.loggedInUserName : '') +
            ' navigated to ' + pageView + ' screen ';
        AiHelper.logEventToAI(logCategory.SCREEN_NAVIGATION, action, true, pageView);
    }

    /**
     * Logging event on Url Change.
     * @param {string} pageView
     * @param {boolean = true} isModelView
     */
    public static logEventOnContainerChange(containerPage: string) {

        if (!config.logger.LOGGING_ENABLED) {
            return;
        }

        let action: string = 'Examiner ' + ((loginStore.instance.loggedInUserName !== undefined) ?
            loginStore.instance.loggedInUserName : '') +
            ' navigated to ' + containerPage + ' screen ';
        AiHelper.logEventToAI(logCategory.SCREEN_NAVIGATION, action, true, containerPage);
    }

    /**
     * Logging event on Tab switch
     * @param {string} pageView
     * @param {enums.WorklistType} workListType
     * @param {enums.ResponseMode} currentResponseMode
     */
    public static logEventOnTabSwitch(workListType: enums.WorklistType,
        currentResponseMode: enums.ResponseMode,
        qigName: string,
        isTeamManagementView: boolean,
        selectedExaminerId: number) {

        if (!config.logger.LOGGING_ENABLED) {
            return;
        }

        // If the supervisor is in teammanagement view and navigating to the subordinates worklist
        // log those details.
        let teamDetails: string = '';
        if (isTeamManagementView) {
            teamDetails += ' in subordinate (examiner id-' + selectedExaminerId + ')';
        }

        let action: string = 'Examiner ' + loginStore.instance.loggedInUserName +
            ' in qig ' + qigName + ' switched tab in ' + enums.WorklistType[workListType] +
            ' worklist to ' + enums.ResponseMode[currentResponseMode] + teamDetails;

        AiHelper.logEventToAI(logCategory.TAB_SWITCH, action, false, 'Tab Switch');
    }

    /**
     * Logging event on Tab switch
     * @param {string} pageView
     */
    public static logEventOnTeamManagementTabSwitch(selectedTab: enums.TeamManagement) {

        if (!config.logger.LOGGING_ENABLED) {
            return;
        }

        let action: string = 'Examiner ' + loginStore.instance.loggedInUserName + ' switched tab in TeamManagement to  '
            + enums.TeamManagement[selectedTab];
        AiHelper.logEventToAI(logCategory.TEAM_MANAGEMENT_TAB_SWITCH, action, false, 'Tab Switch');
    }

    /**
     * Logging event on Qig selection
     * @param {string} qigName
     */
    public static logEventOnQigSelection(qigName: string) {

        if (!config.logger.LOGGING_ENABLED) {
            return;
        }

        let action: string = 'Examiner ' + loginStore.instance.loggedInUserName + ' selected Qig- ' + qigName;
        AiHelper.logEventToAI(logCategory.QIG_SELECTION, action, false, 'Qig Selection');
    }

    /**
     * Logging event on Response allocation.
     * @param {boolean} hasAllocationError
     * @param {number} resonseCount
     */
    public static logEventOnResponseAllocation(hasAllocationError: boolean, resonseCount: number = 0) {

        if (!config.logger.LOGGING_ENABLED) {
            return;
        }

        let action: string;
        action = hasAllocationError ? 'Response Allocation Error' : 'Examiner ' + loginStore.instance.loggedInUserName +
            ' allocated ' + resonseCount + ' response(s).';
        AiHelper.logEventToAI(logCategory.RESPONSE_ALLOCATION, action, false, 'Response Allocation');
    }

    /**
     * log Event On SubmitResponse
     * @param submittedCosubmittedMarkGroupIdsunt
     * @param submittedCosubmittedMarkGroupIdsunt
     */
    public static logEventOnSubmitResponse(submittedCount: number, submittedMarkGroupIds: Array<number>) {

        if (!config.logger.LOGGING_ENABLED) {
            return;
        }

        let submittedResponse: string = '';
        submittedMarkGroupIds.map((mgid: number) => {
            submittedResponse += mgid + ' ,';
        });

        let action: string;
        action = (submittedCount === 1) ? 'Examiner ' + loginStore.instance.loggedInUserName +
            ' submitted single response.' + submittedResponse : 'Examiner ' + loginStore.instance.loggedInUserName +
            ' submitted multiple response(s) - ' + submittedResponse +
            'count of ' + submittedCount + ' responses submitted';
        AiHelper.logEventToAI(logCategory.SUBMIT_RESPONSE, action, false, 'Submit Response');
    }

    /**
     * Logging marking style in application insight
     * @param {type} keyUsage
     * @param {type} markButtonUsage
     * @param {type} responseId
     */
    public static logEventOnMarking(keyUsage: number, markButtonUsage: number, responseId: string) {
        if (!config.logger.LOGGING_ENABLED) {
            return;
        }

        let action: string = this.formatOutPut(logCategory.MARKING_STYLE);
        action += 'Examiner ' + loginStore.instance.loggedInUserName + ' marked response - ' + responseId +
            ' Key entries - ' + keyUsage + ' Mark button Entries - ' + markButtonUsage;
        AiHelper.logEventToAI(logCategory.MARKING_STYLE, action, false, 'Marking style');

        // Clear the collection once send to the server.
        AiHelper.logAuditData[logCategory.MARKING_STYLE] = [];
    }

    /**
     * Logging event to application insights.
     * @param {string} category
     * @param {string} action
     * @param {boolean} isPageView
     * @param {string} pageHash
     */
    public static logEventToAI(category: string, action: string, isPageView: boolean, pageHash: string) {

        // If application is offline store all the logs and when we have
        // active connection send to google and clear the log.
        if (!applicationStore.instance.isOnline) {

            let log: AnalyticLog = {
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
        for (let i = 0; i < this.pendingAnalyticLog.length; i++) {

            let log: AnalyticLog = this.pendingAnalyticLog.pop();
            AiHelper.logEventToAI(log.category, log.action, log.isPageView, log.pageHash);
        }
    }

	/**
	 * Send actions logs to analytics.
	 * @param actionType
	 * @param actions
	 */
    public static sendLogToServer(actionType: string, action: string, saveAction: boolean): void {
        if (!config.logger.LOGGING_ENABLED) {
            return;
        }

        // If it is new entry initialize before it use
        if (!this.logAuditData[actionType]) {
            this.logAuditData[actionType] = new Array<string>();
        }

        // Add the log data into the list
        AiHelper.logAuditData[actionType].push(action);

        // Get the logs from the list.
        let logs = AiHelper.logAuditData[actionType].map((action: string) => {
            return action;
        });

        // Save the logs into server. If save option is true or log has more records.
        if (saveAction || logs.length >= config.logger.MAXIMUM_LOGS_FOR_BATCHSAVE) {
            let result = this.formatOutPut(actionType);
            AiHelper.logEventToAI(actionType, result, false, actionType);
            AiHelper.logAuditData[actionType] = [];
        }
    }

	/**
	 * format the output log.
	 * @param actionType
	 * @param actions
	 */
    private static formatOutPut(actionType: string): string {

        let log = AiHelper.logAuditData[actionType];
        let actions: string = '';
        if (log) {
            log.map((action: string) => {
                actions += action + '\n';
            });
        }
        return actions;
    }

    /**
     * Logging event on application exception
     * @param {string} pageView
     */
    public static logEventOnApplicationError(errorData: string) {

        if (!config.logger.LOGGING_ENABLED) {
            return;
        }

        let action: string = 'Examiner ' + loginStore.instance.loggedInUserName + ' - Error Details - ' + errorData;
        AiHelper.logEventToAI(logCategory.APPLICATION_ERROR, action, false, 'Application Error');
    }

    /**
     * Logging menu action in application insights
     * @param {string} message
     */
    public static logEventOnMenuAction(message: string) {
        if (!config.logger.LOGGING_ENABLED) {
            return;
        }

        let action: string = this.formatOutPut(logCategory.MENU_ACTION);
        action += 'Examiner ' + loginStore.instance.loggedInUserName + ' - ' + message;
        AiHelper.logEventToAI(logCategory.MENU_ACTION, action, false, 'Menu actions');

        // Clear the collection once send to the server.
        AiHelper.logAuditData[logCategory.MENU_ACTION] = [];
    }

    /**
     * Logging application status in application insights
     * @param {string} message
     */
    public static logEventOnApplicationStatusChange(message: string) {
        if (!config.logger.LOGGING_ENABLED) {
            return;
        }

        let action: string = this.formatOutPut(logCategory.APPLICATION_OFFLINE);
        action += 'Examiner ' + loginStore.instance.loggedInUserName + ' - ' + message;
        AiHelper.logEventToAI(logCategory.APPLICATION_OFFLINE, action, false, 'Application Status');
    }

    /**
     * Logging event on response view mode change
     * @param {string} message
     */
    public static logEventOnResponseViewModeChange(message: string) {

        if (!config.logger.LOGGING_ENABLED) {
            return;
        }

        let action: string = 'Examiner ' + loginStore.instance.loggedInUserName + ' - Response view mode changed to ' + message;
        AiHelper.logEventToAI(logCategory.CHANGE_RESPONSE_VIEW_MODE, action, false, 'Response view mode change');
        // Clear the collection once send to the server.
        AiHelper.logAuditData[logCategory.CHANGE_RESPONSE_VIEW_MODE] = [];
    }
}

export = AiHelper;