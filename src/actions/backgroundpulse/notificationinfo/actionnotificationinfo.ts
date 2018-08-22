/**
 * Creates a new class to hold notification data
 * @class
 */
class ActionNotificationInfo implements NotificationInfo {
    // Holds the unread user message count
    private _unreadMessageCount: number;

    // Holds the unread user message count
    private _exceptionMessageCount: number;

    // Holds the unread mandatory message count
    private _unreadMandatoryMessageCount: number;

    // Holds the coordination complete bit
    private _coordinationComplete: boolean;

    /**
     * Initialise new instance of ActionNotificationInfo
     * @constructor
     */
    constructor() {
        this._unreadMessageCount = 0;
        this._exceptionMessageCount = 0;
        this._unreadMandatoryMessageCount = 0;
        this._coordinationComplete = false;
    }


    /**
     * Get the  unread user message count
     * @returns  unread user message count
     */
    public get getUnreadMessageCount(): number {
        return this._unreadMessageCount;
    }

    /**
     * Setting the unread user message count
     * @param {number} unreadMessageCount
     */
    public set setUnreadMessageCount(unreadMessageCount: number) {
        this._unreadMessageCount = unreadMessageCount;
    }

    /**
     * Get the  exception message count
     * @returns exception message count
     */
    public get getExceptionMessageCount(): number {
        return this._exceptionMessageCount;
    }

    /**
     * Setting the exception message count
     * @param {number} unreadMessageCount
     */
    public set setExceptionMessageCount(exceptionMessageCount: number) {
        this._exceptionMessageCount = exceptionMessageCount;
    }

    /**
     * Get the unread mandatory message count
     */
    public get getUnreadMandatoryMessageCount(): number {
        return this._unreadMandatoryMessageCount;
    }

   /**
    * Set the unread mandatory message count
    */
    public set setUnreadMandatoryMessageCount(unreadCount: number) {
        this._unreadMandatoryMessageCount = unreadCount;
    }

    /**
     * Gets the coordination comple bit
     */
    public get getCoordinationCompleteBit(): boolean {
        return this._coordinationComplete;
    }

    /**
     * Sets the coordination comple bit
     */
    public set setCoordinationCompleteBit(value: boolean) {
        this._coordinationComplete = value;
    }
}

export = ActionNotificationInfo;
