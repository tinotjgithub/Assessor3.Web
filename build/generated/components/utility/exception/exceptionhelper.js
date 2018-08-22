"use strict";
var Immutable = require('immutable');
var enums = require('../enums');
var markingStore = require('../../../stores/marking/markingstore');
var localeStore = require('../../../stores/locale/localestore');
var targetHelper = require('../../../utility/target/targethelper');
var worklistStore = require('../../../stores/worklist/workliststore');
var responseStore = require('../../../stores/response/responsestore');
var exceptionActionCreator = require('../../../actions/exception/exceptionactioncreator');
var qigStore = require('../../../stores/qigselector/qigstore');
var configurableCharacteristicsHelper = require('../../../utility/configurablecharacteristic/configurablecharacteristicshelper');
var loginSession = require('../../../app/loginsession');
var configurableCharacteristicsNames = require('../../../utility/configurablecharacteristic/configurablecharacteristicsnames');
var userInfoStore = require('../../../stores/userinfo/userinfostore');
var ExceptionHelper = (function () {
    function ExceptionHelper() {
    }
    /**
     * Used to create the MessageOrExceptionLinkedItems based on the messages
     * @param messages
     */
    ExceptionHelper.getExceptionLinkedItems = function (exceptions, isTeamManagement) {
        var messageOrExceptionLinkedItems = [];
        var items = exceptions.forEach(function (exception) {
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
    };
    /**
     * Used to order the exception list based on exception status - Resolved, open, closed
     */
    ExceptionHelper.orderExceptionList = function (exceptionData) {
        var actionableException = exceptionData.filter(function (x) { return x.ownerExaminerId === loginSession.EXAMINER_ID; }).toList();
        actionableException = this.sortExceptionListUsingDate(actionableException);
        var unActionableExceptionData = exceptionData.filter(function (x) { return actionableException.indexOf(x) < 0; }).toList();
        var resolvedException = unActionableExceptionData.filter(function (x) { return x.currentStatus === enums.ExceptionStatus.Resolved; }).toList();
        resolvedException = this.sortExceptionListUsingDate(resolvedException);
        var openException = unActionableExceptionData.filter(function (x) { return x.currentStatus === enums.ExceptionStatus.Open &&
            x.ownerExaminerId !== loginSession.EXAMINER_ID; }).toList();
        openException = this.sortExceptionListUsingDate(openException);
        var closedException = unActionableExceptionData.filter(function (x) { return x.currentStatus === enums.ExceptionStatus.Closed; }).toList();
        closedException = this.sortExceptionListUsingDate(closedException);
        var concatinatedList;
        concatinatedList = actionableException.concat(resolvedException, openException, closedException);
        return concatinatedList.toList();
    };
    /**
     * Used to sort the exception list based on datetime
     */
    ExceptionHelper.sortExceptionListUsingDate = function (exceptionData) {
        var sortedList = exceptionData.sort(function (a, b) {
            var key1 = a.dateTimeRaised;
            var key2 = b.dateTimeRaised;
            if (key1 > key2) {
                return -1;
            }
            else if (key1 === key2) {
                return 0;
            }
            else {
                return 1;
            }
        });
        return sortedList.toList();
    };
    /**
     * Sort the Exception Types.
     * @ param - exceptionTypes
     */
    ExceptionHelper.sortExceptionTypes = function (exceptionTypes) {
        var exceptionNameA = '';
        var exceptionNameB = '';
        var sortedExceptionDetails = exceptionTypes.sort(function (a, b) {
            exceptionNameA = localeStore.instance.TranslateText('generic.exception-types.' + a.exceptionType + '.name')
                .toLowerCase();
            exceptionNameB = localeStore.instance.TranslateText('generic.exception-types.' + b.exceptionType + '.name')
                .toLowerCase();
            if (exceptionNameA < exceptionNameB) {
                return -1;
            }
            else if (exceptionNameA === exceptionNameB) {
                return 0;
            }
            else {
                return 1;
            }
        });
        return sortedExceptionDetails.toList();
    };
    /**
     * check whether exception can be raised for a response
     */
    ExceptionHelper.canRaiseException = function (isResponseReadOnly) {
        if (isResponseReadOnly ||
            userInfoStore.instance.currentOperationMode === enums.MarkerOperationMode.StandardisationSetup) {
            return false;
        }
        var qigStatus = targetHelper.getExaminerQigStatus();
        return !(markingStore.instance.currentResponseMode === enums.ResponseMode.pending ||
            markingStore.instance.currentResponseMode === enums.ResponseMode.closed ||
            qigStatus === enums.ExaminerQIGStatus.QualityFeedback ||
            qigStatus === enums.ExaminerQIGStatus.Practice ||
            qigStatus === enums.ExaminerQIGStatus.StandardisationMarking ||
            qigStatus === enums.ExaminerQIGStatus.SecondStandardisationMarking ||
            qigStatus === enums.ExaminerQIGStatus.STMStandardisationMarking ||
            qigStatus === enums.ExaminerQIGStatus.Simulation);
    };
    /**
     * To get new exceptions
     */
    ExceptionHelper.getNewExceptions = function (isTeamManagementMode, displayid, exceptionicon) {
        if (exceptionicon === void 0) { exceptionicon = false; }
        var candidateScriptId;
        var markGroupId;
        if (displayid !== null && displayid !== undefined) {
            candidateScriptId = worklistStore.instance.getResponseDetails(displayid).candidateScriptId;
            markGroupId = worklistStore.instance.getResponseDetails(displayid).markGroupId;
        }
        else {
            candidateScriptId = worklistStore.instance.getResponseDetails(responseStore.instance.selectedDisplayId.toString()).candidateScriptId;
            markGroupId = worklistStore.instance.getResponseDetails(responseStore.instance.selectedDisplayId.toString()).markGroupId;
        }
        exceptionActionCreator.getExceptions(candidateScriptId, markGroupId, qigStore.instance.selectedQIGForMarkerOperation.markSchemeGroupId, isTeamManagementMode, exceptionicon);
    };
    /**
     * Get the appropriate exception description.
     * @ param - exceptionType
     * @ param - isExceptionBlocker
     */
    ExceptionHelper.getExceptionDescription = function (exceptionType, isExceptionBlocker) {
        var blockerDescription;
        if (exceptionType.exceptionType === enums.ExceptionType.IncorrectComponentOrPaper) {
            blockerDescription = (exceptionType.ownerEscalationPoint === enums.EscalationPoint.AdminAdAccount) ?
                localeStore.instance.TranslateText('marking.response.exception-escalation-points.' + exceptionType.ownerEscalationPoint)
                    + localeStore.instance.TranslateText('marking.response.raise-exception-panel.blocking-exception-description')
                    + localeStore.instance.TranslateText('marking.response.raise-exception-panel.incorrect-component-or-paper-additional-description') :
                localeStore.instance.TranslateText('marking.response.exception-escalation-points.' + exceptionType.ownerEscalationPoint)
                    + localeStore.instance.TranslateText('marking.response.raise-exception-panel.incorrect-component-or-paper-additional-description');
        }
        else {
            blockerDescription = (isExceptionBlocker) ?
                (localeStore.instance.TranslateText('marking.response.exception-escalation-points.' + exceptionType.ownerEscalationPoint)
                    + localeStore.instance.TranslateText('marking.response.raise-exception-panel.blocking-exception-description')
                    + ((exceptionType.exceptionType === enums.ExceptionType.ImageCannotBeAccessedOrRead) ?
                        localeStore.instance.TranslateText('marking.response.raise-exception-panel.file-cannot-be-accessed-or-read-additional-description') : '')) :
                (localeStore.instance.TranslateText('marking.response.exception-escalation-points.' + exceptionType.ownerEscalationPoint)
                    + localeStore.instance.TranslateText('marking.response.raise-exception-panel.non-blocking-exception-description'));
        }
        return blockerDescription;
    };
    Object.defineProperty(ExceptionHelper, "isRejectRigCCActive", {
        /**
         * Get Reject Rig CC value.
         */
        get: function () {
            var qigId = qigStore.instance.selectedQIGForMarkerOperation !== undefined ?
                qigStore.instance.selectedQIGForMarkerOperation.markSchemeGroupId : 0;
            return configurableCharacteristicsHelper.getCharacteristicValue('RejectRIG', qigId) === 'true';
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Returns true if exception is zoning exception
     */
    ExceptionHelper.isZoningException = function (exceptionTypeId) {
        var _isZoningException = false;
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
    };
    Object.defineProperty(ExceptionHelper, "isEbookMarking", {
        /**
         * Get EBookmarking CC value.
         */
        get: function () {
            return configurableCharacteristicsHelper.getExamSessionCCValue(configurableCharacteristicsNames.eBookmarking, qigStore.instance.selectedQIGForMarkerOperation.examSessionId)
                .toLowerCase() === 'true';
        },
        enumerable: true,
        configurable: true
    });
    return ExceptionHelper;
}());
module.exports = ExceptionHelper;
//# sourceMappingURL=exceptionhelper.js.map