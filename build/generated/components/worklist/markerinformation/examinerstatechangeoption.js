"use strict";
var React = require('react');
/**
 * examinerStateChangeOption contains the available state for the examiner.
 * @param props
 */
var examinerStateChangeOption = function (props) {
    return (React.createElement("div", {className: 'approval-options'}, React.createElement("input", {type: 'radio', value: 'selected', onChange: function () { props.onSelectionChange(); }, id: props.id, name: 'changeStatus', checked: props.isChecked ? true : false}), React.createElement("label", {htmlFor: props.id}, React.createElement("span", {className: 'radio-ui'}), React.createElement("span", {className: 'label-text'}, props.stateText))));
};
module.exports = examinerStateChangeOption;
//# sourceMappingURL=examinerstatechangeoption.js.map