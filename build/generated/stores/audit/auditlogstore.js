"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
/// <reference path='../../../typings/userdefinedtypings/immutable/immutable-overrides.d.ts' />
var storeBase = require('../base/storebase');
var dispatcher = require('../../app/dispatcher');
var Immutable = require('immutable');
var AuditLogRecord = require('./auditlogrecord');
var actionType = require('../../actions/base/actiontypes');
/**
 * Creates a new store class to listen for the log request events and hold the
 * collection..
 * @class
 */
var AuditLogStore = (function (_super) {
    __extends(AuditLogStore, _super);
    /**
     * @constructor
     */
    function AuditLogStore() {
        var _this = this;
        _super.call(this);
        this.auditInfo = Immutable.List([]);
        this.logAuditData = {};
        /** Register the dispatch and log the audit record. */
        this.dispatchToken = dispatcher.register(function (action) {
            if (action.actionType === actionType.ERROR) {
                _this._success = action.success;
                if (_this._success) {
                    _this.clearAuditLogInfo();
                    _this.emit(AuditLogStore.ERROR_SEND_TO_SERVER);
                    return;
                }
            }
            if (action.shouldActionBeLogged) {
                /** Map the loginformation and add to the collection. */
                _this.logAction(action);
            }
        });
    }
    Object.defineProperty(AuditLogStore.prototype, "getLogCountLimit", {
        /**
         * Get the configured audit log count.
         * @returns audit log count.
         */
        get: function () {
            return config.general.AUDIT_LOG_LIMIT;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AuditLogStore.prototype, "LogInfo", {
        /**
         * Get the auditlog collection
         * @returns
         */
        get: function () {
            return this.auditInfo;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Log user audit action.
     * @param {Action} action
     */
    AuditLogStore.prototype.logAction = function (action) {
        if (this.auditInfo.count() >= this.getLogCountLimit) {
            this.auditInfo = this.auditInfo.shift();
        }
        this.auditInfo = this.auditInfo.push(new AuditLogRecord.auditRecord({
            content: action.auditLog.logContent, loggedAction: action.auditLog.loggedActionName,
            esMarkGroupId: action.auditLog.currentEsMarkGroupId,
            loggedDate: action.auditLog.loggedDate,
            markGroupId: action.auditLog.currentMarkGroupId,
            markSchemeGroupId: action.auditLog.currentMarkSchemeGroupId
        }));
    };
    /**
     * Clearing Audit log collection.
     */
    /* tslint:disable:no-unused-variable */
    AuditLogStore.prototype.clearAuditLogInfo = function () {
        this.auditInfo = this.auditInfo.clear();
    };
    AuditLogStore.ERROR_SEND_TO_SERVER = 'error_sent_to_server';
    return AuditLogStore;
}(storeBase));
var instance = new AuditLogStore();
module.exports = { AuditLogStore: AuditLogStore, instance: instance };
//# sourceMappingURL=auditlogstore.js.map