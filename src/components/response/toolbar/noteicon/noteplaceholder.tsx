/* tslint:disable:no-unused-variable */
import React = require('react');
/* tslint:enable:no-unused-variable */
import pureRenderComponent = require('../../../base/purerendercomponent');
import localeStore = require('../../../../stores/locale/localestore');
import standardisationSetupStore = require('../../../../stores/standardisationsetup/standardisationsetupstore');
import keyDownHelper = require('../../../../utility/generic/keydownhelper');
import modulekeys = require('../../../../utility/generic/modulekeys');
import standardisationaAtioncreator = require('../../../../actions/standardisationsetup/standardisationactioncreator');
import markingStore = require('../../../../stores/marking/markingstore');
import markerOperationModeFactory = require('../../../utility/markeroperationmode/markeroperationmodefactory');
import enums = require('../../../utility/enums');

/**
 * Component props
 * @param {Props} props
 * @param {any} any
 */
interface Props extends LocaleSelectionBase, PropsBase {
    NoteTextValue?: string;
    isReadOnly: boolean;
}

interface State {
    renderedOn?: number;
}

class NotePlaceHolder extends pureRenderComponent<Props, State> {

    private currentResponseNote: string = '';
    private currentResponseMarkGroupId: number;
    private currentResponseNoteFromStore: string = '';
    private currentNoteDetails: StandardisationResponseDetails;
    /**
     * Constructor for NoteIcon
     * @param props
     * @param state
     */
    constructor(props: Props, state: State) {
        super(props, state);
        this.onTextAreaFocus = this.onTextAreaFocus.bind(this);
        this.currentResponseNote = this.props.NoteTextValue;
        this.currentResponseNoteFromStore = this.props.NoteTextValue;
        this.currentResponseMarkGroupId = markingStore.instance.currentMarkGroupId;
        this.currentNoteDetails =
            standardisationSetupStore.instance.standardisationSetUpResponsedetails.
                standardisationResponses.filter(
                x => x.displayId === markingStore.instance.selectedDisplayId.toString()).first();
    }

    /**
     * This method will call on focus of notePanel text area
     * @param e
     */
    private onTextAreaFocus(e: any): void {
        keyDownHelper.instance.DeActivate(enums.MarkEntryDeactivator.Note);
        this.doEnableKeyBoardHandlers(false);
    }

    /**
     * Unsubscribe window click event
     */
    public componentWillUnmount() {
        let currentResponseNote: string = this.currentResponseNote && this.currentResponseNote.trim();
        // checking  whether the updated note is empty.
        let isEmptyNote: boolean = (currentResponseNote === '' && this.currentResponseNoteFromStore === null);
        // This method will call when we add/edit/delete a note for saving it in the DB
        if (!isEmptyNote && currentResponseNote !== this.currentResponseNoteFromStore) {

            standardisationaAtioncreator.saveNote(
                this.currentResponseMarkGroupId,
                currentResponseNote,
                this.currentNoteDetails.noteRowVersion,
                this.currentNoteDetails.markingModeId
            );
        }
        keyDownHelper.instance.Activate(enums.MarkEntryDeactivator.Note);
        this.doEnableKeyBoardHandlers(true);
    }

    /**
     * Render the note panel box.
     * @param- event
     */
    public onNoteChanged = (event: any): void => {
        this.currentResponseNote = event.target.value;
        this.setState({
            renderedOn: Date.now()
        });
    }

    /**
     * enables or disable handlers in keydown helper
     * @param enable
     */
    private doEnableKeyBoardHandlers(doEnable: boolean): void {
        keyDownHelper.instance.resetActivateHandler(modulekeys.MARKSCHEME_TEXT_ENTRY, doEnable);
        keyDownHelper.instance.resetActivateHandler(modulekeys.MARKSCHEME_SCHEME_PANEL_SCROLL, doEnable);
        keyDownHelper.instance.resetActivateHandler(modulekeys.RESPONSE_NAVIGATION, doEnable);
        keyDownHelper.instance.resetActivateHandler(modulekeys.PAGE_KEY_DOWN, doEnable);
    }

    /**
     * Render component
     * @returns
     */
    public render() {
        let disableNote: boolean = !this.props.isReadOnly;
        return (
            <div className='tool-option-menu menu'>
                <div className='notes-holder' id='notes-holder'>
                    <div className='button-label'>{localeStore.instance.
                        TranslateText('marking.response.left-toolbar.notes-header')}</div>
                    <div className='notes-entry-holder' id='notes-entry-holder'>
                        <textarea readOnly={disableNote} className='notes-editor' id='notes-editor' title=''
                            value={this.currentResponseNote}
                            onFocus={this.onTextAreaFocus}
                            onChange={this.onNoteChanged} required>
                        </textarea>
                        <span className='note-placehokder dim-text'>
                            {localeStore.instance.TranslateText('marking.response.left-toolbar.no-note-text1-in-placeholder')}
                            <br></br><br></br>
                            {localeStore.instance.TranslateText('marking.response.left-toolbar.no-note-text2-in-placeholder')}
                        </span>
                    </div>
                </div>
            </div>
       );
    }
}
export = NotePlaceHolder;