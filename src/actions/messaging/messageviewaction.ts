import action = require('../base/action');
import dataRetrievalAction = require('../base/dataretrievalaction');
import actionAuditLogInfo = require('../base/auditloginfo/actionauditloginfo');
import actionType = require('../base/actiontypes');
import enums = require('../../components/utility/enums');

/**
 * Action class for message section open or close events.
 */
class MessageViewAction extends dataRetrievalAction {

    private _messageAction: enums.MessageViewAction;
    private _navigateTo: enums.SaveAndNavigate;
    private _navigateFrom: enums.SaveAndNavigate;
    private _messageType: enums.MessageType;

    /**
     * constructor
     * @param success
     * @param messageType
     * @param messageAction
     */
    constructor(success: boolean, messageAction: enums.MessageViewAction, messageType: enums.MessageType, navigateTo: enums.SaveAndNavigate,
        navigateFrom: enums.SaveAndNavigate = enums.SaveAndNavigate.none) {
        super(action.Source.View, actionType.MESSAGE_ACTION, success);
        this.auditLog.logContent = this.auditLog.logContent.replace('{0}', enums.getEnumString(enums.MessageViewAction, messageAction))
                                                           .replace(/{success}/g, success.toString());
        this._messageAction = messageAction;
        this._navigateTo = navigateTo;
        this._navigateFrom = navigateFrom;
        this._messageType = messageType;
    }

    /**
     * return message action - open or close
     */
    public get messageAction() {
        return this._messageAction;
    }

    /**
     * return the current message type
     */
    public get messageType(): enums.MessageType {
        return this._messageType;
    }

    /**
     * returns navigate to value
     */
    public get navigateTo() {
        return this._navigateTo;
    }

    public get navigateFrom() {
        return this._navigateFrom;
    }
}

export = MessageViewAction;