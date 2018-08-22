"use strict";
var React = require('react');
var classNames = require('classnames');
var bookmarkActionCreator = require('../../../../actions/bookmarks/bookmarkactioncreator');
/**
 * List Item component to display the each bookmark items
 * @param props
 */
var bookmarkItem = function (props) {
    var onBookmarkItemClicked = function (event) {
        bookmarkActionCreator.bookmarkItemSelection(props.clientToken);
    };
    return (React.createElement("li", {className: 'list-item'}, React.createElement("a", {id: props.id, className: 'bookmark-name list-item-data', href: 'javascript:void(0)', "data-token": props.clientToken, title: props.toolTip, onClick: onBookmarkItemClicked}, props.comment)));
};
module.exports = bookmarkItem;
//# sourceMappingURL=bookmarkitem.js.map