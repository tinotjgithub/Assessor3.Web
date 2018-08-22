/*
  React component for login header
*/
/* tslint:disable:no-unused-variable */
import React = require('react');
/* tslint:disable:no-unused-variable */
import pureRenderComponent = require('../../base/purerendercomponent');
import localeStore = require('../../../stores/locale/localestore');
import localeHelper = require('../../../utility/locale/localehelper');
import enums = require('../../utility/enums');
import GenericDate = require('./genericdate');

/**
 * Properties of allocate dand last updated column
 */
interface Props extends LocaleSelectionBase, PropsBase {
    dateValue?: Date;
    dateType: enums.WorkListDateType;
    isTileView?: boolean;
    renderedOn?: number;
}

/**
 * React component class for submit button
 */
class WorkListDate extends pureRenderComponent<Props, any> {

    private dateText: string = '';
    private dateValue: string = '';
    private elementId: string = '';
    private elementKey: string = '';

    /**
     * Constructor for worklistdate 
     * @param props
     * @param state
     */
    constructor(props: Props, state: any) {
        super(props, state);
    }

    /**
     * Render component 
     * @returns
     */
	public render() {

		let cName: string;
		this.elementId = 'dtup_' + this.props.id;
		this.elementKey = 'dtup_key_' + this.props.id;

		if (!this.props.dateValue) {
			this.dateValue = localeStore.instance.TranslateText('marking.worklist.response-data.marking-not-started');

			return (
				<p className='resp-mark small-text'>
					    <GenericDate
                                id={'dtup_' + this.props.id}
                                key={'dtup_key_' + this.props.id}
                                className={'dim-text txt-val'}
                                displayText={localeStore.instance.TranslateText('marking.worklist.response-data.marking-not-started')}/>
				</p>
			);

		} else if (this.props.dateType === enums.WorkListDateType.allocatedDate) {
			this.dateText = localeStore.instance.TranslateText('marking.worklist.tile-view-labels.allocated');
			this.elementId = 'dtalloc_' + this.props.id;
			this.elementKey = 'dtalloc_key_' + this.props.id;

			return (
                <div className='resp-allocated-date small-text'>
                        <GenericDate
                                dateValue={this.props.dateValue}
                                id={this.elementId}
                                key={this.elementId}
                                className={'dim-text txt-val small-text'}/>
                    </div>);
		} else if (this.props.dateType === enums.WorkListDateType.submittedDate) {
			this.dateText = localeStore.instance.TranslateText('marking.worklist.tile-view-labels.submitted');
			this.elementId = 'dtsubmit_' + this.props.id;
			this.elementKey = 'dtsubmit_key_' + this.props.id;

			return (
				(<div className='resp-allocated-date small-text'>
					<span className='ex-dim-text txt-label'>{this.dateText}: </span>
                        <GenericDate
                                dateValue={this.props.dateValue}
                                id={this.elementId}
                                key={this.elementId}
                                className={'dim-text txt-val'}/>
				</div>)
			);
		}
		return null;
	}
}
export = WorkListDate;