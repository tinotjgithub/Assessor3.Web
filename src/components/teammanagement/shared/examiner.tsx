import React = require('react');
import teamManagementActionCreator = require('../../../actions/teammanagement/teammanagementactioncreator');
import enums = require('../../utility/enums');
import qigStore = require('../../../stores/qigselector/qigstore');
import teamManagementStore = require('../../../stores/teammanagement/teammanagementstore');
import examinerStore = require('../../../stores/markerinformation/examinerstore');
import storageAdapterFactory = require('../../../dataservices/storageadapters/storageadapterfactory');
import applicationactioncreator = require('../../../actions/applicationoffline/applicationactioncreator');

interface ExaminerProps extends PropsBase {
    examinerId: number;
    examinerRoleId: number;
    examinerName: string;
    hasSub?: boolean;
    isLockedByCurrentExaminer?: boolean;
    isCoordinationCompleted?: boolean;
    isExpanded?: boolean;
    examinerState?: enums.ExaminerApproval;
}

interface ExpandableButtonProps extends PropsBase {
    examinerRoleId: number;
    hasSub: boolean;
    isExpanded: boolean;
}

interface ExaminerNameProps extends PropsBase {
    examinerId: number;
    examinerRoleId: number;
    examinerName: string;
    isLockedByCurrentExaminer?: boolean;
    isCoordinationCompleted?: boolean;
    examinerState?: enums.ExaminerApproval;
}

/* tslint:disable:variable-name */

const ExpandableButton: React.StatelessComponent<ExpandableButtonProps> = (props: ExpandableButtonProps) => {
    if (props.hasSub) {
        return (
            <a href='javascript:void(0)' onClick = {() => { onExpandableButtonClick(props.examinerRoleId, props.isExpanded); } }
                className='exp-collapse' id={ props.id + '_expandableButton'} ></a>
        );
    } else {
        return null;
    }
};

const ExaminerName: React.StatelessComponent<ExaminerNameProps> = (props: ExaminerNameProps) => {
    let examinerName: JSX.Element = (props.isCoordinationCompleted || props.isLockedByCurrentExaminer) ?
        <a href='javascript:void(0)' onClick = {() => { onExaminerClick(props.examinerId, props.examinerRoleId, props.examinerState); } }
            className='examiner-name' id={ props.id + '_examinerName' } >{ props.examinerName }</a> :
        <span className='examiner-name' id={ props.id + '_examinerName' }> { props.examinerName } </span>;

    return examinerName;
};


/**
 * Stateless component for examiner column in MyTeam Grid
 * @param props
 */
const Examiner: React.StatelessComponent<ExaminerProps> = (props: ExaminerProps) => {

    return (
        <div>
            <ExpandableButton examinerRoleId = { props.examinerRoleId }
                id= { props.id }
                key = { 'key_ExpandButton_' + props.id }
                hasSub = { props.hasSub }
                isExpanded = {props.isExpanded}/>
            <ExaminerName id= { props.id }
                key = { 'key_Examiner_' + props.id }
                examinerId = { props.examinerId }
                examinerRoleId = { props.examinerRoleId }
                examinerName = { props.examinerName }
                isCoordinationCompleted = { props.isCoordinationCompleted}
                isLockedByCurrentExaminer = {props.isLockedByCurrentExaminer} examinerState = {props.examinerState} />
        </div>
    );
};

/* tslint:enable */

/**
 * This will call on expand node button click
 * @param examinerRoleId
 * @param isExpanded
 */
function onExpandableButtonClick(examinerRoleId: number, isExpanded: boolean) {
    teamManagementActionCreator.expandOrCollapseExaminerNode(examinerRoleId, !isExpanded);
}

/**
 * This method will call on examiner link click
 * @param examinerId
 * @param examinerRoleId
 */
function onExaminerClick(examinerId: number, examinerRoleId: number, examinerStatus: enums.ExaminerApproval) {
    if (!applicationactioncreator.checkActionInterrupted()) {
        return;
    }
    let examinerDrillDownData: ExaminerDrillDownData = { examinerId: examinerId, examinerRoleId: examinerRoleId };

    let examinerValidationArea: enums.ExaminerValidationArea =
        enums.ExaminerValidationArea.MyTeam;

    let examinerPreviousApprovalState = examinerStore.instance.examinerApprovalStatus(examinerRoleId);

    if (examinerStatus !== examinerPreviousApprovalState) {
        storageAdapterFactory.getInstance().deleteData('marker', 'markerInformation_' + examinerRoleId).catch();
    }

    if (teamManagementStore.instance.selectedTeamManagementTab === enums.TeamManagement.HelpExaminers) {
        teamManagementActionCreator.updateExaminerDrillDownData(examinerDrillDownData);
    } else {

        // validates the selected examiner
        teamManagementActionCreator.teamManagementExaminerValidation(
            qigStore.instance.getSelectedQIGForTheLoggedInUser.markSchemeGroupId,
            qigStore.instance.getSelectedQIGForTheLoggedInUser.examinerRoleId,
            examinerRoleId,
            examinerId,
            examinerValidationArea,
            false, null, enums.MarkingMode.None, 0, true);
    }
}

export = Examiner;