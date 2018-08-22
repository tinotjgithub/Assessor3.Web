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
var keyDownHelper = require('../../../../utility/generic/keydownhelper');
var modulekeys = require('../../../../utility/generic/modulekeys');
var standardisationaAtioncreator = require('../../../../actions/standardisationsetup/standardisationactioncreator');
var markingStore = require('../../../../stores/marking/markingstore');
var enums = require('../../../utility/enums');
var NotePlaceHolder = (function (_super) {
    __extends(NotePlaceHolder, _super);
    /**
     * Constructor for NoteIcon
     * @param props
     * @param state
     */
    function NotePlaceHolder(props, state) {
        var _this = this;
        _super.call(this, props, state);
        this.currentResponseNote = '';
        this.currentResponseNoteFromStore = '';
        /**
         * Render the note panel box.
         * @param- event
         */
        this.onNoteChanged = function (event) {
            _this.currentResponseNote = event.target.value;
            _this.setState({
                renderedOn: Date.now()
            });
        };
        this.onTextAreaFocus = this.onTextAreaFocus.bind(this);
        this.currentResponseNote = this.props.NoteTextValue;
        this.currentResponseNoteFromStore = this.props.NoteTextValue;
        this.currentResponseMarkGroupId = markingStore.instance.currentMarkGroupId;
    }
    /**
     * This method will call on focus of notePanel text area
     * @param e
     */
    NotePlaceHolder.prototype.onTextAreaFocus = function (e) {
        keyDownHelper.instance.DeActivate(enums.MarkEntryDeactivator.Note);
        this.doEnableKeyBoardHandlers(false);
    };
    /**
     * Unsubscribe window click event
     */
    NotePlaceHolder.prototype.componentWillUnmount = function () {
        var currentResponseNote = this.currentResponseNote && this.currentResponseNote.trim();
        // checking  whether the updated note is empty.
        var isEmptyNote = (currentResponseNote === '' && this.currentResponseNoteFromStore === null);
        // This method will call when we add/edit/delete a note for saving it in the DB
        if (!isEmptyNote && currentResponseNote !== this.currentResponseNoteFromStore) {
            standardisationaAtioncreator.saveNote(this.currentResponseMarkGroupId, currentResponseNote);
        }
        keyDownHelper.instance.Activate(enums.MarkEntryDeactivator.Note);
        this.doEnableKeyBoardHandlers(true);
    };
    /**
     * enables or disable handlers in keydown helper
     * @param enable
     */
    NotePlaceHolder.prototype.doEnableKeyBoardHandlers = function (doEnable) {
        keyDownHelper.instance.resetActivateHandler(modulekeys.MARKSCHEME_TEXT_ENTRY, doEnable);
        keyDownHelper.instance.resetActivateHandler(modulekeys.MARKSCHEME_SCHEME_PANEL_SCROLL, doEnable);
        keyDownHelper.instance.resetActivateHandler(modulekeys.RESPONSE_NAVIGATION, doEnable);
        keyDownHelper.instance.resetActivateHandler(modulekeys.PAGE_KEY_DOWN, doEnable);
    };
    /**
     * Render component
     * @returns
     */
    NotePlaceHolder.prototype.render = function () {
        return (React.createElement("div", {className: 'tool-option-menu menu'}, React.createElement("div", {className: 'notes-holder', id: 'notes-holder'}, React.createElement("div", {className: 'button-label'}, localeStore.instance.
            TranslateText('marking.response.left-toolbar.notes-header')), React.createElement("div", {className: 'notes-entry-holder', id: 'notes-entry-holder'}, React.createElement("textarea", {className: 'notes-editor', id: 'notes-editor', title: '', value: this.currentResponseNote, onFocus: this.onTextAreaFocus, onChange: this.onNoteChanged, required: true}), React.createElement("span", {className: 'note-placehokder dim-text'}, localeStore.instance.TranslateText('marking.response.left-toolbar.no-note-text1-in-placeholder'), React.createElement("br", null), React.createElement("br", null), localeStore.instance.TranslateText('marking.response.left-toolbar.no-note-text2-in-placeholder'))))));
    };
    return NotePlaceHolder;
}(pureRenderComponent));
module.exports = NotePlaceHolder;
//# sourceMappingURL=noteplaceholder.js.map