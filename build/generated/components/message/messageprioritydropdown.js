"use strict";
var React = require('react');
var classNames = require('classnames');
var localeStore = require('../../stores/locale/localestore');
/* tslint:disable:variable-name */
var ListItem = function (props) {
    return React.createElement("li", {role: 'menuitem'}, React.createElement("a", {href: 'javascript:void(0)', onClick: function () { props.onSelect(props.item.id); }}, props.item.name));
};
var List = function (props) { return (React.createElement("ul", {id: props.id + '_drop-down-items', className: 'menu', role: 'menu', title: localeStore.instance.TranslateText('messaging.compose-message.priority.priority-tooltip'), "aria-hidden": 'true'}, props.items.map(function (item) { return (item !== null) ?
    (React.createElement(ListItem, {key: 'key_drop_down_' + item.id, onSelect: props.onSelect, item: item})) :
    null; }))); };
var DropDown = function (props) {
    return (React.createElement("div", {id: props.id + '_dropdown', className: classNames(props.className, { 'open': props.isOpen }, { 'close': props.isOpen === undefined ? false : !props.isOpen }), onClick: function () { props.onClick(props.dropDownType); }}, React.createElement("a", {href: 'javascript:void(0)', id: props.id + '_component', className: 'menu-button'}, React.createElement("span", {id: props.id + '_items'}, " ", props.selectedItem, " "), React.createElement("span", {className: 'sprite-icon menu-arrow-icon'})), React.createElement(List, {id: props.id, key: 'key_drop_down_items', onSelect: props.onSelect, items: props.items})));
};
module.exports = DropDown;
/* tslint:enable */ 
//# sourceMappingURL=messageprioritydropdown.js.map