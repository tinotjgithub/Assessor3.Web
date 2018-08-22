"use strict";
var React = require('react');
var enums = require('../../utility/enums');
var localeStore = require('../../../stores/locale/localestore');
var classNames = require('classnames');
var teamManagementActionCreator = require('../../../actions/teammanagement/teammanagementactioncreator');
var Immutable = require('immutable');
var applicationactioncreator = require('../../../actions/applicationoffline/applicationactioncreator');
/**
 * Stateless component for Lock/UnLock button in Help Examiner's grid
 * @param props
 */
var sepAction = function (props) {
    if (props.sepAction === enums.SEPAction.Lock || props.sepAction === enums.SEPAction.Unlock) {
        var buttonText = localeStore.instance.TranslateText('team-management.help-examiners.help-examiners-data.' +
            enums.getEnumString(enums.SEPAction, props.sepAction).toLowerCase());
        return (React.createElement("button", {id: props.id, className: classNames(props.sepAction === enums.SEPAction.Lock ? 'primary' : '', 'rounded lock-btn'), onClick: function () {
            onSEPActionClick(props.sepAction, props.examinerRoleId, props.markSchemeGroupId, props.requestedByExaminerRoleId);
        }}, buttonText));
    }
    return null;
};
/**
 * Click for the component
 * @param actionIdentifier
 * @param examinerRoleId
 * @param markSchemeGroupId
 * @param requestedByExaminerRoleId
 */
function onSEPActionClick(actionIdentifier, examinerRoleId, markSchemeGroupId, requestedByExaminerRoleId) {
    if (!applicationactioncreator.checkActionInterrupted()) {
        return;
    }
    var dataCollection = new Array();
    var that = this;
    var examinerSEPAction = {
        examinerRoleId: examinerRoleId,
        markSchemeGroupId: markSchemeGroupId,
        requestedByExaminerRoleId: requestedByExaminerRoleId
    };
    dataCollection.push(examinerSEPAction);
    var examinerSEPActions = Immutable.List(dataCollection);
    var doSEPApprovalManagementActionArgument = {
        actionIdentifier: actionIdentifier,
        examiners: examinerSEPActions
    };
    teamManagementActionCreator.CanExecuteApprovalManagementAction(doSEPApprovalManagementActionArgument);
}
module.exports = sepAction;
//# sourceMappingURL=sepaction.js.map