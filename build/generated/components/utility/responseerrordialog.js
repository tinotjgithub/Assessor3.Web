"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
/*
  React component for combined warning messages popup
*/
/* tslint:disable:no-unused-variable */
var React = require('react');
var pureRenderComponent = require('../base/purerendercomponent');
var enums = require('./enums');
/**
 * React component class for Header for Authorized pages
 */
var ResponseErrorDialog = (function (_super) {
    __extends(ResponseErrorDialog, _super);
    /**
     * constructor
     * @param props
     * @param state
     */
    function ResponseErrorDialog(props, state) {
        var _this = this;
        _super.call(this, props, state);
        /**
         * method on primary button click
         */
        this.onPrimaryButtonClick = function () {
            _this.props.onPrimaryButtonClick();
        };
        /**
         * method on secondary button click
         */
        this.onSecondaryButtonClick = function () {
            _this.props.onSecondaryButtonClick();
        };
        this.onPopupClick = this.onPopupClick.bind(this);
        this.onPopupNoClick = this.onPopupNoClick.bind(this);
    }
    /**
     * set all warning messages to show
     */
    ResponseErrorDialog.prototype.setAllWarningMessages = function () {
        var warningItems = null;
        if (this.props.responseNavigateFailureReasons && this.props.responseNavigateFailureReasons.length > 0) {
            warningItems = this.props.responseNavigateFailureReasons.map(function (warning) {
                return (React.createElement("li", {className: 'warning-item', id: warning.id, key: warning.id}, warning.message));
            });
        }
        return warningItems;
    };
    /**
     *  set the footer of popup
     */
    ResponseErrorDialog.prototype.setPopupFooter = function () {
        if (this.props.warningType === enums.WarningType.PreventLeaveInGraceResponse) {
            return (React.createElement("div", {className: 'popup-footer text-right', id: 'popupFooter'}, React.createElement("button", {className: 'button primary rounded', id: 'popupPrimaryButton', title: this.props.primaryButtonText, onClick: this.onPrimaryButtonClick}, this.props.primaryButtonText)));
        }
        else if (this.props.warningType === enums.WarningType.LeaveResponse ||
            this.props.warningType === enums.WarningType.SubmitResponse) {
            return (React.createElement("div", {className: 'popup-footer text-right', id: 'popupFooter'}, React.createElement("button", {className: 'button rounded', id: 'popupSecondaryButton', title: this.props.secondaryButtonText, onClick: this.onSecondaryButtonClick}, this.props.secondaryButtonText), React.createElement("button", {className: 'button primary rounded', id: 'popupPrimaryButton', title: this.props.primaryButtonText, onClick: this.onPrimaryButtonClick}, this.props.primaryButtonText)));
        }
    };
    /**
     * Render method
     */
    ResponseErrorDialog.prototype.render = function () {
        if (this.props.displayPopup) {
            return (React.createElement("div", {className: 'popup medium popup-overlay combined-warning-popup open', id: 'combinedWarning', role: 'dialog', "aria-labelledby": 'popup19Title', "aria-describedby": 'popup19Desc', onClick: this.onPopupNoClick}, React.createElement("div", {className: 'popup-wrap', onClick: this.onPopupClick}, React.createElement("div", {className: 'popup-header'}, React.createElement("h4", {id: 'popup19Title'}, this.props.header)), React.createElement("div", {className: 'popup-content', id: 'popup19Desc'}, React.createElement("p", {className: 'login-nav-msg padding-bottom-10', id: 'popupContent'}, this.props.content), React.createElement("ul", {className: 'combined-warnings', id: 'combinedWarnings'}, this.setAllWarningMessages())), this.setPopupFooter())));
        }
        else {
            return null;
        }
    };
    /**
     * Event fired on clicking popup
     * @param evnt
     */
    ResponseErrorDialog.prototype.onPopupClick = function (evnt) {
        evnt.stopPropagation();
        return false;
    };
    /**
     * Event fired on clicking 'No' of popup
     * @param evnt
     */
    ResponseErrorDialog.prototype.onPopupNoClick = function (evnt) {
        this.onPopupClick(evnt);
    };
    return ResponseErrorDialog;
}(pureRenderComponent));
module.exports = ResponseErrorDialog;
//# sourceMappingURL=responseerrordialog.js.map