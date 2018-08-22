"use strict";
var localeStore = require('../../../stores/locale/localestore');
var stringHelper = require('../../../utility/generic/stringhelper');
var messageHelper = require('./messagehelper');
var constants = require('../constants');
var messageTranslationHandlerConstants = require('../messagetranslationhandlerconstants');
var enums = require('../enums');
var MessageTranslationHelper = (function () {
    function MessageTranslationHelper() {
    }
    /**
     * This method will return the translated content for translatable system messages from language json file other wise it will return
     * the normal message contents.
     * @param message
     */
    MessageTranslationHelper.getTranslatedContent = function (message) {
        var translatedMessageContent;
        // if examBodyMessageTypeId is null then return loaded subject and content
        if (!message.examBodyMessageTypeId || message.examBodyMessageTypeId === enums.SystemMessage.None) {
            translatedMessageContent = {
                subject: message.subject,
                content: message.messageBody,
                firstLine: message.examinerMessageBodyFirstLine
            };
        }
        else {
            translatedMessageContent = this.translate(message.examBodyMessageTypeId, this.getParameterForMessageTranslation(message));
            if (translatedMessageContent.subject === undefined || translatedMessageContent.content === undefined) {
                translatedMessageContent.subject = message.subject;
                translatedMessageContent.content = message.messageBody;
                translatedMessageContent.firstLine = message.examinerMessageBodyFirstLine;
            }
        }
        return translatedMessageContent;
    };
    /**
     * Returns the translated message contents
     * @param systemMessageType
     * @param parameters: string array for replacing place holders
     */
    MessageTranslationHelper.translate = function (systemMessageType, parameters) {
        var subject;
        var content;
        if (systemMessageType !== null && systemMessageType !== enums.SystemMessage.None) {
            // if system message is Automated marker message and metadata is offHold then we have to display offHold message content
            var contentKey = systemMessageType === enums.SystemMessage.AutomatedMarkerMessage ?
                parameters[1].trim() === 'OnHold' ? '.content-removed' : parameters[1].trim() === 'Removed' ?
                    '.content-permanently-removed' : '.content-replaced' : '.content';
            subject = stringHelper.format(localeStore.instance.TranslateText('messaging.system-messages.' + systemMessageType + '.subject'), parameters);
            content = stringHelper.format(localeStore.instance.TranslateText('messaging.system-messages.' + systemMessageType + contentKey), parameters);
        }
        return { subject: subject, content: content, firstLine: this.getMessageBodyFirstLine(content) };
    };
    /**
     * Return the from examiner name or 'System Message' text
     * @param message
     */
    MessageTranslationHelper.getExaminerName = function (message) {
        var examinerFullName;
        var systemMessageType = !message.examBodyMessageTypeId ? enums.SystemMessage.None :
            message.examBodyMessageTypeId;
        // system messages having their From username shown as system message
        switch (systemMessageType) {
            case enums.SystemMessage.AutomaticSamplingCompleted:
            case enums.SystemMessage.DeAllocationRemarkResponseRemoved:
            case enums.SystemMessage.MarkingInstructionUpdated:
            case enums.SystemMessage.MarkingInstructionUploaded:
            case enums.SystemMessage.RIGRemoved:
            case enums.SystemMessage.RemarkDeleted:
            case enums.SystemMessage.GracePeriodUpdate:
            case enums.SystemMessage.RefreshMarkingTargets:
                examinerFullName = localeStore.instance.TranslateText('messaging.message-lists.message-detail.system-message');
                break;
            default:
                examinerFullName = message.examinerDetails.fullName;
        }
        return examinerFullName;
    };
    /**
     * This method will returns the build replacing parameters
     * @param message: message contents
     */
    MessageTranslationHelper.getParameterForMessageTranslation = function (message) {
        var parameters = new Array();
        var systemMessageType = !message.examBodyMessageTypeId ? enums.SystemMessage.None :
            message.examBodyMessageTypeId;
        switch (systemMessageType) {
            // QIG
            case enums.SystemMessage.AutoApprovedMarker:
            case enums.SystemMessage.AutoApprovedReviewer:
            case enums.SystemMessage.AutoApprovedSystem:
            case enums.SystemMessage.ConditionallyApprovedMarker:
            case enums.SystemMessage.ConditionallyApprovedReviewer:
            case enums.SystemMessage.ConditionallyApprovedSystem:
            case enums.SystemMessage.AutoSuspendMarker:
            case enums.SystemMessage.AutoSuspendReviewer:
            case enums.SystemMessage.CheckMyMarks:
            case enums.SystemMessage.LockedExaminerWithDrawn:
                parameters.push(messageHelper.getDisplayText(message));
                break;
            case enums.SystemMessage.MarkingInstructionUpdated:
            case enums.SystemMessage.MarkingInstructionUploaded:
                parameters.push(this.getMarkingInstructionParameters(message));
                break;
            // Display ID
            case enums.SystemMessage.AutomatedMarkerMessage:
            case enums.SystemMessage.ZoningExceptionRaised:
            case enums.SystemMessage.ZoningExceptionResolved:
                parameters.push(this.getDisplayId(message));
                parameters.push(message.bodyMetadata);
                break;
            case enums.SystemMessage.CandidateFeedUpdated:
                parameters.push(this.getDisplayId(message));
                break;
            // QIG and DisplayId
            case enums.SystemMessage.RIGRemoved:
                parameters.push(this.getDisplayId(message));
                // pushing the qig name
                parameters.push(messageHelper.getDisplayText(message));
                break;
            // QIG and Targets
            case enums.SystemMessage.RefreshMarkingTargets:
                parameters.push(messageHelper.getDisplayText(message));
                // pushing targets
                var targets = this.getTargets(message);
                parameters.push(targets);
                break;
            case enums.SystemMessage.GracePeriodUpdate:
                parameters.push(messageHelper.getDisplayText(message));
                // pushing grace period details
                var gracePeriodDetails = new Array();
                gracePeriodDetails = this.getGracePeriodDetails(message);
                for (var i = 0; i < gracePeriodDetails.length; i++) {
                    parameters.push(gracePeriodDetails[i]);
                }
                break;
            // Approval status required current, from and to
            case enums.SystemMessage.IndirectSubordinateStatusUpdate:
                // pushing approval status
                var statusDetails = new Array();
                statusDetails = this.getStatus(message);
                for (var i = 0; i < statusDetails.length; i++) {
                    parameters.push(statusDetails[i]);
                }
                break;
            // DisplayID and question item.
            case enums.SystemMessage.RemarkDeleted:
                parameters.push(this.getDisplayId(message));
                // push mark scheme group name
                parameters.push(messageHelper.getMarkSchemeGroupName(message));
                break;
            case enums.SystemMessage.DeAllocationRemarkResponseRemoved:
                // pushing the qig name
                parameters.push(messageHelper.getDisplayText(message));
                break;
            case enums.SystemMessage.MarksChecked:
                parameters.push(messageHelper.getMarkSchemeGroupName(message));
                break;
            case enums.SystemMessage.RemarkRequestedCompleted:
                // parameters are not required as per current template
                break;
            // 9 - Message Template is not available
            case enums.SystemMessage.RefreshQuestionPaperStructure:
            // 15 - Message Template is not available
            case enums.SystemMessage.AutomaticSamplingCompleted:
            // 27 - Message Template is not available
            case enums.SystemMessage.TakeResponse:
                // pushing take response details
                var takeResponseDetails = new Array();
                takeResponseDetails = this.getMetaDataDetails(message);
                for (var i = 0; i < takeResponseDetails.length; i++) {
                    parameters.push(takeResponseDetails[i]);
                }
                break;
        }
        return parameters;
    };
    /**
     * Returns message body first line based on the no of words
     * @param messageBody
     * @param noOfWords
     */
    MessageTranslationHelper.getMessageBodyFirstLine = function (messageBody) {
        var messageBodyFirstLine = '';
        if (messageBody !== undefined || messageBody !== '') {
            messageBodyFirstLine = messageBody.split(' ', constants.MAX_MESSAGE_BODY_FIRST_LINE_WORDS).join(' ');
        }
        return messageBodyFirstLine;
    };
    /**
     * Get targets from message metadata for RefreshMarkingTargets system message
     * Marking Target update handler
     * @param message
     */
    MessageTranslationHelper.getTargets = function (message) {
        var targetCollection = new Array();
        var bodyMetaParameters = this.getMessageBodyMetaParameters(message, ';', '=');
        var targets = bodyMetaParameters[messageTranslationHandlerConstants.TARGETS_DICTIONARY].split(',');
        var target;
        for (var i = 0; i < targets.length; i++) {
            if (targets[i] !== '') {
                target = targets[i].replace('TargetType_', '');
                switch (target) {
                    case 'STMStandardisationMarking':
                        target = 'ES_TeamApproval';
                        break;
                    case 'SecondStandardisation':
                        target = 'SecondStandardisation';
                        break;
                    case 'Live':
                        target = 'LiveMarking';
                        break;
                    case 'Standardisation':
                        target = 'Approval';
                        break;
                    default:
                        break;
                }
                targetCollection.push(localeStore.instance.TranslateText('generic.marking-modes.' + target));
            }
        }
        var remarkTargets = bodyMetaParameters[messageTranslationHandlerConstants.REMARKTARGETS_DICTIONARY].split(',');
        for (var i = 0; i < remarkTargets.length; i++) {
            if (remarkTargets[i] !== '') {
                targetCollection.push(localeStore.instance.TranslateText('generic.remark-types.long-names.' + remarkTargets[i]));
            }
        }
        // return comma seperated targets
        return targetCollection.join(', ');
    };
    /**
     * Get Indirect Subordinate status from message metadata for IndirectSubordinateStatusUpdate system message
     * IndirectSubordinateStatusUpdateHandler
     * @param message
     */
    MessageTranslationHelper.getStatus = function (message) {
        var targetCollection = new Array();
        var bodyMetaParameters = this.getMessageBodyMetaParameters(message, ';', '=');
        var markerName = bodyMetaParameters[messageTranslationHandlerConstants.MARKER];
        targetCollection.push(markerName);
        var oldApprovalStatus = parseInt(bodyMetaParameters[messageTranslationHandlerConstants.OLD_STATUS]);
        targetCollection.push(localeStore.instance.TranslateText('generic.approval-statuses.' +
            enums.getEnumString(enums.ExaminerApproval, oldApprovalStatus)));
        var newApprovalStatus = parseInt(bodyMetaParameters[messageTranslationHandlerConstants.NEW_STATUS]);
        targetCollection.push(localeStore.instance.TranslateText('generic.approval-statuses.' +
            enums.getEnumString(enums.ExaminerApproval, newApprovalStatus)));
        return targetCollection;
    };
    /**
     * get details from the body metadata string.
     * @param message
     */
    MessageTranslationHelper.getMetaDataDetails = function (message) {
        var dataCollection = new Array();
        var metaDataDetails = this.getMessageBodyMetaParameters(message, '#', ':');
        if (metaDataDetails) {
            var displayID = parseFloat(metaDataDetails[messageTranslationHandlerConstants.DISPLAY_ID]);
            dataCollection.push(displayID.toString());
            var worklistType = metaDataDetails[messageTranslationHandlerConstants.WORKLIST_TYPE];
            dataCollection.push(worklistType.toString());
            var exceptionType = metaDataDetails[messageTranslationHandlerConstants.EXCEPTION_TYPE];
            dataCollection.push(exceptionType.toString());
            var seniorExaminerName = metaDataDetails[messageTranslationHandlerConstants.SENIOR_EXAMINER_NAME];
            dataCollection.push(seniorExaminerName.toString());
        }
        return dataCollection;
    };
    /**
     * Get Grace period details from message metadata for grace period update system message
     * IndirectSubordinateStatusUpdateHandler
     * @param message
     */
    MessageTranslationHelper.getGracePeriodDetails = function (message) {
        var targetCollection = new Array();
        var bodyMetaParameters = this.getMessageBodyMetaParameters(message, ';', '=');
        var oldGracePeriod = parseFloat(bodyMetaParameters[messageTranslationHandlerConstants.OLD_GRACE_PERIOD]);
        targetCollection.push(oldGracePeriod.toString());
        var newGracePeriod = parseFloat(bodyMetaParameters[messageTranslationHandlerConstants.NEW_GRACE_PERIOD]);
        targetCollection.push(newGracePeriod.toString());
        return targetCollection;
    };
    /**
     * This method will process message metadata string
     * @param message
     */
    MessageTranslationHelper.getMessageBodyMetaParameters = function (message, splitter1, splitter2) {
        var bodyMetaParameters = new Object();
        if (message.bodyMetadata != null && message.bodyMetadata !== undefined) {
            var pairs = message.bodyMetadata.split(splitter1);
            for (var i = 0; i < pairs.length; i++) {
                if (pairs[i].trim().length === 0) {
                    continue;
                }
                var bits = pairs[i].split(splitter2);
                if (bits.length < 2 || bits[0].length === 0) {
                    continue;
                }
                bodyMetaParameters[bits[0]] = bits[1];
            }
        }
        return bodyMetaParameters;
    };
    /**
     * This will return the displayId with prefix '6'
     * @param message
     */
    MessageTranslationHelper.getDisplayId = function (message) {
        return '6' + message.relatedResponseDisplayId.toString();
    };
    /**
     * This will return string for particular enum value from resource file
     * @param sampleReivewComment
     */
    MessageTranslationHelper.getCustomEnumString = function (sampleReivewComment, buttonType) {
        switch (buttonType) {
            case enums.ButtonType.Sampling:
                return localeStore.instance.
                    TranslateText('team-management.response.supervisor-sampling-comments.' + sampleReivewComment);
            case enums.ButtonType.SetAsReviewed:
                return localeStore.instance.
                    TranslateText('team-management.response.review-comments.' + sampleReivewComment);
        }
    };
    /**
     * gets the message body parameters for marking instructions file upload mandatory message
     * @param message
     */
    MessageTranslationHelper.getMarkingInstructionParameters = function (message) {
        var bodyMetaData = message.bodyMetadata.split('|');
        // if message body metadata has 4 items then it is in QIG level, and has one more parameter to represent QIG name
        if (bodyMetaData.length === 4) {
            return (bodyMetaData[0] + ' - ' + bodyMetaData[1] + ' - ' + bodyMetaData[2]);
        }
        else if (bodyMetaData.length === 3) {
            return (bodyMetaData[0] + ' - ' + bodyMetaData[1]);
        }
    };
    return MessageTranslationHelper;
}());
module.exports = MessageTranslationHelper;
//# sourceMappingURL=messagetranslationhelper.js.map