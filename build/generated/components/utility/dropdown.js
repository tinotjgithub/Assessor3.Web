"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var React = require('react');
var classNames = require('classnames');
var pureRenderComponent = require('../base/purerendercomponent');
/* tslint:disable:variable-name */
var ListItem = function (props) {
    return React.createElement("li", {role: 'menuitem'}, React.createElement("a", {href: 'javascript:void(0)', onClick: function () { props.onSelect(props.item.id); }}, props.item.name));
};
var List = function (props) { return (React.createElement("ul", {id: 'drop-down-items', className: 'menu', role: 'menu', title: '', "aria-hidden": 'true', style: props.style}, props.items.map(function (item) { return React.createElement(ListItem, {key: 'key_drop_down_' + item.id, onSelect: props.onSelect, item: item}); }))); };
/* tslint:enable */
var DropDown = (function (_super) {
    __extends(DropDown, _super);
    /**
     * constructor
     * @param props
     * @param state
     */
    function DropDown(props, state) {
        var _this = this;
        _super.call(this, props, state);
        /**
         * This will find the width of the anchor tag and pass to parent for applying width style of menu ul
         */
        this.onDropDownClick = function (dropdownType) {
            var width = _this.refs.qigDropDown.getBoundingClientRect().width;
            _this.props.onClick(dropdownType, width);
        };
    }
    /**
     * Render component
     * @returns
     */
    DropDown.prototype.render = function () {
        var _this = this;
        return (React.createElement("div", {id: this.props.id + '_dropdown', title: this.props.title, className: classNames(this.props.className, { 'open': this.props.isOpen }, { 'close': this.props.isOpen === undefined ? false : !this.props.isOpen }), onClick: function () { _this.onDropDownClick(_this.props.dropDownType); }}, React.createElement("a", {ref: 'qigDropDown', href: 'javascript:void(0)', id: this.props.id + '_component', className: 'menu-button'}, React.createElement("span", {id: this.props.id + '_items'}, " ", this.props.selectedItem, " "), React.createElement("span", {className: 'sprite-icon menu-arrow-icon'})), React.createElement(List, {key: 'key_drop_down_items', onSelect: this.props.onSelect, items: this.props.items, style: this.props.style})));
    };
    return DropDown;
}(pureRenderComponent));
module.exports = DropDown;
//# sourceMappingURL=dropdown.js.map