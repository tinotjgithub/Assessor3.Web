"use strict";
var React = require('react');
var enums = require('../../utility/enums');
/* tslint:disable:variable-name */
/**
 * Stateless component for examiner column in MyTeam Grid
 * @param props
 */
var TargetProgress = function (props) {
    return (React.createElement("span", null, markingtargetspan(props.markingModeId), React.createElement("span", {className: 'small-text padding-left-5 dim-text padding-left-5 target-status', id: props.id + '-targetName'}, props.markingTargetName)));
    /**
     * Method to load hyphen of target progress
     */
    function markingtargetspan(MarkingModeId) {
        // If selected message is a system message then returns the corresponding language json file entry
        if (props.markingModeId === enums.MarkingMode.Simulation) {
            return (React.createElement("span", null, "-"));
        }
        else {
            return (React.createElement("span", {className: 'large-text dark-link padding-right-5 target-count', id: props.id + '-progress1'}, props.examinerProgress, "/", React.createElement("span", {className: 'small-text', id: props.id + '-progress2'}, props.examinerTarget)));
        }
    }
};
module.exports = TargetProgress;
//# sourceMappingURL=targetprogress.js.map