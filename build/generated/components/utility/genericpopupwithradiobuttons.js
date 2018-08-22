"use strict";
var _this = this;
/*
  React component for Generic button.
*/
/* tslint:disable:no-unused-variable */
var React = require('react');
/**
 * React component class for Generic popup with radio buttons implementation.
 */
var genericPopupWithRadioButtons = function (props) {
    var that = _this;
    var toRender = (React.createElement("ul", {id: props.id, key: 'key_ul_genericpopup', className: props.className}, props.items && props.items.map(function (item) {
        return React.createElement("li", {id: 'li_genericpopup_' + item.id, className: props.liClassName, onClick: function () { props.onCheckedChange(item); }, key: 'key_li_genericpopup_' + item.id}, React.createElement("input", {checked: item.isChecked, type: 'radio', id: item.id.toString(), key: 'key_' + item.id, name: 'genericpopup'}), React.createElement("label", {htmlFor: item.id.toString()}, React.createElement("span", {className: 'radio-ui'}), React.createElement("span", {className: 'label-text'}, item.name), React.createElement("span", {className: 'label-text error'}, item.errorText)));
    })));
    return toRender;
};
module.exports = genericPopupWithRadioButtons;
//# sourceMappingURL=genericpopupwithradiobuttons.js.map