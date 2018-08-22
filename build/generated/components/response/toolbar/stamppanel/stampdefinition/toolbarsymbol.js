"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
/* tslint:disable:no-unused-variable */
var React = require('react');
var pureRenderComponent = require('../../../../base/purerendercomponent');
var OVERLAY_POINT = 'overlay-point-svg';
/**
 * React component class for Toolbar symbols
 */
var ToolbarSymbol = (function (_super) {
    __extends(ToolbarSymbol, _super);
    function ToolbarSymbol(props, state) {
        _super.call(this, props, state);
    }
    /**
     * The render method
     */
    ToolbarSymbol.prototype.render = function () {
        return (React.createElement("symbol", {id: this.props.id, key: 'Key' + this.props.id, className: this.props.className, version: this.props.className.indexOf(OVERLAY_POINT) > -1 ? '1.1' : null, xmlns: this.props.className.indexOf(OVERLAY_POINT) > -1 ? 'http://www.w3.org/2000/svg' : null, dangerouslySetInnerHTML: this.createMarkup(this.props.symbolData)}));
    };
    /**
     * createMarkup method
     */
    ToolbarSymbol.prototype.createMarkup = function (symbolData) {
        return {
            __html: symbolData
        };
    };
    return ToolbarSymbol;
}(pureRenderComponent));
module.exports = ToolbarSymbol;
//# sourceMappingURL=toolbarsymbol.js.map