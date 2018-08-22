/// <reference path='./typings/auditloginfo.ts' />
"use strict";
/**
 * Creates a new class for hold Action audit log information to be sent to server.
 * @class
 */
var ActionAuditLogInfo = (function () {
    /**
     * Initialise new instance of ActionAuditLogInfo
     * @constructor
     */
    function ActionAuditLogInfo() {
        this.currentMarkSchemeGroupId = 0;
        this.currentEsMarkGroupId = 0;
        this.currentMarkGroupId = 0;
        this.actionLoggedDate = new Date();
    }
    Object.defineProperty(ActionAuditLogInfo.prototype, "loggedActionName", {
        /**
         * Get the user logged action name.
         * @returns logged action name.
         */
        get: function () {
            return this.loggedAction;
        },
        /**
         * Setting the logged action name
         * @param {string} loggedAction
         */
        set: function (loggedAction) {
            this.loggedAction = loggedAction;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ActionAuditLogInfo.prototype, "actionLoggedDate", {
        /**
         * Gets user action logged date.
         * @returns logged action date
         */
        get: function () {
            return this.loggedDate;
        },
        /**
         * Sets Audit action logged date
         * @param {string} loggedDate
         */
        set: function (loggedDate) {
            this.loggedDate = loggedDate;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ActionAuditLogInfo.prototype, "logContent", {
        /**
         * Gets the audit message
         * @returns The audit message
         */
        get: function () {
            return this.content;
        },
        /**
         * Sets audit action message
         * @param {string} content
         */
        set: function (content) {
            this.content = content;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ActionAuditLogInfo.prototype, "currentMarkSchemeGroupId", {
        /**
         * Gets the current markschemegroupid
         * @returns The markschemegroup identifier
         */
        get: function () {
            return this.markSchemeGroupId;
        },
        /**
         * Sets the current markschemegroup identifier.
         * @param {number} markSchemeGroupId
         */
        set: function (markSchemeGroupId) {
            this.markSchemeGroupId = markSchemeGroupId;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ActionAuditLogInfo.prototype, "currentMarkGroupId", {
        /**
         * Gets the current mark group identifier.
         * @returns
         */
        get: function () {
            return this.markGroupId;
        },
        /**
         * Sets the current mark group identifier.
         * @param {number} markGroupId
         */
        set: function (markGroupId) {
            this.markGroupId = markGroupId;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ActionAuditLogInfo.prototype, "currentEsMarkGroupId", {
        /**
         * Gets the current es mark group identifier.
         * @returns
         */
        get: function () {
            return this.esMarkGroupId;
        },
        /**
         * Sets the current es mark group indentifier.
         * @param {number} esMarkGroupId
         */
        set: function (esMarkGroupId) {
            this.esMarkGroupId = esMarkGroupId;
        },
        enumerable: true,
        configurable: true
    });
    return ActionAuditLogInfo;
}());
module.exports = ActionAuditLogInfo;
//# sourceMappingURL=actionauditloginfo.js.map