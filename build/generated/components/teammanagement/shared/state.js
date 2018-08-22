"use strict";
var React = require('react');
var enums = require('../../utility/enums');
var localeStore = require('../../../stores/locale/localestore');
/**
 * Stateless component for examiner column in MyTeam Grid
 * @param props
 */
var state = function (props) {
    /**
     * This method gets the class for the span in examiner state
     */
    var getClassForStateSpan = function () {
        switch (props.examinerState) {
            case enums.ExaminerApproval.Approved:
                return 'success';
            case enums.ExaminerApproval.NotApproved:
                return 'neutral';
            case enums.ExaminerApproval.AwaitingApproval:
            case enums.ExaminerApproval.Suspended:
                return 'error';
            case enums.ExaminerApproval.ApprovedReview:
                return 'warning ';
        }
    };
    /**
     * This method gets the class for state icon
     */
    var getClassForStateIcon = function () {
        switch (props.examinerState) {
            case enums.ExaminerApproval.Approved:
                return 'success-small-icon';
            case enums.ExaminerApproval.NotApproved:
            case enums.ExaminerApproval.AwaitingApproval:
                return 'not-approved-small-icon';
            case enums.ExaminerApproval.Suspended:
                return 'error-small-icon';
            case enums.ExaminerApproval.ApprovedReview:
                return 'warning-small-icon';
        }
    };
    /**
     * This method gets the class for state icon
     */
    var getTextForExaminerState = function () {
        switch (props.examinerState) {
            case enums.ExaminerApproval.Approved:
                return localeStore.instance.TranslateText('generic.approval-statuses.Approved');
            case enums.ExaminerApproval.NotApproved:
                return localeStore.instance.TranslateText('generic.approval-statuses.NotApproved');
            case enums.ExaminerApproval.AwaitingApproval:
                return localeStore.instance.TranslateText('generic.approval-statuses.AwaitingApproval');
            case enums.ExaminerApproval.Suspended:
                return localeStore.instance.TranslateText('generic.approval-statuses.Suspended');
            case enums.ExaminerApproval.Complete:
                return localeStore.instance.TranslateText('generic.approval-statuses.Complete');
            case enums.ExaminerApproval.ApprovedReview:
                return localeStore.instance.TranslateText('generic.approval-statuses.ApprovedReview');
        }
    };
    return (React.createElement("span", {className: getClassForStateSpan()}, React.createElement("span", {className: 'sprite-icon ' + getClassForStateIcon() + ' text-middle', id: props.id + '-state'}), React.createElement("span", {className: 'small-text padding-left-5'}, " ", getTextForExaminerState())));
};
module.exports = state;
//# sourceMappingURL=state.js.map