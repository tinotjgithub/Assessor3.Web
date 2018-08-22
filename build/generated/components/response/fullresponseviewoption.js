"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
/* tslint:disable:no-unused-variable */
var React = require('react');
/* tslint:enable:no-unused-variable */
var pureRenderComponent = require('../base/purerendercomponent');
/**
 * MarkingViewButton class
 * @param {Props} props
 * @param {any} any
 * @returns
 */
var FullResponseViewOption = (function (_super) {
    __extends(FullResponseViewOption, _super);
    /**
     * @constructor
     */
    function FullResponseViewOption(props, state) {
        _super.call(this, props, state);
        this.changeViewClick = this.changeViewClick.bind(this);
    }
    /**
     * Render method
     */
    FullResponseViewOption.prototype.render = function () {
        return (React.createElement("li", {className: this.props.isActive === true ? 'active' : ''}, React.createElement("a", {className: 'page-view-link', onClick: this.changeViewClick, title: this.props.changeViewTooltip}, React.createElement("span", {className: this.props.changeViewIconClass}), React.createElement("span", {className: 'view-icon-text'}, this.props.changeViewIconText))));
    };
    /**
     * Handling the respose view option click.
     * @param {any} evnt
     */
    FullResponseViewOption.prototype.changeViewClick = function (evnt) {
        this.props.onChangeViewClick();
    };
    return FullResponseViewOption;
}(pureRenderComponent));
module.exports = FullResponseViewOption;
//# sourceMappingURL=fullresponseviewoption.js.map