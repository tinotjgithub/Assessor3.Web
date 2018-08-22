import React = require('react');
import enums = require('../../utility/enums');

interface TargetProgressProps extends PropsBase {
    examinerProgress: number;
    examinerTarget: number;
    markingTargetName: string;
    markingModeId: enums.MarkingMode;
}


/* tslint:disable:variable-name */

/**
 * Stateless component for examiner column in MyTeam Grid
 * @param props
 */
const TargetProgress: React.StatelessComponent<TargetProgressProps> = (props: TargetProgressProps) => {

    return (
        <span>
            {markingtargetspan(props.markingModeId) }
            <span className='small-text padding-left-5 dim-text padding-left-5 target-status' id= { props.id + '-targetName'}>
                { props.markingTargetName }</span>
        </span>
    );

    /**
     * Method to load hyphen of target progress
     */

    function markingtargetspan(MarkingModeId: enums.MarkingMode) {
        // If selected message is a system message then returns the corresponding language json file entry
        if (props.markingModeId === enums.MarkingMode.Simulation) {
            return (
                <span>
                    -</span>
            );
        } else {
            return (<span className='large-text dark-link padding-right-5 target-count' id= { props.id + '-progress1'}>
                { props.examinerProgress }/
                <span className='small-text' id= { props.id + '-progress2'} >{ props.examinerTarget }</span>
            </span>);
        }
    }
};


/* tslint:enable */

export = TargetProgress;