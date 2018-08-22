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
var enums = require('../../../utility/enums');
/**
 * FitWidth class
 * @param {any} any
 * @param {any} any
 * @returns
 */
var FitWidth = (function (_super) {
    __extends(FitWidth, _super);
    /**
     * Constructor Fitwidth
     * @param props
     * @param state
     */
    function FitWidth(props, state) {
        var _this = this;
        _super.call(this, props, state);
        this._switchFit = null;
        /**
         * fit to width button click function
         */
        this.switchFit = function (e) {
            _this.props.switchFit(enums.ZoomPreference.FitWidth);
            e.stopPropagation();
        };
        this._switchFit = this.switchFit.bind(this);
    }
    /**
     * Render component
     */
    FitWidth.prototype.render = function () {
        return (React.createElement("a", {onClick: this._switchFit, id: 'fit-width', title: this.props.title, className: this.props.active}, this.props.name));
    };
    return FitWidth;
}(pureRenderComponent));
module.exports = FitWidth;
//# sourceMappingURL=fitwidth.js.map