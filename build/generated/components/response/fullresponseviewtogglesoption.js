"use strict";
var React = require('react');
var localeStore = require('../../stores/locale/localestore');
var responseActionCreator = require('../../actions/response/responseactioncreator');
/**
 * Only show unannotated pages option component
 * @param props
 */
var frvTogglerOption = function (props) {
    /**
     * Handles the change event of the option button.
     * @param event
     */
    var handleChange = function (event) {
        props.frvTogglerOptionChanged(!props.frvTogglerOptionSelected);
        // Hide the highlighted page option whenever a toggle change happen
        responseActionCreator.hidePageOptionButton();
    };
    return (React.createElement("div", {className: 'frv-toggler shift-right'}, React.createElement("span", {id: 'frv-toggler-label', className: 'frv-toggler-label'}, props.labelOfToggleButton), React.createElement("div", {className: 'toggle-button', id: 'toggle-button', "aria-pressed": 'false'}, React.createElement("input", {type: 'checkbox', id: 'unannotatedPages', checked: props.frvTogglerOptionSelected, onChange: handleChange, "data-value": props.frvTogglerOptionSelected}), React.createElement("label", {id: 'un-annotated-pages-label', className: 'toggle-label', title: props.toolTipOfToggleButton, htmlFor: 'unannotatedPages'}, React.createElement("div", {id: 'frv-toggle-content', className: 'toggle-content'}, React.createElement("div", {id: 'frv-toggle-on-text', className: 'on-text'}, localeStore.instance.TranslateText('generic.toggle-button-states.on')), React.createElement("div", {id: 'frv-toggle-off-text', className: 'off-text'}, localeStore.instance.TranslateText('generic.toggle-button-states.off'))), React.createElement("div", {id: 'frv-toggle-switch', className: 'toggle-switch'})))));
};
module.exports = frvTogglerOption;
//# sourceMappingURL=fullresponseviewtogglesoption.js.map