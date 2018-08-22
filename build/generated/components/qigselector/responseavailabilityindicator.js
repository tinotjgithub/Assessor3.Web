"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
/* tslint:disable:no-unused-variable */
var React = require('react');
var pureRenderComponent = require('../base/purerendercomponent');
var localeStore = require('../../stores/locale/localestore');
var aggregatedQigValidationResult = require('../../stores/qigselector/aggregatedqigvalidationresult');
/**
 * Class for the Response Available Indicator section
 */
var ResponseAvailabilityIndicator = (function (_super) {
    __extends(ResponseAvailabilityIndicator, _super);
    /**
     * constructor
     * @param props
     * @param state
     */
    function ResponseAvailabilityIndicator(props, state) {
        _super.call(this, props, state);
    }
    /**
     * Render method for Respons eAvailable Indicator.
     */
    ResponseAvailabilityIndicator.prototype.render = function () {
        if (this.props.qigValidationResult.displayOpenResponseIndicator) {
            return (React.createElement("span", {title: this.getTooltipTitle, key: this.props.id + '_downloadedIndicator', id: this.props.id + '_downloadedIndicator', className: 'sprite-icon downloaded-indicator-icon not-clickable'}));
        }
        else if (this.props.qigValidationResult.displayResponseAvailableIndicator) {
            return (React.createElement("span", {title: localeStore.instance.TranslateText('home.qig-data.responses-available-icon-tooltip'), key: this.props.id + '_downloadIndicator', id: this.props.id + '_downloadIndicator', className: 'sprite-icon download-indicator-icon not-clickable'}));
        }
        else {
            return null;
        }
    };
    Object.defineProperty(ResponseAvailabilityIndicator.prototype, "getTooltipTitle", {
        /**
         * Get the tooltip description When the mouse pointer is positioned over Responses Available indicator.
         */
        get: function () {
            var validationResult;
            // Casting to the type of validation result.
            if (this.props.qigValidationResult instanceof aggregatedQigValidationResult) {
                validationResult = this.props.qigValidationResult;
            }
            else {
                validationResult = this.props.qigValidationResult;
            }
            if (validationResult.isSimulationMode) {
                return localeStore.instance.TranslateText('home.qig-data.responses-available-simulation-icon-tooltip');
            }
            else {
                return localeStore.instance.TranslateText('home.qig-data.responses-in-worklist-icon-tooltip');
            }
        },
        enumerable: true,
        configurable: true
    });
    return ResponseAvailabilityIndicator;
}(pureRenderComponent));
module.exports = ResponseAvailabilityIndicator;
//# sourceMappingURL=responseavailabilityindicator.js.map