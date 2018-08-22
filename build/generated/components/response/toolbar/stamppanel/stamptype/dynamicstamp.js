"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
/* tslint:disable:no-unused-variable */
var React = require('react');
var StampBase = require('../../../annotations/stampbase');
var colouredAnnotationsHelper = require('../../../../../utility/stamppanel/colouredannotationshelper');
var classNames = require('classnames');
var enums = require('../../../../utility/enums');
/**
 * React component class for Dynamic Stamp.
 */
var DynamicStamp = (function (_super) {
    __extends(DynamicStamp, _super);
    /**
     * @constructor
     */
    function DynamicStamp(props) {
        _super.call(this, props, null);
    }
    /**
     * Render method
     */
    DynamicStamp.prototype.render = function () {
        var style = {};
        style.top = this.props.topPos != null && this.props.topPos !== undefined ? this.props.topPos : style.top;
        style.left = this.props.leftPos != null && this.props.leftPos !== undefined ? this.props.leftPos : style.left;
        return (React.createElement("span", {className: 'svg-icon', id: this.props.uniqueId, "data-stamp": this.props.stampData.stampId, "data-token": this.props.clientToken}, React.createElement("svg", {viewBox: '0 0 32 32', className: this.props.id, style: style}, React.createElement("g", {fill: this.props.color ? this.props.color :
            colouredAnnotationsHelper.createAnnotationStyle(this.props.annotationData, enums.DynamicAnnotation.None).fill}, React.createElement("use", {xlinkHref: '#' + this.props.id})))));
    };
    return DynamicStamp;
}(StampBase));
module.exports = DynamicStamp;
//# sourceMappingURL=dynamicstamp.js.map