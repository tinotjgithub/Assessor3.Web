import action = require('../base/action');
import dataRetrievalAction = require('../base/dataretrievalaction');
import actionAuditLogInfo = require('../base/auditloginfo/actionauditloginfo');
import actionType = require('../base/actiontypes');
import enums = require('../../components/utility/enums');
/**
 * Action class for refreshing message folder action
 */
class RefreshMessageFolderAction extends dataRetrievalAction {

    private _messageFolder: enums.MessageFolderType;
    private _useCache: boolean;
    /**
     * constructor
     * @param success
     * @param messageFolder
     * @param useCache
     */
    constructor(success: boolean, messageFolder: enums.MessageFolderType, useCache: boolean = false) {
        super(action.Source.View, actionType.REFRESH_MESSAGE_FOLDER, success);
        this.auditLog.logContent = this.auditLog.logContent.replace('{0}', enums.getEnumString(enums.MessageFolderType, messageFolder));
        this._messageFolder = messageFolder;
        this._useCache = useCache;
    }

    /**
     * Get the message folder
     */
    public get messageFolder(): enums.MessageFolderType {
        return this._messageFolder;
    }

    /**
     * Returns whether we need to use cache or not
     */
    public get useCache(): boolean {
        return this._useCache;
    }
}

export = RefreshMessageFolderAction;