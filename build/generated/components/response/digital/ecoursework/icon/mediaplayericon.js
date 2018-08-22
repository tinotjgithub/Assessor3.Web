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
 * React component class for Toolbar Icons represented in SVG format.
 */
var MediaPlayerIcon = (function (_super) {
    __extends(MediaPlayerIcon, _super);
    /**
     * @constructor
     */
    function MediaPlayerIcon(props, state) {
        _super.call(this, props, state);
    }
    /**
     * Render method
     */
    MediaPlayerIcon.prototype.render = function () {
        var style = {};
        if (this.props.style !== undefined && this.props.style !== '') {
            style = this.props.style;
        }
        return (React.createElement("g", {id: this.props.id, key: 'key_' + this.props.id, style: style, dangerouslySetInnerHTML: this.createMarkup(this.props.svgImageData)}));
    };
    /**
     * createMarkup method
     */
    MediaPlayerIcon.prototype.createMarkup = function (svgImageData) {
        return {
            __html: svgImageData
        };
    };
    return MediaPlayerIcon;
}(pureRenderComponent));
module.exports = MediaPlayerIcon;
//# sourceMappingURL=mediaplayericon.js.map