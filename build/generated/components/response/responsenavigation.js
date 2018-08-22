"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
/* tslint:disable:no-unused-variable */
var React = require('react');
/* tslint:enable:no-unused-variable */
var pureRenderComponent = require('../base/purerendercomponent');
var localeStore = require('../../stores/locale/localestore');
var stringHelper = require('../../utility/generic/stringhelper');
var enums = require('../utility/enums');
var keyCodes = require('../../utility/keyboardacess/keycodes');
var moduleKeyHandler = require('../../utility/generic/modulekeyhandler');
var modulekeys = require('../../utility/generic/modulekeys');
var keyDownHelper = require('../../utility/generic/keydownhelper');
var markingActionCreator = require('../../actions/marking/markingactioncreator');
var markingStore = require('../../stores/marking/markingstore');
var worklistStore = require('../../stores/worklist/workliststore');
var constants = require('../utility/constants');
var qigStore = require('../../stores/qigselector/qigstore');
var markingHelper = require('../../utility/markscheme/markinghelper');
var popupHelper = require('../utility/popup/popuphelper');
var submitStore = require('../../stores/submit/submitstore');
var worklistActionCreator = require('../../actions/worklist/worklistactioncreator');
var responseStore = require('../../stores/response/responsestore');
var navigationHelper = require('../utility/navigation/navigationhelper');
var busyIndicatorActionCreator = require('../../actions/busyindicator/busyindicatoractioncreator');
var qualityfeedbackHelper = require('../../utility/qualityfeedback/qualityfeedbackhelper');
var submitHelper = require('../utility/submit/submithelper');
var markSchemeHelper = require('../../utility/markscheme/markschemehelper');
var responseActionCreator = require('../../actions/response/responseactioncreator');
var markByAnnotationHelper = require('../utility/marking/markbyannotationhelper');
var teamManagementStore = require('../../stores/teammanagement/teammanagementstore');
var loginStore = require('../../stores/login/loginstore');
var responseHelper = require('../utility/responsehelper/responsehelper');
var TagList = require('./responsescreen/taglist');
var tagStore = require('../../stores/tags/tagstore');
var markerOperationModeFactory = require('../utility/markeroperationmode/markeroperationmodefactory');
/**
 * React component for Response navigation.
 */
var ResponseNavigation = (function (_super) {
    __extends(ResponseNavigation, _super);
    /**
     * constructor
     * @param props
     * @param state
     */
    function ResponseNavigation(props, state) {
        var _this = this;
        _super.call(this, props, state);
        this._boundHandleKeyDown = null;
        this.isResponseNavigationArrowClicked = false;
        /**
         * Go to another response after saving mark if there is any
         */
        this.navigateAwayFromResponse = function (navigationFrom) {
            if (markingStore.instance.navigateTo === enums.SaveAndNavigate.toResponse) {
                /** For response auto navigation when a response gets 100% marked, the responseNavigationDirection will get undefined  */
                if (markingStore.instance.currentResponseMarkingProgress === 100 && _this.responseNavigationDirection === undefined
                    && navigationFrom !== enums.ResponseNavigation.markScheme) {
                    _this.props.moveCallback(enums.ResponseNavigation.next);
                }
                else {
                    if (!_this.isResponseNavigationArrowClicked) {
                        /** If it is navigating from markscheme then ,set the isNavigationThroughMarkScheme as markScheme  */
                        markingActionCreator.setNavigationThroughMarkscheme(enums.ResponseNavigation.markScheme);
                        if (navigationFrom === enums.ResponseNavigation.markScheme &&
                            !markSchemeHelper.isNextResponseAvailable) {
                            _this.responseNavigationDirection = enums.ResponseNavigation.first;
                        }
                        else if (navigationFrom === enums.ResponseNavigation.markScheme) {
                            _this.responseNavigationDirection = enums.ResponseNavigation.next;
                        }
                    }
                    else {
                        _this.isResponseNavigationArrowClicked = false;
                    }
                    _this.props.moveCallback(_this.responseNavigationDirection);
                }
            }
            else {
                //reset the isResponseNavigationArrowClicked when navigate to current response view
                _this.isResponseNavigationArrowClicked = false;
                /** Set the isNavigationThroughMarkScheme as None ,when we navigate to (inbox,worklist,etc) other than response. */
                markingActionCreator.setNavigationThroughMarkscheme(enums.ResponseNavigation.none);
            }
        };
        /**
         * Navigation of the response after submitting the response from markscheme
         */
        this.navigateToNextResponseAfterSubmit = function (submittedMarkGroupIds, selectedDisplayId, isFromMarkScheme) {
            // If Marker got withdrawn during the actions. Skip the activities.
            if (qigStore.instance.selectedQIGForMarkerOperation === undefined) {
                return;
            }
            var worklistNavigationRequired = false;
            _this.isWorkListDataRefreshedAfterSubmit = false;
            if (isFromMarkScheme) {
                if (submitStore.instance.getSubmitResponseReturn.hasQualityFeedbackOutstanding) {
                    worklistNavigationRequired = true;
                }
                else {
                    var worklistType = submitStore.instance.getCurrentWorklistType;
                    if ((submitStore.instance.getCurrentWorklistType === enums.WorklistType.standardisation
                        || submitStore.instance.getCurrentWorklistType === enums.WorklistType.secondstandardisation)) {
                        if (submitStore.instance.getSubmitResponseReturn.examinerApprovalStatus === enums.ExaminerApproval.Approved) {
                            // Marker Got Approved during submission. Message is displayed from worklist component helper.
                            // Set The new worklist type as Live and navigate
                            worklistType = enums.WorklistType.live;
                            worklistNavigationRequired = true;
                        }
                    }
                    // Clear the marks and annotations if needed for Reloading the DefinitiveMarks
                    submitHelper.clearMarksAndAnnotations(submittedMarkGroupIds);
                    // If the marker having more than 1 responses in his worklist and he got approved with the first std response,
                    // Publish new marking mode event. To change marking mode to live
                    if (worklistNavigationRequired ||
                        worklistStore.instance.isNextResponseAvailable(selectedDisplayId)
                            && !submitStore.instance.isExaminerApprovalStatusChanged) {
                        var responseMode = enums.ResponseMode.open;
                        var markSchemeGroupId = qigStore.instance.selectedQIGForMarkerOperation.markSchemeGroupId;
                        var examinerRoleId = qigStore.instance.selectedQIGForMarkerOperation.examinerRoleId;
                        var questionPaperPartId = qigStore.instance.selectedQIGForMarkerOperation.questionPaperPartId;
                        var remarkRequestType = worklistStore.instance.getRemarkRequestType;
                        var isDirectedRemark = worklistStore.instance.isDirectedRemark;
                        worklistActionCreator.notifyWorklistTypeChange(markSchemeGroupId, examinerRoleId, questionPaperPartId, worklistType, responseMode, remarkRequestType, isDirectedRemark, qigStore.instance.selectedQIGForMarkerOperation.isElectronicStandardisationTeamMember, false);
                        _this.isWorkListDataRefreshedAfterSubmit = true;
                    }
                    else {
                        worklistNavigationRequired = true;
                    }
                }
                if (worklistNavigationRequired) {
                    navigationHelper.loadWorklist();
                }
            }
        };
        /**
         * Worklist data changed.
         */
        this.workListDataChanged = function () {
            if (_this.isWorkListDataRefreshedAfterSubmit) {
                _this.isWorkListDataRefreshedAfterSubmit = false;
                _this.navigateResponse(enums.ResponseNavigation.next, true);
            }
        };
        this._boundHandleKeyDown = this.handleResponseNavigation.bind(this, null);
        this.handlePreviousResponseNavigation = this.handleResponseNavigation.bind(this, enums.ResponseNavigation.previous);
        this.handleNextResponseNavigation = this.handleResponseNavigation.bind(this, enums.ResponseNavigation.next);
        this.workListDataChanged = this.workListDataChanged.bind(this);
        this.markByAnnotationHelper = new markByAnnotationHelper();
    }
    /**
     * Render method
     */
    ResponseNavigation.prototype.render = function () {
        var tags = tagStore.instance.tags;
        var selectedTag = markerOperationModeFactory.operationMode.getTagId(responseStore.instance.selectedDisplayId.toString());
        var responseHeader = markerOperationModeFactory.operationMode.isSelectResponsesTabInStdSetup ?
            (stringHelper.format(localeStore.instance.TranslateText('marking.response.navigation-bar.script-position'), [this.props.currentResponse.toString(), this.props.totalResponses.toString(), this.props.centreId])) :
            (stringHelper.format(localeStore.instance.TranslateText('marking.response.navigation-bar.response-position-in-worklist'), [this.props.currentResponse.toString(), this.props.totalResponses.toString()]));
        return (React.createElement("div", {className: 'response-header'}, React.createElement("div", {className: 'response-header-inner'}, this.renderResponseNavigationButton(enums.ResponseNavigation.previous), React.createElement("div", {className: 'response-title'}, React.createElement("div", {className: 'response-id'}, React.createElement("h1", {className: 'reponse-id-label'}, this.setResponseHeaderText()), (selectedTag === undefined) ? null :
            React.createElement(TagList, {selectedTagId: selectedTag, tagList: tags, selectedLanguage: this.props.selectedLanguage, id: 'tags', key: 'tag_key', renderedOn: Date.now(), isESResponse: markerOperationModeFactory.operationMode.isStandardisationSetupMode, markingMode: markerOperationModeFactory.operationMode.isStandardisationSetupMode ?
                enums.MarkingMode.Pre_ES_TeamStandardisation : undefined})), !teamManagementStore.instance.isRedirectFromException ?
            React.createElement("div", {className: 'response-position'}, responseHeader) : null), this.renderResponseNavigationButton(enums.ResponseNavigation.next))));
    };
    /**
     * Method to set the Response header text as per the worklist type
     */
    ResponseNavigation.prototype.setResponseHeaderText = function () {
        var workListType = worklistStore.instance.currentWorklistType;
        var markingMode = worklistStore.instance.getMarkingModeByWorkListType(workListType);
        if (markerOperationModeFactory.operationMode.isSelectResponsesTabInStdSetup) {
            return ((localeStore.instance.TranslateText('marking.worklist.response-data.stm-setup-response-tittle')) + ' 1' +
                this.props.responseId);
        }
        if (markingMode === enums.MarkingMode.ES_TeamApproval) {
            if (qigStore.instance.selectedQIGForMarkerOperation.isElectronicStandardisationTeamMember === true) {
                return ((localeStore.instance.TranslateText('marking.worklist.response-data.stm-standardisation-response-title')) + ' ' +
                    this.props.responseId);
            }
            else {
                return ((localeStore.instance.TranslateText('marking.worklist.response-data.second-standardisation-response-title')) + ' ' +
                    this.props.responseId);
            }
        }
        else if (workListType === enums.WorklistType.practice) {
            return ((localeStore.instance.TranslateText('marking.worklist.response-data.practice-response-title')) + ' ' +
                this.props.responseId);
        }
        else if (workListType === enums.WorklistType.standardisation) {
            return ((localeStore.instance.TranslateText('marking.worklist.response-data.standardisation-response-title')) + ' ' +
                this.props.responseId);
        }
        else if (workListType === enums.WorklistType.secondstandardisation) {
            return ((localeStore.instance.TranslateText('marking.worklist.response-data.second-standardisation-response-title')) + ' ' +
                this.props.responseId);
        }
        else if ((worklistStore.instance.currentWorklistType === enums.WorklistType.directedRemark
            || (worklistStore.instance.currentWorklistType === enums.WorklistType.pooledRemark)
                && worklistStore.instance.getRemarkRequestType !== enums.RemarkRequestType.Unknown)
            && worklistStore.instance.getRemarkRequestType !== enums.RemarkRequestType.QualityRemark) {
            // If Atypical response get the remark string append to atypical indicator
            if (responseHelper.isAtypicalResponse()) {
                return this.atypicalRemarkHeader;
            }
            // Creates string as RemarkRequestType &nbsp; Response Id
            if (loginStore.instance.isAdminRemarker) {
                return (localeStore.instance.TranslateText('generic.remark-types.long-names.AdminRemark')) + ' ' +
                    this.props.responseId;
            }
            else {
                return stringHelper.format(localeStore.instance.TranslateText(this.getDirectedRemarkLocaleKey(worklistStore.instance.getRemarkRequestType)), [constants.NONBREAKING_HYPHEN_UNICODE])
                    + constants.NONBREAKING_WHITE_SPACE + this.props.responseId;
            }
        }
        else if (worklistStore.instance.currentWorklistType === enums.WorklistType.atypical) {
            return ((localeStore.instance.TranslateText('marking.response.navigation-bar.atypical-response-id-label')) + ' ' +
                this.props.responseId);
        }
        else if (worklistStore.instance.currentWorklistType === enums.WorklistType.simulation) {
            return ((localeStore.instance.TranslateText('marking.response.navigation-bar.simulation-response-id-label')) + ' ' +
                this.props.responseId);
        }
        else {
            return ((localeStore.instance.TranslateText('marking.response.navigation-bar.response-id-label')) + ' ' +
                this.props.responseId);
        }
    };
    Object.defineProperty(ResponseNavigation.prototype, "atypicalRemarkHeader", {
        // Gets the atypical remark header text.
        get: function () {
            if (loginStore.instance.isAdminRemarker) {
                return localeStore.instance.TranslateText('marking.response.navigation-bar.atypical-remark-response-id-label') + ' ' +
                    (localeStore.instance.TranslateText('generic.remark-types.long-names.AdminRemark')) + ' ' +
                    this.props.responseId;
            }
            else {
                return stringHelper.format((localeStore.instance.TranslateText('marking.response.navigation-bar.atypical-remark-response-id-label')) + ' ' +
                    localeStore.instance.TranslateText(this.getDirectedRemarkLocaleKey(worklistStore.instance.getRemarkRequestType)), [constants.NONBREAKING_HYPHEN_UNICODE])
                    + constants.NONBREAKING_WHITE_SPACE + this.props.responseId;
            }
        },
        enumerable: true,
        configurable: true
    });
    /**
     * This method will render response navigation buttons.
     * @param button : navigation button
     */
    ResponseNavigation.prototype.renderResponseNavigationButton = function (button) {
        if (qualityfeedbackHelper.isResponseNavigationBlocked()) {
            return null;
        }
        else {
            if (this.props.isPreviousResponseAvailable && button === enums.ResponseNavigation.previous) {
                return (React.createElement("a", {href: 'javascript:void(0);', onClick: this.handlePreviousResponseNavigation, className: 'response-nav response-nav-prev', title: localeStore.instance.TranslateText('marking.response.navigation-bar.previous-response-button-tooltip')}, React.createElement("span", {className: 'sprite-icon left-arrow-light'}, localeStore.instance.TranslateText('marking.response.navigation-bar.previous-response-button-tooltip'))));
            }
            else if (this.props.isNextResponseAvailable && button === enums.ResponseNavigation.next) {
                return (React.createElement("a", {href: 'javascript:void(0);', onClick: this.handleNextResponseNavigation, className: 'response-nav response-nav-next', title: localeStore.instance.TranslateText('marking.response.navigation-bar.next-response-button-tooltip')}, React.createElement("span", {className: 'sprite-icon right-arrow-light'}, localeStore.instance.TranslateText('marking.response.navigation-bar.next-response-button-tooltip'))));
            }
        }
    };
    /**
     * This function gets invoked when the component is about to be mounted
     */
    ResponseNavigation.prototype.componentDidMount = function () {
        responseActionCreator.reRenderBreadCrumbAfterLoadingResponseID();
        /*Adding global handler */
        var scrollHandler = new moduleKeyHandler(modulekeys.RESPONSE_NAVIGATION, enums.Priority.Third, true, this._boundHandleKeyDown, enums.KeyMode.down);
        keyDownHelper.instance.mountKeyDownHandler(scrollHandler);
        markingStore.instance.addListener(markingStore.MarkingStore.READY_TO_NAVIGATE, this.navigateAwayFromResponse);
        submitStore.instance.addListener(submitStore.SubmitStore.NAVIGATE_AFTER_SUBMIT, this.navigateToNextResponseAfterSubmit);
        worklistStore.instance.addListener(worklistStore.WorkListStore.WORKLIST_MARKING_MODE_CHANGE, this.workListDataChanged);
    };
    /**
     * This function gets invoked when the component is updating
     */
    ResponseNavigation.prototype.componentDidUpdate = function () {
        responseActionCreator.reRenderBreadCrumbAfterLoadingResponseID();
    };
    /**
     * This function gets invoked when the component is about to be unmounted
     */
    ResponseNavigation.prototype.componentWillUnmount = function () {
        keyDownHelper.instance.unmountKeyHandler(modulekeys.RESPONSE_NAVIGATION);
        markingStore.instance.removeListener(markingStore.MarkingStore.READY_TO_NAVIGATE, this.navigateAwayFromResponse);
        submitStore.instance.removeListener(submitStore.SubmitStore.NAVIGATE_AFTER_SUBMIT, this.navigateToNextResponseAfterSubmit);
        worklistStore.instance.removeListener(worklistStore.WorkListStore.WORKLIST_MARKING_MODE_CHANGE, this.workListDataChanged);
    };
    /**
     * This method will handle click events and keyboard events
     */
    ResponseNavigation.prototype.handleResponseNavigation = function (direction, keyEvent) {
        /* If pressed key is not right arrow or left arrow it will skip */
        if (keyEvent.keyCode !== undefined && keyEvent.keyCode === keyCodes.LEFT_KEY) {
            direction = enums.ResponseNavigation.previous;
        }
        else if (keyEvent.keyCode !== undefined && (keyEvent.keyCode === keyCodes.RIGHT_KEY)) {
            direction = enums.ResponseNavigation.next;
        }
        else if (keyEvent.charCode !== undefined) {
            this.responseNavigationDirection = enums.ResponseNavigation.next;
            return;
        }
        this.isResponseNavigationArrowClicked = true;
        this.navigateResponse(direction, false);
    };
    /**
     * This method will handle the navigation
     * @param direction
     * @param isAfterSubmit
     */
    ResponseNavigation.prototype.navigateResponse = function (direction, isAfterSubmit) {
        //set the isNavigationThroughMarkScheme variable as none since it is not navigating from the markscheme
        markingActionCreator.setNavigationThroughMarkscheme(enums.ResponseNavigation.none);
        if (navigationHelper.navigationAllowed(direction, this.props.isNextResponseAvailable, this.props.isPreviousResponseAvailable)) {
            this.responseNavigationDirection = direction;
            var responseNavigationFailureReasons = new Array();
            if (!isAfterSubmit) {
                responseNavigationFailureReasons = markingHelper.canNavigateAwayFromCurrentResponse();
            }
            // If there is any navigation failure reason available then we will show respective popups.
            if (responseNavigationFailureReasons.length > 0) {
                popupHelper.navigateAwayFromResponse(responseNavigationFailureReasons, enums.SaveAndNavigate.toResponse);
            }
            else {
                if (markingStore.instance.isMarkingInProgress) {
                    // if marking progressing and responseNavigationFailureReason contain none only
                    markingActionCreator.saveAndNavigate(enums.SaveAndNavigate.toResponse);
                }
                else if (!markingStore.instance.isMarkingInProgress) {
                    busyIndicatorActionCreator.setBusyIndicatorInvoker(enums.BusyIndicatorInvoker.none);
                    /** navigating from a response which is in view mode doesn't require save marks */
                    this.props.moveCallback(this.responseNavigationDirection, isAfterSubmit);
                }
            }
        }
    };
    /**
     * Get the directed remark locale key according to the directed remark request type.
     * @param {enums.RemarkRequestType} remarkRequestType
     * @returns remark request key
     */
    ResponseNavigation.prototype.getDirectedRemarkLocaleKey = function (remarkRequestType) {
        return 'generic.remark-types.long-names.' + enums.RemarkRequestType[remarkRequestType];
    };
    return ResponseNavigation;
}(pureRenderComponent));
module.exports = ResponseNavigation;
//# sourceMappingURL=responsenavigation.js.map