import React = require('react');
import enums = require('../../utility/enums');
import localeStore = require('../../../stores/locale/localestore');
interface StateProps extends PropsBase {
    examinerState: enums.ExaminerApproval;
}

/**
 * Stateless component for examiner column in MyTeam Grid
 * @param props
 */
const state: React.StatelessComponent<StateProps> = (props: StateProps) => {

    /**
     * This method gets the class for the span in examiner state
     */
    const getClassForStateSpan = () => {
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
    const getClassForStateIcon = () => {
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
    const getTextForExaminerState = () => {
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

    return (
        <span className={getClassForStateSpan() }>
            <span className={'sprite-icon ' + getClassForStateIcon() + ' text-middle'} id= { props.id + '-state'}>
            </span>
            <span className='small-text padding-left-5'> { getTextForExaminerState() }
            </span>
        </span>
    );
};

/* tslint:enable */

export = state;