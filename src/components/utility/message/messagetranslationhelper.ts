import localehelper = require('../../../utility/locale/localehelper');
import localeStore = require('../../../stores/locale/localestore');
import stringHelper = require('../../../utility/generic/stringhelper');
import messageHelper = require('./messagehelper');
import constants = require('../constants');
import messageTranslationHandlerConstants = require('../messagetranslationhandlerconstants');
import enums = require('../enums');

class MessageTranslationHelper {

    /**
     * This method will return the translated content for translatable system messages from language json file other wise it will return
     * the normal message contents.
     * @param message
     */
    public static getTranslatedContent(message: Message): TranslatedMessageContent {
        let translatedMessageContent: TranslatedMessageContent;
        // if examBodyMessageTypeId is null then return loaded subject and content
        if (!message.examBodyMessageTypeId || message.examBodyMessageTypeId === enums.SystemMessage.None) {
            translatedMessageContent = {
                subject: message.subject,
                content: message.messageBody,
                firstLine: message.examinerMessageBodyFirstLine
            };
        } else {
            translatedMessageContent = this.translate(message.examBodyMessageTypeId, this.getParameterForMessageTranslation(message));
            if (translatedMessageContent.subject === undefined || translatedMessageContent.content === undefined) {
                translatedMessageContent.subject = message.subject;
                translatedMessageContent.content = message.messageBody;
                translatedMessageContent.firstLine = message.examinerMessageBodyFirstLine;
            }
        }

        return translatedMessageContent;
    }

    /**
     * Returns the translated message contents
     * @param systemMessageType
     * @param parameters: string array for replacing place holders
     */
    private static translate(systemMessageType: enums.SystemMessage, parameters: string[]): TranslatedMessageContent {
        let subject: string;
        let content: string;
        if (systemMessageType !== null && systemMessageType !== enums.SystemMessage.None) {
            // if system message is Automated marker message and metadata is offHold then we have to display offHold message content
            let contentKey: string = systemMessageType === enums.SystemMessage.AutomatedMarkerMessage ?
                parameters[1].trim() === 'OnHold' ? '.content-removed' : parameters[1].trim() === 'Removed' ?
                    '.content-permanently-removed' : '.content-replaced' : '.content';

            subject = stringHelper.format(
                localeStore.instance.TranslateText('messaging.system-messages.' + systemMessageType + '.subject'),
                parameters);

            content = stringHelper.format(
                localeStore.instance.TranslateText('messaging.system-messages.' + systemMessageType + contentKey),
                parameters);
        }

        return { subject: subject, content: content, firstLine: this.getMessageBodyFirstLine(content) };
    }

    /**
     * Return the from examiner name or 'System Message' text
     * @param message
     */
    public static getExaminerName(message: Message) {
        let examinerFullName: string;
        let systemMessageType: enums.SystemMessage = !message.examBodyMessageTypeId ? enums.SystemMessage.None :
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
    }

    /**
     * This method will returns the build replacing parameters
     * @param message: message contents
     */
    private static getParameterForMessageTranslation(message: Message): string[] {
        let parameters = new Array<string>();
        let systemMessageType: enums.SystemMessage = !message.examBodyMessageTypeId ? enums.SystemMessage.None :
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
                let targets: string = this.getTargets(message);
                parameters.push(targets);
                break;
            case enums.SystemMessage.GracePeriodUpdate:
                parameters.push(messageHelper.getDisplayText(message));
                // pushing grace period details
                let gracePeriodDetails: Array<string> = new Array<string>();
                gracePeriodDetails = this.getGracePeriodDetails(message);
                for (let i = 0; i < gracePeriodDetails.length; i++) {
                    parameters.push(gracePeriodDetails[i]);
                }
                break;
            // Approval status required current, from and to
            case enums.SystemMessage.IndirectSubordinateStatusUpdate:
                // pushing approval status
                let statusDetails: Array<string> = new Array<string>();
                statusDetails = this.getStatus(message);
                for (let i = 0; i < statusDetails.length; i++) {
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
                let takeResponseDetails: Array<string> = new Array<string>();
                takeResponseDetails = this.getMetaDataDetails(message);
                for (let i = 0; i < takeResponseDetails.length; i++) {
                    parameters.push(takeResponseDetails[i]);
                }
                break;
        }

        return parameters;
    }

    /**
     * Returns message body first line based on the no of words
     * @param messageBody
     * @param noOfWords
     */
    private static getMessageBodyFirstLine(messageBody: string) {
        let messageBodyFirstLine: string = '';
        if (messageBody !== undefined || messageBody !== '') {
            messageBodyFirstLine = messageBody.split(' ', constants.MAX_MESSAGE_BODY_FIRST_LINE_WORDS).join(' ');
        }

        return messageBodyFirstLine;
    }


    /**
     * Get targets from message metadata for RefreshMarkingTargets system message
     * Marking Target update handler
     * @param message
     */
    private static getTargets(message: Message): string {
        let targetCollection: Array<string> = new Array<string>();
        let bodyMetaParameters = this.getMessageBodyMetaParameters(message, ';', '=');
        let targets: Array<string> = bodyMetaParameters[messageTranslationHandlerConstants.TARGETS_DICTIONARY].split(',');
        let target: string;
        for (let i = 0; i < targets.length; i++) {
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

        let remarkTargets: Array<string> = bodyMetaParameters[messageTranslationHandlerConstants.REMARKTARGETS_DICTIONARY].split(',');
        for (let i = 0; i < remarkTargets.length; i++) {
            if (remarkTargets[i] !== '') {
                targetCollection.push(localeStore.instance.TranslateText('generic.remark-types.long-names.' + remarkTargets[i]));
            }
        }

        // return comma seperated targets
        return targetCollection.join(', ');
    }


    /**
     * Get Indirect Subordinate status from message metadata for IndirectSubordinateStatusUpdate system message
     * IndirectSubordinateStatusUpdateHandler
     * @param message
     */
    private static getStatus(message: Message) {
        let targetCollection: Array<string> = new Array<string>();
        let bodyMetaParameters = this.getMessageBodyMetaParameters(message, ';', '=');
        let markerName: string = bodyMetaParameters[messageTranslationHandlerConstants.MARKER];
        targetCollection.push(markerName);

        let oldApprovalStatus: number = parseInt(bodyMetaParameters[messageTranslationHandlerConstants.OLD_STATUS]);
        targetCollection.push(localeStore.instance.TranslateText('generic.approval-statuses.' +
            enums.getEnumString(enums.ExaminerApproval, oldApprovalStatus)));

        let newApprovalStatus: number = parseInt(bodyMetaParameters[messageTranslationHandlerConstants.NEW_STATUS]);
        targetCollection.push(localeStore.instance.TranslateText('generic.approval-statuses.' +
            enums.getEnumString(enums.ExaminerApproval, newApprovalStatus)));

        return targetCollection;
    }

    /**
     * get details from the body metadata string.
     * @param message
     */
    private static getMetaDataDetails(message: Message) {
        let dataCollection: Array<string> = new Array<string>();
        let metaDataDetails = this.getMessageBodyMetaParameters(message, '#', ':');
        if (metaDataDetails) {
            let displayID: number = parseFloat(metaDataDetails[messageTranslationHandlerConstants.DISPLAY_ID]);
            dataCollection.push(displayID.toString());

            let worklistType: string = metaDataDetails[messageTranslationHandlerConstants.WORKLIST_TYPE];
            dataCollection.push(worklistType.toString());

            let exceptionType: string = metaDataDetails[messageTranslationHandlerConstants.EXCEPTION_TYPE];
            dataCollection.push(exceptionType.toString());

            let seniorExaminerName: string = metaDataDetails[messageTranslationHandlerConstants.SENIOR_EXAMINER_NAME];
            dataCollection.push(seniorExaminerName.toString());
        }
        return dataCollection;
    }

    /**
     * Get Grace period details from message metadata for grace period update system message
     * IndirectSubordinateStatusUpdateHandler
     * @param message
     */
    private static getGracePeriodDetails(message: Message) {
        let targetCollection: Array<string> = new Array<string>();
        let bodyMetaParameters = this.getMessageBodyMetaParameters(message, ';', '=');

        let oldGracePeriod: number = parseFloat(bodyMetaParameters[messageTranslationHandlerConstants.OLD_GRACE_PERIOD]);
        targetCollection.push(oldGracePeriod.toString());

        let newGracePeriod: number = parseFloat(bodyMetaParameters[messageTranslationHandlerConstants.NEW_GRACE_PERIOD]);
        targetCollection.push(newGracePeriod.toString());

        return targetCollection;
    }

    /**
     * This method will process message metadata string
     * @param message
     */
    private static getMessageBodyMetaParameters(message: Message, splitter1: string, splitter2: string): Object {
        let bodyMetaParameters = new Object();
        if (message.bodyMetadata != null && message.bodyMetadata !== undefined) {
            let pairs: Array<string> = message.bodyMetadata.split(splitter1);
            for (let i = 0; i < pairs.length; i++) {
                if (pairs[i].trim().length === 0) {
                    continue;
                }

                let bits: Array<string> = pairs[i].split(splitter2);
                if (bits.length < 2 || bits[0].length === 0) {
                    continue;
                }

                bodyMetaParameters[bits[0]] = bits[1];
            }
        }

        return bodyMetaParameters;
    }

    /**
     * This will return the displayId with prefix '6'
     * @param message
     */
    private static getDisplayId(message: Message) {
        return '6' + message.relatedResponseDisplayId.toString();
    }

    /**
     * This will return string for particular enum value from resource file
     * @param sampleReivewComment
     */
    public static getCustomEnumString(sampleReivewComment: number, buttonType: enums.ButtonType) {
        switch (buttonType) {
            case enums.ButtonType.Sampling:
                return localeStore.instance.
                    TranslateText('team-management.response.supervisor-sampling-comments.' + sampleReivewComment);
            case enums.ButtonType.SetAsReviewed:
                return localeStore.instance.
                    TranslateText('team-management.response.review-comments.' + sampleReivewComment);
        }
    }

    /**
     * gets the message body parameters for marking instructions file upload mandatory message
     * @param message
     */
    private static getMarkingInstructionParameters(message: Message): string {
        let bodyMetaData: string[] = message.bodyMetadata.split('|');

        // if message body metadata has 4 items then it is in QIG level, and has one more parameter to represent QIG name
        if (bodyMetaData.length === 4) {
            return (bodyMetaData[0] + ' - ' + bodyMetaData[1] + ' - ' + bodyMetaData[2]);
        } else if (bodyMetaData.length === 3) {
            return (bodyMetaData[0] + ' - ' + bodyMetaData[1]);
        }
    }
}

export = MessageTranslationHelper;