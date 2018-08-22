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
var classNames = require('classnames');
var enums = require('../utility/enums');
var ErrorDialogBase = require('./errordialogbase');
/**
 * React component class for Header for Authorized pages
 */
var ErrorDialog = (function (_super) {
    __extends(ErrorDialog, _super);
    /**
     * Constructor ErrorDialog
     * @param props
     * @param state
     */
    function ErrorDialog(props, state) {
        _super.call(this, props, state);
        this.state = {
            isViewMoreOpen: enums.Tristate.notSet
        };
        this.onOkClick = this.onOkClick.bind(this);
    }
    /**
     * Render
     */
    ErrorDialog.prototype.render = function () {
        if (this.props.isOpen) {
            return (React.createElement("div", {id: 'errorPopup', role: 'dialog', "aria-labelledby": 'popup5Title', "aria-describedby": 'popup5Desc', className: classNames('popup small popup-overlay close-button error-popup', {
                'open': this.props.isOpen,
                'close': !this.props.isOpen
            })}, React.createElement("div", {className: 'popup-wrap'}, this.renderErrorDialogHeader(), this.renderContent(), this.renderOKButton())));
        }
        else {
            return null;
        }
    };
    /**
     * To render the content of error dialog
     */
    ErrorDialog.prototype.renderContent = function () {
        return (React.createElement("div", {className: 'popup-content', id: 'popup5Desc'}, React.createElement("div", {className: classNames({
            'indented': this.props.showErrorIcon
        })}, React.createElement("p", null, this.props.content)), this.renderMoreInfo()));
    };
    return ErrorDialog;
}(ErrorDialogBase));
module.exports = ErrorDialog;
//# sourceMappingURL=errordialog.js.map