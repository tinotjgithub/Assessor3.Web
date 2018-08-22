import dispatcher = require('../../app/dispatcher');
import responseOpenAction = require('./responseopenaction');
import responseDataService = require('../../dataservices/response/responsedataservice');
import responseAllocateAction = require('./responseallocateaction');
import retrieveMarksAction = require('../marking/retrievemarksaction');
import scrollPositionChangedAction = require('./scrollpositionchangedaction');
import responseViewModeChangedAction = require('./responseviewmodechangedaction');
import scrollDataResetAction = require('./scrolldataresetaction');
import fracsDataSetAction = require('./fracsdatasetaction');
import findVisibleImageAction = require('./findvisibleimageidaction');
import updateMousePositionAction = require('./updatemousepositionaction');
import allocateArgument = require('../../dataservices/response/allocateargument');
import atypicalresponsesearchresult = require('../../dataservices/response/atypicalresponsesearchresult');
import retrieveMarksArgument = require('../../dataservices/response/retrievemarksargument');
import allocatedResponseData = require('../../stores/response/typings/allocatedresponsedata');
import examinerMarkData = require('../../stores/response/typings/examinermarkdata');
import enums = require('../../components/utility/enums');
import Promise = require('es6-promise');
import saveMarksAndAnnotationsAction = require('./savemarksandannotationsaction');
import atypicalResponseSearchAction = require('./atypicalresponsesearchaction');
import atypicalSearchMarkNowAction = require('./atypicalsearchmarknowaction');
import atypicalSearchMoveToWorklistAction = require('./atypicalsearchmovetoworklistaction');
import saveMarksAndAnnotationsArgument = require('../../dataservices/response/savemarksandannotationsargument');
import saveMarksAndAnnotationsReturn = require('../../stores/marking/typings/savemarksandannotationsreturn');
import triggerSavingMarksAndAnnotationsAction = require('./triggersavingmarksandannotationsaction');
import marksAndAnnotationsSaveHelper = require('../../utility/marking/marksandannotationssavehelper');
import nonRecoverableErrorAction = require('./setnonrecoverableerroraction');
import clearMarksAndAnnotationsAction = require('./clearmarksandannotationsaction');
import fullResponseViewOptionChangedAction = require('./fullresponseviewoptionchangedaction');
import updatePageNumberIndicatorAction = require('./updatepagenumberindicatoraction');
import updatePageNumberIndicatorOnZoomAction = require('./updatepagenumberindicatoronzoomaction');
import responseImageRotated = require('./responseimagerotatedaction');
import updateDisplayAngleOfRotation = require('./updatedisplayangleofresponseaction');
import responseDataGetAction = require('./responsedatagetaction');
import base = require('../base/actioncreatorbase');
import updateWavyAction = require('../../actions/response/updatewavyaction');
import setImageZonesForPageNoAction = require('./setimagezonesforpagenoaction');
import refreshImageRotationSettingsAction = require('./refreshimagerotationsettingsaction');
import setFractionDataForImageLoadedAction = require('./setfracsdataforimageloadedaction');
import responseIdRenderedAction = require('./responseidrenderedaction');
import structuredFracsDataSetAction = require('./structuredfracsdatasetaction');
import supervisorRemarkCheckAction = require('../teammanagement/supervisorremarkcheckaction');
import createRemarkAction = require('./createremarkaction');
import unmanagedSlaoFlagAsSeenAction = require('./unmanagedslaoflagasseenaction');
import promoteToSeedAction = require('./promotetoseedaction');
import rejectRigConfirmedAction = require('./rejectrigconfirmedaction');
import rejectRigPopupDisplayAction = require('./rejectrigpopupdisplayaction');
import rejectRigCompletedAction = require('./rejectrigcompletedaction');
import updateResponseCollectionAction = require('./updateresponseaction');
import promoteToSeedCheckRemarkAction = require('./promotetoseedcheckremarkaction');
import promoteToSeedReturn = require('../../stores/response/typings/promotetoseedreturn');
import supervisorRemarkVisibilityAction = require('./supervisorremarkvisibilityaction');
import annotation = require('../../stores/response/typings/annotation');
import navigateAfterSubmitAction = require('./navigateaftersubmitaction');
import viewWholePageLinkAction = require('./viewwholepagelinkaction');
import promoteToReuseBucketAction = require('./promotetoreusebucketaction');
import setBookmarkPreviousScrollDataAction = require('./setbookmarkpreviousscrolldataaction');
import validateResponseAction = require('./validateresponseaction');
import fullResponseViewScrollAction = require('./fullresponseviewscrollaction');
import frvToggleButtonAction = require('./frvtoggleaction');
import resetSearchResponseAction = require('./resetsearchresponseaction');
/**
 * Class for creating Response Action Creator
 */
class ResponseActionCreator extends base {
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
     * @param canRenderPreviousMarksInStandardisationSetup
     */
    public openResponse(
        displayId: number,
        responseNavigation: enums.ResponseNavigation,
        responseMode: enums.ResponseMode,
        markGroupId: number,
        responseViewMode: enums.ResponseViewMode,
        triggerPoint: enums.TriggerPoint = enums.TriggerPoint.None,
        sampleReviewCommentId: enums.SampleReviewComment = enums.SampleReviewComment.None,
        sampleReviewCommentCreatedBy: number = 0,
        isWholeResponse: boolean = false,
        canRenderPreviousMarksInStandardisationSetup: boolean,
		candidateScriptId: number,
        isOnScrrenHintVisible: boolean = false,
        examinerRoleId: number,
        hasDefinitiveMarks: boolean) {
        new Promise.Promise(function (resolve: any, reject: any) {
            resolve();
        }).then(() => {
            dispatcher.dispatch(
                new responseOpenAction(
                    true,
                    displayId,
                    responseNavigation,
                    responseMode,
                    markGroupId,
                    responseViewMode,
                    triggerPoint,
                    candidateScriptId,
                    examinerRoleId,
                    hasDefinitiveMarks,
                    null,
                    sampleReviewCommentId,
                    sampleReviewCommentCreatedBy,
                    isWholeResponse,
					canRenderPreviousMarksInStandardisationSetup,
                    isOnScrrenHintVisible
                ));
        }).catch();
    }


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
     * @param isAggregatedTargetsCCEnabled checks if the CC is ON or not.
     */
    public allocateResponse(examinerRoleId: number,
        markSchemeGroupId: number,
        workListType: enums.WorklistType,
        isConcurrentDownload: boolean,
        examSessionId: number,
        isPE: boolean,
        isElectronicStandardisationTeamMember: boolean,
        examinerId: number,
        isCandidatePrioritisationCCON: boolean,
        isQualityRemarkCCEnabled: boolean,
        remarkRequestType: enums.RemarkRequestType,
        isWholeResponseDownload: boolean,
        isAggregatedTargetsCCEnabled: boolean): void {

        let that = this;

        let args = new allocateArgument(examinerRoleId,
            markSchemeGroupId,
            workListType,
            isConcurrentDownload,
            examSessionId,
            isPE,
            isElectronicStandardisationTeamMember,
            examinerId,
            isCandidatePrioritisationCCON,
            isQualityRemarkCCEnabled,
            remarkRequestType,
            false,
            null,
            isWholeResponseDownload,
            isAggregatedTargetsCCEnabled);
        responseDataService.allocateResponse(args, function (data: allocatedResponseData, success: boolean) {
            // This will validate the call to find any network failure
            // and is mandatory to add this.
            if (that.validateCall(data, true)) {
                dispatcher.dispatch(new responseAllocateAction(data, success, isWholeResponseDownload));
            }
        });
    }

    /**
     * Search for an atypical response
     * @param {SearchAtypicalResponseArgument} searchAtypicalResponseArgument search atypical response parameter
     */
    public searchAtypicalResponse(searchAtypicalResponseArgument: SearchAtypicalResponseArgument): void {

        let that = this;

        responseDataService.SearchAtypicalResponse(searchAtypicalResponseArgument,
            function (data: atypicalresponsesearchresult, success: boolean) {
                if (that.validateCall(data, true)) {
                    dispatcher.dispatch(new atypicalResponseSearchAction(data, success));
                }
            });
    }

    /**
     * Open atypical response.
     */
    public markNowAtypicalResponse(examinerRoleId: number,
        markSchemeGroupId: number,
        workListType: enums.WorklistType,
        isConcurrentDownload: boolean,
        examSessionId: number,
        isPE: boolean,
        isElectronicStandardisationTeamMember: boolean,
        examinerId: number,
        isCandidatePrioritisationCCON: boolean,
        remarkRequestType: enums.RemarkRequestType,
        isAtypical: boolean,
        candidateScript: number): void {

        let that = this;
        let args = new allocateArgument(examinerRoleId,
            markSchemeGroupId,
            workListType,
            isConcurrentDownload,
            examSessionId,
            isPE,
            isElectronicStandardisationTeamMember,
            examinerId,
            isCandidatePrioritisationCCON,
            false,
            remarkRequestType,
            isAtypical,
            candidateScript);

        responseDataService.allocateResponse(args, function (data: allocatedResponseData, success: boolean) {
            // This will validate the call to find any network failure
            // and is mandatory to add this.
            if (that.validateCall(data, true)) {
                dispatcher.dispatch(new atypicalSearchMarkNowAction(data, success));
            }
        });
    }

    /**
     * Download and move atypical response to worklist.
     */
    public moveAtypicalResponseToWorklist(examinerRoleId: number,
        markSchemeGroupId: number,
        workListType: enums.WorklistType,
        isConcurrentDownload: boolean,
        examSessionId: number,
        isPE: boolean,
        isElectronicStandardisationTeamMember: boolean,
        examinerId: number,
        isCandidatePrioritisationCCON: boolean,
        remarkRequestType: enums.RemarkRequestType,
        isAtypical: boolean,
        candidateScript: number): void {

        let that = this;
        let args = new allocateArgument(examinerRoleId,
            markSchemeGroupId,
            workListType,
            isConcurrentDownload,
            examSessionId,
            isPE,
            isElectronicStandardisationTeamMember,
            examinerId,
            isCandidatePrioritisationCCON,
            false,
            remarkRequestType,
            isAtypical,
            candidateScript);

        responseDataService.allocateResponse(args, function (data: allocatedResponseData, success: boolean) {
            // This will validate the call to find any network failure
            // and is mandatory to add this.
            if (that.validateCall(data, true)) {
                dispatcher.dispatch(new atypicalSearchMoveToWorklistAction(data, success));
            }
        });
    }

    /**
     * Retrieve the Marks and Annotations for the RIG
     * @param markGroupId current mark group ID
     * @param markingMode current marking
     * @param candidateScriptId candidate Script ID
     * @param isPEOrAPE is PE or APE
     * @param priority priority
     * @param bookMarkFetchType Bookmark Type
     */
    public retrieveMarksAndAnnotations(markGroupIds: number[],
        currentMarkGroupId: number,
        markingMode: enums.MarkingMode,
        candidateScriptId: number,
        isPEOrAPE: boolean,
        remarkRequestType: enums.RemarkRequestType = enums.RemarkRequestType.Unknown,
        isBlindPracticeMarkingOn: boolean,
        subExaminerId: number,
        examinerId: number,
        priority: enums.Priority = enums.Priority.First,
        bookMarkFetchType: enums.BookMarkFetchType,
        isWholeResponseMarking: boolean,
        hasComplexOptionality: boolean,
        isReusableResponseView: boolean = false,
        isFromAwarding: boolean = false
    ) {

        let that = this;

        // The arugument entity is ported from WA, the properties which are not required now are hardcoded.
        let arg = new retrieveMarksArgument(markGroupIds,
            isWholeResponseMarking,
            enums.MarkingMode[markingMode],
            0,
            false,
            isFromAwarding ? true : false,
            candidateScriptId,
            false,
            false,
            false,
            0,
            false,
            isPEOrAPE,
            remarkRequestType,
            isBlindPracticeMarkingOn,
            subExaminerId,
            examinerId,
            isReusableResponseView,
            false,
            bookMarkFetchType);

        responseDataService.retrieveMarksAndAnnotations(arg, currentMarkGroupId, priority,
            function (data: examinerMarkData, success: boolean) {

                // This will validate the call to find any network failure
                // and is mandatory to add this.
                let successCall = that.validateCall(data, true);
                dispatcher.dispatch(new retrieveMarksAction(data, successCall, currentMarkGroupId, hasComplexOptionality));
            });
    }

    /**
     * This method will save marks and annotations.
     * @param arg
     * @param priority
     */
    public saveMarksAndAnnotations(arg: saveMarksAndAnnotationsArgument,
        priority: enums.Priority = enums.Priority.First,
        saveMarksAndAnnotationTriggeringPoint: enums.SaveMarksAndAnnotationsProcessingTriggerPoint
            = enums.SaveMarksAndAnnotationsProcessingTriggerPoint.BackgroundWorker) {
        responseDataService.saveMarksAndAnnotations(arg, priority, function (data: saveMarksAndAnnotationsReturn, success: boolean) {
            dispatcher.dispatch(
                new saveMarksAndAnnotationsAction(
                    data,
                    arg.markGroupId,
                    saveMarksAndAnnotationTriggeringPoint,
                    success,
                    enums.DataServiceRequestErrorType.None,
                    arg.isWholeResponseMarking,
                    arg.hasComplexOptionality
                )
            );
        }, function (data: saveMarksAndAnnotationsReturn,
            success: boolean,
            dataServiceRequestErrorType: enums.DataServiceRequestErrorType) {
                dispatcher.dispatch(
                    new saveMarksAndAnnotationsAction(
                        null,
                        arg.markGroupId,
                        saveMarksAndAnnotationTriggeringPoint,
                        success,
                        dataServiceRequestErrorType,
                        arg.isWholeResponseMarking,
                        arg.hasComplexOptionality
                    )
                );
            });
    }

    /**
     * This method will trigger the saving of marks and annotation
     * @param saveMarksAndAnnotationTriggeringPoint
     */
    public triggerSavingMarksAndAnnotations(saveMarksAndAnnotationTriggeringPoint: enums.SaveMarksAndAnnotationsProcessingTriggerPoint
        = enums.SaveMarksAndAnnotationsProcessingTriggerPoint.BackgroundWorker) {
        new Promise.Promise(function (resolve: any, reject: any) {
            resolve();
        }).then(() => {
            dispatcher.dispatch(new triggerSavingMarksAndAnnotationsAction(saveMarksAndAnnotationTriggeringPoint, true));
        }).catch();
    }

    /**
     * This action will set a non-recoverable error.
     * @param markGroupId
     */
    public setNonRecoverableError(markGroupId: number) {
        new Promise.Promise(function (resolve: any, reject: any) {
            resolve();
        }).then(() => {
            dispatcher.dispatch(new nonRecoverableErrorAction(markGroupId, true));
        }).catch();
    }

    /**
     * clear marks and annotations against a mark groupId for reloading.
     * @param markGroupId
     */
    public clearMarksAndAnnotations(markGroupId: number) {
        new Promise.Promise(function (resolve: any, reject: any) {
            resolve();
        }).then(() => {
            responseDataService.removeMarksAndAnnotationsRequestsQueueItem(markGroupId);
            dispatcher.dispatch(new clearMarksAndAnnotationsAction(markGroupId, true));
        }).catch();
    }

    /**
     * This method will call while response mode is changed in response screen
     */
    public changeResponseViewMode(responseViewMode: enums.ResponseViewMode, doResetFracs: boolean,
        isImageFile: boolean = true, pageNo: number = 0) {
        new Promise.Promise(function (resolve: any, reject: any) {
            resolve();
        }).then(() => {
            dispatcher.dispatch(new responseViewModeChangedAction(true, responseViewMode, doResetFracs, isImageFile, pageNo));
        }).catch();
    }

    /**
     * This method will set current scroll position or reset the current scroll data.
     * @param currentScrollPosition
     * @param doEmit
     * @param updateScrollPosition
     */
    public setCurrentScrollPosition(currentScrollPosition: number, doEmit: boolean = false, updateScrollPosition: boolean = true) {
        new Promise.Promise(function (resolve: any, reject: any) {
            resolve();
        }).then(() => {
            dispatcher.dispatch(new scrollPositionChangedAction(true, currentScrollPosition, doEmit, updateScrollPosition));
        }).catch();
    }

    /**
     * Method to update the mouse pointer position during mouse move and drag events.
     * @param {number} xPosition
     * @param {number} yPosition
     */
    public setMousePosition(xPosition: number, yPosition: number) {
        new Promise.Promise(function (resolve: any, reject: any) {
            resolve();
        }).then(() => {
            dispatcher.dispatch(new updateMousePositionAction(xPosition, yPosition));
        });
    }

    /**
     * This method will reset the current scroll data.
     */
    public resetScrollData() {
        new Promise.Promise(function (resolve: any, reject: any) {
            resolve();
        }).then(() => {
            dispatcher.dispatch(new scrollDataResetAction(true));
        }).catch();
    }

    /**
     * This method will set the fracs data value.
     * @param triggerScrollEvent Indicate to emit action FRACS_DATA_LOADED
     */
    public setFracsData(fracsData: FracsData, triggerScrollEvent: boolean = false, structuredFracsDataLoaded: boolean = false,
        fracsDataSource?: enums.FracsDataSetActionSource) {
        new Promise.Promise(function (resolve: any, reject: any) {
            resolve();
        }).then(() => {
            dispatcher.dispatch(new fracsDataSetAction(true, fracsData, triggerScrollEvent, structuredFracsDataLoaded,
                fracsDataSource));
        }).catch();

    }

    /**
     * This method will find the active image container Id.
     * @param doEmit
     */
    public findVisibleImageId(doEmit: boolean = false, fracsDataSource?: enums.FracsDataSetActionSource) {
        new Promise.Promise(function (resolve: any, reject: any) {
            resolve();
        }).then(() => {
            dispatcher.dispatch(new findVisibleImageAction(doEmit, fracsDataSource));
        }).catch();
    }

    /**
     * this method will update the current full response view option.
     */
    public fullResponseViewOptionChanged(fullResponseViewOption: enums.FullResponeViewOption) {
        new Promise.Promise(function (resolve: any, reject: any) {
            resolve();
        }).then(() => {
            dispatcher.dispatch(new fullResponseViewOptionChangedAction(true, fullResponseViewOption));
        }).catch();
    }

    /**
     * This method updates the most visible page no while scrolling.
     */
    public updatePageNoIndicator(pageNo: Array<number>, imageNo: Array<number>, isBookletView: boolean) {
        new Promise.Promise(function (resolve: any, reject: any) {
            resolve();
        }).then(() => {
            dispatcher.dispatch(new updatePageNumberIndicatorAction(pageNo, imageNo, isBookletView));
        });
    }

    /**
     * This method updates the page number indicator when zoom in/zomm out
     */
    public updatePageNoIndicatorOnZoom() {
        new Promise.Promise(function (resolve: any, reject: any) {
            resolve();
        }).then(() => {
            dispatcher.dispatch(new updatePageNumberIndicatorOnZoomAction());
        });
    }

    /**
     * Update the rotated images height on zoom.
     * @param {boolean} hasRotatedImages
     */
    public responseImageRotated(hasRotatedImages: boolean, rotatedImages: string[] = []): void {
        new Promise.Promise(function (resolve: any, reject: any) {
            resolve();
        }).then(() => {
            dispatcher.dispatch(new responseImageRotated(hasRotatedImages, rotatedImages));
        });
    }

    /**
     * This method updates the display angle of the response page.
     */
    public updateDisplayAngleOfResponse(reset: boolean, displayAngle?: number, responseId?: string) {
        new Promise.Promise(function (resolve: any, reject: any) {
            resolve();
        }).then(() => {
            dispatcher.dispatch(new updateDisplayAngleOfRotation(displayAngle, responseId, reset));
        });
    }

    /**
     * Get the Response details
     * @param displayId
     * @param markGroupId
     * @param esMarkGroupId
     */
    public getResponseDetails(displayId: string, markGroupId: number, esMarkGroupId: number, markSchemeGroupId: number, msgId: number,
        candidateScriptId: number, examinerId: number, isElectronicStandardisationTeamMember: boolean, isTeamManagement: boolean,
        isStandardisationSetup: boolean, standardisationSetupWorklistType?: enums.StandardisationSetup, esDisplayId?: string) {

        var that = this;
        new Promise.Promise(function (resolve: any, reject: any) {
            resolve();
        }).then(() => {

            let displayIdWithoutPrefex = displayId.substring(1, displayId.length); // Remove prfix '6'

            responseDataService.getResponseDetails(
                displayIdWithoutPrefex,
                markGroupId,
                esMarkGroupId,
                candidateScriptId,
                function (data: SearchedResponseData, success: boolean) {
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
                    data.isStandardisationSetup = isStandardisationSetup;
                    data.standardisationSetupWorklistType = standardisationSetupWorklistType;
                    data.esDisplayId = esDisplayId ? esDisplayId : null;
                    dispatcher.dispatch(new responseDataGetAction(data, success));
                });
        });
    }

    /**
     * Update WavyAnnotations ViewMode Changed
     */
    public updateWavyAnnotationsViewModeChanged() {
        new Promise.Promise(function (resolve: any, reject: any) {
            resolve();
        }).then(() => {
            dispatcher.dispatch(new updateWavyAction());
        });
    }

    /**
     * Set Image zones against a page number
     * @param {Immutable.List<ImageZone>} imageZones
     */
    public imageZonesAgainstPageNumber(imageZones: Immutable.List<ImageZone>, linkedAnnotations: annotation[]): void {
        new Promise.Promise(function (resolve: any, reject: any) {
            resolve();
        }).then(() => {
            dispatcher.dispatch(new setImageZonesForPageNoAction(imageZones, linkedAnnotations));
        });
    }

    /**
     * On loading new response/navigating from full response view
     * refresh the rotated image settings.
     * This will add rotate class and set the rotation class as well
     */
    public refreshImageRotationSettings() {
        new Promise.Promise(function (resolve: any, reject: any) {
            resolve();
        }).then(() => {
            dispatcher.dispatch(new refreshImageRotationSettingsAction());
        });
    }

    /**
     * Set fracs data for response image loaded
     */
    public setFracsDataForImageLoaded() {
        new Promise.Promise(function (resolve: any, reject: any) {
            resolve();
        }).then(() => {
            dispatcher.dispatch(new setFractionDataForImageLoadedAction());
        }).catch();
    }

    /**
     * Render breadcrumb after loading responseID in response header
     */
    public reRenderBreadCrumbAfterLoadingResponseID() {
        new Promise.Promise(function (resolve: any, reject: any) {
            resolve();
        }).then(() => {
            dispatcher.dispatch(new responseIdRenderedAction());
        });
    }

    /**
     * Set the Response details in stores for setting the values.
     * @param data
     */
    public setResponseDetails(data: SearchedResponseData) {
        new Promise.Promise(function (resolve: any, reject: any) {
            resolve();
        }).then(() => {
            dispatcher.dispatch(new responseDataGetAction(data, true));
        });
    }

    /**
     * Set fracs data for structured images 
     */
    public structuredFracsDataSet(source?: enums.FracsDataSetActionSource) {
        new Promise.Promise(function (resolve: any, reject: any) {
            resolve();
        }).then(() => {
            dispatcher.dispatch(new structuredFracsDataSetAction(source));
        }).catch();
    }

    /**
     * Get the Response details
     * @param displayId
     * @param markGroupId
     * @param esMarkGroupId
     */
    public getResponseDetailsForSupervisorRemark(candidateScriptId: number,
        markSchemeGroupId: number, selectedExaminerId: number, isWholeResponse: boolean) {
        let that = this;
        return new Promise.Promise(function (resolve: any, reject: any) {
            responseDataService.getResponseDetailsForSupervisorRemark(
                candidateScriptId,
                markSchemeGroupId,
                selectedExaminerId,
                isWholeResponse,
                function (supervisorRemarkValidationReturn: SupervisorRemarkValidationReturn, success: boolean) {
                    if (that.validateCall(supervisorRemarkValidationReturn, false, true,
                        enums.WarningMessageAction.SuperVisorRemarkCheck)) {
                        if (!success) {
                            supervisorRemarkValidationReturn = undefined;
                        }
                        dispatcher.dispatch(new supervisorRemarkCheckAction(supervisorRemarkValidationReturn));
                        resolve(supervisorRemarkValidationReturn);
                    } else {
                        reject(null);
                    }
                });
        });
    }

    /**
     * Action creator to create a supervisor remark
     * @param {RequestRemarkArguments} requestRemarkArguments
     * @param {boolean} isMarkNowButtonClicked
     */
    public createSupervisorRemark(requestRemarkArguments: RequestRemarkArguments, isMarkNowButtonClicked: boolean) {
        let that = this;
        return new Promise.Promise(function (resolve: any, reject: any) {
            responseDataService.createSupervisorRemark(requestRemarkArguments,
                function (
                    success: boolean,
                    requestRemarkReturn: RequestRemarkReturn) {

                    // This will validate the call to find any network failure
                    // and is mandatory to add this.
                    if (that.validateCall(requestRemarkReturn, false, true)) {
                        if (!success) {
                            requestRemarkReturn = undefined;
                        }
                        dispatcher.dispatch(new createRemarkAction(requestRemarkReturn, isMarkNowButtonClicked));
                        resolve(requestRemarkReturn);
                    } else {
                        reject(null);
                    }
                });
        });
    }

    /**
     * Action creator to promote a response to seed.
     * @param {promoteToSeedArgs} promote to seed arguments
     */
    public promoteToSeed(promoteToSeedArgs: PromoteToSeedArguments) {
        let that = this;
        return new Promise.Promise(function (resolve: any, reject: any) {
            responseDataService.promoteToSeed(promoteToSeedArgs,
                function (
                    success: boolean,
                    promoteToSeedReturn: promoteToSeedReturn) {

                    // This will validate the call to find any network failure
                    // and is mandatory to add this.
                    if (that.validateCall(promoteToSeedReturn, false, true)) {
                        if (!success) {
                            promoteToSeedReturn = undefined;
                        }
                        dispatcher.dispatch(new promoteToSeedAction(success, promoteToSeedReturn));
                        resolve(promoteToSeedReturn);
                    } else {
                        reject(null);
                    }
                });
        });
    }



    /**
     * dispatche slao flag as seen stamping action.
     * @param pageNumber
     */
    public doStampFlagAsSeenAnnotation(pageNumber: number) {
        new Promise.Promise(function (resolve: any, reject: any) {
            resolve();
        }).then(() => {
            dispatcher.dispatch(new unmanagedSlaoFlagAsSeenAction(pageNumber));
        }).catch();
    }

    /**
     * Action creator for reject rig.
     * @param rejectRigArgument
     */
    public rejectRig(rejectRigArgument: RejectRigArgument, isNextResponseAvailable: boolean) {
        let that = this;
        return new Promise.Promise(function (resolve: any, reject: any) {
            responseDataService.RejectRig(rejectRigArgument,
                function (
                    success: boolean,
                    rejectRigReturn: RejectRigReturn) {
                    if (that.validateCall(rejectRigReturn)) {
                        if (success) {
                            dispatcher.dispatch(new rejectRigCompletedAction(success, isNextResponseAvailable));
                        }
                        resolve(rejectRigReturn);
                    } else {
                        reject(null);
                    }
                });
        });
    }

    /**
     * Dispatch action to reject response.
     * @param displayId
     */
    public doRejectResponse(displayId: number) {
        new Promise.Promise(function (resolve: any, reject: any) {
            resolve();
        }).then(() => {
            dispatcher.dispatch(new rejectRigConfirmedAction(displayId));
        }).catch();
    }

    /**
     * Dispatch action to display reject rig pop up
     */
    public showRejectRigConfirmation() {
        new Promise.Promise(function (resolve: any, reject: any) {
            resolve();
        }).then(() => {
            dispatcher.dispatch(new rejectRigPopupDisplayAction);
        }).catch();
    }

    /**
     * dispatch action for response collection updation.
     * @param markGroupId
     * @param worklistType
     */
    public updateResponseCollection(markGroupId: number, worklistType: enums.WorklistType) {
        new Promise.Promise(function (resolve: any, reject: any) {
            resolve();
        }).then(() => {
            dispatcher.dispatch(new updateResponseCollectionAction(markGroupId, worklistType));
        }).catch();
    }

    /**
     * Action creator to get remark details before promoting a response to seed.
     * @param {promoteToSeedArgs} promote to seed arguments
     */
    public getRemarkDetailsForPromoteToSeed(promoteToSeedArgs: PromoteToSeedArguments) {
        let that = this;
        return new Promise.Promise(function (resolve: any, reject: any) {
            responseDataService.promoteToSeedCheckRemark(promoteToSeedArgs,
                function (
                    success: boolean,
                    promoteToSeedReturn: promoteToSeedReturn) {

                    // This will validate the call to find any network failure
                    // and is mandatory to add this.
                    if (that.validateCall(promoteToSeedReturn, false, true,
                        enums.WarningMessageAction.PromoteToSeed)) {
                        if (!success) {
                            promoteToSeedReturn = undefined;
                        }
                        dispatcher.dispatch(new promoteToSeedCheckRemarkAction(success, promoteToSeedReturn));
                        resolve(promoteToSeedReturn);
                    } else {
                        reject(null);
                    }
                });
        });
    }

    /**
     * Method to show or hide supervisor remark button.
     * @param isVisible
     */
    public doVisibleSupervisorRemarkButton(isVisible: boolean) {
        new Promise.Promise(function (resolve: any, reject: any) {
            resolve();
        }).then(() => {
            dispatcher.dispatch(new supervisorRemarkVisibilityAction(isVisible));
        }).catch();
    }

    /**
     * Inform other modules the submission completed
     * 
     * @param {Array<number>} submittedMarkGroupIds 
     * @memberof ResponseActionCreator
     */
    public navigateAfterSubmit(submittedMarkGroupIds: Array<number>, selectedDisplayId: string, fromMarkScheme: boolean) {
        new Promise.Promise(function (resolve: any, reject: any) {
            resolve();
        }).then(() => {
            dispatcher.dispatch(new navigateAfterSubmitAction(submittedMarkGroupIds, selectedDisplayId, fromMarkScheme));
        }).catch();
    }

    /**
     * Action creator to promote closed live response to reuse bucket
     * @param {promoteToReuseArguments} promote to reusebucket arguments 
     */
    public promoteToReuseBucket(promoteToReuseArguments: PromoteToReuseBucketArguments) {
        let that = this;
        return new Promise.Promise(function (resolve: any, reject: any) {
            responseDataService.promoteToReuseBucket(promoteToReuseArguments,
                function (
                    success: boolean,
                    isResponsePromotedToReuseBucket: boolean) {

                    // This will validate the call to find any network failure
                    // and is mandatory to add this.
                    if (that.validateCall(isResponsePromotedToReuseBucket, false, true,
                        enums.WarningMessageAction.PromoteToReuseBucket)) {
                        if (!success) {
                            isResponsePromotedToReuseBucket = undefined;
                        }
                        resolve(isResponsePromotedToReuseBucket);
                    } else {
                        success = false;
                        isResponsePromotedToReuseBucket = undefined;
                        reject(null);
                    }
                    dispatcher.dispatch(new promoteToReuseBucketAction
                        (success, isResponsePromotedToReuseBucket, promoteToReuseArguments.markGroupId));
                });
        });
    }

    /**
     * Method to show or hide the view Whole page button, for zones in marking screen.
     * @param isCursorInsideScript
     */
    public viewWholePageLinkAction(isCursorInsideScript: boolean, activeImageZone?: ImageZone) {
        new Promise.Promise(function (resolve: any, reject: any) {
            resolve();
        }).then(() => {
            dispatcher.dispatch(new viewWholePageLinkAction(isCursorInsideScript, activeImageZone));
        }).catch();
    }

    /**
     * Action to set bookmark previous scroll data
     */
    public setBookmarkPreviousScrollData(bookmarkPreviousScrollData: BookmarkPreviousScrollData) {
        new Promise.Promise(function (resolve: any, reject: any) {
            resolve();
        }).then(() => {
            dispatcher.dispatch(new setBookmarkPreviousScrollDataAction(bookmarkPreviousScrollData));
        }).catch();
    }

    /**
     * Action to validate response
     */
    public validateResponse(markGroupId: number, markSchemeGroupId: number, examinerRoleId: number) {
        let that = this;
        return new Promise.Promise(function (resolve: any, reject: any) {
            responseDataService.validateResponse(markGroupId,
                markSchemeGroupId, examinerRoleId,
                function (success: boolean, validateResponseReturnData: ValidateResponseReturnData) {
                    if (that.validateCall(validateResponseReturnData)) {
                        if (success) {
                            dispatcher.dispatch(new validateResponseAction(validateResponseReturnData, success, false));
                        }
                        resolve(validateResponseReturnData);
                    } else {
                        reject(null);
                    }
                });
        });
    }

    /**
     * Action to validate, whether the scipt is withdrawn seed.
     * @param candidateScriptID
     * @param markSchemeGroupdId
     */
    public validateCentreScriptResponse(candidateScriptID: number, markSchemeGroupdId: number) {
        let that = this;
        return new Promise.Promise(function (resolve: any, reject: any) {
            responseDataService.validateCentreScriptResponse(candidateScriptID,
                markSchemeGroupdId,
                function (success: boolean, validateResponseReturnData: ValidateResponseReturnData) {
                    if (that.validateCall(validateResponseReturnData)) {
                        if (success) {
                            dispatcher.dispatch(new validateResponseAction(validateResponseReturnData, success, true));
                        }
                        resolve(validateResponseReturnData);
                    } else {
                        reject(null);
                    }
                });
        });
    }

    /**
     * Action to validate, whether the response has been removed from the current worklist.
     * @param esMarkGroupId
     * @param markSchemeGroupId
     * @param markingModeId
     */
    public validateUnClassifiedResponse(esMarkGroupId: number, markingModeId: number) {
        let that = this;
        return new Promise.Promise(function (resolve: any, reject: any) {
            responseDataService.validateProvisionalResponse(esMarkGroupId,
                markingModeId,
                function (success: boolean, validateResponseReturnData: ValidateResponseReturnData) {
                    if (that.validateCall(validateResponseReturnData)) {
                        if (success) {
                            dispatcher.dispatch(new validateResponseAction(validateResponseReturnData, success, true));
                        }
                        resolve(validateResponseReturnData);
                    } else {
                        reject(null);
                    }
                });
        });
    }

    /**
     * Action to set scroll position to the first unknown content page of remark
     */
    public setPageScrollInFRV() {
        new Promise.Promise(function (resolve: any, reject: any) {
            resolve();
        }).then(() => {
            dispatcher.dispatch(new fullResponseViewScrollAction());
        }).catch();
    }

    /**
     * Action to hide page option button on toggle.
     */
    public hidePageOptionButton() {
        new Promise.Promise(function (resolve: any, reject: any) {
            resolve();
        }).then(() => {
            dispatcher.dispatch(new frvToggleButtonAction());
        }).catch();
    }

    /**
     * Action to reset search response.
     */
    public resetSearchResponse() {
        new Promise.Promise(function (resolve: any, reject: any) {
            resolve();
        }).then(() => {
            dispatcher.dispatch(new resetSearchResponseAction());
        }).catch();
    }
}

let responseOpenCreator = new ResponseActionCreator();
export = responseOpenCreator;

