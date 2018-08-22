import dataServiceBase = require('../base/dataservicebase');
import urls = require('../base/urls');
import sendMessageArgument = require('./sendmessageargument');
import loadMessageArguments = require('./loadmessagesarguments');
import storageAdapterFactory = require('../storageadapters/storageadapterfactory');
import enums = require('../../components/utility/enums');
declare let config: any;
import messageArgument = require('./messageargument');
import teamArgument = require('./teamargument');
import TeamReturn = require('../../stores/message/typings/teamreturn');

class MessagingDataService extends dataServiceBase {

    /**
     * send message to examiner
     * @param arg
     * @param callback
     */
    public sendExaminerMessage(arg: sendMessageArgument,
        isMarksChecked: boolean,
        callback: ((success: boolean, sendMessageReturn: SendMessageReturnDetails) => void)): void {

        let url = urls.SEND_MESSAGE_URL;

        let sendMessagePromise = this.makeAJAXCall('POST', url, JSON.stringify(arg));
        sendMessagePromise.then(function (json: any) {
            if (callback) {
                let result: SendMessageReturnDetails = JSON.parse(json);

                // If Marks Checked, it can affect the permission to the display ID in messaging, SO delete the cache.
                if (isMarksChecked) {
                    storageAdapterFactory.getInstance().deleteStorageArea('messaging');
                }

                callback(result.success, result);
            }
        }).catch(function (json: any) {
            callback(false, json);
        });
    }

    /**
     * Get the Examiner Messages.
     * @param arg
     * @param callback
     */
    public getExaminerMessage(args: loadMessageArguments,
        callback: ((success: boolean, messagesReturn: GetMessagesReturn, isFromCache: boolean) => void)): void {

        if (args.forceLoadMessages) {
            this.getMessagesFromServer(args, callback);
            return;
        }

        let that = this;
        let inMemoryStorageAdapterPromise = storageAdapterFactory.getInstance().getData('messaging',
            this.getMessageDataKey(args),
            true,
            config.cacheconfig.TWO_MINUTES_CACHE_TIME);

        inMemoryStorageAdapterPromise.then(function (jsonResult: any) {
            if (callback) {
                callback(true, jsonResult.value, true);
            }
        }).catch(function (jsonResult: any) {
            that.getMessagesFromServer(args, callback);
        });
    }

    /**
     * Get the message data from server
     * @param args
     * @param callback
     */
    private getMessagesFromServer(args: loadMessageArguments, callback: Function) {
        let url = urls.GET_MARKER_MESSAGE;
        let that = this;

        let getMessagesPromise = this.makeAJAXCall('POST', url, JSON.stringify(args));
        getMessagesPromise.then(function (json: any) {
            storageAdapterFactory.getInstance().storeData('messaging',
                that.getMessageDataKey(args),
                JSON.parse(json), true).then().catch();

            callback(true, JSON.parse(json), false);
        }).catch(function (json: any) {
            callback(false, json);
        });
    }

    /**
     * Update the message status
     * @param msgId
     * @param readStatus
     * @param callback
     */
    public updateMessageStatus(arg: messageArgument, callback: Function) {
        let url = urls.MESSAGE_READ_STATUS_UPDATE_URL;

        let updateMessageReadStatusPromise = this.makeAJAXCall('POST', url, JSON.stringify(arg));
        updateMessageReadStatusPromise.then(function (json: any) {

            if (arg.examinerMessageStatusId === enums.MessageReadStatus.Read) {
                storageAdapterFactory.getInstance().deleteStorageArea('qigselector');
            }

            callback(true, json);
        }).catch(function (json: any) {
            callback(false, json);
        });
    }

    /**
     * Get the Details of the message
     * @param arg
     * @param callback
     */
	public getMessageBodyDetails(msgId: number, isStandardisationSetupMode: boolean, callback: Function) {
		let that = this;
		if (!isStandardisationSetupMode) {
			let inMemoryStorageAdapterPromise = storageAdapterFactory.getInstance().getData('messaging',
				'Message-Details-' + msgId,
				false,
				0);

			inMemoryStorageAdapterPromise.then(function (jsonResult: any) {
				if (callback) {
					callback(true, jsonResult.value);
				}
			}).catch(function (jsonResult: any) {
				that.getMessageBodyDetailsFromServer(msgId, isStandardisationSetupMode, callback);
			});
		} else {
			this.getMessageBodyDetailsFromServer(msgId, isStandardisationSetupMode, callback);
		}
    }


    /**
     * get MessageBody Details From Server
     * 
     * @private
     * @param {number} msgId 
     * @param {Function} callback 
     * @memberof MessagingDataService
     */
	private getMessageBodyDetailsFromServer(msgId: number, isStandardisationSetupMode, callback: Function) {
        let url = urls.MESSAGE_BODY_DETAILS_GET_URL + '/' + msgId;

        let getMessageBodyDetailsPromise = this.makeAJAXCall('GET', url);
        getMessageBodyDetailsPromise.then(function (json: any) {
            let messageData = JSON.parse(json).messagingDetails;

			// In standardisation setup mode do not cache the message details.
			if (!isStandardisationSetupMode) {
				storageAdapterFactory.getInstance().storeData('messaging',
					'Message-Details-' + msgId,
					messageData, true).then().catch();
			}
            callback(true, messageData);
        }).catch(function (json: any) {
            callback(false, json);
        });
    }

    /**
     * get unread mandatory message status
     */
    public getUnreadMandatoryMessageStatus(callback: Function) {
        let url: string = urls.GET_UNREAD_MANDATORY_MESSAGE_STATUS;
        let getUnreadMandatoryMessageStatusPromise = this.makeAJAXCall('GET', url);
        getUnreadMandatoryMessageStatusPromise.then(function (json: any) {
            let data = JSON.parse(json);
            callback(true, data.isUnreadMandatoryMessagePresent);
        }).catch(function (json: any) {
            callback(false, undefined);
        });
    }


    /**
     * Get the key to store and retrieve message data
     * @param arg
     */
    private getMessageDataKey(arg: loadMessageArguments): string {
        let msgKey = 'Message-Data-';
        if (arg.candidateResponseId > 0) {
            // Since same candidate script id exists for seed responses in same worklist, use mark group id
            msgKey = msgKey + (arg.isWholeResponse ? arg.candidateResponseId : arg.markGroupId) + arg.currentWorklistType;
        } else {
            msgKey = msgKey + enums.getEnumString(enums.MessageFolderType, arg.messageFolderType);
        }

        return msgKey;
    }


    /**
     * Get team details.
     * @param arg
     */
    public getTeamDetails(args: teamArgument, callback: Function) {
        let that = this;
        let inMemoryStorageAdapterPromise = storageAdapterFactory.getInstance().getData('messaging',
            'TeamList-Details-' + args.examinerRoleId + '-' + args.qigId,
            true,
            config.cacheconfig.TWO_MINUTES_CACHE_TIME);

        inMemoryStorageAdapterPromise.then(function (jsonResult: any) {
            if (callback) {
                callback(true, jsonResult.value);
            }
        }).catch(function (jsonResult: any) {
            that.getTeamDetailsFromServer(args, callback);
        });

    }

    /**
     * Get team details from server.
     * @param arg
     */
    private getTeamDetailsFromServer(args: teamArgument, callback: Function) {
        let url = urls.MESSAGE_TEAMS_GET_URL;
        let getTeamDetailsPromise = this.makeAJAXCall('POST', url, JSON.stringify(args));
        getTeamDetailsPromise.then(function (json: any) {
            let teams: TeamReturn = JSON.parse(json);
            storageAdapterFactory.getInstance().storeData('messaging',
                'TeamList-Details-' + args.examinerRoleId + '-' + args.qigId,
                teams, true).then().catch();
            callback(true, teams);

        }).catch(function (json: any) {
            callback(false, json);
        });

    }
}

let messagingDataService = new MessagingDataService();
export = messagingDataService;