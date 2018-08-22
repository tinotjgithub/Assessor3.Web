"use strict";
var React = require('react');
var teamManagementActionCreator = require('../../../actions/teammanagement/teammanagementactioncreator');
var enums = require('../../utility/enums');
var qigStore = require('../../../stores/qigselector/qigstore');
var teamManagementStore = require('../../../stores/teammanagement/teammanagementstore');
var examinerStore = require('../../../stores/markerinformation/examinerstore');
var storageAdapterFactory = require('../../../dataservices/storageadapters/storageadapterfactory');
var applicationactioncreator = require('../../../actions/applicationoffline/applicationactioncreator');
/* tslint:disable:variable-name */
var ExpandableButton = function (props) {
    if (props.hasSub) {
        return (React.createElement("a", {href: 'javascript:void(0)', onClick: function () { onExpandableButtonClick(props.examinerRoleId, props.isExpanded); }, className: 'exp-collapse', id: props.id + '_expandableButton'}));
    }
    else {
        return null;
    }
};
var ExaminerName = function (props) {
    var examinerName = (props.isCoordinationCompleted || props.isLockedByCurrentExaminer) ?
        React.createElement("a", {href: 'javascript:void(0)', onClick: function () { onExaminerClick(props.examinerId, props.examinerRoleId, props.examinerState); }, className: 'examiner-name', id: props.id + '_examinerName'}, props.examinerName) :
        React.createElement("span", {className: 'examiner-name', id: props.id + '_examinerName'}, " ", props.examinerName, " ");
    return examinerName;
};
/**
 * Stateless component for examiner column in MyTeam Grid
 * @param props
 */
var Examiner = function (props) {
    return (React.createElement("div", null, React.createElement(ExpandableButton, {examinerRoleId: props.examinerRoleId, id: props.id, key: 'key_ExpandButton_' + props.id, hasSub: props.hasSub, isExpanded: props.isExpanded}), React.createElement(ExaminerName, {id: props.id, key: 'key_Examiner_' + props.id, examinerId: props.examinerId, examinerRoleId: props.examinerRoleId, examinerName: props.examinerName, isCoordinationCompleted: props.isCoordinationCompleted, isLockedByCurrentExaminer: props.isLockedByCurrentExaminer, examinerState: props.examinerState})));
};
/* tslint:enable */
/**
 * This will call on expand node button click
 * @param examinerRoleId
 * @param isExpanded
 */
function onExpandableButtonClick(examinerRoleId, isExpanded) {
    teamManagementActionCreator.expandOrCollapseExaminerNode(examinerRoleId, !isExpanded);
}
/**
 * This method will call on examiner link click
 * @param examinerId
 * @param examinerRoleId
 */
function onExaminerClick(examinerId, examinerRoleId, examinerStatus) {
    if (!applicationactioncreator.checkActionInterrupted()) {
        return;
    }
    var examinerDrillDownData = { examinerId: examinerId, examinerRoleId: examinerRoleId };
    var examinerValidationArea = enums.ExaminerValidationArea.MyTeam;
    var examinerPreviousApprovalState = examinerStore.instance.examinerApprovalStatus(examinerRoleId);
    if (examinerStatus !== examinerPreviousApprovalState) {
        storageAdapterFactory.getInstance().deleteData('marker', 'markerInformation_' + examinerRoleId).catch();
    }
    if (teamManagementStore.instance.selectedTeamManagementTab === enums.TeamManagement.HelpExaminers) {
        teamManagementActionCreator.updateExaminerDrillDownData(examinerDrillDownData);
    }
    else {
        // validates the selected examiner
        teamManagementActionCreator.teamManagementExaminerValidation(qigStore.instance.getSelectedQIGForTheLoggedInUser.markSchemeGroupId, qigStore.instance.getSelectedQIGForTheLoggedInUser.examinerRoleId, examinerRoleId, examinerId, examinerValidationArea, false, null, enums.MarkingMode.None, 0, true);
    }
}
module.exports = Examiner;
//# sourceMappingURL=examiner.js.map