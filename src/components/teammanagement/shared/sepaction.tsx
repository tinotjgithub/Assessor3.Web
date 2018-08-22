import React = require('react');
import enums = require('../../utility/enums');
import localeStore = require('../../../stores/locale/localestore');
import classNames = require('classnames');
import teamManagementActionCreator = require('../../../actions/teammanagement/teammanagementactioncreator');
import Immutable = require('immutable');
import applicationactioncreator = require('../../../actions/applicationoffline/applicationactioncreator');

interface SEPActionProps extends PropsBase {
    sepAction: enums.SEPAction;
    examinerRoleId: number;
    markSchemeGroupId: number;
    requestedByExaminerRoleId: number;
}

/**
 * Stateless component for Lock/UnLock button in Help Examiner's grid
 * @param props
 */
const sepAction: React.StatelessComponent<SEPActionProps> = (props: SEPActionProps) => {
    if (props.sepAction === enums.SEPAction.Lock || props.sepAction === enums.SEPAction.Unlock) {
        let buttonText = localeStore.instance.TranslateText('team-management.help-examiners.help-examiners-data.' +
            enums.getEnumString(enums.SEPAction, props.sepAction).toLowerCase());
        return (
            <button id={props.id} className= {classNames(props.sepAction === enums.SEPAction.Lock ? 'primary' : '', 'rounded lock-btn') }
                onClick = {() => {
                    onSEPActionClick(
                        props.sepAction,
                        props.examinerRoleId,
                        props.markSchemeGroupId,
                        props.requestedByExaminerRoleId);
                } }>
                {buttonText}
            </button>);
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
function onSEPActionClick(actionIdentifier: number, examinerRoleId: number, markSchemeGroupId: number, requestedByExaminerRoleId: number) {
    if (!applicationactioncreator.checkActionInterrupted()) {
        return;
    }
    let dataCollection: Array<ExaminerForSEPAction> = new Array<ExaminerForSEPAction>();
    let that = this;
    let examinerSEPAction: ExaminerForSEPAction = {
        examinerRoleId: examinerRoleId,
        markSchemeGroupId: markSchemeGroupId,
        requestedByExaminerRoleId: requestedByExaminerRoleId
    };
    dataCollection.push(examinerSEPAction);
    let examinerSEPActions = Immutable.List<ExaminerForSEPAction>(dataCollection);
    let doSEPApprovalManagementActionArgument: DoSEPApprovalManagementActionArgument = {
        actionIdentifier: actionIdentifier,
        examiners: examinerSEPActions
    };

   teamManagementActionCreator.CanExecuteApprovalManagementAction(doSEPApprovalManagementActionArgument);
}

export = sepAction;
