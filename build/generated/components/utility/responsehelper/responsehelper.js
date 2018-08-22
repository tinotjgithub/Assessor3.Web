"use strict";
var enums = require('../enums');
var responseStore = require('../../../stores/response/responsestore');
var worklistStore = require('../../../stores/worklist/workliststore');
var scriptStore = require('../../../stores/script/scriptstore');
var annotationHelper = require('../../../components/utility/annotation/annotationhelper');
var configurableCharacteristicsHelper = require('../../../utility/configurablecharacteristic/configurablecharacteristicshelper');
var configurableCharacteristicsNames = require('../../../utility/configurablecharacteristic/configurablecharacteristicsnames');
var markerOperationModeFactory = require('../markeroperationmode/markeroperationmodefactory');
var responseActionCreator = require('../../../actions/response/responseactioncreator');
var userOptionsHelper = require('../../../utility/useroption/useroptionshelper');
var userOptionKeys = require('../../../utility/useroption/useroptionkeys');
var qigStore = require('../../../stores/qigselector/qigstore');
var copyPreviousMarksAndAnnotationsHelper = require('../annotation/copypreviousmarksandannotationshelper');
var imagezoneStore = require('../../../stores/imagezones/imagezonestore');
var operationModeHelper = require('../userdetails/userinfo/operationmodehelper');
var standardisationSetupStore = require('../../../stores/standardisationsetup/standardisationsetupstore');
/**
 * Helper class
 */
var ResponseHelper = (function () {
    function ResponseHelper() {
    }
    /**
     * To check the response should be rendered as unstructured or structured
     */
    ResponseHelper.isAtypicalResponse = function () {
        // get the response data
        var responseData = undefined;
        if (responseStore.instance.selectedDisplayId) {
            responseData = worklistStore.instance.getResponseDetails(responseStore.instance.selectedDisplayId.toString());
        }
        return (responseData && responseData.atypicalStatus !== enums.AtypicalStatus.Scannable);
    };
    Object.defineProperty(ResponseHelper, "currentAtypicalStatus", {
        /**
         * Gets a value indicating the atypical status of the response.
         */
        get: function () {
            var responseData = worklistStore.instance.getResponseDetails(responseStore.instance.selectedDisplayId.toString());
            if (responseData) {
                return responseData.atypicalStatus;
            }
            return enums.AtypicalStatus.Scannable;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Get response seed type Id
     */
    ResponseHelper.getCurrentResponseSeedType = function () {
        return markerOperationModeFactory.operationMode.getCurrentResponseSeedType;
    };
    Object.defineProperty(ResponseHelper, "isClosedEurSeed", {
        /*
        * gets whether the response is closed EUR seed
        */
        get: function () {
            return markerOperationModeFactory.operationMode.isClosedEurSeed;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ResponseHelper, "isClosedLiveSeed", {
        /*
        * gets whether the response is closed Live seed
        */
        get: function () {
            return markerOperationModeFactory.operationMode.isClosedLiveSeed;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ResponseHelper, "firstSLAOPageNumber", {
        /*
         * Get pagenumber of additionalobject(first one in the list)
         */
        get: function () {
            return this._firstSLAOPageNumber;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ResponseHelper, "hasAdditionalObject", {
        /*
         *Set the value whether the response has additional object or not
         */
        get: function () {
            return this._hasAdditionalObject;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * get whether the script having unmanaged SLAO
     */
    ResponseHelper.hasUnmanagedSLAO = function (displayId) {
        // Set the  default value for variables.
        this._hasAdditionalObject = false;
        this._firstSLAOPageNumber = 0;
        // check whether any unmanaged slao for structured responses
        if (responseStore.instance.markingMethod === enums.MarkingMethod.Structured) {
            // get the response data
            var responseData = markerOperationModeFactory.operationMode.openedResponseDetails(displayId);
            /* UnManaged SLAO need not be considered for Atypical
               Responses as they are treated as unstructured*/
            if (responseData && (responseData.atypicalStatus === enums.AtypicalStatus.AtypicalScannable ||
                responseData.atypicalStatus === enums.AtypicalStatus.AtypicalUnscannable)) {
                return false;
            }
            var additionalScriptImages_1 = [];
            if (responseData && responseData.candidateScriptId) {
                // get the additional script images which are not supressed
                var scriptDetails = (scriptStore.instance.getAllScriptDetailsForTheCandidateScript(responseData.candidateScriptId)).forEach(function (scriptImage) {
                    if (scriptImage && scriptImage.isAdditionalObject && !scriptImage.isSuppressed) {
                        additionalScriptImages_1.push(scriptImage);
                    }
                });
                // Check if the response has any additional object or not ,if ,then set it has aaditional object and pagenumber of that.
                if (additionalScriptImages_1.length > 0) {
                    this._firstSLAOPageNumber = additionalScriptImages_1[additionalScriptImages_1.length - 1].pageNumber;
                    this._hasAdditionalObject = true;
                }
                // loop through each additional script and check wheather any script is unannotated
                var annotationDetails = void 0;
                if (additionalScriptImages_1) {
                    for (var index = 0; index < additionalScriptImages_1.length; index++) {
                        annotationDetails = annotationHelper.getAnnotationsInAdditionalObjectByPageNo(additionalScriptImages_1[index].pageNumber, markerOperationModeFactory.operationMode.isStandardisationSetupMode ?
                            responseData.esMarkGroupId : responseData.markGroupId);
                        // if the page is not annotated then return true
                        if (annotationDetails.count() === 0) {
                            return true;
                        }
                    }
                }
            }
        }
        // return false if no unmanaged slao
        return false;
    };
    /**
     * Open the response
     * @param displayId
     * @param responseNavigation
     * @param responseMode
     * @param markGroupId
     * @param responseViewMode
     * @param triggerPoint
     * @param sampleReviewCommentId
     * @param sampleReviewCommentCreatedBy
     */
    ResponseHelper.openResponse = function (displayId, responseNavigation, responseMode, markGroupId, responseViewMode, triggerPoint, sampleReviewCommentId, sampleReviewCommentCreatedBy) {
        if (triggerPoint === void 0) { triggerPoint = enums.TriggerPoint.None; }
        if (sampleReviewCommentId === void 0) { sampleReviewCommentId = enums.SampleReviewComment.None; }
        if (sampleReviewCommentCreatedBy === void 0) { sampleReviewCommentCreatedBy = 0; }
        var selectedResponseExaminerRoleId;
        // set the examinerRoleId based on following condition
        if (worklistStore.instance.isMarkingCheckMode) {
            // response open from MarkingCheckMode wiorklist.
            selectedResponseExaminerRoleId = worklistStore.instance.selectedMarkingCheckExaminer.examinerRoleID;
        }
        else if (triggerPoint && triggerPoint === enums.TriggerPoint.AssociatedDisplayIDFromMessage) {
            // response open through displayid link.
            selectedResponseExaminerRoleId = responseStore.instance.searchedResponseData.examinerRoleId;
        }
        else {
            // response open from teammangement/ mymarking worklist.
            selectedResponseExaminerRoleId = operationModeHelper.examinerRoleId;
        }
        // Checking whether the response is withdrwan in background or not.
        if (markerOperationModeFactory.operationMode.isStandardisationSetupMode) {
            responseActionCreator.validateCentreScriptResponse(displayId, qigStore.instance.selectedQIGForMarkerOperation.markSchemeGroupId);
        }
        else {
            responseActionCreator.validateResponse(markGroupId, qigStore.instance.selectedQIGForMarkerOperation.markSchemeGroupId, selectedResponseExaminerRoleId);
        }
        var hasUnmanagedSLAOs = markerOperationModeFactory.operationMode.isStandardisationSetupMode ?
            standardisationSetupStore.instance.hasAdditionalPage : ResponseHelper.hasUnmanagedSLAO(displayId.toString()) &&
            !markerOperationModeFactory.operationMode.isTeamManagementMode;
        var isWholeResponse = markerOperationModeFactory.operationMode.isStandardisationSetupMode ?
            false : this.isWholeResponse(displayId);
        responseActionCreator.openResponse(displayId, responseNavigation, responseMode, markGroupId, hasUnmanagedSLAOs
            ? enums.ResponseViewMode.fullResponseView :
            responseViewMode, triggerPoint, sampleReviewCommentId, sampleReviewCommentCreatedBy, isWholeResponse);
    };
    /**
     * returns true if selected response is Whole Response
     */
    ResponseHelper.isWholeResponse = function (displayId) {
        // get the response data
        var responseData = undefined;
        if (displayId) {
            responseData = worklistStore.instance.getResponseDetails(displayId.toString());
            return responseData.isWholeResponse;
        }
        return false;
    };
    Object.defineProperty(ResponseHelper, "hasUnManagedSLAOInMarkingMode", {
        /**
         * returns true for scripts having unmanaged slaos in marking view
         */
        get: function () {
            return ((ResponseHelper.hasUnmanagedSLAO(responseStore.instance.selectedDisplayId.toString()) &&
                !markerOperationModeFactory.operationMode.isTeamManagementMode &&
                !ResponseHelper.isAtypicalResponse() &&
                // Added this check to avoid unmanaged slao content mode in closed worklist
                worklistStore.instance.getResponseMode !== enums.ResponseMode.closed &&
                !markerOperationModeFactory.operationMode.isUnclassifiedTabInStdSetup &&
                !markerOperationModeFactory.operationMode.isSelectResponsesTabInStdSetup) ||
                (ResponseHelper.hasUnmanagedSLAO(responseStore.instance.selectedDisplayId.toString()) &&
                    markerOperationModeFactory.operationMode.isUnclassifiedTabInStdSetup &&
                    markerOperationModeFactory.operationMode.isDefinitveMarkingStarted));
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ResponseHelper, "hasAdditionalPageInStdSetUpSelectResponses", {
        /**
         * return true if selected response contains additional pages
         */
        get: function () {
            return standardisationSetupStore.instance.hasAdditionalPage;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * returns true for ebookmarking responses having unmanaged imagez zones.
     */
    ResponseHelper.hasUnManagedImageZone = function () {
        var _this = this;
        // This is to return false in standardisationsetup as we will not have unmanaged image zones for a response  
        if (markerOperationModeFactory.operationMode.isStandardisationSetupMode) {
            return false;
        }
        var imageZones = imagezoneStore.instance.currentCandidateScriptImageZone;
        var unManagedZones = (imageZones ? imageZones.filter(function (x) { return x.docStorePageQuestionTagTypeId === 4; }) : undefined);
        var responseData = markerOperationModeFactory.operationMode.openedResponseDetails(responseStore.instance.selectedDisplayId.toString());
        var hasUnmanaged = false;
        // For live response marked in WA and remark in A3
        var hasUnmanagedUnknownContentInRemark = false;
        var managedUnknownContentInRemark = false;
        var annotationDetails;
        var previousAnnotations;
        var isRemark = (worklistStore.instance.currentWorklistType === enums.WorklistType.directedRemark ||
            worklistStore.instance.currentWorklistType === enums.WorklistType.pooledRemark);
        if (unManagedZones) {
            unManagedZones.forEach(function (item) {
                annotationDetails = annotationHelper.getAnnotationsInAdditionalObjectByPageNo(item.pageNo, responseData.markGroupId);
                if (!annotationHelper.isLinkedOrFlaggedAsSeenInPage(annotationDetails)) {
                    hasUnmanaged = true;
                }
                if (isRemark) {
                    previousAnnotations = annotationHelper.
                        getPreviousAnnotationsInPageNo(item.pageNo, _this.getCurrentResponseSeedType());
                    if (!annotationHelper.isLinkedOrFlaggedAsSeenInPage(previousAnnotations)) {
                        hasUnmanagedUnknownContentInRemark = true;
                    }
                }
            });
        }
        if (hasUnmanagedUnknownContentInRemark) {
            managedUnknownContentInRemark = true;
        }
        else {
            managedUnknownContentInRemark = isRemark ?
                copyPreviousMarksAndAnnotationsHelper.canStartMarkingWithEmptyMarkGroup() : true;
        }
        // Added this check to avoid unknown content management mode in closed worklist
        return (hasUnmanaged && worklistStore.instance.getResponseMode !== enums.ResponseMode.closed &&
            managedUnknownContentInRemark &&
            !markerOperationModeFactory.operationMode.isTeamManagementMode &&
            !worklistStore.instance.isMarkingCheckMode);
    };
    /**
     * returns true for ebookmarking having unknown content with unmanaged zones.
     * even though it is managed in SLAO view
     */
    ResponseHelper.isUnkNownContentPage = function (pageNo) {
        var isUnkNownContentPage = false;
        var imageZones = imagezoneStore.instance.currentCandidateScriptImageZone;
        var unManagedZones = (imageZones ? imageZones.filter(function (x) { return x.docStorePageQuestionTagTypeId === 4; }) : undefined);
        isUnkNownContentPage = unManagedZones ? unManagedZones.some(function (x) { return x.pageNo === pageNo; }) : false;
        return isUnkNownContentPage;
    };
    /**
     * returns true for ebookmarking responses having unmanaged imagez zones for the given page.
     */
    ResponseHelper.hasUnManagedImageZoneForThePage = function (pageNo) {
        var imageZones = imagezoneStore.instance.currentCandidateScriptImageZone;
        var unManagedZones = (imageZones ? imageZones.filter(function (x) { return x.docStorePageQuestionTagTypeId === 4; }) : undefined);
        var responseData = markerOperationModeFactory.operationMode.openedResponseDetails(responseStore.instance.selectedDisplayId.toString());
        var currentPageZones = unManagedZones ? unManagedZones.filter(function (x) { return x.pageNo === pageNo; }) : undefined;
        var hasUnmanaged = false;
        var annotationDetails;
        if (currentPageZones) {
            currentPageZones.forEach(function (item) {
                annotationDetails = annotationHelper.getAnnotationsInAdditionalObjectByPageNo(item.pageNo, markerOperationModeFactory.operationMode.isStandardisationSetupMode ?
                    responseData.esMarkGroupId : responseData.markGroupId);
                // if the page is not annotated then return true
                if (annotationDetails.count() === 0) {
                    hasUnmanaged = true;
                }
                else {
                    hasUnmanaged = false;
                }
            });
        }
        return hasUnmanaged;
    };
    /**
     * returns the page number for ebookmarking remark responses having unmanaged imagez zones for the given page.
     */
    ResponseHelper.findFirstUnknownContentPage = function () {
        var imageZones = imagezoneStore.instance.currentCandidateScriptImageZone;
        var unManagedZones = (imageZones ? imageZones.filter(function (x) { return x.docStorePageQuestionTagTypeId === 4; }) : undefined);
        var hasUnmanaged = false;
        var pageNumbers = [];
        if (unManagedZones) {
            unManagedZones.forEach(function (item) {
                pageNumbers.push(item.pageNo);
            });
        }
        return Math.min.apply(null, pageNumbers);
    };
    Object.defineProperty(ResponseHelper, "isMbQSelected", {
        /**
         *  Checking whether is mark by question is selected for the response.
         * @returns True if MBQ has selected or viceversa
         */
        get: function () {
            // If response is Atypical we are treating response as unstructured including structured response.
            // So return as not MBQ.
            if (ResponseHelper.isAtypicalResponse()) {
                return false;
            }
            var userOption = userOptionsHelper.getUserOptionByName(userOptionKeys.IS_MBQ_SELECTED, qigStore.instance.selectedQIGForMarkerOperation.examinerRoleId);
            return userOption === 'true';
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ResponseHelper, "CurrentMarkingMethod", {
        /**
         * Gets a value indicating the current marking method.
         * @returns
         */
        get: function () {
            return responseStore.instance.markingMethod;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ResponseHelper, "isSeedResponse", {
        /* return true if the current response is seed */
        get: function () {
            return ResponseHelper.isClosedEurSeed || ResponseHelper.isClosedLiveSeed;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Checking whether the response marking is enabled my mark by annotation.
     * @param {boolean} isAtypical
     * @returns
     */
    ResponseHelper.isMarkByAnnotation = function (atypicalStatus) {
        if (atypicalStatus === enums.AtypicalStatus.AtypicalUnscannable) {
            return false;
        }
        return this.isMarkByAnnotationCCActive;
    };
    Object.defineProperty(ResponseHelper, "isMarkByAnnotationCCActive", {
        /**
         * Get MarkByAnnotation CC value.
         */
        get: function () {
            var qigId = qigStore.instance.selectedQIGForMarkerOperation !== undefined ?
                qigStore.instance.selectedQIGForMarkerOperation.markSchemeGroupId : 0;
            return configurableCharacteristicsHelper.getCharacteristicValue(configurableCharacteristicsNames.MarkbyAnnotation, qigId) === 'true';
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ResponseHelper, "isEbookMarking", {
        /**
         * Get EBookmarking CC value.
         */
        get: function () {
            return configurableCharacteristicsHelper.getExamSessionCCValue(configurableCharacteristicsNames.eBookmarking, qigStore.instance.selectedQIGForMarkerOperation.examSessionId)
                .toLowerCase() === 'true' && !this.isAtypicalResponse() ? true : false;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ResponseHelper, "isOverlayAnnotationsVisible", {
        /**
         * Get whether we need to show ovarlays in toolbar panel.
         */
        get: function () {
            return !(configurableCharacteristicsHelper.getExamSessionCCValue(configurableCharacteristicsNames.eBookmarking, qigStore.instance.selectedQIGForMarkerOperation.examSessionId)
                .toLowerCase() === 'true') ? true : false;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ResponseHelper, "isEResponse", {
        /**
         * Get eResponse CC value.
         */
        get: function () {
            var ccValue = configurableCharacteristicsHelper.getExamSessionCCValue(configurableCharacteristicsNames.eResponse, qigStore.instance.selectedQIGForMarkerOperation.examSessionId);
            if (ccValue && ccValue !== '') {
                return true;
            }
            else {
                return false;
            }
        },
        enumerable: true,
        configurable: true
    });
    ResponseHelper._firstSLAOPageNumber = 0;
    ResponseHelper._hasAdditionalObject = false;
    return ResponseHelper;
}());
module.exports = ResponseHelper;
//# sourceMappingURL=responsehelper.js.map