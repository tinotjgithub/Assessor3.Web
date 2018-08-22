/* tslint:disable:no-unused-variable */
import React = require('react');
/* tslint:enable:no-unused-variable */
import pureRenderComponent = require('../../../base/purerendercomponent');
let classNames = require('classnames');
import localeStore = require('../../../../stores/locale/localestore');
import domManager = require('../../../../utility/generic/domhelper');
import standardisationSetupStore = require('../../../../stores/standardisationsetup/standardisationsetupstore');
import keyDownHelper = require('../../../../utility/generic/keydownhelper');
import modulekeys = require('../../../../utility/generic/modulekeys');
import standardisationaAtioncreator = require('../../../../actions/standardisationsetup/standardisationactioncreator');
import markingStore = require('../../../../stores/marking/markingstore');
import enums = require('../../../utility/enums');
import NotePlaceHolder = require('./noteplaceholder');
import responseStore = require('../../../../stores/response/responsestore');


/**
 * Component props
 * @param {Props} props
 * @param {any} any
 */
interface Props extends LocaleSelectionBase, PropsBase {
    noteTextValue?: string;
    isReadOnly: boolean;
}

interface State {
    renderedOn?: number;
    isNoteOpen?: boolean;
}

class NoteIcon extends pureRenderComponent<Props, State> {

    private _openCloseNoteOption: any = null;
    private _noteTextValue: string = '';
    private _boundHandleOnClick: EventListenerObject = null;

    /**
     * Constructor for NoteIcon
     * @param props
     * @param state
     */
    constructor(props: Props, state: State) {
        super(props, state);
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
    public componentDidMount() {
        window.addEventListener('touchend', this._boundHandleOnClick);
        window.addEventListener('click', this._boundHandleOnClick);
        responseStore.instance.addListener(responseStore.ResponseStore.RESPONSE_CHANGED, this.reRender);
    }

    /**
     * Unsubscribe window click event
     */
    public componentWillUnmount() {
        window.removeEventListener('click', this._boundHandleOnClick);
        window.removeEventListener('touchend', this._boundHandleOnClick);
        responseStore.instance.removeListener(responseStore.ResponseStore.RESPONSE_CHANGED, this.reRender);
    }

    /**
     * triggers while the component receives the props.
     */
    public componentWillReceiveProps(nextProps: Props) {
        if (this.props.noteTextValue !== nextProps.noteTextValue) {
            this._noteTextValue = nextProps.noteTextValue;
        }
    }

    /**
     * Open/Close the Note option
     * @param {any} source - The source element
     */
    private openCloseNoteOption(e: MouseEvent | TouchEvent) {
        if (this.state.isNoteOpen === false) {
            this.setState({ isNoteOpen: true });
        } else {
            /** check if the clicked element is a child of the user details list item. if not close the open window */
            if (e.target !== undefined &&
                domManager.searchParentNode(e.target, function (el: any) { return el.id === 'notes-holder'; }) == null) {
                this.setState({
                    isNoteOpen: false,
                });
            }
        }
    }

    /**
     * Handle click events outside the zoom settings
     * @param {any} e - The source element
     */
    private handleClickOutsideElement = (e: MouseEvent | TouchEvent): any => {
        /** check if the clicked element is a child of the note-placeholder list item. if not close the open window */
        if (e.target !== undefined &&
            domManager.searchParentNode(e.target, function (el: any) { return el.id === 'note-icon'; }) == null) {
            if (this.state.isNoteOpen === true) {
                this.setState({
                    isNoteOpen: false,
                });
            }
        }
    };


    /**
     * Method to display placeholder for note
     */
    private get placeHolderForNote(): JSX.Element {
        return (this.state.isNoteOpen ?
            <NotePlaceHolder id='note-placeholder-id' key='note-placeholder-key'
                NoteTextValue={this._noteTextValue}
                isReadOnly={this.props.isReadOnly}
                selectedLanguage={this.props.selectedLanguage} />
            : null
        );
    }

    /**
     * Method to Re render the component once navigation resaponse navigation started
     */
    private reRender = () => {
        this.setState({
            renderedOn: Date.now(),
            isNoteOpen: false
        });
    };
    /**
     * Render component
     * @returns
     */
    public render() {
        return (
            <li id='note-icon' className={classNames('mrk-note-icon dropdown-wrap',
                this.state.isNoteOpen ? 'open' : 'close')} onClick={this._openCloseNoteOption}>
                <a href='javascript:void(0)' title={localeStore.instance.
                    TranslateText('marking.response.left-toolbar.notes-button-tooltip')}
                    className='menu-button'
                    id={this.props.id}>
                    <span className='svg-icon'>
                        <svg viewBox='0 0 32 32' className='note-icon'>
                            <use xlinkHref='#add-note' className='add-note-icon'></use>
                            <use xlinkHref='#note-icon' className='note-exsist-icon'></use>
                        </svg>
                        <span className={classNames('note-exsist-indication', this._noteTextValue === ''
                            || this._noteTextValue === null ? 'hide' : '')} ></span>
                    </span>
                    <span className='sprite-icon toolexpand-icon'></span>
                </a>
                {this.placeHolderForNote}
            </li>
        );
    }
}
export = NoteIcon;