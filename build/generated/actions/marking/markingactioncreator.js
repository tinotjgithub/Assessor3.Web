"use strict";
var dispatcher = require('../../app/dispatcher');
var resetMarkInfoLoadstatusAction = require('./resetmarkinfoloadstatusaction');
var Promise = require('es6-promise');
var updateCurrentQuestionItemAction = require('./updatecurrentquestionitemaction');
var saveMarkAction = require('./savemarkaction');
var saveAndNavigateAction = require('./saveandnavigateaction');
var enums = require('../../components/utility/enums');
var markUpdatedAction = require('./updatemarkaction');
var updateMarkingProgressAction = require('./updatemarkingprogressaction');
var removeAnnotationAction = require('./removeannotationaction');
var drawAnnotationAction = require('./drawannotationaction');
var addAnnotationAction = require('./addannotationaction');
var panEndAction = require('./panendaction');
var updateAnnotationPositionAction = require('./updateannotationpositionaction');
var updateAnnotationColorAction = require('./updateannotationcoloraction');
var navigateAfterMarkConfirmationAction = require('./navigateaftermarkconfirmationaction');
var markEditedAction = require('./markeditedaction');
var resetMarksAnnotationAction = require('./resetmarksandannotationaction');
var setmarkentryselection = require('./setmarkentryselectionaction');
var notifyMarkChangedAction = require('./notifymarkchangedaction');
var contextMenuAction = require('./contextmenuaction');
var showGracePeriodMessageAction = require('./showgraceperiodmessageaction');
var showAllPageNotAnnotatedMessageAction = require('./showallpagenotannotatedmessageaction');
var updateMarkAsNRForUnmarkedItemAction = require('./updatemarkasnrforunmarkeditemaction');
var updateMarksAndAnnotationsVisibilityAction = require('./updatemarksandannotationvisibilityaction');
var updateSeenAnnotationAction = require('./updateseenannotationaction');
var markChangeReasonUpdateAction = require('./markchangereasonupdateaction');
var showMarkChangeReasonNeededMessageAction = require('./showmarkchangereasonneededmessageaction');
var setMarkChangeReasonVisibilityAction = require('./setmarkchangereasonvisibilityaction');
var openMarkChangeReasonAction = require('./openmarkchangereasonaction');
var processSaveAndNavigationAction = require('./processsaveandnavigationaction');
var updatePanelWidthAction = require('./updatepanelwidthaction');
var dynamicAnnotationMoveAction = require('./dynamicAnnotationMoveAction');
var markSchemeScrollAction = require('./markschemescrollaction');
var markThisPageNumberAction = require('./setmarkthispagenumberaction');
var nonNumericInfoAction = require('./nonnumericinfoaction');
var setSelectedQuestionItemAction = require('./setselectedquestionitemaction');
var updateNavigationAction = require('./updatenavigationaction');
var isLastNodeSelectedAction = require('./islastnodeselectedaction');
var showReturnToWorklistConfirmationAction = require('./showreturntoworklistconfirmationaction');
var markbyannotationvalidmarkaction = require('./markbyannotationvalidmarkaction');
var addMarkByAnnotationAction = require('./addmarkbyannotationaction');
var setCurrentNavigationAction = require('./setcurrentnavigationaction');
var removeMarksByAnnotationAction = require('./removemarksbyannotationaction');
var setMarkingInProgressAction = require('./setmarkinginprogressaction');
var showResponseNavigationFailureReasonsAction = require('./showresponsenavigationfailurereasonsaction');
var supervisorRemarkDecisionChangeAction = require('./supervisorremarkdecisionchangeaction');
var openSupervisorRemarkDecisionAction = require('./opensupervisorremarkdecisionaction');
var previousMarksAndAnnotationsCopiedAction = require('./previousmarksandannotationscopiedaction');
var showSimulationResponseSubmitConfirmationPopupAction = require('./showsimulationresponsesubmitconfirmationpopupaction');
var removeMarkEntrySelectionAction = require('./removemarkentryselectionaction');
var updatePanelHeightAction = require('./updatepanelheightaction');
var updateOffPageCommentHeightAction = require('../offpagecomments/updateoffpagecommentheightaction');
var updateEnhancedOffpageCommentDataAction = require('./enhancedoffpagecommentdataupdateaction');
var updateAnnotationSelectionAction = require('./updateannotationselectionaction');
var panCancelAction = require('./pancancelaction');
var updateMarkingDetailsAction = require('./updatemarkingdetailsaction');
var stayInResponseAction = require('./stayinresponseaction');
var MarkingActionCreator = (function () {
    function MarkingActionCreator() {
    }
    /**
     * Reset Mark Info Load Status
     * @param isMarkSchemeReset
     */
    MarkingActionCreator.prototype.resetMarkInfoLoadStatus = function (isMarkSchemeReset) {
        return new Promise.Promise(function (resolve, reject) {
            resolve();
        }).then(function () {
            dispatcher.dispatch(new resetMarkInfoLoadstatusAction(isMarkSchemeReset));
        }).catch();
    };
    /**
     * Update store on question item selection change
     * @param selectedNodeInfo
     * @param isQuestionItemChanged [to handle reset]
     */
    MarkingActionCreator.prototype.changeSelectedQuestionItem = function (selectedNodeInfo, isQuestionItemChanged, forceRender) {
        if (isQuestionItemChanged === void 0) { isQuestionItemChanged = true; }
        if (forceRender === void 0) { forceRender = false; }
        new Promise.Promise(function (resolve, reject) {
            resolve();
        }).then(function () {
            dispatcher.dispatch(new updateCurrentQuestionItemAction(true, selectedNodeInfo, isQuestionItemChanged, forceRender));
        }).catch();
    };
    /**
     * Save mark to the marksandannotation collection
     * @param markDetails
     * @param isMarkUpdatedWithoutNavigation - flag is to indicate mark updated but no navigation required,
     * need to rerender mark button.
     * @param isNextResponse - flag is to indicate next response should be opened after save
     * @param isUpdateUsedInTotalOnly - flag is to indicate whether it is a usedintotal update only.
     */
    MarkingActionCreator.prototype.saveMark = function (markDetails, isMarkUpdatedWithoutNavigation, isNextResponse, isUpdateUsedInTotalOnly, isUpdateMarkingProgress) {
        if (isUpdateUsedInTotalOnly === void 0) { isUpdateUsedInTotalOnly = false; }
        if (isUpdateMarkingProgress === void 0) { isUpdateMarkingProgress = true; }
        new Promise.Promise(function (resolve, reject) {
            resolve();
        }).then(function () {
            dispatcher.dispatch(new saveMarkAction(markDetails, isMarkUpdatedWithoutNavigation, isNextResponse, isUpdateUsedInTotalOnly, isUpdateMarkingProgress));
        }).catch();
    };
    /**
     * Trigger save when navigating away from a response
     * @param navigatingTo Navigating from response to different view
     */
    MarkingActionCreator.prototype.saveAndNavigate = function (navigatingTo, navigationFrom, doRequirePopup) {
        if (navigatingTo === void 0) { navigatingTo = enums.SaveAndNavigate.none; }
        new Promise.Promise(function (resolve, reject) {
            resolve();
        }).then(function () {
            dispatcher.dispatch(new saveAndNavigateAction(navigatingTo, navigationFrom, doRequirePopup));
        }).catch();
    };
    /**
     * update navigateTo property in marking store
     * @param navigatingTo
     * @param doEmit
     */
    MarkingActionCreator.prototype.updateNavigation = function (navigatingTo, doEmit) {
        if (navigatingTo === void 0) { navigatingTo = enums.SaveAndNavigate.none; }
        if (doEmit === void 0) { doEmit = true; }
        new Promise.Promise(function (resolve, reject) {
            resolve();
        }).then(function () {
            dispatcher.dispatch(new updateNavigationAction(navigatingTo, doEmit));
        }).catch();
    };
    /**
     * update store with new mark for the current item
     * @param {number} mark
     */
    MarkingActionCreator.prototype.markUpdated = function (allocatedMark) {
        new Promise.Promise(function (resolve, reject) {
            resolve();
        }).then(function () {
            dispatcher.dispatch(new markUpdatedAction(allocatedMark, true));
        }).catch();
    };
    /**
     * update store initial marking progress
     * @param {number} markingProgress
     */
    MarkingActionCreator.prototype.updateInitialMarkingProgress = function (markingProgress) {
        new Promise.Promise(function (resolve, reject) {
            resolve();
        }).then(function () {
            dispatcher.dispatch(new updateMarkingProgressAction(markingProgress, true));
        }).catch();
    };
    /**
     * Remove currently selected/bulk annotation reset from the marking screen
     * @param removeAnnotationList
     * @param isPanAvoidImageContainerRender
     */
    MarkingActionCreator.prototype.removeAnnotation = function (removeAnnotationList, isPanAvoidImageContainerRender, contextMenuType, isLinkAnnotation) {
        if (isPanAvoidImageContainerRender === void 0) { isPanAvoidImageContainerRender = false; }
        if (contextMenuType === void 0) { contextMenuType = enums.ContextMenuType.annotation; }
        if (isLinkAnnotation === void 0) { isLinkAnnotation = false; }
        new Promise.Promise(function (resolve, reject) {
            resolve();
        }).then(function () {
            dispatcher.dispatch(new removeAnnotationAction(removeAnnotationList, isPanAvoidImageContainerRender, contextMenuType, isLinkAnnotation));
        }).catch();
    };
    /**
     * Update annotation drawing mode
     * @param drawStart
     */
    MarkingActionCreator.prototype.onAnnotationDraw = function (drawStart) {
        new Promise.Promise(function (resolve, reject) {
            resolve();
        }).then(function () {
            dispatcher.dispatch(new drawAnnotationAction(drawStart));
        }).catch();
    };
    /**
     * Add newly added annotation to the collection
     */
    MarkingActionCreator.prototype.addNewlyAddedAnnotation = function (addedAnnotation, action, annotationOverlayId, previousMarkIndex, isStitched, avoidEventEmition, pageLinkedByPreviousMarker) {
        if (isStitched === void 0) { isStitched = false; }
        if (avoidEventEmition === void 0) { avoidEventEmition = false; }
        if (pageLinkedByPreviousMarker === void 0) { pageLinkedByPreviousMarker = false; }
        new Promise.Promise(function (resolve, reject) {
            resolve();
        }).then(function () {
            dispatcher.dispatch(new addAnnotationAction(addedAnnotation, action, annotationOverlayId, previousMarkIndex, isStitched, avoidEventEmition, pageLinkedByPreviousMarker));
        }).catch();
    };
    /**
     * Action creator to reset marks and annotation
     * @param {boolean} resetMarks
     * @param {boolean} resetAnnotation
     * @param {string} previousMark
     */
    MarkingActionCreator.prototype.resetMarksAndAnnotation = function (resetMarks, resetAnnotation, previousMark) {
        new Promise.Promise(function (resolve, reject) {
            resolve();
        }).then(function () {
            dispatcher.dispatch(new resetMarksAnnotationAction(resetMarks, resetAnnotation, previousMark));
        }).catch();
    };
    /**
     * This action will be triggered when drag/touch is ended by the user
     * @param xPos
     * @param yPos
     * @param elementId
     * @param panSource
     * @param isAnnotationOverlapped
     * @param isAnnotationPlacedInGreyArea
     */
    MarkingActionCreator.prototype.panEndAction = function (stampId, xPos, yPos, elementId, panSource, isAnnotationOverlapped, isAnnotationPlacedInGreyArea) {
        new Promise.Promise(function (resolve, reject) {
            resolve();
        }).then(function () {
            dispatcher.dispatch(new panEndAction(stampId, xPos, yPos, elementId, panSource, isAnnotationOverlapped, isAnnotationPlacedInGreyArea));
        }).catch();
    };
    /**
     * Update annotation action method
     * @param leftEdge
     * @param topEdge
     * @param topEdge
     * @param topEdge
     * @param topEdge
     * @param currentAnnotationClientToken
     * @param markingOperation
     * @param width
     * @param height
     * @param comment
     * @param isPositionUpdated
     * @param isDrawEndOfStampFromStampPanel
     * @param stampId
     */
    MarkingActionCreator.prototype.updateAnnotation = function (leftEdge, topEdge, imageClusterId, outputPageNo, pageNo, currentAnnotationClientToken, width, height, comment, isPositionUpdated, isDrawEndOfStampFromStampPanel, avoidEventEmit, stampId) {
        if (comment === void 0) { comment = ''; }
        if (isPositionUpdated === void 0) { isPositionUpdated = true; }
        if (isDrawEndOfStampFromStampPanel === void 0) { isDrawEndOfStampFromStampPanel = false; }
        if (avoidEventEmit === void 0) { avoidEventEmit = false; }
        new Promise.Promise(function (resolve, reject) {
            resolve();
        }).then(function () {
            dispatcher.dispatch(new updateAnnotationPositionAction(leftEdge, topEdge, imageClusterId, outputPageNo, pageNo, currentAnnotationClientToken, width, height, comment, isPositionUpdated, isDrawEndOfStampFromStampPanel, avoidEventEmit, stampId));
        }).catch();
    };
    /**
     * Update annotation color action method
     * @param currentAnnotation
     */
    MarkingActionCreator.prototype.updateAnnotationColor = function (currentAnnotation) {
        new Promise.Promise(function (resolve, reject) {
            resolve();
        }).then(function () {
            dispatcher.dispatch(new updateAnnotationColorAction(currentAnnotation));
        }).catch();
    };
    /**
     * trigger navigation after confirmation hide
     */
    MarkingActionCreator.prototype.navigationAfterMarkConfirmation = function (navigateFrom, navigateTo) {
        new Promise.Promise(function (resolve, reject) {
            resolve();
        }).then(function () {
            dispatcher.dispatch(new navigateAfterMarkConfirmationAction(navigateFrom, navigateTo));
        }).catch();
    };
    /**
     * update the mark has been edited.
     */
    MarkingActionCreator.prototype.markEdited = function (isMarkEdited) {
        new Promise.Promise(function (resolve, reject) {
            resolve();
        }).then(function () {
            dispatcher.dispatch(new markEditedAction(isMarkEdited));
        }).catch();
    };
    /**
     * Set the mark entry selected forcefully if it doesnt have the focus.
     */
    MarkingActionCreator.prototype.setMarkEntrySelected = function (commentSelected, bookmarkSelected) {
        if (commentSelected === void 0) { commentSelected = false; }
        if (bookmarkSelected === void 0) { bookmarkSelected = false; }
        new Promise.Promise(function (resolve, reject) {
            resolve();
        }).then(function () {
            dispatcher.dispatch(new setmarkentryselection(commentSelected, bookmarkSelected));
        }).catch();
    };
    /**
     * Remove mark entry selection.
     */
    MarkingActionCreator.prototype.removeMarkEntrySelection = function () {
        new Promise.Promise(function (resolve, reject) {
            resolve();
        }).then(function () {
            dispatcher.dispatch(new removeMarkEntrySelectionAction());
        }).catch();
    };
    /**
     * Publish an event to let know that resetting has been finished.
     */
    MarkingActionCreator.prototype.notifyMarkUpdated = function (markingProgress, warningNR) {
        new Promise.Promise(function (resolve, reject) {
            resolve();
        }).then(function () {
            dispatcher.dispatch(new notifyMarkChangedAction(markingProgress, warningNR));
        }).catch();
    };
    /**
     * Context menu action (show/hide)
     * @param isVisible
     * @param xPos
     * @param yPos
     * @param contextMenuData
     */
    MarkingActionCreator.prototype.showOrHideRemoveContextMenu = function (isVisible, xPos, yPos, contextMenuData) {
        new Promise.Promise(function (resolve, reject) {
            resolve();
        }).then(function () {
            dispatcher.dispatch(new contextMenuAction(isVisible, xPos, yPos, contextMenuData));
        }).catch();
    };
    /**
     * Update panel width
     * @param widthInPercent
     * @param className
     */
    MarkingActionCreator.prototype.updatePanelWidth = function (widthInPercent, className, panelType, panActionType) {
        new Promise.Promise(function (resolve, reject) {
            resolve();
        }).then(function () {
            dispatcher.dispatch(new updatePanelWidthAction(enums.markSchemePanelType.resizedPanel, widthInPercent, className, panelType, panActionType));
        }).catch();
    };
    /**
     * Set default panel width
     * @param width
     * @param previousMarkListWidth
     */
    MarkingActionCreator.prototype.setDefaultPanelWidth = function (width, previousMarkListWidth) {
        new Promise.Promise(function (resolve, reject) {
            resolve();
        }).then(function () {
            dispatcher.dispatch(new updatePanelWidthAction(enums.markSchemePanelType.defaultPanel, width, '', enums.ResizePanelType.None, enums.PanActionType.None, previousMarkListWidth));
        }).catch();
    };
    /**
     * Update default panel width after marklist column is updated
     * @param width
     * @param isPreviousMarkListColumnVisible
     */
    MarkingActionCreator.prototype.updateDefaultPanelWidth = function (width, isPreviousMarkListColumnVisible) {
        if (isPreviousMarkListColumnVisible === void 0) { isPreviousMarkListColumnVisible = false; }
        new Promise.Promise(function (resolve, reject) {
            resolve();
        }).then(function () {
            dispatcher.dispatch(new updatePanelWidthAction(enums.markSchemePanelType.updateDefaultPanel, width, '', enums.ResizePanelType.None, enums.PanActionType.None, 0, isPreviousMarkListColumnVisible));
        }).catch();
    };
    /**
     * Set minimum panel width
     * @param width
     */
    MarkingActionCreator.prototype.setMinimumPanelWidth = function (width) {
        new Promise.Promise(function (resolve, reject) {
            resolve();
        }).then(function () {
            dispatcher.dispatch(new updatePanelWidthAction(enums.markSchemePanelType.minimumWidthPanel, width));
        }).catch();
    };
    /**
     * Update Panel resizing class name
     * @param className
     */
    MarkingActionCreator.prototype.updatePanelResizingClassName = function (className) {
        new Promise.Promise(function (resolve, reject) {
            resolve();
        }).then(function () {
            dispatcher.dispatch(new updatePanelWidthAction(enums.markSchemePanelType.resizingClassName, '', className));
        }).catch();
    };
    /**
     * Publish an event to let know that response in grace period is not fully marked/all pages not annotated.
     * @param failureReason
     */
    MarkingActionCreator.prototype.showGracePeriodNotFullyMarkedMessage = function (failureReason) {
        if (failureReason === void 0) { failureReason = enums.ResponseNavigateFailureReason.MarksMissingInGracePeriodResponse; }
        new Promise.Promise(function (resolve, reject) {
            resolve();
        }).then(function () {
            dispatcher.dispatch(new showGracePeriodMessageAction(failureReason));
        }).catch();
    };
    /**
     * Publish an event to let know that all page not annotated popup has to be displayed.
     * @param navigatingTo
     */
    MarkingActionCreator.prototype.showAllPageNotAnnotatedMessage = function (navigatingTo) {
        new Promise.Promise(function (resolve, reject) {
            resolve();
        }).then(function () {
            dispatcher.dispatch(new showAllPageNotAnnotatedMessageAction(navigatingTo));
        }).catch();
    };
    /**
     * Updating marks and annotations visibility.
     * @param {number} index
     * @param {MarksAndAnnotationsVisibilityInfo} _marksAndAnnotationVisibilityDetails
     */
    MarkingActionCreator.prototype.updateMarksAndAnnotationVisibility = function (index, _marksAndAnnotationVisibilityDetails, isEnchancedOffpageCommentVisible, selectedCommentIndex) {
        new Promise.Promise(function (resolve, reject) {
            resolve();
        }).then(function () {
            dispatcher.dispatch(new updateMarksAndAnnotationsVisibilityAction(index, _marksAndAnnotationVisibilityDetails, isEnchancedOffpageCommentVisible, selectedCommentIndex));
        }).catch();
    };
    /**
     * Updating 'Flag as seen' annotation- to consider whether all pages are annotated.
     * @param isAllPagesAnnotated
     * @param treeViewItem
     */
    MarkingActionCreator.prototype.updateSeenAnnotation = function (isAllPagesAnnotated, treeViewItem) {
        new Promise.Promise(function (resolve, reject) {
            resolve();
        }).then(function () {
            dispatcher.dispatch(new updateSeenAnnotationAction(isAllPagesAnnotated, treeViewItem));
        }).catch();
    };
    /**
     * Publish an event to enter the mark as NR for umarked question item on clicking yes on completed dialog.
     */
    MarkingActionCreator.prototype.updateMarkAsNRForUnmarkedItem = function () {
        new Promise.Promise(function (resolve, reject) {
            resolve();
        }).then(function () {
            dispatcher.dispatch(new updateMarkAsNRForUnmarkedItemAction());
        }).catch();
    };
    /**
     * Updating markChangeReason.
     * @param {markChangeReason} markChangeReason
     */
    MarkingActionCreator.prototype.markChangeReasonUpdated = function (markChangeReason) {
        return new Promise.Promise(function (resolve, reject) {
            resolve();
        }).then(function () {
            dispatcher.dispatch(new markChangeReasonUpdateAction(markChangeReason));
        }).catch();
    };
    /**
     * Publish an event for showing mark change reason needed warning dialog.
     * @param {enums.ResponseNavigateFailureReason} failureReason
     * @param {enums.SaveAndNavigate} navigateTo
     */
    MarkingActionCreator.prototype.showMarkeChangeReasonNeededMessage = function (failureReason, navigateTo) {
        new Promise.Promise(function (resolve, reject) {
            resolve();
        }).then(function () {
            dispatcher.dispatch(new showMarkChangeReasonNeededMessageAction(failureReason, navigateTo));
        }).catch();
    };
    /**
     * Setting mark change reason visibility in store.
     * @param {boolean} _isMarkChangeReasonVisible
     */
    MarkingActionCreator.prototype.setMarkChangeReasonVisibility = function (_isMarkChangeReasonVisible) {
        new Promise.Promise(function (resolve, reject) {
            resolve();
        }).then(function () {
            dispatcher.dispatch(new setMarkChangeReasonVisibilityAction(_isMarkChangeReasonVisible));
        }).catch();
    };
    /**
     * Publish an event for showing mark change reason popup for entering value.
     */
    MarkingActionCreator.prototype.openMarkChangeReasonPopUp = function () {
        new Promise.Promise(function (resolve, reject) {
            resolve();
        }).then(function () {
            dispatcher.dispatch(new openMarkChangeReasonAction());
        }).catch();
    };
    /**
     * Publish an event for showing supervisor decision popup.
     */
    MarkingActionCreator.prototype.openSupervisorRemarkDecisionPopUp = function () {
        new Promise.Promise(function (resolve, reject) {
            resolve();
        }).then(function () {
            dispatcher.dispatch(new openSupervisorRemarkDecisionAction());
        }).catch();
    };
    /**
     * Start save and navigation after showing the save indicator
     */
    MarkingActionCreator.prototype.processSaveAndNavigation = function () {
        new Promise.Promise(function (resolve, reject) {
            resolve();
        }).then(function () {
            dispatcher.dispatch(new processSaveAndNavigationAction());
        });
    };
    /**
     * Publish an event while dynamic elements moving.
     */
    MarkingActionCreator.prototype.dynamicAnnotationMoveAction = function (movingElementProperties) {
        new Promise.Promise(function (resolve, reject) {
            resolve();
        }).then(function () {
            dispatcher.dispatch(new dynamicAnnotationMoveAction(movingElementProperties));
        }).catch();
    };
    /**
     * Publish an event to reset scroll
     */
    MarkingActionCreator.prototype.markSchemeScrollReset = function () {
        new Promise.Promise(function (resolve, reject) {
            resolve();
        }).then(function () {
            dispatcher.dispatch(new markSchemeScrollAction());
        });
    };
    /**
     * Set mark this page number
     * @param {number} markThisPageNumber
     */
    MarkingActionCreator.prototype.setMarkThisPageNumber = function (markThisPageNumber) {
        new Promise.Promise(function (resolve, reject) {
            resolve();
        }).then(function () {
            dispatcher.dispatch(new markThisPageNumberAction(markThisPageNumber));
        });
    };
    /**
     * Set non numeric marking info
     * @param {number} markThisPageNumber
     */
    MarkingActionCreator.prototype.setNonNumericInfo = function () {
        new Promise.Promise(function (resolve, reject) {
            resolve();
        }).then(function () {
            dispatcher.dispatch(new nonNumericInfoAction());
        });
    };
    /**
     * set the selected question item index
     * @param index
     */
    MarkingActionCreator.prototype.setSelectedQuestionItemIndex = function (index, uniqueId) {
        new Promise.Promise(function (resolve, reject) {
            resolve();
        }).then(function () {
            dispatcher.dispatch(new setSelectedQuestionItemAction(index, uniqueId));
        });
    };
    /**
     * set the selected question item index
     * @param index
     */
    MarkingActionCreator.prototype.isLastNodeSelected = function (status) {
        new Promise.Promise(function (resolve, reject) {
            resolve();
        }).then(function () {
            dispatcher.dispatch(new isLastNodeSelectedAction(status));
        });
    };
    /**
     * show the return to worklist confirmation action
     * @param index
     */
    MarkingActionCreator.prototype.showReturnToWorklistConfirmation = function () {
        new Promise.Promise(function (resolve, reject) {
            resolve();
        }).then(function () {
            dispatcher.dispatch(new showReturnToWorklistConfirmationAction());
        });
    };
    /**
     * returns the mark by annotation is valid
     */
    MarkingActionCreator.prototype.validatedAndContinue = function (newAnnotation, action, annotationOverlayID) {
        new Promise.Promise(function (resolve, reject) {
            resolve();
        }).then(function () {
            dispatcher.dispatch(new markbyannotationvalidmarkaction(newAnnotation, action, annotationOverlayID));
        });
    };
    /**
     * add mark by annotation action
     * @param annotation
     * @param action
     * @param id
     */
    MarkingActionCreator.prototype.addMarkByAnnotationAction = function (annotation, action, id) {
        new Promise.Promise(function (resolve, reject) {
            resolve();
        }).then(function () {
            dispatcher.dispatch(new addMarkByAnnotationAction(annotation, action, id));
        });
    };
    /**
     * Set the current navigation type of the response.
     * @param {enums} isNavigationThroughMarkScheme
     */
    MarkingActionCreator.prototype.setNavigationThroughMarkscheme = function (isNavigationThroughMarkScheme) {
        new Promise.Promise(function (resolve, reject) {
            resolve();
        }).then(function () {
            dispatcher.dispatch(new setCurrentNavigationAction(true, isNavigationThroughMarkScheme));
        }).catch();
    };
    /**
     * remove marks by annotation action.
     * @param removedAnnotation
     */
    MarkingActionCreator.prototype.removeMarksByAnnotation = function (removedAnnotation) {
        new Promise.Promise(function (resolve, reject) {
            resolve();
        }).then(function () {
            dispatcher.dispatch(new removeMarksByAnnotationAction(removedAnnotation));
        }).catch();
    };
    /**
     * Method to set marking is in progress.
     * @param isMarkingProgress
     */
    MarkingActionCreator.prototype.setMarkingInProgress = function (isMarkingProgress) {
        new Promise.Promise(function (resolve, reject) {
            resolve();
        }).then(function () {
            dispatcher.dispatch(new setMarkingInProgressAction(isMarkingProgress));
        }).catch();
    };
    /**
     * Publish an event to let know that all page not annotated popup has to be displayed.
     * @param navigatingTo
     */
    MarkingActionCreator.prototype.showResponseNavigationFailureReasons = function (navigatingTo, warningMessages, navigatingFrom) {
        new Promise.Promise(function (resolve, reject) {
            resolve();
        }).then(function () {
            dispatcher.dispatch(new showResponseNavigationFailureReasonsAction(navigatingTo, warningMessages, navigatingFrom));
        }).catch();
    };
    /**
     * Publish an event to let know that supervisor remark decison has been changed.
     * @param navigatingTo
     */
    MarkingActionCreator.prototype.supervisorRemarkDecisionChange = function (accuracyIndicator, remarkDecision) {
        new Promise.Promise(function (resolve, reject) {
            resolve();
        }).then(function () {
            dispatcher.dispatch(new supervisorRemarkDecisionChangeAction(accuracyIndicator, remarkDecision));
        }).catch();
    };
    /**
     * update the mark has been edited.
     */
    MarkingActionCreator.prototype.copiedPreviousMarksAndAnnotations = function () {
        new Promise.Promise(function (resolve, reject) {
            resolve();
        }).then(function () {
            dispatcher.dispatch(new previousMarksAndAnnotationsCopiedAction());
        }).catch();
    };
    /**
     * show confirmation popup for simulation response/s on submit
     * @param markGroupId
     * @param fromMarkScheme
     */
    MarkingActionCreator.prototype.showSimulationResponseSubmitConfirmationPopup = function (markGroupId, fromMarkScheme) {
        if (markGroupId === void 0) { markGroupId = 0; }
        if (fromMarkScheme === void 0) { fromMarkScheme = false; }
        new Promise.Promise(function (resolve, reject) {
            resolve();
        }).then(function () {
            dispatcher.dispatch(new showSimulationResponseSubmitConfirmationPopupAction(markGroupId, fromMarkScheme));
        }).catch();
    };
    /**
     * update panel height
     * @param {string} heightInPercent
     * @param {string} className
     * @memberof MarkingActionCreator
     */
    MarkingActionCreator.prototype.updatePanelHeight = function (heightInPercent, className, offsetOverlapped, panActionType, panelType) {
        new Promise.Promise(function (resolve, reject) {
            resolve();
        }).then(function () {
            dispatcher.dispatch(new updatePanelHeightAction(enums.PanelActionType.ResizedPanel, panActionType, heightInPercent, className, panelType, offsetOverlapped));
        }).catch();
    };
    /**
     * on panel visiblity change
     *
     * @memberof MarkingActionCreator
     */
    MarkingActionCreator.prototype.reRenderImageOnVisiblityChange = function () {
        new Promise.Promise(function (resolve, reject) {
            resolve();
        }).then(function () {
            dispatcher.dispatch(new updatePanelHeightAction(enums.PanelActionType.Visiblity));
        }).catch();
    };
    /**
     * update offpage comment panel height
     * @param {number} heightInPercent
     * @memberof MarkingActionCreator
     */
    MarkingActionCreator.prototype.updateOffPageCommentPanelHeight = function (heightInPercent, panActionType) {
        new Promise.Promise(function (resolve, reject) {
            resolve();
        }).then(function () {
            dispatcher.dispatch(new updateOffPageCommentHeightAction(enums.PanelActionType.ResizedPanel, panActionType, heightInPercent));
        }).catch();
    };
    /**
     * Action for Enhanced offpage comment data update.
     * @param index
     */
    MarkingActionCreator.prototype.updateEnhancedOffpageCommentData = function (index, markGroupId, style, remarkHeaderText) {
        new Promise.Promise(function (resolve, reject) {
            resolve();
        }).then(function () {
            dispatcher.dispatch(new updateEnhancedOffpageCommentDataAction(index, markGroupId, style, remarkHeaderText));
        }).catch();
    };
    /**
     * This method will unselect selected dynamic annotation
     *
     * @param {boolean} isSelected
     * @memberof MarkingActionCreator
     */
    MarkingActionCreator.prototype.updateAnnotationSelection = function (isSelected) {
        new Promise.Promise(function (resolve, reject) {
            resolve();
        }).then(function () {
            dispatcher.dispatch(new updateAnnotationSelectionAction(isSelected));
        }).catch();
    };
    /**
     * This method will call pancancel action
     */
    MarkingActionCreator.prototype.panCancelAction = function () {
        new Promise.Promise(function (resolve, reject) {
            resolve();
        }).then(function () {
            dispatcher.dispatch(new panCancelAction());
        }).catch();
    };
    /**
     * update Marking Details
     * @param {number} markDetails
     * @param {number} isAllPagesAnnotated
     * @param {number} markGroupId
     * @memberof MarkingActionCreator
     */
    MarkingActionCreator.prototype.updateMarkingDetails = function (markDetails, isAllPagesAnnotated, markGroupId) {
        new Promise.Promise(function (resolve, reject) {
            resolve();
        }).then(function () {
            dispatcher.dispatch(new updateMarkingDetailsAction(markDetails, isAllPagesAnnotated, markGroupId));
        }).catch();
    };
    /**
     * Action to disable mbq popup.
     */
    MarkingActionCreator.prototype.stayInResponse = function () {
        new Promise.Promise(function (resolve, reject) {
            resolve();
        }).then(function () {
            dispatcher.dispatch(new stayInResponseAction());
        }).catch();
    };
    return MarkingActionCreator;
}());
var markingActionCreator = new MarkingActionCreator();
module.exports = markingActionCreator;
//# sourceMappingURL=markingactioncreator.js.map