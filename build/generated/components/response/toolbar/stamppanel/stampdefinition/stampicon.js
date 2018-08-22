"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
/* tslint:disable:no-unused-variable */
var React = require('react');
var pureRenderComponent = require('../../../../base/purerendercomponent');
/**
 * React component class for Stamp Icons represented in SVG format.
 */
var StampIcon = (function (_super) {
    __extends(StampIcon, _super);
    /**
     * @constructor
     */
    function StampIcon(props, state) {
        _super.call(this, props, state);
    }
    /**
     * Render method
     */
    StampIcon.prototype.render = function () {
        var _svgImageData = this.props.svgImageData;
        if (this.props.isEdge) {
            _svgImageData = '<svg viewBox="0 0 32 32" preserveAspectRatio="xMidYMid meet">' + _svgImageData + '</svg>';
        }
        return (React.createElement("g", {id: this.props.id, key: 'key_' + this.props.id, dangerouslySetInnerHTML: this.createMarkup(_svgImageData)}));
    };
    /**
     * Create markUp
     */
    StampIcon.prototype.createMarkup = function (svgImageData) {
        return {
            __html: svgImageData
        };
    };
    return StampIcon;
}(pureRenderComponent));
module.exports = StampIcon;
//# sourceMappingURL=stampicon.js.map