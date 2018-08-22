/*
  React component for Classify response header
*/
/* tslint:disable:no-unused-variable */
import React = require('react');
/* tslint:enable:no-unused-variable */
import PureRenderComponent = require('../../base/purerendercomponent');
import localeStore = require('../../../stores/locale/localestore');
import enums = require('../../utility/enums');

let classNames = require('classnames');

/**
 * Properties of Classify button
 */
interface ClassifyResponseProps extends LocaleSelectionBase, PropsBase {
	isDisabled: boolean;
	renderedOn?: number;
	esMarkGroupId?: number;
	buttonTextResourceKey: string;
	onClickAction?: Function;
}

const classifyResponse:
	React.StatelessComponent<ClassifyResponseProps> =
	(props: ClassifyResponseProps) => {
		let className: string = 'primary rounded popup-nav wl-classfy-btn button';

		if (props.isDisabled) {
			className = className + ' disabled';
		}

		const onClickHandler = (event) => {
			if (props.onClickAction) {
				props.onClickAction(props.esMarkGroupId);
			}
    	};

		let result = <button
			id={'classifyResponse_' + props.id}
			key={'classifyResponse_key_' + props.id}
			disabled={props.isDisabled ? true : false}
			title={''}
			className={className}
			onClick={onClickHandler}>
			{localeStore.instance.TranslateText(props.buttonTextResourceKey)}
		</button>;

		return result;
};
export = classifyResponse;