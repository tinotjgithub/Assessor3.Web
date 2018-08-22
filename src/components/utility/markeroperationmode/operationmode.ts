import markingTargetSummary = require('../../../stores/worklist/typings/markingtargetsummary');
import enums = require('../enums');
import rememberQig = require('../../../stores/useroption/typings/rememberqig');

/**
 * interface class for marker operation mode
 */
interface OperationMode {

   /**
    * Return true for marking operation mode and false for all other modes.
    */
    isMarkingMode: boolean;

   /**
    * Return false for marking operation mode and true for team management mode.
    */
    isTeamManagementMode: boolean;

    /**
     * Return true for standardisation setup operation mode.
     */
    isStandardisationSetupMode: boolean;

    /**
     * Return true for awarding operation mode.
     */
    isAwardingMode: boolean;

   /**
    * Return false for marking operation mode and true for team management mode.
    */
    isHelpExaminersView: boolean;

    // *** FRV changes *** //

   /**
    * We don't need to display flaged as seen button in TeamManagement view
    */
    isFlaggedAsSeenButtonVisible: boolean;

   /**
    * This will return the corresponding button text
    */
    markThisPageOrViewThisPageButtonText: string;

   /**
    * check whether we need to display Only show unannotated pages button or not
    */
    hasOnlyShowUnAnnotatedPagesOption(componentType: enums.MarkingMethod): boolean;

    /**
     * check whether we need to display toggle button or not for structured responses
     */
    hasShowToggleButtonOption(componentType: enums.MarkingMethod): boolean;

    /**
     * Reset the markingProgress flag in marking store back to true only if the response mode is
     * open. This flag is used while saving marks. Save marks will not happen for closed responses
     */
    isSaveMarksOnMarkingViewButtonClick: boolean;

   /**
    * returns marking or response button text
    */
    markingButtonText: string;

   /**
    * returns marking or response button tooltip text
    */
    markingButtonTooltipText: string;

   /**
    * Returns whether we need to display Link To Question option or not.
    */
    hasLinkToQuestion: boolean;

    /**
     * Returns whether we need to view whole page link or not.
     */
    showViewWholePageButton: boolean;

    // *** Response container *** //

    /**
     * Return true for displaying mark change reason.
     */
    showMarkChangeReason: boolean;

   /**
    * Returns whether we need to display MBQ confirmation or not.
    */
    showMbQConfirmation: boolean;


    // *** Mark scheme panel *** //

   /**
    * We will display submit button if marking progress is 100%
    */
    isSubmitVisible: boolean;

   /**
    * Returns whether the submit button is disabled or not
    */
    isSubmitDisabled(workListType: enums.WorklistType): boolean;

   /**
    * Returns true if we need to display mark by options else return false
    */
    hasMarkByOption: boolean;

   /**
    * Returns true if we need to select first unmarked item.
    */
    isGetFirstUnmarkedItem: boolean;

   /**
    * Returns whether the quality feedback is outstanding or not.
    */
    isQualityFeedbackOutstanding: boolean;

    /**
     * Returns a value indicating whether the Review Response is available.
     * @returns true if review response can be allowed else false.
     */
    allowReviewResponse: boolean;

    /**
     * Returns a value indicating whether the supervisor sampling is enabled.
     * @returns true if supervisor sampling can be allowed else false.
     */
    doShowSamplingButton(markingProgress: number,
        worklistType: enums.WorklistType): boolean;

   /**
    * Returns whether the submit button is disabled or not
    */
    isCompleteButtonVisible(markingProgress: number, hasSimpleOptionality: boolean): boolean;

   /**
    * Returns true if mark change reason icon is displaying in yellow
    */
    hasMarkChangeReasonYellowIcon(isResponseEditable: boolean, isInResponse: boolean): boolean;

   /**
    * Returns the mark change reason title
    */
    markChangeReasonTitle: string;

   /**
    * Returns whether the response is read only or not.
    */
    isResponseReadOnly: boolean;


    // *** Toolbar panel *** //

   /**
    * Returns whether the supervisor remark button is visible or not.
    */
    isSupervisorRemarkButtonVisible: boolean;

   /**
    * Returns whether the promote to seed button is visible or not.
    */
    isPromoteToSeedButtonVisible: boolean;

   /**
    * Returns whether the promote to reuse button is visible or not.
    */
    isPromoteToReuseButtonVisible: boolean;

   /**
    * Returns whether the promote to reuse button is visible or not.
    */
    isCRMConfirmationPopupVisible: boolean;

    /**
     * Returns the localised promote to reuse popup header text
     */
    promoteToReusePopupHeaderText: string;

    /**
     * Returns the localised promote to reusebucket popup header text
     */
    promoteToReuseBucketPopupContentText: string;

   /**
    * Returns the localised promote to seed popup header text
    */
    promoteToSeedPopupHeaderText: string;

   /**
    * Returns the localised promote to seed popup header text
    */
    promoteToSeedPopupContentText: string;

   /**
    * Returns whether we need to remove from response details for updating the navigation count details.
    */
    isRemoveResponseFromWorklistDetails: boolean;

    // *** Quality feedback helper *** //

   /**
    * Returns true if worklist disabled based on quality feedback.
    */
    isWorklistDisabledBasedOnQualityFeedback(worklistType: enums.WorklistType, remarkRequetType: enums.RemarkRequestType): boolean;

   /**
    * Returns true if response navigation is blocked.
    */
    isResponseNavigationBlocked(isQualityFeedbackPossibleInWorklist: boolean): boolean;

   /**
    * Returns true if tab is disabled based on quality feedback.
    */
    isTabDisabledBasedOnQualityFeedback(tabBasedOnQualityFeedback: enums.ResponseMode, currentTab: enums.ResponseMode): boolean;

   /**
    * Returns true if seeds needs to be highlighted.
    */
    isSeedNeededToBeHighlighted(qualityFeedBackStatus: enums.QualityFeedbackStatus, isSeedResponse: boolean): boolean;

   /**
    * Returns true if quality helper message needs to be displayed.
    */
    isQualtiyHelperMessageNeededToBeDisplayed(worklistType: enums.WorklistType): boolean;


    // *** Worklist *** //

   /**
    * Returns true if marks and annotations can download on background.
    */
    canInitiateMarkAndAnnotationsBackgroundDownload(responseMode: enums.ResponseMode): boolean;

   /**
    * Returns the tab need to be selected.
    */
    tabToBeSelected(selectedTab: enums.ResponseMode): enums.ResponseMode;


    // *** Worklist Grid *** //

    /**
     *  Return true if we need to show accuracy indicator else return false.
     */
    doShowAccuracyIndicator: boolean;


    // *** Live worklist *** //

   /**
    * Returns true if current response is seed.
    */
    isSeedResponse(responseData: ResponseBase): boolean;

   /**
    *  Returns whether the quality feedback related columns are hidden or not.
    */
    isQualityFeedbackWorklistColumnsHidden: boolean;

    /**
     * Returns whether the SLAO Indicator is hidden or not
     */
    isSLAOIndicatorHidden(isStructuredQIG: boolean): boolean;

    /**
     * Returns whether the All Page Annoted Indicator is hidden or not
     */
    isAllPageAnnotedIndicatorHidden(isStructuredQIG: boolean): boolean;

   /**
    * Returns whether the seed label is hidden or not
    */
    isSeedLabelHidden: boolean;

   /**
    * Returns whether the sample label is hidden or not
    */
    isSampleLabelHidden(worklistType: enums.WorklistType): boolean;

   /**
    * Returns whether the reviewed by label is hidden or not
    */
    isReviewedByLabelHidden: boolean;

   /**
    * Returns whether linked exception indicator is visible
    */
   isLinkedExceptionIndicatorHidden: boolean;

   /**
    * Returns the response mode based on quality feedback.
    */
    responseModeBasedOnQualityFeedback(responseMode: enums.ResponseMode, markingMode?: enums.MarkingMode,
        remarkRequestTypeId?: enums.RemarkRequestType, worklistType?: enums.WorklistType): enums.ResponseMode;

   /**
    * Returns the response mode based on quality feedback.
    */
    responseModeBasedOnQualityFeedbackForWorklist(responseMode: enums.ResponseMode, markingMode?: enums.MarkingMode,
        remarkRequestTypeId?: enums.RemarkRequestType): enums.ResponseMode;


    // *** Qig Selector *** //

   /**
    * Returns the response mode based on quality feedback.
    */
    responseModeBasedOnQualityFeedbackForQigSelector(responseMode: enums.ResponseMode, markingMode?: enums.MarkingMode,
        remarkRequestTypeId?: enums.RemarkRequestType): enums.ResponseMode;

   /**
    * applicable for TeamManagement mode only
    */
    responseMode: enums.ResponseMode;

    /**
     * Returns the selected qig id
     */
    getQigId: number;

    /**
     * Returns the selected qig details from user option
     */
    selectedQIGFromUserOption: rememberQig;


    // *** targets *** //

   /**
    * Returns whether the target is disabled or not.
    */
    isTargetDisabled(target: markingTargetSummary, previousTarget: markingTargetSummary): boolean;


    // *** Menu Wrapper *** //

    /**
     * Return true if we need to update marking progress in store
     */
    isSetMarkingInProgressAndMarkEntrySelectedRequired: boolean;


    // *** Message *** //

   /**
    * if marker viewing examiners worklist we don't need forward option
    */
    isForwardButtonHidden: boolean;

   /**
    * Returns whether we need to remove mandatory message priority or not.
    */
    isRemoveMandatoryMessagePriorityRequired(supervisorId: number): boolean;

   /**
    * In TeamManagement view supervisor can send new message from examiners response. (to corresponding examiner only)
    */
    sendMessageToExaminer(messageType: enums.MessageType): boolean;


    // *** Response Helper *** //

    /**
     * Returns whether the response is editable or not.
     */
    isResponseEditable: boolean;


    // *** Marking Progress *** //

   /**
    * Returns whether we need to display marking progress with percentage or not. (applicable for 100%)
    */
    showMarkingProgressWithPercentage(isMarkingInProgress: boolean): boolean;


    // *** Marking Helper *** //

   /**
    * Returns whether the mark change reason is needed or not.
    */
    isMarkChangeReasonNeeded(currentMarkingProgress: number): boolean;

    // *** Markscheme helper *** //

   /**
    * Returns whether we need to retrieve marks and annotations explicitly or not
    */
    isRetrieveMarksAndAnnotationsRequired(markGroupId: number, hasNonRecoverableErrors: boolean): boolean;


    // *** common properties / Methods implemented in operation mode base *** //

   /**
    * Returns true if examiner has quality feedback
    */
    isExaminerHasQualityFeedback: boolean;

   /**
    * Returns true if automatic quality feedback CC is on.
    */
    isAutomaticQualityFeedbackCCOn: boolean;

    // *** Annotation Helper *** //

   /**
    * We've to display previous annotation (definitive) in gray colour
    */
    isPreviousAnnotationsInGrayColour(seedType: enums.SeedType): boolean;

    // *** Tree view data helper *** //

   /**
    * Returns whether we need to render previous marks or not.
    */
    canRenderPreviousMarks: boolean;

   /**
    * gets whether the response is closed Live seed
    */
    isClosedLiveSeed: boolean;

    isClosedEurSeed: boolean;

   /**
    * Get current response seed type Id
    */
    getCurrentResponseSeedType: enums.SeedType;

    /**
     * Check the Worklist Filter can made visible
     */
    isWorklistFilterShouldbeVisible: boolean;

    /**
     * Returns the accurate accuracy indicator titile
     */
    accurateAccuracyIndicatorTitle: string;

    /**
     * Returns the inaccurate accuracy indicator titile
     */
    inaccurateAccuracyIndicatorTitle: string;

    /**
     * Returns the intolerance accuracy indicator titile
     */
    intoleranceAccuracyIndicatorTitle: string;

    /**
     * Returns the accurate accuracy indicator titile
     */
    accurateOriginalAccuracyIndicatorTitle: string;

    /**
     * Returns the inaccurate accuracy indicator titile
     */
    inaccurateOriginalAccuracyIndicatorTitle: string;

    /**
     * Returns the intolerance accuracy indicator titile
     */
    intoleranceOriginalAccuracyIndicatorTitle: string;

    /**
     * Returns the absolute mark difference title
     */
    absoluteMarkDifferenceTitle: string;

    /**
     * Returns the total marks difference title
     */
    totalMarkDifferenceTitle: string;

    /**
     * Returns the Marking Instruction Link Visible or not
     */
    isMarkingInstructionLinkVisible: boolean;

    /**
     * Returns whether the Open Tab should be visible for Standardisation worklist.
     */
    shouldDisplayStandardisationOpenTab(targetSummary: markingTargetSummary): boolean;

    /**
     * Returns whether the Open Tab should have the helper message.
     */
    shouldDisplayHelperMessage: boolean;

   /**
    * Returns whether the supervisor remark button should be visible or not.
    */
    shouldDisplaySupervisorRemarkButton: boolean;

   /**
    * Returns whether the logged-in examiner is PE or APE.
    */
    isLoggedInExaminerPEOrAPE: boolean;

    /**
     * Returns whether the logged-in examiner is PE or not.
     */
     isLoggedInExaminerPE: boolean;

    /**
     * Returns whether the selected examiner is PE or APE.
     */
    isSelectedExaminerPEOrAPE: boolean;

    /**
     * Returns whether the selected examiner is an STM.
     */
    isSelectedExaminerSTM: boolean;

    /**
     * Returns whether the logged-in examiner is an STM.
     */
    isLoggedInExaminerSTM: boolean;

    /**
     * Returns whether the CenterNumber visible or not.
     */
    shouldDisplayCenterNumber: boolean;

    /**
     * Returns whether the enhanced off-page comments visible or not.
     */
    isEnhancedOffPageCommentVisible: boolean;

    /**
     * Returns whether the pending worklist banner visible or not
     */
    shouldDisplayPendingWorklistBanner: boolean;

    /**
     * Returns whether the off-page comments configured or not.
     */
	isOffPageCommentConfigured: boolean;

	/**
	 * Returns whether the off-page comments visible aganist selected qig or not(Whole response).
	 */
	isOffPageCommentVisibleForSelectedQig: boolean;

	/**
	 * Returns whether the off-page comments editable or not.
	 */
	isOffPageCommentEditable: boolean;

    /**
     * Returns whether the supervisor review comments column in worklist is hidden or not
     */
    isSupervisorReviewCommentColumnHidden: boolean;

    /**
     * Returns whether the Zoning Exception Warning Popup is visible or not
     */
    hasZoningExceptionWarningPopup: boolean;

    /**
     * Returns the opened Response details when display is passed
     * @param {string} actualDisplayId 
     * @returns {ResponseBase} 
     * @memberof OperationMode
     */
    openedResponseDetails(actualDisplayId: string): any;

    /**
     * Get the reponse postion
     * @param {string} displayId 
     * @memberof OperationMode
     */
    getResponsePosition(displayId: string): number;

    /**
     * Returns whether next response is available or not
     * @param {string} displayId 
     * @returns {boolean} 
     * @memberof OperationMode
     */
    isNextResponseAvailable(displayId: string): boolean;

    /**
     * Returns whether previous response is available or not
     * 
     * @param {string} displayId 
     * @returns {boolean} 
     * @memberof OperationMode
     */
    isPreviousResponseAvailable(displayId: string): boolean;

    /**
     * Get the next response id
     * @param {string} displayId 
     * @returns {string} 
     * @memberof OperationMode
     */
    nextResponseId(displayId: string): string;

    /**
     * Get the previous response id
     * @param {string} displayId 
     * @returns {string} 
     * @memberof OperationMode
     */
    previousResponseId(displayId: string): string;

    /**
     * Returns the first response, in the sorted collection.
     */
    getIfOfFirstResponse: string;

    /**
     * Current response count
     * @type {number}
     * @memberof OperationMode
     */
    currentResponseCount: number;

    /**
     * Get the response details by markgroup id
     * @param {number} markGroupId 
     * @memberof OperationMode
     */
    getResponseDetailsByMarkGroupId(markGroupId: number);

    /**
     * Get tag id
     * @param {string} displayId 
     * @memberof OperationMode
     */
    getTagId(displayId: string);

    /**
     * return true if previous mark can be shown in standardisation setup
     */
    canRenderPreviousMarksInStandardisationSetup: boolean;


    /**
     * Returns a value indicating whether the Return Response To Marker is available.
     * @returns true if Return Response To Marker can be allowed else false.
     */
    allowReturnResponseToMarker: boolean;
}

export = OperationMode;