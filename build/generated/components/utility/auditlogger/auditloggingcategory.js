"use strict";
/**
 * Holds the logging type categories.
 */
var AuditLoggingCategory;
(function (AuditLoggingCategory) {
    AuditLoggingCategory.SCREEN_NAVIGATION = 'Examiner navigated between screens';
    AuditLoggingCategory.TAB_SWITCH = 'Tab switch';
    AuditLoggingCategory.QIG_SELECTION = 'Qig selection';
    AuditLoggingCategory.RESPONSE_ALLOCATION = 'Response allocation';
    AuditLoggingCategory.SUBMIT_RESPONSE = 'Submit response';
    AuditLoggingCategory.MARKING_STYLE = 'Marks and annotation save';
    AuditLoggingCategory.TEAM_MANAGEMENT_TAB_SWITCH = 'Teammanagement Tab Switch';
    AuditLoggingCategory.RESPONSE_SCREEN = 'Response screen changes';
    AuditLoggingCategory.APPLICATION_OFFLINE = 'Application offline status';
    AuditLoggingCategory.APPLICATION_ERROR = 'Application Error';
    AuditLoggingCategory.GENERAL = 'General';
    AuditLoggingCategory.MENU_ACTION = 'Menu Actions';
    AuditLoggingCategory.CHANGE_RESPONSE_VIEW_MODE = 'Change response view mode';
})(AuditLoggingCategory || (AuditLoggingCategory = {}));
module.exports = AuditLoggingCategory;
//# sourceMappingURL=auditloggingcategory.js.map