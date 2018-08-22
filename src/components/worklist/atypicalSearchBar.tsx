/* tslint:disable:no-unused-variable */
import React = require('react');
import pureRenderComponent = require('../base/purerendercomponent');
import localeStore = require('../../stores/locale/localestore');
import examinerStore = require('../../stores/markerinformation/examinerstore');
import responseactioncreator = require('../../actions/response/responseactioncreator');
import qigStore = require('../../stores/qigselector/qigstore');
import enums = require('../utility/enums');
import responseStore = require('../../stores/response/responsestore');
import atypicalResponseSearchResult = require('../../dataservices/response/atypicalresponsesearchresult');
import applicationactioncreator = require('../../actions/applicationoffline/applicationactioncreator');
/* tslint:enable:no-unused-variable */

/**
 * Properties of a component
 */
interface Props extends LocaleSelectionBase, PropsBase {
    disableControls?: boolean;
}

/**
 * All fields optional to allow partial state updates in setState
 */
interface State {
    isCenterValueSet: boolean;
    isCandidateValueSet: boolean;
}

/**
 * React component.
 * @param {Props} props
 * @returns
 */
class AtypicalSearchBar extends pureRenderComponent<Props, State> {

    private centerNumber: string = '';
    private candidateNumber: string = '';

    /**
     * Constructor for atypical search bar
     * @param props
     * @param state
     */
    constructor(props: Props, state: State) {
        super(props, state);
        this.state = {
            isCenterValueSet: false,
            isCandidateValueSet: false
        };
    }

    /**
     * refs
     */
    public refs: {
        [key: string]: (Element);
        atyCenterName: (HTMLInputElement);
        atyCandidateName: (HTMLInputElement);
    };

    /**
     * render component
     */
    public render(): JSX.Element {

        return <div className='atypical-search-wrap middle-content'>
                <div className='aty-center'>
                    <label htmlFor='atyCenter' className={(this.props.disableControls) ? 'disabled' : ''}>
                        {localeStore.instance.TranslateText('marking.worklist.atypical.centre-search-label') }</label>
                    <input type='text' name='atyCenterName' onChange= {this.onAtypicalCenterChange}  ref='atyCenterName'
                        id='atyCenter'  disabled={this.props.disableControls} maxLength={128} className='search-input Center'
                        title={(this.props.disableControls) ?
                            localeStore.instance.TranslateText
                                ('marking.worklist.atypical-search-error-dialog.atypical-search-error-disabled') :
                            localeStore.instance.TranslateText('marking.worklist.atypical.centre-search-tooltip') }/>
                    </div>
                <div className='aty-candidate'>
                    <label htmlFor='atyCandidate' className={(this.props.disableControls) ? 'disabled' : ''}>
                        {localeStore.instance.TranslateText('marking.worklist.atypical.candidate-search-label') }</label>
                    <input type='text' name='atyCandidateName' onChange= {this.onAtypicalCandiadateChange} ref='atyCandidateName'
                        id='atyCandidate' disabled={this.props.disableControls} maxLength={128} className='search-input Candidate'
                        title={(this.props.disableControls) ?
                            localeStore.instance.TranslateText
                                ('marking.worklist.atypical-search-error-dialog.atypical-search-error-disabled') :
                            localeStore.instance.TranslateText('marking.worklist.atypical.candidate-search-tooltip') }/>
                    </div>
                <div className='aty-search-btn'>
                    <button className={(((this.state.isCenterValueSet && this.state.isCandidateValueSet) === false)
                        || this.props.disableControls) ?
                        'btn primary rounded disabled' : 'btn primary rounded'}
                    title={(this.props.disableControls) ?
                        localeStore.instance.TranslateText
                            ('marking.worklist.atypical-search-error-dialog.atypical-search-error-disabled') :
                            localeStore.instance.TranslateText('marking.worklist.atypical.search-button-tooltip') }
                    id='atySearch' onClick={this.onAtypicalSearchButtonClick.bind(this) }>
                    {localeStore.instance.TranslateText('marking.worklist.atypical.search-button') }</button>
                    </div>
            </div>;
    }

    /**
     * This function gets invoked when the component is about to be mounted
     */
    public componentDidMount() {
        responseStore.instance.addListener(responseStore.ResponseStore.RESET_ATYPICAL_SEARCH_FIELD, this.resetAtypicalSearchField);
        responseStore.instance.addListener(responseStore.ResponseStore.ATYPICAL_SEARCH_RESULT_EVENT, this.resetAtypicalSearchField);
        responseStore.instance.addListener(responseStore.ResponseStore.RESPONSE_ALLOCATED_EVENT, this.onResponseAllocated);
    }

    /**
     * This function gets invoked when the component is about to be unmounted
     */
    public componentWillUnmount() {
        responseStore.instance.removeListener(responseStore.ResponseStore.RESET_ATYPICAL_SEARCH_FIELD, this.resetAtypicalSearchField);
        responseStore.instance.removeListener(responseStore.ResponseStore.ATYPICAL_SEARCH_RESULT_EVENT, this.resetAtypicalSearchField);
        responseStore.instance.removeListener(responseStore.ResponseStore.RESPONSE_ALLOCATED_EVENT, this.onResponseAllocated);
    }

    /**
     * Triggered to reset the center and candidate search field.
     */
    private resetAtypicalSearchField = (result?: atypicalResponseSearchResult): void => {
        if (!result || result.searchResultCode === enums.SearchResultCode.MarkerNotApproved ||
            result.searchResultCode === enums.SearchResultCode.MarkerSuspended) {
            this.refs.atyCenterName.value = '';
            this.refs.atyCandidateName.value = '';
            this.setState({
                isCenterValueSet: false,
                isCandidateValueSet: false
            });
        }
    }

    /**
     * Triggered to reset the center and candidate search field if marker got suspended on atypical response allocation.
     */
    private onResponseAllocated = (responseAllocationErrorCode: enums.ResponseAllocationErrorCode): void => {
        if (responseAllocationErrorCode !== enums.ResponseAllocationErrorCode.suspendedMarker) {
            this.resetAtypicalSearchField();
        }
    }

    /**
     * This method will call on Atypical Center number onChange event
     */
    private onAtypicalCenterChange = (event: any) => {
        let a: string = event.target.value;
        if (a.trim().length > 0) {
            this.centerNumber = a.trim();
            this.setState({
                isCenterValueSet: true,
                isCandidateValueSet: this.state.isCandidateValueSet
            });
        } else {
            this.setState({
                isCenterValueSet: false,
                isCandidateValueSet: this.state.isCandidateValueSet
            });
        }
    };

    /**
     * This method will call on Atypical Candidate number onChange event
     */
    private onAtypicalCandiadateChange = (event: any) => {
        let a: string = event.target.value;
        if (a.trim().length > 0) {
            this.candidateNumber = a.trim();
            this.setState({
                isCenterValueSet: this.state.isCenterValueSet,
                isCandidateValueSet: true
            });
        } else {
            this.setState({
                isCenterValueSet: this.state.isCenterValueSet,
                isCandidateValueSet: false
            });
        }
    };

    /**
     * Method which handles the click event of Atypical response search button.
     */
    private onAtypicalSearchButtonClick() {
        if (!applicationactioncreator.checkActionInterrupted()) {
            return;
        }
            if (this.state.isCenterValueSet && this.state.isCandidateValueSet) {
                // set the sarch parameter
                let searchAtypicalResponseArgument: SearchAtypicalResponseArgument = {
                    candidateNumber: this.candidateNumber,
                    centreNumber: this.centerNumber,
                    examinerRoleId: qigStore.instance.selectedQIGForMarkerOperation.examinerRoleId,
                    markSchemeGroupId: qigStore.instance.selectedQIGForMarkerOperation.markSchemeGroupId
                };
                responseactioncreator.searchAtypicalResponse(searchAtypicalResponseArgument);
        }
    }
}
export = AtypicalSearchBar;