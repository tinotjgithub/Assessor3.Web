"use strict";
var React = require('react');
var enums = require('../../utility/enums');
var localeStore = require('../../../stores/locale/localestore');
var SortArrow = require('../../utility/table/sortarrow');
/* tslint:disable:variable-name */
var ColumnHeader = function (props) {
    if (props.isSortingRequired) {
        return (React.createElement("a", {className: getSortClassName(), href: 'javascript:void(0)', title: getTitleText()}, React.createElement("div", {className: 'frozen-header'}, React.createElement("span", {className: 'sort-head-text', id: 'col_' + props.headerText.replace(/ /g, '')}, props.headerText), React.createElement(SortArrow, {sortOption: props.sortOption}))));
    }
    else {
        return (React.createElement("div", {className: 'frozen-header'}, React.createElement("span", {className: 'sort-head-text', id: 'col_' + props.headerText.replace(/ /g, '')}, props.headerText)));
    }
    /**
     * This method will return the sort className
     */
    function getSortClassName() {
        if (!props.isSortingRequired) {
            return '';
        }
        if (props.isCurrentSort) {
            if (props.sortOption === undefined || props.sortOption === enums.SortOption.Both) {
                return (props.sortDirection === enums.SortDirection.Descending) ?
                    'sortable-link desc' : 'sortable-link asc';
            }
            else if (props.sortOption === enums.SortOption.Up) {
                return ('sortable-link asc');
            }
            else {
                return ('sortable-link desc');
            }
        }
        else {
            return 'sortable-link';
        }
    }
    /**
     * Gets Title text.
     */
    function getTitleText() {
        if (props.headerText && props.headerText !== '') {
            return localeStore.instance.TranslateText('marking.worklist.list-view-column-headers.sort-by-tooltip') + ' ' + props.headerText;
        }
    }
};
module.exports = ColumnHeader;
//# sourceMappingURL=columnheader.js.map