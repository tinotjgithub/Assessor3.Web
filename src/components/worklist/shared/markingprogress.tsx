/*
  React component for login header
*/
/* tslint:disable:no-unused-variable */
import React = require('react');
/* tslint:disable:no-unused-variable */
import PureRenderComponent = require('../../base/purerendercomponent');
import localeStore = require('../../../stores/locale/localestore');
import SubmitResponse = require('./submitresponse');
import localeHelper = require('../../../utility/locale/localehelper');
import enums = require('../../utility/enums');
import markerOperationModeFactory = require('../../utility/markeroperationmode/markeroperationmodefactory');
let classNames = require('classnames');
import Immutable = require('immutable');
import worklistStore = require('../../../stores/worklist/workliststore');
import ClassifyResponse = require('../../standardisationsetup/shared/classifyresponse');
import standardisationActionCreator = require('../../../actions/standardisationsetup/standardisationactioncreator');


/**
 * Properties of marking progress
 */
interface Props extends LocaleSelectionBase, PropsBase {
    responseStatus: Immutable.List<enums.ResponseStatus>;
    progress: number;
    markGroupId: number;
    isSubmitDisabled: boolean;
    isTileView: boolean;
	isTeamManagementMode: boolean;
    standardisationSetupTab?: enums.StandardisationSetup;
    stdResponseDetails?: StandardisationResponseDetails;
}

/**
 * React component class for marking progress
 */
class MarkingProgress extends PureRenderComponent<Props, any> {

    /**
     * Constructor for MarkingProgress
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
        if (this.props.responseStatus !== undefined) {
            if (this.props.responseStatus.contains(enums.ResponseStatus.readyToSubmit) &&
                !(this.props.isTeamManagementMode ||
					worklistStore.instance.isMarkingCheckMode)) {
				if (this.props.standardisationSetupTab === enums.StandardisationSetup.UnClassifiedResponse) {
					return (<ClassifyResponse
						id={this.props.id}
						key={this.props.id + '_key'}
						isDisabled={false}
                        buttonTextResourceKey={'standardisation-setup.right-container.classify-button'}
                        esMarkGroupId={this.props.markGroupId}
                        onClickAction={this.classifyMultiOptionPopUpOpen}
                        />);
				} else {
					return (
						<SubmitResponse isSubmitAll={false}
							selectedLanguage={this.props.selectedLanguage}
							id={this.props.id}
							key={'key_' + this.props.id}
							markGroupId={this.props.markGroupId}
							isDisabled={this.props.isSubmitDisabled}
                            isTileView={this.props.isTileView}
                            standardisationSetupType={this.props.standardisationSetupTab}
                            stdResponseDetails={this.props.stdResponseDetails}
						/>
					);
				}
            } else if (this.props.responseStatus.contains(enums.ResponseStatus.markingNotStarted)) {
                return (
                    ((!this.props.isTileView) ? null :
                    <div className='col wl-status text-center' id={this.props.id + '_markingProgress'}>
                        <div className='col-inner'>
                        </div>
                        </div>)
                );
			} else if (this.props.responseStatus.contains(enums.ResponseStatus.definitiveMarkingNotStarted) ||
				this.props.responseStatus.contains(enums.ResponseStatus.NoViewDefinitivesPermisssion)){
				return (
					<span className='dim-text txt-val small-text' id={this.props.id + '_provisional'}>
						{localeStore.instance.TranslateText('standardisation-setup.right-container.status-provisional')}
					</span>
					);
			} else {
                return (
                    ((!this.props.isTileView) ? <span className = {classNames('inline-bubble oval', {
                        'pink': (this.props.responseStatus.contains(enums.ResponseStatus.hasException) ||
                            this.props.responseStatus.contains(enums.ResponseStatus.hasZoningException) ||
                            this.props.responseStatus.contains(enums.ResponseStatus.markChangeReasonNotExist) ||
                            this.props.responseStatus.contains(enums.ResponseStatus.supervisorRemarkDecisionNotSelected) ||
                            this.props.responseStatus.contains(enums.ResponseStatus.wholeResponseNotAvailable) ||
                            this.props.responseStatus.contains(enums.ResponseStatus.notAllPagesAnnotated)) &&
                            !worklistStore.instance.isMarkingCheckMode ?
                            false : true
                    })
                    } id={this.props.id + '_markingProgress'}> {
                            markerOperationModeFactory.operationMode.showMarkingProgressWithPercentage(
                                this.props.responseStatus.contains(enums.ResponseStatus.markingInProgress))
                        ? localeHelper.toLocaleString(this.props.progress) + '%' : ''}</span>
                        :
                    <div className='col wl-status text-center' id={this.props.id + '_markingProgress'}>
                        <div className='col-inner'>
                            <span className = {
                                classNames('inline-bubble oval',
                                    {
                                        'pink': this.props.responseStatus.contains(enums.ResponseStatus.hasException) ||
                                            this.props.responseStatus.contains(enums.ResponseStatus.hasZoningException) ||
                                            this.props.responseStatus.contains(enums.ResponseStatus.markChangeReasonNotExist) ||
                                            this.props.responseStatus.contains(enums.ResponseStatus.supervisorRemarkDecisionNotSelected) ||
                                            this.props.responseStatus.contains(enums.ResponseStatus.wholeResponseNotAvailable) ||
                                            this.props.responseStatus.contains(enums.ResponseStatus.notAllPagesAnnotated) ?
                                            false : true
                                    })
                            }>
                                    {this.props.responseStatus.contains(enums.ResponseStatus.markingInProgress)
                                    ? localeHelper.toLocaleString(this.props.progress) + '%' : ''}
                            </span>

                        </div>
                            </div>)
                );
            }
        } else {
            return (null);
        }
    }

    /**
     * Checks if Share button text is visible
     */
    private isShareButtonVisible() {
        return this.props.standardisationSetupTab === enums.StandardisationSetup.ProvisionalResponse;
    }

    /**
     * Open classify multi option pop with unclassified response details
     */
    private classifyMultiOptionPopUpOpen = (esMarkGroupId: number) => {
	    standardisationActionCreator.reclassifyMultiOptionPopupOpen(esMarkGroupId);
    }

}
export = MarkingProgress;