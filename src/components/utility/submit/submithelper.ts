import enums = require('../enums');
import workListValidatorSchema = require('../../../utility/worklistvalidators/worklistvalidatorschema');
import Immutable = require('immutable');
import worklistStore = require('../../../stores/worklist/workliststore');
import configurableCharacteristicsHelper = require('../../../utility/configurablecharacteristic/configurablecharacteristicshelper');
import configurableCharacteristicsNames = require('../../../utility/configurablecharacteristic/configurablecharacteristicsnames');
import examinerStore = require('../../../stores/markerinformation/examinerstore');
import responseHelper = require('../responsehelper/responsehelper');
import markingHelper = require('../../../utility/markscheme/markinghelper');
import targetHelper = require('../../../utility/target/targethelper');
import qigStore = require('../../../stores/qigselector/qigstore');
import submitActionCreator = require('../../../actions/submit/submitactioncreator');
import responseActionCreator = require('../../../actions/response/responseactioncreator');
import marksandannotationsSaveHelper = require('../../../utility/marking/marksandannotationssavehelper');
import loginStore = require('../../../stores/login/loginstore');
import markerOperationModeFactory = require('../markeroperationmode/markeroperationmodefactory');
import submitStore = require('../../../stores/submit/submitstore');
import responseStore = require('../../../stores/response/responsestore');
import standardisationSetupStore = require('../../../stores/standardisationsetup/standardisationsetupstore');
import eCourseworkHelper = require('../ecoursework/ecourseworkhelper');
import eCourseWorkFileStore = require('../../../stores/response/digital/ecourseworkfilestore');
import navigationStore = require('../../../stores/navigation/navigationstore');
import standardisationActionCreator = require('../../../actions/standardisationsetup/standardisationactioncreator');
import updateESMarkGroupMarkingModeData = require('../../../stores/standardisationsetup/typings/updateesmarkgroupmarkingmodedata');

/**
 * Submit helper for submitting the response from Response and worklist
 */

class SubmitHelper {
    private responseStatuses: Immutable.List<enums.ResponseStatus>;
    private markingProgress: number;
    private calculateAllpagesAnnotatedLogic: boolean = false;
    private markGroupId: number;

    /**
     * Validate submit button
     * @param response
     * @param markingProgress
     * @param calculateAllpagesAnnotatedLogic
     */
    public submitButtonValidate(response: ResponseBase, markingProgress: number, calculateAllpagesAnnotatedLogic: boolean,
        hasBlockingExceptions: boolean) {
        this.markingProgress = markingProgress;
        this.calculateAllpagesAnnotatedLogic = calculateAllpagesAnnotatedLogic;
        this.responseStatuses = Immutable.List<enums.ResponseStatus>();
        this.responseStatuses.clear();
        if (worklistStore.instance.getResponseMode === enums.ResponseMode.open) {
                this.responseStatuses = this.openResponseValidation(response, hasBlockingExceptions);
        } else if (markerOperationModeFactory.operationMode.isStandardisationSetupMode) {
			if (standardisationSetupStore.instance.selectedStandardisationSetupWorkList ===
				enums.StandardisationSetup.ProvisionalResponse ||
				standardisationSetupStore.instance.selectedStandardisationSetupWorkList ===
				enums.StandardisationSetup.UnClassifiedResponse) {
				this.responseStatuses = this.openResponseValidation(response, hasBlockingExceptions);
			}
        }
        return this.responseStatuses;
    }

    /**
     * Open live worklist validation for marking progress/submit button
     * @param response
     */
    private openResponseValidation(response: ResponseBase, hasBlockingExceptions: boolean) {
        response.isSubmitEnabled = false;
        /** if the marking has started */
        if (this.markingProgress > 0) {
            /** if the marking is completed */
            if (this.markingProgress === 100) {
                /** taking the cc from cc helper */

				// Avoid ForceAnnotationOnEachPage CC while opening single response in multiQig
				// Apply ForceAnnotationOnEachPage CC for all QIGs in the whole response when it turned on for at least one QIG
                let markSchemeGroupId: number = 0;
                let markGroupId: number =
                    (standardisationSetupStore.instance.selectedStandardisationSetupWorkList === enums.StandardisationSetup.None) ?
                    response.markGroupId : response.esMarkGroupId;
                let isAllFilesViewed: boolean = true;
                    if (navigationStore.instance.containerPage === enums.PageContainers.Response) {
                        isAllFilesViewed = eCourseWorkFileStore.instance.checkIfAllFilesViewed(markGroupId);
                    } else {
                        isAllFilesViewed = response.allFilesViewed;
                    }
				if (!responseStore.instance.isWholeResponse) {
					markSchemeGroupId = qigStore.instance.getSelectedQIGForTheLoggedInUser.markSchemeGroupId;
				}
                let isAllPagesAnnotatedCC = configurableCharacteristicsHelper.getCharacteristicValue(
					configurableCharacteristicsNames.ForceAnnotationOnEachPage, markSchemeGroupId).toLowerCase() === 'true' ? true : false;

                let isAllSLAOAnnotatedCC = configurableCharacteristicsHelper.getCharacteristicValue(
                    configurableCharacteristicsNames.SLAOForcedAnnotations, markSchemeGroupId).toLowerCase() === 'true' ? true : false;
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
				} else if (standardisationSetupStore.instance.selectedStandardisationSetupWorkList ===
					enums.StandardisationSetup.UnClassifiedResponse && response.hasDefinitiveMark === false) {
					// STD UnClassified Response with Definitive Marking Not Started
					this.responseStatuses = this.responseStatuses.push(enums.ResponseStatus.definitiveMarkingNotStarted);
				} else if (standardisationSetupStore.instance.selectedStandardisationSetupWorkList ===
					enums.StandardisationSetup.UnClassifiedResponse &&
					!standardisationSetupStore.instance.stdSetupPermissionCCData.role.permissions.classify) {
					// STD UnClassified Response with No permission to Classify
					this.responseStatuses = this.responseStatuses.push(enums.ResponseStatus.NoPermissionToClassify);
				} else if ((!isAllPagesAnnotatedCC && isAllSLAOAnnotatedCC && response.hasAllPagesAnnotated === false)
                    || (isAllPagesAnnotatedCC && response.hasAllPagesAnnotated === false)) {
                    this.responseStatuses = this.responseStatuses.push(enums.ResponseStatus.notAllPagesAnnotated);
                    this.responseStatuses = this.responseStatuses.push(enums.ResponseStatus.markingInProgress);
                    if (hasBlockingExceptions) {
                        this.responseStatuses = this.responseStatuses.push(enums.ResponseStatus.hasException);
                    }
                } else if (eCourseworkHelper.isECourseworkComponent && !isAllFilesViewed) {
                        this.responseStatuses = this.responseStatuses.push(enums.ResponseStatus.notAllFilesViewed);
                        if (hasBlockingExceptions) {
                            this.responseStatuses = this.responseStatuses.push(enums.ResponseStatus.hasException);
                        }
                    } else if (hasBlockingExceptions)  {
                    /**
                     * if the marking is completed and blocking exceptions are there, show both.
                     */
                    this.responseStatuses = this.responseStatuses.push(enums.ResponseStatus.hasException);
                    this.responseStatuses = this.responseStatuses.push(enums.ResponseStatus.markingInProgress);
                } else if (response.hasZoningExceptions) {
                    /** if the marking is completed and zoning exceptions are there, show both. */
                    this.responseStatuses = this.responseStatuses.push(enums.ResponseStatus.hasZoningException);
                    this.responseStatuses = this.responseStatuses.push(enums.ResponseStatus.markingInProgress);
				} else {
                    /**
                     * if all pages annotated cc is off and if no blocking exceptions are there, show ready to submit button
                     */
                    this.responseStatuses = this.responseStatuses.push(enums.ResponseStatus.readyToSubmit);
                    response.isSubmitEnabled = true;
                }
            } else if (hasBlockingExceptions) {
                /**
                 * if the marking is in progress and blocking exceptions are there, show both.
                 */
                this.responseStatuses = this.responseStatuses.push(enums.ResponseStatus.hasException);
                this.responseStatuses = this.responseStatuses.push(enums.ResponseStatus.markingInProgress);
			} else if (standardisationSetupStore.instance.selectedStandardisationSetupWorkList ===
				enums.StandardisationSetup.UnClassifiedResponse &&
				!standardisationSetupStore.instance.stdSetupPermissionCCData.role.permissions.viewDefinitives) {

				this.responseStatuses = this.responseStatuses.push(enums.ResponseStatus.NoViewDefinitivesPermisssion);

			}else {
                this.responseStatuses = this.responseStatuses.push(enums.ResponseStatus.markingInProgress);
            }
		} else { //if marking has not started

			//If StandardisationSetup UnClassifiedResponse and defenitive marking percentage iz Zero then show status as 0%
			if (standardisationSetupStore.instance.selectedStandardisationSetupWorkList ===
				enums.StandardisationSetup.UnClassifiedResponse) {
				// If the logged in user has 'No View Definitive' Permission, then show status as 'Provisional'.
				if (!standardisationSetupStore.instance.stdSetupPermissionCCData.role.permissions.viewDefinitives) {
					this.responseStatuses = this.responseStatuses.push(enums.ResponseStatus.NoViewDefinitivesPermisssion);
				} else {
					this.responseStatuses = this.responseStatuses.push(enums.ResponseStatus.markingInProgress);
				}
			} else {
			   // if marking not started show the same
				this.responseStatuses = this.responseStatuses.push(enums.ResponseStatus.markingNotStarted);
			}
        }
        return this.responseStatuses;
    }

    /**
     * Save and submit response for the markgroupid
     * @param markGroupId
     */
    public static saveAndSubmitResponse(markGroupId: number) {
        marksandannotationsSaveHelper.triggerMarksAndAnnotationsQueueProcessing
            (enums.SaveMarksAndAnnotationsProcessingTriggerPoint.Submit,
            () => {
                SubmitHelper.submitreponse(markGroupId);
            });
    }

    /**
     * Save and classify response
     * @param esMarkGroupId
     * @param responseDetails
     */
    public static saveAndClassifyResponse(esMarkGroupId: number, responseDetails: updateESMarkGroupMarkingModeData) {
        marksandannotationsSaveHelper.triggerMarksAndAnnotationsQueueProcessing
            (enums.SaveMarksAndAnnotationsProcessingTriggerPoint.Classify,
            () => {
                standardisationActionCreator.classifyResponse(responseDetails, navigationStore.instance.containerPage);
            });
    }

    /**
     * Save and classify response
     * @param esMarkGroupId
     * @param responseDetails
     */
    public static saveAndShareAndClassifyResponse(
    	submitResponseArgument: SubmitResponseArgument,
        sharedFromMarkScheme: boolean =  false,
        selectedDisplayId: string = undefined,
    ) {
        marksandannotationsSaveHelper.triggerMarksAndAnnotationsQueueProcessing
            (enums.SaveMarksAndAnnotationsProcessingTriggerPoint.ShareAndClassify,
            () => {
                submitActionCreator.shareAndClassifyResponse(
                    submitResponseArgument,
                    sharedFromMarkScheme,
                    selectedDisplayId);
            });
    }


    /**
     * Submit response
     * @param markGroupId
     */
    public static submitreponse = (markGroupId: number): void => {
        let submitResponseArgument: SubmitResponseArgument;
        let currentWorklistType: enums.WorklistType;
        let getRemarkRequestType: enums.RemarkRequestType;
        let isStdSetupMode: boolean;
        /* Submitting  responses initiated */
        /* Select the mark group list based on the current response mode */
        let markGroupIdList: Array<Number> = new Array();
        markGroupIdList.push(markGroupId);

        if (responseStore.instance.isWholeResponse) {
            // If a whole response, retrieve all the related markGroupIds
            let relatedMarkGroupIds: number[] = worklistStore.instance.getRelatedMarkGroupIdsForWholeResponse(markGroupId);

            // Update related markGroupIds for whole response submission from mark scheme panel
            // For Atypical, the isWholeResponse flag is true always, so also checking the retrieved list length
            if (relatedMarkGroupIds.length > 0){
                relatedMarkGroupIds.map((relatedMarkGroupId: number) => {
                    markGroupIdList.push(relatedMarkGroupId);
                });
            }
        }

        /* mapping values on submit argument*/
        submitResponseArgument = {
            markGroupIds: standardisationSetupStore.instance.selectedStandardisationSetupWorkList ===
                enums.StandardisationSetup.ProvisionalResponse ? [markGroupId] : markGroupIdList,
            markingMode: standardisationSetupStore.instance.selectedStandardisationSetupWorkList ===
                enums.StandardisationSetup.ProvisionalResponse ? enums.MarkingMode.PreStandardisation
                : targetHelper.getSelectedQigMarkingMode(),
            examinerRoleId: qigStore.instance.selectedQIGForMarkerOperation.examinerRoleId,
            markSchemeGroupId: qigStore.instance.selectedQIGForMarkerOperation.markSchemeGroupId,
            examinerApproval: examinerStore.instance.getMarkerInformation.approvalStatus,
            isAdminRemarker: loginStore.instance.isAdminRemarker
        };
        if (standardisationSetupStore.instance.selectedStandardisationSetupWorkList ===
            enums.StandardisationSetup.ProvisionalResponse) {
            currentWorklistType = enums.WorklistType.none;
            getRemarkRequestType = enums.RemarkRequestType.Unknown;
            isStdSetupMode = true;
        } else {
            currentWorklistType = worklistStore.instance.currentWorklistType;
            getRemarkRequestType = worklistStore.instance.getRemarkRequestType;
            isStdSetupMode = false;
        }

        //let remarkRequestType: enums.RemarkRequestType = this.getRemarkRequestType(.worklistType);
        /* calling to send data to server */
        submitActionCreator.submitResponse
            (submitResponseArgument, qigStore.instance.selectedQIGForMarkerOperation.markSchemeGroupId,
            currentWorklistType, getRemarkRequestType, true, responseStore.instance.selectedDisplayId.toString(),
            null, null, isStdSetupMode);

    };

    /**
     * Clear the marks and Annotation for responses so that the marks will be reloaded
     * @param submittedMarkGroupIds
     */
    public static clearMarksAndAnnotations = (submittedMarkGroupIds: Array<number>): void => {
        // check whether we need to clear marks and annoatation for pracice and standazation response.
        if (submittedMarkGroupIds !== undefined) {
            for (let markGroupId of submittedMarkGroupIds) {
                // Verify if marks and annotations of the submitted response can be cleared
                if (SubmitHelper.isClearMarksAndAnnotations(markGroupId)) {
                    // Calling the action creator to clear the marks and annotations
                    responseActionCreator.clearMarksAndAnnotations(markGroupId);
                }
            }
        }
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
    private static isClearMarksAndAnnotations(markGroupId: number) {

        // check isBlindPracticeMarkingOn CC is turned On 
        let isBlindPracticeMarkingOn: boolean = configurableCharacteristicsHelper.getCharacteristicValue(
            configurableCharacteristicsNames.BlindPracticeMarking).toLowerCase() === 'true';

        // check isShowStandardisationDefinitiveMarks CC is turned On
        let isShowStandardisationDefinitiveMarks: boolean = configurableCharacteristicsHelper.getCharacteristicValue(
            configurableCharacteristicsNames.ShowStandardisationDefinitiveMarks,
            qigStore.instance.selectedQIGForMarkerOperation.markSchemeGroupId).toLowerCase() === 'true';

        // check AutomaticQualityFeedback CC is turned ON
        let isAutomaticQualityFeedback: boolean = configurableCharacteristicsHelper.getCharacteristicValue(
            configurableCharacteristicsNames.AutomaticQualityFeedback,
            qigStore.instance.selectedQIGForMarkerOperation.markSchemeGroupId).toLowerCase() === 'true';

        // check whether the current response type is standardisation/secondstandardisation marking 
        // and corresponding cc is ON for showing  previous definitive mark after submitting.
        let isStandardisation = (worklistStore.instance.currentWorklistType === enums.WorklistType.standardisation
            || worklistStore.instance.currentWorklistType === enums.WorklistType.secondstandardisation)
            && isShowStandardisationDefinitiveMarks ? true : false;

        // check whether the current response type is Practice and corresponding cc is ON for showing
        // previous definitive mark after submitting.
        let isPractice = worklistStore.instance.currentWorklistType === enums.WorklistType.practice
            && isBlindPracticeMarkingOn ? true : false;

        let isSeed: boolean = false;
        let seedCollection = submitStore.instance.getSubmitResponseReturn.seedCollection[markGroupId];
        if (seedCollection) {
            // check whether the submitted response is seed or not and if Quality feedback CC is ON or not
            isSeed = isAutomaticQualityFeedback && seedCollection.seedType !== enums.SeedType.None;
        }

        return isStandardisation || isPractice || isSeed;
    }
}

export = SubmitHelper;