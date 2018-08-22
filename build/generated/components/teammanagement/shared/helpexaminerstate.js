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
     * This method gets the class for state icon
     */
    var getClassForStateIcon = function () {
        switch (props.examinerState) {
            case enums.SEPWorkFlowStatus.NotApprovedFirstStd:
            case enums.SEPWorkFlowStatus.LockedNotApprovedFirstStd:
            case enums.SEPWorkFlowStatus.NotApprovedAllStd:
            case enums.SEPWorkFlowStatus.LockedNotApprovedAllStd:
                return 'not-approved-small-icon';
            case enums.SEPWorkFlowStatus.SuspendedFirst:
            case enums.SEPWorkFlowStatus.LockedSuspendedFirst:
            case enums.SEPWorkFlowStatus.SuspendedNotFirst:
            case enums.SEPWorkFlowStatus.LockedSuspendedNotFirst:
                return 'error-small-icon';
        }
    };
    /**
     * This method gets the text for state
     */
    var getTextForExaminerState = function () {
        switch (props.examinerState) {
            case enums.SEPWorkFlowStatus.NotApprovedFirstStd:
            case enums.SEPWorkFlowStatus.LockedNotApprovedFirstStd:
                return localeStore.instance.TranslateText('team-management.help-examiners.examiner-states.not-approved-1st-std');
            case enums.SEPWorkFlowStatus.NotApprovedAllStd:
            case enums.SEPWorkFlowStatus.LockedNotApprovedAllStd:
                return localeStore.instance.TranslateText('team-management.help-examiners.examiner-states.not-approved-all-std');
            case enums.SEPWorkFlowStatus.SuspendedFirst:
            case enums.SEPWorkFlowStatus.LockedSuspendedFirst:
            case enums.SEPWorkFlowStatus.SuspendedNotFirst:
            case enums.SEPWorkFlowStatus.LockedSuspendedNotFirst:
                return localeStore.instance.TranslateText('team-management.help-examiners.examiner-states.suspended') +
                    ' (' + props.suspendedCount + ' '
                    + localeStore.instance.TranslateText('team-management.help-examiners.help-examiners-data.times-suspended-time-label') + ')';
        }
    };
    return (React.createElement("span", {className: 'error'}, React.createElement("span", {className: 'sprite-icon ' + getClassForStateIcon() + ' text-middle', id: props.id + '-state'}), React.createElement("span", {className: 'small-text padding-left-5'}, " ", getTextForExaminerState())));
};
module.exports = state;
//# sourceMappingURL=helpexaminerstate.js.map