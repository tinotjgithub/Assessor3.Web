"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
/* tslint:disable:no-unused-variable */
var React = require('react');
var StampBase = require('../stampbase');
var classNames = require('classnames');
/**
 * React component class for Tools Stamp.
 */
var ToolsStamp = (function (_super) {
    __extends(ToolsStamp, _super);
    /**
     * @constructor
     */
    function ToolsStamp(props) {
        _super.call(this, props, null);
    }
    /**
     * Render method
     */
    ToolsStamp.prototype.render = function () {
        var style = {};
        style.top = this.props.topPos != null && this.props.topPos !== undefined ? this.props.topPos : style.top;
        style.left = this.props.leftPos != null && this.props.leftPos !== undefined ? this.props.leftPos : style.left;
        return (React.createElement("span", {className: 'svg-icon', id: this.props.uniqueId, "data-annotation-relevance": this.isPreviousAnnotation ? 'previous' : 'current'}, React.createElement("svg", {viewBox: '0 0 32 32', className: this.props.id, style: style, "data-annotation-relevance": this.isPreviousAnnotation ? 'previous' : 'current'}, React.createElement("use", {xlinkHref: '#' + this.props.id, "data-annotation-relevance": this.isPreviousAnnotation ? 'previous' : 'current'}))));
    };
    return ToolsStamp;
}(StampBase));
module.exports = ToolsStamp;
//# sourceMappingURL=toolsstamp.js.map