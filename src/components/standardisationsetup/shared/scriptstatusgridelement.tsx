/* tslint:disable:no-unused-variable */
import React = require('react');
/* tslint:disable:no-unused-variable */
import pureRenderComponent = require('../../base/purerendercomponent');
import localeStore = require('../../../stores/locale/localestore');
import stringHelper = require('../../../utility/generic/stringhelper');
import enums = require('../../utility/enums');
import applicationStore = require('../../../stores/applicationoffline/applicationstore');
import applicationActionCreator = require('../../../actions/applicationoffline/applicationactioncreator');
import Immutable = require('immutable');

/**
 * Properties of Script Status column
 */
interface Props extends LocaleSelectionBase, PropsBase {
	isAllocatedALive: boolean;
	isUsedForProvisionalMarking: boolean;
}
/**
 * React component class for Script Status
 */
class ScriptStatusGridElement extends pureRenderComponent<Props, any>{
	private classNameText: string = '';

	/**
	 * Constructor for Script Status
	 * @param props Props
	 * @param state State
	 */
	constructor(props: Props, state: any) {
		super(props, state);
	}

    /**
     * Render component
     */
	public render(): JSX.Element {
		let parentClass: string = '';

		let isAvailable: boolean = (!this.props.isAllocatedALive
			&& !this.props.isUsedForProvisionalMarking);

		let available: string = (isAvailable) ? localeStore.instance.
			TranslateText('standardisation-setup.right-container.available-status') : localeStore.instance.
				TranslateText('standardisation-setup.right-container.not-available-status');

		if (isAvailable) {
			this.classNameText = 'sprite-icon success-small-icon text-middle';
			parentClass = 'success';
		} else {
			this.classNameText = 'sprite-icon not-small-black-icon text-middle';
		}

		return (
			<span className={parentClass} id={'status_' + this.props.id}>
				<span className={this.classNameText}></span>
				<span className='small-text padding-left-5'>{available}</span>
			</span>
		);
	}
}
export = ScriptStatusGridElement;