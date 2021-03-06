﻿import targetSummaryStore = require('../../../stores/worklist/targetsummarystore');
import operationModeBase = require('./operationmodebase');
import qigStore = require('../../../stores/qigselector/qigstore');
import examinerStore = require('../../../stores/markerinformation/examinerstore');
import operationMode = require('./operationmode');
import enums = require('../enums');
import localeStore = require('../../../stores/locale/localestore');
import worklistStore = require('../../../stores/worklist/workliststore');
import ccHelper = require('../../../utility/configurablecharacteristic/configurablecharacteristicshelper');
import ccNames = require('../../../utility/configurablecharacteristic/configurablecharacteristicsnames');
import ccValues = require('../../../utility/configurablecharacteristic/configurablecharacteristicsvalues');
import operationModeHelper = require('../userdetails/userinfo/operationmodehelper');
import markingTargetSummary = require('../../../stores/worklist/typings/markingtargetsummary');
import teamManagementStore = require('../../../stores/teammanagement/teammanagementstore');
import responseStore = require('../../../stores/response/responsestore');
import rememberQig = require('../../../stores/useroption/typings/rememberqig');
import targetHelper = require('../../../utility/target/targethelper');
import stampStore = require('../../../stores/stamp/stampstore');

class TeamManagementOperationMode extends operationModeBase implements operationMode {

    /**
     * Return true for marking operation mode.
     */
    public get isMarkingMode(): boolean {
        return false;
    }

    /**
     * Return true for team management mode.
     */
    public get isTeamManagementMode(): boolean {
        return true;
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
     * Return true if selected tab is Help Examiners tab.
     */
    public get isHelpExaminersView(): boolean {
        return teamManagementStore.instance.selectedTeamManagementTab === enums.TeamManagement.HelpExaminers;
    }

    // *** FRV *** //

    /**
     * We won't display flaggedAsSeen button in team management mode.
     */
    public get isFlaggedAsSeenButtonVisible(): boolean {
        return false;
    }

    /**
     * This will return the corresponding button text
     */
    public get markThisPageOrViewThisPageButtonText(): string {
        return localeStore.instance.TranslateText('marking.full-response-view.script-page.view-this-page-button');
    }

    /**
     * We will show OnlyShowUnAnnotated pages option for unstructured responses in open response mode only
     */
    public hasOnlyShowUnAnnotatedPagesOption = (componentType: enums.MarkingMethod): boolean => {
        return componentType === enums.MarkingMethod.Unstructured &&
            worklistStore.instance.getResponseMode === enums.ResponseMode.open;
    };

    /**
     * toggle button is not showing in team management mode of structured responses.
     */
    public hasShowToggleButtonOption = (componentType: enums.MarkingMethod): boolean => {
        return false;
    };

    /**
     * Returns whether we need to display view Whole page link.
     */
    public get showViewWholePageButton(): boolean {
        return false;
    }

    /**
     * We don't need to save marks while clicking on Marking view button click
     */
    public get isSaveMarksOnMarkingViewButtonClick(): boolean {
        return false;
    }

    /**
     * Returns localisation key for marking button text - (response)
     */
    public get markingButtonText(): string {
        return localeStore.instance.TranslateText('team-management.full-response-view.back-to-response-button');
    }

    /**
     * Returns localisation key for marking button tooltip text - (return to response)
     */
    public get markingButtonTooltipText(): string {
        return localeStore.instance.TranslateText('team-management.full-response-view.back-to-response-button-tooltip');
    }

    /**
     * Returns whether we need to display Link To Question option or not.
     */
    public get hasLinkToQuestion(): boolean {
        return false;
    }

    // *** Response container *** //

    /**
     * We don't need to display mark change reason in TeamManagement mode
     */
    public get showMarkChangeReason(): boolean {
        return false;
    }

    /**
     * We don't need to display mark by Question confirmation in TeamManagement mode
     */
    public get showMbQConfirmation(): boolean {
        return false;
    }

    // *** Mark Scheme Panel *** //

    /**
     * Returns whether the submit button is visible or not
     */
    public get isSubmitVisible(): boolean {
        return false;
    }

    /**
     * Returns whether the submit button is disabled or not.
     */
    public isSubmitDisabled = (workListType: enums.WorklistType): boolean => {
        return false;
    };

    /**
     * we don't need to display mark by options in team management mode.
     */
    public get hasMarkByOption(): boolean {
        return false;
    }

    /**
     * We don't need to select first unmarkable item in team management mode.
     */
    public get isGetFirstUnmarkedItem(): boolean {
        return false;
    }

    /**
     * We don't need to consider quality feedback outstanding in TeamManagement
     */
    public get isQualityFeedbackOutstanding(): boolean {
        return false;
    }

    /**
     * Returns a value indicating whether the Review Response is available.
     * @returns true if review response can be allowed else false.
     */
    public get allowReviewResponse(): boolean {

        let isSeniorExaminerPoolCCOn = ccHelper.getCharacteristicValue(
            ccNames.SeniorExaminerPool,
            qigStore.instance.selectedQIGForMarkerOperation.markSchemeGroupId).toLowerCase() === 'true' ? true : false;
        let workListType: enums.WorklistType = worklistStore.instance.currentWorklistType;
        let isClosedResponse: boolean = (worklistStore.instance.getResponseMode === enums.ResponseMode.closed) ? true : false;
        let currentExaminerApprovalStatus = examinerStore.instance.getMarkerInformation.currentExaminerApprovalStatus;

        return currentExaminerApprovalStatus !== enums.ExaminerApproval.NotApproved &&
            currentExaminerApprovalStatus !== enums.ExaminerApproval.Suspended &&
            !isSeniorExaminerPoolCCOn &&
            ((this.isClosedLiveSeed ||
                workListType === enums.WorklistType.standardisation ||
                workListType === enums.WorklistType.secondstandardisation) && isClosedResponse)
            && !this.isCurrentResponseDefinitive;
    }

    /**
     * Returns a value indicating whether the supervisor sampling is enabled.
     * @returns true if supervisor sampling can be allowed else false.
     */
    public doShowSamplingButton = (markingProgress: number,
        worklistType: enums.WorklistType): boolean => {
        return this.getSupervisorSamplingCCValue(worklistType) &&
            !this.isHelpExaminersView &&
            this.getCurrentResponseSeedType === enums.SeedType.None &&
            !this.isCurrentResponseDefinitive &&
            (markingProgress === 100 ?
                true :
                (responseStore.instance.sampleReviewCommentId !== enums.SampleReviewComment.None &&
                    responseStore.instance.sampleReviewCommentCreatedBy === teamManagementStore.instance.selectedExaminerRoleId) ?
                    true : false
            );
    }

    /**
     * return whether the complete button is to be visible or not (based on the CC value).
     */
    public isCompleteButtonVisible = (markingProgress: number, hasSimpleOptionality: boolean): boolean => {
        return false;
    };

    /**
     * True will display the yellow edit box icon
     */
    public hasMarkChangeReasonYellowIcon = (isResponseEditable: boolean, isInResponse: boolean): boolean => {
        return true;
    };

    /**
     * Returns the mark change reason title
     */
    public get markChangeReasonTitle(): string {
        return localeStore.instance.TranslateText
            ('team-management.examiner-worklist.response-data.mark-change-reason-not-specified-icon-tooltip');
    }

    /**
     * In Team Management view all the responses are in read only mode.
     */
    public get isResponseReadOnly(): boolean {
        return true;
    }

    // *** Toolbar panel *** //

    /**
     * Returns whether the supervisor remark button is visible or not.
     */
    public get isSupervisorRemarkButtonVisible(): boolean {

        let currentResponse: LiveClosedResponse | PendingResponse =
            (worklistStore.instance.getCurrentWorklistResponseBaseDetails().filter((x: ResponseBase) =>
                x.markGroupId === responseStore.instance.selectedMarkGroupId).first()) as LiveClosedResponse | PendingResponse;

        // If the response is tagged as a specialist then need to check the logged in user is specialist marker or not.
        let isButtonVisibleForSpecialistTypeResponse: boolean =
        (currentResponse && currentResponse.specialistType !== '' && currentResponse.atypicalStatus === 0) ?
            examinerStore.instance.getMarkerInformation.isCurrentExaminerSpecialist : true;

        return (this.shouldDisplaySupervisorRemarkButton
            && this.getCurrentResponseSeedType === enums.SeedType.None && isButtonVisibleForSpecialistTypeResponse);
    }

    /**
     * Returns whether the promote to seed button is visible or not.
     */
    public get isPromoteToSeedButtonVisible(): boolean {
        let currentResponse: LiveClosedResponse | PendingResponse =
            (worklistStore.instance.getCurrentWorklistResponseBaseDetails().filter((x: ResponseBase) =>
                x.markGroupId === responseStore.instance.selectedMarkGroupId).first()) as LiveClosedResponse | PendingResponse;

        let remarkRequestType = worklistStore.instance.getRemarkRequestType;

        let currentMarkingMode: enums.MarkingMode =
            worklistStore.instance.getMarkingModeByWorkListType(worklistStore.instance.currentWorklistType);
        // Can promote to seed variable will hold the data related to the seed targets.
        // We don't need to display promote to seed button while response is opened from team management exceptions tab.
        return this.isLoggedInExaminerPEOrAPE && worklistStore.instance.getResponseMode !== enums.ResponseMode.open
            && (currentMarkingMode === enums.MarkingMode.LiveMarking || currentMarkingMode === enums.MarkingMode.Remarking)
            && this.getCurrentResponseSeedType === enums.SeedType.None &&
            (currentResponse && !(currentResponse).isWithdrawnSeed) && (currentResponse && !(currentResponse).isPromotedSeed)
            && (currentResponse && !(currentResponse).hasDefinitiveMarks) && worklistStore.instance.hasSeedTargets
            && teamManagementStore.instance.selectedTeamManagementTab !== enums.TeamManagement.Exceptions
            && qigStore.instance.getSelectedQIGForTheLoggedInUser.examinerApprovalStatus === enums.ExaminerApproval.Approved
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
    public get promoteToSeedPopupHeaderText(): string {
        return localeStore.instance.TranslateText('team-management.response.promote-to-seed-dialog.header');
    }

    /**
     * Returns the localised promote to seed popup header text
     */
    public get promoteToSeedPopupContentText(): string {
        if (qigStore.instance.selectedQIGForMarkerOperation.isElectronicStandardisationTeamMember && !ccValues.examinerCentreExclusivity) {
            return localeStore.instance.TranslateText('team-management.response.promote-to-seed-dialog.body-stm-subordinate-response');
        } else {
            return localeStore.instance.TranslateText('team-management.response.promote-to-seed-dialog.body-non-stm-subordinate-response');
        }
    }

    /**
     * Returns whether we need to remove from response details for updating the navigation count details.
     */
    public get isRemoveResponseFromWorklistDetails(): boolean {
        return !(this.isClosed && (ccValues.examinerCentreExclusivity ||
            !qigStore.instance.selectedQIGForMarkerOperation.isElectronicStandardisationTeamMember));
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
            || (workListType === enums.WorklistType.live || workListType === enums.WorklistType.directedRemark))) {
            return true;
        } else {
            return false;
        }
    }

    // *** live worklist *** //

    /**
     * Returns whether a response is seed or not.
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
        return this.isHelpExaminersView;
    }

    /**
     *  Returns whether the quality feedback related columns are hidden or not.
     */
    public get isQualityFeedbackWorklistColumnsHidden(): boolean {
        return false;
    }

    /**
     * Returns whether the seed label is hidden or not
     */
    public get isSeedLabelHidden(): boolean {
        return false;
    }

    /**
     * Returns whether the sample label is hidden or not
     */
    public isSampleLabelHidden(worklistType: enums.WorklistType): boolean {
        return !this.getSupervisorSamplingCCValue(worklistType);
    }

    /**
     * Returns whether the reviewed by label is hidden or not
     */
    public get isReviewedByLabelHidden(): boolean {
        return this.getSeniorExaminerPoolCCValue();
    }

    // *** Quality feedback helper *** //

    /**
     * Return whether the worklist is disabled or not based on quality feedback
     */
    public isWorklistDisabledBasedOnQualityFeedback = (worklistType: enums.WorklistType,
        remarkRequetType: enums.RemarkRequestType): boolean => {
        return false;
    };

    /**
     * Returns whether the response navigation is blocked or not.
     */
    public isResponseNavigationBlocked = (isQualityFeedbackPossibleInWorklist: boolean): boolean => {
        return false;
    };

    /**
     * Returns whether the tab is disabled based on quality feedback or not.
     */
    public isTabDisabledBasedOnQualityFeedback = (tabBasedOnQualityFeedback: enums.ResponseMode, currentTab: enums.ResponseMode):
        boolean => {
        return false;
    };

    /**
     * Returns whether the seeds needs to be highlighted or not.
     */
    public isSeedNeededToBeHighlighted = (qualityFeedBackStatus: enums.QualityFeedbackStatus, isSeedResponse: boolean): boolean => {
        return false;
    };

    /**
     * Returns whether the quality helper message needs to be displayed or not.
     */
    public isQualtiyHelperMessageNeededToBeDisplayed = (worklistType: enums.WorklistType): boolean => {
        return false;
    };

    /**
     * Applicable for targets.tsx and worklisttype.tsx
     */
    public responseModeBasedOnQualityFeedback = (responseMode: enums.ResponseMode, markingMode?: enums.MarkingMode,
        remarkRequestTypeId?: enums.RemarkRequestType, worklistType?: enums.WorklistType): enums.ResponseMode => {
        let responseModeBasedOnQualityFeedback: enums.ResponseMode = this.getResponseModeBasedOnQualityFeedback;
        return responseModeBasedOnQualityFeedback !== undefined ? responseModeBasedOnQualityFeedback :
            operationModeHelper.getSelectedResponseMode(markingMode, remarkRequestTypeId, worklistType, this.isSelectedExaminerSTM);
    };

    /**
     * Applicable for worklist.tsx
     */
    public responseModeBasedOnQualityFeedbackForWorklist = (responseMode: enums.ResponseMode, markingMode?: enums.MarkingMode,
        remarkRequestTypeId?: enums.RemarkRequestType): enums.ResponseMode => {

        // Sets the response mode based on quality feedback.
        let responseModeBasedOnQualityFeedback: enums.ResponseMode = this.getResponseModeBasedOnQualityFeedback;

        return responseModeBasedOnQualityFeedback !== undefined ?
            responseModeBasedOnQualityFeedback :
            worklistStore.instance.getResponseMode !== undefined && worklistStore.instance.getResponseMode !== null ?
                worklistStore.instance.getResponseMode
                : operationModeHelper.getSelectedResponseMode(markingMode, remarkRequestTypeId, undefined, this.isSelectedExaminerSTM);
    };

    // **** Qig Selector **** //

    /**
     * Applicable for qigselector.tsx
     */
    public responseModeBasedOnQualityFeedbackForQigSelector = (responseMode: enums.ResponseMode, markingMode?: enums.MarkingMode,
        remarkRequestTypeId?: enums.RemarkRequestType): enums.ResponseMode => {
        let responseModeBasedOnQualityFeedback: enums.ResponseMode = this.getResponseModeBasedOnQualityFeedback;

        return worklistStore.instance.getResponseMode !== undefined &&
            worklistStore.instance.getResponseMode !== null ? worklistStore.instance.getResponseMode :
            responseModeBasedOnQualityFeedback !== undefined ? responseModeBasedOnQualityFeedback :
                operationModeHelper.getSelectedResponseMode(markingMode, remarkRequestTypeId, undefined, this.isSelectedExaminerSTM);
    };

    /**
     * Applicable for Team Management mode only
     */
    public get responseMode(): enums.ResponseMode {
        return worklistStore.instance.getResponseMode !== undefined &&
            worklistStore.instance.getResponseMode !== null ?
            worklistStore.instance.getResponseMode : operationModeHelper.getSelectedResponseMode();
    }

    /**
     * Returns the selected qig id
     */
    public get getQigId(): number {
        return operationModeHelper.markSchemeGroupId;
    }

    /**
     * Returns the selected qig from user option
     */
    public get selectedQIGFromUserOption(): rememberQig {
        return this.previousSelectedQIGFromUserOption;
    }

    // *** Targets *** //


    /**
     * Returns whether the target is disabled or not.
     */
    public isTargetDisabled = (target: markingTargetSummary, previousTarget: markingTargetSummary): boolean => {

        // Determine if the item is shown in a disabled status here.
        // In the future state the item is disabled.
        let isTargetDisabled: boolean = true;
        if (target.markingModeID === enums.MarkingMode.Remarking && !this.isMarkerApprovedOrSuspended) {
            // When the marker is in 'Not Approved' state then the remarking tab should be disabled
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
     * Return true if we need to update marking progress in store else return false.
     */
    public get isSetMarkingInProgressAndMarkEntrySelectedRequired(): boolean {
        return false;
    }

    // *** Worklist *** //

    /**
     * We don't need background download in teammanagement mode
     */
    public canInitiateMarkAndAnnotationsBackgroundDownload = (responseMode: enums.ResponseMode): boolean => {
        return false;
    };

    // *** worklist container *** //

    /**
     * Returns the tab to be selected.
     */
    public tabToBeSelected = (selectedTab: enums.ResponseMode): enums.ResponseMode => {
        return selectedTab;
    };

    // *** Message *** //

    /**
     * Returns whether the forward button is hidden or not in view.
     */
    public get isForwardButtonHidden(): boolean {
        return true;
    }

    /**
     * Returns whether we need to remove mandatory message priority or not.
     */
    public isRemoveMandatoryMessagePriorityRequired = (supervisorId: number): boolean => {
        return supervisorId !== examinerStore.instance.parentExaminerId;
    };

    /**
     * In TeamManagement view supervisor can send new message from examiners response. (to corresponding examiner only)
     */
    public sendMessageToExaminer = (messageType: enums.MessageType): boolean => {
        return messageType === enums.MessageType.ResponseCompose;
    }

    // *** Response Helper *** //

    /**
     * Returns whether the response is editable or not.
     */
    public get isResponseEditable(): boolean {
        return false;
    }

    // *** Marking Progress *** //

    /**
     * Returns true if we need to display marking progress in percentage.
     */
    public showMarkingProgressWithPercentage = (isMarkingInProgress: boolean): boolean => {
        // we have to display marking progress with %, we won't display submit button if marking progress is 100%
        return true;
    }

    // *** Marking Helper *** //

    /**
     * Returns true if mark change reason needed else return false.
     */
    public isMarkChangeReasonNeeded = (currentMarkingProgress: number): boolean => {
        return false;
    }

    // *** Markscheme helper *** //

    /**
     * We've to load marks and annotations in team management view, because we've disabled the background download in TM view
     */
    public isRetrieveMarksAndAnnotationsRequired = (markGroupId: number, hasNonRecoverableErrors: boolean): boolean => {
        return true;
    }

    // *** Annotation Helper *** //

    /**
     * We've to display previous annotation (definitive) in gray colour
     */
    public isPreviousAnnotationsInGrayColour = (seedType: enums.SeedType): boolean => {
        let currentWorklistType: enums.WorklistType = worklistStore.instance.currentWorklistType;
        let currentResponseMode: enums.ResponseMode = worklistStore.instance.getResponseMode;

        return currentWorklistType === enums.WorklistType.practice || currentWorklistType === enums.WorklistType.standardisation ||
            currentWorklistType === enums.WorklistType.secondstandardisation || currentWorklistType === enums.WorklistType.live ||
            (currentWorklistType === enums.WorklistType.directedRemark &&
                (currentResponseMode === enums.ResponseMode.closed || currentResponseMode === enums.ResponseMode.open) &&
                seedType === enums.SeedType.EUR);
    }

    // *** Tree view data helper *** //

    /**
     * determine weather we need to render remarks or not
     */
    public get canRenderPreviousMarks(): boolean {

        if ((this.isDirectedRemark && this.isCurrentResponseSeed === enums.SeedType.None) || this.isPractice || this.isPooledRemark) {
            return true;
        } else if ((this.isStandardisation || this.isSecondStandardisation) && (this.isClosed || this.isOpen)) {
            if (this.hasShowStandardisationDefinitiveMarksCC) {
                return true;
            }
        } else if ((this.isDirectedRemark || this.isLive || this.isPooledRemark) &&
            (this.isClosed || (this.isOpen && this.hasShowTLSeedDefinitiveMarksCC))
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
     * gets whether the response is closed Live seed or not
     */
    public get isClosedLiveSeed(): boolean {
        return worklistStore.instance.currentWorklistType === enums.WorklistType.live &&
            this.getCurrentResponseSeedType === enums.SeedType.Gold;
    }

    /**
     * Get closed response seed type Id
     */
    public get getCurrentResponseSeedType(): enums.SeedType {

        if (worklistStore.instance.getResponseMode === enums.ResponseMode.closed ||
            worklistStore.instance.getResponseMode === enums.ResponseMode.open) {
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
        return teamManagementStore.instance.selectedTeamManagementTab !== enums.TeamManagement.HelpExaminers &&
            this.isLive && this.isClosed;
    }

    /**
     * Returns the accurate accuracy indicator title
     */
    public get accurateAccuracyIndicatorTitle(): string {
        return localeStore.instance.TranslateText('generic.accuracy-indicators.accurate-tooltip-team-management');
    }

    /**
     * Returns the inaccurate accuracy indicator title
     */
    public get inaccurateAccuracyIndicatorTitle(): string {
        return localeStore.instance.TranslateText('generic.accuracy-indicators.inaccurate-tooltip-team-management');
    }


    /**
     * Returns the intolerance accuracy indicator title
     */
    public get intoleranceAccuracyIndicatorTitle(): string {
        return localeStore.instance.TranslateText('generic.accuracy-indicators.in-tolerance-tooltip-team-management');
    }

    /**
     * Returns the accurate accuracy indicator title
     */
    public get accurateOriginalAccuracyIndicatorTitle(): string {
        return localeStore.instance.TranslateText('generic.accuracy-indicators.original-mark-accurate-tooltip-team-management');
    }

    /**
     * Returns the inaccurate accuracy indicator title
     */
    public get inaccurateOriginalAccuracyIndicatorTitle(): string {
        return localeStore.instance.TranslateText('generic.accuracy-indicators.original-mark-inaccurate-tooltip-team-management');
    }

    /**
     * Returns the intolerance accuracy indicator title
     */
    public get intoleranceOriginalAccuracyIndicatorTitle(): string {
        return localeStore.instance.TranslateText('generic.accuracy-indicators.original-mark-in-tolerance-tooltip-team-management');
    }

    /**
     * Returns the amd title
     */
    public get absoluteMarkDifferenceTitle(): string {
        return 'team-management.examiner-worklist.response-data.amd-tooltip';
    }

    /**
     * Returns the tmd title
     */
    public get totalMarkDifferenceTitle(): string {
        return 'team-management.examiner-worklist.response-data.tmd-tooltip';
    }

    /**
     * returns false for team management
     */
    public get isMarkingInstructionLinkVisible(): boolean {
        return false;
    }

    /**
     * Returns whether the Open Tab should be visible for Standardisation worklist.
     * Should be visible Only If Not In Help Examiner Tab And If there are any responses in open tab or. Not downloaded yet.
     */
    public shouldDisplayStandardisationOpenTab(targetSummary: markingTargetSummary): boolean {
        let isESTargetCompleted = false;
        if (targetSummary.markingModeID === enums.MarkingMode.ES_TeamApproval) {
            isESTargetCompleted = targetHelper.isESTargetCompleted(enums.MarkingMode.ES_TeamApproval);
        }

        return !isESTargetCompleted && teamManagementStore.instance.selectedTeamManagementTab !== enums.TeamManagement.HelpExaminers
            && (targetSummary.examinerProgress.openResponsesCount > 0 || targetSummary.examinerProgress.closedResponsesCount === 0);
    }

    /**
     * Returns whether the Open Tab should have the helper message.
     */
    public get shouldDisplayHelperMessage(): boolean {
        return false;
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
        return false;
    }

    /**
     * Returns whether the off-page comments panel visible or not
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
		return false;
	}

    /**
     * Check whether supervisor review comments column is hidden or not
     */
    public get isSupervisorReviewCommentColumnHidden(): boolean {
        return this.getSeniorExaminerPoolCCValue() || !ccValues.supervisorReviewComments;
    }

    /**
     * Return false for displaying Zoning Exception Warning Popup.
     */
    public get hasZoningExceptionWarningPopup(): boolean {
        return false;
    }

    //#region Standardisation Setup

    /**
     * return true if previous mark can be shown in standardisation setup
     */
    public get canRenderPreviousMarksInStandardisationSetup(): boolean {
        return false;
    }

    /**
     * Returns a value indicating whether the Return Response To Marker is available.
     * @returns true if Return Response To Marker can be allowed else false.
     */
    public get allowReturnResponseToMarker(): boolean {

        let isReturnToMarkerCCOn = ccHelper.getCharacteristicValue(
            ccNames.ReturnToMarker,
            qigStore.instance.selectedQIGForMarkerOperation.markSchemeGroupId).toLowerCase() === 'true' ? true : false;
        let workListType: enums.WorklistType = worklistStore.instance.currentWorklistType;
        let responsedetails: ResponseBase = worklistStore.instance.getResponseDetails(
            responseStore.instance.selectedDisplayId.toString());
        let selectedMarkerApprovalStatus = qigStore.instance.selectedQIGForMarkerOperation.examinerApprovalStatus;

        let isSeniorExaminerPoolCCOn = ccHelper.getCharacteristicValue(
            ccNames.SeniorExaminerPool,
            qigStore.instance.selectedQIGForMarkerOperation.markSchemeGroupId).toLowerCase() === 'true' ? true : false;
        let isClosedResponse: boolean = (worklistStore.instance.getResponseMode === enums.ResponseMode.closed) ? true : false;
        let currentExaminerApprovalStatus = examinerStore.instance.getMarkerInformation.currentExaminerApprovalStatus;

        // show return response button for an unreviewed standardisation or secondstandardisation closed response
        // if ReturnToMarkerCC is On and SeniorExaminerPoolCC is off and 
        // the logged in marker in approved state and selected marker in not approved state
        return isReturnToMarkerCCOn &&
            currentExaminerApprovalStatus === enums.ExaminerApproval.Approved &&
            selectedMarkerApprovalStatus === enums.ExaminerApproval.NotApproved &&
            !this.isClosedLiveSeed &&
            !responsedetails.isReviewed &&
            !isSeniorExaminerPoolCCOn &&
            ((workListType === enums.WorklistType.standardisation ||
                workListType === enums.WorklistType.secondstandardisation) && isClosedResponse);
    }
    //#endregion
}

let teamManagementOperationMode = new TeamManagementOperationMode();
export = teamManagementOperationMode;