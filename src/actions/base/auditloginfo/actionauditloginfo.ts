/// <reference path='./typings/auditloginfo.ts' />

/**
 * Creates a new class for hold Action audit log information to be sent to server.
 * @class
 */
class ActionAuditLogInfo implements AuditLogInfo {
    // Holds the name of the action which needs to get logged
   public loggedAction: string;

    // Holds date and time of the action happened.
   public  loggedDate: Date;

    // Holds audit log message.
   public content: string;

    // Holds current selected mark scheme groupid
   public  markSchemeGroupId: number;

    // Holds selected Mark group id
   public markGroupId: number;

    // Holds selected standardisation RIG id.
   public esMarkGroupId: number;

    /**
     * Get the user logged action name.
     * @returns logged action name.
     */
    public get loggedActionName() {
        return this.loggedAction;
    }

    /**
     * Setting the logged action name
     * @param {string} loggedAction
     */
    public set loggedActionName(loggedAction: string) {
        this.loggedAction = loggedAction;
    }

    /**
     * Gets user action logged date.
     * @returns logged action date
     */
    public get actionLoggedDate() {
        return this.loggedDate;
    }

    /**
     * Sets Audit action logged date
     * @param {string} loggedDate
     */
    public set actionLoggedDate(loggedDate: Date) {
        this.loggedDate = loggedDate;
    }

    /**
     * Gets the audit message
     * @returns The audit message
     */
    public get logContent(): string {
        return this.content;
    }

    /**
     * Sets audit action message
     * @param {string} content
     */
    public set logContent(content: string) {
        this.content = content;
    }

    /**
     * Gets the current markschemegroupid
     * @returns The markschemegroup identifier
     */
    public get currentMarkSchemeGroupId() {
        return this.markSchemeGroupId;
    }

    /**
     * Sets the current markschemegroup identifier.
     * @param {number} markSchemeGroupId
     */
    public set currentMarkSchemeGroupId(markSchemeGroupId: number) {
        this.markSchemeGroupId = markSchemeGroupId;
    }

    /**
     * Gets the current mark group identifier.
     * @returns
     */
    public get currentMarkGroupId() {
        return this.markGroupId;
    }

    /**
     * Sets the current mark group identifier.
     * @param {number} markGroupId
     */
    public set currentMarkGroupId(markGroupId: number) {
        this.markGroupId = markGroupId;
    }

    /**
     * Gets the current es mark group identifier.
     * @returns
     */
    public get currentEsMarkGroupId() {
        return this.esMarkGroupId;
    }

    /**
     * Sets the current es mark group indentifier.
     * @param {number} esMarkGroupId
     */
    public set currentEsMarkGroupId(esMarkGroupId: number) {
        this.esMarkGroupId = esMarkGroupId;
    }

    /**
     * Initialise new instance of ActionAuditLogInfo
     * @constructor
     */
    constructor() {
        this.currentMarkSchemeGroupId = 0;
        this.currentEsMarkGroupId = 0;
        this.currentMarkGroupId = 0;
        this.actionLoggedDate = new Date();
    }
}
export = ActionAuditLogInfo;
