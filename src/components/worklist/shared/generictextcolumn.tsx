/*
    React component for generic text column in list view
*/
/* tslint:disable:no-unused-variable */
import React = require('react');
/* tslint:disable:no-unused-variable */

/**
 * Properties of last updated date.
 */
interface Props extends LocaleSelectionBase, PropsBase {
    textValue?: Date;
    title?: string;
}

/* tslint:disable:variable-name */
const GenericTextColumn = (props: Props) => {
    return (
        <span id={'gen_' + props.id} className='dim-text txt-val small-text'
            title={(props.title) ? props.title : ''}>
            {props.textValue}
        </span>
    );
};

export = GenericTextColumn;