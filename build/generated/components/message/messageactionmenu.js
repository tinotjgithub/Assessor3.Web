"use strict";
var React = require('react');
var enums = require('../utility/enums');
var classNames = require('classnames');
/* tslint:disable:variable-name */
var MenuItem = function (props) {
    return (React.createElement("li", {className: props.item.name + '-msg'}, React.createElement("a", {href: 'javascript:void(0)', onClick: function () { props.onClick(props.item.id); }, id: enums.getEnumString(enums.MessageAction, props.item.id).toLowerCase() + '-link'}, React.createElement("span", {className: 'sprite-icon ' + props.item.icon}, " ", props.item.name), " ", props.item.name, " ")));
};
var MenuList = function (props) { return (React.createElement("ul", {id: 'menu-action-items', className: 'msg-action-menu'}, props.items.map(function (item) { return React.createElement(MenuItem, {key: 'key-menu-lits-item-' + item.id, onClick: props.onClick, item: item}); }))); };
var MessageActionMenu = function (props) {
    if (props.items === undefined) {
        return null;
    }
    return (React.createElement("div", {className: 'col-6-of-12 msg-actions text-right'}, React.createElement(MenuList, {key: 'key-menu-list', items: props.items, onClick: props.onClick})));
};
module.exports = MessageActionMenu;
/* tslint:enable */ 
//# sourceMappingURL=messageactionmenu.js.map