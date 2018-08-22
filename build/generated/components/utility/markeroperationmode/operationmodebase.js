"use strict";
var qigStore = require('../../../stores/qigselector/qigstore');
var userOptionsHelper = require('../../../utility/useroption/useroptionshelper');
var userOptionKeys = require('../../../utility/useroption/useroptionkeys');
var ccHelper = require('../../../utility/configurablecharacteristic/configurablecharacteristicshelper');
var ccNames = require('../../../utility/configurablecharacteristic/configurablecharacteristicsnames');
var ccValues = require('../../../utility/configurablecharacteristic/configurablecharacteristicsvalues');
var examinerStore = require('../../../stores/markerinformation/examinerstore');
var xmlHelper = require('../../../utility/generic/xmlhelper');
var worklistStore = require('../../../stores/worklist/workliststore');
var responseStore = require('../../../stores/response/responsestore');
var enums = require('../enums');
var rememberQig = require('../../../stores/useroption/typings/rememberqig');
var OperationModeBase = (function () {
    function OperationModeBase() {
    }
    /**
     * get the value of supervisor sampling cc.
     */
    OperationModeBase.prototype.getSupervisorSamplingCCValue = function (worklistType) {
        var ccValue = ccHelper.getCharacteristicValue(ccNames.RecordSupervisorSampling, qigStore.instance.selectedQIGForMarkerOperation.markSchemeGroupId);
        if (ccValue && ccValue !== '') {
            var xmlHelperObj = new xmlHelper(ccValue);
            var isCCOn = false;
            for (var i = 0; i < xmlHelperObj.getAllChildNodes().length; i++) {
                if (enums.WorklistType[worklistType] === xmlHelperObj.
                    getAllChildNodes()[i].firstChild.nodeValue.toLowerCase()) {
                    isCCOn = true;
                    break;
                }
            }
            return isCCOn;
        }
        else {
            return false;
        }
    };
    /**
     * get the value of senior examiner pool cc.
     */
    OperationModeBase.prototype.getSeniorExaminerPoolCCValue = function () {
        var ccValue = ccHelper.getCharacteristicValue(ccNames.SeniorExaminerPool, qigStore.instance.selectedQIGForMarkerOperation.markSchemeGroupId).toLowerCase() === 'true' ? true : false;
        return ccValue;
    };
    Object.defineProperty(OperationModeBase.prototype, "isMarkerApprovedOrSuspended", {
        /**
         * This method will return true if marker is approved/suspended.
         * Suspended handled as special case,as when a marker is in live target and then gets suspended,both future icon and
         * the progress will be shown if target is disabled
         */
        get: function () {
            var approvalStatus = examinerStore.instance.getMarkerInformation.approvalStatus;
            return approvalStatus === enums.ExaminerApproval.Approved || approvalStatus === enums.ExaminerApproval.ApprovedReview ||
                approvalStatus === enums.ExaminerApproval.ConditionallyApproved || approvalStatus === enums.ExaminerApproval.Suspended;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(OperationModeBase.prototype, "previousSelectedQIGFromUserOption", {
        /**
         * Method which gets the previously selected QIG from the user option
         */
        get: function () {
            // Getting the user option for RememberPreviousQIG
            var _rememberQig = new rememberQig();
            var _userOptionValue = userOptionsHelper.getUserOptionByName(userOptionKeys.REMEMBER_PREVIOUS_QIG);
            if (_userOptionValue) {
                _rememberQig = JSON.parse(_userOptionValue);
            }
            return _rememberQig;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(OperationModeBase.prototype, "getResponseModeBasedOnQualityFeedback", {
        /**
         * get the response mode based on quality feedback
         * @returns
         */
        get: function () {
            if (this.isExaminerHasQualityFeedback && !worklistStore.instance.isMarkingCheckMode) {
                if (this.isAutomaticQualityFeedbackCCOn) {
                    return enums.ResponseMode.closed;
                }
                else {
                    return enums.ResponseMode.pending;
                }
            }
            else {
                return undefined;
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(OperationModeBase.prototype, "hasShowStandardisationDefinitiveMarksCC", {
        /**
         * Returns whether the Show Standardisation Definitive Marks CC is on or not.
         */
        get: function () {
            return ccHelper.getCharacteristicValue(ccNames.ShowStandardisationDefinitiveMarks, qigStore.instance.selectedQIGForMarkerOperation.markSchemeGroupId).toLowerCase() === 'true';
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(OperationModeBase.prototype, "hasShowTLSeedDefinitiveMarksCC", {
        /**
         * Returns whether the Show TL Seed Definitive Marks CC is on or not.
         */
        get: function () {
            return ccHelper.getCharacteristicValue(ccNames.ShowTLSeedDefinitiveMarks).toLowerCase() === 'true';
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(OperationModeBase.prototype, "isStandardisation", {
        /**
         * gets whether the current worklist is Standardisation.
         */
        get: function () {
            return worklistStore.instance.currentWorklistType === enums.WorklistType.standardisation;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(OperationModeBase.prototype, "isPractice", {
        /**
         * gets whether the current worklist is practice.
         */
        get: function () {
            return worklistStore.instance.currentWorklistType === enums.WorklistType.practice;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(OperationModeBase.prototype, "isDirectedRemark", {
        /**
         * gets whether the current worklist is directed remark.
         */
        get: function () {
            return worklistStore.instance.currentWorklistType === enums.WorklistType.directedRemark;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(OperationModeBase.prototype, "isPooledRemark", {
        /**
         * gets whether the current worklist is pooled remark.
         * @returns
         */
        get: function () {
            return worklistStore.instance.currentWorklistType === enums.WorklistType.pooledRemark;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(OperationModeBase.prototype, "isSecondStandardisation", {
        /**
         * gets whether the current worklist is Second Standardisation.
         */
        get: function () {
            return worklistStore.instance.currentWorklistType === enums.WorklistType.secondstandardisation;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(OperationModeBase.prototype, "isLive", {
        /**
         * gets whether the current worklist is Live.
         */
        get: function () {
            return worklistStore.instance.currentWorklistType === enums.WorklistType.live;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(OperationModeBase.prototype, "isClosed", {
        /**
         * gets whether the current response mode is closed.
         */
        get: function () {
            return worklistStore.instance.getResponseMode === enums.ResponseMode.closed;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(OperationModeBase.prototype, "isOpen", {
        /**
         * gets whether the current response mode is closed.
         */
        get: function () {
            return worklistStore.instance.getResponseMode === enums.ResponseMode.open;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(OperationModeBase.prototype, "isCurrentResponseSeed", {
        /**
         * gets whether the response is seed.
         */
        get: function () {
            var currentResponse = worklistStore.instance.getCurrentWorklistResponseBaseDetails().filter(function (responses) {
                return responses.markGroupId === responseStore.instance.selectedMarkGroupId;
            }).first();
            if (currentResponse && currentResponse.seedTypeId) {
                return currentResponse.seedTypeId;
            }
            else {
                return enums.SeedType.None;
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(OperationModeBase.prototype, "isCurrentResponseDefinitive", {
        /**
         * Gets a value indicating whether the currrent response is a definitive response. i.e, Used for standardisation
         * This also includes Promoted Seeds.
         */
        get: function () {
            var currentResponse = worklistStore.instance.getCurrentWorklistResponseBaseDetails().filter(function (response) {
                return response.markGroupId === responseStore.instance.selectedMarkGroupId;
            });
            // Only logged in PE or APE should know whether the response is Definitive.
            return currentResponse && currentResponse.first().isDefinitiveResponse === true && this.isLoggedInExaminerPEOrAPE;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(OperationModeBase.prototype, "isAutomaticQualityFeedbackCCOn", {
        /**
         * Checks whether the automatic quality feedback CC is on
         * @returns
         */
        get: function () {
            return ccHelper.getCharacteristicValue(ccNames.AutomaticQualityFeedback, qigStore.instance.selectedQIGForMarkerOperation.markSchemeGroupId).toLowerCase() === 'true' ? true : false;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(OperationModeBase.prototype, "isExaminerHasQualityFeedback", {
        /**
         * Checks whether the examiner has quality feedback
         */
        get: function () {
            return (qigStore.instance.selectedQIGForMarkerOperation !== undefined
                && qigStore.instance.selectedQIGForMarkerOperation.hasQualityFeedbackOutstanding) ||
                (examinerStore.instance.getMarkerInformation !== undefined
                    && examinerStore.instance.getMarkerInformation.hasQualityFeedbackOutstanding);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(OperationModeBase.prototype, "isPromoteToReuseButtonVisible", {
        /**
         * Returns whether the promote to reusebucket  button is visible or not.
         */
        get: function () {
            var markSchemeGroupId = qigStore.instance.selectedQIGForMarkerOperation ?
                qigStore.instance.selectedQIGForMarkerOperation.markSchemeGroupId : 0;
            var reuseRIG = ccHelper.getCharacteristicValue(ccNames.ReuseRIG, markSchemeGroupId);
            var eCoursework = ccHelper.getCharacteristicValue(ccNames.ECoursework);
            var currentResponse = worklistStore.instance.getResponseDetailsByMarkGroupId(responseStore.instance.selectedMarkGroupId);
            var currentMarkingMode = worklistStore.instance.getMarkingModeByWorkListType(worklistStore.instance.currentWorklistType);
            return currentResponse !== null &&
                (responseStore.instance.markingMethod === enums.MarkingMethod.Unstructured || eCoursework === 'true')
                && this.isLoggedInExaminerPE && reuseRIG === 'true' && worklistStore.instance.getResponseMode === enums.ResponseMode.closed
                && (currentMarkingMode === enums.MarkingMode.LiveMarking || currentMarkingMode === enums.MarkingMode.Remarking)
                && !(currentResponse).isPirate && (currentResponse).atypicalStatus === enums.AtypicalStatus.Scannable
                && !(currentResponse).isPromotedToReuseBucket
                && !(currentResponse).isPromotedSeed
                && !responseStore.instance.isWholeResponse
                && currentResponse.seedTypeId === enums.SeedType.None
                && currentResponse.specialistType === '';
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(OperationModeBase.prototype, "shouldDisplaySupervisorRemarkButton", {
        /**
         * Returns whether the supervisor remark button is visible or not.
         */
        get: function () {
            var markSchemeGroupId = qigStore.instance.selectedQIGForMarkerOperation.markSchemeGroupId;
            var currentResponse = (worklistStore.instance.getCurrentWorklistResponseBaseDetails().filter(function (x) {
                return x.markGroupId === responseStore.instance.selectedMarkGroupId;
            }).first());
            var shouldDisplaySupervisorRemarkButton = (worklistStore.instance.getResponseMode !== enums.ResponseMode.open
                && (worklistStore.instance.getMarkingModeByWorkListType(worklistStore.instance.currentWorklistType) === enums.MarkingMode.LiveMarking ||
                    worklistStore.instance.getMarkingModeByWorkListType(worklistStore.instance.currentWorklistType) === enums.MarkingMode.Remarking) &&
                ccHelper.getCharacteristicValue(ccNames.SupervisorRemark, markSchemeGroupId).toLowerCase() === 'true'
                && qigStore.instance.getSelectedQIGForTheLoggedInUser.examinerApprovalStatus ===
                    enums.ExaminerApproval.Approved)
                && (currentResponse && !(currentResponse).isPromotedSeed)
                && (worklistStore.instance.getResponseMode === enums.ResponseMode.pending ?
                    (ccHelper.getCharacteristicValue(ccNames.SupervisorRemarkPending, markSchemeGroupId).toLowerCase() === 'true' &&
                        ccHelper.getCharacteristicValue(ccNames.SupervisorRemark, markSchemeGroupId).toLowerCase() === 'true')
                    : ccHelper.getCharacteristicValue(ccNames.SupervisorRemark, markSchemeGroupId).toLowerCase() === 'true')
                && !this.isCurrentResponseDefinitive
                && !(worklistStore.instance.currentWorklistType === enums.WorklistType.live &&
                    responseStore.instance.isWholeResponse);
            if (worklistStore.instance.currentWorklistType === enums.WorklistType.atypical) {
                // If the supervisor is in 'Suspended'or Not approved'  state in any of the QIG, 
                // then the 'Raise Supervisor re- mark' button shall not displayed for atypical worklist.
                return shouldDisplaySupervisorRemarkButton && qigStore.instance.isAtypicalAvailable;
            }
            else {
                return shouldDisplaySupervisorRemarkButton;
            }
        },
        enumerable: true,
        configurable: true
    });
    /**
     * get the value of Remark Seeding cc.
     */
    OperationModeBase.prototype.getRemarkSeedingCCValue = function (remarkRequestType) {
        var ccValue = ccHelper.getCharacteristicValue(ccNames.RemarkSeeding);
        if (ccValue && ccValue !== '') {
            var xmlHelperObj = new xmlHelper(ccValue);
            var isCCOn = false;
            for (var i = 0; i < xmlHelperObj.getAllChildNodes().length; i++) {
                if (enums.RemarkRequestType[remarkRequestType] ===
                    xmlHelperObj.getAllChildNodes()[i].firstChild.nodeValue.replace(/\s/g, '')) {
                    for (var i_1 = xmlHelperObj.getAllChildNodes().length - 1; i_1 < xmlHelperObj.getAllChildNodes().length; i_1--) {
                        if (xmlHelperObj.
                            getAllChildNodes()[i_1].firstChild.nodeValue.toLowerCase() === 'true') {
                            isCCOn = true;
                        }
                        else {
                            isCCOn = false;
                        }
                        break;
                    }
                }
            }
            return isCCOn;
        }
        else {
            return false;
        }
    };
    Object.defineProperty(OperationModeBase.prototype, "isSelectedExaminerPEOrAPE", {
        /**
         * returns true if selected examiner is PE or APE
         */
        get: function () {
            return qigStore.instance.selectedQIGForMarkerOperation.role === enums.ExaminerRole.principalExaminer ||
                qigStore.instance.selectedQIGForMarkerOperation.role === enums.ExaminerRole.assistantPrincipalExaminer;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(OperationModeBase.prototype, "isSelectedExaminerSTM", {
        /**
         * returns true if selected examiner is STM
         */
        get: function () {
            return qigStore.instance.selectedQIGForMarkerOperation !== undefined
                && (qigStore.instance.selectedQIGForMarkerOperation.isElectronicStandardisationTeamMember
                    || this.isSelectedExaminerPEOrAPE);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(OperationModeBase.prototype, "isLoggedInExaminerPEOrAPE", {
        /**
         * returns true if logged-in examiner is PE or APE
         */
        get: function () {
            return qigStore.instance.getSelectedQIGForTheLoggedInUser.role === enums.ExaminerRole.principalExaminer ||
                qigStore.instance.getSelectedQIGForTheLoggedInUser.role === enums.ExaminerRole.assistantPrincipalExaminer;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(OperationModeBase.prototype, "isLoggedInExaminerPE", {
        /**
         * returns true if logged-in examiner is PE
         */
        get: function () {
            return qigStore.instance.getSelectedQIGForTheLoggedInUser.role === enums.ExaminerRole.principalExaminer;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(OperationModeBase.prototype, "isLoggedInExaminerSTM", {
        /**
         * returns true if logged-in examiner is STM
         */
        get: function () {
            return qigStore.instance.getSelectedQIGForTheLoggedInUser.isElectronicStandardisationTeamMember
                || this.isLoggedInExaminerPEOrAPE;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(OperationModeBase.prototype, "shouldDisplayCenterNumber", {
        /**
         * Checks whether the examiner Centre Exclusivity CC is on
         * @returns
         */
        get: function () {
            return ccValues.examinerCentreExclusivity ? false : true;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Opened Response Details
     * @param {string} actualDisplayId
     * @returns {ResponseBase}
     * @memberof MarkingOperationMode
     */
    OperationModeBase.prototype.openedResponseDetails = function (actualDisplayId) {
        var openedResponseDetails = worklistStore.instance.getResponseDetails(actualDisplayId);
        return openedResponseDetails;
    };
    /**
     * Returns the response position
     * @param {string} displayId
     * @returns {number}
     * @memberof MarkingOperationMode
     */
    OperationModeBase.prototype.getResponsePosition = function (displayId) {
        return worklistStore.instance.getResponsePosition(displayId);
    };
    /**
     * Returns whether next response is available or not
     * @param {string} displayId
     * @returns {boolean}
     * @memberof MarkingOperationMode
     */
    OperationModeBase.prototype.isNextResponseAvailable = function (displayId) {
        return worklistStore.instance.isNextResponseAvailable(displayId);
    };
    /**
     * Returns whether next response is available or not
     * @param {string} displayId
     * @returns {boolean}
     * @memberof StandardisationSetupOperationMode
     */
    OperationModeBase.prototype.isPreviousResponseAvailable = function (displayId) {
        return worklistStore.instance.isPreviousResponseAvailable(displayId);
    };
    Object.defineProperty(OperationModeBase.prototype, "currentResponseCount", {
        /**
         * Current response Count
         */
        get: function () {
            return worklistStore.instance.currentWorklistResponseCount;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Returns the next response id
     * @param {string} displayId
     * @returns {string}
     * @memberof MarkingOperationMode
     */
    OperationModeBase.prototype.nextResponseId = function (displayId) {
        return worklistStore.instance.nextResponseId(displayId);
    };
    /**
     * Returns the previous response id
     * @param {string} displayId
     * @returns {string}
     * @memberof MarkingOperationMode
     */
    OperationModeBase.prototype.previousResponseId = function (displayId) {
        return worklistStore.instance.previousResponseId(displayId);
    };
    /**
     * get Response Details By MarkGroupId
     * @param {number} markGroupId
     * @returns
     * @memberof TeamManagementOperationMode
     */
    OperationModeBase.prototype.getResponseDetailsByMarkGroupId = function (markGroupId) {
        return worklistStore.instance.getResponseDetailsByMarkGroupId(markGroupId);
    };
    /**
     * Get the tag id
     * @param {string} displayId
     * @memberof MarkingOperationMode
     */
    OperationModeBase.prototype.getTagId = function (displayId) {
        return worklistStore.instance.getTagId(displayId);
    };
    Object.defineProperty(OperationModeBase.prototype, "isProvisionalTabInStdSetup", {
        /**
         * returns false, by default.
         */
        get: function () {
            return false;
        },
        enumerable: true,
        configurable: true
    });
    return OperationModeBase;
}());
module.exports = OperationModeBase;
//# sourceMappingURL=operationmodebase.js.map