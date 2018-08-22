"use strict";
var React = require('react');
var localeStore = require('../../../../stores/locale/localestore');
var classNames = require('classnames');
var responseStore = require('../../../../stores/response/responsestore');
var BookmarkItem = require('./bookmarkitem');
var enums = require('../../../utility/enums');
var worklistStore = require('../../../../stores/worklist/workliststore');
var markerOperationModeFactory = require('../../../utility/markeroperationmode/markeroperationmodefactory');
var bookmarkActionCreator = require('../../../../actions/bookmarks/bookmarkactioncreator');
var toolBarActionCreator = require('../../../../actions/toolbar/toolbaractioncreator');
/**
 * This component is used to Render the bookmark items inside the response screen left panel toolbar
 * Bookmarks associated with the response should pass to the component and cunstruct the new entity here.
 * @param props
 */
var bookmarkHolder = function (props) {
    var renderNewItemHeader;
    var showMenuContent;
    var idPrefix = 'bookmark-';
    var isTeamManagement = markerOperationModeFactory.operationMode.isTeamManagementMode;
    /**
     * This method will do the actions when a new bookmark is created
     */
    var onAddNewBookmarkClicked = function (event) {
        toolBarActionCreator.isBookmarkSidePanelOpen(false);
        bookmarkActionCreator.addNewBookmark();
    };
    /**
     * Go back button click
     */
    var onGoBackClick = function (event) {
        bookmarkActionCreator.goBackButtonClick();
    };
    // Set the 'Add new bookmark' header panel
    if (!isTeamManagement &&
        !worklistStore.instance.isMarkingCheckMode &&
        (responseStore.instance.selectedResponseMode === enums.ResponseMode.open ||
            responseStore.instance.selectedResponseMode === enums.ResponseMode.pending)) {
        renderNewItemHeader = (React.createElement("div", {id: 'bookmark-header', className: 'list-menu-header'}, React.createElement("a", {id: 'create-new-bookmark-item', className: 'create-new-list-item', onClick: onAddNewBookmarkClicked}, React.createElement("span", {id: 'create-new-bookmark-icon', className: 'svg-icon'}, React.createElement("svg", {viewBox: '0 0 32 32', className: 'added-bookmark-icon'}, React.createElement("use", {xlinkHref: '#add-new-book-mark'}, "#shadow-root (closed)", React.createElement("g", {id: 'add-new-book-mark'})))), React.createElement("span", {id: 'create-new-bookmark-label', className: 'new-bookmark-label'}, localeStore.instance.TranslateText('marking.response.bookmarks-panel.add-new-bookmark')))));
    }
    // Set the 'Go Back' header panel
    var goBackClassName = 'go-back-menu ' +
        (responseStore.instance.getBookmarkPreviousScrollData === undefined ? 'disabled' : '');
    var showGoBackOption = (React.createElement("a", {href: 'javascript:void(0);', className: goBackClassName, title: localeStore.instance.TranslateText('marking.response.bookmarks-panel.return-to-selected-page'), onClick: onGoBackClick}, React.createElement("span", {className: 'svg-icon'}, React.createElement("svg", {viewBox: '0 0 32 32', className: 'icon-left-arrow'}, React.createElement("use", {xlinkHref: '#icon-left-arrow-a'}, "#shadow-root (closed)", React.createElement("g", {id: 'icon-left-arrow-a'})))), React.createElement("span", {id: 'create-new-bookmark-label', className: 'new-message-label'}, localeStore.instance.TranslateText('marking.response.bookmarks-panel.go-back'))));
    // Set the bookmark list panel and bookmarks contents
    if (props.bookmarkItems && props.bookmarkItems.length > 0) {
        var visibleBookMarks = props.bookmarkItems.filter(function (bookmarkItem) {
            return bookmarkItem.markingOperation !== enums.MarkingOperation.deleted;
        });
        if (visibleBookMarks.length > 0) {
            showMenuContent = (React.createElement("div", {id: 'bookmark-list-content', className: 'list-menu-content'}, React.createElement("ul", {id: 'bookmark-contents-holder', className: 'list-menu-item-holder'}, visibleBookMarks.map(function (bookmarkItem, index) {
                if (bookmarkItem.markingOperation !== enums.MarkingOperation.deleted) {
                    return (React.createElement(BookmarkItem, {id: idPrefix + index, key: idPrefix + index, bookmarkId: idPrefix + bookmarkItem.bookmarkId, pageNo: bookmarkItem.pageNo, comment: bookmarkItem.comment.length === 0 ? bookmarkItem.toolTip : bookmarkItem.comment, fileName: bookmarkItem.fileName, toolTip: bookmarkItem.toolTip, clientToken: bookmarkItem.clientToken, bookmarkTop: bookmarkItem.top}));
                }
            }))));
        }
    }
    return (React.createElement("div", {id: props.id, className: classNames('bookmark-panel list-menu tool-option-menu menu')}, renderNewItemHeader, React.createElement("div", {id: 'go-back-header', className: 'list-menu-header'}, showGoBackOption), showMenuContent));
};
module.exports = bookmarkHolder;
//# sourceMappingURL=bookmarkholder.js.map