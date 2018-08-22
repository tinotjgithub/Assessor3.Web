"use strict";
var _this = this;
var React = require('react');
var localeStore = require('../../stores/locale/localestore');
var classNames = require('classnames');
/* tslint:disable:variable-name */
var DropDownException = function (props) {
    var isOpen = props.isOpen ? 'open' : 'close';
    var description = '';
    var checkBox = React.createElement("input", {type: 'radio', "aria-label": 'exception', value: 'selected', id: 'exceptionType' + props.id, key: props.id, name: 'exceptionType', checked: props.isChecked});
    if (props.isDisabled) {
        checkBox = React.createElement("input", {type: 'radio', "aria-label": 'exception', value: 'selected', id: 'exceptionType' + props.id, key: props.id, name: 'exceptionType', disabled: true});
    }
    if (props.description === '') {
        description = localeStore.instance.TranslateText('generic.exception-types.' + props.id + '.details');
    }
    else {
        description = props.description;
    }
    return (React.createElement("div", {className: 'exception-type-menu-item menu-item panel ' + isOpen, role: 'menuitem'}, checkBox, React.createElement("label", {onClick: props.onClick.bind(_this, props.id, props.isDisabled)}, React.createElement("span", {className: 'radio-ui'}), React.createElement("span", {className: 'label-text'}, localeStore.instance.TranslateText('generic.exception-types.' + props.id + '.name'))), React.createElement("span", {className: 'sprite-icon info-round-icon panel-link', onClick: props.showExceptionDesc.bind(_this, props.id, isOpen)}), React.createElement("div", {className: 'menu-callout'}), React.createElement("div", {className: 'panel-content exception-type-info padding-all-15', "aria-hidden": 'true'}, React.createElement("div", {className: 'info-item'}, description), React.createElement("div", {className: 'info-item'}, props.blockerDescription))));
};
module.exports = DropDownException;
/* tslint:enable */ 
//# sourceMappingURL=dropdownexception.js.map