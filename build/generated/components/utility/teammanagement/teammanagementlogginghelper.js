"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var loggerBase = require('../../base/loggerbase');
var logCategory = require('../auditlogger/auditloggingcategory');
var TeamManagementLoggingHelper = (function (_super) {
    __extends(TeamManagementLoggingHelper, _super);
    /**
     * Constructor
     */
    function TeamManagementLoggingHelper() {
        _super.call(this, logCategory.TEAM_MANAGEMENT_TAB_SWITCH);
    }
    /**
     * Log response open audit details.
     * @param reason
     * @param activity
     * @param statusData
     */
    TeamManagementLoggingHelper.prototype.logSubordinateStatusChange = function (reason, activity, statusData) {
        var logActionObj = {
            'Reason': reason,
            'Activity': activity,
            'statusData': statusData
        };
        var result = this.formatInputAction(logActionObj);
        this.saveAuditLog(result, true);
    };
    /**
     * Log supervisor sampling feedback change actions.
     * @param reason
     * @param activity
     * @param samplingArg
     */
    TeamManagementLoggingHelper.prototype.logSupervisorSamplingChanges = function (reason, activity, samplingArg) {
        var logActionObj = {
            'Reason': reason,
            'Activity': activity,
            'SamplingArg': samplingArg
        };
        var result = this.formatInputAction(logActionObj);
        this.saveAuditLog(result, true);
    };
    return TeamManagementLoggingHelper;
}(loggerBase));
module.exports = TeamManagementLoggingHelper;
//# sourceMappingURL=teammanagementlogginghelper.js.map