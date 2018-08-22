"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var React = require('react');
var pureRenderComponent = require('../base/purerendercomponent');
var marksandannotationsvisibilityinfo = require('../utility/annotation/marksandannotationsvisibilityinfo');
var localeStore = require('../../stores/locale/localestore');
var stringHelper = require('../../utility/generic/stringhelper');
var markSchemeHelper = require('../../utility/markscheme/markschemehelper');
var constants = require('../utility/constants');
var ToggleButton = require('../utility/togglebutton');
var markingStore = require('../../stores/marking/markingstore');
var markingActionCreator = require('../../actions/marking/markingactioncreator');
var marksAndAnnotationsVisibilityHelper = require('../../components/utility/marking/marksandannotationsvisibilityhelper');
var enhancedOffpageCommentStore = require('../../stores/enhancedoffpagecomments/enhancedoffpagecommentstore');
var markerOperationModeFactory = require('../utility/markeroperationmode/markeroperationmodefactory');
var enhancedOffPageCommentActionCreator = require('../../actions/enhancedoffpagecomments/enhancedoffpagecommentactioncreator');
/* tslint:disable:no-empty-interfaces */
/**
 * componenet for showing the markscheme panel dropdown items
 * @param props
 */
var MarkschemepanelHeaderDropdownItem = (function (_super) {
    __extends(MarkschemepanelHeaderDropdownItem, _super);
    /**
     * Constructor
     * @param props
     */
    function MarkschemepanelHeaderDropdownItem(props, state) {
        var _this = this;
        _super.call(this, props, state);
        /**
         * Clicking dropdown item.
         */
        this.onDropdownItemClick = function () {
            var index = _this.props.index;
            if (index > 0) {
                var marksAndAnnotationVisibilityDetails = markingStore.instance.getMarksAndAnnotationVisibilityDetails;
                var currentVisibilityInfo = marksAndAnnotationsVisibilityHelper.
                    getMarksAndAnnotationVisibilityInfo(marksAndAnnotationVisibilityDetails, markingStore.instance.currentMarkGroupId).get(index);
                var visibilityInfo = new marksandannotationsvisibilityinfo();
                visibilityInfo.markGroupId = currentVisibilityInfo.markGroupId;
                visibilityInfo.isMarkVisible = !_this.props.isCheckboxSelected;
                visibilityInfo.isAnnotationVisible = !_this.props.isCheckboxSelected;
                visibilityInfo.isEnhancedOffpageCommentVisible = currentVisibilityInfo.isEnhancedOffpageCommentVisible;
                var selectedCommentIndex = enhancedOffpageCommentStore.instance.currentEnhancedOffpageCommentIndex;
                var isEnchancedOffpageCommentVisible = markerOperationModeFactory.operationMode.isEnhancedOffPageCommentVisible;
                //update default markscheme panel width
                markSchemeHelper.updateDefaultMarkSchemePanelWidth(visibilityInfo.isMarkVisible);
                markingActionCreator.updateMarksAndAnnotationVisibility(index, visibilityInfo, isEnchancedOffpageCommentVisible, selectedCommentIndex);
            }
        };
        /**
         * Clicking toggle button
         */
        this.onToggleButtonClick = function (index, isChecked) {
            var marksAndAnnotationVisibilityDetails = markingStore.instance.getMarksAndAnnotationVisibilityDetails;
            var currentVisibilityInfo = marksAndAnnotationsVisibilityHelper.
                getMarksAndAnnotationVisibilityInfo(marksAndAnnotationVisibilityDetails, markingStore.instance.currentMarkGroupId).get(index);
            var visibilityInfo = new marksandannotationsvisibilityinfo();
            visibilityInfo.markGroupId = currentVisibilityInfo.markGroupId;
            visibilityInfo.isMarkVisible = currentVisibilityInfo.isMarkVisible;
            visibilityInfo.isAnnotationVisible = isChecked;
            visibilityInfo.isEnhancedOffpageCommentVisible = currentVisibilityInfo.isEnhancedOffpageCommentVisible;
            var selectedCommentIndex = enhancedOffpageCommentStore.instance.currentEnhancedOffpageCommentIndex;
            // enhancedoffpageCommentVisiblity set as false to avoid rendering comments on toggle change
            markingActionCreator.updateMarksAndAnnotationVisibility(index, visibilityInfo, false, selectedCommentIndex);
        };
        /**
         * on Radio button click
         */
        this.onCheckedChange = function (event) {
            // If the comment is not edited then we can switch the comments otherwise we need to show discard popup
            if (enhancedOffpageCommentStore.instance.isEnhancedOffPageCommentEdited === false) {
                _this.switchComments();
            }
            else {
                // This will display discard popup
                enhancedOffPageCommentActionCreator.switchEnhancedOffPageComments(true);
            }
        };
        /**
         * switch comments while clicking on radio button
         * @private
         * @memberof MarkschemepanelHeaderDropdownItem
         */
        this.switchComments = function () {
            var marksAndAnnotationVisibilityDetails = markingStore.instance.getMarksAndAnnotationVisibilityDetails;
            var currentVisibilityInfo = marksAndAnnotationsVisibilityHelper.
                getMarksAndAnnotationVisibilityInfo(marksAndAnnotationVisibilityDetails, markingStore.instance.currentMarkGroupId).get(_this.props.index);
            var visibilityInfo = new marksandannotationsvisibilityinfo();
            visibilityInfo.markGroupId = currentVisibilityInfo.markGroupId;
            visibilityInfo.isMarkVisible = currentVisibilityInfo.isMarkVisible;
            visibilityInfo.isAnnotationVisible = currentVisibilityInfo.isAnnotationVisible;
            visibilityInfo.isEnhancedOffpageCommentVisible = !_this.props.isCommentButtonSelected;
            markingActionCreator.updateEnhancedOffpageCommentData(_this.props.index, markingStore.instance.currentMarkGroupId, _this.props.style, _this.props.remarkHeaderText);
            var isEnchancedOffpageCommentVisible = markerOperationModeFactory.operationMode.isEnhancedOffPageCommentVisible;
            var selectedCommentIndex = enhancedOffpageCommentStore.instance.currentEnhancedOffpageCommentIndex;
            markingActionCreator.updateMarksAndAnnotationVisibility(_this.props.index, visibilityInfo, isEnchancedOffpageCommentVisible, selectedCommentIndex);
        };
    }
    /**
     * Render method
     */
    MarkschemepanelHeaderDropdownItem.prototype.render = function () {
        var _this = this;
        return (React.createElement("li", {className: 'remark-menu-item'}, this.props.showCheckBox ? React.createElement("input", {type: 'checkbox', id: this.props.id, key: this.props.id, readOnly: true, className: 'checkbox show-remark', checked: this.props.isCheckboxSelected, "aria-label": this.getTitleText(), "data-value": this.props.isCheckboxSelected}) : '', React.createElement("label", {className: 'remark-label', id: 'remark-label', title: this.getTitleText(), onClick: function () { _this.onDropdownItemClick(); }}, this.props.label), this.props.hideAnnotationToggleButton ? null :
            React.createElement(ToggleButton, {title: this.getToggleButtonTitle(), id: this.props.id, key: this.props.id + '-toggle', selectedLanguage: this.props.selectedLanguage, isChecked: this.props.isToggleButtonSelected, index: this.props.index, onChange: this.onToggleButtonClick, style: this.props.style, onText: localeStore.instance.TranslateText('generic.toggle-button-states.on'), offText: localeStore.instance.TranslateText('generic.toggle-button-states.off')}), this.renderRadioButtons()));
    };
    /**
     * ComponentDidMount life cycle method
     * @memberof MarkschemepanelHeaderDropdownItem
     */
    MarkschemepanelHeaderDropdownItem.prototype.componentDidMount = function () {
        if (markerOperationModeFactory.operationMode.isEnhancedOffPageCommentVisible) {
            enhancedOffpageCommentStore.instance.addListener(enhancedOffpageCommentStore.EnhancedOffPageCommentStore.SWITCH_ENHANCED_OFFPAGE_COMMENTS, this.switchComments);
        }
    };
    /**
     * ComponentWillUnmount life cycle method
     *
     * @memberof MarkschemepanelHeaderDropdownItem
     */
    MarkschemepanelHeaderDropdownItem.prototype.componentWillUnmount = function () {
        if (markerOperationModeFactory.operationMode.isEnhancedOffPageCommentVisible) {
            enhancedOffpageCommentStore.instance.removeListener(enhancedOffpageCommentStore.EnhancedOffPageCommentStore.SWITCH_ENHANCED_OFFPAGE_COMMENTS, this.switchComments);
        }
    };
    /**
     * Gets the title text
     */
    MarkschemepanelHeaderDropdownItem.prototype.getTitleText = function () {
        if (this.props.index > 0) {
            var toolTipText = this.props.isDefinitive ? 'definitive-marks' : 'previous-marks';
            return this.props.isCheckboxSelected ? stringHelper.format(localeStore.instance.TranslateText('marking.response.previous-marks.' + toolTipText + '-checkbox-tooltip-hide'), [constants.NONBREAKING_HYPHEN_UNICODE]) :
                stringHelper.format(localeStore.instance.TranslateText('marking.response.previous-marks.' + toolTipText + '-checkbox-tooltip-show'), [constants.NONBREAKING_HYPHEN_UNICODE]);
        }
    };
    /**
     * Get the toggle button title
     */
    MarkschemepanelHeaderDropdownItem.prototype.getToggleButtonTitle = function () {
        if (this.props.index === 0) {
            return this.props.isToggleButtonSelected ?
                stringHelper.format(localeStore.instance.TranslateText('marking.response.mark-scheme-panel.annotations-switch-tooltip-hide'), [constants.NONBREAKING_HYPHEN_UNICODE]) :
                stringHelper.format(localeStore.instance.TranslateText('marking.response.mark-scheme-panel.annotations-switch-tooltip-show'), [constants.NONBREAKING_HYPHEN_UNICODE]);
        }
        else {
            var toolTipText = this.props.isDefinitive ? 'definitive-annotations' : 'previous-annotations';
            return this.props.isToggleButtonSelected ?
                stringHelper.format(localeStore.instance.TranslateText('marking.response.previous-marks.' + toolTipText + '-switch-tooltip-hide'), [constants.NONBREAKING_HYPHEN_UNICODE]) :
                stringHelper.format(localeStore.instance.TranslateText('marking.response.previous-marks.' + toolTipText + '-switch-tooltip-show'), [constants.NONBREAKING_HYPHEN_UNICODE]);
        }
    };
    /**
     * Method to render Radio buttons.
     *
     * @private
     * @returns
     * @memberof MarkschemepanelHeaderDropdownItem
     */
    MarkschemepanelHeaderDropdownItem.prototype.renderRadioButtons = function () {
        if (markerOperationModeFactory.operationMode.isEnhancedOffPageCommentVisible) {
            var commentIndex = this.props.index;
            return (React.createElement("div", {className: 'comments-radio'}, React.createElement("input", {type: 'radio', value: 'selected', id: (commentIndex).toString() + '_Comment', name: 'shoComments', checked: this.props.isCommentButtonSelected ? true : false, onChange: this.onCheckedChange.bind(this)}), React.createElement("label", {htmlFor: (commentIndex).toString() + '_Comment', title: this.toolTipForRadioButton}, React.createElement("span", {className: 'radio-ui'}), React.createElement("span", {className: 'label-text'}, 'Comment'))));
        }
        else {
            return null;
        }
    };
    Object.defineProperty(MarkschemepanelHeaderDropdownItem.prototype, "toolTipForRadioButton", {
        /**
         * This will return the localised tooltip for comments radio button
         * @readonly
         * @private
         * @memberof MarkschemepanelHeaderDropdownItem
         */
        get: function () {
            return this.props.index === 0 ? localeStore.instance.TranslateText('marking.response.previous-marks.current-comments-radio-button-tooltip') :
                this.props.isDefinitive ? localeStore.instance.TranslateText('marking.response.previous-marks.definitive-comments-radio-button-tooltip')
                    : localeStore.instance.TranslateText('marking.response.previous-marks.previous-comments-radio-button-tooltip');
        },
        enumerable: true,
        configurable: true
    });
    return MarkschemepanelHeaderDropdownItem;
}(pureRenderComponent));
module.exports = MarkschemepanelHeaderDropdownItem;
//# sourceMappingURL=markschemepanelheaderdropdownitem.js.map