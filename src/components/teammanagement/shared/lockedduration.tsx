import React = require('react');

interface StateProps extends PropsBase {
    lockedDuration: string;
}
/**
 * Stateless component for Locked Duration column in MyTeam Grid
 * @param props
 */
const lockedDuration: React.StatelessComponent<StateProps> = (props: StateProps) => {

    return (
        <span className='small-text dim-text'>{props.lockedDuration}</span>
    );
};
export = lockedDuration;