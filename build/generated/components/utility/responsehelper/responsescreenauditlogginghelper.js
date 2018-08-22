"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var loggerBase = require('../../base/loggerbase');
var logCategory = require('../auditlogger/auditloggingcategory');
var ResponseScreenAuditLoggingHelper = (function (_super) {
    __extends(ResponseScreenAuditLoggingHelper, _super);
    /**
     * Constructor
     */
    function ResponseScreenAuditLoggingHelper() {
        _super.call(this, logCategory.RESPONSE_SCREEN);
    }
    /**
     * Log response reject audit details.
     * @param reason
     * @param activity
     * @param displayId
     */
    ResponseScreenAuditLoggingHelper.prototype.logResponseRejectAction = function (reason, activity, displayId) {
        var logActionObj = {
            'Reason': reason,
            'Activity': activity,
            'displayId': displayId
        };
        var result = this.formatInputAction(logActionObj);
        this.saveAuditLog(result, true);
    };
    /**
     * Log response promot to seed audit details.
     * @param reason
     * @param activity
     * @param displayId
     */
    ResponseScreenAuditLoggingHelper.prototype.logResponsePromotToSeedAction = function (reason, activity, displayId) {
        var logActionObj = {
            'Reason': reason,
            'Activity': activity,
            'displayId': displayId
        };
        var result = this.formatInputAction(logActionObj);
        this.saveAuditLog(result, true);
    };
    /**
     * Log response remark craetion audit
     * @param reason
     * @param activity
     * @param displayId
     */
    ResponseScreenAuditLoggingHelper.prototype.logSupervisorRemarkCreationAction = function (reason, activity, isRemarkCreatingNow, requestArgument) {
        var logActionObj = {
            'Reason': reason,
            'Activity': activity,
            'isRemarkCreatingNow': isRemarkCreatingNow,
            'requestArgument': requestArgument
        };
        var result = this.formatInputAction(logActionObj);
        this.saveAuditLog(result, true);
    };
    return ResponseScreenAuditLoggingHelper;
}(loggerBase));
module.exports = ResponseScreenAuditLoggingHelper;
//# sourceMappingURL=responsescreenauditlogginghelper.js.map