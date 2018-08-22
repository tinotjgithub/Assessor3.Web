import Immutable = require('immutable');
import enums = require('../enums');
import markingStore = require('../../../stores/marking/markingstore');
import localeStore = require('../../../stores/locale/localestore');
import targetHelper = require('../../../utility/target/targethelper');
import worklistStore = require('../../../stores/worklist/workliststore');
import responseStore = require('../../../stores/response/responsestore');
import exceptionActionCreator = require('../../../actions/exception/exceptionactioncreator');
import qigStore = require('../../../stores/qigselector/qigstore');
import configurableCharacteristicsHelper = require('../../../utility/configurablecharacteristic/configurablecharacteristicshelper');
import loginSession = require('../../../app/loginsession');
import exceptionHelper = require('../../utility/exception/exceptionhelper');
import configurableCharacteristicsNames = require('../../../utility/configurablecharacteristic/configurablecharacteristicsnames');
import userInfoStore = require('../../../stores/userinfo/userinfostore');
import awardingStore = require('../../../stores/awarding/awardingstore');
class ExceptionHelper {
    /**
     * Used to create the MessageOrExceptionLinkedItems based on the messages
     * @param messages
     */
    public static getExceptionLinkedItems(exceptions: Immutable.List<ExceptionDetails>, isTeamManagement: boolean)
        : Immutable.List<MessageOrExceptionLinkedItem> {
        let messageOrExceptionLinkedItems: MessageOrExceptionLinkedItem[] = [];
        let items = exceptions.forEach((exception: ExceptionDetails) => {
            messageOrExceptionLinkedItems.push({
                itemId: exception.uniqueId,
                senderOrItem: exception.markSchemeID === 0 ? (responseStore.instance.isWholeResponse ? qigStore.instance.
                    getMarkSchemeGroupName(exception.markSchemeGroupID) :
                    localeStore.instance.TranslateText('marking.response.raise-exception-panel.entire-response'))
                    : markingStore.instance.toolTip(exception.markSchemeID),
                priorityOrStatus: exception.currentStatus,
                subjectOrType: exception.exceptionType,
                timeToDisplay: exception.dateTimeRaised.toString(),
                isUnreadOrUnactioned: isTeamManagement ?
                    ((exception.currentStatus === enums.ExceptionStatus.Open) &&
                        (exception.ownerExaminerId === loginSession.EXAMINER_ID)) :
                    (exception.currentStatus === enums.ExceptionStatus.Resolved)
            });
        });
        return Immutable.List(messageOrExceptionLinkedItems);
    }

    /**
     * Used to order the exception list based on exception status - Resolved, open, closed
     */
    public static orderExceptionList(exceptionData: Immutable.List<ExceptionDetails>): Immutable.List<ExceptionDetails> {

        let actionableException: Immutable.List<ExceptionDetails> =
            exceptionData.filter((x: ExceptionDetails) => x.ownerExaminerId === loginSession.EXAMINER_ID).toList();
        actionableException = this.sortExceptionListUsingDate(actionableException);

        let unActionableExceptionData: Immutable.List<ExceptionDetails> =
            exceptionData.filter(x => actionableException.indexOf(x) < 0).toList();
        let resolvedException =
            unActionableExceptionData.filter((x: ExceptionDetails) => x.currentStatus === enums.ExceptionStatus.Resolved).toList();
        resolvedException = this.sortExceptionListUsingDate(resolvedException);

        let openException: Immutable.List<ExceptionDetails> =
            unActionableExceptionData.filter((x: ExceptionDetails) => x.currentStatus === enums.ExceptionStatus.Open &&
                x.ownerExaminerId !== loginSession.EXAMINER_ID).toList();
        openException = this.sortExceptionListUsingDate(openException);

        let closedException: Immutable.List<ExceptionDetails> =
            unActionableExceptionData.filter((x: ExceptionDetails) => x.currentStatus === enums.ExceptionStatus.Closed).toList();
        closedException = this.sortExceptionListUsingDate(closedException);

        let concatinatedList;
        concatinatedList = actionableException.concat(resolvedException, openException, closedException);

        return concatinatedList.toList();
    }


    /**
     * Used to sort the exception list based on datetime
     */
    public static sortExceptionListUsingDate(exceptionData: Immutable.List<ExceptionDetails>): Immutable.List<ExceptionDetails> {
        let sortedList = exceptionData.sort(function (a: any, b: any) {
            let key1 = a.dateTimeRaised;
            let key2 = b.dateTimeRaised;

            if (key1 > key2) {
                return -1;
            } else if (key1 === key2) {
                return 0;
            } else {
                return 1;
            }
        });
        return sortedList.toList();
    }

    /**
     * Sort the Exception Types.
     * @ param - exceptionTypes
     */
    public static sortExceptionTypes(exceptionTypes: Immutable.List<ExceptionTypeDetails>): Immutable.List<ExceptionTypeDetails> {
        let exceptionNameA = '';
        let exceptionNameB = '';
        let sortedExceptionDetails;
        if (exceptionTypes) {
            sortedExceptionDetails = exceptionTypes.sort(function (a: ExceptionTypeDetails, b: ExceptionTypeDetails) {

                exceptionNameA = localeStore.instance.TranslateText('generic.exception-types.' + a.exceptionType + '.name')
                    .toLowerCase();
                exceptionNameB = localeStore.instance.TranslateText('generic.exception-types.' + b.exceptionType + '.name')
                    .toLowerCase();

                if (exceptionNameA < exceptionNameB) {
                    return -1;
                } else if (exceptionNameA === exceptionNameB) {
                    return 0;
                } else {
                    return 1;
                }
            });
            return sortedExceptionDetails.toList();
        } else {
            sortedExceptionDetails = Immutable.List();
            return sortedExceptionDetails;
        }
    }

    /**
     * check whether exception can be raised for a response
     */
    public static canRaiseException(isResponseReadOnly: boolean) {

        if (isResponseReadOnly ||
            userInfoStore.instance.currentOperationMode === enums.MarkerOperationMode.StandardisationSetup) {
            return false;
        }

        let qigStatus = targetHelper.getExaminerQigStatus();
        return !(markingStore.instance.currentResponseMode === enums.ResponseMode.pending ||
            markingStore.instance.currentResponseMode === enums.ResponseMode.closed ||
            qigStatus === enums.ExaminerQIGStatus.QualityFeedback ||
            qigStatus === enums.ExaminerQIGStatus.Practice ||
            qigStatus === enums.ExaminerQIGStatus.StandardisationMarking ||
            qigStatus === enums.ExaminerQIGStatus.SecondStandardisationMarking ||
            qigStatus === enums.ExaminerQIGStatus.STMStandardisationMarking ||
            qigStatus === enums.ExaminerQIGStatus.Simulation);
    }

    /**
     * To get new exceptions
     */
    public static getNewExceptions(isTeamManagementMode: boolean,
        isAwardingMode: boolean = false, displayid?: string, exceptionicon: boolean = false,
        getLinkedExceptions: boolean = false) {
        let candidateScriptId: number;
        let markGroupId: number;
        if (displayid !== null && displayid !== undefined) {
            candidateScriptId = isAwardingMode
                ? awardingStore.instance.selectedCandidateData.responseItemGroups[0].candidateScriptId
                : worklistStore.instance.getResponseDetails(displayid).candidateScriptId;
            markGroupId = worklistStore.instance.getResponseDetails(
                displayid).markGroupId;
        } else {
            candidateScriptId = isAwardingMode
                ? awardingStore.instance.selectedCandidateData.responseItemGroups[0].candidateScriptId
                : worklistStore.instance.getResponseDetails(
                    responseStore.instance.selectedDisplayId.toString()).candidateScriptId;
            markGroupId = isAwardingMode
                ? awardingStore.instance.selectedCandidateData.responseItemGroups[0].markGroupId
                : worklistStore.instance.getResponseDetails(
                    responseStore.instance.selectedDisplayId.toString()).markGroupId;
        }
        exceptionActionCreator.getExceptions(candidateScriptId, markGroupId,
            qigStore.instance.selectedQIGForMarkerOperation.markSchemeGroupId,
            isTeamManagementMode, exceptionicon, getLinkedExceptions);
    }

    /**
     * Get the appropriate exception description. 
     * @ param - exceptionType
     * @ param - isExceptionBlocker
     */
    public static getExceptionDescription(exceptionType: ExceptionTypeDetails, isExceptionBlocker: boolean) {
        let blockerDescription: string;
        if (exceptionType.exceptionType === enums.ExceptionType.IncorrectComponentOrPaper) {

            blockerDescription = (exceptionType.ownerEscalationPoint === enums.EscalationPoint.AdminAdAccount) ?
                localeStore.instance.TranslateText('marking.response.exception-escalation-points.' + exceptionType.ownerEscalationPoint)
                + localeStore.instance.TranslateText('marking.response.raise-exception-panel.blocking-exception-description')
                + localeStore.instance.TranslateText
                    ('marking.response.raise-exception-panel.incorrect-component-or-paper-additional-description') :
                localeStore.instance.TranslateText('marking.response.exception-escalation-points.' + exceptionType.ownerEscalationPoint)
                + localeStore.instance.TranslateText
                    ('marking.response.raise-exception-panel.incorrect-component-or-paper-additional-description');
        } else {

            blockerDescription = (isExceptionBlocker) ?
                (localeStore.instance.TranslateText('marking.response.exception-escalation-points.' + exceptionType.ownerEscalationPoint)
                    + localeStore.instance.TranslateText('marking.response.raise-exception-panel.blocking-exception-description')
                    + ((exceptionType.exceptionType === enums.ExceptionType.ImageCannotBeAccessedOrRead) ?
                        localeStore.instance.TranslateText
                            ('marking.response.raise-exception-panel.file-cannot-be-accessed-or-read-additional-description') : '')) :
                (localeStore.instance.TranslateText('marking.response.exception-escalation-points.' + exceptionType.ownerEscalationPoint)
                    + localeStore.instance.TranslateText('marking.response.raise-exception-panel.non-blocking-exception-description'));
        }
        return blockerDescription;
    }

    /**
     * Get Reject Rig CC value.
     */
    public static get isRejectRigCCActive(): boolean {
        let qigId = qigStore.instance.selectedQIGForMarkerOperation !== undefined ?
            qigStore.instance.selectedQIGForMarkerOperation.markSchemeGroupId : 0;
        return configurableCharacteristicsHelper.getCharacteristicValue('RejectRIG', qigId) === 'true';
    }

    /**
     * Returns true if exception is zoning exception
     */
    public static isZoningException(exceptionTypeId: number): boolean {
        let _isZoningException = false;

        switch (exceptionTypeId) {
            case enums.ExceptionType.ImageRescanRequest:
            case enums.ExceptionType.IncorrectQuestionPaper:
            case enums.ExceptionType.ConcatenatedScriptException:
            case enums.ExceptionType.IncorrectComponentOrPaper:
            case enums.ExceptionType.NonScriptObject:
            case enums.ExceptionType.ZoningErrorMissingContent:
            case enums.ExceptionType.ZoningErrorOtherContent:
            case enums.ExceptionType.IncorrectImage:
                _isZoningException = true;
                break;
        }

        return _isZoningException;
    }

    /**
     * Get EBookmarking CC value.
     */
    public static get isEbookMarking(): boolean {
        return configurableCharacteristicsHelper.getExamSessionCCValue
            (configurableCharacteristicsNames.eBookmarking, qigStore.instance.selectedQIGForMarkerOperation.examSessionId)
            .toLowerCase() === 'true';
    }
}

export = ExceptionHelper;