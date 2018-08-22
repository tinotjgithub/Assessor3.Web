/*
  React component for Submit response header
*/
/* tslint:disable:no-unused-variable */
import React = require('react');
/* tslint:enable:no-unused-variable */
import PureRenderComponent = require('../../base/purerendercomponent');
import localeStore = require('../../../stores/locale/localestore');
import submitActionCreator = require('../../../actions/submit/submitactioncreator');
import enums = require('../../utility/enums');
import busyIndicatorActionCreator = require('../../../actions/busyindicator/busyindicatoractioncreator');
import targetHelper = require('../../../utility/target/targethelper');
import qigStore = require('../../../stores/qigselector/qigstore');
import examinerstore = require('../../../stores/markerinformation/examinerstore');
import worklistStore = require('../../../stores/worklist/workliststore');
import markingStore = require('../../../stores/marking/markingstore');
import markSchemePanel = require('../../markschemestructure/markschemepanel');
import markingActionCreator = require('../../../actions/marking/markingactioncreator');
import submitHelper = require('../../utility/submit/submithelper');
import markingHelper = require('../../../utility/markscheme/markinghelper');
import messagingActionCreator = require('../../../actions/messaging/messagingactioncreator');
import messageStore = require('../../../stores/message/messagestore');
let classNames = require('classnames');
import exceptionStore = require('../../../stores/exception/exceptionstore');
import exceptionActionCreator = require('../../../actions/exception/exceptionactioncreator');
import combinedWarningPopupHelper = require('../../utility/popup/responseerrordialoghelper');
import eCourseWorkFileStore = require('../../../stores/response/digital/ecourseworkfilestore');
import applicationActionCreator = require('../../../actions/applicationoffline/applicationactioncreator');
import standardisationsetupActionCreator = require('../../../actions/standardisationsetup/standardisationactioncreator');

/**
 * Properties of Submit button
 */
interface Props extends LocaleSelectionBase, PropsBase {
    isSubmitAll: boolean;
    markGroupId?: number;
    isDisabled?: boolean;
    fromMarkScheme?: boolean;
    isTileView?: boolean;
    isVisible?: boolean;
    checkIsSubmitVisible?: Function;
    standardisationSetupType?: enums.StandardisationSetup;
    stdResponseDetails?: StandardisationResponseDetails;
    updatedTotalMarks?: string;
    renderedOn?: number;
}

/**
 * State of a SubmitResponse
 */
interface State {
    reRender?: number;
}


/**
 * React component class for submit button
 */
class SubmitResponse extends PureRenderComponent<Props, State> {

    private saveMarks: MarksAndAnnotationsManagementBase;
    private isVisible: boolean;

    /**
     * Constructor for SubmitResponse
     * @param props
     * @param state
     */
    constructor(props: Props, state: State) {
        super(props, state);
        this.state = {
            reRender: Date.now()
        };
        this.onSubmit = this.onSubmit.bind(this);
        this.showHideMarkChangeReason = this.showHideMarkChangeReason.bind(this);
        this.isVisible = this.props.isVisible;
    }

    /**
     * Render component
     */
    public render() {
        /**
         * show multiple/single response submit button
         */
        if (this.props.isSubmitAll) {
            return (
                <button
                    id={'submitResponseAll_' + this.props.id}
                    key = {'submitResponseAll_key_' + this.props.id}
                    title={!this.props.isDisabled ? '' :
                        localeStore.instance.TranslateText('marking.worklist.action-buttons.submit-button-not-approved-tooltip') }
                    disabled ={this.props.isDisabled ? true : false }
                    className= { classNames('button primary rounded',
                        {
                            'disabled submit-all-rsp-btn': this.props.isDisabled
                        }) }
                    onClick ={ this.onSubmit }>
                    {localeStore.instance.TranslateText('marking.worklist.action-buttons.submit-button') }
                    {this.renderSubTextItem() }
                    </button>
            );
        } else if (this.props.fromMarkScheme) {
            if (this.isVisible) {
                return (
                    <div className='submit-holder show'>
                    {this.getSubmitButton() }
                        </div>
                );
            } else {
                return null;
            }
        } else {
            return (
                ((!this.props.isTileView) ?
                    this.getSubmitButton() :
                    <div className='col wl-status text-center'>
                    <div className='col-inner'>
                       {this.getSubmitButton() }
                        </div>
                        </div>
                ));
        }
    }

    /**
     * To get the submit button
     */
    private getSubmitButton(): any {
        let isfromStandardisationProvResponse = this.props.standardisationSetupType === enums.StandardisationSetup.ProvisionalResponse;
        let className: string = isfromStandardisationProvResponse ? 'primary button rounded popup-nav shareProv'
            : 'button primary rounded submit-button';
        let id: string = isfromStandardisationProvResponse ? 'shareProvResponse_'
            : 'submitSingleResponse_';
        let toolTip: string = isfromStandardisationProvResponse ?
            localeStore.instance.TranslateText('standardisation-setup.right-container.share-button-tooltip') : '';
        if (this.props.fromMarkScheme) {
            className = ' submit-mark rounded primary';
        } else if (this.props.isDisabled) {
            className = className + ' disabled';
        }

        let result = <button></button>;
        result = <button
            id={id + this.props.id}
            key = {'submitSingleResponse_key_' + this.props.id}
            disabled ={this.props.isDisabled ? true : false }
            title={!this.props.isDisabled ? toolTip :
                localeStore.instance.TranslateText('marking.worklist.action-buttons.submit-button-not-approved-tooltip')}
            className= {className}
            onClick ={ this.onSubmit } >
            {
                // For provisional worklist in standardisationsetup, instead of submit we should show share button
                isfromStandardisationProvResponse ?
                localeStore.instance.TranslateText('standardisation-setup.right-container.share-button') :
                localeStore.instance.TranslateText('marking.worklist.response-data.submit-button')
            }
        </button>;

        return result;
    }

    /**
     * componentDidMount
     */
    public componentDidMount() {
        markingStore.instance.addListener(
            markingStore.MarkingStore.READY_TO_NAVIGATE,
            this.submitResponseFromMarkscheme);
        markingStore.instance.addListener(
            markingStore.MarkingStore.MARK_CHANGE_REASON_VISIBILITY_UPDATED,
            this.showHideMarkChangeReason);
        eCourseWorkFileStore.instance.addListener(
            eCourseWorkFileStore.ECourseWorkFileStore.FILE_READ_STATUS_UPDATED,
            this.fileReadStatusUpdated);
    }

    /**
     * componentWillUnmount
     */
    public componentWillUnmount() {
        markingStore.instance.removeListener(
            markingStore.MarkingStore.READY_TO_NAVIGATE,
            this.submitResponseFromMarkscheme);
        markingStore.instance.removeListener(
            markingStore.MarkingStore.MARK_CHANGE_REASON_VISIBILITY_UPDATED,
            this.showHideMarkChangeReason);
        eCourseWorkFileStore.instance.removeListener(
            eCourseWorkFileStore.ECourseWorkFileStore.FILE_READ_STATUS_UPDATED,
            this.fileReadStatusUpdated);
    }

    /**
     * Comparing the props to check the updats are made by self
     * @param {Props} nextProps
     */
    public componentWillReceiveProps(nextProps: Props) {
        this.isVisible = nextProps.isVisible;
    }

    /**
     * Change visibility of mark change reason
     */
    private showHideMarkChangeReason = (): void => {
        if (this.props.checkIsSubmitVisible()) {
            this.isVisible = true;
        } else {
            this.isVisible = false;
        }
        this.setState({ reRender: Date.now() });
    };

    /**
     * File read status updated event.
     */
    private fileReadStatusUpdated = (): void => {
        this.isVisible = this.props.checkIsSubmitVisible();
        this.setState({ reRender: Date.now() });
    };

    /**
     * Method to indicate whether to show the sub text for the case where Submit button is disabled;
     * since the subtext needs to be shown only in disabled state
     */
    private renderSubTextItem() {
        if (this.props.isDisabled) {
            return (<span className= { classNames('',
                {
                    'awaiting-feedback-msg text-middle small-text': this.props.isDisabled
                }) }>
                { localeStore.instance.TranslateText('marking.worklist.action-buttons.submit-button-suspended-indicator') }
            </span>);
        }
    }

    /**
     * On clicking submit
     */
    private onSubmit(e: any) {
        //on submitting simulation response, show a confirmation popup before submit
        if (!applicationActionCreator.checkActionInterrupted()){
            return;
        }

        if (this.props.standardisationSetupType === enums.StandardisationSetup.ProvisionalResponse) {
            //ActionCreator for showing Share Response Popup
            let navigatePossible: boolean = true;
            if (this.props.fromMarkScheme) {
                this.props.stdResponseDetails.totalMarkValue = Number(this.props.updatedTotalMarks);
                let responseNavigationFailureReasons: Array<enums.ResponseNavigateFailureReason> =
                    markingHelper.canNavigateAwayFromCurrentResponse();
                if (responseNavigationFailureReasons.length > 0) {
                    navigatePossible = false;
                    let combinedWarningMessages = combinedWarningPopupHelper.getCombinedWarningMessage(enums.SaveAndNavigate.submit,
                        responseNavigationFailureReasons);
                    markingActionCreator.showResponseNavigationFailureReasons(enums.SaveAndNavigate.submit, combinedWarningMessages);
                }
            }
            if (navigatePossible) {
                standardisationsetupActionCreator.displayShareResponsePopup(this.props.stdResponseDetails, this.props.fromMarkScheme);
                return;
            }
        }

        if (worklistStore.instance.currentWorklistType === enums.WorklistType.simulation) {
            markingActionCreator.showSimulationResponseSubmitConfirmationPopup(this.props.markGroupId, this.props.fromMarkScheme);
            if (!this.props.fromMarkScheme) {
                /* stopping propagation because the parent li has a click event in tile view
                which should not work when submit is clicked
                 */
                e.stopPropagation();
            }
        } else if (this.props.fromMarkScheme) {
            let navigatePossible: boolean = true;
            let responseNavigationFailureReasons: Array<enums.ResponseNavigateFailureReason> =
                markingHelper.canNavigateAwayFromCurrentResponse();
            if (responseNavigationFailureReasons.length > 0) {
                navigatePossible = false;
                let combinedWarningMessages = combinedWarningPopupHelper.getCombinedWarningMessage(enums.SaveAndNavigate.submit,
                    responseNavigationFailureReasons);
                markingActionCreator.showResponseNavigationFailureReasons(enums.SaveAndNavigate.submit, combinedWarningMessages);
            }

            if (navigatePossible) {
                busyIndicatorActionCreator.setBusyIndicatorInvoker(enums.BusyIndicatorInvoker.submitInResponseScreen);
                markingActionCreator.saveAndNavigate(enums.SaveAndNavigate.submit);
            }
        } else {
            let markGroupId: number;
            if (this.props.isSubmitAll) {
                markGroupId = 0;
            } else {
                markGroupId = this.props.markGroupId;
            }
            submitActionCreator.submitResponseStarted(markGroupId);
            /* stopping propagation because the parent li has a click event in tile view
            which should not work when submit is clicked
             */
            e.stopPropagation();
        }
    }

    private submitResponseFromMarkscheme = (): void => {
        if (markingStore.instance.navigateTo === enums.SaveAndNavigate.submit) {
            busyIndicatorActionCreator.setBusyIndicatorInvoker(enums.BusyIndicatorInvoker.submitInResponseScreen);
            submitHelper.saveAndSubmitResponse(this.props.markGroupId);
        }
    };
}
export = SubmitResponse;