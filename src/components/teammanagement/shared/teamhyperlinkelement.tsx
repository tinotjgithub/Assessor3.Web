import React = require('react');
import teamManagementActionCreator = require('../../../actions/teammanagement/teammanagementactioncreator');
import teamManagementStore = require('../../../stores/teammanagement/teammanagementstore');
import enums = require('../../utility/enums');

/**
 * The props for Team Hyperlinks
 */
interface TeamHyperlinkElementProps extends PropsBase {
    elementId: number;
    className: string;
    componentName: string;
}

/**
 * A generic hyperlink element
 * @param props
 */
const teamHyperlinkElement: React.StatelessComponent<TeamHyperlinkElementProps> = (props: TeamHyperlinkElementProps) => {
    let teamHyperlinkElement: JSX.Element =
        (<a href='javascript:void(0)' onClick={() => { onExceptionLinkClick(props.elementId); } }
            className={props.className} id={props.id} >{props.elementId}</a>);
    return teamHyperlinkElement;
};

/**
 * Exception click event
 * @param exceptionId
 */
function onExceptionLinkClick(exceptionId: number) {
    let selectedExceptionId: string = exceptionId.toString();
    // Remove prefix '5'
    exceptionId = parseInt(selectedExceptionId.substring(1, selectedExceptionId.length));
    //teamManagementActionCreator.selectedException(exceptionId);

    if (teamManagementStore.instance.exceptionList) {
        let _exceptionList = teamManagementStore.instance.exceptionList;
        // filter exception list to get the selected exception detail
        let selectedException: UnActionedExceptionDetails = teamManagementStore.instance.selectedException;
        selectedException = _exceptionList.
            filter((x: UnActionedExceptionDetails) => x.exceptionId
                === exceptionId).first();

        /* Invoke examiner validation method before open an exception,
         if it valid then open exception otherwise return warning message */
        teamManagementActionCreator.teamManagementExaminerValidation(
        selectedException.markSchemeGroupId,
        teamManagementStore.instance.selectedExaminerRoleId, 0,
        selectedException.originatorExaminerId,
        enums.ExaminerValidationArea.ExceptionAction,
            false, null, 0, exceptionId);
    }
}

export = teamHyperlinkElement;