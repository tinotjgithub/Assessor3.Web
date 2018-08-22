/*
React component for My Judgement Button
*/

/* tslint:disable:no-unused-variable */
import React = require('react');
/* tslint:enable:no-unused-variable */
import pureRenderComponent = require('../base/purerendercomponent');
import GenericButton = require('../utility/genericbutton');
import localeStore = require('../../stores/locale/localestore');
let classNames = require('classnames');
import stringHelper = require('../../utility/generic/stringhelper');
import awardingStore = require('../../stores/awarding/awardingstore');
import awardingActionCreator = require('../../actions/awarding/awardingactioncreator');
import domManager = require('../../utility/generic/domhelper');
import awardingHelper = require('../utility/awarding/awardinghelper');

/**
 * Properties of a component
 */
interface Props extends PropsBase, LocaleSelectionBase {
    isDisabled: boolean;
}

/**
 * All fields optional to allow partial state updates in setState
 */
interface State {
    renderedOn?: number;
    isExpanded: boolean;
}

interface JudgementStatusProps extends PropsBase, LocaleSelectionBase {
	selectedAwardingJudgementStatus: AwardingJudgementStatus;
	onClick: Function;
}

/* tslint:disable:variable-name */

const JudgementStatus: React.StatelessComponent<JudgementStatusProps> = (props: JudgementStatusProps) => {
	return (
		< li
			key={'key_status_' + props.selectedAwardingJudgementStatus.awardingJudgementID}
			onClick={() => { props.onClick(props.selectedAwardingJudgementStatus); }}
			id={'id_status_' + props.selectedAwardingJudgementStatus.awardingJudgementID}>
			<a href='javascript:void(0);'>{
				awardingHelper.getUserDefinedJudgementStatusName(props.selectedAwardingJudgementStatus.awardingJudgementID,
				props.selectedAwardingJudgementStatus.awardingJudgementStatusName)}</a>
		</li>);
};

/**
 * React component class for MyJudgement Button
 */
class MyJudgementButton extends pureRenderComponent<Props, State> {

	/**
	 * constructor
	 * @param props
	 */
    constructor(props: Props) {
        super(props, null);

        this.state = {
            isExpanded: undefined,
            renderedOn: Date.now()
		};
    }

	/**
	 * Render the MyJudgement button
	 */
	public render() {
		return (
			<div id='awd_status_list'>
				<div className={classNames
					(
					this.props.isDisabled ? 'ms-footer-button-holder' : 'supervisor-sampling-holder'
					, 'dropdown-wrap white-dropdown up white supervisor-remark-decision',
					{ 'close': this.state.isExpanded === false },
					{ 'open': this.state.isExpanded === true }
					)}>
					<GenericButton
						id={'myjudgement_btn'}
						key='key_myjudgement_btn'
						title={localeStore.instance.TranslateText
							('awarding.response-data.myjudgementbutton')}
						className={classNames('button rounded primary set-reviewed', { 'disabled': this.props.isDisabled })}
						childrens={this.getMyJudgementButtonWithStatus()}
						disabled={this.props.isDisabled}
						onClick={() => { this.onClick(); }} />
						{this.getJudgementStatusList()}
				</div>
			</div>
		);
	}

	/**
	 * Get the Judgement status list
	 */
	private getJudgementStatusList(): JSX.Element {
		if (!this.props.isDisabled) {
			let statusList: any = (awardingStore.instance.awardingJudgementStatusList &&
				awardingStore.instance.awardingJudgementStatusList.map((item: any) => {
					return (<JudgementStatus id={'id_judgement_' + item.awardingJudgementID}
						key={'key_judgement_' + item.awardingJudgementID}
						selectedAwardingJudgementStatus={item}
						onClick={this.selectJudgementStatus} />);
				}));
			let noneStatus: AwardingJudgementStatus = {
				awardingJudgementID: -1,
				awardingJudgementStatusName: localeStore.instance.TranslateText('awarding.response-data.none'),
				awardingJudgementStatusDescription: localeStore.instance.TranslateText('awarding.response-data.none')
			};

			return (
				<ul className='supervisor-select-options menu' id='judgement_list'>
					<JudgementStatus id='id_judgement_none' key='key_judgement_none'
						selectedAwardingJudgementStatus={noneStatus}
						onClick={this.selectJudgementStatus} />
					{statusList}
				</ul>);
		} else {
			return null;
		}
	}

	/**
	 * componentDidMount React lifecycle event
	 */
	public componentDidMount() {
		window.addEventListener('touchend', this.hideAwardingJudgementList);
		window.addEventListener('click', this.hideAwardingJudgementList);
        awardingStore.instance.addListener(awardingStore.AwardingStore.AWARDING_JUDGEMENT_STATUS_SELECTED,
            this.reRenderOn);
    }

	/**
	 * componentWillMount React lifecycle event
	 */
	public componentWillUnmount() {
		window.removeEventListener('touchend', this.hideAwardingJudgementList);
		window.removeEventListener('click', this.hideAwardingJudgementList);
        awardingStore.instance.removeListener(awardingStore.AwardingStore.AWARDING_JUDGEMENT_STATUS_SELECTED,
            this.reRenderOn);
	}

	/**
	 * Hide dropdown list when outside window click event.
	 */
	private hideAwardingJudgementList = (event: any): void => {
		if (event.target !== undefined &&
			domManager.searchParentNode(event.target, function (el: any) {
			return (el.id === 'awd_status_list');
			}) == null) {
			if (this.state.isExpanded === true) {
				this.setState({
					isExpanded: false
				});
			}
		}
	}

	/**
	 * reRender the Component after the select the judgement status
	 */
    private reRenderOn = () => {
        this.setState({
            renderedOn: Date.now()
        });
    }

	/**
	 * Click event for Judgement button
	 */
    private onClick() {
        this.setState({
            isExpanded: !this.state.isExpanded
        });
    }

	/**
	 * Select the Judgement Status from the list.
	 * @param selectedStatus
	 */
    private selectJudgementStatus = (selectedStatus: AwardingJudgementStatus) => {

        if (selectedStatus) {
            awardingActionCreator.selectAwardingJudgementStatus(selectedStatus,
                awardingStore.instance.selectedCandidateData.awardingCandidateID);
        }

		this.setState({
			isExpanded: false
		});
	}

	/**
	 * Get the Judgement Button Name with Loggedin Examiner's Status
	 */
	private getMyJudgementButtonWithStatus() {
		let childElement: Array<JSX.Element> = new Array<JSX.Element>();
		let statusName = awardingHelper.getUserDefinedJudgementStatusName(
			awardingStore.instance.selectedCandidateData.awardingJudgementStatusID,
			awardingStore.instance.selectedCandidateData.awardingJudgementStatusName);

		childElement.push(< span id='judgement-button-content'
			className='padding-left-5 padding-right-10' > {localeStore.instance.TranslateText
				('awarding.response-data.myjudgementbutton')}</span >);

		if (statusName) {
			childElement.push(<span id='judgement-status-text'
				className={classNames(this.props.isDisabled ? 'footer-button-selected' : 'supervisor-selcted', 'small-text')}> {
					statusName
				}</span>);
		}

		return childElement;
	}
}
export = MyJudgementButton;