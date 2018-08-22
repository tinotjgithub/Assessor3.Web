import React = require('react');

interface TeamCellElementProps extends PropsBase {
    classValue: string;
    textValue: string;
}

/**
 * Stateless component for generic text element column in MyTeam Grid
 * @param props
 */
const teamCellElement: React.StatelessComponent<TeamCellElementProps> = (props: TeamCellElementProps) => {

    return (
        <span id={'team_' + props.id} className={props.classValue}>{props.textValue}</span>
    );
};
export = teamCellElement;