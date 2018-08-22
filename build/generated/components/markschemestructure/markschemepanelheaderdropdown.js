"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var React = require('react');
var pureRenderComponent = require('../base/purerendercomponent');
var classNames = require('classnames');
var stringHelper = require('../../utility/generic/stringhelper');
var constants = require('../utility/constants');
var localeStore = require('../../stores/locale/localestore');
var markingStore = require('../../stores/marking/markingstore');
var worklistStore = require('../../stores/worklist/workliststore');
var enums = require('../utility/enums');
var MarkschemepanelHeaderDropdownItem = require('./markschemepanelheaderdropdownitem');
var domManager = require('../../utility/generic/domhelper');
var colouredannotationshelper = require('../../utility/stamppanel/colouredannotationshelper');
var responseStore = require('../../stores/response/responsestore');
var responseHelper = require('../utility/responsehelper/responsehelper');
var marksAndAnnotationsVisibilityHelper = require('../utility/marking/marksandannotationsvisibilityhelper');
var markSchemeStructureActionCreator = require('../../actions/markschemestructure/markschemestructureactioncreator');
var markerOperationModeFactory = require('../utility/markeroperationmode/markeroperationmodefactory');
/**
 * stateless componenet for showing the markscheme panel header dropdown for remarks
 * @param props
 */
var MarkschemepanelHeaderDropdown = (function (_super) {
    __extends(MarkschemepanelHeaderDropdown, _super);
    /**
     * @Constrctor
     * @param {Props} props
     * @param {any} state
     */
    function MarkschemepanelHeaderDropdown(props, state) {
        var _this = this;
        _super.call(this, props, state);
        this._boundHandleOnClick = null;
        this.isDropdownOpen = false;
        /**
         * Returns Comments Column element.
         */
        this.renderCommentsColumn = function () {
            var isEnhancedOffpageCommentVisible = markerOperationModeFactory.operationMode.isEnhancedOffPageCommentVisible;
            return isEnhancedOffpageCommentVisible ? (React.createElement("div", {className: 'label-show-comments shift-right'}, stringHelper.format(localeStore.instance.TranslateText('marking.response.previous-marks.comments'), [constants.NONBREAKING_HYPHEN_UNICODE]), " ")) : null;
        };
        /**
         * Clicking on PreviousMarksDropdown
         */
        this.onPreviousMarksDropdownClick = function () {
            if (_this.state.isPreviousMarksDropdownOpen === undefined) {
                _this.setState({
                    isPreviousMarksDropdownOpen: true
                });
            }
            else {
                _this.setState({
                    isPreviousMarksDropdownOpen: !_this.state.isPreviousMarksDropdownOpen
                });
            }
            _this.isDropdownOpen = true;
        };
        /**
         * Method which handles the click event of window
         */
        this.handleOnClick = function (e) {
            if (e.target !== undefined &&
                domManager.searchParentNode(e.target, function (el) { return el.id === 'remark_dropdown_menu'; }) == null) {
                if (_this.state.isPreviousMarksDropdownOpen !== undefined) {
                    _this.setState({ isPreviousMarksDropdownOpen: undefined });
                }
            }
            // both touchend and click event is fired one after other, 
            // this avoid resetting store in touchend
            if (e.type !== 'touchend') {
                markSchemeStructureActionCreator.markSchemeHeaderDropDown(_this.state.isPreviousMarksDropdownOpen);
            }
        };
        /**
         * The method to rerender.
         */
        this.reRender = function () {
            _this.setState({
                renderedOn: Date.now()
            });
        };
        this.state = {
            isPreviousMarksDropdownOpen: false
        };
        this._boundHandleOnClick = this.handleOnClick.bind(this);
    }
    /**
     * Get dropdown items
     */
    MarkschemepanelHeaderDropdown.prototype.getDropdownItems = function () {
        var _this = this;
        var allMarksAndAnnotations = markingStore.instance.getAllMarksAndAnnotations();
        // If marks not downloaded yet. wait the component from rendering, It will re render after loading the marks.
        if (allMarksAndAnnotations == null) {
            return;
        }
        var marksAndAnnotationVisibilityDetails = markingStore.instance.getMarksAndAnnotationVisibilityDetails;
        var visibilityInfos = marksAndAnnotationsVisibilityHelper.getMarksAndAnnotationVisibilityInfo(marksAndAnnotationVisibilityDetails, markingStore.instance.currentMarkGroupId);
        var currentMarkGroupId = markingStore.instance.currentMarkGroupId;
        var responseMode = responseStore.instance.selectedResponseMode;
        // to ge the remark count removing the current marking
        var allMarksAndAnnotationsCount = allMarksAndAnnotations.length - 1;
        var remarkBaseColor = colouredannotationshelper.getRemarkBaseColor(enums.DynamicAnnotation.None).fill;
        var examinerMarksAgainstResponse = markingStore.instance.getExaminerMarksAgainstResponse;
        var counter = 0;
        var items = allMarksAndAnnotations.map(function (item) {
            var allMarksAndAnnotation = examinerMarksAgainstResponse[markingStore.instance.currentMarkGroupId]
                .examinerMarkGroupDetails[markingStore.instance.currentMarkGroupId]
                .allMarksAndAnnotations[counter];
            var previousRemarkBaseColor = colouredannotationshelper.getPreviousRemarkBaseColor(allMarksAndAnnotation);
            var markSchemeHeaderItems = marksAndAnnotationsVisibilityHelper.
                getMarkSchemePanelColumnHeaderAttributes(counter, item, allMarksAndAnnotationsCount, visibilityInfos, responseHelper.isClosedEurSeed, responseHelper.isClosedLiveSeed, remarkBaseColor, responseMode, responseHelper.getCurrentResponseSeedType(), markingStore.instance.currentMarkGroupId, worklistStore.instance.currentWorklistType, allMarksAndAnnotation, previousRemarkBaseColor);
            var remarkRequestTypeId = allMarksAndAnnotations[counter].remarkRequestTypeId;
            var dropdownItem = React.createElement(MarkschemepanelHeaderDropdownItem, {id: _this.props.id + '_remark_dropdown_item_' + remarkRequestTypeId + '_' + counter.toString(), key: _this.props.id + '_remark_dropdown_item_' + remarkRequestTypeId + '_' + counter.toString(), label: markSchemeHeaderItems.get('label'), showCheckBox: markSchemeHeaderItems.get('showCheckbox'), isCheckboxSelected: markSchemeHeaderItems.get('isMarksVisible'), isToggleButtonSelected: markSchemeHeaderItems.get('isAnnotationVisible'), style: markSchemeHeaderItems.get('style'), index: counter, isDefinitive: markSchemeHeaderItems.get('isDefinitive'), selectedLanguage: _this.props.selectedLanguage, isCommentButtonSelected: markSchemeHeaderItems.get('isEnhancedOffpageCommentVisible'), remarkHeaderText: markSchemeHeaderItems.get('header'), hideAnnotationToggleButton: _this.props.hideAnnotationToggleButton});
            counter++;
            return dropdownItem;
        });
        return items;
    };
    /**
     * Check to add class if dropdown open
     */
    MarkschemepanelHeaderDropdown.prototype.isOpen = function () {
        return classNames({ 'open': this.state.isPreviousMarksDropdownOpen === true && this.isDropdownOpen }, { 'close': this.state.isPreviousMarksDropdownOpen === false && this.isDropdownOpen }, { '': this.state.isPreviousMarksDropdownOpen === undefined });
    };
    /**
     * Render method
     */
    MarkschemepanelHeaderDropdown.prototype.render = function () {
        var _this = this;
        return (React.createElement("div", {id: 'remark_dropdown_menu', className: 'filter-previous-mark'}, React.createElement("div", {className: 'dropdown-wrap align-right remark-menu ' + this.isOpen()}, React.createElement("a", {href: 'javascript:void(0)', className: 'menu-button', title: localeStore.instance.TranslateText('marking.response.previous-marks.people-icon'), onClick: function () { _this.onPreviousMarksDropdownClick(); }}, React.createElement("span", {className: 'sprite-icon people-icon'}, localeStore.instance.TranslateText('marking.response.previous-marks.people-icon')), React.createElement("span", {className: 'sprite-icon menu-arrow-icon'}, localeStore.instance.TranslateText('marking.response.previous-marks.people-icon'))), React.createElement("div", {className: 'menu'}, React.createElement("div", {className: 'remark-menu-header clearfix'}, React.createElement("div", {className: 'label-display-marks shift-left'}, stringHelper.format(localeStore.instance.TranslateText('marking.response.previous-marks.display-marks-header'), [constants.NONBREAKING_HYPHEN_UNICODE])), this.props.hideAnnotationToggleButton ? null :
            React.createElement("div", {className: 'label-show-annotations shift-right'}, stringHelper.format(localeStore.instance.TranslateText('marking.response.previous-marks.display-annotations-header'), [constants.NONBREAKING_HYPHEN_UNICODE])), this.renderCommentsColumn()), React.createElement("ul", {className: 'remark-menu-content'}, this.getDropdownItems())))));
    };
    /**
     * This function gets invoked when the component is about to be mounted
     */
    MarkschemepanelHeaderDropdown.prototype.componentDidMount = function () {
        window.addEventListener('touchend', this._boundHandleOnClick);
        window.addEventListener('click', this._boundHandleOnClick);
        markingStore.instance.addListener(markingStore.MarkingStore.OPEN_RESPONSE_EVENT, this.reRender);
    };
    /**
     * This function gets invoked when the component is about to be unmounted
     */
    MarkschemepanelHeaderDropdown.prototype.componentWillUnmount = function () {
        window.removeEventListener('click', this._boundHandleOnClick);
        window.removeEventListener('touchend', this._boundHandleOnClick);
        markingStore.instance.removeListener(markingStore.MarkingStore.OPEN_RESPONSE_EVENT, this.reRender);
    };
    return MarkschemepanelHeaderDropdown;
}(pureRenderComponent));
module.exports = MarkschemepanelHeaderDropdown;
//# sourceMappingURL=markschemepanelheaderdropdown.js.map