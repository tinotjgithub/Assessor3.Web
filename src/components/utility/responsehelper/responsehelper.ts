import enums = require('../enums');
import responseStore = require('../../../stores/response/responsestore');
import markingStore = require('../../../stores/marking/markingstore');
import worklistStore = require('../../../stores/worklist/workliststore');
import scriptStore = require('../../../stores/script/scriptstore');
import annotationHelper = require('../../../components/utility/annotation/annotationhelper');
import configurableCharacteristicsHelper = require('../../../utility/configurablecharacteristic/configurablecharacteristicshelper');
import configurableCharacteristicsNames = require('../../../utility/configurablecharacteristic/configurablecharacteristicsnames');
import markerOperationModeFactory = require('../markeroperationmode/markeroperationmodefactory');
import responseActionCreator = require('../../../actions/response/responseactioncreator');
import userOptionsHelper = require('../../../utility/useroption/useroptionshelper');
import userOptionKeys = require('../../../utility/useroption/useroptionkeys');
import qigStore = require('../../../stores/qigselector/qigstore');
import copyPreviousMarksAndAnnotationsHelper = require('../annotation/copypreviousmarksandannotationshelper');
import imagezoneStore = require('../../../stores/imagezones/imagezonestore');
import operationModeHelper = require('../userdetails/userinfo/operationmodehelper');
import standardisationSetupStore = require('../../../stores/standardisationsetup/standardisationsetupstore');

/**
 * Helper class
 */
class ResponseHelper {

    private static _firstSLAOPageNumber: number = 0;
    private static _hasAdditionalObject: boolean = false;

    /**
     * To check the response should be rendered as unstructured or structured
     */
    public static isAtypicalResponse(): boolean {
        // get the response data
        let responseData = undefined;
        if (responseStore.instance.selectedDisplayId && !markerOperationModeFactory.operationMode.isAwardingMode) {
            responseData = worklistStore.instance.getResponseDetails(responseStore.instance.selectedDisplayId.toString());
        }
        // setting response data for awarding mode
        if (markerOperationModeFactory.operationMode.isAwardingMode){
            responseData = markerOperationModeFactory.operationMode.openedResponseDetails
            (responseStore.instance.selectedDisplayId.toString());
        }
        return (responseData && responseData.atypicalStatus !== enums.AtypicalStatus.Scannable);
    }

	/**
	 * Gets a value indicating the atypical status of the response.
	 */
    public static get currentAtypicalStatus(): enums.AtypicalStatus {
        let responseData = worklistStore.instance.getResponseDetails(responseStore.instance.selectedDisplayId.toString());
        if (responseData) {
            return responseData.atypicalStatus;
        }
        return enums.AtypicalStatus.Scannable;
    }

    /**
     * Get response seed type Id
     */
    public static getCurrentResponseSeedType(): enums.SeedType {
        return markerOperationModeFactory.operationMode.getCurrentResponseSeedType;
    }

    /*
    * gets whether the response is closed EUR seed
    */
    public static get isClosedEurSeed(): boolean {
        return markerOperationModeFactory.operationMode.isClosedEurSeed;
    }

    /*
    * gets whether the response is closed Live seed
    */
    public static get isClosedLiveSeed(): boolean {
        return markerOperationModeFactory.operationMode.isClosedLiveSeed;
    }

    /*
     * Get pagenumber of additionalobject(first one in the list)
     */
    public static get firstSLAOPageNumber(): number {
        return this._firstSLAOPageNumber;
    }

    /*
     *Set the value whether the response has additional object or not
     */
    public static get hasAdditionalObject(): boolean {
        return this._hasAdditionalObject;
    }

    /**
     * get whether the script having unmanaged SLAO
     */
    public static hasUnmanagedSLAO(displayId: string): boolean {
        // Set the  default value for variables.
        this._hasAdditionalObject = false;
        this._firstSLAOPageNumber = 0;
        // check whether any unmanaged slao for structured responses
        if (responseStore.instance.markingMethod === enums.MarkingMethod.Structured) {
            // get the response data
            let responseData = markerOperationModeFactory.operationMode.openedResponseDetails(displayId);
            /* UnManaged SLAO need not be considered for Atypical
               Responses as they are treated as unstructured*/
            if (responseData && (responseData.atypicalStatus === enums.AtypicalStatus.AtypicalScannable ||
                responseData.atypicalStatus === enums.AtypicalStatus.AtypicalUnscannable)) {
                return false;
            }
            let additionalScriptImages: ScriptImage[] = [];
            if (responseData && responseData.candidateScriptId) {

                // get the additional script images which are not supressed
                let scriptDetails = (scriptStore.instance.getAllScriptDetailsForTheCandidateScript
                    (responseData.candidateScriptId)).forEach((scriptImage: ScriptImage) => {
                        if (scriptImage && scriptImage.isAdditionalObject && !scriptImage.isSuppressed) {
                            additionalScriptImages.push(scriptImage);
                        }
                    });
                // Check if the response has any additional object or not ,if ,then set it has aaditional object and pagenumber of that.
                if (additionalScriptImages.length > 0) {
                    this._firstSLAOPageNumber = additionalScriptImages[additionalScriptImages.length - 1].pageNumber;
                    this._hasAdditionalObject = true;
                }
                // loop through each additional script and check wheather any script is unannotated
                let annotationDetails: any;
                if (additionalScriptImages) {
                    for (let index = 0; index < additionalScriptImages.length; index++) {
                        annotationDetails = annotationHelper.getAnnotationsInAdditionalObjectByPageNo(
                            additionalScriptImages[index].pageNumber,
                            markerOperationModeFactory.operationMode.isStandardisationSetupMode ?
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
    }

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
    public static openResponse(
        displayId: number,
        responseNavigation: enums.ResponseNavigation,
        responseMode: enums.ResponseMode,
        markGroupId: number,
        responseViewMode: enums.ResponseViewMode,
        triggerPoint: enums.TriggerPoint = enums.TriggerPoint.None,
        sampleReviewCommentId: enums.SampleReviewComment = enums.SampleReviewComment.None,
        sampleReviewCommentCreatedBy: number = 0) {
        let selectedResponseExaminerRoleId: number;
        // set the examinerRoleId based on following condition
        if (worklistStore.instance.isMarkingCheckMode && !markerOperationModeFactory.operationMode.isStandardisationSetupMode) {
            // response open from MarkingCheckMode wiorklist.
            if (triggerPoint === enums.TriggerPoint.DisplayIdSearch) {
                selectedResponseExaminerRoleId = responseStore.instance.searchedResponseData.examinerRoleId;
            } else {
                selectedResponseExaminerRoleId = worklistStore.instance.selectedMarkingCheckExaminer.examinerRoleID;
            }
        } else if (triggerPoint && (triggerPoint === enums.TriggerPoint.AssociatedDisplayIDFromMessage)) {
            // response open through displayid link.
            selectedResponseExaminerRoleId = responseStore.instance.searchedResponseData.examinerRoleId;
        } else {
            // response open from teammangement/ mymarking worklist.
            selectedResponseExaminerRoleId = operationModeHelper.examinerRoleId;
        }

        // Checking whether the response is withdrwan in background or not.
		if (markerOperationModeFactory.operationMode.isStandardisationSetupMode) {
			if (standardisationSetupStore.instance.selectedStandardisationSetupWorkList === enums.StandardisationSetup.SelectResponse) {
				responseActionCreator.validateCentreScriptResponse(displayId,
					qigStore.instance.selectedQIGForMarkerOperation.markSchemeGroupId);
			} else if (standardisationSetupStore.instance.selectedStandardisationSetupWorkList
				=== enums.StandardisationSetup.UnClassifiedResponse) {
				responseActionCreator.validateUnClassifiedResponse(markGroupId,
					standardisationSetupStore.instance.fetchStandardisationResponseData(displayId).markingModeId);
			}
		} else {
            responseActionCreator.validateResponse(markGroupId,
                qigStore.instance.selectedQIGForMarkerOperation.markSchemeGroupId,
                selectedResponseExaminerRoleId
            );
        }

        let hasUnmanagedSLAOs = markerOperationModeFactory.operationMode.isStandardisationSetupMode ?
            standardisationSetupStore.instance.hasAdditionalPage : ResponseHelper.hasUnmanagedSLAO(displayId.toString()) &&
            !markerOperationModeFactory.operationMode.isTeamManagementMode;

        let isStandardisationSetupMode: boolean = markerOperationModeFactory.operationMode.isStandardisationSetupMode;
        let isWholeResponse: boolean = isStandardisationSetupMode ? false : this.isWholeResponse(displayId);
        let responseDetails: ResponseBase;
        let hsaDefinitiveMarks: boolean = false;
        if (!isStandardisationSetupMode && triggerPoint !== enums.TriggerPoint.Awarding) {
            responseDetails = worklistStore.instance.getResponseDetails(displayId.toString());
        } else {
            responseDetails = standardisationSetupStore.instance.getResponseDetails(displayId.toString());
            hsaDefinitiveMarks = responseDetails.hasDefinitiveMark ? true : false;
        }

        responseActionCreator.openResponse(
            displayId,
            responseNavigation,
            responseMode,
            markGroupId,
            hasUnmanagedSLAOs
                ? enums.ResponseViewMode.fullResponseView :
                responseViewMode,
            triggerPoint,
            sampleReviewCommentId,
            sampleReviewCommentCreatedBy,
            isWholeResponse,
            markerOperationModeFactory.operationMode.canRenderPreviousMarksInStandardisationSetup,
            responseDetails.candidateScriptId,
            userOptionsHelper.getUserOptionByName(userOptionKeys.ON_SCREEN_HINTS) === 'true',
            operationModeHelper.examinerRoleId,
            hsaDefinitiveMarks
        );
    }

	/**
	 * returns true if selected response is Whole Response
	 */
    private static isWholeResponse(displayId: number): boolean {
        // get the response data
        let responseData = undefined;
        if (displayId) {
            responseData = worklistStore.instance.getResponseDetails(displayId.toString());
            return responseData.isWholeResponse;
        }
        return false;
    }

    /**
     * returns true for scripts having unmanaged slaos in marking view
     */
    public static get hasUnManagedSLAOInMarkingMode(): boolean {
        return ((ResponseHelper.hasUnmanagedSLAO(responseStore.instance.selectedDisplayId.toString()) &&
            !markerOperationModeFactory.operationMode.isTeamManagementMode &&
            !ResponseHelper.isAtypicalResponse() &&
            // Added this check to avoid unmanaged slao content mode in closed worklist
            worklistStore.instance.getResponseMode !== enums.ResponseMode.closed &&
            !standardisationSetupStore.instance.isUnClassifiedWorklist &&
            !standardisationSetupStore.instance.isSelectResponsesWorklist) ||
            (ResponseHelper.hasUnmanagedSLAO(responseStore.instance.selectedDisplayId.toString()) &&
                standardisationSetupStore.instance.isUnClassifiedWorklist &&
                markerOperationModeFactory.operationMode.isResponseEditable));
    }

    /**
     * return true if selected response contains additional pages
     */
    public static get hasAdditionalPageInStdSetUpSelectResponses(): boolean {
        return standardisationSetupStore.instance.hasAdditionalPage;
    }

    /**
     * returns true for ebookmarking responses having unmanaged imagez zones.
     */
    public static hasUnManagedImageZone(): boolean {
        // This is to return false in standardisationsetup as we will not have unmanaged image zones for a response
        if (markerOperationModeFactory.operationMode.isStandardisationSetupMode) {
            return false;
        }
        let imageZones = imagezoneStore.instance.currentCandidateScriptImageZone;
        let unManagedZones = (imageZones ? imageZones.filter((x: ImageZone) => x.docStorePageQuestionTagTypeId === 4) : undefined);
        let responseData = markerOperationModeFactory.operationMode.openedResponseDetails
            (responseStore.instance.selectedDisplayId.toString());
        let hasUnmanaged: boolean = false;

        // For live response marked in WA and remark in A3
        let hasUnmanagedUnknownContentInRemark: boolean = false;
        let managedUnknownContentInRemark: boolean = false;
        let annotationDetails: any;
        let previousAnnotations: any;
        let isRemark: boolean = (worklistStore.instance.currentWorklistType === enums.WorklistType.directedRemark ||
            worklistStore.instance.currentWorklistType === enums.WorklistType.pooledRemark);
        if (unManagedZones) {
            unManagedZones.forEach((item: ImageZone) => {
                annotationDetails = annotationHelper.getAnnotationsInAdditionalObjectByPageNo(item.pageNo, responseData.markGroupId);
                if (!annotationHelper.isLinkedOrFlaggedAsSeenInPage(annotationDetails)) {
                    hasUnmanaged = true;
                }

                if (isRemark) {
                    previousAnnotations = annotationHelper.
                        getPreviousAnnotationsInPageNo(item.pageNo, this.getCurrentResponseSeedType());
                    if (!annotationHelper.isLinkedOrFlaggedAsSeenInPage(previousAnnotations)) {
                        hasUnmanagedUnknownContentInRemark = true;
                    }
                }
            });
        }

        if (hasUnmanagedUnknownContentInRemark) {
            managedUnknownContentInRemark = true;
        } else {
            managedUnknownContentInRemark = isRemark ?
                copyPreviousMarksAndAnnotationsHelper.canStartMarkingWithEmptyMarkGroup() : true;
        }

        // Added this check to avoid unknown content management mode in closed worklist
        return (hasUnmanaged && worklistStore.instance.getResponseMode !== enums.ResponseMode.closed &&
            managedUnknownContentInRemark &&
            !markerOperationModeFactory.operationMode.isTeamManagementMode &&
            !worklistStore.instance.isMarkingCheckMode);
    }

    /**
     * returns true for ebookmarking having unknown content with unmanaged zones.
     * even though it is managed in SLAO view
     */
    public static isUnkNownContentPage(pageNo: number): boolean {
        let isUnkNownContentPage: boolean = false;
        let imageZones = imagezoneStore.instance.currentCandidateScriptImageZone;
        let unManagedZones = (imageZones ? imageZones.filter((x: ImageZone) => x.docStorePageQuestionTagTypeId === 4) : undefined);
        isUnkNownContentPage = unManagedZones ? unManagedZones.some((x: ImageZone) => x.pageNo === pageNo) : false;
        return isUnkNownContentPage;
    }

    /**
     * returns true for ebookmarking responses having unmanaged imagez zones for the given page.
     */
    public static hasUnManagedImageZoneForThePage(pageNo: number): boolean {
        let imageZones = imagezoneStore.instance.currentCandidateScriptImageZone;
        let unManagedZones = (imageZones ? imageZones.filter((x: ImageZone) => x.docStorePageQuestionTagTypeId === 4) : undefined);
        let responseData = markerOperationModeFactory.operationMode.openedResponseDetails
            (responseStore.instance.selectedDisplayId.toString());
        let currentPageZones = unManagedZones ? unManagedZones.filter((x: ImageZone) => x.pageNo === pageNo) : undefined;
        let hasUnmanaged: boolean = false;
        let annotationDetails: any;

        if (currentPageZones) {
            currentPageZones.forEach((item: ImageZone) => {
                annotationDetails = annotationHelper.getAnnotationsInAdditionalObjectByPageNo
                    (item.pageNo, markerOperationModeFactory.operationMode.isStandardisationSetupMode ?
                        responseData.esMarkGroupId : responseData.markGroupId);
                // if the page is not annotated then return true
                if (annotationDetails.count() === 0) {
                    hasUnmanaged = true;
                } else {
                    hasUnmanaged = false;
                }
            });
        }
        return hasUnmanaged;
    }

    /**
     * returns the page number for ebookmarking remark responses having unmanaged imagez zones for the given page.
     */
    public static findFirstUnknownContentPage(): Number {
        let imageZones = imagezoneStore.instance.currentCandidateScriptImageZone;
        let unManagedZones = (imageZones ? imageZones.filter((x: ImageZone) => x.docStorePageQuestionTagTypeId === 4) : undefined);
        let hasUnmanaged: boolean = false;
        let pageNumbers: Array<number> = [];

        if (unManagedZones) {
            unManagedZones.forEach((item: ImageZone) => {
                pageNumbers.push(item.pageNo);
            });
        }

        return Math.min.apply(null, pageNumbers);
    }

    /**
     *  Checking whether is mark by question is selected for the response.
     * @returns True if MBQ has selected or viceversa
     */
    public static get isMbQSelected(): boolean {

        // If response is Atypical we are treating response as unstructured including structured response.
        // So return as not MBQ.
        if (ResponseHelper.isAtypicalResponse() || markerOperationModeFactory.operationMode.isAwardingMode) {
            return false;
        }

        let userOption = userOptionsHelper.getUserOptionByName(userOptionKeys.IS_MBQ_SELECTED,
            qigStore.instance.selectedQIGForMarkerOperation.examinerRoleId);
        return userOption === 'true';
    }

    /**
     * Gets a value indicating the current marking method.
     * @returns
     */
    public static get CurrentMarkingMethod(): enums.MarkingMethod {
        return responseStore.instance.markingMethod;
    }

    /* return true if the current response is seed */
    public static get isSeedResponse(): boolean {
        return ResponseHelper.isClosedEurSeed || ResponseHelper.isClosedLiveSeed;
    }


    /**
     * Checking whether the response marking is enabled my mark by annotation.
     * @param {boolean} isAtypical
     * @returns
     */
    public static isMarkByAnnotation(atypicalStatus: enums.AtypicalStatus): boolean {

        if (atypicalStatus === enums.AtypicalStatus.AtypicalUnscannable) {
            return false;
        }
        return this.isMarkByAnnotationCCActive;
    }

    /**
     * Get MarkByAnnotation CC value.
     */
    private static get isMarkByAnnotationCCActive(): boolean {
        let qigId = qigStore.instance.selectedQIGForMarkerOperation !== undefined ?
            qigStore.instance.selectedQIGForMarkerOperation.markSchemeGroupId : 0;
        return configurableCharacteristicsHelper.getCharacteristicValue(
            configurableCharacteristicsNames.MarkbyAnnotation, qigId) === 'true';
    }

    /**
     * Get EBookmarking CC value.
     */
    public static get isEbookMarking(): boolean {
        return configurableCharacteristicsHelper.getExamSessionCCValue
            (configurableCharacteristicsNames.eBookmarking, qigStore.instance.selectedQIGForMarkerOperation.examSessionId)
            .toLowerCase() === 'true' && !this.isAtypicalResponse() ? true : false;
    }

    /**
     * Get whether we need to show ovarlays in toolbar panel.
     */
    public static get isOverlayAnnotationsVisible(): boolean {
        return !(configurableCharacteristicsHelper.getExamSessionCCValue
            (configurableCharacteristicsNames.eBookmarking, qigStore.instance.selectedQIGForMarkerOperation.examSessionId)
            .toLowerCase() === 'true') ? true : false;
    }

    /**
     * Get eResponse CC value.
     */
    public static get isEResponse(): boolean {
        let ccValue = configurableCharacteristicsHelper.getExamSessionCCValue(configurableCharacteristicsNames.eResponse,
            qigStore.instance.selectedQIGForMarkerOperation.examSessionId);
        if (ccValue && ccValue !== '') {
            return true;
        } else {
            return false;
        }
    }
}
export = ResponseHelper;