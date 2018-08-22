/// <reference path='../../../typings/userdefinedtypings/immutable/immutable-overrides.d.ts' />
declare let config: any;
import storeBase = require('../base/storebase');
import dispatcher = require('../../app/dispatcher');
import Immutable = require('immutable');
import Action = require('../../actions/base/action');
import AuditLogRecord = require('./auditlogrecord');
import errorAction = require('../../actions/logging/erroraction');
import actionType = require('../../actions/base/actiontypes');
/**
 * Creates a new store class to listen for the log request events and hold the
 * collection..
 * @class
 */
class AuditLogStore extends storeBase {
	public static ERROR_SEND_TO_SERVER = 'error_sent_to_server';
    private _success: boolean;
    // Holds audit log information.
	private auditInfo: Immutable.List<Immutable.Record.IRecord<AuditLogInfo>>;

	private logAuditData: AuditDataMap;

    /**
     * Get the configured audit log count.
     * @returns audit log count.
     */
    private get getLogCountLimit() {
        return config.general.AUDIT_LOG_LIMIT;
    }

    /**
     * Get the auditlog collection
     * @returns
     */
    public get LogInfo(): Immutable.List<Immutable.Record.IRecord<AuditLogInfo>> {
        return this.auditInfo;
    }
    /**
     * @constructor
     */
    constructor() {
        super();
		this.auditInfo = Immutable.List([]);
		this.logAuditData = {};

        /** Register the dispatch and log the audit record. */
        this.dispatchToken = dispatcher.register((action: Action) => {

            if (action.actionType === actionType.ERROR) {
                this._success = (action as errorAction).success;
                if (this._success) {
                    this.clearAuditLogInfo();
                    this.emit(AuditLogStore.ERROR_SEND_TO_SERVER);
                    return;
                }
			}

            if (action.shouldActionBeLogged) {
                /** Map the loginformation and add to the collection. */
                this.logAction(action);
            }
        });
    }

    /**
     * Log user audit action.
     * @param {Action} action
     */
    private logAction(action: Action): void {

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
    }

    /**
     * Clearing Audit log collection.
     */
     /* tslint:disable:no-unused-variable */
    private clearAuditLogInfo(): void {
        this.auditInfo = this.auditInfo.clear();
    }
    /* tslint:enable:no-unused-variable */
}

let instance = new AuditLogStore();
export = { AuditLogStore, instance };