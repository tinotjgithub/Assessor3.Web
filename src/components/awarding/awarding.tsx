import React = require('react');
import Immutable = require('immutable');
import pureRenderComponent = require('../base/purerendercomponent');
import enums = require('../utility/enums');
import localeStore = require('../../stores/locale/localestore');
import BusyIndicator = require('../utility/busyindicator/busyindicator');
import awardingStore = require('../../stores/awarding/awardingstore');
import ccStore = require('../../stores/configurablecharacteristics/configurablecharacteristicsstore');
import scriptStore = require('../../stores/script/scriptstore');
import awardingActionCreator = require('../../actions/awarding/awardingactioncreator');
import domManager = require('../../utility/generic/domhelper');
import AwardingGridToggleButton = require('./awardinggridtogglebutton');
import AwardingCandidateDetailsView = require('./awardingcandidatedetailsview');
let classNames = require('classnames');
import awardingHelper = require('../utility/awarding/awardinghelper');
import markSchemeStructureActionCreator = require('../../actions/markschemestructure/markschemestructureactioncreator');
import ccActionCreator = require('../../actions/configurablecharacteristics/configurablecharacteristicsactioncreator');
import configurableCharacteristicsHelper = require('../../utility/configurablecharacteristic/configurablecharacteristicshelper');
import configurableCharacteristicsNames = require('../../utility/configurablecharacteristic/configurablecharacteristicsnames');
import scriptActionCreator = require('../../actions/script/scriptactioncreator');
import imagezoneActionCreator = require('../../actions/imagezones/imagezoneactioncreator');
import candidateScriptInfo = require('../../dataservices/script/typings/candidatescriptinfo');
import AwardingLoadingIndicator = require('../utility/loadingindicator/loadingindicator');
import stringFormatHelper = require('../../utility/stringformat/stringformathelper');

/**
 * State of Awarding Container component
 */
interface State {
    renderedOn?: number;
    isBusy?: boolean;
    isSessionDropdownOpen?: boolean;
    isGradeDropdownOpen?: boolean;
    isTotalMarkDropdownOpen?: boolean;
    selectedsessionId?: number;
    selectedgrade?: string;
    selectedMark?: string;
    groupByGrade: boolean;
}

/**
 * Properties of a component
 */
interface Props extends LocaleSelectionBase, PropsBase {
    toggleLeftPanel: Function;
}

/**
 * React component for Awarding container
 */
class Awarding extends pureRenderComponent<Props, State> {

    private loading: JSX.Element;
    private busyIndicatorInvoker: enums.BusyIndicatorInvoker = enums.BusyIndicatorInvoker.none;
    private showBackgroundScreenOnBusy: boolean = false;
    private _viaUserOption: boolean = false;

    /**
     * @constructor
     */
    constructor(props: Props, state: State) {
        super(props, state);
        let _groupByGrade: string = awardingHelper.getUserOptionData(enums.AwardingFilters.GroupByGrade);
        this.state = {
            isBusy: false,
            isSessionDropdownOpen: false,
            isGradeDropdownOpen: false,
            isTotalMarkDropdownOpen: false,
            selectedsessionId: 0,
            selectedgrade: localeStore.instance.TranslateText('awarding.right-panel.all'),
            selectedMark: localeStore.instance.TranslateText('awarding.right-panel.all'),
            groupByGrade: _groupByGrade !== '' ?
                (_groupByGrade === 'true' ? true : false) : true,
            renderedOn: Date.now()
        };
        this.toggleLeftPanel = this.toggleLeftPanel.bind(this);
        this.setBusyIndicatorProperties(enums.BusyIndicatorInvoker.none, false);
        this.switchGrid = this.switchGrid.bind(this);
    }

    /**
     * to hide the awarding dropdowns while clicking outside.
     */
    private hideAwardingDropdowns = (event: any): void => {
        if (event.target !== undefined &&
            domManager.searchParentNode(event.target, function (el: any) {
                return (el.id === 'awd-grade-dropdown'
                    || el.id === 'awd-session-dropdown' || el.id === 'awd-total-dropdown');
            }) == null) {
            if (this.state.isGradeDropdownOpen === true || this.state.isSessionDropdownOpen === true ||
                this.state.isTotalMarkDropdownOpen === true) {
                this.setState({
                    isTotalMarkDropdownOpen: false,
                    isGradeDropdownOpen: false,
                    isSessionDropdownOpen: false
                });
            }
        }
    };

    /**
     * Render method
     */
    public render() {

        let busyIndicator: JSX.Element = (<BusyIndicator id={'awarding_' + this.busyIndicatorInvoker.toString()}
            isBusy={this.state.isBusy}
            key={'response_' + this.busyIndicatorInvoker.toString()}
            isMarkingBusy={true}
            busyIndicatorInvoker={this.busyIndicatorInvoker}
            doShowDialog={true}
            showBackgroundScreen={this.showBackgroundScreenOnBusy} />);

        return (
            <div className='column-right'>
                <a href='javascript:void(0);' className='toggle-left-panel' id='side-panel-toggle-button'
                    title={localeStore.instance.TranslateText('awarding.left-panel.show-hide-tooltip')}
                    onClick={this.toggleLeftPanel}>
                    <span className='sprite-icon panel-toggle-icon'>panel toggle</span>
                </a>
                {this.loadAwardingRightPanel()}
                {busyIndicator}
            </div>);
    }

    /**
     * componentDidMount React lifecycle event
     */
    public componentDidMount() {
        window.addEventListener('touchend', this.hideAwardingDropdowns);
        window.addEventListener('click', this.hideAwardingDropdowns);
        awardingStore.instance.addListener(awardingStore.AwardingStore.AWARDING_COMPONENT_SELECTED,
            this.retriveAwardingCandidateDetails);
        awardingStore.instance.addListener(awardingStore.AwardingStore.AWARDING_CANDIDATE_DATA_RETRIEVED, this.resetCandidateData);
        ccStore.instance.addListener(
            ccStore.ConfigurableCharacteristicsStore.EXAM_BODY_CC_GET,
            this.reRender);
        scriptStore.instance.addListener(
            scriptStore.ScriptStore.CANDIDATE_RESPONSE_METADATA_RETRIEVAL_EVENT,
            this.hideBusyIndicator
        );
    }

    /**
     * componentWillUnmount React lifecycle event
     */
    public componentWillUnmount() {
        window.removeEventListener('touchend', this.hideAwardingDropdowns);
        window.removeEventListener('click', this.hideAwardingDropdowns);
        awardingStore.instance.removeListener(awardingStore.AwardingStore.AWARDING_COMPONENT_SELECTED,
            this.retriveAwardingCandidateDetails);
        awardingStore.instance.removeListener(awardingStore.AwardingStore.AWARDING_CANDIDATE_DATA_RETRIEVED, this.resetCandidateData);
        ccStore.instance.removeListener(
            ccStore.ConfigurableCharacteristicsStore.EXAM_BODY_CC_GET,
            this.reRender);
        scriptStore.instance.addListener(
            scriptStore.ScriptStore.CANDIDATE_RESPONSE_METADATA_RETRIEVAL_EVENT,
            this.hideBusyIndicator
        );
    }

    /**
     * To rerender
     */
    private reRender = () => {
        this.setState({
            renderedOn: Date.now()
        });
    }

    /**
     * this will hide busy indicator after target details load.
     */
    private hideBusyIndicator = (): void => {
        this.setState({
            isBusy: false
        });
    };

    /**
     * setAwardingComponentsSelectin
     */
    private resetCandidateData = () => {
        let _grade = awardingHelper.getUserOptionData(enums.AwardingFilters.Grade);
        let _totalMark = awardingHelper.getUserOptionData(enums.AwardingFilters.TotalMark);
        ccActionCreator.getMarkSchemeGroupCCs(awardingStore.instance.selectedSession.markSchemeGroupId,
            awardingStore.instance.selectedSession.questionPaperID);
        //fetch candidate data
        let candidateScriptDataForAwarding = awardingHelper.constructCandidateScriptInfo(
            awardingStore.instance.selectedSession.examSessionId);

        let suppressPagesInAwarding: boolean = configurableCharacteristicsHelper.getCharacteristicValue(
            configurableCharacteristicsNames.SuppressPagesInAwarding).toLowerCase() === 'true';

        let candidateScriptMetadataPromise = scriptActionCreator.fetchCandidateScriptMetadata(
            Immutable.List<candidateScriptInfo>(candidateScriptDataForAwarding),
            awardingStore.instance.selectedSession.questionPaperID,
            awardingStore.instance.selectedSession.markSchemeGroupId,
            true,
            false,
            false,
            false,
            false,
            enums.StandardisationSetup.SelectResponse,
            true,
            suppressPagesInAwarding,
            true
        );
        this.setState({
            renderedOn: Date.now(),
            selectedgrade: _grade !== '' && this._viaUserOption ?
                _grade : localeStore.instance.TranslateText('awarding.right-panel.all'),
            selectedMark: _totalMark !== '' && this._viaUserOption ?
                _totalMark : localeStore.instance.TranslateText('awarding.right-panel.all'),
            isBusy: true
        });
    };

    /**
     * To retrieve candidate details for the selected exam session
     */
    private retriveAwardingCandidateDetails = (viaUserOption: boolean) => {
        let _sessionList = awardingStore.instance.sessionList;
        let _sessionId = awardingHelper.getUserOptionData(enums.AwardingFilters.ExamSessionId);
        this._viaUserOption = viaUserOption;

        // Check the user option boolean
        let _examSessionId = _sessionId !== '' && viaUserOption ? parseInt(_sessionId)
            : awardingStore.instance.selectedSession.examSessionId;

        awardingActionCreator.getAwardingCandidateDetails(_examSessionId);

        awardingActionCreator.getAwardingJudgementStatus(awardingStore.instance.selectedSession.examSessionId);

        if (viaUserOption === false) {
            awardingHelper.saveAwardingFilters(awardingStore.instance.selectedComponentId,
                awardingStore.instance.selectedSession.examSessionId, localeStore.instance.TranslateText('awarding.right-panel.all'),
                localeStore.instance.TranslateText('awarding.right-panel.all'), this.state.groupByGrade,
                awardingStore.instance.selectedSession.examProductId);
        }

        let markSchemePromise = markSchemeStructureActionCreator.getmarkSchemeStructureList(
            awardingStore.instance.selectedSession.markSchemeGroupId,
            0,
            false,
            true,
            _examSessionId,
            true);

        this.setState({
            selectedsessionId: _examSessionId,
            renderedOn: Date.now()
        });
    };

    /**
     *  method for update the dropdown state
     */
    private updateDropDownState = (isSessionDropdownOpen: boolean, isGradeDropDownOpen: boolean,
        isTotalMarkDropDownOpen: boolean) => {
        this.setState({
            isSessionDropdownOpen: isSessionDropdownOpen,
            isGradeDropdownOpen: isGradeDropDownOpen,
            isTotalMarkDropdownOpen: isTotalMarkDropDownOpen
        });
    }

    /**
     * method for fetching candidate data while  changing exam session
     */
    private selectSessionType(selectedSession: AwardingComponentAndSession) {
        this._viaUserOption = false;
        if (selectedSession.examSessionId === this.state.selectedsessionId) {
            this.updateDropDownState(!this.state.isSessionDropdownOpen, false, false);
            return;
        }

        // changes for fetching candidate metadata
        // Holds the candidate script Id

        let ccPromise = ccActionCreator.getMarkSchemeGroupCCs(selectedSession.markSchemeGroupId, selectedSession.questionPaperID);
        ccPromise.then(() => {
            awardingActionCreator.getAwardingCandidateDetails(selectedSession.examSessionId);
            awardingActionCreator.getAwardingJudgementStatus(awardingStore.instance.selectedSession.examSessionId);
            awardingHelper.saveAwardingFilters(selectedSession.componentId, selectedSession.examSessionId,
                localeStore.instance.TranslateText('awarding.right-panel.all'),
                localeStore.instance.TranslateText('awarding.right-panel.all'), this.state.groupByGrade,
                awardingStore.instance.selectedSession.examProductId);
        }).then(() => {
            // fetching candidate script images data after cc values are loaded
            let markSchemePromise = markSchemeStructureActionCreator.getmarkSchemeStructureList(
                selectedSession.markSchemeGroupId,
                0,
                false,
                true,
                selectedSession.examSessionId,
                true);

            this.setState({
                selectedsessionId: selectedSession.examSessionId,
                isSessionDropdownOpen: false,
                selectedgrade: 'All'
            });
        });
    }

    /**
     * method for changing candidate data while changing grade
     */
    private selectGradeType(selectedgrade: AwardingCandidateDetails) {
        let _selectedGrade: string = selectedgrade.grade ? selectedgrade.grade :
            localeStore.instance.TranslateText('awarding.right-panel.all');
        awardingHelper.saveAwardingFilters(awardingStore.instance.selectedComponentId,
            awardingStore.instance.selectedSession.examSessionId, _selectedGrade, this.state.selectedMark,
            this.state.groupByGrade, awardingStore.instance.selectedSession.examProductId);
        this.setState({
            selectedgrade: _selectedGrade,
            isGradeDropdownOpen: false,
        });
    }

    /**
     * method for changing candidate data while changing mark
     */
    private selectMarkType(selectedMark: AwardingCandidateDetails) {
        let _selectedTotalMark: string = selectedMark.totalMark ? selectedMark.totalMark.toFixed(2) :
            localeStore.instance.TranslateText('awarding.right-panel.all');
        awardingHelper.saveAwardingFilters(awardingStore.instance.selectedComponentId,
            awardingStore.instance.selectedSession.examSessionId, this.state.selectedgrade, _selectedTotalMark
            , this.state.groupByGrade, awardingStore.instance.selectedSession.examProductId);
        this.setState({
            selectedMark: _selectedTotalMark,
            isTotalMarkDropdownOpen: false,
        });
    }

    /**
     * This method will call parent component function to toggle left panel
     */
    private toggleLeftPanel() {
        this.props.toggleLeftPanel();
    }

    /**
     * This method will set the gradelist drop down
     */
    private renderGradeList(): JSX.Element {
        let gradeList: any = (awardingStore.instance.gradeList && awardingStore.instance.gradeList.map((item: any) => {
            return (<li onClick={this.selectGradeType.bind(this, item)}><a href='javascript:void(0);'>{item.grade}</a></li>);
        }));
        return (
            awardingStore.instance.gradeList &&
            <div id='awd-grade-dropdown'>
                <div className={classNames('dropdown-wrap white-dropdown',
                    'awd-grade-dropdown', this.state.isGradeDropdownOpen ? 'open' : false)}>
                    <a className='menu-button' id='awd-grade-selected'
                        onClick={() => { this.updateDropDownState(false, !this.state.isGradeDropdownOpen, false); }}>
                        <span className='markby-txt'>{this.state.selectedgrade}</span>
                        <span className='sprite-icon menu-arrow-icon'></span>
                    </a>
                    <ul className='menu' id='awd-grade-dropdown-menu'>
                        <li onClick={this.selectGradeType.bind(this)}>
                            <a href='javascript:void(0);'>
                                {localeStore.instance.TranslateText('awarding.right-panel.all')}
                            </a>
                        </li>
                        {gradeList}
                    </ul>
                </div>
            </div>);
    }

    /**
     * This method will set the sessionlist drop down
     */
    private renderSessionList(): JSX.Element {

        let selectedSession: any = awardingStore.instance.selectedSession;
        let sessionDataList: any = awardingStore.instance.sessionList;

        if (selectedSession && sessionDataList) {

            let sessionList: any = (sessionDataList.map((item: any) => {
                return (<li onClick={this.selectSessionType.bind(this, item)}><a href='javascript:void(0);'>{item.sessionName}</a></li>);
            }));



            return (
                <div id='awd-session-dropdown'>
                    <div className={classNames('dropdown-wrap white-dropdown',
                        'awd-session-dropdown', this.state.isSessionDropdownOpen ? 'open' : false)}>
                        <a className='menu-button' id='awd-session-selected'
                            onClick={() => { this.updateDropDownState(!this.state.isSessionDropdownOpen, false, false); }}>
                            <span className='markby-txt'>{selectedSession.sessionName}</span>
                            <span className='sprite-icon menu-arrow-icon'></span>
                        </a>
                        <ul className='menu' id='awd-session-dropdown-menu'>
                            {sessionList}
                        </ul>
                    </div>
                </div>);
        }
    }

    /**
     * This method will set the sample status icon
     */
    private renderSampleStatusIcon(): JSX.Element {
        let publishedStatusIcon = awardingStore.instance.selectedSession && awardingStore.instance.selectedSession.sampleStatus === 1 ?
            true : false;
        if (publishedStatusIcon) {
            return (
                <span className='success padding-left-15'>
                    <span className='sprite-icon success-small-icon'></span>
                    <span className='small-text padding-left-5'>
                        {localeStore.instance.TranslateText('awarding.right-panel.published')}
                    </span>
                </span>);
        } else {
            return (
                <span className='padding-left-15'>
                    <span className='sprite-icon gray-small-icon'></span>
                    <span className='small-text padding-left-5'>
                        {localeStore.instance.TranslateText('awarding.right-panel.archived')}
                    </span>
                </span>);
        }
    }

    /**
     * This method will set the totalmarks drop down
     */
    private renderTotalMarkList(): JSX.Element {
        let markList: any = (awardingStore.instance.markList &&
            awardingStore.instance.markList.map((item: any) => {
                return (<li onClick={this.selectMarkType.bind(this, item)}>
                    <a href='javascript:void(0);'>{item.totalMark.toFixed(2)}</a></li>);
            }));
        return (
            awardingStore.instance.markList &&
            <div id='awd-total-dropdown'>
                <div className={classNames('dropdown-wrap white-dropdown',
                    'awd-grade-dropdown', this.state.isTotalMarkDropdownOpen ? 'open' : false)}>
                    <a className='menu-button' id='awd-totalmark-selected'
                        onClick={() => { this.updateDropDownState(false, false, !this.state.isTotalMarkDropdownOpen); }}>
                        <span className='markby-txt'>{this.state.selectedMark}</span>
                        <span className='sprite-icon menu-arrow-icon'></span>
                    </a>
                    <ul className='menu' id='awd-total-dropdown-menu'>
                        <li onClick={this.selectMarkType.bind(this)}>
                            <a href='javascript:void(0);'>
                                {localeStore.instance.TranslateText('awarding.right-panel.all')}
                            </a>
                        </li>
                        {markList}
                    </ul>
                </div>
            </div>);
    }

    /**
     * Load the Awarding Right panel
     */
    private loadAwardingRightPanel = (): JSX.Element => {

        let awardingSessionHeaderText: string = awardingStore.instance.selectedSession ?
            stringFormatHelper.getFormattedAwardingComponentName(awardingStore.instance.selectedSession.assessmentCode,
                                                                 awardingStore.instance.selectedSession.componentId) : '';

        let awardingRightPanel: JSX.Element =
            (
                <div id='awardingRightPanel' className='wrapper'>
                    <div id='awarding-session-header' className='clearfix wl-page-header header-search'>
                        <h3 className='shift-left page-title padding-top-15'>
                            <span id='awarding-session-header-text' className='page-title-text'>{awardingSessionHeaderText}</span>
                        </h3>
                    </div>
                    <div className='filter-dropdown padding-bottom-10'>
                        <div>
                            <span className='menu-label'>{localeStore.instance.TranslateText('awarding.right-panel.session')}:</span>
                        </div>
                        {this.renderSessionList()}
                        <div id='awarding-panel-publish-archive'>
                            {this.renderSampleStatusIcon()}
                        </div>
                    </div>
                    <div className='message-bar' id='blue-message-bar'>
                        <span className='message-content'>
                            <div className='text-left'>
                                <p>{localeStore.instance.TranslateText('awarding.right-panel.blue-banner-text')}</p>
                            </div>
                        </span>
                    </div>
                    <div className='grid-holder grid-view'>
                        <div className='filter-dropdown padding-bottom-10'>
                            <div className='items'>
                                <span className='menu-label'>{localeStore.instance.TranslateText('awarding.right-panel.grade')} : </span>
                            </div>
                            <div className='items'>
                                {this.renderGradeList()}
                            </div>
                            <div className='items padding-left-15'>
                                <span className='menu-label'>{localeStore.instance.TranslateText('awarding.right-panel.total-mark')}:</span>
                            </div>
                            <div className='items'>
                                {this.renderTotalMarkList()}
                            </div>
                            <AwardingGridToggleButton
                                switchGridToggle={this.switchGrid}
                                groupByGrade={this.state.groupByGrade}
                            />
                        </div>
                        <div className='grid-wrapper'>
                            {this.state.isBusy &&
                                <AwardingLoadingIndicator id={enums.BusyIndicatorInvoker.none.toString()}
                                    key={enums.BusyIndicatorInvoker.none.toString()} cssClass='section-loader' />
                            }
                            {!this.state.isBusy && awardingStore.instance.awardingCandidateData &&
                                awardingStore.instance.selectedSession &&
                                <AwardingCandidateDetailsView
                                    id='id_awarding_grid'
                                    key='key-awarding_grid'
                                    viewType={this.state.groupByGrade ? enums.AwardingViewType.Grade :
                                        enums.AwardingViewType.Totalmark}
                                    renderedOn={this.state.renderedOn}
                                    selectedLanguage={this.props.selectedLanguage}
                                    selectedGrade={this.state.selectedgrade}
                                    selectedMark={this.state.selectedMark} />}
                        </div>
                    </div>
                </div>
            );
        return awardingRightPanel;
    };

	/**
	 * Method for toggle grid data
	 */
    private switchGrid() {
        awardingHelper.saveAwardingFilters(awardingStore.instance.selectedComponentId,
            awardingStore.instance.selectedSession.examSessionId,
            this.state.selectedgrade, this.state.selectedMark, !this.state.groupByGrade,
            awardingStore.instance.selectedSession.examProductId);
        this.setState({
            groupByGrade: !this.state.groupByGrade,
        });
    }

    /**
     * Method which sets the busy indicator properties
     * @param busyIndicatorInvoker
     * @param showBackgroundScreenOnBusy
     */
    private setBusyIndicatorProperties(busyIndicatorInvoker: enums.BusyIndicatorInvoker,
        showBackgroundScreenOnBusy: boolean) {
        this.busyIndicatorInvoker = busyIndicatorInvoker;
        this.showBackgroundScreenOnBusy = showBackgroundScreenOnBusy;
    }
}
export = Awarding;