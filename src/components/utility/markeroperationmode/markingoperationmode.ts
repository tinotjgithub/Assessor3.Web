import operationModeBase = require('./operationmodebase');
import localeStore = require('../../../stores/locale/localestore');
import worklistStore = require('../../../stores/worklist/workliststore');
import enums = require('../enums');
import operationMode = require('./operationmode');
import responseStore = require('../../../stores/response/responsestore');
import qigStore = require('../../../stores/qigselector/qigstore');
import examinerStore = require('../../../stores/markerinformation/examinerstore');
import ccHelper = require('../../../utility/configurablecharacteristic/configurablecharacteristicshelper');
import ccNames = require('../../../utility/configurablecharacteristic/configurablecharacteristicsnames');
import ccValues = require('../../../utility/configurablecharacteristic/configurablecharacteristicsvalues');
import markingStore = require('../../../stores/marking/markingstore');
import messageStore = require('../../../stores/message/messagestore');
import exceptionStore = require('../../../stores/exception/exceptionstore');
import markingTargetSummary = require('../../../stores/worklist/typings/markingtargetsummary');
import targetSummaryStore = require('../../../stores/worklist/targetsummarystore');
import teamManagementStore = require('../../../stores/teammanagement/teammanagementstore');
import navigationStore = require('../../../stores/navigation/navigationstore');
import rememberQig = require('../../../stores/useroption/typings/rememberqig');
import stampStore = require('../../../stores/stamp/stampstore');

class MarkingOperationMode extends operationModeBase implements operationMode {

    /**
     * Return true for marking operation mode.
     */
    public get isMarkingMode(): boolean {
        return true;
    }

    /**
     * Return false for marking operation.
     */
    public get isTeamManagementMode(): boolean {
        return false;
    }

    /**
     * Return true for Standardisation setup operation.
     */
    public get isStandardisationSetupMode(): boolean {
        return false;
    }

    /**
     * Return true for Awarding operation mode.
     */
    public get isAwardingMode(): boolean {
        return false;
    }

    /**
     * Return false for marking operation.
     */
    public get isHelpExaminersView(): boolean {
        return false;
    }

    // *** FRV *** //

    /**
     * We will display flaggedAsSeen button in marking mode.
     */
    public get isFlaggedAsSeenButtonVisible(): boolean {
        return !worklistStore.instance.isMarkingCheckMode;
    }

    /**
     * This will return the corresponding button text
     */
    public get markThisPageOrViewThisPageButtonText(): string {
        return worklistStore.instance.getResponseMode !== enums.ResponseMode.closed &&
            !worklistStore.instance.isMarkingCheckMode ?
            localeStore.instance.TranslateText('marking.full-response-view.script-page.mark-this-page-button') :
            localeStore.instance.TranslateText('marking.full-response-view.script-page.view-this-page-button');
    }

    /**
     * We will show OnlyShowUnAnnotated pages option for unstructured responses only
     */
    public hasOnlyShowUnAnnotatedPagesOption = (componentType: enums.MarkingMethod): boolean => {
        return componentType === enums.MarkingMethod.Unstructured;
    };

    /**
     * dispalying toggle button in SLAO management and in FRV for structured responses.
     */
    public hasShowToggleButtonOption = (componentType: enums.MarkingMethod): boolean => {
        return componentType === enums.MarkingMethod.Structured;
    };

    /**
     * Reset the markingProgress flag in marking store back to true only if the response mode is
     * open. This flag is used while saving marks. Save marks will not happen for closed responses
     */
    public get isSaveMarksOnMarkingViewButtonClick(): boolean {
        return worklistStore.instance.getResponseMode !== enums.ResponseMode.closed;
    }

    /**
     * Returns localisation key for return to marking button text from FRV
     */
    public get markingButtonText(): string {
        return worklistStore.instance.isMarkingCheckMode ?
            localeStore.instance.TranslateText('team-management.full-response-view.back-to-response-button') :
            localeStore.instance.TranslateText('marking.full-response-view.back-to-marking-button');
    }

    /**
     * Returns localisation key for return marking button tooltip text from FRV
     */
    public get markingButtonTooltipText(): string {
        return worklistStore.instance.isMarkingCheckMode ?
            localeStore.instance.TranslateText('team-management.full-response-view.back-to-response-button-tooltip') :
            localeStore.instance.TranslateText('marking.full-response-view.back-to-marking-button-tooltip');
    }

    /**
     * Returns whether we need to display Link To Question option or not.
     * Linking Option is not available while marking check
     */
    public get hasLinkToQuestion(): boolean {
        return !worklistStore.instance.isMarkingCheckMode;
    }

    // *** Response container *** //

    /**
     * Return true for displaying mark change reason.
     */
    public get showMarkChangeReason(): boolean {
        return true;
    }

    /**
     * Returns whether we need to display MBQ confirmation or not.
     */
    public get showMbQConfirmation(): boolean {
        return responseStore.instance.selectedResponseMode !== enums.ResponseMode.closed;
    }

    /**
     * Returns whether we need to display view Whole page link.
     */
    public get showViewWholePageButton(): boolean {
        return responseStore.instance.selectedResponseMode !== enums.ResponseMode.closed && !worklistStore.instance.isMarkingCheckMode;
    }

    /**
     * Returns whether the response is read only or not.
     */
    public get isResponseReadOnly(): boolean {
        return worklistStore.instance.getResponseMode === enums.ResponseMode.closed ||
            (messageStore.instance.messageViewAction === enums.MessageViewAction.Open ||
                messageStore.instance.messageViewAction === enums.MessageViewAction.Maximize ||
                messageStore.instance.messageViewAction === enums.MessageViewAction.View ||
                exceptionStore.instance.exceptionViewAction === enums.ExceptionViewAction.Maximize ||
                exceptionStore.instance.exceptionViewAction === enums.ExceptionViewAction.View ||
                exceptionStore.instance.exceptionViewAction === enums.ExceptionViewAction.Open);
    }

    // *** Mark Scheme Panel *** //

    /**
     * Returns whether the submit button is visible or not
     */
    public get isSubmitVisible(): boolean {
        return true;
    }

    /**
     * Returns true if submit button is disable in marking operation mode
     */
    public isSubmitDisabled = (workListType: enums.WorklistType): boolean => {
        if ((workListType !== enums.WorklistType.practice) &&
            (workListType !== enums.WorklistType.standardisation) &&
            (workListType !== enums.WorklistType.secondstandardisation) &&
            workListType !== enums.WorklistType.simulation) {
            if ((examinerStore.instance.getMarkerInformation.approvalStatus === enums.ExaminerApproval.Suspended) ||
                (examinerStore.instance.getMarkerInformation.approvalStatus === enums.ExaminerApproval.ApprovedReview) ||
                (examinerStore.instance.getMarkerInformation.approvalStatus === enums.ExaminerApproval.NotApproved) ||
                (examinerStore.instance.getMarkerInformation.approvalStatus === enums.ExaminerApproval.ConditionallyApproved)) {
                return true;
            }
        }

        return false;
    };

    /**
     * Returns true if we need to display mark by options.
     */
    public get hasMarkByOption(): boolean {
        let responseData = undefined;
        if (responseStore.instance.selectedDisplayId) {
            responseData = worklistStore.instance.getResponseDetails(responseStore.instance.selectedDisplayId.toString());
        }
        let isAtypicalResponse: boolean = responseData && responseData.atypicalStatus !== enums.AtypicalStatus.Scannable;
        let isEBookMarking: boolean = ccHelper.getExamSessionCCValue
            (ccNames.eBookmarking, qigStore.instance.selectedQIGForMarkerOperation.examSessionId)
            .toLowerCase() === 'true' && !isAtypicalResponse ? true : false;
        return (responseStore.instance.markingMethod === enums.MarkingMethod.Structured ||
            responseStore.instance.markingMethod === enums.MarkingMethod.MarkFromObject
            || isEBookMarking) && responseStore.instance.selectedResponseMode !== enums.ResponseMode.closed &&
            !worklistStore.instance.isMarkingCheckMode;
    }

    /**
     * Returns true if we need to select first unmarked item.
     */
    public get isGetFirstUnmarkedItem(): boolean {
        return true;
    }

    /**
     * Returns whether the quality feedback is outstanding or not in marking mode.
     */
    public get isQualityFeedbackOutstanding(): boolean {
        return !worklistStore.instance.isMarkingCheckMode &&
            ((qigStore.instance.selectedQIGForMarkerOperation !== undefined &&
                qigStore.instance.selectedQIGForMarkerOperation.hasQualityFeedbackOutstanding) ||
                (examinerStore.instance.getMarkerInformation !== undefined
                    && examinerStore.instance.getMarkerInformation.hasQualityFeedbackOutstanding)) &&
            ((worklistStore.instance.currentWorklistType === enums.WorklistType.live
                || worklistStore.instance.currentWorklistType === enums.WorklistType.directedRemark));
    }

    /**
     * Returns a value indicating whether the Review Response is available.
     * @returns true if review response can be allowed else false.
     */
    public get allowReviewResponse(): boolean {
        return false;
    }

    /**
     * Returns false for marking operation mode
     */
    public doShowSamplingButton = (markingProgress: number,
        worklistType: enums.WorklistType): boolean => {
        return false;
    }

    /**
     * return whether the complete button is to be visible or not (based on the CC value).
     */
    public isCompleteButtonVisible = (markingProgress: number, hasSimpleOptionality: boolean): boolean => {
        let markSchemeGroupId: number = qigStore.instance.selectedQIGForMarkerOperation.markSchemeGroupId;
        let completeButtonCC = ccHelper.getCharacteristicValue(ccNames.CompleteButton, markSchemeGroupId);
        let checkMinMarksOnCompleteCC = ccHelper.getCharacteristicValue(ccNames.CheckMinMarksOnComplete, markSchemeGroupId);

        /**
         *  return true if the cc is enabled and the resposne is in mark entry possible state (not closed)
         *  and the checkMinMarksOnCompleteCC is on and the marksheme has  optioanlity rule
         */
        if (completeButtonCC === 'true'
            && (markingProgress !== 100)
            && (checkMinMarksOnCompleteCC !== 'true' ||
                (checkMinMarksOnCompleteCC === 'true' && hasSimpleOptionality))
            //this check is to ensure the response in marking state (not closed)
            && (markingStore.instance.isMarkingInProgress || markingStore.instance.navigateTo !== enums.SaveAndNavigate.none)) {

            return true;
        } else {
            return false;
        }
    };

    /**
     * True will display the yellow edit box icon
     */
    public hasMarkChangeReasonYellowIcon = (isResponseEditable: boolean, isInResponse: boolean): boolean => {
        return isResponseEditable || !isInResponse;
    };

    /**
     * Returns the mark change reason title
     */
    public get markChangeReasonTitle(): string {
        return localeStore.instance.TranslateText('marking.worklist.response-data.mark-change-reason-not-specified-icon-tooltip');
    }


    // *** Toolbar panel *** //

    /**
     * We don't need to supervisor remark button in marking operation mode.
     */
    public get isSupervisorRemarkButtonVisible(): boolean {
        // Should not visible the button, if it is in his own supervisor visor remark worklist.
        let currentMarkingmode: enums.MarkingMode =
            worklistStore.instance.getMarkingModeByWorkListType(worklistStore.instance.currentWorklistType);
        return (
            this.shouldDisplaySupervisorRemarkButton
            && (currentMarkingmode !== enums.MarkingMode.Remarking ||
                worklistStore.instance.getRemarkRequestType !== enums.RemarkRequestType.SupervisorRemark)
            && this.getCurrentResponseSeedType === enums.SeedType.None
            && (this.isSelectedExaminerPEOrAPE || qigStore.instance.selectedQIGForMarkerOperation.isTeamManagementEnabled)
            && !worklistStore.instance.isMarkingCheckMode);
    }

    /**
     * Returns whether the promote to seed button is visible or not.
     */
    public get isPromoteToSeedButtonVisible(): boolean {

        let currentResponse: LiveClosedResponse | PendingResponse =
            (worklistStore.instance.getCurrentWorklistResponseBaseDetails().filter((x: ResponseBase) =>
                x.markGroupId === responseStore.instance.selectedMarkGroupId).first()) as LiveClosedResponse | PendingResponse;
        let currentMarkingMode: enums.MarkingMode =
            worklistStore.instance.getMarkingModeByWorkListType(worklistStore.instance.currentWorklistType);

        let remarkRequestType = worklistStore.instance.getRemarkRequestType;

        // Can promote to seed variable will hold the data related to the seed targets.
        return this.isSelectedExaminerPEOrAPE && worklistStore.instance.getResponseMode !== enums.ResponseMode.open
            && (currentMarkingMode === enums.MarkingMode.LiveMarking || currentMarkingMode === enums.MarkingMode.Remarking) &&
            this.getCurrentResponseSeedType === enums.SeedType.None && !(currentResponse).isWithdrawnSeed &&
            !(currentResponse).isPromotedSeed && !(currentResponse).hasDefinitiveMarks && worklistStore.instance.hasSeedTargets &&
            qigStore.instance.getSelectedQIGForTheLoggedInUser.examinerApprovalStatus === enums.ExaminerApproval.Approved &&
            !worklistStore.instance.isMarkingCheckMode
            && ((worklistStore.instance.getRemarkRequestType === enums.RemarkRequestType.EnquiryUponResult &&
                this.getRemarkSeedingCCValue(remarkRequestType) === true) ? false : true)
            && !this.isCurrentResponseDefinitive && !responseStore.instance.isWholeResponse
            && currentResponse.specialistType === '';
    }

    /**
     * Returns whether the any crm update is uploaded against this markgroup or not.
     */
    public get isCRMConfirmationPopupVisible(): boolean {
        let currentResponse: LiveClosedResponse =
            worklistStore.instance.getResponseDetailsByMarkGroupId(responseStore.instance.selectedMarkGroupId);

        return (currentResponse).candidateResponseTotalarkGroupID !== 0 &&
            (currentResponse).candidateResponseTotalarkGroupID !== (currentResponse).markGroupId;

    }

    /**
     * Returns the localised promote to seed popup header text
     */
    public get promoteToSeedPopupHeaderText(): string {
        return localeStore.instance.TranslateText('team-management.response.promote-to-seed-dialog.header');
    }

    /**
     * Returns the localised promote to reuse bucket popup header text
     */
    public get promoteToReusePopupHeaderText(): string {
        return localeStore.instance.TranslateText('team-management.response.promote-to-reuse-bucket-dialog.header');
    }

    /**
     * Returns the localised promote to reuse bucket popup content
     */
    public get promoteToReuseBucketPopupContentText(): string {
        return localeStore.instance.TranslateText('team-management.response.promote-to-reuse-bucket-dialog.body');
    }

    /**
     * Returns the localised promote to seed popup header text
     */
    public get promoteToSeedPopupContentText(): string {
        if (!ccValues.examinerCentreExclusivity) {
            return localeStore.instance.TranslateText('team-management.response.promote-to-seed-dialog.body-own-response');
        } else {
            return localeStore.instance.TranslateText('team-management.response.promote-to-seed-dialog.body-dynamic-sampling');
        }
    }

    /**
     * Returns whether we need to remove from response details for updating the navigation count details.
     */
    public get isRemoveResponseFromWorklistDetails(): boolean {
        return !(this.isClosed && ccValues.examinerCentreExclusivity);
    }

    // *** Worklist grid *** //

    /**
     *  Return true if we need to show accuracy indicator else return false.
     */
    public get doShowAccuracyIndicator(): boolean {
        let workListType: enums.WorklistType = worklistStore.instance.currentWorklistType;
        let _isShowStandardisationDefinitiveMarks: boolean = ccHelper.getCharacteristicValue(
            ccNames.ShowStandardisationDefinitiveMarks,
            qigStore.instance.selectedQIGForMarkerOperation.markSchemeGroupId).toLowerCase() === 'true';

        if ((workListType === enums.WorklistType.practice ||
            (_isShowStandardisationDefinitiveMarks &&
                (workListType === enums.WorklistType.standardisation || workListType === enums.WorklistType.secondstandardisation))
            || (this.isAutomaticQualityFeedbackCCOn &&
                (workListType === enums.WorklistType.live || workListType === enums.WorklistType.directedRemark)))) {
            return true;
        } else {
            return false;
        }
    }

    /**
     *  Returns whether a response is seed or not.
     */
    public isSeedResponse = (responseData: ResponseBase): boolean => {
        let isSeedResponse: boolean = (responseData as LiveClosedResponse).seedTypeId !== enums.SeedType.None;
        // we have to display the seed label in TeamManagement subordinate live closed response view irrespective of
        // Accuracy Indicator CC
        return isSeedResponse && responseData.accuracyIndicatorTypeID !== enums.AccuracyIndicatorType.Unknown;
    };

    /**
     * Returns whether the SLAO Indicator is hidden or not
     */
    public isSLAOIndicatorHidden = (isStructuredQIG: boolean): boolean => {
        if (!isStructuredQIG) {
            return true;
        }
    }

    /**
     * Returns whether the All Page Annoted Indicator is hidden or not
     */
    public isAllPageAnnotedIndicatorHidden = (isStructuredQIG: boolean): boolean => {
        if (isStructuredQIG) {
            return true;
        }
    }

    /**
     * Returns whether linked exception indicator is visible
     */
    public get isLinkedExceptionIndicatorHidden(): boolean {
        return false;
    }

    /**
     *  Returns whether the quality feedback related columns are hidden or not.
     */
    public get isQualityFeedbackWorklistColumnsHidden(): boolean {
        return !(ccHelper.getCharacteristicValue(
            ccNames.AutomaticQualityFeedback,
            qigStore.instance.selectedQIGForMarkerOperation.markSchemeGroupId) === 'true');
    }

    /**
     * Returns whether the seed label is hidden or not
     */
    public get isSeedLabelHidden(): boolean {
        return !(ccHelper.getCharacteristicValue(ccNames.AutomaticQualityFeedback,
            qigStore.instance.selectedQIGForMarkerOperation.markSchemeGroupId) === 'true');
    }

    /**
     * Returns whether the sample label is hidden or not
     */
    public isSampleLabelHidden(worklistType: enums.WorklistType): boolean {
        return true;
    }

    /**
     * Returns whether the reviewed by label is hidden or not
     */
    public get isReviewedByLabelHidden(): boolean {
        return true;
    }

    // *** Quality feedback helper *** //

    /**
     * Return whether the worklist is disabled or not based on quality feedback
     */
    public isWorklistDisabledBasedOnQualityFeedback = (worklistType: enums.WorklistType,
        remarkRequetType: enums.RemarkRequestType): boolean => {
        if (this.isExaminerHasQualityFeedback && !worklistStore.instance.isMarkingCheckMode) {
            switch (worklistType) {
                case enums.WorklistType.practice:
                case enums.WorklistType.standardisation:
                case enums.WorklistType.secondstandardisation:
                    return false;
                case enums.WorklistType.live:
                    return qigStore.instance.selectedQIGForMarkerOperation.qualityFeedbackOutstandingSeedTypeId !== enums.SeedType.Gold;
                case enums.WorklistType.directedRemark:
                    return (qigStore.instance.selectedQIGForMarkerOperation.qualityFeedbackOutstandingSeedTypeId === enums.SeedType.EUR &&
                        worklistStore.instance.getRemarkRequestType === remarkRequetType) === false;
                default:
                    return true;
            }
        } else {
            return false;
        }
    };

    /**
     * Returns whether the response navigation is blocked or not.
     */
    public isResponseNavigationBlocked = (isQualityFeedbackPossibleInWorklist: boolean): boolean => {
        return !worklistStore.instance.isMarkingCheckMode &&
            this.isAutomaticQualityFeedbackCCOn &&
            isQualityFeedbackPossibleInWorklist &&
            qigStore.instance.selectedQIGForMarkerOperation.hasQualityFeedbackOutstanding;
    };

    /**
     * Returns whether the tab is disabled based on quality feedback or not.
     */
    public isTabDisabledBasedOnQualityFeedback = (tabBasedOnQualityFeedback: enums.ResponseMode, currentTab: enums.ResponseMode):
        boolean => {
        let isTabDisabled: boolean = false;
        if (tabBasedOnQualityFeedback === undefined) {
            return isTabDisabled;
        }

        switch (currentTab) {
            case enums.ResponseMode.open:
                isTabDisabled = true;
                break;
            case enums.ResponseMode.closed:
                if (this.isAutomaticQualityFeedbackCCOn) {
                    isTabDisabled = true;
                }
                break;
            case enums.ResponseMode.pending:
                if (this.isAutomaticQualityFeedbackCCOn) {
                    isTabDisabled = true;
                }
                break;
        }
        return isTabDisabled;
    };

    /**
     * Returns whether the seeds needs to be highlighted or not.
     */
    public isSeedNeededToBeHighlighted = (qualityFeedBackStatus: enums.QualityFeedbackStatus, isSeedResponse: boolean): boolean => {
        return this.isExaminerHasQualityFeedback && qualityFeedBackStatus !== enums.QualityFeedbackStatus.None && isSeedResponse;
    };

    /**
     * Returns whether the quality helper message needs to be displayed or not.
     */
    public isQualtiyHelperMessageNeededToBeDisplayed = (worklistType: enums.WorklistType): boolean => {
        return this.isExaminerHasQualityFeedback &&
            (worklistType === enums.WorklistType.live || worklistType === enums.WorklistType.directedRemark)
            && !worklistStore.instance.isMarkingCheckMode;
    };

    /**
     * Applicable for targets.tsx and worklisttype.tsx
     * Sets the response mode based on quality feedback.
     */
    public responseModeBasedOnQualityFeedback = (responseMode: enums.ResponseMode, markingMode?: enums.MarkingMode,
        remarkRequestTypeId?: enums.RemarkRequestType): enums.ResponseMode => {

        let responseModeBasedOnQualityFeedback: enums.ResponseMode = this.getResponseModeBasedOnQualityFeedback;
        return responseModeBasedOnQualityFeedback !== undefined ? responseModeBasedOnQualityFeedback : responseMode;
    };

    /**
     * Applicable for worklist.tsx
     */
    public responseModeBasedOnQualityFeedbackForWorklist = (responseMode: enums.ResponseMode, markingMode?: enums.MarkingMode,
        remarkRequestTypeId?: enums.RemarkRequestType): enums.ResponseMode => {
        /*
         * Sets the response mode based on quality feedback.
         */
        let responseModeBasedOnQualityFeedback: enums.ResponseMode = this.getResponseModeBasedOnQualityFeedback;

        return responseModeBasedOnQualityFeedback !== undefined ? responseModeBasedOnQualityFeedback :
            worklistStore.instance.getResponseMode !== undefined && worklistStore.instance.getResponseMode !== null ?
                worklistStore.instance.getResponseMode : responseMode;
    };

    // *** Qig Selector *** //

    /**
     * Applicable for qigselector.tsx
     */
    public responseModeBasedOnQualityFeedbackForQigSelector = (responseMode: enums.ResponseMode, markingMode?: enums.MarkingMode,
        remarkRequestTypeId?: enums.RemarkRequestType): enums.ResponseMode => {

        let responseModeBasedOnQualityFeedback: enums.ResponseMode = this.getResponseModeBasedOnQualityFeedback;

        return responseModeBasedOnQualityFeedback !== undefined ? responseModeBasedOnQualityFeedback :
            worklistStore.instance.getResponseMode !== undefined &&
                worklistStore.instance.getResponseMode !== null ? worklistStore.instance.getResponseMode : responseMode;

    };

    /**
     * Applicable for Team Management mode only
     */
    public get responseMode(): enums.ResponseMode {
        return worklistStore.instance.getResponseMode !== undefined &&
            worklistStore.instance.getResponseMode !== null ?
            worklistStore.instance.getResponseMode : enums.ResponseMode.open;
    }

    /**
     * Returns the selected qig id
     */
    public get getQigId(): number {
        return qigStore.instance.selectedQIGForMarkerOperation ?
            qigStore.instance.selectedQIGForMarkerOperation.markSchemeGroupId :
            this.previousSelectedQIGFromUserOption ?
                this.previousSelectedQIGFromUserOption.qigId : 0;
    }

    /**
     * Returns the selected qig from user option
     */
    public get selectedQIGFromUserOption(): rememberQig {
        return this.previousSelectedQIGFromUserOption;
    }

    // *** Targets **** //

    /**
     * Returns whether the target is disabled or not.
     */
    public isTargetDisabled = (target: markingTargetSummary, previousTarget: markingTargetSummary): boolean => {
        // Determine if the item is shown in a disabled status here.
        // In the future state the item is disabled.
        let isTargetDisabled: boolean = true;
        if (target.markingModeID === enums.MarkingMode.Remarking &&
            (this.isExaminerHasQualityFeedback || !this.isMarkerApprovedOrSuspended)) {
            //When the marker has quality feedback outstanding, the remarking tab should be disabled
            return isTargetDisabled;
        } else if (target.isCurrentTarget || target.isTargetCompleted || (previousTarget !== undefined && previousTarget.isTargetCompleted)
            || targetSummaryStore.instance.getCurrentTarget().markingModeID === enums.MarkingMode.LiveMarking) {
            isTargetDisabled = target.markingModeID !== enums.MarkingMode.LiveMarking ? false
                : previousTarget === undefined ? false : !this.isMarkerApprovedOrSuspended;
        }

        return isTargetDisabled;
    };

    // *** Menu wrapper *** //

    /**
     * Return true if we need to update marking progress in store
     */
    public get isSetMarkingInProgressAndMarkEntrySelectedRequired(): boolean {
        return navigationStore.instance.containerPage === enums.PageContainers.Response
            && responseStore.instance.selectedResponseMode !== enums.ResponseMode.closed
            && responseStore.instance.selectedResponseViewMode === enums.ResponseViewMode.zoneView;
    }

    // *** Worklist *** //

    /**
     * Method which tells if the marks and annotations download needs to be initiated based on the selected response mode.
     * @param responseMode
     */
    public canInitiateMarkAndAnnotationsBackgroundDownload = (responseMode: enums.ResponseMode): boolean => {
        if (responseMode === enums.ResponseMode.open) {
            return worklistStore.instance.getCurrentWorklistResponseBaseDetails().size > 0;
        }
        return false;
    };

    // *** worklist container *** //

    /**
     * Returns the tab to be selected.
     */
    public tabToBeSelected = (selectedTab: enums.ResponseMode): enums.ResponseMode => {
        let tabToBeSelectedBasedOnQualityFeedback: enums.ResponseMode = this.getResponseModeBasedOnQualityFeedback;
        return tabToBeSelectedBasedOnQualityFeedback !== undefined ? tabToBeSelectedBasedOnQualityFeedback : selectedTab;
    };

    // *** Message **** //

    /**
     * Returns whether the forward button is hidden or not in view.
     */
    public get isForwardButtonHidden(): boolean {
        return false;
    }

    /**
     * Returns whether we need to remove mandatory message priority or not.
     */
    public isRemoveMandatoryMessagePriorityRequired = (supervisorId: number): boolean => {
        return false;
    };

    /**
     * In TeamManagement view supervisor can send new message from examiners response. (to corresponding examiner only)
     */
    public sendMessageToExaminer = (messageType: enums.MessageType): boolean => {
        return false;
    }

    // *** Response Helper *** //

    /**
     * Returns whether the response is editable or not.
     */
    public get isResponseEditable(): boolean {

        let updatePendingResponsesWhenSuspendedCCOn: boolean = ccHelper.getCharacteristicValue
            (ccNames.UpdatePendingResponsesWhenSuspended,
            qigStore.instance.selectedQIGForMarkerOperation.markSchemeGroupId).toLowerCase() === 'true';
        let updateWhenSuspended: boolean = true;
        let isClosedResponse: boolean = false;

        if (examinerStore.instance.getMarkerInformation.approvalStatus === enums.ExaminerApproval.Suspended
            && markingStore.instance.currentResponseMode === enums.ResponseMode.pending
            && !updatePendingResponsesWhenSuspendedCCOn) {
            updateWhenSuspended = false;
        }

        if (markingStore.instance.currentResponseMode === enums.ResponseMode.closed) {
            isClosedResponse = true;
        }

        return ((markingStore.instance.isMarkingInProgress ||
            markingStore.instance.navigateTo !== enums.SaveAndNavigate.none) && !isClosedResponse
            && updateWhenSuspended && !worklistStore.instance.isMarkingCheckMode);
    }

    // *** Marking Progress *** //

    /**
     * Returns true if we need to display marking progress in percentage.
     * Percentage needs to be shown even if Marking is not in progress while in MarkingCheckWorklist
     */
    public showMarkingProgressWithPercentage = (isMarkingInProgress: boolean): boolean => {
        return isMarkingInProgress || worklistStore.instance.isMarkingCheckMode;
    };

    // *** Marking Helper *** //

    /**
     * Returns true if mark change reason needed else return false.
     */
    public isMarkChangeReasonNeeded = (currentMarkingProgress: number): boolean => {
        let markChangeReason: string = markingStore.instance.getMarkChangeReason(markingStore.instance.currentMarkGroupId);
        return (markingStore.instance.currentResponseMode === enums.ResponseMode.open ||
            markingStore.instance.currentResponseMode === enums.ResponseMode.pending) &&
            currentMarkingProgress === 100 &&
            (markChangeReason === undefined || markChangeReason === null || markChangeReason.length <= 0);
    };

    // *** Markscheme helper *** //

    /**
     * Return true if we need to retrieve marks and annotations else return false.
     */
    public isRetrieveMarksAndAnnotationsRequired = (markGroupId: number, hasNonRecoverableErrors: boolean): boolean => {
        return !markingStore.instance.isMarksLoaded(markGroupId) || hasNonRecoverableErrors;
    };

    // *** Annotation Helper *** //

    /**
     * We've to display previous annotation (definitive) in gray colour
     */
    public isPreviousAnnotationsInGrayColour = (seedType: enums.SeedType): boolean => {
        let currentWorklistType: enums.WorklistType = worklistStore.instance.currentWorklistType;
        let currentResponseMode: enums.ResponseMode = worklistStore.instance.getResponseMode;

        return currentWorklistType === enums.WorklistType.practice || currentWorklistType === enums.WorklistType.standardisation ||
            currentWorklistType === enums.WorklistType.secondstandardisation || currentWorklistType === enums.WorklistType.live ||
            (currentWorklistType === enums.WorklistType.directedRemark && currentResponseMode === enums.ResponseMode.closed &&
                seedType === enums.SeedType.EUR);
    };

    // *** Tree view data helper *** //

    /**
     * determine whether we need to render remarks or not
     */
    public get canRenderPreviousMarks(): boolean {

        if (worklistStore.instance.isMarkingCheckMode) {
            return false;
        }

        if (this.isDirectedRemark || this.isPractice || this.isPooledRemark) {
            return true;
        } else if ((this.isStandardisation || this.isSecondStandardisation) && this.isClosed) {
            if (this.hasShowStandardisationDefinitiveMarksCC) {
                return true;
            }
        } else if ((this.isDirectedRemark || this.isLive || this.isPooledRemark) && this.isClosed
            && this.isCurrentResponseSeed !== enums.SeedType.None) {
            if (this.isAutomaticQualityFeedbackCCOn) {
                return true;
            }
        } else {
            return false;
        }
    }

    /*
     * gets whether the response is closed EUR seed
     */
    public get isClosedEurSeed(): boolean {
        return worklistStore.instance.currentWorklistType === enums.WorklistType.directedRemark &&
            this.getCurrentResponseSeedType === enums.SeedType.EUR;
    }

    /**
     * gets whether the response is closed Live seed
     */
    public get isClosedLiveSeed(): boolean {
        return worklistStore.instance.currentWorklistType === enums.WorklistType.live &&
            this.getCurrentResponseSeedType === enums.SeedType.Gold;
    }

    /**
     * Get closed response seed type Id
     */
    public get getCurrentResponseSeedType(): enums.SeedType {

        if (worklistStore.instance.getResponseMode === enums.ResponseMode.closed) {
            let responseCollection: Immutable.List<ResponseBase> = worklistStore.instance.getCurrentWorklistResponseBaseDetails();
            if (responseCollection) {

                let response: ResponseBase = null;
                for (let i = 0; i < responseCollection.size; i++) {
                    if (responseCollection.get(i).markGroupId === responseStore.instance.selectedMarkGroupId) {
                        response = responseCollection.get(i);
                        break;
                    }
                }
                // Seed type should be returned only in the case of Closed responses
                if (response) {
                    switch (worklistStore.instance.currentWorklistType) {
                        case enums.WorklistType.live:
                            return (response as LiveClosedResponse).seedTypeId;
                        case enums.WorklistType.directedRemark:
                            return (response as DirectedRemarkClosedResponse).seedTypeId;
                        default:
                            return enums.SeedType.None;
                    }
                }
            }
        }

        return enums.SeedType.None;
    }


    /**
     * Check the Worklist Filter can made visible
     */
    public get isWorklistFilterShouldbeVisible() {
        return false;
    }

    /**
     * Returns the accurate accuracy indicator title
     */
    public get accurateAccuracyIndicatorTitle(): string {
        return localeStore.instance.TranslateText('generic.accuracy-indicators.accurate-tooltip');
    }

    /**
     * Returns the inaccurate accuracy indicator title
     */
    public get inaccurateAccuracyIndicatorTitle(): string {
        return localeStore.instance.TranslateText('generic.accuracy-indicators.inaccurate-tooltip');
    }

    /**
     * Returns the intolerance accuracy indicator title
     */
    public get intoleranceAccuracyIndicatorTitle(): string {
        return localeStore.instance.TranslateText('generic.accuracy-indicators.in-tolerance-tooltip');
    }

    /**
     * Returns the accurate accuracy indicator title
     */
    public get accurateOriginalAccuracyIndicatorTitle(): string {
        return localeStore.instance.TranslateText('generic.accuracy-indicators.original-mark-accurate-tooltip');
    }

    /**
     * Returns the inaccurate accuracy indicator title
     */
    public get inaccurateOriginalAccuracyIndicatorTitle(): string {
        return localeStore.instance.TranslateText('generic.accuracy-indicators.original-mark-inaccurate-tooltip');
    }

    /**
     * Returns the intolerance accuracy indicator title
     */
    public get intoleranceOriginalAccuracyIndicatorTitle(): string {
        return localeStore.instance.TranslateText('generic.accuracy-indicators.original-mark-in-tolerance-tooltip');
    }

    /**
     * Returns the amd title
     */
    public get absoluteMarkDifferenceTitle(): string {
        return 'marking.worklist.response-data.amd-tooltip';
    }

    /**
     * Returns the tmd title
     */
    public get totalMarkDifferenceTitle(): string {
        return 'marking.worklist.response-data.tmd-tooltip';
    }

    /**
     * returns true if QIG has the the marking instructions set
     */
    public get isMarkingInstructionLinkVisible(): boolean {
        if (qigStore.instance.selectedQIGForMarkerOperation) {
            return qigStore.instance.selectedQIGForMarkerOperation.hasMarkingInstructions;
        }

        return false;
    }

    /**
     * Returns whether the Open Tab should be visible for Standardisation worklist.
     */
    public shouldDisplayStandardisationOpenTab(targetSummary: markingTargetSummary): boolean {
        return true;
    }

    /**
     * Returns whether the Open Tab should have the helper message.
     */
    public get shouldDisplayHelperMessage(): boolean {
        return true;
    }

    /**
     * Returns whether the Enhanced off-page comments panel visible or not
     */
    public get isEnhancedOffPageCommentVisible(): boolean {
        return (responseStore.instance.markingMethod === enums.MarkingMethod.Unstructured || ccValues.isECourseworkComponent) &&
            stampStore.instance.isEnhancedOffPageCommentConfiguredForQIG;
    }

    /**
     * Returns whether the pending worklist banner visible or not
     */
    public get shouldDisplayPendingWorklistBanner(): boolean {
        return (worklistStore.instance.getResponseMode === enums.ResponseMode.pending && !worklistStore.instance.isMarkingCheckMode);
    }

    /**
     * Returns whether the off-page comments panel configured
     */
    public get isOffPageCommentConfigured(): boolean {
        return stampStore.instance.isOffPageCommentConfiguredForQIG;
	}

	/**
	 * Returns whether the off-page comments panel is visible aganist selected qig(whole response)
	 */
	public get isOffPageCommentVisibleForSelectedQig(): boolean {
		return stampStore.instance.isOffPageCommentVisible;
	}

	/**
	 * Returns whether the off-page comments panel editable or not
	 */
	public get isOffPageCommentEditable(): boolean {
		return (responseStore.instance.selectedResponseMode !== enums.ResponseMode.closed &&
			responseStore.instance.selectedResponseMode !== enums.ResponseMode.none);
	}

    /**
     * In marking operation mode supervisor review comments column is hidden
     */
    public get isSupervisorReviewCommentColumnHidden(): boolean {
        return true;
    }

    /**
     * Return true for displaying Zoning Exception Warning Popup.
     */
    public get hasZoningExceptionWarningPopup(): boolean {
        let openedResponseDetails =
                worklistStore.instance.getResponseDetails(responseStore.instance.selectedDisplayId.toString());
                if (openedResponseDetails) {
                return responseStore.instance.selectedResponseMode !== enums.ResponseMode.closed
                    && openedResponseDetails.hasZoningExceptions
                    && !openedResponseDetails.isZoningExceptionRaisedInSameScript
                    && !worklistStore.instance.isMarkingCheckMode;
                } else {
                    return false;
                }
    }

    //#region Standardisation Setup

    /**
     * return true if previous mark can be shown in standardisation setup
     */
    public get canRenderPreviousMarksInStandardisationSetup(): boolean {
        return false;
    }
    //#endregion
}

let markingOperationMode = new MarkingOperationMode();
export = markingOperationMode;