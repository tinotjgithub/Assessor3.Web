"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
/* tslint:disable:no-unused-variable */
var React = require('react');
var TabContent = require('./tabcontent');
var pureRenderComponent = require('../../base/purerendercomponent');
/**
 * Represents the Tab content container Compoent
 */
var TabContentContainer = (function (_super) {
    __extends(TabContentContainer, _super);
    /**
     * @constructor
     */
    function TabContentContainer(props, state) {
        _super.call(this, props, state);
    }
    /**
     * Render method for Tab content container.
     */
    TabContentContainer.prototype.render = function () {
        var _this = this;
        var tabContents = [];
        this.props.tabContents.map(function (tabItem) {
            tabContents.push(React.createElement(TabContent, {renderedOn: _this.props.renderedOn, index: tabItem.index, key: 'tabContentItem_' + tabItem.index, class: tabItem.class, isSelected: tabItem.isSelected, id: tabItem.id, content: tabItem.content}));
        });
        return (React.createElement("div", {className: 'tab-content-holder', key: 'tab_container_key', id: 'tab_container'}, tabContents));
    };
    return TabContentContainer;
}(pureRenderComponent));
module.exports = TabContentContainer;
//# sourceMappingURL=tabcontentcontainer.js.map