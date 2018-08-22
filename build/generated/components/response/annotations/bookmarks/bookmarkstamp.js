"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
/* tslint:disable:no-unused-variable */
var React = require('react');
var StampBase = require('../stampbase');
var classNames = require('classnames');
var stampActionCreator = require('../../../../actions/stamp/stampactioncreator');
/**
 * React component class for Image Stamp.
 */
var BookmarkStamp = (function (_super) {
    __extends(BookmarkStamp, _super);
    /**
     * @constructor
     */
    function BookmarkStamp(props, state) {
        _super.call(this, props, state);
        // Holds a value indicating the comment text.
        this.bookmarkText = '';
        this._boundHandleOnClick = null;
        this.ignoreOutsideClickOnce = true;
        this.state = {
            renderedOn: 0,
            isBookmarkNameTextBoxOpen: this.props.isNewBookmark
        };
        this.onMouseEnterHandler = this.onMouseEnterHandler.bind(this);
        this.onMouseMoveHandler = this.onMouseMoveHandler.bind(this);
        this.onMouseLeaveHandler = this.onMouseLeaveHandler.bind(this);
        this.onContextMenu = this.onContextMenu.bind(this);
        this.onEnterCommentSelected = this.onEnterCommentSelected.bind(this);
        this.left = 0;
        this.top = 0;
    }
    /**
     * Component did mount
     */
    BookmarkStamp.prototype.componentDidMount = function () {
        if (this.props.isNewBookmark) {
            stampActionCreator.showOrHideBookmarkNameBox(this.props.isNewBookmark, this.props.toolTip, this.props.clientToken, this.props.rotatedAngle);
        }
    };
    /**
     * Render method
     */
    BookmarkStamp.prototype.render = function () {
        // SVG pointer event style added for IE browser fix where use by default will have mouse pointer events
        // which was showing browser default context menu.
        var svgPointerEventsStyle = {};
        var style = {};
        var wrapperStyle = {};
        var isDisplayingInScript = false;
        var svgId = '';
        var classToApply;
        isDisplayingInScript = this.props.isDisplayingInScript !== undefined && this.props.isDisplayingInScript;
        // Check if current annotation is dragged then we should hide the annotation
        // so that it will not be dispalyed to the user at the initial position from
        // where it is being dragged
        if (!this.props.isVisible) {
            classToApply = '';
            wrapperStyle.display = 'none';
            style.display = 'none';
            svgPointerEventsStyle.display = 'none';
        }
        else {
            var isPrevious = this.isPreviousAnnotation;
            wrapperStyle = this.getAnnotationWrapperStyle(this.props.wrapperStyle);
            style.top = this.props.topPos != null && this.props.topPos !== undefined ? this.props.topPos : style.top;
            style.left = this.props.leftPos != null && this.props.leftPos !== undefined ? this.props.leftPos : style.left;
            style.pointerEvents = 'none';
            this.top = style.top;
            this.left = style.left;
            svgPointerEventsStyle.pointerEvents = 'none';
            classToApply = classNames({ 'book-mark': isDisplayingInScript }, { 'open': this.state.isOpen === undefined ? false : this.state.isOpen }, { 'inactive': this.props.isActive !== undefined && !this.props.isActive && !this.props.isInFullResponseView });
        }
        svgId = isDisplayingInScript ? 'svgScriptStamp' : 'svgStamp';
        //If the stamp is not in the script no need to render the parent span.
        if (!isDisplayingInScript) {
            return this.renderBookmark(svgPointerEventsStyle, style, svgId);
        }
        return (React.createElement("span", {className: classToApply, style: wrapperStyle, id: this.props.id, onMouseEnter: this.onMouseEnterHandler, onMouseMove: this.onMouseMoveHandler, onMouseLeave: this.onMouseLeaveHandler, onContextMenu: this.onContextMenu, onClick: this.onEnterCommentSelected, onDoubleClick: this.onEnterCommentSelected, "data-token": this.props.clientToken}, this.renderBookmark(svgPointerEventsStyle, style, svgId)));
    };
    /**
     * Render the Bookmark.
     * @param svgPointerEventsStyle
     * @param style
     * @param svgId
     */
    BookmarkStamp.prototype.renderBookmark = function (svgPointerEventsStyle, style, svgId) {
        if (style === void 0) { style = {}; }
        return (React.createElement("span", {id: this.props.bookmarkId, className: 'book-m-ico', title: this.props.toolTip}, React.createElement("span", {className: 'svg-icon', "data-token": this.props.clientToken}, React.createElement("svg", {viewBox: '0 0 24 40', className: 'select-bm-icon', style: style, role: 'img'}, React.createElement("title", null, this.props.toolTip), React.createElement("use", {style: svgPointerEventsStyle, xlinkHref: '#select-bm-icon'})))));
    };
    return BookmarkStamp;
}(StampBase));
module.exports = BookmarkStamp;
//# sourceMappingURL=bookmarkstamp.js.map