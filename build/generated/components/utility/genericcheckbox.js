"use strict";
var React = require('react');
/**
 * generic check box component.
 * @param props
 */
var genericCheckbox = function (props) {
    return (React.createElement("div", {className: props.containerClassName}, React.createElement("input", {type: 'checkbox', id: props.id, className: props.className, checked: props.isChecked, disabled: props.disabled, onChange: function () { props.onSelectionChange(); }}), React.createElement("label", {htmlFor: props.id, className: props.labelClassName}, props.labelContent)));
};
module.exports = genericCheckbox;
//# sourceMappingURL=genericcheckbox.js.map