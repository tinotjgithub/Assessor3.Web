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
 * RotateAntiClockWise class
 * @param {any} any
 * @param {any} any
 * @returns
 */
var RotateAntiClockWise = (function (_super) {
    __extends(RotateAntiClockWise, _super);
    /**
     * Constructor for rotateanticlockwise
     * @param props
     * @param state
     */
    function RotateAntiClockWise(props, state) {
        _super.call(this, props, state);
    }
    /**
     * Render component
     */
    RotateAntiClockWise.prototype.render = function () {
        var svgStyle = {
            pointerEvents: 'none'
        };
        return (React.createElement("a", {onClick: this.props.onRotateAntiClockWise, id: 'rotate-left', className: 'rotate-right-icon', title: this.props.title}, React.createElement("span", {className: 'svg-icon', style: svgStyle}, React.createElement("svg", {viewBox: '0 0 32 32', className: 'icon-rotate-left'}, React.createElement("use", {xlinkHref: '#icon-rotate-left'})))));
    };
    return RotateAntiClockWise;
}(pureRenderComponent));
module.exports = RotateAntiClockWise;
//# sourceMappingURL=rotateanticlockwise.js.map