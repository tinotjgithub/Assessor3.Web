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
var localeStore = require('../../../../stores/locale/localestore');
var DiscardResponse = (function (_super) {
    __extends(DiscardResponse, _super);
    /**
     *
     * @param props Constructor
     * @param state
     */
    function DiscardResponse(props, state) {
        _super.call(this, props, state);
        this.onClickDiscardResponse = null;
        this.onDiscardPopupCancelClick = null;
        this.state = {
            renderedOn: Date.now()
        };
    }
    /**
     * Render method
     */
    DiscardResponse.prototype.render = function () {
        var _this = this;
        var svgStyle = {
            pointerEvents: 'none'
        };
        return (React.createElement("div", null, React.createElement("li", {onClick: function () { _this.props.onIconClick(); }, className: 'discard-icon'}, React.createElement("a", {href: 'javascript:void(0)', title: localeStore.instance
            .TranslateText('standardisation-setup.standardisation-setup-worklist.discard-icon.title')}, React.createElement("span", {className: 'svg-icon'}, React.createElement("svg", {viewBox: '0 0 32 32', className: 'discard-icon', style: svgStyle}, React.createElement("g", {id: 'tool-delete'}, React.createElement("svg", {viewBox: '0 0 32 32', preserveAspectRatio: 'xMidYMid meet'}, React.createElement("g", null, React.createElement("polygon", {className: 'st0', points: '20,7 20,5 12,5 12,7 7,7 7,9 25,9 25,7 	'}), React.createElement("path", {className: 'st0', d: 'M8,24c0,1.7,1.3,3,3,3h10c1.7,0,3-1.3,3-3V10H8V24z M10,12h12v13H10V12z'}), React.createElement("rect", {x: '12', y: '15', className: 'st0', width: '2', height: '8'}), React.createElement("rect", {x: '18', y: '15', className: 'st0', width: '2', height: '8'}))))))))));
    };
    return DiscardResponse;
}(pureRenderComponent));
module.exports = DiscardResponse;
//# sourceMappingURL=discardresponse.js.map