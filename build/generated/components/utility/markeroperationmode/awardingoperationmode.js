"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var operationModeBase = require('./operationmodebase');
var qigStore = require('../../../stores/qigselector/qigstore');
var enums = require('../enums');
var localeStore = require('../../../stores/locale/localestore');
var ccValues = require('../../../utility/configurablecharacteristic/configurablecharacteristicsvalues');
var operationModeHelper = require('../userdetails/userinfo/operationmodehelper');
var AwardingOperationMode = (function (_super) {
    __extends(AwardingOperationMode, _super);
    function AwardingOperationMode() {
        _super.apply(this, arguments);
        /**
         * We will show OnlyShowUnAnnotated pages option for unstructured responses in open response mode only
         */
        this.hasOnlyShowUnAnnotatedPagesOption = function (componentType) {
            return false;
        };
        /**
         * Toggle button in FRV for structured component.
         */
        this.hasShowToggleButtonOption = function (componentType) {
            return true;
        };
        /**
         * Returns whether the submit button is disabled or not.
         */
        this.isSubmitDisabled = function (workListType) {
            return false;
        };
        /**
         * Returns a value indicating whether the supervisor sampling is enabled.
         * @returns true if supervisor sampling can be allowed else false.
         */
        this.doShowSamplingButton = function (markingProgress, worklistType) {
            return false;
        };
        /**
         * return whether the complete button is to be visible or not (based on the CC value).
         */
        this.isCompleteButtonVisible = function (markingProgress, hasSimpleOptionality) {
            return false;
        };
        /**
         * True will display the yellow edit box icon
         */
        this.hasMarkChangeReasonYellowIcon = function (isResponseEditable, isInResponse) {
            return false;
        };
        // *** live worklist *** //
        /**
         * Returns whether a response is seed or not.
         */
        this.isSeedResponse = function (responseData) {
            return false;
        };
        /**
         * Returns whether the SLAO Indicator is hidden or not
         */
        this.isSLAOIndicatorHidden = function (isStructuredQIG) {
            return true;
        };
        /**
         * Returns whether the All Page Annoted Indicator is hidden or not
         */
        this.isAllPageAnnotedIndicatorHidden = function (isStructuredQIG) {
            return true;
        };
        // *** Quality feedback helper *** //
        /**
         * Return whether the worklist is disabled or not based on quality feedback
         */
        this.isWorklistDisabledBasedOnQualityFeedback = function (worklistType, remarkRequetType) {
            return false;
        };
        /**
         * Returns whether the response navigation is blocked or not.
         */
        this.isResponseNavigationBlocked = function (isQualityFeedbackPossibleInWorklist) {
            return false;
        };
        /**
         * Returns whether the tab is disabled based on quality feedback or not.
         */
        this.isTabDisabledBasedOnQualityFeedback = function (tabBasedOnQualityFeedback, currentTab) {
            return false;
        };
        /**
         * Returns whether the seeds needs to be highlighted or not.
         */
        this.isSeedNeededToBeHighlighted = function (qualityFeedBackStatus, isSeedResponse) {
            return false;
        };
        /**
         * Returns whether the quality helper message needs to be displayed or not.
         */
        this.isQualtiyHelperMessageNeededToBeDisplayed = function (worklistType) {
            return false;
        };
        /**
         * Applicable for targets.tsx and worklisttype.tsx
         */
        this.responseModeBasedOnQualityFeedback = function (responseMode, markingMode, remarkRequestTypeId, worklistType) {
            return enums.ResponseMode.none;
        };
        /**
         * Applicable for worklist.tsx
         */
        this.responseModeBasedOnQualityFeedbackForWorklist = function (responseMode, markingMode, remarkRequestTypeId) {
            return enums.ResponseMode.none;
        };
        // **** Qig Selector **** //
        /**
         * Applicable for qigselector.tsx
         */
        this.responseModeBasedOnQualityFeedbackForQigSelector = function (responseMode, markingMode, remarkRequestTypeId) {
            return enums.ResponseMode.none;
        };
        // *** Targets *** //
        /**
         * Returns whether the target is disabled or not.
         */
        this.isTargetDisabled = function (target, previousTarget) {
            return true;
        };
        // *** Worklist *** //
        /**
         * We don't need background download in teammanagement mode
         */
        this.canInitiateMarkAndAnnotationsBackgroundDownload = function (responseMode) {
            return false;
        };
        // *** worklist container *** //
        /**
         * Returns the tab to be selected.
         */
        this.tabToBeSelected = function (selectedTab) {
            return selectedTab;
        };
        /**
         * Returns whether we need to remove mandatory message priority or not.
         */
        this.isRemoveMandatoryMessagePriorityRequired = function (supervisorId) {
            return false;
        };
        /**
         * In TeamManagement view supervisor can send new message from examiners response. (to corresponding examiner only)
         */
        this.sendMessageToExaminer = function (messageType) {
            return false;
        };
        // *** Marking Progress *** //
        /**
         * Returns true if we need to display marking progress in percentage.
         */
        this.showMarkingProgressWithPercentage = function (isMarkingInProgress) {
            // we have to display marking progress with %, we won't display submit button if marking progress is 100%
            return false;
        };
        // *** Marking Helper *** //
        /**
         * Returns true if mark change reason needed else return false.
         */
        this.isMarkChangeReasonNeeded = function (currentMarkingProgress) {
            return false;
        };
        // *** Markscheme helper *** //
        /**
         * We've to load marks and annotations in team management view, because we've disabled the background download in TM view
         */
        this.isRetrieveMarksAndAnnotationsRequired = function (markGroupId, hasNonRecoverableErrors) {
            return true;
        };
        // *** Annotation Helper *** //
        /**
         * We've to display previous annotation (definitive) in gray colour
         */
        this.isPreviousAnnotationsInGrayColour = function (seedType) {
            return false;
        };
    }
    Object.defineProperty(AwardingOperationMode.prototype, "isMarkingMode", {
        /**
         * Return true for marking operation mode.
         */
        get: function () {
            return false;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AwardingOperationMode.prototype, "isTeamManagementMode", {
        /**
         * Return true for team management mode.
         */
        get: function () {
            return false;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AwardingOperationMode.prototype, "isStandardisationSetupMode", {
        /**
         * Return true for Standardisation setup operation.
         */
        get: function () {
            return false;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AwardingOperationMode.prototype, "isAwardingMode", {
        /**
         * Return true for Awarding operation mode.
         */
        get: function () {
            return true;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AwardingOperationMode.prototype, "isHelpExaminersView", {
        /**
         * Return true if selected tab is Help Examiners tab.
         */
        get: function () {
            return false;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AwardingOperationMode.prototype, "isFlaggedAsSeenButtonVisible", {
        // *** FRV *** //
        /**
         * Returns whether FlaggedAaSeen button will be visible or not.
         */
        get: function () {
            return false;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AwardingOperationMode.prototype, "markThisPageOrViewThisPageButtonText", {
        /**
         * This will return the corresponding button text
         */
        get: function () {
            return localeStore.instance.TranslateText('marking.full-response-view.script-page.view-this-page-button');
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AwardingOperationMode.prototype, "showViewWholePageButton", {
        /**
         * Returns whether we need to display view Whole page link.
         */
        get: function () {
            return false;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AwardingOperationMode.prototype, "isSaveMarksOnMarkingViewButtonClick", {
        /**
         * We don't need to save marks while clicking on Marking view button click
         */
        get: function () {
            return false;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AwardingOperationMode.prototype, "markingButtonText", {
        /**
         * Returns localisation key for marking button text - (response)
         */
        get: function () {
            return localeStore.instance.TranslateText('team-management.full-response-view.back-to-response-button');
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AwardingOperationMode.prototype, "markingButtonTooltipText", {
        /**
         * Returns localisation key for marking button tooltip text - (return to response)
         */
        get: function () {
            return localeStore.instance.TranslateText('team-management.full-response-view.back-to-response-button-tooltip');
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AwardingOperationMode.prototype, "hasLinkToQuestion", {
        /**
         * Returns whether we need to display Link To Question option or not.
         */
        get: function () {
            return false;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AwardingOperationMode.prototype, "showMarkChangeReason", {
        // *** Response container *** //
        /**
         * We don't need to display mark change reason in TeamManagement mode
         */
        get: function () {
            return false;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AwardingOperationMode.prototype, "showMbQConfirmation", {
        /**
         * We don't need to display mark by Question confirmation in TeamManagement mode
         */
        get: function () {
            return false;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AwardingOperationMode.prototype, "isSubmitVisible", {
        // *** Mark Scheme Panel *** //
        /**
         * Returns whether the submit button is visible or not
         */
        get: function () {
            return false;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AwardingOperationMode.prototype, "hasMarkByOption", {
        /**
         * we don't need to display mark by options in awarding mode.
         */
        get: function () {
            return false;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AwardingOperationMode.prototype, "isGetFirstUnmarkedItem", {
        /**
         * We don't need to select first unmarkable item in awarding mode.
         */
        get: function () {
            return false;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AwardingOperationMode.prototype, "isQualityFeedbackOutstanding", {
        /**
         * We don't need to consider quality feedback outstanding in awarding
         */
        get: function () {
            return false;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AwardingOperationMode.prototype, "allowReviewResponse", {
        /**
         * Returns a value indicating whether the Review Response is available.
         * @returns true if review response can be allowed else false.
         */
        get: function () {
            return false;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AwardingOperationMode.prototype, "markChangeReasonTitle", {
        /**
         * Returns the mark change reason title
         */
        get: function () {
            return localeStore.instance.TranslateText('team-management.examiner-worklist.response-data.mark-change-reason-not-specified-icon-tooltip');
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AwardingOperationMode.prototype, "isResponseReadOnly", {
        /**
         * In Awarding view all the responses are in read only mode.
         */
        get: function () {
            return true;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AwardingOperationMode.prototype, "isSupervisorRemarkButtonVisible", {
        // *** Toolbar panel *** //
        /**
         * Returns whether the supervisor remark button is visible or not.
         */
        get: function () {
            return false;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AwardingOperationMode.prototype, "isPromoteToSeedButtonVisible", {
        /**
         * Returns whether the promote to seed button is visible or not.
         */
        get: function () {
            return false;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AwardingOperationMode.prototype, "isCRMConfirmationPopupVisible", {
        /**
         * Returns whether the any crm update is uploaded against this markgroup or not.
         */
        get: function () {
            return false;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AwardingOperationMode.prototype, "promoteToReusePopupHeaderText", {
        /**
         * Returns the localised promote to reuse bucket popup header text
         */
        get: function () {
            return localeStore.instance.TranslateText('team-management.response.promote-to-reuse-bucket-dialog.header');
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AwardingOperationMode.prototype, "promoteToReuseBucketPopupContentText", {
        /**
         * Returns the localised promote to reuse bucket popup content
         */
        get: function () {
            return localeStore.instance.TranslateText('team-management.response.promote-to-reuse-bucket-dialog.body');
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AwardingOperationMode.prototype, "promoteToSeedPopupHeaderText", {
        /**
         * Returns the localised promote to seed popup header text
         */
        get: function () {
            return localeStore.instance.TranslateText('team-management.response.promote-to-seed-dialog.header');
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AwardingOperationMode.prototype, "promoteToSeedPopupContentText", {
        /**
         * Returns the localised promote to seed popup header text
         */
        get: function () {
            if (qigStore.instance.selectedQIGForMarkerOperation.isElectronicStandardisationTeamMember && !ccValues.examinerCentreExclusivity) {
                return localeStore.instance.TranslateText('team-management.response.promote-to-seed-dialog.body-stm-subordinate-response');
            }
            else {
                return localeStore.instance.TranslateText('team-management.response.promote-to-seed-dialog.body-non-stm-subordinate-response');
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AwardingOperationMode.prototype, "isRemoveResponseFromWorklistDetails", {
        /**
         * Returns whether we need to remove from response details for updating the navigation count details.
         */
        get: function () {
            return false;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AwardingOperationMode.prototype, "doShowAccuracyIndicator", {
        // *** Worklist grid *** //
        /**
         *  Return true if we need to show accuracy indicator else return false.
         */
        get: function () {
            return false;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AwardingOperationMode.prototype, "isLinkedExceptionIndicatorHidden", {
        /**
         * Returns whether linked exception indicator is visible
         */
        get: function () {
            return true;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AwardingOperationMode.prototype, "isQualityFeedbackWorklistColumnsHidden", {
        /**
         *  Returns whether the quality feedback related columns are hidden or not.
         */
        get: function () {
            return true;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AwardingOperationMode.prototype, "isSeedLabelHidden", {
        /**
         * Returns whether the seed label is hidden or not
         */
        get: function () {
            return true;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Returns whether the sample label is hidden or not
     */
    AwardingOperationMode.prototype.isSampleLabelHidden = function (worklistType) {
        return true;
    };
    Object.defineProperty(AwardingOperationMode.prototype, "isReviewedByLabelHidden", {
        /**
         * Returns whether the reviewed by label is hidden or not
         */
        get: function () {
            return true;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AwardingOperationMode.prototype, "responseMode", {
        /**
         * Applicable for Team Management mode only
         */
        get: function () {
            return enums.ResponseMode.none;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AwardingOperationMode.prototype, "getQigId", {
        /**
         * Returns the selected qig id
         */
        get: function () {
            return operationModeHelper.markSchemeGroupId;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AwardingOperationMode.prototype, "selectedQIGFromUserOption", {
        /**
         * Returns the selected qig from user option
         */
        get: function () {
            return this.previousSelectedQIGFromUserOption;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AwardingOperationMode.prototype, "isSetMarkingInProgressAndMarkEntrySelectedRequired", {
        // *** Menu wrapper *** //
        /**
         * Return true if we need to update marking progress in store else return false.
         */
        get: function () {
            return false;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AwardingOperationMode.prototype, "isForwardButtonHidden", {
        // *** Message *** //
        /**
         * Returns whether the forward button is hidden or not in view.
         */
        get: function () {
            return true;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AwardingOperationMode.prototype, "isResponseEditable", {
        // *** Response Helper *** //
        /**
         * Returns whether the response is editable or not.
         */
        get: function () {
            return false;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AwardingOperationMode.prototype, "canRenderPreviousMarks", {
        // *** Tree view data helper *** //
        /**
         * determine weather we need to render remarks or not
         */
        get: function () {
            return false;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AwardingOperationMode.prototype, "isClosedEurSeed", {
        /*
         * gets whether the response is closed EUR seed : Not required in Awarding
         */
        get: function () {
            return false;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AwardingOperationMode.prototype, "isClosedLiveSeed", {
        /**
         * gets whether the response is closed Live seed or not : Not required in Awarding
         */
        get: function () {
            return false;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AwardingOperationMode.prototype, "getCurrentResponseSeedType", {
        /**
         * Get Current response seed type : Info Not required in Awarding
         */
        get: function () {
            return enums.SeedType.None;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AwardingOperationMode.prototype, "isWorklistFilterShouldbeVisible", {
        /**
         * Check the Worklist Filter can made visible
         */
        get: function () {
            return false;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AwardingOperationMode.prototype, "accurateAccuracyIndicatorTitle", {
        /**
         * Returns the accurate accuracy indicator title
         */
        get: function () {
            return localeStore.instance.TranslateText('generic.accuracy-indicators.accurate-tooltip-team-management');
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AwardingOperationMode.prototype, "inaccurateAccuracyIndicatorTitle", {
        /**
         * Returns the inaccurate accuracy indicator title
         */
        get: function () {
            return localeStore.instance.TranslateText('generic.accuracy-indicators.inaccurate-tooltip-team-management');
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AwardingOperationMode.prototype, "intoleranceAccuracyIndicatorTitle", {
        /**
         * Returns the intolerance accuracy indicator title
         */
        get: function () {
            return localeStore.instance.TranslateText('generic.accuracy-indicators.in-tolerance-tooltip-team-management');
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AwardingOperationMode.prototype, "accurateOriginalAccuracyIndicatorTitle", {
        /**
         * Returns the accurate accuracy indicator title
         */
        get: function () {
            return localeStore.instance.TranslateText('generic.accuracy-indicators.original-mark-accurate-tooltip-team-management');
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AwardingOperationMode.prototype, "inaccurateOriginalAccuracyIndicatorTitle", {
        /**
         * Returns the inaccurate accuracy indicator title
         */
        get: function () {
            return localeStore.instance.TranslateText('generic.accuracy-indicators.original-mark-inaccurate-tooltip-team-management');
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AwardingOperationMode.prototype, "intoleranceOriginalAccuracyIndicatorTitle", {
        /**
         * Returns the intolerance accuracy indicator title
         */
        get: function () {
            return localeStore.instance.TranslateText('generic.accuracy-indicators.original-mark-in-tolerance-tooltip-team-management');
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AwardingOperationMode.prototype, "absoluteMarkDifferenceTitle", {
        /**
         * Returns the amd title
         */
        get: function () {
            return 'team-management.examiner-worklist.response-data.amd-tooltip';
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AwardingOperationMode.prototype, "totalMarkDifferenceTitle", {
        /**
         * Returns the tmd title
         */
        get: function () {
            return 'team-management.examiner-worklist.response-data.tmd-tooltip';
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AwardingOperationMode.prototype, "isMarkingInstructionLinkVisible", {
        /**
         * returns false for team management
         */
        get: function () {
            return false;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Returns whether the Open Tab should be visible for Standardisation worklist.
     * Should be visible Only If Not In Help Examiner Tab And If there are any responses in open tab or. Not downloaded yet.
     */
    AwardingOperationMode.prototype.shouldDisplayStandardisationOpenTab = function (targetSummary) {
        return false;
    };
    Object.defineProperty(AwardingOperationMode.prototype, "shouldDisplayHelperMessage", {
        /**
         * Returns whether the Open Tab should have the helper message.
         */
        get: function () {
            return false;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AwardingOperationMode.prototype, "isEnhancedOffPageCommentVisible", {
        /**
         * Returns whether the Enhanced off-page comments panel visible or not
         */
        get: function () {
            return false;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AwardingOperationMode.prototype, "shouldDisplayPendingWorklistBanner", {
        /**
         * Returns whether the pending worklist banner visible or not
         */
        get: function () {
            return false;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AwardingOperationMode.prototype, "isOffPageCommentConfigured", {
        /**
         * Returns whether the off-page comments panel visible or not
         */
        get: function () {
            return false;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AwardingOperationMode.prototype, "isOffPageCommentVisibleForSelectedQig", {
        /**
         * Returns whether the off-page comments panel is visible aganist selected qig(whole response)
         */
        get: function () {
            return false;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AwardingOperationMode.prototype, "isOffPageCommentEditable", {
        /**
         * Returns whether the off-page comments panel editable or not
         */
        get: function () {
            return false;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AwardingOperationMode.prototype, "isSupervisorReviewCommentColumnHidden", {
        /**
         * Check whether supervisor review comments column is hidden or not
         */
        get: function () {
            return true;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AwardingOperationMode.prototype, "hasZoningExceptionWarningPopup", {
        /**
         * Return false for displaying Zoning Exception Warning Popup.
         */
        get: function () {
            return false;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AwardingOperationMode.prototype, "isPromoteToReuseButtonVisible", {
        /**
         * Return false for reuse button visibility.
         */
        get: function () {
            return false;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AwardingOperationMode.prototype, "isSelectResponsesTabInStdSetup", {
        //#region Standardisation Setup
        /**
         * Return false for awarding operation.
         */
        get: function () {
            return false;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AwardingOperationMode.prototype, "isUnclassifiedTabInStdSetup", {
        /**
         * Return false for awarding operation.
         */
        get: function () {
            return false;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AwardingOperationMode.prototype, "isClassifiedTabInStdSetup", {
        /**
         * Return false for awarding operation.
         */
        get: function () {
            return false;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AwardingOperationMode.prototype, "isDefinitveMarkingStarted", {
        /**
         * Return false for awarding operation.
         */
        get: function () {
            return false;
        },
        enumerable: true,
        configurable: true
    });
    return AwardingOperationMode;
}(operationModeBase));
var awardingOperationMode = new AwardingOperationMode();
module.exports = awardingOperationMode;
//# sourceMappingURL=awardingoperationmode.js.map