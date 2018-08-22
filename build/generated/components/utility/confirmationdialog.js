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
var pureRenderComponent = require('../base/purerendercomponent');
var localeStore = require('../../stores/locale/localestore');
var userOptionsHelper = require('../../utility/useroption/useroptionshelper');
var userOptionKeys = require('../../utility/useroption/useroptionkeys');
var moduleKeyHandler = require('../../utility/generic/modulekeyhandler');
var modulekeys = require('../../utility/generic/modulekeys');
var keyDownHelper = require('../../utility/generic/keydownhelper');
var enums = require('./enums');
var constants = require('./constants');
var responseStore = require('../../stores/response/responsestore');
var stringHelper = require('../../utility/generic/stringhelper');
/**
 * React component class for Header for Authorized pages
 */
var ConfirmationDialog = (function (_super) {
    __extends(ConfirmationDialog, _super);
    /**
     * @constructor
     */
    function ConfirmationDialog(props, state) {
        var _this = this;
        _super.call(this, props, state);
        this.isYesButtonFocussed = true;
        this.allPageNotAnnotated = 'allPagenotAnnotated';
        this.markChangeReasonNeeded = 'MarkChangeReasonNeeded';
        /**
         * This method will return the popup type class based on text size
         */
        this.getClassName = function (yesButtonText, noButtonText) {
            var popupType = 'small';
            var yesButtonTextLength = yesButtonText.trim().length;
            var noButtonTextLength = noButtonText.trim().length;
            if (yesButtonTextLength >= constants.MEDIUM_POPUP_TEXT_SIZE || noButtonTextLength >= constants.MEDIUM_POPUP_TEXT_SIZE) {
                popupType = 'large';
            }
            else if ((yesButtonTextLength > constants.SMALL_POPUP_TEXT_SIZE && yesButtonTextLength < constants.MEDIUM_POPUP_TEXT_SIZE) ||
                (noButtonTextLength > constants.SMALL_POPUP_TEXT_SIZE && noButtonTextLength < constants.MEDIUM_POPUP_TEXT_SIZE)) {
                popupType = 'medium';
            }
            var popupClassName = 'popup ' + popupType + ' popup-overlay close-button popup-open open';
            return _this.props.dialogType ===
                enums.PopupDialogType.MbCReturnToWorklistConfirmation ?
                popupClassName + ' return-worklist' : popupClassName;
        };
        this.state = {
            isAskOnLogOutChecked: true
        };
        this.keyHandler = this.keyHandler.bind(this);
        this.onNoClick = this.onNoClick.bind(this);
        this.onPopupClick = this.onPopupClick.bind(this);
        this.onYesButtonBlur = this.onYesButtonBlur.bind(this);
        this.onYesClick = this.onYesClick.bind(this);
        this.onAskOnLogOutClick = this.onAskOnLogOutClick.bind(this);
    }
    /**
     * Render method
     */
    ConfirmationDialog.prototype.render = function () {
        if (this.props.displayPopup) {
            if (this.props.isKeyBoardSupportEnabled) {
                var keyDownHandler = new moduleKeyHandler(modulekeys.POPUP_KEY_DOWN, enums.Priority.Second, true, this.keyHandler, enums.KeyMode.down);
                keyDownHelper.instance.mountKeyDownHandler(keyDownHandler);
                var keyPressHandler = new moduleKeyHandler(modulekeys.POPUP_KEY_PRESS, enums.Priority.Second, true, this.keyHandler, enums.KeyMode.press);
                keyDownHelper.instance.mountKeyPressHandler(keyPressHandler);
            }
            switch (this.props.dialogType) {
                case enums.PopupDialogType.LogoutConfirmation:
                    this.id = 'logoutPopup';
                    break;
                case enums.PopupDialogType.MbCReturnToWorklistConfirmation:
                    this.id = 'mbCConfirmationDialog';
                    break;
                case enums.PopupDialogType.AllPageNotAnnotated:
                    this.id = 'allPagenotAnnotated';
                    break;
                case enums.PopupDialogType.MarkChangeReasonError:
                    this.id = 'MarkChangeReasonNeeded';
                    break;
                case enums.PopupDialogType.UnlockExaminerConfirmation:
                    this.id = 'UnlockExaminerConfirmation';
                    break;
                case enums.PopupDialogType.PromoteToSeedConfirmation:
                case enums.PopupDialogType.PromoteToSeedRemarkConfirmation:
                    this.id = 'promote-to-seed';
                    break;
                case enums.PopupDialogType.UnmanagedSLAOFlagAsSeen:
                    this.id = 'UnmanagedSLAOFlagAsSeen';
                    break;
                case enums.PopupDialogType.AllSLAOsManaged:
                    this.id = 'AllSLAOsManaged';
                    break;
                case enums.PopupDialogType.CompleteMarkingCheck:
                    this.id = 'CompleteMarkingCheck';
                    break;
                case enums.PopupDialogType.ReviewOfSLAOConfirmation:
                    this.id = 'reviewOfSLAOConfirmation';
                    break;
                case enums.PopupDialogType.SimulationResponseSubmitConfirmation:
                    this.id = 'SimulationResponseSubmitConfirmation';
                    break;
                case enums.PopupDialogType.UnknownContentFlagAsSeen:
                    this.id = 'UnknownContentFlagAsSeenConfirmation';
                    break;
                case enums.PopupDialogType.ShareConfirmationPopup:
                    this.id = 'ShareConfirmationPopup';
                    break;
                case enums.PopupDialogType.WholeResponseRemarkConfirmation:
                    this.id = 'WholeResponseRemarkConfirmation';
                    break;
                case enums.PopupDialogType.ReviewOfUnknownContentConfirmation:
                    this.id = 'ReviewOfUnknownContentConfirmation';
                    break;
            }
            return (React.createElement("div", {className: this.getClassName(this.props.yesButtonText, this.props.noButtonText), id: this.id, role: 'dialog', "aria-labelledby": 'popup4Title', "aria-describedby": 'popup4Desc'}, React.createElement("div", {className: 'popup-wrap', onClick: this.onPopupClick}, React.createElement("div", {className: 'popup-header'}, React.createElement("h4", {id: 'popup4Title'}, this.props.header)), React.createElement("div", {className: 'popup-content', id: 'popup14Desc'}, this.showRelevantContent(), this.showHideCheckbox()), React.createElement("div", {className: 'popup-footer text-right'}, React.createElement("button", {onClick: this.onNoClick, ref: 'noButton', className: 'button rounded close-button', title: this.props.noButtonText, onBlur: this.onYesButtonBlur}, this.props.noButtonText), React.createElement("button", {autoFocus: true, onClick: this.onYesClick, className: 'button primary rounded', ref: 'yesButton', onBlur: this.onYesButtonBlur, title: this.props.yesButtonText}, this.props.yesButtonText)))));
        }
        else {
            return null;
        }
    };
    /**
     * This function gets invoked when the component is about to be mounted
     */
    ConfirmationDialog.prototype.componentWillUnmount = function () {
        if (this.props.isKeyBoardSupportEnabled) {
            // Unmount the event to give others the priority
            keyDownHelper.instance.unmountKeyHandler(modulekeys.POPUP_KEY_DOWN);
            // Unmount the event to give others the priority
            keyDownHelper.instance.unmountKeyHandler(modulekeys.POPUP_KEY_PRESS);
            // Focus inside popup for discard Message/Exception popup - #48497
            if (this.props.dialogType === enums.PopupDialogType.Exception) {
                keyDownHelper.instance.DeActivate(enums.MarkEntryDeactivator.Exception);
            }
            else if (this.props.dialogType === enums.PopupDialogType.Message) {
                keyDownHelper.instance.DeActivate(enums.MarkEntryDeactivator.Messaging);
            }
        }
    };
    /**
     * This function gets invoked after the component is mounted.
     */
    ConfirmationDialog.prototype.componentDidMount = function () {
        if (this.props.isKeyBoardSupportEnabled) {
            // Focus inside popup for discard Message/Exception popup - #48497
            if (this.props.dialogType === enums.PopupDialogType.Exception) {
                keyDownHelper.instance.Activate(enums.MarkEntryDeactivator.Exception);
            }
            else if (this.props.dialogType === enums.PopupDialogType.Message) {
                keyDownHelper.instance.Activate(enums.MarkEntryDeactivator.Messaging);
            }
        }
    };
    /**
     *  This function gets invoked after the component is updated.
     */
    ConfirmationDialog.prototype.componentDidUpdate = function () {
        if (this.props.displayPopup === true) {
            /* Need to set focus for yes button when the popup shown*/
            this.isYesButtonFocussed = true;
        }
    };
    /**
     * Event fired on clicking 'No'
     * @param evnt
     */
    ConfirmationDialog.prototype.onNoClick = function (evnt) {
        if (this.props.isKeyBoardSupportEnabled) {
            // Unmount the event to give others the priority
            keyDownHelper.instance.unmountKeyHandler(modulekeys.POPUP_KEY_DOWN);
            // Unmount the event to give others the priority
            keyDownHelper.instance.unmountKeyHandler(modulekeys.POPUP_KEY_PRESS);
        }
        /** Should be true and rerender once the user changed (turn on) the ask on logout from panel and logging out */
        this.setState({ isAskOnLogOutChecked: true });
        this.props.onNoClick();
    };
    /**
     * Event fired on clicking 'Yes'
     * @param evnt
     */
    ConfirmationDialog.prototype.onYesClick = function (evnt) {
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
    ConfirmationDialog.prototype.onPopupClick = function (evnt) {
        evnt.stopPropagation();
        return false;
    };
    /**
     * Ask on log out check box click
     */
    ConfirmationDialog.prototype.onAskOnLogOutClick = function () {
        userOptionsHelper.save(userOptionKeys.ASK_ON_LOG_OUT, String(!this.state.isAskOnLogOutChecked), true);
        this.setState({ isAskOnLogOutChecked: !this.state.isAskOnLogOutChecked });
    };
    /**
     * show hide logout confirmation checkbox
     */
    ConfirmationDialog.prototype.showHideCheckbox = function () {
        var result;
        if (this.props.isCheckBoxVisible) {
            result = (React.createElement("div", {className: 'padding-top-30'}, React.createElement("input", {className: 'text-middle checkbox', id: 'askEveryTime', type: 'checkbox', ref: 'askEveryTime', autoFocus: true, checked: this.state.isAskOnLogOutChecked, onChange: this.onAskOnLogOutClick}), React.createElement("label", {className: 'text-middle', htmlFor: 'askEveryTime'}, localeStore.instance.TranslateText('generic.logout-dialog.ask-every-time'))));
        }
        else {
            result = undefined;
        }
        return result;
    };
    /**
     * Setting focus to first element.
     */
    ConfirmationDialog.prototype.onYesButtonBlur = function () {
        if (this.refs.askEveryTime !== undefined) {
            this.props.isCheckBoxVisible ? this.refs.askEveryTime.focus() : this.refs.noButton.focus();
        }
    };
    /**
     * Handle keydown.
     * @param {KeyboardEvent} event
     * @returns
     */
    ConfirmationDialog.prototype.keyHandler = function (event) {
        var key = event.keyCode || event.charCode;
        // Handling the tab key for toggling the yes and no button focus.
        if (key === enums.KeyCode.tab) {
            this.isYesButtonFocussed ? this.refs.noButton.focus() : this.refs.yesButton.focus();
            this.isYesButtonFocussed = !this.isYesButtonFocussed;
        }
        // If enter key pressed firing action based on focused element.
        if (key === enums.KeyCode.enter) {
            if (this.isYesButtonFocussed) {
                this.onYesClick(event);
            }
            else {
                this.onNoClick(event);
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
    /* tslint:disable:no-string-literal */
    /**
     * show relevant content for checkbox
     */
    ConfirmationDialog.prototype.showRelevantContent = function () {
        var result;
        if (this.props.dialogType === enums.PopupDialogType.PromoteToSeedRemarkConfirmation) {
            var i = 0;
            var indents = [];
            var promoteToSeedReturnData = responseStore.instance.promoteseedremarkrequestreturn;
            for (; i < Object.keys(promoteToSeedReturnData.promotedSeedMarkGroupIdRemarkIds).length; i++) {
                indents.push(React.createElement("div", null, React.createElement("span", {className: 'promote-seed-id table-cell'}, '6' + promoteToSeedReturnData.promotedSeedMarkGroupIdRemarkIds[Object.keys(promoteToSeedReturnData.promotedSeedMarkGroupIdRemarkIds)[i]]['displayId']), React.createElement("span", {className: 'promote-seed-desc table-cell'}, " - ", stringHelper.format(localeStore.instance.TranslateText(this.getDirectedRemarkLocaleKey(promoteToSeedReturnData.promotedSeedMarkGroupIdRemarkIds[Object.keys(promoteToSeedReturnData.promotedSeedMarkGroupIdRemarkIds)[i]]['remarkTypeId'])), [constants.NONBREAKING_HYPHEN_UNICODE]))));
            }
            result = (React.createElement("div", null, React.createElement("p", null, localeStore.instance.TranslateText('team-management.response.promote-to-seed-dialog.body-remarks-exist')), React.createElement("div", {className: 'padding-top-15 padding-bottom-15 promote-seed-info table'}, React.createElement("div", {className: 'promote-seed-item table-row'}, indents)), React.createElement("p", null, this.props.content)));
        }
        else {
            result = (React.createElement("p", null, this.props.content));
        }
        return result;
    };
    /* tslint:disable:no-string-literal */
    /**
     * Get the directed remark locale key according to the directed remark request type.
     * @param {enums.RemarkRequestType} remarkRequestType
     * @returns remark request key
     */
    ConfirmationDialog.prototype.getDirectedRemarkLocaleKey = function (remarkRequestType) {
        return 'generic.remark-types.long-names.' + enums.RemarkRequestType[remarkRequestType];
    };
    return ConfirmationDialog;
}(pureRenderComponent));
module.exports = ConfirmationDialog;
//# sourceMappingURL=confirmationdialog.js.map