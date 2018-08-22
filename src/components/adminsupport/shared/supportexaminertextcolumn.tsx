let classNames = require('classnames');
/*
    React component for generic text column in list view
*/
/* tslint:disable:no-unused-variable */
import React = require('react');
/* tslint:disable:no-unused-variable */

/**
 * Properties of support examiner.
 */
interface Props extends LocaleSelectionBase, PropsBase {
	textValue?: String;
	classText?: boolean;
}

/* tslint:disable:variable-name */
const SupportExaminerTextColumn = (props: Props) => {
	return (
		<span id={props.id} className={classNames({ 'small-text' : props.classText})} >
			{props.textValue}
		</span>
	);
};

export = SupportExaminerTextColumn;