/*
  React component for Generic button.
*/
/* tslint:disable:no-unused-variable */
import React = require('react');
/* tslint:disable:no-unused-variable */
import genericCheckBoxItems = require('../utility/genericcheckboxitems');
import GenericCheckbox = require('../utility/genericcheckbox');


interface Props extends LocaleSelectionBase, PropsBase {
	className?: string;
	onChecked?: Function;
	items?: Array<genericCheckBoxItems>;
}

/**
 * React component class for Generic popup with check boxes implementation.
 */
const genericPopupWithCheckBoxes: React.StatelessComponent<Props> = (props: Props) => {
	let that = this;
	let toRender = (<div id={props.id} key='key_checkbox_genericpopup' className={props.className} >
		{
			props.items && props.items.map((item: genericCheckBoxItems) =>
				<GenericCheckbox
					id={'checkbox_genericpopup_' + item.id}
					key={'checkbox_genericpopup_key' + item.id}
					containerClassName={item.containerClassName}
					className={item.className}
					disabled={item.disabled}
					isChecked={item.isChecked}
					labelClassName={item.labelClassName}
					labelContent={item.labelContent}
					onSelectionChange={props.onChecked.bind(that, item)} />
			)
		}
	</div>);

	return toRender;
};

export = genericPopupWithCheckBoxes;
