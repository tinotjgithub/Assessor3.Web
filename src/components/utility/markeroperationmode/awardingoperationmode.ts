import operationModeBase = require('./operationmodebase');
import qigStore = require('../../../stores/qigselector/qigstore');
import operationMode = require('./operationmode');
import enums = require('../enums');
import localeStore = require('../../../stores/locale/localestore');
import ccValues = require('../../../utility/configurablecharacteristic/configurablecharacteristicsvalues');
import operationModeHelper = require('../userdetails/userinfo/operationmodehelper');
import markingTargetSummary = require('../../../stores/worklist/typings/markingtargetsummary');
import rememberQig = require('../../../stores/useroption/typings/rememberqig');
import awardingStore = require('../../../stores/awarding/awardingstore');
import responseStore = require('../../../stores/response/responsestore');
import stampStore = require('../../../stores/stamp/stampstore');

class AwardingOperationMode extends operationModeBase implements operationMode {

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
        return true;
    }

    /**
     * Return true if selected tab is Help Examiners tab.
     */
    public get isHelpExaminersView(): boolean {
        return false;
    }

    // *** FRV *** //

    /**
     * Returns whether FlaggedAaSeen button will be visible or not.
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
        return false;
    };

    /**
     * Toggle button in FRV for structured component.
     */
    public hasShowToggleButtonOption = (componentType: enums.MarkingMethod): boolean => {
        return true;
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
     * we don't need to display mark by options in awarding mode.
     */
    public get hasMarkByOption(): boolean {
        return false;
    }

    /**
     * We don't need to select first unmarkable item in awarding mode.
     */
    public get isGetFirstUnmarkedItem(): boolean {
        return false;
    }

    /**
     * We don't need to consider quality feedback outstanding in awarding
     */
    public get isQualityFeedbackOutstanding(): boolean {
        return false;
    }

    /**
     * Returns a value indicating whether the Review Response is available.
     * @returns true if review response can be allowed else false.
     */
    public get allowReviewResponse(): boolean {
        return false;
    }

    /**
     * Returns a value indicating whether the supervisor sampling is enabled.
     * @returns true if supervisor sampling can be allowed else false.
     */
    public doShowSamplingButton = (markingProgress: number,
        worklistType: enums.WorklistType): boolean => {
        return false;
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
        return false;
    };

    /**
     * Returns the mark change reason title
     */
    public get markChangeReasonTitle(): string {
        return localeStore.instance.TranslateText
            ('team-management.examiner-worklist.response-data.mark-change-reason-not-specified-icon-tooltip');
    }

    /**
     * In Awarding view all the responses are in read only mode.
     */
    public get isResponseReadOnly(): boolean {
        return true;
    }

    // *** Toolbar panel *** //

    /**
     * Returns whether the supervisor remark button is visible or not.
     */
    public get isSupervisorRemarkButtonVisible(): boolean {
        return false;
    }

    /**
     * Returns whether the promote to seed button is visible or not.
     */
    public get isPromoteToSeedButtonVisible(): boolean {
        return false;
    }

    /**
     * Returns whether the any crm update is uploaded against this markgroup or not.
     */
    public get isCRMConfirmationPopupVisible(): boolean {
        return false;
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
        return '';
    }

    /**
     * Opened Response Details
     * @param {string} actualDisplayId
     * @returns {any}
     * @memberof AwardingOperationMode
     */
    public openedResponseDetails(actualDisplayId: string): any {
        let selectedCandidateData =
            awardingStore.instance.selectedCandidateData.responseItemGroups.
            filter(x => x.displayId === parseInt(actualDisplayId));
        return selectedCandidateData[0];
    }

    /**
     * Returns whether we need to remove from response details for updating the navigation count details.
     */
    public get isRemoveResponseFromWorklistDetails(): boolean {
        return false;
    }


    // *** Worklist grid *** //

    /**
     *  Return true if we need to show accuracy indicator else return false.
     */
    public get doShowAccuracyIndicator(): boolean {
        return false;
    }

    // *** live worklist *** //

    /**
     * Returns whether a response is seed or not.
     */
    public isSeedResponse = (responseData: ResponseBase): boolean => {
        return false;
    };

    /**
     * Returns whether the SLAO Indicator is hidden or not
     */
    public isSLAOIndicatorHidden = (isStructuredQIG: boolean): boolean => {
        return true;
    }

    /**
     * Returns whether the All Page Annoted Indicator is hidden or not
     */
    public isAllPageAnnotedIndicatorHidden = (isStructuredQIG: boolean): boolean => {
        return true;
    }

    /**
     * Returns whether linked exception indicator is visible
     */
    public get isLinkedExceptionIndicatorHidden(): boolean {
        return true;
    }

    /**
     *  Returns whether the quality feedback related columns are hidden or not.
     */
    public get isQualityFeedbackWorklistColumnsHidden(): boolean {
        return true;
    }

    /**
     * Returns whether the seed label is hidden or not
     */
    public get isSeedLabelHidden(): boolean {
        return true;
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
        return enums.ResponseMode.none;
    };

    /**
     * Applicable for worklist.tsx
     */
    public responseModeBasedOnQualityFeedbackForWorklist = (responseMode: enums.ResponseMode, markingMode?: enums.MarkingMode,
        remarkRequestTypeId?: enums.RemarkRequestType): enums.ResponseMode => {

        return enums.ResponseMode.none;
    };

    // **** Qig Selector **** //

    /**
     * Applicable for qigselector.tsx
     */
    public responseModeBasedOnQualityFeedbackForQigSelector = (responseMode: enums.ResponseMode, markingMode?: enums.MarkingMode,
        remarkRequestTypeId?: enums.RemarkRequestType): enums.ResponseMode => {

        return enums.ResponseMode.none;
    };

    /**
     * Applicable for Team Management mode only
     */
    public get responseMode(): enums.ResponseMode {
        return enums.ResponseMode.none;
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
        return true;

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
        return false;
    }

    // *** Marking Progress *** //

    /**
     * Returns true if we need to display marking progress in percentage.
     */
    public showMarkingProgressWithPercentage = (isMarkingInProgress: boolean): boolean => {
        // we have to display marking progress with %, we won't display submit button if marking progress is 100%
        return false;
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

        return false;
    }

    // *** Tree view data helper *** //

    /**
     * determine weather we need to render remarks or not
     */
    public get canRenderPreviousMarks(): boolean {

        return false;
    }

    /*
     * gets whether the response is closed EUR seed : Not required in Awarding
     */
    public get isClosedEurSeed(): boolean {
        return false;
    }

    /**
     * gets whether the response is closed Live seed or not : Not required in Awarding
     */
    public get isClosedLiveSeed(): boolean {
        return false;
    }

    /**
     * Get Current response seed type : Info Not required in Awarding
     */
    public get getCurrentResponseSeedType(): enums.SeedType {

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
        return false;
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
        return true;
    }

    /**
     * Return false for displaying Zoning Exception Warning Popup.
     */
    public get hasZoningExceptionWarningPopup(): boolean {
        return false;
    }

    /**
     * Return false for reuse button visibility.
     */
    public get isPromoteToReuseButtonVisible(): boolean {
        return false;
    }

    //#region Standardisation Setup

    /**
     * Return false for awarding operation.
     */
    public get isSelectResponsesTabInStdSetup(): boolean {
        return false;
    }

    /**
     * Return false for marking operation.
     */
    public get isPreviousSessionTabInStdSetup(): boolean {
        return false;
    }

    /**
     * Return false for awarding operation.
     */
    public get isUnclassifiedTabInStdSetup(): boolean {
        return false;
    }

	/**
	 * Return false for awarding operation.
	 */
	public get isClassifiedTabInStdSetup(): boolean {
		return false;
    }

    /**
     * return true if previous mark can be shown in standardisation setup
     */
    public get canRenderPreviousMarksInStandardisationSetup(): boolean {
        return false;
    }
    //#endregion
}

let awardingOperationMode = new AwardingOperationMode();
export = awardingOperationMode;