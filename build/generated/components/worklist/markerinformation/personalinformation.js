"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
/* tslint:disable:no-unused-variable */
var React = require('react');
var pureRenderComponent = require('../../base/purerendercomponent');
var enums = require('../../utility/enums');
var localeStore = require('../../../stores/locale/localestore');
var SendMessageLink = require('./sendmessagelink');
/**
 * React class for supervisor information.
 */
var PersonalInformation = (function (_super) {
    __extends(PersonalInformation, _super);
    /**
     * constructor
     * @param props
     * @param state
     */
    function PersonalInformation(props, state) {
        _super.call(this, props, state);
    }
    /**
     * Render method for personal information.
     */
    PersonalInformation.prototype.render = function () {
        return (React.createElement("div", {id: 'my_info_panel', className: 'my-info clearfix'}, React.createElement("div", {className: 'user-photo-holder user-medium-icon sprite-icon'}), React.createElement("div", {className: 'user-details-holder'}, React.createElement("div", {id: 'user_name', className: 'user-name large-text'}, this.props.examinerName), React.createElement("div", {id: 'user_role', className: 'designation small-text'}, this.getRoleText()), this.renderSendMessageSection(), React.createElement("div", {className: 'approve-status-holder padding-top-5'}, React.createElement("span", {className: this.determineStatusClass(false)}, React.createElement("span", {id: 'user_approval_icon', className: this.determineStatusClass(true)}), React.createElement("span", {id: 'user_approval_status', className: 'small-text padding-left-5'}, this.getApprovalStatusText()), this.props.markingCheckStatus ?
            React.createElement("span", {id: 'marking_check_status_id', className: 'check-request-status'}, '(' + this.props.markingCheckStatus + ')') : null)))));
    };
    /**
     * Render Send Message Link for Team Management
     */
    PersonalInformation.prototype.renderSendMessageSection = function () {
        if (this.props.isTeamManagementMode) {
            return React.createElement(SendMessageLink, {onClick: this.props.showMessagePopup, id: 'sendMsg', key: 'sendMsg'});
        }
    };
    /**
     * Return the Approval Status text.(localized)
     */
    PersonalInformation.prototype.getApprovalStatusText = function () {
        // status text for quality feedback status.
        if (this.props.qualityFeedbackStatus) {
            var approvalStatusText = '';
            approvalStatusText = 'qig-statuses.' + enums.ExaminerQIGStatus[11];
            return localeStore.instance.TranslateText('home.' + approvalStatusText);
        }
        else {
            var approvalStatusText = '';
            approvalStatusText = 'approval-statuses.' + enums.ExaminerApproval[this.props.approvalStatus];
            return localeStore.instance.TranslateText('generic.' + approvalStatusText);
        }
    };
    /**
     * Return the Role text.(localized)
     */
    PersonalInformation.prototype.getRoleText = function () {
        var roleText = '';
        roleText = 'examiner-roles.' + enums.ExaminerRole[this.props.examinerRole];
        return localeStore.instance.TranslateText('generic.' + roleText);
    };
    /**
     * Determine the class for the approval status.
     */
    PersonalInformation.prototype.determineStatusClass = function (isIcon) {
        var iconClass = 'sprite-icon {0}-small-icon';
        var bubbleClass = 'bubble show {0} no-border white-bg rounded';
        var iconClassValue = 'warning';
        var bubbleClassValue = 'warning';
        switch (this.props.approvalStatus) {
            case enums.ExaminerApproval.Approved:
                iconClassValue = 'success';
                bubbleClassValue = 'success';
                break;
            case enums.ExaminerApproval.ConditionallyApproved:
            case enums.ExaminerApproval.ApprovedReview:
                iconClassValue = 'warning';
                bubbleClassValue = 'warning';
                break;
            case enums.ExaminerApproval.NotApproved:
                iconClassValue = 'not-approved';
                bubbleClassValue = 'warning';
                break;
            case enums.ExaminerApproval.Suspended:
                iconClassValue = 'error';
                bubbleClassValue = 'error';
                break;
            default:
                iconClassValue = 'warning';
                bubbleClassValue = 'warning';
                break;
        }
        // color class for quality feedback
        if (this.props.qualityFeedbackStatus) {
            iconClassValue = 'warning';
            bubbleClassValue = 'warning';
        }
        if (isIcon) {
            return iconClass.replace('{0}', iconClassValue);
        }
        else {
            return bubbleClass.replace('{0}', bubbleClassValue);
        }
    };
    return PersonalInformation;
}(pureRenderComponent));
module.exports = PersonalInformation;
//# sourceMappingURL=personalinformation.js.map