"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var operationModeBase = require('./operationmodebase');
var localeStore = require('../../../stores/locale/localestore');
var worklistStore = require('../../../stores/worklist/workliststore');
var enums = require('../enums');
var responseStore = require('../../../stores/response/responsestore');
var qigStore = require('../../../stores/qigselector/qigstore');
var examinerStore = require('../../../stores/markerinformation/examinerstore');
var ccHelper = require('../../../utility/configurablecharacteristic/configurablecharacteristicshelper');
var ccNames = require('../../../utility/configurablecharacteristic/configurablecharacteristicsnames');
var ccValues = require('../../../utility/configurablecharacteristic/configurablecharacteristicsvalues');
var markingStore = require('../../../stores/marking/markingstore');
var messageStore = require('../../../stores/message/messagestore');
var exceptionStore = require('../../../stores/exception/exceptionstore');
var targetSummaryStore = require('../../../stores/worklist/targetsummarystore');
var navigationStore = require('../../../stores/navigation/navigationstore');
var stampStore = require('../../../stores/stamp/stampstore');
var MarkingOperationMode = (function (_super) {
    __extends(MarkingOperationMode, _super);
    function MarkingOperationMode() {
        var _this = this;
        _super.apply(this, arguments);
        /**
         * We will show OnlyShowUnAnnotated pages option for unstructured responses only
         */
        this.hasOnlyShowUnAnnotatedPagesOption = function (componentType) {
            return componentType === enums.MarkingMethod.Unstructured;
        };
        /**
         * dispalying toggle button in SLAO management and in FRV for structured responses.
         */
        this.hasShowToggleButtonOption = function (componentType) {
            return componentType === enums.MarkingMethod.Structured;
        };
        /**
         * Returns true if submit button is disable in marking operation mode
         */
        this.isSubmitDisabled = function (workListType) {
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
         * Returns false for marking operation mode
         */
        this.doShowSamplingButton = function (markingProgress, worklistType) {
            return false;
        };
        /**
         * return whether the complete button is to be visible or not (based on the CC value).
         */
        this.isCompleteButtonVisible = function (markingProgress, hasSimpleOptionality) {
            var markSchemeGroupId = qigStore.instance.selectedQIGForMarkerOperation.markSchemeGroupId;
            var completeButtonCC = ccHelper.getCharacteristicValue(ccNames.CompleteButton, markSchemeGroupId);
            var checkMinMarksOnCompleteCC = ccHelper.getCharacteristicValue(ccNames.CheckMinMarksOnComplete, markSchemeGroupId);
            /**
             *  return true if the cc is enabled and the resposne is in mark entry possible state (not closed)
             *  and the checkMinMarksOnCompleteCC is on and the marksheme has  optioanlity rule
             */
            if (completeButtonCC === 'true'
                && (markingProgress !== 100)
                && (checkMinMarksOnCompleteCC !== 'true' ||
                    (checkMinMarksOnCompleteCC === 'true' && hasSimpleOptionality))
                && (markingStore.instance.isMarkingInProgress || markingStore.instance.navigateTo !== enums.SaveAndNavigate.none)) {
                return true;
            }
            else {
                return false;
            }
        };
        /**
         * True will display the yellow edit box icon
         */
        this.hasMarkChangeReasonYellowIcon = function (isResponseEditable, isInResponse) {
            return isResponseEditable || !isInResponse;
        };
        /**
         *  Returns whether a response is seed or not.
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
            if (_this.isExaminerHasQualityFeedback && !worklistStore.instance.isMarkingCheckMode) {
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
            }
            else {
                return false;
            }
        };
        /**
         * Returns whether the response navigation is blocked or not.
         */
        this.isResponseNavigationBlocked = function (isQualityFeedbackPossibleInWorklist) {
            return !worklistStore.instance.isMarkingCheckMode &&
                _this.isAutomaticQualityFeedbackCCOn &&
                isQualityFeedbackPossibleInWorklist &&
                qigStore.instance.selectedQIGForMarkerOperation.hasQualityFeedbackOutstanding;
        };
        /**
         * Returns whether the tab is disabled based on quality feedback or not.
         */
        this.isTabDisabledBasedOnQualityFeedback = function (tabBasedOnQualityFeedback, currentTab) {
            var isTabDisabled = false;
            if (tabBasedOnQualityFeedback === undefined) {
                return isTabDisabled;
            }
            switch (currentTab) {
                case enums.ResponseMode.open:
                    isTabDisabled = true;
                    break;
                case enums.ResponseMode.closed:
                    if (_this.isAutomaticQualityFeedbackCCOn) {
                        isTabDisabled = true;
                    }
                    break;
                case enums.ResponseMode.pending:
                    if (_this.isAutomaticQualityFeedbackCCOn) {
                        isTabDisabled = true;
                    }
                    break;
            }
            return isTabDisabled;
        };
        /**
         * Returns whether the seeds needs to be highlighted or not.
         */
        this.isSeedNeededToBeHighlighted = function (qualityFeedBackStatus, isSeedResponse) {
            return _this.isExaminerHasQualityFeedback && qualityFeedBackStatus !== enums.QualityFeedbackStatus.None && isSeedResponse;
        };
        /**
         * Returns whether the quality helper message needs to be displayed or not.
         */
        this.isQualtiyHelperMessageNeededToBeDisplayed = function (worklistType) {
            return _this.isExaminerHasQualityFeedback &&
                (worklistType === enums.WorklistType.live || worklistType === enums.WorklistType.directedRemark)
                && !worklistStore.instance.isMarkingCheckMode;
        };
        /**
         * Applicable for targets.tsx and worklisttype.tsx
         * Sets the response mode based on quality feedback.
         */
        this.responseModeBasedOnQualityFeedback = function (responseMode, markingMode, remarkRequestTypeId) {
            var responseModeBasedOnQualityFeedback = _this.getResponseModeBasedOnQualityFeedback;
            return responseModeBasedOnQualityFeedback !== undefined ? responseModeBasedOnQualityFeedback : responseMode;
        };
        /**
         * Applicable for worklist.tsx
         */
        this.responseModeBasedOnQualityFeedbackForWorklist = function (responseMode, markingMode, remarkRequestTypeId) {
            /*
             * Sets the response mode based on quality feedback.
             */
            var responseModeBasedOnQualityFeedback = _this.getResponseModeBasedOnQualityFeedback;
            return responseModeBasedOnQualityFeedback !== undefined ? responseModeBasedOnQualityFeedback :
                worklistStore.instance.getResponseMode !== undefined && worklistStore.instance.getResponseMode !== null ?
                    worklistStore.instance.getResponseMode : responseMode;
        };
        // *** Qig Selector *** //
        /**
         * Applicable for qigselector.tsx
         */
        this.responseModeBasedOnQualityFeedbackForQigSelector = function (responseMode, markingMode, remarkRequestTypeId) {
            var responseModeBasedOnQualityFeedback = _this.getResponseModeBasedOnQualityFeedback;
            return responseModeBasedOnQualityFeedback !== undefined ? responseModeBasedOnQualityFeedback :
                worklistStore.instance.getResponseMode !== undefined &&
                    worklistStore.instance.getResponseMode !== null ? worklistStore.instance.getResponseMode : responseMode;
        };
        // *** Targets **** //
        /**
         * Returns whether the target is disabled or not.
         */
        this.isTargetDisabled = function (target, previousTarget) {
            // Determine if the item is shown in a disabled status here.
            // In the future state the item is disabled.
            var isTargetDisabled = true;
            if (target.markingModeID === enums.MarkingMode.Remarking &&
                (_this.isExaminerHasQualityFeedback || !_this.isMarkerApprovedOrSuspended)) {
                //When the marker has quality feedback outstanding, the remarking tab should be disabled
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
         * Method which tells if the marks and annotations download needs to be initiated based on the selected response mode.
         * @param responseMode
         */
        this.canInitiateMarkAndAnnotationsBackgroundDownload = function (responseMode) {
            if (responseMode === enums.ResponseMode.open) {
                return worklistStore.instance.getCurrentWorklistResponseBaseDetails().size > 0;
            }
            return false;
        };
        // *** worklist container *** //
        /**
         * Returns the tab to be selected.
         */
        this.tabToBeSelected = function (selectedTab) {
            var tabToBeSelectedBasedOnQualityFeedback = _this.getResponseModeBasedOnQualityFeedback;
            return tabToBeSelectedBasedOnQualityFeedback !== undefined ? tabToBeSelectedBasedOnQualityFeedback : selectedTab;
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
         * Percentage needs to be shown even if Marking is not in progress while in MarkingCheckWorklist
         */
        this.showMarkingProgressWithPercentage = function (isMarkingInProgress) {
            return isMarkingInProgress || worklistStore.instance.isMarkingCheckMode;
        };
        // *** Marking Helper *** //
        /**
         * Returns true if mark change reason needed else return false.
         */
        this.isMarkChangeReasonNeeded = function (currentMarkingProgress) {
            var markChangeReason = markingStore.instance.getMarkChangeReason(markingStore.instance.currentMarkGroupId);
            return (markingStore.instance.currentResponseMode === enums.ResponseMode.open ||
                markingStore.instance.currentResponseMode === enums.ResponseMode.pending) &&
                currentMarkingProgress === 100 &&
                (markChangeReason === undefined || markChangeReason === null || markChangeReason.length <= 0);
        };
        // *** Markscheme helper *** //
        /**
         * Return true if we need to retrieve marks and annotations else return false.
         */
        this.isRetrieveMarksAndAnnotationsRequired = function (markGroupId, hasNonRecoverableErrors) {
            return !markingStore.instance.isMarksLoaded(markGroupId) || hasNonRecoverableErrors;
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
                (currentWorklistType === enums.WorklistType.directedRemark && currentResponseMode === enums.ResponseMode.closed &&
                    seedType === enums.SeedType.EUR);
        };
    }
    Object.defineProperty(MarkingOperationMode.prototype, "isMarkingMode", {
        /**
         * Return true for marking operation mode.
         */
        get: function () {
            return true;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MarkingOperationMode.prototype, "isTeamManagementMode", {
        /**
         * Return false for marking operation.
         */
        get: function () {
            return false;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MarkingOperationMode.prototype, "isStandardisationSetupMode", {
        /**
         * Return true for Standardisation setup operation.
         */
        get: function () {
            return false;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MarkingOperationMode.prototype, "isAwardingMode", {
        /**
         * Return true for Awarding operation mode.
         */
        get: function () {
            return false;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MarkingOperationMode.prototype, "isHelpExaminersView", {
        /**
         * Return false for marking operation.
         */
        get: function () {
            return false;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MarkingOperationMode.prototype, "isFlaggedAsSeenButtonVisible", {
        // *** FRV *** //
        /**
         * We will display flaggedAsSeen button in marking mode.
         */
        get: function () {
            return !worklistStore.instance.isMarkingCheckMode;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MarkingOperationMode.prototype, "markThisPageOrViewThisPageButtonText", {
        /**
         * This will return the corresponding button text
         */
        get: function () {
            return worklistStore.instance.getResponseMode !== enums.ResponseMode.closed &&
                !worklistStore.instance.isMarkingCheckMode ?
                localeStore.instance.TranslateText('marking.full-response-view.script-page.mark-this-page-button') :
                localeStore.instance.TranslateText('marking.full-response-view.script-page.view-this-page-button');
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MarkingOperationMode.prototype, "isSaveMarksOnMarkingViewButtonClick", {
        /**
         * Reset the markingProgress flag in marking store back to true only if the response mode is
         * open. This flag is used while saving marks. Save marks will not happen for closed responses
         */
        get: function () {
            return worklistStore.instance.getResponseMode !== enums.ResponseMode.closed;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MarkingOperationMode.prototype, "markingButtonText", {
        /**
         * Returns localisation key for return to marking button text from FRV
         */
        get: function () {
            return worklistStore.instance.isMarkingCheckMode ?
                localeStore.instance.TranslateText('team-management.full-response-view.back-to-response-button') :
                localeStore.instance.TranslateText('marking.full-response-view.back-to-marking-button');
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MarkingOperationMode.prototype, "markingButtonTooltipText", {
        /**
         * Returns localisation key for return marking button tooltip text from FRV
         */
        get: function () {
            return worklistStore.instance.isMarkingCheckMode ?
                localeStore.instance.TranslateText('team-management.full-response-view.back-to-response-button-tooltip') :
                localeStore.instance.TranslateText('marking.full-response-view.back-to-marking-button-tooltip');
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MarkingOperationMode.prototype, "hasLinkToQuestion", {
        /**
         * Returns whether we need to display Link To Question option or not.
         * Linking Option is not available while marking check
         */
        get: function () {
            return !worklistStore.instance.isMarkingCheckMode;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MarkingOperationMode.prototype, "showMarkChangeReason", {
        // *** Response container *** //
        /**
         * Return true for displaying mark change reason.
         */
        get: function () {
            return true;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MarkingOperationMode.prototype, "showMbQConfirmation", {
        /**
         * Returns whether we need to display MBQ confirmation or not.
         */
        get: function () {
            return responseStore.instance.selectedResponseMode !== enums.ResponseMode.closed;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MarkingOperationMode.prototype, "showViewWholePageButton", {
        /**
         * Returns whether we need to display view Whole page link.
         */
        get: function () {
            return responseStore.instance.selectedResponseMode !== enums.ResponseMode.closed && !worklistStore.instance.isMarkingCheckMode;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MarkingOperationMode.prototype, "isResponseReadOnly", {
        /**
         * Returns whether the response is read only or not.
         */
        get: function () {
            return worklistStore.instance.getResponseMode === enums.ResponseMode.closed ||
                (messageStore.instance.messageViewAction === enums.MessageViewAction.Open ||
                    messageStore.instance.messageViewAction === enums.MessageViewAction.Maximize ||
                    messageStore.instance.messageViewAction === enums.MessageViewAction.View ||
                    exceptionStore.instance.exceptionViewAction === enums.ExceptionViewAction.Maximize ||
                    exceptionStore.instance.exceptionViewAction === enums.ExceptionViewAction.View ||
                    exceptionStore.instance.exceptionViewAction === enums.ExceptionViewAction.Open);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MarkingOperationMode.prototype, "isSubmitVisible", {
        // *** Mark Scheme Panel *** //
        /**
         * Returns whether the submit button is visible or not
         */
        get: function () {
            return true;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MarkingOperationMode.prototype, "hasMarkByOption", {
        /**
         * Returns true if we need to display mark by options.
         */
        get: function () {
            var responseData = undefined;
            if (responseStore.instance.selectedDisplayId) {
                responseData = worklistStore.instance.getResponseDetails(responseStore.instance.selectedDisplayId.toString());
            }
            var isAtypicalResponse = responseData && responseData.atypicalStatus !== enums.AtypicalStatus.Scannable;
            var isEBookMarking = ccHelper.getExamSessionCCValue(ccNames.eBookmarking, qigStore.instance.selectedQIGForMarkerOperation.examSessionId)
                .toLowerCase() === 'true' && !isAtypicalResponse ? true : false;
            return (responseStore.instance.markingMethod === enums.MarkingMethod.Structured ||
                responseStore.instance.markingMethod === enums.MarkingMethod.MarkFromObject
                || isEBookMarking) && responseStore.instance.selectedResponseMode !== enums.ResponseMode.closed &&
                !worklistStore.instance.isMarkingCheckMode;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MarkingOperationMode.prototype, "isGetFirstUnmarkedItem", {
        /**
         * Returns true if we need to select first unmarked item.
         */
        get: function () {
            return true;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MarkingOperationMode.prototype, "isQualityFeedbackOutstanding", {
        /**
         * Returns whether the quality feedback is outstanding or not in marking mode.
         */
        get: function () {
            return !worklistStore.instance.isMarkingCheckMode &&
                ((qigStore.instance.selectedQIGForMarkerOperation !== undefined &&
                    qigStore.instance.selectedQIGForMarkerOperation.hasQualityFeedbackOutstanding) ||
                    (examinerStore.instance.getMarkerInformation !== undefined
                        && examinerStore.instance.getMarkerInformation.hasQualityFeedbackOutstanding)) &&
                ((worklistStore.instance.currentWorklistType === enums.WorklistType.live
                    || worklistStore.instance.currentWorklistType === enums.WorklistType.directedRemark));
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MarkingOperationMode.prototype, "allowReviewResponse", {
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
    Object.defineProperty(MarkingOperationMode.prototype, "markChangeReasonTitle", {
        /**
         * Returns the mark change reason title
         */
        get: function () {
            return localeStore.instance.TranslateText('marking.worklist.response-data.mark-change-reason-not-specified-icon-tooltip');
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MarkingOperationMode.prototype, "isSupervisorRemarkButtonVisible", {
        // *** Toolbar panel *** //
        /**
         * We don't need to supervisor remark button in marking operation mode.
         */
        get: function () {
            // Should not visible the button, if it is in his own supervisor visor remark worklist.
            var currentMarkingmode = worklistStore.instance.getMarkingModeByWorkListType(worklistStore.instance.currentWorklistType);
            return (this.shouldDisplaySupervisorRemarkButton
                && (currentMarkingmode !== enums.MarkingMode.Remarking ||
                    worklistStore.instance.getRemarkRequestType !== enums.RemarkRequestType.SupervisorRemark)
                && this.getCurrentResponseSeedType === enums.SeedType.None
                && (this.isSelectedExaminerPEOrAPE || qigStore.instance.selectedQIGForMarkerOperation.isTeamManagementEnabled)
                && !worklistStore.instance.isMarkingCheckMode);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MarkingOperationMode.prototype, "isPromoteToSeedButtonVisible", {
        /**
         * Returns whether the promote to seed button is visible or not.
         */
        get: function () {
            var currentResponse = (worklistStore.instance.getCurrentWorklistResponseBaseDetails().filter(function (x) {
                return x.markGroupId === responseStore.instance.selectedMarkGroupId;
            }).first());
            var currentMarkingMode = worklistStore.instance.getMarkingModeByWorkListType(worklistStore.instance.currentWorklistType);
            var remarkRequestType = worklistStore.instance.getRemarkRequestType;
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
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MarkingOperationMode.prototype, "isCRMConfirmationPopupVisible", {
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
    Object.defineProperty(MarkingOperationMode.prototype, "promoteToSeedPopupHeaderText", {
        /**
         * Returns the localised promote to seed popup header text
         */
        get: function () {
            return localeStore.instance.TranslateText('team-management.response.promote-to-seed-dialog.header');
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MarkingOperationMode.prototype, "promoteToReusePopupHeaderText", {
        /**
         * Returns the localised promote to reuse bucket popup header text
         */
        get: function () {
            return localeStore.instance.TranslateText('team-management.response.promote-to-reuse-bucket-dialog.header');
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MarkingOperationMode.prototype, "promoteToReuseBucketPopupContentText", {
        /**
         * Returns the localised promote to reuse bucket popup content
         */
        get: function () {
            return localeStore.instance.TranslateText('team-management.response.promote-to-reuse-bucket-dialog.body');
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MarkingOperationMode.prototype, "promoteToSeedPopupContentText", {
        /**
         * Returns the localised promote to seed popup header text
         */
        get: function () {
            if (!ccValues.examinerCentreExclusivity) {
                return localeStore.instance.TranslateText('team-management.response.promote-to-seed-dialog.body-own-response');
            }
            else {
                return localeStore.instance.TranslateText('team-management.response.promote-to-seed-dialog.body-dynamic-sampling');
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MarkingOperationMode.prototype, "isRemoveResponseFromWorklistDetails", {
        /**
         * Returns whether we need to remove from response details for updating the navigation count details.
         */
        get: function () {
            return !(this.isClosed && ccValues.examinerCentreExclusivity);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MarkingOperationMode.prototype, "doShowAccuracyIndicator", {
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
                || (this.isAutomaticQualityFeedbackCCOn &&
                    (workListType === enums.WorklistType.live || workListType === enums.WorklistType.directedRemark)))) {
                return true;
            }
            else {
                return false;
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MarkingOperationMode.prototype, "isLinkedExceptionIndicatorHidden", {
        /**
         * Returns whether linked exception indicator is visible
         */
        get: function () {
            return false;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MarkingOperationMode.prototype, "isQualityFeedbackWorklistColumnsHidden", {
        /**
         *  Returns whether the quality feedback related columns are hidden or not.
         */
        get: function () {
            return !(ccHelper.getCharacteristicValue(ccNames.AutomaticQualityFeedback, qigStore.instance.selectedQIGForMarkerOperation.markSchemeGroupId) === 'true');
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MarkingOperationMode.prototype, "isSeedLabelHidden", {
        /**
         * Returns whether the seed label is hidden or not
         */
        get: function () {
            return !(ccHelper.getCharacteristicValue(ccNames.AutomaticQualityFeedback, qigStore.instance.selectedQIGForMarkerOperation.markSchemeGroupId) === 'true');
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Returns whether the sample label is hidden or not
     */
    MarkingOperationMode.prototype.isSampleLabelHidden = function (worklistType) {
        return true;
    };
    Object.defineProperty(MarkingOperationMode.prototype, "isReviewedByLabelHidden", {
        /**
         * Returns whether the reviewed by label is hidden or not
         */
        get: function () {
            return true;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MarkingOperationMode.prototype, "responseMode", {
        /**
         * Applicable for Team Management mode only
         */
        get: function () {
            return worklistStore.instance.getResponseMode !== undefined &&
                worklistStore.instance.getResponseMode !== null ?
                worklistStore.instance.getResponseMode : enums.ResponseMode.open;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MarkingOperationMode.prototype, "getQigId", {
        /**
         * Returns the selected qig id
         */
        get: function () {
            return qigStore.instance.selectedQIGForMarkerOperation ?
                qigStore.instance.selectedQIGForMarkerOperation.markSchemeGroupId :
                this.previousSelectedQIGFromUserOption ?
                    this.previousSelectedQIGFromUserOption.qigId : 0;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MarkingOperationMode.prototype, "selectedQIGFromUserOption", {
        /**
         * Returns the selected qig from user option
         */
        get: function () {
            return this.previousSelectedQIGFromUserOption;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MarkingOperationMode.prototype, "isSetMarkingInProgressAndMarkEntrySelectedRequired", {
        // *** Menu wrapper *** //
        /**
         * Return true if we need to update marking progress in store
         */
        get: function () {
            return navigationStore.instance.containerPage === enums.PageContainers.Response
                && responseStore.instance.selectedResponseMode !== enums.ResponseMode.closed
                && responseStore.instance.selectedResponseViewMode === enums.ResponseViewMode.zoneView;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MarkingOperationMode.prototype, "isForwardButtonHidden", {
        // *** Message **** //
        /**
         * Returns whether the forward button is hidden or not in view.
         */
        get: function () {
            return false;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MarkingOperationMode.prototype, "isResponseEditable", {
        // *** Response Helper *** //
        /**
         * Returns whether the response is editable or not.
         */
        get: function () {
            var updatePendingResponsesWhenSuspendedCCOn = ccHelper.getCharacteristicValue(ccNames.UpdatePendingResponsesWhenSuspended, qigStore.instance.selectedQIGForMarkerOperation.markSchemeGroupId).toLowerCase() === 'true';
            var updateWhenSuspended = true;
            var isClosedResponse = false;
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
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MarkingOperationMode.prototype, "canRenderPreviousMarks", {
        // *** Tree view data helper *** //
        /**
         * determine whether we need to render remarks or not
         */
        get: function () {
            if (worklistStore.instance.isMarkingCheckMode) {
                return false;
            }
            if (this.isDirectedRemark || this.isPractice || this.isPooledRemark) {
                return true;
            }
            else if ((this.isStandardisation || this.isSecondStandardisation) && this.isClosed) {
                if (this.hasShowStandardisationDefinitiveMarksCC) {
                    return true;
                }
            }
            else if ((this.isDirectedRemark || this.isLive || this.isPooledRemark) && this.isClosed
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
    Object.defineProperty(MarkingOperationMode.prototype, "isClosedEurSeed", {
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
    Object.defineProperty(MarkingOperationMode.prototype, "isClosedLiveSeed", {
        /**
         * gets whether the response is closed Live seed
         */
        get: function () {
            return worklistStore.instance.currentWorklistType === enums.WorklistType.live &&
                this.getCurrentResponseSeedType === enums.SeedType.Gold;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MarkingOperationMode.prototype, "getCurrentResponseSeedType", {
        /**
         * Get closed response seed type Id
         */
        get: function () {
            if (worklistStore.instance.getResponseMode === enums.ResponseMode.closed) {
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
    Object.defineProperty(MarkingOperationMode.prototype, "isWorklistFilterShouldbeVisible", {
        /**
         * Check the Worklist Filter can made visible
         */
        get: function () {
            return false;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MarkingOperationMode.prototype, "accurateAccuracyIndicatorTitle", {
        /**
         * Returns the accurate accuracy indicator title
         */
        get: function () {
            return localeStore.instance.TranslateText('generic.accuracy-indicators.accurate-tooltip');
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MarkingOperationMode.prototype, "inaccurateAccuracyIndicatorTitle", {
        /**
         * Returns the inaccurate accuracy indicator title
         */
        get: function () {
            return localeStore.instance.TranslateText('generic.accuracy-indicators.inaccurate-tooltip');
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MarkingOperationMode.prototype, "intoleranceAccuracyIndicatorTitle", {
        /**
         * Returns the intolerance accuracy indicator title
         */
        get: function () {
            return localeStore.instance.TranslateText('generic.accuracy-indicators.in-tolerance-tooltip');
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MarkingOperationMode.prototype, "accurateOriginalAccuracyIndicatorTitle", {
        /**
         * Returns the accurate accuracy indicator title
         */
        get: function () {
            return localeStore.instance.TranslateText('generic.accuracy-indicators.original-mark-accurate-tooltip');
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MarkingOperationMode.prototype, "inaccurateOriginalAccuracyIndicatorTitle", {
        /**
         * Returns the inaccurate accuracy indicator title
         */
        get: function () {
            return localeStore.instance.TranslateText('generic.accuracy-indicators.original-mark-inaccurate-tooltip');
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MarkingOperationMode.prototype, "intoleranceOriginalAccuracyIndicatorTitle", {
        /**
         * Returns the intolerance accuracy indicator title
         */
        get: function () {
            return localeStore.instance.TranslateText('generic.accuracy-indicators.original-mark-in-tolerance-tooltip');
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MarkingOperationMode.prototype, "absoluteMarkDifferenceTitle", {
        /**
         * Returns the amd title
         */
        get: function () {
            return 'marking.worklist.response-data.amd-tooltip';
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MarkingOperationMode.prototype, "totalMarkDifferenceTitle", {
        /**
         * Returns the tmd title
         */
        get: function () {
            return 'marking.worklist.response-data.tmd-tooltip';
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MarkingOperationMode.prototype, "isMarkingInstructionLinkVisible", {
        /**
         * returns true if QIG has the the marking instructions set
         */
        get: function () {
            if (qigStore.instance.selectedQIGForMarkerOperation) {
                return qigStore.instance.selectedQIGForMarkerOperation.hasMarkingInstructions;
            }
            return false;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Returns whether the Open Tab should be visible for Standardisation worklist.
     */
    MarkingOperationMode.prototype.shouldDisplayStandardisationOpenTab = function (targetSummary) {
        return true;
    };
    Object.defineProperty(MarkingOperationMode.prototype, "shouldDisplayHelperMessage", {
        /**
         * Returns whether the Open Tab should have the helper message.
         */
        get: function () {
            return true;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MarkingOperationMode.prototype, "isEnhancedOffPageCommentVisible", {
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
    Object.defineProperty(MarkingOperationMode.prototype, "shouldDisplayPendingWorklistBanner", {
        /**
         * Returns whether the pending worklist banner visible or not
         */
        get: function () {
            return (worklistStore.instance.getResponseMode === enums.ResponseMode.pending && !worklistStore.instance.isMarkingCheckMode);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MarkingOperationMode.prototype, "isOffPageCommentConfigured", {
        /**
         * Returns whether the off-page comments panel configured
         */
        get: function () {
            return stampStore.instance.isOffPageCommentConfiguredForQIG;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MarkingOperationMode.prototype, "isOffPageCommentVisibleForSelectedQig", {
        /**
         * Returns whether the off-page comments panel is visible aganist selected qig(whole response)
         */
        get: function () {
            return stampStore.instance.isOffPageCommentVisible;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MarkingOperationMode.prototype, "isOffPageCommentEditable", {
        /**
         * Returns whether the off-page comments panel editable or not
         */
        get: function () {
            return (responseStore.instance.selectedResponseMode !== enums.ResponseMode.closed &&
                responseStore.instance.selectedResponseMode !== enums.ResponseMode.none);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MarkingOperationMode.prototype, "isSupervisorReviewCommentColumnHidden", {
        /**
         * In marking operation mode supervisor review comments column is hidden
         */
        get: function () {
            return true;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MarkingOperationMode.prototype, "hasZoningExceptionWarningPopup", {
        /**
         * Return true for displaying Zoning Exception Warning Popup.
         */
        get: function () {
            var openedResponseDetails = worklistStore.instance.getResponseDetails(responseStore.instance.selectedDisplayId.toString());
            if (openedResponseDetails) {
                return responseStore.instance.selectedResponseMode !== enums.ResponseMode.closed
                    && openedResponseDetails.hasZoningExceptions
                    && !openedResponseDetails.isZoningExceptionRaisedInSameScript
                    && !worklistStore.instance.isMarkingCheckMode;
            }
            else {
                return false;
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MarkingOperationMode.prototype, "isSelectResponsesTabInStdSetup", {
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
    Object.defineProperty(MarkingOperationMode.prototype, "isUnclassifiedTabInStdSetup", {
        /**
         * Returns false for marking Operation mode.
         */
        get: function () {
            return false;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MarkingOperationMode.prototype, "isDefinitveMarkingStarted", {
        /**
         * Returns false for marking Operation mode.
         */
        get: function () {
            return false;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MarkingOperationMode.prototype, "isClassifiedTabInStdSetup", {
        /**
         * Returns false for marking Operation mode.
         */
        get: function () {
            return false;
        },
        enumerable: true,
        configurable: true
    });
    return MarkingOperationMode;
}(operationModeBase));
var markingOperationMode = new MarkingOperationMode();
module.exports = markingOperationMode;
//# sourceMappingURL=markingoperationmode.js.map