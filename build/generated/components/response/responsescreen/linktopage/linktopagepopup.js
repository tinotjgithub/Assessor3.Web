"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
/* tslint:disable:no-unused-variable */
var React = require('react');
var Reactdom = require('react-dom');
var pureRenderComponent = require('../../../base/purerendercomponent');
var localeStore = require('../../../../stores/locale/localestore');
var treeViewDatahelper = require('../../../../utility/treeviewhelpers/treeviewdatahelper');
var enums = require('../../../utility/enums');
var moduleKeyHandler = require('../../../../utility/generic/modulekeyhandler');
var modulekeys = require('../../../../utility/generic/modulekeys');
var keyDownHelper = require('../../../../utility/generic/keydownhelper');
var responseStore = require('../../../../stores/response/responsestore');
var LinkToPageTreeNode = require('./linktopagetreenode');
var constants = require('../../../utility/constants');
/**
 * React component class for Link to question popup.
 */
var LinkToPagePopup = (function (_super) {
    __extends(LinkToPagePopup, _super);
    /**
     * Constructor
     * @param props
     * @param state
     */
    function LinkToPagePopup(props, state) {
        var _this = this;
        _super.call(this, props, state);
        this.isOkButtonFoussed = true;
        // flag to check if component rendered for the first time
        this.isRenderedForTheFirstTime = true;
        this.doShowHeader = false;
        /* called when the device orientation is changed */
        this.onOrientationChange = function () {
            if (_this.props.doOpen === true) {
                setTimeout(function () {
                    _this.setState({
                        renderedOn: Date.now()
                    });
                }, constants.LINK_TO_PAGE_POPUP_ANIMATION_TIME);
            }
        };
        /* called to unmount keyboard handler  */
        this.onClickHandler = function () {
            if (_this.props.isKeyBoardSupportEnabled) {
                // Unmount the event to give others the priority
                keyDownHelper.instance.unmountKeyHandler(modulekeys.POPUP_KEY_DOWN);
                // Unmount the event to give others the priority
                keyDownHelper.instance.unmountKeyHandler(modulekeys.POPUP_KEY_PRESS);
            }
        };
        /* reset treeNodes details, inorder to reconstruct the treeNode on response navigaion
           i.e from Whole response to single response and vice versa  */
        this.resetTreeNodes = function () {
            _this._treeNodes = undefined;
        };
        this._treeViewDatahelper = new treeViewDatahelper();
        this.onOrientationChange = this.onOrientationChange.bind(this);
        this.keyHandler = this.keyHandler.bind(this);
        this.state = {
            renderedOn: Date.now()
        };
    }
    /**
     * component did mount of link to page popup
     */
    LinkToPagePopup.prototype.componentDidMount = function () {
        window.addEventListener('orientationchange', this.onOrientationChange);
        responseStore.instance.addListener(responseStore.ResponseStore.RESPONSE_CHANGED, this.resetTreeNodes);
    };
    /**
     * component will unmount of link to page popup
     */
    LinkToPagePopup.prototype.componentWillUnmount = function () {
        window.removeEventListener('orientationchange', this.onOrientationChange);
        responseStore.instance.removeListener(responseStore.ResponseStore.RESPONSE_CHANGED, this.resetTreeNodes);
    };
    /**
     * renders the component
     */
    LinkToPagePopup.prototype.render = function () {
        if (this.props.isKeyBoardSupportEnabled) {
            var keyDownHandler = new moduleKeyHandler(modulekeys.POPUP_KEY_DOWN, enums.Priority.Second, true, this.keyHandler, enums.KeyMode.down);
            keyDownHelper.instance.mountKeyDownHandler(keyDownHandler);
            var keyPressHandler = new moduleKeyHandler(modulekeys.POPUP_KEY_PRESS, enums.Priority.Second, true, this.keyHandler, enums.KeyMode.press);
            keyDownHelper.instance.mountKeyPressHandler(keyPressHandler);
        }
        if (this.isRenderedForTheFirstTime && this.props.onLinkToPageOkClick) {
            this.isRenderedForTheFirstTime = false;
            return null;
        }
        if (!this._treeNodes && this.props.doOpen) {
            this._treeNodes = this._treeViewDatahelper.getMarkSchemeStructureNodeCollection();
        }
        var style = this.getStyle();
        return (React.createElement("div", {id: this.props.id, key: this.props.key, className: this.getClassName, role: 'dialog', "aria-describedby": 'Linkpage'}, React.createElement("div", {className: 'popup-wrap', id: 'linktopage-popupwrap', style: style}, this.getPopupHeader, this.getPopupContent, this.getPopupFooter)));
    };
    /**
     * return the style for the popup
     */
    LinkToPagePopup.prototype.getStyle = function () {
        var style;
        var popup = Reactdom.findDOMNode(this);
        if (popup === null || popup === undefined) {
            this.setState({
                renderedOn: Date.now()
            });
        }
        var popupWrap = document.getElementById('linktopage-popupwrap');
        if (popupWrap && (popupWrap.clientWidth + this.props.linkToPageButtonLeft > document.body.clientWidth)) {
            style = {
                right: 50,
                left: 'auto',
                width: popupWrap.clientWidth
            };
        }
        else if (popupWrap) {
            style = {
                left: this.props.linkToPageButtonLeft,
                width: popupWrap.clientWidth
            };
        }
        return style;
    };
    /**
     * Handle keydown.
     * @param {KeyboardEvent} event
     * @returns
     */
    LinkToPagePopup.prototype.keyHandler = function (event) {
        var key = event.keyCode || event.charCode;
        // Handling the tab key for toggling the yes and no button focus.
        if (key === enums.KeyCode.tab) {
            this.isOkButtonFoussed ? this.refs.cancelButton.focus() : this.refs.okButton.focus();
            this.isOkButtonFoussed = !this.isOkButtonFoussed;
        }
        // If enter key pressed firing action based on focused element.
        if (key === enums.KeyCode.enter) {
            if (this.isOkButtonFoussed) {
                this.props.onLinkToPageOkClick();
            }
            else {
                this.props.onLinkToPageCancelClick();
            }
        }
        else if (key === enums.KeyCode.backspace) {
            keyDownHelper.KeydownHelper.stopEvent(event);
            return true;
        }
        /** to disbale the response navigation on confirmation popups (reset marks and annotation) */
        if (key === enums.KeyCode.left || key === enums.KeyCode.right) {
            keyDownHelper.KeydownHelper.stopEvent(event);
        }
        return true;
    };
    Object.defineProperty(LinkToPagePopup.prototype, "getPopupHeader", {
        /* return the popup header */
        get: function () {
            if (!this.doShowHeader) {
                this.doShowHeader = true;
                this.setState({
                    renderedOn: Date.now()
                });
                return null;
            }
            else {
                var headerText = localeStore.instance.TranslateText('marking.full-response-view.page-linking-popup.header');
                return (React.createElement("div", {className: 'popup-header'}, React.createElement("p", {className: 'dim-text'}, headerText)));
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(LinkToPagePopup.prototype, "getPopupContent", {
        /* returns the popup content */
        get: function () {
            return (React.createElement("div", {className: 'popup-content', id: 'popupcontent'}, React.createElement("ul", {id: 'question-group-container', className: 'question-group-container expandable'}, this.getLinkToQuestionTreeNodes())));
        },
        enumerable: true,
        configurable: true
    });
    /**
     * construct the tree nodes to show in the popup
     */
    LinkToPagePopup.prototype.getLinkToQuestionTreeNodes = function () {
        if (this._treeNodes) {
            var counter_1 = 0;
            var that_1 = this;
            var nodes = this._treeNodes.treeViewItemList.map(function (node) {
                counter_1++;
                if (node.itemType === enums.TreeViewItemType.marksScheme) {
                    return null;
                }
                return React.createElement(LinkToPageTreeNode, {id: 'item' + counter_1.toString(), key: 'link_to_question_tree_node_key_' + counter_1.toString(), node: node, children: node.treeViewItemList, renderedOn: Date.now(), currentPageNumber: that_1.props.currentPageNumber, addLinkAnnotation: that_1.props.addLinkAnnotation, removeLinkAnnotation: that_1.props.removeLinkAnnotation});
            });
            return nodes;
        }
    };
    Object.defineProperty(LinkToPagePopup.prototype, "getPopupFooter", {
        /* returns the popup footer */
        get: function () {
            var _this = this;
            var cancelText = localeStore.instance.TranslateText('marking.full-response-view.page-linking-popup.ok-button');
            var okText = localeStore.instance.TranslateText('marking.full-response-view.page-linking-popup.cancel-button');
            return (React.createElement("div", {className: 'popup-footer text-right'}, React.createElement("button", {className: 'button rounded close-button', ref: 'cancelButton', onClick: function () { _this.props.onLinkToPageCancelClick(); _this.onClickHandler(); }, title: 'Cancel'}, cancelText), React.createElement("button", {className: 'button primary rounded', ref: 'okButton', onClick: function () { _this.props.onLinkToPageOkClick(); _this.onClickHandler(); }, title: 'Save'}, okText)));
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(LinkToPagePopup.prototype, "getClassName", {
        /* return the class name for the main popup wrapper*/
        get: function () {
            return 'popup small link-to-page-popup in-page-popout popup-overlay ' +
                (this.doShowPopup ? 'open' : 'close');
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(LinkToPagePopup.prototype, "doShowPopup", {
        /* determines if we need to open the link to question modal */
        get: function () {
            return this.props.doOpen;
        },
        enumerable: true,
        configurable: true
    });
    return LinkToPagePopup;
}(pureRenderComponent));
module.exports = LinkToPagePopup;
//# sourceMappingURL=linktopagepopup.js.map