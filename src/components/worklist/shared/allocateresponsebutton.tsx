/* tslint:disable:no-unused-variable */
import React = require('react');
import pureRenderComponent = require('../../base/purerendercomponent');
import localeStore = require('../../../stores/locale/localestore');
import qigStore = require('../../../stores/qigselector/qigstore');
import enums = require('../../utility/enums');
import responseActionCreator = require('../../../actions/response/responseactioncreator');
import responseStore = require('../../../stores/response/responsestore');
import busyIndicatorActionCreator = require('../../../actions/busyindicator/busyindicatoractioncreator');
import domManager = require('../../../utility/generic/domhelper');
let classNames = require('classnames');
import configurableCharacteristicsHelper = require('../../../utility/configurablecharacteristic/configurablecharacteristicshelper');
import configurableCharacteristicsNames = require('../../../utility/configurablecharacteristic/configurablecharacteristicsnames');
import examinerStore = require('../../../stores/markerinformation/examinerstore');
import worklistStore = require('../../../stores/worklist/workliststore');
import simulationModeHelper = require('../../../utility/simulation/simulationmodehelper');
import Promise = require('es6-promise');
import qigSelectorActionCreator = require('../../../actions/qigselector/qigselectoractioncreator');

/**
 * Props
 * @param {Props} props
 */
interface Props extends LocaleSelectionBase, PropsBase {
    isEnabled: boolean;
    worklistType: enums.WorklistType;
    buttonMainText: string;
    buttonSubText: string;
    title: string;
    buttonSingleResponseText: string;
    buttonUpToOpenResponseLimitText: string;
    isWholeResponseButtonAvailable: boolean;
}

interface State {
    isClicked?: boolean;
    isOpen?: boolean;
    isAllocating?: boolean;
    isClickedArrowButton?: boolean;
}

/**
 * GetNewResponses class, Returns Button based on the isEnabled value
 */
class AllocateResponseButton extends pureRenderComponent<Props, State> {

    private _boundHandleOnClick: EventListenerObject = null;

    /**
     * Constructor for Allocated response button
     * @param props
     */
    constructor(props: Props) {
        super(props, null);

        this.state = {
            isClicked: false,
            isOpen: false,
            isAllocating: false,
            isClickedArrowButton: false
        };

        this._boundHandleOnClick = this.handleOnClick.bind(this);
        this.onArrowButtonClick = this.onArrowButtonClick.bind(this);
    }

    /**
     * Render component
     * @returns
     */
    public render() {
        if (this.props.isEnabled && !this.state.isClicked && !this.state.isAllocating) {
            // Added pooled remark and simulation condition since for both,
            // allocation button's arrow need not be shown for allocating multiple responses
            if (this.props.worklistType === enums.WorklistType.pooledRemark || this.props.worklistType === enums.WorklistType.simulation) {
                return (
                    <button id={this.props.id} className='primary rounded large download-rsp-btn split-btn'
                        onClick={this.onGetNewResponseButtonClick.bind(this, false, false) }>
                            <span id={this.props.id + '_mainText'} className='padding-left-5 text-middle'>{ this.props.buttonMainText }
                        </span>
                    </button>
                );
            } else {
                return (
                    <div className={ classNames('split-button-wrap dropdown-wrap',
                        {
                            ' open': this.state.isOpen && this.state.isClickedArrowButton,
                            ' close': !this.state.isOpen && this.state.isClickedArrowButton,
                            '': this.state.isClickedArrowButton
                        }) }>
                        <button id={this.props.id} className='primary rounded large download-rsp-btn split-btn'
                            onClick={this.onGetNewResponseButtonClick.bind(this, true, false) }>
                            <span id={this.props.id + '_mainText'} className='padding-left-5 text-middle'>{ this.props.buttonMainText }
                            </span>
                        </button>
                        <button id={this.props.id + '_arrow'} className='primary rounded large split-btn split-btn-arrow menu-button'
                            title={this.props.title} onClick={this.onArrowButtonClick} >
                            <span id= {this.props.id + '_headerWithArrow'} className='sprite-icon menu-arrow-m-white-icon text-middle'>
                            </span>
                        </button>
                        <ul className='menu'>
                            <li><a href='javascript:void(0)' id={this.props.id + '_single'}
                                onClick={this.onGetNewResponseButtonClick.bind(this, false, false) }>
                                { this.props.buttonSingleResponseText} </a></li>
                            <li><a href='javascript:void(0)' id={this.props.id + '_concurrent'}
                                onClick={this.onGetNewResponseButtonClick.bind(this, true, false) }>
                                { this.props.buttonUpToOpenResponseLimitText} </a></li>
                            {this.props.isWholeResponseButtonAvailable ?
                                <li><a href='javascript:void(0)' id={this.props.id + '_wholeresponse'}
                                    onClick={this.onGetNewResponseButtonClick.bind(this, false, true) }>
                                    {localeStore.instance.
                                        TranslateText('marking.worklist.action-buttons.allocate-whole-response') } </a></li> : null}
                        </ul>
                    </div>
                );
            }
        } else if (this.state.isAllocating) {
            // Added pooled remark and simulation condition since for both,
            // allocation button's arrow need not be shown for allocating multiple responses
            if (this.props.worklistType === enums.WorklistType.pooledRemark || this.props.worklistType === enums.WorklistType.simulation) {
                return (
                    <button id={this.props.id} className='primary rounded large download-rsp-btn split-btn disabled'
                        onClick={this.onGetNewResponseButtonClick.bind(this, false, false) }>
                        <span id={this.props.id + '_mainText'} className='padding-left-5 text-middle'>{ this.props.buttonMainText }
                        </span>
                    </button>
                );
            } else {
                return (
                    <div className='split-button-wrap dropdown-wrap'>
                        <button id={this.props.id} className='primary rounded large download-rsp-btn split-btn disabled'
                            title={this.props.title}>
                            <span id={this.props.id + '_mainText'}
                                className='padding-left-5 padding-right-10 text-middle'>
                                { this.props.buttonMainText }</span>
                        </button>
                        <button className='primary rounded large split-btn split-btn-arrow menu-button disabled'>
                            <span className='sprite-icon menu-arrow-icon text-middle'></span>
                        </button>
                        <ul className='menu'>
                            <li><a href='javascript:void(0)' id={this.props.id + '_single'} >
                                { this.props.buttonSingleResponseText} </a></li>
                            <li><a href='javascript:void(0)' id={this.props.id + '_concurrent'} >
                                { this.props.buttonUpToOpenResponseLimitText} </a></li>
                            {this.props.isWholeResponseButtonAvailable ?
                                <li><a href='javascript:void(0)' id={this.props.id + '_wholeresponse'} >
                                    {localeStore.instance.
                                        TranslateText('marking.worklist.action-buttons.allocate-whole-response') } </a></li> : null}
                        </ul>
                    </div >
                );
            }
        } else {
            // Added pooled remark and simulation condition since for both,
            // allocation button's arrow need not be shown for allocating multiple responses
            if (this.props.worklistType === enums.WorklistType.pooledRemark || this.props.worklistType === enums.WorklistType.simulation) {
                return (
                    <button id={this.props.id} className='primary rounded large download-rsp-btn split-btn disabled'
                        title={this.props.title}>
                        <span id={this.props.id + '_mainText'} className='padding-left-5 text-middle'>
                            { this.props.buttonMainText }</span>
                        <span id={this.props.id + '_subText'} className='awaiting-feedback-msg text-middle small-text'>
                            { this.props.buttonSubText }</span>
                    </button>
                );
            } else {
                return (
                    <div className='split-button-wrap dropdown-wrap'>
                        <button id={this.props.id}
                            className='primary rounded large download-rsp-btn split-btn disabled'
                            title={this.props.title}>
                            <span id={this.props.id + '_mainText'}
                                className='padding-left-5 text-middle'>
                                { this.props.buttonMainText }</span>
                            <span id={this.props.id + '_subText'}
                                className='awaiting-feedback-msg text-middle small-text'>
                                { this.props.buttonSubText }</span>
                        </button>
                        <button className='primary rounded large split-btn split-btn-arrow menu-button disabled'>
                            <span className='sprite-icon menu-arrow-icon text-middle'></span>
                        </button>
                        <ul className='menu'>
                            <li><a href='javascript:void(0)' id={this.props.id + '_single'} >
                                { this.props.buttonSingleResponseText} </a></li>
                            <li><a href='javascript:void(0)' id={this.props.id + '_concurrent'} >
                                { this.props.buttonUpToOpenResponseLimitText} </a></li>
                            {this.props.isWholeResponseButtonAvailable ?
                                <li><a href='javascript:void(0)' id={this.props.id + '_wholeresponse'} >
                                    {localeStore.instance.
                                        TranslateText('marking.worklist.action-buttons.allocate-whole-response') } </a></li> : null}
                        </ul>
                    </div>
                );
            }
        }
    }

    /**
     * When component mounts
     */
    public componentDidMount() {
        window.addEventListener('touchend', this._boundHandleOnClick);
        window.addEventListener('click', this._boundHandleOnClick);
        responseStore.instance.addListener(responseStore.ResponseStore.RESPONSE_ALLOCATED_EVENT, this.onResponseAllocated);
    }

    /**
     * When component unmounts
     */
    public componentWillUnmount() {
        responseStore.instance.removeListener(responseStore.ResponseStore.RESPONSE_ALLOCATED_EVENT, this.onResponseAllocated);
        window.removeEventListener('click', this._boundHandleOnClick);
        window.removeEventListener('touchend', this._boundHandleOnClick);
    }

    /**
     * Method which handles the click event of Get New Response button
     */
    private onGetNewResponseButtonClick(isConcurrentDownload: boolean, isWholeResponseDownload: boolean) {
        this.setState({
            isClicked: true,
            isAllocating: true
        });
        // Check for standardisation setup completion.
        let that = this;
        if (simulationModeHelper.shouldCheckForStandardisationSetupCompletion()) {
            let promise = qigSelectorActionCreator.checkStandardisationSetupCompleted(
                qigStore.instance.getSelectedQIGForTheLoggedInUser.markSchemeGroupId,
                enums.PageContainers.WorkList,
                enums.PageContainers.WorkList);
            Promise.Promise.all([promise]).then(function (data: any) {
                if (data[0] === false) {
                    that.continueOnGetNewResponseButtonClick(isConcurrentDownload, isWholeResponseDownload);
                }
            });
        } else {
            that.continueOnGetNewResponseButtonClick(isConcurrentDownload, isWholeResponseDownload);
        }
    }

    /**
     * Method which handles the click event of Get New Response button
     */
    private continueOnGetNewResponseButtonClick(isConcurrentDownload: boolean, isWholeResponseDownload: boolean) {
        let isCandidatePrioritisationCCON = configurableCharacteristicsHelper.getCharacteristicValue(
            configurableCharacteristicsNames.CandidatePrioritisation).toLowerCase() === 'true' ? true : false;
        let isQualityRemarkCCON = configurableCharacteristicsHelper.getCharacteristicValue(
            configurableCharacteristicsNames.QualityRemark,
            qigStore.instance.selectedQIGForMarkerOperation.markSchemeGroupId).toLowerCase()
            === 'true' ? true : false;
        responseActionCreator.allocateResponse(qigStore.instance.selectedQIGForMarkerOperation.examinerRoleId,
            qigStore.instance.selectedQIGForMarkerOperation.markSchemeGroupId,
            this.props.worklistType,
            isConcurrentDownload,
            qigStore.instance.selectedQIGForMarkerOperation.examSessionId,
            qigStore.instance.selectedQIGForMarkerOperation.role === enums.ExaminerRole.principalExaminer,
            qigStore.instance.selectedQIGForMarkerOperation.isElectronicStandardisationTeamMember,
            examinerStore.instance.getMarkerInformation.examinerId,
            isCandidatePrioritisationCCON,
            isQualityRemarkCCON,
            worklistStore.instance.getRemarkRequestType,
            isWholeResponseDownload,
            qigStore.instance.isAggregatedQigCCEnabledForCurrentQig);
        // Invoking onBusy method
        busyIndicatorActionCreator.setBusyIndicatorInvoker(enums.BusyIndicatorInvoker.responseAllocation);
    }

    /**
     * Method which handles the click event of Arrow Button
     */
    private onArrowButtonClick() {
        this.setState({
            isOpen: !this.state.isOpen,
            isClickedArrowButton: true
        });
    }

    /**
     * Method which handles the click event of window
     */
    private handleOnClick = (source: any): any => {
        /** check if the clicked element is a child of the user details list item. if not close the open window */
        if (source.target !== undefined &&
            domManager.searchParentNode(source.target, function (el: any) {
                return el.id === 'getNewResponseButton_arrow';
            }) == null) {
            if (this.state.isOpen !== undefined && this.state.isOpen === true) {
                /** Close the dropdown list */
                this.setState({
                    isOpen: false
                });
            }
        }
    };

    /**
     * Method which gets invoked once response allocation is completed
     */
    private onResponseAllocated = (responseAllocationErrorCode: enums.ResponseAllocationErrorCode): void => {

        this.setState({
            isClicked: false
        });
    };
}



export = AllocateResponseButton;