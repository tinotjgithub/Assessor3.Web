import action = require('../base/action');
import dataRetrievalAction = require('../base/dataretrievalaction');
import actionAuditLogInfo = require('../base/auditloginfo/actionauditloginfo');
import actionType = require('../base/actiontypes');
import enums = require('../../components/utility/enums');

/**
 * Action class for updating message read sttus
 */
class MessageBodyDetailsGetAction extends dataRetrievalAction {
    private msgId: number;
    private msgDetails: MessageDetails;
    private selctedTab: enums.MessageFolderType;


    /**
     * Constructor
     * @param success
     * @param msgId
     * @param messagingDetails
     * @param selectedTab
     */
    constructor(success: boolean, msgId: number, messagingDetails: MessageDetails, selectedTab: enums.MessageFolderType) {
        super(action.Source.View, actionType.MESSAGE_DETAILS_GET_ACTION, success);
        this.auditLog.logContent = this.auditLog.logContent.replace('{0}', msgId.toString());

        this.msgId = msgId;
        this.msgDetails = messagingDetails;
        this.selctedTab = selectedTab;
    }

    /**
     * Get the message Id
     */
    public get messageId(): number {
        return this.msgId;
    }

    /**
     * Get the message Details
     */
    public get messageDetails(): MessageDetails{
        return this.msgDetails;
    }

    public get selectedTab(): enums.MessageFolderType {
        return this.selctedTab;
    }

}

export = MessageBodyDetailsGetAction;