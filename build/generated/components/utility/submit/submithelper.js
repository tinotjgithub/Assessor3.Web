"use strict";
var enums = require('../enums');
var Immutable = require('immutable');
var worklistStore = require('../../../stores/worklist/workliststore');
var configurableCharacteristicsHelper = require('../../../utility/configurablecharacteristic/configurablecharacteristicshelper');
var configurableCharacteristicsNames = require('../../../utility/configurablecharacteristic/configurablecharacteristicsnames');
var examinerStore = require('../../../stores/markerinformation/examinerstore');
var markingHelper = require('../../../utility/markscheme/markinghelper');
var targetHelper = require('../../../utility/target/targethelper');
var qigStore = require('../../../stores/qigselector/qigstore');
var submitActionCreator = require('../../../actions/submit/submitactioncreator');
var responseActionCreator = require('../../../actions/response/responseactioncreator');
var marksandannotationsSaveHelper = require('../../../utility/marking/marksandannotationssavehelper');
var loginStore = require('../../../stores/login/loginstore');
var markerOperationModeFactory = require('../markeroperationmode/markeroperationmodefactory');
var submitStore = require('../../../stores/submit/submitstore');
var responseStore = require('../../../stores/response/responsestore');
var standardisationSetupStore = require('../../../stores/standardisationsetup/standardisationsetupstore');
var eCourseworkHelper = require('../ecoursework/ecourseworkhelper');
var eCourseWorkFileStore = require('../../../stores/response/digital/ecourseworkfilestore');
var navigationStore = require('../../../stores/navigation/navigationstore');
/**
 * Submit helper for submitting the response from Response and worklist
 */
var SubmitHelper = (function () {
    function SubmitHelper() {
        this.calculateAllpagesAnnotatedLogic = false;
    }
    /**
     * Validate submit button
     * @param response
     * @param markingProgress
     * @param calculateAllpagesAnnotatedLogic
     */
    SubmitHelper.prototype.submitButtonValidate = function (response, markingProgress, calculateAllpagesAnnotatedLogic, hasBlockingExceptions) {
        this.markingProgress = markingProgress;
        this.calculateAllpagesAnnotatedLogic = calculateAllpagesAnnotatedLogic;
        this.responseStatuses = Immutable.List();
        this.responseStatuses.clear();
        if (worklistStore.instance.getResponseMode === enums.ResponseMode.open) {
            this.responseStatuses = this.openResponseValidation(response, hasBlockingExceptions);
        }
        else if (markerOperationModeFactory.operationMode.isStandardisationSetupMode) {
            if (standardisationSetupStore.instance.selectedStandardisationSetupWorkList ===
                enums.StandardisationSetup.ProvisionalResponse ||
                standardisationSetupStore.instance.selectedStandardisationSetupWorkList ===
                    enums.StandardisationSetup.UnClassifiedResponse) {
                this.responseStatuses = this.openResponseValidation(response, hasBlockingExceptions);
            }
        }
        return this.responseStatuses;
    };
    /**
     * Open live worklist validation for marking progress/submit button
     * @param response
     */
    SubmitHelper.prototype.openResponseValidation = function (response, hasBlockingExceptions) {
        response.isSubmitEnabled = false;
        /** if the marking has started */
        if (this.markingProgress > 0) {
            /** if the marking is completed */
            if (this.markingProgress === 100) {
                /** taking the cc from cc helper */
                // Avoid ForceAnnotationOnEachPage CC while opening single response in multiQig
                // Apply ForceAnnotationOnEachPage CC for all QIGs in the whole response when it turned on for at least one QIG
                var markSchemeGroupId = 0;
                var markGroupId = (standardisationSetupStore.instance.selectedStandardisationSetupWorkList === enums.StandardisationSetup.None) ?
                    response.markGroupId : response.esMarkGroupId;
                var isAllFilesViewed = true;
                if (navigationStore.instance.containerPage === enums.PageContainers.Response) {
                    isAllFilesViewed = eCourseWorkFileStore.instance.checkIfAllFilesViewed(markGroupId);
                }
                else {
                    isAllFilesViewed = response.allFilesViewed;
                }
                if (!responseStore.instance.isWholeResponse) {
                    markSchemeGroupId = qigStore.instance.getSelectedQIGForTheLoggedInUser.markSchemeGroupId;
                }
                var isAllPagesAnnotatedCC = configurableCharacteristicsHelper.getCharacteristicValue(configurableCharacteristicsNames.ForceAnnotationOnEachPage, markSchemeGroupId).toLowerCase() === 'true' ? true : false;
                var isAllSLAOAnnotatedCC = configurableCharacteristicsHelper.getCharacteristicValue(configurableCharacteristicsNames.SLAOForcedAnnotations, markSchemeGroupId).toLowerCase() === 'true' ? true : false;
                /** if slao annotated cc is on and all pages are not annotated OR all pages annotated cc is on
                 *  and all pages are not annotated if both CCs are on, all pages annotated cc has
                 *  the higher priority.
                 */
                if (this.calculateAllpagesAnnotatedLogic === true && (isAllPagesAnnotatedCC || isAllSLAOAnnotatedCC)) {
                    response.hasAllPagesAnnotated = markingHelper.isAllPageAnnotated();
                }
                if (standardisationSetupStore.instance.selectedStandardisationSetupWorkList ===
                    enums.StandardisationSetup.UnClassifiedResponse &&
                    !standardisationSetupStore.instance.stdSetupPermissionCCData.role.permissions.viewDefinitives) {
                    // STD UnClassified Response with No View Definitive Permission
                    this.responseStatuses = this.responseStatuses.push(enums.ResponseStatus.NoViewDefinitivesPermisssion);
                }
                else if (standardisationSetupStore.instance.selectedStandardisationSetupWorkList ===
                    enums.StandardisationSetup.UnClassifiedResponse && response.hasDefinitiveMark === false) {
                    // STD UnClassified Response with Definitive Marking Not Started
                    this.responseStatuses = this.responseStatuses.push(enums.ResponseStatus.definitiveMarkingNotStarted);
                }
                else if (standardisationSetupStore.instance.selectedStandardisationSetupWorkList ===
                    enums.StandardisationSetup.UnClassifiedResponse &&
                    !standardisationSetupStore.instance.stdSetupPermissionCCData.role.permissions.classify) {
                    // STD UnClassified Response with No permission to Classify
                    this.responseStatuses = this.responseStatuses.push(enums.ResponseStatus.NoPermissionToClassify);
                }
                else if ((!isAllPagesAnnotatedCC && isAllSLAOAnnotatedCC && response.hasAllPagesAnnotated === false)
                    || (isAllPagesAnnotatedCC && response.hasAllPagesAnnotated === false)) {
                    this.responseStatuses = this.responseStatuses.push(enums.ResponseStatus.notAllPagesAnnotated);
                    this.responseStatuses = this.responseStatuses.push(enums.ResponseStatus.markingInProgress);
                    if (hasBlockingExceptions) {
                        this.responseStatuses = this.responseStatuses.push(enums.ResponseStatus.hasException);
                    }
                }
                else if (eCourseworkHelper.isECourseworkComponent && !isAllFilesViewed) {
                    this.responseStatuses = this.responseStatuses.push(enums.ResponseStatus.notAllFilesViewed);
                    if (hasBlockingExceptions) {
                        this.responseStatuses = this.responseStatuses.push(enums.ResponseStatus.hasException);
                    }
                }
                else if (hasBlockingExceptions) {
                    /**
                     * if the marking is completed and blocking exceptions are there, show both.
                     */
                    this.responseStatuses = this.responseStatuses.push(enums.ResponseStatus.hasException);
                    this.responseStatuses = this.responseStatuses.push(enums.ResponseStatus.markingInProgress);
                }
                else if (response.hasZoningExceptions) {
                    /** if the marking is completed and zoning exceptions are there, show both. */
                    this.responseStatuses = this.responseStatuses.push(enums.ResponseStatus.hasZoningException);
                    this.responseStatuses = this.responseStatuses.push(enums.ResponseStatus.markingInProgress);
                }
                else {
                    /**
                     * if all pages annotated cc is off and if no blocking exceptions are there, show ready to submit button
                     */
                    this.responseStatuses = this.responseStatuses.push(enums.ResponseStatus.readyToSubmit);
                    response.isSubmitEnabled = true;
                }
            }
            else if (hasBlockingExceptions) {
                /**
                 * if the marking is in progress and blocking exceptions are there, show both.
                 */
                this.responseStatuses = this.responseStatuses.push(enums.ResponseStatus.hasException);
                this.responseStatuses = this.responseStatuses.push(enums.ResponseStatus.markingInProgress);
            }
            else if (standardisationSetupStore.instance.selectedStandardisationSetupWorkList ===
                enums.StandardisationSetup.UnClassifiedResponse &&
                !standardisationSetupStore.instance.stdSetupPermissionCCData.role.permissions.viewDefinitives) {
                this.responseStatuses = this.responseStatuses.push(enums.ResponseStatus.NoViewDefinitivesPermisssion);
            }
            else {
                this.responseStatuses = this.responseStatuses.push(enums.ResponseStatus.markingInProgress);
            }
        }
        else {
            //If StandardisationSetup UnClassifiedResponse and defenitive marking percentage iz Zero then show status as 0%
            if (standardisationSetupStore.instance.selectedStandardisationSetupWorkList ===
                enums.StandardisationSetup.UnClassifiedResponse) {
                // If the logged in user has 'No View Definitive' Permission, then show status as 'Provisional'.
                if (!standardisationSetupStore.instance.stdSetupPermissionCCData.role.permissions.viewDefinitives) {
                    this.responseStatuses = this.responseStatuses.push(enums.ResponseStatus.NoViewDefinitivesPermisssion);
                }
                else {
                    this.responseStatuses = this.responseStatuses.push(enums.ResponseStatus.markingInProgress);
                }
            }
            else {
                // if marking not started show the same
                this.responseStatuses = this.responseStatuses.push(enums.ResponseStatus.markingNotStarted);
            }
        }
        return this.responseStatuses;
    };
    /**
     * Save and submit response for the markgroupid
     * @param markGroupId
     */
    SubmitHelper.saveAndSubmitResponse = function (markGroupId) {
        marksandannotationsSaveHelper.triggerMarksAndAnnotationsQueueProcessing(enums.SaveMarksAndAnnotationsProcessingTriggerPoint.Submit, function () {
            SubmitHelper.submitreponse(markGroupId);
        });
    };
    /**
     *  Verify if marks and annotations can be cleared or not
     *
     *  In Case of Blind Practice Marking, standardisation marking, isQualityFeedbackOutstanding of seed,
     *  the definitive marks are not retrieved from gateway for open responses
     *  So after submission of a practice response we need to clear the existing marks and annotation so that the
     *  Marks and annotations will be retrieved from gateway. The same logic is done in worklist as well
     *  @param markGroupId
     */
    SubmitHelper.isClearMarksAndAnnotations = function (markGroupId) {
        // check isBlindPracticeMarkingOn CC is turned On 
        var isBlindPracticeMarkingOn = configurableCharacteristicsHelper.getCharacteristicValue(configurableCharacteristicsNames.BlindPracticeMarking).toLowerCase() === 'true';
        // check isShowStandardisationDefinitiveMarks CC is turned On
        var isShowStandardisationDefinitiveMarks = configurableCharacteristicsHelper.getCharacteristicValue(configurableCharacteristicsNames.ShowStandardisationDefinitiveMarks, qigStore.instance.selectedQIGForMarkerOperation.markSchemeGroupId).toLowerCase() === 'true';
        // check AutomaticQualityFeedback CC is turned ON
        var isAutomaticQualityFeedback = configurableCharacteristicsHelper.getCharacteristicValue(configurableCharacteristicsNames.AutomaticQualityFeedback, qigStore.instance.selectedQIGForMarkerOperation.markSchemeGroupId).toLowerCase() === 'true';
        // check whether the current response type is standardisation/secondstandardisation marking 
        // and corresponding cc is ON for showing  previous definitive mark after submitting.
        var isStandardisation = (worklistStore.instance.currentWorklistType === enums.WorklistType.standardisation
            || worklistStore.instance.currentWorklistType === enums.WorklistType.secondstandardisation)
            && isShowStandardisationDefinitiveMarks ? true : false;
        // check whether the current response type is Practice and corresponding cc is ON for showing
        // previous definitive mark after submitting.
        var isPractice = worklistStore.instance.currentWorklistType === enums.WorklistType.practice
            && isBlindPracticeMarkingOn ? true : false;
        var isSeed = false;
        var seedCollection = submitStore.instance.getSubmitResponseReturn.seedCollection[markGroupId];
        if (seedCollection) {
            // check whether the submitted response is seed or not and if Quality feedback CC is ON or not
            isSeed = isAutomaticQualityFeedback && seedCollection.seedType !== enums.SeedType.None;
        }
        return isStandardisation || isPractice || isSeed;
    };
    /**
     * Submit response
     * @param markGroupId
     */
    SubmitHelper.submitreponse = function (markGroupId) {
        var submitResponseArgument;
        /* Submitting  responses initiated */
        /* Select the mark group list based on the current response mode */
        var markGroupIdList = new Array();
        markGroupIdList.push(markGroupId);
        if (responseStore.instance.isWholeResponse) {
            // If a whole response, retrieve all the related markGroupIds
            var relatedMarkGroupIds = worklistStore.instance.getRelatedMarkGroupIdsForWholeResponse(markGroupId);
            // Update related markGroupIds for whole response submission from mark scheme panel
            // For Atypical, the isWholeResponse flag is true always, so also checking the retrieved list length
            if (relatedMarkGroupIds.length > 0) {
                relatedMarkGroupIds.map(function (relatedMarkGroupId) {
                    markGroupIdList.push(relatedMarkGroupId);
                });
            }
        }
        /* mapping  values on submit argument*/
        submitResponseArgument = {
            markGroupIds: markGroupIdList,
            markingMode: targetHelper.getSelectedQigMarkingMode(),
            examinerRoleId: qigStore.instance.selectedQIGForMarkerOperation.examinerRoleId,
            markSchemeGroupId: qigStore.instance.selectedQIGForMarkerOperation.markSchemeGroupId,
            examinerApproval: examinerStore.instance.getMarkerInformation.approvalStatus,
            isAdminRemarker: loginStore.instance.isAdminRemarker
        };
        //let remarkRequestType: enums.RemarkRequestType = this.getRemarkRequestType(.worklistType);    
        /* calling to send data to server */
        submitActionCreator.submitResponse(submitResponseArgument, qigStore.instance.selectedQIGForMarkerOperation.markSchemeGroupId, worklistStore.instance.currentWorklistType, worklistStore.instance.getRemarkRequestType, true, responseStore.instance.selectedDisplayId.toString());
    };
    /**
     * Clear the marks and Annotation for responses so that the marks will be reloaded
     * @param submittedMarkGroupIds
     */
    SubmitHelper.clearMarksAndAnnotations = function (submittedMarkGroupIds) {
        // check whether we need to clear marks and annoatation for pracice and standazation response.
        if (submittedMarkGroupIds !== undefined) {
            for (var _i = 0, submittedMarkGroupIds_1 = submittedMarkGroupIds; _i < submittedMarkGroupIds_1.length; _i++) {
                var markGroupId = submittedMarkGroupIds_1[_i];
                // Verify if marks and annotations of the submitted response can be cleared
                if (SubmitHelper.isClearMarksAndAnnotations(markGroupId)) {
                    // Calling the action creator to clear the marks and annotations
                    responseActionCreator.clearMarksAndAnnotations(markGroupId);
                }
            }
        }
    };
    return SubmitHelper;
}());
module.exports = SubmitHelper;
//# sourceMappingURL=submithelper.js.map