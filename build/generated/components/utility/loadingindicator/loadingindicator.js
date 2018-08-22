"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
/* tslint:disable:no-unused-variable */
var React = require('react');
/* tslint:disable:no-unused-variable */
var pureRenderComponent = require('../../base/purerendercomponent');
var classNames = require('classnames');
/**
 * Class for LoadingIndicator component.
 */
var LoadingIndicator = (function (_super) {
    __extends(LoadingIndicator, _super);
    /**
     * @constructor
     */
    function LoadingIndicator(props) {
        _super.call(this, props, null);
    }
    /**
     * Render method
     */
    LoadingIndicator.prototype.render = function () {
        if (this.props.isOnline === false) {
            return null;
        }
        else {
            return (React.createElement("div", {className: this.props.cssClass}, React.createElement("span", {className: classNames('loader', (this.props.isFrv ? 'middle-content' : 'text-middle'))}, React.createElement("span", {className: 'dot'}), React.createElement("span", {className: 'dot'}), React.createElement("span", {className: 'dot'}))));
        }
    };
    return LoadingIndicator;
}(pureRenderComponent));
module.exports = LoadingIndicator;
//# sourceMappingURL=loadingindicator.js.map