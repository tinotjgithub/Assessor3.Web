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
var qigvalidationHelper = require('../utility/qigselector/qigselectorvalidationhelper');
var classNames = require('classnames');
/**
 * Class for the Target Submit section
 */
var TargetProgressCountIndicator = (function (_super) {
    __extends(TargetProgressCountIndicator, _super);
    /**
     * constructor
     * @param props
     * @param state
     */
    function TargetProgressCountIndicator(props, state) {
        _super.call(this, props, state);
        this.qigHelper = new qigvalidationHelper();
    }
    /**
     * Render method for Qig group.
     */
    TargetProgressCountIndicator.prototype.render = function () {
        if (this.props.qigValidationResult.displayTarget) {
            var closedResponsesCount = 0;
            var maximumMarkingLimit = 0;
            if (this.props.isAggregatedTarget) {
                var validationResult = this.props.qigValidationResult;
                // For the aggregated qig display the aggregated counts.
                closedResponsesCount = validationResult.aggregatedSubmittedResponsesCount;
                maximumMarkingLimit = validationResult.aggregatedMaxMarkingLimit;
            }
            else {
                maximumMarkingLimit = this.props.currentMarkingTarget.maximumMarkingLimit;
                closedResponsesCount = this.qigHelper.findSubmittedResponsesCount(this.props.directedRemarkMarkingTargets, this.props.currentMarkingTarget);
            }
            var childClassName = this.props.isAggregatedTarget ? 'grey-text' : null;
            return (React.createElement("div", {key: this.props.id + '_submittedTargetSection', className: 'submitted-holder small-text middle-content-right'}, React.createElement("span", {id: this.props.id + '_submittedTargetText', className: childClassName}, localeStore.instance.TranslateText('marking.worklist.left-panel.submitted-count-label') + ' '), React.createElement("span", {id: this.props.id + '_submittedTargetValue'}, closedResponsesCount + '/' + maximumMarkingLimit)));
        }
        else {
            return null;
        }
    };
    return TargetProgressCountIndicator;
}(pureRenderComponent));
module.exports = TargetProgressCountIndicator;
//# sourceMappingURL=targetprogresscountindicator.js.map