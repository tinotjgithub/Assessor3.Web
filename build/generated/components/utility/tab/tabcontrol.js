"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
/// <reference path='typings/tabheaderdata.ts' />
/* tslint:disable:no-unused-variable */
var React = require('react');
var TabHeader = require('./tabheader');
var pureRenderComponent = require('../../base/purerendercomponent');
/**
 * Represents the TabControl Compoent
 */
var TabControl = (function (_super) {
    __extends(TabControl, _super);
    /**
     * @constructor
     */
    function TabControl(props, state) {
        _super.call(this, props, state);
    }
    /**
     * Render method for TabControl.
     */
    TabControl.prototype.render = function () {
        var _this = this;
        var tabHeaders = [];
        this.props.tabHeaders.map(function (tabItem) {
            tabHeaders.push(React.createElement(TabHeader, {index: tabItem.index, key: 'tabHeaderItem_' + tabItem.key, id: 'tabHeaderItem_' + tabItem.id, class: tabItem.class, isSelected: tabItem.isSelected, isDisabled: tabItem.isDisabled, tabNavigation: tabItem.tabNavigation, headerCount: tabItem.headerCount === undefined ? 0 : tabItem.headerCount, isHeaderCountNotRequired: tabItem.isHeaderCountNotRequired === undefined
                ? false : tabItem.isHeaderCountNotRequired, headerText: tabItem.headerText, selectTab: _this.props.selectTab}));
        });
        return (React.createElement("ul", {className: 'tab-nav', role: 'tablist'}, tabHeaders));
    };
    return TabControl;
}(pureRenderComponent));
module.exports = TabControl;
//# sourceMappingURL=tabcontrol.js.map