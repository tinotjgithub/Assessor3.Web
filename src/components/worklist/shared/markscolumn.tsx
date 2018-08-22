/*
    React component for marks column in marks by question view.
*/
/* tslint:disable:no-unused-variable */
import React = require('react');
/* tslint:disable:no-unused-variable */

/**
 * Properties of marks column.
 */
interface Props extends LocaleSelectionBase, PropsBase {
    textValue?: string;
    usedInTotal: boolean;
}

/* tslint:disable:variable-name */
const MarksColumn = (props: Props) => {
    let className: string = (props.usedInTotal || props.textValue === '-') ?
        'dim-text txt-val small-text' : 'small-text strike-out dim-text';
    return (
        <span id={'gen_' + props.id} className={className}>
            {props.textValue}
        </span>
    );
};

export = MarksColumn;