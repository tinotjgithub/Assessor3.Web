import action = require('../base/action');
import dataRetrievalAction = require('../base/dataretrievalaction');
import actionAuditLogInfo = require('../base/auditloginfo/actionauditloginfo');
import actionType = require('../base/actiontypes');
import Immutable = require('immutable');
import enums = require('../../components/utility/enums');
/**
 * Action class for getting messages
 */
class MessageAction extends dataRetrievalAction {

    private _messages: Immutable.List<Message>;
    private _messageMarkSchemes: Immutable.List<MessagingMarkScheme>;
    private _messageFolderType: enums.MessageFolderType;
    private _responseId: number;
    private _totalUnreadMessageCount: number;
    private _isResultFromCache: boolean;
    private _checkUnreadMandatoryMessage: boolean;
    private _hiddenQigList: Array<number>;

    /**
     * constructor
     * @param success
     * @param getMessagesReturn
     * @param messageFolderType
     * @param responseId
     * @param isResultFromCache
     * @param checkUnreadMandatoryMessage
     */
    constructor(
        success: boolean,
        getMessagesReturn: GetMessagesReturn,
        messageFolderType: enums.MessageFolderType,
        responseId: number,
        isResultFromCache: boolean,
        checkUnreadMandatoryMessage: boolean,
        hiddenQigList: Array<number>) {
        super(action.Source.View, actionType.GET_MESSAGE_ACTION, success);
        this.auditLog.logContent = this.auditLog.logContent;

        if (success) {
            this._messages = Immutable.List(getMessagesReturn.messages);
            this._messageMarkSchemes = Immutable.List(getMessagesReturn.messagingMarkSchemes);
            this._messageFolderType = messageFolderType;
            this._responseId = responseId;
            this._totalUnreadMessageCount = getMessagesReturn.totalUnreadMessageCount;
            this._isResultFromCache = isResultFromCache;
            this._checkUnreadMandatoryMessage = checkUnreadMandatoryMessage;
            this._hiddenQigList = hiddenQigList;

        } else {
            this._messages = undefined;
        }
    }

    /**
     * return List of messages
     */
    public get messages(): Immutable.List<Message> {
        return this._messages;
    }

    /**
     * return List of mark schemes for the messages.
     */
    public get messageMarkSchemes(): Immutable.List<MessagingMarkScheme> {
        return this._messageMarkSchemes;
    }

    /**
     * return message folder type.
     */
    public get messageFolderType(): enums.MessageFolderType {
        return this._messageFolderType;
    }

    /**
     * Returns the response id, if provided.
     */
    public get responseId(): number {
        return this._responseId;
    }

    /**
     * Get the total unread message count
     */
    public get getTotalUnreadMessageCount(): number {
        return this._totalUnreadMessageCount;
    }

    /**
     * Get the indication that the result from cache or not
     */
    public get isResultFromCache(): boolean {
        return this._isResultFromCache;
    }

    /**
     * Gets whether need to check unread mandatory message or not
     */
    public get checkUnreadMandatoryMessage(): boolean {
        return this._checkUnreadMandatoryMessage;
    }

    /**
     * Gets whether need to check unread mandatory message or not
     */
    public get hiddenQigList(): Array<number> {
        return this._hiddenQigList;
    }
}

export = MessageAction;