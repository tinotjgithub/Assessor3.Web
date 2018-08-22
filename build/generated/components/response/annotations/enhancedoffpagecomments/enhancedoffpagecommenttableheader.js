"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var React = require('react');
var pureRenderComponent = require('../../../base/purerendercomponent');
var enums = require('../../../utility/enums');
var SortArrow = require('../../../utility/table/sortarrow');
var classNames = require('classnames');
var EnhancedOffPageCommentTableHeader = (function (_super) {
    __extends(EnhancedOffPageCommentTableHeader, _super);
    /**
     * @constructor
     */
    function EnhancedOffPageCommentTableHeader(props, state) {
        var _this = this;
        _super.call(this, props, state);
        /**
         * Render table header item
         */
        this.tableHeaderItem = function (props) {
            var sort = props.isSortable ?
                React.createElement("a", {href: 'javascript:void(0)', className: _this.getSortClassName(props), title: ''}, React.createElement("span", {className: 'sort-head-text'}, props.headerText), React.createElement(SortArrow, {sortOption: props.sortOption})) : null;
            return (React.createElement("th", {className: 'comment-col col' + props.columnIndex, id: props.id, key: props.key, ref: function (element) { _this.props.headerRefCallBack(element, props.headerText); }}, React.createElement("span", {className: 'visually-hidden'}, "visually hidden text"), React.createElement("div", {className: classNames('th-content', { 'hand': props.isSortable }), onClick: function () { _this.props.onSortClick(props.comparerName, props.sortDirection); }}, React.createElement("div", {className: 'table-text small-text ex-dim-text'}, sort))));
        };
        // Set the default states
        this.state = {
            renderedOn: 0
        };
    }
    /**
     * Render method
     */
    EnhancedOffPageCommentTableHeader.prototype.render = function () {
        var _this = this;
        var tableHeaders = this.props.Items.map(function (header) {
            var tableHeaderItemProps = {
                id: 'column_header_' + header.columnName.toLowerCase(),
                key: 'column_header_key_' + header.columnName.toLowerCase(),
                columnIndex: header.columnIndex,
                headerText: header.header, isSortable: header.isSortRequired,
                comparerName: header.comparerName, isCurrentSort: header.isCurrentSort, sortDirection: header.sortDirection,
                sortOption: header.sortOption
            };
            return (_this.tableHeaderItem(tableHeaderItemProps));
        });
        return (React.createElement("thead", {className: 'offpage-comment-table-header'}, React.createElement("tr", null, tableHeaders)));
    };
    /**
     * Returns the sort class names
     * @returns
     */
    EnhancedOffPageCommentTableHeader.prototype.getSortClassName = function (tableHeaderProps) {
        if (!tableHeaderProps.isSortable) {
            return '';
        }
        if (tableHeaderProps.isCurrentSort) {
            if (tableHeaderProps.sortOption === undefined || tableHeaderProps.sortOption === enums.SortOption.Both) {
                // if sort direction is descending then we have to display accending class, for 
                // calling sort we are sending opposite sort direction using getCurrentSort method.
                return (tableHeaderProps.sortDirection === enums.SortDirection.Descending) ?
                    'sortable-link asc' : 'sortable-link desc';
            }
            else if (tableHeaderProps.sortOption === enums.SortOption.Up) {
                return ('sortable-link asc');
            }
            else {
                return ('sortable-link desc');
            }
        }
        else {
            return 'sortable-link';
        }
    };
    return EnhancedOffPageCommentTableHeader;
}(pureRenderComponent));
module.exports = EnhancedOffPageCommentTableHeader;
//# sourceMappingURL=enhancedoffpagecommenttableheader.js.map