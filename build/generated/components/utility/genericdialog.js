"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
/*
  React component for Generic dialog popup
*/
/* tslint:disable:no-unused-variable */
var React = require('react');
var pureRenderComponent = require('../base/purerendercomponent');
var enums = require('./enums');
var moduleKeyHandler = require('../../utility/generic/modulekeyhandler');
var modulekeys = require('../../utility/generic/modulekeys');
var keyDownHelper = require('../../utility/generic/keydownhelper');
/**
 * React component class for Header for Authorized pages
 */
var GenericDialog = (function (_super) {
    __extends(GenericDialog, _super);
    /**
     * constructor
     * @param props
     * @param state
     */
    function GenericDialog(props, state) {
        _super.call(this, props, state);
        this.onOkClick = this.onOkClick.bind(this);
        this.onPopupClick = this.onPopupClick.bind(this);
    }
    /**
     * Render method
     */
    GenericDialog.prototype.render = function () {
        if (this.props.displayPopup) {
            var outerDivClassName = null;
            var content = null;
            var header = (React.createElement("div", {className: 'popup-header'}, React.createElement("h4", {id: 'popup_' + this.props.id + '_header'}, this.props.header)));
            var buttonElement = (React.createElement("button", {className: 'primary button rounded close-button', onClick: this.onOkClick, autoFocus: true, title: this.props.okButtonText, id: 'popup_' + this.props.id + '_ok_button'}, this.props.okButtonText));
            if (this.props.popupDialogType) {
                // Attaching key handlers.
                this.attachKeyHandler();
            }
            switch (this.props.popupDialogType) {
                case enums.PopupDialogType.none:
                case enums.PopupDialogType.StandardisationApproved:
                case enums.PopupDialogType.GracePeriodWarning:
                case enums.PopupDialogType.GenericMessage:
                    outerDivClassName = 'popup medium popup-overlay std-approved open';
                    content = (React.createElement("div", {className: 'popup-content', id: 'popup_' + this.props.id + '_description'}, React.createElement("p", null, this.props.content), React.createElement("br", null), React.createElement("p", null, this.props.secondaryContent)));
                    break;
                case enums.PopupDialogType.ResponseAllocationError:
                case enums.PopupDialogType.EmailSave:
                case enums.PopupDialogType.ManageSLAO:
                    outerDivClassName = 'popup small popup-overlay close-button popup-open open';
                    content = (React.createElement("div", {className: 'popup-content', id: 'popup_' + this.props.id + '_description'}, React.createElement("p", null, this.props.content)));
                    break;
                case enums.PopupDialogType.AllPageNotAnnotated:
                case enums.PopupDialogType.MarkEntryValidation:
                case enums.PopupDialogType.RemarkCreated:
                case enums.PopupDialogType.PromoteToSeedDeclined:
                case enums.PopupDialogType.SubmitResponseError:
                    outerDivClassName = 'popup small popup-overlay close-button popup-open open';
                    content = (React.createElement("div", {className: 'popup-content', id: 'popup_' + this.props.id + '_description'}, React.createElement("p", null, this.props.content)));
                    break;
                case enums.PopupDialogType.NonRecoverableDetailedError:
                    outerDivClassName = 'popup small popup-overlay close-button error-popup open';
                    header = (React.createElement("div", {className: 'popup-header iconic-header'}, React.createElement("span", {className: 'error-big-icon sprite-icon'}), React.createElement("h4", {id: 'popup_' + this.props.id + '_header', className: 'inline-block'}, this.props.header)));
                    var multiLineItems = null;
                    if (this.props.multiLineContent && this.props.multiLineContent.length > 0) {
                        multiLineItems = this.props.multiLineContent.map(function (rowItem) {
                            return (React.createElement("li", null, rowItem));
                        });
                    }
                    content = (React.createElement("div", {className: 'popup-content', id: 'popup_' + this.props.id + '_description'}, React.createElement("p", null, this.props.content), React.createElement("ul", {className: 'bolder'}, multiLineItems)));
                    break;
                case enums.PopupDialogType.QualityFeedbackWarning:
                    outerDivClassName = 'popup small popup-overlay quality-feedback open';
                    content = (React.createElement("div", {className: 'popup-content', id: 'popup_' + this.props.id + '_description'}, React.createElement("p", null, this.props.content)));
                    break;
                case enums.PopupDialogType.OffLineWarning:
                    outerDivClassName = 'popup small popup-overlay close-button error-popup open';
                    header = (React.createElement("div", {className: 'popup-header iconic-header'}, React.createElement("span", {className: 'error-big-icon sprite-icon'}), React.createElement("h4", {id: 'popup_' + this.props.id + '_header', className: 'inline-block'}, this.props.header)));
                    content = (React.createElement("div", {className: 'popup-content', id: 'popup_' + this.props.id + '_description'}, React.createElement("p", null, this.props.content)));
                    break;
                case enums.PopupDialogType.OffLineWarningOnContainerFailure:
                    outerDivClassName = 'popup small popup-overlay close-button error-popup open';
                    header = (React.createElement("div", {className: 'popup-header iconic-header'}, React.createElement("span", {className: 'error-big-icon sprite-icon'}), React.createElement("h4", {id: 'popup_' + this.props.id + '_header', className: 'inline-block'}, this.props.header)));
                    content = (React.createElement("div", {className: 'popup-content', id: 'popup_' + this.props.id + '_description'}, React.createElement("p", null, this.props.content)));
                    buttonElement = null;
                    break;
                case enums.PopupDialogType.ResponseAlreadyReviewed:
                    outerDivClassName = 'popup medium popup-overlay open';
                    header = (React.createElement("div", {className: 'popup-header'}, React.createElement("h4", {id: 'popup_' + this.props.id + '_header', className: 'inline-block border-right'}, this.props.header)));
                    content = (React.createElement("div", {className: 'popup-content', id: 'popup_' + this.props.id + '_description'}, React.createElement("p", null, this.props.content)));
                    break;
                case enums.PopupDialogType.RemoveLinkError:
                    content = (React.createElement("div", {className: 'popup-content', id: 'popup_' + this.props.id + '_description'}, React.createElement("p", null, this.props.content), React.createElement("br", null), this.getContentOfList()));
                    outerDivClassName = 'popup medium popup-overlay open';
                    header = (React.createElement("div", {className: 'popup-header'}, React.createElement("h4", {id: 'popup_' + this.props.id + '_header', className: 'inline-block border-right'}, this.props.header)));
                    break;
                case enums.PopupDialogType.SimulationExited:
                    outerDivClassName = 'popup medium popup-overlay move-simulation-popup fixed-hf open';
                    header = (React.createElement("div", {className: 'popup-header'}, React.createElement("h4", {id: 'popup_' + this.props.id + '_Title'}, this.props.header)));
                    content = (React.createElement("div", {className: 'popup-content', id: 'popup_' + this.props.id + '_Desc'}, React.createElement("p", {className: 'login-nav-msg padding-bottom-10'}, this.props.secondaryContent), React.createElement("div", {className: 'qig-moved-wrapper'}, this.getSimulationExitedQigsContent()), React.createElement("p", {className: 'padding-top-10'}, this.props.footerContent)));
                    break;
                case enums.PopupDialogType.ReclassifyError:
                    outerDivClassName = 'popup medium popup-overlay open';
                    content = (React.createElement("div", {className: 'popup-content', id: 'popup_' + this.props.id + '_description'}, React.createElement("p", null, this.props.content)));
                    break;
                case enums.PopupDialogType.DiscardResponse:
                    outerDivClassName = 'popup medium popup-overlay open';
                    content = (React.createElement("div", {className: 'popup-content', id: 'popup_' + this.props.id + '_description'}, React.createElement("p", null, this.props.content)));
                    break;
            }
            return (React.createElement("div", {className: outerDivClassName, id: 'popup_' + this.props.id, role: 'dialog', "aria-labelledby": 'popup_' + this.props.id + '_header', "aria-describedby": 'popup_' + this.props.id + '_description', onClick: this.onPopupClick}, React.createElement("div", {className: 'popup-wrap', onClick: this.onPopupClick}, header, content, React.createElement("div", {className: 'popup-footer text-right'}, buttonElement))));
        }
        else {
            return null;
        }
    };
    /**
     * return the list as content for the popup
     */
    GenericDialog.prototype.getContentOfList = function () {
        if (this.props.listOfContents) {
            var content = this.props.listOfContents.map(function (item) {
                return (React.createElement("p", null, item));
            });
            return content;
        }
        else {
            return null;
        }
    };
    /**
     * Invoking the onOkClick call back event
     * @param evnt
     */
    GenericDialog.prototype.onOkClick = function (evnt) {
        if (this.props.onOkClick) {
            if (this.props.popupDialogType === enums.PopupDialogType.MarkEntryValidation ||
                this.props.popupDialogType === enums.PopupDialogType.GracePeriodWarning ||
                this.props.popupDialogType === enums.PopupDialogType.RemarkCreated ||
                this.props.popupDialogType === enums.PopupDialogType.PromoteToSeedDeclined ||
                this.props.popupDialogType === enums.PopupDialogType.GenericMessage ||
                this.props.popupDialogType === enums.PopupDialogType.ManageSLAO ||
                this.props.popupDialogType === enums.PopupDialogType.ResponseAllocationError ||
                this.props.popupDialogType === enums.PopupDialogType.OffLineWarning) {
                // Unmount the event to give others the priority
                keyDownHelper.instance.unmountKeyHandler(modulekeys.POPUP_KEY_DOWN);
                // Unmount the event to give others the priority
                keyDownHelper.instance.unmountKeyHandler(modulekeys.POPUP_KEY_PRESS);
            }
            this.props.onOkClick();
        }
    };
    /**
     * On clicking on the popup dialog
     * @param evnt
     */
    GenericDialog.prototype.onPopupClick = function (evnt) {
        evnt.stopPropagation();
        return false;
    };
    /**
     * Handle keydown.
     * @param {KeyboardEvent} event
     * @returns
     */
    GenericDialog.prototype.keyHandler = function (event) {
        var key = event.keyCode || event.charCode;
        if (key === enums.KeyCode.enter) {
            this.onOkClick(event);
        }
        else if (key === enums.KeyCode.backspace) {
            keyDownHelper.KeydownHelper.stopEvent(event);
            return true;
        }
        return true;
    };
    /**
     * Attaching key handlers.
     */
    GenericDialog.prototype.attachKeyHandler = function () {
        var keyDownHandler;
        var keyPressHandler;
        keyDownHandler = new moduleKeyHandler(modulekeys.POPUP_KEY_DOWN, enums.Priority.Second, true, this.keyHandler.bind(this), enums.KeyMode.down);
        keyDownHelper.instance.mountKeyDownHandler(keyDownHandler);
        keyPressHandler = new moduleKeyHandler(modulekeys.POPUP_KEY_PRESS, enums.Priority.Second, true, this.keyHandler.bind(this), enums.KeyMode.press);
        keyDownHelper.instance.mountKeyPressHandler(keyPressHandler);
    };
    /**
     * Get contents of simulation exited qigs
     */
    GenericDialog.prototype.getSimulationExitedQigsContent = function () {
        if (this.props.content === null) {
            var qigNames = new Array();
            qigNames = this.props.multiLineContent;
            var toRender = qigNames.map(function (_qig, index) {
                return (React.createElement("div", {className: 'qig-moved', key: 'qig-moved-' + index.toString()}, _qig));
            });
            return toRender;
        }
        else {
            return (React.createElement("div", {className: 'qig-moved'}, this.props.content));
        }
    };
    return GenericDialog;
}(pureRenderComponent));
module.exports = GenericDialog;
//# sourceMappingURL=genericdialog.js.map