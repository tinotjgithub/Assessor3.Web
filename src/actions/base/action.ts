import actionAuditLogInfo = require('./auditloginfo/actionauditloginfo');
let json = require('./actions.json');

/**
 * Action Base
 * @class
 */
class Action {

    private _source: Action.Source;
    private _actionType: string;

    private _actionAuditLog: actionAuditLogInfo;
    private _shouldActionBeLogged: boolean = true;

    /**
     * Constructor
     * @param source
     * @param actionType
     */
    constructor(source: Action.Source, actionType: string) {
        this._source = source;
        this._actionType = actionType;
        let auditLog = new actionAuditLogInfo();
        let jsonKey = this.getCurrentClassName();
        let auditLogProps: string[] = ['name', 'message'];
        auditLog.loggedActionName = this.actionInfo[jsonKey][auditLogProps[0]];
        auditLog.logContent = this.actionInfo[jsonKey][auditLogProps[1]];
        this._actionAuditLog = auditLog;
    }

    /**
     * The Source of the action
     * Make sure the source is immutable to avoid change
     * during Dispatch
     */
    get source(): Action.Source {
        return this._source;
    }
    /**
     * Gets the current action audit information
     * @returns The audit information.
     */
    public get auditLog(): actionAuditLogInfo {
        return this._actionAuditLog;
    }
    /**
     * Sets auditLog content
     * @param {actionAuditLogInfo} auditLog
     */
    public set auditLog(auditLog: actionAuditLogInfo) {
        this._actionAuditLog = auditLog;
    }
    /**
     * Gets the actions with details
     * @returns The actions information.
     */
    public get actionInfo(): JSON {
        return json;
    }

    /**
     * Gets whether this action should be logged    
     */
    public get shouldActionBeLogged(): boolean {
        return this._shouldActionBeLogged;
    }

    /**
     * Flags the action not to be logged
     */
    protected setTheActionAsNotToBeLogged() {
        this._shouldActionBeLogged = false;
    }

    /**
     * Gets the action type
     * @returns The action type.
     */
    get actionType(): string {
        return this._actionType;
    }
    /**
     * Gets the class Name for this instance
     * @returns The class Name for this instance
     */
    private getCurrentClassName(): string {
        return this.constructor.toString().match(/\w+/g)[1].toLowerCase();
    }
}

/**
 * Action source mode
 */
module Action {
    /**
     * enum for source
     * 
     * @export Source
     * @enum {number}
     */
    export enum Source {
        View,
        Server
    }
}

export = Action;