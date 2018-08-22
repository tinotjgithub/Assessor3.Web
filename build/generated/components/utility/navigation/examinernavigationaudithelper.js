"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var loggerBase = require('../../base/loggerbase');
var logCategory = require('../auditlogger/auditloggingcategory');
var ExaminerNavigationAuditHelper = (function (_super) {
    __extends(ExaminerNavigationAuditHelper, _super);
    /**
     * Constructor
     */
    function ExaminerNavigationAuditHelper() {
        _super.call(this, logCategory.SCREEN_NAVIGATION);
    }
    /**
     * Log response open audit details.
     * @param reason
     * @param activity
     * @param displayId
     * @param responseMode
     */
    ExaminerNavigationAuditHelper.prototype.logResponseOpenAudit = function (reason, activity, displayId, responseMode) {
        var logActionObj = {
            'Reason': reason,
            'Activity': activity,
            'displayId': displayId,
            'responseMode': responseMode
        };
        var result = this.formatInputAction(logActionObj);
        this.saveAuditLog(result, true);
    };
    return ExaminerNavigationAuditHelper;
}(loggerBase));
module.exports = ExaminerNavigationAuditHelper;
//# sourceMappingURL=examinernavigationaudithelper.js.map