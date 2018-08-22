"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
/* tslint:disable:no-unused-variable */
var React = require('react');
var PureRenderComponent = require('../../base/purerendercomponent');
var localeStore = require('../../../stores/locale/localestore');
var enums = require('../../utility/enums');
var markerOperationModeFactory = require('../../utility/markeroperationmode/markeroperationmodefactory');
var AccuracyIndicator = (function (_super) {
    __extends(AccuracyIndicator, _super);
    /**
     * Constructor for Accuracy indicator
     * @param props
     */
    function AccuracyIndicator(props) {
        _super.call(this, props, null);
    }
    /**
     * Render component
     */
    AccuracyIndicator.prototype.render = function () {
        this.getAccuracy(this.props.accuracyIndicator);
        var accuracy = this.props.isTileView ?
            (React.createElement("div", {className: 'tolerance-level small-text', id: this.props.id + '_accuracyIndicator'}, this.accuracyType)) :
            (this.props.isInMarkSchemePanel ?
                (React.createElement("div", {title: this.title, className: 'tolerance-level small-text'}, this.accuracyType)) : (React.createElement("div", {className: 'col wl-tolerance', title: this.title}, React.createElement("div", {className: 'col-inner'}, React.createElement("div", {id: this.props.id + '_accuracyIndicator', className: 'tolerance-level small-text'}, this.accuracyType)))));
        return (accuracy);
    };
    /**
     * Get the Accuracy indicator type
     * @param AccuracyIndicatorType
     */
    AccuracyIndicator.prototype.getAccuracy = function (indicatorType) {
        switch (indicatorType) {
            case enums.AccuracyIndicatorType.Accurate:
            case enums.AccuracyIndicatorType.AccurateNR:
                this.accuracyType = localeStore.instance.TranslateText('generic.accuracy-indicators.accurate');
                this.title = markerOperationModeFactory.operationMode.accurateAccuracyIndicatorTitle;
                break;
            case enums.AccuracyIndicatorType.OutsideTolerance:
            case enums.AccuracyIndicatorType.OutsideToleranceNR:
                this.accuracyType = localeStore.instance.TranslateText('generic.accuracy-indicators.inaccurate');
                this.title = markerOperationModeFactory.operationMode.inaccurateAccuracyIndicatorTitle;
                break;
            case enums.AccuracyIndicatorType.WithinTolerance:
            case enums.AccuracyIndicatorType.WithinToleranceNR:
                this.accuracyType = localeStore.instance.TranslateText('generic.accuracy-indicators.in-tolerance');
                this.title = markerOperationModeFactory.operationMode.intoleranceAccuracyIndicatorTitle;
                break;
            default:
                this.accuracyType = '';
                this.title = '';
                break;
        }
        return this.accuracyType;
    };
    return AccuracyIndicator;
}(PureRenderComponent));
module.exports = AccuracyIndicator;
//# sourceMappingURL=accuracyindicator.js.map