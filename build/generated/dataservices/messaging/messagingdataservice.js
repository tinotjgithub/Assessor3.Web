"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var dataServiceBase = require('../base/dataservicebase');
var urls = require('../base/urls');
var storageAdapterFactory = require('../storageadapters/storageadapterfactory');
var enums = require('../../components/utility/enums');
var MessagingDataService = (function (_super) {
    __extends(MessagingDataService, _super);
    function MessagingDataService() {
        _super.apply(this, arguments);
    }
    /**
     * send message to examiner
     * @param arg
     * @param callback
     */
    MessagingDataService.prototype.sendExaminerMessage = function (arg, isMarksChecked, callback) {
        var url = urls.SEND_MESSAGE_URL;
        var sendMessagePromise = this.makeAJAXCall('POST', url, JSON.stringify(arg));
        sendMessagePromise.then(function (json) {
            if (callback) {
                var result = JSON.parse(json);
                // If Marks Checked, it can affect the permission to the display ID in messaging, SO delete the cache.
                if (isMarksChecked) {
                    storageAdapterFactory.getInstance().deleteStorageArea('messaging');
                }
                callback(result.success, result);
            }
        }).catch(function (json) {
            callback(false, json);
        });
    };
    /**
     * Get the Examiner Messages.
     * @param arg
     * @param callback
     */
    MessagingDataService.prototype.getExaminerMessage = function (args, callback) {
        if (args.forceLoadMessages) {
            this.getMessagesFromServer(args, callback);
            return;
        }
        var that = this;
        var inMemoryStorageAdapterPromise = storageAdapterFactory.getInstance().getData('messaging', this.getMessageDataKey(args), true, config.cacheconfig.TWO_MINUTES_CACHE_TIME);
        inMemoryStorageAdapterPromise.then(function (jsonResult) {
            if (callback) {
                callback(true, jsonResult.value, true);
            }
        }).catch(function (jsonResult) {
            that.getMessagesFromServer(args, callback);
        });
    };
    /**
     * Get the message data from server
     * @param args
     * @param callback
     */
    MessagingDataService.prototype.getMessagesFromServer = function (args, callback) {
        var url = urls.GET_MARKER_MESSAGE;
        var that = this;
        var getMessagesPromise = this.makeAJAXCall('POST', url, JSON.stringify(args));
        getMessagesPromise.then(function (json) {
            storageAdapterFactory.getInstance().storeData('messaging', that.getMessageDataKey(args), JSON.parse(json), true).then().catch();
            callback(true, JSON.parse(json), false);
        }).catch(function (json) {
            callback(false, json);
        });
    };
    /**
     * Update the message status
     * @param msgId
     * @param readStatus
     * @param callback
     */
    MessagingDataService.prototype.updateMessageStatus = function (arg, callback) {
        var url = urls.MESSAGE_READ_STATUS_UPDATE_URL;
        var updateMessageReadStatusPromise = this.makeAJAXCall('POST', url, JSON.stringify(arg));
        updateMessageReadStatusPromise.then(function (json) {
            callback(true, json);
        }).catch(function (json) {
            callback(false, json);
        });
    };
    /**
     * Get the Details of the message
     * @param arg
     * @param callback
     */
    MessagingDataService.prototype.getMessageBodyDetails = function (msgId, isStandardisationSetupMode, callback) {
        var that = this;
        if (!isStandardisationSetupMode) {
            var inMemoryStorageAdapterPromise = storageAdapterFactory.getInstance().getData('messaging', 'Message-Details-' + msgId, false, 0);
            inMemoryStorageAdapterPromise.then(function (jsonResult) {
                if (callback) {
                    callback(true, jsonResult.value);
                }
            }).catch(function (jsonResult) {
                that.getMessageBodyDetailsFromServer(msgId, isStandardisationSetupMode, callback);
            });
        }
        else {
            this.getMessageBodyDetailsFromServer(msgId, isStandardisationSetupMode, callback);
        }
    };
    /**
     * get MessageBody Details From Server
     *
     * @private
     * @param {number} msgId
     * @param {Function} callback
     * @memberof MessagingDataService
     */
    MessagingDataService.prototype.getMessageBodyDetailsFromServer = function (msgId, isStandardisationSetupMode, callback) {
        var url = urls.MESSAGE_BODY_DETAILS_GET_URL + '/' + msgId;
        var getMessageBodyDetailsPromise = this.makeAJAXCall('GET', url);
        getMessageBodyDetailsPromise.then(function (json) {
            var messageData = JSON.parse(json).messagingDetails;
            // In standardisation setup mode do not cache the message details.
            if (!isStandardisationSetupMode) {
                storageAdapterFactory.getInstance().storeData('messaging', 'Message-Details-' + msgId, messageData, true).then().catch();
            }
            callback(true, messageData);
        }).catch(function (json) {
            callback(false, json);
        });
    };
    /**
     * get unread mandatory message status
     */
    MessagingDataService.prototype.getUnreadMandatoryMessageStatus = function (callback) {
        var url = urls.GET_UNREAD_MANDATORY_MESSAGE_STATUS;
        var getUnreadMandatoryMessageStatusPromise = this.makeAJAXCall('GET', url);
        getUnreadMandatoryMessageStatusPromise.then(function (json) {
            var data = JSON.parse(json);
            callback(true, data.isUnreadMandatoryMessagePresent);
        }).catch(function (json) {
            callback(false, undefined);
        });
    };
    /**
     * Get the key to store and retrieve message data
     * @param arg
     */
    MessagingDataService.prototype.getMessageDataKey = function (arg) {
        var msgKey = 'Message-Data-';
        if (arg.candidateResponseId > 0) {
            // Since same candidate script id exists for seed responses in same worklist, use mark group id
            msgKey = msgKey + (arg.isWholeResponse ? arg.candidateResponseId : arg.markGroupId) + arg.currentWorklistType;
        }
        else {
            msgKey = msgKey + enums.getEnumString(enums.MessageFolderType, arg.messageFolderType);
        }
        return msgKey;
    };
    /**
     * Get team details.
     * @param arg
     */
    MessagingDataService.prototype.getTeamDetails = function (args, callback) {
        var that = this;
        var inMemoryStorageAdapterPromise = storageAdapterFactory.getInstance().getData('messaging', 'TeamList-Details-' + args.examinerRoleId + '-' + args.qigId, true, config.cacheconfig.TWO_MINUTES_CACHE_TIME);
        inMemoryStorageAdapterPromise.then(function (jsonResult) {
            if (callback) {
                callback(true, jsonResult.value);
            }
        }).catch(function (jsonResult) {
            that.getTeamDetailsFromServer(args, callback);
        });
    };
    /**
     * Get team details from server.
     * @param arg
     */
    MessagingDataService.prototype.getTeamDetailsFromServer = function (args, callback) {
        var url = urls.MESSAGE_TEAMS_GET_URL;
        var getTeamDetailsPromise = this.makeAJAXCall('POST', url, JSON.stringify(args));
        getTeamDetailsPromise.then(function (json) {
            var teams = JSON.parse(json);
            storageAdapterFactory.getInstance().storeData('messaging', 'TeamList-Details-' + args.examinerRoleId + '-' + args.qigId, teams, true).then().catch();
            callback(true, teams);
        }).catch(function (json) {
            callback(false, json);
        });
    };
    return MessagingDataService;
}(dataServiceBase));
var messagingDataService = new MessagingDataService();
module.exports = messagingDataService;
//# sourceMappingURL=messagingdataservice.js.map