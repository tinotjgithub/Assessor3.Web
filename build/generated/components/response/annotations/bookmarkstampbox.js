"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var React = require('react');
var pureRenderComponent = require('../../base/purerendercomponent');
var keyDownHelper = require('../../../utility/generic/keydownhelper');
var enums = require('../../utility/enums');
var bookmarkactioncreator = require('../../../actions/bookmarks/bookmarkactioncreator');
var htmlUtilities = require('../../../utility/generic/htmlutilities');
var stampActionCreator = require('../../../actions/stamp/stampactioncreator');
var classNames = require('classnames');
/**
 * React component class for Bookmark Stamp Box
 */
var BookmarkStampBox = (function (_super) {
    __extends(BookmarkStampBox, _super);
    /**
     * @constructor
     */
    function BookmarkStampBox(props, state) {
        var _this = this;
        _super.call(this, props, state);
        // Holds a value indicating the comment text.
        this.bookmarkText = '';
        //Holds a value to ignore the first click
        this._ignoreClickOutside = true;
        this._isBookmarkNameTextBoxOpen = false;
        this.selectText = true;
        /**
         * To select the bookmark text box content
         */
        this.setBookmarkTextBoxSelected = function () {
            if (_this.refs.bookmarkNameTextBox) {
                // element.select() not working in iPad. to fix setSelectionRange is used
                var element = _this.refs.bookmarkNameTextBox;
                element.focus();
                var start = 0;
                var end = element.value.length;
                element.focus();
                element.setSelectionRange(start, end);
            }
        };
        /**
         * This will re-render bookmark list on pressing enter key
         * @param {any} source - The source element
         */
        this.closeBookmarkTextBoxOnEnterKey = function (event) {
            if (_this._isBookmarkNameTextBoxOpen && event.keyCode === enums.KeyCode.enter) {
                // Re-render bookmarks
                _this.setState({
                    renderedOn: Date.now()
                });
                _this._isBookmarkNameTextBoxOpen = false;
                // Re-render bookmark list
                stampActionCreator.showOrHideBookmarkNameBox(false);
            }
        };
        this.state = {
            renderedOn: 0,
            isBookmarkNameTextBoxOpen: true
        };
        this.onTextChanged = this.onTextChanged.bind(this);
        this.closeBookmarkTextBox = this.closeBookmarkTextBox.bind(this);
        this.onTextAreaFocus = this.onTextAreaFocus.bind(this);
        this.setBookmarkTextBoxSelected = this.setBookmarkTextBoxSelected.bind(this);
        this._isBookmarkNameTextBoxOpen = true;
    }
    /**
     * Component Will mount - called before render
     */
    BookmarkStampBox.prototype.componentWillMount = function () {
        this.bookmarkText = this.props.bookmarkText;
        this._isBookmarkNameTextBoxOpen = true;
        this._ignoreClickOutside = true;
        this.selectText = true;
    };
    /**
     * This function gets invoked when the component will receive props
     */
    BookmarkStampBox.prototype.componentWillReceiveProps = function (nxtProps) {
        if (nxtProps.clientToken !== this.props.clientToken) {
            this.bookmarkText = nxtProps.bookmarkText;
            this._isBookmarkNameTextBoxOpen = true;
            this._ignoreClickOutside = true;
            this.selectText = true;
        }
    };
    /**
     * Component did update
     */
    BookmarkStampBox.prototype.componentDidUpdate = function () {
        if (this.selectText === true) {
            this.setBookmarkTextBoxSelected();
        }
    };
    /**
     * Render method of the component
     */
    BookmarkStampBox.prototype.render = function () {
        var style = {
            top: this.props.top + 'px',
            left: this.props.left + 'px'
        };
        var className = 'bookmark-entry ';
        if (!this.props.isVisible || !this._isBookmarkNameTextBoxOpen) {
            className = className + 'hide ';
            this.selectText = false;
        }
        className = className + (this.props.bookmarkPosition === 'right' ? 'right ' : '');
        return (React.createElement("div", {className: className, id: 'bookmark-entry', style: style}, React.createElement("input", {type: 'text', id: 'bookmark-textbox', value: this.bookmarkText, className: 'bm-text', maxLength: 50, "aria-label": 'bookmark-textbox', onFocus: this.onTextAreaFocus, onInput: this.onTextChanged, onKeyUp: this.closeBookmarkTextBoxOnEnterKey, onBlur: this.onTextAreaBlur, ref: 'bookmarkNameTextBox'}), React.createElement("a", {href: 'javascript:void(0)', id: 'bookmark-close-icon', onClick: this.closeBookmarkTextBox}, React.createElement("span", {className: 'close-icon lite'}, "Close"))));
    };
    /**
     * This will set the focus to the newly added bookmark name panel
     * @param event
     */
    BookmarkStampBox.prototype.onTextAreaFocus = function (event) {
        // Moving the cursor point to last(due to IE and ipad issue).
        if (htmlUtilities.isIE || htmlUtilities.isIE11 || htmlUtilities.isIPadDevice) {
            var temp = event.target.value || event.srcElement;
            event.target.value = '';
            event.target.value = temp !== undefined ? temp : '';
        }
        keyDownHelper.instance.DeActivate(enums.MarkEntryDeactivator.Bookmark);
        //Set bookmark Box Text selection. (IE Specific)
        this.setBookmarkTextBoxSelected();
    };
    /**
     * Update bookmark text
     * @param event
     */
    BookmarkStampBox.prototype.onTextChanged = function (event) {
        var target = event.target || event.srcElement;
        var text = target.value;
        this.bookmarkText = text;
        // This will save newly added bookmark's name on text box value change
        bookmarkactioncreator.updateBookmarkName(this.bookmarkUpdatedText(), this.props.clientToken);
        this.selectText = false;
        this.setState({ renderedOn: Date.now() });
    };
    /**
     * On text area blur
     */
    BookmarkStampBox.prototype.onTextAreaBlur = function () {
        keyDownHelper.instance.Activate(enums.MarkEntryDeactivator.Bookmark);
    };
    /**
     * Get default bookmark text, if we are closing the text box with empty text
     */
    BookmarkStampBox.prototype.bookmarkUpdatedText = function () {
        return this.bookmarkText.length === 0 ? this.props.bookmarkText : this.bookmarkText;
    };
    /**
     * This re-render bookmark list on close button click
     * @param {any} source - The source element
     */
    BookmarkStampBox.prototype.closeBookmarkTextBox = function () {
        // Re-render bookmarks
        this.setState({
            renderedOn: Date.now()
        });
        this._isBookmarkNameTextBoxOpen = false;
        // This will re-render bookmark list
        stampActionCreator.showOrHideBookmarkNameBox(false);
    };
    return BookmarkStampBox;
}(pureRenderComponent));
module.exports = BookmarkStampBox;
//# sourceMappingURL=bookmarkstampbox.js.map