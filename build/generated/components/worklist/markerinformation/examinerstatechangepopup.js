"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var React = require('react');
var localeStore = require('../../../stores/locale/localestore');
var classNames = require('classnames');
var GenericButton = require('../../utility/genericbutton');
var enums = require('../../utility/enums');
var ExaminerStateChangeOption = require('./examinerstatechangeoption');
var pureRenderComponent = require('../../base/purerendercomponent');
var qigStore = require('../../../stores/qigselector/qigstore');
var operationModeHelper = require('../../utility/userdetails/userinfo/operationmodehelper');
var helpExaminersDataHelper = require('../../../utility/teammanagement/helpers/helpexaminersdatahelper');
var markerOperationModeFactory = require('../../utility/markeroperationmode/markeroperationmodefactory');
var stringHelper = require('../../../utility/generic/stringhelper');
var constants = require('../../utility/constants');
var Immutable = require('immutable');
var applicationStore = require('../../../stores/applicationoffline/applicationstore');
var applicationActionCreator = require('../../../actions/applicationoffline/applicationactioncreator');
var teamManagementActionCreator;
var examinerStatuseArguments;
var teamManagementStore;
var secondStandardisationArguments;
var qigActionCreator;
var worklistActionCreator;
/**
 * ExaminerStateChangePopup contain team change status options, ok and cancel buttons.
 * @param props
 * @param state
 */
var ExaminerStateChangePopup = (function (_super) {
    __extends(ExaminerStateChangePopup, _super);
    /**
     * Constructor Messagepopup
     * @param props
     * @param state
     */
    function ExaminerStateChangePopup(props, state) {
        var _this = this;
        _super.call(this, props, state);
        this.defaultSelectedOption = enums.ChangeStatusOptions.None;
        /**
         * Save examiner state change selection in to data base.
         */
        this.saveChangeExaminerStateSelection = function () {
            _this.isShowPopup = false;
            _this.setState({ renderedOn: Date.now() });
            //On clicking OK button in change examiner status popup
            // Please check whether application is online.
            // If yes, proceed with saving the examiner status otherwise interrupt action.
            if (applicationStore.instance.isOnline) {
                // Save examiner status only if the selected approval status not equal to current status.
                // do save only if some other option is being selected
                if (_this.selectedExaminerStatus !== _this.defaultSelectedOption) {
                    teamManagementActionCreator.setExaminerChangeStatusButtonBusy();
                    if (_this.sepActions && _this.sepActions.length > 0) {
                        // SEP Action Execution
                        _this.executeSEPApprovalManagementAction();
                    }
                    else {
                        if (_this.selectedExaminerStatus === enums.ChangeStatusOptions.SendForSecondStandardisation) {
                            // Non SEP Send For Second STD
                            _this.provideSecondStandardisation();
                        }
                        else {
                            // Non SEP Status Change
                            _this.changeExaminerStatus();
                        }
                    }
                }
            }
            else {
                applicationActionCreator.checkActionInterrupted();
            }
        };
        /**
         * Save examiner state change selection in to data base.
         */
        this.onSelectionChange = function (changeStateOption) {
            _this.isApprovedChecked = false;
            _this.iscurrentStateChecked = false;
            _this.isSecondStandardisationAvailableChecked = false;
            _this.isReApprovedChecked = false;
            _this.isSuspendedOptionChecked = false;
            _this.isApprovedPendingReviewChecked = false;
            switch (changeStateOption) {
                case _this.defaultSelectedOption:
                    _this.iscurrentStateChecked = true;
                    break;
                case enums.ChangeStatusOptions.Approved:
                    _this.isApprovedChecked = true;
                    break;
                case enums.ChangeStatusOptions.Suspended:
                    _this.isSuspendedOptionChecked = true;
                    break;
                case enums.ChangeStatusOptions.SendForSecondStandardisation:
                    _this.isSecondStandardisationAvailableChecked = true;
                    break;
                case enums.ChangeStatusOptions.Re_approve:
                    _this.isReApprovedChecked = true;
                    break;
                case enums.ChangeStatusOptions.AprovedPendingReview:
                    _this.isApprovedPendingReviewChecked = true;
                    break;
            }
            _this.selectedExaminerStatus = changeStateOption;
            _this.setState({ renderedOn: Date.now() });
        };
        /**
         * Cancel the examiner state change selection.
         */
        this.cancelExaminerStateChangeSelection = function () {
            _this.isShowPopup = false;
            _this.setState({ renderedOn: Date.now() });
        };
        /**
         * Handles the action event for showing change status popup.
         */
        this.toggleExaminerChangeStatusPopup = function (isPopupVisible) {
            _this.bindChangeStatusOption();
            _this.isShowPopup = isPopupVisible;
            _this.setState({ renderedOn: Date.now() });
        };
        // Set the default states
        this.state = {
            renderedOn: 0
        };
        this.saveChangeExaminerStateSelection = this.saveChangeExaminerStateSelection.bind(this);
        this.cancelExaminerStateChangeSelection = this.cancelExaminerStateChangeSelection.bind(this);
        this.isSecondStandardisationOptionAvailable = false;
        this.isShowPopup = false;
        this.toggleExaminerChangeStatusPopup = this.toggleExaminerChangeStatusPopup.bind(this);
        this.helpExaminersDataHelper = new helpExaminersDataHelper();
    }
    /**
     * Render component
     * @returns
     */
    ExaminerStateChangePopup.prototype.render = function () {
        var _this = this;
        var approvedState;
        var secondStandardisationState;
        var aprovedPendingReviewState;
        var currentSelectedState = null;
        var reapprovedState;
        var suspendedState;
        var formattedString;
        if (this.sepActions && this.sepActions.length > 0) {
            // SEP OPTIONS
            this.sepActions.forEach(function (sepaction) {
                if (sepaction === enums.SEPAction.ProvideSecondStandardisation) {
                    secondStandardisationState = (React.createElement(ExaminerStateChangeOption, {id: 'changeStatusStnd', key: 'changeStatusStnd', isChecked: _this.isSecondStandardisationAvailableChecked, stateText: localeStore.instance.
                        TranslateText('team-management.examiner-worklist.change-status-sep.' +
                        enums.SEPAction[sepaction]), onSelectionChange: _this.onSelectionChange.bind(_this, enums.ChangeStatusOptions.SendForSecondStandardisation), selectedLanguage: _this.props.selectedLanguage}));
                }
                if (sepaction === enums.SEPAction.Approve) {
                    approvedState = (React.createElement(ExaminerStateChangeOption, {id: 'changeStatusApprove', key: 'changeStatusApprove', isChecked: _this.isApprovedChecked, stateText: localeStore.instance.
                        TranslateText('team-management.examiner-worklist.change-status-sep.' +
                        enums.SEPAction[sepaction]), onSelectionChange: _this.onSelectionChange.bind(_this, enums.ChangeStatusOptions.Approved), selectedLanguage: _this.props.selectedLanguage}));
                }
                if (sepaction === enums.SEPAction.Re_approve) {
                    reapprovedState = (React.createElement(ExaminerStateChangeOption, {id: 'changeStatusReApprove', key: 'changeStatusReApprove', isChecked: _this.isReApprovedChecked, stateText: stringHelper.format(localeStore.instance.
                        TranslateText('team-management.examiner-worklist.change-status-sep.' +
                        enums.SEPAction[sepaction]), [constants.NONBREAKING_HYPHEN_UNICODE]), onSelectionChange: _this.onSelectionChange.bind(_this, enums.ChangeStatusOptions.Re_approve), selectedLanguage: _this.props.selectedLanguage}));
                }
            });
        }
        else {
            // NON SEP Options
            currentSelectedState = (React.createElement(ExaminerStateChangeOption, {id: 'defaultSelectedState', key: 'defaultSelectedState', isChecked: this.iscurrentStateChecked, stateText: localeStore.instance.TranslateText('generic.approval-statuses.' +
                enums.ExaminerApproval[this.props.currentState]), onSelectionChange: this.onSelectionChange.bind(this, this.defaultSelectedOption), selectedLanguage: this.props.selectedLanguage}));
            if (this.props.currentState === enums.ExaminerApproval.Approved) {
                suspendedState = (React.createElement(ExaminerStateChangeOption, {id: 'changeStatusSuspend', key: 'changeStatusSuspend', isChecked: this.isSuspendedOptionChecked, stateText: localeStore.instance.TranslateText('team-management.examiner-worklist.change-status.suspend'), onSelectionChange: this.onSelectionChange.bind(this, enums.ChangeStatusOptions.Suspended), selectedLanguage: this.props.selectedLanguage}));
            }
            if (this.props.currentState === enums.ExaminerApproval.Suspended ||
                this.props.currentState === enums.ExaminerApproval.NotApproved) {
                approvedState = (React.createElement(ExaminerStateChangeOption, {id: 'changeStatusApprove', key: 'changeStatusApprove', isChecked: this.isApprovedChecked, stateText: localeStore.instance.TranslateText('team-management.examiner-worklist.change-status.approve'), onSelectionChange: this.onSelectionChange.bind(this, enums.ChangeStatusOptions.Approved), selectedLanguage: this.props.selectedLanguage}));
                aprovedPendingReviewState = (React.createElement(ExaminerStateChangeOption, {id: 'changeStatusApprovePendingReview', key: 'changeStatusaprovedPendingReview', isChecked: this.isApprovedPendingReviewChecked, stateText: localeStore.instance.TranslateText('team-management.examiner-worklist.change-status.approve-pending-review'), onSelectionChange: this.onSelectionChange.bind(this, enums.ChangeStatusOptions.AprovedPendingReview), selectedLanguage: this.props.selectedLanguage}));
            }
            if (this.props.currentState === enums.ExaminerApproval.NotApproved) {
                secondStandardisationState = (this.isSecondStandardisationOptionAvailable ? React.createElement(ExaminerStateChangeOption, {id: 'changeStatusStnd', key: 'changeStatusStnd', isChecked: this.isSecondStandardisationAvailableChecked, stateText: localeStore.instance.
                    TranslateText('team-management.examiner-worklist.change-status.send-second-standardisation'), onSelectionChange: this.onSelectionChange.bind(this, enums.ChangeStatusOptions.SendForSecondStandardisation), selectedLanguage: this.props.selectedLanguage}) : null);
            }
            if (this.props.currentState === enums.ExaminerApproval.ApprovedReview) {
                approvedState = (React.createElement(ExaminerStateChangeOption, {id: 'changeStatusApprove', key: 'changeStatusApprove', isChecked: this.isApprovedChecked, stateText: localeStore.instance.TranslateText('team-management.examiner-worklist.change-status.approve'), onSelectionChange: this.onSelectionChange.bind(this, enums.ChangeStatusOptions.Approved), selectedLanguage: this.props.selectedLanguage}));
                suspendedState = (React.createElement(ExaminerStateChangeOption, {id: 'changeStatusSuspend', key: 'changeStatusSuspend', isChecked: this.isSuspendedOptionChecked, stateText: localeStore.instance.TranslateText('team-management.examiner-worklist.change-status.suspend'), onSelectionChange: this.onSelectionChange.bind(this, enums.ChangeStatusOptions.Suspended), selectedLanguage: this.props.selectedLanguage}));
            }
        }
        return (React.createElement("div", {className: classNames('popup small change-status popup-overlay ', { 'open': this.isShowPopup }), id: 'changeStatus', role: 'dialog', "aria-labelledby": 'popup1Title', "aria-describedby": 'popup1Desc'}, React.createElement("div", {className: 'popup-wrap'}, React.createElement("div", {className: 'popup-content', id: 'popup1Desc'}, currentSelectedState, approvedState, aprovedPendingReviewState, reapprovedState, secondStandardisationState, suspendedState), React.createElement("div", {className: 'popup-footer text-right'}, React.createElement(GenericButton, {id: 'button-rounded-close-button', key: 'key_button rounded close-button', className: 'button rounded close-button', title: localeStore.instance.TranslateText('generic.user-menu.profile-section.cancel-email-button'), content: localeStore.instance.TranslateText('generic.user-menu.profile-section.cancel-email-button'), disabled: false, onClick: this.cancelExaminerStateChangeSelection, selectedLanguage: this.props.selectedLanguage}), React.createElement(GenericButton, {id: 'button-primary-rounded-button', key: 'key_button primary rounded-button', className: 'button primary rounded', title: localeStore.instance.TranslateText('team-management.examiner-worklist.change-status.ok-button'), content: localeStore.instance.TranslateText('team-management.examiner-worklist.change-status.ok-button'), disabled: false, onClick: this.saveChangeExaminerStateSelection, selectedLanguage: this.props.selectedLanguage})))));
    };
    /**
     * Component did mount
     */
    ExaminerStateChangePopup.prototype.componentDidMount = function () {
        this.loadDependencies();
    };
    /**
     * Component will unmount
     */
    ExaminerStateChangePopup.prototype.componentWillUnmount = function () {
        this.removeEventListeners();
    };
    /**
     *  This will load the dependencies for team management dynamically during component mount.
     */
    ExaminerStateChangePopup.prototype.loadDependencies = function () {
        require.ensure([
            '../../../actions/teammanagement/teammanagementactioncreator',
            '../../../dataservices/teammanagement/typings/setexaminerstatusearguments',
            '../../../stores/teammanagement/teammanagementstore',
            '../../../dataservices/teammanagement/typings/setsecondStandardisationarguments',
            '../../../actions/qigselector/qigselectoractioncreator',
            '../../../actions/worklist/worklistactioncreator'], function () {
            teamManagementActionCreator = require('../../../actions/teammanagement/teammanagementactioncreator');
            examinerStatuseArguments = require('../../../dataservices/teammanagement/typings/setexaminerstatusearguments');
            teamManagementStore = require('../../../stores/teammanagement/teammanagementstore');
            secondStandardisationArguments = require('../../../dataservices/teammanagement/typings/setsecondStandardisationarguments');
            qigActionCreator = require('../../../actions/qigselector/qigselectoractioncreator');
            worklistActionCreator = require('../../../actions/worklist/worklistactioncreator');
            this.addEventListeners();
        }.bind(this));
    };
    /**
     * Hook all event listeners for team management here, It will be called after loading depencies
     * We required this type of implementation for the initial routing page like worklist, responsecontainer etc.
     */
    ExaminerStateChangePopup.prototype.addEventListeners = function () {
        if (markerOperationModeFactory && markerOperationModeFactory.operationMode.isTeamManagementMode) {
            teamManagementStore.instance.addListener(teamManagementStore.TeamManagementStore.CHANGE_STATUS_POPUP_VISIBILITY_UPDATED, this.toggleExaminerChangeStatusPopup);
        }
    };
    /**
     * Remove all event listeners for team management here.
     */
    ExaminerStateChangePopup.prototype.removeEventListeners = function () {
        if (markerOperationModeFactory && markerOperationModeFactory.operationMode.isTeamManagementMode) {
            teamManagementStore.instance.removeListener(teamManagementStore.TeamManagementStore.CHANGE_STATUS_POPUP_VISIBILITY_UPDATED, this.toggleExaminerChangeStatusPopup);
        }
    };
    /**
     * Verify second standardisation available or not.
     */
    ExaminerStateChangePopup.prototype.verifySecondStandardisationOptionAvailable = function () {
        if (qigStore && qigStore.instance.selectedQIGForMarkerOperation) {
            if (qigStore.instance.selectedQIGForMarkerOperation.hasSecondStandardisationResponseClassified) {
                if (!qigStore.instance.selectedQIGForMarkerOperation.isElectronicStandardisationTeamMember) {
                    if (qigStore.instance.selectedQIGForMarkerOperation.markingTargets) {
                        this.isSecondStandardisationOptionAvailable = !this.isSecondStandardisationTargetAvailable();
                    }
                }
            }
        }
    };
    /**
     * Verify second standardisation target available or not.
     */
    ExaminerStateChangePopup.prototype.isSecondStandardisationTargetAvailable = function () {
        return qigStore.instance.selectedQIGForMarkerOperation.markingTargets.some(function (target) {
            return target.markingMode === enums.MarkingMode.ES_TeamApproval;
        });
    };
    /**
     * Bind change status option.
     */
    ExaminerStateChangePopup.prototype.bindChangeStatusOption = function () {
        var _this = this;
        if (qigStore && qigStore.instance.selectedQIGForMarkerOperation) {
            this.sepActions = this.helpExaminersDataHelper.
                getSEPActions(qigStore.instance.selectedQIGForMarkerOperation.examinerRoleId);
        }
        this.iscurrentStateChecked = false;
        this.isApprovedChecked = false;
        this.isSecondStandardisationAvailableChecked = false;
        this.isReApprovedChecked = false;
        this.isSuspendedOptionChecked = false;
        this.isApprovedPendingReviewChecked = false;
        if (this.sepActions && this.sepActions.length > 0) {
            // For SEP Actions, the defaultSelectedOption is none as it should be.
            // New set of SEP actions will be displayed and
            // the first one in the list will be set as selected.
            this.sepActions.forEach(function (sepaction) {
                switch (sepaction) {
                    case enums.SEPAction.Approve:
                        _this.isApprovedChecked = true;
                        _this.selectedExaminerStatus = enums.ChangeStatusOptions.Approved;
                        return;
                    case enums.SEPAction.Re_approve:
                        _this.isReApprovedChecked = true;
                        _this.selectedExaminerStatus = enums.ChangeStatusOptions.Re_approve;
                        return;
                    case enums.SEPAction.ProvideSecondStandardisation:
                        _this.isSecondStandardisationAvailableChecked = true;
                        _this.selectedExaminerStatus = enums.ChangeStatusOptions.SendForSecondStandardisation;
                        return;
                }
            });
        }
        else {
            // For Non SEP, when the popup is loaded,
            // Selected Option and the Default Option must be the examiner approval status.
            switch (this.props.currentState) {
                case enums.ExaminerApproval.NotApproved:
                    this.defaultSelectedOption = enums.ChangeStatusOptions.NotApproved;
                    break;
                case enums.ExaminerApproval.Suspended:
                    this.defaultSelectedOption = enums.ChangeStatusOptions.Suspended;
                    break;
                case enums.ExaminerApproval.Approved:
                    this.defaultSelectedOption = enums.ChangeStatusOptions.Approved;
                    break;
                case enums.ExaminerApproval.ApprovedReview:
                    this.defaultSelectedOption = enums.ChangeStatusOptions.AprovedPendingReview;
                    break;
                default:
                    this.defaultSelectedOption = enums.ChangeStatusOptions.None;
                    break;
            }
            this.iscurrentStateChecked = true;
            this.selectedExaminerStatus = this.defaultSelectedOption;
            this.verifySecondStandardisationOptionAvailable();
        }
    };
    /**
     * Method to change the examiner status in Non SEP.
     */
    ExaminerStateChangePopup.prototype.changeExaminerStatus = function () {
        var newStatus;
        switch (this.selectedExaminerStatus) {
            case enums.ChangeStatusOptions.Approved:
                newStatus = enums.ExaminerApproval.Approved;
                break;
            case enums.ChangeStatusOptions.NotApproved:
                newStatus = enums.ExaminerApproval.NotApproved;
                break;
            case enums.ChangeStatusOptions.Suspended:
                newStatus = enums.ExaminerApproval.Suspended;
                break;
            case enums.ChangeStatusOptions.AprovedPendingReview:
                newStatus = enums.ExaminerApproval.ApprovedReview;
                break;
        }
        examinerStatuseArguments = {
            examinerRoleId: qigStore.instance.selectedQIGForMarkerOperation.examinerRoleId,
            markSchemeGroupId: qigStore.instance.selectedQIGForMarkerOperation.markSchemeGroupId,
            examinerStatus: newStatus,
            questionPaperPartId: qigStore.instance.selectedQIGForMarkerOperation.questionPaperPartId,
            previousExaminerStatus: this.props.currentState,
            loggedInExaminerRoleId: operationModeHelper.authorisedExaminerRoleId,
            subordinateExaminerId: teamManagementStore.instance.examinerDrillDownData ?
                teamManagementStore.instance.examinerDrillDownData.examinerId : 0
        };
        teamManagementActionCreator.changeExaminerStatus(examinerStatuseArguments);
    };
    /**
     * Method to provide second standardisation for an examiner.
     */
    ExaminerStateChangePopup.prototype.provideSecondStandardisation = function () {
        secondStandardisationArguments = {
            examinerRoleId: qigStore.instance.selectedQIGForMarkerOperation.examinerRoleId,
            markSchemeGroupId: qigStore.instance.selectedQIGForMarkerOperation.markSchemeGroupId,
            markingModeId: enums.MarkingMode.Approval,
            loggedInExaminerRoleId: operationModeHelper.authorisedExaminerRoleId,
            subordinateExaminerId: teamManagementStore.instance.examinerDrillDownData ?
                teamManagementStore.instance.examinerDrillDownData.examinerId : 0
        };
        teamManagementActionCreator.provideSecondStandardisation(secondStandardisationArguments);
    };
    /**
     * Method to execute SEP approval management action.
     */
    ExaminerStateChangePopup.prototype.executeSEPApprovalManagementAction = function () {
        var actionIdentifier;
        if (this.isApprovedChecked) {
            actionIdentifier = enums.SEPAction.Approve;
        }
        else if (this.isSecondStandardisationAvailableChecked) {
            actionIdentifier = enums.SEPAction.ProvideSecondStandardisation;
        }
        else if (this.isReApprovedChecked) {
            actionIdentifier = enums.SEPAction.Re_approve;
        }
        var dataCollection = new Array();
        var examinerSEPAction = {
            examinerRoleId: qigStore.instance.selectedQIGForMarkerOperation.examinerRoleId,
            markSchemeGroupId: qigStore.instance.selectedQIGForMarkerOperation.markSchemeGroupId,
            requestedByExaminerRoleId: operationModeHelper.authorisedExaminerRoleId
        };
        dataCollection.push(examinerSEPAction);
        var examinerSEPActions = Immutable.List(dataCollection);
        var doSEPApprovalManagementActionArgument = {
            actionIdentifier: actionIdentifier,
            examiners: examinerSEPActions
        };
        teamManagementActionCreator.ExecuteApprovalManagementAction(doSEPApprovalManagementActionArgument);
    };
    return ExaminerStateChangePopup;
}(pureRenderComponent));
module.exports = ExaminerStateChangePopup;
//# sourceMappingURL=examinerstatechangepopup.js.map