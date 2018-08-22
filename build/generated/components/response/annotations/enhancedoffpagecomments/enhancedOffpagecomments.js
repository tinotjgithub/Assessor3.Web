"use strict";
var React = require('react');
var enhancedOffPageCommentHelper = require('../../../utility/enhancedoffpagecomment/enhancedoffpagecommenthelper');
var gridColumnNames = require('../../../utility/grid/gridcolumnnames');
var worklistStore = require('../../../../stores/worklist/workliststore');
var eCourseworkHelper = require('../../../utility/ecoursework/ecourseworkhelper');
var TableHeader = require('./enhancedoffpagecommenttableheader');
var classNames = require('classnames');
// tslint:disable-next-line:variable-name
var Col = function (props) {
    return (React.createElement("col", {width: props.width + '%'}));
};
// tslint:disable-next-line:variable-name
var ColGroup = function (props) {
    var col = props.headerItems.map(function (header, index) {
        var width = header.columnName === gridColumnNames.Comment ? 100 : 0;
        if (enhancedOffPageCommentHelper.getCellVisibility(header.columnName)) {
            return (React.createElement(Col, {key: 'col-group-key-' + index + 1, width: width}));
        }
        else {
            return null;
        }
    });
    return (React.createElement("colgroup", null, col));
};
// tslint:disable-next-line:variable-name
var File = function (props) {
    var eCourseWorkFile;
    if (parseInt(props.text) > 0) {
        eCourseWorkFile = enhancedOffPageCommentHelper.getECourseWorkFile(parseInt(props.text));
    }
    if (eCourseWorkFile) {
        var classnames = eCourseworkHelper.getIconStyleForSvg(eCourseWorkFile.linkType, true);
        return (React.createElement("div", {className: classNames('table-text ', { 'active': props.isItemSelected }), id: props.id}, React.createElement("div", {className: 'file-icon ' + classnames.listItemClass}, React.createElement("span", {className: 'svg-icon'}, React.createElement("svg", {className: classnames.svgClass, viewBox: classnames.viewBox}, React.createElement("use", {xmlnsXlink: 'http://www.w3.org/1999/xlink', xlinkHref: '#' + classnames.icon})))), React.createElement("div", {className: 'file-name'}, eCourseWorkFile.title)));
    }
    else {
        return (React.createElement("div", {className: 'table-text'}));
    }
};
// tslint:disable-next-line:variable-name
var Item = function (props) {
    return (React.createElement("div", {className: classNames('table-text ', { 'active': props.isItemSelected }), id: props.id}, props.text));
};
// tslint:disable-next-line:variable-name
var TableRowCoulmn = function (props) {
    var id = 'text-' + props.row + '-' + props.index;
    var child = props.gridColumn === gridColumnNames.File ?
        React.createElement(File, {id: id, text: props.text, isItemSelected: props.isItemSelected}) :
        React.createElement(Item, {id: id, text: props.text, isItemSelected: props.isItemSelected});
    if (enhancedOffPageCommentHelper.getCellVisibility(props.gridColumn)) {
        return (React.createElement("td", {className: props.className, id: 'col-' + props.row + '-' + props.index}, child));
    }
    else {
        return null;
    }
};
// tslint:disable-next-line:variable-name
var TableRowBlank = function (props) {
    var blankRows = props.headerData.map(function (header) {
        return (React.createElement(TableRowCoulmn, {key: 'blank-row-column-key-' + header.columnIndex, index: header.columnIndex, row: props.row, className: 'col col' + header.columnIndex, gridColumn: header.columnName, text: header.header}));
    });
    return (React.createElement("tr", {className: 'comment-row blank-row'}, blankRows));
};
// tslint:disable-next-line:variable-name
var TableRow = function (props) {
    var rowCount = 1;
    var tableBody;
    var isMarkSchemeSelected;
    var isFileSelected;
    var currentWorklistType = worklistStore.instance.currentWorklistType;
    tableBody = props.data.map(function (item, index) {
        rowCount = index + 1;
        isMarkSchemeSelected = item.isMarkSchemeSelected;
        isFileSelected = item.isFileSelected;
        return (React.createElement("tr", {className: 'comment-row', id: 'comment-row' + index + 1, key: 'comment-row-key-' + index + 1, onClick: function () { props.onCommentClick(item); }}, React.createElement(TableRowCoulmn, {index: enhancedOffPageCommentHelper.getColumnIndex(gridColumnNames.Item), row: index + 1, className: 'comment-col col1', gridColumn: gridColumnNames.Item, text: item.itemText, isItemSelected: isMarkSchemeSelected}), React.createElement(TableRowCoulmn, {index: enhancedOffPageCommentHelper.getColumnIndex(gridColumnNames.File), row: index + 1, className: 'comment-col col2', gridColumn: gridColumnNames.File, text: item.fileId, isItemSelected: isFileSelected}), React.createElement(TableRowCoulmn, {index: enhancedOffPageCommentHelper.getColumnIndex(gridColumnNames.Comment), row: index + 1, className: 'comment-col col3', gridColumn: gridColumnNames.Comment, text: item.comment})));
    });
    return (React.createElement("tbody", {className: 'offpage-comment-table-content', id: 'offpage-comment-table-content'}, tableBody, React.createElement(TableRowBlank, {row: rowCount, headerData: props.headerData})));
};
// tslint:disable-next-line:variable-name
var Table = function (props) {
    return (React.createElement("table", {cellPadding: '0', cellSpacing: '0', className: 'offpage-comment-table'}, React.createElement(ColGroup, {headerItems: props.headerData}), React.createElement(TableHeader, {Items: props.headerData, onSortClick: props.onSortClick, headerRefCallBack: props.headerRefCallBack}), React.createElement(TableRow, {data: props.data, headerData: props.headerData, onCommentClick: props.onCommentClick})));
};
/**
 * Enhanced off-page comments table
 * @param props
 */
// tslint:disable-next-line:variable-name
var EnhancedOffPageComments = function (props) {
    var headerStyle = {};
    headerStyle = {
        backgroundColor: props.style
    };
    return (React.createElement("div", {className: 'comment-table-container'}, props.selectedCommentIndex !== 0 ? (React.createElement("div", {className: 'comment-remark-bg', id: 'comment-remark-bg', style: headerStyle})) : null, React.createElement("div", {className: 'offpage-comment-wrapper'}, React.createElement(Table, {data: props.enhancedOffPageComments, headerData: props.tableHeaders, onSortClick: props.onSortClick, headerRefCallBack: props.headerRefCallBack, onCommentClick: props.onCommentClick}))));
};
module.exports = EnhancedOffPageComments;
//# sourceMappingURL=enhancedOffpagecomments.js.map