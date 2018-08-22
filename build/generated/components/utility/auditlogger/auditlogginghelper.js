"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var loggerBase = require('../../base/loggerbase');
var auditLoggingCategory = require('./auditloggingcategory');
var AuditLoggingHelper = (function (_super) {
    __extends(AuditLoggingHelper, _super);
    /**
     * Constructor
     */
    function AuditLoggingHelper() {
        _super.call(this, auditLoggingCategory.GENERAL);
    }
    return AuditLoggingHelper;
}(loggerBase));
module.exports = AuditLoggingHelper;
//# sourceMappingURL=auditlogginghelper.js.map