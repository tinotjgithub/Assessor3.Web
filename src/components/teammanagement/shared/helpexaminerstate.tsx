import React = require('react');
import enums = require('../../utility/enums');
import localeStore = require('../../../stores/locale/localestore');
interface HelpExaminerStateProps extends PropsBase {
    examinerState: enums.SEPWorkFlowStatus;
    suspendedCount: number;
}

/**
 * Stateless component for examiner column in MyTeam Grid
 * @param props
 */
const state: React.StatelessComponent<HelpExaminerStateProps> = (props: HelpExaminerStateProps) => {

    /**
     * This method gets the class for state icon
     */
    const getClassForStateIcon = () => {
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
    const getTextForExaminerState = () => {
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
                    + localeStore.instance.TranslateText
                        ('team-management.help-examiners.help-examiners-data.times-suspended-time-label') + ')';
        }
    };

    return (
        <span className = 'error'>
            <span className={'sprite-icon ' + getClassForStateIcon() + ' text-middle'} id= { props.id + '-state'}>
            </span>
            <span className='small-text padding-left-5'> { getTextForExaminerState() }
            </span>
        </span>
    );
};

/* tslint:enable */

export = state;