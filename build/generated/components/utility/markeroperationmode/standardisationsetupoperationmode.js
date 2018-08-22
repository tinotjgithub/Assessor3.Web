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
var standardisationSetupStore = require('../../../stores/standardisationsetup/standardisationsetupstore');
var markingStore = require('../../../stores/marking/markingstore');
var StandardisationSetupOperationMode = (function (_super) {
    __extends(StandardisationSetupOperationMode, _super);
    function StandardisationSetupOperationMode() {
        var _this = this;
        _super.apply(this, arguments);
        /**
         * We will show OnlyShowUnAnnotated pages option for unstructured responses in open response mode only
         */
        this.hasOnlyShowUnAnnotatedPagesOption = function (componentType) {
            return componentType === enums.MarkingMethod.Unstructured;
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
         * In Standardisation setup view PE and APE can send new message from examiners response. (to corresponding examiner only)
         */
        this.sendMessageToExaminer = function (messageType) {
            return (_this.isClassifiedTabInStdSetup || _this.isUnclassifiedTabInStdSetup) ? messageType === enums.MessageType.ResponseCompose : false;
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
         * We've to load marks and annotations in standardisation setup view,
         * because we've disabled the background download in standardisationsetup view
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
                (currentWorklistType === enums.WorklistType.directedRemark &&
                    (currentResponseMode === enums.ResponseMode.closed || currentResponseMode === enums.ResponseMode.open) &&
                    seedType === enums.SeedType.EUR);
        };
    }
    Object.defineProperty(StandardisationSetupOperationMode.prototype, "isMarkingMode", {
        /**
         * Return false for standardisation mode.
         */
        get: function () {
            return false;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(StandardisationSetupOperationMode.prototype, "isTeamManagementMode", {
        /**
         * Return true for team management mode.
         */
        get: function () {
            return false;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(StandardisationSetupOperationMode.prototype, "isStandardisationSetupMode", {
        /**
         * Return true for Standardisation operation mode.
         */
        get: function () {
            return true;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(StandardisationSetupOperationMode.prototype, "isAwardingMode", {
        /**
         * Return true for Awarding operation mode.
         */
        get: function () {
            return false;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(StandardisationSetupOperationMode.prototype, "isHelpExaminersView", {
        /**
         * Return true if selected tab is Help Examiners tab.
         */
        get: function () {
            return false;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(StandardisationSetupOperationMode.prototype, "isFlaggedAsSeenButtonVisible", {
        // *** FRV *** //
        /**
         * Returns whether FlaggedAaSeen button will be visible or not.
         */
        get: function () {
            return !this.isResponseReadOnly;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(StandardisationSetupOperationMode.prototype, "markThisPageOrViewThisPageButtonText", {
        /**
         * This will return the corresponding button text
         */
        get: function () {
            var buttonText;
            buttonText = !this.isResponseReadOnly ?
                localeStore.instance.TranslateText('marking.full-response-view.script-page.mark-this-page-button') :
                localeStore.instance.TranslateText('marking.full-response-view.script-page.view-this-page-button');
            return buttonText;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(StandardisationSetupOperationMode.prototype, "showViewWholePageButton", {
        /**
         * Returns whether we need to display view Whole page link.
         */
        get: function () {
            return !this.isResponseReadOnly;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(StandardisationSetupOperationMode.prototype, "isSaveMarksOnMarkingViewButtonClick", {
        /**
         * We don't need to save marks while clicking on Marking view button click
         */
        get: function () {
            return false;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(StandardisationSetupOperationMode.prototype, "markingButtonText", {
        /**
         * Returns localisation key for marking button text - (response)
         */
        get: function () {
            return localeStore.instance.TranslateText('team-management.full-response-view.back-to-response-button');
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(StandardisationSetupOperationMode.prototype, "markingButtonTooltipText", {
        /**
         * Returns localisation key for marking button tooltip text - (return to response)
         */
        get: function () {
            return localeStore.instance.TranslateText('team-management.full-response-view.back-to-response-button-tooltip');
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(StandardisationSetupOperationMode.prototype, "hasLinkToQuestion", {
        /**
         * Returns whether we need to display Link To Question option or not.
         */
        get: function () {
            return !this.isResponseReadOnly;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(StandardisationSetupOperationMode.prototype, "showMarkChangeReason", {
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
    Object.defineProperty(StandardisationSetupOperationMode.prototype, "showMbQConfirmation", {
        /**
         * We don't need to display mark by Question confirmation in TeamManagement mode
         */
        get: function () {
            return false;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(StandardisationSetupOperationMode.prototype, "isSubmitVisible", {
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
    Object.defineProperty(StandardisationSetupOperationMode.prototype, "hasMarkByOption", {
        /**
         * we don't need to display mark by options in team management mode.
         */
        get: function () {
            var responseData = undefined;
            if (responseStore.instance.selectedDisplayId) {
                responseData = standardisationSetupStore.instance.getResponseDetails(responseStore.instance.selectedDisplayId.toString());
            }
            var isAtypicalResponse = responseData && responseData.atypicalStatus !== enums.AtypicalStatus.Scannable;
            var isEBookMarking = ccHelper.getExamSessionCCValue(ccNames.eBookmarking, qigStore.instance.selectedQIGForMarkerOperation.examSessionId)
                .toLowerCase() === 'true' && !isAtypicalResponse;
            return (responseStore.instance.markingMethod === enums.MarkingMethod.Structured
                || responseStore.instance.markingMethod === enums.MarkingMethod.MarkFromObject || isEBookMarking)
                && responseStore.instance.selectedResponseMode !== enums.ResponseMode.closed &&
                !worklistStore.instance.isMarkingCheckMode &&
                !(this.isUnclassifiedTabInStdSetup && !this.isDefinitveMarkingStarted);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(StandardisationSetupOperationMode.prototype, "isGetFirstUnmarkedItem", {
        /**
         * We don't need to select first unmarkable item in team management mode.
         */
        get: function () {
            return false;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(StandardisationSetupOperationMode.prototype, "isQualityFeedbackOutstanding", {
        /**
         * We don't need to consider quality feedback outstanding in TeamManagement
         */
        get: function () {
            return false;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(StandardisationSetupOperationMode.prototype, "allowReviewResponse", {
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
    Object.defineProperty(StandardisationSetupOperationMode.prototype, "markChangeReasonTitle", {
        /**
         * Returns the mark change reason title
         */
        get: function () {
            return localeStore.instance.TranslateText('team-management.examiner-worklist.response-data.mark-change-reason-not-specified-icon-tooltip');
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(StandardisationSetupOperationMode.prototype, "isResponseReadOnly", {
        /**
         * Returns whether response is readonly or not.
         */
        get: function () {
            return standardisationSetupStore.instance.selectedStandardisationSetupWorkList === enums.StandardisationSetup.SelectResponse ||
                (standardisationSetupStore.instance.selectedStandardisationSetupWorkList === enums.StandardisationSetup.UnClassifiedResponse &&
                    standardisationSetupStore.instance.fetchStandardisationResponseData(responseStore.instance.selectedDisplayId).hasDefinitiveMark !== true) ||
                (standardisationSetupStore.instance.selectedStandardisationSetupWorkList === enums.StandardisationSetup.ClassifiedResponse &&
                    !standardisationSetupStore.instance.stdSetupPermissionCCData.role.permissions.editDefinitives);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(StandardisationSetupOperationMode.prototype, "isSupervisorRemarkButtonVisible", {
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
    Object.defineProperty(StandardisationSetupOperationMode.prototype, "isPromoteToSeedButtonVisible", {
        /**
         * Returns whether the promote to seed button is visible or not.
         */
        get: function () {
            return false;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(StandardisationSetupOperationMode.prototype, "isCRMConfirmationPopupVisible", {
        /**
         * Returns whether the any crm update is uploaded against this markgroup or not.
         */
        get: function () {
            return false;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(StandardisationSetupOperationMode.prototype, "promoteToReusePopupHeaderText", {
        /**
         * Returns the localised promote to reuse bucket popup header text
         */
        get: function () {
            return localeStore.instance.TranslateText('team-management.response.promote-to-reuse-bucket-dialog.header');
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(StandardisationSetupOperationMode.prototype, "promoteToReuseBucketPopupContentText", {
        /**
         * Returns the localised promote to reuse bucket popup content
         */
        get: function () {
            return localeStore.instance.TranslateText('team-management.response.promote-to-reuse-bucket-dialog.body');
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(StandardisationSetupOperationMode.prototype, "promoteToSeedPopupHeaderText", {
        /**
         * Returns the localised promote to seed popup header text
         */
        get: function () {
            return localeStore.instance.TranslateText('team-management.response.promote-to-seed-dialog.header');
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(StandardisationSetupOperationMode.prototype, "promoteToSeedPopupContentText", {
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
    Object.defineProperty(StandardisationSetupOperationMode.prototype, "isRemoveResponseFromWorklistDetails", {
        /**
         * Returns whether we need to remove from response details for updating the navigation count details.
         */
        get: function () {
            return false;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(StandardisationSetupOperationMode.prototype, "doShowAccuracyIndicator", {
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
    Object.defineProperty(StandardisationSetupOperationMode.prototype, "isLinkedExceptionIndicatorHidden", {
        /**
         * Returns whether linked exception indicator is visible
         */
        get: function () {
            return this.isHelpExaminersView;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(StandardisationSetupOperationMode.prototype, "isQualityFeedbackWorklistColumnsHidden", {
        /**
         *  Returns whether the quality feedback related columns are hidden or not.
         */
        get: function () {
            return false;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(StandardisationSetupOperationMode.prototype, "isSeedLabelHidden", {
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
    StandardisationSetupOperationMode.prototype.isSampleLabelHidden = function (worklistType) {
        return true;
    };
    Object.defineProperty(StandardisationSetupOperationMode.prototype, "isReviewedByLabelHidden", {
        /**
         * Returns whether the reviewed by label is hidden or not
         */
        get: function () {
            return true;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(StandardisationSetupOperationMode.prototype, "responseMode", {
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
    Object.defineProperty(StandardisationSetupOperationMode.prototype, "getQigId", {
        /**
         * Returns the selected qig id
         */
        get: function () {
            return operationModeHelper.markSchemeGroupId;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(StandardisationSetupOperationMode.prototype, "selectedQIGFromUserOption", {
        /**
         * Returns the selected qig from user option
         */
        get: function () {
            return this.previousSelectedQIGFromUserOption;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(StandardisationSetupOperationMode.prototype, "isSetMarkingInProgressAndMarkEntrySelectedRequired", {
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
    Object.defineProperty(StandardisationSetupOperationMode.prototype, "isForwardButtonHidden", {
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
    Object.defineProperty(StandardisationSetupOperationMode.prototype, "isResponseEditable", {
        // *** Response Helper *** //
        /**
         * Returns whether the response is editable or not.
         */
        get: function () {
            return !(standardisationSetupStore.instance.selectedStandardisationSetupWorkList === enums.StandardisationSetup.SelectResponse ||
                (standardisationSetupStore.instance.selectedStandardisationSetupWorkList === enums.StandardisationSetup.UnClassifiedResponse
                    && standardisationSetupStore.instance.fetchStandardisationResponseData(responseStore.instance.selectedDisplayId).hasDefinitiveMark !== true) ||
                (standardisationSetupStore.instance.selectedStandardisationSetupWorkList === enums.StandardisationSetup.ClassifiedResponse
                    && !standardisationSetupStore.instance.stdSetupPermissionCCData.role.permissions.editDefinitives));
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(StandardisationSetupOperationMode.prototype, "canRenderPreviousMarks", {
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
    Object.defineProperty(StandardisationSetupOperationMode.prototype, "isClosedEurSeed", {
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
    Object.defineProperty(StandardisationSetupOperationMode.prototype, "isClosedLiveSeed", {
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
    Object.defineProperty(StandardisationSetupOperationMode.prototype, "getCurrentResponseSeedType", {
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
    Object.defineProperty(StandardisationSetupOperationMode.prototype, "isWorklistFilterShouldbeVisible", {
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
    Object.defineProperty(StandardisationSetupOperationMode.prototype, "accurateAccuracyIndicatorTitle", {
        /**
         * Returns the accurate accuracy indicator title
         */
        get: function () {
            return localeStore.instance.TranslateText('generic.accuracy-indicators.accurate-tooltip-team-management');
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(StandardisationSetupOperationMode.prototype, "inaccurateAccuracyIndicatorTitle", {
        /**
         * Returns the inaccurate accuracy indicator title
         */
        get: function () {
            return localeStore.instance.TranslateText('generic.accuracy-indicators.inaccurate-tooltip-team-management');
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(StandardisationSetupOperationMode.prototype, "intoleranceAccuracyIndicatorTitle", {
        /**
         * Returns the intolerance accuracy indicator title
         */
        get: function () {
            return localeStore.instance.TranslateText('generic.accuracy-indicators.in-tolerance-tooltip-team-management');
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(StandardisationSetupOperationMode.prototype, "accurateOriginalAccuracyIndicatorTitle", {
        /**
         * Returns the accurate accuracy indicator title
         */
        get: function () {
            return localeStore.instance.TranslateText('generic.accuracy-indicators.original-mark-accurate-tooltip-team-management');
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(StandardisationSetupOperationMode.prototype, "inaccurateOriginalAccuracyIndicatorTitle", {
        /**
         * Returns the inaccurate accuracy indicator title
         */
        get: function () {
            return localeStore.instance.TranslateText('generic.accuracy-indicators.original-mark-inaccurate-tooltip-team-management');
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(StandardisationSetupOperationMode.prototype, "intoleranceOriginalAccuracyIndicatorTitle", {
        /**
         * Returns the intolerance accuracy indicator title
         */
        get: function () {
            return localeStore.instance.TranslateText('generic.accuracy-indicators.original-mark-in-tolerance-tooltip-team-management');
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(StandardisationSetupOperationMode.prototype, "absoluteMarkDifferenceTitle", {
        /**
         * Returns the amd title
         */
        get: function () {
            return 'team-management.examiner-worklist.response-data.amd-tooltip';
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(StandardisationSetupOperationMode.prototype, "totalMarkDifferenceTitle", {
        /**
         * Returns the tmd title
         */
        get: function () {
            return 'team-management.examiner-worklist.response-data.tmd-tooltip';
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(StandardisationSetupOperationMode.prototype, "isMarkingInstructionLinkVisible", {
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
    StandardisationSetupOperationMode.prototype.shouldDisplayStandardisationOpenTab = function (targetSummary) {
        var isESTargetCompleted = false;
        if (targetSummary.markingModeID === enums.MarkingMode.ES_TeamApproval) {
            isESTargetCompleted = targetHelper.isESTargetCompleted(enums.MarkingMode.ES_TeamApproval);
        }
        return !isESTargetCompleted && teamManagementStore.instance.selectedTeamManagementTab !== enums.TeamManagement.HelpExaminers
            && (targetSummary.examinerProgress.openResponsesCount > 0 || targetSummary.examinerProgress.closedResponsesCount === 0);
    };
    Object.defineProperty(StandardisationSetupOperationMode.prototype, "shouldDisplayHelperMessage", {
        /**
         * Returns whether the Open Tab should have the helper message.
         */
        get: function () {
            return false;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(StandardisationSetupOperationMode.prototype, "isEnhancedOffPageCommentVisible", {
        /**
         * Returns whether the Enhanced off-page comments panel visible or not
         */
        get: function () {
            return (responseStore.instance.markingMethod === enums.MarkingMethod.Unstructured || ccValues.isECourseworkComponent) &&
                stampStore.instance.isEnhancedOffPageCommentConfiguredForQIG &&
                standardisationSetupStore.instance.selectedStandardisationSetupWorkList !== enums.StandardisationSetup.SelectResponse;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(StandardisationSetupOperationMode.prototype, "shouldDisplayPendingWorklistBanner", {
        /**
         * Returns whether the pending worklist banner visible or not
         */
        get: function () {
            return false;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(StandardisationSetupOperationMode.prototype, "isOffPageCommentConfigured", {
        /**
         * Returns whether the off-page comments panel visible or not
         */
        get: function () {
            return stampStore.instance.isOffPageCommentConfiguredForQIG;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(StandardisationSetupOperationMode.prototype, "isOffPageCommentVisibleForSelectedQig", {
        /**
         * Returns whether the off-page comments panel is visible aganist selected qig(whole response)
         */
        get: function () {
            return stampStore.instance.isOffPageCommentVisible;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(StandardisationSetupOperationMode.prototype, "isOffPageCommentEditable", {
        /**
         * Returns whether the off-page comments panel editable or not
         */
        get: function () {
            return standardisationSetupStore.instance.selectedStandardisationSetupWorkList === enums.StandardisationSetup.ProvisionalResponse ||
                (this.isUnclassifiedTabInStdSetup && this.isDefinitveMarkingStarted);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(StandardisationSetupOperationMode.prototype, "isSupervisorReviewCommentColumnHidden", {
        /**
         * Check whether supervisor review comments column is hidden or not
         */
        get: function () {
            return this.getSeniorExaminerPoolCCValue() || !ccValues.supervisorReviewComments;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(StandardisationSetupOperationMode.prototype, "hasZoningExceptionWarningPopup", {
        /**
         * Return false for displaying Zoning Exception Warning Popup.
         */
        get: function () {
            return false;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(StandardisationSetupOperationMode.prototype, "isPromoteToReuseButtonVisible", {
        /**
         * Return false for reuse button visibility.
         */
        get: function () {
            return false;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(StandardisationSetupOperationMode.prototype, "isSelectResponsesTabInStdSetup", {
        // #region Standardisation Setup
        /**
         * Return false for marking operation.
         */
        get: function () {
            return (standardisationSetupStore.instance.selectedStandardisationSetupWorkList === enums.StandardisationSetup.SelectResponse);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(StandardisationSetupOperationMode.prototype, "isUnclassifiedTabInStdSetup", {
        /**
         * Returns true, when the seleted tab is unClassified worklist.
         */
        get: function () {
            return (standardisationSetupStore.instance.selectedStandardisationSetupWorkList
                === enums.StandardisationSetup.UnClassifiedResponse);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(StandardisationSetupOperationMode.prototype, "isClassifiedTabInStdSetup", {
        /**
         *  Returns true, when the seleted tab is classified worklist.
         */
        get: function () {
            return (standardisationSetupStore.instance.selectedStandardisationSetupWorkList
                === enums.StandardisationSetup.ClassifiedResponse);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(StandardisationSetupOperationMode.prototype, "isProvisionalTabInStdSetup", {
        /**
         *  Returns true, when the seleted tab is Provisional worklist.
         */
        get: function () {
            return (standardisationSetupStore.instance.selectedStandardisationSetupWorkList
                === enums.StandardisationSetup.ProvisionalResponse);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(StandardisationSetupOperationMode.prototype, "isDefinitveMarkingStarted", {
        /**
         * Returns true, when the selected response of the unclassified tab is editable.
         */
        get: function () {
            return (standardisationSetupStore.instance.fetchStandardisationResponseData() &&
                standardisationSetupStore.instance.fetchStandardisationResponseData().hasDefinitiveMark === true) ? true : false;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Opened Response Details
     * @param {string} actualDisplayId
     * @returns {ResponseBase}
     * @memberof MarkingOperationMode
     */
    StandardisationSetupOperationMode.prototype.openedResponseDetails = function (actualDisplayId) {
        var openedResponseDetails = standardisationSetupStore.instance.getResponseDetails(actualDisplayId);
        return openedResponseDetails;
    };
    /**
     * Returns the response position
     * @param {string} displayId
     * @returns {number}
     * @memberof StandardisationSetupOperationMode
     */
    StandardisationSetupOperationMode.prototype.getResponsePosition = function (displayId) {
        return standardisationSetupStore.instance.getResponsePosition(displayId);
    };
    /**
     * Returns whether next response is available or not
     * @param {string} displayId
     * @returns {boolean}
     * @memberof StandardisationSetupOperationMode
     */
    StandardisationSetupOperationMode.prototype.isNextResponseAvailable = function (displayId) {
        return standardisationSetupStore.instance.isNextResponseAvailable(displayId);
    };
    /**
     * Returns whether next response is available or not
     * @param {string} displayId
     * @returns {boolean}
     * @memberof StandardisationSetupOperationMode
     */
    StandardisationSetupOperationMode.prototype.isPreviousResponseAvailable = function (displayId) {
        return standardisationSetupStore.instance.isPreviousResponseAvailable(displayId);
    };
    Object.defineProperty(StandardisationSetupOperationMode.prototype, "currentResponseCount", {
        /**
         * Returns the current response count
         * @readonly
         * @type {number}
         * @memberof StandardisationSetupOperationMode
         */
        get: function () {
            return standardisationSetupStore.instance.currentWorklistResponseCount;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Returns the next response id
     * @param {string} displayId
     * @returns {string}
     * @memberof MarkingOperationMode
     */
    StandardisationSetupOperationMode.prototype.nextResponseId = function (displayId) {
        return standardisationSetupStore.instance.nextResponseId(displayId);
    };
    /**
     * Returns the previous response id
     * @param {string} displayId
     * @returns {string}
     * @memberof MarkingOperationMode
     */
    StandardisationSetupOperationMode.prototype.previousResponseId = function (displayId) {
        return standardisationSetupStore.instance.previousResponseId(displayId);
    };
    /**
     * get Response Details By MarkGroupId
     * @param {number} markGroupId
     * @returns
     * @memberof TeamManagementOperationMode
     */
    StandardisationSetupOperationMode.prototype.getResponseDetailsByMarkGroupId = function (esMarkGroupId) {
        return standardisationSetupStore.instance.getResponseDetailsByMarkGroupId(esMarkGroupId);
    };
    /**
     * Get the tag id
     * @param {string} displayId
     * @memberof MarkingOperationMode
     */
    StandardisationSetupOperationMode.prototype.getTagId = function (displayId) {
        return standardisationSetupStore.instance.getTagId(displayId);
    };
    return StandardisationSetupOperationMode;
}(operationModeBase));
var standardisationSetupOperationMode = new StandardisationSetupOperationMode();
module.exports = standardisationSetupOperationMode;
//# sourceMappingURL=standardisationsetupoperationmode.js.map