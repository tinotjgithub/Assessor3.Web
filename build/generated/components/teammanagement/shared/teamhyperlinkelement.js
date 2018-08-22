"use strict";
var React = require('react');
var teamManagementActionCreator = require('../../../actions/teammanagement/teammanagementactioncreator');
var teamManagementStore = require('../../../stores/teammanagement/teammanagementstore');
var enums = require('../../utility/enums');
/**
 * A generic hyperlink element
 * @param props
 */
var teamHyperlinkElement = function (props) {
    var teamHyperlinkElement = (React.createElement("a", {href: 'javascript:void(0)', onClick: function () { onExceptionLinkClick(props.elementId); }, className: props.className, id: props.id}, props.elementId));
    return teamHyperlinkElement;
};
/**
 * Exception click event
 * @param exceptionId
 */
function onExceptionLinkClick(exceptionId) {
    var selectedExceptionId = exceptionId.toString();
    // Remove prefix '5'
    exceptionId = parseInt(selectedExceptionId.substring(1, selectedExceptionId.length));
    //teamManagementActionCreator.selectedException(exceptionId);
    if (teamManagementStore.instance.exceptionList) {
        var _exceptionList = teamManagementStore.instance.exceptionList;
        // filter exception list to get the selected exception detail
        var selectedException = teamManagementStore.instance.selectedException;
        selectedException = _exceptionList.
            filter(function (x) { return x.exceptionId
            === exceptionId; }).first();
        /* Invoke examiner validation method before open an exception,
         if it valid then open exception otherwise return warning message */
        teamManagementActionCreator.teamManagementExaminerValidation(selectedException.markSchemeGroupId, teamManagementStore.instance.selectedExaminerRoleId, 0, selectedException.originatorExaminerId, enums.ExaminerValidationArea.ExceptionAction, false, null, 0, exceptionId);
    }
}
module.exports = teamHyperlinkElement;
//# sourceMappingURL=teamhyperlinkelement.js.map