"use strict";
var React = require('react');
var enums = require('../utility/enums');
var localeStore = require('../../stores/locale/localestore');
var ccValues = require('../../utility/configurablecharacteristic/configurablecharacteristicsvalues');
/* tslint:disable:variable-name */
var FilterItem = function (props) {
    if (props.isVisible) {
        return (React.createElement("li", {id: 'filter' + enums.getEnumString(enums.WorklistSeedFilter, props.filter), className: props.selectedFilter === props.filter ? 'selected' : ''}, React.createElement("input", {type: 'radio', id: props.id, name: props.name, value: props.selectedFilter === props.filter ? 'selected' : '', checked: props.selectedFilter === props.filter ? true : false}), React.createElement("label", {htmlFor: props.id, onClick: function () { props.onFilterChanged(props.filter); }}, React.createElement("span", {className: 'radio-ui'}), React.createElement("span", {className: 'label-text'}, props.label))));
    }
    else {
        return null;
    }
};
/**
 * Stateless component for Worklist filter
 * @param props
 */
var WorklistFilter = function (props) {
    if (props.isVisible) {
        return (React.createElement("div", {className: 'col-wrap grid-nav padding-bottom-15'}, React.createElement("ul", {className: 'worklist-radio-filter'}, React.createElement("li", {className: 'filter-by-title'}, React.createElement("span", null, localeStore.instance.TranslateText('team-management.examiner-worklist.filters.filter-by'), " ")), React.createElement(FilterItem, {id: 'fltrAll', key: 'key-fltrAll', name: 'filterSeeds', isVisible: true, onFilterChanged: props.onFilterChanged, label: localeStore.instance.TranslateText('team-management.examiner-worklist.filters.all-responses'), filter: enums.WorklistSeedFilter.All, selectedFilter: props.selectedFilter}), React.createElement(FilterItem, {id: 'fltrSeeds', key: 'key-fltrSeeds', name: 'filterSeeds', isVisible: true, onFilterChanged: props.onFilterChanged, label: localeStore.instance.TranslateText('team-management.examiner-worklist.filters.seeds-only'), filter: enums.WorklistSeedFilter.SeedsOnly, selectedFilter: props.selectedFilter}), React.createElement(FilterItem, {id: 'fltrUnrevdSeeds', key: 'key-fltrUnrevdSeeds', name: 'filterSeeds', isVisible: !ccValues.seniorExaminerPool(props.markSchemeGroupId), onFilterChanged: props.onFilterChanged, label: localeStore.instance.TranslateText('team-management.examiner-worklist.filters.unreviewed-seeds-only'), filter: enums.WorklistSeedFilter.UnreviewedSeedsOnly, selectedFilter: props.selectedFilter}))));
    }
    else {
        return null;
    }
};
module.exports = WorklistFilter;
/* tslint:enable */
//# sourceMappingURL=worklistfilter.js.map