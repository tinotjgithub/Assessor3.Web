"use strict";
var React = require('react');
var classNames = require('classnames');
var localeStore = require('../../stores/locale/localestore');
/**
 * Stateless NRButton component
 */
/* tslint:disable:variable-name */
var NRButton = function (props) {
    return (React.createElement("div", {id: 'nr-btn-holder', className: 'nr-btn-holder'}, React.createElement("button", {id: 'nr-btn-holder', className: classNames('primary nr-button shift-left', { 'hide': props.isDisabled }), onClick: function (e) { return props.onNRButtonClick(e); }}, localeStore.instance.TranslateText('marking.response.mark-scheme-panel.no-response'))));
};
module.exports = NRButton;
//# sourceMappingURL=nrbutton.js.map