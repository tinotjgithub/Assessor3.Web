import React = require('react');
import ReactDom = require('react-dom');
import pureRenderComponent = require('../../base/purerendercomponent');
import keyDownHelper = require('../../../utility/generic/keydownhelper');
import modulekeys = require('../../../utility/generic/modulekeys');
import enums = require('../../utility/enums');
import bookmarkactioncreator = require('../../../actions/bookmarks/bookmarkactioncreator');
import domManager = require('../../../utility/generic/domhelper');
import constants = require('../../utility/constants');
import markingactioncreator = require('../../../actions/marking/markingactioncreator');
import htmlUtilities = require('../../../utility/generic/htmlutilities');
import stampActionCreator = require('../../../actions/stamp/stampactioncreator');

let classNames = require('classnames');

interface State {
    renderedOn: number;
    isBookmarkNameTextBoxOpen: boolean;
}

interface Props extends PropsBase {
    top: number;
    left: number;
    bookmarkText: string;
    clientToken: string;
    renderedOn: number;
    isVisible: boolean;
    bookmarkPosition: string;
}

/**
 * React component class for Bookmark Stamp Box
 */
class BookmarkStampBox extends pureRenderComponent<Props, State> {

    /** refs */
    public refs: {
        [key: string]: (Element);
        bookmarkNameTextBox: (HTMLInputElement);
    };

    // Holds a value indicating the comment text.
    private bookmarkText: string = '';
    //Holds a value to ignore the first click
    private _ignoreClickOutside: boolean = true;

    private _isBookmarkNameTextBoxOpen: boolean = false;

    private selectText: boolean = true;

    /**
     * @constructor
     */
    constructor(props: Props, state: State) {
        super(props, state);
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
    public componentWillMount() {
        this.bookmarkText = this.props.bookmarkText;
        this._isBookmarkNameTextBoxOpen = true;
        this._ignoreClickOutside = true;
        this.selectText = true;
    }

    /**
     * This function gets invoked when the component will receive props
     */
    public componentWillReceiveProps(nxtProps: Props): void {
        if (nxtProps.clientToken !== this.props.clientToken) {
            this.bookmarkText = nxtProps.bookmarkText;
            this._isBookmarkNameTextBoxOpen = true;
            this._ignoreClickOutside = true;
            this.selectText = true;
        }
    }

    /**
     * Component did update
     */
    public componentDidUpdate() {
        if (this.selectText === true) {
            this.setBookmarkTextBoxSelected();
        }
    }

    /**
     * Render method of the component
     */
    public render(): JSX.Element {

        let style: React.CSSProperties = {
            top: this.props.top + 'px',
            left: this.props.left + 'px'
        };

        let className = 'bookmark-entry ';
        if (!this.props.isVisible || !this._isBookmarkNameTextBoxOpen) {
            className = className + 'hide ';
            this.selectText = false;
        }
        className = className + (this.props.bookmarkPosition === 'right' ? 'right ' : '');
        return (
            <div className={className} id='bookmark-entry' style={style}>
                <input type='text'
                    id='bookmark-textbox'
                    value={this.bookmarkText}
                    className='bm-text'
                    maxLength={50}
                    aria-label='bookmark-textbox'
                    onFocus={this.onTextAreaFocus}
                    onInput={this.onTextChanged}
                    onKeyUp={this.closeBookmarkTextBoxOnEnterKey}
                    onBlur={this.onTextAreaBlur}
                    ref={'bookmarkNameTextBox'} />
                <a href='javascript:void(0)'
                    id='bookmark-close-icon'
                    onClick={this.closeBookmarkTextBox}>
                    <span className='close-icon lite'>Close</span>
                </a>

            </div>
        );
    }

    /**
     * This will set the focus to the newly added bookmark name panel
     * @param event
     */
    private onTextAreaFocus(event: any) {
        // Moving the cursor point to last(due to IE and ipad issue).
        if (htmlUtilities.isIE || htmlUtilities.isIE11 || htmlUtilities.isIPadDevice) {
            let temp = event.target.value || event.srcElement;
            event.target.value = '';
            event.target.value = temp !== undefined ? temp : '';
        }
        keyDownHelper.instance.DeActivate(enums.MarkEntryDeactivator.Bookmark);
        //Set bookmark Box Text selection. (IE Specific)
        this.setBookmarkTextBoxSelected();
    }

    /**
     * To select the bookmark text box content
     */
    private setBookmarkTextBoxSelected = () => {
        if (this.refs.bookmarkNameTextBox) {
            // element.select() not working in iPad. to fix setSelectionRange is used
            let element: HTMLInputElement = this.refs.bookmarkNameTextBox;
            element.focus();
            let start: number = 0;
            let end: number = element.value.length;
            element.focus();
            element.setSelectionRange(start, end);
        }
    }

    /**
     * Update bookmark text
     * @param event
     */
    private onTextChanged(event: any) {
        let target: any = event.target || event.srcElement;
        let text: string = target.value;
        this.bookmarkText = text;
        // This will save newly added bookmark's name on text box value change
        bookmarkactioncreator.updateBookmarkName(this.bookmarkUpdatedText(), this.props.clientToken);

        this.selectText = false;
        this.setState({ renderedOn: Date.now() });
    }

    /**
     * On text area blur
     */
    private onTextAreaBlur() {
        keyDownHelper.instance.Activate(enums.MarkEntryDeactivator.Bookmark);
    }

    /**
     * This will re-render bookmark list on pressing enter key
     * @param {any} source - The source element
     */
    private closeBookmarkTextBoxOnEnterKey = (event: any): any => {
        if (this._isBookmarkNameTextBoxOpen && event.keyCode === enums.KeyCode.enter) {
            // Re-render bookmarks
            this.setState({
                renderedOn: Date.now()
            });
            this._isBookmarkNameTextBoxOpen = false;

            // Re-render bookmark list
            stampActionCreator.showOrHideBookmarkNameBox(false);
        }
    }

    /**
     * Get default bookmark text, if we are closing the text box with empty text
     */
    private bookmarkUpdatedText(): string {
        return this.bookmarkText.length === 0 ? this.props.bookmarkText : this.bookmarkText;
    }

    /**
     * This re-render bookmark list on close button click
     * @param {any} source - The source element
     */
    private closeBookmarkTextBox(): any {
        // Re-render bookmarks
        this.setState({
            renderedOn: Date.now()
        });
        this._isBookmarkNameTextBoxOpen = false;

        // This will re-render bookmark list
        stampActionCreator.showOrHideBookmarkNameBox(false);
    }
}
export = BookmarkStampBox;