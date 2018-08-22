import React = require('react');
import ReactDOM = require('react-dom');
import pureRenderComponent = require('../base/purerendercomponent');
const TINYMCE = require('react-tinymce');
import messageStore = require('../../stores/message/messagestore');
import localeStore = require('../../stores/locale/localestore');
import htmlUtilities = require('../../utility/generic/htmlutilities');
import urls = require('../../dataservices/base/urls');
import messageEditorConstants = require('../utility/messageeditorconstants');
declare let tinymce: any;
import localeHelper = require('../../utility/locale/localehelper');
import messageHelper = require('../utility/message/messagehelper');

interface Props extends PropsBase, LocaleSelectionBase {
    htmlContent: string;
    hasFocus: boolean;
    toggleSaveButtonState: Function;
    isTinyMCELoaded?: Function;
}

interface State {
    scriptLoaded?: boolean;
    renderedOn?: number;
}


class MessageEditor extends pureRenderComponent<Props, State> {

    private isEditorInitialised: boolean = false;
    private lastTap: number = 0;
    private contentStyle: string = htmlUtilities.isIPadDevice ?
        '.mce-content-body{word-break: break-word;font-family:' + messageEditorConstants.TINYMCE_DEFAULT_FONT +
        '; font-size:' + messageEditorConstants.TINYMCE_DEFAULT_FONTSIZE + '; list-style-position: inside;}' + 'p{ margin:0; padding:0;}'
        : htmlUtilities.isIE ? '.mce-content-body{font-family:' + messageEditorConstants.TINYMCE_DEFAULT_FONT +
            '; font-size:' + messageEditorConstants.TINYMCE_DEFAULT_FONTSIZE + ';} p{ margin:0; padding:0;}' :
            '.mce-content-body{font-family:' + messageEditorConstants.TINYMCE_DEFAULT_FONT +
            '; font-size:' + messageEditorConstants.TINYMCE_DEFAULT_FONTSIZE + '; list-style-position: inside; } p{ margin:0; padding:0;}';

    /**
     * Constructor messageeditor
     * @param props
     * @param state
     */
    constructor(props: Props, state: State) {
        super(props, state);

        //initialize state
        this.state = {
            scriptLoaded: false,
            renderedOn: 0
        };

        this.onRemove = this.onRemove.bind(this);
        this.onEditorInit = this.onEditorInit.bind(this);
        this.onSetContent = this.onSetContent.bind(this);
    }

    /**
     * Component did mount
     */
    public componentDidMount() {
        messageStore.instance.addListener(messageStore.MessageStore.MESSAGE_CLOSE_EVENT, this.onMessagePanelClose);
        this.setFocus();
    }

	/**
	 * Component will mount
	 */
    public componentWillMount() {
        let url: string = htmlUtilities.getFullUrl(urls.TINYMCE_URL);
        // If tinyMCE script is not loaded then load that
        if (!htmlUtilities.isScriptLoaded(url)) {
            const script = document.createElement('script');
            script.src = url;
            script.async = true;
            script.onload = (this.dependenciesLoaded.bind(this));
            document.body.appendChild(script);
        } else {
            this.dependenciesLoaded();
        }
    }

    /**
     * component will unmount
     */
    public componentWillUnmount() {
        messageStore.instance.removeListener(messageStore.MessageStore.MESSAGE_CLOSE_EVENT, this.onMessagePanelClose);

        if (tinymce.get(this.props.id)) {
            tinymce.remove('#' + this.props.id);
        }
    }

    /**
     * Component did update
     */
    public componentDidUpdate() {
        this.setFocus();
    }

    /**
     * This will block the double-tap zoom in ipad
     */
    private blockDoubleTapZoom = (e: any): void => {
        let currentTime = new Date().getTime();
        let tapLength = currentTime - this.lastTap;
        if (tapLength < 500 && tapLength > 0) {
            e.preventDefault();
        }
        this.lastTap = currentTime;
    };

    /**
     * This will block the pinch-to-zoom in ipad
     */
    private blockPinchToZoom = (e: any): void => {
        if (e.touches.length > 1) {
            e.preventDefault();
        }
    };

    /**
     * Render component
     */
    public render() {

        if (this.state.scriptLoaded) {
            let selectedLang: string = localeHelper.getAwardingBodyLocale(this.props.selectedLanguage);
            let editorConfig = {
                menubar: false,
                statusbar: false,
                renderedOn: Date.now(),
                plugins: messageEditorConstants.TINYMCE_PLUGINS,
                toolbar: messageEditorConstants.TINYMCE_TOOLBAR,
                fontsize_formats: messageEditorConstants.TINYMCE_FONTSIZES,
                font_formats: messageEditorConstants.TINYMCE_FONTS,
                language: selectedLang,
                browser_spellcheck: true,
                content_style: this.contentStyle,
                default_link_target: '_blank',
                target_list: false,
                invalid_elements : 'embed'
            };
            return (
                <TINYMCE
                    content={this.props.htmlContent}
                    id={this.props.id}
                    theme={messageEditorConstants.TINYMCE_THEME}
                    config={editorConfig}
                    onKeyup={this.onKeyup}
                    onPaste={this.onPaste}
                    onInit={this.onEditorInit}
                    onClick={this.onClick}
                    onRemove={this.onRemove}
                />);

        } else {
            //show loading icon if script is not loaded
            return (<div></div>);
        }
    }

    /**
     * Method to load dependencies
     */
    private dependenciesLoaded() {
        if (this.props.isTinyMCELoaded) {
            this.props.isTinyMCELoaded(true);
        }
        this.setState({ scriptLoaded: true });
    }

    private onKeyup = (o: any, e: any) => {
        this.props.toggleSaveButtonState();
    };

    private onEditorInit = (o: any, e: any) => {
        this.activeEditor.on('SetContent', this.onSetContent);

        // Set the height of the iFrame section in the tiny mce as 100% for supporting the height calculation in css.
        document.getElementById('msg-tinymce-editor_ifr').style.height = '100%';
        if (htmlUtilities.isIPadDevice) {
            document.getElementById('msg-tinymce-editor_ifr').setAttribute('scrolling', 'no');
        }

        this.isEditorInitialised = true;

        if (htmlUtilities.isIPadDevice && htmlUtilities.getUserDevice().browser === 'Safari') {
            e.getWin().document.documentElement.addEventListener('touchend', this.blockDoubleTapZoom);
            e.getWin().document.documentElement.addEventListener('touchstart', this.blockPinchToZoom);
        }
    };

    private onRemove = (o: any, e: any) => {
        if (htmlUtilities.isIPadDevice && htmlUtilities.getUserDevice().browser === 'Safari') {
            e.getWin().document.documentElement.removeEventListener('touchend', this.blockDoubleTapZoom);
            e.getWin().document.documentElement.removeEventListener('touchstart', this.blockPinchToZoom);
        }
    };

    /**
     * Simulate window click while clicking on tinyMCE editor to close opened priority drop down and user option panel.
     */
    private onClick = (o: any, e: any) => {
        // we have to close opened priority drop down and user options (logout options) while clicking on outside that. TinyMCE editor was
        // preventing the click event to propagate outside so closing of those things are not happening while clicking on TinyMCE editor.
        let event = document.createEvent('MouseEvents');
        event.initMouseEvent('click', true, true, window, 0, 0, 0, 80, 20, false, false, false, false, 0, null);
        window.dispatchEvent(event);
    };

    private onPaste = (o: any, e: any) => {
        // find the clipboard data from any possible (window.clipboarddata is for ie)
        let clipBoardData: any = (o.clipboardData || window.clipboardData ||
            (o.originalEvent && o.originalEvent.clipboardData));

        // set getdata argument - 'text' is only for ie11 and other device/browsers need 'text/plain'
        let getDataArgument: string = htmlUtilities.isIE11 ? 'text' : 'text/plain';

        // If you paste text into the editor with mouse by right- click
        // TinyMCE's onPaste event is fired, but text is not available via .getContent().
        // So that checking the clipboard data item when the user pasting the text via mouse by right- click.
        if (clipBoardData && clipBoardData.getData(getDataArgument).trim() !== '') {
            messageHelper.setPasteEnabledAction(true);
        }
        this.props.toggleSaveButtonState();
    };

    /**
     * This method will enable the send button when hyperlink is added.
     */
    private onSetContent = (e: any) => {
        this.props.toggleSaveButtonState();
    };

    /**
     * This method will clear tinyMCE content
     */
    private onMessagePanelClose = () => {
        this.activeEditor.setContent('');
    };

    /**
     * This method will set focus to tinyMCE editor
     */
    private setFocus = () => {
        if (this.state.scriptLoaded) {
            if (this.activeEditor && this.isEditorInitialised && this.props.hasFocus) {
                // this will set dom focus to tinymce editor
                this.activeEditor.focus();
            }
        }
    };

    /**
     * This method will return the active editor
     */
    private get activeEditor() {
        return tinymce.get(this.props.id);
    }
}

export = MessageEditor;
