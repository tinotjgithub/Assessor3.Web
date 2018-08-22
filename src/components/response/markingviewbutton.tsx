/* tslint:disable:no-unused-variable */
import React = require('react');
/* tslint:enable:no-unused-variable */
import pureRenderComponent = require('../base/purerendercomponent');
import localeStore = require('../../stores/locale/localestore');
import FullResponseViewOption = require('./fullresponseviewoption');
import enums = require('../utility/enums');
import markingActionCreator = require('../../actions/marking/markingactioncreator');
import worklistStore = require('../../stores/worklist/workliststore');
import FRVTogglerOption = require('./fullresponseviewtogglesoption');
import markerOperationModeFactory = require('../utility/markeroperationmode/markeroperationmodefactory');
import exceptionHelper = require('../utility/exception/exceptionhelper');
import ExceptionIcon = require('./toolbar/exceptionicon/exceptionicon');
import responseHelper = require('../utility/responsehelper/responsehelper');
import responseStore = require('../../stores/response/responsestore');
import qigStore = require('../../stores/qigselector/qigstore');
import CCconfigurableCharacteristicsHelper = require('../../utility/configurablecharacteristic/configurablecharacteristicshelper');
import configurableCharacteristicsNames = require('../../utility/configurablecharacteristic/configurablecharacteristicsnames');
import awardingStore = require('../../stores/awarding/awardingstore');
import htmlUtilities = require('../../utility/generic/htmlutilities');
import messageStore = require('../../stores/message/messagestore');

/**
 * Component props
 * @param {Props} props
 * @param {any} any
 */
interface Props extends LocaleSelectionBase, PropsBase {
    onMarkingViewButtonClick: Function;
    onChangeViewClick: Function;
    fullResponseOption: enums.FullResponeViewOption;
    showAnnotatedPagesOptionChanged: Function;
    componentType: enums.MarkingMethod;
    showAnnotatedPagesOptionSelected: boolean;
    hasUnManagedSLAO?: boolean;
    onExceptionSelected: Function;
    onCreateNewExceptionClicked: Function;
    onRejectRigClick: Function;
    showAllPagesOfScriptOptionSelected: boolean;
    showAllPagesOfScriptOptionChanged: Function;
    displayAnnotations: boolean;
    isECourseWorkResponse?: boolean;
    showUnAnnotatedAdditionalPagesOptionSelected: boolean;
    showUnAnnotatedAdditionalPagesOptionChanged: Function;
    hasUnManagedImageZone?: boolean;
}

/**
 * MarkingViewButton class
 * @param {Props} props
 * @param {any} any
 * @returns
 */
class MarkingViewButton extends pureRenderComponent<Props, any> {

    /** variables for holding functions */
    private onePageViewClick: any;
    private twoPageViewClick: any;
    private fourPageViewClick: any;

    /**
     * @constructor
     */
    constructor(props: Props, state: any) {
        super(props, state);
        this.handleClick = this.handleClick.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleShowAnnotatedPagesOptionChange = this.handleShowAnnotatedPagesOptionChange.bind(this);
        this.onePageViewClick = this.pageViewClick.bind(this, enums.FullResponeViewOption.onePage);
        this.twoPageViewClick = this.pageViewClick.bind(this, enums.FullResponeViewOption.twoPage);
        this.fourPageViewClick = this.pageViewClick.bind(this, enums.FullResponeViewOption.fourPage);
        this.handleShowUnAnnotatedAdditionalPagesOptionChange = this.handleShowUnAnnotatedAdditionalPagesOptionChange.bind(this);
    }

    /**
     * Render method
     */
    public render() {
        return (<div className='change-view-holder clearfix'>
            {this.renderResponseViewOrException()}
            <ul className='page-view-icon-holder'>
                <FullResponseViewOption id={'1_page'} key={'1_page'}
                    changeViewIconText={localeStore.instance.TranslateText('marking.full-response-view.view-one-page')}
                    changeViewTooltip={localeStore.instance.TranslateText('marking.full-response-view.view-one-page-tooltip')}
                    isActive={this.props.fullResponseOption === enums.FullResponeViewOption.onePage ? true : false}
                    changeViewIconClass={'sprite-icon page-1-icon'}
                    onChangeViewClick={this.onePageViewClick} />
                <FullResponseViewOption id={'1_page'} key={'2_page'}
                    changeViewIconText={localeStore.instance.TranslateText('marking.full-response-view.view-two-page')}
                    changeViewTooltip={localeStore.instance.TranslateText('marking.full-response-view.view-two-page-tooltip')}
                    isActive={this.props.fullResponseOption === enums.FullResponeViewOption.twoPage ? true : false}
                    changeViewIconClass={'sprite-icon page-2-icon'}
                    onChangeViewClick={this.twoPageViewClick} />
                <FullResponseViewOption id={'1_page'} key={'4_page'}
                    changeViewIconText={localeStore.instance.TranslateText('marking.full-response-view.view-four-page')}
                    changeViewTooltip={localeStore.instance.TranslateText('marking.full-response-view.view-four-page-tooltip')}
                    isActive={this.props.fullResponseOption === enums.FullResponeViewOption.fourPage ? true : false}
                    changeViewIconClass={'sprite-icon page-4-icon'}
                    onChangeViewClick={this.fourPageViewClick} />
            </ul>
            {this.props.displayAnnotations ? this.renderOnlyShowUnAnnotatedPagesOption() : null}
        </div>);
    }

    /**
     * Rendering the Only Show Unannotated Pages Option for unstructured component - and if
     * in team management then need to show the button only for Open responses
     * Rendering the Only Show AllPages Of Script Option for structured component - and if
     * in unamaged SLAO mode.
     */
    private renderOnlyShowUnAnnotatedPagesOption(): JSX.Element {
        let frvTogglerOptionSelected: boolean;
        let frvTogglerOptionChanged: Function;
        let labelOfToggleButton: string;
        let toolTipOfToggleButton: string;

        // checking whether EbookMarking cc enabled or not.
        let isEbookMarkingCCEnaled = CCconfigurableCharacteristicsHelper.getExamSessionCCValue
            (configurableCharacteristicsNames.eBookmarking, qigStore.instance.selectedQIGForMarkerOperation.examSessionId)
            .toLowerCase() === 'true';
        if (markerOperationModeFactory.operationMode.hasOnlyShowUnAnnotatedPagesOption(this.props.componentType) &&
            !isEbookMarkingCCEnaled) {
            frvTogglerOptionSelected = this.props.showAnnotatedPagesOptionSelected;
            frvTogglerOptionChanged = this.handleChange;
            labelOfToggleButton = localeStore.instance.TranslateText('marking.full-response-view.only-show-unannotated-pages');
            toolTipOfToggleButton = localeStore.instance.TranslateText('marking.full-response-view.only-show-unannotated-pages');
            return (
                this.getFRVToggleButton(frvTogglerOptionSelected, frvTogglerOptionChanged, labelOfToggleButton, toolTipOfToggleButton)
            );
        }
        // Show all pages option in SLAO management for structured components
        if ((this.props.hasUnManagedSLAO && markerOperationModeFactory.operationMode.hasShowToggleButtonOption(this.props.componentType))
            || (this.props.hasUnManagedImageZone && responseHelper.isEbookMarking)) {
            frvTogglerOptionSelected = this.props.showAllPagesOfScriptOptionSelected;
            frvTogglerOptionChanged = this.handleShowAnnotatedPagesOptionChange;
            labelOfToggleButton = localeStore.instance.TranslateText('marking.full-response-view.show-all-pages-of-script');
            toolTipOfToggleButton = localeStore.instance.TranslateText('marking.full-response-view.show-all-pages-of-script-tooltip');
            return (
                this.getFRVToggleButton(frvTogglerOptionSelected, frvTogglerOptionChanged, labelOfToggleButton, toolTipOfToggleButton)
            );
        }
        // For showing 'Only show unannotated additional pages' option for structured components
        if (!this.props.hasUnManagedSLAO && !this.props.hasUnManagedImageZone &&
            markerOperationModeFactory.operationMode.hasShowToggleButtonOption(this.props.componentType)) {
            frvTogglerOptionSelected = this.props.showUnAnnotatedAdditionalPagesOptionSelected;
            frvTogglerOptionChanged = this.handleShowUnAnnotatedAdditionalPagesOptionChange;
            labelOfToggleButton = localeStore.instance.TranslateText('marking.full-response-view.only-show-unannotated-additional-pages');
            toolTipOfToggleButton = localeStore.instance.TranslateText
                ('marking.full-response-view.only-show-unannotated-additional-pages-tooltip');
            return (
                this.getFRVToggleButton(frvTogglerOptionSelected, frvTogglerOptionChanged, labelOfToggleButton, toolTipOfToggleButton)
            );
        }
    }

    /**
     * Rendering responseview or exception button based on below conditions.
     */
    private renderResponseViewOrException(): JSX.Element {
        // It shall not be possible to raise an exception while in SLAO Management mode, if the response is in simulation worklist.
        if (((this.props.hasUnManagedSLAO && responseHelper.hasAdditionalObject)
            || (this.props.hasUnManagedImageZone && responseHelper.isEbookMarking))
            && worklistStore.instance.currentWorklistType !== enums.WorklistType.simulation
            && !markerOperationModeFactory.operationMode.isStandardisationSetupMode) {
            return (
                <ExceptionIcon id={'exception-button'} key={'exception-button'}
                    onExceptionSelected={this.props.onExceptionSelected}
                    onCreateNewExceptionClicked={this.props.onCreateNewExceptionClicked}
                    selectedLanguage={this.props.selectedLanguage}
                    canRaiseException={exceptionHelper.canRaiseException(markerOperationModeFactory.operationMode.isTeamManagementMode
                        || markerOperationModeFactory.operationMode.isAwardingMode)}
                    hasUnManagedSLAO={responseHelper.hasUnManagedSLAOInMarkingMode}
                    onRejectRigClick={this.props.onRejectRigClick}
                    hasUnManagedImageZone={this.props.hasUnManagedImageZone} />
            );
            // Return to marking button should enable when all the sloa's became managed.
        } else if (!this.props.hasUnManagedSLAO &&
            (!this.props.hasUnManagedImageZone || worklistStore.instance.getResponseMode === enums.ResponseMode.closed)) {
            return (
                <a onClick={this.handleClick} className='toggle-response-view'
                    id={this.props.id}
                    title={markerOperationModeFactory.operationMode.markingButtonTooltipText} >
                    <span className='back-arrow-icon sprite-icon' />
                    <span className='back-arrow-text'>
                        {markerOperationModeFactory.operationMode.markingButtonText}
                    </span>
                </a>);
        }
    }

    /**
     * Rendering the specified toggle button based on above conditions.
     */
    private getFRVToggleButton(frvTogglerOptionSelected: boolean, frvTogglerOptionChanged: Function,
        labelOfToggleButton: string, toolTipOfToggleButton): JSX.Element {
        return (
            <FRVTogglerOption id={'FRVTogglerOption'} key={'FRVTogglerOption'}
                frvTogglerOptionSelected={frvTogglerOptionSelected}
                frvTogglerOptionChanged={frvTogglerOptionChanged}
                labelOfToggleButton={labelOfToggleButton}
                toolTipOfToggleButton={toolTipOfToggleButton} />
        );
    }

    /**
     * For handling the un allocated option change event for unstructured components
     */
    private handleChange(evt: any): void {
        this.props.showAnnotatedPagesOptionChanged(!this.props.showAnnotatedPagesOptionSelected);
    }

    /**
     * For handling the show all pages option change event in SLAO management for structured components
     */
    private handleShowAnnotatedPagesOptionChange(evt: any): void {
        this.props.showAllPagesOfScriptOptionChanged(!this.props.showAllPagesOfScriptOptionSelected);
    }

    /**
     * For handling the unannotated additional pages option change event for structured components
     */
    private handleShowUnAnnotatedAdditionalPagesOptionChange(frvTogglerOptionSelected: any): void {
        this.props.showUnAnnotatedAdditionalPagesOptionChanged(frvTogglerOptionSelected);
    }

    /**
     * Handles the Response page view change.
     * @param {enums.fullResponeViewOption} fullResponeOption
     */
    private pageViewClick(fullResponeOption: enums.FullResponeViewOption): void {
        this.props.onChangeViewClick(fullResponeOption);
    }

    /**
     * Handles the marking button click
     */
    private handleClick(event: any): void {
        if (this.props.onMarkingViewButtonClick != null) {
            event.stopPropagation();
            /* Reset the markingProgress flag in marking store back to true only if the response mode is
             * open. This flag is used while saving marks. Save marks will not happen for closed responses
             */
            if (markerOperationModeFactory.operationMode.isSaveMarksOnMarkingViewButtonClick) {
                markingActionCreator.saveAndNavigate(enums.SaveAndNavigate.toCurrentResponse);
            }

            this.props.onMarkingViewButtonClick();
        }

        if (htmlUtilities.isIPadDevice && messageStore.instance.isMessagePanelVisible) {
            htmlUtilities.setFocusToElement('message-subject');
            htmlUtilities.blurElement('message-subject');
        }
    }
}

export = MarkingViewButton;
