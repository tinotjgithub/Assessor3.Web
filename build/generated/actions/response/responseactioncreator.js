"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var dispatcher = require('../../app/dispatcher');
var responseOpenAction = require('./responseopenaction');
var responseDataService = require('../../dataservices/response/responsedataservice');
var responseAllocateAction = require('./responseallocateaction');
var retrieveMarksAction = require('../marking/retrievemarksaction');
var scrollPositionChangedAction = require('./scrollpositionchangedaction');
var responseViewModeChangedAction = require('./responseviewmodechangedaction');
var scrollDataResetAction = require('./scrolldataresetaction');
var fracsDataSetAction = require('./fracsdatasetaction');
var findVisibleImageAction = require('./findvisibleimageidaction');
var updateMousePositionAction = require('./updatemousepositionaction');
var allocateArgument = require('../../dataservices/response/allocateargument');
var retrieveMarksArgument = require('../../dataservices/response/retrievemarksargument');
var enums = require('../../components/utility/enums');
var Promise = require('es6-promise');
var saveMarksAndAnnotationsAction = require('./savemarksandannotationsaction');
var atypicalResponseSearchAction = require('./atypicalresponsesearchaction');
var atypicalSearchMarkNowAction = require('./atypicalsearchmarknowaction');
var atypicalSearchMoveToWorklistAction = require('./atypicalsearchmovetoworklistaction');
var triggerSavingMarksAndAnnotationsAction = require('./triggersavingmarksandannotationsaction');
var nonRecoverableErrorAction = require('./setnonrecoverableerroraction');
var clearMarksAndAnnotationsAction = require('./clearmarksandannotationsaction');
var fullResponseViewOptionChangedAction = require('./fullresponseviewoptionchangedaction');
var updatePageNumberIndicatorAction = require('./updatepagenumberindicatoraction');
var updatePageNumberIndicatorOnZoomAction = require('./updatepagenumberindicatoronzoomaction');
var responseImageRotated = require('./responseimagerotatedaction');
var updateDisplayAngleOfRotation = require('./updatedisplayangleofresponseaction');
var responseDataGetAction = require('./responsedatagetaction');
var base = require('../base/actioncreatorbase');
var updateWavyAction = require('../../actions/response/updatewavyaction');
var setImageZonesForPageNoAction = require('./setimagezonesforpagenoaction');
var refreshImageRotationSettingsAction = require('./refreshimagerotationsettingsaction');
var setFractionDataForImageLoadedAction = require('./setfracsdataforimageloadedaction');
var responseIdRenderedAction = require('./responseidrenderedaction');
var structuredFracsDataSetAction = require('./structuredfracsdatasetaction');
var supervisorRemarkCheckAction = require('../teammanagement/supervisorremarkcheckaction');
var createRemarkAction = require('./createremarkaction');
var unmanagedSlaoFlagAsSeenAction = require('./unmanagedslaoflagasseenaction');
var promoteToSeedAction = require('./promotetoseedaction');
var rejectRigConfirmedAction = require('./rejectrigconfirmedaction');
var rejectRigPopupDisplayAction = require('./rejectrigpopupdisplayaction');
var rejectRigCompletedAction = require('./rejectrigcompletedaction');
var updateResponseCollectionAction = require('./updateresponseaction');
var promoteToSeedCheckRemarkAction = require('./promotetoseedcheckremarkaction');
var supervisorRemarkVisibilityAction = require('./supervisorremarkvisibilityaction');
var navigateAfterSubmitAction = require('./navigateaftersubmitaction');
var viewWholePageLinkAction = require('./viewwholepagelinkaction');
var promoteToReuseBucketAction = require('./promotetoreusebucketaction');
var setBookmarkPreviousScrollDataAction = require('./setbookmarkpreviousscrolldataaction');
var validateResponseAction = require('./validateresponseaction');
var fullResponseViewScrollAction = require('./fullresponseviewscrollaction');
var frvToggleButtonAction = require('./frvtoggleaction');
/**
 * Class for creating Response Action Creator
 */
var ResponseActionCreator = (function (_super) {
    __extends(ResponseActionCreator, _super);
    function ResponseActionCreator() {
        _super.apply(this, arguments);
    }
    /**
     * Opens the Response
     * @param displayId
     * @param responseNavigation
     * @param responseMode
     * @param markGroupId
     * @param responseViewMode
     * @param triggerPoint
     * @param sampleReviewCommentId
     * @param sampleReviewCommentCreatedBy
     * @param isWholeResponse
     */
    ResponseActionCreator.prototype.openResponse = function (displayId, responseNavigation, responseMode, markGroupId, responseViewMode, triggerPoint, sampleReviewCommentId, sampleReviewCommentCreatedBy, isWholeResponse) {
        if (triggerPoint === void 0) { triggerPoint = enums.TriggerPoint.None; }
        if (sampleReviewCommentId === void 0) { sampleReviewCommentId = enums.SampleReviewComment.None; }
        if (sampleReviewCommentCreatedBy === void 0) { sampleReviewCommentCreatedBy = 0; }
        if (isWholeResponse === void 0) { isWholeResponse = false; }
        new Promise.Promise(function (resolve, reject) {
            resolve();
        }).then(function () {
            dispatcher.dispatch(new responseOpenAction(true, displayId, responseNavigation, responseMode, markGroupId, responseViewMode, triggerPoint, null, sampleReviewCommentId, sampleReviewCommentCreatedBy, isWholeResponse));
        }).catch();
    };
    /**
     * Allocates a new Response
     * @param {number} examinerRoleId examiner Role ID
     * @param {number} markSchemeGroupId mark scheme group id
     * @param {enums.WorklistType} workListType worklist Type
     * @param {boolean} isConcurrentDownload is concurrent download
     * @param {number} examSessionId exam Session Id
     * @param {boolean} isPE is PE
     * @param {boolean} isElectronicStandardisationTeamMember is Electronic Standardisation Team Member
     * Added the below variables to add the parameters for remark allocation
     * @param examinerId stores the examiner id
     * @param isCandidatePrioritisationCCON checks whether candidate prioritisation cc is on or not
     * @param remarkRequestType stores the remark request type id
     */
    ResponseActionCreator.prototype.allocateResponse = function (examinerRoleId, markSchemeGroupId, workListType, isConcurrentDownload, examSessionId, isPE, isElectronicStandardisationTeamMember, examinerId, isCandidatePrioritisationCCON, isQualityRemarkCCEnabled, remarkRequestType, isWholeResponseDownload) {
        var that = this;
        var args = new allocateArgument(examinerRoleId, markSchemeGroupId, workListType, isConcurrentDownload, examSessionId, isPE, isElectronicStandardisationTeamMember, examinerId, isCandidatePrioritisationCCON, isQualityRemarkCCEnabled, remarkRequestType, false, null, isWholeResponseDownload);
        responseDataService.allocateResponse(args, function (data, success) {
            // This will validate the call to find any network failure
            // and is mandatory to add this.
            if (that.validateCall(data, true)) {
                dispatcher.dispatch(new responseAllocateAction(data, success, isWholeResponseDownload));
            }
        });
    };
    /**
     * Search for an atypical response
     * @param {SearchAtypicalResponseArgument} searchAtypicalResponseArgument search atypical response parameter
     */
    ResponseActionCreator.prototype.searchAtypicalResponse = function (searchAtypicalResponseArgument) {
        var that = this;
        responseDataService.SearchAtypicalResponse(searchAtypicalResponseArgument, function (data, success) {
            if (that.validateCall(data, true)) {
                dispatcher.dispatch(new atypicalResponseSearchAction(data, success));
            }
        });
    };
    /**
     * Open atypical response.
     */
    ResponseActionCreator.prototype.markNowAtypicalResponse = function (examinerRoleId, markSchemeGroupId, workListType, isConcurrentDownload, examSessionId, isPE, isElectronicStandardisationTeamMember, examinerId, isCandidatePrioritisationCCON, remarkRequestType, isAtypical, candidateScript) {
        var that = this;
        var args = new allocateArgument(examinerRoleId, markSchemeGroupId, workListType, isConcurrentDownload, examSessionId, isPE, isElectronicStandardisationTeamMember, examinerId, isCandidatePrioritisationCCON, false, remarkRequestType, isAtypical, candidateScript);
        responseDataService.allocateResponse(args, function (data, success) {
            // This will validate the call to find any network failure
            // and is mandatory to add this.
            if (that.validateCall(data, true)) {
                dispatcher.dispatch(new atypicalSearchMarkNowAction(data, success));
            }
        });
    };
    /**
     * Download and move atypical response to worklist.
     */
    ResponseActionCreator.prototype.moveAtypicalResponseToWorklist = function (examinerRoleId, markSchemeGroupId, workListType, isConcurrentDownload, examSessionId, isPE, isElectronicStandardisationTeamMember, examinerId, isCandidatePrioritisationCCON, remarkRequestType, isAtypical, candidateScript) {
        var that = this;
        var args = new allocateArgument(examinerRoleId, markSchemeGroupId, workListType, isConcurrentDownload, examSessionId, isPE, isElectronicStandardisationTeamMember, examinerId, isCandidatePrioritisationCCON, false, remarkRequestType, isAtypical, candidateScript);
        responseDataService.allocateResponse(args, function (data, success) {
            // This will validate the call to find any network failure
            // and is mandatory to add this.
            if (that.validateCall(data, true)) {
                dispatcher.dispatch(new atypicalSearchMoveToWorklistAction(data, success));
            }
        });
    };
    /**
     * Retrieve the Marks and Annotations for the RIG
     * @param markGroupId current mark group ID
     * @param markingMode current marking
     * @param candidateScriptId candidate Script ID
     * @param isPEOrAPE is PE or APE
     * @param priority priority
     * @param bookMarkFetchType Bookmark Type
     */
    ResponseActionCreator.prototype.retrieveMarksAndAnnotations = function (markGroupIds, currentMarkGroupId, markingMode, candidateScriptId, isPEOrAPE, remarkRequestType, isBlindPracticeMarkingOn, subExaminerId, examinerId, priority, bookMarkFetchType, isWholeResponseMarking) {
        if (remarkRequestType === void 0) { remarkRequestType = enums.RemarkRequestType.Unknown; }
        if (priority === void 0) { priority = enums.Priority.First; }
        var that = this;
        // The arugument entity is ported from WA, the properties which are not required now are hardcoded.
        var arg = new retrieveMarksArgument(markGroupIds, isWholeResponseMarking, enums.MarkingMode[markingMode], 0, false, false, candidateScriptId, false, false, false, 0, false, isPEOrAPE, remarkRequestType, isBlindPracticeMarkingOn, subExaminerId, examinerId, false, false, bookMarkFetchType);
        responseDataService.retrieveMarksAndAnnotations(arg, currentMarkGroupId, priority, function (data, success) {
            // This will validate the call to find any network failure
            // and is mandatory to add this.
            var successCall = that.validateCall(data, true);
            dispatcher.dispatch(new retrieveMarksAction(data, successCall, currentMarkGroupId));
        });
    };
    /**
     * This method will save marks and annotations.
     * @param arg
     * @param priority
     */
    ResponseActionCreator.prototype.saveMarksAndAnnotations = function (arg, priority, saveMarksAndAnnotationTriggeringPoint) {
        if (priority === void 0) { priority = enums.Priority.First; }
        if (saveMarksAndAnnotationTriggeringPoint === void 0) { saveMarksAndAnnotationTriggeringPoint = enums.SaveMarksAndAnnotationsProcessingTriggerPoint.BackgroundWorker; }
        responseDataService.saveMarksAndAnnotations(arg, priority, function (data, success) {
            dispatcher.dispatch(new saveMarksAndAnnotationsAction(data, arg.markGroupId, saveMarksAndAnnotationTriggeringPoint, success, enums.DataServiceRequestErrorType.None, arg.isWholeResponseMarking));
        }, function (data, success, dataServiceRequestErrorType) {
            dispatcher.dispatch(new saveMarksAndAnnotationsAction(null, arg.markGroupId, saveMarksAndAnnotationTriggeringPoint, success, dataServiceRequestErrorType, arg.isWholeResponseMarking));
        });
    };
    /**
     * This method will trigger the saving of marks and annotation
     * @param saveMarksAndAnnotationTriggeringPoint
     */
    ResponseActionCreator.prototype.triggerSavingMarksAndAnnotations = function (saveMarksAndAnnotationTriggeringPoint) {
        if (saveMarksAndAnnotationTriggeringPoint === void 0) { saveMarksAndAnnotationTriggeringPoint = enums.SaveMarksAndAnnotationsProcessingTriggerPoint.BackgroundWorker; }
        new Promise.Promise(function (resolve, reject) {
            resolve();
        }).then(function () {
            dispatcher.dispatch(new triggerSavingMarksAndAnnotationsAction(saveMarksAndAnnotationTriggeringPoint, true));
        }).catch();
    };
    /**
     * This action will set a non-recoverable error.
     * @param markGroupId
     */
    ResponseActionCreator.prototype.setNonRecoverableError = function (markGroupId) {
        new Promise.Promise(function (resolve, reject) {
            resolve();
        }).then(function () {
            dispatcher.dispatch(new nonRecoverableErrorAction(markGroupId, true));
        }).catch();
    };
    /**
     * clear marks and annotations against a mark groupId for reloading.
     * @param markGroupId
     */
    ResponseActionCreator.prototype.clearMarksAndAnnotations = function (markGroupId) {
        new Promise.Promise(function (resolve, reject) {
            resolve();
        }).then(function () {
            responseDataService.removeMarksAndAnnotationsRequestsQueueItem(markGroupId);
            dispatcher.dispatch(new clearMarksAndAnnotationsAction(markGroupId, true));
        }).catch();
    };
    /**
     * This method will call while response mode is changed in response screen
     */
    ResponseActionCreator.prototype.changeResponseViewMode = function (responseViewMode, doResetFracs, isImageFile, pageNo) {
        if (isImageFile === void 0) { isImageFile = true; }
        if (pageNo === void 0) { pageNo = 0; }
        new Promise.Promise(function (resolve, reject) {
            resolve();
        }).then(function () {
            dispatcher.dispatch(new responseViewModeChangedAction(true, responseViewMode, doResetFracs, isImageFile, pageNo));
        }).catch();
    };
    /**
     * This method will set current scroll position or reset the current scroll data.
     * @param currentScrollPosition
     * @param doEmit
     * @param updateScrollPosition
     */
    ResponseActionCreator.prototype.setCurrentScrollPosition = function (currentScrollPosition, doEmit, updateScrollPosition) {
        if (doEmit === void 0) { doEmit = false; }
        if (updateScrollPosition === void 0) { updateScrollPosition = true; }
        new Promise.Promise(function (resolve, reject) {
            resolve();
        }).then(function () {
            dispatcher.dispatch(new scrollPositionChangedAction(true, currentScrollPosition, doEmit, updateScrollPosition));
        }).catch();
    };
    /**
     * Method to update the mouse pointer position during mouse move and drag events.
     * @param {number} xPosition
     * @param {number} yPosition
     */
    ResponseActionCreator.prototype.setMousePosition = function (xPosition, yPosition) {
        new Promise.Promise(function (resolve, reject) {
            resolve();
        }).then(function () {
            dispatcher.dispatch(new updateMousePositionAction(xPosition, yPosition));
        });
    };
    /**
     * This method will reset the current scroll data.
     */
    ResponseActionCreator.prototype.resetScrollData = function () {
        new Promise.Promise(function (resolve, reject) {
            resolve();
        }).then(function () {
            dispatcher.dispatch(new scrollDataResetAction(true));
        }).catch();
    };
    /**
     * This method will set the fracs data value.
     * @param triggerScrollEvent Indicate to emit action FRACS_DATA_LOADED
     */
    ResponseActionCreator.prototype.setFracsData = function (fracsData, triggerScrollEvent, structuredFracsDataLoaded, fracsDataSource) {
        if (triggerScrollEvent === void 0) { triggerScrollEvent = false; }
        if (structuredFracsDataLoaded === void 0) { structuredFracsDataLoaded = false; }
        new Promise.Promise(function (resolve, reject) {
            resolve();
        }).then(function () {
            dispatcher.dispatch(new fracsDataSetAction(true, fracsData, triggerScrollEvent, structuredFracsDataLoaded, fracsDataSource));
        }).catch();
    };
    /**
     * This method will find the active image container Id.
     * @param doEmit
     */
    ResponseActionCreator.prototype.findVisibleImageId = function (doEmit, fracsDataSource) {
        if (doEmit === void 0) { doEmit = false; }
        new Promise.Promise(function (resolve, reject) {
            resolve();
        }).then(function () {
            dispatcher.dispatch(new findVisibleImageAction(doEmit, fracsDataSource));
        }).catch();
    };
    /**
     * this method will update the current full response view option.
     */
    ResponseActionCreator.prototype.fullResponseViewOptionChanged = function (fullResponseViewOption) {
        new Promise.Promise(function (resolve, reject) {
            resolve();
        }).then(function () {
            dispatcher.dispatch(new fullResponseViewOptionChangedAction(true, fullResponseViewOption));
        }).catch();
    };
    /**
     * This method updates the most visible page no while scrolling.
     */
    ResponseActionCreator.prototype.updatePageNoIndicator = function (pageNo, imageNo, isBookletView) {
        new Promise.Promise(function (resolve, reject) {
            resolve();
        }).then(function () {
            dispatcher.dispatch(new updatePageNumberIndicatorAction(pageNo, imageNo, isBookletView));
        });
    };
    /**
     * This method updates the page number indicator when zoom in/zomm out
     */
    ResponseActionCreator.prototype.updatePageNoIndicatorOnZoom = function () {
        new Promise.Promise(function (resolve, reject) {
            resolve();
        }).then(function () {
            dispatcher.dispatch(new updatePageNumberIndicatorOnZoomAction());
        });
    };
    /**
     * Update the rotated images height on zoom.
     * @param {boolean} hasRotatedImages
     */
    ResponseActionCreator.prototype.responseImageRotated = function (hasRotatedImages, rotatedImages) {
        if (rotatedImages === void 0) { rotatedImages = []; }
        new Promise.Promise(function (resolve, reject) {
            resolve();
        }).then(function () {
            dispatcher.dispatch(new responseImageRotated(hasRotatedImages, rotatedImages));
        });
    };
    /**
     * This method updates the display angle of the response page.
     */
    ResponseActionCreator.prototype.updateDisplayAngleOfResponse = function (reset, displayAngle, responseId) {
        new Promise.Promise(function (resolve, reject) {
            resolve();
        }).then(function () {
            dispatcher.dispatch(new updateDisplayAngleOfRotation(displayAngle, responseId, reset));
        });
    };
    /**
     * Get the Response details
     * @param displayId
     * @param markGroupId
     * @param esMarkGroupId
     */
    ResponseActionCreator.prototype.getResponseDetails = function (displayId, markGroupId, esMarkGroupId, markSchemeGroupId, msgId, candidateScriptId, examinerId, isElectronicStandardisationTeamMember, isTeamManagement) {
        var that = this;
        new Promise.Promise(function (resolve, reject) {
            resolve();
        }).then(function () {
            var displayIdWithoutPrefex = displayId.substring(1, displayId.length); // Remove prfix '6'
            responseDataService.getResponseDetails(displayIdWithoutPrefex, markGroupId, esMarkGroupId, candidateScriptId, function (data, success) {
                that.validateCall(data, false, true);
                data.displayId = displayId;
                data.markSchemeGroupId = markSchemeGroupId;
                data.markGroupId = markGroupId;
                data.esMarkGroupId = esMarkGroupId;
                data.messageId = msgId;
                data.loggedInExaminerId = examinerId;
                data.isElectronicStandardisationTeamMember = isElectronicStandardisationTeamMember;
                data.triggerPoint = enums.TriggerPoint.AssociatedDisplayIDFromMessage;
                data.isTeamManagement = isTeamManagement;
                dispatcher.dispatch(new responseDataGetAction(data, success));
            });
        });
    };
    /**
     * Update WavyAnnotations ViewMode Changed
     */
    ResponseActionCreator.prototype.updateWavyAnnotationsViewModeChanged = function () {
        new Promise.Promise(function (resolve, reject) {
            resolve();
        }).then(function () {
            dispatcher.dispatch(new updateWavyAction());
        });
    };
    /**
     * Set Image zones against a page number
     * @param {Immutable.List<ImageZone>} imageZones
     */
    ResponseActionCreator.prototype.imageZonesAgainstPageNumber = function (imageZones, linkedAnnotations) {
        new Promise.Promise(function (resolve, reject) {
            resolve();
        }).then(function () {
            dispatcher.dispatch(new setImageZonesForPageNoAction(imageZones, linkedAnnotations));
        });
    };
    /**
     * On loading new response/navigating from full response view
     * refresh the rotated image settings.
     * This will add rotate class and set the rotation class as well
     */
    ResponseActionCreator.prototype.refreshImageRotationSettings = function () {
        new Promise.Promise(function (resolve, reject) {
            resolve();
        }).then(function () {
            dispatcher.dispatch(new refreshImageRotationSettingsAction());
        });
    };
    /**
     * Set fracs data for response image loaded
     */
    ResponseActionCreator.prototype.setFracsDataForImageLoaded = function () {
        new Promise.Promise(function (resolve, reject) {
            resolve();
        }).then(function () {
            dispatcher.dispatch(new setFractionDataForImageLoadedAction());
        }).catch();
    };
    /**
     * Render breadcrumb after loading responseID in response header
     */
    ResponseActionCreator.prototype.reRenderBreadCrumbAfterLoadingResponseID = function () {
        new Promise.Promise(function (resolve, reject) {
            resolve();
        }).then(function () {
            dispatcher.dispatch(new responseIdRenderedAction());
        });
    };
    /**
     * Set the Response details in stores for setting the values.
     * @param data
     */
    ResponseActionCreator.prototype.setResponseDetails = function (data) {
        new Promise.Promise(function (resolve, reject) {
            resolve();
        }).then(function () {
            dispatcher.dispatch(new responseDataGetAction(data, true));
        });
    };
    /**
     * Set fracs data for structured images
     */
    ResponseActionCreator.prototype.structuredFracsDataSet = function (source) {
        new Promise.Promise(function (resolve, reject) {
            resolve();
        }).then(function () {
            dispatcher.dispatch(new structuredFracsDataSetAction(source));
        }).catch();
    };
    /**
     * Get the Response details
     * @param displayId
     * @param markGroupId
     * @param esMarkGroupId
     */
    ResponseActionCreator.prototype.getResponseDetailsForSupervisorRemark = function (candidateScriptId, markSchemeGroupId, selectedExaminerId, isWholeResponse) {
        var that = this;
        return new Promise.Promise(function (resolve, reject) {
            responseDataService.getResponseDetailsForSupervisorRemark(candidateScriptId, markSchemeGroupId, selectedExaminerId, isWholeResponse, function (supervisorRemarkValidationReturn, success) {
                if (that.validateCall(supervisorRemarkValidationReturn, false, true, enums.WarningMessageAction.SuperVisorRemarkCheck)) {
                    if (!success) {
                        supervisorRemarkValidationReturn = undefined;
                    }
                    dispatcher.dispatch(new supervisorRemarkCheckAction(supervisorRemarkValidationReturn));
                    resolve(supervisorRemarkValidationReturn);
                }
                else {
                    reject(null);
                }
            });
        });
    };
    /**
     * Action creator to create a supervisor remark
     * @param {RequestRemarkArguments} requestRemarkArguments
     * @param {boolean} isMarkNowButtonClicked
     */
    ResponseActionCreator.prototype.createSupervisorRemark = function (requestRemarkArguments, isMarkNowButtonClicked) {
        var that = this;
        return new Promise.Promise(function (resolve, reject) {
            responseDataService.createSupervisorRemark(requestRemarkArguments, function (success, requestRemarkReturn) {
                // This will validate the call to find any network failure
                // and is mandatory to add this.
                if (that.validateCall(requestRemarkReturn, false, true)) {
                    if (!success) {
                        requestRemarkReturn = undefined;
                    }
                    dispatcher.dispatch(new createRemarkAction(requestRemarkReturn, isMarkNowButtonClicked));
                    resolve(requestRemarkReturn);
                }
                else {
                    reject(null);
                }
            });
        });
    };
    /**
     * Action creator to promote a response to seed.
     * @param {promoteToSeedArgs} promote to seed arguments
     */
    ResponseActionCreator.prototype.promoteToSeed = function (promoteToSeedArgs) {
        var that = this;
        return new Promise.Promise(function (resolve, reject) {
            responseDataService.promoteToSeed(promoteToSeedArgs, function (success, promoteToSeedReturn) {
                // This will validate the call to find any network failure
                // and is mandatory to add this.
                if (that.validateCall(promoteToSeedReturn, false, true)) {
                    if (!success) {
                        promoteToSeedReturn = undefined;
                    }
                    dispatcher.dispatch(new promoteToSeedAction(success, promoteToSeedReturn));
                    resolve(promoteToSeedReturn);
                }
                else {
                    reject(null);
                }
            });
        });
    };
    /**
     * dispatche slao flag as seen stamping action.
     * @param pageNumber
     */
    ResponseActionCreator.prototype.doStampFlagAsSeenAnnotation = function (pageNumber) {
        new Promise.Promise(function (resolve, reject) {
            resolve();
        }).then(function () {
            dispatcher.dispatch(new unmanagedSlaoFlagAsSeenAction(pageNumber));
        }).catch();
    };
    /**
     * Action creator for reject rig.
     * @param rejectRigArgument
     */
    ResponseActionCreator.prototype.rejectRig = function (rejectRigArgument, isNextResponseAvailable) {
        var that = this;
        return new Promise.Promise(function (resolve, reject) {
            responseDataService.RejectRig(rejectRigArgument, function (success, rejectRigReturn) {
                if (that.validateCall(rejectRigReturn)) {
                    if (success) {
                        dispatcher.dispatch(new rejectRigCompletedAction(success, isNextResponseAvailable));
                    }
                    resolve(rejectRigReturn);
                }
                else {
                    reject(null);
                }
            });
        });
    };
    /**
     * Dispatch action to reject response.
     * @param displayId
     */
    ResponseActionCreator.prototype.doRejectResponse = function (displayId) {
        new Promise.Promise(function (resolve, reject) {
            resolve();
        }).then(function () {
            dispatcher.dispatch(new rejectRigConfirmedAction(displayId));
        }).catch();
    };
    /**
     * Dispatch action to display reject rig pop up
     */
    ResponseActionCreator.prototype.showRejectRigConfirmation = function () {
        new Promise.Promise(function (resolve, reject) {
            resolve();
        }).then(function () {
            dispatcher.dispatch(new rejectRigPopupDisplayAction);
        }).catch();
    };
    /**
     * dispatch action for response collection updation.
     * @param markGroupId
     * @param worklistType
     */
    ResponseActionCreator.prototype.updateResponseCollection = function (markGroupId, worklistType) {
        new Promise.Promise(function (resolve, reject) {
            resolve();
        }).then(function () {
            dispatcher.dispatch(new updateResponseCollectionAction(markGroupId, worklistType));
        }).catch();
    };
    /**
     * Action creator to get remark details before promoting a response to seed.
     * @param {promoteToSeedArgs} promote to seed arguments
     */
    ResponseActionCreator.prototype.getRemarkDetailsForPromoteToSeed = function (promoteToSeedArgs) {
        var that = this;
        return new Promise.Promise(function (resolve, reject) {
            responseDataService.promoteToSeedCheckRemark(promoteToSeedArgs, function (success, promoteToSeedReturn) {
                // This will validate the call to find any network failure
                // and is mandatory to add this.
                if (that.validateCall(promoteToSeedReturn, false, true, enums.WarningMessageAction.PromoteToSeed)) {
                    if (!success) {
                        promoteToSeedReturn = undefined;
                    }
                    dispatcher.dispatch(new promoteToSeedCheckRemarkAction(success, promoteToSeedReturn));
                    resolve(promoteToSeedReturn);
                }
                else {
                    reject(null);
                }
            });
        });
    };
    /**
     * Method to show or hide supervisor remark button.
     * @param isVisible
     */
    ResponseActionCreator.prototype.doVisibleSupervisorRemarkButton = function (isVisible) {
        new Promise.Promise(function (resolve, reject) {
            resolve();
        }).then(function () {
            dispatcher.dispatch(new supervisorRemarkVisibilityAction(isVisible));
        }).catch();
    };
    /**
     * Inform other modules the submission completed
     *
     * @param {Array<number>} submittedMarkGroupIds
     * @memberof ResponseActionCreator
     */
    ResponseActionCreator.prototype.navigateAfterSubmit = function (submittedMarkGroupIds, selectedDisplayId, fromMarkScheme) {
        new Promise.Promise(function (resolve, reject) {
            resolve();
        }).then(function () {
            dispatcher.dispatch(new navigateAfterSubmitAction(submittedMarkGroupIds, selectedDisplayId, fromMarkScheme));
        }).catch();
    };
    /**
     * Action creator to promote closed live response to reuse bucket
     * @param {promoteToReuseArguments} promote to reusebucket arguments
     */
    ResponseActionCreator.prototype.promoteToReuseBucket = function (promoteToReuseArguments) {
        var that = this;
        return new Promise.Promise(function (resolve, reject) {
            responseDataService.promoteToReuseBucket(promoteToReuseArguments, function (success, isResponsePromotedToReuseBucket) {
                // This will validate the call to find any network failure
                // and is mandatory to add this.
                if (that.validateCall(isResponsePromotedToReuseBucket, false, true, enums.WarningMessageAction.PromoteToReuseBucket)) {
                    if (!success) {
                        isResponsePromotedToReuseBucket = undefined;
                    }
                    resolve(isResponsePromotedToReuseBucket);
                }
                else {
                    success = false;
                    isResponsePromotedToReuseBucket = undefined;
                    reject(null);
                }
                dispatcher.dispatch(new promoteToReuseBucketAction(success, isResponsePromotedToReuseBucket, promoteToReuseArguments.markGroupId));
            });
        });
    };
    /**
     * Method to show or hide the view Whole page button, for zones in marking screen.
     * @param isCursorInsideScript
     */
    ResponseActionCreator.prototype.viewWholePageLinkAction = function (isCursorInsideScript, activeImageZone) {
        new Promise.Promise(function (resolve, reject) {
            resolve();
        }).then(function () {
            dispatcher.dispatch(new viewWholePageLinkAction(isCursorInsideScript, activeImageZone));
        }).catch();
    };
    /**
     * Action to set bookmark previous scroll data
     */
    ResponseActionCreator.prototype.setBookmarkPreviousScrollData = function (bookmarkPreviousScrollData) {
        new Promise.Promise(function (resolve, reject) {
            resolve();
        }).then(function () {
            dispatcher.dispatch(new setBookmarkPreviousScrollDataAction(bookmarkPreviousScrollData));
        }).catch();
    };
    /**
     * Action to validate response
     */
    ResponseActionCreator.prototype.validateResponse = function (markGroupId, markSchemeGroupId, examinerRoleId) {
        var that = this;
        return new Promise.Promise(function (resolve, reject) {
            responseDataService.validateResponse(markGroupId, markSchemeGroupId, examinerRoleId, function (success, validateResponseReturnData) {
                if (that.validateCall(validateResponseReturnData)) {
                    if (success) {
                        dispatcher.dispatch(new validateResponseAction(validateResponseReturnData, success, false));
                    }
                    resolve(validateResponseReturnData);
                }
                else {
                    reject(null);
                }
            });
        });
    };
    /**
     * Action to validate, whether the scipt is withdrawn seed.
     * @param candidateScriptID
     * @param markSchemeGroupdId
     */
    ResponseActionCreator.prototype.validateCentreScriptResponse = function (candidateScriptID, markSchemeGroupdId) {
        var that = this;
        return new Promise.Promise(function (resolve, reject) {
            responseDataService.validateCentreScriptResponse(candidateScriptID, markSchemeGroupdId, function (success, validateResponseReturnData) {
                if (that.validateCall(validateResponseReturnData)) {
                    if (success) {
                        dispatcher.dispatch(new validateResponseAction(validateResponseReturnData, success, true));
                    }
                    resolve(validateResponseReturnData);
                }
                else {
                    reject(null);
                }
            });
        });
    };
    /**
     * Action to set scroll position to the first unknown content page of remark
     */
    ResponseActionCreator.prototype.setPageScrollInFRV = function () {
        new Promise.Promise(function (resolve, reject) {
            resolve();
        }).then(function () {
            dispatcher.dispatch(new fullResponseViewScrollAction());
        }).catch();
    };
    /**
     * Action to hide page option button on toggle.
     */
    ResponseActionCreator.prototype.hidePageOptionButton = function () {
        new Promise.Promise(function (resolve, reject) {
            resolve();
        }).then(function () {
            dispatcher.dispatch(new frvToggleButtonAction());
        }).catch();
    };
    return ResponseActionCreator;
}(base));
var responseOpenCreator = new ResponseActionCreator();
module.exports = responseOpenCreator;
//# sourceMappingURL=responseactioncreator.js.map