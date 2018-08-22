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
var classNames = require('classnames');
var localeStore = require('../../../../stores/locale/localestore');
var domManager = require('../../../../utility/generic/domhelper');
var NotePlaceHolder = require('./noteplaceholder');
var responseStore = require('../../../../stores/response/responsestore');
var NoteIcon = (function (_super) {
    __extends(NoteIcon, _super);
    /**
     * Constructor for NoteIcon
     * @param props
     * @param state
     */
    function NoteIcon(props, state) {
        var _this = this;
        _super.call(this, props, state);
        this._openCloseNoteOption = null;
        this._noteTextValue = '';
        this._boundHandleOnClick = null;
        /**
         * Handle click events outside the zoom settings
         * @param {any} e - The source element
         */
        this.handleClickOutsideElement = function (e) {
            /** check if the clicked element is a child of the note-placeholder list item. if not close the open window */
            if (e.target !== undefined &&
                domManager.searchParentNode(e.target, function (el) { return el.id === 'note-icon'; }) == null) {
                if (_this.state.isNoteOpen === true) {
                    _this.setState({
                        isNoteOpen: false,
                    });
                }
            }
        };
        /**
         * Method to Re render the component once navigation resaponse navigation started
         */
        this.reRender = function () {
            _this.setState({
                renderedOn: Date.now(),
                isNoteOpen: false
            });
        };
        this.state = {
            isNoteOpen: false
        };
        this._noteTextValue = this.props.noteTextValue;
        this._openCloseNoteOption = this.openCloseNoteOption.bind(this);
        this._boundHandleOnClick = this.handleClickOutsideElement.bind(this);
    }
    /**
     * Subscribe window click event
     */
    NoteIcon.prototype.componentDidMount = function () {
        window.addEventListener('touchend', this._boundHandleOnClick);
        window.addEventListener('click', this._boundHandleOnClick);
        responseStore.instance.addListener(responseStore.ResponseStore.RESPONSE_CHANGED, this.reRender);
    };
    /**
     * Unsubscribe window click event
     */
    NoteIcon.prototype.componentWillUnmount = function () {
        window.removeEventListener('click', this._boundHandleOnClick);
        window.removeEventListener('touchend', this._boundHandleOnClick);
        responseStore.instance.removeListener(responseStore.ResponseStore.RESPONSE_CHANGED, this.reRender);
    };
    /**
     * triggers while the component receives the props.
     */
    NoteIcon.prototype.componentWillReceiveProps = function (nextProps) {
        if (this.props.noteTextValue !== nextProps.noteTextValue) {
            this._noteTextValue = nextProps.noteTextValue;
        }
    };
    /**
     * Open/Close the Note option
     * @param {any} source - The source element
     */
    NoteIcon.prototype.openCloseNoteOption = function (e) {
        if (this.state.isNoteOpen === false) {
            this.setState({ isNoteOpen: true });
        }
        else {
            /** check if the clicked element is a child of the user details list item. if not close the open window */
            if (e.target !== undefined &&
                domManager.searchParentNode(e.target, function (el) { return el.id === 'notes-holder'; }) == null) {
                this.setState({
                    isNoteOpen: false,
                });
            }
        }
    };
    Object.defineProperty(NoteIcon.prototype, "placeHolderForNote", {
        /**
         * Method to display placeholder for note
         */
        get: function () {
            return (this.state.isNoteOpen ?
                React.createElement(NotePlaceHolder, {id: 'note-placeholder-id', key: 'note-placeholder-key', NoteTextValue: this._noteTextValue, selectedLanguage: this.props.selectedLanguage})
                : null);
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Render component
     * @returns
     */
    NoteIcon.prototype.render = function () {
        return (React.createElement("li", {id: 'note-icon', className: classNames('mrk-note-icon dropdown-wrap', this.state.isNoteOpen ? 'open' : 'close'), onClick: this._openCloseNoteOption}, React.createElement("a", {href: 'javascript:void(0)', title: localeStore.instance.
            TranslateText('marking.response.left-toolbar.notes-button-tooltip'), className: 'menu-button', id: this.props.id}, React.createElement("span", {className: 'svg-icon'}, React.createElement("svg", {viewBox: '0 0 32 32', className: 'note-icon'}, React.createElement("use", {xlinkHref: '#add-note', className: 'add-note-icon'}), React.createElement("use", {xlinkHref: '#note-icon', className: 'note-exsist-icon'})), React.createElement("span", {className: classNames('note-exsist-indication', this._noteTextValue === ''
            || this._noteTextValue === null ? 'hide' : '')})), React.createElement("span", {className: 'sprite-icon toolexpand-icon'})), this.placeHolderForNote));
    };
    return NoteIcon;
}(pureRenderComponent));
module.exports = NoteIcon;
//# sourceMappingURL=noteicon.js.map