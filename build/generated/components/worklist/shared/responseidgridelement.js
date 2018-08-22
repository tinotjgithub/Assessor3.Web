"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
/* tslint:disable:no-unused-variable */
var React = require('react');
/* tslint:disable:no-unused-variable */
var pureRenderComponent = require('../../base/purerendercomponent');
var localeStore = require('../../../stores/locale/localestore');
var stringHelper = require('../../../utility/generic/stringhelper');
var worklistStore = require('../../../stores/worklist/workliststore');
var qigStore = require('../../../stores/qigselector/qigstore');
var enums = require('../../utility/enums');
var markSchemeHelper = require('../../../utility/markscheme/markschemehelper');
var markerOperationModeFactory = require('../../utility/markeroperationmode/markeroperationmodefactory');
var messageStore = require('../../../stores/message/messagestore');
var messagingActionCreator = require('../../../actions/messaging/messagingactioncreator');
var responseHelper = require('../../utility/responsehelper/responsehelper');
var teamManagementStore = require('../../../stores/teammanagement/teammanagementstore');
var teamManagementActionCreator = require('../../../actions/teammanagement/teammanagementactioncreator');
var eCourseworkHelper = require('../../utility/ecoursework/ecourseworkhelper');
var applicationStore = require('../../../stores/applicationoffline/applicationstore');
var applicationActionCreator = require('../../../actions/applicationoffline/applicationactioncreator');
var Immutable = require('immutable');
/**
 * React component class for response id
 */
var ResponseIdGridElement = (function (_super) {
    __extends(ResponseIdGridElement, _super);
    /**
     * Constructor for ResponseIdGridElement
     * @param props
     * @param state
     */
    function ResponseIdGridElement(props, state) {
        var _this = this;
        _super.call(this, props, state);
        this.classNameText = '';
        /**
         * This will initiate open response action
         */
        this.handleResponseClick = function () {
            //TO DO Remove this on enabling response click.
            if (!_this.props.isClickable) {
                return;
            }
            if (!applicationStore.instance.isOnline) {
                applicationActionCreator.checkActionInterrupted();
            }
            else {
                // Ideally marking mode should be read from the opened response,
                // since multiple marking modes won't come in the same worklist now this will work.
                _this.selectedMarkingMode = worklistStore.instance.getMarkingModeByWorkListType(worklistStore.instance.currentWorklistType);
                _this.actualDisplayId = _this.props.displayId.toString();
                if (!messageStore.instance.isMessagePanelActive) {
                    if (markerOperationModeFactory.operationMode.isHelpExaminersView) {
                        var dataCollection = new Array();
                        var examinerSEPAction = {
                            examinerRoleId: qigStore.instance.selectedQIGForMarkerOperation.examinerRoleId,
                            markSchemeGroupId: qigStore.instance.getSelectedQIGForTheLoggedInUser.markSchemeGroupId,
                            requestedByExaminerRoleId: qigStore.instance.getSelectedQIGForTheLoggedInUser.examinerRoleId
                        };
                        dataCollection.push(examinerSEPAction);
                        var examinerSEPActions = Immutable.List(dataCollection);
                        var doSEPApprovalManagementActionArgument = {
                            actionIdentifier: enums.SEPAction.ViewResponse,
                            examiners: examinerSEPActions
                        };
                        teamManagementActionCreator.ExecuteApprovalManagementAction(doSEPApprovalManagementActionArgument);
                    }
                    else if (worklistStore.instance.isMarkingCheckMode) {
                        teamManagementActionCreator.teamManagementExaminerValidation(qigStore.instance.getSelectedQIGForTheLoggedInUser.markSchemeGroupId, qigStore.instance.selectedQIGForMarkerOperation.examinerRoleId, 0, worklistStore.instance.selectedMarkingCheckExaminer.fromExaminerID, enums.ExaminerValidationArea.MarkCheckWorklist, false, _this.actualDisplayId, _this.selectedMarkingMode);
                    }
                    else {
                        _this.openResponse(_this.actualDisplayId, _this.selectedMarkingMode);
                    }
                }
                else {
                    var messageNavigationArguments = {
                        responseId: parseInt(_this.actualDisplayId),
                        canNavigate: false,
                        navigateTo: enums.MessageNavigation.toResponse,
                        navigationConfirmed: false,
                        hasMessageContainsDirtyValue: undefined,
                        triggerPoint: enums.TriggerPoint.None
                    };
                    messagingActionCreator.canMessageNavigate(messageNavigationArguments);
                }
            }
        };
        /**
         * This will initiate the SEP action while opening a response
         */
        this.onApprovalManagementActionExecuted = function (actionIdentifier) {
            if (actionIdentifier === enums.SEPAction.ViewResponse) {
                if (_this.actualDisplayId && _this.selectedMarkingMode) {
                    _this.openResponse(_this.actualDisplayId, _this.selectedMarkingMode);
                }
            }
        };
        /**
         * Method to open response if the loggined examiner is valid.
         */
        this.validateExaminerStatus = function (displayId, markingMode) {
            if (displayId && markingMode !== enums.MarkingMode.None) {
                _this.openResponse(displayId, markingMode);
            }
        };
        this.handleResponseClick = this.handleResponseClick.bind(this);
    }
    /**
     * Render component
     */
    ResponseIdGridElement.prototype.render = function () {
        var title = stringHelper.format(localeStore.instance.TranslateText('marking.worklist.response-data.response-id-tooltip'), [(this.props.displayText) ? String(this.props.displayText) : String(this.props.displayId)]);
        (this.props.isTileView) ? this.classNameText = 'resp-id response-display-id' :
            this.classNameText = 'response-display-id resp-id';
        return (React.createElement("div", {className: this.classNameText}, React.createElement("a", {href: 'javascript:void(0)', id: 'res_' + this.props.id, key: 'res_key_' + this.props.id, title: title, className: (this.props.isTileView) ? 'dark-link large-text' : '', onClick: this.handleResponseClick}, (this.props.displayText) ? String(this.props.displayText) : String(this.props.displayId))));
    };
    /**
     * Componet did mount
     */
    ResponseIdGridElement.prototype.componentDidMount = function () {
        teamManagementStore.instance.setMaxListeners(0);
        if (markerOperationModeFactory.operationMode.isHelpExaminersView) {
            teamManagementStore.instance.addListener(teamManagementStore.TeamManagementStore.APPROVAL_MANAGEMENT_ACTION_EXECUTED, this.onApprovalManagementActionExecuted);
        }
        teamManagementStore.instance.addListener(teamManagementStore.TeamManagementStore.EXAMINER_VALIDATED_OPEN_RESPONSE_EVENT, this.validateExaminerStatus);
    };
    /**
     * Component will unmount
     */
    ResponseIdGridElement.prototype.componentWillUnmount = function () {
        if (markerOperationModeFactory.operationMode.isHelpExaminersView) {
            teamManagementStore.instance.removeListener(teamManagementStore.TeamManagementStore.APPROVAL_MANAGEMENT_ACTION_EXECUTED, this.onApprovalManagementActionExecuted);
        }
        teamManagementStore.instance.removeListener(teamManagementStore.TeamManagementStore.EXAMINER_VALIDATED_OPEN_RESPONSE_EVENT, this.validateExaminerStatus);
    };
    /**
     * This will open the response
     * @param actualDisplayId contains the actual display id
     * @param selectedMarkingMode contains the selected marking mode
     */
    ResponseIdGridElement.prototype.openResponse = function (actualDisplayId, selectedMarkingMode) {
        var openedResponseDetails = markerOperationModeFactory.operationMode.openedResponseDetails(actualDisplayId);
        responseHelper.openResponse(parseInt(actualDisplayId), enums.ResponseNavigation.specific, markerOperationModeFactory.operationMode.isStandardisationSetupMode ? enums.ResponseMode.open :
            worklistStore.instance.getResponseMode, markerOperationModeFactory.operationMode.isStandardisationSetupMode ?
            openedResponseDetails.esMarkGroupId : openedResponseDetails.markGroupId, enums.ResponseViewMode.zoneView, enums.TriggerPoint.None, openedResponseDetails.sampleReviewCommentId, openedResponseDetails.sampleReviewCommentCreatedBy);
        markSchemeHelper.getMarks(parseInt(actualDisplayId), selectedMarkingMode);
        eCourseworkHelper.fetchECourseWorkCandidateScriptMetadata(parseInt(actualDisplayId));
    };
    return ResponseIdGridElement;
}(pureRenderComponent));
module.exports = ResponseIdGridElement;
//# sourceMappingURL=responseidgridelement.js.map