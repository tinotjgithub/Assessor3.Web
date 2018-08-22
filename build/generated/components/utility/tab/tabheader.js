"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
/* tslint:disable:no-unused-variable */
var React = require('react');
var pureRenderComponent = require('../../base/purerendercomponent');
var classNames = require('classnames');
/* tslint:disable:no-reserved-keywords */
/**
 * Represents the Tab header Compoent
 */
var TabHeader = (function (_super) {
    __extends(TabHeader, _super);
    /**
     * @constructor
     */
    function TabHeader(props, state) {
        _super.call(this, props, state);
        this.handleClick = this.handleClick.bind(this);
    }
    /**
     * Render method for Tab header.
     */
    TabHeader.prototype.render = function () {
        return (React.createElement("li", {className: this.getClassNames(), id: this.props.id, key: 'key_' + this.props.id, role: 'tab', "aria-selected": this.props.isSelected, onClick: this.handleClick}, React.createElement("a", {href: 'javascript:void(0)', "data-tab-nav": this.props.tabNavigation, "aria-controls": this.props.tabNavigation, className: 'arrow-link'}, React.createElement("span", {className: 'tab-text-holder'}, this.HeaderCount(), React.createElement("span", {className: 'tab-text'}, this.props.headerText)))));
    };
    /**
     * This method will update the state.
     */
    TabHeader.prototype.handleClick = function () {
        if (this.props.isDisabled !== true) {
            this.props.selectTab(this.props.index);
        }
    };
    /**
     * This method will return count visible status
     */
    TabHeader.prototype.HeaderCount = function () {
        return this.props.isHeaderCountNotRequired ? null :
            (React.createElement("span", {className: 'response-count count'}, this.props.headerCount));
    };
    /**
     * This method will return class name depend on disable required status
     */
    TabHeader.prototype.getClassNames = function () {
        return this.props.isHeaderCountNotRequired ? (classNames(this.props.class, { ' active': this.props.isSelected })) :
            (classNames(this.props.class, { ' active': this.props.isSelected }, { ' disabled': this.props.isDisabled }));
    };
    return TabHeader;
}(pureRenderComponent));
module.exports = TabHeader;
//# sourceMappingURL=tabheader.js.map