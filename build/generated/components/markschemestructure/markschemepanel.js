"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var React = require('react');
var TreeView = require('../utility/treeview/treeview');
var treeViewDataHelper = require('../../utility/treeviewhelpers/treeviewdatahelper');
var Immutable = require('immutable');
var enums = require('../utility/enums');
var SelectedQuestionItem = require('./selectedquestionitem');
var localeStore = require('../../stores/locale/localestore');
var markSchemeHelper = require('../../utility/markscheme/markschemehelper');
var MarkSchemeTotalMark = require('./markschemetotalmark');
var MarkingProgressIndicator = require('./markingprogressindicator');
var markingStore = require('../../stores/marking/markingstore');
var worklistStore = require('../../stores/worklist/workliststore');
var responseStore = require('../../stores/response/responsestore');
var responseActionCreator = require('../../actions/response/responseactioncreator');
var markingActionCreator = require('../../actions/marking/markingactioncreator');
var marksManagementHelper = require('../utility/marking/marksmanagementhelper');
var keyDownHelper = require('../../utility/generic/keydownhelper');
var ReactDom = require('react-dom');
var annotationHelper = require('../../components/utility/annotation/annotationhelper');
var constants = require('../utility/constants');
var markingHelper = require('../../utility/markscheme/markinghelper');
var stampActionCreator = require('../../actions/stamp/stampactioncreator');
var deviceHelper = require('../../utility/touch/devicehelper');
var messageStore = require('../../stores/message/messagestore');
var messagingActionCreator = require('../../actions/messaging/messagingactioncreator');
var exceptionStore = require('../../stores/exception/exceptionstore');
var exceptionActionCreator = require('../../actions/exception/exceptionactioncreator');
var MarkschemepanelHeaderDropdown = require('./markschemepanelheaderdropdown');
var ToggleButton = require('../utility/togglebutton');
var colouredAnnotationsHelper = require('../../utility/stamppanel/colouredannotationshelper');
var QualityFeedbackButton = require('./qualityfeedbackbutton');
var qigStore = require('../../stores/qigselector/qigstore');
var SubmitResponse = require('../worklist/shared/submitresponse');
var submitHelper = require('../utility/submit/submithelper');
var AccuracyIndicator = require('../worklist/shared/accuracyindicator');
var GenericButton = require('../utility/genericbutton');
var ccHelper = require('../../utility/configurablecharacteristic/configurablecharacteristicshelper');
var ccNames = require('../../utility/configurablecharacteristic/configurablecharacteristicsnames');
var PanelResizer = require('../utility/panelresizer/panelresizer');
var classNames = require('classnames');
var eventManagerBase = require('../base/eventmanager/eventmanagerbase');
var eventTypes = require('../base/eventmanager/eventtypes');
var direction = require('../base/eventmanager/direction');
var MarkChangeReason = require('./markchangereason');
var markChangeReasonHelper = require('../utility/markchangereason/markchangereasonhelper');
var responseHelper = require('../utility/responsehelper/responsehelper');
var userOptionsHelper = require('../../utility/useroption/useroptionshelper');
var userOptionKeys = require('../../utility/useroption/useroptionkeys');
var marksAndAnnotationsVisibilityHelper = require('../utility/marking/marksandannotationsvisibilityhelper');
var htmlUtilities = require('../../utility/generic/htmlutilities');
var MarkByOption = require('./markbyoption');
var navigationHelper = require('../utility/navigation/navigationhelper');
var scrollHelper = require('../../utility/markscheme/markschemescrollhelper');
var SetAsReviewedButton = require('./setasreviewedbutton');
var teamManagementStore = require('../../stores/teammanagement/teammanagementstore');
var teamManagementActionCreator = require('../../actions/teammanagement/teammanagementactioncreator');
var markByAnnotationHelper = require('../utility/marking/markbyannotationhelper');
var storageAdapterHelper = require('../../dataservices/storageadapters/storageadapterhelper');
var markerOperationModeFactory = require('../utility/markeroperationmode/markeroperationmodefactory');
var Sampling = require('../teammanagement/sampling/sampling');
var SupervisorMarkDecision = require('./supervisormarkdecision');
var accuracyRuleFactory = require('../../utility/markcalculationrules/accuracyrulefactory');
var targetSummarytStore = require('../../stores/worklist/targetsummarystore');
var loggingHelper = require('../utility/marking/markingauditlogginghelper');
var loggerConstants = require('../utility/loggerhelperconstants');
var enhancedOffPageCommentStore = require('../../stores/enhancedoffpagecomments/enhancedoffpagecommentstore');
var enhancedOffPageCommentActionCreator = require('../../actions/enhancedoffpagecomments/enhancedoffpagecommentactioncreator');
var eCourseworkHelper = require('../utility/ecoursework/ecourseworkhelper');
var eCourseWorkFileStore = require('../../stores/response/digital/ecourseworkfilestore');
var enhancedOffPageCommentHelper = require('../utility/enhancedoffpagecomment/enhancedoffpagecommenthelper');
var toolbarStore = require('../../stores/toolbar/toolbarstore');
var acetatesActionCreator = require('../../actions/acetates/acetatesactioncreator');
var stampStore = require('../../stores/stamp/stampstore');
var GenericBlueHelper = require('../utility/banner/genericbluehelper');
var standardisationSetupStore = require('../../stores/standardisationsetup/standardisationsetupstore');
var configurableCharacteristicsValues = require('../../utility/configurablecharacteristic/configurablecharacteristicsvalues');
var stdSetupActionCreator = require('../../actions/standardisationsetup/standardisationactioncreator');
var ClassifyResponse = require('../../components/standardisationsetup/shared/classifyresponse');
var SWIPE_MOVE_FACTOR = 0.6;
var MOVE_FACTOR_PIXEL = 40;
var MarkSchemePanel = (function (_super) {
    __extends(MarkSchemePanel, _super);
    /**
     * @Constrctor
     * @param {Props} props
     * @param {any} state
     */
    function MarkSchemePanel(props, state) {
        var _this = this;
        _super.call(this, props, state);
        this.isNRclicked = false;
        // for logging in google analytics.
        this.markByKeyboardCount = 0;
        // for logging in google analytics.
        this.markByButtonCount = 0;
        // This is to reload the markscheme structure everytime,
        // When the panel rerender.
        this.reloadTreeview = 0;
        //Boolean value for disabling the submit button
        this.isSubmitDisabled = false;
        //Boolean value for enabling submit button
        this.isSubmitVisible = false;
        // This is currently setting to false, Later this variable needs to be set by the user options
        this.hasAutoNavigation = false;
        // mark change reason visibility
        this.isMarkChangeReasonVisible = false;
        this.markScheme = null;
        this.doTriggerResponseNavigation = true;
        this.storageAdapterHelper = new storageAdapterHelper();
        this.previousDeltaY = 0;
        this.isMarksColumnVisibilitySwitched = false;
        this.accuracyIndicator = undefined;
        this.selectedReviewCommentId = enums.SetAsReviewedComment.None;
        this.isStampPanedBeyondBoundaries = false;
        this.previousTreeNodeBIndex = 0;
        /**
         * returns the annotation toggle button based on the visbility
         */
        this.annotationToggleButton = function (_isCurrentAnnotationVisible, _style) {
            return _this.props.hideAnnotationToggleButton ? null : (React.createElement("div", {className: 'annotation-toggle'}, React.createElement("div", {className: 'annotation-toggle-label'}, localeStore.instance.TranslateText('marking.response.mark-scheme-panel.annotations-switch-label')), React.createElement(ToggleButton, {id: _this.props.id + '_toggle_button', key: _this.props.id + '_toggle_button', isChecked: _isCurrentAnnotationVisible, index: 0, onChange: _this.onToggleChange, style: _style, title: _isCurrentAnnotationVisible ? (localeStore.instance.TranslateText('marking.response.mark-scheme-panel.annotations-switch-tooltip-hide')) : (localeStore.instance.TranslateText('marking.response.mark-scheme-panel.annotations-switch-tooltip-show')), onText: localeStore.instance.TranslateText('generic.toggle-button-states.on'), offText: localeStore.instance.TranslateText('generic.toggle-button-states.off')})));
        };
        /**
         *  Callback function for toggle button change
         */
        this.onToggleChange = function (index, isChecked) {
            _this.isNavigationInsideTree = true;
            var marksAndAnnotationVisibilityDetails = markingStore.instance.getMarksAndAnnotationVisibilityDetails;
            var _marksAndAnnotationsVisibilityInfo = marksAndAnnotationsVisibilityHelper.getMarksAndAnnotaionVisibilityByIndex(index, marksAndAnnotationVisibilityDetails, markingStore.instance.currentMarkGroupId);
            _marksAndAnnotationsVisibilityInfo.isAnnotationVisible = isChecked;
            var isEnchancedOffpageCommentVisible = markerOperationModeFactory.operationMode.isEnhancedOffPageCommentVisible;
            markingActionCreator.updateMarksAndAnnotationVisibility(index, _marksAndAnnotationsVisibilityInfo, isEnchancedOffpageCommentVisible);
        };
        /**
         *  Callback function for comments toggle button change
         */
        this.onCommentsToggleChange = function (index, isChecked) {
            // If the comment is edited we can update the toggle button otherwise we need to show the popup
            if (enhancedOffPageCommentStore.instance.isEnhancedOffPageCommentEdited === false) {
                enhancedOffPageCommentActionCreator.updateEnhancedOffPageCommentsVisibility(isChecked);
            }
            else {
                _this.props.onEnhancedOffPageCommentVisibilityChanged(enums.EnhancedOffPageCommentAction.Visibility, null, isChecked);
            }
        };
        /**
         * handling the transition when mark by candidate is selected
         */
        this.handleMarkSchemeNavigation = function () {
            /* if the response was already marked 100%, it should not navigate to the next response */
            if (_this.isFullyMarked() && _this._initialMarkingProgress !== 100) {
                /* getting the next response id from store */
                var responseId = parseInt(markerOperationModeFactory.operationMode.nextResponseId(responseStore.instance.selectedDisplayId.toString()));
                var responseNavigationFailureReasons = markingHelper.canNavigateAwayFromCurrentResponse(_this.treeViewHelper.totalMarkAndProgress.markingProgress);
                _this.isAllPageNotAnnotatedVisible =
                    responseNavigationFailureReasons.indexOf(enums.ResponseNavigateFailureReason.AllPagesNotAnnotated) !== -1
                        ? true
                        : false;
                /* if next response is available then move to the next response */
                if (responseId) {
                    if (_this.hasAutoNavigation) {
                        if (_this.isAllPageNotAnnotatedVisible) {
                            markingActionCreator.showAllPageNotAnnotatedMessage(enums.SaveAndNavigate.toResponse);
                        }
                        else if (messageStore.instance.isMessagePanelActive) {
                            messagingActionCreator.messageAction(enums.MessageViewAction.NavigateAway, enums.MessageType.None, enums.SaveAndNavigate.toResponse);
                        }
                        else if (exceptionStore.instance.isExceptionPanelActive) {
                            exceptionActionCreator.exceptionWindowAction(enums.ExceptionViewAction.NavigateAway, null, enums.SaveAndNavigate.toResponse);
                        }
                        else {
                            _this.triggerSave(false, true);
                        }
                    }
                    else {
                        /*if the response is 100% marked and hasAutoNavigation is flase the move to next markscheme if exist*/
                        _this.moveNext();
                    }
                }
                else {
                    // This block is last response in worklist. Display worklist navigation popup based on the Autonavigation
                    _this.isMbCConfirmationDialogDisplaying = _this.hasAutoNavigation;
                    /*if next response not available then move to next markscheme*/
                    _this.moveNext();
                }
            }
            else {
                /* if the response is not 100% marked then move to the next markscheme */
                _this.moveNext();
            }
        };
        this.notifyMarkUpdated = function () {
            if (!_this.isMBaCCOn || _this.isNRclicked) {
                if (_this.canNavigateMbQSingleDigitMark) {
                    _this.navigateMbQSingleDigitMarkScheme();
                }
                else if (_this.isMbaNRClicked) {
                    _this.navigateMbaNRClick();
                }
                _this.doTriggerResponseNavigation = true;
                _this.isNRclicked = false;
            }
        };
        /**
         * Markscheme navigation while MBA NR button click.
         * @param isMbQSelected
         */
        this.navigateMbaNRClick = function () {
            if (!_this.currentQuestionItem.isSingleDigitMark && responseHelper.isMbQSelected) {
                _this.scrollHelper.navigateMarkSchemeOnDemand(true);
            }
            else {
                _this.handleMarkSchemeNavigation();
            }
        };
        /**
         * Go to another response after saving mark if there is any
         */
        this.navigateAwayFromResponse = function (navigationFrom) {
            if (responseHelper.isMbQSelected === true &&
                navigationFrom &&
                navigationFrom === enums.ResponseNavigation.markScheme &&
                markingStore.instance.navigateTo === enums.SaveAndNavigate.toResponse) {
                var responseNavigation = undefined;
                var responseId = responseStore.instance.selectedDisplayId.toString();
                if (!markerOperationModeFactory.operationMode.isPreviousResponseAvailable(responseId) ||
                    !markerOperationModeFactory.operationMode.isNextResponseAvailable(responseId)) {
                    responseNavigation = enums.ResponseNavigation.markScheme;
                }
                navigationHelper.responseNavigation(responseNavigation);
            }
            else if (markingStore.instance.navigateTo === enums.SaveAndNavigate.toSetAsReviewed) {
                _this.props.invokeReviewBusyIndicator();
                teamManagementActionCreator.setResponseAsReviewed(_this.currentResponseDetails.markGroupId, teamManagementStore.instance.selectedExaminerRoleId, // The logged in examiner role id
                responseHelper.isClosedLiveSeed, teamManagementStore.instance.examinerDrillDownData.examinerRoleId, teamManagementStore.instance.examinerDrillDownData.examinerId, qigStore.instance.selectedQIGForMarkerOperation.markSchemeGroupId, _this.selectedReviewCommentId);
            }
        };
        /**
         * Rerender mark change reason if needed
         */
        this.reRenderMarkChangeReason = function () {
            _this.checkMarkChangeReason();
        };
        /**
         * Called once panel is resized to left/right
         * param - width
         * param - className
         */
        this.onPanelResize = function (width, className) {
            if (width) {
                /* To remove text selection while resizing */
                window.getSelection().removeAllRanges();
                _this.resizedPanelWidth = width;
                _this.resizePanelClassName = className;
                _this.setState({ width: width });
            }
        };
        /**
         * Called to update panel width once column list is updated
         * param - width
         */
        this.onUpdatePanelWidth = function (width) {
            if (width) {
                _this.resizedPanelWidth =
                    userOptionsHelper.getUserOptionByName(userOptionKeys.MARKSCHEME_PANEL_WIDTH, qigStore.instance.selectedQIGForMarkerOperation.examinerRoleId) + '%';
            }
        };
        /**
         * Called once panel resizing classname is updated
         * param - className
         */
        this.panelClassName = function (className) {
            _this.resizePanelClassName = className ? className : '';
            if (_this.resizePanelClassName === '') {
                _this.setState({ refreshMarkschemePanelResizer: Date.now() });
            }
        };
        /**
         * markChangeReasonUpdate
         */
        this.markChangeReasonUpdate = function () {
            _this.isResponseDirty = true;
            _this.isNavigationInsideTree = true;
            // rerender the markschemepanel only if deleting all content or if entering atleast one character to show or hide submit button
            var markChangeReasonLength = markingStore.instance.getMarkChangeReason(markingStore.instance.currentMarkGroupId).length;
            if (markChangeReasonLength === 0 || markChangeReasonLength === 1) {
                _this.setState({
                    renderedOnMarkChangeReason: Date.now()
                });
            }
        };
        /**
         * supervisor remark decision update
         */
        this.supervisorRemarkDecisionUpdate = function () {
            _this.isResponseDirty = true;
            _this.isNavigationInsideTree = true;
            _this.setState({
                supervisorRemarkDecisionRenderedOn: Date.now()
            });
        };
        /**
         * handleMarksAndAnnotationsVisibility
         */
        this.handleMarksAndAnnotationsVisibility = function (isMarksColumnVisibilitySwitched) {
            _this.isNavigationInsideTree = true;
            _this.isMarksColumnVisibilitySwitched = isMarksColumnVisibilitySwitched;
            _this.reloadTreeview = Date.now();
            _this.setState({
                renderedOnMarksAndAnnotationVisibility: Date.now(),
                renderedOnMarksColumnVisibilitySwitched: isMarksColumnVisibilitySwitched === true
                    ? Date.now()
                    : _this.state.renderedOnMarksColumnVisibilitySwitched,
                renderedOn: Date.now()
            });
        };
        /**
         * Called an exception is raised or when exception panel is closed
         */
        this.onExceptionChange = function () {
            _this.setState({ renderedOn: Date.now() });
        };
        /* trigger markscheme transition after mark confirmation */
        this.initiateTransition = function () {
            if (_this.isMbCConfirmationDialogDisplaying) {
                if (_this.isAllPageNotAnnotatedVisible) {
                    markingActionCreator.showAllPageNotAnnotatedMessage(enums.SaveAndNavigate.lastResponse);
                }
                else {
                    _this.isMbCConfirmationDialogDisplaying = false;
                    _this.props.showMbCConfirmationDialog();
                }
            }
            else if (markingStore.instance.isNextResponse && _this.hasAutoNavigation) {
                var responseId = parseInt(markerOperationModeFactory.operationMode.nextResponseId(responseStore.instance.selectedDisplayId.toString()));
                var openedResponseDetails = worklistStore.instance.getResponseDetails(responseId.toString());
                /* opening next response */
                responseHelper.openResponse(responseId, enums.ResponseNavigation.next, worklistStore.instance.getResponseMode, openedResponseDetails.markGroupId, responseStore.instance.selectedResponseViewMode);
                // Ideally marking mode should be read from the opened response,
                // since multiple marking modes won't come in the same worklist now this will work.
                var selectedMarkingMode = worklistStore.instance.getMarkingModeByWorkListType(worklistStore.instance.currentWorklistType);
                /* get the marks for the selected response */
                markSchemeHelper.getMarks(responseId, selectedMarkingMode);
            }
            else if (_this.nextNode) {
                _this.treeNodes.treeViewItemList = _this.markSchemeHelper.navigateToMarkScheme(_this.nextNode, _this.treeNodes);
                /* this.treeNodes.treeViewItemList = this.markingHelper.navigateToMarkScheme(this.nextNode, this.treeNodes.treeViewItemList);
                setting true when navigation with in the panel */
                _this.isNavigationInsideTree = true;
                // This to reset the 'isNavigating' flag in the mark entry text box (selectedquestionitem component)
                _this.isResponseChanged = Date.now();
                _this.reloadTreeview = Date.now();
                _this.setState({ renderedOn: Date.now() });
            }
            //if message panel is visible then we don't need to activate keyDownHelper
            if (!messageStore.instance.isMessagePanelVisible &&
                !exceptionStore.instance.isExceptionPanelVisible &&
                responseStore.instance.markingMethod === enums.MarkingMethod.Unstructured) {
                keyDownHelper.instance.Activate(enums.MarkEntryDeactivator.TriggerSave);
            }
        };
        /**
         * Enter NR for the unmarked mark schemes.
         */
        this.enterNRForUnMarkedItems = function () {
            _this.processNRForUnMarkedItems(_this.treeNodes);
            _this.isNavigationInsideTree = true;
            _this.checkIsSubmitVisible();
            _this.reloadTreeview = Date.now();
            _this.setState({ renderedOn: Date.now() });
        };
        /**
         * Triggered when moving away from response
         */
        this.saveAndNavigate = function () {
            // Logging the marking style into google analytics.
            _this.logger.logActiveMarkingActionCount(_this.markByKeyboardCount, _this.markByButtonCount, responseStore.instance.selectedDisplayId.toString());
            if (_this.markByKeyboardCount > 0 || _this.markByButtonCount > 0) {
                // Resetting the marking key usage values after saving
                // into google analytics.
                _this.markByKeyboardCount = 0;
                _this.markByButtonCount = 0;
            }
            if (_this.isResponseDirty) {
                _this.triggerSave(false);
                _this.isResponseDirty = false;
            }
            else {
                // If the response is not dirty, no need to show the mark confirmation but instead
                // perform the required navigation alone
                var responseNavigation = undefined;
                if (responseHelper.isMbQSelected) {
                    var responseId = responseStore.instance.selectedDisplayId.toString();
                    if (!markerOperationModeFactory.operationMode.isPreviousResponseAvailable(responseId) ||
                        !markerOperationModeFactory.operationMode.isNextResponseAvailable(responseId)) {
                        responseNavigation = enums.ResponseNavigation.markScheme;
                    }
                }
                // Checking whether we need to show mbq confirmation popup.
                navigationHelper.checkForMbqConfirmationPopup(responseNavigation);
            }
        };
        /**
         * avoid navigation when mark value is '-'
         */
        this.setResponseNavigationFlag = function () {
            _this.doTriggerResponseNavigation = false;
        };
        /**
         * reset annotaion associated to current markscheme
         * @param {boolean} resetMark
         * @param {boolean} resetAnnotation
         * @param {string} previousMark
         */
        this.resetMarksAndAnnotation = function (resetMark, resetAnnotation, previousMark) {
            if (previousMark === void 0) { previousMark = { displayMark: '', valueMark: '' }; }
            // Avoid navigation while resetting marks and annotation
            _this.doTriggerResponseNavigation = false;
            // Delete the mark if reset mark is on
            if (resetMark === true) {
                _this.logMarkEntry(loggerConstants.MARKENTRY_TEXT_CHANGED_REASON_RESET, loggerConstants.MARKENTRY_ACTION_TYPE_RESET, _this.currentQuestionItem.allocatedMarks.displayMark, '-');
                _this.currentQuestionItem.allocatedMarks = { displayMark: '-', valueMark: '-' };
                // This to reset the mark entry text box
                _this.isResponseChanged = Date.now();
                _this.updateMark();
            }
            // reset the annotations if user selected to reset it.
            if (resetAnnotation === true) {
                // Get all annotations associated to the current mark group
                // Filter the list with the current markscheme and mark it as deleted and update the store.
                // Avoid linked annotation from removing.
                var annotations = Immutable.List(annotationHelper.getCurrentMarkGroupAnnotation());
                var deleteAnnotationCount_1 = 0;
                var filteredAnnotations = annotations.map(function (annotation) {
                    if (annotation.markSchemeId ===
                        markingStore.instance.currentQuestionItemInfo.uniqueId &&
                        annotation.stamp !== constants.LINK_ANNOTATION &&
                        !annotation.addedBySystem) {
                        deleteAnnotationCount_1++;
                        return annotation.clientToken;
                    }
                });
                var enhancedOffPageComments = Immutable.List(markingStore.instance.enhancedOffPageCommentsAgainstCurrentResponse());
                var filteredEnhancedOffPageComments = enhancedOffPageComments.map(function (enhancedOffPageComment) {
                    if (enhancedOffPageComment.markSchemeId ===
                        markingStore.instance.currentQuestionItemInfo.uniqueId) {
                        return enhancedOffPageComment.clientToken;
                    }
                });
                // logg count of annotations that are going to be deleted.
                _this.logMarkEntryAnnotationUpdate(loggerConstants.MARKENTRY_REASON_ANNOTATION_CHANGED, loggerConstants.MARKENTRY_TYPE_ANNOTATION_RESET, deleteAnnotationCount_1);
                if (filteredAnnotations.count() > 0) {
                    // This event should flag is reset to let prevent additional refresh
                    markingActionCreator.removeAnnotation(filteredAnnotations.toArray());
                }
                if (filteredEnhancedOffPageComments.count() > 0) {
                    enhancedOffPageCommentActionCreator.saveEnhancedOffpageComments(filteredEnhancedOffPageComments.toArray(), enums.MarkingOperation.deleted);
                }
            }
            // this will re-assign the value after clicking the NO button in
            // reset confirmation popup
            if (!resetMark && !resetAnnotation && previousMark.displayMark !== '') {
                _this.currentQuestionItem.allocatedMarks = previousMark;
                // reset the markshemepanel
                _this.updateMark();
            }
        };
        /**
         * While adding annotation refresh the screen and markscheme panel reset button
         * to enable and disable.
         */
        this.refreshMarkSchemePanelOnAddAnnotation = function (stampId, addAnnotationAction, annotationOverlayId, annotation) {
            // updating marks from annotation to collection --- Mark By Annotation.
            if (responseHelper.isMarkByAnnotation(responseHelper.currentAtypicalStatus)) {
                _this.addAnnotationMark(stampId, addAnnotationAction, annotationOverlayId, annotation);
            }
            // clear the old linked items and get new items if added annotation is link. this is needed when we are clicking the view
            // whole page button. Also we need to recalculate linked items if previous marks and annotations are there, as we need
            // to link page linked by previous marker to current marker if current marker adds annotation to page linked by previous marker
            if (stampId === constants.LINK_ANNOTATION || _this.treeViewHelper.canRenderPreviousMarks()) {
                _this.getLinkedItems(_this.treeNodes, true);
            }
            _this.isResponseDirty = true;
            _this.refreshSelectedMarkingItemPanel();
        };
        /*
         * Removing marks from the collection
         */
        this.removeAnnotationMark = function (removedAnnotation) {
            var numericValuedAnnotation = _this.markByAnnotationHelper.hasNumericValue(removedAnnotation);
            if (removedAnnotation && numericValuedAnnotation) {
                var examinerMarksAgainstResponse = markingStore.instance.getExaminerMarksAgainstResponse;
                var allAnnotations = examinerMarksAgainstResponse[markingStore.instance.currentMarkGroupId]
                    .examinerMarkGroupDetails[markingStore.instance.selectedQIGMarkGroupId]
                    .allMarksAndAnnotations[0].annotations;
                // verifying any value annotations left in current question item.
                var hasNumericAnnotationLeft = _this.markByAnnotationHelper.doCheckValueAnnotationLeft(allAnnotations, removedAnnotation);
                var newMark = _this.markByAnnotationHelper.removeAnnotationMarks(allAnnotations, removedAnnotation, _this.currentQuestionItem);
                markingActionCreator.markEdited(true);
                var displayMark = hasNumericAnnotationLeft ? newMark : constants.NOT_MARKED;
                _this.updateAnnotationMark(loggerConstants.MARKENTRY_TYPE_ANNOTATION__REMOVED, displayMark);
            }
        };
        /*
         * Updating  new marks to collection.
         */
        this.updateAnnotationMark = function (updateReason, newDisplayMark, valueMark) {
            if (_this.currentQuestionItem.allocatedMarks.displayMark !== newDisplayMark ||
                newDisplayMark === constants.NOT_ATTEMPTED) {
                // Log MBA old and display value
                _this.logMarkEntry(loggerConstants.MARKENTRY_REASON_ANNOTATION_CHANGED, updateReason, _this.currentQuestionItem.allocatedMarks.displayMark, newDisplayMark);
                markingActionCreator.markEdited(true);
                _this.currentQuestionItem.allocatedMarks = {
                    displayMark: newDisplayMark,
                    valueMark: valueMark ? valueMark : null
                };
                _this.refreshSelectedMarkingItemPanel();
                _this.updateMark();
            }
        };
        /*
         * Determines whether annotation is to be stamped.
         */
        this.doStampAnnotation = function (newlyAddedAnnotation, action, annotationOverlayID) {
            var isValid = _this.markByAnnotationHelper.isMarkValid(_this.currentQuestionItem, newlyAddedAnnotation);
            if (isValid) {
                markingActionCreator.validatedAndContinue(newlyAddedAnnotation, action, annotationOverlayID);
            }
            else {
                _this.onValidateMarkEntry(_this.currentQuestionItem.minimumNumericMark, _this.currentQuestionItem.maximumNumericMark, false, true);
            }
        };
        /*
        * NR button for mark by annotation mode.
        */
        this.onNRButtonClick = function () {
            var displayMark = 'NR';
            _this.updateAnnotationMark(loggerConstants.MARKENTRY_TYPE_APPLIED_NR, displayMark);
            _this.doTriggerResponseNavigation = true;
            _this.isResponseDirty = true;
            _this.isNRclicked = true;
            markingActionCreator.markEdited(true);
        };
        /**
         * While removing annotation refresh the screen and markscheme panel reset button
         * to enable and disable.
         */
        this.refreshMarkSchemePanelOnRemoveAnnotation = function (removedAnnotation) {
            _this.isResponseDirty = true;
            // mark by annotation cc check
            if (removedAnnotation) {
                _this.logger.logAnnotationModifiedAction('DisplayId -' +
                    responseStore.instance.selectedDisplayId +
                    '-' +
                    loggerConstants.MARKENTRY_REASON_ANNOTATION_CHANGED, loggerConstants.MARKENTRY_TYPE_ANNOTATION_REMOVED, removedAnnotation, markingStore.instance.currentMarkGroupId, markingStore.instance.currentMarkSchemeId);
                if (responseHelper.isMarkByAnnotation(responseHelper.currentAtypicalStatus)) {
                    markingActionCreator.removeMarksByAnnotation(removedAnnotation);
                }
            }
            _this.refreshSelectedMarkingItemPanel();
        };
        /**
         * While updating annotation position refresh the screen and markscheme panel reset button
         * to enable and disable.
         */
        this.refreshMarkSchemePanelOnUpdateAnnotation = function (clientToken, isPositionUpdated) {
            if (isPositionUpdated) {
                _this.isResponseDirty = true;
            }
        };
        // Refresh the markscheme panel when navigated to next markscheme.
        // this will ensure current markgroup details are updated in store.
        this.onQuestionItemChanged = function (bIndex, forceUpdate) {
            if (forceUpdate === void 0) { forceUpdate = false; }
            // following condition is checked to prevent the markscheme panel getting refreshed everytime, while
            // we resizing the panel
            if (markingStore.instance.getResizedPanelClassName()) {
                return;
            }
            _this.reloadTreeview = Date.now();
            _this.isMouseWheelOnProgress = false;
            _this.isKeyActionOnProgress = false;
            // Rerender selectedquestionitem once marking store is
            // been updated with selected value.
            if ((_this.currentQuestionItem && bIndex !== _this.currentQuestionItem.bIndex) ||
                forceUpdate) {
                _this.selectedQuestionItemRenderedOn = Date.now();
                _this.setState({ renderedOn: Date.now() });
            }
        };
        /**
         * Triggers when markschemepanel transition is over
         * @param {Event} event
         */
        this.onAnimationEnd = function (event) {
            _this.markScheme = ReactDom.findDOMNode(_this.refs.markScheme);
            if (_this.markScheme) {
                _this.containerWidth = _this.markScheme.getBoundingClientRect().width;
                _this.props.getMarkSchemePanelWidth(_this.containerWidth);
            }
        };
        /**
         * Sets the review response button as reviewed button
         */
        this.setResponseAsReviewed = function (reviewResponseDetails) {
            if (reviewResponseDetails.reviewResponseResult === enums.SetAsReviewResult.Success) {
                // Re render markshemepanel as worklist store has been updated with correct review status
                _this.setState({ renderedOn: Date.now() });
                // Clear My Team List Cache to reflect the Response To Review Count
                _this.storageAdapterHelper.clearTeamDataCache(teamManagementStore.instance.selectedExaminerRoleId, teamManagementStore.instance.selectedMarkSchemeGroupId);
                // Navigate to next response if avaialble or navigate to worklist
                var responseId = responseStore.instance.selectedDisplayId.toString();
                if (worklistStore.instance.isNextResponseAvailable(responseId)) {
                    navigationHelper.responseNavigation(enums.ResponseNavigation.next);
                }
                else {
                    navigationHelper.loadWorklist();
                }
            }
        };
        /**
         * Marks retrieval event.
         */
        this.marksRetrieved = function (markGroupId) {
            if (markingStore.instance.currentMarkGroupId.toString() === markGroupId) {
                _this.isNavigationInsideTree = false;
                _this.reloadTreeview = Date.now();
                // Re render markshemepanel as marks retrived.
                _this.reloadTreeview = Date.now();
                _this.setState({ renderedOn: Date.now() });
            }
        };
        /**
         * Refresh comments toggle button state.
         * @private
         * @memberof MarkSchemePanel
         */
        this.handleEnhancedOffPageCommentsVisibility = function (isVisible, markSchemeToNavigate) {
            _this.setState({ renderedOn: Date.now() });
            // For navigating to next question of another qig on yes click of discard comment popup.
            if (markSchemeToNavigate) {
                _this.navigateToMarkScheme(markSchemeToNavigate);
            }
        };
        /**
         * Enables toggle buttons on Enhanced offpage comment data update.
         *
         * @private
         * @memberof MarkSchemePanel
         */
        this.enableToggleButtonOnEnhancedCommentUpdate = function () {
            var commentIndex = enhancedOffPageCommentStore.instance.currentEnhancedOffpageCommentIndex;
            _this.onCommentsToggleChange(commentIndex, true);
        };
        /**
         * reset isreponsedirty to trigger save navigation FRV.
         *
         * @private
         * @memberof MarkSchemePanel
         */
        this.updateFileReadStatusonNavigation = function () {
            _this.isResponseDirty = true;
        };
        /**
         * Invoked on stamp pan to an area where deletion of the annotation dragged is possible
         */
        this.onStampPanToDeleteArea = function (canDelete) {
            _this.isStampPanedBeyondBoundaries = canDelete;
        };
        /**
         * sets the visibility and recalculates the index value, on navigating to different QIGs in Whole response.
         * @private
         * @memberof markSchemeGroupId
         */
        this.navigateToQigInWholeResponse = function (currentMarkSchemeGroupId, previousMarkSchemeGroupId) {
            if (responseStore.instance.isWholeResponse === true) {
                // following condition is checked to prevent the markscheme panel getting refreshed everytime, while
                // we resizing the panel
                if (markingStore.instance.getResizedPanelClassName()) {
                    return;
                }
                _this.treeNodes = _this.treeViewHelper.navigateToQigInWholeResponse(_this.treeNodes, currentMarkSchemeGroupId, previousMarkSchemeGroupId);
                _this.reloadTreeview = Date.now();
                _this.setState({
                    renderedOn: Date.now()
                });
            }
        };
        /**
         * set isreponsedirty to trigger save on copying completed.
         */
        this.onPreviousMarksAnnotationCopied = function () {
            _this.isResponseDirty = true;
        };
        /**
         * on click the 'Select to mark' OR 'Mark as definitive' button.
         */
        this.onClickToShowPopup = function () {
            var popupType = (markerOperationModeFactory.operationMode.isUnclassifiedTabInStdSetup) ?
                enums.PopUpType.MarkAsDefinitive : enums.PopUpType.SelectToMarkAsProvisional;
            // show the mark now/ mark later popup/ mark as definitive
            stdSetupActionCreator.selectStandardisationResponsePopupOpen(popupType);
        };
        /**
         * On closing the blue helper message.
         */
        this.onClosingBlueHelperMessage = function () {
            stdSetupActionCreator.updateSelectToMarkHelperMessageVisibility(false);
        };
        /**
         * Open reclassify multi option pop with classified response details
         */
        this.reclassifyMultiOptionPopUpOpen = function (esMarkGroupId) {
            stdSetupActionCreator.reclassifyMultiOptionPopupOpen(esMarkGroupId);
        };
        this.markSchemeHelper = new markSchemeHelper();
        this.markByAnnotationHelper = new markByAnnotationHelper();
        this.isMBaCCOn = responseHelper.isMarkByAnnotation(responseHelper.currentAtypicalStatus);
        this.logger = new loggingHelper();
        this.state = {
            renderedOn: Date.now(),
            offSet: this.markSchemeHelper.defaultCSSTranslate,
            renderedOnMarksAndAnnotationVisibility: Date.now(),
            renderedOnMarkChangeReason: Date.now(),
            renderedOnMarksColumnVisibilitySwitched: Date.now(),
            refreshMarkschemePanelResizer: Date.now(),
            supervisorRemarkDecisionRenderedOn: Date.now()
        };
        this.isNavigationInsideTree = false;
        this.scrollHelper = new scrollHelper(this.movePrev.bind(this), this.moveNext.bind(this), this.handleMarkSchemeNavigation.bind(this));
        if (markingStore.instance.initialMarkingProgress) {
            this._initialMarkingProgress = markingStore.instance.initialMarkingProgress;
        }
        this.isMbCConfirmationDialogDisplaying = false;
        this.isAllPageNotAnnotatedVisible = false;
        this.selectedQuestionItemRenderedOn = 0;
        this.isResponseDirty = false;
        this.moveNext = this.moveNext.bind(this);
        this.movePrev = this.movePrev.bind(this);
        this.updateMark = this.updateMark.bind(this);
        this.onCompleteButtonClick = this.onCompleteButtonClick.bind(this);
        this.handleMarkSchemeNavigation = this.handleMarkSchemeNavigation.bind(this);
        this.logMarkingBehaviour = this.logMarkingBehaviour.bind(this);
        this.onTouchMove = this.onTouchMove.bind(this);
        this.onMouseWheel = this.onMouseWheel.bind(this);
        this.navigateToMarkScheme = this.navigateToMarkScheme.bind(this);
        this.onMarkSchemeSelected = this.onMarkSchemeSelected.bind(this);
        this.onValidateMarkEntry = this.props.onValidateMarkEntry.bind(this);
        this.onPanMove = this.onPanMove.bind(this);
        this.onPanEnd = this.onPanEnd.bind(this);
        this.onSwipe = this.onSwipe.bind(this);
        this.markChangeReasonUpdate = this.markChangeReasonUpdate.bind(this);
        this.showAcceptQualityConfirmationDialog = this.showAcceptQualityConfirmationDialog.bind(this);
        this.selectedQuestionItemResetScroll = false;
        this.checkIsSubmitVisible = this.checkIsSubmitVisible.bind(this);
        this.reRenderSubmitAndProgress = Date.now();
        this.isMouseWheelOnProgress = false;
        this.isKeyActionOnProgress = false;
        this.onReviewButtonClick = this.onReviewButtonClick.bind(this);
        this.onNRButtonClick = this.onNRButtonClick.bind(this);
        this.onRemarkDecisionChange = this.onRemarkDecisionChange.bind(this);
        this.calculateAccuracy = this.calculateAccuracy.bind(this);
        this.logMarkEntry = this.logMarkEntry.bind(this);
        this.logSaveMarksAction = this.logSaveMarksAction.bind(this);
        this.linkedItemsUniqueIds = Immutable.List();
    }
    Object.defineProperty(MarkSchemePanel.prototype, "originalMark", {
        /**
         * Get the original mark of the current item.
         */
        get: function () {
            var _this = this;
            // initialising with default mark, incase to revert,
            // if there are no valid mark available.
            var mark = {
                displayMark: '-',
                valueMark: null
            };
            this.originalMarkList.map(function (item) {
                // Filter only the marks which are saved in to database.
                // we dont need to take the mark which are just saved in this context.
                if (_this.currentQuestionItem.uniqueId === item.markSchemeId && item.markId !== 0) {
                    mark = item.mark;
                }
            });
            return mark;
        },
        enumerable: true,
        configurable: true
    });
    /** render method */
    MarkSchemePanel.prototype.render = function () {
        var selectedQuestionItem = null;
        /* No need to re build the tree view if the naviagtion is with in the panel */
        if (this.isNavigationInsideTree === false) {
            // Initialise markscheme structre on loading the panle.
            this.loadMarkSchemeStructure();
            this.getLinkedItems(this.treeNodes, true);
            // Pass the last markscheme id to the parent.
            this.props.onMarkSchemeStructureLoaded(this.treeViewHelper.lastMarkSchemeId);
            this.checkMarkChangeReason();
            /* If a response open from an exception page and the selected exception has an associated question,
               corresponding question should be selected by default in marking panel.
             */
            if (teamManagementStore.instance.isRedirectFromException &&
                (responseStore.instance.imageZonesAgainstPageNumber === undefined &&
                    markingStore.instance.currentQuestionItemInfo === undefined)) {
                var selectedException = teamManagementStore.instance.selectedException;
                if (selectedException) {
                    var sequenceNo = selectedException.sequenceNo;
                    if (sequenceNo !== 0) {
                        var selectedNode = this.markSchemeHelper.searchTreeViewBySequenceNo(this.treeNodes, sequenceNo);
                        if (selectedNode) {
                            this.navigateToMarkScheme(selectedNode, true);
                        }
                    }
                }
            }
        }
        this.currentQuestionItem = this.markSchemeHelper.selectedNodeGet;
        if (this.currentQuestionItem != null) {
            this.setSelectedNodeTypes();
            selectedQuestionItem = (React.createElement(SelectedQuestionItem, {selectedQuestionItem: this.currentQuestionItem, id: 'active_question_' + this.props.id, key: 'active_question_key_' + this.props.id, onMoveNext: this.moveNext, onMovePrev: this.movePrev, isUpArrowDisabled: this.isFirstNodeSelected, isDownArrowDisabled: this.isLastNodeSelected, updateMark: this.updateMark, onValidateMarkEntry: this.onValidateMarkEntry, originalMark: this.currentQuestionItem.allocatedMarks, responseChanged: this.isResponseChanged, onEnterKeyPress: this.handleMarkSchemeNavigation, onResetConfirm: this.props.onResetConfirm, logKeyUsageValues: this.logMarkingBehaviour, renderedOn: this.selectedQuestionItemRenderedOn, selectedLanguage: this.props.selectedLanguage, isResponseEditable: this.props.isResponseEditable, isResetScroll: this.selectedQuestionItemResetScroll, isNonNumeric: this.treeViewHelper.isNonNumeric, markingProgress: this.treeViewHelper.totalMarkAndProgress.markingProgress, treeNodes: this.treeNodes, isLastNode: this.isLastNodeSelected, onNRButtonClick: this.onNRButtonClick, logMarkEntry: this.logMarkEntry, scrollHelperInstance: this.scrollHelper, setResponseNavigationFlag: this.setResponseNavigationFlag}));
        }
        this.selectedQuestionItemResetScroll = false;
        var responsedetails = worklistStore.instance.getResponseDetails(responseStore.instance.selectedDisplayId.toString());
        var isBlockerException = exceptionStore.instance.hasExceptionBlockers();
        this.checkIsSubmitVisible();
        var markChangeReason = null;
        if (this.isMarkChangeReasonVisible) {
            markChangeReason = markingStore.instance.getMarkChangeReason(markingStore.instance.currentMarkGroupId);
        }
        var markingProgressIndicator = null;
        var submitresponsebutton = null;
        // Marking progress indicator will be hidden for a classfied response as its
        // functionality will be implemented later. 
        if (worklistStore.instance.getResponseMode !== enums.ResponseMode.closed
            && standardisationSetupStore.instance.selectedStandardisationSetupWorkList !== enums.StandardisationSetup.ClassifiedResponse) {
            markingProgressIndicator = (React.createElement(MarkingProgressIndicator, {id: 'progressIndicator', key: 'progressIndicator', progressPercentage: this.treeViewHelper.totalMarkAndProgress.markingProgress, isVisible: this.isSubmitVisible ? false : true, checkIsSubmitVisible: this.checkIsSubmitVisible, renderedOn: this.reRenderSubmitAndProgress}));
            // Null check added to avoid unexpected error occur if responsedetails is null.
            if (responsedetails) {
                submitresponsebutton = (React.createElement(SubmitResponse, {isSubmitAll: false, id: 'submitSingleResponse', key: 'submitSingleResponse_key', selectedLanguage: this.props.selectedLanguage, isDisabled: this.isSubmitDisabled, markGroupId: responsedetails.markGroupId, fromMarkScheme: true, isVisible: this.isSubmitVisible, checkIsSubmitVisible: this.checkIsSubmitVisible, renderedOn: this.reRenderSubmitAndProgress}));
            }
        }
        // Render Quality Feedback button if QualityFeedbackOutstanding
        var qualityFeedbackButton = this.isAcceptQualityFeedbackButtonVisible() ? (React.createElement(QualityFeedbackButton, {id: 'qualityFeedback', key: 'qualityFeedback', onClick: this.showAcceptQualityConfirmationDialog, selectedLanguage: this.props.selectedLanguage})) : null;
        var setAsReviewedButton = markerOperationModeFactory.operationMode.allowReviewResponse ? (React.createElement(SetAsReviewedButton, {id: 'setAsReviewedButton', key: 'setAsReviewedButton', isDisabled: responsedetails.isReviewed, setAsReviewedComment: responsedetails.setAsReviewedCommentId, selectedLanguage: this.props.selectedLanguage, onReviewButtonClick: this.onReviewButtonClick})) : null;
        var _doShowSamplingButton = !teamManagementStore.instance.isRedirectFromException &&
            markerOperationModeFactory.operationMode.doShowSamplingButton(this.treeViewHelper.totalMarkAndProgress.markingProgress, worklistStore.instance.currentWorklistType);
        var samplingButton = _doShowSamplingButton ? (React.createElement(Sampling, {id: 'sampling', key: 'sampling', selectedLanguage: this.props.selectedLanguage, samplingRenderedOn: this.samplingRenderedOn})) : null;
        //get the default mark scheme panel width
        var defaultMarkSchemePanelWidth = markingStore.instance.getDefaultPanelWidth();
        var defaultPanelWidthAfterColumnIsUpdated = markingStore.instance.getDefaultPanelWidthAfterColumnIsUpdated();
        defaultMarkSchemePanelWidth = defaultPanelWidthAfterColumnIsUpdated
            ? defaultPanelWidthAfterColumnIsUpdated
            : defaultMarkSchemePanelWidth;
        //get the saved mark scheme panel width from useroptions
        var examinerRoleId = markerOperationModeFactory.operationMode.isTeamManagementMode
            ? teamManagementStore.instance.selectedExaminerRoleId
            : qigStore.instance.selectedQIGForMarkerOperation.examinerRoleId;
        var markingSchemePanelWidth = userOptionsHelper.getUserOptionByName(userOptionKeys.MARKSCHEME_PANEL_WIDTH, examinerRoleId);
        var markDetails = this.treeViewHelper.totalMarkAndProgress;
        var stylePanel = {};
        if (this.resizedPanelWidth || defaultMarkSchemePanelWidth) {
            stylePanel = {
                width: this.resizedPanelWidth
                    ? this.resizedPanelWidth
                    : markingSchemePanelWidth
                        ? markingSchemePanelWidth + '%'
                        : defaultMarkSchemePanelWidth,
                maxWidth: defaultMarkSchemePanelWidth
            };
        }
        var _markChangeReason = (React.createElement(MarkChangeReason, {id: 'markChangeReason', key: 'markChangeReason', selectedLanguage: this.props.selectedLanguage, isInResponse: true, isResponseEditable: this.props.isResponseEditable, markChangeReason: markChangeReason}));
        var markdecision = null;
        if (this.showRemarkDecisionButton()) {
            this.remarkDecision = markingStore.instance.convertSupervisorRemarkDecisionType();
            markdecision = (React.createElement(SupervisorMarkDecision, {amd: this.absoluteMarkDifference, tmd: this.totalMarkDifference, accuracy: this.accuracyIndicator, onRemarkDecisionChange: this.onRemarkDecisionChange, selectedLanguage: this.props.selectedLanguage, id: 'remarkdecision', key: 'remarkdecision', calculateAccuracy: this.calculateAccuracy, supervisorRemarkDecisionType: this.remarkDecision}));
        }
        var hasPreviousColumn = this.treeViewHelper.canRenderPreviousMarks();
        /**
         * Standardisation setup 'Select to mark' provisional response condition.
         * Show 'Select to mark button
         */
        var totalMarkHolder = null;
        // standardisation setup - select response screen
        if (markerOperationModeFactory.operationMode.isSelectResponsesTabInStdSetup ||
            markerOperationModeFactory.operationMode.isUnclassifiedTabInStdSetup) {
            if (this.isSelectResponsesButtonVisible) {
                var buttonText = markerOperationModeFactory.operationMode.isSelectResponsesTabInStdSetup ?
                    localeStore.instance.TranslateText('standardisation-setup.select-response.select-to-mark-button') :
                    localeStore.instance.TranslateText('standardisation-setup.mark-as-definitive.mark-as-definitive-button');
                var blueHelperMessage = markerOperationModeFactory.operationMode.isSelectResponsesTabInStdSetup ?
                    localeStore.instance.TranslateText('standardisation-setup.select-response.select-to-mark-blue-banner') :
                    localeStore.instance.TranslateText('standardisation-setup.mark-as-definitive.mark-as-definitive-blue-banner');
                var markSchemeTotalMark = null;
                var buttonWithHelperMessage = null;
                var displayButtonWithHelperMessage = true;
                var className = (markerOperationModeFactory.operationMode.isUnclassifiedTabInStdSetup) ?
                    'total-panel-holder' : '';
                var buttonId = (markerOperationModeFactory.operationMode.isUnclassifiedTabInStdSetup) ?
                    'markAsDefinitiveButton' : 'selecttomarkbutton';
                var helperMessageId = (markerOperationModeFactory.operationMode.isUnclassifiedTabInStdSetup) ?
                    'markAsDefinitiveHelperMessage' : 'selectResponsesButtonMessage';
                var classifyResponseButton = null;
                var showMarkingProgressIndicator = null;
                var classifyButtonHelper = new submitHelper();
                markSchemeTotalMark = (markerOperationModeFactory.operationMode.isUnclassifiedTabInStdSetup) ?
                    React.createElement(MarkSchemeTotalMark, {id: 'totalMarks', key: 'totalMarks', selectedLanguage: this.props.selectedLanguage, actualMark: markDetails.totalMark, maximumMark: markDetails.maximumMark, previousMarksColumnTotals: this.treeNodes.previousMarks, renderedOn: this.state.renderedOn, markingProgress: markDetails.markingProgress, isNonNumeric: this.treeViewHelper.isNonNumeric}) : null;
                displayButtonWithHelperMessage = (markerOperationModeFactory.operationMode.isUnclassifiedTabInStdSetup &&
                    standardisationSetupStore.instance.fetchStandardisationResponseData(responseStore.instance.selectedDisplayId).hasDefinitiveMark === true) ? false : true;
                // In unclassified worklist Show 'marking progress indicator',
                // when the definitive marking started for the current response.
                // If there are any blocking conditions(not all SLAOs annotated, etc) and the progress is 100%, 
                // then show 100% itself, else show the classify button
                if (markerOperationModeFactory.operationMode.isUnclassifiedTabInStdSetup
                    && markingStore.instance.isDefinitiveMarking) {
                    var unclassifiedResponseData = standardisationSetupStore.instance.getResponseDetails(responseStore.instance.selectedDisplayId.toString());
                    // Classify button enabling/disabling in unclassified worklist
                    var responseStatuses = classifyButtonHelper.submitButtonValidate(unclassifiedResponseData, unclassifiedResponseData.markingProgress, true, false);
                    if (responseStatuses
                        && responseStatuses.contains(enums.ResponseStatus.readyToSubmit)
                        && markDetails.markingProgress === 100) {
                        classifyResponseButton = (React.createElement(ClassifyResponse, {id: 'responseScreenClassifyButton', key: 'responseScreenClassifyButton', isDisabled: false, renderedOn: this.state.renderedOn, buttonTextResourceKey: 'standardisation-setup.right-container.classify-button'}));
                    }
                    else {
                        // Show 'marking progress indicator'
                        showMarkingProgressIndicator = markingProgressIndicator;
                    }
                }
                buttonWithHelperMessage = displayButtonWithHelperMessage ?
                    (React.createElement("div", {className: 'submit-holder def-mark show-message-bottom'}, React.createElement(GenericButton, {id: buttonId, key: buttonId, className: 'rounded primary popup-nav std-selectmark-btn', onClick: this.onClickToShowPopup, content: buttonText}), React.createElement(GenericBlueHelper, {id: helperMessageId, key: helperMessageId + responseStore.instance.selectedDisplayId.toString(), message: blueHelperMessage, selectedLanguage: this.props.selectedLanguage, role: 'tooltip', isAriaHidden: false, bannerType: enums.BannerType.HelperMessageWithClose, header: null, isVisible: standardisationSetupStore.instance.isSelectToMarkHelperVisible, onCloseClick: this.onClosingBlueHelperMessage}))) : null;
                totalMarkHolder = (React.createElement("div", {className: className}, buttonWithHelperMessage, showMarkingProgressIndicator, classifyResponseButton, markSchemeTotalMark));
            }
        }
        else {
            // normal marking flow - total marks and progress
            totalMarkHolder = (React.createElement("div", {className: this.totalPanelClassName}, this.showReClassifyResponseButton, this.showAccuracyPanel, markingProgressIndicator, submitresponsebutton, markdecision, _markChangeReason, React.createElement(MarkSchemeTotalMark, {id: 'totalMarks', key: 'totalMarks', selectedLanguage: this.props.selectedLanguage, actualMark: markDetails.totalMark, maximumMark: markDetails.maximumMark, previousMarksColumnTotals: this.treeNodes.previousMarks, renderedOn: this.state.renderedOn, markingProgress: markDetails.markingProgress, isNonNumeric: this.treeViewHelper.isNonNumeric})));
        }
        return (React.createElement("div", {id: 'markSchemePanel', className: this.getMarkSchemePanelWrapperClassName(), ref: 'markScheme', style: stylePanel, onClick: this.onClickHandler}, React.createElement(PanelResizer, {id: 'panel-resizer', key: 'panel-resizer', hasPreviousColumn: hasPreviousColumn, renderedOn: this.state.renderedOnMarksColumnVisibilitySwitched, resizerType: enums.ResizePanelType.MarkSchemePanel}), React.createElement("div", {className: 'question-panel-holder'}, this.getPreviousMarksColumns(), this.getMarkSchemePanelHeader(), React.createElement("div", {className: 'question-panel', onTouchMove: this.onTouchMove, onWheel: this.onMouseWheel}, selectedQuestionItem, React.createElement(TreeView, {id: this.props.id, key: 'key_' + this.props.id, treeNodes: this.treeNodes, offset: this.state.offSet, navigateToMarkScheme: this.navigateToMarkScheme, onMarkSchemeSelected: this.onMarkSchemeSelected, reload: this.reloadTreeview, selectedLanguage: this.props.selectedLanguage, isNonNumeric: this.treeViewHelper.isNonNumeric, selectedMarkSchemeGroupId: this.markSchemeHelper.selectedNodeGet ? (this.markSchemeHelper.selectedNodeGet.markSchemeGroupId) : undefined, isWholeResponse: responseStore.instance.isWholeResponse, visibleTreeNodeCount: this.treeViewHelper.currentlyVisibleElementCount, isResponseEditable: this.props.isResponseEditable, linkedItems: this.linkedItemsUniqueIds})), React.createElement("div", {className: classNames('total-panel', {
            'supervisor-sampling-status': _doShowSamplingButton
        })}, this.completeButton(), totalMarkHolder, setAsReviewedButton, qualityFeedbackButton, samplingButton))));
    };
    /**
     * checking submit button visibility
     */
    MarkSchemePanel.prototype.checkIsSubmitVisible = function () {
        var submitresponse = new submitHelper();
        var responsedetails = worklistStore.instance.getResponseDetails(responseStore.instance.selectedDisplayId.toString());
        if (responsedetails === null) {
            // Should be removed in Release 3.
            return false;
        }
        var markDetails = this.treeViewHelper.totalMarkAndProgress;
        var isBlockerException = exceptionStore.instance.hasExceptionBlockers();
        // If the exceptions data loaded, Get the status from exceptions store, other wise set as true for disable the button.
        // Or if the worklist is simulation, then no blocking exceptions.
        var hasBlockingExceptions = exceptionStore.instance.hasExceptionsLoaded ||
            worklistStore.instance.currentWorklistType === enums.WorklistType.simulation
            ? isBlockerException
            : true;
        submitresponse.submitButtonValidate(responsedetails, markDetails.markingProgress, true, hasBlockingExceptions);
        this.isSubmitVisible =
            responsedetails.isSubmitEnabled &&
                markerOperationModeFactory.operationMode.isSubmitVisible;
        var isSubmitDisabled = (markerOperationModeFactory.operationMode.isSubmitDisabled(worklistStore.instance.currentWorklistType) ||
            isBlockerException) &&
            markerOperationModeFactory.operationMode.isSubmitDisabled(worklistStore.instance.currentWorklistType);
        this.isSubmitVisible = isSubmitDisabled ? false : this.isSubmitVisible;
        var markChangeReason = null;
        if (markDetails.markingProgress === 100 && this.isMarkChangeReasonVisible) {
            markChangeReason = markingStore.instance.getMarkChangeReason(markingStore.instance.currentMarkGroupId);
            if ((!markChangeReason || markChangeReason.length <= 0) &&
                !markerOperationModeFactory.operationMode.isTeamManagementMode &&
                !worklistStore.instance.isMarkingCheckMode) {
                this.isSubmitVisible = false;
            }
        }
        if (this.showRemarkDecisionButton() &&
            this.remarkDecision === enums.SupervisorRemarkDecisionType.none) {
            this.isSubmitVisible = false;
        }
        /* For ecoursework component, Submit button only available if all pages are viewed
           Submit button not available for team management or marking check mode.
        */
        if (eCourseworkHelper.isECourseworkComponent) {
            if (!eCourseWorkFileStore.instance.checkIfAllFilesViewed(responsedetails.markGroupId)) {
                this.isSubmitVisible = false;
            }
        }
        this.reRenderSubmitAndProgress = Date.now();
        return this.isSubmitVisible;
    };
    /**
     * OnClickHandler
     * @param event
     */
    MarkSchemePanel.prototype.onClickHandler = function (event) {
        stampActionCreator.showOrHideComment(false);
    };
    /**
     * show accept quality feedback confirmation dialog
     */
    MarkSchemePanel.prototype.showAcceptQualityConfirmationDialog = function () {
        this.props.showAcceptQualityConfirmationDialog();
    };
    /**
     * Clicking complete button
     */
    MarkSchemePanel.prototype.onCompleteButtonClick = function () {
        this.props.showCompleteButtonDialog();
    };
    /**
     * Set As Review Button Click
     */
    MarkSchemePanel.prototype.onReviewButtonClick = function (reviewComment) {
        var navigatePossible = true;
        this.selectedReviewCommentId = reviewComment;
        var responseNavigationFailureReasons = markingHelper.canNavigateAwayFromCurrentResponse();
        if (responseNavigationFailureReasons.indexOf(enums.ResponseNavigateFailureReason.UnSentMessage) !== -1) {
            // we have to display discard message warning if failure condition is unsendmessage only.
            // if multiple failure reasons are there then we will handle on that messages
            messagingActionCreator.messageAction(enums.MessageViewAction.NavigateAway, enums.MessageType.ResponseCompose, enums.SaveAndNavigate.toSetAsReviewed, enums.SaveAndNavigate.toSetAsReviewed);
        }
        else {
            this.props.invokeReviewBusyIndicator();
            teamManagementActionCreator.setResponseAsReviewed(this.currentResponseDetails.markGroupId, teamManagementStore.instance.selectedExaminerRoleId, // The logged in examiner role id
            responseHelper.isClosedLiveSeed, teamManagementStore.instance.examinerDrillDownData.examinerRoleId, // The role id of the examiner who was selected from TM
            teamManagementStore.instance.examinerDrillDownData.examinerId, qigStore.instance.selectedQIGForMarkerOperation.markSchemeGroupId, this.selectedReviewCommentId); //The selected review comment
        }
    };
    /**
     * returns mark by option component
     */
    MarkSchemePanel.prototype.markByOptionComponent = function () {
        var markByOption;
        if (markerOperationModeFactory.operationMode.hasMarkByOption &&
            !responseHelper.isAtypicalResponse()) {
            markByOption = (React.createElement(MarkByOption, {id: this.props.id + '-mark-by-option', key: this.props.id + '-mark-by-option', selectedLanguage: this.props.selectedLanguage}));
        }
        else {
            markByOption = React.createElement("div", {className: 'mark-by-holder'});
        }
        return markByOption;
    };
    /**
     * Returns enhanced off-page comments toggle button component
     * @private
     * @returns {JSX.Element}
     * @memberof MarkSchemePanel
     */
    MarkSchemePanel.prototype.commentsToggleButtonComponent = function (style) {
        if (markerOperationModeFactory.operationMode.isEnhancedOffPageCommentVisible) {
            var isEnhancedOffPageCommentVisible = enhancedOffPageCommentStore.instance.isEnhancedOffPageCommentsPanelVisible;
            return (React.createElement("div", {className: 'toggle-comment-holder'}, React.createElement("div", {className: 'comment-toggle-label', id: 'comment-toggle-label'}, localeStore.instance.TranslateText('marking.response.mark-scheme-panel.comments-switch-label')), React.createElement(ToggleButton, {id: this.props.id + '_toggle_button_comments', key: this.props.id + '_toggle_button_comments', isChecked: isEnhancedOffPageCommentVisible, index: 1, onChange: this.onCommentsToggleChange, style: style, title: isEnhancedOffPageCommentVisible ? (localeStore.instance.TranslateText('marking.response.mark-scheme-panel.comments-switch-tooltip-hide')) : (localeStore.instance.TranslateText('marking.response.mark-scheme-panel.comments-switch-tooltip-show')), onText: localeStore.instance.TranslateText('generic.toggle-button-states.on'), offText: localeStore.instance.TranslateText('generic.toggle-button-states.off')})));
        }
    };
    /**
     * get mark scheme panel header.
     */
    MarkSchemePanel.prototype.getMarkSchemePanelHeader = function () {
        var allMarksAndAnnotations = markingStore.instance.getAllMarksAndAnnotations();
        var marksAndAnnotationVisibilityDetails = markingStore.instance.getMarksAndAnnotationVisibilityDetails;
        var markByOption = this.markByOptionComponent();
        if (allMarksAndAnnotations) {
            var allMarksAndAnnotationsCollectionLength = allMarksAndAnnotations.length;
            var defaultColor = colouredAnnotationsHelper.createAnnotationStyle(null, enums.DynamicAnnotation.None).fill;
            var enhancedOffPageCommentToggleButton = this.commentsToggleButtonComponent(this.getEnhancedOffpageCommentToggleButtonColor(allMarksAndAnnotations, defaultColor));
            if (this.treeViewHelper.canRenderPreviousMarks() &&
                allMarksAndAnnotationsCollectionLength > 1) {
                return (React.createElement("div", {className: 'question-panel-header'}, enhancedOffPageCommentToggleButton, markByOption, React.createElement(MarkschemepanelHeaderDropdown, {id: this.props.id + '-remark-dropdown', key: this.props.id + '-remark-dropdown', selectedLanguage: this.props.selectedLanguage, renderedOnMarksAndAnnotationVisibility: this.state.renderedOnMarksAndAnnotationVisibility, hideAnnotationToggleButton: this.props.hideAnnotationToggleButton}), React.createElement("div", {className: 'pre-mark-title-holder'}, this.getPreviousMarksColumnHeadings())));
            }
            else {
                var _style = {};
                var _isCurrentAnnotationVisible = marksAndAnnotationsVisibilityHelper.isCurrentAnnotaionsVisible(marksAndAnnotationVisibilityDetails, markingStore.instance.currentMarkGroupId);
                _style.color = marksAndAnnotationsVisibilityHelper.getLiveClosedAnnotationToggleButtonColor(allMarksAndAnnotations, defaultColor, markingStore.instance.currentResponseMode);
                return (React.createElement("div", {className: 'question-panel-header'}, enhancedOffPageCommentToggleButton, markByOption, this.annotationToggleButton(_isCurrentAnnotationVisible, _style)));
            }
        }
    };
    /**
     * get previous marks column headings
     */
    MarkSchemePanel.prototype.getPreviousMarksColumnHeadings = function () {
        var allMarksAndAnnotations = markingStore.instance.getAllMarksAndAnnotations();
        // to get the previous column count removing the current marking
        var allMarksAndAnnotationsCount = allMarksAndAnnotations.length - 1;
        var marksAndAnnotationVisibilityDetails = markingStore.instance.getMarksAndAnnotationVisibilityDetails;
        var visiblityInfo = marksAndAnnotationsVisibilityHelper.getMarksAndAnnotationVisibilityInfo(marksAndAnnotationVisibilityDetails, markingStore.instance.currentMarkGroupId);
        var responseMode = responseStore.instance.selectedResponseMode;
        var counter = -1;
        var description;
        var header;
        var remarkBaseColor = colouredAnnotationsHelper.getRemarkBaseColor(enums.DynamicAnnotation.None).fill;
        var items = allMarksAndAnnotations.map(function (item) {
            counter++;
            var examinerMarksAgainstResponse = markingStore.instance.getExaminerMarksAgainstResponse;
            var allMarksAndAnnotation = examinerMarksAgainstResponse[markingStore.instance.currentMarkGroupId]
                .examinerMarkGroupDetails[markingStore.instance.selectedQIGMarkGroupId]
                .allMarksAndAnnotations[counter];
            var previousRemarkBaseColor = colouredAnnotationsHelper.getPreviousRemarkBaseColor(examinerMarksAgainstResponse);
            if (visiblityInfo.get(counter).isMarkVisible === true) {
                var markSchemeHeaderItems = marksAndAnnotationsVisibilityHelper.getMarkSchemePanelColumnHeaderAttributes(counter, item, allMarksAndAnnotationsCount, visiblityInfo, responseHelper.isClosedEurSeed, responseHelper.isClosedLiveSeed, remarkBaseColor, responseMode, responseHelper.getCurrentResponseSeedType(), markingStore.instance.currentMarkGroupId, worklistStore.instance.currentWorklistType, allMarksAndAnnotation, previousRemarkBaseColor);
                if (counter === 0) {
                    return null;
                }
                return (React.createElement("div", {key: 'pre-mark-title-' + counter.toString(), className: 'pre-mark-title', title: markSchemeHeaderItems.get('label')}, markSchemeHeaderItems.get('header')));
            }
        });
        return items;
    };
    /**
     * get previous marks columns
     */
    MarkSchemePanel.prototype.getPreviousMarksColumns = function () {
        var _this = this;
        if (this.treeViewHelper.canRenderPreviousMarks()) {
            var marksAndAnnotationVisibilityDetails = markingStore.instance.getMarksAndAnnotationVisibilityDetails;
            var visiblityInfo_1 = marksAndAnnotationsVisibilityHelper.getMarksAndAnnotationVisibilityInfo(marksAndAnnotationVisibilityDetails, markingStore.instance.currentMarkGroupId);
            var allMarksAndAnnotations = markingStore.instance.getAllMarksAndAnnotations();
            var currentMarkGroupId_1 = markingStore.instance.currentMarkGroupId;
            var counter_1 = -1;
            if (allMarksAndAnnotations === undefined || allMarksAndAnnotations === null) {
                return null;
            }
            var items = allMarksAndAnnotations.map(function (item) {
                counter_1++;
                // check the index for the allMarksAndAnnotations collection and see if column need to be rendered
                if (visiblityInfo_1 && visiblityInfo_1.get(counter_1).isMarkVisible === true) {
                    if (counter_1 === 0) {
                        return null;
                    }
                    else {
                        return (React.createElement("div", {key: 'previous-column-' + counter_1.toString(), className: 'pre-mark-col-bg', style: _this.getPreviousMarksColumnMarkSchemeColor(counter_1, currentMarkGroupId_1)}));
                    }
                }
            });
            return items !== null ? (React.createElement("div", {className: 'mark-bg-holder'}, React.createElement("div", {className: 'fader'}), items)) : (items);
        }
    };
    /**
     * Return the panel classname
     */
    MarkSchemePanel.prototype.getMarkSchemePanelWrapperClassName = function () {
        var questionPanelClass = 'marking-question-panel';
        var qualityFeedbackButton = markerOperationModeFactory.operationMode
            .isQualityFeedbackOutstanding
            ? ' allow-feedback'
            : '';
        if (this.resizePanelClassName) {
            questionPanelClass += ' ' + this.resizePanelClassName;
        }
        else {
            questionPanelClass = 'marking-question-panel';
        }
        if (this.isCompleteButtonVisible()) {
            questionPanelClass = questionPanelClass + ' allow-complete';
        }
        if (this.showRemarkDecisionButton()) {
            questionPanelClass = questionPanelClass + ' allow-reason';
        }
        // appending allow-set-as-review class for set as review button.
        if (markerOperationModeFactory.operationMode.allowReviewResponse) {
            questionPanelClass += ' allow-set-as-review';
        }
        if (this.treeViewHelper.canRenderPreviousMarks()) {
            var marksAndAnnotationVisibilityDetails = markingStore.instance.getMarksAndAnnotationVisibilityDetails;
            // appending previous mark scheme column count.
            questionPanelClass +=
                ' mark-col-' +
                    marksAndAnnotationsVisibilityHelper
                        .getMarksAndAnnotationVisibilityInfo(marksAndAnnotationVisibilityDetails, markingStore.instance.currentMarkGroupId)
                        .filter(function (x) { return x.isMarkVisible === true; })
                        .count();
            // appending allow-reason class for total marks alignment.
            questionPanelClass += this.isMarkChangeReasonVisible ? ' allow-reason' : '';
            // appending allow-feedback class for quality feedback button alignment.
            questionPanelClass += markerOperationModeFactory.operationMode
                .isQualityFeedbackOutstanding
                ? ' allow-feedback'
                : '';
            return questionPanelClass;
        }
        else {
            return questionPanelClass + ' mark-col-1';
        }
    };
    /**
     * Get previous marks column mark scheme color.
     * @param index
     * @param markGroupId
     */
    MarkSchemePanel.prototype.getPreviousMarksColumnMarkSchemeColor = function (index, markGroupId) {
        var examinerMarksAgainstResponse = markingStore.instance.getExaminerMarksAgainstResponse;
        var allMarksAndAnnotation = examinerMarksAgainstResponse[markGroupId].examinerMarkGroupDetails[markGroupId]
            .allMarksAndAnnotations[index];
        var previousRemarkBaseColor = colouredAnnotationsHelper.getPreviousRemarkBaseColor(allMarksAndAnnotation);
        var color = marksAndAnnotationsVisibilityHelper.getPreviousMarksColumnMarkSchemeColor(index, worklistStore.instance.currentWorklistType, worklistStore.instance.getResponseMode, responseHelper.getCurrentResponseSeedType(), markingStore.instance.currentMarkGroupId, allMarksAndAnnotation, previousRemarkBaseColor);
        return {
            background: color
        };
    };
    /**
     * checking whether the current response is fully marked or not
     */
    MarkSchemePanel.prototype.isFullyMarked = function () {
        if (this.treeViewHelper.totalMarkAndProgress.markingProgress === 100) {
            return true;
        }
        else {
            return false;
        }
    };
    /**
     * This function gets invoked when the component is about to be mounted
     */
    MarkSchemePanel.prototype.componentDidMount = function () {
        var isRenderMarkschemePanel = false;
        /* checking whether selectedNode exist or not, if not exist then point to the first markableitem */
        if (!this.markSchemeHelper.selectedNodeGet) {
            /** getting the first markable node and setting it as selected */
            var selectedNode = this.getNextMarkableItem();
            this.navigateToMarkScheme(selectedNode, true, false, true);
        }
        else {
            this.isFirstLoad = false;
            // markschemepanel was not rendering correctly when it is in simulation mode( Reason : excption and message icon removed)
            // isSelected value of selected question item became true after rerendering.
            if (worklistStore.instance.currentWorklistType === enums.WorklistType.simulation) {
                isRenderMarkschemePanel = true;
            }
            this.navigateToMarkScheme(this.markSchemeHelper.selectedNodeGet, true, false, isRenderMarkschemePanel);
        }
        // When the use switches back from the full responseview,
        // we should update the current update in selected questionitem.
        this.isResponseChanged = Date.now();
        this.reloadTreeview = Date.now();
        markingStore.instance.addListener(markingStore.MarkingStore.SAVE_AND_NAVIGATE_EVENT, this.saveAndNavigate);
        markingStore.instance.addListener(markingStore.MarkingStore.RESET_MARK_AND_ANNOTATION, this.resetMarksAndAnnotation);
        // Update the mark scheme panel on annotation add/remove.
        markingStore.instance.addListener(markingStore.MarkingStore.ANNOTATION_ADDED, this.refreshMarkSchemePanelOnAddAnnotation);
        markingStore.instance.addListener(markingStore.MarkingStore.REMOVE_ANNOTATION, this.refreshMarkSchemePanelOnRemoveAnnotation);
        markingStore.instance.addListener(markingStore.MarkingStore.MARK_SCHEME_NAVIGATION, this.initiateTransition);
        markingStore.instance.addListener(markingStore.MarkingStore.UPDATE_MARK_AS_NR_FOR_UNMARKED_ITEMS, this.enterNRForUnMarkedItems);
        markingStore.instance.addListener(markingStore.MarkingStore.CURRENT_QUESTION_ITEM_CHANGE_EVENT, this.onQuestionItemChanged);
        markingStore.instance.addListener(markingStore.MarkingStore.MARKS_AND_ANNOTATION_VISIBILITY_CHANGED, this.handleMarksAndAnnotationsVisibility);
        markingStore.instance.addListener(markingStore.MarkingStore.ANNOTATION_UPDATED, this.refreshMarkSchemePanelOnUpdateAnnotation);
        markingStore.instance.addListener(markingStore.MarkingStore.MARK_CHANGE_REASON_UPDATED, this.markChangeReasonUpdate);
        markingStore.instance.addListener(markingStore.MarkingStore.SUPERVISOR_REMARK_DECISION_UPDATED, this.supervisorRemarkDecisionUpdate);
        if (deviceHelper.isTouchDevice()) {
            this.setUpEvents();
        }
        // if message panel is visible then we don't need to activate keyDownHelper
        if (!messageStore.instance.isMessagePanelVisible &&
            !exceptionStore.instance.isExceptionPanelVisible) {
            keyDownHelper.instance.Activate(enums.MarkEntryDeactivator.Messaging);
        }
        markingStore.instance.addListener(markingStore.MarkingStore.MARKSCHEME_PANEL_RESIZE_CLASSNAME, this.panelClassName);
        markingStore.instance.addListener(markingStore.MarkingStore.PANEL_WIDTH, this.onPanelResize);
        exceptionStore.instance.addListener(exceptionStore.ExceptionStore.GET_EXCEPTIONS, this.onExceptionChange);
        exceptionStore.instance.addListener(exceptionStore.ExceptionStore.CLOSE_EXCEPTION_WINDOW, this.onExceptionChange);
        markingStore.instance.addListener(markingStore.MarkingStore.UPDATE_PANEL_WIDTH, this.onUpdatePanelWidth);
        markingStore.instance.addListener(markingStore.MarkingStore.RESPONSE_FULLY_MARKED_EVENT, this.reRenderMarkChangeReason);
        this.markSchemePanelTransition = document
            .getElementsByClassName('marking-question-panel')
            .item(0);
        if (this.markSchemePanelTransition) {
            this.markSchemePanelTransition.addEventListener('transitionend', this.onAnimationEnd);
        }
        markingStore.instance.addListener(markingStore.MarkingStore.READY_TO_NAVIGATE, this.navigateAwayFromResponse);
        markingStore.instance.addListener(markingStore.MarkingStore.NOTIFY_MARK_UPDATED, this.notifyMarkUpdated);
        markingStore.instance.addListener(markingStore.MarkingStore.ADD_MARK_BY_ANNOTATION, this.doStampAnnotation);
        worklistStore.instance.addListener(worklistStore.WorkListStore.RESPONSE_REVIEWED, this.setResponseAsReviewed);
        markingStore.instance.addListener(markingStore.MarkingStore.REMOVE_MARKS_BY_ANNOTATION, this.removeAnnotationMark);
        markingStore.instance.addListener(markingStore.MarkingStore.RETRIEVE_MARKS_EVENT, this.marksRetrieved);
        enhancedOffPageCommentStore.instance.addListener(enhancedOffPageCommentStore.EnhancedOffPageCommentStore
            .ENHANCED_OFF_PAGE_COMMENTS_VISIBILITY_CHANGED, this.handleEnhancedOffPageCommentsVisibility);
        enhancedOffPageCommentStore.instance.addListener(enhancedOffPageCommentStore.EnhancedOffPageCommentStore
            .UPDATE_ENHANCED_OFFPAGE_COMMENT_DATA, this.enableToggleButtonOnEnhancedCommentUpdate);
        markingStore.instance.addListener(markingStore.MarkingStore.ALL_FILES_VIEWED_CHECK, this.updateFileReadStatusonNavigation);
        toolbarStore.instance.addListener(toolbarStore.ToolbarStore.PAN_STAMP_TO_DELETION_AREA, this.onStampPanToDeleteArea);
        markingStore.instance.addListener(markingStore.MarkingStore.QIG_CHANGED_IN_WHOLE_RESPONSE_EVENT, this.navigateToQigInWholeResponse);
        stampStore.instance.addListener(stampStore.StampStore.UPDATE_OFFPAGE_VISIBILITY_STATUS_EVENT, this.handleEnhancedOffPageCommentsVisibility);
        markingStore.instance.addListener(markingStore.MarkingStore.PREVIOUS_MARKS_AND_ANNOTATIONS_COPIED, this.onPreviousMarksAnnotationCopied);
        markingStore.instance.addListener(markingStore.MarkingStore.RESPONSE_VIEW_MODE_CHANGED, this.onExceptionChange);
    };
    /**
     * This function gets invoked when the component is about to be unmounted
     */
    MarkSchemePanel.prototype.componentWillUnmount = function () {
        markingStore.instance.removeListener(markingStore.MarkingStore.SAVE_AND_NAVIGATE_EVENT, this.saveAndNavigate);
        markingStore.instance.removeListener(markingStore.MarkingStore.RESET_MARK_AND_ANNOTATION, this.resetMarksAndAnnotation);
        markingStore.instance.removeListener(markingStore.MarkingStore.ANNOTATION_ADDED, this.refreshMarkSchemePanelOnAddAnnotation);
        markingStore.instance.removeListener(markingStore.MarkingStore.REMOVE_ANNOTATION, this.refreshMarkSchemePanelOnRemoveAnnotation);
        markingStore.instance.removeListener(markingStore.MarkingStore.UPDATE_MARK_AS_NR_FOR_UNMARKED_ITEMS, this.enterNRForUnMarkedItems);
        /*  Removed  -- This add the markgroup to gueue with isDirty as true, result in unwanted save
        When user clicks on back button, we will have to save the currently entered mark
        if (worklistStore.instance.getResponseMode !== enums.ResponseMode.closed) {
            this.triggerSave(false);
        }*/
        markingStore.instance.removeListener(markingStore.MarkingStore.MARK_SCHEME_NAVIGATION, this.initiateTransition);
        markingStore.instance.removeListener(markingStore.MarkingStore.CURRENT_QUESTION_ITEM_CHANGE_EVENT, this.onQuestionItemChanged);
        markingStore.instance.removeListener(markingStore.MarkingStore.MARKS_AND_ANNOTATION_VISIBILITY_CHANGED, this.handleMarksAndAnnotationsVisibility);
        markingStore.instance.removeListener(markingStore.MarkingStore.ANNOTATION_UPDATED, this.refreshMarkSchemePanelOnUpdateAnnotation);
        markingStore.instance.removeListener(markingStore.MarkingStore.MARK_CHANGE_REASON_UPDATED, this.markChangeReasonUpdate);
        markingStore.instance.removeListener(markingStore.MarkingStore.SUPERVISOR_REMARK_DECISION_UPDATED, this.supervisorRemarkDecisionUpdate);
        if (deviceHelper.isTouchDevice()) {
            this.unRegisterEvents();
        }
        markingStore.instance.removeListener(markingStore.MarkingStore.MARKSCHEME_PANEL_RESIZE_CLASSNAME, this.panelClassName);
        markingStore.instance.removeListener(markingStore.MarkingStore.PANEL_WIDTH, this.onPanelResize);
        exceptionStore.instance.removeListener(exceptionStore.ExceptionStore.GET_EXCEPTIONS, this.onExceptionChange);
        exceptionStore.instance.removeListener(exceptionStore.ExceptionStore.CLOSE_EXCEPTION_WINDOW, this.onExceptionChange);
        markingStore.instance.removeListener(markingStore.MarkingStore.UPDATE_PANEL_WIDTH, this.onUpdatePanelWidth);
        markingStore.instance.removeListener(markingStore.MarkingStore.RESPONSE_FULLY_MARKED_EVENT, this.reRenderMarkChangeReason);
        this.markSchemePanelTransition.removeEventListener('transitionend', this.onAnimationEnd);
        markingStore.instance.removeListener(markingStore.MarkingStore.READY_TO_NAVIGATE, this.navigateAwayFromResponse);
        markingStore.instance.removeListener(markingStore.MarkingStore.NOTIFY_MARK_UPDATED, this.notifyMarkUpdated);
        markingStore.instance.removeListener(markingStore.MarkingStore.ADD_MARK_BY_ANNOTATION, this.doStampAnnotation);
        worklistStore.instance.removeListener(worklistStore.WorkListStore.RESPONSE_REVIEWED, this.setResponseAsReviewed);
        markingStore.instance.removeListener(markingStore.MarkingStore.REMOVE_MARKS_BY_ANNOTATION, this.removeAnnotationMark);
        markingStore.instance.removeListener(markingStore.MarkingStore.RETRIEVE_MARKS_EVENT, this.marksRetrieved);
        enhancedOffPageCommentStore.instance.removeListener(enhancedOffPageCommentStore.EnhancedOffPageCommentStore
            .ENHANCED_OFF_PAGE_COMMENTS_VISIBILITY_CHANGED, this.handleEnhancedOffPageCommentsVisibility);
        enhancedOffPageCommentStore.instance.removeListener(enhancedOffPageCommentStore.EnhancedOffPageCommentStore
            .UPDATE_ENHANCED_OFFPAGE_COMMENT_DATA, this.enableToggleButtonOnEnhancedCommentUpdate);
        markingStore.instance.removeListener(markingStore.MarkingStore.ALL_FILES_VIEWED_CHECK, this.updateFileReadStatusonNavigation);
        toolbarStore.instance.removeListener(toolbarStore.ToolbarStore.PAN_STAMP_TO_DELETION_AREA, this.onStampPanToDeleteArea);
        markingStore.instance.removeListener(markingStore.MarkingStore.QIG_CHANGED_IN_WHOLE_RESPONSE_EVENT, this.navigateToQigInWholeResponse);
        stampStore.instance.removeListener(stampStore.StampStore.UPDATE_OFFPAGE_VISIBILITY_STATUS_EVENT, this.handleEnhancedOffPageCommentsVisibility);
        markingStore.instance.removeListener(markingStore.MarkingStore.PREVIOUS_MARKS_AND_ANNOTATIONS_COPIED, this.onPreviousMarksAnnotationCopied);
        markingStore.instance.removeListener(markingStore.MarkingStore.RESPONSE_VIEW_MODE_CHANGED, this.onExceptionChange);
    };
    Object.defineProperty(MarkSchemePanel.prototype, "canNavigateMbQSingleDigitMark", {
        /**
         * Determines MBQ single digit markscheme navigation is needed.
         * @param isMbQSelected
         */
        get: function () {
            var isSingleDigitMarkWithoutEnter = userOptionsHelper.getUserOptionByName(userOptionKeys.ASSIGN_SINGLE_DIGIT_WITHOUT_PRESSING_ENTER) === 'true'
                ? true
                : false;
            if (this.doTriggerResponseNavigation &&
                this.currentQuestionItem.isSingleDigitMark &&
                !this.props.ismarkEntryPopupVisible &&
                responseHelper.isMbQSelected &&
                isSingleDigitMarkWithoutEnter) {
                return true;
            }
            else {
                return false;
            }
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Markscheme navigation MBQ single digit markscheme.
     */
    MarkSchemePanel.prototype.navigateMbQSingleDigitMarkScheme = function () {
        if (this.markSchemeHelper.isLastResponseLastQuestion) {
            this.scrollHelper.navigateMarkSchemeOnDemand(true);
            return;
        }
        if (!markSchemeHelper.isNextResponseAvailable) {
            this.setNextMarkSchemeItem();
        }
        this.scrollHelper.navigateMarkSchemeOnDemand(true);
    };
    Object.defineProperty(MarkSchemePanel.prototype, "isMbaNRClicked", {
        /**
         * Returns MBA NR button clicked.
         * @param isMbaCCActive
         */
        get: function () {
            return this.isMBaCCOn && this.isNRclicked;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MarkSchemePanel.prototype, "isSelectResponsesButtonVisible", {
        /**
         * conditions where the select Response to mark button in SSU centre script is visible.
         */
        get: function () {
            var isPEOrAPE = qigStore.instance.selectedQIGForMarkerOperation.role ===
                enums.ExaminerRole.principalExaminer ||
                qigStore.instance.selectedQIGForMarkerOperation.role ===
                    enums.ExaminerRole.assistantPrincipalExaminer;
            /**
             * select to mark button shown under below conditions
             * 1. Script in 'Available' status
             * 2. logged-in marker has browse permission (STM member)
             * 3. In case the Standardisation setup is complete, the button shall be visible only if the logged-in marker is a PE/APE.
             * 4. ExaminerCentreExclusivity CC is enabled and Standardisation setup has been completed - not shown for PE as well.
             */
            var isSelectResponseButtonVisible = standardisationSetupStore.instance.selectedScriptAvailable &&
                qigStore.instance.selectedQIGForMarkerOperation.isElectronicStandardisationTeamMember;
            if (markerOperationModeFactory.operationMode.isUnclassifiedTabInStdSetup) {
                return (standardisationSetupStore.instance.stdSetupPermissionCCData.role.permissions.editDefinitives === true);
            }
            else if ((qigStore.instance.selectedQIGForMarkerOperation.standardisationSetupComplete && !isPEOrAPE) ||
                (configurableCharacteristicsValues.examinerCentreExclusivity
                    && qigStore.instance.selectedQIGForMarkerOperation.standardisationSetupComplete)) {
                isSelectResponseButtonVisible = false;
            }
            return isSelectResponseButtonVisible;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Comparing the props to check the updats are made by self
     * @param {Props} nextProps
     */
    MarkSchemePanel.prototype.componentWillReceiveProps = function (nextProps) {
        this.isNavigationInsideTree =
            this.props.loadMarkSchemePanel === nextProps.loadMarkSchemePanel;
        // avoid any additional rendering of the markscheme panel/ treeview while resizing
        if (!this.resizePanelClassName) {
            this.samplingRenderedOn = Date.now();
            this.reloadTreeview = Date.now();
        }
        // Sometimes Copying mark and annotations are happening before the mark scheme panel is rendered.
        // Due to this marking progress is not turned to 100 while navigating to worklist. So while initialising mark scheme panel
        // check the dirty flag needs to be set for the progress based on isPreviousMarksAndAnnotationCopied.
        if (!this.props.isPreviousMarksAndAnnotationCopied &&
            nextProps.isPreviousMarksAndAnnotationCopied) {
            this.isResponseDirty = true;
        }
    };
    /**
     * This function gets invoked when the component is about to be updated
     */
    MarkSchemePanel.prototype.componentDidUpdate = function () {
        /* Navigate to first node only if response is changed . Managing this using the first load flag (setting true initialy)*/
        if (this.isFirstLoad === true) {
            var markDetails = this.treeViewHelper.totalMarkAndProgress;
            /* if a new response is opened then the initial marking progress should be updated to the marking store */
            markingActionCreator.updateInitialMarkingProgress(markDetails.markingProgress);
            this._initialMarkingProgress = markDetails.markingProgress;
            ///* if a new response is opened then the initial marking progress should be updated to the marking store */
            //markingActionCreator.updateInitialMarkingProgress(this.markDetails.markingProgress);
            /** resetting after first use */
            this.isFirstLoad = false;
            var selectedNode = this.getNextMarkableItem();
            this.navigateToMarkScheme(selectedNode, true, false, true);
            // Reload the selected item to reflect the actual mark
            // mark entry textbox.
            this.isResponseChanged = Date.now();
        }
        this.markScheme = ReactDom.findDOMNode(this.refs.markScheme);
        if (this.markScheme) {
            this.containerWidth = this.markScheme.getBoundingClientRect().width;
            this.props.getMarkSchemePanelWidth(this.containerWidth);
        }
    };
    /**
     * This function will return the node item for setting it as selected in markscheme .
     * If it is fully marked,not mrakscheme navigtion,then the first question item shall be selected by default.
     * If the response not fully marked then examiner shall be taken to the first unmarked question item of that response.
     * In team management mode, the first question item shall be selected by default.
     */
    MarkSchemePanel.prototype.getNextMarkableItem = function () {
        var selectedNode;
        /*set the selectedNode as unmarked item when it is 100% marked and navigation is not through markscheme.*/
        if (this.treeNodes.markingProgress < 100 &&
            markingStore.instance.isNavigationThroughMarkScheme !==
                enums.ResponseNavigation.markScheme &&
            markerOperationModeFactory.operationMode.isGetFirstUnmarkedItem) {
            selectedNode = navigationHelper.getFirstUnmarkedItem(this.treeNodes, true);
        }
        else {
            var uniqueId = 0;
            if (this.treeNodes.bIndex !== this.previousTreeNodeBIndex &&
                !markerOperationModeFactory.operationMode.isTeamManagementMode) {
                uniqueId = worklistStore.instance.selectedQuestionItemUniqueId;
            }
            selectedNode = this.markSchemeHelper.getMarkableItem(this.treeNodes, this.getSelectedQuestionItemBIndex, undefined, uniqueId);
        }
        return selectedNode;
    };
    /**
     * Invoked when the markscheme got selected.
     * @param {number} uniqueId
     * @param isMarkUpdatedWithoutNavigation
     */
    MarkSchemePanel.prototype.navigateToMarkScheme = function (node, isInitialLoading, isMarkUpdatedWithoutNavigation, forceRender) {
        if (isInitialLoading === void 0) { isInitialLoading = false; }
        if (isMarkUpdatedWithoutNavigation === void 0) { isMarkUpdatedWithoutNavigation = false; }
        if (forceRender === void 0) { forceRender = false; }
        if (node) {
            // If navigation is happening from one qig to another and there is an enhanced off page comment edited,
            // then show the discard comment popup and prevent navigation to next question item.
            if (this.markSchemeHelper.selectedNodeGet &&
                this.markSchemeHelper.selectedNodeGet.markSchemeGroupId !==
                    node.markSchemeGroupId &&
                enhancedOffPageCommentStore.instance.isEnhancedOffPageCommentEdited) {
                this.props.onEnhancedOffPageCommentVisibilityChanged(enums.EnhancedOffPageCommentAction.MarkSchemeNavigation, null, true, node);
                return;
            }
            //For Single Qig,MarkschemeGroupid will come as null so setting it to markschemegroupid
            //of selected qig
            if (node.markSchemeGroupId === 0) {
                node.markSchemeGroupId =
                    qigStore.instance.selectedQIGForMarkerOperation.markSchemeGroupId;
            }
            if (!isInitialLoading && markingStore.instance.isMarkingInProgress) {
                this.nextNode = node;
                this.triggerSave(isMarkUpdatedWithoutNavigation);
            }
            else {
                this.treeNodes.treeViewItemList = this.markSchemeHelper.navigateToMarkScheme(node, this.treeNodes, forceRender);
                /* setting true when navigation with in the panel */
                this.isNavigationInsideTree = true;
            }
        }
        else if (markingStore.instance.isMarkingInProgress) {
            this.triggerSave(true);
            if (this.isLastNodeSelected) {
                // fix for defect : #38482 - usually the activation happens as the image load occurs in response.
                // container but for the last markscheme the image load wont happen and so the keydown helper
                // will be in deactive state. so to move up activating the keydownhelper.
                keyDownHelper.instance.Activate(enums.MarkEntryDeactivator.TriggerSave);
            }
        }
        /* For a team member other than PE should be able to edit or remove the shared overlay.
           But it should be reappear next the response navigation.
           And also the overlay changes should not be saved in the database.
           Reset shared acetates only for structured response. */
        if (responseStore.instance.markingMethod === enums.MarkingMethod.Structured) {
            acetatesActionCreator.resetSharedAcetate();
        }
    };
    /**
     * Select the navigated markscheme on the UI
     * @param index
     * @param elementHeight
     */
    MarkSchemePanel.prototype.onMarkSchemeSelected = function (index, elementHeight) {
        // TODO need to select the highligter offset from store once the component has been created.
        var y = (0 -
            (this.markSchemeHelper.selectedPanelOffSet + (index - 1) * elementHeight)).toString();
        if (this.state.offSet !== y) {
            /* setting true when navigation with in the panel */
            this.isNavigationInsideTree = true;
            this.reloadTreeview = Date.now();
            this.setState({ offSet: y });
        }
    };
    /**
     * Loading marking scheme structure
     */
    MarkSchemePanel.prototype.loadMarkSchemeStructure = function () {
        // Defect 66311 fix - Don't reset isResponseDirty flag, setting on copying marks and annotations
        if (!this.props.isPreviousMarksAndAnnotationCopied) {
            this.isResponseDirty = false;
        }
        this.treeViewHelper = new treeViewDataHelper();
        this.previousTreeNodeBIndex = this.treeNodes ? this.treeNodes.bIndex : 0;
        this.treeNodes = this.treeViewHelper.getMarkSchemeStructureNodeCollection();
        if (responseStore.instance.isWholeResponse) {
            this.navigateToQigInWholeResponse(markingStore.instance.selectedQIGMarkSchemeGroupId, undefined);
        }
        /* update the annotation tooltips information */
        this.markSchemeHelper.updateAnnotationToolTips(this.treeViewHelper.toolTipInfo);
        /* If the user is navigating from full response view then the selected item should updated from the new treeNodes instance
         * Otherwise the reference will change */
        if (!this.markSchemeHelper.selectedNodeGet) {
            // If user navigating from full response view using mark this page option then we have to find and navigate to the
            // corresponding mark scheme in structured response
            if (responseStore.instance.imageZonesAgainstPageNumber) {
                this.markSchemeHelper.updateSelectedNode(this.markSchemeHelper.getFirstMarkableItemFromImageZones(this.treeNodes, responseStore.instance.imageZonesAgainstPageNumber, responseStore.instance.linkedAnnotationAgainstPageNumber));
            }
            else if (markingStore.instance.currentQuestionItemInfo) {
                this.markSchemeHelper.updateSelectedNode(this.markSchemeHelper.getMarkableItem(this.treeNodes, markingStore.instance.currentQuestionItemInfo.bIndex));
            }
        }
        /* marks management helper object */
        this.marksManagementHelper = new marksManagementHelper();
        this.originalMarkList = this.treeViewHelper.originalMarks;
        this.checkMarkChangeReason();
        /** selecting the index of first markable item (used for swipe node calculation) */
        this.firstMarkSchemeIndex = this.markSchemeHelper.getMarkableItem(this.treeNodes, this.getSelectedQuestionItemBIndex).index;
        /** initialy the first node is selected and setting the flag which indicates that selection */
        this.isFirstNodeSelected = true;
        if (this.markSchemeHelper.selectedNodeGet &&
            this.markSchemeHelper.selectedNodeGet.nextIndex === 0) {
            this.isLastNodeSelected = true;
        }
        else {
            this.isLastNodeSelected = false;
        }
        markingActionCreator.isLastNodeSelected(this.isLastNodeSelected);
        /** Setting the first load flag true on initial loading */
        this.isFirstLoad = true;
        if (this.treeViewHelper.canRenderPreviousMarks()) {
            this.treeViewHelper.traverseMarkSchemeTree(this.treeNodes);
        }
        if (this.showRemarkDecisionButton()) {
            // Reset the accuracy on load/response navigation and then calculate the accuracy again.
            this.accuracyIndicator = undefined;
            this.remarkDecision = markingStore.instance.convertSupervisorRemarkDecisionType();
            this.calculateAccuracy();
        }
    };
    /**
     * Downward movment of tree on down arrow click
     */
    MarkSchemePanel.prototype.moveNext = function () {
        // Defect 29988 fix - this.isKeyActionOnProgress check is only for closed response worklist( fix for defect 34003),
        // no need to block the move in other response modes
        if (worklistStore.instance.getResponseMode !== enums.ResponseMode.closed ||
            this.isKeyActionOnProgress === false) {
            if (!this.isLastNodeSelected) {
                this.isKeyActionOnProgress = true;
            }
            var nextNode = this.getNextMarkScheme;
            if (nextNode) {
                this.navigateToMarkScheme(nextNode);
            }
            else {
                /** if the selected mark scheme is the last one then no further move is allowed
                 * eventhough move next will be called when on enter key press or mark buttons press
                 * in order to save the entered mark for the last mark scheme, trigger navigate to mark scheme
                 */
                this.navigateToMarkScheme(nextNode, undefined, true);
            }
            // persist rotation if the image clustre id is same
            if (markingHelper.isImageClusterChanged()) {
                responseActionCreator.updateDisplayAngleOfResponse(true);
            }
        }
    };
    /**
     * Upward movment of tree on up arrow click
     */
    MarkSchemePanel.prototype.movePrev = function () {
        // Defect 29988 fix - this.isKeyActionOnProgress check is only for closed response worklist( fix for defect 34003),
        // no need to block the move in other response modes
        if (worklistStore.instance.getResponseMode !== enums.ResponseMode.closed ||
            this.isKeyActionOnProgress === false) {
            if (!this.isFirstNodeSelected) {
                this.isKeyActionOnProgress = true;
            }
            var prevNode = this.getPreviousMarkScheme;
            if (prevNode) {
                this.navigateToMarkScheme(prevNode);
            }
            // persist rotation if the image clustre id is same
            if (markingHelper.isImageClusterChanged()) {
                responseActionCreator.updateDisplayAngleOfResponse(true);
            }
        }
    };
    /**
     * To set the variables which describes whether the first node /last node is currently selected.
     */
    MarkSchemePanel.prototype.setSelectedNodeTypes = function () {
        this.isLastNodeSelected = false;
        this.isFirstNodeSelected = false;
        // If the selected node is the only one in the markscheme
        if (this.markSchemeHelper.selectedNodeGet.previousIndex === 0 &&
            this.markSchemeHelper.selectedNodeGet.nextIndex === 0) {
            this.isFirstNodeSelected = true;
            this.isLastNodeSelected = true;
        }
        else if (this.markSchemeHelper.selectedNodeGet.previousIndex === 0) {
            // The current markscheme has previous markscheme.
            this.isFirstNodeSelected = true;
        }
        if (this.markSchemeHelper.selectedNodeGet.nextIndex === 0) {
            this.isLastNodeSelected = true;
        }
        markingActionCreator.isLastNodeSelected(this.isLastNodeSelected);
    };
    /**
     * Update mark to the client.
     * @param {string} allocatedMark
     */
    MarkSchemePanel.prototype.updateMark = function () {
        var previousMarkingProgress = this.treeNodes.markingProgress;
        var warningNR;
        /* calculating total mark, cluster total and marking progress */
        this.treeNodes = this.treeViewHelper.updateMarkDetails(this.treeNodes, this.currentQuestionItem.bIndex, this.marksManagementHelper);
        /* retrieving newly calculated mark details */
        var markDetails = this.treeViewHelper.totalMarkAndProgress;
        this.isResponseDirty = true;
        this.isNavigationInsideTree = true;
        // Update current selected markscheme mark in selection.
        this.markSchemeHelper.updateSelectedQuestionMark(this.currentQuestionItem);
        this.checkMarkChangeReason(this.currentQuestionItem.allocatedMarks.displayMark);
        if (previousMarkingProgress === 100 && this.treeNodes.markingProgress !== 100) {
            this.resetDecision();
        }
        /* call set states with new mark details */
        this.selectedQuestionItemRenderedOn = Date.now();
        this.reloadTreeview = Date.now();
        this.setState({
            renderedOn: Date.now(),
            renderedOnMarkChangeReason: Date.now()
        });
        // if the response is 100 % marked ,then check the NR warning condition based on CC
        // and optionality applyed for that  question paper.
        if (this.treeNodes.markingProgress === 100) {
            warningNR = markingHelper.getWarningNRDetails(this.treeNodes);
        }
        // Update the marking button to reflect the change
        markingActionCreator.notifyMarkUpdated(markDetails.markingProgress, warningNR);
    };
    /**
     * Checking mark change reason
     * @param {string} allocatedMark
     */
    MarkSchemePanel.prototype.checkMarkChangeReason = function (allocatedMark) {
        if (allocatedMark === void 0) { allocatedMark = undefined; }
        var allMarksAndAnnotations = markingStore.instance.getAllMarksAndAnnotations();
        if (allMarksAndAnnotations) {
            var allMarksAndAnnotationsWithIsDefault = allMarksAndAnnotations.filter(function (x) { return x.isDefault === true; });
            if (allMarksAndAnnotationsWithIsDefault.length === 0 &&
                allMarksAndAnnotations[1] !== undefined) {
                allMarksAndAnnotationsWithIsDefault =
                    allMarksAndAnnotations[1].examinerMarksCollection;
            }
            // Check whether previous marks are empty or not
            if (allMarksAndAnnotationsWithIsDefault.length > 0) {
                if (worklistStore.instance.currentWorklistType === enums.WorklistType.directedRemark) {
                    var isMarkChangeReasonVisible = undefined;
                    if (this.treeViewHelper.totalMarkAndProgress.markingProgress === 100) {
                        if (allocatedMark) {
                            isMarkChangeReasonVisible = markChangeReasonHelper.isMarkChangeReasonVisible(this.currentQuestionItem.uniqueId, allocatedMark);
                        }
                        else {
                            isMarkChangeReasonVisible = markChangeReasonHelper.isMarkChangeReasonVisible();
                        }
                        this.isMarkChangeReasonVisible = isMarkChangeReasonVisible;
                        markingActionCreator.setMarkChangeReasonVisibility(this.isMarkChangeReasonVisible);
                    }
                    else {
                        this.isMarkChangeReasonVisible = false;
                        markingActionCreator.setMarkChangeReasonVisibility(this.isMarkChangeReasonVisible);
                    }
                }
            }
            else {
                this.isMarkChangeReasonVisible = false;
                markingActionCreator.setMarkChangeReasonVisibility(this.isMarkChangeReasonVisible);
            }
        }
    };
    /**
     * Trigger on touch move.
     */
    MarkSchemePanel.prototype.onTouchMove = function (event) {
        /** To prevent the default flickering behavior of ipad safari */
        event.preventDefault();
    };
    /**
     * Trigger on swipe move.
     */
    MarkSchemePanel.prototype.onSwipe = function (event) {
        if (this.resizePanelClassName) {
            event.preventDefault();
            return;
        }
        //to prevent infinate render
        if (this.props.doEnableMouseWheelEvent) {
            event.preventDefault();
            this.eventHandler.stopPropagation(event);
            var displacement = event.deltaY;
            var timeTaken = event.deltaTime;
            this.moveOnSwipeAndPan(true, displacement, timeTaken);
        }
        else {
            event.preventDefault();
        }
    };
    /**
     * Trigger on touch move.
     */
    MarkSchemePanel.prototype.onPanMove = function (event) {
        if (this.resizePanelClassName) {
            event.preventDefault();
            return;
        }
        //to prevent infinate render
        if (this.props.doEnableMouseWheelEvent) {
            event.preventDefault();
            this.eventHandler.stopPropagation(event);
            var displacement = event.deltaY;
            var timeTaken = event.deltaTime;
            if (Math.abs(displacement) - this.previousDeltaY > MOVE_FACTOR_PIXEL &&
                event.velocity !== 0) {
                this.moveOnSwipeAndPan(false, displacement, timeTaken);
                this.previousDeltaY = Math.abs(event.deltaY);
            }
        }
        else {
            event.preventDefault();
        }
    };
    /**
     * Trigger on touch end.
     */
    MarkSchemePanel.prototype.onPanEnd = function (event) {
        if (this.resizePanelClassName) {
            event.preventDefault();
            return;
        }
        this.previousDeltaY = 0;
    };
    /**
     * to handle the navigation on mouse wheel
     */
    MarkSchemePanel.prototype.onMouseWheel = function (event) {
        // If stamp paned beyoned the boundries then disable the mouse wheel event to fix the browser gets stuck issue.
        if (this.doEnableMouseWheel() &&
            this.props.doEnableMouseWheelEvent &&
            !this.isStampPanedBeyondBoundaries) {
            stampActionCreator.showOrHideComment(false);
            // Close Bookmark Name Entry Box
            stampActionCreator.showOrHideBookmarkNameBox(false);
            var delta = event.deltaY;
            if (delta > 0) {
                if (!this.isLastNodeSelected) {
                    this.isMouseWheelOnProgress = true;
                    this.moveNext();
                }
            }
            else {
                if (!this.isFirstNodeSelected) {
                    this.isMouseWheelOnProgress = true;
                    this.movePrev();
                }
            }
        }
        else {
            event.preventDefault();
        }
    };
    /**
     * disable mouse scroll for IE11 on windows10
     * @return false if IE11 windows10
     */
    MarkSchemePanel.prototype.doEnableMouseWheel = function () {
        if ((htmlUtilities.getUserDevice().userDevice === 'windows' &&
            htmlUtilities.getUserDevice().osVersion === '10' &&
            htmlUtilities.isIE11) ||
            this.isMouseWheelOnProgress) {
            return false;
        }
        else {
            return true;
        }
    };
    /**
     * moving mark scheme tree nodes on swipe based on velocity of swipe.
     * @param isSwipe - Is triggered from swipe or not
     * @param displacement - displacement on swiping/rolling.
     */
    MarkSchemePanel.prototype.moveOnSwipeAndPan = function (isSwipe, displacement, timeTaken) {
        var numberOfNodesToMove = this.calculateNumberOfNodesToMove(Math.abs(displacement), timeTaken, isSwipe);
        /* getting the next markable node after numberOfNodesToMove  and setting it as selectd */
        if (numberOfNodesToMove > 0) {
            var isBackward = displacement > 0 ? true : false;
            var currentIndex = this.getCurrentIndexOnSwipe(numberOfNodesToMove, isBackward);
            /* taking the next node of the tree based on the index calculated and navigating to that */
            var nextNode = this.markSchemeHelper.getMarkableItem(this.treeNodes, currentIndex, true);
            if (nextNode) {
                this.navigateToMarkScheme(nextNode);
            }
        }
    };
    /**
     * Calculating the number of nodes to move based on the velocity of swipe
     * @param displacement - displacement on swiping.
     * @param time - time taken for swiping.
     * @param isVelocityBased - Whether the number of node calculation is velocity based (for swipe) or not(for pan).
     * @retrn number - number of nodes to be moved.
     */
    MarkSchemePanel.prototype.calculateNumberOfNodesToMove = function (displacement, time, isVelocityBased) {
        var velocity;
        var numberOfNodes = 0;
        velocity = displacement / time;
        if (isVelocityBased) {
            numberOfNodes = Math.floor(velocity * SWIPE_MOVE_FACTOR);
            numberOfNodes = numberOfNodes === 0 ? 1 : numberOfNodes;
        }
        else {
            /** Setting this to 1 for roll (touch and move). To move to next node on every touch move event */
            numberOfNodes = 1;
        }
        return numberOfNodes;
    };
    /**
     * return the index just before the next movable node of tree based on the numberOfNodesToMove
     * @param numberOfNodesToMove
     * @param isBackward - whether the movment is backward or forward (up/down)
     */
    MarkSchemePanel.prototype.getCurrentIndexOnSwipe = function (numberOfNodesToMove, isBackward) {
        var selectedBIndex = this.markSchemeHelper.selectedNodeGet.bIndex;
        var direction = isBackward
            ? enums.MarkSchemeNavigationDirection.Backward
            : enums.MarkSchemeNavigationDirection.Forward;
        for (var i = 0; i < numberOfNodesToMove; i++) {
            var node = void 0;
            //if (isBackward) {
            node = this.markSchemeHelper.getMarkableItemByDirection(this.treeNodes, selectedBIndex, direction);
            // If there are no more node to travel, quit and set the previous as selected
            //if (this.isLastOrFirstNode(node.index) === false) {
            if (!isBackward && node.bIndex === this.treeViewHelper.lastBIndex) {
                selectedBIndex = this.treeViewHelper.lastBIndex;
                return selectedBIndex;
            }
            else {
                selectedBIndex = isBackward ? node.previousIndex : node.nextIndex;
            }
        }
        return selectedBIndex;
    };
    /**
     * Indicating whether the node is last or first
     * @param {number} index
     * @return
     */
    MarkSchemePanel.prototype.isLastOrFirstNode = function (index) {
        return index === this.firstMarkSchemeIndex ||
            index === this.treeViewHelper.getLastNodeIndex()
            ? true
            : false;
    };
    /**
     * Tirgger save
     * @param isMarkUpdatedWithoutNavigation
     * @param isNextResponse
     */
    MarkSchemePanel.prototype.triggerSave = function (isMarkUpdatedWithoutNavigation, isNextResponse) {
        if (isNextResponse === void 0) { isNextResponse = false; }
        var isAllPagesAnnotated = markingHelper.isAllPageAnnotated();
        var markDetailsForSelectedQIG = this.treeViewHelper.totalMarkAndProgress;
        var overallMarkingProgress = markDetailsForSelectedQIG.markingProgress;
        if (this.currentQuestionItem) {
            // in case of a whole response, assign markDetails based on selected QIG in Markschemepanel.
            if (responseStore.instance.isWholeResponse) {
                markDetailsForSelectedQIG = this.treeViewHelper.getSelectedQigMarkingProgressDetails(this.treeNodes, markingStore.instance.selectedQIGMarkSchemeGroupId);
            }
            keyDownHelper.instance.DeActivate(enums.MarkEntryDeactivator.TriggerSave);
            /* Trigger save mark for the current selected item just before navigating to the next mark scheme */
            this.marksManagementHelper.processMark(this.currentQuestionItem.allocatedMarks, this.currentQuestionItem.uniqueId, markDetailsForSelectedQIG.markingProgress, markDetailsForSelectedQIG.totalMarkedMarkSchemes, parseFloat(markDetailsForSelectedQIG.totalMark), markDetailsForSelectedQIG.isAllNR, isMarkUpdatedWithoutNavigation, isNextResponse, this.currentQuestionItem.usedInTotal, isAllPagesAnnotated, this.currentQuestionItem.markSchemeGroupId, false, true, overallMarkingProgress, this.logSaveMarksAction);
        }
        if (responseStore.instance.isWholeResponse) {
            // in case of whole response, have to update isAllPagesAnnotated flag for all the related QIGs.
            this.updateIsAllPageAnnotatedForWholeResponse(isAllPagesAnnotated);
        }
    };
    /**
     * Updates isAllPagesAnnotated flag, for all the related QIGs.
     * @param isAllPagesAnnotated
     */
    MarkSchemePanel.prototype.updateIsAllPageAnnotatedForWholeResponse = function (isAllPagesAnnotated) {
        var _this = this;
        var markDetails;
        var relatedQIGMarkSchemeGroupIds = markingStore.instance.getRelatedWholeResponseQIGIds();
        relatedQIGMarkSchemeGroupIds.forEach(function (markSchemeGroupdId) {
            markDetails = _this.treeViewHelper.getSelectedQigMarkingProgressDetails(_this.treeNodes, markSchemeGroupdId);
            markingActionCreator.updateMarkingDetails(markDetails, isAllPagesAnnotated, markingStore.instance.getMarkGroupIdQIGtoRIGMap(markSchemeGroupdId));
        });
    };
    /**
     * Process NR for the unmarked mark schemes.
     */
    MarkSchemePanel.prototype.processNRForUnMarkedItems = function (nodes) {
        var _this = this;
        var nodeDetails = nodes.treeViewItemList;
        var isAllPagesAnnotated = markingHelper.isAllPageAnnotated();
        nodeDetails.forEach(function (node) {
            if (node.itemType === enums.TreeViewItemType.marksScheme &&
                (node.allocatedMarks.displayMark === constants.NOT_MARKED ||
                    node.allocatedMarks.displayMark === constants.NO_MARK)) {
                // Log complete button marking process
                _this.logMarkEntry(loggerConstants.MARKENTRY_REASON_TEXT_CHANGED, loggerConstants.MARKENTRY_ACTION_TYPE_COMPLETE_NR, node.allocatedMarks.displayMark, constants.NOT_ATTEMPTED, node.uniqueId);
                node.allocatedMarks = {
                    displayMark: constants.NOT_ATTEMPTED,
                    valueMark: null
                };
                _this.treeNodes = _this.treeViewHelper.updateMarkDetails(_this.treeNodes, node.bIndex, _this.marksManagementHelper);
                var markDetails = _this.treeViewHelper.totalMarkAndProgress;
                /* Trigger save mark for the currently updated item */
                _this.marksManagementHelper.processMark(node.allocatedMarks, node.uniqueId, markDetails.markingProgress, markDetails.totalMarkedMarkSchemes, parseFloat(markDetails.totalMark), markDetails.isAllNR, true, false, node.usedInTotal, isAllPagesAnnotated, node.markSchemeGroupId, true, // passing the isUpdateUsedInTotalOnly flag to true to avoid emitting of SAVE_MARK event.
                true, markDetails.markingProgress, _this.logSaveMarksAction);
            }
            if (node.treeViewItemList && node.treeViewItemList.count() > 0) {
                _this.processNRForUnMarkedItems(node);
            }
        });
    };
    /**
     * Adding annotation numeric marks to collection.
     * @param stampId
     * @param addAnnotationAction
     * @param annotationOverlayId
     * @param annotation
     */
    MarkSchemePanel.prototype.addAnnotationMark = function (stampId, addAnnotationAction, annotationOverlayId, annotation) {
        var numericValuedAnnotation = this.markByAnnotationHelper.hasNumericValue(annotation);
        // allows only when the annotation have a valid mark
        // The numeric value of annotation was undefined when we copying previous marks and annotation so excluded .
        if (numericValuedAnnotation) {
            var newMark = this.markByAnnotationHelper.getAggregateMarks(annotation);
            this.updateAnnotationMark(loggerConstants.MARKENTRY_TYPE_ANNOTATION_ADDED, newMark.toString());
        }
    };
    /**
     * Refreshing the selected marking panel.
     */
    MarkSchemePanel.prototype.refreshSelectedMarkingItemPanel = function () {
        // This will prevent the navigation and reloading the response screen
        // for structued images.
        this.isNavigationInsideTree = true;
        // This to reset the mark entry text box
        this.isResponseChanged = Date.now();
        this.reloadTreeview = Date.now();
        this.setState({ renderedOn: Date.now() });
    };
    /**
     * This will setup events
     */
    MarkSchemePanel.prototype.setUpEvents = function () {
        var element = ReactDom.findDOMNode(this);
        if (element && !this.eventHandler.isInitialized) {
            this.eventHandler.initEvents(element);
            this.eventHandler.get(eventTypes.SWIPE, {
                direction: direction.DirectionOptions.DIRECTION_VERTICAL,
                threshold: 5
            });
            this.eventHandler.on(eventTypes.SWIPE, this.onSwipe);
            this.eventHandler.get(eventTypes.PAN, {
                direction: direction.DirectionOptions.DIRECTION_VERTICAL,
                threshold: 15
            });
            this.eventHandler.on(eventTypes.PAN_MOVE, this.onPanMove);
            this.eventHandler.on(eventTypes.PAN_END, this.onPanEnd);
        }
    };
    /**
     * unsubscribing hammer touch events and handlers
     */
    MarkSchemePanel.prototype.unRegisterEvents = function () {
        if (this.eventHandler.isInitialized) {
            this.eventHandler.destroy();
        }
    };
    /**
     * Logging the marking behavior (key or mark button used) on marking
     * @param {boolean} isMarkByKeyboard
     */
    MarkSchemePanel.prototype.logMarkingBehaviour = function (isMarkByKeyboard) {
        isMarkByKeyboard === true ? this.markByKeyboardCount++ : this.markByButtonCount++;
    };
    Object.defineProperty(MarkSchemePanel.prototype, "showAccuracyPanel", {
        /**
         * Displaying the accuracy indicator
         * @returns
         */
        get: function () {
            if (this.isAccuracyIndicatorRequired && this.currentResponseDetails) {
                return (React.createElement(AccuracyIndicator, {id: 'markscheme-panel-accuracy-indicator', key: 'markscheme-panel-accuracy-indicator-key', accuracyIndicator: this.currentResponseDetails.accuracyIndicatorTypeID, selectedLanguage: this.props.selectedLanguage, isTileView: false, isInMarkSchemePanel: true}));
            }
            return null;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MarkSchemePanel.prototype, "currentResponseDetails", {
        /**
         * Returns the current response details.
         */
        get: function () {
            return worklistStore.instance.getResponseDetails(responseStore.instance.selectedDisplayId.toString());
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MarkSchemePanel.prototype, "totalPanelClassName", {
        /**
         * Get the panel class name based on accuracy
         */
        get: function () {
            var accuracyTypeName = '';
            // showing accuracy only for closed pracrice response
            if (this.isAccuracyIndicatorRequired) {
                accuracyTypeName = this.getAccuracy(this.currentResponseDetails.accuracyIndicatorTypeID);
            }
            return accuracyTypeName === ''
                ? 'total-panel-holder'
                : 'total-panel-holder ' + accuracyTypeName;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MarkSchemePanel.prototype, "isAccuracyIndicatorRequired", {
        /**
         * Returns a value indicating whether Accuracy Indicator Required.
         * @returns true if Accuracy Indicator Required or viceversa
         */
        get: function () {
            if (worklistStore.instance.isMarkingCheckMode) {
                return false;
            }
            var isShowStandardisationDefinitiveMarksIsOn = ccHelper
                .getCharacteristicValue(ccNames.ShowStandardisationDefinitiveMarks, qigStore.instance.selectedQIGForMarkerOperation.markSchemeGroupId)
                .toLowerCase() === 'true'
                ? true
                : false;
            var isClosedResponse = worklistStore.instance.getResponseMode === enums.ResponseMode.closed ? true : false;
            return ((worklistStore.instance.currentWorklistType === enums.WorklistType.practice &&
                isClosedResponse) ||
                (worklistStore.instance.currentWorklistType === enums.WorklistType.standardisation &&
                    isShowStandardisationDefinitiveMarksIsOn &&
                    isClosedResponse) ||
                (worklistStore.instance.currentWorklistType ===
                    enums.WorklistType.secondstandardisation &&
                    isShowStandardisationDefinitiveMarksIsOn &&
                    isClosedResponse) ||
                (worklistStore.instance.currentWorklistType === enums.WorklistType.live &&
                    markerOperationModeFactory.operationMode.isAutomaticQualityFeedbackCCOn &&
                    isClosedResponse) ||
                (worklistStore.instance.currentWorklistType === enums.WorklistType.directedRemark &&
                    markerOperationModeFactory.operationMode.isAutomaticQualityFeedbackCCOn &&
                    isClosedResponse &&
                    responseHelper.getCurrentResponseSeedType() === enums.SeedType.EUR));
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Returns the accuracy name of given accuracy type
     * @param {enums.AccuracyIndicatorType} type
     * @returns
     */
    MarkSchemePanel.prototype.getAccuracy = function (accuracyIndicatorType) {
        var accuracyTypeName = '';
        switch (accuracyIndicatorType) {
            case enums.AccuracyIndicatorType.Accurate:
            case enums.AccuracyIndicatorType.AccurateNR:
                accuracyTypeName = 'accurate';
                break;
            case enums.AccuracyIndicatorType.OutsideTolerance:
            case enums.AccuracyIndicatorType.OutsideToleranceNR:
                accuracyTypeName = 'inaccurate';
                break;
            case enums.AccuracyIndicatorType.WithinTolerance:
            case enums.AccuracyIndicatorType.WithinToleranceNR:
                accuracyTypeName = 'intolerance';
                break;
        }
        return accuracyTypeName;
    };
    /**
     * return whether the complete button is to be visible or not (based on the CC value).
     */
    MarkSchemePanel.prototype.isCompleteButtonVisible = function () {
        return markerOperationModeFactory.operationMode.isCompleteButtonVisible(this.treeViewHelper.totalMarkAndProgress.markingProgress, this.treeNodes.hasSimpleOptionality);
    };
    /**
     * returns whether the complete button is enabled or not (based on the checkminmark CC value and optionality).
     */
    MarkSchemePanel.prototype.isCompleteButtonDisabled = function () {
        var checkMinMarksOnCompleteCC = ccHelper.getCharacteristicValue(ccNames.CheckMinMarksOnComplete, qigStore.instance.selectedQIGForMarkerOperation.markSchemeGroupId);
        if (checkMinMarksOnCompleteCC === 'true' && this.treeNodes.hasSimpleOptionality === true) {
            return !this.treeViewHelper.hasAllOptionalMarkSchemesMarked;
        }
        else {
            return false;
        }
    };
    /**
     * returns the jsx element of complete button
     */
    MarkSchemePanel.prototype.completeButton = function () {
        var completeButton = null;
        var title;
        if (this.isCompleteButtonVisible()) {
            var isCompleteButtonDisabled = this.isCompleteButtonDisabled();
            if (isCompleteButtonDisabled) {
                title = localeStore.instance.TranslateText('marking.response.mark-scheme-panel.complete-button-tooltip-when-disabled');
            }
            else {
                title = localeStore.instance.TranslateText('marking.response.mark-scheme-panel.complete-button-tooltip-when-enabled');
            }
            var className = 'button primary rounded complete-button';
            completeButton = (React.createElement("div", {className: 'complete-button-holder'}, React.createElement(GenericButton, {id: 'complete_button', key: 'key_complete_button', onClick: this.onCompleteButtonClick, disabled: isCompleteButtonDisabled, content: localeStore.instance.TranslateText('marking.response.mark-scheme-panel.complete-button'), className: className, title: title})));
        }
        return completeButton;
    };
    Object.defineProperty(MarkSchemePanel.prototype, "getSelectedQuestionItemBIndex", {
        /* return the b index of the selected question item based on the MbC/MbQ */
        get: function () {
            /* return selectedQuestionItemBIndex when the response is markby question,structured/ebookmarking
            and navigation is through markscheme */
            if (responseHelper.isMbQSelected &&
                (responseStore.instance.markingMethod === enums.MarkingMethod.Structured
                    || responseStore.instance.markingMethod === enums.MarkingMethod.MarkFromObject
                    || responseHelper.isEbookMarking === true) &&
                markingStore.instance.isNavigationThroughMarkScheme === enums.ResponseNavigation.markScheme) {
                return worklistStore.instance.selectedQuestionItemBIndex;
            }
            else if ((responseStore.instance.markingMethod === enums.MarkingMethod.Structured
                || responseStore.instance.markingMethod === enums.MarkingMethod.MarkFromObject
                || responseHelper.isEbookMarking === true) &&
                !responseHelper.isAtypicalResponse() &&
                this.treeNodes.markingProgress === 100 &&
                (markingStore.instance.currentNavigation === enums.SaveAndNavigate.toResponse ||
                    markingStore.instance.currentNavigation === enums.SaveAndNavigate.submit)) {
                return worklistStore.instance.selectedQuestionItemBIndex;
            }
            else {
                //if MbC or MBQ is enabled , fully marked then select first question ,navigation is not  through markscheme or response .
                return 1;
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MarkSchemePanel.prototype, "getNextMarkScheme", {
        /* get the next markscheme */
        get: function () {
            var nextNode = this.markSchemeHelper.selectedNodeGet.nextIndex > 0
                ? this.markSchemeHelper.getMarkableItemByDirection(this.treeNodes, this.markSchemeHelper.selectedNodeGet.nextIndex, enums.MarkSchemeNavigationDirection.Forward)
                : null;
            return nextNode;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * sets the next mark scheme item in the store
     */
    MarkSchemePanel.prototype.setNextMarkSchemeItem = function () {
        markingActionCreator.setSelectedQuestionItemIndex(this.getNextMarkScheme.bIndex, this.getNextMarkScheme.uniqueId);
    };
    /**
     * Check whether the accept quality feedback button is visible or not
     */
    MarkSchemePanel.prototype.isAcceptQualityFeedbackButtonVisible = function () {
        if (markerOperationModeFactory.operationMode.isQualityFeedbackOutstanding &&
            (worklistStore.instance.currentWorklistType === enums.WorklistType.live ||
                worklistStore.instance.currentWorklistType === enums.WorklistType.directedRemark) &&
            worklistStore.instance.getResponseMode === enums.ResponseMode.closed) {
            return true;
        }
        return false;
    };
    /**
     * return whether to display the showremakdecision buton or not
     */
    MarkSchemePanel.prototype.showRemarkDecisionButton = function () {
        var isCCOn = ccHelper
            .getCharacteristicValue(ccNames.SupervisorRemarkDecision, qigStore.instance.selectedQIGForMarkerOperation.markSchemeGroupId)
            .toLowerCase() === 'true'
            ? true
            : false;
        return (isCCOn &&
            this.isFullyMarked() &&
            worklistStore.instance.getRemarkRequestType === enums.RemarkRequestType.SupervisorRemark);
    };
    /**
     * callback function for markchange decision changes.
     */
    MarkSchemePanel.prototype.onRemarkDecisionChange = function (remarkDecision) {
        this.remarkDecision = remarkDecision;
        markingActionCreator.supervisorRemarkDecisionChange(this.accuracyIndicator, remarkDecision);
    };
    /**
     * callback function for markchange decision changes.
     */
    MarkSchemePanel.prototype.resetDecision = function () {
        this.remarkDecision = enums.SupervisorRemarkDecisionType.none;
        markingActionCreator.supervisorRemarkDecisionChange(this.accuracyIndicator, this.remarkDecision);
    };
    /**
     * function to calculate and set the accuracy indaicator based on accuracy rules.
     */
    MarkSchemePanel.prototype.calculateAccuracy = function () {
        var accuracy = [];
        if (this.isFullyMarked()) {
            var markingMode = targetSummarytStore.instance.getCurrentMarkingMode();
            if (worklistStore.instance.getRemarkRequestType ===
                enums.RemarkRequestType.SupervisorRemark) {
                var accuracyCalcObj = accuracyRuleFactory.getAccuracyRule(enums.AccuracyRuleType.default, enums.MarkingMode.Remarking, markingStore.instance.currentMarkGroupId);
                var comparingDetails = {
                    isDefinitive: false,
                    isRemark: true,
                    isSupervisorRemark: true
                };
                accuracy = accuracyCalcObj.CalculateRigTotalAndAccuracy(this.treeNodes, comparingDetails);
                if (this.isAccuracyChanged(this.accuracyIndicator, accuracy[0])) {
                    if (this.accuracyIndicator) {
                        this.resetDecision();
                    }
                    this.accuracyIndicator = accuracy[0];
                    this.absoluteMarkDifference = accuracy[1];
                    this.totalMarkDifference = accuracy[2];
                }
            }
        }
        return accuracy;
    };
    /**
     * Whether the accuracy has been changed or not , by considering Accurate And AccurateNR as same.
     * @param currentAccuracy
     * @param newAccuracy
     */
    MarkSchemePanel.prototype.isAccuracyChanged = function (currentAccuracy, newAccuracy) {
        var accuracyChanged = false;
        if (currentAccuracy) {
            if (currentAccuracy === enums.AccuracyIndicatorType.Accurate ||
                currentAccuracy === enums.AccuracyIndicatorType.AccurateNR) {
                accuracyChanged =
                    newAccuracy !== enums.AccuracyIndicatorType.Accurate &&
                        newAccuracy !== enums.AccuracyIndicatorType.AccurateNR;
            }
            else if (currentAccuracy === enums.AccuracyIndicatorType.OutsideTolerance ||
                currentAccuracy === enums.AccuracyIndicatorType.OutsideToleranceNR) {
                accuracyChanged =
                    newAccuracy !== enums.AccuracyIndicatorType.OutsideTolerance &&
                        newAccuracy !== enums.AccuracyIndicatorType.OutsideToleranceNR;
            }
            else if (currentAccuracy === enums.AccuracyIndicatorType.WithinTolerance ||
                currentAccuracy === enums.AccuracyIndicatorType.WithinToleranceNR) {
                accuracyChanged =
                    newAccuracy !== enums.AccuracyIndicatorType.WithinTolerance &&
                        newAccuracy !== enums.AccuracyIndicatorType.WithinToleranceNR;
            }
        }
        else {
            accuracyChanged = true;
        }
        return accuracyChanged;
    };
    /**
     * Log marking text changed values.
     * @param reason
     * @param activity
     * @param oldMark
     * @param newMark
     */
    MarkSchemePanel.prototype.logMarkEntry = function (reason, activity, oldMark, newMark, markSchemeId) {
        this.logger.logMarkEntryAction(reason, activity, markingStore.instance.currentMarkGroupId, oldMark, newMark, !markSchemeId ? this.currentQuestionItem.uniqueId : markSchemeId, this.treeViewHelper.isNonNumeric, responseHelper.isMbQSelected);
    };
    /**
     * Log annotation update actions based on the reset and assigining mark using MBA.
     * @param reason
     * @param activity
     * @param annotationCount
     */
    MarkSchemePanel.prototype.logMarkEntryAnnotationUpdate = function (reason, activity, annotationCount) {
        this.logger.logMarkEntryAnnotationUpateAction(reason, activity, markingStore.instance.currentMarkGroupId, this.currentQuestionItem.uniqueId, this.treeViewHelper.isNonNumeric, responseHelper.isMbQSelected, annotationCount);
    };
    /**
     * Log saving marks action
     * @param isMarkUpdatedWithoutNavigation
     * @param isNextResponse
     * @param isUpdateUsedInTotalOnly
     * @param isUpdateMarkingProgress
     * @param markDetails
     */
    MarkSchemePanel.prototype.logSaveMarksAction = function (isMarkUpdatedWithoutNavigation, isNextResponse, isUpdateUsedInTotalOnly, isUpdateMarkingProgress, markDetails) {
        this.logger.logMarkSaveAction(loggerConstants.MARKENTRY_REASON_SAVE_MARK_AND_ANNOTATION, loggerConstants.MARKENTRY_ACTION_TYPE_SAVE_MARK, isMarkUpdatedWithoutNavigation, isNextResponse, isUpdateUsedInTotalOnly, isUpdateMarkingProgress, markDetails);
    };
    /**
     * Returns Background color for Enhanced offpage comment toggle button.
     * @param allMarksAndAnnotations
     */
    MarkSchemePanel.prototype.getEnhancedOffpageCommentToggleButtonColor = function (allMarksAndAnnotations, defaultColor) {
        var _enhancedOffpageCommentColor = {};
        var selectedMarkgroupid = markingStore.instance.currentMarkGroupId;
        // isMarksColumnVisibilitySwitched, set as true when checkbox aganist current selected comments is unticked.
        // if isMarksColumnVisibilitySwitched true, index changed to current marks.
        var allMarksAndAnnotationsCollectionLength = allMarksAndAnnotations.length;
        var index = enhancedOffPageCommentHelper.getEnhancedOffPageCommentIndex(this.isMarksColumnVisibilitySwitched, allMarksAndAnnotations.length);
        // for remark responses.
        if (this.treeViewHelper.canRenderPreviousMarks() &&
            allMarksAndAnnotationsCollectionLength > 1) {
            // getting previous markscheme color.
            _enhancedOffpageCommentColor.color = this.getPreviousMarksColumnMarkSchemeColor(index, selectedMarkgroupid).background;
            // getting color for current marking.
            if (index === 0) {
                if (responseStore.instance.selectedResponseMode !== enums.ResponseMode.closed) {
                    _enhancedOffpageCommentColor.color = colouredAnnotationsHelper.getRemarkBaseColor(enums.DynamicAnnotation.None).fill;
                }
            }
        }
        else {
            // Live marking
            _enhancedOffpageCommentColor.color = marksAndAnnotationsVisibilityHelper.getLiveClosedAnnotationToggleButtonColor(allMarksAndAnnotations, defaultColor, markingStore.instance.currentResponseMode);
        }
        return _enhancedOffpageCommentColor;
    };
    Object.defineProperty(MarkSchemePanel.prototype, "getPreviousMarkScheme", {
        /* gets the previous markscheme */
        get: function () {
            var previousNode = this.markSchemeHelper.selectedNodeGet.previousIndex > 0
                ? this.markSchemeHelper.getMarkableItemByDirection(this.treeNodes, this.markSchemeHelper.selectedNodeGet.previousIndex, enums.MarkSchemeNavigationDirection.Backward)
                : null;
            return previousNode;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * return all the linked items against current markscheme Id.
     * @param tree
     * @param doClear
     */
    MarkSchemePanel.prototype.getLinkedItems = function (tree, doClear) {
        var _this = this;
        if (doClear === void 0) { doClear = false; }
        if (!responseHelper.isEResponse) {
            if (doClear || !this.linkedItemsUniqueIds) {
                this.linkedItemsUniqueIds = Immutable.List();
            }
            var annotation = [];
            var currentMarkGroupId = markingStore.instance.currentMarkGroupId;
            var allMarksAndAnnotations = markingStore.instance.allMarksAndAnnotationAgainstResponse(currentMarkGroupId);
            var allLinkAnnotations_1 = [];
            if (allMarksAndAnnotations) {
                // get all the link annotations against qig(s)
                allMarksAndAnnotations.map(function (marksAndAnnotations) {
                    var annotations = marksAndAnnotations.annotations;
                    if (annotations) {
                        allLinkAnnotations_1 = allLinkAnnotations_1.concat(annotations.filter(function (item) {
                            return item.stamp === constants.LINK_ANNOTATION &&
                                item.markingOperation !== enums.MarkingOperation.deleted &&
                                item.isPrevious !== true;
                        }));
                    }
                });
                var nodes = tree.treeViewItemList;
                if (nodes) {
                    nodes.map(function (node) {
                        var uniqueId = markSchemeHelper.getLinkableMarkschemeId(node, tree);
                        var linkAnnotation = allLinkAnnotations_1.filter(function (item) { return item.markSchemeId === node.uniqueId; });
                        if (linkAnnotation.length > 0) {
                            _this.linkedItemsUniqueIds = _this.linkedItemsUniqueIds.set(_this.linkedItemsUniqueIds.count() + 1, uniqueId);
                        }
                        if (node.treeViewItemList && node.treeViewItemList.count() > 0) {
                            _this.getLinkedItems(node);
                        }
                    });
                }
            }
        }
    };
    Object.defineProperty(MarkSchemePanel.prototype, "showReClassifyResponseButton", {
        /**
         * Displaying the Re-classify response button
         * @returns
         */
        get: function () {
            var currentworklist = standardisationSetupStore.instance.selectedStandardisationSetupWorkList;
            var isClassifiedResponseWorklist = currentworklist === enums.StandardisationSetup.ClassifiedResponse;
            var isStandardisationSetUpComplete = qigStore.instance.selectedQIGForMarkerOperation.standardisationSetupComplete;
            if (isClassifiedResponseWorklist && !isStandardisationSetUpComplete && this.hasClassifyPermission) {
                return (React.createElement(ClassifyResponse, {id: this.props.id, key: this.props.key, isDisabled: false, esMarkGroupId: markingStore.instance.currentMarkGroupId, buttonTextResourceKey: 'standardisation-setup.right-container.reclassify-button', onClickAction: this.reclassifyMultiOptionPopUpOpen}));
            }
            return null;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MarkSchemePanel.prototype, "hasClassifyPermission", {
        /**
         * Get the classify permission of the markers role in std setup permission CC
         * @returns
         */
        get: function () {
            if (standardisationSetupStore.instance.stdSetupPermissionCCData) {
                return standardisationSetupStore.instance.stdSetupPermissionCCData.
                    role.permissions.classify;
            }
            return false;
        },
        enumerable: true,
        configurable: true
    });
    return MarkSchemePanel;
}(eventManagerBase));
module.exports = MarkSchemePanel;
//# sourceMappingURL=markschemepanel.js.map