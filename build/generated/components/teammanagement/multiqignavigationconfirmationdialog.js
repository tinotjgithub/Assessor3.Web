"use strict";
var _this = this;
var React = require('react');
var classNames = require('classnames');
var GenericButton = require('../utility/genericbutton');
/**
 * React wrapper component for multi qig navigation confirmation dialog
 */
var multiQigNavigationConfirmationDialog = function (props) {
    return (React.createElement("div", {className: 'popup small popup-overlay close-button popup-open open', id: _this.id, role: 'dialog', "aria-labelledby": 'popup4Title', "aria-describedby": 'popup4Desc'}, React.createElement("div", {className: 'popup-wrap'}, React.createElement("div", {className: 'popup-header'}, React.createElement("h4", {id: 'multi-qig-navigation-header'}, props.header)), React.createElement("div", {className: 'popup-content', id: 'multi-qig-navigation-description'}, React.createElement("p", null, props.content)), React.createElement("div", {className: 'popup-footer text-right'}, React.createElement(GenericButton, {id: 'multi-qig-navigate-no-button', key: 'key_multi-qig-navigate-no-button', className: 'button rounded close-button primary', title: props.noButtonText, content: props.noButtonText, disabled: false, onClick: function () { props.onNoClick(); }}), React.createElement(GenericButton, {id: 'multi-qig-navigate-yes-button', key: 'key-multi-qig-navigate-yes-button', className: 'button rounded', title: props.yesButtonText, content: props.yesButtonText, disabled: false, onClick: function () { props.onYesClick(); }})))));
};
module.exports = multiQigNavigationConfirmationDialog;
//# sourceMappingURL=multiqignavigationconfirmationdialog.js.map