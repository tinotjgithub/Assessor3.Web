"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
/* tslint:disable:no-unused-variable */
var React = require('react');
/* tslint:enable:no-unused-variable */
var pureRenderComponent = require('../../../base/purerendercomponent');
var localeStore = require('../../../../stores/locale/localestore');
var BookmarkHolder = require('../../responsescreen/bookmark/bookmarkholder');
var domManager = require('../../../../utility/generic/domhelper');
var toolBarActionCreator = require('../../../../actions/toolbar/toolbaractioncreator');
var classNames = require('classnames');
var responseStore = require('../../../../stores/response/responsestore');
var BookmarkIcon = (function (_super) {
    __extends(BookmarkIcon, _super);
    function BookmarkIcon(props, state) {
        var _this = this;
        _super.call(this, props, state);
        this._openCloseBookmarkPanel = null;
        this._boundHandleOnClick = null;
        /**
         * Handle click events outside the bookmark panel
         * @param {any} e - The source element
         */
        this.handleClickOutsideElement = function (e) {
            /** check if the clicked element is a child of the user details list item. if not close the bookmark window */
            if (e.target !== undefined &&
                domManager.searchParentNode(e.target, function (el) { return el.id === 'bookmark-toolbar-icon'; }) == null) {
                if (_this.state.isBookmarkPanelOpen === true) {
                    _this.setState({
                        renderedOn: Date.now(),
                        isBookmarkPanelOpen: false
                    });
                }
                // both touchend and click event is fired one after other, 
                // this avoid resetting store in touchend
                if (_this.state.isBookmarkPanelOpen !== undefined && e.type !== 'touchend') {
                    toolBarActionCreator.isBookmarkSidePanelOpen(_this.state.isBookmarkPanelOpen);
                }
            }
        };
        /**
         * This will re-render the component
         */
        this.reRender = function () {
            _this.setState({
                renderedOn: Date.now()
            });
        };
        this.state = {
            renderedOn: 0,
            isBookmarkPanelOpen: false
        };
        this._openCloseBookmarkPanel = this.openCloseBookmarkPanel.bind(this);
    }
    /**
     * Open/Close the Bookmark panel
     * @param {any} source - The source element
     */
    BookmarkIcon.prototype.openCloseBookmarkPanel = function (e) {
        // both touchend and click event is fired one after other, 
        // this avoid resetting store in touchend
        /** check if the clicked element is a child of the user details list item. if not close the bookmark window */
        if (this.state.isBookmarkPanelOpen !== undefined &&
            e.type !== 'touchend' &&
            e.target !== undefined && domManager.searchParentNode(e.target, function (el) {
            return (el.id === 'bookmark-list-content' || el.id === 'go-back-header');
        }) == null) {
            toolBarActionCreator.isBookmarkSidePanelOpen(!this.state.isBookmarkPanelOpen);
        }
        if (this.state.isBookmarkPanelOpen === false) {
            this.setState({ isBookmarkPanelOpen: true });
        }
        else {
            if (e.target !== undefined && domManager.searchParentNode(e.target, function (el) {
                return (el.id === 'go-back-header' || el.id === 'bookmark-list-content');
            }) == null) {
                this.setState({ isBookmarkPanelOpen: false });
            }
        }
    };
    /**
     * Subscribe window click event
     */
    BookmarkIcon.prototype.componentDidMount = function () {
        this._boundHandleOnClick = this.handleClickOutsideElement.bind(this);
        window.addEventListener('touchend', this._boundHandleOnClick);
        window.addEventListener('click', this._boundHandleOnClick);
        responseStore.instance.addListener(responseStore.ResponseStore.SET_BOOKMARK_PREVIOUS_SCROLL_DATA_EVENT, this.reRender);
    };
    /**
     * Unsubscribe window click event
     */
    BookmarkIcon.prototype.componentWillUnmount = function () {
        window.removeEventListener('click', this._boundHandleOnClick);
        window.removeEventListener('touchend', this._boundHandleOnClick);
        responseStore.instance.removeListener(responseStore.ResponseStore.SET_BOOKMARK_PREVIOUS_SCROLL_DATA_EVENT, this.reRender);
    };
    /**
     * Render method
     */
    BookmarkIcon.prototype.render = function () {
        var svgStyle = {
            pointerEvents: 'none'
        };
        return (React.createElement("li", {onClick: this._openCloseBookmarkPanel, id: 'bookmark-toolbar-icon', className: classNames('bookmark-dropdown dropdown-wrap', this.state.isBookmarkPanelOpen ? 'open' : '')}, React.createElement("a", {href: 'javascript:void(0);', className: 'menu-button', title: localeStore.instance.TranslateText('marking.response.left-toolbar.bookmarks-button-tooltip'), id: 'bookmark-panel'}, React.createElement("span", {className: 'svg-icon'}, React.createElement("svg", {viewBox: '0 0 32 32', className: 'add-bm-mark', style: svgStyle}, React.createElement("use", {xlinkHref: '#add-bm-mark'}, "#shadow-root (closed)", React.createElement("g", {id: 'add-bm-mark'})))), React.createElement("span", {className: 'sprite-icon toolexpand-icon'}, localeStore.instance.TranslateText('marking.response.left-toolbar.bookmarks-button-tooltip'))), React.createElement(BookmarkHolder, {id: 'bookmark-holder', key: 'bookmark-holder', selectedLanguage: this.props.selectedLanguage, bookmarkItems: this.props.bookmarkItems})));
    };
    return BookmarkIcon;
}(pureRenderComponent));
module.exports = BookmarkIcon;
//# sourceMappingURL=bookmarkicon.js.map