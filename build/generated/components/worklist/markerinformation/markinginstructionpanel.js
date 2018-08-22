"use strict";
var React = require('react');
var localeStore = require('../../../stores/locale/localestore');
var markingInstructionStore = require('../../../stores/markinginstruction/markinginstructionstore');
var classNames = require('classnames');
/**
 * MarkingInstructionPanel class
 * @param {any} any
 * @param {any} any
 * @returns
 */
var markingInstructionPanel = function (props) {
    /**
     * Fire On Clicking MarkInstruction File
     * @param {any} source - The source element
     */
    function onMarkInstructionFileClick(documementId) {
        props.onMarkInstructionFileClick(documementId);
    }
    /**
     * Fire On Clicking Mark InstructionPanel Click
     * @param {any} source - The source element
     */
    function onMarkInstructionPanelClick() {
        props.onMarkInstructionPanelClick();
    }
    var markingInstructionDropDownTriangle = markingInstructionStore.instance.markingInstructionList &&
        markingInstructionStore.instance.markingInstructionList.size > 1 ?
        (React.createElement("span", {id: 'sprite-icon toolexpand-icon', className: 'sprite-icon toolexpand-icon'})) : null;
    /**
     * Render component
     */
    return (React.createElement("div", {id: props.id, className: 'marking-instruction-holder'}, React.createElement("a", {id: 'markinginstructionlink', href: 'javascript:void(0);', onClick: onMarkInstructionPanelClick}, React.createElement("span", {id: 'info-icon-blue sprite-icon', className: 'info-icon-blue sprite-icon'}), React.createElement("span", {id: 'link-text', className: 'link-text'}, localeStore.instance.TranslateText('marking.worklist.left-panel.marking-instructions')), markingInstructionDropDownTriangle)));
};
module.exports = markingInstructionPanel;
//# sourceMappingURL=markinginstructionpanel.js.map