"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var loggerBase = require('../../base/loggerbase');
var logCategory = require('../auditlogger/auditloggingcategory');
var NetworkChangeAuditHelper = (function (_super) {
    __extends(NetworkChangeAuditHelper, _super);
    /**
     * Constructor
     */
    function NetworkChangeAuditHelper() {
        _super.call(this, logCategory.APPLICATION_OFFLINE);
    }
    /**
     * Log network change details.
     * @param reason
     * @param activity
     * @param isOnline
     */
    NetworkChangeAuditHelper.prototype.logNetworkChangeAudit = function (reason, activity, isOnline) {
        var logActionObj = {
            'Reason': reason,
            'Activity': activity,
            'isOnline': isOnline ? 'Online' : 'Offline'
        };
        var result = this.formatInputAction(logActionObj);
        this.saveAuditLog(result, false);
    };
    return NetworkChangeAuditHelper;
}(loggerBase));
module.exports = NetworkChangeAuditHelper;
//# sourceMappingURL=networkchangeaudithelper.js.map