"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var standardisationsetupstore = require('../standardisationsetup/standardisationsetupstore');
var storeBase = require('../base/storebase');
var constants = require('../../components/utility/constants');
var dispatcher = require('../../app/dispatcher');
var actionType = require('../../actions/base/actiontypes');
var enums = require('../../components/utility/enums');
var workListStore = require('../worklist/workliststore');
var qigStore = require('../qigselector/qigstore');
var NR_MARK_STATUS = 'Not Attempted';
var NOT_ATTEMPTED = 'NR';
var markingProgressDetails = require('../../dataservices/response/markingprogressdetails');
var Immutable = require('immutable');
var markChangeReasonInfo = require('./typings/markchangereasoninfo');
var marksAndAnnotationsVisibilityHelper = require('../../components/utility/marking/marksandannotationsvisibilityhelper');
var examinerStore = require('../markerinformation/examinerstore');
var ccHelper = require('../../utility/configurablecharacteristic/configurablecharacteristicshelper');
var ccNames = require('../../utility/configurablecharacteristic/configurablecharacteristicsnames');
var supervisorRemarkDecision = require('../../dataservices/response/supervisorremarkdecision');
var htmlUtilities = require('../../utility/generic/htmlutilities');
var storageAdapterHelper = require('../../dataservices/storageadapters/storageadapterhelper');
/**
 * Class for Marking store, stores all information regarding marking.
 */
var MarkingStore = (function (_super) {
    __extends(MarkingStore, _super);
    /**
     * @constructor
     */
    function MarkingStore() {
        var _this = this;
        _super.call(this);
        this._showNavigationOnMbqPopup = false;
        /* Whether the marking is happening and mark scheme panel is visible */
        this._isMarkingInProgress = false;
        /* Whether to emit readytonavigae event or not */
        this.isNavigationStarted = false;
        /* Whether marks are saved to db */
        this._isMarksSavedToDb = false;
        /* flag is to indicate whether the current mark is updated or not */
        this._isEdited = false;
        this._currentResponseMarkingProgress = 0;
        this._commentLeft = 0;
        this._commentTop = 0;
        this.updatedStampId = 0;
        this.linkWholePageNumber = 0;
        // Update the zoom container width when pinch to zoom is triggred to prepare container
        // for tranform
        this._zoomToWidth = 0;
        this._isNonNumeric = false;
        this._operationMode = enums.MarkerOperationMode.Marking;
        this._annotationUniqueIds = new Array();
        this._isRotating = false;
        // The Save Marks and annotation trigger point tracker
        this._saveMarksAndAnnotationTriggeringPoint = enums.SaveMarksAndAnnotationsProcessingTriggerPoint.None;
        // The Save Marks and annotation trigger point tracker for previous trigger point
        this._saveMarksAndAnnotationPreviousTriggeringPoint = enums.SaveMarksAndAnnotationsProcessingTriggerPoint.None;
        // variable to check if all pages are annotated and update in marking progress.
        this.isAllPagesAnnotated = false;
        this._isPreviousMarkListColumnVisible = false;
        this._isAllFilesViewedStatusUpdated = false;
        this._isWholeResponse = false;
        this.storageAdapterHelper = new storageAdapterHelper();
        this._examinerMarksAgainstResponse = [];
        this.marksAndAnnotationVisibilityDetails = Immutable.Map();
        this.markChangeReasonData = Immutable.Map();
        this.supervisorRemarkDecisionData = Immutable.Map();
        this.dispatchToken = dispatcher.register(function (action) {
            switch (action.actionType) {
                case actionType.RETRIEVE_MARKS:
                    var retrieveMarksAction_1 = action;
                    if (retrieveMarksAction_1.isSuccess && retrieveMarksAction_1.examinerMarkDetails.examinerMarkGroupDetails) {
                        var markGroupId = retrieveMarksAction_1.markGroupId;
                        if (_this._examinerMarksAgainstResponse[markGroupId] === undefined
                            || _this._examinerMarksAgainstResponse[markGroupId] == null) {
                            var emptyMarkData = {
                                errorMessage: '',
                                examinerMarkGroupDetails: undefined,
                                wholeResponseQIGToRIGMapping: undefined,
                                success: false,
                                errorType: enums.SaveMarksAndAnnotationErrorCode.None,
                                IsAwaitingToBeQueued: false,
                                IsBackGroundSave: false
                            };
                            _this._examinerMarksAgainstResponse[markGroupId] = emptyMarkData;
                        }
                        _this._examinerMarksAgainstResponse[markGroupId] = retrieveMarksAction_1.examinerMarkDetails;
                        // set remarkrequesttype for each annotation
                        _this.setRemarkRequestType(markGroupId);
                        var allMarksAndAnnotations = _this._examinerMarksAgainstResponse[markGroupId].
                            examinerMarkGroupDetails[markGroupId].
                            allMarksAndAnnotations;
                        // set the display status of marks and annotations to be shown when response is loaded
                        _this.marksAndAnnotationVisibilityDetails = _this.marksAndAnnotationVisibilityDetails.set(markGroupId, marksAndAnnotationsVisibilityHelper.setMarksAndAnnotationsVisibility(allMarksAndAnnotations, markGroupId, _this._currentResponseMode, _this._currentWorklistType));
                        _this._isMarksAndMarkSchemesLoadedFailed = false;
                        /** Emitting after clicking on response item */
                        _this.emit(MarkingStore.RETRIEVE_MARKS_EVENT, markGroupId);
                    }
                    else {
                        _this._isMarksAndMarkSchemesLoadedFailed = true;
                    }
                    break;
                case actionType.UPDATE_SELECTED_QUESTION_ITEM:
                    _this._previousQuestionItemImageClusterId = _this._currentQuestionItemInfo ? _this._currentQuestionItemInfo.imageClusterId
                        : undefined;
                    _this._previousQuestionItem = _this._currentQuestionItemInfo ? _this._currentQuestionItemInfo.uniqueId
                        : undefined;
                    _this._previousQuestionItemQuestionTagId = _this._currentQuestionItemInfo ? _this._currentQuestionItemInfo.questionTagId
                        : undefined;
                    _this._previousAnswerItemId = _this.currentQuestionItemInfo ? _this._currentQuestionItemInfo.answerItemId
                        : undefined;
                    _this._currentQuestionItemInfo = action.currentQuestionInfo;
                    _this._forceUpdate = action.isForceUpdate;
                    // For whole response scenarios, get the corresponding MarkSchemeGroupId and ExaminerRoleId to save
                    _this._selectedQIGMarkSchemeGroupId = _this._currentQuestionItemInfo ?
                        _this._currentQuestionItemInfo.markSchemeGroupId : null;
                    _this._selectedQIGMarkGroupId = _this.getMarkGroupIdQIGtoRIGMap(_this._selectedQIGMarkSchemeGroupId);
                    // Selected QIG Examinor Role ID of Examiner for whom response is allocated(Subordinate in teammanagement)
                    _this._selectedQIGExaminerRoleId = _this.getExaminerRoleQIGtoRIGMap(_this._currentMarkGroupId, _this._selectedQIGMarkGroupId);
                    // Selected QIG Examinor Role Id of Logged in user(For teammanagement)
                    _this._selectedQIGExaminerRoleIdOfLoggedInUser =
                        _this.getSelectedQIGExaminerRoleIdOfLoggedInUser(_this.selectedQIGMarkSchemeGroupId);
                    if (_this._previousMarkSchemeGroupId !== _this._selectedQIGMarkSchemeGroupId &&
                        _this._selectedQIGMarkSchemeGroupId > 0) {
                        _this.emit(MarkingStore.QIG_CHANGED_IN_WHOLE_RESPONSE_EVENT, _this._selectedQIGMarkSchemeGroupId, _this._previousMarkSchemeGroupId);
                        _this._previousMarkSchemeGroupId = _this._selectedQIGMarkSchemeGroupId;
                    }
                    // Publish changed event only if the markscheme has changed.
                    // For resetting marks we dont need to reset the page.
                    if (action.isCurrentQuestionItemChanged) {
                        /** Emitting after updating current question item */
                        _this.emit(MarkingStore.CURRENT_QUESTION_ITEM_CHANGE_EVENT, _this._currentQuestionItemInfo.bIndex, _this._forceUpdate);
                    }
                    break;
                case actionType.OPEN_RESPONSE:
                    _this._previousMarkGroupId = _this._currentMarkGroupId;
                    var openAction = action;
                    _this._currentMarkGroupId = openAction.selectedMarkGroupId;
                    _this._currentQuestionItemInfo = undefined;
                    _this._previousQuestionItemImageClusterId = undefined;
                    _this._previousMarkSchemeGroupId = undefined;
                    _this._selectedDisplayId = openAction.selectedDisplayId;
                    _this._selectedQIGMarkGroupId = undefined;
                    _this._isWholeResponse = openAction.isWholeResponse;
                    _this._previousQuestionItemQuestionTagId = undefined;
                    _this._previousAnswerItemId = undefined;
                    // getting marking start time.
                    var startDate = new Date();
                    _this._markingStartTime = new Date(startDate.getUTCFullYear(), startDate.getUTCMonth(), startDate.getUTCDate(), startDate.getUTCHours(), startDate.getUTCMinutes(), startDate.getUTCSeconds(), startDate.getUTCMilliseconds());
                    //  this variable is using for displaying non-recoverable error popup.
                    _this._currentMarkGroupItemHasNonRecoverableErrors =
                        _this.checkMarkGroupItemHasNonRecoverableErrors(_this.currentMarkGroupId);
                    /* if the response is opened from open live work list, marking is possible */
                    if (_this.isResponseEditable(openAction.selectedResponseMode)
                        && openAction.responseViewMode === enums.ResponseViewMode.zoneView
                        && (_this.currentOperationMode === enums.MarkerOperationMode.Marking
                            || _this.currentOperationMode === enums.MarkerOperationMode.StandardisationSetup)) {
                        _this._isMarkingInProgress = true;
                    }
                    else {
                        _this._isMarkingInProgress = false;
                    }
                    _this._currentResponseMode = openAction.selectedResponseMode;
                    _this._currentWorklistType = workListStore.instance.currentWorklistType;
                    /* setting the currentNavigation value before this._navigatingTo value going to set as None
                       - this is for setting the questionItem as selected when we open the response which is 100%marked.*/
                    _this._currentNavigation = _this._navigatingTo;
                    /* on opening a new response the navigatingTo and isNavigationStarted needs to be reseted. */
                    _this._navigatingTo = enums.SaveAndNavigate.none;
                    _this.isNavigationStarted = false;
                    // rest the marks and annotation visibility data collection while opening the response.
                    var examinerMarksAgainstResponse = _this._examinerMarksAgainstResponse[_this._currentMarkGroupId.toString()];
                    if (examinerMarksAgainstResponse) {
                        var allMarksAndAnnotations = examinerMarksAgainstResponse.
                            examinerMarkGroupDetails[_this._currentMarkGroupId.toString()].
                            allMarksAndAnnotations;
                        if (allMarksAndAnnotations) {
                            // set the display status of marks and annotations to be shown when response is loaded
                            _this.marksAndAnnotationVisibilityDetails = _this.marksAndAnnotationVisibilityDetails.set(_this.currentMarkGroupId, marksAndAnnotationsVisibilityHelper.setMarksAndAnnotationsVisibility(allMarksAndAnnotations, _this._currentMarkGroupId, _this._currentResponseMode, _this._currentWorklistType));
                            _this._currentResponseMarkingProgress = allMarksAndAnnotations[0].markingProgress;
                            // set the value as Undefined when we open a response.
                            _this._warningNR = undefined;
                        }
                    }
                    _this.setMarkChangeReasonInfo();
                    _this.setSupervisorRemarkDecision();
                    _this.emit(MarkingStore.OPEN_RESPONSE_EVENT);
                    break;
                case actionType.SAVE_MARK:
                    var saveMark = action;
                    _this.candidateScriptId = saveMark.saveMarkDetails.candidateScriptId;
                    _this._isNextResponse = saveMark.isNextResponse;
                    /* Save mark to the marks collection */
                    _this.saveMark(saveMark.saveMarkDetails, saveMark.isUpdateUsedInTotalOnly, saveMark.isUpdateMarkingProgress);
                    _this._currentResponseMarkingProgress = saveMark.saveMarkDetails.overallMarkingProgress;
                    if (saveMark.isMarkUpdatedWithoutNavigation) {
                        _this.emit(MarkingStore.MARK_UPDATED_WITHOUT_NAVIGATION_EVENT);
                    }
                    if (saveMark.saveMarkDetails.markingProgress === 100) {
                        _this.emit(MarkingStore.RESPONSE_FULLY_MARKED_EVENT);
                    }
                    break;
                case actionType.SHOW_RETURN_TO_WORKLIST_CONFIRMATION_ACTION:
                    // Resetting the value once it shows the return to worklist poup.
                    _this._showNavigationOnMbqPopup = false;
                    // Set the value as false for the markscheme navigation after popup display
                    _this.isNavigationStarted = false;
                    // Restting the value as false ,once it shows the markconfirmation poup after save.
                    _this._isEdited = false;
                    break;
                case actionType.SAVE_AND_NAVIGATE:
                    _this._navigatingTo = action.navigatingTo;
                    _this._showNavigationOnMbqPopup = action.showNavigationOnMbqPopup;
                    _this._navigationFrom = action.navigationFrom;
                    _this._selectedBookmarkClientToken = undefined;
                    /* if marking is happening and we are not navigating from full response view to normal view
                     * start save and navigate.
                     */
                    if (_this._isMarkingInProgress && _this._navigatingTo !== enums.SaveAndNavigate.toCurrentResponse) {
                        // If there are edited marks that are going to add to the collection,
                        // then show the save message indicator.
                        if (_this._navigatingTo === enums.SaveAndNavigate.toResponse
                            && _this._examinerMarksAgainstResponse[_this._currentMarkGroupId].IsAwaitingToBeQueued === true) {
                            _this.emit(MarkingStore.SAVE_AND_NAVIGATE_INITIATED_EVENT);
                        }
                        else {
                            /* set to emit ready to navigate event aftyer the mark save */
                            _this.isNavigationStarted = true;
                            _this.emit(MarkingStore.SAVE_AND_NAVIGATE_EVENT);
                        }
                    }
                    else {
                        /* If we are not in the marking screen or we are switching from full response view to normal view
                         * Then no need to save the mark, we just have to navigate away from response
                         */
                        _this.isNavigationStarted = false;
                        if (_this._navigationFrom === enums.ResponseNavigation.markScheme) {
                            _this.emit(MarkingStore.SAVE_AND_NAVIGATE_INITIATED_EVENT);
                        }
                        _this.emit(MarkingStore.READY_TO_NAVIGATE, _this._navigationFrom);
                        _this._navigationFrom = undefined;
                    }
                    if (_this._navigatingTo !== enums.SaveAndNavigate.toMenu
                        && _this._navigationFrom !== enums.ResponseNavigation.markScheme) {
                        _this._isMarkingInProgress = false;
                    }
                    /* if we are going from full response view back to normal view. set the flag again
                     *  because we will be in the marking screen again
                     */
                    if (_this._navigatingTo === enums.SaveAndNavigate.toCurrentResponse) {
                        _this._isMarkingInProgress = true;
                    }
                    break;
                case actionType.MARK_UPDATED:
                    var newMarkAction = action;
                    _this._newMark = newMarkAction.currentMark;
                    /** Emitting mark updated event */
                    _this.emit(MarkingStore.MARK_UPDATED_EVENT);
                    break;
                case actionType.UPDATE_MARKING_PROGRESS:
                    var updateInitialMarkAction = action;
                    _this._initialMarkingProgress = updateInitialMarkAction.initialMarkingProgress;
                    _this._currentResponseMarkingProgress = updateInitialMarkAction.initialMarkingProgress;
                    break;
                case actionType.SAVE_MARKS_AND_ANNOTATIONS:
                    var saveAction = action;
                    var previousTriggerPoint = _this._saveMarksAndAnnotationTriggeringPoint;
                    // Save action may started earlier, keep latest trigger point for continue the user action.
                    _this.setSaveMarksAndAnnotationTriggeringPoint(saveAction.saveMarksAndAnnotationTriggeringPoint);
                    //update the existing marks and annotations is dirty field and row version by checking marks/annotations
                    //and isdirty field.
                    if (saveAction.saveMarksAndAnnotationsData !== undefined && saveAction.saveMarksAndAnnotationsData != null) {
                        //Clear worklist data if any marks saved to database (def # 66786)
                        _this.storageAdapterHelper.clearStorageArea('worklist');
                        // based on the saveReturn, update the markingOperation and version
                        _this.updateExaminerMarksAndAnnotationsData(saveAction.markGroupId, saveAction.saveMarksAndAnnotationsData);
                        /* update mark change reason update status*/
                        _this.resetMarkChangeReasonUpdateStatus(saveAction.markGroupId);
                        _this._isAllFilesViewedStatusUpdated = false;
                        /* If marks are saved */
                        _this._isMarksSavedToDb = true;
                        _this.emit(MarkingStore.SAVE_MARKS_AND_ANNOTATIONS_EVENT, saveAction.markGroupId, _this._saveMarksAndAnnotationTriggeringPoint, enums.MarksAndAnnotationsQueueOperation.Remove);
                    }
                    else {
                        var isnetworkerror = false;
                        var operation = enums.MarksAndAnnotationsQueueOperation.None;
                        switch (saveAction.dataServiceRequestErrorType) {
                            case enums.DataServiceRequestErrorType.Skipped:
                                operation = enums.MarksAndAnnotationsQueueOperation.Requeue;
                                break;
                            case enums.DataServiceRequestErrorType.NetworkError:
                                _this._saveMarksAndAnnotationPreviousTriggeringPoint = previousTriggerPoint;
                                operation = enums.MarksAndAnnotationsQueueOperation.Requeue;
                                isnetworkerror = true;
                                break;
                            case enums.DataServiceRequestErrorType.GenericError:
                                operation = enums.MarksAndAnnotationsQueueOperation.Retry;
                                break;
                            default:
                                operation = enums.MarksAndAnnotationsQueueOperation.None;
                        }
                        _this.emit(MarkingStore.SAVE_MARKS_AND_ANNOTATIONS_EVENT, saveAction.markGroupId, _this._saveMarksAndAnnotationTriggeringPoint, operation, isnetworkerror);
                    }
                    break;
                case actionType.REMOVE_ANNOTATION:
                    var removeAnnotationAction_1 = action;
                    var removingAnnotation_1;
                    _this.allAnnotationsAganistResponse(removeAnnotationAction_1.isLinkAnnotation).forEach(function (x) {
                        x.filter(function (x) {
                            if (x.clientToken === removeAnnotationAction_1.removeAnnotationList[0]) {
                                removingAnnotation_1 = x;
                            }
                        });
                    });
                    _this.removeAnnotation(removeAnnotationAction_1.removeAnnotationList, removeAnnotationAction_1.contextMenuType);
                    _this.emit(MarkingStore.REMOVE_ANNOTATION, removingAnnotation_1, removeAnnotationAction_1.isPanAvoidImageContainerRender, removeAnnotationAction_1.contextMenuType);
                    break;
                case actionType.REMOVE_ANNOTATION_MARK:
                    var removeMarksByAnnotation = action;
                    _this.emit(MarkingStore.REMOVE_MARKS_BY_ANNOTATION, removeMarksByAnnotation.removedAnnotation);
                    break;
                case actionType.ADD_ANNOTATION:
                    // oif any of the on page comment is already open close the commentbox,
                    // instead of adding new response
                    /* if (this.stampHelper.isOnpageCommentOpen()) {
                        return;
                    } */
                    var addAnnotationAction_1 = action;
                    _this.addAnnotation(addAnnotationAction_1.annotation, addAnnotationAction_1.previousMarkIndex);
                    if (!addAnnotationAction_1.avoidEventEmition) {
                        _this.emit(MarkingStore.ANNOTATION_ADDED, addAnnotationAction_1.annotation.stamp, addAnnotationAction_1.annotationAction, addAnnotationAction_1.annotationOverlayId, addAnnotationAction_1.annotation, addAnnotationAction_1.isStitched, addAnnotationAction_1.isPageLinkedByPreviousMarker);
                    }
                    if (addAnnotationAction_1.annotation.stamp === constants.LINK_ANNOTATION) {
                        _this.linkWholePageNumber = addAnnotationAction_1.annotation.pageNo;
                    }
                    break;
                case actionType.VALID_MARK:
                    var markbyannotationvalidmarkaction_1 = action;
                    _this._annotationUniqueIds.push(markbyannotationvalidmarkaction_1.annotation.uniqueId);
                    _this.emit(MarkingStore.VALID_ANNOTATION_MARK, markbyannotationvalidmarkaction_1.annotation, markbyannotationvalidmarkaction_1.annotationAction, markbyannotationvalidmarkaction_1.annotationOverlayID);
                    break;
                case actionType.ADD_MARK_BY_ANNOTATION_ACTION:
                    var addMarkByAnnotationAction_1 = action;
                    _this.emit(MarkingStore.ADD_MARK_BY_ANNOTATION, addMarkByAnnotationAction_1.annotation, addMarkByAnnotationAction_1.action, addMarkByAnnotationAction_1.annotationOverlayId);
                    break;
                case actionType.ROTATE_RESPONSE:
                    _this._isRotating = true;
                    _this.emit(MarkingStore.ZOOM_SETTINGS, action.rotationType, false);
                    break;
                case actionType.FIT_RESPONSE:
                    var fitAction = action;
                    _this.emit(MarkingStore.ZOOM_SETTINGS, fitAction.fitType, true, false, fitAction.zoomType);
                    break;
                case actionType.UPDATE_ANNOTATION:
                    var _updateAnnotationAction = action;
                    var draggedAnnotationClientToken = _updateAnnotationAction.draggedAnnotationClientToken;
                    _this.updateAnnotation(_updateAnnotationAction.leftEdge, _updateAnnotationAction.topEdge, _updateAnnotationAction.imageClusterId, _updateAnnotationAction.outputPageNo, _updateAnnotationAction.pageNo, _updateAnnotationAction.draggedAnnotationClientToken, _updateAnnotationAction.width, _updateAnnotationAction.height, _updateAnnotationAction.comment);
                    _this.updatedStampId = _updateAnnotationAction.stampId;
                    if (!_updateAnnotationAction.avoidEventEmition) {
                        _this.emit(MarkingStore.ANNOTATION_UPDATED, draggedAnnotationClientToken, _updateAnnotationAction.isPositionUpdated, _updateAnnotationAction.isDrawEndOfStampFromStampPanel, _updateAnnotationAction.stampId);
                    }
                    break;
                case actionType.TRIGGER_SAVING_MARKS_AND_ANNOTATIONS:
                    // Setting the trigger point
                    var saveMarksAndAnnotationTriggeringPoint = action.
                        saveMarksAndAnnotationTriggeringPoint;
                    _this.setSaveMarksAndAnnotationTriggeringPoint(saveMarksAndAnnotationTriggeringPoint);
                    _this.emit(MarkingStore.TRIGGER_SAVING_MARKS_AND_ANNOTATIONS_EVENT, _this._saveMarksAndAnnotationTriggeringPoint);
                    break;
                case actionType.RESET_MARKS_AND_ANNOTATION:
                    _this.resetMarksAndAnnotation(action.resetMarks, action.resetAnnotation, action.previousMark);
                    break;
                case actionType.WORKLIST_MARKING_MODE_CHANGE:
                    if (action.success) {
                        _this._currentResponseMode = action.getResponseMode;
                    }
                    /* when there is a worklist call happens, reset save mark flag */
                    _this._isMarksSavedToDb = false;
                    break;
                case actionType.SET_NON_RECOVERABLE_ERROR:
                    _this.setAsNonRecoverableItem(action.markGroupId);
                    _this.emit(MarkingStore.SET_NON_RECOVERABLE_ERROR_EVENT, action.markGroupId);
                    break;
                case actionType.NAVIGATE_AFTER_MARKING:
                    _this._isEdited = false;
                    _this._navigationFrom = action.navigateFrom;
                    if (action.navigateTo) {
                        _this._navigatingTo = action.navigateTo;
                        // set the value as true for handling yes click of return to worklist poup.
                        _this.isNavigationStarted = true;
                    }
                    /* if a navigation is started away from the response, emit ready to navigate event after the mark save */
                    if (_this.isNavigationStarted) {
                        _this.isNavigationStarted = false;
                        if (_this._navigationFrom === enums.ResponseNavigation.markScheme) {
                            _this.emit(MarkingStore.SAVE_AND_NAVIGATE_INITIATED_EVENT, false);
                        }
                        _this.emit(MarkingStore.READY_TO_NAVIGATE, _this._navigationFrom);
                        _this._navigationFrom = undefined;
                    }
                    else {
                        _this.emit(MarkingStore.MARK_SCHEME_NAVIGATION);
                    }
                    break;
                case actionType.MARK_EDITED:
                    var markEditedAction_1 = action;
                    _this._isEdited = markEditedAction_1.isEdited;
                    break;
                case actionType.CLEAR_MARKS_AND_ANNOTATIONS:
                    _this._examinerMarksAgainstResponse[action.markGroupId] = null;
                    break;
                case actionType.UPDATE_ANNOTATION_COLOR:
                    var _updateAnnotationColorAction = action;
                    _this.updateAnnotationColor(_updateAnnotationColorAction.currentAnnotation);
                    _this.emit(MarkingStore.UPDATE_ANNOTATION_COLOR);
                    break;
                case actionType.SET_MARK_ENTRY_SELECTED:
                    var setMarkEntrySelected_1 = action;
                    _this.emit(MarkingStore.SET_MARK_ENTRY_SELECTED, setMarkEntrySelected_1.isCommentSelected);
                    break;
                case actionType.NOTIFY_MARK_CHANGE:
                    var markChangedAction = action;
                    _this._currentResponseMarkingProgress = markChangedAction.markingProgress;
                    // save the NR warnings when any marks are updated.
                    _this._warningNR = markChangedAction.warningNR;
                    // NB: This will trigger in each keystroke.
                    // This is to make the mark button sync with the mark entry
                    _this.emit(MarkingStore.NOTIFY_MARK_UPDATED);
                    break;
                case actionType.CONTEXT_MENU_ACTION:
                    var contextMenuActionResult = action;
                    _this.isContextMenuVisible = contextMenuActionResult.isVisible;
                    _this.emit(MarkingStore.CONTEXT_MENU_ACTION_TRIGGERED, contextMenuActionResult.isVisible, contextMenuActionResult.xPos, contextMenuActionResult.yPos, contextMenuActionResult.contextMenuData);
                    break;
                case actionType.SET_ANNOTATION_TOOLTIPS:
                    var toolTipSetAction = action;
                    _this._toolTipInfo = toolTipSetAction.toolTipInfo;
                    break;
                case actionType.ANNOTATION_DRAW:
                    _this.emit(MarkingStore.ANNOTATION_DRAW, action.isAnnotationDrawStart);
                    break;
                case actionType.PANEL_WIDTH:
                    _this._resizePanelClassName = action.resizeClassName;
                    _this.emit(MarkingStore.PANEL_WIDTH, action.panelWidth, action.resizeClassName, action.panelType, action.panActionType);
                    break;
                case actionType.DEFAULT_PANEL_WIDTH:
                    _this._defaultMarkSchemePanelWidthInPixel = action.defaultPanelWidth;
                    _this._previousMarkListWidthInPixel = action.previousMarkListWidth;
                    break;
                case actionType.DEFAULT_PANEL_WIDTH_AFTER_COLUMN_UPDATION:
                    _this._newDefaultMarkSchemePanelWidthInPixel = action.defaultPanelWidthAfterColumnUpdate;
                    _this._isPreviousMarkListColumnVisible = action.previousMarkListColumnVisible;
                    _this.emit(MarkingStore.UPDATE_PANEL_WIDTH, _this._newDefaultMarkSchemePanelWidthInPixel);
                    break;
                case actionType.MINIMUM_PANEL_WIDTH:
                    _this._minimumPanelWidthInPixel = action.minimumPanelWidth;
                    break;
                case actionType.PANEL_RESIZE_CLASSNAME:
                    _this._resizePanelClassName = action.resizeClassName;
                    _this._resizePanelClassName = _this._resizePanelClassName ? _this._resizePanelClassName : '';
                    _this.emit(MarkingStore.MARKSCHEME_PANEL_RESIZE_CLASSNAME, _this._resizePanelClassName);
                    break;
                case actionType.SHOW_GRACE_PERIOD_NOT_FULLY_MARKED_MESSAGE:
                    // emit an event to show grace period message box here.
                    var failureReason = action.failureReason;
                    _this.emit(MarkingStore.SHOW_GRACE_PERIOD_NOT_FULLY_MARKED_MESSAGE, failureReason);
                    break;
                case actionType.SHOW_ALL_PAGE_NOT_ANNOTATED_MESSAGE:
                    var navigatingTo = action.navigatingTo;
                    _this.emit(MarkingStore.SHOW_ALL_PAGE_NOT_ANNOTATED_MESSAGE, navigatingTo);
                    break;
                case actionType.UPDATE_MARK_AS_NR_FOR_UNMARKED_ITEMS:
                    _this.emit(MarkingStore.UPDATE_MARK_AS_NR_FOR_UNMARKED_ITEMS);
                    break;
                case actionType.DELETE_COMMENT_POPUP:
                    _this.emit(MarkingStore.DELETE_COMMENT_POPUP);
                    break;
                case actionType.RESPONSE_VIEW_MODE_CHANGED:
                    if (action.responseViewMode === enums.ResponseViewMode.fullResponseView
                        || _this._currentResponseMode === enums.ResponseMode.closed
                        || _this.currentOperationMode === enums.MarkerOperationMode.TeamManagement ||
                        (_this.currentOperationMode === enums.MarkerOperationMode.StandardisationSetup &&
                            standardisationsetupstore.instance.selectedStandardisationSetupWorkList
                                === enums.StandardisationSetup.UnClassifiedResponse &&
                            standardisationsetupstore.instance.fetchStandardisationResponseData(_this.selectedDisplayId).hasDefinitiveMark === false)) {
                        _this._isMarkingInProgress = false;
                    }
                    else {
                        if (_this._isWholeResponse === true && _this.getRelatedWholeResponseQIGIds().length > 1) {
                            _this.emit(MarkingStore.QIG_CHANGED_IN_WHOLE_RESPONSE_EVENT, _this._selectedQIGMarkSchemeGroupId, undefined, true);
                        }
                        _this._isMarkingInProgress = true;
                    }
                    _this.emit(MarkingStore.RESPONSE_VIEW_MODE_CHANGED);
                    break;
                case actionType.UPDATE_MARKS_AND_ANNOTATIONS_VISIBILITY_ACTION:
                    var isMarksColumnVisibilitySwitched = false;
                    var _updateMarksAndAnnotationVisibilityAction = action;
                    if (!_this.marksAndAnnotationVisibilityDetails) {
                        _this.marksAndAnnotationVisibilityDetails =
                            Immutable.Map();
                    }
                    if (_updateMarksAndAnnotationVisibilityAction.getMarksAndAnnotationVisibilityDetails) {
                        var selectedMarkingIndex = _updateMarksAndAnnotationVisibilityAction.getIndex;
                        var selectedCommentindex = _updateMarksAndAnnotationVisibilityAction.getCurrentCommentIndex;
                        // Setting whether the marks column visibility has been switched
                        isMarksColumnVisibilitySwitched =
                            marksAndAnnotationsVisibilityHelper.isMarksColumnVisibilitySwitched(selectedMarkingIndex, _updateMarksAndAnnotationVisibilityAction.getMarksAndAnnotationVisibilityDetails, _this.getMarksAndAnnotationVisibilityDetails, _this.currentMarkGroupId);
                        // update marks and annotation and enhancedoffpagecomments visiblity status.
                        _this.marksAndAnnotationVisibilityDetails = marksAndAnnotationsVisibilityHelper.
                            updateMarksAndAnnotationVisibilityStatus(selectedMarkingIndex, _updateMarksAndAnnotationVisibilityAction.getMarksAndAnnotationVisibilityDetails, _this.getMarksAndAnnotationVisibilityDetails, _this.currentMarkGroupId);
                        if (_updateMarksAndAnnotationVisibilityAction.isEnchancedOffpageCommentVisible) {
                            var visiblityDetails = _this.marksAndAnnotationVisibilityDetails.get(_this.currentMarkGroupId);
                            _this.marksAndAnnotationVisibilityDetails = marksAndAnnotationsVisibilityHelper.
                                updateEnhancedOffpageComemntRadioButtonStatus(visiblityDetails, _this.marksAndAnnotationVisibilityDetails, _this.getMarksAndAnnotationVisibilityDetails, _this.currentMarkGroupId, selectedMarkingIndex, selectedCommentindex, isMarksColumnVisibilitySwitched);
                        }
                    }
                    _this.emit(MarkingStore.MARKS_AND_ANNOTATION_VISIBILITY_CHANGED, isMarksColumnVisibilitySwitched);
                    break;
                case actionType.STAMP_SELECTED:
                    marksAndAnnotationsVisibilityHelper.
                        setMarksAndAnnotationVisibilityOnStampSelectionOrDrag(_this.getMarksAndAnnotationVisibilityDetails, _this.currentMarkGroupId);
                    _this.emit(MarkingStore.MARKS_AND_ANNOTATION_VISIBILITY_CHANGED, false);
                    break;
                case actionType.STAMP_PAN:
                    var stampPanAction_1 = action;
                    if (stampPanAction_1.draggedAnnotationClientToken === undefined
                        || stampPanAction_1.draggedAnnotationClientToken == null) {
                        marksAndAnnotationsVisibilityHelper.
                            setMarksAndAnnotationVisibilityOnStampSelectionOrDrag(_this.getMarksAndAnnotationVisibilityDetails, _this.currentMarkGroupId);
                        _this.emit(MarkingStore.MARKS_AND_ANNOTATION_VISIBILITY_CHANGED, false);
                    }
                    break;
                case actionType.ACCEPT_QUALITY_ACTION:
                    _this._navigatingTo = enums.SaveAndNavigate.toWorklist;
                    _this.emit(MarkingStore.ACCEPT_QUALITY_ACTION_COMPLETED);
                    break;
                case actionType.UPDATE_SEEN_ANNOTATION:
                    var seenAnnotationAction = action;
                    _this.isAllPagesAnnotated = seenAnnotationAction.isAllPagesAnnotated;
                    var treeViewItem = seenAnnotationAction.getTreeViewItem;
                    _this.updateAllPagesAnnotatedIndicator(treeViewItem);
                    break;
                case actionType.MARK_CHANGE_REASON_UPDATE_ACTION:
                    var _markChangeReasonUpdateAction = action;
                    _this.updateMarkChangeReasons(_markChangeReasonUpdateAction.markChangeReason);
                    _this.updateMarksAndAnnotationsSaveQueueingStatus(_this.currentMarkGroupId, true);
                    _this.emit(MarkingStore.MARK_CHANGE_REASON_UPDATED);
                    break;
                case actionType.SUPERVISOR_REMARK_DECISION_CHANGE:
                    var _supervisorRemarkDecisionChangeAction = action;
                    _this.updateSupervisorRemarkDecision(_this.getSupervisorRemarkDecisionType(_supervisorRemarkDecisionChangeAction.remarkDecision));
                    _this.updateMarksAndAnnotationsSaveQueueingStatus(_this.currentMarkGroupId, true);
                    _this.emit(MarkingStore.SUPERVISOR_REMARK_DECISION_UPDATED);
                    break;
                case actionType.SHOW_MARK_CHANGE_REASON_NEEDED_MESSAGE_ACTION:
                    var _markChangeReasonNeededMessageAction = action;
                    _this.emit(MarkingStore.SHOW_MARK_CHANGE_REASON_NEEDED_MESSAGE, _markChangeReasonNeededMessageAction.failureReason, _markChangeReasonNeededMessageAction.navigateTo);
                    break;
                case actionType.SET_MARK_CHANGE_REASON_VISIBILITY_ACTION:
                    var _setMarkChangeReasonVisibilityAction = action;
                    _this.updateMarkChangeReasonVisibility(_setMarkChangeReasonVisibilityAction.isMarkChangeReasonVisible);
                    _this.emit(MarkingStore.MARK_CHANGE_REASON_VISIBILITY_UPDATED);
                    break;
                case actionType.OPEN_MARK_CHANGE_REASON_ACTION:
                    _this.emit(MarkingStore.OPEN_MARK_CHANGE_REASON);
                    break;
                case actionType.DYNAMIC_ANNOTATION_MOVE:
                    var _dynamicAnnotationMoveAction = action;
                    _this.emit(MarkingStore.DYNAMIC_ANNOTATION_MOVE, _dynamicAnnotationMoveAction.movingElementProperties);
                    break;
                case actionType.PROCESS_SAVE_AND_NAVIGATION_ACTION:
                    /* set to emit ready to navigate event aftyer the mark save */
                    _this.isNavigationStarted = true;
                    _this.emit(MarkingStore.SAVE_AND_NAVIGATE_EVENT);
                    break;
                case actionType.UPDATE_WAVY_ANNOTATION_ACTION:
                    _this.emit(MarkingStore.UPDATE_WAVY_ANNOTATION_EVENT);
                    break;
                case actionType.RESPONSEPINCHZOOMACTION:
                    _this._zoomToWidth = action.markSheetHolderWidth;
                    _this.emit(MarkingStore.RESPONSE_PINCH_ZOOM_TRIGGERED);
                    break;
                case actionType.RESPONSEPINCHZOOMCOMPLETED:
                    _this._zoomToWidth = 0;
                    var zoomedValue = action.zoomedWidth;
                    _this.emit(MarkingStore.RESPONSE_PINCH_ZOOM_COMPLETED, zoomedValue);
                    break;
                case actionType.MARK_SCHEME_HEADER_DROP_DOWN_ACTION:
                    _this.markSchemeHeaderDropDownOpen = action.isheaderDropDownOpen;
                    break;
                case actionType.MARK_SCHEME_SCROLL_ACTION:
                    _this.emit(MarkingStore.MARK_SCHEME_SCROLL_ACTION);
                    break;
                case actionType.NON_NUMERIC_INFO_ACTION:
                    _this._isNonNumeric = true;
                    break;
                case actionType.NAVIGATION_UPDATE_ACTION:
                    _this._navigatingTo = action.navigateTo;
                    if (action.doEmit) {
                        _this.emit(MarkingStore.NAVIGATION_UPDATED_EVENT, _this._navigatingTo);
                    }
                    break;
                case actionType.SET_CURRENT_NAVIGATION_ACTION:
                    _this._isNavigationThroughMarkScheme = action.isNavigationThroughMarkScheme;
                    break;
                case actionType.SET_MARKING_IN_PROGRESS_ACTION:
                    _this._isMarkingInProgress = action.isMarkingInProgress;
                    break;
                case actionType.MARKER_OPERATION_MODE_CHANGED_ACTION:
                    var markerOperationMode = action;
                    _this._operationMode = markerOperationMode.operationMode;
                    break;
                case actionType.RESPONSE_DATA_GET_SEARCH:
                    var responseDataGetAction_1 = action;
                    // While opening a response from message, MARKER_OPERATION_MODE_CHANGED_ACTION is not fired,
                    // So set the operation mode . Set marking in case of Supervisor Remark navigation
                    if (responseDataGetAction_1.searchedResponseData.triggerPoint === enums.TriggerPoint.SupervisorRemark) {
                        _this._operationMode = enums.MarkerOperationMode.Marking;
                    }
                    else if (responseDataGetAction_1.searchedResponseData.isTeamManagement) {
                        _this._operationMode = enums.MarkerOperationMode.TeamManagement;
                    }
                    break;
                case actionType.SHOW_RESPONSE_NAVIGATION_FAILURE_REASON_ACTION:
                    _this._combinedWarningMessage = action.combinedWarningMessage;
                    _this.emit(MarkingStore.SHOW_RESPONSE_NAVIGATION_FAILURE_REASONS_POPUP_EVENT, action.navigatingTo);
                    break;
                case actionType.REJECT_RIG_CONFIRMATION_ACTION:
                    _this._isMarkingInProgress = false;
                    break;
                case actionType.OPEN_SUPERVISOR_REMARK_DECISION:
                    _this.emit(MarkingStore.OPEN_SUPERVISOR_REMARK_DECISION);
                    break;
                case actionType.COPIED_PREVIOUS_MARKS_AND_ANNOTATIONS:
                    _this.emit(MarkingStore.PREVIOUS_MARKS_AND_ANNOTATIONS_COPIED);
                    break;
                case actionType.ZOOM_ANIMATION_END:
                    var animationEndAction = action;
                    _this.emit(MarkingStore.RESPONSE_IMAGE_ANIMATION_COMPLETED_EVENT, animationEndAction.doReRender);
                    break;
                case actionType.SAVE_ENHANCED_OFFPAGE_COMMENTS_ACTION:
                    var saveEnhancedOffPageComment = action;
                    switch (saveEnhancedOffPageComment.markingOperation) {
                        case enums.MarkingOperation.deleted:
                            _this.removeEnhancedOffPageComment(saveEnhancedOffPageComment.enhancedOffPageClientTokensToBeDeleted);
                            break;
                        case enums.MarkingOperation.updated:
                            _this.updateEnhancedOffPageComment(saveEnhancedOffPageComment.enhancedOffPageClientTokensToBeDeleted[0], saveEnhancedOffPageComment.commentText, saveEnhancedOffPageComment.selectedMarkSchemeId, saveEnhancedOffPageComment.selectedFileId);
                            break;
                        case enums.MarkingOperation.added:
                            _this.addEnhancedOffPageComment(saveEnhancedOffPageComment.commentText, saveEnhancedOffPageComment.selectedMarkSchemeId, saveEnhancedOffPageComment.selectedFileId);
                            break;
                    }
                    _this.emit(MarkingStore.ENHANCED_OFF_PAGE_COMMENT_UPDATE_COMPLETED_EVENT);
                    break;
                case actionType.REMOVE_MARK_ENTRY_SELECTION:
                    _this.emit(MarkingStore.REMOVE_MARK_ENTRY_SELECTION);
                    break;
                case actionType.SIMULATION_TARGET_COMPLETED:
                    if (_this._isMarkingInProgress) {
                        _this._isMarkingInProgress = false;
                    }
                    break;
                case actionType.UPDATE_ALL_FILES_VIEWED_STATUS:
                    _this._isAllFilesViewedStatusUpdated = true;
                    _this.updateMarksAndAnnotationsSaveQueueingStatus(_this.currentMarkGroupId, true);
                    _this.emit(MarkingStore.ALL_FILES_VIEWED_CHECK);
                    break;
                case actionType.BOOKMARK_ADDED_ACTION:
                    var bookmarkAddedAction_1 = action;
                    var bookmark = bookmarkAddedAction_1.bookmarkToAdd;
                    _this._selectedBookmarkClientToken = bookmarkAddedAction_1.bookmarkToAdd ?
                        bookmarkAddedAction_1.bookmarkToAdd.clientToken : undefined;
                    _this.addBookmark(bookmark);
                    _this.emit(MarkingStore.BOOKMARK_ADDED_EVENT);
                    break;
                case actionType.BOOKMARK_SELECTED_ACTION:
                    var bookmarkSelectedAction_1 = action;
                    var clientToken = bookmarkSelectedAction_1.clientToken;
                    _this.emit(MarkingStore.BOOKMARK_SELECTED_EVENT, clientToken);
                    break;
                case actionType.BOOKMARK_GO_BACK_BUTTON_CLICK_ACTION:
                    _this.emit(MarkingStore.GO_BACK_BUTTON_CLICK_EVENT);
                    break;
                case actionType.UPDATE_ANNOTATION_SELECTION:
                    _this.emit(MarkingStore.ANNOTATION_SELECTION_UPDATED_EVENT, action.isSelected);
                    break;
                case actionType.UPDATE_BOOKMARK_NAME_ACTION:
                    var updateBookmarkNameAction_1 = action;
                    var bookmarkNameToSave = updateBookmarkNameAction_1.bookmarkNameToSave;
                    var bookmarkClientTokenToSave = updateBookmarkNameAction_1.bookmarkClientToken;
                    _this.updateBookmarkName(bookmarkNameToSave, bookmarkClientTokenToSave);
                    break;
                case actionType.SHOW_OR_HIDE_BOOKMARK_NAME_BOX:
                    var showOrHideBookmarkNameBoxAction_1 = action;
                    var bookmarkText = showOrHideBookmarkNameBoxAction_1.bookmarkText;
                    var clientTokenBookmark = showOrHideBookmarkNameBoxAction_1.clientToken;
                    var bookmarkIsVisible = showOrHideBookmarkNameBoxAction_1.isVisible;
                    var rotatedAngle = showOrHideBookmarkNameBoxAction_1.rotatedAngle;
                    if (!bookmarkIsVisible) {
                        // if the bookmark box is closed along with this action, reset token
                        _this._selectedBookmarkClientToken = undefined;
                    }
                    _this.emit(MarkingStore.SHOW_OR_HIDE_BOOKMARK_NAME_BOX_EVENT, bookmarkText, clientTokenBookmark, bookmarkIsVisible, rotatedAngle);
                    break;
                case actionType.ACETATE_POSITION_UPDATE_ACTION:
                    var acetatePositionUpdateAction_1 = action;
                    var acetate = acetatePositionUpdateAction_1.acetate;
                    var acetateAction = acetatePositionUpdateAction_1.acetateAction;
                    _this.emit(MarkingStore.ACETATE_POSITION_UPDATED, acetate, acetateAction);
                    break;
                case actionType.VALIDATE_RESPONSE:
                    var validateResponseAction_1 = action;
                    if (validateResponseAction_1.validateResponseReturnData.success &&
                        validateResponseAction_1.validateResponseReturnData.responseReturnErrorCode ===
                            enums.ReturnErrorCode.QigSessionClosed) {
                        _this.emit(MarkingStore.SESSION_CLOSED_FOR_EXAMINER_EVENT);
                    }
                    else if (validateResponseAction_1.validateResponseReturnData.success &&
                        validateResponseAction_1.validateResponseReturnData.responseReturnErrorCode ===
                            enums.ReturnErrorCode.WithdrawnResponse &&
                        validateResponseAction_1.validateResponseReturnData.markGroupId === _this._currentMarkGroupId) {
                        _this.emit(MarkingStore.WITHDRAWN_RESPONSE_EVENT, validateResponseAction_1.isStandardisationSetupValidation);
                    }
                    break;
                case actionType.UPDATE_MARKING_DETAILS:
                    var updateMarkingDetailsAction_1 = action;
                    _this.updateMarkingProgress(updateMarkingDetailsAction_1.markDetails, updateMarkingDetailsAction_1.isAllPagesAnnotated, updateMarkingDetailsAction_1.markGroupId);
                    break;
                case actionType.ROTATION_COMPLETED_ACTION:
                    _this._isRotating = false;
                    _this.emit(MarkingStore.ROTATION_COMPLETED_EVENT);
                    break;
                case actionType.STAY_IN_RESPONSE_ACTION:
                    _this._showNavigationOnMbqPopup = false;
                    _this.isNavigationStarted = false;
                    break;
                case actionType.COPY_MARKS_AND_ANNOTATION_AS_DEFINITIVE:
                    var copymarksandannotationasdefinitive = action.isCopyMarkAsDefinitive;
                    _this._isMarkingInProgress = true;
                    if (!copymarksandannotationasdefinitive) {
                        // updating the progress to 0%, on clearMarksAndAnnotation option on Mark as Definitive popup.
                        _this._currentResponseMarkingProgress = 0;
                    }
                    break;
                case actionType.DISCARD_STANDARDISATION_RESPONSE:
                    _this._isMarkingInProgress = false;
                    break;
            }
        });
        // this.stampHelper = new stampStoreHelper();
    }
    /**
     * Save Action Triggers from several area like, worklist, home, inbox, menu and BackgroundWorker
     * If It happens from Back ground, User may have already triggered other actions and this needs to be captured for navigation
     * @param saveMarksAndAnnotationTriggeringPoint
     */
    MarkingStore.prototype.setSaveMarksAndAnnotationTriggeringPoint = function (saveMarksAndAnnotationTriggeringPoint) {
        if (this._saveMarksAndAnnotationTriggeringPoint === enums.SaveMarksAndAnnotationsProcessingTriggerPoint.None
            || saveMarksAndAnnotationTriggeringPoint !== enums.SaveMarksAndAnnotationsProcessingTriggerPoint.BackgroundWorker) {
            this._saveMarksAndAnnotationTriggeringPoint = saveMarksAndAnnotationTriggeringPoint;
        }
    };
    Object.defineProperty(MarkingStore.prototype, "showNavigationOnMbqPopup", {
        /**
         * get the navigation mbq poup.
         */
        get: function () {
            return this._showNavigationOnMbqPopup;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MarkingStore.prototype, "combinedWarningMessage", {
        /**
         * get the combinedWarningMessage
         */
        get: function () {
            return this._combinedWarningMessage;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MarkingStore.prototype, "getUpdatedStampId", {
        get: function () {
            return this.updatedStampId;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MarkingStore.prototype, "selectedBookmarkClientToken", {
        /**
         * get the client token of the selected bookmark.
         */
        get: function () {
            return this._selectedBookmarkClientToken;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * return the default mark scheme panel width
     */
    MarkingStore.prototype.getDefaultPanelWidth = function () {
        return this._defaultMarkSchemePanelWidthInPixel;
    };
    Object.defineProperty(MarkingStore.prototype, "isMarkSchemeHeaderDropDownOpen", {
        /**
         * set in mark scheme header dropdown open and close.
         */
        get: function () {
            return this.markSchemeHeaderDropDownOpen;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * return the new default mark scheme panel width after column updated
     */
    MarkingStore.prototype.getDefaultPanelWidthAfterColumnIsUpdated = function () {
        return this._newDefaultMarkSchemePanelWidthInPixel;
    };
    /**
     * return minimum width of mark scheme panel
     */
    MarkingStore.prototype.getMinimumPanelWidth = function () {
        return this._minimumPanelWidthInPixel;
    };
    /**
     * return the previous mark list column width
     */
    MarkingStore.prototype.getPreviousMarkListWidth = function () {
        return this._previousMarkListWidthInPixel;
    };
    /**
     * return panel resizing classname
     */
    MarkingStore.prototype.getResizedPanelClassName = function () {
        return this._resizePanelClassName;
    };
    /**
     * Emit event to reset mark and annotation
     * @param {boolean} resetMark
     * @param {boolean} resetAnnotation
     * @param {string} previousMark
     */
    MarkingStore.prototype.resetMarksAndAnnotation = function (resetMark, resetAnnotation, previousMark) {
        this.emit(MarkingStore.RESET_MARK_AND_ANNOTATION, resetMark, resetAnnotation, previousMark);
    };
    /**
     * Save mark to the marks collection
     * @param markDetails
     * @param isUpdateUsedInTotalOnly - whether to update only the used in total field.
     * @param isUpdateMarkingProgress - whether to update the current marking progress or not.
     * @param markGroupId - markGroupId for the rig in a Whole response/ current markGroupId for single QIG
     */
    MarkingStore.prototype.saveMark = function (markDetails, isUpdateUsedInTotalOnly, isUpdateMarkingProgress) {
        var markGroupId = markDetails.markGroupId;
        this.setCurrentMarkDetails(markDetails.markSchemeId, markGroupId);
        /**
         * TODO : Refactor this with three seperate events/action for below three cases.
         * There are thre ways to trigger this save mark
         * 1. On entering mark which requires both emiting event and update mark progress
         *       - (isUpdateUsedInTotalOnly - FALSE, isUpdateMarkingProgress - TRUE)
         * 2. While calculating used in total which does not requires emiting event and update mark progress
         *       - (isUpdateUsedInTotalOnly - TRUE, isUpdateMarkingProgress - FALSE)
         * 3. Entering NR on complete button which does not requires emiting event but need update mark progress
         *       - (isUpdateUsedInTotalOnly - TRUE, isUpdateMarkingProgress - TRUE)
         */
        if (isUpdateMarkingProgress === true) {
            this.updateCurrentQuestionItemInfo(markDetails.mark, markDetails.usedInTotal);
            this.updateMarkingDetails(markGroupId, markDetails.markingProgress, markDetails.totalMark, markDetails.totalMarkedMarkSchemes, markDetails.isAllNR, markDetails.isAllPagesAnnotated);
        }
        else {
            var currntMarkProgress = this.getMarkingProgressDetails(markGroupId);
            if (!currntMarkProgress) {
                currntMarkProgress = new markingProgressDetails();
            }
            /* update the marking progress with current details to persist the same */
            this.updateMarkingDetails(markGroupId, currntMarkProgress.markingProgress, currntMarkProgress.totalMarks, currntMarkProgress.markCount, currntMarkProgress.isAllNR, currntMarkProgress.isAllPagesAnnotated);
        }
        /* For updating usedintotal based dirty flag no need to set the progress details and emit event*/
        if (isUpdateUsedInTotalOnly === false) {
            switch (markDetails.markingOperation) {
                case enums.MarkingOperation.added:
                    this.addOrUpdateMark(markDetails.mark, markDetails.markSchemeId, markGroupId, markDetails.usedInTotal);
                    break;
                case enums.MarkingOperation.updated:
                    this.updateMark(markDetails.mark, markDetails.isDirty, markDetails.usedInTotal, false, markDetails.markSchemeId, markGroupId);
                    break;
                case enums.MarkingOperation.deleted:
                    this.deleteMark(markDetails.markSchemeId, markGroupId);
                    break;
            }
            this.emit(MarkingStore.MARK_SAVED);
        }
        else {
            /*used in total change would be always update, add will cover as part of mark entry itself*/
            /* If the mark is a new entry and not yet saved in db and updating as part of isUpdateUsedInTotalOnly
               then set the marking operation as added */
            if (this._currentExaminerMark) {
                this._currentExaminerMark.markingOperation = this._currentExaminerMark.markId === 0 ?
                    enums.MarkingOperation.added : enums.MarkingOperation.updated;
            }
            this.addOrUpdateMark(markDetails.mark, markDetails.markSchemeId, markGroupId, markDetails.usedInTotal);
        }
        // In the case of MarkByAnnotation, the isDirty flag for the associated annotation is set to TRUE only when the mark object's
        // dirty flag is set to TRUE. Otherwise there's chance that the annotation alone can get saved during a background save call.
        if (this._annotationUniqueIds != null && this._annotationUniqueIds.length > 0) {
            this.updateDirtyFlagForAssociatedAnnotations();
            this._annotationUniqueIds = new Array();
        }
    };
    /**
     * Method updates the dirty flag for the associated annotation
     */
    MarkingStore.prototype.updateDirtyFlagForAssociatedAnnotations = function () {
        var _this = this;
        var _loop_1 = function(index) {
            var annotation = this_1.examinerMarksAgainstCurrentResponse.
                examinerMarkGroupDetails[this_1.selectedQIGMarkGroupId].
                allMarksAndAnnotations[0].annotations.filter(function (x) { return x.uniqueId === _this._annotationUniqueIds[index]; });
            if (annotation && annotation.length > 0) {
                annotation[0].isDirty = true;
            }
        };
        var this_1 = this;
        for (var index = 0; index < this._annotationUniqueIds.length; index++) {
            _loop_1(index);
        }
    };
    /**
     * Updating the marking details which will be used for saving
     * @param markGroupId
     * @param markingProgress
     * @param totalMark
     * @param totalMarkedMarkSchemes
     * @param isAllNR
     */
    MarkingStore.prototype.updateMarkingDetails = function (markGroupId, markingProgress, totalMark, totalMarkedMarkSchemes, isAllNR, isAllPagesAnnotated) {
        var progressDetails;
        if (!this._markingProgressDetails) {
            this._markingProgressDetails = Immutable.Map();
        }
        progressDetails = new markingProgressDetails();
        progressDetails.isAllNR = isAllNR;
        progressDetails.markCount = totalMarkedMarkSchemes;
        progressDetails.totalMarks = totalMark;
        progressDetails.markingProgress = markingProgress;
        progressDetails.isAllPagesAnnotated = isAllPagesAnnotated;
        this._markingProgressDetails = this._markingProgressDetails.set(markGroupId, progressDetails);
    };
    /**
     * Update all page annotation indicator
     */
    MarkingStore.prototype.updateAllPagesAnnotatedIndicator = function (treeViewItem) {
        var _this = this;
        var currntMarkProgress = this.getMarkingProgressDetails(this.currentMarkGroupId);
        if (!currntMarkProgress) {
            this.updateMarkingDetails(this.currentMarkGroupId, treeViewItem.markingProgress, parseFloat(treeViewItem.totalMarks), treeViewItem.markCount, treeViewItem.isAllNR, true);
        }
        else {
            /* update the marking progress with current details to persist the same */
            this.updateMarkingDetails(this.currentMarkGroupId, currntMarkProgress.markingProgress, currntMarkProgress.totalMarks, currntMarkProgress.markCount, currntMarkProgress.isAllNR, true);
        }
        if (this._isWholeResponse && this.getRelatedWholeResponseQIGIds().length > 1) {
            var markDetails_1;
            //this.treeViewHelper = new treeviewDataHelper();
            var relatedQIGMarkSchemeGroupIds = this.getRelatedWholeResponseQIGIds();
            relatedQIGMarkSchemeGroupIds.forEach(function (markSchemeGroupdId) {
                markDetails_1 = _this.getSelectedQigMarkingProgressDetails(treeViewItem, markSchemeGroupdId);
                _this.updateMarkingProgress(markDetails_1, true, _this.getMarkGroupIdQIGtoRIGMap(markSchemeGroupdId));
            });
        }
    };
    /**
     * Update the currentquestioniteminfo when navigating to full response view
     * @param mark The mark
     * @param usedIntotal whether used for total or not
     */
    MarkingStore.prototype.updateCurrentQuestionItemInfo = function (allocatedMark, usedIntotal) {
        if (this.currentQuestionItemInfo) {
            this.currentQuestionItemInfo.allocatedMarks = allocatedMark;
            this.currentQuestionItemInfo.usedInTotal = usedIntotal;
        }
    };
    /**
     * Set the current mark details
     * @param markSchemeId
     */
    MarkingStore.prototype.setCurrentMarkDetails = function (markSchemeId, markGroupId) {
        this._currentExaminerMarks = undefined;
        this._currentExaminerMark = undefined;
        this._currentExaminerMarks = this._examinerMarksAgainstResponse[this.currentMarkGroupId].
            examinerMarkGroupDetails[markGroupId].
            allMarksAndAnnotations[0].examinerMarksCollection;
        if (this.isDefinitiveMarking) {
            this._currentExaminerMarks = this._currentExaminerMarks.filter(function (x) { return x.definitiveMark === true; });
        }
        var _examinerMarks = this._currentExaminerMarks.
            filter(function (x) { return x.markSchemeId === markSchemeId; });
        this._currentExaminerMark = _examinerMarks && _examinerMarks.length > 0 ?
            _examinerMarks[0] : undefined;
    };
    /**
     * Add mark or update the already added mark
     * @param mark
     * @param markSchemeId
     * @param markGroupId
     * @param usedInTotal
     */
    MarkingStore.prototype.addOrUpdateMark = function (mark, markSchemeId, markGroupId, usedInTotal) {
        if (this._currentExaminerMark) {
            this.updateMark(mark, true, usedInTotal, true, markSchemeId, markGroupId);
        }
        else {
            this.addMark(mark, markSchemeId, markGroupId, usedInTotal);
        }
    };
    /**
     * Add a mark to the collection
     * @param mark
     * @param markSchemeId
     * @param markGroupId
     * @param usedInTotal
     */
    MarkingStore.prototype.addMark = function (mark, markSchemeId, markGroupId, usedInTotal) {
        var _markValue = (mark.valueMark) ? mark.valueMark : mark.displayMark;
        var _mark = {
            numericMark: ((mark.displayMark.toUpperCase() === NOT_ATTEMPTED) ? 0 : parseFloat(_markValue)),
            nonnumericMark: ((mark.valueMark) ? ((mark.displayMark === NOT_ATTEMPTED) ? null : mark.displayMark) : null),
            markStatus: (mark.displayMark.toUpperCase() === NOT_ATTEMPTED) ? NR_MARK_STATUS : null,
            markId: 0,
            markSchemeId: markSchemeId,
            candidateScriptId: this.candidateScriptId,
            examinerRoleId: this.getExaminerRoleQIGtoRIGMap(this.currentMarkGroupId, markGroupId),
            markGroupId: markGroupId,
            rowVersion: '',
            usedInTotal: usedInTotal,
            notAttempted: (mark.displayMark.toUpperCase() === NOT_ATTEMPTED) ? true : false,
            version: 0,
            isDirty: true,
            uniqueId: htmlUtilities.guid,
            markingOperation: enums.MarkingOperation.added,
            definitiveMark: this.isDefinitiveMarking
        };
        this._currentExaminerMarks.push(_mark);
        // Update the marks and annotations save queue status to Await Queueing
        this.updateMarksAndAnnotationsSaveQueueingStatus(this._currentMarkGroupId, true);
    };
    /**
     * Update the mark in the mark collection
     * @param mark
     * @param isDirty
     * @param isAlreadyAdded
     * @param markSchemeId
     */
    MarkingStore.prototype.updateMark = function (mark, isDirty, usedInTotal, isAlreadyAdded, markSchemeId, markGroupId) {
        if (isAlreadyAdded === void 0) { isAlreadyAdded = false; }
        if (this._currentExaminerMark) {
            var _markValue = (mark.valueMark) ? mark.valueMark : mark.displayMark;
            this._currentExaminerMark.nonnumericMark = (mark.valueMark) ? ((mark.displayMark.toUpperCase() === NOT_ATTEMPTED) ? null
                : mark.displayMark) : null;
            this._currentExaminerMark.numericMark = (mark.displayMark.toUpperCase() === NOT_ATTEMPTED) ? 0 : parseFloat(_markValue);
            this._currentExaminerMark.markStatus = (mark.displayMark.toUpperCase() === NOT_ATTEMPTED) ? NR_MARK_STATUS : null;
            this._currentExaminerMark.usedInTotal = usedInTotal;
            this._currentExaminerMark.notAttempted = (mark.displayMark.toUpperCase() === NOT_ATTEMPTED);
            /* if the mark is already added then need to update the marking operation */
            if (!isAlreadyAdded) {
                // If the mark is dirty, then set the marking operation as updated
                this._currentExaminerMark.markingOperation = isDirty ? enums.MarkingOperation.updated : enums.MarkingOperation.none;
                // If the mark is a new entry, then set the marking operation as added
                this._currentExaminerMark.markingOperation = isDirty && this._currentExaminerMark.markId === 0 ?
                    enums.MarkingOperation.added : this._currentExaminerMark.markingOperation;
            }
            this._currentExaminerMark.isDirty = isDirty;
            this._currentExaminerMark.uniqueId = htmlUtilities.guid;
            // Update the marks and annotations save queue status to Await Queueing
            this.updateMarksAndAnnotationsSaveQueueingStatus(this._currentMarkGroupId, true);
        }
        else {
            this.addMark(mark, markSchemeId, markGroupId, usedInTotal);
        }
    };
    /**
     * Delete the mark from the mark collection
     * @param markSchemeId
     */
    MarkingStore.prototype.deleteMark = function (markSchemeId, markGroupId) {
        if (this._currentExaminerMark) {
            if (this._currentExaminerMark.markId > 0 || this._currentExaminerMark.isPickedForSaveOperation === true) {
                this._currentExaminerMark.markingOperation = enums.MarkingOperation.deleted;
                this._currentExaminerMark.isDirty = true;
                this._currentExaminerMark.uniqueId = htmlUtilities.guid;
                // Update the marks and annotations save queue status to Await Queueing
                this.updateMarksAndAnnotationsSaveQueueingStatus(this._currentMarkGroupId, true);
            }
            else {
                this._currentExaminerMarks.splice(this._currentExaminerMarks.indexOf(this._currentExaminerMark), 1);
            }
        }
    };
    /**
     * update the examinerMarks dirty status.
     * @param saveMarksAndAnnotationsData
     */
    MarkingStore.prototype.updateExaminerMarksAndAnnotationsData = function (parentMarkGroupId, saveMarksAndAnnotationsData) {
        // update the existing data if there is no error
        if (saveMarksAndAnnotationsData.saveMarksErrorCode === enums.SaveMarksAndAnnotationErrorCode.None) {
            // update the examiner mark data against the response.
            var examinerMarksAndAnnotations_1 = this._examinerMarksAgainstResponse[parentMarkGroupId];
            var that_1 = this;
            var marksAndAnnotations;
            var updatedMarkAnnotationDetails = saveMarksAndAnnotationsData.updatedMarkAnnotationDetails;
            if (updatedMarkAnnotationDetails) {
                updatedMarkAnnotationDetails.forEach(function (marksAndAnnotations, markSchemeGroupId) {
                    if (marksAndAnnotations) {
                        var markGroupId = marksAndAnnotations.markGroupId;
                        var allMarksAndAnnotations = examinerMarksAndAnnotations_1.examinerMarkGroupDetails[markGroupId].allMarksAndAnnotations;
                        // Updating mark group version
                        allMarksAndAnnotations[0].version = saveMarksAndAnnotationsData.updatedMarkGroupVersions.get(markSchemeGroupId);
                        marksAndAnnotations.examinerMarkToReturn.map(function (x) {
                            /**
                             * update the examiner marks if marks is edited again before the callback
                             * then we won't update the isDirty fields.
                             */
                            allMarksAndAnnotations[0].examinerMarksCollection.map(function (y, index, arr) {
                                that_1.setOrResetDirtyFlagOnTheMarkItem(x, y, arr, index);
                            });
                        });
                        /**
                         * update the annotations if annotation is edited again before the callback
                         * then we won't update the isDirty fields.
                         */
                        marksAndAnnotations.annotationToReturn.map(function (x) {
                            allMarksAndAnnotations[0].annotations.map(function (y, index, arr) {
                                that_1.setOrResetDirtyFlagOnTheAnnotationItem(x, y, arr, index);
                            });
                        });
                        /**
                         * update the annotations if examiner enhanced off page comments is edited again before the callback
                         * then we won't update the isDirty fields.
                         */
                        marksAndAnnotations.enhancedOffPageCommentToReturn.map(function (x) {
                            allMarksAndAnnotations[0].enhancedOffPageComments.map(function (y, index, arr) {
                                that_1.setOrResetDirtyFlagOnTheEnhancedOffPageCommentItem(x, y, arr, index);
                            });
                        });
                        marksAndAnnotations.bookmarksToReturn.map(function (x) {
                            allMarksAndAnnotations[0].bookmarks.map(function (y, index, arr) {
                                that_1.setOrResetDirtyFlagOnTheBookmarkItem(x, y, arr, index);
                            });
                        });
                        // resetting the IsBackGroundSave property
                        examinerMarksAndAnnotations_1.IsBackGroundSave = false;
                    }
                });
            }
        }
        else {
            // set hasNonRecoverableError and clear the existing data.
            this.setAsNonRecoverableItem(parentMarkGroupId, saveMarksAndAnnotationsData.saveMarksErrorCode);
        }
    };
    /**
     * This particular method sets or resets the dirty flag on the mark item based on the scenarios
     *
     * We are using a uniqueId property to identify a change made to the examinerMark object
     * Ideally, whenever a change is made to the examinerMark object, the uniqueId property will get a new GUID assigned.
     * This uniqueId will be send as an identifier to the gateway along with the mark objects to be saved
     * The same uniqueId will form the part of the return mark object from the gateway once the save call completes.
     * The uniqueId from the gateway and the one at the client will be compared to reset the isDirty flag and to update the related
     * properties at the client.
     *
     * @param markFromGateway
     * @param markInClient
     * @param arr
     * @param index
     */
    MarkingStore.prototype.setOrResetDirtyFlagOnTheMarkItem = function (markFromGateway, markInClient, arr, index) {
        if (markFromGateway.uniqueId === markInClient.uniqueId) {
            if (markInClient.markingOperation === enums.MarkingOperation.deleted) {
                // remove courrent mark item, if marking operation is deleted.
                arr.splice(index, 1);
            }
            else {
                markInClient.isDirty = false;
                markInClient.rowVersion = markFromGateway.rowVersion;
                markInClient.version = markFromGateway.version;
                markInClient.markId = markFromGateway.markId;
                markInClient.markingOperation = enums.MarkingOperation.none;
            }
            markInClient.isPickedForSaveOperation = false;
        }
        else if (this.isDirtyFlagMissingForTheMark(markFromGateway, markInClient)) {
            markInClient.isDirty = true;
            markInClient.isPickedForSaveOperation = false;
            this.setMarkPropertiesBasedOnThePreviousSaveReturn(markFromGateway, markInClient);
        }
    };
    /**
     * Check whether the dirty flag should be set or not
     *
     * Example scenario -   Consider a case when a mark object got changed and the 5 minutes background save picked it up
     *                      to be saved to the database. Say, the change made was then reverted before the save call's callback
     *                      reached the client. In this case, the isDirty flag at the client side will be reset to FALSE since according
     *                      to the client the change was reverted.
     *                      So, when the save call reaches back to the client side, the uniqueId in the return object and the one
     *                      in the client will be different for the mark object. Since the uniqueId is different we are sure that
     *                      there's some change made to the mark object at the client side before the save call came back. Hence we just
     *                      compare the clientTokens and if the isDirty flag is false to identify the mark object in this method and
     *                      subsequently sets the isDirty flag to TRUE.
     * @param markFromGateway
     * @param markInClient
     */
    MarkingStore.prototype.isDirtyFlagMissingForTheMark = function (markFromGateway, markInClient) {
        return markFromGateway.markSchemeId === markInClient.markSchemeId;
    };
    /**
     * This particular method sets or resets the dirty flag on the annotation item based on the scenarios
     *
     * We are using a uniqueId property to identify a change made to the annotation object
     * Ideally, whenever a change is made to the annotation object, the uniqueId property will get a new GUID assigned.
     * This uniqueId will be send as an identifier to the gateway along with the annotation objects to be saved
     * The same uniqueId will form the part of the return annotation object from the gateway once the save call completes.
     * The uniqueId from the gateway and the one at the client will be compared to reset the isDirty flag and to update the related
     * properties at the client.
     *
     * @param annotationFromGateway
     * @param annotationInClient
     * @param arr
     * @param index
     */
    MarkingStore.prototype.setOrResetDirtyFlagOnTheAnnotationItem = function (annotationFromGateway, annotationInClient, arr, index) {
        if (annotationFromGateway.uniqueId === annotationInClient.uniqueId) {
            if (annotationInClient.markingOperation === enums.MarkingOperation.deleted) {
                // remove courrent annotation item, if marking operation is deleted.
                arr.splice(index, 1);
            }
            else {
                annotationInClient.isDirty = false;
                annotationInClient.rowVersion = annotationFromGateway.rowVersion;
                annotationInClient.version = annotationFromGateway.version;
                annotationInClient.annotationId = annotationFromGateway.annotationId;
                annotationInClient.markingOperation = enums.MarkingOperation.none;
            }
            annotationInClient.isPickedForSaveOperation = false;
        }
        else if (this.isDirtyFlagMissingForTheAnnotation(annotationFromGateway, annotationInClient)) {
            annotationInClient.isDirty = true;
            annotationInClient.isPickedForSaveOperation = false;
            this.setAnnotationPropertiesBasedOnThePreviousSaveReturn(annotationFromGateway, annotationInClient);
        }
    };
    /**
     * Check whether the dirty flag should be set or not
     *
     * Example scenario -   Consider a case when an annotation object got changed and the 5 minutes background save picked it up
     *                      to be saved to the database. Say, the change made was then reverted before the save call's callback
     *                      reached the client. In this case, the isDirty flag at the client side will be reset to FALSE since according
     *                      to the client the change was reverted.
     *                      So, when the save call reaches back to the client side, the uniqueId in the return object and the one
     *                      in the client will be different for the annotation object. Since the uniqueId is different we are sure that
     *                      there's some change made to the annotation object at the client side before the save call came back. Hence
     *                      we just compare the clientTokens and if the isDirty flag is false to identify the annotation object in this
     *                      method and subsequently sets the isDirty flag to TRUE.
     * @param annotationFromGateway
     * @param annotationInClient
     */
    MarkingStore.prototype.isDirtyFlagMissingForTheAnnotation = function (annotationFromGateway, annotationInClient) {
        return annotationFromGateway.clientToken === annotationInClient.clientToken;
    };
    /**
     * This particular method sets or resets the dirty flag on the enhancedOffPageComment item based on the scenarios
     *
     * We are using a uniqueId property to identify a change made to the enhancedOffPageComment object
     * Ideally, whenever a change is made to the enhancedOffPageComment object, the uniqueId property will get a new GUID assigned.
     * This uniqueId will be send as an identifier to the gateway along with the enhancedOffPageComment objects to be saved
     * The same uniqueId will form the part of the return annotation object from the gateway once the save call completes.
     * The uniqueId from the gateway and the one at the client will be compared to reset the isDirty flag and to update the related
     * properties at the client.
     *
     * @param enhancedOffPageCommentFromGateway
     * @param enhancedOffPageCommentInClient
     * @param arr
     * @param index
     */
    MarkingStore.prototype.setOrResetDirtyFlagOnTheEnhancedOffPageCommentItem = function (enhancedOffPageCommentFromGateway, enhancedOffPageCommentInClient, arr, index) {
        if (enhancedOffPageCommentFromGateway.uniqueId === enhancedOffPageCommentInClient.uniqueId) {
            if (enhancedOffPageCommentInClient.markingOperation === enums.MarkingOperation.deleted) {
                // remove courrent enhancedOffPage comment, if marking operation is deleted.
                arr.splice(index, 1);
            }
            else {
                enhancedOffPageCommentInClient.isDirty = false;
                enhancedOffPageCommentInClient.rowVersion = enhancedOffPageCommentFromGateway.rowVersion;
                enhancedOffPageCommentInClient.enhancedOffPageCommentId = enhancedOffPageCommentFromGateway.enhancedOffPageCommentId;
                enhancedOffPageCommentInClient.markingOperation = enums.MarkingOperation.none;
            }
            enhancedOffPageCommentInClient.isPickedForSaveOperation = false;
        }
        else if (this.isDirtyFlagMissingForEnhancedOffPageComment(enhancedOffPageCommentFromGateway, enhancedOffPageCommentInClient)) {
            enhancedOffPageCommentInClient.isDirty = true;
            enhancedOffPageCommentInClient.isPickedForSaveOperation = false;
            this.setEnhancedOffPageCommentPropertiesBasedOnThePreviousSaveReturn(enhancedOffPageCommentFromGateway, enhancedOffPageCommentInClient);
        }
    };
    /**
     * Check whether the dirty flag should be set or not
     *
     * Example scenario -   Consider a case when an enhancedOffPageCommentInClient object got changed and the 5 minutes
     *                      background save picked it up
     *                      to be saved to the database. Say, the change made was then reverted before the save call's callback
     *                      reached the client. In this case, the isDirty flag at the client side will be reset to FALSE since according
     *                      to the client the change was reverted.
     *                      So, when the save call reaches back to the client side, the uniqueId in the return object and the one
     *                      in the client will be different for the annotation object. Since the uniqueId is different we are sure that
     *                      there's some change made to the annotation object at the client side before the save call came back. Hence
     *                      we just compare the clientTokens and if the isDirty flag is false to identify the annotation object in this
     *                      method and subsequently sets the isDirty flag to TRUE.
     * @param annotationFromGateway
     * @param annotationInClient
     */
    MarkingStore.prototype.isDirtyFlagMissingForEnhancedOffPageComment = function (enhancedOffPageCommentFromGateway, enhancedOffPageCommentInClient) {
        return enhancedOffPageCommentFromGateway.clientToken === enhancedOffPageCommentInClient.clientToken;
    };
    /**
     * This particular method sets or resets the dirty flag on the bookmark item based on the scenarios
     *
     * We are using a uniqueId property to identify a change made to the bookmark object
     * Ideally, whenever a change is made to the bookmark object, the uniqueId property will get a new GUID assigned.
     * This uniqueId will be send as an identifier to the gateway along with the bookmark objects to be saved
     * The same uniqueId will form the part of the return bookmark object from the gateway once the save call completes.
     * The uniqueId from the gateway and the one at the client will be compared to reset the isDirty flag and to update the related
     * properties at the client.
     *
     * @param bookmarkFromGateway
     * @param bookmarkInClient
     * @param arr
     * @param index
     */
    MarkingStore.prototype.setOrResetDirtyFlagOnTheBookmarkItem = function (bookmarkFromGateway, bookmarkInClient, arr, index) {
        if (bookmarkFromGateway.clientToken === bookmarkInClient.clientToken) {
            if (bookmarkInClient.markingOperation === enums.MarkingOperation.deleted) {
                // remove courrent bookmark item, if marking operation is deleted.
                arr.splice(index, 1);
            }
            else {
                bookmarkInClient.isDirty = false;
                bookmarkInClient.rowVersion = bookmarkFromGateway.rowVersion;
                bookmarkInClient.bookmarkId = bookmarkFromGateway.bookmarkId;
                bookmarkInClient.markingOperation = enums.MarkingOperation.none;
            }
            bookmarkInClient.isPickedForSaveOperation = false;
        }
        else if (this.isDirtyFlagMissingForTheBookmark(bookmarkFromGateway, bookmarkInClient)) {
            bookmarkInClient.isDirty = true;
            bookmarkInClient.isPickedForSaveOperation = false;
            this.setBookmarkPropertiesBasedOnThePreviousSaveReturn(bookmarkFromGateway, bookmarkInClient);
        }
    };
    /**
     * Check whether the dirty flag should be set or not
     *
     * Example scenario -   Consider a case when an bookmarkInClient object got changed and the 5 minutes
     *                      background save picked it up
     *                      to be saved to the database. Say, the change made was then reverted before the save call's callback
     *                      reached the client. In this case, the isDirty flag at the client side will be reset to FALSE since according
     *                      to the client the change was reverted.
     *                      So, when the save call reaches back to the client side, the uniqueId in the return object and the one
     *                      in the client will be different for the bookmark object. Since the uniqueId is different we are sure that
     *                      there's some change made to the bookmark object at the client side before the save call came back. Hence
     *                      we just compare the clientTokens and if the isDirty flag is false to identify the bookmark object in this
     *                      method and subsequently sets the isDirty flag to TRUE.
     * @param bookmarkFromGateway
     * @param bookmarkInClient
     */
    MarkingStore.prototype.isDirtyFlagMissingForTheBookmark = function (bookmarkFromGateway, bookmarkInClient) {
        return bookmarkFromGateway.clientToken === bookmarkInClient.clientToken;
    };
    /**
     * This method sets the properties of the client side Mark object based on the Mark object returned from the previous Save call
     * @param markFromGateway
     * @param markInClient
     */
    MarkingStore.prototype.setMarkPropertiesBasedOnThePreviousSaveReturn = function (markFromGateway, markInClient) {
        markInClient.rowVersion = markFromGateway.rowVersion;
        markInClient.version = markFromGateway.version;
        switch (markFromGateway.markingOperation) {
            case enums.MarkingOperation.deleted:
                markInClient.markingOperation = this.setMarkingOperationForClientItem(markInClient, markFromGateway.markingOperation);
                markInClient.markId = 0;
                break;
            case enums.MarkingOperation.added:
            case enums.MarkingOperation.updated:
                markInClient.markingOperation = this.setMarkingOperationForClientItem(markInClient, markFromGateway.markingOperation);
                markInClient.markId = markFromGateway.markId;
                break;
        }
    };
    /**
     * This method will set the corresponding marking operation.
     *
     * @private
     * @param {examinerMark} markInClient
     * @returns
     * @memberof MarkingStore
     */
    MarkingStore.prototype.setMarkingOperationForClientItem = function (clientItem, markingOperationFromGateWay) {
        if (markingOperationFromGateWay === enums.MarkingOperation.added ||
            markingOperationFromGateWay === enums.MarkingOperation.updated) {
            /* Consider the case if a user delted a mark during a background save, saved marking operation is 1 (added) and
               during the callback it's changed to 3 (deleted), we will compare the unique ids and update the marking operation
               in this sceario we need to set the marking operation as deleted (3) instead of updated(2). */
            return clientItem.markingOperation === enums.MarkingOperation.deleted ?
                enums.MarkingOperation.deleted : enums.MarkingOperation.updated;
        }
        else if (markingOperationFromGateWay === enums.MarkingOperation.deleted) {
            /* Consider the case if a user delted a mark during a background save, saved marking operation is 3 (deleted) and
               during the callback it's changed again to 3 (deleted) in this scenario unique id will be updated,we will compare the
               unique ids and update the marking operation in this sceario we need to set the marking operation as deleted (3)
               instead of added(1). */
            return clientItem.markingOperation === enums.MarkingOperation.deleted ?
                enums.MarkingOperation.deleted : enums.MarkingOperation.added;
        }
    };
    /**
     * This method sets the properties of the client side Annotation object based on the Annotation object returned from the
     * previous Save call
     * @param annotationFromGateway
     * @param annotationInClient
     */
    MarkingStore.prototype.setAnnotationPropertiesBasedOnThePreviousSaveReturn = function (annotationFromGateway, annotationInClient) {
        annotationInClient.rowVersion = annotationFromGateway.rowVersion;
        annotationInClient.version = annotationFromGateway.version;
        switch (annotationFromGateway.markingOperation) {
            case enums.MarkingOperation.deleted:
                annotationInClient.markingOperation = this.setMarkingOperationForClientItem(annotationInClient, annotationFromGateway.markingOperation);
                annotationInClient.annotationId = 0;
                break;
            case enums.MarkingOperation.added:
            case enums.MarkingOperation.updated:
                annotationInClient.markingOperation = this.setMarkingOperationForClientItem(annotationInClient, annotationFromGateway.markingOperation);
                annotationInClient.annotationId = annotationFromGateway.annotationId;
                break;
        }
    };
    /**
     * This method sets the properties of the client side Enhancedoffpagecomment object based on the Annotation object returned from the
     * previous Save call
     * @param enhancedOffPageCommentFromGateway
     * @param enhancedOffPageCommentInClient
     */
    MarkingStore.prototype.setEnhancedOffPageCommentPropertiesBasedOnThePreviousSaveReturn = function (enhancedOffPageCommentFromGateway, enhancedOffPageCommentInClient) {
        enhancedOffPageCommentInClient.rowVersion = enhancedOffPageCommentFromGateway.rowVersion;
        switch (enhancedOffPageCommentFromGateway.markingOperation) {
            case enums.MarkingOperation.deleted:
                enhancedOffPageCommentInClient.markingOperation = this.setMarkingOperationForClientItem(enhancedOffPageCommentInClient, enhancedOffPageCommentFromGateway.markingOperation);
                enhancedOffPageCommentInClient.enhancedOffPageCommentId = 0;
                break;
            case enums.MarkingOperation.added:
            case enums.MarkingOperation.updated:
                enhancedOffPageCommentInClient.markingOperation = this.setMarkingOperationForClientItem(enhancedOffPageCommentInClient, enhancedOffPageCommentFromGateway.markingOperation);
                enhancedOffPageCommentInClient.enhancedOffPageCommentId = enhancedOffPageCommentFromGateway.enhancedOffPageCommentId;
        }
    };
    /**
     * This method sets the properties of the client side bookmark object based on the Bookmark object returned from the
     * previous Save call
     * @param bookmarkFromGateway
     * @param bookmarkInClient
     */
    MarkingStore.prototype.setBookmarkPropertiesBasedOnThePreviousSaveReturn = function (bookmarkFromGateway, bookmarkInClient) {
        bookmarkInClient.rowVersion = bookmarkFromGateway.rowVersion;
        switch (bookmarkFromGateway.markingOperation) {
            case enums.MarkingOperation.deleted:
                bookmarkInClient.markingOperation = this.setMarkingOperationForClientItem(bookmarkInClient, bookmarkFromGateway.markingOperation);
                bookmarkInClient.bookmarkId = 0;
                break;
            case enums.MarkingOperation.added:
            case enums.MarkingOperation.updated:
                bookmarkInClient.markingOperation = this.setMarkingOperationForClientItem(bookmarkInClient, bookmarkFromGateway.markingOperation);
                bookmarkInClient.bookmarkId = bookmarkFromGateway.bookmarkId;
                break;
        }
    };
    /**
     * Check whether mark is loaded or not
     * @param markGroupId
     * @param considerNonRecoverableError if true we will reload the marks if there is a non-recoverable error against current markGroupId.
     */
    MarkingStore.prototype.isMarksLoaded = function (markGroupId, considerNonRecoverableError) {
        if (considerNonRecoverableError === void 0) { considerNonRecoverableError = true; }
        if (this._examinerMarksAgainstResponse == null ||
            (this.checkMarkGroupItemHasNonRecoverableErrors(markGroupId) && considerNonRecoverableError)) {
            return false;
        }
        return this._examinerMarksAgainstResponse[markGroupId] != null;
    };
    /**
     * Get the previous marks collection count.
     */
    MarkingStore.prototype.getPreviousMarksCollectionCount = function () {
        return this._examinerMarksAgainstResponse[this._currentMarkGroupId]
            .examinerMarkGroupDetails[this._currentMarkGroupId]
            .allMarksAndAnnotations.length;
    };
    /**
     * Get all marks and annotations.
     */
    MarkingStore.prototype.getAllMarksAndAnnotations = function () {
        // Check the marks loaded in the collection.
        if (this._examinerMarksAgainstResponse[this._currentMarkGroupId] != null) {
            return this._examinerMarksAgainstResponse[this._currentMarkGroupId]
                .examinerMarkGroupDetails[this._currentMarkGroupId]
                .allMarksAndAnnotations;
        }
        return null;
    };
    /**
     * Get previous marks of single/whole response.
     */
    MarkingStore.prototype.getDefaultPreviousMarks = function () {
        var examinerMarksCollection = Array();
        var allMarkSchemGroupIds = this.getRelatedWholeResponseQIGIds();
        var markSchemeGroupIndex = 0;
        do {
            var markGroupId = this.currentMarkGroupId;
            // for whole response, loop through annotations of each qig
            if (allMarkSchemGroupIds && allMarkSchemGroupIds.length > 0) {
                markGroupId = this.getMarkGroupIdQIGtoRIGMap(allMarkSchemGroupIds[markSchemeGroupIndex++]);
            }
            var allMarksAndAnnotations = this.examinerMarksAgainstCurrentResponse.
                examinerMarkGroupDetails[markGroupId].allMarksAndAnnotations;
            var allMarksAndAnnotationsWithIsDefault = allMarksAndAnnotations.filter(function (x) { return x.isDefault === true; });
            if (allMarksAndAnnotationsWithIsDefault.length === 1) {
                examinerMarksCollection = examinerMarksCollection.concat(allMarksAndAnnotationsWithIsDefault[0].examinerMarksCollection);
            }
            else {
                examinerMarksCollection = examinerMarksCollection.concat(allMarksAndAnnotations[1].examinerMarksCollection);
            }
        } while (markSchemeGroupIndex < allMarkSchemGroupIds.length);
        return examinerMarksCollection;
    };
    /**
     * Set as non recoverable item.
     * @param markGroupId
     * @param errorType
     */
    MarkingStore.prototype.setAsNonRecoverableItem = function (markGroupId, errorType) {
        if (errorType === void 0) { errorType = enums.SaveMarksAndAnnotationErrorCode.NonRecoverableError; }
        // update the examiner mark data against the response.
        var examinerMarksAndAnnotations = this._examinerMarksAgainstResponse[markGroupId];
        var allMarksAndAnnotations = examinerMarksAndAnnotations.examinerMarkGroupDetails[markGroupId]
            .allMarksAndAnnotations;
        var isBackGroundSave = examinerMarksAndAnnotations.IsBackGroundSave;
        examinerMarksAndAnnotations.errorType = errorType;
        var markGroupIds = workListStore.instance.getRelatedMarkGroupIdsForWholeResponse(markGroupId);
        markGroupIds.push(markGroupId);
        if (!isBackGroundSave) {
            markGroupIds.forEach(function (mgId) {
                allMarksAndAnnotations[0].enhancedOffPageComments = [];
                allMarksAndAnnotations[0].examinerMarksCollection = [];
                allMarksAndAnnotations[0].annotations = [];
                allMarksAndAnnotations[0].bookmarks = [];
                allMarksAndAnnotations[0].absoluteMarksDifference = undefined;
                allMarksAndAnnotations[0].accuracyIndicator = undefined;
                allMarksAndAnnotations[0].accuracyTolerance = undefined;
                allMarksAndAnnotations[0].examinerMarks = undefined;
                allMarksAndAnnotations[0].maximumMarks = undefined;
                allMarksAndAnnotations[0].totalMarks = undefined;
                allMarksAndAnnotations[0].totalMarksDifference = undefined;
                allMarksAndAnnotations[0].totalTolerance = undefined;
                allMarksAndAnnotations[0].totalToleranceRemark = undefined;
                allMarksAndAnnotations[0].markingProgress = undefined;
                allMarksAndAnnotations[0].hasMarkSchemeLevelTolerance = undefined;
                allMarksAndAnnotations[0].version = undefined;
                allMarksAndAnnotations[0].questionItemGroup = undefined;
                allMarksAndAnnotations[0].totalLowerTolerance = undefined;
                allMarksAndAnnotations[0].totalUpperTolerance = undefined;
                allMarksAndAnnotations[0].seedingAMDTolerance = undefined;
                allMarksAndAnnotations[0].submittedDate = undefined;
                allMarksAndAnnotations[0].remarkRequestTypeId = undefined;
            });
        }
        else {
            // resetting the IsBackGroundSave property
            examinerMarksAndAnnotations.IsBackGroundSave = false;
        }
    };
    /**
     * This method will returns the non-recoverable error status of the corresponding markGroupId.
     * @param markGroupId markGroupId for the examinermarks collection
     */
    MarkingStore.prototype.checkMarkGroupItemHasNonRecoverableErrors = function (markGroupId) {
        var _this = this;
        var markGroupItemHasNonRecoverableErrors = false;
        /**
         *  in case of a whole response, there might be a non recoverable error set when opened
         *  from some other qig before coming to this Qig. handle this scenario.
         */
        var markGroupIds = workListStore.instance.getRelatedMarkGroupIdsForWholeResponse(markGroupId);
        markGroupIds.push(markGroupId);
        markGroupIds.forEach(function (mgId) {
            var examinerMarksAndAnnotations = _this._examinerMarksAgainstResponse[mgId];
            if (examinerMarksAndAnnotations && examinerMarksAndAnnotations.examinerMarkGroupDetails) {
                markGroupItemHasNonRecoverableErrors =
                    (_this.isNonRecoverableError(examinerMarksAndAnnotations.errorType)) || markGroupItemHasNonRecoverableErrors;
            }
        });
        return markGroupItemHasNonRecoverableErrors;
    };
    /**
     * This method will returns the non-recoverable error status of the corresponding markGroupId.
     * @param markGroupId
     */
    MarkingStore.prototype.checkMarkGroupItemHasSaveMarkErrors = function (markGroupId) {
        var _this = this;
        var hasSaveMarkErrors = false;
        /**
         *  in case of a whole response, there might be a non recoverable error set when opened
         *  from some other qig before coming to this Qig. get related Mark Groups for that.
         */
        var markGroupIds = workListStore.instance.getRelatedMarkGroupIdsForWholeResponse(markGroupId);
        markGroupIds.push(markGroupId);
        markGroupIds.forEach(function (mgId) {
            var errorType = enums.SaveMarksAndAnnotationErrorCode.None;
            var examinerMarksAndAnnotations = _this._examinerMarksAgainstResponse[mgId];
            if (examinerMarksAndAnnotations && examinerMarksAndAnnotations.examinerMarkGroupDetails) {
                errorType = examinerMarksAndAnnotations.errorType;
            }
            hasSaveMarkErrors = (errorType === enums.SaveMarksAndAnnotationErrorCode.ClosedResponse ||
                errorType === enums.SaveMarksAndAnnotationErrorCode.ResponseRemoved) || hasSaveMarkErrors;
        });
        return hasSaveMarkErrors;
    };
    /**
     * Get Save MarksAndAnnotation ErrorCode
     * @param markGroupId
     */
    MarkingStore.prototype.getSaveMarksAndAnnotationErrorCode = function (markGroupId) {
        /**
         *  in case of a whole response, there might be a non recoverable error set when opened
         *  from some other qig before coming to this Qig. get related Mark Groups for that.
         */
        var markGroupIds = workListStore.instance.getRelatedMarkGroupIdsForWholeResponse(markGroupId);
        markGroupIds.push(markGroupId);
        var saveErrorCode = enums.SaveMarksAndAnnotationErrorCode.None;
        var examinerMarksAndAnnotations = this._examinerMarksAgainstResponse[markGroupId];
        if (examinerMarksAndAnnotations && examinerMarksAndAnnotations.examinerMarkGroupDetails) {
            saveErrorCode = examinerMarksAndAnnotations.errorType;
        }
        return saveErrorCode;
    };
    Object.defineProperty(MarkingStore.prototype, "currentMarkGroupItemHasNonRecoverableErrors", {
        /**
         * returns the non-recoverable error status of current markGroup.
         */
        get: function () {
            return this._currentMarkGroupItemHasNonRecoverableErrors;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * examiner marks and data version.
     * @param markGroupId
     */
    MarkingStore.prototype.getExaminerMarkAndAnnotationsDataVersion = function (parentMarkGroupId, markGroupId) {
        // update the examiner mark data against the response.
        var examinerMarksAndAnnotations = this._examinerMarksAgainstResponse[parentMarkGroupId];
        var allMarksAndAnnotations = examinerMarksAndAnnotations.examinerMarkGroupDetails[markGroupId]
            .allMarksAndAnnotations;
        return allMarksAndAnnotations[0].version;
    };
    /**
     * Returns back whether the response is in the awaiting queueing status
     * @param markGroupId
     */
    MarkingStore.prototype.getMarksAndAnnotationsSaveQueueStatus = function (markGroupId) {
        if (this._examinerMarksAgainstResponse[markGroupId] !== undefined &&
            this._examinerMarksAgainstResponse[markGroupId] != null) {
            return this._examinerMarksAgainstResponse[markGroupId].IsAwaitingToBeQueued;
        }
        else {
            return false;
        }
    };
    /**
     * This method will return the marks collection.
     * It will return only the dirty ones
     *                  if the parameter doIgnoreDirtyFlagAndSaveAllMarksAndAnnotations is FALSE
     * It will return all the marks irrespective of the dirty flag
     *                  if the parameter doIgnoreDirtyFlagAndSaveAllMarksAndAnnotations is TRUE
     * @param markGroupId
     * @param doIgnoreDirtyFlagAndSaveAllMarksAndAnnotations
     */
    MarkingStore.prototype.getDirtyExaminerMarks = function (parentMarkGroupId, markGroupId, doIgnoreDirtyFlagAndSaveAllMarksAndAnnotations) {
        if (doIgnoreDirtyFlagAndSaveAllMarksAndAnnotations === void 0) { doIgnoreDirtyFlagAndSaveAllMarksAndAnnotations = false; }
        var markItems = this._examinerMarksAgainstResponse[parentMarkGroupId];
        var dirtyMarks;
        if (markItems) {
            if (doIgnoreDirtyFlagAndSaveAllMarksAndAnnotations) {
                // Returning all the marks irrespective of the dirty flag
                dirtyMarks = markItems.
                    examinerMarkGroupDetails[markGroupId].
                    allMarksAndAnnotations[0].examinerMarksCollection;
            }
            else {
                // Returning only the dirty marks
                dirtyMarks = markItems.
                    examinerMarkGroupDetails[markGroupId].
                    allMarksAndAnnotations[0].examinerMarksCollection.filter(function (x) { return x.isDirty; });
            }
        }
        return dirtyMarks;
    };
    /**
     * This method will return the annotations collection.
     * It will return only the dirty ones
     *                  if the parameter doIgnoreDirtyFlagAndSaveAllMarksAndAnnotations is FALSE
     * It will return all the marks irrespective of the dirty flag
     *                  if the parameter doIgnoreDirtyFlagAndSaveAllMarksAndAnnotations is TRUE
     * @param markGroupId
     * @param doIgnoreDirtyFlagAndSaveAllMarksAndAnnotations
     */
    MarkingStore.prototype.getDirtyExaminerAnnotations = function (parentMarkGroupId, markGroupId, doIgnoreDirtyFlagAndSaveAllMarksAndAnnotations) {
        if (doIgnoreDirtyFlagAndSaveAllMarksAndAnnotations === void 0) { doIgnoreDirtyFlagAndSaveAllMarksAndAnnotations = false; }
        this.removeInvalidAnnotations(parentMarkGroupId, markGroupId);
        var annotationItems = this._examinerMarksAgainstResponse[parentMarkGroupId];
        var dirtyAnnotations;
        if (annotationItems) {
            if (doIgnoreDirtyFlagAndSaveAllMarksAndAnnotations) {
                // Returning all the annotations irrespective of the dirty flag
                dirtyAnnotations = annotationItems.
                    examinerMarkGroupDetails[markGroupId].
                    allMarksAndAnnotations[0].annotations;
            }
            else {
                // Returning only the dirty annotations
                dirtyAnnotations = annotationItems.
                    examinerMarkGroupDetails[markGroupId].
                    allMarksAndAnnotations[0].annotations.filter(function (x) { return x.isDirty; });
            }
        }
        return dirtyAnnotations;
    };
    /**
     * This method will return the enhanced off page comment collection.
     * It will return only the dirty ones
     *                  if the parameter doIgnoreDirtyFlagAndSaveAllMarksAndAnnotations is FALSE
     * It will return all the comments irrespective of the dirty flag
     *                  if the parameter doIgnoreDirtyFlagAndSaveAllMarksAndAnnotations is TRUE
     * @param markGroupId
     * @param doIgnoreDirtyFlagAndSaveAllMarksAndAnnotations
     */
    MarkingStore.prototype.getDirtyEnhancedOffPageComments = function (parentMarkGroupId, markGroupId, doIgnoreDirtyFlagAndSaveAllMarksAndAnnotations) {
        if (doIgnoreDirtyFlagAndSaveAllMarksAndAnnotations === void 0) { doIgnoreDirtyFlagAndSaveAllMarksAndAnnotations = false; }
        var markItems = this._examinerMarksAgainstResponse[parentMarkGroupId];
        var dirtyEnhancedOffPageComments;
        if (markItems) {
            if (doIgnoreDirtyFlagAndSaveAllMarksAndAnnotations) {
                // Returning all the marks irrespective of the dirty flag
                dirtyEnhancedOffPageComments = markItems.
                    examinerMarkGroupDetails[markGroupId].
                    allMarksAndAnnotations[0].enhancedOffPageComments;
            }
            else {
                // Returning only the dirty marks
                dirtyEnhancedOffPageComments = markItems.
                    examinerMarkGroupDetails[markGroupId].
                    allMarksAndAnnotations[0].enhancedOffPageComments.filter(function (x) { return x.isDirty; });
            }
        }
        return dirtyEnhancedOffPageComments;
    };
    /**
     * This method will return the bookmark collection.
     * It will return only the dirty ones
     *                  if the parameter doIgnoreDirtyFlagAndSaveAllMarksAndAnnotations is FALSE
     * It will return all the comments irrespective of the dirty flag
     *                  if the parameter doIgnoreDirtyFlagAndSaveAllMarksAndAnnotations is TRUE
     * @param markGroupId
     * @param doIgnoreDirtyFlagAndSaveAllBookMarks
     */
    MarkingStore.prototype.getDirtyBookMarks = function (parentMarkGroupId, markGroupId, doIgnoreDirtyFlagAndSaveAllBookMarks) {
        if (doIgnoreDirtyFlagAndSaveAllBookMarks === void 0) { doIgnoreDirtyFlagAndSaveAllBookMarks = false; }
        var markItems = this._examinerMarksAgainstResponse[parentMarkGroupId];
        var dirtyBookMarks;
        if (markItems) {
            if (doIgnoreDirtyFlagAndSaveAllBookMarks) {
                // Returning all the bookmarks irrespective of the dirty flag
                dirtyBookMarks = markItems.
                    examinerMarkGroupDetails[markGroupId].
                    allMarksAndAnnotations[0].bookmarks;
            }
            else {
                // Returning only the dirty bookmarks
                dirtyBookMarks = markItems.
                    examinerMarkGroupDetails[markGroupId].
                    allMarksAndAnnotations[0].bookmarks.filter(function (x) { return x.isDirty; });
            }
        }
        return dirtyBookMarks;
    };
    /**
     * remove invalid annotations with width/height = 0
     * @param markGroupId
     */
    MarkingStore.prototype.removeInvalidAnnotations = function (parentMarkGroupId, markGroupId) {
        var annotations = this._examinerMarksAgainstResponse[parentMarkGroupId].
            examinerMarkGroupDetails[markGroupId].allMarksAndAnnotations[0].annotations;
        var invalidAnnotations = annotations.filter(function (x) { return ((x.height === 0 || x.width === 0)
            && x.stamp !== constants.OFF_PAGE_COMMENT_STAMP_ID); });
        for (var i = 0; i < invalidAnnotations.length; i++) {
            var annotation = invalidAnnotations[i];
            var index = this.findIndex(annotation.clientToken);
            if (index >= 0) {
                annotations.splice(index, 1);
            }
        }
    };
    Object.defineProperty(MarkingStore.prototype, "currentQuestionItemInfo", {
        /**
         * get current question info
         */
        get: function () {
            return this._currentQuestionItemInfo;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MarkingStore.prototype, "previousQuestionItemImageClusterId", {
        /**
         * get previous question item's image cluster id
         */
        get: function () {
            return this._previousQuestionItemImageClusterId;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MarkingStore.prototype, "currentQuestionItemImageClusterId", {
        /**
         * returns the imageclusterid of current question item
         */
        get: function () {
            return this.currentQuestionItemInfo ? this.currentQuestionItemInfo.imageClusterId : undefined;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MarkingStore.prototype, "currentMarkSchemeId", {
        /**
         * get current question item's unique id
         */
        get: function () {
            return this.currentQuestionItemInfo ? this.currentQuestionItemInfo.uniqueId : undefined;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MarkingStore.prototype, "previousMarkSchemeId", {
        /**
         * get previous question item's unique id
         */
        get: function () {
            return this._previousQuestionItem;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MarkingStore.prototype, "examinerMarksAgainstCurrentResponse", {
        /**
         * Get the examiner marks against current response
         */
        get: function () {
            if (this._examinerMarksAgainstResponse) {
                return this._examinerMarksAgainstResponse[this._currentMarkGroupId];
            }
            else {
                return null;
            }
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Get the examiner marks against current response
     */
    MarkingStore.prototype.examinerMarksAgainstResponse = function (markGroupId) {
        if (this._examinerMarksAgainstResponse) {
            return this._examinerMarksAgainstResponse[markGroupId];
        }
        else {
            return null;
        }
    };
    /**
     * Get the examiner marks against a response.
     * @param parentMarkGroupId markgroup key against which collection is stored
     * @param markGroupId in case of a whole response, provide second level of markGroupid
     */
    MarkingStore.prototype.currentExaminerMarksAgainstResponse = function (parentMarkGroupId, markGroupId) {
        if (this._examinerMarksAgainstResponse) {
            var markItem = this._examinerMarksAgainstResponse[parentMarkGroupId];
            if (markItem !== null && markItem) {
                return markItem.examinerMarkGroupDetails[markGroupId ? markGroupId : parentMarkGroupId].allMarksAndAnnotations[0];
            }
        }
        return null;
    };
    /**
     * Get the marks and annotation against a single response/ whole response.
     * @param markGroupId
     */
    MarkingStore.prototype.allMarksAndAnnotationAgainstResponse = function (markGroupId) {
        var allMarksAndAnnotation = [];
        if (this._examinerMarksAgainstResponse) {
            var markItem = this._examinerMarksAgainstResponse[markGroupId];
            if (markItem) {
                for (var examinerMarkGroupDetails in markItem.examinerMarkGroupDetails) {
                    if (examinerMarkGroupDetails) {
                        allMarksAndAnnotation.push(markItem.examinerMarkGroupDetails[examinerMarkGroupDetails]
                            .allMarksAndAnnotations[0]);
                    }
                }
            }
        }
        return allMarksAndAnnotation;
    };
    /**
     * Get all annotations against a single response/ whole response.
     * @param parentMarkGroupId
     */
    MarkingStore.prototype.allAnnotationsAgainstResponse = function (parentMarkGroupId) {
        var allMarksAndAnnotation = [];
        var allAnnotations = Array();
        var showDefAnnotationsOnly = this.showDefinitiveMarksOnly();
        if (this._examinerMarksAgainstResponse) {
            var markItem = this._examinerMarksAgainstResponse[parentMarkGroupId];
            if (markItem) {
                for (var item in markItem.examinerMarkGroupDetails) {
                    if (item) {
                        if (!showDefAnnotationsOnly) {
                            // Loop through annotations of all QIGs and create a single array which contains annotaions of all QIGs
                            allAnnotations = allAnnotations.concat(markItem.examinerMarkGroupDetails[item]
                                .allMarksAndAnnotations[0].annotations);
                        }
                        else {
                            allAnnotations = allAnnotations.concat(markItem.examinerMarkGroupDetails[item]
                                .allMarksAndAnnotations[0].annotations.filter(function (annotaion) {
                                return annotaion.definitiveMark === true;
                            }));
                        }
                    }
                }
            }
        }
        return allAnnotations;
    };
    Object.defineProperty(MarkingStore.prototype, "currentMarkGroupId", {
        /**
         * get the current mark group id
         */
        get: function () {
            return this._currentMarkGroupId;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MarkingStore.prototype, "newMark", {
        /**
         * get the newly entered mark
         */
        get: function () {
            return this._newMark;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MarkingStore.prototype, "initialMarkingProgress", {
        /**
         * getting the initial marking progress
         */
        get: function () {
            return this._initialMarkingProgress;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MarkingStore.prototype, "navigateTo", {
        /**
         * Getting where to the navigation happening
         */
        get: function () {
            return this._navigatingTo;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MarkingStore.prototype, "currentNavigation", {
        /**
         * Getting navigation is happening to  where - for setting the question item as selected.
         */
        get: function () {
            return this._currentNavigation;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Getting the enhanced off page comments against selected response
     */
    MarkingStore.prototype.enhancedOffPageCommentsAgainstCurrentResponse = function (index) {
        if (index === void 0) { index = 0; }
        var enhancedOffPageComments = Immutable.List();
        if (this.examinerMarksAgainstCurrentResponse) {
            var marksAndAnnotations = this.examinerMarksAgainstCurrentResponse.
                examinerMarkGroupDetails[this.selectedQIGMarkGroupId].allMarksAndAnnotations[index];
            if (marksAndAnnotations.enhancedOffPageComments && marksAndAnnotations.enhancedOffPageComments.length > 0) {
                enhancedOffPageComments = Immutable.List(marksAndAnnotations.enhancedOffPageComments.
                    filter(function (x) { return x.markingOperation !== enums.MarkingOperation.deleted; }));
            }
        }
        return enhancedOffPageComments;
    };
    /**
     * Getting the bookmarks against selected response
     */
    MarkingStore.prototype.bookmarksAgainstCurrentResponse = function (index) {
        if (index === void 0) { index = 0; }
        var bookmarks = Immutable.List();
        if (this.examinerMarksAgainstCurrentResponse) {
            var marksAndAnnotations = this.examinerMarksAgainstCurrentResponse.
                examinerMarkGroupDetails[this.selectedQIGMarkGroupId].allMarksAndAnnotations[index];
            var showDefAnnotationsOnly = this.showDefinitiveMarksOnly();
            if (marksAndAnnotations.bookmarks && marksAndAnnotations.bookmarks.length > 0) {
                if (showDefAnnotationsOnly) {
                    bookmarks = Immutable.List(marksAndAnnotations.bookmarks.
                        filter(function (x) { return x.markingOperation !== enums.MarkingOperation.deleted && x.definitiveBookmark === true; }));
                }
                else {
                    bookmarks = Immutable.List(marksAndAnnotations.bookmarks.
                        filter(function (x) { return x.markingOperation !== enums.MarkingOperation.deleted; }));
                }
            }
        }
        return bookmarks;
    };
    /**
     * Remove annotation from the marking screen
     * @param removeAnnotationList
     */
    MarkingStore.prototype.removeAnnotation = function (removeAnnotationList, contextMenuType) {
        var _this = this;
        // Denotes if the response is to be queued for save after removing the annotation
        // If the removed annotation is a newly put annotation that doesn't already exist
        // in the database, then no need to queue the response for saving process
        var isResponseToBeQueuedForSave = false;
        var markGroupId = this.selectedQIGMarkGroupId;
        // Denotes the list of newly added annotations that are removed
        // and doesn't already exist in the database
        var newlyAddedAnnotations = [];
        if (contextMenuType === enums.ContextMenuType.annotation) {
            // Looping through the annotation list to be deleted
            removeAnnotationList.map(function (annotationClientToken) {
                var markItem = _this._examinerMarksAgainstResponse[_this.currentMarkGroupId];
                var _loop_2 = function(examinerMarkGroupDetails) {
                    if (examinerMarkGroupDetails) {
                        markItem.examinerMarkGroupDetails[examinerMarkGroupDetails]
                            .allMarksAndAnnotations[0].annotations.map(function (a) {
                            // If the client token matches, then delete the annotation
                            if (a.clientToken === annotationClientToken) {
                                // If annotation id exists, then that means that the annotation
                                // already exists in the database, hence just set the isDirty flag to true
                                // and set the 'isResponseToBeQueuedForSave' flag to true for
                                // adding the response to the save marks and annotations queue
                                if (a.annotationId !== 0) {
                                    isResponseToBeQueuedForSave = true;
                                    a.isDirty = true;
                                    a.uniqueId = htmlUtilities.guid;
                                    a.markingOperation = enums.MarkingOperation.deleted;
                                }
                                else {
                                    // If annotation id doesn't exist, then push the annotation to the
                                    // newly added annotations list after setting the same to dirty
                                    a.isDirty = true;
                                    a.uniqueId = htmlUtilities.guid;
                                    a.markingOperation = enums.MarkingOperation.deleted;
                                    newlyAddedAnnotations.push(a.clientToken);
                                }
                                markGroupId = parseInt(examinerMarkGroupDetails);
                            }
                        });
                    }
                };
                for (var examinerMarkGroupDetails in markItem.examinerMarkGroupDetails) {
                    _loop_2(examinerMarkGroupDetails);
                }
            });
        }
        else {
            removeAnnotationList.map(function (annotationClientToken) {
                _this.examinerMarksAgainstCurrentResponse.
                    examinerMarkGroupDetails[_this.selectedQIGMarkGroupId].
                    allMarksAndAnnotations[0].bookmarks.map(function (a) {
                    // If the client token matches, then delete the bookmark
                    if (a.clientToken === annotationClientToken) {
                        // If bookmark id exists, then that means that the bookmark
                        // already exists in the database, hence just set the isDirty flag to true
                        // and set the 'isResponseToBeQueuedForSave' flag to true for
                        // adding the response to the save marks and annotations queue
                        if (a.clientToken) {
                            isResponseToBeQueuedForSave = true;
                            a.isDirty = true;
                            a.clientToken = htmlUtilities.guid;
                            a.markingOperation = enums.MarkingOperation.deleted;
                        }
                    }
                });
            });
        }
        // If there are annotations in the newly added annotations list,
        // then simply remove it from the actual annotations list in the
        // marks and annotations collection in the store
        if (newlyAddedAnnotations.length > 0) {
            for (var i = 0; i < newlyAddedAnnotations.length; i++) {
                var index = this.findIndex(newlyAddedAnnotations[i]);
                if (index >= 0) {
                    this.examinerMarksAgainstCurrentResponse.
                        examinerMarkGroupDetails[markGroupId].
                        allMarksAndAnnotations[0].annotations.splice(index, 1);
                }
            }
        }
        // Push the response to the queue only if a save is definitely required
        // because of removing an annotation which was already in the database
        if (isResponseToBeQueuedForSave) {
            // Update the marks and annotations save queue status to Await Queueing
            this.updateMarksAndAnnotationsSaveQueueingStatus(this.currentMarkGroupId, true);
        }
    };
    /**
     * Returns the index of the annotation from the annotation collection
     * @param clientToken
     */
    MarkingStore.prototype.findIndex = function (clientToken) {
        var index;
        var annotations = this.examinerMarksAgainstCurrentResponse.
            examinerMarkGroupDetails[this.selectedQIGMarkGroupId].
            allMarksAndAnnotations[0].annotations;
        for (var i = 0; i < annotations.length; i++) {
            if (annotations[i].clientToken === clientToken) {
                index = i;
                break;
            }
        }
        return index;
    };
    /**
     * finds the annotation data based on the client token.
     * @param clientToken
     */
    MarkingStore.prototype.findAnnotationData = function (clientToken) {
        var annotationData = this.examinerMarksAgainstCurrentResponse.
            examinerMarkGroupDetails[this.selectedQIGMarkGroupId].
            allMarksAndAnnotations[0].annotations.filter(function (a) { return a.clientToken === clientToken; });
        return annotationData[0];
    };
    /**
     * Update annotation action method
     * @param leftEdge
     * @param topEdge
     * @param topEdge
     * @param topEdge
     * @param topEdge
     * @param currentAnnotationClientToken
     * @param width
     * @param height
     */
    MarkingStore.prototype.updateAnnotation = function (leftEdge, topEdge, imageClusterId, outputPageNo, pageNo, currentAnnotationClientToken, width, height, comment) {
        if (this.examinerMarksAgainstCurrentResponse) {
            var isOnPageComment_1 = false;
            var that_2 = this;
            this.examinerMarksAgainstCurrentResponse.
                examinerMarkGroupDetails[this.selectedQIGMarkGroupId].
                allMarksAndAnnotations[0].annotations.map(function (a) {
                if (a.clientToken === currentAnnotationClientToken) {
                    a.isDirty = true;
                    a.uniqueId = htmlUtilities.guid;
                    a.leftEdge = Math.round(leftEdge);
                    a.topEdge = Math.round(topEdge);
                    a.width = Math.round(width);
                    a.height = Math.round(height);
                    a.pageNo = pageNo;
                    a.imageClusterId = imageClusterId > 0 ? imageClusterId : a.imageClusterId;
                    a.outputPageNo = outputPageNo;
                    a.comment = (a.stamp !== enums.DynamicAnnotation.OnPageComment &&
                        a.stamp !== enums.DynamicAnnotation.OffPageComment) ? a.comment : comment;
                    a.markingOperation = a.annotationId === 0 ? a.markingOperation : enums.MarkingOperation.updated;
                    isOnPageComment_1 = that_2.isOnPageComment(a.stamp);
                }
            });
            // to avoid saving empty comment in db
            if (comment === '' && isOnPageComment_1) {
                return;
            }
            // Update the marks and annotations save queue status to Await Queueing
            this.updateMarksAndAnnotationsSaveQueueingStatus(this.currentMarkGroupId, true);
        }
    };
    /**
     * Checks whether the passed in stamp is an on page comment or not
     * @param stampId
     */
    MarkingStore.prototype.isOnPageComment = function (stampId) {
        return enums.DynamicAnnotation.OnPageComment === stampId;
    };
    Object.defineProperty(MarkingStore.prototype, "isAnnotationDrawing", {
        get: function () {
            return this._annotationDrawStart;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Update the colour of the selected annotation.
     * @param currentlySelectedAnnotation
     * @param changedProps
     */
    MarkingStore.prototype.updateAnnotationColourByMarkGroup = function (annotation, markGroupId) {
        var annotations = this.currentExaminerMarksAgainstResponse(markGroupId).annotations;
        for (var i = 0; i < annotations.length; i++) {
            if (annotations[i].clientToken === annotation.clientToken) {
                annotations[i].red = annotation.red;
                annotations[i].blue = annotation.blue;
                annotations[i].green = annotation.green;
                annotations[i].isDirty = true;
                annotations[i].uniqueId = htmlUtilities.guid;
                annotations[i].markingOperation = annotation.markingOperation;
                break;
            }
        }
    };
    /**
     * Update the color of the selected annotation.
     * @param currentlySelectedAnnotation
     * @param changedProps
     */
    MarkingStore.prototype.updateAnnotationColor = function (currentlySelectAnnotation) {
        this.examinerMarksAgainstCurrentResponse.
            examinerMarkGroupDetails[this.currentMarkGroupId].
            allMarksAndAnnotations[0].annotations.map(function (a) {
            if (a.clientToken === currentlySelectAnnotation.clientToken) {
                a.red = currentlySelectAnnotation.red;
                a.blue = currentlySelectAnnotation.blue;
                a.green = currentlySelectAnnotation.green;
                a.isDirty = true;
                a.uniqueId = htmlUtilities.guid;
                a.markingOperation = (a.markingOperation === enums.MarkingOperation.updated) ||
                    (a.markingOperation === enums.MarkingOperation.none) ? enums.MarkingOperation.updated :
                    enums.MarkingOperation.added;
            }
        });
        // Update the marks and annotations save queue status to Await Queueing
        this.updateMarksAndAnnotationsSaveQueueingStatus(this.currentMarkGroupId, true);
    };
    /**
     * This method will returns the marking progress details.
     * @param markGroupId
     */
    MarkingStore.prototype.getMarkingProgressDetails = function (markGroupId) {
        if (this._markingProgressDetails) {
            return this._markingProgressDetails.get(markGroupId);
        }
        return null;
    };
    /**
     * Add annotation to the collection
     * @param addedAnnotation
     */
    MarkingStore.prototype.addAnnotation = function (addedAnnotation, previousMarkIndex) {
        if (!addedAnnotation.isCopyingInRemark && addedAnnotation.stamp === enums.DynamicAnnotation.OnPageComment &&
            (addedAnnotation.comment !== undefined || addedAnnotation.comment !== null || addedAnnotation.comment !== '')) {
            addedAnnotation.isDirty = false;
        }
        // Add current annotation
        if (addedAnnotation.markGroupId === this.selectedQIGMarkGroupId) {
            addedAnnotation.definitiveMark = this.isDefinitiveMarking;
            this.examinerMarksAgainstCurrentResponse.
                examinerMarkGroupDetails[this.selectedQIGMarkGroupId].
                allMarksAndAnnotations[0].annotations.push(addedAnnotation);
        }
        else if (this._isWholeResponse && this.isRelatedMarkGroupId(addedAnnotation.markGroupId)) {
            // for whole response on copying previous marks, this.selectedQIGMarkGroupId is the current markgroupid.
            // we should add the new annotation to the respective markgroupid's collection.
            this.examinerMarksAgainstCurrentResponse.
                examinerMarkGroupDetails[addedAnnotation.markGroupId].
                allMarksAndAnnotations[0].annotations.push(addedAnnotation);
        }
        else {
            // Add previous annotation
            this.examinerMarksAgainstCurrentResponse.
                examinerMarkGroupDetails[this.selectedQIGMarkGroupId].
                allMarksAndAnnotations[previousMarkIndex].annotations.push(addedAnnotation);
        }
        // to avoid saving empty comment in db
        // Don't update queue if the annoation is added via copy marks and annotations. 
        // Any other update or marking progress upadation on navigation will correctly update the queue
        if (addedAnnotation.stamp !== enums.DynamicAnnotation.OnPageComment && !addedAnnotation.isCopyingInRemark) {
            // Update the marks and annotations save queue status to Await Queueing
            this.updateMarksAndAnnotationsSaveQueueingStatus(this._currentMarkGroupId, true);
        }
    };
    /**
     * Updates the queueing status of the mark group record to the collection
     * @param markGroupId
     */
    MarkingStore.prototype.updateMarksAndAnnotationsSaveQueueingStatus = function (markGroupId, queuingStatus, isBackGroundSave) {
        if (isBackGroundSave === void 0) { isBackGroundSave = false; }
        // update the examiner mark data against the response.
        this._examinerMarksAgainstResponse[markGroupId].IsAwaitingToBeQueued = queuingStatus;
        this._examinerMarksAgainstResponse[markGroupId].IsBackGroundSave = isBackGroundSave;
    };
    Object.defineProperty(MarkingStore.prototype, "isMarkingInProgress", {
        /**
         * returns true if marking started, else false
         * @returns
         */
        get: function () {
            return this._isMarkingInProgress;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MarkingStore.prototype, "isMarksSavedToDb", {
        /**
         * returns true if marks have been saved to Db
         * @returns
         */
        get: function () {
            return this._isMarksSavedToDb;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MarkingStore.prototype, "isNextResponse", {
        /**
         * returns true if next response need to open
         * @returns
         */
        get: function () {
            return this._isNextResponse;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MarkingStore.prototype, "isEdited", {
        /**
         * returns true if mark updated
         * @returns
         */
        get: function () {
            return this._isEdited;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MarkingStore.prototype, "currentResponseMode", {
        get: function () {
            return this._currentResponseMode;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MarkingStore.prototype, "currentResponseMarkingProgress", {
        get: function () {
            return this._currentResponseMarkingProgress;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MarkingStore.prototype, "warningNR", {
        /**
         * return collection of NR warning messageS based on NR cc  flag values and optionality .
         */
        get: function () {
            return this._warningNR;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MarkingStore.prototype, "isNavigationThroughMarkScheme", {
        get: function () {
            return this._isNavigationThroughMarkScheme;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * This method will return the tooltip of annotations against a markSchemeId
     * @param markSchemeId
     */
    MarkingStore.prototype.toolTip = function (markSchemeId) {
        var toolTip = '';
        var toolTipInfo = this._toolTipInfo.get(markSchemeId);
        if (toolTipInfo) {
            toolTip = toolTipInfo.markSchemeText;
        }
        return toolTip;
    };
    /**
     * This method will return the mark scheme name against a markSchemeId
     * @param markSchemeId
     */
    MarkingStore.prototype.getMarkSchemeInfo = function (markSchemeId) {
        var markSchemeInfo;
        if (this._toolTipInfo && this._toolTipInfo.size > 0) {
            markSchemeInfo = this._toolTipInfo.get(markSchemeId);
        }
        return markSchemeInfo;
    };
    Object.defineProperty(MarkingStore.prototype, "markingStartTime", {
        /**
         * returns the marking start time.
         * @returns
         */
        get: function () {
            return this._markingStartTime;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MarkingStore.prototype, "getMarkSchemes", {
        /**
         * Returns the markscheme details
         */
        get: function () {
            return this._toolTipInfo;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Get the annotation details against the client token
     * @param {string} clientToken
     * @returns
     */
    MarkingStore.prototype.getAnnotation = function (clientToken) {
        var annotations = this.allAnnotationsAgainstResponse(this.currentMarkGroupId);
        var result;
        if (annotations) {
            annotations.forEach(function (a) {
                if (a.clientToken === clientToken) {
                    result = a;
                }
            });
        }
        return result;
    };
    /**
     * get base color of annotation
     */
    MarkingStore.prototype.getBaseAnnotationColor = function (_markGroupId) {
        var result = '';
        this._examinerMarksAgainstResponse[this.currentMarkGroupId]
            .examinerMarkGroupDetails[this.currentMarkGroupId]
            .allMarksAndAnnotations
            .map(function (exMarksAndAnnotations) {
            if (exMarksAndAnnotations.markGroupId === _markGroupId) {
                result = exMarksAndAnnotations.baseColor;
            }
        });
        return result;
    };
    Object.defineProperty(MarkingStore.prototype, "getCurrentSaveMarksAndAnnotationTriggeringPoint", {
        /**
         * returns the current Save Marks And Annotation Triggering Point.
         * @returns
         */
        get: function () {
            return this._saveMarksAndAnnotationTriggeringPoint;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MarkingStore.prototype, "getPreviousSaveMarksAndAnnotationTriggeringPointOnError", {
        /**
         * returns the previous Save Marks And Annotation Triggering Point.
         * @returns
         */
        get: function () {
            return this._saveMarksAndAnnotationPreviousTriggeringPoint;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * copying previous marks
     * @param markGroupId
     */
    MarkingStore.prototype.copyPreviousMarks = function (markGroupId) {
        var _examinerMarksAndAnnotation;
        // Holds the marks and annotations for the corresponding markgroup in the case of whole response.
        var allMarksAndAnnotationsForTheMarkGroup = this.examinerMarksAgainstCurrentResponse != null ?
            this.examinerMarksAgainstCurrentResponse.examinerMarkGroupDetails[markGroupId].allMarksAndAnnotations : null;
        var allMarksAndAnnotations = JSON.parse(JSON.stringify(allMarksAndAnnotationsForTheMarkGroup));
        if (allMarksAndAnnotations) {
            var allMarksAndAnnotationsWithIsDefault = allMarksAndAnnotations.filter(function (x) { return x.isDefault === true; });
            if (allMarksAndAnnotationsWithIsDefault.length === 1) {
                _examinerMarksAndAnnotation = allMarksAndAnnotationsWithIsDefault[0];
            }
            else {
                _examinerMarksAndAnnotation = allMarksAndAnnotations[1];
            }
        }
        var currentMarksAndAnnotations = this.examinerMarksAgainstCurrentResponse.examinerMarkGroupDetails[markGroupId].
            allMarksAndAnnotations[0];
        // if we reset the marks, then markingOperation is set as deleted 
        // and the next copying adds extra entries as newly added marks
        // reset the examinerMarksCollection to remove the deleted marks
        currentMarksAndAnnotations.examinerMarksCollection = [];
        if (_examinerMarksAndAnnotation) {
            if (currentMarksAndAnnotations.examinerMarksCollection) {
                /* Copying marks */
                _examinerMarksAndAnnotation.examinerMarksCollection.map(function (e) {
                    var _examinerMark = e;
                    _examinerMark.markId = 0;
                    _examinerMark.examinerRoleId = currentMarksAndAnnotations.examinerRoleId;
                    _examinerMark.markGroupId = markGroupId;
                    _examinerMark.rowVersion = '';
                    _examinerMark.version = 0;
                    _examinerMark.isDirty = true;
                    _examinerMark.uniqueId = htmlUtilities.guid;
                    _examinerMark.markingOperation = enums.MarkingOperation.added;
                    currentMarksAndAnnotations.examinerMarksCollection.push(_examinerMark);
                });
            }
        }
    };
    /**
     * copying previous marks - TODO - updating store direct is antipattern. change this in future.
     * @param _markDetails - mark details for updating marking progress
     * @param isAllPagesAnnotated
     * @param markGroupId
     */
    MarkingStore.prototype.updateMarkingProgress = function (_markDetails, isAllPagesAnnotated, markGroupId) {
        this.updateMarkingDetails(markGroupId ? markGroupId : this.selectedQIGMarkGroupId, _markDetails.markingProgress, parseFloat(_markDetails.totalMark), _markDetails.totalMarkedMarkSchemes, _markDetails.isAllNR, isAllPagesAnnotated);
        // queueing status is always saved against current mark group id
        this.updateMarksAndAnnotationsSaveQueueingStatus(this.currentMarkGroupId, true);
    };
    /**
     * Check if any annotation exist.
     */
    MarkingStore.prototype.checkAnyAnnotationExist = function () {
        var _examinerMarksAndAnnotation;
        _examinerMarksAndAnnotation = this.getAllMarksAndAnnotations()[0];
        if (_examinerMarksAndAnnotation.annotations.length > 0) {
            return true;
        }
        else {
            return false;
        }
    };
    /**
     * This method will return true if passed type is a non-recoverable one else return false
     * @param errorType
     */
    MarkingStore.prototype.isNonRecoverableError = function (errorType) {
        switch (errorType) {
            case enums.SaveMarksAndAnnotationErrorCode.MarksAndAnnotationsOutOfDate:
            case enums.SaveMarksAndAnnotationErrorCode.WithdrawnResponse:
            case enums.SaveMarksAndAnnotationErrorCode.ClosedResponse:
            case enums.SaveMarksAndAnnotationErrorCode.AllPagesNotAnnotated:
            case enums.SaveMarksAndAnnotationErrorCode.MarksAndAnnotationsMismatch:
            case enums.SaveMarksAndAnnotationErrorCode.StampsModified:
            case enums.SaveMarksAndAnnotationErrorCode.MandateMarkschemeNotCommented:
            case enums.SaveMarksAndAnnotationErrorCode.NonRecoverableError:
                return true;
            default:
                return false;
        }
    };
    /**
     * Get Default MarksAndAnnotation For Current Remark
     */
    MarkingStore.prototype.getDefaultMarksAndAnnotationForCurrentRemark = function () {
        var allMarksAndAnnotations = this.getAllMarksAndAnnotations();
        if (allMarksAndAnnotations) {
            var allMarksAndAnnotationsWithIsDefault = allMarksAndAnnotations.filter(function (x) { return x.isDefault === true; });
            if (allMarksAndAnnotationsWithIsDefault.length === 1) {
                return allMarksAndAnnotationsWithIsDefault[0];
            }
            else {
                return allMarksAndAnnotations[1];
            }
        }
        return null;
    };
    /**
     * Get Selected MarkSchemeID
     */
    MarkingStore.prototype.getSelectedMarkSchemeID = function () {
        return this._currentExaminerMark.markSchemeId;
    };
    /**
     * Get MarkChangeReason
     * @param markGroupId
     */
    MarkingStore.prototype.getMarkChangeReason = function (markGroupId) {
        var _markChangeReasonInfo = new markChangeReasonInfo();
        _markChangeReasonInfo = this.markChangeReasonData.get(markGroupId);
        if (_markChangeReasonInfo) {
            return _markChangeReasonInfo.markChangeReason;
        }
        else {
            return null;
        }
    };
    /**
     * Get IsMarkChangeReasonUpdated
     * @param markGroupId
     */
    MarkingStore.prototype.getIsMarkChangeReasonUpdated = function (markGroupId) {
        var _markChangeReasonInfo = new markChangeReasonInfo();
        _markChangeReasonInfo = this.markChangeReasonData.get(markGroupId);
        if (_markChangeReasonInfo) {
            return _markChangeReasonInfo.isMarkChangeReasonUpdated;
        }
        else {
            return null;
        }
    };
    /**
     * Set MarkChangeReasonInfo
     */
    MarkingStore.prototype.setMarkChangeReasonInfo = function () {
        var _markChangeReasonInfo = new markChangeReasonInfo();
        _markChangeReasonInfo = this.markChangeReasonData.get(this._currentMarkGroupId);
        if (_markChangeReasonInfo) {
            _markChangeReasonInfo.isMarkChangeReasonUpdated = false;
        }
        else {
            _markChangeReasonInfo = new markChangeReasonInfo();
            _markChangeReasonInfo.isMarkChangeReasonUpdated = false;
            _markChangeReasonInfo.markChangeReason = workListStore.instance.getMarkChangeReason(this._currentMarkGroupId, this._currentResponseMode);
        }
        this.markChangeReasonData = this.markChangeReasonData.set(this.currentMarkGroupId, _markChangeReasonInfo);
    };
    /**
     * Reset MarkChangeReason UpdateStatus
     */
    MarkingStore.prototype.resetMarkChangeReasonUpdateStatus = function (markGroupId) {
        var _markChangeReasonInfo = new markChangeReasonInfo();
        _markChangeReasonInfo = this.markChangeReasonData.get(markGroupId);
        if (_markChangeReasonInfo && _markChangeReasonInfo.isMarkChangeReasonUpdated) {
            _markChangeReasonInfo.isMarkChangeReasonUpdated = false;
            this.markChangeReasonData = this.markChangeReasonData.set(markGroupId, _markChangeReasonInfo);
        }
    };
    /**
     * Update MarkChangeReasons
     * @param _markChangeReason
     */
    MarkingStore.prototype.updateMarkChangeReasons = function (_markChangeReason) {
        var _markChangeReasonInfo = new markChangeReasonInfo();
        _markChangeReasonInfo = this.markChangeReasonData.get(this.currentMarkGroupId);
        if (!_markChangeReasonInfo) {
            _markChangeReasonInfo = new markChangeReasonInfo();
        }
        if (_markChangeReasonInfo.markChangeReason !== _markChangeReason) {
            _markChangeReasonInfo.isMarkChangeReasonUpdated = true;
            _markChangeReasonInfo.markChangeReason = _markChangeReason;
            this.markChangeReasonData = this.markChangeReasonData.set(this.currentMarkGroupId, _markChangeReasonInfo);
        }
    };
    /**
     * Update MarkChangeReason Visibility
     * @param _isMarkChangeReasonVisible
     */
    MarkingStore.prototype.updateMarkChangeReasonVisibility = function (_isMarkChangeReasonVisible) {
        var _markChangeReasonInfo = new markChangeReasonInfo();
        _markChangeReasonInfo = this.markChangeReasonData.get(this.currentMarkGroupId);
        if (_markChangeReasonInfo.isMarkChangeReasonVisible !== _isMarkChangeReasonVisible) {
            _markChangeReasonInfo.isMarkChangeReasonVisible = _isMarkChangeReasonVisible;
            if (!_markChangeReasonInfo.isMarkChangeReasonVisible) {
                _markChangeReasonInfo.isMarkChangeReasonUpdated = false;
                _markChangeReasonInfo.markChangeReason = undefined;
            }
            this.markChangeReasonData = this.markChangeReasonData.set(this.currentMarkGroupId, _markChangeReasonInfo);
        }
    };
    /**
     * Check isMarkChangeReasonVisible
     * @param markGroupId
     */
    MarkingStore.prototype.isMarkChangeReasonVisible = function (markGroupId) {
        var _markChangeReasonInfo = new markChangeReasonInfo();
        _markChangeReasonInfo = this.markChangeReasonData.get(markGroupId);
        if (_markChangeReasonInfo) {
            return _markChangeReasonInfo.isMarkChangeReasonVisible;
        }
        else {
            return null;
        }
    };
    Object.defineProperty(MarkingStore.prototype, "getMarksAndAnnotationVisibilityDetails", {
        get: function () {
            return this.marksAndAnnotationVisibilityDetails;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MarkingStore.prototype, "getExaminerMarksAgainstResponse", {
        get: function () {
            return this._examinerMarksAgainstResponse;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MarkingStore.prototype, "zoomWidth", {
        /**
         * Gets a value indicating zoom width
         * @returns
         */
        get: function () {
            return this._zoomToWidth;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MarkingStore.prototype, "contextMenuDisplayStatus", {
        /*returns the status of context menu*/
        get: function () {
            return this.isContextMenuVisible;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MarkingStore.prototype, "isNonNumeric", {
        /**
         * returns whether current markscheme is non numeric or not
         */
        get: function () {
            return this._isNonNumeric;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * returns all annotations aganist current response.
     */
    MarkingStore.prototype.allAnnotationsAganistResponse = function (isLinkedAnnotation) {
        var markItem = this._examinerMarksAgainstResponse[this.currentMarkGroupId];
        var showDefAnnotationsOnly = this.showDefinitiveMarksOnly();
        var annotation = [];
        if (markItem && isLinkedAnnotation && this._isWholeResponse) {
            for (var examinerMarkGroupDetails in markItem.examinerMarkGroupDetails) {
                if (examinerMarkGroupDetails && markItem.examinerMarkGroupDetails[examinerMarkGroupDetails]
                    .allMarksAndAnnotations[0].annotations.length > 0) {
                    annotation.push(markItem.examinerMarkGroupDetails[examinerMarkGroupDetails]
                        .allMarksAndAnnotations[0].annotations);
                }
            }
        }
        else {
            if (showDefAnnotationsOnly) {
                annotation.push(this._examinerMarksAgainstResponse[this.currentMarkGroupId]
                    .examinerMarkGroupDetails[this.selectedQIGMarkGroupId]
                    .allMarksAndAnnotations[0].annotations.filter(function (annotation) {
                    return annotation.definitiveMark === true;
                }));
            }
            else {
                annotation.push(this._examinerMarksAgainstResponse[this.currentMarkGroupId]
                    .examinerMarkGroupDetails[this.selectedQIGMarkGroupId]
                    .allMarksAndAnnotations[0].annotations);
            }
        }
        return annotation;
    };
    Object.defineProperty(MarkingStore.prototype, "currentOperationMode", {
        /**
         * Returns the current operation mode.
         */
        get: function () {
            return this._operationMode;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Checks whether the response is dirty
     * @param markGroupId
     */
    MarkingStore.prototype.isResponseDirty = function (parentMarkGroupId, markGroupId) {
        // TODO: Changes needed for Whole response to check all markGroupIDs for dirty marks
        var dirtyMarks = this.getDirtyExaminerMarks(parentMarkGroupId, markGroupId);
        var dirtyAnnotations = this.getDirtyExaminerAnnotations(parentMarkGroupId, markGroupId);
        return ((dirtyMarks && dirtyMarks.length > 0) ||
            (dirtyAnnotations && dirtyAnnotations.length > 0));
    };
    Object.defineProperty(MarkingStore.prototype, "previousMarkListColumnVisible", {
        /**
         * Returns the whether the previous mark list column visible or not
         */
        get: function () {
            return this._isPreviousMarkListColumnVisible;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MarkingStore.prototype, "selectedDisplayId", {
        /**
         * This method will returns the selected display ID
         */
        get: function () {
            return this._selectedDisplayId;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MarkingStore.prototype, "currentlyLinkedZonePageNumber", {
        /**
         * Returns the currently linked page number
         */
        get: function () {
            return this.linkWholePageNumber;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * resets the linked zone page number.
     */
    MarkingStore.prototype.resetLinkedZonePageNumber = function () {
        this.linkWholePageNumber = 0;
    };
    /**
     * Returns whether the response is editable or not.
     */
    MarkingStore.prototype.isResponseEditable = function (responseMode) {
        var isEditable = true;
        var markSchemeGroupId = qigStore.instance.selectedQIGForMarkerOperation ?
            qigStore.instance.selectedQIGForMarkerOperation.markSchemeGroupId : 0;
        var updatePendingResponsesWhenSuspendedCCOn = ccHelper.getCharacteristicValue(ccNames.UpdatePendingResponsesWhenSuspended, markSchemeGroupId).toLowerCase() === 'true';
        if (examinerStore.instance.getMarkerInformation &&
            examinerStore.instance.getMarkerInformation.approvalStatus === enums.ExaminerApproval.Suspended
            && responseMode === enums.ResponseMode.pending
            && !updatePendingResponsesWhenSuspendedCCOn) {
            isEditable = false;
        }
        if (responseMode === enums.ResponseMode.closed ||
            (standardisationsetupstore.instance.selectedStandardisationSetupWorkList === enums.StandardisationSetup.UnClassifiedResponse &&
                standardisationsetupstore.instance.fetchStandardisationResponseData(this.selectedDisplayId).hasDefinitiveMark !== true) ||
            standardisationsetupstore.instance.selectedStandardisationSetupWorkList === enums.StandardisationSetup.SelectResponse) {
            isEditable = false;
        }
        return isEditable;
    };
    /**
     * Returns true, if the selected response is Unclassified and its editable.
     */
    MarkingStore.prototype.showDefinitiveMarksOnly = function () {
        return (standardisationsetupstore.instance.selectedStandardisationSetupWorkList ===
            enums.StandardisationSetup.UnClassifiedResponse) &&
            standardisationsetupstore.instance.fetchStandardisationResponseData(this.selectedDisplayId).hasDefinitiveMark === true;
    };
    /**
     * Set Supervisor Remark Decision Info
     */
    MarkingStore.prototype.setSupervisorRemarkDecision = function () {
        var _supervisorRemarkDecision = new supervisorRemarkDecision();
        _supervisorRemarkDecision = this.supervisorRemarkDecisionData.get(this._currentMarkGroupId);
        if (_supervisorRemarkDecision) {
            _supervisorRemarkDecision.isSRDReasonUpdated = false;
        }
        else {
            _supervisorRemarkDecision = new supervisorRemarkDecision();
            _supervisorRemarkDecision = workListStore.instance.getSupervisorRemarkDecision(this._currentMarkGroupId, this.currentResponseMode);
        }
        this.supervisorRemarkDecisionData = this.supervisorRemarkDecisionData.set(this.currentMarkGroupId, _supervisorRemarkDecision);
    };
    /**
     * Update Supervisor Remark Decision Info
     * @param supervisorRemarkDecision
     */
    MarkingStore.prototype.updateSupervisorRemarkDecision = function (_supervisorRemarkDecision) {
        var _supervisorRemarkDecisionInfo = new supervisorRemarkDecision();
        _supervisorRemarkDecisionInfo = this.supervisorRemarkDecisionData.get(this.currentMarkGroupId);
        if (!_supervisorRemarkDecisionInfo) {
            _supervisorRemarkDecisionInfo = new supervisorRemarkDecision();
        }
        if (_supervisorRemarkDecisionInfo.supervisorRemarkFinalMarkSetID !== _supervisorRemarkDecision.supervisorRemarkFinalMarkSetID ||
            _supervisorRemarkDecisionInfo.supervisorRemarkMarkChangeReasonID !==
                _supervisorRemarkDecision.supervisorRemarkMarkChangeReasonID) {
            _supervisorRemarkDecisionInfo.supervisorRemarkFinalMarkSetID = _supervisorRemarkDecision.supervisorRemarkFinalMarkSetID;
            _supervisorRemarkDecisionInfo.supervisorRemarkMarkChangeReasonID =
                _supervisorRemarkDecision.supervisorRemarkMarkChangeReasonID;
            _supervisorRemarkDecisionInfo.isSRDReasonUpdated = true;
            this.supervisorRemarkDecisionData = this.supervisorRemarkDecisionData.set(this.currentMarkGroupId, _supervisorRemarkDecisionInfo);
        }
    };
    /**
     * Reset supervisor remark decision UpdateStatus
     */
    MarkingStore.prototype.resetSupervisorRemakDecisionUpdateStatus = function () {
        var _supervisorRemarkDecisionInfo = new supervisorRemarkDecision();
        _supervisorRemarkDecisionInfo = this.supervisorRemarkDecisionData.get(this.currentMarkGroupId);
        if (_supervisorRemarkDecisionInfo.isSRDReasonUpdated) {
            _supervisorRemarkDecisionInfo.isSRDReasonUpdated = false;
            this.supervisorRemarkDecisionData = this.supervisorRemarkDecisionData.set(this.currentMarkGroupId, _supervisorRemarkDecisionInfo);
        }
    };
    /**
     * Get SupervisorRemarkDecision
     * @param markGroupId
     */
    MarkingStore.prototype.getSupervisorRemarkDecision = function (markGroupId) {
        var _supervisorRemarkDecisionInfo = new supervisorRemarkDecision();
        _supervisorRemarkDecisionInfo = this.supervisorRemarkDecisionData.get(markGroupId);
        if (_supervisorRemarkDecisionInfo) {
            return _supervisorRemarkDecisionInfo;
        }
        else {
            return null;
        }
    };
    /**
     * Get isSRDReasonUpdated
     * @param markGroupId
     */
    MarkingStore.prototype.getIsSRDReasonUpdated = function (markGroupId) {
        var _supervisorRemarkDecision = new supervisorRemarkDecision();
        _supervisorRemarkDecision = this.supervisorRemarkDecisionData.get(markGroupId);
        if (_supervisorRemarkDecision) {
            return _supervisorRemarkDecision.isSRDReasonUpdated;
        }
        else {
            return null;
        }
    };
    /**
     * Get SupervisorRemarkDecisionType
     * @param SupervisorRemarkDecisionType
     */
    MarkingStore.prototype.getSupervisorRemarkDecisionType = function (remarkDecision) {
        var _supervisorRemarkDecision = new supervisorRemarkDecision();
        switch (remarkDecision) {
            case enums.SupervisorRemarkDecisionType.none:
                _supervisorRemarkDecision.supervisorRemarkFinalMarkSetID = 0;
                _supervisorRemarkDecision.supervisorRemarkMarkChangeReasonID = 0;
                break;
            case enums.SupervisorRemarkDecisionType.originalmarks:
                _supervisorRemarkDecision.supervisorRemarkFinalMarkSetID = 2;
                _supervisorRemarkDecision.supervisorRemarkMarkChangeReasonID = 3;
                break;
            case enums.SupervisorRemarkDecisionType.judgementaloutsidetolerance:
                _supervisorRemarkDecision.supervisorRemarkFinalMarkSetID = 1;
                _supervisorRemarkDecision.supervisorRemarkMarkChangeReasonID = 2;
                break;
            case enums.SupervisorRemarkDecisionType.nonjudgementalerror:
                _supervisorRemarkDecision.supervisorRemarkFinalMarkSetID = 1;
                _supervisorRemarkDecision.supervisorRemarkMarkChangeReasonID = 1;
                break;
        }
        return _supervisorRemarkDecision;
    };
    /**
     * Get SupervisorRemarkDecisionType
     * @param SupervisorRemarkDecision
     */
    MarkingStore.prototype.convertSupervisorRemarkDecisionType = function () {
        var _supervisorRemarkDecision = this.getSupervisorRemarkDecision(this.currentMarkGroupId);
        var supervisorRemarkFinalMarkSetID = _supervisorRemarkDecision.supervisorRemarkFinalMarkSetID;
        var supervisorRemarkMarkChangeReasonID = _supervisorRemarkDecision.supervisorRemarkMarkChangeReasonID;
        if (supervisorRemarkFinalMarkSetID === 2 && supervisorRemarkMarkChangeReasonID === 3) {
            return enums.SupervisorRemarkDecisionType.originalmarks;
        }
        else if (supervisorRemarkFinalMarkSetID === 1 && supervisorRemarkMarkChangeReasonID === 2) {
            return enums.SupervisorRemarkDecisionType.judgementaloutsidetolerance;
        }
        else if (supervisorRemarkFinalMarkSetID === 1 && supervisorRemarkMarkChangeReasonID === 1) {
            return enums.SupervisorRemarkDecisionType.nonjudgementalerror;
        }
        else {
            return enums.SupervisorRemarkDecisionType.none;
        }
    };
    /**
     * Remove enhanced off page comment
     * @param removeEnhancedOffPageCommentsList list of
     */
    MarkingStore.prototype.removeEnhancedOffPageComment = function (removeEnhancedOffPageCommentsList) {
        var _this = this;
        // Denotes if the response is to be queued for save after removing the annotation
        // If the removed annotation is a newly put annotation that doesn't already exist
        // in the database, then no need to queue the response for saving process
        var isResponseToBeQueuedForSave = false;
        // Denotes the list of newly added annotations that are removed
        // and doesn't already exist in the database
        var newlyAddedEnhancedOffPageComments = [];
        removeEnhancedOffPageCommentsList.map(function (clientToken) {
            _this.examinerMarksAgainstCurrentResponse.
                examinerMarkGroupDetails[_this.selectedQIGMarkGroupId].
                allMarksAndAnnotations[0].enhancedOffPageComments.map(function (e) {
                if (e.clientToken === clientToken) {
                    // If enhancedOffPageComment id exists, then that means that the enhancedOffPageComment
                    // already exists in the database, hence just set the isDirty flag to true
                    // and set the 'isResponseToBeQueuedForSave' flag to true for
                    // adding the response to the save marks and annotations queue
                    if (e.enhancedOffPageCommentId !== 0) {
                        isResponseToBeQueuedForSave = true;
                        e.isDirty = true;
                        e.uniqueId = htmlUtilities.guid;
                        e.markingOperation = enums.MarkingOperation.deleted;
                    }
                    else {
                        // If annotation id doesn't exist, then push the annotation to the
                        // newly added annotations list after setting the same to dirty
                        e.isDirty = true;
                        e.uniqueId = htmlUtilities.guid;
                        e.markingOperation = enums.MarkingOperation.deleted;
                        newlyAddedEnhancedOffPageComments.push(e.clientToken);
                    }
                }
            });
        });
        // If there are enhancedOffPageComments in the newly added enhancedOffPageComments list,
        // then simply remove it from the actual enhancedOffPageComments list in the
        // marks and annotations collection in the store
        if (newlyAddedEnhancedOffPageComments.length > 0) {
            for (var i = 0; i < newlyAddedEnhancedOffPageComments.length; i++) {
                var index = this.findIndex(newlyAddedEnhancedOffPageComments[i]);
                if (index >= 0) {
                    this.examinerMarksAgainstCurrentResponse.
                        examinerMarkGroupDetails[this.currentMarkGroupId].
                        allMarksAndAnnotations[0].enhancedOffPageComments.splice(index, 1);
                }
            }
        }
        // Push the response to the queue only if a save is definitely required
        // because of removing an annotation which was already in the database
        if (isResponseToBeQueuedForSave) {
            // Update the marks and annotations save queue status to Await Queueing
            this.updateMarksAndAnnotationsSaveQueueingStatus(this.currentMarkGroupId, true);
        }
    };
    /**
     * Update enhanced off page comment when there are changes
     * @param removeEnhancedOffPageCommentsList list of
     */
    MarkingStore.prototype.updateEnhancedOffPageComment = function (clientToken, commentText, selectedMarkSchemeId, selectedFileId) {
        this.examinerMarksAgainstCurrentResponse.
            examinerMarkGroupDetails[this.selectedQIGMarkGroupId].
            allMarksAndAnnotations[0].enhancedOffPageComments.map(function (e) {
            if (e.clientToken === clientToken) {
                e.isDirty = true;
                e.uniqueId = htmlUtilities.guid;
                e.markingOperation = e.enhancedOffPageCommentId === 0 ? e.markingOperation : enums.MarkingOperation.updated;
                e.comment = commentText;
                e.markSchemeId = selectedMarkSchemeId;
                e.fileId = selectedFileId;
            }
        });
        // Update the marks and annotations save queue status to Await Queueing
        this.updateMarksAndAnnotationsSaveQueueingStatus(this.currentMarkGroupId, true);
    };
    /**
     * Add enhanced off page comment
     * @param commentText
     * @param selectedMarkSchemeId
     * @param selectedFileId
     */
    MarkingStore.prototype.addEnhancedOffPageComment = function (commentText, selectedMarkSchemeId, selectedFileId) {
        var enhancedOffPageComment = {
            enhancedOffPageCommentId: 0,
            markGroupId: this.selectedQIGMarkGroupId,
            clientToken: htmlUtilities.guid,
            comment: commentText,
            examinerRoleId: qigStore.instance.selectedQIGForMarkerOperation.examinerRoleId,
            markSchemeId: selectedMarkSchemeId === 0 ? null : selectedMarkSchemeId,
            fileId: selectedFileId === 0 ? null : selectedFileId,
            uniqueId: htmlUtilities.guid,
            isDirty: true,
            markSchemeGroupId: qigStore.instance.selectedQIGForMarkerOperation.markSchemeGroupId,
            markingOperation: enums.MarkingOperation.added,
            isDefinitive: this.isDefinitiveMarking
        };
        this.examinerMarksAgainstCurrentResponse.
            examinerMarkGroupDetails[this.selectedQIGMarkGroupId].
            allMarksAndAnnotations[0].enhancedOffPageComments.push(enhancedOffPageComment);
        // Update the marks and annotations save queue status to Await Queueing
        this.updateMarksAndAnnotationsSaveQueueingStatus(this.currentMarkGroupId, true);
    };
    /**
     * Adds bookmark to the current marks collection
     * @param bookmark bookmark to add
     */
    MarkingStore.prototype.addBookmark = function (bookmark) {
        this.examinerMarksAgainstCurrentResponse.
            examinerMarkGroupDetails[this.selectedQIGMarkGroupId].
            allMarksAndAnnotations[0].bookmarks.push(bookmark);
        // Update the marks and annotations save queue status to Await Queueing
        this.updateMarksAndAnnotationsSaveQueueingStatus(this.currentMarkGroupId, true);
    };
    /**
     * Update bookmark name
     * @param bookmarkName - Updated bookmark name
     * @param bookmarkClientToken - Client token of the bookmark, which need to be updated
     */
    MarkingStore.prototype.updateBookmarkName = function (bookmarkName, bookmarkClientToken) {
        this.examinerMarksAgainstCurrentResponse.
            examinerMarkGroupDetails[this.selectedQIGMarkGroupId].
            allMarksAndAnnotations[0].bookmarks.map(function (e) {
            if (e.clientToken === bookmarkClientToken) {
                e.isDirty = true;
                e.comment = bookmarkName;
            }
        });
        // Update the marks and annotations save queue status to Await Queueing
        this.updateMarksAndAnnotationsSaveQueueingStatus(this.currentMarkGroupId, true);
    };
    Object.defineProperty(MarkingStore.prototype, "isAllFilesViewedStatusUpdated", {
        /**
         * get is all files viewed status
         * @readonly
         * @type {boolean}
         * @memberof MarkingStore
         */
        get: function () {
            return this._isAllFilesViewedStatusUpdated;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MarkingStore.prototype, "hasPreviousMarks", {
        /**
         * returns boolean whether response is remark or not.
         */
        get: function () {
            return this._examinerMarksAgainstResponse[this._currentMarkGroupId].
                examinerMarkGroupDetails[this._currentMarkGroupId].
                allMarksAndAnnotations.length > 1;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MarkingStore.prototype, "isMarksAndMarkSchemesLoadedFailed", {
        /**
         * retuns if the marks and mark schemes loaded are or not
         */
        get: function () {
            return !this._isMarksAndMarkSchemesLoadedFailed;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Get the examiner role id based on QIG to RIG mappings for whole response
     */
    MarkingStore.prototype.getExaminerRoleQIGtoRIGMap = function (parentMarkGroupId, markGroupId) {
        var examinerRoleId = qigStore.instance.selectedQIGForMarkerOperation.examinerRoleId;
        var qigToRigMappings = this.qigToRigMappings(parentMarkGroupId);
        if (qigToRigMappings) {
            qigToRigMappings.map(function (value, key) {
                if (value.markGroupId === markGroupId) {
                    examinerRoleId = value.examinerRoleId;
                }
            });
        }
        return examinerRoleId;
    };
    /**
     * Selected QIG Examinor Role Id of Logged in user(For teammanagement)
     * @param markSchemeGroupId
     */
    MarkingStore.prototype.getSelectedQIGExaminerRoleIdOfLoggedInUser = function (markSchemeGroupId) {
        var loggedInSelectedExaminerRoleId = qigStore.instance.getSelectedQIGForTheLoggedInUser.examinerRoleId;
        var relatedQigList = qigStore.instance.relatedQigList;
        if (relatedQigList) {
            relatedQigList.map(function (value, key) {
                if (value.markSchemeGroupId === markSchemeGroupId) {
                    loggedInSelectedExaminerRoleId = value.examinerRoleId;
                }
            });
        }
        return loggedInSelectedExaminerRoleId;
    };
    /**
     * Get the mark Scheme Group id based on QIG to RIG mappings for whole response
     */
    MarkingStore.prototype.getMarkSchemeGroupIdQIGtoRIGMap = function (parentMarkGroupId, markGroupId) {
        var markSchemeGroupId = qigStore.instance.selectedQIGForMarkerOperation.markSchemeGroupId;
        var qigToRigMappings = this.qigToRigMappings(parentMarkGroupId);
        if (qigToRigMappings) {
            qigToRigMappings.map(function (value, key) {
                if (value.markGroupId === markGroupId) {
                    markSchemeGroupId = value.markSchemeGroupId;
                }
            });
        }
        return markSchemeGroupId;
    };
    /**
     * Get the QIG to RIG mappings
     */
    MarkingStore.prototype.getMarkGroupIdQIGtoRIGMap = function (markSchemeGroupId) {
        var markGroupId = this.currentMarkGroupId;
        var qigToRigMappings = this.qigToRigMappings(this._currentMarkGroupId);
        if (qigToRigMappings) {
            qigToRigMappings.map(function (value, key) {
                if (value.markSchemeGroupId === markSchemeGroupId) {
                    markGroupId = value.markGroupId;
                }
            });
        }
        return markGroupId;
    };
    /**
     * Get the related markSchemeGroupIds for a whole response
     */
    MarkingStore.prototype.getRelatedWholeResponseQIGIds = function () {
        var markSchemeGroupIds = [];
        var qigToRigMappings = this.qigToRigMappings(this._currentMarkGroupId);
        // Add related markSchemeGroupIds
        if (qigToRigMappings !== undefined && qigToRigMappings.count() > 0) {
            qigToRigMappings.map(function (value, key) {
                markSchemeGroupIds.push(value.markSchemeGroupId);
            });
        }
        return markSchemeGroupIds;
    };
    /**
     * Get the related examinerRoleIds for a whole response
     */
    MarkingStore.prototype.getRelatedWholeResponseExaminerRoleIds = function () {
        var examinerRoleIds = [];
        var qigToRigMappings = this.qigToRigMappings(this._currentMarkGroupId);
        // Add related examinerRoleIds
        if (qigToRigMappings !== undefined && qigToRigMappings.count() > 0) {
            qigToRigMappings.map(function (value, key) {
                examinerRoleIds.push(value.examinerRoleId);
            });
        }
        return examinerRoleIds;
    };
    /**
     * Get the related details of all QIGs in a whole response
     */
    MarkingStore.prototype.qigToRigMappings = function (markGroupId) {
        var qigToRigMappings = this._examinerMarksAgainstResponse[markGroupId] ?
            this._examinerMarksAgainstResponse[markGroupId].wholeResponseQIGToRIGMapping : undefined;
        return qigToRigMappings;
    };
    Object.defineProperty(MarkingStore.prototype, "selectedQIGMarkSchemeGroupId", {
        /**
         * Get the selected QIGs mark scheme group Id
         */
        get: function () {
            return (this._selectedQIGMarkSchemeGroupId && this._isWholeResponse) ?
                this._selectedQIGMarkSchemeGroupId : qigStore.instance.selectedQIGForMarkerOperation.markSchemeGroupId;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MarkingStore.prototype, "selectedQIGMarkGroupId", {
        /**
         * Get the selected QIGs mark group Id
         */
        get: function () {
            return (this._selectedQIGMarkGroupId && this._isWholeResponse) ?
                this._selectedQIGMarkGroupId : this._currentMarkGroupId;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MarkingStore.prototype, "selectedQIGExaminerRoleId", {
        /**
         * Get the selected QIGs examiner role Id
         */
        get: function () {
            return (this._selectedQIGExaminerRoleId && this._isWholeResponse) ?
                this._selectedQIGExaminerRoleId : qigStore.instance.selectedQIGForMarkerOperation.examinerRoleId;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MarkingStore.prototype, "selectedQIGExaminerRoleIdOfLoggedInUser", {
        get: function () {
            return (this._selectedQIGExaminerRoleIdOfLoggedInUser && this._isWholeResponse) ?
                this._selectedQIGExaminerRoleIdOfLoggedInUser : qigStore.instance.getSelectedQIGForTheLoggedInUser.examinerRoleId;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Clear the marks and annotation in store, for the related RIGs of whole response.
     * @param markGroupId
     */
    MarkingStore.prototype.clearMarksAndAnnotationsForRelatedRigs = function (markGroupId) {
        var _this = this;
        var relatedMarkGroupIds = workListStore.instance.getRelatedMarkGroupIdsForWholeResponse(markGroupId);
        if (relatedMarkGroupIds.length > 0) {
            relatedMarkGroupIds.forEach(function (mgid) {
                if (_this.isMarksLoaded(mgid)) {
                    _this._examinerMarksAgainstResponse[mgid] = null;
                }
            });
            // Clear worklist cache
            this.storageAdapterHelper.clearStorageArea('worklist');
        }
    };
    /**
     * set remarkrequesttype for each qigs annotations
     */
    MarkingStore.prototype.setRemarkRequestType = function (markGroupId) {
        if (this._examinerMarksAgainstResponse) {
            var markItem = this._examinerMarksAgainstResponse[markGroupId];
            if (markItem) {
                var _loop_3 = function(item) {
                    if (item) {
                        // Loop through annotations of all QIGs
                        var allMarksAndAnnotations_1 = markItem.examinerMarkGroupDetails[item]
                            .allMarksAndAnnotations[0];
                        var annotations = allMarksAndAnnotations_1.annotations;
                        if (annotations) {
                            annotations.filter(function (annotation) {
                                // set the remark request type for the annotations
                                annotation.remarkRequestTypeId = allMarksAndAnnotations_1.remarkRequestTypeId;
                            });
                        }
                    }
                };
                for (var item in markItem.examinerMarkGroupDetails) {
                    _loop_3(item);
                }
            }
        }
    };
    /**
     * Get the related MarkGroupIds for a whole response
     */
    MarkingStore.prototype.getRelatedWholeResponseMarkGroupIds = function () {
        var markGroupIds = [];
        var qigToRigMappings = this.qigToRigMappings(this._currentMarkGroupId);
        // Add related markSchemeGroupIds
        if (qigToRigMappings !== undefined && qigToRigMappings.count() > 0) {
            qigToRigMappings.map(function (value, key) {
                markGroupIds.push(value.markGroupId);
            });
        }
        return markGroupIds;
    };
    /**
     * is the given mark group id is a related mark group id of the current response
     * @param markGroupId
     */
    MarkingStore.prototype.isRelatedMarkGroupId = function (markGroupId) {
        var relatedMarkGroupIds = this.getRelatedWholeResponseMarkGroupIds();
        if (relatedMarkGroupIds) {
            return relatedMarkGroupIds.filter(function (mgId) { return mgId === markGroupId; }).length > 0;
        }
        return false;
    };
    /**
     * get mark details for the selected QIG node in tree. (Whole response scenario)
     * @param tree markscheme Treeview
     * @param markSchemeGroupId qig id
     */
    MarkingStore.prototype.getSelectedQigMarkingProgressDetails = function (tree, markSchemeGroupId) {
        var item = tree.treeViewItemList.filter(function (treeItem, key) { return (treeItem.itemType === enums.TreeViewItemType.QIG && treeItem.markSchemeGroupId === markSchemeGroupId); }).first();
        var markDetails = {
            markingProgress: item.markingProgress,
            maximumMark: item.maximumNumericMark,
            totalMark: item.totalMarks,
            totalMarkedMarkSchemes: item.markCount,
            isAllNR: item.isAllNR
        };
        return markDetails;
    };
    Object.defineProperty(MarkingStore.prototype, "isRotating", {
        /**
         * Is the response is rotating or not
         */
        get: function () {
            return this._isRotating;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MarkingStore.prototype, "currentQuestionItemQuestionTagId", {
        /**
         * get the current question item's of question tag id
         */
        get: function () {
            return this.currentQuestionItemInfo ? this.currentQuestionItemInfo.questionTagId : undefined;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MarkingStore.prototype, "previousQuestionItemQuestionTagId", {
        /**
         * get previous question item's question tag id
         */
        get: function () {
            return this._previousQuestionItemQuestionTagId;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MarkingStore.prototype, "isDefinitiveMarking", {
        /**
         * Returns true if definitive marking started for the current response
         */
        get: function () {
            return standardisationsetupstore.instance.selectedStandardisationSetupWorkList === enums.StandardisationSetup.UnClassifiedResponse
                && standardisationsetupstore.instance.fetchStandardisationResponseData(this.selectedDisplayId).hasDefinitiveMark === true;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MarkingStore.prototype, "previousAnswerItemId", {
        /**
         * get previous answer item ID
         */
        get: function () {
            return this._previousAnswerItemId;
        },
        enumerable: true,
        configurable: true
    });
    // Response marks retrieved.
    MarkingStore.RETRIEVE_MARKS_EVENT = 'ResponseMarksRetrieved';
    // current question item changed.
    MarkingStore.CURRENT_QUESTION_ITEM_CHANGE_EVENT = 'CurrentQuestionItemChanged';
    // current question item changed.
    MarkingStore.QIG_CHANGED_IN_WHOLE_RESPONSE_EVENT = 'QIgChangedInWholeResponse';
    // When moving away from response.
    MarkingStore.SAVE_AND_NAVIGATE_EVENT = 'SaveAndNavigate';
    // When response mode is changed.
    MarkingStore.UPDATE_WAVY_ANNOTATION_EVENT = 'UpdateWavyAnnotation';
    MarkingStore.MARK_UPDATED_EVENT = 'MarkUpdated';
    // marks and annotations are saved.
    MarkingStore.SAVE_MARKS_AND_ANNOTATIONS_EVENT = 'MarksAndAnnotationsSaved';
    MarkingStore.REMOVE_ANNOTATION = 'RemoveAnnotation';
    /* For emiting the event while changing the color*/
    MarkingStore.UPDATE_ANNOTATION_COLOR = 'UpdateAnnotation';
    /* For emiting the event */
    MarkingStore.ANNOTATION_ADDED = 'AnnotationAdded';
    /* For valid annotation mark*/
    MarkingStore.VALID_ANNOTATION_MARK = 'annotation mark is valid';
    /* For mark by annotation added*/
    MarkingStore.ADD_MARK_BY_ANNOTATION = 'mark by annotation added';
    /* For removing mark by annotation */
    MarkingStore.REMOVE_MARKS_BY_ANNOTATION = 'remove mark by annotation';
    /* this event is to indicate that the mark updated and the selected item is not changed.
     * so we need to rerender the mark buttons to reflect the change */
    MarkingStore.MARK_UPDATED_WITHOUT_NAVIGATION_EVENT = 'MarkUpdatedWithOutNavigation';
    /* Emitting after triggering the save of marks and annotations */
    MarkingStore.TRIGGER_SAVING_MARKS_AND_ANNOTATIONS_EVENT = 'TriggerSavingMarksAndAnnotations';
    /* Emitting after the mark has been saved */
    MarkingStore.MARK_SAVED = 'MarkSaved';
    /* Emitting after the mark has been saved and ready to navigate away from the current response*/
    MarkingStore.READY_TO_NAVIGATE = 'ReadyToNavigate';
    MarkingStore.ANNOTATION_UPDATED = 'AnnotationUpdated';
    /* Emitting after setting non-recoverable error */
    MarkingStore.SET_NON_RECOVERABLE_ERROR_EVENT = 'SetNonRecoverableError';
    /* event for triggering navigation after save and mark confirmation */
    MarkingStore.MARK_SCHEME_NAVIGATION = 'MarkSchemeNavigation';
    /* Emitting an event to reset the mark and annotation associated to current markscheme. */
    MarkingStore.RESET_MARK_AND_ANNOTATION = 'ResetMarkAndAnnotation';
    /* Emitting an event to reset the mark and annotation associated to current markscheme. */
    MarkingStore.SET_MARK_ENTRY_SELECTED = 'SetMarkEntrySelected';
    /* Notify the mark updated.
     * NB: This will trigger in each keystroke
     */
    MarkingStore.NOTIFY_MARK_UPDATED = 'NotifyMarkChanged';
    MarkingStore.CONTEXT_MENU_ACTION_TRIGGERED = 'ContextMenuActionTriggered';
    /*Emit after clicking the zoom settings*/
    MarkingStore.ZOOM_SETTINGS = 'ZoomSettings';
    MarkingStore.ANNOTATION_DRAW = 'Annotation Drawing';
    MarkingStore.PANEL_WIDTH = 'Panel Width';
    MarkingStore.UPDATE_PANEL_WIDTH = 'Update Panel Width';
    MarkingStore.DEFAULT_PANEL_WIDTH = 'Default Panel Width';
    MarkingStore.MARKSCHEME_PANEL_RESIZE_CLASSNAME = 'Markscheme panel resize classname';
    // Emit when the response is in grace and not fully marked.
    MarkingStore.SHOW_GRACE_PERIOD_NOT_FULLY_MARKED_MESSAGE = 'ResponseInGracePeriodNotFullyMarked';
    MarkingStore.SHOW_ALL_PAGE_NOT_ANNOTATED_MESSAGE = 'ResponseWithNotFullyAnnotated';
    MarkingStore.UPDATE_MARK_AS_NR_FOR_UNMARKED_ITEMS = 'UpdateMarkAsNRForUmarkedMarkScheme';
    MarkingStore.DELETE_COMMENT_POPUP = 'DeleteCommentPopUp';
    // Emit when the popup is closed
    MarkingStore.POPUP_CLOSED_EVENT = 'PopupClosed';
    // Emit when response view is changed between FullResponse/Marking
    MarkingStore.RESPONSE_VIEW_MODE_CHANGED = 'ResponseViewModeChange';
    // Emit when marks and annotations visibility changed
    MarkingStore.MARKS_AND_ANNOTATION_VISIBILITY_CHANGED = 'MarksAndAnnotationVisibilityChanged';
    // Emit when quality feeedback accepted
    MarkingStore.ACCEPT_QUALITY_ACTION_COMPLETED = 'AcceptQualityFeedbackActionCompleted';
    MarkingStore.SHOW_MARK_CHANGE_REASON_NEEDED_MESSAGE = 'ShowMarkChangeReasonNeededMessage';
    MarkingStore.MARK_CHANGE_REASON_UPDATED = 'MarkChangeReasonUpdated';
    //Emit when Supervisor Remark Decision Updated
    MarkingStore.SUPERVISOR_REMARK_DECISION_UPDATED = 'SupervisorRemarkDecisionUpdated';
    MarkingStore.OPEN_MARK_CHANGE_REASON = 'OpenMarkChangeReason';
    MarkingStore.OPEN_SUPERVISOR_REMARK_DECISION = 'OpenSuperVisorRemarkDecision';
    MarkingStore.PREVIOUS_MARKS_AND_ANNOTATIONS_COPIED = 'PreviousMarksAnnotationCopied';
    MarkingStore.ACETATE_POSITION_UPDATED = 'AcetatePositionUpdated';
    // When moving away from response.
    MarkingStore.SAVE_AND_NAVIGATE_INITIATED_EVENT = 'SaveAndNavigateInitiatedEvent';
    // When moving dynamic annotations.
    MarkingStore.DYNAMIC_ANNOTATION_MOVE = 'DynamicAnnotationMove';
    MarkingStore.RESPONSE_FULLY_MARKED_EVENT = 'Responsemarkedto100Percent';
    // Emit when response opened.
    MarkingStore.OPEN_RESPONSE_EVENT = 'OpenResponse';
    // Emit to update the zoom width when response pinch has been started
    MarkingStore.RESPONSE_PINCH_ZOOM_TRIGGERED = 'ResponsePinchToZoomTriggered';
    // Emit to update the zoom width when response pinch has been completed
    MarkingStore.RESPONSE_PINCH_ZOOM_COMPLETED = 'ResponsePinchToZoomCompleted';
    MarkingStore.MARK_CHANGE_REASON_VISIBILITY_UPDATED = 'MarkChangeReasonVisibilityUpdated';
    MarkingStore.MARK_SCHEME_SCROLL_ACTION = 'MarkSchemeScrollReset';
    MarkingStore.NAVIGATION_UPDATED_EVENT = 'NavigationUpdatedEvent';
    MarkingStore.SHOW_RESPONSE_NAVIGATION_FAILURE_REASONS_POPUP_EVENT = 'ShowResponseNavigationFailureReasonsPopupEvent';
    // Notify component that response animation has been completed
    MarkingStore.RESPONSE_IMAGE_ANIMATION_COMPLETED_EVENT = 'ResponseImageAnimationCompletedEvent';
    MarkingStore.REMOVE_MARK_ENTRY_SELECTION = 'RemoveMarkEntrySelection';
    MarkingStore.ENHANCED_OFF_PAGE_COMMENT_UPDATE_COMPLETED_EVENT = 'EnhancedOffPageCommentUpdatedCompletedEvent';
    MarkingStore.BOOKMARK_ADDED_EVENT = 'BookmarkAddedOnScriptEvent';
    MarkingStore.BOOKMARK_SELECTED_EVENT = 'BookmarkSelectedEvent';
    MarkingStore.GO_BACK_BUTTON_CLICK_EVENT = 'GoBackButtonClickEvent';
    MarkingStore.SHOW_OR_HIDE_BOOKMARK_NAME_BOX_EVENT = 'showOrHideBookmarkNameBoxEvent';
    MarkingStore.ALL_FILES_VIEWED_CHECK = 'AllfilesViewedCheck';
    MarkingStore.WITHDRAWN_RESPONSE_EVENT = 'withdrwanResponseEvent';
    MarkingStore.SESSION_CLOSED_FOR_EXAMINER_EVENT = 'sessionClosedforExaminer';
    MarkingStore.ROTATION_COMPLETED_EVENT = 'RotationCompletedEvent';
    /**
     * This will emit to update (remove/ add) the dynamic annotation selection
     *
     * @static
     * @memberof MarkingStore
     */
    MarkingStore.ANNOTATION_SELECTION_UPDATED_EVENT = 'AnnotationSelectionUpdatedEvent';
    return MarkingStore;
}(storeBase));
var instance = new MarkingStore();
module.exports = { MarkingStore: MarkingStore, instance: instance };
//# sourceMappingURL=markingstore.js.map