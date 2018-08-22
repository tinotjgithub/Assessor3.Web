"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
/* tslint:disable:no-unused-variable */
var React = require('react');
var pureRenderComponent = require('../../base/purerendercomponent');
var SupervisorInformation = require('./supervisorinformation');
var PersonalInformation = require('./personalinformation');
var ExaminerStateChangeButton = require('./examinerstatechangebutton');
var enums = require('../../utility/enums');
var configurablecharacteristicshelper = require('../../../utility/configurablecharacteristic/configurablecharacteristicshelper');
var configurablecharacteristicsnames = require('../../../utility/configurablecharacteristic/configurablecharacteristicsnames');
var qigStore = require('../../../stores/qigselector/qigstore');
var targetsummarystore = require('../../../stores/worklist/targetsummarystore');
var MarkingCheckButton = require('./markingcheckbutton');
var worklistStore = require('../../../stores/worklist/workliststore');
var helpExaminersDataHelper = require('../../../utility/teammanagement/helpers/helpexaminersdatahelper');
var localeStore = require('../../../stores/locale/localestore');
var markingCheckActionCreator = require('../../../actions/markingcheck/markingcheckactioncreator');
var responseSearchHelper = require('../../../utility/responsesearch/responsesearchhelper');
var teamManagementStore = require('../../../stores/teammanagement/teammanagementstore');
var markerOperationModeFactory = require('../../utility/markeroperationmode/markeroperationmodefactory');
var warningMessageStore = require('../../../stores/teammanagement/warningmessagestore');
var applicationStore = require('../../../stores/applicationoffline/applicationstore');
/**
 * React class for marker information panel.
 */
var MarkerInformationPanel = (function (_super) {
    __extends(MarkerInformationPanel, _super);
    /**
     * constructor
     * @param props
     * @param state
     */
    function MarkerInformationPanel(props, state) {
        var _this = this;
        _super.call(this, props, state);
        /**
         * Change Examiner Change Status Button In Progress Status
         */
        this.resetExaminerChangeStatusButtonBusyStatus = function () {
            _this.isExaminerChangeStatusInProgress = false;
            _this.setState({ renderedOn: Date.now() });
        };
        /**
         * Set the examiner state change button as busy
         */
        this.setExaminerStateChangeButtonAsBusy = function () {
            _this.isExaminerChangeStatusInProgress = true;
            _this.setState({ renderedOn: Date.now() });
        };
        /**
         * Rerender the marking check button
         */
        this.renderMarkingCheckDetails = function () {
            _this.doDisableRequestMakingCheckButton = false;
            _this.setState({ renderedOn: Date.now() });
        };
        /**
         * getting mark check info
         */
        this.getMarkCheckInfo = function () {
            // fix to ensure the RequestMakingCheckButton doesn't stay disabled when going offline
            _this.doDisableRequestMakingCheckButton = true;
            markingCheckActionCreator.getMarkingCheckInfo(responseSearchHelper.isMarkingCheckAvailable(), qigStore.instance.selectedQIGForMarkerOperation.examinerRoleId);
        };
        /**
         * Actions to be done when marking check button is clicked
         */
        this.onMarkingCheckButtonClick = function () {
            markingCheckActionCreator.getMarkingCheckRecipients(qigStore.instance.selectedQIGForMarkerOperation.examinerRoleId);
        };
        /**
         * Actions to be done when online status changed
         */
        this.onOnlineStatusChanged = function () {
            _this.isExaminerChangeStatusInProgress = false;
        };
        this.helpExaminersDataHelper = new helpExaminersDataHelper();
        this.getMarkCheckInfo = this.getMarkCheckInfo.bind(this);
        this.renderMarkingCheckDetails = this.renderMarkingCheckDetails.bind(this);
        this.doDisableRequestMakingCheckButton = false;
        this.isExaminerChangeStatusInProgress = false;
        this.state = { renderedOn: Date.now() };
    }
    /**
     * This function gets invoked when the component is about to be mounted
     */
    MarkerInformationPanel.prototype.componentDidMount = function () {
        worklistStore.instance.addListener(worklistStore.WorkListStore.MARKING_CHECK_STATUS_UPDATED, this.renderMarkingCheckDetails);
        worklistStore.instance.addListener(worklistStore.WorkListStore.DO_GET_MARKING_CHECK_INFO, this.getMarkCheckInfo);
        worklistStore.instance.addListener(worklistStore.WorkListStore.TOGGLE_REQUEST_MARKING_CHECK_BUTTON_EVENT, this.renderMarkingCheckDetails);
        applicationStore.instance.addListener(applicationStore.ApplicationStore.ONLINE_STATUS_UPDATED_EVENT, this.onOnlineStatusChanged);
        if (markerOperationModeFactory && markerOperationModeFactory.operationMode.isTeamManagementMode) {
            teamManagementStore.instance.addListener(teamManagementStore.TeamManagementStore.SET_EXAMINER_CHANGE_STATUS_BUTTON_AS_BUSY, this.setExaminerStateChangeButtonAsBusy);
            teamManagementStore.instance.addListener(teamManagementStore.TeamManagementStore.CHANGE_EXAMINER_STATUS_UPDATED, this.resetExaminerChangeStatusButtonBusyStatus);
            teamManagementStore.instance.addListener(teamManagementStore.TeamManagementStore.PROVIDE_SECOND_STANDARDISATION_UPDATED, this.resetExaminerChangeStatusButtonBusyStatus);
            teamManagementStore.instance.addListener(teamManagementStore.TeamManagementStore.APPROVAL_MANAGEMENT_ACTION_EXECUTED, this.resetExaminerChangeStatusButtonBusyStatus);
            warningMessageStore.instance.addListener(warningMessageStore.WarningMessageStore.WARNING_MESSAGE_EVENT, this.resetExaminerChangeStatusButtonBusyStatus);
        }
    };
    /**
     * This function gets invoked when the component is about to be unmounted
     */
    MarkerInformationPanel.prototype.componentWillUnmount = function () {
        worklistStore.instance.removeListener(worklistStore.WorkListStore.MARKING_CHECK_STATUS_UPDATED, this.renderMarkingCheckDetails);
        worklistStore.instance.removeListener(worklistStore.WorkListStore.DO_GET_MARKING_CHECK_INFO, this.getMarkCheckInfo);
        worklistStore.instance.removeListener(worklistStore.WorkListStore.TOGGLE_REQUEST_MARKING_CHECK_BUTTON_EVENT, this.renderMarkingCheckDetails);
        applicationStore.instance.removeListener(applicationStore.ApplicationStore.ONLINE_STATUS_UPDATED_EVENT, this.onOnlineStatusChanged);
        if (markerOperationModeFactory && markerOperationModeFactory.operationMode.isTeamManagementMode) {
            teamManagementStore.instance.removeListener(teamManagementStore.TeamManagementStore.SET_EXAMINER_CHANGE_STATUS_BUTTON_AS_BUSY, this.setExaminerStateChangeButtonAsBusy);
            teamManagementStore.instance.removeListener(teamManagementStore.TeamManagementStore.CHANGE_EXAMINER_STATUS_UPDATED, this.resetExaminerChangeStatusButtonBusyStatus);
            teamManagementStore.instance.removeListener(teamManagementStore.TeamManagementStore.PROVIDE_SECOND_STANDARDISATION_UPDATED, this.resetExaminerChangeStatusButtonBusyStatus);
            teamManagementStore.instance.removeListener(teamManagementStore.TeamManagementStore.APPROVAL_MANAGEMENT_ACTION_EXECUTED, this.resetExaminerChangeStatusButtonBusyStatus);
            warningMessageStore.instance.removeListener(warningMessageStore.WarningMessageStore.WARNING_MESSAGE_EVENT, this.resetExaminerChangeStatusButtonBusyStatus);
        }
    };
    /**
     * Render component
     */
    MarkerInformationPanel.prototype.render = function () {
        if (this.props.markerInformation == null) {
            return (React.createElement("div", null, React.createElement("span", {className: 'loader darker text-middle'}, React.createElement("span", {className: 'dot'}), React.createElement("span", {className: 'dot'}), React.createElement("span", {className: 'dot'}))));
        }
        var markSchemeGroupId = qigStore.instance.selectedQIGForMarkerOperation ?
            qigStore.instance.selectedQIGForMarkerOperation.markSchemeGroupId : 0;
        this.isSeniorExaminerPoolEnabledCC = configurablecharacteristicshelper.getCharacteristicValue(configurablecharacteristicsnames.SeniorExaminerPool, markSchemeGroupId).toLowerCase() === 'true' ? true : false;
        var isChangeStatusButtonDisabled;
        if (this.props.isTeamManagementMode && !this.isSeniorExaminerPoolEnabledCC) {
            var isSubordinateApproved = (this.props.markerInformation.approvalStatus === enums.ExaminerApproval.Approved);
            // Disable change status button if required targets are not met.
            isChangeStatusButtonDisabled = !this.isRequiredTargetsMetForChangeStatus();
            // If subordinate examiner is approved, the targets need not be considered for enabling the button
            isChangeStatusButtonDisabled = isSubordinateApproved ? false : isChangeStatusButtonDisabled;
        }
        var examinerStateChangeButton;
        if (!this.isSeniorExaminerPoolEnabledCC &&
            this.props.isTeamManagementMode &&
            this.props.markerInformation.currentExaminerApprovalStatus === enums.ExaminerApproval.Approved) {
            examinerStateChangeButton = React.createElement(ExaminerStateChangeButton, {id: 'change_examiner_status', key: 'key_change_examiner_status', showExaminerStateChangePopup: this.props.showExaminerStateChangePopup, selectedLanguage: this.props.selectedLanguage, isDisabled: (this.isExaminerChangeStatusInProgress || isChangeStatusButtonDisabled) &&
                applicationStore.instance.isOnline});
        }
        // If senior examiner pool is enabled then invoke a method to get the SEP actions.
        if (this.isSeniorExaminerPoolEnabledCC &&
            this.props.isTeamManagementMode &&
            qigStore.instance.selectedQIGForMarkerOperation) {
            this.sepActions = this.helpExaminersDataHelper.
                getSEPActions(qigStore.instance.selectedQIGForMarkerOperation.examinerRoleId);
            if (this.sepActions) {
                // We dont want to include the Message action to show the Change status button
                var sendMessageIndex = this.sepActions.indexOf(enums.SEPAction.SendMessage);
                if (sendMessageIndex > -1) {
                    this.sepActions.splice(sendMessageIndex, 1);
                }
                if (this.sepActions.length > 0) {
                    examinerStateChangeButton = React.createElement(ExaminerStateChangeButton, {id: 'change_examiner_status', key: 'key_change_examiner_status', showExaminerStateChangePopup: this.props.showExaminerStateChangePopup, selectedLanguage: this.props.selectedLanguage, isDisabled: this.isExaminerChangeStatusInProgress && applicationStore.instance.isOnline});
                }
            }
        }
        var markingCheckButton = this.isMarkingCheckAvialable ?
            React.createElement(MarkingCheckButton, {id: 'marking_check_button', key: 'marking_check_button', disable: this.doDisableRequestMakingCheckButton, onMarkingCheckButtonClick: this.onMarkingCheckButtonClick, selectedLanguage: this.props.selectedLanguage}) : null;
        var supervisor = null;
        // Hide supervisor information from lefthand side if the current user is a Admin Remarker.
        if (this.props.markerInformation.markerRoleID !== enums.ExaminerRole.adminRemarker) {
            supervisor = (React.createElement(SupervisorInformation, {supervisorName: this.props.markerInformation.formattedSupervisorName, selectedLanguage: this.props.selectedLanguage, isSupervisorOnline: this.props.markerInformation.supervisorLoginStatus, supervisorLogoutDiffInMinutes: this.props.markerInformation.supervisorLogoutDiffInMinute, showMessagePopup: this.props.showMessagePopup, isTeamManagementMode: this.props.isTeamManagementMode, showMessageLink: this.props.showMessageLink}));
        }
        return (React.createElement("div", {className: 'profile-info'}, supervisor, React.createElement(PersonalInformation, {examinerName: this.props.markerInformation.formattedExaminerName, approvalStatus: this.props.markerInformation.approvalStatus, qualityFeedbackStatus: this.props.markerInformation.hasQualityFeedbackOutstanding, examinerRole: this.props.markerInformation.markerRoleID, selectedLanguage: this.props.selectedLanguage, isTeamManagementMode: this.props.isTeamManagementMode, showMessagePopup: this.props.showMessagePopup, markingCheckStatus: this.getMarkingCheckStatus()}), examinerStateChangeButton, markingCheckButton));
    };
    Object.defineProperty(MarkerInformationPanel.prototype, "isMarkingCheckAvialable", {
        /**
         * gets a value indicating whether marking check button is available
         */
        get: function () {
            // worklistStore.instance.isMarkingCheckAvailable will be true
            // only when all the required conditions are met and a gateway call
            // from reponsearchhelper.ts : openQIGDetails() updates the worklist store.
            // this value will be reset when a new QIG is selected.
            return worklistStore.instance.isMarkingCheckAvailable;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Returns a value indicating the examiner marking check status
     */
    MarkerInformationPanel.prototype.getMarkingCheckStatus = function () {
        if (this.isMarkingCheckAvialable) {
            return localeStore.instance.TranslateText('marking.worklist.marking-check-status.' +
                enums.MarkingCheckStatus[worklistStore.instance.markingCheckStatus]);
        }
    };
    /**
     *  This will check whether the required targets are met so that the change status button will be enabled.
     */
    MarkerInformationPanel.prototype.isRequiredTargetsMetForChangeStatus = function () {
        // All Standardisation / 2nd Standardisation / STM Standardisation (in Submitted-Closed)
        // need to be 'Set as Reviewed' for 'Change status' button to be enabled.
        var isMarkingTargetReviewed = true;
        this.markingTargetsSummary = targetsummarystore.instance.getExaminerMarkingTargetProgress();
        if (this.markingTargetsSummary) {
            this.markingTargetsSummary.some(function (summary) {
                if (summary.markingModeID === enums.MarkingMode.Approval ||
                    summary.markingModeID === enums.MarkingMode.ES_TeamApproval) {
                    isMarkingTargetReviewed =
                        (summary.closedResponsesCount >= summary.maximumMarkingLimit &&
                            summary.reviewedResponsesCount === summary.closedResponsesCount);
                    // If atleast one target is not reviewed exit the loop.
                    if (!isMarkingTargetReviewed) {
                        return true;
                    }
                }
            });
        }
        // Finally return the status.
        return isMarkingTargetReviewed;
    };
    return MarkerInformationPanel;
}(pureRenderComponent));
module.exports = MarkerInformationPanel;
//# sourceMappingURL=markerinformationpanel.js.map