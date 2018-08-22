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
var enums = require('../../../utility/enums');
/**
 * FitHeight class
 * @param {any} any
 * @param {any} any
 * @returns
 */
var FitHeight = (function (_super) {
    __extends(FitHeight, _super);
    /**
     * Constructor for Fitheight
     * @param props
     * @param state
     */
    function FitHeight(props, state) {
        var _this = this;
        _super.call(this, props, state);
        this._switchFit = null;
        /**
         * fit to height button Click Function
         */
        this.switchFit = function (e) {
            e.stopPropagation();
            _this.props.switchFit(enums.ZoomPreference.FitHeight);
        };
        this._switchFit = this.switchFit.bind(this);
    }
    /**
     * Render component
     */
    FitHeight.prototype.render = function () {
        var fitHeight = localeStore.instance.TranslateText('marking.response.zoom-rotate-panel.zoom-fit-height');
        return (React.createElement("a", {onClick: this._switchFit, id: 'fit-height', title: this.props.title, className: this.props.active}, this.props.name));
    };
    return FitHeight;
}(pureRenderComponent));
module.exports = FitHeight;
//# sourceMappingURL=fitheight.js.map