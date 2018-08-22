"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var React = require('react');
var pureRenderComponent = require('../base/purerendercomponent');
var awardingActionCreator = require('../../actions/awarding/awardingactioncreator');
var ccActionCreator = require('../../actions/configurablecharacteristics/configurablecharacteristicsactioncreator');
var awardingstore = require('../../stores/awarding/awardingstore');
var SearchPanel = require('../utility/search/searchpanel');
var localeStore = require('../../stores/locale/localestore');
var classNames = require('classnames');
var awardingHelper = require('../utility/awarding/awardinghelper');
var enums = require('../utility/enums');
/* tslint:disable:variable-name */
var ComponentItem = function (props) {
    var onClickHandler = function (event) {
        if (props.clickHandler) {
            props.clickHandler(props.examProductId, props.componentId, props.componentName, props.markSchemeGroupId, props.questionPaperId);
        }
    };
    return (React.createElement("li", {className: classNames('panel', { 'active open': props.isActive })}, React.createElement("a", {href: 'javascript:void(0)', title: props.componentName, className: 'left-menu-link panel-link', onClick: onClickHandler}, React.createElement("span", {className: 'menu-text'}, props.componentName))));
};
/* tslint:enable:variable-name */
/**
 * Awarding Collapsible panel
 * @param props
 */
var AwardingComponentsPanel = (function (_super) {
    __extends(AwardingComponentsPanel, _super);
    /**
     * @constructor
     * @param props
     * @param state
     */
    function AwardingComponentsPanel(props, state) {
        var _this = this;
        _super.call(this, props, state);
        this.searchData = { isVisible: true, isSearching: undefined, searchText: '' };
        /**
         * re-render . changing the state rendered on
         */
        this.reRenderOnComponentSelect = function () {
            _this.selectedComponentId = awardingstore.instance.selectedComponentId;
            _this.selectedexamProductId = awardingstore.instance.selectedExamProductId;
            ccActionCreator.getMarkSchemeGroupCCs(awardingstore.instance.selectedSession.markSchemeGroupId, awardingstore.instance.selectedSession.questionPaperID);
            _this.setState({
                renderedOn: Date.now()
            });
        };
        /**
         * re-render . changing the state rendered on
         */
        this.reRenderOnComponentLoad = function () {
            var _selectedComponent = awardingHelper.getUserOptionData(enums.AwardingFilters.ComponentId);
            var _examProductId = awardingHelper.getUserOptionData(enums.AwardingFilters.examProductId);
            _this.selectedComponentId = _selectedComponent !== '' ? _selectedComponent
                : awardingstore.instance.selectedComponentId;
            _this.selectedexamProductId = _examProductId.toString() !== '' ? _examProductId.toString() :
                awardingstore.instance.selectedExamProductId;
            var _componentList = awardingstore.instance.componentList;
            // checking added for selecting component using exam productID and componentID
            var _selectedComponentDetails = _componentList
                .filter(function (x) { return x.componentId === _this.selectedComponentId &&
                x.examProductId.toString() === _this.selectedexamProductId; }).first();
            var _assessmentCode = _selectedComponentDetails.assessmentCode;
            var ccPromise = ccActionCreator.getMarkSchemeGroupCCs(awardingstore.instance.selectedSession.markSchemeGroupId, awardingstore.instance.selectedSession.questionPaperID);
            ccPromise.then(function () {
                awardingActionCreator.selectAwardingComponent(_this.selectedexamProductId, _this.selectedComponentId, _assessmentCode, true);
            });
        };
        /**
         * re-render, on mouse enter
         */
        this.onMouseEnter = function () {
            _this.setState({
                hasScrollBar: true
            });
        };
        /**
         * re-render, on mouse leave
         */
        this.onMouseLeave = function () {
            _this.setState({
                hasScrollBar: false
            });
        };
        /**
         * Callback function for on_search functionality.
         */
        this.onSearch = function (searchText) {
            _this.searchData = { isVisible: true, isSearching: true, searchText: searchText };
            _this.reRenderOnComponentSelect();
        };
        /*
         * returns the element for search text box.
         */
        this.searchItemElement = function () {
            return (React.createElement("li", {className: 'search-box-wrap lite'}, React.createElement(SearchPanel, {searchWrapClass: '', isSearchResultTextVisible: false, searchResultsFor: '', searchPlaceHolder: localeStore.instance.TranslateText('awarding.left-panel.search-panel-placeholder'), searchTooltip: localeStore.instance.TranslateText('awarding.left-panel.search-panel-placeholder'), searchCancel: localeStore.instance.TranslateText('awarding.left-panel.search-close'), searchClassName: 'search-box-panel', onSearch: _this.onSearch, searchData: _this.searchData, selectedLanguage: _this.props.selectedLanguage, id: 'awarding_component_search', key: 'awarding_component_search_key'})));
        };
        /**
         * returns the component list elements - creating from the component collection in the store.
         */
        this.listElement = function () {
            var listElement = null;
            var counter = 0;
            var componentList = awardingstore.instance.componentList;
            if (componentList) {
                /* Filtering the list based on serach text (if any) */
                componentList = (_this.searchData.searchText !== '') ?
                    componentList.filter(function (x) { return x.assessmentCode.toLocaleLowerCase().
                        indexOf(_this.searchData.searchText.toLocaleLowerCase()) !== -1; }).toList() :
                    componentList;
                listElement = componentList.map(function (item) {
                    counter++;
                    return React.createElement(ComponentItem, {componentName: item.assessmentCode, examProductId: item.examProductId, componentId: item.componentId, markSchemeGroupId: item.markSchemeGroupId, questionPaperId: item.questionPaperID, id: 'componentItem' + counter.toString(), key: 'componentItem' + counter.toString(), selectedLanguage: _this.props.selectedLanguage, clickHandler: _this.onComponentClick, isActive: item.componentId === _this.selectedComponentId
                        && item.examProductId.toString() === _this.selectedexamProductId});
                });
            }
            return listElement;
        };
        /**
         * event handler for onclick of component.
         */
        this.onComponentClick = function (examProductId, componentId, assessmentCode, markSchemeGroupId, questionPaperId) {
            if (examProductId.toString() !== awardingstore.instance.selectedExamProductId) {
                var ccPromise = ccActionCreator.getMarkSchemeGroupCCs(markSchemeGroupId, questionPaperId);
                ccPromise.then(function () {
                    awardingActionCreator.selectAwardingComponent(examProductId.toString(), componentId, assessmentCode, false);
                });
            }
        };
        this.state = {
            renderedOn: 0,
            hasScrollBar: false
        };
        this.onComponentClick = this.onComponentClick.bind(this);
    }
    /**
     * Render component
     */
    AwardingComponentsPanel.prototype.render = function () {
        return (React.createElement("div", {className: classNames('column-left', { 'hovered': this.state.hasScrollBar }), onMouseEnter: this.onMouseEnter, onMouseLeave: this.onMouseLeave}, React.createElement("div", {className: 'column-left-inner'}, React.createElement("div", {className: 'left-menu-holder'}, React.createElement("ul", {className: 'left-menu panel-group', id: 'Component_List'}, this.searchItemElement(), this.listElement())))));
    };
    /**
     * Life cycle event handler for did mount
     */
    AwardingComponentsPanel.prototype.componentDidMount = function () {
        awardingstore.instance.addListener(awardingstore.AwardingStore.AWARDING_COMPONENT_DATA_RETRIEVED, this.reRenderOnComponentLoad);
        awardingstore.instance.addListener(awardingstore.AwardingStore.AWARDING_COMPONENT_SELECTED, this.reRenderOnComponentSelect);
    };
    /**
     * Life cycle event handler will un-mount
     */
    AwardingComponentsPanel.prototype.componentWillmount = function () {
        awardingstore.instance.removeListener(awardingstore.AwardingStore.AWARDING_COMPONENT_DATA_RETRIEVED, this.reRenderOnComponentLoad);
        awardingstore.instance.removeListener(awardingstore.AwardingStore.AWARDING_COMPONENT_SELECTED, this.reRenderOnComponentSelect);
    };
    return AwardingComponentsPanel;
}(pureRenderComponent));
module.exports = AwardingComponentsPanel;
//# sourceMappingURL=awardingcomponentspanel.js.map