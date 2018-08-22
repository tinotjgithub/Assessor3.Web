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
 * Represents the Tab Content Compoent
 */
var TabContent = (function (_super) {
    __extends(TabContent, _super);
    /**
     * @constructor
     */
    function TabContent(props, state) {
        _super.call(this, props, state);
    }
    /**
     * Render method for Tab Content.
     */
    TabContent.prototype.render = function () {
        return (React.createElement("div", {className: classNames(this.props.class, { ' active': this.props.isSelected }), key: 'key_' + this.props.id, id: this.props.id}, this.props.content));
    };
    return TabContent;
}(pureRenderComponent));
module.exports = TabContent;
//# sourceMappingURL=tabcontent.js.map