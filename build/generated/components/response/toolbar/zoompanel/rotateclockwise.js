"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
/* tslint:disable:no-unused-variable */
var React = require('react');
/* tslint:enable:no-unused-variable */
var pureRenderComponent = require('../../../base/purerendercomponent');
/**
 * RotateClockWise class
 * @param {any} any
 * @param {any} any
 * @returns
 */
var RotateClockWise = (function (_super) {
    __extends(RotateClockWise, _super);
    /**
     * Constructor for RotateClockwise
     * @param props
     * @param state
     */
    function RotateClockWise(props, state) {
        _super.call(this, props, state);
    }
    /**
     * Render component
     */
    RotateClockWise.prototype.render = function () {
        var svgStyle = {
            pointerEvents: 'none'
        };
        return (React.createElement("a", {onClick: this.props.onRotateClockWise, id: 'rotate-right', className: 'rotate-left-icon', title: this.props.title}, React.createElement("span", {className: 'svg-icon', style: svgStyle}, React.createElement("svg", {viewBox: '0 0 32 32', className: 'icon-rotate-right'}, React.createElement("use", {xlinkHref: '#icon-rotate-right'})))));
    };
    return RotateClockWise;
}(pureRenderComponent));
module.exports = RotateClockWise;
//# sourceMappingURL=rotateclockwise.js.map