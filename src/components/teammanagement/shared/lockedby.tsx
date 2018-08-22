import React = require('react');

interface LockedByProps extends PropsBase {
    lockedByExaminerName: string;
}

/**
 * Stateless component for locked By  column in MyTeam Grid
 * @param props
 */
const lockedBy: React.StatelessComponent<LockedByProps> = (props: LockedByProps) => {

    return (
        <span className='small-text dim-text'>{props.lockedByExaminerName}</span>
    );
};
export = lockedBy;