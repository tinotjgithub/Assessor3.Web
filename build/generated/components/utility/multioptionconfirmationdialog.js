"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
/*
  React component for Confirmation Popup
*/
/* tslint:disable:no-unused-variable */
var React = require('react');
/* tslint:disable:no-unused-variable */
var classNames = require('classnames');
var pureRenderComponent = require('../base/purerendercomponent');
var moduleKeyHandler = require('../../utility/generic/modulekeyhandler');
var modulekeys = require('../../utility/generic/modulekeys');
var keyDownHelper = require('../../utility/generic/keydownhelper');
var enums = require('./enums');
/**
 * React component class for Header for Authorized pages
 */
var MultiOptionConfirmationDialog = (function (_super) {
    __extends(MultiOptionConfirmationDialog, _super);
    /**
     * @constructor
     */
    function MultiOptionConfirmationDialog(props) {
        _super.call(this, props, null);
        this.isYesButtonFoussed = true;
        this.keyHandler = this.keyHandler.bind(this);
        this.onCancelClick = this.onCancelClick.bind(this);
        this.onPopupNoClick = this.onPopupNoClick.bind(this);
        this.onYesClick = this.onYesClick.bind(this);
        this.onNoClick = this.onNoClick.bind(this);
    }
    /**
     * Render method
     */
    MultiOptionConfirmationDialog.prototype.render = function () {
        if (this.props.displayPopup) {
            if (this.props.isKeyBoardSupportEnabled) {
                var keyDownHandler = new moduleKeyHandler(modulekeys.POPUP_KEY_DOWN, enums.Priority.Second, true, this.keyHandler, enums.KeyMode.down);
                keyDownHelper.instance.mountKeyDownHandler(keyDownHandler);
                var keyPressHandler = new moduleKeyHandler(modulekeys.POPUP_KEY_PRESS, enums.Priority.Second, true, this.keyHandler, enums.KeyMode.press);
                keyDownHelper.instance.mountKeyPressHandler(keyPressHandler);
            }
            var prefix = void 0;
            switch (this.props.popupType) {
                case enums.PopUpType.AtypicalSearch:
                    prefix = 'atypicalSearch';
                    break;
                case enums.PopUpType.SelectToMarkAsProvisional:
                    prefix = 'selectToMark';
                    break;
                case enums.PopUpType.ReclassifyMultiOption:
                    prefix = 'ReclassifyMultiOption';
                    break;
                case enums.PopUpType.ShareResponse:
                    prefix = 'shareResponse';
                    break;
                default:
                    break;
            }
            var noButtonEl = void 0;
            if (this.props.displayNoButton) {
                noButtonEl = (React.createElement("button", {autoFocus: false, onClick: this.onNoClick, id: 'popup_' + prefix + 'Messge_move_to_worklist_button', className: 'button rounded', ref: 'yesButton'}, this.props.buttonNoText));
            }
            return (React.createElement("div", {className: classNames('popup popup-overlay close-button popup-open open', enums.getEnumString(enums.PopupSize, this.props.popupSize).toLowerCase()), id: this.id, role: 'dialog', "aria-labelledby": 'popup4Title', "aria-describedby": 'popup4Desc', onClick: this.onPopupNoClick}, React.createElement("div", {className: 'popup-wrap', onClick: this.onPopupClick}, React.createElement("div", {className: 'popup-header bold-header-txt'}, React.createElement("h4", {id: 'popup4Title'}, this.props.header)), React.createElement("div", {className: 'popup-content content-with-radio-btn', id: 'popup14Desc', key: 'popup14Desc'}, this.props.content), React.createElement("div", {className: 'popup-footer text-right'}, React.createElement("button", {onClick: this.onCancelClick, id: 'popup_' + prefix + 'Messge_cancel_button', ref: 'noButton', className: 'button rounded close-button'}, this.props.buttonCancelText), noButtonEl, React.createElement("button", {autoFocus: true, onClick: this.onYesClick, id: 'popup_' + prefix + 'Messge_mark_now_button', className: 'button primary rounded', ref: 'yesButton'}, this.props.buttonYesText)))));
        }
        else {
            return null;
        }
    };
    /**
     * This function gets invoked when the component is about to be mounted
     */
    MultiOptionConfirmationDialog.prototype.componentWillUnmount = function () {
        if (this.props.isKeyBoardSupportEnabled) {
            // Unmount the event to give others the priority
            keyDownHelper.instance.unmountKeyHandler(modulekeys.POPUP_KEY_DOWN);
            // Unmount the event to give others the priority
            keyDownHelper.instance.unmountKeyHandler(modulekeys.POPUP_KEY_PRESS);
        }
    };
    /**
     * Event fired on clicking 'No'
     * @param evnt
     */
    MultiOptionConfirmationDialog.prototype.onCancelClick = function (evnt) {
        if (this.props.isKeyBoardSupportEnabled) {
            // Unmount the event to give others the priority
            keyDownHelper.instance.unmountKeyHandler(modulekeys.POPUP_KEY_DOWN);
            // Unmount the event to give others the priority
            keyDownHelper.instance.unmountKeyHandler(modulekeys.POPUP_KEY_PRESS);
        }
        /** Should be true and rerender once the user changed (turn on) the ask on logout from panel and logging out */
        this.setState({ isAskOnLogOutChecked: true });
        this.props.onCancelClick();
    };
    /**
     * Event fired on clicking 'Yes'
     * @param evnt
     */
    MultiOptionConfirmationDialog.prototype.onNoClick = function (evnt) {
        if (this.props.isKeyBoardSupportEnabled) {
            // Unmount the event to give others the priority
            keyDownHelper.instance.unmountKeyHandler(modulekeys.POPUP_KEY_DOWN);
            // Unmount the event to give others the priority
            keyDownHelper.instance.unmountKeyHandler(modulekeys.POPUP_KEY_PRESS);
        }
        this.props.onNoClick();
    };
    /**
     * Event fired on clicking 'MarkNow'
     * @param evnt
     */
    MultiOptionConfirmationDialog.prototype.onYesClick = function (evnt) {
        if (this.props.isKeyBoardSupportEnabled) {
            // Unmount the event to give others the priority
            keyDownHelper.instance.unmountKeyHandler(modulekeys.POPUP_KEY_DOWN);
            // Unmount the event to give others the priority
            keyDownHelper.instance.unmountKeyHandler(modulekeys.POPUP_KEY_PRESS);
        }
        this.props.onYesClick();
    };
    /**
     * Event fired on clicking popup
     * @param evnt
     */
    MultiOptionConfirmationDialog.prototype.onPopupClick = function (evnt) {
        evnt.stopPropagation();
        return false;
    };
    /**
     * Event fired on clicking 'No' of popup
     * @param evnt
     */
    MultiOptionConfirmationDialog.prototype.onPopupNoClick = function (evnt) {
        this.onPopupClick(evnt);
    };
    /**
     * Handle keydown.
     * @param {KeyboardEvent} event
     * @returns
     */
    MultiOptionConfirmationDialog.prototype.keyHandler = function (event) {
        var key = event.keyCode || event.charCode;
        // Handling the tab key for toggling the yes and no button focus.
        if (key === enums.KeyCode.tab) {
            this.isYesButtonFoussed ? this.refs.noButton.focus() : this.refs.yesButton.focus();
            this.isYesButtonFoussed = !this.isYesButtonFoussed;
        }
        // If enter key pressed firing action based on focused element.
        if (key === enums.KeyCode.enter) {
            if (this.isYesButtonFoussed) {
                this.onNoClick(event);
            }
            else {
                this.onCancelClick(event);
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
    return MultiOptionConfirmationDialog;
}(pureRenderComponent));
module.exports = MultiOptionConfirmationDialog;
//# sourceMappingURL=multioptionconfirmationdialog.js.map