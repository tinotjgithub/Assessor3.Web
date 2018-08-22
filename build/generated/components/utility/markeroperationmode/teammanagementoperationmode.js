"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var targetSummaryStore = require('../../../stores/worklist/targetsummarystore');
var operationModeBase = require('./operationmodebase');
var qigStore = require('../../../stores/qigselector/qigstore');
var examinerStore = require('../../../stores/markerinformation/examinerstore');
var enums = require('../enums');
var localeStore = require('../../../stores/locale/localestore');
var worklistStore = require('../../../stores/worklist/workliststore');
var ccHelper = require('../../../utility/configurablecharacteristic/configurablecharacteristicshelper');
var ccNames = require('../../../utility/configurablecharacteristic/configurablecharacteristicsnames');
var ccValues = require('../../../utility/configurablecharacteristic/configurablecharacteristicsvalues');
var operationModeHelper = require('../userdetails/userinfo/operationmodehelper');
var teamManagementStore = require('../../../stores/teammanagement/teammanagementstore');
var responseStore = require('../../../stores/response/responsestore');
var targetHelper = require('../../../utility/target/targethelper');
var stampStore = require('../../../stores/stamp/stampstore');
var TeamManagementOperationMode = (function (_super) {
    __extends(TeamManagementOperationMode, _super);
    function TeamManagementOperationMode() {
        var _this = this;
        _super.apply(this, arguments);
        /**
         * We will show OnlyShowUnAnnotated pages option for unstructured responses in open response mode only
         */
        this.hasOnlyShowUnAnnotatedPagesOption = function (componentType) {
            return componentType === enums.MarkingMethod.Unstructured &&
                worklistStore.instance.getResponseMode === enums.ResponseMode.open;
        };
        /**
         * toggle button is not showing in team management mode of structured responses.
         */
        this.hasShowToggleButtonOption = function (componentType) {
            return false;
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
            return _this.getSupervisorSamplingCCValue(worklistType) &&
                !_this.isHelpExaminersView &&
                _this.getCurrentResponseSeedType === enums.SeedType.None &&
                !_this.isCurrentResponseDefinitive &&
                (markingProgress === 100 ?
                    true :
                    (responseStore.instance.sampleReviewCommentId !== enums.SampleReviewComment.None &&
                        responseStore.instance.sampleReviewCommentCreatedBy === teamManagementStore.instance.selectedExaminerRoleId) ?
                        true : false);
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
            return true;
        };
        // *** live worklist *** //
        /**
         * Returns whether a response is seed or not.
         */
        this.isSeedResponse = function (responseData) {
            var isSeedResponse = responseData.seedTypeId !== enums.SeedType.None;
            // we have to display the seed label in TeamManagement subordinate live closed response view irrespective of
            // Accuracy Indicator CC
            return isSeedResponse && responseData.accuracyIndicatorTypeID !== enums.AccuracyIndicatorType.Unknown;
        };
        /**
         * Returns whether the SLAO Indicator is hidden or not
         */
        this.isSLAOIndicatorHidden = function (isStructuredQIG) {
            if (!isStructuredQIG) {
                return true;
            }
        };
        /**
         * Returns whether the All Page Annoted Indicator is hidden or not
         */
        this.isAllPageAnnotedIndicatorHidden = function (isStructuredQIG) {
            if (isStructuredQIG) {
                return true;
            }
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
            var responseModeBasedOnQualityFeedback = _this.getResponseModeBasedOnQualityFeedback;
            return responseModeBasedOnQualityFeedback !== undefined ? responseModeBasedOnQualityFeedback :
                operationModeHelper.getSelectedResponseMode(markingMode, remarkRequestTypeId, worklistType, _this.isSelectedExaminerSTM);
        };
        /**
         * Applicable for worklist.tsx
         */
        this.responseModeBasedOnQualityFeedbackForWorklist = function (responseMode, markingMode, remarkRequestTypeId) {
            // Sets the response mode based on quality feedback.
            var responseModeBasedOnQualityFeedback = _this.getResponseModeBasedOnQualityFeedback;
            return responseModeBasedOnQualityFeedback !== undefined ?
                responseModeBasedOnQualityFeedback :
                worklistStore.instance.getResponseMode !== undefined && worklistStore.instance.getResponseMode !== null ?
                    worklistStore.instance.getResponseMode
                    : operationModeHelper.getSelectedResponseMode(markingMode, remarkRequestTypeId, undefined, _this.isSelectedExaminerSTM);
        };
        // **** Qig Selector **** //
        /**
         * Applicable for qigselector.tsx
         */
        this.responseModeBasedOnQualityFeedbackForQigSelector = function (responseMode, markingMode, remarkRequestTypeId) {
            var responseModeBasedOnQualityFeedback = _this.getResponseModeBasedOnQualityFeedback;
            return worklistStore.instance.getResponseMode !== undefined &&
                worklistStore.instance.getResponseMode !== null ? worklistStore.instance.getResponseMode :
                responseModeBasedOnQualityFeedback !== undefined ? responseModeBasedOnQualityFeedback :
                    operationModeHelper.getSelectedResponseMode(markingMode, remarkRequestTypeId, undefined, _this.isSelectedExaminerSTM);
        };
        // *** Targets *** //
        /**
         * Returns whether the target is disabled or not.
         */
        this.isTargetDisabled = function (target, previousTarget) {
            // Determine if the item is shown in a disabled status here.
            // In the future state the item is disabled.
            var isTargetDisabled = true;
            if (target.markingModeID === enums.MarkingMode.Remarking && !_this.isMarkerApprovedOrSuspended) {
                // When the marker is in 'Not Approved' state then the remarking tab should be disabled
                return isTargetDisabled;
            }
            else if (target.isCurrentTarget || target.isTargetCompleted || (previousTarget !== undefined && previousTarget.isTargetCompleted)
                || targetSummaryStore.instance.getCurrentTarget().markingModeID === enums.MarkingMode.LiveMarking) {
                isTargetDisabled = target.markingModeID !== enums.MarkingMode.LiveMarking ? false
                    : previousTarget === undefined ? false : !_this.isMarkerApprovedOrSuspended;
            }
            return isTargetDisabled;
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
            return supervisorId !== examinerStore.instance.parentExaminerId;
        };
        /**
         * In TeamManagement view supervisor can send new message from examiners response. (to corresponding examiner only)
         */
        this.sendMessageToExaminer = function (messageType) {
            return messageType === enums.MessageType.ResponseCompose;
        };
        // *** Marking Progress *** //
        /**
         * Returns true if we need to display marking progress in percentage.
         */
        this.showMarkingProgressWithPercentage = function (isMarkingInProgress) {
            // we have to display marking progress with %, we won't display submit button if marking progress is 100%
            return true;
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
            var currentWorklistType = worklistStore.instance.currentWorklistType;
            var currentResponseMode = worklistStore.instance.getResponseMode;
            return currentWorklistType === enums.WorklistType.practice || currentWorklistType === enums.WorklistType.standardisation ||
                currentWorklistType === enums.WorklistType.secondstandardisation || currentWorklistType === enums.WorklistType.live ||
                (currentWorklistType === enums.WorklistType.directedRemark &&
                    (currentResponseMode === enums.ResponseMode.closed || currentResponseMode === enums.ResponseMode.open) &&
                    seedType === enums.SeedType.EUR);
        };
    }
    Object.defineProperty(TeamManagementOperationMode.prototype, "isMarkingMode", {
        /**
         * Return true for marking operation mode.
         */
        get: function () {
            return false;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TeamManagementOperationMode.prototype, "isTeamManagementMode", {
        /**
         * Return true for team management mode.
         */
        get: function () {
            return true;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TeamManagementOperationMode.prototype, "isStandardisationSetupMode", {
        /**
         * Return true for Standardisation setup operation.
         */
        get: function () {
            return false;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TeamManagementOperationMode.prototype, "isAwardingMode", {
        /**
         * Return true for Awarding operation mode.
         */
        get: function () {
            return false;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TeamManagementOperationMode.prototype, "isHelpExaminersView", {
        /**
         * Return true if selected tab is Help Examiners tab.
         */
        get: function () {
            return teamManagementStore.instance.selectedTeamManagementTab === enums.TeamManagement.HelpExaminers;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TeamManagementOperationMode.prototype, "isFlaggedAsSeenButtonVisible", {
        // *** FRV *** //
        /**
         * We won't display flaggedAsSeen button in team management mode.
         */
        get: function () {
            return false;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TeamManagementOperationMode.prototype, "markThisPageOrViewThisPageButtonText", {
        /**
         * This will return the corresponding button text
         */
        get: function () {
            return localeStore.instance.TranslateText('marking.full-response-view.script-page.view-this-page-button');
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TeamManagementOperationMode.prototype, "showViewWholePageButton", {
        /**
         * Returns whether we need to display view Whole page link.
         */
        get: function () {
            return false;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TeamManagementOperationMode.prototype, "isSaveMarksOnMarkingViewButtonClick", {
        /**
         * We don't need to save marks while clicking on Marking view button click
         */
        get: function () {
            return false;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TeamManagementOperationMode.prototype, "markingButtonText", {
        /**
         * Returns localisation key for marking button text - (response)
         */
        get: function () {
            return localeStore.instance.TranslateText('team-management.full-response-view.back-to-response-button');
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TeamManagementOperationMode.prototype, "markingButtonTooltipText", {
        /**
         * Returns localisation key for marking button tooltip text - (return to response)
         */
        get: function () {
            return localeStore.instance.TranslateText('team-management.full-response-view.back-to-response-button-tooltip');
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TeamManagementOperationMode.prototype, "hasLinkToQuestion", {
        /**
         * Returns whether we need to display Link To Question option or not.
         */
        get: function () {
            return false;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TeamManagementOperationMode.prototype, "showMarkChangeReason", {
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
    Object.defineProperty(TeamManagementOperationMode.prototype, "showMbQConfirmation", {
        /**
         * We don't need to display mark by Question confirmation in TeamManagement mode
         */
        get: function () {
            return false;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TeamManagementOperationMode.prototype, "isSubmitVisible", {
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
    Object.defineProperty(TeamManagementOperationMode.prototype, "hasMarkByOption", {
        /**
         * we don't need to display mark by options in team management mode.
         */
        get: function () {
            return false;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TeamManagementOperationMode.prototype, "isGetFirstUnmarkedItem", {
        /**
         * We don't need to select first unmarkable item in team management mode.
         */
        get: function () {
            return false;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TeamManagementOperationMode.prototype, "isQualityFeedbackOutstanding", {
        /**
         * We don't need to consider quality feedback outstanding in TeamManagement
         */
        get: function () {
            return false;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TeamManagementOperationMode.prototype, "allowReviewResponse", {
        /**
         * Returns a value indicating whether the Review Response is available.
         * @returns true if review response can be allowed else false.
         */
        get: function () {
            var isSeniorExaminerPoolCCOn = ccHelper.getCharacteristicValue(ccNames.SeniorExaminerPool, qigStore.instance.selectedQIGForMarkerOperation.markSchemeGroupId).toLowerCase() === 'true' ? true : false;
            var workListType = worklistStore.instance.currentWorklistType;
            var isClosedResponse = (worklistStore.instance.getResponseMode === enums.ResponseMode.closed) ? true : false;
            var currentExaminerApprovalStatus = examinerStore.instance.getMarkerInformation.currentExaminerApprovalStatus;
            return currentExaminerApprovalStatus !== enums.ExaminerApproval.NotApproved &&
                currentExaminerApprovalStatus !== enums.ExaminerApproval.Suspended &&
                !isSeniorExaminerPoolCCOn &&
                ((this.isClosedLiveSeed ||
                    workListType === enums.WorklistType.standardisation ||
                    workListType === enums.WorklistType.secondstandardisation) && isClosedResponse)
                && !this.isCurrentResponseDefinitive;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TeamManagementOperationMode.prototype, "markChangeReasonTitle", {
        /**
         * Returns the mark change reason title
         */
        get: function () {
            return localeStore.instance.TranslateText('team-management.examiner-worklist.response-data.mark-change-reason-not-specified-icon-tooltip');
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TeamManagementOperationMode.prototype, "isResponseReadOnly", {
        /**
         * In Team Management view all the responses are in read only mode.
         */
        get: function () {
            return true;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TeamManagementOperationMode.prototype, "isSupervisorRemarkButtonVisible", {
        // *** Toolbar panel *** //
        /**
         * Returns whether the supervisor remark button is visible or not.
         */
        get: function () {
            var currentResponse = (worklistStore.instance.getCurrentWorklistResponseBaseDetails().filter(function (x) {
                return x.markGroupId === responseStore.instance.selectedMarkGroupId;
            }).first());
            // If the response is tagged as a specialist then need to check the logged in user is specialist marker or not.
            var isButtonVisibleForSpecialistTypeResponse = (currentResponse && currentResponse.specialistType !== '' && currentResponse.atypicalStatus === 0) ?
                examinerStore.instance.getMarkerInformation.isCurrentExaminerSpecialist : true;
            return (this.shouldDisplaySupervisorRemarkButton
                && this.getCurrentResponseSeedType === enums.SeedType.None && isButtonVisibleForSpecialistTypeResponse);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TeamManagementOperationMode.prototype, "isPromoteToSeedButtonVisible", {
        /**
         * Returns whether the promote to seed button is visible or not.
         */
        get: function () {
            var currentResponse = (worklistStore.instance.getCurrentWorklistResponseBaseDetails().filter(function (x) {
                return x.markGroupId === responseStore.instance.selectedMarkGroupId;
            }).first());
            var remarkRequestType = worklistStore.instance.getRemarkRequestType;
            var currentMarkingMode = worklistStore.instance.getMarkingModeByWorkListType(worklistStore.instance.currentWorklistType);
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
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TeamManagementOperationMode.prototype, "isCRMConfirmationPopupVisible", {
        /**
         * Returns whether the any crm update is uploaded against this markgroup or not.
         */
        get: function () {
            var currentResponse = worklistStore.instance.getResponseDetailsByMarkGroupId(responseStore.instance.selectedMarkGroupId);
            return (currentResponse).candidateResponseTotalarkGroupID !== 0 &&
                (currentResponse).candidateResponseTotalarkGroupID !== (currentResponse).markGroupId;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TeamManagementOperationMode.prototype, "promoteToReusePopupHeaderText", {
        /**
         * Returns the localised promote to reuse bucket popup header text
         */
        get: function () {
            return localeStore.instance.TranslateText('team-management.response.promote-to-reuse-bucket-dialog.header');
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TeamManagementOperationMode.prototype, "promoteToReuseBucketPopupContentText", {
        /**
         * Returns the localised promote to reuse bucket popup content
         */
        get: function () {
            return localeStore.instance.TranslateText('team-management.response.promote-to-reuse-bucket-dialog.body');
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TeamManagementOperationMode.prototype, "promoteToSeedPopupHeaderText", {
        /**
         * Returns the localised promote to seed popup header text
         */
        get: function () {
            return localeStore.instance.TranslateText('team-management.response.promote-to-seed-dialog.header');
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TeamManagementOperationMode.prototype, "promoteToSeedPopupContentText", {
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
    Object.defineProperty(TeamManagementOperationMode.prototype, "isRemoveResponseFromWorklistDetails", {
        /**
         * Returns whether we need to remove from response details for updating the navigation count details.
         */
        get: function () {
            return !(this.isClosed && (ccValues.examinerCentreExclusivity ||
                !qigStore.instance.selectedQIGForMarkerOperation.isElectronicStandardisationTeamMember));
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TeamManagementOperationMode.prototype, "doShowAccuracyIndicator", {
        // *** Worklist grid *** //
        /**
         *  Return true if we need to show accuracy indicator else return false.
         */
        get: function () {
            var workListType = worklistStore.instance.currentWorklistType;
            var _isShowStandardisationDefinitiveMarks = ccHelper.getCharacteristicValue(ccNames.ShowStandardisationDefinitiveMarks, qigStore.instance.selectedQIGForMarkerOperation.markSchemeGroupId).toLowerCase() === 'true';
            if ((workListType === enums.WorklistType.practice ||
                (_isShowStandardisationDefinitiveMarks &&
                    (workListType === enums.WorklistType.standardisation || workListType === enums.WorklistType.secondstandardisation))
                || (workListType === enums.WorklistType.live || workListType === enums.WorklistType.directedRemark))) {
                return true;
            }
            else {
                return false;
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TeamManagementOperationMode.prototype, "isLinkedExceptionIndicatorHidden", {
        /**
         * Returns whether linked exception indicator is visible
         */
        get: function () {
            return this.isHelpExaminersView;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TeamManagementOperationMode.prototype, "isQualityFeedbackWorklistColumnsHidden", {
        /**
         *  Returns whether the quality feedback related columns are hidden or not.
         */
        get: function () {
            return false;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TeamManagementOperationMode.prototype, "isSeedLabelHidden", {
        /**
         * Returns whether the seed label is hidden or not
         */
        get: function () {
            return false;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Returns whether the sample label is hidden or not
     */
    TeamManagementOperationMode.prototype.isSampleLabelHidden = function (worklistType) {
        return !this.getSupervisorSamplingCCValue(worklistType);
    };
    Object.defineProperty(TeamManagementOperationMode.prototype, "isReviewedByLabelHidden", {
        /**
         * Returns whether the reviewed by label is hidden or not
         */
        get: function () {
            return this.getSeniorExaminerPoolCCValue();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TeamManagementOperationMode.prototype, "responseMode", {
        /**
         * Applicable for Team Management mode only
         */
        get: function () {
            return worklistStore.instance.getResponseMode !== undefined &&
                worklistStore.instance.getResponseMode !== null ?
                worklistStore.instance.getResponseMode : operationModeHelper.getSelectedResponseMode();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TeamManagementOperationMode.prototype, "getQigId", {
        /**
         * Returns the selected qig id
         */
        get: function () {
            return operationModeHelper.markSchemeGroupId;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TeamManagementOperationMode.prototype, "selectedQIGFromUserOption", {
        /**
         * Returns the selected qig from user option
         */
        get: function () {
            return this.previousSelectedQIGFromUserOption;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TeamManagementOperationMode.prototype, "isSetMarkingInProgressAndMarkEntrySelectedRequired", {
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
    Object.defineProperty(TeamManagementOperationMode.prototype, "isForwardButtonHidden", {
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
    Object.defineProperty(TeamManagementOperationMode.prototype, "isResponseEditable", {
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
    Object.defineProperty(TeamManagementOperationMode.prototype, "canRenderPreviousMarks", {
        // *** Tree view data helper *** //
        /**
         * determine weather we need to render remarks or not
         */
        get: function () {
            if ((this.isDirectedRemark && this.isCurrentResponseSeed === enums.SeedType.None) || this.isPractice || this.isPooledRemark) {
                return true;
            }
            else if ((this.isStandardisation || this.isSecondStandardisation) && (this.isClosed || this.isOpen)) {
                if (this.hasShowStandardisationDefinitiveMarksCC) {
                    return true;
                }
            }
            else if ((this.isDirectedRemark || this.isLive || this.isPooledRemark) &&
                (this.isClosed || (this.isOpen && this.hasShowTLSeedDefinitiveMarksCC))
                && this.isCurrentResponseSeed !== enums.SeedType.None) {
                if (this.isAutomaticQualityFeedbackCCOn) {
                    return true;
                }
            }
            else {
                return false;
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TeamManagementOperationMode.prototype, "isClosedEurSeed", {
        /*
         * gets whether the response is closed EUR seed
         */
        get: function () {
            return worklistStore.instance.currentWorklistType === enums.WorklistType.directedRemark &&
                this.getCurrentResponseSeedType === enums.SeedType.EUR;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TeamManagementOperationMode.prototype, "isClosedLiveSeed", {
        /**
         * gets whether the response is closed Live seed or not
         */
        get: function () {
            return worklistStore.instance.currentWorklistType === enums.WorklistType.live &&
                this.getCurrentResponseSeedType === enums.SeedType.Gold;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TeamManagementOperationMode.prototype, "getCurrentResponseSeedType", {
        /**
         * Get closed response seed type Id
         */
        get: function () {
            if (worklistStore.instance.getResponseMode === enums.ResponseMode.closed ||
                worklistStore.instance.getResponseMode === enums.ResponseMode.open) {
                var responseCollection = worklistStore.instance.getCurrentWorklistResponseBaseDetails();
                if (responseCollection) {
                    var response = null;
                    for (var i = 0; i < responseCollection.size; i++) {
                        if (responseCollection.get(i).markGroupId === responseStore.instance.selectedMarkGroupId) {
                            response = responseCollection.get(i);
                            break;
                        }
                    }
                    // Seed type should be returned only in the case of Closed responses
                    if (response) {
                        switch (worklistStore.instance.currentWorklistType) {
                            case enums.WorklistType.live:
                                return response.seedTypeId;
                            case enums.WorklistType.directedRemark:
                                return response.seedTypeId;
                            default:
                                return enums.SeedType.None;
                        }
                    }
                }
            }
            return enums.SeedType.None;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TeamManagementOperationMode.prototype, "isWorklistFilterShouldbeVisible", {
        /**
         * Check the Worklist Filter can made visible
         */
        get: function () {
            return teamManagementStore.instance.selectedTeamManagementTab !== enums.TeamManagement.HelpExaminers &&
                this.isLive && this.isClosed;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TeamManagementOperationMode.prototype, "accurateAccuracyIndicatorTitle", {
        /**
         * Returns the accurate accuracy indicator title
         */
        get: function () {
            return localeStore.instance.TranslateText('generic.accuracy-indicators.accurate-tooltip-team-management');
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TeamManagementOperationMode.prototype, "inaccurateAccuracyIndicatorTitle", {
        /**
         * Returns the inaccurate accuracy indicator title
         */
        get: function () {
            return localeStore.instance.TranslateText('generic.accuracy-indicators.inaccurate-tooltip-team-management');
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TeamManagementOperationMode.prototype, "intoleranceAccuracyIndicatorTitle", {
        /**
         * Returns the intolerance accuracy indicator title
         */
        get: function () {
            return localeStore.instance.TranslateText('generic.accuracy-indicators.in-tolerance-tooltip-team-management');
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TeamManagementOperationMode.prototype, "accurateOriginalAccuracyIndicatorTitle", {
        /**
         * Returns the accurate accuracy indicator title
         */
        get: function () {
            return localeStore.instance.TranslateText('generic.accuracy-indicators.original-mark-accurate-tooltip-team-management');
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TeamManagementOperationMode.prototype, "inaccurateOriginalAccuracyIndicatorTitle", {
        /**
         * Returns the inaccurate accuracy indicator title
         */
        get: function () {
            return localeStore.instance.TranslateText('generic.accuracy-indicators.original-mark-inaccurate-tooltip-team-management');
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TeamManagementOperationMode.prototype, "intoleranceOriginalAccuracyIndicatorTitle", {
        /**
         * Returns the intolerance accuracy indicator title
         */
        get: function () {
            return localeStore.instance.TranslateText('generic.accuracy-indicators.original-mark-in-tolerance-tooltip-team-management');
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TeamManagementOperationMode.prototype, "absoluteMarkDifferenceTitle", {
        /**
         * Returns the amd title
         */
        get: function () {
            return 'team-management.examiner-worklist.response-data.amd-tooltip';
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TeamManagementOperationMode.prototype, "totalMarkDifferenceTitle", {
        /**
         * Returns the tmd title
         */
        get: function () {
            return 'team-management.examiner-worklist.response-data.tmd-tooltip';
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TeamManagementOperationMode.prototype, "isMarkingInstructionLinkVisible", {
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
    TeamManagementOperationMode.prototype.shouldDisplayStandardisationOpenTab = function (targetSummary) {
        var isESTargetCompleted = false;
        if (targetSummary.markingModeID === enums.MarkingMode.ES_TeamApproval) {
            isESTargetCompleted = targetHelper.isESTargetCompleted(enums.MarkingMode.ES_TeamApproval);
        }
        return !isESTargetCompleted && teamManagementStore.instance.selectedTeamManagementTab !== enums.TeamManagement.HelpExaminers
            && (targetSummary.examinerProgress.openResponsesCount > 0 || targetSummary.examinerProgress.closedResponsesCount === 0);
    };
    Object.defineProperty(TeamManagementOperationMode.prototype, "shouldDisplayHelperMessage", {
        /**
         * Returns whether the Open Tab should have the helper message.
         */
        get: function () {
            return false;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TeamManagementOperationMode.prototype, "isEnhancedOffPageCommentVisible", {
        /**
         * Returns whether the Enhanced off-page comments panel visible or not
         */
        get: function () {
            return (responseStore.instance.markingMethod === enums.MarkingMethod.Unstructured || ccValues.isECourseworkComponent) &&
                stampStore.instance.isEnhancedOffPageCommentConfiguredForQIG;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TeamManagementOperationMode.prototype, "shouldDisplayPendingWorklistBanner", {
        /**
         * Returns whether the pending worklist banner visible or not
         */
        get: function () {
            return false;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TeamManagementOperationMode.prototype, "isOffPageCommentConfigured", {
        /**
         * Returns whether the off-page comments panel visible or not
         */
        get: function () {
            return stampStore.instance.isOffPageCommentConfiguredForQIG;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TeamManagementOperationMode.prototype, "isOffPageCommentVisibleForSelectedQig", {
        /**
         * Returns whether the off-page comments panel is visible aganist selected qig(whole response)
         */
        get: function () {
            return stampStore.instance.isOffPageCommentVisible;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TeamManagementOperationMode.prototype, "isOffPageCommentEditable", {
        /**
         * Returns whether the off-page comments panel editable or not
         */
        get: function () {
            return false;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TeamManagementOperationMode.prototype, "isSupervisorReviewCommentColumnHidden", {
        /**
         * Check whether supervisor review comments column is hidden or not
         */
        get: function () {
            return this.getSeniorExaminerPoolCCValue() || !ccValues.supervisorReviewComments;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TeamManagementOperationMode.prototype, "hasZoningExceptionWarningPopup", {
        /**
         * Return false for displaying Zoning Exception Warning Popup.
         */
        get: function () {
            return false;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TeamManagementOperationMode.prototype, "isSelectResponsesTabInStdSetup", {
        //#region Standardisation Setup
        /**
         * Return false for marking operation.
         */
        get: function () {
            return false;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TeamManagementOperationMode.prototype, "isUnclassifiedTabInStdSetup", {
        /**
         * Return false for marking operation.
         */
        get: function () {
            return false;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TeamManagementOperationMode.prototype, "isDefinitveMarkingStarted", {
        /**
         * Return false for marking operation.
         */
        get: function () {
            return false;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TeamManagementOperationMode.prototype, "isClassifiedTabInStdSetup", {
        /**
         * Return false for marking operation.
         */
        get: function () {
            return false;
        },
        enumerable: true,
        configurable: true
    });
    return TeamManagementOperationMode;
}(operationModeBase));
var teamManagementOperationMode = new TeamManagementOperationMode();
module.exports = teamManagementOperationMode;
//# sourceMappingURL=teammanagementoperationmode.js.map