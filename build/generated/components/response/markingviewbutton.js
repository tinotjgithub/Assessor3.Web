"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
/* tslint:disable:no-unused-variable */
var React = require('react');
/* tslint:enable:no-unused-variable */
var pureRenderComponent = require('../base/purerendercomponent');
var localeStore = require('../../stores/locale/localestore');
var FullResponseViewOption = require('./fullresponseviewoption');
var enums = require('../utility/enums');
var markingActionCreator = require('../../actions/marking/markingactioncreator');
var worklistStore = require('../../stores/worklist/workliststore');
var FRVTogglerOption = require('./fullresponseviewtogglesoption');
var markerOperationModeFactory = require('../utility/markeroperationmode/markeroperationmodefactory');
var exceptionHelper = require('../utility/exception/exceptionhelper');
var ExceptionIcon = require('./toolbar/exceptionicon/exceptionicon');
var responseHelper = require('../utility/responsehelper/responsehelper');
var qigStore = require('../../stores/qigselector/qigstore');
var CCconfigurableCharacteristicsHelper = require('../../utility/configurablecharacteristic/configurablecharacteristicshelper');
var configurableCharacteristicsNames = require('../../utility/configurablecharacteristic/configurablecharacteristicsnames');
/**
 * MarkingViewButton class
 * @param {Props} props
 * @param {any} any
 * @returns
 */
var MarkingViewButton = (function (_super) {
    __extends(MarkingViewButton, _super);
    /**
     * @constructor
     */
    function MarkingViewButton(props, state) {
        _super.call(this, props, state);
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
    MarkingViewButton.prototype.render = function () {
        return (React.createElement("div", {className: 'change-view-holder clearfix'}, this.renderResponseViewOrException(), React.createElement("ul", {className: 'page-view-icon-holder'}, React.createElement(FullResponseViewOption, {id: '1_page', key: '1_page', changeViewIconText: localeStore.instance.TranslateText('marking.full-response-view.view-one-page'), changeViewTooltip: localeStore.instance.TranslateText('marking.full-response-view.view-one-page-tooltip'), isActive: this.props.fullResponseOption === enums.FullResponeViewOption.onePage ? true : false, changeViewIconClass: 'sprite-icon page-1-icon', onChangeViewClick: this.onePageViewClick}), React.createElement(FullResponseViewOption, {id: '1_page', key: '2_page', changeViewIconText: localeStore.instance.TranslateText('marking.full-response-view.view-two-page'), changeViewTooltip: localeStore.instance.TranslateText('marking.full-response-view.view-two-page-tooltip'), isActive: this.props.fullResponseOption === enums.FullResponeViewOption.twoPage ? true : false, changeViewIconClass: 'sprite-icon page-2-icon', onChangeViewClick: this.twoPageViewClick}), React.createElement(FullResponseViewOption, {id: '1_page', key: '4_page', changeViewIconText: localeStore.instance.TranslateText('marking.full-response-view.view-four-page'), changeViewTooltip: localeStore.instance.TranslateText('marking.full-response-view.view-four-page-tooltip'), isActive: this.props.fullResponseOption === enums.FullResponeViewOption.fourPage ? true : false, changeViewIconClass: 'sprite-icon page-4-icon', onChangeViewClick: this.fourPageViewClick})), this.props.displayAnnotations ? this.renderOnlyShowUnAnnotatedPagesOption() : null));
    };
    /**
     * Rendering the Only Show Unannotated Pages Option for unstructured component - and if
     * in team management then need to show the button only for Open responses
     * Rendering the Only Show AllPages Of Script Option for structured component - and if
     * in unamaged SLAO mode.
     */
    MarkingViewButton.prototype.renderOnlyShowUnAnnotatedPagesOption = function () {
        var frvTogglerOptionSelected;
        var frvTogglerOptionChanged;
        var labelOfToggleButton;
        var toolTipOfToggleButton;
        // checking whether EbookMarking cc enabled or not.
        var isEbookMarkingCCEnaled = CCconfigurableCharacteristicsHelper.getExamSessionCCValue(configurableCharacteristicsNames.eBookmarking, qigStore.instance.selectedQIGForMarkerOperation.examSessionId)
            .toLowerCase() === 'true';
        if (markerOperationModeFactory.operationMode.hasOnlyShowUnAnnotatedPagesOption(this.props.componentType) &&
            !isEbookMarkingCCEnaled) {
            frvTogglerOptionSelected = this.props.showAnnotatedPagesOptionSelected;
            frvTogglerOptionChanged = this.handleChange;
            labelOfToggleButton = localeStore.instance.TranslateText('marking.full-response-view.only-show-unannotated-pages');
            toolTipOfToggleButton = localeStore.instance.TranslateText('marking.full-response-view.only-show-unannotated-pages');
            return (this.getFRVToggleButton(frvTogglerOptionSelected, frvTogglerOptionChanged, labelOfToggleButton, toolTipOfToggleButton));
        }
        // Show all pages option in SLAO management for structured components
        if ((this.props.hasUnManagedSLAO && markerOperationModeFactory.operationMode.hasShowToggleButtonOption(this.props.componentType))
            || (this.props.hasUnManagedImageZone && responseHelper.isEbookMarking)) {
            frvTogglerOptionSelected = this.props.showAllPagesOfScriptOptionSelected;
            frvTogglerOptionChanged = this.handleShowAnnotatedPagesOptionChange;
            labelOfToggleButton = localeStore.instance.TranslateText('marking.full-response-view.show-all-pages-of-script');
            toolTipOfToggleButton = localeStore.instance.TranslateText('marking.full-response-view.show-all-pages-of-script-tooltip');
            return (this.getFRVToggleButton(frvTogglerOptionSelected, frvTogglerOptionChanged, labelOfToggleButton, toolTipOfToggleButton));
        }
        // For showing 'Only show unannotated additional pages' option for structured components
        if (!this.props.hasUnManagedSLAO && !this.props.hasUnManagedImageZone &&
            markerOperationModeFactory.operationMode.hasShowToggleButtonOption(this.props.componentType)) {
            frvTogglerOptionSelected = this.props.showUnAnnotatedAdditionalPagesOptionSelected;
            frvTogglerOptionChanged = this.handleShowUnAnnotatedAdditionalPagesOptionChange;
            labelOfToggleButton = localeStore.instance.TranslateText('marking.full-response-view.only-show-unannotated-additional-pages');
            toolTipOfToggleButton = localeStore.instance.TranslateText('marking.full-response-view.only-show-unannotated-additional-pages-tooltip');
            return (this.getFRVToggleButton(frvTogglerOptionSelected, frvTogglerOptionChanged, labelOfToggleButton, toolTipOfToggleButton));
        }
    };
    /**
     * Rendering responseview or exception button based on below conditions.
     */
    MarkingViewButton.prototype.renderResponseViewOrException = function () {
        // It shall not be possible to raise an exception while in SLAO Management mode, if the response is in simulation worklist.
        if (((this.props.hasUnManagedSLAO && responseHelper.hasAdditionalObject)
            || (this.props.hasUnManagedImageZone && responseHelper.isEbookMarking))
            && worklistStore.instance.currentWorklistType !== enums.WorklistType.simulation
            && !markerOperationModeFactory.operationMode.isStandardisationSetupMode) {
            return (React.createElement(ExceptionIcon, {id: 'exception-button', key: 'exception-button', onExceptionSelected: this.props.onExceptionSelected, onCreateNewExceptionClicked: this.props.onCreateNewExceptionClicked, selectedLanguage: this.props.selectedLanguage, canRaiseException: exceptionHelper.canRaiseException(markerOperationModeFactory.operationMode.isTeamManagementMode), hasUnManagedSLAO: responseHelper.hasUnManagedSLAOInMarkingMode, onRejectRigClick: this.props.onRejectRigClick, hasUnManagedImageZone: this.props.hasUnManagedImageZone}));
        }
        else if (!this.props.hasUnManagedSLAO &&
            (!this.props.hasUnManagedImageZone || worklistStore.instance.getResponseMode === enums.ResponseMode.closed)) {
            return (React.createElement("a", {onClick: this.handleClick, className: 'toggle-response-view', id: this.props.id, title: markerOperationModeFactory.operationMode.markingButtonTooltipText}, React.createElement("span", {className: 'back-arrow-icon sprite-icon'}), React.createElement("span", {className: 'back-arrow-text'}, markerOperationModeFactory.operationMode.markingButtonText)));
        }
    };
    /**
     * Rendering the specified toggle button based on above conditions.
     */
    MarkingViewButton.prototype.getFRVToggleButton = function (frvTogglerOptionSelected, frvTogglerOptionChanged, labelOfToggleButton, toolTipOfToggleButton) {
        return (React.createElement(FRVTogglerOption, {id: 'FRVTogglerOption', key: 'FRVTogglerOption', frvTogglerOptionSelected: frvTogglerOptionSelected, frvTogglerOptionChanged: frvTogglerOptionChanged, labelOfToggleButton: labelOfToggleButton, toolTipOfToggleButton: toolTipOfToggleButton}));
    };
    /**
     * For handling the un allocated option change event for unstructured components
     */
    MarkingViewButton.prototype.handleChange = function (evt) {
        this.props.showAnnotatedPagesOptionChanged(!this.props.showAnnotatedPagesOptionSelected);
    };
    /**
     * For handling the show all pages option change event in SLAO management for structured components
     */
    MarkingViewButton.prototype.handleShowAnnotatedPagesOptionChange = function (evt) {
        this.props.showAllPagesOfScriptOptionChanged(!this.props.showAllPagesOfScriptOptionSelected);
    };
    /**
     * For handling the unannotated additional pages option change event for structured components
     */
    MarkingViewButton.prototype.handleShowUnAnnotatedAdditionalPagesOptionChange = function (frvTogglerOptionSelected) {
        this.props.showUnAnnotatedAdditionalPagesOptionChanged(frvTogglerOptionSelected);
    };
    /**
     * Handles the Response page view change.
     * @param {enums.fullResponeViewOption} fullResponeOption
     */
    MarkingViewButton.prototype.pageViewClick = function (fullResponeOption) {
        this.props.onChangeViewClick(fullResponeOption);
    };
    /**
     * Handles the marking button click
     */
    MarkingViewButton.prototype.handleClick = function (event) {
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
    };
    return MarkingViewButton;
}(pureRenderComponent));
module.exports = MarkingViewButton;
//# sourceMappingURL=markingviewbutton.js.map