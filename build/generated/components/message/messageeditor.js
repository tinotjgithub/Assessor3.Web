"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var React = require('react');
var pureRenderComponent = require('../base/purerendercomponent');
var TINYMCE = require('react-tinymce');
var messageStore = require('../../stores/message/messagestore');
var htmlUtilities = require('../../utility/generic/htmlutilities');
var urls = require('../../dataservices/base/urls');
var messageEditorConstants = require('../utility/messageeditorconstants');
var localeHelper = require('../../utility/locale/localehelper');
var messageHelper = require('../utility/message/messagehelper');
var MessageEditor = (function (_super) {
    __extends(MessageEditor, _super);
    /**
     * Constructor messageeditor
     * @param props
     * @param state
     */
    function MessageEditor(props, state) {
        var _this = this;
        _super.call(this, props, state);
        this.isEditorInitialised = false;
        this.lastTap = 0;
        this.contentStyle = htmlUtilities.isIPadDevice ?
            '.mce-content-body{word-break: break-word;font-family:' + messageEditorConstants.TINYMCE_DEFAULT_FONT +
                '; font-size:' + messageEditorConstants.TINYMCE_DEFAULT_FONTSIZE + '; list-style-position: inside;}' + 'p{ margin:0; padding:0;}'
            : htmlUtilities.isIE ? '.mce-content-body{font-family:' + messageEditorConstants.TINYMCE_DEFAULT_FONT +
                '; font-size:' + messageEditorConstants.TINYMCE_DEFAULT_FONTSIZE + ';} p{ margin:0; padding:0;}' :
                '.mce-content-body{font-family:' + messageEditorConstants.TINYMCE_DEFAULT_FONT +
                    '; font-size:' + messageEditorConstants.TINYMCE_DEFAULT_FONTSIZE + '; list-style-position: inside; } p{ margin:0; padding:0;}';
        /**
         * This will block the double-tap zoom in ipad
         */
        this.blockDoubleTapZoom = function (e) {
            var currentTime = new Date().getTime();
            var tapLength = currentTime - _this.lastTap;
            if (tapLength < 500 && tapLength > 0) {
                e.preventDefault();
            }
            _this.lastTap = currentTime;
        };
        /**
         * This will block the pinch-to-zoom in ipad
         */
        this.blockPinchToZoom = function (e) {
            if (e.touches.length > 1) {
                e.preventDefault();
            }
        };
        this.onKeyup = function (o, e) {
            _this.props.toggleSaveButtonState();
        };
        this.onEditorInit = function (o, e) {
            _this.activeEditor.on('SetContent', _this.onSetContent);
            // Set the height of the iFrame section in the tiny mce as 100% for supporting the height calculation in css.
            document.getElementById('msg-tinymce-editor_ifr').style.height = '100%';
            if (htmlUtilities.isIPadDevice) {
                document.getElementById('msg-tinymce-editor_ifr').setAttribute('scrolling', 'no');
            }
            _this.isEditorInitialised = true;
            if (htmlUtilities.isIPadDevice && htmlUtilities.getUserDevice().browser === 'Safari') {
                e.getWin().document.documentElement.addEventListener('touchend', _this.blockDoubleTapZoom);
                e.getWin().document.documentElement.addEventListener('touchstart', _this.blockPinchToZoom);
            }
        };
        this.onRemove = function (o, e) {
            if (htmlUtilities.isIPadDevice && htmlUtilities.getUserDevice().browser === 'Safari') {
                e.getWin().document.documentElement.removeEventListener('touchend', _this.blockDoubleTapZoom);
                e.getWin().document.documentElement.removeEventListener('touchstart', _this.blockPinchToZoom);
            }
        };
        /**
         * Simulate window click while clicking on tinyMCE editor to close opened priority drop down and user option panel.
         */
        this.onClick = function (o, e) {
            // we have to close opened priority drop down and user options (logout options) while clicking on outside that. TinyMCE editor was
            // preventing the click event to propagate outside so closing of those things are not happening while clicking on TinyMCE editor.
            var event = document.createEvent('MouseEvents');
            event.initMouseEvent('click', true, true, window, 0, 0, 0, 80, 20, false, false, false, false, 0, null);
            window.dispatchEvent(event);
        };
        this.onPaste = function (o, e) {
            // find the clipboard data from any possible (window.clipboarddata is for ie)
            var clipBoardData = (o.clipboardData || window.clipboardData ||
                (o.originalEvent && o.originalEvent.clipboardData));
            // set getdata argument - 'text' is only for ie11 and other device/browsers need 'text/plain'
            var getDataArgument = htmlUtilities.isIE11 ? 'text' : 'text/plain';
            // If you paste text into the editor with mouse by right- click
            // TinyMCE's onPaste event is fired, but text is not available via .getContent().
            // So that checking the clipboard data item when the user pasting the text via mouse by right- click.
            if (clipBoardData && clipBoardData.getData(getDataArgument).trim() !== '') {
                messageHelper.setPasteEnabledAction(true);
            }
            _this.props.toggleSaveButtonState();
        };
        /**
         * This method will enable the send button when hyperlink is added.
         */
        this.onSetContent = function (e) {
            _this.props.toggleSaveButtonState();
        };
        /**
         * This method will clear tinyMCE content
         */
        this.onMessagePanelClose = function () {
            _this.activeEditor.setContent('');
        };
        /**
         * This method will set focus to tinyMCE editor
         */
        this.setFocus = function () {
            if (_this.state.scriptLoaded) {
                if (_this.activeEditor && _this.isEditorInitialised && _this.props.hasFocus) {
                    // this will set dom focus to tinymce editor
                    _this.activeEditor.focus();
                }
            }
        };
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
    MessageEditor.prototype.componentDidMount = function () {
        messageStore.instance.addListener(messageStore.MessageStore.MESSAGE_CLOSE_EVENT, this.onMessagePanelClose);
        this.setFocus();
    };
    /**
     * Component will mount
     */
    MessageEditor.prototype.componentWillMount = function () {
        var url = htmlUtilities.getFullUrl(urls.TINYMCE_URL);
        // If tinyMCE script is not loaded then load that
        if (!htmlUtilities.isScriptLoaded(url)) {
            var script = document.createElement('script');
            script.src = url;
            script.async = true;
            script.onload = (this.dependenciesLoaded.bind(this));
            document.body.appendChild(script);
        }
        else {
            this.dependenciesLoaded();
        }
    };
    /**
     * component will unmount
     */
    MessageEditor.prototype.componentWillUnmount = function () {
        messageStore.instance.removeListener(messageStore.MessageStore.MESSAGE_CLOSE_EVENT, this.onMessagePanelClose);
        if (tinymce.get(this.props.id)) {
            tinymce.remove('#' + this.props.id);
        }
    };
    /**
     * Component did update
     */
    MessageEditor.prototype.componentDidUpdate = function () {
        this.setFocus();
    };
    /**
     * Render component
     */
    MessageEditor.prototype.render = function () {
        if (this.state.scriptLoaded) {
            var selectedLang = localeHelper.getAwardingBodyLocale(this.props.selectedLanguage);
            var editorConfig = {
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
                invalid_elements: 'embed'
            };
            return (React.createElement(TINYMCE, {content: this.props.htmlContent, id: this.props.id, theme: messageEditorConstants.TINYMCE_THEME, config: editorConfig, onKeyup: this.onKeyup, onPaste: this.onPaste, onInit: this.onEditorInit, onClick: this.onClick, onRemove: this.onRemove}));
        }
        else {
            //show loading icon if script is not loaded
            return (React.createElement("div", null));
        }
    };
    /**
     * Method to load dependencies
     */
    MessageEditor.prototype.dependenciesLoaded = function () {
        if (this.props.isTinyMCELoaded) {
            this.props.isTinyMCELoaded(true);
        }
        this.setState({ scriptLoaded: true });
    };
    Object.defineProperty(MessageEditor.prototype, "activeEditor", {
        /**
         * This method will return the active editor
         */
        get: function () {
            return tinymce.get(this.props.id);
        },
        enumerable: true,
        configurable: true
    });
    return MessageEditor;
}(pureRenderComponent));
module.exports = MessageEditor;
//# sourceMappingURL=messageeditor.js.map